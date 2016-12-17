(function() {
  'use strict';

  var component = {
    templateUrl: 'app/events/form/dates/dates.html',
    controller: DatesController,
    controllerAs: 'vm'
  };

  /**
   * @param {Date} date
   * @return {Date}
   */
  var getNextMonthDate = function(date) {
    date = date || new Date();

    if (date.getMonth() == 11) {
      return new Date(date.getFullYear() + 1, 0, 1, 12);
    } else {
      return new Date(date.getFullYear(), date.getMonth() + 1, 1, 12);
    }

  };

  /**
   *
   * @param {Date} date
   * @param {Date} dateWithTime
   * @return {Date}
   */
  var setTimeByPreset = function(date, dateWithTime) {
    var dateTime = new Date(date.toISOString());

    dateTime.setUTCHours(dateWithTime.getUTCHours());
    dateTime.setUTCMinutes(dateWithTime.getUTCMinutes());
    dateTime.setUTCSeconds(dateWithTime.getUTCSeconds());
    dateTime.setUTCMilliseconds(dateWithTime.getUTCMilliseconds());

    return dateTime;
  };


  function DatesController($scope) {

    var preFillData = { // TODO vstupní data z firebase
      startTime: new Date("1970-01-01T16:00Z"),
      duration: 120
    };

    this.durations = {
      60: '1 hodina',
      90: '1,5 hodiny',
      120: '2 hodiny',
      150: '2,5 hodiny',
      180: '3 hodiny',
      210: '3,5 hodiny',
      240: '4 hodiny',
      300: '5 hodin',
      360: '6 hodin'
    };

    this.isMultiDay = false;
    this.duration = preFillData.duration;

    this.dates = {
      start: setTimeByPreset(getNextMonthDate(), preFillData.startTime),
      end: null
    };

    this.calculateEndDate = function() {
      if (this.isMultiDay) {
        return;
      }

      var startTime = this.dates.start.getTime();
      this.dates.end = new Date(startTime + this.duration * 60000);
    };

    this.calculateEndDate();

    this.startDateOptions = {
      defaultDate: this.dates.start,
      dayNamesLength: 2,
      mondayIsFirstDay: true,
      dateClick: function(date) {

        this.dates.start.setFullYear(date.year);
        this.dates.start.setMonth(date.month);
        this.dates.start.setDate(date.day);

        this.calculateEndDate();

      }.bind(this)
    };




  }

  angular.module('gugCZ.webAdmin.events.form.dates', ['flexcalendar'])
    .component('datesPicker', component);

})();
