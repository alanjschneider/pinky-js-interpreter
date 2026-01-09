export class IfStatement {
  constructor(expression, body, elifStatemts, elseStatement) {
    this.expression = expression;
    this.elseStatement = elseStatement;
    this.elifStatemts = elifStatemts;
    this.body = body;
  }
}

export class ElseStatement {
  constructor(body) {
    this.body = body;
  }
}
