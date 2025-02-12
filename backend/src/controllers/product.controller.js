'use strict';

const ProductService = require('../services/product.service.xxx');
const { SuccessResponse } = require('../core/success.response');

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create Product success',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish Product success',
      metadata: await ProductService.publicProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unPublishProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish Product success',
      metadata: await ProductService.unPublicProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  // QUERY
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list draft success!',
      metadata: await ProductService.findAllDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list published success!',
      metadata: await ProductService.findAllPublishedForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list search success!',
      metadata: await ProductService.getListSearchProduct(req.params),
    }).send(res);
  };

  getListAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list all Products success!',
      metadata: await ProductService.findAllProducts(req.params),
    }).send(res);
  };

  findProductById = async (req, res, next) => {
    new SuccessResponse({
      message: 'Find  Products success!',
      metadata: await ProductService.findProductById(req.params.product_id),
    }).send(res);
  };

  // END QUERY
}

module.exports = new ProductController();
