/**Program ::= { Stmt } */
export type Program = ['Program', Stmt[]];

/**Stmt ::= ( Func | If | For | Expr ) '.' */
export type Stmt = Func | If | For | Expr;

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

/**Expr ::= InnerExpr | Call */
export type Expr = InnerExpr | Call;

/**Call ::= Args verb Args */
export type Call = ['Call', Args, string, Args];

/**Args ::= [ Arg ( ',' Arg )* ] */
export type Args = ['Args', Arg[]];

/**Arg ::= SimpleCall | InnerExpr */
export type Arg = SimpleCall | Expr;

/**SimpleCall ::= verb Arg */
export type SimpleCall = ['Call', [], string, Arg];

/**InnerExpr ::= '(' Expr ')' | noun | number | string */
export type InnerExpr =
  | ['Parens', Expr]
  | ['Ident', string]
  | ['Number', number]
  | ['String', string];
