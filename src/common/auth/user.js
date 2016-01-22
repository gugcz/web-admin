(function() {
  'use strict';

  var AuthUserService = function($http) {

    this.load = function() {
      return $http.get('https://api.meetup.com/2/member/self/');
    }

  };

  angular.module('gugCZ.auth')
      .service('authUserService', AuthUserService);

})();