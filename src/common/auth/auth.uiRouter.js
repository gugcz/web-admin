const stateAuthService = function ($rootScope, $state, authService) {

  /**
   * @param state
   * @returns {boolean}
   */
  this.isPublicVisible = function (state) {
    if (!state.hasOwnProperty('data')) {
      return true;
    }

    let mustBeLogged = state.data.authLogged ||
      (state.data.authRoles && angular.isArray(state.data.authRoles) && state.data.authRoles.length > 0);

    return !mustBeLogged;
  };

  /**
   * @param state {object}
   * @returns {boolean}
   */
  this.hasPermissionForState = function (state) {
    if (state.data.authRoles) {
      if (!authService.hasSomeRole(state.data.authRoles)) {
        return false;
      }
    }

    return true;
  };

  /**
   * $stateChangeStart listener
   * @param event
   * @param toState
   * @param toParams
   */
  this.checkPermissionWhenStateChangeStarted = function (event, toState, toParams) {
    if (this.isPublicVisible(toState)) {
      return;
    }

    if (authService.isPending()) {
      this.stopRoutingUntilFirebaseAuthStarts_(event, toState, toParams);
      return;
    }

    if (authService.isAuthenticated()) {
      this.checkPermissionsAndBroadcastIfError_(toState, event);
    } else {
      this.serveDeferredLogin_(event, toState, toParams);
    }
  };

  /**
   * @param event
   * @param toState
   * @param toParams
   * @private
   */
  this.stopRoutingUntilFirebaseAuthStarts_ = function (event, toState, toParams) {
    event.preventDefault();

    authService.firebaseAuthReadyPromise.then(function () {
      $state.go(toState, toParams);
    });
  };


  /**
   * @param state
   * @param event
   * @returns {boolean}
   * @private
   */
  this.checkPermissionsAndBroadcastIfError_ = function (state, event) {
    if (!this.hasPermissionForState(state)) {
      if (event) {
        event.preventDefault(); // stop routing
      }
      $rootScope.$broadcast('cz.angular.auth:permissionError', 'User has not permissions to ' + state.name);
      return false;
    }

    return true;
  };

  /**
   * @param event
   * @param toState
   * @param toParams
   * @private
   */
  this.serveDeferredLogin_ = function (event, toState, toParams) {
    event.preventDefault(); // stop routing

    return authService.login()
      .catch(function () {
        this.broadcastLoginCancel_(toState);
      }.bind(this));
  };

  /**
   * @param toState
   */
  this.broadcastLoginCancel_ = function (toState) {
    $rootScope.$broadcast('auth:loginCanceled', 'User cancel login process in transition to ' + toState.name);
  };

};

angular.module('gugCZ.auth.uiRouter', [
  'ui.router',
  'gugCZ.auth.service'
])
  .service('stateAuth', stateAuthService)
  .run(function ($rootScope, stateAuth) {
    $rootScope.$on('$stateChangeStart', stateAuth.checkPermissionWhenStateChangeStarted.bind(stateAuth));
  });
