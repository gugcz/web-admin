const component = {
  templateUrl: 'app/events/form/dates/dates.html',
  controller: DatesController,
  controllerAs: 'vm',
  bindings: {
    dates: '='
  }
};

/**
 * @param {Date} date
 * @return {Date}
 */
const getNextMonthDate = function (date) {
  date = date || new Date();

  if (date.getMonth() === 11) {
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
const setTimeByPreset = function (date, dateWithTime) {
  const dateTime = new Date(date.toISOString());

  dateTime.setUTCHours(dateWithTime.getUTCHours());
  dateTime.setUTCMinutes(dateWithTime.getUTCMinutes());
  dateTime.setUTCSeconds(dateWithTime.getUTCSeconds());
  dateTime.setUTCMilliseconds(dateWithTime.getUTCMilliseconds());

  return dateTime;
};

function getLastDayOfThisMonth() {
  const date = new Date(), y = date.getFullYear(), m = date.getMonth();

  return new Date(y, m + 1, 0);
}


function DatesController($mdDialog, $translate) {
  const preFillData = { // TODO vstupní data z firebase
    startTime: new Date('1970-01-01T16:00Z'),
    duration: 120
  };

  this.$onInit = function () {
    if (angular.isUndefined(this.dates.start) || this.dates.start === null) {
      this.duration = preFillData.duration;

      this.dates = {
        start: setTimeByPreset(getNextMonthDate(), preFillData.startTime),
        end: null
      };


      this.repeats = {};

      this.calculateEndDate();
    }
    else {
      this.dates.start = new Date(this.dates.start);
      this.dates.end = new Date(this.dates.end);
      this.duration = (this.dates.end.getTime() - this.dates.start.getTime()) / 60000;
      this.repeats = {}; // TODO - In Firebase?
    }
  };

  this.config = {
    repeats: {
      weekRepeat: ['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'LAST'],
      weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      daysInWeek: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    },
    durations: {
      60: '1 hodina',
      90: '1,5 hodiny',
      120: '2 hodiny',
      150: '2,5 hodiny',
      180: '3 hodiny',
      210: '3,5 hodiny',
      240: '4 hodiny',
      300: '5 hodin',
      360: '6 hodin'
    }
  };

  this.getBaseCalendarOptions_ = function () {
    return angular.copy({
      dayNamesLength: 2,
      mondayIsFirstDay: true
    });
  };

  this.duration = preFillData.duration;

  this.dates = {
    start: setTimeByPreset(getNextMonthDate(), preFillData.startTime),
    end: null
  };

  this.calculateEndDate = function () {
    if (this.isMultiDay) {
      return;
    }

    const startTime = this.dates.start.getTime();
    this.dates.end = new Date(startTime + this.duration * 60000);
    this.endOptionsCache_ = null;
  };

  this.calculateEndDate();

  function showNewsletterDialog() {
    $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title($translate.instant('EVENTS.FORM.DATE_ALERT.TITLE'))
        .textContent($translate.instant('EVENTS.FORM.DATE_ALERT.TEXT'))
        .ok($translate.instant('EVENTS.FORM.DATE_ALERT.OK'))
    );
  }

  this.boundedChangeStartDateListener = function (date) {

    this.dates.start.setFullYear(date.year);
    this.dates.start.setMonth(date.month);
    this.dates.start.setDate(date.day);

    this.repeats.day = this.dates.start.getDay();

    this.calculateEndDate();

    if (this.isDateAfterNewsletterDeadline()) {
      showNewsletterDialog();
    }

  }.bind(this);

  this.boundedChangeEndDateListener = function (date) {

    this.dates.end.setFullYear(date.year);
    this.dates.end.setMonth(date.month);
    this.dates.end.setDate(date.day);

    this.calculateEndDate();

  }.bind(this);

  this.getStartDateOptions = function () {
    if (!this.startOptionsCache_) {
      this.startOptionsCache_ = this.getBaseCalendarOptions_();
      this.startOptionsCache_.defaultDate = this.dates.start;
      this.startOptionsCache_.dateClick = this.boundedChangeStartDateListener;
    }

    return this.startOptionsCache_;
  };

  this.getEndDateOptions = function () {
    if (!this.endOptionsCache_) {
      this.endOptionsCache_ = this.getBaseCalendarOptions_();
      this.endOptionsCache_.defaultDate = this.dates.end;
      this.endOptionsCache_.dateClick = this.boundedChangeEndDateListener;
    }

    return this.endOptionsCache_;
  };

  // TODO repair for the last day
  this.isDateAfterNewsletterDeadline = function () {
    const newsletterDeadline = getLastDayOfThisMonth();
    return newsletterDeadline > this.dates.start;
  };

  this.generateTerms = function () {
    // TODO dořešit výpočet a zobrazení
    alert(angular.toJson(this.repeats));
  };


}

angular.module('gugCZ.webAdmin.events.form.dates', ['flexcalendar'])
  .component('datesPicker', component);
