'use strict';

const keytokenModel = require('../models/keytoken.model');
const { Types } = require('mongoose');

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    privateKey,
    publicKey,
    refreshToken,
  }) => {
    try {
      // level 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   privateKey,
      //   publicKey,
      // });
      //
      // return tokens ? tokens : null;

      // new level
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return keytokenModel.findOne({ user: userId }).lean();
  };

  static removeByUserId = async (userId) => {
    console.log({ userId });
    return keytokenModel.deleteOne({ user: userId }).lean();
  };
}

module.exports = KeyTokenService;
