var express       = require('express');
var router        = express.Router();

module.exports = function(app) {

  router.get('/:source/:target/:amount',  function(req, res, next){
    res.json(app.services.converter.convert(req.params.source,req.params.target,req.params.amount));
  });

  router.post('/',  function(req, res, next){
    res.json(app.services.converter.convert(req.body.source,req.body.target,req.body.amount));
  });

  return router;
};


