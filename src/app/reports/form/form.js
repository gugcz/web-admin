function ReportFormController(reportService, $state, $mdToast, $translate, report, $stateParams) {

  this.report = report;
  this.savingReport = false;

  this.eventNameObject = reportService.getEventName($stateParams.id)

  this.saveReport = function () {
    this.savingReport = true;
    reportService.saveReport($stateParams.id, this.report).then(() => {
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
