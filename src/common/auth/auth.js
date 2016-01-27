(function() {
  'use strict';

  function tokenInterceptor(authTokenStore, API_URL) {
    return {
      request: function(config) {
        if (config.url.indexOf(API_URL) === -1) {
          return config;
        }

        if (authTokenStore.hasToken()) {
          config.headers['Authorization'] = authTokenStore.data.token;
        }
        return config;
      }
    };
  }

  function oauthUrlProvider() {
    this.settings = {
      url: '//secure.meetup.com/oauth2/authorize?response_type=token&scope=ageless',
      clientId: '',
      redirectUri: ''
    };

    this.setClientId = function(clientId) {
      this.settings.clientId = clientId;
    };

    this.setRedirectUrl = function(url) {
      this.settings.redirectUri = url;
    };

    this.$get = function() {
      return this.settings.url +
          '&client_id=' + this.settings.clientId +
          '&redirect_uri=' + this.settings.redirectUri;
    }
  }

  angular.module('gugCZ.auth', [
        'webStorageModule',
        'gugCZ.webAdmin.config'
      ])
      .provider('oauthUrl', oauthUrlProvider)
      .config(function($httpProvider) {
        $httpProvider.interceptors.push(tokenInterceptor)
      });

})();