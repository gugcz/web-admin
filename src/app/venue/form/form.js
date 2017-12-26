  function VenueFormController() {
    this.$onInit = function () {
      this.venueInput = document.getElementById('venue-input');
      this.addressInput = document.getElementById('address-input');
      this.cityInput = document.getElementById('city-input');
      this.urlInput = document.getElementById('url-input');
      this.howToInput = document.getElementById('how-to-input');

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
      this.venue.city = place.address_components.filter((address_component) => {
        return address_component.types.indexOf("political") !== -1 && address_component.types.indexOf("administrative_area_level_2") !== -1;
      })[0].long_name;
      this.cityInput.value = this.venue.city;
      this.venue.address = place.formatted_address;
      this.addressInput.value = this.venue.address;
      this.updateMapUrl(place);
    };

    this.updateMapUrl = function (place) {
      console.log(place);
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
