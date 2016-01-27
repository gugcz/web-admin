(function() {
  'use strict';

  var AuthTokenStore = function(webStorage, $rootScope) {

    var TOKEN_STORE_KEY = 'gugCZ.auth:tokenData';

    this.data = null;

    /**
     * @returns object
     */
    this.getTokenData = function() {
      return this.data;
    };

    /**
     * @returns boolean
     */
    this.hasToken = function() {
      return Boolean(this.data);
    };

    this.clear = function() {
      this.data = null;

      webStorage.session.remove(TOKEN_STORE_KEY);

      $rootScope.$broadcast('gugCZ.auth:changedState');
    };

    /**
     * @param tokenData
     */
    this.setTokenData = function(tokenData) {
      if (!tokenData) {
        return;
      }

      webStorage.session.set('cz.angular.auth:token', tokenData);

      this.data = tokenData;
      $rootScope.$broadcast('gugCZ.auth:changedState');
    };

    this.setTokenData(webStorage.session.get(TOKEN_STORE_KEY));
  };

  angular.module('gugCZ.auth')
      .service('authTokenStore', AuthTokenStore);

})();