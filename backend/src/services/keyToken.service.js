'use strict';

const keytokenModel = require('../models/keytoken.model');

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
      console.log({ refreshToken });
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

  static deleteByUserId = async (userId) => {
    return keytokenModel.deleteOne({ user: userId }).lean();
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return keytokenModel.findOne({ refreshToken }).lean();
  };

  static updateNewRefreshToken = async ({
    oldRefreshToken,
    newRefreshToken,
  }) => {
    return keytokenModel.findOneAndUpdate(
      { refreshToken: oldRefreshToken },
      {
        $set: { refreshToken: newRefreshToken },
        $addToSet: { refreshTokensUsed: oldRefreshToken },
      }
    );
  };
}

module.exports = KeyTokenService;
