function firebaseFactory(firebaseDB, $q, $log, removeDiacritics, $firebaseArray, $firebaseObject, firebaseSTORAGE) {
  let chapterID = null;

  this.getAllOrganizers = function () {
    const organizers = [];
    const ref = firebaseDB.ref('organizers');

    //return $q.when($firebaseArray(ref));

    return $q.when(ref.once('value').then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        let orgObject = childSnapshot.val();
        orgObject.$id = childSnapshot.key
        organizers.push(orgObject);
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
            let orgObject = childSnapshot.val();
            orgObject.$id = childSnapshot.key
            organizers.push(orgObject);
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

  function isUploadedNewCover(cover) {
    return cover && !isValidURL(cover);
  }

  function isValidURL(str) {
    return str.includes('http');
  }

  function saveCover(id, cover) {
    let picRef = firebaseSTORAGE.ref('covers/chapter/' + id + '.png');

    return picRef.putString(cover, 'base64');
  }

  this.addChapter = function (chapter) {


    // TODO not solved new chapter
    if (isUploadedNewCover(chapter.cover)) {

      return saveCover(chapter.$id, chapter.cover).then(snapshot => {

        chapter.cover =  snapshot.downloadURL;
        return chapter.$save();
      });
    }
    return chapter.$save();
  };

  function getChapterID(chapter) {
    return chapter.section.toLowerCase() + '-' + removeDiacritics.replace(chapter.name).replace(' ', '-').toLowerCase();
  }

  this.getChapterByID = function (chapterID) {
    return $firebaseObject(firebaseDB.ref('chapters/' + chapterID));
  };


  this.addChapterToOrganizers = function (chapter, organizers) {
    let chapterId = chapter.$id;

    firebaseDB.ref('chapterOrganizers/' + chapterId).remove().then(() => {
      organizers.map(org => org.$id).forEach(orgId => {
        // TODO Deleting records

        Promise.all([firebaseDB.ref('chapterOrganizers/' + chapterId + '/' + orgId).set(true), // TODO - Deleting
          firebaseDB.ref('organizers/' + orgId + '/chapters/' + chapterId).set(true)]).catch(error => console.log(orgId));
      });
    })

  };
}

angular.module('gugCZ.webAdmin.chapter.services', [
  'gugCZ.firebase'])
  // TODO Bad naming
  .service('firebaseData', firebaseFactory);

