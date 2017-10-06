function EventFormController(firebaseEvents, $state, $mdToast, $translate, event) {

  this.event = event;

  this.saveAndPublishEvent = function () {
    firebaseEvents.saveAndPublishEvent(this.event).then(function () {
      showMessageAndGoToDashboard();
    });



  };

  function showMessageAndGoToDashboard() {
    $mdToast.show(
          $mdToast.simple() // TODO zapouzdřit?
              .textContent($translate.instant('EVENTS.TOASTS.EVENT_ADDED'))
              .position('bottom right')
              .hideDelay(3000)
      );

    $state.go('dashboard');
  }
}


angular.module('gugCZ.webAdmin.events.form', [
  'gugCZ.webAdmin.events.form.orgs',
  'gugCZ.webAdmin.events.form.dates',
  'gugCZ.webAdmin.components.links',
  'gugCZ.webAdmin.events.form.venue'
])
    .controller('EventFormController', EventFormController);
