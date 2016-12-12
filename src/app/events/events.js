(function() {
  'use strict';

  angular.module('gugCZ.webAdmin.events', [
        'ui.router',
        'gugCZ.webAdmin.events.services',
        'gugCZ.webAdmin.events.form'
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
      })

      .config(function($stateProvider) {

        $stateProvider.state('events-form', {
          parent: 'base',

          url: 'events/form',
          templateUrl: 'app/events/form/form.html',
          controller: "EventFormController",
          controllerAs: 'vm',
          data: {
            title: "add event"
          }
        });

      });

})();
