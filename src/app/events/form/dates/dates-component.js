(function () {
	'use strict';

	var component = {
		templateUrl: 'app/events/form/dates/dates.html',
		controller: DatesController,
		controllerAs: 'vm'
	};

	function DatesController() {
		this.dates = {
			start: new Date(), // TODO Next month
			end: new Date() // TODO after two hours
		};

		this.isMultiDay = true;

		this.duration = 120;

    this.options = {
      defaultDate: "2015-08-06",
      minDate: "2015-01-01",
      maxDate: "2015-12-31",
      disabledDates: [
        "2015-06-22",
        "2015-07-27",
        "2015-08-13",
        "2016-08-15"
      ],
      dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
      mondayIsFirstDay: true,//set monday as first day of week. Default is false
      eventClick: function(date) { // called before dateClick and only if clicked day has events
        console.log(date);
      },
      dateClick: function(date) { // called every time a day is clicked
        console.log(date);
      },
      changeMonth: function(month, year) {
        console.log(month, year);
      },
      filteredEventsChange: function(filteredEvents) {
        console.log(filteredEvents);
      },
    };


    this.durations = {
      60: '1 hodina',
      120: '2 hodiny',
      180: '3 hodiny'
    };


	}

	angular.module('gugCZ.webAdmin.events.form.dates', ['flexcalendar'])
	  .component('datesPicker', component);

})();
