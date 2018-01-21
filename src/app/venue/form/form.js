  function VenueFormController(venuesUtility, $document) {
    this.$onInit = function () {
      this.venueInput = $document[0].getElementById('venue-input');
      this.howToInput = $document[0].getElementById('how-to-input');



      const venueAutocomplete = new google.maps.places.Autocomplete(this.venueInput);

      venueAutocomplete.addListener('place_changed', () => {
        this.updateForm(venueAutocomplete.getPlace());
      });


    };

    this.updateForm = function (place) {
      this.venue.name = place.name;
      this.venue.address = place.formatted_address;
      this.venue.coordinates = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      this.venue.city = place.address_components.filter((address_component) => {
        return address_component.types.indexOf('political') !== -1 && address_component.types.indexOf('administrative_area_level_2') !== -1;
      })[0].long_name;
      this.venue.mapUrl = place.url;
      this.howToInput.focus(); // Need to change input values above
    };


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
    'gugCZ.webAdmin.events.form.orgs',
    'gugCZ.webAdmin.events.form.dates',
    'gugCZ.webAdmin.events.form.venue'
  ])
    .component('venueForm', {
      controller: VenueFormController,
      controllerAs: 'vm',
      bindings: {
        venue: '=',
        onCancel: '&',
        onSave: '&'
      },
      templateUrl: 'app/venue/form/form.html'

    });
