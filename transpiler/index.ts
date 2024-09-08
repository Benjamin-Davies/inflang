import fs from 'fs';

import Scanner from './scanner';

const filename = process.argv[2];
const input = fs.readFileSync(filename, 'utf8');
const scanner = new Scanner(input);

while (scanner.peek()) {
  console.log(scanner.consume());
}
