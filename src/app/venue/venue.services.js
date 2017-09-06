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

  this.updateChapterVenueByID = function (chapterID, venueID, venue) {
    const venueToSend = {
      name: venue.name,
      address: venue.address
    };
    if (venue.mapUrl) {
      venueToSend.mapUrl = venue.mapUrl;
    }
    if (venue.howTo) {
      venueToSend.howTo = venue.howTo;
    }
    firebaseDB.ref('chapterVenues/' + chapterID + '/').child(venueID).update(venueToSend);
  };
}
