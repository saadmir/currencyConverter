var fs        = require('fs');
var path      = require('path');
var Q         = require('q');
var request   = require('request');

module.exports = function(app){

  var update = function(){
    return getRates(true);
  };

  var getSymbols = function(){
    var symbols = {};
    if (fs.existsSync(path.join(app.conf.paths.data,'symbols.js'))){
      var json = fs.readFileSync(path.join(app.conf.paths.data,'symbols.js'));
      if (json && json.length) {
        var list = JSON.parse(json);
        Object.keys(list).forEach(function(code){
          if (code && code.length === 3){
            symbols[code]         = symbols[code] || {};
            symbols[code].symbol  = code + '   ' + (list[code].symbol || '');
            symbols[code].image   = list[code].image || '';
          }
        });
      }
    }
    return symbols;
  };

  var getRates = function(force){

    var rates = {};

    if (!force && fs.existsSync(path.join(app.conf.paths.data,'currencyData.js'))){
      var json = fs.readFileSync(path.join(app.conf.paths.data,'currencyData.js'));
      if (json && json.length) {
        return Q(JSON.parse(json) || {});
      }
    }

    var symbols = getSymbols();

    return getRatesFromRemoteService()
      .then(function(newRates){
        Object.keys(newRates || {}).forEach(function(code) {
          var symbol = symbols[code] || {};
          rates[code] = {
            code:   code,
            rate:   newRates[code],
            image:  symbol.image   || '',
            symbol:  symbol.symbol || code
          };
        });
      })
      .then(function(){
        fs.writeFileSync(path.join(app.conf.paths.data,'currencyData.js'),JSON.stringify(rates));
        return rates;
      });
  };

  var getRatesFromRemoteService = function(options){
    var deferred = Q.defer();

    var rates                             = {};
    var params                            = {};
    params.headers                        = {};
    params.headers["content-type"]        = 'application/json';
    params.headers["accept"]              = 'application/json';
    params.strictSSL                      = false;
    params.jar                            = true;
    params.url                            = 'https://openexchangerates.org/api/latest.json?app_id=' + '4bbc50aa244a49c8822cf2bd0c9ea26c';
    params.method                         = 'GET';
    params.json                           = true;

    console.log('> > > > > calling rates service');
    request(params, function (error, response, body) {
      if (error) {
        console.error(params);
        console.error(error);
        return deferred.reject(rates);
      }

      if (body && typeof body === 'object' && body.rates && Object.keys(body.rates).length) {
        Object.keys(body.rates).forEach(function(key) {
          if (key && key.length === 3){
            rates[key.toUpperCase()] = parseFloat(body.rates[key]).toFixed(2);
          }
        });

        return deferred.resolve(rates);
      } else {
        console.error('[request] error parsing body');
        return deferred.reject(rates);
      }
    });

    return deferred.promise;
  };


  return {
      serviceName:      'rates',
      service:          {
        update:   update,
        getRates: getRates
      }
  };
};
