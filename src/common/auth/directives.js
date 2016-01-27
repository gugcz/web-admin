(function() {
  'use strict';

  angular.module('gugCZ.auth')

      .directive('authLoginLink', function($window, oauthUrl) {
        return {
          restrict: 'A',
          link: function(scope, element) {
            element.bind('click', function() {
              $window.location.href = oauthUrl;
            });
          }
        };
      });

})();