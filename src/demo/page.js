import DateRangePicker, {LOCK_UNAVAILABLE, LOCK_LOCKED, formatDate} from '../../dist/daterangepicker';
import DateRangePickerDropdown from './daterangepicker-dropdown';

const $form         = document.forms[0];
const $formDropdown = document.forms[1];

/**
 * Заблокированные даты
 * @return {Object<Date>}
 */
function generateRandomBlockedDates() {
    const result = {};
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    for (let i = 0; i < 60; ++i) {
        if (Math.random() > 0.6) {
            result[date] = true;
        }
        date.setDate(date.getDate() + 1);
    }
    return result;
}

/**
 * Забронированные дни
 * @return {Array<Date>}
 */
function generateRandomBookingDates() {
    const result = [];
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    for (let i = 0; i < 100; ++i) {
        if (~[4, 5].indexOf(date.getDay())) {
            const d = new Date();
            d.setTime(date.getTime());
            result.push(d);
        }

        date.setDate(date.getDate() + 1);
    }
    return result;
}

const blockedDates = generateRandomBlockedDates();
const minDate = new Date();
minDate.setDate(1);
minDate.setMonth(minDate.getMonth() - 12);

const maxDate = new Date();
maxDate.setDate(1);
maxDate.setMonth(maxDate.getMonth() + 12);
maxDate.setDate(0);

(function() {
    const datepicker = new DateRangePicker(document.querySelector('#daterangepicker'), {
        minDate: minDate,
        maxDate: maxDate,
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
            'range-select': function(date_from, date_to) {
                $form.elements['date_from'].value = date_from.toLocaleDateString();
                $form.elements['date_to'].value   = date_to.toLocaleDateString();
            },
            'day-select': function(date_from) {
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
        }
    });
}());

(function() {
    const dropdown = new DateRangePickerDropdown(document.querySelector('#daterangepicker-dropdown'), {
        datepicker: {
            minDate: minDate,
            maxDate: maxDate,
            monthsCount: 2,
            perRow: 3,
            singleMode: false,
            internalInputs: false,
            breakpoints: {
                960: {
                    monthsCount: 12,
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
                },
            },
        },
        on: {
            apply: function(date_from, date_to) {
                $formDropdown.elements['date_from'].value = formatDate(date_from, 'Y-m-d');
                $formDropdown.elements['date_to'].value = formatDate(date_to, 'Y-m-d');
            },
        },
    });

    dropdown.setBookingDates(generateRandomBookingDates());
}())
