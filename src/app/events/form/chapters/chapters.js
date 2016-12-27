(function () {
	'use strict';

	var component = {
		templateUrl: 'app/events/form/chapters/chapters.html',
		controller: ChaptersController,
		controllerAs: 'vm',
    bindings: {
		  selectedChapters: '='
    }
	};

	function ChaptersController(firebaseEvents) {
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

	angular.module('gugCZ.webAdmin.events.form.chapters', [ ])
	.component('chaptersPicker', component);

})();
