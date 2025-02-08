'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Keys';
const COLLECTION_NAME = 'Keys';

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    privateKey: {
      type: Schema.Types.String,
      required: true,
    },
    publicKey: {
      type: Schema.Types.String,
      required: true,
    },
    refreshTokensUsed: {
      type: Schema.Types.Array,
      default: [],
    },
    refreshToken: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
