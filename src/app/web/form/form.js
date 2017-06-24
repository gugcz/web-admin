function WebFormCtrl(firebaseData, $log) {
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


angular.module('gugCZ.webAdmin.web.form', [
  'gugCZ.webAdmin.events.form.links'
])
  .controller('WebFormController', WebFormCtrl);





