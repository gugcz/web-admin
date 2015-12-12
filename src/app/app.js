(function() {
  'use strict';

  angular.module('gugCZ.webAdmin', [
        'ngMaterial',
        'ui.router',
        'pascalprecht.translate',

        'gugCZ.webAdmin.templates',      // templates in template cache
        'gugCZ.webAdmin.translations',  // translations from locale files

        'gugCZ.webAdmin.dashboard',
        'gugCZ.webAdmin.errors',
        'gugCZ.webAdmin.events'
      ]
  )
      .config(function($stateProvider) {
        $stateProvider.state('base', {
          url:'/',
          controller: function($mdSidenav) {
            this.menu = [
              {
                link: 'dashboard',
                title: 'Dashboard',
                icon: 'dashboard'
              },
              {
                link: 'events',
                title: 'Events',
                icon: 'events'
              },
              {
                link: 'https://secure.meetup.com/oauth2/authorize?client_id=r2pktvok5j0drsc07b1lc77evb&response_type=token&redirect_uri=http://gug-web-admin.appspot.com/', // TODO: save clientId and redirect uri to constant
                title: 'Sign in'
              }
            ];

            this.toggleSidenav = function(menuId) {
              $mdSidenav(menuId).toggle();
            };
          },
          controllerAs: 'app',
          templateUrl: 'app/app.html'
        });
      })

      .config(function($urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/dashboard');
      })

      .config(function($translateProvider) {
        $translateProvider.useSanitizeValueStrategy('escaped');
//        $translateProvider.useLocalStorage();
        $translateProvider.preferredLanguage('cs'); // TODO config
      });

})();
