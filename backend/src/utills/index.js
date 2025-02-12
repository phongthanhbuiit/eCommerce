'use strict';

const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
  if (!Array.isArray(fields)) {
    throw new TypeError('fields must be an array');
  }
  if (!object) {
    throw new TypeError('object must be an object and required!');
  }
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

module.exports = { getInfoData, getSelectData, getUnSelectData };
