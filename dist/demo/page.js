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
/*!***************************************!*\
  !*** ./src/scss/daterangepicker.scss ***!
  \***************************************/
__nested_webpack_require_509__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***********************************!*\
  !*** ./src/js/daterangepicker.js ***!
  \***********************************/
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

    // значение по умолчанию
    const dv = (x, v) => typeof x == 'undefined' ? v : x;

    this.options = {
        firstDayOfTheWeek: dv(options.firstDayOfTheWeek, 1), // первый день недели, 0 = вс, 1 = пн, ...
        singleMode:        dv(options.singleMode, false),    // выбор одной даты вместо диапазона
        locale:            dv(options.locale, 'ru-RU'),
        minDays:           dv(options.minDays, 1),           // минимальное количество дней в диапазоне
        monthsCount:       dv(options.monthsCount, 12),
        perRow:            dv(options.perRow, undefined),    // количество месяцев в ряду
        minDate:           dv(options.minDate, new Date()),  // минимальная дата
        maxDate:           dv(options.maxDate, undefined),
        breakpoints:       dv(options.breakpoints, {}),
        internalInputs:    dv(options.internalInputs, true), // использование встроенных инпутов
        // события
        on: Object.assign({
            rangeSelect: null, // событие выбора диапазона дат
            daySelect:   null, // событие выбора одной даты (только при singleMode: true)
        }, options.on || {}),
        // фильтрующие методы
        filter: Object.assign({
            lockDays:    null, // callback(date) функция блокирования дат, true/LOCK
            tooltipText: null, // callback(days) вывод текста подсказки
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
    this._selection       = {};
    this._visualSelection = {};

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
    this._rangeReset();
}

/**
 * Выделение диапазона дат
 * @param {Date} date_from Начальная дата
 * @param {Date} date_to   Конечная дата
 */
DateRangePicker.prototype.rangeSelect = function(date_from, date_to) {
    if (!(date_from instanceof Date) || !(date_to instanceof Date)) {
        return;
    }

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

    // сохранение состояния
    this._selection.date_from = date_from;
    this._selection.date_to   = date_to;

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
    if (!(date instanceof Date)) {
        return;
    }

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
        if (this._filterLockDays(day)) {
            return false;
        }

        day.setDate(day.getDate() + 1);
    }

    return true;
}

/**
 * Выбранная начальная дата
 * @return {Date} Дата
 */
DateRangePicker.prototype.getDateFrom = function() {
    // начальная дата не указана
    if (!this._selection.date_from) {
        return;
    }

    // начальная дата позже конечной
    if (this._selection.date_to && this._selection.date_from > this._selection.date_to) {
        return this._selection.date_to;
    }

    return this._selection.date_from;
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
    // конечная дата не указана
    if (!this._selection.date_to) {
        return;
    }

    // начальная дата позже конечной
    if (this._selection.date_from && this._selection.date_from > this._selection.date_to) {
        return this._selection.date_from;
    }

    return this._selection.date_to;
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
 * Сброс выделенных дат
 */
DateRangePicker.prototype._rangeReset = function() {
    this._rangeVisualReset();
    this._selection = {};
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
    const locked = this._filterLockDays(date);
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
        this._rangeReset();
        this._selection.date_from = new Date(parseInt($day.dataset.time, 10))
        $day.classList.add('is-selected');
        this._callback('daySelect', this._selection.date_from);
        return;
    }

    // сброс выбранного ранее диапазона
    if (this._selection.date_from && this._selection.date_to) {
        this._rangeReset();
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
            this._rangeReset();
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
    if (this._visualSelection.$day_from_old && this._visualSelection.$day_from_old != $day_from) {
        this._visualSelection.$day_from_old.classList.remove('is-selected', 'is-selected-from');
    }

    // кеш для быстрого сброса старого выделения
    if (this._visualSelection.$day_to_old && this._visualSelection.$day_to_old != $day_to) {
        this._visualSelection.$day_to_old.classList.remove('is-selected', 'is-selected-to');
    }

    if ($day_from) {
        $day_from.classList.add('is-selected', 'is-selected-from');
    }

    if ($day_to) {
        $day_to.classList.add('is-selected', 'is-selected-to');
    }

    // сохранение в кеш
    this._visualSelection.$day_from_old = $day_from;
    this._visualSelection.$day_to_old = $day_to;

    this._selection.$day_from = $day_from;
    this._selection.$day_to   = $day_to;

    if ($day_to) {
        const days = Math.floor(Math.abs(time_from - time_to) / 86400e3) + 1;
        this._tooltipShow(days);
    }
}

/**
 * Показ подсказки
 * @param {Number} days Количество дней
 */
DateRangePicker.prototype._tooltipShow = function(days) {
    this._$tooltipContent.textContent = this._filterTooltipText(days);
    this._$tooltip.classList.toggle('is-show', this._$tooltip.textContent.length);
    this._tooltipUpdate();
}

/**
 * Обновление позиции подсказки
 */
DateRangePicker.prototype._tooltipUpdate = function() {
    if (!this._selection.$day_to) {
        return;
    }

    let x = 0;
    let y = 0;
    let $el = this._selection.$day_to;
    do {
        y += $el.offsetTop;
        x += $el.offsetLeft;
    } while (($el = $el.offsetParent) && $el != this._$picker);

    this._$tooltip.style.top = Math.round(y - this._$tooltip.offsetHeight) + 'px';
    this._$tooltip.style.left = Math.round(x + this._selection.$day_to.offsetWidth / 2 - this._$tooltip.offsetWidth / 2) + 'px';
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
    if (typeof this.options.filter.tooltipText == 'function') {
        return this.options.filter.tooltipText.call(this, days) || '';
    }

    return this.plural(days, ['%d день', '%d дня', '%d дней']).replace('%d', days);
}

/**
 * Фильтр недоступных дней
 * @param {Date} date Дата
 */
DateRangePicker.prototype._filterLockDays = function(date) {
    // выбор дат вне доступного диапазона
    if (date < this.options.minDate || date > this.options.maxDate) {
        return LOCK_UNAVAILABLE;
    }

    // пользовательские функции
    if (typeof this.options.filter.lockDays == 'function') {
        return this.options.filter.lockDays.call(date);
    }

    // все дни доступны
    return false;
}

/**
 * Событие изменения размеров окна
 * @param {Event} e DOM событие
 */
DateRangePicker.prototype._onWindowResizeEvent = function(e) {
    if (this._selection.$day_to) {
        this._tooltipUpdate();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9zY3NzL2RhdGVyYW5nZXBpY2tlci5zY3NzP2EyOWYiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2pzL2RhdGVyYW5nZXBpY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7VUNWQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7O0FDTkE7Ozs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQ087QUFDQTs7QUFFUDtBQUNBOztBQUVBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFT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ImZpbGUiOiJkYXRlcmFuZ2VwaWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkRhdGVyYW5nZXBpY2tlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyDRgdC+0YHRgtC+0Y/QvdC40Y8g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9GFINC00LDRglxyXG5leHBvcnQgY29uc3QgTE9DS19VTkFWQUlMQUJMRSA9IDE7XHJcbmV4cG9ydCBjb25zdCBMT0NLX0xPQ0tFRCAgICAgID0gMjtcclxuXHJcbmNvbnN0IElOREVYX0RBVEVfRlJPTSA9IDA7XHJcbmNvbnN0IElOREVYX0RBVEVfVE8gICA9IDE7XHJcblxyXG5mdW5jdGlvbiBEYXRlUmFuZ2VQaWNrZXIoJGNvbnRhaW5lciwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICAvLyDQvtGCINC/0L7QstGC0L7RgNC90L7QuSDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuFxyXG4gICAgaWYgKCRjb250YWluZXIuaW5zdGFuY2UpIHtcclxuICAgICAgICByZXR1cm4gJGNvbnRhaW5lci5pbnN0YW5jZTtcclxuICAgIH1cclxuICAgICRjb250YWluZXIuaW5zdGFuY2UgPSB0aGlzO1xyXG5cclxuICAgIHRoaXMuXyRjb250YWluZXIgPSAkY29udGFpbmVyO1xyXG5cclxuICAgIC8vINC30L3QsNGH0LXQvdC40LUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICAgIGNvbnN0IGR2ID0gKHgsIHYpID0+IHR5cGVvZiB4ID09ICd1bmRlZmluZWQnID8gdiA6IHg7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgIGZpcnN0RGF5T2ZUaGVXZWVrOiBkdihvcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrLCAxKSwgLy8g0L/QtdGA0LLRi9C5INC00LXQvdGMINC90LXQtNC10LvQuCwgMCA9INCy0YEsIDEgPSDQv9C9LCAuLi5cclxuICAgICAgICBzaW5nbGVNb2RlOiAgICAgICAgZHYob3B0aW9ucy5zaW5nbGVNb2RlLCBmYWxzZSksICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRiyDQstC80LXRgdGC0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICAgICAgbG9jYWxlOiAgICAgICAgICAgIGR2KG9wdGlvbnMubG9jYWxlLCAncnUtUlUnKSxcclxuICAgICAgICBtaW5EYXlzOiAgICAgICAgICAgZHYob3B0aW9ucy5taW5EYXlzLCAxKSwgICAgICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LTQuNCw0L/QsNC30L7QvdC1XHJcbiAgICAgICAgbW9udGhzQ291bnQ6ICAgICAgIGR2KG9wdGlvbnMubW9udGhzQ291bnQsIDEyKSxcclxuICAgICAgICBwZXJSb3c6ICAgICAgICAgICAgZHYob3B0aW9ucy5wZXJSb3csIHVuZGVmaW5lZCksICAgIC8vINC60L7Qu9C40YfQtdGB0YLQstC+INC80LXRgdGP0YbQtdCyINCyINGA0Y/QtNGDXHJcbiAgICAgICAgbWluRGF0ZTogICAgICAgICAgIGR2KG9wdGlvbnMubWluRGF0ZSwgbmV3IERhdGUoKSksICAvLyDQvNC40L3QuNC80LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgICAgbWF4RGF0ZTogICAgICAgICAgIGR2KG9wdGlvbnMubWF4RGF0ZSwgdW5kZWZpbmVkKSxcclxuICAgICAgICBicmVha3BvaW50czogICAgICAgZHYob3B0aW9ucy5icmVha3BvaW50cywge30pLFxyXG4gICAgICAgIGludGVybmFsSW5wdXRzOiAgICBkdihvcHRpb25zLmludGVybmFsSW5wdXRzLCB0cnVlKSwgLy8g0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40LUg0LLRgdGC0YDQvtC10L3QvdGL0YUg0LjQvdC/0YPRgtC+0LJcclxuICAgICAgICAvLyDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICAgIG9uOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgcmFuZ2VTZWxlY3Q6IG51bGwsIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAgICAgICAgICAgIGRheVNlbGVjdDogICBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0L7QtNC90L7QuSDQtNCw0YLRiyAo0YLQvtC70YzQutC+INC/0YDQuCBzaW5nbGVNb2RlOiB0cnVlKVxyXG4gICAgICAgIH0sIG9wdGlvbnMub24gfHwge30pLFxyXG4gICAgICAgIC8vINGE0LjQu9GM0YLRgNGD0Y7RidC40LUg0LzQtdGC0L7QtNGLXHJcbiAgICAgICAgZmlsdGVyOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgbG9ja0RheXM6ICAgIG51bGwsIC8vIGNhbGxiYWNrKGRhdGUpINGE0YPQvdC60YbQuNGPINCx0LvQvtC60LjRgNC+0LLQsNC90LjRjyDQtNCw0YIsIHRydWUvTE9DS1xyXG4gICAgICAgICAgICB0b29sdGlwVGV4dDogbnVsbCwgLy8gY2FsbGJhY2soZGF5cykg0LLRi9Cy0L7QtCDRgtC10LrRgdGC0LAg0L/QvtC00YHQutCw0LfQutC4XHJcbiAgICAgICAgfSwgb3B0aW9ucy5maWx0ZXIgfHwge30pLFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0YDRj9C00L3QvtGB0YLRjFxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGVyUm93ID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnBlclJvdyA9IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMubWluRGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtC/0YbQuNC4INC00LvRjyDRjdC60YDQsNC90L7QsiDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW3RoaXMuX2JyZWFrcG9pbnQgPSAwXSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyk7XHJcblxyXG4gICAgLy8g0YLQtdC60YPRidC40Lkg0LTQtdC90YxcclxuICAgIHRoaXMuX3RvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIHRoaXMuX3RvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIHRoaXMuXyRwaWNrZXIgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlclwiPlxyXG4gICAgICAgICAgICAke3RoaXMub3B0aW9ucy5pbnRlcm5hbElucHV0cyA/XHJcbiAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9faW5wdXRzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJHt0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkYXRlXCI+YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkYXRlX2Zyb21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV90b1wiPmBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5gIDogJydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX19tb250aHNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcC1jb250ZW50XCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgLy8g0Y3Qu9C10LzQtdC90YLRi1xyXG4gICAgdGhpcy5fJG1vbnRocyAgICAgICAgID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX19tb250aHMnKTtcclxuICAgIHRoaXMuXyR0b29sdGlwICAgICAgICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcCcpO1xyXG4gICAgdGhpcy5fJHRvb2x0aXBDb250ZW50ID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX190b29sdGlwLWNvbnRlbnQnKTtcclxuXHJcbiAgICAvLyDQv9C+0LvRjyDQstCy0L7QtNCwXHJcbiAgICB0aGlzLl8kaW5wdXRzID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lXj1cImRhdGVcIl0nKTtcclxuXHJcbiAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICAgIHRoaXMuX3NlbGVjdGlvbiAgICAgICA9IHt9O1xyXG4gICAgdGhpcy5fdmlzdWFsU2VsZWN0aW9uID0ge307XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKHRoaXMub3B0aW9ucy5taW5EYXRlKTtcclxuICAgIHRoaXMuXyRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fJHBpY2tlcik7XHJcblxyXG4gICAgLy8g0L7QsdGA0LDQsdC+0YLQutCwINCx0YDQtdC50LrQv9C+0LjQvdGC0L7QslxyXG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykubGVuZ3RoKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uV2luZG93UmVzaXplRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5fb25XaW5kb3dSZXNpemVFdmVudCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0J3QsNC30LLQsNC90LjQtSDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRNb250aEZvcm1hdHRlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7bW9udGg6ICdsb25nJ30pO1xyXG4gICAgcmV0dXJuIHRpdGxlLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aXRsZS5zbGljZSgxKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0Ysg0LTQu9GPINGC0LXQutGD0YnQtdC5INC70L7QutCw0LvQuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyDQn9Cw0YDQsNC80LXRgtGA0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlVGltZUZvcm1hdCA9IGZ1bmN0aW9uKGRhdGUsIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMub3B0aW9ucy5sb2NhbGUsIG9wdGlvbnMpLmZvcm1hdChkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCU0L3QuCDQvdC10LTQtdC70LhcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0V2Vla0RheXNGb3JtYXR0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gMik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7ICsraSkge1xyXG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgZGF5OiBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7d2Vla2RheTogJ3Nob3J0J30pLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINGB0L7Qs9C70LDRgdC90L4g0L3QsNGB0YLRgNC+0LXQvdC90L7QvNGDINC/0LXRgNCy0L7QvNGDINC00L3RjiDQvdC10LTQtdC70LhcclxuICAgIHJlc3VsdC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmlyc3REYXlPZlRoZVdlZWsgPSB0aGlzLm9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgJSA3O1xyXG4gICAgICAgIGxldCBkYXlBID0gYS5kYXk7XHJcbiAgICAgICAgbGV0IGRheUIgPSBiLmRheTtcclxuXHJcbiAgICAgICAgaWYgKGRheUEgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUIgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QSA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIGRheUEgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlCIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgZGF5QiArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRheUEgLSBkYXlCO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC80LXRgdGP0YbQtVxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9ICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERheXNDb3VudEluTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRheXMuc2V0TW9udGgoZGF5cy5nZXRNb250aCgpICsgMSk7XHJcbiAgICBkYXlzLnNldERhdGUoMCk7XHJcbiAgICByZXR1cm4gZGF5cy5nZXREYXRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9yYW5nZVJlc2V0KCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktGL0LTQtdC70LXQvdC40LUg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5yYW5nZVNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgaWYgKCEoZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSkgfHwgIShkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAvLyDQtNC+0L/Rg9GB0YLQuNC80YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUoZGF0ZV9mcm9tLCBkYXRlX3RvKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICBjb25zdCAkZGF5X3RvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuXHJcbiAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdChkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG5cclxuICAgIC8vINGB0L7RhdGA0LDQvdC10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjRj1xyXG4gICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IGRhdGVfZnJvbTtcclxuICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvICAgPSBkYXRlX3RvO1xyXG5cclxuICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LVcclxuICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtCx0L3QvtCy0LvQtdC90LjQtSDQuNC90L/Rg9GC0L7QslxyXG4gICAgaWYgKHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9GUk9NXSkge1xyXG4gICAgICAgIHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9GUk9NXS52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfVE9dKSB7XHJcbiAgICAgICAgdGhpcy5fJGlucHV0c1tJTkRFWF9EQVRFX1RPXS52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0LHRi9GC0LjQtVxyXG4gICAgdGhpcy5fY2FsbGJhY2soJ3JhbmdlU2VsZWN0JywgZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0YtcclxuICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge1N0cmluZ30gZm9ybWF0INCk0L7RgNC80LDRgiDRgdGC0YDQvtC60LhcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSwgZm9ybWF0ID0gJ1ktbS1kJykge1xyXG4gICAgaWYgKCEoZGF0ZSBpbnN0YW5jZW9mIERhdGUpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmb3JtYXQucmVwbGFjZSgnWScsIGRhdGUuZ2V0RnVsbFllYXIoKSlcclxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgnbScsICgnMCcgKyAoZGF0ZS5nZXRNb250aCgpICsgMSkpLnNsaWNlKC0yKSlcclxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgnZCcsICgnMCcgKyAoZGF0ZS5nZXREYXRlKCkpKS5zbGljZSgtMikpO1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC+0LLQtdGA0LrQsCDQstC+0LfQvNC+0LbQvdC+0YHRgtC4INCy0YvQtNC10LvQtdC90LjRjyDQtNCw0YJcclxuICogQHBhcmFtICB7RGF0ZSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSAge0RhdGUgZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0SXNSYW5nZVNlbGVjdGFibGUgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC80LjQvdC40LzQsNC70YzQvdGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgY29uc3QgZGlmZiA9IE1hdGguYWJzKGRhdGVfZnJvbS5nZXRUaW1lKCkgLSBkYXRlX3RvLmdldFRpbWUoKSkgLyAxMDAwIC8gODY0MDA7XHJcbiAgICBpZiAoZGlmZiA8IHRoaXMub3B0aW9ucy5taW5EYXlzKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDQvtCy0LXRgNC60LAg0L/QvtC/0LDQtNCw0L3QuNGPINCyINC00LjQsNC/0LDQt9C+0L0g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9GFINC00LDRglxyXG4gICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIGRheS5zZXRUaW1lKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG5cclxuICAgIHdoaWxlIChkYXkgPCBkYXRlX3RvKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZpbHRlckxvY2tEYXlzKGRheSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG4vKipcclxuICog0JLRi9Cx0YDQsNC90L3QsNGPINC90LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtEYXRlfSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlRnJvbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0L3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwINC90LUg0YPQutCw0LfQsNC90LBcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvdCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LAg0L/QvtC30LbQtSDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA+IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tO1xyXG59XHJcblxyXG4vKipcclxuICog0JLRi9Cx0YDQsNC90L3QsNGPINC00LDRgtCwIChzaW5nbGVNb2RlOiB0cnVlKVxyXG4gKiBAcmV0dXJuIHtEYXRlfSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlID0gRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlRnJvbTtcclxuXHJcbi8qKlxyXG4gKiDQktGL0LHRgNCw0L3QvdCw0Y8g0LrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtEYXRlfSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlVG8gPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LAg0L3QtSDRg9C60LDQt9Cw0L3QsFxyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvdCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LAg0L/QvtC30LbQtSDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tID4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG87XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60LvQvtC90LXQvdC40LUgKDEg0LHQvtCx0ZHRgCwgMiDQsdC+0LHRgNCwLCA1INCx0L7QsdGA0L7QsilcclxuICogQHBhcmFtICB7TnVtYmVyfSB2YWx1ZSDQmtC+0LvQuNGH0LXRgdGC0LLQvlxyXG4gKiBAcGFyYW0gIHtBcnJheX0gIGZvcm1zINCc0LDRgdGB0LjQsiDQuNC3IDPRhSDRjdC70LXQvNC10L3RgtC+0LIsINC80L7QttC10YIg0YHQvtC00LXRgNC20LDRgtGMINGB0L/QtdGG0LjRhNC40LrQsNGC0L7RgCAlZCDQtNC70Y8g0LfQsNC80LXQvdGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucGx1cmFsID0gZnVuY3Rpb24gKHZhbHVlLCBmb3Jtcykge1xyXG4gICAgcmV0dXJuICh2YWx1ZSAlIDEwID09IDEgJiYgdmFsdWUgJSAxMDAgIT0gMTEgPyBmb3Jtc1swXSA6ICh2YWx1ZSAlIDEwID49IDIgJiYgdmFsdWUgJSAxMCA8PSA0ICYmICh2YWx1ZSAlIDEwMCA8IDEwIHx8IHZhbHVlICUgMTAwID49IDIwKSA/IGZvcm1zWzFdIDogZm9ybXNbMl0pKS5yZXBsYWNlKCclZCcsIHZhbHVlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFJlc2V0KCk7XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24gPSB7fTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC40LDQv9Cw0LfQvtC90LAg0LzQtdGB0Y/RhtC10LJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlTW9udGhzID0gZnVuY3Rpb24oZGF0ZV9mcm9tKSB7XHJcbiAgICB3aGlsZSAodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5yZW1vdmVDaGlsZCh0aGlzLl8kbW9udGhzLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgIHRoaXMuX3Rvb2x0aXBIaWRlKCk7XHJcblxyXG4gICAgLy8g0L/RgNC10YDQtdC90LTQtdGAINC80LXRgdGP0YbQtdCyXHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG4gICAgY29uc3QgJG1vbnRocyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7ICsraSkge1xyXG4gICAgICAgICRtb250aHMucHVzaCh0aGlzLl8kY3JlYXRlTW9udGgoY3VycmVudERhdGUpKTtcclxuICAgICAgICBjdXJyZW50RGF0ZS5zZXRNb250aChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRtb250aHMubGVuZ3RoOyBpICs9IHRoaXMub3B0aW9ucy5wZXJSb3cpIHtcclxuICAgICAgICBjb25zdCAkcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnRGF0ZXJhbmdlcGlja2VyX19yb3cnO1xyXG5cclxuICAgICAgICAkbW9udGhzLnNsaWNlKGksIGkgKyB0aGlzLm9wdGlvbnMucGVyUm93KS5mb3JFYWNoKCRtb250aCA9PiB7XHJcbiAgICAgICAgICAgICRyb3cuYXBwZW5kQ2hpbGQoJG1vbnRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5hcHBlbmRDaGlsZCgkcm93KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCc0LXRgdGP0YZcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVNb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IG1vbnRoVGl0bGUgPSB0aGlzLmdldE1vbnRoRm9ybWF0dGVkKGRhdGUpO1xyXG4gICAgY29uc3Qgd2Vla0RheXMgPSB0aGlzLmdldFdlZWtEYXlzRm9ybWF0dGVkKCk7XHJcblxyXG4gICAgY29uc3QgJG1vbnRoID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJNb250aFwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9faGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tcHJldiR7KHRoaXMub3B0aW9ucy5taW5EYXRlICYmIGRhdGUgPD0gdGhpcy5vcHRpb25zLm1pbkRhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNyAxM0wxIDdMNyAxXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fdGl0bGVcIj4ke21vbnRoVGl0bGV9ICR7ZGF0ZS5nZXRGdWxsWWVhcigpfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLW5leHQkeyh0aGlzLm9wdGlvbnMubWF4RGF0ZSAmJiBkYXRlID49IHRoaXMub3B0aW9ucy5tYXhEYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEgMC45OTk5OTlMNyA3TDEgMTNcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrXCI+JHt3ZWVrRGF5cy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla2RheVwiPiR7aXRlbS50aXRsZX08L2Rpdj5gXHJcbiAgICAgICAgICAgIH0pLmpvaW4oJycpfTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2RheXNcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGB0YLRgNC10LvQutC4XHJcbiAgICBbXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tcHJldicsIG5hbWU6ICdwcmV2J30sXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tbmV4dCcsIG5hbWU6ICduZXh0J30sXHJcbiAgICBdLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgY29uc3QgJGFycm93ID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoaXRlbS5zZWxlY3Rvcik7XHJcbiAgICAgICAgJGFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgIC8vINCy0YDQtdC80LXQvdC90LDRjyDQvNC10YDQsCwg0LvRg9GH0YjQtSDQv9C10YDQtdCy0LXRgNGB0YLQsNGC0YwsINCy0YvQvdC10YHRgtC4INGB0YLRgNC10LvQutC4INC30LAg0L/RgNC10LTQtdC70Ysg0L/QtdGA0LXRgNC10YDQuNGB0L7QstGL0LLQsNC10LzQvtC5INC+0LHQu9Cw0YHRgtC4INC/0LjQutC10YDQsFxyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fb25BcnJvd0NsaWNrKCRhcnJvdywgaXRlbS5uYW1lKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vINGA0LXQvdC00LXRgCDQtNC90LXQuVxyXG4gICAgY29uc3QgJGRheXMgPSAkbW9udGgucXVlcnlTZWxlY3RvcignLk1vbnRoX19kYXlzJyk7XHJcbiAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgZGF5cy5zZXREYXRlKDEpO1xyXG4gICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICB3aGlsZSAoZGF5cy5nZXRNb250aCgpID09IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZVdlZWsoKTtcclxuXHJcbiAgICAgICAgd2Vla0RheXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgaWYgKGRheXMuZ2V0RGF5KCkgIT0gaXRlbS5kYXkgfHwgZGF5cy5nZXRNb250aCgpICE9IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZUVtcHR5RGF5KCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRGF5KGRheXMpKTtcclxuICAgICAgICAgICAgZGF5cy5zZXREYXRlKGRheXMuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRkYXlzLmFwcGVuZENoaWxkKCR3ZWVrKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJG1vbnRoO1xyXG59XHJcblxyXG4vKipcclxuICog0JrQu9C40Log0L/QviDRgdGC0YDQtdC70LrQtSDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y8g0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGFycm93IEhUTUwg0Y3Qu9C10LzQtdC90YJcclxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgICAg0JjQvNGPIChwcmV2LCBuZXh0KVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25BcnJvd0NsaWNrID0gZnVuY3Rpb24oJGFycm93LCBuYW1lKSB7XHJcbiAgICBpZiAoJGFycm93LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUocGFyc2VJbnQodGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuTW9udGgnKS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIChuYW1lID09ICdwcmV2JyA/IC10aGlzLm9wdGlvbnMubW9udGhzQ291bnQgOiB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpKTtcclxuXHJcbiAgICAvLyDQstGL0YXQvtC0INC30LAg0L/RgNC10LTQtdC70Ysg0LzQuNC90LjQvNCw0LvRjNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKGRhdGUgPCB0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWluRGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGVuZERhdGUgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgZW5kRGF0ZS5zZXRNb250aChlbmREYXRlLmdldE1vbnRoKCkgKyB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpO1xyXG4gICAgICAgIGlmIChlbmREYXRlID4gdGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICAgICAgZGF0ZS5zZXRUaW1lKHRoaXMub3B0aW9ucy5tYXhEYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpIC0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50ICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0LXRgNC10YXQvtC0INC6INC90L7QstC+0Lkg0LTQsNGC0LVcclxuICAgIHRoaXMuX3NlbGVjdERhdGUoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10Lkg0LTQsNGC0Ysg0YEg0YDQtdC90LTQtdGA0L7QvFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3NlbGVjdERhdGUgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICB0aGlzLl9zZWxlY3RlZERhdGUgPSBkYXRlO1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRocyhkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQvdC10LTQtdC70LhcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVXZWVrID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIldlZWtcIj48L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkd2VlaztcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC90Y9cclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVEYXkgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXlcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiIGRhdGEtZGF5PVwiJHtkYXRlLmdldERheSgpfVwiPiR7ZGF0ZS5nZXREYXRlKCl9PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25EYXlDbGlja0V2ZW50LmJpbmQodGhpcykpO1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLl9vbkRheU1vdXNlRW50ZXJFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICAgIHRoaXMuX3VwZGF0ZURheSgkZGF5KTtcclxuXHJcbiAgICByZXR1cm4gJGRheTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLk1vbnRoJykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZU1vbnRoKCRtb250aCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuSDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtFbGVtZW50fSAkbW9udGgg0K3Qu9C10LzQtdC90YIg0LzQtdGB0Y/RhtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl91cGRhdGVNb250aCA9IGZ1bmN0aW9uKCRtb250aCkge1xyXG4gICAgJG1vbnRoLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpLmZvckVhY2goJGRheSA9PiB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlRGF5KCRkYXkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Lkg0LTQvdGPXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQrdC70LXQvNC10L3RgiDQtNC90Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3VwZGF0ZURheSA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGNvbnN0IGRhdGUgICA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgY29uc3QgbG9ja2VkID0gdGhpcy5fZmlsdGVyTG9ja0RheXMoZGF0ZSk7XHJcbiAgICBjb25zdCB0b2RheSAgPSB0aGlzLl90b2RheS5nZXRUaW1lKCkgPT0gZGF0ZS5nZXRUaW1lKCk7XHJcblxyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1kaXNhYmxlZCcsIGxvY2tlZCk7XHJcbiAgICAkZGF5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLWxvY2tlZCcsIGxvY2tlZCA9PSBMT0NLX0xPQ0tFRCk7XHJcbiAgICAkZGF5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLXRvZGF5JywgdG9kYXkpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0LrQu9C40LrQsCDQv9C+INC00L3RjlxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlDbGlja0V2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdGhpcy5fb25EYXlDbGljayhlLnRhcmdldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDRhdC+0LLQtdGA0LBcclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5TW91c2VFbnRlckV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdGhpcy5fb25EYXlNb3VzZUVudGVyKGUudGFyZ2V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCl0L7QstC10YAg0L3QsCDRjdC70LXQvNC10L3RgtC1INC00L3Rj1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlNb3VzZUVudGVyID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5LmRhdGFzZXQudGltZSA9PSB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLmdldFRpbWUoKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRlX3RvID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0LvQuNC6INC/0L4g0LTQvdGOXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheUNsaWNrID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgLy8g0LTQtdC90Ywg0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC9XHJcbiAgICBpZiAoJGRheS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpXHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrKCdkYXlTZWxlY3QnLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQsdGA0L7RgSDQstGL0LHRgNCw0L3QvdC+0LPQviDRgNCw0L3QtdC1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG5cclxuICAgIC8vINCy0YvQsdGA0LDQvdCwINC90LDRh9Cw0LvRjNC90LDRjyAvINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlUmVzZXQoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yYW5nZVNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktC40LfRg9Cw0LvRjNC90YvQuSDRgdCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fcmFuZ2VWaXN1YWxSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgJGRheXMgPSB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpO1xyXG4gICAgJGRheXMuZm9yRWFjaCgkZGF5ID0+IHtcclxuICAgICAgICAkZGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nLCAnaXMtc2VsZWN0ZWQtdG8nLCAnaXMtc2VsZWN0ZWQtYmV0d2VlbicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0L/RgNGP0YfQtdC8INC/0L7QtNGB0LrQsNC30LrRg1xyXG4gICAgdGhpcy5fdG9vbHRpcEhpZGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LjQt9GD0LDQu9GM0L3QvtC1INCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3JhbmdlVmlzdWFsU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBpZiAoZGF0ZV9mcm9tICYmIGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGVfdG8gJiYgZGF0ZV90byBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0aW1lX2Zyb20gPSBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV9mcm9tLmdldFRpbWUoKSA6IDA7XHJcbiAgICBsZXQgdGltZV90byA9IGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV90by5nZXRUaW1lKCkgOiAwO1xyXG4gICAgaWYgKHRpbWVfZnJvbSA+IHRpbWVfdG8pIHtcclxuICAgICAgICBbdGltZV9mcm9tLCB0aW1lX3RvXSA9IFt0aW1lX3RvLCB0aW1lX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YIg0LzQtdC20LTRgyDQvdCw0YfQsNC70YzQvdC+0Lkg0Lgg0LrQvtC90LXRh9C90L7QuVxyXG4gICAgY29uc3QgJGRheXMgPSB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkZGF5cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICRkYXlzW2ldLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXNlbGVjdGVkLWJldHdlZW4nLCAkZGF5c1tpXS5kYXRhc2V0LnRpbWUgPiB0aW1lX2Zyb20gJiYgJGRheXNbaV0uZGF0YXNldC50aW1lIDwgdGltZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5INC/0L7Qt9C40YbQuNC4XHJcbiAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICBjb25zdCAkZGF5X3RvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuXHJcbiAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgaWYgKHRoaXMuX3Zpc3VhbFNlbGVjdGlvbi4kZGF5X2Zyb21fb2xkICYmIHRoaXMuX3Zpc3VhbFNlbGVjdGlvbi4kZGF5X2Zyb21fb2xkICE9ICRkYXlfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3Zpc3VhbFNlbGVjdGlvbi4kZGF5X2Zyb21fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgaWYgKHRoaXMuX3Zpc3VhbFNlbGVjdGlvbi4kZGF5X3RvX29sZCAmJiB0aGlzLl92aXN1YWxTZWxlY3Rpb24uJGRheV90b19vbGQgIT0gJGRheV90bykge1xyXG4gICAgICAgIHRoaXMuX3Zpc3VhbFNlbGVjdGlvbi4kZGF5X3RvX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7RhdGA0LDQvdC10L3QuNC1INCyINC60LXRiFxyXG4gICAgdGhpcy5fdmlzdWFsU2VsZWN0aW9uLiRkYXlfZnJvbV9vbGQgPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl92aXN1YWxTZWxlY3Rpb24uJGRheV90b19vbGQgPSAkZGF5X3RvO1xyXG5cclxuICAgIHRoaXMuX3NlbGVjdGlvbi4kZGF5X2Zyb20gPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24uJGRheV90byAgID0gJGRheV90bztcclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgIGNvbnN0IGRheXMgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRpbWVfZnJvbSAtIHRpbWVfdG8pIC8gODY0MDBlMykgKyAxO1xyXG4gICAgICAgIHRoaXMuX3Rvb2x0aXBTaG93KGRheXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0J/QvtC60LDQtyDQv9C+0LTRgdC60LDQt9C60LhcclxuICogQHBhcmFtIHtOdW1iZXJ9IGRheXMg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3Rvb2x0aXBTaG93ID0gZnVuY3Rpb24oZGF5cykge1xyXG4gICAgdGhpcy5fJHRvb2x0aXBDb250ZW50LnRleHRDb250ZW50ID0gdGhpcy5fZmlsdGVyVG9vbHRpcFRleHQoZGF5cyk7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zaG93JywgdGhpcy5fJHRvb2x0aXAudGV4dENvbnRlbnQubGVuZ3RoKTtcclxuICAgIHRoaXMuX3Rvb2x0aXBVcGRhdGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INC/0L7Qt9C40YbQuNC4INC/0L7QtNGB0LrQsNC30LrQuFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcFVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uJGRheV90bykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgeCA9IDA7XHJcbiAgICBsZXQgeSA9IDA7XHJcbiAgICBsZXQgJGVsID0gdGhpcy5fc2VsZWN0aW9uLiRkYXlfdG87XHJcbiAgICBkbyB7XHJcbiAgICAgICAgeSArPSAkZWwub2Zmc2V0VG9wO1xyXG4gICAgICAgIHggKz0gJGVsLm9mZnNldExlZnQ7XHJcbiAgICB9IHdoaWxlICgoJGVsID0gJGVsLm9mZnNldFBhcmVudCkgJiYgJGVsICE9IHRoaXMuXyRwaWNrZXIpO1xyXG5cclxuICAgIHRoaXMuXyR0b29sdGlwLnN0eWxlLnRvcCA9IE1hdGgucm91bmQoeSAtIHRoaXMuXyR0b29sdGlwLm9mZnNldEhlaWdodCkgKyAncHgnO1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUubGVmdCA9IE1hdGgucm91bmQoeCArIHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvLm9mZnNldFdpZHRoIC8gMiAtIHRoaXMuXyR0b29sdGlwLm9mZnNldFdpZHRoIC8gMikgKyAncHgnO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQutGA0YvRgtGMINC/0L7QtNGB0LrQsNC30LrRg1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcEhpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuXyR0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNob3cnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCi0LXQutGB0YIg0L/QvtC00YHQutCw0LfQutC4INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAqIEBwYXJhbSAge051bWJlcn0gZGF5cyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9maWx0ZXJUb29sdGlwVGV4dCA9IGZ1bmN0aW9uKGRheXMpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmZpbHRlci50b29sdGlwVGV4dCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIudG9vbHRpcFRleHQuY2FsbCh0aGlzLCBkYXlzKSB8fCAnJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5wbHVyYWwoZGF5cywgWyclZCDQtNC10L3RjCcsICclZCDQtNC90Y8nLCAnJWQg0LTQvdC10LknXSkucmVwbGFjZSgnJWQnLCBkYXlzKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0LjQu9GM0YLRgCDQvdC10LTQvtGB0YLRg9C/0L3Ri9GFINC00L3QtdC5XHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fZmlsdGVyTG9ja0RheXMgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQstC90LUg0LTQvtGB0YLRg9C/0L3QvtCz0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlIHx8IGRhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBMT0NLX1VOQVZBSUxBQkxFO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INGE0YPQvdC60YbQuNC4XHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5maWx0ZXIubG9ja0RheXMgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmlsdGVyLmxvY2tEYXlzLmNhbGwoZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRgdC1INC00L3QuCDQtNC+0YHRgtGD0L/QvdGLXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDQuNC30LzQtdC90LXQvdC40Y8g0YDQsNC30LzQtdGA0L7QsiDQvtC60L3QsFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25XaW5kb3dSZXNpemVFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uJGRheV90bykge1xyXG4gICAgICAgIHRoaXMuX3Rvb2x0aXBVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYnJlYWtwb2ludCA9IDA7XHJcbiAgICBjb25zdCBicmVha3BvaW50cyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xyXG4gICAgZm9yIChsZXQgaSBpbiBicmVha3BvaW50cykge1xyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSBicmVha3BvaW50c1tpXSkge1xyXG4gICAgICAgICAgICBicmVha3BvaW50ID0gYnJlYWtwb2ludHNbaV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9zZXRCcmVha3BvaW50KGJyZWFrcG9pbnQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGB0L7RgdGC0L7Rj9C90LjRjyDRgNC10L3QtNC10YDQsCDQv9C+0LQg0YDQsNC30L3Ri9C1INGN0LrRgNCw0L3Ri1xyXG4gKiBAcGFyYW0ge051bWJlcn0gYnJlYWtwb2ludCDQmtC70Y7RhyDQuNC3IHRoaXMub3B0aW9ucy5icmVha3BvaW50cyAo0KjQuNGA0LjQvdCwINGN0LrRgNCw0L3QsClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3NldEJyZWFrcG9pbnQgPSBmdW5jdGlvbihicmVha3BvaW50KSB7XHJcbiAgICAvLyDQvtGCINC90LXQvdGD0LbQvdC+0Lkg0L/QtdGA0LXRgNC40YHQvtCy0LrQuFxyXG4gICAgaWYgKHRoaXMuX2JyZWFrcG9pbnQgPT0gYnJlYWtwb2ludCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuX2JyZWFrcG9pbnQgPSBicmVha3BvaW50O1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCB0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pO1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRocyh0aGlzLl9zZWxlY3RlZERhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0K3Qu9C10LzQtdC90YIg0LrQsNC70LXQvdC00LDRgNC90L7Qs9C+INC00L3Rj1xyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9ICAgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGdldERheUJ5RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpbWUgPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogMDtcclxuICAgIHJldHVybiB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5EYXlbZGF0YS10aW1lPVwiJyArIHRpbWUgKyAnXCJdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPIC0g0LfQsNCz0LvRg9GI0LrQuFxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVtcHR5RGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXkgaXMtZW1wdHlcIj48L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkZGF5O1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwINC40LcgSFRNTCDRgtC10LrRgdGC0LBcclxuICogQHBhcmFtICB7U3RyaW5nfSBodG1sIEhUTUwg0YLQtdC60YHRglxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XHJcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgIHJldHVybiBkaXYuY2hpbGRyZW4ubGVuZ3RoID4gMSA/IGRpdi5jaGlsZHJlbiA6IGRpdi5maXJzdEVsZW1lbnRDaGlsZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNhZmUg0LLRi9C30L7QsiDQstC90LXRiNC90LjRhSDRgdC+0LHRi9GC0LjQuSDQutC+0LzQv9C+0L3QtdC90YLQsFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZiDQmNC80Y8g0YHQvtCx0YvRgtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2NhbGxiYWNrID0gZnVuY3Rpb24oZikge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25bZl0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub25bZl0uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm47XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGVSYW5nZVBpY2tlcjtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==

/***/ }),

/***/ "./src/demo/daterangepicker-dropdown.js":
/*!**********************************************!*\
  !*** ./src/demo/daterangepicker-dropdown.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LOCK_LOCKED": () => (/* reexport safe */ _daterangepicker_wrapper__WEBPACK_IMPORTED_MODULE_0__.LOCK_LOCKED),
/* harmony export */   "LOCK_UNAVAILABLE": () => (/* reexport safe */ _daterangepicker_wrapper__WEBPACK_IMPORTED_MODULE_0__.LOCK_UNAVAILABLE),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _daterangepicker_wrapper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./daterangepicker-wrapper */ "./src/demo/daterangepicker-wrapper.js");




