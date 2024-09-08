import fs from 'fs';

import parse from './parser';

const filename = process.argv[2];
const input = fs.readFileSync(filename, 'utf8');
const ast = parse(input);

console.log(JSON.stringify(ast));
