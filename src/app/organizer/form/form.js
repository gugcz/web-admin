function OrganizerFormCtrl(firebaseData, $log) {
  const vm = this;


  vm.organizer = {
    name: 'Matěj Horák',
    about: '',
    profilePicture: '',
    email: '',
    phoneNumber: '',
    links: [
      {url: ''}
    ]
  };


}


angular.module('gugCZ.webAdmin.organizers.form', [
  'gugCZ.webAdmin.events.form.links'
])
  .controller('OrganizerFormController', OrganizerFormCtrl);





