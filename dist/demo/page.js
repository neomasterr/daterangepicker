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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9zY3NzL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOztVQ1ZBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDTztBQUNBOztBQUVQO0FBQ0E7O0FBRUEsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsa0JBQWtCO0FBQzNCO0FBQ0E7QUFDQTtB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QUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWUsZUFBZSxFQUFDIiwiZmlsZSI6ImRhdGVyYW5nZXBpY2tlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiRGF0ZXJhbmdlcGlja2VyXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vINGB0L7RgdGC0L7Rj9C90LjRjyDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbmV4cG9ydCBjb25zdCBMT0NLX1VOQVZBSUxBQkxFID0gMTtcclxuZXhwb3J0IGNvbnN0IExPQ0tfTE9DS0VEICAgICAgPSAyO1xyXG5cclxuY29uc3QgSU5ERVhfREFURV9GUk9NID0gMDtcclxuY29uc3QgSU5ERVhfREFURV9UTyAgID0gMTtcclxuXHJcbmZ1bmN0aW9uIERhdGVSYW5nZVBpY2tlcigkY29udGFpbmVyLCBvcHRpb25zID0ge30pIHtcclxuICAgIC8vINC+0YIg0L/QvtCy0YLQvtGA0L3QvtC5INC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4XHJcbiAgICBpZiAoJGNvbnRhaW5lci5pbnN0YW5jZSkge1xyXG4gICAgICAgIHJldHVybiAkY29udGFpbmVyLmluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgJGNvbnRhaW5lci5pbnN0YW5jZSA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5fJGNvbnRhaW5lciA9ICRjb250YWluZXI7XHJcblxyXG4gICAgLy8g0LfQvdCw0YfQtdC90LjQtSDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgY29uc3QgZHYgPSAoeCwgdikgPT4gdHlwZW9mIHggPT0gJ3VuZGVmaW5lZCcgPyB2IDogeDtcclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgZmlyc3REYXlPZlRoZVdlZWs6IGR2KG9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWssIDEpLCAvLyDQv9C10YDQstGL0Lkg0LTQtdC90Ywg0L3QtdC00LXQu9C4LCAwID0g0LLRgSwgMSA9INC/0L0sIC4uLlxyXG4gICAgICAgIHNpbmdsZU1vZGU6ICAgICAgICBkdihvcHRpb25zLnNpbmdsZU1vZGUsIGZhbHNlKSwgICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLINCy0LzQtdGB0YLQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBsb2NhbGU6ICAgICAgICAgICAgZHYob3B0aW9ucy5sb2NhbGUsICdydS1SVScpLFxyXG4gICAgICAgIG1pbkRheXM6ICAgICAgICAgICBkdihvcHRpb25zLm1pbkRheXMsIDEpLCAgICAgICAgICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuSDQsiDQtNC40LDQv9Cw0LfQvtC90LVcclxuICAgICAgICBtb250aHNDb3VudDogICAgICAgZHYob3B0aW9ucy5tb250aHNDb3VudCwgMTIpLFxyXG4gICAgICAgIHBlclJvdzogICAgICAgICAgICBkdihvcHRpb25zLnBlclJvdywgdW5kZWZpbmVkKSwgICAgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LzQtdGB0Y/RhtC10LIg0LIg0YDRj9C00YNcclxuICAgICAgICBtaW5EYXRlOiAgICAgICAgICAgZHYob3B0aW9ucy5taW5EYXRlLCBuZXcgRGF0ZSgpKSwgIC8vINC80LjQvdC40LzQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAgICBtYXhEYXRlOiAgICAgICAgICAgZHYob3B0aW9ucy5tYXhEYXRlLCB1bmRlZmluZWQpLFxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiAgICAgICBkdihvcHRpb25zLmJyZWFrcG9pbnRzLCB7fSksXHJcbiAgICAgICAgaW50ZXJuYWxJbnB1dHM6ICAgIGR2KG9wdGlvbnMuaW50ZXJuYWxJbnB1dHMsIHRydWUpLCAvLyDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjQtSDQstGB0YLRgNC+0LXQvdC90YvRhSDQuNC90L/Rg9GC0L7QslxyXG4gICAgICAgIC8vINGB0L7QsdGL0YLQuNGPXHJcbiAgICAgICAgb246IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICByYW5nZVNlbGVjdDogbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICAgICAgICAgICAgZGF5U2VsZWN0OiAgIG51bGwsIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQvtC00L3QvtC5INC00LDRgtGLICjRgtC+0LvRjNC60L4g0L/RgNC4IHNpbmdsZU1vZGU6IHRydWUpXHJcbiAgICAgICAgfSwgb3B0aW9ucy5vbiB8fCB7fSksXHJcbiAgICAgICAgLy8g0YTQuNC70YzRgtGA0YPRjtGJ0LjQtSDQvNC10YLQvtC00YtcclxuICAgICAgICBmaWx0ZXI6IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICBsb2NrRGF5czogICAgdGhpcy5fZmlsdGVyTG9ja0RheXMsICAgIC8vIGNhbGxiYWNrKGRhdGUpINGE0YPQvdC60YbQuNGPINCx0LvQvtC60LjRgNC+0LLQsNC90LjRjyDQtNCw0YIsIHRydWUvTE9DS1xyXG4gICAgICAgICAgICB0b29sdGlwVGV4dDogdGhpcy5fZmlsdGVyVG9vbHRpcFRleHQsIC8vIGNhbGxiYWNrKGRheXMpINCy0YvQstC+0LQg0YLQtdC60YHRgtCwINC/0L7QtNGB0LrQsNC30LrQuFxyXG4gICAgICAgIH0sIG9wdGlvbnMuZmlsdGVyIHx8IHt9KSxcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXQoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINGA0Y/QtNC90L7RgdGC0YxcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnBlclJvdyA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5wZXJSb3cgPSB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5taW5EYXRlKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm1pbkRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7Qv9GG0LjQuCDQtNC70Y8g0Y3QutGA0LDQvdC+0LIg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICAgIHRoaXMub3B0aW9ucy5icmVha3BvaW50c1t0aGlzLl9icmVha3BvaW50ID0gMF0gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuICAgIC8vINGC0LXQutGD0YnQuNC5INC00LXQvdGMXHJcbiAgICB0aGlzLl90b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICB0aGlzLl90b2RheS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICB0aGlzLl8kcGlja2VyID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJcIj5cclxuICAgICAgICAgICAgJHt0aGlzLm9wdGlvbnMuaW50ZXJuYWxJbnB1dHMgP1xyXG4gICAgICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX2lucHV0c1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICR7dGhpcy5vcHRpb25zLnNpbmdsZU1vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyBgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZVwiPmBcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV9mcm9tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImRhdGVfdG9cIj5gXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+YCA6ICcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXBcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXAtY29udGVudFwiPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGN0LvQtdC80LXQvdGC0YtcclxuICAgIHRoaXMuXyRtb250aHMgICAgICAgICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzJyk7XHJcbiAgICB0aGlzLl8kdG9vbHRpcCAgICAgICAgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5EYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXAnKTtcclxuICAgIHRoaXMuXyR0b29sdGlwQ29udGVudCA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcC1jb250ZW50Jyk7XHJcblxyXG4gICAgLy8g0L/QvtC70Y8g0LLQstC+0LTQsFxyXG4gICAgdGhpcy5fJGlucHV0cyA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZV49XCJkYXRlXCJdJyk7XHJcblxyXG4gICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YBcclxuICAgIHRoaXMuX3NlbGVjdERhdGUodGhpcy5vcHRpb25zLm1pbkRhdGUpO1xyXG4gICAgdGhpcy5fJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl8kcGlja2VyKTtcclxuXHJcbiAgICAvLyDQvtCx0YDQsNCx0L7RgtC60LAg0LHRgNC10LnQutC/0L7QuNC90YLQvtCyXHJcbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzKS5sZW5ndGgpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fb25XaW5kb3dSZXNpemVFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLl9vbldpbmRvd1Jlc2l6ZUV2ZW50KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQndCw0LfQstCw0L3QuNC1INC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldE1vbnRoRm9ybWF0dGVkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgdGl0bGUgPSB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHttb250aDogJ2xvbmcnfSk7XHJcbiAgICByZXR1cm4gdGl0bGUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKSArIHRpdGxlLnNsaWNlKDEpO1xyXG59XHJcblxyXG4vKipcclxuICog0KTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90LjQtSDQtNCw0YLRiyDQtNC70Y8g0YLQtdC60YPRidC10Lkg0LvQvtC60LDQu9C4XHJcbiAqIEBwYXJhbSAge0RhdGV9ICAgZGF0ZSAgICDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zINCf0LDRgNCw0LzQtdGC0YDRi1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGVUaW1lRm9ybWF0ID0gZnVuY3Rpb24oZGF0ZSwgb3B0aW9ucykge1xyXG4gICAgcmV0dXJuIEludGwuRGF0ZVRpbWVGb3JtYXQodGhpcy5vcHRpb25zLmxvY2FsZSwgb3B0aW9ucykuZm9ybWF0KGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0JTQvdC4INC90LXQtNC10LvQuFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRXZWVrRGF5c0Zvcm1hdHRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAyKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgKytpKSB7XHJcbiAgICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICBkYXk6IGRhdGUuZ2V0RGF5KCksXHJcbiAgICAgICAgICAgIHRpdGxlOiB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHt3ZWVrZGF5OiAnc2hvcnQnfSksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0YHQvtCz0LvQsNGB0L3QviDQvdCw0YHRgtGA0L7QtdC90L3QvtC80YMg0L/QtdGA0LLQvtC80YMg0LTQvdGOINC90LXQtNC10LvQuFxyXG4gICAgcmVzdWx0LnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICBjb25zdCBmaXJzdERheU9mVGhlV2VlayA9IHRoaXMub3B0aW9ucy5maXJzdERheU9mVGhlV2VlayAlIDc7XHJcbiAgICAgICAgbGV0IGRheUEgPSBhLmRheTtcclxuICAgICAgICBsZXQgZGF5QiA9IGIuZGF5O1xyXG5cclxuICAgICAgICBpZiAoZGF5QSA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QiA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlBIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgZGF5QSArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUIgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICBkYXlCICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGF5QSAtIGRheUI7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vKipcclxuICog0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LzQtdGB0Y/RhtC1XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge051bWJlcn0gICAg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF5c0NvdW50SW5Nb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IGRheXMgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF5cy5zZXRNb250aChkYXlzLmdldE1vbnRoKCkgKyAxKTtcclxuICAgIGRheXMuc2V0RGF0ZSgwKTtcclxuICAgIHJldHVybiBkYXlzLmdldERhdGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnJhbmdlUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsUmVzZXQoKTtcclxuICAgIHRoaXMuX3NlbGVjdGlvbiA9IHt9O1xyXG59XHJcblxyXG4vKipcclxuICog0JLRi9C00LXQu9C10L3QuNC1INC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucmFuZ2VTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgaWYgKCF0aGlzLmdldElzUmFuZ2VTZWxlY3RhYmxlKGRhdGVfZnJvbSwgZGF0ZV90bykpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INGN0LvQtdC80LXQvdGC0L7QslxyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QoZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuXHJcbiAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1XHJcbiAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7QsdC90L7QstC70LXQvdC40LUg0LjQvdC/0YPRgtC+0LJcclxuICAgIGlmICh0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfRlJPTV0pIHtcclxuICAgICAgICB0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfRlJPTV0udmFsdWUgPSB0aGlzLmZvcm1hdERhdGUoZGF0ZV9mcm9tKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fJGlucHV0c1tJTkRFWF9EQVRFX1RPXSkge1xyXG4gICAgICAgIHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9UT10udmFsdWUgPSB0aGlzLmZvcm1hdERhdGUoZGF0ZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtCx0YvRgtC40LVcclxuICAgIHRoaXMuX2NhbGxiYWNrKCdyYW5nZVNlbGVjdCcsIGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INC00LDRgtGLXHJcbiAqIEBwYXJhbSAge0RhdGV9ICAgZGF0ZSAgINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZvcm1hdCDQpNC+0YDQvNCw0YIg0YHRgtGA0L7QutC4XHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUsIGZvcm1hdCA9ICdZLW0tZCcpIHtcclxuICAgIHJldHVybiBmb3JtYXQucmVwbGFjZSgnWScsIGRhdGUuZ2V0RnVsbFllYXIoKSlcclxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgnbScsICgnMCcgKyAoZGF0ZS5nZXRNb250aCgpICsgMSkpLnNsaWNlKC0yKSlcclxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgnZCcsICgnMCcgKyAoZGF0ZS5nZXREYXRlKCkpKS5zbGljZSgtMikpO1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC+0LLQtdGA0LrQsCDQstC+0LfQvNC+0LbQvdC+0YHRgtC4INCy0YvQtNC10LvQtdC90LjRjyDQtNCw0YJcclxuICogQHBhcmFtICB7RGF0ZSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSAge0RhdGUgZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0SXNSYW5nZVNlbGVjdGFibGUgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC80LjQvdC40LzQsNC70YzQvdGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgY29uc3QgZGlmZiA9IE1hdGguYWJzKGRhdGVfZnJvbS5nZXRUaW1lKCkgLSBkYXRlX3RvLmdldFRpbWUoKSkgLyAxMDAwIC8gODY0MDA7XHJcbiAgICBpZiAoZGlmZiA8IHRoaXMub3B0aW9ucy5taW5EYXlzKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDQvtCy0LXRgNC60LAg0L/QvtC/0LDQtNCw0L3QuNGPINCyINC00LjQsNC/0LDQt9C+0L0g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9GFINC00LDRglxyXG4gICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIGRheS5zZXRUaW1lKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG5cclxuICAgIHdoaWxlIChkYXkgPCBkYXRlX3RvKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0RGF5TG9ja2VkKGRheSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC+0LLQtdGA0LrQsCDQvdCwINC00L7RgdGC0YPQv9C90L7RgdGC0Ywg0LTQvdGPINC00LvRjyDQsdGA0L7QvdC4XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICogQHJldHVybiB7Qm9vbGVhbn0gICB0cnVlINC10YHQu9C4INC00L7RgdGC0YPQv9C10L1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF5TG9ja2VkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LLQvdC1INC00L7RgdGC0YPQv9C90L7Qs9C+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgaWYgKGRhdGUgPCB0aGlzLm9wdGlvbnMubWluRGF0ZSB8fCBkYXRlID4gdGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICByZXR1cm4gTE9DS19VTkFWQUlMQUJMRTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZpbHRlci5sb2NrRGF5cy5jYWxsKHRoaXMsIGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0JLRi9Cx0YDQsNC90L3QsNGPINC90LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtEYXRlfSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlRnJvbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0L3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwINC90LUg0YPQutCw0LfQsNC90LBcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvdCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LAg0L/QvtC30LbQtSDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA+IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tO1xyXG59XHJcblxyXG4vKipcclxuICog0JLRi9Cx0YDQsNC90L3QsNGPINC00LDRgtCwIChzaW5nbGVNb2RlOiB0cnVlKVxyXG4gKiBAcmV0dXJuIHtEYXRlfSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlID0gRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlRnJvbTtcclxuXHJcbi8qKlxyXG4gKiDQktGL0LHRgNCw0L3QvdCw0Y8g0LrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtEYXRlfSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlVG8gPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LAg0L3QtSDRg9C60LDQt9Cw0L3QsFxyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvdCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LAg0L/QvtC30LbQtSDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tID4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG87XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60LvQvtC90LXQvdC40LUgKDEg0LHQvtCx0ZHRgCwgMiDQsdC+0LHRgNCwLCA1INCx0L7QsdGA0L7QsilcclxuICogQHBhcmFtICB7TnVtYmVyfSB2YWx1ZSDQmtC+0LvQuNGH0LXRgdGC0LLQvlxyXG4gKiBAcGFyYW0gIHtBcnJheX0gIGZvcm1zINCc0LDRgdGB0LjQsiDQuNC3IDPRhSDRjdC70LXQvNC10L3RgtC+0LIsINC80L7QttC10YIg0YHQvtC00LXRgNC20LDRgtGMINGB0L/QtdGG0LjRhNC40LrQsNGC0L7RgCAlZCDQtNC70Y8g0LfQsNC80LXQvdGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucGx1cmFsID0gZnVuY3Rpb24gKHZhbHVlLCBmb3Jtcykge1xyXG4gICAgcmV0dXJuICh2YWx1ZSAlIDEwID09IDEgJiYgdmFsdWUgJSAxMDAgIT0gMTEgPyBmb3Jtc1swXSA6ICh2YWx1ZSAlIDEwID49IDIgJiYgdmFsdWUgJSAxMCA8PSA0ICYmICh2YWx1ZSAlIDEwMCA8IDEwIHx8IHZhbHVlICUgMTAwID49IDIwKSA/IGZvcm1zWzFdIDogZm9ybXNbMl0pKS5yZXBsYWNlKCclZCcsIHZhbHVlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC40LDQv9Cw0LfQvtC90LAg0LzQtdGB0Y/RhtC10LJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlTW9udGhzID0gZnVuY3Rpb24oZGF0ZV9mcm9tKSB7XHJcbiAgICB3aGlsZSAodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5yZW1vdmVDaGlsZCh0aGlzLl8kbW9udGhzLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgIHRoaXMuX3Rvb2x0aXBIaWRlKCk7XHJcblxyXG4gICAgLy8g0L/RgNC10YDQtdC90LTQtdGAINC80LXRgdGP0YbQtdCyXHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG4gICAgY29uc3QgJG1vbnRocyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7ICsraSkge1xyXG4gICAgICAgICRtb250aHMucHVzaCh0aGlzLl8kY3JlYXRlTW9udGgoY3VycmVudERhdGUpKTtcclxuICAgICAgICBjdXJyZW50RGF0ZS5zZXRNb250aChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRtb250aHMubGVuZ3RoOyBpICs9IHRoaXMub3B0aW9ucy5wZXJSb3cpIHtcclxuICAgICAgICBjb25zdCAkcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnRGF0ZXJhbmdlcGlja2VyX19yb3cnO1xyXG5cclxuICAgICAgICAkbW9udGhzLnNsaWNlKGksIGkgKyB0aGlzLm9wdGlvbnMucGVyUm93KS5mb3JFYWNoKCRtb250aCA9PiB7XHJcbiAgICAgICAgICAgICRyb3cuYXBwZW5kQ2hpbGQoJG1vbnRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5hcHBlbmRDaGlsZCgkcm93KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCc0LXRgdGP0YZcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVNb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IG1vbnRoVGl0bGUgPSB0aGlzLmdldE1vbnRoRm9ybWF0dGVkKGRhdGUpO1xyXG4gICAgY29uc3Qgd2Vla0RheXMgPSB0aGlzLmdldFdlZWtEYXlzRm9ybWF0dGVkKCk7XHJcblxyXG4gICAgY29uc3QgJG1vbnRoID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJNb250aFwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9faGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tcHJldiR7KHRoaXMub3B0aW9ucy5taW5EYXRlICYmIGRhdGUgPD0gdGhpcy5vcHRpb25zLm1pbkRhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNyAxM0wxIDdMNyAxXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fdGl0bGVcIj4ke21vbnRoVGl0bGV9ICR7ZGF0ZS5nZXRGdWxsWWVhcigpfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLW5leHQkeyh0aGlzLm9wdGlvbnMubWF4RGF0ZSAmJiBkYXRlID49IHRoaXMub3B0aW9ucy5tYXhEYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEgMC45OTk5OTlMNyA3TDEgMTNcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrXCI+JHt3ZWVrRGF5cy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla2RheVwiPiR7aXRlbS50aXRsZX08L2Rpdj5gXHJcbiAgICAgICAgICAgIH0pLmpvaW4oJycpfTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2RheXNcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGB0YLRgNC10LvQutC4XHJcbiAgICBbXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tcHJldicsIG5hbWU6ICdwcmV2J30sXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tbmV4dCcsIG5hbWU6ICduZXh0J30sXHJcbiAgICBdLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgY29uc3QgJGFycm93ID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoaXRlbS5zZWxlY3Rvcik7XHJcbiAgICAgICAgJGFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgIC8vINCy0YDQtdC80LXQvdC90LDRjyDQvNC10YDQsCwg0LvRg9GH0YjQtSDQv9C10YDQtdCy0LXRgNGB0YLQsNGC0YwsINCy0YvQvdC10YHRgtC4INGB0YLRgNC10LvQutC4INC30LAg0L/RgNC10LTQtdC70Ysg0L/QtdGA0LXRgNC10YDQuNGB0L7QstGL0LLQsNC10LzQvtC5INC+0LHQu9Cw0YHRgtC4INC/0LjQutC10YDQsFxyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fb25BcnJvd0NsaWNrKCRhcnJvdywgaXRlbS5uYW1lKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vINGA0LXQvdC00LXRgCDQtNC90LXQuVxyXG4gICAgY29uc3QgJGRheXMgPSAkbW9udGgucXVlcnlTZWxlY3RvcignLk1vbnRoX19kYXlzJyk7XHJcbiAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgZGF5cy5zZXREYXRlKDEpO1xyXG4gICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICB3aGlsZSAoZGF5cy5nZXRNb250aCgpID09IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZVdlZWsoKTtcclxuXHJcbiAgICAgICAgd2Vla0RheXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgaWYgKGRheXMuZ2V0RGF5KCkgIT0gaXRlbS5kYXkgfHwgZGF5cy5nZXRNb250aCgpICE9IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZUVtcHR5RGF5KCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRGF5KGRheXMpKTtcclxuICAgICAgICAgICAgZGF5cy5zZXREYXRlKGRheXMuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRkYXlzLmFwcGVuZENoaWxkKCR3ZWVrKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJG1vbnRoO1xyXG59XHJcblxyXG4vKipcclxuICog0JrQu9C40Log0L/QviDRgdGC0YDQtdC70LrQtSDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y8g0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGFycm93IEhUTUwg0Y3Qu9C10LzQtdC90YJcclxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgICAg0JjQvNGPIChwcmV2LCBuZXh0KVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25BcnJvd0NsaWNrID0gZnVuY3Rpb24oJGFycm93LCBuYW1lKSB7XHJcbiAgICBpZiAoJGFycm93LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUocGFyc2VJbnQodGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuTW9udGgnKS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIChuYW1lID09ICdwcmV2JyA/IC10aGlzLm9wdGlvbnMubW9udGhzQ291bnQgOiB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpKTtcclxuXHJcbiAgICAvLyDQstGL0YXQvtC0INC30LAg0L/RgNC10LTQtdC70Ysg0LzQuNC90LjQvNCw0LvRjNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKGRhdGUgPCB0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWluRGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGVuZERhdGUgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgZW5kRGF0ZS5zZXRNb250aChlbmREYXRlLmdldE1vbnRoKCkgKyB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpO1xyXG4gICAgICAgIGlmIChlbmREYXRlID4gdGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICAgICAgZGF0ZS5zZXRUaW1lKHRoaXMub3B0aW9ucy5tYXhEYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpIC0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50ICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0LXRgNC10YXQvtC0INC6INC90L7QstC+0Lkg0LTQsNGC0LVcclxuICAgIHRoaXMuX3NlbGVjdERhdGUoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10Lkg0LTQsNGC0Ysg0YEg0YDQtdC90LTQtdGA0L7QvFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3NlbGVjdERhdGUgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICB0aGlzLl9zZWxlY3RlZERhdGUgPSBkYXRlO1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRocyhkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQvdC10LTQtdC70LhcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVXZWVrID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIldlZWtcIj48L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkd2VlaztcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC90Y9cclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVEYXkgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXlcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiIGRhdGEtZGF5PVwiJHtkYXRlLmdldERheSgpfVwiPiR7ZGF0ZS5nZXREYXRlKCl9PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25EYXlDbGlja0V2ZW50LmJpbmQodGhpcykpO1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLl9vbkRheU1vdXNlRW50ZXJFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICAgIHRoaXMuX3VwZGF0ZURheSgkZGF5KTtcclxuXHJcbiAgICByZXR1cm4gJGRheTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLk1vbnRoJykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZU1vbnRoKCRtb250aCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuSDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtFbGVtZW50fSAkbW9udGgg0K3Qu9C10LzQtdC90YIg0LzQtdGB0Y/RhtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl91cGRhdGVNb250aCA9IGZ1bmN0aW9uKCRtb250aCkge1xyXG4gICAgJG1vbnRoLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpLmZvckVhY2goJGRheSA9PiB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlRGF5KCRkYXkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Lkg0LTQvdGPXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQrdC70LXQvNC10L3RgiDQtNC90Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3VwZGF0ZURheSA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGNvbnN0IGRhdGUgICA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgY29uc3QgbG9ja2VkID0gdGhpcy5nZXREYXlMb2NrZWQoZGF0ZSk7XHJcbiAgICBjb25zdCB0b2RheSAgPSB0aGlzLl90b2RheS5nZXRUaW1lKCkgPT0gZGF0ZS5nZXRUaW1lKCk7XHJcblxyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1kaXNhYmxlZCcsIGxvY2tlZCk7XHJcbiAgICAkZGF5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLWxvY2tlZCcsIGxvY2tlZCA9PSBMT0NLX0xPQ0tFRCk7XHJcbiAgICAkZGF5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLXRvZGF5JywgdG9kYXkpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0LrQu9C40LrQsCDQv9C+INC00L3RjlxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlDbGlja0V2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdGhpcy5fb25EYXlDbGljayhlLnRhcmdldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDRhdC+0LLQtdGA0LBcclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5TW91c2VFbnRlckV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdGhpcy5fb25EYXlNb3VzZUVudGVyKGUudGFyZ2V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCl0L7QstC10YAg0L3QsCDRjdC70LXQvNC10L3RgtC1INC00L3Rj1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlNb3VzZUVudGVyID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5LmRhdGFzZXQudGltZSA9PSB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLmdldFRpbWUoKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRlX3RvID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0LvQuNC6INC/0L4g0LTQvdGOXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheUNsaWNrID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgLy8g0LTQtdC90Ywg0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC9XHJcbiAgICBpZiAoJGRheS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSlcclxuICAgICAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2soJ2RheVNlbGVjdCcsIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdCx0YDQvtGBINCy0YvQsdGA0LDQvdC90L7Qs9C+INGA0LDQvdC10LUg0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAvLyDQstGL0LHRgNCw0L3QsCDQvdCw0YfQsNC70YzQvdCw0Y8gLyDQutC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20pIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAvLyDQtNC+0L/Rg9GB0YLQuNC80YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICAgICAgaWYgKCF0aGlzLmdldElzUmFuZ2VTZWxlY3RhYmxlKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSkge1xyXG4gICAgICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yYW5nZVNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktC40LfRg9Cw0LvRjNC90YvQuSDRgdCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fcmFuZ2VWaXN1YWxSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgJGRheXMgPSB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpO1xyXG4gICAgJGRheXMuZm9yRWFjaCgkZGF5ID0+IHtcclxuICAgICAgICAkZGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nLCAnaXMtc2VsZWN0ZWQtdG8nLCAnaXMtc2VsZWN0ZWQtYmV0d2VlbicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0L/RgNGP0YfQtdC8INC/0L7QtNGB0LrQsNC30LrRg1xyXG4gICAgdGhpcy5fdG9vbHRpcEhpZGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LjQt9GD0LDQu9GM0L3QvtC1INCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3JhbmdlVmlzdWFsU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBpZiAoZGF0ZV9mcm9tICYmIGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGVfdG8gJiYgZGF0ZV90byBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0aW1lX2Zyb20gPSBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV9mcm9tLmdldFRpbWUoKSA6IDA7XHJcbiAgICBsZXQgdGltZV90byA9IGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV90by5nZXRUaW1lKCkgOiAwO1xyXG4gICAgaWYgKHRpbWVfZnJvbSA+IHRpbWVfdG8pIHtcclxuICAgICAgICBbdGltZV9mcm9tLCB0aW1lX3RvXSA9IFt0aW1lX3RvLCB0aW1lX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YIg0LzQtdC20LTRgyDQvdCw0YfQsNC70YzQvdC+0Lkg0Lgg0LrQvtC90LXRh9C90L7QuVxyXG4gICAgY29uc3QgJGRheXMgPSB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkZGF5cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICRkYXlzW2ldLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXNlbGVjdGVkLWJldHdlZW4nLCAkZGF5c1tpXS5kYXRhc2V0LnRpbWUgPiB0aW1lX2Zyb20gJiYgJGRheXNbaV0uZGF0YXNldC50aW1lIDwgdGltZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5INC/0L7Qt9C40YbQuNC4XHJcbiAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICBjb25zdCAkZGF5X3RvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuXHJcbiAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgaWYgKHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCAhPSAkZGF5X2Zyb20pIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgaWYgKHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkICE9ICRkYXlfdG8pIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7RhdGA0LDQvdC10L3QuNC1INCyINC60LXRiFxyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCA9ICRkYXlfZnJvbTtcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkID0gJGRheV90bztcclxuXHJcbiAgICB0aGlzLl9zZWxlY3Rpb24uJGRheV9mcm9tID0gJGRheV9mcm9tO1xyXG4gICAgdGhpcy5fc2VsZWN0aW9uLiRkYXlfdG8gPSAkZGF5X3RvO1xyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IE1hdGguZmxvb3IoTWF0aC5hYnModGltZV9mcm9tIC0gdGltZV90bykgLyA4NjQwMGUzKSArIDE7XHJcbiAgICAgICAgdGhpcy5fdG9vbHRpcFNob3coJGRheV90bywgZGF5cyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9C+0LrQsNC3INC/0L7QtNGB0LrQsNC30LrQuFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkg0JLRi9Cx0YDQsNC90L3Ri9C5INC00LXQvdGMXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSAgZGF5cyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcFNob3cgPSBmdW5jdGlvbigkZGF5LCBkYXlzKSB7XHJcbiAgICB0aGlzLl8kdG9vbHRpcENvbnRlbnQudGV4dENvbnRlbnQgPSB0aGlzLm9wdGlvbnMuZmlsdGVyLnRvb2x0aXBUZXh0LmNhbGwodGhpcywgZGF5cykgfHwgJyc7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zaG93JywgdGhpcy5fJHRvb2x0aXAudGV4dENvbnRlbnQubGVuZ3RoKTtcclxuICAgIHRoaXMuX3Rvb2x0aXBVcGRhdGUoJGRheSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDQv9C+0LfQuNGG0LjQuCDQv9C+0LTRgdC60LDQt9C60LhcclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5INCS0YvQsdGA0LDQvdC90YvQuSDQtNC10L3RjFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcFVwZGF0ZSA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGxldCB4ID0gMDtcclxuICAgIGxldCB5ID0gMDtcclxuICAgIGxldCAkZWwgPSAkZGF5O1xyXG4gICAgZG8ge1xyXG4gICAgICAgIHkgKz0gJGVsLm9mZnNldFRvcDtcclxuICAgICAgICB4ICs9ICRlbC5vZmZzZXRMZWZ0O1xyXG4gICAgfSB3aGlsZSAoKCRlbCA9ICRlbC5vZmZzZXRQYXJlbnQpICYmICRlbCAhPSB0aGlzLl8kcGlja2VyKTtcclxuXHJcbiAgICB0aGlzLl8kdG9vbHRpcC5zdHlsZS50b3AgPSBNYXRoLnJvdW5kKHkgLSB0aGlzLl8kdG9vbHRpcC5vZmZzZXRIZWlnaHQpICsgJ3B4JztcclxuICAgIHRoaXMuXyR0b29sdGlwLnN0eWxlLmxlZnQgPSBNYXRoLnJvdW5kKHggKyAkZGF5Lm9mZnNldFdpZHRoIC8gMiAtIHRoaXMuXyR0b29sdGlwLm9mZnNldFdpZHRoIC8gMikgKyAncHgnO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQutGA0YvRgtGMINC/0L7QtNGB0LrQsNC30LrRg1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcEhpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuXyR0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNob3cnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCi0LXQutGB0YIg0L/QvtC00YHQutCw0LfQutC4INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAqIEBwYXJhbSAge051bWJlcn0gZGF5cyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9maWx0ZXJUb29sdGlwVGV4dCA9IGZ1bmN0aW9uKGRheXMpIHtcclxuICAgIHJldHVybiB0aGlzLnBsdXJhbChkYXlzLCBbJyVkINC00LXQvdGMJywgJyVkINC00L3RjycsICclZCDQtNC90LXQuSddKS5yZXBsYWNlKCclZCcsIGRheXMpO1xyXG59XHJcblxyXG4vKipcclxuICog0KTQuNC70YzRgtGAINC90LXQtNC+0YHRgtGD0L/QvdGL0YUg0LTQvdC10Lkg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2ZpbHRlckxvY2tEYXlzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyDQstGB0LUg0LTQvdC4INC00L7RgdGC0YPQv9C90YtcclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INC40LfQvNC10L3QtdC90LjRjyDRgNCw0LfQvNC10YDQvtCyINC+0LrQvdCwXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZUV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvKSB7XHJcbiAgICAgICAgdGhpcy5fdG9vbHRpcFVwZGF0ZSh0aGlzLl9zZWxlY3Rpb24uJGRheV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGJyZWFrcG9pbnQgPSAwO1xyXG4gICAgY29uc3QgYnJlYWtwb2ludHMgPSBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHMpLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcclxuICAgIGZvciAobGV0IGkgaW4gYnJlYWtwb2ludHMpIHtcclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPD0gYnJlYWtwb2ludHNbaV0pIHtcclxuICAgICAgICAgICAgYnJlYWtwb2ludCA9IGJyZWFrcG9pbnRzW2ldO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fc2V0QnJlYWtwb2ludChicmVha3BvaW50KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCj0YHRgtCw0L3QvtCy0LrQsCDRgdC+0YHRgtC+0Y/QvdC40Y8g0YDQtdC90LTQtdGA0LAg0L/QvtC0INGA0LDQt9C90YvQtSDRjdC60YDQsNC90YtcclxuICogQHBhcmFtIHtOdW1iZXJ9IGJyZWFrcG9pbnQg0JrQu9GO0Ycg0LjQtyB0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHMgKNCo0LjRgNC40L3QsCDRjdC60YDQsNC90LApXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9zZXRCcmVha3BvaW50ID0gZnVuY3Rpb24oYnJlYWtwb2ludCkge1xyXG4gICAgLy8g0L7RgiDQvdC10L3Rg9C20L3QvtC5INC/0LXRgNC10YDQuNGB0L7QstC60LhcclxuICAgIGlmICh0aGlzLl9icmVha3BvaW50ID09IGJyZWFrcG9pbnQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLl9icmVha3BvaW50ID0gYnJlYWtwb2ludDtcclxuXHJcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5icmVha3BvaW50c1ticmVha3BvaW50XSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKTtcclxuICAgIHRoaXMuXyRjcmVhdGVNb250aHModGhpcy5fc2VsZWN0ZWREYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCt0LvQtdC80LXQvdGCINC60LDQu9C10L3QtNCw0YDQvdC+0LPQviDQtNC90Y9cclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fSAgIEhUTUwg0Y3Qu9C10LzQtdC90YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRnZXREYXlCeURhdGUgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCB0aW1lID0gZGF0ZSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlLmdldFRpbWUoKSA6IDA7XHJcbiAgICByZXR1cm4gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuRGF5W2RhdGEtdGltZT1cIicgKyB0aW1lICsgJ1wiXScpO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC00L3RjyAtINC30LDQs9C70YPRiNC60LhcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVFbXB0eURheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgJGRheSA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5IGlzLWVtcHR5XCI+PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gJGRheTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7Qt9C00LDQvdC40LUg0Y3Qu9C10LzQtdC90YLQsCDQuNC3IEhUTUwg0YLQtdC60YHRgtCwXHJcbiAqIEBwYXJhbSAge1N0cmluZ30gaHRtbCBIVE1MINGC0LXQutGB0YJcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24oaHRtbCkge1xyXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkaXYuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgaHRtbCk7XHJcbiAgICByZXR1cm4gZGl2LmNoaWxkcmVuLmxlbmd0aCA+IDEgPyBkaXYuY2hpbGRyZW4gOiBkaXYuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTYWZlINCy0YvQt9C+0LIg0LLQvdC10YjQvdC40YUg0YHQvtCx0YvRgtC40Lkg0LrQvtC80L/QvtC90LXQvdGC0LBcclxuICogQHBhcmFtIHtTdHJpbmd9IGYg0JjQvNGPINGB0L7QsdGL0YLQuNGPXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9jYWxsYmFjayA9IGZ1bmN0aW9uKGYpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uW2ZdID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm9uW2ZdLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEYXRlUmFuZ2VQaWNrZXI7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9kaXN0L2RhdGVyYW5nZXBpY2tlci5qcyIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2RlbW8vcGFnZS5zY3NzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9kZW1vL3BhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJLElBQXlEO0FBQzdEO0FBQ0EsTUFBTSxFQUtnQztBQUN0QyxDQUFDO0FBQ0Qsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQSxjQUFjLDhCQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxnQkFBZ0IsOEJBQW1CLHdCQUF3Qiw4QkFBbUI7QUFDOUUsbURBQW1ELHlDQUF5QztBQUM1RjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxpRUFBaUUsa0JBQWtCO0FBQ25GO0FBQ0EsMERBQTBELGNBQWM7QUFDeEU7QUFDQSxXQUFXO0FBQ1g7QUFD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UztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qiw4REFBVztBQUNsQzs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsImZpbGUiOiIuL2RlbW8vcGFnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiRGF0ZXJhbmdlcGlja2VyXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoKCkgPT4geyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdFwidXNlIHN0cmljdFwiO1xuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBzY29wZVxuLyoqKioqKi8gXHR2YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuLyoqKioqKi8gXHRcdFx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuLyoqKioqKi8gXHRcdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcbi8qKioqKiovIFx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuLyoqKioqKi8gXHRcdFx0XHR9XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpXG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0ICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG4vKioqKioqLyBcdFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbi8qKioqKiovIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4vKioqKioqLyBcdFx0XHR9XG4vKioqKioqLyBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG4vLyBUaGlzIGVudHJ5IG5lZWQgdG8gYmUgd3JhcHBlZCBpbiBhbiBJSUZFIGJlY2F1c2UgaXQgbmVlZCB0byBiZSBpc29sYXRlZCBhZ2FpbnN0IG90aGVyIGVudHJ5IG1vZHVsZXMuXG4oKCkgPT4ge1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL3Njc3MvaW5kZXguc2NzcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cblxufSkoKTtcblxuLy8gVGhpcyBlbnRyeSBuZWVkIHRvIGJlIHdyYXBwZWQgaW4gYW4gSUlGRSBiZWNhdXNlIGl0IG5lZWQgdG8gYmUgaXNvbGF0ZWQgYWdhaW5zdCBvdGhlciBlbnRyeSBtb2R1bGVzLlxuKCgpID0+IHtcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvanMvaW5kZXguanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKiovXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywge1xuLyogaGFybW9ueSBleHBvcnQgKi8gICBcIkxPQ0tfVU5BVkFJTEFCTEVcIjogKCkgPT4gKC8qIGJpbmRpbmcgKi8gTE9DS19VTkFWQUlMQUJMRSksXG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiTE9DS19MT0NLRURcIjogKCkgPT4gKC8qIGJpbmRpbmcgKi8gTE9DS19MT0NLRUQpLFxuLyogaGFybW9ueSBleHBvcnQgKi8gICBcImRlZmF1bHRcIjogKCkgPT4gKF9fV0VCUEFDS19ERUZBVUxUX0VYUE9SVF9fKVxuLyogaGFybW9ueSBleHBvcnQgKi8gfSk7XG4vLyDRgdC+0YHRgtC+0Y/QvdC40Y8g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9GFINC00LDRglxyXG5jb25zdCBMT0NLX1VOQVZBSUxBQkxFID0gMTtcclxuY29uc3QgTE9DS19MT0NLRUQgICAgICA9IDI7XHJcblxyXG5jb25zdCBJTkRFWF9EQVRFX0ZST00gPSAwO1xyXG5jb25zdCBJTkRFWF9EQVRFX1RPICAgPSAxO1xyXG5cclxuZnVuY3Rpb24gRGF0ZVJhbmdlUGlja2VyKCRjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgLy8g0L7RgiDQv9C+0LLRgtC+0YDQvdC+0Lkg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40LhcclxuICAgIGlmICgkY29udGFpbmVyLmluc3RhbmNlKSB7XHJcbiAgICAgICAgcmV0dXJuICRjb250YWluZXIuaW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICAkY29udGFpbmVyLmluc3RhbmNlID0gdGhpcztcclxuXHJcbiAgICB0aGlzLl8kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcclxuXHJcbiAgICAvLyDQt9C90LDRh9C10L3QuNC1INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAgICBjb25zdCBkdiA9ICh4LCB2KSA9PiB0eXBlb2YgeCA9PSAndW5kZWZpbmVkJyA/IHYgOiB4O1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IHtcclxuICAgICAgICBmaXJzdERheU9mVGhlV2VlazogZHYob3B0aW9ucy5maXJzdERheU9mVGhlV2VlaywgMSksIC8vINC/0LXRgNCy0YvQuSDQtNC10L3RjCDQvdC10LTQtdC70LgsIDAgPSDQstGBLCAxID0g0L/QvSwgLi4uXHJcbiAgICAgICAgc2luZ2xlTW9kZTogICAgICAgIGR2KG9wdGlvbnMuc2luZ2xlTW9kZSwgZmFsc2UpLCAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0Ysg0LLQvNC10YHRgtC+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgIGxvY2FsZTogICAgICAgICAgICBkdihvcHRpb25zLmxvY2FsZSwgJ3J1LVJVJyksXHJcbiAgICAgICAgbWluRGF5czogICAgICAgICAgIGR2KG9wdGlvbnMubWluRGF5cywgMSksICAgICAgICAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC00LjQsNC/0LDQt9C+0L3QtVxyXG4gICAgICAgIG1vbnRoc0NvdW50OiAgICAgICBkdihvcHRpb25zLm1vbnRoc0NvdW50LCAxMiksXHJcbiAgICAgICAgcGVyUm93OiAgICAgICAgICAgIGR2KG9wdGlvbnMucGVyUm93LCB1bmRlZmluZWQpLCAgICAvLyDQutC+0LvQuNGH0LXRgdGC0LLQviDQvNC10YHRj9GG0LXQsiDQsiDRgNGP0LTRg1xyXG4gICAgICAgIG1pbkRhdGU6ICAgICAgICAgICBkdihvcHRpb25zLm1pbkRhdGUsIG5ldyBEYXRlKCkpLCAgLy8g0LzQuNC90LjQvNCw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICAgIG1heERhdGU6ICAgICAgICAgICBkdihvcHRpb25zLm1heERhdGUsIHVuZGVmaW5lZCksXHJcbiAgICAgICAgYnJlYWtwb2ludHM6ICAgICAgIGR2KG9wdGlvbnMuYnJlYWtwb2ludHMsIHt9KSxcclxuICAgICAgICBpbnRlcm5hbElucHV0czogICAgZHYob3B0aW9ucy5pbnRlcm5hbElucHV0cywgdHJ1ZSksIC8vINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1INCy0YHRgtGA0L7QtdC90L3Ri9GFINC40L3Qv9GD0YLQvtCyXHJcbiAgICAgICAgLy8g0YHQvtCx0YvRgtC40Y9cclxuICAgICAgICBvbjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIHJhbmdlU2VsZWN0OiBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICAgICAgICBkYXlTZWxlY3Q6ICAgbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC+0LTQvdC+0Lkg0LTQsNGC0YsgKNGC0L7Qu9GM0LrQviDQv9GA0Lggc2luZ2xlTW9kZTogdHJ1ZSlcclxuICAgICAgICB9LCBvcHRpb25zLm9uIHx8IHt9KSxcclxuICAgICAgICAvLyDRhNC40LvRjNGC0YDRg9GO0YnQuNC1INC80LXRgtC+0LTRi1xyXG4gICAgICAgIGZpbHRlcjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIGxvY2tEYXlzOiAgICB0aGlzLl9maWx0ZXJMb2NrRGF5cywgICAgLy8gY2FsbGJhY2soZGF0ZSkg0YTRg9C90LrRhtC40Y8g0LHQu9C+0LrQuNGA0L7QstCw0L3QuNGPINC00LDRgiwgdHJ1ZS9MT0NLXHJcbiAgICAgICAgICAgIHRvb2x0aXBUZXh0OiB0aGlzLl9maWx0ZXJUb29sdGlwVGV4dCwgLy8gY2FsbGJhY2soZGF5cykg0LLRi9Cy0L7QtCDRgtC10LrRgdGC0LAg0L/QvtC00YHQutCw0LfQutC4XHJcbiAgICAgICAgfSwgb3B0aW9ucy5maWx0ZXIgfHwge30pLFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0YDRj9C00L3QvtGB0YLRjFxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGVyUm93ID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnBlclJvdyA9IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMubWluRGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtC/0YbQuNC4INC00LvRjyDRjdC60YDQsNC90L7QsiDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW3RoaXMuX2JyZWFrcG9pbnQgPSAwXSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyk7XHJcblxyXG4gICAgLy8g0YLQtdC60YPRidC40Lkg0LTQtdC90YxcclxuICAgIHRoaXMuX3RvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIHRoaXMuX3RvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIHRoaXMuXyRwaWNrZXIgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlclwiPlxyXG4gICAgICAgICAgICAke3RoaXMub3B0aW9ucy5pbnRlcm5hbElucHV0cyA/XHJcbiAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9faW5wdXRzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJHt0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkYXRlXCI+YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkYXRlX2Zyb21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV90b1wiPmBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5gIDogJydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX19tb250aHNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcC1jb250ZW50XCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgLy8g0Y3Qu9C10LzQtdC90YLRi1xyXG4gICAgdGhpcy5fJG1vbnRocyAgICAgICAgID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX19tb250aHMnKTtcclxuICAgIHRoaXMuXyR0b29sdGlwICAgICAgICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcCcpO1xyXG4gICAgdGhpcy5fJHRvb2x0aXBDb250ZW50ID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX190b29sdGlwLWNvbnRlbnQnKTtcclxuXHJcbiAgICAvLyDQv9C+0LvRjyDQstCy0L7QtNCwXHJcbiAgICB0aGlzLl8kaW5wdXRzID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lXj1cImRhdGVcIl0nKTtcclxuXHJcbiAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG5cclxuICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgdGhpcy5fc2VsZWN0RGF0ZSh0aGlzLm9wdGlvbnMubWluRGF0ZSk7XHJcbiAgICB0aGlzLl8kY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuXyRwaWNrZXIpO1xyXG5cclxuICAgIC8vINC+0LHRgNCw0LHQvtGC0LrQsCDQsdGA0LXQudC60L/QvtC40L3RgtC+0LJcclxuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHMpLmxlbmd0aCkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9vbldpbmRvd1Jlc2l6ZUV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuX29uV2luZG93UmVzaXplRXZlbnQoKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCd0LDQt9Cy0LDQvdC40LUg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0TW9udGhGb3JtYXR0ZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCB0aXRsZSA9IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge21vbnRoOiAnbG9uZyd9KTtcclxuICAgIHJldHVybiB0aXRsZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpICsgdGl0bGUuc2xpY2UoMSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INC00LDRgtGLINC00LvRjyDRgtC10LrRg9GJ0LXQuSDQu9C+0LrQsNC70LhcclxuICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAgINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMg0J/QsNGA0LDQvNC10YLRgNGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZVRpbWVGb3JtYXQgPSBmdW5jdGlvbihkYXRlLCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gSW50bC5EYXRlVGltZUZvcm1hdCh0aGlzLm9wdGlvbnMubG9jYWxlLCBvcHRpb25zKS5mb3JtYXQoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQlNC90Lgg0L3QtdC00LXQu9C4XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldFdlZWtEYXlzRm9ybWF0dGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIDIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyArK2kpIHtcclxuICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgIGRheTogZGF0ZS5nZXREYXkoKSxcclxuICAgICAgICAgICAgdGl0bGU6IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge3dlZWtkYXk6ICdzaG9ydCd9KSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0YDRgtC40YDQvtCy0LrQsCDRgdC+0LPQu9Cw0YHQvdC+INC90LDRgdGC0YDQvtC10L3QvdC+0LzRgyDQv9C10YDQstC+0LzRgyDQtNC90Y4g0L3QtdC00LXQu9C4XHJcbiAgICByZXN1bHQuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpcnN0RGF5T2ZUaGVXZWVrID0gdGhpcy5vcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrICUgNztcclxuICAgICAgICBsZXQgZGF5QSA9IGEuZGF5O1xyXG4gICAgICAgIGxldCBkYXlCID0gYi5kYXk7XHJcblxyXG4gICAgICAgIGlmIChkYXlBID09IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlCID09IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUEgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICBkYXlBICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QiA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIGRheUIgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkYXlBIC0gZGF5QjtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuSDQsiDQvNC10YHRj9GG0LVcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7TnVtYmVyfSAgICDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXlzQ291bnRJbk1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXlzLnNldE1vbnRoKGRheXMuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgZGF5cy5zZXREYXRlKDApO1xyXG4gICAgcmV0dXJuIGRheXMuZ2V0RGF0ZSgpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucmFuZ2VSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxSZXNldCgpO1xyXG4gICAgdGhpcy5fc2VsZWN0aW9uID0ge307XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktGL0LTQtdC70LXQvdC40LUg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5yYW5nZVNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAvLyDQtNC+0L/Rg9GB0YLQuNC80YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUoZGF0ZV9mcm9tLCBkYXRlX3RvKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICBjb25zdCAkZGF5X3RvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuXHJcbiAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdChkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG5cclxuICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LVcclxuICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtCx0L3QvtCy0LvQtdC90LjQtSDQuNC90L/Rg9GC0L7QslxyXG4gICAgaWYgKHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9GUk9NXSkge1xyXG4gICAgICAgIHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9GUk9NXS52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfVE9dKSB7XHJcbiAgICAgICAgdGhpcy5fJGlucHV0c1tJTkRFWF9EQVRFX1RPXS52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0LHRi9GC0LjQtVxyXG4gICAgdGhpcy5fY2FsbGJhY2soJ3JhbmdlU2VsZWN0JywgZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0YtcclxuICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge1N0cmluZ30gZm9ybWF0INCk0L7RgNC80LDRgiDRgdGC0YDQvtC60LhcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSwgZm9ybWF0ID0gJ1ktbS1kJykge1xyXG4gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlKCdZJywgZGF0ZS5nZXRGdWxsWWVhcigpKVxyXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdtJywgKCcwJyArIChkYXRlLmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpKVxyXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdkJywgKCcwJyArIChkYXRlLmdldERhdGUoKSkpLnNsaWNlKC0yKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0L7QstC10YDQutCwINCy0L7Qt9C80L7QttC90L7RgdGC0Lgg0LLRi9C00LXQu9C10L3QuNGPINC00LDRglxyXG4gKiBAcGFyYW0gIHtEYXRlIGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtICB7RGF0ZSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRJc1JhbmdlU2VsZWN0YWJsZSA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoZGF0ZV9mcm9tLmdldFRpbWUoKSAtIGRhdGVfdG8uZ2V0VGltZSgpKSAvIDEwMDAgLyA4NjQwMDtcclxuICAgIGlmIChkaWZmIDwgdGhpcy5vcHRpb25zLm1pbkRheXMpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQv9C+0L/QsNC00LDQvdC40Y8g0LIg0LTQuNCw0L/QsNC30L7QvSDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbiAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgZGF5LnNldFRpbWUoZGF0ZV9mcm9tLmdldFRpbWUoKSk7XHJcblxyXG4gICAgd2hpbGUgKGRheSA8IGRhdGVfdG8pIHtcclxuICAgICAgICBpZiAodGhpcy5nZXREYXlMb2NrZWQoZGF5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkYXkuc2V0RGF0ZShkYXkuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0L7QstC10YDQutCwINC90LAg0LTQvtGB0YLRg9C/0L3QvtGB0YLRjCDQtNC90Y8g0LTQu9GPINCx0YDQvtC90LhcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgIHRydWUg0LXRgdC70Lgg0LTQvtGB0YLRg9C/0LXQvVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXlMb2NrZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQstC90LUg0LTQvtGB0YLRg9C/0L3QvtCz0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlIHx8IGRhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBMT0NLX1VOQVZBSUxBQkxFO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmlsdGVyLmxvY2tEYXlzLmNhbGwodGhpcywgZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktGL0LHRgNCw0L3QvdCw0Y8g0L3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEByZXR1cm4ge0RhdGV9INCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGVGcm9tID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyDQvdCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LAg0L3QtSDRg9C60LDQt9Cw0L3QsFxyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC90LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsCDQv9C+0LfQttC1INC60L7QvdC10YfQvdC+0LlcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tID4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG87XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb207XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktGL0LHRgNCw0L3QvdCw0Y8g0LTQsNGC0LAgKHNpbmdsZU1vZGU6IHRydWUpXHJcbiAqIEByZXR1cm4ge0RhdGV9INCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGUgPSBEYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGVGcm9tO1xyXG5cclxuLyoqXHJcbiAqINCS0YvQsdGA0LDQvdC90LDRjyDQutC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqIEByZXR1cm4ge0RhdGV9INCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGVUbyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0LrQvtC90LXRh9C90LDRjyDQtNCw0YLQsCDQvdC1INGD0LrQsNC30LDQvdCwXHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC90LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsCDQv9C+0LfQttC1INC60L7QvdC10YfQvdC+0LlcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bztcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0LrQu9C+0L3QtdC90LjQtSAoMSDQsdC+0LHRkdGALCAyINCx0L7QsdGA0LAsIDUg0LHQvtCx0YDQvtCyKVxyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IHZhbHVlINCa0L7Qu9C40YfQtdGB0YLQstC+XHJcbiAqIEBwYXJhbSAge0FycmF5fSAgZm9ybXMg0JzQsNGB0YHQuNCyINC40LcgM9GFINGN0LvQtdC80LXQvdGC0L7Qsiwg0LzQvtC20LXRgiDRgdC+0LTQtdGA0LbQsNGC0Ywg0YHQv9C10YbQuNGE0LjQutCw0YLQvtGAICVkINC00LvRjyDQt9Cw0LzQtdC90YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5wbHVyYWwgPSBmdW5jdGlvbiAodmFsdWUsIGZvcm1zKSB7XHJcbiAgICByZXR1cm4gKHZhbHVlICUgMTAgPT0gMSAmJiB2YWx1ZSAlIDEwMCAhPSAxMSA/IGZvcm1zWzBdIDogKHZhbHVlICUgMTAgPj0gMiAmJiB2YWx1ZSAlIDEwIDw9IDQgJiYgKHZhbHVlICUgMTAwIDwgMTAgfHwgdmFsdWUgJSAxMDAgPj0gMjApID8gZm9ybXNbMV0gOiBmb3Jtc1syXSkpLnJlcGxhY2UoJyVkJywgdmFsdWUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC00LjQsNC/0LDQt9C+0L3QsCDQvNC10YHRj9GG0LXQslxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVNb250aHMgPSBmdW5jdGlvbihkYXRlX2Zyb20pIHtcclxuICAgIHdoaWxlICh0aGlzLl8kbW9udGhzLmxhc3RFbGVtZW50Q2hpbGQpIHtcclxuICAgICAgICB0aGlzLl8kbW9udGhzLnJlbW92ZUNoaWxkKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/RgNGP0YfQtdC8INC/0L7QtNGB0LrQsNC30LrRg1xyXG4gICAgdGhpcy5fdG9vbHRpcEhpZGUoKTtcclxuXHJcbiAgICAvLyDQv9GA0LXRgNC10L3QtNC10YAg0LzQtdGB0Y/RhtC10LJcclxuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoZGF0ZV9mcm9tLmdldFRpbWUoKSk7XHJcbiAgICBjb25zdCAkbW9udGhzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDsgKytpKSB7XHJcbiAgICAgICAgJG1vbnRocy5wdXNoKHRoaXMuXyRjcmVhdGVNb250aChjdXJyZW50RGF0ZSkpO1xyXG4gICAgICAgIGN1cnJlbnREYXRlLnNldE1vbnRoKGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YBcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJG1vbnRocy5sZW5ndGg7IGkgKz0gdGhpcy5vcHRpb25zLnBlclJvdykge1xyXG4gICAgICAgIGNvbnN0ICRyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAkcm93LmNsYXNzTmFtZSA9ICdEYXRlcmFuZ2VwaWNrZXJfX3Jvdyc7XHJcblxyXG4gICAgICAgICRtb250aHMuc2xpY2UoaSwgaSArIHRoaXMub3B0aW9ucy5wZXJSb3cpLmZvckVhY2goJG1vbnRoID0+IHtcclxuICAgICAgICAgICAgJHJvdy5hcHBlbmRDaGlsZCgkbW9udGgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl8kbW9udGhzLmFwcGVuZENoaWxkKCRyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUg0JzQtdGB0Y/RhlxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZU1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgY3VycmVudE1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xyXG4gICAgY29uc3QgbW9udGhUaXRsZSA9IHRoaXMuZ2V0TW9udGhGb3JtYXR0ZWQoZGF0ZSk7XHJcbiAgICBjb25zdCB3ZWVrRGF5cyA9IHRoaXMuZ2V0V2Vla0RheXNGb3JtYXR0ZWQoKTtcclxuXHJcbiAgICBjb25zdCAkbW9udGggPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIk1vbnRoXCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fYXJyb3cgTW9udGhfX2Fycm93LS1wcmV2JHsodGhpcy5vcHRpb25zLm1pbkRhdGUgJiYgZGF0ZSA8PSB0aGlzLm9wdGlvbnMubWluRGF0ZSkgPyAnIGlzLWRpc2FibGVkJyA6ICcnfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk03IDEzTDEgN0w3IDFcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX190aXRsZVwiPiR7bW9udGhUaXRsZX0gJHtkYXRlLmdldEZ1bGxZZWFyKCl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tbmV4dCR7KHRoaXMub3B0aW9ucy5tYXhEYXRlICYmIGRhdGUgPj0gdGhpcy5vcHRpb25zLm1heERhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMSAwLjk5OTk5OUw3IDdMMSAxM1wiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtcIj4ke3dlZWtEYXlzLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrZGF5XCI+JHtpdGVtLnRpdGxlfTwvZGl2PmBcclxuICAgICAgICAgICAgfSkuam9pbignJyl9PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fZGF5c1wiPjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgLy8g0YHRgtGA0LXQu9C60LhcclxuICAgIFtcclxuICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1wcmV2JywgbmFtZTogJ3ByZXYnfSxcclxuICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1uZXh0JywgbmFtZTogJ25leHQnfSxcclxuICAgIF0uZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICBjb25zdCAkYXJyb3cgPSAkbW9udGgucXVlcnlTZWxlY3RvcihpdGVtLnNlbGVjdG9yKTtcclxuICAgICAgICAkYXJyb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICAgICAgLy8g0LLRgNC10LzQtdC90L3QsNGPINC80LXRgNCwLCDQu9GD0YfRiNC1INC/0LXRgNC10LLQtdGA0YHRgtCw0YLRjCwg0LLRi9C90LXRgdGC0Lgg0YHRgtGA0LXQu9C60Lgg0LfQsCDQv9GA0LXQtNC10LvRiyDQv9C10YDQtdGA0LXRgNC40YHQvtCy0YvQstCw0LXQvNC+0Lkg0L7QsdC70LDRgdGC0Lgg0L/QuNC60LXRgNCwXHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9vbkFycm93Q2xpY2soJGFycm93LCBpdGVtLm5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAINC00L3QtdC5XHJcbiAgICBjb25zdCAkZGF5cyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKCcuTW9udGhfX2RheXMnKTtcclxuICAgIGNvbnN0IGRheXMgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICBkYXlzLnNldERhdGUoMSk7XHJcbiAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIHdoaWxlIChkYXlzLmdldE1vbnRoKCkgPT0gY3VycmVudE1vbnRoKSB7XHJcbiAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlV2VlaygpO1xyXG5cclxuICAgICAgICB3ZWVrRGF5cy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBpZiAoZGF5cy5nZXREYXkoKSAhPSBpdGVtLmRheSB8fCBkYXlzLmdldE1vbnRoKCkgIT0gY3VycmVudE1vbnRoKSB7XHJcbiAgICAgICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRW1wdHlEYXkoKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVEYXkoZGF5cykpO1xyXG4gICAgICAgICAgICBkYXlzLnNldERhdGUoZGF5cy5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJGRheXMuYXBwZW5kQ2hpbGQoJHdlZWspO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAkbW9udGg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC70LjQuiDQv9C+INGB0YLRgNC10LvQutC1INC/0LXRgNC10LrQu9GO0YfQtdC90LjRjyDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtFbGVtZW50fSAkYXJyb3cgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAgICDQmNC80Y8gKHByZXYsIG5leHQpXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkFycm93Q2xpY2sgPSBmdW5jdGlvbigkYXJyb3csIG5hbWUpIHtcclxuICAgIGlmICgkYXJyb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShwYXJzZUludCh0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aCcpLmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgKG5hbWUgPT0gJ3ByZXYnID8gLXRoaXMub3B0aW9ucy5tb250aHNDb3VudCA6IHRoaXMub3B0aW9ucy5tb250aHNDb3VudCkpO1xyXG5cclxuICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNC40L3QuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRUaW1lKHRoaXMub3B0aW9ucy5taW5EYXRlLmdldFRpbWUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LDQutGB0LjQvNCw0LvRjNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgY29uc3QgZW5kRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBlbmREYXRlLnNldE1vbnRoKGVuZERhdGUuZ2V0TW9udGgoKSArIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCk7XHJcbiAgICAgICAgaWYgKGVuZERhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1heERhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgLSB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/QtdGA0LXRhdC+0LQg0Log0L3QvtCy0L7QuSDQtNCw0YLQtVxyXG4gICAgdGhpcy5fc2VsZWN0RGF0ZShkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQuSDQtNCw0YLRiyDRgSDRgNC10L3QtNC10YDQvtC8XHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fc2VsZWN0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIHRoaXMuX3NlbGVjdGVkRGF0ZSA9IGRhdGU7XHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGhzKGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC90LXQtNC10LvQuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZVdlZWsgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiV2Vla1wiPjwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuICR3ZWVrO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC00L3Rj1xyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZURheSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRheVwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCIgZGF0YS1kYXk9XCIke2RhdGUuZ2V0RGF5KCl9XCI+JHtkYXRlLmdldERhdGUoKX08L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkRheUNsaWNrRXZlbnQuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZSkge1xyXG4gICAgICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC+0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gICAgdGhpcy5fdXBkYXRlRGF5KCRkYXkpO1xyXG5cclxuICAgIHJldHVybiAkZGF5O1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuTW9udGgnKS5mb3JFYWNoKCRtb250aCA9PiB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlTW9udGgoJG1vbnRoKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5INC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRtb250aCDQrdC70LXQvNC10L3RgiDQvNC10YHRj9GG0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3VwZGF0ZU1vbnRoID0gZnVuY3Rpb24oJG1vbnRoKSB7XHJcbiAgICAkbW9udGgucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJykuZm9yRWFjaCgkZGF5ID0+IHtcclxuICAgICAgICB0aGlzLl91cGRhdGVEYXkoJGRheSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuSDQtNC90Y9cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5INCt0LvQtdC80LXQvdGCINC00L3Rj1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdXBkYXRlRGF5ID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgY29uc3QgZGF0ZSAgID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICBjb25zdCBsb2NrZWQgPSB0aGlzLmdldERheUxvY2tlZChkYXRlKTtcclxuICAgIGNvbnN0IHRvZGF5ICA9IHRoaXMuX3RvZGF5LmdldFRpbWUoKSA9PSBkYXRlLmdldFRpbWUoKTtcclxuXHJcbiAgICAkZGF5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLWRpc2FibGVkJywgbG9ja2VkKTtcclxuICAgICRkYXkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtbG9ja2VkJywgbG9ja2VkID09IExPQ0tfTE9DS0VEKTtcclxuICAgICRkYXkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtdG9kYXknLCB0b2RheSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDQutC70LjQutCwINC/0L4g0LTQvdGOXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheUNsaWNrRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICB0aGlzLl9vbkRheUNsaWNrKGUudGFyZ2V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INGF0L7QstC10YDQsFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlNb3VzZUVudGVyRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICB0aGlzLl9vbkRheU1vdXNlRW50ZXIoZS50YXJnZXQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KXQvtCy0LXRgCDQvdCwINGN0LvQtdC80LXQvdGC0LUg0LTQvdGPXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheU1vdXNlRW50ZXIgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXkuZGF0YXNldC50aW1lID09IHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20uZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG59XHJcblxyXG4vKipcclxuICog0JrQu9C40Log0L/QviDQtNC90Y5cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5Q2xpY2sgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICAvLyDQtNC10L3RjCDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L1cclxuICAgIGlmICgkZGF5LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZSkge1xyXG4gICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKVxyXG4gICAgICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFjaygnZGF5U2VsZWN0JywgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0LHRgNC+0YEg0LLRi9Cx0YDQsNC90L3QvtCz0L4g0YDQsNC90LXQtSDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG5cclxuICAgIC8vINCy0YvQsdGA0LDQvdCwINC90LDRh9Cw0LvRjNC90LDRjyAvINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJhbmdlU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LjQt9GD0LDQu9GM0L3Ri9C5INGB0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICAkZGF5cy5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgICRkYXkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScsICdpcy1zZWxlY3RlZC10bycsICdpcy1zZWxlY3RlZC1iZXR3ZWVuJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQv9GA0Y/Rh9C10Lwg0L/QvtC00YHQutCw0LfQutGDXHJcbiAgICB0aGlzLl90b29sdGlwSGlkZSgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JLQuNC30YPQsNC70YzQvdC+0LUg0LLRi9C00LXQu9C10L3QuNC1INC00LDRglxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fcmFuZ2VWaXN1YWxTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGlmIChkYXRlX2Zyb20gJiYgZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0ZV90byAmJiBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHRpbWVfZnJvbSA9IGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX2Zyb20uZ2V0VGltZSgpIDogMDtcclxuICAgIGxldCB0aW1lX3RvID0gZGF0ZV90byBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX3RvLmdldFRpbWUoKSA6IDA7XHJcbiAgICBpZiAodGltZV9mcm9tID4gdGltZV90bykge1xyXG4gICAgICAgIFt0aW1lX2Zyb20sIHRpbWVfdG9dID0gW3RpbWVfdG8sIHRpbWVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC00LDRgiDQvNC10LbQtNGDINC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRkYXlzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgJGRheXNbaV0uY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2VsZWN0ZWQtYmV0d2VlbicsICRkYXlzW2ldLmRhdGFzZXQudGltZSA+IHRpbWVfZnJvbSAmJiAkZGF5c1tpXS5kYXRhc2V0LnRpbWUgPCB0aW1lX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0Lkg0L/QvtC30LjRhtC40LhcclxuICAgIGNvbnN0ICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICE9ICRkYXlfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgIT0gJGRheV90bykge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtGF0YDQsNC90LXQvdC40LUg0LIg0LrQtdGIXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkID0gJGRheV9mcm9tO1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgPSAkZGF5X3RvO1xyXG5cclxuICAgIHRoaXMuX3NlbGVjdGlvbi4kZGF5X2Zyb20gPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24uJGRheV90byA9ICRkYXlfdG87XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICBjb25zdCBkYXlzID0gTWF0aC5mbG9vcihNYXRoLmFicyh0aW1lX2Zyb20gLSB0aW1lX3RvKSAvIDg2NDAwZTMpICsgMTtcclxuICAgICAgICB0aGlzLl90b29sdGlwU2hvdygkZGF5X3RvLCBkYXlzKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCf0L7QutCw0Lcg0L/QvtC00YHQutCw0LfQutC4XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQktGL0LHRgNCw0L3QvdGL0Lkg0LTQtdC90YxcclxuICogQHBhcmFtIHtOdW1iZXJ9ICBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwU2hvdyA9IGZ1bmN0aW9uKCRkYXksIGRheXMpIHtcclxuICAgIHRoaXMuXyR0b29sdGlwQ29udGVudC50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5maWx0ZXIudG9vbHRpcFRleHQuY2FsbCh0aGlzLCBkYXlzKSB8fCAnJztcclxuICAgIHRoaXMuXyR0b29sdGlwLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXNob3cnLCB0aGlzLl8kdG9vbHRpcC50ZXh0Q29udGVudC5sZW5ndGgpO1xyXG4gICAgdGhpcy5fdG9vbHRpcFVwZGF0ZSgkZGF5KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INC/0L7Qt9C40YbQuNC4INC/0L7QtNGB0LrQsNC30LrQuFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkg0JLRi9Cx0YDQsNC90L3Ri9C5INC00LXQvdGMXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwVXBkYXRlID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgbGV0IHggPSAwO1xyXG4gICAgbGV0IHkgPSAwO1xyXG4gICAgbGV0ICRlbCA9ICRkYXk7XHJcbiAgICBkbyB7XHJcbiAgICAgICAgeSArPSAkZWwub2Zmc2V0VG9wO1xyXG4gICAgICAgIHggKz0gJGVsLm9mZnNldExlZnQ7XHJcbiAgICB9IHdoaWxlICgoJGVsID0gJGVsLm9mZnNldFBhcmVudCkgJiYgJGVsICE9IHRoaXMuXyRwaWNrZXIpO1xyXG5cclxuICAgIHRoaXMuXyR0b29sdGlwLnN0eWxlLnRvcCA9IE1hdGgucm91bmQoeSAtIHRoaXMuXyR0b29sdGlwLm9mZnNldEhlaWdodCkgKyAncHgnO1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUubGVmdCA9IE1hdGgucm91bmQoeCArICRkYXkub2Zmc2V0V2lkdGggLyAyIC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0V2lkdGggLyAyKSArICdweCc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60YDRi9GC0Ywg0L/QvtC00YHQutCw0LfQutGDXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwSGlkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2hvdycpO1xyXG59XHJcblxyXG4vKipcclxuICog0KLQtdC60YHRgiDQv9C+0LTRgdC60LDQt9C60Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICogQHBhcmFtICB7TnVtYmVyfSBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2ZpbHRlclRvb2x0aXBUZXh0ID0gZnVuY3Rpb24oZGF5cykge1xyXG4gICAgcmV0dXJuIHRoaXMucGx1cmFsKGRheXMsIFsnJWQg0LTQtdC90YwnLCAnJWQg0LTQvdGPJywgJyVkINC00L3QtdC5J10pLnJlcGxhY2UoJyVkJywgZGF5cyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNC40LvRjNGC0YAg0L3QtdC00L7RgdGC0YPQv9C90YvRhSDQtNC90LXQuSDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fZmlsdGVyTG9ja0RheXMgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINCy0YHQtSDQtNC90Lgg0LTQvtGB0YLRg9C/0L3Ri1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0LjQt9C80LXQvdC10L3QuNGPINGA0LDQt9C80LXRgNC+0LIg0L7QutC90LBcclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uV2luZG93UmVzaXplRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLiRkYXlfdG8pIHtcclxuICAgICAgICB0aGlzLl90b29sdGlwVXBkYXRlKHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYnJlYWtwb2ludCA9IDA7XHJcbiAgICBjb25zdCBicmVha3BvaW50cyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xyXG4gICAgZm9yIChsZXQgaSBpbiBicmVha3BvaW50cykge1xyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSBicmVha3BvaW50c1tpXSkge1xyXG4gICAgICAgICAgICBicmVha3BvaW50ID0gYnJlYWtwb2ludHNbaV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9zZXRCcmVha3BvaW50KGJyZWFrcG9pbnQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGB0L7RgdGC0L7Rj9C90LjRjyDRgNC10L3QtNC10YDQsCDQv9C+0LQg0YDQsNC30L3Ri9C1INGN0LrRgNCw0L3Ri1xyXG4gKiBAcGFyYW0ge051bWJlcn0gYnJlYWtwb2ludCDQmtC70Y7RhyDQuNC3IHRoaXMub3B0aW9ucy5icmVha3BvaW50cyAo0KjQuNGA0LjQvdCwINGN0LrRgNCw0L3QsClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3NldEJyZWFrcG9pbnQgPSBmdW5jdGlvbihicmVha3BvaW50KSB7XHJcbiAgICAvLyDQvtGCINC90LXQvdGD0LbQvdC+0Lkg0L/QtdGA0LXRgNC40YHQvtCy0LrQuFxyXG4gICAgaWYgKHRoaXMuX2JyZWFrcG9pbnQgPT0gYnJlYWtwb2ludCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuX2JyZWFrcG9pbnQgPSBicmVha3BvaW50O1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCB0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pO1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRocyh0aGlzLl9zZWxlY3RlZERhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0K3Qu9C10LzQtdC90YIg0LrQsNC70LXQvdC00LDRgNC90L7Qs9C+INC00L3Rj1xyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9ICAgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGdldERheUJ5RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpbWUgPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogMDtcclxuICAgIHJldHVybiB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5EYXlbZGF0YS10aW1lPVwiJyArIHRpbWUgKyAnXCJdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPIC0g0LfQsNCz0LvRg9GI0LrQuFxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVtcHR5RGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXkgaXMtZW1wdHlcIj48L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkZGF5O1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwINC40LcgSFRNTCDRgtC10LrRgdGC0LBcclxuICogQHBhcmFtICB7U3RyaW5nfSBodG1sIEhUTUwg0YLQtdC60YHRglxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XHJcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgIHJldHVybiBkaXYuY2hpbGRyZW4ubGVuZ3RoID4gMSA/IGRpdi5jaGlsZHJlbiA6IGRpdi5maXJzdEVsZW1lbnRDaGlsZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNhZmUg0LLRi9C30L7QsiDQstC90LXRiNC90LjRhSDRgdC+0LHRi9GC0LjQuSDQutC+0LzQv9C+0L3QtdC90YLQsFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZiDQmNC80Y8g0YHQvtCx0YvRgtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2NhbGxiYWNrID0gZnVuY3Rpb24oZikge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25bZl0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub25bZl0uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm47XHJcbn1cclxuXHJcbi8qIGhhcm1vbnkgZGVmYXVsdCBleHBvcnQgKi8gY29uc3QgX19XRUJQQUNLX0RFRkFVTFRfRVhQT1JUX18gPSAoRGF0ZVJhbmdlUGlja2VyKTtcclxuXG59KSgpO1xuXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfZXhwb3J0c19fO1xuLyoqKioqKi8gfSkoKVxuO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbmRsWW5CaFkyczZMeTlrWVhSbGNtRnVaMlZ3YVdOclpYSXZkMlZpY0dGamF5OTFibWwyWlhKellXeE5iMlIxYkdWRVpXWnBibWwwYVc5dUlpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOTNaV0p3WVdOckwySnZiM1J6ZEhKaGNDSXNJbmRsWW5CaFkyczZMeTlrWVhSbGNtRnVaMlZ3YVdOclpYSXZkMlZpY0dGamF5OXlkVzUwYVcxbEwyUmxabWx1WlNCd2NtOXdaWEowZVNCblpYUjBaWEp6SWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k5M1pXSndZV05yTDNKMWJuUnBiV1V2YUdGelQzZHVVSEp2Y0dWeWRIa2djMmh2Y25Sb1lXNWtJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTkzWldKd1lXTnJMM0oxYm5ScGJXVXZiV0ZyWlNCdVlXMWxjM0JoWTJVZ2IySnFaV04wSWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k4dUwzTnlZeTl6WTNOekwybHVaR1Y0TG5OamMzTWlMQ0ozWldKd1lXTnJPaTh2WkdGMFpYSmhibWRsY0dsamEyVnlMeTR2YzNKakwycHpMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEVOQlFVTTdRVUZEUkN4UE96dFZRMVpCTzFWQlEwRTdPenM3TzFkRFJFRTdWMEZEUVR0WFFVTkJPMWRCUTBFN1YwRkRRU3gzUTBGQmQwTXNlVU5CUVhsRE8xZEJRMnBHTzFkQlEwRTdWMEZEUVN4Rk96czdPenRYUTFCQkxIZEdPenM3T3p0WFEwRkJPMWRCUTBFN1YwRkRRVHRYUVVOQkxITkVRVUZ6UkN4clFrRkJhMEk3VjBGRGVFVTdWMEZEUVN3clEwRkJLME1zWTBGQll6dFhRVU0zUkN4Rk96czdPenM3T3pzN096czdRVU5PUVRzN096czdPenM3T3pzN096czdPMEZEUVVFN1FVRkRUenRCUVVOQk96dEJRVVZRTzBGQlEwRTdPMEZCUlVFc2FVUkJRV2xFTzBGQlEycEVPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeHhSRUZCY1VRN1FVRkRja1E3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRk5CUVZNc2EwSkJRV3RDTzBGQlF6TkNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzVTBGQlV5eHpRa0ZCYzBJN1FVRkRMMEk3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJMSEZGUVVGeFJUczdRVUZGY2tVN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4alFVRmpPMEZCUTJRN1FVRkRRU3h6UWtGQmMwSTdRVUZEZEVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WlFVRlpMRXRCUVVzN1FVRkRha0lzV1VGQldUdEJRVU5hTzBGQlEwRTdRVUZEUVN4blJFRkJaMFFzWTBGQll6dEJRVU01UkR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTEV0QlFVczdRVUZEYWtJc1dVRkJXU3hQUVVGUE8wRkJRMjVDTEZsQlFWazdRVUZEV2p0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFTeHRRa0ZCYlVJc1QwRkJUenRCUVVNeFFqdEJRVU5CTzBGQlEwRTdRVUZEUVN4cFJFRkJhVVFzYVVKQlFXbENPMEZCUTJ4RkxGTkJRVk03UVVGRFZEczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJMRXRCUVVzN08wRkJSVXc3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJXU3hMUVVGTE8wRkJRMnBDTEZsQlFWa3NUMEZCVHp0QlFVTnVRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEV0QlFVczdRVUZEYUVJc1YwRkJWeXhMUVVGTE8wRkJRMmhDTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZsQlFWa3NTMEZCU3p0QlFVTnFRaXhaUVVGWkxFOUJRVTg3UVVGRGJrSXNXVUZCV1R0QlFVTmFPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJXVHRCUVVOYUxGbEJRVms3UVVGRFdpeFpRVUZaTzBGQlExbzdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJXU3hMUVVGTE8wRkJRMnBDTEZsQlFWa3NVVUZCVVR0QlFVTndRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCV1N4TFFVRkxPMEZCUTJwQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTEV0QlFVczdRVUZEYWtJN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCV1N4TFFVRkxPMEZCUTJwQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTEU5QlFVODdRVUZEYmtJc1dVRkJXU3hOUVVGTk8wRkJRMnhDTEZsQlFWazdRVUZEV2p0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNWMEZCVnl4TFFVRkxPMEZCUTJoQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4dFFrRkJiVUlzT0VKQlFUaENPMEZCUTJwRU8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJMRzFDUVVGdFFpeHZRa0ZCYjBJN1FVRkRka003UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1UwRkJVenM3UVVGRlZEdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRXRCUVVzN1FVRkRhRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQkxIbERRVUY1UXl4bFFVRmxPMEZCUTNoRU8wRkJRMEVzTmtSQlFUWkVMRFpGUVVFMlJUdEJRVU14U1R0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxEUkRRVUUwUXl4WFFVRlhMRWRCUVVjc2JVSkJRVzFDTzBGQlF6ZEZMRFpFUVVFMlJDdzJSVUZCTmtVN1FVRkRNVWs3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMSFZEUVVGMVF6dEJRVU4yUXl4elJFRkJjMFFzVjBGQlZ6dEJRVU5xUlN4aFFVRmhMRmRCUVZjN1FVRkRlRUk3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hUUVVGVExEaERRVUU0UXp0QlFVTjJSQ3hUUVVGVExEaERRVUU0UXp0QlFVTjJSRHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFc1UwRkJVenRCUVVOVUxFdEJRVXM3TzBGQlJVdzdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRk5CUVZNN08wRkJSVlE3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEZGQlFWRTdRVUZEYmtJc1YwRkJWeXhQUVVGUE8wRkJRMnhDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEV0QlFVczdRVUZEYUVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJXU3hMUVVGTE8wRkJRMnBDTEZsQlFWazdRVUZEV2p0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVmtzUzBGQlN6dEJRVU5xUWl4WlFVRlpPMEZCUTFvN1FVRkRRVHRCUVVOQk8wRkJRMEVzZFVOQlFYVkRMR1ZCUVdVc1kwRkJZeXhqUVVGakxFbEJRVWtzWlVGQlpUdEJRVU55UnpzN1FVRkZRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEV0QlFVczdRVUZEVERzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eFJRVUZSTzBGQlEyNUNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzUzBGQlN6dEJRVU5NT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hYUVVGWExGRkJRVkU3UVVGRGJrSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eE5RVUZOTzBGQlEycENPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRTFCUVUwN1FVRkRha0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGZEJRVmNzVVVGQlVUdEJRVU51UWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1VVRkJVVHRCUVVOdVFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4TFFVRkxPMEZCUTB3N1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNTMEZCU3pzN1FVRkZURHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1MwRkJTenRCUVVOb1FpeFhRVUZYTEV0QlFVczdRVUZEYUVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzYlVKQlFXMUNMR3RDUVVGclFqdEJRVU55UXp0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGZEJRVmNzVVVGQlVUdEJRVU51UWl4WFFVRlhMRTlCUVU4N1FVRkRiRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEZGQlFWRTdRVUZEYmtJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRXRCUVVzN08wRkJSVXc3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJXU3hQUVVGUE8wRkJRMjVDTEZsQlFWazdRVUZEV2p0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCV1R0QlFVTmFPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1RVRkJUVHRCUVVOcVFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhQUVVGUE8wRkJRMnhDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1MwRkJTenRCUVVOcVFpeFpRVUZaTEZGQlFWRTdRVUZEY0VJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJXVHRCUVVOYU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCV1N4UFFVRlBPMEZCUTI1Q0xGbEJRVms3UVVGRFdqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZkQlFWY3NUMEZCVHp0QlFVTnNRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUVzYVVWQlFXVXNaVUZCWlN4RlFVRkRJaXdpWm1sc1pTSTZJbVJoZEdWeVlXNW5aWEJwWTJ0bGNpNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWlobWRXNWpkR2x2YmlCM1pXSndZV05yVlc1cGRtVnljMkZzVFc5a2RXeGxSR1ZtYVc1cGRHbHZiaWh5YjI5MExDQm1ZV04wYjNKNUtTQjdYRzVjZEdsbUtIUjVjR1Z2WmlCbGVIQnZjblJ6SUQwOVBTQW5iMkpxWldOMEp5QW1KaUIwZVhCbGIyWWdiVzlrZFd4bElEMDlQU0FuYjJKcVpXTjBKeWxjYmx4MFhIUnRiMlIxYkdVdVpYaHdiM0owY3lBOUlHWmhZM1J2Y25rb0tUdGNibHgwWld4elpTQnBaaWgwZVhCbGIyWWdaR1ZtYVc1bElEMDlQU0FuWm5WdVkzUnBiMjRuSUNZbUlHUmxabWx1WlM1aGJXUXBYRzVjZEZ4MFpHVm1hVzVsS0Z3aVJHRjBaWEpoYm1kbGNHbGphMlZ5WENJc0lGdGRMQ0JtWVdOMGIzSjVLVHRjYmx4MFpXeHpaU0JwWmloMGVYQmxiMllnWlhod2IzSjBjeUE5UFQwZ0oyOWlhbVZqZENjcFhHNWNkRngwWlhod2IzSjBjMXRjSWtSaGRHVnlZVzVuWlhCcFkydGxjbHdpWFNBOUlHWmhZM1J2Y25rb0tUdGNibHgwWld4elpWeHVYSFJjZEhKdmIzUmJYQ0pFWVhSbGNtRnVaMlZ3YVdOclpYSmNJbDBnUFNCbVlXTjBiM0o1S0NrN1hHNTlLU2h6Wld4bUxDQm1kVzVqZEdsdmJpZ3BJSHRjYm5KbGRIVnliaUFpTENJdkx5QlVhR1VnY21WeGRXbHlaU0J6WTI5d1pWeHVkbUZ5SUY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4Z1BTQjdmVHRjYmx4dUlpd2lMeThnWkdWbWFXNWxJR2RsZEhSbGNpQm1kVzVqZEdsdmJuTWdabTl5SUdoaGNtMXZibmtnWlhod2IzSjBjMXh1WDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1a0lEMGdLR1Y0Y0c5eWRITXNJR1JsWm1sdWFYUnBiMjRwSUQwK0lIdGNibHgwWm05eUtIWmhjaUJyWlhrZ2FXNGdaR1ZtYVc1cGRHbHZiaWtnZTF4dVhIUmNkR2xtS0Y5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dWJ5aGtaV1pwYm1sMGFXOXVMQ0JyWlhrcElDWW1JQ0ZmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmTG04b1pYaHdiM0owY3l3Z2EyVjVLU2tnZTF4dVhIUmNkRngwVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtHVjRjRzl5ZEhNc0lHdGxlU3dnZXlCbGJuVnRaWEpoWW14bE9pQjBjblZsTENCblpYUTZJR1JsWm1sdWFYUnBiMjViYTJWNVhTQjlLVHRjYmx4MFhIUjlYRzVjZEgxY2JuMDdJaXdpWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1dklEMGdLRzlpYWl3Z2NISnZjQ2tnUFQ0Z0tFOWlhbVZqZEM1d2NtOTBiM1I1Y0dVdWFHRnpUM2R1VUhKdmNHVnlkSGt1WTJGc2JDaHZZbW9zSUhCeWIzQXBLU0lzSWk4dklHUmxabWx1WlNCZlgyVnpUVzlrZFd4bElHOXVJR1Y0Y0c5eWRITmNibDlmZDJWaWNHRmphMTl5WlhGMWFYSmxYMTh1Y2lBOUlDaGxlSEJ2Y25SektTQTlQaUI3WEc1Y2RHbG1LSFI1Y0dWdlppQlRlVzFpYjJ3Z0lUMDlJQ2QxYm1SbFptbHVaV1FuSUNZbUlGTjViV0p2YkM1MGIxTjBjbWx1WjFSaFp5a2dlMXh1WEhSY2RFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2hsZUhCdmNuUnpMQ0JUZVcxaWIyd3VkRzlUZEhKcGJtZFVZV2NzSUhzZ2RtRnNkV1U2SUNkTmIyUjFiR1VuSUgwcE8xeHVYSFI5WEc1Y2RFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2hsZUhCdmNuUnpMQ0FuWDE5bGMwMXZaSFZzWlNjc0lIc2dkbUZzZFdVNklIUnlkV1VnZlNrN1hHNTlPeUlzSWk4dklHVjRkSEpoWTNSbFpDQmllU0J0YVc1cExXTnpjeTFsZUhSeVlXTjBMWEJzZFdkcGJseHVaWGh3YjNKMElIdDlPeUlzSWk4dklOR0IwTDdSZ2RHQzBMN1JqOUM5MExqUmp5RFF0OUN3MExIUXU5QyswTHJRdU5HQTBMN1FzdEN3MEwzUXZkR0wwWVVnMExUUXNOR0NYSEpjYm1WNGNHOXlkQ0JqYjI1emRDQk1UME5MWDFWT1FWWkJTVXhCUWt4RklEMGdNVHRjY2x4dVpYaHdiM0owSUdOdmJuTjBJRXhQUTB0ZlRFOURTMFZFSUNBZ0lDQWdQU0F5TzF4eVhHNWNjbHh1WTI5dWMzUWdTVTVFUlZoZlJFRlVSVjlHVWs5TklEMGdNRHRjY2x4dVkyOXVjM1FnU1U1RVJWaGZSRUZVUlY5VVR5QWdJRDBnTVR0Y2NseHVYSEpjYm1aMWJtTjBhVzl1SUVSaGRHVlNZVzVuWlZCcFkydGxjaWdrWTI5dWRHRnBibVZ5TENCdmNIUnBiMjV6SUQwZ2UzMHBJSHRjY2x4dUlDQWdJQzh2SU5DKzBZSWcwTC9RdnRDeTBZTFF2dEdBMEwzUXZ0QzVJTkM0MEwzUXVOR0cwTGpRc05DNzBMalF0OUN3MFliUXVOQzRYSEpjYmlBZ0lDQnBaaUFvSkdOdmJuUmhhVzVsY2k1cGJuTjBZVzVqWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQWtZMjl1ZEdGcGJtVnlMbWx1YzNSaGJtTmxPMXh5WEc0Z0lDQWdmVnh5WEc0Z0lDQWdKR052Ym5SaGFXNWxjaTVwYm5OMFlXNWpaU0E5SUhSb2FYTTdYSEpjYmx4eVhHNGdJQ0FnZEdocGN5NWZKR052Ym5SaGFXNWxjaUE5SUNSamIyNTBZV2x1WlhJN1hISmNibHh5WEc0Z0lDQWdMeThnMExmUXZkQ3cwWWZRdGRDOTBMalF0U0RRdjlDK0lOR0QwTHpRdnRDNzBZZlFzTkM5MExqUmpseHlYRzRnSUNBZ1kyOXVjM1FnWkhZZ1BTQW9lQ3dnZGlrZ1BUNGdkSGx3Wlc5bUlIZ2dQVDBnSjNWdVpHVm1hVzVsWkNjZ1B5QjJJRG9nZUR0Y2NseHVYSEpjYmlBZ0lDQjBhR2x6TG05d2RHbHZibk1nUFNCN1hISmNiaUFnSUNBZ0lDQWdabWx5YzNSRVlYbFBabFJvWlZkbFpXczZJR1IyS0c5d2RHbHZibk11Wm1seWMzUkVZWGxQWmxSb1pWZGxaV3NzSURFcExDQXZMeURRdjlDMTBZRFFzdEdMMExrZzBMVFF0ZEM5MFl3ZzBMM1F0ZEMwMExYUXU5QzRMQ0F3SUQwZzBMTFJnU3dnTVNBOUlOQy8wTDBzSUM0dUxseHlYRzRnSUNBZ0lDQWdJSE5wYm1kc1pVMXZaR1U2SUNBZ0lDQWdJQ0JrZGlodmNIUnBiMjV6TG5OcGJtZHNaVTF2WkdVc0lHWmhiSE5sS1N3Z0lDQWdMeThnMExMUmk5Q3gwTDdSZ0NEUXZ0QzAwTDNRdnRDNUlOQzAwTERSZ3RHTElOQ3kwTHpRdGRHQjBZTFF2aURRdE5DNDBMRFF2OUN3MExmUXZ0QzkwTEJjY2x4dUlDQWdJQ0FnSUNCc2IyTmhiR1U2SUNBZ0lDQWdJQ0FnSUNBZ1pIWW9iM0IwYVc5dWN5NXNiMk5oYkdVc0lDZHlkUzFTVlNjcExGeHlYRzRnSUNBZ0lDQWdJRzFwYmtSaGVYTTZJQ0FnSUNBZ0lDQWdJQ0JrZGlodmNIUnBiMjV6TG0xcGJrUmhlWE1zSURFcExDQWdJQ0FnSUNBZ0lDQWdMeThnMEx6UXVOQzkwTGpRdk5DdzBMdlJqTkM5MEw3UXRTRFF1dEMrMEx2UXVOR0gwTFhSZ2RHQzBMTFF2aURRdE5DOTBMWFF1U0RRc2lEUXROQzQwTERRdjlDdzBMZlF2dEM5MExWY2NseHVJQ0FnSUNBZ0lDQnRiMjUwYUhORGIzVnVkRG9nSUNBZ0lDQWdaSFlvYjNCMGFXOXVjeTV0YjI1MGFITkRiM1Z1ZEN3Z01USXBMRnh5WEc0Z0lDQWdJQ0FnSUhCbGNsSnZkem9nSUNBZ0lDQWdJQ0FnSUNCa2RpaHZjSFJwYjI1ekxuQmxjbEp2ZHl3Z2RXNWtaV1pwYm1Wa0tTd2dJQ0FnTHk4ZzBMclF2dEM3MExqUmg5QzEwWUhSZ3RDeTBMNGcwTHpRdGRHQjBZL1JodEMxMExJZzBMSWcwWURSajlDMDBZTmNjbHh1SUNBZ0lDQWdJQ0J0YVc1RVlYUmxPaUFnSUNBZ0lDQWdJQ0FnWkhZb2IzQjBhVzl1Y3k1dGFXNUVZWFJsTENCdVpYY2dSR0YwWlNncEtTd2dJQzh2SU5DODBMalF2ZEM0MEx6UXNOQzcwWXpRdmRDdzBZOGcwTFRRc05HQzBMQmNjbHh1SUNBZ0lDQWdJQ0J0WVhoRVlYUmxPaUFnSUNBZ0lDQWdJQ0FnWkhZb2IzQjBhVzl1Y3k1dFlYaEVZWFJsTENCMWJtUmxabWx1WldRcExGeHlYRzRnSUNBZ0lDQWdJR0p5WldGcmNHOXBiblJ6T2lBZ0lDQWdJQ0JrZGlodmNIUnBiMjV6TG1KeVpXRnJjRzlwYm5SekxDQjdmU2tzWEhKY2JpQWdJQ0FnSUNBZ2FXNTBaWEp1WVd4SmJuQjFkSE02SUNBZ0lHUjJLRzl3ZEdsdmJuTXVhVzUwWlhKdVlXeEpibkIxZEhNc0lIUnlkV1VwTENBdkx5RFF1TkdCMEwvUXZ0QzcwWXpRdDlDKzBMTFFzTkM5MExqUXRTRFFzdEdCMFlMUmdOQyswTFhRdmRDOTBZdlJoU0RRdU5DOTBML1JnOUdDMEw3UXNseHlYRzRnSUNBZ0lDQWdJQzh2SU5HQjBMN1FzZEdMMFlMUXVOR1BYSEpjYmlBZ0lDQWdJQ0FnYjI0NklFOWlhbVZqZEM1aGMzTnBaMjRvZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WVc1blpWTmxiR1ZqZERvZ2JuVnNiQ3dnTHk4ZzBZSFF2dEN4MFl2Umd0QzQwTFVnMExMUmk5Q3gwTDdSZ05Dd0lOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXNDRFF0TkN3MFlKY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWkdGNVUyVnNaV04wT2lBZ0lHNTFiR3dzSUM4dklOR0IwTDdRc2RHTDBZTFF1TkMxSU5DeTBZdlFzZEMrMFlEUXNDRFF2dEMwMEwzUXZ0QzVJTkMwMExEUmd0R0xJQ2pSZ3RDKzBMdlJqTkM2MEw0ZzBML1JnTkM0SUhOcGJtZHNaVTF2WkdVNklIUnlkV1VwWEhKY2JpQWdJQ0FnSUNBZ2ZTd2diM0IwYVc5dWN5NXZiaUI4ZkNCN2ZTa3NYSEpjYmlBZ0lDQWdJQ0FnTHk4ZzBZVFF1TkM3MFl6Umd0R0EwWVBSanRHSjBMalF0U0RRdk5DMTBZTFF2dEMwMFl0Y2NseHVJQ0FnSUNBZ0lDQm1hV3gwWlhJNklFOWlhbVZqZEM1aGMzTnBaMjRvZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JzYjJOclJHRjVjem9nSUNBZ2RHaHBjeTVmWm1sc2RHVnlURzlqYTBSaGVYTXNJQ0FnSUM4dklHTmhiR3hpWVdOcktHUmhkR1VwSU5HRTBZUFF2ZEM2MFliUXVOR1BJTkN4MEx2UXZ0QzYwTGpSZ05DKzBMTFFzTkM5MExqUmp5RFF0TkN3MFlJc0lIUnlkV1V2VEU5RFMxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGIyOXNkR2x3VkdWNGREb2dkR2hwY3k1ZlptbHNkR1Z5Vkc5dmJIUnBjRlJsZUhRc0lDOHZJR05oYkd4aVlXTnJLR1JoZVhNcElOQ3kwWXZRc3RDKzBMUWcwWUxRdGRDNjBZSFJndEN3SU5DLzBMN1F0TkdCMExyUXNOQzMwTHJRdUZ4eVhHNGdJQ0FnSUNBZ0lIMHNJRzl3ZEdsdmJuTXVabWxzZEdWeUlIeDhJSHQ5S1N4Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQjBhR2x6TG1sdWFYUW9LVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ1kwTDNRdU5HRzBMalFzTkM3MExqUXQ5Q3cwWWJRdU5HUFhISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExtbHVhWFFnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lDOHZJTkdBMFkvUXROQzkwTDdSZ2RHQzBZeGNjbHh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR2hwY3k1dmNIUnBiMjV6TG5CbGNsSnZkeUE5UFNBbmRXNWtaV1pwYm1Wa0p5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NXdaWEpTYjNjZ1BTQjBhR2x6TG05d2RHbHZibk11Ylc5dWRHaHpRMjkxYm5RN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NXRhVzVFWVhSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxtMXBia1JoZEdVdWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBMN1F2OUdHMExqUXVDRFF0TkM3MFk4ZzBZM1F1dEdBMExEUXZkQyswTElnMEwvUXZpRFJnOUM4MEw3UXU5R0gwTERRdmRDNDBZNWNjbHh1SUNBZ0lIUm9hWE11YjNCMGFXOXVjeTVpY21WaGEzQnZhVzUwYzF0MGFHbHpMbDlpY21WaGEzQnZhVzUwSUQwZ01GMGdQU0JQWW1wbFkzUXVZWE56YVdkdUtIdDlMQ0IwYUdsekxtOXdkR2x2Ym5NcE8xeHlYRzVjY2x4dUlDQWdJQzh2SU5HQzBMWFF1dEdEMFluUXVOQzVJTkMwMExYUXZkR01YSEpjYmlBZ0lDQjBhR2x6TGw5MGIyUmhlU0E5SUc1bGR5QkVZWFJsS0NrN1hISmNiaUFnSUNCMGFHbHpMbDkwYjJSaGVTNXpaWFJJYjNWeWN5Z3dMQ0F3TENBd0xDQXdLVHRjY2x4dVhISmNiaUFnSUNCMGFHbHpMbDhrY0dsamEyVnlJRDBnZEdocGN5NWZKR055WldGMFpVVnNaVzFsYm5Rb1hISmNiaUFnSUNBZ0lDQWdZRHhrYVhZZ1kyeGhjM005WENKRVlYUmxjbUZ1WjJWd2FXTnJaWEpjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSkh0MGFHbHpMbTl3ZEdsdmJuTXVhVzUwWlhKdVlXeEpibkIxZEhNZ1AxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdZRHhrYVhZZ1kyeGhjM005WENKRVlYUmxjbUZ1WjJWd2FXTnJaWEpmWDJsdWNIVjBjMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ1I3ZEdocGN5NXZjSFJwYjI1ekxuTnBibWRzWlUxdlpHVmNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQeUJnUEdsdWNIVjBJSFI1Y0dVOVhDSm9hV1JrWlc1Y0lpQnVZVzFsUFZ3aVpHRjBaVndpUG1CY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ09pQmdQR2x1Y0hWMElIUjVjR1U5WENKb2FXUmtaVzVjSWlCdVlXMWxQVndpWkdGMFpWOW1jbTl0WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhwYm5CMWRDQjBlWEJsUFZ3aWFHbGtaR1Z1WENJZ2JtRnRaVDFjSW1SaGRHVmZkRzljSWo1Z1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWUNBNklDY25YSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNJa1JoZEdWeVlXNW5aWEJwWTJ0bGNsOWZiVzl1ZEdoelhDSStQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSkVZWFJsY21GdVoyVndhV05yWlhKZlgzUnZiMngwYVhCY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM005WENKRVlYUmxjbUZ1WjJWd2FXTnJaWEpmWDNSdmIyeDBhWEF0WTI5dWRHVnVkRndpUGp3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQThMMlJwZGo1Z1hISmNiaUFnSUNBcE8xeHlYRzVjY2x4dUlDQWdJQzh2SU5HTjBMdlF0ZEM4MExYUXZkR0MwWXRjY2x4dUlDQWdJSFJvYVhNdVh5UnRiMjUwYUhNZ0lDQWdJQ0FnSUNBOUlIUm9hWE11WHlSd2FXTnJaWEl1Y1hWbGNubFRaV3hsWTNSdmNpZ25Ma1JoZEdWeVlXNW5aWEJwWTJ0bGNsOWZiVzl1ZEdoekp5azdYSEpjYmlBZ0lDQjBhR2x6TGw4a2RHOXZiSFJwY0NBZ0lDQWdJQ0FnUFNCMGFHbHpMbDhrY0dsamEyVnlMbkYxWlhKNVUyVnNaV04wYjNJb0p5NUVZWFJsY21GdVoyVndhV05yWlhKZlgzUnZiMngwYVhBbktUdGNjbHh1SUNBZ0lIUm9hWE11WHlSMGIyOXNkR2x3UTI5dWRHVnVkQ0E5SUhSb2FYTXVYeVJ3YVdOclpYSXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxrUmhkR1Z5WVc1blpYQnBZMnRsY2w5ZmRHOXZiSFJwY0MxamIyNTBaVzUwSnlrN1hISmNibHh5WEc0Z0lDQWdMeThnMEwvUXZ0QzcwWThnMExMUXN0QyswTFRRc0Z4eVhHNGdJQ0FnZEdocGN5NWZKR2x1Y0hWMGN5QTlJSFJvYVhNdVh5UndhV05yWlhJdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNnbmFXNXdkWFJiYm1GdFpWNDlYQ0prWVhSbFhDSmRKeWs3WEhKY2JseHlYRzRnSUNBZ0x5OGcwTGpRdmRDNDBZYlF1TkN3MEx2UXVOQzMwTERSaHRDNDBZOGcwWUhRdnRHQjBZTFF2dEdQMEwzUXVOQzVYSEpjYmlBZ0lDQjBhR2x6TG5KaGJtZGxVbVZ6WlhRb0tUdGNjbHh1WEhKY2JpQWdJQ0F2THlEUmdOQzEwTDNRdE5DMTBZQmNjbHh1SUNBZ0lIUm9hWE11WDNObGJHVmpkRVJoZEdVb2RHaHBjeTV2Y0hScGIyNXpMbTFwYmtSaGRHVXBPMXh5WEc0Z0lDQWdkR2hwY3k1ZkpHTnZiblJoYVc1bGNpNWhjSEJsYm1SRGFHbHNaQ2gwYUdsekxsOGtjR2xqYTJWeUtUdGNjbHh1WEhKY2JpQWdJQ0F2THlEUXZ0Q3gwWURRc05DeDBMN1JndEM2MExBZzBMSFJnTkMxMExuUXV0Qy8wTDdRdU5DOTBZTFF2dEN5WEhKY2JpQWdJQ0JwWmlBb1QySnFaV04wTG10bGVYTW9kR2hwY3k1dmNIUnBiMjV6TG1KeVpXRnJjRzlwYm5SektTNXNaVzVuZEdncElIdGNjbHh1SUNBZ0lDQWdJQ0IzYVc1a2IzY3VZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25jbVZ6YVhwbEp5d2dkR2hwY3k1ZmIyNVhhVzVrYjNkU1pYTnBlbVZGZG1WdWRDNWlhVzVrS0hSb2FYTXBLVHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDl2YmxkcGJtUnZkMUpsYzJsNlpVVjJaVzUwS0NrN1hISmNiaUFnSUNCOVhISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRbmRDdzBMZlFzdEN3MEwzUXVOQzFJTkM4MExYUmdkR1AwWWJRc0Z4eVhHNGdLaUJBY0dGeVlXMGdJSHRFWVhSbGZTQmtZWFJsSU5DZTBMSFJpdEMxMExyUmdpRFF0TkN3MFlMUmkxeHlYRzRnS2lCQWNtVjBkWEp1SUh0VGRISnBibWQ5WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG1kbGRFMXZiblJvUm05eWJXRjBkR1ZrSUQwZ1puVnVZM1JwYjI0b1pHRjBaU2tnZTF4eVhHNGdJQ0FnWTI5dWMzUWdkR2wwYkdVZ1BTQjBhR2x6TG1kbGRFUmhkR1ZVYVcxbFJtOXliV0YwS0dSaGRHVXNJSHR0YjI1MGFEb2dKMnh2Ym1jbmZTazdYSEpjYmlBZ0lDQnlaWFIxY200Z2RHbDBiR1V1YzJ4cFkyVW9NQ3dnTVNrdWRHOVZjSEJsY2tOaGMyVW9LU0FySUhScGRHeGxMbk5zYVdObEtERXBPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLVFF2dEdBMEx6UXNOR0MwTGpSZ05DKzBMTFFzTkM5MExqUXRTRFF0TkN3MFlMUml5RFF0TkM3MFk4ZzBZTFF0ZEM2MFlQUmlkQzEwTGtnMEx2UXZ0QzYwTERRdTlDNFhISmNiaUFxSUVCd1lYSmhiU0FnZTBSaGRHVjlJQ0FnWkdGMFpTQWdJQ0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ29nUUhCaGNtRnRJQ0I3VDJKcVpXTjBmU0J2Y0hScGIyNXpJTkNmMExEUmdOQ3cwTHpRdGRHQzBZRFJpMXh5WEc0Z0tpQkFjbVYwZFhKdUlIdFRkSEpwYm1kOVhISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExtZGxkRVJoZEdWVWFXMWxSbTl5YldGMElEMGdablZ1WTNScGIyNG9aR0YwWlN3Z2IzQjBhVzl1Y3lrZ2UxeHlYRzRnSUNBZ2NtVjBkWEp1SUVsdWRHd3VSR0YwWlZScGJXVkdiM0p0WVhRb2RHaHBjeTV2Y0hScGIyNXpMbXh2WTJGc1pTd2diM0IwYVc5dWN5a3VabTl5YldGMEtHUmhkR1VwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSlRRdmRDNElOQzkwTFhRdE5DMTBMdlF1Rnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSWFpXVnJSR0Y1YzBadmNtMWhkSFJsWkNBOUlHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdZMjl1YzNRZ1pHRjBaU0E5SUc1bGR5QkVZWFJsS0NrN1hISmNiaUFnSUNCamIyNXpkQ0J5WlhOMWJIUWdQU0JiWFR0Y2NseHVYSEpjYmlBZ0lDQmtZWFJsTG5ObGRFUmhkR1VvWkdGMFpTNW5aWFJFWVhSbEtDa2dMU0F5S1R0Y2NseHVJQ0FnSUdadmNpQW9iR1YwSUdrZ1BTQXdPeUJwSUR3Z056c2dLeXRwS1NCN1hISmNiaUFnSUNBZ0lDQWdaR0YwWlM1elpYUkVZWFJsS0dSaGRHVXVaMlYwUkdGMFpTZ3BJQ3NnTVNrN1hISmNiaUFnSUNBZ0lDQWdjbVZ6ZFd4MExuQjFjMmdvZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JrWVhrNklHUmhkR1V1WjJWMFJHRjVLQ2tzWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJwZEd4bE9pQjBhR2x6TG1kbGRFUmhkR1ZVYVcxbFJtOXliV0YwS0dSaGRHVXNJSHQzWldWclpHRjVPaUFuYzJodmNuUW5mU2tzWEhKY2JpQWdJQ0FnSUNBZ2ZTazdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBZSFF2dEdBMFlMUXVOR0EwTDdRc3RDNjBMQWcwWUhRdnRDejBMdlFzTkdCMEwzUXZpRFF2ZEN3MFlIUmd0R0EwTDdRdGRDOTBMM1F2dEM4MFlNZzBML1F0ZEdBMExMUXZ0QzgwWU1nMExUUXZkR09JTkM5MExYUXROQzEwTHZRdUZ4eVhHNGdJQ0FnY21WemRXeDBMbk52Y25Rb0tHRXNJR0lwSUQwK0lIdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5QTlJSFJvYVhNdWIzQjBhVzl1Y3k1bWFYSnpkRVJoZVU5bVZHaGxWMlZsYXlBbElEYzdYSEpjYmlBZ0lDQWdJQ0FnYkdWMElHUmhlVUVnUFNCaExtUmhlVHRjY2x4dUlDQWdJQ0FnSUNCc1pYUWdaR0Y1UWlBOUlHSXVaR0Y1TzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb1pHRjVRU0E5UFNCbWFYSnpkRVJoZVU5bVZHaGxWMlZsYXlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnTFRFN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvWkdGNVFpQTlQU0JtYVhKemRFUmhlVTltVkdobFYyVmxheWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdNVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUdsbUlDaGtZWGxCSUR3Z1ptbHljM1JFWVhsUFpsUm9aVmRsWldzcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1pHRjVRU0FyUFNCeVpYTjFiSFF1YkdWdVozUm9PMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tHUmhlVUlnUENCbWFYSnpkRVJoZVU5bVZHaGxWMlZsYXlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCa1lYbENJQ3M5SUhKbGMzVnNkQzVzWlc1bmRHZzdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdaR0Y1UVNBdElHUmhlVUk3WEhKY2JpQWdJQ0I5S1R0Y2NseHVYSEpjYmlBZ0lDQnlaWFIxY200Z2NtVnpkV3gwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSnJRdnRDNzBMalJoOUMxMFlIUmd0Q3kwTDRnMExUUXZkQzEwTGtnMExJZzBMelF0ZEdCMFkvUmh0QzFYSEpjYmlBcUlFQndZWEpoYlNBZ2UwUmhkR1Y5SUdSaGRHVWcwSjdRc2RHSzBMWFF1dEdDSU5DMDBMRFJndEdMWEhKY2JpQXFJRUJ5WlhSMWNtNGdlMDUxYldKbGNuMGdJQ0FnMEpyUXZ0QzcwTGpSaDlDMTBZSFJndEN5MEw0ZzBMVFF2ZEMxMExsY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVoyVjBSR0Y1YzBOdmRXNTBTVzVOYjI1MGFDQTlJR1oxYm1OMGFXOXVLR1JoZEdVcElIdGNjbHh1SUNBZ0lHTnZibk4wSUdSaGVYTWdQU0J1WlhjZ1JHRjBaU2hrWVhSbExtZGxkRlJwYldVb0tTazdYSEpjYmlBZ0lDQmtZWGx6TG5ObGRFaHZkWEp6S0RBc0lEQXNJREFzSURBcE8xeHlYRzRnSUNBZ1pHRjVjeTV6WlhSTmIyNTBhQ2hrWVhsekxtZGxkRTF2Ym5Sb0tDa2dLeUF4S1R0Y2NseHVJQ0FnSUdSaGVYTXVjMlYwUkdGMFpTZ3dLVHRjY2x4dUlDQWdJSEpsZEhWeWJpQmtZWGx6TG1kbGRFUmhkR1VvS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNoMExIUmdOQyswWUVnMExMUmk5QzAwTFhRdTlDMTBMM1F2ZEdMMFlVZzBMVFFzTkdDWEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG5KaGJtZGxVbVZ6WlhRZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJSFJvYVhNdVgzSmhibWRsVm1semRXRnNVbVZ6WlhRb0tUdGNjbHh1SUNBZ0lIUm9hWE11WDNObGJHVmpkR2x2YmlBOUlIdDlPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKTFJpOUMwMExYUXU5QzEwTDNRdU5DMUlOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXNDRFF0TkN3MFlKY2NseHVJQ29nUUhCaGNtRnRJSHRFWVhSbGZTQmtZWFJsWDJaeWIyMGcwSjNRc05HSDBMRFF1OUdNMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBcUlFQndZWEpoYlNCN1JHRjBaWDBnWkdGMFpWOTBieUFnSU5DYTBMN1F2ZEMxMFlmUXZkQ3cwWThnMExUUXNOR0MwTEJjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1Y21GdVoyVlRaV3hsWTNRZ1BTQm1kVzVqZEdsdmJpaGtZWFJsWDJaeWIyMHNJR1JoZEdWZmRHOHBJSHRjY2x4dUlDQWdJR1JoZEdWZlpuSnZiUzV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVJQ0FnSUdSaGRHVmZkRzh1YzJWMFNHOTFjbk1vTUN3Z01Dd2dNQ3dnTUNrN1hISmNibHh5WEc0Z0lDQWdMeThnMExUUXZ0Qy8wWVBSZ2RHQzBMalF2TkdMMExrZzBMVFF1TkN3MEwvUXNOQzMwTDdRdlZ4eVhHNGdJQ0FnYVdZZ0tDRjBhR2x6TG1kbGRFbHpVbUZ1WjJWVFpXeGxZM1JoWW14bEtHUmhkR1ZmWm5KdmJTd2daR0YwWlY5MGJ5a3BJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ1kyOXVjM1FnSkdSaGVWOW1jbTl0SUQwZ2RHaHBjeTVmSkdkbGRFUmhlVUo1UkdGMFpTaGtZWFJsWDJaeWIyMHBPMXh5WEc0Z0lDQWdZMjl1YzNRZ0pHUmhlVjkwYnlBOUlIUm9hWE11WHlSblpYUkVZWGxDZVVSaGRHVW9aR0YwWlY5MGJ5azdYSEpjYmx4eVhHNGdJQ0FnYVdZZ0tDUmtZWGxmWm5KdmJTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNSa1lYbGZabkp2YlM1amJHRnpjMHhwYzNRdVlXUmtLQ2RwY3kxelpXeGxZM1JsWkNjc0lDZHBjeTF6Wld4bFkzUmxaQzFtY205dEp5azdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnYVdZZ0tDUmtZWGxmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0FrWkdGNVgzUnZMbU5zWVhOelRHbHpkQzVoWkdRb0oybHpMWE5sYkdWamRHVmtKeXdnSjJsekxYTmxiR1ZqZEdWa0xYUnZKeWs3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwTExSaTlDMDBMWFF1OUMxMEwzUXVOQzFJTkdOMEx2UXRkQzgwTFhRdmRHQzBMN1FzbHh5WEc0Z0lDQWdkR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFRaV3hsWTNRb1pHRjBaVjltY205dExDQmtZWFJsWDNSdktUdGNjbHh1WEhKY2JpQWdJQ0F2THlEUXN0R0wwTEhRdnRHQUlOQzAwTERSZ2lEUXNpRFF2dEN4MFlEUXNOR0MwTDNRdnRDOElOQy8wTDdSZ05HUDBMVFF1dEMxWEhKY2JpQWdJQ0JwWmlBb1pHRjBaVjltY205dElENGdaR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUZ0a1lYUmxYMlp5YjIwc0lHUmhkR1ZmZEc5ZElEMGdXMlJoZEdWZmRHOHNJR1JoZEdWZlpuSnZiVjA3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwTDdRc2RDOTBMN1FzdEM3MExYUXZkQzQwTFVnMExqUXZkQy8wWVBSZ3RDKzBMSmNjbHh1SUNBZ0lHbG1JQ2gwYUdsekxsOGthVzV3ZFhSelcwbE9SRVZZWDBSQlZFVmZSbEpQVFYwcElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOGthVzV3ZFhSelcwbE9SRVZZWDBSQlZFVmZSbEpQVFYwdWRtRnNkV1VnUFNCMGFHbHpMbVp2Y20xaGRFUmhkR1VvWkdGMFpWOW1jbTl0S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NWZKR2x1Y0hWMGMxdEpUa1JGV0Y5RVFWUkZYMVJQWFNrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVh5UnBibkIxZEhOYlNVNUVSVmhmUkVGVVJWOVVUMTB1ZG1Gc2RXVWdQU0IwYUdsekxtWnZjbTFoZEVSaGRHVW9aR0YwWlY5MGJ5azdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBZSFF2dEN4MFl2Umd0QzQwTFZjY2x4dUlDQWdJSFJvYVhNdVgyTmhiR3hpWVdOcktDZHlZVzVuWlZObGJHVmpkQ2NzSUdSaGRHVmZabkp2YlN3Z1pHRjBaVjkwYnlrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRcE5DKzBZRFF2TkN3MFlMUXVOR0EwTDdRc3RDdzBMM1F1TkMxSU5DMDBMRFJndEdMWEhKY2JpQXFJRUJ3WVhKaGJTQWdlMFJoZEdWOUlDQWdaR0YwWlNBZ0lOQ2UwTEhSaXRDMTBMclJnaURRdE5DdzBZTFJpMXh5WEc0Z0tpQkFjR0Z5WVcwZ0lIdFRkSEpwYm1kOUlHWnZjbTFoZENEUXBOQyswWURRdk5DdzBZSWcwWUhSZ3RHQTBMN1F1dEM0WEhKY2JpQXFJRUJ5WlhSMWNtNGdlMU4wY21sdVozMWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVabTl5YldGMFJHRjBaU0E5SUdaMWJtTjBhVzl1S0dSaGRHVXNJR1p2Y20xaGRDQTlJQ2RaTFcwdFpDY3BJSHRjY2x4dUlDQWdJSEpsZEhWeWJpQm1iM0p0WVhRdWNtVndiR0ZqWlNnbldTY3NJR1JoZEdVdVoyVjBSblZzYkZsbFlYSW9LU2xjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBdWNtVndiR0ZqWlNnbmJTY3NJQ2duTUNjZ0t5QW9aR0YwWlM1blpYUk5iMjUwYUNncElDc2dNU2twTG5Oc2FXTmxLQzB5S1NsY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXVjbVZ3YkdGalpTZ25aQ2NzSUNnbk1DY2dLeUFvWkdGMFpTNW5aWFJFWVhSbEtDa3BLUzV6YkdsalpTZ3RNaWtwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSi9SZ05DKzBMTFF0ZEdBMExyUXNDRFFzdEMrMExmUXZOQyswTGJRdmRDKzBZSFJndEM0SU5DeTBZdlF0TkMxMEx2UXRkQzkwTGpSanlEUXROQ3cwWUpjY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlNCa1lYUmxYMlp5YjIwZzBKM1FzTkdIMExEUXU5R00wTDNRc05HUElOQzAwTERSZ3RDd1hISmNiaUFxSUVCd1lYSmhiU0FnZTBSaGRHVWdaR0YwWlY5MGJ5QWdJTkNhMEw3UXZkQzEwWWZRdmRDdzBZOGcwTFRRc05HQzBMQmNjbHh1SUNvZ1FISmxkSFZ5YmlCN1FtOXZiR1ZoYm4xY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVoyVjBTWE5TWVc1blpWTmxiR1ZqZEdGaWJHVWdQU0JtZFc1amRHbHZiaWhrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzhwSUh0Y2NseHVJQ0FnSUdSaGRHVmZabkp2YlM1elpYUkliM1Z5Y3lnd0xDQXdMQ0F3TENBd0tUdGNjbHh1SUNBZ0lHUmhkR1ZmZEc4dWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmx4eVhHNGdJQ0FnYVdZZ0tHUmhkR1ZmWm5KdmJTQStJR1JoZEdWZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNCYlpHRjBaVjltY205dExDQmtZWFJsWDNSdlhTQTlJRnRrWVhSbFgzUnZMQ0JrWVhSbFgyWnliMjFkTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkM4MExqUXZkQzQwTHpRc05DNzBZelF2ZEdMMExrZzBMVFF1TkN3MEwvUXNOQzMwTDdRdlZ4eVhHNGdJQ0FnWTI5dWMzUWdaR2xtWmlBOUlFMWhkR2d1WVdKektHUmhkR1ZmWm5KdmJTNW5aWFJVYVcxbEtDa2dMU0JrWVhSbFgzUnZMbWRsZEZScGJXVW9LU2tnTHlBeE1EQXdJQzhnT0RZME1EQTdYSEpjYmlBZ0lDQnBaaUFvWkdsbVppQThJSFJvYVhNdWIzQjBhVzl1Y3k1dGFXNUVZWGx6S1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkMvMFlEUXZ0Q3kwTFhSZ05DNjBMQWcwTC9RdnRDLzBMRFF0TkN3MEwzUXVOR1BJTkN5SU5DMDBMalFzTkMvMExEUXQ5QyswTDBnMExmUXNOQ3gwTHZRdnRDNjBMalJnTkMrMExMUXNOQzkwTDNSaTlHRklOQzAwTERSZ2x4eVhHNGdJQ0FnWTI5dWMzUWdaR0Y1SUQwZ2JtVjNJRVJoZEdVb0tUdGNjbHh1SUNBZ0lHUmhlUzV6WlhSVWFXMWxLR1JoZEdWZlpuSnZiUzVuWlhSVWFXMWxLQ2twTzF4eVhHNWNjbHh1SUNBZ0lIZG9hV3hsSUNoa1lYa2dQQ0JrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVoyVjBSR0Y1VEc5amEyVmtLR1JoZVNrcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnWkdGNUxuTmxkRVJoZEdVb1pHRjVMbWRsZEVSaGRHVW9LU0FySURFcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJSEpsZEhWeWJpQjBjblZsTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSi9SZ05DKzBMTFF0ZEdBMExyUXNDRFF2ZEN3SU5DMDBMN1JnZEdDMFlQUXY5QzkwTDdSZ2RHQzBZd2cwTFRRdmRHUElOQzAwTHZSanlEUXNkR0EwTDdRdmRDNFhISmNiaUFxSUVCd1lYSmhiU0FnZTBSaGRHVjlJR1JoZEdVZzBKVFFzTkdDMExCY2NseHVJQ29nUUhKbGRIVnliaUI3UW05dmJHVmhibjBnSUNCMGNuVmxJTkMxMFlIUXU5QzRJTkMwMEw3UmdkR0MwWVBRdjlDMTBMMWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVaMlYwUkdGNVRHOWphMlZrSUQwZ1puVnVZM1JwYjI0b1pHRjBaU2tnZTF4eVhHNGdJQ0FnTHk4ZzBMTFJpOUN4MEw3UmdDRFF0TkN3MFlJZzBMTFF2ZEMxSU5DMDBMN1JnZEdDMFlQUXY5QzkwTDdRczlDK0lOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXNGeHlYRzRnSUNBZ2FXWWdLR1JoZEdVZ1BDQjBhR2x6TG05d2RHbHZibk11YldsdVJHRjBaU0I4ZkNCa1lYUmxJRDRnZEdocGN5NXZjSFJwYjI1ekxtMWhlRVJoZEdVcElIdGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdURTlEUzE5VlRrRldRVWxNUVVKTVJUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1dmNIUnBiMjV6TG1acGJIUmxjaTVzYjJOclJHRjVjeTVqWVd4c0tIUm9hWE1zSUdSaGRHVXBPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKTFJpOUN4MFlEUXNOQzkwTDNRc05HUElOQzkwTERSaDlDdzBMdlJqTkM5MExEUmp5RFF0TkN3MFlMUXNGeHlYRzRnS2lCQWNtVjBkWEp1SUh0RVlYUmxmU0RRbE5DdzBZTFFzRnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSRVlYUmxSbkp2YlNBOUlHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdMeThnMEwzUXNOR0gwTERRdTlHTTBMM1FzTkdQSU5DMDBMRFJndEN3SU5DOTBMVWcwWVBRdXRDdzBMZlFzTkM5MExCY2NseHVJQ0FnSUdsbUlDZ2hkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTa2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFF2ZEN3MFlmUXNOQzcwWXpRdmRDdzBZOGcwTFRRc05HQzBMQWcwTC9RdnRDMzBMYlF0U0RRdXRDKzBMM1F0ZEdIMEwzUXZ0QzVYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZmRHOGdKaVlnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU0ErSUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKTFJpOUN4MFlEUXNOQzkwTDNRc05HUElOQzAwTERSZ3RDd0lDaHphVzVuYkdWTmIyUmxPaUIwY25WbEtWeHlYRzRnS2lCQWNtVjBkWEp1SUh0RVlYUmxmU0RRbE5DdzBZTFFzRnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSRVlYUmxJRDBnUkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSRVlYUmxSbkp2YlR0Y2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUWt0R0wwTEhSZ05DdzBMM1F2ZEN3MFk4ZzBMclF2dEM5MExYUmg5QzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdLaUJBY21WMGRYSnVJSHRFWVhSbGZTRFFsTkN3MFlMUXNGeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNW5aWFJFWVhSbFZHOGdQU0JtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUM4dklOQzYwTDdRdmRDMTBZZlF2ZEN3MFk4ZzBMVFFzTkdDMExBZzBMM1F0U0RSZzlDNjBMRFF0OUN3MEwzUXNGeHlYRzRnSUNBZ2FXWWdLQ0YwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFF2ZEN3MFlmUXNOQzcwWXpRdmRDdzBZOGcwTFRRc05HQzBMQWcwTC9RdnRDMzBMYlF0U0RRdXRDKzBMM1F0ZEdIMEwzUXZ0QzVYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU0FtSmlCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0SUQ0Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzg3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvZEM2MEx2UXZ0QzkwTFhRdmRDNDBMVWdLREVnMExIUXZ0Q3gwWkhSZ0N3Z01pRFFzZEMrMExIUmdOQ3dMQ0ExSU5DeDBMN1FzZEdBMEw3UXNpbGNjbHh1SUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNCMllXeDFaU0RRbXRDKzBMdlF1TkdIMExYUmdkR0MwTExRdmx4eVhHNGdLaUJBY0dGeVlXMGdJSHRCY25KaGVYMGdJR1p2Y20xeklOQ2MwTERSZ2RHQjBMalFzaURRdU5DM0lEUFJoU0RSamRDNzBMWFF2TkMxMEwzUmd0QyswTElzSU5DODBMN1F0dEMxMFlJZzBZSFF2dEMwMExYUmdOQzIwTERSZ3RHTUlOR0IwTC9RdGRHRzBMalJoTkM0MExyUXNOR0MwTDdSZ0NBbFpDRFF0TkM3MFk4ZzBMZlFzTkM4MExYUXZkR0xYSEpjYmlBcUlFQnlaWFIxY200Z2UxTjBjbWx1WjMxY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdWNHeDFjbUZzSUQwZ1puVnVZM1JwYjI0Z0tIWmhiSFZsTENCbWIzSnRjeWtnZTF4eVhHNGdJQ0FnY21WMGRYSnVJQ2gyWVd4MVpTQWxJREV3SUQwOUlERWdKaVlnZG1Gc2RXVWdKU0F4TURBZ0lUMGdNVEVnUHlCbWIzSnRjMXN3WFNBNklDaDJZV3gxWlNBbElERXdJRDQ5SURJZ0ppWWdkbUZzZFdVZ0pTQXhNQ0E4UFNBMElDWW1JQ2gyWVd4MVpTQWxJREV3TUNBOElERXdJSHg4SUhaaGJIVmxJQ1VnTVRBd0lENDlJREl3S1NBL0lHWnZjbTF6V3pGZElEb2dabTl5YlhOYk1sMHBLUzV5WlhCc1lXTmxLQ2NsWkNjc0lIWmhiSFZsS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNnMExYUXZkQzAwTFhSZ0NEUXROQzQwTERRdjlDdzBMZlF2dEM5MExBZzBMelF0ZEdCMFkvUmh0QzEwTEpjY2x4dUlDb2dRSEJoY21GdElIdEVZWFJsZlNCa1lYUmxYMlp5YjIwZzBKM1FzTkdIMExEUXU5R00wTDNRc05HUElOQzAwTERSZ3RDd1hISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOGtZM0psWVhSbFRXOXVkR2h6SUQwZ1puVnVZM1JwYjI0b1pHRjBaVjltY205dEtTQjdYSEpjYmlBZ0lDQjNhR2xzWlNBb2RHaHBjeTVmSkcxdmJuUm9jeTVzWVhOMFJXeGxiV1Z1ZEVOb2FXeGtLU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmSkcxdmJuUm9jeTV5WlcxdmRtVkRhR2xzWkNoMGFHbHpMbDhrYlc5dWRHaHpMbXhoYzNSRmJHVnRaVzUwUTJocGJHUXBPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQy8wWURSajlHSDBMWFF2Q0RRdjlDKzBMVFJnZEM2MExEUXQ5QzYwWU5jY2x4dUlDQWdJSFJvYVhNdVgzUnZiMngwYVhCSWFXUmxLQ2s3WEhKY2JseHlYRzRnSUNBZ0x5OGcwTC9SZ05DMTBZRFF0ZEM5MExUUXRkR0FJTkM4MExYUmdkR1AwWWJRdGRDeVhISmNiaUFnSUNCamIyNXpkQ0JqZFhKeVpXNTBSR0YwWlNBOUlHNWxkeUJFWVhSbEtHUmhkR1ZmWm5KdmJTNW5aWFJVYVcxbEtDa3BPMXh5WEc0Z0lDQWdZMjl1YzNRZ0pHMXZiblJvY3lBOUlGdGRPMXh5WEc0Z0lDQWdabTl5SUNoc1pYUWdhU0E5SURBN0lHa2dQQ0IwYUdsekxtOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUTdJQ3NyYVNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ1J0YjI1MGFITXVjSFZ6YUNoMGFHbHpMbDhrWTNKbFlYUmxUVzl1ZEdnb1kzVnljbVZ1ZEVSaGRHVXBLVHRjY2x4dUlDQWdJQ0FnSUNCamRYSnlaVzUwUkdGMFpTNXpaWFJOYjI1MGFDaGpkWEp5Wlc1MFJHRjBaUzVuWlhSTmIyNTBhQ2dwSUNzZ01TazdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBZRFF0ZEM5MExUUXRkR0FYSEpjYmlBZ0lDQm1iM0lnS0d4bGRDQnBJRDBnTURzZ2FTQThJQ1J0YjI1MGFITXViR1Z1WjNSb095QnBJQ3M5SUhSb2FYTXViM0IwYVc5dWN5NXdaWEpTYjNjcElIdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQWtjbTkzSUQwZ1pHOWpkVzFsYm5RdVkzSmxZWFJsUld4bGJXVnVkQ2duWkdsMkp5azdYSEpjYmlBZ0lDQWdJQ0FnSkhKdmR5NWpiR0Z6YzA1aGJXVWdQU0FuUkdGMFpYSmhibWRsY0dsamEyVnlYMTl5YjNjbk8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBa2JXOXVkR2h6TG5Oc2FXTmxLR2tzSUdrZ0t5QjBhR2x6TG05d2RHbHZibk11Y0dWeVVtOTNLUzVtYjNKRllXTm9LQ1J0YjI1MGFDQTlQaUI3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ1J5YjNjdVlYQndaVzVrUTJocGJHUW9KRzF2Ym5Sb0tUdGNjbHh1SUNBZ0lDQWdJQ0I5S1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZKRzF2Ym5Sb2N5NWhjSEJsYm1SRGFHbHNaQ2drY205M0tUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JwWmlBb2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlNCOGZDQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzSmhibWRsVm1semRXRnNVMlZzWldOMEtIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYMlp5YjIwc0lIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYM1J2S1R0Y2NseHVJQ0FnSUgxY2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNnMExYUXZkQzAwTFhSZ0NEUXZOQzEwWUhSajlHRzBMQmNjbHh1SUNvZ1FIQmhjbUZ0SUh0RVlYUmxmU0JrWVhSbElOQ2MwTFhSZ2RHUDBZWmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYeVJqY21WaGRHVk5iMjUwYUNBOUlHWjFibU4wYVc5dUtHUmhkR1VwSUh0Y2NseHVJQ0FnSUdOdmJuTjBJR04xY25KbGJuUk5iMjUwYUNBOUlHUmhkR1V1WjJWMFRXOXVkR2dvS1R0Y2NseHVJQ0FnSUdOdmJuTjBJRzF2Ym5Sb1ZHbDBiR1VnUFNCMGFHbHpMbWRsZEUxdmJuUm9SbTl5YldGMGRHVmtLR1JoZEdVcE8xeHlYRzRnSUNBZ1kyOXVjM1FnZDJWbGEwUmhlWE1nUFNCMGFHbHpMbWRsZEZkbFpXdEVZWGx6Um05eWJXRjBkR1ZrS0NrN1hISmNibHh5WEc0Z0lDQWdZMjl1YzNRZ0pHMXZiblJvSUQwZ2RHaHBjeTVmSkdOeVpXRjBaVVZzWlcxbGJuUW9YSEpjYmlBZ0lDQWdJQ0FnWUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUZ3aUlHUmhkR0V0ZEdsdFpUMWNJaVI3WkdGMFpTNW5aWFJVYVcxbEtDbDlYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM005WENKTmIyNTBhRjlmYUdWaFpHVnlYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWd2lUVzl1ZEdoZlgyRnljbTkzSUUxdmJuUm9YMTloY25KdmR5MHRjSEpsZGlSN0tIUm9hWE11YjNCMGFXOXVjeTV0YVc1RVlYUmxJQ1ltSUdSaGRHVWdQRDBnZEdocGN5NXZjSFJwYjI1ekxtMXBia1JoZEdVcElEOGdKeUJwY3kxa2FYTmhZbXhsWkNjZ09pQW5KMzFjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNabklIZHBaSFJvUFZ3aU9Gd2lJR2hsYVdkb2REMWNJakUwWENJZ2RtbGxkMEp2ZUQxY0lqQWdNQ0E0SURFMFhDSWdabWxzYkQxY0ltNXZibVZjSWlCNGJXeHVjejFjSW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpJd01EQXZjM1puWENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHdZWFJvSUdROVhDSk5OeUF4TTB3eElEZE1OeUF4WENJZ2MzUnliMnRsUFZ3aUl6aERPRU00UTF3aUlITjBjbTlyWlMxM2FXUjBhRDFjSWpKY0lpQnpkSEp2YTJVdGJHbHVaV05oY0QxY0luSnZkVzVrWENJZ2MzUnliMnRsTFd4cGJtVnFiMmx1UFZ3aWNtOTFibVJjSWo0OEwzQmhkR2crWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzl6ZG1jK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGOWZkR2wwYkdWY0lqNGtlMjF2Ym5Sb1ZHbDBiR1Y5SUNSN1pHRjBaUzVuWlhSR2RXeHNXV1ZoY2lncGZUd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNJazF2Ym5Sb1gxOWhjbkp2ZHlCTmIyNTBhRjlmWVhKeWIzY3RMVzVsZUhRa2V5aDBhR2x6TG05d2RHbHZibk11YldGNFJHRjBaU0FtSmlCa1lYUmxJRDQ5SUhSb2FYTXViM0IwYVc5dWN5NXRZWGhFWVhSbEtTQS9JQ2NnYVhNdFpHbHpZV0pzWldRbklEb2dKeWQ5WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOMlp5QjNhV1IwYUQxY0lqaGNJaUJvWldsbmFIUTlYQ0l4TkZ3aUlIWnBaWGRDYjNnOVhDSXdJREFnT0NBeE5Gd2lJR1pwYkd3OVhDSnViMjVsWENJZ2VHMXNibk05WENKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eU1EQXdMM04yWjF3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjR0YwYUNCa1BWd2lUVEVnTUM0NU9UazVPVGxNTnlBM1RERWdNVE5jSWlCemRISnZhMlU5WENJak9FTTRRemhEWENJZ2MzUnliMnRsTFhkcFpIUm9QVndpTWx3aUlITjBjbTlyWlMxc2FXNWxZMkZ3UFZ3aWNtOTFibVJjSWlCemRISnZhMlV0YkdsdVpXcHZhVzQ5WENKeWIzVnVaRndpUGp3dmNHRjBhRDVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMM04yWno1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNJazF2Ym5Sb1gxOTNaV1ZyWENJK0pIdDNaV1ZyUkdGNWN5NXRZWEFvYVhSbGJTQTlQaUI3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUY5ZmQyVmxhMlJoZVZ3aVBpUjdhWFJsYlM1MGFYUnNaWDA4TDJScGRqNWdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHBMbXB2YVc0b0p5Y3BmVHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWd2lUVzl1ZEdoZlgyUmhlWE5jSWo0OEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBOEwyUnBkajVnWEhKY2JpQWdJQ0FwTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkdCMFlMUmdOQzEwTHZRdXRDNFhISmNiaUFnSUNCYlhISmNiaUFnSUNBZ0lDQWdlM05sYkdWamRHOXlPaUFuTGsxdmJuUm9YMTloY25KdmR5MHRjSEpsZGljc0lHNWhiV1U2SUNkd2NtVjJKMzBzWEhKY2JpQWdJQ0FnSUNBZ2UzTmxiR1ZqZEc5eU9pQW5MazF2Ym5Sb1gxOWhjbkp2ZHkwdGJtVjRkQ2NzSUc1aGJXVTZJQ2R1WlhoMEozMHNYSEpjYmlBZ0lDQmRMbVp2Y2tWaFkyZ29hWFJsYlNBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdKR0Z5Y205M0lEMGdKRzF2Ym5Sb0xuRjFaWEo1VTJWc1pXTjBiM0lvYVhSbGJTNXpaV3hsWTNSdmNpazdYSEpjYmlBZ0lDQWdJQ0FnSkdGeWNtOTNMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KMk5zYVdOckp5d2daU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklOQ3kwWURRdGRDODBMWFF2ZEM5MExEUmp5RFF2TkMxMFlEUXNDd2cwTHZSZzlHSDBZalF0U0RRdjlDMTBZRFF0ZEN5MExYUmdOR0IwWUxRc05HQzBZd3NJTkN5MFl2UXZkQzEwWUhSZ3RDNElOR0IwWUxSZ05DMTBMdlF1dEM0SU5DMzBMQWcwTC9SZ05DMTBMVFF0ZEM3MFlzZzBML1F0ZEdBMExYUmdOQzEwWURRdU5HQjBMN1FzdEdMMExMUXNOQzEwTHpRdnRDNUlOQyswTEhRdTlDdzBZSFJndEM0SU5DLzBMalF1dEMxMFlEUXNGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCbExuTjBiM0JRY205d1lXZGhkR2x2YmlncE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZmIyNUJjbkp2ZDBOc2FXTnJLQ1JoY25KdmR5d2dhWFJsYlM1dVlXMWxLVHRjY2x4dUlDQWdJQ0FnSUNCOUtUdGNjbHh1SUNBZ0lIMHBPMXh5WEc1Y2NseHVJQ0FnSUM4dklOR0EwTFhRdmRDMDBMWFJnQ0RRdE5DOTBMWFF1Vnh5WEc0Z0lDQWdZMjl1YzNRZ0pHUmhlWE1nUFNBa2JXOXVkR2d1Y1hWbGNubFRaV3hsWTNSdmNpZ25MazF2Ym5Sb1gxOWtZWGx6SnlrN1hISmNiaUFnSUNCamIyNXpkQ0JrWVhseklEMGdibVYzSUVSaGRHVW9aR0YwWlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ1pHRjVjeTV6WlhSRVlYUmxLREVwTzF4eVhHNGdJQ0FnWkdGNWN5NXpaWFJJYjNWeWN5Z3dMQ0F3TENBd0xDQXdLVHRjY2x4dVhISmNiaUFnSUNCM2FHbHNaU0FvWkdGNWN5NW5aWFJOYjI1MGFDZ3BJRDA5SUdOMWNuSmxiblJOYjI1MGFDa2dlMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJQ1IzWldWcklEMGdkR2hwY3k1ZkpHTnlaV0YwWlZkbFpXc29LVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdkMlZsYTBSaGVYTXVabTl5UldGamFDaHBkR1Z0SUQwK0lIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR1JoZVhNdVoyVjBSR0Y1S0NrZ0lUMGdhWFJsYlM1a1lYa2dmSHdnWkdGNWN5NW5aWFJOYjI1MGFDZ3BJQ0U5SUdOMWNuSmxiblJOYjI1MGFDa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSkhkbFpXc3VZWEJ3Wlc1a1EyaHBiR1FvZEdocGN5NWZKR055WldGMFpVVnRjSFI1UkdGNUtDa3BPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FrZDJWbGF5NWhjSEJsYm1SRGFHbHNaQ2gwYUdsekxsOGtZM0psWVhSbFJHRjVLR1JoZVhNcEtUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1pHRjVjeTV6WlhSRVlYUmxLR1JoZVhNdVoyVjBSR0YwWlNncElDc2dNU2s3WEhKY2JpQWdJQ0FnSUNBZ2ZTazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDUmtZWGx6TG1Gd2NHVnVaRU5vYVd4a0tDUjNaV1ZyS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnlaWFIxY200Z0pHMXZiblJvTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSnJRdTlDNDBMb2cwTC9RdmlEUmdkR0MwWURRdGRDNzBMclF0U0RRdjlDMTBZRFF0ZEM2MEx2Ump0R0gwTFhRdmRDNDBZOGcwTHpRdGRHQjBZL1JodEN3WEhKY2JpQXFJRUJ3WVhKaGJTQjdSV3hsYldWdWRIMGdKR0Z5Y205M0lFaFVUVXdnMFkzUXU5QzEwTHpRdGRDOTBZSmNjbHh1SUNvZ1FIQmhjbUZ0SUh0VGRISnBibWQ5SUc1aGJXVWdJQ0FnMEpqUXZOR1BJQ2h3Y21WMkxDQnVaWGgwS1Z4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZmIyNUJjbkp2ZDBOc2FXTnJJRDBnWm5WdVkzUnBiMjRvSkdGeWNtOTNMQ0J1WVcxbEtTQjdYSEpjYmlBZ0lDQnBaaUFvSkdGeWNtOTNMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYVhNdFpHbHpZV0pzWldRbktTa2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JqYjI1emRDQmtZWFJsSUQwZ2JtVjNJRVJoZEdVb2NHRnljMlZKYm5Rb2RHaHBjeTVmSkcxdmJuUm9jeTV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VUVzl1ZEdnbktTNWtZWFJoYzJWMExuUnBiV1VzSURFd0tTazdYSEpjYmlBZ0lDQmtZWFJsTG5ObGRFMXZiblJvS0dSaGRHVXVaMlYwVFc5dWRHZ29LU0FySUNodVlXMWxJRDA5SUNkd2NtVjJKeUEvSUMxMGFHbHpMbTl3ZEdsdmJuTXViVzl1ZEdoelEyOTFiblFnT2lCMGFHbHpMbTl3ZEdsdmJuTXViVzl1ZEdoelEyOTFiblFwS1R0Y2NseHVYSEpjYmlBZ0lDQXZMeURRc3RHTDBZWFF2dEMwSU5DMzBMQWcwTC9SZ05DMTBMVFF0ZEM3MFlzZzBMelF1TkM5MExqUXZOQ3cwTHZSak5DOTBMN1F1U0RRdE5DdzBZTFJpMXh5WEc0Z0lDQWdhV1lnS0dSaGRHVWdQQ0IwYUdsekxtOXdkR2x2Ym5NdWJXbHVSR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJR1JoZEdVdWMyVjBWR2x0WlNoMGFHbHpMbTl3ZEdsdmJuTXViV2x1UkdGMFpTNW5aWFJVYVcxbEtDa3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQ3kwWXZSaGRDKzBMUWcwTGZRc0NEUXY5R0EwTFhRdE5DMTBMdlJpeURRdk5DdzBMclJnZEM0MEx6UXNOQzcwWXpRdmRDKzBMa2cwTFRRc05HQzBZdGNjbHh1SUNBZ0lHbG1JQ2gwYUdsekxtOXdkR2x2Ym5NdWJXRjRSR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElHVnVaRVJoZEdVZ1BTQnVaWGNnUkdGMFpTaGtZWFJsTG1kbGRGUnBiV1VvS1NrN1hISmNiaUFnSUNBZ0lDQWdaVzVrUkdGMFpTNXpaWFJOYjI1MGFDaGxibVJFWVhSbExtZGxkRTF2Ym5Sb0tDa2dLeUIwYUdsekxtOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUXBPMXh5WEc0Z0lDQWdJQ0FnSUdsbUlDaGxibVJFWVhSbElENGdkR2hwY3k1dmNIUnBiMjV6TG0xaGVFUmhkR1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWkdGMFpTNXpaWFJVYVcxbEtIUm9hWE11YjNCMGFXOXVjeTV0WVhoRVlYUmxMbWRsZEZScGJXVW9LU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR1JoZEdVdWMyVjBUVzl1ZEdnb1pHRjBaUzVuWlhSTmIyNTBhQ2dwSUMwZ2RHaHBjeTV2Y0hScGIyNXpMbTF2Ym5Sb2MwTnZkVzUwSUNzZ01TazdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkMvMExYUmdOQzEwWVhRdnRDMElOQzZJTkM5MEw3UXN0QyswTGtnMExUUXNOR0MwTFZjY2x4dUlDQWdJSFJvYVhNdVgzTmxiR1ZqZEVSaGRHVW9aR0YwWlNrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRbzlHQjBZTFFzTkM5MEw3UXN0QzYwTEFnMFlMUXRkQzYwWVBSaWRDMTBMa2cwTFRRc05HQzBZc2cwWUVnMFlEUXRkQzkwTFRRdGRHQTBMN1F2Rnh5WEc0Z0tpQkFjR0Z5WVcwZ2UwUmhkR1Y5SUdSaGRHVWcwSlRRc05HQzBMQmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYM05sYkdWamRFUmhkR1VnUFNCbWRXNWpkR2x2Ymloa1lYUmxLU0I3WEhKY2JpQWdJQ0IwYUdsekxsOXpaV3hsWTNSbFpFUmhkR1VnUFNCa1lYUmxPMXh5WEc0Z0lDQWdkR2hwY3k1ZkpHTnlaV0YwWlUxdmJuUm9jeWhrWVhSbEtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DZzBMWFF2ZEMwMExYUmdDRFF2ZEMxMExUUXRkQzcwTGhjY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ29nUUhKbGRIVnliaUI3Uld4bGJXVnVkSDFjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WHlSamNtVmhkR1ZYWldWcklEMGdablZ1WTNScGIyNG9aR0YwWlNrZ2UxeHlYRzRnSUNBZ1kyOXVjM1FnSkhkbFpXc2dQU0IwYUdsekxsOGtZM0psWVhSbFJXeGxiV1Z1ZENoY2NseHVJQ0FnSUNBZ0lDQmdQR1JwZGlCamJHRnpjejFjSWxkbFpXdGNJajQ4TDJScGRqNWdYSEpjYmlBZ0lDQXBPMXh5WEc1Y2NseHVJQ0FnSUhKbGRIVnliaUFrZDJWbGF6dGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DZzBMWFF2ZEMwMExYUmdDRFF0TkM5MFk5Y2NseHVJQ29nUUhCaGNtRnRJQ0I3UkdGMFpYMGdaR0YwWlNEUW50Q3gwWXJRdGRDNjBZSWcwTFRRc05HQzBZdGNjbHh1SUNvZ1FISmxkSFZ5YmlCN1JXeGxiV1Z1ZEgxY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVh5UmpjbVZoZEdWRVlYa2dQU0JtZFc1amRHbHZiaWhrWVhSbEtTQjdYSEpjYmlBZ0lDQmpiMjV6ZENBa1pHRjVJRDBnZEdocGN5NWZKR055WldGMFpVVnNaVzFsYm5Rb1hISmNiaUFnSUNBZ0lDQWdZRHhrYVhZZ1kyeGhjM005WENKRVlYbGNJaUJrWVhSaExYUnBiV1U5WENJa2UyUmhkR1V1WjJWMFZHbHRaU2dwZlZ3aUlHUmhkR0V0WkdGNVBWd2lKSHRrWVhSbExtZGxkRVJoZVNncGZWd2lQaVI3WkdGMFpTNW5aWFJFWVhSbEtDbDlQQzlrYVhZK1lGeHlYRzRnSUNBZ0tUdGNjbHh1WEhKY2JpQWdJQ0FrWkdGNUxtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyTnNhV05ySnl3Z2RHaHBjeTVmYjI1RVlYbERiR2xqYTBWMlpXNTBMbUpwYm1Rb2RHaHBjeWtwTzF4eVhHNWNjbHh1SUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxuTnBibWRzWlUxdlpHVXBJSHRjY2x4dUlDQWdJQ0FnSUNBa1pHRjVMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KMjF2ZFhObFpXNTBaWEluTENCMGFHbHpMbDl2YmtSaGVVMXZkWE5sUlc1MFpYSkZkbVZ1ZEM1aWFXNWtLSFJvYVhNcEtUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUXZ0Q3gwTDNRdnRDeTBMdlF0ZEM5MExqUXRTRFJnZEMrMFlIUmd0QyswWS9RdmRDNDBMbGNjbHh1SUNBZ0lIUm9hWE11WDNWd1pHRjBaVVJoZVNna1pHRjVLVHRjY2x4dVhISmNiaUFnSUNCeVpYUjFjbTRnSkdSaGVUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DZTBMSFF2ZEMrMExMUXU5QzEwTDNRdU5DMUlOR0IwTDdSZ2RHQzBMN1JqOUM5MExqUXVWeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNTFjR1JoZEdVZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJSFJvYVhNdVh5UnRiMjUwYUhNdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNnbkxrMXZiblJvSnlrdVptOXlSV0ZqYUNna2JXOXVkR2dnUFQ0Z2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzVndaR0YwWlUxdmJuUm9LQ1J0YjI1MGFDazdYSEpjYmlBZ0lDQjlLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2UwTEhRdmRDKzBMTFF1OUMxMEwzUXVOQzFJTkdCMEw3UmdkR0MwTDdSajlDOTBMalF1U0RRdk5DMTBZSFJqOUdHMExCY2NseHVJQ29nUUhCaGNtRnRJSHRGYkdWdFpXNTBmU0FrYlc5dWRHZ2cwSzNRdTlDMTBMelF0ZEM5MFlJZzBMelF0ZEdCMFkvUmh0Q3dYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDkxY0dSaGRHVk5iMjUwYUNBOUlHWjFibU4wYVc5dUtDUnRiMjUwYUNrZ2UxeHlYRzRnSUNBZ0pHMXZiblJvTG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvSnk1RVlYbGJaR0YwWVMxMGFXMWxYU2NwTG1admNrVmhZMmdvSkdSaGVTQTlQaUI3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmZFhCa1lYUmxSR0Y1S0NSa1lYa3BPMXh5WEc0Z0lDQWdmU2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFudEN4MEwzUXZ0Q3kwTHZRdGRDOTBMalF0U0RSZ2RDKzBZSFJndEMrMFkvUXZkQzQwTGtnMExUUXZkR1BYSEpjYmlBcUlFQndZWEpoYlNCN1JXeGxiV1Z1ZEgwZ0pHUmhlU0RRcmRDNzBMWFF2TkMxMEwzUmdpRFF0TkM5MFk5Y2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgzVndaR0YwWlVSaGVTQTlJR1oxYm1OMGFXOXVLQ1JrWVhrcElIdGNjbHh1SUNBZ0lHTnZibk4wSUdSaGRHVWdJQ0E5SUc1bGR5QkVZWFJsS0hCaGNuTmxTVzUwS0NSa1lYa3VaR0YwWVhObGRDNTBhVzFsTENBeE1Da3BPMXh5WEc0Z0lDQWdZMjl1YzNRZ2JHOWphMlZrSUQwZ2RHaHBjeTVuWlhSRVlYbE1iMk5yWldRb1pHRjBaU2s3WEhKY2JpQWdJQ0JqYjI1emRDQjBiMlJoZVNBZ1BTQjBhR2x6TGw5MGIyUmhlUzVuWlhSVWFXMWxLQ2tnUFQwZ1pHRjBaUzVuWlhSVWFXMWxLQ2s3WEhKY2JseHlYRzRnSUNBZ0pHUmhlUzVqYkdGemMweHBjM1F1ZEc5bloyeGxLQ2RwY3kxa2FYTmhZbXhsWkNjc0lHeHZZMnRsWkNrN1hISmNiaUFnSUNBa1pHRjVMbU5zWVhOelRHbHpkQzUwYjJkbmJHVW9KMmx6TFd4dlkydGxaQ2NzSUd4dlkydGxaQ0E5UFNCTVQwTkxYMHhQUTB0RlJDazdYSEpjYmlBZ0lDQWtaR0Y1TG1Oc1lYTnpUR2x6ZEM1MGIyZG5iR1VvSjJsekxYUnZaR0Y1Snl3Z2RHOWtZWGtwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwS0hRdnRDeDBZdlJndEM0MExVZzBMclF1OUM0MExyUXNDRFF2OUMrSU5DMDBMM1JqbHh5WEc0Z0tpQkFjR0Z5WVcwZ2UwVjJaVzUwZlNCbElFUlBUU0RSZ2RDKzBMSFJpOUdDMExqUXRWeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZiMjVFWVhsRGJHbGphMFYyWlc1MElEMGdablZ1WTNScGIyNG9aU2tnZTF4eVhHNGdJQ0FnZEdocGN5NWZiMjVFWVhsRGJHbGpheWhsTG5SaGNtZGxkQ2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvZEMrMExIUmk5R0MwTGpRdFNEUmhkQyswTExRdGRHQTBMQmNjbHh1SUNvZ1FIQmhjbUZ0SUh0RmRtVnVkSDBnWlNCRVQwMGcwWUhRdnRDeDBZdlJndEM0MExWY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgyOXVSR0Y1VFc5MWMyVkZiblJsY2tWMlpXNTBJRDBnWm5WdVkzUnBiMjRvWlNrZ2UxeHlYRzRnSUNBZ2RHaHBjeTVmYjI1RVlYbE5iM1Z6WlVWdWRHVnlLR1V1ZEdGeVoyVjBLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2wwTDdRc3RDMTBZQWcwTDNRc0NEUmpkQzcwTFhRdk5DMTBMM1JndEMxSU5DMDBMM1JqMXh5WEc0Z0tpQkFjR0Z5WVcwZ2UwVnNaVzFsYm5SOUlDUmtZWGtnU0ZSTlRDRFFyZEM3MExYUXZOQzEwTDNSZ2x4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZmIyNUVZWGxOYjNWelpVVnVkR1Z5SUQwZ1puVnVZM1JwYjI0b0pHUmhlU2tnZTF4eVhHNGdJQ0FnYVdZZ0tDRjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dElIeDhJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdsbUlDZ2taR0Y1TG1SaGRHRnpaWFF1ZEdsdFpTQTlQU0IwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRMbWRsZEZScGJXVW9LU2tnZTF4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQmpiMjV6ZENCa1lYUmxYM1J2SUQwZ2JtVjNJRVJoZEdVb2NHRnljMlZKYm5Rb0pHUmhlUzVrWVhSaGMyVjBMblJwYldVc0lERXdLU2s3WEhKY2JpQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDaDBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dExDQmtZWFJsWDNSdktUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DYTBMdlF1TkM2SU5DLzBMNGcwTFRRdmRHT1hISmNiaUFxSUVCd1lYSmhiU0I3Uld4bGJXVnVkSDBnSkdSaGVTQklWRTFNSU5DdDBMdlF0ZEM4MExYUXZkR0NYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDl2YmtSaGVVTnNhV05ySUQwZ1puVnVZM1JwYjI0b0pHUmhlU2tnZTF4eVhHNGdJQ0FnTHk4ZzBMVFF0ZEM5MFl3ZzBMZlFzTkN4MEx2UXZ0QzYwTGpSZ05DKzBMTFFzTkM5WEhKY2JpQWdJQ0JwWmlBb0pHUmhlUzVqYkdGemMweHBjM1F1WTI5dWRHRnBibk1vSjJsekxXUnBjMkZpYkdWa0p5a3BJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBMTFJpOUN4MEw3UmdDRFF2dEMwMEwzUXZ0QzVJTkMwMExEUmd0R0xYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxuTnBibWRzWlUxdlpHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbkpoYm1kbFVtVnpaWFFvS1R0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dElEMGdibVYzSUVSaGRHVW9jR0Z5YzJWSmJuUW9KR1JoZVM1a1lYUmhjMlYwTG5ScGJXVXNJREV3S1NsY2NseHVJQ0FnSUNBZ0lDQWtaR0Y1TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMmx6TFhObGJHVmpkR1ZrSnlrN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlkyRnNiR0poWTJzb0oyUmhlVk5sYkdWamRDY3NJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMHBPMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFJnZEN4MFlEUXZ0R0JJTkN5MFl2UXNkR0EwTERRdmRDOTBMN1FzOUMrSU5HQTBMRFF2ZEMxMExVZzBMVFF1TkN3MEwvUXNOQzMwTDdRdmRDd1hISmNiaUFnSUNCcFppQW9kR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTQW1KaUIwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVjbUZ1WjJWU1pYTmxkQ2dwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDUmtZWGt1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25hWE10YzJWc1pXTjBaV1FuS1R0Y2NseHVYSEpjYmlBZ0lDQXZMeURRc3RHTDBMSFJnTkN3MEwzUXNDRFF2ZEN3MFlmUXNOQzcwWXpRdmRDdzBZOGdMeURRdXRDKzBMM1F0ZEdIMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBZ0lDQnBaaUFvSVhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBwSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dElEMGdibVYzSUVSaGRHVW9jR0Z5YzJWSmJuUW9KR1JoZVM1a1lYUmhjMlYwTG5ScGJXVXNJREV3S1NrN1hISmNiaUFnSUNCOUlHVnNjMlVnYVdZZ0tDRjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdklEMGdibVYzSUVSaGRHVW9jR0Z5YzJWSmJuUW9KR1JoZVM1a1lYUmhjMlYwTG5ScGJXVXNJREV3S1NrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdhV1lnS0hSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBnSmlZZ2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQXZMeURRdE5DKzBML1JnOUdCMFlMUXVOQzgwWXZRdVNEUXROQzQwTERRdjlDdzBMZlF2dEM5WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLQ0YwYUdsekxtZGxkRWx6VW1GdVoyVlRaV3hsWTNSaFlteGxLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMHNJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG5KaGJtZGxVbVZ6WlhRb0tUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTV5WVc1blpWTmxiR1ZqZENoMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0TENCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieWs3WEhKY2JpQWdJQ0I5WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFrdEM0MExmUmc5Q3cwTHZSak5DOTBZdlF1U0RSZ2RDeDBZRFF2dEdCSU5DeTBZdlF0TkMxMEx2UXRkQzkwTDNSaTlHRklOQzAwTERSZ2x4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZmNtRnVaMlZXYVhOMVlXeFNaWE5sZENBOUlHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdZMjl1YzNRZ0pHUmhlWE1nUFNCMGFHbHpMbDhrYlc5dWRHaHpMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29KeTVFWVhsYlpHRjBZUzEwYVcxbFhTY3BPMXh5WEc0Z0lDQWdKR1JoZVhNdVptOXlSV0ZqYUNna1pHRjVJRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQWtaR0Y1TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJsekxYTmxiR1ZqZEdWa0p5d2dKMmx6TFhObGJHVmpkR1ZrTFdaeWIyMG5MQ0FuYVhNdGMyVnNaV04wWldRdGRHOG5MQ0FuYVhNdGMyVnNaV04wWldRdFltVjBkMlZsYmljcE8xeHlYRzRnSUNBZ2ZTazdYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBML1JnTkdQMFlmUXRkQzhJTkMvMEw3UXROR0IwTHJRc05DMzBMclJnMXh5WEc0Z0lDQWdkR2hwY3k1ZmRHOXZiSFJwY0VocFpHVW9LVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ1MwTGpRdDlHRDBMRFF1OUdNMEwzUXZ0QzFJTkN5MFl2UXROQzEwTHZRdGRDOTBMalF0U0RRdE5DdzBZSmNjbHh1SUNvZ1FIQmhjbUZ0SUh0RVlYUmxmU0JrWVhSbFgyWnliMjBnMEozUXNOR0gwTERRdTlHTTBMM1FzTkdQSU5DMDBMRFJndEN3WEhKY2JpQXFJRUJ3WVhKaGJTQjdSR0YwWlgwZ1pHRjBaVjkwYnlBZ0lOQ2EwTDdRdmRDMTBZZlF2ZEN3MFk4ZzBMVFFzTkdDMExCY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgzSmhibWRsVm1semRXRnNVMlZzWldOMElEMGdablZ1WTNScGIyNG9aR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0JwWmlBb1pHRjBaVjltY205dElDWW1JR1JoZEdWZlpuSnZiU0JwYm5OMFlXNWpaVzltSUVSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCa1lYUmxYMlp5YjIwdWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnYVdZZ0tHUmhkR1ZmZEc4Z0ppWWdaR0YwWlY5MGJ5QnBibk4wWVc1alpXOW1JRVJoZEdVcElIdGNjbHh1SUNBZ0lDQWdJQ0JrWVhSbFgzUnZMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lHeGxkQ0IwYVcxbFgyWnliMjBnUFNCa1lYUmxYMlp5YjIwZ2FXNXpkR0Z1WTJWdlppQkVZWFJsSUQ4Z1pHRjBaVjltY205dExtZGxkRlJwYldVb0tTQTZJREE3WEhKY2JpQWdJQ0JzWlhRZ2RHbHRaVjkwYnlBOUlHUmhkR1ZmZEc4Z2FXNXpkR0Z1WTJWdlppQkVZWFJsSUQ4Z1pHRjBaVjkwYnk1blpYUlVhVzFsS0NrZ09pQXdPMXh5WEc0Z0lDQWdhV1lnS0hScGJXVmZabkp2YlNBK0lIUnBiV1ZmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0JiZEdsdFpWOW1jbTl0TENCMGFXMWxYM1J2WFNBOUlGdDBhVzFsWDNSdkxDQjBhVzFsWDJaeWIyMWRPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQ3kwWXZRdE5DMTBMdlF0ZEM5MExqUXRTRFF0TkN3MFlJZzBMelF0ZEMyMExUUmd5RFF2ZEN3MFlmUXNOQzcwWXpRdmRDKzBMa2cwTGdnMExyUXZ0QzkwTFhSaDlDOTBMN1F1Vnh5WEc0Z0lDQWdZMjl1YzNRZ0pHUmhlWE1nUFNCMGFHbHpMbDhrYlc5dWRHaHpMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29KeTVFWVhsYlpHRjBZUzEwYVcxbFhTY3BPMXh5WEc0Z0lDQWdabTl5SUNoc1pYUWdhU0E5SURBN0lHa2dQQ0FrWkdGNWN5NXNaVzVuZEdnN0lDc3JhU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDUmtZWGx6VzJsZExtTnNZWE56VEdsemRDNTBiMmRuYkdVb0oybHpMWE5sYkdWamRHVmtMV0psZEhkbFpXNG5MQ0FrWkdGNWMxdHBYUzVrWVhSaGMyVjBMblJwYldVZ1BpQjBhVzFsWDJaeWIyMGdKaVlnSkdSaGVYTmJhVjB1WkdGMFlYTmxkQzUwYVcxbElEd2dkR2x0WlY5MGJ5azdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBMTFJpOUMwMExYUXU5QzEwTDNRdU5DMUlOQzkwTERSaDlDdzBMdlJqTkM5MEw3UXVTRFF1Q0RRdXRDKzBMM1F0ZEdIMEwzUXZ0QzVJTkMvMEw3UXQ5QzQwWWJRdU5DNFhISmNiaUFnSUNCamIyNXpkQ0FrWkdGNVgyWnliMjBnUFNCMGFHbHpMbDhrWjJWMFJHRjVRbmxFWVhSbEtHUmhkR1ZmWm5KdmJTazdYSEpjYmlBZ0lDQmpiMjV6ZENBa1pHRjVYM1J2SUQwZ2RHaHBjeTVmSkdkbGRFUmhlVUo1UkdGMFpTaGtZWFJsWDNSdktUdGNjbHh1WEhKY2JpQWdJQ0F2THlEUXV0QzEwWWdnMExUUXU5R1BJTkN4MFl2UmdkR0MwWURRdnRDejBMNGcwWUhRc2RHQTBMN1JnZEN3SU5HQjBZTFFzTkdBMEw3UXM5QytJTkN5MFl2UXROQzEwTHZRdGRDOTBMalJqMXh5WEc0Z0lDQWdhV1lnS0hSb2FYTXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBMaVJrWVhsZlpuSnZiVjl2YkdRZ0ppWWdkR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFRaV3hsWTNRdUpHUmhlVjltY205dFgyOXNaQ0FoUFNBa1pHRjVYMlp5YjIwcElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDNGtaR0Y1WDJaeWIyMWZiMnhrTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJsekxYTmxiR1ZqZEdWa0p5d2dKMmx6TFhObGJHVmpkR1ZrTFdaeWIyMG5LVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFF1dEMxMFlnZzBMVFF1OUdQSU5DeDBZdlJnZEdDMFlEUXZ0Q3owTDRnMFlIUXNkR0EwTDdSZ2RDd0lOR0IwWUxRc05HQTBMN1FzOUMrSU5DeTBZdlF0TkMxMEx2UXRkQzkwTGpSajF4eVhHNGdJQ0FnYVdZZ0tIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wTGlSa1lYbGZkRzlmYjJ4a0lDWW1JSFJvYVhNdVgzSmhibWRsVm1semRXRnNVMlZzWldOMExpUmtZWGxmZEc5ZmIyeGtJQ0U5SUNSa1lYbGZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGTmxiR1ZqZEM0a1pHRjVYM1J2WDI5c1pDNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZHBjeTF6Wld4bFkzUmxaQ2NzSUNkcGN5MXpaV3hsWTNSbFpDMTBieWNwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lHbG1JQ2drWkdGNVgyWnliMjBwSUh0Y2NseHVJQ0FnSUNBZ0lDQWtaR0Y1WDJaeWIyMHVZMnhoYzNOTWFYTjBMbUZrWkNnbmFYTXRjMlZzWldOMFpXUW5MQ0FuYVhNdGMyVnNaV04wWldRdFpuSnZiU2NwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lHbG1JQ2drWkdGNVgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ0pHUmhlVjkwYnk1amJHRnpjMHhwYzNRdVlXUmtLQ2RwY3kxelpXeGxZM1JsWkNjc0lDZHBjeTF6Wld4bFkzUmxaQzEwYnljcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5HQjBMN1JoZEdBMExEUXZkQzEwTDNRdU5DMUlOQ3lJTkM2MExYUmlGeHlYRzRnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1F1SkdSaGVWOW1jbTl0WDI5c1pDQTlJQ1JrWVhsZlpuSnZiVHRjY2x4dUlDQWdJSFJvYVhNdVgzSmhibWRsVm1semRXRnNVMlZzWldOMExpUmtZWGxmZEc5ZmIyeGtJRDBnSkdSaGVWOTBienRjY2x4dVhISmNiaUFnSUNCMGFHbHpMbDl6Wld4bFkzUnBiMjR1SkdSaGVWOW1jbTl0SUQwZ0pHUmhlVjltY205dE8xeHlYRzRnSUNBZ2RHaHBjeTVmYzJWc1pXTjBhVzl1TGlSa1lYbGZkRzhnUFNBa1pHRjVYM1J2TzF4eVhHNWNjbHh1SUNBZ0lHbG1JQ2drWkdGNVgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWkdGNWN5QTlJRTFoZEdndVpteHZiM0lvVFdGMGFDNWhZbk1vZEdsdFpWOW1jbTl0SUMwZ2RHbHRaVjkwYnlrZ0x5QTROalF3TUdVektTQXJJREU3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmZEc5dmJIUnBjRk5vYjNjb0pHUmhlVjkwYnl3Z1pHRjVjeWs3WEhKY2JpQWdJQ0I5WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFuOUMrMExyUXNOQzNJTkMvMEw3UXROR0IwTHJRc05DMzBMclF1Rnh5WEc0Z0tpQkFjR0Z5WVcwZ2UwVnNaVzFsYm5SOUlDUmtZWGtnMEpMUmk5Q3gwWURRc05DOTBMM1JpOUM1SU5DMDBMWFF2ZEdNWEhKY2JpQXFJRUJ3WVhKaGJTQjdUblZ0WW1WeWZTQWdaR0Y1Y3lEUW10QyswTHZRdU5HSDBMWFJnZEdDMExMUXZpRFF0TkM5MExYUXVWeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZkRzl2YkhScGNGTm9iM2NnUFNCbWRXNWpkR2x2Ymlna1pHRjVMQ0JrWVhsektTQjdYSEpjYmlBZ0lDQjBhR2x6TGw4a2RHOXZiSFJwY0VOdmJuUmxiblF1ZEdWNGRFTnZiblJsYm5RZ1BTQjBhR2x6TG05d2RHbHZibk11Wm1sc2RHVnlMblJ2YjJ4MGFYQlVaWGgwTG1OaGJHd29kR2hwY3l3Z1pHRjVjeWtnZkh3Z0p5YzdYSEpjYmlBZ0lDQjBhR2x6TGw4a2RHOXZiSFJwY0M1amJHRnpjMHhwYzNRdWRHOW5aMnhsS0NkcGN5MXphRzkzSnl3Z2RHaHBjeTVmSkhSdmIyeDBhWEF1ZEdWNGRFTnZiblJsYm5RdWJHVnVaM1JvS1R0Y2NseHVJQ0FnSUhSb2FYTXVYM1J2YjJ4MGFYQlZjR1JoZEdVb0pHUmhlU2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFudEN4MEwzUXZ0Q3kwTHZRdGRDOTBMalF0U0RRdjlDKzBMZlF1TkdHMExqUXVDRFF2OUMrMExUUmdkQzYwTERRdDlDNjBMaGNjbHh1SUNvZ1FIQmhjbUZ0SUh0RmJHVnRaVzUwZlNBa1pHRjVJTkNTMFl2UXNkR0EwTERRdmRDOTBZdlF1U0RRdE5DMTBMM1JqRnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmZEc5dmJIUnBjRlZ3WkdGMFpTQTlJR1oxYm1OMGFXOXVLQ1JrWVhrcElIdGNjbHh1SUNBZ0lHeGxkQ0I0SUQwZ01EdGNjbHh1SUNBZ0lHeGxkQ0I1SUQwZ01EdGNjbHh1SUNBZ0lHeGxkQ0FrWld3Z1BTQWtaR0Y1TzF4eVhHNGdJQ0FnWkc4Z2UxeHlYRzRnSUNBZ0lDQWdJSGtnS3owZ0pHVnNMbTltWm5ObGRGUnZjRHRjY2x4dUlDQWdJQ0FnSUNCNElDczlJQ1JsYkM1dlptWnpaWFJNWldaME8xeHlYRzRnSUNBZ2ZTQjNhR2xzWlNBb0tDUmxiQ0E5SUNSbGJDNXZabVp6WlhSUVlYSmxiblFwSUNZbUlDUmxiQ0FoUFNCMGFHbHpMbDhrY0dsamEyVnlLVHRjY2x4dVhISmNiaUFnSUNCMGFHbHpMbDhrZEc5dmJIUnBjQzV6ZEhsc1pTNTBiM0FnUFNCTllYUm9Mbkp2ZFc1a0tIa2dMU0IwYUdsekxsOGtkRzl2YkhScGNDNXZabVp6WlhSSVpXbG5hSFFwSUNzZ0ozQjRKenRjY2x4dUlDQWdJSFJvYVhNdVh5UjBiMjlzZEdsd0xuTjBlV3hsTG14bFpuUWdQU0JOWVhSb0xuSnZkVzVrS0hnZ0t5QWtaR0Y1TG05bVpuTmxkRmRwWkhSb0lDOGdNaUF0SUhSb2FYTXVYeVIwYjI5c2RHbHdMbTltWm5ObGRGZHBaSFJvSUM4Z01pa2dLeUFuY0hnbk8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtIUXV0R0EwWXZSZ3RHTUlOQy8wTDdRdE5HQjBMclFzTkMzMExyUmcxeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZkRzl2YkhScGNFaHBaR1VnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lIUm9hWE11WHlSMGIyOXNkR2x3TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJsekxYTm9iM2NuS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNpMExYUXV0R0IwWUlnMEwvUXZ0QzAwWUhRdXRDdzBMZlF1dEM0SU5DLzBMNGcwWVBRdk5DKzBMdlJoOUN3MEwzUXVOR09YSEpjYmlBcUlFQndZWEpoYlNBZ2UwNTFiV0psY24wZ1pHRjVjeURRbXRDKzBMdlF1TkdIMExYUmdkR0MwTExRdmlEUXROQzkwTFhRdVZ4eVhHNGdLaUJBY21WMGRYSnVJSHRUZEhKcGJtZDlYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDltYVd4MFpYSlViMjlzZEdsd1ZHVjRkQ0E5SUdaMWJtTjBhVzl1S0dSaGVYTXBJSHRjY2x4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TG5Cc2RYSmhiQ2hrWVhsekxDQmJKeVZrSU5DMDBMWFF2ZEdNSnl3Z0p5VmtJTkMwMEwzUmp5Y3NJQ2NsWkNEUXROQzkwTFhRdVNkZEtTNXlaWEJzWVdObEtDY2xaQ2NzSUdSaGVYTXBPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLVFF1TkM3MFl6Umd0R0FJTkM5MExYUXROQyswWUhSZ3RHRDBML1F2ZEdMMFlVZzBMVFF2ZEMxMExrZzBML1F2aURSZzlDODBMN1F1OUdIMExEUXZkQzQwWTVjY2x4dUlDb2dRSEpsZEhWeWJpQjdRbTl2YkdWaGJuMWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYMlpwYkhSbGNreHZZMnRFWVhseklEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0F2THlEUXN0R0IwTFVnMExUUXZkQzRJTkMwMEw3UmdkR0MwWVBRdjlDOTBZdGNjbHh1SUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2gwTDdRc2RHTDBZTFF1TkMxSU5DNDBMZlF2TkMxMEwzUXRkQzkwTGpSanlEUmdOQ3cwTGZRdk5DMTBZRFF2dEN5SU5DKzBMclF2ZEN3WEhKY2JpQXFJRUJ3WVhKaGJTQjdSWFpsYm5SOUlHVWdSRTlOSU5HQjBMN1FzZEdMMFlMUXVOQzFYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDl2YmxkcGJtUnZkMUpsYzJsNlpVVjJaVzUwSUQwZ1puVnVZM1JwYjI0b1pTa2dlMXh5WEc0Z0lDQWdhV1lnS0hSb2FYTXVYM05sYkdWamRHbHZiaTRrWkdGNVgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmZEc5dmJIUnBjRlZ3WkdGMFpTaDBhR2x6TGw5elpXeGxZM1JwYjI0dUpHUmhlVjkwYnlrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdiR1YwSUdKeVpXRnJjRzlwYm5RZ1BTQXdPMXh5WEc0Z0lDQWdZMjl1YzNRZ1luSmxZV3R3YjJsdWRITWdQU0JQWW1wbFkzUXVhMlY1Y3loMGFHbHpMbTl3ZEdsdmJuTXVZbkpsWVd0d2IybHVkSE1wTG5OdmNuUW9LR0VzSUdJcElEMCtJR0VnTFNCaUtUdGNjbHh1SUNBZ0lHWnZjaUFvYkdWMElHa2dhVzRnWW5KbFlXdHdiMmx1ZEhNcElIdGNjbHh1SUNBZ0lDQWdJQ0JwWmlBb2QybHVaRzkzTG1sdWJtVnlWMmxrZEdnZ1BEMGdZbkpsWVd0d2IybHVkSE5iYVYwcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1luSmxZV3R3YjJsdWRDQTlJR0p5WldGcmNHOXBiblJ6VzJsZE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCaWNtVmhhenRjY2x4dUlDQWdJQ0FnSUNCOVhISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdkR2hwY3k1ZmMyVjBRbkpsWVd0d2IybHVkQ2hpY21WaGEzQnZhVzUwS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNqMFlIUmd0Q3cwTDNRdnRDeTBMclFzQ0RSZ2RDKzBZSFJndEMrMFkvUXZkQzQwWThnMFlEUXRkQzkwTFRRdGRHQTBMQWcwTC9RdnRDMElOR0EwTERRdDlDOTBZdlF0U0RSamRDNjBZRFFzTkM5MFl0Y2NseHVJQ29nUUhCaGNtRnRJSHRPZFcxaVpYSjlJR0p5WldGcmNHOXBiblFnMEpyUXU5R08wWWNnMExqUXR5QjBhR2x6TG05d2RHbHZibk11WW5KbFlXdHdiMmx1ZEhNZ0tOQ28wTGpSZ05DNDBMM1FzQ0RSamRDNjBZRFFzTkM5MExBcFhISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOXpaWFJDY21WaGEzQnZhVzUwSUQwZ1puVnVZM1JwYjI0b1luSmxZV3R3YjJsdWRDa2dlMXh5WEc0Z0lDQWdMeThnMEw3UmdpRFF2ZEMxMEwzUmc5QzIwTDNRdnRDNUlOQy8wTFhSZ05DMTBZRFF1TkdCMEw3UXN0QzYwTGhjY2x4dUlDQWdJR2xtSUNoMGFHbHpMbDlpY21WaGEzQnZhVzUwSUQwOUlHSnlaV0ZyY0c5cGJuUXBJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0I5WEhKY2JpQWdJQ0IwYUdsekxsOWljbVZoYTNCdmFXNTBJRDBnWW5KbFlXdHdiMmx1ZER0Y2NseHVYSEpjYmlBZ0lDQnBaaUFvSVhSb2FYTXViM0IwYVc5dWN5NWljbVZoYTNCdmFXNTBjMXRpY21WaGEzQnZhVzUwWFNrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJqdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JQWW1wbFkzUXVZWE56YVdkdUtIUm9hWE11YjNCMGFXOXVjeXdnZEdocGN5NXZjSFJwYjI1ekxtSnlaV0ZyY0c5cGJuUnpXMkp5WldGcmNHOXBiblJkS1R0Y2NseHVJQ0FnSUhSb2FYTXVYeVJqY21WaGRHVk5iMjUwYUhNb2RHaHBjeTVmYzJWc1pXTjBaV1JFWVhSbEtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DdDBMdlF0ZEM4MExYUXZkR0NJTkM2MExEUXU5QzEwTDNRdE5DdzBZRFF2ZEMrMExQUXZpRFF0TkM5MFk5Y2NseHVJQ29nUUhCaGNtRnRJQ0I3UkdGMFpYMGdaR0YwWlNEUWxOQ3cwWUxRc0Z4eVhHNGdLaUJBY21WMGRYSnVJSHRGYkdWdFpXNTBmU0FnSUVoVVRVd2cwWTNRdTlDMTBMelF0ZEM5MFlKY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVh5Um5aWFJFWVhsQ2VVUmhkR1VnUFNCbWRXNWpkR2x2Ymloa1lYUmxLU0I3WEhKY2JpQWdJQ0JqYjI1emRDQjBhVzFsSUQwZ1pHRjBaU0JwYm5OMFlXNWpaVzltSUVSaGRHVWdQeUJrWVhSbExtZGxkRlJwYldVb0tTQTZJREE3WEhKY2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZkpHMXZiblJvY3k1eGRXVnllVk5sYkdWamRHOXlLQ2N1UkdGNVcyUmhkR0V0ZEdsdFpUMWNJaWNnS3lCMGFXMWxJQ3NnSjF3aVhTY3BPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLRFF0ZEM5MExUUXRkR0FJTkMwMEwzUmp5QXRJTkMzMExEUXM5QzcwWVBSaU5DNjBMaGNjbHh1SUNvZ1FISmxkSFZ5YmlCN1JXeGxiV1Z1ZEgxY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVh5UmpjbVZoZEdWRmJYQjBlVVJoZVNBOUlHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdZMjl1YzNRZ0pHUmhlU0E5SUhSb2FYTXVYeVJqY21WaGRHVkZiR1Z0Wlc1MEtGeHlYRzRnSUNBZ0lDQWdJR0E4WkdsMklHTnNZWE56UFZ3aVJHRjVJR2x6TFdWdGNIUjVYQ0krUEM5a2FYWStZRnh5WEc0Z0lDQWdLVHRjY2x4dVhISmNiaUFnSUNCeVpYUjFjbTRnSkdSaGVUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DaDBMN1F0OUMwMExEUXZkQzQwTFVnMFkzUXU5QzEwTHpRdGRDOTBZTFFzQ0RRdU5DM0lFaFVUVXdnMFlMUXRkQzYwWUhSZ3RDd1hISmNiaUFxSUVCd1lYSmhiU0FnZTFOMGNtbHVaMzBnYUhSdGJDQklWRTFNSU5HQzBMWFF1dEdCMFlKY2NseHVJQ29nUUhKbGRIVnliaUI3Uld4bGJXVnVkSDFjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WHlSamNtVmhkR1ZGYkdWdFpXNTBJRDBnWm5WdVkzUnBiMjRvYUhSdGJDa2dlMXh5WEc0Z0lDQWdZMjl1YzNRZ1pHbDJJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDZ25aR2wySnlrN1hISmNiaUFnSUNCa2FYWXVhVzV6WlhKMFFXUnFZV05sYm5SSVZFMU1LQ2RoWm5SbGNtSmxaMmx1Snl3Z2FIUnRiQ2s3WEhKY2JpQWdJQ0J5WlhSMWNtNGdaR2wyTG1Ob2FXeGtjbVZ1TG14bGJtZDBhQ0ErSURFZ1B5QmthWFl1WTJocGJHUnlaVzRnT2lCa2FYWXVabWx5YzNSRmJHVnRaVzUwUTJocGJHUTdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lCVFlXWmxJTkN5MFl2UXQ5QyswTElnMExMUXZkQzEwWWpRdmRDNDBZVWcwWUhRdnRDeDBZdlJndEM0MExrZzBMclF2dEM4MEwvUXZ0QzkwTFhRdmRHQzBMQmNjbHh1SUNvZ1FIQmhjbUZ0SUh0VGRISnBibWQ5SUdZZzBKalF2TkdQSU5HQjBMN1FzZEdMMFlMUXVOR1BYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDlqWVd4c1ltRmpheUE5SUdaMWJtTjBhVzl1S0dZcElIdGNjbHh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR2hwY3k1dmNIUnBiMjV6TG05dVcyWmRJRDA5SUNkbWRXNWpkR2x2YmljcElIdGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1dmNIUnBiMjV6TG05dVcyWmRMbUZ3Y0d4NUtIUm9hWE1zSUZ0ZExuTnNhV05sTG1OaGJHd29ZWEpuZFcxbGJuUnpMQ0F4S1NrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdjbVYwZFhKdU8xeHlYRzU5WEhKY2JseHlYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQkVZWFJsVW1GdVoyVlFhV05yWlhJN1hISmNiaUpkTENKemIzVnlZMlZTYjI5MElqb2lJbjA9IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCBEYXRlUmFuZ2VQaWNrZXIsIHtMT0NLX1VOQVZBSUxBQkxFLCBMT0NLX0xPQ0tFRH0gZnJvbSAnLi4vLi4vZGlzdC9kYXRlcmFuZ2VwaWNrZXInO1xyXG5cclxuY29uc3QgJGZvcm0gPSBkb2N1bWVudC5mb3Jtc1swXTtcclxuY29uc3QgJGRhdGVfZnJvbSA9ICRmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZGF0ZV9mcm9tXCJdJyk7XHJcbmNvbnN0ICRkYXRlX3RvICAgPSAkZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImRhdGVfdG9cIl0nKTtcclxuXHJcbi8vINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvQtSDQtNCw0YLRi1xyXG5jb25zdCBibG9ja2VkRGF0ZXMgPSB7fTtcclxuY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbmRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbmZvciAobGV0IGkgPSAwOyBpIDwgNjA7ICsraSkge1xyXG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjYpIHtcclxuICAgICAgICBibG9ja2VkRGF0ZXNbZGF0ZV0gPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7XHJcbn1cclxuXHJcbm5ldyBEYXRlUmFuZ2VQaWNrZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RhdGVyYW5nZXBpY2tlcicpLCB7XHJcbiAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpLFxyXG4gICAgbWF4RGF0ZTogbmV3IERhdGUoJzIwMjItMDUtMjAnKSxcclxuICAgIG1vbnRoc0NvdW50OiAyLFxyXG4gICAgcGVyUm93OiAzLFxyXG4gICAgc2luZ2xlTW9kZTogZmFsc2UsXHJcbiAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgIDk2MDoge1xyXG4gICAgICAgICAgICBtb250aHNDb3VudDogMTIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICA3MjA6IHtcclxuICAgICAgICAgICAgbW9udGhzQ291bnQ6IDMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICA0ODA6IHtcclxuICAgICAgICAgICAgbW9udGhzQ291bnQ6IDEsXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBvbjoge1xyXG4gICAgICAgIHJhbmdlU2VsZWN0OiBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgJGRhdGVfZnJvbS52YWx1ZSA9IGRhdGVfZnJvbS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICAgICAgJGRhdGVfdG8udmFsdWUgPSBkYXRlX3RvLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGF5U2VsZWN0OiBmdW5jdGlvbihkYXRlX2Zyb20pIHtcclxuICAgICAgICAgICAgJGRhdGVfZnJvbS52YWx1ZSA9IGRhdGVfZnJvbS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGZpbHRlcjoge1xyXG4gICAgICAgIGxvY2tEYXlzOiBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgICAgIGlmIChibG9ja2VkRGF0ZXNbZGF0ZV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBMT0NLX0xPQ0tFRDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG9vbHRpcFRleHQ6IGZ1bmN0aW9uKGRheXMpIHtcclxuICAgICAgICAgICAgY29uc3QgbmlnaHRzID0gZGF5cyAtIDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsdXJhbChuaWdodHMsIFsnJWQg0L3QvtGH0YwnLCAnJWQg0L3QvtGH0LgnLCAnJWQg0L3QvtGH0LXQuSddKS5yZXBsYWNlKCclZCcsIG5pZ2h0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==