'use strict';

const { model, Schema } = require('mongoose');
const slugify = require('slugify');

const PRODUCT_DOCUMENT_NAME = 'Product';
const PRODUCT_COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    product_name: { type: Schema.Types.String, required: true },
    product_thumb: Schema.Types.String,
    product_description: { type: Schema.Types.String, required: true },
    product_slug: { type: Schema.Types.String },
    product_price: { type: Schema.Types.Number, required: true },
    product_quantity: { type: Schema.Types.Number, required: true },
    product_type: {
      type: Schema.Types.String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingAverage: {
      type: Schema.Types.Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Schema.Types.Array, default: [] },
    isDraft: {
      type: Schema.Types.Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Schema.Types.Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: PRODUCT_COLLECTION_NAME,
  }
);

// create index for search
productSchema.index({ product_name: 'text', product_description: 'text' });

// Document middleware: run before .save() and .create()
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

// define the product type = clothing
const CLOTHING_DOCUMENT_NAME = 'Clothing';
const CLOTHING_COLLECTION_NAME = 'Clothes';

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
