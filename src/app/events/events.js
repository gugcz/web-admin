(function() {
  'use strict';

  angular.module('gugCZ.webAdmin.events', [
      'ui.router',
      'gugCZ.webAdmin.events.services',
      'gugCZ.webAdmin.events.form'
    ]
  )

    .config(function($stateProvider) {

      $stateProvider.state('events', {
        parent: 'base',
        url: 'events',
        resolve: {
          events: function() { return [];}
        },
        controller: function(events, $location) {
          this.events = events;

          this.addEvent = function() {
            $location.path('/events/form');
          };
        },
        controllerAs: 'eventsCtrl',
        templateUrl: 'app/events/events.html',
        data: {
          title: 'Akce' // TODO Add translation
        }
      })

        .state('events.add', {
          parent: 'base',

          url: 'events/add',
          templateUrl: 'app/events/form/form.html',
          controller: "EventFormController",
          controllerAs: 'vm',
          resolve: {
            event: function($firebaseObject, firebaseDB) {

              var signedUser = getSignedUser();

              // TODO
              function getSelectedChapter() {
                return $firebaseObject(firebaseDB.ref('chapters/gdg_brno'));
              }

              // TODO
              function getSignedUser() {
                return $firebaseObject(firebaseDB.ref('orgs/T093T0DMW_U1M4SU5D3'));
              }

              function getOrganizersWithSignedUser() {
                var organizers = {};
                organizers[signedUser.$id] = true;
                return organizers;
              }

              return {
                name: '',
                subtitle: '',
                dates: {},
                description: '',
                venue: null,
                regFormLink: '',
                chapters: [], // TODO
                guarantee: null, // TODO
                organizers: null, // TODO
                links: [
                  {url: ''}
                ]

              };
            }
          },
          data: {
            title: "Přidat akci"  // TODO Add translation
          }
        })

        .state('events.edit', {
          parent: 'base',

          url: 'events/edit/:id',
          templateUrl: 'app/events/form/form.html',
          controller: "EventFormController",
          controllerAs: 'vm',
          resolve: {
            event: function($stateParams) {
              console.log($stateParams.id);

              return {};
              // todo load from firebase
            }
          },
          data: {
            title: "Upravit akci"  // TODO Add translation
          }
        });

    });

})();
