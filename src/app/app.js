(function() {
  'use strict';

  angular.module('gugCZ.webAdmin', [
        'angular-loading-bar',
        'ngMaterial',
        'ui.router',
        'pascalprecht.translate',

        'gugCZ.auth',

        'gugCZ.webAdmin.templates',      // templates in template cache
        'gugCZ.webAdmin.translations',  // translations from locale files

        'gugCZ.webAdmin.login',

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

      .config(function(oauthUrlProvider){
        oauthUrlProvider.setClientId('r2pktvok5j0drsc07b1lc77evb');
        oauthUrlProvider.setRedirectUrl('http://gug-web-admin.appspot.com');
      })

      .config(function($mdThemingProvider, cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.setC

        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey');
      })

      .config(function($translateProvider) {
        $translateProvider.useSanitizeValueStrategy('escaped');
//        $translateProvider.useLocalStorage();
        $translateProvider.preferredLanguage('cs'); // TODO config
      });

})();
