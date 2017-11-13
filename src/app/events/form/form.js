function EventFormController(firebaseEvents, $state, $mdToast, $translate, event) {

  this.event = event;

  this.saveAndPublishEvent = function () {
    firebaseEvents.saveAndPublishEvent(this.event, $state.is('events.edit')).then(function () {
      showMessageAndGoToDashboard('EVENTS.TOASTS.EVENT_PUBLISHED');
    });
  };

  this.saveEvent = function () {
    firebaseEvents.saveEvent(this.event, $state.is('events.edit')).then(function () {
      showMessageAndGoToDashboard('EVENTS.TOASTS.EVENT_SAVED');
    });
  };

  function showMessageAndGoToDashboard(messageId) {
    $mdToast.show(
          $mdToast.simple() // TODO zapouzdřit?
              .textContent($translate.instant(messageId))
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
