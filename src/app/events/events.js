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
            events: function() { return [];}
          },
          controller: function(events, $location) {
            this.events = events;

            this.addEvent = function() {
              $location.path('/events/form');
            }
          },
          controllerAs: 'eventsCtrl',
          templateUrl: 'app/events/events.html',
          data: {
            title: 'Akce' // TODO Add translation
          }
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
            title: "Přidat akci"  // TODO Add translation
          }
        });

      });

})();
