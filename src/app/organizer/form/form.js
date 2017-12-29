function OrganizerFormCtrl(organizer, organizerService) {
  const vm = this;
  vm.organizer = organizer;
  vm.saveOrganizer = function () {
    organizerService.saveOrganizer(vm.organizer);
  };
}


angular.module('gugCZ.webAdmin.organizers.form', [
  'gugCZ.webAdmin.components.links'
])
  .controller('OrganizerFormController', OrganizerFormCtrl);





