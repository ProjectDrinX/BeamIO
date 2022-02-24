import Encoder from '../src/encoder';

function boolListEqual(boolList: boolean[], decoded: boolean[]) {
  for (const i in boolList) {
    if (boolList[i] !== !!decoded[i]) {
      console.error(i, boolList[i], !!decoded[i], boolList, decoded);
      throw new Error(`Wrong bool value at index ${i}`);
    }
  }
  return true;
}

function testBool() {
  for (let n = 80; n < 10000; n += 1) {
    const len = Math.round((Math.random() * n) / 10);
    if (n % 1000 === 0) console.log(`with ${len} item${len > 1 ? 's' : ''}`);

    const boolList: boolean[] = [];
    for (let i = 0; i < len; i += 1) boolList.push(!!Math.round(Math.random()));

    const encoded = Encoder.boolList.encode(boolList);
    const decoded = Encoder.boolList.decode(encoded);

    boolListEqual(boolList, decoded);
  }
}

function testNumber() {
  function testWith(n: number, mod: number) {
    const encoded = Encoder.number.encode(n);
    const decoded = Encoder.number.decode(encoded);

    if (n !== decoded) throw new Error(`Wrong number value ${decoded} instead of ${n}`);
    if (n % mod === 0) console.log(`with ${n}: OK`);
  }

  for (let n = 0; n <= 100000; n += 1) testWith(n, 50000);
  for (let n = 2; n < Infinity; n **= 2) testWith(n, 2);
}

export default () => {
  console.log('Testing boolean encoding:');
  testBool();

  console.log('\nTesting number encoding:');
  testNumber();
};
