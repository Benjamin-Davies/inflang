import {
  ArgDecl,
  ArgDecls,
  Args,
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
} from './ast';
import Scanner from './scanner';

export default function parse(input: string): Program {
  const s = new Scanner(input);
  return parseProgram(s);
}

function parseProgram(s: Scanner): Program {
  const stmts: Stmt[] = [];
  while (!s.isDun()) {
    stmts.push(parseStmt(s));
  }
  return ['Program', stmts];
}

function parseStmt(s: Scanner): Stmt {
  let stmt: Stmt;
  const [type, value] = s.peek() || [null, null];
  switch (type) {
    case 'let-verb':
      stmt = parseFunc(s);
      break;
    case 'keyword':
      switch (value) {
        case 'uf':
          stmt = parseIf(s);
          break;
        case 'fur':
          stmt = parseFor(s);
          break;
        default:
          stmt = parseExpr(s);
          break;
      }
      break;
    default:
      stmt = parseExpr(s);
      break;
  }

  s.expect('full-stop');
  return stmt;
}

function parseFunc(s: Scanner): Func {
  const [_, verb] = s.expect('let-verb');
  const argDecls = parseArgDecls(s);
  s.expect('keyword', 'due');
  const program = parseProgram(s);
  s.expect('keyword', 'dun');
  return ['Func', verb, argDecls, program];
}

function parseArgDecls(s: Scanner): ArgDecls {
  if (s.peek()?.[0] !== 'noun') {
    return [];
  }

  const argDecls: ArgDecl[] = [];
  argDecls.push(parseArgDecl(s));
  while (s.peek()?.[1] === 'comma') {
    s.consume();
    argDecls.push(parseArgDecl(s));
  }
  return argDecls;
}

function parseArgDecl(s: Scanner): ArgDecl {
  const [_, noun] = s.expect('noun');
  const type = parseType(s);
  return ['Arg', noun, type];
}

function parseType(s: Scanner): Type {
  const [_, type] = s.expect('type');
  return type;
}

function parseIf(s: Scanner): If {
  s.expect('keyword', 'uf');
  const expr = parseExpr(s);
  s.expect('keyword', 'thun');
  const program = parseProgram(s);

  const elifs: Elif[] = [];
  while (s.peek()?.[1] === 'uluf') {
    elifs.push(parseElif(s));
  }

  let elseStmt: Else | null = null;
  if (s.peek()?.[1] === 'uls') {
    elseStmt = parseElse(s);
  }

  s.expect('keyword', 'dun');
  return ['If', expr, program, elifs, elseStmt];
}

function parseElif(s: Scanner): Elif {
  s.expect('keyword', 'uluf');
  const expr = parseExpr(s);
  s.expect('keyword', 'thun');
  const program = parseProgram(s);
  return ['Elif', expr, program];
}

function parseElse(s: Scanner): Else {
  s.expect('keyword', 'uls');
  const program = parseProgram(s);
  return ['Else', program];
}

function parseFor(s: Scanner): For {
  s.expect('keyword', 'fur');
  const [_, noun] = s.expect('noun');
  s.expect('keyword', 'un');
  const expr = parseExpr(s);
  s.expect('keyword', 'due');
  const program = parseProgram(s);
  s.expect('keyword', 'dun');
  return ['For', noun, expr, program];
}

function parseExpr(s: Scanner): Expr {
  let preArgs: Args | null = null;
  if (isInnerExpr(s)) {
    preArgs = parseArgs(s);
  }

  const calls: [string, Args | null][] = [];
  while (s.peek()?.[0] === 'verb') {
    const [_, verb] = s.consume();
    let args: Args | null = null;
    if (isInnerExpr(s)) {
      args = parseArgs(s);
    }
    calls.push([verb, args]);
  }

  if (calls.length === 0) {
    if (!preArgs || preArgs[1].length > 1) {
      throw new Error('Invalid expression. Contains commas with no call.');
    }
    return preArgs[1][0];
  }

  let expr: Call = [
    'Call',
    preArgs ?? ['Args', []],
    calls[0][0],
    calls[0][1] ?? ['Args', []],
  ];
  for (const call of calls.slice(1)) {
    expr = ['Call', ['Args', [expr]], call[0], call[1] ?? ['Args', []]];
  }
  return expr;
}

function isInnerExpr(s: Scanner): boolean {
  switch (s.peek()?.[0]) {
    case 'noun':
    case 'left-paren':
    case 'number':
    case 'string':
      return true;
    default:
      return false;
  }
}

function parseArgs(s: Scanner): Args {
  const args = [parseInnerExpr(s)];
  while (s.peek()?.[0] === 'comma') {
    s.expect('comma');
    args.push(parseInnerExpr(s));
  }
  return ['Args', args];
}

function parseInnerExpr(s: Scanner): Expr {
  switch (s.peek()?.[0]) {
    case 'noun': {
      const [_, noun] = s.consume();
      return ['Ident', noun];
    }
    case 'left-paren': {
      s.expect('left-paren');
      const expr = parseExpr(s);
      s.expect('right-paren');
      return ['Parens', expr];
    }
    case 'number': {
      const [_, number] = s.consume();
      return ['Number', parseInt(number)];
    }
    case 'string': {
      const [_, string] = s.consume();
      return ['String', string];
    }
    default:
      throw new Error('Expected expr');
  }
}
