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

function VenuesController($window, $mdDialog, firebaseVenues, $document) {
  const $ctrl = this;

  this.$onInit = function () {
    firebaseVenues.getChapterVenuesByID('gdg-brno').$loaded().then(data => {
      this.venues = data.map(venue => venue);
    });
  };

  this.viewOnMap = function (venue) {
    $window.open(venue.mapUrl, '_blank');
  };

  this.deleteVenue = function (venue) {
    const dialog = $mdDialog.confirm()
      .title('Opravdu chcete smazat venue s názvem ' + venue.name + '?')
      .textContent('Smazání venue nelze vrátit zpět.')
      .ok('Ano')
      .cancel('Ne');
    $mdDialog.show(dialog).then(function() {
      firebaseVenues.removeChapterVenueByID('gdg-brno', $ctrl.venues.indexOf(venue));
      $ctrl.venues.splice($ctrl.venues.indexOf(venue), 1);
    }, function() {});
  };

  this.showVenueDialog = function (venue) {
    const oldVenue = angular.copy(venue);
    const index = this.venues.indexOf(venue);
    $mdDialog.show({   // TODO how to set dialog width?
      controller: DialogController,
      controllerAs: 'vm',
      locals: {
        venue: venue
      },
      templateUrl: 'app/events/form/venue/venue-dialog.html',
      parent: angular.element($document.body),
      clickOutsideToClose: true
    })
    .then(function(newVenue) {
      if ($ctrl.venues.indexOf(newVenue) === -1) {
        firebaseVenues.addChapterVenueByID('gdg-brno', $ctrl.venues.length, newVenue);
        $ctrl.venues.push(newVenue);
      } else {
        firebaseVenues.updateChapterVenueByID('gdg-brno', $ctrl.venues.indexOf(newVenue), newVenue);
      }
    }, function () {
      $ctrl.venues[index] = oldVenue;
    });
  };
}

function DialogController($mdDialog, venue) {
  this.venue = venue;

  this.hide = function () {
    $mdDialog.hide();
  };

  this.cancel = function () {
    $mdDialog.cancel();
  };

  this.save = function () {
    $mdDialog.hide(this.venue);
  };
}
