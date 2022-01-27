function getFirstConsCharIndex(char = '', text = '', i = 0) {
  while (text[i] === char) i -= 1;
  return i + 1;
}

class Protocol {
  /**
   * @typedef {Object} ProtocolConfig
   * @prop {string} CHAR_MAIN_SEP Main separator char
   * @prop {string} CHAR_ESCAPE Escape char
   */

  /** @type {ProtocolConfig} */
  #config = {
    CHAR_MAIN_SEP: '\x30',
    CHAR_ESCAPE: '\x31',
  };

  get config() {
    return this.#config;
  }

  /**
   * @param {ProtocolConfig} config Protocol config
   */
  constructor(config = {}) {
    if (config.CHAR_MAIN_SEP) this.#config.CHAR_MAIN_SEP = config.CHAR_MAIN_SEP;
    if (config.CHAR_ESCAPE) this.#config.CHAR_ESCAPE = config.CHAR_ESCAPE;

    this.encodeRawRegex = RegExp(`${this.#config.CHAR_ESCAPE}|${this.#config.CHAR_MAIN_SEP}`, 'g');
    this.decodeRawRegex = RegExp(`${this.#config.CHAR_ESCAPE}(${this.#config.CHAR_ESCAPE}|${this.#config.CHAR_MAIN_SEP})`, 'g');
  }

  encodeRaw(str = '') {
    return str.replace(this.encodeRawRegex, `${this.#config.CHAR_ESCAPE}$&`);
  }

  decodeRaw(str = '') {
    return str.replace(this.decodeRawRegex, '$1');
  }

  decode(packet = '') {
    const salt = packet[0].charCodeAt();
    const raw = packet
      .slice(1)
      .split('')
      .map((v) => String.fromCharCode((v.charCodeAt(0) - salt + 256) % 256))
      .join('');

    const decoded = [];
    let cur = 0;
    let sp = raw.indexOf(this.#config.CHAR_MAIN_SEP);
    let buff = '';

    while (sp !== -1) {
      buff += raw.slice(cur, sp);
      if (raw[sp - 1] !== this.#config.CHAR_ESCAPE || (getFirstConsCharIndex(this.#config.CHAR_ESCAPE, raw, sp - 2) % 2 === sp % 2)) {
        decoded.push(this.decodeRaw(buff));
        buff = '';
      } else if (raw[sp - 1] === this.#config.CHAR_ESCAPE) buff += this.#config.CHAR_MAIN_SEP;
  
      cur = sp + 1;
      sp = raw.indexOf(this.#config.CHAR_MAIN_SEP, cur);
    }
  
    buff += raw.slice(cur);
    decoded.push(this.decodeRaw(buff));
    return decoded;
  }

  encode(array = []) {
    let rs = '';
    array.forEach((e, i) => {
      rs += this.encodeRaw(e);
      if (i !== array.length - 1) rs += this.#config.CHAR_MAIN_SEP;
    });

    const salt = Math.round(Math.random() * 255);

    return `${String.fromCharCode(salt)}${rs.split('')
      .map((v) => String.fromCharCode((v.charCodeAt(0) + salt) % 256))
      .join('')}`;
  }
}

module.exports = Protocol;
