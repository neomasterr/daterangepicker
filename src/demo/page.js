import DateRangePicker from '../../dist/daterangepicker';

const $form = document.forms[0];
const $date_from = $form.querySelector('[name="date_from"]');
const $date_to   = $form.querySelector('[name="date_to"]');

function isMobile() {
    return window.innerWidth <= 960;
}

new DateRangePicker(document.querySelector('#daterangepicker'), {
    monthsCount: isMobile() ? 12 : 2,
    perRow: 3,
    on: {
        rangeSelect: function(date_from, date_to) {
            $date_from.value = date_from.toLocaleDateString();
            $date_to.value = date_to.toLocaleDateString();
        },
        daySelect: function(date_from) {
            console.log("date_from", date_from);

        },
    }
});
