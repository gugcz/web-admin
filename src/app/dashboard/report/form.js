

function ReportFormController() {

  this.cancel = function() {
    this.onCancel();
  };

  this.submit = function(form) {
    if (form.$invalid) {
      return;
    }
    this.onSave(this.report);
  };

}

angular.module('gugCZ.webAdmin.report.form', [
  'hc.marked',
  'gugCZ.webAdmin.events.form.orgs',
  'gugCZ.webAdmin.events.form.dates',
  'gugCZ.webAdmin.events.form.venue'
])
  .component('reportForm', {
    controller: ReportFormController,
    controllerAs: 'vm',
    bindings: {
      report: '=',
      onCancel: '&',
      onSave: '&'
    },
    templateUrl: 'app/dashboard/report/form.html'

  });
