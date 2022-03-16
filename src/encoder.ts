function cToHex(c: string) {
  switch (c) {
    case '-': return 10;
    case '.': return 11;
    case 'e': return 12;
    default: return Number(c);
  }
}

function hexToC(h: number) {
  switch (h) {
    case 10: return '-';
    case 11: return '.';
    case 12: return 'e';
    default: return String.fromCharCode(h + 48);
  }
}

const number = {
  encode(nbr: number): string {
    if (nbr === Infinity) return '\xFF';
    if (nbr === -Infinity) return '\xAF';
    if (Number.isNaN(nbr)) return '\xAA';

    const s = `${nbr}`.replace('+', '');
    let rs = (s.length % 2 !== 0) ? String.fromCharCode(cToHex(s[0])) : '';

    for (let i = (s.length % 2 === 0 ? 0 : 1); i < s.length - 1; i += 2) {
      rs += String.fromCharCode(16 * cToHex(s[i]) + cToHex(s[i + 1]));
    }

    return rs;
  },

  decode(hex: string): number {
    if (hex === '\xFF') return Infinity;
    if (hex === '\xAF') return -Infinity;
    if (hex === '\xAA') return NaN;

    let s = '';
    for (let i = 0; i < hex.length; i += 1) {
      const n = hex.charCodeAt(i);
      if (i > 0 || n >= 16) s += hexToC(Math.floor(n / 16)) + hexToC(n % 16);
      else s += hexToC(n % 16);
    }

    return Number(s);
  },
};

const unsignedInt = {
  encode(nbr: number): string {
    let hex = nbr.toString(16);
    if (hex.length % 2 !== 0) hex = `0${hex}`;

    let rs = '';
    for (let i = 0; i < hex.length; i += 2) {
      rs += String.fromCharCode(parseInt(hex[i], 16) * 16 + parseInt(hex[i + 1], 16));
    }

    return rs;
  },

  decode(hex: string): number {
    let nbr = 0;
    for (let i = hex.length - 1; i >= 0; i -= 1) {
      nbr += hex.charCodeAt(i) * 256 ** (hex.length - i - 1);
    }

    return nbr;
  },
};

const boolList = {
  encode(bools: boolean[]): string {
    let hex = '';
    let i = 7;
    let n = 0;

    for (const b of bools) {
      if (b) n += 2 ** i;

      if (i === 0) {
        hex += String.fromCharCode(n);
        i = 7;
        n = 0;
      } else i -= 1;
    }

    if (n > 0) hex += String.fromCharCode(n);

    return hex || '\0';
  },

  decode(hex: string): boolean[] {
    const bools = [];
    for (let i = 0; i < hex.length; i += 1) {
      let n = hex.charCodeAt(i);
      for (let t = 7; t >= 0; t -= 1) {
        const b = n >= 2 ** t;
        bools.push(b);
        if (b) n -= 2 ** t;
      }
    }

    return bools;
  },
};

export default { number, unsignedInt, boolList };
