function firebaseFactory(firebaseDB, firebaseSTORAGE, $q, $firebaseArray, $log, $firebaseObject, $http) {
  const self = this;
  const chapterID = null;

  function transformEventChaptersForFirebase(chapters) {
    var chaptersForFirebase = {};
    chapters.forEach(chapter => chaptersForFirebase[chapter.$id] = true);
    return chaptersForFirebase;
  }

  function transformEventDatesForFirebase(dates) {
    dates.start = dates.start.toISOString();
    dates.end = dates.end.toISOString();
    return dates;
  }

  function getEventUrl(event) {
    return event.name.replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');
  }

  function transformEventVenueForFirebase(venue) {
    // TODO - Simplest solution?
    return {
      name: venue.name || '',
      address: venue.address || '',
      mapUrl: venue.mapUrl || '',
      howTo: venue.howTo || ''
    };
  }

  function transformEventLinksForFirebase(links) {
    return links.filter(link => link.url.length > 0);
  }

  function transformEventDataForFirebase(event) {
    event.dates = transformEventDatesForFirebase(event.dates);
    event.chapters = transformEventChaptersForFirebase(event.chapters);
    event.venue = transformEventVenueForFirebase(event.venue);
    event.links = transformEventLinksForFirebase(event.links);
    return event;
  }

  function saveEventCoverAndGetUrl(event) {
    let coverRef = firebaseSTORAGE.ref('covers/event/' + event.$id + '.png');
    return coverRef.putString(event.cover.src.substring(event.cover.src.indexOf(',') + 1), 'base64').then(snapshot => {return coverRef.getDownloadURL();});
  }

  function saveEvent(event, editState, coverImage) {



    if (editState) {

      if (event.cover) {
        return saveEventCoverAndGetUrl(event).then(url => {
          event = transformEventDataForFirebase(event);
          event.cover = url;
          return event.$save();
        });
      }

      event = transformEventDataForFirebase(event);

      return event.$save();
    }
    else {
      // TODO

      event = transformEventDataForFirebase(event);


      return firebaseDB.ref('events/' + event.urlId).set(event);
    }

  };



  self.saveEvent = function (event, editState) {
    $log.debug('You send this event:', event);
    event.published = false;
    return saveEvent(event, editState);
  };

  self.saveAndPublishEvent = function (event, editState) {
    event.published = true;
    $log.debug('You send this event:', event);
    return saveEvent(event, editState);
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
