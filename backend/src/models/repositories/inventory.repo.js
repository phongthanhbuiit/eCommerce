'use strict';

const { inventory } = require('../inventory.model');
const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unkown',
}) => {
  return inventory.create({
    inven_prodcutId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId,
  });
};

module.exports = { insertInventory };
