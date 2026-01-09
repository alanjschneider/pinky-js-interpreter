import { AssignmentStatement } from './ast/AssignmentStatement.js';
import { BinaryExpression } from './ast/BinaryExpression.js';
import { Float } from './ast/Float.js';
import { FunctionCall } from './ast/FunctionCall.js';
import { FunctionDeclaration } from './ast/FunctionDeclaration.js';
import { Identifier } from './ast/Identifier.js';
import { Integer } from './ast/Integer.js';
import { PrintStatement } from './ast/PrintStatement.js';
import { PrintlnStatement } from './ast/PrintlnStatement.js';
import { ReturnStatement } from './ast/ReturnStatement.js';
import { String } from './ast/String.js';
import { IfStatement } from './ast/IfStatement.js';
import { Lexeme } from './Lexeme.js';
import { WhileStatement } from './ast/WhileStatement.js';
import { Boolean } from './ast/Boolean.js';
import { ForStatement } from './ast/ForStatement.js';
import { UnaryExpression } from './ast/UnaryExpression.js';
import { Grouping } from './ast/Grouping.js';
import { Scope } from './Scope.js';

export class Interpreter {
  constructor() {
    this.scope = null;
    this.prints = [];
  }

  expr(ast, scope) {
    if (ast instanceof Float) {
      return parseFloat(ast.value);
    } else if (ast instanceof Integer) {
      return parseInt(ast.value);
    } else if (ast instanceof String) {
      return ast.value;
    } else if (ast instanceof Grouping) {
      return this.expr(ast.expression, scope);
    } else if (ast instanceof UnaryExpression) {
      const op = ast.op;
      const value = this.expr(ast.value, scope);
      if (op === Lexeme.MINUS) return -value;
      else if (op === Lexeme.PLUS) return +value;
      else if (op === Lexeme.NOT) return !value;
    } else if (ast instanceof Boolean) {
      if (ast.value === Lexeme.TRUE) return true;
      if (ast.value === Lexeme.FALSE) return false;
    } else if (ast instanceof Identifier) {
      const value = scope.findVarScope(ast.value).variables[ast.value];
      if (value !== undefined) return value;
      throw new Error(`Undeclared variable: ${ast.value} at line ${ast.line}`);
    } else if (ast instanceof BinaryExpression) {
      const op = ast.op;
      const left = this.expr(ast.left, scope);
      const right = this.expr(ast.right, scope);

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
        return left <= right;
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
      const funcScope = scope.findFuncScope(ast.identifier.value);
      if (!(ast.identifier.value in funcScope.functions)) {
        throw new Error(`Undeclared function: ${ast.identifier.value}`);
      }

      const localScope = new Scope(scope);
      const func = funcScope.functions[ast.identifier.value];
      const args = func.args;

      for (let i = 0; i < args.length; i++) {
        const name = args[i].value;
        const value = this.expr(ast.args[i], localScope);
        localScope.variables[name] = value;
      }

      return this.run(func.body, localScope);
    }
  }

  statement(stmt, scope) {
    if (stmt instanceof AssignmentStatement) {
      if (stmt.isLocal) {
        if (stmt.identifier in scope.variables) {
          throw new Error(`Local variable "${stmt.identifier}" already exists`);
        }
        scope.variables[stmt.identifier] = this.expr(stmt.expression, scope);
      } else if (stmt.identifier in scope.variables) {
        scope.variables[stmt.identifier] = this.expr(stmt.expression, scope);
      } else {
        const globalScope = scope.findVarScope(stmt.identifier);
        // expression needs local scope
        const value = this.expr(stmt.expression, scope);
        globalScope.variables[stmt.identifier] = value;
      }
    } else if (stmt instanceof FunctionDeclaration) {
      scope.functions[stmt.name.value] = stmt;
    } else if (stmt instanceof ReturnStatement) {
      return this.expr(stmt.expression, scope);
    } else if (stmt instanceof IfStatement) {
      const expr = this.expr(stmt.expression, scope);
      const localScope = new Scope(scope);
      if (expr) return this.run(stmt.body, localScope);
      else if (stmt.elifStatemts.length > 0) {
        for (const elif of stmt.elifStatemts) {
          const expr = this.expr(elif.expression, scope);
          const localScope = new Scope(scope);
          if (expr) return this.run(elif.body, localScope);
        }
      }

      if (stmt.elseStatement !== null) {
        const localScope = new Scope(scope);
        return this.run(stmt.elseStatement.body, localScope);
      }
    } else if (stmt instanceof WhileStatement) {
      while (this.expr(stmt.expression, scope)) {
        const whileScope = new Scope(scope);
        const ret = this.run(stmt.body, whileScope);
        if (ret !== undefined) return ret;
      }
    } else if (stmt instanceof ForStatement) {
      const forScope = new Scope(scope);
      this.statement(stmt.assignment, forScope);
      const varName = stmt.assignment.identifier;
      let i = forScope.variables[varName];
      const max = this.expr(stmt.max, scope);
      const step = this.expr(stmt.step, scope);
      while (i < max) {
        const ret = this.run(stmt.body, forScope);
        if (ret !== undefined) return ret;
        i += step;
        forScope.variables[varName] = i;
      }
    } else if (stmt instanceof PrintStatement) {
      const str = `${this.expr(stmt.expression, scope)}`;
      process.stdout.write(str);
      this.prints.push(str);
    } else if (stmt instanceof PrintlnStatement) {
      const str = `${this.expr(stmt.expression, scope)}\n`;
      process.stdout.write(str);
      this.prints.push(str);
    } else {
      this.expr(stmt, scope);
    }
  }

  run(program, scope) {
    for (const statement of program.statements) {
      const ret = this.statement(statement, scope);
      if (ret !== undefined) return ret;
    }
  }

  interpret(ast) {
    this.scope = new Scope();
    this.prints = [];
    return this.run(ast, this.scope);
  }
}
