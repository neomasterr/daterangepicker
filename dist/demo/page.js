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
        lockDaysFilter:    options.lockDaysFilter    || undefined,  // callback(date) функция блокирования дат, true/LOCK
        on: Object.assign({
            rangeSelect: null, // событие выбора диапазона дат
            daySelect: null,   // событие выбора одной даты (только при singleMode: true)
        }, options.on || {}),
    }

    // рядность
    if (typeof this.options.perRow == 'undefined') {
        this.options.perRow = this.options.monthsCount;
    }

    if (this.options.minDate) {
        this.options.minDate.setHours(0, 0, 0, 0);
    }

    /**
     * Инициализация
     */
    this.init = function() {
        // текущий день
        this._today = new Date();
        this._today.setHours(0, 0, 0, 0);

        this._$picker = this._$createElement(
            `<div class="Daterangepicker">
                <div class="Daterangepicker__months"></div>
            </div>`
        );

        // элементы
        this._$months = this._$picker.querySelector('.Daterangepicker__months');

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

        // выбор дат в обратном порядке
        if (date_from > date_to) {
            [date_from, date_to] = [date_to, date_from];
        }

        const time_from = date_from instanceof Date ? date_from.getTime() : 0;
        const time_to = date_to instanceof Date ? date_to.getTime() : 0;
        const $days = this._$months.querySelectorAll('.Day[data-time]');

        // выделение дат между начальной и конечной
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

        let $day_from, $day_to;

        // выбор дат в обратном порядке
        if (date_from > date_to) {
            [date_from, date_to] = [date_to, date_from];
            $day_from = this._$getDayByDate(date_from);
            $day_to = this._$getDayByDate(date_to);
        }

        if ($day_from) {
            $day_from.classList.add('is-selected', 'is-selected-from');
        }

        if ($day_to) {
            $day_to.classList.add('is-selected', 'is-selected-to');
        }

        // выделение элементов
        this._rangeVisualSelect(date_from, date_to);

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

        if (this.options.lockDaysFilter) {
            return this.options.lockDaysFilter(date);
        }

        return false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9zY3NzL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOztVQ1ZBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDTztBQUNBOztBQUVQLGlEQUFpRDtBQUNqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsa0JBQWtCO0FBQzNCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFF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S0FBSztBQUNyQixnQkFBZ0IsUUFBUTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixLQUFLO0FBQ3JCLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixLQUFLO0FBQ3JCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixPQUFPO0FBQ3ZCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpRUFBZSxlQUFlLEVBQUMiLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJEYXRlcmFuZ2VwaWNrZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8g0YHQvtGB0YLQvtGP0L3QuNGPINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuZXhwb3J0IGNvbnN0IExPQ0tfVU5BVkFJTEFCTEUgPSAxO1xyXG5leHBvcnQgY29uc3QgTE9DS19MT0NLRUQgICAgICA9IDI7XHJcblxyXG5mdW5jdGlvbiBEYXRlUmFuZ2VQaWNrZXIoJGNvbnRhaW5lciwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICB0aGlzLl8kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgZmlyc3REYXlPZlRoZVdlZWs6IG9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgfHwgMSwgICAgICAgICAgLy8g0L/QtdGA0LLRi9C5INC00LXQvdGMINC90LXQtNC10LvQuCwgMCA9INCy0YEsIDEgPSDQv9C9LCAuLi5cclxuICAgICAgICBzaW5nbGVNb2RlOiAgICAgICAgb3B0aW9ucy5zaW5nbGVNb2RlICAgICAgICB8fCBmYWxzZSwgICAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0Ysg0LLQvNC10YHRgtC+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgIGxvY2FsZTogICAgICAgICAgICBvcHRpb25zLmxvY2FsZSAgICAgICAgICAgIHx8ICdydS1SVScsXHJcbiAgICAgICAgbWluRGF5czogICAgICAgICAgIG9wdGlvbnMubWluRGF5cyAgICAgICAgICAgfHwgMSwgICAgICAgICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuSDQsiDQtNC40LDQv9Cw0LfQvtC90LVcclxuICAgICAgICBtb250aHNDb3VudDogICAgICAgb3B0aW9ucy5tb250aHNDb3VudCAgICAgICB8fCAxMixcclxuICAgICAgICBwZXJSb3c6ICAgICAgICAgICAgb3B0aW9ucy5wZXJSb3cgICAgICAgICAgICB8fCB1bmRlZmluZWQsICAvLyDQutC+0LvQuNGH0LXRgdGC0LLQviDQvNC10YHRj9GG0LXQsiDQsiDRgNGP0LTRg1xyXG4gICAgICAgIG1pbkRhdGU6ICAgICAgICAgICBvcHRpb25zLm1pbkRhdGUgICAgICAgICAgIHx8IG5ldyBEYXRlKCksIC8vINC80LjQvdC40LzQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAgICBtYXhEYXRlOiAgICAgICAgICAgb3B0aW9ucy5tYXhEYXRlICAgICAgICAgICB8fCB1bmRlZmluZWQsXHJcbiAgICAgICAgbG9ja0RheXNGaWx0ZXI6ICAgIG9wdGlvbnMubG9ja0RheXNGaWx0ZXIgICAgfHwgdW5kZWZpbmVkLCAgLy8gY2FsbGJhY2soZGF0ZSkg0YTRg9C90LrRhtC40Y8g0LHQu9C+0LrQuNGA0L7QstCw0L3QuNGPINC00LDRgiwgdHJ1ZS9MT0NLXHJcbiAgICAgICAgb246IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICByYW5nZVNlbGVjdDogbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICAgICAgICAgICAgZGF5U2VsZWN0OiBudWxsLCAgIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQvtC00L3QvtC5INC00LDRgtGLICjRgtC+0LvRjNC60L4g0L/RgNC4IHNpbmdsZU1vZGU6IHRydWUpXHJcbiAgICAgICAgfSwgb3B0aW9ucy5vbiB8fCB7fSksXHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YDRj9C00L3QvtGB0YLRjFxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGVyUm93ID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnBlclJvdyA9IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMubWluRGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPXHJcbiAgICAgKi9cclxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vINGC0LXQutGD0YnQuNC5INC00LXQvdGMXHJcbiAgICAgICAgdGhpcy5fdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuX3RvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICB0aGlzLl8kcGlja2VyID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX19tb250aHNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vINGN0LvQtdC80LXQvdGC0YtcclxuICAgICAgICB0aGlzLl8kbW9udGhzID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX19tb250aHMnKTtcclxuXHJcbiAgICAgICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcblxyXG4gICAgICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgICAgIHRoaXMuXyRjcmVhdGVNb250aHModGhpcy5vcHRpb25zLm1pbkRhdGUpO1xyXG4gICAgICAgIHRoaXMuXyRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fJHBpY2tlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQndCw0LfQstCw0L3QuNC1INC80LXRgdGP0YbQsFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXRNb250aEZvcm1hdHRlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge21vbnRoOiAnbG9uZyd9KTtcclxuICAgICAgICByZXR1cm4gdGl0bGUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKSArIHRpdGxlLnNsaWNlKDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90LjQtSDQtNCw0YLRiyDQtNC70Y8g0YLQtdC60YPRidC10Lkg0LvQvtC60LDQu9C4XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMg0J/QsNGA0LDQvNC10YLRgNGLXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQgPSBmdW5jdGlvbihkYXRlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIEludGwuRGF0ZVRpbWVGb3JtYXQodGhpcy5vcHRpb25zLmxvY2FsZSwgb3B0aW9ucykuZm9ybWF0KGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQvdC4INC90LXQtNC10LvQuFxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldFdlZWtEYXlzRm9ybWF0dGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIDIpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgKytpKSB7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBkYXk6IGRhdGUuZ2V0RGF5KCksXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7d2Vla2RheTogJ3Nob3J0J30pLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINGB0L7Qs9C70LDRgdC90L4g0L3QsNGB0YLRgNC+0LXQvdC90L7QvNGDINC/0LXRgNCy0L7QvNGDINC00L3RjiDQvdC10LTQtdC70LhcclxuICAgICAgICByZXN1bHQuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmaXJzdERheU9mVGhlV2VlayA9IHRoaXMub3B0aW9ucy5maXJzdERheU9mVGhlV2VlayAlIDc7XHJcbiAgICAgICAgICAgIGxldCBkYXlBID0gYS5kYXk7XHJcbiAgICAgICAgICAgIGxldCBkYXlCID0gYi5kYXk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF5QSA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF5QiA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkYXlBIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIGRheUEgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRheUIgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICAgICAgZGF5QiArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGF5QSAtIGRheUI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuSDQsiDQvNC10YHRj9GG0LVcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0RGF5c0NvdW50SW5Nb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgZGF5cy5zZXRNb250aChkYXlzLmdldE1vbnRoKCkgKyAxKTtcclxuICAgICAgICBkYXlzLnNldERhdGUoMCk7XHJcbiAgICAgICAgcmV0dXJuIGRheXMuZ2V0RGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC00LjQsNC/0LDQt9C+0L3QsCDQvNC10YHRj9GG0LXQslxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVNb250aHMgPSBmdW5jdGlvbihkYXRlX2Zyb20pIHtcclxuICAgICAgICB3aGlsZSAodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRtb250aHMucmVtb3ZlQ2hpbGQodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC/0YDQtdGA0LXQvdC00LXRgCDQvNC10YHRj9GG0LXQslxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoZGF0ZV9mcm9tLmdldFRpbWUoKSk7XHJcbiAgICAgICAgY29uc3QgJG1vbnRocyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50OyArK2kpIHtcclxuICAgICAgICAgICAgJG1vbnRocy5wdXNoKHRoaXMuXyRjcmVhdGVNb250aChjdXJyZW50RGF0ZSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50RGF0ZS5zZXRNb250aChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDRgNC10L3QtNC10YBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRtb250aHMubGVuZ3RoOyBpICs9IHRoaXMub3B0aW9ucy5wZXJSb3cpIHtcclxuICAgICAgICAgICAgY29uc3QgJHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAkcm93LmNsYXNzTmFtZSA9ICdEYXRlcmFuZ2VwaWNrZXJfX3Jvdyc7XHJcblxyXG4gICAgICAgICAgICAkbW9udGhzLnNsaWNlKGksIGkgKyB0aGlzLm9wdGlvbnMucGVyUm93KS5mb3JFYWNoKCRtb250aCA9PiB7XHJcbiAgICAgICAgICAgICAgICAkcm93LmFwcGVuZENoaWxkKCRtb250aCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fJG1vbnRocy5hcHBlbmRDaGlsZCgkcm93KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb24gJiYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10L3QtNC10YAg0LzQtdGB0Y/RhtCwXHJcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGUg0JzQtdGB0Y/RhlxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudE1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xyXG4gICAgICAgIGNvbnN0IG1vbnRoVGl0bGUgPSB0aGlzLmdldE1vbnRoRm9ybWF0dGVkKGRhdGUpO1xyXG4gICAgICAgIGNvbnN0IHdlZWtEYXlzID0gdGhpcy5nZXRXZWVrRGF5c0Zvcm1hdHRlZCgpO1xyXG5cclxuICAgICAgICBjb25zdCAkbW9udGggPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJNb250aFwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2hlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fYXJyb3cgTW9udGhfX2Fycm93LS1wcmV2JHsodGhpcy5vcHRpb25zLm1pbkRhdGUgJiYgZGF0ZSA8PSB0aGlzLm9wdGlvbnMubWluRGF0ZSkgPyAnIGlzLWRpc2FibGVkJyA6ICcnfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTcgMTNMMSA3TDcgMVwiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX3RpdGxlXCI+JHttb250aFRpdGxlfSAke2RhdGUuZ2V0RnVsbFllYXIoKX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tbmV4dCR7KHRoaXMub3B0aW9ucy5tYXhEYXRlICYmIGRhdGUgPj0gdGhpcy5vcHRpb25zLm1heERhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xIDAuOTk5OTk5TDcgN0wxIDEzXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtcIj4ke3dlZWtEYXlzLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla2RheVwiPiR7aXRlbS50aXRsZX08L2Rpdj5gXHJcbiAgICAgICAgICAgICAgICB9KS5qb2luKCcnKX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fZGF5c1wiPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8g0YHRgtGA0LXQu9C60LhcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIHtzZWxlY3RvcjogJy5Nb250aF9fYXJyb3ctLXByZXYnLCBuYW1lOiAncHJldid9LFxyXG4gICAgICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1uZXh0JywgbmFtZTogJ25leHQnfSxcclxuICAgICAgICBdLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRhcnJvdyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKGl0ZW0uc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICAkYXJyb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uQXJyb3dDbGljaygkYXJyb3csIGl0ZW0ubmFtZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDRgNC10L3QtNC10YAg0LTQvdC10LlcclxuICAgICAgICBjb25zdCAkZGF5cyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKCcuTW9udGhfX2RheXMnKTtcclxuICAgICAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGRheXMuc2V0RGF0ZSgxKTtcclxuICAgICAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICB3aGlsZSAoZGF5cy5nZXRNb250aCgpID09IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgICAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVXZWVrKCk7XHJcblxyXG4gICAgICAgICAgICB3ZWVrRGF5cy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRheXMuZ2V0RGF5KCkgIT0gaXRlbS5kYXkgfHwgZGF5cy5nZXRNb250aCgpICE9IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVFbXB0eURheSgpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZURheShkYXlzKSk7XHJcbiAgICAgICAgICAgICAgICBkYXlzLnNldERhdGUoZGF5cy5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkZGF5cy5hcHBlbmRDaGlsZCgkd2Vlayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gJG1vbnRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQu9C40Log0L/QviDRgdGC0YDQtdC70LrQtSDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y8g0LzQtdGB0Y/RhtCwXHJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRhcnJvdyBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAgICDQmNC80Y8gKHByZXYsIG5leHQpXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uQXJyb3dDbGljayA9IGZ1bmN0aW9uKCRhcnJvdywgbmFtZSkge1xyXG4gICAgICAgIGlmICgkYXJyb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShwYXJzZUludCh0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aCcpLmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgICAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIChuYW1lID09ICdwcmV2JyA/IC10aGlzLm9wdGlvbnMubW9udGhzQ291bnQgOiB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpKTtcclxuXHJcbiAgICAgICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LjQvdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgICAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlKSB7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWluRGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LDQutGB0LjQvNCw0LvRjNC90L7QuSDQtNCw0YLRi1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBlbmREYXRlID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgICBlbmREYXRlLnNldE1vbnRoKGVuZERhdGUuZ2V0TW9udGgoKSArIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCk7XHJcbiAgICAgICAgICAgIGlmIChlbmREYXRlID4gdGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICAgICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWF4RGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgICAgICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgLSB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fJGNyZWF0ZU1vbnRocyhkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQvdC00LXRgCDQvdC10LTQtdC70LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlV2VlayA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgICAgICBgPGRpdiBjbGFzcz1cIldlZWtcIj48L2Rpdj5gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICR3ZWVrO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC00L3Rj1xyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVEYXkgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgbG9ja2VkID0gdGhpcy5nZXREYXlMb2NrZWQoZGF0ZSk7XHJcbiAgICAgICAgY29uc3QgdG9kYXkgID0gdGhpcy5fdG9kYXkuZ2V0VGltZSgpID09IGRhdGUuZ2V0VGltZSgpO1xyXG5cclxuICAgICAgICBsZXQgY2xhc3NOYW1lID0gJyc7XHJcbiAgICAgICAgY2xhc3NOYW1lICs9IGxvY2tlZCA/ICcgaXMtZGlzYWJsZWQnIDogJyc7XHJcbiAgICAgICAgY2xhc3NOYW1lICs9IGxvY2tlZCA9PSBMT0NLX0xPQ0tFRCA/ICcgaXMtbG9ja2VkJyA6ICcnO1xyXG4gICAgICAgIGNsYXNzTmFtZSArPSB0b2RheSA/ICcgaXMtdG9kYXknIDogJyc7XHJcblxyXG4gICAgICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXkke2NsYXNzTmFtZX1cIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiIGRhdGEtZGF5PVwiJHtkYXRlLmdldERheSgpfVwiPiR7ZGF0ZS5nZXREYXRlKCl9PC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkRheUNsaWNrRXZlbnQuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICAgICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5fb25EYXlNb3VzZUVudGVyRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gJGRheTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC60LvQuNC60LAg0L/QviDQtNC90Y5cclxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5Q2xpY2tFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB0aGlzLl9vbkRheUNsaWNrKGUudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INGF0L7QstC10YDQsFxyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICAgICAqL1xyXG4gICAgdGhpcy5fb25EYXlNb3VzZUVudGVyRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdGhpcy5fb25EYXlNb3VzZUVudGVyKGUudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCl0L7QstC10YAg0L3QsCDRjdC70LXQvNC10L3RgtC1INC00L3Rj1xyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5fb25EYXlNb3VzZUVudGVyID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGRheS5kYXRhc2V0LnRpbWUgPT0gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbS5nZXRUaW1lKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG5cclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0LvQuNC6INC/0L4g0LTQvdGOXHJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheUNsaWNrID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgICAgIC8vINC00LXQvdGMINC30LDQsdC70L7QutC40YDQvtCy0LDQvVxyXG4gICAgICAgIGlmICgkZGF5LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0YtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2soJ2RheVNlbGVjdCcsIG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YHQsdGA0L7RgSDQstGL0LHRgNCw0L3QvdC+0LPQviDRgNCw0L3QtdC1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG5cclxuICAgICAgICAvLyDQstGL0LHRgNCw0L3QsCDQvdCw0YfQsNC70YzQvdCw0Y8gLyDQutC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAgICAgICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAgICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5yYW5nZVNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxSZXNldCgpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQuNC30YPQsNC70YzQvdGL0Lkg0YHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgICAgICAkZGF5cy5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgICAgICAkZGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nLCAnaXMtc2VsZWN0ZWQtdG8nLCAnaXMtc2VsZWN0ZWQtYmV0d2VlbicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQuNC30YPQsNC70YzQvdC+0LUg0LLRi9C00LXQu9C10L3QuNC1INC00LDRglxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICAgICAgaWYgKGRhdGVfZnJvbSAmJiBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXRlX3RvICYmIGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1XHJcbiAgICAgICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRpbWVfZnJvbSA9IGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX2Zyb20uZ2V0VGltZSgpIDogMDtcclxuICAgICAgICBjb25zdCB0aW1lX3RvID0gZGF0ZV90byBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX3RvLmdldFRpbWUoKSA6IDA7XHJcbiAgICAgICAgY29uc3QgJGRheXMgPSB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpO1xyXG5cclxuICAgICAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCINC80LXQttC00YMg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0LlcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRkYXlzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICRkYXlzW2ldLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXNlbGVjdGVkLWJldHdlZW4nLCAkZGF5c1tpXS5kYXRhc2V0LnRpbWUgPiB0aW1lX2Zyb20gJiYgJGRheXNbaV0uZGF0YXNldC50aW1lIDwgdGltZV90byk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0Lkg0L/QvtC30LjRhtC40LhcclxuICAgICAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICAgICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICAgICAgaWYgKHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCAhPSAkZGF5X2Zyb20pIHtcclxuICAgICAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAhPSAkZGF5X3RvKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDRgdC+0YXRgNCw0L3QtdC90LjQtSDQsiDQutC10YhcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkID0gJGRheV9mcm9tO1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkID0gJGRheV90bztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0YvQtNC10LvQtdC90LjQtSDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqL1xyXG4gICAgdGhpcy5yYW5nZVNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICAvLyDQtNC+0L/Rg9GB0YLQuNC80YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICAgICAgaWYgKCF0aGlzLmdldElzUmFuZ2VTZWxlY3RhYmxlKGRhdGVfZnJvbSwgZGF0ZV90bykpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0ICRkYXlfZnJvbSwgJGRheV90bztcclxuXHJcbiAgICAgICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LIg0L7QsdGA0LDRgtC90L7QvCDQv9C+0YDRj9C00LrQtVxyXG4gICAgICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICAgICAgICAgICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgICAgICAgICAgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QoZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuXHJcbiAgICAgICAgLy8g0YHQvtCx0YvRgtC40LVcclxuICAgICAgICB0aGlzLl9jYWxsYmFjaygncmFuZ2VTZWxlY3QnLCBkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC+0LLQtdGA0LrQsCDQstC+0LfQvNC+0LbQvdC+0YHRgtC4INCy0YvQtNC10LvQtdC90LjRjyDQtNCw0YJcclxuICAgICAqIEBwYXJhbSAge0RhdGUgZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICogQHBhcmFtICB7RGF0ZSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZSA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IE1hdGguYWJzKGRhdGVfZnJvbS5nZXRUaW1lKCkgLSBkYXRlX3RvLmdldFRpbWUoKSkgLyAxMDAwIC8gODY0MDA7XHJcbiAgICAgICAgaWYgKGRpZmYgPCB0aGlzLm9wdGlvbnMubWluRGF5cykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQv9GA0L7QstC10YDQutCwINC/0L7Qv9Cw0LTQsNC90LjRjyDQsiDQtNC40LDQv9Cw0LfQvtC9INC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuICAgICAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGRheS5zZXRUaW1lKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG5cclxuICAgICAgICB3aGlsZSAoZGF5IDwgZGF0ZV90bykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXREYXlMb2NrZWQoZGF5KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkYXkuc2V0RGF0ZShkYXkuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0L3QsCDQtNC+0YHRgtGD0L/QvdC+0YHRgtGMINC00L3RjyDQtNC70Y8g0LHRgNC+0L3QuFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gICB0cnVlINC10YHQu9C4INC00L7RgdGC0YPQv9C10L1cclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXREYXlMb2NrZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LLQvdC1INC00L7RgdGC0YPQv9C90L7Qs9C+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUgfHwgZGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBMT0NLX1VOQVZBSUxBQkxFO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sb2NrRGF5c0ZpbHRlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmxvY2tEYXlzRmlsdGVyKGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0K3Qu9C10LzQtdC90YIg0LrQsNC70LXQvdC00LDRgNC90L7Qs9C+INC00L3Rj1xyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gICAgICogQHJldHVybiB7RWxlbWVudH0gICBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRnZXREYXlCeURhdGUgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgdGltZSA9IGRhdGUgaW5zdGFuY2VvZiBEYXRlID8gZGF0ZS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5EYXlbZGF0YS10aW1lPVwiJyArIHRpbWUgKyAnXCJdJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10L3QtNC10YAg0LTQvdGPIC0g0LfQsNCz0LvRg9GI0LrQuFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVFbXB0eURheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXkgaXMtZW1wdHlcIj48L2Rpdj5gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICRkYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LfQtNCw0L3QuNC1INGN0LvQtdC80LXQvdGC0LAg0LjQtyBIVE1MINGC0LXQutGB0YLQsFxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBodG1sIEhUTUwg0YLQtdC60YHRglxyXG4gICAgICogQHJldHVybiB7RWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XHJcbiAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGh0bWwpO1xyXG4gICAgICAgIHJldHVybiBkaXYuY2hpbGRyZW4ubGVuZ3RoID4gMSA/IGRpdi5jaGlsZHJlbiA6IGRpdi5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNhZmUg0LLRi9C30L7QsiDQstC90LXRiNC90LjRhSDRgdC+0LHRi9GC0LjQuSDQutC+0LzQv9C+0L3QtdC90YLQsFxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGYg0JjQvNGPINGB0L7QsdGL0YLQuNGPXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX2NhbGxiYWNrID0gZnVuY3Rpb24oZikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uW2ZdID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vbltmXS5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEYXRlUmFuZ2VQaWNrZXI7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=

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
    lockDaysFilter: function(day) {
        if (blockedDates[day]) {
            return _dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0__.LOCK_LOCKED;
        }

        return false;
    }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9kaXN0L2RhdGVyYW5nZXBpY2tlci5qcyIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2RlbW8vcGFnZS5zY3NzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9kZW1vL3BhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJLElBQXlEO0FBQzdEO0FBQ0EsTUFBTSxFQUtnQztBQUN0QyxDQUFDO0FBQ0Qsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQSxjQUFjLDhCQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxnQkFBZ0IsOEJBQW1CLHdCQUF3Qiw4QkFBbUI7QUFDOUUsbURBQW1ELHlDQUF5QztBQUM1RjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxpRUFBaUUsa0JBQWtCO0FBQ25GO0FBQ0EsMERBQTBELGNBQWM7QUFDeEU7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQW1CO0FBQ25COztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUFtQjtBQUNuQixxQkFBcUIsOEJBQW1CO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7O0FBRUEsaURBQWlEO0FBQ2pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxrQkFBa0I7QUFDM0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsS0FBSztBQUNyQixnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBLG9EQUFvRCxjQUFjO0FBQ2xFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixLQUFLO0FBQ3JCLGdCQUFnQixPQUFPO0FBQ3ZCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0E7QUFDQSxxREFBcUQsaUJBQWlCO0FBQ3RFLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLEtBQUs7QUFDckIsZ0JBQWdCLE9BQU87QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxLQUFLO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLDhCQUE4QjtBQUNyRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsb0JBQW9CO0FBQzNDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxLQUFLO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2Q0FBNkMsZUFBZTtBQUM1RDtBQUNBLGlFQUFpRSw2RUFBNkU7QUFDOUk7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsV0FBVyxHQUFHLG1CQUFtQjtBQUNqRixpRUFBaUUsNkVBQTZFO0FBQzlJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkM7QUFDM0MsMERBQTBELFdBQVc7QUFDckUsaUJBQWlCLFdBQVc7QUFDNUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLDhDQUE4QztBQUMzRCxhQUFhLDhDQUE4QztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixLQUFLO0FBQ3JCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixLQUFLO0FBQ3JCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhCQUE4QixVQUFVLGVBQWUsZUFBZSxjQUFjLGNBQWMsSUFBSSxlQUFlO0FBQ3JIOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE1BQU07QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsTUFBTTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxLQUFLO0FBQ3BCLGVBQWUsS0FBSztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsa0JBQWtCO0FBQ3pDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsS0FBSztBQUNwQixlQUFlLEtBQUs7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQixnQkFBZ0I7QUFDaEIsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixLQUFLO0FBQ3JCLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLEtBQUs7QUFDckIsZ0JBQWdCLFFBQVE7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLEtBQUs7QUFDckIsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLE9BQU87QUFDdkIsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLENBQUM7O0FBRUQ7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxDQUFDO0FBQ0QsMkNBQTJDLGNBQWMsMnNvQzs7Ozs7O1VDaHFCekQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGdDQUFnQyxZQUFZO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7OztBQ0F5RDtBQUNnQjs7QUFFekU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUksOERBQWU7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQSxtQkFBbUIsOERBQVc7QUFDOUI7O0FBRUE7QUFDQTtBQUNBLENBQUMiLCJmaWxlIjoiLi9kZW1vL3BhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkRhdGVyYW5nZXBpY2tlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKCgpID0+IHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHRcInVzZSBzdHJpY3RcIjtcbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgc2NvcGVcbi8qKioqKiovIFx0dmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcbi8qKioqKiovIFx0XHRcdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcbi8qKioqKiovIFx0XHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKVxuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuLyoqKioqKi8gXHRcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4vKioqKioqLyBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuLy8gVGhpcyBlbnRyeSBuZWVkIHRvIGJlIHdyYXBwZWQgaW4gYW4gSUlGRSBiZWNhdXNlIGl0IG5lZWQgdG8gYmUgaXNvbGF0ZWQgYWdhaW5zdCBvdGhlciBlbnRyeSBtb2R1bGVzLlxuKCgpID0+IHtcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9zY3NzL2luZGV4LnNjc3MgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5cbn0pKCk7XG5cbi8vIFRoaXMgZW50cnkgbmVlZCB0byBiZSB3cmFwcGVkIGluIGFuIElJRkUgYmVjYXVzZSBpdCBuZWVkIHRvIGJlIGlzb2xhdGVkIGFnYWluc3Qgb3RoZXIgZW50cnkgbW9kdWxlcy5cbigoKSA9PiB7XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL2pzL2luZGV4LmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqL1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLyogaGFybW9ueSBleHBvcnQgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIHtcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJMT0NLX1VOQVZBSUxBQkxFXCI6ICgpID0+ICgvKiBiaW5kaW5nICovIExPQ0tfVU5BVkFJTEFCTEUpLFxuLyogaGFybW9ueSBleHBvcnQgKi8gICBcIkxPQ0tfTE9DS0VEXCI6ICgpID0+ICgvKiBiaW5kaW5nICovIExPQ0tfTE9DS0VEKSxcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJkZWZhdWx0XCI6ICgpID0+IChfX1dFQlBBQ0tfREVGQVVMVF9FWFBPUlRfXylcbi8qIGhhcm1vbnkgZXhwb3J0ICovIH0pO1xuLy8g0YHQvtGB0YLQvtGP0L3QuNGPINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuY29uc3QgTE9DS19VTkFWQUlMQUJMRSA9IDE7XHJcbmNvbnN0IExPQ0tfTE9DS0VEICAgICAgPSAyO1xyXG5cclxuZnVuY3Rpb24gRGF0ZVJhbmdlUGlja2VyKCRjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgdGhpcy5fJGNvbnRhaW5lciA9ICRjb250YWluZXI7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgIGZpcnN0RGF5T2ZUaGVXZWVrOiBvcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrIHx8IDEsICAgICAgICAgIC8vINC/0LXRgNCy0YvQuSDQtNC10L3RjCDQvdC10LTQtdC70LgsIDAgPSDQstGBLCAxID0g0L/QvSwgLi4uXHJcbiAgICAgICAgc2luZ2xlTW9kZTogICAgICAgIG9wdGlvbnMuc2luZ2xlTW9kZSAgICAgICAgfHwgZmFsc2UsICAgICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLINCy0LzQtdGB0YLQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBsb2NhbGU6ICAgICAgICAgICAgb3B0aW9ucy5sb2NhbGUgICAgICAgICAgICB8fCAncnUtUlUnLFxyXG4gICAgICAgIG1pbkRheXM6ICAgICAgICAgICBvcHRpb25zLm1pbkRheXMgICAgICAgICAgIHx8IDEsICAgICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LTQuNCw0L/QsNC30L7QvdC1XHJcbiAgICAgICAgbW9udGhzQ291bnQ6ICAgICAgIG9wdGlvbnMubW9udGhzQ291bnQgICAgICAgfHwgMTIsXHJcbiAgICAgICAgcGVyUm93OiAgICAgICAgICAgIG9wdGlvbnMucGVyUm93ICAgICAgICAgICAgfHwgdW5kZWZpbmVkLCAgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LzQtdGB0Y/RhtC10LIg0LIg0YDRj9C00YNcclxuICAgICAgICBtaW5EYXRlOiAgICAgICAgICAgb3B0aW9ucy5taW5EYXRlICAgICAgICAgICB8fCBuZXcgRGF0ZSgpLCAvLyDQvNC40L3QuNC80LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgICAgbWF4RGF0ZTogICAgICAgICAgIG9wdGlvbnMubWF4RGF0ZSAgICAgICAgICAgfHwgdW5kZWZpbmVkLFxyXG4gICAgICAgIGxvY2tEYXlzRmlsdGVyOiAgICBvcHRpb25zLmxvY2tEYXlzRmlsdGVyICAgIHx8IHVuZGVmaW5lZCwgIC8vIGNhbGxiYWNrKGRhdGUpINGE0YPQvdC60YbQuNGPINCx0LvQvtC60LjRgNC+0LLQsNC90LjRjyDQtNCw0YIsIHRydWUvTE9DS1xyXG4gICAgICAgIG9uOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgcmFuZ2VTZWxlY3Q6IG51bGwsIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAgICAgICAgICAgIGRheVNlbGVjdDogbnVsbCwgICAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0L7QtNC90L7QuSDQtNCw0YLRiyAo0YLQvtC70YzQutC+INC/0YDQuCBzaW5nbGVNb2RlOiB0cnVlKVxyXG4gICAgICAgIH0sIG9wdGlvbnMub24gfHwge30pLFxyXG4gICAgfVxyXG5cclxuICAgIC8vINGA0Y/QtNC90L7RgdGC0YxcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnBlclJvdyA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5wZXJSb3cgPSB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5taW5EYXRlKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLm1pbkRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRj1xyXG4gICAgICovXHJcbiAgICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDRgtC10LrRg9GJ0LjQuSDQtNC10L3RjFxyXG4gICAgICAgIHRoaXMuX3RvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICB0aGlzLl90b2RheS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5fJHBpY2tlciA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyDRjdC70LXQvNC10L3RgtGLXHJcbiAgICAgICAgdGhpcy5fJG1vbnRocyA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzJyk7XHJcblxyXG4gICAgICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG5cclxuICAgICAgICAvLyDRgNC10L3QtNC10YBcclxuICAgICAgICB0aGlzLl8kY3JlYXRlTW9udGhzKHRoaXMub3B0aW9ucy5taW5EYXRlKTtcclxuICAgICAgICB0aGlzLl8kY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuXyRwaWNrZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J3QsNC30LLQsNC90LjQtSDQvNC10YHRj9GG0LBcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0TW9udGhGb3JtYXR0ZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHttb250aDogJ2xvbmcnfSk7XHJcbiAgICAgICAgcmV0dXJuIHRpdGxlLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aXRsZS5zbGljZSgxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0Ysg0LTQu9GPINGC0LXQutGD0YnQtdC5INC70L7QutCw0LvQuFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAgINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zINCf0LDRgNCw0LzQtdGC0YDRi1xyXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldERhdGVUaW1lRm9ybWF0ID0gZnVuY3Rpb24oZGF0ZSwgb3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMub3B0aW9ucy5sb2NhbGUsIG9wdGlvbnMpLmZvcm1hdChkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0L3QuCDQvdC10LTQtdC70LhcclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXRXZWVrRGF5c0Zvcm1hdHRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAyKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7ICsraSkge1xyXG4gICAgICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgZGF5OiBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge3dlZWtkYXk6ICdzaG9ydCd9KSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDRgdC+0YDRgtC40YDQvtCy0LrQsCDRgdC+0LPQu9Cw0YHQvdC+INC90LDRgdGC0YDQvtC10L3QvdC+0LzRgyDQv9C10YDQstC+0LzRgyDQtNC90Y4g0L3QtdC00LXQu9C4XHJcbiAgICAgICAgcmVzdWx0LnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZmlyc3REYXlPZlRoZVdlZWsgPSB0aGlzLm9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgJSA3O1xyXG4gICAgICAgICAgICBsZXQgZGF5QSA9IGEuZGF5O1xyXG4gICAgICAgICAgICBsZXQgZGF5QiA9IGIuZGF5O1xyXG5cclxuICAgICAgICAgICAgaWYgKGRheUEgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRheUIgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF5QSA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgICAgICBkYXlBICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkYXlCIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIGRheUIgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRheUEgLSBkYXlCO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LzQtdGB0Y/RhtC1XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7TnVtYmVyfSAgICDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldERheXNDb3VudEluTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIGRheXMuc2V0TW9udGgoZGF5cy5nZXRNb250aCgpICsgMSk7XHJcbiAgICAgICAgZGF5cy5zZXREYXRlKDApO1xyXG4gICAgICAgIHJldHVybiBkYXlzLmdldERhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQvdC00LXRgCDQtNC40LDQv9Cw0LfQvtC90LAg0LzQtdGB0Y/RhtC10LJcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGhzID0gZnVuY3Rpb24oZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCkge1xyXG4gICAgICAgICAgICB0aGlzLl8kbW9udGhzLnJlbW92ZUNoaWxkKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQv9GA0LXRgNC10L3QtNC10YAg0LzQtdGB0Y/RhtC10LJcclxuICAgICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGNvbnN0ICRtb250aHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgICRtb250aHMucHVzaCh0aGlzLl8kY3JlYXRlTW9udGgoY3VycmVudERhdGUpKTtcclxuICAgICAgICAgICAgY3VycmVudERhdGUuc2V0TW9udGgoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkbW9udGhzLmxlbmd0aDsgaSArPSB0aGlzLm9wdGlvbnMucGVyUm93KSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnRGF0ZXJhbmdlcGlja2VyX19yb3cnO1xyXG5cclxuICAgICAgICAgICAgJG1vbnRocy5zbGljZShpLCBpICsgdGhpcy5vcHRpb25zLnBlclJvdykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgICAgICAgICAgJHJvdy5hcHBlbmRDaGlsZCgkbW9udGgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuXyRtb250aHMuYXBwZW5kQ2hpbGQoJHJvdyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0aW9uICYmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC80LXRgdGP0YbQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlINCc0LXRgdGP0YZcclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgICAgICBjb25zdCBtb250aFRpdGxlID0gdGhpcy5nZXRNb250aEZvcm1hdHRlZChkYXRlKTtcclxuICAgICAgICBjb25zdCB3ZWVrRGF5cyA9IHRoaXMuZ2V0V2Vla0RheXNGb3JtYXR0ZWQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgJG1vbnRoID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiTW9udGhcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tcHJldiR7KHRoaXMub3B0aW9ucy5taW5EYXRlICYmIGRhdGUgPD0gdGhpcy5vcHRpb25zLm1pbkRhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk03IDEzTDEgN0w3IDFcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX190aXRsZVwiPiR7bW9udGhUaXRsZX0gJHtkYXRlLmdldEZ1bGxZZWFyKCl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLW5leHQkeyh0aGlzLm9wdGlvbnMubWF4RGF0ZSAmJiBkYXRlID49IHRoaXMub3B0aW9ucy5tYXhEYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMSAwLjk5OTk5OUw3IDdMMSAxM1wiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrXCI+JHt3ZWVrRGF5cy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtkYXlcIj4ke2l0ZW0udGl0bGV9PC9kaXY+YFxyXG4gICAgICAgICAgICAgICAgfSkuam9pbignJyl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2RheXNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vINGB0YLRgNC10LvQutC4XHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1wcmV2JywgbmFtZTogJ3ByZXYnfSxcclxuICAgICAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tbmV4dCcsIG5hbWU6ICduZXh0J30sXHJcbiAgICAgICAgXS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkYXJyb3cgPSAkbW9udGgucXVlcnlTZWxlY3RvcihpdGVtLnNlbGVjdG9yKTtcclxuICAgICAgICAgICAgJGFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkFycm93Q2xpY2soJGFycm93LCBpdGVtLm5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g0YDQtdC90LTQtdGAINC00L3QtdC5XHJcbiAgICAgICAgY29uc3QgJGRheXMgPSAkbW9udGgucXVlcnlTZWxlY3RvcignLk1vbnRoX19kYXlzJyk7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBkYXlzLnNldERhdGUoMSk7XHJcbiAgICAgICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGRheXMuZ2V0TW9udGgoKSA9PSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlV2VlaygpO1xyXG5cclxuICAgICAgICAgICAgd2Vla0RheXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXlzLmdldERheSgpICE9IGl0ZW0uZGF5IHx8IGRheXMuZ2V0TW9udGgoKSAhPSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRW1wdHlEYXkoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVEYXkoZGF5cykpO1xyXG4gICAgICAgICAgICAgICAgZGF5cy5zZXREYXRlKGRheXMuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJGRheXMuYXBwZW5kQ2hpbGQoJHdlZWspO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRtb250aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0LvQuNC6INC/0L4g0YHRgtGA0LXQu9C60LUg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPINC80LXRgdGP0YbQsFxyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSAkYXJyb3cgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgICAg0JjQvNGPIChwcmV2LCBuZXh0KVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkFycm93Q2xpY2sgPSBmdW5jdGlvbigkYXJyb3csIG5hbWUpIHtcclxuICAgICAgICBpZiAoJGFycm93LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUocGFyc2VJbnQodGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuTW9udGgnKS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICAgICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyAobmFtZSA9PSAncHJldicgPyAtdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50IDogdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KSk7XHJcblxyXG4gICAgICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNC40L3QuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICAgICAgaWYgKGRhdGUgPCB0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1pbkRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICAgICAgY29uc3QgZW5kRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgZW5kRGF0ZS5zZXRNb250aChlbmREYXRlLmdldE1vbnRoKCkgKyB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpO1xyXG4gICAgICAgICAgICBpZiAoZW5kRGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1heERhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpIC0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50ICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuXyRjcmVhdGVNb250aHMoZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10L3QtNC10YAg0L3QtdC00LXQu9C4XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7RWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZVdlZWsgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJXZWVrXCI+PC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiAkd2VlaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQvdC00LXRgCDQtNC90Y9cclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlRGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGxvY2tlZCA9IHRoaXMuZ2V0RGF5TG9ja2VkKGRhdGUpO1xyXG4gICAgICAgIGNvbnN0IHRvZGF5ICA9IHRoaXMuX3RvZGF5LmdldFRpbWUoKSA9PSBkYXRlLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgbGV0IGNsYXNzTmFtZSA9ICcnO1xyXG4gICAgICAgIGNsYXNzTmFtZSArPSBsb2NrZWQgPyAnIGlzLWRpc2FibGVkJyA6ICcnO1xyXG4gICAgICAgIGNsYXNzTmFtZSArPSBsb2NrZWQgPT0gTE9DS19MT0NLRUQgPyAnIGlzLWxvY2tlZCcgOiAnJztcclxuICAgICAgICBjbGFzc05hbWUgKz0gdG9kYXkgPyAnIGlzLXRvZGF5JyA6ICcnO1xyXG5cclxuICAgICAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5JHtjbGFzc05hbWV9XCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIiBkYXRhLWRheT1cIiR7ZGF0ZS5nZXREYXkoKX1cIj4ke2RhdGUuZ2V0RGF0ZSgpfTwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25EYXlDbGlja0V2ZW50LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRkYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtSDQutC70LjQutCwINC/0L4g0LTQvdGOXHJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheUNsaWNrRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdGhpcy5fb25EYXlDbGljayhlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtSDRhdC+0LLQtdGA0LBcclxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHRoaXMuX29uRGF5TW91c2VFbnRlcihlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpdC+0LLQtdGAINC90LAg0Y3Qu9C10LzQtdC90YLQtSDQtNC90Y9cclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlciA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXkuZGF0YXNldC50aW1lID09IHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20uZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC70LjQuiDQv9C+INC00L3RjlxyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5fb25EYXlDbGljayA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgICAgICAvLyDQtNC10L3RjCDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L1cclxuICAgICAgICBpZiAoJGRheS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgICAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrKCdkYXlTZWxlY3QnLCBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGB0LHRgNC+0YEg0LLRi9Cx0YDQsNC90L3QvtCz0L4g0YDQsNC90LXQtSDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgLy8g0LLRi9Cx0YDQsNC90LAg0L3QsNGH0LDQu9GM0L3QsNGPIC8g0LrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmdldElzUmFuZ2VTZWxlY3RhYmxlKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMucmFuZ2VSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsUmVzZXQoKTtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0LjQt9GD0LDQu9GM0L3Ri9C5INGB0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICAgICAgJGRheXMuZm9yRWFjaCgkZGF5ID0+IHtcclxuICAgICAgICAgICAgJGRheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJywgJ2lzLXNlbGVjdGVkLXRvJywgJ2lzLXNlbGVjdGVkLWJldHdlZW4nKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0LjQt9GD0LDQu9GM0L3QvtC1INCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YJcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgIGlmIChkYXRlX2Zyb20gJiYgZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF0ZV90byAmJiBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LIg0L7QsdGA0LDRgtC90L7QvCDQv9C+0YDRj9C00LrQtVxyXG4gICAgICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0aW1lX2Zyb20gPSBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV9mcm9tLmdldFRpbWUoKSA6IDA7XHJcbiAgICAgICAgY29uc3QgdGltZV90byA9IGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV90by5nZXRUaW1lKCkgOiAwO1xyXG4gICAgICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuXHJcbiAgICAgICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC00LDRgiDQvNC10LbQtNGDINC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkZGF5cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAkZGF5c1tpXS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zZWxlY3RlZC1iZXR3ZWVuJywgJGRheXNbaV0uZGF0YXNldC50aW1lID4gdGltZV9mcm9tICYmICRkYXlzW2ldLmRhdGFzZXQudGltZSA8IHRpbWVfdG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5INC/0L7Qt9C40YbQuNC4XHJcbiAgICAgICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgICAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgIT0gJGRheV9mcm9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgICAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgIT0gJGRheV90bykge1xyXG4gICAgICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YHQvtGF0YDQsNC90LXQvdC40LUg0LIg0LrQtdGIXHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCA9ICRkYXlfZnJvbTtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCA9ICRkYXlfdG87XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktGL0LTQtdC70LXQvdC40LUg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKi9cclxuICAgIHRoaXMucmFuZ2VTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZShkYXRlX2Zyb20sIGRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCAkZGF5X2Zyb20sICRkYXlfdG87XHJcblxyXG4gICAgICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LVcclxuICAgICAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgICAgICAgICAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICAgICAgICAgICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INGN0LvQtdC80LXQvdGC0L7QslxyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcblxyXG4gICAgICAgIC8vINGB0L7QsdGL0YLQuNC1XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2soJ3JhbmdlU2VsZWN0JywgZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0LLQvtC30LzQvtC20L3QvtGB0YLQuCDQstGL0LTQtdC70LXQvdC40Y8g0LTQsNGCXHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlIGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqIEBwYXJhbSAge0RhdGUgZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhkYXRlX2Zyb20uZ2V0VGltZSgpIC0gZGF0ZV90by5nZXRUaW1lKCkpIC8gMTAwMCAvIDg2NDAwO1xyXG4gICAgICAgIGlmIChkaWZmIDwgdGhpcy5vcHRpb25zLm1pbkRheXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQv9C+0L/QsNC00LDQvdC40Y8g0LIg0LTQuNCw0L/QsNC30L7QvSDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbiAgICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBkYXkuc2V0VGltZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGRheSA8IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0RGF5TG9ja2VkKGRheSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINC90LAg0LTQvtGB0YLRg9C/0L3QvtGB0YLRjCDQtNC90Y8g0LTQu9GPINCx0YDQvtC90LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59ICAgdHJ1ZSDQtdGB0LvQuCDQtNC+0YHRgtGD0L/QtdC9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0RGF5TG9ja2VkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCy0L3QtSDQtNC+0YHRgtGD0L/QvdC+0LPQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlIHx8IGRhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gTE9DS19VTkFWQUlMQUJMRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubG9ja0RheXNGaWx0ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5sb2NrRGF5c0ZpbHRlcihkYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCt0LvQtdC80LXQvdGCINC60LDQu9C10L3QtNCw0YDQvdC+0LPQviDQtNC90Y9cclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9ICAgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kZ2V0RGF5QnlEYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHRpbWUgPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogMDtcclxuICAgICAgICByZXR1cm4gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuRGF5W2RhdGEtdGltZT1cIicgKyB0aW1lICsgJ1wiXScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC00L3RjyAtINC30LDQs9C70YPRiNC60LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlRW1wdHlEYXkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5IGlzLWVtcHR5XCI+PC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiAkZGF5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwINC40LcgSFRNTCDRgtC10LrRgdGC0LBcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaHRtbCBIVE1MINGC0LXQutGB0YJcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24oaHRtbCkge1xyXG4gICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdi5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgICAgICByZXR1cm4gZGl2LmNoaWxkcmVuLmxlbmd0aCA+IDEgPyBkaXYuY2hpbGRyZW4gOiBkaXYuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTYWZlINCy0YvQt9C+0LIg0LLQvdC10YjQvdC40YUg0YHQvtCx0YvRgtC40Lkg0LrQvtC80L/QvtC90LXQvdGC0LBcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmINCY0LzRjyDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICovXHJcbiAgICB0aGlzLl9jYWxsYmFjayA9IGZ1bmN0aW9uKGYpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbltmXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub25bZl0uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXQoKTtcclxufVxyXG5cclxuLyogaGFybW9ueSBkZWZhdWx0IGV4cG9ydCAqLyBjb25zdCBfX1dFQlBBQ0tfREVGQVVMVF9FWFBPUlRfXyA9IChEYXRlUmFuZ2VQaWNrZXIpO1xyXG5cbn0pKCk7XG5cbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19leHBvcnRzX187XG4vKioqKioqLyB9KSgpXG47XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdmQyVmljR0ZqYXk5MWJtbDJaWEp6WVd4TmIyUjFiR1ZFWldacGJtbDBhVzl1SWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k5M1pXSndZV05yTDJKdmIzUnpkSEpoY0NJc0luZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdmQyVmljR0ZqYXk5eWRXNTBhVzFsTDJSbFptbHVaU0J3Y205d1pYSjBlU0JuWlhSMFpYSnpJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTkzWldKd1lXTnJMM0oxYm5ScGJXVXZhR0Z6VDNkdVVISnZjR1Z5ZEhrZ2MyaHZjblJvWVc1a0lpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOTNaV0p3WVdOckwzSjFiblJwYldVdmJXRnJaU0J1WVcxbGMzQmhZMlVnYjJKcVpXTjBJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTh1TDNOeVl5OXpZM056TDJsdVpHVjRMbk5qYzNNaUxDSjNaV0p3WVdOck9pOHZaR0YwWlhKaGJtZGxjR2xqYTJWeUx5NHZjM0pqTDJwekwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRU5CUVVNN1FVRkRSQ3hQT3p0VlExWkJPMVZCUTBFN096czdPMWREUkVFN1YwRkRRVHRYUVVOQk8xZEJRMEU3VjBGRFFTeDNRMEZCZDBNc2VVTkJRWGxETzFkQlEycEdPMWRCUTBFN1YwRkRRU3hGT3pzN096dFhRMUJCTEhkR096czdPenRYUTBGQk8xZEJRMEU3VjBGRFFUdFhRVU5CTEhORVFVRnpSQ3hyUWtGQmEwSTdWMEZEZUVVN1YwRkRRU3dyUTBGQkswTXNZMEZCWXp0WFFVTTNSQ3hGT3pzN096czdPenM3T3pzN1FVTk9RVHM3T3pzN096czdPenM3T3pzN08wRkRRVUU3UVVGRFR6dEJRVU5CT3p0QlFVVlFMR2xFUVVGcFJEdEJRVU5xUkRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEZOQlFWTXNhMEpCUVd0Q08wRkJRek5DT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNaMEpCUVdkQ0xFdEJRVXM3UVVGRGNrSXNaMEpCUVdkQ08wRkJRMmhDTzBGQlEwRTdRVUZEUVN4dlJFRkJiMFFzWTBGQll6dEJRVU5zUlR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeG5Ra0ZCWjBJc1MwRkJTenRCUVVOeVFpeG5Ra0ZCWjBJc1QwRkJUenRCUVVOMlFpeG5Ra0ZCWjBJN1FVRkRhRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFc2RVSkJRWFZDTEU5QlFVODdRVUZET1VJN1FVRkRRVHRCUVVOQk8wRkJRMEVzY1VSQlFYRkVMR2xDUVVGcFFqdEJRVU4wUlN4aFFVRmhPMEZCUTJJN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFTeFRRVUZUT3p0QlFVVlVPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdkQ1FVRm5RaXhMUVVGTE8wRkJRM0pDTEdkQ1FVRm5RaXhQUVVGUE8wRkJRM1pDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMR1ZCUVdVc1MwRkJTenRCUVVOd1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEhWQ1FVRjFRaXc0UWtGQk9FSTdRVUZEY2tRN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRXNkVUpCUVhWQ0xHOUNRVUZ2UWp0QlFVTXpRenRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4aFFVRmhPenRCUVVWaU8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdWQlFXVXNTMEZCU3p0QlFVTndRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFc05rTkJRVFpETEdWQlFXVTdRVUZETlVRN1FVRkRRU3hwUlVGQmFVVXNOa1ZCUVRaRk8wRkJRemxKTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1owUkJRV2RFTEZkQlFWY3NSMEZCUnl4dFFrRkJiVUk3UVVGRGFrWXNhVVZCUVdsRkxEWkZRVUUyUlR0QlFVTTVTVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNNa05CUVRKRE8wRkJRek5ETERCRVFVRXdSQ3hYUVVGWE8wRkJRM0pGTEdsQ1FVRnBRaXhYUVVGWE8wRkJRelZDTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWVVGQllTdzRRMEZCT0VNN1FVRkRNMFFzWVVGQllTdzRRMEZCT0VNN1FVRkRNMFE3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4aFFVRmhPMEZCUTJJc1UwRkJVenM3UVVGRlZEdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNZVUZCWVRzN1FVRkZZanRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxHVkJRV1VzVVVGQlVUdEJRVU4yUWl4bFFVRmxMRTlCUVU4N1FVRkRkRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3huUWtGQlowSXNTMEZCU3p0QlFVTnlRaXhuUWtGQlowSTdRVUZEYUVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeG5Ra0ZCWjBJc1MwRkJTenRCUVVOeVFpeG5Ra0ZCWjBJN1FVRkRhRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVN3NFFrRkJPRUlzVlVGQlZTeGxRVUZsTEdWQlFXVXNZMEZCWXl4alFVRmpMRWxCUVVrc1pVRkJaVHRCUVVOeVNEczdRVUZGUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWlVGQlpTeE5RVUZOTzBGQlEzSkNPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4bFFVRmxMRTFCUVUwN1FVRkRja0k3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxHVkJRV1VzVVVGQlVUdEJRVU4yUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hsUVVGbExGRkJRVkU3UVVGRGRrSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJMRk5CUVZNN1FVRkRWRHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4VFFVRlRPMEZCUTFRN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdWQlFXVXNTMEZCU3p0QlFVTndRaXhsUVVGbExFdEJRVXM3UVVGRGNFSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEVzZFVKQlFYVkNMR3RDUVVGclFqdEJRVU42UXp0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hsUVVGbExFdEJRVXM3UVVGRGNFSXNaVUZCWlN4TFFVRkxPMEZCUTNCQ08wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3huUWtGQlowSTdRVUZEYUVJc1owSkJRV2RDTzBGQlEyaENMR2RDUVVGblFqdEJRVU5vUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3huUWtGQlowSXNTMEZCU3p0QlFVTnlRaXhuUWtGQlowSXNVVUZCVVR0QlFVTjRRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxHZENRVUZuUWl4TFFVRkxPMEZCUTNKQ0xHZENRVUZuUWl4UlFVRlJPMEZCUTNoQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxHZENRVUZuUWl4TFFVRkxPMEZCUTNKQ0xHZENRVUZuUWp0QlFVTm9RanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdkQ1FVRm5RaXhQUVVGUE8wRkJRM1pDTEdkQ1FVRm5RanRCUVVOb1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdWQlFXVXNUMEZCVHp0QlFVTjBRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVN4cFJVRkJaU3hsUVVGbExFVkJRVU1pTENKbWFXeGxJam9pWkdGMFpYSmhibWRsY0dsamEyVnlMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUtHWjFibU4wYVc5dUlIZGxZbkJoWTJ0VmJtbDJaWEp6WVd4TmIyUjFiR1ZFWldacGJtbDBhVzl1S0hKdmIzUXNJR1poWTNSdmNua3BJSHRjYmx4MGFXWW9kSGx3Wlc5bUlHVjRjRzl5ZEhNZ1BUMDlJQ2R2WW1wbFkzUW5JQ1ltSUhSNWNHVnZaaUJ0YjJSMWJHVWdQVDA5SUNkdlltcGxZM1FuS1Z4dVhIUmNkRzF2WkhWc1pTNWxlSEJ2Y25SeklEMGdabUZqZEc5eWVTZ3BPMXh1WEhSbGJITmxJR2xtS0hSNWNHVnZaaUJrWldacGJtVWdQVDA5SUNkbWRXNWpkR2x2YmljZ0ppWWdaR1ZtYVc1bExtRnRaQ2xjYmx4MFhIUmtaV1pwYm1Vb1hDSkVZWFJsY21GdVoyVndhV05yWlhKY0lpd2dXMTBzSUdaaFkzUnZjbmtwTzF4dVhIUmxiSE5sSUdsbUtIUjVjR1Z2WmlCbGVIQnZjblJ6SUQwOVBTQW5iMkpxWldOMEp5bGNibHgwWEhSbGVIQnZjblJ6VzF3aVJHRjBaWEpoYm1kbGNHbGphMlZ5WENKZElEMGdabUZqZEc5eWVTZ3BPMXh1WEhSbGJITmxYRzVjZEZ4MGNtOXZkRnRjSWtSaGRHVnlZVzVuWlhCcFkydGxjbHdpWFNBOUlHWmhZM1J2Y25rb0tUdGNibjBwS0hObGJHWXNJR1oxYm1OMGFXOXVLQ2tnZTF4dWNtVjBkWEp1SUNJc0lpOHZJRlJvWlNCeVpYRjFhWEpsSUhOamIzQmxYRzUyWVhJZ1gxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5QTlJSHQ5TzF4dVhHNGlMQ0l2THlCa1pXWnBibVVnWjJWMGRHVnlJR1oxYm1OMGFXOXVjeUJtYjNJZ2FHRnliVzl1ZVNCbGVIQnZjblJ6WEc1ZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxtUWdQU0FvWlhod2IzSjBjeXdnWkdWbWFXNXBkR2x2YmlrZ1BUNGdlMXh1WEhSbWIzSW9kbUZ5SUd0bGVTQnBiaUJrWldacGJtbDBhVzl1S1NCN1hHNWNkRngwYVdZb1gxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NXZLR1JsWm1sdWFYUnBiMjRzSUd0bGVTa2dKaVlnSVY5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dWJ5aGxlSEJ2Y25SekxDQnJaWGtwS1NCN1hHNWNkRngwWEhSUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa29aWGh3YjNKMGN5d2dhMlY1TENCN0lHVnVkVzFsY21GaWJHVTZJSFJ5ZFdVc0lHZGxkRG9nWkdWbWFXNXBkR2x2Ymx0clpYbGRJSDBwTzF4dVhIUmNkSDFjYmx4MGZWeHVmVHNpTENKZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxtOGdQU0FvYjJKcUxDQndjbTl3S1NBOVBpQW9UMkpxWldOMExuQnliM1J2ZEhsd1pTNW9ZWE5QZDI1UWNtOXdaWEowZVM1allXeHNLRzlpYWl3Z2NISnZjQ2twSWl3aUx5OGdaR1ZtYVc1bElGOWZaWE5OYjJSMWJHVWdiMjRnWlhod2IzSjBjMXh1WDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1eUlEMGdLR1Y0Y0c5eWRITXBJRDArSUh0Y2JseDBhV1lvZEhsd1pXOW1JRk41YldKdmJDQWhQVDBnSjNWdVpHVm1hVzVsWkNjZ0ppWWdVM2x0WW05c0xuUnZVM1J5YVc1blZHRm5LU0I3WEc1Y2RGeDBUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0dWNGNHOXlkSE1zSUZONWJXSnZiQzUwYjFOMGNtbHVaMVJoWnl3Z2V5QjJZV3gxWlRvZ0owMXZaSFZzWlNjZ2ZTazdYRzVjZEgxY2JseDBUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0dWNGNHOXlkSE1zSUNkZlgyVnpUVzlrZFd4bEp5d2dleUIyWVd4MVpUb2dkSEoxWlNCOUtUdGNibjA3SWl3aUx5OGdaWGgwY21GamRHVmtJR0o1SUcxcGJta3RZM056TFdWNGRISmhZM1F0Y0d4MVoybHVYRzVsZUhCdmNuUWdlMzA3SWl3aUx5OGcwWUhRdnRHQjBZTFF2dEdQMEwzUXVOR1BJTkMzMExEUXNkQzcwTDdRdXRDNDBZRFF2dEN5MExEUXZkQzkwWXZSaFNEUXROQ3cwWUpjY2x4dVpYaHdiM0owSUdOdmJuTjBJRXhQUTB0ZlZVNUJWa0ZKVEVGQ1RFVWdQU0F4TzF4eVhHNWxlSEJ2Y25RZ1kyOXVjM1FnVEU5RFMxOU1UME5MUlVRZ0lDQWdJQ0E5SURJN1hISmNibHh5WEc1bWRXNWpkR2x2YmlCRVlYUmxVbUZ1WjJWUWFXTnJaWElvSkdOdmJuUmhhVzVsY2l3Z2IzQjBhVzl1Y3lBOUlIdDlLU0I3WEhKY2JpQWdJQ0IwYUdsekxsOGtZMjl1ZEdGcGJtVnlJRDBnSkdOdmJuUmhhVzVsY2p0Y2NseHVYSEpjYmlBZ0lDQjBhR2x6TG05d2RHbHZibk1nUFNCN1hISmNiaUFnSUNBZ0lDQWdabWx5YzNSRVlYbFBabFJvWlZkbFpXczZJRzl3ZEdsdmJuTXVabWx5YzNSRVlYbFBabFJvWlZkbFpXc2dmSHdnTVN3Z0lDQWdJQ0FnSUNBZ0x5OGcwTC9RdGRHQTBMTFJpOUM1SU5DMDBMWFF2ZEdNSU5DOTBMWFF0TkMxMEx2UXVDd2dNQ0E5SU5DeTBZRXNJREVnUFNEUXY5QzlMQ0F1TGk1Y2NseHVJQ0FnSUNBZ0lDQnphVzVuYkdWTmIyUmxPaUFnSUNBZ0lDQWdiM0IwYVc5dWN5NXphVzVuYkdWTmIyUmxJQ0FnSUNBZ0lDQjhmQ0JtWVd4elpTd2dJQ0FnSUNBdkx5RFFzdEdMMExIUXZ0R0FJTkMrMExUUXZkQyswTGtnMExUUXNOR0MwWXNnMExMUXZOQzEwWUhSZ3RDK0lOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXNGeHlYRzRnSUNBZ0lDQWdJR3h2WTJGc1pUb2dJQ0FnSUNBZ0lDQWdJQ0J2Y0hScGIyNXpMbXh2WTJGc1pTQWdJQ0FnSUNBZ0lDQWdJSHg4SUNkeWRTMVNWU2NzWEhKY2JpQWdJQ0FnSUNBZ2JXbHVSR0Y1Y3pvZ0lDQWdJQ0FnSUNBZ0lHOXdkR2x2Ym5NdWJXbHVSR0Y1Y3lBZ0lDQWdJQ0FnSUNBZ2ZId2dNU3dnSUNBZ0lDQWdJQ0FnTHk4ZzBMelF1TkM5MExqUXZOQ3cwTHZSak5DOTBMN1F0U0RRdXRDKzBMdlF1TkdIMExYUmdkR0MwTExRdmlEUXROQzkwTFhRdVNEUXNpRFF0TkM0MExEUXY5Q3cwTGZRdnRDOTBMVmNjbHh1SUNBZ0lDQWdJQ0J0YjI1MGFITkRiM1Z1ZERvZ0lDQWdJQ0FnYjNCMGFXOXVjeTV0YjI1MGFITkRiM1Z1ZENBZ0lDQWdJQ0I4ZkNBeE1peGNjbHh1SUNBZ0lDQWdJQ0J3WlhKU2IzYzZJQ0FnSUNBZ0lDQWdJQ0FnYjNCMGFXOXVjeTV3WlhKU2IzY2dJQ0FnSUNBZ0lDQWdJQ0I4ZkNCMWJtUmxabWx1WldRc0lDQXZMeURRdXRDKzBMdlF1TkdIMExYUmdkR0MwTExRdmlEUXZOQzEwWUhSajlHRzBMWFFzaURRc2lEUmdOR1AwTFRSZzF4eVhHNGdJQ0FnSUNBZ0lHMXBia1JoZEdVNklDQWdJQ0FnSUNBZ0lDQnZjSFJwYjI1ekxtMXBia1JoZEdVZ0lDQWdJQ0FnSUNBZ0lIeDhJRzVsZHlCRVlYUmxLQ2tzSUM4dklOQzgwTGpRdmRDNDBMelFzTkM3MFl6UXZkQ3cwWThnMExUUXNOR0MwTEJjY2x4dUlDQWdJQ0FnSUNCdFlYaEVZWFJsT2lBZ0lDQWdJQ0FnSUNBZ2IzQjBhVzl1Y3k1dFlYaEVZWFJsSUNBZ0lDQWdJQ0FnSUNCOGZDQjFibVJsWm1sdVpXUXNYSEpjYmlBZ0lDQWdJQ0FnYkc5amEwUmhlWE5HYVd4MFpYSTZJQ0FnSUc5d2RHbHZibk11Ykc5amEwUmhlWE5HYVd4MFpYSWdJQ0FnZkh3Z2RXNWtaV1pwYm1Wa0xDQWdMeThnWTJGc2JHSmhZMnNvWkdGMFpTa2cwWVRSZzlDOTBMclJodEM0MFk4ZzBMSFF1OUMrMExyUXVOR0EwTDdRc3RDdzBMM1F1TkdQSU5DMDBMRFJnaXdnZEhKMVpTOU1UME5MWEhKY2JpQWdJQ0FnSUNBZ2IyNDZJRTlpYW1WamRDNWhjM05wWjI0b2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVlXNW5aVk5sYkdWamREb2diblZzYkN3Z0x5OGcwWUhRdnRDeDBZdlJndEM0MExVZzBMTFJpOUN4MEw3UmdOQ3dJTkMwMExqUXNOQy8wTERRdDlDKzBMM1FzQ0RRdE5DdzBZSmNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1pHRjVVMlZzWldOME9pQnVkV3hzTENBZ0lDOHZJTkdCMEw3UXNkR0wwWUxRdU5DMUlOQ3kwWXZRc2RDKzBZRFFzQ0RRdnRDMDBMM1F2dEM1SU5DMDBMRFJndEdMSUNqUmd0QyswTHZSak5DNjBMNGcwTC9SZ05DNElITnBibWRzWlUxdlpHVTZJSFJ5ZFdVcFhISmNiaUFnSUNBZ0lDQWdmU3dnYjNCMGFXOXVjeTV2YmlCOGZDQjdmU2tzWEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5OGcwWURSajlDMDBMM1F2dEdCMFlMUmpGeHlYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQjBhR2x6TG05d2RHbHZibk11Y0dWeVVtOTNJRDA5SUNkMWJtUmxabWx1WldRbktTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NXZjSFJwYjI1ekxuQmxjbEp2ZHlBOUlIUm9hWE11YjNCMGFXOXVjeTV0YjI1MGFITkRiM1Z1ZER0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxtMXBia1JoZEdVcElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxtOXdkR2x2Ym5NdWJXbHVSR0YwWlM1elpYUkliM1Z5Y3lnd0xDQXdMQ0F3TENBd0tUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlOQ1kwTDNRdU5HRzBMalFzTkM3MExqUXQ5Q3cwWWJRdU5HUFhISmNiaUFnSUNBZ0tpOWNjbHh1SUNBZ0lIUm9hWE11YVc1cGRDQTlJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lDOHZJTkdDMExYUXV0R0QwWW5RdU5DNUlOQzAwTFhRdmRHTVhISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmRHOWtZWGtnUFNCdVpYY2dSR0YwWlNncE8xeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzUnZaR0Y1TG5ObGRFaHZkWEp6S0RBc0lEQXNJREFzSURBcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDhrY0dsamEyVnlJRDBnZEdocGN5NWZKR055WldGMFpVVnNaVzFsYm5Rb1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdBOFpHbDJJR05zWVhOelBWd2lSR0YwWlhKaGJtZGxjR2xqYTJWeVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aVJHRjBaWEpoYm1kbGNHbGphMlZ5WDE5dGIyNTBhSE5jSWo0OEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1lGeHlYRzRnSUNBZ0lDQWdJQ2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5HTjBMdlF0ZEM4MExYUXZkR0MwWXRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDhrYlc5dWRHaHpJRDBnZEdocGN5NWZKSEJwWTJ0bGNpNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVJHRjBaWEpoYm1kbGNHbGphMlZ5WDE5dGIyNTBhSE1uS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnTHk4ZzBMalF2ZEM0MFliUXVOQ3cwTHZRdU5DMzBMRFJodEM0MFk4ZzBZSFF2dEdCMFlMUXZ0R1AwTDNRdU5DNVhISmNiaUFnSUNBZ0lDQWdkR2hwY3k1eVlXNW5aVkpsYzJWMEtDazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDOHZJTkdBMExYUXZkQzAwTFhSZ0Z4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WHlSamNtVmhkR1ZOYjI1MGFITW9kR2hwY3k1dmNIUnBiMjV6TG0xcGJrUmhkR1VwTzF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WHlSamIyNTBZV2x1WlhJdVlYQndaVzVrUTJocGJHUW9kR2hwY3k1ZkpIQnBZMnRsY2lrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUW5kQ3cwTGZRc3RDdzBMM1F1TkMxSU5DODBMWFJnZEdQMFliUXNGeHlYRzRnSUNBZ0lDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ0FnSUNBcUlFQnlaWFIxY200Z2UxTjBjbWx1WjMxY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVuWlhSTmIyNTBhRVp2Y20xaGRIUmxaQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0IwYVhSc1pTQTlJSFJvYVhNdVoyVjBSR0YwWlZScGJXVkdiM0p0WVhRb1pHRjBaU3dnZTIxdmJuUm9PaUFuYkc5dVp5ZDlLVHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdsMGJHVXVjMnhwWTJVb01Dd2dNU2t1ZEc5VmNIQmxja05oYzJVb0tTQXJJSFJwZEd4bExuTnNhV05sS0RFcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBLVFF2dEdBMEx6UXNOR0MwTGpSZ05DKzBMTFFzTkM5MExqUXRTRFF0TkN3MFlMUml5RFF0TkM3MFk4ZzBZTFF0ZEM2MFlQUmlkQzEwTGtnMEx2UXZ0QzYwTERRdTlDNFhISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ0lIdEVZWFJsZlNBZ0lHUmhkR1VnSUNBZzBKN1FzZEdLMExYUXV0R0NJTkMwMExEUmd0R0xYSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdJSHRQWW1wbFkzUjlJRzl3ZEdsdmJuTWcwSi9Rc05HQTBMRFF2TkMxMFlMUmdOR0xYSEpjYmlBZ0lDQWdLaUJBY21WMGRYSnVJSHRUZEhKcGJtZDlYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVoyVjBSR0YwWlZScGJXVkdiM0p0WVhRZ1BTQm1kVzVqZEdsdmJpaGtZWFJsTENCdmNIUnBiMjV6S1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlFbHVkR3d1UkdGMFpWUnBiV1ZHYjNKdFlYUW9kR2hwY3k1dmNIUnBiMjV6TG14dlkyRnNaU3dnYjNCMGFXOXVjeWt1Wm05eWJXRjBLR1JoZEdVcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBKVFF2ZEM0SU5DOTBMWFF0TkMxMEx2UXVGeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TG1kbGRGZGxaV3RFWVhselJtOXliV0YwZEdWa0lEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWkdGMFpTQTlJRzVsZHlCRVlYUmxLQ2s3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnY21WemRXeDBJRDBnVzEwN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUdSaGRHVXVjMlYwUkdGMFpTaGtZWFJsTG1kbGRFUmhkR1VvS1NBdElESXBPMXh5WEc0Z0lDQWdJQ0FnSUdadmNpQW9iR1YwSUdrZ1BTQXdPeUJwSUR3Z056c2dLeXRwS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGRHVXVjMlYwUkdGMFpTaGtZWFJsTG1kbGRFUmhkR1VvS1NBcklERXBPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWE4xYkhRdWNIVnphQ2g3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCa1lYazZJR1JoZEdVdVoyVjBSR0Y1S0Nrc1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhWFJzWlRvZ2RHaHBjeTVuWlhSRVlYUmxWR2x0WlVadmNtMWhkQ2hrWVhSbExDQjdkMlZsYTJSaGVUb2dKM05vYjNKMEozMHBMRnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOR0IwTDdSZ05HQzBMalJnTkMrMExMUXV0Q3dJTkdCMEw3UXM5QzcwTERSZ2RDOTBMNGcwTDNRc05HQjBZTFJnTkMrMExYUXZkQzkwTDdRdk5HRElOQy8wTFhSZ05DeTBMN1F2TkdESU5DMDBMM1JqaURRdmRDMTBMVFF0ZEM3MExoY2NseHVJQ0FnSUNBZ0lDQnlaWE4xYkhRdWMyOXlkQ2dvWVN3Z1lpa2dQVDRnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JqYjI1emRDQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5QTlJSFJvYVhNdWIzQjBhVzl1Y3k1bWFYSnpkRVJoZVU5bVZHaGxWMlZsYXlBbElEYzdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHeGxkQ0JrWVhsQklEMGdZUzVrWVhrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUd4bGRDQmtZWGxDSUQwZ1lpNWtZWGs3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9aR0Y1UVNBOVBTQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQzB4TzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9aR0Y1UWlBOVBTQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJREU3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaGtZWGxCSUR3Z1ptbHljM1JFWVhsUFpsUm9aVmRsWldzcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR1JoZVVFZ0t6MGdjbVZ6ZFd4MExteGxibWQwYUR0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR1JoZVVJZ1BDQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWkdGNVFpQXJQU0J5WlhOMWJIUXViR1Z1WjNSb08xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1pHRjVRU0F0SUdSaGVVSTdYSEpjYmlBZ0lDQWdJQ0FnZlNrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUTdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRFFtdEMrMEx2UXVOR0gwTFhSZ2RHQzBMTFF2aURRdE5DOTBMWFF1U0RRc2lEUXZOQzEwWUhSajlHRzBMVmNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQWdlMFJoZEdWOUlHUmhkR1VnMEo3UXNkR0swTFhRdXRHQ0lOQzAwTERSZ3RHTFhISmNiaUFnSUNBZ0tpQkFjbVYwZFhKdUlIdE9kVzFpWlhKOUlDQWdJTkNhMEw3UXU5QzQwWWZRdGRHQjBZTFFzdEMrSU5DMDBMM1F0ZEM1WEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUhSb2FYTXVaMlYwUkdGNWMwTnZkVzUwU1c1TmIyNTBhQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0JrWVhseklEMGdibVYzSUVSaGRHVW9aR0YwWlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ0lDQWdJR1JoZVhNdWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmlBZ0lDQWdJQ0FnWkdGNWN5NXpaWFJOYjI1MGFDaGtZWGx6TG1kbGRFMXZiblJvS0NrZ0t5QXhLVHRjY2x4dUlDQWdJQ0FnSUNCa1lYbHpMbk5sZEVSaGRHVW9NQ2s3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdSaGVYTXVaMlYwUkdGMFpTZ3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwS0RRdGRDOTBMVFF0ZEdBSU5DMDBMalFzTkMvMExEUXQ5QyswTDNRc0NEUXZOQzEwWUhSajlHRzBMWFFzbHh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRFWVhSbGZTQmtZWFJsWDJaeWIyMGcwSjNRc05HSDBMRFF1OUdNMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVh5UmpjbVZoZEdWTmIyNTBhSE1nUFNCbWRXNWpkR2x2Ymloa1lYUmxYMlp5YjIwcElIdGNjbHh1SUNBZ0lDQWdJQ0IzYUdsc1pTQW9kR2hwY3k1ZkpHMXZiblJvY3k1c1lYTjBSV3hsYldWdWRFTm9hV3hrS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVYeVJ0YjI1MGFITXVjbVZ0YjNabFEyaHBiR1FvZEdocGN5NWZKRzF2Ym5Sb2N5NXNZWE4wUld4bGJXVnVkRU5vYVd4a0tUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5DLzBZRFF0ZEdBMExYUXZkQzAwTFhSZ0NEUXZOQzEwWUhSajlHRzBMWFFzbHh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR04xY25KbGJuUkVZWFJsSUQwZ2JtVjNJRVJoZEdVb1pHRjBaVjltY205dExtZGxkRlJwYldVb0tTazdYSEpjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdKRzF2Ym5Sb2N5QTlJRnRkTzF4eVhHNGdJQ0FnSUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2dkR2hwY3k1dmNIUnBiMjV6TG0xdmJuUm9jME52ZFc1ME95QXJLMmtwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSkcxdmJuUm9jeTV3ZFhOb0tIUm9hWE11WHlSamNtVmhkR1ZOYjI1MGFDaGpkWEp5Wlc1MFJHRjBaU2twTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JqZFhKeVpXNTBSR0YwWlM1elpYUk5iMjUwYUNoamRYSnlaVzUwUkdGMFpTNW5aWFJOYjI1MGFDZ3BJQ3NnTVNrN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURSZ05DMTBMM1F0TkMxMFlCY2NseHVJQ0FnSUNBZ0lDQm1iM0lnS0d4bGRDQnBJRDBnTURzZ2FTQThJQ1J0YjI1MGFITXViR1Z1WjNSb095QnBJQ3M5SUhSb2FYTXViM0IwYVc5dWN5NXdaWEpTYjNjcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1kyOXVjM1FnSkhKdmR5QTlJR1J2WTNWdFpXNTBMbU55WldGMFpVVnNaVzFsYm5Rb0oyUnBkaWNwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FrY205M0xtTnNZWE56VG1GdFpTQTlJQ2RFWVhSbGNtRnVaMlZ3YVdOclpYSmZYM0p2ZHljN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWtiVzl1ZEdoekxuTnNhV05sS0drc0lHa2dLeUIwYUdsekxtOXdkR2x2Ym5NdWNHVnlVbTkzS1M1bWIzSkZZV05vS0NSdGIyNTBhQ0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWtjbTkzTG1Gd2NHVnVaRU5vYVd4a0tDUnRiMjUwYUNrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUgwcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZkpHMXZiblJvY3k1aGNIQmxibVJEYUdsc1pDZ2tjbTkzS1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxsOXpaV3hsWTNScGIyNGdKaVlnS0hSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBnZkh3Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMHNJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5b3FYSEpjYmlBZ0lDQWdLaURRb05DMTBMM1F0TkMxMFlBZzBMelF0ZEdCMFkvUmh0Q3dYSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMFJoZEdWOUlHUmhkR1VnMEp6UXRkR0IwWS9SaGx4eVhHNGdJQ0FnSUNvdlhISmNiaUFnSUNCMGFHbHpMbDhrWTNKbFlYUmxUVzl1ZEdnZ1BTQm1kVzVqZEdsdmJpaGtZWFJsS1NCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1kzVnljbVZ1ZEUxdmJuUm9JRDBnWkdGMFpTNW5aWFJOYjI1MGFDZ3BPMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJRzF2Ym5Sb1ZHbDBiR1VnUFNCMGFHbHpMbWRsZEUxdmJuUm9SbTl5YldGMGRHVmtLR1JoZEdVcE8xeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElIZGxaV3RFWVhseklEMGdkR2hwY3k1blpYUlhaV1ZyUkdGNWMwWnZjbTFoZEhSbFpDZ3BPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENBa2JXOXVkR2dnUFNCMGFHbHpMbDhrWTNKbFlYUmxSV3hsYldWdWRDaGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGd2lJR1JoZEdFdGRHbHRaVDFjSWlSN1pHRjBaUzVuWlhSVWFXMWxLQ2w5WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpVFc5dWRHaGZYMmhsWVdSbGNsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGOWZZWEp5YjNjZ1RXOXVkR2hmWDJGeWNtOTNMUzF3Y21WMkpIc29kR2hwY3k1dmNIUnBiMjV6TG0xcGJrUmhkR1VnSmlZZ1pHRjBaU0E4UFNCMGFHbHpMbTl3ZEdsdmJuTXViV2x1UkdGMFpTa2dQeUFuSUdsekxXUnBjMkZpYkdWa0p5QTZJQ2NuZlZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM1puSUhkcFpIUm9QVndpT0Z3aUlHaGxhV2RvZEQxY0lqRTBYQ0lnZG1sbGQwSnZlRDFjSWpBZ01DQTRJREUwWENJZ1ptbHNiRDFjSW01dmJtVmNJaUI0Yld4dWN6MWNJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5YQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjR0YwYUNCa1BWd2lUVGNnTVROTU1TQTNURGNnTVZ3aUlITjBjbTlyWlQxY0lpTTRRemhET0VOY0lpQnpkSEp2YTJVdGQybGtkR2c5WENJeVhDSWdjM1J5YjJ0bExXeHBibVZqWVhBOVhDSnliM1Z1WkZ3aUlITjBjbTlyWlMxc2FXNWxhbTlwYmoxY0luSnZkVzVrWENJK1BDOXdZWFJvUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzTjJaejVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aVRXOXVkR2hmWDNScGRHeGxYQ0krSkh0dGIyNTBhRlJwZEd4bGZTQWtlMlJoZEdVdVoyVjBSblZzYkZsbFlYSW9LWDA4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWd2lUVzl1ZEdoZlgyRnljbTkzSUUxdmJuUm9YMTloY25KdmR5MHRibVY0ZENSN0tIUm9hWE11YjNCMGFXOXVjeTV0WVhoRVlYUmxJQ1ltSUdSaGRHVWdQajBnZEdocGN5NXZjSFJwYjI1ekxtMWhlRVJoZEdVcElEOGdKeUJwY3kxa2FYTmhZbXhsWkNjZ09pQW5KMzFjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjJaeUIzYVdSMGFEMWNJamhjSWlCb1pXbG5hSFE5WENJeE5Gd2lJSFpwWlhkQ2IzZzlYQ0l3SURBZ09DQXhORndpSUdacGJHdzlYQ0p1YjI1bFhDSWdlRzFzYm5NOVhDSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMloxd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BIQmhkR2dnWkQxY0lrMHhJREF1T1RrNU9UazVURGNnTjB3eElERXpYQ0lnYzNSeWIydGxQVndpSXpoRE9FTTRRMXdpSUhOMGNtOXJaUzEzYVdSMGFEMWNJakpjSWlCemRISnZhMlV0YkdsdVpXTmhjRDFjSW5KdmRXNWtYQ0lnYzNSeWIydGxMV3hwYm1WcWIybHVQVndpY205MWJtUmNJajQ4TDNCaGRHZytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2YzNablBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aVRXOXVkR2hmWDNkbFpXdGNJajRrZTNkbFpXdEVZWGx6TG0xaGNDaHBkR1Z0SUQwK0lIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUY5ZmQyVmxhMlJoZVZ3aVBpUjdhWFJsYlM1MGFYUnNaWDA4TDJScGRqNWdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5S1M1cWIybHVLQ2NuS1gwOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUY5ZlpHRjVjMXdpUGp3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Z1hISmNiaUFnSUNBZ0lDQWdLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdMeThnMFlIUmd0R0EwTFhRdTlDNjBMaGNjbHh1SUNBZ0lDQWdJQ0JiWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSHR6Wld4bFkzUnZjam9nSnk1TmIyNTBhRjlmWVhKeWIzY3RMWEJ5WlhZbkxDQnVZVzFsT2lBbmNISmxkaWQ5TEZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I3YzJWc1pXTjBiM0k2SUNjdVRXOXVkR2hmWDJGeWNtOTNMUzF1WlhoMEp5d2dibUZ0WlRvZ0oyNWxlSFFuZlN4Y2NseHVJQ0FnSUNBZ0lDQmRMbVp2Y2tWaFkyZ29hWFJsYlNBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHTnZibk4wSUNSaGNuSnZkeUE5SUNSdGIyNTBhQzV4ZFdWeWVWTmxiR1ZqZEc5eUtHbDBaVzB1YzJWc1pXTjBiM0lwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FrWVhKeWIzY3VZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25ZMnhwWTJzbkxDQmxJRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11WDI5dVFYSnliM2REYkdsamF5Z2tZWEp5YjNjc0lHbDBaVzB1Ym1GdFpTazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh5WEc0Z0lDQWdJQ0FnSUgwcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5RFJnTkMxMEwzUXROQzEwWUFnMExUUXZkQzEwTGxjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0FrWkdGNWN5QTlJQ1J0YjI1MGFDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVRXOXVkR2hmWDJSaGVYTW5LVHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0JrWVhseklEMGdibVYzSUVSaGRHVW9aR0YwWlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ0lDQWdJR1JoZVhNdWMyVjBSR0YwWlNneEtUdGNjbHh1SUNBZ0lDQWdJQ0JrWVhsekxuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQjNhR2xzWlNBb1pHRjVjeTVuWlhSTmIyNTBhQ2dwSUQwOUlHTjFjbkpsYm5STmIyNTBhQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JqYjI1emRDQWtkMlZsYXlBOUlIUm9hWE11WHlSamNtVmhkR1ZYWldWcktDazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IzWldWclJHRjVjeTVtYjNKRllXTm9LR2wwWlcwZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHUmhlWE11WjJWMFJHRjVLQ2tnSVQwZ2FYUmxiUzVrWVhrZ2ZId2daR0Y1Y3k1blpYUk5iMjUwYUNncElDRTlJR04xY25KbGJuUk5iMjUwYUNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNSM1pXVnJMbUZ3Y0dWdVpFTm9hV3hrS0hSb2FYTXVYeVJqY21WaGRHVkZiWEIwZVVSaGVTZ3BLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200N1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0pIZGxaV3N1WVhCd1pXNWtRMmhwYkdRb2RHaHBjeTVmSkdOeVpXRjBaVVJoZVNoa1lYbHpLU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCa1lYbHpMbk5sZEVSaGRHVW9aR0Y1Y3k1blpYUkVZWFJsS0NrZ0t5QXhLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBa1pHRjVjeTVoY0hCbGJtUkRhR2xzWkNna2QyVmxheWs3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnSkcxdmJuUm9PMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwSnJRdTlDNDBMb2cwTC9RdmlEUmdkR0MwWURRdGRDNzBMclF0U0RRdjlDMTBZRFF0ZEM2MEx2Ump0R0gwTFhRdmRDNDBZOGcwTHpRdGRHQjBZL1JodEN3WEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTBWc1pXMWxiblI5SUNSaGNuSnZkeUJJVkUxTUlOR04wTHZRdGRDODBMWFF2ZEdDWEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnYm1GdFpTQWdJQ0RRbU5DODBZOGdLSEJ5WlhZc0lHNWxlSFFwWEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUhSb2FYTXVYMjl1UVhKeWIzZERiR2xqYXlBOUlHWjFibU4wYVc5dUtDUmhjbkp2ZHl3Z2JtRnRaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2drWVhKeWIzY3VZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RwY3kxa2FYTmhZbXhsWkNjcEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR1JoZEdVZ1BTQnVaWGNnUkdGMFpTaHdZWEp6WlVsdWRDaDBhR2x6TGw4a2JXOXVkR2h6TG5GMVpYSjVVMlZzWldOMGIzSW9KeTVOYjI1MGFDY3BMbVJoZEdGelpYUXVkR2x0WlN3Z01UQXBLVHRjY2x4dUlDQWdJQ0FnSUNCa1lYUmxMbk5sZEUxdmJuUm9LR1JoZEdVdVoyVjBUVzl1ZEdnb0tTQXJJQ2h1WVcxbElEMDlJQ2R3Y21WMkp5QS9JQzEwYUdsekxtOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUWdPaUIwYUdsekxtOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUXBLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdMeThnMExMUmk5R0YwTDdRdENEUXQ5Q3dJTkMvMFlEUXRkQzAwTFhRdTlHTElOQzgwTGpRdmRDNDBMelFzTkM3MFl6UXZkQyswTGtnMExUUXNOR0MwWXRjY2x4dUlDQWdJQ0FnSUNCcFppQW9aR0YwWlNBOElIUm9hWE11YjNCMGFXOXVjeTV0YVc1RVlYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR1JoZEdVdWMyVjBWR2x0WlNoMGFHbHpMbTl3ZEdsdmJuTXViV2x1UkdGMFpTNW5aWFJVYVcxbEtDa3BPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnTHk4ZzBMTFJpOUdGMEw3UXRDRFF0OUN3SU5DLzBZRFF0ZEMwMExYUXU5R0xJTkM4MExEUXV0R0IwTGpRdk5DdzBMdlJqTkM5MEw3UXVTRFF0TkN3MFlMUmkxeHlYRzRnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXViV0Y0UkdGMFpTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCbGJtUkVZWFJsSUQwZ2JtVjNJRVJoZEdVb1pHRjBaUzVuWlhSVWFXMWxLQ2twTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JsYm1SRVlYUmxMbk5sZEUxdmJuUm9LR1Z1WkVSaGRHVXVaMlYwVFc5dWRHZ29LU0FySUhSb2FYTXViM0IwYVc5dWN5NXRiMjUwYUhORGIzVnVkQ2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNobGJtUkVZWFJsSUQ0Z2RHaHBjeTV2Y0hScGIyNXpMbTFoZUVSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdSaGRHVXVjMlYwVkdsdFpTaDBhR2x6TG05d2RHbHZibk11YldGNFJHRjBaUzVuWlhSVWFXMWxLQ2twTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1pHRjBaUzV6WlhSTmIyNTBhQ2hrWVhSbExtZGxkRTF2Ym5Sb0tDa2dMU0IwYUdsekxtOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUWdLeUF4S1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmSkdOeVpXRjBaVTF2Ym5Sb2N5aGtZWFJsS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZLaXBjY2x4dUlDQWdJQ0FxSU5DZzBMWFF2ZEMwMExYUmdDRFF2ZEMxMExUUXRkQzcwTGhjY2x4dUlDQWdJQ0FxSUVCd1lYSmhiU0FnZTBSaGRHVjlJR1JoZEdVZzBKN1FzZEdLMExYUXV0R0NJTkMwMExEUmd0R0xYSEpjYmlBZ0lDQWdLaUJBY21WMGRYSnVJSHRGYkdWdFpXNTBmVnh5WEc0Z0lDQWdJQ292WEhKY2JpQWdJQ0IwYUdsekxsOGtZM0psWVhSbFYyVmxheUE5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0FrZDJWbGF5QTlJSFJvYVhNdVh5UmpjbVZoZEdWRmJHVnRaVzUwS0Z4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JnUEdScGRpQmpiR0Z6Y3oxY0lsZGxaV3RjSWo0OEwyUnBkajVnWEhKY2JpQWdJQ0FnSUNBZ0tUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUNSM1pXVnJPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwS0RRdGRDOTBMVFF0ZEdBSU5DMDBMM1JqMXh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJQ0I3UkdGMFpYMGdaR0YwWlNEUW50Q3gwWXJRdGRDNjBZSWcwTFRRc05HQzBZdGNjbHh1SUNBZ0lDQXFJRUJ5WlhSMWNtNGdlMFZzWlcxbGJuUjlYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVh5UmpjbVZoZEdWRVlYa2dQU0JtZFc1amRHbHZiaWhrWVhSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdiRzlqYTJWa0lEMGdkR2hwY3k1blpYUkVZWGxNYjJOclpXUW9aR0YwWlNrN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2RHOWtZWGtnSUQwZ2RHaHBjeTVmZEc5a1lYa3VaMlYwVkdsdFpTZ3BJRDA5SUdSaGRHVXVaMlYwVkdsdFpTZ3BPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnNaWFFnWTJ4aGMzTk9ZVzFsSUQwZ0p5YzdYSEpjYmlBZ0lDQWdJQ0FnWTJ4aGMzTk9ZVzFsSUNzOUlHeHZZMnRsWkNBL0lDY2dhWE10WkdsellXSnNaV1FuSURvZ0p5YzdYSEpjYmlBZ0lDQWdJQ0FnWTJ4aGMzTk9ZVzFsSUNzOUlHeHZZMnRsWkNBOVBTQk1UME5MWDB4UFEwdEZSQ0EvSUNjZ2FYTXRiRzlqYTJWa0p5QTZJQ2NuTzF4eVhHNGdJQ0FnSUNBZ0lHTnNZWE56VG1GdFpTQXJQU0IwYjJSaGVTQS9JQ2NnYVhNdGRHOWtZWGtuSURvZ0p5YzdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUNSa1lYa2dQU0IwYUdsekxsOGtZM0psWVhSbFJXeGxiV1Z1ZENoY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWUR4a2FYWWdZMnhoYzNNOVhDSkVZWGtrZTJOc1lYTnpUbUZ0WlgxY0lpQmtZWFJoTFhScGJXVTlYQ0lrZTJSaGRHVXVaMlYwVkdsdFpTZ3BmVndpSUdSaGRHRXRaR0Y1UFZ3aUpIdGtZWFJsTG1kbGRFUmhlU2dwZlZ3aVBpUjdaR0YwWlM1blpYUkVZWFJsS0NsOVBDOWthWFkrWUZ4eVhHNGdJQ0FnSUNBZ0lDazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDUmtZWGt1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduWTJ4cFkyc25MQ0IwYUdsekxsOXZia1JoZVVOc2FXTnJSWFpsYm5RdVltbHVaQ2gwYUdsektTazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2doZEdocGN5NXZjSFJwYjI1ekxuTnBibWRzWlUxdlpHVXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdKR1JoZVM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkdGIzVnpaV1Z1ZEdWeUp5d2dkR2hwY3k1ZmIyNUVZWGxOYjNWelpVVnVkR1Z5UlhabGJuUXVZbWx1WkNoMGFHbHpLU2s3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnSkdSaGVUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlOQ2gwTDdRc2RHTDBZTFF1TkMxSU5DNjBMdlF1TkM2MExBZzBML1F2aURRdE5DOTBZNWNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdSWFpsYm5SOUlHVWdSRTlOSU5HQjBMN1FzZEdMMFlMUXVOQzFYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVgyOXVSR0Y1UTJ4cFkydEZkbVZ1ZENBOUlHWjFibU4wYVc5dUtHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDl2YmtSaGVVTnNhV05yS0dVdWRHRnlaMlYwS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZLaXBjY2x4dUlDQWdJQ0FxSU5DaDBMN1FzZEdMMFlMUXVOQzFJTkdGMEw3UXN0QzEwWURRc0Z4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0RmRtVnVkSDBnWlNCRVQwMGcwWUhRdnRDeDBZdlJndEM0MExWY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVmYjI1RVlYbE5iM1Z6WlVWdWRHVnlSWFpsYm5RZ1BTQm1kVzVqZEdsdmJpaGxLU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmYjI1RVlYbE5iM1Z6WlVWdWRHVnlLR1V1ZEdGeVoyVjBLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdktpcGNjbHh1SUNBZ0lDQXFJTkNsMEw3UXN0QzEwWUFnMEwzUXNDRFJqZEM3MExYUXZOQzEwTDNSZ3RDMUlOQzAwTDNSajF4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0RmJHVnRaVzUwZlNBa1pHRjVJRWhVVFV3ZzBLM1F1OUMxMEx6UXRkQzkwWUpjY2x4dUlDQWdJQ0FxTDF4eVhHNGdJQ0FnZEdocGN5NWZiMjVFWVhsTmIzVnpaVVZ1ZEdWeUlEMGdablZ1WTNScGIyNG9KR1JoZVNrZ2UxeHlYRzRnSUNBZ0lDQWdJR2xtSUNnaGRHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlNCOGZDQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCcFppQW9KR1JoZVM1a1lYUmhjMlYwTG5ScGJXVWdQVDBnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiUzVuWlhSVWFXMWxLQ2twSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdaR0YwWlY5MGJ5QTlJRzVsZHlCRVlYUmxLSEJoY25ObFNXNTBLQ1JrWVhrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQ2gwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdktpcGNjbHh1SUNBZ0lDQXFJTkNhMEx2UXVOQzZJTkMvMEw0ZzBMVFF2ZEdPWEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTBWc1pXMWxiblI5SUNSa1lYa2dTRlJOVENEUXJkQzcwTFhRdk5DMTBMM1JnbHh5WEc0Z0lDQWdJQ292WEhKY2JpQWdJQ0IwYUdsekxsOXZia1JoZVVOc2FXTnJJRDBnWm5WdVkzUnBiMjRvSkdSaGVTa2dlMXh5WEc0Z0lDQWdJQ0FnSUM4dklOQzAwTFhRdmRHTUlOQzMwTERRc2RDNzBMN1F1dEM0MFlEUXZ0Q3kwTERRdlZ4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2drWkdGNUxtTnNZWE56VEdsemRDNWpiMjUwWVdsdWN5Z25hWE10WkdsellXSnNaV1FuS1NrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0F2THlEUXN0R0wwTEhRdnRHQUlOQyswTFRRdmRDKzBMa2cwTFRRc05HQzBZdGNjbHh1SUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTV2Y0hScGIyNXpMbk5wYm1kc1pVMXZaR1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXlZVzVuWlZKbGMyVjBLQ2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ1JrWVhrdVkyeGhjM05NYVhOMExtRmtaQ2duYVhNdGMyVnNaV04wWldRbktUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTVmWTJGc2JHSmhZMnNvSjJSaGVWTmxiR1ZqZENjc0lHNWxkeUJFWVhSbEtIQmhjbk5sU1c1MEtDUmtZWGt1WkdGMFlYTmxkQzUwYVcxbExDQXhNQ2twS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnTHk4ZzBZSFFzZEdBMEw3UmdTRFFzdEdMMExIUmdOQ3cwTDNRdmRDKzBMUFF2aURSZ05DdzBMM1F0ZEMxSU5DMDBMalFzTkMvMExEUXQ5QyswTDNRc0Z4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5bWNtOXRJQ1ltSUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdWNtRnVaMlZTWlhObGRDZ3BPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnSkdSaGVTNWpiR0Z6YzB4cGMzUXVZV1JrS0NkcGN5MXpaV3hsWTNSbFpDY3BPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURRc3RHTDBMSFJnTkN3MEwzUXNDRFF2ZEN3MFlmUXNOQzcwWXpRdmRDdzBZOGdMeURRdXRDKzBMM1F0ZEdIMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tDRjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYMlp5YjIwZ1BTQnVaWGNnUkdGMFpTaHdZWEp6WlVsdWRDZ2taR0Y1TG1SaGRHRnpaWFF1ZEdsdFpTd2dNVEFwS1R0Y2NseHVJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLQ0YwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjkwYnlBOUlHNWxkeUJFWVhSbEtIQmhjbk5sU1c1MEtDUmtZWGt1WkdGMFlYTmxkQzUwYVcxbExDQXhNQ2twTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMGdKaVlnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdMeThnMExUUXZ0Qy8wWVBSZ2RHQzBMalF2TkdMMExrZzBMVFF1TkN3MEwvUXNOQzMwTDdRdlZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb0lYUm9hWE11WjJWMFNYTlNZVzVuWlZObGJHVmpkR0ZpYkdVb2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlN3Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TG5KaGJtZGxVbVZ6WlhRb0tUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJqdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1eVlXNW5aVk5sYkdWamRDaDBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dExDQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjkwYnlrN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwS0hRc2RHQTBMN1JnU0RRc3RHTDBMVFF0ZEM3MExYUXZkQzkwWXZSaFNEUXROQ3cwWUpjY2x4dUlDQWdJQ0FxTDF4eVhHNGdJQ0FnZEdocGN5NXlZVzVuWlZKbGMyVjBJRDBnWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFNaWE5sZENncE8xeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpQTlJSHQ5TzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHFLbHh5WEc0Z0lDQWdJQ29nMEpMUXVOQzMwWVBRc05DNzBZelF2ZEdMMExrZzBZSFFzZEdBMEw3UmdTRFFzdEdMMExUUXRkQzcwTFhRdmRDOTBZdlJoU0RRdE5DdzBZSmNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdkR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFNaWE5sZENBOUlHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJQ1JrWVhseklEMGdkR2hwY3k1ZkpHMXZiblJvY3k1eGRXVnllVk5sYkdWamRHOXlRV3hzS0NjdVJHRjVXMlJoZEdFdGRHbHRaVjBuS1R0Y2NseHVJQ0FnSUNBZ0lDQWtaR0Y1Y3k1bWIzSkZZV05vS0NSa1lYa2dQVDRnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FrWkdGNUxtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb0oybHpMWE5sYkdWamRHVmtKeXdnSjJsekxYTmxiR1ZqZEdWa0xXWnliMjBuTENBbmFYTXRjMlZzWldOMFpXUXRkRzhuTENBbmFYTXRjMlZzWldOMFpXUXRZbVYwZDJWbGJpY3BPMXh5WEc0Z0lDQWdJQ0FnSUgwcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBKTFF1TkMzMFlQUXNOQzcwWXpRdmRDKzBMVWcwTExSaTlDMDBMWFF1OUMxMEwzUXVOQzFJTkMwMExEUmdseHlYRzRnSUNBZ0lDb2dRSEJoY21GdElIdEVZWFJsZlNCa1lYUmxYMlp5YjIwZzBKM1FzTkdIMExEUXU5R00wTDNRc05HUElOQzAwTERSZ3RDd1hISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UwUmhkR1Y5SUdSaGRHVmZkRzhnSUNEUW10QyswTDNRdGRHSDBMM1FzTkdQSU5DMDBMRFJndEN3WEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUhSb2FYTXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBJRDBnWm5WdVkzUnBiMjRvWkdGMFpWOW1jbTl0TENCa1lYUmxYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdhV1lnS0dSaGRHVmZabkp2YlNBbUppQmtZWFJsWDJaeWIyMGdhVzV6ZEdGdVkyVnZaaUJFWVhSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHUmhkR1ZmWm5KdmJTNXpaWFJJYjNWeWN5Z3dMQ0F3TENBd0xDQXdLVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUdsbUlDaGtZWFJsWDNSdklDWW1JR1JoZEdWZmRHOGdhVzV6ZEdGdVkyVnZaaUJFWVhSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHUmhkR1ZmZEc4dWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0F2THlEUXN0R0wwTEhRdnRHQUlOQzAwTERSZ2lEUXNpRFF2dEN4MFlEUXNOR0MwTDNRdnRDOElOQy8wTDdSZ05HUDBMVFF1dEMxWEhKY2JpQWdJQ0FnSUNBZ2FXWWdLR1JoZEdWZlpuSnZiU0ErSUdSaGRHVmZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnVzJSaGRHVmZabkp2YlN3Z1pHRjBaVjkwYjEwZ1BTQmJaR0YwWlY5MGJ5d2daR0YwWlY5bWNtOXRYVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJSFJwYldWZlpuSnZiU0E5SUdSaGRHVmZabkp2YlNCcGJuTjBZVzVqWlc5bUlFUmhkR1VnUHlCa1lYUmxYMlp5YjIwdVoyVjBWR2x0WlNncElEb2dNRHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0IwYVcxbFgzUnZJRDBnWkdGMFpWOTBieUJwYm5OMFlXNWpaVzltSUVSaGRHVWdQeUJrWVhSbFgzUnZMbWRsZEZScGJXVW9LU0E2SURBN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ0pHUmhlWE1nUFNCMGFHbHpMbDhrYlc5dWRHaHpMbkYxWlhKNVUyVnNaV04wYjNKQmJHd29KeTVFWVhsYlpHRjBZUzEwYVcxbFhTY3BPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURRc3RHTDBMVFF0ZEM3MExYUXZkQzQwTFVnMExUUXNOR0NJTkM4MExYUXR0QzAwWU1nMEwzUXNOR0gwTERRdTlHTTBMM1F2dEM1SU5DNElOQzYwTDdRdmRDMTBZZlF2ZEMrMExsY2NseHVJQ0FnSUNBZ0lDQm1iM0lnS0d4bGRDQnBJRDBnTURzZ2FTQThJQ1JrWVhsekxteGxibWQwYURzZ0t5dHBLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ1JrWVhselcybGRMbU5zWVhOelRHbHpkQzUwYjJkbmJHVW9KMmx6TFhObGJHVmpkR1ZrTFdKbGRIZGxaVzRuTENBa1pHRjVjMXRwWFM1a1lYUmhjMlYwTG5ScGJXVWdQaUIwYVcxbFgyWnliMjBnSmlZZ0pHUmhlWE5iYVYwdVpHRjBZWE5sZEM1MGFXMWxJRHdnZEdsdFpWOTBieWs3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5RFFzdEdMMExUUXRkQzcwTFhRdmRDNDBMVWcwTDNRc05HSDBMRFF1OUdNMEwzUXZ0QzVJTkM0SU5DNjBMN1F2ZEMxMFlmUXZkQyswTGtnMEwvUXZ0QzMwTGpSaHRDNDBMaGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQWtaR0Y1WDJaeWIyMGdQU0IwYUdsekxsOGtaMlYwUkdGNVFubEVZWFJsS0dSaGRHVmZabkp2YlNrN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ0pHUmhlVjkwYnlBOUlIUm9hWE11WHlSblpYUkVZWGxDZVVSaGRHVW9aR0YwWlY5MGJ5azdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDOHZJTkM2MExYUmlDRFF0TkM3MFk4ZzBMSFJpOUdCMFlMUmdOQyswTFBRdmlEUmdkQ3gwWURRdnRHQjBMQWcwWUhSZ3RDdzBZRFF2dEN6MEw0ZzBMTFJpOUMwMExYUXU5QzEwTDNRdU5HUFhISmNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBMaVJrWVhsZlpuSnZiVjl2YkdRZ0ppWWdkR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFRaV3hsWTNRdUpHUmhlVjltY205dFgyOXNaQ0FoUFNBa1pHRjVYMlp5YjIwcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1F1SkdSaGVWOW1jbTl0WDI5c1pDNWpiR0Z6YzB4cGMzUXVjbVZ0YjNabEtDZHBjeTF6Wld4bFkzUmxaQ2NzSUNkcGN5MXpaV3hsWTNSbFpDMW1jbTl0SnlrN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURRdXRDMTBZZ2cwTFRRdTlHUElOQ3gwWXZSZ2RHQzBZRFF2dEN6MEw0ZzBZSFFzZEdBMEw3UmdkQ3dJTkdCMFlMUXNOR0EwTDdRczlDK0lOQ3kwWXZRdE5DMTBMdlF0ZEM5MExqUmoxeHlYRzRnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQzRrWkdGNVgzUnZYMjlzWkNBbUppQjBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGTmxiR1ZqZEM0a1pHRjVYM1J2WDI5c1pDQWhQU0FrWkdGNVgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVgzSmhibWRsVm1semRXRnNVMlZzWldOMExpUmtZWGxmZEc5ZmIyeGtMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMmx6TFhObGJHVmpkR1ZrSnl3Z0oybHpMWE5sYkdWamRHVmtMWFJ2SnlrN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvSkdSaGVWOW1jbTl0S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNSa1lYbGZabkp2YlM1amJHRnpjMHhwYzNRdVlXUmtLQ2RwY3kxelpXeGxZM1JsWkNjc0lDZHBjeTF6Wld4bFkzUmxaQzFtY205dEp5azdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb0pHUmhlVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBa1pHRjVYM1J2TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMmx6TFhObGJHVmpkR1ZrSnl3Z0oybHpMWE5sYkdWamRHVmtMWFJ2SnlrN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURSZ2RDKzBZWFJnTkN3MEwzUXRkQzkwTGpRdFNEUXNpRFF1dEMxMFloY2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGTmxiR1ZqZEM0a1pHRjVYMlp5YjIxZmIyeGtJRDBnSkdSaGVWOW1jbTl0TzF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wTGlSa1lYbGZkRzlmYjJ4a0lEMGdKR1JoZVY5MGJ6dGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlOQ1MwWXZRdE5DMTBMdlF0ZEM5MExqUXRTRFF0TkM0MExEUXY5Q3cwTGZRdnRDOTBMQWcwTFRRc05HQ1hISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UwUmhkR1Y5SUdSaGRHVmZabkp2YlNEUW5kQ3cwWWZRc05DNzBZelF2ZEN3MFk4ZzBMVFFzTkdDMExCY2NseHVJQ0FnSUNBcUlFQndZWEpoYlNCN1JHRjBaWDBnWkdGMFpWOTBieUFnSU5DYTBMN1F2ZEMxMFlmUXZkQ3cwWThnMExUUXNOR0MwTEJjY2x4dUlDQWdJQ0FxTDF4eVhHNGdJQ0FnZEdocGN5NXlZVzVuWlZObGJHVmpkQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVmZabkp2YlN3Z1pHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJR1JoZEdWZlpuSnZiUzV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVJQ0FnSUNBZ0lDQmtZWFJsWDNSdkxuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURRdE5DKzBML1JnOUdCMFlMUXVOQzgwWXZRdVNEUXROQzQwTERRdjlDdzBMZlF2dEM5WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLQ0YwYUdsekxtZGxkRWx6VW1GdVoyVlRaV3hsWTNSaFlteGxLR1JoZEdWZlpuSnZiU3dnWkdGMFpWOTBieWtwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnYkdWMElDUmtZWGxmWm5KdmJTd2dKR1JoZVY5MGJ6dGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0x5OGcwTExSaTlDeDBMN1JnQ0RRdE5DdzBZSWcwTElnMEw3UXNkR0EwTERSZ3RDOTBMN1F2Q0RRdjlDKzBZRFJqOUMwMExyUXRWeHlYRzRnSUNBZ0lDQWdJR2xtSUNoa1lYUmxYMlp5YjIwZ1BpQmtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lGdGtZWFJsWDJaeWIyMHNJR1JoZEdWZmRHOWRJRDBnVzJSaGRHVmZkRzhzSUdSaGRHVmZabkp2YlYwN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNSa1lYbGZabkp2YlNBOUlIUm9hWE11WHlSblpYUkVZWGxDZVVSaGRHVW9aR0YwWlY5bWNtOXRLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdKR1JoZVY5MGJ5QTlJSFJvYVhNdVh5Um5aWFJFWVhsQ2VVUmhkR1VvWkdGMFpWOTBieWs3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCcFppQW9KR1JoZVY5bWNtOXRLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ1JrWVhsZlpuSnZiUzVqYkdGemMweHBjM1F1WVdSa0tDZHBjeTF6Wld4bFkzUmxaQ2NzSUNkcGN5MXpaV3hsWTNSbFpDMW1jbTl0SnlrN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvSkdSaGVWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FrWkdGNVgzUnZMbU5zWVhOelRHbHpkQzVoWkdRb0oybHpMWE5sYkdWamRHVmtKeXdnSjJsekxYTmxiR1ZqZEdWa0xYUnZKeWs3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5RFFzdEdMMExUUXRkQzcwTFhRdmRDNDBMVWcwWTNRdTlDMTBMelF0ZEM5MFlMUXZ0Q3lYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUW9aR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdMeThnMFlIUXZ0Q3gwWXZSZ3RDNDBMVmNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOWpZV3hzWW1GamF5Z25jbUZ1WjJWVFpXeGxZM1FuTENCa1lYUmxYMlp5YjIwc0lHUmhkR1ZmZEc4cE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBKL1JnTkMrMExMUXRkR0EwTHJRc0NEUXN0QyswTGZRdk5DKzBMYlF2ZEMrMFlIUmd0QzRJTkN5MFl2UXROQzEwTHZRdGRDOTBMalJqeURRdE5DdzBZSmNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQWdlMFJoZEdVZ1pHRjBaVjltY205dElOQ2QwTERSaDlDdzBMdlJqTkM5MExEUmp5RFF0TkN3MFlMUXNGeHlYRzRnSUNBZ0lDb2dRSEJoY21GdElDQjdSR0YwWlNCa1lYUmxYM1J2SUNBZzBKclF2dEM5MExYUmg5QzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdJQ0FnSUNvZ1FISmxkSFZ5YmlCN1FtOXZiR1ZoYm4xY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVuWlhSSmMxSmhibWRsVTJWc1pXTjBZV0pzWlNBOUlHWjFibU4wYVc5dUtHUmhkR1ZmWm5KdmJTd2daR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUdSaGRHVmZabkp2YlM1elpYUkliM1Z5Y3lnd0xDQXdMQ0F3TENBd0tUdGNjbHh1SUNBZ0lDQWdJQ0JrWVhSbFgzUnZMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb1pHRjBaVjltY205dElENGdaR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmJaR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZYU0E5SUZ0a1lYUmxYM1J2TENCa1lYUmxYMlp5YjIxZE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdMeThnMEx6UXVOQzkwTGpRdk5DdzBMdlJqTkM5MFl2UXVTRFF0TkM0MExEUXY5Q3cwTGZRdnRDOVhISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1pHbG1aaUE5SUUxaGRHZ3VZV0p6S0dSaGRHVmZabkp2YlM1blpYUlVhVzFsS0NrZ0xTQmtZWFJsWDNSdkxtZGxkRlJwYldVb0tTa2dMeUF4TURBd0lDOGdPRFkwTURBN1hISmNiaUFnSUNBZ0lDQWdhV1lnS0dScFptWWdQQ0IwYUdsekxtOXdkR2x2Ym5NdWJXbHVSR0Y1Y3lrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0F2THlEUXY5R0EwTDdRc3RDMTBZRFF1dEN3SU5DLzBMN1F2OUN3MExUUXNOQzkwTGpSanlEUXNpRFF0TkM0MExEUXY5Q3cwTGZRdnRDOUlOQzMwTERRc2RDNzBMN1F1dEM0MFlEUXZ0Q3kwTERRdmRDOTBZdlJoU0RRdE5DdzBZSmNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQmtZWGtnUFNCdVpYY2dSR0YwWlNncE8xeHlYRzRnSUNBZ0lDQWdJR1JoZVM1elpYUlVhVzFsS0dSaGRHVmZabkp2YlM1blpYUlVhVzFsS0NrcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCM2FHbHNaU0FvWkdGNUlEd2daR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NW5aWFJFWVhsTWIyTnJaV1FvWkdGNUtTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmtZWGt1YzJWMFJHRjBaU2hrWVhrdVoyVjBSR0YwWlNncElDc2dNU2s3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEhKMVpUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlOQ2YwWURRdnRDeTBMWFJnTkM2MExBZzBMM1FzQ0RRdE5DKzBZSFJndEdEMEwvUXZkQyswWUhSZ3RHTUlOQzAwTDNSanlEUXROQzcwWThnMExIUmdOQyswTDNRdUZ4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUNCN1JHRjBaWDBnWkdGMFpTRFFsTkN3MFlMUXNGeHlYRzRnSUNBZ0lDb2dRSEpsZEhWeWJpQjdRbTl2YkdWaGJuMGdJQ0IwY25WbElOQzEwWUhRdTlDNElOQzAwTDdSZ2RHQzBZUFF2OUMxMEwxY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVuWlhSRVlYbE1iMk5yWldRZ1BTQm1kVzVqZEdsdmJpaGtZWFJsS1NCN1hISmNiaUFnSUNBZ0lDQWdMeThnMExMUmk5Q3gwTDdSZ0NEUXROQ3cwWUlnMExMUXZkQzFJTkMwMEw3UmdkR0MwWVBRdjlDOTBMN1FzOUMrSU5DMDBMalFzTkMvMExEUXQ5QyswTDNRc0Z4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2hrWVhSbElEd2dkR2hwY3k1dmNIUnBiMjV6TG0xcGJrUmhkR1VnZkh3Z1pHRjBaU0ErSUhSb2FYTXViM0IwYVc5dWN5NXRZWGhFWVhSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCTVQwTkxYMVZPUVZaQlNVeEJRa3hGTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1c2IyTnJSR0Y1YzBacGJIUmxjaWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdkR2hwY3k1dmNIUnBiMjV6TG14dlkydEVZWGx6Um1sc2RHVnlLR1JoZEdVcE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHFLbHh5WEc0Z0lDQWdJQ29nMEszUXU5QzEwTHpRdGRDOTBZSWcwTHJRc05DNzBMWFF2ZEMwMExEUmdOQzkwTDdRczlDK0lOQzAwTDNSajF4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUNCN1JHRjBaWDBnWkdGMFpTRFFsTkN3MFlMUXNGeHlYRzRnSUNBZ0lDb2dRSEpsZEhWeWJpQjdSV3hsYldWdWRIMGdJQ0JJVkUxTUlOR04wTHZRdGRDODBMWFF2ZEdDWEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUhSb2FYTXVYeVJuWlhSRVlYbENlVVJoZEdVZ1BTQm1kVzVqZEdsdmJpaGtZWFJsS1NCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2RHbHRaU0E5SUdSaGRHVWdhVzV6ZEdGdVkyVnZaaUJFWVhSbElEOGdaR0YwWlM1blpYUlVhVzFsS0NrZ09pQXdPMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxsOGtiVzl1ZEdoekxuRjFaWEo1VTJWc1pXTjBiM0lvSnk1RVlYbGJaR0YwWVMxMGFXMWxQVndpSnlBcklIUnBiV1VnS3lBblhDSmRKeWs3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5b3FYSEpjYmlBZ0lDQWdLaURRb05DMTBMM1F0TkMxMFlBZzBMVFF2ZEdQSUMwZzBMZlFzTkN6MEx2Umc5R0kwTHJRdUZ4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUNCN1JHRjBaWDBnWkdGMFpTRFFudEN4MFlyUXRkQzYwWUlnMExUUXNOR0MwWXRjY2x4dUlDQWdJQ0FxSUVCeVpYUjFjbTRnZTBWc1pXMWxiblI5WEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUhSb2FYTXVYeVJqY21WaGRHVkZiWEIwZVVSaGVTQTlJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUNSa1lYa2dQU0IwYUdsekxsOGtZM0psWVhSbFJXeGxiV1Z1ZENoY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWUR4a2FYWWdZMnhoYzNNOVhDSkVZWGtnYVhNdFpXMXdkSGxjSWo0OEwyUnBkajVnWEhKY2JpQWdJQ0FnSUNBZ0tUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUNSa1lYazdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRFFvZEMrMExmUXROQ3cwTDNRdU5DMUlOR04wTHZRdGRDODBMWFF2ZEdDMExBZzBMalF0eUJJVkUxTUlOR0MwTFhRdXRHQjBZTFFzRnh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJQ0I3VTNSeWFXNW5mU0JvZEcxc0lFaFVUVXdnMFlMUXRkQzYwWUhSZ2x4eVhHNGdJQ0FnSUNvZ1FISmxkSFZ5YmlCN1JXeGxiV1Z1ZEgxY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVmSkdOeVpXRjBaVVZzWlcxbGJuUWdQU0JtZFc1amRHbHZiaWhvZEcxc0tTQjdYSEpjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdaR2wySUQwZ1pHOWpkVzFsYm5RdVkzSmxZWFJsUld4bGJXVnVkQ2duWkdsMkp5azdYSEpjYmlBZ0lDQWdJQ0FnWkdsMkxtbHVjMlZ5ZEVGa2FtRmpaVzUwU0ZSTlRDZ25ZV1owWlhKaVpXZHBiaWNzSUdoMGJXd3BPMXh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJrYVhZdVkyaHBiR1J5Wlc0dWJHVnVaM1JvSUQ0Z01TQS9JR1JwZGk1amFHbHNaSEpsYmlBNklHUnBkaTVtYVhKemRFVnNaVzFsYm5SRGFHbHNaRHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdktpcGNjbHh1SUNBZ0lDQXFJRk5oWm1VZzBMTFJpOUMzMEw3UXNpRFFzdEM5MExYUmlOQzkwTGpSaFNEUmdkQyswTEhSaTlHQzBMalF1U0RRdXRDKzBMelF2OUMrMEwzUXRkQzkwWUxRc0Z4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0VGRISnBibWQ5SUdZZzBKalF2TkdQSU5HQjBMN1FzZEdMMFlMUXVOR1BYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVgyTmhiR3hpWVdOcklEMGdablZ1WTNScGIyNG9aaWtnZTF4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR2hwY3k1dmNIUnBiMjV6TG05dVcyWmRJRDA5SUNkbWRXNWpkR2x2YmljcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXViM0IwYVc5dWN5NXZibHRtWFM1aGNIQnNlU2gwYUdsekxDQmJYUzV6YkdsalpTNWpZV3hzS0dGeVozVnRaVzUwY3l3Z01Ta3BPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUhSb2FYTXVhVzVwZENncE8xeHlYRzU5WEhKY2JseHlYRzVsZUhCdmNuUWdaR1ZtWVhWc2RDQkVZWFJsVW1GdVoyVlFhV05yWlhJN1hISmNiaUpkTENKemIzVnlZMlZTYjI5MElqb2lJbjA9IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCBEYXRlUmFuZ2VQaWNrZXIgZnJvbSAnLi4vLi4vZGlzdC9kYXRlcmFuZ2VwaWNrZXInO1xyXG5pbXBvcnQge0xPQ0tfVU5BVkFJTEFCTEUsIExPQ0tfTE9DS0VEfSBmcm9tICcuLi8uLi9kaXN0L2RhdGVyYW5nZXBpY2tlcic7XHJcblxyXG5jb25zdCAkZm9ybSA9IGRvY3VtZW50LmZvcm1zWzBdO1xyXG5jb25zdCAkZGF0ZV9mcm9tID0gJGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9XCJkYXRlX2Zyb21cIl0nKTtcclxuY29uc3QgJGRhdGVfdG8gICA9ICRmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZGF0ZV90b1wiXScpO1xyXG5cclxuZnVuY3Rpb24gaXNNb2JpbGUoKSB7XHJcbiAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGggPD0gOTYwO1xyXG59XHJcblxyXG4vLyDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0LUg0LTQsNGC0YtcclxuY29uc3QgYmxvY2tlZERhdGVzID0ge307XHJcbmNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG5kYXRlLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5mb3IgKGxldCBpID0gMDsgaSA8IDYwOyArK2kpIHtcclxuICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC42KSB7XHJcbiAgICAgICAgYmxvY2tlZERhdGVzW2RhdGVdID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG59XHJcblxyXG5uZXcgRGF0ZVJhbmdlUGlja2VyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkYXRlcmFuZ2VwaWNrZXInKSwge1xyXG4gICAgbWluRGF0ZTogbmV3IERhdGUoKSxcclxuICAgIG1heERhdGU6IG5ldyBEYXRlKCcyMDIyLTA1LTIwJyksXHJcbiAgICBtb250aHNDb3VudDogaXNNb2JpbGUoKSA/IDEyIDogMixcclxuICAgIHBlclJvdzogMyxcclxuICAgIHNpbmdsZU1vZGU6IGZhbHNlLFxyXG4gICAgb246IHtcclxuICAgICAgICByYW5nZVNlbGVjdDogZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICAgICAgICAgICRkYXRlX2Zyb20udmFsdWUgPSBkYXRlX2Zyb20udG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICRkYXRlX3RvLnZhbHVlID0gZGF0ZV90by50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRheVNlbGVjdDogZnVuY3Rpb24oZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgICAgICRkYXRlX2Zyb20udmFsdWUgPSBkYXRlX2Zyb20udG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBsb2NrRGF5c0ZpbHRlcjogZnVuY3Rpb24oZGF5KSB7XHJcbiAgICAgICAgaWYgKGJsb2NrZWREYXRlc1tkYXldKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBMT0NLX0xPQ0tFRDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=