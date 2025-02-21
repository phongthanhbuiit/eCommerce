'use strict';

const { product, clothing, electronic } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');

// define Factory class to create product
class ProductFactory {
  /*
    type: 'Clothing', 'Electronic',
    payload
   */
  static async createProduct(type, payload) {
    switch (type) {
      case 'Electronic':
        return new Electronic(payload).createProduct();
      case 'Clothing':
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid Product Type: ${type}`);
    }
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  //create new product
  async createProduct() {
    return await product.create(this);
  }
}

// Define sub-class for different product types Clothings
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) return BadRequestError('create new clothing error');

    const newProduct = await super.createProduct();
    if (!newProduct) return BadRequestError('create new product error');

    return newProduct;
  }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newClothing = await electronic.create(this.product_attributes);
    if (!newClothing)
      return throw new BadRequestError('create new electronic error');

    const newProduct = await super.createProduct();
    if (!newProduct)
      return throw new BadRequestError('create new product error');

    return newProduct;
  }
}

module.exports = ProductFactory;
