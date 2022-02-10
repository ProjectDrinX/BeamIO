const number = {
    encode(nbr) {
        let hex = nbr.toString(16);
        if (hex.length % 2 !== 0)
            hex = `0${hex}`;
        let rs = '';
        for (let i = 0; i < hex.length; i += 2) {
            rs += String.fromCharCode(parseInt(hex[i], 16) * 16 + parseInt(hex[i + 1], 16));
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
        let i = 7;
        let n = 0;
        bools.forEach((b) => {
            if (b)
                n += 2 ** i;
            if (i === 0) {
                hex += String.fromCharCode(n);
                i = 7;
                n = 0;
            }
            else
                i -= 1;
        });
        if (n > 0)
            hex += String.fromCharCode(n);
        return hex || '\0';
    },
    decode(hex) {
        const bools = [];
        for (let i = 0; i < hex.length; i += 1) {
            let n = hex.charCodeAt(i);
            for (let t = 7; t >= 0; t -= 1) {
                const b = n >= 2 ** t;
                bools.push(b);
                if (b)
                    n -= 2 ** t;
            }
        }
        return bools;
    },
};
export default { number, boolList };
