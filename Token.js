import { Lexeme } from './Lexeme.js';

export class Token {
  constructor(lexeme, type, start, end, line, column) {
    this.lexeme = lexeme;
    this.type = type;
    this.start = start;
    this.end = end;
    this.line = line;
    this.column = column;
  }
}

export const TokenType = {
  IDENTIFIER: 0,
  PUNCTUATOR: 1,
  KEYWORD: 2,
  INTEGER: 3,
  FLOAT: 4,
  BOOLEAN: 5,
  STRING: 6,
  EOF: 7,
};

export const spaces = new Set([' ', '\t', '\n']);

export const punctuators = new Set([
  Lexeme.COMMA,
  Lexeme.SEMI,
  Lexeme.LPAREN,
  Lexeme.RPAREN,
  Lexeme.LSQUAR,
  Lexeme.RSQUAR,
  Lexeme.PLUS,
  Lexeme.MINUS,
  Lexeme.STAR,
  Lexeme.SLASH,
  Lexeme.CARET,
  Lexeme.GT,
  Lexeme.LT,
  Lexeme.COLON,
  Lexeme.NOT,
  Lexeme.EQ,
  Lexeme.MOD,
]);

export const keywords = new Set([
  Lexeme.IF,
  Lexeme.THEN,
  Lexeme.ELSE,
  Lexeme.ELIF,
  Lexeme.TRUE,
  Lexeme.FALSE,
  Lexeme.AND,
  Lexeme.OR,
  Lexeme.WHILE,
  Lexeme.DO,
  Lexeme.FOR,
  Lexeme.FUNC,
  Lexeme.END,
  Lexeme.LOCAL,
  Lexeme.PRINT,
  Lexeme.PRINTLN,
  Lexeme.RET,
]);
