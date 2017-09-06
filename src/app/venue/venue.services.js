angular.module('gugCZ.webAdmin.venue.services', [
  'gugCZ.firebase'
])
  .service('firebaseVenues', firebaseVenues);

function firebaseVenues(firebaseDB, $firebaseArray) {
  this.addChapterVenueByID = function (chapterID, venueID, venue) {
    firebaseDB.ref('chapterVenues/' + chapterID + '/').child(venueID).set(venue);
  };

  this.getChapterVenuesByID = function (chapterID) {
    return $firebaseArray(firebaseDB.ref('chapterVenues/' + chapterID + '/'));
  };

  this.removeChapterVenueByID = function (chapterID, venueID) {
    firebaseDB.ref('chapterVenues/' + chapterID + '/').child(venueID).remove();
  };
}
