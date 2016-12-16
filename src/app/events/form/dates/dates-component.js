(function () {
	'use strict';

	var component = {
		templateUrl: 'app/events/form/dates/dates.html',
		controller: DatesController,
		controllerAs: 'vm'
	};

	function DatesController() {
		this.dates = {
			start: new Date(),
			end: new Date()
		};


	}

	angular.module('gugCZ.webAdmin.events.form.dates', [ ])
	  .component('dates', component);

})();
