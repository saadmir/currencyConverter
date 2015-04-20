var fs      = require('fs');
var path    = require('path');

module.exports = function(app) {
  fs.readdirSync(__dirname).forEach(function(file) {
    if (file.toLowerCase() !== "index.js" && path.extname(file).toLowerCase() === '.js'){
      var s = require(path.join(__dirname, file))(app);
      if (s && s.serviceName && !(s.serviceName in app.services) && s.service) {
        console.log('Loading service: ' + s.serviceName + ' from: ' + path.join(__dirname, file));
        app.services[s.serviceName] = s.service;
      }
    }
  });
};

