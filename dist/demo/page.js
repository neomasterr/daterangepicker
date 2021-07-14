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
                    <input type="hidden" name="date_from">
                    <input type="hidden" name="date_to">
                </div>` : ''
            }
            <div class="Daterangepicker__months"></div>
            <div class="Daterangepicker__tooltip"></div>
        </div>`
    );

    // элементы
    this._$months  = this._$picker.querySelector('.Daterangepicker__months');
    this._$tooltip = this._$picker.querySelector('.Daterangepicker__tooltip');

    // поля ввода
    this._$inputFrom = this._$picker.querySelector('[name="date_from"]');
    this._$inputTo   = this._$picker.querySelector('[name="date_to"]');

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
    if (this._$inputFrom) {
        this._$inputFrom.value = this.formatDate(date_from);
    }

    if (this._$inputTo) {
        this._$inputTo.value = this.formatDate(date_to);
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
    const locked = this.getDayLocked(date);
    const today  = this._today.getTime() == date.getTime();

    let className = '';
    className += locked ? ' is-disabled' : '';
    className += locked == LOCK_LOCKED ? ' is-locked' : '';
    className += today ? ' is-today' : '';

    const $day = this._$createElement(
        `<div class="Day${className}" data-time="${date.getTime()}" data-day="${date.getDay()}">${date.getDate()}</div>`
    );

    $day.addEventListener('click', this._onDayClickEvent.bind(this));

    if (!this.options.singleMode) {
        $day.addEventListener('mouseenter', this._onDayMouseEnterEvent.bind(this));
    }

    return $day;
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
    this._$tooltip.textContent = this.options.filter.tooltipText.call(this, days) || '';
    this._$tooltip.classList.toggle('is-show', this._$tooltip.textContent.length);
    this._tooltipUpdate($day);
}

/**
 * Обновление позиции подсказки
 * @param {Element} $day Выбранный день
 */
