'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const productController = require('../../controllers/product.controller');

const asyncHandler = require('../../helpers/asyncHandler');
const { authenticate } = require('../../auth/authUtils');
const router = express.Router();

//sign up
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

// authentication
router.use(authenticate);
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post(
  '/shop/handlerRefreshToken',
  asyncHandler(accessController.handlerRefreshToken)
);

router.post('/product', asyncHandler(productController.createProduct));

module.exports = router;
