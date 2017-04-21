(function() {
  'use strict';

  function VenueFormController() {

    this.cancel = function() {
      this.onCancel();
    };

    this.submit = function(form) {
      if (form.$invalid) {
        return;
      }

      this.onSave(this.selectedVenue);
    };

  }

  angular.module('gugCZ.webAdmin.venue.form', [
    'hc.marked',
    'gugCZ.webAdmin.events.form.orgs',
    'gugCZ.webAdmin.chapters.add.orgsChips',
    'gugCZ.webAdmin.events.form.dates',
    'gugCZ.webAdmin.events.form.venue'
  ])
    .component("venueForm", {
      controller: VenueFormController,
      controllerAs: 'vm',
      bindings: {
        venue: '=',
        onCancel: '&',
        onSave: '&'
      },
      templateUrl: 'app/venue/form/form.html'

    });

})();
