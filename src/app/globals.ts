export const MEMORY_SIZE = 512;

export function byteToHex(num: number, padding: number) {
  if(!num) {
    num = 0;
  }
  let hex = num.toString(16);
  padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
  while (hex.length < padding) {
    hex = "0" + hex;
  }
  return hex.toUpperCase();
}

export function range(min, max, step) {
  step = step || 1;
  let input = [];
  for (let i = min; i <= max; i += step) {
    input.push(i);
  }
  return input;
}
