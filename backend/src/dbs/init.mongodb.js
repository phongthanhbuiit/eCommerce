// @ts-nocheck

'use strict';

const mongoose = require('mongoose');
const {
  db: { username, password, host, name, port },
} = require('../configs/config.mongodb');

const connectString = `mongodb://${username}:${password}@${host}:${port}/${name}`;

const { countCounnect } = require('../helpers/check.connect');

console.log(`connectString: `, connectString);

class Database {
  constructor() {
    this.connect();
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Correct placement of connect method
  connect(type = 'mongodb') {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });

    mongoose
      .connect(connectString, {
        authSource: 'admin',
      })
      .then(() => console.log('Connected to MongoDB Successfully'))
      .catch((err) => console.error('Error Connecting to MongoDB:', err));
  }
}

const instance = Database.getInstance();
module.exports = instance;
