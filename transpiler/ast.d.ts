/**Program ::= { Stmt } */
export type Program = ['Program', Stmt[]];

/**Stmt ::= ( Use | Func | If | For | Expr ) '.' */
export type Stmt = Use | Func | If | For | Expr;

/**Use ::= 'use' string UseItem ( ',' UseItem )* */
export type Use = ['Use', string, UseItem[]];

/**UseItem ::= verb | noun | type */
export type UseItem = string;

/**Func ::= let-verb ArgDecls 'due' Program 'dun' */
export type Func = ['Func', string, ArgDecls, Program];

/**ArgDecls ::= [ ArgDecl ( ',' ArgDecl )* ] */
export type ArgDecls = ArgDecl[];

/**ArgDecl ::= noun Type */
export type ArgDecl = ['Arg', string, Type];

/**Type ::= type */
export type Type = string;

/**If ::= 'uf' Expr 'thun' Program ( Elif )* [ Else ] 'dun' */
export type If = ['If', Expr, Program, Elif[], Else | null];

/**Elif ::= 'uluf' Expr 'thun' Program */
export type Elif = ['Elif', Expr, Program];

/**Else ::= 'uls' Program */
export type Else = ['Else', Program];

/**For ::= 'fur' noun 'un' Expr 'due' Program 'dun' */
export type For = ['For', string, Expr, Program];

/**Expr ::= Call | InnerExpr */
/**InnerExpr ::= '(' Expr ')' | noun | number | string */
export type Expr =
  | Call
  | ['Parens', Expr]
  | ['Ident', string]
  | ['Number', number]
  | ['String', string];

/**Call ::= Args verb Args | Call verb Args */
export type Call = ['Call', Args, string, Args];

/**Args ::= [ InnerExpr ( ',' InnerExpr )* ] */
export type Args = ['Args', Expr[]];
