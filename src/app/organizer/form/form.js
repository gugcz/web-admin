function OrganizerFormCtrl(organizer, organizerService, $state, $translate,  $mdToast) {
  const vm = this;
  vm.organizer = organizer;
  vm.savingOrganizer = false;
  vm.saveOrganizer = function () {
    vm.savingOrganizer = true;
    organizerService.saveOrganizer(vm.organizer).then(() => {
      vm.savingOrganizer = false;
      $mdToast.show(
          $mdToast.simple() // TODO zapouzdřit?
              .textContent($translate.instant('ORGANIZERS.FORM.ORGANIZER_SAVED'))
              .position('bottom right')
              .hideDelay(3000)
      );
    });

  };
}


angular.module('gugCZ.webAdmin.organizers.form', [
  'gugCZ.webAdmin.components.links',
  'gugCZ.webAdmin.components.picture'
])
  .controller('OrganizerFormController', OrganizerFormCtrl);





