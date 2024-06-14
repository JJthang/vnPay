var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var order = require('./routes/order');
// const cors = require('cors');
const httpProxy = require('http-proxy');

var app = express();
const proxy = httpProxy.createProxyServer();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.all('/order/create_payment_url', (req, res) => {
  // Thiết lập tiêu đề 'Access-Control-Allow-Origin' cho phép yêu cầu từ domain localhost:3000
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  
  // Thực hiện chuyển hướng yêu cầu tới URL của VNPAY
  proxy.web(req, res, { target: 'https://sandbox.vnpayment.vn' });
});
proxy.on('error', (err, req, res) => {
  res.status(500).send({ error: 'Proxy Error' });
});
// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200,
//     methods: 'GET,POST,PUT,DELETE',
//     allowedHeaders: ['Content-Type', 'Authorization']
// }

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/order', order);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
