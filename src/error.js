import Message from './message.js';

export class InvalidPathError extends Error {
  constructor(message) {
    super(Message.INVALID_PATH + (message ? `: ${message}` : ''));
    this.name = this.constructor.name;
  }
}

export class InvalidArgumentError extends Error {
  constructor(message) {
    super(Message.INVALID_INPUT + (message ? `: ${message}` : ''));
    this.name = this.constructor.name;
  }
}

export class OperationFailedError extends Error {
  constructor(message) {
    super(Message.OPERATION_FAILED + (message ? `: ${message}` : ''));
    this.name = this.constructor.name;
  }
}

export class WrongDoubleQuotersError extends Error {
  constructor(message) {
    super(Message.WRONG_DOUBLE_QUOTERS + (message ? `: ${message}` : ''));
    this.name = this.constructor.name;
  }
}