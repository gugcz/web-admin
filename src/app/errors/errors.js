(function() {
  'use strict';

  var ErrorController = function($state, $previousState) {
    this.data = $state.current.data;

    this.goBack = function() {
      $previousState.go();
    };
  };

  angular.module('gugCZ.webAdmin.errors', [
    'ui.router',
    'ct.ui.router.extras.previous'
  ])

      .config(function($stateProvider) {
        $stateProvider
            .state('error', {
              controller: ErrorController,
              controllerAs: 'errorCtrl',
              templateUrl: 'app/errors/errors.html',
              abstract: true
            })

            .state('error.404', {
              data: {
                class: 'error-404',
                title: 'ERROR 404'
              }
            })

            .state('error.403', {
              data: {
                class: 'error-403',
                title: 'ERROR 403'
              }
            })

            .state('error.500', {
              data: {
                class: 'error-500',
                title: 'ERROR 500'
              }
            });
      })

      .run(function($rootScope, $state, $log) {

        function errorHandlerFactory(state) {
          return function() {
            $log.error("%s: %s(%s) -> %s(%s)", state,
                arguments[3].name, angular.toJson(arguments[4]),
                arguments[1].name, angular.toJson(arguments[2]),
                arguments[5]);    // todo better logs in all error handlers
            $state.go(state);
          };

        }

        $rootScope.$on('$stateNotFound', errorHandlerFactory('error.404'));
        $rootScope.$on('$stateChangeError', errorHandlerFactory('error.500'));

      });

})();
