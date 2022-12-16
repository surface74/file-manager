export class Result {
  constructor(error, result) {
    this._error = error;
    this._result = result;
  }
  get error() {
    return this._error;
  }
  get result() {
    return this._result;
  }
}
