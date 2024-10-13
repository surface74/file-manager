import Message from './message.js';

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
