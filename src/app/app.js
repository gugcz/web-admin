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
        'gugCZ.webAdmin.common.firebase',
        'gugCZ.webAdmin.templates',      // templates in template cache
        'gugCZ.webAdmin.translations',
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

            $scope.$on('gugCZ.webAdmin.firebase:signInSuccess', function(event, currentUser) {
              // TODO lépe, později nahraní níže uvedený object user

              var userRef = firebase.database().ref('orgs/' + currentUser.uid);
              this.fbUser = $firebaseObject(userRef);
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
            title: 'GUG CZ Administrace'
          }
        })

      })

      .config(function($urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/dashboard');
      })

      .config(function(authProvider) {
        authProvider.setClientId('9129013744.104633928310');  // todo config
        authProvider.setRedirectUrl('https://agnes.gdgplzen.cz/api/auth/callback');  // todo config
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

      .config(function(firebaseDBProvider) {
        firebaseDBProvider.setConfig({  // TODO config
          apiKey: "AIzaSyAkP1lF6Y4k7F1lTNA_tXufK0YQX7I72uo",
          authDomain: "gugcz.firebaseapp.com",
          databaseURL: "https://gugcz.firebaseio.com",
          storageBucket: "firebase-gugcz.appspot.com",
          messagingSenderId: "31582256095"
        });
      })

      .run(function($rootScope, webStorage, firebaseSignService) {
        function signInWithCustomToken(customToken) {
          firebaseSignService.signInWithCustomToken(customToken)
              .then(function(currentUser) {
                console.log('firebase login success', arguments);
                $rootScope.$broadcast('gugCZ.webAdmin.firebase:signInSuccess', currentUser);
              })
              .catch(function(error) {
                if (webStorage.isSupported && webStorage.has('gugCZ.auth:accessToken')) {
                  webStorage.remove('gugCZ.auth:accessToken');
                }

                console.log('firebase login error', arguments);
                $rootScope.$broadcast('gugCZ.webAdmin.firebase:signInError', error);
              })
        }


        if (webStorage.isSupported && webStorage.has('gugCZ.auth:accessToken')) {
          var accessToken = webStorage.get('gugCZ.auth:accessToken');
          signInWithCustomToken(accessToken);
        }

        $rootScope.$on('gugCZ.auth:loginSuccess', function(event, customToken) {
          signInWithCustomToken(customToken);
        })
      })
})();
