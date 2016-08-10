(function() {
  'use strict';

    function AddChapterCtrl($q, $timeout) {
        var self = this;
        var pendingSearch, cancelSearch = angular.noop;
        var cachedQuery, lastSearch;
        var organizers = loadContactsProfilePicture([new  Orgnizer('Jan Novák', 'example@example.com'), new  Orgnizer('Libor Straka', 'example@example.com')]);

        self.asyncContacts = [];
        self.filterSelected = true;

        self.querySearch = function (criteria) {
            cachedQuery = cachedQuery || criteria;
            return cachedQuery ? organizers.filter(createFilterFor(cachedQuery)) : [];
        };

        self.delayedQuerySearch = function (criteria) {
            cachedQuery = criteria;
            if ( !pendingSearch || !debounceSearch() )  {
                cancelSearch();

                return pendingSearch = $q(function(resolve, reject) {
                    // Simulate async search... (after debouncing)
                    cancelSearch = reject;
                    $timeout(function() {

                        resolve( self.querySearch() );

                        refreshDebounce();
                    }, Math.random() * 500, true)
                });
            }

            return pendingSearch;
        };

        self.chapter = {
            section: 'GDG',
            name: '',
            description: '',
            profilePicture: '',
            orgs: [],
            email: '',
            googlePlusLink: '',
            facebookLink: '',
            twitterLink: '',
            meetupID: '',
            meetupURL: '',
            coordinates: ''

        };

        function refreshDebounce() {
            lastSearch = 0;
            pendingSearch = null;
            cancelSearch = angular.noop;
        }


        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(organizer) {
                return (organizer._lowername.indexOf(lowercaseQuery) != -1);
            };

        }

        function debounceSearch() {
            var now = new Date().getMilliseconds();
            lastSearch = lastSearch || now;

            return ((now - lastSearch) < 300);
        }

        function loadContactsProfilePicture(organizers) {

            return organizers.map(function (org, index) {
                var organizer = {
                    name: org.name,
                    email: org.mail,
                    image: gravatar(org.mail),
                    _lowername: org.name.toLowerCase()
                };
                return organizer;
            });
        }
    }

    function Orgnizer(name, mail) {
        this.name = name;
        this.mail = mail;
    }

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
