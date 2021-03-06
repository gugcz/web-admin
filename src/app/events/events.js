angular.module('gugCZ.webAdmin.events', [
  'ui.router',
  'gugCZ.webAdmin.events.services',
  'gugCZ.webAdmin.events.form'
])

  .config(function ($stateProvider) {

    $stateProvider.state('events', {
      parent: 'base',
      url: 'events',
      resolve: {
        events: function () { return [];}
      },
      controller: function (events, $location) {
        this.events = events;

        this.addEvent = function () {
          $location.path('/events/form');
        };
      },
      controllerAs: 'eventsCtrl',
      templateUrl: 'app/events/events.html',
      data: {
        title: 'TITLES.EVENTS'
      }
    })

      .state('events.add', {
        parent: 'base',

        url: 'events/add',
        templateUrl: 'app/events/form/form.html',
        controller: 'EventFormController',
        controllerAs: 'vm',
        resolve: {
          event: function ($firebaseObject, firebaseDB, currentUser, organizerService) {

            function initChapters() {

              return [{
                name: currentUser.chapters[organizerService.getCurrentChapter()].name,
                $id: organizerService.getCurrentChapter()
              }

              ];
            }

            function initOrganizers() {
              const organizers = {};
              organizers[currentUser.$id] = true;
              return organizers;
            }

            return {
              name: '',
              subtitle: '',
              dates: {},
              description: '',
              cover: null,
              venue: null,
              regFormLink: '',
              chapters: initChapters(),
              guarantee: currentUser.$id,
              organizers: initOrganizers(),
              links: null
            };
          }
        },
        data: {
          title: 'TITLES.ADD_EVENT'
        }
      })

      .state('events.edit', {
        parent: 'base',

        url: 'events/edit/:id',
        templateUrl: 'app/events/form/form.html',
        controller: 'EventFormController',
        controllerAs: 'vm',
        resolve: {
          event: function ($stateParams, $log, firebaseEvents) {
            $log.debug($stateParams.id);


            return firebaseEvents.loadEvent($stateParams.id);
          }
        },
        data: {
          title: 'TITLES.EDIT_EVENT'
        }
      });

  });
