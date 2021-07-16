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
    this._selection = {};

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
        this.rangeReset();
        this._selection.date_from = new Date(parseInt($day.dataset.time, 10))
        $day.classList.add('is-selected');
        this._callback('daySelect', this._selection.date_from);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9zY3NzL2luZGV4LnNjc3M/NTYxOCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9zcmMvanMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87O1VDVkE7VUFDQTs7Ozs7V0NEQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7OztBQ05BOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNPO0FBQ0E7O0FBRVA7QUFDQTs7QUFFQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxrQkFBa0I7QUFDM0I7QUFDQTtB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IHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJEYXRlcmFuZ2VwaWNrZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8g0YHQvtGB0YLQvtGP0L3QuNGPINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuZXhwb3J0IGNvbnN0IExPQ0tfVU5BVkFJTEFCTEUgPSAxO1xyXG5leHBvcnQgY29uc3QgTE9DS19MT0NLRUQgICAgICA9IDI7XHJcblxyXG5jb25zdCBJTkRFWF9EQVRFX0ZST00gPSAwO1xyXG5jb25zdCBJTkRFWF9EQVRFX1RPICAgPSAxO1xyXG5cclxuZnVuY3Rpb24gRGF0ZVJhbmdlUGlja2VyKCRjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgLy8g0L7RgiDQv9C+0LLRgtC+0YDQvdC+0Lkg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40LhcclxuICAgIGlmICgkY29udGFpbmVyLmluc3RhbmNlKSB7XHJcbiAgICAgICAgcmV0dXJuICRjb250YWluZXIuaW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICAkY29udGFpbmVyLmluc3RhbmNlID0gdGhpcztcclxuXHJcbiAgICB0aGlzLl8kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcclxuXHJcbiAgICAvLyDQt9C90LDRh9C10L3QuNC1INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAgICBjb25zdCBkdiA9ICh4LCB2KSA9PiB0eXBlb2YgeCA9PSAndW5kZWZpbmVkJyA/IHYgOiB4O1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IHtcclxuICAgICAgICBmaXJzdERheU9mVGhlV2VlazogZHYob3B0aW9ucy5maXJzdERheU9mVGhlV2VlaywgMSksIC8vINC/0LXRgNCy0YvQuSDQtNC10L3RjCDQvdC10LTQtdC70LgsIDAgPSDQstGBLCAxID0g0L/QvSwgLi4uXHJcbiAgICAgICAgc2luZ2xlTW9kZTogICAgICAgIGR2KG9wdGlvbnMuc2luZ2xlTW9kZSwgZmFsc2UpLCAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0Ysg0LLQvNC10YHRgtC+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgIGxvY2FsZTogICAgICAgICAgICBkdihvcHRpb25zLmxvY2FsZSwgJ3J1LVJVJyksXHJcbiAgICAgICAgbWluRGF5czogICAgICAgICAgIGR2KG9wdGlvbnMubWluRGF5cywgMSksICAgICAgICAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC00LjQsNC/0LDQt9C+0L3QtVxyXG4gICAgICAgIG1vbnRoc0NvdW50OiAgICAgICBkdihvcHRpb25zLm1vbnRoc0NvdW50LCAxMiksXHJcbiAgICAgICAgcGVyUm93OiAgICAgICAgICAgIGR2KG9wdGlvbnMucGVyUm93LCB1bmRlZmluZWQpLCAgICAvLyDQutC+0LvQuNGH0LXRgdGC0LLQviDQvNC10YHRj9GG0LXQsiDQsiDRgNGP0LTRg1xyXG4gICAgICAgIG1pbkRhdGU6ICAgICAgICAgICBkdihvcHRpb25zLm1pbkRhdGUsIG5ldyBEYXRlKCkpLCAgLy8g0LzQuNC90LjQvNCw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICAgIG1heERhdGU6ICAgICAgICAgICBkdihvcHRpb25zLm1heERhdGUsIHVuZGVmaW5lZCksXHJcbiAgICAgICAgYnJlYWtwb2ludHM6ICAgICAgIGR2KG9wdGlvbnMuYnJlYWtwb2ludHMsIHt9KSxcclxuICAgICAgICBpbnRlcm5hbElucHV0czogICAgZHYob3B0aW9ucy5pbnRlcm5hbElucHV0cywgdHJ1ZSksIC8vINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1INCy0YHRgtGA0L7QtdC90L3Ri9GFINC40L3Qv9GD0YLQvtCyXHJcbiAgICAgICAgLy8g0YHQvtCx0YvRgtC40Y9cclxuICAgICAgICBvbjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIHJhbmdlU2VsZWN0OiBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICAgICAgICBkYXlTZWxlY3Q6ICAgbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC+0LTQvdC+0Lkg0LTQsNGC0YsgKNGC0L7Qu9GM0LrQviDQv9GA0Lggc2luZ2xlTW9kZTogdHJ1ZSlcclxuICAgICAgICB9LCBvcHRpb25zLm9uIHx8IHt9KSxcclxuICAgICAgICAvLyDRhNC40LvRjNGC0YDRg9GO0YnQuNC1INC80LXRgtC+0LTRi1xyXG4gICAgICAgIGZpbHRlcjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIGxvY2tEYXlzOiAgICBudWxsLCAvLyBjYWxsYmFjayhkYXRlKSDRhNGD0L3QutGG0LjRjyDQsdC70L7QutC40YDQvtCy0LDQvdC40Y8g0LTQsNGCLCB0cnVlL0xPQ0tcclxuICAgICAgICAgICAgdG9vbHRpcFRleHQ6IG51bGwsIC8vIGNhbGxiYWNrKGRheXMpINCy0YvQstC+0LQg0YLQtdC60YHRgtCwINC/0L7QtNGB0LrQsNC30LrQuFxyXG4gICAgICAgIH0sIG9wdGlvbnMuZmlsdGVyIHx8IHt9KSxcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXQoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINGA0Y/QtNC90L7RgdGC0YxcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnBlclJvdyA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5wZXJSb3cgPSB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5taW5EYXRlKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm1pbkRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7Qv9GG0LjQuCDQtNC70Y8g0Y3QutGA0LDQvdC+0LIg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICAgIHRoaXMub3B0aW9ucy5icmVha3BvaW50c1t0aGlzLl9icmVha3BvaW50ID0gMF0gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuICAgIC8vINGC0LXQutGD0YnQuNC5INC00LXQvdGMXHJcbiAgICB0aGlzLl90b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICB0aGlzLl90b2RheS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICB0aGlzLl8kcGlja2VyID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJcIj5cclxuICAgICAgICAgICAgJHt0aGlzLm9wdGlvbnMuaW50ZXJuYWxJbnB1dHMgP1xyXG4gICAgICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX2lucHV0c1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICR7dGhpcy5vcHRpb25zLnNpbmdsZU1vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyBgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZVwiPmBcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV9mcm9tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImRhdGVfdG9cIj5gXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+YCA6ICcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXBcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXAtY29udGVudFwiPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGN0LvQtdC80LXQvdGC0YtcclxuICAgIHRoaXMuXyRtb250aHMgICAgICAgICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzJyk7XHJcbiAgICB0aGlzLl8kdG9vbHRpcCAgICAgICAgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5EYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXAnKTtcclxuICAgIHRoaXMuXyR0b29sdGlwQ29udGVudCA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcC1jb250ZW50Jyk7XHJcblxyXG4gICAgLy8g0L/QvtC70Y8g0LLQstC+0LTQsFxyXG4gICAgdGhpcy5fJGlucHV0cyA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZV49XCJkYXRlXCJdJyk7XHJcblxyXG4gICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24gPSB7fTtcclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YBcclxuICAgIHRoaXMuX3NlbGVjdERhdGUodGhpcy5vcHRpb25zLm1pbkRhdGUpO1xyXG4gICAgdGhpcy5fJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl8kcGlja2VyKTtcclxuXHJcbiAgICAvLyDQvtCx0YDQsNCx0L7RgtC60LAg0LHRgNC10LnQutC/0L7QuNC90YLQvtCyXHJcbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzKS5sZW5ndGgpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fb25XaW5kb3dSZXNpemVFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLl9vbldpbmRvd1Jlc2l6ZUV2ZW50KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQndCw0LfQstCw0L3QuNC1INC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldE1vbnRoRm9ybWF0dGVkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgdGl0bGUgPSB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHttb250aDogJ2xvbmcnfSk7XHJcbiAgICByZXR1cm4gdGl0bGUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKSArIHRpdGxlLnNsaWNlKDEpO1xyXG59XHJcblxyXG4vKipcclxuICog0KTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90LjQtSDQtNCw0YLRiyDQtNC70Y8g0YLQtdC60YPRidC10Lkg0LvQvtC60LDQu9C4XHJcbiAqIEBwYXJhbSAge0RhdGV9ICAgZGF0ZSAgICDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zINCf0LDRgNCw0LzQtdGC0YDRi1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGVUaW1lRm9ybWF0ID0gZnVuY3Rpb24oZGF0ZSwgb3B0aW9ucykge1xyXG4gICAgcmV0dXJuIEludGwuRGF0ZVRpbWVGb3JtYXQodGhpcy5vcHRpb25zLmxvY2FsZSwgb3B0aW9ucykuZm9ybWF0KGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0JTQvdC4INC90LXQtNC10LvQuFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRXZWVrRGF5c0Zvcm1hdHRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAyKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgKytpKSB7XHJcbiAgICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICBkYXk6IGRhdGUuZ2V0RGF5KCksXHJcbiAgICAgICAgICAgIHRpdGxlOiB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHt3ZWVrZGF5OiAnc2hvcnQnfSksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0YHQvtCz0LvQsNGB0L3QviDQvdCw0YHRgtGA0L7QtdC90L3QvtC80YMg0L/QtdGA0LLQvtC80YMg0LTQvdGOINC90LXQtNC10LvQuFxyXG4gICAgcmVzdWx0LnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICBjb25zdCBmaXJzdERheU9mVGhlV2VlayA9IHRoaXMub3B0aW9ucy5maXJzdERheU9mVGhlV2VlayAlIDc7XHJcbiAgICAgICAgbGV0IGRheUEgPSBhLmRheTtcclxuICAgICAgICBsZXQgZGF5QiA9IGIuZGF5O1xyXG5cclxuICAgICAgICBpZiAoZGF5QSA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QiA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlBIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgZGF5QSArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUIgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICBkYXlCICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGF5QSAtIGRheUI7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vKipcclxuICog0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LzQtdGB0Y/RhtC1XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge051bWJlcn0gICAg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF5c0NvdW50SW5Nb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IGRheXMgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF5cy5zZXRNb250aChkYXlzLmdldE1vbnRoKCkgKyAxKTtcclxuICAgIGRheXMuc2V0RGF0ZSgwKTtcclxuICAgIHJldHVybiBkYXlzLmdldERhdGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnJhbmdlUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsUmVzZXQoKTtcclxuICAgIHRoaXMuX3NlbGVjdGlvbiA9IHt9O1xyXG59XHJcblxyXG4vKipcclxuICog0JLRi9C00LXQu9C10L3QuNC1INC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucmFuZ2VTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGlmICghKGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUpIHx8ICEoZGF0ZV90byBpbnN0YW5jZW9mIERhdGUpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgaWYgKCF0aGlzLmdldElzUmFuZ2VTZWxlY3RhYmxlKGRhdGVfZnJvbSwgZGF0ZV90bykpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INGN0LvQtdC80LXQvdGC0L7QslxyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QoZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuXHJcbiAgICAvLyDRgdC+0YXRgNCw0L3QtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Y9cclxuICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBkYXRlX2Zyb207XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byAgID0gZGF0ZV90bztcclxuXHJcbiAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1XHJcbiAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7QsdC90L7QstC70LXQvdC40LUg0LjQvdC/0YPRgtC+0LJcclxuICAgIGlmICh0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfRlJPTV0pIHtcclxuICAgICAgICB0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfRlJPTV0udmFsdWUgPSB0aGlzLmZvcm1hdERhdGUoZGF0ZV9mcm9tKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fJGlucHV0c1tJTkRFWF9EQVRFX1RPXSkge1xyXG4gICAgICAgIHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9UT10udmFsdWUgPSB0aGlzLmZvcm1hdERhdGUoZGF0ZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtCx0YvRgtC40LVcclxuICAgIHRoaXMuX2NhbGxiYWNrKCdyYW5nZVNlbGVjdCcsIGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INC00LDRgtGLXHJcbiAqIEBwYXJhbSAge0RhdGV9ICAgZGF0ZSAgINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZvcm1hdCDQpNC+0YDQvNCw0YIg0YHRgtGA0L7QutC4XHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUsIGZvcm1hdCA9ICdZLW0tZCcpIHtcclxuICAgIGlmICghKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UoJ1knLCBkYXRlLmdldEZ1bGxZZWFyKCkpXHJcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ20nLCAoJzAnICsgKGRhdGUuZ2V0TW9udGgoKSArIDEpKS5zbGljZSgtMikpXHJcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ2QnLCAoJzAnICsgKGRhdGUuZ2V0RGF0ZSgpKSkuc2xpY2UoLTIpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0YDQvtCy0LXRgNC60LAg0LLQvtC30LzQvtC20L3QvtGB0YLQuCDQstGL0LTQtdC70LXQvdC40Y8g0LTQsNGCXHJcbiAqIEBwYXJhbSAge0RhdGUgZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0gIHtEYXRlIGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldElzUmFuZ2VTZWxlY3RhYmxlID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3Ri9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhkYXRlX2Zyb20uZ2V0VGltZSgpIC0gZGF0ZV90by5nZXRUaW1lKCkpIC8gMTAwMCAvIDg2NDAwO1xyXG4gICAgaWYgKGRpZmYgPCB0aGlzLm9wdGlvbnMubWluRGF5cykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9GA0L7QstC10YDQutCwINC/0L7Qv9Cw0LTQsNC90LjRjyDQsiDQtNC40LDQv9Cw0LfQvtC9INC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKCk7XHJcbiAgICBkYXkuc2V0VGltZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuXHJcbiAgICB3aGlsZSAoZGF5IDwgZGF0ZV90bykge1xyXG4gICAgICAgIGlmICh0aGlzLl9maWx0ZXJMb2NrRGF5cyhkYXkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRheS5zZXREYXRlKGRheS5nZXREYXRlKCkgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQsdGA0LDQvdC90LDRjyDQvdCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHJldHVybiB7RGF0ZX0g0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZUZyb20gPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINC90LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsCDQvdC1INGD0LrQsNC30LDQvdCwXHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwINC/0L7Qt9C20LUg0LrQvtC90LXRh9C90L7QuVxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQsdGA0LDQvdC90LDRjyDQtNCw0YLQsCAoc2luZ2xlTW9kZTogdHJ1ZSlcclxuICogQHJldHVybiB7RGF0ZX0g0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZSA9IERhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZUZyb207XHJcblxyXG4vKipcclxuICog0JLRi9Cx0YDQsNC90L3QsNGPINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICogQHJldHVybiB7RGF0ZX0g0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZVRvID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyDQutC+0L3QtdGH0L3QsNGPINC00LDRgtCwINC90LUg0YPQutCw0LfQsNC90LBcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwINC/0L7Qt9C20LUg0LrQvtC90LXRh9C90L7QuVxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA+IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb207XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQutC70L7QvdC10L3QuNC1ICgxINCx0L7QsdGR0YAsIDIg0LHQvtCx0YDQsCwgNSDQsdC+0LHRgNC+0LIpXHJcbiAqIEBwYXJhbSAge051bWJlcn0gdmFsdWUg0JrQvtC70LjRh9C10YHRgtCy0L5cclxuICogQHBhcmFtICB7QXJyYXl9ICBmb3JtcyDQnNCw0YHRgdC40LIg0LjQtyAz0YUg0Y3Qu9C10LzQtdC90YLQvtCyLCDQvNC+0LbQtdGCINGB0L7QtNC10YDQttCw0YLRjCDRgdC/0LXRhtC40YTQuNC60LDRgtC+0YAgJWQg0LTQu9GPINC30LDQvNC10L3Ri1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnBsdXJhbCA9IGZ1bmN0aW9uICh2YWx1ZSwgZm9ybXMpIHtcclxuICAgIHJldHVybiAodmFsdWUgJSAxMCA9PSAxICYmIHZhbHVlICUgMTAwICE9IDExID8gZm9ybXNbMF0gOiAodmFsdWUgJSAxMCA+PSAyICYmIHZhbHVlICUgMTAgPD0gNCAmJiAodmFsdWUgJSAxMDAgPCAxMCB8fCB2YWx1ZSAlIDEwMCA+PSAyMCkgPyBmb3Jtc1sxXSA6IGZvcm1zWzJdKSkucmVwbGFjZSgnJWQnLCB2YWx1ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQuNCw0L/QsNC30L7QvdCwINC80LXRgdGP0YbQtdCyXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZU1vbnRocyA9IGZ1bmN0aW9uKGRhdGVfZnJvbSkge1xyXG4gICAgd2hpbGUgKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCkge1xyXG4gICAgICAgIHRoaXMuXyRtb250aHMucmVtb3ZlQ2hpbGQodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9GA0Y/Rh9C10Lwg0L/QvtC00YHQutCw0LfQutGDXHJcbiAgICB0aGlzLl90b29sdGlwSGlkZSgpO1xyXG5cclxuICAgIC8vINC/0YDQtdGA0LXQvdC00LXRgCDQvNC10YHRj9GG0LXQslxyXG4gICAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuICAgIGNvbnN0ICRtb250aHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50OyArK2kpIHtcclxuICAgICAgICAkbW9udGhzLnB1c2godGhpcy5fJGNyZWF0ZU1vbnRoKGN1cnJlbnREYXRlKSk7XHJcbiAgICAgICAgY3VycmVudERhdGUuc2V0TW9udGgoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkbW9udGhzLmxlbmd0aDsgaSArPSB0aGlzLm9wdGlvbnMucGVyUm93KSB7XHJcbiAgICAgICAgY29uc3QgJHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICRyb3cuY2xhc3NOYW1lID0gJ0RhdGVyYW5nZXBpY2tlcl9fcm93JztcclxuXHJcbiAgICAgICAgJG1vbnRocy5zbGljZShpLCBpICsgdGhpcy5vcHRpb25zLnBlclJvdykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgICAgICAkcm93LmFwcGVuZENoaWxkKCRtb250aCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuXyRtb250aHMuYXBwZW5kQ2hpbGQoJHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSDQnNC10YHRj9GGXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCBjdXJyZW50TW9udGggPSBkYXRlLmdldE1vbnRoKCk7XHJcbiAgICBjb25zdCBtb250aFRpdGxlID0gdGhpcy5nZXRNb250aEZvcm1hdHRlZChkYXRlKTtcclxuICAgIGNvbnN0IHdlZWtEYXlzID0gdGhpcy5nZXRXZWVrRGF5c0Zvcm1hdHRlZCgpO1xyXG5cclxuICAgIGNvbnN0ICRtb250aCA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiTW9udGhcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2hlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLXByZXYkeyh0aGlzLm9wdGlvbnMubWluRGF0ZSAmJiBkYXRlIDw9IHRoaXMub3B0aW9ucy5taW5EYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTcgMTNMMSA3TDcgMVwiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX3RpdGxlXCI+JHttb250aFRpdGxlfSAke2RhdGUuZ2V0RnVsbFllYXIoKX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fYXJyb3cgTW9udGhfX2Fycm93LS1uZXh0JHsodGhpcy5vcHRpb25zLm1heERhdGUgJiYgZGF0ZSA+PSB0aGlzLm9wdGlvbnMubWF4RGF0ZSkgPyAnIGlzLWRpc2FibGVkJyA6ICcnfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xIDAuOTk5OTk5TDcgN0wxIDEzXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla1wiPiR7d2Vla0RheXMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtkYXlcIj4ke2l0ZW0udGl0bGV9PC9kaXY+YFxyXG4gICAgICAgICAgICB9KS5qb2luKCcnKX08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19kYXlzXCI+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyDRgdGC0YDQtdC70LrQuFxyXG4gICAgW1xyXG4gICAgICAgIHtzZWxlY3RvcjogJy5Nb250aF9fYXJyb3ctLXByZXYnLCBuYW1lOiAncHJldid9LFxyXG4gICAgICAgIHtzZWxlY3RvcjogJy5Nb250aF9fYXJyb3ctLW5leHQnLCBuYW1lOiAnbmV4dCd9LFxyXG4gICAgXS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIGNvbnN0ICRhcnJvdyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKGl0ZW0uc2VsZWN0b3IpO1xyXG4gICAgICAgICRhcnJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgICAgICAvLyDQstGA0LXQvNC10L3QvdCw0Y8g0LzQtdGA0LAsINC70YPRh9GI0LUg0L/QtdGA0LXQstC10YDRgdGC0LDRgtGMLCDQstGL0L3QtdGB0YLQuCDRgdGC0YDQtdC70LrQuCDQt9CwINC/0YDQtdC00LXQu9GLINC/0LXRgNC10YDQtdGA0LjRgdC+0LLRi9Cy0LDQtdC80L7QuSDQvtCx0LvQsNGB0YLQuCDQv9C40LrQtdGA0LBcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX29uQXJyb3dDbGljaygkYXJyb3csIGl0ZW0ubmFtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YAg0LTQvdC10LlcclxuICAgIGNvbnN0ICRkYXlzID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aF9fZGF5cycpO1xyXG4gICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgIGRheXMuc2V0RGF0ZSgxKTtcclxuICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgd2hpbGUgKGRheXMuZ2V0TW9udGgoKSA9PSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVXZWVrKCk7XHJcblxyXG4gICAgICAgIHdlZWtEYXlzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXlzLmdldERheSgpICE9IGl0ZW0uZGF5IHx8IGRheXMuZ2V0TW9udGgoKSAhPSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVFbXB0eURheSgpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZURheShkYXlzKSk7XHJcbiAgICAgICAgICAgIGRheXMuc2V0RGF0ZShkYXlzLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkZGF5cy5hcHBlbmRDaGlsZCgkd2Vlayk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICRtb250aDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0LvQuNC6INC/0L4g0YHRgtGA0LXQu9C60LUg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPINC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRhcnJvdyBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lICAgINCY0LzRjyAocHJldiwgbmV4dClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uQXJyb3dDbGljayA9IGZ1bmN0aW9uKCRhcnJvdywgbmFtZSkge1xyXG4gICAgaWYgKCRhcnJvdy5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLk1vbnRoJykuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyAobmFtZSA9PSAncHJldicgPyAtdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50IDogdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KSk7XHJcblxyXG4gICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LjQvdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1pbkRhdGUuZ2V0VGltZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0YXQvtC0INC30LAg0L/RgNC10LTQtdC70Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICBjb25zdCBlbmREYXRlID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGVuZERhdGUuc2V0TW9udGgoZW5kRGF0ZS5nZXRNb250aCgpICsgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KTtcclxuICAgICAgICBpZiAoZW5kRGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWF4RGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSAtIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCArIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9C10YDQtdGF0L7QtCDQuiDQvdC+0LLQvtC5INC00LDRgtC1XHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGC0LXQutGD0YnQtdC5INC00LDRgtGLINGBINGA0LXQvdC00LXRgNC+0LxcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9zZWxlY3REYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gZGF0ZTtcclxuICAgIHRoaXMuXyRjcmVhdGVNb250aHMoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0L3QtdC00LXQu9C4XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlV2VlayA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJXZWVrXCI+PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gJHdlZWs7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgJGRheSA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5XCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIiBkYXRhLWRheT1cIiR7ZGF0ZS5nZXREYXkoKX1cIj4ke2RhdGUuZ2V0RGF0ZSgpfTwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uRGF5Q2xpY2tFdmVudC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5fb25EYXlNb3VzZUVudGVyRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICB0aGlzLl91cGRhdGVEYXkoJGRheSk7XHJcblxyXG4gICAgcmV0dXJuICRkYXk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5Nb250aCcpLmZvckVhY2goJG1vbnRoID0+IHtcclxuICAgICAgICB0aGlzLl91cGRhdGVNb250aCgkbW9udGgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Lkg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJG1vbnRoINCt0LvQtdC80LXQvdGCINC80LXRgdGP0YbQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdXBkYXRlTW9udGggPSBmdW5jdGlvbigkbW9udGgpIHtcclxuICAgICRtb250aC5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKS5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZURheSgkZGF5KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5INC00L3Rj1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkg0K3Qu9C10LzQtdC90YIg0LTQvdGPXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl91cGRhdGVEYXkgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBjb25zdCBkYXRlICAgPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIGNvbnN0IGxvY2tlZCA9IHRoaXMuX2ZpbHRlckxvY2tEYXlzKGRhdGUpO1xyXG4gICAgY29uc3QgdG9kYXkgID0gdGhpcy5fdG9kYXkuZ2V0VGltZSgpID09IGRhdGUuZ2V0VGltZSgpO1xyXG5cclxuICAgICRkYXkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtZGlzYWJsZWQnLCBsb2NrZWQpO1xyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1sb2NrZWQnLCBsb2NrZWQgPT0gTE9DS19MT0NLRUQpO1xyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy10b2RheScsIHRvZGF5KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INC60LvQuNC60LAg0L/QviDQtNC90Y5cclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5Q2xpY2tFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuX29uRGF5Q2xpY2soZS50YXJnZXQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0YXQvtCy0LXRgNCwXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheU1vdXNlRW50ZXJFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlcihlLnRhcmdldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpdC+0LLQtdGAINC90LAg0Y3Qu9C10LzQtdC90YLQtSDQtNC90Y9cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5TW91c2VFbnRlciA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheS5kYXRhc2V0LnRpbWUgPT0gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbS5nZXRUaW1lKCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC70LjQuiDQv9C+INC00L3RjlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlDbGljayA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIC8vINC00LXQvdGMINC30LDQsdC70L7QutC40YDQvtCy0LDQvVxyXG4gICAgaWYgKCRkYXkuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpXHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrKCdkYXlTZWxlY3QnLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQsdGA0L7RgSDQstGL0LHRgNCw0L3QvdC+0LPQviDRgNCw0L3QtdC1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcblxyXG4gICAgLy8g0LLRi9Cx0YDQsNC90LAg0L3QsNGH0LDQu9GM0L3QsNGPIC8g0LrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZSh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykpIHtcclxuICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmFuZ2VTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0JLQuNC30YPQsNC70YzQvdGL0Lkg0YHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3JhbmdlVmlzdWFsUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgICRkYXlzLmZvckVhY2goJGRheSA9PiB7XHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJywgJ2lzLXNlbGVjdGVkLXRvJywgJ2lzLXNlbGVjdGVkLWJldHdlZW4nKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgIHRoaXMuX3Rvb2x0aXBIaWRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktC40LfRg9Cw0LvRjNC90L7QtSDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgaWYgKGRhdGVfZnJvbSAmJiBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRlX3RvICYmIGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdGltZV9mcm9tID0gZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVfZnJvbS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgbGV0IHRpbWVfdG8gPSBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVfdG8uZ2V0VGltZSgpIDogMDtcclxuICAgIGlmICh0aW1lX2Zyb20gPiB0aW1lX3RvKSB7XHJcbiAgICAgICAgW3RpbWVfZnJvbSwgdGltZV90b10gPSBbdGltZV90bywgdGltZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCINC80LXQttC00YMg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0LlcclxuICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGRheXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAkZGF5c1tpXS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zZWxlY3RlZC1iZXR3ZWVuJywgJGRheXNbaV0uZGF0YXNldC50aW1lID4gdGltZV9mcm9tICYmICRkYXlzW2ldLmRhdGFzZXQudGltZSA8IHRpbWVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDQvdCw0YfQsNC70YzQvdC+0Lkg0Lgg0LrQvtC90LXRh9C90L7QuSDQv9C+0LfQuNGG0LjQuFxyXG4gICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgIT0gJGRheV9mcm9tKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAhPSAkZGF5X3RvKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0YXRgNCw0L3QtdC90LjQtSDQsiDQutC10YhcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCA9ICRkYXlfdG87XHJcblxyXG4gICAgdGhpcy5fc2VsZWN0aW9uLiRkYXlfZnJvbSA9ICRkYXlfZnJvbTtcclxuICAgIHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvICAgPSAkZGF5X3RvO1xyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IE1hdGguZmxvb3IoTWF0aC5hYnModGltZV9mcm9tIC0gdGltZV90bykgLyA4NjQwMGUzKSArIDE7XHJcbiAgICAgICAgdGhpcy5fdG9vbHRpcFNob3coZGF5cyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9C+0LrQsNC3INC/0L7QtNGB0LrQsNC30LrQuFxyXG4gKiBAcGFyYW0ge051bWJlcn0gZGF5cyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcFNob3cgPSBmdW5jdGlvbihkYXlzKSB7XHJcbiAgICB0aGlzLl8kdG9vbHRpcENvbnRlbnQudGV4dENvbnRlbnQgPSB0aGlzLl9maWx0ZXJUb29sdGlwVGV4dChkYXlzKTtcclxuICAgIHRoaXMuXyR0b29sdGlwLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXNob3cnLCB0aGlzLl8kdG9vbHRpcC50ZXh0Q29udGVudC5sZW5ndGgpO1xyXG4gICAgdGhpcy5fdG9vbHRpcFVwZGF0ZSgpO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0L/QvtC30LjRhtC40Lgg0L/QvtC00YHQutCw0LfQutC4XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwVXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB4ID0gMDtcclxuICAgIGxldCB5ID0gMDtcclxuICAgIGxldCAkZWwgPSB0aGlzLl9zZWxlY3Rpb24uJGRheV90bztcclxuICAgIGRvIHtcclxuICAgICAgICB5ICs9ICRlbC5vZmZzZXRUb3A7XHJcbiAgICAgICAgeCArPSAkZWwub2Zmc2V0TGVmdDtcclxuICAgIH0gd2hpbGUgKCgkZWwgPSAkZWwub2Zmc2V0UGFyZW50KSAmJiAkZWwgIT0gdGhpcy5fJHBpY2tlcik7XHJcblxyXG4gICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUudG9wID0gTWF0aC5yb3VuZCh5IC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSArICdweCc7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5zdHlsZS5sZWZ0ID0gTWF0aC5yb3VuZCh4ICsgdGhpcy5fc2VsZWN0aW9uLiRkYXlfdG8ub2Zmc2V0V2lkdGggLyAyIC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0V2lkdGggLyAyKSArICdweCc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60YDRi9GC0Ywg0L/QvtC00YHQutCw0LfQutGDXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwSGlkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2hvdycpO1xyXG59XHJcblxyXG4vKipcclxuICog0KLQtdC60YHRgiDQv9C+0LTRgdC60LDQt9C60Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICogQHBhcmFtICB7TnVtYmVyfSBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2ZpbHRlclRvb2x0aXBUZXh0ID0gZnVuY3Rpb24oZGF5cykge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZmlsdGVyLnRvb2x0aXBUZXh0ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZpbHRlci50b29sdGlwVGV4dC5jYWxsKHRoaXMsIGRheXMpIHx8ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnBsdXJhbChkYXlzLCBbJyVkINC00LXQvdGMJywgJyVkINC00L3RjycsICclZCDQtNC90LXQuSddKS5yZXBsYWNlKCclZCcsIGRheXMpO1xyXG59XHJcblxyXG4vKipcclxuICog0KTQuNC70YzRgtGAINC90LXQtNC+0YHRgtGD0L/QvdGL0YUg0LTQvdC10LlcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9maWx0ZXJMb2NrRGF5cyA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCy0L3QtSDQtNC+0YHRgtGD0L/QvdC+0LPQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUgfHwgZGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIExPQ0tfVU5BVkFJTEFCTEU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0YTRg9C90LrRhtC40LhcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmZpbHRlci5sb2NrRGF5cyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIubG9ja0RheXMuY2FsbChkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGB0LUg0LTQvdC4INC00L7RgdGC0YPQv9C90YtcclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INC40LfQvNC10L3QtdC90LjRjyDRgNCw0LfQvNC10YDQvtCyINC+0LrQvdCwXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZUV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvKSB7XHJcbiAgICAgICAgdGhpcy5fdG9vbHRpcFVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBicmVha3BvaW50ID0gMDtcclxuICAgIGNvbnN0IGJyZWFrcG9pbnRzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzKS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XHJcbiAgICBmb3IgKGxldCBpIGluIGJyZWFrcG9pbnRzKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IGJyZWFrcG9pbnRzW2ldKSB7XHJcbiAgICAgICAgICAgIGJyZWFrcG9pbnQgPSBicmVha3BvaW50c1tpXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3NldEJyZWFrcG9pbnQoYnJlYWtwb2ludCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9GB0YLQsNC90L7QstC60LAg0YHQvtGB0YLQvtGP0L3QuNGPINGA0LXQvdC00LXRgNCwINC/0L7QtCDRgNCw0LfQvdGL0LUg0Y3QutGA0LDQvdGLXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBicmVha3BvaW50INCa0LvRjtGHINC40LcgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzICjQqNC40YDQuNC90LAg0Y3QutGA0LDQvdCwKVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fc2V0QnJlYWtwb2ludCA9IGZ1bmN0aW9uKGJyZWFrcG9pbnQpIHtcclxuICAgIC8vINC+0YIg0L3QtdC90YPQttC90L7QuSDQv9C10YDQtdGA0LjRgdC+0LLQutC4XHJcbiAgICBpZiAodGhpcy5fYnJlYWtwb2ludCA9PSBicmVha3BvaW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fYnJlYWtwb2ludCA9IGJyZWFrcG9pbnQ7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9ucy5icmVha3BvaW50c1ticmVha3BvaW50XSk7XHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGhzKHRoaXMuX3NlbGVjdGVkRGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQrdC70LXQvNC10L3RgiDQutCw0LvQtdC90LTQsNGA0L3QvtCz0L4g0LTQvdGPXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICogQHJldHVybiB7RWxlbWVudH0gICBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kZ2V0RGF5QnlEYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgdGltZSA9IGRhdGUgaW5zdGFuY2VvZiBEYXRlID8gZGF0ZS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgcmV0dXJuIHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLkRheVtkYXRhLXRpbWU9XCInICsgdGltZSArICdcIl0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC90Y8gLSDQt9Cw0LPQu9GD0YjQutC4XHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRW1wdHlEYXkgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRheSBpcy1lbXB0eVwiPjwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuICRkYXk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LfQtNCw0L3QuNC1INGN0LvQtdC80LXQvdGC0LAg0LjQtyBIVE1MINGC0LXQutGB0YLQsFxyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGh0bWwgSFRNTCDRgtC10LrRgdGCXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGh0bWwpIHtcclxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZGl2Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGh0bWwpO1xyXG4gICAgcmV0dXJuIGRpdi5jaGlsZHJlbi5sZW5ndGggPiAxID8gZGl2LmNoaWxkcmVuIDogZGl2LmZpcnN0RWxlbWVudENoaWxkO1xyXG59XHJcblxyXG4vKipcclxuICogU2FmZSDQstGL0LfQvtCyINCy0L3QtdGI0L3QuNGFINGB0L7QsdGL0YLQuNC5INC60L7QvNC/0L7QvdC10L3RgtCwXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmINCY0LzRjyDRgdC+0LHRi9GC0LjRj1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fY2FsbGJhY2sgPSBmdW5jdGlvbihmKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbltmXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vbltmXS5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGF0ZVJhbmdlUGlja2VyO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9kaXN0L2RhdGVyYW5nZXBpY2tlci5qcyIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2RlbW8vcGFnZS5zY3NzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9kZW1vL3BhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJLElBQXlEO0FBQzdEO0FBQ0EsTUFBTSxFQUtnQztBQUN0QyxDQUFDO0FBQ0Qsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQSxjQUFjLDhCQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxnQkFBZ0IsOEJBQW1CLHdCQUF3Qiw4QkFBbUI7QUFDOUUsbURBQW1ELHlDQUF5QztBQUM1RjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxpRUFBaUUsa0JBQWtCO0FBQ25GO0FBQ0EsMERBQTBELGNBQWM7QUFDeEU7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQW1CO0FBQ25COztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUFtQjtBQUNuQixxQkFBcUIsOEJBQW1CO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxrQkFBa0I7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLHNCQUFzQjtBQUMvQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUVBQXFFOztBQUVyRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQixZQUFZO0FBQ1o7QUFDQTtBQUNBLGdEQUFnRCxjQUFjO0FBQzlEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQixZQUFZLE9BQU87QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxpQkFBaUI7QUFDbEUsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLEtBQUs7QUFDakIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsS0FBSztBQUNoQixXQUFXLEtBQUs7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLEtBQUs7QUFDakIsWUFBWSxPQUFPO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZO0FBQ1osWUFBWTtBQUNaLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLEtBQUs7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQjtBQUNBOztBQUVBO0FB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QUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qiw4REFBVztBQUNsQzs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsImZpbGUiOiIuL2RlbW8vcGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiRGF0ZXJhbmdlcGlja2VyXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoKCkgPT4geyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdFwidXNlIHN0cmljdFwiO1xuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBzY29wZVxuLyoqKioqKi8gXHR2YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuLyoqKioqKi8gXHRcdFx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuLyoqKioqKi8gXHRcdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcbi8qKioqKiovIFx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuLyoqKioqKi8gXHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpXG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0ICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG4vKioqKioqLyBcdFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbi8qKioqKiovIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG4vLyBUaGlzIGVudHJ5IG5lZWQgdG8gYmUgd3JhcHBlZCBpbiBhbiBJSUZFIGJlY2F1c2UgaXQgbmVlZCB0byBiZSBpc29sYXRlZCBhZ2FpbnN0IG90aGVyIGVudHJ5IG1vZHVsZXMuXG4oKCkgPT4ge1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL3Njc3MvaW5kZXguc2NzcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cblxufSkoKTtcblxuLy8gVGhpcyBlbnRyeSBuZWVkIHRvIGJlIHdyYXBwZWQgaW4gYW4gSUlGRSBiZWNhdXNlIGl0IG5lZWQgdG8gYmUgaXNvbGF0ZWQgYWdhaW5zdCBvdGhlciBlbnRyeSBtb2R1bGVzLlxuKCgpID0+IHtcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvanMvaW5kZXguanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKiovXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywge1xuLyogaGFybW9ueSBleHBvcnQgKi8gICBcIkxPQ0tfVU5BVkFJTEFCTEVcIjogKCkgPT4gKC8qIGJpbmRpbmcgKi8gTE9DS19VTkFWQUlMQUJMRSksXG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiTE9DS19MT0NLRURcIjogKCkgPT4gKC8qIGJpbmRpbmcgKi8gTE9DS19MT0NLRUQpLFxuLyogaGFybW9ueSBleHBvcnQgKi8gICBcImRlZmF1bHRcIjogKCkgPT4gKF9fV0VCUEFDS19ERUZBVUxUX0VYUE9SVF9fKVxuLyogaGFybW9ueSBleHBvcnQgKi8gfSk7XG4vLyDRgdC+0YHRgtC+0Y/QvdC40Y8g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9GFINC00LDRglxyXG5jb25zdCBMT0NLX1VOQVZBSUxBQkxFID0gMTtcclxuY29uc3QgTE9DS19MT0NLRUQgICAgICA9IDI7XHJcblxyXG5jb25zdCBJTkRFWF9EQVRFX0ZST00gPSAwO1xyXG5jb25zdCBJTkRFWF9EQVRFX1RPICAgPSAxO1xyXG5cclxuZnVuY3Rpb24gRGF0ZVJhbmdlUGlja2VyKCRjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgLy8g0L7RgiDQv9C+0LLRgtC+0YDQvdC+0Lkg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40LhcclxuICAgIGlmICgkY29udGFpbmVyLmluc3RhbmNlKSB7XHJcbiAgICAgICAgcmV0dXJuICRjb250YWluZXIuaW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICAkY29udGFpbmVyLmluc3RhbmNlID0gdGhpcztcclxuXHJcbiAgICB0aGlzLl8kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcclxuXHJcbiAgICAvLyDQt9C90LDRh9C10L3QuNC1INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAgICBjb25zdCBkdiA9ICh4LCB2KSA9PiB0eXBlb2YgeCA9PSAndW5kZWZpbmVkJyA/IHYgOiB4O1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IHtcclxuICAgICAgICBmaXJzdERheU9mVGhlV2VlazogZHYob3B0aW9ucy5maXJzdERheU9mVGhlV2VlaywgMSksIC8vINC/0LXRgNCy0YvQuSDQtNC10L3RjCDQvdC10LTQtdC70LgsIDAgPSDQstGBLCAxID0g0L/QvSwgLi4uXHJcbiAgICAgICAgc2luZ2xlTW9kZTogICAgICAgIGR2KG9wdGlvbnMuc2luZ2xlTW9kZSwgZmFsc2UpLCAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0Ysg0LLQvNC10YHRgtC+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgIGxvY2FsZTogICAgICAgICAgICBkdihvcHRpb25zLmxvY2FsZSwgJ3J1LVJVJyksXHJcbiAgICAgICAgbWluRGF5czogICAgICAgICAgIGR2KG9wdGlvbnMubWluRGF5cywgMSksICAgICAgICAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC00LjQsNC/0LDQt9C+0L3QtVxyXG4gICAgICAgIG1vbnRoc0NvdW50OiAgICAgICBkdihvcHRpb25zLm1vbnRoc0NvdW50LCAxMiksXHJcbiAgICAgICAgcGVyUm93OiAgICAgICAgICAgIGR2KG9wdGlvbnMucGVyUm93LCB1bmRlZmluZWQpLCAgICAvLyDQutC+0LvQuNGH0LXRgdGC0LLQviDQvNC10YHRj9GG0LXQsiDQsiDRgNGP0LTRg1xyXG4gICAgICAgIG1pbkRhdGU6ICAgICAgICAgICBkdihvcHRpb25zLm1pbkRhdGUsIG5ldyBEYXRlKCkpLCAgLy8g0LzQuNC90LjQvNCw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICAgIG1heERhdGU6ICAgICAgICAgICBkdihvcHRpb25zLm1heERhdGUsIHVuZGVmaW5lZCksXHJcbiAgICAgICAgYnJlYWtwb2ludHM6ICAgICAgIGR2KG9wdGlvbnMuYnJlYWtwb2ludHMsIHt9KSxcclxuICAgICAgICBpbnRlcm5hbElucHV0czogICAgZHYob3B0aW9ucy5pbnRlcm5hbElucHV0cywgdHJ1ZSksIC8vINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1INCy0YHRgtGA0L7QtdC90L3Ri9GFINC40L3Qv9GD0YLQvtCyXHJcbiAgICAgICAgLy8g0YHQvtCx0YvRgtC40Y9cclxuICAgICAgICBvbjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIHJhbmdlU2VsZWN0OiBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICAgICAgICBkYXlTZWxlY3Q6ICAgbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC+0LTQvdC+0Lkg0LTQsNGC0YsgKNGC0L7Qu9GM0LrQviDQv9GA0Lggc2luZ2xlTW9kZTogdHJ1ZSlcclxuICAgICAgICB9LCBvcHRpb25zLm9uIHx8IHt9KSxcclxuICAgICAgICAvLyDRhNC40LvRjNGC0YDRg9GO0YnQuNC1INC80LXRgtC+0LTRi1xyXG4gICAgICAgIGZpbHRlcjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIGxvY2tEYXlzOiAgICBudWxsLCAvLyBjYWxsYmFjayhkYXRlKSDRhNGD0L3QutGG0LjRjyDQsdC70L7QutC40YDQvtCy0LDQvdC40Y8g0LTQsNGCLCB0cnVlL0xPQ0tcclxuICAgICAgICAgICAgdG9vbHRpcFRleHQ6IG51bGwsIC8vIGNhbGxiYWNrKGRheXMpINCy0YvQstC+0LQg0YLQtdC60YHRgtCwINC/0L7QtNGB0LrQsNC30LrQuFxyXG4gICAgICAgIH0sIG9wdGlvbnMuZmlsdGVyIHx8IHt9KSxcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXQoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINGA0Y/QtNC90L7RgdGC0YxcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnBlclJvdyA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5wZXJSb3cgPSB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5taW5EYXRlKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm1pbkRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7Qv9GG0LjQuCDQtNC70Y8g0Y3QutGA0LDQvdC+0LIg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICAgIHRoaXMub3B0aW9ucy5icmVha3BvaW50c1t0aGlzLl9icmVha3BvaW50ID0gMF0gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuICAgIC8vINGC0LXQutGD0YnQuNC5INC00LXQvdGMXHJcbiAgICB0aGlzLl90b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICB0aGlzLl90b2RheS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICB0aGlzLl8kcGlja2VyID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJcIj5cclxuICAgICAgICAgICAgJHt0aGlzLm9wdGlvbnMuaW50ZXJuYWxJbnB1dHMgP1xyXG4gICAgICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX2lucHV0c1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICR7dGhpcy5vcHRpb25zLnNpbmdsZU1vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyBgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZVwiPmBcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV9mcm9tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImRhdGVfdG9cIj5gXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+YCA6ICcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXBcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXAtY29udGVudFwiPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGN0LvQtdC80LXQvdGC0YtcclxuICAgIHRoaXMuXyRtb250aHMgICAgICAgICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzJyk7XHJcbiAgICB0aGlzLl8kdG9vbHRpcCAgICAgICAgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5EYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXAnKTtcclxuICAgIHRoaXMuXyR0b29sdGlwQ29udGVudCA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcC1jb250ZW50Jyk7XHJcblxyXG4gICAgLy8g0L/QvtC70Y8g0LLQstC+0LTQsFxyXG4gICAgdGhpcy5fJGlucHV0cyA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZV49XCJkYXRlXCJdJyk7XHJcblxyXG4gICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24gPSB7fTtcclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YBcclxuICAgIHRoaXMuX3NlbGVjdERhdGUodGhpcy5vcHRpb25zLm1pbkRhdGUpO1xyXG4gICAgdGhpcy5fJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl8kcGlja2VyKTtcclxuXHJcbiAgICAvLyDQvtCx0YDQsNCx0L7RgtC60LAg0LHRgNC10LnQutC/0L7QuNC90YLQvtCyXHJcbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzKS5sZW5ndGgpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fb25XaW5kb3dSZXNpemVFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLl9vbldpbmRvd1Jlc2l6ZUV2ZW50KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQndCw0LfQstCw0L3QuNC1INC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldE1vbnRoRm9ybWF0dGVkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgdGl0bGUgPSB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHttb250aDogJ2xvbmcnfSk7XHJcbiAgICByZXR1cm4gdGl0bGUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKSArIHRpdGxlLnNsaWNlKDEpO1xyXG59XHJcblxyXG4vKipcclxuICog0KTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90LjQtSDQtNCw0YLRiyDQtNC70Y8g0YLQtdC60YPRidC10Lkg0LvQvtC60LDQu9C4XHJcbiAqIEBwYXJhbSAge0RhdGV9ICAgZGF0ZSAgICDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zINCf0LDRgNCw0LzQtdGC0YDRi1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGVUaW1lRm9ybWF0ID0gZnVuY3Rpb24oZGF0ZSwgb3B0aW9ucykge1xyXG4gICAgcmV0dXJuIEludGwuRGF0ZVRpbWVGb3JtYXQodGhpcy5vcHRpb25zLmxvY2FsZSwgb3B0aW9ucykuZm9ybWF0KGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0JTQvdC4INC90LXQtNC10LvQuFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRXZWVrRGF5c0Zvcm1hdHRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAyKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgKytpKSB7XHJcbiAgICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICBkYXk6IGRhdGUuZ2V0RGF5KCksXHJcbiAgICAgICAgICAgIHRpdGxlOiB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHt3ZWVrZGF5OiAnc2hvcnQnfSksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0YHQvtCz0LvQsNGB0L3QviDQvdCw0YHRgtGA0L7QtdC90L3QvtC80YMg0L/QtdGA0LLQvtC80YMg0LTQvdGOINC90LXQtNC10LvQuFxyXG4gICAgcmVzdWx0LnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICBjb25zdCBmaXJzdERheU9mVGhlV2VlayA9IHRoaXMub3B0aW9ucy5maXJzdERheU9mVGhlV2VlayAlIDc7XHJcbiAgICAgICAgbGV0IGRheUEgPSBhLmRheTtcclxuICAgICAgICBsZXQgZGF5QiA9IGIuZGF5O1xyXG5cclxuICAgICAgICBpZiAoZGF5QSA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QiA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlBIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgZGF5QSArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUIgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICBkYXlCICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGF5QSAtIGRheUI7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vKipcclxuICog0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LzQtdGB0Y/RhtC1XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge051bWJlcn0gICAg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF5c0NvdW50SW5Nb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IGRheXMgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF5cy5zZXRNb250aChkYXlzLmdldE1vbnRoKCkgKyAxKTtcclxuICAgIGRheXMuc2V0RGF0ZSgwKTtcclxuICAgIHJldHVybiBkYXlzLmdldERhdGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnJhbmdlUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsUmVzZXQoKTtcclxuICAgIHRoaXMuX3NlbGVjdGlvbiA9IHt9O1xyXG59XHJcblxyXG4vKipcclxuICog0JLRi9C00LXQu9C10L3QuNC1INC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucmFuZ2VTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGlmICghKGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUpIHx8ICEoZGF0ZV90byBpbnN0YW5jZW9mIERhdGUpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgaWYgKCF0aGlzLmdldElzUmFuZ2VTZWxlY3RhYmxlKGRhdGVfZnJvbSwgZGF0ZV90bykpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INGN0LvQtdC80LXQvdGC0L7QslxyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QoZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuXHJcbiAgICAvLyDRgdC+0YXRgNCw0L3QtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Y9cclxuICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBkYXRlX2Zyb207XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byAgID0gZGF0ZV90bztcclxuXHJcbiAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1XHJcbiAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7QsdC90L7QstC70LXQvdC40LUg0LjQvdC/0YPRgtC+0LJcclxuICAgIGlmICh0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfRlJPTV0pIHtcclxuICAgICAgICB0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfRlJPTV0udmFsdWUgPSB0aGlzLmZvcm1hdERhdGUoZGF0ZV9mcm9tKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fJGlucHV0c1tJTkRFWF9EQVRFX1RPXSkge1xyXG4gICAgICAgIHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9UT10udmFsdWUgPSB0aGlzLmZvcm1hdERhdGUoZGF0ZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtCx0YvRgtC40LVcclxuICAgIHRoaXMuX2NhbGxiYWNrKCdyYW5nZVNlbGVjdCcsIGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INC00LDRgtGLXHJcbiAqIEBwYXJhbSAge0RhdGV9ICAgZGF0ZSAgINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZvcm1hdCDQpNC+0YDQvNCw0YIg0YHRgtGA0L7QutC4XHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUsIGZvcm1hdCA9ICdZLW0tZCcpIHtcclxuICAgIGlmICghKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UoJ1knLCBkYXRlLmdldEZ1bGxZZWFyKCkpXHJcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ20nLCAoJzAnICsgKGRhdGUuZ2V0TW9udGgoKSArIDEpKS5zbGljZSgtMikpXHJcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ2QnLCAoJzAnICsgKGRhdGUuZ2V0RGF0ZSgpKSkuc2xpY2UoLTIpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0YDQvtCy0LXRgNC60LAg0LLQvtC30LzQvtC20L3QvtGB0YLQuCDQstGL0LTQtdC70LXQvdC40Y8g0LTQsNGCXHJcbiAqIEBwYXJhbSAge0RhdGUgZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0gIHtEYXRlIGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldElzUmFuZ2VTZWxlY3RhYmxlID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3Ri9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhkYXRlX2Zyb20uZ2V0VGltZSgpIC0gZGF0ZV90by5nZXRUaW1lKCkpIC8gMTAwMCAvIDg2NDAwO1xyXG4gICAgaWYgKGRpZmYgPCB0aGlzLm9wdGlvbnMubWluRGF5cykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9GA0L7QstC10YDQutCwINC/0L7Qv9Cw0LTQsNC90LjRjyDQsiDQtNC40LDQv9Cw0LfQvtC9INC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKCk7XHJcbiAgICBkYXkuc2V0VGltZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuXHJcbiAgICB3aGlsZSAoZGF5IDwgZGF0ZV90bykge1xyXG4gICAgICAgIGlmICh0aGlzLl9maWx0ZXJMb2NrRGF5cyhkYXkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRheS5zZXREYXRlKGRheS5nZXREYXRlKCkgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQsdGA0LDQvdC90LDRjyDQvdCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHJldHVybiB7RGF0ZX0g0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZUZyb20gPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINC90LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsCDQvdC1INGD0LrQsNC30LDQvdCwXHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwINC/0L7Qt9C20LUg0LrQvtC90LXRh9C90L7QuVxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQsdGA0LDQvdC90LDRjyDQtNCw0YLQsCAoc2luZ2xlTW9kZTogdHJ1ZSlcclxuICogQHJldHVybiB7RGF0ZX0g0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZSA9IERhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZUZyb207XHJcblxyXG4vKipcclxuICog0JLRi9Cx0YDQsNC90L3QsNGPINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICogQHJldHVybiB7RGF0ZX0g0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZVRvID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyDQutC+0L3QtdGH0L3QsNGPINC00LDRgtCwINC90LUg0YPQutCw0LfQsNC90LBcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwINC/0L7Qt9C20LUg0LrQvtC90LXRh9C90L7QuVxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA+IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb207XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQutC70L7QvdC10L3QuNC1ICgxINCx0L7QsdGR0YAsIDIg0LHQvtCx0YDQsCwgNSDQsdC+0LHRgNC+0LIpXHJcbiAqIEBwYXJhbSAge051bWJlcn0gdmFsdWUg0JrQvtC70LjRh9C10YHRgtCy0L5cclxuICogQHBhcmFtICB7QXJyYXl9ICBmb3JtcyDQnNCw0YHRgdC40LIg0LjQtyAz0YUg0Y3Qu9C10LzQtdC90YLQvtCyLCDQvNC+0LbQtdGCINGB0L7QtNC10YDQttCw0YLRjCDRgdC/0LXRhtC40YTQuNC60LDRgtC+0YAgJWQg0LTQu9GPINC30LDQvNC10L3Ri1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnBsdXJhbCA9IGZ1bmN0aW9uICh2YWx1ZSwgZm9ybXMpIHtcclxuICAgIHJldHVybiAodmFsdWUgJSAxMCA9PSAxICYmIHZhbHVlICUgMTAwICE9IDExID8gZm9ybXNbMF0gOiAodmFsdWUgJSAxMCA+PSAyICYmIHZhbHVlICUgMTAgPD0gNCAmJiAodmFsdWUgJSAxMDAgPCAxMCB8fCB2YWx1ZSAlIDEwMCA+PSAyMCkgPyBmb3Jtc1sxXSA6IGZvcm1zWzJdKSkucmVwbGFjZSgnJWQnLCB2YWx1ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQuNCw0L/QsNC30L7QvdCwINC80LXRgdGP0YbQtdCyXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZU1vbnRocyA9IGZ1bmN0aW9uKGRhdGVfZnJvbSkge1xyXG4gICAgd2hpbGUgKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCkge1xyXG4gICAgICAgIHRoaXMuXyRtb250aHMucmVtb3ZlQ2hpbGQodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9GA0Y/Rh9C10Lwg0L/QvtC00YHQutCw0LfQutGDXHJcbiAgICB0aGlzLl90b29sdGlwSGlkZSgpO1xyXG5cclxuICAgIC8vINC/0YDQtdGA0LXQvdC00LXRgCDQvNC10YHRj9GG0LXQslxyXG4gICAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuICAgIGNvbnN0ICRtb250aHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50OyArK2kpIHtcclxuICAgICAgICAkbW9udGhzLnB1c2godGhpcy5fJGNyZWF0ZU1vbnRoKGN1cnJlbnREYXRlKSk7XHJcbiAgICAgICAgY3VycmVudERhdGUuc2V0TW9udGgoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkbW9udGhzLmxlbmd0aDsgaSArPSB0aGlzLm9wdGlvbnMucGVyUm93KSB7XHJcbiAgICAgICAgY29uc3QgJHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICRyb3cuY2xhc3NOYW1lID0gJ0RhdGVyYW5nZXBpY2tlcl9fcm93JztcclxuXHJcbiAgICAgICAgJG1vbnRocy5zbGljZShpLCBpICsgdGhpcy5vcHRpb25zLnBlclJvdykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgICAgICAkcm93LmFwcGVuZENoaWxkKCRtb250aCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuXyRtb250aHMuYXBwZW5kQ2hpbGQoJHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSDQnNC10YHRj9GGXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCBjdXJyZW50TW9udGggPSBkYXRlLmdldE1vbnRoKCk7XHJcbiAgICBjb25zdCBtb250aFRpdGxlID0gdGhpcy5nZXRNb250aEZvcm1hdHRlZChkYXRlKTtcclxuICAgIGNvbnN0IHdlZWtEYXlzID0gdGhpcy5nZXRXZWVrRGF5c0Zvcm1hdHRlZCgpO1xyXG5cclxuICAgIGNvbnN0ICRtb250aCA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiTW9udGhcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2hlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLXByZXYkeyh0aGlzLm9wdGlvbnMubWluRGF0ZSAmJiBkYXRlIDw9IHRoaXMub3B0aW9ucy5taW5EYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTcgMTNMMSA3TDcgMVwiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX3RpdGxlXCI+JHttb250aFRpdGxlfSAke2RhdGUuZ2V0RnVsbFllYXIoKX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fYXJyb3cgTW9udGhfX2Fycm93LS1uZXh0JHsodGhpcy5vcHRpb25zLm1heERhdGUgJiYgZGF0ZSA+PSB0aGlzLm9wdGlvbnMubWF4RGF0ZSkgPyAnIGlzLWRpc2FibGVkJyA6ICcnfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xIDAuOTk5OTk5TDcgN0wxIDEzXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla1wiPiR7d2Vla0RheXMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtkYXlcIj4ke2l0ZW0udGl0bGV9PC9kaXY+YFxyXG4gICAgICAgICAgICB9KS5qb2luKCcnKX08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19kYXlzXCI+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyDRgdGC0YDQtdC70LrQuFxyXG4gICAgW1xyXG4gICAgICAgIHtzZWxlY3RvcjogJy5Nb250aF9fYXJyb3ctLXByZXYnLCBuYW1lOiAncHJldid9LFxyXG4gICAgICAgIHtzZWxlY3RvcjogJy5Nb250aF9fYXJyb3ctLW5leHQnLCBuYW1lOiAnbmV4dCd9LFxyXG4gICAgXS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIGNvbnN0ICRhcnJvdyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKGl0ZW0uc2VsZWN0b3IpO1xyXG4gICAgICAgICRhcnJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgICAgICAvLyDQstGA0LXQvNC10L3QvdCw0Y8g0LzQtdGA0LAsINC70YPRh9GI0LUg0L/QtdGA0LXQstC10YDRgdGC0LDRgtGMLCDQstGL0L3QtdGB0YLQuCDRgdGC0YDQtdC70LrQuCDQt9CwINC/0YDQtdC00LXQu9GLINC/0LXRgNC10YDQtdGA0LjRgdC+0LLRi9Cy0LDQtdC80L7QuSDQvtCx0LvQsNGB0YLQuCDQv9C40LrQtdGA0LBcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX29uQXJyb3dDbGljaygkYXJyb3csIGl0ZW0ubmFtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YAg0LTQvdC10LlcclxuICAgIGNvbnN0ICRkYXlzID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aF9fZGF5cycpO1xyXG4gICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgIGRheXMuc2V0RGF0ZSgxKTtcclxuICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgd2hpbGUgKGRheXMuZ2V0TW9udGgoKSA9PSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVXZWVrKCk7XHJcblxyXG4gICAgICAgIHdlZWtEYXlzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXlzLmdldERheSgpICE9IGl0ZW0uZGF5IHx8IGRheXMuZ2V0TW9udGgoKSAhPSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVFbXB0eURheSgpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZURheShkYXlzKSk7XHJcbiAgICAgICAgICAgIGRheXMuc2V0RGF0ZShkYXlzLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkZGF5cy5hcHBlbmRDaGlsZCgkd2Vlayk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICRtb250aDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0LvQuNC6INC/0L4g0YHRgtGA0LXQu9C60LUg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPINC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRhcnJvdyBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lICAgINCY0LzRjyAocHJldiwgbmV4dClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uQXJyb3dDbGljayA9IGZ1bmN0aW9uKCRhcnJvdywgbmFtZSkge1xyXG4gICAgaWYgKCRhcnJvdy5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLk1vbnRoJykuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyAobmFtZSA9PSAncHJldicgPyAtdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50IDogdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KSk7XHJcblxyXG4gICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LjQvdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1pbkRhdGUuZ2V0VGltZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0YXQvtC0INC30LAg0L/RgNC10LTQtdC70Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICBjb25zdCBlbmREYXRlID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGVuZERhdGUuc2V0TW9udGgoZW5kRGF0ZS5nZXRNb250aCgpICsgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KTtcclxuICAgICAgICBpZiAoZW5kRGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWF4RGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSAtIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCArIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9C10YDQtdGF0L7QtCDQuiDQvdC+0LLQvtC5INC00LDRgtC1XHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGC0LXQutGD0YnQtdC5INC00LDRgtGLINGBINGA0LXQvdC00LXRgNC+0LxcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9zZWxlY3REYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gZGF0ZTtcclxuICAgIHRoaXMuXyRjcmVhdGVNb250aHMoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0L3QtdC00LXQu9C4XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlV2VlayA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJXZWVrXCI+PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gJHdlZWs7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgJGRheSA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5XCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIiBkYXRhLWRheT1cIiR7ZGF0ZS5nZXREYXkoKX1cIj4ke2RhdGUuZ2V0RGF0ZSgpfTwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uRGF5Q2xpY2tFdmVudC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5fb25EYXlNb3VzZUVudGVyRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICB0aGlzLl91cGRhdGVEYXkoJGRheSk7XHJcblxyXG4gICAgcmV0dXJuICRkYXk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5Nb250aCcpLmZvckVhY2goJG1vbnRoID0+IHtcclxuICAgICAgICB0aGlzLl91cGRhdGVNb250aCgkbW9udGgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Lkg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJG1vbnRoINCt0LvQtdC80LXQvdGCINC80LXRgdGP0YbQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdXBkYXRlTW9udGggPSBmdW5jdGlvbigkbW9udGgpIHtcclxuICAgICRtb250aC5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKS5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZURheSgkZGF5KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5INC00L3Rj1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkg0K3Qu9C10LzQtdC90YIg0LTQvdGPXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl91cGRhdGVEYXkgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBjb25zdCBkYXRlICAgPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIGNvbnN0IGxvY2tlZCA9IHRoaXMuX2ZpbHRlckxvY2tEYXlzKGRhdGUpO1xyXG4gICAgY29uc3QgdG9kYXkgID0gdGhpcy5fdG9kYXkuZ2V0VGltZSgpID09IGRhdGUuZ2V0VGltZSgpO1xyXG5cclxuICAgICRkYXkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtZGlzYWJsZWQnLCBsb2NrZWQpO1xyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1sb2NrZWQnLCBsb2NrZWQgPT0gTE9DS19MT0NLRUQpO1xyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy10b2RheScsIHRvZGF5KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INC60LvQuNC60LAg0L/QviDQtNC90Y5cclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5Q2xpY2tFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuX29uRGF5Q2xpY2soZS50YXJnZXQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0YXQvtCy0LXRgNCwXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheU1vdXNlRW50ZXJFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlcihlLnRhcmdldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpdC+0LLQtdGAINC90LAg0Y3Qu9C10LzQtdC90YLQtSDQtNC90Y9cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5TW91c2VFbnRlciA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheS5kYXRhc2V0LnRpbWUgPT0gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbS5nZXRUaW1lKCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC70LjQuiDQv9C+INC00L3RjlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlDbGljayA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIC8vINC00LXQvdGMINC30LDQsdC70L7QutC40YDQvtCy0LDQvVxyXG4gICAgaWYgKCRkYXkuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpXHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrKCdkYXlTZWxlY3QnLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQsdGA0L7RgSDQstGL0LHRgNCw0L3QvdC+0LPQviDRgNCw0L3QtdC1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcblxyXG4gICAgLy8g0LLRi9Cx0YDQsNC90LAg0L3QsNGH0LDQu9GM0L3QsNGPIC8g0LrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZSh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykpIHtcclxuICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmFuZ2VTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0JLQuNC30YPQsNC70YzQvdGL0Lkg0YHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3JhbmdlVmlzdWFsUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgICRkYXlzLmZvckVhY2goJGRheSA9PiB7XHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJywgJ2lzLXNlbGVjdGVkLXRvJywgJ2lzLXNlbGVjdGVkLWJldHdlZW4nKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgIHRoaXMuX3Rvb2x0aXBIaWRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktC40LfRg9Cw0LvRjNC90L7QtSDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgaWYgKGRhdGVfZnJvbSAmJiBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRlX3RvICYmIGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdGltZV9mcm9tID0gZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVfZnJvbS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgbGV0IHRpbWVfdG8gPSBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVfdG8uZ2V0VGltZSgpIDogMDtcclxuICAgIGlmICh0aW1lX2Zyb20gPiB0aW1lX3RvKSB7XHJcbiAgICAgICAgW3RpbWVfZnJvbSwgdGltZV90b10gPSBbdGltZV90bywgdGltZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCINC80LXQttC00YMg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0LlcclxuICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGRheXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAkZGF5c1tpXS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zZWxlY3RlZC1iZXR3ZWVuJywgJGRheXNbaV0uZGF0YXNldC50aW1lID4gdGltZV9mcm9tICYmICRkYXlzW2ldLmRhdGFzZXQudGltZSA8IHRpbWVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDQvdCw0YfQsNC70YzQvdC+0Lkg0Lgg0LrQvtC90LXRh9C90L7QuSDQv9C+0LfQuNGG0LjQuFxyXG4gICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgIT0gJGRheV9mcm9tKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAhPSAkZGF5X3RvKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0YXRgNCw0L3QtdC90LjQtSDQsiDQutC10YhcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCA9ICRkYXlfdG87XHJcblxyXG4gICAgdGhpcy5fc2VsZWN0aW9uLiRkYXlfZnJvbSA9ICRkYXlfZnJvbTtcclxuICAgIHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvICAgPSAkZGF5X3RvO1xyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IE1hdGguZmxvb3IoTWF0aC5hYnModGltZV9mcm9tIC0gdGltZV90bykgLyA4NjQwMGUzKSArIDE7XHJcbiAgICAgICAgdGhpcy5fdG9vbHRpcFNob3coZGF5cyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9C+0LrQsNC3INC/0L7QtNGB0LrQsNC30LrQuFxyXG4gKiBAcGFyYW0ge051bWJlcn0gZGF5cyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcFNob3cgPSBmdW5jdGlvbihkYXlzKSB7XHJcbiAgICB0aGlzLl8kdG9vbHRpcENvbnRlbnQudGV4dENvbnRlbnQgPSB0aGlzLl9maWx0ZXJUb29sdGlwVGV4dChkYXlzKTtcclxuICAgIHRoaXMuXyR0b29sdGlwLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXNob3cnLCB0aGlzLl8kdG9vbHRpcC50ZXh0Q29udGVudC5sZW5ndGgpO1xyXG4gICAgdGhpcy5fdG9vbHRpcFVwZGF0ZSgpO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0L/QvtC30LjRhtC40Lgg0L/QvtC00YHQutCw0LfQutC4XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwVXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB4ID0gMDtcclxuICAgIGxldCB5ID0gMDtcclxuICAgIGxldCAkZWwgPSB0aGlzLl9zZWxlY3Rpb24uJGRheV90bztcclxuICAgIGRvIHtcclxuICAgICAgICB5ICs9ICRlbC5vZmZzZXRUb3A7XHJcbiAgICAgICAgeCArPSAkZWwub2Zmc2V0TGVmdDtcclxuICAgIH0gd2hpbGUgKCgkZWwgPSAkZWwub2Zmc2V0UGFyZW50KSAmJiAkZWwgIT0gdGhpcy5fJHBpY2tlcik7XHJcblxyXG4gICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUudG9wID0gTWF0aC5yb3VuZCh5IC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSArICdweCc7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5zdHlsZS5sZWZ0ID0gTWF0aC5yb3VuZCh4ICsgdGhpcy5fc2VsZWN0aW9uLiRkYXlfdG8ub2Zmc2V0V2lkdGggLyAyIC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0V2lkdGggLyAyKSArICdweCc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60YDRi9GC0Ywg0L/QvtC00YHQutCw0LfQutGDXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwSGlkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2hvdycpO1xyXG59XHJcblxyXG4vKipcclxuICog0KLQtdC60YHRgiDQv9C+0LTRgdC60LDQt9C60Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICogQHBhcmFtICB7TnVtYmVyfSBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2ZpbHRlclRvb2x0aXBUZXh0ID0gZnVuY3Rpb24oZGF5cykge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZmlsdGVyLnRvb2x0aXBUZXh0ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZpbHRlci50b29sdGlwVGV4dC5jYWxsKHRoaXMsIGRheXMpIHx8ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnBsdXJhbChkYXlzLCBbJyVkINC00LXQvdGMJywgJyVkINC00L3RjycsICclZCDQtNC90LXQuSddKS5yZXBsYWNlKCclZCcsIGRheXMpO1xyXG59XHJcblxyXG4vKipcclxuICog0KTQuNC70YzRgtGAINC90LXQtNC+0YHRgtGD0L/QvdGL0YUg0LTQvdC10LlcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9maWx0ZXJMb2NrRGF5cyA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCy0L3QtSDQtNC+0YHRgtGD0L/QvdC+0LPQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUgfHwgZGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIExPQ0tfVU5BVkFJTEFCTEU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0YTRg9C90LrRhtC40LhcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmZpbHRlci5sb2NrRGF5cyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIubG9ja0RheXMuY2FsbChkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGB0LUg0LTQvdC4INC00L7RgdGC0YPQv9C90YtcclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INC40LfQvNC10L3QtdC90LjRjyDRgNCw0LfQvNC10YDQvtCyINC+0LrQvdCwXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZUV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvKSB7XHJcbiAgICAgICAgdGhpcy5fdG9vbHRpcFVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBicmVha3BvaW50ID0gMDtcclxuICAgIGNvbnN0IGJyZWFrcG9pbnRzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzKS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XHJcbiAgICBmb3IgKGxldCBpIGluIGJyZWFrcG9pbnRzKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IGJyZWFrcG9pbnRzW2ldKSB7XHJcbiAgICAgICAgICAgIGJyZWFrcG9pbnQgPSBicmVha3BvaW50c1tpXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3NldEJyZWFrcG9pbnQoYnJlYWtwb2ludCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9GB0YLQsNC90L7QstC60LAg0YHQvtGB0YLQvtGP0L3QuNGPINGA0LXQvdC00LXRgNCwINC/0L7QtCDRgNCw0LfQvdGL0LUg0Y3QutGA0LDQvdGLXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBicmVha3BvaW50INCa0LvRjtGHINC40LcgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzICjQqNC40YDQuNC90LAg0Y3QutGA0LDQvdCwKVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fc2V0QnJlYWtwb2ludCA9IGZ1bmN0aW9uKGJyZWFrcG9pbnQpIHtcclxuICAgIC8vINC+0YIg0L3QtdC90YPQttC90L7QuSDQv9C10YDQtdGA0LjRgdC+0LLQutC4XHJcbiAgICBpZiAodGhpcy5fYnJlYWtwb2ludCA9PSBicmVha3BvaW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fYnJlYWtwb2ludCA9IGJyZWFrcG9pbnQ7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9ucy5icmVha3BvaW50c1ticmVha3BvaW50XSk7XHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGhzKHRoaXMuX3NlbGVjdGVkRGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQrdC70LXQvNC10L3RgiDQutCw0LvQtdC90LTQsNGA0L3QvtCz0L4g0LTQvdGPXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICogQHJldHVybiB7RWxlbWVudH0gICBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kZ2V0RGF5QnlEYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgdGltZSA9IGRhdGUgaW5zdGFuY2VvZiBEYXRlID8gZGF0ZS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgcmV0dXJuIHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLkRheVtkYXRhLXRpbWU9XCInICsgdGltZSArICdcIl0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC90Y8gLSDQt9Cw0LPQu9GD0YjQutC4XHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRW1wdHlEYXkgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRheSBpcy1lbXB0eVwiPjwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuICRkYXk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LfQtNCw0L3QuNC1INGN0LvQtdC80LXQvdGC0LAg0LjQtyBIVE1MINGC0LXQutGB0YLQsFxyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGh0bWwgSFRNTCDRgtC10LrRgdGCXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGh0bWwpIHtcclxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZGl2Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGh0bWwpO1xyXG4gICAgcmV0dXJuIGRpdi5jaGlsZHJlbi5sZW5ndGggPiAxID8gZGl2LmNoaWxkcmVuIDogZGl2LmZpcnN0RWxlbWVudENoaWxkO1xyXG59XHJcblxyXG4vKipcclxuICogU2FmZSDQstGL0LfQvtCyINCy0L3QtdGI0L3QuNGFINGB0L7QsdGL0YLQuNC5INC60L7QvNC/0L7QvdC10L3RgtCwXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmINCY0LzRjyDRgdC+0LHRi9GC0LjRj1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fY2FsbGJhY2sgPSBmdW5jdGlvbihmKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbltmXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vbltmXS5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybjtcclxufVxyXG5cclxuLyogaGFybW9ueSBkZWZhdWx0IGV4cG9ydCAqLyBjb25zdCBfX1dFQlBBQ0tfREVGQVVMVF9FWFBPUlRfXyA9IChEYXRlUmFuZ2VQaWNrZXIpO1xyXG5cbn0pKCk7XG5cbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19leHBvcnRzX187XG4vKioqKioqLyB9KSgpXG47XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdmQyVmljR0ZqYXk5MWJtbDJaWEp6WVd4TmIyUjFiR1ZFWldacGJtbDBhVzl1SWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k5M1pXSndZV05yTDJKdmIzUnpkSEpoY0NJc0luZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdmQyVmljR0ZqYXk5eWRXNTBhVzFsTDJSbFptbHVaU0J3Y205d1pYSjBlU0JuWlhSMFpYSnpJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTkzWldKd1lXTnJMM0oxYm5ScGJXVXZhR0Z6VDNkdVVISnZjR1Z5ZEhrZ2MyaHZjblJvWVc1a0lpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOTNaV0p3WVdOckwzSjFiblJwYldVdmJXRnJaU0J1WVcxbGMzQmhZMlVnYjJKcVpXTjBJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTh1TDNOeVl5OXpZM056TDJsdVpHVjRMbk5qYzNNL05UWXhPQ0lzSW5kbFluQmhZMnM2THk5a1lYUmxjbUZ1WjJWd2FXTnJaWEl2TGk5emNtTXZhbk12YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1EwRkJRenRCUVVORUxFODdPMVZEVmtFN1ZVRkRRVHM3T3pzN1YwTkVRVHRYUVVOQk8xZEJRMEU3VjBGRFFUdFhRVU5CTEhkRFFVRjNReXg1UTBGQmVVTTdWMEZEYWtZN1YwRkRRVHRYUVVOQkxFVTdPenM3TzFkRFVFRXNkMFk3T3pzN08xZERRVUU3VjBGRFFUdFhRVU5CTzFkQlEwRXNjMFJCUVhORUxHdENRVUZyUWp0WFFVTjRSVHRYUVVOQkxDdERRVUVyUXl4alFVRmpPMWRCUXpkRUxFVTdPenM3T3pzN096czdPenRCUTA1Qk96czdPenM3T3pzN096czdPenM3UVVOQlFUdEJRVU5QTzBGQlEwRTdPMEZCUlZBN1FVRkRRVHM3UVVGRlFTeHBSRUZCYVVRN1FVRkRha1E3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMSEZFUVVGeFJEdEJRVU55UkR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzVTBGQlV5eHJRa0ZCYTBJN1FVRkRNMEk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4VFFVRlRMSE5DUVVGelFqdEJRVU12UWpzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEVzY1VWQlFYRkZPenRCUVVWeVJUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxHTkJRV003UVVGRFpEdEJRVU5CTEhOQ1FVRnpRanRCUVVOMFFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVmtzUzBGQlN6dEJRVU5xUWl4WlFVRlpPMEZCUTFvN1FVRkRRVHRCUVVOQkxHZEVRVUZuUkN4alFVRmpPMEZCUXpsRU8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1MwRkJTenRCUVVOcVFpeFpRVUZaTEU5QlFVODdRVUZEYmtJc1dVRkJXVHRCUVVOYU8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJMRzFDUVVGdFFpeFBRVUZQTzBGQlF6RkNPMEZCUTBFN1FVRkRRVHRCUVVOQkxHbEVRVUZwUkN4cFFrRkJhVUk3UVVGRGJFVXNVMEZCVXp0QlFVTlVPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEVzUzBGQlN6czdRVUZGVER0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTEV0QlFVczdRVUZEYWtJc1dVRkJXU3hQUVVGUE8wRkJRMjVDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1MwRkJTenRCUVVOb1FpeFhRVUZYTEV0QlFVczdRVUZEYUVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWkxFdEJRVXM3UVVGRGFrSXNXVUZCV1N4UFFVRlBPMEZCUTI1Q0xGbEJRVms3UVVGRFdqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWk8wRkJRMW9zV1VGQldUdEJRVU5hTEZsQlFWazdRVUZEV2p0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWkxFdEJRVXM3UVVGRGFrSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1MwRkJTenRCUVVOcVFqdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWkxFdEJRVXM3UVVGRGFrSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1QwRkJUenRCUVVOdVFpeFpRVUZaTEUxQlFVMDdRVUZEYkVJc1dVRkJXVHRCUVVOYU8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hYUVVGWExFdEJRVXM3UVVGRGFFSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxHMUNRVUZ0UWl3NFFrRkJPRUk3UVVGRGFrUTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEVzYlVKQlFXMUNMRzlDUVVGdlFqdEJRVU4yUXp0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFRRVUZUT3p0QlFVVlVPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGZEJRVmNzUzBGQlN6dEJRVU5vUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRXNlVU5CUVhsRExHVkJRV1U3UVVGRGVFUTdRVUZEUVN3MlJFRkJOa1FzTmtWQlFUWkZPMEZCUXpGSk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNORU5CUVRSRExGZEJRVmNzUjBGQlJ5eHRRa0ZCYlVJN1FVRkROMFVzTmtSQlFUWkVMRFpGUVVFMlJUdEJRVU14U1R0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzZFVOQlFYVkRPMEZCUTNaRExITkVRVUZ6UkN4WFFVRlhPMEZCUTJwRkxHRkJRV0VzVjBGQlZ6dEJRVU40UWp0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZOQlFWTXNPRU5CUVRoRE8wRkJRM1pFTEZOQlFWTXNPRU5CUVRoRE8wRkJRM1pFTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFTeFRRVUZUTzBGQlExUXNTMEZCU3pzN1FVRkZURHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVTBGQlV6czdRVUZGVkR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1VVRkJVVHRCUVVOdVFpeFhRVUZYTEU5QlFVODdRVUZEYkVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1MwRkJTenRCUVVOb1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTEV0QlFVczdRVUZEYWtJc1dVRkJXVHRCUVVOYU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCV1N4TFFVRkxPMEZCUTJwQ0xGbEJRVms3UVVGRFdqdEJRVU5CTzBGQlEwRTdRVUZEUVN4MVEwRkJkVU1zWlVGQlpTeGpRVUZqTEdOQlFXTXNTVUZCU1N4bFFVRmxPMEZCUTNKSE96dEJRVVZCT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1MwRkJTenRCUVVOTU96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRkZCUVZFN1FVRkRia0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4TFFVRkxPMEZCUTB3N08wRkJSVUU3UVVGRFFUdEJRVU5CTEZkQlFWY3NVVUZCVVR0QlFVTnVRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRTFCUVUwN1FVRkRha0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGZEJRVmNzVFVGQlRUdEJRVU5xUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNWMEZCVnl4UlFVRlJPMEZCUTI1Q08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eFJRVUZSTzBGQlEyNUNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxFdEJRVXM3UVVGRFREdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hMUVVGTE96dEJRVVZNTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eExRVUZMTzBGQlEyaENMRmRCUVZjc1MwRkJTenRCUVVOb1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4dFFrRkJiVUlzYTBKQlFXdENPMEZCUTNKRE8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNWMEZCVnl4UFFVRlBPMEZCUTJ4Q08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4TFFVRkxPenRCUVVWTU8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1QwRkJUenRCUVVOdVFpeFpRVUZaTzBGQlExbzdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hYUVVGWExFdEJRVXM3UVVGRGFFSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhOUVVGTk8wRkJRMnBDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hYUVVGWExFOUJRVTg3UVVGRGJFSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJXU3hMUVVGTE8wRkJRMnBDTEZsQlFWa3NVVUZCVVR0QlFVTndRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWk8wRkJRMW83UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WlFVRlpMRTlCUVU4N1FVRkRia0lzV1VGQldUdEJRVU5hTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNWMEZCVnl4UFFVRlBPMEZCUTJ4Q08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFTeHBSVUZCWlN4bFFVRmxMRVZCUVVNaUxDSm1hV3hsSWpvaVpHRjBaWEpoYm1kbGNHbGphMlZ5TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lLR1oxYm1OMGFXOXVJSGRsWW5CaFkydFZibWwyWlhKellXeE5iMlIxYkdWRVpXWnBibWwwYVc5dUtISnZiM1FzSUdaaFkzUnZjbmtwSUh0Y2JseDBhV1lvZEhsd1pXOW1JR1Y0Y0c5eWRITWdQVDA5SUNkdlltcGxZM1FuSUNZbUlIUjVjR1Z2WmlCdGIyUjFiR1VnUFQwOUlDZHZZbXBsWTNRbktWeHVYSFJjZEcxdlpIVnNaUzVsZUhCdmNuUnpJRDBnWm1GamRHOXllU2dwTzF4dVhIUmxiSE5sSUdsbUtIUjVjR1Z2WmlCa1pXWnBibVVnUFQwOUlDZG1kVzVqZEdsdmJpY2dKaVlnWkdWbWFXNWxMbUZ0WkNsY2JseDBYSFJrWldacGJtVW9YQ0pFWVhSbGNtRnVaMlZ3YVdOclpYSmNJaXdnVzEwc0lHWmhZM1J2Y25rcE8xeHVYSFJsYkhObElHbG1LSFI1Y0dWdlppQmxlSEJ2Y25SeklEMDlQU0FuYjJKcVpXTjBKeWxjYmx4MFhIUmxlSEJ2Y25Selcxd2lSR0YwWlhKaGJtZGxjR2xqYTJWeVhDSmRJRDBnWm1GamRHOXllU2dwTzF4dVhIUmxiSE5sWEc1Y2RGeDBjbTl2ZEZ0Y0lrUmhkR1Z5WVc1blpYQnBZMnRsY2x3aVhTQTlJR1poWTNSdmNua29LVHRjYm4wcEtITmxiR1lzSUdaMWJtTjBhVzl1S0NrZ2UxeHVjbVYwZFhKdUlDSXNJaTh2SUZSb1pTQnlaWEYxYVhKbElITmpiM0JsWEc1MllYSWdYMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeUE5SUh0OU8xeHVYRzRpTENJdkx5QmtaV1pwYm1VZ1oyVjBkR1Z5SUdaMWJtTjBhVzl1Y3lCbWIzSWdhR0Z5Ylc5dWVTQmxlSEJ2Y25SelhHNWZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbVFnUFNBb1pYaHdiM0owY3l3Z1pHVm1hVzVwZEdsdmJpa2dQVDRnZTF4dVhIUm1iM0lvZG1GeUlHdGxlU0JwYmlCa1pXWnBibWwwYVc5dUtTQjdYRzVjZEZ4MGFXWW9YMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeTV2S0dSbFptbHVhWFJwYjI0c0lHdGxlU2tnSmlZZ0lWOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHVieWhsZUhCdmNuUnpMQ0JyWlhrcEtTQjdYRzVjZEZ4MFhIUlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtvWlhod2IzSjBjeXdnYTJWNUxDQjdJR1Z1ZFcxbGNtRmliR1U2SUhSeWRXVXNJR2RsZERvZ1pHVm1hVzVwZEdsdmJsdHJaWGxkSUgwcE8xeHVYSFJjZEgxY2JseDBmVnh1ZlRzaUxDSmZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbThnUFNBb2IySnFMQ0J3Y205d0tTQTlQaUFvVDJKcVpXTjBMbkJ5YjNSdmRIbHdaUzVvWVhOUGQyNVFjbTl3WlhKMGVTNWpZV3hzS0c5aWFpd2djSEp2Y0NrcElpd2lMeThnWkdWbWFXNWxJRjlmWlhOTmIyUjFiR1VnYjI0Z1pYaHdiM0owYzF4dVgxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NXlJRDBnS0dWNGNHOXlkSE1wSUQwK0lIdGNibHgwYVdZb2RIbHdaVzltSUZONWJXSnZiQ0FoUFQwZ0ozVnVaR1ZtYVc1bFpDY2dKaVlnVTNsdFltOXNMblJ2VTNSeWFXNW5WR0ZuS1NCN1hHNWNkRngwVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtHVjRjRzl5ZEhNc0lGTjViV0p2YkM1MGIxTjBjbWx1WjFSaFp5d2dleUIyWVd4MVpUb2dKMDF2WkhWc1pTY2dmU2s3WEc1Y2RIMWNibHgwVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtHVjRjRzl5ZEhNc0lDZGZYMlZ6VFc5a2RXeGxKeXdnZXlCMllXeDFaVG9nZEhKMVpTQjlLVHRjYm4wN0lpd2lMeThnWlhoMGNtRmpkR1ZrSUdKNUlHMXBibWt0WTNOekxXVjRkSEpoWTNRdGNHeDFaMmx1WEc1bGVIQnZjblFnZTMwN0lpd2lMeThnMFlIUXZ0R0IwWUxRdnRHUDBMM1F1TkdQSU5DMzBMRFFzZEM3MEw3UXV0QzQwWURRdnRDeTBMRFF2ZEM5MFl2UmhTRFF0TkN3MFlKY2NseHVaWGh3YjNKMElHTnZibk4wSUV4UFEwdGZWVTVCVmtGSlRFRkNURVVnUFNBeE8xeHlYRzVsZUhCdmNuUWdZMjl1YzNRZ1RFOURTMTlNVDBOTFJVUWdJQ0FnSUNBOUlESTdYSEpjYmx4eVhHNWpiMjV6ZENCSlRrUkZXRjlFUVZSRlgwWlNUMDBnUFNBd08xeHlYRzVqYjI1emRDQkpUa1JGV0Y5RVFWUkZYMVJQSUNBZ1BTQXhPMXh5WEc1Y2NseHVablZ1WTNScGIyNGdSR0YwWlZKaGJtZGxVR2xqYTJWeUtDUmpiMjUwWVdsdVpYSXNJRzl3ZEdsdmJuTWdQU0I3ZlNrZ2UxeHlYRzRnSUNBZ0x5OGcwTDdSZ2lEUXY5QyswTExSZ3RDKzBZRFF2ZEMrMExrZzBMalF2ZEM0MFliUXVOQ3cwTHZRdU5DMzBMRFJodEM0MExoY2NseHVJQ0FnSUdsbUlDZ2tZMjl1ZEdGcGJtVnlMbWx1YzNSaGJtTmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUNSamIyNTBZV2x1WlhJdWFXNXpkR0Z1WTJVN1hISmNiaUFnSUNCOVhISmNiaUFnSUNBa1kyOXVkR0ZwYm1WeUxtbHVjM1JoYm1ObElEMGdkR2hwY3p0Y2NseHVYSEpjYmlBZ0lDQjBhR2x6TGw4a1kyOXVkR0ZwYm1WeUlEMGdKR052Ym5SaGFXNWxjanRjY2x4dVhISmNiaUFnSUNBdkx5RFF0OUM5MExEUmg5QzEwTDNRdU5DMUlOQy8wTDRnMFlQUXZOQyswTHZSaDlDdzBMM1F1TkdPWEhKY2JpQWdJQ0JqYjI1emRDQmtkaUE5SUNoNExDQjJLU0E5UGlCMGVYQmxiMllnZUNBOVBTQW5kVzVrWldacGJtVmtKeUEvSUhZZ09pQjRPMXh5WEc1Y2NseHVJQ0FnSUhSb2FYTXViM0IwYVc5dWN5QTlJSHRjY2x4dUlDQWdJQ0FnSUNCbWFYSnpkRVJoZVU5bVZHaGxWMlZsYXpvZ1pIWW9iM0IwYVc5dWN5NW1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5d2dNU2tzSUM4dklOQy8wTFhSZ05DeTBZdlF1U0RRdE5DMTBMM1JqQ0RRdmRDMTBMVFF0ZEM3MExnc0lEQWdQU0RRc3RHQkxDQXhJRDBnMEwvUXZTd2dMaTR1WEhKY2JpQWdJQ0FnSUNBZ2MybHVaMnhsVFc5a1pUb2dJQ0FnSUNBZ0lHUjJLRzl3ZEdsdmJuTXVjMmx1WjJ4bFRXOWtaU3dnWm1Gc2MyVXBMQ0FnSUNBdkx5RFFzdEdMMExIUXZ0R0FJTkMrMExUUXZkQyswTGtnMExUUXNOR0MwWXNnMExMUXZOQzEwWUhSZ3RDK0lOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXNGeHlYRzRnSUNBZ0lDQWdJR3h2WTJGc1pUb2dJQ0FnSUNBZ0lDQWdJQ0JrZGlodmNIUnBiMjV6TG14dlkyRnNaU3dnSjNKMUxWSlZKeWtzWEhKY2JpQWdJQ0FnSUNBZ2JXbHVSR0Y1Y3pvZ0lDQWdJQ0FnSUNBZ0lHUjJLRzl3ZEdsdmJuTXViV2x1UkdGNWN5d2dNU2tzSUNBZ0lDQWdJQ0FnSUNBdkx5RFF2TkM0MEwzUXVOQzgwTERRdTlHTTBMM1F2dEMxSU5DNjBMN1F1OUM0MFlmUXRkR0IwWUxRc3RDK0lOQzAwTDNRdGRDNUlOQ3lJTkMwMExqUXNOQy8wTERRdDlDKzBMM1F0Vnh5WEc0Z0lDQWdJQ0FnSUcxdmJuUm9jME52ZFc1ME9pQWdJQ0FnSUNCa2RpaHZjSFJwYjI1ekxtMXZiblJvYzBOdmRXNTBMQ0F4TWlrc1hISmNiaUFnSUNBZ0lDQWdjR1Z5VW05M09pQWdJQ0FnSUNBZ0lDQWdJR1IyS0c5d2RHbHZibk11Y0dWeVVtOTNMQ0IxYm1SbFptbHVaV1FwTENBZ0lDQXZMeURRdXRDKzBMdlF1TkdIMExYUmdkR0MwTExRdmlEUXZOQzEwWUhSajlHRzBMWFFzaURRc2lEUmdOR1AwTFRSZzF4eVhHNGdJQ0FnSUNBZ0lHMXBia1JoZEdVNklDQWdJQ0FnSUNBZ0lDQmtkaWh2Y0hScGIyNXpMbTFwYmtSaGRHVXNJRzVsZHlCRVlYUmxLQ2twTENBZ0x5OGcwTHpRdU5DOTBMalF2TkN3MEx2UmpOQzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdJQ0FnSUNBZ0lHMWhlRVJoZEdVNklDQWdJQ0FnSUNBZ0lDQmtkaWh2Y0hScGIyNXpMbTFoZUVSaGRHVXNJSFZ1WkdWbWFXNWxaQ2tzWEhKY2JpQWdJQ0FnSUNBZ1luSmxZV3R3YjJsdWRITTZJQ0FnSUNBZ0lHUjJLRzl3ZEdsdmJuTXVZbkpsWVd0d2IybHVkSE1zSUh0OUtTeGNjbHh1SUNBZ0lDQWdJQ0JwYm5SbGNtNWhiRWx1Y0hWMGN6b2dJQ0FnWkhZb2IzQjBhVzl1Y3k1cGJuUmxjbTVoYkVsdWNIVjBjeXdnZEhKMVpTa3NJQzh2SU5DNDBZSFF2OUMrMEx2UmpOQzMwTDdRc3RDdzBMM1F1TkMxSU5DeTBZSFJndEdBMEw3UXRkQzkwTDNSaTlHRklOQzQwTDNRdjlHRDBZTFF2dEN5WEhKY2JpQWdJQ0FnSUNBZ0x5OGcwWUhRdnRDeDBZdlJndEM0MFk5Y2NseHVJQ0FnSUNBZ0lDQnZiam9nVDJKcVpXTjBMbUZ6YzJsbmJpaDdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmhibWRsVTJWc1pXTjBPaUJ1ZFd4c0xDQXZMeURSZ2RDKzBMSFJpOUdDMExqUXRTRFFzdEdMMExIUXZ0R0EwTEFnMExUUXVOQ3cwTC9Rc05DMzBMN1F2ZEN3SU5DMDBMRFJnbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmtZWGxUWld4bFkzUTZJQ0FnYm5Wc2JDd2dMeThnMFlIUXZ0Q3gwWXZSZ3RDNDBMVWcwTExSaTlDeDBMN1JnTkN3SU5DKzBMVFF2ZEMrMExrZzBMVFFzTkdDMFlzZ0tOR0MwTDdRdTlHTTBMclF2aURRdjlHQTBMZ2djMmx1WjJ4bFRXOWtaVG9nZEhKMVpTbGNjbHh1SUNBZ0lDQWdJQ0I5TENCdmNIUnBiMjV6TG05dUlIeDhJSHQ5S1N4Y2NseHVJQ0FnSUNBZ0lDQXZMeURSaE5DNDBMdlJqTkdDMFlEUmc5R08wWW5RdU5DMUlOQzgwTFhSZ3RDKzBMVFJpMXh5WEc0Z0lDQWdJQ0FnSUdacGJIUmxjam9nVDJKcVpXTjBMbUZ6YzJsbmJpaDdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHeHZZMnRFWVhsek9pQWdJQ0J1ZFd4c0xDQXZMeUJqWVd4c1ltRmpheWhrWVhSbEtTRFJoTkdEMEwzUXV0R0cwTGpSanlEUXNkQzcwTDdRdXRDNDBZRFF2dEN5MExEUXZkQzQwWThnMExUUXNOR0NMQ0IwY25WbEwweFBRMHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkRzl2YkhScGNGUmxlSFE2SUc1MWJHd3NJQzh2SUdOaGJHeGlZV05yS0dSaGVYTXBJTkN5MFl2UXN0QyswTFFnMFlMUXRkQzYwWUhSZ3RDd0lOQy8wTDdRdE5HQjBMclFzTkMzMExyUXVGeHlYRzRnSUNBZ0lDQWdJSDBzSUc5d2RHbHZibk11Wm1sc2RHVnlJSHg4SUh0OUtTeGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0IwYUdsekxtbHVhWFFvS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNZMEwzUXVOR0cwTGpRc05DNzBMalF0OUN3MFliUXVOR1BYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbWx1YVhRZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJQzh2SU5HQTBZL1F0TkM5MEw3UmdkR0MwWXhjY2x4dUlDQWdJR2xtSUNoMGVYQmxiMllnZEdocGN5NXZjSFJwYjI1ekxuQmxjbEp2ZHlBOVBTQW5kVzVrWldacGJtVmtKeWtnZTF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11YjNCMGFXOXVjeTV3WlhKU2IzY2dQU0IwYUdsekxtOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUTdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTV0YVc1RVlYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbTFwYmtSaGRHVXVjMlYwU0c5MWNuTW9NQ3dnTUN3Z01Dd2dNQ2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwTDdRdjlHRzBMalF1Q0RRdE5DNzBZOGcwWTNRdXRHQTBMRFF2ZEMrMExJZzBML1F2aURSZzlDODBMN1F1OUdIMExEUXZkQzQwWTVjY2x4dUlDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1aWNtVmhhM0J2YVc1MGMxdDBhR2x6TGw5aWNtVmhhM0J2YVc1MElEMGdNRjBnUFNCUFltcGxZM1F1WVhOemFXZHVLSHQ5TENCMGFHbHpMbTl3ZEdsdmJuTXBPMXh5WEc1Y2NseHVJQ0FnSUM4dklOR0MwTFhRdXRHRDBZblF1TkM1SU5DMDBMWFF2ZEdNWEhKY2JpQWdJQ0IwYUdsekxsOTBiMlJoZVNBOUlHNWxkeUJFWVhSbEtDazdYSEpjYmlBZ0lDQjBhR2x6TGw5MGIyUmhlUzV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVYSEpjYmlBZ0lDQjBhR2x6TGw4a2NHbGphMlZ5SUQwZ2RHaHBjeTVmSkdOeVpXRjBaVVZzWlcxbGJuUW9YSEpjYmlBZ0lDQWdJQ0FnWUR4a2FYWWdZMnhoYzNNOVhDSkVZWFJsY21GdVoyVndhV05yWlhKY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0pIdDBhR2x6TG05d2RHbHZibk11YVc1MFpYSnVZV3hKYm5CMWRITWdQMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWUR4a2FYWWdZMnhoYzNNOVhDSkVZWFJsY21GdVoyVndhV05yWlhKZlgybHVjSFYwYzF3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNSN2RHaHBjeTV2Y0hScGIyNXpMbk5wYm1kc1pVMXZaR1ZjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUHlCZ1BHbHVjSFYwSUhSNWNHVTlYQ0pvYVdSa1pXNWNJaUJ1WVcxbFBWd2laR0YwWlZ3aVBtQmNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdPaUJnUEdsdWNIVjBJSFI1Y0dVOVhDSm9hV1JrWlc1Y0lpQnVZVzFsUFZ3aVpHRjBaVjltY205dFhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4cGJuQjFkQ0IwZVhCbFBWd2lhR2xrWkdWdVhDSWdibUZ0WlQxY0ltUmhkR1ZmZEc5Y0lqNWdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1lDQTZJQ2NuWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjejFjSWtSaGRHVnlZVzVuWlhCcFkydGxjbDlmYlc5dWRHaHpYQ0krUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pFWVhSbGNtRnVaMlZ3YVdOclpYSmZYM1J2YjJ4MGFYQmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSkVZWFJsY21GdVoyVndhV05yWlhKZlgzUnZiMngwYVhBdFkyOXVkR1Z1ZEZ3aVBqd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWdYSEpjYmlBZ0lDQXBPMXh5WEc1Y2NseHVJQ0FnSUM4dklOR04wTHZRdGRDODBMWFF2ZEdDMFl0Y2NseHVJQ0FnSUhSb2FYTXVYeVJ0YjI1MGFITWdJQ0FnSUNBZ0lDQTlJSFJvYVhNdVh5UndhV05yWlhJdWNYVmxjbmxUWld4bFkzUnZjaWduTGtSaGRHVnlZVzVuWlhCcFkydGxjbDlmYlc5dWRHaHpKeWs3WEhKY2JpQWdJQ0IwYUdsekxsOGtkRzl2YkhScGNDQWdJQ0FnSUNBZ1BTQjBhR2x6TGw4a2NHbGphMlZ5TG5GMVpYSjVVMlZzWldOMGIzSW9KeTVFWVhSbGNtRnVaMlZ3YVdOclpYSmZYM1J2YjJ4MGFYQW5LVHRjY2x4dUlDQWdJSFJvYVhNdVh5UjBiMjlzZEdsd1EyOXVkR1Z1ZENBOUlIUm9hWE11WHlSd2FXTnJaWEl1Y1hWbGNubFRaV3hsWTNSdmNpZ25Ma1JoZEdWeVlXNW5aWEJwWTJ0bGNsOWZkRzl2YkhScGNDMWpiMjUwWlc1MEp5azdYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBML1F2dEM3MFk4ZzBMTFFzdEMrMExUUXNGeHlYRzRnSUNBZ2RHaHBjeTVmSkdsdWNIVjBjeUE5SUhSb2FYTXVYeVJ3YVdOclpYSXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDZ25hVzV3ZFhSYmJtRnRaVjQ5WENKa1lYUmxYQ0pkSnlrN1hISmNibHh5WEc0Z0lDQWdMeThnMExqUXZkQzQwWWJRdU5DdzBMdlF1TkMzMExEUmh0QzQwWThnMFlIUXZ0R0IwWUxRdnRHUDBMM1F1TkM1WEhKY2JpQWdJQ0IwYUdsekxsOXpaV3hsWTNScGIyNGdQU0I3ZlR0Y2NseHVYSEpjYmlBZ0lDQXZMeURSZ05DMTBMM1F0TkMxMFlCY2NseHVJQ0FnSUhSb2FYTXVYM05sYkdWamRFUmhkR1VvZEdocGN5NXZjSFJwYjI1ekxtMXBia1JoZEdVcE8xeHlYRzRnSUNBZ2RHaHBjeTVmSkdOdmJuUmhhVzVsY2k1aGNIQmxibVJEYUdsc1pDaDBhR2x6TGw4a2NHbGphMlZ5S1R0Y2NseHVYSEpjYmlBZ0lDQXZMeURRdnRDeDBZRFFzTkN4MEw3Umd0QzYwTEFnMExIUmdOQzEwTG5RdXRDLzBMN1F1TkM5MFlMUXZ0Q3lYSEpjYmlBZ0lDQnBaaUFvVDJKcVpXTjBMbXRsZVhNb2RHaHBjeTV2Y0hScGIyNXpMbUp5WldGcmNHOXBiblJ6S1M1c1pXNW5kR2dwSUh0Y2NseHVJQ0FnSUNBZ0lDQjNhVzVrYjNjdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnbmNtVnphWHBsSnl3Z2RHaHBjeTVmYjI1WGFXNWtiM2RTWlhOcGVtVkZkbVZ1ZEM1aWFXNWtLSFJvYVhNcEtUdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOXZibGRwYm1SdmQxSmxjMmw2WlVWMlpXNTBLQ2s3WEhKY2JpQWdJQ0I5WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFuZEN3MExmUXN0Q3cwTDNRdU5DMUlOQzgwTFhSZ2RHUDBZYlFzRnh5WEc0Z0tpQkFjR0Z5WVcwZ0lIdEVZWFJsZlNCa1lYUmxJTkNlMExIUml0QzEwTHJSZ2lEUXROQ3cwWUxSaTF4eVhHNGdLaUJBY21WMGRYSnVJSHRUZEhKcGJtZDlYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbWRsZEUxdmJuUm9SbTl5YldGMGRHVmtJRDBnWm5WdVkzUnBiMjRvWkdGMFpTa2dlMXh5WEc0Z0lDQWdZMjl1YzNRZ2RHbDBiR1VnUFNCMGFHbHpMbWRsZEVSaGRHVlVhVzFsUm05eWJXRjBLR1JoZEdVc0lIdHRiMjUwYURvZ0oyeHZibWNuZlNrN1hISmNiaUFnSUNCeVpYUjFjbTRnZEdsMGJHVXVjMnhwWTJVb01Dd2dNU2t1ZEc5VmNIQmxja05oYzJVb0tTQXJJSFJwZEd4bExuTnNhV05sS0RFcE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtUUXZ0R0EwTHpRc05HQzBMalJnTkMrMExMUXNOQzkwTGpRdFNEUXROQ3cwWUxSaXlEUXROQzcwWThnMFlMUXRkQzYwWVBSaWRDMTBMa2cwTHZRdnRDNjBMRFF1OUM0WEhKY2JpQXFJRUJ3WVhKaGJTQWdlMFJoZEdWOUlDQWdaR0YwWlNBZ0lDRFFudEN4MFlyUXRkQzYwWUlnMExUUXNOR0MwWXRjY2x4dUlDb2dRSEJoY21GdElDQjdUMkpxWldOMGZTQnZjSFJwYjI1eklOQ2YwTERSZ05DdzBMelF0ZEdDMFlEUmkxeHlYRzRnS2lCQWNtVjBkWEp1SUh0VGRISnBibWQ5WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG1kbGRFUmhkR1ZVYVcxbFJtOXliV0YwSUQwZ1puVnVZM1JwYjI0b1pHRjBaU3dnYjNCMGFXOXVjeWtnZTF4eVhHNGdJQ0FnY21WMGRYSnVJRWx1ZEd3dVJHRjBaVlJwYldWR2IzSnRZWFFvZEdocGN5NXZjSFJwYjI1ekxteHZZMkZzWlN3Z2IzQjBhVzl1Y3lrdVptOXliV0YwS0dSaGRHVXBPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKVFF2ZEM0SU5DOTBMWFF0TkMxMEx2UXVGeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNW5aWFJYWldWclJHRjVjMFp2Y20xaGRIUmxaQ0E5SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ1kyOXVjM1FnWkdGMFpTQTlJRzVsZHlCRVlYUmxLQ2s3WEhKY2JpQWdJQ0JqYjI1emRDQnlaWE4xYkhRZ1BTQmJYVHRjY2x4dVhISmNiaUFnSUNCa1lYUmxMbk5sZEVSaGRHVW9aR0YwWlM1blpYUkVZWFJsS0NrZ0xTQXlLVHRjY2x4dUlDQWdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnTnpzZ0t5dHBLU0I3WEhKY2JpQWdJQ0FnSUNBZ1pHRjBaUzV6WlhSRVlYUmxLR1JoZEdVdVoyVjBSR0YwWlNncElDc2dNU2s3WEhKY2JpQWdJQ0FnSUNBZ2NtVnpkV3gwTG5CMWMyZ29lMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmtZWGs2SUdSaGRHVXVaMlYwUkdGNUtDa3NYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUnBkR3hsT2lCMGFHbHpMbWRsZEVSaGRHVlVhVzFsUm05eWJXRjBLR1JoZEdVc0lIdDNaV1ZyWkdGNU9pQW5jMmh2Y25RbmZTa3NYSEpjYmlBZ0lDQWdJQ0FnZlNrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMFlIUXZ0R0EwWUxRdU5HQTBMN1FzdEM2MExBZzBZSFF2dEN6MEx2UXNOR0IwTDNRdmlEUXZkQ3cwWUhSZ3RHQTBMN1F0ZEM5MEwzUXZ0QzgwWU1nMEwvUXRkR0EwTExRdnRDODBZTWcwTFRRdmRHT0lOQzkwTFhRdE5DMTBMdlF1Rnh5WEc0Z0lDQWdjbVZ6ZFd4MExuTnZjblFvS0dFc0lHSXBJRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCbWFYSnpkRVJoZVU5bVZHaGxWMlZsYXlBOUlIUm9hWE11YjNCMGFXOXVjeTVtYVhKemRFUmhlVTltVkdobFYyVmxheUFsSURjN1hISmNiaUFnSUNBZ0lDQWdiR1YwSUdSaGVVRWdQU0JoTG1SaGVUdGNjbHh1SUNBZ0lDQWdJQ0JzWlhRZ1pHRjVRaUE5SUdJdVpHRjVPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvWkdGNVFTQTlQU0JtYVhKemRFUmhlVTltVkdobFYyVmxheWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdMVEU3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCcFppQW9aR0Y1UWlBOVBTQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z01UdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJR2xtSUNoa1lYbEJJRHdnWm1seWMzUkVZWGxQWmxSb1pWZGxaV3NwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWkdGNVFTQXJQU0J5WlhOMWJIUXViR1Z1WjNSb08xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdhV1lnS0dSaGVVSWdQQ0JtYVhKemRFUmhlVTltVkdobFYyVmxheWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JrWVhsQ0lDczlJSEpsYzNWc2RDNXNaVzVuZEdnN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1pHRjVRU0F0SUdSaGVVSTdYSEpjYmlBZ0lDQjlLVHRjY2x4dVhISmNiaUFnSUNCeVpYUjFjbTRnY21WemRXeDBPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKclF2dEM3MExqUmg5QzEwWUhSZ3RDeTBMNGcwTFRRdmRDMTBMa2cwTElnMEx6UXRkR0IwWS9SaHRDMVhISmNiaUFxSUVCd1lYSmhiU0FnZTBSaGRHVjlJR1JoZEdVZzBKN1FzZEdLMExYUXV0R0NJTkMwMExEUmd0R0xYSEpjYmlBcUlFQnlaWFIxY200Z2UwNTFiV0psY24wZ0lDQWcwSnJRdnRDNzBMalJoOUMxMFlIUmd0Q3kwTDRnMExUUXZkQzEwTGxjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WjJWMFJHRjVjME52ZFc1MFNXNU5iMjUwYUNBOUlHWjFibU4wYVc5dUtHUmhkR1VwSUh0Y2NseHVJQ0FnSUdOdmJuTjBJR1JoZVhNZ1BTQnVaWGNnUkdGMFpTaGtZWFJsTG1kbGRGUnBiV1VvS1NrN1hISmNiaUFnSUNCa1lYbHpMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNGdJQ0FnWkdGNWN5NXpaWFJOYjI1MGFDaGtZWGx6TG1kbGRFMXZiblJvS0NrZ0t5QXhLVHRjY2x4dUlDQWdJR1JoZVhNdWMyVjBSR0YwWlNnd0tUdGNjbHh1SUNBZ0lISmxkSFZ5YmlCa1lYbHpMbWRsZEVSaGRHVW9LVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2gwTEhSZ05DKzBZRWcwTExSaTlDMDBMWFF1OUMxMEwzUXZkR0wwWVVnMExUUXNOR0NYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbkpoYm1kbFVtVnpaWFFnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1VtVnpaWFFvS1R0Y2NseHVJQ0FnSUhSb2FYTXVYM05sYkdWamRHbHZiaUE5SUh0OU8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEpMUmk5QzAwTFhRdTlDMTBMM1F1TkMxSU5DMDBMalFzTkMvMExEUXQ5QyswTDNRc0NEUXROQ3cwWUpjY2x4dUlDb2dRSEJoY21GdElIdEVZWFJsZlNCa1lYUmxYMlp5YjIwZzBKM1FzTkdIMExEUXU5R00wTDNRc05HUElOQzAwTERSZ3RDd1hISmNiaUFxSUVCd1lYSmhiU0I3UkdGMFpYMGdaR0YwWlY5MGJ5QWdJTkNhMEw3UXZkQzEwWWZRdmRDdzBZOGcwTFRRc05HQzBMQmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVjbUZ1WjJWVFpXeGxZM1FnUFNCbWRXNWpkR2x2Ymloa1lYUmxYMlp5YjIwc0lHUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lHbG1JQ2doS0dSaGRHVmZabkp2YlNCcGJuTjBZVzVqWlc5bUlFUmhkR1VwSUh4OElDRW9aR0YwWlY5MGJ5QnBibk4wWVc1alpXOW1JRVJoZEdVcEtTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdSaGRHVmZabkp2YlM1elpYUkliM1Z5Y3lnd0xDQXdMQ0F3TENBd0tUdGNjbHh1SUNBZ0lHUmhkR1ZmZEc4dWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBMVFF2dEMvMFlQUmdkR0MwTGpRdk5HTDBMa2cwTFRRdU5DdzBML1FzTkMzMEw3UXZWeHlYRzRnSUNBZ2FXWWdLQ0YwYUdsekxtZGxkRWx6VW1GdVoyVlRaV3hsWTNSaFlteGxLR1JoZEdWZlpuSnZiU3dnWkdGMFpWOTBieWtwSUh0Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200N1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdZMjl1YzNRZ0pHUmhlVjltY205dElEMGdkR2hwY3k1ZkpHZGxkRVJoZVVKNVJHRjBaU2hrWVhSbFgyWnliMjBwTzF4eVhHNGdJQ0FnWTI5dWMzUWdKR1JoZVY5MGJ5QTlJSFJvYVhNdVh5Um5aWFJFWVhsQ2VVUmhkR1VvWkdGMFpWOTBieWs3WEhKY2JseHlYRzRnSUNBZ2FXWWdLQ1JrWVhsZlpuSnZiU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDUmtZWGxmWm5KdmJTNWpiR0Z6YzB4cGMzUXVZV1JrS0NkcGN5MXpaV3hsWTNSbFpDY3NJQ2RwY3kxelpXeGxZM1JsWkMxbWNtOXRKeWs3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2FXWWdLQ1JrWVhsZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNBa1pHRjVYM1J2TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMmx6TFhObGJHVmpkR1ZrSnl3Z0oybHpMWE5sYkdWamRHVmtMWFJ2SnlrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMExMUmk5QzAwTFhRdTlDMTBMM1F1TkMxSU5HTjBMdlF0ZEM4MExYUXZkR0MwTDdRc2x4eVhHNGdJQ0FnZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUW9aR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLVHRjY2x4dVhISmNiaUFnSUNBdkx5RFJnZEMrMFlYUmdOQ3cwTDNRdGRDOTBMalF0U0RSZ2RDKzBZSFJndEMrMFkvUXZkQzQwWTljY2x4dUlDQWdJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMGdQU0JrWVhSbFgyWnliMjA3WEhKY2JpQWdJQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5QWdJRDBnWkdGMFpWOTBienRjY2x4dVhISmNiaUFnSUNBdkx5RFFzdEdMMExIUXZ0R0FJTkMwMExEUmdpRFFzaURRdnRDeDBZRFFzTkdDMEwzUXZ0QzhJTkMvMEw3UmdOR1AwTFRRdXRDMVhISmNiaUFnSUNCcFppQW9aR0YwWlY5bWNtOXRJRDRnWkdGMFpWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lGdGtZWFJsWDJaeWIyMHNJR1JoZEdWZmRHOWRJRDBnVzJSaGRHVmZkRzhzSUdSaGRHVmZabkp2YlYwN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMEw3UXNkQzkwTDdRc3RDNzBMWFF2ZEM0MExVZzBMalF2ZEMvMFlQUmd0QyswTEpjY2x4dUlDQWdJR2xtSUNoMGFHbHpMbDhrYVc1d2RYUnpXMGxPUkVWWVgwUkJWRVZmUmxKUFRWMHBJSHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDhrYVc1d2RYUnpXMGxPUkVWWVgwUkJWRVZmUmxKUFRWMHVkbUZzZFdVZ1BTQjBhR2x6TG1admNtMWhkRVJoZEdVb1pHRjBaVjltY205dEtUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JwWmlBb2RHaHBjeTVmSkdsdWNIVjBjMXRKVGtSRldGOUVRVlJGWDFSUFhTa2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYeVJwYm5CMWRITmJTVTVFUlZoZlJFRlVSVjlVVDEwdWRtRnNkV1VnUFNCMGFHbHpMbVp2Y20xaGRFUmhkR1VvWkdGMFpWOTBieWs3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwWUhRdnRDeDBZdlJndEM0MExWY2NseHVJQ0FnSUhSb2FYTXVYMk5oYkd4aVlXTnJLQ2R5WVc1blpWTmxiR1ZqZENjc0lHUmhkR1ZmWm5KdmJTd2daR0YwWlY5MGJ5azdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUXBOQyswWURRdk5DdzBZTFF1TkdBMEw3UXN0Q3cwTDNRdU5DMUlOQzAwTERSZ3RHTFhISmNiaUFxSUVCd1lYSmhiU0FnZTBSaGRHVjlJQ0FnWkdGMFpTQWdJTkNlMExIUml0QzEwTHJSZ2lEUXROQ3cwWUxSaTF4eVhHNGdLaUJBY0dGeVlXMGdJSHRUZEhKcGJtZDlJR1p2Y20xaGRDRFFwTkMrMFlEUXZOQ3cwWUlnMFlIUmd0R0EwTDdRdXRDNFhISmNiaUFxSUVCeVpYUjFjbTRnZTFOMGNtbHVaMzFjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1Wm05eWJXRjBSR0YwWlNBOUlHWjFibU4wYVc5dUtHUmhkR1VzSUdadmNtMWhkQ0E5SUNkWkxXMHRaQ2NwSUh0Y2NseHVJQ0FnSUdsbUlDZ2hLR1JoZEdVZ2FXNXpkR0Z1WTJWdlppQkVZWFJsS1NrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJqdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0J5WlhSMWNtNGdabTl5YldGMExuSmxjR3hoWTJVb0oxa25MQ0JrWVhSbExtZGxkRVoxYkd4WlpXRnlLQ2twWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0xuSmxjR3hoWTJVb0oyMG5MQ0FvSnpBbklDc2dLR1JoZEdVdVoyVjBUVzl1ZEdnb0tTQXJJREVwS1M1emJHbGpaU2d0TWlrcFhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMbkpsY0d4aFkyVW9KMlFuTENBb0p6QW5JQ3NnS0dSaGRHVXVaMlYwUkdGMFpTZ3BLU2t1YzJ4cFkyVW9MVElwS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNmMFlEUXZ0Q3kwTFhSZ05DNjBMQWcwTExRdnRDMzBMelF2dEMyMEwzUXZ0R0IwWUxRdUNEUXN0R0wwTFRRdGRDNzBMWFF2ZEM0MFk4ZzBMVFFzTkdDWEhKY2JpQXFJRUJ3WVhKaGJTQWdlMFJoZEdVZ1pHRjBaVjltY205dElOQ2QwTERSaDlDdzBMdlJqTkM5MExEUmp5RFF0TkN3MFlMUXNGeHlYRzRnS2lCQWNHRnlZVzBnSUh0RVlYUmxJR1JoZEdWZmRHOGdJQ0RRbXRDKzBMM1F0ZEdIMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBcUlFQnlaWFIxY200Z2UwSnZiMnhsWVc1OVhISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExtZGxkRWx6VW1GdVoyVlRaV3hsWTNSaFlteGxJRDBnWm5WdVkzUnBiMjRvWkdGMFpWOW1jbTl0TENCa1lYUmxYM1J2S1NCN1hISmNiaUFnSUNCa1lYUmxYMlp5YjIwdWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmlBZ0lDQmtZWFJsWDNSdkxuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc1Y2NseHVJQ0FnSUdsbUlDaGtZWFJsWDJaeWIyMGdQaUJrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ1cyUmhkR1ZmWm5KdmJTd2daR0YwWlY5MGIxMGdQU0JiWkdGMFpWOTBieXdnWkdGMFpWOW1jbTl0WFR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURRdk5DNDBMM1F1TkM4MExEUXU5R00wTDNSaTlDNUlOQzAwTGpRc05DLzBMRFF0OUMrMEwxY2NseHVJQ0FnSUdOdmJuTjBJR1JwWm1ZZ1BTQk5ZWFJvTG1GaWN5aGtZWFJsWDJaeWIyMHVaMlYwVkdsdFpTZ3BJQzBnWkdGMFpWOTBieTVuWlhSVWFXMWxLQ2twSUM4Z01UQXdNQ0F2SURnMk5EQXdPMXh5WEc0Z0lDQWdhV1lnS0dScFptWWdQQ0IwYUdsekxtOXdkR2x2Ym5NdWJXbHVSR0Y1Y3lrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURRdjlHQTBMN1FzdEMxMFlEUXV0Q3dJTkMvMEw3UXY5Q3cwTFRRc05DOTBMalJqeURRc2lEUXROQzQwTERRdjlDdzBMZlF2dEM5SU5DMzBMRFFzZEM3MEw3UXV0QzQwWURRdnRDeTBMRFF2ZEM5MFl2UmhTRFF0TkN3MFlKY2NseHVJQ0FnSUdOdmJuTjBJR1JoZVNBOUlHNWxkeUJFWVhSbEtDazdYSEpjYmlBZ0lDQmtZWGt1YzJWMFZHbHRaU2hrWVhSbFgyWnliMjB1WjJWMFZHbHRaU2dwS1R0Y2NseHVYSEpjYmlBZ0lDQjNhR2xzWlNBb1pHRjVJRHdnWkdGMFpWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxsOW1hV3gwWlhKTWIyTnJSR0Y1Y3loa1lYa3BLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lHUmhlUzV6WlhSRVlYUmxLR1JoZVM1blpYUkVZWFJsS0NrZ0t5QXhLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCeVpYUjFjbTRnZEhKMVpUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DUzBZdlFzZEdBMExEUXZkQzkwTERSanlEUXZkQ3cwWWZRc05DNzBZelF2ZEN3MFk4ZzBMVFFzTkdDMExCY2NseHVJQ29nUUhKbGRIVnliaUI3UkdGMFpYMGcwSlRRc05HQzBMQmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVaMlYwUkdGMFpVWnliMjBnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lDOHZJTkM5MExEUmg5Q3cwTHZSak5DOTBMRFJqeURRdE5DdzBZTFFzQ0RRdmRDMUlOR0QwTHJRc05DMzBMRFF2ZEN3WEhKY2JpQWdJQ0JwWmlBb0lYUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYMlp5YjIwcElIdGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNDdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBMM1FzTkdIMExEUXU5R00wTDNRc05HUElOQzAwTERSZ3RDd0lOQy8wTDdRdDlDMjBMVWcwTHJRdnRDOTBMWFJoOUM5MEw3UXVWeHlYRzRnSUNBZ2FXWWdLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdklDWW1JSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMGdQaUIwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ6dGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DUzBZdlFzZEdBMExEUXZkQzkwTERSanlEUXROQ3cwWUxRc0NBb2MybHVaMnhsVFc5a1pUb2dkSEoxWlNsY2NseHVJQ29nUUhKbGRIVnliaUI3UkdGMFpYMGcwSlRRc05HQzBMQmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVaMlYwUkdGMFpTQTlJRVJoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVaMlYwUkdGMFpVWnliMjA3WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEpMUmk5Q3gwWURRc05DOTBMM1FzTkdQSU5DNjBMN1F2ZEMxMFlmUXZkQ3cwWThnMExUUXNOR0MwTEJjY2x4dUlDb2dRSEpsZEhWeWJpQjdSR0YwWlgwZzBKVFFzTkdDMExCY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVoyVjBSR0YwWlZSdklEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0F2THlEUXV0QyswTDNRdGRHSDBMM1FzTkdQSU5DMDBMRFJndEN3SU5DOTBMVWcwWVBRdXRDdzBMZlFzTkM5MExCY2NseHVJQ0FnSUdsbUlDZ2hkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNDdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBMM1FzTkdIMExEUXU5R00wTDNRc05HUElOQzAwTERSZ3RDd0lOQy8wTDdRdDlDMjBMVWcwTHJRdnRDOTBMWFJoOUM5MEw3UXVWeHlYRzRnSUNBZ2FXWWdLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMGdKaVlnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU0ErSUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjA3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLSFF1dEM3MEw3UXZkQzEwTDNRdU5DMUlDZ3hJTkN4MEw3UXNkR1IwWUFzSURJZzBMSFF2dEN4MFlEUXNDd2dOU0RRc2RDKzBMSFJnTkMrMExJcFhISmNiaUFxSUVCd1lYSmhiU0FnZTA1MWJXSmxjbjBnZG1Gc2RXVWcwSnJRdnRDNzBMalJoOUMxMFlIUmd0Q3kwTDVjY2x4dUlDb2dRSEJoY21GdElDQjdRWEp5WVhsOUlDQm1iM0p0Y3lEUW5OQ3cwWUhSZ2RDNDBMSWcwTGpRdHlBejBZVWcwWTNRdTlDMTBMelF0ZEM5MFlMUXZ0Q3lMQ0RRdk5DKzBMYlF0ZEdDSU5HQjBMN1F0TkMxMFlEUXR0Q3cwWUxSakNEUmdkQy8wTFhSaHRDNDBZVFF1TkM2MExEUmd0QyswWUFnSldRZzBMVFF1OUdQSU5DMzBMRFF2TkMxMEwzUmkxeHlYRzRnS2lCQWNtVjBkWEp1SUh0VGRISnBibWQ5WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG5Cc2RYSmhiQ0E5SUdaMWJtTjBhVzl1SUNoMllXeDFaU3dnWm05eWJYTXBJSHRjY2x4dUlDQWdJSEpsZEhWeWJpQW9kbUZzZFdVZ0pTQXhNQ0E5UFNBeElDWW1JSFpoYkhWbElDVWdNVEF3SUNFOUlERXhJRDhnWm05eWJYTmJNRjBnT2lBb2RtRnNkV1VnSlNBeE1DQStQU0F5SUNZbUlIWmhiSFZsSUNVZ01UQWdQRDBnTkNBbUppQW9kbUZzZFdVZ0pTQXhNREFnUENBeE1DQjhmQ0IyWVd4MVpTQWxJREV3TUNBK1BTQXlNQ2tnUHlCbWIzSnRjMXN4WFNBNklHWnZjbTF6V3pKZEtTa3VjbVZ3YkdGalpTZ25KV1FuTENCMllXeDFaU2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvTkMxMEwzUXROQzEwWUFnMExUUXVOQ3cwTC9Rc05DMzBMN1F2ZEN3SU5DODBMWFJnZEdQMFliUXRkQ3lYSEpjYmlBcUlFQndZWEpoYlNCN1JHRjBaWDBnWkdGMFpWOW1jbTl0SU5DZDBMRFJoOUN3MEx2UmpOQzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZkpHTnlaV0YwWlUxdmJuUm9jeUE5SUdaMWJtTjBhVzl1S0dSaGRHVmZabkp2YlNrZ2UxeHlYRzRnSUNBZ2QyaHBiR1VnS0hSb2FYTXVYeVJ0YjI1MGFITXViR0Z6ZEVWc1pXMWxiblJEYUdsc1pDa2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYeVJ0YjI1MGFITXVjbVZ0YjNabFEyaHBiR1FvZEdocGN5NWZKRzF2Ym5Sb2N5NXNZWE4wUld4bGJXVnVkRU5vYVd4a0tUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUXY5R0EwWS9SaDlDMTBMd2cwTC9RdnRDMDBZSFF1dEN3MExmUXV0R0RYSEpjYmlBZ0lDQjBhR2x6TGw5MGIyOXNkR2x3U0dsa1pTZ3BPMXh5WEc1Y2NseHVJQ0FnSUM4dklOQy8wWURRdGRHQTBMWFF2ZEMwMExYUmdDRFF2TkMxMFlIUmo5R0cwTFhRc2x4eVhHNGdJQ0FnWTI5dWMzUWdZM1Z5Y21WdWRFUmhkR1VnUFNCdVpYY2dSR0YwWlNoa1lYUmxYMlp5YjIwdVoyVjBWR2x0WlNncEtUdGNjbHh1SUNBZ0lHTnZibk4wSUNSdGIyNTBhSE1nUFNCYlhUdGNjbHh1SUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2dkR2hwY3k1dmNIUnBiMjV6TG0xdmJuUm9jME52ZFc1ME95QXJLMmtwSUh0Y2NseHVJQ0FnSUNBZ0lDQWtiVzl1ZEdoekxuQjFjMmdvZEdocGN5NWZKR055WldGMFpVMXZiblJvS0dOMWNuSmxiblJFWVhSbEtTazdYSEpjYmlBZ0lDQWdJQ0FnWTNWeWNtVnVkRVJoZEdVdWMyVjBUVzl1ZEdnb1kzVnljbVZ1ZEVSaGRHVXVaMlYwVFc5dWRHZ29LU0FySURFcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5HQTBMWFF2ZEMwMExYUmdGeHlYRzRnSUNBZ1ptOXlJQ2hzWlhRZ2FTQTlJREE3SUdrZ1BDQWtiVzl1ZEdoekxteGxibWQwYURzZ2FTQXJQU0IwYUdsekxtOXdkR2x2Ym5NdWNHVnlVbTkzS1NCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ0pISnZkeUE5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9KMlJwZGljcE8xeHlYRzRnSUNBZ0lDQWdJQ1J5YjNjdVkyeGhjM05PWVcxbElEMGdKMFJoZEdWeVlXNW5aWEJwWTJ0bGNsOWZjbTkzSnp0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnSkcxdmJuUm9jeTV6YkdsalpTaHBMQ0JwSUNzZ2RHaHBjeTV2Y0hScGIyNXpMbkJsY2xKdmR5a3VabTl5UldGamFDZ2tiVzl1ZEdnZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWtjbTkzTG1Gd2NHVnVaRU5vYVd4a0tDUnRiMjUwYUNrN1hISmNiaUFnSUNBZ0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVh5UnRiMjUwYUhNdVlYQndaVzVrUTJocGJHUW9KSEp2ZHlrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdhV1lnS0hSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBnZkh3Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGTmxiR1ZqZENoMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0TENCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieWs3WEhKY2JpQWdJQ0I5WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvTkMxMEwzUXROQzEwWUFnMEx6UXRkR0IwWS9SaHRDd1hISmNiaUFxSUVCd1lYSmhiU0I3UkdGMFpYMGdaR0YwWlNEUW5OQzEwWUhSajlHR1hISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOGtZM0psWVhSbFRXOXVkR2dnUFNCbWRXNWpkR2x2Ymloa1lYUmxLU0I3WEhKY2JpQWdJQ0JqYjI1emRDQmpkWEp5Wlc1MFRXOXVkR2dnUFNCa1lYUmxMbWRsZEUxdmJuUm9LQ2s3WEhKY2JpQWdJQ0JqYjI1emRDQnRiMjUwYUZScGRHeGxJRDBnZEdocGN5NW5aWFJOYjI1MGFFWnZjbTFoZEhSbFpDaGtZWFJsS1R0Y2NseHVJQ0FnSUdOdmJuTjBJSGRsWld0RVlYbHpJRDBnZEdocGN5NW5aWFJYWldWclJHRjVjMFp2Y20xaGRIUmxaQ2dwTzF4eVhHNWNjbHh1SUNBZ0lHTnZibk4wSUNSdGIyNTBhQ0E5SUhSb2FYTXVYeVJqY21WaGRHVkZiR1Z0Wlc1MEtGeHlYRzRnSUNBZ0lDQWdJR0E4WkdsMklHTnNZWE56UFZ3aVRXOXVkR2hjSWlCa1lYUmhMWFJwYldVOVhDSWtlMlJoZEdVdVoyVjBWR2x0WlNncGZWd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpVFc5dWRHaGZYMmhsWVdSbGNsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrMXZiblJvWDE5aGNuSnZkeUJOYjI1MGFGOWZZWEp5YjNjdExYQnlaWFlrZXloMGFHbHpMbTl3ZEdsdmJuTXViV2x1UkdGMFpTQW1KaUJrWVhSbElEdzlJSFJvYVhNdWIzQjBhVzl1Y3k1dGFXNUVZWFJsS1NBL0lDY2dhWE10WkdsellXSnNaV1FuSURvZ0p5ZDlYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4yWnlCM2FXUjBhRDFjSWpoY0lpQm9aV2xuYUhROVhDSXhORndpSUhacFpYZENiM2c5WENJd0lEQWdPQ0F4TkZ3aUlHWnBiR3c5WENKdWIyNWxYQ0lnZUcxc2JuTTlYQ0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh5TURBd0wzTjJaMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGNHRjBhQ0JrUFZ3aVRUY2dNVE5NTVNBM1REY2dNVndpSUhOMGNtOXJaVDFjSWlNNFF6aERPRU5jSWlCemRISnZhMlV0ZDJsa2RHZzlYQ0l5WENJZ2MzUnliMnRsTFd4cGJtVmpZWEE5WENKeWIzVnVaRndpSUhOMGNtOXJaUzFzYVc1bGFtOXBiajFjSW5KdmRXNWtYQ0krUEM5d1lYUm9QbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjM1puUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWd2lUVzl1ZEdoZlgzUnBkR3hsWENJK0pIdHRiMjUwYUZScGRHeGxmU0FrZTJSaGRHVXVaMlYwUm5Wc2JGbGxZWElvS1gwOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUY5ZllYSnliM2NnVFc5dWRHaGZYMkZ5Y205M0xTMXVaWGgwSkhzb2RHaHBjeTV2Y0hScGIyNXpMbTFoZUVSaGRHVWdKaVlnWkdGMFpTQStQU0IwYUdsekxtOXdkR2x2Ym5NdWJXRjRSR0YwWlNrZ1B5QW5JR2x6TFdScGMyRmliR1ZrSnlBNklDY25mVndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZG1jZ2QybGtkR2c5WENJNFhDSWdhR1ZwWjJoMFBWd2lNVFJjSWlCMmFXVjNRbTk0UFZ3aU1DQXdJRGdnTVRSY0lpQm1hV3hzUFZ3aWJtOXVaVndpSUhodGJHNXpQVndpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWRjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BIQmhkR2dnWkQxY0lrMHhJREF1T1RrNU9UazVURGNnTjB3eElERXpYQ0lnYzNSeWIydGxQVndpSXpoRE9FTTRRMXdpSUhOMGNtOXJaUzEzYVdSMGFEMWNJakpjSWlCemRISnZhMlV0YkdsdVpXTmhjRDFjSW5KdmRXNWtYQ0lnYzNSeWIydGxMV3hwYm1WcWIybHVQVndpY205MWJtUmNJajQ4TDNCaGRHZytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpkbWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUY5ZmQyVmxhMXdpUGlSN2QyVmxhMFJoZVhNdWJXRndLR2wwWlcwZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR0E4WkdsMklHTnNZWE56UFZ3aVRXOXVkR2hmWDNkbFpXdGtZWGxjSWo0a2UybDBaVzB1ZEdsMGJHVjlQQzlrYVhZK1lGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCOUtTNXFiMmx1S0NjbktYMDhMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrMXZiblJvWDE5a1lYbHpYQ0krUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnUEM5a2FYWStZRnh5WEc0Z0lDQWdLVHRjY2x4dVhISmNiaUFnSUNBdkx5RFJnZEdDMFlEUXRkQzcwTHJRdUZ4eVhHNGdJQ0FnVzF4eVhHNGdJQ0FnSUNBZ0lIdHpaV3hsWTNSdmNqb2dKeTVOYjI1MGFGOWZZWEp5YjNjdExYQnlaWFluTENCdVlXMWxPaUFuY0hKbGRpZDlMRnh5WEc0Z0lDQWdJQ0FnSUh0elpXeGxZM1J2Y2pvZ0p5NU5iMjUwYUY5ZllYSnliM2N0TFc1bGVIUW5MQ0J1WVcxbE9pQW5ibVY0ZENkOUxGeHlYRzRnSUNBZ1hTNW1iM0pGWVdOb0tHbDBaVzBnUFQ0Z2UxeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElDUmhjbkp2ZHlBOUlDUnRiMjUwYUM1eGRXVnllVk5sYkdWamRHOXlLR2wwWlcwdWMyVnNaV04wYjNJcE8xeHlYRzRnSUNBZ0lDQWdJQ1JoY25KdmR5NWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGpiR2xqYXljc0lHVWdQVDRnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlEUXN0R0EwTFhRdk5DMTBMM1F2ZEN3MFk4ZzBMelF0ZEdBMExBc0lOQzcwWVBSaDlHSTBMVWcwTC9RdGRHQTBMWFFzdEMxMFlEUmdkR0MwTERSZ3RHTUxDRFFzdEdMMEwzUXRkR0IwWUxRdUNEUmdkR0MwWURRdGRDNzBMclF1Q0RRdDlDd0lOQy8wWURRdGRDMDBMWFF1OUdMSU5DLzBMWFJnTkMxMFlEUXRkR0EwTGpSZ2RDKzBMTFJpOUN5MExEUXRkQzgwTDdRdVNEUXZ0Q3gwTHZRc05HQjBZTFF1Q0RRdjlDNDBMclF0ZEdBMExCY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWlM1emRHOXdVSEp2Y0dGbllYUnBiMjRvS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11WDI5dVFYSnliM2REYkdsamF5Z2tZWEp5YjNjc0lHbDBaVzB1Ym1GdFpTazdYSEpjYmlBZ0lDQWdJQ0FnZlNrN1hISmNiaUFnSUNCOUtUdGNjbHh1WEhKY2JpQWdJQ0F2THlEUmdOQzEwTDNRdE5DMTBZQWcwTFRRdmRDMTBMbGNjbHh1SUNBZ0lHTnZibk4wSUNSa1lYbHpJRDBnSkcxdmJuUm9MbkYxWlhKNVUyVnNaV04wYjNJb0p5NU5iMjUwYUY5ZlpHRjVjeWNwTzF4eVhHNGdJQ0FnWTI5dWMzUWdaR0Y1Y3lBOUlHNWxkeUJFWVhSbEtHUmhkR1V1WjJWMFZHbHRaU2dwS1R0Y2NseHVJQ0FnSUdSaGVYTXVjMlYwUkdGMFpTZ3hLVHRjY2x4dUlDQWdJR1JoZVhNdWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmx4eVhHNGdJQ0FnZDJocGJHVWdLR1JoZVhNdVoyVjBUVzl1ZEdnb0tTQTlQU0JqZFhKeVpXNTBUVzl1ZEdncElIdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQWtkMlZsYXlBOUlIUm9hWE11WHlSamNtVmhkR1ZYWldWcktDazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lIZGxaV3RFWVhsekxtWnZja1ZoWTJnb2FYUmxiU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaGtZWGx6TG1kbGRFUmhlU2dwSUNFOUlHbDBaVzB1WkdGNUlIeDhJR1JoZVhNdVoyVjBUVzl1ZEdnb0tTQWhQU0JqZFhKeVpXNTBUVzl1ZEdncElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ1IzWldWckxtRndjR1Z1WkVOb2FXeGtLSFJvYVhNdVh5UmpjbVZoZEdWRmJYQjBlVVJoZVNncEtUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJqdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdKSGRsWldzdVlYQndaVzVrUTJocGJHUW9kR2hwY3k1ZkpHTnlaV0YwWlVSaGVTaGtZWGx6S1NrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGVYTXVjMlYwUkdGMFpTaGtZWGx6TG1kbGRFUmhkR1VvS1NBcklERXBPMXh5WEc0Z0lDQWdJQ0FnSUgwcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBa1pHRjVjeTVoY0hCbGJtUkRhR2xzWkNna2QyVmxheWs3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2NtVjBkWEp1SUNSdGIyNTBhRHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2EwTHZRdU5DNklOQy8wTDRnMFlIUmd0R0EwTFhRdTlDNjBMVWcwTC9RdGRHQTBMWFF1dEM3MFk3Umg5QzEwTDNRdU5HUElOQzgwTFhSZ2RHUDBZYlFzRnh5WEc0Z0tpQkFjR0Z5WVcwZ2UwVnNaVzFsYm5SOUlDUmhjbkp2ZHlCSVZFMU1JTkdOMEx2UXRkQzgwTFhRdmRHQ1hISmNiaUFxSUVCd1lYSmhiU0I3VTNSeWFXNW5mU0J1WVcxbElDQWdJTkNZMEx6Ump5QW9jSEpsZGl3Z2JtVjRkQ2xjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDI5dVFYSnliM2REYkdsamF5QTlJR1oxYm1OMGFXOXVLQ1JoY25KdmR5d2dibUZ0WlNrZ2UxeHlYRzRnSUNBZ2FXWWdLQ1JoY25KdmR5NWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMmx6TFdScGMyRmliR1ZrSnlrcElIdGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdZMjl1YzNRZ1pHRjBaU0E5SUc1bGR5QkVZWFJsS0hCaGNuTmxTVzUwS0hSb2FYTXVYeVJ0YjI1MGFITXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxrMXZiblJvSnlrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcE8xeHlYRzRnSUNBZ1pHRjBaUzV6WlhSTmIyNTBhQ2hrWVhSbExtZGxkRTF2Ym5Sb0tDa2dLeUFvYm1GdFpTQTlQU0FuY0hKbGRpY2dQeUF0ZEdocGN5NXZjSFJwYjI1ekxtMXZiblJvYzBOdmRXNTBJRG9nZEdocGN5NXZjSFJwYjI1ekxtMXZiblJvYzBOdmRXNTBLU2s3WEhKY2JseHlYRzRnSUNBZ0x5OGcwTExSaTlHRjBMN1F0Q0RRdDlDd0lOQy8wWURRdGRDMDBMWFF1OUdMSU5DODBMalF2ZEM0MEx6UXNOQzcwWXpRdmRDKzBMa2cwTFRRc05HQzBZdGNjbHh1SUNBZ0lHbG1JQ2hrWVhSbElEd2dkR2hwY3k1dmNIUnBiMjV6TG0xcGJrUmhkR1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQmtZWFJsTG5ObGRGUnBiV1VvZEdocGN5NXZjSFJwYjI1ekxtMXBia1JoZEdVdVoyVjBWR2x0WlNncEtUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUXN0R0wwWVhRdnRDMElOQzMwTEFnMEwvUmdOQzEwTFRRdGRDNzBZc2cwTHpRc05DNjBZSFF1TkM4MExEUXU5R00wTDNRdnRDNUlOQzAwTERSZ3RHTFhISmNiaUFnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG0xaGVFUmhkR1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCbGJtUkVZWFJsSUQwZ2JtVjNJRVJoZEdVb1pHRjBaUzVuWlhSVWFXMWxLQ2twTzF4eVhHNGdJQ0FnSUNBZ0lHVnVaRVJoZEdVdWMyVjBUVzl1ZEdnb1pXNWtSR0YwWlM1blpYUk5iMjUwYUNncElDc2dkR2hwY3k1dmNIUnBiMjV6TG0xdmJuUm9jME52ZFc1MEtUdGNjbHh1SUNBZ0lDQWdJQ0JwWmlBb1pXNWtSR0YwWlNBK0lIUm9hWE11YjNCMGFXOXVjeTV0WVhoRVlYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR1JoZEdVdWMyVjBWR2x0WlNoMGFHbHpMbTl3ZEdsdmJuTXViV0Y0UkdGMFpTNW5aWFJVYVcxbEtDa3BPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmtZWFJsTG5ObGRFMXZiblJvS0dSaGRHVXVaMlYwVFc5dWRHZ29LU0F0SUhSb2FYTXViM0IwYVc5dWN5NXRiMjUwYUhORGIzVnVkQ0FySURFcE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFF2OUMxMFlEUXRkR0YwTDdRdENEUXVpRFF2ZEMrMExMUXZ0QzVJTkMwMExEUmd0QzFYSEpjYmlBZ0lDQjBhR2x6TGw5elpXeGxZM1JFWVhSbEtHUmhkR1VwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwS1BSZ2RHQzBMRFF2ZEMrMExMUXV0Q3dJTkdDMExYUXV0R0QwWW5RdGRDNUlOQzAwTERSZ3RHTElOR0JJTkdBMExYUXZkQzAwTFhSZ05DKzBMeGNjbHh1SUNvZ1FIQmhjbUZ0SUh0RVlYUmxmU0JrWVhSbElOQ1UwTERSZ3RDd1hISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOXpaV3hsWTNSRVlYUmxJRDBnWm5WdVkzUnBiMjRvWkdGMFpTa2dlMXh5WEc0Z0lDQWdkR2hwY3k1ZmMyVnNaV04wWldSRVlYUmxJRDBnWkdGMFpUdGNjbHh1SUNBZ0lIUm9hWE11WHlSamNtVmhkR1ZOYjI1MGFITW9aR0YwWlNrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRb05DMTBMM1F0TkMxMFlBZzBMM1F0ZEMwMExYUXU5QzRYSEpjYmlBcUlFQndZWEpoYlNBZ2UwUmhkR1Y5SUdSaGRHVWcwSjdRc2RHSzBMWFF1dEdDSU5DMDBMRFJndEdMWEhKY2JpQXFJRUJ5WlhSMWNtNGdlMFZzWlcxbGJuUjlYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDhrWTNKbFlYUmxWMlZsYXlBOUlHWjFibU4wYVc5dUtHUmhkR1VwSUh0Y2NseHVJQ0FnSUdOdmJuTjBJQ1IzWldWcklEMGdkR2hwY3k1ZkpHTnlaV0YwWlVWc1pXMWxiblFvWEhKY2JpQWdJQ0FnSUNBZ1lEeGthWFlnWTJ4aGMzTTlYQ0pYWldWclhDSStQQzlrYVhZK1lGeHlYRzRnSUNBZ0tUdGNjbHh1WEhKY2JpQWdJQ0J5WlhSMWNtNGdKSGRsWldzN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRb05DMTBMM1F0TkMxMFlBZzBMVFF2ZEdQWEhKY2JpQXFJRUJ3WVhKaGJTQWdlMFJoZEdWOUlHUmhkR1VnMEo3UXNkR0swTFhRdXRHQ0lOQzAwTERSZ3RHTFhISmNiaUFxSUVCeVpYUjFjbTRnZTBWc1pXMWxiblI5WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw4a1kzSmxZWFJsUkdGNUlEMGdablZ1WTNScGIyNG9aR0YwWlNrZ2UxeHlYRzRnSUNBZ1kyOXVjM1FnSkdSaGVTQTlJSFJvYVhNdVh5UmpjbVZoZEdWRmJHVnRaVzUwS0Z4eVhHNGdJQ0FnSUNBZ0lHQThaR2wySUdOc1lYTnpQVndpUkdGNVhDSWdaR0YwWVMxMGFXMWxQVndpSkh0a1lYUmxMbWRsZEZScGJXVW9LWDFjSWlCa1lYUmhMV1JoZVQxY0lpUjdaR0YwWlM1blpYUkVZWGtvS1gxY0lqNGtlMlJoZEdVdVoyVjBSR0YwWlNncGZUd3ZaR2wyUG1CY2NseHVJQ0FnSUNrN1hISmNibHh5WEc0Z0lDQWdKR1JoZVM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkamJHbGpheWNzSUhSb2FYTXVYMjl1UkdGNVEyeHBZMnRGZG1WdWRDNWlhVzVrS0hSb2FYTXBLVHRjY2x4dVhISmNiaUFnSUNCcFppQW9JWFJvYVhNdWIzQjBhVzl1Y3k1emFXNW5iR1ZOYjJSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSkdSaGVTNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZHRiM1Z6WldWdWRHVnlKeXdnZEdocGN5NWZiMjVFWVhsTmIzVnpaVVZ1ZEdWeVJYWmxiblF1WW1sdVpDaDBhR2x6S1NrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMEw3UXNkQzkwTDdRc3RDNzBMWFF2ZEM0MExVZzBZSFF2dEdCMFlMUXZ0R1AwTDNRdU5DNVhISmNiaUFnSUNCMGFHbHpMbDkxY0dSaGRHVkVZWGtvSkdSaGVTazdYSEpjYmx4eVhHNGdJQ0FnY21WMGRYSnVJQ1JrWVhrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRbnRDeDBMM1F2dEN5MEx2UXRkQzkwTGpRdFNEUmdkQyswWUhSZ3RDKzBZL1F2ZEM0MExsY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdWRYQmtZWFJsSUQwZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjBhR2x6TGw4a2JXOXVkR2h6TG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvSnk1TmIyNTBhQ2NwTG1admNrVmhZMmdvSkcxdmJuUm9JRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw5MWNHUmhkR1ZOYjI1MGFDZ2tiVzl1ZEdncE8xeHlYRzRnSUNBZ2ZTazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW50Q3gwTDNRdnRDeTBMdlF0ZEM5MExqUXRTRFJnZEMrMFlIUmd0QyswWS9RdmRDNDBMa2cwTHpRdGRHQjBZL1JodEN3WEhKY2JpQXFJRUJ3WVhKaGJTQjdSV3hsYldWdWRIMGdKRzF2Ym5Sb0lOQ3QwTHZRdGRDODBMWFF2ZEdDSU5DODBMWFJnZEdQMFliUXNGeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZkWEJrWVhSbFRXOXVkR2dnUFNCbWRXNWpkR2x2Ymlna2JXOXVkR2dwSUh0Y2NseHVJQ0FnSUNSdGIyNTBhQzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2N1UkdGNVcyUmhkR0V0ZEdsdFpWMG5LUzVtYjNKRllXTm9LQ1JrWVhrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM1Z3WkdGMFpVUmhlU2drWkdGNUtUdGNjbHh1SUNBZ0lIMHBPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKN1FzZEM5MEw3UXN0QzcwTFhRdmRDNDBMVWcwWUhRdnRHQjBZTFF2dEdQMEwzUXVOQzVJTkMwMEwzUmoxeHlYRzRnS2lCQWNHRnlZVzBnZTBWc1pXMWxiblI5SUNSa1lYa2cwSzNRdTlDMTBMelF0ZEM5MFlJZzBMVFF2ZEdQWEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw5MWNHUmhkR1ZFWVhrZ1BTQm1kVzVqZEdsdmJpZ2taR0Y1S1NCN1hISmNiaUFnSUNCamIyNXpkQ0JrWVhSbElDQWdQU0J1WlhjZ1JHRjBaU2h3WVhKelpVbHVkQ2drWkdGNUxtUmhkR0Z6WlhRdWRHbHRaU3dnTVRBcEtUdGNjbHh1SUNBZ0lHTnZibk4wSUd4dlkydGxaQ0E5SUhSb2FYTXVYMlpwYkhSbGNreHZZMnRFWVhsektHUmhkR1VwTzF4eVhHNGdJQ0FnWTI5dWMzUWdkRzlrWVhrZ0lEMGdkR2hwY3k1ZmRHOWtZWGt1WjJWMFZHbHRaU2dwSUQwOUlHUmhkR1V1WjJWMFZHbHRaU2dwTzF4eVhHNWNjbHh1SUNBZ0lDUmtZWGt1WTJ4aGMzTk1hWE4wTG5SdloyZHNaU2duYVhNdFpHbHpZV0pzWldRbkxDQnNiMk5yWldRcE8xeHlYRzRnSUNBZ0pHUmhlUzVqYkdGemMweHBjM1F1ZEc5bloyeGxLQ2RwY3kxc2IyTnJaV1FuTENCc2IyTnJaV1FnUFQwZ1RFOURTMTlNVDBOTFJVUXBPMXh5WEc0Z0lDQWdKR1JoZVM1amJHRnpjMHhwYzNRdWRHOW5aMnhsS0NkcGN5MTBiMlJoZVNjc0lIUnZaR0Y1S1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNoMEw3UXNkR0wwWUxRdU5DMUlOQzYwTHZRdU5DNjBMQWcwTC9RdmlEUXROQzkwWTVjY2x4dUlDb2dRSEJoY21GdElIdEZkbVZ1ZEgwZ1pTQkVUMDBnMFlIUXZ0Q3gwWXZSZ3RDNDBMVmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYMjl1UkdGNVEyeHBZMnRGZG1WdWRDQTlJR1oxYm1OMGFXOXVLR1VwSUh0Y2NseHVJQ0FnSUhSb2FYTXVYMjl1UkdGNVEyeHBZMnNvWlM1MFlYSm5aWFFwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwS0hRdnRDeDBZdlJndEM0MExVZzBZWFF2dEN5MExYUmdOQ3dYSEpjYmlBcUlFQndZWEpoYlNCN1JYWmxiblI5SUdVZ1JFOU5JTkdCMEw3UXNkR0wwWUxRdU5DMVhISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOXZia1JoZVUxdmRYTmxSVzUwWlhKRmRtVnVkQ0E5SUdaMWJtTjBhVzl1S0dVcElIdGNjbHh1SUNBZ0lIUm9hWE11WDI5dVJHRjVUVzkxYzJWRmJuUmxjaWhsTG5SaGNtZGxkQ2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFwZEMrMExMUXRkR0FJTkM5MExBZzBZM1F1OUMxMEx6UXRkQzkwWUxRdFNEUXROQzkwWTljY2x4dUlDb2dRSEJoY21GdElIdEZiR1Z0Wlc1MGZTQWtaR0Y1SUVoVVRVd2cwSzNRdTlDMTBMelF0ZEM5MFlKY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgyOXVSR0Y1VFc5MWMyVkZiblJsY2lBOUlHWjFibU4wYVc5dUtDUmtZWGtwSUh0Y2NseHVJQ0FnSUdsbUlDZ2hkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTQjhmQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCcFppQW9KR1JoZVM1a1lYUmhjMlYwTG5ScGJXVWdQVDBnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiUzVuWlhSVWFXMWxLQ2twSUh0Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200N1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdZMjl1YzNRZ1pHRjBaVjkwYnlBOUlHNWxkeUJFWVhSbEtIQmhjbk5sU1c1MEtDUmtZWGt1WkdGMFlYTmxkQzUwYVcxbExDQXhNQ2twTzF4eVhHNGdJQ0FnZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUW9kR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTd2daR0YwWlY5MGJ5azdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW10QzcwTGpRdWlEUXY5QytJTkMwMEwzUmpseHlYRzRnS2lCQWNHRnlZVzBnZTBWc1pXMWxiblI5SUNSa1lYa2dTRlJOVENEUXJkQzcwTFhRdk5DMTBMM1JnbHh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmYjI1RVlYbERiR2xqYXlBOUlHWjFibU4wYVc5dUtDUmtZWGtwSUh0Y2NseHVJQ0FnSUM4dklOQzAwTFhRdmRHTUlOQzMwTERRc2RDNzBMN1F1dEM0MFlEUXZ0Q3kwTERRdlZ4eVhHNGdJQ0FnYVdZZ0tDUmtZWGt1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkcGN5MWthWE5oWW14bFpDY3BLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQ3kwWXZRc2RDKzBZQWcwTDdRdE5DOTBMN1F1U0RRdE5DdzBZTFJpMXh5WEc0Z0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NXphVzVuYkdWTmIyUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTV5WVc1blpWSmxjMlYwS0NrN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTQTlJRzVsZHlCRVlYUmxLSEJoY25ObFNXNTBLQ1JrWVhrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcFhISmNiaUFnSUNBZ0lDQWdKR1JoZVM1amJHRnpjMHhwYzNRdVlXUmtLQ2RwY3kxelpXeGxZM1JsWkNjcE8xeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgyTmhiR3hpWVdOcktDZGtZWGxUWld4bFkzUW5MQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRLVHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwWUhRc2RHQTBMN1JnU0RRc3RHTDBMSFJnTkN3MEwzUXZkQyswTFBRdmlEUmdOQ3cwTDNRdGRDMUlOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXNGeHlYRzRnSUNBZ2FXWWdLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMGdKaVlnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbkpoYm1kbFVtVnpaWFFvS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWtaR0Y1TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMmx6TFhObGJHVmpkR1ZrSnlrN1hISmNibHh5WEc0Z0lDQWdMeThnMExMUmk5Q3gwWURRc05DOTBMQWcwTDNRc05HSDBMRFF1OUdNMEwzUXNOR1BJQzhnMExyUXZ0QzkwTFhSaDlDOTBMRFJqeURRdE5DdzBZTFFzRnh5WEc0Z0lDQWdhV1lnS0NGMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0S1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTQTlJRzVsZHlCRVlYUmxLSEJoY25ObFNXNTBLQ1JrWVhrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcE8xeHlYRzRnSUNBZ2ZTQmxiSE5sSUdsbUlDZ2hkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5QTlJRzVsZHlCRVlYUmxLSEJoY25ObFNXNTBLQ1JrWVhrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJR2xtSUNoMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0SUNZbUlIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdMeThnMExUUXZ0Qy8wWVBSZ2RHQzBMalF2TkdMMExrZzBMVFF1TkN3MEwvUXNOQzMwTDdRdlZ4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2doZEdocGN5NW5aWFJKYzFKaGJtZGxVMlZzWldOMFlXSnNaU2gwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRMQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5a3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1eVlXNW5aVkpsYzJWMEtDazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11Y21GdVoyVlRaV3hsWTNRb2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlN3Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwTzF4eVhHNGdJQ0FnZlZ4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSkxRdU5DMzBZUFFzTkM3MFl6UXZkR0wwTGtnMFlIUXNkR0EwTDdSZ1NEUXN0R0wwTFRRdGRDNzBMWFF2ZEM5MFl2UmhTRFF0TkN3MFlKY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgzSmhibWRsVm1semRXRnNVbVZ6WlhRZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJR052Ym5OMElDUmtZWGx6SUQwZ2RHaHBjeTVmSkcxdmJuUm9jeTV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2N1UkdGNVcyUmhkR0V0ZEdsdFpWMG5LVHRjY2x4dUlDQWdJQ1JrWVhsekxtWnZja1ZoWTJnb0pHUmhlU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdKR1JoZVM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkcGN5MXpaV3hsWTNSbFpDY3NJQ2RwY3kxelpXeGxZM1JsWkMxbWNtOXRKeXdnSjJsekxYTmxiR1ZqZEdWa0xYUnZKeXdnSjJsekxYTmxiR1ZqZEdWa0xXSmxkSGRsWlc0bktUdGNjbHh1SUNBZ0lIMHBPMXh5WEc1Y2NseHVJQ0FnSUM4dklOQy8wWURSajlHSDBMWFF2Q0RRdjlDKzBMVFJnZEM2MExEUXQ5QzYwWU5jY2x4dUlDQWdJSFJvYVhNdVgzUnZiMngwYVhCSWFXUmxLQ2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFrdEM0MExmUmc5Q3cwTHZSak5DOTBMN1F0U0RRc3RHTDBMVFF0ZEM3MExYUXZkQzQwTFVnMExUUXNOR0NYSEpjYmlBcUlFQndZWEpoYlNCN1JHRjBaWDBnWkdGMFpWOW1jbTl0SU5DZDBMRFJoOUN3MEx2UmpOQzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdLaUJBY0dGeVlXMGdlMFJoZEdWOUlHUmhkR1ZmZEc4Z0lDRFFtdEMrMEwzUXRkR0gwTDNRc05HUElOQzAwTERSZ3RDd1hISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDQTlJR1oxYm1OMGFXOXVLR1JoZEdWZlpuSnZiU3dnWkdGMFpWOTBieWtnZTF4eVhHNGdJQ0FnYVdZZ0tHUmhkR1ZmWm5KdmJTQW1KaUJrWVhSbFgyWnliMjBnYVc1emRHRnVZMlZ2WmlCRVlYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ1pHRjBaVjltY205dExuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdsbUlDaGtZWFJsWDNSdklDWW1JR1JoZEdWZmRHOGdhVzV6ZEdGdVkyVnZaaUJFWVhSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnWkdGMFpWOTBieTV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnNaWFFnZEdsdFpWOW1jbTl0SUQwZ1pHRjBaVjltY205dElHbHVjM1JoYm1ObGIyWWdSR0YwWlNBL0lHUmhkR1ZmWm5KdmJTNW5aWFJVYVcxbEtDa2dPaUF3TzF4eVhHNGdJQ0FnYkdWMElIUnBiV1ZmZEc4Z1BTQmtZWFJsWDNSdklHbHVjM1JoYm1ObGIyWWdSR0YwWlNBL0lHUmhkR1ZmZEc4dVoyVjBWR2x0WlNncElEb2dNRHRjY2x4dUlDQWdJR2xtSUNoMGFXMWxYMlp5YjIwZ1BpQjBhVzFsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnVzNScGJXVmZabkp2YlN3Z2RHbHRaVjkwYjEwZ1BTQmJkR2x0WlY5MGJ5d2dkR2x0WlY5bWNtOXRYVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFFzdEdMMExUUXRkQzcwTFhRdmRDNDBMVWcwTFRRc05HQ0lOQzgwTFhRdHRDMDBZTWcwTDNRc05HSDBMRFF1OUdNMEwzUXZ0QzVJTkM0SU5DNjBMN1F2ZEMxMFlmUXZkQyswTGxjY2x4dUlDQWdJR052Ym5OMElDUmtZWGx6SUQwZ2RHaHBjeTVmSkcxdmJuUm9jeTV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2N1UkdGNVcyUmhkR0V0ZEdsdFpWMG5LVHRjY2x4dUlDQWdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnSkdSaGVYTXViR1Z1WjNSb095QXJLMmtwSUh0Y2NseHVJQ0FnSUNBZ0lDQWtaR0Y1YzF0cFhTNWpiR0Z6YzB4cGMzUXVkRzluWjJ4bEtDZHBjeTF6Wld4bFkzUmxaQzFpWlhSM1pXVnVKeXdnSkdSaGVYTmJhVjB1WkdGMFlYTmxkQzUwYVcxbElENGdkR2x0WlY5bWNtOXRJQ1ltSUNSa1lYbHpXMmxkTG1SaGRHRnpaWFF1ZEdsdFpTQThJSFJwYldWZmRHOHBPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQ3kwWXZRdE5DMTBMdlF0ZEM5MExqUXRTRFF2ZEN3MFlmUXNOQzcwWXpRdmRDKzBMa2cwTGdnMExyUXZ0QzkwTFhSaDlDOTBMN1F1U0RRdjlDKzBMZlF1TkdHMExqUXVGeHlYRzRnSUNBZ1kyOXVjM1FnSkdSaGVWOW1jbTl0SUQwZ2RHaHBjeTVmSkdkbGRFUmhlVUo1UkdGMFpTaGtZWFJsWDJaeWIyMHBPMXh5WEc0Z0lDQWdZMjl1YzNRZ0pHUmhlVjkwYnlBOUlIUm9hWE11WHlSblpYUkVZWGxDZVVSaGRHVW9aR0YwWlY5MGJ5azdYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBMclF0ZEdJSU5DMDBMdlJqeURRc2RHTDBZSFJndEdBMEw3UXM5QytJTkdCMExIUmdOQyswWUhRc0NEUmdkR0MwTERSZ05DKzBMUFF2aURRc3RHTDBMVFF0ZEM3MExYUXZkQzQwWTljY2x4dUlDQWdJR2xtSUNoMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQzRrWkdGNVgyWnliMjFmYjJ4a0lDWW1JSFJvYVhNdVgzSmhibWRsVm1semRXRnNVMlZzWldOMExpUmtZWGxmWm5KdmJWOXZiR1FnSVQwZ0pHUmhlVjltY205dEtTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUXVKR1JoZVY5bWNtOXRYMjlzWkM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkcGN5MXpaV3hsWTNSbFpDY3NJQ2RwY3kxelpXeGxZM1JsWkMxbWNtOXRKeWs3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwTHJRdGRHSUlOQzAwTHZSanlEUXNkR0wwWUhSZ3RHQTBMN1FzOUMrSU5HQjBMSFJnTkMrMFlIUXNDRFJnZEdDMExEUmdOQyswTFBRdmlEUXN0R0wwTFRRdGRDNzBMWFF2ZEM0MFk5Y2NseHVJQ0FnSUdsbUlDaDBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGTmxiR1ZqZEM0a1pHRjVYM1J2WDI5c1pDQW1KaUIwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDNGtaR0Y1WDNSdlgyOXNaQ0FoUFNBa1pHRjVYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFRaV3hsWTNRdUpHUmhlVjkwYjE5dmJHUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRkRzhuS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvSkdSaGVWOW1jbTl0S1NCN1hISmNiaUFnSUNBZ0lDQWdKR1JoZVY5bWNtOXRMbU5zWVhOelRHbHpkQzVoWkdRb0oybHpMWE5sYkdWamRHVmtKeXdnSjJsekxYTmxiR1ZqZEdWa0xXWnliMjBuS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvSkdSaGVWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lDUmtZWGxmZEc4dVkyeGhjM05NYVhOMExtRmtaQ2duYVhNdGMyVnNaV04wWldRbkxDQW5hWE10YzJWc1pXTjBaV1F0ZEc4bktUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUmdkQyswWVhSZ05DdzBMM1F0ZEM5MExqUXRTRFFzaURRdXRDMTBZaGNjbHh1SUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wTGlSa1lYbGZabkp2YlY5dmJHUWdQU0FrWkdGNVgyWnliMjA3WEhKY2JpQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDNGtaR0Y1WDNSdlgyOXNaQ0E5SUNSa1lYbGZkRzg3WEhKY2JseHlYRzRnSUNBZ2RHaHBjeTVmYzJWc1pXTjBhVzl1TGlSa1lYbGZabkp2YlNBOUlDUmtZWGxmWm5KdmJUdGNjbHh1SUNBZ0lIUm9hWE11WDNObGJHVmpkR2x2Ymk0a1pHRjVYM1J2SUNBZ1BTQWtaR0Y1WDNSdk8xeHlYRzVjY2x4dUlDQWdJR2xtSUNna1pHRjVYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1pHRjVjeUE5SUUxaGRHZ3VabXh2YjNJb1RXRjBhQzVoWW5Nb2RHbHRaVjltY205dElDMGdkR2x0WlY5MGJ5a2dMeUE0TmpRd01HVXpLU0FySURFN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmRHOXZiSFJwY0ZOb2IzY29aR0Y1Y3lrN1hISmNiaUFnSUNCOVhISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRbjlDKzBMclFzTkMzSU5DLzBMN1F0TkdCMExyUXNOQzMwTHJRdUZ4eVhHNGdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdaR0Y1Y3lEUW10QyswTHZRdU5HSDBMWFJnZEdDMExMUXZpRFF0TkM5MExYUXVWeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZkRzl2YkhScGNGTm9iM2NnUFNCbWRXNWpkR2x2Ymloa1lYbHpLU0I3WEhKY2JpQWdJQ0IwYUdsekxsOGtkRzl2YkhScGNFTnZiblJsYm5RdWRHVjRkRU52Ym5SbGJuUWdQU0IwYUdsekxsOW1hV3gwWlhKVWIyOXNkR2x3VkdWNGRDaGtZWGx6S1R0Y2NseHVJQ0FnSUhSb2FYTXVYeVIwYjI5c2RHbHdMbU5zWVhOelRHbHpkQzUwYjJkbmJHVW9KMmx6TFhOb2IzY25MQ0IwYUdsekxsOGtkRzl2YkhScGNDNTBaWGgwUTI5dWRHVnVkQzVzWlc1bmRHZ3BPMXh5WEc0Z0lDQWdkR2hwY3k1ZmRHOXZiSFJwY0ZWd1pHRjBaU2dwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSjdRc2RDOTBMN1FzdEM3MExYUXZkQzQwTFVnMEwvUXZ0QzMwTGpSaHRDNDBMZ2cwTC9RdnRDMDBZSFF1dEN3MExmUXV0QzRYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDkwYjI5c2RHbHdWWEJrWVhSbElEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0JwWmlBb0lYUm9hWE11WDNObGJHVmpkR2x2Ymk0a1pHRjVYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJR3hsZENCNElEMGdNRHRjY2x4dUlDQWdJR3hsZENCNUlEMGdNRHRjY2x4dUlDQWdJR3hsZENBa1pXd2dQU0IwYUdsekxsOXpaV3hsWTNScGIyNHVKR1JoZVY5MGJ6dGNjbHh1SUNBZ0lHUnZJSHRjY2x4dUlDQWdJQ0FnSUNCNUlDczlJQ1JsYkM1dlptWnpaWFJVYjNBN1hISmNiaUFnSUNBZ0lDQWdlQ0FyUFNBa1pXd3ViMlptYzJWMFRHVm1kRHRjY2x4dUlDQWdJSDBnZDJocGJHVWdLQ2drWld3Z1BTQWtaV3d1YjJabWMyVjBVR0Z5Wlc1MEtTQW1KaUFrWld3Z0lUMGdkR2hwY3k1ZkpIQnBZMnRsY2lrN1hISmNibHh5WEc0Z0lDQWdkR2hwY3k1ZkpIUnZiMngwYVhBdWMzUjViR1V1ZEc5d0lEMGdUV0YwYUM1eWIzVnVaQ2g1SUMwZ2RHaHBjeTVmSkhSdmIyeDBhWEF1YjJabWMyVjBTR1ZwWjJoMEtTQXJJQ2R3ZUNjN1hISmNiaUFnSUNCMGFHbHpMbDhrZEc5dmJIUnBjQzV6ZEhsc1pTNXNaV1owSUQwZ1RXRjBhQzV5YjNWdVpDaDRJQ3NnZEdocGN5NWZjMlZzWldOMGFXOXVMaVJrWVhsZmRHOHViMlptYzJWMFYybGtkR2dnTHlBeUlDMGdkR2hwY3k1ZkpIUnZiMngwYVhBdWIyWm1jMlYwVjJsa2RHZ2dMeUF5S1NBcklDZHdlQ2M3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvZEM2MFlEUmk5R0MwWXdnMEwvUXZ0QzAwWUhRdXRDdzBMZlF1dEdEWEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw5MGIyOXNkR2x3U0dsa1pTQTlJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnZEdocGN5NWZKSFJ2YjJ4MGFYQXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25hWE10YzJodmR5Y3BPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLTFF0ZEM2MFlIUmdpRFF2OUMrMExUUmdkQzYwTERRdDlDNjBMZ2cwTC9RdmlEUmc5QzgwTDdRdTlHSDBMRFF2ZEM0MFk1Y2NseHVJQ29nUUhCaGNtRnRJQ0I3VG5WdFltVnlmU0JrWVhseklOQ2EwTDdRdTlDNDBZZlF0ZEdCMFlMUXN0QytJTkMwMEwzUXRkQzVYSEpjYmlBcUlFQnlaWFIxY200Z2UxTjBjbWx1WjMxY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgyWnBiSFJsY2xSdmIyeDBhWEJVWlhoMElEMGdablZ1WTNScGIyNG9aR0Y1Y3lrZ2UxeHlYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQjBhR2x6TG05d2RHbHZibk11Wm1sc2RHVnlMblJ2YjJ4MGFYQlVaWGgwSUQwOUlDZG1kVzVqZEdsdmJpY3BJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NXZjSFJwYjI1ekxtWnBiSFJsY2k1MGIyOXNkR2x3VkdWNGRDNWpZV3hzS0hSb2FYTXNJR1JoZVhNcElIeDhJQ2NuTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbkJzZFhKaGJDaGtZWGx6TENCYkp5VmtJTkMwMExYUXZkR01KeXdnSnlWa0lOQzAwTDNSanljc0lDY2xaQ0RRdE5DOTBMWFF1U2RkS1M1eVpYQnNZV05sS0NjbFpDY3NJR1JoZVhNcE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtUUXVOQzcwWXpSZ3RHQUlOQzkwTFhRdE5DKzBZSFJndEdEMEwvUXZkR0wwWVVnMExUUXZkQzEwTGxjY2x4dUlDb2dRSEJoY21GdElIdEVZWFJsZlNCa1lYUmxJTkNVMExEUmd0Q3dYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDltYVd4MFpYSk1iMk5yUkdGNWN5QTlJR1oxYm1OMGFXOXVLR1JoZEdVcElIdGNjbHh1SUNBZ0lDOHZJTkN5MFl2UXNkQyswWUFnMExUUXNOR0NJTkN5MEwzUXRTRFF0TkMrMFlIUmd0R0QwTC9RdmRDKzBMUFF2aURRdE5DNDBMRFF2OUN3MExmUXZ0QzkwTEJjY2x4dUlDQWdJR2xtSUNoa1lYUmxJRHdnZEdocGN5NXZjSFJwYjI1ekxtMXBia1JoZEdVZ2ZId2daR0YwWlNBK0lIUm9hWE11YjNCMGFXOXVjeTV0WVhoRVlYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUV4UFEwdGZWVTVCVmtGSlRFRkNURVU3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwTC9RdnRDNzBZelF0OUMrMExMUXNOR0MwTFhRdTlHTTBZSFF1dEM0MExVZzBZVFJnOUM5MExyUmh0QzQwTGhjY2x4dUlDQWdJR2xtSUNoMGVYQmxiMllnZEdocGN5NXZjSFJwYjI1ekxtWnBiSFJsY2k1c2IyTnJSR0Y1Y3lBOVBTQW5ablZ1WTNScGIyNG5LU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXViM0IwYVc5dWN5NW1hV3gwWlhJdWJHOWphMFJoZVhNdVkyRnNiQ2hrWVhSbEtUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUXN0R0IwTFVnMExUUXZkQzRJTkMwMEw3UmdkR0MwWVBRdjlDOTBZdGNjbHh1SUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2gwTDdRc2RHTDBZTFF1TkMxSU5DNDBMZlF2TkMxMEwzUXRkQzkwTGpSanlEUmdOQ3cwTGZRdk5DMTBZRFF2dEN5SU5DKzBMclF2ZEN3WEhKY2JpQXFJRUJ3WVhKaGJTQjdSWFpsYm5SOUlHVWdSRTlOSU5HQjBMN1FzZEdMMFlMUXVOQzFYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDl2YmxkcGJtUnZkMUpsYzJsNlpVVjJaVzUwSUQwZ1puVnVZM1JwYjI0b1pTa2dlMXh5WEc0Z0lDQWdhV1lnS0hSb2FYTXVYM05sYkdWamRHbHZiaTRrWkdGNVgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmZEc5dmJIUnBjRlZ3WkdGMFpTZ3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUd4bGRDQmljbVZoYTNCdmFXNTBJRDBnTUR0Y2NseHVJQ0FnSUdOdmJuTjBJR0p5WldGcmNHOXBiblJ6SUQwZ1QySnFaV04wTG10bGVYTW9kR2hwY3k1dmNIUnBiMjV6TG1KeVpXRnJjRzlwYm5SektTNXpiM0owS0NoaExDQmlLU0E5UGlCaElDMGdZaWs3WEhKY2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUdsdUlHSnlaV0ZyY0c5cGJuUnpLU0I3WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLSGRwYm1SdmR5NXBibTVsY2xkcFpIUm9JRHc5SUdKeVpXRnJjRzlwYm5SelcybGRLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR0p5WldGcmNHOXBiblFnUFNCaWNtVmhhM0J2YVc1MGMxdHBYVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdZbkpsWVdzN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUhSb2FYTXVYM05sZEVKeVpXRnJjRzlwYm5Rb1luSmxZV3R3YjJsdWRDazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW85R0IwWUxRc05DOTBMN1FzdEM2MExBZzBZSFF2dEdCMFlMUXZ0R1AwTDNRdU5HUElOR0EwTFhRdmRDMDBMWFJnTkN3SU5DLzBMN1F0Q0RSZ05DdzBMZlF2ZEdMMExVZzBZM1F1dEdBMExEUXZkR0xYSEpjYmlBcUlFQndZWEpoYlNCN1RuVnRZbVZ5ZlNCaWNtVmhhM0J2YVc1MElOQ2EwTHZSanRHSElOQzQwTGNnZEdocGN5NXZjSFJwYjI1ekxtSnlaV0ZyY0c5cGJuUnpJQ2pRcU5DNDBZRFF1TkM5MExBZzBZM1F1dEdBMExEUXZkQ3dLVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmYzJWMFFuSmxZV3R3YjJsdWRDQTlJR1oxYm1OMGFXOXVLR0p5WldGcmNHOXBiblFwSUh0Y2NseHVJQ0FnSUM4dklOQyswWUlnMEwzUXRkQzkwWVBRdHRDOTBMN1F1U0RRdjlDMTBZRFF0ZEdBMExqUmdkQyswTExRdXRDNFhISmNiaUFnSUNCcFppQW9kR2hwY3k1ZlluSmxZV3R3YjJsdWRDQTlQU0JpY21WaGEzQnZhVzUwS1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ2ZWeHlYRzRnSUNBZ2RHaHBjeTVmWW5KbFlXdHdiMmx1ZENBOUlHSnlaV0ZyY0c5cGJuUTdYSEpjYmx4eVhHNGdJQ0FnYVdZZ0tDRjBhR2x6TG05d2RHbHZibk11WW5KbFlXdHdiMmx1ZEhOYlluSmxZV3R3YjJsdWRGMHBJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ1QySnFaV04wTG1GemMybG5iaWgwYUdsekxtOXdkR2x2Ym5Nc0lIUm9hWE11YjNCMGFXOXVjeTVpY21WaGEzQnZhVzUwYzF0aWNtVmhhM0J2YVc1MFhTazdYSEpjYmlBZ0lDQjBhR2x6TGw4a1kzSmxZWFJsVFc5dWRHaHpLSFJvYVhNdVgzTmxiR1ZqZEdWa1JHRjBaU2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFyZEM3MExYUXZOQzEwTDNSZ2lEUXV0Q3cwTHZRdGRDOTBMVFFzTkdBMEwzUXZ0Q3owTDRnMExUUXZkR1BYSEpjYmlBcUlFQndZWEpoYlNBZ2UwUmhkR1Y5SUdSaGRHVWcwSlRRc05HQzBMQmNjbHh1SUNvZ1FISmxkSFZ5YmlCN1JXeGxiV1Z1ZEgwZ0lDQklWRTFNSU5HTjBMdlF0ZEM4MExYUXZkR0NYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDhrWjJWMFJHRjVRbmxFWVhSbElEMGdablZ1WTNScGIyNG9aR0YwWlNrZ2UxeHlYRzRnSUNBZ1kyOXVjM1FnZEdsdFpTQTlJR1JoZEdVZ2FXNXpkR0Z1WTJWdlppQkVZWFJsSUQ4Z1pHRjBaUzVuWlhSVWFXMWxLQ2tnT2lBd08xeHlYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYeVJ0YjI1MGFITXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxrUmhlVnRrWVhSaExYUnBiV1U5WENJbklDc2dkR2x0WlNBcklDZGNJbDBuS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNnMExYUXZkQzAwTFhSZ0NEUXROQzkwWThnTFNEUXQ5Q3cwTFBRdTlHRDBZalF1dEM0WEhKY2JpQXFJRUJ5WlhSMWNtNGdlMFZzWlcxbGJuUjlYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDhrWTNKbFlYUmxSVzF3ZEhsRVlYa2dQU0JtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUdOdmJuTjBJQ1JrWVhrZ1BTQjBhR2x6TGw4a1kzSmxZWFJsUld4bGJXVnVkQ2hjY2x4dUlDQWdJQ0FnSUNCZ1BHUnBkaUJqYkdGemN6MWNJa1JoZVNCcGN5MWxiWEIwZVZ3aVBqd3ZaR2wyUG1CY2NseHVJQ0FnSUNrN1hISmNibHh5WEc0Z0lDQWdjbVYwZFhKdUlDUmtZWGs3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvZEMrMExmUXROQ3cwTDNRdU5DMUlOR04wTHZRdGRDODBMWFF2ZEdDMExBZzBMalF0eUJJVkUxTUlOR0MwTFhRdXRHQjBZTFFzRnh5WEc0Z0tpQkFjR0Z5WVcwZ0lIdFRkSEpwYm1kOUlHaDBiV3dnU0ZSTlRDRFJndEMxMExyUmdkR0NYSEpjYmlBcUlFQnlaWFIxY200Z2UwVnNaVzFsYm5SOVhISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOGtZM0psWVhSbFJXeGxiV1Z1ZENBOUlHWjFibU4wYVc5dUtHaDBiV3dwSUh0Y2NseHVJQ0FnSUdOdmJuTjBJR1JwZGlBOUlHUnZZM1Z0Wlc1MExtTnlaV0YwWlVWc1pXMWxiblFvSjJScGRpY3BPMXh5WEc0Z0lDQWdaR2wyTG1sdWMyVnlkRUZrYW1GalpXNTBTRlJOVENnbllXWjBaWEppWldkcGJpY3NJR2gwYld3cE8xeHlYRzRnSUNBZ2NtVjBkWEp1SUdScGRpNWphR2xzWkhKbGJpNXNaVzVuZEdnZ1BpQXhJRDhnWkdsMkxtTm9hV3hrY21WdUlEb2daR2wyTG1acGNuTjBSV3hsYldWdWRFTm9hV3hrTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2dVMkZtWlNEUXN0R0wwTGZRdnRDeUlOQ3kwTDNRdGRHSTBMM1F1TkdGSU5HQjBMN1FzZEdMMFlMUXVOQzVJTkM2MEw3UXZOQy8wTDdRdmRDMTBMM1JndEN3WEhKY2JpQXFJRUJ3WVhKaGJTQjdVM1J5YVc1bmZTQm1JTkNZMEx6Ump5RFJnZEMrMExIUmk5R0MwTGpSajF4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZlkyRnNiR0poWTJzZ1BTQm1kVzVqZEdsdmJpaG1LU0I3WEhKY2JpQWdJQ0JwWmlBb2RIbHdaVzltSUhSb2FYTXViM0IwYVc5dWN5NXZibHRtWFNBOVBTQW5ablZ1WTNScGIyNG5LU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXViM0IwYVc5dWN5NXZibHRtWFM1aGNIQnNlU2gwYUdsekxDQmJYUzV6YkdsalpTNWpZV3hzS0dGeVozVnRaVzUwY3l3Z01Ta3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUhKbGRIVnlianRjY2x4dWZWeHlYRzVjY2x4dVpYaHdiM0owSUdSbFptRjFiSFFnUkdGMFpWSmhibWRsVUdsamEyVnlPMXh5WEc0aVhTd2ljMjkxY21ObFVtOXZkQ0k2SWlKOSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgRGF0ZVJhbmdlUGlja2VyLCB7TE9DS19VTkFWQUlMQUJMRSwgTE9DS19MT0NLRUR9IGZyb20gJy4uLy4uL2Rpc3QvZGF0ZXJhbmdlcGlja2VyJztcclxuXHJcbmNvbnN0ICRmb3JtID0gZG9jdW1lbnQuZm9ybXNbMF07XHJcbmNvbnN0ICRkYXRlX2Zyb20gPSAkZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImRhdGVfZnJvbVwiXScpO1xyXG5jb25zdCAkZGF0ZV90byAgID0gJGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9XCJkYXRlX3RvXCJdJyk7XHJcblxyXG4vLyDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0LUg0LTQsNGC0YtcclxuY29uc3QgYmxvY2tlZERhdGVzID0ge307XHJcbmNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG5kYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5mb3IgKGxldCBpID0gMDsgaSA8IDYwOyArK2kpIHtcclxuICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC42KSB7XHJcbiAgICAgICAgYmxvY2tlZERhdGVzW2RhdGVdID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG59XHJcblxyXG5uZXcgRGF0ZVJhbmdlUGlja2VyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkYXRlcmFuZ2VwaWNrZXInKSwge1xyXG4gICAgbWluRGF0ZTogbmV3IERhdGUoKSxcclxuICAgIG1heERhdGU6IG5ldyBEYXRlKCcyMDIyLTA1LTIwJyksXHJcbiAgICBtb250aHNDb3VudDogMixcclxuICAgIHBlclJvdzogMyxcclxuICAgIHNpbmdsZU1vZGU6IGZhbHNlLFxyXG4gICAgYnJlYWtwb2ludHM6IHtcclxuICAgICAgICA5NjA6IHtcclxuICAgICAgICAgICAgbW9udGhzQ291bnQ6IDEyLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgNzIwOiB7XHJcbiAgICAgICAgICAgIG1vbnRoc0NvdW50OiAzLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgNDgwOiB7XHJcbiAgICAgICAgICAgIG1vbnRoc0NvdW50OiAxLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgb246IHtcclxuICAgICAgICByYW5nZVNlbGVjdDogZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICAgICAgICAgICRkYXRlX2Zyb20udmFsdWUgPSBkYXRlX2Zyb20udG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICRkYXRlX3RvLnZhbHVlID0gZGF0ZV90by50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRheVNlbGVjdDogZnVuY3Rpb24oZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgICAgICRkYXRlX2Zyb20udmFsdWUgPSBkYXRlX2Zyb20udG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBmaWx0ZXI6IHtcclxuICAgICAgICBsb2NrRGF5czogZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgICAgICBpZiAoYmxvY2tlZERhdGVzW2RhdGVdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTE9DS19MT0NLRUQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRvb2x0aXBUZXh0OiBmdW5jdGlvbihkYXlzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5pZ2h0cyA9IGRheXMgLSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wbHVyYWwobmlnaHRzLCBbJyVkINC90L7Rh9GMJywgJyVkINC90L7Rh9C4JywgJyVkINC90L7Rh9C10LknXSkucmVwbGFjZSgnJWQnLCBuaWdodHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=