function DateRangePickerDropdown($element, options = {}) {
    // ссылка на экземпляр
    if ($element.instance) {
        return $element.instance;
    }

    // определение мобилки
    Object.defineProperty(this, '_isMobile', {
        get: () => window.innerWidth <= 960,
    });

    // автоподтверждение выбранных дат
    Object.defineProperty(this, '_autoApply', {
        get: () => !this._isMobile,
    });

    this._$dropdown = this._$createElement(
        `<div class="Daterangepicker-dropdown">
            <div class="Daterangepicker-dropdown__header">
                <div class="Daterangepicker-dropdown__header-close">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 8L2 8M2 8L8.5 14.5M2 8L8.5 1.5" stroke="black" stroke-width="2"/>
                    </svg>
                </div>
                <div class="Daterangepicker-dropdown__header-title">Даты поездки</div>
            </div>
            <div class="Daterangepicker-dropdown__wrapper"></div>
            <div class="Daterangepicker-dropdown__footer">
                <div class="Daterangepicker-dropdown__confirm">
                    <div class="Daterangepicker-dropdown__confirm-button">
                        Применить
                    </div>
                </div>
            </div>
        </div>`
    );
    this._$dropdownWrapper = this._$dropdown.querySelector('.Daterangepicker-dropdown__wrapper');

    // элементы
    this._$element = $element;

    /////////////
    // мобилка //
    /////////////

    // закрытие модалки
    this._$close = this._$dropdown.querySelector('.Daterangepicker-dropdown__header-close');
    if (this._$close) {
        this._$close.addEventListener('click', this.close.bind(this));
    }

    // контейнер для элемента датапикера
    this._$dropdownFooter        = this._$dropdown.querySelector('.Daterangepicker-dropdown__footer');
    this._$dropdownConfirmButton = this._$dropdown.querySelector('.Daterangepicker-dropdown__confirm-button');

    // обновление видимости футера модалки при прокрутке
    this._$dropdownWrapper.addEventListener('scroll', this.updateFooterVisibility.bind(this));

    // кнопка подтверждения
    if (this._$dropdownConfirmButton) {
        this._$dropdownConfirmButton.addEventListener('click', this.apply.bind(this));
    }

    // наследуемся
    _daterangepicker_wrapper__WEBPACK_IMPORTED_MODULE_0__.default.call(this, this._$dropdownWrapper, Object.assign({}, options, {
        monthsCount: 2,
        singleMode: false,
        breakpoints: {
            960: {
                monthsCount: 12,
            },
        },
    }));

    // обёртка элементов
    this._$element.appendChild(this._$dropdown);
    this._$element.addEventListener('click', this._onClickEvent.bind(this));
}

// цепочка прототипов
DateRangePickerDropdown.prototype = Object.create(_daterangepicker_wrapper__WEBPACK_IMPORTED_MODULE_0__.default.prototype, {
    constructor: {
        value: DateRangePickerDropdown,
        enumerable: false,
        writable: true,
    }
});

/**
 * Инициализация компонента
 */
DateRangePickerDropdown.prototype.init = function() {
    _daterangepicker_wrapper__WEBPACK_IMPORTED_MODULE_0__.default.prototype.init.call(this);

    // плавные анимации
    this._$dropdown.classList.add('is-initialized');
}

/**
 * Событие клика на контейнер
 * @param {Event} e DOM событие
 */
DateRangePickerDropdown.prototype._onClickEvent = function(e) {
    this.open();
}

/**
 * Событие клика вне элемента
 * @param {Event} e DOM событие
 */
DateRangePickerDropdown.prototype._onDocumentClickEvent = function(e) {
    if (this._$dropdown.contains(e.target)) {
        return;
    }

    this.close();
}

/**
 * Показ элемента
 */
DateRangePickerDropdown.prototype.open = function() {
    if (this._$dropdown.classList.contains('is-opened')) {
        return;
    }
    this._$dropdown.classList.add('is-opened');

    // мобилка
    if (this._isMobile) {
        document.body.classList.add('modal-active');

        // прокрутка до предвыбранных дат
        const $dayFrom = this._$dropdown.querySelector('.is-selected-from');
        if ($dayFrom) {
            $dayFrom.scrollIntoView({
                block: 'center',
                behavior: 'smooth',
            });
        }

        // манипуляции с историей браузера
        window.history.pushState({
            daterangepicker: true,
        }, 'Выбор дат');
        this._onPopStateEventBind = this._onPopStateEvent.bind(this);
        window.addEventListener('popstate', this._onPopStateEventBind);
    }

    // обновление позиции подсказки
    this._tooltipUpdate();

    // позволяем событию завершиться
    if (!this._onDocumentClickEventBind) {
        this._onDocumentClickEventBind = this._onDocumentClickEvent.bind(this);
        setTimeout(() => {
            document.addEventListener('click', this._onDocumentClickEventBind);
        }, 0);
    }
}

/**
 * Скрытие элемента
 */
DateRangePickerDropdown.prototype.close = function() {
    if (!this._$dropdown.classList.contains('is-opened')) {
        return;
    }

    // мобилка
    if (this._isMobile) {
        document.body.classList.remove('modal-active');

        // манипуляции с историей браузера
        window.removeEventListener('popstate', this._onPopStateEventBind);
    }

    if (this._onDocumentClickEventBind) {
        document.removeEventListener('click', this._onDocumentClickEventBind);
        delete this._onDocumentClickEventBind;
    }

    // позволяем событию завершиться
    setTimeout(() => {
        this._$dropdown.classList.remove('is-opened');

        if (!this._autoApply) {
            // необходимость ручного подтверждения выбора дат
            delete this._enableRangeSelectCallback;

            // выбираем последние подтверждённые даты
            if (this._lastAppliedDateFrom && this._lastAppliedDateTo) {
                setTimeout(() => {
                    this._selection.date_from = this._lastAppliedDateFrom;
                    this._selection.date_to = this._lastAppliedDateTo;
                    this._rangeVisualSelect(this._lastAppliedDateFrom, this._lastAppliedDateTo);
                }, 200);
            }
        }
    }, 0);
}

/**
 * Событие сброса выделения
 */
DateRangePickerDropdown.prototype.rangeReset = function() {
    _daterangepicker_wrapper__WEBPACK_IMPORTED_MODULE_0__.default.prototype.rangeReset.call(this);
    console.log('rangeReset');

    // видимость кнопки "Применить" на мобилке
    this.updateFooterVisibility();
}

/**
 * Выбор диапазона дат
 * @param {Date} date_from Начальная дата
 * @param {Date} date_to   Конечная дата
 */
DateRangePickerDropdown.prototype.rangeSelect = function(date_from, date_to) {
    _daterangepicker_wrapper__WEBPACK_IMPORTED_MODULE_0__.default.prototype.rangeSelect.call(this, date_from, date_to);

    // видимость кнопки "Применить" на мобилке
    this.updateFooterVisibility();

    if (this._autoApply) {
        this.apply();
    }
}

/**
 * Safe вызов внешних событий компонента
 * @param {String} f Имя события
 */
DateRangePickerDropdown.prototype._callback = function(f) {
    // на мобилке событие rangeSelect вызывается только по кнопке "Применить"
    if (!this._autoApply && f == 'rangeSelect' && !this._enableRangeSelectCallback) {
        return;
    }

    _daterangepicker_wrapper__WEBPACK_IMPORTED_MODULE_0__.default.prototype._callback.apply(this, arguments);
}

/**
 * Подтверждение выбора дат
 */
DateRangePickerDropdown.prototype.apply = function() {
    const date_from = this.getDateFrom();
    const date_to   = this.getDateTo();

    this._lastAppliedDateFrom = date_from;
    this._lastAppliedDateTo   = date_to;

    if (!date_from || !date_to) {
        return;
    }

    // на мобилке событие rangeSelect глушится т.к. требуется подтверждение по кнопке "Применить"
    if (!this._autoApply) {
        this._enableRangeSelectCallback = true;
        _daterangepicker_wrapper__WEBPACK_IMPORTED_MODULE_0__.default.prototype.rangeSelect.call(this, date_from, date_to);
    }

    this._$element.dispatchEvent(new Event('change', {
        bubbles: true,
        cancelable: true,
    }));

    this.close();
}

/**
 * Форматирование даты
 * @param  {Date} date Дата
 * @return {String}    Дата в формате - 8 март, чт
 */
DateRangePickerDropdown.prototype.getDateTitleFormatted = function(date) {
    if (!date || !(date instanceof Date)) {
        return '';
    }

    const month = new Intl.DateTimeFormat('ru-RU', {month: 'short'}).format(date).replace('.', '');
    const weekday = new Intl.DateTimeFormat('ru-RU', {weekday: 'short'}).format(date);
    return date.getDate() + ' ' + month + ', <font color="#8C8C8C">' + weekday + '</font>';
}

/**
 * Обновление состояния футера в модалке
 * скрывается при прокрутке вверх и если не выбраны даты
 */
DateRangePickerDropdown.prototype.updateFooterVisibility = function() {
    if (typeof this._dropdownContainerPrevScroll == 'undefined') {
        this._dropdownContainerPrevScroll = this._$dropdownWrapper.scrollTop;
    }

    const bothDatesSelected = !!this.getDateFrom() && !!this.getDateTo();
    const scrolledDown = this._dropdownContainerPrevScroll >= this._$dropdownWrapper.scrollTop;
    const isActive = [
        bothDatesSelected,
        // scrolledDown,
    ].every(v => v);

    this._$dropdownFooter.classList.toggle('is-active', isActive);
    this._dropdownContainerPrevScroll = this._$dropdownWrapper.scrollTop;
}

/**
 * Событие нажатия кнопки "назад" в браузере
 * @param {Event} e DOM Событие
 */
DateRangePickerDropdown.prototype._onPopStateEvent = function(e) {
    this.close();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DateRangePickerDropdown);


/***/ }),

/***/ "./src/demo/daterangepicker-wrapper.js":
/*!*********************************************!*\
  !*** ./src/demo/daterangepicker-wrapper.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LOCK_LOCKED": () => (/* reexport safe */ _dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0__.LOCK_LOCKED),
/* harmony export */   "LOCK_UNAVAILABLE": () => (/* reexport safe */ _dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0__.LOCK_UNAVAILABLE),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../dist/daterangepicker */ "./dist/daterangepicker.js");
/* harmony import */ var _dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0__);




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
    _dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0___default().call(this, $element, options);

    this._$picker.classList.add('Daterangepicker-wrapper');
}

// цепочка прототипов
DateRangePickerWrapper.prototype = Object.create((_dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0___default().prototype), {
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
        return _dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0__.LOCK_LOCKED;
    }

    return _dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0___default().prototype._filterLockDays.call(this, date);
}

/**
 * Визуальное выделение элементов
 * @param {Date} date_from Начальная дата
 * @param {Date} date_to   Конечная дата
 */
DateRangePickerWrapper.prototype._rangeVisualSelect = function(date_from, date_to) {
    _dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0___default().prototype._rangeVisualSelect.call(this, date_from, date_to);

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

            $wrapper = this._$createElement('<div class="Days__selected"></div>');
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
    _dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0___default().prototype._rangeVisualReset.call(this);

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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DateRangePickerWrapper);


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
/* harmony import */ var _daterangepicker_dropdown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./daterangepicker-dropdown */ "./src/demo/daterangepicker-dropdown.js");



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

