'use strict';

const JWT = require('jsonwebtoken');

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

module.exports = { createTokenPair };
