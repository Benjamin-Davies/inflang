function mad(a: number, b: number) {
  return ((a % b) + b) % b;
}

function* range(start: number, end: number) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

function* range_inc(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

type nim = number;
