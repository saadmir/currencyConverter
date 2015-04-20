var path = require('path');

var conf = {};

conf.paths                      = {};
conf.paths.data                 = path.join(__dirname, 'app', 'data');
conf.paths.services             = path.join(__dirname, 'app', 'services');
conf.paths.routes               = path.join(__dirname, 'app', 'routes');
conf.paths.public               = path.join(__dirname, 'app', 'public');

module.exports = conf;
