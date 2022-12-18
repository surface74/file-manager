export class Result {
  constructor(error, data) {
    this._error = error;
    this._data = data;
  }
  get error() {
    return this._error;
  }
  get data() {
    return this._data;
  }
}
