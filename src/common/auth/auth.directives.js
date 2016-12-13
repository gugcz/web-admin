(function() {
  'use strict';

  angular.module('gugCZ.auth')
      .directive('authLoginLink', function($window, authService) {
        return {
          restrict: 'A',
          link: function(scope, element) {
            element.bind('click', function() {
              authService.login();
            });
          }
        };
      })
      .directive('authLogoutLink', function($state, $window, authService) {
        return {
          restrict: 'A',
          link: function(scope, element) {
            element.bind('click', function() {
              authService.logout();
            });
          }
        };
      });

})();