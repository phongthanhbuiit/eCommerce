'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema(
  {
    discount_name: { type: Schema.Types.String, required: true },
    discount_description: { type: Schema.Types.String, required: true },
    discount_type: {
      type: Schema.Types.String,
      default: 'fixed_amount',
      enum: ['fixed_amount', 'percentage'],
    },
    discount_value: { type: Schema.Types.Number, required: true }, // 10.000, 1%
    discount_code: { type: Schema.Types.String, required: true },
    discount_start_date: { type: Schema.Types.Date, required: true },
    discount_end_date: { type: Schema.Types.Date, required: true },
    discount_max_uses: { type: Schema.Types.Number, required: true },
    discount_uses_count: { type: Schema.Types.Number, required: true },
    discount_users_used: { type: Schema.Types.Array, default: [] },
    discount_max_uses_per_user: { type: Schema.Types.Number, required: true },
    discount_min_order_value: { type: Schema.Types.Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    discount_is_active: { type: Schema.Types.Boolean, default: false },
    discount_applies_to: {
      type: Schema.Types.String,
      required: true,
      enum: ['all', 'specific'],
    },
    discount_product_ids: { type: Schema.Types.Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  inventory: model(DOCUMENT_NAME, discountSchema),
};
