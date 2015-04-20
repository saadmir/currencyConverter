var express         = require('express');
var fs              = require('fs');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');

var app             = express();

module.exports = function(conf){

app.conf            = conf;
app.data            = {};
app.services        = {};

require(app.conf.paths.services)(app);

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(app.conf.paths.public));

app.use(function(req, res, next){
  if (app.data.rates) return next();

  app.services.rates.getRates()
    .then(function(rates){
      app.data.rates = rates || {};
    })
    .then(function(){
      next();
    })
    .fail(function(err){
      console.error('error getting conversion rate');
      console.error(err);
      res.json({
        message: 'waiting for conversion rates data, please try again',
        error: {}
      });
    });
});

app.use('/currencyConversion',  require(path.join(app.conf.paths.routes, 'currencyConversion.js'))(app));
app.use('/conversionRate',      require(path.join(app.conf.paths.routes, 'conversionRate.js'))(app));
app.use('/currencies',          require(path.join(app.conf.paths.routes, 'currencies.js'))(app));
app.use('/activity',            require(path.join(app.conf.paths.routes, 'activity.js'))(app));
app.use('/refresh',             require(path.join(app.conf.paths.routes, 'refresh.js'))(app));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

return app;

};

//var port = process.env.PORT || '3000';
//app.set('port', port);

//var server = require('http').createServer(app);

//app.services.rates.getRates()
  //.then(function(rates){
    //app.data.rates = rates || {};
  //})
  //.then(function(){
    //server.listen(port);
    //server.on('error', onError);
  //})
  //.fail(function(err){
    //console.error('error getting conversion rate, shutting down');
    //console.error(err);
    //process.exit(1);
  //});

//module.exports = app;
