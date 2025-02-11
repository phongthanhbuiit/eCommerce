'use strict';

const ProductService = require('../services/product.service.xxx');
const { SuccessResponse } = require('../core/success.response');

class ProductController {
  createProduct = async (req, res, next) => {
    // new SuccessResponse({
    //   message: 'Create Product success',
    //   metadata: await ProductService.createProduct(
    //     req.body.product_type,
    //     req.body
    //   ),
    // }).send(res);

    //v2
    new SuccessResponse({
      message: 'Create Product success',
      metadata: await ProductService.createProduct(
        req.body.product_type,
        req.body
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
