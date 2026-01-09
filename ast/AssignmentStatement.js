export class AssignmentStatement {
  constructor(identifier, expression, isLocal) {
    this.identifier = identifier;
    this.expression = expression;
    this.isLocal = isLocal;
  }
}
