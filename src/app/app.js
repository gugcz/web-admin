(function() {
  'use strict';

  angular.module('gugCZ.webAdmin', [
        'angular-loading-bar',
        'ngMaterial',
        'ngMessages',
        'ui.router',
        'txx.diacritics',
        'pascalprecht.translate',
        'webStorageModule',
        'gugCZ.auth',
        "gugCZ.webAdmin.config",
        'gugCZ.webAdmin.templates',      // templates in template cache
        'gugCZ.webAdmin.translations',
        'gugCZ.webAdmin.loginPage',
        'gugCZ.webAdmin.chapter',
        'gugCZ.webAdmin.dashboard',
        'gugCZ.webAdmin.errors',
        'gugCZ.webAdmin.events'
      ]
  )

      .config(function($stateProvider) {
        $stateProvider.state('base', {
          url: '/',
          controller: function($mdSidenav, $firebaseObject, $state, $scope) {

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
                title: 'Event form',
                icon: 'events'
              }
            ];

            var userRef = firebase.database().ref('orgs/' + firebase.auth().currentUser.uid);
            this.fbUser = $firebaseObject(userRef);

            $scope.$on('$destroy', function() { // TODO bude toto nutné řešit všude?
              this.fbUser.$destroy();
            }.bind(this));

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
            title: 'GUG CZ Administrace',
            authLogged: true
          },
          abstract: true
        });

      })

      .config(function($urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/login');
      })

      .config(function(SLACK_AUTH, slackAuthProvider) {
        slackAuthProvider.setClientId(SLACK_AUTH.clientId);
        slackAuthProvider.setRedirectUrl(SLACK_AUTH.redirectUrl);
      })

      .config(function($translateProvider, LANGUAGE) {
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.preferredLanguage(LANGUAGE.preferred);
      })

      .config(function(FIREBASE) {
        firebase.initializeApp(FIREBASE);
      })

      .config(function($mdThemingProvider, cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;

        $mdThemingProvider.theme('default')
            .primaryPalette('blue');
      })

      .run(function($log, $mdToast, $rootScope, $state, cfpLoadingBar) {

        $rootScope.$on('$stateChangeStart', function() {
          cfpLoadingBar.start();
        });

        $rootScope.$on('$stateChangeSuccess', function() {
          cfpLoadingBar.complete();
        });

        var errorHandler = function(event, toState, fromState, toParams, fromParams, error) {
          cfpLoadingBar.set(0);
          $log.error(error, toState, fromState, toParams, fromParams);
        };

        $rootScope.$on('$stateNotFound', errorHandler);
        $rootScope.$on('$stateChangeError', errorHandler);

        $rootScope.$on('auth:login', function(event) {
          if ($state.is('loginPage')) {
            $state.go('dashboard');
          }
        });

        $rootScope.$on('auth:logout', function() {
          $state.go('loginPage');
        });

        $rootScope.$on('auth:loginCanceled', function() {
          cfpLoadingBar.set(0);
          $mdToast.showSimple('You must be logged!');

          $state.go('loginPage');
        });
      });
})();
