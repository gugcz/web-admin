angular.module('gugCZ.webAdmin.dashboard', [
  'ui.router',
  'gugCZ.webAdmin.report.form'
])
  .config(function ($stateProvider) {

    $stateProvider.state('dashboard', {
      parent: 'base',
      url: 'dashboard',
      controller: function ($state, $mdDialog, $translate, $document, firebaseEvents, organizerService) {
        this.isFabOpen = false;

        // TODO Load from firebase
        this.events = {
          drafts: firebaseEvents.getUnpublishedEvents(),
          future: firebaseEvents.getFutureEvents(organizerService.getCurrentChapter()),
          unreported:  firebaseEvents.getUnreportedEvents()
        };

        this.publishedAndFutureFilter = function (item) {
          return item.published === true && new Date(item.dates.start) >= new Date();
        };

        this.chapterFilter = function (item) {
          return item.chapters[organizerService.getCurrentChapter()] === true;
        };

        this.chapterAndPastFilter = function (item) {
          return new Date(item.dates.end) <= new Date() && item.chapters[organizerService.getCurrentChapter()] === true;
        }

        this.editEvent = function (event) {
          $state.go('events.edit', {id: event.$id});
        };

        this.deleteEvent = function (event, events, index) {
          const confirm = $mdDialog.confirm()
            .title($translate.instant('DIALOG.ARE_YOU_SURE'))
            .textContent($translate.instant('DIALOG.DELETE_EVENT_WARN'))
            .ariaLabel('Are you sure?')
            .ok($translate.instant('DIALOG.YES'))
            .cancel($translate.instant('DIALOG.NO'));


          $mdDialog.show(confirm).then(function () {
            events.splice(index, 1);
          }, function () {
            // Do nothing
          });

        };

        // TODO Buggy
        this.publishEvent = function (event, index) {
          this.events.future.push(event);
          this.events.drafts.splice(index, 1);
        };

        // TODO Buggy
        this.hideEvent = function (event, index) {
          this.events.drafts.push(event);
          this.events.future.splice(index, 1);
        };

        // TODO
        this.reportEvent = function (eventId) {
          $mdDialog.show({   // TODO how to set dialog width?
            controller: DialogController,
            controllerAs: 'vm',
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
    $mdDialog.hide(this.venue);
  };
}
