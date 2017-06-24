function WebFormCtrl(firebaseData, $log) {
  const vm = this;


  vm.web = {
    title: 'Google User Group',
    subtitle: 'Komunita pořádající akce nejen o Google technologiích',
    aboutTitle: 'Co je to GUG?',
    aboutContent: 'Lorem Ipsum',
    email: 'info@gug.cz',
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





