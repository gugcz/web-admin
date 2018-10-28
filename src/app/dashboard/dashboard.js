angular.module('gugCZ.webAdmin.dashboard', [
  'ui.router'
])
  .config(function ($stateProvider) {

    $stateProvider.state('dashboard', {
      parent: 'base',
      url: 'dashboard',
      controller: function ($state, $mdDialog, $translate, $document, firebaseEvents, organizerService, $mdToast) {
        this.isFabOpen = false;

        this.isAdmin = organizerService.getCurrentChapter() === 'admin';

        // TODO Load from firebase
        this.chapterEvents = firebaseEvents.getChapterEvents(organizerService.getCurrentChapter());

        this.draftFilter = function(item) {
          return item.published !== true;
        };

        this.pastFilter = function (item) {
          let now = new Date();
          return (new Date(item.dates.end) <= now) && (new Date(item.dates.end) >= new Date().setMonth(now.getMonth() - 1));
        }

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

        this.getChaptersString = function (chapters) {
          return Object.keys(chapters).join(', ')
        }

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
        this.reportEvent = function (ev, event) {
          $state.go('reports.add', {id: event.$id});
        };

        function showToast(messageId) {
          $mdToast.show(
            $mdToast.simple() // TODO zapouzdřit?
              .textContent($translate.instant(messageId))
              .position('bottom right')
              .hideDelay(3000)
          );
        }


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
