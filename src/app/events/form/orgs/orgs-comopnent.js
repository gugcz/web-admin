(function () {
	'use strict';

	var component = {
		templateUrl: 'app/events/form/orgs/orgs.html',
		controller: OrgsController,
		controllerAs: 'vm',
    bindings: {
		  selectedChapters: '=',
      organizers: '='
    }
	};

	function OrgsController(firebaseEvents) {

    this.showSearch = false;
    this.guarantee = null;

    // TODO Add default
		this.setGuarantee = function(org) {
      this.guarantee = org;
    };

    this.isGuarantee = function(org) {
      return this.guarantee && this.guarantee.$id === org.$id;
    };

    // TODO Order by activity
    // TODO Repair https://docs.angularjs.org/error/$rootScope/infdig?p0=10&p1=%5B%5D
    var possibleOrgs = firebaseEvents.getOrgnizersByChapters(this.selectedChapters);
    this.getPossibleOrgs = function() {
      possibleOrgs = firebaseEvents.getOrgnizersByChapters(this.selectedChapters);
      return possibleOrgs;
    };



    this.selectedItem = null;
    this.searchText = null;
    this.querySearch = querySearch;
    this.chapters = loadChapters();
    this.autocompleteDemoRequireMatch = true;
    this.transformChip = transformChip;

    function transformChip(chip) {
      // If it is an object, it's already a known chip
      if (angular.isObject(chip)) {
        return chip;
      }

      // Otherwise, create a new one
      return { name: chip };
    }

    /**
     * Search for chapters.
     */
    function querySearch (query) {
      var results = query ? this.chapters.filter(createFilterFor(query)) : [];
      return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(chapter) {
        return (chapter.name.toLowerCase().indexOf(lowercaseQuery) !== -1);
      };

    }

    function loadChapters() {
      var chapters = firebaseEvents.getChapters();
      return chapters;
    }

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
