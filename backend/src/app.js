require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require('./dbs/init.mongodb'); // init and connect db
//const { checkOverload } = require("./helpers/check.connect"); // check OverLoad
//checkOverload();

// init router
app.use('/', require('./routes/index'));

// handling error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;

  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  console.log({ error });
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error',
  });
});

module.exports = app;
