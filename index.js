import { Lexer } from './Lexer.js';
import { Parser } from './Parser.js';
import { Interpreter } from './Interpreter.js';
import { astToString } from './ast/utils.js';
import { readFile } from 'node:fs/promises';

const args = process.argv.slice(2);
const options = {
  ast: false,
  tks: false,
};
let filename = null;

for (const arg of args) {
  const lower = arg.toLowerCase();
  if (lower.startsWith('--')) {
    const option = lower.slice(2);
    if (option in options) {
      options[option] = true;
    }
  } else {
    filename = lower;
  }
}

const script = await readFile(`scripts/${filename}.pinky`, 'utf-8');

console.time('executed');

const lexer = new Lexer();
const parser = new Parser();
const interpreter = new Interpreter();

const tokens = lexer.tokenize(script);
const ast = parser.parse(tokens);

if (options.tks) {
  console.log('\nTOKENS:');
  console.log(tokens);
}

if (options.ast) {
  console.log('\nAST:');
  console.log(astToString(ast));
}

console.log('\nPROGRAM OUTPUT:');
interpreter.interpret(ast);

console.timeEnd('executed');
