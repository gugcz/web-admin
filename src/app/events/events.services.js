function firebaseFactory(firebaseDB, $q, $firebaseArray, $log, $firebaseObject) {
  const self = this;
  const chapterID = null;

  function saveEvent(event, eventId) {
    $log.debug('You send this event:', event);
    return firebaseDB.ref('events/' + eventId).set(event);
  };

  self.saveEvent = function (event) {
    $log.debug('You send this event:', event);
    event.isPublished = false;
    return saveEvent(event);
  };

  self.saveAndPublishEvent = function (event) {
    event.isPublished = true;
    $log.debug('You send this event:', event);
    return saveEvent(event);
  };

  self.loadEvent = function (eventId) {
    return $firebaseObject(firebaseDB.ref('events/' + eventId)).$loaded().then(event => {
      event.chapters = getArrayFromKeyValue(event.chapters)

      return event;
    });
  };

  // TODO Add name
  function getArrayFromKeyValue(keyValue) {
    return Object.keys(keyValue).map(function (key) {
      if (keyValue[key])
        return {$id: key};
    });
  }

  self.getChapters = function () {
    return $firebaseArray(firebaseDB.ref('chapters'));
  };

  self.reportEvent = function (eventId, report) {
    console.log('sending report for', eventId, report);
    return firebaseDB.ref('events/' + eventId + '/report').set(report);
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

  self.getChapterEvents = function (chapterId) {
    var chapterEventsRef = firebaseDB.ref('events').orderByChild('chapters/' + chapterId).equalTo(true);
    return $firebaseArray(chapterEventsRef);
  };

  self.deleteEvent = function (eventId) {
    return firebaseDB.ref('events/' + eventId).remove()
  };

  self.publishEvent = function (eventId) {
    return firebaseDB.ref('events/' + eventId + '/published').set(true)
  };

  self.hideEvent = function (eventId) {
    return firebaseDB.ref('events/' + eventId + '/published').set(false)
  };

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
  'gugCZ.firebase',
])
  .service('firebaseEvents', firebaseFactory);
