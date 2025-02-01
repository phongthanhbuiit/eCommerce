// @ts-nocheck

"use strict";

const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27017";

class Database {
  constructor() {
    this.connect();

    //connect
    function connect(type = "mongodb") {
      if (1 === 1) {
        mongoose.set("debug".true);
        mongoose.set("debug", { color: true });
      }

      mongoose
        .connect(connectString)
        .then((_) => console.log(`Connected Mongodb Sucess`))
        .catch((err) => console.log(`Error Connect!`));
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
