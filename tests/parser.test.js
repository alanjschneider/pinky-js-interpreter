import { describe, test, expect } from 'vitest';
import { Lexer } from '../Lexer.js';
import { Parser } from '../Parser.js';
import { Integer } from '../ast/Integer.js';
import { Float } from '../ast/Float.js';
import { Statements } from '../ast/Statements.js';
import { String } from '../ast/String.js';
import { Boolean } from '../ast/Boolean.js';
import { Identifier } from '../ast/Identifier.js';
import { Grouping } from '../ast/Grouping.js';
import { BinaryExpression } from '../ast/BinaryExpression.js';
import { AssignmentStatement } from '../ast/AssignmentStatement.js';
import { ForStatement } from '../ast/ForStatement.js';
import { PrintStatement } from '../ast/PrintStatement.js';
import { PrintlnStatement } from '../ast/PrintlnStatement.js';
import { FunctionCall } from '../ast/FunctionCall.js';
import { FunctionDeclaration } from '../ast/FunctionDeclaration.js';
import { ReturnStatement } from '../ast/ReturnStatement.js';
import { ElseStatement, IfStatement } from '../ast/IfStatement.js';
import { WhileStatement } from '../ast/WhileStatement.js';
import { UnaryExpression } from '../ast/UnaryExpression.js';

describe('primary', () => {
  const parser = new Parser();
  const lexer = new Lexer();

  test('integer', () => {
    const tokens = lexer.tokenize('999');
    const ast = parser.parse(tokens);
    const expected = new Statements([new Integer('999')]);

    expect(ast).toEqual(expected);
  });

  test('float', () => {
    const tokens = lexer.tokenize('3.1416');
    const ast = parser.parse(tokens);
    const expected = new Statements([new Float('3.1416')]);

    expect(ast).toEqual(expected);
  });

  test('string', () => {
    const tokens = lexer.tokenize('"hello world"');
    const ast = parser.parse(tokens);
    const expected = new Statements([new String('hello world')]);

    expect(ast).toEqual(expected);
  });

  test('identifier', () => {
    const tokens = lexer.tokenize('x');
    const ast = parser.parse(tokens);
    const expected = new Statements([new Identifier('x', 1)]);

    expect(ast).toEqual(expected);
  });

  test('boolean true', () => {
    const tokens = lexer.tokenize('true');
    const ast = parser.parse(tokens);
    const expected = new Statements([new Boolean('true')]);

    expect(ast).toEqual(expected);
  });

  test('boolean false', () => {
    const tokens = lexer.tokenize('false');
    const ast = parser.parse(tokens);
    const expected = new Statements([new Boolean('false')]);

    expect(ast).toEqual(expected);
  });
});

describe('assignment', () => {
  const parser = new Parser();
  const lexer = new Lexer();

  test('global', () => {
    const tokens = lexer.tokenize('x := 300');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new AssignmentStatement('x', new Integer('300'), false),
    ]);

    expect(ast).toEqual(expected);
  });

  test('local', () => {
    const tokens = lexer.tokenize('local x := 300');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new AssignmentStatement('x', new Integer('300'), true),
    ]);

    expect(ast).toEqual(expected);
  });

  test('assign expression', () => {
    const tokens = lexer.tokenize('x := 33 + 99');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new AssignmentStatement(
        'x',
        new BinaryExpression('+', new Integer('33'), new Integer('99')),
        false
      ),
    ]);

    expect(ast).toEqual(expected);
  });

  test('assign function result', () => {
    const tokens = lexer.tokenize('x := random()');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new AssignmentStatement(
        'x',
        new FunctionCall(new Identifier('random', 1), []),
        false
      ),
    ]);

    expect(ast).toEqual(expected);
  });
});

describe('grouping', () => {
  const parser = new Parser();
  const lexer = new Lexer();

  test('simple', () => {
    const tokens = lexer.tokenize('(10)');
    const ast = parser.parse(tokens);
    const expected = new Statements([new Grouping(new Integer('10'))]);
    expect(ast).toEqual(expected);
  });

  test('nested', () => {
    const tokens = lexer.tokenize('(((10)))');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new Grouping(new Grouping(new Grouping(new Integer('10')))),
    ]);
    expect(ast).toEqual(expected);
  });
});

