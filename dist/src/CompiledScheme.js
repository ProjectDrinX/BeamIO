"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const encoder_1 = __importDefault(require("./encoder"));
const main_1 = require("../main");
function genParserStep(scheme, types, counter, getter = false) {
    let str = '';
    const deep = {};
    for (const k in scheme) {
        if (typeof scheme[k] === 'object')
            deep[k] = scheme[k];
        else if (typeof scheme[k] === 'boolean') {
            if (!getter)
                str += `${k}:b[${counter.b}],`;
            else
                str += `get ${k}(){return b[${counter.b}]},`;
            counter.incB();
        }
        else {
            if (!getter)
                str += `${k}:v[${counter.v}],`;
            else
                str += `get ${k}(){return v[${counter.v}]},`;
            types.push(scheme[k]);
            counter.incV();
        }
    }
    for (const k in deep)
        str += `${k}:{${genParserStep(deep[k], types, counter, getter)}},`;
    return str;
}
function genParser(scheme = {}, getter = false) {
    const counter = {
        v: 0,
        incV() { this.v += 1; },
        b: 0,
        incB() { this.b += 1; },
    };
    const types = [];
    // @ts-ignore
    // eslint-disable-next-line no-new-func
    return [new Function('v', 'b', `return{${genParserStep(scheme, types, counter, getter)}}`), types];
}
// eslint-disable-next-line func-names, space-before-blocks, no-empty-function
const GeneratorFunction = Object.getPrototypeOf(function* () { }).constructor;
function genStamper(scheme = {}) {
    let code = '';
    let hasBool = false;
    const deepS = {};
    for (const k in scheme) {
        if (typeof scheme[k] === 'object')
            deepS[k] = scheme[k];
        else
            code += `yield[${scheme[k]},v.${k}];`;
        if (!hasBool && scheme[k] === main_1.Type.Boolean)
            hasBool = true;
    }
    while (Object.keys(deepS).length !== 0) {
        for (const k in deepS) {
            for (const k2 in deepS[k]) {
                if (typeof deepS[k][k2] === 'object')
                    deepS[`${k}.${k2}`] = deepS[k][k2];
                else
                    code += `yield[${deepS[k][k2]},v.${k}.${k2}];`;
                if (!hasBool && deepS[k][k2] === main_1.Type.Boolean)
                    hasBool = true;
            }
            delete deepS[k];
        }
    }
    return [new GeneratorFunction('v', code), hasBool];
}
class CompiledScheme {
    ID;
    hasBool = false;
    types = [];
    parser;
    stamper;
    constructor(ID, Scheme = {}, getter = false) {
        this.ID = ID;
        [this.parser, this.types] = genParser(Scheme, getter);
        [this.stamper, this.hasBool] = genStamper(Scheme);
    }
    *genIterator(DeepObj) {
        const stamper = this.stamper(DeepObj);
        const bools = [];
        for (const chunk of stamper) {
            switch (chunk[0]) {
                case main_1.Type.Boolean:
                    bools.push(chunk[1]);
                    break;
                case main_1.Type.Number:
                    yield encoder_1.default.number.encode(chunk[1]);
                    break;
                default:
                    yield chunk[1];
                    break;
            }
        }
        yield encoder_1.default.boolList.encode(bools);
    }
    parse(chunks) {
        const bools = (this.hasBool ? chunks[chunks.length - 1] : '');
        for (const i in chunks) {
            // eslint-disable-next-line no-param-reassign
            if (this.types[i] === main_1.Type.Number)
                chunks[i] = encoder_1.default.number.decode(chunks[i]);
        }
        return this.parser(chunks, encoder_1.default.boolList.decode(bools));
    }
}
exports.default = CompiledScheme;
