import DateRangePicker from '../../dist/daterangepicker';

const $form = document.forms[0];
const $date_from = $form.querySelector('[name="date_from"]');
const $date_to   = $form.querySelector('[name="date_to"]');

function isMobile() {
    return window.innerWidth <= 960;
}

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
    monthsCount: isMobile() ? 12 : 2,
    perRow: 3,
    on: {
        rangeSelect: function(date_from, date_to) {
            $date_from.value = date_from.toLocaleDateString();
            $date_to.value = date_to.toLocaleDateString();
        },
        daySelect: function(date_from) {

        },
    },
    lockDaysFilter: function(day) {
        return !blockedDates[day];
    }
});
