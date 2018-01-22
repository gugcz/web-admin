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
    // TODO - Simplest solution to remove $id and $priority?
    return {
      name: venue.name || '',
      address: venue.address || '',
      mapUrl: venue.mapUrl || '',
      coordinates: venue.coordinates || '',
      city: venue.city || '',
      howTo: venue.howTo || ''
    };
  }

  function transformEventLinksForFirebase(links) {
    return links.filter(link => link.url.length > 0);
  }

  function transformEventDataForFirebase(event) {
    event.dates = transformEventDatesForFirebase(event.dates); // JS Date object to ISO string
    event.chapters = transformEventChaptersForFirebase(event.chapters); // set array of chapters data as key = true
    event.venue = transformEventVenueForFirebase(event.venue); // remove $id and $priority
    event.links = transformEventLinksForFirebase(event.links); // remove blank links
    return event;
  }

  function isUploadedNewCover(cover) {
    return cover && !isValidURL(cover);
  }

  function isValidURL(str) {
    return str.includes('http');
  }

  function saveCover(id, cover) {
    let picRef = firebaseSTORAGE.ref('covers/event/' + id + '.png');

    return picRef.putString(cover, 'base64')
  }

  // TODO Refactor!!!!!
  function saveEvent(event, editState) {



    if (editState) {

      if (isUploadedNewCover(event.cover)) {

        return saveCover(event.$id, event.cover).then(snapshot => {

          event.cover =  snapshot.downloadURL
          event = transformEventDataForFirebase(event);
          return event.$save();
        });
      }

      event = transformEventDataForFirebase(event);

      return event.$save();
    }
    else {

      if (isUploadedNewCover(event.cover)) {
        var cover = event.cover;
        event.cover = ''
        event = transformEventDataForFirebase(event);


        return $firebaseArray(firebaseDB.ref('events')).$add(event).then(function(ref) {
          var id = ref.key();

          return saveCover(id, cover).then(snapshot => {

            return firebaseDB.ref('events/' + id + '/cover').set(snapshot.downloadURL);
          });
        });
      }

      event = transformEventDataForFirebase(event);
      return $firebaseArray(firebaseDB.ref('events')).$add(event)
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
    return firebaseSTORAGE.ref('covers/events/' + eventId + '.png').delete().then(() => {return firebaseDB.ref('events/' + eventId).remove()}).catch(() => {return firebaseDB.ref('events/' + eventId).remove()})
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
