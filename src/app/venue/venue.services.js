function firebaseFactory(firebaseDB, $q, $firebaseArray, $log, $firebaseObject) {
  const self = this;

  self.getChapterVenuesByID = function (chapterID) {
    const chapterVenues = [];
    $log.debug(loadVenueInfo('venue_id_1'));

    // TODO try, maybe repair
    return loadChapterVenues(chapterID).then(function (venuesKeys) {
      Object.keys(venuesKeys).forEach(function (venueID) {
        chapterVenues.push(loadVenueInfo(venueID));
      });
    });
  };

  function loadChapterVenues(chapterID) {
    return $firebaseArray(firebaseDB.ref('chapterVenues/' + chapterID)).$loaded();
  }

  function loadVenueInfo(id) {
    return $firebaseObject(firebaseDB.ref('venues/' + id));
  }
}


angular.module('gugCZ.webAdmin.venue.services', [
  'gugCZ.firebase'
])
  .service('firebaseVenues', firebaseFactory);
