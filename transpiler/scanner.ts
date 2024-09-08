export type TokenType =
  | 'verb'
  | 'noun'
  | 'type'
  | 'field'
  | 'keyword'
  | 'let-verb'
  | 'let-noun'
  | 'let-type'
  | 'let-field'
  | 'string'
  | 'number'
  | 'comma'
  | 'full-stop'
  | 'left-paren'
  | 'right-paren';

export type Token = [TokenType, string];

type RawTokenType =
  | 'whitespace'
  | 'comment'
  | 'word'
  | 'let-word'
  | 'string'
  | 'number'
  | 'comma'
  | 'full-stop'
  | 'left-paren'
  | 'right-paren';

type RawToken = [RawTokenType, string];

const MATCHERS: [RawTokenType, RegExp][] = [
  ['whitespace', /^\s+/],
  ['comment', /^;[^\n]*?\n/],
  ['let-word', /^y[\w-]+/],
  ['word', /^[\w-]+/],
  ['string', /^"[^"]+?"/],
  ['number', /^\d+/],
  ['comma', /^,/],
  ['full-stop', /^\./],
  ['left-paren', /^\(/],
  ['right-paren', /^\)/],
];

const VOWEL_REGEX = /[aeiouy]/i;

const DUN_KEYWORDS = ['dun', 'uluf', 'uls'];

export default class Scanner {
  position = 0;
  nextToken: Token | null = null;

  constructor(private input: string) {}

  private nextRawToken(): RawToken | null {
    let rawToken: RawToken | null = null;
    for (const [rawType, regex] of MATCHERS) {
      const match = this.input.slice(this.position).match(regex);
      if (match) {
        rawToken = [rawType, match[0]];
        break;
      }
    }
    if (!rawToken) {
      console.error(`Unexpected character: '${this.input[this.position]}'`);
      return null;
    }
    const [rawType, value] = rawToken;
    this.position += value.length;

    return rawToken;
  }

  private next() {
    while (!this.nextToken && this.position < this.input.length) {
      const rawToken = this.nextRawToken();
      if (!rawToken) {
        return;
      }
      const [rawType, value] = rawToken;

      switch (rawType) {
        case 'whitespace':
        case 'comment':
          break;
        case 'word': {
          const [vowel] = value.toLowerCase().match(VOWEL_REGEX) || [];
          switch (vowel) {
            case 'a':
              this.nextToken = ['verb', value];
              break;
            case 'e':
              this.nextToken = ['noun', value];
              break;
            case 'i':
            case 'y':
              this.nextToken = ['type', value];
              break;
            case 'o':
              this.nextToken = ['field', value];
              break;
            case 'u':
              this.nextToken = ['keyword', value];
              break;
          }
          break;
        }
        case 'let-word': {
          const [vowel] = value.slice(1).toLowerCase().match(VOWEL_REGEX) || [];
          switch (vowel) {
            case 'a':
              this.nextToken = ['let-verb', value];
              break;
            case 'e':
              this.nextToken = ['let-noun', value];
              break;
            case 'i':
            case 'y':
              this.nextToken = ['let-type', value];
              break;
            case 'o':
              this.nextToken = ['let-field', value];
              break;
            case 'u':
              throw new Error('Cannot let a keyword');
          }
          break;
        }
        case 'string':
          this.nextToken = ['string', value.slice(1, -1)];
          break;
        case 'number':
          if (parseInt(value, 10) <= 100) {
            throw new Error(
              'Numbers less than or equal to 100 must be written out as words'
            );
          }
          this.nextToken = ['number', value];
          break;
        default:
          this.nextToken = [rawType, value];
          break;
      }
    }
  }

  peek(): Token | null {
    if (!this.nextToken) {
      this.next();
    }
    return this.nextToken;
  }

  consume() {
    const token = this.peek();
    if (!token) {
      throw new Error('Unexpected end of input');
    }
    this.nextToken = null;
    return token;
  }

  expect(type: TokenType, value?: string): Token {
    const token = this.consume();
    if (value !== undefined) {
      if (token[0] !== type || token[1] !== value) {
        throw new Error(`Expected ${[type, value]}, got ${token}`);
      }
    } else if (token[0] !== type) {
      throw new Error(`Expected ${type}, got ${token}`);
    }
    return token;
  }

  isDun() {
    const token = this.peek();
    return !token || DUN_KEYWORDS.includes(token[1]);
  }
}
