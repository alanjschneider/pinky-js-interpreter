import { describe, test, expect } from 'vitest';
import { Lexer } from '../Lexer.js';
import { Token, TokenType } from '../Token.js';
import { Lexeme } from '../Lexeme.js';

describe('Test strings', () => {
  const lexer = new Lexer();

  test('string with "', () => {
    const tokens = lexer.tokenize('"string"');
    const expected = [new Token('string', TokenType.STRING, 0, 8, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test("string with '", () => {
    const tokens = lexer.tokenize("'string'");
    const expected = [new Token('string', TokenType.STRING, 0, 8, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('Unclosed string must throw an error', () => {
    expect(() => lexer.tokenize('"string')).toThrowError();
  });

  test('Must parse empty strings', () => {
    const tokens = lexer.tokenize('""');
    const expected = [new Token('', TokenType.STRING, 0, 2, 1, 0)];
    expect(tokens).toEqual(expected);
  });
});

describe('Test identifiers', () => {
  const lexer = new Lexer();

  test('', () => {
    const tokens = lexer.tokenize('name');
    const expected = [new Token('name', TokenType.IDENTIFIER, 0, 4, 1, 0)];
    expect(tokens).toEqual(expected);
  });
});

describe('Test numbers', () => {
  const lexer = new Lexer();

  test('Integer', () => {
    const tokens = lexer.tokenize('345');
    const expected = [new Token('345', TokenType.INTEGER, 0, 3, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('Float', () => {
    const tokens = lexer.tokenize('3.1416');
    const expected = [new Token('3.1416', TokenType.FLOAT, 0, 6, 1, 0)];
    expect(tokens).toEqual(expected);
  });
});

describe('Test keywords', () => {
  const lexer = new Lexer();

  test('if', () => {
    const tokens = lexer.tokenize('if');
    const expected = [new Token(Lexeme.IF, TokenType.KEYWORD, 0, 2, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('then', () => {
    const tokens = lexer.tokenize('then');
    const expected = [new Token(Lexeme.THEN, TokenType.KEYWORD, 0, 4, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('else', () => {
    const tokens = lexer.tokenize('else');
    const expected = [new Token(Lexeme.ELSE, TokenType.KEYWORD, 0, 4, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('elif', () => {
    const tokens = lexer.tokenize('elif');
    const expected = [new Token(Lexeme.ELIF, TokenType.KEYWORD, 0, 4, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('true', () => {
    const tokens = lexer.tokenize('true');
    const expected = [new Token(Lexeme.TRUE, TokenType.BOOLEAN, 0, 4, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('false', () => {
    const tokens = lexer.tokenize('false');
    const expected = [new Token(Lexeme.FALSE, TokenType.BOOLEAN, 0, 5, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('and', () => {
    const tokens = lexer.tokenize('and');
    const expected = [new Token(Lexeme.AND, TokenType.KEYWORD, 0, 3, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('or', () => {
    const tokens = lexer.tokenize('or');
    const expected = [new Token(Lexeme.OR, TokenType.KEYWORD, 0, 2, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('while', () => {
    const tokens = lexer.tokenize('while');
    const expected = [new Token(Lexeme.WHILE, TokenType.KEYWORD, 0, 5, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('do', () => {
    const tokens = lexer.tokenize('do');
    const expected = [new Token(Lexeme.DO, TokenType.KEYWORD, 0, 2, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('for', () => {
    const tokens = lexer.tokenize('for');
    const expected = [new Token(Lexeme.FOR, TokenType.KEYWORD, 0, 3, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('func', () => {
    const tokens = lexer.tokenize('func');
    const expected = [new Token(Lexeme.FUNC, TokenType.KEYWORD, 0, 4, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('end', () => {
    const tokens = lexer.tokenize('end');
    const expected = [new Token(Lexeme.END, TokenType.KEYWORD, 0, 3, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('local', () => {
    const tokens = lexer.tokenize('local');
    const expected = [new Token(Lexeme.LOCAL, TokenType.KEYWORD, 0, 5, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('print', () => {
    const tokens = lexer.tokenize('print');
    const expected = [new Token(Lexeme.PRINT, TokenType.KEYWORD, 0, 5, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('println', () => {
    const tokens = lexer.tokenize('println');
    const expected = [new Token(Lexeme.PRINTLN, TokenType.KEYWORD, 0, 7, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('ret', () => {
    const tokens = lexer.tokenize('ret');
    const expected = [new Token(Lexeme.RET, TokenType.KEYWORD, 0, 3, 1, 0)];
    expect(tokens).toEqual(expected);
  });
});

describe('Test punctuators', () => {
  const lexer = new Lexer();

  test(',', () => {
    const tokens = lexer.tokenize(',');
    const expected = [
      new Token(Lexeme.COMMA, TokenType.PUNCTUATOR, 0, 1, 1, 0),
    ];
    expect(tokens).toEqual(expected);
  });

  test(';', () => {
    const tokens = lexer.tokenize(';');
    const expected = [new Token(Lexeme.SEMI, TokenType.PUNCTUATOR, 0, 1, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('(', () => {
    const tokens = lexer.tokenize('(');
    const expected = [
      new Token(Lexeme.LPAREN, TokenType.PUNCTUATOR, 0, 1, 1, 0),
    ];
    expect(tokens).toEqual(expected);
  });

  test(')', () => {
    const tokens = lexer.tokenize(')');
    const expected = [
      new Token(Lexeme.RPAREN, TokenType.PUNCTUATOR, 0, 1, 1, 0),
    ];
    expect(tokens).toEqual(expected);
  });

  test('[', () => {
    const tokens = lexer.tokenize('[');
    const expected = [
      new Token(Lexeme.LSQUAR, TokenType.PUNCTUATOR, 0, 1, 1, 0),
    ];
    expect(tokens).toEqual(expected);
  });

  test(']', () => {
    const tokens = lexer.tokenize(']');
    const expected = [
      new Token(Lexeme.RSQUAR, TokenType.PUNCTUATOR, 0, 1, 1, 0),
    ];
    expect(tokens).toEqual(expected);
  });

  test('+', () => {
    const tokens = lexer.tokenize('+');
    const expected = [new Token(Lexeme.PLUS, TokenType.PUNCTUATOR, 0, 1, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('-', () => {
    const tokens = lexer.tokenize('-');
    const expected = [
      new Token(Lexeme.MINUS, TokenType.PUNCTUATOR, 0, 1, 1, 0),
    ];
    expect(tokens).toEqual(expected);
  });

  test('*', () => {
    const tokens = lexer.tokenize('*');
    const expected = [new Token(Lexeme.STAR, TokenType.PUNCTUATOR, 0, 1, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('/', () => {
    const tokens = lexer.tokenize('/');
    const expected = [
      new Token(Lexeme.SLASH, TokenType.PUNCTUATOR, 0, 1, 1, 0),
    ];
    expect(tokens).toEqual(expected);
  });

  test('^', () => {
    const tokens = lexer.tokenize('^');
    const expected = [
      new Token(Lexeme.CARET, TokenType.PUNCTUATOR, 0, 1, 1, 0),
    ];
    expect(tokens).toEqual(expected);
  });

  test('~', () => {
    const tokens = lexer.tokenize('~');
    const expected = [new Token(Lexeme.NOT, TokenType.PUNCTUATOR, 0, 1, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('%', () => {
    const tokens = lexer.tokenize('%');
    const expected = [new Token(Lexeme.MOD, TokenType.PUNCTUATOR, 0, 1, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('>=', () => {
    const tokens = lexer.tokenize('>=');
    const expected = [new Token(Lexeme.GEQ, TokenType.PUNCTUATOR, 0, 2, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('<=', () => {
    const tokens = lexer.tokenize('<=');
    const expected = [new Token(Lexeme.LEQ, TokenType.PUNCTUATOR, 0, 2, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('==', () => {
    const tokens = lexer.tokenize('==');
    const expected = [new Token(Lexeme.DEQ, TokenType.PUNCTUATOR, 0, 2, 1, 0)];
    expect(tokens).toEqual(expected);
  });

  test('~=', () => {
    const tokens = lexer.tokenize('~=');
    const expected = [
      new Token(Lexeme.NOTEQ, TokenType.PUNCTUATOR, 0, 2, 1, 0),
    ];
    expect(tokens).toEqual(expected);
  });

  test(':=', () => {
    const tokens = lexer.tokenize(':=');
    const expected = [
      new Token(Lexeme.ASSIGN, TokenType.PUNCTUATOR, 0, 2, 1, 0),
    ];
    expect(tokens).toEqual(expected);
  });
});

describe('Test special cases', () => {
  const lexer = new Lexer();

  test('Line count must end with 3', () => {
    lexer.tokenize('a = 1 + 2\nb = a * 2\nc = b + a');
    expect(lexer.line).toBe(3);
  });

  test('Must throw an error when unexpected token found', () => {
    expect(() => lexer.tokenize('hola@')).toThrowError();
  });
});

describe('Test programs', () => {
  const lexer = new Lexer();

  test('Program 1', () => {
    const program = `
      x := 0
      i := 1
      while i >= 10 do
        local x := 999 --> shadowing the previous x
        print x
        i := i + 1
      end
    `;
    const tokens = lexer.tokenize(program);

    const expected = [
      new Token('x', TokenType.IDENTIFIER, 7, 8, 2, 6),
      new Token(':=', TokenType.PUNCTUATOR, 9, 11, 2, 8),
      new Token('0', TokenType.INTEGER, 12, 13, 2, 11),
      new Token('i', TokenType.IDENTIFIER, 20, 21, 3, 6),
      new Token(':=', TokenType.PUNCTUATOR, 22, 24, 3, 8),
      new Token('1', TokenType.INTEGER, 25, 26, 3, 11),
      new Token('while', TokenType.KEYWORD, 33, 38, 4, 6),
      new Token('i', TokenType.IDENTIFIER, 39, 40, 4, 12),
      new Token('>=', TokenType.PUNCTUATOR, 41, 43, 4, 14),
      new Token('10', TokenType.INTEGER, 44, 46, 4, 17),
      new Token('do', TokenType.KEYWORD, 47, 49, 4, 20),
      new Token('local', TokenType.KEYWORD, 58, 63, 5, 8),
      new Token('x', TokenType.IDENTIFIER, 64, 65, 5, 14),
      new Token(':=', TokenType.PUNCTUATOR, 66, 68, 5, 16),
      new Token('999', TokenType.INTEGER, 69, 72, 5, 19),
      new Token('print', TokenType.KEYWORD, 110, 115, 6, 8),
      new Token('x', TokenType.IDENTIFIER, 116, 117, 6, 14),
      new Token('i', TokenType.IDENTIFIER, 126, 127, 7, 8),
      new Token(':=', TokenType.PUNCTUATOR, 128, 130, 7, 10),
      new Token('i', TokenType.IDENTIFIER, 131, 132, 7, 13),
      new Token('+', TokenType.PUNCTUATOR, 133, 134, 7, 15),
      new Token('1', TokenType.INTEGER, 135, 136, 7, 17),
      new Token('end', TokenType.KEYWORD, 143, 146, 8, 6),
    ];

    expect(tokens).toEqual(expected);
  });

  test('One line program with comment', () => {
    const program = 'x := 1 --> Assign';
    const tokens = lexer.tokenize(program);
    const expected = [
      new Token('x', TokenType.IDENTIFIER, 0, 1, 1, 0),
      new Token(':=', TokenType.PUNCTUATOR, 2, 4, 1, 2),
      new Token('1', TokenType.INTEGER, 5, 6, 1, 5),
    ];
    expect(tokens).toEqual(expected);
  });
});
