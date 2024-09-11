import {
  ArgDecl,
  Call,
  Elif,
  Else,
  Expr,
  For,
  Func,
  If,
  Program,
  Stmt,
  Type,
  Use,
} from './ast';

export default function generateProgram(program: Program): string {
  const [_, stmts] = program;
  return stmts.map(generateStmt).join('\n');
}

function generateStmt(stmt: Stmt): string {
  switch (stmt[0]) {
    case 'Use':
      return generateUse(stmt);
    case 'Func':
      return generateFunc(stmt);
    case 'If':
      return generateIf(stmt);
    case 'For':
      return generateFor(stmt);
    default:
      return generateExpr(stmt) + ';';
  }
}

function generateUse(use: Use): string {
  const [_, module, items] = use;
  return `import { ${items.map(generateIdent).join(', ')} } from "${module}";`;
}

function generateFunc(func: Func): string {
  const [_, verb, argDecls, program] = func;
  return `function ${generateIdent(verb)}(${argDecls.map(generateArgDecl).join(', ')}) {\n${generateProgram(program)}\n}`;
}

function generateArgDecl(argDecl: ArgDecl): string {
  const [_, noun, type] = argDecl;
  return `${generateIdent(noun)}: ${generateIdent(type)}`;
}

function generateIf(ifStmt: If): string {
  const [_, condition, program, elifs, elseStmt] = ifStmt;
  return `if (${generateExpr(condition)}) {\n${generateProgram(program)}\n}${elifs.map(generateElif).join('')}${elseStmt ? generateElse(elseStmt) : ''}`;
}

function generateElif(elif: Elif): string {
  const [_, condition, program] = elif;
  return ` else if (${generateExpr(condition)}) {\n${generateProgram(program)}\n}`;
}

function generateElse(elseStmt: Else): string {
  const [_, program] = elseStmt;
  return ` else {\n${generateProgram(program)}\n}`;
}

function generateFor(forStmt: For): string {
  const [_, noun, iterable, program] = forStmt;
  return `for (const ${generateIdent(noun)} of ${generateExpr(iterable)}) {\n${generateProgram(program)}\n}`;
}

function generateExpr(expr: Expr): string {
  switch (expr[0]) {
    case 'Call':
      return generateCall(expr);
    case 'Parens':
      return generateExpr(expr[1]);
    case 'Ident':
      return generateIdent(expr[1]);
    case 'Number':
      return expr[1].toString();
    case 'String':
      return JSON.stringify(expr[1]);
  }
}

const operators: Record<string, string> = {
  aq: '===',
  add: '+',
  sab: '-',
  mal: '*',
  dav: '/',
  ram: '%',
};

function generateCall(call: Call): string {
  const [_, preArgs, verb, postArgs] = call;
  const args = [...preArgs[1], ...postArgs[1]];

  if (verb in operators) {
    return `(${args.map(generateExpr).join(` ${operators[verb]} `)})`;
  }

  return `${generateIdent(verb)}(${args.map(generateExpr).join(', ')})`;
}

const builtins: Record<string, string> = {
  say: 'console.log',
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
  '?',
  '?',
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
  builtins[ones[i]] = i.toString();
}
for (let i = 2; i < 10; i++) {
  builtins[tens[i]] = (i * 10).toString();
  for (let j = 1; j < 10; j++) {
    builtins[`${tens[i]}_${ones[j]}`] = (i * 10 + j).toString();
  }
}
builtins['wen-hendred'] = '100';

function generateIdent(ident: string): string {
  if (ident in builtins) {
    return builtins[ident].toString();
  }
  if (ident === 'nag') {
    return '-';
  }

  return ident.replace(/[aeiou]/, '_').replace(/-/g, '_');
}
