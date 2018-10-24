angular.module('gugCZ.webAdmin.reports', [
  'ui.router',
  'gugCZ.webAdmin.reports.services',
  'gugCZ.webAdmin.reports.form'
])

    .config(function ($stateProvider) {

      $stateProvider


          .state('reports.add', {
            parent: 'base',

            url: 'report/:id',
            templateUrl: 'app/reports/form/form.html',
            controller: 'ReportFormController',
            controllerAs: 'vm',
            resolve: {
              report: function ($stateParams, $log) {
                $log.debug($stateParams.id);


                return {
                  text: '',
                  positives: '',
                  negatives: '',
                  attendeesCount: 0,
                  feedbackUrl: '',
                  photoUrl: '',
                }
              }
            },
            data: {
              title: 'TITLES.REPORT_EVENT'
            }
          });

    });
