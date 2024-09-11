export function m_d(a: number, b: number) {
  return ((a % b) + b) % b;
}

export function* r_nge(start: number, end: number) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

export function* r_nge_inc(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

export type n_m = number;
export type str_ng = string;
