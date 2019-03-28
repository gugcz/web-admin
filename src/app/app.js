angular.module('gugCZ.webAdmin', [
  'angular-loading-bar',
  'ngMaterial',
  'ngImageInputWithPreview',
  'ngMessages',
  'ui.router',
  'txx.diacritics',
  'pascalprecht.translate',
  'webStorageModule',
  'gugCZ.auth',

  // generated content
  'appConfig',
  'appTemplates',
  'appTranslations',

  'gugCZ.webAdmin.loginPage',
  'gugCZ.webAdmin.chapter',
  'gugCZ.webAdmin.dashboard',
  'gugCZ.webAdmin.errors',
  'gugCZ.webAdmin.events',
  'gugCZ.webAdmin.reports',
  'gugCZ.webAdmin.venues',
  'gugCZ.webAdmin.organizers'
])

    .config(function ($stateProvider) {
      $stateProvider.state('base', {
        url: '/',
        controller: function ($mdSidenav, $firebaseObject, $state, $scope, $translate, currentUser, organizerService) {
          this.user = currentUser;

          function getAdminSideMenu() {
            return [
              {
                link: 'dashboard',
                title: 'MENU.DASHBOARD',
                icon: 'home'
              },
              {
                link: 'organizers',
                title: 'MENU.ORGANIZERS_MANAGEMENT',
                icon: 'account'
              },
              {
                link: 'chapters',
                title: 'MENU.CHAPTERS_MANAGEMENT',
                icon: 'account-multiple'
              }
            ];
          }

          function getChapterSideMenu() {
            return [
              {
                link: 'dashboard',
                title: 'MENU.DASHBOARD',
                icon: 'home'
              },
              {
                link: 'organizers.me',
                title: 'MENU.PROFILE_MANAGEMENT',
                icon: 'account'
              },
              {
                link: 'chapters.this',
                title: 'MENU.CHAPTER_MANAGEMENT',
                icon: 'account-multiple'
              },
              {
                link: 'venues',
                title: 'MENU.VENUES_MANAGEMENT',
                icon: 'map-marker'
              }
            ];
          }

          this.$onInit = function () {
            this.selectedChapter = organizerService.getCurrentChapter();
            this.lastSelectedChapter = this.selectedChapter;
            this.setSideMenuByRole();
          };

          this.setSideMenuByRole = function () {
            if (this.selectedChapter === 'admin' || this.isCurrentStateAdmin()) {
              this.selectedChapter = 'admin';
              organizerService.setCurrentChapter('admin');
              this.lastSelectedChapter = this.selectedChapter;
              this.menu = getAdminSideMenu();
            } else {
              this.menu = getChapterSideMenu();
            }
          };

          this.isCurrentStateAdmin = function () {
            return (getAdminSideMenu().some(menuItem => menuItem.link === $state.current.name)
                || ($state.current.name.indexOf('chapters') !== -1 && $state.current.name !== 'chapters.this')
                || ($state.current.name.indexOf('organizers') !== -1 && $state.current.name !== 'organizers.me'))
                && $state.current.url !== 'dashboard'
                && this.user.roles.admin;
          };

          this.selectChapter = function () {
            organizerService.setCurrentChapter(this.selectedChapter);
            if ((this.lastSelectedChapter === 'admin' && this.selectedChapter !== 'admin')
                || (this.lastSelectedChapter !== 'admin' && this.selectedChapter === 'admin')) {
              $state.go('dashboard', {}, {reload: true});
            } else {
              $state.reload();
            }
          };

          this.toggleSidenav = buildToggler('left');

          function buildToggler(componentId) {
            return function () {
              $mdSidenav(componentId).toggle();
            };
          }

          this.state = $state;

          // TODO What is default?
          this.menu = getChapterSideMenu();


        },
        controllerAs: 'app',
        templateUrl: 'app/app.html',
        data: {
          title: 'TITLES.GUG_ADMIN',
          authLogged: true
        },
        resolve: {
          currentUser: function (organizerService) {
            return organizerService.getCurrentUser();
          }
        },
        abstract: true
      });

    })

    .config(function ($urlRouterProvider) {
      $urlRouterProvider
          .otherwise('/login');
    })

    .config(function (SLACK_AUTH, slackAuthProvider) {
      slackAuthProvider.setClientId(SLACK_AUTH.clientId);
      slackAuthProvider.setTeamId(SLACK_AUTH.teamId);
      slackAuthProvider.setRedirectUrl(SLACK_AUTH.redirectUrl);
    })

    .config(function ($translateProvider, LANGUAGE) {
      $translateProvider.useSanitizeValueStrategy('escaped');
      $translateProvider.preferredLanguage(LANGUAGE.preferred);
    })

    .config(function (FIREBASE) {
      firebase.initializeApp(FIREBASE);
    })

    .config(function ($mdThemingProvider, cfpLoadingBarProvider) {
      cfpLoadingBarProvider.includeSpinner = false;

      $mdThemingProvider.theme('default')
          .primaryPalette('green');
    })

    .config(function ($mdIconProvider) {
      $mdIconProvider
          .iconSet('mdi', 'images/mdi.svg');
    })

    .config(function ($httpProvider) {
      //Enable cross domain calls
      $httpProvider.defaults.useXDomain = true;

      //Remove the header used to identify ajax call  that would prevent CORS from working
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })

    .run(function ($log, $mdToast, $rootScope, $state, cfpLoadingBar) {

      $rootScope.$on('$stateChangeStart', function () {
        cfpLoadingBar.start();
      });

      $rootScope.$on('$stateChangeSuccess', function () {
        cfpLoadingBar.complete();
      });

      const errorHandler = function (event, toState, fromState, toParams, fromParams, error) {
        cfpLoadingBar.set(0);
        $log.error(error, toState, fromState, toParams, fromParams);
      };

      $rootScope.$on('$stateNotFound', errorHandler);
      $rootScope.$on('$stateChangeError', errorHandler);

      $rootScope.$on('auth:login', function (event) {
        if ($state.is('loginPage')) {
          $state.go('dashboard');
        }
      });

      $rootScope.$on('auth:logout', function () {
        $state.go('loginPage');
      });

      $rootScope.$on('auth:loginCanceled', function () {
        cfpLoadingBar.set(0);
        $mdToast.showSimple('You must be logged!');

        $state.go('loginPage');
      });
    });