describe('binary expression', () => {
  const parser = new Parser();
  const lexer = new Lexer();

  test('simple', () => {
    const tokens = lexer.tokenize('20 + 50');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new BinaryExpression('+', new Integer('20'), new Integer('50')),
    ]);
    expect(ast).toEqual(expected);
  });

  test('with precedence', () => {
    const tokens = lexer.tokenize('20 + 50 * 2');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new BinaryExpression(
        '+',
        new Integer('20'),
        new BinaryExpression('*', new Integer('50'), new Integer('2'))
      ),
    ]);
    expect(ast).toEqual(expected);
  });

  test('with grouping', () => {
    const tokens = lexer.tokenize('(20 + 50) * 2');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new BinaryExpression(
        '*',
        new Grouping(
          new BinaryExpression('+', new Integer('20'), new Integer('50'))
        ),
        new Integer('2')
      ),
    ]);
    expect(ast).toEqual(expected);
  });

  test('complex', () => {
    const tokens = lexer.tokenize('((20 + 50) * (2 / 3)) ^ 2');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new BinaryExpression(
        '^',
        new Grouping(
          new BinaryExpression(
            '*',
            new Grouping(
              new BinaryExpression('+', new Integer('20'), new Integer('50'))
            ),
            new Grouping(
              new BinaryExpression('/', new Integer('2'), new Integer('3'))
            )
          )
        ),
        new Integer('2')
      ),
    ]);
    expect(ast).toEqual(expected);
  });
});

describe('unary expression', () => {
  const parser = new Parser();
  const lexer = new Lexer();

  test('minus', () => {
    const tokens = lexer.tokenize('-10');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new UnaryExpression('-', new Integer('10')),
    ]);
    expect(ast).toEqual(expected);
  });

  test('plus', () => {
    const tokens = lexer.tokenize('+10');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new UnaryExpression('+', new Integer('10')),
    ]);
    expect(ast).toEqual(expected);
  });

  test('not', () => {
    const tokens = lexer.tokenize('~true');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new UnaryExpression('~', new Boolean('true')),
    ]);
    expect(ast).toEqual(expected);
  });

  test('many not', () => {
    const tokens = lexer.tokenize('~~~false');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new UnaryExpression(
        '~',
        new UnaryExpression('~', new UnaryExpression('~', new Boolean('false')))
      ),
    ]);
    expect(ast).toEqual(expected);
  });
});

describe('while statement', () => {
  const parser = new Parser();
  const lexer = new Lexer();

  test('with one arg', () => {
    const tokens = lexer.tokenize(
      'i := 0\nwhile i < 15 do\n  println "i: " + i\nend'
    );
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new AssignmentStatement('i', new Integer('0'), false),
      new WhileStatement(
        new BinaryExpression('<', new Identifier('i', 2), new Integer('15')),
        new Statements([
          new PrintlnStatement(
            new BinaryExpression('+', new String('i: '), new Identifier('i', 3))
          ),
        ])
      ),
    ]);
    expect(ast).toEqual(expected);
  });
});

describe('function declarations', () => {
  const parser = new Parser();
  const lexer = new Lexer();

  test('with one arg', () => {
    const tokens = lexer.tokenize(
      'func greet(name)\n  println "Hello " + name\nend'
    );
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new FunctionDeclaration(
        new Identifier('greet', 1),
        [new Identifier('name', 1)],
        new Statements([
          new PrintlnStatement(
            new BinaryExpression(
              '+',
              new String('Hello '),
              new Identifier('name', 2)
            )
          ),
        ])
      ),
    ]);
    expect(ast).toEqual(expected);
  });

  test('with many arg', () => {
    const tokens = lexer.tokenize(
      'func greet(prefix, name, surname)\n  println prefix + " " + name + " " + surname\nend'
    );
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new FunctionDeclaration(
        new Identifier('greet', 1),
        [
          new Identifier('prefix', 1),
          new Identifier('name', 1),
          new Identifier('surname', 1),
        ],
        new Statements([
          new PrintlnStatement(
            new BinaryExpression(
              '+',
              new BinaryExpression(
                '+',
                new BinaryExpression(
                  '+',
                  new BinaryExpression(
                    '+',
                    new Identifier('prefix', 2),
                    new String(' ')
                  ),
                  new Identifier('name', 2)
                ),
                new String(' ')
              ),
              new Identifier('surname', 2)
            )
          ),
        ])
      ),
    ]);
    expect(ast).toEqual(expected);
  });

  test('with return', () => {
    const tokens = lexer.tokenize(
      'func greet(name)\n  ret "Hello " + name\nend'
    );
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new FunctionDeclaration(
        new Identifier('greet', 1),
        [new Identifier('name', 1)],
        new Statements([
          new ReturnStatement(
            new BinaryExpression(
              '+',
              new String('Hello '),
              new Identifier('name', 2)
            )
          ),
        ])
      ),
    ]);
    expect(ast).toEqual(expected);
  });
});

