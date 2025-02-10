'use strict';

const { StatusCodes, ReasonPhrases } = require('../utills/httpStatusCode');

class SuccessResponse {
  constructor({ message, statusCode = StatusCodes.OK, metadata = {} }) {
    this.message = message || StatusCodes[statusCode];
    this.status = statusCode;
    this.metadata = metadata;
  }

  static create(message, statusCode, metadata) {
    return new SuccessResponse({ message, statusCode, metadata });
  }

  send(res, headers = {}) {
    if (headers && Object.keys(headers).length > 0) {
      res.set(headers);
    }
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }

  static create({ message, metadata }) {
    return new OK({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({ message, metadata, options = {} }) {
    super({ message, statusCode: StatusCodes.CREATED, metadata });
    this.options = options;
  }

  static create({ message, metadata, options }) {
    return new CREATED({ message, metadata, options });
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse,
};
