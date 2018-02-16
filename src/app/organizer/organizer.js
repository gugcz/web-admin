angular.module('gugCZ.webAdmin.organizers', [
  'ui.router',
  'gugCZ.webAdmin.organizers.form'
])
  .config(function ($stateProvider) {

    $stateProvider
        .state('organizers', {
          url: 'organizers',
          parent: 'base',
          templateUrl: 'app/organizer/organizers.html',
          controller: OrganizerController,
          controllerAs: 'vm',
          resolve: {
            currentUser: function (organizerService) {
              return organizerService.getCurrentUser();
            }
          },
          data: {
            title: 'TITLES.ORGANIZERS_MANAGEMENT'
          }
        })
        .state('organizers.me', {
          url: 'organizers/edit/me',
          parent: 'base',
          templateUrl: 'app/organizer/form/form.html',
          controller: 'OrganizerFormController',
          controllerAs: 'vm',
          resolve: {
            organizer: function (organizerService) {
              return organizerService.getCurrentUser().then(value => {
                return organizerService.loadOrganizer(value.$id);
              });
            }
          },
          data: {
            title: 'TITLES.PROFILE'
          }
        })
        .state('organizers.edit', {
          url: 'organizers/edit/:id',
          parent: 'base',
          templateUrl: 'app/organizer/form/form.html',
          controller: 'OrganizerFormController',
          controllerAs: 'vm',
          resolve: {
            organizer: function (organizerService, $stateParams) {
              return organizerService.loadOrganizer($stateParams.id);
            }
          },
          data: {
            title: 'TITLES.EDIT_ORGANIZER'
          }
        });

  });

function OrganizerController($state, $mdDialog, $translate, organizerService, $document, currentUser) {
  this.allOrganizers = organizerService.getAllOrganizers();
  this.allOrganizers.$loaded((data) => {
    this.allOrganizers = data;
    this.organizers = data.sort(compare);
  });

  this.inputChanged = function() {
    this.organizers = this.allOrganizers.filter(organizer => organizer.name.toLowerCase().includes(this.searchedName.toLowerCase()));
    this.organizers.sort(compare);
  };

  this.editOrganizer = function (org) {
    $state.go('organizers.edit', {id: org.$id});
  };

  function compare(a, b) {
    return a.name < b.name ? -1 : 1;
  }
}