new (_dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0___default())(document.querySelector('#daterangepicker'), {
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

const dropdown = new _daterangepicker_dropdown__WEBPACK_IMPORTED_MODULE_1__.default(document.querySelector('#daterangepicker-dropdown'), {
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9kaXN0L2RhdGVyYW5nZXBpY2tlci5qcyIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9zcmMvZGVtby9kYXRlcmFuZ2VwaWNrZXItZHJvcGRvd24uanMiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2RlbW8vZGF0ZXJhbmdlcGlja2VyLXdyYXBwZXIuanMiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9kZW1vL3BhZ2Uuc2Nzcz8yMThhIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9kZW1vL3BhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJLElBQXlEO0FBQzdEO0FBQ0EsTUFBTSxFQUtnQztBQUN0QyxDQUFDO0FBQ0Qsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQSxjQUFjLDhCQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxnQkFBZ0IsOEJBQW1CLHdCQUF3Qiw4QkFBbUI7QUFDOUUsbURBQW1ELHlDQUF5QztBQUM1RjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNB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QTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsOERBQVc7QUFDbEM7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQscUJBQXFCLDhEQUF1QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qiw4REFBVztBQUNsQzs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBIiwiZmlsZSI6Ii4vZGVtby9wYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJEYXRlcmFuZ2VwaWNrZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovICgoKSA9PiB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0XCJ1c2Ugc3RyaWN0XCI7XG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIHNjb3BlXG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG4vKioqKioqLyBcdFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG4vKioqKioqLyBcdFx0XHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG4vKioqKioqLyBcdFx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuLyoqKioqKi8gXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG4vKioqKioqLyBcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSlcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcbi8qKioqKiovIFx0XHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuLyoqKioqKi8gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbi8vIFRoaXMgZW50cnkgbmVlZCB0byBiZSB3cmFwcGVkIGluIGFuIElJRkUgYmVjYXVzZSBpdCBuZWVkIHRvIGJlIGlzb2xhdGVkIGFnYWluc3Qgb3RoZXIgZW50cnkgbW9kdWxlcy5cbigoKSA9PiB7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL3Njc3MvZGF0ZXJhbmdlcGlja2VyLnNjc3MgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuXG59KSgpO1xuXG4vLyBUaGlzIGVudHJ5IG5lZWQgdG8gYmUgd3JhcHBlZCBpbiBhbiBJSUZFIGJlY2F1c2UgaXQgbmVlZCB0byBiZSBpc29sYXRlZCBhZ2FpbnN0IG90aGVyIGVudHJ5IG1vZHVsZXMuXG4oKCkgPT4ge1xuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvanMvZGF0ZXJhbmdlcGlja2VyLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0ICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCB7XG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiTE9DS19VTkFWQUlMQUJMRVwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBMT0NLX1VOQVZBSUxBQkxFKSxcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJMT0NLX0xPQ0tFRFwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBMT0NLX0xPQ0tFRCksXG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiZGVmYXVsdFwiOiAoKSA9PiAoX19XRUJQQUNLX0RFRkFVTFRfRVhQT1JUX18pXG4vKiBoYXJtb255IGV4cG9ydCAqLyB9KTtcbi8vINGB0L7RgdGC0L7Rj9C90LjRjyDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbmNvbnN0IExPQ0tfVU5BVkFJTEFCTEUgPSAxO1xyXG5jb25zdCBMT0NLX0xPQ0tFRCAgICAgID0gMjtcclxuXHJcbmNvbnN0IElOREVYX0RBVEVfRlJPTSA9IDA7XHJcbmNvbnN0IElOREVYX0RBVEVfVE8gICA9IDE7XHJcblxyXG5mdW5jdGlvbiBEYXRlUmFuZ2VQaWNrZXIoJGNvbnRhaW5lciwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICAvLyDQvtGCINC/0L7QstGC0L7RgNC90L7QuSDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuFxyXG4gICAgaWYgKCRjb250YWluZXIuaW5zdGFuY2UpIHtcclxuICAgICAgICByZXR1cm4gJGNvbnRhaW5lci5pbnN0YW5jZTtcclxuICAgIH1cclxuICAgICRjb250YWluZXIuaW5zdGFuY2UgPSB0aGlzO1xyXG5cclxuICAgIHRoaXMuXyRjb250YWluZXIgPSAkY29udGFpbmVyO1xyXG5cclxuICAgIC8vINC30L3QsNGH0LXQvdC40LUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICAgIGNvbnN0IGR2ID0gKHgsIHYpID0+IHR5cGVvZiB4ID09ICd1bmRlZmluZWQnID8gdiA6IHg7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgIGZpcnN0RGF5T2ZUaGVXZWVrOiBkdihvcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrLCAxKSwgLy8g0L/QtdGA0LLRi9C5INC00LXQvdGMINC90LXQtNC10LvQuCwgMCA9INCy0YEsIDEgPSDQv9C9LCAuLi5cclxuICAgICAgICBzaW5nbGVNb2RlOiAgICAgICAgZHYob3B0aW9ucy5zaW5nbGVNb2RlLCBmYWxzZSksICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRiyDQstC80LXRgdGC0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICAgICAgbG9jYWxlOiAgICAgICAgICAgIGR2KG9wdGlvbnMubG9jYWxlLCAncnUtUlUnKSxcclxuICAgICAgICBtaW5EYXlzOiAgICAgICAgICAgZHYob3B0aW9ucy5taW5EYXlzLCAxKSwgICAgICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LTQuNCw0L/QsNC30L7QvdC1XHJcbiAgICAgICAgbW9udGhzQ291bnQ6ICAgICAgIGR2KG9wdGlvbnMubW9udGhzQ291bnQsIDEyKSxcclxuICAgICAgICBwZXJSb3c6ICAgICAgICAgICAgZHYob3B0aW9ucy5wZXJSb3csIHVuZGVmaW5lZCksICAgIC8vINC60L7Qu9C40YfQtdGB0YLQstC+INC80LXRgdGP0YbQtdCyINCyINGA0Y/QtNGDXHJcbiAgICAgICAgbWluRGF0ZTogICAgICAgICAgIGR2KG9wdGlvbnMubWluRGF0ZSwgbmV3IERhdGUoKSksICAvLyDQvNC40L3QuNC80LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgICAgbWF4RGF0ZTogICAgICAgICAgIGR2KG9wdGlvbnMubWF4RGF0ZSwgdW5kZWZpbmVkKSxcclxuICAgICAgICBicmVha3BvaW50czogICAgICAgZHYob3B0aW9ucy5icmVha3BvaW50cywge30pLFxyXG4gICAgICAgIGludGVybmFsSW5wdXRzOiAgICBkdihvcHRpb25zLmludGVybmFsSW5wdXRzLCB0cnVlKSwgLy8g0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40LUg0LLRgdGC0YDQvtC10L3QvdGL0YUg0LjQvdC/0YPRgtC+0LJcclxuICAgICAgICAvLyDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICAgIG9uOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgcmFuZ2VTZWxlY3Q6IG51bGwsIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAgICAgICAgICAgIGRheVNlbGVjdDogICBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0L7QtNC90L7QuSDQtNCw0YLRiyAo0YLQvtC70YzQutC+INC/0YDQuCBzaW5nbGVNb2RlOiB0cnVlKVxyXG4gICAgICAgIH0sIG9wdGlvbnMub24gfHwge30pLFxyXG4gICAgICAgIC8vINGE0LjQu9GM0YLRgNGD0Y7RidC40LUg0LzQtdGC0L7QtNGLXHJcbiAgICAgICAgZmlsdGVyOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgbG9ja0RheXM6ICAgIG51bGwsIC8vIGNhbGxiYWNrKGRhdGUpINGE0YPQvdC60YbQuNGPINCx0LvQvtC60LjRgNC+0LLQsNC90LjRjyDQtNCw0YIsIHRydWUvTE9DS1xyXG4gICAgICAgICAgICB0b29sdGlwVGV4dDogbnVsbCwgLy8gY2FsbGJhY2soZGF5cykg0LLRi9Cy0L7QtCDRgtC10LrRgdGC0LAg0L/QvtC00YHQutCw0LfQutC4XHJcbiAgICAgICAgfSwgb3B0aW9ucy5maWx0ZXIgfHwge30pLFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0YDRj9C00L3QvtGB0YLRjFxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGVyUm93ID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnBlclJvdyA9IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMubWluRGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtC/0YbQuNC4INC00LvRjyDRjdC60YDQsNC90L7QsiDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW3RoaXMuX2JyZWFrcG9pbnQgPSAwXSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyk7XHJcblxyXG4gICAgLy8g0YLQtdC60YPRidC40Lkg0LTQtdC90YxcclxuICAgIHRoaXMuX3RvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIHRoaXMuX3RvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIHRoaXMuXyRwaWNrZXIgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlclwiPlxyXG4gICAgICAgICAgICAke3RoaXMub3B0aW9ucy5pbnRlcm5hbElucHV0cyA/XHJcbiAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9faW5wdXRzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJHt0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkYXRlXCI+YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkYXRlX2Zyb21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV90b1wiPmBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5gIDogJydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX19tb250aHNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcC1jb250ZW50XCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgLy8g0Y3Qu9C10LzQtdC90YLRi1xyXG4gICAgdGhpcy5fJG1vbnRocyAgICAgICAgID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX19tb250aHMnKTtcclxuICAgIHRoaXMuXyR0b29sdGlwICAgICAgICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcCcpO1xyXG4gICAgdGhpcy5fJHRvb2x0aXBDb250ZW50ID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX190b29sdGlwLWNvbnRlbnQnKTtcclxuXHJcbiAgICAvLyDQv9C+0LvRjyDQstCy0L7QtNCwXHJcbiAgICB0aGlzLl8kaW5wdXRzID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lXj1cImRhdGVcIl0nKTtcclxuXHJcbiAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICAgIHRoaXMuX3NlbGVjdGlvbiAgICAgICA9IHt9O1xyXG4gICAgdGhpcy5fdmlzdWFsU2VsZWN0aW9uID0ge307XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKHRoaXMub3B0aW9ucy5taW5EYXRlKTtcclxuICAgIHRoaXMuXyRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fJHBpY2tlcik7XHJcblxyXG4gICAgLy8g0L7QsdGA0LDQsdC+0YLQutCwINCx0YDQtdC50LrQv9C+0LjQvdGC0L7QslxyXG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykubGVuZ3RoKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uV2luZG93UmVzaXplRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5fb25XaW5kb3dSZXNpemVFdmVudCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0J3QsNC30LLQsNC90LjQtSDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRNb250aEZvcm1hdHRlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7bW9udGg6ICdsb25nJ30pO1xyXG4gICAgcmV0dXJuIHRpdGxlLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aXRsZS5zbGljZSgxKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0Ysg0LTQu9GPINGC0LXQutGD0YnQtdC5INC70L7QutCw0LvQuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyDQn9Cw0YDQsNC80LXRgtGA0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlVGltZUZvcm1hdCA9IGZ1bmN0aW9uKGRhdGUsIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMub3B0aW9ucy5sb2NhbGUsIG9wdGlvbnMpLmZvcm1hdChkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCU0L3QuCDQvdC10LTQtdC70LhcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0V2Vla0RheXNGb3JtYXR0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gMik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7ICsraSkge1xyXG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgZGF5OiBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7d2Vla2RheTogJ3Nob3J0J30pLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINGB0L7Qs9C70LDRgdC90L4g0L3QsNGB0YLRgNC+0LXQvdC90L7QvNGDINC/0LXRgNCy0L7QvNGDINC00L3RjiDQvdC10LTQtdC70LhcclxuICAgIHJlc3VsdC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmlyc3REYXlPZlRoZVdlZWsgPSB0aGlzLm9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgJSA3O1xyXG4gICAgICAgIGxldCBkYXlBID0gYS5kYXk7XHJcbiAgICAgICAgbGV0IGRheUIgPSBiLmRheTtcclxuXHJcbiAgICAgICAgaWYgKGRheUEgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUIgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QSA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIGRheUEgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlCIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgZGF5QiArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRheUEgLSBkYXlCO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC80LXRgdGP0YbQtVxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9ICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERheXNDb3VudEluTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRheXMuc2V0TW9udGgoZGF5cy5nZXRNb250aCgpICsgMSk7XHJcbiAgICBkYXlzLnNldERhdGUoMCk7XHJcbiAgICByZXR1cm4gZGF5cy5nZXREYXRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9yYW5nZVJlc2V0KCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktGL0LTQtdC70LXQvdC40LUg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5yYW5nZVNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgaWYgKCEoZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSkgfHwgIShkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAvLyDQtNC+0L/Rg9GB0YLQuNC80YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUoZGF0ZV9mcm9tLCBkYXRlX3RvKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICBjb25zdCAkZGF5X3RvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuXHJcbiAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdChkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG5cclxuICAgIC8vINGB0L7RhdGA0LDQvdC10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjRj1xyXG4gICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IGRhdGVfZnJvbTtcclxuICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvICAgPSBkYXRlX3RvO1xyXG5cclxuICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LVcclxuICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtCx0L3QvtCy0LvQtdC90LjQtSDQuNC90L/Rg9GC0L7QslxyXG4gICAgaWYgKHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9GUk9NXSkge1xyXG4gICAgICAgIHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9GUk9NXS52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfVE9dKSB7XHJcbiAgICAgICAgdGhpcy5fJGlucHV0c1tJTkRFWF9EQVRFX1RPXS52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0LHRi9GC0LjQtVxyXG4gICAgdGhpcy5fY2FsbGJhY2soJ3JhbmdlU2VsZWN0JywgZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0YtcclxuICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge1N0cmluZ30gZm9ybWF0INCk0L7RgNC80LDRgiDRgdGC0YDQvtC60LhcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSwgZm9ybWF0ID0gJ1ktbS1kJykge1xyXG4gICAgaWYgKCEoZGF0ZSBpbnN0YW5jZW9mIERhdGUpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmb3JtYXQucmVwbGFjZSgnWScsIGRhdGUuZ2V0RnVsbFllYXIoKSlcclxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgnbScsICgnMCcgKyAoZGF0ZS5nZXRNb250aCgpICsgMSkpLnNsaWNlKC0yKSlcclxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgnZCcsICgnMCcgKyAoZGF0ZS5nZXREYXRlKCkpKS5zbGljZSgtMikpO1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC+0LLQtdGA0LrQsCDQstC+0LfQvNC+0LbQvdC+0YHRgtC4INCy0YvQtNC10LvQtdC90LjRjyDQtNCw0YJcclxuICogQHBhcmFtICB7RGF0ZSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSAge0RhdGUgZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0SXNSYW5nZVNlbGVjdGFibGUgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC80LjQvdC40LzQsNC70YzQvdGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgY29uc3QgZGlmZiA9IE1hdGguYWJzKGRhdGVfZnJvbS5nZXRUaW1lKCkgLSBkYXRlX3RvLmdldFRpbWUoKSkgLyAxMDAwIC8gODY0MDA7XHJcbiAgICBpZiAoZGlmZiA8IHRoaXMub3B0aW9ucy5taW5EYXlzKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDQvtCy0LXRgNC60LAg0L/QvtC/0LDQtNCw0L3QuNGPINCyINC00LjQsNC/0LDQt9C+0L0g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9GFINC00LDRglxyXG4gICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIGRheS5zZXRUaW1lKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG5cclxuICAgIHdoaWxlIChkYXkgPCBkYXRlX3RvKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZpbHRlckxvY2tEYXlzKGRheSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG4vKipcclxuICog0JLRi9Cx0YDQsNC90L3QsNGPINC90LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtEYXRlfSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlRnJvbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0L3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwINC90LUg0YPQutCw0LfQsNC90LBcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvdCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LAg0L/QvtC30LbQtSDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA+IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tO1xyXG59XHJcblxyXG4vKipcclxuICog0JLRi9Cx0YDQsNC90L3QsNGPINC00LDRgtCwIChzaW5nbGVNb2RlOiB0cnVlKVxyXG4gKiBAcmV0dXJuIHtEYXRlfSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlID0gRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlRnJvbTtcclxuXHJcbi8qKlxyXG4gKiDQktGL0LHRgNCw0L3QvdCw0Y8g0LrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtEYXRlfSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlVG8gPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LAg0L3QtSDRg9C60LDQt9Cw0L3QsFxyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvdCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LAg0L/QvtC30LbQtSDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tID4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG87XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60LvQvtC90LXQvdC40LUgKDEg0LHQvtCx0ZHRgCwgMiDQsdC+0LHRgNCwLCA1INCx0L7QsdGA0L7QsilcclxuICogQHBhcmFtICB7TnVtYmVyfSB2YWx1ZSDQmtC+0LvQuNGH0LXRgdGC0LLQvlxyXG4gKiBAcGFyYW0gIHtBcnJheX0gIGZvcm1zINCc0LDRgdGB0LjQsiDQuNC3IDPRhSDRjdC70LXQvNC10L3RgtC+0LIsINC80L7QttC10YIg0YHQvtC00LXRgNC20LDRgtGMINGB0L/QtdGG0LjRhNC40LrQsNGC0L7RgCAlZCDQtNC70Y8g0LfQsNC80LXQvdGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucGx1cmFsID0gZnVuY3Rpb24gKHZhbHVlLCBmb3Jtcykge1xyXG4gICAgcmV0dXJuICh2YWx1ZSAlIDEwID09IDEgJiYgdmFsdWUgJSAxMDAgIT0gMTEgPyBmb3Jtc1swXSA6ICh2YWx1ZSAlIDEwID49IDIgJiYgdmFsdWUgJSAxMCA8PSA0ICYmICh2YWx1ZSAlIDEwMCA8IDEwIHx8IHZhbHVlICUgMTAwID49IDIwKSA/IGZvcm1zWzFdIDogZm9ybXNbMl0pKS5yZXBsYWNlKCclZCcsIHZhbHVlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFJlc2V0KCk7XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24gPSB7fTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC40LDQv9Cw0LfQvtC90LAg0LzQtdGB0Y/RhtC10LJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlTW9udGhzID0gZnVuY3Rpb24oZGF0ZV9mcm9tKSB7XHJcbiAgICB3aGlsZSAodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5yZW1vdmVDaGlsZCh0aGlzLl8kbW9udGhzLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgIHRoaXMuX3Rvb2x0aXBIaWRlKCk7XHJcblxyXG4gICAgLy8g0L/RgNC10YDQtdC90LTQtdGAINC80LXRgdGP0YbQtdCyXHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG4gICAgY29uc3QgJG1vbnRocyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7ICsraSkge1xyXG4gICAgICAgICRtb250aHMucHVzaCh0aGlzLl8kY3JlYXRlTW9udGgoY3VycmVudERhdGUpKTtcclxuICAgICAgICBjdXJyZW50RGF0ZS5zZXRNb250aChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRtb250aHMubGVuZ3RoOyBpICs9IHRoaXMub3B0aW9ucy5wZXJSb3cpIHtcclxuICAgICAgICBjb25zdCAkcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnRGF0ZXJhbmdlcGlja2VyX19yb3cnO1xyXG5cclxuICAgICAgICAkbW9udGhzLnNsaWNlKGksIGkgKyB0aGlzLm9wdGlvbnMucGVyUm93KS5mb3JFYWNoKCRtb250aCA9PiB7XHJcbiAgICAgICAgICAgICRyb3cuYXBwZW5kQ2hpbGQoJG1vbnRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5hcHBlbmRDaGlsZCgkcm93KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCc0LXRgdGP0YZcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVNb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IG1vbnRoVGl0bGUgPSB0aGlzLmdldE1vbnRoRm9ybWF0dGVkKGRhdGUpO1xyXG4gICAgY29uc3Qgd2Vla0RheXMgPSB0aGlzLmdldFdlZWtEYXlzRm9ybWF0dGVkKCk7XHJcblxyXG4gICAgY29uc3QgJG1vbnRoID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJNb250aFwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9faGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tcHJldiR7KHRoaXMub3B0aW9ucy5taW5EYXRlICYmIGRhdGUgPD0gdGhpcy5vcHRpb25zLm1pbkRhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNyAxM0wxIDdMNyAxXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fdGl0bGVcIj4ke21vbnRoVGl0bGV9ICR7ZGF0ZS5nZXRGdWxsWWVhcigpfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLW5leHQkeyh0aGlzLm9wdGlvbnMubWF4RGF0ZSAmJiBkYXRlID49IHRoaXMub3B0aW9ucy5tYXhEYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEgMC45OTk5OTlMNyA3TDEgMTNcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrXCI+JHt3ZWVrRGF5cy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla2RheVwiPiR7aXRlbS50aXRsZX08L2Rpdj5gXHJcbiAgICAgICAgICAgIH0pLmpvaW4oJycpfTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2RheXNcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGB0YLRgNC10LvQutC4XHJcbiAgICBbXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tcHJldicsIG5hbWU6ICdwcmV2J30sXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tbmV4dCcsIG5hbWU6ICduZXh0J30sXHJcbiAgICBdLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgY29uc3QgJGFycm93ID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoaXRlbS5zZWxlY3Rvcik7XHJcbiAgICAgICAgJGFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgIC8vINCy0YDQtdC80LXQvdC90LDRjyDQvNC10YDQsCwg0LvRg9GH0YjQtSDQv9C10YDQtdCy0LXRgNGB0YLQsNGC0YwsINCy0YvQvdC10YHRgtC4INGB0YLRgNC10LvQutC4INC30LAg0L/RgNC10LTQtdC70Ysg0L/QtdGA0LXRgNC10YDQuNGB0L7QstGL0LLQsNC10LzQvtC5INC+0LHQu9Cw0YHRgtC4INC/0LjQutC10YDQsFxyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fb25BcnJvd0NsaWNrKCRhcnJvdywgaXRlbS5uYW1lKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vINGA0LXQvdC00LXRgCDQtNC90LXQuVxyXG4gICAgY29uc3QgJGRheXMgPSAkbW9udGgucXVlcnlTZWxlY3RvcignLk1vbnRoX19kYXlzJyk7XHJcbiAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgZGF5cy5zZXREYXRlKDEpO1xyXG4gICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICB3aGlsZSAoZGF5cy5nZXRNb250aCgpID09IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZVdlZWsoKTtcclxuXHJcbiAgICAgICAgd2Vla0RheXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgaWYgKGRheXMuZ2V0RGF5KCkgIT0gaXRlbS5kYXkgfHwgZGF5cy5nZXRNb250aCgpICE9IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZUVtcHR5RGF5KCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRGF5KGRheXMpKTtcclxuICAgICAgICAgICAgZGF5cy5zZXREYXRlKGRheXMuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRkYXlzLmFwcGVuZENoaWxkKCR3ZWVrKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJG1vbnRoO1xyXG59XHJcblxyXG4vKipcclxuICog0JrQu9C40Log0L/QviDRgdGC0YDQtdC70LrQtSDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y8g0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGFycm93IEhUTUwg0Y3Qu9C10LzQtdC90YJcclxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgICAg0JjQvNGPIChwcmV2LCBuZXh0KVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25BcnJvd0NsaWNrID0gZnVuY3Rpb24oJGFycm93LCBuYW1lKSB7XHJcbiAgICBpZiAoJGFycm93LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUocGFyc2VJbnQodGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuTW9udGgnKS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIChuYW1lID09ICdwcmV2JyA/IC10aGlzLm9wdGlvbnMubW9udGhzQ291bnQgOiB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpKTtcclxuXHJcbiAgICAvLyDQstGL0YXQvtC0INC30LAg0L/RgNC10LTQtdC70Ysg0LzQuNC90LjQvNCw0LvRjNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKGRhdGUgPCB0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWluRGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGVuZERhdGUgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgZW5kRGF0ZS5zZXRNb250aChlbmREYXRlLmdldE1vbnRoKCkgKyB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpO1xyXG4gICAgICAgIGlmIChlbmREYXRlID4gdGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICAgICAgZGF0ZS5zZXRUaW1lKHRoaXMub3B0aW9ucy5tYXhEYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpIC0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50ICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0LXRgNC10YXQvtC0INC6INC90L7QstC+0Lkg0LTQsNGC0LVcclxuICAgIHRoaXMuX3NlbGVjdERhdGUoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10Lkg0LTQsNGC0Ysg0YEg0YDQtdC90LTQtdGA0L7QvFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3NlbGVjdERhdGUgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICB0aGlzLl9zZWxlY3RlZERhdGUgPSBkYXRlO1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRocyhkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQvdC10LTQtdC70LhcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVXZWVrID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIldlZWtcIj48L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkd2VlaztcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC90Y9cclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVEYXkgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXlcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiIGRhdGEtZGF5PVwiJHtkYXRlLmdldERheSgpfVwiPiR7ZGF0ZS5nZXREYXRlKCl9PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25EYXlDbGlja0V2ZW50LmJpbmQodGhpcykpO1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLl9vbkRheU1vdXNlRW50ZXJFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICAgIHRoaXMuX3VwZGF0ZURheSgkZGF5KTtcclxuXHJcbiAgICByZXR1cm4gJGRheTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLk1vbnRoJykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZU1vbnRoKCRtb250aCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuSDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtFbGVtZW50fSAkbW9udGgg0K3Qu9C10LzQtdC90YIg0LzQtdGB0Y/RhtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl91cGRhdGVNb250aCA9IGZ1bmN0aW9uKCRtb250aCkge1xyXG4gICAgJG1vbnRoLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpLmZvckVhY2goJGRheSA9PiB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlRGF5KCRkYXkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Lkg0LTQvdGPXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQrdC70LXQvNC10L3RgiDQtNC90Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3VwZGF0ZURheSA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGNvbnN0IGRhdGUgICA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgY29uc3QgbG9ja2VkID0gdGhpcy5fZmlsdGVyTG9ja0RheXMoZGF0ZSk7XHJcbiAgICBjb25zdCB0b2RheSAgPSB0aGlzLl90b2RheS5nZXRUaW1lKCkgPT0gZGF0ZS5nZXRUaW1lKCk7XHJcblxyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1kaXNhYmxlZCcsIGxvY2tlZCk7XHJcbiAgICAkZGF5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLWxvY2tlZCcsIGxvY2tlZCA9PSBMT0NLX0xPQ0tFRCk7XHJcbiAgICAkZGF5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLXRvZGF5JywgdG9kYXkpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0LrQu9C40LrQsCDQv9C+INC00L3RjlxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlDbGlja0V2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdGhpcy5fb25EYXlDbGljayhlLnRhcmdldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDRhdC+0LLQtdGA0LBcclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5TW91c2VFbnRlckV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdGhpcy5fb25EYXlNb3VzZUVudGVyKGUudGFyZ2V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCl0L7QstC10YAg0L3QsCDRjdC70LXQvNC10L3RgtC1INC00L3Rj1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlNb3VzZUVudGVyID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5LmRhdGFzZXQudGltZSA9PSB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLmdldFRpbWUoKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRlX3RvID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0LvQuNC6INC/0L4g0LTQvdGOXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheUNsaWNrID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgLy8g0LTQtdC90Ywg0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC9XHJcbiAgICBpZiAoJGRheS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpXHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrKCdkYXlTZWxlY3QnLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQsdGA0L7RgSDQstGL0LHRgNCw0L3QvdC+0LPQviDRgNCw0L3QtdC1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG5cclxuICAgIC8vINCy0YvQsdGA0LDQvdCwINC90LDRh9Cw0LvRjNC90LDRjyAvINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlUmVzZXQoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yYW5nZVNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktC40LfRg9Cw0LvRjNC90YvQuSDRgdCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fcmFuZ2VWaXN1YWxSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgJGRheXMgPSB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpO1xyXG4gICAgJGRheXMuZm9yRWFjaCgkZGF5ID0+IHtcclxuICAgICAgICAkZGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nLCAnaXMtc2VsZWN0ZWQtdG8nLCAnaXMtc2VsZWN0ZWQtYmV0d2VlbicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0L/RgNGP0YfQtdC8INC/0L7QtNGB0LrQsNC30LrRg1xyXG4gICAgdGhpcy5fdG9vbHRpcEhpZGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LjQt9GD0LDQu9GM0L3QvtC1INCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3JhbmdlVmlzdWFsU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBpZiAoZGF0ZV9mcm9tICYmIGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGVfdG8gJiYgZGF0ZV90byBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0aW1lX2Zyb20gPSBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV9mcm9tLmdldFRpbWUoKSA6IDA7XHJcbiAgICBsZXQgdGltZV90byA9IGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV90by5nZXRUaW1lKCkgOiAwO1xyXG4gICAgaWYgKHRpbWVfZnJvbSA+IHRpbWVfdG8pIHtcclxuICAgICAgICBbdGltZV9mcm9tLCB0aW1lX3RvXSA9IFt0aW1lX3RvLCB0aW1lX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YIg0LzQtdC20LTRgyDQvdCw0YfQsNC70YzQvdC+0Lkg0Lgg0LrQvtC90LXRh9C90L7QuVxyXG4gICAgY29uc3QgJGRheXMgPSB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkZGF5cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICRkYXlzW2ldLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXNlbGVjdGVkLWJldHdlZW4nLCAkZGF5c1tpXS5kYXRhc2V0LnRpbWUgPiB0aW1lX2Zyb20gJiYgJGRheXNbaV0uZGF0YXNldC50aW1lIDwgdGltZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5INC/0L7Qt9C40YbQuNC4XHJcbiAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICBjb25zdCAkZGF5X3RvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuXHJcbiAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgaWYgKHRoaXMuX3Zpc3VhbFNlbGVjdGlvbi4kZGF5X2Zyb21fb2xkICYmIHRoaXMuX3Zpc3VhbFNlbGVjdGlvbi4kZGF5X2Zyb21fb2xkICE9ICRkYXlfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3Zpc3VhbFNlbGVjdGlvbi4kZGF5X2Zyb21fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgaWYgKHRoaXMuX3Zpc3VhbFNlbGVjdGlvbi4kZGF5X3RvX29sZCAmJiB0aGlzLl92aXN1YWxTZWxlY3Rpb24uJGRheV90b19vbGQgIT0gJGRheV90bykge1xyXG4gICAgICAgIHRoaXMuX3Zpc3VhbFNlbGVjdGlvbi4kZGF5X3RvX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7RhdGA0LDQvdC10L3QuNC1INCyINC60LXRiFxyXG4gICAgdGhpcy5fdmlzdWFsU2VsZWN0aW9uLiRkYXlfZnJvbV9vbGQgPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl92aXN1YWxTZWxlY3Rpb24uJGRheV90b19vbGQgPSAkZGF5X3RvO1xyXG5cclxuICAgIHRoaXMuX3NlbGVjdGlvbi4kZGF5X2Zyb20gPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24uJGRheV90byAgID0gJGRheV90bztcclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgIGNvbnN0IGRheXMgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRpbWVfZnJvbSAtIHRpbWVfdG8pIC8gODY0MDBlMykgKyAxO1xyXG4gICAgICAgIHRoaXMuX3Rvb2x0aXBTaG93KGRheXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0J/QvtC60LDQtyDQv9C+0LTRgdC60LDQt9C60LhcclxuICogQHBhcmFtIHtOdW1iZXJ9IGRheXMg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3Rvb2x0aXBTaG93ID0gZnVuY3Rpb24oZGF5cykge1xyXG4gICAgdGhpcy5fJHRvb2x0aXBDb250ZW50LnRleHRDb250ZW50ID0gdGhpcy5fZmlsdGVyVG9vbHRpcFRleHQoZGF5cyk7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zaG93JywgdGhpcy5fJHRvb2x0aXAudGV4dENvbnRlbnQubGVuZ3RoKTtcclxuICAgIHRoaXMuX3Rvb2x0aXBVcGRhdGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INC/0L7Qt9C40YbQuNC4INC/0L7QtNGB0LrQsNC30LrQuFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcFVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uJGRheV90bykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgeCA9IDA7XHJcbiAgICBsZXQgeSA9IDA7XHJcbiAgICBsZXQgJGVsID0gdGhpcy5fc2VsZWN0aW9uLiRkYXlfdG87XHJcbiAgICBkbyB7XHJcbiAgICAgICAgeSArPSAkZWwub2Zmc2V0VG9wO1xyXG4gICAgICAgIHggKz0gJGVsLm9mZnNldExlZnQ7XHJcbiAgICB9IHdoaWxlICgoJGVsID0gJGVsLm9mZnNldFBhcmVudCkgJiYgJGVsICE9IHRoaXMuXyRwaWNrZXIpO1xyXG5cclxuICAgIHRoaXMuXyR0b29sdGlwLnN0eWxlLnRvcCA9IE1hdGgucm91bmQoeSAtIHRoaXMuXyR0b29sdGlwLm9mZnNldEhlaWdodCkgKyAncHgnO1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUubGVmdCA9IE1hdGgucm91bmQoeCArIHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvLm9mZnNldFdpZHRoIC8gMiAtIHRoaXMuXyR0b29sdGlwLm9mZnNldFdpZHRoIC8gMikgKyAncHgnO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQutGA0YvRgtGMINC/0L7QtNGB0LrQsNC30LrRg1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcEhpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuXyR0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNob3cnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCi0LXQutGB0YIg0L/QvtC00YHQutCw0LfQutC4INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAqIEBwYXJhbSAge051bWJlcn0gZGF5cyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9maWx0ZXJUb29sdGlwVGV4dCA9IGZ1bmN0aW9uKGRheXMpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmZpbHRlci50b29sdGlwVGV4dCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIudG9vbHRpcFRleHQuY2FsbCh0aGlzLCBkYXlzKSB8fCAnJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5wbHVyYWwoZGF5cywgWyclZCDQtNC10L3RjCcsICclZCDQtNC90Y8nLCAnJWQg0LTQvdC10LknXSkucmVwbGFjZSgnJWQnLCBkYXlzKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0LjQu9GM0YLRgCDQvdC10LTQvtGB0YLRg9C/0L3Ri9GFINC00L3QtdC5XHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fZmlsdGVyTG9ja0RheXMgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQstC90LUg0LTQvtGB0YLRg9C/0L3QvtCz0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlIHx8IGRhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBMT0NLX1VOQVZBSUxBQkxFO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INGE0YPQvdC60YbQuNC4XHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5maWx0ZXIubG9ja0RheXMgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmlsdGVyLmxvY2tEYXlzLmNhbGwoZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRgdC1INC00L3QuCDQtNC+0YHRgtGD0L/QvdGLXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDQuNC30LzQtdC90LXQvdC40Y8g0YDQsNC30LzQtdGA0L7QsiDQvtC60L3QsFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25XaW5kb3dSZXNpemVFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uJGRheV90bykge1xyXG4gICAgICAgIHRoaXMuX3Rvb2x0aXBVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYnJlYWtwb2ludCA9IDA7XHJcbiAgICBjb25zdCBicmVha3BvaW50cyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xyXG4gICAgZm9yIChsZXQgaSBpbiBicmVha3BvaW50cykge1xyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSBicmVha3BvaW50c1tpXSkge1xyXG4gICAgICAgICAgICBicmVha3BvaW50ID0gYnJlYWtwb2ludHNbaV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9zZXRCcmVha3BvaW50KGJyZWFrcG9pbnQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGB0L7RgdGC0L7Rj9C90LjRjyDRgNC10L3QtNC10YDQsCDQv9C+0LQg0YDQsNC30L3Ri9C1INGN0LrRgNCw0L3Ri1xyXG4gKiBAcGFyYW0ge051bWJlcn0gYnJlYWtwb2ludCDQmtC70Y7RhyDQuNC3IHRoaXMub3B0aW9ucy5icmVha3BvaW50cyAo0KjQuNGA0LjQvdCwINGN0LrRgNCw0L3QsClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3NldEJyZWFrcG9pbnQgPSBmdW5jdGlvbihicmVha3BvaW50KSB7XHJcbiAgICAvLyDQvtGCINC90LXQvdGD0LbQvdC+0Lkg0L/QtdGA0LXRgNC40YHQvtCy0LrQuFxyXG4gICAgaWYgKHRoaXMuX2JyZWFrcG9pbnQgPT0gYnJlYWtwb2ludCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuX2JyZWFrcG9pbnQgPSBicmVha3BvaW50O1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCB0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pO1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRocyh0aGlzLl9zZWxlY3RlZERhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0K3Qu9C10LzQtdC90YIg0LrQsNC70LXQvdC00LDRgNC90L7Qs9C+INC00L3Rj1xyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9ICAgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGdldERheUJ5RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpbWUgPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogMDtcclxuICAgIHJldHVybiB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5EYXlbZGF0YS10aW1lPVwiJyArIHRpbWUgKyAnXCJdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPIC0g0LfQsNCz0LvRg9GI0LrQuFxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVtcHR5RGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXkgaXMtZW1wdHlcIj48L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkZGF5O1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwINC40LcgSFRNTCDRgtC10LrRgdGC0LBcclxuICogQHBhcmFtICB7U3RyaW5nfSBodG1sIEhUTUwg0YLQtdC60YHRglxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XHJcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgIHJldHVybiBkaXYuY2hpbGRyZW4ubGVuZ3RoID4gMSA/IGRpdi5jaGlsZHJlbiA6IGRpdi5maXJzdEVsZW1lbnRDaGlsZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNhZmUg0LLRi9C30L7QsiDQstC90LXRiNC90LjRhSDRgdC+0LHRi9GC0LjQuSDQutC+0LzQv9C+0L3QtdC90YLQsFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZiDQmNC80Y8g0YHQvtCx0YvRgtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2NhbGxiYWNrID0gZnVuY3Rpb24oZikge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25bZl0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub25bZl0uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm47XHJcbn1cclxuXHJcbi8qIGhhcm1vbnkgZGVmYXVsdCBleHBvcnQgKi8gY29uc3QgX19XRUJQQUNLX0RFRkFVTFRfRVhQT1JUX18gPSAoRGF0ZVJhbmdlUGlja2VyKTtcclxuXG59KSgpO1xuXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfZXhwb3J0c19fO1xuLyoqKioqKi8gfSkoKVxuO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbmRsWW5CaFkyczZMeTlrWVhSbGNtRnVaMlZ3YVdOclpYSXZkMlZpY0dGamF5OTFibWwyWlhKellXeE5iMlIxYkdWRVpXWnBibWwwYVc5dUlpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOTNaV0p3WVdOckwySnZiM1J6ZEhKaGNDSXNJbmRsWW5CaFkyczZMeTlrWVhSbGNtRnVaMlZ3YVdOclpYSXZkMlZpY0dGamF5OXlkVzUwYVcxbEwyUmxabWx1WlNCd2NtOXdaWEowZVNCblpYUjBaWEp6SWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k5M1pXSndZV05yTDNKMWJuUnBiV1V2YUdGelQzZHVVSEp2Y0dWeWRIa2djMmh2Y25Sb1lXNWtJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTkzWldKd1lXTnJMM0oxYm5ScGJXVXZiV0ZyWlNCdVlXMWxjM0JoWTJVZ2IySnFaV04wSWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k4dUwzTnlZeTl6WTNOekwyUmhkR1Z5WVc1blpYQnBZMnRsY2k1elkzTnpQMkV5T1dZaUxDSjNaV0p3WVdOck9pOHZaR0YwWlhKaGJtZGxjR2xqYTJWeUx5NHZjM0pqTDJwekwyUmhkR1Z5WVc1blpYQnBZMnRsY2k1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hEUVVGRE8wRkJRMFFzVHpzN1ZVTldRVHRWUVVOQk96czdPenRYUTBSQk8xZEJRMEU3VjBGRFFUdFhRVU5CTzFkQlEwRXNkME5CUVhkRExIbERRVUY1UXp0WFFVTnFSanRYUVVOQk8xZEJRMEVzUlRzN096czdWME5RUVN4M1JqczdPenM3VjBOQlFUdFhRVU5CTzFkQlEwRTdWMEZEUVN4elJFRkJjMFFzYTBKQlFXdENPMWRCUTNoRk8xZEJRMEVzSzBOQlFTdERMR05CUVdNN1YwRkROMFFzUlRzN096czdPenM3T3pzN08wRkRUa0U3T3pzN096czdPenM3T3pzN096dEJRMEZCTzBGQlEwODdRVUZEUVRzN1FVRkZVRHRCUVVOQk96dEJRVVZCTEdsRVFVRnBSRHRCUVVOcVJEdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc2NVUkJRWEZFTzBGQlEzSkVPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeFRRVUZUTEd0Q1FVRnJRanRCUVVNelFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRk5CUVZNc2MwSkJRWE5DTzBGQlF5OUNPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFTeHhSVUZCY1VVN08wRkJSWEpGTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWTBGQll6dEJRVU5rTzBGQlEwRXNjMEpCUVhOQ08wRkJRM1JDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTEV0QlFVczdRVUZEYWtJc1dVRkJXVHRCUVVOYU8wRkJRMEU3UVVGRFFTeG5SRUZCWjBRc1kwRkJZenRCUVVNNVJEdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWkxFdEJRVXM3UVVGRGFrSXNXVUZCV1N4UFFVRlBPMEZCUTI1Q0xGbEJRVms3UVVGRFdqdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRU3h0UWtGQmJVSXNUMEZCVHp0QlFVTXhRanRCUVVOQk8wRkJRMEU3UVVGRFFTeHBSRUZCYVVRc2FVSkJRV2xDTzBGQlEyeEZMRk5CUVZNN1FVRkRWRHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTEV0QlFVczdPMEZCUlV3N1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCV1N4TFFVRkxPMEZCUTJwQ0xGbEJRVmtzVDBGQlR6dEJRVU51UWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhMUVVGTE8wRkJRMmhDTEZkQlFWY3NTMEZCU3p0QlFVTm9RanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVmtzUzBGQlN6dEJRVU5xUWl4WlFVRlpMRTlCUVU4N1FVRkRia0lzV1VGQldUdEJRVU5hTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVms3UVVGRFdpeFpRVUZaTzBGQlExb3NXVUZCV1R0QlFVTmFPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVmtzUzBGQlN6dEJRVU5xUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJXU3hMUVVGTE8wRkJRMnBDTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVmtzUzBGQlN6dEJRVU5xUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJXU3hQUVVGUE8wRkJRMjVDTEZsQlFWa3NUVUZCVFR0QlFVTnNRaXhaUVVGWk8wRkJRMW83UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGZEJRVmNzUzBGQlN6dEJRVU5vUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEVzYlVKQlFXMUNMRGhDUVVFNFFqdEJRVU5xUkR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFTeHRRa0ZCYlVJc2IwSkJRVzlDTzBGQlEzWkRPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZOQlFWTTdPMEZCUlZRN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eExRVUZMTzBGQlEyaENPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVN4NVEwRkJlVU1zWlVGQlpUdEJRVU40UkR0QlFVTkJMRFpFUVVFMlJDdzJSVUZCTmtVN1FVRkRNVWs3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN3MFEwRkJORU1zVjBGQlZ5eEhRVUZITEcxQ1FVRnRRanRCUVVNM1JTdzJSRUZCTmtRc05rVkJRVFpGTzBGQlF6RkpPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeDFRMEZCZFVNN1FVRkRka01zYzBSQlFYTkVMRmRCUVZjN1FVRkRha1VzWVVGQllTeFhRVUZYTzBGQlEzaENPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNVMEZCVXl3NFEwRkJPRU03UVVGRGRrUXNVMEZCVXl3NFEwRkJPRU03UVVGRGRrUTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTEZOQlFWTTdRVUZEVkN4TFFVRkxPenRCUVVWTU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFRRVUZUT3p0QlFVVlVPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhSUVVGUk8wRkJRMjVDTEZkQlFWY3NUMEZCVHp0QlFVTnNRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhMUVVGTE8wRkJRMmhDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZsQlFWa3NTMEZCU3p0QlFVTnFRaXhaUVVGWk8wRkJRMW83UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WlFVRlpMRXRCUVVzN1FVRkRha0lzV1VGQldUdEJRVU5hTzBGQlEwRTdRVUZEUVR0QlFVTkJMSFZEUVVGMVF5eGxRVUZsTEdOQlFXTXNZMEZCWXl4SlFVRkpMR1ZCUVdVN1FVRkRja2M3TzBGQlJVRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hMUVVGTE8wRkJRMHc3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1VVRkJVVHRCUVVOdVFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRXRCUVVzN1FVRkRURHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNWMEZCVnl4UlFVRlJPMEZCUTI1Q08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1RVRkJUVHRCUVVOcVFqdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eE5RVUZOTzBGQlEycENPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRkZCUVZFN1FVRkRia0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEZGQlFWRTdRVUZEYmtJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEVzUzBGQlN6dEJRVU5NTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxFdEJRVXM3TzBGQlJVdzdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEV0QlFVczdRVUZEYUVJc1YwRkJWeXhMUVVGTE8wRkJRMmhDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRzFDUVVGdFFpeHJRa0ZCYTBJN1FVRkRja003UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRTlCUVU4N1FVRkRiRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRXRCUVVzN08wRkJSVXc3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJXU3hQUVVGUE8wRkJRMjVDTEZsQlFWazdRVUZEV2p0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGZEJRVmNzUzBGQlN6dEJRVU5vUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hYUVVGWExFMUJRVTA3UVVGRGFrSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGZEJRVmNzVDBGQlR6dEJRVU5zUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWkxFdEJRVXM3UVVGRGFrSXNXVUZCV1N4UlFVRlJPMEZCUTNCQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVms3UVVGRFdqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1QwRkJUenRCUVVOdVFpeFpRVUZaTzBGQlExbzdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRTlCUVU4N1FVRkRiRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTEdsRlFVRmxMR1ZCUVdVc1JVRkJReUlzSW1acGJHVWlPaUprWVhSbGNtRnVaMlZ3YVdOclpYSXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJb1puVnVZM1JwYjI0Z2QyVmljR0ZqYTFWdWFYWmxjbk5oYkUxdlpIVnNaVVJsWm1sdWFYUnBiMjRvY205dmRDd2dabUZqZEc5eWVTa2dlMXh1WEhScFppaDBlWEJsYjJZZ1pYaHdiM0owY3lBOVBUMGdKMjlpYW1WamRDY2dKaVlnZEhsd1pXOW1JRzF2WkhWc1pTQTlQVDBnSjI5aWFtVmpkQ2NwWEc1Y2RGeDBiVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQm1ZV04wYjNKNUtDazdYRzVjZEdWc2MyVWdhV1lvZEhsd1pXOW1JR1JsWm1sdVpTQTlQVDBnSjJaMWJtTjBhVzl1SnlBbUppQmtaV1pwYm1VdVlXMWtLVnh1WEhSY2RHUmxabWx1WlNoY0lrUmhkR1Z5WVc1blpYQnBZMnRsY2x3aUxDQmJYU3dnWm1GamRHOXllU2s3WEc1Y2RHVnNjMlVnYVdZb2RIbHdaVzltSUdWNGNHOXlkSE1nUFQwOUlDZHZZbXBsWTNRbktWeHVYSFJjZEdWNGNHOXlkSE5iWENKRVlYUmxjbUZ1WjJWd2FXTnJaWEpjSWwwZ1BTQm1ZV04wYjNKNUtDazdYRzVjZEdWc2MyVmNibHgwWEhSeWIyOTBXMXdpUkdGMFpYSmhibWRsY0dsamEyVnlYQ0pkSUQwZ1ptRmpkRzl5ZVNncE8xeHVmU2tvYzJWc1ppd2dablZ1WTNScGIyNG9LU0I3WEc1eVpYUjFjbTRnSWl3aUx5OGdWR2hsSUhKbGNYVnBjbVVnYzJOdmNHVmNiblpoY2lCZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZklEMGdlMzA3WEc1Y2JpSXNJaTh2SUdSbFptbHVaU0JuWlhSMFpYSWdablZ1WTNScGIyNXpJR1p2Y2lCb1lYSnRiMjU1SUdWNGNHOXlkSE5jYmw5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dVpDQTlJQ2hsZUhCdmNuUnpMQ0JrWldacGJtbDBhVzl1S1NBOVBpQjdYRzVjZEdadmNpaDJZWElnYTJWNUlHbHVJR1JsWm1sdWFYUnBiMjRwSUh0Y2JseDBYSFJwWmloZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxtOG9aR1ZtYVc1cGRHbHZiaXdnYTJWNUtTQW1KaUFoWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1dktHVjRjRzl5ZEhNc0lHdGxlU2twSUh0Y2JseDBYSFJjZEU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaGxlSEJ2Y25SekxDQnJaWGtzSUhzZ1pXNTFiV1Z5WVdKc1pUb2dkSEoxWlN3Z1oyVjBPaUJrWldacGJtbDBhVzl1VzJ0bGVWMGdmU2s3WEc1Y2RGeDBmVnh1WEhSOVhHNTlPeUlzSWw5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dWJ5QTlJQ2h2WW1vc0lIQnliM0FwSUQwK0lDaFBZbXBsWTNRdWNISnZkRzkwZVhCbExtaGhjMDkzYmxCeWIzQmxjblI1TG1OaGJHd29iMkpxTENCd2NtOXdLU2tpTENJdkx5QmtaV1pwYm1VZ1gxOWxjMDF2WkhWc1pTQnZiaUJsZUhCdmNuUnpYRzVmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmTG5JZ1BTQW9aWGh3YjNKMGN5a2dQVDRnZTF4dVhIUnBaaWgwZVhCbGIyWWdVM2x0WW05c0lDRTlQU0FuZFc1a1pXWnBibVZrSnlBbUppQlRlVzFpYjJ3dWRHOVRkSEpwYm1kVVlXY3BJSHRjYmx4MFhIUlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtvWlhod2IzSjBjeXdnVTNsdFltOXNMblJ2VTNSeWFXNW5WR0ZuTENCN0lIWmhiSFZsT2lBblRXOWtkV3hsSnlCOUtUdGNibHgwZlZ4dVhIUlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtvWlhod2IzSjBjeXdnSjE5ZlpYTk5iMlIxYkdVbkxDQjdJSFpoYkhWbE9pQjBjblZsSUgwcE8xeHVmVHNpTENJdkx5QmxlSFJ5WVdOMFpXUWdZbmtnYldsdWFTMWpjM010WlhoMGNtRmpkQzF3YkhWbmFXNWNibVY0Y0c5eWRDQjdmVHNpTENJdkx5RFJnZEMrMFlIUmd0QyswWS9RdmRDNDBZOGcwTGZRc05DeDBMdlF2dEM2MExqUmdOQyswTExRc05DOTBMM1JpOUdGSU5DMDBMRFJnbHh5WEc1bGVIQnZjblFnWTI5dWMzUWdURTlEUzE5VlRrRldRVWxNUVVKTVJTQTlJREU3WEhKY2JtVjRjRzl5ZENCamIyNXpkQ0JNVDBOTFgweFBRMHRGUkNBZ0lDQWdJRDBnTWp0Y2NseHVYSEpjYm1OdmJuTjBJRWxPUkVWWVgwUkJWRVZmUmxKUFRTQTlJREE3WEhKY2JtTnZibk4wSUVsT1JFVllYMFJCVkVWZlZFOGdJQ0E5SURFN1hISmNibHh5WEc1bWRXNWpkR2x2YmlCRVlYUmxVbUZ1WjJWUWFXTnJaWElvSkdOdmJuUmhhVzVsY2l3Z2IzQjBhVzl1Y3lBOUlIdDlLU0I3WEhKY2JpQWdJQ0F2THlEUXZ0R0NJTkMvMEw3UXN0R0MwTDdSZ05DOTBMN1F1U0RRdU5DOTBMalJodEM0MExEUXU5QzQwTGZRc05HRzBMalF1Rnh5WEc0Z0lDQWdhV1lnS0NSamIyNTBZV2x1WlhJdWFXNXpkR0Z1WTJVcElIdGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdKR052Ym5SaGFXNWxjaTVwYm5OMFlXNWpaVHRjY2x4dUlDQWdJSDFjY2x4dUlDQWdJQ1JqYjI1MFlXbHVaWEl1YVc1emRHRnVZMlVnUFNCMGFHbHpPMXh5WEc1Y2NseHVJQ0FnSUhSb2FYTXVYeVJqYjI1MFlXbHVaWElnUFNBa1kyOXVkR0ZwYm1WeU8xeHlYRzVjY2x4dUlDQWdJQzh2SU5DMzBMM1FzTkdIMExYUXZkQzQwTFVnMEwvUXZpRFJnOUM4MEw3UXU5R0gwTERRdmRDNDBZNWNjbHh1SUNBZ0lHTnZibk4wSUdSMklEMGdLSGdzSUhZcElEMCtJSFI1Y0dWdlppQjRJRDA5SUNkMWJtUmxabWx1WldRbklEOGdkaUE2SUhnN1hISmNibHh5WEc0Z0lDQWdkR2hwY3k1dmNIUnBiMjV6SUQwZ2UxeHlYRzRnSUNBZ0lDQWdJR1pwY25OMFJHRjVUMlpVYUdWWFpXVnJPaUJrZGlodmNIUnBiMjV6TG1acGNuTjBSR0Y1VDJaVWFHVlhaV1ZyTENBeEtTd2dMeThnMEwvUXRkR0EwTExSaTlDNUlOQzAwTFhRdmRHTUlOQzkwTFhRdE5DMTBMdlF1Q3dnTUNBOUlOQ3kwWUVzSURFZ1BTRFF2OUM5TENBdUxpNWNjbHh1SUNBZ0lDQWdJQ0J6YVc1bmJHVk5iMlJsT2lBZ0lDQWdJQ0FnWkhZb2IzQjBhVzl1Y3k1emFXNW5iR1ZOYjJSbExDQm1ZV3h6WlNrc0lDQWdJQzh2SU5DeTBZdlFzZEMrMFlBZzBMN1F0TkM5MEw3UXVTRFF0TkN3MFlMUml5RFFzdEM4MExYUmdkR0MwTDRnMExUUXVOQ3cwTC9Rc05DMzBMN1F2ZEN3WEhKY2JpQWdJQ0FnSUNBZ2JHOWpZV3hsT2lBZ0lDQWdJQ0FnSUNBZ0lHUjJLRzl3ZEdsdmJuTXViRzlqWVd4bExDQW5jblV0VWxVbktTeGNjbHh1SUNBZ0lDQWdJQ0J0YVc1RVlYbHpPaUFnSUNBZ0lDQWdJQ0FnWkhZb2IzQjBhVzl1Y3k1dGFXNUVZWGx6TENBeEtTd2dJQ0FnSUNBZ0lDQWdJQzh2SU5DODBMalF2ZEM0MEx6UXNOQzcwWXpRdmRDKzBMVWcwTHJRdnRDNzBMalJoOUMxMFlIUmd0Q3kwTDRnMExUUXZkQzEwTGtnMExJZzBMVFF1TkN3MEwvUXNOQzMwTDdRdmRDMVhISmNiaUFnSUNBZ0lDQWdiVzl1ZEdoelEyOTFiblE2SUNBZ0lDQWdJR1IyS0c5d2RHbHZibk11Ylc5dWRHaHpRMjkxYm5Rc0lERXlLU3hjY2x4dUlDQWdJQ0FnSUNCd1pYSlNiM2M2SUNBZ0lDQWdJQ0FnSUNBZ1pIWW9iM0IwYVc5dWN5NXdaWEpTYjNjc0lIVnVaR1ZtYVc1bFpDa3NJQ0FnSUM4dklOQzYwTDdRdTlDNDBZZlF0ZEdCMFlMUXN0QytJTkM4MExYUmdkR1AwWWJRdGRDeUlOQ3lJTkdBMFkvUXROR0RYSEpjYmlBZ0lDQWdJQ0FnYldsdVJHRjBaVG9nSUNBZ0lDQWdJQ0FnSUdSMktHOXdkR2x2Ym5NdWJXbHVSR0YwWlN3Z2JtVjNJRVJoZEdVb0tTa3NJQ0F2THlEUXZOQzQwTDNRdU5DODBMRFF1OUdNMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBZ0lDQWdJQ0FnYldGNFJHRjBaVG9nSUNBZ0lDQWdJQ0FnSUdSMktHOXdkR2x2Ym5NdWJXRjRSR0YwWlN3Z2RXNWtaV1pwYm1Wa0tTeGNjbHh1SUNBZ0lDQWdJQ0JpY21WaGEzQnZhVzUwY3pvZ0lDQWdJQ0FnWkhZb2IzQjBhVzl1Y3k1aWNtVmhhM0J2YVc1MGN5d2dlMzBwTEZ4eVhHNGdJQ0FnSUNBZ0lHbHVkR1Z5Ym1Gc1NXNXdkWFJ6T2lBZ0lDQmtkaWh2Y0hScGIyNXpMbWx1ZEdWeWJtRnNTVzV3ZFhSekxDQjBjblZsS1N3Z0x5OGcwTGpSZ2RDLzBMN1F1OUdNMExmUXZ0Q3kwTERRdmRDNDBMVWcwTExSZ2RHQzBZRFF2dEMxMEwzUXZkR0wwWVVnMExqUXZkQy8wWVBSZ3RDKzBMSmNjbHh1SUNBZ0lDQWdJQ0F2THlEUmdkQyswTEhSaTlHQzBMalJqMXh5WEc0Z0lDQWdJQ0FnSUc5dU9pQlBZbXBsWTNRdVlYTnphV2R1S0h0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnY21GdVoyVlRaV3hsWTNRNklHNTFiR3dzSUM4dklOR0IwTDdRc2RHTDBZTFF1TkMxSU5DeTBZdlFzZEMrMFlEUXNDRFF0TkM0MExEUXY5Q3cwTGZRdnRDOTBMQWcwTFRRc05HQ1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGVWTmxiR1ZqZERvZ0lDQnVkV3hzTENBdkx5RFJnZEMrMExIUmk5R0MwTGpRdFNEUXN0R0wwTEhRdnRHQTBMQWcwTDdRdE5DOTBMN1F1U0RRdE5DdzBZTFJpeUFvMFlMUXZ0QzcwWXpRdXRDK0lOQy8wWURRdUNCemFXNW5iR1ZOYjJSbE9pQjBjblZsS1Z4eVhHNGdJQ0FnSUNBZ0lIMHNJRzl3ZEdsdmJuTXViMjRnZkh3Z2UzMHBMRnh5WEc0Z0lDQWdJQ0FnSUM4dklOR0UwTGpRdTlHTTBZTFJnTkdEMFk3UmlkQzQwTFVnMEx6UXRkR0MwTDdRdE5HTFhISmNiaUFnSUNBZ0lDQWdabWxzZEdWeU9pQlBZbXBsWTNRdVlYTnphV2R1S0h0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnYkc5amEwUmhlWE02SUNBZ0lHNTFiR3dzSUM4dklHTmhiR3hpWVdOcktHUmhkR1VwSU5HRTBZUFF2ZEM2MFliUXVOR1BJTkN4MEx2UXZ0QzYwTGpSZ05DKzBMTFFzTkM5MExqUmp5RFF0TkN3MFlJc0lIUnlkV1V2VEU5RFMxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGIyOXNkR2x3VkdWNGREb2diblZzYkN3Z0x5OGdZMkZzYkdKaFkyc29aR0Y1Y3lrZzBMTFJpOUN5MEw3UXRDRFJndEMxMExyUmdkR0MwTEFnMEwvUXZ0QzAwWUhRdXRDdzBMZlF1dEM0WEhKY2JpQWdJQ0FnSUNBZ2ZTd2diM0IwYVc5dWN5NW1hV3gwWlhJZ2ZId2dlMzBwTEZ4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lIUm9hWE11YVc1cGRDZ3BPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKalF2ZEM0MFliUXVOQ3cwTHZRdU5DMzBMRFJodEM0MFk5Y2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdWFXNXBkQ0E5SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ0x5OGcwWURSajlDMDBMM1F2dEdCMFlMUmpGeHlYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQjBhR2x6TG05d2RHbHZibk11Y0dWeVVtOTNJRDA5SUNkMWJtUmxabWx1WldRbktTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxuQmxjbEp2ZHlBOUlIUm9hWE11YjNCMGFXOXVjeTV0YjI1MGFITkRiM1Z1ZER0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtMXBia1JoZEdVcElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdWJXbHVSR0YwWlM1elpYUkliM1Z5Y3lnd0xDQXdMQ0F3TENBd0tUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUXZ0Qy8wWWJRdU5DNElOQzAwTHZSanlEUmpkQzYwWURRc05DOTBMN1FzaURRdjlDK0lOR0QwTHpRdnRDNzBZZlFzTkM5MExqUmpseHlYRzRnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbUp5WldGcmNHOXBiblJ6VzNSb2FYTXVYMkp5WldGcmNHOXBiblFnUFNBd1hTQTlJRTlpYW1WamRDNWhjM05wWjI0b2UzMHNJSFJvYVhNdWIzQjBhVzl1Y3lrN1hISmNibHh5WEc0Z0lDQWdMeThnMFlMUXRkQzYwWVBSaWRDNDBMa2cwTFRRdGRDOTBZeGNjbHh1SUNBZ0lIUm9hWE11WDNSdlpHRjVJRDBnYm1WM0lFUmhkR1VvS1R0Y2NseHVJQ0FnSUhSb2FYTXVYM1J2WkdGNUxuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc1Y2NseHVJQ0FnSUhSb2FYTXVYeVJ3YVdOclpYSWdQU0IwYUdsekxsOGtZM0psWVhSbFJXeGxiV1Z1ZENoY2NseHVJQ0FnSUNBZ0lDQmdQR1JwZGlCamJHRnpjejFjSWtSaGRHVnlZVzVuWlhCcFkydGxjbHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FrZTNSb2FYTXViM0IwYVc5dWN5NXBiblJsY201aGJFbHVjSFYwY3lBL1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmdQR1JwZGlCamJHRnpjejFjSWtSaGRHVnlZVzVuWlhCcFkydGxjbDlmYVc1d2RYUnpYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdKSHQwYUdsekxtOXdkR2x2Ym5NdWMybHVaMnhsVFc5a1pWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQS9JR0E4YVc1d2RYUWdkSGx3WlQxY0ltaHBaR1JsYmx3aUlHNWhiV1U5WENKa1lYUmxYQ0krWUZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBNklHQThhVzV3ZFhRZ2RIbHdaVDFjSW1ocFpHUmxibHdpSUc1aGJXVTlYQ0prWVhSbFgyWnliMjFjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR2x1Y0hWMElIUjVjR1U5WENKb2FXUmtaVzVjSWlCdVlXMWxQVndpWkdGMFpWOTBiMXdpUG1CY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVnSURvZ0p5ZGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWd2lSR0YwWlhKaGJtZGxjR2xqYTJWeVgxOXRiMjUwYUhOY0lqNDhMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrUmhkR1Z5WVc1blpYQnBZMnRsY2w5ZmRHOXZiSFJwY0Z3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjejFjSWtSaGRHVnlZVzVuWlhCcFkydGxjbDlmZEc5dmJIUnBjQzFqYjI1MFpXNTBYQ0krUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lEd3ZaR2wyUG1CY2NseHVJQ0FnSUNrN1hISmNibHh5WEc0Z0lDQWdMeThnMFkzUXU5QzEwTHpRdGRDOTBZTFJpMXh5WEc0Z0lDQWdkR2hwY3k1ZkpHMXZiblJvY3lBZ0lDQWdJQ0FnSUQwZ2RHaHBjeTVmSkhCcFkydGxjaTV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VSR0YwWlhKaGJtZGxjR2xqYTJWeVgxOXRiMjUwYUhNbktUdGNjbHh1SUNBZ0lIUm9hWE11WHlSMGIyOXNkR2x3SUNBZ0lDQWdJQ0E5SUhSb2FYTXVYeVJ3YVdOclpYSXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxrUmhkR1Z5WVc1blpYQnBZMnRsY2w5ZmRHOXZiSFJwY0NjcE8xeHlYRzRnSUNBZ2RHaHBjeTVmSkhSdmIyeDBhWEJEYjI1MFpXNTBJRDBnZEdocGN5NWZKSEJwWTJ0bGNpNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVJHRjBaWEpoYm1kbGNHbGphMlZ5WDE5MGIyOXNkR2x3TFdOdmJuUmxiblFuS1R0Y2NseHVYSEpjYmlBZ0lDQXZMeURRdjlDKzBMdlJqeURRc3RDeTBMN1F0TkN3WEhKY2JpQWdJQ0IwYUdsekxsOGthVzV3ZFhSeklEMGdkR2hwY3k1ZkpIQnBZMnRsY2k1eGRXVnllVk5sYkdWamRHOXlRV3hzS0NkcGJuQjFkRnR1WVcxbFhqMWNJbVJoZEdWY0lsMG5LVHRjY2x4dVhISmNiaUFnSUNBdkx5RFF1TkM5MExqUmh0QzQwTERRdTlDNDBMZlFzTkdHMExqUmp5RFJnZEMrMFlIUmd0QyswWS9RdmRDNDBMbGNjbHh1SUNBZ0lIUm9hWE11WDNObGJHVmpkR2x2YmlBZ0lDQWdJQ0E5SUh0OU8xeHlYRzRnSUNBZ2RHaHBjeTVmZG1semRXRnNVMlZzWldOMGFXOXVJRDBnZTMwN1hISmNibHh5WEc0Z0lDQWdMeThnMFlEUXRkQzkwTFRRdGRHQVhISmNiaUFnSUNCMGFHbHpMbDl6Wld4bFkzUkVZWFJsS0hSb2FYTXViM0IwYVc5dWN5NXRhVzVFWVhSbEtUdGNjbHh1SUNBZ0lIUm9hWE11WHlSamIyNTBZV2x1WlhJdVlYQndaVzVrUTJocGJHUW9kR2hwY3k1ZkpIQnBZMnRsY2lrN1hISmNibHh5WEc0Z0lDQWdMeThnMEw3UXNkR0EwTERRc2RDKzBZTFF1dEN3SU5DeDBZRFF0ZEM1MExyUXY5QyswTGpRdmRHQzBMN1FzbHh5WEc0Z0lDQWdhV1lnS0U5aWFtVmpkQzVyWlhsektIUm9hWE11YjNCMGFXOXVjeTVpY21WaGEzQnZhVzUwY3lrdWJHVnVaM1JvS1NCN1hISmNiaUFnSUNBZ0lDQWdkMmx1Wkc5M0xtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0ozSmxjMmw2WlNjc0lIUm9hWE11WDI5dVYybHVaRzkzVW1WemFYcGxSWFpsYm5RdVltbHVaQ2gwYUdsektTazdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZiMjVYYVc1a2IzZFNaWE5wZW1WRmRtVnVkQ2dwTzF4eVhHNGdJQ0FnZlZ4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSjNRc05DMzBMTFFzTkM5MExqUXRTRFF2TkMxMFlIUmo5R0cwTEJjY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ29nUUhKbGRIVnliaUI3VTNSeWFXNW5mVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSTmIyNTBhRVp2Y20xaGRIUmxaQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJR052Ym5OMElIUnBkR3hsSUQwZ2RHaHBjeTVuWlhSRVlYUmxWR2x0WlVadmNtMWhkQ2hrWVhSbExDQjdiVzl1ZEdnNklDZHNiMjVuSjMwcE8xeHlYRzRnSUNBZ2NtVjBkWEp1SUhScGRHeGxMbk5zYVdObEtEQXNJREVwTG5SdlZYQndaWEpEWVhObEtDa2dLeUIwYVhSc1pTNXpiR2xqWlNneEtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DazBMN1JnTkM4MExEUmd0QzQwWURRdnRDeTBMRFF2ZEM0MExVZzBMVFFzTkdDMFlzZzBMVFF1OUdQSU5HQzBMWFF1dEdEMFluUXRkQzVJTkM3MEw3UXV0Q3cwTHZRdUZ4eVhHNGdLaUJBY0dGeVlXMGdJSHRFWVhSbGZTQWdJR1JoZEdVZ0lDQWcwSjdRc2RHSzBMWFF1dEdDSU5DMDBMRFJndEdMWEhKY2JpQXFJRUJ3WVhKaGJTQWdlMDlpYW1WamRIMGdiM0IwYVc5dWN5RFFuOUN3MFlEUXNOQzgwTFhSZ3RHQTBZdGNjbHh1SUNvZ1FISmxkSFZ5YmlCN1UzUnlhVzVuZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1blpYUkVZWFJsVkdsdFpVWnZjbTFoZENBOUlHWjFibU4wYVc5dUtHUmhkR1VzSUc5d2RHbHZibk1wSUh0Y2NseHVJQ0FnSUhKbGRIVnliaUJKYm5Sc0xrUmhkR1ZVYVcxbFJtOXliV0YwS0hSb2FYTXViM0IwYVc5dWN5NXNiMk5oYkdVc0lHOXdkR2x2Ym5NcExtWnZjbTFoZENoa1lYUmxLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ1UwTDNRdUNEUXZkQzEwTFRRdGRDNzBMaGNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVaMlYwVjJWbGEwUmhlWE5HYjNKdFlYUjBaV1FnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lHTnZibk4wSUdSaGRHVWdQU0J1WlhjZ1JHRjBaU2dwTzF4eVhHNGdJQ0FnWTI5dWMzUWdjbVZ6ZFd4MElEMGdXMTA3WEhKY2JseHlYRzRnSUNBZ1pHRjBaUzV6WlhSRVlYUmxLR1JoZEdVdVoyVjBSR0YwWlNncElDMGdNaWs3WEhKY2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SURjN0lDc3JhU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHUmhkR1V1YzJWMFJHRjBaU2hrWVhSbExtZGxkRVJoZEdVb0tTQXJJREVwTzF4eVhHNGdJQ0FnSUNBZ0lISmxjM1ZzZEM1d2RYTm9LSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdaR0Y1T2lCa1lYUmxMbWRsZEVSaGVTZ3BMRnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhWFJzWlRvZ2RHaHBjeTVuWlhSRVlYUmxWR2x0WlVadmNtMWhkQ2hrWVhSbExDQjdkMlZsYTJSaGVUb2dKM05vYjNKMEozMHBMRnh5WEc0Z0lDQWdJQ0FnSUgwcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5HQjBMN1JnTkdDMExqUmdOQyswTExRdXRDd0lOR0IwTDdRczlDNzBMRFJnZEM5MEw0ZzBMM1FzTkdCMFlMUmdOQyswTFhRdmRDOTBMN1F2TkdESU5DLzBMWFJnTkN5MEw3UXZOR0RJTkMwMEwzUmppRFF2ZEMxMExUUXRkQzcwTGhjY2x4dUlDQWdJSEpsYzNWc2RDNXpiM0owS0NoaExDQmlLU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1ptbHljM1JFWVhsUFpsUm9aVmRsWldzZ1BTQjBhR2x6TG05d2RHbHZibk11Wm1seWMzUkVZWGxQWmxSb1pWZGxaV3NnSlNBM08xeHlYRzRnSUNBZ0lDQWdJR3hsZENCa1lYbEJJRDBnWVM1a1lYazdYSEpjYmlBZ0lDQWdJQ0FnYkdWMElHUmhlVUlnUFNCaUxtUmhlVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdhV1lnS0dSaGVVRWdQVDBnWm1seWMzUkVZWGxQWmxSb1pWZGxaV3NwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQzB4TzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLR1JoZVVJZ1BUMGdabWx5YzNSRVlYbFBabFJvWlZkbFpXc3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlERTdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb1pHRjVRU0E4SUdacGNuTjBSR0Y1VDJaVWFHVlhaV1ZyS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGVVRWdLejBnY21WemRXeDBMbXhsYm1kMGFEdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJR2xtSUNoa1lYbENJRHdnWm1seWMzUkVZWGxQWmxSb1pWZGxaV3NwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWkdGNVFpQXJQU0J5WlhOMWJIUXViR1Z1WjNSb08xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHUmhlVUVnTFNCa1lYbENPMXh5WEc0Z0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ2NtVjBkWEp1SUhKbGMzVnNkRHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2EwTDdRdTlDNDBZZlF0ZEdCMFlMUXN0QytJTkMwMEwzUXRkQzVJTkN5SU5DODBMWFJnZEdQMFliUXRWeHlYRzRnS2lCQWNHRnlZVzBnSUh0RVlYUmxmU0JrWVhSbElOQ2UwTEhSaXRDMTBMclJnaURRdE5DdzBZTFJpMXh5WEc0Z0tpQkFjbVYwZFhKdUlIdE9kVzFpWlhKOUlDQWdJTkNhMEw3UXU5QzQwWWZRdGRHQjBZTFFzdEMrSU5DMDBMM1F0ZEM1WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG1kbGRFUmhlWE5EYjNWdWRFbHVUVzl1ZEdnZ1BTQm1kVzVqZEdsdmJpaGtZWFJsS1NCN1hISmNiaUFnSUNCamIyNXpkQ0JrWVhseklEMGdibVYzSUVSaGRHVW9aR0YwWlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ1pHRjVjeTV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVJQ0FnSUdSaGVYTXVjMlYwVFc5dWRHZ29aR0Y1Y3k1blpYUk5iMjUwYUNncElDc2dNU2s3WEhKY2JpQWdJQ0JrWVhsekxuTmxkRVJoZEdVb01DazdYSEpjYmlBZ0lDQnlaWFIxY200Z1pHRjVjeTVuWlhSRVlYUmxLQ2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvZEN4MFlEUXZ0R0JJTkN5MFl2UXROQzEwTHZRdGRDOTBMM1JpOUdGSU5DMDBMRFJnbHh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzV5WVc1blpWSmxjMlYwSUQwZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjBhR2x6TGw5eVlXNW5aVkpsYzJWMEtDazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUWt0R0wwTFRRdGRDNzBMWFF2ZEM0MExVZzBMVFF1TkN3MEwvUXNOQzMwTDdRdmRDd0lOQzAwTERSZ2x4eVhHNGdLaUJBY0dGeVlXMGdlMFJoZEdWOUlHUmhkR1ZmWm5KdmJTRFFuZEN3MFlmUXNOQzcwWXpRdmRDdzBZOGcwTFRRc05HQzBMQmNjbHh1SUNvZ1FIQmhjbUZ0SUh0RVlYUmxmU0JrWVhSbFgzUnZJQ0FnMEpyUXZ0QzkwTFhSaDlDOTBMRFJqeURRdE5DdzBZTFFzRnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzV5WVc1blpWTmxiR1ZqZENBOUlHWjFibU4wYVc5dUtHUmhkR1ZmWm5KdmJTd2daR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdhV1lnS0NFb1pHRjBaVjltY205dElHbHVjM1JoYm1ObGIyWWdSR0YwWlNrZ2ZId2dJU2hrWVhSbFgzUnZJR2x1YzNSaGJtTmxiMllnUkdGMFpTa3BJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ1pHRjBaVjltY205dExuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc0Z0lDQWdaR0YwWlY5MGJ5NXpaWFJJYjNWeWN5Z3dMQ0F3TENBd0xDQXdLVHRjY2x4dVhISmNiaUFnSUNBdkx5RFF0TkMrMEwvUmc5R0IwWUxRdU5DODBZdlF1U0RRdE5DNDBMRFF2OUN3MExmUXZ0QzlYSEpjYmlBZ0lDQnBaaUFvSVhSb2FYTXVaMlYwU1hOU1lXNW5aVk5sYkdWamRHRmliR1VvWkdGMFpWOW1jbTl0TENCa1lYUmxYM1J2S1NrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJqdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JqYjI1emRDQWtaR0Y1WDJaeWIyMGdQU0IwYUdsekxsOGtaMlYwUkdGNVFubEVZWFJsS0dSaGRHVmZabkp2YlNrN1hISmNiaUFnSUNCamIyNXpkQ0FrWkdGNVgzUnZJRDBnZEdocGN5NWZKR2RsZEVSaGVVSjVSR0YwWlNoa1lYUmxYM1J2S1R0Y2NseHVYSEpjYmlBZ0lDQnBaaUFvSkdSaGVWOW1jbTl0S1NCN1hISmNiaUFnSUNBZ0lDQWdKR1JoZVY5bWNtOXRMbU5zWVhOelRHbHpkQzVoWkdRb0oybHpMWE5sYkdWamRHVmtKeXdnSjJsekxYTmxiR1ZqZEdWa0xXWnliMjBuS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvSkdSaGVWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lDUmtZWGxmZEc4dVkyeGhjM05NYVhOMExtRmtaQ2duYVhNdGMyVnNaV04wWldRbkxDQW5hWE10YzJWc1pXTjBaV1F0ZEc4bktUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUXN0R0wwTFRRdGRDNzBMWFF2ZEM0MExVZzBZM1F1OUMxMEx6UXRkQzkwWUxRdnRDeVhISmNiaUFnSUNCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQ2hrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzhwTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkdCMEw3UmhkR0EwTERRdmRDMTBMM1F1TkMxSU5HQjBMN1JnZEdDMEw3Umo5QzkwTGpSajF4eVhHNGdJQ0FnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU0E5SUdSaGRHVmZabkp2YlR0Y2NseHVJQ0FnSUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZJQ0FnUFNCa1lYUmxYM1J2TzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkN5MFl2UXNkQyswWUFnMExUUXNOR0NJTkN5SU5DKzBMSFJnTkN3MFlMUXZkQyswTHdnMEwvUXZ0R0EwWS9RdE5DNjBMVmNjbHh1SUNBZ0lHbG1JQ2hrWVhSbFgyWnliMjBnUGlCa1lYUmxYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdXMlJoZEdWZlpuSnZiU3dnWkdGMFpWOTBiMTBnUFNCYlpHRjBaVjkwYnl3Z1pHRjBaVjltY205dFhUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUXZ0Q3gwTDNRdnRDeTBMdlF0ZEM5MExqUXRTRFF1TkM5MEwvUmc5R0MwTDdRc2x4eVhHNGdJQ0FnYVdZZ0tIUm9hWE11WHlScGJuQjFkSE5iU1U1RVJWaGZSRUZVUlY5R1VrOU5YU2tnZTF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WHlScGJuQjFkSE5iU1U1RVJWaGZSRUZVUlY5R1VrOU5YUzUyWVd4MVpTQTlJSFJvYVhNdVptOXliV0YwUkdGMFpTaGtZWFJsWDJaeWIyMHBPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdsbUlDaDBhR2x6TGw4a2FXNXdkWFJ6VzBsT1JFVllYMFJCVkVWZlZFOWRLU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmSkdsdWNIVjBjMXRKVGtSRldGOUVRVlJGWDFSUFhTNTJZV3gxWlNBOUlIUm9hWE11Wm05eWJXRjBSR0YwWlNoa1lYUmxYM1J2S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURSZ2RDKzBMSFJpOUdDMExqUXRWeHlYRzRnSUNBZ2RHaHBjeTVmWTJGc2JHSmhZMnNvSjNKaGJtZGxVMlZzWldOMEp5d2daR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2swTDdSZ05DODBMRFJndEM0MFlEUXZ0Q3kwTERRdmRDNDBMVWcwTFRRc05HQzBZdGNjbHh1SUNvZ1FIQmhjbUZ0SUNCN1JHRjBaWDBnSUNCa1lYUmxJQ0FnMEo3UXNkR0swTFhRdXRHQ0lOQzAwTERSZ3RHTFhISmNiaUFxSUVCd1lYSmhiU0FnZTFOMGNtbHVaMzBnWm05eWJXRjBJTkNrMEw3UmdOQzgwTERSZ2lEUmdkR0MwWURRdnRDNjBMaGNjbHh1SUNvZ1FISmxkSFZ5YmlCN1UzUnlhVzVuZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1bWIzSnRZWFJFWVhSbElEMGdablZ1WTNScGIyNG9aR0YwWlN3Z1ptOXliV0YwSUQwZ0oxa3RiUzFrSnlrZ2UxeHlYRzRnSUNBZ2FXWWdLQ0VvWkdGMFpTQnBibk4wWVc1alpXOW1JRVJoZEdVcEtTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUhKbGRIVnliaUJtYjNKdFlYUXVjbVZ3YkdGalpTZ25XU2NzSUdSaGRHVXVaMlYwUm5Wc2JGbGxZWElvS1NsY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXVjbVZ3YkdGalpTZ25iU2NzSUNnbk1DY2dLeUFvWkdGMFpTNW5aWFJOYjI1MGFDZ3BJQ3NnTVNrcExuTnNhV05sS0MweUtTbGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F1Y21Wd2JHRmpaU2duWkNjc0lDZ25NQ2NnS3lBb1pHRjBaUzVuWlhSRVlYUmxLQ2twS1M1emJHbGpaU2d0TWlrcE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEovUmdOQyswTExRdGRHQTBMclFzQ0RRc3RDKzBMZlF2TkMrMExiUXZkQyswWUhSZ3RDNElOQ3kwWXZRdE5DMTBMdlF0ZEM5MExqUmp5RFF0TkN3MFlKY2NseHVJQ29nUUhCaGNtRnRJQ0I3UkdGMFpTQmtZWFJsWDJaeWIyMGcwSjNRc05HSDBMRFF1OUdNMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBcUlFQndZWEpoYlNBZ2UwUmhkR1VnWkdGMFpWOTBieUFnSU5DYTBMN1F2ZEMxMFlmUXZkQ3cwWThnMExUUXNOR0MwTEJjY2x4dUlDb2dRSEpsZEhWeWJpQjdRbTl2YkdWaGJuMWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVaMlYwU1hOU1lXNW5aVk5sYkdWamRHRmliR1VnUFNCbWRXNWpkR2x2Ymloa1lYUmxYMlp5YjIwc0lHUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lHUmhkR1ZmWm5KdmJTNXpaWFJJYjNWeWN5Z3dMQ0F3TENBd0xDQXdLVHRjY2x4dUlDQWdJR1JoZEdWZmRHOHVjMlYwU0c5MWNuTW9NQ3dnTUN3Z01Dd2dNQ2s3WEhKY2JseHlYRzRnSUNBZ2FXWWdLR1JoZEdWZlpuSnZiU0ErSUdSaGRHVmZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQmJaR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZYU0E5SUZ0a1lYUmxYM1J2TENCa1lYUmxYMlp5YjIxZE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5DODBMalF2ZEM0MEx6UXNOQzcwWXpRdmRHTDBMa2cwTFRRdU5DdzBML1FzTkMzMEw3UXZWeHlYRzRnSUNBZ1kyOXVjM1FnWkdsbVppQTlJRTFoZEdndVlXSnpLR1JoZEdWZlpuSnZiUzVuWlhSVWFXMWxLQ2tnTFNCa1lYUmxYM1J2TG1kbGRGUnBiV1VvS1NrZ0x5QXhNREF3SUM4Z09EWTBNREE3WEhKY2JpQWdJQ0JwWmlBb1pHbG1aaUE4SUhSb2FYTXViM0IwYVc5dWN5NXRhVzVFWVhsektTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5DLzBZRFF2dEN5MExYUmdOQzYwTEFnMEwvUXZ0Qy8wTERRdE5DdzBMM1F1TkdQSU5DeUlOQzAwTGpRc05DLzBMRFF0OUMrMEwwZzBMZlFzTkN4MEx2UXZ0QzYwTGpSZ05DKzBMTFFzTkM5MEwzUmk5R0ZJTkMwMExEUmdseHlYRzRnSUNBZ1kyOXVjM1FnWkdGNUlEMGdibVYzSUVSaGRHVW9LVHRjY2x4dUlDQWdJR1JoZVM1elpYUlVhVzFsS0dSaGRHVmZabkp2YlM1blpYUlVhVzFsS0NrcE8xeHlYRzVjY2x4dUlDQWdJSGRvYVd4bElDaGtZWGtnUENCa1lYUmxYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXVYMlpwYkhSbGNreHZZMnRFWVhsektHUmhlU2twSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdaR0Y1TG5ObGRFUmhkR1VvWkdGNUxtZGxkRVJoZEdVb0tTQXJJREVwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lISmxkSFZ5YmlCMGNuVmxPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKTFJpOUN4MFlEUXNOQzkwTDNRc05HUElOQzkwTERSaDlDdzBMdlJqTkM5MExEUmp5RFF0TkN3MFlMUXNGeHlYRzRnS2lCQWNtVjBkWEp1SUh0RVlYUmxmU0RRbE5DdzBZTFFzRnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSRVlYUmxSbkp2YlNBOUlHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdMeThnMEwzUXNOR0gwTERRdTlHTTBMM1FzTkdQSU5DMDBMRFJndEN3SU5DOTBMVWcwWVBRdXRDdzBMZlFzTkM5MExCY2NseHVJQ0FnSUdsbUlDZ2hkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTa2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFF2ZEN3MFlmUXNOQzcwWXpRdmRDdzBZOGcwTFRRc05HQzBMQWcwTC9RdnRDMzBMYlF0U0RRdXRDKzBMM1F0ZEdIMEwzUXZ0QzVYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZmRHOGdKaVlnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU0ErSUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKTFJpOUN4MFlEUXNOQzkwTDNRc05HUElOQzAwTERSZ3RDd0lDaHphVzVuYkdWTmIyUmxPaUIwY25WbEtWeHlYRzRnS2lCQWNtVjBkWEp1SUh0RVlYUmxmU0RRbE5DdzBZTFFzRnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSRVlYUmxJRDBnUkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSRVlYUmxSbkp2YlR0Y2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUWt0R0wwTEhSZ05DdzBMM1F2ZEN3MFk4ZzBMclF2dEM5MExYUmg5QzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdLaUJBY21WMGRYSnVJSHRFWVhSbGZTRFFsTkN3MFlMUXNGeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNW5aWFJFWVhSbFZHOGdQU0JtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUM4dklOQzYwTDdRdmRDMTBZZlF2ZEN3MFk4ZzBMVFFzTkdDMExBZzBMM1F0U0RSZzlDNjBMRFF0OUN3MEwzUXNGeHlYRzRnSUNBZ2FXWWdLQ0YwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFF2ZEN3MFlmUXNOQzcwWXpRdmRDdzBZOGcwTFRRc05HQzBMQWcwTC9RdnRDMzBMYlF0U0RRdXRDKzBMM1F0ZEdIMEwzUXZ0QzVYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU0FtSmlCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0SUQ0Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzg3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvZEM2MEx2UXZ0QzkwTFhRdmRDNDBMVWdLREVnMExIUXZ0Q3gwWkhSZ0N3Z01pRFFzZEMrMExIUmdOQ3dMQ0ExSU5DeDBMN1FzZEdBMEw3UXNpbGNjbHh1SUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNCMllXeDFaU0RRbXRDKzBMdlF1TkdIMExYUmdkR0MwTExRdmx4eVhHNGdLaUJBY0dGeVlXMGdJSHRCY25KaGVYMGdJR1p2Y20xeklOQ2MwTERSZ2RHQjBMalFzaURRdU5DM0lEUFJoU0RSamRDNzBMWFF2TkMxMEwzUmd0QyswTElzSU5DODBMN1F0dEMxMFlJZzBZSFF2dEMwMExYUmdOQzIwTERSZ3RHTUlOR0IwTC9RdGRHRzBMalJoTkM0MExyUXNOR0MwTDdSZ0NBbFpDRFF0TkM3MFk4ZzBMZlFzTkM4MExYUXZkR0xYSEpjYmlBcUlFQnlaWFIxY200Z2UxTjBjbWx1WjMxY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdWNHeDFjbUZzSUQwZ1puVnVZM1JwYjI0Z0tIWmhiSFZsTENCbWIzSnRjeWtnZTF4eVhHNGdJQ0FnY21WMGRYSnVJQ2gyWVd4MVpTQWxJREV3SUQwOUlERWdKaVlnZG1Gc2RXVWdKU0F4TURBZ0lUMGdNVEVnUHlCbWIzSnRjMXN3WFNBNklDaDJZV3gxWlNBbElERXdJRDQ5SURJZ0ppWWdkbUZzZFdVZ0pTQXhNQ0E4UFNBMElDWW1JQ2gyWVd4MVpTQWxJREV3TUNBOElERXdJSHg4SUhaaGJIVmxJQ1VnTVRBd0lENDlJREl3S1NBL0lHWnZjbTF6V3pGZElEb2dabTl5YlhOYk1sMHBLUzV5WlhCc1lXTmxLQ2NsWkNjc0lIWmhiSFZsS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNoMExIUmdOQyswWUVnMExMUmk5QzAwTFhRdTlDMTBMM1F2ZEdMMFlVZzBMVFFzTkdDWEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw5eVlXNW5aVkpsYzJWMElEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRkpsYzJWMEtDazdYSEpjYmlBZ0lDQjBhR2x6TGw5elpXeGxZM1JwYjI0Z1BTQjdmVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2cwTFhRdmRDMDBMWFJnQ0RRdE5DNDBMRFF2OUN3MExmUXZ0QzkwTEFnMEx6UXRkR0IwWS9SaHRDMTBMSmNjbHh1SUNvZ1FIQmhjbUZ0SUh0RVlYUmxmU0JrWVhSbFgyWnliMjBnMEozUXNOR0gwTERRdTlHTTBMM1FzTkdQSU5DMDBMRFJndEN3WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw4a1kzSmxZWFJsVFc5dWRHaHpJRDBnWm5WdVkzUnBiMjRvWkdGMFpWOW1jbTl0S1NCN1hISmNiaUFnSUNCM2FHbHNaU0FvZEdocGN5NWZKRzF2Ym5Sb2N5NXNZWE4wUld4bGJXVnVkRU5vYVd4a0tTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZKRzF2Ym5Sb2N5NXlaVzF2ZG1WRGFHbHNaQ2gwYUdsekxsOGtiVzl1ZEdoekxteGhjM1JGYkdWdFpXNTBRMmhwYkdRcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5DLzBZRFJqOUdIMExYUXZDRFF2OUMrMExUUmdkQzYwTERRdDlDNjBZTmNjbHh1SUNBZ0lIUm9hWE11WDNSdmIyeDBhWEJJYVdSbEtDazdYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBML1JnTkMxMFlEUXRkQzkwTFRRdGRHQUlOQzgwTFhSZ2RHUDBZYlF0ZEN5WEhKY2JpQWdJQ0JqYjI1emRDQmpkWEp5Wlc1MFJHRjBaU0E5SUc1bGR5QkVZWFJsS0dSaGRHVmZabkp2YlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ1kyOXVjM1FnSkcxdmJuUm9jeUE5SUZ0ZE8xeHlYRzRnSUNBZ1ptOXlJQ2hzWlhRZ2FTQTlJREE3SUdrZ1BDQjBhR2x6TG05d2RHbHZibk11Ylc5dWRHaHpRMjkxYm5RN0lDc3JhU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDUnRiMjUwYUhNdWNIVnphQ2gwYUdsekxsOGtZM0psWVhSbFRXOXVkR2dvWTNWeWNtVnVkRVJoZEdVcEtUdGNjbHh1SUNBZ0lDQWdJQ0JqZFhKeVpXNTBSR0YwWlM1elpYUk5iMjUwYUNoamRYSnlaVzUwUkdGMFpTNW5aWFJOYjI1MGFDZ3BJQ3NnTVNrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMFlEUXRkQzkwTFRRdGRHQVhISmNiaUFnSUNCbWIzSWdLR3hsZENCcElEMGdNRHNnYVNBOElDUnRiMjUwYUhNdWJHVnVaM1JvT3lCcElDczlJSFJvYVhNdWIzQjBhVzl1Y3k1d1pYSlNiM2NwSUh0Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENBa2NtOTNJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDZ25aR2wySnlrN1hISmNiaUFnSUNBZ0lDQWdKSEp2ZHk1amJHRnpjMDVoYldVZ1BTQW5SR0YwWlhKaGJtZGxjR2xqYTJWeVgxOXliM2NuTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FrYlc5dWRHaHpMbk5zYVdObEtHa3NJR2tnS3lCMGFHbHpMbTl3ZEdsdmJuTXVjR1Z5VW05M0tTNW1iM0pGWVdOb0tDUnRiMjUwYUNBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDUnliM2N1WVhCd1pXNWtRMmhwYkdRb0pHMXZiblJvS1R0Y2NseHVJQ0FnSUNBZ0lDQjlLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZkpHMXZiblJvY3k1aGNIQmxibVJEYUdsc1pDZ2tjbTkzS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU0I4ZkNCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wS0hSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBzSUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZLVHRjY2x4dUlDQWdJSDFjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2cwTFhRdmRDMDBMWFJnQ0RRdk5DMTBZSFJqOUdHMExCY2NseHVJQ29nUUhCaGNtRnRJSHRFWVhSbGZTQmtZWFJsSU5DYzBMWFJnZEdQMFlaY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVh5UmpjbVZoZEdWTmIyNTBhQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJR052Ym5OMElHTjFjbkpsYm5STmIyNTBhQ0E5SUdSaGRHVXVaMlYwVFc5dWRHZ29LVHRjY2x4dUlDQWdJR052Ym5OMElHMXZiblJvVkdsMGJHVWdQU0IwYUdsekxtZGxkRTF2Ym5Sb1JtOXliV0YwZEdWa0tHUmhkR1VwTzF4eVhHNGdJQ0FnWTI5dWMzUWdkMlZsYTBSaGVYTWdQU0IwYUdsekxtZGxkRmRsWld0RVlYbHpSbTl5YldGMGRHVmtLQ2s3WEhKY2JseHlYRzRnSUNBZ1kyOXVjM1FnSkcxdmJuUm9JRDBnZEdocGN5NWZKR055WldGMFpVVnNaVzFsYm5Rb1hISmNiaUFnSUNBZ0lDQWdZRHhrYVhZZ1kyeGhjM005WENKTmIyNTBhRndpSUdSaGRHRXRkR2x0WlQxY0lpUjdaR0YwWlM1blpYUlVhVzFsS0NsOVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGOWZhR1ZoWkdWeVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aVRXOXVkR2hmWDJGeWNtOTNJRTF2Ym5Sb1gxOWhjbkp2ZHkwdGNISmxkaVI3S0hSb2FYTXViM0IwYVc5dWN5NXRhVzVFWVhSbElDWW1JR1JoZEdVZ1BEMGdkR2hwY3k1dmNIUnBiMjV6TG0xcGJrUmhkR1VwSUQ4Z0p5QnBjeTFrYVhOaFlteGxaQ2NnT2lBbkozMWNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM1puSUhkcFpIUm9QVndpT0Z3aUlHaGxhV2RvZEQxY0lqRTBYQ0lnZG1sbGQwSnZlRDFjSWpBZ01DQTRJREUwWENJZ1ptbHNiRDFjSW01dmJtVmNJaUI0Yld4dWN6MWNJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5YQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4d1lYUm9JR1E5WENKTk55QXhNMHd4SURkTU55QXhYQ0lnYzNSeWIydGxQVndpSXpoRE9FTTRRMXdpSUhOMGNtOXJaUzEzYVdSMGFEMWNJakpjSWlCemRISnZhMlV0YkdsdVpXTmhjRDFjSW5KdmRXNWtYQ0lnYzNSeWIydGxMV3hwYm1WcWIybHVQVndpY205MWJtUmNJajQ4TDNCaGRHZytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpkbWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUY5ZmRHbDBiR1ZjSWo0a2UyMXZiblJvVkdsMGJHVjlJQ1I3WkdGMFpTNW5aWFJHZFd4c1dXVmhjaWdwZlR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrMXZiblJvWDE5aGNuSnZkeUJOYjI1MGFGOWZZWEp5YjNjdExXNWxlSFFrZXloMGFHbHpMbTl3ZEdsdmJuTXViV0Y0UkdGMFpTQW1KaUJrWVhSbElENDlJSFJvYVhNdWIzQjBhVzl1Y3k1dFlYaEVZWFJsS1NBL0lDY2dhWE10WkdsellXSnNaV1FuSURvZ0p5ZDlYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4yWnlCM2FXUjBhRDFjSWpoY0lpQm9aV2xuYUhROVhDSXhORndpSUhacFpYZENiM2c5WENJd0lEQWdPQ0F4TkZ3aUlHWnBiR3c5WENKdWIyNWxYQ0lnZUcxc2JuTTlYQ0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh5TURBd0wzTjJaMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGNHRjBhQ0JrUFZ3aVRURWdNQzQ1T1RrNU9UbE1OeUEzVERFZ01UTmNJaUJ6ZEhKdmEyVTlYQ0lqT0VNNFF6aERYQ0lnYzNSeWIydGxMWGRwWkhSb1BWd2lNbHdpSUhOMGNtOXJaUzFzYVc1bFkyRndQVndpY205MWJtUmNJaUJ6ZEhKdmEyVXRiR2x1WldwdmFXNDlYQ0p5YjNWdVpGd2lQand2Y0dGMGFENWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzTjJaejVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrMXZiblJvWDE5M1pXVnJYQ0krSkh0M1pXVnJSR0Y1Y3k1dFlYQW9hWFJsYlNBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdZRHhrYVhZZ1kyeGhjM005WENKTmIyNTBhRjlmZDJWbGEyUmhlVndpUGlSN2FYUmxiUzUwYVhSc1pYMDhMMlJwZGo1Z1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUgwcExtcHZhVzRvSnljcGZUd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aVRXOXVkR2hmWDJSaGVYTmNJajQ4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWdYSEpjYmlBZ0lDQXBPMXh5WEc1Y2NseHVJQ0FnSUM4dklOR0IwWUxSZ05DMTBMdlF1dEM0WEhKY2JpQWdJQ0JiWEhKY2JpQWdJQ0FnSUNBZ2UzTmxiR1ZqZEc5eU9pQW5MazF2Ym5Sb1gxOWhjbkp2ZHkwdGNISmxkaWNzSUc1aGJXVTZJQ2R3Y21WMkozMHNYSEpjYmlBZ0lDQWdJQ0FnZTNObGJHVmpkRzl5T2lBbkxrMXZiblJvWDE5aGNuSnZkeTB0Ym1WNGRDY3NJRzVoYldVNklDZHVaWGgwSjMwc1hISmNiaUFnSUNCZExtWnZja1ZoWTJnb2FYUmxiU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ0pHRnljbTkzSUQwZ0pHMXZiblJvTG5GMVpYSjVVMlZzWldOMGIzSW9hWFJsYlM1elpXeGxZM1J2Y2lrN1hISmNiaUFnSUNBZ0lDQWdKR0Z5Y205M0xtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyTnNhV05ySnl3Z1pTQTlQaUI3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SU5DeTBZRFF0ZEM4MExYUXZkQzkwTERSanlEUXZOQzEwWURRc0N3ZzBMdlJnOUdIMFlqUXRTRFF2OUMxMFlEUXRkQ3kwTFhSZ05HQjBZTFFzTkdDMFl3c0lOQ3kwWXZRdmRDMTBZSFJndEM0SU5HQjBZTFJnTkMxMEx2UXV0QzRJTkMzMExBZzBML1JnTkMxMExUUXRkQzcwWXNnMEwvUXRkR0EwTFhSZ05DMTBZRFF1TkdCMEw3UXN0R0wwTExRc05DMTBMelF2dEM1SU5DKzBMSFF1OUN3MFlIUmd0QzRJTkMvMExqUXV0QzEwWURRc0Z4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JsTG5OMGIzQlFjbTl3WVdkaGRHbHZiaWdwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTVmYjI1QmNuSnZkME5zYVdOcktDUmhjbkp2ZHl3Z2FYUmxiUzV1WVcxbEtUdGNjbHh1SUNBZ0lDQWdJQ0I5S1R0Y2NseHVJQ0FnSUgwcE8xeHlYRzVjY2x4dUlDQWdJQzh2SU5HQTBMWFF2ZEMwMExYUmdDRFF0TkM5MExYUXVWeHlYRzRnSUNBZ1kyOXVjM1FnSkdSaGVYTWdQU0FrYlc5dWRHZ3VjWFZsY25sVFpXeGxZM1J2Y2lnbkxrMXZiblJvWDE5a1lYbHpKeWs3WEhKY2JpQWdJQ0JqYjI1emRDQmtZWGx6SUQwZ2JtVjNJRVJoZEdVb1pHRjBaUzVuWlhSVWFXMWxLQ2twTzF4eVhHNGdJQ0FnWkdGNWN5NXpaWFJFWVhSbEtERXBPMXh5WEc0Z0lDQWdaR0Y1Y3k1elpYUkliM1Z5Y3lnd0xDQXdMQ0F3TENBd0tUdGNjbHh1WEhKY2JpQWdJQ0IzYUdsc1pTQW9aR0Y1Y3k1blpYUk5iMjUwYUNncElEMDlJR04xY25KbGJuUk5iMjUwYUNrZ2UxeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElDUjNaV1ZySUQwZ2RHaHBjeTVmSkdOeVpXRjBaVmRsWldzb0tUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2QyVmxhMFJoZVhNdVptOXlSV0ZqYUNocGRHVnRJRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHUmhlWE11WjJWMFJHRjVLQ2tnSVQwZ2FYUmxiUzVrWVhrZ2ZId2daR0Y1Y3k1blpYUk5iMjUwYUNncElDRTlJR04xY25KbGJuUk5iMjUwYUNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdKSGRsWldzdVlYQndaVzVrUTJocGJHUW9kR2hwY3k1ZkpHTnlaV0YwWlVWdGNIUjVSR0Y1S0NrcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWtkMlZsYXk1aGNIQmxibVJEYUdsc1pDaDBhR2x6TGw4a1kzSmxZWFJsUkdGNUtHUmhlWE1wS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWkdGNWN5NXpaWFJFWVhSbEtHUmhlWE11WjJWMFJHRjBaU2dwSUNzZ01TazdYSEpjYmlBZ0lDQWdJQ0FnZlNrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUNSa1lYbHpMbUZ3Y0dWdVpFTm9hV3hrS0NSM1pXVnJLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCeVpYUjFjbTRnSkcxdmJuUm9PMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKclF1OUM0MExvZzBML1F2aURSZ2RHQzBZRFF0ZEM3MExyUXRTRFF2OUMxMFlEUXRkQzYwTHZSanRHSDBMWFF2ZEM0MFk4ZzBMelF0ZEdCMFkvUmh0Q3dYSEpjYmlBcUlFQndZWEpoYlNCN1JXeGxiV1Z1ZEgwZ0pHRnljbTkzSUVoVVRVd2cwWTNRdTlDMTBMelF0ZEM5MFlKY2NseHVJQ29nUUhCaGNtRnRJSHRUZEhKcGJtZDlJRzVoYldVZ0lDQWcwSmpRdk5HUElDaHdjbVYyTENCdVpYaDBLVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmYjI1QmNuSnZkME5zYVdOcklEMGdablZ1WTNScGIyNG9KR0Z5Y205M0xDQnVZVzFsS1NCN1hISmNiaUFnSUNCcFppQW9KR0Z5Y205M0xtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25hWE10WkdsellXSnNaV1FuS1NrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQmpiMjV6ZENCa1lYUmxJRDBnYm1WM0lFUmhkR1VvY0dGeWMyVkpiblFvZEdocGN5NWZKRzF2Ym5Sb2N5NXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVRXOXVkR2duS1M1a1lYUmhjMlYwTG5ScGJXVXNJREV3S1NrN1hISmNiaUFnSUNCa1lYUmxMbk5sZEUxdmJuUm9LR1JoZEdVdVoyVjBUVzl1ZEdnb0tTQXJJQ2h1WVcxbElEMDlJQ2R3Y21WMkp5QS9JQzEwYUdsekxtOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUWdPaUIwYUdsekxtOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUXBLVHRjY2x4dVhISmNiaUFnSUNBdkx5RFFzdEdMMFlYUXZ0QzBJTkMzMExBZzBML1JnTkMxMExUUXRkQzcwWXNnMEx6UXVOQzkwTGpRdk5DdzBMdlJqTkM5MEw3UXVTRFF0TkN3MFlMUmkxeHlYRzRnSUNBZ2FXWWdLR1JoZEdVZ1BDQjBhR2x6TG05d2RHbHZibk11YldsdVJHRjBaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHUmhkR1V1YzJWMFZHbHRaU2gwYUdsekxtOXdkR2x2Ym5NdWJXbHVSR0YwWlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5DeTBZdlJoZEMrMExRZzBMZlFzQ0RRdjlHQTBMWFF0TkMxMEx2Uml5RFF2TkN3MExyUmdkQzQwTHpRc05DNzBZelF2ZEMrMExrZzBMVFFzTkdDMFl0Y2NseHVJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11YldGNFJHRjBaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUdWdVpFUmhkR1VnUFNCdVpYY2dSR0YwWlNoa1lYUmxMbWRsZEZScGJXVW9LU2s3WEhKY2JpQWdJQ0FnSUNBZ1pXNWtSR0YwWlM1elpYUk5iMjUwYUNobGJtUkVZWFJsTG1kbGRFMXZiblJvS0NrZ0t5QjBhR2x6TG05d2RHbHZibk11Ylc5dWRHaHpRMjkxYm5RcE8xeHlYRzRnSUNBZ0lDQWdJR2xtSUNobGJtUkVZWFJsSUQ0Z2RHaHBjeTV2Y0hScGIyNXpMbTFoZUVSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdaR0YwWlM1elpYUlVhVzFsS0hSb2FYTXViM0IwYVc5dWN5NXRZWGhFWVhSbExtZGxkRlJwYldVb0tTazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHUmhkR1V1YzJWMFRXOXVkR2dvWkdGMFpTNW5aWFJOYjI1MGFDZ3BJQzBnZEdocGN5NXZjSFJwYjI1ekxtMXZiblJvYzBOdmRXNTBJQ3NnTVNrN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQy8wTFhSZ05DMTBZWFF2dEMwSU5DNklOQzkwTDdRc3RDKzBMa2cwTFRRc05HQzBMVmNjbHh1SUNBZ0lIUm9hWE11WDNObGJHVmpkRVJoZEdVb1pHRjBaU2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvOUdCMFlMUXNOQzkwTDdRc3RDNjBMQWcwWUxRdGRDNjBZUFJpZEMxMExrZzBMVFFzTkdDMFlzZzBZRWcwWURRdGRDOTBMVFF0ZEdBMEw3UXZGeHlYRzRnS2lCQWNHRnlZVzBnZTBSaGRHVjlJR1JoZEdVZzBKVFFzTkdDMExCY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgzTmxiR1ZqZEVSaGRHVWdQU0JtZFc1amRHbHZiaWhrWVhSbEtTQjdYSEpjYmlBZ0lDQjBhR2x6TGw5elpXeGxZM1JsWkVSaGRHVWdQU0JrWVhSbE8xeHlYRzRnSUNBZ2RHaHBjeTVmSkdOeVpXRjBaVTF2Ym5Sb2N5aGtZWFJsS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNnMExYUXZkQzAwTFhSZ0NEUXZkQzEwTFRRdGRDNzBMaGNjbHh1SUNvZ1FIQmhjbUZ0SUNCN1JHRjBaWDBnWkdGMFpTRFFudEN4MFlyUXRkQzYwWUlnMExUUXNOR0MwWXRjY2x4dUlDb2dRSEpsZEhWeWJpQjdSV3hsYldWdWRIMWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYeVJqY21WaGRHVlhaV1ZySUQwZ1puVnVZM1JwYjI0b1pHRjBaU2tnZTF4eVhHNGdJQ0FnWTI5dWMzUWdKSGRsWldzZ1BTQjBhR2x6TGw4a1kzSmxZWFJsUld4bGJXVnVkQ2hjY2x4dUlDQWdJQ0FnSUNCZ1BHUnBkaUJqYkdGemN6MWNJbGRsWld0Y0lqNDhMMlJwZGo1Z1hISmNiaUFnSUNBcE8xeHlYRzVjY2x4dUlDQWdJSEpsZEhWeWJpQWtkMlZsYXp0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNnMExYUXZkQzAwTFhSZ0NEUXROQzkwWTljY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ29nUUhKbGRIVnliaUI3Uld4bGJXVnVkSDFjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WHlSamNtVmhkR1ZFWVhrZ1BTQm1kVzVqZEdsdmJpaGtZWFJsS1NCN1hISmNiaUFnSUNCamIyNXpkQ0FrWkdGNUlEMGdkR2hwY3k1ZkpHTnlaV0YwWlVWc1pXMWxiblFvWEhKY2JpQWdJQ0FnSUNBZ1lEeGthWFlnWTJ4aGMzTTlYQ0pFWVhsY0lpQmtZWFJoTFhScGJXVTlYQ0lrZTJSaGRHVXVaMlYwVkdsdFpTZ3BmVndpSUdSaGRHRXRaR0Y1UFZ3aUpIdGtZWFJsTG1kbGRFUmhlU2dwZlZ3aVBpUjdaR0YwWlM1blpYUkVZWFJsS0NsOVBDOWthWFkrWUZ4eVhHNGdJQ0FnS1R0Y2NseHVYSEpjYmlBZ0lDQWtaR0Y1TG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJOc2FXTnJKeXdnZEdocGN5NWZiMjVFWVhsRGJHbGphMFYyWlc1MExtSnBibVFvZEdocGN5a3BPMXh5WEc1Y2NseHVJQ0FnSUdsbUlDZ2hkR2hwY3k1dmNIUnBiMjV6TG5OcGJtZHNaVTF2WkdVcElIdGNjbHh1SUNBZ0lDQWdJQ0FrWkdGNUxtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyMXZkWE5sWlc1MFpYSW5MQ0IwYUdsekxsOXZia1JoZVUxdmRYTmxSVzUwWlhKRmRtVnVkQzVpYVc1a0tIUm9hWE1wS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURRdnRDeDBMM1F2dEN5MEx2UXRkQzkwTGpRdFNEUmdkQyswWUhSZ3RDKzBZL1F2ZEM0MExsY2NseHVJQ0FnSUhSb2FYTXVYM1Z3WkdGMFpVUmhlU2drWkdGNUtUdGNjbHh1WEhKY2JpQWdJQ0J5WlhSMWNtNGdKR1JoZVR0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNlMExIUXZkQyswTExRdTlDMTBMM1F1TkMxSU5HQjBMN1JnZEdDMEw3Umo5QzkwTGpRdVZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1MWNHUmhkR1VnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lIUm9hWE11WHlSdGIyNTBhSE11Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2duTGsxdmJuUm9KeWt1Wm05eVJXRmphQ2drYlc5dWRHZ2dQVDRnZTF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNWd1pHRjBaVTF2Ym5Sb0tDUnRiMjUwYUNrN1hISmNiaUFnSUNCOUtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DZTBMSFF2ZEMrMExMUXU5QzEwTDNRdU5DMUlOR0IwTDdSZ2RHQzBMN1JqOUM5MExqUXVTRFF2TkMxMFlIUmo5R0cwTEJjY2x4dUlDb2dRSEJoY21GdElIdEZiR1Z0Wlc1MGZTQWtiVzl1ZEdnZzBLM1F1OUMxMEx6UXRkQzkwWUlnMEx6UXRkR0IwWS9SaHRDd1hISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOTFjR1JoZEdWTmIyNTBhQ0E5SUdaMWJtTjBhVzl1S0NSdGIyNTBhQ2tnZTF4eVhHNGdJQ0FnSkcxdmJuUm9MbkYxWlhKNVUyVnNaV04wYjNKQmJHd29KeTVFWVhsYlpHRjBZUzEwYVcxbFhTY3BMbVp2Y2tWaFkyZ29KR1JoZVNBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZkWEJrWVhSbFJHRjVLQ1JrWVhrcE8xeHlYRzRnSUNBZ2ZTazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW50Q3gwTDNRdnRDeTBMdlF0ZEM5MExqUXRTRFJnZEMrMFlIUmd0QyswWS9RdmRDNDBMa2cwTFRRdmRHUFhISmNiaUFxSUVCd1lYSmhiU0I3Uld4bGJXVnVkSDBnSkdSaGVTRFFyZEM3MExYUXZOQzEwTDNSZ2lEUXROQzkwWTljY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDNWd1pHRjBaVVJoZVNBOUlHWjFibU4wYVc5dUtDUmtZWGtwSUh0Y2NseHVJQ0FnSUdOdmJuTjBJR1JoZEdVZ0lDQTlJRzVsZHlCRVlYUmxLSEJoY25ObFNXNTBLQ1JrWVhrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcE8xeHlYRzRnSUNBZ1kyOXVjM1FnYkc5amEyVmtJRDBnZEdocGN5NWZabWxzZEdWeVRHOWphMFJoZVhNb1pHRjBaU2s3WEhKY2JpQWdJQ0JqYjI1emRDQjBiMlJoZVNBZ1BTQjBhR2x6TGw5MGIyUmhlUzVuWlhSVWFXMWxLQ2tnUFQwZ1pHRjBaUzVuWlhSVWFXMWxLQ2s3WEhKY2JseHlYRzRnSUNBZ0pHUmhlUzVqYkdGemMweHBjM1F1ZEc5bloyeGxLQ2RwY3kxa2FYTmhZbXhsWkNjc0lHeHZZMnRsWkNrN1hISmNiaUFnSUNBa1pHRjVMbU5zWVhOelRHbHpkQzUwYjJkbmJHVW9KMmx6TFd4dlkydGxaQ2NzSUd4dlkydGxaQ0E5UFNCTVQwTkxYMHhQUTB0RlJDazdYSEpjYmlBZ0lDQWtaR0Y1TG1Oc1lYTnpUR2x6ZEM1MGIyZG5iR1VvSjJsekxYUnZaR0Y1Snl3Z2RHOWtZWGtwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwS0hRdnRDeDBZdlJndEM0MExVZzBMclF1OUM0MExyUXNDRFF2OUMrSU5DMDBMM1JqbHh5WEc0Z0tpQkFjR0Z5WVcwZ2UwVjJaVzUwZlNCbElFUlBUU0RSZ2RDKzBMSFJpOUdDMExqUXRWeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZiMjVFWVhsRGJHbGphMFYyWlc1MElEMGdablZ1WTNScGIyNG9aU2tnZTF4eVhHNGdJQ0FnZEdocGN5NWZiMjVFWVhsRGJHbGpheWhsTG5SaGNtZGxkQ2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvZEMrMExIUmk5R0MwTGpRdFNEUmhkQyswTExRdGRHQTBMQmNjbHh1SUNvZ1FIQmhjbUZ0SUh0RmRtVnVkSDBnWlNCRVQwMGcwWUhRdnRDeDBZdlJndEM0MExWY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgyOXVSR0Y1VFc5MWMyVkZiblJsY2tWMlpXNTBJRDBnWm5WdVkzUnBiMjRvWlNrZ2UxeHlYRzRnSUNBZ2RHaHBjeTVmYjI1RVlYbE5iM1Z6WlVWdWRHVnlLR1V1ZEdGeVoyVjBLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2wwTDdRc3RDMTBZQWcwTDNRc0NEUmpkQzcwTFhRdk5DMTBMM1JndEMxSU5DMDBMM1JqMXh5WEc0Z0tpQkFjR0Z5WVcwZ2UwVnNaVzFsYm5SOUlDUmtZWGtnU0ZSTlRDRFFyZEM3MExYUXZOQzEwTDNSZ2x4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZmIyNUVZWGxOYjNWelpVVnVkR1Z5SUQwZ1puVnVZM1JwYjI0b0pHUmhlU2tnZTF4eVhHNGdJQ0FnYVdZZ0tDRjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dElIeDhJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdsbUlDZ2taR0Y1TG1SaGRHRnpaWFF1ZEdsdFpTQTlQU0IwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRMbWRsZEZScGJXVW9LU2tnZTF4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQmpiMjV6ZENCa1lYUmxYM1J2SUQwZ2JtVjNJRVJoZEdVb2NHRnljMlZKYm5Rb0pHUmhlUzVrWVhSaGMyVjBMblJwYldVc0lERXdLU2s3WEhKY2JpQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDaDBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dExDQmtZWFJsWDNSdktUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DYTBMdlF1TkM2SU5DLzBMNGcwTFRRdmRHT1hISmNiaUFxSUVCd1lYSmhiU0I3Uld4bGJXVnVkSDBnSkdSaGVTQklWRTFNSU5DdDBMdlF0ZEM4MExYUXZkR0NYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDl2YmtSaGVVTnNhV05ySUQwZ1puVnVZM1JwYjI0b0pHUmhlU2tnZTF4eVhHNGdJQ0FnTHk4ZzBMVFF0ZEM5MFl3ZzBMZlFzTkN4MEx2UXZ0QzYwTGpSZ05DKzBMTFFzTkM5WEhKY2JpQWdJQ0JwWmlBb0pHUmhlUzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJsekxXUnBjMkZpYkdWa0p5a3BJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBMTFJpOUN4MEw3UmdDRFF2dEMwMEwzUXZ0QzVJTkMwMExEUmd0R0xYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxuTnBibWRzWlUxdlpHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDl5WVc1blpWSmxjMlYwS0NrN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTQTlJRzVsZHlCRVlYUmxLSEJoY25ObFNXNTBLQ1JrWVhrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcFhISmNiaUFnSUNBZ0lDQWdKR1JoZVM1amJHRnpjMHhwYzNRdVlXUmtLQ2RwY3kxelpXeGxZM1JsWkNjcE8xeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgyTmhiR3hpWVdOcktDZGtZWGxUWld4bFkzUW5MQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRLVHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwWUhRc2RHQTBMN1JnU0RRc3RHTDBMSFJnTkN3MEwzUXZkQyswTFBRdmlEUmdOQ3cwTDNRdGRDMUlOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXNGeHlYRzRnSUNBZ2FXWWdLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMGdKaVlnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDl5WVc1blpWSmxjMlYwS0NrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdKR1JoZVM1amJHRnpjMHhwYzNRdVlXUmtLQ2RwY3kxelpXeGxZM1JsWkNjcE8xeHlYRzVjY2x4dUlDQWdJQzh2SU5DeTBZdlFzZEdBMExEUXZkQ3dJTkM5MExEUmg5Q3cwTHZSak5DOTBMRFJqeUF2SU5DNjBMN1F2ZEMxMFlmUXZkQ3cwWThnMExUUXNOR0MwTEJjY2x4dUlDQWdJR2xtSUNnaGRHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlNrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMGdQU0J1WlhjZ1JHRjBaU2h3WVhKelpVbHVkQ2drWkdGNUxtUmhkR0Z6WlhRdWRHbHRaU3dnTVRBcEtUdGNjbHh1SUNBZ0lIMGdaV3h6WlNCcFppQW9JWFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZmRHOGdQU0J1WlhjZ1JHRjBaU2h3WVhKelpVbHVkQ2drWkdGNUxtUmhkR0Z6WlhRdWRHbHRaU3dnTVRBcEtUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JwWmlBb2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlNBbUppQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJQzh2SU5DMDBMN1F2OUdEMFlIUmd0QzQwTHpSaTlDNUlOQzAwTGpRc05DLzBMRFF0OUMrMEwxY2NseHVJQ0FnSUNBZ0lDQnBaaUFvSVhSb2FYTXVaMlYwU1hOU1lXNW5aVk5sYkdWamRHRmliR1VvZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU3dnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZmRHOHBLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVgzSmhibWRsVW1WelpYUW9LVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdkR2hwY3k1eVlXNW5aVk5sYkdWamRDaDBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dExDQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjkwYnlrN1hISmNiaUFnSUNCOVhISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRa3RDNDBMZlJnOUN3MEx2UmpOQzkwWXZRdVNEUmdkQ3gwWURRdnRHQklOQ3kwWXZRdE5DMTBMdlF0ZEM5MEwzUmk5R0ZJTkMwMExEUmdseHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZjbUZ1WjJWV2FYTjFZV3hTWlhObGRDQTlJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnWTI5dWMzUWdKR1JoZVhNZ1BTQjBhR2x6TGw4a2JXOXVkR2h6TG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvSnk1RVlYbGJaR0YwWVMxMGFXMWxYU2NwTzF4eVhHNGdJQ0FnSkdSaGVYTXVabTl5UldGamFDZ2taR0Y1SUQwK0lIdGNjbHh1SUNBZ0lDQWdJQ0FrWkdGNUxtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb0oybHpMWE5sYkdWamRHVmtKeXdnSjJsekxYTmxiR1ZqZEdWa0xXWnliMjBuTENBbmFYTXRjMlZzWldOMFpXUXRkRzhuTENBbmFYTXRjMlZzWldOMFpXUXRZbVYwZDJWbGJpY3BPMXh5WEc0Z0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ0x5OGcwTC9SZ05HUDBZZlF0ZEM4SU5DLzBMN1F0TkdCMExyUXNOQzMwTHJSZzF4eVhHNGdJQ0FnZEdocGN5NWZkRzl2YkhScGNFaHBaR1VvS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNTMExqUXQ5R0QwTERRdTlHTTBMM1F2dEMxSU5DeTBZdlF0TkMxMEx2UXRkQzkwTGpRdFNEUXROQ3cwWUpjY2x4dUlDb2dRSEJoY21GdElIdEVZWFJsZlNCa1lYUmxYMlp5YjIwZzBKM1FzTkdIMExEUXU5R00wTDNRc05HUElOQzAwTERSZ3RDd1hISmNiaUFxSUVCd1lYSmhiU0I3UkdGMFpYMGdaR0YwWlY5MGJ5QWdJTkNhMEw3UXZkQzEwWWZRdmRDdzBZOGcwTFRRc05HQzBMQmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBJRDBnWm5WdVkzUnBiMjRvWkdGMFpWOW1jbTl0TENCa1lYUmxYM1J2S1NCN1hISmNiaUFnSUNCcFppQW9aR0YwWlY5bWNtOXRJQ1ltSUdSaGRHVmZabkp2YlNCcGJuTjBZVzVqWlc5bUlFUmhkR1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQmtZWFJsWDJaeWIyMHVjMlYwU0c5MWNuTW9NQ3dnTUN3Z01Dd2dNQ2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2FXWWdLR1JoZEdWZmRHOGdKaVlnWkdGMFpWOTBieUJwYm5OMFlXNWpaVzltSUVSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCa1lYUmxYM1J2TG5ObGRFaHZkWEp6S0RBc0lEQXNJREFzSURBcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJR3hsZENCMGFXMWxYMlp5YjIwZ1BTQmtZWFJsWDJaeWIyMGdhVzV6ZEdGdVkyVnZaaUJFWVhSbElEOGdaR0YwWlY5bWNtOXRMbWRsZEZScGJXVW9LU0E2SURBN1hISmNiaUFnSUNCc1pYUWdkR2x0WlY5MGJ5QTlJR1JoZEdWZmRHOGdhVzV6ZEdGdVkyVnZaaUJFWVhSbElEOGdaR0YwWlY5MGJ5NW5aWFJVYVcxbEtDa2dPaUF3TzF4eVhHNGdJQ0FnYVdZZ0tIUnBiV1ZmWm5KdmJTQStJSFJwYldWZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNCYmRHbHRaVjltY205dExDQjBhVzFsWDNSdlhTQTlJRnQwYVcxbFgzUnZMQ0IwYVcxbFgyWnliMjFkTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkN5MFl2UXROQzEwTHZRdGRDOTBMalF0U0RRdE5DdzBZSWcwTHpRdGRDMjBMVFJneURRdmRDdzBZZlFzTkM3MFl6UXZkQyswTGtnMExnZzBMclF2dEM5MExYUmg5QzkwTDdRdVZ4eVhHNGdJQ0FnWTI5dWMzUWdKR1JoZVhNZ1BTQjBhR2x6TGw4a2JXOXVkR2h6TG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvSnk1RVlYbGJaR0YwWVMxMGFXMWxYU2NwTzF4eVhHNGdJQ0FnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENBa1pHRjVjeTVzWlc1bmRHZzdJQ3NyYVNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ1JrWVhselcybGRMbU5zWVhOelRHbHpkQzUwYjJkbmJHVW9KMmx6TFhObGJHVmpkR1ZrTFdKbGRIZGxaVzRuTENBa1pHRjVjMXRwWFM1a1lYUmhjMlYwTG5ScGJXVWdQaUIwYVcxbFgyWnliMjBnSmlZZ0pHUmhlWE5iYVYwdVpHRjBZWE5sZEM1MGFXMWxJRHdnZEdsdFpWOTBieWs3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwTExSaTlDMDBMWFF1OUMxMEwzUXVOQzFJTkM5MExEUmg5Q3cwTHZSak5DOTBMN1F1U0RRdUNEUXV0QyswTDNRdGRHSDBMM1F2dEM1SU5DLzBMN1F0OUM0MFliUXVOQzRYSEpjYmlBZ0lDQmpiMjV6ZENBa1pHRjVYMlp5YjIwZ1BTQjBhR2x6TGw4a1oyVjBSR0Y1UW5sRVlYUmxLR1JoZEdWZlpuSnZiU2s3WEhKY2JpQWdJQ0JqYjI1emRDQWtaR0Y1WDNSdklEMGdkR2hwY3k1ZkpHZGxkRVJoZVVKNVJHRjBaU2hrWVhSbFgzUnZLVHRjY2x4dVhISmNiaUFnSUNBdkx5RFF1dEMxMFlnZzBMVFF1OUdQSU5DeDBZdlJnZEdDMFlEUXZ0Q3owTDRnMFlIUXNkR0EwTDdSZ2RDd0lOR0IwWUxRc05HQTBMN1FzOUMrSU5DeTBZdlF0TkMxMEx2UXRkQzkwTGpSajF4eVhHNGdJQ0FnYVdZZ0tIUm9hWE11WDNacGMzVmhiRk5sYkdWamRHbHZiaTRrWkdGNVgyWnliMjFmYjJ4a0lDWW1JSFJvYVhNdVgzWnBjM1ZoYkZObGJHVmpkR2x2Ymk0a1pHRjVYMlp5YjIxZmIyeGtJQ0U5SUNSa1lYbGZabkp2YlNrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzWnBjM1ZoYkZObGJHVmpkR2x2Ymk0a1pHRjVYMlp5YjIxZmIyeGtMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMmx6TFhObGJHVmpkR1ZrSnl3Z0oybHpMWE5sYkdWamRHVmtMV1p5YjIwbktUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUXV0QzEwWWdnMExUUXU5R1BJTkN4MFl2UmdkR0MwWURRdnRDejBMNGcwWUhRc2RHQTBMN1JnZEN3SU5HQjBZTFFzTkdBMEw3UXM5QytJTkN5MFl2UXROQzEwTHZRdGRDOTBMalJqMXh5WEc0Z0lDQWdhV1lnS0hSb2FYTXVYM1pwYzNWaGJGTmxiR1ZqZEdsdmJpNGtaR0Y1WDNSdlgyOXNaQ0FtSmlCMGFHbHpMbDkyYVhOMVlXeFRaV3hsWTNScGIyNHVKR1JoZVY5MGIxOXZiR1FnSVQwZ0pHUmhlVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzWnBjM1ZoYkZObGJHVmpkR2x2Ymk0a1pHRjVYM1J2WDI5c1pDNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZHBjeTF6Wld4bFkzUmxaQ2NzSUNkcGN5MXpaV3hsWTNSbFpDMTBieWNwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lHbG1JQ2drWkdGNVgyWnliMjBwSUh0Y2NseHVJQ0FnSUNBZ0lDQWtaR0Y1WDJaeWIyMHVZMnhoYzNOTWFYTjBMbUZrWkNnbmFYTXRjMlZzWldOMFpXUW5MQ0FuYVhNdGMyVnNaV04wWldRdFpuSnZiU2NwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lHbG1JQ2drWkdGNVgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ0pHUmhlVjkwYnk1amJHRnpjMHhwYzNRdVlXUmtLQ2RwY3kxelpXeGxZM1JsWkNjc0lDZHBjeTF6Wld4bFkzUmxaQzEwYnljcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5HQjBMN1JoZEdBMExEUXZkQzEwTDNRdU5DMUlOQ3lJTkM2MExYUmlGeHlYRzRnSUNBZ2RHaHBjeTVmZG1semRXRnNVMlZzWldOMGFXOXVMaVJrWVhsZlpuSnZiVjl2YkdRZ1BTQWtaR0Y1WDJaeWIyMDdYSEpjYmlBZ0lDQjBhR2x6TGw5MmFYTjFZV3hUWld4bFkzUnBiMjR1SkdSaGVWOTBiMTl2YkdRZ1BTQWtaR0Y1WDNSdk8xeHlYRzVjY2x4dUlDQWdJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNGtaR0Y1WDJaeWIyMGdQU0FrWkdGNVgyWnliMjA3WEhKY2JpQWdJQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVKR1JoZVY5MGJ5QWdJRDBnSkdSaGVWOTBienRjY2x4dVhISmNiaUFnSUNCcFppQW9KR1JoZVY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR1JoZVhNZ1BTQk5ZWFJvTG1ac2IyOXlLRTFoZEdndVlXSnpLSFJwYldWZlpuSnZiU0F0SUhScGJXVmZkRzhwSUM4Z09EWTBNREJsTXlrZ0t5QXhPMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM1J2YjJ4MGFYQlRhRzkzS0dSaGVYTXBPMXh5WEc0Z0lDQWdmVnh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKL1F2dEM2MExEUXR5RFF2OUMrMExUUmdkQzYwTERRdDlDNjBMaGNjbHh1SUNvZ1FIQmhjbUZ0SUh0T2RXMWlaWEo5SUdSaGVYTWcwSnJRdnRDNzBMalJoOUMxMFlIUmd0Q3kwTDRnMExUUXZkQzEwTGxjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDNSdmIyeDBhWEJUYUc5M0lEMGdablZ1WTNScGIyNG9aR0Y1Y3lrZ2UxeHlYRzRnSUNBZ2RHaHBjeTVmSkhSdmIyeDBhWEJEYjI1MFpXNTBMblJsZUhSRGIyNTBaVzUwSUQwZ2RHaHBjeTVmWm1sc2RHVnlWRzl2YkhScGNGUmxlSFFvWkdGNWN5azdYSEpjYmlBZ0lDQjBhR2x6TGw4a2RHOXZiSFJwY0M1amJHRnpjMHhwYzNRdWRHOW5aMnhsS0NkcGN5MXphRzkzSnl3Z2RHaHBjeTVmSkhSdmIyeDBhWEF1ZEdWNGRFTnZiblJsYm5RdWJHVnVaM1JvS1R0Y2NseHVJQ0FnSUhSb2FYTXVYM1J2YjJ4MGFYQlZjR1JoZEdVb0tUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DZTBMSFF2ZEMrMExMUXU5QzEwTDNRdU5DMUlOQy8wTDdRdDlDNDBZYlF1TkM0SU5DLzBMN1F0TkdCMExyUXNOQzMwTHJRdUZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZmRHOXZiSFJwY0ZWd1pHRjBaU0E5SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ2FXWWdLQ0YwYUdsekxsOXpaV3hsWTNScGIyNHVKR1JoZVY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCc1pYUWdlQ0E5SURBN1hISmNiaUFnSUNCc1pYUWdlU0E5SURBN1hISmNiaUFnSUNCc1pYUWdKR1ZzSUQwZ2RHaHBjeTVmYzJWc1pXTjBhVzl1TGlSa1lYbGZkRzg3WEhKY2JpQWdJQ0JrYnlCN1hISmNiaUFnSUNBZ0lDQWdlU0FyUFNBa1pXd3ViMlptYzJWMFZHOXdPMXh5WEc0Z0lDQWdJQ0FnSUhnZ0t6MGdKR1ZzTG05bVpuTmxkRXhsWm5RN1hISmNiaUFnSUNCOUlIZG9hV3hsSUNnb0pHVnNJRDBnSkdWc0xtOW1abk5sZEZCaGNtVnVkQ2tnSmlZZ0pHVnNJQ0U5SUhSb2FYTXVYeVJ3YVdOclpYSXBPMXh5WEc1Y2NseHVJQ0FnSUhSb2FYTXVYeVIwYjI5c2RHbHdMbk4wZVd4bExuUnZjQ0E5SUUxaGRHZ3VjbTkxYm1Rb2VTQXRJSFJvYVhNdVh5UjBiMjlzZEdsd0xtOW1abk5sZEVobGFXZG9kQ2tnS3lBbmNIZ25PMXh5WEc0Z0lDQWdkR2hwY3k1ZkpIUnZiMngwYVhBdWMzUjViR1V1YkdWbWRDQTlJRTFoZEdndWNtOTFibVFvZUNBcklIUm9hWE11WDNObGJHVmpkR2x2Ymk0a1pHRjVYM1J2TG05bVpuTmxkRmRwWkhSb0lDOGdNaUF0SUhSb2FYTXVYeVIwYjI5c2RHbHdMbTltWm5ObGRGZHBaSFJvSUM4Z01pa2dLeUFuY0hnbk8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtIUXV0R0EwWXZSZ3RHTUlOQy8wTDdRdE5HQjBMclFzTkMzMExyUmcxeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZkRzl2YkhScGNFaHBaR1VnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lIUm9hWE11WHlSMGIyOXNkR2x3TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJsekxYTm9iM2NuS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNpMExYUXV0R0IwWUlnMEwvUXZ0QzAwWUhRdXRDdzBMZlF1dEM0SU5DLzBMNGcwWVBRdk5DKzBMdlJoOUN3MEwzUXVOR09YSEpjYmlBcUlFQndZWEpoYlNBZ2UwNTFiV0psY24wZ1pHRjVjeURRbXRDKzBMdlF1TkdIMExYUmdkR0MwTExRdmlEUXROQzkwTFhRdVZ4eVhHNGdLaUJBY21WMGRYSnVJSHRUZEhKcGJtZDlYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDltYVd4MFpYSlViMjlzZEdsd1ZHVjRkQ0E5SUdaMWJtTjBhVzl1S0dSaGVYTXBJSHRjY2x4dUlDQWdJR2xtSUNoMGVYQmxiMllnZEdocGN5NXZjSFJwYjI1ekxtWnBiSFJsY2k1MGIyOXNkR2x3VkdWNGRDQTlQU0FuWm5WdVkzUnBiMjRuS1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YjNCMGFXOXVjeTVtYVd4MFpYSXVkRzl2YkhScGNGUmxlSFF1WTJGc2JDaDBhR2x6TENCa1lYbHpLU0I4ZkNBbkp6dGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1d2JIVnlZV3dvWkdGNWN5d2dXeWNsWkNEUXROQzEwTDNSakNjc0lDY2xaQ0RRdE5DOTBZOG5MQ0FuSldRZzBMVFF2ZEMxMExrblhTa3VjbVZ3YkdGalpTZ25KV1FuTENCa1lYbHpLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2swTGpRdTlHTTBZTFJnQ0RRdmRDMTBMVFF2dEdCMFlMUmc5Qy8wTDNSaTlHRklOQzAwTDNRdGRDNVhISmNiaUFxSUVCd1lYSmhiU0I3UkdGMFpYMGdaR0YwWlNEUWxOQ3cwWUxRc0Z4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZlptbHNkR1Z5VEc5amEwUmhlWE1nUFNCbWRXNWpkR2x2Ymloa1lYUmxLU0I3WEhKY2JpQWdJQ0F2THlEUXN0R0wwTEhRdnRHQUlOQzAwTERSZ2lEUXN0QzkwTFVnMExUUXZ0R0IwWUxSZzlDLzBMM1F2dEN6MEw0ZzBMVFF1TkN3MEwvUXNOQzMwTDdRdmRDd1hISmNiaUFnSUNCcFppQW9aR0YwWlNBOElIUm9hWE11YjNCMGFXOXVjeTV0YVc1RVlYUmxJSHg4SUdSaGRHVWdQaUIwYUdsekxtOXdkR2x2Ym5NdWJXRjRSR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQk1UME5MWDFWT1FWWkJTVXhCUWt4Rk8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5DLzBMN1F1OUdNMExmUXZ0Q3kwTERSZ3RDMTBMdlJqTkdCMExyUXVOQzFJTkdFMFlQUXZkQzYwWWJRdU5DNFhISmNiaUFnSUNCcFppQW9kSGx3Wlc5bUlIUm9hWE11YjNCMGFXOXVjeTVtYVd4MFpYSXViRzlqYTBSaGVYTWdQVDBnSjJaMWJtTjBhVzl1SnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG05d2RHbHZibk11Wm1sc2RHVnlMbXh2WTJ0RVlYbHpMbU5oYkd3b1pHRjBaU2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwTExSZ2RDMUlOQzAwTDNRdUNEUXROQyswWUhSZ3RHRDBML1F2ZEdMWEhKY2JpQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRb2RDKzBMSFJpOUdDMExqUXRTRFF1TkMzMEx6UXRkQzkwTFhRdmRDNDBZOGcwWURRc05DMzBMelF0ZEdBMEw3UXNpRFF2dEM2MEwzUXNGeHlYRzRnS2lCQWNHRnlZVzBnZTBWMlpXNTBmU0JsSUVSUFRTRFJnZEMrMExIUmk5R0MwTGpRdFZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZmIyNVhhVzVrYjNkU1pYTnBlbVZGZG1WdWRDQTlJR1oxYm1OMGFXOXVLR1VwSUh0Y2NseHVJQ0FnSUdsbUlDaDBhR2x6TGw5elpXeGxZM1JwYjI0dUpHUmhlVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzUnZiMngwYVhCVmNHUmhkR1VvS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnNaWFFnWW5KbFlXdHdiMmx1ZENBOUlEQTdYSEpjYmlBZ0lDQmpiMjV6ZENCaWNtVmhhM0J2YVc1MGN5QTlJRTlpYW1WamRDNXJaWGx6S0hSb2FYTXViM0IwYVc5dWN5NWljbVZoYTNCdmFXNTBjeWt1YzI5eWRDZ29ZU3dnWWlrZ1BUNGdZU0F0SUdJcE8xeHlYRzRnSUNBZ1ptOXlJQ2hzWlhRZ2FTQnBiaUJpY21WaGEzQnZhVzUwY3lrZ2UxeHlYRzRnSUNBZ0lDQWdJR2xtSUNoM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUNBOFBTQmljbVZoYTNCdmFXNTBjMXRwWFNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCaWNtVmhhM0J2YVc1MElEMGdZbkpsWVd0d2IybHVkSE5iYVYwN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdKeVpXRnJPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQjBhR2x6TGw5elpYUkNjbVZoYTNCdmFXNTBLR0p5WldGcmNHOXBiblFwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwS1BSZ2RHQzBMRFF2ZEMrMExMUXV0Q3dJTkdCMEw3UmdkR0MwTDdSajlDOTBMalJqeURSZ05DMTBMM1F0TkMxMFlEUXNDRFF2OUMrMExRZzBZRFFzTkMzMEwzUmk5QzFJTkdOMExyUmdOQ3cwTDNSaTF4eVhHNGdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdZbkpsWVd0d2IybHVkQ0RRbXRDNzBZN1JoeURRdU5DM0lIUm9hWE11YjNCMGFXOXVjeTVpY21WaGEzQnZhVzUwY3lBbzBLalF1TkdBMExqUXZkQ3dJTkdOMExyUmdOQ3cwTDNRc0NsY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgzTmxkRUp5WldGcmNHOXBiblFnUFNCbWRXNWpkR2x2YmloaWNtVmhhM0J2YVc1MEtTQjdYSEpjYmlBZ0lDQXZMeURRdnRHQ0lOQzkwTFhRdmRHRDBMYlF2ZEMrMExrZzBML1F0ZEdBMExYUmdOQzQwWUhRdnRDeTBMclF1Rnh5WEc0Z0lDQWdhV1lnS0hSb2FYTXVYMkp5WldGcmNHOXBiblFnUFQwZ1luSmxZV3R3YjJsdWRDa2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJSDFjY2x4dUlDQWdJSFJvYVhNdVgySnlaV0ZyY0c5cGJuUWdQU0JpY21WaGEzQnZhVzUwTzF4eVhHNWNjbHh1SUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxtSnlaV0ZyY0c5cGJuUnpXMkp5WldGcmNHOXBiblJkS1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJRTlpYW1WamRDNWhjM05wWjI0b2RHaHBjeTV2Y0hScGIyNXpMQ0IwYUdsekxtOXdkR2x2Ym5NdVluSmxZV3R3YjJsdWRITmJZbkpsWVd0d2IybHVkRjBwTzF4eVhHNGdJQ0FnZEdocGN5NWZKR055WldGMFpVMXZiblJvY3loMGFHbHpMbDl6Wld4bFkzUmxaRVJoZEdVcE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEszUXU5QzEwTHpRdGRDOTBZSWcwTHJRc05DNzBMWFF2ZEMwMExEUmdOQzkwTDdRczlDK0lOQzAwTDNSajF4eVhHNGdLaUJBY0dGeVlXMGdJSHRFWVhSbGZTQmtZWFJsSU5DVTBMRFJndEN3WEhKY2JpQXFJRUJ5WlhSMWNtNGdlMFZzWlcxbGJuUjlJQ0FnU0ZSTlRDRFJqZEM3MExYUXZOQzEwTDNSZ2x4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZkpHZGxkRVJoZVVKNVJHRjBaU0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJR052Ym5OMElIUnBiV1VnUFNCa1lYUmxJR2x1YzNSaGJtTmxiMllnUkdGMFpTQS9JR1JoZEdVdVoyVjBWR2x0WlNncElEb2dNRHRjY2x4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TGw4a2JXOXVkR2h6TG5GMVpYSjVVMlZzWldOMGIzSW9KeTVFWVhsYlpHRjBZUzEwYVcxbFBWd2lKeUFySUhScGJXVWdLeUFuWENKZEp5azdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW9OQzEwTDNRdE5DMTBZQWcwTFRRdmRHUElDMGcwTGZRc05DejBMdlJnOUdJMExyUXVGeHlYRzRnS2lCQWNtVjBkWEp1SUh0RmJHVnRaVzUwZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZkpHTnlaV0YwWlVWdGNIUjVSR0Y1SUQwZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQmpiMjV6ZENBa1pHRjVJRDBnZEdocGN5NWZKR055WldGMFpVVnNaVzFsYm5Rb1hISmNiaUFnSUNBZ0lDQWdZRHhrYVhZZ1kyeGhjM005WENKRVlYa2dhWE10Wlcxd2RIbGNJajQ4TDJScGRqNWdYSEpjYmlBZ0lDQXBPMXh5WEc1Y2NseHVJQ0FnSUhKbGRIVnliaUFrWkdGNU8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtIUXZ0QzMwTFRRc05DOTBMalF0U0RSamRDNzBMWFF2TkMxMEwzUmd0Q3dJTkM0MExjZ1NGUk5UQ0RSZ3RDMTBMclJnZEdDMExCY2NseHVJQ29nUUhCaGNtRnRJQ0I3VTNSeWFXNW5mU0JvZEcxc0lFaFVUVXdnMFlMUXRkQzYwWUhSZ2x4eVhHNGdLaUJBY21WMGRYSnVJSHRGYkdWdFpXNTBmVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmSkdOeVpXRjBaVVZzWlcxbGJuUWdQU0JtZFc1amRHbHZiaWhvZEcxc0tTQjdYSEpjYmlBZ0lDQmpiMjV6ZENCa2FYWWdQU0JrYjJOMWJXVnVkQzVqY21WaGRHVkZiR1Z0Wlc1MEtDZGthWFluS1R0Y2NseHVJQ0FnSUdScGRpNXBibk5sY25SQlpHcGhZMlZ1ZEVoVVRVd29KMkZtZEdWeVltVm5hVzRuTENCb2RHMXNLVHRjY2x4dUlDQWdJSEpsZEhWeWJpQmthWFl1WTJocGJHUnlaVzR1YkdWdVozUm9JRDRnTVNBL0lHUnBkaTVqYUdsc1pISmxiaUE2SUdScGRpNW1hWEp6ZEVWc1pXMWxiblJEYUdsc1pEdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSUZOaFptVWcwTExSaTlDMzBMN1FzaURRc3RDOTBMWFJpTkM5MExqUmhTRFJnZEMrMExIUmk5R0MwTGpRdVNEUXV0QyswTHpRdjlDKzBMM1F0ZEM5MFlMUXNGeHlYRzRnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnWmlEUW1OQzgwWThnMFlIUXZ0Q3gwWXZSZ3RDNDBZOWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYMk5oYkd4aVlXTnJJRDBnWm5WdVkzUnBiMjRvWmlrZ2UxeHlYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQjBhR2x6TG05d2RHbHZibk11YjI1YlpsMGdQVDBnSjJaMWJtTjBhVzl1SnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG05d2RHbHZibk11YjI1YlpsMHVZWEJ3Ykhrb2RHaHBjeXdnVzEwdWMyeHBZMlV1WTJGc2JDaGhjbWQxYldWdWRITXNJREVwS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnlaWFIxY200N1hISmNibjFjY2x4dVhISmNibVY0Y0c5eWRDQmtaV1poZFd4MElFUmhkR1ZTWVc1blpWQnBZMnRsY2p0Y2NseHVJbDBzSW5OdmRYSmpaVkp2YjNRaU9pSWlmUT09IiwiaW1wb3J0IERhdGVSYW5nZVBpY2tlciwge0xPQ0tfVU5BVkFJTEFCTEUsIExPQ0tfTE9DS0VEfSBmcm9tICcuL2RhdGVyYW5nZXBpY2tlci13cmFwcGVyJztcclxuXHJcbmV4cG9ydCB7XHJcbiAgICBMT0NLX0xPQ0tFRCxcclxuICAgIExPQ0tfVU5BVkFJTEFCTEUsXHJcbn1cclxuXHJcbmZ1bmN0aW9uIERhdGVSYW5nZVBpY2tlckRyb3Bkb3duKCRlbGVtZW50LCBvcHRpb25zID0ge30pIHtcclxuICAgIC8vINGB0YHRi9C70LrQsCDQvdCwINGN0LrQt9C10LzQv9C70Y/RgFxyXG4gICAgaWYgKCRlbGVtZW50Lmluc3RhbmNlKSB7XHJcbiAgICAgICAgcmV0dXJuICRlbGVtZW50Lmluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC+0L/RgNC10LTQtdC70LXQvdC40LUg0LzQvtCx0LjQu9C60LhcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX2lzTW9iaWxlJywge1xyXG4gICAgICAgIGdldDogKCkgPT4gd2luZG93LmlubmVyV2lkdGggPD0gOTYwLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0LDQstGC0L7Qv9C+0LTRgtCy0LXRgNC20LTQtdC90LjQtSDQstGL0LHRgNCw0L3QvdGL0YUg0LTQsNGCXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ19hdXRvQXBwbHknLCB7XHJcbiAgICAgICAgZ2V0OiAoKSA9PiAhdGhpcy5faXNNb2JpbGUsXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLl8kZHJvcGRvd24gPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlci1kcm9wZG93blwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyLWRyb3Bkb3duX19oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXItZHJvcGRvd25fX2hlYWRlci1jbG9zZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAxNlwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTI0IDhMMiA4TTIgOEw4LjUgMTQuNU0yIDhMOC41IDEuNVwiIHN0cm9rZT1cImJsYWNrXCIgc3Ryb2tlLXdpZHRoPVwiMlwiLz5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlci1kcm9wZG93bl9faGVhZGVyLXRpdGxlXCI+0JTQsNGC0Ysg0L/QvtC10LfQtNC60Lg8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXItZHJvcGRvd25fX3dyYXBwZXJcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlci1kcm9wZG93bl9fZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyLWRyb3Bkb3duX19jb25maXJtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlci1kcm9wZG93bl9fY29uZmlybS1idXR0b25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAg0J/RgNC40LzQtdC90LjRgtGMXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+YFxyXG4gICAgKTtcclxuICAgIHRoaXMuXyRkcm9wZG93bldyYXBwZXIgPSB0aGlzLl8kZHJvcGRvd24ucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlci1kcm9wZG93bl9fd3JhcHBlcicpO1xyXG5cclxuICAgIC8vINGN0LvQtdC80LXQvdGC0YtcclxuICAgIHRoaXMuXyRlbGVtZW50ID0gJGVsZW1lbnQ7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8g0LzQvtCx0LjQu9C60LAgLy9cclxuICAgIC8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAvLyDQt9Cw0LrRgNGL0YLQuNC1INC80L7QtNCw0LvQutC4XHJcbiAgICB0aGlzLl8kY2xvc2UgPSB0aGlzLl8kZHJvcGRvd24ucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlci1kcm9wZG93bl9faGVhZGVyLWNsb3NlJyk7XHJcbiAgICBpZiAodGhpcy5fJGNsb3NlKSB7XHJcbiAgICAgICAgdGhpcy5fJGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbG9zZS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQutC+0L3RgtC10LnQvdC10YAg0LTQu9GPINGN0LvQtdC80LXQvdGC0LAg0LTQsNGC0LDQv9C40LrQtdGA0LBcclxuICAgIHRoaXMuXyRkcm9wZG93bkZvb3RlciAgICAgICAgPSB0aGlzLl8kZHJvcGRvd24ucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlci1kcm9wZG93bl9fZm9vdGVyJyk7XHJcbiAgICB0aGlzLl8kZHJvcGRvd25Db25maXJtQnV0dG9uID0gdGhpcy5fJGRyb3Bkb3duLnF1ZXJ5U2VsZWN0b3IoJy5EYXRlcmFuZ2VwaWNrZXItZHJvcGRvd25fX2NvbmZpcm0tYnV0dG9uJyk7XHJcblxyXG4gICAgLy8g0L7QsdC90L7QstC70LXQvdC40LUg0LLQuNC00LjQvNC+0YHRgtC4INGE0YPRgtC10YDQsCDQvNC+0LTQsNC70LrQuCDQv9GA0Lgg0L/RgNC+0LrRgNGD0YLQutC1XHJcbiAgICB0aGlzLl8kZHJvcGRvd25XcmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMudXBkYXRlRm9vdGVyVmlzaWJpbGl0eS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAvLyDQutC90L7Qv9C60LAg0L/QvtC00YLQstC10YDQttC00LXQvdC40Y9cclxuICAgIGlmICh0aGlzLl8kZHJvcGRvd25Db25maXJtQnV0dG9uKSB7XHJcbiAgICAgICAgdGhpcy5fJGRyb3Bkb3duQ29uZmlybUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYXBwbHkuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L3QsNGB0LvQtdC00YPQtdC80YHRj1xyXG4gICAgRGF0ZVJhbmdlUGlja2VyLmNhbGwodGhpcywgdGhpcy5fJGRyb3Bkb3duV3JhcHBlciwgT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge1xyXG4gICAgICAgIG1vbnRoc0NvdW50OiAyLFxyXG4gICAgICAgIHNpbmdsZU1vZGU6IGZhbHNlLFxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgICAgIDk2MDoge1xyXG4gICAgICAgICAgICAgICAgbW9udGhzQ291bnQ6IDEyLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICB9KSk7XHJcblxyXG4gICAgLy8g0L7QsdGR0YDRgtC60LAg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICB0aGlzLl8kZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl8kZHJvcGRvd24pO1xyXG4gICAgdGhpcy5fJGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkNsaWNrRXZlbnQuYmluZCh0aGlzKSk7XHJcbn1cclxuXHJcbi8vINGG0LXQv9C+0YfQutCwINC/0YDQvtGC0L7RgtC40L/QvtCyXHJcbkRhdGVSYW5nZVBpY2tlckRyb3Bkb3duLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZSwge1xyXG4gICAgY29uc3RydWN0b3I6IHtcclxuICAgICAgICB2YWx1ZTogRGF0ZVJhbmdlUGlja2VyRHJvcGRvd24sXHJcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC60L7QvNC/0L7QvdC10L3RgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXJEcm9wZG93bi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5pbml0LmNhbGwodGhpcyk7XHJcblxyXG4gICAgLy8g0L/Qu9Cw0LLQvdGL0LUg0LDQvdC40LzQsNGG0LjQuFxyXG4gICAgdGhpcy5fJGRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoJ2lzLWluaXRpYWxpemVkJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDQutC70LjQutCwINC90LAg0LrQvtC90YLQtdC50L3QtdGAXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXJEcm9wZG93bi5wcm90b3R5cGUuX29uQ2xpY2tFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMub3BlbigpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0LrQu9C40LrQsCDQstC90LUg0Y3Qu9C10LzQtdC90YLQsFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyRHJvcGRvd24ucHJvdG90eXBlLl9vbkRvY3VtZW50Q2xpY2tFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGlmICh0aGlzLl8kZHJvcGRvd24uY29udGFpbnMoZS50YXJnZXQpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2xvc2UoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0L7QutCw0Lcg0Y3Qu9C10LzQtdC90YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyRHJvcGRvd24ucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLl8kZHJvcGRvd24uY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1vcGVuZWQnKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuXyRkcm9wZG93bi5jbGFzc0xpc3QuYWRkKCdpcy1vcGVuZWQnKTtcclxuXHJcbiAgICAvLyDQvNC+0LHQuNC70LrQsFxyXG4gICAgaWYgKHRoaXMuX2lzTW9iaWxlKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1hY3RpdmUnKTtcclxuXHJcbiAgICAgICAgLy8g0L/RgNC+0LrRgNGD0YLQutCwINC00L4g0L/RgNC10LTQstGL0LHRgNCw0L3QvdGL0YUg0LTQsNGCXHJcbiAgICAgICAgY29uc3QgJGRheUZyb20gPSB0aGlzLl8kZHJvcGRvd24ucXVlcnlTZWxlY3RvcignLmlzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgICAgICBpZiAoJGRheUZyb20pIHtcclxuICAgICAgICAgICAgJGRheUZyb20uc2Nyb2xsSW50b1ZpZXcoe1xyXG4gICAgICAgICAgICAgICAgYmxvY2s6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC80LDQvdC40L/Rg9C70Y/RhtC40Lgg0YEg0LjRgdGC0L7RgNC40LXQuSDQsdGA0LDRg9C30LXRgNCwXHJcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHtcclxuICAgICAgICAgICAgZGF0ZXJhbmdlcGlja2VyOiB0cnVlLFxyXG4gICAgICAgIH0sICfQktGL0LHQvtGAINC00LDRgicpO1xyXG4gICAgICAgIHRoaXMuX29uUG9wU3RhdGVFdmVudEJpbmQgPSB0aGlzLl9vblBvcFN0YXRlRXZlbnQuYmluZCh0aGlzKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCB0aGlzLl9vblBvcFN0YXRlRXZlbnRCaW5kKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtCx0L3QvtCy0LvQtdC90LjQtSDQv9C+0LfQuNGG0LjQuCDQv9C+0LTRgdC60LDQt9C60LhcclxuICAgIHRoaXMuX3Rvb2x0aXBVcGRhdGUoKTtcclxuXHJcbiAgICAvLyDQv9C+0LfQstC+0LvRj9C10Lwg0YHQvtCx0YvRgtC40Y4g0LfQsNCy0LXRgNGI0LjRgtGM0YHRj1xyXG4gICAgaWYgKCF0aGlzLl9vbkRvY3VtZW50Q2xpY2tFdmVudEJpbmQpIHtcclxuICAgICAgICB0aGlzLl9vbkRvY3VtZW50Q2xpY2tFdmVudEJpbmQgPSB0aGlzLl9vbkRvY3VtZW50Q2xpY2tFdmVudC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uRG9jdW1lbnRDbGlja0V2ZW50QmluZCk7XHJcbiAgICAgICAgfSwgMCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60YDRi9GC0LjQtSDRjdC70LXQvNC10L3RgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXJEcm9wZG93bi5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICghdGhpcy5fJGRyb3Bkb3duLmNsYXNzTGlzdC5jb250YWlucygnaXMtb3BlbmVkJykpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LzQvtCx0LjQu9C60LBcclxuICAgIGlmICh0aGlzLl9pc01vYmlsZSkge1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnbW9kYWwtYWN0aXZlJyk7XHJcblxyXG4gICAgICAgIC8vINC80LDQvdC40L/Rg9C70Y/RhtC40Lgg0YEg0LjRgdGC0L7RgNC40LXQuSDQsdGA0LDRg9C30LXRgNCwXHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgdGhpcy5fb25Qb3BTdGF0ZUV2ZW50QmluZCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX29uRG9jdW1lbnRDbGlja0V2ZW50QmluZCkge1xyXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25Eb2N1bWVudENsaWNrRXZlbnRCaW5kKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fb25Eb2N1bWVudENsaWNrRXZlbnRCaW5kO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0L7Qt9Cy0L7Qu9GP0LXQvCDRgdC+0LHRi9GC0LjRjiDQt9Cw0LLQtdGA0YjQuNGC0YzRgdGPXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICB0aGlzLl8kZHJvcGRvd24uY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3BlbmVkJyk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fYXV0b0FwcGx5KSB7XHJcbiAgICAgICAgICAgIC8vINC90LXQvtCx0YXQvtC00LjQvNC+0YHRgtGMINGA0YPRh9C90L7Qs9C+INC/0L7QtNGC0LLQtdGA0LbQtNC10L3QuNGPINCy0YvQsdC+0YDQsCDQtNCw0YJcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2VuYWJsZVJhbmdlU2VsZWN0Q2FsbGJhY2s7XHJcblxyXG4gICAgICAgICAgICAvLyDQstGL0LHQuNGA0LDQtdC8INC/0L7RgdC70LXQtNC90LjQtSDQv9C+0LTRgtCy0LXRgNC20LTRkdC90L3Ri9C1INC00LDRgtGLXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9sYXN0QXBwbGllZERhdGVGcm9tICYmIHRoaXMuX2xhc3RBcHBsaWVkRGF0ZVRvKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tID0gdGhpcy5fbGFzdEFwcGxpZWREYXRlRnJvbTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byA9IHRoaXMuX2xhc3RBcHBsaWVkRGF0ZVRvO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX2xhc3RBcHBsaWVkRGF0ZUZyb20sIHRoaXMuX2xhc3RBcHBsaWVkRGF0ZVRvKTtcclxuICAgICAgICAgICAgICAgIH0sIDIwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LCAwKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INGB0LHRgNC+0YHQsCDQstGL0LTQtdC70LXQvdC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlckRyb3Bkb3duLnByb3RvdHlwZS5yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBEYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnJhbmdlUmVzZXQuY2FsbCh0aGlzKTtcclxuICAgIGNvbnNvbGUubG9nKCdyYW5nZVJlc2V0Jyk7XHJcblxyXG4gICAgLy8g0LLQuNC00LjQvNC+0YHRgtGMINC60L3QvtC/0LrQuCBcItCf0YDQuNC80LXQvdC40YLRjFwiINC90LAg0LzQvtCx0LjQu9C60LVcclxuICAgIHRoaXMudXBkYXRlRm9vdGVyVmlzaWJpbGl0eSgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JLRi9Cx0L7RgCDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXJEcm9wZG93bi5wcm90b3R5cGUucmFuZ2VTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIERhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucmFuZ2VTZWxlY3QuY2FsbCh0aGlzLCBkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG5cclxuICAgIC8vINCy0LjQtNC40LzQvtGB0YLRjCDQutC90L7Qv9C60LggXCLQn9GA0LjQvNC10L3QuNGC0YxcIiDQvdCwINC80L7QsdC40LvQutC1XHJcbiAgICB0aGlzLnVwZGF0ZUZvb3RlclZpc2liaWxpdHkoKTtcclxuXHJcbiAgICBpZiAodGhpcy5fYXV0b0FwcGx5KSB7XHJcbiAgICAgICAgdGhpcy5hcHBseSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogU2FmZSDQstGL0LfQvtCyINCy0L3QtdGI0L3QuNGFINGB0L7QsdGL0YLQuNC5INC60L7QvNC/0L7QvdC10L3RgtCwXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmINCY0LzRjyDRgdC+0LHRi9GC0LjRj1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyRHJvcGRvd24ucHJvdG90eXBlLl9jYWxsYmFjayA9IGZ1bmN0aW9uKGYpIHtcclxuICAgIC8vINC90LAg0LzQvtCx0LjQu9C60LUg0YHQvtCx0YvRgtC40LUgcmFuZ2VTZWxlY3Qg0LLRi9C30YvQstCw0LXRgtGB0Y8g0YLQvtC70YzQutC+INC/0L4g0LrQvdC+0L/QutC1IFwi0J/RgNC40LzQtdC90LjRgtGMXCJcclxuICAgIGlmICghdGhpcy5fYXV0b0FwcGx5ICYmIGYgPT0gJ3JhbmdlU2VsZWN0JyAmJiAhdGhpcy5fZW5hYmxlUmFuZ2VTZWxlY3RDYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBEYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9jYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG4vKipcclxuICog0J/QvtC00YLQstC10YDQttC00LXQvdC40LUg0LLRi9Cx0L7RgNCwINC00LDRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyRHJvcGRvd24ucHJvdG90eXBlLmFwcGx5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCBkYXRlX2Zyb20gPSB0aGlzLmdldERhdGVGcm9tKCk7XHJcbiAgICBjb25zdCBkYXRlX3RvICAgPSB0aGlzLmdldERhdGVUbygpO1xyXG5cclxuICAgIHRoaXMuX2xhc3RBcHBsaWVkRGF0ZUZyb20gPSBkYXRlX2Zyb207XHJcbiAgICB0aGlzLl9sYXN0QXBwbGllZERhdGVUbyAgID0gZGF0ZV90bztcclxuXHJcbiAgICBpZiAoIWRhdGVfZnJvbSB8fCAhZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvdCwINC80L7QsdC40LvQutC1INGB0L7QsdGL0YLQuNC1IHJhbmdlU2VsZWN0INCz0LvRg9GI0LjRgtGB0Y8g0YIu0LouINGC0YDQtdCx0YPQtdGC0YHRjyDQv9C+0LTRgtCy0LXRgNC20LTQtdC90LjQtSDQv9C+INC60L3QvtC/0LrQtSBcItCf0YDQuNC80LXQvdC40YLRjFwiXHJcbiAgICBpZiAoIXRoaXMuX2F1dG9BcHBseSkge1xyXG4gICAgICAgIHRoaXMuX2VuYWJsZVJhbmdlU2VsZWN0Q2FsbGJhY2sgPSB0cnVlO1xyXG4gICAgICAgIERhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucmFuZ2VTZWxlY3QuY2FsbCh0aGlzLCBkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuXyRlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnLCB7XHJcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcclxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxyXG4gICAgfSkpO1xyXG5cclxuICAgIHRoaXMuY2xvc2UoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0YtcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgINCU0LDRgtCwINCyINGE0L7RgNC80LDRgtC1IC0gOCDQvNCw0YDRgiwg0YfRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyRHJvcGRvd24ucHJvdG90eXBlLmdldERhdGVUaXRsZUZvcm1hdHRlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGlmICghZGF0ZSB8fCAhKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSkge1xyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtb250aCA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdydS1SVScsIHttb250aDogJ3Nob3J0J30pLmZvcm1hdChkYXRlKS5yZXBsYWNlKCcuJywgJycpO1xyXG4gICAgY29uc3Qgd2Vla2RheSA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KCdydS1SVScsIHt3ZWVrZGF5OiAnc2hvcnQnfSkuZm9ybWF0KGRhdGUpO1xyXG4gICAgcmV0dXJuIGRhdGUuZ2V0RGF0ZSgpICsgJyAnICsgbW9udGggKyAnLCA8Zm9udCBjb2xvcj1cIiM4QzhDOENcIj4nICsgd2Vla2RheSArICc8L2ZvbnQ+JztcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjRjyDRhNGD0YLQtdGA0LAg0LIg0LzQvtC00LDQu9C60LVcclxuICog0YHQutGA0YvQstCw0LXRgtGB0Y8g0L/RgNC4INC/0YDQvtC60YDRg9GC0LrQtSDQstCy0LXRgNGFINC4INC10YHQu9C4INC90LUg0LLRi9Cx0YDQsNC90Ysg0LTQsNGC0YtcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlckRyb3Bkb3duLnByb3RvdHlwZS51cGRhdGVGb290ZXJWaXNpYmlsaXR5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMuX2Ryb3Bkb3duQ29udGFpbmVyUHJldlNjcm9sbCA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRoaXMuX2Ryb3Bkb3duQ29udGFpbmVyUHJldlNjcm9sbCA9IHRoaXMuXyRkcm9wZG93bldyYXBwZXIuc2Nyb2xsVG9wO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGJvdGhEYXRlc1NlbGVjdGVkID0gISF0aGlzLmdldERhdGVGcm9tKCkgJiYgISF0aGlzLmdldERhdGVUbygpO1xyXG4gICAgY29uc3Qgc2Nyb2xsZWREb3duID0gdGhpcy5fZHJvcGRvd25Db250YWluZXJQcmV2U2Nyb2xsID49IHRoaXMuXyRkcm9wZG93bldyYXBwZXIuc2Nyb2xsVG9wO1xyXG4gICAgY29uc3QgaXNBY3RpdmUgPSBbXHJcbiAgICAgICAgYm90aERhdGVzU2VsZWN0ZWQsXHJcbiAgICAgICAgLy8gc2Nyb2xsZWREb3duLFxyXG4gICAgXS5ldmVyeSh2ID0+IHYpO1xyXG5cclxuICAgIHRoaXMuXyRkcm9wZG93bkZvb3Rlci5jbGFzc0xpc3QudG9nZ2xlKCdpcy1hY3RpdmUnLCBpc0FjdGl2ZSk7XHJcbiAgICB0aGlzLl9kcm9wZG93bkNvbnRhaW5lclByZXZTY3JvbGwgPSB0aGlzLl8kZHJvcGRvd25XcmFwcGVyLnNjcm9sbFRvcDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INC90LDQttCw0YLQuNGPINC60L3QvtC/0LrQuCBcItC90LDQt9Cw0LRcIiDQsiDQsdGA0LDRg9C30LXRgNC1XHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINCh0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXJEcm9wZG93bi5wcm90b3R5cGUuX29uUG9wU3RhdGVFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuY2xvc2UoKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGF0ZVJhbmdlUGlja2VyRHJvcGRvd247XHJcbiIsImltcG9ydCBEYXRlUmFuZ2VQaWNrZXIsIHtMT0NLX1VOQVZBSUxBQkxFLCBMT0NLX0xPQ0tFRH0gZnJvbSAnLi4vLi4vZGlzdC9kYXRlcmFuZ2VwaWNrZXInO1xyXG5cclxuZXhwb3J0IHtcclxuICAgIExPQ0tfTE9DS0VELFxyXG4gICAgTE9DS19VTkFWQUlMQUJMRSxcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0LvQsNGB0YEgLSDQvtCx0ZHRgNGC0LrQsCDQstC10L3QtNC+0YDQvdC+0LPQviDQutC+0LzQv9C+0L3QtdC90YLQsFxyXG4gKi9cclxuZnVuY3Rpb24gRGF0ZVJhbmdlUGlja2VyV3JhcHBlcigkZWxlbWVudCwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICAvLyDRgdGB0YvQu9C60LAg0L3QsCDRjdC60LfQtdC80L/Qu9GP0YBcclxuICAgIGlmICgkZWxlbWVudC5pbnN0YW5jZSkge1xyXG4gICAgICAgIHJldHVybiAkZWxlbWVudC5pbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQt9Cw0LHRgNC+0L3QuNGA0L7QstCw0L3QvdGL0LUg0LTQsNGC0YtcclxuICAgIHRoaXMuX2Jvb2tpbmdEYXRlcyA9IHt9O1xyXG5cclxuICAgIC8vINC90LDRgdC70LXQtNGD0LXQvNGB0Y9cclxuICAgIERhdGVSYW5nZVBpY2tlci5jYWxsKHRoaXMsICRlbGVtZW50LCBvcHRpb25zKTtcclxuXHJcbiAgICB0aGlzLl8kcGlja2VyLmNsYXNzTGlzdC5hZGQoJ0RhdGVyYW5nZXBpY2tlci13cmFwcGVyJyk7XHJcbn1cclxuXHJcbi8vINGG0LXQv9C+0YfQutCwINC/0YDQvtGC0L7RgtC40L/QvtCyXHJcbkRhdGVSYW5nZVBpY2tlcldyYXBwZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShEYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLCB7XHJcbiAgICBjb25zdHJ1Y3Rvcjoge1xyXG4gICAgICAgIHZhbHVlOiBEYXRlUmFuZ2VQaWNrZXJXcmFwcGVyLFxyXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgfVxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiDQpNC40LvRjNGC0YAg0YLQtdC60YHRgtCwINC/0L7QtNGB0LrQsNC30LrQuFxyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRheXMg0JrQvtC70LjRh9C10YHRgtCy0L4g0LLRi9Cx0YDQsNC90L3Ri9GFINC00L3QtdC5XHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlcldyYXBwZXIucHJvdG90eXBlLl9maWx0ZXJUb29sdGlwVGV4dCA9IGZ1bmN0aW9uKGRheXMpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmZpbHRlci50b29sdGlwVGV4dCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIudG9vbHRpcFRleHQuY2FsbCh0aGlzLCBkYXlzKSB8fCAnJztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBuaWdodHMgPSBkYXlzIC0gMTtcclxuICAgIHJldHVybiB0aGlzLnBsdXJhbChuaWdodHMsIFsnJWQg0L3QvtGH0YwnLCAnJWQg0L3QvtGH0LgnLCAnJWQg0L3QvtGH0LXQuSddKS5yZXBsYWNlKCclZCcsIG5pZ2h0cyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQt9Cw0LHRgNC+0L3QuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbiAqIEBwYXJhbSB7QXJyYXl9IGJvb2tpbmdEYXRlcyDQnNCw0YHRgdC40LIg0LTQsNGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXJXcmFwcGVyLnByb3RvdHlwZS5zZXRCb29raW5nRGF0ZXMgPSBmdW5jdGlvbihib29raW5nRGF0ZXMpIHtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KGJvb2tpbmdEYXRlcykpIHtcclxuICAgICAgICAvLyDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDQv9C+0LjRgdC60LBcclxuICAgICAgICBib29raW5nRGF0ZXMgPSBib29raW5nRGF0ZXMucmVkdWNlKChhY2MsIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBpdGVtID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gbmV3IERhdGUoaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpdGVtIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgICAgICAgICAgICAgIGFjY1tpdGVtXSA9IGl0ZW07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgICAgfSwge30pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2Jvb2tpbmdEYXRlcyA9IGJvb2tpbmdEYXRlcztcclxuXHJcbiAgICAvLyDQvtCx0L3QvtCy0LvQtdC90LjQtSDRgNC10L3QtNC10YDQsFxyXG4gICAgdGhpcy51cGRhdGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0LjQu9GM0YLRgCDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbiAqIEBwYXJhbSAge0RhdGV9ICAgZGF0ZSDQlNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9ICAgICAg0J7QtNC90LAg0LjQtyDQutC+0L3RgdGC0LDQvdGCIExPQ0tfLi4uXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXJXcmFwcGVyLnByb3RvdHlwZS5fZmlsdGVyTG9ja0RheXMgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAvLyDQt9Cw0LHRgNC+0L3QuNGA0L7QstCw0L3QvlxyXG4gICAgaWYgKHRoaXMuX2Jvb2tpbmdEYXRlc1tkYXRlXSkge1xyXG4gICAgICAgIHJldHVybiBMT0NLX0xPQ0tFRDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fZmlsdGVyTG9ja0RheXMuY2FsbCh0aGlzLCBkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LjQt9GD0LDQu9GM0L3QvtC1INCy0YvQtNC10LvQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlcldyYXBwZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fcmFuZ2VWaXN1YWxTZWxlY3QuY2FsbCh0aGlzLCBkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG5cclxuICAgIHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLk1vbnRoJykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgICRtb250aC5xdWVyeVNlbGVjdG9yQWxsKCcuV2VlaycpLmZvckVhY2goJHdlZWsgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkc2VsZWN0ZWQgPSAkd2Vlay5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5LmlzLXNlbGVjdGVkLCAuRGF5LmlzLXNlbGVjdGVkLWJldHdlZW4nKTtcclxuICAgICAgICAgICAgbGV0ICR3cmFwcGVyID0gJHdlZWsucXVlcnlTZWxlY3RvcignLkRheXNfX3NlbGVjdGVkJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJHdyYXBwZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Vud3JhcERheXNTZWxlY3RlZCgkd3JhcHBlcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghJHNlbGVjdGVkLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICR3cmFwcGVyID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoJzxkaXYgY2xhc3M9XCJEYXlzX19zZWxlY3RlZFwiPjwvZGl2PicpO1xyXG4gICAgICAgICAgICAkd2Vlay5pbnNlcnRCZWZvcmUoJHdyYXBwZXIsICRzZWxlY3RlZFswXSk7XHJcblxyXG4gICAgICAgICAgICAkc2VsZWN0ZWQuZm9yRWFjaCgkZGF5ID0+IHtcclxuICAgICAgICAgICAgICAgICR3cmFwcGVyLmFwcGVuZENoaWxkKCRkYXkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlcldyYXBwZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBEYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFJlc2V0LmNhbGwodGhpcyk7XHJcblxyXG4gICAgdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5c19fc2VsZWN0ZWQnKS5mb3JFYWNoKHRoaXMuX3Vud3JhcERheXNTZWxlY3RlZCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9C10YDQtdC90L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNC90LXQuSDQuNC3INC60L7QvdGC0LXQudC90LXRgNCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXJXcmFwcGVyLnByb3RvdHlwZS5fdW53cmFwRGF5c1NlbGVjdGVkID0gZnVuY3Rpb24oJHdyYXBwZXIpIHtcclxuICAgIHdoaWxlICgkd3JhcHBlci5maXJzdEVsZW1lbnRDaGlsZCkge1xyXG4gICAgICAgICR3cmFwcGVyLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKCR3cmFwcGVyLmZpcnN0RWxlbWVudENoaWxkLCAkd3JhcHBlcik7XHJcbiAgICB9XHJcblxyXG4gICAgJHdyYXBwZXIucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCgkd3JhcHBlcik7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGVSYW5nZVBpY2tlcldyYXBwZXI7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgRGF0ZVJhbmdlUGlja2VyLCB7TE9DS19VTkFWQUlMQUJMRSwgTE9DS19MT0NLRUR9IGZyb20gJy4uLy4uL2Rpc3QvZGF0ZXJhbmdlcGlja2VyJztcclxuaW1wb3J0IERhdGVSYW5nZVBpY2tlckRyb3Bkb3duIGZyb20gJy4vZGF0ZXJhbmdlcGlja2VyLWRyb3Bkb3duJztcclxuXHJcbmNvbnN0ICRmb3JtICAgICAgICAgPSBkb2N1bWVudC5mb3Jtc1swXTtcclxuY29uc3QgJGZvcm1Ecm9wZG93biA9IGRvY3VtZW50LmZvcm1zWzFdO1xyXG5cclxuLy8g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9C1INC00LDRgtGLXHJcbmNvbnN0IGJsb2NrZWREYXRlcyA9IHt9O1xyXG5jb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgKytpKSB7XHJcbiAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNikge1xyXG4gICAgICAgIGJsb2NrZWREYXRlc1tkYXRlXSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyAxKTtcclxufVxyXG5cclxubmV3IERhdGVSYW5nZVBpY2tlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGF0ZXJhbmdlcGlja2VyJyksIHtcclxuICAgIG1pbkRhdGU6IG5ldyBEYXRlKCksXHJcbiAgICBtYXhEYXRlOiBuZXcgRGF0ZSgnMjAyMi0wNS0yMCcpLFxyXG4gICAgbW9udGhzQ291bnQ6IDIsXHJcbiAgICBwZXJSb3c6IDMsXHJcbiAgICBzaW5nbGVNb2RlOiBmYWxzZSxcclxuICAgIGludGVybmFsSW5wdXRzOiBmYWxzZSxcclxuICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgOTYwOiB7XHJcbiAgICAgICAgICAgIG1vbnRoc0NvdW50OiAxMixcclxuICAgICAgICB9LFxyXG4gICAgICAgIDcyMDoge1xyXG4gICAgICAgICAgICBtb250aHNDb3VudDogMyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIDQ4MDoge1xyXG4gICAgICAgICAgICBtb250aHNDb3VudDogMSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIG9uOiB7XHJcbiAgICAgICAgcmFuZ2VTZWxlY3Q6IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgICAgICAkZm9ybS5lbGVtZW50c1snZGF0ZV9mcm9tJ10udmFsdWUgPSBkYXRlX2Zyb20udG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICRmb3JtLmVsZW1lbnRzWydkYXRlX3RvJ10udmFsdWUgICA9IGRhdGVfdG8udG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXlTZWxlY3Q6IGZ1bmN0aW9uKGRhdGVfZnJvbSkge1xyXG4gICAgICAgICAgICAkZm9ybS5lbGVtZW50c1snZGF0ZV9mcm9tJ10udmFsdWUgPSBkYXRlX2Zyb20udG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBmaWx0ZXI6IHtcclxuICAgICAgICBsb2NrRGF5czogZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgICAgICBpZiAoYmxvY2tlZERhdGVzW2RhdGVdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTE9DS19MT0NLRUQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRvb2x0aXBUZXh0OiBmdW5jdGlvbihkYXlzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5pZ2h0cyA9IGRheXMgLSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wbHVyYWwobmlnaHRzLCBbJyVkINC90L7Rh9GMJywgJyVkINC90L7Rh9C4JywgJyVkINC90L7Rh9C10LknXSkucmVwbGFjZSgnJWQnLCBuaWdodHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG5jb25zdCBkcm9wZG93biA9IG5ldyBEYXRlUmFuZ2VQaWNrZXJEcm9wZG93bihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGF0ZXJhbmdlcGlja2VyLWRyb3Bkb3duJyksIHtcclxuICAgIG1pbkRhdGU6IG5ldyBEYXRlKCksXHJcbiAgICBtYXhEYXRlOiBuZXcgRGF0ZSgnMjAyMi0wNS0yMCcpLFxyXG4gICAgbW9udGhzQ291bnQ6IDIsXHJcbiAgICBwZXJSb3c6IDMsXHJcbiAgICBzaW5nbGVNb2RlOiBmYWxzZSxcclxuICAgIGludGVybmFsSW5wdXRzOiBmYWxzZSxcclxuICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgOTYwOiB7XHJcbiAgICAgICAgICAgIG1vbnRoc0NvdW50OiAxMixcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIG9uOiB7XHJcbiAgICAgICAgcmFuZ2VTZWxlY3Q6IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgICAgICAkZm9ybURyb3Bkb3duLmVsZW1lbnRzWydkYXRlX2Zyb20nXS52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX2Zyb20sICdZLW0tZCcpO1xyXG4gICAgICAgICAgICAkZm9ybURyb3Bkb3duLmVsZW1lbnRzWydkYXRlX3RvJ10udmFsdWUgPSB0aGlzLmZvcm1hdERhdGUoZGF0ZV90bywgJ1ktbS1kJyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXlTZWxlY3Q6IGZ1bmN0aW9uKGRhdGVfZnJvbSkge1xyXG4gICAgICAgICAgICAkZm9ybURyb3Bkb3duLmVsZW1lbnRzWydkYXRlX2Zyb20nXS52YWx1ZSA9IGRhdGVfZnJvbS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGZpbHRlcjoge1xyXG4gICAgICAgIGxvY2tEYXlzOiBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgICAgIGlmIChibG9ja2VkRGF0ZXNbZGF0ZV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBMT0NLX0xPQ0tFRDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG9vbHRpcFRleHQ6IGZ1bmN0aW9uKGRheXMpIHtcclxuICAgICAgICAgICAgY29uc3QgbmlnaHRzID0gZGF5cyAtIDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsdXJhbChuaWdodHMsIFsnJWQg0L3QvtGH0YwnLCAnJWQg0L3QvtGH0LgnLCAnJWQg0L3QvtGH0LXQuSddKS5yZXBsYWNlKCclZCcsIG5pZ2h0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuXHJcbi8vINC30LDQsdGA0L7QvdC40YDQvtCy0LDQvdC90YvQtSDQtNC90LhcclxuY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcclxuY29uc3QgYm9va2luZ0RhdGVzID0gW107XHJcbmZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyArK2kpIHtcclxuICAgIGlmICh+WzQsIDVdLmluZGV4T2YoZGF5LmdldERheSgpKSkge1xyXG4gICAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGQuc2V0VGltZShkYXkuZ2V0VGltZSgpKTtcclxuICAgICAgICBib29raW5nRGF0ZXMucHVzaChkKTtcclxuICAgIH1cclxuXHJcbiAgICBkYXkuc2V0RGF0ZShkYXkuZ2V0RGF0ZSgpICsgMSk7XHJcbn1cclxuXHJcbmRyb3Bkb3duLnNldEJvb2tpbmdEYXRlcyhib29raW5nRGF0ZXMpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9