'use strict';

const { product, clothing, electronic } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const {
  findAllDraftForShop,
  publicProductByShop,
  findAllPublishedForShop,
  unPublicProductByShop,
  searchProductByUser,
} = require('../models/repositories/product.repo');

// define Factory class to create product
class ProductFactory {
  /*
    type: 'Clothing', 'Electronic',
    payload
   */
  static productRegistry = {}; //key-class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type ${type}`);

    return new productClass(payload).createProduct();
  }

  static async publicProductByShop({ product_shop, product_id }) {
    return await publicProductByShop({ product_shop, product_id });
  }

  static async unPublicProductByShop({ product_shop, product_id }) {
    return await unPublicProductByShop({ product_shop, product_id });
  }

  // query //
  /**
   * Retrieves all draft products for a specific shop.
   *
   * @param {Object} params - Input parameters.
   * @param {string} params.product_shop - The ID of the shop to fetch draft products from.
   * @param {number} [params.limit=50] - The maximum number of products to retrieve (default: 50).
   * @param {number} [params.skip=0] - The number of products to skip for pagination (default: 0).
   * @returns {Promise<Array>} - A list of draft products belonging to the shop.
   */
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  /**
   * Retrieves all draft products for a specific shop.
   *
   * @param {Object} params - Input parameters.
   * @param {string} params.product_shop - The ID of the shop to fetch draft products from.
   * @param {number} [params.limit=50] - The maximum number of products to retrieve (default: 50).
   * @param {number} [params.skip=0] - The number of products to skip for pagination (default: 0).
   * @returns {Promise<Array>} - A list of draft products belonging to the shop.
   */
  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishedForShop({ query, limit, skip });
  }

  static async getListSearchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
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
    if (!newClothing) throw new BadRequestError('create new clothing error');

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError('create new product error');

    return newProduct;
  }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectric = await electronic.create(this.product_attributes);
    if (!newElectric) throw new BadRequestError('create new electronic error');

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError('create new product error');

    return newProduct;
  }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await electronic.create(this.product_attributes);
    if (!newFurniture) throw new BadRequestError('create new electronic error');

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError('create new product error');

    return newProduct;
  }
}

// register product types
ProductFactory.registerProductType('Electronics', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
