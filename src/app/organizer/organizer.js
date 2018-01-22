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
            title: 'Správa organizátorů'  // TODO Add translation
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
            title: 'Profil'  // TODO Add translation
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
            title: 'Editovat organizátora'  // TODO Add translation
          }
        });

  });

function OrganizerController($state, $mdDialog, $translate, organizerService, $document, currentUser) {
  this.organizers = organizerService.getAllOrganizers();

  this.editOrganizer = function (org) {
    $state.go('organizers.edit', {id: org.$id});

  };
}