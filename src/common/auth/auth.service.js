(function() {
  'use strict';

  var authDataStore = {
    pending: true
  };


  var AuthService = function($firebaseAuth, $http, $q, $rootScope, $state, firebaseHelper, slackAuth) {

        this.authObj = $firebaseAuth();

        var firebaseReadyDeferred = $q.defer();
        this.firebaseAuthReadyPromise = firebaseReadyDeferred.promise;

        this.authObj.$onAuthStateChanged(function(firebaseUser) {
          if (authDataStore.pending) {
            authDataStore.pending = false;
            firebaseReadyDeferred.resolve(firebaseUser);
          }

          if (firebaseUser) {
            console.log("$onAuthStateChanged: Signed in as:", firebaseUser.uid);
            authDataStore.firebaseUser = firebaseUser;
          } else {
            console.log("$onAuthStateChanged: Signed out");
            authDataStore.firebaseUser = null;
          }

        });

        this.signInWithCustomToken_ = function(customToken) {
          return this.authObj.$signInWithCustomToken(customToken)
              .then(function(currentUser) {
                console.log('firebase login success', arguments);
                $rootScope.$broadcast('gugCZ.webAdmin.firebase:signInSuccess', currentUser);

                return currentUser;
              })
              .catch(function(error) {
                if (webStorage.isSupported && webStorage.has('gugCZ.auth:accessToken')) {
                  webStorage.remove('gugCZ.auth:accessToken');
                }

                console.log('firebase login error', arguments);
                $rootScope.$broadcast('gugCZ.webAdmin.firebase:signInError', error);
              });
        };

        /**
         * @return Promise
         */
        this.login = function() {
          return slackAuth.requestAuth()
              .then(this.signInWithCustomToken_.bind(this))
              .then(function() {
                    // TODO config?
                    if ($state.is('loginPage')) {
                      console.log("redirect after login");
                      $state.go('dashboard');
                    }
                  }
              )
        }
        ;

        /**
         * @return Promise
         */
        this.logout = function() {
          return this.authObj.$signOut();
        };

        /**
         * @return {Promise<boolean>}
         */
        this.isAuthenticated = function() {
          return firebaseHelper.firebaseFirstLoginChange();
        };

        /**
         * @return {boolean}
         */
        this.isAuthenticatedSync = function() {
          return !authDataStore.pending && authDataStore.firebaseUser;
        };

        /**
         * @return {object}
         */
        this.getUserName = function() {
          if (this.isAuthenticated()) {
            return authDataStore.data.name;
          }
        };

        /**
         * @return {boolean}
         */
        this.hasSomeRole = function() {
          // TODO for this app is not necessary
          return false;
        };

        /**
         *
         * @param response
         * @return {boolean}
         */
        this.isRequestRecoverable = function(response) {
          return response.status === 401 && !this.isLoginResponse_(response);
        };

        /**
         * @param response
         * @return {boolean}
         * @private
         */
        this.isLoginResponse_ = function(response) {
          return response.config.url === this.LOGIN_URL;
        };
      }
      ;

  function FirebaseHelper($firebaseAuth, $q) {

    this.firebaseFirstLoginChange = function() {
      var authObj = $firebaseAuth();

      var deferred = $q.defer();

      var off = authObj.$onAuthStateChanged(function(firebaseUser) {
        off();

        deferred.resolve(firebaseUser);

      });

      return deferred.promise;

    };

  }


  angular.module('gugCZ.auth.service', [])
      .service('firebaseHelper', FirebaseHelper)
      .service('authService', AuthService)

})
();
