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
          controller: function($location) {
            var yesterday, tomorrow;
            yesterday = tomorrow = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            tomorrow.setDate(tomorrow.getDate() + 1);


            this.events = {
              drafts: [],
              future: [],
              unreported: []
            }

            this.editEvent = function(event) {
              $location.path('/events/form');
            }

            this.addEvent = function() {
              $location.path('/events/form');
            }

          },
          controllerAs: 'vm',
          templateUrl: 'app/dashboard/dashboard.html'
        });
      });

})();
