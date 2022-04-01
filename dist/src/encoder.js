"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cToHex(c) {
    switch (c) {
        case '-': return 10;
        case '.': return 11;
        case 'e': return 12;
        default: return Number(c);
    }
}
function hexToC(h) {
    switch (h) {
        case 10: return '-';
        case 11: return '.';
        case 12: return 'e';
        default: return String.fromCharCode(h + 48);
    }
}
const number = {
    encode(nbr) {
        if (nbr === Infinity)
            return '\xFF';
        if (nbr === -Infinity)
            return '\xAF';
        if (Number.isNaN(nbr))
            return '\xAA';
        const s = `${nbr}`.replace('+', '');
        let rs = (s.length % 2 !== 0) ? String.fromCharCode(cToHex(s[0])) : '';
        for (let i = (s.length % 2 === 0 ? 0 : 1); i < s.length - 1; i += 2) {
            rs += String.fromCharCode(16 * cToHex(s[i]) + cToHex(s[i + 1]));
        }
        return rs;
    },
    decode(hex) {
        if (hex === '\xFF')
            return Infinity;
        if (hex === '\xAF')
            return -Infinity;
        if (hex === '\xAA')
            return NaN;
        let s = '';
        for (let i = 0; i < hex.length; i += 1) {
            const n = hex.charCodeAt(i);
            if (i > 0 || n >= 16)
                s += hexToC(Math.floor(n / 16)) + hexToC(n % 16);
            else
                s += hexToC(n % 16);
        }
        return Number(s);
    },
};
const unsignedInt = {
    encode(nbr) {
        let hex = nbr.toString(16);
        if (hex.length % 2 !== 0)
            hex = `0${hex}`;
        let rs = '';
        for (let i = 0; i < hex.length; i += 2) {
            rs += String.fromCharCode(~~`0x${hex[i]}${hex[i + 1]}`);
        }
        return rs;
    },
    decode(hex) {
        let nbr = 0;
        for (let i = hex.length - 1; i >= 0; i -= 1) {
            nbr += hex.charCodeAt(i) * 256 ** (hex.length - i - 1);
        }
        return nbr;
    },
};
const boolList = {
    encode(bools) {
        let hex = '';
        let temp = '0b';
        let i = 0;
        for (const b of bools) {
            if (i % 8 === 0 && i) {
                hex += String.fromCharCode(~~temp);
                temp = '0b';
            }
            temp += ~~b;
            i += 1;
        }
        while (i % 8 !== 0) {
            temp += '0';
            i += 1;
        }
        hex += String.fromCharCode(~~temp);
        return hex;
    },
    decode(hex) {
        const bools = [];
        for (let i = 0; i < hex.length; i += 1) {
            const n = hex.charCodeAt(i);
            bools.push(!!(n & 0b10000000), !!(n & 0b1000000), !!(n & 0b100000), !!(n & 0b10000), !!(n & 0b1000), !!(n & 0b100), !!(n & 0b10), !!(n & 0b1));
        }
        return bools;
    },
};
exports.default = { number, unsignedInt, boolList };
