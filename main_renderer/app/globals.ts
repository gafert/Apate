export function byteToBinary(num: number, padding: number, bitsInAChunk = 8) {
  if (!num) {
    num = 0;
  }
  let bin = num.toString(2);
  padding = typeof padding === 'undefined' || padding === null ? (padding = 2) : padding;
  while (bin.length < padding) {
    bin = '0' + bin;
  }
  bin = bin.match(new RegExp('.{1,' + bitsInAChunk + '}', 'g')).join(' ');
  return bin.toUpperCase();
}

export function byteToHex(num: number, padding: number) {
  if (!num) {
    num = 0;
  }
  let hex = num.toString(16);
  padding = typeof padding === 'undefined' || padding === null ? (padding = 2) : padding;
  while (hex.length < padding) {
    hex = '0' + hex;
  }
  return hex.toUpperCase();
}

export function range(min, max, step) {
  step = step || 1;
  const input = [];
  for (let i = min; i <= max; i += step) {
    input.push(i);
  }
  return input;
}
