angular.module('gugCZ.webAdmin.organizers', [
  'ui.router',
  'gugCZ.webAdmin.organizers.form'
])
  .config(function ($stateProvider) {

    $stateProvider.state('organizer', {
      url: 'organizer/form',
      parent: 'base',
      templateUrl: 'app/organizer/form/form.html',
      controller: 'OrganizerFormController',
      controllerAs: 'vm',
      data: {
        title: 'Profil'  // TODO Add translation
      }
    });

  });


