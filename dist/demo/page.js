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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9zY3NzL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOztVQ1ZBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDTztBQUNBOztBQUVQO0FBQ0E7O0FBRUEsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsa0JBQWtCO0FBQzNCO0FBQ0E7QUFDQTtB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QUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsS0FBSztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLEtBQUs7QUFDakIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLGVBQWUsRUFBQyIsImZpbGUiOiJkYXRlcmFuZ2VwaWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkRhdGVyYW5nZXBpY2tlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyDRgdC+0YHRgtC+0Y/QvdC40Y8g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9GFINC00LDRglxyXG5leHBvcnQgY29uc3QgTE9DS19VTkFWQUlMQUJMRSA9IDE7XHJcbmV4cG9ydCBjb25zdCBMT0NLX0xPQ0tFRCAgICAgID0gMjtcclxuXHJcbmNvbnN0IElOREVYX0RBVEVfRlJPTSA9IDA7XHJcbmNvbnN0IElOREVYX0RBVEVfVE8gICA9IDE7XHJcblxyXG5mdW5jdGlvbiBEYXRlUmFuZ2VQaWNrZXIoJGNvbnRhaW5lciwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICAvLyDQvtGCINC/0L7QstGC0L7RgNC90L7QuSDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuFxyXG4gICAgaWYgKCRjb250YWluZXIuaW5zdGFuY2UpIHtcclxuICAgICAgICByZXR1cm4gJGNvbnRhaW5lci5pbnN0YW5jZTtcclxuICAgIH1cclxuICAgICRjb250YWluZXIuaW5zdGFuY2UgPSB0aGlzO1xyXG5cclxuICAgIHRoaXMuXyRjb250YWluZXIgPSAkY29udGFpbmVyO1xyXG5cclxuICAgIC8vINC30L3QsNGH0LXQvdC40LUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICAgIGNvbnN0IGR2ID0gKHgsIHYpID0+IHR5cGVvZiB4ID09ICd1bmRlZmluZWQnID8gdiA6IHg7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgIGZpcnN0RGF5T2ZUaGVXZWVrOiBkdihvcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrLCAxKSwgLy8g0L/QtdGA0LLRi9C5INC00LXQvdGMINC90LXQtNC10LvQuCwgMCA9INCy0YEsIDEgPSDQv9C9LCAuLi5cclxuICAgICAgICBzaW5nbGVNb2RlOiAgICAgICAgZHYob3B0aW9ucy5zaW5nbGVNb2RlLCBmYWxzZSksICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRiyDQstC80LXRgdGC0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICAgICAgbG9jYWxlOiAgICAgICAgICAgIGR2KG9wdGlvbnMubG9jYWxlLCAncnUtUlUnKSxcclxuICAgICAgICBtaW5EYXlzOiAgICAgICAgICAgZHYob3B0aW9ucy5taW5EYXlzLCAxKSwgICAgICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LTQuNCw0L/QsNC30L7QvdC1XHJcbiAgICAgICAgbW9udGhzQ291bnQ6ICAgICAgIGR2KG9wdGlvbnMubW9udGhzQ291bnQsIDEyKSxcclxuICAgICAgICBwZXJSb3c6ICAgICAgICAgICAgZHYob3B0aW9ucy5wZXJSb3csIHVuZGVmaW5lZCksICAgIC8vINC60L7Qu9C40YfQtdGB0YLQstC+INC80LXRgdGP0YbQtdCyINCyINGA0Y/QtNGDXHJcbiAgICAgICAgbWluRGF0ZTogICAgICAgICAgIGR2KG9wdGlvbnMubWluRGF0ZSwgbmV3IERhdGUoKSksICAvLyDQvNC40L3QuNC80LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgICAgbWF4RGF0ZTogICAgICAgICAgIGR2KG9wdGlvbnMubWF4RGF0ZSwgdW5kZWZpbmVkKSxcclxuICAgICAgICBicmVha3BvaW50czogICAgICAgZHYob3B0aW9ucy5icmVha3BvaW50cywge30pLFxyXG4gICAgICAgIGludGVybmFsSW5wdXRzOiAgICBkdihvcHRpb25zLmludGVybmFsSW5wdXRzLCB0cnVlKSwgLy8g0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40LUg0LLRgdGC0YDQvtC10L3QvdGL0YUg0LjQvdC/0YPRgtC+0LJcclxuICAgICAgICAvLyDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICAgIG9uOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgcmFuZ2VTZWxlY3Q6IG51bGwsIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAgICAgICAgICAgIGRheVNlbGVjdDogICBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0L7QtNC90L7QuSDQtNCw0YLRiyAo0YLQvtC70YzQutC+INC/0YDQuCBzaW5nbGVNb2RlOiB0cnVlKVxyXG4gICAgICAgIH0sIG9wdGlvbnMub24gfHwge30pLFxyXG4gICAgICAgIC8vINGE0LjQu9GM0YLRgNGD0Y7RidC40LUg0LzQtdGC0L7QtNGLXHJcbiAgICAgICAgZmlsdGVyOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgbG9ja0RheXM6ICAgIG51bGwsIC8vIGNhbGxiYWNrKGRhdGUpINGE0YPQvdC60YbQuNGPINCx0LvQvtC60LjRgNC+0LLQsNC90LjRjyDQtNCw0YIsIHRydWUvTE9DS1xyXG4gICAgICAgICAgICB0b29sdGlwVGV4dDogbnVsbCwgLy8gY2FsbGJhY2soZGF5cykg0LLRi9Cy0L7QtCDRgtC10LrRgdGC0LAg0L/QvtC00YHQutCw0LfQutC4XHJcbiAgICAgICAgfSwgb3B0aW9ucy5maWx0ZXIgfHwge30pLFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0YDRj9C00L3QvtGB0YLRjFxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGVyUm93ID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnBlclJvdyA9IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMubWluRGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtC/0YbQuNC4INC00LvRjyDRjdC60YDQsNC90L7QsiDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW3RoaXMuX2JyZWFrcG9pbnQgPSAwXSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyk7XHJcblxyXG4gICAgLy8g0YLQtdC60YPRidC40Lkg0LTQtdC90YxcclxuICAgIHRoaXMuX3RvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIHRoaXMuX3RvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIHRoaXMuXyRwaWNrZXIgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlclwiPlxyXG4gICAgICAgICAgICAke3RoaXMub3B0aW9ucy5pbnRlcm5hbElucHV0cyA/XHJcbiAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9faW5wdXRzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJHt0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkYXRlXCI+YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkYXRlX2Zyb21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV90b1wiPmBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5gIDogJydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX19tb250aHNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcC1jb250ZW50XCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgLy8g0Y3Qu9C10LzQtdC90YLRi1xyXG4gICAgdGhpcy5fJG1vbnRocyAgICAgICAgID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX19tb250aHMnKTtcclxuICAgIHRoaXMuXyR0b29sdGlwICAgICAgICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcCcpO1xyXG4gICAgdGhpcy5fJHRvb2x0aXBDb250ZW50ID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX190b29sdGlwLWNvbnRlbnQnKTtcclxuXHJcbiAgICAvLyDQv9C+0LvRjyDQstCy0L7QtNCwXHJcbiAgICB0aGlzLl8kaW5wdXRzID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lXj1cImRhdGVcIl0nKTtcclxuXHJcbiAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICAgIHRoaXMuX3NlbGVjdGlvbiA9IHt9O1xyXG5cclxuICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgdGhpcy5fc2VsZWN0RGF0ZSh0aGlzLm9wdGlvbnMubWluRGF0ZSk7XHJcbiAgICB0aGlzLl8kY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuXyRwaWNrZXIpO1xyXG5cclxuICAgIC8vINC+0LHRgNCw0LHQvtGC0LrQsCDQsdGA0LXQudC60L/QvtC40L3RgtC+0LJcclxuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHMpLmxlbmd0aCkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9vbldpbmRvd1Jlc2l6ZUV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuX29uV2luZG93UmVzaXplRXZlbnQoKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCd0LDQt9Cy0LDQvdC40LUg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0TW9udGhGb3JtYXR0ZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCB0aXRsZSA9IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge21vbnRoOiAnbG9uZyd9KTtcclxuICAgIHJldHVybiB0aXRsZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpICsgdGl0bGUuc2xpY2UoMSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INC00LDRgtGLINC00LvRjyDRgtC10LrRg9GJ0LXQuSDQu9C+0LrQsNC70LhcclxuICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAgINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMg0J/QsNGA0LDQvNC10YLRgNGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZVRpbWVGb3JtYXQgPSBmdW5jdGlvbihkYXRlLCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gSW50bC5EYXRlVGltZUZvcm1hdCh0aGlzLm9wdGlvbnMubG9jYWxlLCBvcHRpb25zKS5mb3JtYXQoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQlNC90Lgg0L3QtdC00LXQu9C4XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldFdlZWtEYXlzRm9ybWF0dGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIDIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyArK2kpIHtcclxuICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgIGRheTogZGF0ZS5nZXREYXkoKSxcclxuICAgICAgICAgICAgdGl0bGU6IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge3dlZWtkYXk6ICdzaG9ydCd9KSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0YDRgtC40YDQvtCy0LrQsCDRgdC+0LPQu9Cw0YHQvdC+INC90LDRgdGC0YDQvtC10L3QvdC+0LzRgyDQv9C10YDQstC+0LzRgyDQtNC90Y4g0L3QtdC00LXQu9C4XHJcbiAgICByZXN1bHQuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpcnN0RGF5T2ZUaGVXZWVrID0gdGhpcy5vcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrICUgNztcclxuICAgICAgICBsZXQgZGF5QSA9IGEuZGF5O1xyXG4gICAgICAgIGxldCBkYXlCID0gYi5kYXk7XHJcblxyXG4gICAgICAgIGlmIChkYXlBID09IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlCID09IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUEgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICBkYXlBICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QiA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIGRheUIgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkYXlBIC0gZGF5QjtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuSDQsiDQvNC10YHRj9GG0LVcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7TnVtYmVyfSAgICDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXlzQ291bnRJbk1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXlzLnNldE1vbnRoKGRheXMuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgZGF5cy5zZXREYXRlKDApO1xyXG4gICAgcmV0dXJuIGRheXMuZ2V0RGF0ZSgpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucmFuZ2VSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxSZXNldCgpO1xyXG4gICAgdGhpcy5fc2VsZWN0aW9uID0ge307XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktGL0LTQtdC70LXQvdC40LUg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5yYW5nZVNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAvLyDQtNC+0L/Rg9GB0YLQuNC80YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUoZGF0ZV9mcm9tLCBkYXRlX3RvKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICBjb25zdCAkZGF5X3RvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuXHJcbiAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdChkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG5cclxuICAgIC8vINGB0L7RhdGA0LDQvdC10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjRj1xyXG4gICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IGRhdGVfZnJvbTtcclxuICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvICAgPSBkYXRlX3RvO1xyXG5cclxuICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LVcclxuICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtCx0L3QvtCy0LvQtdC90LjQtSDQuNC90L/Rg9GC0L7QslxyXG4gICAgaWYgKHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9GUk9NXSkge1xyXG4gICAgICAgIHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9GUk9NXS52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfVE9dKSB7XHJcbiAgICAgICAgdGhpcy5fJGlucHV0c1tJTkRFWF9EQVRFX1RPXS52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0LHRi9GC0LjQtVxyXG4gICAgdGhpcy5fY2FsbGJhY2soJ3JhbmdlU2VsZWN0JywgZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0YtcclxuICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge1N0cmluZ30gZm9ybWF0INCk0L7RgNC80LDRgiDRgdGC0YDQvtC60LhcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSwgZm9ybWF0ID0gJ1ktbS1kJykge1xyXG4gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlKCdZJywgZGF0ZS5nZXRGdWxsWWVhcigpKVxyXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdtJywgKCcwJyArIChkYXRlLmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpKVxyXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdkJywgKCcwJyArIChkYXRlLmdldERhdGUoKSkpLnNsaWNlKC0yKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0L7QstC10YDQutCwINCy0L7Qt9C80L7QttC90L7RgdGC0Lgg0LLRi9C00LXQu9C10L3QuNGPINC00LDRglxyXG4gKiBAcGFyYW0gIHtEYXRlIGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtICB7RGF0ZSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRJc1JhbmdlU2VsZWN0YWJsZSA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoZGF0ZV9mcm9tLmdldFRpbWUoKSAtIGRhdGVfdG8uZ2V0VGltZSgpKSAvIDEwMDAgLyA4NjQwMDtcclxuICAgIGlmIChkaWZmIDwgdGhpcy5vcHRpb25zLm1pbkRheXMpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQv9C+0L/QsNC00LDQvdC40Y8g0LIg0LTQuNCw0L/QsNC30L7QvSDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbiAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgZGF5LnNldFRpbWUoZGF0ZV9mcm9tLmdldFRpbWUoKSk7XHJcblxyXG4gICAgd2hpbGUgKGRheSA8IGRhdGVfdG8pIHtcclxuICAgICAgICBpZiAodGhpcy5fZmlsdGVyTG9ja0RheXMoZGF5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkYXkuc2V0RGF0ZShkYXkuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktGL0LHRgNCw0L3QvdCw0Y8g0L3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEByZXR1cm4ge0RhdGV9INCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGVGcm9tID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyDQvdCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LAg0L3QtSDRg9C60LDQt9Cw0L3QsFxyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC90LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsCDQv9C+0LfQttC1INC60L7QvdC10YfQvdC+0LlcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tID4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG87XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb207XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktGL0LHRgNCw0L3QvdCw0Y8g0LTQsNGC0LAgKHNpbmdsZU1vZGU6IHRydWUpXHJcbiAqIEByZXR1cm4ge0RhdGV9INCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGUgPSBEYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGVGcm9tO1xyXG5cclxuLyoqXHJcbiAqINCS0YvQsdGA0LDQvdC90LDRjyDQutC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqIEByZXR1cm4ge0RhdGV9INCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGVUbyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0LrQvtC90LXRh9C90LDRjyDQtNCw0YLQsCDQvdC1INGD0LrQsNC30LDQvdCwXHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC90LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsCDQv9C+0LfQttC1INC60L7QvdC10YfQvdC+0LlcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bztcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0LrQu9C+0L3QtdC90LjQtSAoMSDQsdC+0LHRkdGALCAyINCx0L7QsdGA0LAsIDUg0LHQvtCx0YDQvtCyKVxyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IHZhbHVlINCa0L7Qu9C40YfQtdGB0YLQstC+XHJcbiAqIEBwYXJhbSAge0FycmF5fSAgZm9ybXMg0JzQsNGB0YHQuNCyINC40LcgM9GFINGN0LvQtdC80LXQvdGC0L7Qsiwg0LzQvtC20LXRgiDRgdC+0LTQtdGA0LbQsNGC0Ywg0YHQv9C10YbQuNGE0LjQutCw0YLQvtGAICVkINC00LvRjyDQt9Cw0LzQtdC90YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5wbHVyYWwgPSBmdW5jdGlvbiAodmFsdWUsIGZvcm1zKSB7XHJcbiAgICByZXR1cm4gKHZhbHVlICUgMTAgPT0gMSAmJiB2YWx1ZSAlIDEwMCAhPSAxMSA/IGZvcm1zWzBdIDogKHZhbHVlICUgMTAgPj0gMiAmJiB2YWx1ZSAlIDEwIDw9IDQgJiYgKHZhbHVlICUgMTAwIDwgMTAgfHwgdmFsdWUgJSAxMDAgPj0gMjApID8gZm9ybXNbMV0gOiBmb3Jtc1syXSkpLnJlcGxhY2UoJyVkJywgdmFsdWUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC00LjQsNC/0LDQt9C+0L3QsCDQvNC10YHRj9GG0LXQslxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVNb250aHMgPSBmdW5jdGlvbihkYXRlX2Zyb20pIHtcclxuICAgIHdoaWxlICh0aGlzLl8kbW9udGhzLmxhc3RFbGVtZW50Q2hpbGQpIHtcclxuICAgICAgICB0aGlzLl8kbW9udGhzLnJlbW92ZUNoaWxkKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/RgNGP0YfQtdC8INC/0L7QtNGB0LrQsNC30LrRg1xyXG4gICAgdGhpcy5fdG9vbHRpcEhpZGUoKTtcclxuXHJcbiAgICAvLyDQv9GA0LXRgNC10L3QtNC10YAg0LzQtdGB0Y/RhtC10LJcclxuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoZGF0ZV9mcm9tLmdldFRpbWUoKSk7XHJcbiAgICBjb25zdCAkbW9udGhzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDsgKytpKSB7XHJcbiAgICAgICAgJG1vbnRocy5wdXNoKHRoaXMuXyRjcmVhdGVNb250aChjdXJyZW50RGF0ZSkpO1xyXG4gICAgICAgIGN1cnJlbnREYXRlLnNldE1vbnRoKGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YBcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJG1vbnRocy5sZW5ndGg7IGkgKz0gdGhpcy5vcHRpb25zLnBlclJvdykge1xyXG4gICAgICAgIGNvbnN0ICRyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAkcm93LmNsYXNzTmFtZSA9ICdEYXRlcmFuZ2VwaWNrZXJfX3Jvdyc7XHJcblxyXG4gICAgICAgICRtb250aHMuc2xpY2UoaSwgaSArIHRoaXMub3B0aW9ucy5wZXJSb3cpLmZvckVhY2goJG1vbnRoID0+IHtcclxuICAgICAgICAgICAgJHJvdy5hcHBlbmRDaGlsZCgkbW9udGgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl8kbW9udGhzLmFwcGVuZENoaWxkKCRyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUg0JzQtdGB0Y/RhlxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZU1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgY3VycmVudE1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xyXG4gICAgY29uc3QgbW9udGhUaXRsZSA9IHRoaXMuZ2V0TW9udGhGb3JtYXR0ZWQoZGF0ZSk7XHJcbiAgICBjb25zdCB3ZWVrRGF5cyA9IHRoaXMuZ2V0V2Vla0RheXNGb3JtYXR0ZWQoKTtcclxuXHJcbiAgICBjb25zdCAkbW9udGggPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIk1vbnRoXCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fYXJyb3cgTW9udGhfX2Fycm93LS1wcmV2JHsodGhpcy5vcHRpb25zLm1pbkRhdGUgJiYgZGF0ZSA8PSB0aGlzLm9wdGlvbnMubWluRGF0ZSkgPyAnIGlzLWRpc2FibGVkJyA6ICcnfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk03IDEzTDEgN0w3IDFcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX190aXRsZVwiPiR7bW9udGhUaXRsZX0gJHtkYXRlLmdldEZ1bGxZZWFyKCl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tbmV4dCR7KHRoaXMub3B0aW9ucy5tYXhEYXRlICYmIGRhdGUgPj0gdGhpcy5vcHRpb25zLm1heERhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMSAwLjk5OTk5OUw3IDdMMSAxM1wiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtcIj4ke3dlZWtEYXlzLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrZGF5XCI+JHtpdGVtLnRpdGxlfTwvZGl2PmBcclxuICAgICAgICAgICAgfSkuam9pbignJyl9PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fZGF5c1wiPjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgLy8g0YHRgtGA0LXQu9C60LhcclxuICAgIFtcclxuICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1wcmV2JywgbmFtZTogJ3ByZXYnfSxcclxuICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1uZXh0JywgbmFtZTogJ25leHQnfSxcclxuICAgIF0uZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICBjb25zdCAkYXJyb3cgPSAkbW9udGgucXVlcnlTZWxlY3RvcihpdGVtLnNlbGVjdG9yKTtcclxuICAgICAgICAkYXJyb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICAgICAgLy8g0LLRgNC10LzQtdC90L3QsNGPINC80LXRgNCwLCDQu9GD0YfRiNC1INC/0LXRgNC10LLQtdGA0YHRgtCw0YLRjCwg0LLRi9C90LXRgdGC0Lgg0YHRgtGA0LXQu9C60Lgg0LfQsCDQv9GA0LXQtNC10LvRiyDQv9C10YDQtdGA0LXRgNC40YHQvtCy0YvQstCw0LXQvNC+0Lkg0L7QsdC70LDRgdGC0Lgg0L/QuNC60LXRgNCwXHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9vbkFycm93Q2xpY2soJGFycm93LCBpdGVtLm5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAINC00L3QtdC5XHJcbiAgICBjb25zdCAkZGF5cyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKCcuTW9udGhfX2RheXMnKTtcclxuICAgIGNvbnN0IGRheXMgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICBkYXlzLnNldERhdGUoMSk7XHJcbiAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIHdoaWxlIChkYXlzLmdldE1vbnRoKCkgPT0gY3VycmVudE1vbnRoKSB7XHJcbiAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlV2VlaygpO1xyXG5cclxuICAgICAgICB3ZWVrRGF5cy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBpZiAoZGF5cy5nZXREYXkoKSAhPSBpdGVtLmRheSB8fCBkYXlzLmdldE1vbnRoKCkgIT0gY3VycmVudE1vbnRoKSB7XHJcbiAgICAgICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRW1wdHlEYXkoKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVEYXkoZGF5cykpO1xyXG4gICAgICAgICAgICBkYXlzLnNldERhdGUoZGF5cy5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJGRheXMuYXBwZW5kQ2hpbGQoJHdlZWspO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAkbW9udGg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC70LjQuiDQv9C+INGB0YLRgNC10LvQutC1INC/0LXRgNC10LrQu9GO0YfQtdC90LjRjyDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtFbGVtZW50fSAkYXJyb3cgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAgICDQmNC80Y8gKHByZXYsIG5leHQpXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkFycm93Q2xpY2sgPSBmdW5jdGlvbigkYXJyb3csIG5hbWUpIHtcclxuICAgIGlmICgkYXJyb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShwYXJzZUludCh0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aCcpLmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgKG5hbWUgPT0gJ3ByZXYnID8gLXRoaXMub3B0aW9ucy5tb250aHNDb3VudCA6IHRoaXMub3B0aW9ucy5tb250aHNDb3VudCkpO1xyXG5cclxuICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNC40L3QuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRUaW1lKHRoaXMub3B0aW9ucy5taW5EYXRlLmdldFRpbWUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LDQutGB0LjQvNCw0LvRjNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgY29uc3QgZW5kRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBlbmREYXRlLnNldE1vbnRoKGVuZERhdGUuZ2V0TW9udGgoKSArIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCk7XHJcbiAgICAgICAgaWYgKGVuZERhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1heERhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgLSB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/QtdGA0LXRhdC+0LQg0Log0L3QvtCy0L7QuSDQtNCw0YLQtVxyXG4gICAgdGhpcy5fc2VsZWN0RGF0ZShkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQuSDQtNCw0YLRiyDRgSDRgNC10L3QtNC10YDQvtC8XHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fc2VsZWN0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIHRoaXMuX3NlbGVjdGVkRGF0ZSA9IGRhdGU7XHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGhzKGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC90LXQtNC10LvQuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZVdlZWsgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiV2Vla1wiPjwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuICR3ZWVrO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC00L3Rj1xyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZURheSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRheVwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCIgZGF0YS1kYXk9XCIke2RhdGUuZ2V0RGF5KCl9XCI+JHtkYXRlLmdldERhdGUoKX08L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkRheUNsaWNrRXZlbnQuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZSkge1xyXG4gICAgICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC+0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gICAgdGhpcy5fdXBkYXRlRGF5KCRkYXkpO1xyXG5cclxuICAgIHJldHVybiAkZGF5O1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuTW9udGgnKS5mb3JFYWNoKCRtb250aCA9PiB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlTW9udGgoJG1vbnRoKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5INC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRtb250aCDQrdC70LXQvNC10L3RgiDQvNC10YHRj9GG0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3VwZGF0ZU1vbnRoID0gZnVuY3Rpb24oJG1vbnRoKSB7XHJcbiAgICAkbW9udGgucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJykuZm9yRWFjaCgkZGF5ID0+IHtcclxuICAgICAgICB0aGlzLl91cGRhdGVEYXkoJGRheSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuSDQtNC90Y9cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5INCt0LvQtdC80LXQvdGCINC00L3Rj1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdXBkYXRlRGF5ID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgY29uc3QgZGF0ZSAgID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICBjb25zdCBsb2NrZWQgPSB0aGlzLl9maWx0ZXJMb2NrRGF5cyhkYXRlKTtcclxuICAgIGNvbnN0IHRvZGF5ICA9IHRoaXMuX3RvZGF5LmdldFRpbWUoKSA9PSBkYXRlLmdldFRpbWUoKTtcclxuXHJcbiAgICAkZGF5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLWRpc2FibGVkJywgbG9ja2VkKTtcclxuICAgICRkYXkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtbG9ja2VkJywgbG9ja2VkID09IExPQ0tfTE9DS0VEKTtcclxuICAgICRkYXkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtdG9kYXknLCB0b2RheSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDQutC70LjQutCwINC/0L4g0LTQvdGOXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheUNsaWNrRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICB0aGlzLl9vbkRheUNsaWNrKGUudGFyZ2V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INGF0L7QstC10YDQsFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlNb3VzZUVudGVyRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICB0aGlzLl9vbkRheU1vdXNlRW50ZXIoZS50YXJnZXQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KXQvtCy0LXRgCDQvdCwINGN0LvQtdC80LXQvdGC0LUg0LTQvdGPXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheU1vdXNlRW50ZXIgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXkuZGF0YXNldC50aW1lID09IHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20uZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG59XHJcblxyXG4vKipcclxuICog0JrQu9C40Log0L/QviDQtNC90Y5cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5Q2xpY2sgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICAvLyDQtNC10L3RjCDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L1cclxuICAgIGlmICgkZGF5LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZSkge1xyXG4gICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKVxyXG4gICAgICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFjaygnZGF5U2VsZWN0JywgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0LHRgNC+0YEg0LLRi9Cx0YDQsNC90L3QvtCz0L4g0YDQsNC90LXQtSDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG5cclxuICAgIC8vINCy0YvQsdGA0LDQvdCwINC90LDRh9Cw0LvRjNC90LDRjyAvINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJhbmdlU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LjQt9GD0LDQu9GM0L3Ri9C5INGB0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICAkZGF5cy5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgICRkYXkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScsICdpcy1zZWxlY3RlZC10bycsICdpcy1zZWxlY3RlZC1iZXR3ZWVuJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQv9GA0Y/Rh9C10Lwg0L/QvtC00YHQutCw0LfQutGDXHJcbiAgICB0aGlzLl90b29sdGlwSGlkZSgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JLQuNC30YPQsNC70YzQvdC+0LUg0LLRi9C00LXQu9C10L3QuNC1INC00LDRglxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fcmFuZ2VWaXN1YWxTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGlmIChkYXRlX2Zyb20gJiYgZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0ZV90byAmJiBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHRpbWVfZnJvbSA9IGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX2Zyb20uZ2V0VGltZSgpIDogMDtcclxuICAgIGxldCB0aW1lX3RvID0gZGF0ZV90byBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX3RvLmdldFRpbWUoKSA6IDA7XHJcbiAgICBpZiAodGltZV9mcm9tID4gdGltZV90bykge1xyXG4gICAgICAgIFt0aW1lX2Zyb20sIHRpbWVfdG9dID0gW3RpbWVfdG8sIHRpbWVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC00LDRgiDQvNC10LbQtNGDINC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRkYXlzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgJGRheXNbaV0uY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2VsZWN0ZWQtYmV0d2VlbicsICRkYXlzW2ldLmRhdGFzZXQudGltZSA+IHRpbWVfZnJvbSAmJiAkZGF5c1tpXS5kYXRhc2V0LnRpbWUgPCB0aW1lX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0Lkg0L/QvtC30LjRhtC40LhcclxuICAgIGNvbnN0ICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICE9ICRkYXlfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgIT0gJGRheV90bykge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtGF0YDQsNC90LXQvdC40LUg0LIg0LrQtdGIXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkID0gJGRheV9mcm9tO1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgPSAkZGF5X3RvO1xyXG5cclxuICAgIHRoaXMuX3NlbGVjdGlvbi4kZGF5X2Zyb20gPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24uJGRheV90byAgID0gJGRheV90bztcclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgIGNvbnN0IGRheXMgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRpbWVfZnJvbSAtIHRpbWVfdG8pIC8gODY0MDBlMykgKyAxO1xyXG4gICAgICAgIHRoaXMuX3Rvb2x0aXBTaG93KGRheXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0J/QvtC60LDQtyDQv9C+0LTRgdC60LDQt9C60LhcclxuICogQHBhcmFtIHtOdW1iZXJ9IGRheXMg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3Rvb2x0aXBTaG93ID0gZnVuY3Rpb24oZGF5cykge1xyXG4gICAgdGhpcy5fJHRvb2x0aXBDb250ZW50LnRleHRDb250ZW50ID0gdGhpcy5fZmlsdGVyVG9vbHRpcFRleHQoZGF5cyk7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zaG93JywgdGhpcy5fJHRvb2x0aXAudGV4dENvbnRlbnQubGVuZ3RoKTtcclxuICAgIHRoaXMuX3Rvb2x0aXBVcGRhdGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INC/0L7Qt9C40YbQuNC4INC/0L7QtNGB0LrQsNC30LrQuFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcFVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uJGRheV90bykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgeCA9IDA7XHJcbiAgICBsZXQgeSA9IDA7XHJcbiAgICBsZXQgJGVsID0gdGhpcy5fc2VsZWN0aW9uLiRkYXlfdG87XHJcbiAgICBkbyB7XHJcbiAgICAgICAgeSArPSAkZWwub2Zmc2V0VG9wO1xyXG4gICAgICAgIHggKz0gJGVsLm9mZnNldExlZnQ7XHJcbiAgICB9IHdoaWxlICgoJGVsID0gJGVsLm9mZnNldFBhcmVudCkgJiYgJGVsICE9IHRoaXMuXyRwaWNrZXIpO1xyXG5cclxuICAgIHRoaXMuXyR0b29sdGlwLnN0eWxlLnRvcCA9IE1hdGgucm91bmQoeSAtIHRoaXMuXyR0b29sdGlwLm9mZnNldEhlaWdodCkgKyAncHgnO1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUubGVmdCA9IE1hdGgucm91bmQoeCArIHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvLm9mZnNldFdpZHRoIC8gMiAtIHRoaXMuXyR0b29sdGlwLm9mZnNldFdpZHRoIC8gMikgKyAncHgnO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQutGA0YvRgtGMINC/0L7QtNGB0LrQsNC30LrRg1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcEhpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuXyR0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNob3cnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCi0LXQutGB0YIg0L/QvtC00YHQutCw0LfQutC4INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAqIEBwYXJhbSAge051bWJlcn0gZGF5cyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9maWx0ZXJUb29sdGlwVGV4dCA9IGZ1bmN0aW9uKGRheXMpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmZpbHRlci50b29sdGlwVGV4dCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIudG9vbHRpcFRleHQuY2FsbCh0aGlzLCBkYXlzKSB8fCAnJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5wbHVyYWwoZGF5cywgWyclZCDQtNC10L3RjCcsICclZCDQtNC90Y8nLCAnJWQg0LTQvdC10LknXSkucmVwbGFjZSgnJWQnLCBkYXlzKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0LjQu9GM0YLRgCDQvdC10LTQvtGB0YLRg9C/0L3Ri9GFINC00L3QtdC5XHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fZmlsdGVyTG9ja0RheXMgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQstC90LUg0LTQvtGB0YLRg9C/0L3QvtCz0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlIHx8IGRhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBMT0NLX1VOQVZBSUxBQkxFO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjNGB0LrQuNC1INGE0YPQvdC60YbQuNC4XHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5maWx0ZXIubG9ja0RheXMgPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmlsdGVyLmxvY2tEYXlzLmNhbGwoZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRgdC1INC00L3QuCDQtNC+0YHRgtGD0L/QvdGLXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDQuNC30LzQtdC90LXQvdC40Y8g0YDQsNC30LzQtdGA0L7QsiDQvtC60L3QsFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25XaW5kb3dSZXNpemVFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uJGRheV90bykge1xyXG4gICAgICAgIHRoaXMuX3Rvb2x0aXBVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYnJlYWtwb2ludCA9IDA7XHJcbiAgICBjb25zdCBicmVha3BvaW50cyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xyXG4gICAgZm9yIChsZXQgaSBpbiBicmVha3BvaW50cykge1xyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSBicmVha3BvaW50c1tpXSkge1xyXG4gICAgICAgICAgICBicmVha3BvaW50ID0gYnJlYWtwb2ludHNbaV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9zZXRCcmVha3BvaW50KGJyZWFrcG9pbnQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGB0L7RgdGC0L7Rj9C90LjRjyDRgNC10L3QtNC10YDQsCDQv9C+0LQg0YDQsNC30L3Ri9C1INGN0LrRgNCw0L3Ri1xyXG4gKiBAcGFyYW0ge051bWJlcn0gYnJlYWtwb2ludCDQmtC70Y7RhyDQuNC3IHRoaXMub3B0aW9ucy5icmVha3BvaW50cyAo0KjQuNGA0LjQvdCwINGN0LrRgNCw0L3QsClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3NldEJyZWFrcG9pbnQgPSBmdW5jdGlvbihicmVha3BvaW50KSB7XHJcbiAgICAvLyDQvtGCINC90LXQvdGD0LbQvdC+0Lkg0L/QtdGA0LXRgNC40YHQvtCy0LrQuFxyXG4gICAgaWYgKHRoaXMuX2JyZWFrcG9pbnQgPT0gYnJlYWtwb2ludCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuX2JyZWFrcG9pbnQgPSBicmVha3BvaW50O1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCB0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pO1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRocyh0aGlzLl9zZWxlY3RlZERhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0K3Qu9C10LzQtdC90YIg0LrQsNC70LXQvdC00LDRgNC90L7Qs9C+INC00L3Rj1xyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9ICAgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGdldERheUJ5RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpbWUgPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogMDtcclxuICAgIHJldHVybiB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5EYXlbZGF0YS10aW1lPVwiJyArIHRpbWUgKyAnXCJdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPIC0g0LfQsNCz0LvRg9GI0LrQuFxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVtcHR5RGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXkgaXMtZW1wdHlcIj48L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkZGF5O1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwINC40LcgSFRNTCDRgtC10LrRgdGC0LBcclxuICogQHBhcmFtICB7U3RyaW5nfSBodG1sIEhUTUwg0YLQtdC60YHRglxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XHJcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgIHJldHVybiBkaXYuY2hpbGRyZW4ubGVuZ3RoID4gMSA/IGRpdi5jaGlsZHJlbiA6IGRpdi5maXJzdEVsZW1lbnRDaGlsZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNhZmUg0LLRi9C30L7QsiDQstC90LXRiNC90LjRhSDRgdC+0LHRi9GC0LjQuSDQutC+0LzQv9C+0L3QtdC90YLQsFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZiDQmNC80Y8g0YHQvtCx0YvRgtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2NhbGxiYWNrID0gZnVuY3Rpb24oZikge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25bZl0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub25bZl0uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm47XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGVSYW5nZVBpY2tlcjtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9kaXN0L2RhdGVyYW5nZXBpY2tlci5qcyIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2RlbW8vcGFnZS5zY3NzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9kZW1vL3BhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJLElBQXlEO0FBQzdEO0FBQ0EsTUFBTSxFQUtnQztBQUN0QyxDQUFDO0FBQ0Qsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQSxjQUFjLDhCQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxnQkFBZ0IsOEJBQW1CLHdCQUF3Qiw4QkFBbUI7QUFDOUUsbURBQW1ELHlDQUF5QztBQUM1RjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxpRUFBaUUsa0JBQWtCO0FBQ25GO0FBQ0EsMERBQTBELGNBQWM7QUFDeEU7QUFDQSxXQUFXO0FBQ1g7QUFD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UztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsOERBQVc7QUFDbEM7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJmaWxlIjoiLi9kZW1vL3BhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkRhdGVyYW5nZXBpY2tlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKCgpID0+IHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHRcInVzZSBzdHJpY3RcIjtcbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgc2NvcGVcbi8qKioqKiovIFx0dmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcbi8qKioqKiovIFx0XHRcdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcbi8qKioqKiovIFx0XHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKVxuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuLyoqKioqKi8gXHRcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4vKioqKioqLyBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuLy8gVGhpcyBlbnRyeSBuZWVkIHRvIGJlIHdyYXBwZWQgaW4gYW4gSUlGRSBiZWNhdXNlIGl0IG5lZWQgdG8gYmUgaXNvbGF0ZWQgYWdhaW5zdCBvdGhlciBlbnRyeSBtb2R1bGVzLlxuKCgpID0+IHtcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9zY3NzL2luZGV4LnNjc3MgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5cbn0pKCk7XG5cbi8vIFRoaXMgZW50cnkgbmVlZCB0byBiZSB3cmFwcGVkIGluIGFuIElJRkUgYmVjYXVzZSBpdCBuZWVkIHRvIGJlIGlzb2xhdGVkIGFnYWluc3Qgb3RoZXIgZW50cnkgbW9kdWxlcy5cbigoKSA9PiB7XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL2pzL2luZGV4LmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqL1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLyogaGFybW9ueSBleHBvcnQgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIHtcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJMT0NLX1VOQVZBSUxBQkxFXCI6ICgpID0+ICgvKiBiaW5kaW5nICovIExPQ0tfVU5BVkFJTEFCTEUpLFxuLyogaGFybW9ueSBleHBvcnQgKi8gICBcIkxPQ0tfTE9DS0VEXCI6ICgpID0+ICgvKiBiaW5kaW5nICovIExPQ0tfTE9DS0VEKSxcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJkZWZhdWx0XCI6ICgpID0+IChfX1dFQlBBQ0tfREVGQVVMVF9FWFBPUlRfXylcbi8qIGhhcm1vbnkgZXhwb3J0ICovIH0pO1xuLy8g0YHQvtGB0YLQvtGP0L3QuNGPINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuY29uc3QgTE9DS19VTkFWQUlMQUJMRSA9IDE7XHJcbmNvbnN0IExPQ0tfTE9DS0VEICAgICAgPSAyO1xyXG5cclxuY29uc3QgSU5ERVhfREFURV9GUk9NID0gMDtcclxuY29uc3QgSU5ERVhfREFURV9UTyAgID0gMTtcclxuXHJcbmZ1bmN0aW9uIERhdGVSYW5nZVBpY2tlcigkY29udGFpbmVyLCBvcHRpb25zID0ge30pIHtcclxuICAgIC8vINC+0YIg0L/QvtCy0YLQvtGA0L3QvtC5INC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4XHJcbiAgICBpZiAoJGNvbnRhaW5lci5pbnN0YW5jZSkge1xyXG4gICAgICAgIHJldHVybiAkY29udGFpbmVyLmluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgJGNvbnRhaW5lci5pbnN0YW5jZSA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5fJGNvbnRhaW5lciA9ICRjb250YWluZXI7XHJcblxyXG4gICAgLy8g0LfQvdCw0YfQtdC90LjQtSDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgY29uc3QgZHYgPSAoeCwgdikgPT4gdHlwZW9mIHggPT0gJ3VuZGVmaW5lZCcgPyB2IDogeDtcclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgZmlyc3REYXlPZlRoZVdlZWs6IGR2KG9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWssIDEpLCAvLyDQv9C10YDQstGL0Lkg0LTQtdC90Ywg0L3QtdC00LXQu9C4LCAwID0g0LLRgSwgMSA9INC/0L0sIC4uLlxyXG4gICAgICAgIHNpbmdsZU1vZGU6ICAgICAgICBkdihvcHRpb25zLnNpbmdsZU1vZGUsIGZhbHNlKSwgICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLINCy0LzQtdGB0YLQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBsb2NhbGU6ICAgICAgICAgICAgZHYob3B0aW9ucy5sb2NhbGUsICdydS1SVScpLFxyXG4gICAgICAgIG1pbkRheXM6ICAgICAgICAgICBkdihvcHRpb25zLm1pbkRheXMsIDEpLCAgICAgICAgICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuSDQsiDQtNC40LDQv9Cw0LfQvtC90LVcclxuICAgICAgICBtb250aHNDb3VudDogICAgICAgZHYob3B0aW9ucy5tb250aHNDb3VudCwgMTIpLFxyXG4gICAgICAgIHBlclJvdzogICAgICAgICAgICBkdihvcHRpb25zLnBlclJvdywgdW5kZWZpbmVkKSwgICAgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LzQtdGB0Y/RhtC10LIg0LIg0YDRj9C00YNcclxuICAgICAgICBtaW5EYXRlOiAgICAgICAgICAgZHYob3B0aW9ucy5taW5EYXRlLCBuZXcgRGF0ZSgpKSwgIC8vINC80LjQvdC40LzQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAgICBtYXhEYXRlOiAgICAgICAgICAgZHYob3B0aW9ucy5tYXhEYXRlLCB1bmRlZmluZWQpLFxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiAgICAgICBkdihvcHRpb25zLmJyZWFrcG9pbnRzLCB7fSksXHJcbiAgICAgICAgaW50ZXJuYWxJbnB1dHM6ICAgIGR2KG9wdGlvbnMuaW50ZXJuYWxJbnB1dHMsIHRydWUpLCAvLyDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjQtSDQstGB0YLRgNC+0LXQvdC90YvRhSDQuNC90L/Rg9GC0L7QslxyXG4gICAgICAgIC8vINGB0L7QsdGL0YLQuNGPXHJcbiAgICAgICAgb246IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICByYW5nZVNlbGVjdDogbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICAgICAgICAgICAgZGF5U2VsZWN0OiAgIG51bGwsIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQvtC00L3QvtC5INC00LDRgtGLICjRgtC+0LvRjNC60L4g0L/RgNC4IHNpbmdsZU1vZGU6IHRydWUpXHJcbiAgICAgICAgfSwgb3B0aW9ucy5vbiB8fCB7fSksXHJcbiAgICAgICAgLy8g0YTQuNC70YzRgtGA0YPRjtGJ0LjQtSDQvNC10YLQvtC00YtcclxuICAgICAgICBmaWx0ZXI6IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICBsb2NrRGF5czogICAgbnVsbCwgLy8gY2FsbGJhY2soZGF0ZSkg0YTRg9C90LrRhtC40Y8g0LHQu9C+0LrQuNGA0L7QstCw0L3QuNGPINC00LDRgiwgdHJ1ZS9MT0NLXHJcbiAgICAgICAgICAgIHRvb2x0aXBUZXh0OiBudWxsLCAvLyBjYWxsYmFjayhkYXlzKSDQstGL0LLQvtC0INGC0LXQutGB0YLQsCDQv9C+0LTRgdC60LDQt9C60LhcclxuICAgICAgICB9LCBvcHRpb25zLmZpbHRlciB8fCB7fSksXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRj1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyDRgNGP0LTQvdC+0YHRgtGMXHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5wZXJSb3cgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMucGVyUm93ID0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5taW5EYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC+0L/RhtC40Lgg0LTQu9GPINGN0LrRgNCw0L3QvtCyINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAgICB0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbdGhpcy5fYnJlYWtwb2ludCA9IDBdID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zKTtcclxuXHJcbiAgICAvLyDRgtC10LrRg9GJ0LjQuSDQtNC10L3RjFxyXG4gICAgdGhpcy5fdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgdGhpcy5fdG9kYXkuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgdGhpcy5fJHBpY2tlciA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyXCI+XHJcbiAgICAgICAgICAgICR7dGhpcy5vcHRpb25zLmludGVybmFsSW5wdXRzID9cclxuICAgICAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX19pbnB1dHNcIj5cclxuICAgICAgICAgICAgICAgICAgICAke3RoaXMub3B0aW9ucy5zaW5nbGVNb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gYDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImRhdGVcIj5gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogYDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImRhdGVfZnJvbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkYXRlX3RvXCI+YFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDwvZGl2PmAgOiAnJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX21vbnRoc1wiPjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX190b29sdGlwXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX190b29sdGlwLWNvbnRlbnRcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyDRjdC70LXQvNC10L3RgtGLXHJcbiAgICB0aGlzLl8kbW9udGhzICAgICAgICAgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5EYXRlcmFuZ2VwaWNrZXJfX21vbnRocycpO1xyXG4gICAgdGhpcy5fJHRvb2x0aXAgICAgICAgID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX190b29sdGlwJyk7XHJcbiAgICB0aGlzLl8kdG9vbHRpcENvbnRlbnQgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5EYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXAtY29udGVudCcpO1xyXG5cclxuICAgIC8vINC/0L7Qu9GPINCy0LLQvtC00LBcclxuICAgIHRoaXMuXyRpbnB1dHMgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWVePVwiZGF0ZVwiXScpO1xyXG5cclxuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gICAgdGhpcy5fc2VsZWN0aW9uID0ge307XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKHRoaXMub3B0aW9ucy5taW5EYXRlKTtcclxuICAgIHRoaXMuXyRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fJHBpY2tlcik7XHJcblxyXG4gICAgLy8g0L7QsdGA0LDQsdC+0YLQutCwINCx0YDQtdC50LrQv9C+0LjQvdGC0L7QslxyXG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykubGVuZ3RoKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uV2luZG93UmVzaXplRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5fb25XaW5kb3dSZXNpemVFdmVudCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0J3QsNC30LLQsNC90LjQtSDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRNb250aEZvcm1hdHRlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7bW9udGg6ICdsb25nJ30pO1xyXG4gICAgcmV0dXJuIHRpdGxlLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aXRsZS5zbGljZSgxKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0Ysg0LTQu9GPINGC0LXQutGD0YnQtdC5INC70L7QutCw0LvQuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyDQn9Cw0YDQsNC80LXRgtGA0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlVGltZUZvcm1hdCA9IGZ1bmN0aW9uKGRhdGUsIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMub3B0aW9ucy5sb2NhbGUsIG9wdGlvbnMpLmZvcm1hdChkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCU0L3QuCDQvdC10LTQtdC70LhcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0V2Vla0RheXNGb3JtYXR0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gMik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7ICsraSkge1xyXG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgZGF5OiBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7d2Vla2RheTogJ3Nob3J0J30pLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINGB0L7Qs9C70LDRgdC90L4g0L3QsNGB0YLRgNC+0LXQvdC90L7QvNGDINC/0LXRgNCy0L7QvNGDINC00L3RjiDQvdC10LTQtdC70LhcclxuICAgIHJlc3VsdC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmlyc3REYXlPZlRoZVdlZWsgPSB0aGlzLm9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgJSA3O1xyXG4gICAgICAgIGxldCBkYXlBID0gYS5kYXk7XHJcbiAgICAgICAgbGV0IGRheUIgPSBiLmRheTtcclxuXHJcbiAgICAgICAgaWYgKGRheUEgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUIgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QSA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIGRheUEgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlCIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgZGF5QiArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRheUEgLSBkYXlCO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC80LXRgdGP0YbQtVxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9ICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERheXNDb3VudEluTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRheXMuc2V0TW9udGgoZGF5cy5nZXRNb250aCgpICsgMSk7XHJcbiAgICBkYXlzLnNldERhdGUoMCk7XHJcbiAgICByZXR1cm4gZGF5cy5nZXREYXRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFJlc2V0KCk7XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24gPSB7fTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQtNC10LvQtdC90LjQtSDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnJhbmdlU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZShkYXRlX2Zyb20sIGRhdGVfdG8pKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0ICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcblxyXG4gICAgLy8g0YHQvtGF0YDQsNC90LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNGPXHJcbiAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tID0gZGF0ZV9mcm9tO1xyXG4gICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gICA9IGRhdGVfdG87XHJcblxyXG4gICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LIg0L7QsdGA0LDRgtC90L7QvCDQv9C+0YDRj9C00LrQtVxyXG4gICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC+0LHQvdC+0LLQu9C10L3QuNC1INC40L3Qv9GD0YLQvtCyXHJcbiAgICBpZiAodGhpcy5fJGlucHV0c1tJTkRFWF9EQVRFX0ZST01dKSB7XHJcbiAgICAgICAgdGhpcy5fJGlucHV0c1tJTkRFWF9EQVRFX0ZST01dLnZhbHVlID0gdGhpcy5mb3JtYXREYXRlKGRhdGVfZnJvbSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9UT10pIHtcclxuICAgICAgICB0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfVE9dLnZhbHVlID0gdGhpcy5mb3JtYXREYXRlKGRhdGVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7QsdGL0YLQuNC1XHJcbiAgICB0aGlzLl9jYWxsYmFjaygncmFuZ2VTZWxlY3QnLCBkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG59XHJcblxyXG4vKipcclxuICog0KTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90LjQtSDQtNCw0YLRi1xyXG4gKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHBhcmFtICB7U3RyaW5nfSBmb3JtYXQg0KTQvtGA0LzQsNGCINGB0YLRgNC+0LrQuFxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmZvcm1hdERhdGUgPSBmdW5jdGlvbihkYXRlLCBmb3JtYXQgPSAnWS1tLWQnKSB7XHJcbiAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UoJ1knLCBkYXRlLmdldEZ1bGxZZWFyKCkpXHJcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ20nLCAoJzAnICsgKGRhdGUuZ2V0TW9udGgoKSArIDEpKS5zbGljZSgtMikpXHJcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ2QnLCAoJzAnICsgKGRhdGUuZ2V0RGF0ZSgpKSkuc2xpY2UoLTIpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0YDQvtCy0LXRgNC60LAg0LLQvtC30LzQvtC20L3QvtGB0YLQuCDQstGL0LTQtdC70LXQvdC40Y8g0LTQsNGCXHJcbiAqIEBwYXJhbSAge0RhdGUgZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0gIHtEYXRlIGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldElzUmFuZ2VTZWxlY3RhYmxlID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3Ri9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhkYXRlX2Zyb20uZ2V0VGltZSgpIC0gZGF0ZV90by5nZXRUaW1lKCkpIC8gMTAwMCAvIDg2NDAwO1xyXG4gICAgaWYgKGRpZmYgPCB0aGlzLm9wdGlvbnMubWluRGF5cykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9GA0L7QstC10YDQutCwINC/0L7Qv9Cw0LTQsNC90LjRjyDQsiDQtNC40LDQv9Cw0LfQvtC9INC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKCk7XHJcbiAgICBkYXkuc2V0VGltZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuXHJcbiAgICB3aGlsZSAoZGF5IDwgZGF0ZV90bykge1xyXG4gICAgICAgIGlmICh0aGlzLl9maWx0ZXJMb2NrRGF5cyhkYXkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRheS5zZXREYXRlKGRheS5nZXREYXRlKCkgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQsdGA0LDQvdC90LDRjyDQvdCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHJldHVybiB7RGF0ZX0g0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZUZyb20gPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINC90LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsCDQvdC1INGD0LrQsNC30LDQvdCwXHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwINC/0L7Qt9C20LUg0LrQvtC90LXRh9C90L7QuVxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQsdGA0LDQvdC90LDRjyDQtNCw0YLQsCAoc2luZ2xlTW9kZTogdHJ1ZSlcclxuICogQHJldHVybiB7RGF0ZX0g0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZSA9IERhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZUZyb207XHJcblxyXG4vKipcclxuICog0JLRi9Cx0YDQsNC90L3QsNGPINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICogQHJldHVybiB7RGF0ZX0g0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZVRvID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyDQutC+0L3QtdGH0L3QsNGPINC00LDRgtCwINC90LUg0YPQutCw0LfQsNC90LBcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwINC/0L7Qt9C20LUg0LrQvtC90LXRh9C90L7QuVxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA+IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb207XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQutC70L7QvdC10L3QuNC1ICgxINCx0L7QsdGR0YAsIDIg0LHQvtCx0YDQsCwgNSDQsdC+0LHRgNC+0LIpXHJcbiAqIEBwYXJhbSAge051bWJlcn0gdmFsdWUg0JrQvtC70LjRh9C10YHRgtCy0L5cclxuICogQHBhcmFtICB7QXJyYXl9ICBmb3JtcyDQnNCw0YHRgdC40LIg0LjQtyAz0YUg0Y3Qu9C10LzQtdC90YLQvtCyLCDQvNC+0LbQtdGCINGB0L7QtNC10YDQttCw0YLRjCDRgdC/0LXRhtC40YTQuNC60LDRgtC+0YAgJWQg0LTQu9GPINC30LDQvNC10L3Ri1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnBsdXJhbCA9IGZ1bmN0aW9uICh2YWx1ZSwgZm9ybXMpIHtcclxuICAgIHJldHVybiAodmFsdWUgJSAxMCA9PSAxICYmIHZhbHVlICUgMTAwICE9IDExID8gZm9ybXNbMF0gOiAodmFsdWUgJSAxMCA+PSAyICYmIHZhbHVlICUgMTAgPD0gNCAmJiAodmFsdWUgJSAxMDAgPCAxMCB8fCB2YWx1ZSAlIDEwMCA+PSAyMCkgPyBmb3Jtc1sxXSA6IGZvcm1zWzJdKSkucmVwbGFjZSgnJWQnLCB2YWx1ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQuNCw0L/QsNC30L7QvdCwINC80LXRgdGP0YbQtdCyXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZU1vbnRocyA9IGZ1bmN0aW9uKGRhdGVfZnJvbSkge1xyXG4gICAgd2hpbGUgKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCkge1xyXG4gICAgICAgIHRoaXMuXyRtb250aHMucmVtb3ZlQ2hpbGQodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9GA0Y/Rh9C10Lwg0L/QvtC00YHQutCw0LfQutGDXHJcbiAgICB0aGlzLl90b29sdGlwSGlkZSgpO1xyXG5cclxuICAgIC8vINC/0YDQtdGA0LXQvdC00LXRgCDQvNC10YHRj9GG0LXQslxyXG4gICAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuICAgIGNvbnN0ICRtb250aHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50OyArK2kpIHtcclxuICAgICAgICAkbW9udGhzLnB1c2godGhpcy5fJGNyZWF0ZU1vbnRoKGN1cnJlbnREYXRlKSk7XHJcbiAgICAgICAgY3VycmVudERhdGUuc2V0TW9udGgoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkbW9udGhzLmxlbmd0aDsgaSArPSB0aGlzLm9wdGlvbnMucGVyUm93KSB7XHJcbiAgICAgICAgY29uc3QgJHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICRyb3cuY2xhc3NOYW1lID0gJ0RhdGVyYW5nZXBpY2tlcl9fcm93JztcclxuXHJcbiAgICAgICAgJG1vbnRocy5zbGljZShpLCBpICsgdGhpcy5vcHRpb25zLnBlclJvdykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgICAgICAkcm93LmFwcGVuZENoaWxkKCRtb250aCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuXyRtb250aHMuYXBwZW5kQ2hpbGQoJHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSDQnNC10YHRj9GGXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCBjdXJyZW50TW9udGggPSBkYXRlLmdldE1vbnRoKCk7XHJcbiAgICBjb25zdCBtb250aFRpdGxlID0gdGhpcy5nZXRNb250aEZvcm1hdHRlZChkYXRlKTtcclxuICAgIGNvbnN0IHdlZWtEYXlzID0gdGhpcy5nZXRXZWVrRGF5c0Zvcm1hdHRlZCgpO1xyXG5cclxuICAgIGNvbnN0ICRtb250aCA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiTW9udGhcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2hlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLXByZXYkeyh0aGlzLm9wdGlvbnMubWluRGF0ZSAmJiBkYXRlIDw9IHRoaXMub3B0aW9ucy5taW5EYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTcgMTNMMSA3TDcgMVwiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX3RpdGxlXCI+JHttb250aFRpdGxlfSAke2RhdGUuZ2V0RnVsbFllYXIoKX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fYXJyb3cgTW9udGhfX2Fycm93LS1uZXh0JHsodGhpcy5vcHRpb25zLm1heERhdGUgJiYgZGF0ZSA+PSB0aGlzLm9wdGlvbnMubWF4RGF0ZSkgPyAnIGlzLWRpc2FibGVkJyA6ICcnfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xIDAuOTk5OTk5TDcgN0wxIDEzXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla1wiPiR7d2Vla0RheXMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtkYXlcIj4ke2l0ZW0udGl0bGV9PC9kaXY+YFxyXG4gICAgICAgICAgICB9KS5qb2luKCcnKX08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19kYXlzXCI+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyDRgdGC0YDQtdC70LrQuFxyXG4gICAgW1xyXG4gICAgICAgIHtzZWxlY3RvcjogJy5Nb250aF9fYXJyb3ctLXByZXYnLCBuYW1lOiAncHJldid9LFxyXG4gICAgICAgIHtzZWxlY3RvcjogJy5Nb250aF9fYXJyb3ctLW5leHQnLCBuYW1lOiAnbmV4dCd9LFxyXG4gICAgXS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIGNvbnN0ICRhcnJvdyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKGl0ZW0uc2VsZWN0b3IpO1xyXG4gICAgICAgICRhcnJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgICAgICAvLyDQstGA0LXQvNC10L3QvdCw0Y8g0LzQtdGA0LAsINC70YPRh9GI0LUg0L/QtdGA0LXQstC10YDRgdGC0LDRgtGMLCDQstGL0L3QtdGB0YLQuCDRgdGC0YDQtdC70LrQuCDQt9CwINC/0YDQtdC00LXQu9GLINC/0LXRgNC10YDQtdGA0LjRgdC+0LLRi9Cy0LDQtdC80L7QuSDQvtCx0LvQsNGB0YLQuCDQv9C40LrQtdGA0LBcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX29uQXJyb3dDbGljaygkYXJyb3csIGl0ZW0ubmFtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YAg0LTQvdC10LlcclxuICAgIGNvbnN0ICRkYXlzID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aF9fZGF5cycpO1xyXG4gICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgIGRheXMuc2V0RGF0ZSgxKTtcclxuICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgd2hpbGUgKGRheXMuZ2V0TW9udGgoKSA9PSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVXZWVrKCk7XHJcblxyXG4gICAgICAgIHdlZWtEYXlzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXlzLmdldERheSgpICE9IGl0ZW0uZGF5IHx8IGRheXMuZ2V0TW9udGgoKSAhPSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVFbXB0eURheSgpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZURheShkYXlzKSk7XHJcbiAgICAgICAgICAgIGRheXMuc2V0RGF0ZShkYXlzLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkZGF5cy5hcHBlbmRDaGlsZCgkd2Vlayk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICRtb250aDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0LvQuNC6INC/0L4g0YHRgtGA0LXQu9C60LUg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPINC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRhcnJvdyBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lICAgINCY0LzRjyAocHJldiwgbmV4dClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uQXJyb3dDbGljayA9IGZ1bmN0aW9uKCRhcnJvdywgbmFtZSkge1xyXG4gICAgaWYgKCRhcnJvdy5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLk1vbnRoJykuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyAobmFtZSA9PSAncHJldicgPyAtdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50IDogdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KSk7XHJcblxyXG4gICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LjQvdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1pbkRhdGUuZ2V0VGltZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0YXQvtC0INC30LAg0L/RgNC10LTQtdC70Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICBjb25zdCBlbmREYXRlID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGVuZERhdGUuc2V0TW9udGgoZW5kRGF0ZS5nZXRNb250aCgpICsgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KTtcclxuICAgICAgICBpZiAoZW5kRGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWF4RGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSAtIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCArIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9C10YDQtdGF0L7QtCDQuiDQvdC+0LLQvtC5INC00LDRgtC1XHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGC0LXQutGD0YnQtdC5INC00LDRgtGLINGBINGA0LXQvdC00LXRgNC+0LxcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9zZWxlY3REYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gZGF0ZTtcclxuICAgIHRoaXMuXyRjcmVhdGVNb250aHMoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0L3QtdC00LXQu9C4XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlV2VlayA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJXZWVrXCI+PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gJHdlZWs7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgJGRheSA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5XCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIiBkYXRhLWRheT1cIiR7ZGF0ZS5nZXREYXkoKX1cIj4ke2RhdGUuZ2V0RGF0ZSgpfTwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uRGF5Q2xpY2tFdmVudC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5fb25EYXlNb3VzZUVudGVyRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICB0aGlzLl91cGRhdGVEYXkoJGRheSk7XHJcblxyXG4gICAgcmV0dXJuICRkYXk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5Nb250aCcpLmZvckVhY2goJG1vbnRoID0+IHtcclxuICAgICAgICB0aGlzLl91cGRhdGVNb250aCgkbW9udGgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Lkg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJG1vbnRoINCt0LvQtdC80LXQvdGCINC80LXRgdGP0YbQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdXBkYXRlTW9udGggPSBmdW5jdGlvbigkbW9udGgpIHtcclxuICAgICRtb250aC5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKS5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZURheSgkZGF5KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5INC00L3Rj1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkg0K3Qu9C10LzQtdC90YIg0LTQvdGPXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl91cGRhdGVEYXkgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBjb25zdCBkYXRlICAgPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIGNvbnN0IGxvY2tlZCA9IHRoaXMuX2ZpbHRlckxvY2tEYXlzKGRhdGUpO1xyXG4gICAgY29uc3QgdG9kYXkgID0gdGhpcy5fdG9kYXkuZ2V0VGltZSgpID09IGRhdGUuZ2V0VGltZSgpO1xyXG5cclxuICAgICRkYXkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtZGlzYWJsZWQnLCBsb2NrZWQpO1xyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1sb2NrZWQnLCBsb2NrZWQgPT0gTE9DS19MT0NLRUQpO1xyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy10b2RheScsIHRvZGF5KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INC60LvQuNC60LAg0L/QviDQtNC90Y5cclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5Q2xpY2tFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuX29uRGF5Q2xpY2soZS50YXJnZXQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0YXQvtCy0LXRgNCwXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheU1vdXNlRW50ZXJFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlcihlLnRhcmdldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpdC+0LLQtdGAINC90LAg0Y3Qu9C10LzQtdC90YLQtSDQtNC90Y9cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5TW91c2VFbnRlciA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheS5kYXRhc2V0LnRpbWUgPT0gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbS5nZXRUaW1lKCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC70LjQuiDQv9C+INC00L3RjlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlDbGljayA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIC8vINC00LXQvdGMINC30LDQsdC70L7QutC40YDQvtCy0LDQvVxyXG4gICAgaWYgKCRkYXkuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpXHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrKCdkYXlTZWxlY3QnLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQsdGA0L7RgSDQstGL0LHRgNCw0L3QvdC+0LPQviDRgNCw0L3QtdC1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcblxyXG4gICAgLy8g0LLRi9Cx0YDQsNC90LAg0L3QsNGH0LDQu9GM0L3QsNGPIC8g0LrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZSh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykpIHtcclxuICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmFuZ2VTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0JLQuNC30YPQsNC70YzQvdGL0Lkg0YHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3JhbmdlVmlzdWFsUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgICRkYXlzLmZvckVhY2goJGRheSA9PiB7XHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJywgJ2lzLXNlbGVjdGVkLXRvJywgJ2lzLXNlbGVjdGVkLWJldHdlZW4nKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgIHRoaXMuX3Rvb2x0aXBIaWRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktC40LfRg9Cw0LvRjNC90L7QtSDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgaWYgKGRhdGVfZnJvbSAmJiBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRlX3RvICYmIGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdGltZV9mcm9tID0gZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVfZnJvbS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgbGV0IHRpbWVfdG8gPSBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVfdG8uZ2V0VGltZSgpIDogMDtcclxuICAgIGlmICh0aW1lX2Zyb20gPiB0aW1lX3RvKSB7XHJcbiAgICAgICAgW3RpbWVfZnJvbSwgdGltZV90b10gPSBbdGltZV90bywgdGltZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCINC80LXQttC00YMg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0LlcclxuICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGRheXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAkZGF5c1tpXS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zZWxlY3RlZC1iZXR3ZWVuJywgJGRheXNbaV0uZGF0YXNldC50aW1lID4gdGltZV9mcm9tICYmICRkYXlzW2ldLmRhdGFzZXQudGltZSA8IHRpbWVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDQvdCw0YfQsNC70YzQvdC+0Lkg0Lgg0LrQvtC90LXRh9C90L7QuSDQv9C+0LfQuNGG0LjQuFxyXG4gICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgIT0gJGRheV9mcm9tKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAhPSAkZGF5X3RvKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0YXRgNCw0L3QtdC90LjQtSDQsiDQutC10YhcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCA9ICRkYXlfdG87XHJcblxyXG4gICAgdGhpcy5fc2VsZWN0aW9uLiRkYXlfZnJvbSA9ICRkYXlfZnJvbTtcclxuICAgIHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvICAgPSAkZGF5X3RvO1xyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IE1hdGguZmxvb3IoTWF0aC5hYnModGltZV9mcm9tIC0gdGltZV90bykgLyA4NjQwMGUzKSArIDE7XHJcbiAgICAgICAgdGhpcy5fdG9vbHRpcFNob3coZGF5cyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9C+0LrQsNC3INC/0L7QtNGB0LrQsNC30LrQuFxyXG4gKiBAcGFyYW0ge051bWJlcn0gZGF5cyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcFNob3cgPSBmdW5jdGlvbihkYXlzKSB7XHJcbiAgICB0aGlzLl8kdG9vbHRpcENvbnRlbnQudGV4dENvbnRlbnQgPSB0aGlzLl9maWx0ZXJUb29sdGlwVGV4dChkYXlzKTtcclxuICAgIHRoaXMuXyR0b29sdGlwLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXNob3cnLCB0aGlzLl8kdG9vbHRpcC50ZXh0Q29udGVudC5sZW5ndGgpO1xyXG4gICAgdGhpcy5fdG9vbHRpcFVwZGF0ZSgpO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0L/QvtC30LjRhtC40Lgg0L/QvtC00YHQutCw0LfQutC4XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwVXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB4ID0gMDtcclxuICAgIGxldCB5ID0gMDtcclxuICAgIGxldCAkZWwgPSB0aGlzLl9zZWxlY3Rpb24uJGRheV90bztcclxuICAgIGRvIHtcclxuICAgICAgICB5ICs9ICRlbC5vZmZzZXRUb3A7XHJcbiAgICAgICAgeCArPSAkZWwub2Zmc2V0TGVmdDtcclxuICAgIH0gd2hpbGUgKCgkZWwgPSAkZWwub2Zmc2V0UGFyZW50KSAmJiAkZWwgIT0gdGhpcy5fJHBpY2tlcik7XHJcblxyXG4gICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUudG9wID0gTWF0aC5yb3VuZCh5IC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSArICdweCc7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5zdHlsZS5sZWZ0ID0gTWF0aC5yb3VuZCh4ICsgdGhpcy5fc2VsZWN0aW9uLiRkYXlfdG8ub2Zmc2V0V2lkdGggLyAyIC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0V2lkdGggLyAyKSArICdweCc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60YDRi9GC0Ywg0L/QvtC00YHQutCw0LfQutGDXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwSGlkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2hvdycpO1xyXG59XHJcblxyXG4vKipcclxuICog0KLQtdC60YHRgiDQv9C+0LTRgdC60LDQt9C60Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICogQHBhcmFtICB7TnVtYmVyfSBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2ZpbHRlclRvb2x0aXBUZXh0ID0gZnVuY3Rpb24oZGF5cykge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZmlsdGVyLnRvb2x0aXBUZXh0ID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZpbHRlci50b29sdGlwVGV4dC5jYWxsKHRoaXMsIGRheXMpIHx8ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnBsdXJhbChkYXlzLCBbJyVkINC00LXQvdGMJywgJyVkINC00L3RjycsICclZCDQtNC90LXQuSddKS5yZXBsYWNlKCclZCcsIGRheXMpO1xyXG59XHJcblxyXG4vKipcclxuICog0KTQuNC70YzRgtGAINC90LXQtNC+0YHRgtGD0L/QvdGL0YUg0LTQvdC10LlcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9maWx0ZXJMb2NrRGF5cyA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCy0L3QtSDQtNC+0YHRgtGD0L/QvdC+0LPQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUgfHwgZGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIExPQ0tfVU5BVkFJTEFCTEU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GM0YHQutC40LUg0YTRg9C90LrRhtC40LhcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmZpbHRlci5sb2NrRGF5cyA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIubG9ja0RheXMuY2FsbChkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGB0LUg0LTQvdC4INC00L7RgdGC0YPQv9C90YtcclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INC40LfQvNC10L3QtdC90LjRjyDRgNCw0LfQvNC10YDQvtCyINC+0LrQvdCwXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZUV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvKSB7XHJcbiAgICAgICAgdGhpcy5fdG9vbHRpcFVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBicmVha3BvaW50ID0gMDtcclxuICAgIGNvbnN0IGJyZWFrcG9pbnRzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzKS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XHJcbiAgICBmb3IgKGxldCBpIGluIGJyZWFrcG9pbnRzKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IGJyZWFrcG9pbnRzW2ldKSB7XHJcbiAgICAgICAgICAgIGJyZWFrcG9pbnQgPSBicmVha3BvaW50c1tpXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3NldEJyZWFrcG9pbnQoYnJlYWtwb2ludCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9GB0YLQsNC90L7QstC60LAg0YHQvtGB0YLQvtGP0L3QuNGPINGA0LXQvdC00LXRgNCwINC/0L7QtCDRgNCw0LfQvdGL0LUg0Y3QutGA0LDQvdGLXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBicmVha3BvaW50INCa0LvRjtGHINC40LcgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzICjQqNC40YDQuNC90LAg0Y3QutGA0LDQvdCwKVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fc2V0QnJlYWtwb2ludCA9IGZ1bmN0aW9uKGJyZWFrcG9pbnQpIHtcclxuICAgIC8vINC+0YIg0L3QtdC90YPQttC90L7QuSDQv9C10YDQtdGA0LjRgdC+0LLQutC4XHJcbiAgICBpZiAodGhpcy5fYnJlYWtwb2ludCA9PSBicmVha3BvaW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fYnJlYWtwb2ludCA9IGJyZWFrcG9pbnQ7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9ucy5icmVha3BvaW50c1ticmVha3BvaW50XSk7XHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGhzKHRoaXMuX3NlbGVjdGVkRGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQrdC70LXQvNC10L3RgiDQutCw0LvQtdC90LTQsNGA0L3QvtCz0L4g0LTQvdGPXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICogQHJldHVybiB7RWxlbWVudH0gICBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kZ2V0RGF5QnlEYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgdGltZSA9IGRhdGUgaW5zdGFuY2VvZiBEYXRlID8gZGF0ZS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgcmV0dXJuIHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLkRheVtkYXRhLXRpbWU9XCInICsgdGltZSArICdcIl0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC90Y8gLSDQt9Cw0LPQu9GD0YjQutC4XHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRW1wdHlEYXkgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRheSBpcy1lbXB0eVwiPjwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuICRkYXk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LfQtNCw0L3QuNC1INGN0LvQtdC80LXQvdGC0LAg0LjQtyBIVE1MINGC0LXQutGB0YLQsFxyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGh0bWwgSFRNTCDRgtC10LrRgdGCXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGh0bWwpIHtcclxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZGl2Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGh0bWwpO1xyXG4gICAgcmV0dXJuIGRpdi5jaGlsZHJlbi5sZW5ndGggPiAxID8gZGl2LmNoaWxkcmVuIDogZGl2LmZpcnN0RWxlbWVudENoaWxkO1xyXG59XHJcblxyXG4vKipcclxuICogU2FmZSDQstGL0LfQvtCyINCy0L3QtdGI0L3QuNGFINGB0L7QsdGL0YLQuNC5INC60L7QvNC/0L7QvdC10L3RgtCwXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmINCY0LzRjyDRgdC+0LHRi9GC0LjRj1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fY2FsbGJhY2sgPSBmdW5jdGlvbihmKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbltmXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vbltmXS5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybjtcclxufVxyXG5cclxuLyogaGFybW9ueSBkZWZhdWx0IGV4cG9ydCAqLyBjb25zdCBfX1dFQlBBQ0tfREVGQVVMVF9FWFBPUlRfXyA9IChEYXRlUmFuZ2VQaWNrZXIpO1xyXG5cbn0pKCk7XG5cbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19leHBvcnRzX187XG4vKioqKioqLyB9KSgpXG47XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdmQyVmljR0ZqYXk5MWJtbDJaWEp6WVd4TmIyUjFiR1ZFWldacGJtbDBhVzl1SWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k5M1pXSndZV05yTDJKdmIzUnpkSEpoY0NJc0luZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdmQyVmljR0ZqYXk5eWRXNTBhVzFsTDJSbFptbHVaU0J3Y205d1pYSjBlU0JuWlhSMFpYSnpJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTkzWldKd1lXTnJMM0oxYm5ScGJXVXZhR0Z6VDNkdVVISnZjR1Z5ZEhrZ2MyaHZjblJvWVc1a0lpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOTNaV0p3WVdOckwzSjFiblJwYldVdmJXRnJaU0J1WVcxbGMzQmhZMlVnYjJKcVpXTjBJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTh1TDNOeVl5OXpZM056TDJsdVpHVjRMbk5qYzNNaUxDSjNaV0p3WVdOck9pOHZaR0YwWlhKaGJtZGxjR2xqYTJWeUx5NHZjM0pqTDJwekwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRU5CUVVNN1FVRkRSQ3hQT3p0VlExWkJPMVZCUTBFN096czdPMWREUkVFN1YwRkRRVHRYUVVOQk8xZEJRMEU3VjBGRFFTeDNRMEZCZDBNc2VVTkJRWGxETzFkQlEycEdPMWRCUTBFN1YwRkRRU3hGT3pzN096dFhRMUJCTEhkR096czdPenRYUTBGQk8xZEJRMEU3VjBGRFFUdFhRVU5CTEhORVFVRnpSQ3hyUWtGQmEwSTdWMEZEZUVVN1YwRkRRU3dyUTBGQkswTXNZMEZCWXp0WFFVTTNSQ3hGT3pzN096czdPenM3T3pzN1FVTk9RVHM3T3pzN096czdPenM3T3pzN08wRkRRVUU3UVVGRFR6dEJRVU5CT3p0QlFVVlFPMEZCUTBFN08wRkJSVUVzYVVSQlFXbEVPMEZCUTJwRU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4eFJFRkJjVVE3UVVGRGNrUTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxGTkJRVk1zYTBKQlFXdENPMEZCUXpOQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNVMEZCVXl4elFrRkJjMEk3UVVGREwwSTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQkxIRkZRVUZ4UlRzN1FVRkZja1U3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hqUVVGak8wRkJRMlE3UVVGRFFTeHpRa0ZCYzBJN1FVRkRkRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWkxFdEJRVXM3UVVGRGFrSXNXVUZCV1R0QlFVTmFPMEZCUTBFN1FVRkRRU3huUkVGQlowUXNZMEZCWXp0QlFVTTVSRHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WlFVRlpMRXRCUVVzN1FVRkRha0lzV1VGQldTeFBRVUZQTzBGQlEyNUNMRmxCUVZrN1FVRkRXanRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVN4dFFrRkJiVUlzVDBGQlR6dEJRVU14UWp0QlFVTkJPMEZCUTBFN1FVRkRRU3hwUkVGQmFVUXNhVUpCUVdsQ08wRkJRMnhGTEZOQlFWTTdRVUZEVkRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQkxFdEJRVXM3TzBGQlJVdzdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzV1VGQldTeExRVUZMTzBGQlEycENMRmxCUVZrc1QwRkJUenRCUVVOdVFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRXRCUVVzN1FVRkRhRUlzVjBGQlZ5eExRVUZMTzBGQlEyaENPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTEV0QlFVczdRVUZEYWtJc1dVRkJXU3hQUVVGUE8wRkJRMjVDTEZsQlFWazdRVUZEV2p0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrN1FVRkRXaXhaUVVGWk8wRkJRMW9zV1VGQldUdEJRVU5hTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1MwRkJTenRCUVVOcVFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCV1N4TFFVRkxPMEZCUTJwQ08wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1MwRkJTenRCUVVOcVFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCV1N4UFFVRlBPMEZCUTI1Q0xGbEJRVmtzVFVGQlRUdEJRVU5zUWl4WlFVRlpPMEZCUTFvN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1MwRkJTenRCUVVOb1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFc2JVSkJRVzFDTERoQ1FVRTRRanRCUVVOcVJEdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRU3h0UWtGQmJVSXNiMEpCUVc5Q08wRkJRM1pETzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGTkJRVk03TzBGQlJWUTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhMUVVGTE8wRkJRMmhDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFTeDVRMEZCZVVNc1pVRkJaVHRCUVVONFJEdEJRVU5CTERaRVFVRTJSQ3cyUlVGQk5rVTdRVUZETVVrN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTdzBRMEZCTkVNc1YwRkJWeXhIUVVGSExHMUNRVUZ0UWp0QlFVTTNSU3cyUkVGQk5rUXNOa1ZCUVRaRk8wRkJRekZKTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3gxUTBGQmRVTTdRVUZEZGtNc2MwUkJRWE5FTEZkQlFWYzdRVUZEYWtVc1lVRkJZU3hYUVVGWE8wRkJRM2hDTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVTBGQlV5dzRRMEZCT0VNN1FVRkRka1FzVTBGQlV5dzRRMEZCT0VNN1FVRkRka1E3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQkxGTkJRVk03UVVGRFZDeExRVUZMT3p0QlFVVk1PMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hUUVVGVE96dEJRVVZVTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNWMEZCVnl4UlFVRlJPMEZCUTI1Q0xGZEJRVmNzVDBGQlR6dEJRVU5zUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNWMEZCVnl4TFFVRkxPMEZCUTJoQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVmtzUzBGQlN6dEJRVU5xUWl4WlFVRlpPMEZCUTFvN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTEV0QlFVczdRVUZEYWtJc1dVRkJXVHRCUVVOYU8wRkJRMEU3UVVGRFFUdEJRVU5CTEhWRFFVRjFReXhsUVVGbExHTkJRV01zWTBGQll5eEpRVUZKTEdWQlFXVTdRVUZEY2tjN08wRkJSVUU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4TFFVRkxPMEZCUTB3N08wRkJSVUU3UVVGRFFUdEJRVU5CTEZkQlFWY3NVVUZCVVR0QlFVTnVRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEV0QlFVczdRVUZEVERzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eFJRVUZSTzBGQlEyNUNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZkQlFWY3NUVUZCVFR0QlFVTnFRanRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhOUVVGTk8wRkJRMnBDTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEZGQlFWRTdRVUZEYmtJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hYUVVGWExGRkJRVkU3UVVGRGJrSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1MwRkJTenRCUVVOTU8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRXRCUVVzN08wRkJSVXc3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hYUVVGWExFdEJRVXM3UVVGRGFFSXNWMEZCVnl4TFFVRkxPMEZCUTJoQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEcxQ1FVRnRRaXhyUWtGQmEwSTdRVUZEY2tNN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEU5QlFVODdRVUZEYkVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEV0QlFVczdPMEZCUlV3N1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCV1N4UFFVRlBPMEZCUTI1Q0xGbEJRVms3UVVGRFdqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1MwRkJTenRCUVVOb1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRTFCUVUwN1FVRkRha0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1QwRkJUenRCUVVOc1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WlFVRlpMRXRCUVVzN1FVRkRha0lzV1VGQldTeFJRVUZSTzBGQlEzQkNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrN1FVRkRXanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZsQlFWa3NUMEZCVHp0QlFVTnVRaXhaUVVGWk8wRkJRMW83UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEU5QlFVODdRVUZEYkVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQkxHbEZRVUZsTEdWQlFXVXNSVUZCUXlJc0ltWnBiR1VpT2lKa1lYUmxjbUZ1WjJWd2FXTnJaWEl1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SW9ablZ1WTNScGIyNGdkMlZpY0dGamExVnVhWFpsY25OaGJFMXZaSFZzWlVSbFptbHVhWFJwYjI0b2NtOXZkQ3dnWm1GamRHOXllU2tnZTF4dVhIUnBaaWgwZVhCbGIyWWdaWGh3YjNKMGN5QTlQVDBnSjI5aWFtVmpkQ2NnSmlZZ2RIbHdaVzltSUcxdlpIVnNaU0E5UFQwZ0oyOWlhbVZqZENjcFhHNWNkRngwYlc5a2RXeGxMbVY0Y0c5eWRITWdQU0JtWVdOMGIzSjVLQ2s3WEc1Y2RHVnNjMlVnYVdZb2RIbHdaVzltSUdSbFptbHVaU0E5UFQwZ0oyWjFibU4wYVc5dUp5QW1KaUJrWldacGJtVXVZVzFrS1Z4dVhIUmNkR1JsWm1sdVpTaGNJa1JoZEdWeVlXNW5aWEJwWTJ0bGNsd2lMQ0JiWFN3Z1ptRmpkRzl5ZVNrN1hHNWNkR1ZzYzJVZ2FXWW9kSGx3Wlc5bUlHVjRjRzl5ZEhNZ1BUMDlJQ2R2WW1wbFkzUW5LVnh1WEhSY2RHVjRjRzl5ZEhOYlhDSkVZWFJsY21GdVoyVndhV05yWlhKY0lsMGdQU0JtWVdOMGIzSjVLQ2s3WEc1Y2RHVnNjMlZjYmx4MFhIUnliMjkwVzF3aVJHRjBaWEpoYm1kbGNHbGphMlZ5WENKZElEMGdabUZqZEc5eWVTZ3BPMXh1ZlNrb2MyVnNaaXdnWm5WdVkzUnBiMjRvS1NCN1hHNXlaWFIxY200Z0lpd2lMeThnVkdobElISmxjWFZwY21VZ2MyTnZjR1ZjYm5aaGNpQmZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZJRDBnZTMwN1hHNWNiaUlzSWk4dklHUmxabWx1WlNCblpYUjBaWElnWm5WdVkzUnBiMjV6SUdadmNpQm9ZWEp0YjI1NUlHVjRjRzl5ZEhOY2JsOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHVaQ0E5SUNobGVIQnZjblJ6TENCa1pXWnBibWwwYVc5dUtTQTlQaUI3WEc1Y2RHWnZjaWgyWVhJZ2EyVjVJR2x1SUdSbFptbHVhWFJwYjI0cElIdGNibHgwWEhScFppaGZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbThvWkdWbWFXNXBkR2x2Yml3Z2EyVjVLU0FtSmlBaFgxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NXZLR1Y0Y0c5eWRITXNJR3RsZVNrcElIdGNibHgwWEhSY2RFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2hsZUhCdmNuUnpMQ0JyWlhrc0lIc2daVzUxYldWeVlXSnNaVG9nZEhKMVpTd2daMlYwT2lCa1pXWnBibWwwYVc5dVcydGxlVjBnZlNrN1hHNWNkRngwZlZ4dVhIUjlYRzU5T3lJc0lsOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHVieUE5SUNodlltb3NJSEJ5YjNBcElEMCtJQ2hQWW1wbFkzUXVjSEp2ZEc5MGVYQmxMbWhoYzA5M2JsQnliM0JsY25SNUxtTmhiR3dvYjJKcUxDQndjbTl3S1NraUxDSXZMeUJrWldacGJtVWdYMTlsYzAxdlpIVnNaU0J2YmlCbGVIQnZjblJ6WEc1ZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxuSWdQU0FvWlhod2IzSjBjeWtnUFQ0Z2UxeHVYSFJwWmloMGVYQmxiMllnVTNsdFltOXNJQ0U5UFNBbmRXNWtaV1pwYm1Wa0p5QW1KaUJUZVcxaWIyd3VkRzlUZEhKcGJtZFVZV2NwSUh0Y2JseDBYSFJQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrb1pYaHdiM0owY3l3Z1UzbHRZbTlzTG5SdlUzUnlhVzVuVkdGbkxDQjdJSFpoYkhWbE9pQW5UVzlrZFd4bEp5QjlLVHRjYmx4MGZWeHVYSFJQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrb1pYaHdiM0owY3l3Z0oxOWZaWE5OYjJSMWJHVW5MQ0I3SUhaaGJIVmxPaUIwY25WbElIMHBPMXh1ZlRzaUxDSXZMeUJsZUhSeVlXTjBaV1FnWW5rZ2JXbHVhUzFqYzNNdFpYaDBjbUZqZEMxd2JIVm5hVzVjYm1WNGNHOXlkQ0I3ZlRzaUxDSXZMeURSZ2RDKzBZSFJndEMrMFkvUXZkQzQwWThnMExmUXNOQ3gwTHZRdnRDNjBMalJnTkMrMExMUXNOQzkwTDNSaTlHRklOQzAwTERSZ2x4eVhHNWxlSEJ2Y25RZ1kyOXVjM1FnVEU5RFMxOVZUa0ZXUVVsTVFVSk1SU0E5SURFN1hISmNibVY0Y0c5eWRDQmpiMjV6ZENCTVQwTkxYMHhQUTB0RlJDQWdJQ0FnSUQwZ01qdGNjbHh1WEhKY2JtTnZibk4wSUVsT1JFVllYMFJCVkVWZlJsSlBUU0E5SURBN1hISmNibU52Ym5OMElFbE9SRVZZWDBSQlZFVmZWRThnSUNBOUlERTdYSEpjYmx4eVhHNW1kVzVqZEdsdmJpQkVZWFJsVW1GdVoyVlFhV05yWlhJb0pHTnZiblJoYVc1bGNpd2diM0IwYVc5dWN5QTlJSHQ5S1NCN1hISmNiaUFnSUNBdkx5RFF2dEdDSU5DLzBMN1FzdEdDMEw3UmdOQzkwTDdRdVNEUXVOQzkwTGpSaHRDNDBMRFF1OUM0MExmUXNOR0cwTGpRdUZ4eVhHNGdJQ0FnYVdZZ0tDUmpiMjUwWVdsdVpYSXVhVzV6ZEdGdVkyVXBJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnSkdOdmJuUmhhVzVsY2k1cGJuTjBZVzVqWlR0Y2NseHVJQ0FnSUgxY2NseHVJQ0FnSUNSamIyNTBZV2x1WlhJdWFXNXpkR0Z1WTJVZ1BTQjBhR2x6TzF4eVhHNWNjbHh1SUNBZ0lIUm9hWE11WHlSamIyNTBZV2x1WlhJZ1BTQWtZMjl1ZEdGcGJtVnlPMXh5WEc1Y2NseHVJQ0FnSUM4dklOQzMwTDNRc05HSDBMWFF2ZEM0MExVZzBML1F2aURSZzlDODBMN1F1OUdIMExEUXZkQzQwWTVjY2x4dUlDQWdJR052Ym5OMElHUjJJRDBnS0hnc0lIWXBJRDArSUhSNWNHVnZaaUI0SUQwOUlDZDFibVJsWm1sdVpXUW5JRDhnZGlBNklIZzdYSEpjYmx4eVhHNGdJQ0FnZEdocGN5NXZjSFJwYjI1eklEMGdlMXh5WEc0Z0lDQWdJQ0FnSUdacGNuTjBSR0Y1VDJaVWFHVlhaV1ZyT2lCa2RpaHZjSFJwYjI1ekxtWnBjbk4wUkdGNVQyWlVhR1ZYWldWckxDQXhLU3dnTHk4ZzBML1F0ZEdBMExMUmk5QzVJTkMwMExYUXZkR01JTkM5MExYUXROQzEwTHZRdUN3Z01DQTlJTkN5MFlFc0lERWdQU0RRdjlDOUxDQXVMaTVjY2x4dUlDQWdJQ0FnSUNCemFXNW5iR1ZOYjJSbE9pQWdJQ0FnSUNBZ1pIWW9iM0IwYVc5dWN5NXphVzVuYkdWTmIyUmxMQ0JtWVd4elpTa3NJQ0FnSUM4dklOQ3kwWXZRc2RDKzBZQWcwTDdRdE5DOTBMN1F1U0RRdE5DdzBZTFJpeURRc3RDODBMWFJnZEdDMEw0ZzBMVFF1TkN3MEwvUXNOQzMwTDdRdmRDd1hISmNiaUFnSUNBZ0lDQWdiRzlqWVd4bE9pQWdJQ0FnSUNBZ0lDQWdJR1IyS0c5d2RHbHZibk11Ykc5allXeGxMQ0FuY25VdFVsVW5LU3hjY2x4dUlDQWdJQ0FnSUNCdGFXNUVZWGx6T2lBZ0lDQWdJQ0FnSUNBZ1pIWW9iM0IwYVc5dWN5NXRhVzVFWVhsekxDQXhLU3dnSUNBZ0lDQWdJQ0FnSUM4dklOQzgwTGpRdmRDNDBMelFzTkM3MFl6UXZkQyswTFVnMExyUXZ0QzcwTGpSaDlDMTBZSFJndEN5MEw0ZzBMVFF2ZEMxMExrZzBMSWcwTFRRdU5DdzBML1FzTkMzMEw3UXZkQzFYSEpjYmlBZ0lDQWdJQ0FnYlc5dWRHaHpRMjkxYm5RNklDQWdJQ0FnSUdSMktHOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUXNJREV5S1N4Y2NseHVJQ0FnSUNBZ0lDQndaWEpTYjNjNklDQWdJQ0FnSUNBZ0lDQWdaSFlvYjNCMGFXOXVjeTV3WlhKU2IzY3NJSFZ1WkdWbWFXNWxaQ2tzSUNBZ0lDOHZJTkM2MEw3UXU5QzQwWWZRdGRHQjBZTFFzdEMrSU5DODBMWFJnZEdQMFliUXRkQ3lJTkN5SU5HQTBZL1F0TkdEWEhKY2JpQWdJQ0FnSUNBZ2JXbHVSR0YwWlRvZ0lDQWdJQ0FnSUNBZ0lHUjJLRzl3ZEdsdmJuTXViV2x1UkdGMFpTd2dibVYzSUVSaGRHVW9LU2tzSUNBdkx5RFF2TkM0MEwzUXVOQzgwTERRdTlHTTBMM1FzTkdQSU5DMDBMRFJndEN3WEhKY2JpQWdJQ0FnSUNBZ2JXRjRSR0YwWlRvZ0lDQWdJQ0FnSUNBZ0lHUjJLRzl3ZEdsdmJuTXViV0Y0UkdGMFpTd2dkVzVrWldacGJtVmtLU3hjY2x4dUlDQWdJQ0FnSUNCaWNtVmhhM0J2YVc1MGN6b2dJQ0FnSUNBZ1pIWW9iM0IwYVc5dWN5NWljbVZoYTNCdmFXNTBjeXdnZTMwcExGeHlYRzRnSUNBZ0lDQWdJR2x1ZEdWeWJtRnNTVzV3ZFhSek9pQWdJQ0JrZGlodmNIUnBiMjV6TG1sdWRHVnlibUZzU1c1d2RYUnpMQ0IwY25WbEtTd2dMeThnMExqUmdkQy8wTDdRdTlHTTBMZlF2dEN5MExEUXZkQzQwTFVnMExMUmdkR0MwWURRdnRDMTBMM1F2ZEdMMFlVZzBMalF2ZEMvMFlQUmd0QyswTEpjY2x4dUlDQWdJQ0FnSUNBdkx5RFJnZEMrMExIUmk5R0MwTGpSajF4eVhHNGdJQ0FnSUNBZ0lHOXVPaUJQWW1wbFkzUXVZWE56YVdkdUtIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtRnVaMlZUWld4bFkzUTZJRzUxYkd3c0lDOHZJTkdCMEw3UXNkR0wwWUxRdU5DMUlOQ3kwWXZRc2RDKzBZRFFzQ0RRdE5DNDBMRFF2OUN3MExmUXZ0QzkwTEFnMExUUXNOR0NYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHUmhlVk5sYkdWamREb2dJQ0J1ZFd4c0xDQXZMeURSZ2RDKzBMSFJpOUdDMExqUXRTRFFzdEdMMExIUXZ0R0EwTEFnMEw3UXROQzkwTDdRdVNEUXROQ3cwWUxSaXlBbzBZTFF2dEM3MFl6UXV0QytJTkMvMFlEUXVDQnphVzVuYkdWTmIyUmxPaUIwY25WbEtWeHlYRzRnSUNBZ0lDQWdJSDBzSUc5d2RHbHZibk11YjI0Z2ZId2dlMzBwTEZ4eVhHNGdJQ0FnSUNBZ0lDOHZJTkdFMExqUXU5R00wWUxSZ05HRDBZN1JpZEM0MExVZzBMelF0ZEdDMEw3UXROR0xYSEpjYmlBZ0lDQWdJQ0FnWm1sc2RHVnlPaUJQWW1wbFkzUXVZWE56YVdkdUtIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2JHOWphMFJoZVhNNklDQWdJRzUxYkd3c0lDOHZJR05oYkd4aVlXTnJLR1JoZEdVcElOR0UwWVBRdmRDNjBZYlF1TkdQSU5DeDBMdlF2dEM2MExqUmdOQyswTExRc05DOTBMalJqeURRdE5DdzBZSXNJSFJ5ZFdVdlRFOURTMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBiMjlzZEdsd1ZHVjRkRG9nYm5Wc2JDd2dMeThnWTJGc2JHSmhZMnNvWkdGNWN5a2cwTExSaTlDeTBMN1F0Q0RSZ3RDMTBMclJnZEdDMExBZzBML1F2dEMwMFlIUXV0Q3cwTGZRdXRDNFhISmNiaUFnSUNBZ0lDQWdmU3dnYjNCMGFXOXVjeTVtYVd4MFpYSWdmSHdnZTMwcExGeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJSFJvYVhNdWFXNXBkQ2dwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSmpRdmRDNDBZYlF1TkN3MEx2UXVOQzMwTERSaHRDNDBZOWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVhVzVwZENBOUlHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdMeThnMFlEUmo5QzAwTDNRdnRHQjBZTFJqRnh5WEc0Z0lDQWdhV1lnS0hSNWNHVnZaaUIwYUdsekxtOXdkR2x2Ym5NdWNHVnlVbTkzSUQwOUlDZDFibVJsWm1sdVpXUW5LU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbkJsY2xKdmR5QTlJSFJvYVhNdWIzQjBhVzl1Y3k1dGIyNTBhSE5EYjNWdWREdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbTFwYmtSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXViV2x1UkdGMFpTNXpaWFJJYjNWeWN5Z3dMQ0F3TENBd0xDQXdLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFF2dEMvMFliUXVOQzRJTkMwMEx2Ump5RFJqZEM2MFlEUXNOQzkwTDdRc2lEUXY5QytJTkdEMEx6UXZ0QzcwWWZRc05DOTBMalJqbHh5WEc0Z0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1KeVpXRnJjRzlwYm5SelczUm9hWE11WDJKeVpXRnJjRzlwYm5RZ1BTQXdYU0E5SUU5aWFtVmpkQzVoYzNOcFoyNG9lMzBzSUhSb2FYTXViM0IwYVc5dWN5azdYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBZTFF0ZEM2MFlQUmlkQzQwTGtnMExUUXRkQzkwWXhjY2x4dUlDQWdJSFJvYVhNdVgzUnZaR0Y1SUQwZ2JtVjNJRVJoZEdVb0tUdGNjbHh1SUNBZ0lIUm9hWE11WDNSdlpHRjVMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNWNjbHh1SUNBZ0lIUm9hWE11WHlSd2FXTnJaWElnUFNCMGFHbHpMbDhrWTNKbFlYUmxSV3hsYldWdWRDaGNjbHh1SUNBZ0lDQWdJQ0JnUEdScGRpQmpiR0Z6Y3oxY0lrUmhkR1Z5WVc1blpYQnBZMnRsY2x3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBa2UzUm9hWE11YjNCMGFXOXVjeTVwYm5SbGNtNWhiRWx1Y0hWMGN5QS9YSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JnUEdScGRpQmpiR0Z6Y3oxY0lrUmhkR1Z5WVc1blpYQnBZMnRsY2w5ZmFXNXdkWFJ6WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSkh0MGFHbHpMbTl3ZEdsdmJuTXVjMmx1WjJ4bFRXOWtaVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0EvSUdBOGFXNXdkWFFnZEhsd1pUMWNJbWhwWkdSbGJsd2lJRzVoYldVOVhDSmtZWFJsWENJK1lGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQTZJR0E4YVc1d2RYUWdkSGx3WlQxY0ltaHBaR1JsYmx3aUlHNWhiV1U5WENKa1lYUmxYMlp5YjIxY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdsdWNIVjBJSFI1Y0dVOVhDSm9hV1JrWlc1Y0lpQnVZVzFsUFZ3aVpHRjBaVjkwYjF3aVBtQmNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Z0lEb2dKeWRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdmVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpUkdGMFpYSmhibWRsY0dsamEyVnlYMTl0YjI1MGFITmNJajQ4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNJa1JoZEdWeVlXNW5aWEJwWTJ0bGNsOWZkRzl2YkhScGNGd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrUmhkR1Z5WVc1blpYQnBZMnRsY2w5ZmRHOXZiSFJwY0MxamIyNTBaVzUwWENJK1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJRHd2WkdsMlBtQmNjbHh1SUNBZ0lDazdYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBZM1F1OUMxMEx6UXRkQzkwWUxSaTF4eVhHNGdJQ0FnZEdocGN5NWZKRzF2Ym5Sb2N5QWdJQ0FnSUNBZ0lEMGdkR2hwY3k1ZkpIQnBZMnRsY2k1eGRXVnllVk5sYkdWamRHOXlLQ2N1UkdGMFpYSmhibWRsY0dsamEyVnlYMTl0YjI1MGFITW5LVHRjY2x4dUlDQWdJSFJvYVhNdVh5UjBiMjlzZEdsd0lDQWdJQ0FnSUNBOUlIUm9hWE11WHlSd2FXTnJaWEl1Y1hWbGNubFRaV3hsWTNSdmNpZ25Ma1JoZEdWeVlXNW5aWEJwWTJ0bGNsOWZkRzl2YkhScGNDY3BPMXh5WEc0Z0lDQWdkR2hwY3k1ZkpIUnZiMngwYVhCRGIyNTBaVzUwSUQwZ2RHaHBjeTVmSkhCcFkydGxjaTV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VSR0YwWlhKaGJtZGxjR2xqYTJWeVgxOTBiMjlzZEdsd0xXTnZiblJsYm5RbktUdGNjbHh1WEhKY2JpQWdJQ0F2THlEUXY5QyswTHZSanlEUXN0Q3kwTDdRdE5Dd1hISmNiaUFnSUNCMGFHbHpMbDhrYVc1d2RYUnpJRDBnZEdocGN5NWZKSEJwWTJ0bGNpNXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tDZHBibkIxZEZ0dVlXMWxYajFjSW1SaGRHVmNJbDBuS1R0Y2NseHVYSEpjYmlBZ0lDQXZMeURRdU5DOTBMalJodEM0MExEUXU5QzQwTGZRc05HRzBMalJqeURSZ2RDKzBZSFJndEMrMFkvUXZkQzQwTGxjY2x4dUlDQWdJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpQTlJSHQ5TzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkdBMExYUXZkQzAwTFhSZ0Z4eVhHNGdJQ0FnZEdocGN5NWZjMlZzWldOMFJHRjBaU2gwYUdsekxtOXdkR2x2Ym5NdWJXbHVSR0YwWlNrN1hISmNiaUFnSUNCMGFHbHpMbDhrWTI5dWRHRnBibVZ5TG1Gd2NHVnVaRU5vYVd4a0tIUm9hWE11WHlSd2FXTnJaWElwTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkMrMExIUmdOQ3cwTEhRdnRHQzBMclFzQ0RRc2RHQTBMWFF1ZEM2MEwvUXZ0QzQwTDNSZ3RDKzBMSmNjbHh1SUNBZ0lHbG1JQ2hQWW1wbFkzUXVhMlY1Y3loMGFHbHpMbTl3ZEdsdmJuTXVZbkpsWVd0d2IybHVkSE1wTG14bGJtZDBhQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lIZHBibVJ2ZHk1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkeVpYTnBlbVVuTENCMGFHbHpMbDl2YmxkcGJtUnZkMUpsYzJsNlpVVjJaVzUwTG1KcGJtUW9kR2hwY3lrcE8xeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgyOXVWMmx1Wkc5M1VtVnphWHBsUlhabGJuUW9LVHRjY2x4dUlDQWdJSDFjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2QwTERRdDlDeTBMRFF2ZEM0MExVZzBMelF0ZEdCMFkvUmh0Q3dYSEpjYmlBcUlFQndZWEpoYlNBZ2UwUmhkR1Y5SUdSaGRHVWcwSjdRc2RHSzBMWFF1dEdDSU5DMDBMRFJndEdMWEhKY2JpQXFJRUJ5WlhSMWNtNGdlMU4wY21sdVozMWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVaMlYwVFc5dWRHaEdiM0p0WVhSMFpXUWdQU0JtZFc1amRHbHZiaWhrWVhSbEtTQjdYSEpjYmlBZ0lDQmpiMjV6ZENCMGFYUnNaU0E5SUhSb2FYTXVaMlYwUkdGMFpWUnBiV1ZHYjNKdFlYUW9aR0YwWlN3Z2UyMXZiblJvT2lBbmJHOXVaeWQ5S1R0Y2NseHVJQ0FnSUhKbGRIVnliaUIwYVhSc1pTNXpiR2xqWlNnd0xDQXhLUzUwYjFWd2NHVnlRMkZ6WlNncElDc2dkR2wwYkdVdWMyeHBZMlVvTVNrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRcE5DKzBZRFF2TkN3MFlMUXVOR0EwTDdRc3RDdzBMM1F1TkMxSU5DMDBMRFJndEdMSU5DMDBMdlJqeURSZ3RDMTBMclJnOUdKMExYUXVTRFF1OUMrMExyUXNOQzcwTGhjY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlgwZ0lDQmtZWFJsSUNBZ0lOQ2UwTEhSaXRDMTBMclJnaURRdE5DdzBZTFJpMXh5WEc0Z0tpQkFjR0Z5WVcwZ0lIdFBZbXBsWTNSOUlHOXdkR2x2Ym5NZzBKL1FzTkdBMExEUXZOQzEwWUxSZ05HTFhISmNiaUFxSUVCeVpYUjFjbTRnZTFOMGNtbHVaMzFjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WjJWMFJHRjBaVlJwYldWR2IzSnRZWFFnUFNCbWRXNWpkR2x2Ymloa1lYUmxMQ0J2Y0hScGIyNXpLU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdTVzUwYkM1RVlYUmxWR2x0WlVadmNtMWhkQ2gwYUdsekxtOXdkR2x2Ym5NdWJHOWpZV3hsTENCdmNIUnBiMjV6S1M1bWIzSnRZWFFvWkdGMFpTazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUWxOQzkwTGdnMEwzUXRkQzAwTFhRdTlDNFhISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExtZGxkRmRsWld0RVlYbHpSbTl5YldGMGRHVmtJRDBnWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCamIyNXpkQ0JrWVhSbElEMGdibVYzSUVSaGRHVW9LVHRjY2x4dUlDQWdJR052Ym5OMElISmxjM1ZzZENBOUlGdGRPMXh5WEc1Y2NseHVJQ0FnSUdSaGRHVXVjMlYwUkdGMFpTaGtZWFJsTG1kbGRFUmhkR1VvS1NBdElESXBPMXh5WEc0Z0lDQWdabTl5SUNoc1pYUWdhU0E5SURBN0lHa2dQQ0EzT3lBcksya3BJSHRjY2x4dUlDQWdJQ0FnSUNCa1lYUmxMbk5sZEVSaGRHVW9aR0YwWlM1blpYUkVZWFJsS0NrZ0t5QXhLVHRjY2x4dUlDQWdJQ0FnSUNCeVpYTjFiSFF1Y0hWemFDaDdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHUmhlVG9nWkdGMFpTNW5aWFJFWVhrb0tTeGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RHbDBiR1U2SUhSb2FYTXVaMlYwUkdGMFpWUnBiV1ZHYjNKdFlYUW9aR0YwWlN3Z2UzZGxaV3RrWVhrNklDZHphRzl5ZENkOUtTeGNjbHh1SUNBZ0lDQWdJQ0I5S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURSZ2RDKzBZRFJndEM0MFlEUXZ0Q3kwTHJRc0NEUmdkQyswTFBRdTlDdzBZSFF2ZEMrSU5DOTBMRFJnZEdDMFlEUXZ0QzEwTDNRdmRDKzBMelJneURRdjlDMTBZRFFzdEMrMEx6Umd5RFF0TkM5MFk0ZzBMM1F0ZEMwMExYUXU5QzRYSEpjYmlBZ0lDQnlaWE4xYkhRdWMyOXlkQ2dvWVN3Z1lpa2dQVDRnZTF4eVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUdacGNuTjBSR0Y1VDJaVWFHVlhaV1ZySUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVpwY25OMFJHRjVUMlpVYUdWWFpXVnJJQ1VnTnp0Y2NseHVJQ0FnSUNBZ0lDQnNaWFFnWkdGNVFTQTlJR0V1WkdGNU8xeHlYRzRnSUNBZ0lDQWdJR3hsZENCa1lYbENJRDBnWWk1a1lYazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2hrWVhsQklEMDlJR1pwY25OMFJHRjVUMlpVYUdWWFpXVnJLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQXRNVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUdsbUlDaGtZWGxDSUQwOUlHWnBjbk4wUkdGNVQyWlVhR1ZYWldWcktTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlBeE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdhV1lnS0dSaGVVRWdQQ0JtYVhKemRFUmhlVTltVkdobFYyVmxheWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JrWVhsQklDczlJSEpsYzNWc2RDNXNaVzVuZEdnN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvWkdGNVFpQThJR1pwY25OMFJHRjVUMlpVYUdWWFpXVnJLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR1JoZVVJZ0t6MGdjbVZ6ZFd4MExteGxibWQwYUR0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCa1lYbEJJQzBnWkdGNVFqdGNjbHh1SUNBZ0lIMHBPMXh5WEc1Y2NseHVJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUTdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW10QyswTHZRdU5HSDBMWFJnZEdDMExMUXZpRFF0TkM5MExYUXVTRFFzaURRdk5DMTBZSFJqOUdHMExWY2NseHVJQ29nUUhCaGNtRnRJQ0I3UkdGMFpYMGdaR0YwWlNEUW50Q3gwWXJRdGRDNjBZSWcwTFRRc05HQzBZdGNjbHh1SUNvZ1FISmxkSFZ5YmlCN1RuVnRZbVZ5ZlNBZ0lDRFFtdEMrMEx2UXVOR0gwTFhSZ2RHQzBMTFF2aURRdE5DOTBMWFF1Vnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSRVlYbHpRMjkxYm5SSmJrMXZiblJvSUQwZ1puVnVZM1JwYjI0b1pHRjBaU2tnZTF4eVhHNGdJQ0FnWTI5dWMzUWdaR0Y1Y3lBOUlHNWxkeUJFWVhSbEtHUmhkR1V1WjJWMFZHbHRaU2dwS1R0Y2NseHVJQ0FnSUdSaGVYTXVjMlYwU0c5MWNuTW9NQ3dnTUN3Z01Dd2dNQ2s3WEhKY2JpQWdJQ0JrWVhsekxuTmxkRTF2Ym5Sb0tHUmhlWE11WjJWMFRXOXVkR2dvS1NBcklERXBPMXh5WEc0Z0lDQWdaR0Y1Y3k1elpYUkVZWFJsS0RBcE8xeHlYRzRnSUNBZ2NtVjBkWEp1SUdSaGVYTXVaMlYwUkdGMFpTZ3BPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLSFFzZEdBMEw3UmdTRFFzdEdMMExUUXRkQzcwTFhRdmRDOTBZdlJoU0RRdE5DdzBZSmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVjbUZ1WjJWU1pYTmxkQ0E5SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4U1pYTmxkQ2dwTzF4eVhHNGdJQ0FnZEdocGN5NWZjMlZzWldOMGFXOXVJRDBnZTMwN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRa3RHTDBMVFF0ZEM3MExYUXZkQzQwTFVnMExUUXVOQ3cwTC9Rc05DMzBMN1F2ZEN3SU5DMDBMRFJnbHh5WEc0Z0tpQkFjR0Z5WVcwZ2UwUmhkR1Y5SUdSaGRHVmZabkp2YlNEUW5kQ3cwWWZRc05DNzBZelF2ZEN3MFk4ZzBMVFFzTkdDMExCY2NseHVJQ29nUUhCaGNtRnRJSHRFWVhSbGZTQmtZWFJsWDNSdklDQWcwSnJRdnRDOTBMWFJoOUM5MExEUmp5RFF0TkN3MFlMUXNGeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNXlZVzVuWlZObGJHVmpkQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVmZabkp2YlN3Z1pHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ1pHRjBaVjltY205dExuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc0Z0lDQWdaR0YwWlY5MGJ5NXpaWFJJYjNWeWN5Z3dMQ0F3TENBd0xDQXdLVHRjY2x4dVhISmNiaUFnSUNBdkx5RFF0TkMrMEwvUmc5R0IwWUxRdU5DODBZdlF1U0RRdE5DNDBMRFF2OUN3MExmUXZ0QzlYSEpjYmlBZ0lDQnBaaUFvSVhSb2FYTXVaMlYwU1hOU1lXNW5aVk5sYkdWamRHRmliR1VvWkdGMFpWOW1jbTl0TENCa1lYUmxYM1J2S1NrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJqdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JqYjI1emRDQWtaR0Y1WDJaeWIyMGdQU0IwYUdsekxsOGtaMlYwUkdGNVFubEVZWFJsS0dSaGRHVmZabkp2YlNrN1hISmNiaUFnSUNCamIyNXpkQ0FrWkdGNVgzUnZJRDBnZEdocGN5NWZKR2RsZEVSaGVVSjVSR0YwWlNoa1lYUmxYM1J2S1R0Y2NseHVYSEpjYmlBZ0lDQnBaaUFvSkdSaGVWOW1jbTl0S1NCN1hISmNiaUFnSUNBZ0lDQWdKR1JoZVY5bWNtOXRMbU5zWVhOelRHbHpkQzVoWkdRb0oybHpMWE5sYkdWamRHVmtKeXdnSjJsekxYTmxiR1ZqZEdWa0xXWnliMjBuS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvSkdSaGVWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lDUmtZWGxmZEc4dVkyeGhjM05NYVhOMExtRmtaQ2duYVhNdGMyVnNaV04wWldRbkxDQW5hWE10YzJWc1pXTjBaV1F0ZEc4bktUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUXN0R0wwTFRRdGRDNzBMWFF2ZEM0MExVZzBZM1F1OUMxMEx6UXRkQzkwWUxRdnRDeVhISmNiaUFnSUNCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQ2hrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzhwTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkdCMEw3UmhkR0EwTERRdmRDMTBMM1F1TkMxSU5HQjBMN1JnZEdDMEw3Umo5QzkwTGpSajF4eVhHNGdJQ0FnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU0E5SUdSaGRHVmZabkp2YlR0Y2NseHVJQ0FnSUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZJQ0FnUFNCa1lYUmxYM1J2TzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkN5MFl2UXNkQyswWUFnMExUUXNOR0NJTkN5SU5DKzBMSFJnTkN3MFlMUXZkQyswTHdnMEwvUXZ0R0EwWS9RdE5DNjBMVmNjbHh1SUNBZ0lHbG1JQ2hrWVhSbFgyWnliMjBnUGlCa1lYUmxYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdXMlJoZEdWZlpuSnZiU3dnWkdGMFpWOTBiMTBnUFNCYlpHRjBaVjkwYnl3Z1pHRjBaVjltY205dFhUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUXZ0Q3gwTDNRdnRDeTBMdlF0ZEM5MExqUXRTRFF1TkM5MEwvUmc5R0MwTDdRc2x4eVhHNGdJQ0FnYVdZZ0tIUm9hWE11WHlScGJuQjFkSE5iU1U1RVJWaGZSRUZVUlY5R1VrOU5YU2tnZTF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WHlScGJuQjFkSE5iU1U1RVJWaGZSRUZVUlY5R1VrOU5YUzUyWVd4MVpTQTlJSFJvYVhNdVptOXliV0YwUkdGMFpTaGtZWFJsWDJaeWIyMHBPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdsbUlDaDBhR2x6TGw4a2FXNXdkWFJ6VzBsT1JFVllYMFJCVkVWZlZFOWRLU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmSkdsdWNIVjBjMXRKVGtSRldGOUVRVlJGWDFSUFhTNTJZV3gxWlNBOUlIUm9hWE11Wm05eWJXRjBSR0YwWlNoa1lYUmxYM1J2S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURSZ2RDKzBMSFJpOUdDMExqUXRWeHlYRzRnSUNBZ2RHaHBjeTVmWTJGc2JHSmhZMnNvSjNKaGJtZGxVMlZzWldOMEp5d2daR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2swTDdSZ05DODBMRFJndEM0MFlEUXZ0Q3kwTERRdmRDNDBMVWcwTFRRc05HQzBZdGNjbHh1SUNvZ1FIQmhjbUZ0SUNCN1JHRjBaWDBnSUNCa1lYUmxJQ0FnMEo3UXNkR0swTFhRdXRHQ0lOQzAwTERSZ3RHTFhISmNiaUFxSUVCd1lYSmhiU0FnZTFOMGNtbHVaMzBnWm05eWJXRjBJTkNrMEw3UmdOQzgwTERSZ2lEUmdkR0MwWURRdnRDNjBMaGNjbHh1SUNvZ1FISmxkSFZ5YmlCN1UzUnlhVzVuZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1bWIzSnRZWFJFWVhSbElEMGdablZ1WTNScGIyNG9aR0YwWlN3Z1ptOXliV0YwSUQwZ0oxa3RiUzFrSnlrZ2UxeHlYRzRnSUNBZ2NtVjBkWEp1SUdadmNtMWhkQzV5WlhCc1lXTmxLQ2RaSnl3Z1pHRjBaUzVuWlhSR2RXeHNXV1ZoY2lncEtWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzV5WlhCc1lXTmxLQ2R0Snl3Z0tDY3dKeUFySUNoa1lYUmxMbWRsZEUxdmJuUm9LQ2tnS3lBeEtTa3VjMnhwWTJVb0xUSXBLVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM1eVpYQnNZV05sS0Nka0p5d2dLQ2N3SnlBcklDaGtZWFJsTG1kbGRFUmhkR1VvS1NrcExuTnNhV05sS0MweUtTazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW45R0EwTDdRc3RDMTBZRFF1dEN3SU5DeTBMN1F0OUM4MEw3UXR0QzkwTDdSZ2RHQzBMZ2cwTExSaTlDMDBMWFF1OUMxMEwzUXVOR1BJTkMwMExEUmdseHlYRzRnS2lCQWNHRnlZVzBnSUh0RVlYUmxJR1JoZEdWZlpuSnZiU0RRbmRDdzBZZlFzTkM3MFl6UXZkQ3cwWThnMExUUXNOR0MwTEJjY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlNCa1lYUmxYM1J2SUNBZzBKclF2dEM5MExYUmg5QzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdLaUJBY21WMGRYSnVJSHRDYjI5c1pXRnVmVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSSmMxSmhibWRsVTJWc1pXTjBZV0pzWlNBOUlHWjFibU4wYVc5dUtHUmhkR1ZmWm5KdmJTd2daR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdaR0YwWlY5bWNtOXRMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNGdJQ0FnWkdGMFpWOTBieTV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVYSEpjYmlBZ0lDQnBaaUFvWkdGMFpWOW1jbTl0SUQ0Z1pHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJRnRrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzlkSUQwZ1cyUmhkR1ZmZEc4c0lHUmhkR1ZmWm5KdmJWMDdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBMelF1TkM5MExqUXZOQ3cwTHZSak5DOTBZdlF1U0RRdE5DNDBMRFF2OUN3MExmUXZ0QzlYSEpjYmlBZ0lDQmpiMjV6ZENCa2FXWm1JRDBnVFdGMGFDNWhZbk1vWkdGMFpWOW1jbTl0TG1kbGRGUnBiV1VvS1NBdElHUmhkR1ZmZEc4dVoyVjBWR2x0WlNncEtTQXZJREV3TURBZ0x5QTROalF3TUR0Y2NseHVJQ0FnSUdsbUlDaGthV1ptSUR3Z2RHaHBjeTV2Y0hScGIyNXpMbTFwYmtSaGVYTXBJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBML1JnTkMrMExMUXRkR0EwTHJRc0NEUXY5QyswTC9Rc05DMDBMRFF2ZEM0MFk4ZzBMSWcwTFRRdU5DdzBML1FzTkMzMEw3UXZTRFF0OUN3MExIUXU5QyswTHJRdU5HQTBMN1FzdEN3MEwzUXZkR0wwWVVnMExUUXNOR0NYSEpjYmlBZ0lDQmpiMjV6ZENCa1lYa2dQU0J1WlhjZ1JHRjBaU2dwTzF4eVhHNGdJQ0FnWkdGNUxuTmxkRlJwYldVb1pHRjBaVjltY205dExtZGxkRlJwYldVb0tTazdYSEpjYmx4eVhHNGdJQ0FnZDJocGJHVWdLR1JoZVNBOElHUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTVmWm1sc2RHVnlURzlqYTBSaGVYTW9aR0Y1S1NrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JrWVhrdWMyVjBSR0YwWlNoa1lYa3VaMlYwUkdGMFpTZ3BJQ3NnTVNrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdjbVYwZFhKdUlIUnlkV1U3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFrdEdMMExIUmdOQ3cwTDNRdmRDdzBZOGcwTDNRc05HSDBMRFF1OUdNMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBcUlFQnlaWFIxY200Z2UwUmhkR1Y5SU5DVTBMRFJndEN3WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG1kbGRFUmhkR1ZHY205dElEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0F2THlEUXZkQ3cwWWZRc05DNzBZelF2ZEN3MFk4ZzBMVFFzTkdDMExBZzBMM1F0U0RSZzlDNjBMRFF0OUN3MEwzUXNGeHlYRzRnSUNBZ2FXWWdLQ0YwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkM5MExEUmg5Q3cwTHZSak5DOTBMRFJqeURRdE5DdzBZTFFzQ0RRdjlDKzBMZlF0dEMxSU5DNjBMN1F2ZEMxMFlmUXZkQyswTGxjY2x4dUlDQWdJR2xtSUNoMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieUFtSmlCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0SUQ0Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzg3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjA3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFrdEdMMExIUmdOQ3cwTDNRdmRDdzBZOGcwTFRRc05HQzBMQWdLSE5wYm1kc1pVMXZaR1U2SUhSeWRXVXBYSEpjYmlBcUlFQnlaWFIxY200Z2UwUmhkR1Y5SU5DVTBMRFJndEN3WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG1kbGRFUmhkR1VnUFNCRVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG1kbGRFUmhkR1ZHY205dE8xeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ1MwWXZRc2RHQTBMRFF2ZEM5MExEUmp5RFF1dEMrMEwzUXRkR0gwTDNRc05HUElOQzAwTERSZ3RDd1hISmNiaUFxSUVCeVpYUjFjbTRnZTBSaGRHVjlJTkNVMExEUmd0Q3dYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbWRsZEVSaGRHVlVieUE5SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ0x5OGcwTHJRdnRDOTBMWFJoOUM5MExEUmp5RFF0TkN3MFlMUXNDRFF2ZEMxSU5HRDBMclFzTkMzMExEUXZkQ3dYSEpjYmlBZ0lDQnBaaUFvSVhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkM5MExEUmg5Q3cwTHZSak5DOTBMRFJqeURRdE5DdzBZTFFzQ0RRdjlDKzBMZlF0dEMxSU5DNjBMN1F2ZEMxMFlmUXZkQyswTGxjY2x4dUlDQWdJR2xtSUNoMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0SUNZbUlIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYMlp5YjIwZ1BpQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjkwYnp0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNoMExyUXU5QyswTDNRdGRDOTBMalF0U0FvTVNEUXNkQyswTEhSa2RHQUxDQXlJTkN4MEw3UXNkR0EwTEFzSURVZzBMSFF2dEN4MFlEUXZ0Q3lLVnh5WEc0Z0tpQkFjR0Z5WVcwZ0lIdE9kVzFpWlhKOUlIWmhiSFZsSU5DYTBMN1F1OUM0MFlmUXRkR0IwWUxRc3RDK1hISmNiaUFxSUVCd1lYSmhiU0FnZTBGeWNtRjVmU0FnWm05eWJYTWcwSnpRc05HQjBZSFF1TkN5SU5DNDBMY2dNOUdGSU5HTjBMdlF0ZEM4MExYUXZkR0MwTDdRc2l3ZzBMelF2dEMyMExYUmdpRFJnZEMrMExUUXRkR0EwTGJRc05HQzBZd2cwWUhRdjlDMTBZYlF1TkdFMExqUXV0Q3cwWUxRdnRHQUlDVmtJTkMwMEx2Ump5RFF0OUN3MEx6UXRkQzkwWXRjY2x4dUlDb2dRSEpsZEhWeWJpQjdVM1J5YVc1bmZWeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNXdiSFZ5WVd3Z1BTQm1kVzVqZEdsdmJpQW9kbUZzZFdVc0lHWnZjbTF6S1NCN1hISmNiaUFnSUNCeVpYUjFjbTRnS0haaGJIVmxJQ1VnTVRBZ1BUMGdNU0FtSmlCMllXeDFaU0FsSURFd01DQWhQU0F4TVNBL0lHWnZjbTF6V3pCZElEb2dLSFpoYkhWbElDVWdNVEFnUGowZ01pQW1KaUIyWVd4MVpTQWxJREV3SUR3OUlEUWdKaVlnS0haaGJIVmxJQ1VnTVRBd0lEd2dNVEFnZkh3Z2RtRnNkV1VnSlNBeE1EQWdQajBnTWpBcElEOGdabTl5YlhOYk1WMGdPaUJtYjNKdGMxc3lYU2twTG5KbGNHeGhZMlVvSnlWa0p5d2dkbUZzZFdVcE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtEUXRkQzkwTFRRdGRHQUlOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXNDRFF2TkMxMFlIUmo5R0cwTFhRc2x4eVhHNGdLaUJBY0dGeVlXMGdlMFJoZEdWOUlHUmhkR1ZmWm5KdmJTRFFuZEN3MFlmUXNOQzcwWXpRdmRDdzBZOGcwTFRRc05HQzBMQmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYeVJqY21WaGRHVk5iMjUwYUhNZ1BTQm1kVzVqZEdsdmJpaGtZWFJsWDJaeWIyMHBJSHRjY2x4dUlDQWdJSGRvYVd4bElDaDBhR2x6TGw4a2JXOXVkR2h6TG14aGMzUkZiR1Z0Wlc1MFEyaHBiR1FwSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw4a2JXOXVkR2h6TG5KbGJXOTJaVU5vYVd4a0tIUm9hWE11WHlSdGIyNTBhSE11YkdGemRFVnNaVzFsYm5SRGFHbHNaQ2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwTC9SZ05HUDBZZlF0ZEM4SU5DLzBMN1F0TkdCMExyUXNOQzMwTHJSZzF4eVhHNGdJQ0FnZEdocGN5NWZkRzl2YkhScGNFaHBaR1VvS1R0Y2NseHVYSEpjYmlBZ0lDQXZMeURRdjlHQTBMWFJnTkMxMEwzUXROQzEwWUFnMEx6UXRkR0IwWS9SaHRDMTBMSmNjbHh1SUNBZ0lHTnZibk4wSUdOMWNuSmxiblJFWVhSbElEMGdibVYzSUVSaGRHVW9aR0YwWlY5bWNtOXRMbWRsZEZScGJXVW9LU2s3WEhKY2JpQWdJQ0JqYjI1emRDQWtiVzl1ZEdoeklEMGdXMTA3WEhKY2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUhSb2FYTXViM0IwYVc5dWN5NXRiMjUwYUhORGIzVnVkRHNnS3l0cEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSkcxdmJuUm9jeTV3ZFhOb0tIUm9hWE11WHlSamNtVmhkR1ZOYjI1MGFDaGpkWEp5Wlc1MFJHRjBaU2twTzF4eVhHNGdJQ0FnSUNBZ0lHTjFjbkpsYm5SRVlYUmxMbk5sZEUxdmJuUm9LR04xY25KbGJuUkVZWFJsTG1kbGRFMXZiblJvS0NrZ0t5QXhLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFJnTkMxMEwzUXROQzEwWUJjY2x4dUlDQWdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnSkcxdmJuUm9jeTVzWlc1bmRHZzdJR2tnS3owZ2RHaHBjeTV2Y0hScGIyNXpMbkJsY2xKdmR5a2dlMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJQ1J5YjNjZ1BTQmtiMk4xYldWdWRDNWpjbVZoZEdWRmJHVnRaVzUwS0Nka2FYWW5LVHRjY2x4dUlDQWdJQ0FnSUNBa2NtOTNMbU5zWVhOelRtRnRaU0E5SUNkRVlYUmxjbUZ1WjJWd2FXTnJaWEpmWDNKdmR5YzdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDUnRiMjUwYUhNdWMyeHBZMlVvYVN3Z2FTQXJJSFJvYVhNdWIzQjBhVzl1Y3k1d1pYSlNiM2NwTG1admNrVmhZMmdvSkcxdmJuUm9JRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSkhKdmR5NWhjSEJsYm1SRGFHbHNaQ2drYlc5dWRHZ3BPMXh5WEc0Z0lDQWdJQ0FnSUgwcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDhrYlc5dWRHaHpMbUZ3Y0dWdVpFTm9hV3hrS0NSeWIzY3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdsbUlDaDBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dElIeDhJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUW9kR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTd2dkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmZEc4cE8xeHlYRzRnSUNBZ2ZWeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtEUXRkQzkwTFRRdGRHQUlOQzgwTFhSZ2RHUDBZYlFzRnh5WEc0Z0tpQkFjR0Z5WVcwZ2UwUmhkR1Y5SUdSaGRHVWcwSnpRdGRHQjBZL1JobHh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmSkdOeVpXRjBaVTF2Ym5Sb0lEMGdablZ1WTNScGIyNG9aR0YwWlNrZ2UxeHlYRzRnSUNBZ1kyOXVjM1FnWTNWeWNtVnVkRTF2Ym5Sb0lEMGdaR0YwWlM1blpYUk5iMjUwYUNncE8xeHlYRzRnSUNBZ1kyOXVjM1FnYlc5dWRHaFVhWFJzWlNBOUlIUm9hWE11WjJWMFRXOXVkR2hHYjNKdFlYUjBaV1FvWkdGMFpTazdYSEpjYmlBZ0lDQmpiMjV6ZENCM1pXVnJSR0Y1Y3lBOUlIUm9hWE11WjJWMFYyVmxhMFJoZVhOR2IzSnRZWFIwWldRb0tUdGNjbHh1WEhKY2JpQWdJQ0JqYjI1emRDQWtiVzl1ZEdnZ1BTQjBhR2x6TGw4a1kzSmxZWFJsUld4bGJXVnVkQ2hjY2x4dUlDQWdJQ0FnSUNCZ1BHUnBkaUJqYkdGemN6MWNJazF2Ym5Sb1hDSWdaR0YwWVMxMGFXMWxQVndpSkh0a1lYUmxMbWRsZEZScGJXVW9LWDFjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrMXZiblJvWDE5b1pXRmtaWEpjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGOWZZWEp5YjNjZ1RXOXVkR2hmWDJGeWNtOTNMUzF3Y21WMkpIc29kR2hwY3k1dmNIUnBiMjV6TG0xcGJrUmhkR1VnSmlZZ1pHRjBaU0E4UFNCMGFHbHpMbTl3ZEdsdmJuTXViV2x1UkdGMFpTa2dQeUFuSUdsekxXUnBjMkZpYkdWa0p5QTZJQ2NuZlZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRtY2dkMmxrZEdnOVhDSTRYQ0lnYUdWcFoyaDBQVndpTVRSY0lpQjJhV1YzUW05NFBWd2lNQ0F3SURnZ01UUmNJaUJtYVd4c1BWd2libTl1WlZ3aUlIaHRiRzV6UFZ3aWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1kY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSEJoZEdnZ1pEMWNJazAzSURFelRERWdOMHczSURGY0lpQnpkSEp2YTJVOVhDSWpPRU00UXpoRFhDSWdjM1J5YjJ0bExYZHBaSFJvUFZ3aU1sd2lJSE4wY205clpTMXNhVzVsWTJGd1BWd2ljbTkxYm1SY0lpQnpkSEp2YTJVdGJHbHVaV3B2YVc0OVhDSnliM1Z1WkZ3aVBqd3ZjR0YwYUQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDNOMlp6NWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjejFjSWsxdmJuUm9YMTkwYVhSc1pWd2lQaVI3Ylc5dWRHaFVhWFJzWlgwZ0pIdGtZWFJsTG1kbGRFWjFiR3haWldGeUtDbDlQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpVFc5dWRHaGZYMkZ5Y205M0lFMXZiblJvWDE5aGNuSnZkeTB0Ym1WNGRDUjdLSFJvYVhNdWIzQjBhVzl1Y3k1dFlYaEVZWFJsSUNZbUlHUmhkR1VnUGowZ2RHaHBjeTV2Y0hScGIyNXpMbTFoZUVSaGRHVXBJRDhnSnlCcGN5MWthWE5oWW14bFpDY2dPaUFuSjMxY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzWm5JSGRwWkhSb1BWd2lPRndpSUdobGFXZG9kRDFjSWpFMFhDSWdkbWxsZDBKdmVEMWNJakFnTUNBNElERTBYQ0lnWm1sc2JEMWNJbTV2Ym1WY0lpQjRiV3h1Y3oxY0ltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6SXdNREF2YzNablhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh3WVhSb0lHUTlYQ0pOTVNBd0xqazVPVGs1T1V3M0lEZE1NU0F4TTF3aUlITjBjbTlyWlQxY0lpTTRRemhET0VOY0lpQnpkSEp2YTJVdGQybGtkR2c5WENJeVhDSWdjM1J5YjJ0bExXeHBibVZqWVhBOVhDSnliM1Z1WkZ3aUlITjBjbTlyWlMxc2FXNWxhbTlwYmoxY0luSnZkVzVrWENJK1BDOXdZWFJvUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2YzNablBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpVFc5dWRHaGZYM2RsWld0Y0lqNGtlM2RsWld0RVlYbHpMbTFoY0NocGRHVnRJRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCZ1BHUnBkaUJqYkdGemN6MWNJazF2Ym5Sb1gxOTNaV1ZyWkdGNVhDSStKSHRwZEdWdExuUnBkR3hsZlR3dlpHbDJQbUJjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdmU2t1YW05cGJpZ25KeWw5UEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGOWZaR0Y1YzF3aVBqd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lEd3ZaR2wyUG1CY2NseHVJQ0FnSUNrN1hISmNibHh5WEc0Z0lDQWdMeThnMFlIUmd0R0EwTFhRdTlDNjBMaGNjbHh1SUNBZ0lGdGNjbHh1SUNBZ0lDQWdJQ0I3YzJWc1pXTjBiM0k2SUNjdVRXOXVkR2hmWDJGeWNtOTNMUzF3Y21WMkp5d2dibUZ0WlRvZ0ozQnlaWFluZlN4Y2NseHVJQ0FnSUNBZ0lDQjdjMlZzWldOMGIzSTZJQ2N1VFc5dWRHaGZYMkZ5Y205M0xTMXVaWGgwSnl3Z2JtRnRaVG9nSjI1bGVIUW5mU3hjY2x4dUlDQWdJRjB1Wm05eVJXRmphQ2hwZEdWdElEMCtJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0FrWVhKeWIzY2dQU0FrYlc5dWRHZ3VjWFZsY25sVFpXeGxZM1J2Y2locGRHVnRMbk5sYkdWamRHOXlLVHRjY2x4dUlDQWdJQ0FnSUNBa1lYSnliM2N1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduWTJ4cFkyc25MQ0JsSUQwK0lIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGcwTExSZ05DMTBMelF0ZEM5MEwzUXNOR1BJTkM4MExYUmdOQ3dMQ0RRdTlHRDBZZlJpTkMxSU5DLzBMWFJnTkMxMExMUXRkR0EwWUhSZ3RDdzBZTFJqQ3dnMExMUmk5QzkwTFhSZ2RHQzBMZ2cwWUhSZ3RHQTBMWFF1OUM2MExnZzBMZlFzQ0RRdjlHQTBMWFF0TkMxMEx2Uml5RFF2OUMxMFlEUXRkR0EwTFhSZ05DNDBZSFF2dEN5MFl2UXN0Q3cwTFhRdk5DKzBMa2cwTDdRc2RDNzBMRFJnZEdDMExnZzBML1F1TkM2MExYUmdOQ3dYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHVXVjM1J2Y0ZCeWIzQmhaMkYwYVc5dUtDazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxsOXZia0Z5Y205M1EyeHBZMnNvSkdGeWNtOTNMQ0JwZEdWdExtNWhiV1VwTzF4eVhHNGdJQ0FnSUNBZ0lIMHBPMXh5WEc0Z0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ0x5OGcwWURRdGRDOTBMVFF0ZEdBSU5DMDBMM1F0ZEM1WEhKY2JpQWdJQ0JqYjI1emRDQWtaR0Y1Y3lBOUlDUnRiMjUwYUM1eGRXVnllVk5sYkdWamRHOXlLQ2N1VFc5dWRHaGZYMlJoZVhNbktUdGNjbHh1SUNBZ0lHTnZibk4wSUdSaGVYTWdQU0J1WlhjZ1JHRjBaU2hrWVhSbExtZGxkRlJwYldVb0tTazdYSEpjYmlBZ0lDQmtZWGx6TG5ObGRFUmhkR1VvTVNrN1hISmNiaUFnSUNCa1lYbHpMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNWNjbHh1SUNBZ0lIZG9hV3hsSUNoa1lYbHpMbWRsZEUxdmJuUm9LQ2tnUFQwZ1kzVnljbVZ1ZEUxdmJuUm9LU0I3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnSkhkbFpXc2dQU0IwYUdsekxsOGtZM0psWVhSbFYyVmxheWdwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0IzWldWclJHRjVjeTVtYjNKRllXTm9LR2wwWlcwZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvWkdGNWN5NW5aWFJFWVhrb0tTQWhQU0JwZEdWdExtUmhlU0I4ZkNCa1lYbHpMbWRsZEUxdmJuUm9LQ2tnSVQwZ1kzVnljbVZ1ZEUxdmJuUm9LU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBa2QyVmxheTVoY0hCbGJtUkRhR2xzWkNoMGFHbHpMbDhrWTNKbFlYUmxSVzF3ZEhsRVlYa29LU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNSM1pXVnJMbUZ3Y0dWdVpFTm9hV3hrS0hSb2FYTXVYeVJqY21WaGRHVkVZWGtvWkdGNWN5a3BPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmtZWGx6TG5ObGRFUmhkR1VvWkdGNWN5NW5aWFJFWVhSbEtDa2dLeUF4S1R0Y2NseHVJQ0FnSUNBZ0lDQjlLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdKR1JoZVhNdVlYQndaVzVrUTJocGJHUW9KSGRsWldzcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJSEpsZEhWeWJpQWtiVzl1ZEdnN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRbXRDNzBMalF1aURRdjlDK0lOR0IwWUxSZ05DMTBMdlF1dEMxSU5DLzBMWFJnTkMxMExyUXU5R08wWWZRdGRDOTBMalJqeURRdk5DMTBZSFJqOUdHMExCY2NseHVJQ29nUUhCaGNtRnRJSHRGYkdWdFpXNTBmU0FrWVhKeWIzY2dTRlJOVENEUmpkQzcwTFhRdk5DMTBMM1JnbHh5WEc0Z0tpQkFjR0Z5WVcwZ2UxTjBjbWx1WjMwZ2JtRnRaU0FnSUNEUW1OQzgwWThnS0hCeVpYWXNJRzVsZUhRcFhISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOXZia0Z5Y205M1EyeHBZMnNnUFNCbWRXNWpkR2x2Ymlna1lYSnliM2NzSUc1aGJXVXBJSHRjY2x4dUlDQWdJR2xtSUNna1lYSnliM2N1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkcGN5MWthWE5oWW14bFpDY3BLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdOdmJuTjBJR1JoZEdVZ1BTQnVaWGNnUkdGMFpTaHdZWEp6WlVsdWRDaDBhR2x6TGw4a2JXOXVkR2h6TG5GMVpYSjVVMlZzWldOMGIzSW9KeTVOYjI1MGFDY3BMbVJoZEdGelpYUXVkR2x0WlN3Z01UQXBLVHRjY2x4dUlDQWdJR1JoZEdVdWMyVjBUVzl1ZEdnb1pHRjBaUzVuWlhSTmIyNTBhQ2dwSUNzZ0tHNWhiV1VnUFQwZ0ozQnlaWFluSUQ4Z0xYUm9hWE11YjNCMGFXOXVjeTV0YjI1MGFITkRiM1Z1ZENBNklIUm9hWE11YjNCMGFXOXVjeTV0YjI1MGFITkRiM1Z1ZENrcE8xeHlYRzVjY2x4dUlDQWdJQzh2SU5DeTBZdlJoZEMrMExRZzBMZlFzQ0RRdjlHQTBMWFF0TkMxMEx2Uml5RFF2TkM0MEwzUXVOQzgwTERRdTlHTTBMM1F2dEM1SU5DMDBMRFJndEdMWEhKY2JpQWdJQ0JwWmlBb1pHRjBaU0E4SUhSb2FYTXViM0IwYVc5dWN5NXRhVzVFWVhSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnWkdGMFpTNXpaWFJVYVcxbEtIUm9hWE11YjNCMGFXOXVjeTV0YVc1RVlYUmxMbWRsZEZScGJXVW9LU2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwTExSaTlHRjBMN1F0Q0RRdDlDd0lOQy8wWURRdGRDMDBMWFF1OUdMSU5DODBMRFF1dEdCMExqUXZOQ3cwTHZSak5DOTBMN1F1U0RRdE5DdzBZTFJpMXh5WEc0Z0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NXRZWGhFWVhSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdaVzVrUkdGMFpTQTlJRzVsZHlCRVlYUmxLR1JoZEdVdVoyVjBWR2x0WlNncEtUdGNjbHh1SUNBZ0lDQWdJQ0JsYm1SRVlYUmxMbk5sZEUxdmJuUm9LR1Z1WkVSaGRHVXVaMlYwVFc5dWRHZ29LU0FySUhSb2FYTXViM0IwYVc5dWN5NXRiMjUwYUhORGIzVnVkQ2s3WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLR1Z1WkVSaGRHVWdQaUIwYUdsekxtOXdkR2x2Ym5NdWJXRjRSR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCa1lYUmxMbk5sZEZScGJXVW9kR2hwY3k1dmNIUnBiMjV6TG0xaGVFUmhkR1V1WjJWMFZHbHRaU2dwS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWkdGMFpTNXpaWFJOYjI1MGFDaGtZWFJsTG1kbGRFMXZiblJvS0NrZ0xTQjBhR2x6TG05d2RHbHZibk11Ylc5dWRHaHpRMjkxYm5RZ0t5QXhLVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMEwvUXRkR0EwTFhSaGRDKzBMUWcwTG9nMEwzUXZ0Q3kwTDdRdVNEUXROQ3cwWUxRdFZ4eVhHNGdJQ0FnZEdocGN5NWZjMlZzWldOMFJHRjBaU2hrWVhSbEtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DajBZSFJndEN3MEwzUXZ0Q3kwTHJRc0NEUmd0QzEwTHJSZzlHSjBMWFF1U0RRdE5DdzBZTFJpeURSZ1NEUmdOQzEwTDNRdE5DMTBZRFF2dEM4WEhKY2JpQXFJRUJ3WVhKaGJTQjdSR0YwWlgwZ1pHRjBaU0RRbE5DdzBZTFFzRnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmYzJWc1pXTjBSR0YwWlNBOUlHWjFibU4wYVc5dUtHUmhkR1VwSUh0Y2NseHVJQ0FnSUhSb2FYTXVYM05sYkdWamRHVmtSR0YwWlNBOUlHUmhkR1U3WEhKY2JpQWdJQ0IwYUdsekxsOGtZM0psWVhSbFRXOXVkR2h6S0dSaGRHVXBPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLRFF0ZEM5MExUUXRkR0FJTkM5MExYUXROQzEwTHZRdUZ4eVhHNGdLaUJBY0dGeVlXMGdJSHRFWVhSbGZTQmtZWFJsSU5DZTBMSFJpdEMxMExyUmdpRFF0TkN3MFlMUmkxeHlYRzRnS2lCQWNtVjBkWEp1SUh0RmJHVnRaVzUwZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZkpHTnlaV0YwWlZkbFpXc2dQU0JtZFc1amRHbHZiaWhrWVhSbEtTQjdYSEpjYmlBZ0lDQmpiMjV6ZENBa2QyVmxheUE5SUhSb2FYTXVYeVJqY21WaGRHVkZiR1Z0Wlc1MEtGeHlYRzRnSUNBZ0lDQWdJR0E4WkdsMklHTnNZWE56UFZ3aVYyVmxhMXdpUGp3dlpHbDJQbUJjY2x4dUlDQWdJQ2s3WEhKY2JseHlYRzRnSUNBZ2NtVjBkWEp1SUNSM1pXVnJPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLRFF0ZEM5MExUUXRkR0FJTkMwMEwzUmoxeHlYRzRnS2lCQWNHRnlZVzBnSUh0RVlYUmxmU0JrWVhSbElOQ2UwTEhSaXRDMTBMclJnaURRdE5DdzBZTFJpMXh5WEc0Z0tpQkFjbVYwZFhKdUlIdEZiR1Z0Wlc1MGZWeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZKR055WldGMFpVUmhlU0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJR052Ym5OMElDUmtZWGtnUFNCMGFHbHpMbDhrWTNKbFlYUmxSV3hsYldWdWRDaGNjbHh1SUNBZ0lDQWdJQ0JnUEdScGRpQmpiR0Z6Y3oxY0lrUmhlVndpSUdSaGRHRXRkR2x0WlQxY0lpUjdaR0YwWlM1blpYUlVhVzFsS0NsOVhDSWdaR0YwWVMxa1lYazlYQ0lrZTJSaGRHVXVaMlYwUkdGNUtDbDlYQ0krSkh0a1lYUmxMbWRsZEVSaGRHVW9LWDA4TDJScGRqNWdYSEpjYmlBZ0lDQXBPMXh5WEc1Y2NseHVJQ0FnSUNSa1lYa3VZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25ZMnhwWTJzbkxDQjBhR2x6TGw5dmJrUmhlVU5zYVdOclJYWmxiblF1WW1sdVpDaDBhR2x6S1NrN1hISmNibHh5WEc0Z0lDQWdhV1lnS0NGMGFHbHpMbTl3ZEdsdmJuTXVjMmx1WjJ4bFRXOWtaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDUmtZWGt1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduYlc5MWMyVmxiblJsY2ljc0lIUm9hWE11WDI5dVJHRjVUVzkxYzJWRmJuUmxja1YyWlc1MExtSnBibVFvZEdocGN5a3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQyswTEhRdmRDKzBMTFF1OUMxMEwzUXVOQzFJTkdCMEw3UmdkR0MwTDdSajlDOTBMalF1Vnh5WEc0Z0lDQWdkR2hwY3k1ZmRYQmtZWFJsUkdGNUtDUmtZWGtwTzF4eVhHNWNjbHh1SUNBZ0lISmxkSFZ5YmlBa1pHRjVPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKN1FzZEM5MEw3UXN0QzcwTFhRdmRDNDBMVWcwWUhRdnRHQjBZTFF2dEdQMEwzUXVOQzVYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMblZ3WkdGMFpTQTlJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnZEdocGN5NWZKRzF2Ym5Sb2N5NXhkV1Z5ZVZObGJHVmpkRzl5UVd4c0tDY3VUVzl1ZEdnbktTNW1iM0pGWVdOb0tDUnRiMjUwYUNBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZkWEJrWVhSbFRXOXVkR2dvSkcxdmJuUm9LVHRjY2x4dUlDQWdJSDBwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSjdRc2RDOTBMN1FzdEM3MExYUXZkQzQwTFVnMFlIUXZ0R0IwWUxRdnRHUDBMM1F1TkM1SU5DODBMWFJnZEdQMFliUXNGeHlYRzRnS2lCQWNHRnlZVzBnZTBWc1pXMWxiblI5SUNSdGIyNTBhQ0RRcmRDNzBMWFF2TkMxMEwzUmdpRFF2TkMxMFlIUmo5R0cwTEJjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDNWd1pHRjBaVTF2Ym5Sb0lEMGdablZ1WTNScGIyNG9KRzF2Ym5Sb0tTQjdYSEpjYmlBZ0lDQWtiVzl1ZEdndWNYVmxjbmxUWld4bFkzUnZja0ZzYkNnbkxrUmhlVnRrWVhSaExYUnBiV1ZkSnlrdVptOXlSV0ZqYUNna1pHRjVJRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw5MWNHUmhkR1ZFWVhrb0pHUmhlU2s3WEhKY2JpQWdJQ0I5S1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNlMExIUXZkQyswTExRdTlDMTBMM1F1TkMxSU5HQjBMN1JnZEdDMEw3Umo5QzkwTGpRdVNEUXROQzkwWTljY2x4dUlDb2dRSEJoY21GdElIdEZiR1Z0Wlc1MGZTQWtaR0Y1SU5DdDBMdlF0ZEM4MExYUXZkR0NJTkMwMEwzUmoxeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZkWEJrWVhSbFJHRjVJRDBnWm5WdVkzUnBiMjRvSkdSaGVTa2dlMXh5WEc0Z0lDQWdZMjl1YzNRZ1pHRjBaU0FnSUQwZ2JtVjNJRVJoZEdVb2NHRnljMlZKYm5Rb0pHUmhlUzVrWVhSaGMyVjBMblJwYldVc0lERXdLU2s3WEhKY2JpQWdJQ0JqYjI1emRDQnNiMk5yWldRZ1BTQjBhR2x6TGw5bWFXeDBaWEpNYjJOclJHRjVjeWhrWVhSbEtUdGNjbHh1SUNBZ0lHTnZibk4wSUhSdlpHRjVJQ0E5SUhSb2FYTXVYM1J2WkdGNUxtZGxkRlJwYldVb0tTQTlQU0JrWVhSbExtZGxkRlJwYldVb0tUdGNjbHh1WEhKY2JpQWdJQ0FrWkdGNUxtTnNZWE56VEdsemRDNTBiMmRuYkdVb0oybHpMV1JwYzJGaWJHVmtKeXdnYkc5amEyVmtLVHRjY2x4dUlDQWdJQ1JrWVhrdVkyeGhjM05NYVhOMExuUnZaMmRzWlNnbmFYTXRiRzlqYTJWa0p5d2diRzlqYTJWa0lEMDlJRXhQUTB0ZlRFOURTMFZFS1R0Y2NseHVJQ0FnSUNSa1lYa3VZMnhoYzNOTWFYTjBMblJ2WjJkc1pTZ25hWE10ZEc5a1lYa25MQ0IwYjJSaGVTazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW9kQyswTEhSaTlHQzBMalF0U0RRdXRDNzBMalF1dEN3SU5DLzBMNGcwTFRRdmRHT1hISmNiaUFxSUVCd1lYSmhiU0I3UlhabGJuUjlJR1VnUkU5TklOR0IwTDdRc2RHTDBZTFF1TkMxWEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw5dmJrUmhlVU5zYVdOclJYWmxiblFnUFNCbWRXNWpkR2x2YmlobEtTQjdYSEpjYmlBZ0lDQjBhR2x6TGw5dmJrUmhlVU5zYVdOcktHVXVkR0Z5WjJWMEtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DaDBMN1FzZEdMMFlMUXVOQzFJTkdGMEw3UXN0QzEwWURRc0Z4eVhHNGdLaUJBY0dGeVlXMGdlMFYyWlc1MGZTQmxJRVJQVFNEUmdkQyswTEhSaTlHQzBMalF0Vnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmYjI1RVlYbE5iM1Z6WlVWdWRHVnlSWFpsYm5RZ1BTQm1kVzVqZEdsdmJpaGxLU0I3WEhKY2JpQWdJQ0IwYUdsekxsOXZia1JoZVUxdmRYTmxSVzUwWlhJb1pTNTBZWEpuWlhRcE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtYUXZ0Q3kwTFhSZ0NEUXZkQ3dJTkdOMEx2UXRkQzgwTFhRdmRHQzBMVWcwTFRRdmRHUFhISmNiaUFxSUVCd1lYSmhiU0I3Uld4bGJXVnVkSDBnSkdSaGVTQklWRTFNSU5DdDBMdlF0ZEM4MExYUXZkR0NYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDl2YmtSaGVVMXZkWE5sUlc1MFpYSWdQU0JtZFc1amRHbHZiaWdrWkdGNUtTQjdYSEpjYmlBZ0lDQnBaaUFvSVhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBnZkh3Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200N1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdhV1lnS0NSa1lYa3VaR0YwWVhObGRDNTBhVzFsSUQwOUlIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYMlp5YjIwdVoyVjBWR2x0WlNncEtTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdOdmJuTjBJR1JoZEdWZmRHOGdQU0J1WlhjZ1JHRjBaU2h3WVhKelpVbHVkQ2drWkdGNUxtUmhkR0Z6WlhRdWRHbHRaU3dnTVRBcEtUdGNjbHh1SUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wS0hSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzhwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSnJRdTlDNDBMb2cwTC9RdmlEUXROQzkwWTVjY2x4dUlDb2dRSEJoY21GdElIdEZiR1Z0Wlc1MGZTQWtaR0Y1SUVoVVRVd2cwSzNRdTlDMTBMelF0ZEM5MFlKY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgyOXVSR0Y1UTJ4cFkyc2dQU0JtZFc1amRHbHZiaWdrWkdGNUtTQjdYSEpjYmlBZ0lDQXZMeURRdE5DMTBMM1JqQ0RRdDlDdzBMSFF1OUMrMExyUXVOR0EwTDdRc3RDdzBMMWNjbHh1SUNBZ0lHbG1JQ2drWkdGNUxtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25hWE10WkdsellXSnNaV1FuS1NrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURRc3RHTDBMSFF2dEdBSU5DKzBMVFF2ZEMrMExrZzBMVFFzTkdDMFl0Y2NseHVJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11YzJsdVoyeGxUVzlrWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdWNtRnVaMlZTWlhObGRDZ3BPMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBnUFNCdVpYY2dSR0YwWlNod1lYSnpaVWx1ZENna1pHRjVMbVJoZEdGelpYUXVkR2x0WlN3Z01UQXBLVnh5WEc0Z0lDQWdJQ0FnSUNSa1lYa3VZMnhoYzNOTWFYTjBMbUZrWkNnbmFYTXRjMlZzWldOMFpXUW5LVHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDlqWVd4c1ltRmpheWduWkdGNVUyVnNaV04wSnl3Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlNrN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5HQjBMSFJnTkMrMFlFZzBMTFJpOUN4MFlEUXNOQzkwTDNRdnRDejBMNGcwWURRc05DOTBMWFF0U0RRdE5DNDBMRFF2OUN3MExmUXZ0QzkwTEJjY2x4dUlDQWdJR2xtSUNoMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0SUNZbUlIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1eVlXNW5aVkpsYzJWMEtDazdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSkdSaGVTNWpiR0Z6YzB4cGMzUXVZV1JrS0NkcGN5MXpaV3hsWTNSbFpDY3BPMXh5WEc1Y2NseHVJQ0FnSUM4dklOQ3kwWXZRc2RHQTBMRFF2ZEN3SU5DOTBMRFJoOUN3MEx2UmpOQzkwTERSanlBdklOQzYwTDdRdmRDMTBZZlF2ZEN3MFk4ZzBMVFFzTkdDMExCY2NseHVJQ0FnSUdsbUlDZ2hkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTa2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBnUFNCdVpYY2dSR0YwWlNod1lYSnpaVWx1ZENna1pHRjVMbVJoZEdGelpYUXVkR2x0WlN3Z01UQXBLVHRjY2x4dUlDQWdJSDBnWld4elpTQnBaaUFvSVhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhnUFNCdVpYY2dSR0YwWlNod1lYSnpaVWx1ZENna1pHRjVMbVJoZEdGelpYUXVkR2x0WlN3Z01UQXBLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCcFppQW9kR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTQW1KaUIwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUM4dklOQzAwTDdRdjlHRDBZSFJndEM0MEx6Umk5QzVJTkMwMExqUXNOQy8wTERRdDlDKzBMMWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb0lYUm9hWE11WjJWMFNYTlNZVzVuWlZObGJHVmpkR0ZpYkdVb2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlN3Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVjbUZ1WjJWU1pYTmxkQ2dwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNDdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxuSmhibWRsVTJWc1pXTjBLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMHNJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktUdGNjbHh1SUNBZ0lIMWNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DUzBMalF0OUdEMExEUXU5R00wTDNSaTlDNUlOR0IwTEhSZ05DKzBZRWcwTExSaTlDMDBMWFF1OUMxMEwzUXZkR0wwWVVnMExUUXNOR0NYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDl5WVc1blpWWnBjM1ZoYkZKbGMyVjBJRDBnWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCamIyNXpkQ0FrWkdGNWN5QTlJSFJvYVhNdVh5UnRiMjUwYUhNdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNnbkxrUmhlVnRrWVhSaExYUnBiV1ZkSnlrN1hISmNiaUFnSUNBa1pHRjVjeTVtYjNKRllXTm9LQ1JrWVhrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNSa1lYa3VZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRabkp2YlNjc0lDZHBjeTF6Wld4bFkzUmxaQzEwYnljc0lDZHBjeTF6Wld4bFkzUmxaQzFpWlhSM1pXVnVKeWs3WEhKY2JpQWdJQ0I5S1R0Y2NseHVYSEpjYmlBZ0lDQXZMeURRdjlHQTBZL1JoOUMxMEx3ZzBML1F2dEMwMFlIUXV0Q3cwTGZRdXRHRFhISmNiaUFnSUNCMGFHbHpMbDkwYjI5c2RHbHdTR2xrWlNncE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEpMUXVOQzMwWVBRc05DNzBZelF2ZEMrMExVZzBMTFJpOUMwMExYUXU5QzEwTDNRdU5DMUlOQzAwTERSZ2x4eVhHNGdLaUJBY0dGeVlXMGdlMFJoZEdWOUlHUmhkR1ZmWm5KdmJTRFFuZEN3MFlmUXNOQzcwWXpRdmRDdzBZOGcwTFRRc05HQzBMQmNjbHh1SUNvZ1FIQmhjbUZ0SUh0RVlYUmxmU0JrWVhSbFgzUnZJQ0FnMEpyUXZ0QzkwTFhSaDlDOTBMRFJqeURRdE5DdzBZTFFzRnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1FnUFNCbWRXNWpkR2x2Ymloa1lYUmxYMlp5YjIwc0lHUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lHbG1JQ2hrWVhSbFgyWnliMjBnSmlZZ1pHRjBaVjltY205dElHbHVjM1JoYm1ObGIyWWdSR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJR1JoZEdWZlpuSnZiUzV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvWkdGMFpWOTBieUFtSmlCa1lYUmxYM1J2SUdsdWMzUmhibU5sYjJZZ1JHRjBaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHUmhkR1ZmZEc4dWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnYkdWMElIUnBiV1ZmWm5KdmJTQTlJR1JoZEdWZlpuSnZiU0JwYm5OMFlXNWpaVzltSUVSaGRHVWdQeUJrWVhSbFgyWnliMjB1WjJWMFZHbHRaU2dwSURvZ01EdGNjbHh1SUNBZ0lHeGxkQ0IwYVcxbFgzUnZJRDBnWkdGMFpWOTBieUJwYm5OMFlXNWpaVzltSUVSaGRHVWdQeUJrWVhSbFgzUnZMbWRsZEZScGJXVW9LU0E2SURBN1hISmNiaUFnSUNCcFppQW9kR2x0WlY5bWNtOXRJRDRnZEdsdFpWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lGdDBhVzFsWDJaeWIyMHNJSFJwYldWZmRHOWRJRDBnVzNScGJXVmZkRzhzSUhScGJXVmZabkp2YlYwN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMExMUmk5QzAwTFhRdTlDMTBMM1F1TkMxSU5DMDBMRFJnaURRdk5DMTBMYlF0TkdESU5DOTBMRFJoOUN3MEx2UmpOQzkwTDdRdVNEUXVDRFF1dEMrMEwzUXRkR0gwTDNRdnRDNVhISmNiaUFnSUNCamIyNXpkQ0FrWkdGNWN5QTlJSFJvYVhNdVh5UnRiMjUwYUhNdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNnbkxrUmhlVnRrWVhSaExYUnBiV1ZkSnlrN1hISmNiaUFnSUNCbWIzSWdLR3hsZENCcElEMGdNRHNnYVNBOElDUmtZWGx6TG14bGJtZDBhRHNnS3l0cEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSkdSaGVYTmJhVjB1WTJ4aGMzTk1hWE4wTG5SdloyZHNaU2duYVhNdGMyVnNaV04wWldRdFltVjBkMlZsYmljc0lDUmtZWGx6VzJsZExtUmhkR0Z6WlhRdWRHbHRaU0ErSUhScGJXVmZabkp2YlNBbUppQWtaR0Y1YzF0cFhTNWtZWFJoYzJWMExuUnBiV1VnUENCMGFXMWxYM1J2S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURRc3RHTDBMVFF0ZEM3MExYUXZkQzQwTFVnMEwzUXNOR0gwTERRdTlHTTBMM1F2dEM1SU5DNElOQzYwTDdRdmRDMTBZZlF2ZEMrMExrZzBML1F2dEMzMExqUmh0QzQwTGhjY2x4dUlDQWdJR052Ym5OMElDUmtZWGxmWm5KdmJTQTlJSFJvYVhNdVh5Um5aWFJFWVhsQ2VVUmhkR1VvWkdGMFpWOW1jbTl0S1R0Y2NseHVJQ0FnSUdOdmJuTjBJQ1JrWVhsZmRHOGdQU0IwYUdsekxsOGtaMlYwUkdGNVFubEVZWFJsS0dSaGRHVmZkRzhwTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkM2MExYUmlDRFF0TkM3MFk4ZzBMSFJpOUdCMFlMUmdOQyswTFBRdmlEUmdkQ3gwWURRdnRHQjBMQWcwWUhSZ3RDdzBZRFF2dEN6MEw0ZzBMTFJpOUMwMExYUXU5QzEwTDNRdU5HUFhISmNiaUFnSUNCcFppQW9kR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFRaV3hsWTNRdUpHUmhlVjltY205dFgyOXNaQ0FtSmlCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQzRrWkdGNVgyWnliMjFmYjJ4a0lDRTlJQ1JrWVhsZlpuSnZiU2tnZTF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wTGlSa1lYbGZabkp2YlY5dmJHUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRabkp2YlNjcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5DNjBMWFJpQ0RRdE5DNzBZOGcwTEhSaTlHQjBZTFJnTkMrMExQUXZpRFJnZEN4MFlEUXZ0R0IwTEFnMFlIUmd0Q3cwWURRdnRDejBMNGcwTExSaTlDMDBMWFF1OUMxMEwzUXVOR1BYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUXVKR1JoZVY5MGIxOXZiR1FnSmlZZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1F1SkdSaGVWOTBiMTl2YkdRZ0lUMGdKR1JoZVY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBMaVJrWVhsZmRHOWZiMnhrTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJsekxYTmxiR1ZqZEdWa0p5d2dKMmx6TFhObGJHVmpkR1ZrTFhSdkp5azdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnYVdZZ0tDUmtZWGxmWm5KdmJTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNSa1lYbGZabkp2YlM1amJHRnpjMHhwYzNRdVlXUmtLQ2RwY3kxelpXeGxZM1JsWkNjc0lDZHBjeTF6Wld4bFkzUmxaQzFtY205dEp5azdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnYVdZZ0tDUmtZWGxmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0FrWkdGNVgzUnZMbU5zWVhOelRHbHpkQzVoWkdRb0oybHpMWE5sYkdWamRHVmtKeXdnSjJsekxYTmxiR1ZqZEdWa0xYUnZKeWs3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwWUhRdnRHRjBZRFFzTkM5MExYUXZkQzQwTFVnMExJZzBMclF0ZEdJWEhKY2JpQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDNGtaR0Y1WDJaeWIyMWZiMnhrSUQwZ0pHUmhlVjltY205dE8xeHlYRzRnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1F1SkdSaGVWOTBiMTl2YkdRZ1BTQWtaR0Y1WDNSdk8xeHlYRzVjY2x4dUlDQWdJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNGtaR0Y1WDJaeWIyMGdQU0FrWkdGNVgyWnliMjA3WEhKY2JpQWdJQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVKR1JoZVY5MGJ5QWdJRDBnSkdSaGVWOTBienRjY2x4dVhISmNiaUFnSUNCcFppQW9KR1JoZVY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR1JoZVhNZ1BTQk5ZWFJvTG1ac2IyOXlLRTFoZEdndVlXSnpLSFJwYldWZlpuSnZiU0F0SUhScGJXVmZkRzhwSUM4Z09EWTBNREJsTXlrZ0t5QXhPMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM1J2YjJ4MGFYQlRhRzkzS0dSaGVYTXBPMXh5WEc0Z0lDQWdmVnh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKL1F2dEM2MExEUXR5RFF2OUMrMExUUmdkQzYwTERRdDlDNjBMaGNjbHh1SUNvZ1FIQmhjbUZ0SUh0T2RXMWlaWEo5SUdSaGVYTWcwSnJRdnRDNzBMalJoOUMxMFlIUmd0Q3kwTDRnMExUUXZkQzEwTGxjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDNSdmIyeDBhWEJUYUc5M0lEMGdablZ1WTNScGIyNG9aR0Y1Y3lrZ2UxeHlYRzRnSUNBZ2RHaHBjeTVmSkhSdmIyeDBhWEJEYjI1MFpXNTBMblJsZUhSRGIyNTBaVzUwSUQwZ2RHaHBjeTVmWm1sc2RHVnlWRzl2YkhScGNGUmxlSFFvWkdGNWN5azdYSEpjYmlBZ0lDQjBhR2x6TGw4a2RHOXZiSFJwY0M1amJHRnpjMHhwYzNRdWRHOW5aMnhsS0NkcGN5MXphRzkzSnl3Z2RHaHBjeTVmSkhSdmIyeDBhWEF1ZEdWNGRFTnZiblJsYm5RdWJHVnVaM1JvS1R0Y2NseHVJQ0FnSUhSb2FYTXVYM1J2YjJ4MGFYQlZjR1JoZEdVb0tUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DZTBMSFF2ZEMrMExMUXU5QzEwTDNRdU5DMUlOQy8wTDdRdDlDNDBZYlF1TkM0SU5DLzBMN1F0TkdCMExyUXNOQzMwTHJRdUZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZmRHOXZiSFJwY0ZWd1pHRjBaU0E5SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ2FXWWdLQ0YwYUdsekxsOXpaV3hsWTNScGIyNHVKR1JoZVY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCc1pYUWdlQ0E5SURBN1hISmNiaUFnSUNCc1pYUWdlU0E5SURBN1hISmNiaUFnSUNCc1pYUWdKR1ZzSUQwZ2RHaHBjeTVmYzJWc1pXTjBhVzl1TGlSa1lYbGZkRzg3WEhKY2JpQWdJQ0JrYnlCN1hISmNiaUFnSUNBZ0lDQWdlU0FyUFNBa1pXd3ViMlptYzJWMFZHOXdPMXh5WEc0Z0lDQWdJQ0FnSUhnZ0t6MGdKR1ZzTG05bVpuTmxkRXhsWm5RN1hISmNiaUFnSUNCOUlIZG9hV3hsSUNnb0pHVnNJRDBnSkdWc0xtOW1abk5sZEZCaGNtVnVkQ2tnSmlZZ0pHVnNJQ0U5SUhSb2FYTXVYeVJ3YVdOclpYSXBPMXh5WEc1Y2NseHVJQ0FnSUhSb2FYTXVYeVIwYjI5c2RHbHdMbk4wZVd4bExuUnZjQ0E5SUUxaGRHZ3VjbTkxYm1Rb2VTQXRJSFJvYVhNdVh5UjBiMjlzZEdsd0xtOW1abk5sZEVobGFXZG9kQ2tnS3lBbmNIZ25PMXh5WEc0Z0lDQWdkR2hwY3k1ZkpIUnZiMngwYVhBdWMzUjViR1V1YkdWbWRDQTlJRTFoZEdndWNtOTFibVFvZUNBcklIUm9hWE11WDNObGJHVmpkR2x2Ymk0a1pHRjVYM1J2TG05bVpuTmxkRmRwWkhSb0lDOGdNaUF0SUhSb2FYTXVYeVIwYjI5c2RHbHdMbTltWm5ObGRGZHBaSFJvSUM4Z01pa2dLeUFuY0hnbk8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtIUXV0R0EwWXZSZ3RHTUlOQy8wTDdRdE5HQjBMclFzTkMzMExyUmcxeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZkRzl2YkhScGNFaHBaR1VnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lIUm9hWE11WHlSMGIyOXNkR2x3TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJsekxYTm9iM2NuS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNpMExYUXV0R0IwWUlnMEwvUXZ0QzAwWUhRdXRDdzBMZlF1dEM0SU5DLzBMNGcwWVBRdk5DKzBMdlJoOUN3MEwzUXVOR09YSEpjYmlBcUlFQndZWEpoYlNBZ2UwNTFiV0psY24wZ1pHRjVjeURRbXRDKzBMdlF1TkdIMExYUmdkR0MwTExRdmlEUXROQzkwTFhRdVZ4eVhHNGdLaUJBY21WMGRYSnVJSHRUZEhKcGJtZDlYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDltYVd4MFpYSlViMjlzZEdsd1ZHVjRkQ0E5SUdaMWJtTjBhVzl1S0dSaGVYTXBJSHRjY2x4dUlDQWdJR2xtSUNoMGVYQmxiMllnZEdocGN5NXZjSFJwYjI1ekxtWnBiSFJsY2k1MGIyOXNkR2x3VkdWNGRDQTlQU0FuWm5WdVkzUnBiMjRuS1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11YjNCMGFXOXVjeTVtYVd4MFpYSXVkRzl2YkhScGNGUmxlSFF1WTJGc2JDaDBhR2x6TENCa1lYbHpLU0I4ZkNBbkp6dGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1d2JIVnlZV3dvWkdGNWN5d2dXeWNsWkNEUXROQzEwTDNSakNjc0lDY2xaQ0RRdE5DOTBZOG5MQ0FuSldRZzBMVFF2ZEMxMExrblhTa3VjbVZ3YkdGalpTZ25KV1FuTENCa1lYbHpLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2swTGpRdTlHTTBZTFJnQ0RRdmRDMTBMVFF2dEdCMFlMUmc5Qy8wTDNSaTlHRklOQzAwTDNRdGRDNVhISmNiaUFxSUVCd1lYSmhiU0I3UkdGMFpYMGdaR0YwWlNEUWxOQ3cwWUxRc0Z4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZlptbHNkR1Z5VEc5amEwUmhlWE1nUFNCbWRXNWpkR2x2Ymloa1lYUmxLU0I3WEhKY2JpQWdJQ0F2THlEUXN0R0wwTEhRdnRHQUlOQzAwTERSZ2lEUXN0QzkwTFVnMExUUXZ0R0IwWUxSZzlDLzBMM1F2dEN6MEw0ZzBMVFF1TkN3MEwvUXNOQzMwTDdRdmRDd1hISmNiaUFnSUNCcFppQW9aR0YwWlNBOElIUm9hWE11YjNCMGFXOXVjeTV0YVc1RVlYUmxJSHg4SUdSaGRHVWdQaUIwYUdsekxtOXdkR2x2Ym5NdWJXRjRSR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQk1UME5MWDFWT1FWWkJTVXhCUWt4Rk8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5DLzBMN1F1OUdNMExmUXZ0Q3kwTERSZ3RDMTBMdlJqTkdCMExyUXVOQzFJTkdFMFlQUXZkQzYwWWJRdU5DNFhISmNiaUFnSUNCcFppQW9kSGx3Wlc5bUlIUm9hWE11YjNCMGFXOXVjeTVtYVd4MFpYSXViRzlqYTBSaGVYTWdQVDBnSjJaMWJtTjBhVzl1SnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG05d2RHbHZibk11Wm1sc2RHVnlMbXh2WTJ0RVlYbHpMbU5oYkd3b1pHRjBaU2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwTExSZ2RDMUlOQzAwTDNRdUNEUXROQyswWUhSZ3RHRDBML1F2ZEdMWEhKY2JpQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRb2RDKzBMSFJpOUdDMExqUXRTRFF1TkMzMEx6UXRkQzkwTFhRdmRDNDBZOGcwWURRc05DMzBMelF0ZEdBMEw3UXNpRFF2dEM2MEwzUXNGeHlYRzRnS2lCQWNHRnlZVzBnZTBWMlpXNTBmU0JsSUVSUFRTRFJnZEMrMExIUmk5R0MwTGpRdFZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZmIyNVhhVzVrYjNkU1pYTnBlbVZGZG1WdWRDQTlJR1oxYm1OMGFXOXVLR1VwSUh0Y2NseHVJQ0FnSUdsbUlDaDBhR2x6TGw5elpXeGxZM1JwYjI0dUpHUmhlVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzUnZiMngwYVhCVmNHUmhkR1VvS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnNaWFFnWW5KbFlXdHdiMmx1ZENBOUlEQTdYSEpjYmlBZ0lDQmpiMjV6ZENCaWNtVmhhM0J2YVc1MGN5QTlJRTlpYW1WamRDNXJaWGx6S0hSb2FYTXViM0IwYVc5dWN5NWljbVZoYTNCdmFXNTBjeWt1YzI5eWRDZ29ZU3dnWWlrZ1BUNGdZU0F0SUdJcE8xeHlYRzRnSUNBZ1ptOXlJQ2hzWlhRZ2FTQnBiaUJpY21WaGEzQnZhVzUwY3lrZ2UxeHlYRzRnSUNBZ0lDQWdJR2xtSUNoM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUNBOFBTQmljbVZoYTNCdmFXNTBjMXRwWFNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCaWNtVmhhM0J2YVc1MElEMGdZbkpsWVd0d2IybHVkSE5iYVYwN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdKeVpXRnJPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQjBhR2x6TGw5elpYUkNjbVZoYTNCdmFXNTBLR0p5WldGcmNHOXBiblFwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwS1BSZ2RHQzBMRFF2ZEMrMExMUXV0Q3dJTkdCMEw3UmdkR0MwTDdSajlDOTBMalJqeURSZ05DMTBMM1F0TkMxMFlEUXNDRFF2OUMrMExRZzBZRFFzTkMzMEwzUmk5QzFJTkdOMExyUmdOQ3cwTDNSaTF4eVhHNGdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdZbkpsWVd0d2IybHVkQ0RRbXRDNzBZN1JoeURRdU5DM0lIUm9hWE11YjNCMGFXOXVjeTVpY21WaGEzQnZhVzUwY3lBbzBLalF1TkdBMExqUXZkQ3dJTkdOMExyUmdOQ3cwTDNRc0NsY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgzTmxkRUp5WldGcmNHOXBiblFnUFNCbWRXNWpkR2x2YmloaWNtVmhhM0J2YVc1MEtTQjdYSEpjYmlBZ0lDQXZMeURRdnRHQ0lOQzkwTFhRdmRHRDBMYlF2ZEMrMExrZzBML1F0ZEdBMExYUmdOQzQwWUhRdnRDeTBMclF1Rnh5WEc0Z0lDQWdhV1lnS0hSb2FYTXVYMkp5WldGcmNHOXBiblFnUFQwZ1luSmxZV3R3YjJsdWRDa2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJSDFjY2x4dUlDQWdJSFJvYVhNdVgySnlaV0ZyY0c5cGJuUWdQU0JpY21WaGEzQnZhVzUwTzF4eVhHNWNjbHh1SUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxtSnlaV0ZyY0c5cGJuUnpXMkp5WldGcmNHOXBiblJkS1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJRTlpYW1WamRDNWhjM05wWjI0b2RHaHBjeTV2Y0hScGIyNXpMQ0IwYUdsekxtOXdkR2x2Ym5NdVluSmxZV3R3YjJsdWRITmJZbkpsWVd0d2IybHVkRjBwTzF4eVhHNGdJQ0FnZEdocGN5NWZKR055WldGMFpVMXZiblJvY3loMGFHbHpMbDl6Wld4bFkzUmxaRVJoZEdVcE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEszUXU5QzEwTHpRdGRDOTBZSWcwTHJRc05DNzBMWFF2ZEMwMExEUmdOQzkwTDdRczlDK0lOQzAwTDNSajF4eVhHNGdLaUJBY0dGeVlXMGdJSHRFWVhSbGZTQmtZWFJsSU5DVTBMRFJndEN3WEhKY2JpQXFJRUJ5WlhSMWNtNGdlMFZzWlcxbGJuUjlJQ0FnU0ZSTlRDRFJqZEM3MExYUXZOQzEwTDNSZ2x4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZkpHZGxkRVJoZVVKNVJHRjBaU0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJR052Ym5OMElIUnBiV1VnUFNCa1lYUmxJR2x1YzNSaGJtTmxiMllnUkdGMFpTQS9JR1JoZEdVdVoyVjBWR2x0WlNncElEb2dNRHRjY2x4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TGw4a2JXOXVkR2h6TG5GMVpYSjVVMlZzWldOMGIzSW9KeTVFWVhsYlpHRjBZUzEwYVcxbFBWd2lKeUFySUhScGJXVWdLeUFuWENKZEp5azdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW9OQzEwTDNRdE5DMTBZQWcwTFRRdmRHUElDMGcwTGZRc05DejBMdlJnOUdJMExyUXVGeHlYRzRnS2lCQWNtVjBkWEp1SUh0RmJHVnRaVzUwZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZkpHTnlaV0YwWlVWdGNIUjVSR0Y1SUQwZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQmpiMjV6ZENBa1pHRjVJRDBnZEdocGN5NWZKR055WldGMFpVVnNaVzFsYm5Rb1hISmNiaUFnSUNBZ0lDQWdZRHhrYVhZZ1kyeGhjM005WENKRVlYa2dhWE10Wlcxd2RIbGNJajQ4TDJScGRqNWdYSEpjYmlBZ0lDQXBPMXh5WEc1Y2NseHVJQ0FnSUhKbGRIVnliaUFrWkdGNU8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtIUXZ0QzMwTFRRc05DOTBMalF0U0RSamRDNzBMWFF2TkMxMEwzUmd0Q3dJTkM0MExjZ1NGUk5UQ0RSZ3RDMTBMclJnZEdDMExCY2NseHVJQ29nUUhCaGNtRnRJQ0I3VTNSeWFXNW5mU0JvZEcxc0lFaFVUVXdnMFlMUXRkQzYwWUhSZ2x4eVhHNGdLaUJBY21WMGRYSnVJSHRGYkdWdFpXNTBmVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmSkdOeVpXRjBaVVZzWlcxbGJuUWdQU0JtZFc1amRHbHZiaWhvZEcxc0tTQjdYSEpjYmlBZ0lDQmpiMjV6ZENCa2FYWWdQU0JrYjJOMWJXVnVkQzVqY21WaGRHVkZiR1Z0Wlc1MEtDZGthWFluS1R0Y2NseHVJQ0FnSUdScGRpNXBibk5sY25SQlpHcGhZMlZ1ZEVoVVRVd29KMkZtZEdWeVltVm5hVzRuTENCb2RHMXNLVHRjY2x4dUlDQWdJSEpsZEhWeWJpQmthWFl1WTJocGJHUnlaVzR1YkdWdVozUm9JRDRnTVNBL0lHUnBkaTVqYUdsc1pISmxiaUE2SUdScGRpNW1hWEp6ZEVWc1pXMWxiblJEYUdsc1pEdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSUZOaFptVWcwTExSaTlDMzBMN1FzaURRc3RDOTBMWFJpTkM5MExqUmhTRFJnZEMrMExIUmk5R0MwTGpRdVNEUXV0QyswTHpRdjlDKzBMM1F0ZEM5MFlMUXNGeHlYRzRnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnWmlEUW1OQzgwWThnMFlIUXZ0Q3gwWXZSZ3RDNDBZOWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYMk5oYkd4aVlXTnJJRDBnWm5WdVkzUnBiMjRvWmlrZ2UxeHlYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQjBhR2x6TG05d2RHbHZibk11YjI1YlpsMGdQVDBnSjJaMWJtTjBhVzl1SnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG05d2RHbHZibk11YjI1YlpsMHVZWEJ3Ykhrb2RHaHBjeXdnVzEwdWMyeHBZMlV1WTJGc2JDaGhjbWQxYldWdWRITXNJREVwS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnlaWFIxY200N1hISmNibjFjY2x4dVhISmNibVY0Y0c5eWRDQmtaV1poZFd4MElFUmhkR1ZTWVc1blpWQnBZMnRsY2p0Y2NseHVJbDBzSW5OdmRYSmpaVkp2YjNRaU9pSWlmUT09IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCBEYXRlUmFuZ2VQaWNrZXIsIHtMT0NLX1VOQVZBSUxBQkxFLCBMT0NLX0xPQ0tFRH0gZnJvbSAnLi4vLi4vZGlzdC9kYXRlcmFuZ2VwaWNrZXInO1xyXG5cclxuY29uc3QgJGZvcm0gPSBkb2N1bWVudC5mb3Jtc1swXTtcclxuY29uc3QgJGRhdGVfZnJvbSA9ICRmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZGF0ZV9mcm9tXCJdJyk7XHJcbmNvbnN0ICRkYXRlX3RvICAgPSAkZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImRhdGVfdG9cIl0nKTtcclxuXHJcbi8vINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvQtSDQtNCw0YLRi1xyXG5jb25zdCBibG9ja2VkRGF0ZXMgPSB7fTtcclxuY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbmRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbmZvciAobGV0IGkgPSAwOyBpIDwgNjA7ICsraSkge1xyXG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjYpIHtcclxuICAgICAgICBibG9ja2VkRGF0ZXNbZGF0ZV0gPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7XHJcbn1cclxuXHJcbm5ldyBEYXRlUmFuZ2VQaWNrZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RhdGVyYW5nZXBpY2tlcicpLCB7XHJcbiAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpLFxyXG4gICAgbWF4RGF0ZTogbmV3IERhdGUoJzIwMjItMDUtMjAnKSxcclxuICAgIG1vbnRoc0NvdW50OiAyLFxyXG4gICAgcGVyUm93OiAzLFxyXG4gICAgc2luZ2xlTW9kZTogZmFsc2UsXHJcbiAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgIDk2MDoge1xyXG4gICAgICAgICAgICBtb250aHNDb3VudDogMTIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICA3MjA6IHtcclxuICAgICAgICAgICAgbW9udGhzQ291bnQ6IDMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICA0ODA6IHtcclxuICAgICAgICAgICAgbW9udGhzQ291bnQ6IDEsXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBvbjoge1xyXG4gICAgICAgIHJhbmdlU2VsZWN0OiBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgJGRhdGVfZnJvbS52YWx1ZSA9IGRhdGVfZnJvbS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICAgICAgJGRhdGVfdG8udmFsdWUgPSBkYXRlX3RvLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGF5U2VsZWN0OiBmdW5jdGlvbihkYXRlX2Zyb20pIHtcclxuICAgICAgICAgICAgJGRhdGVfZnJvbS52YWx1ZSA9IGRhdGVfZnJvbS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGZpbHRlcjoge1xyXG4gICAgICAgIGxvY2tEYXlzOiBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgICAgIGlmIChibG9ja2VkRGF0ZXNbZGF0ZV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBMT0NLX0xPQ0tFRDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG9vbHRpcFRleHQ6IGZ1bmN0aW9uKGRheXMpIHtcclxuICAgICAgICAgICAgY29uc3QgbmlnaHRzID0gZGF5cyAtIDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsdXJhbChuaWdodHMsIFsnJWQg0L3QvtGH0YwnLCAnJWQg0L3QvtGH0LgnLCAnJWQg0L3QvtGH0LXQuSddKS5yZXBsYWNlKCclZCcsIG5pZ2h0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==