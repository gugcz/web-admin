const component = {
  templateUrl: 'app/events/form/venue/venue.html',
  controller: VenueController,
  controllerAs: 'vm',
  bindings: {
    venue: '='
  }
};


function DialogController($mdDialog, venue) {
  this.venue = venue;

  this.hide = function () {
    $mdDialog.hide();
  };

  this.cancel = function () {
    $mdDialog.cancel();
  };

  this.save = function () {
    $mdDialog.hide(this.venue);
  };
}

function VenueController($document, $mdDialog, firebaseVenues, organizerService, $log) {
  let chapter = organizerService.currentChapter_;
  this.venues = firebaseVenues.getChapterVenuesByID(chapter);


  this.selectedVenue = null;

  this.createVenueModal_ = function (ev, venue) {
    venue = angular.copy(venue);
    if (venue.$$mdSelectId) {  // TODO some better solution?
      delete venue.$$mdSelectId;
    }

    return $mdDialog.show({   // TODO how to set dialog width?
      controller: DialogController,
      controllerAs: 'vm',
      locals: {
        venue: venue
      },
      templateUrl: 'app/events/form/venue/venue-dialog.html',
      parent: angular.element($document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  };

  this.editVenue = function (ev) {
    const index = this.venues.indexOf(this.venue);
    this.createVenueModal_(ev, this.venue)
      .then(function (venue) {
        // TODO change firebase data?

        this.venues[index] = venue;
        this.venues.$save(index);
        this.venue = venue;
      }.bind(this));
  };

  this.addVenue = function (ev) {
    this.createVenueModal_(ev, {})
      .then(function (venue) {
        // TODO change firebase data?

        this.venues.$add(venue);
        this.venues.$loaded(() => {
          this.venue = this.venues[this.venues.length - 1];
        });

      }.bind(this));
  };

}

angular.module('gugCZ.webAdmin.events.form.venue', [
  'gugCZ.webAdmin.venue.form',
  'gugCZ.webAdmin.venue.services'
])
  .component('venueSelector', component);
