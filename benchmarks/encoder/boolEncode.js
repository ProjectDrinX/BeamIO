function encode1(bools = []) {
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
}

function encode2(bools = []) {
  let hex = '';

  for (let i = 0; i < bools.length; i += 8) {
    hex += String.fromCharCode(
      ~~`0b${~~bools[i]}${~~bools[i + 1]
      }${~~bools[i + 2]}${~~bools[i + 3]
      }${~~bools[i + 4]}${~~bools[i + 5]
      }${~~bools[i + 6]}${~~bools[i + 7]}`,
    );
  }

  return hex;
}

function encode3(bools = []) {
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
}

const bools = [true, true, false, true, false, false, false];
{
  const d1 = Date.now();
  for (let i = 0; i <= 10000000; i += 1) encode1(bools);
  const d2 = Date.now();
  console.log('Time for encode1:', d2 - d1, 'ms');
}
{
  const d1 = Date.now();
  for (let i = 0; i <= 10000000; i += 1) encode2(bools);
  const d2 = Date.now();
  console.log('Time for encode2:', d2 - d1, 'ms');
}
{
  const d1 = Date.now();
  for (let i = 0; i <= 10000000; i += 1) encode3(bools);
  const d2 = Date.now();
  console.log('Time for encode3:', d2 - d1, 'ms');
}

/**
 * ===== Results ====
 *  encode1: 2920 ms
 *  encode3: 1687 ms
 *  encode3: 1269 ms
 * ==================
 */
