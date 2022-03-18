function decode1(hex = '') {
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
}

function decode2(hex = '') {
  const bools = [];
  for (let i = 0; i < hex.length; i += 1) {
    const n = hex.charCodeAt(i);
    bools.push(
      !!(n & 0b10000000),
      !!(n & 0b1000000),
      !!(n & 0b100000),
      !!(n & 0b10000),
      !!(n & 0b1000),
      !!(n & 0b100),
      !!(n & 0b10),
      !!(n & 0b1),
    );
  }

  return bools;
}

const hex = 'çéç&àa';
{
  const d1 = Date.now();
  for (let i = 0; i <= 1000000; i += 1) decode1(hex);
  const d2 = Date.now();
  console.log('Time for decode1:', d2 - d1, 'ms');
}
{
  const d1 = Date.now();
  for (let i = 0; i <= 1000000; i += 1) decode2(hex);
  const d2 = Date.now();
  console.log('Time for decode2:', d2 - d1, 'ms');
}

/**
 * ===== Results ====
 *  decode1: 3318 ms
 *  decode3:  185 ms
 * ==================
 */
