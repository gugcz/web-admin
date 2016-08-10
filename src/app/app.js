(function() {
  'use strict';

    function AddChapterCtrl() {
        var self = this;
        var pendingSearch, cancelSearch = angular.noop;
        var cachedQuery, lastSearch;
        // var organizers = loadContactsProfilePicture(firebaseData.getAllOrganizers());
        var organizers = [];

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

                // http get
                return pendingSearch = $q(function (resolve, reject) {

                    cancelSearch = reject;
                    // Now, it shows all contacts
                    refreshDebounce();
                    resolve(self.querySearch());
                })
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
                    image: gravatar(org.mail)
                };
                return organizer;
            });
        }
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
