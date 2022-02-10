/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

/**
 * Code exécutable dans un navigateur
 */

const CHAR_MAIN_SEP = '\x30';
const CHAR_ESCAPE = '\x31';
const CHAR_MAIN_SEP_C = CHAR_MAIN_SEP.charCodeAt(0);
const CHAR_ESCAPE_C = CHAR_ESCAPE.charCodeAt(0);

function encodeRaw(str = '') {
  let i = str.indexOf(CHAR_ESCAPE);

  while (i !== -1) {
    str = `${str.substring(0, i)}${CHAR_ESCAPE}${str.substring(i)}`;
    i = str.indexOf(CHAR_ESCAPE, i + 2);
  }

  i = str.indexOf(CHAR_MAIN_SEP, i);
  while (i !== -1) {
    str = `${str.substring(0, i)}${CHAR_ESCAPE}${str.substring(i)}`;
    i = str.indexOf(CHAR_MAIN_SEP, i + 2);
  }

  return str;
}

function concatBuff(a, b) {
  const c = new Uint8Array(a.length + b.length + 1);
  c.set(a, 0);
  c.set([CHAR_ESCAPE_C], a.length);
  c.set(b, a.length + 1);

  return c;
}

/**
 * @param {Uint8Array} buf
 * @returns
 */
function encodeBuff(buf) {
  let i = buf.indexOf(CHAR_ESCAPE_C);

  while (i !== -1) {
    buf = concatBuff(buf.subarray(0, i), buf.subarray(i));
    i = buf.indexOf(CHAR_ESCAPE_C, i + 2);
  }

  i = buf.indexOf(CHAR_MAIN_SEP_C, i);
  while (i !== -1) {
    buf = concatBuff(buf.subarray(0, i), buf.subarray(i));
    i = buf.indexOf(CHAR_MAIN_SEP_C, i + 2);
  }

  return buf;
}

function randomArray(len1 = 1000, len2 = 40) {
  const arr = [];
  for (let i1 = 0; i1 < len1; i1 += 1) {
    let s = '';
    for (let i2 = 0; i2 < len2; i2 += 1) s += String.fromCharCode(Math.round(Math.random() * 255));
    arr.push(s);
  }
  return arr;
}

const array = randomArray();
const json = JSON.stringify(array);

const arrBuff = array.map((s) => new Uint8Array(s.split('').map((c) => c.charCodeAt(0))));

{
  const d1 = Date.now();
  for (let i = 0; i < 100; i += 1) JSON.stringify(array);
  const d2 = Date.now();
  console.log(`JSON Encode: ${d2 - d1} ms`);
}
{
  const d1 = Date.now();
  for (let i = 0; i < 100; i += 1) {
    for (const x in array) encodeRaw(array[x]);
  }
  const d2 = Date.now();
  console.log(`String Encode: ${d2 - d1} ms`);
}
{
  const d1 = Date.now();
  for (let i = 0; i < 100; i += 1) {
    let rs = null;
    for (const c of arrBuff) {
      if (!rs) rs = encodeBuff(c);
      else rs = concatBuff(rs, encodeBuff(c));
    }
  }
  const d2 = Date.now();
  console.log(`UInt8Array Encode: ${d2 - d1} ms`);
}
{
  const d1 = Date.now();
  for (let i = 0; i < 100; i += 1) JSON.parse(json);
  const d2 = Date.now();
  console.log(`JSON Decode: ${d2 - d1} ms`);
}
