import { Type } from '../src/CompiledScheme';
import type { DeepScheme, DeepObject } from '../src/CompiledScheme';
import Engine from '../src/engine';
import type { DeepSchemes } from '../src/engine';

const randomBool = () => Math.random() > 0.5;
const randomNbr = () => (Math.random() > 0.5 ? -1 : 1) * (Math.random() ** (Math.random() * 100));
function randomStr(len = Math.round(Math.random() * 500)) {
  let str = '';
  for (let i = 0; i < len; i += 1) str += String.fromCharCode(Math.round(Math.random() * 255));
  return str;
}

function genRandomData(scheme: DeepScheme): DeepObject {
  const data: DeepObject = {};

  for (const k in scheme) {
    if (typeof scheme[k] === 'object') data[k] = genRandomData(scheme[k] as DeepScheme);
    else if (scheme[k] === Type.String) data[k] = randomStr();
    else if (scheme[k] === Type.Number) data[k] = randomNbr();
    else if (scheme[k] === Type.Boolean) data[k] = randomBool();
  }

  return data;
}

const SCHEMES: DeepSchemes = {
  flatTest: {
    name: Type.String,
    count: Type.Number,
    isUser: Type.Boolean,
  },

  deepTest: {
    name: Type.String,
    count: Type.Number,
    isUser: Type.Boolean,
    obj: {
      name: Type.String,
      count: Type.Number,
      isUser: Type.Boolean,
      obj: {
        name: Type.String,
        count: Type.Number,
        isUser: Type.Boolean,
      },
    },
  },
};

export default () => {
  const engine = new Engine(SCHEMES);

  for (const schemeID in SCHEMES) {
    const scheme = SCHEMES[schemeID];
    console.log(`Testing '${schemeID}':`, scheme);

    for (let i = 0; i < 10000; i += 1) {
      const data = genRandomData(scheme);

      const encoded = engine.serialize(schemeID, data);
      const decoded = engine.parse({ hash: encoded[0], payload: encoded.slice(1) });
      const recoded = engine.serialize(schemeID, decoded.data);

      if (encoded !== recoded) {
        console.log('  Wrong Result:', [encoded, recoded]);

        console.log(data, decoded.data);
        return;
      }

      if (i % 1000 === 0) console.log(`  Test n°${i} -> OK`);
    }
  }
};
