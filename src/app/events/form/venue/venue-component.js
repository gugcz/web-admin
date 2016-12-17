(function() {
  'use strict';

  var component = {
    templateUrl: 'app/events/form/venue/venue.html',
    controller: VenueController,
    controllerAs: 'vm'
  };

  function VenueController() {
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

    this.addVenue = function() {
      alert("TODO");
    };

  }

  angular.module('gugCZ.webAdmin.events.form.venue', [])
    .component('venueSelector', component);

})();
