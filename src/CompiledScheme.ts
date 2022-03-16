import encoder from './encoder';
import { Type } from '../main';

type TType = (string | number | boolean);
type Value = (string | number | boolean);

export interface DeepObject { [k: string]: (Value | DeepObject) }
export interface DeepScheme { [k: string]: (TType | DeepScheme) }

interface Counter {
  v: number,
  incV: () => void,
  b: number,
  incB: () => void,
}

function genParserStep(
  scheme: DeepScheme,
  types: TType[],
  counter: Counter,
  getter = false,
): string {
  let str = '';

  const deep: { [k: string]: Object } = {};
  for (const k in scheme) {
    if (typeof scheme[k] === 'object') deep[k] = scheme[k];
    else if (typeof scheme[k] === 'boolean') {
      if (!getter) str += `${k}:b[${counter.b}],`;
      else str += `get ${k}(){return b[${counter.b}]},`;
      counter.incB();
    } else {
      if (!getter) str += `${k}:v[${counter.v}],`;
      else str += `get ${k}(){return v[${counter.v}]},`;
      types.push(scheme[k] as TType);
      counter.incV();
    }
  }

  for (const k in deep) str += `${k}:{${genParserStep(deep[k] as DeepScheme, types, counter, getter)}},`;

  return str;
}

// eslint-disable-next-line no-unused-vars
type Parser = (raw: Value[], bools: boolean[]) => DeepObject;

function genParser(scheme: DeepScheme = {}, getter = false): [Parser, TType[]] {
  const counter: Counter = {
    v: 0,
    incV() { this.v += 1; },
    b: 0,
    incB() { this.b += 1; },
  };

  const types: TType[] = [];
  // @ts-ignore
  // eslint-disable-next-line no-new-func
  return [new Function('v', 'b', `return{${genParserStep(scheme, types, counter, getter)}}`), types];
}

// eslint-disable-next-line func-names, space-before-blocks, no-empty-function
const GeneratorFunction = Object.getPrototypeOf(function* (){}).constructor;

// eslint-disable-next-line no-unused-vars
type Stamper = (DeepObj: DeepObject) => Generator<[TType, Value]>;

function genStamper(scheme: DeepScheme = {}): [Stamper, boolean] {
  let code = '';
  let hasBool = false;

  const deepS: { [k: string]: any } = {};

  for (const k in scheme) {
    if (typeof scheme[k] === 'object') deepS[k] = scheme[k];
    else code += `yield[${scheme[k]},v.${k}];`;
    if (!hasBool && scheme[k] === Type.Boolean) hasBool = true;
  }

  while (Object.keys(deepS).length !== 0) {
    for (const k in deepS) {
      for (const k2 in deepS[k]) {
        if (typeof deepS[k][k2] === 'object') deepS[`${k}.${k2}`] = deepS[k][k2];
        else code += `yield[${deepS[k][k2]},v.${k}.${k2}];`;
        if (!hasBool && deepS[k][k2] === Type.Boolean) hasBool = true;
      }

      delete deepS[k];
    }
  }

  return [new GeneratorFunction('v', code), hasBool];
}

export default class CompiledScheme {
  ID: string;

  hasBool = false;

  types: TType[] = [];

  parser: Parser;

  stamper: Stamper;

  constructor(ID: string, Scheme: DeepScheme = {}, getter = false) {
    this.ID = ID;
    [this.parser, this.types] = genParser(Scheme, getter);
    [this.stamper, this.hasBool] = genStamper(Scheme);
  }

  * genIterator(DeepObj: DeepObject): Generator<string> {
    const stamper = this.stamper(DeepObj);
    const bools = [];
    for (const chunk of stamper) {
      switch (chunk[0]) {
        case Type.Boolean:
          bools.push(chunk[1] as boolean);
          break;
        case Type.Number:
          yield encoder.number.encode(chunk[1] as number);
          break;

        default:
          yield chunk[1] as string;
          break;
      }
    }

    yield encoder.boolList.encode(bools);
  }

  parse(chunks: Value[]): DeepObject {
    const bools = (this.hasBool ? chunks[chunks.length - 1] : '');
    for (const i in chunks) {
      // eslint-disable-next-line no-param-reassign
      if (this.types[i] === Type.Number) chunks[i] = encoder.number.decode(chunks[i] as string);
    }

    return this.parser(chunks, encoder.boolList.decode(bools as string));
  }
}
