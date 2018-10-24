function ReportFormController(reportService, $state, $mdToast, $translate, report) {

  this.report = report;
  this.savingReport = false;

  this.saveReport = function () {
    reportService.saveReport(reportId, report).then(() => {
      this.savingReport = false;
      showMessageAndGoToDashboard('EVENTS.TOASTS.EVENT_REPORTED');
    })
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


angular.module('gugCZ.webAdmin.reports.form', [
]).controller('ReportFormController', ReportFormController);
