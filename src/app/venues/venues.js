angular.module('gugCZ.webAdmin.venues', [
  'ui.router',
])
  .config(function ($stateProvider) {

    $stateProvider.state('venues', {
      url: 'venues',
      parent: 'base',
      templateUrl: 'app/venues/venues.html',
      controller: VenuesController,
      controllerAs: 'vm',
      resolve: {
        currentUser: function (organizerService) {
          return organizerService.getCurrentUser();
        }
      },
      data: {
        title: 'Správa venues'  // TODO Add translation
      }
    });
  });

function VenuesController() {
  this.viewOnMap = function (venue) {
    alert('Venue with name: ' + venue.name + ' will be displayed on map');
  };

  this.editVenue = function (venue) {
    alert('Edit venue dialog will be displayed');
  };

  this.deleteVenue = function (venue) {
    alert('Delete venue dialog will be displayed');
  };

  this.showVenueDialog = function (venue) {
    alert('Detailed venue dialog will be displayed');
  };

  this.venues = [
    {
      name: 'MU Fakulta informatiky'
    },
    {
      name: 'ModernTV'
    },
    {
      name: 'VŠPJ Jihlava'
    },
    {
      name: 'Univerzita Pardubice - Fakulta elektrotechniky a informatiky'
    }
  ];
}
