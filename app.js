var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var shippingDocksRouter = require('./routes/shipping_docks');
var ordersRouter = require('./routes/orders');
var transactionsRouter = require('./routes/transactions');
var reportsRouter = require('./routes/reports');
var rulesRouter = require('./routes/rules');
var variablesRouter = require('./routes/variables');
var emailsRouter = require('./routes/emails');
var exportsRouter = require('./routes/exports');
var importsRouter = require('./routes/imports');
var productsControllerRouter = require('./routes/productsController');


const db = require("./models");
var cors = require("cors");

var app = express();
app.set("db", db);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/import', (req, res) => {res.render('import', { title: 'Import Transactions', })});
app.use('/products', productsControllerRouter);


app.use('/api/v1/shipping_docks', shippingDocksRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/transactions', transactionsRouter);
app.use('/api/v1/reports', reportsRouter);
app.use('/api/v1/rules', rulesRouter);
app.use('/api/v1/variables', variablesRouter);
app.use('/api/v1/emails', emailsRouter);
app.use('/api/v1/exports', exportsRouter);
app.use('/api/v1/imports', importsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
