(function() {
	'use strict';

	function EventFormController(firebaseEvents) {

		// TODO
		var getNextMonthDate = function () {
			return new Date();
		};

		// TODO prefill
		this.event = {
			name: 'GDG Coding Dojo Brno',
			subtitle: 'Intenzivní trénink programátora',
			startDate: getNextMonthDate(),
			description: 'Tady bude popis',
			chapters: ['GDG Brno']

		}
		this.addEvent = function () {
			firebaseEvents.addEvent(this.event);
		}
	}


	angular.module('gugCZ.webAdmin.events.form', [])
	  .controller("EventFormController", EventFormController)

})();
