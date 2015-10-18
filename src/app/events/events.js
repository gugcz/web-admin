(function() {
  'use strict';

  angular.module('gugCZ.webAdmin.events', [
        'ui.router'
      ]
  )
      .config(function($stateProvider) {

        $stateProvider.state('events', {
          parent: 'base',
          url: 'events',
          controller: function() {},
          controllerAs: 'dashboard',
          templateUrl: 'app/events/events.html'
        });
      });

})();
