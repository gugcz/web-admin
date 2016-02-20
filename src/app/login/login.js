(function() {
  'use strict';

  angular.module('gugCZ.webAdmin.login', [
        'ui.router'
      ]
      )
      .config(function($stateProvider) {

        $stateProvider.state('login', {
          parent: 'base',
          url: 'access_token={accessToken:[^\&]*}&scope={scope}&token_type={tokenType}&expires_in={expiresIn}',
          controller: function($stateParams, authTokenStore) {

            this.tokenData = {
              token: $stateParams.accessToken,
              type: $stateParams.tokenType,
              expires: $stateParams.expiresIn,
              scope: $stateParams.scope
            };

            authTokenStore.setTokenData(this.tokenData);

          },
          controllerAs: 'login',
          templateUrl: 'app/login/login.html'
        });
      });

})();
