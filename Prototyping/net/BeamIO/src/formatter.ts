import encoder from './encoder';

enum Type { 'String', 'Number', 'Boolean' };

const SupportedTypes: { [t: string]: Type } = {
  string: Type.String,
  number: Type.Number,
  boolean: Type.Boolean,
};

type Scheme = { [name: string]: Type };
type Value = (string | number | boolean);
type ObjData = { [key: string]: Value };

interface FormatterConfig {
  typeChecking: boolean,
  strictTyping: boolean,
}

interface FormatterConfigurator {
  /** Set it to false to disable the type checking */
  typeChecking?: boolean,
  /** Strict typing mode, useless in production (Default: false) */
  strictTyping?: boolean,
}

class Formatter {
  readonly config: FormatterConfig = {
    typeChecking: true,
    strictTyping: true,
  };

  constructor(config: FormatterConfigurator) {
    if (config.typeChecking) this.config.typeChecking = config.typeChecking;
    if (config.strictTyping) this.config.strictTyping = config.strictTyping;
  }

  checkType(type: Type, value: Value, key: string) {
    if (type < 0 || type > 2) throw new Error(`Unsupported type: '${type}'.`);
    if (value === undefined) throw new Error(`Missing '${key}' property.`);
    if (SupportedTypes[typeof value] !== type) throw new Error(`Wrong '${key}' type: '${typeof value}'. Must be '${type}'.`);
    return;
  }

  format(scheme: { [s: string]: Type; } = {}, data: { [s: string]: any; } = {}): string[] {
    const buf: string[] = [];
    const bools: boolean[] = [];

    Object.keys(scheme).forEach((k) => {
      if (this.config.typeChecking) this.checkType(scheme[k], data[k], k);

      switch (scheme[k]) {
        case Type.Boolean:
          bools.push(data[k]);
          return;

        case Type.String:
          buf.push(data[k]);
          return;

        case Type.Number:
          buf.push(encoder.number.encode(data[k]));
          return;
      
        default:
          throw new Error(`Unsupported type: '${scheme[k]}'.`);
      }
    });

    buf.push(encoder.boolList.encode(bools));

    if (this.config.strictTyping) {
      Object.keys(data).forEach((k) => {
        if (scheme[k] === undefined) throw new Error(`Unwanted '${k}' property.`);
      });
    }

    return buf;
  }

  parse(scheme: Scheme = {}, chunks: string[] = []): ObjData {
    const data: ObjData = {};

    const boolKeys: string[] = [];
    let i = 0;

    Object.keys(scheme).forEach((k) => {
      if (chunks[i] === undefined) throw new Error(`Wrong chunk number (Can't get ${i})`);

      switch (scheme[k]) {
        case Type.String:
          data[k] = chunks[i];
          i += 1;
          break;
          
        case Type.Number:
          data[k] = encoder.number.decode(chunks[i]);
          i += 1;
          break;

        case Type.Boolean:
          boolKeys.push(k);
          break;
      
        default:
          throw new Error(`Unsupported type: '${scheme[k]}'.`);
      }

      if (!boolKeys.length) return data;

      if (i !== chunks.length - 1) console.warn(`Parsing warning: Confused last chunk (${chunks.length - 1} or ${i})`);
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
