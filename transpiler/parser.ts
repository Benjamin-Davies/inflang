import {
  ArgDecl,
  ArgDecls,
  Args,
  Elif,
  Else,
  Expr,
  For,
  Func,
  If,
  InnerExpr,
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

// TODO: increase strictness around commas
function parseExpr(s: Scanner): Expr {
  let expr: Expr | Args | null = null;
  loop: while (true) {
    switch (s.peek()?.[0]) {
      case 'verb': {
        const [_, verb] = s.consume();
        expr = ['Call', toArgs(expr), verb, ['Args', []]];
        break;
      }
      case 'noun':
      case 'left-paren':
      case 'number':
      case 'string': {
        const innerExpr = parseInnerExpr(s);
        expr = appendArg(expr, innerExpr);
        break;
      }
      case 'comma':
        s.consume();
        break;
      default:
        break loop;
    }
  }

  return expectExpr(expr);
}

function toArgs(expr: Expr | Args | null): Args {
  if (expr === null) {
    return ['Args', []];
  } else if (expr[0] === 'Args') {
    return expr;
  } else {
    return ['Args', [expr]];
  }
}

function appendArg(
  expr: Expr | Args | null,
  innerExpr: InnerExpr
): Expr | Args {
  if (expr === null) {
    return innerExpr;
  } else if (expr[0] === 'Args') {
    expr[1].push(innerExpr);
    return expr;
  } else if (expr[0] === 'Call') {
    const postArgs = expr[3];
    postArgs[1].push(innerExpr);
    return expr;
  } else {
    return ['Args', [expr, innerExpr]];
  }
}

function expectExpr(expr: Expr | Args | null): Expr {
  if (expr === null) {
    throw new Error('Expected expr');
  } else if (expr[0] === 'Args') {
    throw new Error('Missing verb');
  } else {
    return expr;
  }
}

function parseInnerExpr(s: Scanner): InnerExpr {
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
