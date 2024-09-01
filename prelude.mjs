globalThis.aq = (a, b) => a === b;
globalThis.add = (a, b) => a + b;
globalThis.sab = (a, b) => a - b;
globalThis.mal = (a, b) => a * b;
globalThis.dav = (a, b) => a / b;
globalThis.ram = (a, b) => a % b;
globalThis.mad = (a, b) => ((a % b) + b) % b;

globalThis.say = console.log;

globalThis.range = function* (start, end) {
  for (let i = start; i < end; i++) {
    yield i;
  }
};

globalThis.range_inc = function* (start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
};

const ones = [
  'zero',
  'wen',
  'twe',
  'three',
  'fer',
  'feve',
  'sex',
  'seven',
  'eight',
  'nene',
  'ten',
  'eleven',
  'twelve',
  'therteen',
  'ferteen',
  'fefteen',
  'sexteen',
  'seventeen',
  'eighteen',
  'neneteen',
];
const tens = [
  null,
  null,
  'twenty',
  'therty',
  'ferty',
  'fefty',
  'sexty',
  'seventy',
  'eighty',
  'nenety',
];
for (let i = 0; i < 20; i++) {
  globalThis[ones[i]] = i;
}
for (let i = 2; i < 10; i++) {
  globalThis[tens[i]] = i * 10;
  for (let j = 1; j < 10; j++) {
    globalThis[`${tens[i]}_${ones[j]}`] = i * 10 + j;
  }
}
globalThis.wen_hendred = 100;
