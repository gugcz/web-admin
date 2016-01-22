(function() {
  'use strict';

  function tokenInterceptor(authTokenStore) {
    return {
      request: function(config) {
        if (authTokenStore.tokenData) {
          debugger;
          config.params[access_token] = authTokenStore.tokenData.token;
        }
        return config;
      }
    };
  }

  angular.module('gugCZ.auth', ['webStorageModule'])
      .config(function($httpProvider) {
        $httpProvider.interceptors.push(tokenInterceptor);
      })

})();