  function VenueFormController(venuesUtility, $document) {
    this.$onInit = function () {
      this.venueInput = $document[0].getElementById('venue-input');
      this.addressInput = $document[0].getElementById('address-input');
      this.cityInput = $document[0].getElementById('city-input');
      this.urlInput = $document[0].getElementById('url-input');
      this.howToInput = $document[0].getElementById('how-to-input');
      this.coords = {
        lat: {
          degrees: 0,
          minutes: 0.000,
          pole: 'N'
        },
        lng: {
          degrees: 0,
          minutes: 0.000,
          pole: 'E'
        }
      };
      this.updateCoords(this.venue.coords.lat, this.venue.coords.lng);

      const venueAutocomplete = new google.maps.places.Autocomplete(this.venueInput);
      const cityAutocomplete = new google.maps.places.Autocomplete(this.cityInput);
      const addressAutocomplete = new google.maps.places.Autocomplete(this.addressInput);

      venueAutocomplete.addListener('place_changed', () => {
        this.updateForm(venueAutocomplete.getPlace());
      });

      addressAutocomplete.addListener('place_changed', () => {
        this.updateMapUrl(addressAutocomplete.getPlace());
      });
    };

    this.updateForm = function (place) {
      this.venue.name = this.venueInput.value;
      this.venue.city = place.address_components.filter((address_component) => {
        return address_component.types.indexOf('political') !== -1 && address_component.types.indexOf('administrative_area_level_2') !== -1;
      })[0].long_name;
      this.cityInput.value = this.venue.city;
      this.venue.address = place.formatted_address;
      this.addressInput.value = this.venue.address;
      this.updateMapUrl(place);
      this.updateCoords(place.geometry.location.lat(), place.geometry.location.lng());
    };

    this.updateCoords = function(lat, lng) {
      if (lat && lng) {
        this.venue.coords.lat = lat;
        this.venue.coords.lng = lng;
        this.coords.lat = venuesUtility.convertCoordinatesFromDecimalFormatToMinutesAndSecondsFormat(lat);
        this.coords.lat.pole = this.coords.lat.degrees < 0 ? 'S' : 'N';
        this.coords.lng = venuesUtility.convertCoordinatesFromDecimalFormatToMinutesAndSecondsFormat(lng);
        this.coords.lng.pole = this.coords.lng.degrees < 0 ? 'W' : 'E';
      }
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
