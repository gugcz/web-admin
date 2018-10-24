function firebaseFactory(firebaseDB, firebaseSTORAGE, $q, $firebaseArray, $log, $firebaseObject, $http) {
  const self = this;

  self.saveReport = function (reportId, report) {
    return firebaseDB.ref('events/' + reportId + '/report').set(report)
  }
}


angular.module('gugCZ.webAdmin.reports.services', [
  'gugCZ.firebase',
])
    .service('reportService', firebaseFactory);
