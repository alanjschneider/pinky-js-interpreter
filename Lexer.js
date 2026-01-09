import { CompilerError } from './CompilerError.js';
import { Token, TokenType, keywords, punctuators, spaces } from './Token.js';
import { isAlpha, isAlphaNum, isNumeric } from './utils.js';
import { Lexeme } from './Lexeme.js';

export class Lexer {
  constructor() {
    this.src = null;
    this.line = 1;
    this.cursor = 0;
    this.column = 0;
  }

  peek() {
    if (this.cursor >= this.src.length) return '\0';
    return this.src[this.cursor];
  }

  advance() {
    if (this.cursor >= this.src.length) return '\0';
    if (this.peek() === '\n') {
      this.line++;
      this.column = 0;
    } else {
      this.column++;
    }
    return this.src[this.cursor++];
  }

  match(lexeme) {
    if (this.peek() === '\0') return false;
    if (this.peek() !== lexeme) return false;
    this.advance();
    return true;
  }

  lookeahead() {
    return this.src[this.cursor + 1];
  }

  handleString(char, start) {
    while (this.peek() !== char && this.peek() !== '\0') this.advance();
    if (!this.match(char)) {
      throw new CompilerError('Unclosed string', this.line, this.cursor);
    }

    const string = this.src.slice(start + 1, this.cursor - 1);
    return new Token(
      string,
      TokenType.STRING,
      start,
      this.cursor,
      this.line,
      this.column - string.length - 2 // subsctract 2 because opening and closing tags
    );
  }

  handleIndentifier(start) {
    while (isAlphaNum(this.peek())) this.advance();
    const identifier = this.src.slice(start, this.cursor);
    const type = keywords.has(identifier)
      ? TokenType.KEYWORD
      : TokenType.IDENTIFIER;
    const isBoolean = [Lexeme.TRUE, Lexeme.FALSE].includes(identifier);
    return new Token(
      identifier,
      isBoolean ? TokenType.BOOLEAN : type,
      start,
      this.cursor,
      this.line,
      this.column - identifier.length
    );
  }

  handleNumeric(start) {
    while (isNumeric(this.peek())) this.advance();
    let type = TokenType.INTEGER;
    if (this.match('.')) {
      while (isNumeric(this.peek())) this.advance();
      type = TokenType.FLOAT;
    }
    const number = this.src.slice(start, this.cursor);
    return new Token(
      number,
      type,
      start,
      this.cursor,
      this.line,
      this.column - number.length
    );
  }

  tokenize(src) {
    this.src = src;
    this.line = 1;
    this.cursor = 0;
    this.column = 0;

    const tokens = [];

    while (this.peek() !== '\0') {
      const start = this.cursor;
      const char = this.advance();

      if (spaces.has(char)) {
        continue;
      } else if (char === '"' || char === "'") {
        tokens.push(this.handleString(char, start));
      } else if (punctuators.has(char)) {
        let lexeme = char;

        // ignore comments
        if (lexeme === Lexeme.MINUS && this.match(Lexeme.MINUS)) {
          while (this.peek() !== '\n' && this.peek() !== '\0') this.advance();
          continue;
        }

        if (lexeme === Lexeme.COLON && this.match(Lexeme.EQ)) {
          lexeme = Lexeme.ASSIGN;
        } else if (lexeme === Lexeme.EQ && this.match(Lexeme.EQ)) {
          lexeme = Lexeme.DEQ;
        } else if (lexeme === Lexeme.GT && this.match(Lexeme.EQ)) {
          lexeme = Lexeme.GEQ;
        } else if (lexeme === Lexeme.LT && this.match(Lexeme.EQ)) {
          lexeme = Lexeme.LEQ;
        } else if (lexeme === Lexeme.NOT && this.match(Lexeme.EQ)) {
          lexeme = Lexeme.NOTEQ;
        }

        tokens.push(
          new Token(
            lexeme,
            TokenType.PUNCTUATOR,
            start,
            this.cursor,
            this.line,
            this.column - lexeme.length
          )
        );
      } else if (isAlpha(char)) {
        tokens.push(this.handleIndentifier(start));
      } else if (isNumeric(char)) {
        tokens.push(this.handleNumeric(start));
      } else {
        throw new CompilerError(
          `Unexpected token ${char}`,
          this.line,
          this.column - char.length
        );
      }
    }

    return tokens;
  }
}
