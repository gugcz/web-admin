function firebaseFactory(firebaseDB, $q, $log, removeDiacritics, $firebaseArray, $firebaseObject) {
  let chapterID = null;

  this.getAllOrganizers = function () {
    const organizers = [];
    const ref = firebaseDB.ref('organizers');

    //return $q.when($firebaseArray(ref));

    return $q.when(ref.once('value').then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        organizers.push(childSnapshot.val());
      });
      return organizers;
    }));

  };

  this.getChapterOrgs = function (chapterId) {
    const organizers = [];
    return firebaseDB
        .ref('organizers')
        .orderByChild('chapters/' + chapterId)
        .equalTo(true)
        .once('value').then(function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            organizers.push(childSnapshot.val());
          });
          return organizers;
        });
  };

  this.getAllChapters = function () {
    return $firebaseArray(firebaseDB.ref('chapters'));
  };

  this.setChapterID = function (chapter) {
    chapterID = getChapterID(chapter);
  };

  this.addChapter = function (chapter) {
    // TODO not solved new chapter
    chapter.$save();
  };

  function getChapterID(chapter) {
    return chapter.section.toLowerCase() + '-' + removeDiacritics.replace(chapter.name).replace(' ', '-').toLowerCase();
  }

  this.getChapterByID = function (chapterID) {
    return $firebaseObject(firebaseDB.ref('chapters/' + chapterID));
  };

  this.addChapterToOrganizers = function (organizers) {
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
  // TODO Bad naming
  .service('firebaseData', firebaseFactory);

