'use strict';

const { findById } = require('../services/apikey.service');
const e = require('express');
const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }
    // check objectKey
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    req.objtKey = objKey;
    return next();
  } catch (error) {
    throw error;
  }
};

const permissions = (permission) => {
  return (req, res, next) => {
    if (!req.objtKey.permissions) {
      return res.status(403).json({
        message: 'Permission Error',
      });
    }

    const validPermissions = req.objtKey.permissions.includes(permission);
    if (!validPermissions) {
      return res.status(403).json({
        message: 'Permission Error',
      });
    }

    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = { apiKey, permissions, asyncHandler };
