(function() {
  'use strict';

  var authDataStore = {
    pending: true
  };


  var AuthService = function($firebaseAuth, $http, $q, $rootScope, $state, slackAuth) {

    this.authObj = $firebaseAuth();

    var firebaseReadyDeferred = $q.defer();
    this.firebaseAuthReadyPromise = firebaseReadyDeferred.promise;

    this.authObj.$onAuthStateChanged(function(firebaseUser) {
      if (authDataStore.pending) {
        authDataStore.pending = false;
        firebaseReadyDeferred.resolve(firebaseUser);
      }

      if (firebaseUser) {
        authDataStore.firebaseUser = firebaseUser;
        $rootScope.$broadcast('auth:login', authDataStore.firebaseUser);

      } else {
        authDataStore.firebaseUser = null;
        $rootScope.$broadcast('auth:logout');
      }

    });

    this.signInWithCustomToken_ = function(customToken) {
      return this.authObj.$signInWithCustomToken(customToken)
          .then(function(currentUser) {
            $rootScope.$broadcast('gugCZ.webAdmin.firebase:signInSuccess', currentUser);

            return currentUser;
          })
          .catch(function(error) {
            $rootScope.$broadcast('gugCZ.webAdmin.firebase:signInError', error);
          });
    };

    /**
     * @return Promise
     */
    this.login = function() {
      return slackAuth.requestAuth()
          .then(this.signInWithCustomToken_.bind(this));
    };

    /**
     * @return Promise
     */
    this.logout = function() {
      return this.authObj.$signOut();
    };

    this.isPending = function() {
      return authDataStore.pending;
    };

    /**
     * @return {boolean}
     */
    this.isAuthenticated = function() {
      return !authDataStore.pending && authDataStore.firebaseUser;
    };


    /**
     * @return {boolean}
     */
    this.hasSomeRole = function() {
      // TODO for this app is not necessary
      return false;
    };

  };


  angular.module('gugCZ.auth.service', [
    'gugCZ.firebase'
  ])
      .service('authService', AuthService)

})();
