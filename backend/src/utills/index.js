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

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  });

  return obj;
};

/**
 * const obj = {
 *   c: {
 *     d: 1
 *     e, 2,
 *     f: {
 *       g: 3,
 *       h: 4
 *     }
 *   }
 * }
 * => {
 *   `c.d`: 1,
 *   `c.e`: 2,
 *   `c.f.g`: 3,
 *   `c.f.h`: 4
 * }
 * */
const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key]);

      Object.keys(response).forEach((k) => {
        final[`${key}.${k}`] = response[k];
      });
    } else {
      final[key] = obj[key];
    }
  });

  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
};
