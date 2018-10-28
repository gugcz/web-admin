function firebaseFactory(firebaseDB, firebaseSTORAGE, $q, $firebaseArray, $log, $firebaseObject, $http) {
  const self = this;

  self.saveReport = function (reportId, report) {
    return firebaseDB.ref('events/' + reportId + '/report').set(report)
  }

  self.getEventName = function (eventId) {
    return $firebaseObject(firebaseDB.ref('events/' + eventId + '/name'))
  }
}


angular.module('gugCZ.webAdmin.reports.services', [
  'gugCZ.firebase',
])
    .service('reportService', firebaseFactory);
