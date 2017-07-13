angular.module('gugCZ.webAdmin.organizers', [
  'ui.router',
  'gugCZ.webAdmin.organizers.form'
])
  .config(function ($stateProvider) {

    $stateProvider.state('organizers', {
      url: 'organizers',
      parent: 'base',
      templateUrl: 'app/organizer/organizers.html',
      controller: function ($state, $mdDialog, $translate, organizerService, $document, currentUser) {
        this.organizers = organizerService.getAllOrganizers();

        this.getGravatarURL = function (email) {
          return gravatar(email);
        };

        this.showOrgDialog = function (org) {
          $mdDialog.show({   // TODO how to set dialog width?
            controller: DialogController,
            controllerAs: 'vm',
            locals: {
              org: org,
              currentUser: currentUser
            },
            templateUrl: 'app/organizer/dialog.html',
            parent: angular.element($document.body),
            targetEvent: null,
            clickOutsideToClose: true
          });
        };
      },
      controllerAs: 'vm',
      resolve: {
        currentUser: function (organizerService) {
          return organizerService.getCurrentUser();
        }
      },
      data: {
        title: 'Profil'  // TODO Add translation
      }
    });

    function DialogController($mdDialog, org, currentUser, $q) {
      this.org = org;

      this.hide = function () {
        $mdDialog.hide();
      };

      this.cancel = function () {
        $mdDialog.cancel();
      };

      this.save = function () {
        $mdDialog.hide(this.org);
      };

      this.isMeOrAdmin = function () {
        return this.org.$id === currentUser.$id || currentUser.roles.admin;
      };
    }
  });


