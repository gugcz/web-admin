(function() {
  'use strict';

    function FirebaseFactory(FIREBASE_URL, $firebaseArray) {
        var config = {
            apiKey: "AIzaSyAdB-QKqwRcZGy_k6FIMEBK5PQhtZrTad4",
            authDomain: "helloworld-ee64c.firebaseapp.com",
            databaseURL: "https://helloworld-ee64c.firebaseio.com",
            storageBucket: "helloworld-ee64c.appspot.com"
        };
        firebase.initializeApp(config);
        var firebaseDB = firebase.database();
        var self = this;
        self.chapters = null;

        self.getAllOrganizers = function () {
            var ref = firebaseDB.ref('orgs/');
            var organizers = $firebaseArray(ref);
            ref.on('value', function(snapshot) {
                organizers.push(snapshot.val());
            });
            return organizers;
        };

        self.addChapter = function (chapter) {
            var ref = new Firebase(FIREBASE_URL  + '/chapters');
            var chapters = $firebaseArray(ref);
            chapters.$add(chapter)
        };

        self.addChapterWithOwnID = function (chapter) {
            var chaptersRef = firebaseDB.ref('chapters/');
            chaptersRef.child(getChapterID(chapter)).set(chapter);
        };

        function getChapterID(chapter) {
            return chapter.section.toLowerCase() + '_' + chapter.name.replace(' ', '_').toLowerCase();
        }


    }
    

  angular.module('gugCZ.webAdmin', [
        'angular-loading-bar',
        'ngMaterial',
        'ui.router',
        'pascalprecht.translate',
        'gugCZ.auth',
        'gugCZ.webAdmin.templates',      // templates in template cache
        'gugCZ.webAdmin.translations',
        'gugCZ.webAdmin.login',
        'firebase',
        'gugCZ.webAdmin.dashboard',
        'gugCZ.webAdmin.errors',
        'gugCZ.webAdmin.events'
      ]
  )
      .constant('FIREBASE_URL', 'https://helloworld-ee64c.firebaseio.com/')// Testing project for
      .service('FirebaseData', FirebaseFactory)
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
        })
            .state('chapter-add', {
                url: '/chapter/add',
                templateUrl: 'app/chapter/add/add.html',
                controller: AddChapterCtrl,
                controllerAs: 'vm'
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
