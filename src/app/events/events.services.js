(function() {
  'use strict';

  function firebaseFactory(firebaseDB, $q, $firebaseArray, removeDiacritics, $log) {
    var self = this;
    var chapterID = null;

    self.addEvent = function(event) {
      $log.debug(event);
    };

    self.getChapters = function() {
      return $firebaseArray(firebaseDB.ref('chapters'));
    }
  }


  angular.module('gugCZ.webAdmin.events.services', [
    'gugCZ.firebase'
  ])
      .service('firebaseEvents', firebaseFactory);

})();
