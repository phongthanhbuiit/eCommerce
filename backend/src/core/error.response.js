'use strict';

const STATUS_CODES = {
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const REASON_STATUS_CODE = {
  FORBIDDEN: 'Bad request Error',
  CONFLICT: 'Conflict Error',
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.CONFLICT,
    statusCode = STATUS_CODES.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.FORBIDDEN,
    statusCode = STATUS_CODES.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
};
