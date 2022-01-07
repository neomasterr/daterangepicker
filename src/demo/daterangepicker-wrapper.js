import DateRangePicker, {LOCK_UNAVAILABLE, LOCK_LOCKED, createElement} from '../../dist/daterangepicker';

export {
    LOCK_LOCKED,
    LOCK_UNAVAILABLE,
    createElement,
}

/**
 * Класс - обёртка вендорного компонента
 */
function DateRangePickerWrapper($element, options = {}) {
    // ссылка на экземпляр
    if ($element.instance) {
        return $element.instance;
    }

    // забронированные даты
    this._bookingDates = {};

    // наследуемся
    DateRangePicker.call(this, $element, options);

    this._$picker.classList.add('Daterangepicker-wrapper');
}

// цепочка прототипов
DateRangePickerWrapper.prototype = Object.create(DateRangePicker.prototype, {
    constructor: {
        value: DateRangePickerWrapper,
        enumerable: false,
        writable: true,
    }
});

/**
 * Фильтр текста подсказки
 * @param  {Number} days Количество выбранных дней
 * @return {String}
 */
DateRangePickerWrapper.prototype._filterTooltipText = function(days) {
    if (typeof this.options.filter.tooltipText == 'function') {
        return this.options.filter.tooltipText.call(this, days) || '';
    }

    const nights = days - 1;
    return this.plural(nights, ['%d ночь', '%d ночи', '%d ночей']).replace('%d', nights);
}

/**
 * Инициализация забронированных дат
 * @param {Array} bookingDates Массив дат
 */
DateRangePickerWrapper.prototype.setBookingDates = function(bookingDates) {
    if (Array.isArray(bookingDates)) {
        // для быстрого поиска
        bookingDates = bookingDates.reduce((acc, item) => {
            if (typeof item == 'string') {
                item = new Date(item);
            }

            if (item instanceof Date) {
                item.setHours(0, 0, 0, 0);
                acc[item] = item;
            }

            return acc;
        }, {});
    }

    this._bookingDates = bookingDates;

    // обновление рендера
    this.update();
}

/**
 * Фильтр заблокированных дат
 * @param  {Date}   date Дата
 * @return {Number}      Одна из констант LOCK_...
 */
DateRangePickerWrapper.prototype._filterLockDays = function(date) {
    // забронировано
    if (this._bookingDates[date]) {
        return LOCK_LOCKED;
    }

    return DateRangePicker.prototype._filterLockDays.call(this, date);
}

/**
 * Визуальное выделение элементов
 * @param {Date} date_from Начальная дата
 * @param {Date} date_to   Конечная дата
 */
DateRangePickerWrapper.prototype._rangeVisualSelect = function(date_from, date_to) {
    DateRangePicker.prototype._rangeVisualSelect.call(this, date_from, date_to);

    this._$months.querySelectorAll('.Month').forEach($month => {
        $month.querySelectorAll('.Week').forEach($week => {
            const $selected = $week.querySelectorAll('.Day.is-selected, .Day.is-selected-between');
            let $wrapper = $week.querySelector('.Days__selected');

            if ($wrapper) {
                this._unwrapDaysSelected($wrapper);
            }

            if (!$selected.length) {
                return
            }

            $wrapper = createElement('<div class="Days__selected"></div>');
            $week.insertBefore($wrapper, $selected[0]);

            $selected.forEach($day => {
                $wrapper.appendChild($day);
            });
        });
    });
}

/**
 * Сброс выделения
 */
DateRangePickerWrapper.prototype._rangeVisualReset = function() {
    DateRangePicker.prototype._rangeVisualReset.call(this);

    this._$months.querySelectorAll('.Days__selected').forEach(this._unwrapDaysSelected);
}

/**
 * Перенос выделенных дней из контейнера
 */
DateRangePickerWrapper.prototype._unwrapDaysSelected = function($wrapper) {
    while ($wrapper.firstElementChild) {
        $wrapper.parentElement.insertBefore($wrapper.firstElementChild, $wrapper);
    }

    $wrapper.parentElement.removeChild($wrapper);
}

export default DateRangePickerWrapper;
