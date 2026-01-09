import { describe, test, vi, expect } from 'vitest';
import { Interpreter } from '../Interpreter.js';
import { Lexer } from '../Lexer.js';
import { Parser } from '../Parser.js';
import fs from 'node:fs';

// deactivate prints
process.stdout.write = vi.fn().mockReturnValue(true);

describe('loops', () => {
  const lexer = new Lexer();
  const parser = new Parser();
  const interpreter = new Interpreter();

  test('for', () => {
    const script = `
      for i := 0, 5 do
        println i
      end
    `;
    const ast = parser.parse(lexer.tokenize(script));
    interpreter.interpret(ast);

    expect(interpreter.prints).toEqual(['0\n', '1\n', '2\n', '3\n', '4\n']);
  });

  test('for with step', () => {
    const script = `
      for i := 0, 10, 2 do
        println i
      end
    `;
    const ast = parser.parse(lexer.tokenize(script));
    interpreter.interpret(ast);

    expect(interpreter.prints).toEqual(['0\n', '2\n', '4\n', '6\n', '8\n']);
  });

  test('while', () => {
    const script = `
      i := 0
      while i < 5 do
        println i
        i := i + 1
      end
    `;
    const ast = parser.parse(lexer.tokenize(script));
    interpreter.interpret(ast);

    expect(interpreter.prints).toEqual(['0\n', '1\n', '2\n', '3\n', '4\n']);
  });
});

describe('function', () => {
  const lexer = new Lexer();
  const parser = new Parser();
  const interpreter = new Interpreter();

  test('ret', () => {
    const script = `
      func greet(name)
        ret "Hello " + name
      end
      println greet("World")
    `;
    const ast = parser.parse(lexer.tokenize(script));
    interpreter.interpret(ast);

    expect(interpreter.prints).toEqual(['Hello World\n']);
  });

  test('recursive', () => {
    const script = fs.readFileSync('scripts/factorial.pinky', {
      encoding: 'utf-8',
    });
    const ast = parser.parse(lexer.tokenize(script));
    interpreter.interpret(ast);

    expect(interpreter.prints).toEqual(['120\n', '3628800\n']);
  });
});

describe('if', () => {
  const lexer = new Lexer();
  const parser = new Parser();
  const interpreter = new Interpreter();

  test('if elif else', () => {
    const script = fs.readFileSync('scripts/ifelse.pinky', {
      encoding: 'utf-8',
    });
    const ast = parser.parse(lexer.tokenize(script));
    interpreter.interpret(ast);

    expect(interpreter.prints).toEqual([
      'number -100 is negative\n',
      'number 0 is zero\n',
      'number 4 is positive\n',
    ]);
  });
});
