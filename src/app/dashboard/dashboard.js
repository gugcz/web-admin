(function() {
  'use strict';

  angular.module('gugCZ.webAdmin.dashboard', [
        'ui.router'
      ]
  )
      .config(function($stateProvider) {

        $stateProvider.state('dashboard', {
          parent: 'base',
          url: 'dashboard',
          controller: function() {
          },
          controllerAs: 'dashboard',
          templateUrl: 'app/dashboard/dashboard.html'
        });
      });

})();
