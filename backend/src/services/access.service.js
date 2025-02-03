'use strict';

const shopModel = require('../models/shop.model');
const bycrypt = require('bcrypt');
const crypto = require('node:crypto');
const { createKeyToken } = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utills');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const KeyTokenService = require('./keyToken.service');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: '0001',
  EDITOR: '0002',
  ADMIN: '0000',
};

class AccessService {
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeByUserId(keyStore.user);
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
