(function() {
  'use strict';

  var component = {
    templateUrl: 'app/events/form/venue/venue.html',
    controller: VenueController,
    controllerAs: 'vm',
    bindings: {
      venue: '='
    }
  };


  function DialogController($mdDialog, venue) {
    this.venue = venue;

    this.hide = function() {
      $mdDialog.hide();
    };

    this.cancel = function() {
      $mdDialog.cancel();
    };

    this.save = function() {
      $mdDialog.hide(this.venue);
    };
  }

  function VenueController($document, $mdDialog) {
    // TODO load from Firebase
    this.venues = [
      {
        name: "VŠPJ",
        address: "Tolstého 1556/16, 586 01 Jihlava"
      },
      {
        name: "VŠPJ 2",
        address: "Tolstého 1556/16, 586 01 Jihlava"
      },
      {
        name: "VŠPJ 3",
        address: "Tolstého 1556/16, 586 01 Jihlava"
      }];

    this.selectedVenue = null;

    this.createVenueModal_ = function(ev, venue) {
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

    this.editVenue = function(ev) {
      var index = this.venues.indexOf(this.selectedVenue);
      this.createVenueModal_(ev, this.selectedVenue)
        .then(function(venue) {
          // TODO change firebase data?

          this.venues[index] = venue;
          this.selectedVenue = venue;
        }.bind(this));
    };

    this.addVenue = function(ev) {
      this.createVenueModal_(ev, {})
        .then(function(venue) {
          // TODO change firebase data?

          this.venues.push(venue);
          this.selectedVenue = venue;
        }.bind(this));
    };

  }

  angular.module('gugCZ.webAdmin.events.form.venue', [
    'gugCZ.webAdmin.venue.form'
  ])
    .component('venueSelector', component);

})();
