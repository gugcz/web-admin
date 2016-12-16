(function () {
	'use strict';

	var component = {
		templateUrl: 'app/events/form/orgs/orgs.html',
		controller: OrgsController,
		controllerAs: 'vm'
	};

	function OrgsController() {
		this.orgs = ['Matěj Horák', 'Milan Lempera', 'Filip Procházka', 'Honza Slavík'];
		this.showSearch = false;


	}

	angular.module('gugCZ.webAdmin.events.form.orgs', [ ])
	  .config(function($mdIconProvider) {
		  $mdIconProvider
			.iconSet('social', 'img/icons/sets/social-icons.svg', 24)
			.iconSet('device', 'img/icons/sets/device-icons.svg', 24)
			.iconSet('communication', 'img/icons/sets/communication-icons.svg', 24)
			.defaultIconSet('img/icons/sets/core-icons.svg', 24);
	  })

	.component('orgsTable', component);

})();
