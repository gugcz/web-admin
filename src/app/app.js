(function() {
  'use strict';

  angular.module('gugCZ.webAdmin', [
        'angular-loading-bar',
        'ngMaterial',
        'ngMessages',
        'ui.router',
        'txx.diacritics',
        'pascalprecht.translate',
        'gugCZ.auth',
        'gugCZ.webAdmin.common.firebase',
        'gugCZ.webAdmin.templates',      // templates in template cache
        'gugCZ.webAdmin.translations',
        'gugCZ.webAdmin.login',
        'gugCZ.webAdmin.chapter',
        'gugCZ.webAdmin.dashboard',
        'gugCZ.webAdmin.errors',
        'gugCZ.webAdmin.events'
      ]
  )

      .config(function($stateProvider) {
        $stateProvider.state('base', {
          url: '/',
          controller: function($mdSidenav, $state) {
                this.state = $state;

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
                link: 'events-form',
                title: 'Events',
                icon: 'events'
              }
            ];

            this.user = {
              name: "Jan Novák",
              chapters: {
                gdgjihlava: "GDG Jihlava",
                gdgBrno: "GDG Brno"
              }
            };

            this.selectedChapter = Object.keys(this.user.chapters)[0];

            this.toggleSidenav = function(menuId) {
              $mdSidenav(menuId).toggle();
            };
          },
          controllerAs: 'app',
          templateUrl: 'app/app.html',
            data: {
              title: 'GUG CZ Administrace'
            }
        })

      })

      .config(function($urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/dashboard');
      })

      .config(function(oauthUrlProvider) {
        oauthUrlProvider.setClientId('9129013744.115894198615');  // todo config
      })


      .config(function($mdThemingProvider, cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;

        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey');
      })

      .config(function($translateProvider) {
        $translateProvider.useSanitizeValueStrategy('escaped');
//        $translateProvider.useLocalStorage();
        $translateProvider.preferredLanguage('cs'); // TODO config
      })
})();
