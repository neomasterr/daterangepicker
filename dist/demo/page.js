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
    /**
     * Инициализация
     */
    this.init = function() {
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

        // рядность
        if (typeof this.options.perRow == 'undefined') {
            this.options.perRow = this.options.monthsCount;
        }

        if (this.options.minDate) {
            this.options.minDate.setHours(0, 0, 0, 0);
        }

        // текущий день
        this._today = new Date();
        this._today.setHours(0, 0, 0, 0);

        this._$picker = this._$createElement(
            `<div class="Daterangepicker">
                <div class="Daterangepicker__months"></div>
                <div class="Daterangepicker__tooltip"></div>
            </div>`
        );

        // элементы
        this._$months  = this._$picker.querySelector('.Daterangepicker__months');
        this._$tooltip = this._$picker.querySelector('.Daterangepicker__tooltip');

        // инициализация состояний
        this.rangeReset();

        // рендер
        this._$createMonths(this.options.minDate);
        this._$container.appendChild(this._$picker);
    }

    /**
     * Название месяца
     * @param  {Date} date Объект даты
     * @return {String}
     */
    this.getMonthFormatted = function(date) {
        const title = this.getDateTimeFormat(date, {month: 'long'});
        return title.slice(0, 1).toUpperCase() + title.slice(1);
    }

    /**
     * Форматирование даты для текущей локали
     * @param  {Date}   date    Объект даты
     * @param  {Object} options Параметры
     * @return {String}
     */
    this.getDateTimeFormat = function(date, options) {
        return Intl.DateTimeFormat(this.options.locale, options).format(date);
    }

    /**
     * Дни недели
     */
    this.getWeekDaysFormatted = function() {
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
    this.getDaysCountInMonth = function(date) {
        const days = new Date(date.getTime());
        days.setHours(0, 0, 0, 0);
        days.setMonth(days.getMonth() + 1);
        days.setDate(0);
        return days.getDate();
    }

    /**
     * Рендер диапазона месяцев
     * @param {Date} date_from Начальная дата
     */
    this._$createMonths = function(date_from) {
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

        if (this._selection && (this._selection.date_from || this._selection.date_to)) {
            this._rangeVisualSelect(this._selection.date_from, this._selection.date_to);
        }
    }

    /**
     * Рендер месяца
     * @param {Date} date Месяц
     */
    this._$createMonth = function(date) {
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
    this._onArrowClick = function($arrow, name) {
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

        this._$createMonths(date);
    }

    /**
     * Рендер недели
     * @param  {Date} date Объект даты
     * @return {Element}
     */
    this._$createWeek = function(date) {
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
    this._$createDay = function(date) {
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
    this._onDayClickEvent = function(e) {
        this._onDayClick(e.target);
    }

    /**
     * Событие ховера
     * @param {Event} e DOM событие
     */
    this._onDayMouseEnterEvent = function(e) {
        this._onDayMouseEnter(e.target);
    }

    /**
     * Ховер на элементе дня
     * @param {Element} $day HTML Элемент
     */
    this._onDayMouseEnter = function($day) {
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
    this._onDayClick = function($day) {
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
     * Сброс выделенных дат
     */
    this.rangeReset = function() {
        this._rangeVisualReset();
        this._selection = {};
    }

    /**
     * Визуальный сброс выделенных дат
     */
    this._rangeVisualReset = function() {
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
    this._rangeVisualSelect = function(date_from, date_to) {
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
    this._tooltipShow = function($day, days) {
        const rect = $day.getBoundingClientRect();

        this._$tooltip.textContent = this.options.filter.tooltipText.call(this, days) || '';
        this._$tooltip.classList.toggle('is-show', this._$tooltip.textContent.length);

        this._$tooltip.style.top = Math.round(rect.top - rect.height - this._$tooltip.offsetHeight) + 'px';
        this._$tooltip.style.left = Math.round(rect.left + rect.width / 2 - this._$tooltip.offsetWidth / 2) + 'px';
    }

    /**
     * Скрыть подсказку
     */
    this._tooltipHide = function() {
        this._$tooltip.classList.remove('is-show');
    }

    /**
     * Текст подсказки по умолчанию
     * @param  {Number} days Количество дней
     * @return {String}
     */
    this._filterTooltipText = function(days) {
        return this.plural(days, ['%d день', '%d дня', '%d дней']).replace('%d', days);
    }

    /**
     * Выделение диапазона дат
     * @param {Date} date_from Начальная дата
     * @param {Date} date_to   Конечная дата
     */
    this.rangeSelect = function(date_from, date_to) {
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

        // событие
        this._callback('rangeSelect', date_from, date_to);
    }

    /**
     * Проверка возможности выделения дат
     * @param  {Date date_from Начальная дата
     * @param  {Date date_to   Конечная дата
     * @return {Boolean}
     */
    this.getIsRangeSelectable = function(date_from, date_to) {
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
    this.getDayLocked = function(date) {
        // выбор дат вне доступного диапазона
        if (date < this.options.minDate || date > this.options.maxDate) {
            return LOCK_UNAVAILABLE;
        }

        return this.options.filter.lockDays.call(this, date);
    }

    /**
     * Фильтр недоступных дней по умолчанию
     * @return {Boolean}
     */
    this._filterLockDays = function() {
        // все дни доступны
        return false;
    }

    /**
     * Склонение (1 бобёр, 2 бобра, 5 бобров)
     * @param  {Number} value Количество
     * @param  {Array}  forms Массив из 3х элементов, может содержать спецификатор %d для замены
     * @return {String}
     */
    this.plural = function (value, forms) {
        return (value % 10 == 1 && value % 100 != 11 ? forms[0] : (value % 10 >= 2 && value % 10 <= 4 && (value % 100 < 10 || value % 100 >= 20) ? forms[1] : forms[2])).replace('%d', value);
    }

    /**
     * Элемент календарного дня
     * @param  {Date} date Дата
     * @return {Element}   HTML элемент
     */
    this._$getDayByDate = function(date) {
        const time = date instanceof Date ? date.getTime() : 0;
        return this._$months.querySelector('.Day[data-time="' + time + '"]');
    }

    /**
     * Рендер дня - заглушки
     * @param  {Date} date Объект даты
     * @return {Element}
     */
    this._$createEmptyDay = function() {
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
    this._$createElement = function(html) {
        const div = document.createElement('div');
        div.insertAdjacentHTML('afterbegin', html);
        return div.children.length > 1 ? div.children : div.firstElementChild;
    }

    /**
     * Safe вызов внешних событий компонента
     * @param {String} f Имя события
     */
    this._callback = function(f) {
        if (typeof this.options.on[f] == 'function') {
            return this.options.on[f].apply(this, [].slice.call(arguments, 1));
        }

        return;
    }

    this.init();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DateRangePicker);

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9zY3NzL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOztVQ1ZBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDTztBQUNBOztBQUVQLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxrQkFBa0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLHNCQUFzQjtBQUNuQzs7QUFFQTtBQUNBO0FBQ0E7QUFD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QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQixnQkFBZ0I7QUFDaEIsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixLQUFLO0FBQ3JCLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLE9BQU87QUFDdkIsZ0JBQWdCLE1BQU07QUFDdEIsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsS0FBSztBQUNyQixnQkFBZ0IsUUFBUTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsS0FBSztBQUNyQixnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsT0FBTztBQUN2QixnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWUsZUFBZSxFQUFDIiwiZmlsZSI6ImRhdGVyYW5nZXBpY2tlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiRGF0ZXJhbmdlcGlja2VyXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vINGB0L7RgdGC0L7Rj9C90LjRjyDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbmV4cG9ydCBjb25zdCBMT0NLX1VOQVZBSUxBQkxFID0gMTtcclxuZXhwb3J0IGNvbnN0IExPQ0tfTE9DS0VEICAgICAgPSAyO1xyXG5cclxuZnVuY3Rpb24gRGF0ZVJhbmdlUGlja2VyKCRjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRj1xyXG4gICAgICovXHJcbiAgICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLl8kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgICAgICBmaXJzdERheU9mVGhlV2Vlazogb3B0aW9ucy5maXJzdERheU9mVGhlV2VlayB8fCAxLCAgICAgICAgICAvLyDQv9C10YDQstGL0Lkg0LTQtdC90Ywg0L3QtdC00LXQu9C4LCAwID0g0LLRgSwgMSA9INC/0L0sIC4uLlxyXG4gICAgICAgICAgICBzaW5nbGVNb2RlOiAgICAgICAgb3B0aW9ucy5zaW5nbGVNb2RlICAgICAgICB8fCBmYWxzZSwgICAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0Ysg0LLQvNC10YHRgtC+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgICAgICBsb2NhbGU6ICAgICAgICAgICAgb3B0aW9ucy5sb2NhbGUgICAgICAgICAgICB8fCAncnUtUlUnLFxyXG4gICAgICAgICAgICBtaW5EYXlzOiAgICAgICAgICAgb3B0aW9ucy5taW5EYXlzICAgICAgICAgICB8fCAxLCAgICAgICAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC00LjQsNC/0LDQt9C+0L3QtVxyXG4gICAgICAgICAgICBtb250aHNDb3VudDogICAgICAgb3B0aW9ucy5tb250aHNDb3VudCAgICAgICB8fCAxMixcclxuICAgICAgICAgICAgcGVyUm93OiAgICAgICAgICAgIG9wdGlvbnMucGVyUm93ICAgICAgICAgICAgfHwgdW5kZWZpbmVkLCAgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LzQtdGB0Y/RhtC10LIg0LIg0YDRj9C00YNcclxuICAgICAgICAgICAgbWluRGF0ZTogICAgICAgICAgIG9wdGlvbnMubWluRGF0ZSAgICAgICAgICAgfHwgbmV3IERhdGUoKSwgLy8g0LzQuNC90LjQvNCw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICAgICAgICBtYXhEYXRlOiAgICAgICAgICAgb3B0aW9ucy5tYXhEYXRlICAgICAgICAgICB8fCB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIC8vINGB0L7QsdGL0YLQuNGPXHJcbiAgICAgICAgICAgIG9uOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgICAgIHJhbmdlU2VsZWN0OiBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICAgICAgICAgICAgZGF5U2VsZWN0OiAgIG51bGwsIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQvtC00L3QvtC5INC00LDRgtGLICjRgtC+0LvRjNC60L4g0L/RgNC4IHNpbmdsZU1vZGU6IHRydWUpXHJcbiAgICAgICAgICAgIH0sIG9wdGlvbnMub24gfHwge30pLFxyXG4gICAgICAgICAgICAvLyDRhNC40LvRjNGC0YDRg9GO0YnQuNC1INC80LXRgtC+0LTRi1xyXG4gICAgICAgICAgICBmaWx0ZXI6IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICAgICAgbG9ja0RheXM6ICAgIHRoaXMuX2ZpbHRlckxvY2tEYXlzLCAgICAvLyBjYWxsYmFjayhkYXRlKSDRhNGD0L3QutGG0LjRjyDQsdC70L7QutC40YDQvtCy0LDQvdC40Y8g0LTQsNGCLCB0cnVlL0xPQ0tcclxuICAgICAgICAgICAgICAgIHRvb2x0aXBUZXh0OiB0aGlzLl9maWx0ZXJUb29sdGlwVGV4dCwgLy8gY2FsbGJhY2soZGF5cykg0LLRi9Cy0L7QtCDRgtC10LrRgdGC0LAg0L/QvtC00YHQutCw0LfQutC4XHJcbiAgICAgICAgICAgIH0sIG9wdGlvbnMuZmlsdGVyIHx8IHt9KSxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGA0Y/QtNC90L7RgdGC0YxcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5wZXJSb3cgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBlclJvdyA9IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubWluRGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGC0LXQutGD0YnQuNC5INC00LXQvdGMXHJcbiAgICAgICAgdGhpcy5fdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuX3RvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLl8kcGlja2VyID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX19tb250aHNcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXBcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vINGN0LvQtdC80LXQvdGC0YtcclxuICAgICAgICB0aGlzLl8kbW9udGhzICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzJyk7XHJcbiAgICAgICAgdGhpcy5fJHRvb2x0aXAgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5EYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXAnKTtcclxuXHJcbiAgICAgICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcblxyXG4gICAgICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgICAgIHRoaXMuXyRjcmVhdGVNb250aHModGhpcy5vcHRpb25zLm1pbkRhdGUpO1xyXG4gICAgICAgIHRoaXMuXyRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fJHBpY2tlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQndCw0LfQstCw0L3QuNC1INC80LXRgdGP0YbQsFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXRNb250aEZvcm1hdHRlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge21vbnRoOiAnbG9uZyd9KTtcclxuICAgICAgICByZXR1cm4gdGl0bGUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKSArIHRpdGxlLnNsaWNlKDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90LjQtSDQtNCw0YLRiyDQtNC70Y8g0YLQtdC60YPRidC10Lkg0LvQvtC60LDQu9C4XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMg0J/QsNGA0LDQvNC10YLRgNGLXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQgPSBmdW5jdGlvbihkYXRlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIEludGwuRGF0ZVRpbWVGb3JtYXQodGhpcy5vcHRpb25zLmxvY2FsZSwgb3B0aW9ucykuZm9ybWF0KGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQvdC4INC90LXQtNC10LvQuFxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldFdlZWtEYXlzRm9ybWF0dGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIDIpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgKytpKSB7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBkYXk6IGRhdGUuZ2V0RGF5KCksXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7d2Vla2RheTogJ3Nob3J0J30pLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINGB0L7Qs9C70LDRgdC90L4g0L3QsNGB0YLRgNC+0LXQvdC90L7QvNGDINC/0LXRgNCy0L7QvNGDINC00L3RjiDQvdC10LTQtdC70LhcclxuICAgICAgICByZXN1bHQuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmaXJzdERheU9mVGhlV2VlayA9IHRoaXMub3B0aW9ucy5maXJzdERheU9mVGhlV2VlayAlIDc7XHJcbiAgICAgICAgICAgIGxldCBkYXlBID0gYS5kYXk7XHJcbiAgICAgICAgICAgIGxldCBkYXlCID0gYi5kYXk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF5QSA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF5QiA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkYXlBIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIGRheUEgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRheUIgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICAgICAgZGF5QiArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGF5QSAtIGRheUI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuSDQsiDQvNC10YHRj9GG0LVcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0RGF5c0NvdW50SW5Nb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgZGF5cy5zZXRNb250aChkYXlzLmdldE1vbnRoKCkgKyAxKTtcclxuICAgICAgICBkYXlzLnNldERhdGUoMCk7XHJcbiAgICAgICAgcmV0dXJuIGRheXMuZ2V0RGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC00LjQsNC/0LDQt9C+0L3QsCDQvNC10YHRj9GG0LXQslxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVNb250aHMgPSBmdW5jdGlvbihkYXRlX2Zyb20pIHtcclxuICAgICAgICB3aGlsZSAodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRtb250aHMucmVtb3ZlQ2hpbGQodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgICAgICB0aGlzLl90b29sdGlwSGlkZSgpO1xyXG5cclxuICAgICAgICAvLyDQv9GA0LXRgNC10L3QtNC10YAg0LzQtdGB0Y/RhtC10LJcclxuICAgICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGNvbnN0ICRtb250aHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgICRtb250aHMucHVzaCh0aGlzLl8kY3JlYXRlTW9udGgoY3VycmVudERhdGUpKTtcclxuICAgICAgICAgICAgY3VycmVudERhdGUuc2V0TW9udGgoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkbW9udGhzLmxlbmd0aDsgaSArPSB0aGlzLm9wdGlvbnMucGVyUm93KSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnRGF0ZXJhbmdlcGlja2VyX19yb3cnO1xyXG5cclxuICAgICAgICAgICAgJG1vbnRocy5zbGljZShpLCBpICsgdGhpcy5vcHRpb25zLnBlclJvdykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgICAgICAgICAgJHJvdy5hcHBlbmRDaGlsZCgkbW9udGgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuXyRtb250aHMuYXBwZW5kQ2hpbGQoJHJvdyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0aW9uICYmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC80LXRgdGP0YbQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlINCc0LXRgdGP0YZcclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgICAgICBjb25zdCBtb250aFRpdGxlID0gdGhpcy5nZXRNb250aEZvcm1hdHRlZChkYXRlKTtcclxuICAgICAgICBjb25zdCB3ZWVrRGF5cyA9IHRoaXMuZ2V0V2Vla0RheXNGb3JtYXR0ZWQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgJG1vbnRoID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiTW9udGhcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tcHJldiR7KHRoaXMub3B0aW9ucy5taW5EYXRlICYmIGRhdGUgPD0gdGhpcy5vcHRpb25zLm1pbkRhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk03IDEzTDEgN0w3IDFcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX190aXRsZVwiPiR7bW9udGhUaXRsZX0gJHtkYXRlLmdldEZ1bGxZZWFyKCl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLW5leHQkeyh0aGlzLm9wdGlvbnMubWF4RGF0ZSAmJiBkYXRlID49IHRoaXMub3B0aW9ucy5tYXhEYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMSAwLjk5OTk5OUw3IDdMMSAxM1wiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrXCI+JHt3ZWVrRGF5cy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtkYXlcIj4ke2l0ZW0udGl0bGV9PC9kaXY+YFxyXG4gICAgICAgICAgICAgICAgfSkuam9pbignJyl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2RheXNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vINGB0YLRgNC10LvQutC4XHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1wcmV2JywgbmFtZTogJ3ByZXYnfSxcclxuICAgICAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tbmV4dCcsIG5hbWU6ICduZXh0J30sXHJcbiAgICAgICAgXS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkYXJyb3cgPSAkbW9udGgucXVlcnlTZWxlY3RvcihpdGVtLnNlbGVjdG9yKTtcclxuICAgICAgICAgICAgJGFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkFycm93Q2xpY2soJGFycm93LCBpdGVtLm5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g0YDQtdC90LTQtdGAINC00L3QtdC5XHJcbiAgICAgICAgY29uc3QgJGRheXMgPSAkbW9udGgucXVlcnlTZWxlY3RvcignLk1vbnRoX19kYXlzJyk7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBkYXlzLnNldERhdGUoMSk7XHJcbiAgICAgICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGRheXMuZ2V0TW9udGgoKSA9PSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlV2VlaygpO1xyXG5cclxuICAgICAgICAgICAgd2Vla0RheXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXlzLmdldERheSgpICE9IGl0ZW0uZGF5IHx8IGRheXMuZ2V0TW9udGgoKSAhPSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRW1wdHlEYXkoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVEYXkoZGF5cykpO1xyXG4gICAgICAgICAgICAgICAgZGF5cy5zZXREYXRlKGRheXMuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJGRheXMuYXBwZW5kQ2hpbGQoJHdlZWspO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRtb250aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0LvQuNC6INC/0L4g0YHRgtGA0LXQu9C60LUg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPINC80LXRgdGP0YbQsFxyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSAkYXJyb3cgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgICAg0JjQvNGPIChwcmV2LCBuZXh0KVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkFycm93Q2xpY2sgPSBmdW5jdGlvbigkYXJyb3csIG5hbWUpIHtcclxuICAgICAgICBpZiAoJGFycm93LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUocGFyc2VJbnQodGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuTW9udGgnKS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICAgICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyAobmFtZSA9PSAncHJldicgPyAtdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50IDogdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KSk7XHJcblxyXG4gICAgICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNC40L3QuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICAgICAgaWYgKGRhdGUgPCB0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1pbkRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICAgICAgY29uc3QgZW5kRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgZW5kRGF0ZS5zZXRNb250aChlbmREYXRlLmdldE1vbnRoKCkgKyB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpO1xyXG4gICAgICAgICAgICBpZiAoZW5kRGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1heERhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpIC0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50ICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuXyRjcmVhdGVNb250aHMoZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10L3QtNC10YAg0L3QtdC00LXQu9C4XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7RWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZVdlZWsgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJXZWVrXCI+PC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiAkd2VlaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQvdC00LXRgCDQtNC90Y9cclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlRGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGxvY2tlZCA9IHRoaXMuZ2V0RGF5TG9ja2VkKGRhdGUpO1xyXG4gICAgICAgIGNvbnN0IHRvZGF5ICA9IHRoaXMuX3RvZGF5LmdldFRpbWUoKSA9PSBkYXRlLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNsYXNzTmFtZSA9ICcnO1xyXG4gICAgICAgIGNsYXNzTmFtZSArPSBsb2NrZWQgPyAnIGlzLWRpc2FibGVkJyA6ICcnO1xyXG4gICAgICAgIGNsYXNzTmFtZSArPSBsb2NrZWQgPT0gTE9DS19MT0NLRUQgPyAnIGlzLWxvY2tlZCcgOiAnJztcclxuICAgICAgICBjbGFzc05hbWUgKz0gdG9kYXkgPyAnIGlzLXRvZGF5JyA6ICcnO1xyXG5cclxuICAgICAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5JHtjbGFzc05hbWV9XCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIiBkYXRhLWRheT1cIiR7ZGF0ZS5nZXREYXkoKX1cIj4ke2RhdGUuZ2V0RGF0ZSgpfTwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25EYXlDbGlja0V2ZW50LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRkYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtSDQutC70LjQutCwINC/0L4g0LTQvdGOXHJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheUNsaWNrRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdGhpcy5fb25EYXlDbGljayhlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtSDRhdC+0LLQtdGA0LBcclxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHRoaXMuX29uRGF5TW91c2VFbnRlcihlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpdC+0LLQtdGAINC90LAg0Y3Qu9C10LzQtdC90YLQtSDQtNC90Y9cclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlciA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXkuZGF0YXNldC50aW1lID09IHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20uZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0LvQuNC6INC/0L4g0LTQvdGOXHJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheUNsaWNrID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgICAgIC8vINC00LXQvdGMINC30LDQsdC70L7QutC40YDQvtCy0LDQvVxyXG4gICAgICAgIGlmICgkZGF5LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0YtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2soJ2RheVNlbGVjdCcsIG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YHQsdGA0L7RgSDQstGL0LHRgNCw0L3QvdC+0LPQviDRgNCw0L3QtdC1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG5cclxuICAgICAgICAvLyDQstGL0LHRgNCw0L3QsCDQvdCw0YfQsNC70YzQvdCw0Y8gLyDQutC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAgICAgICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAgICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5yYW5nZVNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxSZXNldCgpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQuNC30YPQsNC70YzQvdGL0Lkg0YHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgICAgICAkZGF5cy5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgICAgICAkZGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nLCAnaXMtc2VsZWN0ZWQtdG8nLCAnaXMtc2VsZWN0ZWQtYmV0d2VlbicpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDQv9GA0Y/Rh9C10Lwg0L/QvtC00YHQutCw0LfQutGDXHJcbiAgICAgICAgdGhpcy5fdG9vbHRpcEhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0LjQt9GD0LDQu9GM0L3QvtC1INCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YJcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgIGlmIChkYXRlX2Zyb20gJiYgZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF0ZV90byAmJiBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRpbWVfZnJvbSA9IGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX2Zyb20uZ2V0VGltZSgpIDogMDtcclxuICAgICAgICBsZXQgdGltZV90byA9IGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV90by5nZXRUaW1lKCkgOiAwO1xyXG4gICAgICAgIGlmICh0aW1lX2Zyb20gPiB0aW1lX3RvKSB7XHJcbiAgICAgICAgICAgIFt0aW1lX2Zyb20sIHRpbWVfdG9dID0gW3RpbWVfdG8sIHRpbWVfZnJvbV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCINC80LXQttC00YMg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0LlcclxuICAgICAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkZGF5cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAkZGF5c1tpXS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zZWxlY3RlZC1iZXR3ZWVuJywgJGRheXNbaV0uZGF0YXNldC50aW1lID4gdGltZV9mcm9tICYmICRkYXlzW2ldLmRhdGFzZXQudGltZSA8IHRpbWVfdG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5INC/0L7Qt9C40YbQuNC4XHJcbiAgICAgICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgICAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgIT0gJGRheV9mcm9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgICAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgIT0gJGRheV90bykge1xyXG4gICAgICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YHQvtGF0YDQsNC90LXQvdC40LUg0LIg0LrQtdGIXHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCA9ICRkYXlfZnJvbTtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCA9ICRkYXlfdG87XHJcblxyXG4gICAgICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRheXMgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRpbWVfZnJvbSAtIHRpbWVfdG8pIC8gODY0MDBlMykgKyAxO1xyXG4gICAgICAgICAgICB0aGlzLl90b29sdGlwU2hvdygkZGF5X3RvLCBkYXlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LrQsNC3INC/0L7QtNGB0LrQsNC30LrQuFxyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSAkZGF5INCS0YvQsdGA0LDQvdC90YvQuSDQtNC10L3RjFxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9ICBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX3Rvb2x0aXBTaG93ID0gZnVuY3Rpb24oJGRheSwgZGF5cykge1xyXG4gICAgICAgIGNvbnN0IHJlY3QgPSAkZGF5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgICB0aGlzLl8kdG9vbHRpcC50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5maWx0ZXIudG9vbHRpcFRleHQuY2FsbCh0aGlzLCBkYXlzKSB8fCAnJztcclxuICAgICAgICB0aGlzLl8kdG9vbHRpcC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zaG93JywgdGhpcy5fJHRvb2x0aXAudGV4dENvbnRlbnQubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUudG9wID0gTWF0aC5yb3VuZChyZWN0LnRvcCAtIHJlY3QuaGVpZ2h0IC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSArICdweCc7XHJcbiAgICAgICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUubGVmdCA9IE1hdGgucm91bmQocmVjdC5sZWZ0ICsgcmVjdC53aWR0aCAvIDIgLSB0aGlzLl8kdG9vbHRpcC5vZmZzZXRXaWR0aCAvIDIpICsgJ3B4JztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0LrRgNGL0YLRjCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgICAqL1xyXG4gICAgdGhpcy5fdG9vbHRpcEhpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLl8kdG9vbHRpcC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zaG93Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQotC10LrRgdGCINC/0L7QtNGB0LrQsNC30LrQuCDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX2ZpbHRlclRvb2x0aXBUZXh0ID0gZnVuY3Rpb24oZGF5cykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsdXJhbChkYXlzLCBbJyVkINC00LXQvdGMJywgJyVkINC00L3RjycsICclZCDQtNC90LXQuSddKS5yZXBsYWNlKCclZCcsIGRheXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLRi9C00LXQu9C10L3QuNC1INC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICB0aGlzLnJhbmdlU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICAgICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUoZGF0ZV9mcm9tLCBkYXRlX3RvKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICAgICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdChkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG5cclxuICAgICAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1XHJcbiAgICAgICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGB0L7QsdGL0YLQuNC1XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2soJ3JhbmdlU2VsZWN0JywgZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0LLQvtC30LzQvtC20L3QvtGB0YLQuCDQstGL0LTQtdC70LXQvdC40Y8g0LTQsNGCXHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlIGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqIEBwYXJhbSAge0RhdGUgZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhkYXRlX2Zyb20uZ2V0VGltZSgpIC0gZGF0ZV90by5nZXRUaW1lKCkpIC8gMTAwMCAvIDg2NDAwO1xyXG4gICAgICAgIGlmIChkaWZmIDwgdGhpcy5vcHRpb25zLm1pbkRheXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQv9C+0L/QsNC00LDQvdC40Y8g0LIg0LTQuNCw0L/QsNC30L7QvSDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbiAgICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBkYXkuc2V0VGltZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGRheSA8IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0RGF5TG9ja2VkKGRheSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINC90LAg0LTQvtGB0YLRg9C/0L3QvtGB0YLRjCDQtNC90Y8g0LTQu9GPINCx0YDQvtC90LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59ICAgdHJ1ZSDQtdGB0LvQuCDQtNC+0YHRgtGD0L/QtdC9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0RGF5TG9ja2VkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCy0L3QtSDQtNC+0YHRgtGD0L/QvdC+0LPQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlIHx8IGRhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gTE9DS19VTkFWQUlMQUJMRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmlsdGVyLmxvY2tEYXlzLmNhbGwodGhpcywgZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpNC40LvRjNGC0YAg0L3QtdC00L7RgdGC0YPQv9C90YvRhSDQtNC90LXQuSDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fZmlsdGVyTG9ja0RheXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDQstGB0LUg0LTQvdC4INC00L7RgdGC0YPQv9C90YtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC60LvQvtC90LXQvdC40LUgKDEg0LHQvtCx0ZHRgCwgMiDQsdC+0LHRgNCwLCA1INCx0L7QsdGA0L7QsilcclxuICAgICAqIEBwYXJhbSAge051bWJlcn0gdmFsdWUg0JrQvtC70LjRh9C10YHRgtCy0L5cclxuICAgICAqIEBwYXJhbSAge0FycmF5fSAgZm9ybXMg0JzQsNGB0YHQuNCyINC40LcgM9GFINGN0LvQtdC80LXQvdGC0L7Qsiwg0LzQvtC20LXRgiDRgdC+0LTQtdGA0LbQsNGC0Ywg0YHQv9C10YbQuNGE0LjQutCw0YLQvtGAICVkINC00LvRjyDQt9Cw0LzQtdC90YtcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAqL1xyXG4gICAgdGhpcy5wbHVyYWwgPSBmdW5jdGlvbiAodmFsdWUsIGZvcm1zKSB7XHJcbiAgICAgICAgcmV0dXJuICh2YWx1ZSAlIDEwID09IDEgJiYgdmFsdWUgJSAxMDAgIT0gMTEgPyBmb3Jtc1swXSA6ICh2YWx1ZSAlIDEwID49IDIgJiYgdmFsdWUgJSAxMCA8PSA0ICYmICh2YWx1ZSAlIDEwMCA8IDEwIHx8IHZhbHVlICUgMTAwID49IDIwKSA/IGZvcm1zWzFdIDogZm9ybXNbMl0pKS5yZXBsYWNlKCclZCcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCt0LvQtdC80LXQvdGCINC60LDQu9C10L3QtNCw0YDQvdC+0LPQviDQtNC90Y9cclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9ICAgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kZ2V0RGF5QnlEYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHRpbWUgPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogMDtcclxuICAgICAgICByZXR1cm4gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuRGF5W2RhdGEtdGltZT1cIicgKyB0aW1lICsgJ1wiXScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC00L3RjyAtINC30LDQs9C70YPRiNC60LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlRW1wdHlEYXkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5IGlzLWVtcHR5XCI+PC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiAkZGF5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwINC40LcgSFRNTCDRgtC10LrRgdGC0LBcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaHRtbCBIVE1MINGC0LXQutGB0YJcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24oaHRtbCkge1xyXG4gICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdi5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgICAgICByZXR1cm4gZGl2LmNoaWxkcmVuLmxlbmd0aCA+IDEgPyBkaXYuY2hpbGRyZW4gOiBkaXYuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTYWZlINCy0YvQt9C+0LIg0LLQvdC10YjQvdC40YUg0YHQvtCx0YvRgtC40Lkg0LrQvtC80L/QvtC90LXQvdGC0LBcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmINCY0LzRjyDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICovXHJcbiAgICB0aGlzLl9jYWxsYmFjayA9IGZ1bmN0aW9uKGYpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbltmXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub25bZl0uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXQoKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGF0ZVJhbmdlUGlja2VyO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9

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

function isMobile() {
    return window.innerWidth <= 960;
}

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
    monthsCount: isMobile() ? 12 : 2,
    perRow: 3,
    singleMode: false,
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
        lockDays: function(day) {
            if (blockedDates[day]) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9kaXN0L2RhdGVyYW5nZXBpY2tlci5qcyIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2RlbW8vcGFnZS5zY3NzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9kZW1vL3BhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJLElBQXlEO0FBQzdEO0FBQ0EsTUFBTSxFQUtnQztBQUN0QyxDQUFDO0FBQ0Qsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQSxjQUFjLDhCQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxnQkFBZ0IsOEJBQW1CLHdCQUF3Qiw4QkFBbUI7QUFDOUUsbURBQW1ELHlDQUF5QztBQUM1RjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxpRUFBaUUsa0JBQWtCO0FBQ25GO0FBQ0EsMERBQTBELGNBQWM7QUFDeEU7QUFDQSxXQUFXO0FBQ1g7QUFD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LENBQUMiLCJmaWxlIjoiLi9kZW1vL3BhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkRhdGVyYW5nZXBpY2tlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKCgpID0+IHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHRcInVzZSBzdHJpY3RcIjtcbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgc2NvcGVcbi8qKioqKiovIFx0dmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcbi8qKioqKiovIFx0XHRcdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcbi8qKioqKiovIFx0XHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKVxuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuLyoqKioqKi8gXHRcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4vKioqKioqLyBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuLy8gVGhpcyBlbnRyeSBuZWVkIHRvIGJlIHdyYXBwZWQgaW4gYW4gSUlGRSBiZWNhdXNlIGl0IG5lZWQgdG8gYmUgaXNvbGF0ZWQgYWdhaW5zdCBvdGhlciBlbnRyeSBtb2R1bGVzLlxuKCgpID0+IHtcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9zY3NzL2luZGV4LnNjc3MgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5cbn0pKCk7XG5cbi8vIFRoaXMgZW50cnkgbmVlZCB0byBiZSB3cmFwcGVkIGluIGFuIElJRkUgYmVjYXVzZSBpdCBuZWVkIHRvIGJlIGlzb2xhdGVkIGFnYWluc3Qgb3RoZXIgZW50cnkgbW9kdWxlcy5cbigoKSA9PiB7XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL2pzL2luZGV4LmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqL1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLyogaGFybW9ueSBleHBvcnQgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIHtcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJMT0NLX1VOQVZBSUxBQkxFXCI6ICgpID0+ICgvKiBiaW5kaW5nICovIExPQ0tfVU5BVkFJTEFCTEUpLFxuLyogaGFybW9ueSBleHBvcnQgKi8gICBcIkxPQ0tfTE9DS0VEXCI6ICgpID0+ICgvKiBiaW5kaW5nICovIExPQ0tfTE9DS0VEKSxcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJkZWZhdWx0XCI6ICgpID0+IChfX1dFQlBBQ0tfREVGQVVMVF9FWFBPUlRfXylcbi8qIGhhcm1vbnkgZXhwb3J0ICovIH0pO1xuLy8g0YHQvtGB0YLQvtGP0L3QuNGPINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuY29uc3QgTE9DS19VTkFWQUlMQUJMRSA9IDE7XHJcbmNvbnN0IExPQ0tfTE9DS0VEICAgICAgPSAyO1xyXG5cclxuZnVuY3Rpb24gRGF0ZVJhbmdlUGlja2VyKCRjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRj1xyXG4gICAgICovXHJcbiAgICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLl8kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgICAgICBmaXJzdERheU9mVGhlV2Vlazogb3B0aW9ucy5maXJzdERheU9mVGhlV2VlayB8fCAxLCAgICAgICAgICAvLyDQv9C10YDQstGL0Lkg0LTQtdC90Ywg0L3QtdC00LXQu9C4LCAwID0g0LLRgSwgMSA9INC/0L0sIC4uLlxyXG4gICAgICAgICAgICBzaW5nbGVNb2RlOiAgICAgICAgb3B0aW9ucy5zaW5nbGVNb2RlICAgICAgICB8fCBmYWxzZSwgICAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0Ysg0LLQvNC10YHRgtC+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgICAgICBsb2NhbGU6ICAgICAgICAgICAgb3B0aW9ucy5sb2NhbGUgICAgICAgICAgICB8fCAncnUtUlUnLFxyXG4gICAgICAgICAgICBtaW5EYXlzOiAgICAgICAgICAgb3B0aW9ucy5taW5EYXlzICAgICAgICAgICB8fCAxLCAgICAgICAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC00LjQsNC/0LDQt9C+0L3QtVxyXG4gICAgICAgICAgICBtb250aHNDb3VudDogICAgICAgb3B0aW9ucy5tb250aHNDb3VudCAgICAgICB8fCAxMixcclxuICAgICAgICAgICAgcGVyUm93OiAgICAgICAgICAgIG9wdGlvbnMucGVyUm93ICAgICAgICAgICAgfHwgdW5kZWZpbmVkLCAgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LzQtdGB0Y/RhtC10LIg0LIg0YDRj9C00YNcclxuICAgICAgICAgICAgbWluRGF0ZTogICAgICAgICAgIG9wdGlvbnMubWluRGF0ZSAgICAgICAgICAgfHwgbmV3IERhdGUoKSwgLy8g0LzQuNC90LjQvNCw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICAgICAgICBtYXhEYXRlOiAgICAgICAgICAgb3B0aW9ucy5tYXhEYXRlICAgICAgICAgICB8fCB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIC8vINGB0L7QsdGL0YLQuNGPXHJcbiAgICAgICAgICAgIG9uOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgICAgIHJhbmdlU2VsZWN0OiBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICAgICAgICAgICAgZGF5U2VsZWN0OiAgIG51bGwsIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQvtC00L3QvtC5INC00LDRgtGLICjRgtC+0LvRjNC60L4g0L/RgNC4IHNpbmdsZU1vZGU6IHRydWUpXHJcbiAgICAgICAgICAgIH0sIG9wdGlvbnMub24gfHwge30pLFxyXG4gICAgICAgICAgICAvLyDRhNC40LvRjNGC0YDRg9GO0YnQuNC1INC80LXRgtC+0LTRi1xyXG4gICAgICAgICAgICBmaWx0ZXI6IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICAgICAgbG9ja0RheXM6ICAgIHRoaXMuX2ZpbHRlckxvY2tEYXlzLCAgICAvLyBjYWxsYmFjayhkYXRlKSDRhNGD0L3QutGG0LjRjyDQsdC70L7QutC40YDQvtCy0LDQvdC40Y8g0LTQsNGCLCB0cnVlL0xPQ0tcclxuICAgICAgICAgICAgICAgIHRvb2x0aXBUZXh0OiB0aGlzLl9maWx0ZXJUb29sdGlwVGV4dCwgLy8gY2FsbGJhY2soZGF5cykg0LLRi9Cy0L7QtCDRgtC10LrRgdGC0LAg0L/QvtC00YHQutCw0LfQutC4XHJcbiAgICAgICAgICAgIH0sIG9wdGlvbnMuZmlsdGVyIHx8IHt9KSxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGA0Y/QtNC90L7RgdGC0YxcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5wZXJSb3cgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBlclJvdyA9IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubWluRGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGC0LXQutGD0YnQuNC5INC00LXQvdGMXHJcbiAgICAgICAgdGhpcy5fdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuX3RvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLl8kcGlja2VyID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX19tb250aHNcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXBcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vINGN0LvQtdC80LXQvdGC0YtcclxuICAgICAgICB0aGlzLl8kbW9udGhzICA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzJyk7XHJcbiAgICAgICAgdGhpcy5fJHRvb2x0aXAgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5EYXRlcmFuZ2VwaWNrZXJfX3Rvb2x0aXAnKTtcclxuXHJcbiAgICAgICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcblxyXG4gICAgICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgICAgIHRoaXMuXyRjcmVhdGVNb250aHModGhpcy5vcHRpb25zLm1pbkRhdGUpO1xyXG4gICAgICAgIHRoaXMuXyRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fJHBpY2tlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQndCw0LfQstCw0L3QuNC1INC80LXRgdGP0YbQsFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXRNb250aEZvcm1hdHRlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge21vbnRoOiAnbG9uZyd9KTtcclxuICAgICAgICByZXR1cm4gdGl0bGUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKSArIHRpdGxlLnNsaWNlKDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90LjQtSDQtNCw0YLRiyDQtNC70Y8g0YLQtdC60YPRidC10Lkg0LvQvtC60LDQu9C4XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMg0J/QsNGA0LDQvNC10YLRgNGLXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQgPSBmdW5jdGlvbihkYXRlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIEludGwuRGF0ZVRpbWVGb3JtYXQodGhpcy5vcHRpb25zLmxvY2FsZSwgb3B0aW9ucykuZm9ybWF0KGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQvdC4INC90LXQtNC10LvQuFxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldFdlZWtEYXlzRm9ybWF0dGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIDIpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgKytpKSB7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBkYXk6IGRhdGUuZ2V0RGF5KCksXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7d2Vla2RheTogJ3Nob3J0J30pLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINGB0L7Qs9C70LDRgdC90L4g0L3QsNGB0YLRgNC+0LXQvdC90L7QvNGDINC/0LXRgNCy0L7QvNGDINC00L3RjiDQvdC10LTQtdC70LhcclxuICAgICAgICByZXN1bHQuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmaXJzdERheU9mVGhlV2VlayA9IHRoaXMub3B0aW9ucy5maXJzdERheU9mVGhlV2VlayAlIDc7XHJcbiAgICAgICAgICAgIGxldCBkYXlBID0gYS5kYXk7XHJcbiAgICAgICAgICAgIGxldCBkYXlCID0gYi5kYXk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF5QSA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF5QiA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkYXlBIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIGRheUEgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRheUIgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICAgICAgZGF5QiArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGF5QSAtIGRheUI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuSDQsiDQvNC10YHRj9GG0LVcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0RGF5c0NvdW50SW5Nb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgZGF5cy5zZXRNb250aChkYXlzLmdldE1vbnRoKCkgKyAxKTtcclxuICAgICAgICBkYXlzLnNldERhdGUoMCk7XHJcbiAgICAgICAgcmV0dXJuIGRheXMuZ2V0RGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC00LjQsNC/0LDQt9C+0L3QsCDQvNC10YHRj9GG0LXQslxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVNb250aHMgPSBmdW5jdGlvbihkYXRlX2Zyb20pIHtcclxuICAgICAgICB3aGlsZSAodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRtb250aHMucmVtb3ZlQ2hpbGQodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC/0YDRj9GH0LXQvCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgICAgICB0aGlzLl90b29sdGlwSGlkZSgpO1xyXG5cclxuICAgICAgICAvLyDQv9GA0LXRgNC10L3QtNC10YAg0LzQtdGB0Y/RhtC10LJcclxuICAgICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGNvbnN0ICRtb250aHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgICRtb250aHMucHVzaCh0aGlzLl8kY3JlYXRlTW9udGgoY3VycmVudERhdGUpKTtcclxuICAgICAgICAgICAgY3VycmVudERhdGUuc2V0TW9udGgoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkbW9udGhzLmxlbmd0aDsgaSArPSB0aGlzLm9wdGlvbnMucGVyUm93KSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnRGF0ZXJhbmdlcGlja2VyX19yb3cnO1xyXG5cclxuICAgICAgICAgICAgJG1vbnRocy5zbGljZShpLCBpICsgdGhpcy5vcHRpb25zLnBlclJvdykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgICAgICAgICAgJHJvdy5hcHBlbmRDaGlsZCgkbW9udGgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuXyRtb250aHMuYXBwZW5kQ2hpbGQoJHJvdyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0aW9uICYmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC80LXRgdGP0YbQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlINCc0LXRgdGP0YZcclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgICAgICBjb25zdCBtb250aFRpdGxlID0gdGhpcy5nZXRNb250aEZvcm1hdHRlZChkYXRlKTtcclxuICAgICAgICBjb25zdCB3ZWVrRGF5cyA9IHRoaXMuZ2V0V2Vla0RheXNGb3JtYXR0ZWQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgJG1vbnRoID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiTW9udGhcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tcHJldiR7KHRoaXMub3B0aW9ucy5taW5EYXRlICYmIGRhdGUgPD0gdGhpcy5vcHRpb25zLm1pbkRhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk03IDEzTDEgN0w3IDFcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX190aXRsZVwiPiR7bW9udGhUaXRsZX0gJHtkYXRlLmdldEZ1bGxZZWFyKCl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLW5leHQkeyh0aGlzLm9wdGlvbnMubWF4RGF0ZSAmJiBkYXRlID49IHRoaXMub3B0aW9ucy5tYXhEYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMSAwLjk5OTk5OUw3IDdMMSAxM1wiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrXCI+JHt3ZWVrRGF5cy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtkYXlcIj4ke2l0ZW0udGl0bGV9PC9kaXY+YFxyXG4gICAgICAgICAgICAgICAgfSkuam9pbignJyl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2RheXNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vINGB0YLRgNC10LvQutC4XHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1wcmV2JywgbmFtZTogJ3ByZXYnfSxcclxuICAgICAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tbmV4dCcsIG5hbWU6ICduZXh0J30sXHJcbiAgICAgICAgXS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkYXJyb3cgPSAkbW9udGgucXVlcnlTZWxlY3RvcihpdGVtLnNlbGVjdG9yKTtcclxuICAgICAgICAgICAgJGFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkFycm93Q2xpY2soJGFycm93LCBpdGVtLm5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g0YDQtdC90LTQtdGAINC00L3QtdC5XHJcbiAgICAgICAgY29uc3QgJGRheXMgPSAkbW9udGgucXVlcnlTZWxlY3RvcignLk1vbnRoX19kYXlzJyk7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBkYXlzLnNldERhdGUoMSk7XHJcbiAgICAgICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGRheXMuZ2V0TW9udGgoKSA9PSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlV2VlaygpO1xyXG5cclxuICAgICAgICAgICAgd2Vla0RheXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXlzLmdldERheSgpICE9IGl0ZW0uZGF5IHx8IGRheXMuZ2V0TW9udGgoKSAhPSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRW1wdHlEYXkoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVEYXkoZGF5cykpO1xyXG4gICAgICAgICAgICAgICAgZGF5cy5zZXREYXRlKGRheXMuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJGRheXMuYXBwZW5kQ2hpbGQoJHdlZWspO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRtb250aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0LvQuNC6INC/0L4g0YHRgtGA0LXQu9C60LUg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPINC80LXRgdGP0YbQsFxyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSAkYXJyb3cgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgICAg0JjQvNGPIChwcmV2LCBuZXh0KVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkFycm93Q2xpY2sgPSBmdW5jdGlvbigkYXJyb3csIG5hbWUpIHtcclxuICAgICAgICBpZiAoJGFycm93LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUocGFyc2VJbnQodGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuTW9udGgnKS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICAgICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyAobmFtZSA9PSAncHJldicgPyAtdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50IDogdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KSk7XHJcblxyXG4gICAgICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNC40L3QuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICAgICAgaWYgKGRhdGUgPCB0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1pbkRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICAgICAgY29uc3QgZW5kRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgZW5kRGF0ZS5zZXRNb250aChlbmREYXRlLmdldE1vbnRoKCkgKyB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpO1xyXG4gICAgICAgICAgICBpZiAoZW5kRGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1heERhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpIC0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50ICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuXyRjcmVhdGVNb250aHMoZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10L3QtNC10YAg0L3QtdC00LXQu9C4XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7RWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZVdlZWsgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJXZWVrXCI+PC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiAkd2VlaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQvdC00LXRgCDQtNC90Y9cclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlRGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGxvY2tlZCA9IHRoaXMuZ2V0RGF5TG9ja2VkKGRhdGUpO1xyXG4gICAgICAgIGNvbnN0IHRvZGF5ICA9IHRoaXMuX3RvZGF5LmdldFRpbWUoKSA9PSBkYXRlLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNsYXNzTmFtZSA9ICcnO1xyXG4gICAgICAgIGNsYXNzTmFtZSArPSBsb2NrZWQgPyAnIGlzLWRpc2FibGVkJyA6ICcnO1xyXG4gICAgICAgIGNsYXNzTmFtZSArPSBsb2NrZWQgPT0gTE9DS19MT0NLRUQgPyAnIGlzLWxvY2tlZCcgOiAnJztcclxuICAgICAgICBjbGFzc05hbWUgKz0gdG9kYXkgPyAnIGlzLXRvZGF5JyA6ICcnO1xyXG5cclxuICAgICAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5JHtjbGFzc05hbWV9XCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIiBkYXRhLWRheT1cIiR7ZGF0ZS5nZXREYXkoKX1cIj4ke2RhdGUuZ2V0RGF0ZSgpfTwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25EYXlDbGlja0V2ZW50LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRkYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtSDQutC70LjQutCwINC/0L4g0LTQvdGOXHJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheUNsaWNrRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdGhpcy5fb25EYXlDbGljayhlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtSDRhdC+0LLQtdGA0LBcclxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHRoaXMuX29uRGF5TW91c2VFbnRlcihlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpdC+0LLQtdGAINC90LAg0Y3Qu9C10LzQtdC90YLQtSDQtNC90Y9cclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlciA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXkuZGF0YXNldC50aW1lID09IHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20uZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0LvQuNC6INC/0L4g0LTQvdGOXHJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheUNsaWNrID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgICAgIC8vINC00LXQvdGMINC30LDQsdC70L7QutC40YDQvtCy0LDQvVxyXG4gICAgICAgIGlmICgkZGF5LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0YtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2soJ2RheVNlbGVjdCcsIG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YHQsdGA0L7RgSDQstGL0LHRgNCw0L3QvdC+0LPQviDRgNCw0L3QtdC1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG5cclxuICAgICAgICAvLyDQstGL0LHRgNCw0L3QsCDQvdCw0YfQsNC70YzQvdCw0Y8gLyDQutC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAgICAgICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAgICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5yYW5nZVNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxSZXNldCgpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQuNC30YPQsNC70YzQvdGL0Lkg0YHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgICAgICAkZGF5cy5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgICAgICAkZGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nLCAnaXMtc2VsZWN0ZWQtdG8nLCAnaXMtc2VsZWN0ZWQtYmV0d2VlbicpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDQv9GA0Y/Rh9C10Lwg0L/QvtC00YHQutCw0LfQutGDXHJcbiAgICAgICAgdGhpcy5fdG9vbHRpcEhpZGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0LjQt9GD0LDQu9GM0L3QvtC1INCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YJcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgIGlmIChkYXRlX2Zyb20gJiYgZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF0ZV90byAmJiBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHRpbWVfZnJvbSA9IGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX2Zyb20uZ2V0VGltZSgpIDogMDtcclxuICAgICAgICBsZXQgdGltZV90byA9IGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV90by5nZXRUaW1lKCkgOiAwO1xyXG4gICAgICAgIGlmICh0aW1lX2Zyb20gPiB0aW1lX3RvKSB7XHJcbiAgICAgICAgICAgIFt0aW1lX2Zyb20sIHRpbWVfdG9dID0gW3RpbWVfdG8sIHRpbWVfZnJvbV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCINC80LXQttC00YMg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0LlcclxuICAgICAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkZGF5cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAkZGF5c1tpXS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zZWxlY3RlZC1iZXR3ZWVuJywgJGRheXNbaV0uZGF0YXNldC50aW1lID4gdGltZV9mcm9tICYmICRkYXlzW2ldLmRhdGFzZXQudGltZSA8IHRpbWVfdG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5INC/0L7Qt9C40YbQuNC4XHJcbiAgICAgICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgICAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgIT0gJGRheV9mcm9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgICAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgIT0gJGRheV90bykge1xyXG4gICAgICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YHQvtGF0YDQsNC90LXQvdC40LUg0LIg0LrQtdGIXHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCA9ICRkYXlfZnJvbTtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCA9ICRkYXlfdG87XHJcblxyXG4gICAgICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRheXMgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRpbWVfZnJvbSAtIHRpbWVfdG8pIC8gODY0MDBlMykgKyAxO1xyXG4gICAgICAgICAgICB0aGlzLl90b29sdGlwU2hvdygkZGF5X3RvLCBkYXlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LrQsNC3INC/0L7QtNGB0LrQsNC30LrQuFxyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSAkZGF5INCS0YvQsdGA0LDQvdC90YvQuSDQtNC10L3RjFxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9ICBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX3Rvb2x0aXBTaG93ID0gZnVuY3Rpb24oJGRheSwgZGF5cykge1xyXG4gICAgICAgIGNvbnN0IHJlY3QgPSAkZGF5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuICAgICAgICB0aGlzLl8kdG9vbHRpcC50ZXh0Q29udGVudCA9IHRoaXMub3B0aW9ucy5maWx0ZXIudG9vbHRpcFRleHQuY2FsbCh0aGlzLCBkYXlzKSB8fCAnJztcclxuICAgICAgICB0aGlzLl8kdG9vbHRpcC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zaG93JywgdGhpcy5fJHRvb2x0aXAudGV4dENvbnRlbnQubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUudG9wID0gTWF0aC5yb3VuZChyZWN0LnRvcCAtIHJlY3QuaGVpZ2h0IC0gdGhpcy5fJHRvb2x0aXAub2Zmc2V0SGVpZ2h0KSArICdweCc7XHJcbiAgICAgICAgdGhpcy5fJHRvb2x0aXAuc3R5bGUubGVmdCA9IE1hdGgucm91bmQocmVjdC5sZWZ0ICsgcmVjdC53aWR0aCAvIDIgLSB0aGlzLl8kdG9vbHRpcC5vZmZzZXRXaWR0aCAvIDIpICsgJ3B4JztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0LrRgNGL0YLRjCDQv9C+0LTRgdC60LDQt9C60YNcclxuICAgICAqL1xyXG4gICAgdGhpcy5fdG9vbHRpcEhpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLl8kdG9vbHRpcC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zaG93Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQotC10LrRgdGCINC/0L7QtNGB0LrQsNC30LrQuCDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBkYXlzINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX2ZpbHRlclRvb2x0aXBUZXh0ID0gZnVuY3Rpb24oZGF5cykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsdXJhbChkYXlzLCBbJyVkINC00LXQvdGMJywgJyVkINC00L3RjycsICclZCDQtNC90LXQuSddKS5yZXBsYWNlKCclZCcsIGRheXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLRi9C00LXQu9C10L3QuNC1INC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICB0aGlzLnJhbmdlU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICAgICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUoZGF0ZV9mcm9tLCBkYXRlX3RvKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICAgICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdChkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG5cclxuICAgICAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1XHJcbiAgICAgICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGB0L7QsdGL0YLQuNC1XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2soJ3JhbmdlU2VsZWN0JywgZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0LLQvtC30LzQvtC20L3QvtGB0YLQuCDQstGL0LTQtdC70LXQvdC40Y8g0LTQsNGCXHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlIGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqIEBwYXJhbSAge0RhdGUgZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhkYXRlX2Zyb20uZ2V0VGltZSgpIC0gZGF0ZV90by5nZXRUaW1lKCkpIC8gMTAwMCAvIDg2NDAwO1xyXG4gICAgICAgIGlmIChkaWZmIDwgdGhpcy5vcHRpb25zLm1pbkRheXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQv9C+0L/QsNC00LDQvdC40Y8g0LIg0LTQuNCw0L/QsNC30L7QvSDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbiAgICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBkYXkuc2V0VGltZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGRheSA8IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0RGF5TG9ja2VkKGRheSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINC90LAg0LTQvtGB0YLRg9C/0L3QvtGB0YLRjCDQtNC90Y8g0LTQu9GPINCx0YDQvtC90LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59ICAgdHJ1ZSDQtdGB0LvQuCDQtNC+0YHRgtGD0L/QtdC9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0RGF5TG9ja2VkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCy0L3QtSDQtNC+0YHRgtGD0L/QvdC+0LPQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlIHx8IGRhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gTE9DS19VTkFWQUlMQUJMRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmlsdGVyLmxvY2tEYXlzLmNhbGwodGhpcywgZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpNC40LvRjNGC0YAg0L3QtdC00L7RgdGC0YPQv9C90YvRhSDQtNC90LXQuSDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fZmlsdGVyTG9ja0RheXMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDQstGB0LUg0LTQvdC4INC00L7RgdGC0YPQv9C90YtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC60LvQvtC90LXQvdC40LUgKDEg0LHQvtCx0ZHRgCwgMiDQsdC+0LHRgNCwLCA1INCx0L7QsdGA0L7QsilcclxuICAgICAqIEBwYXJhbSAge051bWJlcn0gdmFsdWUg0JrQvtC70LjRh9C10YHRgtCy0L5cclxuICAgICAqIEBwYXJhbSAge0FycmF5fSAgZm9ybXMg0JzQsNGB0YHQuNCyINC40LcgM9GFINGN0LvQtdC80LXQvdGC0L7Qsiwg0LzQvtC20LXRgiDRgdC+0LTQtdGA0LbQsNGC0Ywg0YHQv9C10YbQuNGE0LjQutCw0YLQvtGAICVkINC00LvRjyDQt9Cw0LzQtdC90YtcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAqL1xyXG4gICAgdGhpcy5wbHVyYWwgPSBmdW5jdGlvbiAodmFsdWUsIGZvcm1zKSB7XHJcbiAgICAgICAgcmV0dXJuICh2YWx1ZSAlIDEwID09IDEgJiYgdmFsdWUgJSAxMDAgIT0gMTEgPyBmb3Jtc1swXSA6ICh2YWx1ZSAlIDEwID49IDIgJiYgdmFsdWUgJSAxMCA8PSA0ICYmICh2YWx1ZSAlIDEwMCA8IDEwIHx8IHZhbHVlICUgMTAwID49IDIwKSA/IGZvcm1zWzFdIDogZm9ybXNbMl0pKS5yZXBsYWNlKCclZCcsIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCt0LvQtdC80LXQvdGCINC60LDQu9C10L3QtNCw0YDQvdC+0LPQviDQtNC90Y9cclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9ICAgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kZ2V0RGF5QnlEYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHRpbWUgPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogMDtcclxuICAgICAgICByZXR1cm4gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuRGF5W2RhdGEtdGltZT1cIicgKyB0aW1lICsgJ1wiXScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC00L3RjyAtINC30LDQs9C70YPRiNC60LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlRW1wdHlEYXkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5IGlzLWVtcHR5XCI+PC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiAkZGF5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwINC40LcgSFRNTCDRgtC10LrRgdGC0LBcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaHRtbCBIVE1MINGC0LXQutGB0YJcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24oaHRtbCkge1xyXG4gICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdi5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgICAgICByZXR1cm4gZGl2LmNoaWxkcmVuLmxlbmd0aCA+IDEgPyBkaXYuY2hpbGRyZW4gOiBkaXYuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTYWZlINCy0YvQt9C+0LIg0LLQvdC10YjQvdC40YUg0YHQvtCx0YvRgtC40Lkg0LrQvtC80L/QvtC90LXQvdGC0LBcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmINCY0LzRjyDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICovXHJcbiAgICB0aGlzLl9jYWxsYmFjayA9IGZ1bmN0aW9uKGYpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbltmXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub25bZl0uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXQoKTtcclxufVxyXG5cclxuLyogaGFybW9ueSBkZWZhdWx0IGV4cG9ydCAqLyBjb25zdCBfX1dFQlBBQ0tfREVGQVVMVF9FWFBPUlRfXyA9IChEYXRlUmFuZ2VQaWNrZXIpO1xyXG5cbn0pKCk7XG5cbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19leHBvcnRzX187XG4vKioqKioqLyB9KSgpXG47XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdmQyVmljR0ZqYXk5MWJtbDJaWEp6WVd4TmIyUjFiR1ZFWldacGJtbDBhVzl1SWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k5M1pXSndZV05yTDJKdmIzUnpkSEpoY0NJc0luZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdmQyVmljR0ZqYXk5eWRXNTBhVzFsTDJSbFptbHVaU0J3Y205d1pYSjBlU0JuWlhSMFpYSnpJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTkzWldKd1lXTnJMM0oxYm5ScGJXVXZhR0Z6VDNkdVVISnZjR1Z5ZEhrZ2MyaHZjblJvWVc1a0lpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOTNaV0p3WVdOckwzSjFiblJwYldVdmJXRnJaU0J1WVcxbGMzQmhZMlVnYjJKcVpXTjBJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTh1TDNOeVl5OXpZM056TDJsdVpHVjRMbk5qYzNNaUxDSjNaV0p3WVdOck9pOHZaR0YwWlhKaGJtZGxjR2xqYTJWeUx5NHZjM0pqTDJwekwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRU5CUVVNN1FVRkRSQ3hQT3p0VlExWkJPMVZCUTBFN096czdPMWREUkVFN1YwRkRRVHRYUVVOQk8xZEJRMEU3VjBGRFFTeDNRMEZCZDBNc2VVTkJRWGxETzFkQlEycEdPMWRCUTBFN1YwRkRRU3hGT3pzN096dFhRMUJCTEhkR096czdPenRYUTBGQk8xZEJRMEU3VjBGRFFUdFhRVU5CTEhORVFVRnpSQ3hyUWtGQmEwSTdWMEZEZUVVN1YwRkRRU3dyUTBGQkswTXNZMEZCWXp0WFFVTTNSQ3hGT3pzN096czdPenM3T3pzN1FVTk9RVHM3T3pzN096czdPenM3T3pzN08wRkRRVUU3UVVGRFR6dEJRVU5CT3p0QlFVVlFMR2xFUVVGcFJEdEJRVU5xUkR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1lVRkJZU3hyUWtGQmEwSTdRVUZETDBJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeGhRVUZoTEhOQ1FVRnpRanRCUVVOdVF6czdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWjBKQlFXZENMRXRCUVVzN1FVRkRja0lzWjBKQlFXZENPMEZCUTJoQ08wRkJRMEU3UVVGRFFTeHZSRUZCYjBRc1kwRkJZenRCUVVOc1JUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3huUWtGQlowSXNTMEZCU3p0QlFVTnlRaXhuUWtGQlowSXNUMEZCVHp0QlFVTjJRaXhuUWtGQlowSTdRVUZEYUVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRXNkVUpCUVhWQ0xFOUJRVTg3UVVGRE9VSTdRVUZEUVR0QlFVTkJPMEZCUTBFc2NVUkJRWEZFTEdsQ1FVRnBRanRCUVVOMFJTeGhRVUZoTzBGQlEySTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRU3hUUVVGVE96dEJRVVZVTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxHZENRVUZuUWl4TFFVRkxPMEZCUTNKQ0xHZENRVUZuUWl4UFFVRlBPMEZCUTNaQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdWQlFXVXNTMEZCU3p0QlFVTndRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRXNkVUpCUVhWQ0xEaENRVUU0UWp0QlFVTnlSRHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVN4MVFrRkJkVUlzYjBKQlFXOUNPMEZCUXpORE8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMR0ZCUVdFN08wRkJSV0k3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNaVUZCWlN4TFFVRkxPMEZCUTNCQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRU3cyUTBGQk5rTXNaVUZCWlR0QlFVTTFSRHRCUVVOQkxHbEZRVUZwUlN3MlJVRkJOa1U3UVVGRE9VazdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3huUkVGQlowUXNWMEZCVnl4SFFVRkhMRzFDUVVGdFFqdEJRVU5xUml4cFJVRkJhVVVzTmtWQlFUWkZPMEZCUXpsSk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN3eVEwRkJNa003UVVGRE0wTXNNRVJCUVRCRUxGZEJRVmM3UVVGRGNrVXNhVUpCUVdsQ0xGZEJRVmM3UVVGRE5VSTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeGhRVUZoTERoRFFVRTRRenRCUVVNelJDeGhRVUZoTERoRFFVRTRRenRCUVVNelJEdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMR0ZCUVdFN1FVRkRZaXhUUVVGVE96dEJRVVZVTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4aFFVRmhPenRCUVVWaU8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWlVGQlpTeFJRVUZSTzBGQlEzWkNMR1ZCUVdVc1QwRkJUenRCUVVOMFFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxHZENRVUZuUWl4TFFVRkxPMEZCUTNKQ0xHZENRVUZuUWp0QlFVTm9RanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdkQ1FVRm5RaXhMUVVGTE8wRkJRM0pDTEdkQ1FVRm5RanRCUVVOb1FqdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJMRGhDUVVFNFFpeFZRVUZWTEdWQlFXVXNaVUZCWlN4alFVRmpMR05CUVdNc1NVRkJTU3hsUVVGbE8wRkJRM0pJT3p0QlFVVkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeGxRVUZsTEUxQlFVMDdRVUZEY2tJN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMR1ZCUVdVc1RVRkJUVHRCUVVOeVFqdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWlVGQlpTeFJRVUZSTzBGQlEzWkNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1pVRkJaU3hSUVVGUk8wRkJRM1pDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4VFFVRlRPMEZCUTFRN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNVMEZCVXpzN1FVRkZWRHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMR1ZCUVdVc1MwRkJTenRCUVVOd1FpeGxRVUZsTEV0QlFVczdRVUZEY0VJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzZFVKQlFYVkNMR3RDUVVGclFqdEJRVU42UXp0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4bFFVRmxMRkZCUVZFN1FVRkRka0lzWlVGQlpTeFBRVUZQTzBGQlEzUkNPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdkQ1FVRm5RaXhQUVVGUE8wRkJRM1pDTEdkQ1FVRm5RanRCUVVOb1FqdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWlVGQlpTeExRVUZMTzBGQlEzQkNMR1ZCUVdVc1MwRkJTenRCUVVOd1FqdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxHZENRVUZuUWp0QlFVTm9RaXhuUWtGQlowSTdRVUZEYUVJc1owSkJRV2RDTzBGQlEyaENPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxHZENRVUZuUWl4TFFVRkxPMEZCUTNKQ0xHZENRVUZuUWl4UlFVRlJPMEZCUTNoQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4blFrRkJaMEk3UVVGRGFFSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNaMEpCUVdkQ0xFOUJRVTg3UVVGRGRrSXNaMEpCUVdkQ0xFMUJRVTA3UVVGRGRFSXNaMEpCUVdkQ08wRkJRMmhDTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeG5Ra0ZCWjBJc1MwRkJTenRCUVVOeVFpeG5Ra0ZCWjBJc1VVRkJVVHRCUVVONFFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeG5Ra0ZCWjBJc1MwRkJTenRCUVVOeVFpeG5Ra0ZCWjBJN1FVRkRhRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4blFrRkJaMElzVDBGQlR6dEJRVU4yUWl4blFrRkJaMEk3UVVGRGFFSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4bFFVRmxMRTlCUVU4N1FVRkRkRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFc2FVVkJRV1VzWlVGQlpTeEZRVUZESWl3aVptbHNaU0k2SW1SaGRHVnlZVzVuWlhCcFkydGxjaTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpaG1kVzVqZEdsdmJpQjNaV0p3WVdOclZXNXBkbVZ5YzJGc1RXOWtkV3hsUkdWbWFXNXBkR2x2YmloeWIyOTBMQ0JtWVdOMGIzSjVLU0I3WEc1Y2RHbG1LSFI1Y0dWdlppQmxlSEJ2Y25SeklEMDlQU0FuYjJKcVpXTjBKeUFtSmlCMGVYQmxiMllnYlc5a2RXeGxJRDA5UFNBbmIySnFaV04wSnlsY2JseDBYSFJ0YjJSMWJHVXVaWGh3YjNKMGN5QTlJR1poWTNSdmNua29LVHRjYmx4MFpXeHpaU0JwWmloMGVYQmxiMllnWkdWbWFXNWxJRDA5UFNBblpuVnVZM1JwYjI0bklDWW1JR1JsWm1sdVpTNWhiV1FwWEc1Y2RGeDBaR1ZtYVc1bEtGd2lSR0YwWlhKaGJtZGxjR2xqYTJWeVhDSXNJRnRkTENCbVlXTjBiM0o1S1R0Y2JseDBaV3h6WlNCcFppaDBlWEJsYjJZZ1pYaHdiM0owY3lBOVBUMGdKMjlpYW1WamRDY3BYRzVjZEZ4MFpYaHdiM0owYzF0Y0lrUmhkR1Z5WVc1blpYQnBZMnRsY2x3aVhTQTlJR1poWTNSdmNua29LVHRjYmx4MFpXeHpaVnh1WEhSY2RISnZiM1JiWENKRVlYUmxjbUZ1WjJWd2FXTnJaWEpjSWwwZ1BTQm1ZV04wYjNKNUtDazdYRzU5S1NoelpXeG1MQ0JtZFc1amRHbHZiaWdwSUh0Y2JuSmxkSFZ5YmlBaUxDSXZMeUJVYUdVZ2NtVnhkV2x5WlNCelkyOXdaVnh1ZG1GeUlGOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOGdQU0I3ZlR0Y2JseHVJaXdpTHk4Z1pHVm1hVzVsSUdkbGRIUmxjaUJtZFc1amRHbHZibk1nWm05eUlHaGhjbTF2Ym5rZ1pYaHdiM0owYzF4dVgxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NWtJRDBnS0dWNGNHOXlkSE1zSUdSbFptbHVhWFJwYjI0cElEMCtJSHRjYmx4MFptOXlLSFpoY2lCclpYa2dhVzRnWkdWbWFXNXBkR2x2YmlrZ2UxeHVYSFJjZEdsbUtGOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHVieWhrWldacGJtbDBhVzl1TENCclpYa3BJQ1ltSUNGZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxtOG9aWGh3YjNKMGN5d2dhMlY1S1NrZ2UxeHVYSFJjZEZ4MFQySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLR1Y0Y0c5eWRITXNJR3RsZVN3Z2V5QmxiblZ0WlhKaFlteGxPaUIwY25WbExDQm5aWFE2SUdSbFptbHVhWFJwYjI1YmEyVjVYU0I5S1R0Y2JseDBYSFI5WEc1Y2RIMWNibjA3SWl3aVgxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NXZJRDBnS0c5aWFpd2djSEp2Y0NrZ1BUNGdLRTlpYW1WamRDNXdjbTkwYjNSNWNHVXVhR0Z6VDNkdVVISnZjR1Z5ZEhrdVkyRnNiQ2h2WW1vc0lIQnliM0FwS1NJc0lpOHZJR1JsWm1sdVpTQmZYMlZ6VFc5a2RXeGxJRzl1SUdWNGNHOXlkSE5jYmw5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dWNpQTlJQ2hsZUhCdmNuUnpLU0E5UGlCN1hHNWNkR2xtS0hSNWNHVnZaaUJUZVcxaWIyd2dJVDA5SUNkMWJtUmxabWx1WldRbklDWW1JRk41YldKdmJDNTBiMU4wY21sdVoxUmhaeWtnZTF4dVhIUmNkRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNobGVIQnZjblJ6TENCVGVXMWliMnd1ZEc5VGRISnBibWRVWVdjc0lIc2dkbUZzZFdVNklDZE5iMlIxYkdVbklIMHBPMXh1WEhSOVhHNWNkRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNobGVIQnZjblJ6TENBblgxOWxjMDF2WkhWc1pTY3NJSHNnZG1Gc2RXVTZJSFJ5ZFdVZ2ZTazdYRzU5T3lJc0lpOHZJR1Y0ZEhKaFkzUmxaQ0JpZVNCdGFXNXBMV056Y3kxbGVIUnlZV04wTFhCc2RXZHBibHh1Wlhod2IzSjBJSHQ5T3lJc0lpOHZJTkdCMEw3UmdkR0MwTDdSajlDOTBMalJqeURRdDlDdzBMSFF1OUMrMExyUXVOR0EwTDdRc3RDdzBMM1F2ZEdMMFlVZzBMVFFzTkdDWEhKY2JtVjRjRzl5ZENCamIyNXpkQ0JNVDBOTFgxVk9RVlpCU1V4QlFreEZJRDBnTVR0Y2NseHVaWGh3YjNKMElHTnZibk4wSUV4UFEwdGZURTlEUzBWRUlDQWdJQ0FnUFNBeU8xeHlYRzVjY2x4dVpuVnVZM1JwYjI0Z1JHRjBaVkpoYm1kbFVHbGphMlZ5S0NSamIyNTBZV2x1WlhJc0lHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRFFtTkM5MExqUmh0QzQwTERRdTlDNDBMZlFzTkdHMExqUmoxeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TG1sdWFYUWdQU0JtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw4a1kyOXVkR0ZwYm1WeUlEMGdKR052Ym5SaGFXNWxjanRjY2x4dVhISmNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6SUQwZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCbWFYSnpkRVJoZVU5bVZHaGxWMlZsYXpvZ2IzQjBhVzl1Y3k1bWFYSnpkRVJoZVU5bVZHaGxWMlZsYXlCOGZDQXhMQ0FnSUNBZ0lDQWdJQ0F2THlEUXY5QzEwWURRc3RHTDBMa2cwTFRRdGRDOTBZd2cwTDNRdGRDMDBMWFF1OUM0TENBd0lEMGcwTExSZ1N3Z01TQTlJTkMvMEwwc0lDNHVMbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnphVzVuYkdWTmIyUmxPaUFnSUNBZ0lDQWdiM0IwYVc5dWN5NXphVzVuYkdWTmIyUmxJQ0FnSUNBZ0lDQjhmQ0JtWVd4elpTd2dJQ0FnSUNBdkx5RFFzdEdMMExIUXZ0R0FJTkMrMExUUXZkQyswTGtnMExUUXNOR0MwWXNnMExMUXZOQzEwWUhSZ3RDK0lOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXNGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCc2IyTmhiR1U2SUNBZ0lDQWdJQ0FnSUNBZ2IzQjBhVzl1Y3k1c2IyTmhiR1VnSUNBZ0lDQWdJQ0FnSUNCOGZDQW5jblV0VWxVbkxGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCdGFXNUVZWGx6T2lBZ0lDQWdJQ0FnSUNBZ2IzQjBhVzl1Y3k1dGFXNUVZWGx6SUNBZ0lDQWdJQ0FnSUNCOGZDQXhMQ0FnSUNBZ0lDQWdJQ0F2THlEUXZOQzQwTDNRdU5DODBMRFF1OUdNMEwzUXZ0QzFJTkM2MEw3UXU5QzQwWWZRdGRHQjBZTFFzdEMrSU5DMDBMM1F0ZEM1SU5DeUlOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXRWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCdGIyNTBhSE5EYjNWdWREb2dJQ0FnSUNBZ2IzQjBhVzl1Y3k1dGIyNTBhSE5EYjNWdWRDQWdJQ0FnSUNCOGZDQXhNaXhjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjR1Z5VW05M09pQWdJQ0FnSUNBZ0lDQWdJRzl3ZEdsdmJuTXVjR1Z5VW05M0lDQWdJQ0FnSUNBZ0lDQWdmSHdnZFc1a1pXWnBibVZrTENBZ0x5OGcwTHJRdnRDNzBMalJoOUMxMFlIUmd0Q3kwTDRnMEx6UXRkR0IwWS9SaHRDMTBMSWcwTElnMFlEUmo5QzAwWU5jY2x4dUlDQWdJQ0FnSUNBZ0lDQWdiV2x1UkdGMFpUb2dJQ0FnSUNBZ0lDQWdJRzl3ZEdsdmJuTXViV2x1UkdGMFpTQWdJQ0FnSUNBZ0lDQWdmSHdnYm1WM0lFUmhkR1VvS1N3Z0x5OGcwTHpRdU5DOTBMalF2TkN3MEx2UmpOQzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J0WVhoRVlYUmxPaUFnSUNBZ0lDQWdJQ0FnYjNCMGFXOXVjeTV0WVhoRVlYUmxJQ0FnSUNBZ0lDQWdJQ0I4ZkNCMWJtUmxabWx1WldRc1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUM4dklOR0IwTDdRc2RHTDBZTFF1TkdQWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRzl1T2lCUFltcGxZM1F1WVhOemFXZHVLSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKaGJtZGxVMlZzWldOME9pQnVkV3hzTENBdkx5RFJnZEMrMExIUmk5R0MwTGpRdFNEUXN0R0wwTEhRdnRHQTBMQWcwTFRRdU5DdzBML1FzTkMzMEw3UXZkQ3dJTkMwMExEUmdseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdaR0Y1VTJWc1pXTjBPaUFnSUc1MWJHd3NJQzh2SU5HQjBMN1FzZEdMMFlMUXVOQzFJTkN5MFl2UXNkQyswWURRc0NEUXZ0QzAwTDNRdnRDNUlOQzAwTERSZ3RHTElDalJndEMrMEx2UmpOQzYwTDRnMEwvUmdOQzRJSE5wYm1kc1pVMXZaR1U2SUhSeWRXVXBYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHNJRzl3ZEdsdmJuTXViMjRnZkh3Z2UzMHBMRnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQXZMeURSaE5DNDBMdlJqTkdDMFlEUmc5R08wWW5RdU5DMUlOQzgwTFhSZ3RDKzBMVFJpMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQm1hV3gwWlhJNklFOWlhbVZqZEM1aGMzTnBaMjRvZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2JHOWphMFJoZVhNNklDQWdJSFJvYVhNdVgyWnBiSFJsY2t4dlkydEVZWGx6TENBZ0lDQXZMeUJqWVd4c1ltRmpheWhrWVhSbEtTRFJoTkdEMEwzUXV0R0cwTGpSanlEUXNkQzcwTDdRdXRDNDBZRFF2dEN5MExEUXZkQzQwWThnMExUUXNOR0NMQ0IwY25WbEwweFBRMHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhSdmIyeDBhWEJVWlhoME9pQjBhR2x6TGw5bWFXeDBaWEpVYjI5c2RHbHdWR1Y0ZEN3Z0x5OGdZMkZzYkdKaFkyc29aR0Y1Y3lrZzBMTFJpOUN5MEw3UXRDRFJndEMxMExyUmdkR0MwTEFnMEwvUXZ0QzAwWUhRdXRDdzBMZlF1dEM0WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDBzSUc5d2RHbHZibk11Wm1sc2RHVnlJSHg4SUh0OUtTeGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5HQTBZL1F0TkM5MEw3UmdkR0MwWXhjY2x4dUlDQWdJQ0FnSUNCcFppQW9kSGx3Wlc5bUlIUm9hWE11YjNCMGFXOXVjeTV3WlhKU2IzY2dQVDBnSjNWdVpHVm1hVzVsWkNjcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTV2Y0hScGIyNXpMbkJsY2xKdmR5QTlJSFJvYVhNdWIzQjBhVzl1Y3k1dGIyNTBhSE5EYjNWdWREdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXViV2x1UkdGMFpTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG05d2RHbHZibk11YldsdVJHRjBaUzV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDOHZJTkdDMExYUXV0R0QwWW5RdU5DNUlOQzAwTFhRdmRHTVhISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmRHOWtZWGtnUFNCdVpYY2dSR0YwWlNncE8xeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzUnZaR0Y1TG5ObGRFaHZkWEp6S0RBc0lEQXNJREFzSURBcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDhrY0dsamEyVnlJRDBnZEdocGN5NWZKR055WldGMFpVVnNaVzFsYm5Rb1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdBOFpHbDJJR05zWVhOelBWd2lSR0YwWlhKaGJtZGxjR2xqYTJWeVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aVJHRjBaWEpoYm1kbGNHbGphMlZ5WDE5dGIyNTBhSE5jSWo0OEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSkVZWFJsY21GdVoyVndhV05yWlhKZlgzUnZiMngwYVhCY0lqNDhMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStZRnh5WEc0Z0lDQWdJQ0FnSUNrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOR04wTHZRdGRDODBMWFF2ZEdDMFl0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw4a2JXOXVkR2h6SUNBOUlIUm9hWE11WHlSd2FXTnJaWEl1Y1hWbGNubFRaV3hsWTNSdmNpZ25Ma1JoZEdWeVlXNW5aWEJwWTJ0bGNsOWZiVzl1ZEdoekp5azdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZKSFJ2YjJ4MGFYQWdQU0IwYUdsekxsOGtjR2xqYTJWeUxuRjFaWEo1VTJWc1pXTjBiM0lvSnk1RVlYUmxjbUZ1WjJWd2FXTnJaWEpmWDNSdmIyeDBhWEFuS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnTHk4ZzBMalF2ZEM0MFliUXVOQ3cwTHZRdU5DMzBMRFJodEM0MFk4ZzBZSFF2dEdCMFlMUXZ0R1AwTDNRdU5DNVhISmNiaUFnSUNBZ0lDQWdkR2hwY3k1eVlXNW5aVkpsYzJWMEtDazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDOHZJTkdBMExYUXZkQzAwTFhSZ0Z4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WHlSamNtVmhkR1ZOYjI1MGFITW9kR2hwY3k1dmNIUnBiMjV6TG0xcGJrUmhkR1VwTzF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WHlSamIyNTBZV2x1WlhJdVlYQndaVzVrUTJocGJHUW9kR2hwY3k1ZkpIQnBZMnRsY2lrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUW5kQ3cwTGZRc3RDdzBMM1F1TkMxSU5DODBMWFJnZEdQMFliUXNGeHlYRzRnSUNBZ0lDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ0FnSUNBcUlFQnlaWFIxY200Z2UxTjBjbWx1WjMxY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVuWlhSTmIyNTBhRVp2Y20xaGRIUmxaQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0IwYVhSc1pTQTlJSFJvYVhNdVoyVjBSR0YwWlZScGJXVkdiM0p0WVhRb1pHRjBaU3dnZTIxdmJuUm9PaUFuYkc5dVp5ZDlLVHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdsMGJHVXVjMnhwWTJVb01Dd2dNU2t1ZEc5VmNIQmxja05oYzJVb0tTQXJJSFJwZEd4bExuTnNhV05sS0RFcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBLVFF2dEdBMEx6UXNOR0MwTGpSZ05DKzBMTFFzTkM5MExqUXRTRFF0TkN3MFlMUml5RFF0TkM3MFk4ZzBZTFF0ZEM2MFlQUmlkQzEwTGtnMEx2UXZ0QzYwTERRdTlDNFhISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ0lIdEVZWFJsZlNBZ0lHUmhkR1VnSUNBZzBKN1FzZEdLMExYUXV0R0NJTkMwMExEUmd0R0xYSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdJSHRQWW1wbFkzUjlJRzl3ZEdsdmJuTWcwSi9Rc05HQTBMRFF2TkMxMFlMUmdOR0xYSEpjYmlBZ0lDQWdLaUJBY21WMGRYSnVJSHRUZEhKcGJtZDlYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVoyVjBSR0YwWlZScGJXVkdiM0p0WVhRZ1BTQm1kVzVqZEdsdmJpaGtZWFJsTENCdmNIUnBiMjV6S1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlFbHVkR3d1UkdGMFpWUnBiV1ZHYjNKdFlYUW9kR2hwY3k1dmNIUnBiMjV6TG14dlkyRnNaU3dnYjNCMGFXOXVjeWt1Wm05eWJXRjBLR1JoZEdVcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBKVFF2ZEM0SU5DOTBMWFF0TkMxMEx2UXVGeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TG1kbGRGZGxaV3RFWVhselJtOXliV0YwZEdWa0lEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWkdGMFpTQTlJRzVsZHlCRVlYUmxLQ2s3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnY21WemRXeDBJRDBnVzEwN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUdSaGRHVXVjMlYwUkdGMFpTaGtZWFJsTG1kbGRFUmhkR1VvS1NBdElESXBPMXh5WEc0Z0lDQWdJQ0FnSUdadmNpQW9iR1YwSUdrZ1BTQXdPeUJwSUR3Z056c2dLeXRwS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGRHVXVjMlYwUkdGMFpTaGtZWFJsTG1kbGRFUmhkR1VvS1NBcklERXBPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWE4xYkhRdWNIVnphQ2g3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCa1lYazZJR1JoZEdVdVoyVjBSR0Y1S0Nrc1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhWFJzWlRvZ2RHaHBjeTVuWlhSRVlYUmxWR2x0WlVadmNtMWhkQ2hrWVhSbExDQjdkMlZsYTJSaGVUb2dKM05vYjNKMEozMHBMRnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOR0IwTDdSZ05HQzBMalJnTkMrMExMUXV0Q3dJTkdCMEw3UXM5QzcwTERSZ2RDOTBMNGcwTDNRc05HQjBZTFJnTkMrMExYUXZkQzkwTDdRdk5HRElOQy8wTFhSZ05DeTBMN1F2TkdESU5DMDBMM1JqaURRdmRDMTBMVFF0ZEM3MExoY2NseHVJQ0FnSUNBZ0lDQnlaWE4xYkhRdWMyOXlkQ2dvWVN3Z1lpa2dQVDRnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JqYjI1emRDQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5QTlJSFJvYVhNdWIzQjBhVzl1Y3k1bWFYSnpkRVJoZVU5bVZHaGxWMlZsYXlBbElEYzdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHeGxkQ0JrWVhsQklEMGdZUzVrWVhrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUd4bGRDQmtZWGxDSUQwZ1lpNWtZWGs3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9aR0Y1UVNBOVBTQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQzB4TzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9aR0Y1UWlBOVBTQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJREU3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaGtZWGxCSUR3Z1ptbHljM1JFWVhsUFpsUm9aVmRsWldzcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR1JoZVVFZ0t6MGdjbVZ6ZFd4MExteGxibWQwYUR0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR1JoZVVJZ1BDQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWkdGNVFpQXJQU0J5WlhOMWJIUXViR1Z1WjNSb08xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1pHRjVRU0F0SUdSaGVVSTdYSEpjYmlBZ0lDQWdJQ0FnZlNrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUTdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRFFtdEMrMEx2UXVOR0gwTFhSZ2RHQzBMTFF2aURRdE5DOTBMWFF1U0RRc2lEUXZOQzEwWUhSajlHRzBMVmNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQWdlMFJoZEdWOUlHUmhkR1VnMEo3UXNkR0swTFhRdXRHQ0lOQzAwTERSZ3RHTFhISmNiaUFnSUNBZ0tpQkFjbVYwZFhKdUlIdE9kVzFpWlhKOUlDQWdJTkNhMEw3UXU5QzQwWWZRdGRHQjBZTFFzdEMrSU5DMDBMM1F0ZEM1WEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUhSb2FYTXVaMlYwUkdGNWMwTnZkVzUwU1c1TmIyNTBhQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0JrWVhseklEMGdibVYzSUVSaGRHVW9aR0YwWlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ0lDQWdJR1JoZVhNdWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmlBZ0lDQWdJQ0FnWkdGNWN5NXpaWFJOYjI1MGFDaGtZWGx6TG1kbGRFMXZiblJvS0NrZ0t5QXhLVHRjY2x4dUlDQWdJQ0FnSUNCa1lYbHpMbk5sZEVSaGRHVW9NQ2s3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdSaGVYTXVaMlYwUkdGMFpTZ3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwS0RRdGRDOTBMVFF0ZEdBSU5DMDBMalFzTkMvMExEUXQ5QyswTDNRc0NEUXZOQzEwWUhSajlHRzBMWFFzbHh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRFWVhSbGZTQmtZWFJsWDJaeWIyMGcwSjNRc05HSDBMRFF1OUdNMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVh5UmpjbVZoZEdWTmIyNTBhSE1nUFNCbWRXNWpkR2x2Ymloa1lYUmxYMlp5YjIwcElIdGNjbHh1SUNBZ0lDQWdJQ0IzYUdsc1pTQW9kR2hwY3k1ZkpHMXZiblJvY3k1c1lYTjBSV3hsYldWdWRFTm9hV3hrS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVYeVJ0YjI1MGFITXVjbVZ0YjNabFEyaHBiR1FvZEdocGN5NWZKRzF2Ym5Sb2N5NXNZWE4wUld4bGJXVnVkRU5vYVd4a0tUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5DLzBZRFJqOUdIMExYUXZDRFF2OUMrMExUUmdkQzYwTERRdDlDNjBZTmNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOTBiMjlzZEdsd1NHbGtaU2dwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0F2THlEUXY5R0EwTFhSZ05DMTBMM1F0TkMxMFlBZzBMelF0ZEdCMFkvUmh0QzEwTEpjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0JqZFhKeVpXNTBSR0YwWlNBOUlHNWxkeUJFWVhSbEtHUmhkR1ZmWm5KdmJTNW5aWFJVYVcxbEtDa3BPMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJQ1J0YjI1MGFITWdQU0JiWFR0Y2NseHVJQ0FnSUNBZ0lDQm1iM0lnS0d4bGRDQnBJRDBnTURzZ2FTQThJSFJvYVhNdWIzQjBhVzl1Y3k1dGIyNTBhSE5EYjNWdWREc2dLeXRwS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNSdGIyNTBhSE11Y0hWemFDaDBhR2x6TGw4a1kzSmxZWFJsVFc5dWRHZ29ZM1Z5Y21WdWRFUmhkR1VwS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWTNWeWNtVnVkRVJoZEdVdWMyVjBUVzl1ZEdnb1kzVnljbVZ1ZEVSaGRHVXVaMlYwVFc5dWRHZ29LU0FySURFcE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdMeThnMFlEUXRkQzkwTFRRdGRHQVhISmNiaUFnSUNBZ0lDQWdabTl5SUNoc1pYUWdhU0E5SURBN0lHa2dQQ0FrYlc5dWRHaHpMbXhsYm1kMGFEc2dhU0FyUFNCMGFHbHpMbTl3ZEdsdmJuTXVjR1Z5VW05M0tTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHTnZibk4wSUNSeWIzY2dQU0JrYjJOMWJXVnVkQzVqY21WaGRHVkZiR1Z0Wlc1MEtDZGthWFluS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSkhKdmR5NWpiR0Z6YzA1aGJXVWdQU0FuUkdGMFpYSmhibWRsY0dsamEyVnlYMTl5YjNjbk8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdKRzF2Ym5Sb2N5NXpiR2xqWlNocExDQnBJQ3NnZEdocGN5NXZjSFJwYjI1ekxuQmxjbEp2ZHlrdVptOXlSV0ZqYUNna2JXOXVkR2dnUFQ0Z2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdKSEp2ZHk1aGNIQmxibVJEYUdsc1pDZ2tiVzl1ZEdncE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCOUtUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVh5UnRiMjUwYUhNdVlYQndaVzVrUTJocGJHUW9KSEp2ZHlrN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NWZjMlZzWldOMGFXOXVJQ1ltSUNoMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0SUh4OElIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYM1J2S1NrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQ2gwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRMQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5azdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHFLbHh5WEc0Z0lDQWdJQ29nMEtEUXRkQzkwTFRRdGRHQUlOQzgwTFhSZ2RHUDBZYlFzRnh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRFWVhSbGZTQmtZWFJsSU5DYzBMWFJnZEdQMFlaY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVmSkdOeVpXRjBaVTF2Ym5Sb0lEMGdablZ1WTNScGIyNG9aR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElHTjFjbkpsYm5STmIyNTBhQ0E5SUdSaGRHVXVaMlYwVFc5dWRHZ29LVHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0J0YjI1MGFGUnBkR3hsSUQwZ2RHaHBjeTVuWlhSTmIyNTBhRVp2Y20xaGRIUmxaQ2hrWVhSbEtUdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQjNaV1ZyUkdGNWN5QTlJSFJvYVhNdVoyVjBWMlZsYTBSaGVYTkdiM0p0WVhSMFpXUW9LVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ0pHMXZiblJvSUQwZ2RHaHBjeTVmSkdOeVpXRjBaVVZzWlcxbGJuUW9YSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHQThaR2wySUdOc1lYTnpQVndpVFc5dWRHaGNJaUJrWVhSaExYUnBiV1U5WENJa2UyUmhkR1V1WjJWMFZHbHRaU2dwZlZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjejFjSWsxdmJuUm9YMTlvWldGa1pYSmNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpVFc5dWRHaGZYMkZ5Y205M0lFMXZiblJvWDE5aGNuSnZkeTB0Y0hKbGRpUjdLSFJvYVhNdWIzQjBhVzl1Y3k1dGFXNUVZWFJsSUNZbUlHUmhkR1VnUEQwZ2RHaHBjeTV2Y0hScGIyNXpMbTFwYmtSaGRHVXBJRDhnSnlCcGN5MWthWE5oWW14bFpDY2dPaUFuSjMxY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSE4yWnlCM2FXUjBhRDFjSWpoY0lpQm9aV2xuYUhROVhDSXhORndpSUhacFpYZENiM2c5WENJd0lEQWdPQ0F4TkZ3aUlHWnBiR3c5WENKdWIyNWxYQ0lnZUcxc2JuTTlYQ0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh5TURBd0wzTjJaMXdpUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQSEJoZEdnZ1pEMWNJazAzSURFelRERWdOMHczSURGY0lpQnpkSEp2YTJVOVhDSWpPRU00UXpoRFhDSWdjM1J5YjJ0bExYZHBaSFJvUFZ3aU1sd2lJSE4wY205clpTMXNhVzVsWTJGd1BWd2ljbTkxYm1SY0lpQnpkSEp2YTJVdGJHbHVaV3B2YVc0OVhDSnliM1Z1WkZ3aVBqd3ZjR0YwYUQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpkbWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrMXZiblJvWDE5MGFYUnNaVndpUGlSN2JXOXVkR2hVYVhSc1pYMGdKSHRrWVhSbExtZGxkRVoxYkd4WlpXRnlLQ2w5UEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BHUnBkaUJqYkdGemN6MWNJazF2Ym5Sb1gxOWhjbkp2ZHlCTmIyNTBhRjlmWVhKeWIzY3RMVzVsZUhRa2V5aDBhR2x6TG05d2RHbHZibk11YldGNFJHRjBaU0FtSmlCa1lYUmxJRDQ5SUhSb2FYTXViM0IwYVc5dWN5NXRZWGhFWVhSbEtTQS9JQ2NnYVhNdFpHbHpZV0pzWldRbklEb2dKeWQ5WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpkbWNnZDJsa2RHZzlYQ0k0WENJZ2FHVnBaMmgwUFZ3aU1UUmNJaUIyYVdWM1FtOTRQVndpTUNBd0lEZ2dNVFJjSWlCbWFXeHNQVndpYm05dVpWd2lJSGh0Ykc1elBWd2lhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtZGNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHdZWFJvSUdROVhDSk5NU0F3TGprNU9UazVPVXczSURkTU1TQXhNMXdpSUhOMGNtOXJaVDFjSWlNNFF6aERPRU5jSWlCemRISnZhMlV0ZDJsa2RHZzlYQ0l5WENJZ2MzUnliMnRsTFd4cGJtVmpZWEE5WENKeWIzVnVaRndpSUhOMGNtOXJaUzFzYVc1bGFtOXBiajFjSW5KdmRXNWtYQ0krUEM5d1lYUm9QbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TDNOMlp6NWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrMXZiblJvWDE5M1pXVnJYQ0krSkh0M1pXVnJSR0Y1Y3k1dFlYQW9hWFJsYlNBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdBOFpHbDJJR05zWVhOelBWd2lUVzl1ZEdoZlgzZGxaV3RrWVhsY0lqNGtlMmwwWlcwdWRHbDBiR1Y5UEM5a2FYWStZRnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlNrdWFtOXBiaWduSnlsOVBDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWd2lUVzl1ZEdoZlgyUmhlWE5jSWo0OEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1lGeHlYRzRnSUNBZ0lDQWdJQ2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5HQjBZTFJnTkMxMEx2UXV0QzRYSEpjYmlBZ0lDQWdJQ0FnVzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I3YzJWc1pXTjBiM0k2SUNjdVRXOXVkR2hmWDJGeWNtOTNMUzF3Y21WMkp5d2dibUZ0WlRvZ0ozQnlaWFluZlN4Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZTNObGJHVmpkRzl5T2lBbkxrMXZiblJvWDE5aGNuSnZkeTB0Ym1WNGRDY3NJRzVoYldVNklDZHVaWGgwSjMwc1hISmNiaUFnSUNBZ0lDQWdYUzVtYjNKRllXTm9LR2wwWlcwZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmpiMjV6ZENBa1lYSnliM2NnUFNBa2JXOXVkR2d1Y1hWbGNubFRaV3hsWTNSdmNpaHBkR1Z0TG5ObGJHVmpkRzl5S1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSkdGeWNtOTNMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KMk5zYVdOckp5d2daU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5dmJrRnljbTkzUTJ4cFkyc29KR0Z5Y205M0xDQnBkR1Z0TG01aGJXVXBPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLVHRjY2x4dUlDQWdJQ0FnSUNCOUtUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0x5OGcwWURRdGRDOTBMVFF0ZEdBSU5DMDBMM1F0ZEM1WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnSkdSaGVYTWdQU0FrYlc5dWRHZ3VjWFZsY25sVFpXeGxZM1J2Y2lnbkxrMXZiblJvWDE5a1lYbHpKeWs3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWkdGNWN5QTlJRzVsZHlCRVlYUmxLR1JoZEdVdVoyVjBWR2x0WlNncEtUdGNjbHh1SUNBZ0lDQWdJQ0JrWVhsekxuTmxkRVJoZEdVb01TazdYSEpjYmlBZ0lDQWdJQ0FnWkdGNWN5NXpaWFJJYjNWeWN5Z3dMQ0F3TENBd0xDQXdLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdkMmhwYkdVZ0tHUmhlWE11WjJWMFRXOXVkR2dvS1NBOVBTQmpkWEp5Wlc1MFRXOXVkR2dwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdKSGRsWldzZ1BTQjBhR2x6TGw4a1kzSmxZWFJsVjJWbGF5Z3BPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZDJWbGEwUmhlWE11Wm05eVJXRmphQ2hwZEdWdElEMCtJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsbUlDaGtZWGx6TG1kbGRFUmhlU2dwSUNFOUlHbDBaVzB1WkdGNUlIeDhJR1JoZVhNdVoyVjBUVzl1ZEdnb0tTQWhQU0JqZFhKeVpXNTBUVzl1ZEdncElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBa2QyVmxheTVoY0hCbGJtUkRhR2xzWkNoMGFHbHpMbDhrWTNKbFlYUmxSVzF3ZEhsRVlYa29LU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDUjNaV1ZyTG1Gd2NHVnVaRU5vYVd4a0tIUm9hWE11WHlSamNtVmhkR1ZFWVhrb1pHRjVjeWtwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1pHRjVjeTV6WlhSRVlYUmxLR1JoZVhNdVoyVjBSR0YwWlNncElDc2dNU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDBwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0pHUmhlWE11WVhCd1pXNWtRMmhwYkdRb0pIZGxaV3NwTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUNSdGIyNTBhRHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdktpcGNjbHh1SUNBZ0lDQXFJTkNhMEx2UXVOQzZJTkMvMEw0ZzBZSFJndEdBMExYUXU5QzYwTFVnMEwvUXRkR0EwTFhRdXRDNzBZN1JoOUMxMEwzUXVOR1BJTkM4MExYUmdkR1AwWWJRc0Z4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0RmJHVnRaVzUwZlNBa1lYSnliM2NnU0ZSTlRDRFJqZEM3MExYUXZOQzEwTDNSZ2x4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0VGRISnBibWQ5SUc1aGJXVWdJQ0FnMEpqUXZOR1BJQ2h3Y21WMkxDQnVaWGgwS1Z4eVhHNGdJQ0FnSUNvdlhISmNiaUFnSUNCMGFHbHpMbDl2YmtGeWNtOTNRMnhwWTJzZ1BTQm1kVzVqZEdsdmJpZ2tZWEp5YjNjc0lHNWhiV1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvSkdGeWNtOTNMbU5zWVhOelRHbHpkQzVqYjI1MFlXbHVjeWduYVhNdFpHbHpZV0pzWldRbktTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1ptRnNjMlU3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0JrWVhSbElEMGdibVYzSUVSaGRHVW9jR0Z5YzJWSmJuUW9kR2hwY3k1ZkpHMXZiblJvY3k1eGRXVnllVk5sYkdWamRHOXlLQ2N1VFc5dWRHZ25LUzVrWVhSaGMyVjBMblJwYldVc0lERXdLU2s3WEhKY2JpQWdJQ0FnSUNBZ1pHRjBaUzV6WlhSTmIyNTBhQ2hrWVhSbExtZGxkRTF2Ym5Sb0tDa2dLeUFvYm1GdFpTQTlQU0FuY0hKbGRpY2dQeUF0ZEdocGN5NXZjSFJwYjI1ekxtMXZiblJvYzBOdmRXNTBJRG9nZEdocGN5NXZjSFJwYjI1ekxtMXZiblJvYzBOdmRXNTBLU2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5DeTBZdlJoZEMrMExRZzBMZlFzQ0RRdjlHQTBMWFF0TkMxMEx2Uml5RFF2TkM0MEwzUXVOQzgwTERRdTlHTTBMM1F2dEM1SU5DMDBMRFJndEdMWEhKY2JpQWdJQ0FnSUNBZ2FXWWdLR1JoZEdVZ1BDQjBhR2x6TG05d2RHbHZibk11YldsdVJHRjBaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JrWVhSbExuTmxkRlJwYldVb2RHaHBjeTV2Y0hScGIyNXpMbTFwYmtSaGRHVXVaMlYwVkdsdFpTZ3BLVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOQ3kwWXZSaGRDKzBMUWcwTGZRc0NEUXY5R0EwTFhRdE5DMTBMdlJpeURRdk5DdzBMclJnZEM0MEx6UXNOQzcwWXpRdmRDKzBMa2cwTFRRc05HQzBZdGNjbHh1SUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbTFoZUVSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdZMjl1YzNRZ1pXNWtSR0YwWlNBOUlHNWxkeUJFWVhSbEtHUmhkR1V1WjJWMFZHbHRaU2dwS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWlc1a1JHRjBaUzV6WlhSTmIyNTBhQ2hsYm1SRVlYUmxMbWRsZEUxdmJuUm9LQ2tnS3lCMGFHbHpMbTl3ZEdsdmJuTXViVzl1ZEdoelEyOTFiblFwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb1pXNWtSR0YwWlNBK0lIUm9hWE11YjNCMGFXOXVjeTV0WVhoRVlYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCa1lYUmxMbk5sZEZScGJXVW9kR2hwY3k1dmNIUnBiMjV6TG0xaGVFUmhkR1V1WjJWMFZHbHRaU2dwS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHUmhkR1V1YzJWMFRXOXVkR2dvWkdGMFpTNW5aWFJOYjI1MGFDZ3BJQzBnZEdocGN5NXZjSFJwYjI1ekxtMXZiblJvYzBOdmRXNTBJQ3NnTVNrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WHlSamNtVmhkR1ZOYjI1MGFITW9aR0YwWlNrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUW9OQzEwTDNRdE5DMTBZQWcwTDNRdGRDMDBMWFF1OUM0WEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnSUh0RVlYUmxmU0JrWVhSbElOQ2UwTEhSaXRDMTBMclJnaURRdE5DdzBZTFJpMXh5WEc0Z0lDQWdJQ29nUUhKbGRIVnliaUI3Uld4bGJXVnVkSDFjY2x4dUlDQWdJQ0FxTDF4eVhHNGdJQ0FnZEdocGN5NWZKR055WldGMFpWZGxaV3NnUFNCbWRXNWpkR2x2Ymloa1lYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnSkhkbFpXc2dQU0IwYUdsekxsOGtZM0psWVhSbFJXeGxiV1Z1ZENoY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWUR4a2FYWWdZMnhoYzNNOVhDSlhaV1ZyWENJK1BDOWthWFkrWUZ4eVhHNGdJQ0FnSUNBZ0lDazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlBa2QyVmxhenRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdktpcGNjbHh1SUNBZ0lDQXFJTkNnMExYUXZkQzAwTFhSZ0NEUXROQzkwWTljY2x4dUlDQWdJQ0FxSUVCd1lYSmhiU0FnZTBSaGRHVjlJR1JoZEdVZzBKN1FzZEdLMExYUXV0R0NJTkMwMExEUmd0R0xYSEpjYmlBZ0lDQWdLaUJBY21WMGRYSnVJSHRGYkdWdFpXNTBmVnh5WEc0Z0lDQWdJQ292WEhKY2JpQWdJQ0IwYUdsekxsOGtZM0psWVhSbFJHRjVJRDBnWm5WdVkzUnBiMjRvWkdGMFpTa2dlMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR3h2WTJ0bFpDQTlJSFJvYVhNdVoyVjBSR0Y1VEc5amEyVmtLR1JoZEdVcE8xeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElIUnZaR0Y1SUNBOUlIUm9hWE11WDNSdlpHRjVMbWRsZEZScGJXVW9LU0E5UFNCa1lYUmxMbWRsZEZScGJXVW9LVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdiR1YwSUdOc1lYTnpUbUZ0WlNBOUlDY25PMXh5WEc0Z0lDQWdJQ0FnSUdOc1lYTnpUbUZ0WlNBclBTQnNiMk5yWldRZ1B5QW5JR2x6TFdScGMyRmliR1ZrSnlBNklDY25PMXh5WEc0Z0lDQWdJQ0FnSUdOc1lYTnpUbUZ0WlNBclBTQnNiMk5yWldRZ1BUMGdURTlEUzE5TVQwTkxSVVFnUHlBbklHbHpMV3h2WTJ0bFpDY2dPaUFuSnp0Y2NseHVJQ0FnSUNBZ0lDQmpiR0Z6YzA1aGJXVWdLejBnZEc5a1lYa2dQeUFuSUdsekxYUnZaR0Y1SnlBNklDY25PMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENBa1pHRjVJRDBnZEdocGN5NWZKR055WldGMFpVVnNaVzFsYm5Rb1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdBOFpHbDJJR05zWVhOelBWd2lSR0Y1Skh0amJHRnpjMDVoYldWOVhDSWdaR0YwWVMxMGFXMWxQVndpSkh0a1lYUmxMbWRsZEZScGJXVW9LWDFjSWlCa1lYUmhMV1JoZVQxY0lpUjdaR0YwWlM1blpYUkVZWGtvS1gxY0lqNGtlMlJoZEdVdVoyVjBSR0YwWlNncGZUd3ZaR2wyUG1CY2NseHVJQ0FnSUNBZ0lDQXBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQWtaR0Y1TG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvSjJOc2FXTnJKeXdnZEdocGN5NWZiMjVFWVhsRGJHbGphMFYyWlc1MExtSnBibVFvZEdocGN5a3BPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvSVhSb2FYTXViM0IwYVc5dWN5NXphVzVuYkdWTmIyUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ1JrWVhrdVlXUmtSWFpsYm5STWFYTjBaVzVsY2lnbmJXOTFjMlZsYm5SbGNpY3NJSFJvYVhNdVgyOXVSR0Y1VFc5MWMyVkZiblJsY2tWMlpXNTBMbUpwYm1Rb2RHaHBjeWtwTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUNSa1lYazdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRFFvZEMrMExIUmk5R0MwTGpRdFNEUXV0QzcwTGpRdXRDd0lOQy8wTDRnMExUUXZkR09YSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMFYyWlc1MGZTQmxJRVJQVFNEUmdkQyswTEhSaTlHQzBMalF0Vnh5WEc0Z0lDQWdJQ292WEhKY2JpQWdJQ0IwYUdsekxsOXZia1JoZVVOc2FXTnJSWFpsYm5RZ1BTQm1kVzVqZEdsdmJpaGxLU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmYjI1RVlYbERiR2xqYXlobExuUmhjbWRsZENrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUW9kQyswTEhSaTlHQzBMalF0U0RSaGRDKzBMTFF0ZEdBMExCY2NseHVJQ0FnSUNBcUlFQndZWEpoYlNCN1JYWmxiblI5SUdVZ1JFOU5JTkdCMEw3UXNkR0wwWUxRdU5DMVhISmNiaUFnSUNBZ0tpOWNjbHh1SUNBZ0lIUm9hWE11WDI5dVJHRjVUVzkxYzJWRmJuUmxja1YyWlc1MElEMGdablZ1WTNScGIyNG9aU2tnZTF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDI5dVJHRjVUVzkxYzJWRmJuUmxjaWhsTG5SaGNtZGxkQ2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5b3FYSEpjYmlBZ0lDQWdLaURRcGRDKzBMTFF0ZEdBSU5DOTBMQWcwWTNRdTlDMTBMelF0ZEM5MFlMUXRTRFF0TkM5MFk5Y2NseHVJQ0FnSUNBcUlFQndZWEpoYlNCN1JXeGxiV1Z1ZEgwZ0pHUmhlU0JJVkUxTUlOQ3QwTHZRdGRDODBMWFF2ZEdDWEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUhSb2FYTXVYMjl1UkdGNVRXOTFjMlZGYm5SbGNpQTlJR1oxYm1OMGFXOXVLQ1JrWVhrcElIdGNjbHh1SUNBZ0lDQWdJQ0JwWmlBb0lYUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYMlp5YjIwZ2ZId2dkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLQ1JrWVhrdVpHRjBZWE5sZEM1MGFXMWxJRDA5SUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjB1WjJWMFZHbHRaU2dwS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR1JoZEdWZmRHOGdQU0J1WlhjZ1JHRjBaU2h3WVhKelpVbHVkQ2drWkdGNUxtUmhkR0Z6WlhRdWRHbHRaU3dnTVRBcEtUdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDaDBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dExDQmtZWFJsWDNSdktUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlOQ2EwTHZRdU5DNklOQy8wTDRnMExUUXZkR09YSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMFZzWlcxbGJuUjlJQ1JrWVhrZ1NGUk5UQ0RRcmRDNzBMWFF2TkMxMEwzUmdseHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TGw5dmJrUmhlVU5zYVdOcklEMGdablZ1WTNScGIyNG9KR1JoZVNrZ2UxeHlYRzRnSUNBZ0lDQWdJQzh2SU5DMDBMWFF2ZEdNSU5DMzBMRFFzZEM3MEw3UXV0QzQwWURRdnRDeTBMRFF2Vnh5WEc0Z0lDQWdJQ0FnSUdsbUlDZ2taR0Y1TG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmFYTXRaR2x6WVdKc1pXUW5LU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURRc3RHTDBMSFF2dEdBSU5DKzBMVFF2ZEMrMExrZzBMVFFzTkdDMFl0Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxuTnBibWRzWlUxdlpHVXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1eVlXNW5aVkpsYzJWMEtDazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDUmtZWGt1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25hWE10YzJWc1pXTjBaV1FuS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NWZZMkZzYkdKaFkyc29KMlJoZVZObGJHVmpkQ2NzSUc1bGR5QkVZWFJsS0hCaGNuTmxTVzUwS0NSa1lYa3VaR0YwWVhObGRDNTBhVzFsTENBeE1Da3BLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdMeThnMFlIUXNkR0EwTDdSZ1NEUXN0R0wwTEhSZ05DdzBMM1F2ZEMrMExQUXZpRFJnTkN3MEwzUXRkQzFJTkMwMExqUXNOQy8wTERRdDlDKzBMM1FzRnh5WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dElDWW1JSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11Y21GdVoyVlNaWE5sZENncE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdKR1JoZVM1amJHRnpjMHhwYzNRdVlXUmtLQ2RwY3kxelpXeGxZM1JsWkNjcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5RFFzdEdMMExIUmdOQ3cwTDNRc0NEUXZkQ3cwWWZRc05DNzBZelF2ZEN3MFk4Z0x5RFF1dEMrMEwzUXRkR0gwTDNRc05HUElOQzAwTERSZ3RDd1hISmNiaUFnSUNBZ0lDQWdhV1lnS0NGMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBnUFNCdVpYY2dSR0YwWlNod1lYSnpaVWx1ZENna1pHRjVMbVJoZEdGelpYUXVkR2x0WlN3Z01UQXBLVHRjY2x4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnYVdZZ0tDRjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieUE5SUc1bGR5QkVZWFJsS0hCaGNuTmxTVzUwS0NSa1lYa3VaR0YwWVhObGRDNTBhVzFsTENBeE1Da3BPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYMlp5YjIwZ0ppWWdkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGcwTFRRdnRDLzBZUFJnZEdDMExqUXZOR0wwTGtnMExUUXVOQ3cwTC9Rc05DMzBMN1F2Vnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvSVhSb2FYTXVaMlYwU1hOU1lXNW5aVk5sYkdWamRHRmliR1VvZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU3dnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZmRHOHBLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbkpoYm1kbFVtVnpaWFFvS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTV5WVc1blpWTmxiR1ZqZENoMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0TENCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieWs3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBLSFFzZEdBMEw3UmdTRFFzdEdMMExUUXRkQzcwTFhRdmRDOTBZdlJoU0RRdE5DdzBZSmNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdkR2hwY3k1eVlXNW5aVkpsYzJWMElEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4U1pYTmxkQ2dwTzF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNObGJHVmpkR2x2YmlBOUlIdDlPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwSkxRdU5DMzBZUFFzTkM3MFl6UXZkR0wwTGtnMFlIUXNkR0EwTDdSZ1NEUXN0R0wwTFRRdGRDNzBMWFF2ZEM5MFl2UmhTRFF0TkN3MFlKY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4U1pYTmxkQ0E5SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElDUmtZWGx6SUQwZ2RHaHBjeTVmSkcxdmJuUm9jeTV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2N1UkdGNVcyUmhkR0V0ZEdsdFpWMG5LVHRjY2x4dUlDQWdJQ0FnSUNBa1pHRjVjeTVtYjNKRllXTm9LQ1JrWVhrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWtaR0Y1TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJsekxYTmxiR1ZqZEdWa0p5d2dKMmx6TFhObGJHVmpkR1ZrTFdaeWIyMG5MQ0FuYVhNdGMyVnNaV04wWldRdGRHOG5MQ0FuYVhNdGMyVnNaV04wWldRdFltVjBkMlZsYmljcE8xeHlYRzRnSUNBZ0lDQWdJSDBwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0F2THlEUXY5R0EwWS9SaDlDMTBMd2cwTC9RdnRDMDBZSFF1dEN3MExmUXV0R0RYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZkRzl2YkhScGNFaHBaR1VvS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZLaXBjY2x4dUlDQWdJQ0FxSU5DUzBMalF0OUdEMExEUXU5R00wTDNRdnRDMUlOQ3kwWXZRdE5DMTBMdlF0ZEM5MExqUXRTRFF0TkN3MFlKY2NseHVJQ0FnSUNBcUlFQndZWEpoYlNCN1JHRjBaWDBnWkdGMFpWOW1jbTl0SU5DZDBMRFJoOUN3MEx2UmpOQzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0RVlYUmxmU0JrWVhSbFgzUnZJQ0FnMEpyUXZ0QzkwTFhSaDlDOTBMRFJqeURRdE5DdzBZTFFzRnh5WEc0Z0lDQWdJQ292WEhKY2JpQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDQTlJR1oxYm1OMGFXOXVLR1JoZEdWZlpuSnZiU3dnWkdGMFpWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2hrWVhSbFgyWnliMjBnSmlZZ1pHRjBaVjltY205dElHbHVjM1JoYm1ObGIyWWdSR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCa1lYUmxYMlp5YjIwdWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb1pHRjBaVjkwYnlBbUppQmtZWFJsWDNSdklHbHVjM1JoYm1ObGIyWWdSR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCa1lYUmxYM1J2TG5ObGRFaHZkWEp6S0RBc0lEQXNJREFzSURBcE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdiR1YwSUhScGJXVmZabkp2YlNBOUlHUmhkR1ZmWm5KdmJTQnBibk4wWVc1alpXOW1JRVJoZEdVZ1B5QmtZWFJsWDJaeWIyMHVaMlYwVkdsdFpTZ3BJRG9nTUR0Y2NseHVJQ0FnSUNBZ0lDQnNaWFFnZEdsdFpWOTBieUE5SUdSaGRHVmZkRzhnYVc1emRHRnVZMlZ2WmlCRVlYUmxJRDhnWkdGMFpWOTBieTVuWlhSVWFXMWxLQ2tnT2lBd08xeHlYRzRnSUNBZ0lDQWdJR2xtSUNoMGFXMWxYMlp5YjIwZ1BpQjBhVzFsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lGdDBhVzFsWDJaeWIyMHNJSFJwYldWZmRHOWRJRDBnVzNScGJXVmZkRzhzSUhScGJXVmZabkp2YlYwN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURRc3RHTDBMVFF0ZEM3MExYUXZkQzQwTFVnMExUUXNOR0NJTkM4MExYUXR0QzAwWU1nMEwzUXNOR0gwTERRdTlHTTBMM1F2dEM1SU5DNElOQzYwTDdRdmRDMTBZZlF2ZEMrMExsY2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENBa1pHRjVjeUE5SUhSb2FYTXVYeVJ0YjI1MGFITXVjWFZsY25sVFpXeGxZM1J2Y2tGc2JDZ25Ma1JoZVZ0a1lYUmhMWFJwYldWZEp5azdYSEpjYmlBZ0lDQWdJQ0FnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENBa1pHRjVjeTVzWlc1bmRHZzdJQ3NyYVNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBa1pHRjVjMXRwWFM1amJHRnpjMHhwYzNRdWRHOW5aMnhsS0NkcGN5MXpaV3hsWTNSbFpDMWlaWFIzWldWdUp5d2dKR1JoZVhOYmFWMHVaR0YwWVhObGRDNTBhVzFsSUQ0Z2RHbHRaVjltY205dElDWW1JQ1JrWVhselcybGRMbVJoZEdGelpYUXVkR2x0WlNBOElIUnBiV1ZmZEc4cE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdMeThnMExMUmk5QzAwTFhRdTlDMTBMM1F1TkMxSU5DOTBMRFJoOUN3MEx2UmpOQzkwTDdRdVNEUXVDRFF1dEMrMEwzUXRkR0gwTDNRdnRDNUlOQy8wTDdRdDlDNDBZYlF1TkM0WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnSkdSaGVWOW1jbTl0SUQwZ2RHaHBjeTVmSkdkbGRFUmhlVUo1UkdGMFpTaGtZWFJsWDJaeWIyMHBPMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJQ1JrWVhsZmRHOGdQU0IwYUdsekxsOGtaMlYwUkdGNVFubEVZWFJsS0dSaGRHVmZkRzhwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0F2THlEUXV0QzEwWWdnMExUUXU5R1BJTkN4MFl2UmdkR0MwWURRdnRDejBMNGcwWUhRc2RHQTBMN1JnZEN3SU5HQjBZTFFzTkdBMEw3UXM5QytJTkN5MFl2UXROQzEwTHZRdGRDOTBMalJqMXh5WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGTmxiR1ZqZEM0a1pHRjVYMlp5YjIxZmIyeGtJQ1ltSUhSb2FYTXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBMaVJrWVhsZlpuSnZiVjl2YkdRZ0lUMGdKR1JoZVY5bWNtOXRLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVgzSmhibWRsVm1semRXRnNVMlZzWldOMExpUmtZWGxmWm5KdmJWOXZiR1F1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYVhNdGMyVnNaV04wWldRbkxDQW5hWE10YzJWc1pXTjBaV1F0Wm5KdmJTY3BPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnTHk4ZzBMclF0ZEdJSU5DMDBMdlJqeURRc2RHTDBZSFJndEdBMEw3UXM5QytJTkdCMExIUmdOQyswWUhRc0NEUmdkR0MwTERSZ05DKzBMUFF2aURRc3RHTDBMVFF0ZEM3MExYUXZkQzQwWTljY2x4dUlDQWdJQ0FnSUNCcFppQW9kR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFRaV3hsWTNRdUpHUmhlVjkwYjE5dmJHUWdKaVlnZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUXVKR1JoZVY5MGIxOXZiR1FnSVQwZ0pHUmhlVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQzRrWkdGNVgzUnZYMjlzWkM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkcGN5MXpaV3hsWTNSbFpDY3NJQ2RwY3kxelpXeGxZM1JsWkMxMGJ5Y3BPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tDUmtZWGxmWm5KdmJTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWtaR0Y1WDJaeWIyMHVZMnhoYzNOTWFYTjBMbUZrWkNnbmFYTXRjMlZzWldOMFpXUW5MQ0FuYVhNdGMyVnNaV04wWldRdFpuSnZiU2NwTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLQ1JrWVhsZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdKR1JoZVY5MGJ5NWpiR0Z6YzB4cGMzUXVZV1JrS0NkcGN5MXpaV3hsWTNSbFpDY3NJQ2RwY3kxelpXeGxZM1JsWkMxMGJ5Y3BPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnTHk4ZzBZSFF2dEdGMFlEUXNOQzkwTFhRdmRDNDBMVWcwTElnMExyUXRkR0lYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUXVKR1JoZVY5bWNtOXRYMjlzWkNBOUlDUmtZWGxmWm5KdmJUdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDNGtaR0Y1WDNSdlgyOXNaQ0E5SUNSa1lYbGZkRzg3WEhKY2JseHlYRzRnSUNBZ0lDQWdJR2xtSUNna1pHRjVYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdOdmJuTjBJR1JoZVhNZ1BTQk5ZWFJvTG1ac2IyOXlLRTFoZEdndVlXSnpLSFJwYldWZlpuSnZiU0F0SUhScGJXVmZkRzhwSUM4Z09EWTBNREJsTXlrZ0t5QXhPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5MGIyOXNkR2x3VTJodmR5Z2taR0Y1WDNSdkxDQmtZWGx6S1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRFFuOUMrMExyUXNOQzNJTkMvMEw3UXROR0IwTHJRc05DMzBMclF1Rnh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRGYkdWdFpXNTBmU0FrWkdGNUlOQ1MwWXZRc2RHQTBMRFF2ZEM5MFl2UXVTRFF0TkMxMEwzUmpGeHlYRzRnSUNBZ0lDb2dRSEJoY21GdElIdE9kVzFpWlhKOUlDQmtZWGx6SU5DYTBMN1F1OUM0MFlmUXRkR0IwWUxRc3RDK0lOQzAwTDNRdGRDNVhISmNiaUFnSUNBZ0tpOWNjbHh1SUNBZ0lIUm9hWE11WDNSdmIyeDBhWEJUYUc5M0lEMGdablZ1WTNScGIyNG9KR1JoZVN3Z1pHRjVjeWtnZTF4eVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUhKbFkzUWdQU0FrWkdGNUxtZGxkRUp2ZFc1a2FXNW5RMnhwWlc1MFVtVmpkQ2dwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOGtkRzl2YkhScGNDNTBaWGgwUTI5dWRHVnVkQ0E5SUhSb2FYTXViM0IwYVc5dWN5NW1hV3gwWlhJdWRHOXZiSFJwY0ZSbGVIUXVZMkZzYkNoMGFHbHpMQ0JrWVhsektTQjhmQ0FuSnp0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw4a2RHOXZiSFJwY0M1amJHRnpjMHhwYzNRdWRHOW5aMnhsS0NkcGN5MXphRzkzSnl3Z2RHaHBjeTVmSkhSdmIyeDBhWEF1ZEdWNGRFTnZiblJsYm5RdWJHVnVaM1JvS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZKSFJ2YjJ4MGFYQXVjM1I1YkdVdWRHOXdJRDBnVFdGMGFDNXliM1Z1WkNoeVpXTjBMblJ2Y0NBdElISmxZM1F1YUdWcFoyaDBJQzBnZEdocGN5NWZKSFJ2YjJ4MGFYQXViMlptYzJWMFNHVnBaMmgwS1NBcklDZHdlQ2M3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmSkhSdmIyeDBhWEF1YzNSNWJHVXViR1ZtZENBOUlFMWhkR2d1Y205MWJtUW9jbVZqZEM1c1pXWjBJQ3NnY21WamRDNTNhV1IwYUNBdklESWdMU0IwYUdsekxsOGtkRzl2YkhScGNDNXZabVp6WlhSWGFXUjBhQ0F2SURJcElDc2dKM0I0Snp0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZLaXBjY2x4dUlDQWdJQ0FxSU5DaDBMclJnTkdMMFlMUmpDRFF2OUMrMExUUmdkQzYwTERRdDlDNjBZTmNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdkR2hwY3k1ZmRHOXZiSFJwY0VocFpHVWdQU0JtZFc1amRHbHZiaWdwSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw4a2RHOXZiSFJwY0M1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkcGN5MXphRzkzSnlrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUW90QzEwTHJSZ2RHQ0lOQy8wTDdRdE5HQjBMclFzTkMzMExyUXVDRFF2OUMrSU5HRDBMelF2dEM3MFlmUXNOQzkwTGpSamx4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNCa1lYbHpJTkNhMEw3UXU5QzQwWWZRdGRHQjBZTFFzdEMrSU5DMDBMM1F0ZEM1WEhKY2JpQWdJQ0FnS2lCQWNtVjBkWEp1SUh0VGRISnBibWQ5WEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUhSb2FYTXVYMlpwYkhSbGNsUnZiMngwYVhCVVpYaDBJRDBnWm5WdVkzUnBiMjRvWkdGNWN5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxuQnNkWEpoYkNoa1lYbHpMQ0JiSnlWa0lOQzAwTFhRdmRHTUp5d2dKeVZrSU5DMDBMM1JqeWNzSUNjbFpDRFF0TkM5MExYUXVTZGRLUzV5WlhCc1lXTmxLQ2NsWkNjc0lHUmhlWE1wTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHFLbHh5WEc0Z0lDQWdJQ29nMEpMUmk5QzAwTFhRdTlDMTBMM1F1TkMxSU5DMDBMalFzTkMvMExEUXQ5QyswTDNRc0NEUXROQ3cwWUpjY2x4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3UkdGMFpYMGdaR0YwWlY5bWNtOXRJTkNkMExEUmg5Q3cwTHZSak5DOTBMRFJqeURRdE5DdzBZTFFzRnh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRFWVhSbGZTQmtZWFJsWDNSdklDQWcwSnJRdnRDOTBMWFJoOUM5MExEUmp5RFF0TkN3MFlMUXNGeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TG5KaGJtZGxVMlZzWldOMElEMGdablZ1WTNScGIyNG9aR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ1pHRjBaVjltY205dExuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc0Z0lDQWdJQ0FnSUdSaGRHVmZkRzh1YzJWMFNHOTFjbk1vTUN3Z01Dd2dNQ3dnTUNrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOQzAwTDdRdjlHRDBZSFJndEM0MEx6Umk5QzVJTkMwMExqUXNOQy8wTERRdDlDKzBMMWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb0lYUm9hWE11WjJWMFNYTlNZVzVuWlZObGJHVmpkR0ZpYkdVb1pHRjBaVjltY205dExDQmtZWFJsWDNSdktTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200N1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENBa1pHRjVYMlp5YjIwZ1BTQjBhR2x6TGw4a1oyVjBSR0Y1UW5sRVlYUmxLR1JoZEdWZlpuSnZiU2s3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnSkdSaGVWOTBieUE5SUhSb2FYTXVYeVJuWlhSRVlYbENlVVJoZEdVb1pHRjBaVjkwYnlrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUdsbUlDZ2taR0Y1WDJaeWIyMHBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdKR1JoZVY5bWNtOXRMbU5zWVhOelRHbHpkQzVoWkdRb0oybHpMWE5sYkdWamRHVmtKeXdnSjJsekxYTmxiR1ZqZEdWa0xXWnliMjBuS1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2drWkdGNVgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ1JrWVhsZmRHOHVZMnhoYzNOTWFYTjBMbUZrWkNnbmFYTXRjMlZzWldOMFpXUW5MQ0FuYVhNdGMyVnNaV04wWldRdGRHOG5LVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOQ3kwWXZRdE5DMTBMdlF0ZEM5MExqUXRTRFJqZEM3MExYUXZOQzEwTDNSZ3RDKzBMSmNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDaGtZWFJsWDJaeWIyMHNJR1JoZEdWZmRHOHBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURRc3RHTDBMSFF2dEdBSU5DMDBMRFJnaURRc2lEUXZ0Q3gwWURRc05HQzBMM1F2dEM4SU5DLzBMN1JnTkdQMExUUXV0QzFYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tHUmhkR1ZmWm5KdmJTQStJR1JoZEdWZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdXMlJoZEdWZlpuSnZiU3dnWkdGMFpWOTBiMTBnUFNCYlpHRjBaVjkwYnl3Z1pHRjBaVjltY205dFhUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5HQjBMN1FzZEdMMFlMUXVOQzFYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZZMkZzYkdKaFkyc29KM0poYm1kbFUyVnNaV04wSnl3Z1pHRjBaVjltY205dExDQmtZWFJsWDNSdktUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlOQ2YwWURRdnRDeTBMWFJnTkM2MExBZzBMTFF2dEMzMEx6UXZ0QzIwTDNRdnRHQjBZTFF1Q0RRc3RHTDBMVFF0ZEM3MExYUXZkQzQwWThnMExUUXNOR0NYSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdJSHRFWVhSbElHUmhkR1ZmWm5KdmJTRFFuZEN3MFlmUXNOQzcwWXpRdmRDdzBZOGcwTFRRc05HQzBMQmNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQWdlMFJoZEdVZ1pHRjBaVjkwYnlBZ0lOQ2EwTDdRdmRDMTBZZlF2ZEN3MFk4ZzBMVFFzTkdDMExCY2NseHVJQ0FnSUNBcUlFQnlaWFIxY200Z2UwSnZiMnhsWVc1OVhISmNiaUFnSUNBZ0tpOWNjbHh1SUNBZ0lIUm9hWE11WjJWMFNYTlNZVzVuWlZObGJHVmpkR0ZpYkdVZ1BTQm1kVzVqZEdsdmJpaGtZWFJsWDJaeWIyMHNJR1JoZEdWZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNCa1lYUmxYMlp5YjIwdWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmlBZ0lDQWdJQ0FnWkdGMFpWOTBieTV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tHUmhkR1ZmWm5KdmJTQStJR1JoZEdWZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdXMlJoZEdWZlpuSnZiU3dnWkdGMFpWOTBiMTBnUFNCYlpHRjBaVjkwYnl3Z1pHRjBaVjltY205dFhUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5DODBMalF2ZEM0MEx6UXNOQzcwWXpRdmRHTDBMa2cwTFRRdU5DdzBML1FzTkMzMEw3UXZWeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElHUnBabVlnUFNCTllYUm9MbUZpY3loa1lYUmxYMlp5YjIwdVoyVjBWR2x0WlNncElDMGdaR0YwWlY5MGJ5NW5aWFJVYVcxbEtDa3BJQzhnTVRBd01DQXZJRGcyTkRBd08xeHlYRzRnSUNBZ0lDQWdJR2xtSUNoa2FXWm1JRHdnZEdocGN5NXZjSFJwYjI1ekxtMXBia1JoZVhNcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnTHk4ZzBML1JnTkMrMExMUXRkR0EwTHJRc0NEUXY5QyswTC9Rc05DMDBMRFF2ZEM0MFk4ZzBMSWcwTFRRdU5DdzBML1FzTkMzMEw3UXZTRFF0OUN3MExIUXU5QyswTHJRdU5HQTBMN1FzdEN3MEwzUXZkR0wwWVVnMExUUXNOR0NYSEpjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdaR0Y1SUQwZ2JtVjNJRVJoZEdVb0tUdGNjbHh1SUNBZ0lDQWdJQ0JrWVhrdWMyVjBWR2x0WlNoa1lYUmxYMlp5YjIwdVoyVjBWR2x0WlNncEtUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2QyaHBiR1VnS0dSaGVTQThJR1JoZEdWZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0hSb2FYTXVaMlYwUkdGNVRHOWphMlZrS0dSaGVTa3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdaR0Y1TG5ObGRFUmhkR1VvWkdGNUxtZGxkRVJoZEdVb0tTQXJJREVwTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVTdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRFFuOUdBMEw3UXN0QzEwWURRdXRDd0lOQzkwTEFnMExUUXZ0R0IwWUxSZzlDLzBMM1F2dEdCMFlMUmpDRFF0TkM5MFk4ZzBMVFF1OUdQSU5DeDBZRFF2dEM5MExoY2NseHVJQ0FnSUNBcUlFQndZWEpoYlNBZ2UwUmhkR1Y5SUdSaGRHVWcwSlRRc05HQzBMQmNjbHh1SUNBZ0lDQXFJRUJ5WlhSMWNtNGdlMEp2YjJ4bFlXNTlJQ0FnZEhKMVpTRFF0ZEdCMEx2UXVDRFF0TkMrMFlIUmd0R0QwTC9RdGRDOVhISmNiaUFnSUNBZ0tpOWNjbHh1SUNBZ0lIUm9hWE11WjJWMFJHRjVURzlqYTJWa0lEMGdablZ1WTNScGIyNG9aR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJQzh2SU5DeTBZdlFzZEMrMFlBZzBMVFFzTkdDSU5DeTBMM1F0U0RRdE5DKzBZSFJndEdEMEwvUXZkQyswTFBRdmlEUXROQzQwTERRdjlDdzBMZlF2dEM5MExCY2NseHVJQ0FnSUNBZ0lDQnBaaUFvWkdGMFpTQThJSFJvYVhNdWIzQjBhVzl1Y3k1dGFXNUVZWFJsSUh4OElHUmhkR1VnUGlCMGFHbHpMbTl3ZEdsdmJuTXViV0Y0UkdGMFpTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1RFOURTMTlWVGtGV1FVbE1RVUpNUlR0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCMGFHbHpMbTl3ZEdsdmJuTXVabWxzZEdWeUxteHZZMnRFWVhsekxtTmhiR3dvZEdocGN5d2daR0YwWlNrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUXBOQzQwTHZSak5HQzBZQWcwTDNRdGRDMDBMN1JnZEdDMFlQUXY5QzkwWXZSaFNEUXROQzkwTFhRdVNEUXY5QytJTkdEMEx6UXZ0QzcwWWZRc05DOTBMalJqbHh5WEc0Z0lDQWdJQ29nUUhKbGRIVnliaUI3UW05dmJHVmhibjFjY2x4dUlDQWdJQ0FxTDF4eVhHNGdJQ0FnZEdocGN5NWZabWxzZEdWeVRHOWphMFJoZVhNZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJQ0FnSUNBdkx5RFFzdEdCMExVZzBMVFF2ZEM0SU5DMDBMN1JnZEdDMFlQUXY5QzkwWXRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRFFvZEM2MEx2UXZ0QzkwTFhRdmRDNDBMVWdLREVnMExIUXZ0Q3gwWkhSZ0N3Z01pRFFzZEMrMExIUmdOQ3dMQ0ExSU5DeDBMN1FzZEdBMEw3UXNpbGNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQWdlMDUxYldKbGNuMGdkbUZzZFdVZzBKclF2dEM3MExqUmg5QzEwWUhSZ3RDeTBMNWNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQWdlMEZ5Y21GNWZTQWdabTl5YlhNZzBKelFzTkdCMFlIUXVOQ3lJTkM0MExjZ005R0ZJTkdOMEx2UXRkQzgwTFhRdmRHQzBMN1FzaXdnMEx6UXZ0QzIwTFhSZ2lEUmdkQyswTFRRdGRHQTBMYlFzTkdDMFl3ZzBZSFF2OUMxMFliUXVOR0UwTGpRdXRDdzBZTFF2dEdBSUNWa0lOQzAwTHZSanlEUXQ5Q3cwTHpRdGRDOTBZdGNjbHh1SUNBZ0lDQXFJRUJ5WlhSMWNtNGdlMU4wY21sdVozMWNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdkR2hwY3k1d2JIVnlZV3dnUFNCbWRXNWpkR2x2YmlBb2RtRnNkV1VzSUdadmNtMXpLU0I3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUNoMllXeDFaU0FsSURFd0lEMDlJREVnSmlZZ2RtRnNkV1VnSlNBeE1EQWdJVDBnTVRFZ1B5Qm1iM0p0YzFzd1hTQTZJQ2gyWVd4MVpTQWxJREV3SUQ0OUlESWdKaVlnZG1Gc2RXVWdKU0F4TUNBOFBTQTBJQ1ltSUNoMllXeDFaU0FsSURFd01DQThJREV3SUh4OElIWmhiSFZsSUNVZ01UQXdJRDQ5SURJd0tTQS9JR1p2Y20xeld6RmRJRG9nWm05eWJYTmJNbDBwS1M1eVpYQnNZV05sS0NjbFpDY3NJSFpoYkhWbEtUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlOQ3QwTHZRdGRDODBMWFF2ZEdDSU5DNjBMRFF1OUMxMEwzUXROQ3cwWURRdmRDKzBMUFF2aURRdE5DOTBZOWNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQWdlMFJoZEdWOUlHUmhkR1VnMEpUUXNOR0MwTEJjY2x4dUlDQWdJQ0FxSUVCeVpYUjFjbTRnZTBWc1pXMWxiblI5SUNBZ1NGUk5UQ0RSamRDNzBMWFF2TkMxMEwzUmdseHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TGw4a1oyVjBSR0Y1UW5sRVlYUmxJRDBnWm5WdVkzUnBiMjRvWkdGMFpTa2dlMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJSFJwYldVZ1BTQmtZWFJsSUdsdWMzUmhibU5sYjJZZ1JHRjBaU0EvSUdSaGRHVXVaMlYwVkdsdFpTZ3BJRG9nTUR0Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTVmSkcxdmJuUm9jeTV4ZFdWeWVWTmxiR1ZqZEc5eUtDY3VSR0Y1VzJSaGRHRXRkR2x0WlQxY0lpY2dLeUIwYVcxbElDc2dKMXdpWFNjcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBLRFF0ZEM5MExUUXRkR0FJTkMwMEwzUmp5QXRJTkMzMExEUXM5QzcwWVBSaU5DNjBMaGNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQWdlMFJoZEdWOUlHUmhkR1VnMEo3UXNkR0swTFhRdXRHQ0lOQzAwTERSZ3RHTFhISmNiaUFnSUNBZ0tpQkFjbVYwZFhKdUlIdEZiR1Z0Wlc1MGZWeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TGw4a1kzSmxZWFJsUlcxd2RIbEVZWGtnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQWtaR0Y1SUQwZ2RHaHBjeTVmSkdOeVpXRjBaVVZzWlcxbGJuUW9YSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHQThaR2wySUdOc1lYTnpQVndpUkdGNUlHbHpMV1Z0Y0hSNVhDSStQQzlrYVhZK1lGeHlYRzRnSUNBZ0lDQWdJQ2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQWtaR0Y1TzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHFLbHh5WEc0Z0lDQWdJQ29nMEtIUXZ0QzMwTFRRc05DOTBMalF0U0RSamRDNzBMWFF2TkMxMEwzUmd0Q3dJTkM0MExjZ1NGUk5UQ0RSZ3RDMTBMclJnZEdDMExCY2NseHVJQ0FnSUNBcUlFQndZWEpoYlNBZ2UxTjBjbWx1WjMwZ2FIUnRiQ0JJVkUxTUlOR0MwTFhRdXRHQjBZSmNjbHh1SUNBZ0lDQXFJRUJ5WlhSMWNtNGdlMFZzWlcxbGJuUjlYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVh5UmpjbVZoZEdWRmJHVnRaVzUwSUQwZ1puVnVZM1JwYjI0b2FIUnRiQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUdScGRpQTlJR1J2WTNWdFpXNTBMbU55WldGMFpVVnNaVzFsYm5Rb0oyUnBkaWNwTzF4eVhHNGdJQ0FnSUNBZ0lHUnBkaTVwYm5ObGNuUkJaR3BoWTJWdWRFaFVUVXdvSjJGbWRHVnlZbVZuYVc0bkxDQm9kRzFzS1R0Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1pHbDJMbU5vYVd4a2NtVnVMbXhsYm1kMGFDQStJREVnUHlCa2FYWXVZMmhwYkdSeVpXNGdPaUJrYVhZdVptbHljM1JGYkdWdFpXNTBRMmhwYkdRN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lCVFlXWmxJTkN5MFl2UXQ5QyswTElnMExMUXZkQzEwWWpRdmRDNDBZVWcwWUhRdnRDeDBZdlJndEM0MExrZzBMclF2dEM4MEwvUXZ0QzkwTFhRdmRHQzBMQmNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdVM1J5YVc1bmZTQm1JTkNZMEx6Ump5RFJnZEMrMExIUmk5R0MwTGpSajF4eVhHNGdJQ0FnSUNvdlhISmNiaUFnSUNCMGFHbHpMbDlqWVd4c1ltRmpheUE5SUdaMWJtTjBhVzl1S0dZcElIdGNjbHh1SUNBZ0lDQWdJQ0JwWmlBb2RIbHdaVzltSUhSb2FYTXViM0IwYVc5dWN5NXZibHRtWFNBOVBTQW5ablZ1WTNScGIyNG5LU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG05d2RHbHZibk11YjI1YlpsMHVZWEJ3Ykhrb2RHaHBjeXdnVzEwdWMyeHBZMlV1WTJGc2JDaGhjbWQxYldWdWRITXNJREVwS1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQjBhR2x6TG1sdWFYUW9LVHRjY2x4dWZWeHlYRzVjY2x4dVpYaHdiM0owSUdSbFptRjFiSFFnUkdGMFpWSmhibWRsVUdsamEyVnlPMXh5WEc0aVhTd2ljMjkxY21ObFVtOXZkQ0k2SWlKOSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgRGF0ZVJhbmdlUGlja2VyLCB7TE9DS19VTkFWQUlMQUJMRSwgTE9DS19MT0NLRUR9IGZyb20gJy4uLy4uL2Rpc3QvZGF0ZXJhbmdlcGlja2VyJztcclxuXHJcbmNvbnN0ICRmb3JtID0gZG9jdW1lbnQuZm9ybXNbMF07XHJcbmNvbnN0ICRkYXRlX2Zyb20gPSAkZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImRhdGVfZnJvbVwiXScpO1xyXG5jb25zdCAkZGF0ZV90byAgID0gJGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9XCJkYXRlX3RvXCJdJyk7XHJcblxyXG5mdW5jdGlvbiBpc01vYmlsZSgpIHtcclxuICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aCA8PSA5NjA7XHJcbn1cclxuXHJcbi8vINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvQtSDQtNCw0YLRi1xyXG5jb25zdCBibG9ja2VkRGF0ZXMgPSB7fTtcclxuY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbmRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbmZvciAobGV0IGkgPSAwOyBpIDwgNjA7ICsraSkge1xyXG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjYpIHtcclxuICAgICAgICBibG9ja2VkRGF0ZXNbZGF0ZV0gPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7XHJcbn1cclxuXHJcbm5ldyBEYXRlUmFuZ2VQaWNrZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RhdGVyYW5nZXBpY2tlcicpLCB7XHJcbiAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpLFxyXG4gICAgbWF4RGF0ZTogbmV3IERhdGUoJzIwMjItMDUtMjAnKSxcclxuICAgIG1vbnRoc0NvdW50OiBpc01vYmlsZSgpID8gMTIgOiAyLFxyXG4gICAgcGVyUm93OiAzLFxyXG4gICAgc2luZ2xlTW9kZTogZmFsc2UsXHJcbiAgICBvbjoge1xyXG4gICAgICAgIHJhbmdlU2VsZWN0OiBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgJGRhdGVfZnJvbS52YWx1ZSA9IGRhdGVfZnJvbS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICAgICAgJGRhdGVfdG8udmFsdWUgPSBkYXRlX3RvLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGF5U2VsZWN0OiBmdW5jdGlvbihkYXRlX2Zyb20pIHtcclxuICAgICAgICAgICAgJGRhdGVfZnJvbS52YWx1ZSA9IGRhdGVfZnJvbS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGZpbHRlcjoge1xyXG4gICAgICAgIGxvY2tEYXlzOiBmdW5jdGlvbihkYXkpIHtcclxuICAgICAgICAgICAgaWYgKGJsb2NrZWREYXRlc1tkYXldKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTE9DS19MT0NLRUQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRvb2x0aXBUZXh0OiBmdW5jdGlvbihkYXlzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5pZ2h0cyA9IGRheXMgLSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wbHVyYWwobmlnaHRzLCBbJyVkINC90L7Rh9GMJywgJyVkINC90L7Rh9C4JywgJyVkINC90L7Rh9C10LknXSkucmVwbGFjZSgnJWQnLCBuaWdodHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=