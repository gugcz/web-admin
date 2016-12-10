(function() {
  'use strict';

  angular.module('gugCZ.webAdmin.login', [
        'ui.router'
      ]
  )
      .config(function($stateProvider) {

        $stateProvider.state('login', {
          parent: 'base',
          url: 'login?code&state',
          controller: function($stateParams, $http, authTokenStore) {

            this.data = {
              "ok": true,
              "access_token": "xoxp-9129013744-12718182787-115882618854-9b7beacf0ddfcc320e33494d91a7feed",
              "scope": "identity.basic",
              "user": {
                "name": "milanlempera",
                "id": "U0CM45CP5"
              },
              "team": {
                "id": "T093T0DMW"
              }
            };

            this.$stateParams = $stateParams

            this.code = $stateParams.code;
            //
            // $http.get("https://slack.com/api/oauth.access?&client_id=9129013744.115894198615&client_secret=a6237b88fc327490a28f7a85898e087c",
            //     {
            //       params: {
            //         code: $stateParams.code
            //       }
            //     }).then(function(response) {
            //   this.data = response.data
            // }.bind(this));


            authTokenStore.setTokenData(this.tokenData);

          },
          controllerAs: 'login',
          templateUrl: 'app/login/login.html'
        });
      });

})();
