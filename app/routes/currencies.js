var express       = require('express');
var router        = express.Router();

module.exports = function(app) {
  router.get('/',  function(req, res, next){
    console.log('[' + req.method + '] ' + req.originalUrl);
    return res.json(app.data.rates);
  });

  return router;
};

