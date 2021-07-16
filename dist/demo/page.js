/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/daterangepicker.js":
/*!*********************************!*\
  !*** ./dist/daterangepicker.js ***!
  \*********************************/
/***/ ((module) => {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __nested_webpack_require_509__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_509__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_509__.o(definition, key) && !__nested_webpack_require_509__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nested_webpack_require_509__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_509__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!*****************************!*\
  !*** ./src/scss/index.scss ***!
  \*****************************/
__nested_webpack_require_509__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__nested_webpack_require_509__.r(__webpack_exports__);
/* harmony export */ __nested_webpack_require_509__.d(__webpack_exports__, {
/* harmony export */   "LOCK_UNAVAILABLE": () => (/* binding */ LOCK_UNAVAILABLE),
/* harmony export */   "LOCK_LOCKED": () => (/* binding */ LOCK_LOCKED),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// состояния заблокированных дат
const LOCK_UNAVAILABLE = 1;
const LOCK_LOCKED      = 2;

const INDEX_DATE_FROM = 0;
const INDEX_DATE_TO   = 1;

function DateRangePicker($container, options = {}) {
    // от повторной инициализации
    if ($container.instance) {
        return $container.instance;
    }
    $container.instance = this;

    this._$container = $container;

    this.options = {
        firstDayOfTheWeek: options.firstDayOfTheWeek || 1,          // первый день недели, 0 = вс, 1 = пн, ...
        singleMode:        options.singleMode        || false,      // выбор одной даты вместо диапазона
        locale:            options.locale            || 'ru-RU',
        minDays:           options.minDays           || 1,          // минимальное количество дней в диапазоне
        monthsCount:       options.monthsCount       || 12,
        perRow:            options.perRow            || undefined,  // количество месяцев в ряду
        minDate:           options.minDate           || new Date(), // минимальная дата
        maxDate:           options.maxDate           || undefined,
        breakpoints:       options.breakpoints       || {},
        internalInputs:    options.internalInputs    || true,       // использование встроенных инпутов
        // события
        on: Object.assign({
            rangeSelect: null, // событие выбора диапазона дат
            daySelect:   null, // событие выбора одной даты (только при singleMode: true)
        }, options.on || {}),
        // фильтрующие методы
        filter: Object.assign({
            lockDays:    this._filterLockDays,    // callback(date) функция блокирования дат, true/LOCK
            tooltipText: this._filterTooltipText, // callback(days) вывод текста подсказки
        }, options.filter || {}),
    }

    this.init();
}

/**
 * Инициализация
 */
DateRangePicker.prototype.init = function() {
    // рядность
    if (typeof this.options.perRow == 'undefined') {
        this.options.perRow = this.options.monthsCount;
    }

    if (this.options.minDate) {
        this.options.minDate.setHours(0, 0, 0, 0);
    }

    // опции для экранов по умолчанию
    this.options.breakpoints[this._breakpoint = 0] = Object.assign({}, this.options);

    // текущий день
    this._today = new Date();
    this._today.setHours(0, 0, 0, 0);

    this._$picker = this._$createElement(
        `<div class="Daterangepicker">
            ${this.options.internalInputs ?
                `<div class="Daterangepicker__inputs">
                    ${this.options.singleMode
                        ? `<input type="hidden" name="date">`
                        : `<input type="hidden" name="date_from">
                           <input type="hidden" name="date_to">`
                    }
                </div>` : ''
            }
            <div class="Daterangepicker__months"></div>
            <div class="Daterangepicker__tooltip">
                <div class="Daterangepicker__tooltip-content"></div>
            </div>
        </div>`
    );

    // элементы
    this._$months         = this._$picker.querySelector('.Daterangepicker__months');
    this._$tooltip        = this._$picker.querySelector('.Daterangepicker__tooltip');
    this._$tooltipContent = this._$picker.querySelector('.Daterangepicker__tooltip-content');

    // поля ввода
    this._$inputs = this._$picker.querySelectorAll('input[name^="date"]');

    // инициализация состояний
    this.rangeReset();

    // рендер
    this._selectDate(this.options.minDate);
    this._$container.appendChild(this._$picker);

    // обработка брейкпоинтов
    if (Object.keys(this.options.breakpoints).length) {
        window.addEventListener('resize', this._onWindowResizeEvent.bind(this));
        this._onWindowResizeEvent();
    }
}

/**
 * Название месяца
 * @param  {Date} date Объект даты
 * @return {String}
 */
DateRangePicker.prototype.getMonthFormatted = function(date) {
    const title = this.getDateTimeFormat(date, {month: 'long'});
    return title.slice(0, 1).toUpperCase() + title.slice(1);
}

/**
 * Форматирование даты для текущей локали
 * @param  {Date}   date    Объект даты
 * @param  {Object} options Параметры
 * @return {String}
 */
DateRangePicker.prototype.getDateTimeFormat = function(date, options) {
    return Intl.DateTimeFormat(this.options.locale, options).format(date);
}

/**
 * Дни недели
 */
DateRangePicker.prototype.getWeekDaysFormatted = function() {
    const date = new Date();
    const result = [];

    date.setDate(date.getDate() - 2);
    for (let i = 0; i < 7; ++i) {
        date.setDate(date.getDate() + 1);
        result.push({
            day: date.getDay(),
            title: this.getDateTimeFormat(date, {weekday: 'short'}),
        });
    }

    // сортировка согласно настроенному первому дню недели
    result.sort((a, b) => {
        const firstDayOfTheWeek = this.options.firstDayOfTheWeek % 7;
        let dayA = a.day;
        let dayB = b.day;

        if (dayA == firstDayOfTheWeek) {
            return -1;
        }

        if (dayB == firstDayOfTheWeek) {
            return 1;
        }

        if (dayA < firstDayOfTheWeek) {
            dayA += result.length;
        }

        if (dayB < firstDayOfTheWeek) {
            dayB += result.length;
        }

        return dayA - dayB;
    });

    return result;
}

/**
 * Количество дней в месяце
 * @param  {Date} date Объект даты
 * @return {Number}    Количество дней
 */
DateRangePicker.prototype.getDaysCountInMonth = function(date) {
    const days = new Date(date.getTime());
    days.setHours(0, 0, 0, 0);
    days.setMonth(days.getMonth() + 1);
    days.setDate(0);
    return days.getDate();
}

/**
 * Сброс выделенных дат
 */
DateRangePicker.prototype.rangeReset = function() {
    this._rangeVisualReset();
    this._selection = {};
}

/**
 * Выделение диапазона дат
 * @param {Date} date_from Начальная дата
 * @param {Date} date_to   Конечная дата
 */
DateRangePicker.prototype.rangeSelect = function(date_from, date_to) {
    date_from.setHours(0, 0, 0, 0);
    date_to.setHours(0, 0, 0, 0);

    // допустимый диапазон
    if (!this.getIsRangeSelectable(date_from, date_to)) {
        return;
    }

    const $day_from = this._$getDayByDate(date_from);
    const $day_to = this._$getDayByDate(date_to);

    if ($day_from) {
        $day_from.classList.add('is-selected', 'is-selected-from');
    }

    if ($day_to) {
        $day_to.classList.add('is-selected', 'is-selected-to');
    }

    // выделение элементов
    this._rangeVisualSelect(date_from, date_to);

    // выбор дат в обратном порядке
    if (date_from > date_to) {
        [date_from, date_to] = [date_to, date_from];
    }

    // обновление инпутов
    if (this._$inputs[INDEX_DATE_FROM]) {
        this._$inputs[INDEX_DATE_FROM].value = this.formatDate(date_from);
    }

    if (this._$inputs[INDEX_DATE_TO]) {
        this._$inputs[INDEX_DATE_TO].value = this.formatDate(date_to);
    }

    // событие
    this._callback('rangeSelect', date_from, date_to);
}

/**
 * Форматирование даты
 * @param  {Date}   date   Объект даты
 * @param  {String} format Формат строки
 * @return {String}
 */
DateRangePicker.prototype.formatDate = function(date, format = 'Y-m-d') {
    return format.replace('Y', date.getFullYear())
                 .replace('m', ('0' + (date.getMonth() + 1)).slice(-2))
                 .replace('d', ('0' + (date.getDate())).slice(-2));
}

/**
 * Проверка возможности выделения дат
 * @param  {Date date_from Начальная дата
 * @param  {Date date_to   Конечная дата
 * @return {Boolean}
 */
DateRangePicker.prototype.getIsRangeSelectable = function(date_from, date_to) {
    date_from.setHours(0, 0, 0, 0);
    date_to.setHours(0, 0, 0, 0);

    if (date_from > date_to) {
        [date_from, date_to] = [date_to, date_from];
    }

    // минимальный диапазон
    const diff = Math.abs(date_from.getTime() - date_to.getTime()) / 1000 / 86400;
    if (diff < this.options.minDays) {
        return false;
    }

    // проверка попадания в диапазон заблокированных дат
    const day = new Date();
    day.setTime(date_from.getTime());

    while (day < date_to) {
        if (this.getDayLocked(day)) {
            return false;
        }

        day.setDate(day.getDate() + 1);
    }

    return true;
}

/**
 * Проверка на доступность дня для брони
 * @param  {Date} date Дата
 * @return {Boolean}   true если доступен
 */
DateRangePicker.prototype.getDayLocked = function(date) {
    // выбор дат вне доступного диапазона
    if (date < this.options.minDate || date > this.options.maxDate) {
        return LOCK_UNAVAILABLE;
    }

    return this.options.filter.lockDays.call(this, date);
}

/**
 * Выбранная начальная дата
 * @return {Date} Дата
 */
DateRangePicker.prototype.getDateFrom = function() {
    return this._getDateFromInput(INDEX_DATE_FROM);
}

/**
 * Выбранная дата (singleMode: true)
 * @return {Date} Дата
 */
DateRangePicker.prototype.getDate = DateRangePicker.prototype.getDateFrom;

/**
 * Выбранная конечная дата
 * @return {Date} Дата
 */
DateRangePicker.prototype.getDateTo = function() {
    return this._getDateFromInput(INDEX_DATE_TO);
}

/**
 * Склонение (1 бобёр, 2 бобра, 5 бобров)
 * @param  {Number} value Количество
 * @param  {Array}  forms Массив из 3х элементов, может содержать спецификатор %d для замены
 * @return {String}
 */
DateRangePicker.prototype.plural = function (value, forms) {
    return (value % 10 == 1 && value % 100 != 11 ? forms[0] : (value % 10 >= 2 && value % 10 <= 4 && (value % 100 < 10 || value % 100 >= 20) ? forms[1] : forms[2])).replace('%d', value);
}

/**
 * Выбранная дата
 * @param  {Number} index Индекс инпута
 * @return {Date}         Дата или undefined
 */
DateRangePicker.prototype._getDateFromInput = function(index) {
    return this._$inputs[index] ? new Date(this._$inputs[index].value) : undefined;
}

/**
 * Рендер диапазона месяцев
 * @param {Date} date_from Начальная дата
 */
DateRangePicker.prototype._$createMonths = function(date_from) {
    while (this._$months.lastElementChild) {
        this._$months.removeChild(this._$months.lastElementChild);
    }

    // прячем подсказку
    this._tooltipHide();

    // пререндер месяцев
    const currentDate = new Date(date_from.getTime());
    const $months = [];
    for (let i = 0; i < this.options.monthsCount; ++i) {
        $months.push(this._$createMonth(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // рендер
    for (let i = 0; i < $months.length; i += this.options.perRow) {
        const $row = document.createElement('div');
        $row.className = 'Daterangepicker__row';

        $months.slice(i, i + this.options.perRow).forEach($month => {
            $row.appendChild($month);
        });

        this._$months.appendChild($row);
    }

    if (this._selection.date_from || this._selection.date_to) {
        this._rangeVisualSelect(this._selection.date_from, this._selection.date_to);
    }
}

/**
 * Рендер месяца
 * @param {Date} date Месяц
 */
DateRangePicker.prototype._$createMonth = function(date) {
    const currentMonth = date.getMonth();
    const monthTitle = this.getMonthFormatted(date);
    const weekDays = this.getWeekDaysFormatted();

    const $month = this._$createElement(
        `<div class="Month" data-time="${date.getTime()}">
            <div class="Month__header">
                <div class="Month__arrow Month__arrow--prev${(this.options.minDate && date <= this.options.minDate) ? ' is-disabled' : ''}">
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 13L1 7L7 1" stroke="#8C8C8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </div>
                <div class="Month__title">${monthTitle} ${date.getFullYear()}</div>
                <div class="Month__arrow Month__arrow--next${(this.options.maxDate && date >= this.options.maxDate) ? ' is-disabled' : ''}">
                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 0.999999L7 7L1 13" stroke="#8C8C8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </div>
            </div>
            <div class="Month__week">${weekDays.map(item => {
                return `<div class="Month__weekday">${item.title}</div>`
            }).join('')}</div>
            <div class="Month__days"></div>
        </div>`
    );

    // стрелки
    [
        {selector: '.Month__arrow--prev', name: 'prev'},
        {selector: '.Month__arrow--next', name: 'next'},
    ].forEach(item => {
        const $arrow = $month.querySelector(item.selector);
        $arrow.addEventListener('click', e => {
            // временная мера, лучше переверстать, вынести стрелки за пределы перерерисовываемой области пикера
            e.stopPropagation();

            this._onArrowClick($arrow, item.name);
        });
    });

    // рендер дней
    const $days = $month.querySelector('.Month__days');
    const days = new Date(date.getTime());
    days.setDate(1);
    days.setHours(0, 0, 0, 0);

    while (days.getMonth() == currentMonth) {
        const $week = this._$createWeek();

        weekDays.forEach(item => {
            if (days.getDay() != item.day || days.getMonth() != currentMonth) {
                $week.appendChild(this._$createEmptyDay());
                return;
            }

            $week.appendChild(this._$createDay(days));
            days.setDate(days.getDate() + 1);
        });

        $days.appendChild($week);
    }

    return $month;
}

/**
 * Клик по стрелке переключения месяца
 * @param {Element} $arrow HTML элемент
 * @param {String} name    Имя (prev, next)
 */
DateRangePicker.prototype._onArrowClick = function($arrow, name) {
    if ($arrow.classList.contains('is-disabled')) {
        return false;
    }

    const date = new Date(parseInt(this._$months.querySelector('.Month').dataset.time, 10));
    date.setMonth(date.getMonth() + (name == 'prev' ? -this.options.monthsCount : this.options.monthsCount));

    // выход за пределы минимальной даты
    if (date < this.options.minDate) {
        date.setTime(this.options.minDate.getTime());
    }

    // выход за пределы максимальной даты
    if (this.options.maxDate) {
        const endDate = new Date(date.getTime());
        endDate.setMonth(endDate.getMonth() + this.options.monthsCount);
        if (endDate > this.options.maxDate) {
            date.setTime(this.options.maxDate.getTime());
            date.setMonth(date.getMonth() - this.options.monthsCount + 1);
        }
    }

    // переход к новой дате
    this._selectDate(date);
}

/**
 * Установка текущей даты с рендером
 * @param {Date} date Дата
 */
DateRangePicker.prototype._selectDate = function(date) {
    this._selectedDate = date;
    this._$createMonths(date);
}

/**
 * Рендер недели
 * @param  {Date} date Объект даты
 * @return {Element}
 */
DateRangePicker.prototype._$createWeek = function(date) {
    const $week = this._$createElement(
        `<div class="Week"></div>`
    );

    return $week;
}

/**
 * Рендер дня
 * @param  {Date} date Объект даты
 * @return {Element}
 */
DateRangePicker.prototype._$createDay = function(date) {
    const $day = this._$createElement(
        `<div class="Day" data-time="${date.getTime()}" data-day="${date.getDay()}">${date.getDate()}</div>`
    );

    $day.addEventListener('click', this._onDayClickEvent.bind(this));

    if (!this.options.singleMode) {
        $day.addEventListener('mouseenter', this._onDayMouseEnterEvent.bind(this));
    }

    // обновление состояний
    this._updateDay($day);

    return $day;
}

/**
 * Обновление состояний
 */
DateRangePicker.prototype.update = function() {
    this._$months.querySelectorAll('.Month').forEach($month => {
        this._updateMonth($month);
    });
}

/**
 * Обновление состояний месяца
 * @param {Element} $month Элемент месяца
 */
DateRangePicker.prototype._updateMonth = function($month) {
    $month.querySelectorAll('.Day[data-time]').forEach($day => {
        this._updateDay($day);
    });
}

/**
 * Обновление состояний дня
 * @param {Element} $day Элемент дня
 */
DateRangePicker.prototype._updateDay = function($day) {
    const date   = new Date(parseInt($day.dataset.time, 10));
    const locked = this.getDayLocked(date);
    const today  = this._today.getTime() == date.getTime();

    $day.classList.toggle('is-disabled', locked);
    $day.classList.toggle('is-locked', locked == LOCK_LOCKED);
    $day.classList.toggle('is-today', today);
}

/**
 * Событие клика по дню
 * @param {Event} e DOM событие
 */
DateRangePicker.prototype._onDayClickEvent = function(e) {
    this._onDayClick(e.target);
}

/**
 * Событие ховера
 * @param {Event} e DOM событие
 */
DateRangePicker.prototype._onDayMouseEnterEvent = function(e) {
    this._onDayMouseEnter(e.target);
}

/**
 * Ховер на элементе дня
 * @param {Element} $day HTML Элемент
 */
DateRangePicker.prototype._onDayMouseEnter = function($day) {
    if (!this._selection.date_from || this._selection.date_to) {
        return;
    }

    if ($day.dataset.time == this._selection.date_from.getTime()) {
        return;
    }

    const date_to = new Date(parseInt($day.dataset.time, 10));
    this._rangeVisualSelect(this._selection.date_from, date_to);
}

/**
 * Клик по дню
 * @param {Element} $day HTML Элемент
 */
DateRangePicker.prototype._onDayClick = function($day) {
    // день заблокирован
    if ($day.classList.contains('is-disabled')) {
        return false;
    }

    // выбор одной даты
    if (this.options.singleMode) {
        this.rangeReset();
        $day.classList.add('is-selected');
        this._callback('daySelect', new Date(parseInt($day.dataset.time, 10)));
        return;
    }

    // сброс выбранного ранее диапазона
    if (this._selection.date_from && this._selection.date_to) {
        this.rangeReset();
    }

    $day.classList.add('is-selected');

    // выбрана начальная / конечная дата
    if (!this._selection.date_from) {
        this._selection.date_from = new Date(parseInt($day.dataset.time, 10));
    } else if (!this._selection.date_to) {
        this._selection.date_to = new Date(parseInt($day.dataset.time, 10));
    }

    if (this._selection.date_from && this._selection.date_to) {
        // допустимый диапазон
        if (!this.getIsRangeSelectable(this._selection.date_from, this._selection.date_to)) {
            this.rangeReset();
            return;
        }

        this.rangeSelect(this._selection.date_from, this._selection.date_to);
    }
}

/**
 * Визуальный сброс выделенных дат
 */
DateRangePicker.prototype._rangeVisualReset = function() {
    const $days = this._$months.querySelectorAll('.Day[data-time]');
    $days.forEach($day => {
        $day.classList.remove('is-selected', 'is-selected-from', 'is-selected-to', 'is-selected-between');
    });

    // прячем подсказку
    this._tooltipHide();
}

/**
 * Визуальное выделение дат
 * @param {Date} date_from Начальная дата
 * @param {Date} date_to   Конечная дата
 */
DateRangePicker.prototype._rangeVisualSelect = function(date_from, date_to) {
    if (date_from && date_from instanceof Date) {
        date_from.setHours(0, 0, 0, 0);
    }

    if (date_to && date_to instanceof Date) {
        date_to.setHours(0, 0, 0, 0);
    }

    let time_from = date_from instanceof Date ? date_from.getTime() : 0;
    let time_to = date_to instanceof Date ? date_to.getTime() : 0;
    if (time_from > time_to) {
        [time_from, time_to] = [time_to, time_from];
    }

    // выделение дат между начальной и конечной
    const $days = this._$months.querySelectorAll('.Day[data-time]');
    for (let i = 0; i < $days.length; ++i) {
        $days[i].classList.toggle('is-selected-between', $days[i].dataset.time > time_from && $days[i].dataset.time < time_to);
    }

    // выделение начальной и конечной позиции
    const $day_from = this._$getDayByDate(date_from);
    const $day_to = this._$getDayByDate(date_to);

    // кеш для быстрого сброса старого выделения
    if (this._rangeVisualSelect.$day_from_old && this._rangeVisualSelect.$day_from_old != $day_from) {
        this._rangeVisualSelect.$day_from_old.classList.remove('is-selected', 'is-selected-from');
    }

    // кеш для быстрого сброса старого выделения
    if (this._rangeVisualSelect.$day_to_old && this._rangeVisualSelect.$day_to_old != $day_to) {
        this._rangeVisualSelect.$day_to_old.classList.remove('is-selected', 'is-selected-to');
    }

    if ($day_from) {
        $day_from.classList.add('is-selected', 'is-selected-from');
    }

    if ($day_to) {
        $day_to.classList.add('is-selected', 'is-selected-to');
    }

    // сохранение в кеш
    this._rangeVisualSelect.$day_from_old = $day_from;
    this._rangeVisualSelect.$day_to_old = $day_to;

    this._selection.$day_from = $day_from;
    this._selection.$day_to = $day_to;

    if ($day_to) {
        const days = Math.floor(Math.abs(time_from - time_to) / 86400e3) + 1;
        this._tooltipShow($day_to, days);
    }
}

/**
 * Показ подсказки
 * @param {Element} $day Выбранный день
 * @param {Number}  days Количество дней
 */
DateRangePicker.prototype._tooltipShow = function($day, days) {
    this._$tooltipContent.textContent = this.options.filter.tooltipText.call(this, days) || '';
    this._$tooltip.classList.toggle('is-show', this._$tooltip.textContent.length);
    this._tooltipUpdate($day);
}

/**
 * Обновление позиции подсказки
 * @param {Element} $day Выбранный день
 */
DateRangePicker.prototype._tooltipUpdate = function($day) {
    let x = 0;
    let y = 0;
    let $el = $day;
    do {
        y += $el.offsetTop;
        x += $el.offsetLeft;
    } while (($el = $el.offsetParent) && $el != this._$picker);

    this._$tooltip.style.top = Math.round(y - this._$tooltip.offsetHeight) + 'px';
    this._$tooltip.style.left = Math.round(x + $day.offsetWidth / 2 - this._$tooltip.offsetWidth / 2) + 'px';
}

/**
 * Скрыть подсказку
 */
DateRangePicker.prototype._tooltipHide = function() {
    this._$tooltip.classList.remove('is-show');
}

/**
 * Текст подсказки по умолчанию
 * @param  {Number} days Количество дней
 * @return {String}
 */
DateRangePicker.prototype._filterTooltipText = function(days) {
    return this.plural(days, ['%d день', '%d дня', '%d дней']).replace('%d', days);
}

/**
 * Фильтр недоступных дней по умолчанию
 * @return {Boolean}
 */
DateRangePicker.prototype._filterLockDays = function() {
    // все дни доступны
    return false;
}

/**
 * Событие изменения размеров окна
 * @param {Event} e DOM событие
 */
DateRangePicker.prototype._onWindowResizeEvent = function(e) {
    if (this._selection.$day_to) {
        this._tooltipUpdate(this._selection.$day_to);
    }

    let breakpoint = 0;
    const breakpoints = Object.keys(this.options.breakpoints).sort((a, b) => a - b);
    for (let i in breakpoints) {
        if (window.innerWidth <= breakpoints[i]) {
            breakpoint = breakpoints[i];
            break;
        }
    }

    this._setBreakpoint(breakpoint);
}

/**
 * Установка состояния рендера под разные экраны
 * @param {Number} breakpoint Ключ из this.options.breakpoints (Ширина экрана)
 */
DateRangePicker.prototype._setBreakpoint = function(breakpoint) {
    // от ненужной перерисовки
    if (this._breakpoint == breakpoint) {
        return;
    }
    this._breakpoint = breakpoint;

    if (!this.options.breakpoints[breakpoint]) {
        return;
    }

    Object.assign(this.options, this.options.breakpoints[breakpoint]);
    this._$createMonths(this._selectedDate);
}

/**
 * Элемент календарного дня
 * @param  {Date} date Дата
 * @return {Element}   HTML элемент
 */
DateRangePicker.prototype._$getDayByDate = function(date) {
    const time = date instanceof Date ? date.getTime() : 0;
    return this._$months.querySelector('.Day[data-time="' + time + '"]');
}

/**
 * Рендер дня - заглушки
 * @return {Element}
 */
DateRangePicker.prototype._$createEmptyDay = function() {
    const $day = this._$createElement(
        `<div class="Day is-empty"></div>`
    );

    return $day;
}

/**
 * Создание элемента из HTML текста
 * @param  {String} html HTML текст
 * @return {Element}
 */
DateRangePicker.prototype._$createElement = function(html) {
    const div = document.createElement('div');
    div.insertAdjacentHTML('afterbegin', html);
    return div.children.length > 1 ? div.children : div.firstElementChild;
}

/**
 * Safe вызов внешних событий компонента
 * @param {String} f Имя события
 */
DateRangePicker.prototype._callback = function(f) {
    if (typeof this.options.on[f] == 'function') {
        return this.options.on[f].apply(this, [].slice.call(arguments, 1));
    }

    return;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DateRangePicker);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9zY3NzL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOztVQ1ZBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDTztBQUNBOztBQUVQO0FBQ0E7O0FBRUEsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGtCQUFrQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsc0JBQXNCO0FBQy9COztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxRUFBcUU7O0FBRXJFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxLQUFLO0FBQ2pCLFlBQVk7QUFDWjtBQUNBO0FBQ0EsZ0RBQWdELGNBQWM7QUFDOUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxLQUFLO0FBQ2pCLFlBQVksT0FBTztBQUNuQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLE9BQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0EsaURBQWlELGlCQUFpQjtBQUNsRSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxLQUFLO0FBQ2hCLFdBQVcsS0FBSztBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLEtBQUs7QUFDakIsWUFBWSxPQUFPO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVk7QUFDWixZQUFZO0FBQ1osWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxLQUFLO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVksTUFBTTtBQUNsQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLEtBQUs7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsS0FBSztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDhCQUE4QjtBQUNqRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsb0JBQW9CO0FBQ3ZDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxLQUFLO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5Q0FBeUMsZUFBZTtBQUN4RDtBQUNBLDZEQUE2RCw2RUFBNkU7QUFDMUk7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEMsV0FBVyxHQUFHLG1CQUFtQjtBQUM3RSw2REFBNkQsNkVBQTZFO0FBQzFJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkMsc0RBQXNELFdBQVc7QUFDakUsYUFBYSxXQUFXO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUyw4Q0FBOEM7QUFDdkQsU0FBUyw4Q0FBOEM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxLQUFLO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLEtBQUs7QUFDakIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxlQUFlLGNBQWMsY0FBYyxJQUFJLGVBQWU7QUFDckc7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxLQUFLO0FBQ2hCLFdBQVcsS0FBSztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsa0JBQWtCO0FBQ3JDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxLQUFLO0FBQ2pCLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpRUFBZSxlQUFlLEVBQUMiLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJEYXRlcmFuZ2VwaWNrZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8g0YHQvtGB0YLQvtGP0L3QuNGPINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuZXhwb3J0IGNvbnN0IExPQ0tfVU5BVkFJTEFCTEUgPSAxO1xyXG5leHBvcnQgY29uc3QgTE9DS19MT0NLRUQgICAgICA9IDI7XHJcblxyXG5jb25zdCBJTkRFWF9EQVRFX0ZST00gPSAwO1xyXG5jb25zdCBJTkRFWF9EQVRFX1RPICAgPSAxO1xyXG5cclxuZnVuY3Rpb24gRGF0ZVJhbmdlUGlja2VyKCRjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgLy8g0L7RgiDQv9C+0LLRgtC+0YDQvdC+0Lkg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40LhcclxuICAgIGlmICgkY29udGFpbmVyLmluc3RhbmNlKSB7XHJcbiAgICAgICAgcmV0dXJuICRjb250YWluZXIuaW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICAkY29udGFpbmVyLmluc3RhbmNlID0gdGhpcztcclxuXHJcbiAgICB0aGlzLl8kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgZmlyc3REYXlPZlRoZVdlZWs6IG9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgfHwgMSwgICAgICAgICAgLy8g0L/QtdGA0LLRi9C5INC00LXQvdGMINC90LXQtNC10LvQuCwgMCA9INCy0YEsIDEgPSDQv9C9LCAuLi5cclxuICAgICAgICBzaW5nbGVNb2RlOiAgICAgICAgb3B0aW9ucy5zaW5nbGVNb2RlICAgICAgICB8fCBmYWxzZSwgICAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0Ysg0LLQvNC10YHRgtC+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgIGxvY2FsZTogICAgICAgICAgICBvcHRpb25zLmxvY2FsZSAgICAgICAgICAgIHx8ICdydS1SVScsXHJcbiAgICAgICAgbWluRGF5czogICAgICAgICAgIG9wdGlvbnMubWluRGF5cyAgICAgICAgICAgfHwgMSwgICAgICAgICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuSDQsiDQtNC40LDQv9Cw0LfQvtC90LVcclxuICAgICAgICBtb250aHNDb3VudDogICAgICAgb3B0aW9ucy5tb250aHNDb3VudCAgICAgICB8fCAxMixcclxuICAgICAgICBwZXJSb3c6ICAgICAgICAgICAgb3B0aW9ucy5wZXJSb3cgICAgICAgICAgICB8fCB1bmRlZmluZWQsICAvLyDQutC+0LvQuNGH0LXRgdGC0LLQviDQvNC10YHRj9GG0LXQsiDQsiDRgNGP0LTRg1xyXG4gICAgICAgIG1pbkRhdGU6ICAgICAgICAgICBvcHRpb25zLm1pbkRhdGUgICAgICAgICAgIHx8IG5ldyBEYXRlKCksIC8vINC80LjQvdC40LzQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAgICBtYXhEYXRlOiAgICAgICAgICAgb3B0aW9ucy5tYXhEYXRlICAgICAgICAgICB8fCB1bmRlZmluZWQsXHJcbiAgICAgICAgYnJlYWtwb2ludHM6ICAgICAgIG9wdGlvbnMuYnJlYWtwb2ludHMgICAgICAgfHwge30sXHJcbiAgICAgICAgaW50ZXJuYWxJbnB1dHM6ICAgIG9wdGlvbnMuaW50ZXJuYWxJbnB1dHMgICAgfHwgdHJ1ZSwgICAgICAgLy8g0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40LUg0LLRgdGC0YDQvtC10L3QvdGL0YUg0LjQvdC/0YPRgtC+0LJcclxuICAgICAgICAvLyDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICAgIG9uOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgcmFuZ2VTZWxlY3Q6IG51bGwsIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAgICAgICAgICAgIGRheVNlbGVjdDogICBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0L7QtNC90L7QuSDQtNCw0YLRiyAo0YLQvtC70YzQutC+INC/0YDQuCBzaW5nbGVNb2RlOiB0cnVlKVxyXG4gICAgICAgIH0sIG9wdGlvbnMub24gfHwge30pLFxyXG4gICAgICAgIC8vINGE0LjQu9GM0YLRgNGD0Y7RidC40LUg0LzQtdGC0L7QtNGLXHJcbiAgICAgICAgZmlsdGVyOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgbG9ja0RheXM6ICAgIHRoaXMuX2ZpbHRlckxvY2tEYXlzLCAgICAvLyBjYWxsYmFjayhkYXRlKSDRhNGD0L3QutGG0LjRjyDQsdC70L7QutC40YDQvtCy0LDQvdC40Y8g0LTQsNGCLCB0cnVlL0xPQ0tcclxuICAgICAgICAgICAgdG9vbHRpcFRleHQ6IHRoaXMuX2ZpbHRlclRvb2x0aXBUZXh0LCAvLyBjYWxsYmFjayhkYXlzKSDQstGL0LLQvtC0INGC0LXQutGB0YLQsCDQv9C+0LTRgdC60LDQt9C60LhcclxuICAgICAgICB9LCBvcHRpb25zLmZpbHRlciB8fCB7fSksXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRj1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyDRgNGP0LTQvdC+0YHRgtGMXHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5wZXJSb3cgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMucGVyUm93ID0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5taW5EYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC+0L/RhtC40Lgg0LTQu9GPINGN0LrRgNCw0L3QvtCyINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAgICB0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbdGhpcy5fYnJlYWtwb2ludCA9IDBdID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zKTtcclxuXHJcbiAgICAvLyDRgtC10LrRg9GJ0LjQuSDQtNC10L3RjFxyXG4gICAgdGhpcy5fdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgdGhpcy5fdG9kYXkuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgdGhpcy5fJHBpY2tlciA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyXCI+XHJcbiAgICAgICAgICAgICR7dGhpcy5vcHRpb25zLmludGVybmFsSW5wdXRzID9cclxuICAgICAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX19pbnB1dHNcIj5cclxuICAgICAgICAgICAgICAgICAgICAke3RoaXMub3B0aW9ucy5zaW5nbGVNb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gYDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImRhdGVcIj5gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogYDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImRhdGVfZnJvbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkYXRlX3RvXCI+YFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDwvZGl2PmAgOiAnJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX21vbnRoc1wiPjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX190b29sdGlwXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX190b29sdGlwLWNvbnRlbnRcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyDRjdC70LXQvNC10L3RgtGLXHJcbiAgICB0aGlzLl8kbW9udGhzICAgICAgICAgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5EYXRlcmFuZ2VwaWNrZXJfX21vbnRocycpO1xyXG4gICAgdGhpcy5fJHRvb2x0aXAgICAgICAgID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX190b29sdGlwJyk7XHJcbiAgICB0aGlzLl8kdG9vbHRpcENvbnRlbnQgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5EYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXAtY29udGVudCcpO1xyXG5cclxuICAgIC8vINC/0L7Qu9GPINCy0LLQvtC00LBcclxuICAgIHRoaXMuXyRpbnB1dHMgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWVePVwiZGF0ZVwiXScpO1xyXG5cclxuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKHRoaXMub3B0aW9ucy5taW5EYXRlKTtcclxuICAgIHRoaXMuXyRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fJHBpY2tlcik7XHJcblxyXG4gICAgLy8g0L7QsdGA0LDQsdC+0YLQutCwINCx0YDQtdC50LrQv9C+0LjQvdGC0L7QslxyXG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykubGVuZ3RoKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uV2luZG93UmVzaXplRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5fb25XaW5kb3dSZXNpemVFdmVudCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0J3QsNC30LLQsNC90LjQtSDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRNb250aEZvcm1hdHRlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7bW9udGg6ICdsb25nJ30pO1xyXG4gICAgcmV0dXJuIHRpdGxlLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aXRsZS5zbGljZSgxKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0Ysg0LTQu9GPINGC0LXQutGD0YnQtdC5INC70L7QutCw0LvQuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyDQn9Cw0YDQsNC80LXRgtGA0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlVGltZUZvcm1hdCA9IGZ1bmN0aW9uKGRhdGUsIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMub3B0aW9ucy5sb2NhbGUsIG9wdGlvbnMpLmZvcm1hdChkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCU0L3QuCDQvdC10LTQtdC70LhcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0V2Vla0RheXNGb3JtYXR0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gMik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7ICsraSkge1xyXG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgZGF5OiBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7d2Vla2RheTogJ3Nob3J0J30pLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINGB0L7Qs9C70LDRgdC90L4g0L3QsNGB0YLRgNC+0LXQvdC90L7QvNGDINC/0LXRgNCy0L7QvNGDINC00L3RjiDQvdC10LTQtdC70LhcclxuICAgIHJlc3VsdC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmlyc3REYXlPZlRoZVdlZWsgPSB0aGlzLm9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgJSA3O1xyXG4gICAgICAgIGxldCBkYXlBID0gYS5kYXk7XHJcbiAgICAgICAgbGV0IGRheUIgPSBiLmRheTtcclxuXHJcbiAgICAgICAgaWYgKGRheUEgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUIgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QSA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIGRheUEgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlCIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgZGF5QiArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRheUEgLSBkYXlCO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC80LXRgdGP0YbQtVxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9ICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERheXNDb3VudEluTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRheXMuc2V0TW9udGgoZGF5cy5nZXRNb250aCgpICsgMSk7XHJcbiAgICBkYXlzLnNldERhdGUoMCk7XHJcbiAgICByZXR1cm4gZGF5cy5nZXREYXRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFJlc2V0KCk7XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24gPSB7fTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQtNC10LvQtdC90LjQtSDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnJhbmdlU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZShkYXRlX2Zyb20sIGRhdGVfdG8pKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0ICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcblxyXG4gICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LIg0L7QsdGA0LDRgtC90L7QvCDQv9C+0YDRj9C00LrQtVxyXG4gICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC+0LHQvdC+0LLQu9C10L3QuNC1INC40L3Qv9GD0YLQvtCyXHJcbiAgICBpZiAodGhpcy5fJGlucHV0c1tJTkRFWF9EQVRFX0ZST01dKSB7XHJcbiAgICAgICAgdGhpcy5fJGlucHV0c1tJTkRFWF9EQVRFX0ZST01dLnZhbHVlID0gdGhpcy5mb3JtYXREYXRlKGRhdGVfZnJvbSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9UT10pIHtcclxuICAgICAgICB0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfVE9dLnZhbHVlID0gdGhpcy5mb3JtYXREYXRlKGRhdGVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7QsdGL0YLQuNC1XHJcbiAgICB0aGlzLl9jYWxsYmFjaygncmFuZ2VTZWxlY3QnLCBkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG59XHJcblxyXG4vKipcclxuICog0KTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90LjQtSDQtNCw0YLRi1xyXG4gKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHBhcmFtICB7U3RyaW5nfSBmb3JtYXQg0KTQvtGA0LzQsNGCINGB0YLRgNC+0LrQuFxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmZvcm1hdERhdGUgPSBmdW5jdGlvbihkYXRlLCBmb3JtYXQgPSAnWS1tLWQnKSB7XHJcbiAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UoJ1knLCBkYXRlLmdldEZ1bGxZZWFyKCkpXHJcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ20nLCAoJzAnICsgKGRhdGUuZ2V0TW9udGgoKSArIDEpKS5zbGljZSgtMikpXHJcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ2QnLCAoJzAnICsgKGRhdGUuZ2V0RGF0ZSgpKSkuc2xpY2UoLTIpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0YDQvtCy0LXRgNC60LAg0LLQvtC30LzQvtC20L3QvtGB0YLQuCDQstGL0LTQtdC70LXQvdC40Y8g0LTQsNGCXHJcbiAqIEBwYXJhbSAge0RhdGUgZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0gIHtEYXRlIGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldElzUmFuZ2VTZWxlY3RhYmxlID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3Ri9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhkYXRlX2Zyb20uZ2V0VGltZSgpIC0gZGF0ZV90by5nZXRUaW1lKCkpIC8gMTAwMCAvIDg2NDAwO1xyXG4gICAgaWYgKGRpZmYgPCB0aGlzLm9wdGlvbnMubWluRGF5cykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9GA0L7QstC10YDQutCwINC/0L7Qv9Cw0LTQsNC90LjRjyDQsiDQtNC40LDQv9Cw0LfQvtC9INC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKCk7XHJcbiAgICBkYXkuc2V0VGltZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuXHJcbiAgICB3aGlsZSAoZGF5IDwgZGF0ZV90bykge1xyXG4gICAgICAgIGlmICh0aGlzLmdldERheUxvY2tlZChkYXkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRheS5zZXREYXRlKGRheS5nZXREYXRlKCkgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0YDQvtCy0LXRgNC60LAg0L3QsCDQtNC+0YHRgtGD0L/QvdC+0YHRgtGMINC00L3RjyDQtNC70Y8g0LHRgNC+0L3QuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgdHJ1ZSDQtdGB0LvQuCDQtNC+0YHRgtGD0L/QtdC9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERheUxvY2tlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCy0L3QtSDQtNC+0YHRgtGD0L/QvdC+0LPQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUgfHwgZGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIExPQ0tfVU5BVkFJTEFCTEU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIubG9ja0RheXMuY2FsbCh0aGlzLCBkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQsdGA0LDQvdC90LDRjyDQvdCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHJldHVybiB7RGF0ZX0g0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZUZyb20gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9nZXREYXRlRnJvbUlucHV0KElOREVYX0RBVEVfRlJPTSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktGL0LHRgNCw0L3QvdCw0Y8g0LTQsNGC0LAgKHNpbmdsZU1vZGU6IHRydWUpXHJcbiAqIEByZXR1cm4ge0RhdGV9INCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGUgPSBEYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGVGcm9tO1xyXG5cclxuLyoqXHJcbiAqINCS0YvQsdGA0LDQvdC90LDRjyDQutC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqIEByZXR1cm4ge0RhdGV9INCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGVUbyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2dldERhdGVGcm9tSW5wdXQoSU5ERVhfREFURV9UTyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60LvQvtC90LXQvdC40LUgKDEg0LHQvtCx0ZHRgCwgMiDQsdC+0LHRgNCwLCA1INCx0L7QsdGA0L7QsilcclxuICogQHBhcmFtICB7TnVtYmVyfSB2YWx1ZSDQmtC+0LvQuNGH0LXRgdGC0LLQvlxyXG4gKiBAcGFyYW0gIHtBcnJheX0gIGZvcm1zINCc0LDRgdGB0LjQsiDQuNC3IDPRhSDRjdC70LXQvNC10L3RgtC+0LIsINC80L7QttC10YIg0YHQvtC00LXRgNC20LDRgtGMINGB0L/QtdGG0LjRhNC40LrQsNGC0L7RgCAlZCDQtNC70Y8g0LfQsNC80LXQvdGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucGx1cmFsID0gZnVuY3Rpb24gKHZhbHVlLCBmb3Jtcykge1xyXG4gICAgcmV0dXJuICh2YWx1ZSAlIDEwID09IDEgJiYgdmFsdWUgJSAxMDAgIT0gMTEgPyBmb3Jtc1swXSA6ICh2YWx1ZSAlIDEwID49IDIgJiYgdmFsdWUgJSAxMCA8PSA0ICYmICh2YWx1ZSAlIDEwMCA8IDEwIHx8IHZhbHVlICUgMTAwID49IDIwKSA/IGZvcm1zWzFdIDogZm9ybXNbMl0pKS5yZXBsYWNlKCclZCcsIHZhbHVlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQsdGA0LDQvdC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGluZGV4INCY0L3QtNC10LrRgSDQuNC90L/Rg9GC0LBcclxuICogQHJldHVybiB7RGF0ZX0gICAgICAgICDQlNCw0YLQsCDQuNC70LggdW5kZWZpbmVkXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9nZXREYXRlRnJvbUlucHV0ID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgIHJldHVybiB0aGlzLl8kaW5wdXRzW2luZGV4XSA/IG5ldyBEYXRlKHRoaXMuXyRpbnB1dHNbaW5kZXhdLnZhbHVlKSA6IHVuZGVmaW5lZDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC40LDQv9Cw0LfQvtC90LAg0LzQtdGB0Y/RhtC10LJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlTW9udGhzID0gZnVuY3Rpb24oZGF0ZV9mcm9tKSB7XHJcbiAgICB3aGlsZSAodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5yZW1vdmVDaGlsZCh0aGlzLl8kbW9udGhzLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgIHRoaXMuX3Rvb2x0aXBIaWRlKCk7XHJcblxyXG4gICAgLy8g0L/RgNC10YDQtdC90LTQtdGAINC80LXRgdGP0YbQtdCyXHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG4gICAgY29uc3QgJG1vbnRocyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7ICsraSkge1xyXG4gICAgICAgICRtb250aHMucHVzaCh0aGlzLl8kY3JlYXRlTW9udGgoY3VycmVudERhdGUpKTtcclxuICAgICAgICBjdXJyZW50RGF0ZS5zZXRNb250aChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRtb250aHMubGVuZ3RoOyBpICs9IHRoaXMub3B0aW9ucy5wZXJSb3cpIHtcclxuICAgICAgICBjb25zdCAkcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnRGF0ZXJhbmdlcGlja2VyX19yb3cnO1xyXG5cclxuICAgICAgICAkbW9udGhzLnNsaWNlKGksIGkgKyB0aGlzLm9wdGlvbnMucGVyUm93KS5mb3JFYWNoKCRtb250aCA9PiB7XHJcbiAgICAgICAgICAgICRyb3cuYXBwZW5kQ2hpbGQoJG1vbnRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5hcHBlbmRDaGlsZCgkcm93KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCc0LXRgdGP0YZcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVNb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IG1vbnRoVGl0bGUgPSB0aGlzLmdldE1vbnRoRm9ybWF0dGVkKGRhdGUpO1xyXG4gICAgY29uc3Qgd2Vla0RheXMgPSB0aGlzLmdldFdlZWtEYXlzRm9ybWF0dGVkKCk7XHJcblxyXG4gICAgY29uc3QgJG1vbnRoID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJNb250aFwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9faGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tcHJldiR7KHRoaXMub3B0aW9ucy5taW5EYXRlICYmIGRhdGUgPD0gdGhpcy5vcHRpb25zLm1pbkRhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNyAxM0wxIDdMNyAxXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fdGl0bGVcIj4ke21vbnRoVGl0bGV9ICR7ZGF0ZS5nZXRGdWxsWWVhcigpfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLW5leHQkeyh0aGlzLm9wdGlvbnMubWF4RGF0ZSAmJiBkYXRlID49IHRoaXMub3B0aW9ucy5tYXhEYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEgMC45OTk5OTlMNyA3TDEgMTNcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrXCI+JHt3ZWVrRGF5cy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla2RheVwiPiR7aXRlbS50aXRsZX08L2Rpdj5gXHJcbiAgICAgICAgICAgIH0pLmpvaW4oJycpfTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2RheXNcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGB0YLRgNC10LvQutC4XHJcbiAgICBbXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tcHJldicsIG5hbWU6ICdwcmV2J30sXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tbmV4dCcsIG5hbWU6ICduZXh0J30sXHJcbiAgICBdLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgY29uc3QgJGFycm93ID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoaXRlbS5zZWxlY3Rvcik7XHJcbiAgICAgICAgJGFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgIC8vINCy0YDQtdC80LXQvdC90LDRjyDQvNC10YDQsCwg0LvRg9GH0YjQtSDQv9C10YDQtdCy0LXRgNGB0YLQsNGC0YwsINCy0YvQvdC10YHRgtC4INGB0YLRgNC10LvQutC4INC30LAg0L/RgNC10LTQtdC70Ysg0L/QtdGA0LXRgNC10YDQuNGB0L7QstGL0LLQsNC10LzQvtC5INC+0LHQu9Cw0YHRgtC4INC/0LjQutC10YDQsFxyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fb25BcnJvd0NsaWNrKCRhcnJvdywgaXRlbS5uYW1lKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vINGA0LXQvdC00LXRgCDQtNC90LXQuVxyXG4gICAgY29uc3QgJGRheXMgPSAkbW9udGgucXVlcnlTZWxlY3RvcignLk1vbnRoX19kYXlzJyk7XHJcbiAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgZGF5cy5zZXREYXRlKDEpO1xyXG4gICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICB3aGlsZSAoZGF5cy5nZXRNb250aCgpID09IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZVdlZWsoKTtcclxuXHJcbiAgICAgICAgd2Vla0RheXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgaWYgKGRheXMuZ2V0RGF5KCkgIT0gaXRlbS5kYXkgfHwgZGF5cy5nZXRNb250aCgpICE9IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZUVtcHR5RGF5KCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRGF5KGRheXMpKTtcclxuICAgICAgICAgICAgZGF5cy5zZXREYXRlKGRheXMuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRkYXlzLmFwcGVuZENoaWxkKCR3ZWVrKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJG1vbnRoO1xyXG59XHJcblxyXG4vKipcclxuICog0JrQu9C40Log0L/QviDRgdGC0YDQtdC70LrQtSDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y8g0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGFycm93IEhUTUwg0Y3Qu9C10LzQtdC90YJcclxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgICAg0JjQvNGPIChwcmV2LCBuZXh0KVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25BcnJvd0NsaWNrID0gZnVuY3Rpb24oJGFycm93LCBuYW1lKSB7XHJcbiAgICBpZiAoJGFycm93LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUocGFyc2VJbnQodGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuTW9udGgnKS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIChuYW1lID09ICdwcmV2JyA/IC10aGlzLm9wdGlvbnMubW9udGhzQ291bnQgOiB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpKTtcclxuXHJcbiAgICAvLyDQstGL0YXQvtC0INC30LAg0L/RgNC10LTQtdC70Ysg0LzQuNC90LjQvNCw0LvRjNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKGRhdGUgPCB0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWluRGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGVuZERhdGUgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgZW5kRGF0ZS5zZXRNb250aChlbmREYXRlLmdldE1vbnRoKCkgKyB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpO1xyXG4gICAgICAgIGlmIChlbmREYXRlID4gdGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICAgICAgZGF0ZS5zZXRUaW1lKHRoaXMub3B0aW9ucy5tYXhEYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpIC0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50ICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0LXRgNC10YXQvtC0INC6INC90L7QstC+0Lkg0LTQsNGC0LVcclxuICAgIHRoaXMuX3NlbGVjdERhdGUoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10Lkg0LTQsNGC0Ysg0YEg0YDQtdC90LTQtdGA0L7QvFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3NlbGVjdERhdGUgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICB0aGlzLl9zZWxlY3RlZERhdGUgPSBkYXRlO1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRocyhkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQvdC10LTQtdC70LhcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVXZWVrID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIldlZWtcIj48L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkd2VlaztcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC90Y9cclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVEYXkgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXlcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiIGRhdGEtZGF5PVwiJHtkYXRlLmdldERheSgpfVwiPiR7ZGF0ZS5nZXREYXRlKCl9PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25EYXlDbGlja0V2ZW50LmJpbmQodGhpcykpO1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLl9vbkRheU1vdXNlRW50ZXJFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICAgIHRoaXMuX3VwZGF0ZURheSgkZGF5KTtcclxuXHJcbiAgICByZXR1cm4gJGRheTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLk1vbnRoJykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZU1vbnRoKCRtb250aCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuSDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtFbGVtZW50fSAkbW9udGgg0K3Qu9C10LzQtdC90YIg0LzQtdGB0Y/RhtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl91cGRhdGVNb250aCA9IGZ1bmN0aW9uKCRtb250aCkge1xyXG4gICAgJG1vbnRoLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpLmZvckVhY2goJGRheSA9PiB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlRGF5KCRkYXkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Lkg0LTQvdGPXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQrdC70LXQvNC10L3RgiDQtNC90Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3VwZGF0ZURheSA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGNvbnN0IGRhdGUgICA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgY29uc3QgbG9ja2VkID0gdGhpcy5nZXREYXlMb2NrZWQoZGF0ZSk7XHJcbiAgICBjb25zdCB0b2RheSAgPSB0aGlzLl90b2RheS5nZXRUaW1lKCkgPT0gZGF0ZS5nZXRUaW1lKCk7XHJcblxyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1kaXNhYmxlZCcsIGxvY2tlZCk7XHJcbiAgICAkZGF5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLWxvY2tlZCcsIGxvY2tlZCA9PSBMT0NLX0xPQ0tFRCk7XHJcbiAgICAkZGF5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLXRvZGF5JywgdG9kYXkpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0LrQu9C40LrQsCDQv9C+INC00L3RjlxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlDbGlja0V2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdGhpcy5fb25EYXlDbGljayhlLnRhcmdldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDRhdC+0LLQtdGA0LBcclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5TW91c2VFbnRlckV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdGhpcy5fb25EYXlNb3VzZUVudGVyKGUudGFyZ2V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCl0L7QstC10YAg0L3QsCDRjdC70LXQvNC10L3RgtC1INC00L3Rj1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlNb3VzZUVudGVyID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5LmRhdGFzZXQudGltZSA9PSB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLmdldFRpbWUoKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRlX3RvID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0LvQuNC6INC/0L4g0LTQvdGOXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheUNsaWNrID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgLy8g0LTQtdC90Ywg0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC9XHJcbiAgICBpZiAoJGRheS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2soJ2RheVNlbGVjdCcsIG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQsdGA0L7RgSDQstGL0LHRgNCw0L3QvdC+0LPQviDRgNCw0L3QtdC1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcblxyXG4gICAgLy8g0LLRi9Cx0YDQsNC90LAg0L3QsNGH0LDQu9GM0L3QsNGPIC8g0LrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZSh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykpIHtcclxuICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmFuZ2VTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0JLQuNC30YPQsNC70YzQvdGL0Lkg0YHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3JhbmdlVmlzdWFsUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgICRkYXlzLmZvckVhY2goJGRheSA9PiB7XHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJywgJ2lzLXNlbGVjdGVkLXRvJywgJ2lzLXNlbGVjdGVkLWJldHdlZW4nKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgIHRoaXMuX3Rvb2x0aXBIaWRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktC40LfRg9Cw0LvRjNC90L7QtSDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgaWYgKGRhdGVfZnJvbSAmJiBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRlX3RvICYmIGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdGltZV9mcm9tID0gZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVfZnJvbS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgbGV0IHRpbWVfdG8gPSBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVfdG8uZ2V0VGltZSgpIDogMDtcclxuICAgIGlmICh0aW1lX2Zyb20gPiB0aW1lX3RvKSB7XHJcbiAgICAgICAgW3RpbWVfZnJvbSwgdGltZV90b10gPSBbdGltZV90bywgdGltZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCINC80LXQttC00YMg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0LlcclxuICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGRheXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAkZGF5c1tpXS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zZWxlY3RlZC1iZXR3ZWVuJywgJGRheXNbaV0uZGF0YXNldC50aW1lID4gdGltZV9mcm9tICYmICRkYXlzW2ldLmRhdGFzZXQudGltZSA8IHRpbWVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDQvdCw0YfQsNC70YzQvdC+0Lkg0Lgg0LrQvtC90LXRh9C90L7QuSDQv9C+0LfQuNGG0LjQuFxyXG4gICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgIT0gJGRheV9mcm9tKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAhPSAkZGF5X3RvKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0YXRgNCw0L3QtdC90LjQtSDQsiDQutC10YhcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCA9ICRkYXlfdG87XHJcblxyXG4gICAgdGhpcy5fc2VsZWN0aW9uLiRkYXlfZnJvbSA9ICRkYXlfZnJvbTtcclxuICAgIHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvID0gJGRheV90bztcclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgIGNvbnN0IGRheXMgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRpbWVfZnJvbSAtIHRpbWVfdG8pIC8gODY0MDBlMykgKyAxO1xyXG4gICAgICAgIHRoaXMuX3Rvb2x0aXBTaG93KCRkYXlfdG8sIGRheXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0J/QvtC60LDQtyDQv9C+0LTRgdC60LDQt9C60LhcclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5INCS0YvQsdGA0LDQvdC90YvQuSDQtNC10L3RjFxyXG4gKiBAcGFyYW0ge051bWJlcn0gIGRheXMg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3Rvb2x0aXBTaG93ID0gZnVuY3Rpb24oJGRheSwgZGF5cykge1xyXG4gICAgdGhpcy5fJHRvb2x0aXBDb250ZW50LnRleHRDb250ZW50ID0gdGhpcy5vcHRpb25zLmZpbHRlci50b29sdGlwVGV4dC5jYWxsKHRoaXMsIGRheXMpIHx8ICcnO1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2hvdycsIHRoaXMuXyR0b29sdGlwLnRleHRDb250ZW50Lmxlbmd0aCk7XHJcbiAgICB0aGlzLl90b29sdGlwVXBkYXRlKCRkYXkpO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0L/QvtC30LjRhtC40Lgg0L/QvtC00YHQutCw0LfQutC4XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQktGL0LHRgNCw0L3QvdGL0Lkg0LTQtdC90YxcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3Rvb2x0aXBVcGRhdGUgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBsZXQgeCA9IDA7XHJcbiAgICBsZXQgeSA9IDA7XHJcbiAgICBsZXQgJGVsID0gJGRheTtcclxuICAgIGRvIHtcclxuICAgICAgICB5ICs9ICRlbC5vZmZzZXRUb3A7XHJcbiAgICAgICAgeCArPSAkZWwub2Zmc2V0TGVmdDtcclxuICAgIH0gd2hpbGUgKCgkZWwgPSAkZWwub2Zmc2V0UGFyZW50KSAmJiAkZWwgIT0gdGhpcy5fJHBpY2tlcik7XHJcblxyXG4gICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUudG9wID0gTWF0aC5yb3VuZCh5IC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSArICdweCc7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5zdHlsZS5sZWZ0ID0gTWF0aC5yb3VuZCh4ICsgJGRheS5vZmZzZXRXaWR0aCAvIDIgLSB0aGlzLl8kdG9vbHRpcC5vZmZzZXRXaWR0aCAvIDIpICsgJ3B4JztcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0LrRgNGL0YLRjCDQv9C+0LTRgdC60LDQt9C60YNcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3Rvb2x0aXBIaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zaG93Jyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQotC10LrRgdGCINC/0L7QtNGB0LrQsNC30LrQuCDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRheXMg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fZmlsdGVyVG9vbHRpcFRleHQgPSBmdW5jdGlvbihkYXlzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wbHVyYWwoZGF5cywgWyclZCDQtNC10L3RjCcsICclZCDQtNC90Y8nLCAnJWQg0LTQvdC10LknXSkucmVwbGFjZSgnJWQnLCBkYXlzKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0LjQu9GM0YLRgCDQvdC10LTQvtGB0YLRg9C/0L3Ri9GFINC00L3QtdC5INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9maWx0ZXJMb2NrRGF5cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0LLRgdC1INC00L3QuCDQtNC+0YHRgtGD0L/QvdGLXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDQuNC30LzQtdC90LXQvdC40Y8g0YDQsNC30LzQtdGA0L7QsiDQvtC60L3QsFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25XaW5kb3dSZXNpemVFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uJGRheV90bykge1xyXG4gICAgICAgIHRoaXMuX3Rvb2x0aXBVcGRhdGUodGhpcy5fc2VsZWN0aW9uLiRkYXlfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBicmVha3BvaW50ID0gMDtcclxuICAgIGNvbnN0IGJyZWFrcG9pbnRzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzKS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XHJcbiAgICBmb3IgKGxldCBpIGluIGJyZWFrcG9pbnRzKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IGJyZWFrcG9pbnRzW2ldKSB7XHJcbiAgICAgICAgICAgIGJyZWFrcG9pbnQgPSBicmVha3BvaW50c1tpXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3NldEJyZWFrcG9pbnQoYnJlYWtwb2ludCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9GB0YLQsNC90L7QstC60LAg0YHQvtGB0YLQvtGP0L3QuNGPINGA0LXQvdC00LXRgNCwINC/0L7QtCDRgNCw0LfQvdGL0LUg0Y3QutGA0LDQvdGLXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBicmVha3BvaW50INCa0LvRjtGHINC40LcgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzICjQqNC40YDQuNC90LAg0Y3QutGA0LDQvdCwKVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fc2V0QnJlYWtwb2ludCA9IGZ1bmN0aW9uKGJyZWFrcG9pbnQpIHtcclxuICAgIC8vINC+0YIg0L3QtdC90YPQttC90L7QuSDQv9C10YDQtdGA0LjRgdC+0LLQutC4XHJcbiAgICBpZiAodGhpcy5fYnJlYWtwb2ludCA9PSBicmVha3BvaW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fYnJlYWtwb2ludCA9IGJyZWFrcG9pbnQ7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9ucy5icmVha3BvaW50c1ticmVha3BvaW50XSk7XHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGhzKHRoaXMuX3NlbGVjdGVkRGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQrdC70LXQvNC10L3RgiDQutCw0LvQtdC90LTQsNGA0L3QvtCz0L4g0LTQvdGPXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICogQHJldHVybiB7RWxlbWVudH0gICBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kZ2V0RGF5QnlEYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgdGltZSA9IGRhdGUgaW5zdGFuY2VvZiBEYXRlID8gZGF0ZS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgcmV0dXJuIHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLkRheVtkYXRhLXRpbWU9XCInICsgdGltZSArICdcIl0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC90Y8gLSDQt9Cw0LPQu9GD0YjQutC4XHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRW1wdHlEYXkgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRheSBpcy1lbXB0eVwiPjwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuICRkYXk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LfQtNCw0L3QuNC1INGN0LvQtdC80LXQvdGC0LAg0LjQtyBIVE1MINGC0LXQutGB0YLQsFxyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGh0bWwgSFRNTCDRgtC10LrRgdGCXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGh0bWwpIHtcclxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZGl2Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGh0bWwpO1xyXG4gICAgcmV0dXJuIGRpdi5jaGlsZHJlbi5sZW5ndGggPiAxID8gZGl2LmNoaWxkcmVuIDogZGl2LmZpcnN0RWxlbWVudENoaWxkO1xyXG59XHJcblxyXG4vKipcclxuICogU2FmZSDQstGL0LfQvtCyINCy0L3QtdGI0L3QuNGFINGB0L7QsdGL0YLQuNC5INC60L7QvNC/0L7QvdC10L3RgtCwXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmINCY0LzRjyDRgdC+0LHRi9GC0LjRj1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fY2FsbGJhY2sgPSBmdW5jdGlvbihmKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbltmXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vbltmXS5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGF0ZVJhbmdlUGlja2VyO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
/*!****************************!*\
  !*** ./src/demo/page.scss ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************!*\
  !*** ./src/demo/page.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../dist/daterangepicker */ "./dist/daterangepicker.js");
/* harmony import */ var _dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0__);


const $form = document.forms[0];
const $date_from = $form.querySelector('[name="date_from"]');
const $date_to   = $form.querySelector('[name="date_to"]');

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

new (_dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0___default())(document.querySelector('#daterangepicker'), {
    minDate: new Date(),
    maxDate: new Date('2022-05-20'),
    monthsCount: 2,
    perRow: 3,
    singleMode: false,
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
            $date_from.value = date_from.toLocaleDateString();
            $date_to.value = date_to.toLocaleDateString();
        },
        daySelect: function(date_from) {
            $date_from.value = date_from.toLocaleDateString();
        },
    },
    filter: {
        lockDays: function(date) {
            if (blockedDates[date]) {
                return _dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0__.LOCK_LOCKED;
            }

            return false;
        },
        tooltipText: function(days) {
            const nights = days - 1;
            return this.plural(nights, ['%d ночь', '%d ночи', '%d ночей']).replace('%d', nights);
        }
    }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9kaXN0L2RhdGVyYW5nZXBpY2tlci5qcyIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2RlbW8vcGFnZS5zY3NzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9kZW1vL3BhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJLElBQXlEO0FBQzdEO0FBQ0EsTUFBTSxFQUtnQztBQUN0QyxDQUFDO0FBQ0Qsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQSxjQUFjLDhCQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxnQkFBZ0IsOEJBQW1CLHdCQUF3Qiw4QkFBbUI7QUFDOUUsbURBQW1ELHlDQUF5QztBQUM1RjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxpRUFBaUUsa0JBQWtCO0FBQ25GO0FBQ0EsMERBQTBELGNBQWM7QUFDeEU7QUFDQSxXQUFXO0FBQ1g7QUFD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QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLDhEQUFXO0FBQ2xDOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6Ii4vZGVtby9wYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJEYXRlcmFuZ2VwaWNrZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovICgoKSA9PiB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0XCJ1c2Ugc3RyaWN0XCI7XG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIHNjb3BlXG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG4vKioqKioqLyBcdFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG4vKioqKioqLyBcdFx0XHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG4vKioqKioqLyBcdFx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuLyoqKioqKi8gXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG4vKioqKioqLyBcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSlcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcbi8qKioqKiovIFx0XHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuLyoqKioqKi8gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbi8vIFRoaXMgZW50cnkgbmVlZCB0byBiZSB3cmFwcGVkIGluIGFuIElJRkUgYmVjYXVzZSBpdCBuZWVkIHRvIGJlIGlzb2xhdGVkIGFnYWluc3Qgb3RoZXIgZW50cnkgbW9kdWxlcy5cbigoKSA9PiB7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvc2Nzcy9pbmRleC5zY3NzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuXG59KSgpO1xuXG4vLyBUaGlzIGVudHJ5IG5lZWQgdG8gYmUgd3JhcHBlZCBpbiBhbiBJSUZFIGJlY2F1c2UgaXQgbmVlZCB0byBiZSBpc29sYXRlZCBhZ2FpbnN0IG90aGVyIGVudHJ5IG1vZHVsZXMuXG4oKCkgPT4ge1xuLyohKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9qcy9pbmRleC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKi9cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0ICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCB7XG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiTE9DS19VTkFWQUlMQUJMRVwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBMT0NLX1VOQVZBSUxBQkxFKSxcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJMT0NLX0xPQ0tFRFwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBMT0NLX0xPQ0tFRCksXG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiZGVmYXVsdFwiOiAoKSA9PiAoX19XRUJQQUNLX0RFRkFVTFRfRVhQT1JUX18pXG4vKiBoYXJtb255IGV4cG9ydCAqLyB9KTtcbi8vINGB0L7RgdGC0L7Rj9C90LjRjyDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbmNvbnN0IExPQ0tfVU5BVkFJTEFCTEUgPSAxO1xyXG5jb25zdCBMT0NLX0xPQ0tFRCAgICAgID0gMjtcclxuXHJcbmNvbnN0IElOREVYX0RBVEVfRlJPTSA9IDA7XHJcbmNvbnN0IElOREVYX0RBVEVfVE8gICA9IDE7XHJcblxyXG5mdW5jdGlvbiBEYXRlUmFuZ2VQaWNrZXIoJGNvbnRhaW5lciwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICAvLyDQvtGCINC/0L7QstGC0L7RgNC90L7QuSDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuFxyXG4gICAgaWYgKCRjb250YWluZXIuaW5zdGFuY2UpIHtcclxuICAgICAgICByZXR1cm4gJGNvbnRhaW5lci5pbnN0YW5jZTtcclxuICAgIH1cclxuICAgICRjb250YWluZXIuaW5zdGFuY2UgPSB0aGlzO1xyXG5cclxuICAgIHRoaXMuXyRjb250YWluZXIgPSAkY29udGFpbmVyO1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IHtcclxuICAgICAgICBmaXJzdERheU9mVGhlV2Vlazogb3B0aW9ucy5maXJzdERheU9mVGhlV2VlayB8fCAxLCAgICAgICAgICAvLyDQv9C10YDQstGL0Lkg0LTQtdC90Ywg0L3QtdC00LXQu9C4LCAwID0g0LLRgSwgMSA9INC/0L0sIC4uLlxyXG4gICAgICAgIHNpbmdsZU1vZGU6ICAgICAgICBvcHRpb25zLnNpbmdsZU1vZGUgICAgICAgIHx8IGZhbHNlLCAgICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRiyDQstC80LXRgdGC0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICAgICAgbG9jYWxlOiAgICAgICAgICAgIG9wdGlvbnMubG9jYWxlICAgICAgICAgICAgfHwgJ3J1LVJVJyxcclxuICAgICAgICBtaW5EYXlzOiAgICAgICAgICAgb3B0aW9ucy5taW5EYXlzICAgICAgICAgICB8fCAxLCAgICAgICAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC00LjQsNC/0LDQt9C+0L3QtVxyXG4gICAgICAgIG1vbnRoc0NvdW50OiAgICAgICBvcHRpb25zLm1vbnRoc0NvdW50ICAgICAgIHx8IDEyLFxyXG4gICAgICAgIHBlclJvdzogICAgICAgICAgICBvcHRpb25zLnBlclJvdyAgICAgICAgICAgIHx8IHVuZGVmaW5lZCwgIC8vINC60L7Qu9C40YfQtdGB0YLQstC+INC80LXRgdGP0YbQtdCyINCyINGA0Y/QtNGDXHJcbiAgICAgICAgbWluRGF0ZTogICAgICAgICAgIG9wdGlvbnMubWluRGF0ZSAgICAgICAgICAgfHwgbmV3IERhdGUoKSwgLy8g0LzQuNC90LjQvNCw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICAgIG1heERhdGU6ICAgICAgICAgICBvcHRpb25zLm1heERhdGUgICAgICAgICAgIHx8IHVuZGVmaW5lZCxcclxuICAgICAgICBicmVha3BvaW50czogICAgICAgb3B0aW9ucy5icmVha3BvaW50cyAgICAgICB8fCB7fSxcclxuICAgICAgICBpbnRlcm5hbElucHV0czogICAgb3B0aW9ucy5pbnRlcm5hbElucHV0cyAgICB8fCB0cnVlLCAgICAgICAvLyDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjQtSDQstGB0YLRgNC+0LXQvdC90YvRhSDQuNC90L/Rg9GC0L7QslxyXG4gICAgICAgIC8vINGB0L7QsdGL0YLQuNGPXHJcbiAgICAgICAgb246IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICByYW5nZVNlbGVjdDogbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICAgICAgICAgICAgZGF5U2VsZWN0OiAgIG51bGwsIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQvtC00L3QvtC5INC00LDRgtGLICjRgtC+0LvRjNC60L4g0L/RgNC4IHNpbmdsZU1vZGU6IHRydWUpXHJcbiAgICAgICAgfSwgb3B0aW9ucy5vbiB8fCB7fSksXHJcbiAgICAgICAgLy8g0YTQuNC70YzRgtGA0YPRjtGJ0LjQtSDQvNC10YLQvtC00YtcclxuICAgICAgICBmaWx0ZXI6IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICBsb2NrRGF5czogICAgdGhpcy5fZmlsdGVyTG9ja0RheXMsICAgIC8vIGNhbGxiYWNrKGRhdGUpINGE0YPQvdC60YbQuNGPINCx0LvQvtC60LjRgNC+0LLQsNC90LjRjyDQtNCw0YIsIHRydWUvTE9DS1xyXG4gICAgICAgICAgICB0b29sdGlwVGV4dDogdGhpcy5fZmlsdGVyVG9vbHRpcFRleHQsIC8vIGNhbGxiYWNrKGRheXMpINCy0YvQstC+0LQg0YLQtdC60YHRgtCwINC/0L7QtNGB0LrQsNC30LrQuFxyXG4gICAgICAgIH0sIG9wdGlvbnMuZmlsdGVyIHx8IHt9KSxcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXQoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINGA0Y/QtNC90L7RgdGC0YxcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnBlclJvdyA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5wZXJSb3cgPSB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5taW5EYXRlKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm1pbkRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7Qv9GG0LjQuCDQtNC70Y8g0Y3QutGA0LDQvdC+0LIg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICAgIHRoaXMub3B0aW9ucy5icmVha3BvaW50c1t0aGlzLl9icmVha3BvaW50ID0gMF0gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuICAgIC8vINGC0LXQutGD0YnQuNC5INC00LXQvdGMXHJcbiAgICB0aGlzLl90b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICB0aGlzLl90b2RheS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICB0aGlzLl8kcGlja2VyID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJcIj5cclxuICAgICAgICAgICAgJHt0aGlzLm9wdGlvbnMuaW50ZXJuYWxJbnB1dHMgP1xyXG4gICAgICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX2lucHV0c1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICR7dGhpcy5vcHRpb25zLnNpbmdsZU1vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyBgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZVwiPmBcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV9mcm9tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImRhdGVfdG9cIj5gXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+YCA6ICcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXBcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXAtY29udGVudFwiPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGN0LvQtdC80LXQvdGC0YtcclxuICAgIHRoaXMuXyRtb250aHMgICAgICAgICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzJyk7XHJcbiAgICB0aGlzLl8kdG9vbHRpcCAgICAgICAgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5EYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXAnKTtcclxuICAgIHRoaXMuXyR0b29sdGlwQ29udGVudCA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcC1jb250ZW50Jyk7XHJcblxyXG4gICAgLy8g0L/QvtC70Y8g0LLQstC+0LTQsFxyXG4gICAgdGhpcy5fJGlucHV0cyA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZV49XCJkYXRlXCJdJyk7XHJcblxyXG4gICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YBcclxuICAgIHRoaXMuX3NlbGVjdERhdGUodGhpcy5vcHRpb25zLm1pbkRhdGUpO1xyXG4gICAgdGhpcy5fJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl8kcGlja2VyKTtcclxuXHJcbiAgICAvLyDQvtCx0YDQsNCx0L7RgtC60LAg0LHRgNC10LnQutC/0L7QuNC90YLQvtCyXHJcbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzKS5sZW5ndGgpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fb25XaW5kb3dSZXNpemVFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLl9vbldpbmRvd1Jlc2l6ZUV2ZW50KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQndCw0LfQstCw0L3QuNC1INC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldE1vbnRoRm9ybWF0dGVkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgdGl0bGUgPSB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHttb250aDogJ2xvbmcnfSk7XHJcbiAgICByZXR1cm4gdGl0bGUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKSArIHRpdGxlLnNsaWNlKDEpO1xyXG59XHJcblxyXG4vKipcclxuICog0KTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90LjQtSDQtNCw0YLRiyDQtNC70Y8g0YLQtdC60YPRidC10Lkg0LvQvtC60LDQu9C4XHJcbiAqIEBwYXJhbSAge0RhdGV9ICAgZGF0ZSAgICDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zINCf0LDRgNCw0LzQtdGC0YDRi1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGVUaW1lRm9ybWF0ID0gZnVuY3Rpb24oZGF0ZSwgb3B0aW9ucykge1xyXG4gICAgcmV0dXJuIEludGwuRGF0ZVRpbWVGb3JtYXQodGhpcy5vcHRpb25zLmxvY2FsZSwgb3B0aW9ucykuZm9ybWF0KGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0JTQvdC4INC90LXQtNC10LvQuFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRXZWVrRGF5c0Zvcm1hdHRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAyKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgKytpKSB7XHJcbiAgICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICBkYXk6IGRhdGUuZ2V0RGF5KCksXHJcbiAgICAgICAgICAgIHRpdGxlOiB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHt3ZWVrZGF5OiAnc2hvcnQnfSksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0YHQvtCz0LvQsNGB0L3QviDQvdCw0YHRgtGA0L7QtdC90L3QvtC80YMg0L/QtdGA0LLQvtC80YMg0LTQvdGOINC90LXQtNC10LvQuFxyXG4gICAgcmVzdWx0LnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICBjb25zdCBmaXJzdERheU9mVGhlV2VlayA9IHRoaXMub3B0aW9ucy5maXJzdERheU9mVGhlV2VlayAlIDc7XHJcbiAgICAgICAgbGV0IGRheUEgPSBhLmRheTtcclxuICAgICAgICBsZXQgZGF5QiA9IGIuZGF5O1xyXG5cclxuICAgICAgICBpZiAoZGF5QSA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QiA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlBIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgZGF5QSArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUIgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICBkYXlCICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGF5QSAtIGRheUI7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vKipcclxuICog0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LzQtdGB0Y/RhtC1XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge051bWJlcn0gICAg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF5c0NvdW50SW5Nb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IGRheXMgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF5cy5zZXRNb250aChkYXlzLmdldE1vbnRoKCkgKyAxKTtcclxuICAgIGRheXMuc2V0RGF0ZSgwKTtcclxuICAgIHJldHVybiBkYXlzLmdldERhdGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnJhbmdlUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsUmVzZXQoKTtcclxuICAgIHRoaXMuX3NlbGVjdGlvbiA9IHt9O1xyXG59XHJcblxyXG4vKipcclxuICog0JLRi9C00LXQu9C10L3QuNC1INC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucmFuZ2VTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgaWYgKCF0aGlzLmdldElzUmFuZ2VTZWxlY3RhYmxlKGRhdGVfZnJvbSwgZGF0ZV90bykpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INGN0LvQtdC80LXQvdGC0L7QslxyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QoZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuXHJcbiAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1XHJcbiAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7QsdC90L7QstC70LXQvdC40LUg0LjQvdC/0YPRgtC+0LJcclxuICAgIGlmICh0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfRlJPTV0pIHtcclxuICAgICAgICB0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfRlJPTV0udmFsdWUgPSB0aGlzLmZvcm1hdERhdGUoZGF0ZV9mcm9tKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fJGlucHV0c1tJTkRFWF9EQVRFX1RPXSkge1xyXG4gICAgICAgIHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9UT10udmFsdWUgPSB0aGlzLmZvcm1hdERhdGUoZGF0ZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtCx0YvRgtC40LVcclxuICAgIHRoaXMuX2NhbGxiYWNrKCdyYW5nZVNlbGVjdCcsIGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INC00LDRgtGLXHJcbiAqIEBwYXJhbSAge0RhdGV9ICAgZGF0ZSAgINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZvcm1hdCDQpNC+0YDQvNCw0YIg0YHRgtGA0L7QutC4XHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUsIGZvcm1hdCA9ICdZLW0tZCcpIHtcclxuICAgIHJldHVybiBmb3JtYXQucmVwbGFjZSgnWScsIGRhdGUuZ2V0RnVsbFllYXIoKSlcclxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgnbScsICgnMCcgKyAoZGF0ZS5nZXRNb250aCgpICsgMSkpLnNsaWNlKC0yKSlcclxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgnZCcsICgnMCcgKyAoZGF0ZS5nZXREYXRlKCkpKS5zbGljZSgtMikpO1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC+0LLQtdGA0LrQsCDQstC+0LfQvNC+0LbQvdC+0YHRgtC4INCy0YvQtNC10LvQtdC90LjRjyDQtNCw0YJcclxuICogQHBhcmFtICB7RGF0ZSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSAge0RhdGUgZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0SXNSYW5nZVNlbGVjdGFibGUgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC80LjQvdC40LzQsNC70YzQvdGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgY29uc3QgZGlmZiA9IE1hdGguYWJzKGRhdGVfZnJvbS5nZXRUaW1lKCkgLSBkYXRlX3RvLmdldFRpbWUoKSkgLyAxMDAwIC8gODY0MDA7XHJcbiAgICBpZiAoZGlmZiA8IHRoaXMub3B0aW9ucy5taW5EYXlzKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDQvtCy0LXRgNC60LAg0L/QvtC/0LDQtNCw0L3QuNGPINCyINC00LjQsNC/0LDQt9C+0L0g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9GFINC00LDRglxyXG4gICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIGRheS5zZXRUaW1lKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG5cclxuICAgIHdoaWxlIChkYXkgPCBkYXRlX3RvKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0RGF5TG9ja2VkKGRheSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC+0LLQtdGA0LrQsCDQvdCwINC00L7RgdGC0YPQv9C90L7RgdGC0Ywg0LTQvdGPINC00LvRjyDQsdGA0L7QvdC4XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICogQHJldHVybiB7Qm9vbGVhbn0gICB0cnVlINC10YHQu9C4INC00L7RgdGC0YPQv9C10L1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF5TG9ja2VkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LLQvdC1INC00L7RgdGC0YPQv9C90L7Qs9C+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgaWYgKGRhdGUgPCB0aGlzLm9wdGlvbnMubWluRGF0ZSB8fCBkYXRlID4gdGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICByZXR1cm4gTE9DS19VTkFWQUlMQUJMRTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZpbHRlci5sb2NrRGF5cy5jYWxsKHRoaXMsIGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0JLRi9Cx0YDQsNC90L3QsNGPINC90LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtEYXRlfSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlRnJvbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2dldERhdGVGcm9tSW5wdXQoSU5ERVhfREFURV9GUk9NKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQsdGA0LDQvdC90LDRjyDQtNCw0YLQsCAoc2luZ2xlTW9kZTogdHJ1ZSlcclxuICogQHJldHVybiB7RGF0ZX0g0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZSA9IERhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZUZyb207XHJcblxyXG4vKipcclxuICog0JLRi9Cx0YDQsNC90L3QsNGPINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICogQHJldHVybiB7RGF0ZX0g0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZVRvID0gZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZ2V0RGF0ZUZyb21JbnB1dChJTkRFWF9EQVRFX1RPKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0LrQu9C+0L3QtdC90LjQtSAoMSDQsdC+0LHRkdGALCAyINCx0L7QsdGA0LAsIDUg0LHQvtCx0YDQvtCyKVxyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IHZhbHVlINCa0L7Qu9C40YfQtdGB0YLQstC+XHJcbiAqIEBwYXJhbSAge0FycmF5fSAgZm9ybXMg0JzQsNGB0YHQuNCyINC40LcgM9GFINGN0LvQtdC80LXQvdGC0L7Qsiwg0LzQvtC20LXRgiDRgdC+0LTQtdGA0LbQsNGC0Ywg0YHQv9C10YbQuNGE0LjQutCw0YLQvtGAICVkINC00LvRjyDQt9Cw0LzQtdC90YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5wbHVyYWwgPSBmdW5jdGlvbiAodmFsdWUsIGZvcm1zKSB7XHJcbiAgICByZXR1cm4gKHZhbHVlICUgMTAgPT0gMSAmJiB2YWx1ZSAlIDEwMCAhPSAxMSA/IGZvcm1zWzBdIDogKHZhbHVlICUgMTAgPj0gMiAmJiB2YWx1ZSAlIDEwIDw9IDQgJiYgKHZhbHVlICUgMTAwIDwgMTAgfHwgdmFsdWUgJSAxMDAgPj0gMjApID8gZm9ybXNbMV0gOiBmb3Jtc1syXSkpLnJlcGxhY2UoJyVkJywgdmFsdWUpO1xyXG59XHJcblxyXG4vKipcclxuICog0JLRi9Cx0YDQsNC90L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSAge051bWJlcn0gaW5kZXgg0JjQvdC00LXQutGBINC40L3Qv9GD0YLQsFxyXG4gKiBAcmV0dXJuIHtEYXRlfSAgICAgICAgINCU0LDRgtCwINC40LvQuCB1bmRlZmluZWRcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2dldERhdGVGcm9tSW5wdXQgPSBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgcmV0dXJuIHRoaXMuXyRpbnB1dHNbaW5kZXhdID8gbmV3IERhdGUodGhpcy5fJGlucHV0c1tpbmRleF0udmFsdWUpIDogdW5kZWZpbmVkO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC00LjQsNC/0LDQt9C+0L3QsCDQvNC10YHRj9GG0LXQslxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVNb250aHMgPSBmdW5jdGlvbihkYXRlX2Zyb20pIHtcclxuICAgIHdoaWxlICh0aGlzLl8kbW9udGhzLmxhc3RFbGVtZW50Q2hpbGQpIHtcclxuICAgICAgICB0aGlzLl8kbW9udGhzLnJlbW92ZUNoaWxkKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/RgNGP0YfQtdC8INC/0L7QtNGB0LrQsNC30LrRg1xyXG4gICAgdGhpcy5fdG9vbHRpcEhpZGUoKTtcclxuXHJcbiAgICAvLyDQv9GA0LXRgNC10L3QtNC10YAg0LzQtdGB0Y/RhtC10LJcclxuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoZGF0ZV9mcm9tLmdldFRpbWUoKSk7XHJcbiAgICBjb25zdCAkbW9udGhzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDsgKytpKSB7XHJcbiAgICAgICAgJG1vbnRocy5wdXNoKHRoaXMuXyRjcmVhdGVNb250aChjdXJyZW50RGF0ZSkpO1xyXG4gICAgICAgIGN1cnJlbnREYXRlLnNldE1vbnRoKGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YBcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJG1vbnRocy5sZW5ndGg7IGkgKz0gdGhpcy5vcHRpb25zLnBlclJvdykge1xyXG4gICAgICAgIGNvbnN0ICRyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAkcm93LmNsYXNzTmFtZSA9ICdEYXRlcmFuZ2VwaWNrZXJfX3Jvdyc7XHJcblxyXG4gICAgICAgICRtb250aHMuc2xpY2UoaSwgaSArIHRoaXMub3B0aW9ucy5wZXJSb3cpLmZvckVhY2goJG1vbnRoID0+IHtcclxuICAgICAgICAgICAgJHJvdy5hcHBlbmRDaGlsZCgkbW9udGgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl8kbW9udGhzLmFwcGVuZENoaWxkKCRyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUg0JzQtdGB0Y/RhlxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZU1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgY3VycmVudE1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xyXG4gICAgY29uc3QgbW9udGhUaXRsZSA9IHRoaXMuZ2V0TW9udGhGb3JtYXR0ZWQoZGF0ZSk7XHJcbiAgICBjb25zdCB3ZWVrRGF5cyA9IHRoaXMuZ2V0V2Vla0RheXNGb3JtYXR0ZWQoKTtcclxuXHJcbiAgICBjb25zdCAkbW9udGggPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIk1vbnRoXCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fYXJyb3cgTW9udGhfX2Fycm93LS1wcmV2JHsodGhpcy5vcHRpb25zLm1pbkRhdGUgJiYgZGF0ZSA8PSB0aGlzLm9wdGlvbnMubWluRGF0ZSkgPyAnIGlzLWRpc2FibGVkJyA6ICcnfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk03IDEzTDEgN0w3IDFcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX190aXRsZVwiPiR7bW9udGhUaXRsZX0gJHtkYXRlLmdldEZ1bGxZZWFyKCl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tbmV4dCR7KHRoaXMub3B0aW9ucy5tYXhEYXRlICYmIGRhdGUgPj0gdGhpcy5vcHRpb25zLm1heERhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMSAwLjk5OTk5OUw3IDdMMSAxM1wiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtcIj4ke3dlZWtEYXlzLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrZGF5XCI+JHtpdGVtLnRpdGxlfTwvZGl2PmBcclxuICAgICAgICAgICAgfSkuam9pbignJyl9PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fZGF5c1wiPjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgLy8g0YHRgtGA0LXQu9C60LhcclxuICAgIFtcclxuICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1wcmV2JywgbmFtZTogJ3ByZXYnfSxcclxuICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1uZXh0JywgbmFtZTogJ25leHQnfSxcclxuICAgIF0uZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICBjb25zdCAkYXJyb3cgPSAkbW9udGgucXVlcnlTZWxlY3RvcihpdGVtLnNlbGVjdG9yKTtcclxuICAgICAgICAkYXJyb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICAgICAgLy8g0LLRgNC10LzQtdC90L3QsNGPINC80LXRgNCwLCDQu9GD0YfRiNC1INC/0LXRgNC10LLQtdGA0YHRgtCw0YLRjCwg0LLRi9C90LXRgdGC0Lgg0YHRgtGA0LXQu9C60Lgg0LfQsCDQv9GA0LXQtNC10LvRiyDQv9C10YDQtdGA0LXRgNC40YHQvtCy0YvQstCw0LXQvNC+0Lkg0L7QsdC70LDRgdGC0Lgg0L/QuNC60LXRgNCwXHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9vbkFycm93Q2xpY2soJGFycm93LCBpdGVtLm5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAINC00L3QtdC5XHJcbiAgICBjb25zdCAkZGF5cyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKCcuTW9udGhfX2RheXMnKTtcclxuICAgIGNvbnN0IGRheXMgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICBkYXlzLnNldERhdGUoMSk7XHJcbiAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIHdoaWxlIChkYXlzLmdldE1vbnRoKCkgPT0gY3VycmVudE1vbnRoKSB7XHJcbiAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlV2VlaygpO1xyXG5cclxuICAgICAgICB3ZWVrRGF5cy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBpZiAoZGF5cy5nZXREYXkoKSAhPSBpdGVtLmRheSB8fCBkYXlzLmdldE1vbnRoKCkgIT0gY3VycmVudE1vbnRoKSB7XHJcbiAgICAgICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRW1wdHlEYXkoKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVEYXkoZGF5cykpO1xyXG4gICAgICAgICAgICBkYXlzLnNldERhdGUoZGF5cy5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJGRheXMuYXBwZW5kQ2hpbGQoJHdlZWspO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAkbW9udGg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC70LjQuiDQv9C+INGB0YLRgNC10LvQutC1INC/0LXRgNC10LrQu9GO0YfQtdC90LjRjyDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtFbGVtZW50fSAkYXJyb3cgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAgICDQmNC80Y8gKHByZXYsIG5leHQpXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkFycm93Q2xpY2sgPSBmdW5jdGlvbigkYXJyb3csIG5hbWUpIHtcclxuICAgIGlmICgkYXJyb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShwYXJzZUludCh0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aCcpLmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgKG5hbWUgPT0gJ3ByZXYnID8gLXRoaXMub3B0aW9ucy5tb250aHNDb3VudCA6IHRoaXMub3B0aW9ucy5tb250aHNDb3VudCkpO1xyXG5cclxuICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNC40L3QuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRUaW1lKHRoaXMub3B0aW9ucy5taW5EYXRlLmdldFRpbWUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LDQutGB0LjQvNCw0LvRjNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgY29uc3QgZW5kRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBlbmREYXRlLnNldE1vbnRoKGVuZERhdGUuZ2V0TW9udGgoKSArIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCk7XHJcbiAgICAgICAgaWYgKGVuZERhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1heERhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgLSB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/QtdGA0LXRhdC+0LQg0Log0L3QvtCy0L7QuSDQtNCw0YLQtVxyXG4gICAgdGhpcy5fc2VsZWN0RGF0ZShkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQuSDQtNCw0YLRiyDRgSDRgNC10L3QtNC10YDQvtC8XHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fc2VsZWN0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIHRoaXMuX3NlbGVjdGVkRGF0ZSA9IGRhdGU7XHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGhzKGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC90LXQtNC10LvQuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZVdlZWsgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiV2Vla1wiPjwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuICR3ZWVrO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC00L3Rj1xyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZURheSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRheVwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCIgZGF0YS1kYXk9XCIke2RhdGUuZ2V0RGF5KCl9XCI+JHtkYXRlLmdldERhdGUoKX08L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkRheUNsaWNrRXZlbnQuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZSkge1xyXG4gICAgICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC+0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gICAgdGhpcy5fdXBkYXRlRGF5KCRkYXkpO1xyXG5cclxuICAgIHJldHVybiAkZGF5O1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuTW9udGgnKS5mb3JFYWNoKCRtb250aCA9PiB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlTW9udGgoJG1vbnRoKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5INC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRtb250aCDQrdC70LXQvNC10L3RgiDQvNC10YHRj9GG0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3VwZGF0ZU1vbnRoID0gZnVuY3Rpb24oJG1vbnRoKSB7XHJcbiAgICAkbW9udGgucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJykuZm9yRWFjaCgkZGF5ID0+IHtcclxuICAgICAgICB0aGlzLl91cGRhdGVEYXkoJGRheSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuSDQtNC90Y9cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5INCt0LvQtdC80LXQvdGCINC00L3Rj1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdXBkYXRlRGF5ID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgY29uc3QgZGF0ZSAgID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICBjb25zdCBsb2NrZWQgPSB0aGlzLmdldERheUxvY2tlZChkYXRlKTtcclxuICAgIGNvbnN0IHRvZGF5ICA9IHRoaXMuX3RvZGF5LmdldFRpbWUoKSA9PSBkYXRlLmdldFRpbWUoKTtcclxuXHJcbiAgICAkZGF5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLWRpc2FibGVkJywgbG9ja2VkKTtcclxuICAgICRkYXkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtbG9ja2VkJywgbG9ja2VkID09IExPQ0tfTE9DS0VEKTtcclxuICAgICRkYXkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtdG9kYXknLCB0b2RheSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDQutC70LjQutCwINC/0L4g0LTQvdGOXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheUNsaWNrRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICB0aGlzLl9vbkRheUNsaWNrKGUudGFyZ2V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INGF0L7QstC10YDQsFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlNb3VzZUVudGVyRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICB0aGlzLl9vbkRheU1vdXNlRW50ZXIoZS50YXJnZXQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KXQvtCy0LXRgCDQvdCwINGN0LvQtdC80LXQvdGC0LUg0LTQvdGPXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheU1vdXNlRW50ZXIgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXkuZGF0YXNldC50aW1lID09IHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20uZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG59XHJcblxyXG4vKipcclxuICog0JrQu9C40Log0L/QviDQtNC90Y5cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5Q2xpY2sgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICAvLyDQtNC10L3RjCDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L1cclxuICAgIGlmICgkZGF5LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZSkge1xyXG4gICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFjaygnZGF5U2VsZWN0JywgbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdCx0YDQvtGBINCy0YvQsdGA0LDQvdC90L7Qs9C+INGA0LDQvdC10LUg0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAvLyDQstGL0LHRgNCw0L3QsCDQvdCw0YfQsNC70YzQvdCw0Y8gLyDQutC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20pIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAvLyDQtNC+0L/Rg9GB0YLQuNC80YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICAgICAgaWYgKCF0aGlzLmdldElzUmFuZ2VTZWxlY3RhYmxlKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSkge1xyXG4gICAgICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yYW5nZVNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktC40LfRg9Cw0LvRjNC90YvQuSDRgdCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fcmFuZ2VWaXN1YWxSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgJGRheXMgPSB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpO1xyXG4gICAgJGRheXMuZm9yRWFjaCgkZGF5ID0+IHtcclxuICAgICAgICAkZGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nLCAnaXMtc2VsZWN0ZWQtdG8nLCAnaXMtc2VsZWN0ZWQtYmV0d2VlbicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0L/RgNGP0YfQtdC8INC/0L7QtNGB0LrQsNC30LrRg1xyXG4gICAgdGhpcy5fdG9vbHRpcEhpZGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LjQt9GD0LDQu9GM0L3QvtC1INCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3JhbmdlVmlzdWFsU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBpZiAoZGF0ZV9mcm9tICYmIGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGVfdG8gJiYgZGF0ZV90byBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0aW1lX2Zyb20gPSBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV9mcm9tLmdldFRpbWUoKSA6IDA7XHJcbiAgICBsZXQgdGltZV90byA9IGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV90by5nZXRUaW1lKCkgOiAwO1xyXG4gICAgaWYgKHRpbWVfZnJvbSA+IHRpbWVfdG8pIHtcclxuICAgICAgICBbdGltZV9mcm9tLCB0aW1lX3RvXSA9IFt0aW1lX3RvLCB0aW1lX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YIg0LzQtdC20LTRgyDQvdCw0YfQsNC70YzQvdC+0Lkg0Lgg0LrQvtC90LXRh9C90L7QuVxyXG4gICAgY29uc3QgJGRheXMgPSB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkZGF5cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICRkYXlzW2ldLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXNlbGVjdGVkLWJldHdlZW4nLCAkZGF5c1tpXS5kYXRhc2V0LnRpbWUgPiB0aW1lX2Zyb20gJiYgJGRheXNbaV0uZGF0YXNldC50aW1lIDwgdGltZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5INC/0L7Qt9C40YbQuNC4XHJcbiAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICBjb25zdCAkZGF5X3RvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuXHJcbiAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgaWYgKHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCAhPSAkZGF5X2Zyb20pIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgaWYgKHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkICE9ICRkYXlfdG8pIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7RhdGA0LDQvdC10L3QuNC1INCyINC60LXRiFxyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCA9ICRkYXlfZnJvbTtcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkID0gJGRheV90bztcclxuXHJcbiAgICB0aGlzLl9zZWxlY3Rpb24uJGRheV9mcm9tID0gJGRheV9mcm9tO1xyXG4gICAgdGhpcy5fc2VsZWN0aW9uLiRkYXlfdG8gPSAkZGF5X3RvO1xyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IE1hdGguZmxvb3IoTWF0aC5hYnModGltZV9mcm9tIC0gdGltZV90bykgLyA4NjQwMGUzKSArIDE7XHJcbiAgICAgICAgdGhpcy5fdG9vbHRpcFNob3coJGRheV90bywgZGF5cyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9C+0LrQsNC3INC/0L7QtNGB0LrQsNC30LrQuFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkg0JLRi9Cx0YDQsNC90L3Ri9C5INC00LXQvdGMXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSAgZGF5cyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcFNob3cgPSBmdW5jdGlvbigkZGF5LCBkYXlzKSB7XHJcbiAgICB0aGlzLl8kdG9vbHRpcENvbnRlbnQudGV4dENvbnRlbnQgPSB0aGlzLm9wdGlvbnMuZmlsdGVyLnRvb2x0aXBUZXh0LmNhbGwodGhpcywgZGF5cykgfHwgJyc7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zaG93JywgdGhpcy5fJHRvb2x0aXAudGV4dENvbnRlbnQubGVuZ3RoKTtcclxuICAgIHRoaXMuX3Rvb2x0aXBVcGRhdGUoJGRheSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDQv9C+0LfQuNGG0LjQuCDQv9C+0LTRgdC60LDQt9C60LhcclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5INCS0YvQsdGA0LDQvdC90YvQuSDQtNC10L3RjFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcFVwZGF0ZSA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGxldCB4ID0gMDtcclxuICAgIGxldCB5ID0gMDtcclxuICAgIGxldCAkZWwgPSAkZGF5O1xyXG4gICAgZG8ge1xyXG4gICAgICAgIHkgKz0gJGVsLm9mZnNldFRvcDtcclxuICAgICAgICB4ICs9ICRlbC5vZmZzZXRMZWZ0O1xyXG4gICAgfSB3aGlsZSAoKCRlbCA9ICRlbC5vZmZzZXRQYXJlbnQpICYmICRlbCAhPSB0aGlzLl8kcGlja2VyKTtcclxuXHJcbiAgICB0aGlzLl8kdG9vbHRpcC5zdHlsZS50b3AgPSBNYXRoLnJvdW5kKHkgLSB0aGlzLl8kdG9vbHRpcC5vZmZzZXRIZWlnaHQpICsgJ3B4JztcclxuICAgIHRoaXMuXyR0b29sdGlwLnN0eWxlLmxlZnQgPSBNYXRoLnJvdW5kKHggKyAkZGF5Lm9mZnNldFdpZHRoIC8gMiAtIHRoaXMuXyR0b29sdGlwLm9mZnNldFdpZHRoIC8gMikgKyAncHgnO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQutGA0YvRgtGMINC/0L7QtNGB0LrQsNC30LrRg1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcEhpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuXyR0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNob3cnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCi0LXQutGB0YIg0L/QvtC00YHQutCw0LfQutC4INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAqIEBwYXJhbSAge051bWJlcn0gZGF5cyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9maWx0ZXJUb29sdGlwVGV4dCA9IGZ1bmN0aW9uKGRheXMpIHtcclxuICAgIHJldHVybiB0aGlzLnBsdXJhbChkYXlzLCBbJyVkINC00LXQvdGMJywgJyVkINC00L3RjycsICclZCDQtNC90LXQuSddKS5yZXBsYWNlKCclZCcsIGRheXMpO1xyXG59XHJcblxyXG4vKipcclxuICog0KTQuNC70YzRgtGAINC90LXQtNC+0YHRgtGD0L/QvdGL0YUg0LTQvdC10Lkg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2ZpbHRlckxvY2tEYXlzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyDQstGB0LUg0LTQvdC4INC00L7RgdGC0YPQv9C90YtcclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INC40LfQvNC10L3QtdC90LjRjyDRgNCw0LfQvNC10YDQvtCyINC+0LrQvdCwXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZUV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvKSB7XHJcbiAgICAgICAgdGhpcy5fdG9vbHRpcFVwZGF0ZSh0aGlzLl9zZWxlY3Rpb24uJGRheV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGJyZWFrcG9pbnQgPSAwO1xyXG4gICAgY29uc3QgYnJlYWtwb2ludHMgPSBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHMpLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcclxuICAgIGZvciAobGV0IGkgaW4gYnJlYWtwb2ludHMpIHtcclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPD0gYnJlYWtwb2ludHNbaV0pIHtcclxuICAgICAgICAgICAgYnJlYWtwb2ludCA9IGJyZWFrcG9pbnRzW2ldO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fc2V0QnJlYWtwb2ludChicmVha3BvaW50KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCj0YHRgtCw0L3QvtCy0LrQsCDRgdC+0YHRgtC+0Y/QvdC40Y8g0YDQtdC90LTQtdGA0LAg0L/QvtC0INGA0LDQt9C90YvQtSDRjdC60YDQsNC90YtcclxuICogQHBhcmFtIHtOdW1iZXJ9IGJyZWFrcG9pbnQg0JrQu9GO0Ycg0LjQtyB0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHMgKNCo0LjRgNC40L3QsCDRjdC60YDQsNC90LApXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9zZXRCcmVha3BvaW50ID0gZnVuY3Rpb24oYnJlYWtwb2ludCkge1xyXG4gICAgLy8g0L7RgiDQvdC10L3Rg9C20L3QvtC5INC/0LXRgNC10YDQuNGB0L7QstC60LhcclxuICAgIGlmICh0aGlzLl9icmVha3BvaW50ID09IGJyZWFrcG9pbnQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLl9icmVha3BvaW50ID0gYnJlYWtwb2ludDtcclxuXHJcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5icmVha3BvaW50c1ticmVha3BvaW50XSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKTtcclxuICAgIHRoaXMuXyRjcmVhdGVNb250aHModGhpcy5fc2VsZWN0ZWREYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCt0LvQtdC80LXQvdGCINC60LDQu9C10L3QtNCw0YDQvdC+0LPQviDQtNC90Y9cclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fSAgIEhUTUwg0Y3Qu9C10LzQtdC90YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRnZXREYXlCeURhdGUgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCB0aW1lID0gZGF0ZSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlLmdldFRpbWUoKSA6IDA7XHJcbiAgICByZXR1cm4gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuRGF5W2RhdGEtdGltZT1cIicgKyB0aW1lICsgJ1wiXScpO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC00L3RjyAtINC30LDQs9C70YPRiNC60LhcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVFbXB0eURheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgJGRheSA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5IGlzLWVtcHR5XCI+PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gJGRheTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7Qt9C00LDQvdC40LUg0Y3Qu9C10LzQtdC90YLQsCDQuNC3IEhUTUwg0YLQtdC60YHRgtCwXHJcbiAqIEBwYXJhbSAge1N0cmluZ30gaHRtbCBIVE1MINGC0LXQutGB0YJcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24oaHRtbCkge1xyXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkaXYuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgaHRtbCk7XHJcbiAgICByZXR1cm4gZGl2LmNoaWxkcmVuLmxlbmd0aCA+IDEgPyBkaXYuY2hpbGRyZW4gOiBkaXYuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTYWZlINCy0YvQt9C+0LIg0LLQvdC10YjQvdC40YUg0YHQvtCx0YvRgtC40Lkg0LrQvtC80L/QvtC90LXQvdGC0LBcclxuICogQHBhcmFtIHtTdHJpbmd9IGYg0JjQvNGPINGB0L7QsdGL0YLQuNGPXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9jYWxsYmFjayA9IGZ1bmN0aW9uKGYpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uW2ZdID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm9uW2ZdLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuO1xyXG59XHJcblxyXG4vKiBoYXJtb255IGRlZmF1bHQgZXhwb3J0ICovIGNvbnN0IF9fV0VCUEFDS19ERUZBVUxUX0VYUE9SVF9fID0gKERhdGVSYW5nZVBpY2tlcik7XHJcblxufSkoKTtcblxuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX2V4cG9ydHNfXztcbi8qKioqKiovIH0pKClcbjtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW5kbFluQmhZMnM2THk5a1lYUmxjbUZ1WjJWd2FXTnJaWEl2ZDJWaWNHRmpheTkxYm1sMlpYSnpZV3hOYjJSMWJHVkVaV1pwYm1sMGFXOXVJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTkzWldKd1lXTnJMMkp2YjNSemRISmhjQ0lzSW5kbFluQmhZMnM2THk5a1lYUmxjbUZ1WjJWd2FXTnJaWEl2ZDJWaWNHRmpheTl5ZFc1MGFXMWxMMlJsWm1sdVpTQndjbTl3WlhKMGVTQm5aWFIwWlhKeklpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOTNaV0p3WVdOckwzSjFiblJwYldVdmFHRnpUM2R1VUhKdmNHVnlkSGtnYzJodmNuUm9ZVzVrSWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k5M1pXSndZV05yTDNKMWJuUnBiV1V2YldGclpTQnVZVzFsYzNCaFkyVWdiMkpxWldOMElpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOHVMM055WXk5elkzTnpMMmx1WkdWNExuTmpjM01pTENKM1pXSndZV05yT2k4dlpHRjBaWEpoYm1kbGNHbGphMlZ5THk0dmMzSmpMMnB6TDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxFTkJRVU03UVVGRFJDeFBPenRWUTFaQk8xVkJRMEU3T3pzN08xZERSRUU3VjBGRFFUdFhRVU5CTzFkQlEwRTdWMEZEUVN4M1EwRkJkME1zZVVOQlFYbERPMWRCUTJwR08xZEJRMEU3VjBGRFFTeEZPenM3T3p0WFExQkJMSGRHT3pzN096dFhRMEZCTzFkQlEwRTdWMEZEUVR0WFFVTkJMSE5FUVVGelJDeHJRa0ZCYTBJN1YwRkRlRVU3VjBGRFFTd3JRMEZCSzBNc1kwRkJZenRYUVVNM1JDeEZPenM3T3pzN096czdPenM3UVVOT1FUczdPenM3T3pzN096czdPenM3TzBGRFFVRTdRVUZEVHp0QlFVTkJPenRCUVVWUU8wRkJRMEU3TzBGQlJVRXNhVVJCUVdsRU8wRkJRMnBFTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNNRVJCUVRCRU8wRkJRekZFTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hUUVVGVExHdENRVUZyUWp0QlFVTXpRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEZOQlFWTXNjMEpCUVhOQ08wRkJReTlDT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRU3h4UlVGQmNVVTdPMEZCUlhKRk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1kwRkJZenRCUVVOa08wRkJRMEVzYzBKQlFYTkNPMEZCUTNSQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJXU3hMUVVGTE8wRkJRMnBDTEZsQlFWazdRVUZEV2p0QlFVTkJPMEZCUTBFc1owUkJRV2RFTEdOQlFXTTdRVUZET1VRN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCV1N4TFFVRkxPMEZCUTJwQ0xGbEJRVmtzVDBGQlR6dEJRVU51UWl4WlFVRlpPMEZCUTFvN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRXNiVUpCUVcxQ0xFOUJRVTg3UVVGRE1VSTdRVUZEUVR0QlFVTkJPMEZCUTBFc2FVUkJRV2xFTEdsQ1FVRnBRanRCUVVOc1JTeFRRVUZUTzBGQlExUTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRU3hMUVVGTE96dEJRVVZNTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVmtzUzBGQlN6dEJRVU5xUWl4WlFVRlpMRTlCUVU4N1FVRkRia0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNWMEZCVnl4TFFVRkxPMEZCUTJoQ0xGZEJRVmNzUzBGQlN6dEJRVU5vUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WlFVRlpMRXRCUVVzN1FVRkRha0lzV1VGQldTeFBRVUZQTzBGQlEyNUNMRmxCUVZrN1FVRkRXanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVms3UVVGRFdpeFpRVUZaTzBGQlExb3NXVUZCV1R0QlFVTmFPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVmtzUzBGQlN6dEJRVU5xUWl4WlFVRlpMRkZCUVZFN1FVRkRjRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1MwRkJTenRCUVVOcVFqdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzV1VGQldTeExRVUZMTzBGQlEycENPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZsQlFWa3NTMEZCU3p0QlFVTnFRanRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJXU3hQUVVGUE8wRkJRMjVDTEZsQlFWa3NUVUZCVFR0QlFVTnNRaXhaUVVGWk8wRkJRMW83UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVmtzVDBGQlR6dEJRVU51UWl4WlFVRlpMRXRCUVVzN1FVRkRha0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGZEJRVmNzUzBGQlN6dEJRVU5vUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEVzYlVKQlFXMUNMRGhDUVVFNFFqdEJRVU5xUkR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFTeHRRa0ZCYlVJc2IwSkJRVzlDTzBGQlEzWkRPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZOQlFWTTdPMEZCUlZRN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eExRVUZMTzBGQlEyaENPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVN4NVEwRkJlVU1zWlVGQlpUdEJRVU40UkR0QlFVTkJMRFpFUVVFMlJDdzJSVUZCTmtVN1FVRkRNVWs3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN3MFEwRkJORU1zVjBGQlZ5eEhRVUZITEcxQ1FVRnRRanRCUVVNM1JTdzJSRUZCTmtRc05rVkJRVFpGTzBGQlF6RkpPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeDFRMEZCZFVNN1FVRkRka01zYzBSQlFYTkVMRmRCUVZjN1FVRkRha1VzWVVGQllTeFhRVUZYTzBGQlEzaENPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNVMEZCVXl3NFEwRkJPRU03UVVGRGRrUXNVMEZCVXl3NFEwRkJPRU03UVVGRGRrUTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTEZOQlFWTTdRVUZEVkN4TFFVRkxPenRCUVVWTU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFRRVUZUT3p0QlFVVlVPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhSUVVGUk8wRkJRMjVDTEZkQlFWY3NUMEZCVHp0QlFVTnNRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhMUVVGTE8wRkJRMmhDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZsQlFWa3NTMEZCU3p0QlFVTnFRaXhaUVVGWk8wRkJRMW83UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WlFVRlpMRXRCUVVzN1FVRkRha0lzV1VGQldUdEJRVU5hTzBGQlEwRTdRVUZEUVR0QlFVTkJMSFZEUVVGMVF5eGxRVUZsTEdOQlFXTXNZMEZCWXl4SlFVRkpMR1ZCUVdVN1FVRkRja2M3TzBGQlJVRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hMUVVGTE8wRkJRMHc3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1VVRkJVVHRCUVVOdVFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRXRCUVVzN1FVRkRURHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNWMEZCVnl4UlFVRlJPMEZCUTI1Q08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1RVRkJUVHRCUVVOcVFqdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eE5RVUZOTzBGQlEycENPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRkZCUVZFN1FVRkRia0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEZGQlFWRTdRVUZEYmtJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxFdEJRVXM3UVVGRFREdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hMUVVGTE96dEJRVVZNTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eExRVUZMTzBGQlEyaENMRmRCUVZjc1MwRkJTenRCUVVOb1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4dFFrRkJiVUlzYTBKQlFXdENPMEZCUTNKRE8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNWMEZCVnl4UlFVRlJPMEZCUTI1Q0xGZEJRVmNzVDBGQlR6dEJRVU5zUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1VVRkJVVHRCUVVOdVFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzUzBGQlN6czdRVUZGVER0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTEU5QlFVODdRVUZEYmtJc1dVRkJXVHRCUVVOYU8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWk8wRkJRMW83UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eE5RVUZOTzBGQlEycENPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEU5QlFVODdRVUZEYkVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzV1VGQldTeExRVUZMTzBGQlEycENMRmxCUVZrc1VVRkJVVHRCUVVOd1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTzBGQlExbzdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWkxFOUJRVTg3UVVGRGJrSXNXVUZCV1R0QlFVTmFPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhQUVVGUE8wRkJRMnhDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVN4cFJVRkJaU3hsUVVGbExFVkJRVU1pTENKbWFXeGxJam9pWkdGMFpYSmhibWRsY0dsamEyVnlMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUtHWjFibU4wYVc5dUlIZGxZbkJoWTJ0VmJtbDJaWEp6WVd4TmIyUjFiR1ZFWldacGJtbDBhVzl1S0hKdmIzUXNJR1poWTNSdmNua3BJSHRjYmx4MGFXWW9kSGx3Wlc5bUlHVjRjRzl5ZEhNZ1BUMDlJQ2R2WW1wbFkzUW5JQ1ltSUhSNWNHVnZaaUJ0YjJSMWJHVWdQVDA5SUNkdlltcGxZM1FuS1Z4dVhIUmNkRzF2WkhWc1pTNWxlSEJ2Y25SeklEMGdabUZqZEc5eWVTZ3BPMXh1WEhSbGJITmxJR2xtS0hSNWNHVnZaaUJrWldacGJtVWdQVDA5SUNkbWRXNWpkR2x2YmljZ0ppWWdaR1ZtYVc1bExtRnRaQ2xjYmx4MFhIUmtaV1pwYm1Vb1hDSkVZWFJsY21GdVoyVndhV05yWlhKY0lpd2dXMTBzSUdaaFkzUnZjbmtwTzF4dVhIUmxiSE5sSUdsbUtIUjVjR1Z2WmlCbGVIQnZjblJ6SUQwOVBTQW5iMkpxWldOMEp5bGNibHgwWEhSbGVIQnZjblJ6VzF3aVJHRjBaWEpoYm1kbGNHbGphMlZ5WENKZElEMGdabUZqZEc5eWVTZ3BPMXh1WEhSbGJITmxYRzVjZEZ4MGNtOXZkRnRjSWtSaGRHVnlZVzVuWlhCcFkydGxjbHdpWFNBOUlHWmhZM1J2Y25rb0tUdGNibjBwS0hObGJHWXNJR1oxYm1OMGFXOXVLQ2tnZTF4dWNtVjBkWEp1SUNJc0lpOHZJRlJvWlNCeVpYRjFhWEpsSUhOamIzQmxYRzUyWVhJZ1gxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5QTlJSHQ5TzF4dVhHNGlMQ0l2THlCa1pXWnBibVVnWjJWMGRHVnlJR1oxYm1OMGFXOXVjeUJtYjNJZ2FHRnliVzl1ZVNCbGVIQnZjblJ6WEc1ZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxtUWdQU0FvWlhod2IzSjBjeXdnWkdWbWFXNXBkR2x2YmlrZ1BUNGdlMXh1WEhSbWIzSW9kbUZ5SUd0bGVTQnBiaUJrWldacGJtbDBhVzl1S1NCN1hHNWNkRngwYVdZb1gxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NXZLR1JsWm1sdWFYUnBiMjRzSUd0bGVTa2dKaVlnSVY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dWJ5aGxlSEJ2Y25SekxDQnJaWGtwS1NCN1hHNWNkRngwWEhSUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa29aWGh3YjNKMGN5d2dhMlY1TENCN0lHVnVkVzFsY21GaWJHVTZJSFJ5ZFdVc0lHZGxkRG9nWkdWbWFXNXBkR2x2Ymx0clpYbGRJSDBwTzF4dVhIUmNkSDFjYmx4MGZWeHVmVHNpTENKZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxtOGdQU0FvYjJKcUxDQndjbTl3S1NBOVBpQW9UMkpxWldOMExuQnliM1J2ZEhsd1pTNW9ZWE5QZDI1UWNtOXdaWEowZVM1allXeHNLRzlpYWl3Z2NISnZjQ2twSWl3aUx5OGdaR1ZtYVc1bElGOWZaWE5OYjJSMWJHVWdiMjRnWlhod2IzSjBjMXh1WDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1eUlEMGdLR1Y0Y0c5eWRITXBJRDArSUh0Y2JseDBhV1lvZEhsd1pXOW1JRk41YldKdmJDQWhQVDBnSjNWdVpHVm1hVzVsWkNjZ0ppWWdVM2x0WW05c0xuUnZVM1J5YVc1blZHRm5LU0I3WEc1Y2RGeDBUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0dWNGNHOXlkSE1zSUZONWJXSnZiQzUwYjFOMGNtbHVaMVJoWnl3Z2V5QjJZV3gxWlRvZ0owMXZaSFZzWlNjZ2ZTazdYRzVjZEgxY2JseDBUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0dWNGNHOXlkSE1zSUNkZlgyVnpUVzlrZFd4bEp5d2dleUIyWVd4MVpUb2dkSEoxWlNCOUtUdGNibjA3SWl3aUx5OGdaWGgwY21GamRHVmtJR0o1SUcxcGJta3RZM056TFdWNGRISmhZM1F0Y0d4MVoybHVYRzVsZUhCdmNuUWdlMzA3SWl3aUx5OGcwWUhRdnRHQjBZTFF2dEdQMEwzUXVOR1BJTkMzMExEUXNkQzcwTDdRdXRDNDBZRFF2dEN5MExEUXZkQzkwWXZSaFNEUXROQ3cwWUpjY2x4dVpYaHdiM0owSUdOdmJuTjBJRXhQUTB0ZlZVNUJWa0ZKVEVGQ1RFVWdQU0F4TzF4eVhHNWxlSEJ2Y25RZ1kyOXVjM1FnVEU5RFMxOU1UME5MUlVRZ0lDQWdJQ0E5SURJN1hISmNibHh5WEc1amIyNXpkQ0JKVGtSRldGOUVRVlJGWDBaU1QwMGdQU0F3TzF4eVhHNWpiMjV6ZENCSlRrUkZXRjlFUVZSRlgxUlBJQ0FnUFNBeE8xeHlYRzVjY2x4dVpuVnVZM1JwYjI0Z1JHRjBaVkpoYm1kbFVHbGphMlZ5S0NSamIyNTBZV2x1WlhJc0lHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4eVhHNGdJQ0FnTHk4ZzBMN1JnaURRdjlDKzBMTFJndEMrMFlEUXZkQyswTGtnMExqUXZkQzQwWWJRdU5DdzBMdlF1TkMzMExEUmh0QzQwTGhjY2x4dUlDQWdJR2xtSUNna1kyOXVkR0ZwYm1WeUxtbHVjM1JoYm1ObEtTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJQ1JqYjI1MFlXbHVaWEl1YVc1emRHRnVZMlU3WEhKY2JpQWdJQ0I5WEhKY2JpQWdJQ0FrWTI5dWRHRnBibVZ5TG1sdWMzUmhibU5sSUQwZ2RHaHBjenRjY2x4dVhISmNiaUFnSUNCMGFHbHpMbDhrWTI5dWRHRnBibVZ5SUQwZ0pHTnZiblJoYVc1bGNqdGNjbHh1WEhKY2JpQWdJQ0IwYUdsekxtOXdkR2x2Ym5NZ1BTQjdYSEpjYmlBZ0lDQWdJQ0FnWm1seWMzUkVZWGxQWmxSb1pWZGxaV3M2SUc5d2RHbHZibk11Wm1seWMzUkVZWGxQWmxSb1pWZGxaV3NnZkh3Z01Td2dJQ0FnSUNBZ0lDQWdMeThnMEwvUXRkR0EwTExSaTlDNUlOQzAwTFhRdmRHTUlOQzkwTFhRdE5DMTBMdlF1Q3dnTUNBOUlOQ3kwWUVzSURFZ1BTRFF2OUM5TENBdUxpNWNjbHh1SUNBZ0lDQWdJQ0J6YVc1bmJHVk5iMlJsT2lBZ0lDQWdJQ0FnYjNCMGFXOXVjeTV6YVc1bmJHVk5iMlJsSUNBZ0lDQWdJQ0I4ZkNCbVlXeHpaU3dnSUNBZ0lDQXZMeURRc3RHTDBMSFF2dEdBSU5DKzBMVFF2ZEMrMExrZzBMVFFzTkdDMFlzZzBMTFF2TkMxMFlIUmd0QytJTkMwMExqUXNOQy8wTERRdDlDKzBMM1FzRnh5WEc0Z0lDQWdJQ0FnSUd4dlkyRnNaVG9nSUNBZ0lDQWdJQ0FnSUNCdmNIUnBiMjV6TG14dlkyRnNaU0FnSUNBZ0lDQWdJQ0FnSUh4OElDZHlkUzFTVlNjc1hISmNiaUFnSUNBZ0lDQWdiV2x1UkdGNWN6b2dJQ0FnSUNBZ0lDQWdJRzl3ZEdsdmJuTXViV2x1UkdGNWN5QWdJQ0FnSUNBZ0lDQWdmSHdnTVN3Z0lDQWdJQ0FnSUNBZ0x5OGcwTHpRdU5DOTBMalF2TkN3MEx2UmpOQzkwTDdRdFNEUXV0QyswTHZRdU5HSDBMWFJnZEdDMExMUXZpRFF0TkM5MExYUXVTRFFzaURRdE5DNDBMRFF2OUN3MExmUXZ0QzkwTFZjY2x4dUlDQWdJQ0FnSUNCdGIyNTBhSE5EYjNWdWREb2dJQ0FnSUNBZ2IzQjBhVzl1Y3k1dGIyNTBhSE5EYjNWdWRDQWdJQ0FnSUNCOGZDQXhNaXhjY2x4dUlDQWdJQ0FnSUNCd1pYSlNiM2M2SUNBZ0lDQWdJQ0FnSUNBZ2IzQjBhVzl1Y3k1d1pYSlNiM2NnSUNBZ0lDQWdJQ0FnSUNCOGZDQjFibVJsWm1sdVpXUXNJQ0F2THlEUXV0QyswTHZRdU5HSDBMWFJnZEdDMExMUXZpRFF2TkMxMFlIUmo5R0cwTFhRc2lEUXNpRFJnTkdQMExUUmcxeHlYRzRnSUNBZ0lDQWdJRzFwYmtSaGRHVTZJQ0FnSUNBZ0lDQWdJQ0J2Y0hScGIyNXpMbTFwYmtSaGRHVWdJQ0FnSUNBZ0lDQWdJSHg4SUc1bGR5QkVZWFJsS0Nrc0lDOHZJTkM4MExqUXZkQzQwTHpRc05DNzBZelF2ZEN3MFk4ZzBMVFFzTkdDMExCY2NseHVJQ0FnSUNBZ0lDQnRZWGhFWVhSbE9pQWdJQ0FnSUNBZ0lDQWdiM0IwYVc5dWN5NXRZWGhFWVhSbElDQWdJQ0FnSUNBZ0lDQjhmQ0IxYm1SbFptbHVaV1FzWEhKY2JpQWdJQ0FnSUNBZ1luSmxZV3R3YjJsdWRITTZJQ0FnSUNBZ0lHOXdkR2x2Ym5NdVluSmxZV3R3YjJsdWRITWdJQ0FnSUNBZ2ZId2dlMzBzWEhKY2JpQWdJQ0FnSUNBZ2FXNTBaWEp1WVd4SmJuQjFkSE02SUNBZ0lHOXdkR2x2Ym5NdWFXNTBaWEp1WVd4SmJuQjFkSE1nSUNBZ2ZId2dkSEoxWlN3Z0lDQWdJQ0FnTHk4ZzBMalJnZEMvMEw3UXU5R00wTGZRdnRDeTBMRFF2ZEM0MExVZzBMTFJnZEdDMFlEUXZ0QzEwTDNRdmRHTDBZVWcwTGpRdmRDLzBZUFJndEMrMExKY2NseHVJQ0FnSUNBZ0lDQXZMeURSZ2RDKzBMSFJpOUdDMExqUmoxeHlYRzRnSUNBZ0lDQWdJRzl1T2lCUFltcGxZM1F1WVhOemFXZHVLSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbUZ1WjJWVFpXeGxZM1E2SUc1MWJHd3NJQzh2SU5HQjBMN1FzZEdMMFlMUXVOQzFJTkN5MFl2UXNkQyswWURRc0NEUXROQzQwTERRdjlDdzBMZlF2dEM5MExBZzBMVFFzTkdDWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR1JoZVZObGJHVmpkRG9nSUNCdWRXeHNMQ0F2THlEUmdkQyswTEhSaTlHQzBMalF0U0RRc3RHTDBMSFF2dEdBMExBZzBMN1F0TkM5MEw3UXVTRFF0TkN3MFlMUml5QW8wWUxRdnRDNzBZelF1dEMrSU5DLzBZRFF1Q0J6YVc1bmJHVk5iMlJsT2lCMGNuVmxLVnh5WEc0Z0lDQWdJQ0FnSUgwc0lHOXdkR2x2Ym5NdWIyNGdmSHdnZTMwcExGeHlYRzRnSUNBZ0lDQWdJQzh2SU5HRTBMalF1OUdNMFlMUmdOR0QwWTdSaWRDNDBMVWcwTHpRdGRHQzBMN1F0TkdMWEhKY2JpQWdJQ0FnSUNBZ1ptbHNkR1Z5T2lCUFltcGxZM1F1WVhOemFXZHVLSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdiRzlqYTBSaGVYTTZJQ0FnSUhSb2FYTXVYMlpwYkhSbGNreHZZMnRFWVhsekxDQWdJQ0F2THlCallXeHNZbUZqYXloa1lYUmxLU0RSaE5HRDBMM1F1dEdHMExqUmp5RFFzZEM3MEw3UXV0QzQwWURRdnRDeTBMRFF2ZEM0MFk4ZzBMVFFzTkdDTENCMGNuVmxMMHhQUTB0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEc5dmJIUnBjRlJsZUhRNklIUm9hWE11WDJacGJIUmxjbFJ2YjJ4MGFYQlVaWGgwTENBdkx5QmpZV3hzWW1GamF5aGtZWGx6S1NEUXN0R0wwTExRdnRDMElOR0MwTFhRdXRHQjBZTFFzQ0RRdjlDKzBMVFJnZEM2MExEUXQ5QzYwTGhjY2x4dUlDQWdJQ0FnSUNCOUxDQnZjSFJwYjI1ekxtWnBiSFJsY2lCOGZDQjdmU2tzWEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2RHaHBjeTVwYm1sMEtDazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW1OQzkwTGpSaHRDNDBMRFF1OUM0MExmUXNOR0cwTGpSajF4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1cGJtbDBJRDBnWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNBdkx5RFJnTkdQMExUUXZkQyswWUhSZ3RHTVhISmNiaUFnSUNCcFppQW9kSGx3Wlc5bUlIUm9hWE11YjNCMGFXOXVjeTV3WlhKU2IzY2dQVDBnSjNWdVpHVm1hVzVsWkNjcElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdWNHVnlVbTkzSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbTF2Ym5Sb2MwTnZkVzUwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdWJXbHVSR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1dGFXNUVZWFJsTG5ObGRFaHZkWEp6S0RBc0lEQXNJREFzSURBcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5DKzBML1JodEM0MExnZzBMVFF1OUdQSU5HTjBMclJnTkN3MEwzUXZ0Q3lJTkMvMEw0ZzBZUFF2TkMrMEx2Umg5Q3cwTDNRdU5HT1hISmNiaUFnSUNCMGFHbHpMbTl3ZEdsdmJuTXVZbkpsWVd0d2IybHVkSE5iZEdocGN5NWZZbkpsWVd0d2IybHVkQ0E5SURCZElEMGdUMkpxWldOMExtRnpjMmxuYmloN2ZTd2dkR2hwY3k1dmNIUnBiMjV6S1R0Y2NseHVYSEpjYmlBZ0lDQXZMeURSZ3RDMTBMclJnOUdKMExqUXVTRFF0TkMxMEwzUmpGeHlYRzRnSUNBZ2RHaHBjeTVmZEc5a1lYa2dQU0J1WlhjZ1JHRjBaU2dwTzF4eVhHNGdJQ0FnZEdocGN5NWZkRzlrWVhrdWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmx4eVhHNGdJQ0FnZEdocGN5NWZKSEJwWTJ0bGNpQTlJSFJvYVhNdVh5UmpjbVZoZEdWRmJHVnRaVzUwS0Z4eVhHNGdJQ0FnSUNBZ0lHQThaR2wySUdOc1lYTnpQVndpUkdGMFpYSmhibWRsY0dsamEyVnlYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ1I3ZEdocGN5NXZjSFJwYjI1ekxtbHVkR1Z5Ym1Gc1NXNXdkWFJ6SUQ5Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHQThaR2wySUdOc1lYTnpQVndpUkdGMFpYSmhibWRsY0dsamEyVnlYMTlwYm5CMWRITmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWtlM1JvYVhNdWIzQjBhVzl1Y3k1emFXNW5iR1ZOYjJSbFhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEOGdZRHhwYm5CMWRDQjBlWEJsUFZ3aWFHbGtaR1Z1WENJZ2JtRnRaVDFjSW1SaGRHVmNJajVnWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSURvZ1lEeHBibkIxZENCMGVYQmxQVndpYUdsa1pHVnVYQ0lnYm1GdFpUMWNJbVJoZEdWZlpuSnZiVndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThhVzV3ZFhRZ2RIbHdaVDFjSW1ocFpHUmxibHdpSUc1aGJXVTlYQ0prWVhSbFgzUnZYQ0krWUZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbUFnT2lBbkoxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSkVZWFJsY21GdVoyVndhV05yWlhKZlgyMXZiblJvYzF3aVBqd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aVJHRjBaWEpoYm1kbGNHbGphMlZ5WDE5MGIyOXNkR2x3WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpUkdGMFpYSmhibWRsY0dsamEyVnlYMTkwYjI5c2RHbHdMV052Ym5SbGJuUmNJajQ4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ1BDOWthWFkrWUZ4eVhHNGdJQ0FnS1R0Y2NseHVYSEpjYmlBZ0lDQXZMeURSamRDNzBMWFF2TkMxMEwzUmd0R0xYSEpjYmlBZ0lDQjBhR2x6TGw4a2JXOXVkR2h6SUNBZ0lDQWdJQ0FnUFNCMGFHbHpMbDhrY0dsamEyVnlMbkYxWlhKNVUyVnNaV04wYjNJb0p5NUVZWFJsY21GdVoyVndhV05yWlhKZlgyMXZiblJvY3ljcE8xeHlYRzRnSUNBZ2RHaHBjeTVmSkhSdmIyeDBhWEFnSUNBZ0lDQWdJRDBnZEdocGN5NWZKSEJwWTJ0bGNpNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVJHRjBaWEpoYm1kbGNHbGphMlZ5WDE5MGIyOXNkR2x3SnlrN1hISmNiaUFnSUNCMGFHbHpMbDhrZEc5dmJIUnBjRU52Ym5SbGJuUWdQU0IwYUdsekxsOGtjR2xqYTJWeUxuRjFaWEo1VTJWc1pXTjBiM0lvSnk1RVlYUmxjbUZ1WjJWd2FXTnJaWEpmWDNSdmIyeDBhWEF0WTI5dWRHVnVkQ2NwTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkMvMEw3UXU5R1BJTkN5MExMUXZ0QzAwTEJjY2x4dUlDQWdJSFJvYVhNdVh5UnBibkIxZEhNZ1BTQjBhR2x6TGw4a2NHbGphMlZ5TG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvSjJsdWNIVjBXMjVoYldWZVBWd2laR0YwWlZ3aVhTY3BPMXh5WEc1Y2NseHVJQ0FnSUM4dklOQzQwTDNRdU5HRzBMalFzTkM3MExqUXQ5Q3cwWWJRdU5HUElOR0IwTDdSZ2RHQzBMN1JqOUM5MExqUXVWeHlYRzRnSUNBZ2RHaHBjeTV5WVc1blpWSmxjMlYwS0NrN1hISmNibHh5WEc0Z0lDQWdMeThnMFlEUXRkQzkwTFRRdGRHQVhISmNiaUFnSUNCMGFHbHpMbDl6Wld4bFkzUkVZWFJsS0hSb2FYTXViM0IwYVc5dWN5NXRhVzVFWVhSbEtUdGNjbHh1SUNBZ0lIUm9hWE11WHlSamIyNTBZV2x1WlhJdVlYQndaVzVrUTJocGJHUW9kR2hwY3k1ZkpIQnBZMnRsY2lrN1hISmNibHh5WEc0Z0lDQWdMeThnMEw3UXNkR0EwTERRc2RDKzBZTFF1dEN3SU5DeDBZRFF0ZEM1MExyUXY5QyswTGpRdmRHQzBMN1FzbHh5WEc0Z0lDQWdhV1lnS0U5aWFtVmpkQzVyWlhsektIUm9hWE11YjNCMGFXOXVjeTVpY21WaGEzQnZhVzUwY3lrdWJHVnVaM1JvS1NCN1hISmNiaUFnSUNBZ0lDQWdkMmx1Wkc5M0xtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0ozSmxjMmw2WlNjc0lIUm9hWE11WDI5dVYybHVaRzkzVW1WemFYcGxSWFpsYm5RdVltbHVaQ2gwYUdsektTazdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZiMjVYYVc1a2IzZFNaWE5wZW1WRmRtVnVkQ2dwTzF4eVhHNGdJQ0FnZlZ4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSjNRc05DMzBMTFFzTkM5MExqUXRTRFF2TkMxMFlIUmo5R0cwTEJjY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ29nUUhKbGRIVnliaUI3VTNSeWFXNW5mVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSTmIyNTBhRVp2Y20xaGRIUmxaQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJR052Ym5OMElIUnBkR3hsSUQwZ2RHaHBjeTVuWlhSRVlYUmxWR2x0WlVadmNtMWhkQ2hrWVhSbExDQjdiVzl1ZEdnNklDZHNiMjVuSjMwcE8xeHlYRzRnSUNBZ2NtVjBkWEp1SUhScGRHeGxMbk5zYVdObEtEQXNJREVwTG5SdlZYQndaWEpEWVhObEtDa2dLeUIwYVhSc1pTNXpiR2xqWlNneEtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DazBMN1JnTkM4MExEUmd0QzQwWURRdnRDeTBMRFF2ZEM0MExVZzBMVFFzTkdDMFlzZzBMVFF1OUdQSU5HQzBMWFF1dEdEMFluUXRkQzVJTkM3MEw3UXV0Q3cwTHZRdUZ4eVhHNGdLaUJBY0dGeVlXMGdJSHRFWVhSbGZTQWdJR1JoZEdVZ0lDQWcwSjdRc2RHSzBMWFF1dEdDSU5DMDBMRFJndEdMWEhKY2JpQXFJRUJ3WVhKaGJTQWdlMDlpYW1WamRIMGdiM0IwYVc5dWN5RFFuOUN3MFlEUXNOQzgwTFhSZ3RHQTBZdGNjbHh1SUNvZ1FISmxkSFZ5YmlCN1UzUnlhVzVuZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1blpYUkVZWFJsVkdsdFpVWnZjbTFoZENBOUlHWjFibU4wYVc5dUtHUmhkR1VzSUc5d2RHbHZibk1wSUh0Y2NseHVJQ0FnSUhKbGRIVnliaUJKYm5Sc0xrUmhkR1ZVYVcxbFJtOXliV0YwS0hSb2FYTXViM0IwYVc5dWN5NXNiMk5oYkdVc0lHOXdkR2x2Ym5NcExtWnZjbTFoZENoa1lYUmxLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ1UwTDNRdUNEUXZkQzEwTFRRdGRDNzBMaGNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVaMlYwVjJWbGEwUmhlWE5HYjNKdFlYUjBaV1FnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lHTnZibk4wSUdSaGRHVWdQU0J1WlhjZ1JHRjBaU2dwTzF4eVhHNGdJQ0FnWTI5dWMzUWdjbVZ6ZFd4MElEMGdXMTA3WEhKY2JseHlYRzRnSUNBZ1pHRjBaUzV6WlhSRVlYUmxLR1JoZEdVdVoyVjBSR0YwWlNncElDMGdNaWs3WEhKY2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SURjN0lDc3JhU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHUmhkR1V1YzJWMFJHRjBaU2hrWVhSbExtZGxkRVJoZEdVb0tTQXJJREVwTzF4eVhHNGdJQ0FnSUNBZ0lISmxjM1ZzZEM1d2RYTm9LSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdaR0Y1T2lCa1lYUmxMbWRsZEVSaGVTZ3BMRnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhWFJzWlRvZ2RHaHBjeTVuWlhSRVlYUmxWR2x0WlVadmNtMWhkQ2hrWVhSbExDQjdkMlZsYTJSaGVUb2dKM05vYjNKMEozMHBMRnh5WEc0Z0lDQWdJQ0FnSUgwcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5HQjBMN1JnTkdDMExqUmdOQyswTExRdXRDd0lOR0IwTDdRczlDNzBMRFJnZEM5MEw0ZzBMM1FzTkdCMFlMUmdOQyswTFhRdmRDOTBMN1F2TkdESU5DLzBMWFJnTkN5MEw3UXZOR0RJTkMwMEwzUmppRFF2ZEMxMExUUXRkQzcwTGhjY2x4dUlDQWdJSEpsYzNWc2RDNXpiM0owS0NoaExDQmlLU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1ptbHljM1JFWVhsUFpsUm9aVmRsWldzZ1BTQjBhR2x6TG05d2RHbHZibk11Wm1seWMzUkVZWGxQWmxSb1pWZGxaV3NnSlNBM08xeHlYRzRnSUNBZ0lDQWdJR3hsZENCa1lYbEJJRDBnWVM1a1lYazdYSEpjYmlBZ0lDQWdJQ0FnYkdWMElHUmhlVUlnUFNCaUxtUmhlVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdhV1lnS0dSaGVVRWdQVDBnWm1seWMzUkVZWGxQWmxSb1pWZGxaV3NwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQzB4TzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLR1JoZVVJZ1BUMGdabWx5YzNSRVlYbFBabFJvWlZkbFpXc3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlERTdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb1pHRjVRU0E4SUdacGNuTjBSR0Y1VDJaVWFHVlhaV1ZyS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGVVRWdLejBnY21WemRXeDBMbXhsYm1kMGFEdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJR2xtSUNoa1lYbENJRHdnWm1seWMzUkVZWGxQWmxSb1pWZGxaV3NwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWkdGNVFpQXJQU0J5WlhOMWJIUXViR1Z1WjNSb08xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHUmhlVUVnTFNCa1lYbENPMXh5WEc0Z0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ2NtVjBkWEp1SUhKbGMzVnNkRHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2EwTDdRdTlDNDBZZlF0ZEdCMFlMUXN0QytJTkMwMEwzUXRkQzVJTkN5SU5DODBMWFJnZEdQMFliUXRWeHlYRzRnS2lCQWNHRnlZVzBnSUh0RVlYUmxmU0JrWVhSbElOQ2UwTEhSaXRDMTBMclJnaURRdE5DdzBZTFJpMXh5WEc0Z0tpQkFjbVYwZFhKdUlIdE9kVzFpWlhKOUlDQWdJTkNhMEw3UXU5QzQwWWZRdGRHQjBZTFFzdEMrSU5DMDBMM1F0ZEM1WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG1kbGRFUmhlWE5EYjNWdWRFbHVUVzl1ZEdnZ1BTQm1kVzVqZEdsdmJpaGtZWFJsS1NCN1hISmNiaUFnSUNCamIyNXpkQ0JrWVhseklEMGdibVYzSUVSaGRHVW9aR0YwWlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ1pHRjVjeTV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVJQ0FnSUdSaGVYTXVjMlYwVFc5dWRHZ29aR0Y1Y3k1blpYUk5iMjUwYUNncElDc2dNU2s3WEhKY2JpQWdJQ0JrWVhsekxuTmxkRVJoZEdVb01DazdYSEpjYmlBZ0lDQnlaWFIxY200Z1pHRjVjeTVuWlhSRVlYUmxLQ2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvZEN4MFlEUXZ0R0JJTkN5MFl2UXROQzEwTHZRdGRDOTBMM1JpOUdGSU5DMDBMRFJnbHh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzV5WVc1blpWSmxjMlYwSUQwZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGSmxjMlYwS0NrN1hISmNiaUFnSUNCMGFHbHpMbDl6Wld4bFkzUnBiMjRnUFNCN2ZUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DUzBZdlF0TkMxMEx2UXRkQzkwTGpRdFNEUXROQzQwTERRdjlDdzBMZlF2dEM5MExBZzBMVFFzTkdDWEhKY2JpQXFJRUJ3WVhKaGJTQjdSR0YwWlgwZ1pHRjBaVjltY205dElOQ2QwTERSaDlDdzBMdlJqTkM5MExEUmp5RFF0TkN3MFlMUXNGeHlYRzRnS2lCQWNHRnlZVzBnZTBSaGRHVjlJR1JoZEdWZmRHOGdJQ0RRbXRDKzBMM1F0ZEdIMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbkpoYm1kbFUyVnNaV04wSUQwZ1puVnVZM1JwYjI0b1pHRjBaVjltY205dExDQmtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQmtZWFJsWDJaeWIyMHVjMlYwU0c5MWNuTW9NQ3dnTUN3Z01Dd2dNQ2s3WEhKY2JpQWdJQ0JrWVhSbFgzUnZMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkMwMEw3UXY5R0QwWUhSZ3RDNDBMelJpOUM1SU5DMDBMalFzTkMvMExEUXQ5QyswTDFjY2x4dUlDQWdJR2xtSUNnaGRHaHBjeTVuWlhSSmMxSmhibWRsVTJWc1pXTjBZV0pzWlNoa1lYUmxYMlp5YjIwc0lHUmhkR1ZmZEc4cEtTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdOdmJuTjBJQ1JrWVhsZlpuSnZiU0E5SUhSb2FYTXVYeVJuWlhSRVlYbENlVVJoZEdVb1pHRjBaVjltY205dEtUdGNjbHh1SUNBZ0lHTnZibk4wSUNSa1lYbGZkRzhnUFNCMGFHbHpMbDhrWjJWMFJHRjVRbmxFWVhSbEtHUmhkR1ZmZEc4cE8xeHlYRzVjY2x4dUlDQWdJR2xtSUNna1pHRjVYMlp5YjIwcElIdGNjbHh1SUNBZ0lDQWdJQ0FrWkdGNVgyWnliMjB1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRabkp2YlNjcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJR2xtSUNna1pHRjVYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdKR1JoZVY5MGJ5NWpiR0Z6YzB4cGMzUXVZV1JrS0NkcGN5MXpaV3hsWTNSbFpDY3NJQ2RwY3kxelpXeGxZM1JsWkMxMGJ5Y3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQ3kwWXZRdE5DMTBMdlF0ZEM5MExqUXRTRFJqZEM3MExYUXZOQzEwTDNSZ3RDKzBMSmNjbHh1SUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wS0dSaGRHVmZabkp2YlN3Z1pHRjBaVjkwYnlrN1hISmNibHh5WEc0Z0lDQWdMeThnMExMUmk5Q3gwTDdSZ0NEUXROQ3cwWUlnMExJZzBMN1FzZEdBMExEUmd0QzkwTDdRdkNEUXY5QyswWURSajlDMDBMclF0Vnh5WEc0Z0lDQWdhV1lnS0dSaGRHVmZabkp2YlNBK0lHUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0JiWkdGMFpWOW1jbTl0TENCa1lYUmxYM1J2WFNBOUlGdGtZWFJsWDNSdkxDQmtZWFJsWDJaeWIyMWRPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQyswTEhRdmRDKzBMTFF1OUMxMEwzUXVOQzFJTkM0MEwzUXY5R0QwWUxRdnRDeVhISmNiaUFnSUNCcFppQW9kR2hwY3k1ZkpHbHVjSFYwYzF0SlRrUkZXRjlFUVZSRlgwWlNUMDFkS1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZkpHbHVjSFYwYzF0SlRrUkZXRjlFUVZSRlgwWlNUMDFkTG5aaGJIVmxJRDBnZEdocGN5NW1iM0p0WVhSRVlYUmxLR1JoZEdWZlpuSnZiU2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2FXWWdLSFJvYVhNdVh5UnBibkIxZEhOYlNVNUVSVmhmUkVGVVJWOVVUMTBwSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw4a2FXNXdkWFJ6VzBsT1JFVllYMFJCVkVWZlZFOWRMblpoYkhWbElEMGdkR2hwY3k1bWIzSnRZWFJFWVhSbEtHUmhkR1ZmZEc4cE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5HQjBMN1FzZEdMMFlMUXVOQzFYSEpjYmlBZ0lDQjBhR2x6TGw5allXeHNZbUZqYXlnbmNtRnVaMlZUWld4bFkzUW5MQ0JrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzhwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwS1RRdnRHQTBMelFzTkdDMExqUmdOQyswTExRc05DOTBMalF0U0RRdE5DdzBZTFJpMXh5WEc0Z0tpQkFjR0Z5WVcwZ0lIdEVZWFJsZlNBZ0lHUmhkR1VnSUNEUW50Q3gwWXJRdGRDNjBZSWcwTFRRc05HQzBZdGNjbHh1SUNvZ1FIQmhjbUZ0SUNCN1UzUnlhVzVuZlNCbWIzSnRZWFFnMEtUUXZ0R0EwTHpRc05HQ0lOR0IwWUxSZ05DKzBMclF1Rnh5WEc0Z0tpQkFjbVYwZFhKdUlIdFRkSEpwYm1kOVhISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExtWnZjbTFoZEVSaGRHVWdQU0JtZFc1amRHbHZiaWhrWVhSbExDQm1iM0p0WVhRZ1BTQW5XUzF0TFdRbktTQjdYSEpjYmlBZ0lDQnlaWFIxY200Z1ptOXliV0YwTG5KbGNHeGhZMlVvSjFrbkxDQmtZWFJsTG1kbGRFWjFiR3haWldGeUtDa3BYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTG5KbGNHeGhZMlVvSjIwbkxDQW9KekFuSUNzZ0tHUmhkR1V1WjJWMFRXOXVkR2dvS1NBcklERXBLUzV6YkdsalpTZ3RNaWtwWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0xuSmxjR3hoWTJVb0oyUW5MQ0FvSnpBbklDc2dLR1JoZEdVdVoyVjBSR0YwWlNncEtTa3VjMnhwWTJVb0xUSXBLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2YwWURRdnRDeTBMWFJnTkM2MExBZzBMTFF2dEMzMEx6UXZ0QzIwTDNRdnRHQjBZTFF1Q0RRc3RHTDBMVFF0ZEM3MExYUXZkQzQwWThnMExUUXNOR0NYSEpjYmlBcUlFQndZWEpoYlNBZ2UwUmhkR1VnWkdGMFpWOW1jbTl0SU5DZDBMRFJoOUN3MEx2UmpOQzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdLaUJBY0dGeVlXMGdJSHRFWVhSbElHUmhkR1ZmZEc4Z0lDRFFtdEMrMEwzUXRkR0gwTDNRc05HUElOQzAwTERSZ3RDd1hISmNiaUFxSUVCeVpYUjFjbTRnZTBKdmIyeGxZVzU5WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG1kbGRFbHpVbUZ1WjJWVFpXeGxZM1JoWW14bElEMGdablZ1WTNScGIyNG9aR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0JrWVhSbFgyWnliMjB1YzJWMFNHOTFjbk1vTUN3Z01Dd2dNQ3dnTUNrN1hISmNiaUFnSUNCa1lYUmxYM1J2TG5ObGRFaHZkWEp6S0RBc0lEQXNJREFzSURBcE8xeHlYRzVjY2x4dUlDQWdJR2xtSUNoa1lYUmxYMlp5YjIwZ1BpQmtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnVzJSaGRHVmZabkp2YlN3Z1pHRjBaVjkwYjEwZ1BTQmJaR0YwWlY5MGJ5d2daR0YwWlY5bWNtOXRYVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFF2TkM0MEwzUXVOQzgwTERRdTlHTTBMM1JpOUM1SU5DMDBMalFzTkMvMExEUXQ5QyswTDFjY2x4dUlDQWdJR052Ym5OMElHUnBabVlnUFNCTllYUm9MbUZpY3loa1lYUmxYMlp5YjIwdVoyVjBWR2x0WlNncElDMGdaR0YwWlY5MGJ5NW5aWFJVYVcxbEtDa3BJQzhnTVRBd01DQXZJRGcyTkRBd08xeHlYRzRnSUNBZ2FXWWdLR1JwWm1ZZ1BDQjBhR2x6TG05d2RHbHZibk11YldsdVJHRjVjeWtnZTF4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFF2OUdBMEw3UXN0QzEwWURRdXRDd0lOQy8wTDdRdjlDdzBMVFFzTkM5MExqUmp5RFFzaURRdE5DNDBMRFF2OUN3MExmUXZ0QzlJTkMzMExEUXNkQzcwTDdRdXRDNDBZRFF2dEN5MExEUXZkQzkwWXZSaFNEUXROQ3cwWUpjY2x4dUlDQWdJR052Ym5OMElHUmhlU0E5SUc1bGR5QkVZWFJsS0NrN1hISmNiaUFnSUNCa1lYa3VjMlYwVkdsdFpTaGtZWFJsWDJaeWIyMHVaMlYwVkdsdFpTZ3BLVHRjY2x4dVhISmNiaUFnSUNCM2FHbHNaU0FvWkdGNUlEd2daR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG1kbGRFUmhlVXh2WTJ0bFpDaGtZWGtwS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJR1JoZVM1elpYUkVZWFJsS0dSaGVTNW5aWFJFWVhSbEtDa2dLeUF4S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnlaWFIxY200Z2RISjFaVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2YwWURRdnRDeTBMWFJnTkM2MExBZzBMM1FzQ0RRdE5DKzBZSFJndEdEMEwvUXZkQyswWUhSZ3RHTUlOQzAwTDNSanlEUXROQzcwWThnMExIUmdOQyswTDNRdUZ4eVhHNGdLaUJBY0dGeVlXMGdJSHRFWVhSbGZTQmtZWFJsSU5DVTBMRFJndEN3WEhKY2JpQXFJRUJ5WlhSMWNtNGdlMEp2YjJ4bFlXNTlJQ0FnZEhKMVpTRFF0ZEdCMEx2UXVDRFF0TkMrMFlIUmd0R0QwTC9RdGRDOVhISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExtZGxkRVJoZVV4dlkydGxaQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJQzh2SU5DeTBZdlFzZEMrMFlBZzBMVFFzTkdDSU5DeTBMM1F0U0RRdE5DKzBZSFJndEdEMEwvUXZkQyswTFBRdmlEUXROQzQwTERRdjlDdzBMZlF2dEM5MExCY2NseHVJQ0FnSUdsbUlDaGtZWFJsSUR3Z2RHaHBjeTV2Y0hScGIyNXpMbTFwYmtSaGRHVWdmSHdnWkdGMFpTQStJSFJvYVhNdWIzQjBhVzl1Y3k1dFlYaEVZWFJsS1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlFeFBRMHRmVlU1QlZrRkpURUZDVEVVN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11YjNCMGFXOXVjeTVtYVd4MFpYSXViRzlqYTBSaGVYTXVZMkZzYkNoMGFHbHpMQ0JrWVhSbEtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DUzBZdlFzZEdBMExEUXZkQzkwTERSanlEUXZkQ3cwWWZRc05DNzBZelF2ZEN3MFk4ZzBMVFFzTkdDMExCY2NseHVJQ29nUUhKbGRIVnliaUI3UkdGMFpYMGcwSlRRc05HQzBMQmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVaMlYwUkdGMFpVWnliMjBnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbDluWlhSRVlYUmxSbkp2YlVsdWNIVjBLRWxPUkVWWVgwUkJWRVZmUmxKUFRTazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUWt0R0wwTEhSZ05DdzBMM1F2ZEN3MFk4ZzBMVFFzTkdDMExBZ0tITnBibWRzWlUxdlpHVTZJSFJ5ZFdVcFhISmNiaUFxSUVCeVpYUjFjbTRnZTBSaGRHVjlJTkNVMExEUmd0Q3dYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbWRsZEVSaGRHVWdQU0JFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbWRsZEVSaGRHVkdjbTl0TzF4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DUzBZdlFzZEdBMExEUXZkQzkwTERSanlEUXV0QyswTDNRdGRHSDBMM1FzTkdQSU5DMDBMRFJndEN3WEhKY2JpQXFJRUJ5WlhSMWNtNGdlMFJoZEdWOUlOQ1UwTERSZ3RDd1hISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExtZGxkRVJoZEdWVWJ5QTlJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdVgyZGxkRVJoZEdWR2NtOXRTVzV3ZFhRb1NVNUVSVmhmUkVGVVJWOVVUeWs3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvZEM2MEx2UXZ0QzkwTFhRdmRDNDBMVWdLREVnMExIUXZ0Q3gwWkhSZ0N3Z01pRFFzZEMrMExIUmdOQ3dMQ0ExSU5DeDBMN1FzZEdBMEw3UXNpbGNjbHh1SUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNCMllXeDFaU0RRbXRDKzBMdlF1TkdIMExYUmdkR0MwTExRdmx4eVhHNGdLaUJBY0dGeVlXMGdJSHRCY25KaGVYMGdJR1p2Y20xeklOQ2MwTERSZ2RHQjBMalFzaURRdU5DM0lEUFJoU0RSamRDNzBMWFF2TkMxMEwzUmd0QyswTElzSU5DODBMN1F0dEMxMFlJZzBZSFF2dEMwMExYUmdOQzIwTERSZ3RHTUlOR0IwTC9RdGRHRzBMalJoTkM0MExyUXNOR0MwTDdSZ0NBbFpDRFF0TkM3MFk4ZzBMZlFzTkM4MExYUXZkR0xYSEpjYmlBcUlFQnlaWFIxY200Z2UxTjBjbWx1WjMxY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdWNHeDFjbUZzSUQwZ1puVnVZM1JwYjI0Z0tIWmhiSFZsTENCbWIzSnRjeWtnZTF4eVhHNGdJQ0FnY21WMGRYSnVJQ2gyWVd4MVpTQWxJREV3SUQwOUlERWdKaVlnZG1Gc2RXVWdKU0F4TURBZ0lUMGdNVEVnUHlCbWIzSnRjMXN3WFNBNklDaDJZV3gxWlNBbElERXdJRDQ5SURJZ0ppWWdkbUZzZFdVZ0pTQXhNQ0E4UFNBMElDWW1JQ2gyWVd4MVpTQWxJREV3TUNBOElERXdJSHg4SUhaaGJIVmxJQ1VnTVRBd0lENDlJREl3S1NBL0lHWnZjbTF6V3pGZElEb2dabTl5YlhOYk1sMHBLUzV5WlhCc1lXTmxLQ2NsWkNjc0lIWmhiSFZsS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNTMFl2UXNkR0EwTERRdmRDOTBMRFJqeURRdE5DdzBZTFFzRnh5WEc0Z0tpQkFjR0Z5WVcwZ0lIdE9kVzFpWlhKOUlHbHVaR1Y0SU5DWTBMM1F0TkMxMExyUmdTRFF1TkM5MEwvUmc5R0MwTEJjY2x4dUlDb2dRSEpsZEhWeWJpQjdSR0YwWlgwZ0lDQWdJQ0FnSUNEUWxOQ3cwWUxRc0NEUXVOQzcwTGdnZFc1a1pXWnBibVZrWEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw5blpYUkVZWFJsUm5KdmJVbHVjSFYwSUQwZ1puVnVZM1JwYjI0b2FXNWtaWGdwSUh0Y2NseHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOGthVzV3ZFhSelcybHVaR1Y0WFNBL0lHNWxkeUJFWVhSbEtIUm9hWE11WHlScGJuQjFkSE5iYVc1a1pYaGRMblpoYkhWbEtTQTZJSFZ1WkdWbWFXNWxaRHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2cwTFhRdmRDMDBMWFJnQ0RRdE5DNDBMRFF2OUN3MExmUXZ0QzkwTEFnMEx6UXRkR0IwWS9SaHRDMTBMSmNjbHh1SUNvZ1FIQmhjbUZ0SUh0RVlYUmxmU0JrWVhSbFgyWnliMjBnMEozUXNOR0gwTERRdTlHTTBMM1FzTkdQSU5DMDBMRFJndEN3WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw4a1kzSmxZWFJsVFc5dWRHaHpJRDBnWm5WdVkzUnBiMjRvWkdGMFpWOW1jbTl0S1NCN1hISmNiaUFnSUNCM2FHbHNaU0FvZEdocGN5NWZKRzF2Ym5Sb2N5NXNZWE4wUld4bGJXVnVkRU5vYVd4a0tTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZKRzF2Ym5Sb2N5NXlaVzF2ZG1WRGFHbHNaQ2gwYUdsekxsOGtiVzl1ZEdoekxteGhjM1JGYkdWdFpXNTBRMmhwYkdRcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5DLzBZRFJqOUdIMExYUXZDRFF2OUMrMExUUmdkQzYwTERRdDlDNjBZTmNjbHh1SUNBZ0lIUm9hWE11WDNSdmIyeDBhWEJJYVdSbEtDazdYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBML1JnTkMxMFlEUXRkQzkwTFRRdGRHQUlOQzgwTFhSZ2RHUDBZYlF0ZEN5WEhKY2JpQWdJQ0JqYjI1emRDQmpkWEp5Wlc1MFJHRjBaU0E5SUc1bGR5QkVZWFJsS0dSaGRHVmZabkp2YlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ1kyOXVjM1FnSkcxdmJuUm9jeUE5SUZ0ZE8xeHlYRzRnSUNBZ1ptOXlJQ2hzWlhRZ2FTQTlJREE3SUdrZ1BDQjBhR2x6TG05d2RHbHZibk11Ylc5dWRHaHpRMjkxYm5RN0lDc3JhU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDUnRiMjUwYUhNdWNIVnphQ2gwYUdsekxsOGtZM0psWVhSbFRXOXVkR2dvWTNWeWNtVnVkRVJoZEdVcEtUdGNjbHh1SUNBZ0lDQWdJQ0JqZFhKeVpXNTBSR0YwWlM1elpYUk5iMjUwYUNoamRYSnlaVzUwUkdGMFpTNW5aWFJOYjI1MGFDZ3BJQ3NnTVNrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMFlEUXRkQzkwTFRRdGRHQVhISmNiaUFnSUNCbWIzSWdLR3hsZENCcElEMGdNRHNnYVNBOElDUnRiMjUwYUhNdWJHVnVaM1JvT3lCcElDczlJSFJvYVhNdWIzQjBhVzl1Y3k1d1pYSlNiM2NwSUh0Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENBa2NtOTNJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDZ25aR2wySnlrN1hISmNiaUFnSUNBZ0lDQWdKSEp2ZHk1amJHRnpjMDVoYldVZ1BTQW5SR0YwWlhKaGJtZGxjR2xqYTJWeVgxOXliM2NuTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FrYlc5dWRHaHpMbk5zYVdObEtHa3NJR2tnS3lCMGFHbHpMbTl3ZEdsdmJuTXVjR1Z5VW05M0tTNW1iM0pGWVdOb0tDUnRiMjUwYUNBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDUnliM2N1WVhCd1pXNWtRMmhwYkdRb0pHMXZiblJvS1R0Y2NseHVJQ0FnSUNBZ0lDQjlLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZkpHMXZiblJvY3k1aGNIQmxibVJEYUdsc1pDZ2tjbTkzS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU0I4ZkNCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wS0hSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBzSUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZLVHRjY2x4dUlDQWdJSDFjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2cwTFhRdmRDMDBMWFJnQ0RRdk5DMTBZSFJqOUdHMExCY2NseHVJQ29nUUhCaGNtRnRJSHRFWVhSbGZTQmtZWFJsSU5DYzBMWFJnZEdQMFlaY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVh5UmpjbVZoZEdWTmIyNTBhQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJR052Ym5OMElHTjFjbkpsYm5STmIyNTBhQ0E5SUdSaGRHVXVaMlYwVFc5dWRHZ29LVHRjY2x4dUlDQWdJR052Ym5OMElHMXZiblJvVkdsMGJHVWdQU0IwYUdsekxtZGxkRTF2Ym5Sb1JtOXliV0YwZEdWa0tHUmhkR1VwTzF4eVhHNGdJQ0FnWTI5dWMzUWdkMlZsYTBSaGVYTWdQU0IwYUdsekxtZGxkRmRsWld0RVlYbHpSbTl5YldGMGRHVmtLQ2s3WEhKY2JseHlYRzRnSUNBZ1kyOXVjM1FnSkcxdmJuUm9JRDBnZEdocGN5NWZKR055WldGMFpVVnNaVzFsYm5Rb1hISmNiaUFnSUNBZ0lDQWdZRHhrYVhZZ1kyeGhjM005WENKTmIyNTBhRndpSUdSaGRHRXRkR2x0WlQxY0lpUjdaR0YwWlM1blpYUlVhVzFsS0NsOVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGOWZhR1ZoWkdWeVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aVRXOXVkR2hmWDJGeWNtOTNJRTF2Ym5Sb1gxOWhjbkp2ZHkwdGNISmxkaVI3S0hSb2FYTXViM0IwYVc5dWN5NXRhVzVFWVhSbElDWW1JR1JoZEdVZ1BEMGdkR2hwY3k1dmNIUnBiMjV6TG0xcGJrUmhkR1VwSUQ4Z0p5QnBjeTFrYVhOaFlteGxaQ2NnT2lBbkozMWNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM1puSUhkcFpIUm9QVndpT0Z3aUlHaGxhV2RvZEQxY0lqRTBYQ0lnZG1sbGQwSnZlRDFjSWpBZ01DQTRJREUwWENJZ1ptbHNiRDFjSW01dmJtVmNJaUI0Yld4dWN6MWNJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5YQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4d1lYUm9JR1E5WENKTk55QXhNMHd4SURkTU55QXhYQ0lnYzNSeWIydGxQVndpSXpoRE9FTTRRMXdpSUhOMGNtOXJaUzEzYVdSMGFEMWNJakpjSWlCemRISnZhMlV0YkdsdVpXTmhjRDFjSW5KdmRXNWtYQ0lnYzNSeWIydGxMV3hwYm1WcWIybHVQVndpY205MWJtUmNJajQ4TDNCaGRHZytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpkbWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUY5ZmRHbDBiR1ZjSWo0a2UyMXZiblJvVkdsMGJHVjlJQ1I3WkdGMFpTNW5aWFJHZFd4c1dXVmhjaWdwZlR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrMXZiblJvWDE5aGNuSnZkeUJOYjI1MGFGOWZZWEp5YjNjdExXNWxlSFFrZXloMGFHbHpMbTl3ZEdsdmJuTXViV0Y0UkdGMFpTQW1KaUJrWVhSbElENDlJSFJvYVhNdWIzQjBhVzl1Y3k1dFlYaEVZWFJsS1NBL0lDY2dhWE10WkdsellXSnNaV1FuSURvZ0p5ZDlYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4yWnlCM2FXUjBhRDFjSWpoY0lpQm9aV2xuYUhROVhDSXhORndpSUhacFpYZENiM2c5WENJd0lEQWdPQ0F4TkZ3aUlHWnBiR3c5WENKdWIyNWxYQ0lnZUcxc2JuTTlYQ0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh5TURBd0wzTjJaMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGNHRjBhQ0JrUFZ3aVRURWdNQzQ1T1RrNU9UbE1OeUEzVERFZ01UTmNJaUJ6ZEhKdmEyVTlYQ0lqT0VNNFF6aERYQ0lnYzNSeWIydGxMWGRwWkhSb1BWd2lNbHdpSUhOMGNtOXJaUzFzYVc1bFkyRndQVndpY205MWJtUmNJaUJ6ZEhKdmEyVXRiR2x1WldwdmFXNDlYQ0p5YjNWdVpGd2lQand2Y0dGMGFENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzTjJaejVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrMXZiblJvWDE5M1pXVnJYQ0krSkh0M1pXVnJSR0Y1Y3k1dFlYQW9hWFJsYlNBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdZRHhrYVhZZ1kyeGhjM005WENKTmIyNTBhRjlmZDJWbGEyUmhlVndpUGlSN2FYUmxiUzUwYVhSc1pYMDhMMlJwZGo1Z1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUgwcExtcHZhVzRvSnljcGZUd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aVRXOXVkR2hmWDJSaGVYTmNJajQ4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWdYSEpjYmlBZ0lDQXBPMXh5WEc1Y2NseHVJQ0FnSUM4dklOR0IwWUxSZ05DMTBMdlF1dEM0WEhKY2JpQWdJQ0JiWEhKY2JpQWdJQ0FnSUNBZ2UzTmxiR1ZqZEc5eU9pQW5MazF2Ym5Sb1gxOWhjbkp2ZHkwdGNISmxkaWNzSUc1aGJXVTZJQ2R3Y21WMkozMHNYSEpjYmlBZ0lDQWdJQ0FnZTNObGJHVmpkRzl5T2lBbkxrMXZiblJvWDE5aGNuSnZkeTB0Ym1WNGRDY3NJRzVoYldVNklDZHVaWGgwSjMwc1hISmNiaUFnSUNCZExtWnZja1ZoWTJnb2FYUmxiU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ0pHRnljbTkzSUQwZ0pHMXZiblJvTG5GMVpYSjVVMlZzWldOMGIzSW9hWFJsYlM1elpXeGxZM1J2Y2lrN1hISmNiaUFnSUNBZ0lDQWdKR0Z5Y205M0xtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyTnNhV05ySnl3Z1pTQTlQaUI3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SU5DeTBZRFF0ZEM4MExYUXZkQzkwTERSanlEUXZOQzEwWURRc0N3ZzBMdlJnOUdIMFlqUXRTRFF2OUMxMFlEUXRkQ3kwTFhSZ05HQjBZTFFzTkdDMFl3c0lOQ3kwWXZRdmRDMTBZSFJndEM0SU5HQjBZTFJnTkMxMEx2UXV0QzRJTkMzMExBZzBML1JnTkMxMExUUXRkQzcwWXNnMEwvUXRkR0EwTFhSZ05DMTBZRFF1TkdCMEw3UXN0R0wwTExRc05DMTBMelF2dEM1SU5DKzBMSFF1OUN3MFlIUmd0QzRJTkMvMExqUXV0QzEwWURRc0Z4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JsTG5OMGIzQlFjbTl3WVdkaGRHbHZiaWdwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTVmYjI1QmNuSnZkME5zYVdOcktDUmhjbkp2ZHl3Z2FYUmxiUzV1WVcxbEtUdGNjbHh1SUNBZ0lDQWdJQ0I5S1R0Y2NseHVJQ0FnSUgwcE8xeHlYRzVjY2x4dUlDQWdJQzh2SU5HQTBMWFF2ZEMwMExYUmdDRFF0TkM5MExYUXVWeHlYRzRnSUNBZ1kyOXVjM1FnSkdSaGVYTWdQU0FrYlc5dWRHZ3VjWFZsY25sVFpXeGxZM1J2Y2lnbkxrMXZiblJvWDE5a1lYbHpKeWs3WEhKY2JpQWdJQ0JqYjI1emRDQmtZWGx6SUQwZ2JtVjNJRVJoZEdVb1pHRjBaUzVuWlhSVWFXMWxLQ2twTzF4eVhHNGdJQ0FnWkdGNWN5NXpaWFJFWVhSbEtERXBPMXh5WEc0Z0lDQWdaR0Y1Y3k1elpYUkliM1Z5Y3lnd0xDQXdMQ0F3TENBd0tUdGNjbHh1WEhKY2JpQWdJQ0IzYUdsc1pTQW9aR0Y1Y3k1blpYUk5iMjUwYUNncElEMDlJR04xY25KbGJuUk5iMjUwYUNrZ2UxeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElDUjNaV1ZySUQwZ2RHaHBjeTVmSkdOeVpXRjBaVmRsWldzb0tUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2QyVmxhMFJoZVhNdVptOXlSV0ZqYUNocGRHVnRJRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHUmhlWE11WjJWMFJHRjVLQ2tnSVQwZ2FYUmxiUzVrWVhrZ2ZId2daR0Y1Y3k1blpYUk5iMjUwYUNncElDRTlJR04xY25KbGJuUk5iMjUwYUNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdKSGRsWldzdVlYQndaVzVrUTJocGJHUW9kR2hwY3k1ZkpHTnlaV0YwWlVWdGNIUjVSR0Y1S0NrcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWtkMlZsYXk1aGNIQmxibVJEYUdsc1pDaDBhR2x6TGw4a1kzSmxZWFJsUkdGNUtHUmhlWE1wS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWkdGNWN5NXpaWFJFWVhSbEtHUmhlWE11WjJWMFJHRjBaU2dwSUNzZ01TazdYSEpjYmlBZ0lDQWdJQ0FnZlNrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUNSa1lYbHpMbUZ3Y0dWdVpFTm9hV3hrS0NSM1pXVnJLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCeVpYUjFjbTRnSkcxdmJuUm9PMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKclF1OUM0MExvZzBML1F2aURSZ2RHQzBZRFF0ZEM3MExyUXRTRFF2OUMxMFlEUXRkQzYwTHZSanRHSDBMWFF2ZEM0MFk4ZzBMelF0ZEdCMFkvUmh0Q3dYSEpjYmlBcUlFQndZWEpoYlNCN1JXeGxiV1Z1ZEgwZ0pHRnljbTkzSUVoVVRVd2cwWTNRdTlDMTBMelF0ZEM5MFlKY2NseHVJQ29nUUhCaGNtRnRJSHRUZEhKcGJtZDlJRzVoYldVZ0lDQWcwSmpRdk5HUElDaHdjbVYyTENCdVpYaDBLVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmYjI1QmNuSnZkME5zYVdOcklEMGdablZ1WTNScGIyNG9KR0Z5Y205M0xDQnVZVzFsS1NCN1hISmNiaUFnSUNCcFppQW9KR0Z5Y205M0xtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25hWE10WkdsellXSnNaV1FuS1NrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQmpiMjV6ZENCa1lYUmxJRDBnYm1WM0lFUmhkR1VvY0dGeWMyVkpiblFvZEdocGN5NWZKRzF2Ym5Sb2N5NXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVRXOXVkR2duS1M1a1lYUmhjMlYwTG5ScGJXVXNJREV3S1NrN1hISmNiaUFnSUNCa1lYUmxMbk5sZEUxdmJuUm9LR1JoZEdVdVoyVjBUVzl1ZEdnb0tTQXJJQ2h1WVcxbElEMDlJQ2R3Y21WMkp5QS9JQzEwYUdsekxtOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUWdPaUIwYUdsekxtOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUXBLVHRjY2x4dVhISmNiaUFnSUNBdkx5RFFzdEdMMFlYUXZ0QzBJTkMzMExBZzBML1JnTkMxMExUUXRkQzcwWXNnMEx6UXVOQzkwTGpRdk5DdzBMdlJqTkM5MEw3UXVTRFF0TkN3MFlMUmkxeHlYRzRnSUNBZ2FXWWdLR1JoZEdVZ1BDQjBhR2x6TG05d2RHbHZibk11YldsdVJHRjBaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHUmhkR1V1YzJWMFZHbHRaU2gwYUdsekxtOXdkR2x2Ym5NdWJXbHVSR0YwWlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5DeTBZdlJoZEMrMExRZzBMZlFzQ0RRdjlHQTBMWFF0TkMxMEx2Uml5RFF2TkN3MExyUmdkQzQwTHpRc05DNzBZelF2ZEMrMExrZzBMVFFzTkdDMFl0Y2NseHVJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11YldGNFJHRjBaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUdWdVpFUmhkR1VnUFNCdVpYY2dSR0YwWlNoa1lYUmxMbWRsZEZScGJXVW9LU2s3WEhKY2JpQWdJQ0FnSUNBZ1pXNWtSR0YwWlM1elpYUk5iMjUwYUNobGJtUkVZWFJsTG1kbGRFMXZiblJvS0NrZ0t5QjBhR2x6TG05d2RHbHZibk11Ylc5dWRHaHpRMjkxYm5RcE8xeHlYRzRnSUNBZ0lDQWdJR2xtSUNobGJtUkVZWFJsSUQ0Z2RHaHBjeTV2Y0hScGIyNXpMbTFoZUVSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdaR0YwWlM1elpYUlVhVzFsS0hSb2FYTXViM0IwYVc5dWN5NXRZWGhFWVhSbExtZGxkRlJwYldVb0tTazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHUmhkR1V1YzJWMFRXOXVkR2dvWkdGMFpTNW5aWFJOYjI1MGFDZ3BJQzBnZEdocGN5NXZjSFJwYjI1ekxtMXZiblJvYzBOdmRXNTBJQ3NnTVNrN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQy8wTFhSZ05DMTBZWFF2dEMwSU5DNklOQzkwTDdRc3RDKzBMa2cwTFRRc05HQzBMVmNjbHh1SUNBZ0lIUm9hWE11WDNObGJHVmpkRVJoZEdVb1pHRjBaU2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvOUdCMFlMUXNOQzkwTDdRc3RDNjBMQWcwWUxRdGRDNjBZUFJpZEMxMExrZzBMVFFzTkdDMFlzZzBZRWcwWURRdGRDOTBMVFF0ZEdBMEw3UXZGeHlYRzRnS2lCQWNHRnlZVzBnZTBSaGRHVjlJR1JoZEdVZzBKVFFzTkdDMExCY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgzTmxiR1ZqZEVSaGRHVWdQU0JtZFc1amRHbHZiaWhrWVhSbEtTQjdYSEpjYmlBZ0lDQjBhR2x6TGw5elpXeGxZM1JsWkVSaGRHVWdQU0JrWVhSbE8xeHlYRzRnSUNBZ2RHaHBjeTVmSkdOeVpXRjBaVTF2Ym5Sb2N5aGtZWFJsS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNnMExYUXZkQzAwTFhSZ0NEUXZkQzEwTFRRdGRDNzBMaGNjbHh1SUNvZ1FIQmhjbUZ0SUNCN1JHRjBaWDBnWkdGMFpTRFFudEN4MFlyUXRkQzYwWUlnMExUUXNOR0MwWXRjY2x4dUlDb2dRSEpsZEhWeWJpQjdSV3hsYldWdWRIMWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYeVJqY21WaGRHVlhaV1ZySUQwZ1puVnVZM1JwYjI0b1pHRjBaU2tnZTF4eVhHNGdJQ0FnWTI5dWMzUWdKSGRsWldzZ1BTQjBhR2x6TGw4a1kzSmxZWFJsUld4bGJXVnVkQ2hjY2x4dUlDQWdJQ0FnSUNCZ1BHUnBkaUJqYkdGemN6MWNJbGRsWld0Y0lqNDhMMlJwZGo1Z1hISmNiaUFnSUNBcE8xeHlYRzVjY2x4dUlDQWdJSEpsZEhWeWJpQWtkMlZsYXp0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNnMExYUXZkQzAwTFhSZ0NEUXROQzkwWTljY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ29nUUhKbGRIVnliaUI3Uld4bGJXVnVkSDFjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WHlSamNtVmhkR1ZFWVhrZ1BTQm1kVzVqZEdsdmJpaGtZWFJsS1NCN1hISmNiaUFnSUNCamIyNXpkQ0FrWkdGNUlEMGdkR2hwY3k1ZkpHTnlaV0YwWlVWc1pXMWxiblFvWEhKY2JpQWdJQ0FnSUNBZ1lEeGthWFlnWTJ4aGMzTTlYQ0pFWVhsY0lpQmtZWFJoTFhScGJXVTlYQ0lrZTJSaGRHVXVaMlYwVkdsdFpTZ3BmVndpSUdSaGRHRXRaR0Y1UFZ3aUpIdGtZWFJsTG1kbGRFUmhlU2dwZlZ3aVBpUjdaR0YwWlM1blpYUkVZWFJsS0NsOVBDOWthWFkrWUZ4eVhHNGdJQ0FnS1R0Y2NseHVYSEpjYmlBZ0lDQWtaR0Y1TG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJOc2FXTnJKeXdnZEdocGN5NWZiMjVFWVhsRGJHbGphMFYyWlc1MExtSnBibVFvZEdocGN5a3BPMXh5WEc1Y2NseHVJQ0FnSUdsbUlDZ2hkR2hwY3k1dmNIUnBiMjV6TG5OcGJtZHNaVTF2WkdVcElIdGNjbHh1SUNBZ0lDQWdJQ0FrWkdGNUxtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyMXZkWE5sWlc1MFpYSW5MQ0IwYUdsekxsOXZia1JoZVUxdmRYTmxSVzUwWlhKRmRtVnVkQzVpYVc1a0tIUm9hWE1wS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURRdnRDeDBMM1F2dEN5MEx2UXRkQzkwTGpRdFNEUmdkQyswWUhSZ3RDKzBZL1F2ZEM0MExsY2NseHVJQ0FnSUhSb2FYTXVYM1Z3WkdGMFpVUmhlU2drWkdGNUtUdGNjbHh1WEhKY2JpQWdJQ0J5WlhSMWNtNGdKR1JoZVR0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNlMExIUXZkQyswTExRdTlDMTBMM1F1TkMxSU5HQjBMN1JnZEdDMEw3Umo5QzkwTGpRdVZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1MWNHUmhkR1VnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lIUm9hWE11WHlSdGIyNTBhSE11Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2duTGsxdmJuUm9KeWt1Wm05eVJXRmphQ2drYlc5dWRHZ2dQVDRnZTF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNWd1pHRjBaVTF2Ym5Sb0tDUnRiMjUwYUNrN1hISmNiaUFnSUNCOUtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DZTBMSFF2ZEMrMExMUXU5QzEwTDNRdU5DMUlOR0IwTDdSZ2RHQzBMN1JqOUM5MExqUXVTRFF2TkMxMFlIUmo5R0cwTEJjY2x4dUlDb2dRSEJoY21GdElIdEZiR1Z0Wlc1MGZTQWtiVzl1ZEdnZzBLM1F1OUMxMEx6UXRkQzkwWUlnMEx6UXRkR0IwWS9SaHRDd1hISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOTFjR1JoZEdWTmIyNTBhQ0E5SUdaMWJtTjBhVzl1S0NSdGIyNTBhQ2tnZTF4eVhHNGdJQ0FnSkcxdmJuUm9MbkYxWlhKNVUyVnNaV04wYjNKQmJHd29KeTVFWVhsYlpHRjBZUzEwYVcxbFhTY3BMbVp2Y2tWaFkyZ29KR1JoZVNBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZkWEJrWVhSbFJHRjVLQ1JrWVhrcE8xeHlYRzRnSUNBZ2ZTazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW50Q3gwTDNRdnRDeTBMdlF0ZEM5MExqUXRTRFJnZEMrMFlIUmd0QyswWS9RdmRDNDBMa2cwTFRRdmRHUFhISmNiaUFxSUVCd1lYSmhiU0I3Uld4bGJXVnVkSDBnSkdSaGVTRFFyZEM3MExYUXZOQzEwTDNSZ2lEUXROQzkwWTljY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDNWd1pHRjBaVVJoZVNBOUlHWjFibU4wYVc5dUtDUmtZWGtwSUh0Y2NseHVJQ0FnSUdOdmJuTjBJR1JoZEdVZ0lDQTlJRzVsZHlCRVlYUmxLSEJoY25ObFNXNTBLQ1JrWVhrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcE8xeHlYRzRnSUNBZ1kyOXVjM1FnYkc5amEyVmtJRDBnZEdocGN5NW5aWFJFWVhsTWIyTnJaV1FvWkdGMFpTazdYSEpjYmlBZ0lDQmpiMjV6ZENCMGIyUmhlU0FnUFNCMGFHbHpMbDkwYjJSaGVTNW5aWFJVYVcxbEtDa2dQVDBnWkdGMFpTNW5aWFJVYVcxbEtDazdYSEpjYmx4eVhHNGdJQ0FnSkdSaGVTNWpiR0Z6YzB4cGMzUXVkRzluWjJ4bEtDZHBjeTFrYVhOaFlteGxaQ2NzSUd4dlkydGxaQ2s3WEhKY2JpQWdJQ0FrWkdGNUxtTnNZWE56VEdsemRDNTBiMmRuYkdVb0oybHpMV3h2WTJ0bFpDY3NJR3h2WTJ0bFpDQTlQU0JNVDBOTFgweFBRMHRGUkNrN1hISmNiaUFnSUNBa1pHRjVMbU5zWVhOelRHbHpkQzUwYjJkbmJHVW9KMmx6TFhSdlpHRjVKeXdnZEc5a1lYa3BPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLSFF2dEN4MFl2Umd0QzQwTFVnMExyUXU5QzQwTHJRc0NEUXY5QytJTkMwMEwzUmpseHlYRzRnS2lCQWNHRnlZVzBnZTBWMlpXNTBmU0JsSUVSUFRTRFJnZEMrMExIUmk5R0MwTGpRdFZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZmIyNUVZWGxEYkdsamEwVjJaVzUwSUQwZ1puVnVZM1JwYjI0b1pTa2dlMXh5WEc0Z0lDQWdkR2hwY3k1ZmIyNUVZWGxEYkdsamF5aGxMblJoY21kbGRDazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW9kQyswTEhSaTlHQzBMalF0U0RSaGRDKzBMTFF0ZEdBMExCY2NseHVJQ29nUUhCaGNtRnRJSHRGZG1WdWRIMGdaU0JFVDAwZzBZSFF2dEN4MFl2Umd0QzQwTFZjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDI5dVJHRjVUVzkxYzJWRmJuUmxja1YyWlc1MElEMGdablZ1WTNScGIyNG9aU2tnZTF4eVhHNGdJQ0FnZEdocGN5NWZiMjVFWVhsTmIzVnpaVVZ1ZEdWeUtHVXVkR0Z5WjJWMEtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DbDBMN1FzdEMxMFlBZzBMM1FzQ0RSamRDNzBMWFF2TkMxMEwzUmd0QzFJTkMwMEwzUmoxeHlYRzRnS2lCQWNHRnlZVzBnZTBWc1pXMWxiblI5SUNSa1lYa2dTRlJOVENEUXJkQzcwTFhRdk5DMTBMM1JnbHh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmYjI1RVlYbE5iM1Z6WlVWdWRHVnlJRDBnWm5WdVkzUnBiMjRvSkdSaGVTa2dlMXh5WEc0Z0lDQWdhV1lnS0NGMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0SUh4OElIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJR2xtSUNna1pHRjVMbVJoZEdGelpYUXVkR2x0WlNBOVBTQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dExtZGxkRlJwYldVb0tTa2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCamIyNXpkQ0JrWVhSbFgzUnZJRDBnYm1WM0lFUmhkR1VvY0dGeWMyVkpiblFvSkdSaGVTNWtZWFJoYzJWMExuUnBiV1VzSURFd0tTazdYSEpjYmlBZ0lDQjBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGTmxiR1ZqZENoMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0TENCa1lYUmxYM1J2S1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNhMEx2UXVOQzZJTkMvMEw0ZzBMVFF2ZEdPWEhKY2JpQXFJRUJ3WVhKaGJTQjdSV3hsYldWdWRIMGdKR1JoZVNCSVZFMU1JTkN0MEx2UXRkQzgwTFhRdmRHQ1hISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOXZia1JoZVVOc2FXTnJJRDBnWm5WdVkzUnBiMjRvSkdSaGVTa2dlMXh5WEc0Z0lDQWdMeThnMExUUXRkQzkwWXdnMExmUXNOQ3gwTHZRdnRDNjBMalJnTkMrMExMUXNOQzlYSEpjYmlBZ0lDQnBaaUFvSkdSaGVTNWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMmx6TFdScGMyRmliR1ZrSnlrcElIdGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMExMUmk5Q3gwTDdSZ0NEUXZ0QzAwTDNRdnRDNUlOQzAwTERSZ3RHTFhISmNiaUFnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG5OcGJtZHNaVTF2WkdVcElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxuSmhibWRsVW1WelpYUW9LVHRjY2x4dUlDQWdJQ0FnSUNBa1pHRjVMbU5zWVhOelRHbHpkQzVoWkdRb0oybHpMWE5sYkdWamRHVmtKeWs3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmWTJGc2JHSmhZMnNvSjJSaGVWTmxiR1ZqZENjc0lHNWxkeUJFWVhSbEtIQmhjbk5sU1c1MEtDUmtZWGt1WkdGMFlYTmxkQzUwYVcxbExDQXhNQ2twS1R0Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200N1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMFlIUXNkR0EwTDdSZ1NEUXN0R0wwTEhSZ05DdzBMM1F2ZEMrMExQUXZpRFJnTkN3MEwzUXRkQzFJTkMwMExqUXNOQy8wTERRdDlDKzBMM1FzRnh5WEc0Z0lDQWdhV1lnS0hSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBnSmlZZ2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TG5KaGJtZGxVbVZ6WlhRb0tUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FrWkdGNUxtTnNZWE56VEdsemRDNWhaR1FvSjJsekxYTmxiR1ZqZEdWa0p5azdYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBMTFJpOUN4MFlEUXNOQzkwTEFnMEwzUXNOR0gwTERRdTlHTTBMM1FzTkdQSUM4ZzBMclF2dEM5MExYUmg5QzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdJQ0FnYVdZZ0tDRjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dEtTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU0E5SUc1bGR5QkVZWFJsS0hCaGNuTmxTVzUwS0NSa1lYa3VaR0YwWVhObGRDNTBhVzFsTENBeE1Da3BPMXh5WEc0Z0lDQWdmU0JsYkhObElHbG1JQ2doZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieUE5SUc1bGR5QkVZWFJsS0hCaGNuTmxTVzUwS0NSa1lYa3VaR0YwWVhObGRDNTBhVzFsTENBeE1Da3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdsbUlDaDBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dElDWW1JSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnTHk4ZzBMVFF2dEMvMFlQUmdkR0MwTGpRdk5HTDBMa2cwTFRRdU5DdzBML1FzTkMzMEw3UXZWeHlYRzRnSUNBZ0lDQWdJR2xtSUNnaGRHaHBjeTVuWlhSSmMxSmhibWRsVTJWc1pXTjBZV0pzWlNoMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0TENCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieWtwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXlZVzVuWlZKbGMyVjBLQ2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJqdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJSFJvYVhNdWNtRnVaMlZUWld4bFkzUW9kR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTd2dkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmZEc4cE8xeHlYRzRnSUNBZ2ZWeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEpMUXVOQzMwWVBRc05DNzBZelF2ZEdMMExrZzBZSFFzZEdBMEw3UmdTRFFzdEdMMExUUXRkQzcwTFhRdmRDOTBZdlJoU0RRdE5DdzBZSmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYM0poYm1kbFZtbHpkV0ZzVW1WelpYUWdQU0JtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUdOdmJuTjBJQ1JrWVhseklEMGdkR2hwY3k1ZkpHMXZiblJvY3k1eGRXVnllVk5sYkdWamRHOXlRV3hzS0NjdVJHRjVXMlJoZEdFdGRHbHRaVjBuS1R0Y2NseHVJQ0FnSUNSa1lYbHpMbVp2Y2tWaFkyZ29KR1JoZVNBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnSkdSaGVTNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZHBjeTF6Wld4bFkzUmxaQ2NzSUNkcGN5MXpaV3hsWTNSbFpDMW1jbTl0Snl3Z0oybHpMWE5sYkdWamRHVmtMWFJ2Snl3Z0oybHpMWE5sYkdWamRHVmtMV0psZEhkbFpXNG5LVHRjY2x4dUlDQWdJSDBwTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkMvMFlEUmo5R0gwTFhRdkNEUXY5QyswTFRSZ2RDNjBMRFF0OUM2MFlOY2NseHVJQ0FnSUhSb2FYTXVYM1J2YjJ4MGFYQklhV1JsS0NrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRa3RDNDBMZlJnOUN3MEx2UmpOQzkwTDdRdFNEUXN0R0wwTFRRdGRDNzBMWFF2ZEM0MExVZzBMVFFzTkdDWEhKY2JpQXFJRUJ3WVhKaGJTQjdSR0YwWlgwZ1pHRjBaVjltY205dElOQ2QwTERSaDlDdzBMdlJqTkM5MExEUmp5RFF0TkN3MFlMUXNGeHlYRzRnS2lCQWNHRnlZVzBnZTBSaGRHVjlJR1JoZEdWZmRHOGdJQ0RRbXRDKzBMM1F0ZEdIMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVmZabkp2YlN3Z1pHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ2FXWWdLR1JoZEdWZlpuSnZiU0FtSmlCa1lYUmxYMlp5YjIwZ2FXNXpkR0Z1WTJWdlppQkVZWFJsS1NCN1hISmNiaUFnSUNBZ0lDQWdaR0YwWlY5bWNtOXRMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lHbG1JQ2hrWVhSbFgzUnZJQ1ltSUdSaGRHVmZkRzhnYVc1emRHRnVZMlZ2WmlCRVlYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ1pHRjBaVjkwYnk1elpYUkliM1Z5Y3lnd0xDQXdMQ0F3TENBd0tUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JzWlhRZ2RHbHRaVjltY205dElEMGdaR0YwWlY5bWNtOXRJR2x1YzNSaGJtTmxiMllnUkdGMFpTQS9JR1JoZEdWZlpuSnZiUzVuWlhSVWFXMWxLQ2tnT2lBd08xeHlYRzRnSUNBZ2JHVjBJSFJwYldWZmRHOGdQU0JrWVhSbFgzUnZJR2x1YzNSaGJtTmxiMllnUkdGMFpTQS9JR1JoZEdWZmRHOHVaMlYwVkdsdFpTZ3BJRG9nTUR0Y2NseHVJQ0FnSUdsbUlDaDBhVzFsWDJaeWIyMGdQaUIwYVcxbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ1czUnBiV1ZmWm5KdmJTd2dkR2x0WlY5MGIxMGdQU0JiZEdsdFpWOTBieXdnZEdsdFpWOW1jbTl0WFR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURRc3RHTDBMVFF0ZEM3MExYUXZkQzQwTFVnMExUUXNOR0NJTkM4MExYUXR0QzAwWU1nMEwzUXNOR0gwTERRdTlHTTBMM1F2dEM1SU5DNElOQzYwTDdRdmRDMTBZZlF2ZEMrMExsY2NseHVJQ0FnSUdOdmJuTjBJQ1JrWVhseklEMGdkR2hwY3k1ZkpHMXZiblJvY3k1eGRXVnllVk5sYkdWamRHOXlRV3hzS0NjdVJHRjVXMlJoZEdFdGRHbHRaVjBuS1R0Y2NseHVJQ0FnSUdadmNpQW9iR1YwSUdrZ1BTQXdPeUJwSUR3Z0pHUmhlWE11YkdWdVozUm9PeUFySzJrcElIdGNjbHh1SUNBZ0lDQWdJQ0FrWkdGNWMxdHBYUzVqYkdGemMweHBjM1F1ZEc5bloyeGxLQ2RwY3kxelpXeGxZM1JsWkMxaVpYUjNaV1Z1Snl3Z0pHUmhlWE5iYVYwdVpHRjBZWE5sZEM1MGFXMWxJRDRnZEdsdFpWOW1jbTl0SUNZbUlDUmtZWGx6VzJsZExtUmhkR0Z6WlhRdWRHbHRaU0E4SUhScGJXVmZkRzhwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkN5MFl2UXROQzEwTHZRdGRDOTBMalF0U0RRdmRDdzBZZlFzTkM3MFl6UXZkQyswTGtnMExnZzBMclF2dEM5MExYUmg5QzkwTDdRdVNEUXY5QyswTGZRdU5HRzBMalF1Rnh5WEc0Z0lDQWdZMjl1YzNRZ0pHUmhlVjltY205dElEMGdkR2hwY3k1ZkpHZGxkRVJoZVVKNVJHRjBaU2hrWVhSbFgyWnliMjBwTzF4eVhHNGdJQ0FnWTI5dWMzUWdKR1JoZVY5MGJ5QTlJSFJvYVhNdVh5Um5aWFJFWVhsQ2VVUmhkR1VvWkdGMFpWOTBieWs3WEhKY2JseHlYRzRnSUNBZ0x5OGcwTHJRdGRHSUlOQzAwTHZSanlEUXNkR0wwWUhSZ3RHQTBMN1FzOUMrSU5HQjBMSFJnTkMrMFlIUXNDRFJnZEdDMExEUmdOQyswTFBRdmlEUXN0R0wwTFRRdGRDNzBMWFF2ZEM0MFk5Y2NseHVJQ0FnSUdsbUlDaDBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGTmxiR1ZqZEM0a1pHRjVYMlp5YjIxZmIyeGtJQ1ltSUhSb2FYTXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBMaVJrWVhsZlpuSnZiVjl2YkdRZ0lUMGdKR1JoZVY5bWNtOXRLU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1F1SkdSaGVWOW1jbTl0WDI5c1pDNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZHBjeTF6Wld4bFkzUmxaQ2NzSUNkcGN5MXpaV3hsWTNSbFpDMW1jbTl0SnlrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMExyUXRkR0lJTkMwMEx2Ump5RFFzZEdMMFlIUmd0R0EwTDdRczlDK0lOR0IwTEhSZ05DKzBZSFFzQ0RSZ2RHQzBMRFJnTkMrMExQUXZpRFFzdEdMMExUUXRkQzcwTFhRdmRDNDBZOWNjbHh1SUNBZ0lHbG1JQ2gwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDNGtaR0Y1WDNSdlgyOXNaQ0FtSmlCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQzRrWkdGNVgzUnZYMjlzWkNBaFBTQWtaR0Y1WDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUXVKR1JoZVY5MGIxOXZiR1F1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYVhNdGMyVnNaV04wWldRbkxDQW5hWE10YzJWc1pXTjBaV1F0ZEc4bktUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JwWmlBb0pHUmhlVjltY205dEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSkdSaGVWOW1jbTl0TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMmx6TFhObGJHVmpkR1ZrSnl3Z0oybHpMWE5sYkdWamRHVmtMV1p5YjIwbktUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JwWmlBb0pHUmhlVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ1JrWVhsZmRHOHVZMnhoYzNOTWFYTjBMbUZrWkNnbmFYTXRjMlZzWldOMFpXUW5MQ0FuYVhNdGMyVnNaV04wWldRdGRHOG5LVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFJnZEMrMFlYUmdOQ3cwTDNRdGRDOTBMalF0U0RRc2lEUXV0QzEwWWhjY2x4dUlDQWdJSFJvYVhNdVgzSmhibWRsVm1semRXRnNVMlZzWldOMExpUmtZWGxmWm5KdmJWOXZiR1FnUFNBa1pHRjVYMlp5YjIwN1hISmNiaUFnSUNCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQzRrWkdGNVgzUnZYMjlzWkNBOUlDUmtZWGxmZEc4N1hISmNibHh5WEc0Z0lDQWdkR2hwY3k1ZmMyVnNaV04wYVc5dUxpUmtZWGxmWm5KdmJTQTlJQ1JrWVhsZlpuSnZiVHRjY2x4dUlDQWdJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNGtaR0Y1WDNSdklEMGdKR1JoZVY5MGJ6dGNjbHh1WEhKY2JpQWdJQ0JwWmlBb0pHUmhlVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElHUmhlWE1nUFNCTllYUm9MbVpzYjI5eUtFMWhkR2d1WVdKektIUnBiV1ZmWm5KdmJTQXRJSFJwYldWZmRHOHBJQzhnT0RZME1EQmxNeWtnS3lBeE8xeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzUnZiMngwYVhCVGFHOTNLQ1JrWVhsZmRHOHNJR1JoZVhNcE8xeHlYRzRnSUNBZ2ZWeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEovUXZ0QzYwTERRdHlEUXY5QyswTFRSZ2RDNjBMRFF0OUM2MExoY2NseHVJQ29nUUhCaGNtRnRJSHRGYkdWdFpXNTBmU0FrWkdGNUlOQ1MwWXZRc2RHQTBMRFF2ZEM5MFl2UXVTRFF0TkMxMEwzUmpGeHlYRzRnS2lCQWNHRnlZVzBnZTA1MWJXSmxjbjBnSUdSaGVYTWcwSnJRdnRDNzBMalJoOUMxMFlIUmd0Q3kwTDRnMExUUXZkQzEwTGxjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDNSdmIyeDBhWEJUYUc5M0lEMGdablZ1WTNScGIyNG9KR1JoZVN3Z1pHRjVjeWtnZTF4eVhHNGdJQ0FnZEdocGN5NWZKSFJ2YjJ4MGFYQkRiMjUwWlc1MExuUmxlSFJEYjI1MFpXNTBJRDBnZEdocGN5NXZjSFJwYjI1ekxtWnBiSFJsY2k1MGIyOXNkR2x3VkdWNGRDNWpZV3hzS0hSb2FYTXNJR1JoZVhNcElIeDhJQ2NuTzF4eVhHNGdJQ0FnZEdocGN5NWZKSFJ2YjJ4MGFYQXVZMnhoYzNOTWFYTjBMblJ2WjJkc1pTZ25hWE10YzJodmR5Y3NJSFJvYVhNdVh5UjBiMjlzZEdsd0xuUmxlSFJEYjI1MFpXNTBMbXhsYm1kMGFDazdYSEpjYmlBZ0lDQjBhR2x6TGw5MGIyOXNkR2x3VlhCa1lYUmxLQ1JrWVhrcE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEo3UXNkQzkwTDdRc3RDNzBMWFF2ZEM0MExVZzBML1F2dEMzMExqUmh0QzQwTGdnMEwvUXZ0QzAwWUhRdXRDdzBMZlF1dEM0WEhKY2JpQXFJRUJ3WVhKaGJTQjdSV3hsYldWdWRIMGdKR1JoZVNEUWt0R0wwTEhSZ05DdzBMM1F2ZEdMMExrZzBMVFF0ZEM5MFl4Y2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgzUnZiMngwYVhCVmNHUmhkR1VnUFNCbWRXNWpkR2x2Ymlna1pHRjVLU0I3WEhKY2JpQWdJQ0JzWlhRZ2VDQTlJREE3WEhKY2JpQWdJQ0JzWlhRZ2VTQTlJREE3WEhKY2JpQWdJQ0JzWlhRZ0pHVnNJRDBnSkdSaGVUdGNjbHh1SUNBZ0lHUnZJSHRjY2x4dUlDQWdJQ0FnSUNCNUlDczlJQ1JsYkM1dlptWnpaWFJVYjNBN1hISmNiaUFnSUNBZ0lDQWdlQ0FyUFNBa1pXd3ViMlptYzJWMFRHVm1kRHRjY2x4dUlDQWdJSDBnZDJocGJHVWdLQ2drWld3Z1BTQWtaV3d1YjJabWMyVjBVR0Z5Wlc1MEtTQW1KaUFrWld3Z0lUMGdkR2hwY3k1ZkpIQnBZMnRsY2lrN1hISmNibHh5WEc0Z0lDQWdkR2hwY3k1ZkpIUnZiMngwYVhBdWMzUjViR1V1ZEc5d0lEMGdUV0YwYUM1eWIzVnVaQ2g1SUMwZ2RHaHBjeTVmSkhSdmIyeDBhWEF1YjJabWMyVjBTR1ZwWjJoMEtTQXJJQ2R3ZUNjN1hISmNiaUFnSUNCMGFHbHpMbDhrZEc5dmJIUnBjQzV6ZEhsc1pTNXNaV1owSUQwZ1RXRjBhQzV5YjNWdVpDaDRJQ3NnSkdSaGVTNXZabVp6WlhSWGFXUjBhQ0F2SURJZ0xTQjBhR2x6TGw4a2RHOXZiSFJwY0M1dlptWnpaWFJYYVdSMGFDQXZJRElwSUNzZ0ozQjRKenRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2gwTHJSZ05HTDBZTFJqQ0RRdjlDKzBMVFJnZEM2MExEUXQ5QzYwWU5jY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDNSdmIyeDBhWEJJYVdSbElEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0IwYUdsekxsOGtkRzl2YkhScGNDNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZHBjeTF6YUc5M0p5azdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW90QzEwTHJSZ2RHQ0lOQy8wTDdRdE5HQjBMclFzTkMzMExyUXVDRFF2OUMrSU5HRDBMelF2dEM3MFlmUXNOQzkwTGpSamx4eVhHNGdLaUJBY0dGeVlXMGdJSHRPZFcxaVpYSjlJR1JoZVhNZzBKclF2dEM3MExqUmg5QzEwWUhSZ3RDeTBMNGcwTFRRdmRDMTBMbGNjbHh1SUNvZ1FISmxkSFZ5YmlCN1UzUnlhVzVuZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZlptbHNkR1Z5Vkc5dmJIUnBjRlJsZUhRZ1BTQm1kVzVqZEdsdmJpaGtZWGx6S1NCN1hISmNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NXdiSFZ5WVd3b1pHRjVjeXdnV3ljbFpDRFF0TkMxMEwzUmpDY3NJQ2NsWkNEUXROQzkwWThuTENBbkpXUWcwTFRRdmRDMTBMa25YU2t1Y21Wd2JHRmpaU2duSldRbkxDQmtZWGx6S1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNrMExqUXU5R00wWUxSZ0NEUXZkQzEwTFRRdnRHQjBZTFJnOUMvMEwzUmk5R0ZJTkMwMEwzUXRkQzVJTkMvMEw0ZzBZUFF2TkMrMEx2Umg5Q3cwTDNRdU5HT1hISmNiaUFxSUVCeVpYUjFjbTRnZTBKdmIyeGxZVzU5WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw5bWFXeDBaWEpNYjJOclJHRjVjeUE5SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ0x5OGcwTExSZ2RDMUlOQzAwTDNRdUNEUXROQyswWUhSZ3RHRDBML1F2ZEdMWEhKY2JpQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRb2RDKzBMSFJpOUdDMExqUXRTRFF1TkMzMEx6UXRkQzkwTFhRdmRDNDBZOGcwWURRc05DMzBMelF0ZEdBMEw3UXNpRFF2dEM2MEwzUXNGeHlYRzRnS2lCQWNHRnlZVzBnZTBWMlpXNTBmU0JsSUVSUFRTRFJnZEMrMExIUmk5R0MwTGpRdFZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZmIyNVhhVzVrYjNkU1pYTnBlbVZGZG1WdWRDQTlJR1oxYm1OMGFXOXVLR1VwSUh0Y2NseHVJQ0FnSUdsbUlDaDBhR2x6TGw5elpXeGxZM1JwYjI0dUpHUmhlVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzUnZiMngwYVhCVmNHUmhkR1VvZEdocGN5NWZjMlZzWldOMGFXOXVMaVJrWVhsZmRHOHBPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUd4bGRDQmljbVZoYTNCdmFXNTBJRDBnTUR0Y2NseHVJQ0FnSUdOdmJuTjBJR0p5WldGcmNHOXBiblJ6SUQwZ1QySnFaV04wTG10bGVYTW9kR2hwY3k1dmNIUnBiMjV6TG1KeVpXRnJjRzlwYm5SektTNXpiM0owS0NoaExDQmlLU0E5UGlCaElDMGdZaWs3WEhKY2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUdsdUlHSnlaV0ZyY0c5cGJuUnpLU0I3WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLSGRwYm1SdmR5NXBibTVsY2xkcFpIUm9JRHc5SUdKeVpXRnJjRzlwYm5SelcybGRLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR0p5WldGcmNHOXBiblFnUFNCaWNtVmhhM0J2YVc1MGMxdHBYVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdZbkpsWVdzN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUhSb2FYTXVYM05sZEVKeVpXRnJjRzlwYm5Rb1luSmxZV3R3YjJsdWRDazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW85R0IwWUxRc05DOTBMN1FzdEM2MExBZzBZSFF2dEdCMFlMUXZ0R1AwTDNRdU5HUElOR0EwTFhRdmRDMDBMWFJnTkN3SU5DLzBMN1F0Q0RSZ05DdzBMZlF2ZEdMMExVZzBZM1F1dEdBMExEUXZkR0xYSEpjYmlBcUlFQndZWEpoYlNCN1RuVnRZbVZ5ZlNCaWNtVmhhM0J2YVc1MElOQ2EwTHZSanRHSElOQzQwTGNnZEdocGN5NXZjSFJwYjI1ekxtSnlaV0ZyY0c5cGJuUnpJQ2pRcU5DNDBZRFF1TkM5MExBZzBZM1F1dEdBMExEUXZkQ3dLVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmYzJWMFFuSmxZV3R3YjJsdWRDQTlJR1oxYm1OMGFXOXVLR0p5WldGcmNHOXBiblFwSUh0Y2NseHVJQ0FnSUM4dklOQyswWUlnMEwzUXRkQzkwWVBRdHRDOTBMN1F1U0RRdjlDMTBZRFF0ZEdBMExqUmdkQyswTExRdXRDNFhISmNiaUFnSUNCcFppQW9kR2hwY3k1ZlluSmxZV3R3YjJsdWRDQTlQU0JpY21WaGEzQnZhVzUwS1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ2ZWeHlYRzRnSUNBZ2RHaHBjeTVmWW5KbFlXdHdiMmx1ZENBOUlHSnlaV0ZyY0c5cGJuUTdYSEpjYmx4eVhHNGdJQ0FnYVdZZ0tDRjBhR2x6TG05d2RHbHZibk11WW5KbFlXdHdiMmx1ZEhOYlluSmxZV3R3YjJsdWRGMHBJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ1QySnFaV04wTG1GemMybG5iaWgwYUdsekxtOXdkR2x2Ym5Nc0lIUm9hWE11YjNCMGFXOXVjeTVpY21WaGEzQnZhVzUwYzF0aWNtVmhhM0J2YVc1MFhTazdYSEpjYmlBZ0lDQjBhR2x6TGw4a1kzSmxZWFJsVFc5dWRHaHpLSFJvYVhNdVgzTmxiR1ZqZEdWa1JHRjBaU2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFyZEM3MExYUXZOQzEwTDNSZ2lEUXV0Q3cwTHZRdGRDOTBMVFFzTkdBMEwzUXZ0Q3owTDRnMExUUXZkR1BYSEpjYmlBcUlFQndZWEpoYlNBZ2UwUmhkR1Y5SUdSaGRHVWcwSlRRc05HQzBMQmNjbHh1SUNvZ1FISmxkSFZ5YmlCN1JXeGxiV1Z1ZEgwZ0lDQklWRTFNSU5HTjBMdlF0ZEM4MExYUXZkR0NYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDhrWjJWMFJHRjVRbmxFWVhSbElEMGdablZ1WTNScGIyNG9aR0YwWlNrZ2UxeHlYRzRnSUNBZ1kyOXVjM1FnZEdsdFpTQTlJR1JoZEdVZ2FXNXpkR0Z1WTJWdlppQkVZWFJsSUQ4Z1pHRjBaUzVuWlhSVWFXMWxLQ2tnT2lBd08xeHlYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYeVJ0YjI1MGFITXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxrUmhlVnRrWVhSaExYUnBiV1U5WENJbklDc2dkR2x0WlNBcklDZGNJbDBuS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNnMExYUXZkQzAwTFhSZ0NEUXROQzkwWThnTFNEUXQ5Q3cwTFBRdTlHRDBZalF1dEM0WEhKY2JpQXFJRUJ5WlhSMWNtNGdlMFZzWlcxbGJuUjlYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDhrWTNKbFlYUmxSVzF3ZEhsRVlYa2dQU0JtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUdOdmJuTjBJQ1JrWVhrZ1BTQjBhR2x6TGw4a1kzSmxZWFJsUld4bGJXVnVkQ2hjY2x4dUlDQWdJQ0FnSUNCZ1BHUnBkaUJqYkdGemN6MWNJa1JoZVNCcGN5MWxiWEIwZVZ3aVBqd3ZaR2wyUG1CY2NseHVJQ0FnSUNrN1hISmNibHh5WEc0Z0lDQWdjbVYwZFhKdUlDUmtZWGs3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvZEMrMExmUXROQ3cwTDNRdU5DMUlOR04wTHZRdGRDODBMWFF2ZEdDMExBZzBMalF0eUJJVkUxTUlOR0MwTFhRdXRHQjBZTFFzRnh5WEc0Z0tpQkFjR0Z5WVcwZ0lIdFRkSEpwYm1kOUlHaDBiV3dnU0ZSTlRDRFJndEMxMExyUmdkR0NYSEpjYmlBcUlFQnlaWFIxY200Z2UwVnNaVzFsYm5SOVhISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOGtZM0psWVhSbFJXeGxiV1Z1ZENBOUlHWjFibU4wYVc5dUtHaDBiV3dwSUh0Y2NseHVJQ0FnSUdOdmJuTjBJR1JwZGlBOUlHUnZZM1Z0Wlc1MExtTnlaV0YwWlVWc1pXMWxiblFvSjJScGRpY3BPMXh5WEc0Z0lDQWdaR2wyTG1sdWMyVnlkRUZrYW1GalpXNTBTRlJOVENnbllXWjBaWEppWldkcGJpY3NJR2gwYld3cE8xeHlYRzRnSUNBZ2NtVjBkWEp1SUdScGRpNWphR2xzWkhKbGJpNXNaVzVuZEdnZ1BpQXhJRDhnWkdsMkxtTm9hV3hrY21WdUlEb2daR2wyTG1acGNuTjBSV3hsYldWdWRFTm9hV3hrTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2dVMkZtWlNEUXN0R0wwTGZRdnRDeUlOQ3kwTDNRdGRHSTBMM1F1TkdGSU5HQjBMN1FzZEdMMFlMUXVOQzVJTkM2MEw3UXZOQy8wTDdRdmRDMTBMM1JndEN3WEhKY2JpQXFJRUJ3WVhKaGJTQjdVM1J5YVc1bmZTQm1JTkNZMEx6Ump5RFJnZEMrMExIUmk5R0MwTGpSajF4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZlkyRnNiR0poWTJzZ1BTQm1kVzVqZEdsdmJpaG1LU0I3WEhKY2JpQWdJQ0JwWmlBb2RIbHdaVzltSUhSb2FYTXViM0IwYVc5dWN5NXZibHRtWFNBOVBTQW5ablZ1WTNScGIyNG5LU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXViM0IwYVc5dWN5NXZibHRtWFM1aGNIQnNlU2gwYUdsekxDQmJYUzV6YkdsalpTNWpZV3hzS0dGeVozVnRaVzUwY3l3Z01Ta3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUhKbGRIVnlianRjY2x4dWZWeHlYRzVjY2x4dVpYaHdiM0owSUdSbFptRjFiSFFnUkdGMFpWSmhibWRsVUdsamEyVnlPMXh5WEc0aVhTd2ljMjkxY21ObFVtOXZkQ0k2SWlKOSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgRGF0ZVJhbmdlUGlja2VyLCB7TE9DS19VTkFWQUlMQUJMRSwgTE9DS19MT0NLRUR9IGZyb20gJy4uLy4uL2Rpc3QvZGF0ZXJhbmdlcGlja2VyJztcclxuXHJcbmNvbnN0ICRmb3JtID0gZG9jdW1lbnQuZm9ybXNbMF07XHJcbmNvbnN0ICRkYXRlX2Zyb20gPSAkZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImRhdGVfZnJvbVwiXScpO1xyXG5jb25zdCAkZGF0ZV90byAgID0gJGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9XCJkYXRlX3RvXCJdJyk7XHJcblxyXG4vLyDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0LUg0LTQsNGC0YtcclxuY29uc3QgYmxvY2tlZERhdGVzID0ge307XHJcbmNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG5kYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5mb3IgKGxldCBpID0gMDsgaSA8IDYwOyArK2kpIHtcclxuICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC42KSB7XHJcbiAgICAgICAgYmxvY2tlZERhdGVzW2RhdGVdID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG59XHJcblxyXG5uZXcgRGF0ZVJhbmdlUGlja2VyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkYXRlcmFuZ2VwaWNrZXInKSwge1xyXG4gICAgbWluRGF0ZTogbmV3IERhdGUoKSxcclxuICAgIG1heERhdGU6IG5ldyBEYXRlKCcyMDIyLTA1LTIwJyksXHJcbiAgICBtb250aHNDb3VudDogMixcclxuICAgIHBlclJvdzogMyxcclxuICAgIHNpbmdsZU1vZGU6IGZhbHNlLFxyXG4gICAgYnJlYWtwb2ludHM6IHtcclxuICAgICAgICA5NjA6IHtcclxuICAgICAgICAgICAgbW9udGhzQ291bnQ6IDEyLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgNzIwOiB7XHJcbiAgICAgICAgICAgIG1vbnRoc0NvdW50OiAzLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgNDgwOiB7XHJcbiAgICAgICAgICAgIG1vbnRoc0NvdW50OiAxLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgb246IHtcclxuICAgICAgICByYW5nZVNlbGVjdDogZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICAgICAgICAgICRkYXRlX2Zyb20udmFsdWUgPSBkYXRlX2Zyb20udG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICRkYXRlX3RvLnZhbHVlID0gZGF0ZV90by50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRheVNlbGVjdDogZnVuY3Rpb24oZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgICAgICRkYXRlX2Zyb20udmFsdWUgPSBkYXRlX2Zyb20udG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBmaWx0ZXI6IHtcclxuICAgICAgICBsb2NrRGF5czogZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgICAgICBpZiAoYmxvY2tlZERhdGVzW2RhdGVdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTE9DS19MT0NLRUQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRvb2x0aXBUZXh0OiBmdW5jdGlvbihkYXlzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5pZ2h0cyA9IGRheXMgLSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wbHVyYWwobmlnaHRzLCBbJyVkINC90L7Rh9GMJywgJyVkINC90L7Rh9C4JywgJyVkINC90L7Rh9C10LknXSkucmVwbGFjZSgnJWQnLCBuaWdodHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=