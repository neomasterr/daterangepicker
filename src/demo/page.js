import DateRangePicker, {LOCK_UNAVAILABLE, LOCK_LOCKED} from '../../dist/daterangepicker';
import DateRangePickerDropdown from './daterangepicker-dropdown';

const $form         = document.forms[0];
const $formDropdown = document.forms[1];

// заблокированные даты
const blockedDates = {};
const date = new Date();
date.setHours(0, 0, 0, 0);
for (let i = 0; i < 60; ++i) {
    if (Math.random() > 0.6) {
        blockedDates[date] = true;
    }
    date.setDate(date.getDate() + 1);
}

new DateRangePicker(document.querySelector('#daterangepicker'), {
    minDate: new Date(),
    maxDate: new Date('2022-05-20'),
    monthsCount: 2,
    perRow: 3,
    singleMode: false,
    internalInputs: false,
    breakpoints: {
        960: {
            monthsCount: 12,
        },
        720: {
            monthsCount: 3,
        },
        480: {
            monthsCount: 1,
        },
    },
    on: {
        rangeSelect: function(date_from, date_to) {
            $form.elements['date_from'].value = date_from.toLocaleDateString();
            $form.elements['date_to'].value   = date_to.toLocaleDateString();
        },
        daySelect: function(date_from) {
            $form.elements['date_from'].value = date_from.toLocaleDateString();
        },
    },
    filter: {
        lockDays: function(date) {
            if (blockedDates[date]) {
                return LOCK_LOCKED;
            }

            return false;
        },
        tooltipText: function(days) {
            const nights = days - 1;
            return this.plural(nights, ['%d ночь', '%d ночи', '%d ночей']).replace('%d', nights);
        }
    }
});

const dropdown = new DateRangePickerDropdown(document.querySelector('#daterangepicker-dropdown'), {
    minDate: new Date(),
    maxDate: new Date('2022-05-20'),
    monthsCount: 2,
    perRow: 3,
    singleMode: false,
    internalInputs: false,
    breakpoints: {
        960: {
            monthsCount: 12,
        },
    },
    on: {
        rangeSelect: function(date_from, date_to) {
            $formDropdown.elements['date_from'].value = this.formatDate(date_from, 'Y-m-d');
            $formDropdown.elements['date_to'].value = this.formatDate(date_to, 'Y-m-d');
        },
        daySelect: function(date_from) {
            $formDropdown.elements['date_from'].value = date_from.toLocaleDateString();
        },
    },
    filter: {
        lockDays: function(date) {
            if (blockedDates[date]) {
                return LOCK_LOCKED;
            }

            return false;
        },
        tooltipText: function(days) {
            const nights = days - 1;
            return this.plural(nights, ['%d ночь', '%d ночи', '%d ночей']).replace('%d', nights);
        }
    }
});

// забронированные дни
const day = new Date();
const bookingDates = [];
for (let i = 0; i < 100; ++i) {
    if (~[4, 5].indexOf(day.getDay())) {
        const d = new Date();
        d.setTime(day.getTime());
        bookingDates.push(d);
    }

    day.setDate(day.getDate() + 1);
}

dropdown.setBookingDates(bookingDates);
