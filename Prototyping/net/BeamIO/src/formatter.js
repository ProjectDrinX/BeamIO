const encoder = require('./encoder');

/** @typedef {'string' | 'number' | 'boolean'} Type */

const TYPES = {
  /** @type {Type} */
  String: 'string',
  /** @type {Type} */
  Number: 'number',
  /** @type {Type} */
  Boolean: 'boolean',
};

/** @type {Type[]} */
const SupportedTypes = Object.values(TYPES);

class Formatter {
  /**
   * @typedef {Object} FormatterConfig
   * @prop {boolean} typeChecking Set it to false to disable the type checking
   * @prop {boolean} strictTyping Strict typing mode, useless in production (Default: false)
   */

  /** @type {FormatterConfig} */
  #config = {
    typeChecking: true,
    strictTyping: true,
  };

  checkType(type, value, key) {
    if (!SupportedTypes.includes(type)) throw new Error(`Unsupported type: '${type}'.`);
    if (value === undefined) throw new Error(`Missing '${key}' property.`);
    if (typeof value !== type) throw new Error(`Wrong '${key}' type: '${typeof value}'. Must be '${type}'.`);
    return;
  }

  /**
   * @param {FormatterConfig} config 
   */
  constructor(config = {}) {
    if (config.typeChecking) this.#config.typeChecking = config.typeChecking;
    if (config.strictTyping) this.#config.strictTyping = config.strictTyping;
  }

  /**
   * @param {Object<string, Type>} scheme
   * @param {Object<string, any>} data
   * @returns {string[]}
   */
  format(scheme = {}, data = {}) {
    const buf = [];
    const bools = [];

    Object.keys(scheme).forEach((k) => {
      if (this.#config.typeChecking) this.checkType(scheme[k], data[k], k);

      switch (scheme[k]) {
        case 'boolean':
          bools.push(data[k]);
          return;

        case 'string':
          buf.push(data[k]);
          return;

        case 'number':
          buf.push(encoder.number.encode(data[k]));
          return;
      
        default:
          throw new Error(`Unsupported type: '${type}'.`);
      }
    });

    buf.push(encoder.boolList.encode(bools));

    if (this.#config.strictTyping) {
      Object.keys(data).forEach((k) => {
        if (scheme[k] === undefined) throw new Error(`Unwanted '${k}' property.`);
      });
    }

    return buf;
  }

  /**
   * @param {Object<string, Type>} scheme
   * @param {string[]} chunks
   * @returns {Object<string, any>}
   */
  parse(scheme = {}, chunks = []) {
    const data = {};

    const boolKeys = [];
    let i = 0;

    Object.keys(scheme).forEach((k) => {
      if (chunks[i] === undefined) throw new Error(`Wrong chunk number (Can't get ${i})`);

      switch (scheme[k]) {
        case 'string':
          data[k] = chunks[i];
          i += 1;
          break;
          
        case 'number':
          data[k] = encoder.number.decode(chunks[i]);
          i += 1;
          break;

        case 'boolean':
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

module.exports = Formatter;
module.exports.TYPES = TYPES;
module.exports.SupportedTypes = SupportedTypes;
