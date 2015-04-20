var express       = require('express');
var router        = express.Router();

module.exports = function(app) {
  router.get('/',  function(req, res, next){
    console.log('[' + req.method + '] ' + req.originalUrl);
    return res.json(app.data.currency);
  });

  router.get('/:source/:target',  function(req, res, next){
    res.json(app.services.converter.convert(req.params.source,req.params.target).amount);
  });

  return router;
};

