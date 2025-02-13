'use strict';

const express = require('express');
const router = express.Router();

const ProductController = require('../../controllers/product.controller');
const { authenticate } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');

router.get(
  '/search/:keySearch',
  asyncHandler(ProductController.getListSearchProduct)
);
router.get('', asyncHandler(ProductController.getListAllProducts));
router.get('/:product_id', asyncHandler(ProductController.findProductById));

// authentication
router.use(authenticate);

router.post('', asyncHandler(ProductController.createProduct));
router.patch('/:productId', asyncHandler(ProductController.updateProduct));
router.post('/publish/:id', asyncHandler(ProductController.publishProduct));
router.post('/unPublish/:id', asyncHandler(ProductController.unPublishProduct));

// QUERY //
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftForShop));
router.get(
  '/published/all',
  asyncHandler(ProductController.getAllPublishedForShop)
);

module.exports = router;
