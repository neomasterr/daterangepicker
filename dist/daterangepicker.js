(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Daterangepicker", [], factory);
	else if(typeof exports === 'object')
		exports["Daterangepicker"] = factory();
	else
		root["Daterangepicker"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!*****************************!*\
  !*** ./src/scss/index.scss ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
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
 * @return {String} Дата в формате YYYY-MM-DD
 */
DateRangePicker.prototype.getDateFrom = function() {
    return this._getInputValue(INDEX_DATE_FROM);
}

/**
 * Выбранная дата (singleMode: true)
 * @return {String} Дата в формате YYYY-MM-DD
 */
DateRangePicker.prototype.getDate = DateRangePicker.prototype.getDateFrom;

/**
 * Выбранная конечная дата
 * @return {String} Дата в формате YYYY-MM-DD
 */
DateRangePicker.prototype.getDateTo = function() {
    return this._getInputValue(INDEX_DATE_TO);
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
 * @return {Number} index Индекс инпута
 */
DateRangePicker.prototype._getInputValue = function(index) {
    return this._$inputs[index] ? this._$inputs[index].value : '';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9zY3NzL2luZGV4LnNjc3M/NTYxOCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9zcmMvanMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87O1VDVkE7VUFDQTs7Ozs7V0NEQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7OztBQ05BOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNPO0FBQ0E7O0FBRVA7QUFDQTs7QUFFQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQ7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsa0JBQWtCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWUsZUFBZSxFQUFDIiwiZmlsZSI6ImRhdGVyYW5nZXBpY2tlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiRGF0ZXJhbmdlcGlja2VyXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vINGB0L7RgdGC0L7Rj9C90LjRjyDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbmV4cG9ydCBjb25zdCBMT0NLX1VOQVZBSUxBQkxFID0gMTtcclxuZXhwb3J0IGNvbnN0IExPQ0tfTE9DS0VEICAgICAgPSAyO1xyXG5cclxuY29uc3QgSU5ERVhfREFURV9GUk9NID0gMDtcclxuY29uc3QgSU5ERVhfREFURV9UTyAgID0gMTtcclxuXHJcbmZ1bmN0aW9uIERhdGVSYW5nZVBpY2tlcigkY29udGFpbmVyLCBvcHRpb25zID0ge30pIHtcclxuICAgIC8vINC+0YIg0L/QvtCy0YLQvtGA0L3QvtC5INC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4XHJcbiAgICBpZiAoJGNvbnRhaW5lci5pbnN0YW5jZSkge1xyXG4gICAgICAgIHJldHVybiAkY29udGFpbmVyLmluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgJGNvbnRhaW5lci5pbnN0YW5jZSA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5fJGNvbnRhaW5lciA9ICRjb250YWluZXI7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgIGZpcnN0RGF5T2ZUaGVXZWVrOiBvcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrIHx8IDEsICAgICAgICAgIC8vINC/0LXRgNCy0YvQuSDQtNC10L3RjCDQvdC10LTQtdC70LgsIDAgPSDQstGBLCAxID0g0L/QvSwgLi4uXHJcbiAgICAgICAgc2luZ2xlTW9kZTogICAgICAgIG9wdGlvbnMuc2luZ2xlTW9kZSAgICAgICAgfHwgZmFsc2UsICAgICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLINCy0LzQtdGB0YLQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBsb2NhbGU6ICAgICAgICAgICAgb3B0aW9ucy5sb2NhbGUgICAgICAgICAgICB8fCAncnUtUlUnLFxyXG4gICAgICAgIG1pbkRheXM6ICAgICAgICAgICBvcHRpb25zLm1pbkRheXMgICAgICAgICAgIHx8IDEsICAgICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LTQuNCw0L/QsNC30L7QvdC1XHJcbiAgICAgICAgbW9udGhzQ291bnQ6ICAgICAgIG9wdGlvbnMubW9udGhzQ291bnQgICAgICAgfHwgMTIsXHJcbiAgICAgICAgcGVyUm93OiAgICAgICAgICAgIG9wdGlvbnMucGVyUm93ICAgICAgICAgICAgfHwgdW5kZWZpbmVkLCAgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LzQtdGB0Y/RhtC10LIg0LIg0YDRj9C00YNcclxuICAgICAgICBtaW5EYXRlOiAgICAgICAgICAgb3B0aW9ucy5taW5EYXRlICAgICAgICAgICB8fCBuZXcgRGF0ZSgpLCAvLyDQvNC40L3QuNC80LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgICAgbWF4RGF0ZTogICAgICAgICAgIG9wdGlvbnMubWF4RGF0ZSAgICAgICAgICAgfHwgdW5kZWZpbmVkLFxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiAgICAgICBvcHRpb25zLmJyZWFrcG9pbnRzICAgICAgIHx8IHt9LFxyXG4gICAgICAgIGludGVybmFsSW5wdXRzOiAgICBvcHRpb25zLmludGVybmFsSW5wdXRzICAgIHx8IHRydWUsICAgICAgIC8vINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1INCy0YHRgtGA0L7QtdC90L3Ri9GFINC40L3Qv9GD0YLQvtCyXHJcbiAgICAgICAgLy8g0YHQvtCx0YvRgtC40Y9cclxuICAgICAgICBvbjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIHJhbmdlU2VsZWN0OiBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICAgICAgICBkYXlTZWxlY3Q6ICAgbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC+0LTQvdC+0Lkg0LTQsNGC0YsgKNGC0L7Qu9GM0LrQviDQv9GA0Lggc2luZ2xlTW9kZTogdHJ1ZSlcclxuICAgICAgICB9LCBvcHRpb25zLm9uIHx8IHt9KSxcclxuICAgICAgICAvLyDRhNC40LvRjNGC0YDRg9GO0YnQuNC1INC80LXRgtC+0LTRi1xyXG4gICAgICAgIGZpbHRlcjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIGxvY2tEYXlzOiAgICB0aGlzLl9maWx0ZXJMb2NrRGF5cywgICAgLy8gY2FsbGJhY2soZGF0ZSkg0YTRg9C90LrRhtC40Y8g0LHQu9C+0LrQuNGA0L7QstCw0L3QuNGPINC00LDRgiwgdHJ1ZS9MT0NLXHJcbiAgICAgICAgICAgIHRvb2x0aXBUZXh0OiB0aGlzLl9maWx0ZXJUb29sdGlwVGV4dCwgLy8gY2FsbGJhY2soZGF5cykg0LLRi9Cy0L7QtCDRgtC10LrRgdGC0LAg0L/QvtC00YHQutCw0LfQutC4XHJcbiAgICAgICAgfSwgb3B0aW9ucy5maWx0ZXIgfHwge30pLFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0YDRj9C00L3QvtGB0YLRjFxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGVyUm93ID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnBlclJvdyA9IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMubWluRGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtC/0YbQuNC4INC00LvRjyDRjdC60YDQsNC90L7QsiDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW3RoaXMuX2JyZWFrcG9pbnQgPSAwXSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyk7XHJcblxyXG4gICAgLy8g0YLQtdC60YPRidC40Lkg0LTQtdC90YxcclxuICAgIHRoaXMuX3RvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIHRoaXMuX3RvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIHRoaXMuXyRwaWNrZXIgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlclwiPlxyXG4gICAgICAgICAgICAke3RoaXMub3B0aW9ucy5pbnRlcm5hbElucHV0cyA/XHJcbiAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9faW5wdXRzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJHt0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkYXRlXCI+YFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkYXRlX2Zyb21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV90b1wiPmBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5gIDogJydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX19tb250aHNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcC1jb250ZW50XCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgLy8g0Y3Qu9C10LzQtdC90YLRi1xyXG4gICAgdGhpcy5fJG1vbnRocyAgICAgICAgID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX19tb250aHMnKTtcclxuICAgIHRoaXMuXyR0b29sdGlwICAgICAgICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcCcpO1xyXG4gICAgdGhpcy5fJHRvb2x0aXBDb250ZW50ID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX190b29sdGlwLWNvbnRlbnQnKTtcclxuXHJcbiAgICAvLyDQv9C+0LvRjyDQstCy0L7QtNCwXHJcbiAgICB0aGlzLl8kaW5wdXRzID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lXj1cImRhdGVcIl0nKTtcclxuXHJcbiAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG5cclxuICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgdGhpcy5fc2VsZWN0RGF0ZSh0aGlzLm9wdGlvbnMubWluRGF0ZSk7XHJcbiAgICB0aGlzLl8kY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuXyRwaWNrZXIpO1xyXG5cclxuICAgIC8vINC+0LHRgNCw0LHQvtGC0LrQsCDQsdGA0LXQudC60L/QvtC40L3RgtC+0LJcclxuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHMpLmxlbmd0aCkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9vbldpbmRvd1Jlc2l6ZUV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuX29uV2luZG93UmVzaXplRXZlbnQoKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCd0LDQt9Cy0LDQvdC40LUg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0TW9udGhGb3JtYXR0ZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCB0aXRsZSA9IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge21vbnRoOiAnbG9uZyd9KTtcclxuICAgIHJldHVybiB0aXRsZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpICsgdGl0bGUuc2xpY2UoMSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INC00LDRgtGLINC00LvRjyDRgtC10LrRg9GJ0LXQuSDQu9C+0LrQsNC70LhcclxuICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAgINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMg0J/QsNGA0LDQvNC10YLRgNGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZVRpbWVGb3JtYXQgPSBmdW5jdGlvbihkYXRlLCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gSW50bC5EYXRlVGltZUZvcm1hdCh0aGlzLm9wdGlvbnMubG9jYWxlLCBvcHRpb25zKS5mb3JtYXQoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQlNC90Lgg0L3QtdC00LXQu9C4XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldFdlZWtEYXlzRm9ybWF0dGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIDIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyArK2kpIHtcclxuICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgIGRheTogZGF0ZS5nZXREYXkoKSxcclxuICAgICAgICAgICAgdGl0bGU6IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge3dlZWtkYXk6ICdzaG9ydCd9KSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0YDRgtC40YDQvtCy0LrQsCDRgdC+0LPQu9Cw0YHQvdC+INC90LDRgdGC0YDQvtC10L3QvdC+0LzRgyDQv9C10YDQstC+0LzRgyDQtNC90Y4g0L3QtdC00LXQu9C4XHJcbiAgICByZXN1bHQuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpcnN0RGF5T2ZUaGVXZWVrID0gdGhpcy5vcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrICUgNztcclxuICAgICAgICBsZXQgZGF5QSA9IGEuZGF5O1xyXG4gICAgICAgIGxldCBkYXlCID0gYi5kYXk7XHJcblxyXG4gICAgICAgIGlmIChkYXlBID09IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlCID09IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUEgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICBkYXlBICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QiA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIGRheUIgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkYXlBIC0gZGF5QjtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuSDQsiDQvNC10YHRj9GG0LVcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7TnVtYmVyfSAgICDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXlzQ291bnRJbk1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXlzLnNldE1vbnRoKGRheXMuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgZGF5cy5zZXREYXRlKDApO1xyXG4gICAgcmV0dXJuIGRheXMuZ2V0RGF0ZSgpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucmFuZ2VSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxSZXNldCgpO1xyXG4gICAgdGhpcy5fc2VsZWN0aW9uID0ge307XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktGL0LTQtdC70LXQvdC40LUg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5yYW5nZVNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAvLyDQtNC+0L/Rg9GB0YLQuNC80YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUoZGF0ZV9mcm9tLCBkYXRlX3RvKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICBjb25zdCAkZGF5X3RvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuXHJcbiAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdChkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG5cclxuICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LVcclxuICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtCx0L3QvtCy0LvQtdC90LjQtSDQuNC90L/Rg9GC0L7QslxyXG4gICAgaWYgKHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9GUk9NXSkge1xyXG4gICAgICAgIHRoaXMuXyRpbnB1dHNbSU5ERVhfREFURV9GUk9NXS52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl8kaW5wdXRzW0lOREVYX0RBVEVfVE9dKSB7XHJcbiAgICAgICAgdGhpcy5fJGlucHV0c1tJTkRFWF9EQVRFX1RPXS52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0LHRi9GC0LjQtVxyXG4gICAgdGhpcy5fY2FsbGJhY2soJ3JhbmdlU2VsZWN0JywgZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0YtcclxuICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge1N0cmluZ30gZm9ybWF0INCk0L7RgNC80LDRgiDRgdGC0YDQvtC60LhcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSwgZm9ybWF0ID0gJ1ktbS1kJykge1xyXG4gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlKCdZJywgZGF0ZS5nZXRGdWxsWWVhcigpKVxyXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdtJywgKCcwJyArIChkYXRlLmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpKVxyXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdkJywgKCcwJyArIChkYXRlLmdldERhdGUoKSkpLnNsaWNlKC0yKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0L7QstC10YDQutCwINCy0L7Qt9C80L7QttC90L7RgdGC0Lgg0LLRi9C00LXQu9C10L3QuNGPINC00LDRglxyXG4gKiBAcGFyYW0gIHtEYXRlIGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtICB7RGF0ZSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRJc1JhbmdlU2VsZWN0YWJsZSA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoZGF0ZV9mcm9tLmdldFRpbWUoKSAtIGRhdGVfdG8uZ2V0VGltZSgpKSAvIDEwMDAgLyA4NjQwMDtcclxuICAgIGlmIChkaWZmIDwgdGhpcy5vcHRpb25zLm1pbkRheXMpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQv9C+0L/QsNC00LDQvdC40Y8g0LIg0LTQuNCw0L/QsNC30L7QvSDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbiAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgZGF5LnNldFRpbWUoZGF0ZV9mcm9tLmdldFRpbWUoKSk7XHJcblxyXG4gICAgd2hpbGUgKGRheSA8IGRhdGVfdG8pIHtcclxuICAgICAgICBpZiAodGhpcy5nZXREYXlMb2NrZWQoZGF5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkYXkuc2V0RGF0ZShkYXkuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0L7QstC10YDQutCwINC90LAg0LTQvtGB0YLRg9C/0L3QvtGB0YLRjCDQtNC90Y8g0LTQu9GPINCx0YDQvtC90LhcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgIHRydWUg0LXRgdC70Lgg0LTQvtGB0YLRg9C/0LXQvVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXlMb2NrZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQstC90LUg0LTQvtGB0YLRg9C/0L3QvtCz0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlIHx8IGRhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBMT0NLX1VOQVZBSUxBQkxFO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmlsdGVyLmxvY2tEYXlzLmNhbGwodGhpcywgZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktGL0LHRgNCw0L3QvdCw0Y8g0L3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEByZXR1cm4ge1N0cmluZ30g0JTQsNGC0LAg0LIg0YTQvtGA0LzQsNGC0LUgWVlZWS1NTS1ERFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlRnJvbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2dldElucHV0VmFsdWUoSU5ERVhfREFURV9GUk9NKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQsdGA0LDQvdC90LDRjyDQtNCw0YLQsCAoc2luZ2xlTW9kZTogdHJ1ZSlcclxuICogQHJldHVybiB7U3RyaW5nfSDQlNCw0YLQsCDQsiDRhNC+0YDQvNCw0YLQtSBZWVlZLU1NLUREXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGUgPSBEYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGVGcm9tO1xyXG5cclxuLyoqXHJcbiAqINCS0YvQsdGA0LDQvdC90LDRjyDQutC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqIEByZXR1cm4ge1N0cmluZ30g0JTQsNGC0LAg0LIg0YTQvtGA0LzQsNGC0LUgWVlZWS1NTS1ERFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlVG8gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9nZXRJbnB1dFZhbHVlKElOREVYX0RBVEVfVE8pO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQutC70L7QvdC10L3QuNC1ICgxINCx0L7QsdGR0YAsIDIg0LHQvtCx0YDQsCwgNSDQsdC+0LHRgNC+0LIpXHJcbiAqIEBwYXJhbSAge051bWJlcn0gdmFsdWUg0JrQvtC70LjRh9C10YHRgtCy0L5cclxuICogQHBhcmFtICB7QXJyYXl9ICBmb3JtcyDQnNCw0YHRgdC40LIg0LjQtyAz0YUg0Y3Qu9C10LzQtdC90YLQvtCyLCDQvNC+0LbQtdGCINGB0L7QtNC10YDQttCw0YLRjCDRgdC/0LXRhtC40YTQuNC60LDRgtC+0YAgJWQg0LTQu9GPINC30LDQvNC10L3Ri1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnBsdXJhbCA9IGZ1bmN0aW9uICh2YWx1ZSwgZm9ybXMpIHtcclxuICAgIHJldHVybiAodmFsdWUgJSAxMCA9PSAxICYmIHZhbHVlICUgMTAwICE9IDExID8gZm9ybXNbMF0gOiAodmFsdWUgJSAxMCA+PSAyICYmIHZhbHVlICUgMTAgPD0gNCAmJiAodmFsdWUgJSAxMDAgPCAxMCB8fCB2YWx1ZSAlIDEwMCA+PSAyMCkgPyBmb3Jtc1sxXSA6IGZvcm1zWzJdKSkucmVwbGFjZSgnJWQnLCB2YWx1ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktGL0LHRgNCw0L3QvdCw0Y8g0LTQsNGC0LBcclxuICogQHJldHVybiB7TnVtYmVyfSBpbmRleCDQmNC90LTQtdC60YEg0LjQvdC/0YPRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9nZXRJbnB1dFZhbHVlID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgIHJldHVybiB0aGlzLl8kaW5wdXRzW2luZGV4XSA/IHRoaXMuXyRpbnB1dHNbaW5kZXhdLnZhbHVlIDogJyc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQuNCw0L/QsNC30L7QvdCwINC80LXRgdGP0YbQtdCyXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZU1vbnRocyA9IGZ1bmN0aW9uKGRhdGVfZnJvbSkge1xyXG4gICAgd2hpbGUgKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCkge1xyXG4gICAgICAgIHRoaXMuXyRtb250aHMucmVtb3ZlQ2hpbGQodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9GA0Y/Rh9C10Lwg0L/QvtC00YHQutCw0LfQutGDXHJcbiAgICB0aGlzLl90b29sdGlwSGlkZSgpO1xyXG5cclxuICAgIC8vINC/0YDQtdGA0LXQvdC00LXRgCDQvNC10YHRj9GG0LXQslxyXG4gICAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuICAgIGNvbnN0ICRtb250aHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50OyArK2kpIHtcclxuICAgICAgICAkbW9udGhzLnB1c2godGhpcy5fJGNyZWF0ZU1vbnRoKGN1cnJlbnREYXRlKSk7XHJcbiAgICAgICAgY3VycmVudERhdGUuc2V0TW9udGgoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkbW9udGhzLmxlbmd0aDsgaSArPSB0aGlzLm9wdGlvbnMucGVyUm93KSB7XHJcbiAgICAgICAgY29uc3QgJHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICRyb3cuY2xhc3NOYW1lID0gJ0RhdGVyYW5nZXBpY2tlcl9fcm93JztcclxuXHJcbiAgICAgICAgJG1vbnRocy5zbGljZShpLCBpICsgdGhpcy5vcHRpb25zLnBlclJvdykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgICAgICAkcm93LmFwcGVuZENoaWxkKCRtb250aCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuXyRtb250aHMuYXBwZW5kQ2hpbGQoJHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSDQnNC10YHRj9GGXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCBjdXJyZW50TW9udGggPSBkYXRlLmdldE1vbnRoKCk7XHJcbiAgICBjb25zdCBtb250aFRpdGxlID0gdGhpcy5nZXRNb250aEZvcm1hdHRlZChkYXRlKTtcclxuICAgIGNvbnN0IHdlZWtEYXlzID0gdGhpcy5nZXRXZWVrRGF5c0Zvcm1hdHRlZCgpO1xyXG5cclxuICAgIGNvbnN0ICRtb250aCA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiTW9udGhcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2hlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLXByZXYkeyh0aGlzLm9wdGlvbnMubWluRGF0ZSAmJiBkYXRlIDw9IHRoaXMub3B0aW9ucy5taW5EYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTcgMTNMMSA3TDcgMVwiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX3RpdGxlXCI+JHttb250aFRpdGxlfSAke2RhdGUuZ2V0RnVsbFllYXIoKX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fYXJyb3cgTW9udGhfX2Fycm93LS1uZXh0JHsodGhpcy5vcHRpb25zLm1heERhdGUgJiYgZGF0ZSA+PSB0aGlzLm9wdGlvbnMubWF4RGF0ZSkgPyAnIGlzLWRpc2FibGVkJyA6ICcnfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xIDAuOTk5OTk5TDcgN0wxIDEzXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla1wiPiR7d2Vla0RheXMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtkYXlcIj4ke2l0ZW0udGl0bGV9PC9kaXY+YFxyXG4gICAgICAgICAgICB9KS5qb2luKCcnKX08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19kYXlzXCI+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyDRgdGC0YDQtdC70LrQuFxyXG4gICAgW1xyXG4gICAgICAgIHtzZWxlY3RvcjogJy5Nb250aF9fYXJyb3ctLXByZXYnLCBuYW1lOiAncHJldid9LFxyXG4gICAgICAgIHtzZWxlY3RvcjogJy5Nb250aF9fYXJyb3ctLW5leHQnLCBuYW1lOiAnbmV4dCd9LFxyXG4gICAgXS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIGNvbnN0ICRhcnJvdyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKGl0ZW0uc2VsZWN0b3IpO1xyXG4gICAgICAgICRhcnJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgICAgICAvLyDQstGA0LXQvNC10L3QvdCw0Y8g0LzQtdGA0LAsINC70YPRh9GI0LUg0L/QtdGA0LXQstC10YDRgdGC0LDRgtGMLCDQstGL0L3QtdGB0YLQuCDRgdGC0YDQtdC70LrQuCDQt9CwINC/0YDQtdC00LXQu9GLINC/0LXRgNC10YDQtdGA0LjRgdC+0LLRi9Cy0LDQtdC80L7QuSDQvtCx0LvQsNGB0YLQuCDQv9C40LrQtdGA0LBcclxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX29uQXJyb3dDbGljaygkYXJyb3csIGl0ZW0ubmFtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YAg0LTQvdC10LlcclxuICAgIGNvbnN0ICRkYXlzID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aF9fZGF5cycpO1xyXG4gICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgIGRheXMuc2V0RGF0ZSgxKTtcclxuICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgd2hpbGUgKGRheXMuZ2V0TW9udGgoKSA9PSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVXZWVrKCk7XHJcblxyXG4gICAgICAgIHdlZWtEYXlzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXlzLmdldERheSgpICE9IGl0ZW0uZGF5IHx8IGRheXMuZ2V0TW9udGgoKSAhPSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVFbXB0eURheSgpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZURheShkYXlzKSk7XHJcbiAgICAgICAgICAgIGRheXMuc2V0RGF0ZShkYXlzLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkZGF5cy5hcHBlbmRDaGlsZCgkd2Vlayk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICRtb250aDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0LvQuNC6INC/0L4g0YHRgtGA0LXQu9C60LUg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPINC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRhcnJvdyBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lICAgINCY0LzRjyAocHJldiwgbmV4dClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uQXJyb3dDbGljayA9IGZ1bmN0aW9uKCRhcnJvdywgbmFtZSkge1xyXG4gICAgaWYgKCRhcnJvdy5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLk1vbnRoJykuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyAobmFtZSA9PSAncHJldicgPyAtdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50IDogdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KSk7XHJcblxyXG4gICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LjQvdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1pbkRhdGUuZ2V0VGltZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0YXQvtC0INC30LAg0L/RgNC10LTQtdC70Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICBjb25zdCBlbmREYXRlID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGVuZERhdGUuc2V0TW9udGgoZW5kRGF0ZS5nZXRNb250aCgpICsgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KTtcclxuICAgICAgICBpZiAoZW5kRGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWF4RGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSAtIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCArIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9C10YDQtdGF0L7QtCDQuiDQvdC+0LLQvtC5INC00LDRgtC1XHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGC0LXQutGD0YnQtdC5INC00LDRgtGLINGBINGA0LXQvdC00LXRgNC+0LxcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9zZWxlY3REYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gZGF0ZTtcclxuICAgIHRoaXMuXyRjcmVhdGVNb250aHMoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0L3QtdC00LXQu9C4XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlV2VlayA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJXZWVrXCI+PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gJHdlZWs7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgJGRheSA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5XCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIiBkYXRhLWRheT1cIiR7ZGF0ZS5nZXREYXkoKX1cIj4ke2RhdGUuZ2V0RGF0ZSgpfTwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uRGF5Q2xpY2tFdmVudC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5fb25EYXlNb3VzZUVudGVyRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICB0aGlzLl91cGRhdGVEYXkoJGRheSk7XHJcblxyXG4gICAgcmV0dXJuICRkYXk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5Nb250aCcpLmZvckVhY2goJG1vbnRoID0+IHtcclxuICAgICAgICB0aGlzLl91cGRhdGVNb250aCgkbW9udGgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Lkg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJG1vbnRoINCt0LvQtdC80LXQvdGCINC80LXRgdGP0YbQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdXBkYXRlTW9udGggPSBmdW5jdGlvbigkbW9udGgpIHtcclxuICAgICRtb250aC5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKS5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZURheSgkZGF5KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5INC00L3Rj1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkg0K3Qu9C10LzQtdC90YIg0LTQvdGPXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl91cGRhdGVEYXkgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBjb25zdCBkYXRlICAgPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIGNvbnN0IGxvY2tlZCA9IHRoaXMuZ2V0RGF5TG9ja2VkKGRhdGUpO1xyXG4gICAgY29uc3QgdG9kYXkgID0gdGhpcy5fdG9kYXkuZ2V0VGltZSgpID09IGRhdGUuZ2V0VGltZSgpO1xyXG5cclxuICAgICRkYXkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtZGlzYWJsZWQnLCBsb2NrZWQpO1xyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1sb2NrZWQnLCBsb2NrZWQgPT0gTE9DS19MT0NLRUQpO1xyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy10b2RheScsIHRvZGF5KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INC60LvQuNC60LAg0L/QviDQtNC90Y5cclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5Q2xpY2tFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuX29uRGF5Q2xpY2soZS50YXJnZXQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0YXQvtCy0LXRgNCwXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheU1vdXNlRW50ZXJFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlcihlLnRhcmdldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpdC+0LLQtdGAINC90LAg0Y3Qu9C10LzQtdC90YLQtSDQtNC90Y9cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5TW91c2VFbnRlciA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheS5kYXRhc2V0LnRpbWUgPT0gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbS5nZXRUaW1lKCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC70LjQuiDQv9C+INC00L3RjlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlDbGljayA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIC8vINC00LXQvdGMINC30LDQsdC70L7QutC40YDQvtCy0LDQvVxyXG4gICAgaWYgKCRkYXkuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrKCdkYXlTZWxlY3QnLCBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0LHRgNC+0YEg0LLRi9Cx0YDQsNC90L3QvtCz0L4g0YDQsNC90LXQtSDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG5cclxuICAgIC8vINCy0YvQsdGA0LDQvdCwINC90LDRh9Cw0LvRjNC90LDRjyAvINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJhbmdlU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LjQt9GD0LDQu9GM0L3Ri9C5INGB0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICAkZGF5cy5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgICRkYXkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScsICdpcy1zZWxlY3RlZC10bycsICdpcy1zZWxlY3RlZC1iZXR3ZWVuJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQv9GA0Y/Rh9C10Lwg0L/QvtC00YHQutCw0LfQutGDXHJcbiAgICB0aGlzLl90b29sdGlwSGlkZSgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JLQuNC30YPQsNC70YzQvdC+0LUg0LLRi9C00LXQu9C10L3QuNC1INC00LDRglxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fcmFuZ2VWaXN1YWxTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGlmIChkYXRlX2Zyb20gJiYgZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0ZV90byAmJiBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHRpbWVfZnJvbSA9IGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX2Zyb20uZ2V0VGltZSgpIDogMDtcclxuICAgIGxldCB0aW1lX3RvID0gZGF0ZV90byBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX3RvLmdldFRpbWUoKSA6IDA7XHJcbiAgICBpZiAodGltZV9mcm9tID4gdGltZV90bykge1xyXG4gICAgICAgIFt0aW1lX2Zyb20sIHRpbWVfdG9dID0gW3RpbWVfdG8sIHRpbWVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC00LDRgiDQvNC10LbQtNGDINC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRkYXlzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgJGRheXNbaV0uY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2VsZWN0ZWQtYmV0d2VlbicsICRkYXlzW2ldLmRhdGFzZXQudGltZSA+IHRpbWVfZnJvbSAmJiAkZGF5c1tpXS5kYXRhc2V0LnRpbWUgPCB0aW1lX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0Lkg0L/QvtC30LjRhtC40LhcclxuICAgIGNvbnN0ICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICE9ICRkYXlfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgIT0gJGRheV90bykge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtGF0YDQsNC90LXQvdC40LUg0LIg0LrQtdGIXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkID0gJGRheV9mcm9tO1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgPSAkZGF5X3RvO1xyXG5cclxuICAgIHRoaXMuX3NlbGVjdGlvbi4kZGF5X2Zyb20gPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24uJGRheV90byA9ICRkYXlfdG87XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICBjb25zdCBkYXlzID0gTWF0aC5mbG9vcihNYXRoLmFicyh0aW1lX2Zyb20gLSB0aW1lX3RvKSAvIDg2NDAwZTMpICsgMTtcclxuICAgICAgICB0aGlzLl90b29sdGlwU2hvdygkZGF5X3RvLCBkYXlzKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCf0L7QutCw0Lcg0L/QvtC00YHQutCw0LfQutC4XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQktGL0LHRgNCw0L3QvdGL0Lkg0LTQtdC90YxcclxuICogQHBhcmFtIHtOdW1iZXJ9ICBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwU2hvdyA9IGZ1bmN0aW9uKCRkYXksIGRheXMpIHtcclxuICAgIHRoaXMuXyR0b29sdGlwQ29udGVudC50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5maWx0ZXIudG9vbHRpcFRleHQuY2FsbCh0aGlzLCBkYXlzKSB8fCAnJztcclxuICAgIHRoaXMuXyR0b29sdGlwLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXNob3cnLCB0aGlzLl8kdG9vbHRpcC50ZXh0Q29udGVudC5sZW5ndGgpO1xyXG4gICAgdGhpcy5fdG9vbHRpcFVwZGF0ZSgkZGF5KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INC/0L7Qt9C40YbQuNC4INC/0L7QtNGB0LrQsNC30LrQuFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkg0JLRi9Cx0YDQsNC90L3Ri9C5INC00LXQvdGMXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwVXBkYXRlID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgbGV0IHggPSAwO1xyXG4gICAgbGV0IHkgPSAwO1xyXG4gICAgbGV0ICRlbCA9ICRkYXk7XHJcbiAgICBkbyB7XHJcbiAgICAgICAgeSArPSAkZWwub2Zmc2V0VG9wO1xyXG4gICAgICAgIHggKz0gJGVsLm9mZnNldExlZnQ7XHJcbiAgICB9IHdoaWxlICgoJGVsID0gJGVsLm9mZnNldFBhcmVudCkgJiYgJGVsICE9IHRoaXMuXyRwaWNrZXIpO1xyXG5cclxuICAgIHRoaXMuXyR0b29sdGlwLnN0eWxlLnRvcCA9IE1hdGgucm91bmQoeSAtIHRoaXMuXyR0b29sdGlwLm9mZnNldEhlaWdodCkgKyAncHgnO1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUubGVmdCA9IE1hdGgucm91bmQoeCArICRkYXkub2Zmc2V0V2lkdGggLyAyIC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0V2lkdGggLyAyKSArICdweCc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60YDRi9GC0Ywg0L/QvtC00YHQutCw0LfQutGDXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwSGlkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2hvdycpO1xyXG59XHJcblxyXG4vKipcclxuICog0KLQtdC60YHRgiDQv9C+0LTRgdC60LDQt9C60Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICogQHBhcmFtICB7TnVtYmVyfSBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2ZpbHRlclRvb2x0aXBUZXh0ID0gZnVuY3Rpb24oZGF5cykge1xyXG4gICAgcmV0dXJuIHRoaXMucGx1cmFsKGRheXMsIFsnJWQg0LTQtdC90YwnLCAnJWQg0LTQvdGPJywgJyVkINC00L3QtdC5J10pLnJlcGxhY2UoJyVkJywgZGF5cyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNC40LvRjNGC0YAg0L3QtdC00L7RgdGC0YPQv9C90YvRhSDQtNC90LXQuSDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fZmlsdGVyTG9ja0RheXMgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINCy0YHQtSDQtNC90Lgg0LTQvtGB0YLRg9C/0L3Ri1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0LjQt9C80LXQvdC10L3QuNGPINGA0LDQt9C80LXRgNC+0LIg0L7QutC90LBcclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uV2luZG93UmVzaXplRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLiRkYXlfdG8pIHtcclxuICAgICAgICB0aGlzLl90b29sdGlwVXBkYXRlKHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYnJlYWtwb2ludCA9IDA7XHJcbiAgICBjb25zdCBicmVha3BvaW50cyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xyXG4gICAgZm9yIChsZXQgaSBpbiBicmVha3BvaW50cykge1xyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSBicmVha3BvaW50c1tpXSkge1xyXG4gICAgICAgICAgICBicmVha3BvaW50ID0gYnJlYWtwb2ludHNbaV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9zZXRCcmVha3BvaW50KGJyZWFrcG9pbnQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGB0L7RgdGC0L7Rj9C90LjRjyDRgNC10L3QtNC10YDQsCDQv9C+0LQg0YDQsNC30L3Ri9C1INGN0LrRgNCw0L3Ri1xyXG4gKiBAcGFyYW0ge051bWJlcn0gYnJlYWtwb2ludCDQmtC70Y7RhyDQuNC3IHRoaXMub3B0aW9ucy5icmVha3BvaW50cyAo0KjQuNGA0LjQvdCwINGN0LrRgNCw0L3QsClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3NldEJyZWFrcG9pbnQgPSBmdW5jdGlvbihicmVha3BvaW50KSB7XHJcbiAgICAvLyDQvtGCINC90LXQvdGD0LbQvdC+0Lkg0L/QtdGA0LXRgNC40YHQvtCy0LrQuFxyXG4gICAgaWYgKHRoaXMuX2JyZWFrcG9pbnQgPT0gYnJlYWtwb2ludCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuX2JyZWFrcG9pbnQgPSBicmVha3BvaW50O1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCB0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pO1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRocyh0aGlzLl9zZWxlY3RlZERhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0K3Qu9C10LzQtdC90YIg0LrQsNC70LXQvdC00LDRgNC90L7Qs9C+INC00L3Rj1xyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9ICAgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGdldERheUJ5RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpbWUgPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogMDtcclxuICAgIHJldHVybiB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5EYXlbZGF0YS10aW1lPVwiJyArIHRpbWUgKyAnXCJdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPIC0g0LfQsNCz0LvRg9GI0LrQuFxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVtcHR5RGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXkgaXMtZW1wdHlcIj48L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkZGF5O1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwINC40LcgSFRNTCDRgtC10LrRgdGC0LBcclxuICogQHBhcmFtICB7U3RyaW5nfSBodG1sIEhUTUwg0YLQtdC60YHRglxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XHJcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgIHJldHVybiBkaXYuY2hpbGRyZW4ubGVuZ3RoID4gMSA/IGRpdi5jaGlsZHJlbiA6IGRpdi5maXJzdEVsZW1lbnRDaGlsZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNhZmUg0LLRi9C30L7QsiDQstC90LXRiNC90LjRhSDRgdC+0LHRi9GC0LjQuSDQutC+0LzQv9C+0L3QtdC90YLQsFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZiDQmNC80Y8g0YHQvtCx0YvRgtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2NhbGxiYWNrID0gZnVuY3Rpb24oZikge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25bZl0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub25bZl0uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm47XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGVSYW5nZVBpY2tlcjtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==