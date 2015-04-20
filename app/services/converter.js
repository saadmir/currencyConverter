
module.exports = function(app){

  var convert = function(sourceCode, targetCode, amount){

    var result = {};

    var source = (sourceCode || '').toUpperCase();
    var target = (targetCode || '').toUpperCase();

    if (!sourceCode || source.length > 3 || !app.data.rates[source]){
      throw new Error('invalid source currency code');
    } else if (!targetCode || target.length > 3 || !app.data.rates[target]){
      throw new Error('invalid target currency code');
    }

    result.code = target;
    result.symbol = app.data.rates[target].symbol || target;

    if (source == target) {
      result.amount = amount || '';
      return result;
    }

    var a = ('' + (amount || '1')).replace(/\s/,'').replace(/^\-/,'');
    if ( (/[^[0-9.]/).test(a) || isNaN(a)){
      throw new Error('invalid amount');
    }

    if (a === '1') {
      result.amount = (app.data.rates[target].rate / app.data.rates[source].rate).toFixed(2);
      return result;
    }

    a = parseFloat(a);

    if (Math.round(a) >= Number.MAX_SAFE_INTEGER) {
      throw new Error('number too large for exact computation');
    }

    var converted = (a / app.data.rates[source].rate) * app.data.rates[target].rate;

    if (Math.round(converted) >= Number.MAX_SAFE_INTEGER) {
      throw new Error('result amount too large for exact computation');
    }

    result.amount = converted.toFixed(2);
    return result;
  };

  return {
      serviceName:      'converter',
      service:          {
        convert: convert
      }
  };
};

