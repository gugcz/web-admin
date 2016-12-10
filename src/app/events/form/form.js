(function() {
	'use strict';

	function EventFormController(firebaseEvents) {
		var getNextMonthDate = function () {
			return new Date();
		};
		this.event = {
			name: 'GDG Coding Dojo Brno',
			startDate: getNextMonthDate()
		}
		this.addEvent = function () {
			firebaseEvents.addEvent(this.event);
		}
	}


	angular.module('gugCZ.webAdmin.events.form', [])
	  .controller("EventFormController", EventFormController)

})();
