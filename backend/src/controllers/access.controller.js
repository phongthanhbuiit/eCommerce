'use strict';

const AccessService = require('../services/access.service');

const { CREATED } = require('../core/success.response');

class AccessController {
  signUp = async (req, res, next) => {
    CREATED.create({
      message: 'Register Success',
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
