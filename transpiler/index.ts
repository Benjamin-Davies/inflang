import fs from 'fs';

import parse from './parser';
import generateProgram from './code-generator';

const filename = process.argv[2];
const input = fs.readFileSync(filename, 'utf8');
const ast = parse(input);
const output = generateProgram(ast);

const outputFile = filename.replace(/\.inf$/, '') + '.ts';
fs.writeFileSync(outputFile, output);
