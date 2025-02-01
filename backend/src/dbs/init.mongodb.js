// @ts-nocheck

"use strict";

const mongoose = require("mongoose");
const {
  db: { username, password, host, name, port },
} = require("../configs/config.mongodb");

const connectString = `mongodb://${username}:${password}@${host}:${port}/${name}`;

const { countCounnect } = require("../helpers/check.connect");

console.log(`connectString: `, connectString);

class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug".true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString)
      .then((_) => console.log(`Connected Mongodb Sucess`))
      .catch((err) => console.log(`Error Connect!`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
