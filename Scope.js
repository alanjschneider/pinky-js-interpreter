export class Scope {
  constructor(parent = null) {
    this.variables = {};
    this.functions = {};
    this.parent = parent;
  }

  findVarScope(name) {
    let scope = this;
    while (!(name in scope.variables) && scope.parent !== null) {
      scope = scope.parent;
    }
    return scope;
  }

  findFuncScope(name) {
    let scope = this;
    while (!(name in scope.functions) && scope.parent !== null) {
      scope = scope.parent;
    }
    return scope;
  }
}
