function firebaseFactory(firebaseDB, $q, $firebaseArray, $log, $firebaseObject) {
  const self = this;
  const chapterID = null;

  function transformEventChaptersForFirebase(chapters) {
    var chaptersForFirebase = {};
    chapters.forEach(chapter => chaptersForFirebase[chapter.$id] = true);
    return chaptersForFirebase;
  }

  function transformEventDatesForFirebase(dates) {
    dates.start = dates.start.toISOString()
    dates.end = dates.end.toISOString()
    return dates;
  }

  function saveEvent(event) {
    if (!event.urlId) {
      event.urlId = getEventUrl(event); // TODO - Add UrlCreator (use from CF?)
    }
    event.dates = transformEventDatesForFirebase(event.dates);
    event.chapters = transformEventChaptersForFirebase(event.chapters);

    // TODO Not work for new event (use $state for context)
    return event.$save();
  };

  self.saveEvent = function (event) {
    $log.debug('You send this event:', event);
    event.published = false;
    return saveEvent(event);
  };

  self.saveAndPublishEvent = function (event) {
    event.published = true;
    $log.debug('You send this event:', event);
    return saveEvent(event);
  };

  self.loadEvent = function (eventId) {
    return $firebaseObject(firebaseDB.ref('events/' + eventId)).$loaded().then(event => {
      event.chapters = getArrayOfObjectsWithIdFromKeyValue(event.chapters);
      return getChapterNames(event.chapters).then(chapters => {
        event.chapters = chapters;
        return event;
      });

    });
  };

  // TODO Add name
  function getArrayOfObjectsWithIdFromKeyValue(keyValue) {
    return Object.keys(keyValue).map(function (key) {
      if (keyValue[key])
        return {
          $id: key
        };
    });
  }

  function getChapterNames(chapters) {
    var promises = [];
    chapters.forEach(chapter => {
      promises.push(firebaseDB.ref('chapters/' + chapter.$id + '/name').once('value'));
    });
    return Promise.all(promises).then(names => {
      return chapters.map(function (chapter, i) {
        chapter.name = names[i].val();
        return chapter;

      });
    });
  }

  self.getChapters = function () {
    return $firebaseArray(firebaseDB.ref('chapters'));
  };

  self.reportEvent = function (eventId, report) {
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
    return firebaseDB.ref('events/' + eventId).remove();
  };

  self.publishEvent = function (eventId) {
    return firebaseDB.ref('events/' + eventId + '/published').set(true);
  };

  self.hideEvent = function (eventId) {
    return firebaseDB.ref('events/' + eventId + '/published').set(false);
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
