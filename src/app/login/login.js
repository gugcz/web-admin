(function() {
  'use strict';

  angular.module('gugCZ.webAdmin.login', [
        'ui.router'
      ]
      )
      .config(function($stateProvider) {

        $stateProvider.state('login', {
          parent: 'base',
          url: 'access_token={accessToken}&token_type={tokenType}&expires_in={expiresIn}',
          controller: function($stateParams, authTokenStore, authUserService) {
            this.progress = {
              token: true,
              login: false
            };

            this.tokenData = {
              token: $stateParams.accessToken,
              type: $stateParams.tokenType,
              expires: $stateParams.expiresIn

            };

            this.setProgressComplete = function() {
              this.progress.login = true;
            };

            authTokenStore.setTokenData(this.tokenData);

            authUserService.load()
                .then(this.setProgressComplete.bind(this))

          },
          controllerAs: 'login',
          templateUrl: 'app/login/login.html'
        });
      });

})();
