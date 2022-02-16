function getFirstConsCharIndex(char = '', text = '', index = 0) {
  let i = index;
  while (text[i] === char && i > -2) i -= 1;
  return i + 1;
}

interface ProtocolConfig {
  /** Main separator char */
  CHAR_MAIN_SEP: string,
  /** Escape char */
  CHAR_ESCAPE: string,
}

interface ProtocolConfigurator {
  /** Main separator char */
  CHAR_MAIN_SEP?: string,
  /** Escape char */
  CHAR_ESCAPE?: string,
}

class Protocol {
  readonly config: ProtocolConfig = {
    CHAR_MAIN_SEP: '\x30',
    CHAR_ESCAPE: '\x31',
  };

  /**
   * @param {ProtocolConfigurator} config Protocol config
   */
  constructor(config: ProtocolConfigurator = {}) {
    if (config.CHAR_MAIN_SEP) this.config.CHAR_MAIN_SEP = config.CHAR_MAIN_SEP;
    if (config.CHAR_ESCAPE) this.config.CHAR_ESCAPE = config.CHAR_ESCAPE;
  }

  decodeRaw(s: string = ''): string {
    let str = '';
    let cur = 0;
    let sp = s.indexOf(this.config.CHAR_ESCAPE);
  
    while (sp !== -1) {
      if (s[sp + 1] !== this.config.CHAR_MAIN_SEP) str += s.slice(cur, sp + 1);
      else str += `${s.slice(cur, sp)}${this.config.CHAR_MAIN_SEP}`;
  
      cur = sp + 2;
      sp = s.indexOf(this.config.CHAR_ESCAPE, cur);
    }
  
    return `${str}${s.slice(cur)}`;
  }

  decode(packet: string = ''): string[] {
    const salt = packet[0].charCodeAt(0);
    const raw = packet
      .slice(1)
      .split('')
      .map((v) => String.fromCharCode((v.charCodeAt(0) - salt + 256) % 256))
      .join('');

    const decoded = [];
    let cur = 0;
    let sp = raw.indexOf(this.config.CHAR_MAIN_SEP);
    let buff = '';

    while (sp !== -1) {
      buff += raw.slice(cur, sp);
      if (
        raw[sp - 1] !== this.config.CHAR_ESCAPE
        || (getFirstConsCharIndex(this.config.CHAR_ESCAPE, raw, sp - 2) % 2 === sp % 2)
      ) {
        decoded.push(this.decodeRaw(buff));
        buff = '';
      } else if (raw[sp - 1] === this.config.CHAR_ESCAPE) buff += this.config.CHAR_MAIN_SEP;

      cur = sp + 1;
      sp = raw.indexOf(this.config.CHAR_MAIN_SEP, cur);
    }

    buff += raw.slice(cur);
    decoded.push(this.decodeRaw(buff));
    return decoded;
  }

  encode(array: string[] = []): string {
    let rs = '';

    for (const x in array) {
      let str = array[x];

      let i = str.indexOf(this.config.CHAR_ESCAPE);

      while (i !== -1) {
        str = `${str.substring(0, i)}${this.config.CHAR_ESCAPE}${str.substring(i)}`;
        i = str.indexOf(this.config.CHAR_ESCAPE, i + 2);
      }

      i = str.indexOf(this.config.CHAR_MAIN_SEP, i);
      while (i !== -1) {
        str = `${str.substring(0, i)}${this.config.CHAR_ESCAPE}${str.substring(i)}`;
        i = str.indexOf(this.config.CHAR_MAIN_SEP, i + 2);
      }

      rs += str;
      // @ts-ignore
      if (x !== array.length - 1) rs += this.config.CHAR_MAIN_SEP;
    }

    const salt = Math.round(Math.random() * 255);

    return `${String.fromCharCode(salt)}${rs.split('')
      .map((v) => String.fromCharCode((v.charCodeAt(0) + salt) % 256))
      .join('')}`;
  }
}

export default Protocol;
