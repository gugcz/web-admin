(function() {
  'use strict';

  angular.module('gugCZ.auth')

      .directive('authLoginLink', function($window, auth) {
        return {
          restrict: 'A',
          link: function(scope, element) {
            element.bind('click', function() {
              auth.requestAuth();
            });
          }
        };
      });

})();