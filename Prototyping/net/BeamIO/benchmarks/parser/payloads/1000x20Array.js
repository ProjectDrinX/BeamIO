function randomArray(len1 = 100, len2 = 50) {
  const arr = [];
  for (let i1 = 0; i1 < len1; i1 += 1) {
    let str = '';
    for (let i2 = 0; i2 < len2; i2 += 1) {
      str += String.fromCharCode(Math.round(Math.random() * 255));
    }
    arr.push(str);
  }
  return arr;
}

module.exports = {
  name: '1000x20 Array',
  value: randomArray(1000, 20),
  repeat: 1000,
};
