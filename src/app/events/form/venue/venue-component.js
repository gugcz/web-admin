(function() {
  'use strict';

  var component = {
    templateUrl: 'app/events/form/venue/venue.html',
    controller: VenueController,
    controllerAs: 'vm'
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
    // TODO Order by activity
    // TODO Now guarantee not work, $id missing
    this.venues = [
      {
        name: "VŠPJ",
        address: "Tolstého 1556/16, 586 01 Jihlava" // TODO rozpat na pole?
      },
      {
        name: "VŠPJ 2",
        address: "Tolstého 1556/16, 586 01 Jihlava" // TODO rozpat na pole?
      },
      {
        name: "VŠPJ 3",
        address: "Tolstého 1556/16, 586 01 Jihlava" // TODO rozpat na pole?
      }];

    this.venue = null;

    this.createVenueModal_ = function(ev, venue) {
      return $mdDialog.show({
        controller: DialogController,
        controllerAs: 'vm',
        locals: {
          venue: angular.copy(venue)
        },
        templateUrl: 'app/events/form/venue/venue-dialog.html',
        parent: angular.element($document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    };

    this.editVenue = function(ev) {
      this.createVenueModal_(ev, this.venue)
        .then(function(answer) {
          console.log('fullfiled', answer);
        }, function() {
          console.log('rejected.');
        });
    };

    this.addVenue = function(ev) {
      this.createVenueModal_(ev, {})
        .then(function(answer) {
          console.log('fullfiled', answer);
        }, function() {
          console.log('rejected.');
        });
    };

  }

  angular.module('gugCZ.webAdmin.events.form.venue', [
    'gugCZ.webAdmin.venue.form'
  ])
    .component('venueSelector', component);

})();
