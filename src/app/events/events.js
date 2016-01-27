(function() {
  'use strict';

  angular.module('gugCZ.webAdmin.events', [
        'ui.router',
        'gugCZ.webAdmin.events.service'
      ]
  )
      .config(function($stateProvider) {

        $stateProvider.state('events', {
          parent: 'base',
          url: 'events',
          resolve: {
            events: function(eventsDataService) {
              return eventsDataService.load();
            }
          },
          controller: function(events) {
            this.events = events;
          },
          controllerAs: 'eventsCtrl',
          templateUrl: 'app/events/events.html'
        });
      });

})();
