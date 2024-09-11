import fs from 'fs';

import parse from './parser';
import generateProgram from './code-generator';

const filename = process.argv[2];
const input = fs.readFileSync(filename, 'utf8');
const ast = parse(input);
const rawOutput = generateProgram(ast);

const prelude = fs.readFileSync('prelude.ts', 'utf8');
const output = `${prelude}\n${rawOutput}\n`;
const outputFile = filename.replace(/\.inf$/, '') + '.ts';
fs.writeFileSync(outputFile, output);
