function OrganizerFormCtrl(firebaseData, $log) {
  const vm = this;


  vm.organizer = {
    section: '',
    name: 'Brno',
    description: '',
    profilePicture: '',
    email: '',
    coordinates: '',
    links: [
      {url: ''}
    ]
  };


}


angular.module('gugCZ.webAdmin.organizers.form', [
  'gugCZ.webAdmin.events.form.links'
])
  .controller('OrganizerFormController', OrganizerFormCtrl);





