angular.module('gugCZ.webAdmin.dashboard', [
  'ui.router',
  'gugCZ.webAdmin.report.form'
])
  .config(function ($stateProvider) {

    $stateProvider.state('dashboard', {
      parent: 'base',
      url: 'dashboard',
      controller: function ($state, $mdDialog, $translate, $document) {
        this.isFabOpen = false;

        // TODO Load from firebase
        this.events = {
          drafts: [
            {
              name: 'GDG Coding Dojo Brno #2',
              subtitle: 'Intenzivní trénink programátora',
              dates: {
                start: new Date(),
                end: new Date()
              },
              description: 'Tady bude popis',
              venue: {
                name: 'ModernTV'
              },
              regFormLink: 'forms.google.com',
              links: [
                {url: 'www.facebook.com/outer'}
              ]

            },
            {
              name: 'Firebase Codelab',
              subtitle: 'Intenzivní trénink programátora',
              dates: {
                start: new Date(),
                end: new Date()
              },
              description: 'Tady bude popis',
              venue: {
                name: 'MU Fakulta informatiky'
              },
              regFormLink: 'forms.google.com',
              links: [
                {url: 'www.facebook.com/outer'}
              ]

            }
          ],
          future: [
            {
              name: 'GDG Coding Dojo Brno #1',
              subtitle: 'Intenzivní trénink programátora',
              dates: {
                start: new Date(),
                end: new Date()
              },
              description: 'Tady bude popis',
              venue: {
                name: 'ModernTV'
              },
              regFormLink: 'forms.google.com',
              links: [
                {url: 'www.facebook.com/outer'}
              ]

            }
          ],
          unreported: [
            {
              name: 'GDG Coding Dojo Brno',
              subtitle: 'Intenzivní trénink programátora',
              dates: {
                start: new Date(),
                end: new Date()
              },
              description: 'Tady bude popis',
              venue: {
                name: 'ModernTV'
              },
              regFormLink: 'forms.google.com',
              links: [
                {url: 'www.facebook.com/outer'}
              ]

            }
          ]
        };

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
