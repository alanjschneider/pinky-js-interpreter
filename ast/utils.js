import { BinaryExpression } from './BinaryExpression.js';
import { Integer } from './Integer.js';
import { Float } from './Float.js';
import { Identifier } from './Identifier.js';
import { Statements } from './Statements.js';
import { ReturnStatement } from './ReturnStatement.js';
import { AssignmentStatement } from './AssignmentStatement.js';
import { UnaryExpression } from './UnaryExpression.js';
import { FunctionDeclaration } from './FunctionDeclaration.js';
import { Boolean } from './Boolean.js';
import { String } from './String.js';
import { WhileStatement } from './WhileStatement.js';
import { Grouping } from './Grouping.js';
import { FunctionCall } from './FunctionCall.js';
import { ForStatement } from './ForStatement.js';
import { IfStatement } from './IfStatement.js';
import { PrintStatement } from './PrintStatement.js';
import { PrintlnStatement } from './PrintlnStatement.js';

export function astToString(ast, spaces = 0) {
  let str = ' '.repeat(spaces);

  if (ast instanceof Integer || ast instanceof Float) {
    str += `Number ${ast.value}`;
  } else if (ast instanceof BinaryExpression) {
    const left = astToString(ast.left, spaces + 2);
    const right = astToString(ast.right, spaces + 2);
    str += `BinaryExpression ${ast.op} \n${left} \n${right}`;
  } else if (ast instanceof UnaryExpression) {
    const value = astToString(ast.value, spaces + 2);
    str += `UnaryExpression ${ast.op} \n${value}`;
  } else if (ast instanceof Identifier) {
    str += `Identifier ${ast.value}`;
  } else if (ast instanceof Grouping) {
    str += `Grouping (\n${astToString(ast.expression, spaces + 2)}\n`;
    str += ' '.repeat(spaces) + ')';
  } else if (ast instanceof Boolean) {
    str += `Boolean ${ast.value}`;
  } else if (ast instanceof String) {
    str += `String "${ast.value}"`;
  } else if (ast instanceof Statements) {
    str += `Statements [\n`;
    for (const statement of ast.statements) {
      str += `${astToString(statement, spaces + 2)}\n`;
    }
    str += ' '.repeat(spaces) + ']';
  } else if (ast instanceof AssignmentStatement) {
    const expr = astToString(ast.expression, spaces + 2);
    str += `Assignment ${ast.identifier} := \n${expr}`;
  } else if (ast instanceof ReturnStatement) {
    str += `Return \n${astToString(ast.expression, spaces + 2)}`;
  } else if (ast instanceof FunctionCall) {
    const args = ast.args
      .map((arg) => `${astToString(arg, spaces + 2)}`)
      .join('\n');
    str += `FunctionCall ${ast.identifier.value} (\n${args}\n`;
    str += ' '.repeat(spaces) + ')';
  } else if (ast instanceof ForStatement) {
    const assignment = astToString(ast.assignment, spaces + 2);
    const max = astToString(ast.max, spaces + 2);
    const step = astToString(ast.step, spaces + 2);
    const body = astToString(ast.body, spaces + 2);
    str += `For \n${assignment}\n${max}\n${step}\n${body}\n`;
    str += ' '.repeat(spaces) + `End For`;
  } else if (ast instanceof FunctionDeclaration) {
    const args = ast.args.map((arg) => `${astToString(arg)}`).join(', ');
    const body = astToString(ast.body, spaces + 2);
    str += `Function ${ast.name.value} (${args}) \n${body}\n`;
    str += ' '.repeat(spaces) + `End ${ast.name.value}`;
  } else if (ast instanceof WhileStatement) {
    const expr = astToString(ast.expression, spaces + 2);
    const body = astToString(ast.body, spaces + 2);
    str += `While \n${expr} \n${body}\n`;
    str += ' '.repeat(spaces) + `End While`;
  } else if (ast instanceof PrintStatement) {
    const expr = astToString(ast.expression, spaces + 2);
    str += `Print\n${expr}`;
  } else if (ast instanceof PrintlnStatement) {
    const expr = astToString(ast.expression, spaces + 2);
    str += `Println\n${expr}`;
  } else if (ast instanceof IfStatement) {
    const expr = astToString(ast.expression, spaces + 2);
    const body = astToString(ast.body, spaces + 2);
    str += `If \n${expr} \n${body}\n`;

    if (ast.elifStatemts.length > 0) {
      for (const elif of ast.elifStatemts) {
        const expr = astToString(elif.expression, spaces + 2);
        const body = astToString(elif.body, spaces + 2);
        str += ' '.repeat(spaces) + `Elif \n${expr} \n${body}\n`;
      }
    }

    if (ast.elseStatement !== null) {
      const body = astToString(ast.elseStatement.body, spaces + 2);
      str += ' '.repeat(spaces) + `Else\n${body}\n`;
    }

    str += ' '.repeat(spaces) + `End If`;
  }

  return str;
}
