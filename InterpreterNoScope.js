import { AssignmentStatement } from './ast/AssignmentStatement.js';
import { BinaryExpression } from './ast/BinaryExpression.js';
import { Float } from './ast/Float.js';
import { FunctionCall } from './ast/FunctionCall.js';
import { FunctionDeclaration } from './ast/FunctionDeclaration.js';
import { Identifier } from './ast/Identifier.js';
import { Integer } from './ast/Integer.js';
import { PrintStatement } from './ast/PrintStatement.js';
import { ReturnStatement } from './ast/ReturnStatement.js';
import { String } from './ast/String.js';
import { IfStatement } from './ast/IfStatement.js';
import { Lexeme } from './Lexeme.js';
import { WhileStatement } from './ast/WhileStatement.js';
import { Boolean } from './ast/Boolean.js';
import { ForStatement } from './ast/ForStatement.js';
import { UnaryExpression } from './ast/UnaryExpression.js';
import { Grouping } from './ast/Grouping.js';

export class Interpreter {
  constructor() {
    this.variables = {};
    this.functions = {};
  }

  expr(ast) {
    if (ast instanceof Float) {
      return parseFloat(ast.value);
    } else if (ast instanceof Integer) {
      return parseInt(ast.value);
    } else if (ast instanceof String) {
      return ast.value;
    } else if (ast instanceof Grouping) {
      return this.expr(ast.expression);
    } else if (ast instanceof UnaryExpression) {
      const op = ast.op;
      const value = this.expr(ast.value);
      if (op === Lexeme.MINUS) return -value;
      else if (op === Lexeme.PLUS) return +value;
      else if (op === Lexeme.NOT) return !value;
    } else if (ast instanceof Boolean) {
      if (ast.value === Lexeme.TRUE) return true;
      if (ast.value === Lexeme.FALSE) return false;
    } else if (ast instanceof Identifier) {
      if (!(ast.value in this.variables)) {
        throw new Error('Undeclared variable');
      }
      return this.variables[ast.value];
    } else if (ast instanceof BinaryExpression) {
      const op = ast.op;
      const left = this.expr(ast.left);
      const right = this.expr(ast.right);

      if (op === Lexeme.PLUS) {
        return left + right;
      } else if (op === Lexeme.MINUS) {
        if (typeof left === 'number' && typeof right === 'number') {
          return left - right;
        }
        throw new Error("Can't substract strings");
      } else if (op === Lexeme.STAR) {
        return left * right;
      } else if (op === Lexeme.SLASH) {
        return left / right;
      } else if (op === Lexeme.GT) {
        return left > right;
      } else if (op === Lexeme.GEQ) {
        return left >= right;
      } else if (op === Lexeme.LT) {
        return left < right;
      } else if (op === Lexeme.LEQ) {
        return left >= right;
      } else if (op === Lexeme.DEQ) {
        return left == right;
      } else if (op === Lexeme.AND) {
        return left && right;
      } else if (op === Lexeme.OR) {
        return left || right;
      } else if (op === Lexeme.MOD) {
        return left % right;
      } else if (op === Lexeme.CARET) {
        return Math.pow(left, right);
      }
    } else if (ast instanceof FunctionCall) {
      if (!(ast.identifier.value in this.functions)) {
        throw new Error('Undeclared function');
      }

      const func = this.functions[ast.identifier.value];
      const args = func.args;

      for (let i = 0; i < args.length; i++) {
        const name = args[i].value;
        const value = this.expr(ast.args[i]);
        this.variables[name] = value;
      }

      const ret = this.run(func.body);

      for (let i = 0; i < args.length; i++) {
        const name = args[i];
        delete this.variables[name];
      }

      return ret;
    }
  }

  statement(stmt) {
    if (stmt instanceof AssignmentStatement) {
      this.variables[stmt.identifier] = this.expr(stmt.expression);
    } else if (stmt instanceof FunctionDeclaration) {
      this.functions[stmt.name.value] = stmt;
    } else if (stmt instanceof ReturnStatement) {
      return this.expr(stmt.expression);
    } else if (stmt instanceof IfStatement) {
      const expr = this.expr(stmt.expression);
      if (expr) return this.run(stmt.body);
      else if (stmt.elifStatemts.length > 0) {
        for (const elif of stmt.elifStatemts) {
          const expr = this.expr(elif.expression);
          if (expr) return this.run(elif.body);
        }
      } else if (stmt.elseStatement !== null) {
        return this.run(stmt.elseStatement.body);
      }
    } else if (stmt instanceof WhileStatement) {
      while (this.expr(stmt.expression)) {
        const ret = this.run(stmt.body);
        if (ret !== undefined) return ret;
      }
    } else if (stmt instanceof ForStatement) {
      this.statement(stmt.assignment);
      const varName = stmt.assignment.identifier;
      let i = this.variables[varName];
      const max = this.expr(stmt.max);
      const step = this.expr(stmt.step);
      while (i < max) {
        const ret = this.run(stmt.body);
        if (ret !== undefined) {
          delete this.variables[varName];
          return ret;
        }
        i += step;
        this.variables[varName] = i;
      }
      delete this.variables[varName];
    } else if (stmt instanceof PrintStatement) {
      console.log(this.expr(stmt.expression));
    } else {
      this.expr(stmt);
    }
  }

  run(program) {
    for (const statement of program.statements) {
      const ret = this.statement(statement);
      if (ret !== undefined) return ret;
    }
  }
}
