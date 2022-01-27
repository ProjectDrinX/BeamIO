const Protocol = require('../src/protocol');

function randomArray(len1 = 10000, len2 = 40) {
  const arr = [];
  for (let i1 = 0; i1 < len1; i1++) {
    let str = '';
    for (let i2 = 0; i2 < len2; i2++) str += String.fromCharCode(Math.round(Math.random() * 255));
    arr.push(str);
  }
  return arr;
}

const prot = new Protocol();

const chunks = randomArray();
const encoded = prot.encode(chunks);
const parsed = prot.decode(encoded);

chunks.forEach((v, i) => {
  if (v !== parsed[i]) {
    for (let i2 = 0; i2 < v.length; i2++) {
      if (v[i2] !== parsed[i][i2]) {
        if (!parsed[i][i2]) console.log('Missing char at index:', i2);
        else console.log(`Char '${parsed[i][i2]}' (${parsed[i][i2].charCodeAt(0)}) should be ${v[i2]} (${v[i2].charCodeAt(0)})`)
      }
    }

    throw new Error(`Wrong result: '${v}' (${v.length}) -> '${parsed[i]}' (${parsed[i].length})`);
  }

  if (i % 2000 === 0 || i === chunks.length - 1) console.log('Test n°', i, '-> OK');
});
