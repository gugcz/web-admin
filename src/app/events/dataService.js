(function() {
  'use strict';

  var Events = function($http, $sce, API_URL) {

    function makeTrusted(event) {
      event.description = $sce.trustAsHtml(event.description);

      return event;
    }

    this.load = function() {
      return $http.get(API_URL)
          .then(function(response) {
            return response.data.items.map(makeTrusted);
          });
    };
  };

  angular.module('gugCZ.webAdmin.events.service', [
    'gugCZ.webAdmin.config'
  ])
      .service('eventsDataService', Events);

})();
