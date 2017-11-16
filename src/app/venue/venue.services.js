angular.module('gugCZ.webAdmin.venue.services', [
  'gugCZ.firebase'
])
  .service('firebaseVenues', firebaseVenues);

function firebaseVenues(firebaseDB, $firebaseArray) {

  this.getChapterVenuesByID = function (chapterID) {
    return $firebaseArray(firebaseDB.ref('chapterVenues/' + chapterID + '/'));
  };

}
