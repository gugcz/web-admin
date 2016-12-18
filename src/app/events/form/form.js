(function() {
	'use strict';

	function EventFormController(firebaseEvents, $log) {

		// TODO
		var getNextMonthDate = function () {
			return new Date();
		};

    this.event = {
			name: 'GDG Coding Dojo Brno',
			subtitle: 'Intenzivní trénink programátora',
			startDate: getNextMonthDate(),
			description: 'Tady bude popis',
			regFormLink: 'forms.google.com',
			chapters: [],
			links: ["Ahoj"]

		};

		this.addEvent = function () {
			firebaseEvents.addEvent(this.event);
		};
	}


	angular.module('gugCZ.webAdmin.events.form', [
	  'gugCZ.webAdmin.events.form.orgs',
    'gugCZ.webAdmin.events.form.dates',
    'gugCZ.webAdmin.events.form.chapters',
    'gugCZ.webAdmin.events.form.venue'
  ])
	  .controller("EventFormController", EventFormController);

})();
