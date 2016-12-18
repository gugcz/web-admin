(function() {
  'use strict';

  function VenueFormController() {

    this.venue = {
      name: "VŠPJ",
      address: "Tolstého 1556/16, 586 01 Jihlava"
    };
  }

  angular.module('gugCZ.webAdmin.venue.form', [
    'hc.marked',
    'gugCZ.webAdmin.events.form.orgs',
    'gugCZ.webAdmin.events.form.dates',
    'gugCZ.webAdmin.events.form.venue'
  ])
    .component("venueForm", {
      controller: VenueFormController,
      controllerAs: 'vm',
      bindings: {
        venue: '=',
        form: '='
      },
      templateUrl: 'app/venue/form/form.html'

    });

})();
