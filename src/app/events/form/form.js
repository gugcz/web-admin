function EventFormController(firebaseEvents, $state, $mdToast, $translate, event) {

  this.event = event;
  this.savingEvent = false;

  this.saveAndPublishEvent = function () {
    this.savingEvent = true;
    firebaseEvents.saveAndPublishEvent(this.event, $state.is('events.edit')).then(function () {
      this.savingEvent = false;
      showMessageAndGoToDashboard('EVENTS.TOASTS.EVENT_PUBLISHED');

    }.bind(this));
  };

  this.isOrganizersCorrect = function () {
    const event = this.event;
    return Object.keys(event.organizers).length >= 1 && Object.keys(event.chapters).length >= 1 && event.guarantee && event.organizers[event.guarantee];
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
