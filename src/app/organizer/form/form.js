function OrganizerFormCtrl(organizer) {
  const vm = this;

  vm.organizer = organizer;



}


angular.module('gugCZ.webAdmin.organizers.form', [
  'gugCZ.webAdmin.components.links'
])
  .controller('OrganizerFormController', OrganizerFormCtrl);





