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
          return firebase.database();
        }

      })


})
();