var fs        = require('fs');
var path      = require('path');
var Q         = require('q');

module.exports = function(app){

  var getActivity = function(){
    if (fs.existsSync(path.join(app.conf.paths.data,'activity.js'))){
      var json = fs.readFileSync(path.join(app.conf.paths.data,'activity.js'));
      if (json && json.length) {
        return Q(JSON.parse(json));
      }
    }

    return activityService();
  };


  var activityService = function(options){
    return Q([]);
  };

  return {
      serviceName:      'activity',
      service:          {
        getActivity: getActivity
      }
  };
};

