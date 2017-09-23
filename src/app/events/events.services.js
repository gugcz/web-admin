function firebaseFactory(firebaseDB, $q, $firebaseArray, $log) {
  const self = this;
  const chapterID = null;

  self.addEvent = function (event) {
    $log.debug('You send this event:', event);
  };

  self.getChapters = function () {
    return $firebaseArray(firebaseDB.ref('chapters'));
  };

  /**
   * @return Promise<array>
   */
  self.getOrganizersByChapters = function (chapters) {
    const organizers = [];

    if (isArrayBlank(chapters)) {
      return $q.resolve(organizers);
    }

    return $q.all(chapters.map(loadChapterOrgs))
      .then(function (chaptersOrgs) {
        const chaptersOrgsByIds = chaptersOrgs.map(transformToOrgsById);
        return Object.assign.apply(Object, chaptersOrgs.map(transformToOrgsById));  // merge to one object by ids
      });
  };

  self.getFutureEvents = function (chapterId) {
    var unreportedEventsRef = firebaseDB.ref('events').orderByChild('chapters/' + chapterId).equalTo(true)
    return $firebaseArray(unreportedEventsRef)
  }

  self.getUnreportedEvents = function () {
    var unreportedEventsRef = firebaseDB.ref('events').orderByChild('report').equalTo(null);
    return $firebaseArray(unreportedEventsRef)
  }

  self.getUnpublishedEvents = function () {
    var unreportedEventsRef = firebaseDB.ref('events').orderByChild('published').equalTo(false);
    return $firebaseArray(unreportedEventsRef)
  }

  function isArrayBlank(array) {
    return angular.isUndefined(array) || array.length <= 0;
  }

  function loadChapterOrgs(chapter) {
    return $firebaseArray(firebaseDB
      .ref('organizers')
      .orderByChild('chapters/' + chapter.$id)
      .equalTo(true))
      .$loaded();
  }

  function transformToOrgsById(chaptersOrgs) {
    return chaptersOrgs.reduce(function (orgsObj, org) {
      orgsObj[org.$id] = org;
      return orgsObj;
    }, {});
  }
}


function getArrayWithoutDuplicates(array) {
  for (let i = 0; i < array.length - 1; i++) {
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
