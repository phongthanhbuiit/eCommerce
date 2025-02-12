'use strict';

const {
  product,
  electronic,
  clothing,
  furniture,
} = require('../product.model');
const { NotFoundError } = require('../../core/error.response');

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct(query, limit, skip);
};

const findAllPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProduct(query, limit, skip);
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch, 'i'); // "i" không phân biệt hoa/thường
  const results = await product
    .find({
      isPublished: true,
      $text: { $search: regexSearch },
    })
    .sort({ score: { $meta: 'textScore' } })
    .select({ score: { $meta: 'textScore' } })
    .lean();

  return results;
};

const publicProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: product_shop,
    _id: product_id,
  });
  if (!foundShop) throw new NotFoundError('Product shop not found');

  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const unPublicProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: product_shop,
    _id: product_id,
  });
  if (!foundShop) throw new NotFoundError('Product shop not found');

  foundShop.isDraft = false;
  foundShop.isPublished = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const queryProduct = async (query, limit, skip) => {
  return product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

module.exports = {
  findAllDraftForShop,
  findAllPublishedForShop,
  publicProductByShop,
  unPublicProductByShop,
  searchProductByUser,
};
