angular.module('gugCZ.webAdmin.organizers', [
  'ui.router',
  'gugCZ.webAdmin.organizers.form'
])
  .config(function ($stateProvider) {

    $stateProvider.state('organizers', {
      url: 'organizers',
      parent: 'base',
      templateUrl: 'app/organizer/organizers.html',
      controller: function ($state, $mdDialog, $translate, organizerService) {
        this.organizers = organizerService.getAllOrganizers();

        this.getGravatarURL = function (email) {
          return gravatar(email);
        }
      },
      controllerAs: 'vm',
      data: {
        title: 'Profil'  // TODO Add translation
      }
    });

  });


