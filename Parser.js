import { TokenType } from './Token.js';
import { Lexeme } from './Lexeme.js';
import { AssignmentStatement } from './ast/AssignmentStatement.js';
import { CompilerError } from './CompilerError.js';
import { Statements } from './ast/Statements.js';
import { Identifier } from './ast/Identifier.js';
import { FunctionDeclaration } from './ast/FunctionDeclaration.js';
import { ReturnStatement } from './ast/ReturnStatement.js';
import { Integer } from './ast/Integer.js';
import { Float } from './ast/Float.js';
import { String } from './ast/String.js';
import { Boolean } from './ast/Boolean.js';
import { BinaryExpression } from './ast/BinaryExpression.js';
import { UnaryExpression } from './ast/UnaryExpression.js';
import { WhileStatement } from './ast/WhileStatement.js';
import { Grouping } from './ast/Grouping.js';
import { FunctionCall } from './ast/FunctionCall.js';
import { ForStatement } from './ast/ForStatement.js';
import { ElseStatement, IfStatement } from './ast/IfStatement.js';
import { PrintStatement } from './ast/PrintStatement.js';
import { PrintlnStatement } from './ast/PrintlnStatement.js';

export class Parser {
  constructor() {
    this.cursor = 0;
    this.tokens = [];
  }

  lookahead() {
    return this.tokens[this.cursor + 1];
  }

  lookbehind() {
    return this.tokens[this.cursor - 1];
  }

  peek() {
    return this.tokens[this.cursor];
  }

  advance() {
    return this.tokens[this.cursor++];
  }

  match(type, lexeme = null) {
    if (this.cursor >= this.tokens.length) return false;
    if (this.peek().type !== type) return false;
    if (lexeme !== null && this.peek().lexeme !== lexeme) return false;
    this.advance();
    return true;
  }

  primary() {
    if (this.match(TokenType.INTEGER)) {
      return new Integer(this.lookbehind().lexeme);
    } else if (this.match(TokenType.FLOAT)) {
      return new Float(this.lookbehind().lexeme);
    } else if (this.match(TokenType.IDENTIFIER)) {
      const identifier = new Identifier(
        this.lookbehind().lexeme,
        this.lookbehind().line
      );
      if (this.match(TokenType.PUNCTUATOR, Lexeme.LPAREN)) {
        const args = [];
        while (!this.match(TokenType.PUNCTUATOR, Lexeme.RPAREN)) {
          args.push(this.expr());
          if (this.peek().lexeme === Lexeme.COMMA) this.advance();
          if (this.cursor >= this.tokens.length) {
            throw new CompilerError(`Unclosed parenthesis`);
          }
        }
        return new FunctionCall(identifier, args);
      }
      return identifier;
    } else if (this.match(TokenType.BOOLEAN)) {
      return new Boolean(this.lookbehind().lexeme);
    } else if (this.match(TokenType.STRING)) {
      return new String(this.lookbehind().lexeme);
    } else if (this.match(TokenType.PUNCTUATOR, Lexeme.LPAREN)) {
      const expression = this.expr();
      if (!this.match(TokenType.PUNCTUATOR, Lexeme.RPAREN)) {
        throw new CompilerError(`Unclosed parenthesis`);
      }
      return new Grouping(expression);
    } else {
      throw new CompilerError(`Unknown token ${this.peek().lexeme}`);
    }
  }

  exp() {
    let expr = this.primary();
    while (this.match(TokenType.PUNCTUATOR, Lexeme.CARET)) {
      const op = this.lookbehind().lexeme;
      expr = new BinaryExpression(op, expr, this.exp());
    }
    return expr;
  }

  unary() {
    while (
      this.match(TokenType.PUNCTUATOR, Lexeme.MINUS) ||
      this.match(TokenType.PUNCTUATOR, Lexeme.PLUS) ||
      this.match(TokenType.PUNCTUATOR, Lexeme.NOT)
    ) {
      const op = this.lookbehind().lexeme;
      return new UnaryExpression(op, this.unary());
    }
    return this.exp();
  }

