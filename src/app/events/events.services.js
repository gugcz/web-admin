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
    };

    // TODO Refactor this very ugly code
    self.getOrgnizersByChapters = function(chapters) {
      var organizers = [];

      if (isArrayBlank(chapters)) {
        return organizers;
      }

      chapters.forEach(function(chapter) {
        var chapterOrganizers = $firebaseArray(firebaseDB.ref('orgs').orderByChild('chapters/' + chapter.$id).equalTo(true));

        chapterOrganizers.$loaded().then(function(chapterOrganizers) {
          chapterOrganizers.forEach(function(organizer) {
            organizers.push(organizer);
          });
        }).then(function() {
          organizers = getArrayWithoutDuplicates(organizers);

        });
      });
      return organizers;
    };

    function isArrayBlank(array) {
      return angular.isUndefined(array) || array.length <= 0;
    }
  }


  function getArrayWithoutDuplicates(array) {
    for (var i = 0; i < array.length - 1; i++) {
      if (array[i].$id == array[i + 1].$id) {
        array.splice(i, 1);
      }
    }
    return array;
  }


  angular.module('gugCZ.webAdmin.events.services', [
    'gugCZ.firebase'
  ])
    .service('firebaseEvents', firebaseFactory);

})();
