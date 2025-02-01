'use strict';

const shopModel = require('../models/shop.model');
const bycrypt = require('bcrypt');
const crypto = require('crypto');
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
        // created privateKey, publicKey
        const { privateKey, publicKey } = await crypto.generateKeyPairSync(
          'rsa',
          {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: 'pkcs1', // Public Key CryptoGraphy Standards
              format: 'pem',
            },
            privateKeyEncoding: {
              type: 'pkcs1', // Public Key CryptoGraphy Standards
              format: 'pem',
            },
          }
        );

        // save collection
        const publicKeyString = await createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: '-2012',
            message: 'public key string error',
          };
        }

        // create token pair
        const tokenPair = await createTokenPair(
          {
            userId: newShop._id,
            email: email,
          },
          publicKeyString,
          privateKey
        );

        return {
          code: 201,
          medata: {
            shop: getInfoData({
              fields: ['_id', 'name', 'email'],
              data: newShop,
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
