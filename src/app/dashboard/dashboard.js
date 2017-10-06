angular.module('gugCZ.webAdmin.dashboard', [
  'ui.router',
  'gugCZ.webAdmin.report.form'
])
  .config(function ($stateProvider) {

    $stateProvider.state('dashboard', {
      parent: 'base',
      url: 'dashboard',
      controller: function ($state, $mdDialog, $translate, $document, firebaseEvents, organizerService, $mdToast) {
        this.isFabOpen = false;

        // TODO Load from firebase
        this.chapterEvents = firebaseEvents.getChapterEvents(organizerService.getCurrentChapter());

        this.draftFilter = function(item) {
          return item.published !== true;
        };

        this.futureFilter = function(item) {
          return item.published === true && new Date(item.dates.start) >= new Date();
        };

        this.unreportedFilter = function(item) {
          return new Date(item.dates.end) <= new Date() && angular.isUndefined(item.report);
        };

        this.dateOrder = function (item) {
          return new Date(item.dates.start);
        };

        this.editEvent = function (event) {
          $state.go('events.edit', {id: event.$id});
        };

        this.deleteEvent = function (eventId) {
          const confirm = $mdDialog.confirm()
            .title($translate.instant('DIALOG.ARE_YOU_SURE'))
            .textContent($translate.instant('DIALOG.DELETE_EVENT_WARN'))
            .ariaLabel('Are you sure?')
            .ok($translate.instant('DIALOG.YES'))
            .cancel($translate.instant('DIALOG.NO'));


          $mdDialog.show(confirm).then(function () {
            firebaseEvents.deleteEvent(eventId).then(showToast('EVENTS.TOASTS.EVENT_DELETED'));
          }, function () {
            // Do nothing
          });

        };



        // TODO
        this.publishEvent = function (eventId) {
          firebaseEvents.publishEvent(eventId).then(showToast('EVENTS.TOASTS.EVENT_PUBLISHED'));
        };

        // TODO
        this.hideEvent = function (eventId) {
          firebaseEvents.hideEvent(eventId).then(showToast('EVENTS.TOASTS.EVENT_HIDED'));
        };

        // TODO
        this.reportEvent = function (ev, eventId) {
          this.createReportModal_(ev, {})
            .then(function (report) {
              firebaseEvents.reportEvent(eventId, report).then(showToast('EVENTS.TOASTS.EVENT_REPORTED'));
            }.bind(this));
        };

        function showToast(messageId) {
          $mdToast.show(
            $mdToast.simple() // TODO zapouzdřit?
              .textContent($translate.instant(messageId))
              .position('bottom right')
              .hideDelay(3000)
          );
        }
        this.createReportModal_ = function (ev, report) {
          report = angular.copy(report);


          return $mdDialog.show({   // TODO how to set dialog width?
            controller: DialogController,
            controllerAs: 'vm',
            locals: {
              report: report
            },
            targetEvent: ev,
            templateUrl: 'app/dashboard/report/report-dialog.html',
            parent: angular.element($document.body),
            clickOutsideToClose: true
          });
        };

      },
      controllerAs: 'vm',
      templateUrl: 'app/dashboard/dashboard.html'
    });
  });

function DialogController($mdDialog) {

  this.hide = function () {

    $mdDialog.hide();
  };

  this.cancel = function () {

    $mdDialog.cancel();
  };

  this.save = function () {
    $mdDialog.hide(this.report);
  };
}
