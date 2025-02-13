'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema(
  {
    inven_prodcutId: { type: Schema.Types.ObjectId, ref: 'Product' },
    inven_location: { type: Schema.Types.String, default: 'unknown' },
    inven_stock: { type: Schema.Types.Number, required: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inven_reservations: { type: Schema.Types.Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  inventory: model(DOCUMENT_NAME, inventorySchema),
};
