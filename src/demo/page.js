import DateRangePicker from '../../dist/daterangepicker';

const $form = document.forms[0];
const $date_from = $form.querySelector('[name="date_from"]')
const $date_to   = $form.querySelector('[name="date_to"]')

new DateRangePicker(document.querySelector('#daterangepicker'), {
    on: {
        rangeSelect: function(date_from, date_to) {
            $date_from.value = date_from.toLocaleDateString();
            $date_to.value = date_to.toLocaleDateString();
        },
    }
});
