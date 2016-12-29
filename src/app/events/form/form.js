(function() {
  'use strict';

  function EventFormController(firebaseEvents, $location, $log, firebaseDB, $firebaseObject, $mdToast, $translate) {

    var signedUser = getSignedUser();

    // TODO
    var getNextMonthDate = function() {
      return new Date();
    };

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
      name: 'GDG Coding Dojo Brno',
      subtitle: 'Intenzivní trénink programátora',
      startDate: getNextMonthDate(),
      description: 'Tady bude popis',
      regFormLink: 'forms.google.com',
      chapters: [getSelectedChapter()],
      guarantee: signedUser,
      organizers: getOrganizersWithSignedUser(),
      links: [
        {url: 'www.facebook.com/outer'}
      ]

    };

    this.addEvent = function() {
      firebaseEvents.addEvent(this.event);
      $location.path('/dashboard');
      $mdToast.show(
        $mdToast.simple()
          .textContent($translate.instant('EVENTS.FORM.EVENT_ADDED'))
          .position('top right')
          .hideDelay(3000)
      );
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
