(function() {
  'use strict';

  function EventFormController(firebaseEvents, $state, firebaseDB, $firebaseObject, $mdToast, $translate) {

    var signedUser = getSignedUser();

    // TODO
    function getSelectedChapter() {
      return $firebaseObject(firebaseDB.ref('chapters/gdg_jihlava'));
    }

    // TODO
    function getSignedUser() {
      return $firebaseObject(firebaseDB.ref('orgs/T093T0DMW_U0CM45CP5'));
    }

    function getOrganizersWithSignedUser() {
      var organizers = {};
      organizers[signedUser.$id] = true;
      return organizers;
    }

    this.event = {
      name: '',
      subtitle: '',
      dates: {},
      description: '',
      venue: null,
      regFormLink: '',
      chapters: [getSelectedChapter()],
      guarantee: signedUser,
      organizers: getOrganizersWithSignedUser(),
      links: [
        {url: ''}
      ]

    };

    this.addEvent = function() {
      firebaseEvents.addEvent(this.event);  // TODO nebude to promise?
      $mdToast.show(
        $mdToast.simple() // TODO zapouzdřit?
          .textContent($translate.instant('EVENTS.FORM.EVENT_ADDED'))
          .position('bottom right')
          .hideDelay(3000)
      );

      $state.go('dashboard');
    };
  }


  angular.module('gugCZ.webAdmin.events.form', [
    'gugCZ.webAdmin.events.form.orgs',
    'gugCZ.webAdmin.events.form.dates',
    'gugCZ.webAdmin.events.form.links',
    'gugCZ.webAdmin.events.form.venue'
  ])
    .controller("EventFormController", EventFormController);

})();
