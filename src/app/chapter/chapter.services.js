(function() {
  'use strict';

  function firebaseFactory(firebaseDB, $q, $firebaseArray, removeDiacritics) {
    var self = this;
    var chapterID = null;

    self.getAllOrganizers = function() {
      var organizers = [];
      var ref = firebaseDB.ref('orgs/');
      return $q.when(ref.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          organizers.push(childSnapshot.val());
        });
        return organizers;
      }));

    };

    self.setChapterID = function(chapter) {
      chapterID = getChapterID(chapter);
    };

    self.addChapter = function(chapter) {
      var chaptersRef = firebaseDB.ref('chapters/');
      chaptersRef.child(chapterID).set(chapter);
    };

    function getChapterID(chapter) {
      return chapter.section.toLowerCase() + '_' + removeDiacritics.replace(chapter.name).replace(' ', '_').toLowerCase();
    }

    self.addChapterToOrganizers = function(organizers) {
      organizers.forEach(function(org) {
        addChapterToOrganizer(org.email);
      })
    };

    function addChapterToOrganizer(orgMail) {
      firebaseDB.ref('orgs/').orderByChild('mail').equalTo(orgMail).once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var orgID = childSnapshot.key;
          var updates = getOrgObjectWhichHasAddedChapter();
          firebaseDB.ref('orgs/' + orgID + '/chapters').update(updates);
        });
      });
    }

    function getOrgObjectWhichHasAddedChapter() {
      var organizerObject = {};
      organizerObject[chapterID] = true;
      return organizerObject;
    }


  }


  angular.module('gugCZ.webAdmin.chapter.services', [
        'gugCZ.firebase'
      ]
  )
      .service('firebaseData', firebaseFactory)

})();