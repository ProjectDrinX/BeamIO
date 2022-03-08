/* eslint-disable no-unused-vars */
const nbr = 100000000;

{
  const buf = new Uint8Array(nbr);
  const d1 = Date.now();
  for (const a of buf);
  const d2 = Date.now();
  console.log(`Uint8Array: ${nbr} element -> ${d2 - d1} ms`);
}
{
  const buf = new Uint8ClampedArray(nbr);
  const d1 = Date.now();
  for (const a of buf);
  const d2 = Date.now();
  console.log(`Uint8ClampedArray: ${nbr} element -> ${d2 - d1} ms`);
}
{
  const buf = new Int8Array(nbr);
  const d1 = Date.now();
  for (const a of buf);
  const d2 = Date.now();
  console.log(`Int8Array: ${nbr} element -> ${d2 - d1} ms`);
}
{
  const buf = new Array(nbr);
  const d1 = Date.now();
  for (const a of buf);
  const d2 = Date.now();
  console.log(`Array: ${nbr} element -> ${d2 - d1} ms`);
}
{
  const buf = new ArrayBuffer(nbr);
  const d1 = Date.now();
  for (const a of buf);
  const d2 = Date.now();
  console.log(`ArrayBuffer: ${nbr} element -> ${d2 - d1} ms`);
}
{
  const buf = 'iznslapsbh'.repeat(nbr / 10);
  const d1 = Date.now();
  for (const a of buf);
  const d2 = Date.now();
  console.log(`String: ${nbr} element -> ${d2 - d1} ms`);
}
