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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9zY3NzL2luZGV4LnNjc3M/NTYxOCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9zcmMvanMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87O1VDVkE7VUFDQTs7Ozs7V0NEQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7OztBQ05BOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNPO0FBQ0E7O0FBRVAsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLGtCQUFrQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsc0JBQXNCO0FBQy9COztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxRUFBcUU7O0FBRXJFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxLQUFLO0FBQ2pCLFlBQVk7QUFDWjtBQUNBO0FBQ0EsZ0RBQWdELGNBQWM7QUFDOUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxLQUFLO0FBQ2pCLFlBQVksT0FBTztBQUNuQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLE9BQU87QUFDMUI7QUFDQTtBQUNBO0FBQ0EsaURBQWlELGlCQUFpQjtBQUNsRSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQixZQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxLQUFLO0FBQ2hCLFdBQVcsS0FBSztBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLEtBQUs7QUFDakIsWUFBWSxPQUFPO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVk7QUFDWixZQUFZO0FBQ1osWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQixZQUFZLFFBQVE7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZLE1BQU07QUFDbEIsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLEtBQUs7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQiw4QkFBOEI7QUFDakQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLG9CQUFvQjtBQUN2QztBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsS0FBSztBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUNBQXlDLGVBQWU7QUFDeEQ7QUFDQSw2REFBNkQsNkVBQTZFO0FBQzFJO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDLFdBQVcsR0FBRyxtQkFBbUI7QUFDN0UsNkRBQTZELDZFQUE2RTtBQUMxSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDLHNEQUFzRCxXQUFXO0FBQ2pFLGFBQWEsV0FBVztBQUN4QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVMsOENBQThDO0FBQ3ZELFNBQVMsOENBQThDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLEtBQUs7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxLQUFLO0FBQ2pCLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksS0FBSztBQUNqQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLGVBQWUsY0FBYyxjQUFjLElBQUksZUFBZTtBQUNyRzs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLEtBQUs7QUFDaEIsV0FBVyxLQUFLO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixrQkFBa0I7QUFDckM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLEtBQUs7QUFDakIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLGVBQWUsRUFBQyIsImZpbGUiOiJkYXRlcmFuZ2VwaWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkRhdGVyYW5nZXBpY2tlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyDRgdC+0YHRgtC+0Y/QvdC40Y8g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9GFINC00LDRglxyXG5leHBvcnQgY29uc3QgTE9DS19VTkFWQUlMQUJMRSA9IDE7XHJcbmV4cG9ydCBjb25zdCBMT0NLX0xPQ0tFRCAgICAgID0gMjtcclxuXHJcbmZ1bmN0aW9uIERhdGVSYW5nZVBpY2tlcigkY29udGFpbmVyLCBvcHRpb25zID0ge30pIHtcclxuICAgIC8vINC+0YIg0L/QvtCy0YLQvtGA0L3QvtC5INC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4XHJcbiAgICBpZiAoJGNvbnRhaW5lci5pbnN0YW5jZSkge1xyXG4gICAgICAgIHJldHVybiAkY29udGFpbmVyLmluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgJGNvbnRhaW5lci5pbnN0YW5jZSA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5fJGNvbnRhaW5lciA9ICRjb250YWluZXI7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgIGZpcnN0RGF5T2ZUaGVXZWVrOiBvcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrIHx8IDEsICAgICAgICAgIC8vINC/0LXRgNCy0YvQuSDQtNC10L3RjCDQvdC10LTQtdC70LgsIDAgPSDQstGBLCAxID0g0L/QvSwgLi4uXHJcbiAgICAgICAgc2luZ2xlTW9kZTogICAgICAgIG9wdGlvbnMuc2luZ2xlTW9kZSAgICAgICAgfHwgZmFsc2UsICAgICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLINCy0LzQtdGB0YLQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBsb2NhbGU6ICAgICAgICAgICAgb3B0aW9ucy5sb2NhbGUgICAgICAgICAgICB8fCAncnUtUlUnLFxyXG4gICAgICAgIG1pbkRheXM6ICAgICAgICAgICBvcHRpb25zLm1pbkRheXMgICAgICAgICAgIHx8IDEsICAgICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LTQuNCw0L/QsNC30L7QvdC1XHJcbiAgICAgICAgbW9udGhzQ291bnQ6ICAgICAgIG9wdGlvbnMubW9udGhzQ291bnQgICAgICAgfHwgMTIsXHJcbiAgICAgICAgcGVyUm93OiAgICAgICAgICAgIG9wdGlvbnMucGVyUm93ICAgICAgICAgICAgfHwgdW5kZWZpbmVkLCAgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LzQtdGB0Y/RhtC10LIg0LIg0YDRj9C00YNcclxuICAgICAgICBtaW5EYXRlOiAgICAgICAgICAgb3B0aW9ucy5taW5EYXRlICAgICAgICAgICB8fCBuZXcgRGF0ZSgpLCAvLyDQvNC40L3QuNC80LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgICAgbWF4RGF0ZTogICAgICAgICAgIG9wdGlvbnMubWF4RGF0ZSAgICAgICAgICAgfHwgdW5kZWZpbmVkLFxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiAgICAgICBvcHRpb25zLmJyZWFrcG9pbnRzICAgICAgIHx8IHt9LFxyXG4gICAgICAgIGludGVybmFsSW5wdXRzOiAgICBvcHRpb25zLmludGVybmFsSW5wdXRzICAgIHx8IHRydWUsICAgICAgIC8vINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1INCy0YHRgtGA0L7QtdC90L3Ri9GFINC40L3Qv9GD0YLQvtCyXHJcbiAgICAgICAgLy8g0YHQvtCx0YvRgtC40Y9cclxuICAgICAgICBvbjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIHJhbmdlU2VsZWN0OiBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICAgICAgICBkYXlTZWxlY3Q6ICAgbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC+0LTQvdC+0Lkg0LTQsNGC0YsgKNGC0L7Qu9GM0LrQviDQv9GA0Lggc2luZ2xlTW9kZTogdHJ1ZSlcclxuICAgICAgICB9LCBvcHRpb25zLm9uIHx8IHt9KSxcclxuICAgICAgICAvLyDRhNC40LvRjNGC0YDRg9GO0YnQuNC1INC80LXRgtC+0LTRi1xyXG4gICAgICAgIGZpbHRlcjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIGxvY2tEYXlzOiAgICB0aGlzLl9maWx0ZXJMb2NrRGF5cywgICAgLy8gY2FsbGJhY2soZGF0ZSkg0YTRg9C90LrRhtC40Y8g0LHQu9C+0LrQuNGA0L7QstCw0L3QuNGPINC00LDRgiwgdHJ1ZS9MT0NLXHJcbiAgICAgICAgICAgIHRvb2x0aXBUZXh0OiB0aGlzLl9maWx0ZXJUb29sdGlwVGV4dCwgLy8gY2FsbGJhY2soZGF5cykg0LLRi9Cy0L7QtCDRgtC10LrRgdGC0LAg0L/QvtC00YHQutCw0LfQutC4XHJcbiAgICAgICAgfSwgb3B0aW9ucy5maWx0ZXIgfHwge30pLFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0YDRj9C00L3QvtGB0YLRjFxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGVyUm93ID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnBlclJvdyA9IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMubWluRGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtC/0YbQuNC4INC00LvRjyDRjdC60YDQsNC90L7QsiDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW3RoaXMuX2JyZWFrcG9pbnQgPSAwXSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyk7XHJcblxyXG4gICAgLy8g0YLQtdC60YPRidC40Lkg0LTQtdC90YxcclxuICAgIHRoaXMuX3RvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIHRoaXMuX3RvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIHRoaXMuXyRwaWNrZXIgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlclwiPlxyXG4gICAgICAgICAgICAke3RoaXMub3B0aW9ucy5pbnRlcm5hbElucHV0cyA/XHJcbiAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9faW5wdXRzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV9mcm9tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV90b1wiPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+YCA6ICcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXBcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGN0LvQtdC80LXQvdGC0YtcclxuICAgIHRoaXMuXyRtb250aHMgID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX19tb250aHMnKTtcclxuICAgIHRoaXMuXyR0b29sdGlwID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX190b29sdGlwJyk7XHJcblxyXG4gICAgLy8g0L/QvtC70Y8g0LLQstC+0LTQsFxyXG4gICAgdGhpcy5fJGlucHV0RnJvbSA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignW25hbWU9XCJkYXRlX2Zyb21cIl0nKTtcclxuICAgIHRoaXMuXyRpbnB1dFRvICAgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZGF0ZV90b1wiXScpO1xyXG5cclxuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKHRoaXMub3B0aW9ucy5taW5EYXRlKTtcclxuICAgIHRoaXMuXyRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fJHBpY2tlcik7XHJcblxyXG4gICAgLy8g0L7QsdGA0LDQsdC+0YLQutCwINCx0YDQtdC50LrQv9C+0LjQvdGC0L7QslxyXG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykubGVuZ3RoKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uV2luZG93UmVzaXplRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5fb25XaW5kb3dSZXNpemVFdmVudCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0J3QsNC30LLQsNC90LjQtSDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRNb250aEZvcm1hdHRlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7bW9udGg6ICdsb25nJ30pO1xyXG4gICAgcmV0dXJuIHRpdGxlLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aXRsZS5zbGljZSgxKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0Ysg0LTQu9GPINGC0LXQutGD0YnQtdC5INC70L7QutCw0LvQuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyDQn9Cw0YDQsNC80LXRgtGA0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlVGltZUZvcm1hdCA9IGZ1bmN0aW9uKGRhdGUsIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMub3B0aW9ucy5sb2NhbGUsIG9wdGlvbnMpLmZvcm1hdChkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCU0L3QuCDQvdC10LTQtdC70LhcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0V2Vla0RheXNGb3JtYXR0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gMik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7ICsraSkge1xyXG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgZGF5OiBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7d2Vla2RheTogJ3Nob3J0J30pLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINGB0L7Qs9C70LDRgdC90L4g0L3QsNGB0YLRgNC+0LXQvdC90L7QvNGDINC/0LXRgNCy0L7QvNGDINC00L3RjiDQvdC10LTQtdC70LhcclxuICAgIHJlc3VsdC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmlyc3REYXlPZlRoZVdlZWsgPSB0aGlzLm9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgJSA3O1xyXG4gICAgICAgIGxldCBkYXlBID0gYS5kYXk7XHJcbiAgICAgICAgbGV0IGRheUIgPSBiLmRheTtcclxuXHJcbiAgICAgICAgaWYgKGRheUEgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUIgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QSA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIGRheUEgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlCIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgZGF5QiArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRheUEgLSBkYXlCO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC80LXRgdGP0YbQtVxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9ICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERheXNDb3VudEluTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRheXMuc2V0TW9udGgoZGF5cy5nZXRNb250aCgpICsgMSk7XHJcbiAgICBkYXlzLnNldERhdGUoMCk7XHJcbiAgICByZXR1cm4gZGF5cy5nZXREYXRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFJlc2V0KCk7XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24gPSB7fTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQtNC10LvQtdC90LjQtSDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnJhbmdlU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZShkYXRlX2Zyb20sIGRhdGVfdG8pKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0ICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcblxyXG4gICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LIg0L7QsdGA0LDRgtC90L7QvCDQv9C+0YDRj9C00LrQtVxyXG4gICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC+0LHQvdC+0LLQu9C10L3QuNC1INC40L3Qv9GD0YLQvtCyXHJcbiAgICBpZiAodGhpcy5fJGlucHV0RnJvbSkge1xyXG4gICAgICAgIHRoaXMuXyRpbnB1dEZyb20udmFsdWUgPSB0aGlzLmZvcm1hdERhdGUoZGF0ZV9mcm9tKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fJGlucHV0VG8pIHtcclxuICAgICAgICB0aGlzLl8kaW5wdXRUby52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0LHRi9GC0LjQtVxyXG4gICAgdGhpcy5fY2FsbGJhY2soJ3JhbmdlU2VsZWN0JywgZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0YtcclxuICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge1N0cmluZ30gZm9ybWF0INCk0L7RgNC80LDRgiDRgdGC0YDQvtC60LhcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSwgZm9ybWF0ID0gJ1ktbS1kJykge1xyXG4gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlKCdZJywgZGF0ZS5nZXRGdWxsWWVhcigpKVxyXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdtJywgKCcwJyArIChkYXRlLmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpKVxyXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdkJywgKCcwJyArIChkYXRlLmdldERhdGUoKSkpLnNsaWNlKC0yKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0L7QstC10YDQutCwINCy0L7Qt9C80L7QttC90L7RgdGC0Lgg0LLRi9C00LXQu9C10L3QuNGPINC00LDRglxyXG4gKiBAcGFyYW0gIHtEYXRlIGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtICB7RGF0ZSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRJc1JhbmdlU2VsZWN0YWJsZSA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoZGF0ZV9mcm9tLmdldFRpbWUoKSAtIGRhdGVfdG8uZ2V0VGltZSgpKSAvIDEwMDAgLyA4NjQwMDtcclxuICAgIGlmIChkaWZmIDwgdGhpcy5vcHRpb25zLm1pbkRheXMpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQv9C+0L/QsNC00LDQvdC40Y8g0LIg0LTQuNCw0L/QsNC30L7QvSDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbiAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgZGF5LnNldFRpbWUoZGF0ZV9mcm9tLmdldFRpbWUoKSk7XHJcblxyXG4gICAgd2hpbGUgKGRheSA8IGRhdGVfdG8pIHtcclxuICAgICAgICBpZiAodGhpcy5nZXREYXlMb2NrZWQoZGF5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkYXkuc2V0RGF0ZShkYXkuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0L7QstC10YDQutCwINC90LAg0LTQvtGB0YLRg9C/0L3QvtGB0YLRjCDQtNC90Y8g0LTQu9GPINCx0YDQvtC90LhcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgIHRydWUg0LXRgdC70Lgg0LTQvtGB0YLRg9C/0LXQvVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXlMb2NrZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQstC90LUg0LTQvtGB0YLRg9C/0L3QvtCz0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlIHx8IGRhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBMT0NLX1VOQVZBSUxBQkxFO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmlsdGVyLmxvY2tEYXlzLmNhbGwodGhpcywgZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60LvQvtC90LXQvdC40LUgKDEg0LHQvtCx0ZHRgCwgMiDQsdC+0LHRgNCwLCA1INCx0L7QsdGA0L7QsilcclxuICogQHBhcmFtICB7TnVtYmVyfSB2YWx1ZSDQmtC+0LvQuNGH0LXRgdGC0LLQvlxyXG4gKiBAcGFyYW0gIHtBcnJheX0gIGZvcm1zINCc0LDRgdGB0LjQsiDQuNC3IDPRhSDRjdC70LXQvNC10L3RgtC+0LIsINC80L7QttC10YIg0YHQvtC00LXRgNC20LDRgtGMINGB0L/QtdGG0LjRhNC40LrQsNGC0L7RgCAlZCDQtNC70Y8g0LfQsNC80LXQvdGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucGx1cmFsID0gZnVuY3Rpb24gKHZhbHVlLCBmb3Jtcykge1xyXG4gICAgcmV0dXJuICh2YWx1ZSAlIDEwID09IDEgJiYgdmFsdWUgJSAxMDAgIT0gMTEgPyBmb3Jtc1swXSA6ICh2YWx1ZSAlIDEwID49IDIgJiYgdmFsdWUgJSAxMCA8PSA0ICYmICh2YWx1ZSAlIDEwMCA8IDEwIHx8IHZhbHVlICUgMTAwID49IDIwKSA/IGZvcm1zWzFdIDogZm9ybXNbMl0pKS5yZXBsYWNlKCclZCcsIHZhbHVlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC40LDQv9Cw0LfQvtC90LAg0LzQtdGB0Y/RhtC10LJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlTW9udGhzID0gZnVuY3Rpb24oZGF0ZV9mcm9tKSB7XHJcbiAgICB3aGlsZSAodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5yZW1vdmVDaGlsZCh0aGlzLl8kbW9udGhzLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgIHRoaXMuX3Rvb2x0aXBIaWRlKCk7XHJcblxyXG4gICAgLy8g0L/RgNC10YDQtdC90LTQtdGAINC80LXRgdGP0YbQtdCyXHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG4gICAgY29uc3QgJG1vbnRocyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7ICsraSkge1xyXG4gICAgICAgICRtb250aHMucHVzaCh0aGlzLl8kY3JlYXRlTW9udGgoY3VycmVudERhdGUpKTtcclxuICAgICAgICBjdXJyZW50RGF0ZS5zZXRNb250aChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRtb250aHMubGVuZ3RoOyBpICs9IHRoaXMub3B0aW9ucy5wZXJSb3cpIHtcclxuICAgICAgICBjb25zdCAkcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnRGF0ZXJhbmdlcGlja2VyX19yb3cnO1xyXG5cclxuICAgICAgICAkbW9udGhzLnNsaWNlKGksIGkgKyB0aGlzLm9wdGlvbnMucGVyUm93KS5mb3JFYWNoKCRtb250aCA9PiB7XHJcbiAgICAgICAgICAgICRyb3cuYXBwZW5kQ2hpbGQoJG1vbnRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5hcHBlbmRDaGlsZCgkcm93KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCc0LXRgdGP0YZcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVNb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IG1vbnRoVGl0bGUgPSB0aGlzLmdldE1vbnRoRm9ybWF0dGVkKGRhdGUpO1xyXG4gICAgY29uc3Qgd2Vla0RheXMgPSB0aGlzLmdldFdlZWtEYXlzRm9ybWF0dGVkKCk7XHJcblxyXG4gICAgY29uc3QgJG1vbnRoID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJNb250aFwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9faGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tcHJldiR7KHRoaXMub3B0aW9ucy5taW5EYXRlICYmIGRhdGUgPD0gdGhpcy5vcHRpb25zLm1pbkRhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNyAxM0wxIDdMNyAxXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fdGl0bGVcIj4ke21vbnRoVGl0bGV9ICR7ZGF0ZS5nZXRGdWxsWWVhcigpfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLW5leHQkeyh0aGlzLm9wdGlvbnMubWF4RGF0ZSAmJiBkYXRlID49IHRoaXMub3B0aW9ucy5tYXhEYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEgMC45OTk5OTlMNyA3TDEgMTNcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrXCI+JHt3ZWVrRGF5cy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla2RheVwiPiR7aXRlbS50aXRsZX08L2Rpdj5gXHJcbiAgICAgICAgICAgIH0pLmpvaW4oJycpfTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2RheXNcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGB0YLRgNC10LvQutC4XHJcbiAgICBbXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tcHJldicsIG5hbWU6ICdwcmV2J30sXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tbmV4dCcsIG5hbWU6ICduZXh0J30sXHJcbiAgICBdLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgY29uc3QgJGFycm93ID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoaXRlbS5zZWxlY3Rvcik7XHJcbiAgICAgICAgJGFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX29uQXJyb3dDbGljaygkYXJyb3csIGl0ZW0ubmFtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YAg0LTQvdC10LlcclxuICAgIGNvbnN0ICRkYXlzID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aF9fZGF5cycpO1xyXG4gICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgIGRheXMuc2V0RGF0ZSgxKTtcclxuICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgd2hpbGUgKGRheXMuZ2V0TW9udGgoKSA9PSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVXZWVrKCk7XHJcblxyXG4gICAgICAgIHdlZWtEYXlzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXlzLmdldERheSgpICE9IGl0ZW0uZGF5IHx8IGRheXMuZ2V0TW9udGgoKSAhPSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVFbXB0eURheSgpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZURheShkYXlzKSk7XHJcbiAgICAgICAgICAgIGRheXMuc2V0RGF0ZShkYXlzLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkZGF5cy5hcHBlbmRDaGlsZCgkd2Vlayk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICRtb250aDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0LvQuNC6INC/0L4g0YHRgtGA0LXQu9C60LUg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPINC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRhcnJvdyBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lICAgINCY0LzRjyAocHJldiwgbmV4dClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uQXJyb3dDbGljayA9IGZ1bmN0aW9uKCRhcnJvdywgbmFtZSkge1xyXG4gICAgaWYgKCRhcnJvdy5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLk1vbnRoJykuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyAobmFtZSA9PSAncHJldicgPyAtdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50IDogdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KSk7XHJcblxyXG4gICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LjQvdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1pbkRhdGUuZ2V0VGltZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0YXQvtC0INC30LAg0L/RgNC10LTQtdC70Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICBjb25zdCBlbmREYXRlID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGVuZERhdGUuc2V0TW9udGgoZW5kRGF0ZS5nZXRNb250aCgpICsgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KTtcclxuICAgICAgICBpZiAoZW5kRGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWF4RGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSAtIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCArIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9C10YDQtdGF0L7QtCDQuiDQvdC+0LLQvtC5INC00LDRgtC1XHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGC0LXQutGD0YnQtdC5INC00LDRgtGLINGBINGA0LXQvdC00LXRgNC+0LxcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9zZWxlY3REYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gZGF0ZTtcclxuICAgIHRoaXMuXyRjcmVhdGVNb250aHMoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0L3QtdC00LXQu9C4XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlV2VlayA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJXZWVrXCI+PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gJHdlZWs7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgJGRheSA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5XCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIiBkYXRhLWRheT1cIiR7ZGF0ZS5nZXREYXkoKX1cIj4ke2RhdGUuZ2V0RGF0ZSgpfTwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uRGF5Q2xpY2tFdmVudC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5fb25EYXlNb3VzZUVudGVyRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICB0aGlzLl91cGRhdGVEYXkoJGRheSk7XHJcblxyXG4gICAgcmV0dXJuICRkYXk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5Nb250aCcpLmZvckVhY2goJG1vbnRoID0+IHtcclxuICAgICAgICB0aGlzLl91cGRhdGVNb250aCgkbW9udGgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Lkg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJG1vbnRoINCt0LvQtdC80LXQvdGCINC80LXRgdGP0YbQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdXBkYXRlTW9udGggPSBmdW5jdGlvbigkbW9udGgpIHtcclxuICAgICRtb250aC5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKS5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZURheSgkZGF5KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5INC00L3Rj1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkg0K3Qu9C10LzQtdC90YIg0LTQvdGPXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl91cGRhdGVEYXkgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBjb25zdCBkYXRlICAgPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIGNvbnN0IGxvY2tlZCA9IHRoaXMuZ2V0RGF5TG9ja2VkKGRhdGUpO1xyXG4gICAgY29uc3QgdG9kYXkgID0gdGhpcy5fdG9kYXkuZ2V0VGltZSgpID09IGRhdGUuZ2V0VGltZSgpO1xyXG5cclxuICAgICRkYXkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtZGlzYWJsZWQnLCBsb2NrZWQpO1xyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1sb2NrZWQnLCBsb2NrZWQgPT0gTE9DS19MT0NLRUQpO1xyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy10b2RheScsIHRvZGF5KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INC60LvQuNC60LAg0L/QviDQtNC90Y5cclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5Q2xpY2tFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuX29uRGF5Q2xpY2soZS50YXJnZXQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0YXQvtCy0LXRgNCwXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheU1vdXNlRW50ZXJFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlcihlLnRhcmdldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpdC+0LLQtdGAINC90LAg0Y3Qu9C10LzQtdC90YLQtSDQtNC90Y9cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5TW91c2VFbnRlciA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheS5kYXRhc2V0LnRpbWUgPT0gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbS5nZXRUaW1lKCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC70LjQuiDQv9C+INC00L3RjlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlDbGljayA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIC8vINC00LXQvdGMINC30LDQsdC70L7QutC40YDQvtCy0LDQvVxyXG4gICAgaWYgKCRkYXkuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrKCdkYXlTZWxlY3QnLCBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0LHRgNC+0YEg0LLRi9Cx0YDQsNC90L3QvtCz0L4g0YDQsNC90LXQtSDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG5cclxuICAgIC8vINCy0YvQsdGA0LDQvdCwINC90LDRh9Cw0LvRjNC90LDRjyAvINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJhbmdlU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LjQt9GD0LDQu9GM0L3Ri9C5INGB0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICAkZGF5cy5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgICRkYXkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScsICdpcy1zZWxlY3RlZC10bycsICdpcy1zZWxlY3RlZC1iZXR3ZWVuJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQv9GA0Y/Rh9C10Lwg0L/QvtC00YHQutCw0LfQutGDXHJcbiAgICB0aGlzLl90b29sdGlwSGlkZSgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JLQuNC30YPQsNC70YzQvdC+0LUg0LLRi9C00LXQu9C10L3QuNC1INC00LDRglxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fcmFuZ2VWaXN1YWxTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGlmIChkYXRlX2Zyb20gJiYgZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0ZV90byAmJiBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHRpbWVfZnJvbSA9IGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX2Zyb20uZ2V0VGltZSgpIDogMDtcclxuICAgIGxldCB0aW1lX3RvID0gZGF0ZV90byBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX3RvLmdldFRpbWUoKSA6IDA7XHJcbiAgICBpZiAodGltZV9mcm9tID4gdGltZV90bykge1xyXG4gICAgICAgIFt0aW1lX2Zyb20sIHRpbWVfdG9dID0gW3RpbWVfdG8sIHRpbWVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC00LDRgiDQvNC10LbQtNGDINC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRkYXlzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgJGRheXNbaV0uY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2VsZWN0ZWQtYmV0d2VlbicsICRkYXlzW2ldLmRhdGFzZXQudGltZSA+IHRpbWVfZnJvbSAmJiAkZGF5c1tpXS5kYXRhc2V0LnRpbWUgPCB0aW1lX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0Lkg0L/QvtC30LjRhtC40LhcclxuICAgIGNvbnN0ICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICE9ICRkYXlfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgIT0gJGRheV90bykge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtGF0YDQsNC90LXQvdC40LUg0LIg0LrQtdGIXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkID0gJGRheV9mcm9tO1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgPSAkZGF5X3RvO1xyXG5cclxuICAgIHRoaXMuX3NlbGVjdGlvbi4kZGF5X2Zyb20gPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24uJGRheV90byA9ICRkYXlfdG87XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICBjb25zdCBkYXlzID0gTWF0aC5mbG9vcihNYXRoLmFicyh0aW1lX2Zyb20gLSB0aW1lX3RvKSAvIDg2NDAwZTMpICsgMTtcclxuICAgICAgICB0aGlzLl90b29sdGlwU2hvdygkZGF5X3RvLCBkYXlzKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCf0L7QutCw0Lcg0L/QvtC00YHQutCw0LfQutC4XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQktGL0LHRgNCw0L3QvdGL0Lkg0LTQtdC90YxcclxuICogQHBhcmFtIHtOdW1iZXJ9ICBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwU2hvdyA9IGZ1bmN0aW9uKCRkYXksIGRheXMpIHtcclxuICAgIHRoaXMuXyR0b29sdGlwLnRleHRDb250ZW50ID0gdGhpcy5vcHRpb25zLmZpbHRlci50b29sdGlwVGV4dC5jYWxsKHRoaXMsIGRheXMpIHx8ICcnO1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2hvdycsIHRoaXMuXyR0b29sdGlwLnRleHRDb250ZW50Lmxlbmd0aCk7XHJcbiAgICB0aGlzLl90b29sdGlwVXBkYXRlKCRkYXkpO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0L/QvtC30LjRhtC40Lgg0L/QvtC00YHQutCw0LfQutC4XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQktGL0LHRgNCw0L3QvdGL0Lkg0LTQtdC90YxcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3Rvb2x0aXBVcGRhdGUgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBjb25zdCByZWN0ID0gJGRheS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIHRoaXMuXyR0b29sdGlwLnN0eWxlLnRvcCA9IE1hdGgucm91bmQocmVjdC50b3AgKyB3aW5kb3cuc2Nyb2xsWSAtIHJlY3QuaGVpZ2h0IC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSArICdweCc7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5zdHlsZS5sZWZ0ID0gTWF0aC5yb3VuZChyZWN0LmxlZnQgKyB3aW5kb3cuc2Nyb2xsWCArIHJlY3Qud2lkdGggLyAyIC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0V2lkdGggLyAyKSArICdweCc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60YDRi9GC0Ywg0L/QvtC00YHQutCw0LfQutGDXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwSGlkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2hvdycpO1xyXG59XHJcblxyXG4vKipcclxuICog0KLQtdC60YHRgiDQv9C+0LTRgdC60LDQt9C60Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICogQHBhcmFtICB7TnVtYmVyfSBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2ZpbHRlclRvb2x0aXBUZXh0ID0gZnVuY3Rpb24oZGF5cykge1xyXG4gICAgcmV0dXJuIHRoaXMucGx1cmFsKGRheXMsIFsnJWQg0LTQtdC90YwnLCAnJWQg0LTQvdGPJywgJyVkINC00L3QtdC5J10pLnJlcGxhY2UoJyVkJywgZGF5cyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNC40LvRjNGC0YAg0L3QtdC00L7RgdGC0YPQv9C90YvRhSDQtNC90LXQuSDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fZmlsdGVyTG9ja0RheXMgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINCy0YHQtSDQtNC90Lgg0LTQvtGB0YLRg9C/0L3Ri1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0LjQt9C80LXQvdC10L3QuNGPINGA0LDQt9C80LXRgNC+0LIg0L7QutC90LBcclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uV2luZG93UmVzaXplRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLiRkYXlfdG8pIHtcclxuICAgICAgICB0aGlzLl90b29sdGlwVXBkYXRlKHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYnJlYWtwb2ludCA9IDA7XHJcbiAgICBjb25zdCBicmVha3BvaW50cyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xyXG4gICAgZm9yIChsZXQgaSBpbiBicmVha3BvaW50cykge1xyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSBicmVha3BvaW50c1tpXSkge1xyXG4gICAgICAgICAgICBicmVha3BvaW50ID0gYnJlYWtwb2ludHNbaV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9zZXRCcmVha3BvaW50KGJyZWFrcG9pbnQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGB0L7RgdGC0L7Rj9C90LjRjyDRgNC10L3QtNC10YDQsCDQv9C+0LQg0YDQsNC30L3Ri9C1INGN0LrRgNCw0L3Ri1xyXG4gKiBAcGFyYW0ge051bWJlcn0gYnJlYWtwb2ludCDQmtC70Y7RhyDQuNC3IHRoaXMub3B0aW9ucy5icmVha3BvaW50cyAo0KjQuNGA0LjQvdCwINGN0LrRgNCw0L3QsClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3NldEJyZWFrcG9pbnQgPSBmdW5jdGlvbihicmVha3BvaW50KSB7XHJcbiAgICAvLyDQvtGCINC90LXQvdGD0LbQvdC+0Lkg0L/QtdGA0LXRgNC40YHQvtCy0LrQuFxyXG4gICAgaWYgKHRoaXMuX2JyZWFrcG9pbnQgPT0gYnJlYWtwb2ludCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuX2JyZWFrcG9pbnQgPSBicmVha3BvaW50O1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCB0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pO1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRocyh0aGlzLl9zZWxlY3RlZERhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0K3Qu9C10LzQtdC90YIg0LrQsNC70LXQvdC00LDRgNC90L7Qs9C+INC00L3Rj1xyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9ICAgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGdldERheUJ5RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpbWUgPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogMDtcclxuICAgIHJldHVybiB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5EYXlbZGF0YS10aW1lPVwiJyArIHRpbWUgKyAnXCJdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPIC0g0LfQsNCz0LvRg9GI0LrQuFxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVtcHR5RGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXkgaXMtZW1wdHlcIj48L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkZGF5O1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwINC40LcgSFRNTCDRgtC10LrRgdGC0LBcclxuICogQHBhcmFtICB7U3RyaW5nfSBodG1sIEhUTUwg0YLQtdC60YHRglxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XHJcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgIHJldHVybiBkaXYuY2hpbGRyZW4ubGVuZ3RoID4gMSA/IGRpdi5jaGlsZHJlbiA6IGRpdi5maXJzdEVsZW1lbnRDaGlsZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNhZmUg0LLRi9C30L7QsiDQstC90LXRiNC90LjRhSDRgdC+0LHRi9GC0LjQuSDQutC+0LzQv9C+0L3QtdC90YLQsFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZiDQmNC80Y8g0YHQvtCx0YvRgtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2NhbGxiYWNrID0gZnVuY3Rpb24oZikge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25bZl0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub25bZl0uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm47XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGVSYW5nZVBpY2tlcjtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9kaXN0L2RhdGVyYW5nZXBpY2tlci5qcyIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2RlbW8vcGFnZS5zY3NzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9kZW1vL3BhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJLElBQXlEO0FBQzdEO0FBQ0EsTUFBTSxFQUtnQztBQUN0QyxDQUFDO0FBQ0Qsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQSxjQUFjLDhCQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxnQkFBZ0IsOEJBQW1CLHdCQUF3Qiw4QkFBbUI7QUFDOUUsbURBQW1ELHlDQUF5QztBQUM1RjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxpRUFBaUUsa0JBQWtCO0FBQ25GO0FBQ0EsMERBQTBELGNBQWM7QUFDeEU7QUFDQSxXQUFXO0FBQ1g7QUFD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K3Q2Qzs7Ozs7O1VDbDJCekQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGdDQUFnQyxZQUFZO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7OztBQ0EwRjs7QUFFMUY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSw4REFBZTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLDhEQUFXO0FBQ2xDOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6Ii4vZGVtby9wYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJEYXRlcmFuZ2VwaWNrZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovICgoKSA9PiB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0XCJ1c2Ugc3RyaWN0XCI7XG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIHNjb3BlXG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG4vKioqKioqLyBcdFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG4vKioqKioqLyBcdFx0XHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG4vKioqKioqLyBcdFx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuLyoqKioqKi8gXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG4vKioqKioqLyBcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSlcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcbi8qKioqKiovIFx0XHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuLyoqKioqKi8gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbi8vIFRoaXMgZW50cnkgbmVlZCB0byBiZSB3cmFwcGVkIGluIGFuIElJRkUgYmVjYXVzZSBpdCBuZWVkIHRvIGJlIGlzb2xhdGVkIGFnYWluc3Qgb3RoZXIgZW50cnkgbW9kdWxlcy5cbigoKSA9PiB7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvc2Nzcy9pbmRleC5zY3NzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuXG59KSgpO1xuXG4vLyBUaGlzIGVudHJ5IG5lZWQgdG8gYmUgd3JhcHBlZCBpbiBhbiBJSUZFIGJlY2F1c2UgaXQgbmVlZCB0byBiZSBpc29sYXRlZCBhZ2FpbnN0IG90aGVyIGVudHJ5IG1vZHVsZXMuXG4oKCkgPT4ge1xuLyohKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9qcy9pbmRleC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKi9cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0ICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCB7XG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiTE9DS19VTkFWQUlMQUJMRVwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBMT0NLX1VOQVZBSUxBQkxFKSxcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJMT0NLX0xPQ0tFRFwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBMT0NLX0xPQ0tFRCksXG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiZGVmYXVsdFwiOiAoKSA9PiAoX19XRUJQQUNLX0RFRkFVTFRfRVhQT1JUX18pXG4vKiBoYXJtb255IGV4cG9ydCAqLyB9KTtcbi8vINGB0L7RgdGC0L7Rj9C90LjRjyDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbmNvbnN0IExPQ0tfVU5BVkFJTEFCTEUgPSAxO1xyXG5jb25zdCBMT0NLX0xPQ0tFRCAgICAgID0gMjtcclxuXHJcbmZ1bmN0aW9uIERhdGVSYW5nZVBpY2tlcigkY29udGFpbmVyLCBvcHRpb25zID0ge30pIHtcclxuICAgIC8vINC+0YIg0L/QvtCy0YLQvtGA0L3QvtC5INC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4XHJcbiAgICBpZiAoJGNvbnRhaW5lci5pbnN0YW5jZSkge1xyXG4gICAgICAgIHJldHVybiAkY29udGFpbmVyLmluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgJGNvbnRhaW5lci5pbnN0YW5jZSA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5fJGNvbnRhaW5lciA9ICRjb250YWluZXI7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgIGZpcnN0RGF5T2ZUaGVXZWVrOiBvcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrIHx8IDEsICAgICAgICAgIC8vINC/0LXRgNCy0YvQuSDQtNC10L3RjCDQvdC10LTQtdC70LgsIDAgPSDQstGBLCAxID0g0L/QvSwgLi4uXHJcbiAgICAgICAgc2luZ2xlTW9kZTogICAgICAgIG9wdGlvbnMuc2luZ2xlTW9kZSAgICAgICAgfHwgZmFsc2UsICAgICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLINCy0LzQtdGB0YLQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBsb2NhbGU6ICAgICAgICAgICAgb3B0aW9ucy5sb2NhbGUgICAgICAgICAgICB8fCAncnUtUlUnLFxyXG4gICAgICAgIG1pbkRheXM6ICAgICAgICAgICBvcHRpb25zLm1pbkRheXMgICAgICAgICAgIHx8IDEsICAgICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LTQuNCw0L/QsNC30L7QvdC1XHJcbiAgICAgICAgbW9udGhzQ291bnQ6ICAgICAgIG9wdGlvbnMubW9udGhzQ291bnQgICAgICAgfHwgMTIsXHJcbiAgICAgICAgcGVyUm93OiAgICAgICAgICAgIG9wdGlvbnMucGVyUm93ICAgICAgICAgICAgfHwgdW5kZWZpbmVkLCAgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LzQtdGB0Y/RhtC10LIg0LIg0YDRj9C00YNcclxuICAgICAgICBtaW5EYXRlOiAgICAgICAgICAgb3B0aW9ucy5taW5EYXRlICAgICAgICAgICB8fCBuZXcgRGF0ZSgpLCAvLyDQvNC40L3QuNC80LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgICAgbWF4RGF0ZTogICAgICAgICAgIG9wdGlvbnMubWF4RGF0ZSAgICAgICAgICAgfHwgdW5kZWZpbmVkLFxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiAgICAgICBvcHRpb25zLmJyZWFrcG9pbnRzICAgICAgIHx8IHt9LFxyXG4gICAgICAgIGludGVybmFsSW5wdXRzOiAgICBvcHRpb25zLmludGVybmFsSW5wdXRzICAgIHx8IHRydWUsICAgICAgIC8vINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1INCy0YHRgtGA0L7QtdC90L3Ri9GFINC40L3Qv9GD0YLQvtCyXHJcbiAgICAgICAgLy8g0YHQvtCx0YvRgtC40Y9cclxuICAgICAgICBvbjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIHJhbmdlU2VsZWN0OiBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICAgICAgICBkYXlTZWxlY3Q6ICAgbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC+0LTQvdC+0Lkg0LTQsNGC0YsgKNGC0L7Qu9GM0LrQviDQv9GA0Lggc2luZ2xlTW9kZTogdHJ1ZSlcclxuICAgICAgICB9LCBvcHRpb25zLm9uIHx8IHt9KSxcclxuICAgICAgICAvLyDRhNC40LvRjNGC0YDRg9GO0YnQuNC1INC80LXRgtC+0LTRi1xyXG4gICAgICAgIGZpbHRlcjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIGxvY2tEYXlzOiAgICB0aGlzLl9maWx0ZXJMb2NrRGF5cywgICAgLy8gY2FsbGJhY2soZGF0ZSkg0YTRg9C90LrRhtC40Y8g0LHQu9C+0LrQuNGA0L7QstCw0L3QuNGPINC00LDRgiwgdHJ1ZS9MT0NLXHJcbiAgICAgICAgICAgIHRvb2x0aXBUZXh0OiB0aGlzLl9maWx0ZXJUb29sdGlwVGV4dCwgLy8gY2FsbGJhY2soZGF5cykg0LLRi9Cy0L7QtCDRgtC10LrRgdGC0LAg0L/QvtC00YHQutCw0LfQutC4XHJcbiAgICAgICAgfSwgb3B0aW9ucy5maWx0ZXIgfHwge30pLFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0YDRj9C00L3QvtGB0YLRjFxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGVyUm93ID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnBlclJvdyA9IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMubWluRGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtC/0YbQuNC4INC00LvRjyDRjdC60YDQsNC90L7QsiDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW3RoaXMuX2JyZWFrcG9pbnQgPSAwXSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyk7XHJcblxyXG4gICAgLy8g0YLQtdC60YPRidC40Lkg0LTQtdC90YxcclxuICAgIHRoaXMuX3RvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIHRoaXMuX3RvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIHRoaXMuXyRwaWNrZXIgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlclwiPlxyXG4gICAgICAgICAgICAke3RoaXMub3B0aW9ucy5pbnRlcm5hbElucHV0cyA/XHJcbiAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9faW5wdXRzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV9mcm9tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV90b1wiPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+YCA6ICcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXBcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGN0LvQtdC80LXQvdGC0YtcclxuICAgIHRoaXMuXyRtb250aHMgID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX19tb250aHMnKTtcclxuICAgIHRoaXMuXyR0b29sdGlwID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX190b29sdGlwJyk7XHJcblxyXG4gICAgLy8g0L/QvtC70Y8g0LLQstC+0LTQsFxyXG4gICAgdGhpcy5fJGlucHV0RnJvbSA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignW25hbWU9XCJkYXRlX2Zyb21cIl0nKTtcclxuICAgIHRoaXMuXyRpbnB1dFRvICAgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZGF0ZV90b1wiXScpO1xyXG5cclxuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKHRoaXMub3B0aW9ucy5taW5EYXRlKTtcclxuICAgIHRoaXMuXyRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fJHBpY2tlcik7XHJcblxyXG4gICAgLy8g0L7QsdGA0LDQsdC+0YLQutCwINCx0YDQtdC50LrQv9C+0LjQvdGC0L7QslxyXG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykubGVuZ3RoKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uV2luZG93UmVzaXplRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5fb25XaW5kb3dSZXNpemVFdmVudCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0J3QsNC30LLQsNC90LjQtSDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRNb250aEZvcm1hdHRlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7bW9udGg6ICdsb25nJ30pO1xyXG4gICAgcmV0dXJuIHRpdGxlLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aXRsZS5zbGljZSgxKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0Ysg0LTQu9GPINGC0LXQutGD0YnQtdC5INC70L7QutCw0LvQuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyDQn9Cw0YDQsNC80LXRgtGA0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlVGltZUZvcm1hdCA9IGZ1bmN0aW9uKGRhdGUsIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMub3B0aW9ucy5sb2NhbGUsIG9wdGlvbnMpLmZvcm1hdChkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCU0L3QuCDQvdC10LTQtdC70LhcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0V2Vla0RheXNGb3JtYXR0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gMik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7ICsraSkge1xyXG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgZGF5OiBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7d2Vla2RheTogJ3Nob3J0J30pLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINGB0L7Qs9C70LDRgdC90L4g0L3QsNGB0YLRgNC+0LXQvdC90L7QvNGDINC/0LXRgNCy0L7QvNGDINC00L3RjiDQvdC10LTQtdC70LhcclxuICAgIHJlc3VsdC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmlyc3REYXlPZlRoZVdlZWsgPSB0aGlzLm9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgJSA3O1xyXG4gICAgICAgIGxldCBkYXlBID0gYS5kYXk7XHJcbiAgICAgICAgbGV0IGRheUIgPSBiLmRheTtcclxuXHJcbiAgICAgICAgaWYgKGRheUEgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUIgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QSA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIGRheUEgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlCIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgZGF5QiArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRheUEgLSBkYXlCO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC80LXRgdGP0YbQtVxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9ICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERheXNDb3VudEluTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRheXMuc2V0TW9udGgoZGF5cy5nZXRNb250aCgpICsgMSk7XHJcbiAgICBkYXlzLnNldERhdGUoMCk7XHJcbiAgICByZXR1cm4gZGF5cy5nZXREYXRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFJlc2V0KCk7XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24gPSB7fTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQtNC10LvQtdC90LjQtSDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnJhbmdlU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZShkYXRlX2Zyb20sIGRhdGVfdG8pKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0ICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcblxyXG4gICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LIg0L7QsdGA0LDRgtC90L7QvCDQv9C+0YDRj9C00LrQtVxyXG4gICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC+0LHQvdC+0LLQu9C10L3QuNC1INC40L3Qv9GD0YLQvtCyXHJcbiAgICBpZiAodGhpcy5fJGlucHV0RnJvbSkge1xyXG4gICAgICAgIHRoaXMuXyRpbnB1dEZyb20udmFsdWUgPSB0aGlzLmZvcm1hdERhdGUoZGF0ZV9mcm9tKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fJGlucHV0VG8pIHtcclxuICAgICAgICB0aGlzLl8kaW5wdXRUby52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0LHRi9GC0LjQtVxyXG4gICAgdGhpcy5fY2FsbGJhY2soJ3JhbmdlU2VsZWN0JywgZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0YtcclxuICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge1N0cmluZ30gZm9ybWF0INCk0L7RgNC80LDRgiDRgdGC0YDQvtC60LhcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSwgZm9ybWF0ID0gJ1ktbS1kJykge1xyXG4gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlKCdZJywgZGF0ZS5nZXRGdWxsWWVhcigpKVxyXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdtJywgKCcwJyArIChkYXRlLmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpKVxyXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdkJywgKCcwJyArIChkYXRlLmdldERhdGUoKSkpLnNsaWNlKC0yKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0L7QstC10YDQutCwINCy0L7Qt9C80L7QttC90L7RgdGC0Lgg0LLRi9C00LXQu9C10L3QuNGPINC00LDRglxyXG4gKiBAcGFyYW0gIHtEYXRlIGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtICB7RGF0ZSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRJc1JhbmdlU2VsZWN0YWJsZSA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoZGF0ZV9mcm9tLmdldFRpbWUoKSAtIGRhdGVfdG8uZ2V0VGltZSgpKSAvIDEwMDAgLyA4NjQwMDtcclxuICAgIGlmIChkaWZmIDwgdGhpcy5vcHRpb25zLm1pbkRheXMpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQv9C+0L/QsNC00LDQvdC40Y8g0LIg0LTQuNCw0L/QsNC30L7QvSDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbiAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgZGF5LnNldFRpbWUoZGF0ZV9mcm9tLmdldFRpbWUoKSk7XHJcblxyXG4gICAgd2hpbGUgKGRheSA8IGRhdGVfdG8pIHtcclxuICAgICAgICBpZiAodGhpcy5nZXREYXlMb2NrZWQoZGF5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkYXkuc2V0RGF0ZShkYXkuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0L7QstC10YDQutCwINC90LAg0LTQvtGB0YLRg9C/0L3QvtGB0YLRjCDQtNC90Y8g0LTQu9GPINCx0YDQvtC90LhcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgIHRydWUg0LXRgdC70Lgg0LTQvtGB0YLRg9C/0LXQvVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXlMb2NrZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQstC90LUg0LTQvtGB0YLRg9C/0L3QvtCz0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlIHx8IGRhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBMT0NLX1VOQVZBSUxBQkxFO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmlsdGVyLmxvY2tEYXlzLmNhbGwodGhpcywgZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60LvQvtC90LXQvdC40LUgKDEg0LHQvtCx0ZHRgCwgMiDQsdC+0LHRgNCwLCA1INCx0L7QsdGA0L7QsilcclxuICogQHBhcmFtICB7TnVtYmVyfSB2YWx1ZSDQmtC+0LvQuNGH0LXRgdGC0LLQvlxyXG4gKiBAcGFyYW0gIHtBcnJheX0gIGZvcm1zINCc0LDRgdGB0LjQsiDQuNC3IDPRhSDRjdC70LXQvNC10L3RgtC+0LIsINC80L7QttC10YIg0YHQvtC00LXRgNC20LDRgtGMINGB0L/QtdGG0LjRhNC40LrQsNGC0L7RgCAlZCDQtNC70Y8g0LfQsNC80LXQvdGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucGx1cmFsID0gZnVuY3Rpb24gKHZhbHVlLCBmb3Jtcykge1xyXG4gICAgcmV0dXJuICh2YWx1ZSAlIDEwID09IDEgJiYgdmFsdWUgJSAxMDAgIT0gMTEgPyBmb3Jtc1swXSA6ICh2YWx1ZSAlIDEwID49IDIgJiYgdmFsdWUgJSAxMCA8PSA0ICYmICh2YWx1ZSAlIDEwMCA8IDEwIHx8IHZhbHVlICUgMTAwID49IDIwKSA/IGZvcm1zWzFdIDogZm9ybXNbMl0pKS5yZXBsYWNlKCclZCcsIHZhbHVlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC40LDQv9Cw0LfQvtC90LAg0LzQtdGB0Y/RhtC10LJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlTW9udGhzID0gZnVuY3Rpb24oZGF0ZV9mcm9tKSB7XHJcbiAgICB3aGlsZSAodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5yZW1vdmVDaGlsZCh0aGlzLl8kbW9udGhzLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgIHRoaXMuX3Rvb2x0aXBIaWRlKCk7XHJcblxyXG4gICAgLy8g0L/RgNC10YDQtdC90LTQtdGAINC80LXRgdGP0YbQtdCyXHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG4gICAgY29uc3QgJG1vbnRocyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7ICsraSkge1xyXG4gICAgICAgICRtb250aHMucHVzaCh0aGlzLl8kY3JlYXRlTW9udGgoY3VycmVudERhdGUpKTtcclxuICAgICAgICBjdXJyZW50RGF0ZS5zZXRNb250aChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRtb250aHMubGVuZ3RoOyBpICs9IHRoaXMub3B0aW9ucy5wZXJSb3cpIHtcclxuICAgICAgICBjb25zdCAkcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnRGF0ZXJhbmdlcGlja2VyX19yb3cnO1xyXG5cclxuICAgICAgICAkbW9udGhzLnNsaWNlKGksIGkgKyB0aGlzLm9wdGlvbnMucGVyUm93KS5mb3JFYWNoKCRtb250aCA9PiB7XHJcbiAgICAgICAgICAgICRyb3cuYXBwZW5kQ2hpbGQoJG1vbnRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5hcHBlbmRDaGlsZCgkcm93KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCc0LXRgdGP0YZcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVNb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IG1vbnRoVGl0bGUgPSB0aGlzLmdldE1vbnRoRm9ybWF0dGVkKGRhdGUpO1xyXG4gICAgY29uc3Qgd2Vla0RheXMgPSB0aGlzLmdldFdlZWtEYXlzRm9ybWF0dGVkKCk7XHJcblxyXG4gICAgY29uc3QgJG1vbnRoID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJNb250aFwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9faGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tcHJldiR7KHRoaXMub3B0aW9ucy5taW5EYXRlICYmIGRhdGUgPD0gdGhpcy5vcHRpb25zLm1pbkRhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNyAxM0wxIDdMNyAxXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fdGl0bGVcIj4ke21vbnRoVGl0bGV9ICR7ZGF0ZS5nZXRGdWxsWWVhcigpfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLW5leHQkeyh0aGlzLm9wdGlvbnMubWF4RGF0ZSAmJiBkYXRlID49IHRoaXMub3B0aW9ucy5tYXhEYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEgMC45OTk5OTlMNyA3TDEgMTNcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrXCI+JHt3ZWVrRGF5cy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla2RheVwiPiR7aXRlbS50aXRsZX08L2Rpdj5gXHJcbiAgICAgICAgICAgIH0pLmpvaW4oJycpfTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2RheXNcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGB0YLRgNC10LvQutC4XHJcbiAgICBbXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tcHJldicsIG5hbWU6ICdwcmV2J30sXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tbmV4dCcsIG5hbWU6ICduZXh0J30sXHJcbiAgICBdLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgY29uc3QgJGFycm93ID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoaXRlbS5zZWxlY3Rvcik7XHJcbiAgICAgICAgJGFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX29uQXJyb3dDbGljaygkYXJyb3csIGl0ZW0ubmFtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YAg0LTQvdC10LlcclxuICAgIGNvbnN0ICRkYXlzID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aF9fZGF5cycpO1xyXG4gICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgIGRheXMuc2V0RGF0ZSgxKTtcclxuICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgd2hpbGUgKGRheXMuZ2V0TW9udGgoKSA9PSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVXZWVrKCk7XHJcblxyXG4gICAgICAgIHdlZWtEYXlzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkYXlzLmdldERheSgpICE9IGl0ZW0uZGF5IHx8IGRheXMuZ2V0TW9udGgoKSAhPSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVFbXB0eURheSgpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZURheShkYXlzKSk7XHJcbiAgICAgICAgICAgIGRheXMuc2V0RGF0ZShkYXlzLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkZGF5cy5hcHBlbmRDaGlsZCgkd2Vlayk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICRtb250aDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0LvQuNC6INC/0L4g0YHRgtGA0LXQu9C60LUg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPINC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRhcnJvdyBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lICAgINCY0LzRjyAocHJldiwgbmV4dClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uQXJyb3dDbGljayA9IGZ1bmN0aW9uKCRhcnJvdywgbmFtZSkge1xyXG4gICAgaWYgKCRhcnJvdy5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLk1vbnRoJykuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyAobmFtZSA9PSAncHJldicgPyAtdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50IDogdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KSk7XHJcblxyXG4gICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LjQvdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1pbkRhdGUuZ2V0VGltZSgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0YXQvtC0INC30LAg0L/RgNC10LTQtdC70Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICBjb25zdCBlbmREYXRlID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGVuZERhdGUuc2V0TW9udGgoZW5kRGF0ZS5nZXRNb250aCgpICsgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KTtcclxuICAgICAgICBpZiAoZW5kRGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWF4RGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSAtIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCArIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9C10YDQtdGF0L7QtCDQuiDQvdC+0LLQvtC5INC00LDRgtC1XHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGC0LXQutGD0YnQtdC5INC00LDRgtGLINGBINGA0LXQvdC00LXRgNC+0LxcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9zZWxlY3REYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgdGhpcy5fc2VsZWN0ZWREYXRlID0gZGF0ZTtcclxuICAgIHRoaXMuXyRjcmVhdGVNb250aHMoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0L3QtdC00LXQu9C4XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlV2VlayA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJXZWVrXCI+PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gJHdlZWs7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgJGRheSA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5XCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIiBkYXRhLWRheT1cIiR7ZGF0ZS5nZXREYXkoKX1cIj4ke2RhdGUuZ2V0RGF0ZSgpfTwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uRGF5Q2xpY2tFdmVudC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5fb25EYXlNb3VzZUVudGVyRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICB0aGlzLl91cGRhdGVEYXkoJGRheSk7XHJcblxyXG4gICAgcmV0dXJuICRkYXk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5Nb250aCcpLmZvckVhY2goJG1vbnRoID0+IHtcclxuICAgICAgICB0aGlzLl91cGRhdGVNb250aCgkbW9udGgpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Lkg0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJG1vbnRoINCt0LvQtdC80LXQvdGCINC80LXRgdGP0YbQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdXBkYXRlTW9udGggPSBmdW5jdGlvbigkbW9udGgpIHtcclxuICAgICRtb250aC5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKS5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZURheSgkZGF5KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5INC00L3Rj1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkg0K3Qu9C10LzQtdC90YIg0LTQvdGPXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl91cGRhdGVEYXkgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBjb25zdCBkYXRlICAgPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIGNvbnN0IGxvY2tlZCA9IHRoaXMuZ2V0RGF5TG9ja2VkKGRhdGUpO1xyXG4gICAgY29uc3QgdG9kYXkgID0gdGhpcy5fdG9kYXkuZ2V0VGltZSgpID09IGRhdGUuZ2V0VGltZSgpO1xyXG5cclxuICAgICRkYXkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtZGlzYWJsZWQnLCBsb2NrZWQpO1xyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1sb2NrZWQnLCBsb2NrZWQgPT0gTE9DS19MT0NLRUQpO1xyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy10b2RheScsIHRvZGF5KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INC60LvQuNC60LAg0L/QviDQtNC90Y5cclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5Q2xpY2tFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuX29uRGF5Q2xpY2soZS50YXJnZXQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0YXQvtCy0LXRgNCwXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheU1vdXNlRW50ZXJFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlcihlLnRhcmdldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpdC+0LLQtdGAINC90LAg0Y3Qu9C10LzQtdC90YLQtSDQtNC90Y9cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5TW91c2VFbnRlciA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheS5kYXRhc2V0LnRpbWUgPT0gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbS5nZXRUaW1lKCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC70LjQuiDQv9C+INC00L3RjlxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlDbGljayA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIC8vINC00LXQvdGMINC30LDQsdC70L7QutC40YDQvtCy0LDQvVxyXG4gICAgaWYgKCRkYXkuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrKCdkYXlTZWxlY3QnLCBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0LHRgNC+0YEg0LLRi9Cx0YDQsNC90L3QvtCz0L4g0YDQsNC90LXQtSDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG5cclxuICAgIC8vINCy0YvQsdGA0LDQvdCwINC90LDRh9Cw0LvRjNC90LDRjyAvINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJhbmdlU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LjQt9GD0LDQu9GM0L3Ri9C5INGB0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICAkZGF5cy5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgICRkYXkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScsICdpcy1zZWxlY3RlZC10bycsICdpcy1zZWxlY3RlZC1iZXR3ZWVuJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyDQv9GA0Y/Rh9C10Lwg0L/QvtC00YHQutCw0LfQutGDXHJcbiAgICB0aGlzLl90b29sdGlwSGlkZSgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JLQuNC30YPQsNC70YzQvdC+0LUg0LLRi9C00LXQu9C10L3QuNC1INC00LDRglxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fcmFuZ2VWaXN1YWxTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGlmIChkYXRlX2Zyb20gJiYgZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZGF0ZV90byAmJiBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHRpbWVfZnJvbSA9IGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX2Zyb20uZ2V0VGltZSgpIDogMDtcclxuICAgIGxldCB0aW1lX3RvID0gZGF0ZV90byBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX3RvLmdldFRpbWUoKSA6IDA7XHJcbiAgICBpZiAodGltZV9mcm9tID4gdGltZV90bykge1xyXG4gICAgICAgIFt0aW1lX2Zyb20sIHRpbWVfdG9dID0gW3RpbWVfdG8sIHRpbWVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC00LDRgiDQvNC10LbQtNGDINC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRkYXlzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgJGRheXNbaV0uY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2VsZWN0ZWQtYmV0d2VlbicsICRkYXlzW2ldLmRhdGFzZXQudGltZSA+IHRpbWVfZnJvbSAmJiAkZGF5c1tpXS5kYXRhc2V0LnRpbWUgPCB0aW1lX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0Lkg0L/QvtC30LjRhtC40LhcclxuICAgIGNvbnN0ICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICE9ICRkYXlfZnJvbSkge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgIT0gJGRheV90bykge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtGF0YDQsNC90LXQvdC40LUg0LIg0LrQtdGIXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkID0gJGRheV9mcm9tO1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgPSAkZGF5X3RvO1xyXG5cclxuICAgIHRoaXMuX3NlbGVjdGlvbi4kZGF5X2Zyb20gPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24uJGRheV90byA9ICRkYXlfdG87XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICBjb25zdCBkYXlzID0gTWF0aC5mbG9vcihNYXRoLmFicyh0aW1lX2Zyb20gLSB0aW1lX3RvKSAvIDg2NDAwZTMpICsgMTtcclxuICAgICAgICB0aGlzLl90b29sdGlwU2hvdygkZGF5X3RvLCBkYXlzKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCf0L7QutCw0Lcg0L/QvtC00YHQutCw0LfQutC4XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQktGL0LHRgNCw0L3QvdGL0Lkg0LTQtdC90YxcclxuICogQHBhcmFtIHtOdW1iZXJ9ICBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwU2hvdyA9IGZ1bmN0aW9uKCRkYXksIGRheXMpIHtcclxuICAgIHRoaXMuXyR0b29sdGlwLnRleHRDb250ZW50ID0gdGhpcy5vcHRpb25zLmZpbHRlci50b29sdGlwVGV4dC5jYWxsKHRoaXMsIGRheXMpIHx8ICcnO1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2hvdycsIHRoaXMuXyR0b29sdGlwLnRleHRDb250ZW50Lmxlbmd0aCk7XHJcbiAgICB0aGlzLl90b29sdGlwVXBkYXRlKCRkYXkpO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0L/QvtC30LjRhtC40Lgg0L/QvtC00YHQutCw0LfQutC4XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQktGL0LHRgNCw0L3QvdGL0Lkg0LTQtdC90YxcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3Rvb2x0aXBVcGRhdGUgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBjb25zdCByZWN0ID0gJGRheS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIHRoaXMuXyR0b29sdGlwLnN0eWxlLnRvcCA9IE1hdGgucm91bmQocmVjdC50b3AgKyB3aW5kb3cuc2Nyb2xsWSAtIHJlY3QuaGVpZ2h0IC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSArICdweCc7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5zdHlsZS5sZWZ0ID0gTWF0aC5yb3VuZChyZWN0LmxlZnQgKyB3aW5kb3cuc2Nyb2xsWCArIHJlY3Qud2lkdGggLyAyIC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0V2lkdGggLyAyKSArICdweCc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60YDRi9GC0Ywg0L/QvtC00YHQutCw0LfQutGDXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl90b29sdGlwSGlkZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2hvdycpO1xyXG59XHJcblxyXG4vKipcclxuICog0KLQtdC60YHRgiDQv9C+0LTRgdC60LDQt9C60Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICogQHBhcmFtICB7TnVtYmVyfSBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2ZpbHRlclRvb2x0aXBUZXh0ID0gZnVuY3Rpb24oZGF5cykge1xyXG4gICAgcmV0dXJuIHRoaXMucGx1cmFsKGRheXMsIFsnJWQg0LTQtdC90YwnLCAnJWQg0LTQvdGPJywgJyVkINC00L3QtdC5J10pLnJlcGxhY2UoJyVkJywgZGF5cyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQpNC40LvRjNGC0YAg0L3QtdC00L7RgdGC0YPQv9C90YvRhSDQtNC90LXQuSDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fZmlsdGVyTG9ja0RheXMgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vINCy0YHQtSDQtNC90Lgg0LTQvtGB0YLRg9C/0L3Ri1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0LjQt9C80LXQvdC10L3QuNGPINGA0LDQt9C80LXRgNC+0LIg0L7QutC90LBcclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uV2luZG93UmVzaXplRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLiRkYXlfdG8pIHtcclxuICAgICAgICB0aGlzLl90b29sdGlwVXBkYXRlKHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYnJlYWtwb2ludCA9IDA7XHJcbiAgICBjb25zdCBicmVha3BvaW50cyA9IE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykuc29ydCgoYSwgYikgPT4gYSAtIGIpO1xyXG4gICAgZm9yIChsZXQgaSBpbiBicmVha3BvaW50cykge1xyXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSBicmVha3BvaW50c1tpXSkge1xyXG4gICAgICAgICAgICBicmVha3BvaW50ID0gYnJlYWtwb2ludHNbaV07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9zZXRCcmVha3BvaW50KGJyZWFrcG9pbnQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KPRgdGC0LDQvdC+0LLQutCwINGB0L7RgdGC0L7Rj9C90LjRjyDRgNC10L3QtNC10YDQsCDQv9C+0LQg0YDQsNC30L3Ri9C1INGN0LrRgNCw0L3Ri1xyXG4gKiBAcGFyYW0ge051bWJlcn0gYnJlYWtwb2ludCDQmtC70Y7RhyDQuNC3IHRoaXMub3B0aW9ucy5icmVha3BvaW50cyAo0KjQuNGA0LjQvdCwINGN0LrRgNCw0L3QsClcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3NldEJyZWFrcG9pbnQgPSBmdW5jdGlvbihicmVha3BvaW50KSB7XHJcbiAgICAvLyDQvtGCINC90LXQvdGD0LbQvdC+0Lkg0L/QtdGA0LXRgNC40YHQvtCy0LrQuFxyXG4gICAgaWYgKHRoaXMuX2JyZWFrcG9pbnQgPT0gYnJlYWtwb2ludCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuX2JyZWFrcG9pbnQgPSBicmVha3BvaW50O1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCB0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pO1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRocyh0aGlzLl9zZWxlY3RlZERhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0K3Qu9C10LzQtdC90YIg0LrQsNC70LXQvdC00LDRgNC90L7Qs9C+INC00L3Rj1xyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9ICAgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGdldERheUJ5RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpbWUgPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogMDtcclxuICAgIHJldHVybiB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5EYXlbZGF0YS10aW1lPVwiJyArIHRpbWUgKyAnXCJdJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQoNC10L3QtNC10YAg0LTQvdGPIC0g0LfQsNCz0LvRg9GI0LrQuFxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVtcHR5RGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXkgaXMtZW1wdHlcIj48L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkZGF5O1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwINC40LcgSFRNTCDRgtC10LrRgdGC0LBcclxuICogQHBhcmFtICB7U3RyaW5nfSBodG1sIEhUTUwg0YLQtdC60YHRglxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XHJcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdi5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgIHJldHVybiBkaXYuY2hpbGRyZW4ubGVuZ3RoID4gMSA/IGRpdi5jaGlsZHJlbiA6IGRpdi5maXJzdEVsZW1lbnRDaGlsZDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNhZmUg0LLRi9C30L7QsiDQstC90LXRiNC90LjRhSDRgdC+0LHRi9GC0LjQuSDQutC+0LzQv9C+0L3QtdC90YLQsFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZiDQmNC80Y8g0YHQvtCx0YvRgtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2NhbGxiYWNrID0gZnVuY3Rpb24oZikge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25bZl0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub25bZl0uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm47XHJcbn1cclxuXHJcbi8qIGhhcm1vbnkgZGVmYXVsdCBleHBvcnQgKi8gY29uc3QgX19XRUJQQUNLX0RFRkFVTFRfRVhQT1JUX18gPSAoRGF0ZVJhbmdlUGlja2VyKTtcclxuXG59KSgpO1xuXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfZXhwb3J0c19fO1xuLyoqKioqKi8gfSkoKVxuO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbmRsWW5CaFkyczZMeTlrWVhSbGNtRnVaMlZ3YVdOclpYSXZkMlZpY0dGamF5OTFibWwyWlhKellXeE5iMlIxYkdWRVpXWnBibWwwYVc5dUlpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOTNaV0p3WVdOckwySnZiM1J6ZEhKaGNDSXNJbmRsWW5CaFkyczZMeTlrWVhSbGNtRnVaMlZ3YVdOclpYSXZkMlZpY0dGamF5OXlkVzUwYVcxbEwyUmxabWx1WlNCd2NtOXdaWEowZVNCblpYUjBaWEp6SWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k5M1pXSndZV05yTDNKMWJuUnBiV1V2YUdGelQzZHVVSEp2Y0dWeWRIa2djMmh2Y25Sb1lXNWtJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTkzWldKd1lXTnJMM0oxYm5ScGJXVXZiV0ZyWlNCdVlXMWxjM0JoWTJVZ2IySnFaV04wSWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k4dUwzTnlZeTl6WTNOekwybHVaR1Y0TG5OamMzTS9OVFl4T0NJc0luZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdkxpOXpjbU12YW5NdmFXNWtaWGd1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNRMEZCUXp0QlFVTkVMRTg3TzFWRFZrRTdWVUZEUVRzN096czdWME5FUVR0WFFVTkJPMWRCUTBFN1YwRkRRVHRYUVVOQkxIZERRVUYzUXl4NVEwRkJlVU03VjBGRGFrWTdWMEZEUVR0WFFVTkJMRVU3T3pzN08xZERVRUVzZDBZN096czdPMWREUVVFN1YwRkRRVHRYUVVOQk8xZEJRMEVzYzBSQlFYTkVMR3RDUVVGclFqdFhRVU40UlR0WFFVTkJMQ3REUVVFclF5eGpRVUZqTzFkQlF6ZEVMRVU3T3pzN096czdPenM3T3p0QlEwNUJPenM3T3pzN096czdPenM3T3pzN1FVTkJRVHRCUVVOUE8wRkJRMEU3TzBGQlJWQXNhVVJCUVdsRU8wRkJRMnBFTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNNRVJCUVRCRU8wRkJRekZFTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hUUVVGVExHdENRVUZyUWp0QlFVTXpRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEZOQlFWTXNjMEpCUVhOQ08wRkJReTlDT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRU3h4UlVGQmNVVTdPMEZCUlhKRk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1kwRkJZenRCUVVOa08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCV1N4TFFVRkxPMEZCUTJwQ0xGbEJRVms3UVVGRFdqdEJRVU5CTzBGQlEwRXNaMFJCUVdkRUxHTkJRV003UVVGRE9VUTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzV1VGQldTeExRVUZMTzBGQlEycENMRmxCUVZrc1QwRkJUenRCUVVOdVFpeFpRVUZaTzBGQlExbzdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEVzYlVKQlFXMUNMRTlCUVU4N1FVRkRNVUk3UVVGRFFUdEJRVU5CTzBGQlEwRXNhVVJCUVdsRUxHbENRVUZwUWp0QlFVTnNSU3hUUVVGVE8wRkJRMVE3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVN4TFFVRkxPenRCUVVWTU8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1MwRkJTenRCUVVOcVFpeFpRVUZaTEU5QlFVODdRVUZEYmtJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eExRVUZMTzBGQlEyaENMRmRCUVZjc1MwRkJTenRCUVVOb1FqdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTEV0QlFVczdRVUZEYWtJc1dVRkJXU3hQUVVGUE8wRkJRMjVDTEZsQlFWazdRVUZEV2p0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrN1FVRkRXaXhaUVVGWk8wRkJRMW9zV1VGQldUdEJRVU5hTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1MwRkJTenRCUVVOcVFpeFpRVUZaTEZGQlFWRTdRVUZEY0VJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZsQlFWa3NUMEZCVHp0QlFVTnVRaXhaUVVGWkxFMUJRVTA3UVVGRGJFSXNXVUZCV1R0QlFVTmFPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRXRCUVVzN1FVRkRhRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJMRzFDUVVGdFFpdzRRa0ZCT0VJN1FVRkRha1E3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFc2JVSkJRVzFDTEc5Q1FVRnZRanRCUVVOMlF6dEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hUUVVGVE96dEJRVVZVTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1MwRkJTenRCUVVOb1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEVzZVVOQlFYbERMR1ZCUVdVN1FVRkRlRVE3UVVGRFFTdzJSRUZCTmtRc05rVkJRVFpGTzBGQlF6RkpPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzTkVOQlFUUkRMRmRCUVZjc1IwRkJSeXh0UWtGQmJVSTdRVUZETjBVc05rUkJRVFpFTERaRlFVRTJSVHRCUVVNeFNUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc2RVTkJRWFZETzBGQlEzWkRMSE5FUVVGelJDeFhRVUZYTzBGQlEycEZMR0ZCUVdFc1YwRkJWenRCUVVONFFqdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGTkJRVk1zT0VOQlFUaERPMEZCUTNaRUxGTkJRVk1zT0VOQlFUaERPMEZCUTNaRU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNVMEZCVXp0QlFVTlVMRXRCUVVzN08wRkJSVXc3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZOQlFWTTdPMEZCUlZRN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hYUVVGWExGRkJRVkU3UVVGRGJrSXNWMEZCVnl4UFFVRlBPMEZCUTJ4Q08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hYUVVGWExFdEJRVXM3UVVGRGFFSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNXVUZCV1N4TFFVRkxPMEZCUTJwQ0xGbEJRVms3UVVGRFdqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1MwRkJTenRCUVVOcVFpeFpRVUZaTzBGQlExbzdRVUZEUVR0QlFVTkJPMEZCUTBFc2RVTkJRWFZETEdWQlFXVXNZMEZCWXl4alFVRmpMRWxCUVVrc1pVRkJaVHRCUVVOeVJ6czdRVUZGUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxFdEJRVXM3UVVGRFREczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhSUVVGUk8wRkJRMjVDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1MwRkJTenRCUVVOTU96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRkZCUVZFN1FVRkRia0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhOUVVGTk8wRkJRMnBDTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEUxQlFVMDdRVUZEYWtJN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1VVRkJVVHRCUVVOdVFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZkQlFWY3NVVUZCVVR0QlFVTnVRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEVzUzBGQlN6dEJRVU5NTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxFdEJRVXM3TzBGQlJVdzdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEV0QlFVczdRVUZEYUVJc1YwRkJWeXhMUVVGTE8wRkJRMmhDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRzFDUVVGdFFpeHJRa0ZCYTBJN1FVRkRja003UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRkZCUVZFN1FVRkRia0lzVjBGQlZ5eFBRVUZQTzBGQlEyeENPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1YwRkJWeXhSUVVGUk8wRkJRMjVDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZsQlFWa3NUMEZCVHp0QlFVTnVRaXhaUVVGWk8wRkJRMW83UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVms3UVVGRFdqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEUxQlFVMDdRVUZEYWtJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZkQlFWY3NUMEZCVHp0QlFVTnNRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTEV0QlFVczdRVUZEYWtJc1dVRkJXU3hSUVVGUk8wRkJRM0JDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZsQlFWazdRVUZEV2p0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVmtzVDBGQlR6dEJRVU51UWl4WlFVRlpPMEZCUTFvN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hYUVVGWExFOUJRVTg3UVVGRGJFSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJMR2xGUVVGbExHVkJRV1VzUlVGQlF5SXNJbVpwYkdVaU9pSmtZWFJsY21GdVoyVndhV05yWlhJdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUlvWm5WdVkzUnBiMjRnZDJWaWNHRmphMVZ1YVhabGNuTmhiRTF2WkhWc1pVUmxabWx1YVhScGIyNG9jbTl2ZEN3Z1ptRmpkRzl5ZVNrZ2UxeHVYSFJwWmloMGVYQmxiMllnWlhod2IzSjBjeUE5UFQwZ0oyOWlhbVZqZENjZ0ppWWdkSGx3Wlc5bUlHMXZaSFZzWlNBOVBUMGdKMjlpYW1WamRDY3BYRzVjZEZ4MGJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCbVlXTjBiM0o1S0NrN1hHNWNkR1ZzYzJVZ2FXWW9kSGx3Wlc5bUlHUmxabWx1WlNBOVBUMGdKMloxYm1OMGFXOXVKeUFtSmlCa1pXWnBibVV1WVcxa0tWeHVYSFJjZEdSbFptbHVaU2hjSWtSaGRHVnlZVzVuWlhCcFkydGxjbHdpTENCYlhTd2dabUZqZEc5eWVTazdYRzVjZEdWc2MyVWdhV1lvZEhsd1pXOW1JR1Y0Y0c5eWRITWdQVDA5SUNkdlltcGxZM1FuS1Z4dVhIUmNkR1Y0Y0c5eWRITmJYQ0pFWVhSbGNtRnVaMlZ3YVdOclpYSmNJbDBnUFNCbVlXTjBiM0o1S0NrN1hHNWNkR1ZzYzJWY2JseDBYSFJ5YjI5MFcxd2lSR0YwWlhKaGJtZGxjR2xqYTJWeVhDSmRJRDBnWm1GamRHOXllU2dwTzF4dWZTa29jMlZzWml3Z1puVnVZM1JwYjI0b0tTQjdYRzV5WlhSMWNtNGdJaXdpTHk4Z1ZHaGxJSEpsY1hWcGNtVWdjMk52Y0dWY2JuWmhjaUJmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmSUQwZ2UzMDdYRzVjYmlJc0lpOHZJR1JsWm1sdVpTQm5aWFIwWlhJZ1puVnVZM1JwYjI1eklHWnZjaUJvWVhKdGIyNTVJR1Y0Y0c5eWRITmNibDlmZDJWaWNHRmphMTl5WlhGMWFYSmxYMTh1WkNBOUlDaGxlSEJ2Y25SekxDQmtaV1pwYm1sMGFXOXVLU0E5UGlCN1hHNWNkR1p2Y2loMllYSWdhMlY1SUdsdUlHUmxabWx1YVhScGIyNHBJSHRjYmx4MFhIUnBaaWhmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmTG04b1pHVm1hVzVwZEdsdmJpd2dhMlY1S1NBbUppQWhYMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeTV2S0dWNGNHOXlkSE1zSUd0bGVTa3BJSHRjYmx4MFhIUmNkRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNobGVIQnZjblJ6TENCclpYa3NJSHNnWlc1MWJXVnlZV0pzWlRvZ2RISjFaU3dnWjJWME9pQmtaV1pwYm1sMGFXOXVXMnRsZVYwZ2ZTazdYRzVjZEZ4MGZWeHVYSFI5WEc1OU95SXNJbDlmZDJWaWNHRmphMTl5WlhGMWFYSmxYMTh1YnlBOUlDaHZZbW9zSUhCeWIzQXBJRDArSUNoUFltcGxZM1F1Y0hKdmRHOTBlWEJsTG1oaGMwOTNibEJ5YjNCbGNuUjVMbU5oYkd3b2IySnFMQ0J3Y205d0tTa2lMQ0l2THlCa1pXWnBibVVnWDE5bGMwMXZaSFZzWlNCdmJpQmxlSEJ2Y25SelhHNWZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbklnUFNBb1pYaHdiM0owY3lrZ1BUNGdlMXh1WEhScFppaDBlWEJsYjJZZ1UzbHRZbTlzSUNFOVBTQW5kVzVrWldacGJtVmtKeUFtSmlCVGVXMWliMnd1ZEc5VGRISnBibWRVWVdjcElIdGNibHgwWEhSUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa29aWGh3YjNKMGN5d2dVM2x0WW05c0xuUnZVM1J5YVc1blZHRm5MQ0I3SUhaaGJIVmxPaUFuVFc5a2RXeGxKeUI5S1R0Y2JseDBmVnh1WEhSUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa29aWGh3YjNKMGN5d2dKMTlmWlhOTmIyUjFiR1VuTENCN0lIWmhiSFZsT2lCMGNuVmxJSDBwTzF4dWZUc2lMQ0l2THlCbGVIUnlZV04wWldRZ1lua2diV2x1YVMxamMzTXRaWGgwY21GamRDMXdiSFZuYVc1Y2JtVjRjRzl5ZENCN2ZUc2lMQ0l2THlEUmdkQyswWUhSZ3RDKzBZL1F2ZEM0MFk4ZzBMZlFzTkN4MEx2UXZ0QzYwTGpSZ05DKzBMTFFzTkM5MEwzUmk5R0ZJTkMwMExEUmdseHlYRzVsZUhCdmNuUWdZMjl1YzNRZ1RFOURTMTlWVGtGV1FVbE1RVUpNUlNBOUlERTdYSEpjYm1WNGNHOXlkQ0JqYjI1emRDQk1UME5MWDB4UFEwdEZSQ0FnSUNBZ0lEMGdNanRjY2x4dVhISmNibVoxYm1OMGFXOXVJRVJoZEdWU1lXNW5aVkJwWTJ0bGNpZ2tZMjl1ZEdGcGJtVnlMQ0J2Y0hScGIyNXpJRDBnZTMwcElIdGNjbHh1SUNBZ0lDOHZJTkMrMFlJZzBML1F2dEN5MFlMUXZ0R0EwTDNRdnRDNUlOQzQwTDNRdU5HRzBMalFzTkM3MExqUXQ5Q3cwWWJRdU5DNFhISmNiaUFnSUNCcFppQW9KR052Ym5SaGFXNWxjaTVwYm5OMFlXNWpaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlBa1kyOXVkR0ZwYm1WeUxtbHVjM1JoYm1ObE8xeHlYRzRnSUNBZ2ZWeHlYRzRnSUNBZ0pHTnZiblJoYVc1bGNpNXBibk4wWVc1alpTQTlJSFJvYVhNN1hISmNibHh5WEc0Z0lDQWdkR2hwY3k1ZkpHTnZiblJoYVc1bGNpQTlJQ1JqYjI1MFlXbHVaWEk3WEhKY2JseHlYRzRnSUNBZ2RHaHBjeTV2Y0hScGIyNXpJRDBnZTF4eVhHNGdJQ0FnSUNBZ0lHWnBjbk4wUkdGNVQyWlVhR1ZYWldWck9pQnZjSFJwYjI1ekxtWnBjbk4wUkdGNVQyWlVhR1ZYWldWcklIeDhJREVzSUNBZ0lDQWdJQ0FnSUM4dklOQy8wTFhSZ05DeTBZdlF1U0RRdE5DMTBMM1JqQ0RRdmRDMTBMVFF0ZEM3MExnc0lEQWdQU0RRc3RHQkxDQXhJRDBnMEwvUXZTd2dMaTR1WEhKY2JpQWdJQ0FnSUNBZ2MybHVaMnhsVFc5a1pUb2dJQ0FnSUNBZ0lHOXdkR2x2Ym5NdWMybHVaMnhsVFc5a1pTQWdJQ0FnSUNBZ2ZId2dabUZzYzJVc0lDQWdJQ0FnTHk4ZzBMTFJpOUN4MEw3UmdDRFF2dEMwMEwzUXZ0QzVJTkMwMExEUmd0R0xJTkN5MEx6UXRkR0IwWUxRdmlEUXROQzQwTERRdjlDdzBMZlF2dEM5MExCY2NseHVJQ0FnSUNBZ0lDQnNiMk5oYkdVNklDQWdJQ0FnSUNBZ0lDQWdiM0IwYVc5dWN5NXNiMk5oYkdVZ0lDQWdJQ0FnSUNBZ0lDQjhmQ0FuY25VdFVsVW5MRnh5WEc0Z0lDQWdJQ0FnSUcxcGJrUmhlWE02SUNBZ0lDQWdJQ0FnSUNCdmNIUnBiMjV6TG0xcGJrUmhlWE1nSUNBZ0lDQWdJQ0FnSUh4OElERXNJQ0FnSUNBZ0lDQWdJQzh2SU5DODBMalF2ZEM0MEx6UXNOQzcwWXpRdmRDKzBMVWcwTHJRdnRDNzBMalJoOUMxMFlIUmd0Q3kwTDRnMExUUXZkQzEwTGtnMExJZzBMVFF1TkN3MEwvUXNOQzMwTDdRdmRDMVhISmNiaUFnSUNBZ0lDQWdiVzl1ZEdoelEyOTFiblE2SUNBZ0lDQWdJRzl3ZEdsdmJuTXViVzl1ZEdoelEyOTFiblFnSUNBZ0lDQWdmSHdnTVRJc1hISmNiaUFnSUNBZ0lDQWdjR1Z5VW05M09pQWdJQ0FnSUNBZ0lDQWdJRzl3ZEdsdmJuTXVjR1Z5VW05M0lDQWdJQ0FnSUNBZ0lDQWdmSHdnZFc1a1pXWnBibVZrTENBZ0x5OGcwTHJRdnRDNzBMalJoOUMxMFlIUmd0Q3kwTDRnMEx6UXRkR0IwWS9SaHRDMTBMSWcwTElnMFlEUmo5QzAwWU5jY2x4dUlDQWdJQ0FnSUNCdGFXNUVZWFJsT2lBZ0lDQWdJQ0FnSUNBZ2IzQjBhVzl1Y3k1dGFXNUVZWFJsSUNBZ0lDQWdJQ0FnSUNCOGZDQnVaWGNnUkdGMFpTZ3BMQ0F2THlEUXZOQzQwTDNRdU5DODBMRFF1OUdNMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBZ0lDQWdJQ0FnYldGNFJHRjBaVG9nSUNBZ0lDQWdJQ0FnSUc5d2RHbHZibk11YldGNFJHRjBaU0FnSUNBZ0lDQWdJQ0FnZkh3Z2RXNWtaV1pwYm1Wa0xGeHlYRzRnSUNBZ0lDQWdJR0p5WldGcmNHOXBiblJ6T2lBZ0lDQWdJQ0J2Y0hScGIyNXpMbUp5WldGcmNHOXBiblJ6SUNBZ0lDQWdJSHg4SUh0OUxGeHlYRzRnSUNBZ0lDQWdJR2x1ZEdWeWJtRnNTVzV3ZFhSek9pQWdJQ0J2Y0hScGIyNXpMbWx1ZEdWeWJtRnNTVzV3ZFhSeklDQWdJSHg4SUhSeWRXVXNJQ0FnSUNBZ0lDOHZJTkM0MFlIUXY5QyswTHZSak5DMzBMN1FzdEN3MEwzUXVOQzFJTkN5MFlIUmd0R0EwTDdRdGRDOTBMM1JpOUdGSU5DNDBMM1F2OUdEMFlMUXZ0Q3lYSEpjYmlBZ0lDQWdJQ0FnTHk4ZzBZSFF2dEN4MFl2Umd0QzQwWTljY2x4dUlDQWdJQ0FnSUNCdmJqb2dUMkpxWldOMExtRnpjMmxuYmloN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhKaGJtZGxVMlZzWldOME9pQnVkV3hzTENBdkx5RFJnZEMrMExIUmk5R0MwTGpRdFNEUXN0R0wwTEhRdnRHQTBMQWcwTFRRdU5DdzBML1FzTkMzMEw3UXZkQ3dJTkMwMExEUmdseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCa1lYbFRaV3hsWTNRNklDQWdiblZzYkN3Z0x5OGcwWUhRdnRDeDBZdlJndEM0MExVZzBMTFJpOUN4MEw3UmdOQ3dJTkMrMExUUXZkQyswTGtnMExUUXNOR0MwWXNnS05HQzBMN1F1OUdNMExyUXZpRFF2OUdBMExnZ2MybHVaMnhsVFc5a1pUb2dkSEoxWlNsY2NseHVJQ0FnSUNBZ0lDQjlMQ0J2Y0hScGIyNXpMbTl1SUh4OElIdDlLU3hjY2x4dUlDQWdJQ0FnSUNBdkx5RFJoTkM0MEx2UmpOR0MwWURSZzlHTzBZblF1TkMxSU5DODBMWFJndEMrMExUUmkxeHlYRzRnSUNBZ0lDQWdJR1pwYkhSbGNqb2dUMkpxWldOMExtRnpjMmxuYmloN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUd4dlkydEVZWGx6T2lBZ0lDQjBhR2x6TGw5bWFXeDBaWEpNYjJOclJHRjVjeXdnSUNBZ0x5OGdZMkZzYkdKaFkyc29aR0YwWlNrZzBZVFJnOUM5MExyUmh0QzQwWThnMExIUXU5QyswTHJRdU5HQTBMN1FzdEN3MEwzUXVOR1BJTkMwMExEUmdpd2dkSEoxWlM5TVQwTkxYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUnZiMngwYVhCVVpYaDBPaUIwYUdsekxsOW1hV3gwWlhKVWIyOXNkR2x3VkdWNGRDd2dMeThnWTJGc2JHSmhZMnNvWkdGNWN5a2cwTExSaTlDeTBMN1F0Q0RSZ3RDMTBMclJnZEdDMExBZzBML1F2dEMwMFlIUXV0Q3cwTGZRdXRDNFhISmNiaUFnSUNBZ0lDQWdmU3dnYjNCMGFXOXVjeTVtYVd4MFpYSWdmSHdnZTMwcExGeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJSFJvYVhNdWFXNXBkQ2dwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSmpRdmRDNDBZYlF1TkN3MEx2UXVOQzMwTERSaHRDNDBZOWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVhVzVwZENBOUlHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdMeThnMFlEUmo5QzAwTDNRdnRHQjBZTFJqRnh5WEc0Z0lDQWdhV1lnS0hSNWNHVnZaaUIwYUdsekxtOXdkR2x2Ym5NdWNHVnlVbTkzSUQwOUlDZDFibVJsWm1sdVpXUW5LU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbkJsY2xKdmR5QTlJSFJvYVhNdWIzQjBhVzl1Y3k1dGIyNTBhSE5EYjNWdWREdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbTFwYmtSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbTl3ZEdsdmJuTXViV2x1UkdGMFpTNXpaWFJJYjNWeWN5Z3dMQ0F3TENBd0xDQXdLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFF2dEMvMFliUXVOQzRJTkMwMEx2Ump5RFJqZEM2MFlEUXNOQzkwTDdRc2lEUXY5QytJTkdEMEx6UXZ0QzcwWWZRc05DOTBMalJqbHh5WEc0Z0lDQWdkR2hwY3k1dmNIUnBiMjV6TG1KeVpXRnJjRzlwYm5SelczUm9hWE11WDJKeVpXRnJjRzlwYm5RZ1BTQXdYU0E5SUU5aWFtVmpkQzVoYzNOcFoyNG9lMzBzSUhSb2FYTXViM0IwYVc5dWN5azdYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBZTFF0ZEM2MFlQUmlkQzQwTGtnMExUUXRkQzkwWXhjY2x4dUlDQWdJSFJvYVhNdVgzUnZaR0Y1SUQwZ2JtVjNJRVJoZEdVb0tUdGNjbHh1SUNBZ0lIUm9hWE11WDNSdlpHRjVMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNWNjbHh1SUNBZ0lIUm9hWE11WHlSd2FXTnJaWElnUFNCMGFHbHpMbDhrWTNKbFlYUmxSV3hsYldWdWRDaGNjbHh1SUNBZ0lDQWdJQ0JnUEdScGRpQmpiR0Z6Y3oxY0lrUmhkR1Z5WVc1blpYQnBZMnRsY2x3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBa2UzUm9hWE11YjNCMGFXOXVjeTVwYm5SbGNtNWhiRWx1Y0hWMGN5QS9YSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JnUEdScGRpQmpiR0Z6Y3oxY0lrUmhkR1Z5WVc1blpYQnBZMnRsY2w5ZmFXNXdkWFJ6WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdsdWNIVjBJSFI1Y0dVOVhDSm9hV1JrWlc1Y0lpQnVZVzFsUFZ3aVpHRjBaVjltY205dFhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHbHVjSFYwSUhSNWNHVTlYQ0pvYVdSa1pXNWNJaUJ1WVcxbFBWd2laR0YwWlY5MGIxd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStZQ0E2SUNjblhISmNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrUmhkR1Z5WVc1blpYQnBZMnRsY2w5ZmJXOXVkR2h6WENJK1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM005WENKRVlYUmxjbUZ1WjJWd2FXTnJaWEpmWDNSdmIyeDBhWEJjSWo0OEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBOEwyUnBkajVnWEhKY2JpQWdJQ0FwTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkdOMEx2UXRkQzgwTFhRdmRHQzBZdGNjbHh1SUNBZ0lIUm9hWE11WHlSdGIyNTBhSE1nSUQwZ2RHaHBjeTVmSkhCcFkydGxjaTV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VSR0YwWlhKaGJtZGxjR2xqYTJWeVgxOXRiMjUwYUhNbktUdGNjbHh1SUNBZ0lIUm9hWE11WHlSMGIyOXNkR2x3SUQwZ2RHaHBjeTVmSkhCcFkydGxjaTV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VSR0YwWlhKaGJtZGxjR2xqYTJWeVgxOTBiMjlzZEdsd0p5azdYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBML1F2dEM3MFk4ZzBMTFFzdEMrMExUUXNGeHlYRzRnSUNBZ2RHaHBjeTVmSkdsdWNIVjBSbkp2YlNBOUlIUm9hWE11WHlSd2FXTnJaWEl1Y1hWbGNubFRaV3hsWTNSdmNpZ25XMjVoYldVOVhDSmtZWFJsWDJaeWIyMWNJbDBuS1R0Y2NseHVJQ0FnSUhSb2FYTXVYeVJwYm5CMWRGUnZJQ0FnUFNCMGFHbHpMbDhrY0dsamEyVnlMbkYxWlhKNVUyVnNaV04wYjNJb0oxdHVZVzFsUFZ3aVpHRjBaVjkwYjF3aVhTY3BPMXh5WEc1Y2NseHVJQ0FnSUM4dklOQzQwTDNRdU5HRzBMalFzTkM3MExqUXQ5Q3cwWWJRdU5HUElOR0IwTDdSZ2RHQzBMN1JqOUM5MExqUXVWeHlYRzRnSUNBZ2RHaHBjeTV5WVc1blpWSmxjMlYwS0NrN1hISmNibHh5WEc0Z0lDQWdMeThnMFlEUXRkQzkwTFRRdGRHQVhISmNiaUFnSUNCMGFHbHpMbDl6Wld4bFkzUkVZWFJsS0hSb2FYTXViM0IwYVc5dWN5NXRhVzVFWVhSbEtUdGNjbHh1SUNBZ0lIUm9hWE11WHlSamIyNTBZV2x1WlhJdVlYQndaVzVrUTJocGJHUW9kR2hwY3k1ZkpIQnBZMnRsY2lrN1hISmNibHh5WEc0Z0lDQWdMeThnMEw3UXNkR0EwTERRc2RDKzBZTFF1dEN3SU5DeDBZRFF0ZEM1MExyUXY5QyswTGpRdmRHQzBMN1FzbHh5WEc0Z0lDQWdhV1lnS0U5aWFtVmpkQzVyWlhsektIUm9hWE11YjNCMGFXOXVjeTVpY21WaGEzQnZhVzUwY3lrdWJHVnVaM1JvS1NCN1hISmNiaUFnSUNBZ0lDQWdkMmx1Wkc5M0xtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0ozSmxjMmw2WlNjc0lIUm9hWE11WDI5dVYybHVaRzkzVW1WemFYcGxSWFpsYm5RdVltbHVaQ2gwYUdsektTazdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZiMjVYYVc1a2IzZFNaWE5wZW1WRmRtVnVkQ2dwTzF4eVhHNGdJQ0FnZlZ4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSjNRc05DMzBMTFFzTkM5MExqUXRTRFF2TkMxMFlIUmo5R0cwTEJjY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ29nUUhKbGRIVnliaUI3VTNSeWFXNW5mVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSTmIyNTBhRVp2Y20xaGRIUmxaQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJR052Ym5OMElIUnBkR3hsSUQwZ2RHaHBjeTVuWlhSRVlYUmxWR2x0WlVadmNtMWhkQ2hrWVhSbExDQjdiVzl1ZEdnNklDZHNiMjVuSjMwcE8xeHlYRzRnSUNBZ2NtVjBkWEp1SUhScGRHeGxMbk5zYVdObEtEQXNJREVwTG5SdlZYQndaWEpEWVhObEtDa2dLeUIwYVhSc1pTNXpiR2xqWlNneEtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DazBMN1JnTkM4MExEUmd0QzQwWURRdnRDeTBMRFF2ZEM0MExVZzBMVFFzTkdDMFlzZzBMVFF1OUdQSU5HQzBMWFF1dEdEMFluUXRkQzVJTkM3MEw3UXV0Q3cwTHZRdUZ4eVhHNGdLaUJBY0dGeVlXMGdJSHRFWVhSbGZTQWdJR1JoZEdVZ0lDQWcwSjdRc2RHSzBMWFF1dEdDSU5DMDBMRFJndEdMWEhKY2JpQXFJRUJ3WVhKaGJTQWdlMDlpYW1WamRIMGdiM0IwYVc5dWN5RFFuOUN3MFlEUXNOQzgwTFhSZ3RHQTBZdGNjbHh1SUNvZ1FISmxkSFZ5YmlCN1UzUnlhVzVuZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1blpYUkVZWFJsVkdsdFpVWnZjbTFoZENBOUlHWjFibU4wYVc5dUtHUmhkR1VzSUc5d2RHbHZibk1wSUh0Y2NseHVJQ0FnSUhKbGRIVnliaUJKYm5Sc0xrUmhkR1ZVYVcxbFJtOXliV0YwS0hSb2FYTXViM0IwYVc5dWN5NXNiMk5oYkdVc0lHOXdkR2x2Ym5NcExtWnZjbTFoZENoa1lYUmxLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ1UwTDNRdUNEUXZkQzEwTFRRdGRDNzBMaGNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVaMlYwVjJWbGEwUmhlWE5HYjNKdFlYUjBaV1FnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lHTnZibk4wSUdSaGRHVWdQU0J1WlhjZ1JHRjBaU2dwTzF4eVhHNGdJQ0FnWTI5dWMzUWdjbVZ6ZFd4MElEMGdXMTA3WEhKY2JseHlYRzRnSUNBZ1pHRjBaUzV6WlhSRVlYUmxLR1JoZEdVdVoyVjBSR0YwWlNncElDMGdNaWs3WEhKY2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SURjN0lDc3JhU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHUmhkR1V1YzJWMFJHRjBaU2hrWVhSbExtZGxkRVJoZEdVb0tTQXJJREVwTzF4eVhHNGdJQ0FnSUNBZ0lISmxjM1ZzZEM1d2RYTm9LSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdaR0Y1T2lCa1lYUmxMbWRsZEVSaGVTZ3BMRnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhWFJzWlRvZ2RHaHBjeTVuWlhSRVlYUmxWR2x0WlVadmNtMWhkQ2hrWVhSbExDQjdkMlZsYTJSaGVUb2dKM05vYjNKMEozMHBMRnh5WEc0Z0lDQWdJQ0FnSUgwcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5HQjBMN1JnTkdDMExqUmdOQyswTExRdXRDd0lOR0IwTDdRczlDNzBMRFJnZEM5MEw0ZzBMM1FzTkdCMFlMUmdOQyswTFhRdmRDOTBMN1F2TkdESU5DLzBMWFJnTkN5MEw3UXZOR0RJTkMwMEwzUmppRFF2ZEMxMExUUXRkQzcwTGhjY2x4dUlDQWdJSEpsYzNWc2RDNXpiM0owS0NoaExDQmlLU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1ptbHljM1JFWVhsUFpsUm9aVmRsWldzZ1BTQjBhR2x6TG05d2RHbHZibk11Wm1seWMzUkVZWGxQWmxSb1pWZGxaV3NnSlNBM08xeHlYRzRnSUNBZ0lDQWdJR3hsZENCa1lYbEJJRDBnWVM1a1lYazdYSEpjYmlBZ0lDQWdJQ0FnYkdWMElHUmhlVUlnUFNCaUxtUmhlVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdhV1lnS0dSaGVVRWdQVDBnWm1seWMzUkVZWGxQWmxSb1pWZGxaV3NwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQzB4TzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLR1JoZVVJZ1BUMGdabWx5YzNSRVlYbFBabFJvWlZkbFpXc3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlERTdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb1pHRjVRU0E4SUdacGNuTjBSR0Y1VDJaVWFHVlhaV1ZyS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGVVRWdLejBnY21WemRXeDBMbXhsYm1kMGFEdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJR2xtSUNoa1lYbENJRHdnWm1seWMzUkVZWGxQWmxSb1pWZGxaV3NwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWkdGNVFpQXJQU0J5WlhOMWJIUXViR1Z1WjNSb08xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHUmhlVUVnTFNCa1lYbENPMXh5WEc0Z0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ2NtVjBkWEp1SUhKbGMzVnNkRHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2EwTDdRdTlDNDBZZlF0ZEdCMFlMUXN0QytJTkMwMEwzUXRkQzVJTkN5SU5DODBMWFJnZEdQMFliUXRWeHlYRzRnS2lCQWNHRnlZVzBnSUh0RVlYUmxmU0JrWVhSbElOQ2UwTEhSaXRDMTBMclJnaURRdE5DdzBZTFJpMXh5WEc0Z0tpQkFjbVYwZFhKdUlIdE9kVzFpWlhKOUlDQWdJTkNhMEw3UXU5QzQwWWZRdGRHQjBZTFFzdEMrSU5DMDBMM1F0ZEM1WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG1kbGRFUmhlWE5EYjNWdWRFbHVUVzl1ZEdnZ1BTQm1kVzVqZEdsdmJpaGtZWFJsS1NCN1hISmNiaUFnSUNCamIyNXpkQ0JrWVhseklEMGdibVYzSUVSaGRHVW9aR0YwWlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ1pHRjVjeTV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVJQ0FnSUdSaGVYTXVjMlYwVFc5dWRHZ29aR0Y1Y3k1blpYUk5iMjUwYUNncElDc2dNU2s3WEhKY2JpQWdJQ0JrWVhsekxuTmxkRVJoZEdVb01DazdYSEpjYmlBZ0lDQnlaWFIxY200Z1pHRjVjeTVuWlhSRVlYUmxLQ2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvZEN4MFlEUXZ0R0JJTkN5MFl2UXROQzEwTHZRdGRDOTBMM1JpOUdGSU5DMDBMRFJnbHh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzV5WVc1blpWSmxjMlYwSUQwZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGSmxjMlYwS0NrN1hISmNiaUFnSUNCMGFHbHpMbDl6Wld4bFkzUnBiMjRnUFNCN2ZUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DUzBZdlF0TkMxMEx2UXRkQzkwTGpRdFNEUXROQzQwTERRdjlDdzBMZlF2dEM5MExBZzBMVFFzTkdDWEhKY2JpQXFJRUJ3WVhKaGJTQjdSR0YwWlgwZ1pHRjBaVjltY205dElOQ2QwTERSaDlDdzBMdlJqTkM5MExEUmp5RFF0TkN3MFlMUXNGeHlYRzRnS2lCQWNHRnlZVzBnZTBSaGRHVjlJR1JoZEdWZmRHOGdJQ0RRbXRDKzBMM1F0ZEdIMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbkpoYm1kbFUyVnNaV04wSUQwZ1puVnVZM1JwYjI0b1pHRjBaVjltY205dExDQmtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQmtZWFJsWDJaeWIyMHVjMlYwU0c5MWNuTW9NQ3dnTUN3Z01Dd2dNQ2s3WEhKY2JpQWdJQ0JrWVhSbFgzUnZMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkMwMEw3UXY5R0QwWUhSZ3RDNDBMelJpOUM1SU5DMDBMalFzTkMvMExEUXQ5QyswTDFjY2x4dUlDQWdJR2xtSUNnaGRHaHBjeTVuWlhSSmMxSmhibWRsVTJWc1pXTjBZV0pzWlNoa1lYUmxYMlp5YjIwc0lHUmhkR1ZmZEc4cEtTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdOdmJuTjBJQ1JrWVhsZlpuSnZiU0E5SUhSb2FYTXVYeVJuWlhSRVlYbENlVVJoZEdVb1pHRjBaVjltY205dEtUdGNjbHh1SUNBZ0lHTnZibk4wSUNSa1lYbGZkRzhnUFNCMGFHbHpMbDhrWjJWMFJHRjVRbmxFWVhSbEtHUmhkR1ZmZEc4cE8xeHlYRzVjY2x4dUlDQWdJR2xtSUNna1pHRjVYMlp5YjIwcElIdGNjbHh1SUNBZ0lDQWdJQ0FrWkdGNVgyWnliMjB1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRabkp2YlNjcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJR2xtSUNna1pHRjVYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdKR1JoZVY5MGJ5NWpiR0Z6YzB4cGMzUXVZV1JrS0NkcGN5MXpaV3hsWTNSbFpDY3NJQ2RwY3kxelpXeGxZM1JsWkMxMGJ5Y3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQ3kwWXZRdE5DMTBMdlF0ZEM5MExqUXRTRFJqZEM3MExYUXZOQzEwTDNSZ3RDKzBMSmNjbHh1SUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wS0dSaGRHVmZabkp2YlN3Z1pHRjBaVjkwYnlrN1hISmNibHh5WEc0Z0lDQWdMeThnMExMUmk5Q3gwTDdSZ0NEUXROQ3cwWUlnMExJZzBMN1FzZEdBMExEUmd0QzkwTDdRdkNEUXY5QyswWURSajlDMDBMclF0Vnh5WEc0Z0lDQWdhV1lnS0dSaGRHVmZabkp2YlNBK0lHUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0JiWkdGMFpWOW1jbTl0TENCa1lYUmxYM1J2WFNBOUlGdGtZWFJsWDNSdkxDQmtZWFJsWDJaeWIyMWRPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQyswTEhRdmRDKzBMTFF1OUMxMEwzUXVOQzFJTkM0MEwzUXY5R0QwWUxRdnRDeVhISmNiaUFnSUNCcFppQW9kR2hwY3k1ZkpHbHVjSFYwUm5KdmJTa2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYeVJwYm5CMWRFWnliMjB1ZG1Gc2RXVWdQU0IwYUdsekxtWnZjbTFoZEVSaGRHVW9aR0YwWlY5bWNtOXRLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCcFppQW9kR2hwY3k1ZkpHbHVjSFYwVkc4cElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOGthVzV3ZFhSVWJ5NTJZV3gxWlNBOUlIUm9hWE11Wm05eWJXRjBSR0YwWlNoa1lYUmxYM1J2S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURSZ2RDKzBMSFJpOUdDMExqUXRWeHlYRzRnSUNBZ2RHaHBjeTVmWTJGc2JHSmhZMnNvSjNKaGJtZGxVMlZzWldOMEp5d2daR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2swTDdSZ05DODBMRFJndEM0MFlEUXZ0Q3kwTERRdmRDNDBMVWcwTFRRc05HQzBZdGNjbHh1SUNvZ1FIQmhjbUZ0SUNCN1JHRjBaWDBnSUNCa1lYUmxJQ0FnMEo3UXNkR0swTFhRdXRHQ0lOQzAwTERSZ3RHTFhISmNiaUFxSUVCd1lYSmhiU0FnZTFOMGNtbHVaMzBnWm05eWJXRjBJTkNrMEw3UmdOQzgwTERSZ2lEUmdkR0MwWURRdnRDNjBMaGNjbHh1SUNvZ1FISmxkSFZ5YmlCN1UzUnlhVzVuZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1bWIzSnRZWFJFWVhSbElEMGdablZ1WTNScGIyNG9aR0YwWlN3Z1ptOXliV0YwSUQwZ0oxa3RiUzFrSnlrZ2UxeHlYRzRnSUNBZ2NtVjBkWEp1SUdadmNtMWhkQzV5WlhCc1lXTmxLQ2RaSnl3Z1pHRjBaUzVuWlhSR2RXeHNXV1ZoY2lncEtWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzV5WlhCc1lXTmxLQ2R0Snl3Z0tDY3dKeUFySUNoa1lYUmxMbWRsZEUxdmJuUm9LQ2tnS3lBeEtTa3VjMnhwWTJVb0xUSXBLVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM1eVpYQnNZV05sS0Nka0p5d2dLQ2N3SnlBcklDaGtZWFJsTG1kbGRFUmhkR1VvS1NrcExuTnNhV05sS0MweUtTazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW45R0EwTDdRc3RDMTBZRFF1dEN3SU5DeTBMN1F0OUM4MEw3UXR0QzkwTDdSZ2RHQzBMZ2cwTExSaTlDMDBMWFF1OUMxMEwzUXVOR1BJTkMwMExEUmdseHlYRzRnS2lCQWNHRnlZVzBnSUh0RVlYUmxJR1JoZEdWZlpuSnZiU0RRbmRDdzBZZlFzTkM3MFl6UXZkQ3cwWThnMExUUXNOR0MwTEJjY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlNCa1lYUmxYM1J2SUNBZzBKclF2dEM5MExYUmg5QzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdLaUJBY21WMGRYSnVJSHRDYjI5c1pXRnVmVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSSmMxSmhibWRsVTJWc1pXTjBZV0pzWlNBOUlHWjFibU4wYVc5dUtHUmhkR1ZmWm5KdmJTd2daR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdaR0YwWlY5bWNtOXRMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNGdJQ0FnWkdGMFpWOTBieTV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVYSEpjYmlBZ0lDQnBaaUFvWkdGMFpWOW1jbTl0SUQ0Z1pHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJRnRrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzlkSUQwZ1cyUmhkR1ZmZEc4c0lHUmhkR1ZmWm5KdmJWMDdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBMelF1TkM5MExqUXZOQ3cwTHZSak5DOTBZdlF1U0RRdE5DNDBMRFF2OUN3MExmUXZ0QzlYSEpjYmlBZ0lDQmpiMjV6ZENCa2FXWm1JRDBnVFdGMGFDNWhZbk1vWkdGMFpWOW1jbTl0TG1kbGRGUnBiV1VvS1NBdElHUmhkR1ZmZEc4dVoyVjBWR2x0WlNncEtTQXZJREV3TURBZ0x5QTROalF3TUR0Y2NseHVJQ0FnSUdsbUlDaGthV1ptSUR3Z2RHaHBjeTV2Y0hScGIyNXpMbTFwYmtSaGVYTXBJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBML1JnTkMrMExMUXRkR0EwTHJRc0NEUXY5QyswTC9Rc05DMDBMRFF2ZEM0MFk4ZzBMSWcwTFRRdU5DdzBML1FzTkMzMEw3UXZTRFF0OUN3MExIUXU5QyswTHJRdU5HQTBMN1FzdEN3MEwzUXZkR0wwWVVnMExUUXNOR0NYSEpjYmlBZ0lDQmpiMjV6ZENCa1lYa2dQU0J1WlhjZ1JHRjBaU2dwTzF4eVhHNGdJQ0FnWkdGNUxuTmxkRlJwYldVb1pHRjBaVjltY205dExtZGxkRlJwYldVb0tTazdYSEpjYmx4eVhHNGdJQ0FnZDJocGJHVWdLR1JoZVNBOElHUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTVuWlhSRVlYbE1iMk5yWldRb1pHRjVLU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQmtZWGt1YzJWMFJHRjBaU2hrWVhrdVoyVjBSR0YwWlNncElDc2dNU2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2NtVjBkWEp1SUhSeWRXVTdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW45R0EwTDdRc3RDMTBZRFF1dEN3SU5DOTBMQWcwTFRRdnRHQjBZTFJnOUMvMEwzUXZ0R0IwWUxSakNEUXROQzkwWThnMExUUXU5R1BJTkN4MFlEUXZ0QzkwTGhjY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbE5DdzBZTFFzRnh5WEc0Z0tpQkFjbVYwZFhKdUlIdENiMjlzWldGdWZTQWdJSFJ5ZFdVZzBMWFJnZEM3MExnZzBMVFF2dEdCMFlMUmc5Qy8wTFhRdlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1blpYUkVZWGxNYjJOclpXUWdQU0JtZFc1amRHbHZiaWhrWVhSbEtTQjdYSEpjYmlBZ0lDQXZMeURRc3RHTDBMSFF2dEdBSU5DMDBMRFJnaURRc3RDOTBMVWcwTFRRdnRHQjBZTFJnOUMvMEwzUXZ0Q3owTDRnMExUUXVOQ3cwTC9Rc05DMzBMN1F2ZEN3WEhKY2JpQWdJQ0JwWmlBb1pHRjBaU0E4SUhSb2FYTXViM0IwYVc5dWN5NXRhVzVFWVhSbElIeDhJR1JoZEdVZ1BpQjBhR2x6TG05d2RHbHZibk11YldGNFJHRjBaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCTVQwTkxYMVZPUVZaQlNVeEJRa3hGTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbTl3ZEdsdmJuTXVabWxzZEdWeUxteHZZMnRFWVhsekxtTmhiR3dvZEdocGN5d2daR0YwWlNrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRb2RDNjBMdlF2dEM5MExYUXZkQzQwTFVnS0RFZzBMSFF2dEN4MFpIUmdDd2dNaURRc2RDKzBMSFJnTkN3TENBMUlOQ3gwTDdRc2RHQTBMN1FzaWxjY2x4dUlDb2dRSEJoY21GdElDQjdUblZ0WW1WeWZTQjJZV3gxWlNEUW10QyswTHZRdU5HSDBMWFJnZEdDMExMUXZseHlYRzRnS2lCQWNHRnlZVzBnSUh0QmNuSmhlWDBnSUdadmNtMXpJTkNjMExEUmdkR0IwTGpRc2lEUXVOQzNJRFBSaFNEUmpkQzcwTFhRdk5DMTBMM1JndEMrMExJc0lOQzgwTDdRdHRDMTBZSWcwWUhRdnRDMDBMWFJnTkMyMExEUmd0R01JTkdCMEwvUXRkR0cwTGpSaE5DNDBMclFzTkdDMEw3UmdDQWxaQ0RRdE5DNzBZOGcwTGZRc05DODBMWFF2ZEdMWEhKY2JpQXFJRUJ5WlhSMWNtNGdlMU4wY21sdVozMWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVjR3gxY21Gc0lEMGdablZ1WTNScGIyNGdLSFpoYkhWbExDQm1iM0p0Y3lrZ2UxeHlYRzRnSUNBZ2NtVjBkWEp1SUNoMllXeDFaU0FsSURFd0lEMDlJREVnSmlZZ2RtRnNkV1VnSlNBeE1EQWdJVDBnTVRFZ1B5Qm1iM0p0YzFzd1hTQTZJQ2gyWVd4MVpTQWxJREV3SUQ0OUlESWdKaVlnZG1Gc2RXVWdKU0F4TUNBOFBTQTBJQ1ltSUNoMllXeDFaU0FsSURFd01DQThJREV3SUh4OElIWmhiSFZsSUNVZ01UQXdJRDQ5SURJd0tTQS9JR1p2Y20xeld6RmRJRG9nWm05eWJYTmJNbDBwS1M1eVpYQnNZV05sS0NjbFpDY3NJSFpoYkhWbEtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DZzBMWFF2ZEMwMExYUmdDRFF0TkM0MExEUXY5Q3cwTGZRdnRDOTBMQWcwTHpRdGRHQjBZL1JodEMxMExKY2NseHVJQ29nUUhCaGNtRnRJSHRFWVhSbGZTQmtZWFJsWDJaeWIyMGcwSjNRc05HSDBMRFF1OUdNMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDhrWTNKbFlYUmxUVzl1ZEdoeklEMGdablZ1WTNScGIyNG9aR0YwWlY5bWNtOXRLU0I3WEhKY2JpQWdJQ0IzYUdsc1pTQW9kR2hwY3k1ZkpHMXZiblJvY3k1c1lYTjBSV3hsYldWdWRFTm9hV3hrS1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZkpHMXZiblJvY3k1eVpXMXZkbVZEYUdsc1pDaDBhR2x6TGw4a2JXOXVkR2h6TG14aGMzUkZiR1Z0Wlc1MFEyaHBiR1FwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkMvMFlEUmo5R0gwTFhRdkNEUXY5QyswTFRSZ2RDNjBMRFF0OUM2MFlOY2NseHVJQ0FnSUhSb2FYTXVYM1J2YjJ4MGFYQklhV1JsS0NrN1hISmNibHh5WEc0Z0lDQWdMeThnMEwvUmdOQzEwWURRdGRDOTBMVFF0ZEdBSU5DODBMWFJnZEdQMFliUXRkQ3lYSEpjYmlBZ0lDQmpiMjV6ZENCamRYSnlaVzUwUkdGMFpTQTlJRzVsZHlCRVlYUmxLR1JoZEdWZlpuSnZiUzVuWlhSVWFXMWxLQ2twTzF4eVhHNGdJQ0FnWTI5dWMzUWdKRzF2Ym5Sb2N5QTlJRnRkTzF4eVhHNGdJQ0FnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCMGFHbHpMbTl3ZEdsdmJuTXViVzl1ZEdoelEyOTFiblE3SUNzcmFTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNSdGIyNTBhSE11Y0hWemFDaDBhR2x6TGw4a1kzSmxZWFJsVFc5dWRHZ29ZM1Z5Y21WdWRFUmhkR1VwS1R0Y2NseHVJQ0FnSUNBZ0lDQmpkWEp5Wlc1MFJHRjBaUzV6WlhSTmIyNTBhQ2hqZFhKeVpXNTBSR0YwWlM1blpYUk5iMjUwYUNncElDc2dNU2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwWURRdGRDOTBMVFF0ZEdBWEhKY2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUNSdGIyNTBhSE11YkdWdVozUm9PeUJwSUNzOUlIUm9hWE11YjNCMGFXOXVjeTV3WlhKU2IzY3BJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0FrY205M0lEMGdaRzlqZFcxbGJuUXVZM0psWVhSbFJXeGxiV1Z1ZENnblpHbDJKeWs3WEhKY2JpQWdJQ0FnSUNBZ0pISnZkeTVqYkdGemMwNWhiV1VnUFNBblJHRjBaWEpoYm1kbGNHbGphMlZ5WDE5eWIzY25PMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWtiVzl1ZEdoekxuTnNhV05sS0drc0lHa2dLeUIwYUdsekxtOXdkR2x2Ym5NdWNHVnlVbTkzS1M1bWIzSkZZV05vS0NSdGIyNTBhQ0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNSeWIzY3VZWEJ3Wlc1a1EyaHBiR1FvSkcxdmJuUm9LVHRjY2x4dUlDQWdJQ0FnSUNCOUtUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmSkcxdmJuUm9jeTVoY0hCbGJtUkRhR2xzWkNna2NtOTNLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCcFppQW9kR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTQjhmQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMHNJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktUdGNjbHh1SUNBZ0lIMWNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DZzBMWFF2ZEMwMExYUmdDRFF2TkMxMFlIUmo5R0cwTEJjY2x4dUlDb2dRSEJoY21GdElIdEVZWFJsZlNCa1lYUmxJTkNjMExYUmdkR1AwWVpjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WHlSamNtVmhkR1ZOYjI1MGFDQTlJR1oxYm1OMGFXOXVLR1JoZEdVcElIdGNjbHh1SUNBZ0lHTnZibk4wSUdOMWNuSmxiblJOYjI1MGFDQTlJR1JoZEdVdVoyVjBUVzl1ZEdnb0tUdGNjbHh1SUNBZ0lHTnZibk4wSUcxdmJuUm9WR2wwYkdVZ1BTQjBhR2x6TG1kbGRFMXZiblJvUm05eWJXRjBkR1ZrS0dSaGRHVXBPMXh5WEc0Z0lDQWdZMjl1YzNRZ2QyVmxhMFJoZVhNZ1BTQjBhR2x6TG1kbGRGZGxaV3RFWVhselJtOXliV0YwZEdWa0tDazdYSEpjYmx4eVhHNGdJQ0FnWTI5dWMzUWdKRzF2Ym5Sb0lEMGdkR2hwY3k1ZkpHTnlaV0YwWlVWc1pXMWxiblFvWEhKY2JpQWdJQ0FnSUNBZ1lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGd2lJR1JoZEdFdGRHbHRaVDFjSWlSN1pHRjBaUzVuWlhSVWFXMWxLQ2w5WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUY5ZmFHVmhaR1Z5WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpVFc5dWRHaGZYMkZ5Y205M0lFMXZiblJvWDE5aGNuSnZkeTB0Y0hKbGRpUjdLSFJvYVhNdWIzQjBhVzl1Y3k1dGFXNUVZWFJsSUNZbUlHUmhkR1VnUEQwZ2RHaHBjeTV2Y0hScGIyNXpMbTFwYmtSaGRHVXBJRDhnSnlCcGN5MWthWE5oWW14bFpDY2dPaUFuSjMxY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzWm5JSGRwWkhSb1BWd2lPRndpSUdobGFXZG9kRDFjSWpFMFhDSWdkbWxsZDBKdmVEMWNJakFnTUNBNElERTBYQ0lnWm1sc2JEMWNJbTV2Ym1WY0lpQjRiV3h1Y3oxY0ltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6SXdNREF2YzNablhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh3WVhSb0lHUTlYQ0pOTnlBeE0wd3hJRGRNTnlBeFhDSWdjM1J5YjJ0bFBWd2lJemhET0VNNFExd2lJSE4wY205clpTMTNhV1IwYUQxY0lqSmNJaUJ6ZEhKdmEyVXRiR2x1WldOaGNEMWNJbkp2ZFc1a1hDSWdjM1J5YjJ0bExXeHBibVZxYjJsdVBWd2ljbTkxYm1SY0lqNDhMM0JoZEdnK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emRtYytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM005WENKTmIyNTBhRjlmZEdsMGJHVmNJajRrZTIxdmJuUm9WR2wwYkdWOUlDUjdaR0YwWlM1blpYUkdkV3hzV1dWaGNpZ3BmVHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjejFjSWsxdmJuUm9YMTloY25KdmR5Qk5iMjUwYUY5ZllYSnliM2N0TFc1bGVIUWtleWgwYUdsekxtOXdkR2x2Ym5NdWJXRjRSR0YwWlNBbUppQmtZWFJsSUQ0OUlIUm9hWE11YjNCMGFXOXVjeTV0WVhoRVlYUmxLU0EvSUNjZ2FYTXRaR2x6WVdKc1pXUW5JRG9nSnlkOVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjJaeUIzYVdSMGFEMWNJamhjSWlCb1pXbG5hSFE5WENJeE5Gd2lJSFpwWlhkQ2IzZzlYQ0l3SURBZ09DQXhORndpSUdacGJHdzlYQ0p1YjI1bFhDSWdlRzFzYm5NOVhDSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMloxd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4Y0dGMGFDQmtQVndpVFRFZ01DNDVPVGs1T1RsTU55QTNUREVnTVROY0lpQnpkSEp2YTJVOVhDSWpPRU00UXpoRFhDSWdjM1J5YjJ0bExYZHBaSFJvUFZ3aU1sd2lJSE4wY205clpTMXNhVzVsWTJGd1BWd2ljbTkxYm1SY0lpQnpkSEp2YTJVdGJHbHVaV3B2YVc0OVhDSnliM1Z1WkZ3aVBqd3ZjR0YwYUQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDNOMlp6NWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjejFjSWsxdmJuUm9YMTkzWldWclhDSStKSHQzWldWclJHRjVjeTV0WVhBb2FYUmxiU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGOWZkMlZsYTJSaGVWd2lQaVI3YVhSbGJTNTBhWFJzWlgwOEwyUnBkajVnWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDBwTG1wdmFXNG9KeWNwZlR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpVFc5dWRHaGZYMlJoZVhOY0lqNDhMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQThMMlJwZGo1Z1hISmNiaUFnSUNBcE8xeHlYRzVjY2x4dUlDQWdJQzh2SU5HQjBZTFJnTkMxMEx2UXV0QzRYSEpjYmlBZ0lDQmJYSEpjYmlBZ0lDQWdJQ0FnZTNObGJHVmpkRzl5T2lBbkxrMXZiblJvWDE5aGNuSnZkeTB0Y0hKbGRpY3NJRzVoYldVNklDZHdjbVYySjMwc1hISmNiaUFnSUNBZ0lDQWdlM05sYkdWamRHOXlPaUFuTGsxdmJuUm9YMTloY25KdmR5MHRibVY0ZENjc0lHNWhiV1U2SUNkdVpYaDBKMzBzWEhKY2JpQWdJQ0JkTG1admNrVmhZMmdvYVhSbGJTQTlQaUI3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnSkdGeWNtOTNJRDBnSkcxdmJuUm9MbkYxWlhKNVUyVnNaV04wYjNJb2FYUmxiUzV6Wld4bFkzUnZjaWs3WEhKY2JpQWdJQ0FnSUNBZ0pHRnljbTkzTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJOc2FXTnJKeXdnWlNBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11WDI5dVFYSnliM2REYkdsamF5Z2tZWEp5YjNjc0lHbDBaVzB1Ym1GdFpTazdYSEpjYmlBZ0lDQWdJQ0FnZlNrN1hISmNiaUFnSUNCOUtUdGNjbHh1WEhKY2JpQWdJQ0F2THlEUmdOQzEwTDNRdE5DMTBZQWcwTFRRdmRDMTBMbGNjbHh1SUNBZ0lHTnZibk4wSUNSa1lYbHpJRDBnSkcxdmJuUm9MbkYxWlhKNVUyVnNaV04wYjNJb0p5NU5iMjUwYUY5ZlpHRjVjeWNwTzF4eVhHNGdJQ0FnWTI5dWMzUWdaR0Y1Y3lBOUlHNWxkeUJFWVhSbEtHUmhkR1V1WjJWMFZHbHRaU2dwS1R0Y2NseHVJQ0FnSUdSaGVYTXVjMlYwUkdGMFpTZ3hLVHRjY2x4dUlDQWdJR1JoZVhNdWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmx4eVhHNGdJQ0FnZDJocGJHVWdLR1JoZVhNdVoyVjBUVzl1ZEdnb0tTQTlQU0JqZFhKeVpXNTBUVzl1ZEdncElIdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQWtkMlZsYXlBOUlIUm9hWE11WHlSamNtVmhkR1ZYWldWcktDazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lIZGxaV3RFWVhsekxtWnZja1ZoWTJnb2FYUmxiU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaGtZWGx6TG1kbGRFUmhlU2dwSUNFOUlHbDBaVzB1WkdGNUlIeDhJR1JoZVhNdVoyVjBUVzl1ZEdnb0tTQWhQU0JqZFhKeVpXNTBUVzl1ZEdncElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ1IzWldWckxtRndjR1Z1WkVOb2FXeGtLSFJvYVhNdVh5UmpjbVZoZEdWRmJYQjBlVVJoZVNncEtUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJqdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdKSGRsWldzdVlYQndaVzVrUTJocGJHUW9kR2hwY3k1ZkpHTnlaV0YwWlVSaGVTaGtZWGx6S1NrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGVYTXVjMlYwUkdGMFpTaGtZWGx6TG1kbGRFUmhkR1VvS1NBcklERXBPMXh5WEc0Z0lDQWdJQ0FnSUgwcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBa1pHRjVjeTVoY0hCbGJtUkRhR2xzWkNna2QyVmxheWs3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2NtVjBkWEp1SUNSdGIyNTBhRHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2EwTHZRdU5DNklOQy8wTDRnMFlIUmd0R0EwTFhRdTlDNjBMVWcwTC9RdGRHQTBMWFF1dEM3MFk3Umg5QzEwTDNRdU5HUElOQzgwTFhSZ2RHUDBZYlFzRnh5WEc0Z0tpQkFjR0Z5WVcwZ2UwVnNaVzFsYm5SOUlDUmhjbkp2ZHlCSVZFMU1JTkdOMEx2UXRkQzgwTFhRdmRHQ1hISmNiaUFxSUVCd1lYSmhiU0I3VTNSeWFXNW5mU0J1WVcxbElDQWdJTkNZMEx6Ump5QW9jSEpsZGl3Z2JtVjRkQ2xjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDI5dVFYSnliM2REYkdsamF5QTlJR1oxYm1OMGFXOXVLQ1JoY25KdmR5d2dibUZ0WlNrZ2UxeHlYRzRnSUNBZ2FXWWdLQ1JoY25KdmR5NWpiR0Z6YzB4cGMzUXVZMjl1ZEdGcGJuTW9KMmx6TFdScGMyRmliR1ZrSnlrcElIdGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdZMjl1YzNRZ1pHRjBaU0E5SUc1bGR5QkVZWFJsS0hCaGNuTmxTVzUwS0hSb2FYTXVYeVJ0YjI1MGFITXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxrMXZiblJvSnlrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcE8xeHlYRzRnSUNBZ1pHRjBaUzV6WlhSTmIyNTBhQ2hrWVhSbExtZGxkRTF2Ym5Sb0tDa2dLeUFvYm1GdFpTQTlQU0FuY0hKbGRpY2dQeUF0ZEdocGN5NXZjSFJwYjI1ekxtMXZiblJvYzBOdmRXNTBJRG9nZEdocGN5NXZjSFJwYjI1ekxtMXZiblJvYzBOdmRXNTBLU2s3WEhKY2JseHlYRzRnSUNBZ0x5OGcwTExSaTlHRjBMN1F0Q0RRdDlDd0lOQy8wWURRdGRDMDBMWFF1OUdMSU5DODBMalF2ZEM0MEx6UXNOQzcwWXpRdmRDKzBMa2cwTFRRc05HQzBZdGNjbHh1SUNBZ0lHbG1JQ2hrWVhSbElEd2dkR2hwY3k1dmNIUnBiMjV6TG0xcGJrUmhkR1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQmtZWFJsTG5ObGRGUnBiV1VvZEdocGN5NXZjSFJwYjI1ekxtMXBia1JoZEdVdVoyVjBWR2x0WlNncEtUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUXN0R0wwWVhRdnRDMElOQzMwTEFnMEwvUmdOQzEwTFRRdGRDNzBZc2cwTHpRc05DNjBZSFF1TkM4MExEUXU5R00wTDNRdnRDNUlOQzAwTERSZ3RHTFhISmNiaUFnSUNCcFppQW9kR2hwY3k1dmNIUnBiMjV6TG0xaGVFUmhkR1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCbGJtUkVZWFJsSUQwZ2JtVjNJRVJoZEdVb1pHRjBaUzVuWlhSVWFXMWxLQ2twTzF4eVhHNGdJQ0FnSUNBZ0lHVnVaRVJoZEdVdWMyVjBUVzl1ZEdnb1pXNWtSR0YwWlM1blpYUk5iMjUwYUNncElDc2dkR2hwY3k1dmNIUnBiMjV6TG0xdmJuUm9jME52ZFc1MEtUdGNjbHh1SUNBZ0lDQWdJQ0JwWmlBb1pXNWtSR0YwWlNBK0lIUm9hWE11YjNCMGFXOXVjeTV0WVhoRVlYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR1JoZEdVdWMyVjBWR2x0WlNoMGFHbHpMbTl3ZEdsdmJuTXViV0Y0UkdGMFpTNW5aWFJVYVcxbEtDa3BPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmtZWFJsTG5ObGRFMXZiblJvS0dSaGRHVXVaMlYwVFc5dWRHZ29LU0F0SUhSb2FYTXViM0IwYVc5dWN5NXRiMjUwYUhORGIzVnVkQ0FySURFcE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFF2OUMxMFlEUXRkR0YwTDdRdENEUXVpRFF2ZEMrMExMUXZ0QzVJTkMwMExEUmd0QzFYSEpjYmlBZ0lDQjBhR2x6TGw5elpXeGxZM1JFWVhSbEtHUmhkR1VwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwS1BSZ2RHQzBMRFF2ZEMrMExMUXV0Q3dJTkdDMExYUXV0R0QwWW5RdGRDNUlOQzAwTERSZ3RHTElOR0JJTkdBMExYUXZkQzAwTFhSZ05DKzBMeGNjbHh1SUNvZ1FIQmhjbUZ0SUh0RVlYUmxmU0JrWVhSbElOQ1UwTERSZ3RDd1hISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOXpaV3hsWTNSRVlYUmxJRDBnWm5WdVkzUnBiMjRvWkdGMFpTa2dlMXh5WEc0Z0lDQWdkR2hwY3k1ZmMyVnNaV04wWldSRVlYUmxJRDBnWkdGMFpUdGNjbHh1SUNBZ0lIUm9hWE11WHlSamNtVmhkR1ZOYjI1MGFITW9aR0YwWlNrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRb05DMTBMM1F0TkMxMFlBZzBMM1F0ZEMwMExYUXU5QzRYSEpjYmlBcUlFQndZWEpoYlNBZ2UwUmhkR1Y5SUdSaGRHVWcwSjdRc2RHSzBMWFF1dEdDSU5DMDBMRFJndEdMWEhKY2JpQXFJRUJ5WlhSMWNtNGdlMFZzWlcxbGJuUjlYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDhrWTNKbFlYUmxWMlZsYXlBOUlHWjFibU4wYVc5dUtHUmhkR1VwSUh0Y2NseHVJQ0FnSUdOdmJuTjBJQ1IzWldWcklEMGdkR2hwY3k1ZkpHTnlaV0YwWlVWc1pXMWxiblFvWEhKY2JpQWdJQ0FnSUNBZ1lEeGthWFlnWTJ4aGMzTTlYQ0pYWldWclhDSStQQzlrYVhZK1lGeHlYRzRnSUNBZ0tUdGNjbHh1WEhKY2JpQWdJQ0J5WlhSMWNtNGdKSGRsWldzN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRb05DMTBMM1F0TkMxMFlBZzBMVFF2ZEdQWEhKY2JpQXFJRUJ3WVhKaGJTQWdlMFJoZEdWOUlHUmhkR1VnMEo3UXNkR0swTFhRdXRHQ0lOQzAwTERSZ3RHTFhISmNiaUFxSUVCeVpYUjFjbTRnZTBWc1pXMWxiblI5WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw4a1kzSmxZWFJsUkdGNUlEMGdablZ1WTNScGIyNG9aR0YwWlNrZ2UxeHlYRzRnSUNBZ1kyOXVjM1FnSkdSaGVTQTlJSFJvYVhNdVh5UmpjbVZoZEdWRmJHVnRaVzUwS0Z4eVhHNGdJQ0FnSUNBZ0lHQThaR2wySUdOc1lYTnpQVndpUkdGNVhDSWdaR0YwWVMxMGFXMWxQVndpSkh0a1lYUmxMbWRsZEZScGJXVW9LWDFjSWlCa1lYUmhMV1JoZVQxY0lpUjdaR0YwWlM1blpYUkVZWGtvS1gxY0lqNGtlMlJoZEdVdVoyVjBSR0YwWlNncGZUd3ZaR2wyUG1CY2NseHVJQ0FnSUNrN1hISmNibHh5WEc0Z0lDQWdKR1JoZVM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkamJHbGpheWNzSUhSb2FYTXVYMjl1UkdGNVEyeHBZMnRGZG1WdWRDNWlhVzVrS0hSb2FYTXBLVHRjY2x4dVhISmNiaUFnSUNCcFppQW9JWFJvYVhNdWIzQjBhVzl1Y3k1emFXNW5iR1ZOYjJSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSkdSaGVTNWhaR1JGZG1WdWRFeHBjM1JsYm1WeUtDZHRiM1Z6WldWdWRHVnlKeXdnZEdocGN5NWZiMjVFWVhsTmIzVnpaVVZ1ZEdWeVJYWmxiblF1WW1sdVpDaDBhR2x6S1NrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMEw3UXNkQzkwTDdRc3RDNzBMWFF2ZEM0MExVZzBZSFF2dEdCMFlMUXZ0R1AwTDNRdU5DNVhISmNiaUFnSUNCMGFHbHpMbDkxY0dSaGRHVkVZWGtvSkdSaGVTazdYSEpjYmx4eVhHNGdJQ0FnY21WMGRYSnVJQ1JrWVhrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRbnRDeDBMM1F2dEN5MEx2UXRkQzkwTGpRdFNEUmdkQyswWUhSZ3RDKzBZL1F2ZEM0MExsY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdWRYQmtZWFJsSUQwZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjBhR2x6TGw4a2JXOXVkR2h6TG5GMVpYSjVVMlZzWldOMGIzSkJiR3dvSnk1TmIyNTBhQ2NwTG1admNrVmhZMmdvSkcxdmJuUm9JRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw5MWNHUmhkR1ZOYjI1MGFDZ2tiVzl1ZEdncE8xeHlYRzRnSUNBZ2ZTazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW50Q3gwTDNRdnRDeTBMdlF0ZEM5MExqUXRTRFJnZEMrMFlIUmd0QyswWS9RdmRDNDBMa2cwTHpRdGRHQjBZL1JodEN3WEhKY2JpQXFJRUJ3WVhKaGJTQjdSV3hsYldWdWRIMGdKRzF2Ym5Sb0lOQ3QwTHZRdGRDODBMWFF2ZEdDSU5DODBMWFJnZEdQMFliUXNGeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZkWEJrWVhSbFRXOXVkR2dnUFNCbWRXNWpkR2x2Ymlna2JXOXVkR2dwSUh0Y2NseHVJQ0FnSUNSdGIyNTBhQzV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2N1UkdGNVcyUmhkR0V0ZEdsdFpWMG5LUzVtYjNKRllXTm9LQ1JrWVhrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM1Z3WkdGMFpVUmhlU2drWkdGNUtUdGNjbHh1SUNBZ0lIMHBPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKN1FzZEM5MEw3UXN0QzcwTFhRdmRDNDBMVWcwWUhRdnRHQjBZTFF2dEdQMEwzUXVOQzVJTkMwMEwzUmoxeHlYRzRnS2lCQWNHRnlZVzBnZTBWc1pXMWxiblI5SUNSa1lYa2cwSzNRdTlDMTBMelF0ZEM5MFlJZzBMVFF2ZEdQWEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw5MWNHUmhkR1ZFWVhrZ1BTQm1kVzVqZEdsdmJpZ2taR0Y1S1NCN1hISmNiaUFnSUNCamIyNXpkQ0JrWVhSbElDQWdQU0J1WlhjZ1JHRjBaU2h3WVhKelpVbHVkQ2drWkdGNUxtUmhkR0Z6WlhRdWRHbHRaU3dnTVRBcEtUdGNjbHh1SUNBZ0lHTnZibk4wSUd4dlkydGxaQ0E5SUhSb2FYTXVaMlYwUkdGNVRHOWphMlZrS0dSaGRHVXBPMXh5WEc0Z0lDQWdZMjl1YzNRZ2RHOWtZWGtnSUQwZ2RHaHBjeTVmZEc5a1lYa3VaMlYwVkdsdFpTZ3BJRDA5SUdSaGRHVXVaMlYwVkdsdFpTZ3BPMXh5WEc1Y2NseHVJQ0FnSUNSa1lYa3VZMnhoYzNOTWFYTjBMblJ2WjJkc1pTZ25hWE10WkdsellXSnNaV1FuTENCc2IyTnJaV1FwTzF4eVhHNGdJQ0FnSkdSaGVTNWpiR0Z6YzB4cGMzUXVkRzluWjJ4bEtDZHBjeTFzYjJOclpXUW5MQ0JzYjJOclpXUWdQVDBnVEU5RFMxOU1UME5MUlVRcE8xeHlYRzRnSUNBZ0pHUmhlUzVqYkdGemMweHBjM1F1ZEc5bloyeGxLQ2RwY3kxMGIyUmhlU2NzSUhSdlpHRjVLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2gwTDdRc2RHTDBZTFF1TkMxSU5DNjBMdlF1TkM2MExBZzBML1F2aURRdE5DOTBZNWNjbHh1SUNvZ1FIQmhjbUZ0SUh0RmRtVnVkSDBnWlNCRVQwMGcwWUhRdnRDeDBZdlJndEM0MExWY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgyOXVSR0Y1UTJ4cFkydEZkbVZ1ZENBOUlHWjFibU4wYVc5dUtHVXBJSHRjY2x4dUlDQWdJSFJvYVhNdVgyOXVSR0Y1UTJ4cFkyc29aUzUwWVhKblpYUXBPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLSFF2dEN4MFl2Umd0QzQwTFVnMFlYUXZ0Q3kwTFhSZ05Dd1hISmNiaUFxSUVCd1lYSmhiU0I3UlhabGJuUjlJR1VnUkU5TklOR0IwTDdRc2RHTDBZTFF1TkMxWEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw5dmJrUmhlVTF2ZFhObFJXNTBaWEpGZG1WdWRDQTlJR1oxYm1OMGFXOXVLR1VwSUh0Y2NseHVJQ0FnSUhSb2FYTXVYMjl1UkdGNVRXOTFjMlZGYm5SbGNpaGxMblJoY21kbGRDazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUXBkQyswTExRdGRHQUlOQzkwTEFnMFkzUXU5QzEwTHpRdGRDOTBZTFF0U0RRdE5DOTBZOWNjbHh1SUNvZ1FIQmhjbUZ0SUh0RmJHVnRaVzUwZlNBa1pHRjVJRWhVVFV3ZzBLM1F1OUMxMEx6UXRkQzkwWUpjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDI5dVJHRjVUVzkxYzJWRmJuUmxjaUE5SUdaMWJtTjBhVzl1S0NSa1lYa3BJSHRjY2x4dUlDQWdJR2xtSUNnaGRHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlNCOGZDQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJqdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JwWmlBb0pHUmhlUzVrWVhSaGMyVjBMblJwYldVZ1BUMGdkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTNW5aWFJVYVcxbEtDa3BJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ1kyOXVjM1FnWkdGMFpWOTBieUE5SUc1bGR5QkVZWFJsS0hCaGNuTmxTVzUwS0NSa1lYa3VaR0YwWVhObGRDNTBhVzFsTENBeE1Da3BPMXh5WEc0Z0lDQWdkR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFRaV3hsWTNRb2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlN3Z1pHRjBaVjkwYnlrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRbXRDNzBMalF1aURRdjlDK0lOQzAwTDNSamx4eVhHNGdLaUJBY0dGeVlXMGdlMFZzWlcxbGJuUjlJQ1JrWVhrZ1NGUk5UQ0RRcmRDNzBMWFF2TkMxMEwzUmdseHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZiMjVFWVhsRGJHbGpheUE5SUdaMWJtTjBhVzl1S0NSa1lYa3BJSHRjY2x4dUlDQWdJQzh2SU5DMDBMWFF2ZEdNSU5DMzBMRFFzZEM3MEw3UXV0QzQwWURRdnRDeTBMRFF2Vnh5WEc0Z0lDQWdhV1lnS0NSa1lYa3VZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RwY3kxa2FYTmhZbXhsWkNjcEtTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5DeTBZdlFzZEMrMFlBZzBMN1F0TkM5MEw3UXVTRFF0TkN3MFlMUmkxeHlYRzRnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1emFXNW5iR1ZOYjJSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NXlZVzVuWlZKbGMyVjBLQ2s3WEhKY2JpQWdJQ0FnSUNBZ0pHUmhlUzVqYkdGemMweHBjM1F1WVdSa0tDZHBjeTF6Wld4bFkzUmxaQ2NwTzF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDJOaGJHeGlZV05yS0Nka1lYbFRaV3hsWTNRbkxDQnVaWGNnUkdGMFpTaHdZWEp6WlVsdWRDZ2taR0Y1TG1SaGRHRnpaWFF1ZEdsdFpTd2dNVEFwS1NrN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5HQjBMSFJnTkMrMFlFZzBMTFJpOUN4MFlEUXNOQzkwTDNRdnRDejBMNGcwWURRc05DOTBMWFF0U0RRdE5DNDBMRFF2OUN3MExmUXZ0QzkwTEJjY2x4dUlDQWdJR2xtSUNoMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0SUNZbUlIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1eVlXNW5aVkpsYzJWMEtDazdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSkdSaGVTNWpiR0Z6YzB4cGMzUXVZV1JrS0NkcGN5MXpaV3hsWTNSbFpDY3BPMXh5WEc1Y2NseHVJQ0FnSUM4dklOQ3kwWXZRc2RHQTBMRFF2ZEN3SU5DOTBMRFJoOUN3MEx2UmpOQzkwTERSanlBdklOQzYwTDdRdmRDMTBZZlF2ZEN3MFk4ZzBMVFFzTkdDMExCY2NseHVJQ0FnSUdsbUlDZ2hkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTa2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBnUFNCdVpYY2dSR0YwWlNod1lYSnpaVWx1ZENna1pHRjVMbVJoZEdGelpYUXVkR2x0WlN3Z01UQXBLVHRjY2x4dUlDQWdJSDBnWld4elpTQnBaaUFvSVhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhnUFNCdVpYY2dSR0YwWlNod1lYSnpaVWx1ZENna1pHRjVMbVJoZEdGelpYUXVkR2x0WlN3Z01UQXBLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCcFppQW9kR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTQW1KaUIwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUM4dklOQzAwTDdRdjlHRDBZSFJndEM0MEx6Umk5QzVJTkMwMExqUXNOQy8wTERRdDlDKzBMMWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb0lYUm9hWE11WjJWMFNYTlNZVzVuWlZObGJHVmpkR0ZpYkdVb2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlN3Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVjbUZ1WjJWU1pYTmxkQ2dwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNDdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxuSmhibWRsVTJWc1pXTjBLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMHNJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktUdGNjbHh1SUNBZ0lIMWNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DUzBMalF0OUdEMExEUXU5R00wTDNSaTlDNUlOR0IwTEhSZ05DKzBZRWcwTExSaTlDMDBMWFF1OUMxMEwzUXZkR0wwWVVnMExUUXNOR0NYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDl5WVc1blpWWnBjM1ZoYkZKbGMyVjBJRDBnWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNCamIyNXpkQ0FrWkdGNWN5QTlJSFJvYVhNdVh5UnRiMjUwYUhNdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNnbkxrUmhlVnRrWVhSaExYUnBiV1ZkSnlrN1hISmNiaUFnSUNBa1pHRjVjeTVtYjNKRllXTm9LQ1JrWVhrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNSa1lYa3VZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRabkp2YlNjc0lDZHBjeTF6Wld4bFkzUmxaQzEwYnljc0lDZHBjeTF6Wld4bFkzUmxaQzFpWlhSM1pXVnVKeWs3WEhKY2JpQWdJQ0I5S1R0Y2NseHVYSEpjYmlBZ0lDQXZMeURRdjlHQTBZL1JoOUMxMEx3ZzBML1F2dEMwMFlIUXV0Q3cwTGZRdXRHRFhISmNiaUFnSUNCMGFHbHpMbDkwYjI5c2RHbHdTR2xrWlNncE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEpMUXVOQzMwWVBRc05DNzBZelF2ZEMrMExVZzBMTFJpOUMwMExYUXU5QzEwTDNRdU5DMUlOQzAwTERSZ2x4eVhHNGdLaUJBY0dGeVlXMGdlMFJoZEdWOUlHUmhkR1ZmWm5KdmJTRFFuZEN3MFlmUXNOQzcwWXpRdmRDdzBZOGcwTFRRc05HQzBMQmNjbHh1SUNvZ1FIQmhjbUZ0SUh0RVlYUmxmU0JrWVhSbFgzUnZJQ0FnMEpyUXZ0QzkwTFhSaDlDOTBMRFJqeURRdE5DdzBZTFFzRnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1FnUFNCbWRXNWpkR2x2Ymloa1lYUmxYMlp5YjIwc0lHUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lHbG1JQ2hrWVhSbFgyWnliMjBnSmlZZ1pHRjBaVjltY205dElHbHVjM1JoYm1ObGIyWWdSR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJR1JoZEdWZlpuSnZiUzV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvWkdGMFpWOTBieUFtSmlCa1lYUmxYM1J2SUdsdWMzUmhibU5sYjJZZ1JHRjBaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHUmhkR1ZmZEc4dWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnYkdWMElIUnBiV1ZmWm5KdmJTQTlJR1JoZEdWZlpuSnZiU0JwYm5OMFlXNWpaVzltSUVSaGRHVWdQeUJrWVhSbFgyWnliMjB1WjJWMFZHbHRaU2dwSURvZ01EdGNjbHh1SUNBZ0lHeGxkQ0IwYVcxbFgzUnZJRDBnWkdGMFpWOTBieUJwYm5OMFlXNWpaVzltSUVSaGRHVWdQeUJrWVhSbFgzUnZMbWRsZEZScGJXVW9LU0E2SURBN1hISmNiaUFnSUNCcFppQW9kR2x0WlY5bWNtOXRJRDRnZEdsdFpWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lGdDBhVzFsWDJaeWIyMHNJSFJwYldWZmRHOWRJRDBnVzNScGJXVmZkRzhzSUhScGJXVmZabkp2YlYwN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeThnMExMUmk5QzAwTFhRdTlDMTBMM1F1TkMxSU5DMDBMRFJnaURRdk5DMTBMYlF0TkdESU5DOTBMRFJoOUN3MEx2UmpOQzkwTDdRdVNEUXVDRFF1dEMrMEwzUXRkR0gwTDNRdnRDNVhISmNiaUFnSUNCamIyNXpkQ0FrWkdGNWN5QTlJSFJvYVhNdVh5UnRiMjUwYUhNdWNYVmxjbmxUWld4bFkzUnZja0ZzYkNnbkxrUmhlVnRrWVhSaExYUnBiV1ZkSnlrN1hISmNiaUFnSUNCbWIzSWdLR3hsZENCcElEMGdNRHNnYVNBOElDUmtZWGx6TG14bGJtZDBhRHNnS3l0cEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSkdSaGVYTmJhVjB1WTJ4aGMzTk1hWE4wTG5SdloyZHNaU2duYVhNdGMyVnNaV04wWldRdFltVjBkMlZsYmljc0lDUmtZWGx6VzJsZExtUmhkR0Z6WlhRdWRHbHRaU0ErSUhScGJXVmZabkp2YlNBbUppQWtaR0Y1YzF0cFhTNWtZWFJoYzJWMExuUnBiV1VnUENCMGFXMWxYM1J2S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURRc3RHTDBMVFF0ZEM3MExYUXZkQzQwTFVnMEwzUXNOR0gwTERRdTlHTTBMM1F2dEM1SU5DNElOQzYwTDdRdmRDMTBZZlF2ZEMrMExrZzBML1F2dEMzMExqUmh0QzQwTGhjY2x4dUlDQWdJR052Ym5OMElDUmtZWGxmWm5KdmJTQTlJSFJvYVhNdVh5Um5aWFJFWVhsQ2VVUmhkR1VvWkdGMFpWOW1jbTl0S1R0Y2NseHVJQ0FnSUdOdmJuTjBJQ1JrWVhsZmRHOGdQU0IwYUdsekxsOGtaMlYwUkdGNVFubEVZWFJsS0dSaGRHVmZkRzhwTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkM2MExYUmlDRFF0TkM3MFk4ZzBMSFJpOUdCMFlMUmdOQyswTFBRdmlEUmdkQ3gwWURRdnRHQjBMQWcwWUhSZ3RDdzBZRFF2dEN6MEw0ZzBMTFJpOUMwMExYUXU5QzEwTDNRdU5HUFhISmNiaUFnSUNCcFppQW9kR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFRaV3hsWTNRdUpHUmhlVjltY205dFgyOXNaQ0FtSmlCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQzRrWkdGNVgyWnliMjFmYjJ4a0lDRTlJQ1JrWVhsZlpuSnZiU2tnZTF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wTGlSa1lYbGZabkp2YlY5dmJHUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRabkp2YlNjcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5DNjBMWFJpQ0RRdE5DNzBZOGcwTEhSaTlHQjBZTFJnTkMrMExQUXZpRFJnZEN4MFlEUXZ0R0IwTEFnMFlIUmd0Q3cwWURRdnRDejBMNGcwTExSaTlDMDBMWFF1OUMxMEwzUXVOR1BYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUXVKR1JoZVY5MGIxOXZiR1FnSmlZZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1F1SkdSaGVWOTBiMTl2YkdRZ0lUMGdKR1JoZVY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBMaVJrWVhsZmRHOWZiMnhrTG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJsekxYTmxiR1ZqZEdWa0p5d2dKMmx6TFhObGJHVmpkR1ZrTFhSdkp5azdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnYVdZZ0tDUmtZWGxmWm5KdmJTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNSa1lYbGZabkp2YlM1amJHRnpjMHhwYzNRdVlXUmtLQ2RwY3kxelpXeGxZM1JsWkNjc0lDZHBjeTF6Wld4bFkzUmxaQzFtY205dEp5azdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnYVdZZ0tDUmtZWGxmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0FrWkdGNVgzUnZMbU5zWVhOelRHbHpkQzVoWkdRb0oybHpMWE5sYkdWamRHVmtKeXdnSjJsekxYTmxiR1ZqZEdWa0xYUnZKeWs3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwWUhRdnRHRjBZRFFzTkM5MExYUXZkQzQwTFVnMExJZzBMclF0ZEdJWEhKY2JpQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDNGtaR0Y1WDJaeWIyMWZiMnhrSUQwZ0pHUmhlVjltY205dE8xeHlYRzRnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1F1SkdSaGVWOTBiMTl2YkdRZ1BTQWtaR0Y1WDNSdk8xeHlYRzVjY2x4dUlDQWdJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNGtaR0Y1WDJaeWIyMGdQU0FrWkdGNVgyWnliMjA3WEhKY2JpQWdJQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVKR1JoZVY5MGJ5QTlJQ1JrWVhsZmRHODdYSEpjYmx4eVhHNGdJQ0FnYVdZZ0tDUmtZWGxmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQmtZWGx6SUQwZ1RXRjBhQzVtYkc5dmNpaE5ZWFJvTG1GaWN5aDBhVzFsWDJaeWIyMGdMU0IwYVcxbFgzUnZLU0F2SURnMk5EQXdaVE1wSUNzZ01UdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOTBiMjlzZEdsd1UyaHZkeWdrWkdGNVgzUnZMQ0JrWVhsektUdGNjbHh1SUNBZ0lIMWNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DZjBMN1F1dEN3MExjZzBML1F2dEMwMFlIUXV0Q3cwTGZRdXRDNFhISmNiaUFxSUVCd1lYSmhiU0I3Uld4bGJXVnVkSDBnSkdSaGVTRFFrdEdMMExIUmdOQ3cwTDNRdmRHTDBMa2cwTFRRdGRDOTBZeGNjbHh1SUNvZ1FIQmhjbUZ0SUh0T2RXMWlaWEo5SUNCa1lYbHpJTkNhMEw3UXU5QzQwWWZRdGRHQjBZTFFzdEMrSU5DMDBMM1F0ZEM1WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw5MGIyOXNkR2x3VTJodmR5QTlJR1oxYm1OMGFXOXVLQ1JrWVhrc0lHUmhlWE1wSUh0Y2NseHVJQ0FnSUhSb2FYTXVYeVIwYjI5c2RHbHdMblJsZUhSRGIyNTBaVzUwSUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVpwYkhSbGNpNTBiMjlzZEdsd1ZHVjRkQzVqWVd4c0tIUm9hWE1zSUdSaGVYTXBJSHg4SUNjbk8xeHlYRzRnSUNBZ2RHaHBjeTVmSkhSdmIyeDBhWEF1WTJ4aGMzTk1hWE4wTG5SdloyZHNaU2duYVhNdGMyaHZkeWNzSUhSb2FYTXVYeVIwYjI5c2RHbHdMblJsZUhSRGIyNTBaVzUwTG14bGJtZDBhQ2s3WEhKY2JpQWdJQ0IwYUdsekxsOTBiMjlzZEdsd1ZYQmtZWFJsS0NSa1lYa3BPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKN1FzZEM5MEw3UXN0QzcwTFhRdmRDNDBMVWcwTC9RdnRDMzBMalJodEM0MExnZzBML1F2dEMwMFlIUXV0Q3cwTGZRdXRDNFhISmNiaUFxSUVCd1lYSmhiU0I3Uld4bGJXVnVkSDBnSkdSaGVTRFFrdEdMMExIUmdOQ3cwTDNRdmRHTDBMa2cwTFRRdGRDOTBZeGNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYM1J2YjJ4MGFYQlZjR1JoZEdVZ1BTQm1kVzVqZEdsdmJpZ2taR0Y1S1NCN1hISmNiaUFnSUNCamIyNXpkQ0J5WldOMElEMGdKR1JoZVM1blpYUkNiM1Z1WkdsdVowTnNhV1Z1ZEZKbFkzUW9LVHRjY2x4dUlDQWdJSFJvYVhNdVh5UjBiMjlzZEdsd0xuTjBlV3hsTG5SdmNDQTlJRTFoZEdndWNtOTFibVFvY21WamRDNTBiM0FnS3lCM2FXNWtiM2N1YzJOeWIyeHNXU0F0SUhKbFkzUXVhR1ZwWjJoMElDMGdkR2hwY3k1ZkpIUnZiMngwYVhBdWIyWm1jMlYwU0dWcFoyaDBLU0FySUNkd2VDYzdYSEpjYmlBZ0lDQjBhR2x6TGw4a2RHOXZiSFJwY0M1emRIbHNaUzVzWldaMElEMGdUV0YwYUM1eWIzVnVaQ2h5WldOMExteGxablFnS3lCM2FXNWtiM2N1YzJOeWIyeHNXQ0FySUhKbFkzUXVkMmxrZEdnZ0x5QXlJQzBnZEdocGN5NWZKSFJ2YjJ4MGFYQXViMlptYzJWMFYybGtkR2dnTHlBeUtTQXJJQ2R3ZUNjN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRb2RDNjBZRFJpOUdDMFl3ZzBML1F2dEMwMFlIUXV0Q3cwTGZRdXRHRFhISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOTBiMjlzZEdsd1NHbGtaU0E5SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ2RHaHBjeTVmSkhSdmIyeDBhWEF1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYVhNdGMyaHZkeWNwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwS0xRdGRDNjBZSFJnaURRdjlDKzBMVFJnZEM2MExEUXQ5QzYwTGdnMEwvUXZpRFJnOUM4MEw3UXU5R0gwTERRdmRDNDBZNWNjbHh1SUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNCa1lYbHpJTkNhMEw3UXU5QzQwWWZRdGRHQjBZTFFzdEMrSU5DMDBMM1F0ZEM1WEhKY2JpQXFJRUJ5WlhSMWNtNGdlMU4wY21sdVozMWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYMlpwYkhSbGNsUnZiMngwYVhCVVpYaDBJRDBnWm5WdVkzUnBiMjRvWkdGNWN5a2dlMXh5WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11Y0d4MWNtRnNLR1JoZVhNc0lGc25KV1FnMExUUXRkQzkwWXduTENBbkpXUWcwTFRRdmRHUEp5d2dKeVZrSU5DMDBMM1F0ZEM1SjEwcExuSmxjR3hoWTJVb0p5VmtKeXdnWkdGNWN5azdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUXBOQzQwTHZSak5HQzBZQWcwTDNRdGRDMDBMN1JnZEdDMFlQUXY5QzkwWXZSaFNEUXROQzkwTFhRdVNEUXY5QytJTkdEMEx6UXZ0QzcwWWZRc05DOTBMalJqbHh5WEc0Z0tpQkFjbVYwZFhKdUlIdENiMjlzWldGdWZWeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZabWxzZEdWeVRHOWphMFJoZVhNZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJQzh2SU5DeTBZSFF0U0RRdE5DOTBMZ2cwTFRRdnRHQjBZTFJnOUMvMEwzUmkxeHlYRzRnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBLSFF2dEN4MFl2Umd0QzQwTFVnMExqUXQ5QzgwTFhRdmRDMTBMM1F1TkdQSU5HQTBMRFF0OUM4MExYUmdOQyswTElnMEw3UXV0QzkwTEJjY2x4dUlDb2dRSEJoY21GdElIdEZkbVZ1ZEgwZ1pTQkVUMDBnMFlIUXZ0Q3gwWXZSZ3RDNDBMVmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYMjl1VjJsdVpHOTNVbVZ6YVhwbFJYWmxiblFnUFNCbWRXNWpkR2x2YmlobEtTQjdYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NWZjMlZzWldOMGFXOXVMaVJrWVhsZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDkwYjI5c2RHbHdWWEJrWVhSbEtIUm9hWE11WDNObGJHVmpkR2x2Ymk0a1pHRjVYM1J2S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnNaWFFnWW5KbFlXdHdiMmx1ZENBOUlEQTdYSEpjYmlBZ0lDQmpiMjV6ZENCaWNtVmhhM0J2YVc1MGN5QTlJRTlpYW1WamRDNXJaWGx6S0hSb2FYTXViM0IwYVc5dWN5NWljbVZoYTNCdmFXNTBjeWt1YzI5eWRDZ29ZU3dnWWlrZ1BUNGdZU0F0SUdJcE8xeHlYRzRnSUNBZ1ptOXlJQ2hzWlhRZ2FTQnBiaUJpY21WaGEzQnZhVzUwY3lrZ2UxeHlYRzRnSUNBZ0lDQWdJR2xtSUNoM2FXNWtiM2N1YVc1dVpYSlhhV1IwYUNBOFBTQmljbVZoYTNCdmFXNTBjMXRwWFNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCaWNtVmhhM0J2YVc1MElEMGdZbkpsWVd0d2IybHVkSE5iYVYwN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdKeVpXRnJPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQjBhR2x6TGw5elpYUkNjbVZoYTNCdmFXNTBLR0p5WldGcmNHOXBiblFwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwS1BSZ2RHQzBMRFF2ZEMrMExMUXV0Q3dJTkdCMEw3UmdkR0MwTDdSajlDOTBMalJqeURSZ05DMTBMM1F0TkMxMFlEUXNDRFF2OUMrMExRZzBZRFFzTkMzMEwzUmk5QzFJTkdOMExyUmdOQ3cwTDNSaTF4eVhHNGdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdZbkpsWVd0d2IybHVkQ0RRbXRDNzBZN1JoeURRdU5DM0lIUm9hWE11YjNCMGFXOXVjeTVpY21WaGEzQnZhVzUwY3lBbzBLalF1TkdBMExqUXZkQ3dJTkdOMExyUmdOQ3cwTDNRc0NsY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgzTmxkRUp5WldGcmNHOXBiblFnUFNCbWRXNWpkR2x2YmloaWNtVmhhM0J2YVc1MEtTQjdYSEpjYmlBZ0lDQXZMeURRdnRHQ0lOQzkwTFhRdmRHRDBMYlF2ZEMrMExrZzBML1F0ZEdBMExYUmdOQzQwWUhRdnRDeTBMclF1Rnh5WEc0Z0lDQWdhV1lnS0hSb2FYTXVYMkp5WldGcmNHOXBiblFnUFQwZ1luSmxZV3R3YjJsdWRDa2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJSDFjY2x4dUlDQWdJSFJvYVhNdVgySnlaV0ZyY0c5cGJuUWdQU0JpY21WaGEzQnZhVzUwTzF4eVhHNWNjbHh1SUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxtSnlaV0ZyY0c5cGJuUnpXMkp5WldGcmNHOXBiblJkS1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJRTlpYW1WamRDNWhjM05wWjI0b2RHaHBjeTV2Y0hScGIyNXpMQ0IwYUdsekxtOXdkR2x2Ym5NdVluSmxZV3R3YjJsdWRITmJZbkpsWVd0d2IybHVkRjBwTzF4eVhHNGdJQ0FnZEdocGN5NWZKR055WldGMFpVMXZiblJvY3loMGFHbHpMbDl6Wld4bFkzUmxaRVJoZEdVcE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEszUXU5QzEwTHpRdGRDOTBZSWcwTHJRc05DNzBMWFF2ZEMwMExEUmdOQzkwTDdRczlDK0lOQzAwTDNSajF4eVhHNGdLaUJBY0dGeVlXMGdJSHRFWVhSbGZTQmtZWFJsSU5DVTBMRFJndEN3WEhKY2JpQXFJRUJ5WlhSMWNtNGdlMFZzWlcxbGJuUjlJQ0FnU0ZSTlRDRFJqZEM3MExYUXZOQzEwTDNSZ2x4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZkpHZGxkRVJoZVVKNVJHRjBaU0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJR052Ym5OMElIUnBiV1VnUFNCa1lYUmxJR2x1YzNSaGJtTmxiMllnUkdGMFpTQS9JR1JoZEdVdVoyVjBWR2x0WlNncElEb2dNRHRjY2x4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TGw4a2JXOXVkR2h6TG5GMVpYSjVVMlZzWldOMGIzSW9KeTVFWVhsYlpHRjBZUzEwYVcxbFBWd2lKeUFySUhScGJXVWdLeUFuWENKZEp5azdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW9OQzEwTDNRdE5DMTBZQWcwTFRRdmRHUElDMGcwTGZRc05DejBMdlJnOUdJMExyUXVGeHlYRzRnS2lCQWNtVjBkWEp1SUh0RmJHVnRaVzUwZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1ZkpHTnlaV0YwWlVWdGNIUjVSR0Y1SUQwZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQmpiMjV6ZENBa1pHRjVJRDBnZEdocGN5NWZKR055WldGMFpVVnNaVzFsYm5Rb1hISmNiaUFnSUNBZ0lDQWdZRHhrYVhZZ1kyeGhjM005WENKRVlYa2dhWE10Wlcxd2RIbGNJajQ4TDJScGRqNWdYSEpjYmlBZ0lDQXBPMXh5WEc1Y2NseHVJQ0FnSUhKbGRIVnliaUFrWkdGNU8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtIUXZ0QzMwTFRRc05DOTBMalF0U0RSamRDNzBMWFF2TkMxMEwzUmd0Q3dJTkM0MExjZ1NGUk5UQ0RSZ3RDMTBMclJnZEdDMExCY2NseHVJQ29nUUhCaGNtRnRJQ0I3VTNSeWFXNW5mU0JvZEcxc0lFaFVUVXdnMFlMUXRkQzYwWUhSZ2x4eVhHNGdLaUJBY21WMGRYSnVJSHRGYkdWdFpXNTBmVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmSkdOeVpXRjBaVVZzWlcxbGJuUWdQU0JtZFc1amRHbHZiaWhvZEcxc0tTQjdYSEpjYmlBZ0lDQmpiMjV6ZENCa2FYWWdQU0JrYjJOMWJXVnVkQzVqY21WaGRHVkZiR1Z0Wlc1MEtDZGthWFluS1R0Y2NseHVJQ0FnSUdScGRpNXBibk5sY25SQlpHcGhZMlZ1ZEVoVVRVd29KMkZtZEdWeVltVm5hVzRuTENCb2RHMXNLVHRjY2x4dUlDQWdJSEpsZEhWeWJpQmthWFl1WTJocGJHUnlaVzR1YkdWdVozUm9JRDRnTVNBL0lHUnBkaTVqYUdsc1pISmxiaUE2SUdScGRpNW1hWEp6ZEVWc1pXMWxiblJEYUdsc1pEdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSUZOaFptVWcwTExSaTlDMzBMN1FzaURRc3RDOTBMWFJpTkM5MExqUmhTRFJnZEMrMExIUmk5R0MwTGpRdVNEUXV0QyswTHpRdjlDKzBMM1F0ZEM5MFlMUXNGeHlYRzRnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnWmlEUW1OQzgwWThnMFlIUXZ0Q3gwWXZSZ3RDNDBZOWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYMk5oYkd4aVlXTnJJRDBnWm5WdVkzUnBiMjRvWmlrZ2UxeHlYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQjBhR2x6TG05d2RHbHZibk11YjI1YlpsMGdQVDBnSjJaMWJtTjBhVzl1SnlrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG05d2RHbHZibk11YjI1YlpsMHVZWEJ3Ykhrb2RHaHBjeXdnVzEwdWMyeHBZMlV1WTJGc2JDaGhjbWQxYldWdWRITXNJREVwS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnlaWFIxY200N1hISmNibjFjY2x4dVhISmNibVY0Y0c5eWRDQmtaV1poZFd4MElFUmhkR1ZTWVc1blpWQnBZMnRsY2p0Y2NseHVJbDBzSW5OdmRYSmpaVkp2YjNRaU9pSWlmUT09IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCBEYXRlUmFuZ2VQaWNrZXIsIHtMT0NLX1VOQVZBSUxBQkxFLCBMT0NLX0xPQ0tFRH0gZnJvbSAnLi4vLi4vZGlzdC9kYXRlcmFuZ2VwaWNrZXInO1xyXG5cclxuY29uc3QgJGZvcm0gPSBkb2N1bWVudC5mb3Jtc1swXTtcclxuY29uc3QgJGRhdGVfZnJvbSA9ICRmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZGF0ZV9mcm9tXCJdJyk7XHJcbmNvbnN0ICRkYXRlX3RvICAgPSAkZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImRhdGVfdG9cIl0nKTtcclxuXHJcbi8vINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvQtSDQtNCw0YLRi1xyXG5jb25zdCBibG9ja2VkRGF0ZXMgPSB7fTtcclxuY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbmRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbmZvciAobGV0IGkgPSAwOyBpIDwgNjA7ICsraSkge1xyXG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjYpIHtcclxuICAgICAgICBibG9ja2VkRGF0ZXNbZGF0ZV0gPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7XHJcbn1cclxuXHJcbm5ldyBEYXRlUmFuZ2VQaWNrZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RhdGVyYW5nZXBpY2tlcicpLCB7XHJcbiAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpLFxyXG4gICAgbWF4RGF0ZTogbmV3IERhdGUoJzIwMjItMDUtMjAnKSxcclxuICAgIG1vbnRoc0NvdW50OiAyLFxyXG4gICAgcGVyUm93OiAzLFxyXG4gICAgc2luZ2xlTW9kZTogZmFsc2UsXHJcbiAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgIDk2MDoge1xyXG4gICAgICAgICAgICBtb250aHNDb3VudDogMTIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICA3MjA6IHtcclxuICAgICAgICAgICAgbW9udGhzQ291bnQ6IDMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICA0ODA6IHtcclxuICAgICAgICAgICAgbW9udGhzQ291bnQ6IDEsXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBvbjoge1xyXG4gICAgICAgIHJhbmdlU2VsZWN0OiBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgJGRhdGVfZnJvbS52YWx1ZSA9IGRhdGVfZnJvbS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICAgICAgJGRhdGVfdG8udmFsdWUgPSBkYXRlX3RvLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGF5U2VsZWN0OiBmdW5jdGlvbihkYXRlX2Zyb20pIHtcclxuICAgICAgICAgICAgJGRhdGVfZnJvbS52YWx1ZSA9IGRhdGVfZnJvbS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGZpbHRlcjoge1xyXG4gICAgICAgIGxvY2tEYXlzOiBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgICAgIGlmIChibG9ja2VkRGF0ZXNbZGF0ZV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBMT0NLX0xPQ0tFRDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG9vbHRpcFRleHQ6IGZ1bmN0aW9uKGRheXMpIHtcclxuICAgICAgICAgICAgY29uc3QgbmlnaHRzID0gZGF5cyAtIDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsdXJhbChuaWdodHMsIFsnJWQg0L3QvtGH0YwnLCAnJWQg0L3QvtGH0LgnLCAnJWQg0L3QvtGH0LXQuSddKS5yZXBsYWNlKCclZCcsIG5pZ2h0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==