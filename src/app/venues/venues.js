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

function VenuesController($window, $mdDialog, $log, $document) {
  const $ctrl = this;

  this.venues = [
    {
      id: 1,
      address: 'Botanická 68A, 602 00 Brno-Královo Pole',
      name: 'MU Fakulta informatiky',
      mapLink: 'https://www.google.cz/maps/place/Fakulta+informatiky+MU/@49.2100082,16.5966133,17z/data=!4m12!1m6!3m5!1s0x4712946af848abab:0xcbdad60137e0b956!2sFakulta+informatiky+MU!8m2!3d49.2100047!4d16.598802!3m4!1s0x4712946af848abab:0xcbdad60137e0b956!8m2!3d49.2100047!4d16.598802?hl=cs',
      note: 'Rovnou za nosem.'
    },
    {
      id: 2,
      address: 'U Klafárku 3, 591 01 Žďár nad Sázavou',
      name: 'Bigy Ždár nad Sázavou',
      mapLink: 'https://www.google.cz/maps/place/Biskupsk%C3%A9+gymn%C3%A1zium/@49.5675982,15.9309421,17z/data=!3m1!4b1!4m5!3m4!1s0x470d0aaf0589cedb:0x9f237b4e5ebcb7bd!8m2!3d49.5675947!4d15.9331308?hl=cs'
    },
    {
      id: 3,
      address: 'Tolstého 1556/16, 586 01 Jihlava',
      name: 'VŠPJ Jihlava',
      note: 'Rovnou za nosem.'
    },
    {
      id: 4,
      address: 'nám. Čs. legií 565, 530 02 Pardubice I',
      name: 'Univerzita Pardubice - Fakulta elektrotechniky a informatiky',
      mapLink: 'https://www.google.cz/maps/place/Univerzita+Pardubice+-+Fakulta+elektrotechniky+a+informatiky/@50.0334344,15.7651933,17z/data=!3m1!4b1!4m5!3m4!1s0x470dccc33b38a121:0x3b1590db8ad8b477!8m2!3d50.033431!4d15.767382?hl=cs'
    }
  ];

  this.viewOnMap = function (venue) {
    $window.open(venue.mapLink, '_blank');
  };

  this.deleteVenue = function (venue) {
    const dialog = $mdDialog.confirm()
      .title('Opravdu chcete smazat venue s názvem ' + venue.name + '?')
      .textContent('Smazání venue nelze vrátit zpět.')
      .ok('Ano')
      .cancel('Ne');
    $mdDialog.show(dialog).then(function() {
      $ctrl.venues.splice($ctrl.venues.indexOf(venue), 1);
    }, function() {});
  };

  this.showVenueDialog = function (venue) {
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
      if (newVenue.id) {
        $ctrl.venues.forEach((venue) => {
          if (newVenue.id === venue.id) {
            newVenue = venue;
          }
        });
      } else {
        $ctrl.venues.push(newVenue);
      }
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
