(function() {
	'use strict';

	function EventFormController(firebaseEvents, $scope) {

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
				return (chapter._lowername.indexOf(lowercaseQuery) !== -1);
			};

		}

		function loadChapters() {
			// TODO load from firebase
			var chapters = [
				{
					'name': 'GDG Brno'
				},
				{
					'name': 'GDG Jihlava'
				},
				{
					'name': 'GDG Pilsen'
				},
				{
					'name': 'GBG Brno'
				},
				{
					'name': 'GEG Brno'
				},
				{
					'name': 'GXG Brno'
				}
			];

			return chapters.map(function (chapter) {
				chapter._lowername = chapter.name.toLowerCase();
				return chapter;
			});
		}

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
			regFormLink: 'forms.google.com',
			chapters: [{name: "GDG Brno", _lowername: "gdg brno"}],
			links: ["Ahoj"]

		};

		this.addEvent = function () {
			firebaseEvents.addEvent(this.event);
		};
	}


	angular.module('gugCZ.webAdmin.events.form', [
	  'gugCZ.webAdmin.events.form.orgs',
    'gugCZ.webAdmin.events.form.dates'
  ])
	  .controller("EventFormController", EventFormController);

})();
