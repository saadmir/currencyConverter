var express       = require('express');
var router        = express.Router();

module.exports = function(app) {
  router.get('/',  function(req, res, next){
    console.log('[' + req.method + '] ' + req.originalUrl);

    var result = {};

    app.services.activity.getActivity()
    .then(function(data){
      result.activity = data || [];
    })
    .fail(function(err){
      result.error = err;
    })
    .done(function(){
      res.json(result);
    });
  });

  return router;
};