describe('if statement', () => {
  const parser = new Parser();
  const lexer = new Lexer();

  test('simple', () => {
    const tokens = lexer.tokenize(
      'if x > 10 then\n  println "x is greater than 10"\nend'
    );
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new IfStatement(
        new BinaryExpression('>', new Identifier('x', 1), new Integer('10')),
        new Statements([
          new PrintlnStatement(new String('x is greater than 10')),
        ]),
        [],
        null
      ),
    ]);
    expect(ast).toEqual(expected);
  });

  test('with else', () => {
    const tokens = lexer.tokenize(`
      if x > 10 then
        println "x is greater than 10"
      else
        println "x less or equal to 10"
      end
    `);
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new IfStatement(
        new BinaryExpression('>', new Identifier('x', 2), new Integer('10')),
        new Statements([
          new PrintlnStatement(new String('x is greater than 10')),
        ]),
        [],
        new ElseStatement(
          new Statements([
            new PrintlnStatement(new String('x less or equal to 10')),
          ])
        )
      ),
    ]);
    expect(ast).toEqual(expected);
  });

  test('with elifs and else', () => {
    const tokens = lexer.tokenize(`
      if x > 10 then
        println "x is greater than 10"
      elif x < 10 then
        println "x less than to 10"
      elif x == 10 then
        println "x equal to 10"
      else
        println "x is not defined"
      end
    `);
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new IfStatement(
        new BinaryExpression('>', new Identifier('x', 2), new Integer('10')),
        new Statements([
          new PrintlnStatement(new String('x is greater than 10')),
        ]),
        [
          new IfStatement(
            new BinaryExpression(
              '<',
              new Identifier('x', 4),
              new Integer('10')
            ),
            new Statements([
              new PrintlnStatement(new String('x less than to 10')),
            ])
          ),
          new IfStatement(
            new BinaryExpression(
              '==',
              new Identifier('x', 6),
              new Integer('10')
            ),
            new Statements([new PrintlnStatement(new String('x equal to 10'))])
          ),
        ],
        new ElseStatement(
          new Statements([new PrintlnStatement(new String('x is not defined'))])
        )
      ),
    ]);
    expect(ast).toEqual(expected);
  });
});

describe('function call', () => {
  const parser = new Parser();
  const lexer = new Lexer();

  test('with one arg', () => {
    const tokens = lexer.tokenize('random(10)');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new FunctionCall(new Identifier('random', 1), [new Integer('10')]),
    ]);
    expect(ast).toEqual(expected);
  });

  test('without args', () => {
    const tokens = lexer.tokenize('random()');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new FunctionCall(new Identifier('random', 1), []),
    ]);
    expect(ast).toEqual(expected);
  });

  test('with many args', () => {
    const tokens = lexer.tokenize('random(50, 100, 10)');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new FunctionCall(new Identifier('random', 1), [
        new Integer('50'),
        new Integer('100'),
        new Integer('10'),
      ]),
    ]);
    expect(ast).toEqual(expected);
  });

  test('with expression args', () => {
    const tokens = lexer.tokenize('random(min + 5, max * 2)');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new FunctionCall(new Identifier('random', 1), [
        new BinaryExpression('+', new Identifier('min', 1), new Integer('5')),
        new BinaryExpression('*', new Identifier('max', 1), new Integer('2')),
      ]),
    ]);
    expect(ast).toEqual(expected);
  });
});

describe('print statements', () => {
  const parser = new Parser();
  const lexer = new Lexer();

  test('print', () => {
    const tokens = lexer.tokenize('print 5');
    const ast = parser.parse(tokens);
    const expected = new Statements([new PrintStatement(new Integer('5'))]);
    expect(ast).toEqual(expected);
  });

  test('println', () => {
    const tokens = lexer.tokenize('println 99');
    const ast = parser.parse(tokens);
    const expected = new Statements([new PrintlnStatement(new Integer('99'))]);
    expect(ast).toEqual(expected);
  });

  test('with expression', () => {
    const tokens = lexer.tokenize('println 44 + 10');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new PrintlnStatement(
        new BinaryExpression('+', new Integer('44'), new Integer('10'))
      ),
    ]);
    expect(ast).toEqual(expected);
  });

  test('with function call', () => {
    const tokens = lexer.tokenize('println random(10)');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new PrintlnStatement(
        new FunctionCall(new Identifier('random', 1), [new Integer('10', 1)])
      ),
    ]);
    expect(ast).toEqual(expected);
  });
});

describe('for statement', () => {
  const parser = new Parser();
  const lexer = new Lexer();

  test('simple', () => {
    const tokens = lexer.tokenize('for i := 0, 10 do\n  println i\nend');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new ForStatement(
        new AssignmentStatement('i', new Integer('0'), true),
        new Integer('10'),
        new Integer('1'),
        new Statements([new PrintlnStatement(new Identifier('i', 2))])
      ),
    ]);
    expect(ast).toEqual(expected);
  });

  test('with step', () => {
    const tokens = lexer.tokenize('for i := 0, 10, 2 do\n  println i\nend');
    const ast = parser.parse(tokens);
    const expected = new Statements([
      new ForStatement(
        new AssignmentStatement('i', new Integer('0'), true),
        new Integer('10'),
        new Integer('2'),
        new Statements([new PrintlnStatement(new Identifier('i', 2))])
      ),
    ]);
    expect(ast).toEqual(expected);
  });
});