  mod() {
    let expr = this.unary();
    while (this.match(TokenType.PUNCTUATOR, Lexeme.MOD)) {
      const op = this.lookbehind().lexeme;
      const right = this.unary();
      expr = new BinaryExpression(op, expr, right);
    }
    return expr;
  }

  mult() {
    let expr = this.mod();
    while (
      this.match(TokenType.PUNCTUATOR, Lexeme.STAR) ||
      this.match(TokenType.PUNCTUATOR, Lexeme.SLASH)
    ) {
      const op = this.lookbehind().lexeme;
      const right = this.mod();
      expr = new BinaryExpression(op, expr, right);
    }
    return expr;
  }

  addition() {
    let expr = this.mult();
    while (
      this.match(TokenType.PUNCTUATOR, Lexeme.PLUS) ||
      this.match(TokenType.PUNCTUATOR, Lexeme.MINUS)
    ) {
      const op = this.lookbehind().lexeme;
      const right = this.mult();
      expr = new BinaryExpression(op, expr, right);
    }
    return expr;
  }

  comp() {
    let expr = this.addition();
    while (
      this.match(TokenType.PUNCTUATOR, Lexeme.LT) ||
      this.match(TokenType.PUNCTUATOR, Lexeme.LEQ) ||
      this.match(TokenType.PUNCTUATOR, Lexeme.GT) ||
      this.match(TokenType.PUNCTUATOR, Lexeme.GEQ)
    ) {
      const op = this.lookbehind().lexeme;
      const right = this.addition();
      expr = new BinaryExpression(op, expr, right);
    }
    return expr;
  }

  eq() {
    let expr = this.comp();
    while (
      this.match(TokenType.PUNCTUATOR, Lexeme.DEQ) ||
      this.match(TokenType.PUNCTUATOR, Lexeme.NOTEQ)
    ) {
      const op = this.lookbehind().lexeme;
      const right = this.comp();
      expr = new BinaryExpression(op, expr, right);
    }
    return expr;
  }

  logicalAnd() {
    let expr = this.eq();
    while (this.match(TokenType.KEYWORD, Lexeme.AND)) {
      const op = this.lookbehind().lexeme;
      const right = this.eq();
      expr = new BinaryExpression(op, expr, right);
    }
    return expr;
  }

  logicalOr() {
    let expr = this.logicalAnd();
    while (this.match(TokenType.KEYWORD, Lexeme.OR)) {
      const op = this.lookbehind().lexeme;
      const right = this.logicalAnd();
      expr = new BinaryExpression(op, expr, right);
    }
    return expr;
  }

  expr() {
    return this.logicalOr();
  }

  assignment(isLocal = false) {
    const identifier = this.advance().lexeme;
    if (this.match(TokenType.PUNCTUATOR, Lexeme.ASSIGN)) {
      return new AssignmentStatement(identifier, this.expr(), isLocal);
    }
  }

  func() {
    const line = this.peek().line;
    const identifier = new Identifier(this.advance().lexeme, line);
    if (this.match(TokenType.PUNCTUATOR, Lexeme.LPAREN)) {
      const args = [];
      while (!this.match(TokenType.PUNCTUATOR, Lexeme.RPAREN)) {
        const line = this.peek().line;
        args.push(new Identifier(this.advance().lexeme, line));
        if (this.peek().lexeme === Lexeme.COMMA) this.advance();
      }

      const body = [];
      while (!this.match(TokenType.KEYWORD, Lexeme.END)) {
        body.push(this.statement());
      }

      return new FunctionDeclaration(identifier, args, new Statements(body));
    }
  }

  ret() {
    return new ReturnStatement(this.expr());
  }

  whileLoop() {
    const expression = this.expr();
    const body = [];
    if (this.match(TokenType.KEYWORD, Lexeme.DO)) {
      while (!this.match(TokenType.KEYWORD, Lexeme.END)) {
        body.push(this.statement());
      }
      return new WhileStatement(expression, new Statements(body));
    }
    throw new CompilerError('Expected "do" keyword');
  }

