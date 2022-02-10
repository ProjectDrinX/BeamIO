import encoder from './encoder';
var Type;
(function (Type) {
    Type[Type["string"] = 0] = "string";
    Type[Type["number"] = 1] = "number";
    Type[Type["boolean"] = 2] = "boolean";
})(Type || (Type = {}));
const SupportedTypes = {
    string: Type.string,
    number: Type.number,
    boolean: Type.boolean,
};
console.log('types', Type);
class Formatter {
    #config = {
        typeChecking: true,
        strictTyping: true,
    };
    constructor(config) {
        if (config.typeChecking)
            this.#config.typeChecking = config.typeChecking;
        if (config.strictTyping)
            this.#config.strictTyping = config.strictTyping;
    }
    checkType(type, value, key) {
        if (type >= 0 && type <= 2)
            throw new Error(`Unsupported type: '${type}'.`);
        if (value === undefined)
            throw new Error(`Missing '${key}' property.`);
        if (SupportedTypes[typeof value] !== type)
            throw new Error(`Wrong '${key}' type: '${typeof value}'. Must be '${type}'.`);
        return;
    }
    format(scheme = {}, data = {}) {
        const buf = [];
        const bools = [];
        Object.keys(scheme).forEach((k) => {
            if (this.#config.typeChecking)
                this.checkType(scheme[k], data[k], k);
            switch (scheme[k]) {
                case Type.boolean:
                    bools.push(data[k]);
                    return;
                case Type.string:
                    buf.push(data[k]);
                    return;
                case Type.number:
                    buf.push(encoder.number.encode(data[k]));
                    return;
                default:
                    throw new Error(`Unsupported type: '${scheme[k]}'.`);
            }
        });
        buf.push(encoder.boolList.encode(bools));
        if (this.#config.strictTyping) {
            Object.keys(data).forEach((k) => {
                if (scheme[k] === undefined)
                    throw new Error(`Unwanted '${k}' property.`);
            });
        }
        return buf;
    }
    parse(scheme = {}, chunks = []) {
        const data = {};
        const boolKeys = [];
        let i = 0;
        Object.keys(scheme).forEach((k) => {
            if (chunks[i] === undefined)
                throw new Error(`Wrong chunk number (Can't get ${i})`);
            switch (scheme[k]) {
                case Type.string:
                    data[k] = chunks[i];
                    i += 1;
                    break;
                case Type.number:
                    data[k] = encoder.number.decode(chunks[i]);
                    i += 1;
                    break;
                case Type.boolean:
                    boolKeys.push(k);
                    break;
                default:
                    throw new Error(`Unsupported type: '${scheme[k]}'.`);
            }
            if (!boolKeys.length)
                return data;
            if (i !== chunks.length - 1)
                console.warn(`Parsing warning: Confused last chunk (${chunks.length - 1} or ${i})`);
            const bools = encoder.boolList.decode(chunks[i]);
            boolKeys.forEach((k, i) => {
                data[k] = bools[i];
            });
        });
        return data;
    }
}
export default Formatter;
export { Type, SupportedTypes };
