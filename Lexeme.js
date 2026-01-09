export const Lexeme = {
  // single char tokens
  COMMA: ',',
  SEMI: ';',
  LPAREN: '(',
  RPAREN: ')',
  LSQUAR: '[',
  RSQUAR: ']',
  PLUS: '+',
  MINUS: '-',
  STAR: '*',
  SLASH: '/',
  CARET: '^',
  COLON: ':',
  EQ: '=',
  GT: '>',
  LT: '<',
  NOT: '~',
  HASH: '#',
  MOD: '%',
  // double char tokens
  get GEQ() {
    return this.GT + this.EQ;
  },
  get LEQ() {
    return this.LT + this.EQ;
  },
  get DEQ() {
    return this.EQ + this.EQ;
  },
  get NOTEQ() {
    return this.NOT + this.EQ;
  },
  get ASSIGN() {
    return this.COLON + this.EQ;
  },
  // keywords
  IF: 'if',
  THEN: 'then',
  ELSE: 'else',
  ELIF: 'elif',
  TRUE: 'true',
  FALSE: 'false',
  AND: 'and',
  OR: 'or',
  WHILE: 'while',
  DO: 'do',
  FOR: 'for',
  FUNC: 'func',
  END: 'end',
  LOCAL: 'local',
  PRINT: 'print',
  PRINTLN: 'println',
  RET: 'ret',
};
