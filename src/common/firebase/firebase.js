(function() {
  'use strict';

  angular.module('gugCZ.webAdmin.common.firebase', [
    'firebase'
  ])
      .provider('firebaseDB', function() {
        this.config = {};

        this.setConfig = function(config) {
          this.config = config;
        };

        this.$get = function() {
          firebase.initializeApp(this.config);
          return firebase.database();
        }

      })
      .service('firebaseSignService', function(firebaseDB) {  // we need initialized app

        this.signInWithCustomToken = function(customToken) {
          return firebase.auth().signInWithCustomToken(customToken).then(function(u) {
            console.log(u)
            return u;
          })
        }

      });


})
();