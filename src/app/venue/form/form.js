  function VenueFormController(venuesUtility, $document) {
    this.$onInit = function () {
      this.venueInput = $document[0].getElementById('venue-input');
      this.addressInput = $document[0].getElementById('address-input');
      this.urlInput = $document[0].getElementById('url-input');
      this.howToInput = $document[0].getElementById('how-to-input');



      const venueAutocomplete = new google.maps.places.Autocomplete(this.venueInput);

      venueAutocomplete.addListener('place_changed', () => {
        this.updateForm(venueAutocomplete.getPlace());
      });


    };

    this.updateForm = function (place) {
      this.venue.name = place.name;
      this.venue.address = place.formatted_address;
      this.addressInput.value = this.venue.address;
      this.venue.coordinates = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      this.updateMapUrl(place);
    };

    this.updateMapUrl = function (place) {
      if (place) {
        this.venue.mapUrl = place.url;
        this.urlInput.value = place.url;
        this.howToInput.focus();
      }
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
