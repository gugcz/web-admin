angular.module('gugCZ.webAdmin.venues', [
  'ui.router', 'gugCZ.webAdmin.messages'
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
        title: 'TITLES.VENUES_MANAGEMENT'
      }
    });
  });

function VenuesController($window, $mdDialog, firebaseVenues, $document, organizerService, messagesService) {
  const $ctrl = this;

  const chapter = organizerService.currentChapter_;
  this.$onInit = function () {
    this.venues = firebaseVenues.getChapterVenuesByID(chapter);
  };

  this.viewOnMap = function (venue) {
    $window.open(venue.mapUrl, '_blank');
  };

  this.deleteVenue = function (venue) {
    //TODO Add translation
    const dialog = $mdDialog.confirm()
      .title('Opravdu chcete smazat venue s názvem ' + venue.name + '?')
      .textContent('Smazání venue nelze vrátit zpět.')
      .ok('Ano')
      .cancel('Ne');
    $mdDialog.show(dialog).then(function() {
      const index = $ctrl.venues.indexOf(venue);
      $ctrl.venues.$remove(index);
      messagesService.showPositiveMessage();
    })
    .catch(function () {
      messagesService.showNegativeMessage();
    });
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
        $ctrl.venues.$add(newVenue);
      } else {
        const indexOfEdittedVenue = $ctrl.venues.indexOf(newVenue);
        $ctrl.venues[indexOfEdittedVenue] = newVenue;
        $ctrl.venues.$save(indexOfEdittedVenue);
      }
      messagesService.showPositiveMessage();
    }, function () {
      $ctrl.venues[index] = oldVenue;
      $ctrl.venues.$save(index);
    })
    .catch(function () {
      if(index !== -1) {
        $ctrl.venues[index] = oldVenue;
        $ctrl.venues.$save(index);
      }
      messagesService.showNegativeMessage();
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
