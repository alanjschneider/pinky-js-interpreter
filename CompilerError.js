export class CompilerError extends Error {
  constructor(message, line, column) {
    super(`${message} on line ${line} column ${column}`);

    this.line = line;
    this.column = column;
  }

  showContext(src) {
    const line = src.split('\n')[this.line - 1];
    const pointer = ' '.repeat(this.column - 1) + '^';
    return `${line}\n${pointer}`;
  }
}
