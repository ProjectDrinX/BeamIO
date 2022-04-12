import type { Packet } from './engine';

function getFirstConsCharIndex(char = '', text = '', index = 0) {
  let i = index;
  while (text[i] === char && i > -2) i -= 1;
  return i + 1;
}

export interface ProtocolConfig {
  /** Main separator char */
  CHAR_MAIN_SEP?: string,
  /** Escape char */
  CHAR_ESCAPE?: string,
}

class Protocol {
  readonly config = {
    CHAR_MAIN_SEP: '\x30',
    CHAR_ESCAPE: '\x31',
  };

  /**
   * @param {ProtocolConfig} config Protocol config
   */
  constructor(config: ProtocolConfig = {}) {
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

  decode(packet: Packet): string[] {
    const decoded = [];
    let cur = 0;
    let sp = packet.payload.indexOf(this.config.CHAR_MAIN_SEP);
    let buff = '';

    while (sp !== -1) {
      buff += packet.payload.slice(cur, sp);
      if (
        packet.payload[sp - 1] !== this.config.CHAR_ESCAPE
        || (getFirstConsCharIndex(this.config.CHAR_ESCAPE, packet.payload, sp - 2) % 2 === sp % 2)
      ) {
        decoded.push(this.decodeRaw(buff));
        buff = '';
      } else if (packet.payload[sp - 1] === this.config.CHAR_ESCAPE) {
        buff += this.config.CHAR_MAIN_SEP;
      }

      cur = sp + 1;
      sp = packet.payload.indexOf(this.config.CHAR_MAIN_SEP, cur);
    }

    buff += packet.payload.slice(cur);
    decoded.push(this.decodeRaw(buff));

    return decoded;
  }

  encode(iterator: Generator<string>): string {
    let rs = '';
    let first = true;

    for (let str of iterator) {
      if (!first) rs += this.config.CHAR_MAIN_SEP;
      else first = false;

      if (typeof str !== 'string') continue;
      let i = str.indexOf(this.config.CHAR_ESCAPE);

      while (i !== -1) {
        str = `${str.substring(0, i)}${this.config.CHAR_ESCAPE}${str.slice(i)}`;
        i = str.indexOf(this.config.CHAR_ESCAPE, i + 2);
      }

      i = str.indexOf(this.config.CHAR_MAIN_SEP, i);
      while (i !== -1) {
        str = `${str.substring(0, i)}${this.config.CHAR_ESCAPE}${str.slice(i)}`;
        i = str.indexOf(this.config.CHAR_MAIN_SEP, i + 2);
      }

      rs += str;
    }

    return rs;
  }
}

export default Protocol;
