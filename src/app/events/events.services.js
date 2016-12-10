(function() {
	'use strict';

	function firebaseFactory(firebaseDB, $q, $firebaseArray, removeDiacritics) {
		var self = this;
		var chapterID = null;

		self.addEvent = function(event) {
			console.log(event);
		};
	}


	angular.module('gugCZ.webAdmin.events.services', [
		  'gugCZ.webAdmin.common.firebase'
	  ]
	)
	  .service('firebaseEvents', firebaseFactory)

})();