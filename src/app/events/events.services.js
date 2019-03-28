function firebaseFactory(firebaseDB, firebaseSTORAGE, $q, $firebaseArray, $log, $firebaseObject, $http, authService, FIREBASE) {
  const self = this;

  self.saveEvent = function (event, editState) {
    event.published = false;

    if (editState) {
      return updateEvent(event);
    }
    else {
      return addEvent(event);
    }
  };

  self.saveAndPublishEvent = function (event, editState) {
    event.published = true;

    if (editState) {
      return updateEvent(event).then((ref) => getPublishCloudFunctionRequest('updatePublishedEvent', ref.key));
    }
    else {
      return addEvent(event).then((ref) => getPublishCloudFunctionRequest('publishEvent', ref.key));
    }

  };

  self.deleteEvent = eventId => getPublishCloudFunctionRequest('unpublishEvent', eventId)
      .then(() => firebaseSTORAGE.ref('covers/events/' + eventId + '.png').delete())
      .then(() => firebaseDB.ref('events/' + eventId).remove())
      .catch(() => firebaseDB.ref('events/' + eventId).remove());

  self.publishEvent = eventId => getEventPublishedRef(eventId)
      .set(true)
      .then(() => getPublishCloudFunctionRequest('publishEvent', eventId));

  self.hideEvent = eventId => getEventPublishedRef(eventId)
      .set(false)
      .then(() => getPublishCloudFunctionRequest('unpublishEvent', eventId));

  self.reportEvent = (eventId, report) => firebaseDB.ref('events/' + eventId + '/report').set(report);


  self.loadEvent = function (eventId) {
    return $firebaseObject(firebaseDB.ref('events/' + eventId)).$loaded().then(event => {
      event.chapters = getArrayOfObjectsWithIdFromKeyValue(event.chapters);
      return getChapterNames(event.chapters).then(chapters => {
        event.chapters = chapters;
        return event;
      });

    });
  };


  function transformEventChaptersForFirebase(chapters) {
    let chaptersForFirebase = {};
    chapters.forEach(chapter => chaptersForFirebase[chapter.$id] = true);
    return chaptersForFirebase;
  }

  function transformEventDatesForFirebase(dates) {
    dates.start = dates.start.toISOString();
    dates.end = dates.end.toISOString();
    return dates;
  }


  function transformEventVenueForFirebase(venue) {
    // TODO - Simplest solution to remove $id, $priority and undefined fields?
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
    return firebaseSTORAGE.ref('covers/event/' + id + '.png').putString(cover, 'base64');
  }

  // TODO Refactor!!!!!
  function addEvent(event) {

    event.created = (new Date()).toISOString();

    if (isUploadedNewCover(event.cover)) {
      let cover = event.cover;
      event.cover = '';
      event = transformEventDataForFirebase(event);


      return $firebaseArray(firebaseDB.ref('events')).$add(event).then(function (ref) {
        let id = ref.key;

        return saveCover(id, cover).then(snapshot => {

          return firebaseDB.ref('events/' + id + '/cover').set(snapshot.downloadURL || '').then(() => Promise.resolve({key: id}));
        });
      });
    }

    event = transformEventDataForFirebase(event);
    return $firebaseArray(firebaseDB.ref('events')).$add(event);

  };

  function updateEvent(event) {
    event.created = (new Date()).toISOString();

    if (isUploadedNewCover(event.cover)) {

      return saveCover(event.$id, event.cover).then(snapshot => {

        event.cover = snapshot.downloadURL || '';
        event = transformEventDataForFirebase(event);
        return event.$save();
      });
    }

    event = transformEventDataForFirebase(event);

    return event.$save();
  }




  function getPublishCloudFunctionRequest(functionName, eventId) {
    let token = authService.getOAuthToken();
    return $http({
      url: FIREBASE.cloudFunctionsURL + '/' + functionName + '?eventId=' + eventId,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token

      }
    }).catch(() => Promise.resolve()); // TODO - Remove cors errors
  }



  const getEventPublishedRef = eventId => firebaseDB.ref('events/' + eventId + '/published');



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
    var chapterEventsRef = firebaseDB.ref('events');

    if (chapterId !== 'admin') {
      chapterEventsRef = chapterEventsRef.orderByChild('chapters/' + chapterId).equalTo(true);
    }

    return $firebaseArray(chapterEventsRef);
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


angular.module('gugCZ.webAdmin.events.services', [
  'gugCZ.firebase',
])
    .service('firebaseEvents', firebaseFactory);
