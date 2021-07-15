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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9zY3NzL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOztVQ1ZBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDTztBQUNBOztBQUVQLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxrQkFBa0I7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLHNCQUFzQjtB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QUNBLFlBQVksT0FBTztBQUNuQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZLEtBQUs7QUFDakIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVksT0FBTztBQUNuQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLGVBQWUsRUFBQyIsImZpbGUiOiJkYXRlcmFuZ2VwaWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkRhdGVyYW5nZXBpY2tlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyDRgdC+0YHRgtC+0Y/QvdC40Y8g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9GFINC00LDRglxyXG5leHBvcnQgY29uc3QgTE9DS19VTkFWQUlMQUJMRSA9IDE7XHJcbmV4cG9ydCBjb25zdCBMT0NLX0xPQ0tFRCAgICAgID0gMjtcclxuXHJcbmZ1bmN0aW9uIERhdGVSYW5nZVBpY2tlcigkY29udGFpbmVyLCBvcHRpb25zID0ge30pIHtcclxuICAgIC8vINC+0YIg0L/QvtCy0YLQvtGA0L3QvtC5INC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4XHJcbiAgICBpZiAoJGNvbnRhaW5lci5pbnN0YW5jZSkge1xyXG4gICAgICAgIHJldHVybiAkY29udGFpbmVyLmluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgJGNvbnRhaW5lci5pbnN0YW5jZSA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5fJGNvbnRhaW5lciA9ICRjb250YWluZXI7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgIGZpcnN0RGF5T2ZUaGVXZWVrOiBvcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrIHx8IDEsICAgICAgICAgIC8vINC/0LXRgNCy0YvQuSDQtNC10L3RjCDQvdC10LTQtdC70LgsIDAgPSDQstGBLCAxID0g0L/QvSwgLi4uXHJcbiAgICAgICAgc2luZ2xlTW9kZTogICAgICAgIG9wdGlvbnMuc2luZ2xlTW9kZSAgICAgICAgfHwgZmFsc2UsICAgICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLINCy0LzQtdGB0YLQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBsb2NhbGU6ICAgICAgICAgICAgb3B0aW9ucy5sb2NhbGUgICAgICAgICAgICB8fCAncnUtUlUnLFxyXG4gICAgICAgIG1pbkRheXM6ICAgICAgICAgICBvcHRpb25zLm1pbkRheXMgICAgICAgICAgIHx8IDEsICAgICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LTQuNCw0L/QsNC30L7QvdC1XHJcbiAgICAgICAgbW9udGhzQ291bnQ6ICAgICAgIG9wdGlvbnMubW9udGhzQ291bnQgICAgICAgfHwgMTIsXHJcbiAgICAgICAgcGVyUm93OiAgICAgICAgICAgIG9wdGlvbnMucGVyUm93ICAgICAgICAgICAgfHwgdW5kZWZpbmVkLCAgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LzQtdGB0Y/RhtC10LIg0LIg0YDRj9C00YNcclxuICAgICAgICBtaW5EYXRlOiAgICAgICAgICAgb3B0aW9ucy5taW5EYXRlICAgICAgICAgICB8fCBuZXcgRGF0ZSgpLCAvLyDQvNC40L3QuNC80LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgICAgbWF4RGF0ZTogICAgICAgICAgIG9wdGlvbnMubWF4RGF0ZSAgICAgICAgICAgfHwgdW5kZWZpbmVkLFxyXG4gICAgICAgIGJyZWFrcG9pbnRzOiAgICAgICBvcHRpb25zLmJyZWFrcG9pbnRzICAgICAgIHx8IHt9LFxyXG4gICAgICAgIGludGVybmFsSW5wdXRzOiAgICBvcHRpb25zLmludGVybmFsSW5wdXRzICAgIHx8IHRydWUsICAgICAgIC8vINC40YHQv9C+0LvRjNC30L7QstCw0L3QuNC1INCy0YHRgtGA0L7QtdC90L3Ri9GFINC40L3Qv9GD0YLQvtCyXHJcbiAgICAgICAgLy8g0YHQvtCx0YvRgtC40Y9cclxuICAgICAgICBvbjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIHJhbmdlU2VsZWN0OiBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICAgICAgICBkYXlTZWxlY3Q6ICAgbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC+0LTQvdC+0Lkg0LTQsNGC0YsgKNGC0L7Qu9GM0LrQviDQv9GA0Lggc2luZ2xlTW9kZTogdHJ1ZSlcclxuICAgICAgICB9LCBvcHRpb25zLm9uIHx8IHt9KSxcclxuICAgICAgICAvLyDRhNC40LvRjNGC0YDRg9GO0YnQuNC1INC80LXRgtC+0LTRi1xyXG4gICAgICAgIGZpbHRlcjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIGxvY2tEYXlzOiAgICB0aGlzLl9maWx0ZXJMb2NrRGF5cywgICAgLy8gY2FsbGJhY2soZGF0ZSkg0YTRg9C90LrRhtC40Y8g0LHQu9C+0LrQuNGA0L7QstCw0L3QuNGPINC00LDRgiwgdHJ1ZS9MT0NLXHJcbiAgICAgICAgICAgIHRvb2x0aXBUZXh0OiB0aGlzLl9maWx0ZXJUb29sdGlwVGV4dCwgLy8gY2FsbGJhY2soZGF5cykg0LLRi9Cy0L7QtCDRgtC10LrRgdGC0LAg0L/QvtC00YHQutCw0LfQutC4XHJcbiAgICAgICAgfSwgb3B0aW9ucy5maWx0ZXIgfHwge30pLFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG4vKipcclxuICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0YDRj9C00L3QvtGB0YLRjFxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGVyUm93ID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnBlclJvdyA9IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMubWluRGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtC/0YbQuNC4INC00LvRjyDRjdC60YDQsNC90L7QsiDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW3RoaXMuX2JyZWFrcG9pbnQgPSAwXSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyk7XHJcblxyXG4gICAgLy8g0YLQtdC60YPRidC40Lkg0LTQtdC90YxcclxuICAgIHRoaXMuX3RvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIHRoaXMuX3RvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIHRoaXMuXyRwaWNrZXIgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlclwiPlxyXG4gICAgICAgICAgICAke3RoaXMub3B0aW9ucy5pbnRlcm5hbElucHV0cyA/XHJcbiAgICAgICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9faW5wdXRzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV9mcm9tXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiZGF0ZV90b1wiPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+YCA6ICcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXBcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXAtY29udGVudFwiPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGN0LvQtdC80LXQvdGC0YtcclxuICAgIHRoaXMuXyRtb250aHMgICAgICAgICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzJyk7XHJcbiAgICB0aGlzLl8kdG9vbHRpcCAgICAgICAgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5EYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXAnKTtcclxuICAgIHRoaXMuXyR0b29sdGlwQ29udGVudCA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcC1jb250ZW50Jyk7XHJcblxyXG4gICAgLy8g0L/QvtC70Y8g0LLQstC+0LTQsFxyXG4gICAgdGhpcy5fJGlucHV0RnJvbSA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignW25hbWU9XCJkYXRlX2Zyb21cIl0nKTtcclxuICAgIHRoaXMuXyRpbnB1dFRvICAgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZGF0ZV90b1wiXScpO1xyXG5cclxuICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICB0aGlzLl9zZWxlY3REYXRlKHRoaXMub3B0aW9ucy5taW5EYXRlKTtcclxuICAgIHRoaXMuXyRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fJHBpY2tlcik7XHJcblxyXG4gICAgLy8g0L7QsdGA0LDQsdC+0YLQutCwINCx0YDQtdC50LrQv9C+0LjQvdGC0L7QslxyXG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMub3B0aW9ucy5icmVha3BvaW50cykubGVuZ3RoKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uV2luZG93UmVzaXplRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5fb25XaW5kb3dSZXNpemVFdmVudCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0J3QsNC30LLQsNC90LjQtSDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRNb250aEZvcm1hdHRlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7bW9udGg6ICdsb25nJ30pO1xyXG4gICAgcmV0dXJuIHRpdGxlLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aXRsZS5zbGljZSgxKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0Ysg0LTQu9GPINGC0LXQutGD0YnQtdC5INC70L7QutCw0LvQuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyDQn9Cw0YDQsNC80LXRgtGA0YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXRlVGltZUZvcm1hdCA9IGZ1bmN0aW9uKGRhdGUsIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMub3B0aW9ucy5sb2NhbGUsIG9wdGlvbnMpLmZvcm1hdChkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCU0L3QuCDQvdC10LTQtdC70LhcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0V2Vla0RheXNGb3JtYXR0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gMik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7ICsraSkge1xyXG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgZGF5OiBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICB0aXRsZTogdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7d2Vla2RheTogJ3Nob3J0J30pLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINGB0L7Qs9C70LDRgdC90L4g0L3QsNGB0YLRgNC+0LXQvdC90L7QvNGDINC/0LXRgNCy0L7QvNGDINC00L3RjiDQvdC10LTQtdC70LhcclxuICAgIHJlc3VsdC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmlyc3REYXlPZlRoZVdlZWsgPSB0aGlzLm9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgJSA3O1xyXG4gICAgICAgIGxldCBkYXlBID0gYS5kYXk7XHJcbiAgICAgICAgbGV0IGRheUIgPSBiLmRheTtcclxuXHJcbiAgICAgICAgaWYgKGRheUEgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUIgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QSA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgIGRheUEgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlCIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgZGF5QiArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRheUEgLSBkYXlCO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC80LXRgdGP0YbQtVxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9ICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERheXNDb3VudEluTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRheXMuc2V0TW9udGgoZGF5cy5nZXRNb250aCgpICsgMSk7XHJcbiAgICBkYXlzLnNldERhdGUoMCk7XHJcbiAgICByZXR1cm4gZGF5cy5nZXREYXRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFJlc2V0KCk7XHJcbiAgICB0aGlzLl9zZWxlY3Rpb24gPSB7fTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0YvQtNC10LvQtdC90LjQtSDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnJhbmdlU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZShkYXRlX2Zyb20sIGRhdGVfdG8pKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0ICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcblxyXG4gICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LIg0L7QsdGA0LDRgtC90L7QvCDQv9C+0YDRj9C00LrQtVxyXG4gICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC+0LHQvdC+0LLQu9C10L3QuNC1INC40L3Qv9GD0YLQvtCyXHJcbiAgICBpZiAodGhpcy5fJGlucHV0RnJvbSkge1xyXG4gICAgICAgIHRoaXMuXyRpbnB1dEZyb20udmFsdWUgPSB0aGlzLmZvcm1hdERhdGUoZGF0ZV9mcm9tKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fJGlucHV0VG8pIHtcclxuICAgICAgICB0aGlzLl8kaW5wdXRUby52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0LHRi9GC0LjQtVxyXG4gICAgdGhpcy5fY2FsbGJhY2soJ3JhbmdlU2VsZWN0JywgZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0YtcclxuICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEBwYXJhbSAge1N0cmluZ30gZm9ybWF0INCk0L7RgNC80LDRgiDRgdGC0YDQvtC60LhcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5mb3JtYXREYXRlID0gZnVuY3Rpb24oZGF0ZSwgZm9ybWF0ID0gJ1ktbS1kJykge1xyXG4gICAgcmV0dXJuIGZvcm1hdC5yZXBsYWNlKCdZJywgZGF0ZS5nZXRGdWxsWWVhcigpKVxyXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdtJywgKCcwJyArIChkYXRlLmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpKVxyXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKCdkJywgKCcwJyArIChkYXRlLmdldERhdGUoKSkpLnNsaWNlKC0yKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0L7QstC10YDQutCwINCy0L7Qt9C80L7QttC90L7RgdGC0Lgg0LLRi9C00LXQu9C10L3QuNGPINC00LDRglxyXG4gKiBAcGFyYW0gIHtEYXRlIGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICogQHBhcmFtICB7RGF0ZSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRJc1JhbmdlU2VsZWN0YWJsZSA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoZGF0ZV9mcm9tLmdldFRpbWUoKSAtIGRhdGVfdG8uZ2V0VGltZSgpKSAvIDEwMDAgLyA4NjQwMDtcclxuICAgIGlmIChkaWZmIDwgdGhpcy5vcHRpb25zLm1pbkRheXMpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQv9C+0L/QsNC00LDQvdC40Y8g0LIg0LTQuNCw0L/QsNC30L7QvSDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbiAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgZGF5LnNldFRpbWUoZGF0ZV9mcm9tLmdldFRpbWUoKSk7XHJcblxyXG4gICAgd2hpbGUgKGRheSA8IGRhdGVfdG8pIHtcclxuICAgICAgICBpZiAodGhpcy5nZXREYXlMb2NrZWQoZGF5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkYXkuc2V0RGF0ZShkYXkuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9GA0L7QstC10YDQutCwINC90LAg0LTQvtGB0YLRg9C/0L3QvtGB0YLRjCDQtNC90Y8g0LTQu9GPINCx0YDQvtC90LhcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgIHRydWUg0LXRgdC70Lgg0LTQvtGB0YLRg9C/0LXQvVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXREYXlMb2NrZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQstC90LUg0LTQvtGB0YLRg9C/0L3QvtCz0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlIHx8IGRhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgIHJldHVybiBMT0NLX1VOQVZBSUxBQkxFO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmlsdGVyLmxvY2tEYXlzLmNhbGwodGhpcywgZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC60LvQvtC90LXQvdC40LUgKDEg0LHQvtCx0ZHRgCwgMiDQsdC+0LHRgNCwLCA1INCx0L7QsdGA0L7QsilcclxuICogQHBhcmFtICB7TnVtYmVyfSB2YWx1ZSDQmtC+0LvQuNGH0LXRgdGC0LLQvlxyXG4gKiBAcGFyYW0gIHtBcnJheX0gIGZvcm1zINCc0LDRgdGB0LjQsiDQuNC3IDPRhSDRjdC70LXQvNC10L3RgtC+0LIsINC80L7QttC10YIg0YHQvtC00LXRgNC20LDRgtGMINGB0L/QtdGG0LjRhNC40LrQsNGC0L7RgCAlZCDQtNC70Y8g0LfQsNC80LXQvdGLXHJcbiAqIEByZXR1cm4ge1N0cmluZ31cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucGx1cmFsID0gZnVuY3Rpb24gKHZhbHVlLCBmb3Jtcykge1xyXG4gICAgcmV0dXJuICh2YWx1ZSAlIDEwID09IDEgJiYgdmFsdWUgJSAxMDAgIT0gMTEgPyBmb3Jtc1swXSA6ICh2YWx1ZSAlIDEwID49IDIgJiYgdmFsdWUgJSAxMCA8PSA0ICYmICh2YWx1ZSAlIDEwMCA8IDEwIHx8IHZhbHVlICUgMTAwID49IDIwKSA/IGZvcm1zWzFdIDogZm9ybXNbMl0pKS5yZXBsYWNlKCclZCcsIHZhbHVlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC40LDQv9Cw0LfQvtC90LAg0LzQtdGB0Y/RhtC10LJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlTW9udGhzID0gZnVuY3Rpb24oZGF0ZV9mcm9tKSB7XHJcbiAgICB3aGlsZSAodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5yZW1vdmVDaGlsZCh0aGlzLl8kbW9udGhzLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgIHRoaXMuX3Rvb2x0aXBIaWRlKCk7XHJcblxyXG4gICAgLy8g0L/RgNC10YDQtdC90LTQtdGAINC80LXRgdGP0YbQtdCyXHJcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG4gICAgY29uc3QgJG1vbnRocyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7ICsraSkge1xyXG4gICAgICAgICRtb250aHMucHVzaCh0aGlzLl8kY3JlYXRlTW9udGgoY3VycmVudERhdGUpKTtcclxuICAgICAgICBjdXJyZW50RGF0ZS5zZXRNb250aChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRtb250aHMubGVuZ3RoOyBpICs9IHRoaXMub3B0aW9ucy5wZXJSb3cpIHtcclxuICAgICAgICBjb25zdCAkcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnRGF0ZXJhbmdlcGlja2VyX19yb3cnO1xyXG5cclxuICAgICAgICAkbW9udGhzLnNsaWNlKGksIGkgKyB0aGlzLm9wdGlvbnMucGVyUm93KS5mb3JFYWNoKCRtb250aCA9PiB7XHJcbiAgICAgICAgICAgICRyb3cuYXBwZW5kQ2hpbGQoJG1vbnRoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fJG1vbnRocy5hcHBlbmRDaGlsZCgkcm93KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlINCc0LXRgdGP0YZcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVNb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgIGNvbnN0IG1vbnRoVGl0bGUgPSB0aGlzLmdldE1vbnRoRm9ybWF0dGVkKGRhdGUpO1xyXG4gICAgY29uc3Qgd2Vla0RheXMgPSB0aGlzLmdldFdlZWtEYXlzRm9ybWF0dGVkKCk7XHJcblxyXG4gICAgY29uc3QgJG1vbnRoID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJNb250aFwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9faGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tcHJldiR7KHRoaXMub3B0aW9ucy5taW5EYXRlICYmIGRhdGUgPD0gdGhpcy5vcHRpb25zLm1pbkRhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNyAxM0wxIDdMNyAxXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fdGl0bGVcIj4ke21vbnRoVGl0bGV9ICR7ZGF0ZS5nZXRGdWxsWWVhcigpfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLW5leHQkeyh0aGlzLm9wdGlvbnMubWF4RGF0ZSAmJiBkYXRlID49IHRoaXMub3B0aW9ucy5tYXhEYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEgMC45OTk5OTlMNyA3TDEgMTNcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrXCI+JHt3ZWVrRGF5cy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla2RheVwiPiR7aXRlbS50aXRsZX08L2Rpdj5gXHJcbiAgICAgICAgICAgIH0pLmpvaW4oJycpfTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2RheXNcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIC8vINGB0YLRgNC10LvQutC4XHJcbiAgICBbXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tcHJldicsIG5hbWU6ICdwcmV2J30sXHJcbiAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tbmV4dCcsIG5hbWU6ICduZXh0J30sXHJcbiAgICBdLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgY29uc3QgJGFycm93ID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoaXRlbS5zZWxlY3Rvcik7XHJcbiAgICAgICAgJGFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgIC8vINCy0YDQtdC80LXQvdC90LDRjyDQvNC10YDQsCwg0LvRg9GH0YjQtSDQv9C10YDQtdCy0LXRgNGB0YLQsNGC0YwsINCy0YvQvdC10YHRgtC4INGB0YLRgNC10LvQutC4INC30LAg0L/RgNC10LTQtdC70Ysg0L/QtdGA0LXRgNC10YDQuNGB0L7QstGL0LLQsNC10LzQvtC5INC+0LHQu9Cw0YHRgtC4INC/0LjQutC10YDQsFxyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fb25BcnJvd0NsaWNrKCRhcnJvdywgaXRlbS5uYW1lKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vINGA0LXQvdC00LXRgCDQtNC90LXQuVxyXG4gICAgY29uc3QgJGRheXMgPSAkbW9udGgucXVlcnlTZWxlY3RvcignLk1vbnRoX19kYXlzJyk7XHJcbiAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgZGF5cy5zZXREYXRlKDEpO1xyXG4gICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICB3aGlsZSAoZGF5cy5nZXRNb250aCgpID09IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZVdlZWsoKTtcclxuXHJcbiAgICAgICAgd2Vla0RheXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgaWYgKGRheXMuZ2V0RGF5KCkgIT0gaXRlbS5kYXkgfHwgZGF5cy5nZXRNb250aCgpICE9IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZUVtcHR5RGF5KCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRGF5KGRheXMpKTtcclxuICAgICAgICAgICAgZGF5cy5zZXREYXRlKGRheXMuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRkYXlzLmFwcGVuZENoaWxkKCR3ZWVrKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJG1vbnRoO1xyXG59XHJcblxyXG4vKipcclxuICog0JrQu9C40Log0L/QviDRgdGC0YDQtdC70LrQtSDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y8g0LzQtdGB0Y/RhtCwXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGFycm93IEhUTUwg0Y3Qu9C10LzQtdC90YJcclxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgICAg0JjQvNGPIChwcmV2LCBuZXh0KVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25BcnJvd0NsaWNrID0gZnVuY3Rpb24oJGFycm93LCBuYW1lKSB7XHJcbiAgICBpZiAoJGFycm93LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRlID0gbmV3IERhdGUocGFyc2VJbnQodGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuTW9udGgnKS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIChuYW1lID09ICdwcmV2JyA/IC10aGlzLm9wdGlvbnMubW9udGhzQ291bnQgOiB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpKTtcclxuXHJcbiAgICAvLyDQstGL0YXQvtC0INC30LAg0L/RgNC10LTQtdC70Ysg0LzQuNC90LjQvNCw0LvRjNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKGRhdGUgPCB0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWluRGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGVuZERhdGUgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgZW5kRGF0ZS5zZXRNb250aChlbmREYXRlLmdldE1vbnRoKCkgKyB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpO1xyXG4gICAgICAgIGlmIChlbmREYXRlID4gdGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICAgICAgZGF0ZS5zZXRUaW1lKHRoaXMub3B0aW9ucy5tYXhEYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpIC0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50ICsgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vINC/0LXRgNC10YXQvtC0INC6INC90L7QstC+0Lkg0LTQsNGC0LVcclxuICAgIHRoaXMuX3NlbGVjdERhdGUoZGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9GB0YLQsNC90L7QstC60LAg0YLQtdC60YPRidC10Lkg0LTQsNGC0Ysg0YEg0YDQtdC90LTQtdGA0L7QvFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3NlbGVjdERhdGUgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICB0aGlzLl9zZWxlY3RlZERhdGUgPSBkYXRlO1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRocyhkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQvdC10LTQtdC70LhcclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVXZWVrID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIldlZWtcIj48L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiAkd2VlaztcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC90Y9cclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVEYXkgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXlcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiIGRhdGEtZGF5PVwiJHtkYXRlLmdldERheSgpfVwiPiR7ZGF0ZS5nZXREYXRlKCl9PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25EYXlDbGlja0V2ZW50LmJpbmQodGhpcykpO1xyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLl9vbkRheU1vdXNlRW50ZXJFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvtCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICAgIHRoaXMuX3VwZGF0ZURheSgkZGF5KTtcclxuXHJcbiAgICByZXR1cm4gJGRheTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLk1vbnRoJykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZU1vbnRoKCRtb250aCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuSDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtFbGVtZW50fSAkbW9udGgg0K3Qu9C10LzQtdC90YIg0LzQtdGB0Y/RhtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl91cGRhdGVNb250aCA9IGZ1bmN0aW9uKCRtb250aCkge1xyXG4gICAgJG1vbnRoLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpLmZvckVhY2goJGRheSA9PiB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlRGF5KCRkYXkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDRgdC+0YHRgtC+0Y/QvdC40Lkg0LTQvdGPXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQrdC70LXQvNC10L3RgiDQtNC90Y9cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3VwZGF0ZURheSA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGNvbnN0IGRhdGUgICA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgY29uc3QgbG9ja2VkID0gdGhpcy5nZXREYXlMb2NrZWQoZGF0ZSk7XHJcbiAgICBjb25zdCB0b2RheSAgPSB0aGlzLl90b2RheS5nZXRUaW1lKCkgPT0gZGF0ZS5nZXRUaW1lKCk7XHJcblxyXG4gICAgJGRheS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1kaXNhYmxlZCcsIGxvY2tlZCk7XHJcbiAgICAkZGF5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLWxvY2tlZCcsIGxvY2tlZCA9PSBMT0NLX0xPQ0tFRCk7XHJcbiAgICAkZGF5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLXRvZGF5JywgdG9kYXkpO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQvtCx0YvRgtC40LUg0LrQu9C40LrQsCDQv9C+INC00L3RjlxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlDbGlja0V2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdGhpcy5fb25EYXlDbGljayhlLnRhcmdldCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDRhdC+0LLQtdGA0LBcclxuICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5TW91c2VFbnRlckV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdGhpcy5fb25EYXlNb3VzZUVudGVyKGUudGFyZ2V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCl0L7QstC10YAg0L3QsCDRjdC70LXQvNC10L3RgtC1INC00L3Rj1xyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlNb3VzZUVudGVyID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5LmRhdGFzZXQudGltZSA9PSB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLmdldFRpbWUoKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBkYXRlX3RvID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCa0LvQuNC6INC/0L4g0LTQvdGOXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheUNsaWNrID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgLy8g0LTQtdC90Ywg0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC9XHJcbiAgICBpZiAoJGRheS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2soJ2RheVNlbGVjdCcsIG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQsdGA0L7RgSDQstGL0LHRgNCw0L3QvdC+0LPQviDRgNCw0L3QtdC1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcblxyXG4gICAgLy8g0LLRi9Cx0YDQsNC90LAg0L3QsNGH0LDQu9GM0L3QsNGPIC8g0LrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZSh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykpIHtcclxuICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmFuZ2VTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0JLQuNC30YPQsNC70YzQvdGL0Lkg0YHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3JhbmdlVmlzdWFsUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgICRkYXlzLmZvckVhY2goJGRheSA9PiB7XHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJywgJ2lzLXNlbGVjdGVkLXRvJywgJ2lzLXNlbGVjdGVkLWJldHdlZW4nKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgIHRoaXMuX3Rvb2x0aXBIaWRlKCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktC40LfRg9Cw0LvRjNC90L7QtSDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9yYW5nZVZpc3VhbFNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgaWYgKGRhdGVfZnJvbSAmJiBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkYXRlX3RvICYmIGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdGltZV9mcm9tID0gZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVfZnJvbS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgbGV0IHRpbWVfdG8gPSBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVfdG8uZ2V0VGltZSgpIDogMDtcclxuICAgIGlmICh0aW1lX2Zyb20gPiB0aW1lX3RvKSB7XHJcbiAgICAgICAgW3RpbWVfZnJvbSwgdGltZV90b10gPSBbdGltZV90bywgdGltZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCINC80LXQttC00YMg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0LlcclxuICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGRheXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAkZGF5c1tpXS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zZWxlY3RlZC1iZXR3ZWVuJywgJGRheXNbaV0uZGF0YXNldC50aW1lID4gdGltZV9mcm9tICYmICRkYXlzW2ldLmRhdGFzZXQudGltZSA8IHRpbWVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDQvdCw0YfQsNC70YzQvdC+0Lkg0Lgg0LrQvtC90LXRh9C90L7QuSDQv9C+0LfQuNGG0LjQuFxyXG4gICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgIT0gJGRheV9mcm9tKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAhPSAkZGF5X3RvKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdC+0YXRgNCw0L3QtdC90LjQtSDQsiDQutC10YhcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgPSAkZGF5X2Zyb207XHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCA9ICRkYXlfdG87XHJcblxyXG4gICAgdGhpcy5fc2VsZWN0aW9uLiRkYXlfZnJvbSA9ICRkYXlfZnJvbTtcclxuICAgIHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvID0gJGRheV90bztcclxuXHJcbiAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgIGNvbnN0IGRheXMgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRpbWVfZnJvbSAtIHRpbWVfdG8pIC8gODY0MDBlMykgKyAxO1xyXG4gICAgICAgIHRoaXMuX3Rvb2x0aXBTaG93KCRkYXlfdG8sIGRheXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0J/QvtC60LDQtyDQv9C+0LTRgdC60LDQt9C60LhcclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5INCS0YvQsdGA0LDQvdC90YvQuSDQtNC10L3RjFxyXG4gKiBAcGFyYW0ge051bWJlcn0gIGRheXMg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3Rvb2x0aXBTaG93ID0gZnVuY3Rpb24oJGRheSwgZGF5cykge1xyXG4gICAgdGhpcy5fJHRvb2x0aXBDb250ZW50LnRleHRDb250ZW50ID0gdGhpcy5vcHRpb25zLmZpbHRlci50b29sdGlwVGV4dC5jYWxsKHRoaXMsIGRheXMpIHx8ICcnO1xyXG4gICAgdGhpcy5fJHRvb2x0aXAuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2hvdycsIHRoaXMuXyR0b29sdGlwLnRleHRDb250ZW50Lmxlbmd0aCk7XHJcbiAgICB0aGlzLl90b29sdGlwVXBkYXRlKCRkYXkpO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0L/QvtC30LjRhtC40Lgg0L/QvtC00YHQutCw0LfQutC4XHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSDQktGL0LHRgNCw0L3QvdGL0Lkg0LTQtdC90YxcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3Rvb2x0aXBVcGRhdGUgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBsZXQgeCA9IDA7XHJcbiAgICBsZXQgeSA9IDA7XHJcbiAgICBsZXQgJGVsID0gJGRheTtcclxuICAgIGRvIHtcclxuICAgICAgICB5ICs9ICRlbC5vZmZzZXRUb3A7XHJcbiAgICAgICAgeCArPSAkZWwub2Zmc2V0TGVmdDtcclxuICAgIH0gd2hpbGUgKCgkZWwgPSAkZWwub2Zmc2V0UGFyZW50KSAmJiAkZWwgIT0gdGhpcy5fJHBpY2tlcik7XHJcblxyXG4gICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUudG9wID0gTWF0aC5yb3VuZCh5IC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSArICdweCc7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5zdHlsZS5sZWZ0ID0gTWF0aC5yb3VuZCh4ICsgJGRheS5vZmZzZXRXaWR0aCAvIDIgLSB0aGlzLl8kdG9vbHRpcC5vZmZzZXRXaWR0aCAvIDIpICsgJ3B4JztcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0LrRgNGL0YLRjCDQv9C+0LTRgdC60LDQt9C60YNcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3Rvb2x0aXBIaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zaG93Jyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQotC10LrRgdGCINC/0L7QtNGB0LrQsNC30LrQuCDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRheXMg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fZmlsdGVyVG9vbHRpcFRleHQgPSBmdW5jdGlvbihkYXlzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5wbHVyYWwoZGF5cywgWyclZCDQtNC10L3RjCcsICclZCDQtNC90Y8nLCAnJWQg0LTQvdC10LknXSkucmVwbGFjZSgnJWQnLCBkYXlzKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCk0LjQu9GM0YLRgCDQvdC10LTQvtGB0YLRg9C/0L3Ri9GFINC00L3QtdC5INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9maWx0ZXJMb2NrRGF5cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8g0LLRgdC1INC00L3QuCDQtNC+0YHRgtGD0L/QvdGLXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDQuNC30LzQtdC90LXQvdC40Y8g0YDQsNC30LzQtdGA0L7QsiDQvtC60L3QsFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25XaW5kb3dSZXNpemVFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uJGRheV90bykge1xyXG4gICAgICAgIHRoaXMuX3Rvb2x0aXBVcGRhdGUodGhpcy5fc2VsZWN0aW9uLiRkYXlfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBicmVha3BvaW50ID0gMDtcclxuICAgIGNvbnN0IGJyZWFrcG9pbnRzID0gT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzKS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XHJcbiAgICBmb3IgKGxldCBpIGluIGJyZWFrcG9pbnRzKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IGJyZWFrcG9pbnRzW2ldKSB7XHJcbiAgICAgICAgICAgIGJyZWFrcG9pbnQgPSBicmVha3BvaW50c1tpXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3NldEJyZWFrcG9pbnQoYnJlYWtwb2ludCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQo9GB0YLQsNC90L7QstC60LAg0YHQvtGB0YLQvtGP0L3QuNGPINGA0LXQvdC00LXRgNCwINC/0L7QtCDRgNCw0LfQvdGL0LUg0Y3QutGA0LDQvdGLXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSBicmVha3BvaW50INCa0LvRjtGHINC40LcgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzICjQqNC40YDQuNC90LAg0Y3QutGA0LDQvdCwKVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fc2V0QnJlYWtwb2ludCA9IGZ1bmN0aW9uKGJyZWFrcG9pbnQpIHtcclxuICAgIC8vINC+0YIg0L3QtdC90YPQttC90L7QuSDQv9C10YDQtdGA0LjRgdC+0LLQutC4XHJcbiAgICBpZiAodGhpcy5fYnJlYWtwb2ludCA9PSBicmVha3BvaW50KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fYnJlYWtwb2ludCA9IGJyZWFrcG9pbnQ7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbYnJlYWtwb2ludF0pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9ucy5icmVha3BvaW50c1ticmVha3BvaW50XSk7XHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGhzKHRoaXMuX3NlbGVjdGVkRGF0ZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQrdC70LXQvNC10L3RgiDQutCw0LvQtdC90LTQsNGA0L3QvtCz0L4g0LTQvdGPXHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICogQHJldHVybiB7RWxlbWVudH0gICBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kZ2V0RGF5QnlEYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgdGltZSA9IGRhdGUgaW5zdGFuY2VvZiBEYXRlID8gZGF0ZS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgcmV0dXJuIHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLkRheVtkYXRhLXRpbWU9XCInICsgdGltZSArICdcIl0nKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCg0LXQvdC00LXRgCDQtNC90Y8gLSDQt9Cw0LPQu9GD0YjQutC4XHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRW1wdHlEYXkgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRheSBpcy1lbXB0eVwiPjwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuICRkYXk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LfQtNCw0L3QuNC1INGN0LvQtdC80LXQvdGC0LAg0LjQtyBIVE1MINGC0LXQutGB0YLQsFxyXG4gKiBAcGFyYW0gIHtTdHJpbmd9IGh0bWwgSFRNTCDRgtC10LrRgdGCXHJcbiAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl8kY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGh0bWwpIHtcclxuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZGl2Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGh0bWwpO1xyXG4gICAgcmV0dXJuIGRpdi5jaGlsZHJlbi5sZW5ndGggPiAxID8gZGl2LmNoaWxkcmVuIDogZGl2LmZpcnN0RWxlbWVudENoaWxkO1xyXG59XHJcblxyXG4vKipcclxuICogU2FmZSDQstGL0LfQvtCyINCy0L3QtdGI0L3QuNGFINGB0L7QsdGL0YLQuNC5INC60L7QvNC/0L7QvdC10L3RgtCwXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBmINCY0LzRjyDRgdC+0LHRi9GC0LjRj1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fY2FsbGJhY2sgPSBmdW5jdGlvbihmKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbltmXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vbltmXS5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybjtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGF0ZVJhbmdlUGlja2VyO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9kaXN0L2RhdGVyYW5nZXBpY2tlci5qcyIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2RlbW8vcGFnZS5zY3NzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9kZW1vL3BhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJLElBQXlEO0FBQzdEO0FBQ0EsTUFBTSxFQUtnQztBQUN0QyxDQUFDO0FBQ0Qsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQSxjQUFjLDhCQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxnQkFBZ0IsOEJBQW1CLHdCQUF3Qiw4QkFBbUI7QUFDOUUsbURBQW1ELHlDQUF5QztBQUM1RjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxpRUFBaUUsa0JBQWtCO0FBQ25GO0FBQ0EsMERBQTBELGNBQWM7QUFDeEU7QUFDQSxXQUFXO0FBQ1g7QUFD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RUE7O0FBRUEsQ0FBQzs7QUFFRDtBQUNBLFVBQVU7QUFDVjtBQUNBLENBQUM7QUFDRCwyQ0FBMkMsY0FBYywrLzdDOzs7Ozs7VUMvMkJ6RDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsZ0NBQWdDLFlBQVk7V0FDNUM7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7OztBQ05BOzs7Ozs7Ozs7Ozs7O0FDQTBGOztBQUUxRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLDhEQUFlO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsOERBQVc7QUFDbEM7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJmaWxlIjoiLi9kZW1vL3BhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkRhdGVyYW5nZXBpY2tlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKCgpID0+IHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHRcInVzZSBzdHJpY3RcIjtcbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgc2NvcGVcbi8qKioqKiovIFx0dmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcbi8qKioqKiovIFx0XHRcdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcbi8qKioqKiovIFx0XHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKVxuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuLyoqKioqKi8gXHRcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4vKioqKioqLyBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuLy8gVGhpcyBlbnRyeSBuZWVkIHRvIGJlIHdyYXBwZWQgaW4gYW4gSUlGRSBiZWNhdXNlIGl0IG5lZWQgdG8gYmUgaXNvbGF0ZWQgYWdhaW5zdCBvdGhlciBlbnRyeSBtb2R1bGVzLlxuKCgpID0+IHtcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9zY3NzL2luZGV4LnNjc3MgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5cbn0pKCk7XG5cbi8vIFRoaXMgZW50cnkgbmVlZCB0byBiZSB3cmFwcGVkIGluIGFuIElJRkUgYmVjYXVzZSBpdCBuZWVkIHRvIGJlIGlzb2xhdGVkIGFnYWluc3Qgb3RoZXIgZW50cnkgbW9kdWxlcy5cbigoKSA9PiB7XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL2pzL2luZGV4LmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqL1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLyogaGFybW9ueSBleHBvcnQgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIHtcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJMT0NLX1VOQVZBSUxBQkxFXCI6ICgpID0+ICgvKiBiaW5kaW5nICovIExPQ0tfVU5BVkFJTEFCTEUpLFxuLyogaGFybW9ueSBleHBvcnQgKi8gICBcIkxPQ0tfTE9DS0VEXCI6ICgpID0+ICgvKiBiaW5kaW5nICovIExPQ0tfTE9DS0VEKSxcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJkZWZhdWx0XCI6ICgpID0+IChfX1dFQlBBQ0tfREVGQVVMVF9FWFBPUlRfXylcbi8qIGhhcm1vbnkgZXhwb3J0ICovIH0pO1xuLy8g0YHQvtGB0YLQvtGP0L3QuNGPINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuY29uc3QgTE9DS19VTkFWQUlMQUJMRSA9IDE7XHJcbmNvbnN0IExPQ0tfTE9DS0VEICAgICAgPSAyO1xyXG5cclxuZnVuY3Rpb24gRGF0ZVJhbmdlUGlja2VyKCRjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgLy8g0L7RgiDQv9C+0LLRgtC+0YDQvdC+0Lkg0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40LhcclxuICAgIGlmICgkY29udGFpbmVyLmluc3RhbmNlKSB7XHJcbiAgICAgICAgcmV0dXJuICRjb250YWluZXIuaW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICAkY29udGFpbmVyLmluc3RhbmNlID0gdGhpcztcclxuXHJcbiAgICB0aGlzLl8kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgZmlyc3REYXlPZlRoZVdlZWs6IG9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgfHwgMSwgICAgICAgICAgLy8g0L/QtdGA0LLRi9C5INC00LXQvdGMINC90LXQtNC10LvQuCwgMCA9INCy0YEsIDEgPSDQv9C9LCAuLi5cclxuICAgICAgICBzaW5nbGVNb2RlOiAgICAgICAgb3B0aW9ucy5zaW5nbGVNb2RlICAgICAgICB8fCBmYWxzZSwgICAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0Ysg0LLQvNC10YHRgtC+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgIGxvY2FsZTogICAgICAgICAgICBvcHRpb25zLmxvY2FsZSAgICAgICAgICAgIHx8ICdydS1SVScsXHJcbiAgICAgICAgbWluRGF5czogICAgICAgICAgIG9wdGlvbnMubWluRGF5cyAgICAgICAgICAgfHwgMSwgICAgICAgICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuSDQsiDQtNC40LDQv9Cw0LfQvtC90LVcclxuICAgICAgICBtb250aHNDb3VudDogICAgICAgb3B0aW9ucy5tb250aHNDb3VudCAgICAgICB8fCAxMixcclxuICAgICAgICBwZXJSb3c6ICAgICAgICAgICAgb3B0aW9ucy5wZXJSb3cgICAgICAgICAgICB8fCB1bmRlZmluZWQsICAvLyDQutC+0LvQuNGH0LXRgdGC0LLQviDQvNC10YHRj9GG0LXQsiDQsiDRgNGP0LTRg1xyXG4gICAgICAgIG1pbkRhdGU6ICAgICAgICAgICBvcHRpb25zLm1pbkRhdGUgICAgICAgICAgIHx8IG5ldyBEYXRlKCksIC8vINC80LjQvdC40LzQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAgICBtYXhEYXRlOiAgICAgICAgICAgb3B0aW9ucy5tYXhEYXRlICAgICAgICAgICB8fCB1bmRlZmluZWQsXHJcbiAgICAgICAgYnJlYWtwb2ludHM6ICAgICAgIG9wdGlvbnMuYnJlYWtwb2ludHMgICAgICAgfHwge30sXHJcbiAgICAgICAgaW50ZXJuYWxJbnB1dHM6ICAgIG9wdGlvbnMuaW50ZXJuYWxJbnB1dHMgICAgfHwgdHJ1ZSwgICAgICAgLy8g0LjRgdC/0L7Qu9GM0LfQvtCy0LDQvdC40LUg0LLRgdGC0YDQvtC10L3QvdGL0YUg0LjQvdC/0YPRgtC+0LJcclxuICAgICAgICAvLyDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICAgIG9uOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgcmFuZ2VTZWxlY3Q6IG51bGwsIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAgICAgICAgICAgIGRheVNlbGVjdDogICBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0L7QtNC90L7QuSDQtNCw0YLRiyAo0YLQvtC70YzQutC+INC/0YDQuCBzaW5nbGVNb2RlOiB0cnVlKVxyXG4gICAgICAgIH0sIG9wdGlvbnMub24gfHwge30pLFxyXG4gICAgICAgIC8vINGE0LjQu9GM0YLRgNGD0Y7RidC40LUg0LzQtdGC0L7QtNGLXHJcbiAgICAgICAgZmlsdGVyOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgbG9ja0RheXM6ICAgIHRoaXMuX2ZpbHRlckxvY2tEYXlzLCAgICAvLyBjYWxsYmFjayhkYXRlKSDRhNGD0L3QutGG0LjRjyDQsdC70L7QutC40YDQvtCy0LDQvdC40Y8g0LTQsNGCLCB0cnVlL0xPQ0tcclxuICAgICAgICAgICAgdG9vbHRpcFRleHQ6IHRoaXMuX2ZpbHRlclRvb2x0aXBUZXh0LCAvLyBjYWxsYmFjayhkYXlzKSDQstGL0LLQvtC0INGC0LXQutGB0YLQsCDQv9C+0LTRgdC60LDQt9C60LhcclxuICAgICAgICB9LCBvcHRpb25zLmZpbHRlciB8fCB7fSksXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRj1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyDRgNGP0LTQvdC+0YHRgtGMXHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5wZXJSb3cgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMucGVyUm93ID0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5taW5EYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC+0L/RhtC40Lgg0LTQu9GPINGN0LrRgNCw0L3QvtCyINC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAgICB0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHNbdGhpcy5fYnJlYWtwb2ludCA9IDBdID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zKTtcclxuXHJcbiAgICAvLyDRgtC10LrRg9GJ0LjQuSDQtNC10L3RjFxyXG4gICAgdGhpcy5fdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgdGhpcy5fdG9kYXkuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgdGhpcy5fJHBpY2tlciA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyXCI+XHJcbiAgICAgICAgICAgICR7dGhpcy5vcHRpb25zLmludGVybmFsSW5wdXRzID9cclxuICAgICAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX19pbnB1dHNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkYXRlX2Zyb21cIj5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJkYXRlX3RvXCI+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5gIDogJydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX19tb250aHNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcC1jb250ZW50XCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgLy8g0Y3Qu9C10LzQtdC90YLRi1xyXG4gICAgdGhpcy5fJG1vbnRocyAgICAgICAgID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX19tb250aHMnKTtcclxuICAgIHRoaXMuXyR0b29sdGlwICAgICAgICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fdG9vbHRpcCcpO1xyXG4gICAgdGhpcy5fJHRvb2x0aXBDb250ZW50ID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX190b29sdGlwLWNvbnRlbnQnKTtcclxuXHJcbiAgICAvLyDQv9C+0LvRjyDQstCy0L7QtNCwXHJcbiAgICB0aGlzLl8kaW5wdXRGcm9tID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImRhdGVfZnJvbVwiXScpO1xyXG4gICAgdGhpcy5fJGlucHV0VG8gICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignW25hbWU9XCJkYXRlX3RvXCJdJyk7XHJcblxyXG4gICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YBcclxuICAgIHRoaXMuX3NlbGVjdERhdGUodGhpcy5vcHRpb25zLm1pbkRhdGUpO1xyXG4gICAgdGhpcy5fJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl8kcGlja2VyKTtcclxuXHJcbiAgICAvLyDQvtCx0YDQsNCx0L7RgtC60LAg0LHRgNC10LnQutC/0L7QuNC90YLQvtCyXHJcbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzKS5sZW5ndGgpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fb25XaW5kb3dSZXNpemVFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLl9vbldpbmRvd1Jlc2l6ZUV2ZW50KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQndCw0LfQstCw0L3QuNC1INC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldE1vbnRoRm9ybWF0dGVkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgdGl0bGUgPSB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHttb250aDogJ2xvbmcnfSk7XHJcbiAgICByZXR1cm4gdGl0bGUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKSArIHRpdGxlLnNsaWNlKDEpO1xyXG59XHJcblxyXG4vKipcclxuICog0KTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90LjQtSDQtNCw0YLRiyDQtNC70Y8g0YLQtdC60YPRidC10Lkg0LvQvtC60LDQu9C4XHJcbiAqIEBwYXJhbSAge0RhdGV9ICAgZGF0ZSAgICDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zINCf0LDRgNCw0LzQtdGC0YDRi1xyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERhdGVUaW1lRm9ybWF0ID0gZnVuY3Rpb24oZGF0ZSwgb3B0aW9ucykge1xyXG4gICAgcmV0dXJuIEludGwuRGF0ZVRpbWVGb3JtYXQodGhpcy5vcHRpb25zLmxvY2FsZSwgb3B0aW9ucykuZm9ybWF0KGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0JTQvdC4INC90LXQtNC10LvQuFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5nZXRXZWVrRGF5c0Zvcm1hdHRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAyKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgKytpKSB7XHJcbiAgICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICBkYXk6IGRhdGUuZ2V0RGF5KCksXHJcbiAgICAgICAgICAgIHRpdGxlOiB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHt3ZWVrZGF5OiAnc2hvcnQnfSksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0YHQvtCz0LvQsNGB0L3QviDQvdCw0YHRgtGA0L7QtdC90L3QvtC80YMg0L/QtdGA0LLQvtC80YMg0LTQvdGOINC90LXQtNC10LvQuFxyXG4gICAgcmVzdWx0LnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICBjb25zdCBmaXJzdERheU9mVGhlV2VlayA9IHRoaXMub3B0aW9ucy5maXJzdERheU9mVGhlV2VlayAlIDc7XHJcbiAgICAgICAgbGV0IGRheUEgPSBhLmRheTtcclxuICAgICAgICBsZXQgZGF5QiA9IGIuZGF5O1xyXG5cclxuICAgICAgICBpZiAoZGF5QSA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF5QiA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXlBIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgZGF5QSArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRheUIgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICBkYXlCICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGF5QSAtIGRheUI7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vKipcclxuICog0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LzQtdGB0Y/RhtC1XHJcbiAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAqIEByZXR1cm4ge051bWJlcn0gICAg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuZ2V0RGF5c0NvdW50SW5Nb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0IGRheXMgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgZGF5cy5zZXRNb250aChkYXlzLmdldE1vbnRoKCkgKyAxKTtcclxuICAgIGRheXMuc2V0RGF0ZSgwKTtcclxuICAgIHJldHVybiBkYXlzLmdldERhdGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnJhbmdlUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsUmVzZXQoKTtcclxuICAgIHRoaXMuX3NlbGVjdGlvbiA9IHt9O1xyXG59XHJcblxyXG4vKipcclxuICog0JLRi9C00LXQu9C10L3QuNC1INC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUucmFuZ2VTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgaWYgKCF0aGlzLmdldElzUmFuZ2VTZWxlY3RhYmxlKGRhdGVfZnJvbSwgZGF0ZV90bykpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INGN0LvQtdC80LXQvdGC0L7QslxyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QoZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuXHJcbiAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1XHJcbiAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L7QsdC90L7QstC70LXQvdC40LUg0LjQvdC/0YPRgtC+0LJcclxuICAgIGlmICh0aGlzLl8kaW5wdXRGcm9tKSB7XHJcbiAgICAgICAgdGhpcy5fJGlucHV0RnJvbS52YWx1ZSA9IHRoaXMuZm9ybWF0RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl8kaW5wdXRUbykge1xyXG4gICAgICAgIHRoaXMuXyRpbnB1dFRvLnZhbHVlID0gdGhpcy5mb3JtYXREYXRlKGRhdGVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7QsdGL0YLQuNC1XHJcbiAgICB0aGlzLl9jYWxsYmFjaygncmFuZ2VTZWxlY3QnLCBkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG59XHJcblxyXG4vKipcclxuICog0KTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90LjQtSDQtNCw0YLRi1xyXG4gKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICogQHBhcmFtICB7U3RyaW5nfSBmb3JtYXQg0KTQvtGA0LzQsNGCINGB0YLRgNC+0LrQuFxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmZvcm1hdERhdGUgPSBmdW5jdGlvbihkYXRlLCBmb3JtYXQgPSAnWS1tLWQnKSB7XHJcbiAgICByZXR1cm4gZm9ybWF0LnJlcGxhY2UoJ1knLCBkYXRlLmdldEZ1bGxZZWFyKCkpXHJcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ20nLCAoJzAnICsgKGRhdGUuZ2V0TW9udGgoKSArIDEpKS5zbGljZSgtMikpXHJcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoJ2QnLCAoJzAnICsgKGRhdGUuZ2V0RGF0ZSgpKSkuc2xpY2UoLTIpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0YDQvtCy0LXRgNC60LAg0LLQvtC30LzQvtC20L3QvtGB0YLQuCDQstGL0LTQtdC70LXQvdC40Y8g0LTQsNGCXHJcbiAqIEBwYXJhbSAge0RhdGUgZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gKiBAcGFyYW0gIHtEYXRlIGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldElzUmFuZ2VTZWxlY3RhYmxlID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3Ri9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhkYXRlX2Zyb20uZ2V0VGltZSgpIC0gZGF0ZV90by5nZXRUaW1lKCkpIC8gMTAwMCAvIDg2NDAwO1xyXG4gICAgaWYgKGRpZmYgPCB0aGlzLm9wdGlvbnMubWluRGF5cykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9GA0L7QstC10YDQutCwINC/0L7Qv9Cw0LTQsNC90LjRjyDQsiDQtNC40LDQv9Cw0LfQvtC9INC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKCk7XHJcbiAgICBkYXkuc2V0VGltZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuXHJcbiAgICB3aGlsZSAoZGF5IDwgZGF0ZV90bykge1xyXG4gICAgICAgIGlmICh0aGlzLmdldERheUxvY2tlZChkYXkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRheS5zZXREYXRlKGRheS5nZXREYXRlKCkgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCf0YDQvtCy0LXRgNC60LAg0L3QsCDQtNC+0YHRgtGD0L/QvdC+0YHRgtGMINC00L3RjyDQtNC70Y8g0LHRgNC+0L3QuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59ICAgdHJ1ZSDQtdGB0LvQuCDQtNC+0YHRgtGD0L/QtdC9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLmdldERheUxvY2tlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCy0L3QtSDQtNC+0YHRgtGD0L/QvdC+0LPQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUgfHwgZGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIExPQ0tfVU5BVkFJTEFCTEU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maWx0ZXIubG9ja0RheXMuY2FsbCh0aGlzLCBkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0LrQu9C+0L3QtdC90LjQtSAoMSDQsdC+0LHRkdGALCAyINCx0L7QsdGA0LAsIDUg0LHQvtCx0YDQvtCyKVxyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IHZhbHVlINCa0L7Qu9C40YfQtdGB0YLQstC+XHJcbiAqIEBwYXJhbSAge0FycmF5fSAgZm9ybXMg0JzQsNGB0YHQuNCyINC40LcgM9GFINGN0LvQtdC80LXQvdGC0L7Qsiwg0LzQvtC20LXRgiDRgdC+0LTQtdGA0LbQsNGC0Ywg0YHQv9C10YbQuNGE0LjQutCw0YLQvtGAICVkINC00LvRjyDQt9Cw0LzQtdC90YtcclxuICogQHJldHVybiB7U3RyaW5nfVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5wbHVyYWwgPSBmdW5jdGlvbiAodmFsdWUsIGZvcm1zKSB7XHJcbiAgICByZXR1cm4gKHZhbHVlICUgMTAgPT0gMSAmJiB2YWx1ZSAlIDEwMCAhPSAxMSA/IGZvcm1zWzBdIDogKHZhbHVlICUgMTAgPj0gMiAmJiB2YWx1ZSAlIDEwIDw9IDQgJiYgKHZhbHVlICUgMTAwIDwgMTAgfHwgdmFsdWUgJSAxMDAgPj0gMjApID8gZm9ybXNbMV0gOiBmb3Jtc1syXSkpLnJlcGxhY2UoJyVkJywgdmFsdWUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC00LjQsNC/0LDQt9C+0L3QsCDQvNC10YHRj9GG0LXQslxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVNb250aHMgPSBmdW5jdGlvbihkYXRlX2Zyb20pIHtcclxuICAgIHdoaWxlICh0aGlzLl8kbW9udGhzLmxhc3RFbGVtZW50Q2hpbGQpIHtcclxuICAgICAgICB0aGlzLl8kbW9udGhzLnJlbW92ZUNoaWxkKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/RgNGP0YfQtdC8INC/0L7QtNGB0LrQsNC30LrRg1xyXG4gICAgdGhpcy5fdG9vbHRpcEhpZGUoKTtcclxuXHJcbiAgICAvLyDQv9GA0LXRgNC10L3QtNC10YAg0LzQtdGB0Y/RhtC10LJcclxuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoZGF0ZV9mcm9tLmdldFRpbWUoKSk7XHJcbiAgICBjb25zdCAkbW9udGhzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDsgKytpKSB7XHJcbiAgICAgICAgJG1vbnRocy5wdXNoKHRoaXMuXyRjcmVhdGVNb250aChjdXJyZW50RGF0ZSkpO1xyXG4gICAgICAgIGN1cnJlbnREYXRlLnNldE1vbnRoKGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgNC10L3QtNC10YBcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJG1vbnRocy5sZW5ndGg7IGkgKz0gdGhpcy5vcHRpb25zLnBlclJvdykge1xyXG4gICAgICAgIGNvbnN0ICRyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAkcm93LmNsYXNzTmFtZSA9ICdEYXRlcmFuZ2VwaWNrZXJfX3Jvdyc7XHJcblxyXG4gICAgICAgICRtb250aHMuc2xpY2UoaSwgaSArIHRoaXMub3B0aW9ucy5wZXJSb3cpLmZvckVhY2goJG1vbnRoID0+IHtcclxuICAgICAgICAgICAgJHJvdy5hcHBlbmRDaGlsZCgkbW9udGgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl8kbW9udGhzLmFwcGVuZENoaWxkKCRyb3cpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0RhdGV9IGRhdGUg0JzQtdGB0Y/RhlxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZU1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgY29uc3QgY3VycmVudE1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xyXG4gICAgY29uc3QgbW9udGhUaXRsZSA9IHRoaXMuZ2V0TW9udGhGb3JtYXR0ZWQoZGF0ZSk7XHJcbiAgICBjb25zdCB3ZWVrRGF5cyA9IHRoaXMuZ2V0V2Vla0RheXNGb3JtYXR0ZWQoKTtcclxuXHJcbiAgICBjb25zdCAkbW9udGggPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIk1vbnRoXCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fYXJyb3cgTW9udGhfX2Fycm93LS1wcmV2JHsodGhpcy5vcHRpb25zLm1pbkRhdGUgJiYgZGF0ZSA8PSB0aGlzLm9wdGlvbnMubWluRGF0ZSkgPyAnIGlzLWRpc2FibGVkJyA6ICcnfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk03IDEzTDEgN0w3IDFcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX190aXRsZVwiPiR7bW9udGhUaXRsZX0gJHtkYXRlLmdldEZ1bGxZZWFyKCl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tbmV4dCR7KHRoaXMub3B0aW9ucy5tYXhEYXRlICYmIGRhdGUgPj0gdGhpcy5vcHRpb25zLm1heERhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMSAwLjk5OTk5OUw3IDdMMSAxM1wiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtcIj4ke3dlZWtEYXlzLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrZGF5XCI+JHtpdGVtLnRpdGxlfTwvZGl2PmBcclxuICAgICAgICAgICAgfSkuam9pbignJyl9PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fZGF5c1wiPjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgLy8g0YHRgtGA0LXQu9C60LhcclxuICAgIFtcclxuICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1wcmV2JywgbmFtZTogJ3ByZXYnfSxcclxuICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1uZXh0JywgbmFtZTogJ25leHQnfSxcclxuICAgIF0uZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICBjb25zdCAkYXJyb3cgPSAkbW9udGgucXVlcnlTZWxlY3RvcihpdGVtLnNlbGVjdG9yKTtcclxuICAgICAgICAkYXJyb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICAgICAgLy8g0LLRgNC10LzQtdC90L3QsNGPINC80LXRgNCwLCDQu9GD0YfRiNC1INC/0LXRgNC10LLQtdGA0YHRgtCw0YLRjCwg0LLRi9C90LXRgdGC0Lgg0YHRgtGA0LXQu9C60Lgg0LfQsCDQv9GA0LXQtNC10LvRiyDQv9C10YDQtdGA0LXRgNC40YHQvtCy0YvQstCw0LXQvNC+0Lkg0L7QsdC70LDRgdGC0Lgg0L/QuNC60LXRgNCwXHJcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9vbkFycm93Q2xpY2soJGFycm93LCBpdGVtLm5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0YDQtdC90LTQtdGAINC00L3QtdC5XHJcbiAgICBjb25zdCAkZGF5cyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKCcuTW9udGhfX2RheXMnKTtcclxuICAgIGNvbnN0IGRheXMgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICBkYXlzLnNldERhdGUoMSk7XHJcbiAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgIHdoaWxlIChkYXlzLmdldE1vbnRoKCkgPT0gY3VycmVudE1vbnRoKSB7XHJcbiAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlV2VlaygpO1xyXG5cclxuICAgICAgICB3ZWVrRGF5cy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBpZiAoZGF5cy5nZXREYXkoKSAhPSBpdGVtLmRheSB8fCBkYXlzLmdldE1vbnRoKCkgIT0gY3VycmVudE1vbnRoKSB7XHJcbiAgICAgICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRW1wdHlEYXkoKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVEYXkoZGF5cykpO1xyXG4gICAgICAgICAgICBkYXlzLnNldERhdGUoZGF5cy5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJGRheXMuYXBwZW5kQ2hpbGQoJHdlZWspO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAkbW9udGg7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQmtC70LjQuiDQv9C+INGB0YLRgNC10LvQutC1INC/0LXRgNC10LrQu9GO0YfQtdC90LjRjyDQvNC10YHRj9GG0LBcclxuICogQHBhcmFtIHtFbGVtZW50fSAkYXJyb3cgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAgICDQmNC80Y8gKHByZXYsIG5leHQpXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkFycm93Q2xpY2sgPSBmdW5jdGlvbigkYXJyb3csIG5hbWUpIHtcclxuICAgIGlmICgkYXJyb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShwYXJzZUludCh0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aCcpLmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgKG5hbWUgPT0gJ3ByZXYnID8gLXRoaXMub3B0aW9ucy5tb250aHNDb3VudCA6IHRoaXMub3B0aW9ucy5tb250aHNDb3VudCkpO1xyXG5cclxuICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNC40L3QuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlKSB7XHJcbiAgICAgICAgZGF0ZS5zZXRUaW1lKHRoaXMub3B0aW9ucy5taW5EYXRlLmdldFRpbWUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LDQutGB0LjQvNCw0LvRjNC90L7QuSDQtNCw0YLRi1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgY29uc3QgZW5kRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBlbmREYXRlLnNldE1vbnRoKGVuZERhdGUuZ2V0TW9udGgoKSArIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCk7XHJcbiAgICAgICAgaWYgKGVuZERhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1heERhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgLSB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQgKyAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0L/QtdGA0LXRhdC+0LQg0Log0L3QvtCy0L7QuSDQtNCw0YLQtVxyXG4gICAgdGhpcy5fc2VsZWN0RGF0ZShkYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCj0YHRgtCw0L3QvtCy0LrQsCDRgtC10LrRg9GJ0LXQuSDQtNCw0YLRiyDRgSDRgNC10L3QtNC10YDQvtC8XHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fc2VsZWN0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIHRoaXMuX3NlbGVjdGVkRGF0ZSA9IGRhdGU7XHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGhzKGRhdGUpO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC90LXQtNC10LvQuFxyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZVdlZWsgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiV2Vla1wiPjwvZGl2PmBcclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuICR3ZWVrO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC00L3Rj1xyXG4gKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fJGNyZWF0ZURheSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICBgPGRpdiBjbGFzcz1cIkRheVwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCIgZGF0YS1kYXk9XCIke2RhdGUuZ2V0RGF5KCl9XCI+JHtkYXRlLmdldERhdGUoKX08L2Rpdj5gXHJcbiAgICApO1xyXG5cclxuICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkRheUNsaWNrRXZlbnQuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZSkge1xyXG4gICAgICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINC+0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gICAgdGhpcy5fdXBkYXRlRGF5KCRkYXkpO1xyXG5cclxuICAgIHJldHVybiAkZGF5O1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuTW9udGgnKS5mb3JFYWNoKCRtb250aCA9PiB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlTW9udGgoJG1vbnRoKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICog0J7QsdC90L7QstC70LXQvdC40LUg0YHQvtGB0YLQvtGP0L3QuNC5INC80LXRgdGP0YbQsFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRtb250aCDQrdC70LXQvNC10L3RgiDQvNC10YHRj9GG0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3VwZGF0ZU1vbnRoID0gZnVuY3Rpb24oJG1vbnRoKSB7XHJcbiAgICAkbW9udGgucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJykuZm9yRWFjaCgkZGF5ID0+IHtcclxuICAgICAgICB0aGlzLl91cGRhdGVEYXkoJGRheSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCe0LHQvdC+0LLQu9C10L3QuNC1INGB0L7RgdGC0L7Rj9C90LjQuSDQtNC90Y9cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5INCt0LvQtdC80LXQvdGCINC00L3Rj1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdXBkYXRlRGF5ID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgY29uc3QgZGF0ZSAgID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICBjb25zdCBsb2NrZWQgPSB0aGlzLmdldERheUxvY2tlZChkYXRlKTtcclxuICAgIGNvbnN0IHRvZGF5ICA9IHRoaXMuX3RvZGF5LmdldFRpbWUoKSA9PSBkYXRlLmdldFRpbWUoKTtcclxuXHJcbiAgICAkZGF5LmNsYXNzTGlzdC50b2dnbGUoJ2lzLWRpc2FibGVkJywgbG9ja2VkKTtcclxuICAgICRkYXkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtbG9ja2VkJywgbG9ja2VkID09IExPQ0tfTE9DS0VEKTtcclxuICAgICRkYXkuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtdG9kYXknLCB0b2RheSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQodC+0LHRi9GC0LjQtSDQutC70LjQutCwINC/0L4g0LTQvdGOXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheUNsaWNrRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICB0aGlzLl9vbkRheUNsaWNrKGUudGFyZ2V0KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INGF0L7QstC10YDQsFxyXG4gKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fb25EYXlNb3VzZUVudGVyRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICB0aGlzLl9vbkRheU1vdXNlRW50ZXIoZS50YXJnZXQpO1xyXG59XHJcblxyXG4vKipcclxuICog0KXQvtCy0LXRgCDQvdCwINGN0LvQtdC80LXQvdGC0LUg0LTQvdGPXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbkRheU1vdXNlRW50ZXIgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCRkYXkuZGF0YXNldC50aW1lID09IHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20uZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG59XHJcblxyXG4vKipcclxuICog0JrQu9C40Log0L/QviDQtNC90Y5cclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX29uRGF5Q2xpY2sgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICAvLyDQtNC10L3RjCDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L1cclxuICAgIGlmICgkZGF5LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0YtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZSkge1xyXG4gICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuICAgICAgICB0aGlzLl9jYWxsYmFjaygnZGF5U2VsZWN0JywgbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSkpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgdCx0YDQvtGBINCy0YvQsdGA0LDQvdC90L7Qs9C+INGA0LDQvdC10LUg0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAvLyDQstGL0LHRgNCw0L3QsCDQvdCw0YfQsNC70YzQvdCw0Y8gLyDQutC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20pIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAvLyDQtNC+0L/Rg9GB0YLQuNC80YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICAgICAgaWYgKCF0aGlzLmdldElzUmFuZ2VTZWxlY3RhYmxlKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSkge1xyXG4gICAgICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yYW5nZVNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQktC40LfRg9Cw0LvRjNC90YvQuSDRgdCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fcmFuZ2VWaXN1YWxSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgJGRheXMgPSB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpO1xyXG4gICAgJGRheXMuZm9yRWFjaCgkZGF5ID0+IHtcclxuICAgICAgICAkZGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nLCAnaXMtc2VsZWN0ZWQtdG8nLCAnaXMtc2VsZWN0ZWQtYmV0d2VlbicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g0L/RgNGP0YfQtdC8INC/0L7QtNGB0LrQsNC30LrRg1xyXG4gICAgdGhpcy5fdG9vbHRpcEhpZGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCS0LjQt9GD0LDQu9GM0L3QvtC1INCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YJcclxuICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX3JhbmdlVmlzdWFsU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICBpZiAoZGF0ZV9mcm9tICYmIGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGRhdGVfdG8gJiYgZGF0ZV90byBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0aW1lX2Zyb20gPSBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV9mcm9tLmdldFRpbWUoKSA6IDA7XHJcbiAgICBsZXQgdGltZV90byA9IGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV90by5nZXRUaW1lKCkgOiAwO1xyXG4gICAgaWYgKHRpbWVfZnJvbSA+IHRpbWVfdG8pIHtcclxuICAgICAgICBbdGltZV9mcm9tLCB0aW1lX3RvXSA9IFt0aW1lX3RvLCB0aW1lX2Zyb21dO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YIg0LzQtdC20LTRgyDQvdCw0YfQsNC70YzQvdC+0Lkg0Lgg0LrQvtC90LXRh9C90L7QuVxyXG4gICAgY29uc3QgJGRheXMgPSB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkZGF5cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICRkYXlzW2ldLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXNlbGVjdGVkLWJldHdlZW4nLCAkZGF5c1tpXS5kYXRhc2V0LnRpbWUgPiB0aW1lX2Zyb20gJiYgJGRheXNbaV0uZGF0YXNldC50aW1lIDwgdGltZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5INC/0L7Qt9C40YbQuNC4XHJcbiAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICBjb25zdCAkZGF5X3RvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuXHJcbiAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgaWYgKHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCAhPSAkZGF5X2Zyb20pIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgaWYgKHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkICE9ICRkYXlfdG8pIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vINGB0L7RhdGA0LDQvdC10L3QuNC1INCyINC60LXRiFxyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCA9ICRkYXlfZnJvbTtcclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkID0gJGRheV90bztcclxuXHJcbiAgICB0aGlzLl9zZWxlY3Rpb24uJGRheV9mcm9tID0gJGRheV9mcm9tO1xyXG4gICAgdGhpcy5fc2VsZWN0aW9uLiRkYXlfdG8gPSAkZGF5X3RvO1xyXG5cclxuICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IE1hdGguZmxvb3IoTWF0aC5hYnModGltZV9mcm9tIC0gdGltZV90bykgLyA4NjQwMGUzKSArIDE7XHJcbiAgICAgICAgdGhpcy5fdG9vbHRpcFNob3coJGRheV90bywgZGF5cyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQn9C+0LrQsNC3INC/0L7QtNGB0LrQsNC30LrQuFxyXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkg0JLRi9Cx0YDQsNC90L3Ri9C5INC00LXQvdGMXHJcbiAqIEBwYXJhbSB7TnVtYmVyfSAgZGF5cyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcFNob3cgPSBmdW5jdGlvbigkZGF5LCBkYXlzKSB7XHJcbiAgICB0aGlzLl8kdG9vbHRpcENvbnRlbnQudGV4dENvbnRlbnQgPSB0aGlzLm9wdGlvbnMuZmlsdGVyLnRvb2x0aXBUZXh0LmNhbGwodGhpcywgZGF5cykgfHwgJyc7XHJcbiAgICB0aGlzLl8kdG9vbHRpcC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zaG93JywgdGhpcy5fJHRvb2x0aXAudGV4dENvbnRlbnQubGVuZ3RoKTtcclxuICAgIHRoaXMuX3Rvb2x0aXBVcGRhdGUoJGRheSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDQntCx0L3QvtCy0LvQtdC90LjQtSDQv9C+0LfQuNGG0LjQuCDQv9C+0LTRgdC60LDQt9C60LhcclxuICogQHBhcmFtIHtFbGVtZW50fSAkZGF5INCS0YvQsdGA0LDQvdC90YvQuSDQtNC10L3RjFxyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcFVwZGF0ZSA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgIGxldCB4ID0gMDtcclxuICAgIGxldCB5ID0gMDtcclxuICAgIGxldCAkZWwgPSAkZGF5O1xyXG4gICAgZG8ge1xyXG4gICAgICAgIHkgKz0gJGVsLm9mZnNldFRvcDtcclxuICAgICAgICB4ICs9ICRlbC5vZmZzZXRMZWZ0O1xyXG4gICAgfSB3aGlsZSAoKCRlbCA9ICRlbC5vZmZzZXRQYXJlbnQpICYmICRlbCAhPSB0aGlzLl8kcGlja2VyKTtcclxuXHJcbiAgICB0aGlzLl8kdG9vbHRpcC5zdHlsZS50b3AgPSBNYXRoLnJvdW5kKHkgLSB0aGlzLl8kdG9vbHRpcC5vZmZzZXRIZWlnaHQpICsgJ3B4JztcclxuICAgIHRoaXMuXyR0b29sdGlwLnN0eWxlLmxlZnQgPSBNYXRoLnJvdW5kKHggKyAkZGF5Lm9mZnNldFdpZHRoIC8gMiAtIHRoaXMuXyR0b29sdGlwLm9mZnNldFdpZHRoIC8gMikgKyAncHgnO1xyXG59XHJcblxyXG4vKipcclxuICog0KHQutGA0YvRgtGMINC/0L7QtNGB0LrQsNC30LrRg1xyXG4gKi9cclxuRGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZS5fdG9vbHRpcEhpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuXyR0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNob3cnKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCi0LXQutGB0YIg0L/QvtC00YHQutCw0LfQutC4INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXHJcbiAqIEBwYXJhbSAge051bWJlcn0gZGF5cyDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9maWx0ZXJUb29sdGlwVGV4dCA9IGZ1bmN0aW9uKGRheXMpIHtcclxuICAgIHJldHVybiB0aGlzLnBsdXJhbChkYXlzLCBbJyVkINC00LXQvdGMJywgJyVkINC00L3RjycsICclZCDQtNC90LXQuSddKS5yZXBsYWNlKCclZCcsIGRheXMpO1xyXG59XHJcblxyXG4vKipcclxuICog0KTQuNC70YzRgtGAINC90LXQtNC+0YHRgtGD0L/QvdGL0YUg0LTQvdC10Lkg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuX2ZpbHRlckxvY2tEYXlzID0gZnVuY3Rpb24oKSB7XHJcbiAgICAvLyDQstGB0LUg0LTQvdC4INC00L7RgdGC0YPQv9C90YtcclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7QsdGL0YLQuNC1INC40LfQvNC10L3QtdC90LjRjyDRgNCw0LfQvNC10YDQvtCyINC+0LrQvdCwXHJcbiAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9vbldpbmRvd1Jlc2l6ZUV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbi4kZGF5X3RvKSB7XHJcbiAgICAgICAgdGhpcy5fdG9vbHRpcFVwZGF0ZSh0aGlzLl9zZWxlY3Rpb24uJGRheV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGJyZWFrcG9pbnQgPSAwO1xyXG4gICAgY29uc3QgYnJlYWtwb2ludHMgPSBPYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHMpLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcclxuICAgIGZvciAobGV0IGkgaW4gYnJlYWtwb2ludHMpIHtcclxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPD0gYnJlYWtwb2ludHNbaV0pIHtcclxuICAgICAgICAgICAgYnJlYWtwb2ludCA9IGJyZWFrcG9pbnRzW2ldO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fc2V0QnJlYWtwb2ludChicmVha3BvaW50KTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCj0YHRgtCw0L3QvtCy0LrQsCDRgdC+0YHRgtC+0Y/QvdC40Y8g0YDQtdC90LTQtdGA0LAg0L/QvtC0INGA0LDQt9C90YvQtSDRjdC60YDQsNC90YtcclxuICogQHBhcmFtIHtOdW1iZXJ9IGJyZWFrcG9pbnQg0JrQu9GO0Ycg0LjQtyB0aGlzLm9wdGlvbnMuYnJlYWtwb2ludHMgKNCo0LjRgNC40L3QsCDRjdC60YDQsNC90LApXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9zZXRCcmVha3BvaW50ID0gZnVuY3Rpb24oYnJlYWtwb2ludCkge1xyXG4gICAgLy8g0L7RgiDQvdC10L3Rg9C20L3QvtC5INC/0LXRgNC10YDQuNGB0L7QstC60LhcclxuICAgIGlmICh0aGlzLl9icmVha3BvaW50ID09IGJyZWFrcG9pbnQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLl9icmVha3BvaW50ID0gYnJlYWtwb2ludDtcclxuXHJcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5icmVha3BvaW50c1ticmVha3BvaW50XSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzW2JyZWFrcG9pbnRdKTtcclxuICAgIHRoaXMuXyRjcmVhdGVNb250aHModGhpcy5fc2VsZWN0ZWREYXRlKTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCt0LvQtdC80LXQvdGCINC60LDQu9C10L3QtNCw0YDQvdC+0LPQviDQtNC90Y9cclxuICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gKiBAcmV0dXJuIHtFbGVtZW50fSAgIEhUTUwg0Y3Qu9C10LzQtdC90YJcclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRnZXREYXlCeURhdGUgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICBjb25zdCB0aW1lID0gZGF0ZSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlLmdldFRpbWUoKSA6IDA7XHJcbiAgICByZXR1cm4gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuRGF5W2RhdGEtdGltZT1cIicgKyB0aW1lICsgJ1wiXScpO1xyXG59XHJcblxyXG4vKipcclxuICog0KDQtdC90LTQtdGAINC00L3RjyAtINC30LDQs9C70YPRiNC60LhcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVFbXB0eURheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3QgJGRheSA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5IGlzLWVtcHR5XCI+PC9kaXY+YFxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gJGRheTtcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7Qt9C00LDQvdC40LUg0Y3Qu9C10LzQtdC90YLQsCDQuNC3IEhUTUwg0YLQtdC60YHRgtCwXHJcbiAqIEBwYXJhbSAge1N0cmluZ30gaHRtbCBIVE1MINGC0LXQutGB0YJcclxuICogQHJldHVybiB7RWxlbWVudH1cclxuICovXHJcbkRhdGVSYW5nZVBpY2tlci5wcm90b3R5cGUuXyRjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24oaHRtbCkge1xyXG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkaXYuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgaHRtbCk7XHJcbiAgICByZXR1cm4gZGl2LmNoaWxkcmVuLmxlbmd0aCA+IDEgPyBkaXYuY2hpbGRyZW4gOiBkaXYuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTYWZlINCy0YvQt9C+0LIg0LLQvdC10YjQvdC40YUg0YHQvtCx0YvRgtC40Lkg0LrQvtC80L/QvtC90LXQvdGC0LBcclxuICogQHBhcmFtIHtTdHJpbmd9IGYg0JjQvNGPINGB0L7QsdGL0YLQuNGPXHJcbiAqL1xyXG5EYXRlUmFuZ2VQaWNrZXIucHJvdG90eXBlLl9jYWxsYmFjayA9IGZ1bmN0aW9uKGYpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uW2ZdID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm9uW2ZdLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuO1xyXG59XHJcblxyXG4vKiBoYXJtb255IGRlZmF1bHQgZXhwb3J0ICovIGNvbnN0IF9fV0VCUEFDS19ERUZBVUxUX0VYUE9SVF9fID0gKERhdGVSYW5nZVBpY2tlcik7XHJcblxufSkoKTtcblxuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX2V4cG9ydHNfXztcbi8qKioqKiovIH0pKClcbjtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW5kbFluQmhZMnM2THk5a1lYUmxjbUZ1WjJWd2FXTnJaWEl2ZDJWaWNHRmpheTkxYm1sMlpYSnpZV3hOYjJSMWJHVkVaV1pwYm1sMGFXOXVJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTkzWldKd1lXTnJMMkp2YjNSemRISmhjQ0lzSW5kbFluQmhZMnM2THk5a1lYUmxjbUZ1WjJWd2FXTnJaWEl2ZDJWaWNHRmpheTl5ZFc1MGFXMWxMMlJsWm1sdVpTQndjbTl3WlhKMGVTQm5aWFIwWlhKeklpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOTNaV0p3WVdOckwzSjFiblJwYldVdmFHRnpUM2R1VUhKdmNHVnlkSGtnYzJodmNuUm9ZVzVrSWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k5M1pXSndZV05yTDNKMWJuUnBiV1V2YldGclpTQnVZVzFsYzNCaFkyVWdiMkpxWldOMElpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOHVMM055WXk5elkzTnpMMmx1WkdWNExuTmpjM01pTENKM1pXSndZV05yT2k4dlpHRjBaWEpoYm1kbGNHbGphMlZ5THk0dmMzSmpMMnB6TDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxFTkJRVU03UVVGRFJDeFBPenRWUTFaQk8xVkJRMEU3T3pzN08xZERSRUU3VjBGRFFUdFhRVU5CTzFkQlEwRTdWMEZEUVN4M1EwRkJkME1zZVVOQlFYbERPMWRCUTJwR08xZEJRMEU3VjBGRFFTeEZPenM3T3p0WFExQkJMSGRHT3pzN096dFhRMEZCTzFkQlEwRTdWMEZEUVR0WFFVTkJMSE5FUVVGelJDeHJRa0ZCYTBJN1YwRkRlRVU3VjBGRFFTd3JRMEZCSzBNc1kwRkJZenRYUVVNM1JDeEZPenM3T3pzN096czdPenM3UVVOT1FUczdPenM3T3pzN096czdPenM3TzBGRFFVRTdRVUZEVHp0QlFVTkJPenRCUVVWUUxHbEVRVUZwUkR0QlFVTnFSRHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxEQkVRVUV3UkR0QlFVTXhSRHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNVMEZCVXl4clFrRkJhMEk3UVVGRE0wSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hUUVVGVExITkNRVUZ6UWp0QlFVTXZRanM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRXNjVVZCUVhGRk96dEJRVVZ5UlR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdOQlFXTTdRVUZEWkR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZsQlFWa3NTMEZCU3p0QlFVTnFRaXhaUVVGWk8wRkJRMW83UVVGRFFUdEJRVU5CTEdkRVFVRm5SQ3hqUVVGak8wRkJRemxFTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVmtzUzBGQlN6dEJRVU5xUWl4WlFVRlpMRTlCUVU4N1FVRkRia0lzV1VGQldUdEJRVU5hTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQkxHMUNRVUZ0UWl4UFFVRlBPMEZCUXpGQ08wRkJRMEU3UVVGRFFUdEJRVU5CTEdsRVFVRnBSQ3hwUWtGQmFVSTdRVUZEYkVVc1UwRkJVenRCUVVOVU96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRXNTMEZCU3pzN1FVRkZURHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WlFVRlpMRXRCUVVzN1FVRkRha0lzV1VGQldTeFBRVUZQTzBGQlEyNUNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGZEJRVmNzUzBGQlN6dEJRVU5vUWl4WFFVRlhMRXRCUVVzN1FVRkRhRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzV1VGQldTeExRVUZMTzBGQlEycENMRmxCUVZrc1QwRkJUenRCUVVOdVFpeFpRVUZaTzBGQlExbzdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WlFVRlpPMEZCUTFvc1dVRkJXVHRCUVVOYUxGbEJRVms3UVVGRFdqdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WlFVRlpMRXRCUVVzN1FVRkRha0lzV1VGQldTeFJRVUZSTzBGQlEzQkNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFpRVUZaTEU5QlFVODdRVUZEYmtJc1dVRkJXU3hOUVVGTk8wRkJRMnhDTEZsQlFWazdRVUZEV2p0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNWMEZCVnl4TFFVRkxPMEZCUTJoQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4dFFrRkJiVUlzT0VKQlFUaENPMEZCUTJwRU8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJMRzFDUVVGdFFpeHZRa0ZCYjBJN1FVRkRka003UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1UwRkJVenM3UVVGRlZEdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRXRCUVVzN1FVRkRhRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQkxIbERRVUY1UXl4bFFVRmxPMEZCUTNoRU8wRkJRMEVzTmtSQlFUWkVMRFpGUVVFMlJUdEJRVU14U1R0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxEUkRRVUUwUXl4WFFVRlhMRWRCUVVjc2JVSkJRVzFDTzBGQlF6ZEZMRFpFUVVFMlJDdzJSVUZCTmtVN1FVRkRNVWs3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMSFZEUVVGMVF6dEJRVU4yUXl4elJFRkJjMFFzVjBGQlZ6dEJRVU5xUlN4aFFVRmhMRmRCUVZjN1FVRkRlRUk3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hUUVVGVExEaERRVUU0UXp0QlFVTjJSQ3hUUVVGVExEaERRVUU0UXp0QlFVTjJSRHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFc1UwRkJVenRCUVVOVUxFdEJRVXM3TzBGQlJVdzdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRk5CUVZNN08wRkJSVlE3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEZGQlFWRTdRVUZEYmtJc1YwRkJWeXhQUVVGUE8wRkJRMnhDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEV0QlFVczdRVUZEYUVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1dVRkJXU3hMUVVGTE8wRkJRMnBDTEZsQlFWazdRVUZEV2p0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGbEJRVmtzUzBGQlN6dEJRVU5xUWl4WlFVRlpPMEZCUTFvN1FVRkRRVHRCUVVOQk8wRkJRMEVzZFVOQlFYVkRMR1ZCUVdVc1kwRkJZeXhqUVVGakxFbEJRVWtzWlVGQlpUdEJRVU55UnpzN1FVRkZRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEV0QlFVczdRVUZEVERzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eFJRVUZSTzBGQlEyNUNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzUzBGQlN6dEJRVU5NT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hYUVVGWExGRkJRVkU3UVVGRGJrSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eE5RVUZOTzBGQlEycENPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRTFCUVUwN1FVRkRha0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxGZEJRVmNzVVVGQlVUdEJRVU51UWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1VVRkJVVHRCUVVOdVFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRXNTMEZCU3p0QlFVTk1PMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEV0QlFVczdPMEZCUlV3N1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRXRCUVVzN1FVRkRhRUlzVjBGQlZ5eExRVUZMTzBGQlEyaENPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxHMUNRVUZ0UWl4clFrRkJhMEk3UVVGRGNrTTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hYUVVGWExGRkJRVkU3UVVGRGJrSXNWMEZCVnl4UFFVRlBPMEZCUTJ4Q08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVjBGQlZ5eFJRVUZSTzBGQlEyNUNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4TFFVRkxPenRCUVVWTU8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrc1QwRkJUenRCUVVOdVFpeFpRVUZaTzBGQlExbzdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZsQlFWazdRVUZEV2p0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WFFVRlhMRTFCUVUwN1FVRkRha0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmRCUVZjc1QwRkJUenRCUVVOc1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4WlFVRlpMRXRCUVVzN1FVRkRha0lzV1VGQldTeFJRVUZSTzBGQlEzQkNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMRmxCUVZrN1FVRkRXanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEZsQlFWa3NUMEZCVHp0QlFVTnVRaXhaUVVGWk8wRkJRMW83UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeFhRVUZYTEU5QlFVODdRVUZEYkVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQkxHbEZRVUZsTEdWQlFXVXNSVUZCUXlJc0ltWnBiR1VpT2lKa1lYUmxjbUZ1WjJWd2FXTnJaWEl1YW5NaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SW9ablZ1WTNScGIyNGdkMlZpY0dGamExVnVhWFpsY25OaGJFMXZaSFZzWlVSbFptbHVhWFJwYjI0b2NtOXZkQ3dnWm1GamRHOXllU2tnZTF4dVhIUnBaaWgwZVhCbGIyWWdaWGh3YjNKMGN5QTlQVDBnSjI5aWFtVmpkQ2NnSmlZZ2RIbHdaVzltSUcxdlpIVnNaU0E5UFQwZ0oyOWlhbVZqZENjcFhHNWNkRngwYlc5a2RXeGxMbVY0Y0c5eWRITWdQU0JtWVdOMGIzSjVLQ2s3WEc1Y2RHVnNjMlVnYVdZb2RIbHdaVzltSUdSbFptbHVaU0E5UFQwZ0oyWjFibU4wYVc5dUp5QW1KaUJrWldacGJtVXVZVzFrS1Z4dVhIUmNkR1JsWm1sdVpTaGNJa1JoZEdWeVlXNW5aWEJwWTJ0bGNsd2lMQ0JiWFN3Z1ptRmpkRzl5ZVNrN1hHNWNkR1ZzYzJVZ2FXWW9kSGx3Wlc5bUlHVjRjRzl5ZEhNZ1BUMDlJQ2R2WW1wbFkzUW5LVnh1WEhSY2RHVjRjRzl5ZEhOYlhDSkVZWFJsY21GdVoyVndhV05yWlhKY0lsMGdQU0JtWVdOMGIzSjVLQ2s3WEc1Y2RHVnNjMlZjYmx4MFhIUnliMjkwVzF3aVJHRjBaWEpoYm1kbGNHbGphMlZ5WENKZElEMGdabUZqZEc5eWVTZ3BPMXh1ZlNrb2MyVnNaaXdnWm5WdVkzUnBiMjRvS1NCN1hHNXlaWFIxY200Z0lpd2lMeThnVkdobElISmxjWFZwY21VZ2MyTnZjR1ZjYm5aaGNpQmZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZJRDBnZTMwN1hHNWNiaUlzSWk4dklHUmxabWx1WlNCblpYUjBaWElnWm5WdVkzUnBiMjV6SUdadmNpQm9ZWEp0YjI1NUlHVjRjRzl5ZEhOY2JsOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHVaQ0E5SUNobGVIQnZjblJ6TENCa1pXWnBibWwwYVc5dUtTQTlQaUI3WEc1Y2RHWnZjaWgyWVhJZ2EyVjVJR2x1SUdSbFptbHVhWFJwYjI0cElIdGNibHgwWEhScFppaGZYM2RsWW5CaFkydGZjbVZ4ZFdseVpWOWZMbThvWkdWbWFXNXBkR2x2Yml3Z2EyVjVLU0FtSmlBaFgxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NXZLR1Y0Y0c5eWRITXNJR3RsZVNrcElIdGNibHgwWEhSY2RFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2hsZUhCdmNuUnpMQ0JyWlhrc0lIc2daVzUxYldWeVlXSnNaVG9nZEhKMVpTd2daMlYwT2lCa1pXWnBibWwwYVc5dVcydGxlVjBnZlNrN1hHNWNkRngwZlZ4dVhIUjlYRzU5T3lJc0lsOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHVieUE5SUNodlltb3NJSEJ5YjNBcElEMCtJQ2hQWW1wbFkzUXVjSEp2ZEc5MGVYQmxMbWhoYzA5M2JsQnliM0JsY25SNUxtTmhiR3dvYjJKcUxDQndjbTl3S1NraUxDSXZMeUJrWldacGJtVWdYMTlsYzAxdlpIVnNaU0J2YmlCbGVIQnZjblJ6WEc1ZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxuSWdQU0FvWlhod2IzSjBjeWtnUFQ0Z2UxeHVYSFJwWmloMGVYQmxiMllnVTNsdFltOXNJQ0U5UFNBbmRXNWtaV1pwYm1Wa0p5QW1KaUJUZVcxaWIyd3VkRzlUZEhKcGJtZFVZV2NwSUh0Y2JseDBYSFJQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrb1pYaHdiM0owY3l3Z1UzbHRZbTlzTG5SdlUzUnlhVzVuVkdGbkxDQjdJSFpoYkhWbE9pQW5UVzlrZFd4bEp5QjlLVHRjYmx4MGZWeHVYSFJQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrb1pYaHdiM0owY3l3Z0oxOWZaWE5OYjJSMWJHVW5MQ0I3SUhaaGJIVmxPaUIwY25WbElIMHBPMXh1ZlRzaUxDSXZMeUJsZUhSeVlXTjBaV1FnWW5rZ2JXbHVhUzFqYzNNdFpYaDBjbUZqZEMxd2JIVm5hVzVjYm1WNGNHOXlkQ0I3ZlRzaUxDSXZMeURSZ2RDKzBZSFJndEMrMFkvUXZkQzQwWThnMExmUXNOQ3gwTHZRdnRDNjBMalJnTkMrMExMUXNOQzkwTDNSaTlHRklOQzAwTERSZ2x4eVhHNWxlSEJ2Y25RZ1kyOXVjM1FnVEU5RFMxOVZUa0ZXUVVsTVFVSk1SU0E5SURFN1hISmNibVY0Y0c5eWRDQmpiMjV6ZENCTVQwTkxYMHhQUTB0RlJDQWdJQ0FnSUQwZ01qdGNjbHh1WEhKY2JtWjFibU4wYVc5dUlFUmhkR1ZTWVc1blpWQnBZMnRsY2lna1kyOXVkR0ZwYm1WeUxDQnZjSFJwYjI1eklEMGdlMzBwSUh0Y2NseHVJQ0FnSUM4dklOQyswWUlnMEwvUXZ0Q3kwWUxRdnRHQTBMM1F2dEM1SU5DNDBMM1F1TkdHMExqUXNOQzcwTGpRdDlDdzBZYlF1TkM0WEhKY2JpQWdJQ0JwWmlBb0pHTnZiblJoYVc1bGNpNXBibk4wWVc1alpTa2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUFrWTI5dWRHRnBibVZ5TG1sdWMzUmhibU5sTzF4eVhHNGdJQ0FnZlZ4eVhHNGdJQ0FnSkdOdmJuUmhhVzVsY2k1cGJuTjBZVzVqWlNBOUlIUm9hWE03WEhKY2JseHlYRzRnSUNBZ2RHaHBjeTVmSkdOdmJuUmhhVzVsY2lBOUlDUmpiMjUwWVdsdVpYSTdYSEpjYmx4eVhHNGdJQ0FnZEdocGN5NXZjSFJwYjI1eklEMGdlMXh5WEc0Z0lDQWdJQ0FnSUdacGNuTjBSR0Y1VDJaVWFHVlhaV1ZyT2lCdmNIUnBiMjV6TG1acGNuTjBSR0Y1VDJaVWFHVlhaV1ZySUh4OElERXNJQ0FnSUNBZ0lDQWdJQzh2SU5DLzBMWFJnTkN5MFl2UXVTRFF0TkMxMEwzUmpDRFF2ZEMxMExUUXRkQzcwTGdzSURBZ1BTRFFzdEdCTENBeElEMGcwTC9RdlN3Z0xpNHVYSEpjYmlBZ0lDQWdJQ0FnYzJsdVoyeGxUVzlrWlRvZ0lDQWdJQ0FnSUc5d2RHbHZibk11YzJsdVoyeGxUVzlrWlNBZ0lDQWdJQ0FnZkh3Z1ptRnNjMlVzSUNBZ0lDQWdMeThnMExMUmk5Q3gwTDdSZ0NEUXZ0QzAwTDNRdnRDNUlOQzAwTERSZ3RHTElOQ3kwTHpRdGRHQjBZTFF2aURRdE5DNDBMRFF2OUN3MExmUXZ0QzkwTEJjY2x4dUlDQWdJQ0FnSUNCc2IyTmhiR1U2SUNBZ0lDQWdJQ0FnSUNBZ2IzQjBhVzl1Y3k1c2IyTmhiR1VnSUNBZ0lDQWdJQ0FnSUNCOGZDQW5jblV0VWxVbkxGeHlYRzRnSUNBZ0lDQWdJRzFwYmtSaGVYTTZJQ0FnSUNBZ0lDQWdJQ0J2Y0hScGIyNXpMbTFwYmtSaGVYTWdJQ0FnSUNBZ0lDQWdJSHg4SURFc0lDQWdJQ0FnSUNBZ0lDOHZJTkM4MExqUXZkQzQwTHpRc05DNzBZelF2ZEMrMExVZzBMclF2dEM3MExqUmg5QzEwWUhSZ3RDeTBMNGcwTFRRdmRDMTBMa2cwTElnMExUUXVOQ3cwTC9Rc05DMzBMN1F2ZEMxWEhKY2JpQWdJQ0FnSUNBZ2JXOXVkR2h6UTI5MWJuUTZJQ0FnSUNBZ0lHOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUWdJQ0FnSUNBZ2ZId2dNVElzWEhKY2JpQWdJQ0FnSUNBZ2NHVnlVbTkzT2lBZ0lDQWdJQ0FnSUNBZ0lHOXdkR2x2Ym5NdWNHVnlVbTkzSUNBZ0lDQWdJQ0FnSUNBZ2ZId2dkVzVrWldacGJtVmtMQ0FnTHk4ZzBMclF2dEM3MExqUmg5QzEwWUhSZ3RDeTBMNGcwTHpRdGRHQjBZL1JodEMxMExJZzBMSWcwWURSajlDMDBZTmNjbHh1SUNBZ0lDQWdJQ0J0YVc1RVlYUmxPaUFnSUNBZ0lDQWdJQ0FnYjNCMGFXOXVjeTV0YVc1RVlYUmxJQ0FnSUNBZ0lDQWdJQ0I4ZkNCdVpYY2dSR0YwWlNncExDQXZMeURRdk5DNDBMM1F1TkM4MExEUXU5R00wTDNRc05HUElOQzAwTERSZ3RDd1hISmNiaUFnSUNBZ0lDQWdiV0Y0UkdGMFpUb2dJQ0FnSUNBZ0lDQWdJRzl3ZEdsdmJuTXViV0Y0UkdGMFpTQWdJQ0FnSUNBZ0lDQWdmSHdnZFc1a1pXWnBibVZrTEZ4eVhHNGdJQ0FnSUNBZ0lHSnlaV0ZyY0c5cGJuUnpPaUFnSUNBZ0lDQnZjSFJwYjI1ekxtSnlaV0ZyY0c5cGJuUnpJQ0FnSUNBZ0lIeDhJSHQ5TEZ4eVhHNGdJQ0FnSUNBZ0lHbHVkR1Z5Ym1Gc1NXNXdkWFJ6T2lBZ0lDQnZjSFJwYjI1ekxtbHVkR1Z5Ym1Gc1NXNXdkWFJ6SUNBZ0lIeDhJSFJ5ZFdVc0lDQWdJQ0FnSUM4dklOQzQwWUhRdjlDKzBMdlJqTkMzMEw3UXN0Q3cwTDNRdU5DMUlOQ3kwWUhSZ3RHQTBMN1F0ZEM5MEwzUmk5R0ZJTkM0MEwzUXY5R0QwWUxRdnRDeVhISmNiaUFnSUNBZ0lDQWdMeThnMFlIUXZ0Q3gwWXZSZ3RDNDBZOWNjbHh1SUNBZ0lDQWdJQ0J2YmpvZ1QySnFaV04wTG1GemMybG5iaWg3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSEpoYm1kbFUyVnNaV04wT2lCdWRXeHNMQ0F2THlEUmdkQyswTEhSaTlHQzBMalF0U0RRc3RHTDBMSFF2dEdBMExBZzBMVFF1TkN3MEwvUXNOQzMwTDdRdmRDd0lOQzAwTERSZ2x4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JrWVhsVFpXeGxZM1E2SUNBZ2JuVnNiQ3dnTHk4ZzBZSFF2dEN4MFl2Umd0QzQwTFVnMExMUmk5Q3gwTDdSZ05Dd0lOQyswTFRRdmRDKzBMa2cwTFRRc05HQzBZc2dLTkdDMEw3UXU5R00wTHJRdmlEUXY5R0EwTGdnYzJsdVoyeGxUVzlrWlRvZ2RISjFaU2xjY2x4dUlDQWdJQ0FnSUNCOUxDQnZjSFJwYjI1ekxtOXVJSHg4SUh0OUtTeGNjbHh1SUNBZ0lDQWdJQ0F2THlEUmhOQzQwTHZSak5HQzBZRFJnOUdPMFluUXVOQzFJTkM4MExYUmd0QyswTFRSaTF4eVhHNGdJQ0FnSUNBZ0lHWnBiSFJsY2pvZ1QySnFaV04wTG1GemMybG5iaWg3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR3h2WTJ0RVlYbHpPaUFnSUNCMGFHbHpMbDltYVd4MFpYSk1iMk5yUkdGNWN5d2dJQ0FnTHk4Z1kyRnNiR0poWTJzb1pHRjBaU2tnMFlUUmc5QzkwTHJSaHRDNDBZOGcwTEhRdTlDKzBMclF1TkdBMEw3UXN0Q3cwTDNRdU5HUElOQzAwTERSZ2l3Z2RISjFaUzlNVDBOTFhISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSdmIyeDBhWEJVWlhoME9pQjBhR2x6TGw5bWFXeDBaWEpVYjI5c2RHbHdWR1Y0ZEN3Z0x5OGdZMkZzYkdKaFkyc29aR0Y1Y3lrZzBMTFJpOUN5MEw3UXRDRFJndEMxMExyUmdkR0MwTEFnMEwvUXZ0QzAwWUhRdXRDdzBMZlF1dEM0WEhKY2JpQWdJQ0FnSUNBZ2ZTd2diM0IwYVc5dWN5NW1hV3gwWlhJZ2ZId2dlMzBwTEZ4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lIUm9hWE11YVc1cGRDZ3BPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZzBKalF2ZEM0MFliUXVOQ3cwTHZRdU5DMzBMRFJodEM0MFk5Y2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdWFXNXBkQ0E5SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ0x5OGcwWURSajlDMDBMM1F2dEdCMFlMUmpGeHlYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQjBhR2x6TG05d2RHbHZibk11Y0dWeVVtOTNJRDA5SUNkMWJtUmxabWx1WldRbktTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxuQmxjbEp2ZHlBOUlIUm9hWE11YjNCMGFXOXVjeTV0YjI1MGFITkRiM1Z1ZER0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtMXBia1JoZEdVcElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdWJXbHVSR0YwWlM1elpYUkliM1Z5Y3lnd0xDQXdMQ0F3TENBd0tUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUXZ0Qy8wWWJRdU5DNElOQzAwTHZSanlEUmpkQzYwWURRc05DOTBMN1FzaURRdjlDK0lOR0QwTHpRdnRDNzBZZlFzTkM5MExqUmpseHlYRzRnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbUp5WldGcmNHOXBiblJ6VzNSb2FYTXVYMkp5WldGcmNHOXBiblFnUFNBd1hTQTlJRTlpYW1WamRDNWhjM05wWjI0b2UzMHNJSFJvYVhNdWIzQjBhVzl1Y3lrN1hISmNibHh5WEc0Z0lDQWdMeThnMFlMUXRkQzYwWVBSaWRDNDBMa2cwTFRRdGRDOTBZeGNjbHh1SUNBZ0lIUm9hWE11WDNSdlpHRjVJRDBnYm1WM0lFUmhkR1VvS1R0Y2NseHVJQ0FnSUhSb2FYTXVYM1J2WkdGNUxuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc1Y2NseHVJQ0FnSUhSb2FYTXVYeVJ3YVdOclpYSWdQU0IwYUdsekxsOGtZM0psWVhSbFJXeGxiV1Z1ZENoY2NseHVJQ0FnSUNBZ0lDQmdQR1JwZGlCamJHRnpjejFjSWtSaGRHVnlZVzVuWlhCcFkydGxjbHdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FrZTNSb2FYTXViM0IwYVc5dWN5NXBiblJsY201aGJFbHVjSFYwY3lBL1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmdQR1JwZGlCamJHRnpjejFjSWtSaGRHVnlZVzVuWlhCcFkydGxjbDlmYVc1d2RYUnpYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR2x1Y0hWMElIUjVjR1U5WENKb2FXUmtaVzVjSWlCdVlXMWxQVndpWkdGMFpWOW1jbTl0WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdsdWNIVjBJSFI1Y0dVOVhDSm9hV1JrWlc1Y0lpQnVZVzFsUFZ3aVpHRjBaVjkwYjF3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1lDQTZJQ2NuWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjejFjSWtSaGRHVnlZVzVuWlhCcFkydGxjbDlmYlc5dWRHaHpYQ0krUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pFWVhSbGNtRnVaMlZ3YVdOclpYSmZYM1J2YjJ4MGFYQmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSkVZWFJsY21GdVoyVndhV05yWlhKZlgzUnZiMngwYVhBdFkyOXVkR1Z1ZEZ3aVBqd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0E4TDJScGRqNWdYSEpjYmlBZ0lDQXBPMXh5WEc1Y2NseHVJQ0FnSUM4dklOR04wTHZRdGRDODBMWFF2ZEdDMFl0Y2NseHVJQ0FnSUhSb2FYTXVYeVJ0YjI1MGFITWdJQ0FnSUNBZ0lDQTlJSFJvYVhNdVh5UndhV05yWlhJdWNYVmxjbmxUWld4bFkzUnZjaWduTGtSaGRHVnlZVzVuWlhCcFkydGxjbDlmYlc5dWRHaHpKeWs3WEhKY2JpQWdJQ0IwYUdsekxsOGtkRzl2YkhScGNDQWdJQ0FnSUNBZ1BTQjBhR2x6TGw4a2NHbGphMlZ5TG5GMVpYSjVVMlZzWldOMGIzSW9KeTVFWVhSbGNtRnVaMlZ3YVdOclpYSmZYM1J2YjJ4MGFYQW5LVHRjY2x4dUlDQWdJSFJvYVhNdVh5UjBiMjlzZEdsd1EyOXVkR1Z1ZENBOUlIUm9hWE11WHlSd2FXTnJaWEl1Y1hWbGNubFRaV3hsWTNSdmNpZ25Ma1JoZEdWeVlXNW5aWEJwWTJ0bGNsOWZkRzl2YkhScGNDMWpiMjUwWlc1MEp5azdYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBML1F2dEM3MFk4ZzBMTFFzdEMrMExUUXNGeHlYRzRnSUNBZ2RHaHBjeTVmSkdsdWNIVjBSbkp2YlNBOUlIUm9hWE11WHlSd2FXTnJaWEl1Y1hWbGNubFRaV3hsWTNSdmNpZ25XMjVoYldVOVhDSmtZWFJsWDJaeWIyMWNJbDBuS1R0Y2NseHVJQ0FnSUhSb2FYTXVYeVJwYm5CMWRGUnZJQ0FnUFNCMGFHbHpMbDhrY0dsamEyVnlMbkYxWlhKNVUyVnNaV04wYjNJb0oxdHVZVzFsUFZ3aVpHRjBaVjkwYjF3aVhTY3BPMXh5WEc1Y2NseHVJQ0FnSUM4dklOQzQwTDNRdU5HRzBMalFzTkM3MExqUXQ5Q3cwWWJRdU5HUElOR0IwTDdSZ2RHQzBMN1JqOUM5MExqUXVWeHlYRzRnSUNBZ2RHaHBjeTV5WVc1blpWSmxjMlYwS0NrN1hISmNibHh5WEc0Z0lDQWdMeThnMFlEUXRkQzkwTFRRdGRHQVhISmNiaUFnSUNCMGFHbHpMbDl6Wld4bFkzUkVZWFJsS0hSb2FYTXViM0IwYVc5dWN5NXRhVzVFWVhSbEtUdGNjbHh1SUNBZ0lIUm9hWE11WHlSamIyNTBZV2x1WlhJdVlYQndaVzVrUTJocGJHUW9kR2hwY3k1ZkpIQnBZMnRsY2lrN1hISmNibHh5WEc0Z0lDQWdMeThnMEw3UXNkR0EwTERRc2RDKzBZTFF1dEN3SU5DeDBZRFF0ZEM1MExyUXY5QyswTGpRdmRHQzBMN1FzbHh5WEc0Z0lDQWdhV1lnS0U5aWFtVmpkQzVyWlhsektIUm9hWE11YjNCMGFXOXVjeTVpY21WaGEzQnZhVzUwY3lrdWJHVnVaM1JvS1NCN1hISmNiaUFnSUNBZ0lDQWdkMmx1Wkc5M0xtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0ozSmxjMmw2WlNjc0lIUm9hWE11WDI5dVYybHVaRzkzVW1WemFYcGxSWFpsYm5RdVltbHVaQ2gwYUdsektTazdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZiMjVYYVc1a2IzZFNaWE5wZW1WRmRtVnVkQ2dwTzF4eVhHNGdJQ0FnZlZ4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSjNRc05DMzBMTFFzTkM5MExqUXRTRFF2TkMxMFlIUmo5R0cwTEJjY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ29nUUhKbGRIVnliaUI3VTNSeWFXNW5mVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSTmIyNTBhRVp2Y20xaGRIUmxaQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJR052Ym5OMElIUnBkR3hsSUQwZ2RHaHBjeTVuWlhSRVlYUmxWR2x0WlVadmNtMWhkQ2hrWVhSbExDQjdiVzl1ZEdnNklDZHNiMjVuSjMwcE8xeHlYRzRnSUNBZ2NtVjBkWEp1SUhScGRHeGxMbk5zYVdObEtEQXNJREVwTG5SdlZYQndaWEpEWVhObEtDa2dLeUIwYVhSc1pTNXpiR2xqWlNneEtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DazBMN1JnTkM4MExEUmd0QzQwWURRdnRDeTBMRFF2ZEM0MExVZzBMVFFzTkdDMFlzZzBMVFF1OUdQSU5HQzBMWFF1dEdEMFluUXRkQzVJTkM3MEw3UXV0Q3cwTHZRdUZ4eVhHNGdLaUJBY0dGeVlXMGdJSHRFWVhSbGZTQWdJR1JoZEdVZ0lDQWcwSjdRc2RHSzBMWFF1dEdDSU5DMDBMRFJndEdMWEhKY2JpQXFJRUJ3WVhKaGJTQWdlMDlpYW1WamRIMGdiM0IwYVc5dWN5RFFuOUN3MFlEUXNOQzgwTFhSZ3RHQTBZdGNjbHh1SUNvZ1FISmxkSFZ5YmlCN1UzUnlhVzVuZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1blpYUkVZWFJsVkdsdFpVWnZjbTFoZENBOUlHWjFibU4wYVc5dUtHUmhkR1VzSUc5d2RHbHZibk1wSUh0Y2NseHVJQ0FnSUhKbGRIVnliaUJKYm5Sc0xrUmhkR1ZVYVcxbFJtOXliV0YwS0hSb2FYTXViM0IwYVc5dWN5NXNiMk5oYkdVc0lHOXdkR2x2Ym5NcExtWnZjbTFoZENoa1lYUmxLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ1UwTDNRdUNEUXZkQzEwTFRRdGRDNzBMaGNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVaMlYwVjJWbGEwUmhlWE5HYjNKdFlYUjBaV1FnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lHTnZibk4wSUdSaGRHVWdQU0J1WlhjZ1JHRjBaU2dwTzF4eVhHNGdJQ0FnWTI5dWMzUWdjbVZ6ZFd4MElEMGdXMTA3WEhKY2JseHlYRzRnSUNBZ1pHRjBaUzV6WlhSRVlYUmxLR1JoZEdVdVoyVjBSR0YwWlNncElDMGdNaWs3WEhKY2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SURjN0lDc3JhU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHUmhkR1V1YzJWMFJHRjBaU2hrWVhSbExtZGxkRVJoZEdVb0tTQXJJREVwTzF4eVhHNGdJQ0FnSUNBZ0lISmxjM1ZzZEM1d2RYTm9LSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdaR0Y1T2lCa1lYUmxMbWRsZEVSaGVTZ3BMRnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhWFJzWlRvZ2RHaHBjeTVuWlhSRVlYUmxWR2x0WlVadmNtMWhkQ2hrWVhSbExDQjdkMlZsYTJSaGVUb2dKM05vYjNKMEozMHBMRnh5WEc0Z0lDQWdJQ0FnSUgwcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5HQjBMN1JnTkdDMExqUmdOQyswTExRdXRDd0lOR0IwTDdRczlDNzBMRFJnZEM5MEw0ZzBMM1FzTkdCMFlMUmdOQyswTFhRdmRDOTBMN1F2TkdESU5DLzBMWFJnTkN5MEw3UXZOR0RJTkMwMEwzUmppRFF2ZEMxMExUUXRkQzcwTGhjY2x4dUlDQWdJSEpsYzNWc2RDNXpiM0owS0NoaExDQmlLU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1ptbHljM1JFWVhsUFpsUm9aVmRsWldzZ1BTQjBhR2x6TG05d2RHbHZibk11Wm1seWMzUkVZWGxQWmxSb1pWZGxaV3NnSlNBM08xeHlYRzRnSUNBZ0lDQWdJR3hsZENCa1lYbEJJRDBnWVM1a1lYazdYSEpjYmlBZ0lDQWdJQ0FnYkdWMElHUmhlVUlnUFNCaUxtUmhlVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdhV1lnS0dSaGVVRWdQVDBnWm1seWMzUkVZWGxQWmxSb1pWZGxaV3NwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQzB4TzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLR1JoZVVJZ1BUMGdabWx5YzNSRVlYbFBabFJvWlZkbFpXc3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlERTdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb1pHRjVRU0E4SUdacGNuTjBSR0Y1VDJaVWFHVlhaV1ZyS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGVVRWdLejBnY21WemRXeDBMbXhsYm1kMGFEdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJR2xtSUNoa1lYbENJRHdnWm1seWMzUkVZWGxQWmxSb1pWZGxaV3NwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWkdGNVFpQXJQU0J5WlhOMWJIUXViR1Z1WjNSb08xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHUmhlVUVnTFNCa1lYbENPMXh5WEc0Z0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ2NtVjBkWEp1SUhKbGMzVnNkRHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2EwTDdRdTlDNDBZZlF0ZEdCMFlMUXN0QytJTkMwMEwzUXRkQzVJTkN5SU5DODBMWFJnZEdQMFliUXRWeHlYRzRnS2lCQWNHRnlZVzBnSUh0RVlYUmxmU0JrWVhSbElOQ2UwTEhSaXRDMTBMclJnaURRdE5DdzBZTFJpMXh5WEc0Z0tpQkFjbVYwZFhKdUlIdE9kVzFpWlhKOUlDQWdJTkNhMEw3UXU5QzQwWWZRdGRHQjBZTFFzdEMrSU5DMDBMM1F0ZEM1WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTG1kbGRFUmhlWE5EYjNWdWRFbHVUVzl1ZEdnZ1BTQm1kVzVqZEdsdmJpaGtZWFJsS1NCN1hISmNiaUFnSUNCamIyNXpkQ0JrWVhseklEMGdibVYzSUVSaGRHVW9aR0YwWlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ1pHRjVjeTV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVJQ0FnSUdSaGVYTXVjMlYwVFc5dWRHZ29aR0Y1Y3k1blpYUk5iMjUwYUNncElDc2dNU2s3WEhKY2JpQWdJQ0JrWVhsekxuTmxkRVJoZEdVb01DazdYSEpjYmlBZ0lDQnlaWFIxY200Z1pHRjVjeTVuWlhSRVlYUmxLQ2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvZEN4MFlEUXZ0R0JJTkN5MFl2UXROQzEwTHZRdGRDOTBMM1JpOUdGSU5DMDBMRFJnbHh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzV5WVc1blpWSmxjMlYwSUQwZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGSmxjMlYwS0NrN1hISmNiaUFnSUNCMGFHbHpMbDl6Wld4bFkzUnBiMjRnUFNCN2ZUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DUzBZdlF0TkMxMEx2UXRkQzkwTGpRdFNEUXROQzQwTERRdjlDdzBMZlF2dEM5MExBZzBMVFFzTkdDWEhKY2JpQXFJRUJ3WVhKaGJTQjdSR0YwWlgwZ1pHRjBaVjltY205dElOQ2QwTERSaDlDdzBMdlJqTkM5MExEUmp5RFF0TkN3MFlMUXNGeHlYRzRnS2lCQWNHRnlZVzBnZTBSaGRHVjlJR1JoZEdWZmRHOGdJQ0RRbXRDKzBMM1F0ZEdIMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbkpoYm1kbFUyVnNaV04wSUQwZ1puVnVZM1JwYjI0b1pHRjBaVjltY205dExDQmtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQmtZWFJsWDJaeWIyMHVjMlYwU0c5MWNuTW9NQ3dnTUN3Z01Dd2dNQ2s3WEhKY2JpQWdJQ0JrWVhSbFgzUnZMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkMwMEw3UXY5R0QwWUhSZ3RDNDBMelJpOUM1SU5DMDBMalFzTkMvMExEUXQ5QyswTDFjY2x4dUlDQWdJR2xtSUNnaGRHaHBjeTVuWlhSSmMxSmhibWRsVTJWc1pXTjBZV0pzWlNoa1lYUmxYMlp5YjIwc0lHUmhkR1ZmZEc4cEtTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdOdmJuTjBJQ1JrWVhsZlpuSnZiU0E5SUhSb2FYTXVYeVJuWlhSRVlYbENlVVJoZEdVb1pHRjBaVjltY205dEtUdGNjbHh1SUNBZ0lHTnZibk4wSUNSa1lYbGZkRzhnUFNCMGFHbHpMbDhrWjJWMFJHRjVRbmxFWVhSbEtHUmhkR1ZmZEc4cE8xeHlYRzVjY2x4dUlDQWdJR2xtSUNna1pHRjVYMlp5YjIwcElIdGNjbHh1SUNBZ0lDQWdJQ0FrWkdGNVgyWnliMjB1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRabkp2YlNjcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJR2xtSUNna1pHRjVYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdKR1JoZVY5MGJ5NWpiR0Z6YzB4cGMzUXVZV1JrS0NkcGN5MXpaV3hsWTNSbFpDY3NJQ2RwY3kxelpXeGxZM1JsWkMxMGJ5Y3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQ3kwWXZRdE5DMTBMdlF0ZEM5MExqUXRTRFJqZEM3MExYUXZOQzEwTDNSZ3RDKzBMSmNjbHh1SUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wS0dSaGRHVmZabkp2YlN3Z1pHRjBaVjkwYnlrN1hISmNibHh5WEc0Z0lDQWdMeThnMExMUmk5Q3gwTDdSZ0NEUXROQ3cwWUlnMExJZzBMN1FzZEdBMExEUmd0QzkwTDdRdkNEUXY5QyswWURSajlDMDBMclF0Vnh5WEc0Z0lDQWdhV1lnS0dSaGRHVmZabkp2YlNBK0lHUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0JiWkdGMFpWOW1jbTl0TENCa1lYUmxYM1J2WFNBOUlGdGtZWFJsWDNSdkxDQmtZWFJsWDJaeWIyMWRPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQyswTEhRdmRDKzBMTFF1OUMxMEwzUXVOQzFJTkM0MEwzUXY5R0QwWUxRdnRDeVhISmNiaUFnSUNCcFppQW9kR2hwY3k1ZkpHbHVjSFYwUm5KdmJTa2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYeVJwYm5CMWRFWnliMjB1ZG1Gc2RXVWdQU0IwYUdsekxtWnZjbTFoZEVSaGRHVW9aR0YwWlY5bWNtOXRLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCcFppQW9kR2hwY3k1ZkpHbHVjSFYwVkc4cElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOGthVzV3ZFhSVWJ5NTJZV3gxWlNBOUlIUm9hWE11Wm05eWJXRjBSR0YwWlNoa1lYUmxYM1J2S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZMeURSZ2RDKzBMSFJpOUdDMExqUXRWeHlYRzRnSUNBZ2RHaHBjeTVmWTJGc2JHSmhZMnNvSjNKaGJtZGxVMlZzWldOMEp5d2daR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2swTDdSZ05DODBMRFJndEM0MFlEUXZ0Q3kwTERRdmRDNDBMVWcwTFRRc05HQzBZdGNjbHh1SUNvZ1FIQmhjbUZ0SUNCN1JHRjBaWDBnSUNCa1lYUmxJQ0FnMEo3UXNkR0swTFhRdXRHQ0lOQzAwTERSZ3RHTFhISmNiaUFxSUVCd1lYSmhiU0FnZTFOMGNtbHVaMzBnWm05eWJXRjBJTkNrMEw3UmdOQzgwTERSZ2lEUmdkR0MwWURRdnRDNjBMaGNjbHh1SUNvZ1FISmxkSFZ5YmlCN1UzUnlhVzVuZlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1bWIzSnRZWFJFWVhSbElEMGdablZ1WTNScGIyNG9aR0YwWlN3Z1ptOXliV0YwSUQwZ0oxa3RiUzFrSnlrZ2UxeHlYRzRnSUNBZ2NtVjBkWEp1SUdadmNtMWhkQzV5WlhCc1lXTmxLQ2RaSnl3Z1pHRjBaUzVuWlhSR2RXeHNXV1ZoY2lncEtWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQzV5WlhCc1lXTmxLQ2R0Snl3Z0tDY3dKeUFySUNoa1lYUmxMbWRsZEUxdmJuUm9LQ2tnS3lBeEtTa3VjMnhwWTJVb0xUSXBLVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM1eVpYQnNZV05sS0Nka0p5d2dLQ2N3SnlBcklDaGtZWFJsTG1kbGRFUmhkR1VvS1NrcExuTnNhV05sS0MweUtTazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW45R0EwTDdRc3RDMTBZRFF1dEN3SU5DeTBMN1F0OUM4MEw3UXR0QzkwTDdSZ2RHQzBMZ2cwTExSaTlDMDBMWFF1OUMxMEwzUXVOR1BJTkMwMExEUmdseHlYRzRnS2lCQWNHRnlZVzBnSUh0RVlYUmxJR1JoZEdWZlpuSnZiU0RRbmRDdzBZZlFzTkM3MFl6UXZkQ3cwWThnMExUUXNOR0MwTEJjY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlNCa1lYUmxYM1J2SUNBZzBKclF2dEM5MExYUmg5QzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdLaUJBY21WMGRYSnVJSHRDYjI5c1pXRnVmVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVuWlhSSmMxSmhibWRsVTJWc1pXTjBZV0pzWlNBOUlHWjFibU4wYVc5dUtHUmhkR1ZmWm5KdmJTd2daR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdaR0YwWlY5bWNtOXRMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNGdJQ0FnWkdGMFpWOTBieTV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVYSEpjYmlBZ0lDQnBaaUFvWkdGMFpWOW1jbTl0SUQ0Z1pHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJRnRrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzlkSUQwZ1cyUmhkR1ZmZEc4c0lHUmhkR1ZmWm5KdmJWMDdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBMelF1TkM5MExqUXZOQ3cwTHZSak5DOTBZdlF1U0RRdE5DNDBMRFF2OUN3MExmUXZ0QzlYSEpjYmlBZ0lDQmpiMjV6ZENCa2FXWm1JRDBnVFdGMGFDNWhZbk1vWkdGMFpWOW1jbTl0TG1kbGRGUnBiV1VvS1NBdElHUmhkR1ZmZEc4dVoyVjBWR2x0WlNncEtTQXZJREV3TURBZ0x5QTROalF3TUR0Y2NseHVJQ0FnSUdsbUlDaGthV1ptSUR3Z2RHaHBjeTV2Y0hScGIyNXpMbTFwYmtSaGVYTXBJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBML1JnTkMrMExMUXRkR0EwTHJRc0NEUXY5QyswTC9Rc05DMDBMRFF2ZEM0MFk4ZzBMSWcwTFRRdU5DdzBML1FzTkMzMEw3UXZTRFF0OUN3MExIUXU5QyswTHJRdU5HQTBMN1FzdEN3MEwzUXZkR0wwWVVnMExUUXNOR0NYSEpjYmlBZ0lDQmpiMjV6ZENCa1lYa2dQU0J1WlhjZ1JHRjBaU2dwTzF4eVhHNGdJQ0FnWkdGNUxuTmxkRlJwYldVb1pHRjBaVjltY205dExtZGxkRlJwYldVb0tTazdYSEpjYmx4eVhHNGdJQ0FnZDJocGJHVWdLR1JoZVNBOElHUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTVuWlhSRVlYbE1iMk5yWldRb1pHRjVLU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQmtZWGt1YzJWMFJHRjBaU2hrWVhrdVoyVjBSR0YwWlNncElDc2dNU2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2NtVjBkWEp1SUhSeWRXVTdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW45R0EwTDdRc3RDMTBZRFF1dEN3SU5DOTBMQWcwTFRRdnRHQjBZTFJnOUMvMEwzUXZ0R0IwWUxSakNEUXROQzkwWThnMExUUXU5R1BJTkN4MFlEUXZ0QzkwTGhjY2x4dUlDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbE5DdzBZTFFzRnh5WEc0Z0tpQkFjbVYwZFhKdUlIdENiMjlzWldGdWZTQWdJSFJ5ZFdVZzBMWFJnZEM3MExnZzBMVFF2dEdCMFlMUmc5Qy8wTFhRdlZ4eVhHNGdLaTljY2x4dVJHRjBaVkpoYm1kbFVHbGphMlZ5TG5CeWIzUnZkSGx3WlM1blpYUkVZWGxNYjJOclpXUWdQU0JtZFc1amRHbHZiaWhrWVhSbEtTQjdYSEpjYmlBZ0lDQXZMeURRc3RHTDBMSFF2dEdBSU5DMDBMRFJnaURRc3RDOTBMVWcwTFRRdnRHQjBZTFJnOUMvMEwzUXZ0Q3owTDRnMExUUXVOQ3cwTC9Rc05DMzBMN1F2ZEN3WEhKY2JpQWdJQ0JwWmlBb1pHRjBaU0E4SUhSb2FYTXViM0IwYVc5dWN5NXRhVzVFWVhSbElIeDhJR1JoZEdVZ1BpQjBhR2x6TG05d2RHbHZibk11YldGNFJHRjBaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCTVQwTkxYMVZPUVZaQlNVeEJRa3hGTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbTl3ZEdsdmJuTXVabWxzZEdWeUxteHZZMnRFWVhsekxtTmhiR3dvZEdocGN5d2daR0YwWlNrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRb2RDNjBMdlF2dEM5MExYUXZkQzQwTFVnS0RFZzBMSFF2dEN4MFpIUmdDd2dNaURRc2RDKzBMSFJnTkN3TENBMUlOQ3gwTDdRc2RHQTBMN1FzaWxjY2x4dUlDb2dRSEJoY21GdElDQjdUblZ0WW1WeWZTQjJZV3gxWlNEUW10QyswTHZRdU5HSDBMWFJnZEdDMExMUXZseHlYRzRnS2lCQWNHRnlZVzBnSUh0QmNuSmhlWDBnSUdadmNtMXpJTkNjMExEUmdkR0IwTGpRc2lEUXVOQzNJRFBSaFNEUmpkQzcwTFhRdk5DMTBMM1JndEMrMExJc0lOQzgwTDdRdHRDMTBZSWcwWUhRdnRDMDBMWFJnTkMyMExEUmd0R01JTkdCMEwvUXRkR0cwTGpSaE5DNDBMclFzTkdDMEw3UmdDQWxaQ0RRdE5DNzBZOGcwTGZRc05DODBMWFF2ZEdMWEhKY2JpQXFJRUJ5WlhSMWNtNGdlMU4wY21sdVozMWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVjR3gxY21Gc0lEMGdablZ1WTNScGIyNGdLSFpoYkhWbExDQm1iM0p0Y3lrZ2UxeHlYRzRnSUNBZ2NtVjBkWEp1SUNoMllXeDFaU0FsSURFd0lEMDlJREVnSmlZZ2RtRnNkV1VnSlNBeE1EQWdJVDBnTVRFZ1B5Qm1iM0p0YzFzd1hTQTZJQ2gyWVd4MVpTQWxJREV3SUQ0OUlESWdKaVlnZG1Gc2RXVWdKU0F4TUNBOFBTQTBJQ1ltSUNoMllXeDFaU0FsSURFd01DQThJREV3SUh4OElIWmhiSFZsSUNVZ01UQXdJRDQ5SURJd0tTQS9JR1p2Y20xeld6RmRJRG9nWm05eWJYTmJNbDBwS1M1eVpYQnNZV05sS0NjbFpDY3NJSFpoYkhWbEtUdGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DZzBMWFF2ZEMwMExYUmdDRFF0TkM0MExEUXY5Q3cwTGZRdnRDOTBMQWcwTHpRdGRHQjBZL1JodEMxMExKY2NseHVJQ29nUUhCaGNtRnRJSHRFWVhSbGZTQmtZWFJsWDJaeWIyMGcwSjNRc05HSDBMRFF1OUdNMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDhrWTNKbFlYUmxUVzl1ZEdoeklEMGdablZ1WTNScGIyNG9aR0YwWlY5bWNtOXRLU0I3WEhKY2JpQWdJQ0IzYUdsc1pTQW9kR2hwY3k1ZkpHMXZiblJvY3k1c1lYTjBSV3hsYldWdWRFTm9hV3hrS1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZkpHMXZiblJvY3k1eVpXMXZkbVZEYUdsc1pDaDBhR2x6TGw4a2JXOXVkR2h6TG14aGMzUkZiR1Z0Wlc1MFEyaHBiR1FwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkMvMFlEUmo5R0gwTFhRdkNEUXY5QyswTFRSZ2RDNjBMRFF0OUM2MFlOY2NseHVJQ0FnSUhSb2FYTXVYM1J2YjJ4MGFYQklhV1JsS0NrN1hISmNibHh5WEc0Z0lDQWdMeThnMEwvUmdOQzEwWURRdGRDOTBMVFF0ZEdBSU5DODBMWFJnZEdQMFliUXRkQ3lYSEpjYmlBZ0lDQmpiMjV6ZENCamRYSnlaVzUwUkdGMFpTQTlJRzVsZHlCRVlYUmxLR1JoZEdWZlpuSnZiUzVuWlhSVWFXMWxLQ2twTzF4eVhHNGdJQ0FnWTI5dWMzUWdKRzF2Ym5Sb2N5QTlJRnRkTzF4eVhHNGdJQ0FnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCMGFHbHpMbTl3ZEdsdmJuTXViVzl1ZEdoelEyOTFiblE3SUNzcmFTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNSdGIyNTBhSE11Y0hWemFDaDBhR2x6TGw4a1kzSmxZWFJsVFc5dWRHZ29ZM1Z5Y21WdWRFUmhkR1VwS1R0Y2NseHVJQ0FnSUNBZ0lDQmpkWEp5Wlc1MFJHRjBaUzV6WlhSTmIyNTBhQ2hqZFhKeVpXNTBSR0YwWlM1blpYUk5iMjUwYUNncElDc2dNU2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwWURRdGRDOTBMVFF0ZEdBWEhKY2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUNSdGIyNTBhSE11YkdWdVozUm9PeUJwSUNzOUlIUm9hWE11YjNCMGFXOXVjeTV3WlhKU2IzY3BJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0FrY205M0lEMGdaRzlqZFcxbGJuUXVZM0psWVhSbFJXeGxiV1Z1ZENnblpHbDJKeWs3WEhKY2JpQWdJQ0FnSUNBZ0pISnZkeTVqYkdGemMwNWhiV1VnUFNBblJHRjBaWEpoYm1kbGNHbGphMlZ5WDE5eWIzY25PMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWtiVzl1ZEdoekxuTnNhV05sS0drc0lHa2dLeUIwYUdsekxtOXdkR2x2Ym5NdWNHVnlVbTkzS1M1bWIzSkZZV05vS0NSdGIyNTBhQ0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNSeWIzY3VZWEJ3Wlc1a1EyaHBiR1FvSkcxdmJuUm9LVHRjY2x4dUlDQWdJQ0FnSUNCOUtUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmSkcxdmJuUm9jeTVoY0hCbGJtUkRhR2xzWkNna2NtOTNLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCcFppQW9kR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTQjhmQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMHNJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktUdGNjbHh1SUNBZ0lIMWNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DZzBMWFF2ZEMwMExYUmdDRFF2TkMxMFlIUmo5R0cwTEJjY2x4dUlDb2dRSEJoY21GdElIdEVZWFJsZlNCa1lYUmxJTkNjMExYUmdkR1AwWVpjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WHlSamNtVmhkR1ZOYjI1MGFDQTlJR1oxYm1OMGFXOXVLR1JoZEdVcElIdGNjbHh1SUNBZ0lHTnZibk4wSUdOMWNuSmxiblJOYjI1MGFDQTlJR1JoZEdVdVoyVjBUVzl1ZEdnb0tUdGNjbHh1SUNBZ0lHTnZibk4wSUcxdmJuUm9WR2wwYkdVZ1BTQjBhR2x6TG1kbGRFMXZiblJvUm05eWJXRjBkR1ZrS0dSaGRHVXBPMXh5WEc0Z0lDQWdZMjl1YzNRZ2QyVmxhMFJoZVhNZ1BTQjBhR2x6TG1kbGRGZGxaV3RFWVhselJtOXliV0YwZEdWa0tDazdYSEpjYmx4eVhHNGdJQ0FnWTI5dWMzUWdKRzF2Ym5Sb0lEMGdkR2hwY3k1ZkpHTnlaV0YwWlVWc1pXMWxiblFvWEhKY2JpQWdJQ0FnSUNBZ1lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGd2lJR1JoZEdFdGRHbHRaVDFjSWlSN1pHRjBaUzVuWlhSVWFXMWxLQ2w5WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUY5ZmFHVmhaR1Z5WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpVFc5dWRHaGZYMkZ5Y205M0lFMXZiblJvWDE5aGNuSnZkeTB0Y0hKbGRpUjdLSFJvYVhNdWIzQjBhVzl1Y3k1dGFXNUVZWFJsSUNZbUlHUmhkR1VnUEQwZ2RHaHBjeTV2Y0hScGIyNXpMbTFwYmtSaGRHVXBJRDhnSnlCcGN5MWthWE5oWW14bFpDY2dPaUFuSjMxY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzWm5JSGRwWkhSb1BWd2lPRndpSUdobGFXZG9kRDFjSWpFMFhDSWdkbWxsZDBKdmVEMWNJakFnTUNBNElERTBYQ0lnWm1sc2JEMWNJbTV2Ym1WY0lpQjRiV3h1Y3oxY0ltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6SXdNREF2YzNablhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHh3WVhSb0lHUTlYQ0pOTnlBeE0wd3hJRGRNTnlBeFhDSWdjM1J5YjJ0bFBWd2lJemhET0VNNFExd2lJSE4wY205clpTMTNhV1IwYUQxY0lqSmNJaUJ6ZEhKdmEyVXRiR2x1WldOaGNEMWNJbkp2ZFc1a1hDSWdjM1J5YjJ0bExXeHBibVZxYjJsdVBWd2ljbTkxYm1SY0lqNDhMM0JoZEdnK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5emRtYytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM005WENKTmIyNTBhRjlmZEdsMGJHVmNJajRrZTIxdmJuUm9WR2wwYkdWOUlDUjdaR0YwWlM1blpYUkdkV3hzV1dWaGNpZ3BmVHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjejFjSWsxdmJuUm9YMTloY25KdmR5Qk5iMjUwYUY5ZllYSnliM2N0TFc1bGVIUWtleWgwYUdsekxtOXdkR2x2Ym5NdWJXRjRSR0YwWlNBbUppQmtZWFJsSUQ0OUlIUm9hWE11YjNCMGFXOXVjeTV0WVhoRVlYUmxLU0EvSUNjZ2FYTXRaR2x6WVdKc1pXUW5JRG9nSnlkOVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjJaeUIzYVdSMGFEMWNJamhjSWlCb1pXbG5hSFE5WENJeE5Gd2lJSFpwWlhkQ2IzZzlYQ0l3SURBZ09DQXhORndpSUdacGJHdzlYQ0p1YjI1bFhDSWdlRzFzYm5NOVhDSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMloxd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4Y0dGMGFDQmtQVndpVFRFZ01DNDVPVGs1T1RsTU55QTNUREVnTVROY0lpQnpkSEp2YTJVOVhDSWpPRU00UXpoRFhDSWdjM1J5YjJ0bExYZHBaSFJvUFZ3aU1sd2lJSE4wY205clpTMXNhVzVsWTJGd1BWd2ljbTkxYm1SY0lpQnpkSEp2YTJVdGJHbHVaV3B2YVc0OVhDSnliM1Z1WkZ3aVBqd3ZjR0YwYUQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDNOMlp6NWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjejFjSWsxdmJuUm9YMTkzWldWclhDSStKSHQzWldWclJHRjVjeTV0WVhBb2FYUmxiU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGOWZkMlZsYTJSaGVWd2lQaVI3YVhSbGJTNTBhWFJzWlgwOEwyUnBkajVnWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDBwTG1wdmFXNG9KeWNwZlR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpVFc5dWRHaGZYMlJoZVhOY0lqNDhMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQThMMlJwZGo1Z1hISmNiaUFnSUNBcE8xeHlYRzVjY2x4dUlDQWdJQzh2SU5HQjBZTFJnTkMxMEx2UXV0QzRYSEpjYmlBZ0lDQmJYSEpjYmlBZ0lDQWdJQ0FnZTNObGJHVmpkRzl5T2lBbkxrMXZiblJvWDE5aGNuSnZkeTB0Y0hKbGRpY3NJRzVoYldVNklDZHdjbVYySjMwc1hISmNiaUFnSUNBZ0lDQWdlM05sYkdWamRHOXlPaUFuTGsxdmJuUm9YMTloY25KdmR5MHRibVY0ZENjc0lHNWhiV1U2SUNkdVpYaDBKMzBzWEhKY2JpQWdJQ0JkTG1admNrVmhZMmdvYVhSbGJTQTlQaUI3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnSkdGeWNtOTNJRDBnSkcxdmJuUm9MbkYxWlhKNVUyVnNaV04wYjNJb2FYUmxiUzV6Wld4bFkzUnZjaWs3WEhKY2JpQWdJQ0FnSUNBZ0pHRnljbTkzTG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJOc2FXTnJKeXdnWlNBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDOHZJTkN5MFlEUXRkQzgwTFhRdmRDOTBMRFJqeURRdk5DMTBZRFFzQ3dnMEx2Umc5R0gwWWpRdFNEUXY5QzEwWURRdGRDeTBMWFJnTkdCMFlMUXNOR0MwWXdzSU5DeTBZdlF2ZEMxMFlIUmd0QzRJTkdCMFlMUmdOQzEwTHZRdXRDNElOQzMwTEFnMEwvUmdOQzEwTFRRdGRDNzBZc2cwTC9RdGRHQTBMWFJnTkMxMFlEUXVOR0IwTDdRc3RHTDBMTFFzTkMxMEx6UXZ0QzVJTkMrMExIUXU5Q3cwWUhSZ3RDNElOQy8wTGpRdXRDMTBZRFFzRnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmxMbk4wYjNCUWNtOXdZV2RoZEdsdmJpZ3BPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NWZiMjVCY25KdmQwTnNhV05yS0NSaGNuSnZkeXdnYVhSbGJTNXVZVzFsS1R0Y2NseHVJQ0FnSUNBZ0lDQjlLVHRjY2x4dUlDQWdJSDBwTzF4eVhHNWNjbHh1SUNBZ0lDOHZJTkdBMExYUXZkQzAwTFhSZ0NEUXROQzkwTFhRdVZ4eVhHNGdJQ0FnWTI5dWMzUWdKR1JoZVhNZ1BTQWtiVzl1ZEdndWNYVmxjbmxUWld4bFkzUnZjaWduTGsxdmJuUm9YMTlrWVhsekp5azdYSEpjYmlBZ0lDQmpiMjV6ZENCa1lYbHpJRDBnYm1WM0lFUmhkR1VvWkdGMFpTNW5aWFJVYVcxbEtDa3BPMXh5WEc0Z0lDQWdaR0Y1Y3k1elpYUkVZWFJsS0RFcE8xeHlYRzRnSUNBZ1pHRjVjeTV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVYSEpjYmlBZ0lDQjNhR2xzWlNBb1pHRjVjeTVuWlhSTmIyNTBhQ2dwSUQwOUlHTjFjbkpsYm5STmIyNTBhQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUNSM1pXVnJJRDBnZEdocGN5NWZKR055WldGMFpWZGxaV3NvS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnZDJWbGEwUmhlWE11Wm05eVJXRmphQ2hwZEdWdElEMCtJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dSaGVYTXVaMlYwUkdGNUtDa2dJVDBnYVhSbGJTNWtZWGtnZkh3Z1pHRjVjeTVuWlhSTmIyNTBhQ2dwSUNFOUlHTjFjbkpsYm5STmIyNTBhQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0pIZGxaV3N1WVhCd1pXNWtRMmhwYkdRb2RHaHBjeTVmSkdOeVpXRjBaVVZ0Y0hSNVJHRjVLQ2twTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBa2QyVmxheTVoY0hCbGJtUkRhR2xzWkNoMGFHbHpMbDhrWTNKbFlYUmxSR0Y1S0dSaGVYTXBLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdaR0Y1Y3k1elpYUkVZWFJsS0dSaGVYTXVaMlYwUkdGMFpTZ3BJQ3NnTVNrN1hISmNiaUFnSUNBZ0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ1JrWVhsekxtRndjR1Z1WkVOb2FXeGtLQ1IzWldWcktUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0J5WlhSMWNtNGdKRzF2Ym5Sb08xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEpyUXU5QzQwTG9nMEwvUXZpRFJnZEdDMFlEUXRkQzcwTHJRdFNEUXY5QzEwWURRdGRDNjBMdlJqdEdIMExYUXZkQzQwWThnMEx6UXRkR0IwWS9SaHRDd1hISmNiaUFxSUVCd1lYSmhiU0I3Uld4bGJXVnVkSDBnSkdGeWNtOTNJRWhVVFV3ZzBZM1F1OUMxMEx6UXRkQzkwWUpjY2x4dUlDb2dRSEJoY21GdElIdFRkSEpwYm1kOUlHNWhiV1VnSUNBZzBKalF2TkdQSUNod2NtVjJMQ0J1WlhoMEtWeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZiMjVCY25KdmQwTnNhV05ySUQwZ1puVnVZM1JwYjI0b0pHRnljbTkzTENCdVlXMWxLU0I3WEhKY2JpQWdJQ0JwWmlBb0pHRnljbTkzTG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmFYTXRaR2x6WVdKc1pXUW5LU2tnZTF4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCamIyNXpkQ0JrWVhSbElEMGdibVYzSUVSaGRHVW9jR0Z5YzJWSmJuUW9kR2hwY3k1ZkpHMXZiblJvY3k1eGRXVnllVk5sYkdWamRHOXlLQ2N1VFc5dWRHZ25LUzVrWVhSaGMyVjBMblJwYldVc0lERXdLU2s3WEhKY2JpQWdJQ0JrWVhSbExuTmxkRTF2Ym5Sb0tHUmhkR1V1WjJWMFRXOXVkR2dvS1NBcklDaHVZVzFsSUQwOUlDZHdjbVYySnlBL0lDMTBhR2x6TG05d2RHbHZibk11Ylc5dWRHaHpRMjkxYm5RZ09pQjBhR2x6TG05d2RHbHZibk11Ylc5dWRHaHpRMjkxYm5RcEtUdGNjbHh1WEhKY2JpQWdJQ0F2THlEUXN0R0wwWVhRdnRDMElOQzMwTEFnMEwvUmdOQzEwTFRRdGRDNzBZc2cwTHpRdU5DOTBMalF2TkN3MEx2UmpOQzkwTDdRdVNEUXROQ3cwWUxSaTF4eVhHNGdJQ0FnYVdZZ0tHUmhkR1VnUENCMGFHbHpMbTl3ZEdsdmJuTXViV2x1UkdGMFpTa2dlMXh5WEc0Z0lDQWdJQ0FnSUdSaGRHVXVjMlYwVkdsdFpTaDBhR2x6TG05d2RHbHZibk11YldsdVJHRjBaUzVuWlhSVWFXMWxLQ2twTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkN5MFl2UmhkQyswTFFnMExmUXNDRFF2OUdBMExYUXROQzEwTHZSaXlEUXZOQ3cwTHJSZ2RDNDBMelFzTkM3MFl6UXZkQyswTGtnMExUUXNOR0MwWXRjY2x4dUlDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXViV0Y0UkdGMFpTa2dlMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR1Z1WkVSaGRHVWdQU0J1WlhjZ1JHRjBaU2hrWVhSbExtZGxkRlJwYldVb0tTazdYSEpjYmlBZ0lDQWdJQ0FnWlc1a1JHRjBaUzV6WlhSTmIyNTBhQ2hsYm1SRVlYUmxMbWRsZEUxdmJuUm9LQ2tnS3lCMGFHbHpMbTl3ZEdsdmJuTXViVzl1ZEdoelEyOTFiblFwTzF4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2hsYm1SRVlYUmxJRDRnZEdocGN5NXZjSFJwYjI1ekxtMWhlRVJoZEdVcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1pHRjBaUzV6WlhSVWFXMWxLSFJvYVhNdWIzQjBhVzl1Y3k1dFlYaEVZWFJsTG1kbGRGUnBiV1VvS1NrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGRHVXVjMlYwVFc5dWRHZ29aR0YwWlM1blpYUk5iMjUwYUNncElDMGdkR2hwY3k1dmNIUnBiMjV6TG0xdmJuUm9jME52ZFc1MElDc2dNU2s3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzh2SU5DLzBMWFJnTkMxMFlYUXZ0QzBJTkM2SU5DOTBMN1FzdEMrMExrZzBMVFFzTkdDMExWY2NseHVJQ0FnSUhSb2FYTXVYM05sYkdWamRFUmhkR1VvWkdGMFpTazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW85R0IwWUxRc05DOTBMN1FzdEM2MExBZzBZTFF0ZEM2MFlQUmlkQzEwTGtnMExUUXNOR0MwWXNnMFlFZzBZRFF0ZEM5MExUUXRkR0EwTDdRdkZ4eVhHNGdLaUJBY0dGeVlXMGdlMFJoZEdWOUlHUmhkR1VnMEpUUXNOR0MwTEJjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDNObGJHVmpkRVJoZEdVZ1BTQm1kVzVqZEdsdmJpaGtZWFJsS1NCN1hISmNiaUFnSUNCMGFHbHpMbDl6Wld4bFkzUmxaRVJoZEdVZ1BTQmtZWFJsTzF4eVhHNGdJQ0FnZEdocGN5NWZKR055WldGMFpVMXZiblJvY3loa1lYUmxLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2cwTFhRdmRDMDBMWFJnQ0RRdmRDMTBMVFF0ZEM3MExoY2NseHVJQ29nUUhCaGNtRnRJQ0I3UkdGMFpYMGdaR0YwWlNEUW50Q3gwWXJRdGRDNjBZSWcwTFRRc05HQzBZdGNjbHh1SUNvZ1FISmxkSFZ5YmlCN1JXeGxiV1Z1ZEgxY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVh5UmpjbVZoZEdWWFpXVnJJRDBnWm5WdVkzUnBiMjRvWkdGMFpTa2dlMXh5WEc0Z0lDQWdZMjl1YzNRZ0pIZGxaV3NnUFNCMGFHbHpMbDhrWTNKbFlYUmxSV3hsYldWdWRDaGNjbHh1SUNBZ0lDQWdJQ0JnUEdScGRpQmpiR0Z6Y3oxY0lsZGxaV3RjSWo0OEwyUnBkajVnWEhKY2JpQWdJQ0FwTzF4eVhHNWNjbHh1SUNBZ0lISmxkSFZ5YmlBa2QyVmxhenRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2cwTFhRdmRDMDBMWFJnQ0RRdE5DOTBZOWNjbHh1SUNvZ1FIQmhjbUZ0SUNCN1JHRjBaWDBnWkdGMFpTRFFudEN4MFlyUXRkQzYwWUlnMExUUXNOR0MwWXRjY2x4dUlDb2dRSEpsZEhWeWJpQjdSV3hsYldWdWRIMWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYeVJqY21WaGRHVkVZWGtnUFNCbWRXNWpkR2x2Ymloa1lYUmxLU0I3WEhKY2JpQWdJQ0JqYjI1emRDQWtaR0Y1SUQwZ2RHaHBjeTVmSkdOeVpXRjBaVVZzWlcxbGJuUW9YSEpjYmlBZ0lDQWdJQ0FnWUR4a2FYWWdZMnhoYzNNOVhDSkVZWGxjSWlCa1lYUmhMWFJwYldVOVhDSWtlMlJoZEdVdVoyVjBWR2x0WlNncGZWd2lJR1JoZEdFdFpHRjVQVndpSkh0a1lYUmxMbWRsZEVSaGVTZ3BmVndpUGlSN1pHRjBaUzVuWlhSRVlYUmxLQ2w5UEM5a2FYWStZRnh5WEc0Z0lDQWdLVHRjY2x4dVhISmNiaUFnSUNBa1pHRjVMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KMk5zYVdOckp5d2dkR2hwY3k1ZmIyNUVZWGxEYkdsamEwVjJaVzUwTG1KcGJtUW9kR2hwY3lrcE8xeHlYRzVjY2x4dUlDQWdJR2xtSUNnaGRHaHBjeTV2Y0hScGIyNXpMbk5wYm1kc1pVMXZaR1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQWtaR0Y1TG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjIxdmRYTmxaVzUwWlhJbkxDQjBhR2x6TGw5dmJrUmhlVTF2ZFhObFJXNTBaWEpGZG1WdWRDNWlhVzVrS0hSb2FYTXBLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFF2dEN4MEwzUXZ0Q3kwTHZRdGRDOTBMalF0U0RSZ2RDKzBZSFJndEMrMFkvUXZkQzQwTGxjY2x4dUlDQWdJSFJvYVhNdVgzVndaR0YwWlVSaGVTZ2taR0Y1S1R0Y2NseHVYSEpjYmlBZ0lDQnlaWFIxY200Z0pHUmhlVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2UwTEhRdmRDKzBMTFF1OUMxMEwzUXVOQzFJTkdCMEw3UmdkR0MwTDdSajlDOTBMalF1Vnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzUxY0dSaGRHVWdQU0JtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUhSb2FYTXVYeVJ0YjI1MGFITXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDZ25MazF2Ym5Sb0p5a3VabTl5UldGamFDZ2tiVzl1ZEdnZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM1Z3WkdGMFpVMXZiblJvS0NSdGIyNTBhQ2s3WEhKY2JpQWdJQ0I5S1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNlMExIUXZkQyswTExRdTlDMTBMM1F1TkMxSU5HQjBMN1JnZEdDMEw3Umo5QzkwTGpRdVNEUXZOQzEwWUhSajlHRzBMQmNjbHh1SUNvZ1FIQmhjbUZ0SUh0RmJHVnRaVzUwZlNBa2JXOXVkR2dnMEszUXU5QzEwTHpRdGRDOTBZSWcwTHpRdGRHQjBZL1JodEN3WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw5MWNHUmhkR1ZOYjI1MGFDQTlJR1oxYm1OMGFXOXVLQ1J0YjI1MGFDa2dlMXh5WEc0Z0lDQWdKRzF2Ym5Sb0xuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b0p5NUVZWGxiWkdGMFlTMTBhVzFsWFNjcExtWnZja1ZoWTJnb0pHUmhlU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmRYQmtZWFJsUkdGNUtDUmtZWGtwTzF4eVhHNGdJQ0FnZlNrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRbnRDeDBMM1F2dEN5MEx2UXRkQzkwTGpRdFNEUmdkQyswWUhSZ3RDKzBZL1F2ZEM0MExrZzBMVFF2ZEdQWEhKY2JpQXFJRUJ3WVhKaGJTQjdSV3hsYldWdWRIMGdKR1JoZVNEUXJkQzcwTFhRdk5DMTBMM1JnaURRdE5DOTBZOWNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYM1Z3WkdGMFpVUmhlU0E5SUdaMWJtTjBhVzl1S0NSa1lYa3BJSHRjY2x4dUlDQWdJR052Ym5OMElHUmhkR1VnSUNBOUlHNWxkeUJFWVhSbEtIQmhjbk5sU1c1MEtDUmtZWGt1WkdGMFlYTmxkQzUwYVcxbExDQXhNQ2twTzF4eVhHNGdJQ0FnWTI5dWMzUWdiRzlqYTJWa0lEMGdkR2hwY3k1blpYUkVZWGxNYjJOclpXUW9aR0YwWlNrN1hISmNiaUFnSUNCamIyNXpkQ0IwYjJSaGVTQWdQU0IwYUdsekxsOTBiMlJoZVM1blpYUlVhVzFsS0NrZ1BUMGdaR0YwWlM1blpYUlVhVzFsS0NrN1hISmNibHh5WEc0Z0lDQWdKR1JoZVM1amJHRnpjMHhwYzNRdWRHOW5aMnhsS0NkcGN5MWthWE5oWW14bFpDY3NJR3h2WTJ0bFpDazdYSEpjYmlBZ0lDQWtaR0Y1TG1Oc1lYTnpUR2x6ZEM1MGIyZG5iR1VvSjJsekxXeHZZMnRsWkNjc0lHeHZZMnRsWkNBOVBTQk1UME5MWDB4UFEwdEZSQ2s3WEhKY2JpQWdJQ0FrWkdGNUxtTnNZWE56VEdsemRDNTBiMmRuYkdVb0oybHpMWFJ2WkdGNUp5d2dkRzlrWVhrcE8xeHlYRzU5WEhKY2JseHlYRzR2S2lwY2NseHVJQ29nMEtIUXZ0Q3gwWXZSZ3RDNDBMVWcwTHJRdTlDNDBMclFzQ0RRdjlDK0lOQzAwTDNSamx4eVhHNGdLaUJBY0dGeVlXMGdlMFYyWlc1MGZTQmxJRVJQVFNEUmdkQyswTEhSaTlHQzBMalF0Vnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmYjI1RVlYbERiR2xqYTBWMlpXNTBJRDBnWm5WdVkzUnBiMjRvWlNrZ2UxeHlYRzRnSUNBZ2RHaHBjeTVmYjI1RVlYbERiR2xqYXlobExuUmhjbWRsZENrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRb2RDKzBMSFJpOUdDMExqUXRTRFJoZEMrMExMUXRkR0EwTEJjY2x4dUlDb2dRSEJoY21GdElIdEZkbVZ1ZEgwZ1pTQkVUMDBnMFlIUXZ0Q3gwWXZSZ3RDNDBMVmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYMjl1UkdGNVRXOTFjMlZGYm5SbGNrVjJaVzUwSUQwZ1puVnVZM1JwYjI0b1pTa2dlMXh5WEc0Z0lDQWdkR2hwY3k1ZmIyNUVZWGxOYjNWelpVVnVkR1Z5S0dVdWRHRnlaMlYwS1R0Y2NseHVmVnh5WEc1Y2NseHVMeW9xWEhKY2JpQXFJTkNsMEw3UXN0QzEwWUFnMEwzUXNDRFJqZEM3MExYUXZOQzEwTDNSZ3RDMUlOQzAwTDNSajF4eVhHNGdLaUJBY0dGeVlXMGdlMFZzWlcxbGJuUjlJQ1JrWVhrZ1NGUk5UQ0RRcmRDNzBMWFF2TkMxMEwzUmdseHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZiMjVFWVhsTmIzVnpaVVZ1ZEdWeUlEMGdablZ1WTNScGIyNG9KR1JoZVNrZ2UxeHlYRzRnSUNBZ2FXWWdLQ0YwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRJSHg4SUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lHbG1JQ2drWkdGNUxtUmhkR0Z6WlhRdWRHbHRaU0E5UFNCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0TG1kbGRGUnBiV1VvS1NrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJqdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0JqYjI1emRDQmtZWFJsWDNSdklEMGdibVYzSUVSaGRHVW9jR0Z5YzJWSmJuUW9KR1JoZVM1a1lYUmhjMlYwTG5ScGJXVXNJREV3S1NrN1hISmNiaUFnSUNCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQ2gwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2EwTHZRdU5DNklOQy8wTDRnMExUUXZkR09YSEpjYmlBcUlFQndZWEpoYlNCN1JXeGxiV1Z1ZEgwZ0pHUmhlU0JJVkUxTUlOQ3QwTHZRdGRDODBMWFF2ZEdDWEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw5dmJrUmhlVU5zYVdOcklEMGdablZ1WTNScGIyNG9KR1JoZVNrZ2UxeHlYRzRnSUNBZ0x5OGcwTFRRdGRDOTBZd2cwTGZRc05DeDBMdlF2dEM2MExqUmdOQyswTExRc05DOVhISmNiaUFnSUNCcFppQW9KR1JoZVM1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0oybHpMV1JwYzJGaWJHVmtKeWtwSUh0Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlU3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwTExSaTlDeDBMN1JnQ0RRdnRDMDBMM1F2dEM1SU5DMDBMRFJndEdMWEhKY2JpQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbk5wYm1kc1pVMXZaR1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TG5KaGJtZGxVbVZ6WlhRb0tUdGNjbHh1SUNBZ0lDQWdJQ0FrWkdGNUxtTnNZWE56VEdsemRDNWhaR1FvSjJsekxYTmxiR1ZqZEdWa0p5azdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZZMkZzYkdKaFkyc29KMlJoZVZObGJHVmpkQ2NzSUc1bGR5QkVZWFJsS0hCaGNuTmxTVzUwS0NSa1lYa3VaR0YwWVhObGRDNTBhVzFsTENBeE1Da3BLVHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwWUhRc2RHQTBMN1JnU0RRc3RHTDBMSFJnTkN3MEwzUXZkQyswTFBRdmlEUmdOQ3cwTDNRdGRDMUlOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXNGeHlYRzRnSUNBZ2FXWWdLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMGdKaVlnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbkpoYm1kbFVtVnpaWFFvS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWtaR0Y1TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMmx6TFhObGJHVmpkR1ZrSnlrN1hISmNibHh5WEc0Z0lDQWdMeThnMExMUmk5Q3gwWURRc05DOTBMQWcwTDNRc05HSDBMRFF1OUdNMEwzUXNOR1BJQzhnMExyUXZ0QzkwTFhSaDlDOTBMRFJqeURRdE5DdzBZTFFzRnh5WEc0Z0lDQWdhV1lnS0NGMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0S1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTQTlJRzVsZHlCRVlYUmxLSEJoY25ObFNXNTBLQ1JrWVhrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcE8xeHlYRzRnSUNBZ2ZTQmxiSE5sSUdsbUlDZ2hkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5QTlJRzVsZHlCRVlYUmxLSEJoY25ObFNXNTBLQ1JrWVhrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJR2xtSUNoMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0SUNZbUlIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdMeThnMExUUXZ0Qy8wWVBSZ2RHQzBMalF2TkdMMExrZzBMVFF1TkN3MEwvUXNOQzMwTDdRdlZ4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2doZEdocGN5NW5aWFJKYzFKaGJtZGxVMlZzWldOMFlXSnNaU2gwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRMQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5a3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1eVlXNW5aVkpsYzJWMEtDazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11Y21GdVoyVlRaV3hsWTNRb2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlN3Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwTzF4eVhHNGdJQ0FnZlZ4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSkxRdU5DMzBZUFFzTkM3MFl6UXZkR0wwTGtnMFlIUXNkR0EwTDdSZ1NEUXN0R0wwTFRRdGRDNzBMWFF2ZEM5MFl2UmhTRFF0TkN3MFlKY2NseHVJQ292WEhKY2JrUmhkR1ZTWVc1blpWQnBZMnRsY2k1d2NtOTBiM1I1Y0dVdVgzSmhibWRsVm1semRXRnNVbVZ6WlhRZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJR052Ym5OMElDUmtZWGx6SUQwZ2RHaHBjeTVmSkcxdmJuUm9jeTV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2N1UkdGNVcyUmhkR0V0ZEdsdFpWMG5LVHRjY2x4dUlDQWdJQ1JrWVhsekxtWnZja1ZoWTJnb0pHUmhlU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdKR1JoZVM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkcGN5MXpaV3hsWTNSbFpDY3NJQ2RwY3kxelpXeGxZM1JsWkMxbWNtOXRKeXdnSjJsekxYTmxiR1ZqZEdWa0xYUnZKeXdnSjJsekxYTmxiR1ZqZEdWa0xXSmxkSGRsWlc0bktUdGNjbHh1SUNBZ0lIMHBPMXh5WEc1Y2NseHVJQ0FnSUM4dklOQy8wWURSajlHSDBMWFF2Q0RRdjlDKzBMVFJnZEM2MExEUXQ5QzYwWU5jY2x4dUlDQWdJSFJvYVhNdVgzUnZiMngwYVhCSWFXUmxLQ2s3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFrdEM0MExmUmc5Q3cwTHZSak5DOTBMN1F0U0RRc3RHTDBMVFF0ZEM3MExYUXZkQzQwTFVnMExUUXNOR0NYSEpjYmlBcUlFQndZWEpoYlNCN1JHRjBaWDBnWkdGMFpWOW1jbTl0SU5DZDBMRFJoOUN3MEx2UmpOQzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdLaUJBY0dGeVlXMGdlMFJoZEdWOUlHUmhkR1ZmZEc4Z0lDRFFtdEMrMEwzUXRkR0gwTDNRc05HUElOQzAwTERSZ3RDd1hISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDQTlJR1oxYm1OMGFXOXVLR1JoZEdWZlpuSnZiU3dnWkdGMFpWOTBieWtnZTF4eVhHNGdJQ0FnYVdZZ0tHUmhkR1ZmWm5KdmJTQW1KaUJrWVhSbFgyWnliMjBnYVc1emRHRnVZMlZ2WmlCRVlYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ1pHRjBaVjltY205dExuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUdsbUlDaGtZWFJsWDNSdklDWW1JR1JoZEdWZmRHOGdhVzV6ZEdGdVkyVnZaaUJFWVhSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnWkdGMFpWOTBieTV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnNaWFFnZEdsdFpWOW1jbTl0SUQwZ1pHRjBaVjltY205dElHbHVjM1JoYm1ObGIyWWdSR0YwWlNBL0lHUmhkR1ZmWm5KdmJTNW5aWFJVYVcxbEtDa2dPaUF3TzF4eVhHNGdJQ0FnYkdWMElIUnBiV1ZmZEc4Z1BTQmtZWFJsWDNSdklHbHVjM1JoYm1ObGIyWWdSR0YwWlNBL0lHUmhkR1ZmZEc4dVoyVjBWR2x0WlNncElEb2dNRHRjY2x4dUlDQWdJR2xtSUNoMGFXMWxYMlp5YjIwZ1BpQjBhVzFsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnVzNScGJXVmZabkp2YlN3Z2RHbHRaVjkwYjEwZ1BTQmJkR2x0WlY5MGJ5d2dkR2x0WlY5bWNtOXRYVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdkx5RFFzdEdMMExUUXRkQzcwTFhRdmRDNDBMVWcwTFRRc05HQ0lOQzgwTFhRdHRDMDBZTWcwTDNRc05HSDBMRFF1OUdNMEwzUXZ0QzVJTkM0SU5DNjBMN1F2ZEMxMFlmUXZkQyswTGxjY2x4dUlDQWdJR052Ym5OMElDUmtZWGx6SUQwZ2RHaHBjeTVmSkcxdmJuUm9jeTV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2N1UkdGNVcyUmhkR0V0ZEdsdFpWMG5LVHRjY2x4dUlDQWdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnSkdSaGVYTXViR1Z1WjNSb095QXJLMmtwSUh0Y2NseHVJQ0FnSUNBZ0lDQWtaR0Y1YzF0cFhTNWpiR0Z6YzB4cGMzUXVkRzluWjJ4bEtDZHBjeTF6Wld4bFkzUmxaQzFpWlhSM1pXVnVKeXdnSkdSaGVYTmJhVjB1WkdGMFlYTmxkQzUwYVcxbElENGdkR2x0WlY5bWNtOXRJQ1ltSUNSa1lYbHpXMmxkTG1SaGRHRnpaWFF1ZEdsdFpTQThJSFJwYldWZmRHOHBPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4dklOQ3kwWXZRdE5DMTBMdlF0ZEM5MExqUXRTRFF2ZEN3MFlmUXNOQzcwWXpRdmRDKzBMa2cwTGdnMExyUXZ0QzkwTFhSaDlDOTBMN1F1U0RRdjlDKzBMZlF1TkdHMExqUXVGeHlYRzRnSUNBZ1kyOXVjM1FnSkdSaGVWOW1jbTl0SUQwZ2RHaHBjeTVmSkdkbGRFUmhlVUo1UkdGMFpTaGtZWFJsWDJaeWIyMHBPMXh5WEc0Z0lDQWdZMjl1YzNRZ0pHUmhlVjkwYnlBOUlIUm9hWE11WHlSblpYUkVZWGxDZVVSaGRHVW9aR0YwWlY5MGJ5azdYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBMclF0ZEdJSU5DMDBMdlJqeURRc2RHTDBZSFJndEdBMEw3UXM5QytJTkdCMExIUmdOQyswWUhRc0NEUmdkR0MwTERSZ05DKzBMUFF2aURRc3RHTDBMVFF0ZEM3MExYUXZkQzQwWTljY2x4dUlDQWdJR2xtSUNoMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQzRrWkdGNVgyWnliMjFmYjJ4a0lDWW1JSFJvYVhNdVgzSmhibWRsVm1semRXRnNVMlZzWldOMExpUmtZWGxmWm5KdmJWOXZiR1FnSVQwZ0pHUmhlVjltY205dEtTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUXVKR1JoZVY5bWNtOXRYMjlzWkM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkcGN5MXpaV3hsWTNSbFpDY3NJQ2RwY3kxelpXeGxZM1JsWkMxbWNtOXRKeWs3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwTHJRdGRHSUlOQzAwTHZSanlEUXNkR0wwWUhSZ3RHQTBMN1FzOUMrSU5HQjBMSFJnTkMrMFlIUXNDRFJnZEdDMExEUmdOQyswTFBRdmlEUXN0R0wwTFRRdGRDNzBMWFF2ZEM0MFk5Y2NseHVJQ0FnSUdsbUlDaDBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGTmxiR1ZqZEM0a1pHRjVYM1J2WDI5c1pDQW1KaUIwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDNGtaR0Y1WDNSdlgyOXNaQ0FoUFNBa1pHRjVYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFRaV3hsWTNRdUpHUmhlVjkwYjE5dmJHUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRkRzhuS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvSkdSaGVWOW1jbTl0S1NCN1hISmNiaUFnSUNBZ0lDQWdKR1JoZVY5bWNtOXRMbU5zWVhOelRHbHpkQzVoWkdRb0oybHpMWE5sYkdWamRHVmtKeXdnSjJsekxYTmxiR1ZqZEdWa0xXWnliMjBuS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvSkdSaGVWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lDUmtZWGxmZEc4dVkyeGhjM05NYVhOMExtRmtaQ2duYVhNdGMyVnNaV04wWldRbkxDQW5hWE10YzJWc1pXTjBaV1F0ZEc4bktUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2THlEUmdkQyswWVhSZ05DdzBMM1F0ZEM5MExqUXRTRFFzaURRdXRDMTBZaGNjbHh1SUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wTGlSa1lYbGZabkp2YlY5dmJHUWdQU0FrWkdGNVgyWnliMjA3WEhKY2JpQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDNGtaR0Y1WDNSdlgyOXNaQ0E5SUNSa1lYbGZkRzg3WEhKY2JseHlYRzRnSUNBZ2RHaHBjeTVmYzJWc1pXTjBhVzl1TGlSa1lYbGZabkp2YlNBOUlDUmtZWGxmWm5KdmJUdGNjbHh1SUNBZ0lIUm9hWE11WDNObGJHVmpkR2x2Ymk0a1pHRjVYM1J2SUQwZ0pHUmhlVjkwYnp0Y2NseHVYSEpjYmlBZ0lDQnBaaUFvSkdSaGVWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUdSaGVYTWdQU0JOWVhSb0xtWnNiMjl5S0UxaGRHZ3VZV0p6S0hScGJXVmZabkp2YlNBdElIUnBiV1ZmZEc4cElDOGdPRFkwTURCbE15a2dLeUF4TzF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNSdmIyeDBhWEJUYUc5M0tDUmtZWGxmZEc4c0lHUmhlWE1wTzF4eVhHNGdJQ0FnZlZ4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSi9RdnRDNjBMRFF0eURRdjlDKzBMVFJnZEM2MExEUXQ5QzYwTGhjY2x4dUlDb2dRSEJoY21GdElIdEZiR1Z0Wlc1MGZTQWtaR0Y1SU5DUzBZdlFzZEdBMExEUXZkQzkwWXZRdVNEUXROQzEwTDNSakZ4eVhHNGdLaUJBY0dGeVlXMGdlMDUxYldKbGNuMGdJR1JoZVhNZzBKclF2dEM3MExqUmg5QzEwWUhSZ3RDeTBMNGcwTFRRdmRDMTBMbGNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYM1J2YjJ4MGFYQlRhRzkzSUQwZ1puVnVZM1JwYjI0b0pHUmhlU3dnWkdGNWN5a2dlMXh5WEc0Z0lDQWdkR2hwY3k1ZkpIUnZiMngwYVhCRGIyNTBaVzUwTG5SbGVIUkRiMjUwWlc1MElEMGdkR2hwY3k1dmNIUnBiMjV6TG1acGJIUmxjaTUwYjI5c2RHbHdWR1Y0ZEM1allXeHNLSFJvYVhNc0lHUmhlWE1wSUh4OElDY25PMXh5WEc0Z0lDQWdkR2hwY3k1ZkpIUnZiMngwYVhBdVkyeGhjM05NYVhOMExuUnZaMmRzWlNnbmFYTXRjMmh2ZHljc0lIUm9hWE11WHlSMGIyOXNkR2x3TG5SbGVIUkRiMjUwWlc1MExteGxibWQwYUNrN1hISmNiaUFnSUNCMGFHbHpMbDkwYjI5c2RHbHdWWEJrWVhSbEtDUmtZWGtwTzF4eVhHNTlYSEpjYmx4eVhHNHZLaXBjY2x4dUlDb2cwSjdRc2RDOTBMN1FzdEM3MExYUXZkQzQwTFVnMEwvUXZ0QzMwTGpSaHRDNDBMZ2cwTC9RdnRDMDBZSFF1dEN3MExmUXV0QzRYSEpjYmlBcUlFQndZWEpoYlNCN1JXeGxiV1Z1ZEgwZ0pHUmhlU0RRa3RHTDBMSFJnTkN3MEwzUXZkR0wwTGtnMExUUXRkQzkwWXhjY2x4dUlDb3ZYSEpjYmtSaGRHVlNZVzVuWlZCcFkydGxjaTV3Y205MGIzUjVjR1V1WDNSdmIyeDBhWEJWY0dSaGRHVWdQU0JtZFc1amRHbHZiaWdrWkdGNUtTQjdYSEpjYmlBZ0lDQnNaWFFnZUNBOUlEQTdYSEpjYmlBZ0lDQnNaWFFnZVNBOUlEQTdYSEpjYmlBZ0lDQnNaWFFnSkdWc0lEMGdKR1JoZVR0Y2NseHVJQ0FnSUdSdklIdGNjbHh1SUNBZ0lDQWdJQ0I1SUNzOUlDUmxiQzV2Wm1aelpYUlViM0E3WEhKY2JpQWdJQ0FnSUNBZ2VDQXJQU0FrWld3dWIyWm1jMlYwVEdWbWREdGNjbHh1SUNBZ0lIMGdkMmhwYkdVZ0tDZ2taV3dnUFNBa1pXd3ViMlptYzJWMFVHRnlaVzUwS1NBbUppQWtaV3dnSVQwZ2RHaHBjeTVmSkhCcFkydGxjaWs3WEhKY2JseHlYRzRnSUNBZ2RHaHBjeTVmSkhSdmIyeDBhWEF1YzNSNWJHVXVkRzl3SUQwZ1RXRjBhQzV5YjNWdVpDaDVJQzBnZEdocGN5NWZKSFJ2YjJ4MGFYQXViMlptYzJWMFNHVnBaMmgwS1NBcklDZHdlQ2M3WEhKY2JpQWdJQ0IwYUdsekxsOGtkRzl2YkhScGNDNXpkSGxzWlM1c1pXWjBJRDBnVFdGMGFDNXliM1Z1WkNoNElDc2dKR1JoZVM1dlptWnpaWFJYYVdSMGFDQXZJRElnTFNCMGFHbHpMbDhrZEc5dmJIUnBjQzV2Wm1aelpYUlhhV1IwYUNBdklESXBJQ3NnSjNCNEp6dGNjbHh1ZlZ4eVhHNWNjbHh1THlvcVhISmNiaUFxSU5DaDBMclJnTkdMMFlMUmpDRFF2OUMrMExUUmdkQzYwTERRdDlDNjBZTmNjbHh1SUNvdlhISmNia1JoZEdWU1lXNW5aVkJwWTJ0bGNpNXdjbTkwYjNSNWNHVXVYM1J2YjJ4MGFYQklhV1JsSUQwZ1puVnVZM1JwYjI0b0tTQjdYSEpjYmlBZ0lDQjBhR2x6TGw4a2RHOXZiSFJwY0M1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkcGN5MXphRzkzSnlrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRb3RDMTBMclJnZEdDSU5DLzBMN1F0TkdCMExyUXNOQzMwTHJRdUNEUXY5QytJTkdEMEx6UXZ0QzcwWWZRc05DOTBMalJqbHh5WEc0Z0tpQkFjR0Z5WVcwZ0lIdE9kVzFpWlhKOUlHUmhlWE1nMEpyUXZ0QzcwTGpSaDlDMTBZSFJndEN5MEw0ZzBMVFF2ZEMxMExsY2NseHVJQ29nUUhKbGRIVnliaUI3VTNSeWFXNW5mVnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmWm1sc2RHVnlWRzl2YkhScGNGUmxlSFFnUFNCbWRXNWpkR2x2Ymloa1lYbHpLU0I3WEhKY2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1d2JIVnlZV3dvWkdGNWN5d2dXeWNsWkNEUXROQzEwTDNSakNjc0lDY2xaQ0RRdE5DOTBZOG5MQ0FuSldRZzBMVFF2ZEMxMExrblhTa3VjbVZ3YkdGalpTZ25KV1FuTENCa1lYbHpLVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2swTGpRdTlHTTBZTFJnQ0RRdmRDMTBMVFF2dEdCMFlMUmc5Qy8wTDNSaTlHRklOQzAwTDNRdGRDNUlOQy8wTDRnMFlQUXZOQyswTHZSaDlDdzBMM1F1TkdPWEhKY2JpQXFJRUJ5WlhSMWNtNGdlMEp2YjJ4bFlXNTlYSEpjYmlBcUwxeHlYRzVFWVhSbFVtRnVaMlZRYVdOclpYSXVjSEp2ZEc5MGVYQmxMbDltYVd4MFpYSk1iMk5yUkdGNWN5QTlJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnTHk4ZzBMTFJnZEMxSU5DMDBMM1F1Q0RRdE5DKzBZSFJndEdEMEwvUXZkR0xYSEpjYmlBZ0lDQnlaWFIxY200Z1ptRnNjMlU3WEhKY2JuMWNjbHh1WEhKY2JpOHFLbHh5WEc0Z0tpRFFvZEMrMExIUmk5R0MwTGpRdFNEUXVOQzMwTHpRdGRDOTBMWFF2ZEM0MFk4ZzBZRFFzTkMzMEx6UXRkR0EwTDdRc2lEUXZ0QzYwTDNRc0Z4eVhHNGdLaUJBY0dGeVlXMGdlMFYyWlc1MGZTQmxJRVJQVFNEUmdkQyswTEhSaTlHQzBMalF0Vnh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmYjI1WGFXNWtiM2RTWlhOcGVtVkZkbVZ1ZENBOUlHWjFibU4wYVc5dUtHVXBJSHRjY2x4dUlDQWdJR2xtSUNoMGFHbHpMbDl6Wld4bFkzUnBiMjR1SkdSaGVWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNSdmIyeDBhWEJWY0dSaGRHVW9kR2hwY3k1ZmMyVnNaV04wYVc5dUxpUmtZWGxmZEc4cE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJR3hsZENCaWNtVmhhM0J2YVc1MElEMGdNRHRjY2x4dUlDQWdJR052Ym5OMElHSnlaV0ZyY0c5cGJuUnpJRDBnVDJKcVpXTjBMbXRsZVhNb2RHaHBjeTV2Y0hScGIyNXpMbUp5WldGcmNHOXBiblJ6S1M1emIzSjBLQ2hoTENCaUtTQTlQaUJoSUMwZ1lpazdYSEpjYmlBZ0lDQm1iM0lnS0d4bGRDQnBJR2x1SUdKeVpXRnJjRzlwYm5SektTQjdYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tIZHBibVJ2ZHk1cGJtNWxjbGRwWkhSb0lEdzlJR0p5WldGcmNHOXBiblJ6VzJsZEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHSnlaV0ZyY0c5cGJuUWdQU0JpY21WaGEzQnZhVzUwYzF0cFhUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1luSmxZV3M3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJSFJvYVhNdVgzTmxkRUp5WldGcmNHOXBiblFvWW5KbFlXdHdiMmx1ZENrN1hISmNibjFjY2x4dVhISmNiaThxS2x4eVhHNGdLaURRbzlHQjBZTFFzTkM5MEw3UXN0QzYwTEFnMFlIUXZ0R0IwWUxRdnRHUDBMM1F1TkdQSU5HQTBMWFF2ZEMwMExYUmdOQ3dJTkMvMEw3UXRDRFJnTkN3MExmUXZkR0wwTFVnMFkzUXV0R0EwTERRdmRHTFhISmNiaUFxSUVCd1lYSmhiU0I3VG5WdFltVnlmU0JpY21WaGEzQnZhVzUwSU5DYTBMdlJqdEdISU5DNDBMY2dkR2hwY3k1dmNIUnBiMjV6TG1KeVpXRnJjRzlwYm5SeklDalFxTkM0MFlEUXVOQzkwTEFnMFkzUXV0R0EwTERRdmRDd0tWeHlYRzRnS2k5Y2NseHVSR0YwWlZKaGJtZGxVR2xqYTJWeUxuQnliM1J2ZEhsd1pTNWZjMlYwUW5KbFlXdHdiMmx1ZENBOUlHWjFibU4wYVc5dUtHSnlaV0ZyY0c5cGJuUXBJSHRjY2x4dUlDQWdJQzh2SU5DKzBZSWcwTDNRdGRDOTBZUFF0dEM5MEw3UXVTRFF2OUMxMFlEUXRkR0EwTGpSZ2RDKzBMTFF1dEM0WEhKY2JpQWdJQ0JwWmlBb2RHaHBjeTVmWW5KbFlXdHdiMmx1ZENBOVBTQmljbVZoYTNCdmFXNTBLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4eVhHNGdJQ0FnZlZ4eVhHNGdJQ0FnZEdocGN5NWZZbkpsWVd0d2IybHVkQ0E5SUdKeVpXRnJjRzlwYm5RN1hISmNibHh5WEc0Z0lDQWdhV1lnS0NGMGFHbHpMbTl3ZEdsdmJuTXVZbkpsWVd0d2IybHVkSE5iWW5KbFlXdHdiMmx1ZEYwcElIdGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNDdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnVDJKcVpXTjBMbUZ6YzJsbmJpaDBhR2x6TG05d2RHbHZibk1zSUhSb2FYTXViM0IwYVc5dWN5NWljbVZoYTNCdmFXNTBjMXRpY21WaGEzQnZhVzUwWFNrN1hISmNiaUFnSUNCMGFHbHpMbDhrWTNKbFlYUmxUVzl1ZEdoektIUm9hWE11WDNObGJHVmpkR1ZrUkdGMFpTazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUXJkQzcwTFhRdk5DMTBMM1JnaURRdXRDdzBMdlF0ZEM5MExUUXNOR0EwTDNRdnRDejBMNGcwTFRRdmRHUFhISmNiaUFxSUVCd1lYSmhiU0FnZTBSaGRHVjlJR1JoZEdVZzBKVFFzTkdDMExCY2NseHVJQ29nUUhKbGRIVnliaUI3Uld4bGJXVnVkSDBnSUNCSVZFMU1JTkdOMEx2UXRkQzgwTFhRdmRHQ1hISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOGtaMlYwUkdGNVFubEVZWFJsSUQwZ1puVnVZM1JwYjI0b1pHRjBaU2tnZTF4eVhHNGdJQ0FnWTI5dWMzUWdkR2x0WlNBOUlHUmhkR1VnYVc1emRHRnVZMlZ2WmlCRVlYUmxJRDhnWkdGMFpTNW5aWFJVYVcxbEtDa2dPaUF3TzF4eVhHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdVh5UnRiMjUwYUhNdWNYVmxjbmxUWld4bFkzUnZjaWduTGtSaGVWdGtZWFJoTFhScGJXVTlYQ0luSUNzZ2RHbHRaU0FySUNkY0lsMG5LVHRjY2x4dWZWeHlYRzVjY2x4dUx5b3FYSEpjYmlBcUlOQ2cwTFhRdmRDMDBMWFJnQ0RRdE5DOTBZOGdMU0RRdDlDdzBMUFF1OUdEMFlqUXV0QzRYSEpjYmlBcUlFQnlaWFIxY200Z2UwVnNaVzFsYm5SOVhISmNiaUFxTDF4eVhHNUVZWFJsVW1GdVoyVlFhV05yWlhJdWNISnZkRzkwZVhCbExsOGtZM0psWVhSbFJXMXdkSGxFWVhrZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJR052Ym5OMElDUmtZWGtnUFNCMGFHbHpMbDhrWTNKbFlYUmxSV3hsYldWdWRDaGNjbHh1SUNBZ0lDQWdJQ0JnUEdScGRpQmpiR0Z6Y3oxY0lrUmhlU0JwY3kxbGJYQjBlVndpUGp3dlpHbDJQbUJjY2x4dUlDQWdJQ2s3WEhKY2JseHlYRzRnSUNBZ2NtVjBkWEp1SUNSa1lYazdYSEpjYm4xY2NseHVYSEpjYmk4cUtseHlYRzRnS2lEUW9kQyswTGZRdE5DdzBMM1F1TkMxSU5HTjBMdlF0ZEM4MExYUXZkR0MwTEFnMExqUXR5QklWRTFNSU5HQzBMWFF1dEdCMFlMUXNGeHlYRzRnS2lCQWNHRnlZVzBnSUh0VGRISnBibWQ5SUdoMGJXd2dTRlJOVENEUmd0QzEwTHJSZ2RHQ1hISmNiaUFxSUVCeVpYUjFjbTRnZTBWc1pXMWxiblI5WEhKY2JpQXFMMXh5WEc1RVlYUmxVbUZ1WjJWUWFXTnJaWEl1Y0hKdmRHOTBlWEJsTGw4a1kzSmxZWFJsUld4bGJXVnVkQ0E5SUdaMWJtTjBhVzl1S0doMGJXd3BJSHRjY2x4dUlDQWdJR052Ym5OMElHUnBkaUE5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUW9KMlJwZGljcE8xeHlYRzRnSUNBZ1pHbDJMbWx1YzJWeWRFRmthbUZqWlc1MFNGUk5UQ2duWVdaMFpYSmlaV2RwYmljc0lHaDBiV3dwTzF4eVhHNGdJQ0FnY21WMGRYSnVJR1JwZGk1amFHbHNaSEpsYmk1c1pXNW5kR2dnUGlBeElEOGdaR2wyTG1Ob2FXeGtjbVZ1SURvZ1pHbDJMbVpwY25OMFJXeGxiV1Z1ZEVOb2FXeGtPMXh5WEc1OVhISmNibHh5WEc0dktpcGNjbHh1SUNvZ1UyRm1aU0RRc3RHTDBMZlF2dEN5SU5DeTBMM1F0ZEdJMEwzUXVOR0ZJTkdCMEw3UXNkR0wwWUxRdU5DNUlOQzYwTDdRdk5DLzBMN1F2ZEMxMEwzUmd0Q3dYSEpjYmlBcUlFQndZWEpoYlNCN1UzUnlhVzVuZlNCbUlOQ1kwTHpSanlEUmdkQyswTEhSaTlHQzBMalJqMXh5WEc0Z0tpOWNjbHh1UkdGMFpWSmhibWRsVUdsamEyVnlMbkJ5YjNSdmRIbHdaUzVmWTJGc2JHSmhZMnNnUFNCbWRXNWpkR2x2YmlobUtTQjdYSEpjYmlBZ0lDQnBaaUFvZEhsd1pXOW1JSFJvYVhNdWIzQjBhVzl1Y3k1dmJsdG1YU0E5UFNBblpuVnVZM1JwYjI0bktTQjdYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWIzQjBhVzl1Y3k1dmJsdG1YUzVoY0hCc2VTaDBhR2x6TENCYlhTNXpiR2xqWlM1allXeHNLR0Z5WjNWdFpXNTBjeXdnTVNrcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJSEpsZEhWeWJqdGNjbHh1ZlZ4eVhHNWNjbHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdSR0YwWlZKaGJtZGxVR2xqYTJWeU8xeHlYRzRpWFN3aWMyOTFjbU5sVW05dmRDSTZJaUo5IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCBEYXRlUmFuZ2VQaWNrZXIsIHtMT0NLX1VOQVZBSUxBQkxFLCBMT0NLX0xPQ0tFRH0gZnJvbSAnLi4vLi4vZGlzdC9kYXRlcmFuZ2VwaWNrZXInO1xyXG5cclxuY29uc3QgJGZvcm0gPSBkb2N1bWVudC5mb3Jtc1swXTtcclxuY29uc3QgJGRhdGVfZnJvbSA9ICRmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZGF0ZV9mcm9tXCJdJyk7XHJcbmNvbnN0ICRkYXRlX3RvICAgPSAkZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImRhdGVfdG9cIl0nKTtcclxuXHJcbi8vINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvQtSDQtNCw0YLRi1xyXG5jb25zdCBibG9ja2VkRGF0ZXMgPSB7fTtcclxuY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbmRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbmZvciAobGV0IGkgPSAwOyBpIDwgNjA7ICsraSkge1xyXG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjYpIHtcclxuICAgICAgICBibG9ja2VkRGF0ZXNbZGF0ZV0gPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7XHJcbn1cclxuXHJcbm5ldyBEYXRlUmFuZ2VQaWNrZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RhdGVyYW5nZXBpY2tlcicpLCB7XHJcbiAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpLFxyXG4gICAgbWF4RGF0ZTogbmV3IERhdGUoJzIwMjItMDUtMjAnKSxcclxuICAgIG1vbnRoc0NvdW50OiAyLFxyXG4gICAgcGVyUm93OiAzLFxyXG4gICAgc2luZ2xlTW9kZTogZmFsc2UsXHJcbiAgICBicmVha3BvaW50czoge1xyXG4gICAgICAgIDk2MDoge1xyXG4gICAgICAgICAgICBtb250aHNDb3VudDogMTIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICA3MjA6IHtcclxuICAgICAgICAgICAgbW9udGhzQ291bnQ6IDMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICA0ODA6IHtcclxuICAgICAgICAgICAgbW9udGhzQ291bnQ6IDEsXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBvbjoge1xyXG4gICAgICAgIHJhbmdlU2VsZWN0OiBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgJGRhdGVfZnJvbS52YWx1ZSA9IGRhdGVfZnJvbS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICAgICAgJGRhdGVfdG8udmFsdWUgPSBkYXRlX3RvLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGF5U2VsZWN0OiBmdW5jdGlvbihkYXRlX2Zyb20pIHtcclxuICAgICAgICAgICAgJGRhdGVfZnJvbS52YWx1ZSA9IGRhdGVfZnJvbS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGZpbHRlcjoge1xyXG4gICAgICAgIGxvY2tEYXlzOiBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgICAgIGlmIChibG9ja2VkRGF0ZXNbZGF0ZV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBMT0NLX0xPQ0tFRDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG9vbHRpcFRleHQ6IGZ1bmN0aW9uKGRheXMpIHtcclxuICAgICAgICAgICAgY29uc3QgbmlnaHRzID0gZGF5cyAtIDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBsdXJhbChuaWdodHMsIFsnJWQg0L3QvtGH0YwnLCAnJWQg0L3QvtGH0LgnLCAnJWQg0L3QvtGH0LXQuSddKS5yZXBsYWNlKCclZCcsIG5pZ2h0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==