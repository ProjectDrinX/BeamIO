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

function encodeCheck(n: number, showInfo = true) {
  const encoded = Encoder.number.encode(n);
  const decoded = Encoder.number.decode(encoded);

  if (n !== decoded && !Number.isNaN(n)) throw new Error(`Wrong number value ${decoded} instead of ${n}`);
  if (!showInfo) return;

  const originLen = `${n}`.length;
  const ratio = Math.round((1 - encoded.length / originLen) * 10000) / 100;
  console.log(`with ${n}: [${originLen} -> ${encoded.length}] bit(s): Compression ratio: ${ratio}%`);
}

export default () => {
  console.log('Testing boolean encoding:');
  testBool();

  console.log('\nTesting special number encoding:');
  encodeCheck(0);
  encodeCheck(-0);
  encodeCheck(3e300);
  encodeCheck(-3e300);
  // eslint-disable-next-line no-loss-of-precision
  encodeCheck(3e3000);
  // eslint-disable-next-line no-loss-of-precision
  encodeCheck(-3e3000);
  encodeCheck(Infinity);
  encodeCheck(-Infinity);
  encodeCheck(NaN);

  console.log('\nTesting integer encoding:');
  for (let n = 0; n <= 100000; n += 1) encodeCheck(n, (n % 50000 === 0));
  for (let n = 2; n < Infinity; n **= 2) encodeCheck(n, (n % 2 === 0));

  console.log('\nTesting float encoding:');
  for (let n = 0; n <= 100000; n += 1) {
    const rnd = (Math.random() > 0.5 ? -1 : 1) * (Math.random() ** (Math.random() * 100));
    encodeCheck(rnd, (n % 100000 === 0));
  }
};