DateRangePicker.prototype._tooltipUpdate = function($day) {
    const rect = $day.getBoundingClientRect();
    this._$tooltip.style.top = Math.round(rect.top + window.scrollY - rect.height - this._$tooltip.offsetHeight) + 'px';
    this._$tooltip.style.left = Math.round(rect.left + window.scrollX + rect.width / 2 - this._$tooltip.offsetWidth / 2) + 'px';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9zY3NzL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOztVQ1ZBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDTztBQUNBOztBQUVQLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxrQkFBa0I7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLHNCQUFzQjtB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QUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxLQUFLO0FBQ2pCLFlBQVksUUFBUTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpRUFBZSxlQUFlLEVBQUMiLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJEYXRlcmFuZ2VwaWNrZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8g0YHQvtGB0YLQvtGP0L3QuNGPINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuZXhwb3J0IGNvbnN0IExPQ0tfVU5BVkFJTEFCTEUgPSAxO1xyXG5leHBvcnQgY29uc3QgTE9DS19MT0NLRUQgICAgICA9IDI7XHJcblxyXG5mdW5jdGlvbiBEYXRlUmFuZ2VQaWNrZXIoJGNvbnRhaW5lciwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICAvLyDQvtGCINC/0L7QstGC0L7RgNC90L7QuSDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjQuFxyXG4gICAgaWYgKCRjb250YWluZXIuaW5zdGFuY2UpIHtcclxuICAgICAgICByZXR1cm4gJGNvbnRhaW5lci5pbnN0YW5jZTtcclxuICAgIH1cclxuICAgICRjb250YWluZXIuaW5zdGFuY2UgPSB0aGlzO1xyXG5cclxuICAgIHRoaXMuXyRjb250YWluZXIgPSAkY29udGFpbmVyO1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IHtcclxuICAgICAgICBmaXJzdERheU9mVGhlV2Vlazogb3B0aW9ucy5maXJzdERheU9mVGhlV2VlayB8fCAxLCAgICAgICAgICAvLyDQv9C10YDQstGL0Lkg0LTQtdC90Ywg0L3QtdC00LXQu9C4LCAwID0g0LLRgSwgMSA9INC/0L0sIC4uLlxyXG4gICAgICAgIHNpbmdsZU1vZGU6ICAgICAgICBvcHRpb25zLnNpbmdsZU1vZGUgICAgICAgIHx8IGZhbHNlLCAgICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRiyDQstC80LXRgdGC0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICAgICAgbG9jYWxlOiAgICAgICAgICAgIG9wdGlvbnMubG9jYWxlICAgICAgICAgICAgfHwgJ3J1LVJVJyxcclxuICAgICAgICBtaW5EYXlzOiAgICAgICAgICAgb3B0aW9ucy5taW5EYXlzICAgICAgICAgICB8fCAxLCAgICAgICAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC00LjQsNC/0LDQt9C+0L3QtVxyXG4gICAgICAgIG1vbnRoc0NvdW50OiAgICAgICBvcHRpb25zLm1vbnRoc0NvdW50ICAgICAgIHx8IDEyLFxyXG4gICAgICAgIHBlclJvdzogICAgICAgICAgICBvcHRpb25zLnBlclJvdyAgICAgICAgICAgIHx8IHVuZGVmaW5lZCwgIC8vINC60L7Qu9C40YfQtdGB0YLQstC+INC80LXRgdGP0YbQtdCyINCyINGA0Y/QtNGDXHJcbiAgICAgICAgbWluRGF0ZTogICAgICAgICAgIG9wdGlvbnMubWluRGF0ZSAgICAgICAgICAgfHwgbmV3IERhdGUoKSwgLy8g0LzQuNC90LjQvNCw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICAgIG1heERhdGU6ICAgICAgICAgICBvcHRpb25zLm1heERhdGUgICAgICAgICAgIHx8IHVuZGVmaW5lZCxcclxuICAgICAgICBicmVha3BvaW50czogICAgICAgb3B0aW9ucy5icmVha3BvaW50cyAgICAgICB8fCB7fSxcclxuICAgICAgICBpbnRlcm5hbElucHV0czogICAgb3B0aW9ucy5pbnRlcm5hbElucHV0cyAgICB8fCB0cnVlLCAgICAgICAvLyDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjQtSDQstGB0YLRgNC+0LXQvdC90YvRhSDQuNC90L/Rg9GC0L7QslxyXG4gICAgICAgIC8vINGB0L7QsdGL0YLQuNGPXHJcbiAgICAgICAgb246IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICByYW5nZVNlbGVjdDogbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICAgICAgICAgICAgZGF5U2VsZWN0OiAgIG51bGwsIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQvtC00L3QvtC5INC00LDRgtGLICjRgtC+0LvRjNC60L4g0L/RgNC4IHNpbmdsZU1vZGU6IHRydWUpXHJcbiAgICAgICAgfSwgb3B0aW9ucy5vbiB8fCB7fSksXHJcbiAgICAgICAgLy8g0YTQuNC70YzRgtGA0YPRjtGJ0LjQtSDQvNC10YLQvtC00YtcclxuICAgICAgICBmaWx0ZXI6IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICBsb2NrRGF5czogICAgdGhpcy5fZmlsdGVyTG9ja0RheXMsICAgIC8vIGNhbGxiYWNrKGRhdGUpINGE0YPQvdC60YbQuNGPINCx0LvQvtC60LjRgNC+0LLQsNC90LjRjyDQtNCw0YIsIHRydWUvTE9DS1xyXG4gICAgICAgICAgICB0b29sdGlwVGV4dDogdGhpcy5fZmlsdGVyVG9vbHRpcFRleHQsIC8vIGNhbGxiYWNrKGRheXMpINCy0YvQstC+0LQg0YLQtdC60YHRgtCwINC/0L7QtNGB0LrQsNC30LrQuFxyXG4gICAgICAgIH0sIG9wdGlvbnMuZmlsdGVyIHx8IHt9KSxcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXQoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINGA0Y/QtNC90L7RgdGC0YxcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnBlclJvdyA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5wZXJSb3cgPSB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5taW5EYXRlKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm1pbkRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7Qv9GG0LjQuCDQtNC70Y8g0Y3QutGA0LDQvdC+0LIg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICAgIHRoaXMub3B0aW9ucy5icmVha3BvaW50c1t0aGlzLl9icmVha3BvaW50ID0gMF0gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpO1xyXG5cclxuICAgIC8vINGC0LXQutGD0YnQuNC5INC00LXQvdGMXHJcbiAgICB0aGlzLl90b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICB0aGlzLl90b2RheS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICB0aGlzLl8kcGlja2VyID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJcIj5cclxuICAgICAgICAgICAgJHt0aGlzLm9wdGlvbnMuaW50ZXJuYWxJbnB1dHMgP1xyXG4gICAgICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX2lucHV0c1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImRhdGVfZnJvbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImRhdGVfdG9cIj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PmAgOiAnJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX21vbnRoc1wiPjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX190b29sdGlwXCI+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyDRjdC70LXQvNC10L3RgtGLXHJcbiAgICB0aGlzLl8kbW9udGhzICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzJyk7XHJcbiAgICB0aGlzLl8kdG9vbHRpcCA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcCcpO1xyXG5cclxuICAgIC8vINC/0L7Qu9GPINCy0LLQvtC00LBcclxuICAgIHRoaXMuXyRpbnB1dEZyb20gPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZGF0ZV9mcm9tXCJdJyk7XHJcbiAgICB0aGlzLl8kaW5wdXRUbyAgID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImRhdGVfdG9cIl0nKTtcclxuXHJcbiAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG5cclxuICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgdGhpcy5fc2VsZWN0RGF0ZSh0aGlzLm9wdGlvbnMubWluRGF0ZSk7XHJcbiAgICB0aGlzLl8kY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuXyRwaWNrZXIpO1xyXG5cclxuICAgIC8vINC+0LHRgNCw0LHQvtGC0LrQsCDQsdGA0LXQudC60L/QvtC40L3RgtC+0LJcclxuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHMpLmxlbmd0aCkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9vbldpbmRvd1Jlc2l6ZUV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuX29uV2luZG93UmVzaXplRXZlbnQoKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCd0LDQt9Cy0LDQvdC40LUg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0TW9udGhGb3JtYXR0ZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCB0aXRsZSA9IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge21vbnRoOiAnbG9uZyd9KTtcclxuICAgIHJldHVybiB0aXRsZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpICsgdGl0bGUuc2xpY2UoMSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INC00LDRgtGLINC00LvRjyDRgtC10LrRg9GJ0LXQuSDQu9C+0LrQsNC70LhcclxuICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAgINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMg0J/QsNGA0LDQvNC10YLRgNGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF0ZVRpbWVGb3JtYXQgPSBmdW5jdGlvbihkYXRlLCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gSW50bC5EYXRlVGltZUZvcm1hdCh0aGlzLm9wdGlvbnMubG9jYWxlLCBvcHRpb25zKS5mb3JtYXQoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQlNC90Lgg0L3QtdC00LXQu9C4XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldFdlZWtEYXlzRm9ybWF0dGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIDIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyArK2kpIHtcclxuICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgIGRheTogZGF0ZS5nZXREYXkoKSxcclxuICAgICAgICAgICAgdGl0bGU6IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge3dlZWtkYXk6ICdzaG9ydCd9KSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0YDRgtC40YDQvtCy0LrQsCDRgdC+0LPQu9Cw0YHQvdC+INC90LDRgdGC0YDQvtC10L3QvdC+0LzRgyDQv9C10YDQstC+0LzRgyDQtNC90Y4g0L3QtdC00LXQu9C4XHJcbiAgICByZXN1bHQuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgIGNvbnN0IGZpcnN0RGF5T2ZUaGVXZWVrID0gdGhpcy5vcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrICUgNztcclxuICAgICAgICBsZXQgZGF5QSA9IGEuZGF5O1xyXG4gICAgICAgIGxldCBkYXlCID0gYi5kYXk7XHJcblxyXG4gICAgICAgIGlmIChkYXlBID09IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlCID09IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUEgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICBkYXlBICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QiA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIGRheUIgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBkYXlBIC0gZGF5QjtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuSDQsiDQvNC10YHRj9GG0LVcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7TnVtYmVyfSAgICDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXlzQ291bnRJbk1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXlzLnNldE1vbnRoKGRheXMuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgZGF5cy5zZXREYXRlKDApO1xyXG4gICAgcmV0dXJuIGRheXMuZ2V0RGF0ZSgpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucmFuZ2VSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxSZXNldCgpO1xyXG4gICAgdGhpcy5fc2VsZWN0aW9uID0ge307XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktGL0LTQtdC70LXQvdC40LUg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5yYW5nZVNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAvLyDQtNC+0L/Rg9GB0YLQuNC80YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUoZGF0ZV9mcm9tLCBkYXRlX3RvKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICBjb25zdCAkZGF5X3RvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuXHJcbiAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdChkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG5cclxuICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LVcclxuICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtCx0L3QvtCy0LvQtdC90LjQtSDQuNC90L/Rg9GC0L7QslxyXG4gICAgaWYgKHRoaXMuXyRpbnB1dEZyb20pIHtcclxuICAgICAgICB0aGlzLl8kaW5wdXRGcm9tLnZhbHVlID0gdGhpcy5mb3JtYXREYXRlKGRhdGVfZnJvbSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuXyRpbnB1dFRvKSB7XHJcbiAgICAgICAgdGhpcy5fJGlucHV0VG8udmFsdWUgPSB0aGlzLmZvcm1hdERhdGUoZGF0ZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtCx0YvRgtC40LVcclxuICAgIHRoaXMuX2NhbGxiYWNrKCdyYW5nZVNlbGVjdCcsIGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INC00LDRgtGLXHJcbiAqIEBwYXJhbSAge0RhdGV9ICAgZGF0ZSAgINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGZvcm1hdCDQpNC+0YDQvNCw0YIg0YHRgtGA0L7QutC4XHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZm9ybWF0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUsIGZvcm1hdCA9ICdZLW0tZCcpIHtcclxuICAgIHJldHVybiBmb3JtYXQucmVwbGFjZSgnWScsIGRhdGUuZ2V0RnVsbFllYXIoKSlcclxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgnbScsICgnMCcgKyAoZGF0ZS5nZXRNb250aCgpICsgMSkpLnNsaWNlKC0yKSlcclxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgnZCcsICgnMCcgKyAoZGF0ZS5nZXREYXRlKCkpKS5zbGljZSgtMikpO1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC+0LLQtdGA0LrQsCDQstC+0LfQvNC+0LbQvdC+0YHRgtC4INCy0YvQtNC10LvQtdC90LjRjyDQtNCw0YJcclxuICogQHBhcmFtICB7RGF0ZSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSAge0RhdGUgZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0SXNSYW5nZVNlbGVjdGFibGUgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC80LjQvdC40LzQsNC70YzQvdGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgY29uc3QgZGlmZiA9IE1hdGguYWJzKGRhdGVfZnJvbS5nZXRUaW1lKCkgLSBkYXRlX3RvLmdldFRpbWUoKSkgLyAxMDAwIC8gODY0MDA7XHJcbiAgICBpZiAoZGlmZiA8IHRoaXMub3B0aW9ucy5taW5EYXlzKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDQvtCy0LXRgNC60LAg0L/QvtC/0LDQtNCw0L3QuNGPINCyINC00LjQsNC/0LDQt9C+0L0g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9GFINC00LDRglxyXG4gICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIGRheS5zZXRUaW1lKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG5cclxuICAgIHdoaWxlIChkYXkgPCBkYXRlX3RvKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZ2V0RGF5TG9ja2VkKGRheSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG4vKipcclxuICog0J/RgNC+0LLQtdGA0LrQsCDQvdCwINC00L7RgdGC0YPQv9C90L7RgdGC0Ywg0LTQvdGPINC00LvRjyDQsdGA0L7QvdC4XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICogQHJldHVybiB7Qm9vbGVhbn0gICB0cnVlINC10YHQu9C4INC00L7RgdGC0YPQv9C10L1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF5TG9ja2VkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LLQvdC1INC00L7RgdGC0YPQv9C90L7Qs9C+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgaWYgKGRhdGUgPCB0aGlzLm9wdGlvbnMubWluRGF0ZSB8fCBkYXRlID4gdGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICByZXR1cm4gTE9DS19VTkFWQUlMQUJMRTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZpbHRlci5sb2NrRGF5cy5jYWxsKHRoaXMsIGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQutC70L7QvdC10L3QuNC1ICgxINCx0L7QsdGR0YAsIDIg0LHQvtCx0YDQsCwgNSDQsdC+0LHRgNC+0LIpXHJcbiAqIEBwYXJhbSAge051bWJlcn0gdmFsdWUg0JrQvtC70LjRh9C10YHRgtCy0L5cclxuICogQHBhcmFtICB7QXJyYXl9ICBmb3JtcyDQnNCw0YHRgdC40LIg0LjQtyAz0YUg0Y3Qu9C10LzQtdC90YLQvtCyLCDQvNC+0LbQtdGCINGB0L7QtNC10YDQttCw0YLRjCDRgdC/0LXRhtC40YTQuNC60LDRgtC+0YAgJWQg0LTQu9GPINC30LDQvNC10L3Ri1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnBsdXJhbCA9IGZ1bmN0aW9uICh2YWx1ZSwgZm9ybXMpIHtcclxuICAgIHJldHVybiAodmFsdWUgJSAxMCA9PSAxICYmIHZhbHVlICUgMTAwICE9IDExID8gZm9ybXNbMF0gOiAodmFsdWUgJSAxMCA+PSAyICYmIHZhbHVlICUgMTAgPD0gNCAmJiAodmFsdWUgJSAxMDAgPCAxMCB8fCB2YWx1ZSAlIDEwMCA+PSAyMCkgPyBmb3Jtc1sxXSA6IGZvcm1zWzJdKSkucmVwbGFjZSgnJWQnLCB2YWx1ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQuNCw0L/QsNC30L7QvdCwINC80LXRgdGP0YbQtdCyXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZU1vbnRocyA9IGZ1bmN0aW9uKGRhdGVfZnJvbSkge1xyXG4gICAgd2hpbGUgKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCkge1xyXG4gICAgICAgIHRoaXMuXyRtb250aHMucmVtb3ZlQ2hpbGQodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9GA0Y/Rh9C10Lwg0L/QvtC00YHQutCw0LfQutGDXHJcbiAgICB0aGlzLl90b29sdGlwSGlkZSgpO1xyXG5cclxuICAgIC8vINC/0YDQtdGA0LXQvdC00LXRgCDQvNC10YHRj9GG0LXQslxyXG4gICAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuICAgIGNvbnN0ICRtb250aHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50OyArK2kpIHtcclxuICAgICAgICAkbW9udGhzLnB1c2godGhpcy5fJGNyZWF0ZU1vbnRoKGN1cnJlbnREYXRlKSk7XHJcbiAgICAgICAgY3VycmVudERhdGUuc2V0TW9udGgoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkbW9udGhzLmxlbmd0aDsgaSArPSB0aGlzLm9wdGlvbnMucGVyUm93KSB7XHJcbiAgICAgICAgY29uc3QgJHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICRyb3cuY2xhc3NOYW1lID0gJ0RhdGVyYW5nZXBpY2tlcl9fcm93JztcclxuXHJcbiAgICAgICAgJG1vbnRocy5zbGljZShpLCBpICsgdGhpcy5vcHRpb25zLnBlclJvdykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgICAgICAkcm93LmFwcGVuZENoaWxkKCRtb250aCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuXyRtb250aHMuYXBwZW5kQ2hpbGQoJHJvdyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSDQnNC10YHRj9GGXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCBjdXJyZW50TW9udGggPSBkYXRlLmdldE1vbnRoKCk7XHJcbiAgICBjb25zdCBtb250aFRpdGxlID0gdGhpcy5nZXRNb250aEZvcm1hdHRlZChkYXRlKTtcclxuICAgIGNvbnN0IHdlZWtEYXlzID0gdGhpcy5nZXRXZWVrRGF5c0Zvcm1hdHRlZCgpO1xyXG5cclxuICAgIGNvbnN0ICRtb250aCA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiTW9udGhcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2hlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLXByZXYkeyh0aGlzLm9wdGlvbnMubWluRGF0ZSAmJiBkYXRlIDw9IHRoaXMub3B0aW9ucy5taW5EYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTcgMTNMMSA3TDcgMVwiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX3RpdGxlXCI+JHttb250aFRpdGxlfSAke2RhdGUuZ2V0RnVsbFllYXIoKX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fYXJyb3cgTW9udGhfX2Fycm93LS1uZXh0JHsodGhpcy5vcHRpb25zLm1heERhdGUgJiYgZGF0ZSA+PSB0aGlzLm9wdGlvbnMubWF4RGF0ZSkgPyAnIGlzLWRpc2FibGVkJyA6ICcnfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xIDAuOTk5OTk5TDcgN0wxIDEzXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla1wiPiR7d2Vla0RheXMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtkYXlcIj4ke2l0ZW0udGl0bGV9PC9kaXY+YFxyXG4gICAgICAgICAgICB9KS5qb2luKCcnKX08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19kYXlzXCI+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyDRgdGC0YDQtdC70LrQuFxyXG4gICAgW1xyXG4gICAgICAgIHtzZWxlY3RvcjogJy5Nb250aF9fYXJyb3ctLXByZXYnLCBuYW1lOiAncHJldid9LFxyXG4gICAgICAgIHtzZWxlY3RvcjogJy5Nb250aF9fYXJyb3ctLW5leHQnLCBuYW1lOiAnbmV4dCd9LFxyXG4gICAgXS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIGNvbnN0ICRhcnJvdyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKGl0ZW0uc2VsZWN0b3IpO1xyXG4gICAgICAgICRhcnJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9vbkFycm93Q2xpY2soJGFycm93LCBpdGVtLm5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAINC00L3QtdC5XHJcbiAgICBjb25zdCAkZGF5cyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKCcuTW9udGhfX2RheXMnKTtcclxuICAgIGNvbnN0IGRheXMgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICBkYXlzLnNldERhdGUoMSk7XHJcbiAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIHdoaWxlIChkYXlzLmdldE1vbnRoKCkgPT0gY3VycmVudE1vbnRoKSB7XHJcbiAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlV2VlaygpO1xyXG5cclxuICAgICAgICB3ZWVrRGF5cy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBpZiAoZGF5cy5nZXREYXkoKSAhPSBpdGVtLmRheSB8fCBkYXlzLmdldE1vbnRoKCkgIT0gY3VycmVudE1vbnRoKSB7XHJcbiAgICAgICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRW1wdHlEYXkoKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVEYXkoZGF5cykpO1xyXG4gICAgICAgICAgICBkYXlzLnNldERhdGUoZGF5cy5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJGRheXMuYXBwZW5kQ2hpbGQoJHdlZWspO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAkbW9udGg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC70LjQuiDQv9C+INGB0YLRgNC10LvQutC1INC/0LXRgNC10LrQu9GO0YfQtdC90LjRjyDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtFbGVtZW50fSAkYXJyb3cgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAgICDQmNC80Y8gKHByZXYsIG5leHQpXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkFycm93Q2xpY2sgPSBmdW5jdGlvbigkYXJyb3csIG5hbWUpIHtcclxuICAgIGlmICgkYXJyb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShwYXJzZUludCh0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aCcpLmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgKG5hbWUgPT0gJ3ByZXYnID8gLXRoaXMub3B0aW9ucy5tb250aHNDb3VudCA6IHRoaXMub3B0aW9ucy5tb250aHNDb3VudCkpO1xyXG5cclxuICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNC40L3QuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRUaW1lKHRoaXMub3B0aW9ucy5taW5EYXRlLmdldFRpbWUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LDQutGB0LjQvNCw0LvRjNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgY29uc3QgZW5kRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBlbmREYXRlLnNldE1vbnRoKGVuZERhdGUuZ2V0TW9udGgoKSArIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCk7XHJcbiAgICAgICAgaWYgKGVuZERhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1heERhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgLSB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/QtdGA0LXRhdC+0LQg0Log0L3QvtCy0L7QuSDQtNCw0YLQtVxyXG4gICAgdGhpcy5fc2VsZWN0RGF0ZShkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQuSDQtNCw0YLRiyDRgSDRgNC10L3QtNC10YDQvtC8XHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fc2VsZWN0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIHRoaXMuX3NlbGVjdGVkRGF0ZSA9IGRhdGU7XHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGhzKGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC90LXQtNC10LvQuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZVdlZWsgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiV2Vla1wiPjwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuICR3ZWVrO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC00L3Rj1xyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZURheSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IGxvY2tlZCA9IHRoaXMuZ2V0RGF5TG9ja2VkKGRhdGUpO1xyXG4gICAgY29uc3QgdG9kYXkgID0gdGhpcy5fdG9kYXkuZ2V0VGltZSgpID09IGRhdGUuZ2V0VGltZSgpO1xyXG5cclxuICAgIGxldCBjbGFzc05hbWUgPSAnJztcclxuICAgIGNsYXNzTmFtZSArPSBsb2NrZWQgPyAnIGlzLWRpc2FibGVkJyA6ICcnO1xyXG4gICAgY2xhc3NOYW1lICs9IGxvY2tlZCA9PSBMT0NLX0xPQ0tFRCA/ICcgaXMtbG9ja2VkJyA6ICcnO1xyXG4gICAgY2xhc3NOYW1lICs9IHRvZGF5ID8gJyBpcy10b2RheScgOiAnJztcclxuXHJcbiAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXkke2NsYXNzTmFtZX1cIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiIGRhdGEtZGF5PVwiJHtkYXRlLmdldERheSgpfVwiPiR7ZGF0ZS5nZXREYXRlKCl9PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25EYXlDbGlja0V2ZW50LmJpbmQodGhpcykpO1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLl9vbkRheU1vdXNlRW50ZXJFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJGRheTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INC60LvQuNC60LAg0L/QviDQtNC90Y5cclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5Q2xpY2tFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuX29uRGF5Q2xpY2soZS50YXJnZXQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0YXQvtCy0LXRgNCwXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheU1vdXNlRW50ZXJFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlcihlLnRhcmdldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpdC+0LLQtdGAINC90LAg0Y3Qu9C10LzQtdC90YLQtSDQtNC90Y9cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5TW91c2VFbnRlciA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheS5kYXRhc2V0LnRpbWUgPT0gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbS5nZXRUaW1lKCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC70LjQuiDQv9C+INC00L3RjlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlDbGljayA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIC8vINC00LXQvdGMINC30LDQsdC70L7QutC40YDQvtCy0LDQvVxyXG4gICAgaWYgKCRkYXkuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrKCdkYXlTZWxlY3QnLCBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0LHRgNC+0YEg0LLRi9Cx0YDQsNC90L3QvtCz0L4g0YDQsNC90LXQtSDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG5cclxuICAgIC8vINCy0YvQsdGA0LDQvdCwINC90LDRh9Cw0LvRjNC90LDRjyAvINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJhbmdlU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LjQt9GD0LDQu9GM0L3Ri9C5INGB0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICAkZGF5cy5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgICRkYXkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScsICdpcy1zZWxlY3RlZC10bycsICdpcy1zZWxlY3RlZC1iZXR3ZWVuJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQv9GA0Y/Rh9C10Lwg0L/QvtC00YHQutCw0LfQutGDXHJcbiAgICB0aGlzLl90b29sdGlwSGlkZSgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JLQuNC30YPQsNC70YzQvdC+0LUg0LLRi9C00LXQu9C10L3QuNC1INC00LDRglxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fcmFuZ2VWaXN1YWxTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGlmIChkYXRlX2Zyb20gJiYgZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0ZV90byAmJiBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHRpbWVfZnJvbSA9IGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX2Zyb20uZ2V0VGltZSgpIDogMDtcclxuICAgIGxldCB0aW1lX3RvID0gZGF0ZV90byBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX3RvLmdldFRpbWUoKSA6IDA7XHJcbiAgICBpZiAodGltZV9mcm9tID4gdGltZV90bykge1xyXG4gICAgICAgIFt0aW1lX2Zyb20sIHRpbWVfdG9dID0gW3RpbWVfdG8sIHRpbWVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC00LDRgiDQvNC10LbQtNGDINC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRkYXlzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgJGRheXNbaV0uY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2VsZWN0ZWQtYmV0d2VlbicsICRkYXlzW2ldLmRhdGFzZXQudGltZSA+IHRpbWVfZnJvbSAmJiAkZGF5c1tpXS5kYXRhc2V0LnRpbWUgPCB0aW1lX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0Lkg0L/QvtC30LjRhtC40LhcclxuICAgIGNvbnN0ICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICE9ICRkYXlfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgIT0gJGRheV90bykge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtGF0YDQsNC90LXQvdC40LUg0LIg0LrQtdGIXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkID0gJGRheV9mcm9tO1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgPSAkZGF5X3RvO1xyXG5cclxuICAgIHRoaXMuX3NlbGVjdGlvbi4kZGF5X2Zyb20gPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24uJGRheV90byA9ICRkYXlfdG87XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICBjb25zdCBkYXlzID0gTWF0aC5mbG9vcihNYXRoLmFicyh0aW1lX2Zyb20gLSB0aW1lX3RvKSAvIDg2NDAwZTMpICsgMTtcclxuICAgICAgICB0aGlzLl90b29sdGlwU2hvdygkZGF5X3RvLCBkYXlzKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCf0L7QutCw0Lcg0L/QvtC00YHQutCw0LfQutC4XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQktGL0LHRgNCw0L3QvdGL0Lkg0LTQtdC90YxcclxuICogQHBhcmFtIHtOdW1iZXJ9ICBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwU2hvdyA9IGZ1bmN0aW9uKCRkYXksIGRheXMpIHtcclxuICAgIHRoaXMuXyR0b29sdGlwLnRleHRDb250ZW50ID0gdGhpcy5vcHRpb25zLmZpbHRlci50b29sdGlwVGV4dC5jYWxsKHRoaXMsIGRheXMpIHx8ICcnO1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2hvdycsIHRoaXMuXyR0b29sdGlwLnRleHRDb250ZW50Lmxlbmd0aCk7XHJcbiAgICB0aGlzLl90b29sdGlwVXBkYXRlKCRkYXkpO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0L/QvtC30LjRhtC40Lgg0L/QvtC00YHQutCw0LfQutC4XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQktGL0LHRgNCw0L3QvdGL0Lkg0LTQtdC90YxcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3Rvb2x0aXBVcGRhdGUgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBjb25zdCByZWN0ID0gJGRheS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIHRoaXMuXyR0b29sdGlwLnN0eWxlLnRvcCA9IE1hdGgucm91bmQocmVjdC50b3AgKyB3aW5kb3cuc2Nyb2xsWSAtIHJlY3QuaGVpZ2h0IC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSArICdweCc7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5zdHlsZS5sZWZ0ID0gTWF0aC5yb3VuZChyZWN0LmxlZnQgKyB3aW5kb3cuc2Nyb2xsWCArIHJlY3Qud2lkdGggLyAyIC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0V2lkdGggLyAyKSArICdweCc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60YDRi9GC0Ywg0L/QvtC00YHQutCw0LfQutGDXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwSGlkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2hvdycpO1xyXG59XHJcblxyXG4vKipcclxuICog0KLQtdC60YHRgiDQv9C+0LTRgdC60LDQt9C60Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICogQHBhcmFtICB7TnVtYmVyfSBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2ZpbHRlclRvb2x0aXBUZXh0ID0gZnVuY3Rpb24oZGF5cykge1xyXG4gICAgcmV0dXJuIHRoaXMucGx1cmFsKGRheXMsIFsnJWQg0LTQtdC90YwnLCAnJWQg0LTQvdGPJywgJyVkINC00L3QtdC5J10pLnJlcGxhY2UoJyVkJywgZGF5cyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNC40LvRjNGC0YAg0L3QtdC00L7RgdGC0YPQv9C90YvRhSDQtNC90LXQuSDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fZmlsdGVyTG9ja0RheXMgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINCy0YHQtSDQtNC90Lgg0LTQvtGB0YLRg9C/0L3Ri1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0LjQt9C80LXQvdC10L3QuNGPINGA0LDQt9C80LXRgNC+0LIg0L7QutC90LBcclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uV2luZG93UmVzaXplRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLiRkYXlfdG8pIHtcclxuICAgICAgICB0aGlzLl90b29sdGlwVXBkYXRlKHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYnJlYWtwb2ludCA9IDA7XHJcbiAgICBjb25zdCBicmVha3BvaW50cyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xyXG4gICAgZm9yIChsZXQgaSBpbiBicmVha3BvaW50cykge1xyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSBicmVha3BvaW50c1tpXSkge1xyXG4gICAgICAgICAgICBicmVha3BvaW50ID0gYnJlYWtwb2ludHNbaV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9zZXRCcmVha3BvaW50KGJyZWFrcG9pbnQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGB0L7RgdGC0L7Rj9C90LjRjyDRgNC10L3QtNC10YDQsCDQv9C+0LQg0YDQsNC30L3Ri9C1INGN0LrRgNCw0L3Ri1xyXG4gKiBAcGFyYW0ge051bWJlcn0gYnJlYWtwb2ludCDQmtC70Y7RhyDQuNC3IHRoaXMub3B0aW9ucy5icmVha3BvaW50cyAo0KjQuNGA0LjQvdCwINGN0LrRgNCw0L3QsClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3NldEJyZWFrcG9pbnQgPSBmdW5jdGlvbihicmVha3BvaW50KSB7XHJcbiAgICAvLyDQvtGCINC90LXQvdGD0LbQvdC+0Lkg0L/QtdGA0LXRgNC40YHQvtCy0LrQuFxyXG4gICAgaWYgKHRoaXMuX2JyZWFrcG9pbnQgPT0gYnJlYWtwb2ludCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuX2JyZWFrcG9pbnQgPSBicmVha3BvaW50O1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCB0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pO1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRocyh0aGlzLl9zZWxlY3RlZERhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0K3Qu9C10LzQtdC90YIg0LrQsNC70LXQvdC00LDRgNC90L7Qs9C+INC00L3Rj1xyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9ICAgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGdldERheUJ5RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpbWUgPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogMDtcclxuICAgIHJldHVybiB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5EYXlbZGF0YS10aW1lPVwiJyArIHRpbWUgKyAnXCJdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPIC0g0LfQsNCz0LvRg9GI0LrQuFxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVtcHR5RGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXkgaXMtZW1wdHlcIj48L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkZGF5O1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwINC40LcgSFRNTCDRgtC10LrRgdGC0LBcclxuICogQHBhcmFtICB7U3RyaW5nfSBodG1sIEhUTUwg0YLQtdC60YHRglxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XHJcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgIHJldHVybiBkaXYuY2hpbGRyZW4ubGVuZ3RoID4gMSA/IGRpdi5jaGlsZHJlbiA6IGRpdi5maXJzdEVsZW1lbnRDaGlsZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNhZmUg0LLRi9C30L7QsiDQstC90LXRiNC90LjRhSDRgdC+0LHRi9GC0LjQuSDQutC+0LzQv9C+0L3QtdC90YLQsFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZiDQmNC80Y8g0YHQvtCx0YvRgtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2NhbGxiYWNrID0gZnVuY3Rpb24oZikge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25bZl0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub25bZl0uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm47XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGVSYW5nZVBpY2tlcjtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9kaXN0L2RhdGVyYW5nZXBpY2tlci5qcyIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2RlbW8vcGFnZS5zY3NzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9kZW1vL3BhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJLElBQXlEO0FBQzdEO0FBQ0EsTUFBTSxFQUtnQztBQUN0QyxDQUFDO0FBQ0Qsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQSxjQUFjLDhCQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxnQkFBZ0IsOEJBQW1CLHdCQUF3Qiw4QkFBbUI7QUFDOUUsbURBQW1ELHlDQUF5QztBQUM1RjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxpRUFBaUUsa0JBQWtCO0FBQ25GO0FBQ0EsMERBQTBELGNBQWM7QUFDeEU7QUFDQSxXQUFXO0FBQ1g7QUFD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LGdDQUFnQyxZQUFZO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7OztBQ0EwRjs7QUFFMUY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSw4REFBZTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLDhEQUFXO0FBQ2xDOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6Ii4vZGVtby9wYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJEYXRlcmFuZ2VwaWNrZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovICgoKSA9PiB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0XCJ1c2Ugc3RyaWN0XCI7XG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIHNjb3BlXG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG4vKioqKioqLyBcdFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG4vKioqKioqLyBcdFx0XHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG4vKioqKioqLyBcdFx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuLyoqKioqKi8gXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG4vKioqKioqLyBcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSlcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcbi8qKioqKiovIFx0XHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuLyoqKioqKi8gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbi8vIFRoaXMgZW50cnkgbmVlZCB0byBiZSB3cmFwcGVkIGluIGFuIElJRkUgYmVjYXVzZSBpdCBuZWVkIHRvIGJlIGlzb2xhdGVkIGFnYWluc3Qgb3RoZXIgZW50cnkgbW9kdWxlcy5cbigoKSA9PiB7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvc2Nzcy9pbmRleC5zY3NzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuXG59KSgpO1xuXG4vLyBUaGlzIGVudHJ5IG5lZWQgdG8gYmUgd3JhcHBlZCBpbiBhbiBJSUZFIGJlY2F1c2UgaXQgbmVlZCB0byBiZSBpc29sYXRlZCBhZ2FpbnN0IG90aGVyIGVudHJ5IG1vZHVsZXMuXG4oKCkgPT4ge1xuLyohKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9qcy9pbmRleC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKi9cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0ICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCB7XG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiTE9DS19VTkFWQUlMQUJMRVwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBMT0NLX1VOQVZBSUxBQkxFKSxcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJMT0NLX0xPQ0tFRFwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBMT0NLX0xPQ0tFRCksXG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiZGVmYXVsdFwiOiAoKSA9PiAoX19XRUJQQUNLX0RFRkFVTFRfRVhQT1JUX18pXG4vKiBoYXJtb255IGV4cG9ydCAqLyB9KTtcbi8vINGB0L7RgdGC0L7Rj9C90LjRjyDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbmNvbnN0IExPQ0tfVU5BVkFJTEFCTEUgPSAxO1xyXG5jb25zdCBMT0NLX0xPQ0tFRCAgICAgID0gMjtcclxuXHJcbmZ1bmN0aW9uIERhdGVSYW5nZVBpY2tlcigkY29udGFpbmVyLCBvcHRpb25zID0ge30pIHtcclxuICAgIC8vINC+0YIg0L/QvtCy0YLQvtGA0L3QvtC5INC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4XHJcbiAgICBpZiAoJGNvbnRhaW5lci5pbnN0YW5jZSkge1xyXG4gICAgICAgIHJldHVybiAkY29udGFpbmVyLmluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgJGNvbnRhaW5lci5pbnN0YW5jZSA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5fJGNvbnRhaW5lciA9ICRjb250YWluZXI7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgIGZpcnN0RGF5T2ZUaGVXZWVrOiBvcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrIHx8IDEsICAgICAgICAgIC8vINC/0LXRgNCy0YvQuSDQtNC10L3RjCDQvdC10LTQtdC70LgsIDAgPSDQstGBLCAxID0g0L/QvSwgLi4uXHJcbiAgICAgICAgc2luZ2xlTW9kZTogICAgICAgIG9wdGlvbnMuc2luZ2xlTW9kZSAgICAgICAgfHwgZmFsc2UsICAgICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLINCy0LzQtdGB0YLQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBsb2NhbGU6ICAgICAgICAgICAgb3B0aW9ucy5sb2NhbGUgICAgICAgICAgICB8fCAncnUtUlUnLFxyXG4gICAgICAgIG1pbkRheXM6ICAgICAgICAgICBvcHRpb25zLm1pbkRheXMgICAgICAgICAgIHx8IDEsICAgICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LTQuNCw0L/QsNC30L7QvdC1XHJcbiAgICAgICAgbW9udGhzQ291bnQ6ICAgICAgIG9wdGlvbnMubW9udGhzQ291bnQgICAgICAgfHwgMTIsXHJcbiAgICAgICAgcGVyUm93OiAgICAgICAgICAgIG9wdGlvbnMucGVyUm93ICAgICAgICAgICAgfHwgdW5kZWZpbmVkLCAgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LzQtdGB0Y/RhtC10LIg0LIg0YDRj9C00YNcclxuICAgICAgICBtaW5EYXRlOiAgICAgICAgICAgb3B0aW9ucy5taW5EYXRlICAgICAgICAgICB8fCBuZXcgRGF0ZSgpLCAvLyDQvNC40L3QuNC80LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgICAgbWF4RGF0ZTogICAgICAgICAgIG9wdGlvbnMubWF4RGF0ZSAgICAgICAgICAgfHwgdW5kZWZpbmVkLFxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiAgICAgICBvcHRpb25zLmJyZWFrcG9pbnRzICAgICAgIHx8IHt9LFxyXG4gICAgICAgIGludGVybmFsSW5wdXRzOiAgICBvcHRpb25zLmludGVybmFsSW5wdXRzICAgIHx8IHRydWUsICAgICAgIC8vINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1INCy0YHRgtGA0L7QtdC90L3Ri9GFINC40L3Qv9GD0YLQvtCyXHJcbiAgICAgICAgLy8g0YHQvtCx0YvRgtC40Y9cclxuICAgICAgICBvbjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIHJhbmdlU2VsZWN0OiBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICAgICAgICBkYXlTZWxlY3Q6ICAgbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC+0LTQvdC+0Lkg0LTQsNGC0YsgKNGC0L7Qu9GM0LrQviDQv9GA0Lggc2luZ2xlTW9kZTogdHJ1ZSlcclxuICAgICAgICB9LCBvcHRpb25zLm9uIHx8IHt9KSxcclxuICAgICAgICAvLyDRhNC40LvRjNGC0YDRg9GO0YnQuNC1INC80LXRgtC+0LTRi1xyXG4gICAgICAgIGZpbHRlcjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIGxvY2tEYXlzOiAgICB0aGlzLl9maWx0ZXJMb2NrRGF5cywgICAgLy8gY2FsbGJhY2soZGF0ZSkg0YTRg9C90LrRhtC40Y8g0LHQu9C+0LrQuNGA0L7QstCw0L3QuNGPINC00LDRgiwgdHJ1ZS9MT0NLXHJcbiAgICAgICAgICAgIHRvb2x0aXBUZXh0OiB0aGlzLl9maWx0ZXJUb29sdGlwVGV4dCwgLy8gY2FsbGJhY2soZGF5cykg0LLRi9Cy0L7QtCDRgtC10LrRgdGC0LAg0L/QvtC00YHQutCw0LfQutC4XHJcbiAgICAgICAgfSwgb3B0aW9ucy5maWx0ZXIgfHwge30pLFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0YDRj9C00L3QvtGB0YLRjFxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGVyUm93ID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnBlclJvdyA9IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMubWluRGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtC/0YbQuNC4INC00LvRjyDRjdC60YDQsNC90L7QsiDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW3RoaXMuX2JyZWFrcG9pbnQgPSAwXSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyk7XHJcblxyXG4gICAgLy8g0YLQtdC60YPRidC40Lkg0LTQtdC90YxcclxuICAgIHRoaXMuX3RvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIHRoaXMuX3RvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIHRoaXMuXyRwaWNrZXIgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlclwiPlxyXG4gICAgICAgICAgICAke3RoaXMub3B0aW9ucy5pbnRlcm5hbElucHV0cyA/XHJcbiAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9faW5wdXRzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV9mcm9tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV90b1wiPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+YCA6ICcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXBcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGN0LvQtdC80LXQvdGC0YtcclxuICAgIHRoaXMuXyRtb250aHMgID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX19tb250aHMnKTtcclxuICAgIHRoaXMuXyR0b29sdGlwID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX190b29sdGlwJyk7XHJcblxyXG4gICAgLy8g0L/QvtC70Y8g0LLQstC+0LTQsFxyXG4gICAgdGhpcy5fJGlucHV0RnJvbSA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignW25hbWU9XCJkYXRlX2Zyb21cIl0nKTtcclxuICAgIHRoaXMuXyRpbnB1dFRvICAgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZGF0ZV90b1wiXScpO1xyXG5cclxuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKHRoaXMub3B0aW9ucy5taW5EYXRlKTtcclxuICAgIHRoaXMuXyRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fJHBpY2tlcik7XHJcblxyXG4gICAgLy8g0L7QsdGA0LDQsdC+0YLQutCwINCx0YDQtdC50LrQv9C+0LjQvdGC0L7QslxyXG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykubGVuZ3RoKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uV2luZG93UmVzaXplRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5fb25XaW5kb3dSZXNpemVFdmVudCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0J3QsNC30LLQsNC90LjQtSDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRNb250aEZvcm1hdHRlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7bW9udGg6ICdsb25nJ30pO1xyXG4gICAgcmV0dXJuIHRpdGxlLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aXRsZS5zbGljZSgxKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0Ysg0LTQu9GPINGC0LXQutGD0YnQtdC5INC70L7QutCw0LvQuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyDQn9Cw0YDQsNC80LXRgtGA0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlVGltZUZvcm1hdCA9IGZ1bmN0aW9uKGRhdGUsIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMub3B0aW9ucy5sb2NhbGUsIG9wdGlvbnMpLmZvcm1hdChkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCU0L3QuCDQvdC10LTQtdC70LhcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0V2Vla0RheXNGb3JtYXR0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gMik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7ICsraSkge1xyXG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgZGF5OiBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7d2Vla2RheTogJ3Nob3J0J30pLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINGB0L7Qs9C70LDRgdC90L4g0L3QsNGB0YLRgNC+0LXQvdC90L7QvNGDINC/0LXRgNCy0L7QvNGDINC00L3RjiDQvdC10LTQtdC70LhcclxuICAgIHJlc3VsdC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmlyc3REYXlPZlRoZVdlZWsgPSB0aGlzLm9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgJSA3O1xyXG4gICAgICAgIGxldCBkYXlBID0gYS5kYXk7XHJcbiAgICAgICAgbGV0IGRheUIgPSBiLmRheTtcclxuXHJcbiAgICAgICAgaWYgKGRheUEgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUIgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QSA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIGRheUEgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlCIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgZGF5QiArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRheUEgLSBkYXlCO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC80LXRgdGP0YbQtVxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9ICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERheXNDb3VudEluTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRheXMuc2V0TW9udGgoZGF5cy5nZXRNb250aCgpICsgMSk7XHJcbiAgICBkYXlzLnNldERhdGUoMCk7XHJcbiAgICByZXR1cm4gZGF5cy5nZXREYXRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFJlc2V0KCk7XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24gPSB7fTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQtNC10LvQtdC90LjQtSDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnJhbmdlU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZShkYXRlX2Zyb20sIGRhdGVfdG8pKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0ICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcblxyXG4gICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LIg0L7QsdGA0LDRgtC90L7QvCDQv9C+0YDRj9C00LrQtVxyXG4gICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC+0LHQvdC+0LLQu9C10L3QuNC1INC40L3Qv9GD0YLQvtCyXHJcbiAgICBpZiAodGhpcy5fJGlucHV0RnJvbSkge1xyXG4gICAgICAgIHRoaXMuXyRpbnB1dEZyb20udmFsdWUgPSB0aGlzLmZvcm1hdERhdGUoZGF0ZV9mcm9tKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fJGlucHV0VG8pIHtcclxuICAgICAgICB0aGlzLl8kaW5wdXRUby52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0LHRi9GC0LjQtVxyXG4gICAgdGhpcy5fY2FsbGJhY2soJ3JhbmdlU2VsZWN0JywgZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0YtcclxuICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge1N0cmluZ30gZm9ybWF0INCk0L7RgNC80LDRgiDRgdGC0YDQvtC60LhcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSwgZm9ybWF0ID0gJ1ktbS1kJykge1xyXG4gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlKCdZJywgZGF0ZS5nZXRGdWxsWWVhcigpKVxyXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdtJywgKCcwJyArIChkYXRlLmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpKVxyXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdkJywgKCcwJyArIChkYXRlLmdldERhdGUoKSkpLnNsaWNlKC0yKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0L7QstC10YDQutCwINCy0L7Qt9C80L7QttC90L7RgdGC0Lgg0LLRi9C00LXQu9C10L3QuNGPINC00LDRglxyXG4gKiBAcGFyYW0gIHtEYXRlIGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtICB7RGF0ZSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRJc1JhbmdlU2VsZWN0YWJsZSA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoZGF0ZV9mcm9tLmdldFRpbWUoKSAtIGRhdGVfdG8uZ2V0VGltZSgpKSAvIDEwMDAgLyA4NjQwMDtcclxuICAgIGlmIChkaWZmIDwgdGhpcy5vcHRpb25zLm1pbkRheXMpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQv9C+0L/QsNC00LDQvdC40Y8g0LIg0LTQuNCw0L/QsNC30L7QvSDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbiAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgZGF5LnNldFRpbWUoZGF0ZV9mcm9tLmdldFRpbWUoKSk7XHJcblxyXG4gICAgd2hpbGUgKGRheSA8IGRhdGVfdG8pIHtcclxuICAgICAgICBpZiAodGhpcy5nZXREYXlMb2NrZWQoZGF5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkYXkuc2V0RGF0ZShkYXkuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0L7QstC10YDQutCwINC90LAg0LTQvtGB0YLRg9C/0L3QvtGB0YLRjCDQtNC90Y8g0LTQu9GPINCx0YDQvtC90LhcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgIHRydWUg0LXRgdC70Lgg0LTQvtGB0YLRg9C/0LXQvVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXlMb2NrZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQstC90LUg0LTQvtGB0YLRg9C/0L3QvtCz0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlIHx8IGRhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBMT0NLX1VOQVZBSUxBQkxFO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmlsdGVyLmxvY2tEYXlzLmNhbGwodGhpcywgZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60LvQvtC90LXQvdC40LUgKDEg0LHQvtCx0ZHRgCwgMiDQsdC+0LHRgNCwLCA1INCx0L7QsdGA0L7QsilcclxuICogQHBhcmFtICB7TnVtYmVyfSB2YWx1ZSDQmtC+0LvQuNGH0LXRgdGC0LLQvlxyXG4gKiBAcGFyYW0gIHtBcnJheX0gIGZvcm1zINCc0LDRgdGB0LjQsiDQuNC3IDPRhSDRjdC70LXQvNC10L3RgtC+0LIsINC80L7QttC10YIg0YHQvtC00LXRgNC20LDRgtGMINGB0L/QtdGG0LjRhNC40LrQsNGC0L7RgCAlZCDQtNC70Y8g0LfQsNC80LXQvdGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucGx1cmFsID0gZnVuY3Rpb24gKHZhbHVlLCBmb3Jtcykge1xyXG4gICAgcmV0dXJuICh2YWx1ZSAlIDEwID09IDEgJiYgdmFsdWUgJSAxMDAgIT0gMTEgPyBmb3Jtc1swXSA6ICh2YWx1ZSAlIDEwID49IDIgJiYgdmFsdWUgJSAxMCA8PSA0ICYmICh2YWx1ZSAlIDEwMCA8IDEwIHx8IHZhbHVlICUgMTAwID49IDIwKSA/IGZvcm1zWzFdIDogZm9ybXNbMl0pKS5yZXBsYWNlKCclZCcsIHZhbHVlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC40LDQv9Cw0LfQvtC90LAg0LzQtdGB0Y/RhtC10LJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlTW9udGhzID0gZnVuY3Rpb24oZGF0ZV9mcm9tKSB7XHJcbiAgICB3aGlsZSAodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5yZW1vdmVDaGlsZCh0aGlzLl8kbW9udGhzLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgIHRoaXMuX3Rvb2x0aXBIaWRlKCk7XHJcblxyXG4gICAgLy8g0L/RgNC10YDQtdC90LTQtdGAINC80LXRgdGP0YbQtdCyXHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG4gICAgY29uc3QgJG1vbnRocyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7ICsraSkge1xyXG4gICAgICAgICRtb250aHMucHVzaCh0aGlzLl8kY3JlYXRlTW9udGgoY3VycmVudERhdGUpKTtcclxuICAgICAgICBjdXJyZW50RGF0ZS5zZXRNb250aChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRtb250aHMubGVuZ3RoOyBpICs9IHRoaXMub3B0aW9ucy5wZXJSb3cpIHtcclxuICAgICAgICBjb25zdCAkcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnRGF0ZXJhbmdlcGlja2VyX19yb3cnO1xyXG5cclxuICAgICAgICAkbW9udGhzLnNsaWNlKGksIGkgKyB0aGlzLm9wdGlvbnMucGVyUm93KS5mb3JFYWNoKCRtb250aCA9PiB7XHJcbiAgICAgICAgICAgICRyb3cuYXBwZW5kQ2hpbGQoJG1vbnRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5hcHBlbmRDaGlsZCgkcm93KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCc0LXRgdGP0YZcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVNb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IG1vbnRoVGl0bGUgPSB0aGlzLmdldE1vbnRoRm9ybWF0dGVkKGRhdGUpO1xyXG4gICAgY29uc3Qgd2Vla0RheXMgPSB0aGlzLmdldFdlZWtEYXlzRm9ybWF0dGVkKCk7XHJcblxyXG4gICAgY29uc3QgJG1vbnRoID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJNb250aFwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9faGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tcHJldiR7KHRoaXMub3B0aW9ucy5taW5EYXRlICYmIGRhdGUgPD0gdGhpcy5vcHRpb25zLm1pbkRhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNyAxM0wxIDdMNyAxXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fdGl0bGVcIj4ke21vbnRoVGl0bGV9ICR7ZGF0ZS5nZXRGdWxsWWVhcigpfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLW5leHQkeyh0aGlzLm9wdGlvbnMubWF4RGF0ZSAmJiBkYXRlID49IHRoaXMub3B0aW9ucy5tYXhEYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEgMC45OTk5OTlMNyA3TDEgMTNcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrXCI+JHt3ZWVrRGF5cy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla2RheVwiPiR7aXRlbS50aXRsZX08L2Rpdj5gXHJcbiAgICAgICAgICAgIH0pLmpvaW4oJycpfTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2RheXNcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGB0YLRgNC10LvQutC4XHJcbiAgICBbXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tcHJldicsIG5hbWU6ICdwcmV2J30sXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tbmV4dCcsIG5hbWU6ICduZXh0J30sXHJcbiAgICBdLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgY29uc3QgJGFycm93ID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoaXRlbS5zZWxlY3Rvcik7XHJcbiAgICAgICAgJGFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX29uQXJyb3dDbGljaygkYXJyb3csIGl0ZW0ubmFtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YAg0LTQvdC10LlcclxuICAgIGNvbnN0ICRkYXlzID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aF9fZGF5cycpO1xyXG4gICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgIGRheXMuc2V0RGF0ZSgxKTtcclxuICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgd2hpbGUgKGRheXMuZ2V0TW9udGgoKSA9PSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVXZWVrKCk7XHJcblxyXG4gICAgICAgIHdlZWtEYXlzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXlzLmdldERheSgpICE9IGl0ZW0uZGF5IHx8IGRheXMuZ2V0TW9udGgoKSAhPSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVFbXB0eURheSgpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZURheShkYXlzKSk7XHJcbiAgICAgICAgICAgIGRheXMuc2V0RGF0ZShkYXlzLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkZGF5cy5hcHBlbmRDaGlsZCgkd2Vlayk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICRtb250aDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0LvQuNC6INC/0L4g0YHRgtGA0LXQu9C60LUg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPINC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRhcnJvdyBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lICAgINCY0LzRjyAocHJldiwgbmV4dClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uQXJyb3dDbGljayA9IGZ1bmN0aW9uKCRhcnJvdywgbmFtZSkge1xyXG4gICAgaWYgKCRhcnJvdy5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLk1vbnRoJykuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyAobmFtZSA9PSAncHJldicgPyAtdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50IDogdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KSk7XHJcblxyXG4gICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LjQvdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1pbkRhdGUuZ2V0VGltZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0YXQvtC0INC30LAg0L/RgNC10LTQtdC70Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICBjb25zdCBlbmREYXRlID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGVuZERhdGUuc2V0TW9udGgoZW5kRGF0ZS5nZXRNb250aCgpICsgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KTtcclxuICAgICAgICBpZiAoZW5kRGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWF4RGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSAtIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCArIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9C10YDQtdGF0L7QtCDQuiDQvdC+0LLQvtC5INC00LDRgtC1XHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGC0LXQutGD0YnQtdC5INC00LDRgtGLINGBINGA0LXQvdC00LXRgNC+0LxcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9zZWxlY3REYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gZGF0ZTtcclxuICAgIHRoaXMuXyRjcmVhdGVNb250aHMoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0L3QtdC00LXQu9C4XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlV2VlayA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJXZWVrXCI+PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gJHdlZWs7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgbG9ja2VkID0gdGhpcy5nZXREYXlMb2NrZWQoZGF0ZSk7XHJcbiAgICBjb25zdCB0b2RheSAgPSB0aGlzLl90b2RheS5nZXRUaW1lKCkgPT0gZGF0ZS5nZXRUaW1lKCk7XHJcblxyXG4gICAgbGV0IGNsYXNzTmFtZSA9ICcnO1xyXG4gICAgY2xhc3NOYW1lICs9IGxvY2tlZCA/ICcgaXMtZGlzYWJsZWQnIDogJyc7XHJcbiAgICBjbGFzc05hbWUgKz0gbG9ja2VkID09IExPQ0tfTE9DS0VEID8gJyBpcy1sb2NrZWQnIDogJyc7XHJcbiAgICBjbGFzc05hbWUgKz0gdG9kYXkgPyAnIGlzLXRvZGF5JyA6ICcnO1xyXG5cclxuICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRheSR7Y2xhc3NOYW1lfVwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCIgZGF0YS1kYXk9XCIke2RhdGUuZ2V0RGF5KCl9XCI+JHtkYXRlLmdldERhdGUoKX08L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkRheUNsaWNrRXZlbnQuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZSkge1xyXG4gICAgICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAkZGF5O1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0LrQu9C40LrQsCDQv9C+INC00L3RjlxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlDbGlja0V2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdGhpcy5fb25EYXlDbGljayhlLnRhcmdldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDRhdC+0LLQtdGA0LBcclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5TW91c2VFbnRlckV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdGhpcy5fb25EYXlNb3VzZUVudGVyKGUudGFyZ2V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCl0L7QstC10YAg0L3QsCDRjdC70LXQvNC10L3RgtC1INC00L3Rj1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlNb3VzZUVudGVyID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5LmRhdGFzZXQudGltZSA9PSB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLmdldFRpbWUoKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRlX3RvID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0LvQuNC6INC/0L4g0LTQvdGOXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheUNsaWNrID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgLy8g0LTQtdC90Ywg0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC9XHJcbiAgICBpZiAoJGRheS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2soJ2RheVNlbGVjdCcsIG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQsdGA0L7RgSDQstGL0LHRgNCw0L3QvdC+0LPQviDRgNCw0L3QtdC1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcblxyXG4gICAgLy8g0LLRi9Cx0YDQsNC90LAg0L3QsNGH0LDQu9GM0L3QsNGPIC8g0LrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZSh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykpIHtcclxuICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmFuZ2VTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0JLQuNC30YPQsNC70YzQvdGL0Lkg0YHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3JhbmdlVmlzdWFsUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgICRkYXlzLmZvckVhY2goJGRheSA9PiB7XHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJywgJ2lzLXNlbGVjdGVkLXRvJywgJ2lzLXNlbGVjdGVkLWJldHdlZW4nKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgIHRoaXMuX3Rvb2x0aXBIaWRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktC40LfRg9Cw0LvRjNC90L7QtSDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgaWYgKGRhdGVfZnJvbSAmJiBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRlX3RvICYmIGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdGltZV9mcm9tID0gZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVfZnJvbS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgbGV0IHRpbWVfdG8gPSBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVfdG8uZ2V0VGltZSgpIDogMDtcclxuICAgIGlmICh0aW1lX2Zyb20gPiB0aW1lX3RvKSB7XHJcbiAgICAgICAgW3RpbWVfZnJvbSwgdGltZV90b10gPSBbdGltZV90bywgdGltZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCINC80LXQttC00YMg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0LlcclxuICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGRheXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAkZGF5c1tpXS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zZWxlY3RlZC1iZXR3ZWVuJywgJGRheXNbaV0uZGF0YXNldC50aW1lID4gdGltZV9mcm9tICYmICRkYXlzW2ldLmRhdGFzZXQudGltZSA8IHRpbWVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDQvdCw0YfQsNC70YzQvdC+0Lkg0Lgg0LrQvtC90LXRh9C90L7QuSDQv9C+0LfQuNGG0LjQuFxyXG4gICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgIT0gJGRheV9mcm9tKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAhPSAkZGF5X3RvKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0YXRgNCw0L3QtdC90LjQtSDQsiDQutC10YhcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCA9ICRkYXlfdG87XHJcblxyXG4gICAgdGhpcy5fc2VsZWN0aW9uLiRkYXlfZnJvbSA9ICRkYXlfZnJvbTtcclxuICAgIHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvID0gJGRheV90bztcclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgIGNvbnN0IGRheXMgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRpbWVfZnJvbSAtIHRpbWVfdG8pIC8gODY0MDBlMykgKyAxO1xyXG4gICAgICAgIHRoaXMuX3Rvb2x0aXBTaG93KCRkYXlfdG8sIGRheXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0J/QvtC60LDQtyDQv9C+0LTRgdC60LDQt9C60LhcclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5INCS0YvQsdGA0LDQvdC90YvQuSDQtNC10L3RjFxyXG4gKiBAcGFyYW0ge051bWJlcn0gIGRheXMg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3Rvb2x0aXBTaG93ID0gZnVuY3Rpb24oJGRheSwgZGF5cykge1xyXG4gICAgdGhpcy5fJHRvb2x0aXAudGV4dENvbnRlbnQgPSB0aGlzLm9wdGlvbnMuZmlsdGVyLnRvb2x0aXBUZXh0LmNhbGwodGhpcywgZGF5cykgfHwgJyc7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zaG93JywgdGhpcy5fJHRvb2x0aXAudGV4dENvbnRlbnQubGVuZ3RoKTtcclxuICAgIHRoaXMuX3Rvb2x0aXBVcGRhdGUoJGRheSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDQv9C+0LfQuNGG0LjQuCDQv9C+0LTRgdC60LDQt9C60LhcclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5INCS0YvQsdGA0LDQvdC90YvQuSDQtNC10L3RjFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcFVwZGF0ZSA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGNvbnN0IHJlY3QgPSAkZGF5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUudG9wID0gTWF0aC5yb3VuZChyZWN0LnRvcCArIHdpbmRvdy5zY3JvbGxZIC0gcmVjdC5oZWlnaHQgLSB0aGlzLl8kdG9vbHRpcC5vZmZzZXRIZWlnaHQpICsgJ3B4JztcclxuICAgIHRoaXMuXyR0b29sdGlwLnN0eWxlLmxlZnQgPSBNYXRoLnJvdW5kKHJlY3QubGVmdCArIHdpbmRvdy5zY3JvbGxYICsgcmVjdC53aWR0aCAvIDIgLSB0aGlzLl8kdG9vbHRpcC5vZmZzZXRXaWR0aCAvIDIpICsgJ3B4JztcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0LrRgNGL0YLRjCDQv9C+0LTRgdC60LDQt9C60YNcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3Rvb2x0aXBIaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zaG93Jyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQotC10LrRgdGCINC/0L7QtNGB0LrQsNC30LrQuCDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRheXMg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fZmlsdGVyVG9vbHRpcFRleHQgPSBmdW5jdGlvbihkYXlzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wbHVyYWwoZGF5cywgWyclZCDQtNC10L3RjCcsICclZCDQtNC90Y8nLCAnJWQg0LTQvdC10LknXSkucmVwbGFjZSgnJWQnLCBkYXlzKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0LjQu9GM0YLRgCDQvdC10LTQvtGB0YLRg9C/0L3Ri9GFINC00L3QtdC5INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9maWx0ZXJMb2NrRGF5cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0LLRgdC1INC00L3QuCDQtNC+0YHRgtGD0L/QvdGLXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDQuNC30LzQtdC90LXQvdC40Y8g0YDQsNC30LzQtdGA0L7QsiDQvtC60L3QsFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25XaW5kb3dSZXNpemVFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uJGRheV90bykge1xyXG4gICAgICAgIHRoaXMuX3Rvb2x0aXBVcGRhdGUodGhpcy5fc2VsZWN0aW9uLiRkYXlfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBicmVha3BvaW50ID0gMDtcclxuICAgIGNvbnN0IGJyZWFrcG9pbnRzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzKS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XHJcbiAgICBmb3IgKGxldCBpIGluIGJyZWFrcG9pbnRzKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IGJyZWFrcG9pbnRzW2ldKSB7XHJcbiAgICAgICAgICAgIGJyZWFrcG9pbnQgPSBicmVha3BvaW50c1tpXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3NldEJyZWFrcG9pbnQoYnJlYWtwb2ludCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9GB0YLQsNC90L7QstC60LAg0YHQvtGB0YLQvtGP0L3QuNGPINGA0LXQvdC00LXRgNCwINC/0L7QtCDRgNCw0LfQvdGL0LUg0Y3QutGA0LDQvdGLXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBicmVha3BvaW50INCa0LvRjtGHINC40LcgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzICjQqNC40YDQuNC90LAg0Y3QutGA0LDQvdCwKVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fc2V0QnJlYWtwb2ludCA9IGZ1bmN0aW9uKGJyZWFrcG9pbnQpIHtcclxuICAgIC8vINC+0YIg0L3QtdC90YPQttC90L7QuSDQv9C10YDQtdGA0LjRgdC+0LLQutC4XHJcbiAgICBpZiAodGhpcy5fYnJlYWtwb2ludCA9PSBicmVha3BvaW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fYnJlYWtwb2ludCA9IGJyZWFrcG9pbnQ7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9ucy5icmVha3BvaW50c1ticmVha3BvaW50XSk7XHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGhzKHRoaXMuX3NlbGVjdGVkRGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQrdC70LXQvNC10L3RgiDQutCw0LvQtdC90LTQsNGA0L3QvtCz0L4g0LTQvdGPXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICogQHJldHVybiB7RWxlbWVudH0gICBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kZ2V0RGF5QnlEYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgdGltZSA9IGRhdGUgaW5zdGFuY2VvZiBEYXRlID8gZGF0ZS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgcmV0dXJuIHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLkRheVtkYXRhLXRpbWU9XCInICsgdGltZSArICdcIl0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC90Y8gLSDQt9Cw0LPQu9GD0YjQutC4XHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRW1wdHlEYXkgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRheSBpcy1lbXB0eVwiPjwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuICRkYXk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LfQtNCw0L3QuNC1INGN0LvQtdC80LXQvdGC0LAg0LjQtyBIVE1MINGC0LXQutGB0YLQsFxyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGh0bWwgSFRNTCDRgtC10LrRgdGCXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGh0bWwpIHtcclxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZGl2Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGh0bWwpO1xyXG4gICAgcmV0dXJuIGRpdi5jaGlsZHJlbi5sZW5ndGggPiAxID8gZGl2LmNoaWxkcmVuIDogZGl2LmZpcnN0RWxlbWVudENoaWxkO1xyXG59XHJcblxyXG4vKipcclxuICogU2FmZSDQstGL0LfQvtCyINCy0L3QtdGI0L3QuNGFINGB0L7QsdGL0YLQuNC5INC60L7QvNC/0L7QvdC10L3RgtCwXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmINCY0LzRjyDRgdC+0LHRi9GC0LjRj1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fY2FsbGJhY2sgPSBmdW5jdGlvbihmKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbltmXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vbltmXS5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybjtcclxufVxyXG5cclxuLyogaGFybW9ueSBkZWZhdWx0IGV4cG9ydCAqLyBjb25zdCBfX1dFQlBBQ0tfREVGQVVMVF9FWFBPUlRfXyA9IChEYXRlUmFuZ2VQaWNrZXIpO1xyXG5cbn0pKCk7XG5cbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19leHBvcnRzX187XG4vKioqKioqLyB9KSgpXG47XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdmQyVmljR0ZqYXk5MWJtbDJaWEp6WVd4TmIyUjFiR1ZFWldacGJtbDBhVzl1SWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k5M1pXSndZV05yTDJKdmIzUnpkSEpoY0NJc0luZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdmQyVmljR0ZqYXk5eWRXNTBhVzFsTDJSbFptbHVaU0J3Y205d1pYSjBlU0JuWlhSMFpYSnpJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTkzWldKd1lXTnJMM0oxYm5ScGJXVXZhR0Z6VDNkdVVISnZjR1Z5ZEhrZ2MyaHZjblJvWVc1a0lpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOTNaV0p3WVdOckwzSjFiblJwYldVdmJXRnJaU0J1WVcxbGMzQmhZMlVnYjJKcVpXTjBJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTh1TDNOeVl5OXpZM056TDJsdVpHVjRMbk5qYzNNaUxDSjNaV0p3WVdOck9pOHZaR0YwWlhKaGJtZGxjR2xqYTJWeUx5NHZjM0pqTDJwekwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRU5CUVVNN1FVRkRSQ3hQT3p0VlExWkJPMVZCUTBFN096czdPMWREUkVFN1YwRkRRVHRYUVVOQk8xZEJRMEU3VjBGRFFTeDNRMEZCZDBNc2VVTkJRWGxETzFkQlEycEdPMWRCUTBFN1YwRkRRU3hGT3pzN096dFhRMUJCTEhkR096czdPenRYUTBGQk8xZEJRMEU3VjBGRFFUdFhRVU5CTEhORVFVRnpSQ3hyUWtGQmEwSTdWMEZEZUVVN1YwRkRRU3dyUTBGQkswTXNZMEZCWXp0WFFVTTNSQ3hGT3pzN096czdPenM3T3pzN1FVTk9RVHM3T3pzN096czdPenM3T3pzN08wRkRRVUU3UVVGRFR6dEJRVU5CT3p0QlFVVlFMR2xFUVVGcFJEdEJRVU5xUkR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMREJFUVVFd1JEdEJRVU14UkR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzVTBGQlV5eHJRa0ZCYTBJN1FVRkRNMEk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4VFFVRlRMSE5DUVVGelFqdEJRVU12UWpzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEVzY1VWQlFYRkZPenRCUVVWeVJUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxHTkJRV003UVVGRFpEdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1MwRkJTenRCUVVOcVFpeFpRVUZaTzBGQlExbzdRVUZEUVR0QlFVTkJMR2RFUVVGblJDeGpRVUZqTzBGQlF6bEVPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZsQlFWa3NTMEZCU3p0QlFVTnFRaXhaUVVGWkxFOUJRVTg3UVVGRGJrSXNXVUZCV1R0QlFVTmFPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTEcxQ1FVRnRRaXhQUVVGUE8wRkJRekZDTzBGQlEwRTdRVUZEUVR0QlFVTkJMR2xFUVVGcFJDeHBRa0ZCYVVJN1FVRkRiRVVzVTBGQlV6dEJRVU5VT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFc1MwRkJTenM3UVVGRlREdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWkxFdEJRVXM3UVVGRGFrSXNXVUZCV1N4UFFVRlBPMEZCUTI1Q08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZkQlFWY3NTMEZCU3p0QlFVTm9RaXhYUVVGWExFdEJRVXM3UVVGRGFFSTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCV1N4TFFVRkxPMEZCUTJwQ0xGbEJRVmtzVDBGQlR6dEJRVU51UWl4WlFVRlpPMEZCUTFvN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWk8wRkJRMW9zV1VGQldUdEJRVU5hTEZsQlFWazdRVUZEV2p0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWkxFdEJRVXM3UVVGRGFrSXNXVUZCV1N4UlFVRlJPMEZCUTNCQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WlFVRlpMRTlCUVU4N1FVRkRia0lzV1VGQldTeE5RVUZOTzBGQlEyeENMRmxCUVZrN1FVRkRXanRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhMUVVGTE8wRkJRMmhDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3h0UWtGQmJVSXNPRUpCUVRoQ08wRkJRMnBFTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQkxHMUNRVUZ0UWl4dlFrRkJiMEk3UVVGRGRrTTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVTBGQlV6czdRVUZGVkR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hYUVVGWExFdEJRVXM3UVVGRGFFSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTEhsRFFVRjVReXhsUVVGbE8wRkJRM2hFTzBGQlEwRXNOa1JCUVRaRUxEWkZRVUUyUlR0QlFVTXhTVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTERSRFFVRTBReXhYUVVGWExFZEJRVWNzYlVKQlFXMUNPMEZCUXpkRkxEWkVRVUUyUkN3MlJVRkJOa1U3UVVGRE1VazdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxIVkRRVUYxUXp0QlFVTjJReXh6UkVGQmMwUXNWMEZCVnp0QlFVTnFSU3hoUVVGaExGZEJRVmM3UVVGRGVFSTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFRRVUZUTERoRFFVRTRRenRCUVVOMlJDeFRRVUZUTERoRFFVRTRRenRCUVVOMlJEdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRk5CUVZNN1FVRkRWQ3hMUVVGTE96dEJRVVZNTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4VFFVRlRPenRCUVVWVU8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eFJRVUZSTzBGQlEyNUNMRmRCUVZjc1QwRkJUenRCUVVOc1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eExRVUZMTzBGQlEyaENPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1MwRkJTenRCUVVOcVFpeFpRVUZaTzBGQlExbzdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWkxFdEJRVXM3UVVGRGFrSXNXVUZCV1R0QlFVTmFPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEVzTUVKQlFUQkNMRlZCUVZVc1pVRkJaU3hsUVVGbExHTkJRV01zWTBGQll5eEpRVUZKTEdWQlFXVTdRVUZEYWtnN08wRkJSVUU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1RVRkJUVHRCUVVOcVFqdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eE5RVUZOTzBGQlEycENPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRkZCUVZFN1FVRkRia0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEZGQlFWRTdRVUZEYmtJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxFdEJRVXM3UVVGRFREdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hMUVVGTE96dEJRVVZNTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eExRVUZMTzBGQlEyaENMRmRCUVZjc1MwRkJTenRCUVVOb1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4dFFrRkJiVUlzYTBKQlFXdENPMEZCUTNKRE8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNWMEZCVnl4UlFVRlJPMEZCUTI1Q0xGZEJRVmNzVDBGQlR6dEJRVU5zUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1VVRkJVVHRCUVVOdVFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTEU5QlFVODdRVUZEYmtJc1dVRkJXVHRCUVVOYU8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWk8wRkJRMW83UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eE5RVUZOTzBGQlEycENPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEU5QlFVODdRVUZEYkVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzV1VGQldTeExRVUZMTzBGQlEycENMRmxCUVZrc1VVRkJVVHRCUVVOd1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTzBGQlExbzdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3haUVVGWkxFOUJRVTg3UVVGRGJrSXNXVUZCV1R0QlFVTmFPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhQUVVGUE8wRkJRMnhDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVN4cFJVRkJaU3hsUVVGbExFVkJRVU1pTENKbWFXeGxJam9pWkdGMFpYSmhibWRsY0dsamEyVnlMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUtHWjFibU4wYVc5dUlIZGxZbkJoWTJ0VmJtbDJaWEp6WVd4TmIyUjFiR1ZFWldacGJtbDBhVzl1S0hKdmIzUXNJR1poWTNSdmNua3BJSHRjYmx4MGFXWW9kSGx3Wlc5bUlHVjRjRzl5ZEhNZ1BUMDlJQ2R2WW1wbFkzUW5JQ1ltSUhSNWNHVnZaaUJ0YjJSMWJHVWdQVDA5SUNkdlltcGxZM1FuS1Z4dVhIUmNkRzF2WkhWc1pTNWxlSEJ2Y25SeklEMGdabUZqZEc5eWVTZ3BPMXh1WEhSbGJITmxJR2xtS0hSNWNHVnZaaUJrWldacGJtVWdQVDA5SUNkbWRXNWpkR2x2YmljZ0ppWWdaR1ZtYVc1bExtRnRaQ2xjYmx4MFhIUmtaV1pwYm1Vb1hDSkVZWFJsY21GdVoyVndhV05yWlhKY0lpd2dXMTBzSUdaaFkzUnZjbmtwTzF4dVhIUmxiSE5sSUdsbUtIUjVjR1Z2WmlCbGVIQnZjblJ6SUQwOVBTQW5iMkpxWldOMEp5bGNibHgwWEhSbGVIQnZjblJ6VzF3aVJHRjBaWEpoYm1kbGNHbGphMlZ5WENKZElEMGdabUZqZEc5eWVTZ3BPMXh1WEhSbGJITmxYRzVjZEZ4MGNtOXZkRnRjSWtSaGRHVnlZVzVuWlhCcFkydGxjbHdpWFNBOUlHWmhZM1J2Y25rb0tUdGNibjBwS0hObGJHWXNJR1oxYm1OMGFXOXVLQ2tnZTF4dWNtVjBkWEp1SUNJc0lpOHZJRlJvWlNCeVpYRjFhWEpsSUhOamIzQmxYRzUyWVhJZ1gxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5QTlJSHQ5TzF4dVhHNGlMQ0l2THlCa1pXWnBibVVnWjJWMGRHVnlJR1oxYm1OMGFXOXVjeUJtYjNJZ2FHRnliVzl1ZVNCbGVIQnZjblJ6WEc1ZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxtUWdQU0FvWlhod2IzSjBjeXdnWkdWbWFXNXBkR2x2YmlrZ1BUNGdlMXh1WEhSbWIzSW9kbUZ5SUd0bGVTQnBiaUJrWldacGJtbDBhVzl1S1NCN1hHNWNkRngwYVdZb1gxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NXZLR1JsWm1sdWFYUnBiMjRzSUd0bGVTa2dKaVlnSVY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dWJ5aGxlSEJ2Y25SekxDQnJaWGtwS1NCN1hHNWNkRngwWEhSUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa29aWGh3YjNKMGN5d2dhMlY1TENCN0lHVnVkVzFsY21GaWJHVTZJSFJ5ZFdVc0lHZGxkRG9nWkdWbWFXNXBkR2x2Ymx0clpYbGRJSDBwTzF4dVhIUmNkSDFjYmx4MGZWeHVmVHNpTENKZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxtOGdQU0FvYjJKcUxDQndjbTl3S1NBOVBpQW9UMkpxWldOMExuQnliM1J2ZEhsd1pTNW9ZWE5QZDI1UWNtOXdaWEowZVM1allXeHNLRzlpYWl3Z2NISnZjQ2twSWl3aUx5OGdaR1ZtYVc1bElGOWZaWE5OYjJSMWJHVWdiMjRnWlhod2IzSjBjMXh1WDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1eUlEMGdLR1Y0Y0c5eWRITXBJRDArSUh0Y2JseDBhV1lvZEhsd1pXOW1JRk41YldKdmJDQWhQVDBnSjNWdVpHVm1hVzVsWkNjZ0ppWWdVM2x0WW05c0xuUnZVM1J5YVc1blZHRm5LU0I3WEc1Y2RGeDBUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0dWNGNHOXlkSE1zSUZONWJXSnZiQzUwYjFOMGNtbHVaMVJoWnl3Z2V5QjJZV3gxWlRvZ0owMXZaSFZzWlNjZ2ZTazdYRzVjZEgxY2JseDBUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0dWNGNHOXlkSE1zSUNkZlgyVnpUVzlrZFd4bEp5d2dleUIyWVd4MVpUb2dkSEoxWlNCOUtUdGNibjA3SWl3aUx5OGdaWGgwY21GamRHVmtJR0o1SUcxcGJta3RZM056TFdWNGRISmhZM1F0Y0d4MVoybHVYRzVsZUhCdmNuUWdlMzA3SWl3aUx5OGcwWUhRdnRHQjBZTFF2dEdQMEwzUXVOR1BJTkMzMExEUXNkQzcwTDdRdXRDNDBZRFF2dEN5MExEUXZkQzkwWXZSaFNEUXROQ3cwWUpjY2x4dVpYaHdiM0owSUdOdmJuTjBJRXhQUTB0ZlZVNUJWa0ZKVEVGQ1RFVWdQU0F4TzF4eVhHNWxlSEJ2Y25RZ1kyOXVjM1FnVEU5RFMxOU1UME5MUlVRZ0lDQWdJQ0E5SURJN1hISmNibHh5WEc1bWRXNWpkR2x2YmlCRVlYUmxVbUZ1WjJWUWFXTnJaWElvSkdOdmJuUmhhVzVsY2l3Z2IzQjBhVzl1Y3lBOUlIdDlLU0I3WEhKY2JpQWdJQ0F2THlEUXZ0R0NJTkMvMEw3UXN0R0MwTDdSZ05DOTBMN1F1U0RRdU5DOTBMalJodEM0MExEUXU5QzQwTGZRc05HRzBMalF1Rnh5WEc0Z0lDQWdhV1lnS0NSamIyNTBZV2x1WlhJdWFXNXpkR0Z1WTJVcElIdGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdKR052Ym5SaGFXNWxjaTVwYm5OMFlXNWpaVHRjY2x4dUlDQWdJSDFjY2x4dUlDQWdJQ1JqYjI1MFlXbHVaWEl1YVc1emRHRnVZMlVnUFNCMGFHbHpPMXh5WEc1Y2NseHVJQ0FnSUhSb2FYTXVYeVJqYjI1MFlXbHVaWElnUFNBa1kyOXVkR0ZwYm1WeU8xeHlYRzVjY2x4dUlDQWdJSFJvYVhNdWIzQjBhVzl1Y3lBOUlIdGNjbHh1SUNBZ0lDQWdJQ0JtYVhKemRFUmhlVTltVkdobFYyVmxhem9nYjNCMGFXOXVjeTVtYVhKemRFUmhlVTltVkdobFYyVmxheUI4ZkNBeExDQWdJQ0FnSUNBZ0lDQXZMeURRdjlDMTBZRFFzdEdMMExrZzBMVFF0ZEM5MFl3ZzBMM1F0ZEMwMExYUXU5QzRMQ0F3SUQwZzBMTFJnU3dnTVNBOUlOQy8wTDBzSUM0dUxseHlYRzRnSUNBZ0lDQWdJSE5wYm1kc1pVMXZaR1U2SUNBZ0lDQWdJQ0J2Y0hScGIyNXpMbk5wYm1kc1pVMXZaR1VnSUNBZ0lDQWdJSHg4SUdaaGJITmxMQ0FnSUNBZ0lDOHZJTkN5MFl2UXNkQyswWUFnMEw3UXROQzkwTDdRdVNEUXROQ3cwWUxSaXlEUXN0QzgwTFhSZ2RHQzBMNGcwTFRRdU5DdzBML1FzTkMzMEw3UXZkQ3dYSEpjYmlBZ0lDQWdJQ0FnYkc5allXeGxPaUFnSUNBZ0lDQWdJQ0FnSUc5d2RHbHZibk11Ykc5allXeGxJQ0FnSUNBZ0lDQWdJQ0FnZkh3Z0ozSjFMVkpWSnl4Y2NseHVJQ0FnSUNBZ0lDQnRhVzVFWVhsek9pQWdJQ0FnSUNBZ0lDQWdiM0IwYVc5dWN5NXRhVzVFWVhseklDQWdJQ0FnSUNBZ0lDQjhmQ0F4TENBZ0lDQWdJQ0FnSUNBdkx5RFF2TkM0MEwzUXVOQzgwTERRdTlHTTBMM1F2dEMxSU5DNjBMN1F1OUM0MFlmUXRkR0IwWUxRc3RDK0lOQzAwTDNRdGRDNUlOQ3lJTkMwMExqUXNOQy8wTERRdDlDKzBMM1F0Vnh5WEc0Z0lDQWdJQ0FnSUcxdmJuUm9jME52ZFc1ME9pQWdJQ0FnSUNCdmNIUnBiMjV6TG0xdmJuUm9jME52ZFc1MElDQWdJQ0FnSUh4OElERXlMRnh5WEc0Z0lDQWdJQ0FnSUhCbGNsSnZkem9nSUNBZ0lDQWdJQ0FnSUNCdmNIUnBiMjV6TG5CbGNsSnZkeUFnSUNBZ0lDQWdJQ0FnSUh4OElIVnVaR1ZtYVc1bFpDd2dJQzh2SU5DNjBMN1F1OUM0MFlmUXRkR0IwWUxRc3RDK0lOQzgwTFhSZ2RHUDBZYlF0ZEN5SU5DeUlOR0EwWS9RdE5HRFhISmNiaUFnSUNBZ0lDQWdiV2x1UkdGMFpUb2dJQ0FnSUNBZ0lDQWdJRzl3ZEdsdmJuTXViV2x1UkdGMFpTQWdJQ0FnSUNBZ0lDQWdmSHdnYm1WM0lFUmhkR1VvS1N3Z0x5OGcwTHpRdU5DOTBMalF2TkN3MEx2UmpOQzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdJQ0FnSUNBZ0lHMWhlRVJoZEdVNklDQWdJQ0FnSUNBZ0lDQnZjSFJwYjI1ekxtMWhlRVJoZEdVZ0lDQWdJQ0FnSUNBZ0lIeDhJSFZ1WkdWbWFXNWxaQ3hjY2x4dUlDQWdJQ0FnSUNCaWNtVmhhM0J2YVc1MGN6b2dJQ0FnSUNBZ2IzQjBhVzl1Y3k1aWNtVmhhM0J2YVc1MGN5QWdJQ0FnSUNCOGZDQjdmU3hjY2x4dUlDQWdJQ0FnSUNCcGJuUmxjbTVoYkVsdWNIVjBjem9nSUNBZ2IzQjBhVzl1Y3k1cGJuUmxjbTVoYkVsdWNIVjBjeUFnSUNCOGZDQjBjblZsTENBZ0lDQWdJQ0F2THlEUXVOR0IwTC9RdnRDNzBZelF0OUMrMExMUXNOQzkwTGpRdFNEUXN0R0IwWUxSZ05DKzBMWFF2ZEM5MFl2UmhTRFF1TkM5MEwvUmc5R0MwTDdRc2x4eVhHNGdJQ0FnSUNBZ0lDOHZJTkdCMEw3UXNkR0wwWUxRdU5HUFhISmNiaUFnSUNBZ0lDQWdiMjQ2SUU5aWFtVmpkQzVoYzNOcFoyNG9lMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlZVzVuWlZObGJHVmpkRG9nYm5Wc2JDd2dMeThnMFlIUXZ0Q3gwWXZSZ3RDNDBMVWcwTExSaTlDeDBMN1JnTkN3SU5DMDBMalFzTkMvMExEUXQ5QyswTDNRc0NEUXROQ3cwWUpjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdaR0Y1VTJWc1pXTjBPaUFnSUc1MWJHd3NJQzh2SU5HQjBMN1FzZEdMMFlMUXVOQzFJTkN5MFl2UXNkQyswWURRc0NEUXZ0QzAwTDNRdnRDNUlOQzAwTERSZ3RHTElDalJndEMrMEx2UmpOQzYwTDRnMEwvUmdOQzRJSE5wYm1kc1pVMXZaR1U2SUhSeWRXVXBYSEpjYmlBZ0lDQWdJQ0FnZlN3Z2IzQjBhVzl1Y3k1dmJpQjhmQ0I3ZlNrc1hISmNiaUFnSUNBZ0lDQWdMeThnMFlUUXVOQzcwWXpSZ3RHQTBZUFJqdEdKMExqUXRTRFF2TkMxMFlMUXZ0QzAwWXRjY2x4dUlDQWdJQ0FnSUNCbWFXeDBaWEk2SUU5aWFtVmpkQzVoYzNOcFoyNG9lMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnNiMk5yUkdGNWN6b2dJQ0FnZEdocGN5NWZabWxzZEdWeVRHOWphMFJoZVhNc0lDQWdJQzh2SUdOaGJHeGlZV05yS0dSaGRHVXBJTkdFMFlQUXZkQzYwWWJRdU5HUElOQ3gwTHZRdnRDNjBMalJnTkMrMExMUXNOQzkwTGpSanlEUXROQ3cwWUlzSUhSeWRXVXZURTlEUzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IwYjI5c2RHbHdWR1Y0ZERvZ2RHaHBjeTVmWm1sc2RHVnlWRzl2YkhScGNGUmxlSFFzSUM4dklHTmhiR3hpWVdOcktHUmhlWE1wSU5DeTBZdlFzdEMrMExRZzBZTFF0ZEM2MFlIUmd0Q3dJTkMvMEw3UXROR0IwTHJRc05DMzBMclF1Rnh5WEc0Z0lDQWdJQ0FnSUgwc0lHOXdkR2x2Ym5NdVptbHNkR1Z5SUh4OElIdDlLU3hjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCMGFHbHpMbWx1YVhRb0tUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DWTBMM1F1TkdHMExqUXNOQzcwTGpRdDlDdzBZYlF1TkdQWEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG1sdWFYUWdQU0JtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUM4dklOR0EwWS9RdE5DOTBMN1JnZEdDMFl4Y2NseHVJQ0FnSUdsbUlDaDBlWEJsYjJZZ2RHaHBjeTV2Y0hScGIyNXpMbkJsY2xKdmR5QTlQU0FuZFc1a1pXWnBibVZrSnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdWIzQjBhVzl1Y3k1d1pYSlNiM2NnUFNCMGFHbHpMbTl3ZEdsdmJuTXViVzl1ZEdoelEyOTFiblE3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1dGFXNUVZWFJsS1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG0xcGJrUmhkR1V1YzJWMFNHOTFjbk1vTUN3Z01Dd2dNQ3dnTUNrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMEw3UXY5R0cwTGpRdUNEUXROQzcwWThnMFkzUXV0R0EwTERRdmRDKzBMSWcwTC9RdmlEUmc5QzgwTDdRdTlHSDBMRFF2ZEM0MFk1Y2NseHVJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NWljbVZoYTNCdmFXNTBjMXQwYUdsekxsOWljbVZoYTNCdmFXNTBJRDBnTUYwZ1BTQlBZbXBsWTNRdVlYTnphV2R1S0h0OUxDQjBhR2x6TG05d2RHbHZibk1wTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkdDMExYUXV0R0QwWW5RdU5DNUlOQzAwTFhRdmRHTVhISmNiaUFnSUNCMGFHbHpMbDkwYjJSaGVTQTlJRzVsZHlCRVlYUmxLQ2s3WEhKY2JpQWdJQ0IwYUdsekxsOTBiMlJoZVM1elpYUkliM1Z5Y3lnd0xDQXdMQ0F3TENBd0tUdGNjbHh1WEhKY2JpQWdJQ0IwYUdsekxsOGtjR2xqYTJWeUlEMGdkR2hwY3k1ZkpHTnlaV0YwWlVWc1pXMWxiblFvWEhKY2JpQWdJQ0FnSUNBZ1lEeGthWFlnWTJ4aGMzTTlYQ0pFWVhSbGNtRnVaMlZ3YVdOclpYSmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdKSHQwYUdsekxtOXdkR2x2Ym5NdWFXNTBaWEp1WVd4SmJuQjFkSE1nUDF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1lEeGthWFlnWTJ4aGMzTTlYQ0pFWVhSbGNtRnVaMlZ3YVdOclpYSmZYMmx1Y0hWMGMxd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHBibkIxZENCMGVYQmxQVndpYUdsa1pHVnVYQ0lnYm1GdFpUMWNJbVJoZEdWZlpuSnZiVndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhwYm5CMWRDQjBlWEJsUFZ3aWFHbGtaR1Z1WENJZ2JtRnRaVDFjSW1SaGRHVmZkRzljSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZaR2wyUG1BZ09pQW5KMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pFWVhSbGNtRnVaMlZ3YVdOclpYSmZYMjF2Ym5Sb2Mxd2lQand2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWd2lSR0YwWlhKaGJtZGxjR2xqYTJWeVgxOTBiMjlzZEdsd1hDSStQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdQQzlrYVhZK1lGeHlYRzRnSUNBZ0tUdGNjbHh1WEhKY2JpQWdJQ0F2THlEUmpkQzcwTFhRdk5DMTBMM1JndEdMWEhKY2JpQWdJQ0IwYUdsekxsOGtiVzl1ZEdoeklDQTlJSFJvYVhNdVh5UndhV05yWlhJdWNYVmxjbmxUWld4bFkzUnZjaWduTGtSaGRHVnlZVzVuWlhCcFkydGxjbDlmYlc5dWRHaHpKeWs3WEhKY2JpQWdJQ0IwYUdsekxsOGtkRzl2YkhScGNDQTlJSFJvYVhNdVh5UndhV05yWlhJdWNYVmxjbmxUWld4bFkzUnZjaWduTGtSaGRHVnlZVzVuWlhCcFkydGxjbDlmZEc5dmJIUnBjQ2NwTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkMvMEw3UXU5R1BJTkN5MExMUXZ0QzAwTEJjY2x4dUlDQWdJSFJvYVhNdVh5UnBibkIxZEVaeWIyMGdQU0IwYUdsekxsOGtjR2xqYTJWeUxuRjFaWEo1VTJWc1pXTjBiM0lvSjF0dVlXMWxQVndpWkdGMFpWOW1jbTl0WENKZEp5azdYSEpjYmlBZ0lDQjBhR2x6TGw4a2FXNXdkWFJVYnlBZ0lEMGdkR2hwY3k1ZkpIQnBZMnRsY2k1eGRXVnllVk5sYkdWamRHOXlLQ2RiYm1GdFpUMWNJbVJoZEdWZmRHOWNJbDBuS1R0Y2NseHVYSEpjYmlBZ0lDQXZMeURRdU5DOTBMalJodEM0MExEUXU5QzQwTGZRc05HRzBMalJqeURSZ2RDKzBZSFJndEMrMFkvUXZkQzQwTGxjY2x4dUlDQWdJSFJvYVhNdWNtRnVaMlZTWlhObGRDZ3BPMXh5WEc1Y2NseHVJQ0FnSUM4dklOR0EwTFhRdmRDMDBMWFJnRnh5WEc0Z0lDQWdkR2hwY3k1ZmMyVnNaV04wUkdGMFpTaDBhR2x6TG05d2RHbHZibk11YldsdVJHRjBaU2s3WEhKY2JpQWdJQ0IwYUdsekxsOGtZMjl1ZEdGcGJtVnlMbUZ3Y0dWdVpFTm9hV3hrS0hSb2FYTXVYeVJ3YVdOclpYSXBPMXh5WEc1Y2NseHVJQ0FnSUM4dklOQyswTEhSZ05DdzBMSFF2dEdDMExyUXNDRFFzZEdBMExYUXVkQzYwTC9RdnRDNDBMM1JndEMrMExKY2NseHVJQ0FnSUdsbUlDaFBZbXBsWTNRdWEyVjVjeWgwYUdsekxtOXdkR2x2Ym5NdVluSmxZV3R3YjJsdWRITXBMbXhsYm1kMGFDa2dlMXh5WEc0Z0lDQWdJQ0FnSUhkcGJtUnZkeTVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2R5WlhOcGVtVW5MQ0IwYUdsekxsOXZibGRwYm1SdmQxSmxjMmw2WlVWMlpXNTBMbUpwYm1Rb2RHaHBjeWtwTzF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDI5dVYybHVaRzkzVW1WemFYcGxSWFpsYm5Rb0tUdGNjbHh1SUNBZ0lIMWNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DZDBMRFF0OUN5MExEUXZkQzQwTFVnMEx6UXRkR0IwWS9SaHRDd1hISmNiaUFxSUVCd1lYSmhiU0FnZTBSaGRHVjlJR1JoZEdVZzBKN1FzZEdLMExYUXV0R0NJTkMwMExEUmd0R0xYSEpjYmlBcUlFQnlaWFIxY200Z2UxTjBjbWx1WjMxY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVoyVjBUVzl1ZEdoR2IzSnRZWFIwWldRZ1BTQm1kVzVqZEdsdmJpaGtZWFJsS1NCN1hISmNiaUFnSUNCamIyNXpkQ0IwYVhSc1pTQTlJSFJvYVhNdVoyVjBSR0YwWlZScGJXVkdiM0p0WVhRb1pHRjBaU3dnZTIxdmJuUm9PaUFuYkc5dVp5ZDlLVHRjY2x4dUlDQWdJSEpsZEhWeWJpQjBhWFJzWlM1emJHbGpaU2d3TENBeEtTNTBiMVZ3Y0dWeVEyRnpaU2dwSUNzZ2RHbDBiR1V1YzJ4cFkyVW9NU2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFwTkMrMFlEUXZOQ3cwWUxRdU5HQTBMN1FzdEN3MEwzUXVOQzFJTkMwMExEUmd0R0xJTkMwMEx2Ump5RFJndEMxMExyUmc5R0owTFhRdVNEUXU5QyswTHJRc05DNzBMaGNjbHh1SUNvZ1FIQmhjbUZ0SUNCN1JHRjBaWDBnSUNCa1lYUmxJQ0FnSU5DZTBMSFJpdEMxMExyUmdpRFF0TkN3MFlMUmkxeHlYRzRnS2lCQWNHRnlZVzBnSUh0UFltcGxZM1I5SUc5d2RHbHZibk1nMEovUXNOR0EwTERRdk5DMTBZTFJnTkdMWEhKY2JpQXFJRUJ5WlhSMWNtNGdlMU4wY21sdVozMWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVaMlYwUkdGMFpWUnBiV1ZHYjNKdFlYUWdQU0JtZFc1amRHbHZiaWhrWVhSbExDQnZjSFJwYjI1ektTQjdYSEpjYmlBZ0lDQnlaWFIxY200Z1NXNTBiQzVFWVhSbFZHbHRaVVp2Y20xaGRDaDBhR2x6TG05d2RHbHZibk11Ykc5allXeGxMQ0J2Y0hScGIyNXpLUzVtYjNKdFlYUW9aR0YwWlNrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRbE5DOTBMZ2cwTDNRdGRDMDBMWFF1OUM0WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG1kbGRGZGxaV3RFWVhselJtOXliV0YwZEdWa0lEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0JqYjI1emRDQmtZWFJsSUQwZ2JtVjNJRVJoZEdVb0tUdGNjbHh1SUNBZ0lHTnZibk4wSUhKbGMzVnNkQ0E5SUZ0ZE8xeHlYRzVjY2x4dUlDQWdJR1JoZEdVdWMyVjBSR0YwWlNoa1lYUmxMbWRsZEVSaGRHVW9LU0F0SURJcE8xeHlYRzRnSUNBZ1ptOXlJQ2hzWlhRZ2FTQTlJREE3SUdrZ1BDQTNPeUFySzJrcElIdGNjbHh1SUNBZ0lDQWdJQ0JrWVhSbExuTmxkRVJoZEdVb1pHRjBaUzVuWlhSRVlYUmxLQ2tnS3lBeEtUdGNjbHh1SUNBZ0lDQWdJQ0J5WlhOMWJIUXVjSFZ6YUNoN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGVUb2daR0YwWlM1blpYUkVZWGtvS1N4Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdsMGJHVTZJSFJvYVhNdVoyVjBSR0YwWlZScGJXVkdiM0p0WVhRb1pHRjBaU3dnZTNkbFpXdGtZWGs2SUNkemFHOXlkQ2Q5S1N4Y2NseHVJQ0FnSUNBZ0lDQjlLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFJnZEMrMFlEUmd0QzQwWURRdnRDeTBMclFzQ0RSZ2RDKzBMUFF1OUN3MFlIUXZkQytJTkM5MExEUmdkR0MwWURRdnRDMTBMM1F2ZEMrMEx6Umd5RFF2OUMxMFlEUXN0QyswTHpSZ3lEUXROQzkwWTRnMEwzUXRkQzAwTFhRdTlDNFhISmNiaUFnSUNCeVpYTjFiSFF1YzI5eWRDZ29ZU3dnWWlrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR1pwY25OMFJHRjVUMlpVYUdWWFpXVnJJRDBnZEdocGN5NXZjSFJwYjI1ekxtWnBjbk4wUkdGNVQyWlVhR1ZYWldWcklDVWdOenRjY2x4dUlDQWdJQ0FnSUNCc1pYUWdaR0Y1UVNBOUlHRXVaR0Y1TzF4eVhHNGdJQ0FnSUNBZ0lHeGxkQ0JrWVhsQ0lEMGdZaTVrWVhrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUdsbUlDaGtZWGxCSUQwOUlHWnBjbk4wUkdGNVQyWlVhR1ZYWldWcktTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlBdE1UdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJR2xtSUNoa1lYbENJRDA5SUdacGNuTjBSR0Y1VDJaVWFHVlhaV1ZyS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUF4TzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLR1JoZVVFZ1BDQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmtZWGxCSUNzOUlISmxjM1ZzZEM1c1pXNW5kR2c3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCcFppQW9aR0Y1UWlBOElHWnBjbk4wUkdGNVQyWlVhR1ZYWldWcktTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHUmhlVUlnS3owZ2NtVnpkV3gwTG14bGJtZDBhRHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJrWVhsQklDMGdaR0Y1UWp0Y2NseHVJQ0FnSUgwcE8xeHlYRzVjY2x4dUlDQWdJSEpsZEhWeWJpQnlaWE4xYkhRN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRbXRDKzBMdlF1TkdIMExYUmdkR0MwTExRdmlEUXROQzkwTFhRdVNEUXNpRFF2TkMxMFlIUmo5R0cwTFZjY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ29nUUhKbGRIVnliaUI3VG5WdFltVnlmU0FnSUNEUW10QyswTHZRdU5HSDBMWFJnZEdDMExMUXZpRFF0TkM5MExYUXVWeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNW5aWFJFWVhselEyOTFiblJKYmsxdmJuUm9JRDBnWm5WdVkzUnBiMjRvWkdGMFpTa2dlMXh5WEc0Z0lDQWdZMjl1YzNRZ1pHRjVjeUE5SUc1bGR5QkVZWFJsS0dSaGRHVXVaMlYwVkdsdFpTZ3BLVHRjY2x4dUlDQWdJR1JoZVhNdWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmlBZ0lDQmtZWGx6TG5ObGRFMXZiblJvS0dSaGVYTXVaMlYwVFc5dWRHZ29LU0FySURFcE8xeHlYRzRnSUNBZ1pHRjVjeTV6WlhSRVlYUmxLREFwTzF4eVhHNGdJQ0FnY21WMGRYSnVJR1JoZVhNdVoyVjBSR0YwWlNncE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtIUXNkR0EwTDdSZ1NEUXN0R0wwTFRRdGRDNzBMWFF2ZEM5MFl2UmhTRFF0TkN3MFlKY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdWNtRnVaMlZTWlhObGRDQTlJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hTWlhObGRDZ3BPMXh5WEc0Z0lDQWdkR2hwY3k1ZmMyVnNaV04wYVc5dUlEMGdlMzA3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFrdEdMMExUUXRkQzcwTFhRdmRDNDBMVWcwTFRRdU5DdzBML1FzTkMzMEw3UXZkQ3dJTkMwMExEUmdseHlYRzRnS2lCQWNHRnlZVzBnZTBSaGRHVjlJR1JoZEdWZlpuSnZiU0RRbmRDdzBZZlFzTkM3MFl6UXZkQ3cwWThnMExUUXNOR0MwTEJjY2x4dUlDb2dRSEJoY21GdElIdEVZWFJsZlNCa1lYUmxYM1J2SUNBZzBKclF2dEM5MExYUmg5QzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1eVlXNW5aVk5sYkdWamRDQTlJR1oxYm1OMGFXOXVLR1JoZEdWZlpuSnZiU3dnWkdGMFpWOTBieWtnZTF4eVhHNGdJQ0FnWkdGMFpWOW1jbTl0TG5ObGRFaHZkWEp6S0RBc0lEQXNJREFzSURBcE8xeHlYRzRnSUNBZ1pHRjBaVjkwYnk1elpYUkliM1Z5Y3lnd0xDQXdMQ0F3TENBd0tUdGNjbHh1WEhKY2JpQWdJQ0F2THlEUXROQyswTC9SZzlHQjBZTFF1TkM4MFl2UXVTRFF0TkM0MExEUXY5Q3cwTGZRdnRDOVhISmNiaUFnSUNCcFppQW9JWFJvYVhNdVoyVjBTWE5TWVc1blpWTmxiR1ZqZEdGaWJHVW9aR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLU2tnZTF4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQmpiMjV6ZENBa1pHRjVYMlp5YjIwZ1BTQjBhR2x6TGw4a1oyVjBSR0Y1UW5sRVlYUmxLR1JoZEdWZlpuSnZiU2s3WEhKY2JpQWdJQ0JqYjI1emRDQWtaR0Y1WDNSdklEMGdkR2hwY3k1ZkpHZGxkRVJoZVVKNVJHRjBaU2hrWVhSbFgzUnZLVHRjY2x4dVhISmNiaUFnSUNCcFppQW9KR1JoZVY5bWNtOXRLU0I3WEhKY2JpQWdJQ0FnSUNBZ0pHUmhlVjltY205dExtTnNZWE56VEdsemRDNWhaR1FvSjJsekxYTmxiR1ZqZEdWa0p5d2dKMmx6TFhObGJHVmpkR1ZrTFdaeWIyMG5LVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCcFppQW9KR1JoZVY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNSa1lYbGZkRzh1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRkRzhuS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURRc3RHTDBMVFF0ZEM3MExYUXZkQzQwTFVnMFkzUXU5QzEwTHpRdGRDOTBZTFF2dEN5WEhKY2JpQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDaGtZWFJsWDJaeWIyMHNJR1JoZEdWZmRHOHBPMXh5WEc1Y2NseHVJQ0FnSUM4dklOQ3kwWXZRc2RDKzBZQWcwTFRRc05HQ0lOQ3lJTkMrMExIUmdOQ3cwWUxRdmRDKzBMd2cwTC9RdnRHQTBZL1F0TkM2MExWY2NseHVJQ0FnSUdsbUlDaGtZWFJsWDJaeWIyMGdQaUJrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ1cyUmhkR1ZmWm5KdmJTd2daR0YwWlY5MGIxMGdQU0JiWkdGMFpWOTBieXdnWkdGMFpWOW1jbTl0WFR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURRdnRDeDBMM1F2dEN5MEx2UXRkQzkwTGpRdFNEUXVOQzkwTC9SZzlHQzBMN1FzbHh5WEc0Z0lDQWdhV1lnS0hSb2FYTXVYeVJwYm5CMWRFWnliMjBwSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw4a2FXNXdkWFJHY205dExuWmhiSFZsSUQwZ2RHaHBjeTVtYjNKdFlYUkVZWFJsS0dSaGRHVmZabkp2YlNrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdhV1lnS0hSb2FYTXVYeVJwYm5CMWRGUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmSkdsdWNIVjBWRzh1ZG1Gc2RXVWdQU0IwYUdsekxtWnZjbTFoZEVSaGRHVW9aR0YwWlY5MGJ5azdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBZSFF2dEN4MFl2Umd0QzQwTFZjY2x4dUlDQWdJSFJvYVhNdVgyTmhiR3hpWVdOcktDZHlZVzVuWlZObGJHVmpkQ2NzSUdSaGRHVmZabkp2YlN3Z1pHRjBaVjkwYnlrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRcE5DKzBZRFF2TkN3MFlMUXVOR0EwTDdRc3RDdzBMM1F1TkMxSU5DMDBMRFJndEdMWEhKY2JpQXFJRUJ3WVhKaGJTQWdlMFJoZEdWOUlDQWdaR0YwWlNBZ0lOQ2UwTEhSaXRDMTBMclJnaURRdE5DdzBZTFJpMXh5WEc0Z0tpQkFjR0Z5WVcwZ0lIdFRkSEpwYm1kOUlHWnZjbTFoZENEUXBOQyswWURRdk5DdzBZSWcwWUhSZ3RHQTBMN1F1dEM0WEhKY2JpQXFJRUJ5WlhSMWNtNGdlMU4wY21sdVozMWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVabTl5YldGMFJHRjBaU0E5SUdaMWJtTjBhVzl1S0dSaGRHVXNJR1p2Y20xaGRDQTlJQ2RaTFcwdFpDY3BJSHRjY2x4dUlDQWdJSEpsZEhWeWJpQm1iM0p0WVhRdWNtVndiR0ZqWlNnbldTY3NJR1JoZEdVdVoyVjBSblZzYkZsbFlYSW9LU2xjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBdWNtVndiR0ZqWlNnbmJTY3NJQ2duTUNjZ0t5QW9aR0YwWlM1blpYUk5iMjUwYUNncElDc2dNU2twTG5Oc2FXTmxLQzB5S1NsY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXVjbVZ3YkdGalpTZ25aQ2NzSUNnbk1DY2dLeUFvWkdGMFpTNW5aWFJFWVhSbEtDa3BLUzV6YkdsalpTZ3RNaWtwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSi9SZ05DKzBMTFF0ZEdBMExyUXNDRFFzdEMrMExmUXZOQyswTGJRdmRDKzBZSFJndEM0SU5DeTBZdlF0TkMxMEx2UXRkQzkwTGpSanlEUXROQ3cwWUpjY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlNCa1lYUmxYMlp5YjIwZzBKM1FzTkdIMExEUXU5R00wTDNRc05HUElOQzAwTERSZ3RDd1hISmNiaUFxSUVCd1lYSmhiU0FnZTBSaGRHVWdaR0YwWlY5MGJ5QWdJTkNhMEw3UXZkQzEwWWZRdmRDdzBZOGcwTFRRc05HQzBMQmNjbHh1SUNvZ1FISmxkSFZ5YmlCN1FtOXZiR1ZoYm4xY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVoyVjBTWE5TWVc1blpWTmxiR1ZqZEdGaWJHVWdQU0JtZFc1amRHbHZiaWhrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzhwSUh0Y2NseHVJQ0FnSUdSaGRHVmZabkp2YlM1elpYUkliM1Z5Y3lnd0xDQXdMQ0F3TENBd0tUdGNjbHh1SUNBZ0lHUmhkR1ZmZEc4dWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmx4eVhHNGdJQ0FnYVdZZ0tHUmhkR1ZmWm5KdmJTQStJR1JoZEdWZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNCYlpHRjBaVjltY205dExDQmtZWFJsWDNSdlhTQTlJRnRrWVhSbFgzUnZMQ0JrWVhSbFgyWnliMjFkTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkM4MExqUXZkQzQwTHpRc05DNzBZelF2ZEdMMExrZzBMVFF1TkN3MEwvUXNOQzMwTDdRdlZ4eVhHNGdJQ0FnWTI5dWMzUWdaR2xtWmlBOUlFMWhkR2d1WVdKektHUmhkR1ZmWm5KdmJTNW5aWFJVYVcxbEtDa2dMU0JrWVhSbFgzUnZMbWRsZEZScGJXVW9LU2tnTHlBeE1EQXdJQzhnT0RZME1EQTdYSEpjYmlBZ0lDQnBaaUFvWkdsbVppQThJSFJvYVhNdWIzQjBhVzl1Y3k1dGFXNUVZWGx6S1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkMvMFlEUXZ0Q3kwTFhSZ05DNjBMQWcwTC9RdnRDLzBMRFF0TkN3MEwzUXVOR1BJTkN5SU5DMDBMalFzTkMvMExEUXQ5QyswTDBnMExmUXNOQ3gwTHZRdnRDNjBMalJnTkMrMExMUXNOQzkwTDNSaTlHRklOQzAwTERSZ2x4eVhHNGdJQ0FnWTI5dWMzUWdaR0Y1SUQwZ2JtVjNJRVJoZEdVb0tUdGNjbHh1SUNBZ0lHUmhlUzV6WlhSVWFXMWxLR1JoZEdWZlpuSnZiUzVuWlhSVWFXMWxLQ2twTzF4eVhHNWNjbHh1SUNBZ0lIZG9hV3hsSUNoa1lYa2dQQ0JrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVoyVjBSR0Y1VEc5amEyVmtLR1JoZVNrcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnWkdGNUxuTmxkRVJoZEdVb1pHRjVMbWRsZEVSaGRHVW9LU0FySURFcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJSEpsZEhWeWJpQjBjblZsTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSi9SZ05DKzBMTFF0ZEdBMExyUXNDRFF2ZEN3SU5DMDBMN1JnZEdDMFlQUXY5QzkwTDdSZ2RHQzBZd2cwTFRRdmRHUElOQzAwTHZSanlEUXNkR0EwTDdRdmRDNFhISmNiaUFxSUVCd1lYSmhiU0FnZTBSaGRHVjlJR1JoZEdVZzBKVFFzTkdDMExCY2NseHVJQ29nUUhKbGRIVnliaUI3UW05dmJHVmhibjBnSUNCMGNuVmxJTkMxMFlIUXU5QzRJTkMwMEw3UmdkR0MwWVBRdjlDMTBMMWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVaMlYwUkdGNVRHOWphMlZrSUQwZ1puVnVZM1JwYjI0b1pHRjBaU2tnZTF4eVhHNGdJQ0FnTHk4ZzBMTFJpOUN4MEw3UmdDRFF0TkN3MFlJZzBMTFF2ZEMxSU5DMDBMN1JnZEdDMFlQUXY5QzkwTDdRczlDK0lOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXNGeHlYRzRnSUNBZ2FXWWdLR1JoZEdVZ1BDQjBhR2x6TG05d2RHbHZibk11YldsdVJHRjBaU0I4ZkNCa1lYUmxJRDRnZEdocGN5NXZjSFJwYjI1ekxtMWhlRVJoZEdVcElIdGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdURTlEUzE5VlRrRldRVWxNUVVKTVJUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1dmNIUnBiMjV6TG1acGJIUmxjaTVzYjJOclJHRjVjeTVqWVd4c0tIUm9hWE1zSUdSaGRHVXBPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLSFF1dEM3MEw3UXZkQzEwTDNRdU5DMUlDZ3hJTkN4MEw3UXNkR1IwWUFzSURJZzBMSFF2dEN4MFlEUXNDd2dOU0RRc2RDKzBMSFJnTkMrMExJcFhISmNiaUFxSUVCd1lYSmhiU0FnZTA1MWJXSmxjbjBnZG1Gc2RXVWcwSnJRdnRDNzBMalJoOUMxMFlIUmd0Q3kwTDVjY2x4dUlDb2dRSEJoY21GdElDQjdRWEp5WVhsOUlDQm1iM0p0Y3lEUW5OQ3cwWUhSZ2RDNDBMSWcwTGpRdHlBejBZVWcwWTNRdTlDMTBMelF0ZEM5MFlMUXZ0Q3lMQ0RRdk5DKzBMYlF0ZEdDSU5HQjBMN1F0TkMxMFlEUXR0Q3cwWUxSakNEUmdkQy8wTFhSaHRDNDBZVFF1TkM2MExEUmd0QyswWUFnSldRZzBMVFF1OUdQSU5DMzBMRFF2TkMxMEwzUmkxeHlYRzRnS2lCQWNtVjBkWEp1SUh0VGRISnBibWQ5WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG5Cc2RYSmhiQ0E5SUdaMWJtTjBhVzl1SUNoMllXeDFaU3dnWm05eWJYTXBJSHRjY2x4dUlDQWdJSEpsZEhWeWJpQW9kbUZzZFdVZ0pTQXhNQ0E5UFNBeElDWW1JSFpoYkhWbElDVWdNVEF3SUNFOUlERXhJRDhnWm05eWJYTmJNRjBnT2lBb2RtRnNkV1VnSlNBeE1DQStQU0F5SUNZbUlIWmhiSFZsSUNVZ01UQWdQRDBnTkNBbUppQW9kbUZzZFdVZ0pTQXhNREFnUENBeE1DQjhmQ0IyWVd4MVpTQWxJREV3TUNBK1BTQXlNQ2tnUHlCbWIzSnRjMXN4WFNBNklHWnZjbTF6V3pKZEtTa3VjbVZ3YkdGalpTZ25KV1FuTENCMllXeDFaU2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvTkMxMEwzUXROQzEwWUFnMExUUXVOQ3cwTC9Rc05DMzBMN1F2ZEN3SU5DODBMWFJnZEdQMFliUXRkQ3lYSEpjYmlBcUlFQndZWEpoYlNCN1JHRjBaWDBnWkdGMFpWOW1jbTl0SU5DZDBMRFJoOUN3MEx2UmpOQzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZkpHTnlaV0YwWlUxdmJuUm9jeUE5SUdaMWJtTjBhVzl1S0dSaGRHVmZabkp2YlNrZ2UxeHlYRzRnSUNBZ2QyaHBiR1VnS0hSb2FYTXVYeVJ0YjI1MGFITXViR0Z6ZEVWc1pXMWxiblJEYUdsc1pDa2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYeVJ0YjI1MGFITXVjbVZ0YjNabFEyaHBiR1FvZEdocGN5NWZKRzF2Ym5Sb2N5NXNZWE4wUld4bGJXVnVkRU5vYVd4a0tUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUXY5R0EwWS9SaDlDMTBMd2cwTC9RdnRDMDBZSFF1dEN3MExmUXV0R0RYSEpjYmlBZ0lDQjBhR2x6TGw5MGIyOXNkR2x3U0dsa1pTZ3BPMXh5WEc1Y2NseHVJQ0FnSUM4dklOQy8wWURRdGRHQTBMWFF2ZEMwMExYUmdDRFF2TkMxMFlIUmo5R0cwTFhRc2x4eVhHNGdJQ0FnWTI5dWMzUWdZM1Z5Y21WdWRFUmhkR1VnUFNCdVpYY2dSR0YwWlNoa1lYUmxYMlp5YjIwdVoyVjBWR2x0WlNncEtUdGNjbHh1SUNBZ0lHTnZibk4wSUNSdGIyNTBhSE1nUFNCYlhUdGNjbHh1SUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2dkR2hwY3k1dmNIUnBiMjV6TG0xdmJuUm9jME52ZFc1ME95QXJLMmtwSUh0Y2NseHVJQ0FnSUNBZ0lDQWtiVzl1ZEdoekxuQjFjMmdvZEdocGN5NWZKR055WldGMFpVMXZiblJvS0dOMWNuSmxiblJFWVhSbEtTazdYSEpjYmlBZ0lDQWdJQ0FnWTNWeWNtVnVkRVJoZEdVdWMyVjBUVzl1ZEdnb1kzVnljbVZ1ZEVSaGRHVXVaMlYwVFc5dWRHZ29LU0FySURFcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5HQTBMWFF2ZEMwMExYUmdGeHlYRzRnSUNBZ1ptOXlJQ2hzWlhRZ2FTQTlJREE3SUdrZ1BDQWtiVzl1ZEdoekxteGxibWQwYURzZ2FTQXJQU0IwYUdsekxtOXdkR2x2Ym5NdWNHVnlVbTkzS1NCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ0pISnZkeUE5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9KMlJwZGljcE8xeHlYRzRnSUNBZ0lDQWdJQ1J5YjNjdVkyeGhjM05PWVcxbElEMGdKMFJoZEdWeVlXNW5aWEJwWTJ0bGNsOWZjbTkzSnp0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnSkcxdmJuUm9jeTV6YkdsalpTaHBMQ0JwSUNzZ2RHaHBjeTV2Y0hScGIyNXpMbkJsY2xKdmR5a3VabTl5UldGamFDZ2tiVzl1ZEdnZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWtjbTkzTG1Gd2NHVnVaRU5vYVd4a0tDUnRiMjUwYUNrN1hISmNiaUFnSUNBZ0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVh5UnRiMjUwYUhNdVlYQndaVzVrUTJocGJHUW9KSEp2ZHlrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdhV1lnS0hSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBnZkh3Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGTmxiR1ZqZENoMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0TENCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieWs3WEhKY2JpQWdJQ0I5WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvTkMxMEwzUXROQzEwWUFnMEx6UXRkR0IwWS9SaHRDd1hISmNiaUFxSUVCd1lYSmhiU0I3UkdGMFpYMGdaR0YwWlNEUW5OQzEwWUhSajlHR1hISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOGtZM0psWVhSbFRXOXVkR2dnUFNCbWRXNWpkR2x2Ymloa1lYUmxLU0I3WEhKY2JpQWdJQ0JqYjI1emRDQmpkWEp5Wlc1MFRXOXVkR2dnUFNCa1lYUmxMbWRsZEUxdmJuUm9LQ2s3WEhKY2JpQWdJQ0JqYjI1emRDQnRiMjUwYUZScGRHeGxJRDBnZEdocGN5NW5aWFJOYjI1MGFFWnZjbTFoZEhSbFpDaGtZWFJsS1R0Y2NseHVJQ0FnSUdOdmJuTjBJSGRsWld0RVlYbHpJRDBnZEdocGN5NW5aWFJYWldWclJHRjVjMFp2Y20xaGRIUmxaQ2dwTzF4eVhHNWNjbHh1SUNBZ0lHTnZibk4wSUNSdGIyNTBhQ0E5SUhSb2FYTXVYeVJqY21WaGRHVkZiR1Z0Wlc1MEtGeHlYRzRnSUNBZ0lDQWdJR0E4WkdsMklHTnNZWE56UFZ3aVRXOXVkR2hjSWlCa1lYUmhMWFJwYldVOVhDSWtlMlJoZEdVdVoyVjBWR2x0WlNncGZWd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpVFc5dWRHaGZYMmhsWVdSbGNsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrMXZiblJvWDE5aGNuSnZkeUJOYjI1MGFGOWZZWEp5YjNjdExYQnlaWFlrZXloMGFHbHpMbTl3ZEdsdmJuTXViV2x1UkdGMFpTQW1KaUJrWVhSbElEdzlJSFJvYVhNdWIzQjBhVzl1Y3k1dGFXNUVZWFJsS1NBL0lDY2dhWE10WkdsellXSnNaV1FuSURvZ0p5ZDlYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4yWnlCM2FXUjBhRDFjSWpoY0lpQm9aV2xuYUhROVhDSXhORndpSUhacFpYZENiM2c5WENJd0lEQWdPQ0F4TkZ3aUlHWnBiR3c5WENKdWIyNWxYQ0lnZUcxc2JuTTlYQ0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh5TURBd0wzTjJaMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGNHRjBhQ0JrUFZ3aVRUY2dNVE5NTVNBM1REY2dNVndpSUhOMGNtOXJaVDFjSWlNNFF6aERPRU5jSWlCemRISnZhMlV0ZDJsa2RHZzlYQ0l5WENJZ2MzUnliMnRsTFd4cGJtVmpZWEE5WENKeWIzVnVaRndpSUhOMGNtOXJaUzFzYVc1bGFtOXBiajFjSW5KdmRXNWtYQ0krUEM5d1lYUm9QbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEd3ZjM1puUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWd2lUVzl1ZEdoZlgzUnBkR3hsWENJK0pIdHRiMjUwYUZScGRHeGxmU0FrZTJSaGRHVXVaMlYwUm5Wc2JGbGxZWElvS1gwOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUY5ZllYSnliM2NnVFc5dWRHaGZYMkZ5Y205M0xTMXVaWGgwSkhzb2RHaHBjeTV2Y0hScGIyNXpMbTFoZUVSaGRHVWdKaVlnWkdGMFpTQStQU0IwYUdsekxtOXdkR2x2Ym5NdWJXRjRSR0YwWlNrZ1B5QW5JR2x6TFdScGMyRmliR1ZrSnlBNklDY25mVndpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh6ZG1jZ2QybGtkR2c5WENJNFhDSWdhR1ZwWjJoMFBWd2lNVFJjSWlCMmFXVjNRbTk0UFZ3aU1DQXdJRGdnTVRSY0lpQm1hV3hzUFZ3aWJtOXVaVndpSUhodGJHNXpQVndpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWRjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BIQmhkR2dnWkQxY0lrMHhJREF1T1RrNU9UazVURGNnTjB3eElERXpYQ0lnYzNSeWIydGxQVndpSXpoRE9FTTRRMXdpSUhOMGNtOXJaUzEzYVdSMGFEMWNJakpjSWlCemRISnZhMlV0YkdsdVpXTmhjRDFjSW5KdmRXNWtYQ0lnYzNSeWIydGxMV3hwYm1WcWIybHVQVndpY205MWJtUmNJajQ4TDNCaGRHZytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpkbWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUY5ZmQyVmxhMXdpUGlSN2QyVmxhMFJoZVhNdWJXRndLR2wwWlcwZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR0E4WkdsMklHTnNZWE56UFZ3aVRXOXVkR2hmWDNkbFpXdGtZWGxjSWo0a2UybDBaVzB1ZEdsMGJHVjlQQzlrYVhZK1lGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCOUtTNXFiMmx1S0NjbktYMDhMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrMXZiblJvWDE5a1lYbHpYQ0krUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnUEM5a2FYWStZRnh5WEc0Z0lDQWdLVHRjY2x4dVhISmNiaUFnSUNBdkx5RFJnZEdDMFlEUXRkQzcwTHJRdUZ4eVhHNGdJQ0FnVzF4eVhHNGdJQ0FnSUNBZ0lIdHpaV3hsWTNSdmNqb2dKeTVOYjI1MGFGOWZZWEp5YjNjdExYQnlaWFluTENCdVlXMWxPaUFuY0hKbGRpZDlMRnh5WEc0Z0lDQWdJQ0FnSUh0elpXeGxZM1J2Y2pvZ0p5NU5iMjUwYUY5ZllYSnliM2N0TFc1bGVIUW5MQ0J1WVcxbE9pQW5ibVY0ZENkOUxGeHlYRzRnSUNBZ1hTNW1iM0pGWVdOb0tHbDBaVzBnUFQ0Z2UxeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElDUmhjbkp2ZHlBOUlDUnRiMjUwYUM1eGRXVnllVk5sYkdWamRHOXlLR2wwWlcwdWMyVnNaV04wYjNJcE8xeHlYRzRnSUNBZ0lDQWdJQ1JoY25KdmR5NWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZGpiR2xqYXljc0lHVWdQVDRnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxsOXZia0Z5Y205M1EyeHBZMnNvSkdGeWNtOTNMQ0JwZEdWdExtNWhiV1VwTzF4eVhHNGdJQ0FnSUNBZ0lIMHBPMXh5WEc0Z0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ0x5OGcwWURRdGRDOTBMVFF0ZEdBSU5DMDBMM1F0ZEM1WEhKY2JpQWdJQ0JqYjI1emRDQWtaR0Y1Y3lBOUlDUnRiMjUwYUM1eGRXVnllVk5sYkdWamRHOXlLQ2N1VFc5dWRHaGZYMlJoZVhNbktUdGNjbHh1SUNBZ0lHTnZibk4wSUdSaGVYTWdQU0J1WlhjZ1JHRjBaU2hrWVhSbExtZGxkRlJwYldVb0tTazdYSEpjYmlBZ0lDQmtZWGx6TG5ObGRFUmhkR1VvTVNrN1hISmNiaUFnSUNCa1lYbHpMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNWNjbHh1SUNBZ0lIZG9hV3hsSUNoa1lYbHpMbWRsZEUxdmJuUm9LQ2tnUFQwZ1kzVnljbVZ1ZEUxdmJuUm9LU0I3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnSkhkbFpXc2dQU0IwYUdsekxsOGtZM0psWVhSbFYyVmxheWdwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0IzWldWclJHRjVjeTVtYjNKRllXTm9LR2wwWlcwZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvWkdGNWN5NW5aWFJFWVhrb0tTQWhQU0JwZEdWdExtUmhlU0I4ZkNCa1lYbHpMbWRsZEUxdmJuUm9LQ2tnSVQwZ1kzVnljbVZ1ZEUxdmJuUm9LU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBa2QyVmxheTVoY0hCbGJtUkRhR2xzWkNoMGFHbHpMbDhrWTNKbFlYUmxSVzF3ZEhsRVlYa29LU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNSM1pXVnJMbUZ3Y0dWdVpFTm9hV3hrS0hSb2FYTXVYeVJqY21WaGRHVkVZWGtvWkdGNWN5a3BPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmtZWGx6TG5ObGRFUmhkR1VvWkdGNWN5NW5aWFJFWVhSbEtDa2dLeUF4S1R0Y2NseHVJQ0FnSUNBZ0lDQjlLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdKR1JoZVhNdVlYQndaVzVrUTJocGJHUW9KSGRsWldzcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJSEpsZEhWeWJpQWtiVzl1ZEdnN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRbXRDNzBMalF1aURRdjlDK0lOR0IwWUxSZ05DMTBMdlF1dEMxSU5DLzBMWFJnTkMxMExyUXU5R08wWWZRdGRDOTBMalJqeURRdk5DMTBZSFJqOUdHMExCY2NseHVJQ29nUUhCaGNtRnRJSHRGYkdWdFpXNTBmU0FrWVhKeWIzY2dTRlJOVENEUmpkQzcwTFhRdk5DMTBMM1JnbHh5WEc0Z0tpQkFjR0Z5WVcwZ2UxTjBjbWx1WjMwZ2JtRnRaU0FnSUNEUW1OQzgwWThnS0hCeVpYWXNJRzVsZUhRcFhISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOXZia0Z5Y205M1EyeHBZMnNnUFNCbWRXNWpkR2x2Ymlna1lYSnliM2NzSUc1aGJXVXBJSHRjY2x4dUlDQWdJR2xtSUNna1lYSnliM2N1WTJ4aGMzTk1hWE4wTG1OdmJuUmhhVzV6S0NkcGN5MWthWE5oWW14bFpDY3BLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdOdmJuTjBJR1JoZEdVZ1BTQnVaWGNnUkdGMFpTaHdZWEp6WlVsdWRDaDBhR2x6TGw4a2JXOXVkR2h6TG5GMVpYSjVVMlZzWldOMGIzSW9KeTVOYjI1MGFDY3BMbVJoZEdGelpYUXVkR2x0WlN3Z01UQXBLVHRjY2x4dUlDQWdJR1JoZEdVdWMyVjBUVzl1ZEdnb1pHRjBaUzVuWlhSTmIyNTBhQ2dwSUNzZ0tHNWhiV1VnUFQwZ0ozQnlaWFluSUQ4Z0xYUm9hWE11YjNCMGFXOXVjeTV0YjI1MGFITkRiM1Z1ZENBNklIUm9hWE11YjNCMGFXOXVjeTV0YjI1MGFITkRiM1Z1ZENrcE8xeHlYRzVjY2x4dUlDQWdJQzh2SU5DeTBZdlJoZEMrMExRZzBMZlFzQ0RRdjlHQTBMWFF0TkMxMEx2Uml5RFF2TkM0MEwzUXVOQzgwTERRdTlHTTBMM1F2dEM1SU5DMDBMRFJndEdMWEhKY2JpQWdJQ0JwWmlBb1pHRjBaU0E4SUhSb2FYTXViM0IwYVc5dWN5NXRhVzVFWVhSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnWkdGMFpTNXpaWFJVYVcxbEtIUm9hWE11YjNCMGFXOXVjeTV0YVc1RVlYUmxMbWRsZEZScGJXVW9LU2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwTExSaTlHRjBMN1F0Q0RRdDlDd0lOQy8wWURRdGRDMDBMWFF1OUdMSU5DODBMRFF1dEdCMExqUXZOQ3cwTHZSak5DOTBMN1F1U0RRdE5DdzBZTFJpMXh5WEc0Z0lDQWdhV1lnS0hSb2FYTXViM0IwYVc5dWN5NXRZWGhFWVhSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdaVzVrUkdGMFpTQTlJRzVsZHlCRVlYUmxLR1JoZEdVdVoyVjBWR2x0WlNncEtUdGNjbHh1SUNBZ0lDQWdJQ0JsYm1SRVlYUmxMbk5sZEUxdmJuUm9LR1Z1WkVSaGRHVXVaMlYwVFc5dWRHZ29LU0FySUhSb2FYTXViM0IwYVc5dWN5NXRiMjUwYUhORGIzVnVkQ2s3WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLR1Z1WkVSaGRHVWdQaUIwYUdsekxtOXdkR2x2Ym5NdWJXRjRSR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCa1lYUmxMbk5sZEZScGJXVW9kR2hwY3k1dmNIUnBiMjV6TG0xaGVFUmhkR1V1WjJWMFZHbHRaU2dwS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWkdGMFpTNXpaWFJOYjI1MGFDaGtZWFJsTG1kbGRFMXZiblJvS0NrZ0xTQjBhR2x6TG05d2RHbHZibk11Ylc5dWRHaHpRMjkxYm5RZ0t5QXhLVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMEwvUXRkR0EwTFhSaGRDKzBMUWcwTG9nMEwzUXZ0Q3kwTDdRdVNEUXROQ3cwWUxRdFZ4eVhHNGdJQ0FnZEdocGN5NWZjMlZzWldOMFJHRjBaU2hrWVhSbEtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DajBZSFJndEN3MEwzUXZ0Q3kwTHJRc0NEUmd0QzEwTHJSZzlHSjBMWFF1U0RRdE5DdzBZTFJpeURSZ1NEUmdOQzEwTDNRdE5DMTBZRFF2dEM4WEhKY2JpQXFJRUJ3WVhKaGJTQjdSR0YwWlgwZ1pHRjBaU0RRbE5DdzBZTFFzRnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmYzJWc1pXTjBSR0YwWlNBOUlHWjFibU4wYVc5dUtHUmhkR1VwSUh0Y2NseHVJQ0FnSUhSb2FYTXVYM05sYkdWamRHVmtSR0YwWlNBOUlHUmhkR1U3WEhKY2JpQWdJQ0IwYUdsekxsOGtZM0psWVhSbFRXOXVkR2h6S0dSaGRHVXBPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLRFF0ZEM5MExUUXRkR0FJTkM5MExYUXROQzEwTHZRdUZ4eVhHNGdLaUJBY0dGeVlXMGdJSHRFWVhSbGZTQmtZWFJsSU5DZTBMSFJpdEMxMExyUmdpRFF0TkN3MFlMUmkxeHlYRzRnS2lCQWNtVjBkWEp1SUh0RmJHVnRaVzUwZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZkpHTnlaV0YwWlZkbFpXc2dQU0JtZFc1amRHbHZiaWhrWVhSbEtTQjdYSEpjYmlBZ0lDQmpiMjV6ZENBa2QyVmxheUE5SUhSb2FYTXVYeVJqY21WaGRHVkZiR1Z0Wlc1MEtGeHlYRzRnSUNBZ0lDQWdJR0E4WkdsMklHTnNZWE56UFZ3aVYyVmxhMXdpUGp3dlpHbDJQbUJjY2x4dUlDQWdJQ2s3WEhKY2JseHlYRzRnSUNBZ2NtVjBkWEp1SUNSM1pXVnJPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLRFF0ZEM5MExUUXRkR0FJTkMwMEwzUmoxeHlYRzRnS2lCQWNHRnlZVzBnSUh0RVlYUmxmU0JrWVhSbElOQ2UwTEhSaXRDMTBMclJnaURRdE5DdzBZTFJpMXh5WEc0Z0tpQkFjbVYwZFhKdUlIdEZiR1Z0Wlc1MGZWeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZKR055WldGMFpVUmhlU0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJR052Ym5OMElHeHZZMnRsWkNBOUlIUm9hWE11WjJWMFJHRjVURzlqYTJWa0tHUmhkR1VwTzF4eVhHNGdJQ0FnWTI5dWMzUWdkRzlrWVhrZ0lEMGdkR2hwY3k1ZmRHOWtZWGt1WjJWMFZHbHRaU2dwSUQwOUlHUmhkR1V1WjJWMFZHbHRaU2dwTzF4eVhHNWNjbHh1SUNBZ0lHeGxkQ0JqYkdGemMwNWhiV1VnUFNBbkp6dGNjbHh1SUNBZ0lHTnNZWE56VG1GdFpTQXJQU0JzYjJOclpXUWdQeUFuSUdsekxXUnBjMkZpYkdWa0p5QTZJQ2NuTzF4eVhHNGdJQ0FnWTJ4aGMzTk9ZVzFsSUNzOUlHeHZZMnRsWkNBOVBTQk1UME5MWDB4UFEwdEZSQ0EvSUNjZ2FYTXRiRzlqYTJWa0p5QTZJQ2NuTzF4eVhHNGdJQ0FnWTJ4aGMzTk9ZVzFsSUNzOUlIUnZaR0Y1SUQ4Z0p5QnBjeTEwYjJSaGVTY2dPaUFuSnp0Y2NseHVYSEpjYmlBZ0lDQmpiMjV6ZENBa1pHRjVJRDBnZEdocGN5NWZKR055WldGMFpVVnNaVzFsYm5Rb1hISmNiaUFnSUNBZ0lDQWdZRHhrYVhZZ1kyeGhjM005WENKRVlYa2tlMk5zWVhOelRtRnRaWDFjSWlCa1lYUmhMWFJwYldVOVhDSWtlMlJoZEdVdVoyVjBWR2x0WlNncGZWd2lJR1JoZEdFdFpHRjVQVndpSkh0a1lYUmxMbWRsZEVSaGVTZ3BmVndpUGlSN1pHRjBaUzVuWlhSRVlYUmxLQ2w5UEM5a2FYWStZRnh5WEc0Z0lDQWdLVHRjY2x4dVhISmNiaUFnSUNBa1pHRjVMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KMk5zYVdOckp5d2dkR2hwY3k1ZmIyNUVZWGxEYkdsamEwVjJaVzUwTG1KcGJtUW9kR2hwY3lrcE8xeHlYRzVjY2x4dUlDQWdJR2xtSUNnaGRHaHBjeTV2Y0hScGIyNXpMbk5wYm1kc1pVMXZaR1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQWtaR0Y1TG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjIxdmRYTmxaVzUwWlhJbkxDQjBhR2x6TGw5dmJrUmhlVTF2ZFhObFJXNTBaWEpGZG1WdWRDNWlhVzVrS0hSb2FYTXBLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCeVpYUjFjbTRnSkdSaGVUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DaDBMN1FzZEdMMFlMUXVOQzFJTkM2MEx2UXVOQzYwTEFnMEwvUXZpRFF0TkM5MFk1Y2NseHVJQ29nUUhCaGNtRnRJSHRGZG1WdWRIMGdaU0JFVDAwZzBZSFF2dEN4MFl2Umd0QzQwTFZjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDI5dVJHRjVRMnhwWTJ0RmRtVnVkQ0E5SUdaMWJtTjBhVzl1S0dVcElIdGNjbHh1SUNBZ0lIUm9hWE11WDI5dVJHRjVRMnhwWTJzb1pTNTBZWEpuWlhRcE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtIUXZ0Q3gwWXZSZ3RDNDBMVWcwWVhRdnRDeTBMWFJnTkN3WEhKY2JpQXFJRUJ3WVhKaGJTQjdSWFpsYm5SOUlHVWdSRTlOSU5HQjBMN1FzZEdMMFlMUXVOQzFYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDl2YmtSaGVVMXZkWE5sUlc1MFpYSkZkbVZ1ZENBOUlHWjFibU4wYVc5dUtHVXBJSHRjY2x4dUlDQWdJSFJvYVhNdVgyOXVSR0Y1VFc5MWMyVkZiblJsY2lobExuUmhjbWRsZENrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRcGRDKzBMTFF0ZEdBSU5DOTBMQWcwWTNRdTlDMTBMelF0ZEM5MFlMUXRTRFF0TkM5MFk5Y2NseHVJQ29nUUhCaGNtRnRJSHRGYkdWdFpXNTBmU0FrWkdGNUlFaFVUVXdnMEszUXU5QzEwTHpRdGRDOTBZSmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYMjl1UkdGNVRXOTFjMlZGYm5SbGNpQTlJR1oxYm1OMGFXOXVLQ1JrWVhrcElIdGNjbHh1SUNBZ0lHbG1JQ2doZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU0I4ZkNCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvSkdSaGVTNWtZWFJoYzJWMExuUnBiV1VnUFQwZ2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlM1blpYUlVhVzFsS0NrcElIdGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNDdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnWTI5dWMzUWdaR0YwWlY5MGJ5QTlJRzVsZHlCRVlYUmxLSEJoY25ObFNXNTBLQ1JrWVhrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcE8xeHlYRzRnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1FvZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU3dnWkdGMFpWOTBieWs3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFtdEM3MExqUXVpRFF2OUMrSU5DMDBMM1JqbHh5WEc0Z0tpQkFjR0Z5WVcwZ2UwVnNaVzFsYm5SOUlDUmtZWGtnU0ZSTlRDRFFyZEM3MExYUXZOQzEwTDNSZ2x4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZmIyNUVZWGxEYkdsamF5QTlJR1oxYm1OMGFXOXVLQ1JrWVhrcElIdGNjbHh1SUNBZ0lDOHZJTkMwMExYUXZkR01JTkMzMExEUXNkQzcwTDdRdXRDNDBZRFF2dEN5MExEUXZWeHlYRzRnSUNBZ2FXWWdLQ1JrWVhrdVkyeGhjM05NYVhOMExtTnZiblJoYVc1ektDZHBjeTFrYVhOaFlteGxaQ2NwS1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkN5MFl2UXNkQyswWUFnMEw3UXROQzkwTDdRdVNEUXROQ3cwWUxSaTF4eVhHNGdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTV6YVc1bmJHVk5iMlJsS1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1eVlXNW5aVkpsYzJWMEtDazdYSEpjYmlBZ0lDQWdJQ0FnSkdSaGVTNWpiR0Z6YzB4cGMzUXVZV1JrS0NkcGN5MXpaV3hsWTNSbFpDY3BPMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMk5oYkd4aVlXTnJLQ2RrWVhsVFpXeGxZM1FuTENCdVpYY2dSR0YwWlNod1lYSnpaVWx1ZENna1pHRjVMbVJoZEdGelpYUXVkR2x0WlN3Z01UQXBLU2s3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkdCMExIUmdOQyswWUVnMExMUmk5Q3gwWURRc05DOTBMM1F2dEN6MEw0ZzBZRFFzTkM5MExYUXRTRFF0TkM0MExEUXY5Q3cwTGZRdnRDOTBMQmNjbHh1SUNBZ0lHbG1JQ2gwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRJQ1ltSUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTV5WVc1blpWSmxjMlYwS0NrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdKR1JoZVM1amJHRnpjMHhwYzNRdVlXUmtLQ2RwY3kxelpXeGxZM1JsWkNjcE8xeHlYRzVjY2x4dUlDQWdJQzh2SU5DeTBZdlFzZEdBMExEUXZkQ3dJTkM5MExEUmg5Q3cwTHZSak5DOTBMRFJqeUF2SU5DNjBMN1F2ZEMxMFlmUXZkQ3cwWThnMExUUXNOR0MwTEJjY2x4dUlDQWdJR2xtSUNnaGRHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlNrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMGdQU0J1WlhjZ1JHRjBaU2h3WVhKelpVbHVkQ2drWkdGNUxtUmhkR0Z6WlhRdWRHbHRaU3dnTVRBcEtUdGNjbHh1SUNBZ0lIMGdaV3h6WlNCcFppQW9JWFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZmRHOGdQU0J1WlhjZ1JHRjBaU2h3WVhKelpVbHVkQ2drWkdGNUxtUmhkR0Z6WlhRdWRHbHRaU3dnTVRBcEtUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JwWmlBb2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlNBbUppQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJQzh2SU5DMDBMN1F2OUdEMFlIUmd0QzQwTHpSaTlDNUlOQzAwTGpRc05DLzBMRFF0OUMrMEwxY2NseHVJQ0FnSUNBZ0lDQnBaaUFvSVhSb2FYTXVaMlYwU1hOU1lXNW5aVk5sYkdWamRHRmliR1VvZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU3dnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZmRHOHBLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdWNtRnVaMlZTWlhObGRDZ3BPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200N1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TG5KaGJtZGxVMlZzWldOMEtIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYMlp5YjIwc0lIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYM1J2S1R0Y2NseHVJQ0FnSUgxY2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNTMExqUXQ5R0QwTERRdTlHTTBMM1JpOUM1SU5HQjBMSFJnTkMrMFlFZzBMTFJpOUMwMExYUXU5QzEwTDNRdmRHTDBZVWcwTFRRc05HQ1hISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOXlZVzVuWlZacGMzVmhiRkpsYzJWMElEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0JqYjI1emRDQWtaR0Y1Y3lBOUlIUm9hWE11WHlSdGIyNTBhSE11Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2duTGtSaGVWdGtZWFJoTFhScGJXVmRKeWs3WEhKY2JpQWdJQ0FrWkdGNWN5NW1iM0pGWVdOb0tDUmtZWGtnUFQ0Z2UxeHlYRzRnSUNBZ0lDQWdJQ1JrWVhrdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbmFYTXRjMlZzWldOMFpXUW5MQ0FuYVhNdGMyVnNaV04wWldRdFpuSnZiU2NzSUNkcGN5MXpaV3hsWTNSbFpDMTBieWNzSUNkcGN5MXpaV3hsWTNSbFpDMWlaWFIzWldWdUp5azdYSEpjYmlBZ0lDQjlLVHRjY2x4dVhISmNiaUFnSUNBdkx5RFF2OUdBMFkvUmg5QzEwTHdnMEwvUXZ0QzAwWUhRdXRDdzBMZlF1dEdEWEhKY2JpQWdJQ0IwYUdsekxsOTBiMjlzZEdsd1NHbGtaU2dwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSkxRdU5DMzBZUFFzTkM3MFl6UXZkQyswTFVnMExMUmk5QzAwTFhRdTlDMTBMM1F1TkMxSU5DMDBMRFJnbHh5WEc0Z0tpQkFjR0Z5WVcwZ2UwUmhkR1Y5SUdSaGRHVmZabkp2YlNEUW5kQ3cwWWZRc05DNzBZelF2ZEN3MFk4ZzBMVFFzTkdDMExCY2NseHVJQ29nUUhCaGNtRnRJSHRFWVhSbGZTQmtZWFJsWDNSdklDQWcwSnJRdnRDOTBMWFJoOUM5MExEUmp5RFF0TkN3MFlMUXNGeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUWdQU0JtZFc1amRHbHZiaWhrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzhwSUh0Y2NseHVJQ0FnSUdsbUlDaGtZWFJsWDJaeWIyMGdKaVlnWkdGMFpWOW1jbTl0SUdsdWMzUmhibU5sYjJZZ1JHRjBaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHUmhkR1ZmWm5KdmJTNXpaWFJJYjNWeWN5Z3dMQ0F3TENBd0xDQXdLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCcFppQW9aR0YwWlY5MGJ5QW1KaUJrWVhSbFgzUnZJR2x1YzNSaGJtTmxiMllnUkdGMFpTa2dlMXh5WEc0Z0lDQWdJQ0FnSUdSaGRHVmZkRzh1YzJWMFNHOTFjbk1vTUN3Z01Dd2dNQ3dnTUNrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdiR1YwSUhScGJXVmZabkp2YlNBOUlHUmhkR1ZmWm5KdmJTQnBibk4wWVc1alpXOW1JRVJoZEdVZ1B5QmtZWFJsWDJaeWIyMHVaMlYwVkdsdFpTZ3BJRG9nTUR0Y2NseHVJQ0FnSUd4bGRDQjBhVzFsWDNSdklEMGdaR0YwWlY5MGJ5QnBibk4wWVc1alpXOW1JRVJoZEdVZ1B5QmtZWFJsWDNSdkxtZGxkRlJwYldVb0tTQTZJREE3WEhKY2JpQWdJQ0JwWmlBb2RHbHRaVjltY205dElENGdkR2x0WlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUZ0MGFXMWxYMlp5YjIwc0lIUnBiV1ZmZEc5ZElEMGdXM1JwYldWZmRHOHNJSFJwYldWZlpuSnZiVjA3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwTExSaTlDMDBMWFF1OUMxMEwzUXVOQzFJTkMwMExEUmdpRFF2TkMxMExiUXROR0RJTkM5MExEUmg5Q3cwTHZSak5DOTBMN1F1U0RRdUNEUXV0QyswTDNRdGRHSDBMM1F2dEM1WEhKY2JpQWdJQ0JqYjI1emRDQWtaR0Y1Y3lBOUlIUm9hWE11WHlSdGIyNTBhSE11Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2duTGtSaGVWdGtZWFJoTFhScGJXVmRKeWs3WEhKY2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUNSa1lYbHpMbXhsYm1kMGFEc2dLeXRwS1NCN1hISmNiaUFnSUNBZ0lDQWdKR1JoZVhOYmFWMHVZMnhoYzNOTWFYTjBMblJ2WjJkc1pTZ25hWE10YzJWc1pXTjBaV1F0WW1WMGQyVmxiaWNzSUNSa1lYbHpXMmxkTG1SaGRHRnpaWFF1ZEdsdFpTQStJSFJwYldWZlpuSnZiU0FtSmlBa1pHRjVjMXRwWFM1a1lYUmhjMlYwTG5ScGJXVWdQQ0IwYVcxbFgzUnZLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFFzdEdMMExUUXRkQzcwTFhRdmRDNDBMVWcwTDNRc05HSDBMRFF1OUdNMEwzUXZ0QzVJTkM0SU5DNjBMN1F2ZEMxMFlmUXZkQyswTGtnMEwvUXZ0QzMwTGpSaHRDNDBMaGNjbHh1SUNBZ0lHTnZibk4wSUNSa1lYbGZabkp2YlNBOUlIUm9hWE11WHlSblpYUkVZWGxDZVVSaGRHVW9aR0YwWlY5bWNtOXRLVHRjY2x4dUlDQWdJR052Ym5OMElDUmtZWGxmZEc4Z1BTQjBhR2x6TGw4a1oyVjBSR0Y1UW5sRVlYUmxLR1JoZEdWZmRHOHBPMXh5WEc1Y2NseHVJQ0FnSUM4dklOQzYwTFhSaUNEUXROQzcwWThnMExIUmk5R0IwWUxSZ05DKzBMUFF2aURSZ2RDeDBZRFF2dEdCMExBZzBZSFJndEN3MFlEUXZ0Q3owTDRnMExMUmk5QzAwTFhRdTlDMTBMM1F1TkdQWEhKY2JpQWdJQ0JwWmlBb2RHaHBjeTVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1F1SkdSaGVWOW1jbTl0WDI5c1pDQW1KaUIwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDNGtaR0Y1WDJaeWIyMWZiMnhrSUNFOUlDUmtZWGxmWm5KdmJTa2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBMaVJrWVhsZlpuSnZiVjl2YkdRdVkyeGhjM05NYVhOMExuSmxiVzkyWlNnbmFYTXRjMlZzWldOMFpXUW5MQ0FuYVhNdGMyVnNaV04wWldRdFpuSnZiU2NwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkM2MExYUmlDRFF0TkM3MFk4ZzBMSFJpOUdCMFlMUmdOQyswTFBRdmlEUmdkQ3gwWURRdnRHQjBMQWcwWUhSZ3RDdzBZRFF2dEN6MEw0ZzBMTFJpOUMwMExYUXU5QzEwTDNRdU5HUFhISmNiaUFnSUNCcFppQW9kR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFRaV3hsWTNRdUpHUmhlVjkwYjE5dmJHUWdKaVlnZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUXVKR1JoZVY5MGIxOXZiR1FnSVQwZ0pHUmhlVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzSmhibWRsVm1semRXRnNVMlZzWldOMExpUmtZWGxmZEc5ZmIyeGtMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMmx6TFhObGJHVmpkR1ZrSnl3Z0oybHpMWE5sYkdWamRHVmtMWFJ2SnlrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdhV1lnS0NSa1lYbGZabkp2YlNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ1JrWVhsZlpuSnZiUzVqYkdGemMweHBjM1F1WVdSa0tDZHBjeTF6Wld4bFkzUmxaQ2NzSUNkcGN5MXpaV3hsWTNSbFpDMW1jbTl0SnlrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdhV1lnS0NSa1lYbGZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQWtaR0Y1WDNSdkxtTnNZWE56VEdsemRDNWhaR1FvSjJsekxYTmxiR1ZqZEdWa0p5d2dKMmx6TFhObGJHVmpkR1ZrTFhSdkp5azdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBZSFF2dEdGMFlEUXNOQzkwTFhRdmRDNDBMVWcwTElnMExyUXRkR0lYSEpjYmlBZ0lDQjBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGTmxiR1ZqZEM0a1pHRjVYMlp5YjIxZmIyeGtJRDBnSkdSaGVWOW1jbTl0TzF4eVhHNGdJQ0FnZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUXVKR1JoZVY5MGIxOXZiR1FnUFNBa1pHRjVYM1J2TzF4eVhHNWNjbHh1SUNBZ0lIUm9hWE11WDNObGJHVmpkR2x2Ymk0a1pHRjVYMlp5YjIwZ1BTQWtaR0Y1WDJaeWIyMDdYSEpjYmlBZ0lDQjBhR2x6TGw5elpXeGxZM1JwYjI0dUpHUmhlVjkwYnlBOUlDUmtZWGxmZEc4N1hISmNibHh5WEc0Z0lDQWdhV1lnS0NSa1lYbGZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCa1lYbHpJRDBnVFdGMGFDNW1iRzl2Y2loTllYUm9MbUZpY3loMGFXMWxYMlp5YjIwZ0xTQjBhVzFsWDNSdktTQXZJRGcyTkRBd1pUTXBJQ3NnTVR0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw5MGIyOXNkR2x3VTJodmR5Z2taR0Y1WDNSdkxDQmtZWGx6S1R0Y2NseHVJQ0FnSUgxY2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNmMEw3UXV0Q3cwTGNnMEwvUXZ0QzAwWUhRdXRDdzBMZlF1dEM0WEhKY2JpQXFJRUJ3WVhKaGJTQjdSV3hsYldWdWRIMGdKR1JoZVNEUWt0R0wwTEhSZ05DdzBMM1F2ZEdMMExrZzBMVFF0ZEM5MFl4Y2NseHVJQ29nUUhCaGNtRnRJSHRPZFcxaVpYSjlJQ0JrWVhseklOQ2EwTDdRdTlDNDBZZlF0ZEdCMFlMUXN0QytJTkMwMEwzUXRkQzVYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDkwYjI5c2RHbHdVMmh2ZHlBOUlHWjFibU4wYVc5dUtDUmtZWGtzSUdSaGVYTXBJSHRjY2x4dUlDQWdJSFJvYVhNdVh5UjBiMjlzZEdsd0xuUmxlSFJEYjI1MFpXNTBJRDBnZEdocGN5NXZjSFJwYjI1ekxtWnBiSFJsY2k1MGIyOXNkR2x3VkdWNGRDNWpZV3hzS0hSb2FYTXNJR1JoZVhNcElIeDhJQ2NuTzF4eVhHNGdJQ0FnZEdocGN5NWZKSFJ2YjJ4MGFYQXVZMnhoYzNOTWFYTjBMblJ2WjJkc1pTZ25hWE10YzJodmR5Y3NJSFJvYVhNdVh5UjBiMjlzZEdsd0xuUmxlSFJEYjI1MFpXNTBMbXhsYm1kMGFDazdYSEpjYmlBZ0lDQjBhR2x6TGw5MGIyOXNkR2x3VlhCa1lYUmxLQ1JrWVhrcE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEo3UXNkQzkwTDdRc3RDNzBMWFF2ZEM0MExVZzBML1F2dEMzMExqUmh0QzQwTGdnMEwvUXZ0QzAwWUhRdXRDdzBMZlF1dEM0WEhKY2JpQXFJRUJ3WVhKaGJTQjdSV3hsYldWdWRIMGdKR1JoZVNEUWt0R0wwTEhSZ05DdzBMM1F2ZEdMMExrZzBMVFF0ZEM5MFl4Y2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgzUnZiMngwYVhCVmNHUmhkR1VnUFNCbWRXNWpkR2x2Ymlna1pHRjVLU0I3WEhKY2JpQWdJQ0JqYjI1emRDQnlaV04wSUQwZ0pHUmhlUzVuWlhSQ2IzVnVaR2x1WjBOc2FXVnVkRkpsWTNRb0tUdGNjbHh1SUNBZ0lIUm9hWE11WHlSMGIyOXNkR2x3TG5OMGVXeGxMblJ2Y0NBOUlFMWhkR2d1Y205MWJtUW9jbVZqZEM1MGIzQWdLeUIzYVc1a2IzY3VjMk55YjJ4c1dTQXRJSEpsWTNRdWFHVnBaMmgwSUMwZ2RHaHBjeTVmSkhSdmIyeDBhWEF1YjJabWMyVjBTR1ZwWjJoMEtTQXJJQ2R3ZUNjN1hISmNiaUFnSUNCMGFHbHpMbDhrZEc5dmJIUnBjQzV6ZEhsc1pTNXNaV1owSUQwZ1RXRjBhQzV5YjNWdVpDaHlaV04wTG14bFpuUWdLeUIzYVc1a2IzY3VjMk55YjJ4c1dDQXJJSEpsWTNRdWQybGtkR2dnTHlBeUlDMGdkR2hwY3k1ZkpIUnZiMngwYVhBdWIyWm1jMlYwVjJsa2RHZ2dMeUF5S1NBcklDZHdlQ2M3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvZEM2MFlEUmk5R0MwWXdnMEwvUXZ0QzAwWUhRdXRDdzBMZlF1dEdEWEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw5MGIyOXNkR2x3U0dsa1pTQTlJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnZEdocGN5NWZKSFJ2YjJ4MGFYQXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25hWE10YzJodmR5Y3BPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLTFF0ZEM2MFlIUmdpRFF2OUMrMExUUmdkQzYwTERRdDlDNjBMZ2cwTC9RdmlEUmc5QzgwTDdRdTlHSDBMRFF2ZEM0MFk1Y2NseHVJQ29nUUhCaGNtRnRJQ0I3VG5WdFltVnlmU0JrWVhseklOQ2EwTDdRdTlDNDBZZlF0ZEdCMFlMUXN0QytJTkMwMEwzUXRkQzVYSEpjYmlBcUlFQnlaWFIxY200Z2UxTjBjbWx1WjMxY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgyWnBiSFJsY2xSdmIyeDBhWEJVWlhoMElEMGdablZ1WTNScGIyNG9aR0Y1Y3lrZ2UxeHlYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVjR3gxY21Gc0tHUmhlWE1zSUZzbkpXUWcwTFRRdGRDOTBZd25MQ0FuSldRZzBMVFF2ZEdQSnl3Z0p5VmtJTkMwMEwzUXRkQzVKMTBwTG5KbGNHeGhZMlVvSnlWa0p5d2daR0Y1Y3lrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRcE5DNDBMdlJqTkdDMFlBZzBMM1F0ZEMwMEw3UmdkR0MwWVBRdjlDOTBZdlJoU0RRdE5DOTBMWFF1U0RRdjlDK0lOR0QwTHpRdnRDNzBZZlFzTkM5MExqUmpseHlYRzRnS2lCQWNtVjBkWEp1SUh0Q2IyOXNaV0Z1ZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZlptbHNkR1Z5VEc5amEwUmhlWE1nUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lDOHZJTkN5MFlIUXRTRFF0TkM5MExnZzBMVFF2dEdCMFlMUmc5Qy8wTDNSaTF4eVhHNGdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtIUXZ0Q3gwWXZSZ3RDNDBMVWcwTGpRdDlDODBMWFF2ZEMxMEwzUXVOR1BJTkdBMExEUXQ5QzgwTFhSZ05DKzBMSWcwTDdRdXRDOTBMQmNjbHh1SUNvZ1FIQmhjbUZ0SUh0RmRtVnVkSDBnWlNCRVQwMGcwWUhRdnRDeDBZdlJndEM0MExWY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgyOXVWMmx1Wkc5M1VtVnphWHBsUlhabGJuUWdQU0JtZFc1amRHbHZiaWhsS1NCN1hISmNiaUFnSUNCcFppQW9kR2hwY3k1ZmMyVnNaV04wYVc5dUxpUmtZWGxmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOTBiMjlzZEdsd1ZYQmtZWFJsS0hSb2FYTXVYM05sYkdWamRHbHZiaTRrWkdGNVgzUnZLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCc1pYUWdZbkpsWVd0d2IybHVkQ0E5SURBN1hISmNiaUFnSUNCamIyNXpkQ0JpY21WaGEzQnZhVzUwY3lBOUlFOWlhbVZqZEM1clpYbHpLSFJvYVhNdWIzQjBhVzl1Y3k1aWNtVmhhM0J2YVc1MGN5a3VjMjl5ZENnb1lTd2dZaWtnUFQ0Z1lTQXRJR0lwTzF4eVhHNGdJQ0FnWm05eUlDaHNaWFFnYVNCcGJpQmljbVZoYTNCdmFXNTBjeWtnZTF4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2gzYVc1a2IzY3VhVzV1WlhKWGFXUjBhQ0E4UFNCaWNtVmhhM0J2YVc1MGMxdHBYU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JpY21WaGEzQnZhVzUwSUQwZ1luSmxZV3R3YjJsdWRITmJhVjA3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR0p5WldGck8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCMGFHbHpMbDl6WlhSQ2NtVmhhM0J2YVc1MEtHSnlaV0ZyY0c5cGJuUXBPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLUFJnZEdDMExEUXZkQyswTExRdXRDd0lOR0IwTDdSZ2RHQzBMN1JqOUM5MExqUmp5RFJnTkMxMEwzUXROQzEwWURRc0NEUXY5QyswTFFnMFlEUXNOQzMwTDNSaTlDMUlOR04wTHJSZ05DdzBMM1JpMXh5WEc0Z0tpQkFjR0Z5WVcwZ2UwNTFiV0psY24wZ1luSmxZV3R3YjJsdWRDRFFtdEM3MFk3Umh5RFF1TkMzSUhSb2FYTXViM0IwYVc5dWN5NWljbVZoYTNCdmFXNTBjeUFvMEtqUXVOR0EwTGpRdmRDd0lOR04wTHJSZ05DdzBMM1FzQ2xjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDNObGRFSnlaV0ZyY0c5cGJuUWdQU0JtZFc1amRHbHZiaWhpY21WaGEzQnZhVzUwS1NCN1hISmNiaUFnSUNBdkx5RFF2dEdDSU5DOTBMWFF2ZEdEMExiUXZkQyswTGtnMEwvUXRkR0EwTFhSZ05DNDBZSFF2dEN5MExyUXVGeHlYRzRnSUNBZ2FXWWdLSFJvYVhNdVgySnlaV0ZyY0c5cGJuUWdQVDBnWW5KbFlXdHdiMmx1ZENrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJqdGNjbHh1SUNBZ0lIMWNjbHh1SUNBZ0lIUm9hWE11WDJKeVpXRnJjRzlwYm5RZ1BTQmljbVZoYTNCdmFXNTBPMXh5WEc1Y2NseHVJQ0FnSUdsbUlDZ2hkR2hwY3k1dmNIUnBiMjV6TG1KeVpXRnJjRzlwYm5SelcySnlaV0ZyY0c5cGJuUmRLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lFOWlhbVZqZEM1aGMzTnBaMjRvZEdocGN5NXZjSFJwYjI1ekxDQjBhR2x6TG05d2RHbHZibk11WW5KbFlXdHdiMmx1ZEhOYlluSmxZV3R3YjJsdWRGMHBPMXh5WEc0Z0lDQWdkR2hwY3k1ZkpHTnlaV0YwWlUxdmJuUm9jeWgwYUdsekxsOXpaV3hsWTNSbFpFUmhkR1VwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSzNRdTlDMTBMelF0ZEM5MFlJZzBMclFzTkM3MExYUXZkQzAwTERSZ05DOTBMN1FzOUMrSU5DMDBMM1JqMXh5WEc0Z0tpQkFjR0Z5WVcwZ0lIdEVZWFJsZlNCa1lYUmxJTkNVMExEUmd0Q3dYSEpjYmlBcUlFQnlaWFIxY200Z2UwVnNaVzFsYm5SOUlDQWdTRlJOVENEUmpkQzcwTFhRdk5DMTBMM1JnbHh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmSkdkbGRFUmhlVUo1UkdGMFpTQTlJR1oxYm1OMGFXOXVLR1JoZEdVcElIdGNjbHh1SUNBZ0lHTnZibk4wSUhScGJXVWdQU0JrWVhSbElHbHVjM1JoYm1ObGIyWWdSR0YwWlNBL0lHUmhkR1V1WjJWMFZHbHRaU2dwSURvZ01EdGNjbHh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbDhrYlc5dWRHaHpMbkYxWlhKNVUyVnNaV04wYjNJb0p5NUVZWGxiWkdGMFlTMTBhVzFsUFZ3aUp5QXJJSFJwYldVZ0t5QW5YQ0pkSnlrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRb05DMTBMM1F0TkMxMFlBZzBMVFF2ZEdQSUMwZzBMZlFzTkN6MEx2Umc5R0kwTHJRdUZ4eVhHNGdLaUJBY21WMGRYSnVJSHRGYkdWdFpXNTBmVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmSkdOeVpXRjBaVVZ0Y0hSNVJHRjVJRDBnWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCamIyNXpkQ0FrWkdGNUlEMGdkR2hwY3k1ZkpHTnlaV0YwWlVWc1pXMWxiblFvWEhKY2JpQWdJQ0FnSUNBZ1lEeGthWFlnWTJ4aGMzTTlYQ0pFWVhrZ2FYTXRaVzF3ZEhsY0lqNDhMMlJwZGo1Z1hISmNiaUFnSUNBcE8xeHlYRzVjY2x4dUlDQWdJSEpsZEhWeWJpQWtaR0Y1TzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwS0hRdnRDMzBMVFFzTkM5MExqUXRTRFJqZEM3MExYUXZOQzEwTDNSZ3RDd0lOQzQwTGNnU0ZSTlRDRFJndEMxMExyUmdkR0MwTEJjY2x4dUlDb2dRSEJoY21GdElDQjdVM1J5YVc1bmZTQm9kRzFzSUVoVVRVd2cwWUxRdGRDNjBZSFJnbHh5WEc0Z0tpQkFjbVYwZFhKdUlIdEZiR1Z0Wlc1MGZWeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZKR055WldGMFpVVnNaVzFsYm5RZ1BTQm1kVzVqZEdsdmJpaG9kRzFzS1NCN1hISmNiaUFnSUNCamIyNXpkQ0JrYVhZZ1BTQmtiMk4xYldWdWRDNWpjbVZoZEdWRmJHVnRaVzUwS0Nka2FYWW5LVHRjY2x4dUlDQWdJR1JwZGk1cGJuTmxjblJCWkdwaFkyVnVkRWhVVFV3b0oyRm1kR1Z5WW1WbmFXNG5MQ0JvZEcxc0tUdGNjbHh1SUNBZ0lISmxkSFZ5YmlCa2FYWXVZMmhwYkdSeVpXNHViR1Z1WjNSb0lENGdNU0EvSUdScGRpNWphR2xzWkhKbGJpQTZJR1JwZGk1bWFYSnpkRVZzWlcxbGJuUkRhR2xzWkR0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJRk5oWm1VZzBMTFJpOUMzMEw3UXNpRFFzdEM5MExYUmlOQzkwTGpSaFNEUmdkQyswTEhSaTlHQzBMalF1U0RRdXRDKzBMelF2OUMrMEwzUXRkQzkwWUxRc0Z4eVhHNGdLaUJBY0dGeVlXMGdlMU4wY21sdVozMGdaaURRbU5DODBZOGcwWUhRdnRDeDBZdlJndEM0MFk5Y2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgyTmhiR3hpWVdOcklEMGdablZ1WTNScGIyNG9aaWtnZTF4eVhHNGdJQ0FnYVdZZ0tIUjVjR1Z2WmlCMGFHbHpMbTl3ZEdsdmJuTXViMjViWmwwZ1BUMGdKMloxYm1OMGFXOXVKeWtnZTF4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbTl3ZEdsdmJuTXViMjViWmwwdVlYQndiSGtvZEdocGN5d2dXMTB1YzJ4cFkyVXVZMkZzYkNoaGNtZDFiV1Z1ZEhNc0lERXBLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCeVpYUjFjbTQ3WEhKY2JuMWNjbHh1WEhKY2JtVjRjRzl5ZENCa1pXWmhkV3gwSUVSaGRHVlNZVzVuWlZCcFkydGxjanRjY2x4dUlsMHNJbk52ZFhKalpWSnZiM1FpT2lJaWZRPT0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IERhdGVSYW5nZVBpY2tlciwge0xPQ0tfVU5BVkFJTEFCTEUsIExPQ0tfTE9DS0VEfSBmcm9tICcuLi8uLi9kaXN0L2RhdGVyYW5nZXBpY2tlcic7XHJcblxyXG5jb25zdCAkZm9ybSA9IGRvY3VtZW50LmZvcm1zWzBdO1xyXG5jb25zdCAkZGF0ZV9mcm9tID0gJGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9XCJkYXRlX2Zyb21cIl0nKTtcclxuY29uc3QgJGRhdGVfdG8gICA9ICRmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZGF0ZV90b1wiXScpO1xyXG5cclxuLy8g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9C1INC00LDRgtGLXHJcbmNvbnN0IGJsb2NrZWREYXRlcyA9IHt9O1xyXG5jb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgKytpKSB7XHJcbiAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNikge1xyXG4gICAgICAgIGJsb2NrZWREYXRlc1tkYXRlXSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyAxKTtcclxufVxyXG5cclxubmV3IERhdGVSYW5nZVBpY2tlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGF0ZXJhbmdlcGlja2VyJyksIHtcclxuICAgIG1pbkRhdGU6IG5ldyBEYXRlKCksXHJcbiAgICBtYXhEYXRlOiBuZXcgRGF0ZSgnMjAyMi0wNS0yMCcpLFxyXG4gICAgbW9udGhzQ291bnQ6IDIsXHJcbiAgICBwZXJSb3c6IDMsXHJcbiAgICBzaW5nbGVNb2RlOiBmYWxzZSxcclxuICAgIGJyZWFrcG9pbnRzOiB7XHJcbiAgICAgICAgOTYwOiB7XHJcbiAgICAgICAgICAgIG1vbnRoc0NvdW50OiAxMixcclxuICAgICAgICB9LFxyXG4gICAgICAgIDcyMDoge1xyXG4gICAgICAgICAgICBtb250aHNDb3VudDogMyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIDQ4MDoge1xyXG4gICAgICAgICAgICBtb250aHNDb3VudDogMSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIG9uOiB7XHJcbiAgICAgICAgcmFuZ2VTZWxlY3Q6IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgICAgICAkZGF0ZV9mcm9tLnZhbHVlID0gZGF0ZV9mcm9tLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICAgICAgICAkZGF0ZV90by52YWx1ZSA9IGRhdGVfdG8udG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXlTZWxlY3Q6IGZ1bmN0aW9uKGRhdGVfZnJvbSkge1xyXG4gICAgICAgICAgICAkZGF0ZV9mcm9tLnZhbHVlID0gZGF0ZV9mcm9tLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyOiB7XHJcbiAgICAgICAgbG9ja0RheXM6IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICAgICAgaWYgKGJsb2NrZWREYXRlc1tkYXRlXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIExPQ0tfTE9DS0VEO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0b29sdGlwVGV4dDogZnVuY3Rpb24oZGF5cykge1xyXG4gICAgICAgICAgICBjb25zdCBuaWdodHMgPSBkYXlzIC0gMTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGx1cmFsKG5pZ2h0cywgWyclZCDQvdC+0YfRjCcsICclZCDQvdC+0YfQuCcsICclZCDQvdC+0YfQtdC5J10pLnJlcGxhY2UoJyVkJywgbmlnaHRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9