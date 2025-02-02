'use strict';

const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
};

const REASON_STATUS_CODE = {
  [STATUS_CODES.CREATED]: 'Created',
  [STATUS_CODES.OK]: 'Success',
};

class SuccessResponse {
  constructor({ message, statusCode = STATUS_CODES.OK, metadata = {} }) {
    this.message = message || REASON_STATUS_CODE[statusCode];
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
    super({ message, statusCode: STATUS_CODES.CREATED, metadata });
    this.options = options;
  }

  static create({ message, metadata, options }) {
    return new CREATED({ message, metadata, options });
  }
}

module.exports = {
  OK,
  CREATED,
};
