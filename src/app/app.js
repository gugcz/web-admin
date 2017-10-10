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
              title: 'Dashboard',
              icon: 'home'
            },
            {
              link: 'organizers',
              title: $translate.instant('ORGANIZERS.MANAGEMENT'),
              icon: 'account'
            },
            {
              link: 'chapters',
              title: $translate.instant('CHAPTERS.MANAGEMENT'),
              icon: 'account-multiple'
            }
          ];
        }

        function getChapterSideMenu() {
          return [
            {
              link: 'dashboard',
              title: 'Dashboard',
              icon: 'home'
            },
            {
              link: 'organizers.me',
              title: $translate.instant('PROFILE.MANAGEMENT'),
              icon: 'account'
            },
            {
              link: 'chapter',
              title: $translate.instant('CHAPTER.MANAGEMENT'),
              icon: 'account-multiple'
            },
            {
              link: 'venues',
              title: 'Správa venues',
              icon: 'map-marker'
            }
          ];
        }

        this.$onInit = function () {
          this.selectedChapter = organizerService.getCurrentChapter();
          setSideMenuByRole.call(this);
        };

        function setSideMenuByRole() {
          if (this.selectedChapter === 'admin') {
            this.menu = getAdminSideMenu();
          }
          else {
            this.menu = getChapterSideMenu();
          }
        }

        this.selectChapter = function () {
          organizerService.setCurrentChapter(this.selectedChapter);

          // TODO Refactor .call function
          $state.reload();

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
        title: 'GUG.cz Administrace',
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
