'use strict';

const { model, Schema } = require('mongoose');

const PRODUCT_DOCUMENT_NAME = 'Product';
const PRODUCT_COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    product_name: { type: Schema.Types.String, required: true },
    product_thumb: Schema.Types.String,
    product_description: { type: Schema.Types.String, required: true },
    product_price: { type: Schema.Types.Number, required: true },
    product_quantity: { type: Schema.Types.Number, required: true },
    product_type: {
      type: Schema.Types.String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: Schema.Types.String,
    product_attributes: [{ type: Schema.Types.Mixed, required: true }],
  },
  {
    timestamps: true,
    collection: PRODUCT_COLLECTION_NAME,
  }
);

const CLOTHING_DOCUMENT_NAME = 'Clothing';
const CLOTHING_COLLECTION_NAME = 'Clothes';

// define the product type = clothing
const clothingSchema = new Schema(
  {
    brand: { type: Schema.Types.String, required: true },
    size: { type: Schema.Types.String, required: true },
    material: { type: Schema.Types.String, required: true },
  },
  {
    collection: CLOTHING_COLLECTION_NAME,
    timestamps: true,
  }
);

const ELECTRONIC_DOCUMENT_NAME = 'Electronic';
const ELECTRONIC_COLLECTION_NAME = 'Electronics';

// define the product type = electronic
const electronicSchema = new Schema(
  {
    manufacturer: { type: Schema.Types.String, required: true },
    model: { type: Schema.Types.String, required: true },
    color: { type: Schema.Types.String, required: true },
  },
  {
    collection: ELECTRONIC_COLLECTION_NAME,
    timestamps: true,
  }
);

const FURNITURE_DOCUMENT_NAME = 'Furniture';
const FURNITURE_COLLECTION_NAME = 'Furnitures';

// define the product type = furniture
const furnitureSchema = new Schema(
  {
    manufacturer: { type: Schema.Types.String, required: true },
    model: { type: Schema.Types.String, required: true },
    color: { type: Schema.Types.String, required: true },
  },
  {
    collection: FURNITURE_COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = {
  product: model(PRODUCT_DOCUMENT_NAME, productSchema),
  clothing: model(CLOTHING_DOCUMENT_NAME, clothingSchema),
  electronic: model(ELECTRONIC_DOCUMENT_NAME, electronicSchema),
  furniture: model(FURNITURE_DOCUMENT_NAME, furnitureSchema),
};
