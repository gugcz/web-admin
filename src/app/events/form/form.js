function EventFormController(firebaseEvents, $state, $mdToast, $translate, event) {

  this.event = event;

  this.addEvent = function () {
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
  'gugCZ.webAdmin.components.links',
  'gugCZ.webAdmin.events.form.venue'
])
  .controller('EventFormController', EventFormController);
