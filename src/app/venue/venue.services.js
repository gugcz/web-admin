angular.module('gugCZ.webAdmin.venue.services', [
  'gugCZ.firebase'
])
  .service('firebaseVenues', firebaseVenues)
  .service('venuesUtility', venuesUtility);

function firebaseVenues(firebaseDB, $firebaseArray) {

  this.getChapterVenuesByID = function (chapterID) {
    return $firebaseArray(firebaseDB.ref('chapterVenues/' + chapterID + '/'));
  };

}

function venuesUtility() {
  this.convertCoordinatesFromDecimalFormatToMinutesAndSecondsFormat = function (coordinates) {
    return {
      degrees: Math.round(coordinates - 0.5),
      minutes: parseFloat((60 * (coordinates - Math.round(coordinates - 0.5))).toFixed(3))
    };
  };
}