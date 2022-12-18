const operationFailed = 'Operation failed';
const invalidInput = 'Invalid input';
const wrongDoubleQuoters = 'Wrong double quoters count/order';

export class InvalidArgumentError extends Error {
  constructor(message) {
    super(invalidInput + ((message) ? `: ${message}` : ''));
    this.name = this.constructor.name;
    // Error.captureStackTrace(this);
  }
}

export class OperationFailedError extends Error {
  constructor(message) {
    super(operationFailed + ((message) ? `: ${message}` : ''));
    this.name = this.constructor.name;
  }
}

export class WrongDoubleQuotersError extends Error {
  constructor(message) {
    super(wrongDoubleQuoters + ((message) ? `: ${message}` : ''));
    this.name = this.constructor.name;
  }
}