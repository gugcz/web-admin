const authDataStore = {
  pending: true
};

function AuthService($firebaseAuth, $http, $log, $q, $rootScope, $state, SSO, slackAuth) {

  this.authObj = $firebaseAuth();

  const firebaseReadyDeferred = $q.defer();
  this.firebaseAuthReadyPromise = firebaseReadyDeferred.promise;

  this.authObj.$onAuthStateChanged(function (firebaseUser) {
    $log.log('firebaseUser:', firebaseUser);
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

  this.signInWithCustomToken_ = function (customToken) {
    return this.authObj.$signInWithCustomToken(customToken)
      .then(function (currentUser) {
        $rootScope.$broadcast('gugCZ.webAdmin.firebase:signInSuccess', currentUser);

        return currentUser;
      })
      .catch(function (error) {
        $rootScope.$broadcast('gugCZ.webAdmin.firebase:signInError', error);
      });
  };

  this.getFirebaseToken = function (token) {
    return $http.get(SSO.authTokenUrl, {
      headers: {'Authorization': 'token=' + token}
    })
      .then(function (response) {
        return response.data.firebaseToken;
      });
  };

  /**
   * @return Promise
   */
  this.login = function () {
    return slackAuth.requestAuth()
      .then(this.getFirebaseToken.bind(this))
      .then(this.signInWithCustomToken_.bind(this))
      .catch($log.error);
  };

  /**
   * @return Promise
   */
  this.logout = function () {
    return this.authObj.$signOut();
  };

  this.isPending = function () {
    return authDataStore.pending;
  };

  /**
   * @return {boolean}
   */
  this.isAuthenticated = function () {
    return !authDataStore.pending && authDataStore.firebaseUser;
  };

  this.getOAuthToken = function () {
    return this.authObj.$getAuth()._lat;
  }


  /**
   * @return {boolean}
   */
  this.hasSomeRole = function () {
    // TODO for this app is not necessary
    return false;
  };

};


angular.module('gugCZ.auth.service', [
  'gugCZ.firebase'
])
  .service('authService', AuthService);