  forLoop() {
    const assignment = this.assignment(true); // force to local
    if (!this.match(TokenType.PUNCTUATOR, Lexeme.COMMA)) {
      throw new CompilerError('Expected ","');
    }
    const max = this.expr();
    let step = new Integer('1');
    if (this.match(TokenType.PUNCTUATOR, Lexeme.COMMA)) {
      step = this.expr();
    }

    if (this.match(TokenType.KEYWORD, Lexeme.DO)) {
      const body = [];
      while (!this.match(TokenType.KEYWORD, Lexeme.END)) {
        body.push(this.statement());
      }
      return new ForStatement(assignment, max, step, new Statements(body));
    }
    throw new CompilerError('Expected "do" keyword');
  }

  ifStatement() {
    const expression = this.expr();
    if (this.match(TokenType.KEYWORD, Lexeme.THEN)) {
      const body = [];
      while (
        !this.match(TokenType.KEYWORD, Lexeme.ELIF) &&
        !this.match(TokenType.KEYWORD, Lexeme.ELSE) &&
        !this.match(TokenType.KEYWORD, Lexeme.END)
      ) {
        body.push(this.statement());
      }

      let elifStatments = [];
      while (this.lookbehind().lexeme === Lexeme.ELIF) {
        const expression = this.expr();
        if (this.match(TokenType.KEYWORD, Lexeme.THEN)) {
          const body = [];
          while (
            !this.match(TokenType.KEYWORD, Lexeme.ELIF) &&
            !this.match(TokenType.KEYWORD, Lexeme.ELSE) &&
            !this.match(TokenType.KEYWORD, Lexeme.END)
          ) {
            body.push(this.statement());
          }
          elifStatments.push(new IfStatement(expression, new Statements(body)));
        }
      }

      let elseStatement = null;
      if (this.lookbehind().lexeme === Lexeme.ELSE) {
        const body = [];
        while (!this.match(TokenType.KEYWORD, Lexeme.END)) {
          body.push(this.statement());
        }
        elseStatement = new ElseStatement(new Statements(body));
      }

      return new IfStatement(
        expression,
        new Statements(body),
        elifStatments,
        elseStatement
      );
    }
    throw new CompilerError('Expected "then" keyword');
  }

  print() {
    return new PrintStatement(this.expr());
  }

  println() {
    return new PrintlnStatement(this.expr());
  }

  statement() {
    if (this.match(TokenType.KEYWORD, Lexeme.FUNC)) {
      return this.func();
    } else if (this.match(TokenType.KEYWORD, Lexeme.FOR)) {
      return this.forLoop();
    } else if (this.match(TokenType.KEYWORD, Lexeme.LOCAL)) {
      return this.assignment(true);
    } else if (
      this.peek().type === TokenType.IDENTIFIER &&
      this.lookahead() && // maybe undefined
      this.lookahead().lexeme === Lexeme.ASSIGN
    ) {
      return this.assignment();
    } else if (this.match(TokenType.KEYWORD, Lexeme.RET)) {
      return this.ret();
    } else if (this.match(TokenType.KEYWORD, Lexeme.WHILE)) {
      return this.whileLoop();
    } else if (this.match(TokenType.KEYWORD, Lexeme.IF)) {
      return this.ifStatement();
    } else if (this.match(TokenType.KEYWORD, Lexeme.PRINT)) {
      return this.print();
    } else if (this.match(TokenType.KEYWORD, Lexeme.PRINTLN)) {
      return this.println();
    }
    return this.expr();
  }

  program() {
    const statements = [];
    while (this.cursor < this.tokens.length) {
      statements.push(this.statement());
    }
    return new Statements(statements);
  }

  parse(tokens) {
    this.tokens = tokens;
    this.cursor = 0;

    return this.program();
  }
}
