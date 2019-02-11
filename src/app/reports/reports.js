angular.module('gugCZ.webAdmin.reports', [
  'ui.router',
  'gugCZ.webAdmin.reports.services',
  'gugCZ.webAdmin.reports.form'
])

    .config(function ($stateProvider) {

      $stateProvider.state('reports', {
        parent: 'base',
        url: 'reports',
        resolve: {
          events: function () { return [];}
        },
        controller: function () {

        },
        controllerAs: 'reportsCtrl',
        templateUrl: 'app/events/events.html',
        data: {
          title: 'TITLES.REPORTS'
        }
      }).state('reports.add', {
        parent: 'base',

        url: 'report/:id',
        templateUrl: 'app/reports/form/form.html',
        controller: 'ReportFormController',
        controllerAs: 'vm',
        resolve: {
          report: function () {

            return {
              sendToSlack: true
            };
          }
        },
        data: {
          title: 'TITLES.REPORT_EVENT'
        }
      });

    });
