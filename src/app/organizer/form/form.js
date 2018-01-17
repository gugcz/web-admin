function OrganizerFormCtrl(organizer, organizerService, $state) {
  const vm = this;
  vm.organizer = organizer;
  vm.saveOrganizer = function () {
    organizerService.saveOrganizer(vm.organizer);
    $state.reload()
  };
}


angular.module('gugCZ.webAdmin.organizers.form', [
  'gugCZ.webAdmin.components.links',
  'gugCZ.webAdmin.components.picture'
])
  .controller('OrganizerFormController', OrganizerFormCtrl);





