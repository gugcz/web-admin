(function() {
  'use strict';

  angular.module('gugCZ.firebase', [
    'firebase'
  ])
    .factory('firebaseDB', function() {
      return firebase.database();
    })
    .factory('firebaseAuth', function($firebaseAuth) {
      return $firebaseAuth();
    });
})();
