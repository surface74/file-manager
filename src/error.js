const operationFailed = 'Operation failed';
const invalidInput = 'Invalid input';
const wrongDoubleQuoters = 'Wrong double quoters count';

export class InvalidArgumentError extends Error {
  constructor(message) {
    super(invalidInput + ((message) ? `: ${message}` : ''));
    this.name = 'InvalidArgumentError';
  }
}

export class OperationFailedError extends Error {
  constructor(message) {
    super(operationFailed + ((message) ? `: ${message}` : ''));
    this.name = 'OperationFailedError';
  }
}

export class WrongDoubleQuotersError extends Error {
  constructor(message) {
    super(wrongDoubleQuoters + ((message) ? `: ${message}` : ''));
    this.name = 'WrongDoubleQuotersError';
  }
}