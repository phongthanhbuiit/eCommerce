'use strict';

const shopModel = require('../models/shop.model');
const bycrypt = require('bcrypt');
const crypto = require('node:crypto');
const { createKeyToken } = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utills');
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const KeyTokenService = require('./keyToken.service');
const { token } = require('morgan');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: '0001',
  EDITOR: '0002',
  ADMIN: '0000',
};

class AccessService {
  /*
  1 - check this token used?
  1.1 if used - decode who is it?
  1.2 remove token in keyStore
  2- verify token
  3- check userId
  4- create new access token and new refresh token
  5- update access token, refresh token and refresh token used
   */
  static handleRefreshToken = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteByUserId(userId);
      throw new ForbiddenError('Something went wrong!! Please login again');
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError('Shop not registered');
    }

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError('Shop not registered');

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await KeyTokenService.updateNewRefreshToken({
      oldRefreshToken: refreshToken,
      newRefreshToken: tokens.refreshToken,
    });

    return {
      user,
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.deleteByUserId(keyStore.user);
    return delKey;
  };

  /*
  B1: check email in dbs
  B2: match password
  B3: create AT vs RT and save
  B4: generate tokens
  B5: get data and return login
   */
  static login = async ({ email, password, refreshToken = null }) => {
    //B1
    const foundShop = await findByEmail({ email });

    if (!foundShop) {
      throw new BadRequestError('Error: Shop not found');
    }

    //B2
    const match = await bycrypt.compareSync(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError('Authentication error');
    }

    //B3
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    //B4 generate token
    const tokens = await createTokenPair(
      {
        userId: foundShop._id,
        email: email,
      },
      publicKey,
      privateKey
    );
    const { _id: userId } = foundShop;
    await KeyTokenService.createKeyToken({
      userId,
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
    });

    //B5
    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // step1: check email exits?
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError('Error: Shop already registered');
    }

    const passwordHash = await bycrypt.hashSync(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');

      // save collection
      const keyStore = await createKeyToken({
        userId: newShop._id,
        privateKey,
        publicKey,
      });

      if (!keyStore) {
        return {
          code: '-2012',
          message: 'keyStore error',
        };
      }

      // create token pair
      const tokenPair = await createTokenPair(
        {
          userId: newShop._id,
          email: email,
        },
        publicKey,
        privateKey
      );
      return {
        shop: getInfoData({
          fields: ['_id', 'name', 'email'],
          object: newShop,
        }),
        tokens: tokenPair,
      };
    } // end new shop

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
