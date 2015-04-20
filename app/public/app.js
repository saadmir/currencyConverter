'use strict';

(function(){

var conf = {};
conf.paths = {}
conf.paths.services = '';
conf.paths.partials = '/partials';

var appName = document.getElementsByTagName('html')[0].getAttribute('ng-app');

var app     = angular.module(appName, ['xeditable']);

//app.factory('_', function(){ return _.noConflict(); })
app.constant('conf',conf);

app.factory('services.activity', [
  '$http',
  'conf',
  function($http, conf){
    return {
      get: function(){
        return $http.get(conf.paths.services + '/activity');
      }
    };
  }
]);

app.factory('services.currencyConversion', [
  '$http',
  'conf',
  function($http, conf){
    return {
      convert: function(source, target, amount){
        console.log('services.currencyConversion.convert')
        return $http.get(conf.paths.services + '/currencyConversion/' + source + '/' + target + '/' + amount);
      }
    };
  }
]);

app.service('services.currencies', [
  '$http',
  '$q',
  '$timeout',
  'conf',
  function($http, $q, $timeout, conf){
    var currencies = {};
    return {
      get: function(refresh){
        if (!refresh && Object.keys(currencies).length) {
          var deferred = $q.defer();
          $timeout(function(){ deferred.resolve(currencies); } ,0);
          return deferred.promise;
        }

        return $http.get(conf.paths.services + '/currencies')
          .then(function(response){
            if (response && response.data) currencies = response.data;
            return currencies;
          });
      }
    };
  }
]);

app.controller('controller.activity', [
  '$scope',
  'services.activity',
  'services.currencyConversion',
  'services.currencies',
  function ($scope, activityService, currencyConversionService, currenciesService) {
    var self = this;
    self.activity   = [];

    $scope.currencies = {};
    $scope.loadCurrencies = function(){
      return currenciesService.get().then(function(currs){ $scope.currencies = currs; });
    };

    currenciesService.get()
      .then(function(currs){
        $scope.currencies = currs;
      })
      .then(function(){
        return activityService.get();
      })
      .then(function(response){
        if (response && response.data && response.data.activity) {
          self.activity = response.data.activity.map(function(value){
            value.currency  = value.currency || 'USD';
            return value;
          });
          console.log($scope.currencies);
        }
      });

    self.convert = function(source, target, amount){
      return currencyConversionService.convert(source, target, amount);
    };

    $scope.convertAmount = function(txn,d){
      console.log(txn.currency + '/' + txn.amount + ' change to: ' + d);
      txn.currency = txn.currency || 'USD';
      if (txn.currency == d) return true;

      return currencyConversionService.convert(txn.currency, d, txn.amount)
        .then(function(conversionResult){
          txn.amount = conversionResult.data.amount;
          txn.currency = d;
      });
    };
  }
]);

app.directive('activityList', [
  'conf',
  function(conf){
    return {
      restrict:     'E',
      templateUrl:  conf.paths.partials + '/activityList.html',
      link: function($scope, $element, $attrs){
      }
    };
  }
]);

}());

