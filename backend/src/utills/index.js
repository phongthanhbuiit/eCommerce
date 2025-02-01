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

module.exports = { getInfoData };
