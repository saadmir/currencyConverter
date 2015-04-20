var express       = require('express');
var router        = express.Router();

module.exports = function(app) {
  router.get('/',  function(req, res, next){
    console.log('[' + req.method + '] ' + req.originalUrl);
    app.services.rates.update().then(function(rates){ app.data.rates = rates; }).done(function(){ res.json(); });
  });

  return router;
};

