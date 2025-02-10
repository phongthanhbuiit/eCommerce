'use strict';

const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'x-rtoken-id',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days',
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days',
    });

    // verify public token
    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.log(`error verify token: ${err}`);
      } else {
        console.log(`decoded token: ${decoded}`);
      }
    });

    return { accessToken, refreshToken };
  } catch (e) {
    return e;
  }
};

/*
 * B1: Check userId is missing?
 * B2: Get access token
 * B3: Verify token
 * B4: Check user in dbs
 * B5: Check keyStore with this userId
 * B6: ok all => return next()*/

const authenticate = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]?.toString();
  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();
  const refreshToken = req.headers[HEADER.REFRESH_TOKEN]?.toString();

  if (!userId) {
    throw new AuthFailureError('Invalid Request!');
  }

  const keyStore = await findByUserId(userId);

  if (!keyStore) {
    throw new NotFoundError('keyStore not found!');
  }

  if (refreshToken) {
    const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError('Invalid UserId!');
    }
    req.keyStore = keyStore;
    req.user = decodeUser;
    req.refreshToken = refreshToken;
  }

  if (!accessToken) {
    throw new AuthFailureError('Invalid Request!');
  }

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError('Invalid UserId!');
    }
    req.keyStore = keyStore;
    next();
  } catch (e) {
    throw e;
  }
});

const verifyJWT = async (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

module.exports = { createTokenPair, authenticate, verifyJWT };
