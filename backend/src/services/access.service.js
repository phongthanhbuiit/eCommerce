'use strict';

const shopModel = require('../models/shop.model');
const bycrypt = require('bcrypt');
const crypto = require('node:crypto');
const { createKeyToken } = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utills');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: '0001',
  EDITOR: '0002',
  ADMIN: '0000',
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exits?
      const holderShop = await shopModel.findOne({ email }).lean();

      if (holderShop)
        return {
          code: '2001',
          message: 'Shop had already registered!',
        };

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
            message: 'keyStore  error',
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

        console.log({ newShop });
        return {
          code: 201,
          medata: {
            shop: getInfoData({
              fields: ['_id', 'name', 'email'],
              object: newShop,
            }),
            tokens: tokenPair,
          },
        };
      } // end new shop

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: '-2011',
        message: error.message,
        status: 'error',
      };
    }
  };
}

module.exports = AccessService;
