function firebaseFactory(firebaseDB, $q, $log, removeDiacritics, $firebaseArray) {
  const self = this;
  var chapterID = null;

  self.getAllOrganizers = function () {
    const organizers = [];
    const ref = firebaseDB.ref('organizers');

    //return $q.when($firebaseArray(ref));

    return $q.when(ref.once('value').then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {

        organizers.push(childSnapshot.val());
      });
      $log.debug(organizers);

      return organizers;
    }));

  };

  self.setChapterID = function (chapter) {
    chapterID = getChapterID(chapter);
  };

  self.addChapter = function (chapter) {
    const chaptersRef = firebaseDB.ref('chapters/');
    chaptersRef.child(chapterID).set(chapter);
  };

  function getChapterID(chapter) {
    return chapter.section.toLowerCase() + '_' + removeDiacritics.replace(chapter.name).replace(' ', '_').toLowerCase();
  }

  self.addChapterToOrganizers = function (organizers) {
    organizers.forEach(function (org) {
      addChapterToOrganizer(org.email);
    });
  };

  function addChapterToOrganizer(orgMail) {
    firebaseDB.ref('orgs/').orderByChild('mail').equalTo(orgMail).once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        const orgID = childSnapshot.key;
        const updates = getOrgObjectWhichHasAddedChapter();
        firebaseDB.ref('orgs/' + orgID + '/chapters').update(updates);
      });
    });
  }

  function getOrgObjectWhichHasAddedChapter() {
    const organizerObject = {};
    organizerObject[chapterID] = true;
    return organizerObject;
  }


}


angular.module('gugCZ.webAdmin.chapter.services', [
  'gugCZ.firebase'])
  .service('firebaseData', firebaseFactory);

