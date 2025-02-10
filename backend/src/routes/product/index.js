'use strict';

const express = require('express');
const router = express.Router();

const ProductController = require('../../controllers/product.controller');
const { authenticate } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');

// authentication
router.use(authenticate);

router.post('', asyncHandler(ProductController.createProduct));

module.exports = router;
