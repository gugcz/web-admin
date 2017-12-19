  function VenueFormController($scope, $log) {
    this.$onInit = function () {
      this.cityOptions = {
        types: '(cities)',
      };
      this.addressOptions = {
        types: 'address',
      };
    };

    this.nameChanged = function () {
      console.log($scope);              //vypise objekt s vlastnosti nameDetails
      console.log($scope.nameDetails);  //Vypise hodnotu, kterou pri minule zmene vypsal predchozi log. Na zacatku to je undefined, kdyz tam zadas treba Praha, tak vypise undefined, kdyz ale napise Brno, tak dostanes Praha.
    };

    this.cancel = function() {
      this.onCancel();
    };

    this.submit = function(form) {
      console.log($scope.nameDetails);  //vypise hodnotu objektu nameDetails
      if (form.$invalid) {
        return;
      }

      this.onSave(this.selectedVenue);
    };

  }

  angular.module('gugCZ.webAdmin.venue.form', [
    'hc.marked',
    'ngMapAutocomplete',
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

    })
    .directive('mapsInputChange', function() {
      return {
        restrict: 'A',
        link: function ($scope, element) {
          element.bind('change', () => {
            $scope.$emit('GOOGLE_MAPS_AUTOCOMPLETE', {details: element.details, value: element.value});
          });
        }
      };
    });
