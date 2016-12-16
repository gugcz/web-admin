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
            var yesterday, tomorrow;
            yesterday = tomorrow = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            tomorrow.setDate(tomorrow.getDate() + 1);


            this.events = [
              {
                title: "Moje následující akce",
                start: tomorrow,
                state: "future"
              },
              {
                title: "Moje minulá akce",
                start: yesterday,
                state: "unreported"
              },
              {
                title: "Moje minulá akce",
                start: yesterday,
                state: "finished"
              }
            ];

          },
          controllerAs: '$ctrl',
          templateUrl: 'app/dashboard/dashboard.html'
        });
      });

})();
