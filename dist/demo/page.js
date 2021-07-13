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

    /**
     * Инициализация
     */
    this.init = function() {
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

        const $day = this._$createElement(
            `<div class="Day${locked ? ' is-disabled' : ''}${locked == LOCK_LOCKED ? ' is-locked' : ''}" data-time="${date.getTime()}" data-day="${date.getDay()}">${date.getDate()}</div>`
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9zY3NzL2luZGV4LnNjc3M/NTYxOCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9zcmMvanMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87O1VDVkE7VUFDQTs7Ozs7V0NEQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7OztBQ05BOzs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNPO0FBQ0E7O0FBRVAsaURBQWlEO0FBQ2pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxrQkFBa0I7QUFDM0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVB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QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixLQUFLO0FBQ3JCLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixLQUFLO0FBQ3JCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixPQUFPO0FBQ3ZCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpRUFBZSxlQUFlLEVBQUMiLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJEYXRlcmFuZ2VwaWNrZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8g0YHQvtGB0YLQvtGP0L3QuNGPINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuZXhwb3J0IGNvbnN0IExPQ0tfVU5BVkFJTEFCTEUgPSAxO1xyXG5leHBvcnQgY29uc3QgTE9DS19MT0NLRUQgICAgICA9IDI7XHJcblxyXG5mdW5jdGlvbiBEYXRlUmFuZ2VQaWNrZXIoJGNvbnRhaW5lciwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICB0aGlzLl8kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgZmlyc3REYXlPZlRoZVdlZWs6IG9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgfHwgMSwgICAgICAgICAgLy8g0L/QtdGA0LLRi9C5INC00LXQvdGMINC90LXQtNC10LvQuCwgMCA9INCy0YEsIDEgPSDQv9C9LCAuLi5cclxuICAgICAgICBzaW5nbGVNb2RlOiAgICAgICAgb3B0aW9ucy5zaW5nbGVNb2RlICAgICAgICB8fCBmYWxzZSwgICAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0Ysg0LLQvNC10YHRgtC+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgIGxvY2FsZTogICAgICAgICAgICBvcHRpb25zLmxvY2FsZSAgICAgICAgICAgIHx8ICdydS1SVScsXHJcbiAgICAgICAgbWluRGF5czogICAgICAgICAgIG9wdGlvbnMubWluRGF5cyAgICAgICAgICAgfHwgMSwgICAgICAgICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuSDQsiDQtNC40LDQv9Cw0LfQvtC90LVcclxuICAgICAgICBtb250aHNDb3VudDogICAgICAgb3B0aW9ucy5tb250aHNDb3VudCAgICAgICB8fCAxMixcclxuICAgICAgICBwZXJSb3c6ICAgICAgICAgICAgb3B0aW9ucy5wZXJSb3cgICAgICAgICAgICB8fCB1bmRlZmluZWQsICAvLyDQutC+0LvQuNGH0LXRgdGC0LLQviDQvNC10YHRj9GG0LXQsiDQsiDRgNGP0LTRg1xyXG4gICAgICAgIG1pbkRhdGU6ICAgICAgICAgICBvcHRpb25zLm1pbkRhdGUgICAgICAgICAgIHx8IG5ldyBEYXRlKCksIC8vINC80LjQvdC40LzQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAgICBtYXhEYXRlOiAgICAgICAgICAgb3B0aW9ucy5tYXhEYXRlICAgICAgICAgICB8fCB1bmRlZmluZWQsXHJcbiAgICAgICAgbG9ja0RheXNGaWx0ZXI6ICAgIG9wdGlvbnMubG9ja0RheXNGaWx0ZXIgICAgfHwgdW5kZWZpbmVkLCAgLy8gY2FsbGJhY2soZGF0ZSkg0YTRg9C90LrRhtC40Y8g0LHQu9C+0LrQuNGA0L7QstCw0L3QuNGPINC00LDRgiwgdHJ1ZS9MT0NLXHJcbiAgICAgICAgb246IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICByYW5nZVNlbGVjdDogbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICAgICAgICAgICAgZGF5U2VsZWN0OiBudWxsLCAgIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQvtC00L3QvtC5INC00LDRgtGLICjRgtC+0LvRjNC60L4g0L/RgNC4IHNpbmdsZU1vZGU6IHRydWUpXHJcbiAgICAgICAgfSwgb3B0aW9ucy5vbiB8fCB7fSksXHJcbiAgICB9XHJcblxyXG4gICAgLy8g0YDRj9C00L3QvtGB0YLRjFxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMucGVyUm93ID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnBlclJvdyA9IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPXHJcbiAgICAgKi9cclxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuXyRwaWNrZXIgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX21vbnRoc1wiPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8g0Y3Qu9C10LzQtdC90YLRi1xyXG4gICAgICAgIHRoaXMuXyRtb250aHMgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5EYXRlcmFuZ2VwaWNrZXJfX21vbnRocycpO1xyXG5cclxuICAgICAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuXHJcbiAgICAgICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICAgICAgdGhpcy5fJGNyZWF0ZU1vbnRocyh0aGlzLm9wdGlvbnMubWluRGF0ZSk7XHJcbiAgICAgICAgdGhpcy5fJGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl8kcGlja2VyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCd0LDQt9Cy0LDQvdC40LUg0LzQtdGB0Y/RhtCwXHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldE1vbnRoRm9ybWF0dGVkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7bW9udGg6ICdsb25nJ30pO1xyXG4gICAgICAgIHJldHVybiB0aXRsZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpICsgdGl0bGUuc2xpY2UoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INC00LDRgtGLINC00LvRjyDRgtC10LrRg9GJ0LXQuSDQu9C+0LrQsNC70LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9ICAgZGF0ZSAgICDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyDQn9Cw0YDQsNC80LXRgtGA0YtcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXREYXRlVGltZUZvcm1hdCA9IGZ1bmN0aW9uKGRhdGUsIG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gSW50bC5EYXRlVGltZUZvcm1hdCh0aGlzLm9wdGlvbnMubG9jYWxlLCBvcHRpb25zKS5mb3JtYXQoZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC90Lgg0L3QtdC00LXQu9C4XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0V2Vla0RheXNGb3JtYXR0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gMik7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyArK2kpIHtcclxuICAgICAgICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGRheTogZGF0ZS5nZXREYXkoKSxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHt3ZWVrZGF5OiAnc2hvcnQnfSksXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0YHQvtCz0LvQsNGB0L3QviDQvdCw0YHRgtGA0L7QtdC90L3QvtC80YMg0L/QtdGA0LLQvtC80YMg0LTQvdGOINC90LXQtNC10LvQuFxyXG4gICAgICAgIHJlc3VsdC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0RGF5T2ZUaGVXZWVrID0gdGhpcy5vcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrICUgNztcclxuICAgICAgICAgICAgbGV0IGRheUEgPSBhLmRheTtcclxuICAgICAgICAgICAgbGV0IGRheUIgPSBiLmRheTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXlBID09IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkYXlCID09IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRheUEgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICAgICAgZGF5QSArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF5QiA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgICAgICBkYXlCICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkYXlBIC0gZGF5QjtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC80LXRgdGP0YbQtVxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEByZXR1cm4ge051bWJlcn0gICAg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXREYXlzQ291bnRJbk1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGRheXMgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgICAgICBkYXlzLnNldE1vbnRoKGRheXMuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgICAgIGRheXMuc2V0RGF0ZSgwKTtcclxuICAgICAgICByZXR1cm4gZGF5cy5nZXREYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10L3QtNC10YAg0LTQuNCw0L/QsNC30L7QvdCwINC80LXRgdGP0YbQtdCyXHJcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRocyA9IGZ1bmN0aW9uKGRhdGVfZnJvbSkge1xyXG4gICAgICAgIHdoaWxlICh0aGlzLl8kbW9udGhzLmxhc3RFbGVtZW50Q2hpbGQpIHtcclxuICAgICAgICAgICAgdGhpcy5fJG1vbnRocy5yZW1vdmVDaGlsZCh0aGlzLl8kbW9udGhzLmxhc3RFbGVtZW50Q2hpbGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0L/RgNC10YDQtdC90LTQtdGAINC80LXRgdGP0YbQtdCyXHJcbiAgICAgICAgY29uc3QgY3VycmVudERhdGUgPSBuZXcgRGF0ZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuICAgICAgICBjb25zdCAkbW9udGhzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7ICsraSkge1xyXG4gICAgICAgICAgICAkbW9udGhzLnB1c2godGhpcy5fJGNyZWF0ZU1vbnRoKGN1cnJlbnREYXRlKSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnREYXRlLnNldE1vbnRoKGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJG1vbnRocy5sZW5ndGg7IGkgKz0gdGhpcy5vcHRpb25zLnBlclJvdykge1xyXG4gICAgICAgICAgICBjb25zdCAkcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICRyb3cuY2xhc3NOYW1lID0gJ0RhdGVyYW5nZXBpY2tlcl9fcm93JztcclxuXHJcbiAgICAgICAgICAgICRtb250aHMuc2xpY2UoaSwgaSArIHRoaXMub3B0aW9ucy5wZXJSb3cpLmZvckVhY2goJG1vbnRoID0+IHtcclxuICAgICAgICAgICAgICAgICRyb3cuYXBwZW5kQ2hpbGQoJG1vbnRoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl8kbW9udGhzLmFwcGVuZENoaWxkKCRyb3cpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbiAmJiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQvdC00LXRgCDQvNC10YHRj9GG0LBcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZSDQnNC10YHRj9GGXHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVNb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCBjdXJyZW50TW9udGggPSBkYXRlLmdldE1vbnRoKCk7XHJcbiAgICAgICAgY29uc3QgbW9udGhUaXRsZSA9IHRoaXMuZ2V0TW9udGhGb3JtYXR0ZWQoZGF0ZSk7XHJcbiAgICAgICAgY29uc3Qgd2Vla0RheXMgPSB0aGlzLmdldFdlZWtEYXlzRm9ybWF0dGVkKCk7XHJcblxyXG4gICAgICAgIGNvbnN0ICRtb250aCA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgICAgICBgPGRpdiBjbGFzcz1cIk1vbnRoXCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9faGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLXByZXYkeyh0aGlzLm9wdGlvbnMubWluRGF0ZSAmJiBkYXRlIDw9IHRoaXMub3B0aW9ucy5taW5EYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNyAxM0wxIDdMNyAxXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fdGl0bGVcIj4ke21vbnRoVGl0bGV9ICR7ZGF0ZS5nZXRGdWxsWWVhcigpfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fYXJyb3cgTW9udGhfX2Fycm93LS1uZXh0JHsodGhpcy5vcHRpb25zLm1heERhdGUgJiYgZGF0ZSA+PSB0aGlzLm9wdGlvbnMubWF4RGF0ZSkgPyAnIGlzLWRpc2FibGVkJyA6ICcnfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTEgMC45OTk5OTlMNyA3TDEgMTNcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla1wiPiR7d2Vla0RheXMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrZGF5XCI+JHtpdGVtLnRpdGxlfTwvZGl2PmBcclxuICAgICAgICAgICAgICAgIH0pLmpvaW4oJycpfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19kYXlzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyDRgdGC0YDQtdC70LrQuFxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tcHJldicsIG5hbWU6ICdwcmV2J30sXHJcbiAgICAgICAgICAgIHtzZWxlY3RvcjogJy5Nb250aF9fYXJyb3ctLW5leHQnLCBuYW1lOiAnbmV4dCd9LFxyXG4gICAgICAgIF0uZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgY29uc3QgJGFycm93ID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoaXRlbS5zZWxlY3Rvcik7XHJcbiAgICAgICAgICAgICRhcnJvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25BcnJvd0NsaWNrKCRhcnJvdywgaXRlbS5uYW1lKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vINGA0LXQvdC00LXRgCDQtNC90LXQuVxyXG4gICAgICAgIGNvbnN0ICRkYXlzID0gJG1vbnRoLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aF9fZGF5cycpO1xyXG4gICAgICAgIGNvbnN0IGRheXMgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgZGF5cy5zZXREYXRlKDEpO1xyXG4gICAgICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIHdoaWxlIChkYXlzLmdldE1vbnRoKCkgPT0gY3VycmVudE1vbnRoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZVdlZWsoKTtcclxuXHJcbiAgICAgICAgICAgIHdlZWtEYXlzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF5cy5nZXREYXkoKSAhPSBpdGVtLmRheSB8fCBkYXlzLmdldE1vbnRoKCkgIT0gY3VycmVudE1vbnRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZUVtcHR5RGF5KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRGF5KGRheXMpKTtcclxuICAgICAgICAgICAgICAgIGRheXMuc2V0RGF0ZShkYXlzLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRkYXlzLmFwcGVuZENoaWxkKCR3ZWVrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAkbW9udGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC70LjQuiDQv9C+INGB0YLRgNC10LvQutC1INC/0LXRgNC10LrQu9GO0YfQtdC90LjRjyDQvNC10YHRj9GG0LBcclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gJGFycm93IEhUTUwg0Y3Qu9C10LzQtdC90YJcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lICAgINCY0LzRjyAocHJldiwgbmV4dClcclxuICAgICAqL1xyXG4gICAgdGhpcy5fb25BcnJvd0NsaWNrID0gZnVuY3Rpb24oJGFycm93LCBuYW1lKSB7XHJcbiAgICAgICAgaWYgKCRhcnJvdy5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLk1vbnRoJykuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpICsgKG5hbWUgPT0gJ3ByZXYnID8gLXRoaXMub3B0aW9ucy5tb250aHNDb3VudCA6IHRoaXMub3B0aW9ucy5tb250aHNDb3VudCkpO1xyXG5cclxuICAgICAgICAvLyDQstGL0YXQvtC0INC30LAg0L/RgNC10LTQtdC70Ysg0LzQuNC90LjQvNCw0LvRjNC90L7QuSDQtNCw0YLRi1xyXG4gICAgICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUpIHtcclxuICAgICAgICAgICAgZGF0ZS5zZXRUaW1lKHRoaXMub3B0aW9ucy5taW5EYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0YXQvtC0INC30LAg0L/RgNC10LTQtdC70Ysg0LzQsNC60YHQuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVuZERhdGUgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgICAgIGVuZERhdGUuc2V0TW9udGgoZW5kRGF0ZS5nZXRNb250aCgpICsgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KTtcclxuICAgICAgICAgICAgaWYgKGVuZERhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgZGF0ZS5zZXRUaW1lKHRoaXMub3B0aW9ucy5tYXhEYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgICAgICAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSAtIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl8kY3JlYXRlTW9udGhzKGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC90LXQtNC10LvQuFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVXZWVrID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiV2Vla1wiPjwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gJHdlZWs7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10L3QtNC10YAg0LTQvdGPXHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7RWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZURheSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCBsb2NrZWQgPSB0aGlzLmdldERheUxvY2tlZChkYXRlKTtcclxuXHJcbiAgICAgICAgY29uc3QgJGRheSA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRheSR7bG9ja2VkID8gJyBpcy1kaXNhYmxlZCcgOiAnJ30ke2xvY2tlZCA9PSBMT0NLX0xPQ0tFRCA/ICcgaXMtbG9ja2VkJyA6ICcnfVwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCIgZGF0YS1kYXk9XCIke2RhdGUuZ2V0RGF5KCl9XCI+JHtkYXRlLmdldERhdGUoKX08L2Rpdj5gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uRGF5Q2xpY2tFdmVudC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZSkge1xyXG4gICAgICAgICAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLl9vbkRheU1vdXNlRW50ZXJFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAkZGF5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtCx0YvRgtC40LUg0LrQu9C40LrQsCDQv9C+INC00L3RjlxyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICAgICAqL1xyXG4gICAgdGhpcy5fb25EYXlDbGlja0V2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHRoaXMuX29uRGF5Q2xpY2soZS50YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtCx0YvRgtC40LUg0YXQvtCy0LXRgNCwXHJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheU1vdXNlRW50ZXJFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB0aGlzLl9vbkRheU1vdXNlRW50ZXIoZS50YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KXQvtCy0LXRgCDQvdCwINGN0LvQtdC80LXQvdGC0LUg0LTQvdGPXHJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheU1vdXNlRW50ZXIgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkZGF5LmRhdGFzZXQudGltZSA9PSB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLmdldFRpbWUoKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXRlX3RvID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQu9C40Log0L/QviDQtNC90Y5cclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5Q2xpY2sgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICAgICAgLy8g0LTQtdC90Ywg0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC9XHJcbiAgICAgICAgaWYgKCRkYXkuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRi1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjaygnZGF5U2VsZWN0JywgbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDRgdCx0YDQvtGBINCy0YvQsdGA0LDQvdC90L7Qs9C+INGA0LDQvdC10LUg0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcblxyXG4gICAgICAgIC8vINCy0YvQsdGA0LDQvdCwINC90LDRh9Cw0LvRjNC90LDRjyAvINC60L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20pIHtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgICAgICAvLyDQtNC+0L/Rg9GB0YLQuNC80YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZSh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJhbmdlU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gICAgICovXHJcbiAgICB0aGlzLnJhbmdlUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFJlc2V0KCk7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC40LfRg9Cw0LvRjNC90YvQuSDRgdCx0YDQvtGBINCy0YvQtNC10LvQtdC90L3Ri9GFINC00LDRglxyXG4gICAgICovXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgJGRheXMgPSB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpO1xyXG4gICAgICAgICRkYXlzLmZvckVhY2goJGRheSA9PiB7XHJcbiAgICAgICAgICAgICRkYXkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScsICdpcy1zZWxlY3RlZC10bycsICdpcy1zZWxlY3RlZC1iZXR3ZWVuJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC40LfRg9Cw0LvRjNC90L7QtSDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCXHJcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqL1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICBpZiAoZGF0ZV9mcm9tICYmIGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICAgICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRhdGVfdG8gJiYgZGF0ZV90byBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LVcclxuICAgICAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdGltZV9mcm9tID0gZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVfZnJvbS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgICAgIGNvbnN0IHRpbWVfdG8gPSBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGVfdG8uZ2V0VGltZSgpIDogMDtcclxuICAgICAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcblxyXG4gICAgICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YIg0LzQtdC20LTRgyDQvdCw0YfQsNC70YzQvdC+0Lkg0Lgg0LrQvtC90LXRh9C90L7QuVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGRheXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgJGRheXNbaV0uY2xhc3NMaXN0LnRvZ2dsZSgnaXMtc2VsZWN0ZWQtYmV0d2VlbicsICRkYXlzW2ldLmRhdGFzZXQudGltZSA+IHRpbWVfZnJvbSAmJiAkZGF5c1tpXS5kYXRhc2V0LnRpbWUgPCB0aW1lX3RvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDQvdCw0YfQsNC70YzQvdC+0Lkg0Lgg0LrQvtC90LXRh9C90L7QuSDQv9C+0LfQuNGG0LjQuFxyXG4gICAgICAgIGNvbnN0ICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgICAgICBjb25zdCAkZGF5X3RvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuXHJcbiAgICAgICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgICAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICE9ICRkYXlfZnJvbSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICAgICAgaWYgKHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkICE9ICRkYXlfdG8pIHtcclxuICAgICAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGB0L7RhdGA0LDQvdC10L3QuNC1INCyINC60LXRiFxyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgPSAkZGF5X2Zyb207XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgPSAkZGF5X3RvO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLRi9C00LXQu9C10L3QuNC1INC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICB0aGlzLnJhbmdlU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICAgICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUoZGF0ZV9mcm9tLCBkYXRlX3RvKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgJGRheV9mcm9tLCAkZGF5X3RvO1xyXG5cclxuICAgICAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1XHJcbiAgICAgICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgICAgICAgICAgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgICAgICAgICAkZGF5X3RvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdChkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG5cclxuICAgICAgICAvLyDRgdC+0LHRi9GC0LjQtVxyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrKCdyYW5nZVNlbGVjdCcsIGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINCy0L7Qt9C80L7QttC90L7RgdGC0Lgg0LLRi9C00LXQu9C10L3QuNGPINC00LDRglxyXG4gICAgICogQHBhcmFtICB7RGF0ZSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlIGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldElzUmFuZ2VTZWxlY3RhYmxlID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICAgICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3Ri9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMoZGF0ZV9mcm9tLmdldFRpbWUoKSAtIGRhdGVfdG8uZ2V0VGltZSgpKSAvIDEwMDAgLyA4NjQwMDtcclxuICAgICAgICBpZiAoZGlmZiA8IHRoaXMub3B0aW9ucy5taW5EYXlzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC/0YDQvtCy0LXRgNC60LAg0L/QvtC/0LDQtNCw0L3QuNGPINCyINC00LjQsNC/0LDQt9C+0L0g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9GFINC00LDRglxyXG4gICAgICAgIGNvbnN0IGRheSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgZGF5LnNldFRpbWUoZGF0ZV9mcm9tLmdldFRpbWUoKSk7XHJcblxyXG4gICAgICAgIHdoaWxlIChkYXkgPCBkYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdldERheUxvY2tlZChkYXkpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRheS5zZXREYXRlKGRheS5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC+0LLQtdGA0LrQsCDQvdCwINC00L7RgdGC0YPQv9C90L7RgdGC0Ywg0LTQvdGPINC00LvRjyDQsdGA0L7QvdC4XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSAgIHRydWUg0LXRgdC70Lgg0LTQvtGB0YLRg9C/0LXQvVxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldERheUxvY2tlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQstC90LUg0LTQvtGB0YLRg9C/0L3QvtCz0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICAgICAgaWYgKGRhdGUgPCB0aGlzLm9wdGlvbnMubWluRGF0ZSB8fCBkYXRlID4gdGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIExPQ0tfVU5BVkFJTEFCTEU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxvY2tEYXlzRmlsdGVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMubG9ja0RheXNGaWx0ZXIoZGF0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQrdC70LXQvNC10L3RgiDQutCw0LvQtdC90LTQsNGA0L3QvtCz0L4g0LTQvdGPXHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fSAgIEhUTUwg0Y3Qu9C10LzQtdC90YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGdldERheUJ5RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCB0aW1lID0gZGF0ZSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlLmdldFRpbWUoKSA6IDA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLkRheVtkYXRhLXRpbWU9XCInICsgdGltZSArICdcIl0nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQvdC00LXRgCDQtNC90Y8gLSDQt9Cw0LPQu9GD0YjQutC4XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7RWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZUVtcHR5RGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgJGRheSA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRheSBpcy1lbXB0eVwiPjwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gJGRheTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQvdC40LUg0Y3Qu9C10LzQtdC90YLQsCDQuNC3IEhUTUwg0YLQtdC60YHRgtCwXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGh0bWwgSFRNTCDRgtC10LrRgdGCXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGh0bWwpIHtcclxuICAgICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXYuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgaHRtbCk7XHJcbiAgICAgICAgcmV0dXJuIGRpdi5jaGlsZHJlbi5sZW5ndGggPiAxID8gZGl2LmNoaWxkcmVuIDogZGl2LmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2FmZSDQstGL0LfQvtCyINCy0L3QtdGI0L3QuNGFINGB0L7QsdGL0YLQuNC5INC60L7QvNC/0L7QvdC10L3RgtCwXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZiDQmNC80Y8g0YHQvtCx0YvRgtC40Y9cclxuICAgICAqL1xyXG4gICAgdGhpcy5fY2FsbGJhY2sgPSBmdW5jdGlvbihmKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25bZl0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm9uW2ZdLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGVSYW5nZVBpY2tlcjtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9kaXN0L2RhdGVyYW5nZXBpY2tlci5qcyIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2RlbW8vcGFnZS5zY3NzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9kZW1vL3BhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJLElBQXlEO0FBQzdEO0FBQ0EsTUFBTSxFQUtnQztBQUN0QyxDQUFDO0FBQ0Qsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQSxjQUFjLDhCQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxnQkFBZ0IsOEJBQW1CLHdCQUF3Qiw4QkFBbUI7QUFDOUUsbURBQW1ELHlDQUF5QztBQUM1RjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxpRUFBaUUsa0JBQWtCO0FBQ25GO0FBQ0EsMERBQTBELGNBQWM7QUFDeEU7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQW1CO0FBQ25COztBQUVBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUFtQjtBQUNuQixxQkFBcUIsOEJBQW1CO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7O0FBRUEsaURBQWlEO0FBQ2pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxrQkFBa0I7QUFDM0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLEtBQUs7QUFDckIsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQSxvREFBb0QsY0FBYztBQUNsRTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsS0FBSztBQUNyQixnQkFBZ0IsT0FBTztBQUN2QixnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLE9BQU87QUFDOUI7QUFDQTtBQUNBO0FBQ0EscURBQXFELGlCQUFpQjtBQUN0RSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixLQUFLO0FBQ3JCLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsS0FBSztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qiw4QkFBOEI7QUFDckQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLG9CQUFvQjtBQUMzQztBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsS0FBSztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkNBQTZDLGVBQWU7QUFDNUQ7QUFDQSxpRUFBaUUsNkVBQTZFO0FBQzlJO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFdBQVcsR0FBRyxtQkFBbUI7QUFDakYsaUVBQWlFLDZFQUE2RTtBQUM5STtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDO0FBQzNDLDBEQUEwRCxXQUFXO0FBQ3JFLGlCQUFpQixXQUFXO0FBQzVCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYSw4Q0FBOEM7QUFDM0QsYUFBYSw4Q0FBOEM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsS0FBSztBQUNyQixnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsS0FBSztBQUNyQixnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOEJBQThCLDZCQUE2QixFQUFFLDBDQUEwQyxlQUFlLGVBQWUsY0FBYyxjQUFjLElBQUksZUFBZTtBQUNwTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxNQUFNO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE1BQU07QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBLGVBQWUsS0FBSztBQUNwQixlQUFlLEtBQUs7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCLGtCQUFrQjtBQUN6QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLEtBQUs7QUFDcEIsZUFBZSxLQUFLO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEIsZ0JBQWdCO0FBQ2hCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsS0FBSztBQUNyQixnQkFBZ0IsUUFBUTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixLQUFLO0FBQ3JCLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixLQUFLO0FBQ3JCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixPQUFPO0FBQ3ZCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxDQUFDOztBQUVEO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsQ0FBQztBQUNELDJDQUEyQyxjQUFjLG1sbkM7Ozs7OztVQ2xwQnpEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQ0FBZ0MsWUFBWTtXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7O0FDTkE7Ozs7Ozs7Ozs7Ozs7QUNBeUQ7QUFDZ0I7O0FBRXpFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLDhEQUFlO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsbUJBQW1CLDhEQUFXO0FBQzlCOztBQUVBO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6Ii4vZGVtby9wYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJEYXRlcmFuZ2VwaWNrZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovICgoKSA9PiB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0XCJ1c2Ugc3RyaWN0XCI7XG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIHNjb3BlXG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG4vKioqKioqLyBcdFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG4vKioqKioqLyBcdFx0XHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG4vKioqKioqLyBcdFx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuLyoqKioqKi8gXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG4vKioqKioqLyBcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSlcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcbi8qKioqKiovIFx0XHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuLyoqKioqKi8gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbi8vIFRoaXMgZW50cnkgbmVlZCB0byBiZSB3cmFwcGVkIGluIGFuIElJRkUgYmVjYXVzZSBpdCBuZWVkIHRvIGJlIGlzb2xhdGVkIGFnYWluc3Qgb3RoZXIgZW50cnkgbW9kdWxlcy5cbigoKSA9PiB7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvc2Nzcy9pbmRleC5zY3NzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuXG59KSgpO1xuXG4vLyBUaGlzIGVudHJ5IG5lZWQgdG8gYmUgd3JhcHBlZCBpbiBhbiBJSUZFIGJlY2F1c2UgaXQgbmVlZCB0byBiZSBpc29sYXRlZCBhZ2FpbnN0IG90aGVyIGVudHJ5IG1vZHVsZXMuXG4oKCkgPT4ge1xuLyohKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9qcy9pbmRleC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKi9cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0ICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCB7XG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiTE9DS19VTkFWQUlMQUJMRVwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBMT0NLX1VOQVZBSUxBQkxFKSxcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJMT0NLX0xPQ0tFRFwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBMT0NLX0xPQ0tFRCksXG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiZGVmYXVsdFwiOiAoKSA9PiAoX19XRUJQQUNLX0RFRkFVTFRfRVhQT1JUX18pXG4vKiBoYXJtb255IGV4cG9ydCAqLyB9KTtcbi8vINGB0L7RgdGC0L7Rj9C90LjRjyDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbmNvbnN0IExPQ0tfVU5BVkFJTEFCTEUgPSAxO1xyXG5jb25zdCBMT0NLX0xPQ0tFRCAgICAgID0gMjtcclxuXHJcbmZ1bmN0aW9uIERhdGVSYW5nZVBpY2tlcigkY29udGFpbmVyLCBvcHRpb25zID0ge30pIHtcclxuICAgIHRoaXMuXyRjb250YWluZXIgPSAkY29udGFpbmVyO1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IHtcclxuICAgICAgICBmaXJzdERheU9mVGhlV2Vlazogb3B0aW9ucy5maXJzdERheU9mVGhlV2VlayB8fCAxLCAgICAgICAgICAvLyDQv9C10YDQstGL0Lkg0LTQtdC90Ywg0L3QtdC00LXQu9C4LCAwID0g0LLRgSwgMSA9INC/0L0sIC4uLlxyXG4gICAgICAgIHNpbmdsZU1vZGU6ICAgICAgICBvcHRpb25zLnNpbmdsZU1vZGUgICAgICAgIHx8IGZhbHNlLCAgICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRiyDQstC80LXRgdGC0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICAgICAgbG9jYWxlOiAgICAgICAgICAgIG9wdGlvbnMubG9jYWxlICAgICAgICAgICAgfHwgJ3J1LVJVJyxcclxuICAgICAgICBtaW5EYXlzOiAgICAgICAgICAgb3B0aW9ucy5taW5EYXlzICAgICAgICAgICB8fCAxLCAgICAgICAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC00LjQsNC/0LDQt9C+0L3QtVxyXG4gICAgICAgIG1vbnRoc0NvdW50OiAgICAgICBvcHRpb25zLm1vbnRoc0NvdW50ICAgICAgIHx8IDEyLFxyXG4gICAgICAgIHBlclJvdzogICAgICAgICAgICBvcHRpb25zLnBlclJvdyAgICAgICAgICAgIHx8IHVuZGVmaW5lZCwgIC8vINC60L7Qu9C40YfQtdGB0YLQstC+INC80LXRgdGP0YbQtdCyINCyINGA0Y/QtNGDXHJcbiAgICAgICAgbWluRGF0ZTogICAgICAgICAgIG9wdGlvbnMubWluRGF0ZSAgICAgICAgICAgfHwgbmV3IERhdGUoKSwgLy8g0LzQuNC90LjQvNCw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICAgIG1heERhdGU6ICAgICAgICAgICBvcHRpb25zLm1heERhdGUgICAgICAgICAgIHx8IHVuZGVmaW5lZCxcclxuICAgICAgICBsb2NrRGF5c0ZpbHRlcjogICAgb3B0aW9ucy5sb2NrRGF5c0ZpbHRlciAgICB8fCB1bmRlZmluZWQsICAvLyBjYWxsYmFjayhkYXRlKSDRhNGD0L3QutGG0LjRjyDQsdC70L7QutC40YDQvtCy0LDQvdC40Y8g0LTQsNGCLCB0cnVlL0xPQ0tcclxuICAgICAgICBvbjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIHJhbmdlU2VsZWN0OiBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICAgICAgICBkYXlTZWxlY3Q6IG51bGwsICAgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC+0LTQvdC+0Lkg0LTQsNGC0YsgKNGC0L7Qu9GM0LrQviDQv9GA0Lggc2luZ2xlTW9kZTogdHJ1ZSlcclxuICAgICAgICB9LCBvcHRpb25zLm9uIHx8IHt9KSxcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgNGP0LTQvdC+0YHRgtGMXHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5wZXJSb3cgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMucGVyUm93ID0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuICAgICAqL1xyXG4gICAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fJHBpY2tlciA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyDRjdC70LXQvNC10L3RgtGLXHJcbiAgICAgICAgdGhpcy5fJG1vbnRocyA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzJyk7XHJcblxyXG4gICAgICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG5cclxuICAgICAgICAvLyDRgNC10L3QtNC10YBcclxuICAgICAgICB0aGlzLl8kY3JlYXRlTW9udGhzKHRoaXMub3B0aW9ucy5taW5EYXRlKTtcclxuICAgICAgICB0aGlzLl8kY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuXyRwaWNrZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J3QsNC30LLQsNC90LjQtSDQvNC10YHRj9GG0LBcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0TW9udGhGb3JtYXR0ZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHttb250aDogJ2xvbmcnfSk7XHJcbiAgICAgICAgcmV0dXJuIHRpdGxlLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aXRsZS5zbGljZSgxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0Ysg0LTQu9GPINGC0LXQutGD0YnQtdC5INC70L7QutCw0LvQuFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAgINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zINCf0LDRgNCw0LzQtdGC0YDRi1xyXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldERhdGVUaW1lRm9ybWF0ID0gZnVuY3Rpb24oZGF0ZSwgb3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMub3B0aW9ucy5sb2NhbGUsIG9wdGlvbnMpLmZvcm1hdChkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0L3QuCDQvdC10LTQtdC70LhcclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXRXZWVrRGF5c0Zvcm1hdHRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAyKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7ICsraSkge1xyXG4gICAgICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgZGF5OiBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge3dlZWtkYXk6ICdzaG9ydCd9KSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDRgdC+0YDRgtC40YDQvtCy0LrQsCDRgdC+0LPQu9Cw0YHQvdC+INC90LDRgdGC0YDQvtC10L3QvdC+0LzRgyDQv9C10YDQstC+0LzRgyDQtNC90Y4g0L3QtdC00LXQu9C4XHJcbiAgICAgICAgcmVzdWx0LnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZmlyc3REYXlPZlRoZVdlZWsgPSB0aGlzLm9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgJSA3O1xyXG4gICAgICAgICAgICBsZXQgZGF5QSA9IGEuZGF5O1xyXG4gICAgICAgICAgICBsZXQgZGF5QiA9IGIuZGF5O1xyXG5cclxuICAgICAgICAgICAgaWYgKGRheUEgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRheUIgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF5QSA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgICAgICBkYXlBICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkYXlCIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIGRheUIgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRheUEgLSBkYXlCO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LzQtdGB0Y/RhtC1XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7TnVtYmVyfSAgICDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldERheXNDb3VudEluTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIGRheXMuc2V0TW9udGgoZGF5cy5nZXRNb250aCgpICsgMSk7XHJcbiAgICAgICAgZGF5cy5zZXREYXRlKDApO1xyXG4gICAgICAgIHJldHVybiBkYXlzLmdldERhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQvdC00LXRgCDQtNC40LDQv9Cw0LfQvtC90LAg0LzQtdGB0Y/RhtC10LJcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGhzID0gZnVuY3Rpb24oZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCkge1xyXG4gICAgICAgICAgICB0aGlzLl8kbW9udGhzLnJlbW92ZUNoaWxkKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQv9GA0LXRgNC10L3QtNC10YAg0LzQtdGB0Y/RhtC10LJcclxuICAgICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGNvbnN0ICRtb250aHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgICRtb250aHMucHVzaCh0aGlzLl8kY3JlYXRlTW9udGgoY3VycmVudERhdGUpKTtcclxuICAgICAgICAgICAgY3VycmVudERhdGUuc2V0TW9udGgoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkbW9udGhzLmxlbmd0aDsgaSArPSB0aGlzLm9wdGlvbnMucGVyUm93KSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnRGF0ZXJhbmdlcGlja2VyX19yb3cnO1xyXG5cclxuICAgICAgICAgICAgJG1vbnRocy5zbGljZShpLCBpICsgdGhpcy5vcHRpb25zLnBlclJvdykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgICAgICAgICAgJHJvdy5hcHBlbmRDaGlsZCgkbW9udGgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuXyRtb250aHMuYXBwZW5kQ2hpbGQoJHJvdyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0aW9uICYmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC80LXRgdGP0YbQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlINCc0LXRgdGP0YZcclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgICAgICBjb25zdCBtb250aFRpdGxlID0gdGhpcy5nZXRNb250aEZvcm1hdHRlZChkYXRlKTtcclxuICAgICAgICBjb25zdCB3ZWVrRGF5cyA9IHRoaXMuZ2V0V2Vla0RheXNGb3JtYXR0ZWQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgJG1vbnRoID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiTW9udGhcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tcHJldiR7KHRoaXMub3B0aW9ucy5taW5EYXRlICYmIGRhdGUgPD0gdGhpcy5vcHRpb25zLm1pbkRhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk03IDEzTDEgN0w3IDFcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX190aXRsZVwiPiR7bW9udGhUaXRsZX0gJHtkYXRlLmdldEZ1bGxZZWFyKCl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLW5leHQkeyh0aGlzLm9wdGlvbnMubWF4RGF0ZSAmJiBkYXRlID49IHRoaXMub3B0aW9ucy5tYXhEYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMSAwLjk5OTk5OUw3IDdMMSAxM1wiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrXCI+JHt3ZWVrRGF5cy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtkYXlcIj4ke2l0ZW0udGl0bGV9PC9kaXY+YFxyXG4gICAgICAgICAgICAgICAgfSkuam9pbignJyl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2RheXNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vINGB0YLRgNC10LvQutC4XHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1wcmV2JywgbmFtZTogJ3ByZXYnfSxcclxuICAgICAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tbmV4dCcsIG5hbWU6ICduZXh0J30sXHJcbiAgICAgICAgXS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkYXJyb3cgPSAkbW9udGgucXVlcnlTZWxlY3RvcihpdGVtLnNlbGVjdG9yKTtcclxuICAgICAgICAgICAgJGFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkFycm93Q2xpY2soJGFycm93LCBpdGVtLm5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g0YDQtdC90LTQtdGAINC00L3QtdC5XHJcbiAgICAgICAgY29uc3QgJGRheXMgPSAkbW9udGgucXVlcnlTZWxlY3RvcignLk1vbnRoX19kYXlzJyk7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBkYXlzLnNldERhdGUoMSk7XHJcbiAgICAgICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGRheXMuZ2V0TW9udGgoKSA9PSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlV2VlaygpO1xyXG5cclxuICAgICAgICAgICAgd2Vla0RheXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXlzLmdldERheSgpICE9IGl0ZW0uZGF5IHx8IGRheXMuZ2V0TW9udGgoKSAhPSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRW1wdHlEYXkoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVEYXkoZGF5cykpO1xyXG4gICAgICAgICAgICAgICAgZGF5cy5zZXREYXRlKGRheXMuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJGRheXMuYXBwZW5kQ2hpbGQoJHdlZWspO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRtb250aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0LvQuNC6INC/0L4g0YHRgtGA0LXQu9C60LUg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPINC80LXRgdGP0YbQsFxyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSAkYXJyb3cgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgICAg0JjQvNGPIChwcmV2LCBuZXh0KVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkFycm93Q2xpY2sgPSBmdW5jdGlvbigkYXJyb3csIG5hbWUpIHtcclxuICAgICAgICBpZiAoJGFycm93LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUocGFyc2VJbnQodGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuTW9udGgnKS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICAgICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyAobmFtZSA9PSAncHJldicgPyAtdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50IDogdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KSk7XHJcblxyXG4gICAgICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNC40L3QuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICAgICAgaWYgKGRhdGUgPCB0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1pbkRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICAgICAgY29uc3QgZW5kRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgZW5kRGF0ZS5zZXRNb250aChlbmREYXRlLmdldE1vbnRoKCkgKyB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpO1xyXG4gICAgICAgICAgICBpZiAoZW5kRGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1heERhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpIC0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50ICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuXyRjcmVhdGVNb250aHMoZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10L3QtNC10YAg0L3QtdC00LXQu9C4XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7RWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZVdlZWsgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJXZWVrXCI+PC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiAkd2VlaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQvdC00LXRgCDQtNC90Y9cclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlRGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGxvY2tlZCA9IHRoaXMuZ2V0RGF5TG9ja2VkKGRhdGUpO1xyXG5cclxuICAgICAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5JHtsb2NrZWQgPyAnIGlzLWRpc2FibGVkJyA6ICcnfSR7bG9ja2VkID09IExPQ0tfTE9DS0VEID8gJyBpcy1sb2NrZWQnIDogJyd9XCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIiBkYXRhLWRheT1cIiR7ZGF0ZS5nZXREYXkoKX1cIj4ke2RhdGUuZ2V0RGF0ZSgpfTwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25EYXlDbGlja0V2ZW50LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRkYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtSDQutC70LjQutCwINC/0L4g0LTQvdGOXHJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheUNsaWNrRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdGhpcy5fb25EYXlDbGljayhlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtSDRhdC+0LLQtdGA0LBcclxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHRoaXMuX29uRGF5TW91c2VFbnRlcihlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpdC+0LLQtdGAINC90LAg0Y3Qu9C10LzQtdC90YLQtSDQtNC90Y9cclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlciA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXkuZGF0YXNldC50aW1lID09IHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20uZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC70LjQuiDQv9C+INC00L3RjlxyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5fb25EYXlDbGljayA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgICAgICAvLyDQtNC10L3RjCDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L1cclxuICAgICAgICBpZiAoJGRheS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgICAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrKCdkYXlTZWxlY3QnLCBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGB0LHRgNC+0YEg0LLRi9Cx0YDQsNC90L3QvtCz0L4g0YDQsNC90LXQtSDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgLy8g0LLRi9Cx0YDQsNC90LAg0L3QsNGH0LDQu9GM0L3QsNGPIC8g0LrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmdldElzUmFuZ2VTZWxlY3RhYmxlKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMucmFuZ2VSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsUmVzZXQoKTtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0LjQt9GD0LDQu9GM0L3Ri9C5INGB0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICAgICAgJGRheXMuZm9yRWFjaCgkZGF5ID0+IHtcclxuICAgICAgICAgICAgJGRheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJywgJ2lzLXNlbGVjdGVkLXRvJywgJ2lzLXNlbGVjdGVkLWJldHdlZW4nKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0LjQt9GD0LDQu9GM0L3QvtC1INCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YJcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgIGlmIChkYXRlX2Zyb20gJiYgZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF0ZV90byAmJiBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LIg0L7QsdGA0LDRgtC90L7QvCDQv9C+0YDRj9C00LrQtVxyXG4gICAgICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0aW1lX2Zyb20gPSBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV9mcm9tLmdldFRpbWUoKSA6IDA7XHJcbiAgICAgICAgY29uc3QgdGltZV90byA9IGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV90by5nZXRUaW1lKCkgOiAwO1xyXG4gICAgICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuXHJcbiAgICAgICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC00LDRgiDQvNC10LbQtNGDINC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkZGF5cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAkZGF5c1tpXS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zZWxlY3RlZC1iZXR3ZWVuJywgJGRheXNbaV0uZGF0YXNldC50aW1lID4gdGltZV9mcm9tICYmICRkYXlzW2ldLmRhdGFzZXQudGltZSA8IHRpbWVfdG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5INC/0L7Qt9C40YbQuNC4XHJcbiAgICAgICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgICAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgIT0gJGRheV9mcm9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgICAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgIT0gJGRheV90bykge1xyXG4gICAgICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YHQvtGF0YDQsNC90LXQvdC40LUg0LIg0LrQtdGIXHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCA9ICRkYXlfZnJvbTtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCA9ICRkYXlfdG87XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktGL0LTQtdC70LXQvdC40LUg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKi9cclxuICAgIHRoaXMucmFuZ2VTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZShkYXRlX2Zyb20sIGRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCAkZGF5X2Zyb20sICRkYXlfdG87XHJcblxyXG4gICAgICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LVcclxuICAgICAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgICAgICAgICAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICAgICAgICAgICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INGN0LvQtdC80LXQvdGC0L7QslxyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcblxyXG4gICAgICAgIC8vINGB0L7QsdGL0YLQuNC1XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2soJ3JhbmdlU2VsZWN0JywgZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0LLQvtC30LzQvtC20L3QvtGB0YLQuCDQstGL0LTQtdC70LXQvdC40Y8g0LTQsNGCXHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlIGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqIEBwYXJhbSAge0RhdGUgZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhkYXRlX2Zyb20uZ2V0VGltZSgpIC0gZGF0ZV90by5nZXRUaW1lKCkpIC8gMTAwMCAvIDg2NDAwO1xyXG4gICAgICAgIGlmIChkaWZmIDwgdGhpcy5vcHRpb25zLm1pbkRheXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQv9C+0L/QsNC00LDQvdC40Y8g0LIg0LTQuNCw0L/QsNC30L7QvSDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbiAgICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBkYXkuc2V0VGltZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGRheSA8IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0RGF5TG9ja2VkKGRheSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINC90LAg0LTQvtGB0YLRg9C/0L3QvtGB0YLRjCDQtNC90Y8g0LTQu9GPINCx0YDQvtC90LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59ICAgdHJ1ZSDQtdGB0LvQuCDQtNC+0YHRgtGD0L/QtdC9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0RGF5TG9ja2VkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCy0L3QtSDQtNC+0YHRgtGD0L/QvdC+0LPQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlIHx8IGRhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gTE9DS19VTkFWQUlMQUJMRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubG9ja0RheXNGaWx0ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5sb2NrRGF5c0ZpbHRlcihkYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCt0LvQtdC80LXQvdGCINC60LDQu9C10L3QtNCw0YDQvdC+0LPQviDQtNC90Y9cclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9ICAgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kZ2V0RGF5QnlEYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHRpbWUgPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogMDtcclxuICAgICAgICByZXR1cm4gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuRGF5W2RhdGEtdGltZT1cIicgKyB0aW1lICsgJ1wiXScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC00L3RjyAtINC30LDQs9C70YPRiNC60LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlRW1wdHlEYXkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5IGlzLWVtcHR5XCI+PC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiAkZGF5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwINC40LcgSFRNTCDRgtC10LrRgdGC0LBcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaHRtbCBIVE1MINGC0LXQutGB0YJcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24oaHRtbCkge1xyXG4gICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdi5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgICAgICByZXR1cm4gZGl2LmNoaWxkcmVuLmxlbmd0aCA+IDEgPyBkaXYuY2hpbGRyZW4gOiBkaXYuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTYWZlINCy0YvQt9C+0LIg0LLQvdC10YjQvdC40YUg0YHQvtCx0YvRgtC40Lkg0LrQvtC80L/QvtC90LXQvdGC0LBcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmINCY0LzRjyDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICovXHJcbiAgICB0aGlzLl9jYWxsYmFjayA9IGZ1bmN0aW9uKGYpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbltmXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub25bZl0uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXQoKTtcclxufVxyXG5cclxuLyogaGFybW9ueSBkZWZhdWx0IGV4cG9ydCAqLyBjb25zdCBfX1dFQlBBQ0tfREVGQVVMVF9FWFBPUlRfXyA9IChEYXRlUmFuZ2VQaWNrZXIpO1xyXG5cbn0pKCk7XG5cbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19leHBvcnRzX187XG4vKioqKioqLyB9KSgpXG47XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdmQyVmljR0ZqYXk5MWJtbDJaWEp6WVd4TmIyUjFiR1ZFWldacGJtbDBhVzl1SWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k5M1pXSndZV05yTDJKdmIzUnpkSEpoY0NJc0luZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdmQyVmljR0ZqYXk5eWRXNTBhVzFsTDJSbFptbHVaU0J3Y205d1pYSjBlU0JuWlhSMFpYSnpJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTkzWldKd1lXTnJMM0oxYm5ScGJXVXZhR0Z6VDNkdVVISnZjR1Z5ZEhrZ2MyaHZjblJvWVc1a0lpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOTNaV0p3WVdOckwzSjFiblJwYldVdmJXRnJaU0J1WVcxbGMzQmhZMlVnYjJKcVpXTjBJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTh1TDNOeVl5OXpZM056TDJsdVpHVjRMbk5qYzNNL05UWXhPQ0lzSW5kbFluQmhZMnM2THk5a1lYUmxjbUZ1WjJWd2FXTnJaWEl2TGk5emNtTXZhbk12YVc1a1pYZ3Vhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1EwRkJRenRCUVVORUxFODdPMVZEVmtFN1ZVRkRRVHM3T3pzN1YwTkVRVHRYUVVOQk8xZEJRMEU3VjBGRFFUdFhRVU5CTEhkRFFVRjNReXg1UTBGQmVVTTdWMEZEYWtZN1YwRkRRVHRYUVVOQkxFVTdPenM3TzFkRFVFRXNkMFk3T3pzN08xZERRVUU3VjBGRFFUdFhRVU5CTzFkQlEwRXNjMFJCUVhORUxHdENRVUZyUWp0WFFVTjRSVHRYUVVOQkxDdERRVUVyUXl4alFVRmpPMWRCUXpkRUxFVTdPenM3T3pzN096czdPenRCUTA1Qk96czdPenM3T3pzN096czdPenM3UVVOQlFUdEJRVU5QTzBGQlEwRTdPMEZCUlZBc2FVUkJRV2xFTzBGQlEycEVPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNVMEZCVXl4clFrRkJhMEk3UVVGRE0wSTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNaMEpCUVdkQ0xFdEJRVXM3UVVGRGNrSXNaMEpCUVdkQ08wRkJRMmhDTzBGQlEwRTdRVUZEUVN4dlJFRkJiMFFzWTBGQll6dEJRVU5zUlR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeG5Ra0ZCWjBJc1MwRkJTenRCUVVOeVFpeG5Ra0ZCWjBJc1QwRkJUenRCUVVOMlFpeG5Ra0ZCWjBJN1FVRkRhRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFc2RVSkJRWFZDTEU5QlFVODdRVUZET1VJN1FVRkRRVHRCUVVOQk8wRkJRMEVzY1VSQlFYRkVMR2xDUVVGcFFqdEJRVU4wUlN4aFFVRmhPMEZCUTJJN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFTeFRRVUZUT3p0QlFVVlVPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdkQ1FVRm5RaXhMUVVGTE8wRkJRM0pDTEdkQ1FVRm5RaXhQUVVGUE8wRkJRM1pDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMR1ZCUVdVc1MwRkJTenRCUVVOd1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEhWQ1FVRjFRaXc0UWtGQk9FSTdRVUZEY2tRN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRXNkVUpCUVhWQ0xHOUNRVUZ2UWp0QlFVTXpRenRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4aFFVRmhPenRCUVVWaU8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdWQlFXVXNTMEZCU3p0QlFVTndRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFc05rTkJRVFpETEdWQlFXVTdRVUZETlVRN1FVRkRRU3hwUlVGQmFVVXNOa1ZCUVRaRk8wRkJRemxKTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1owUkJRV2RFTEZkQlFWY3NSMEZCUnl4dFFrRkJiVUk3UVVGRGFrWXNhVVZCUVdsRkxEWkZRVUUyUlR0QlFVTTVTVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNNa05CUVRKRE8wRkJRek5ETERCRVFVRXdSQ3hYUVVGWE8wRkJRM0pGTEdsQ1FVRnBRaXhYUVVGWE8wRkJRelZDTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWVVGQllTdzRRMEZCT0VNN1FVRkRNMFFzWVVGQllTdzRRMEZCT0VNN1FVRkRNMFE3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4aFFVRmhPMEZCUTJJc1UwRkJVenM3UVVGRlZEdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNZVUZCWVRzN1FVRkZZanRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxHVkJRV1VzVVVGQlVUdEJRVU4yUWl4bFFVRmxMRTlCUVU4N1FVRkRkRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3huUWtGQlowSXNTMEZCU3p0QlFVTnlRaXhuUWtGQlowSTdRVUZEYUVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeG5Ra0ZCWjBJc1MwRkJTenRCUVVOeVFpeG5Ra0ZCWjBJN1FVRkRhRUk3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFc09FSkJRVGhDTERaQ1FVRTJRaXhGUVVGRkxEQkRRVUV3UXl4bFFVRmxMR1ZCUVdVc1kwRkJZeXhqUVVGakxFbEJRVWtzWlVGQlpUdEJRVU53VERzN1FVRkZRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNaVUZCWlN4TlFVRk5PMEZCUTNKQ08wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hsUVVGbExFMUJRVTA3UVVGRGNrSTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdWQlFXVXNVVUZCVVR0QlFVTjJRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeGxRVUZsTEZGQlFWRTdRVUZEZGtJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxGTkJRVk03UVVGRFZEdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hUUVVGVE8wRkJRMVE3TzBGQlJVRTdRVUZEUVR0QlFVTkJMR1ZCUVdVc1MwRkJTenRCUVVOd1FpeGxRVUZsTEV0QlFVczdRVUZEY0VJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRXNkVUpCUVhWQ0xHdENRVUZyUWp0QlFVTjZRenRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeGxRVUZsTEV0QlFVczdRVUZEY0VJc1pVRkJaU3hMUVVGTE8wRkJRM0JDTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeG5Ra0ZCWjBJN1FVRkRhRUlzWjBKQlFXZENPMEZCUTJoQ0xHZENRVUZuUWp0QlFVTm9RanRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeG5Ra0ZCWjBJc1MwRkJTenRCUVVOeVFpeG5Ra0ZCWjBJc1VVRkJVVHRCUVVONFFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdkQ1FVRm5RaXhMUVVGTE8wRkJRM0pDTEdkQ1FVRm5RaXhSUVVGUk8wRkJRM2hDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdkQ1FVRm5RaXhMUVVGTE8wRkJRM0pDTEdkQ1FVRm5RanRCUVVOb1FqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMR2RDUVVGblFpeFBRVUZQTzBGQlEzWkNMR2RDUVVGblFqdEJRVU5vUWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMR1ZCUVdVc1QwRkJUenRCUVVOMFFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRU3hwUlVGQlpTeGxRVUZsTEVWQlFVTWlMQ0ptYVd4bElqb2laR0YwWlhKaGJtZGxjR2xqYTJWeUxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpS0daMWJtTjBhVzl1SUhkbFluQmhZMnRWYm1sMlpYSnpZV3hOYjJSMWJHVkVaV1pwYm1sMGFXOXVLSEp2YjNRc0lHWmhZM1J2Y25rcElIdGNibHgwYVdZb2RIbHdaVzltSUdWNGNHOXlkSE1nUFQwOUlDZHZZbXBsWTNRbklDWW1JSFI1Y0dWdlppQnRiMlIxYkdVZ1BUMDlJQ2R2WW1wbFkzUW5LVnh1WEhSY2RHMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1ptRmpkRzl5ZVNncE8xeHVYSFJsYkhObElHbG1LSFI1Y0dWdlppQmtaV1pwYm1VZ1BUMDlJQ2RtZFc1amRHbHZiaWNnSmlZZ1pHVm1hVzVsTG1GdFpDbGNibHgwWEhSa1pXWnBibVVvWENKRVlYUmxjbUZ1WjJWd2FXTnJaWEpjSWl3Z1cxMHNJR1poWTNSdmNua3BPMXh1WEhSbGJITmxJR2xtS0hSNWNHVnZaaUJsZUhCdmNuUnpJRDA5UFNBbmIySnFaV04wSnlsY2JseDBYSFJsZUhCdmNuUnpXMXdpUkdGMFpYSmhibWRsY0dsamEyVnlYQ0pkSUQwZ1ptRmpkRzl5ZVNncE8xeHVYSFJsYkhObFhHNWNkRngwY205dmRGdGNJa1JoZEdWeVlXNW5aWEJwWTJ0bGNsd2lYU0E5SUdaaFkzUnZjbmtvS1R0Y2JuMHBLSE5sYkdZc0lHWjFibU4wYVc5dUtDa2dlMXh1Y21WMGRYSnVJQ0lzSWk4dklGUm9aU0J5WlhGMWFYSmxJSE5qYjNCbFhHNTJZWElnWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHlBOUlIdDlPMXh1WEc0aUxDSXZMeUJrWldacGJtVWdaMlYwZEdWeUlHWjFibU4wYVc5dWN5Qm1iM0lnYUdGeWJXOXVlU0JsZUhCdmNuUnpYRzVmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmTG1RZ1BTQW9aWGh3YjNKMGN5d2daR1ZtYVc1cGRHbHZiaWtnUFQ0Z2UxeHVYSFJtYjNJb2RtRnlJR3RsZVNCcGJpQmtaV1pwYm1sMGFXOXVLU0I3WEc1Y2RGeDBhV1lvWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1dktHUmxabWx1YVhScGIyNHNJR3RsZVNrZ0ppWWdJVjlmZDJWaWNHRmphMTl5WlhGMWFYSmxYMTh1YnlobGVIQnZjblJ6TENCclpYa3BLU0I3WEc1Y2RGeDBYSFJQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrb1pYaHdiM0owY3l3Z2EyVjVMQ0I3SUdWdWRXMWxjbUZpYkdVNklIUnlkV1VzSUdkbGREb2daR1ZtYVc1cGRHbHZibHRyWlhsZElIMHBPMXh1WEhSY2RIMWNibHgwZlZ4dWZUc2lMQ0pmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmTG04Z1BTQW9iMkpxTENCd2NtOXdLU0E5UGlBb1QySnFaV04wTG5CeWIzUnZkSGx3WlM1b1lYTlBkMjVRY205d1pYSjBlUzVqWVd4c0tHOWlhaXdnY0hKdmNDa3BJaXdpTHk4Z1pHVm1hVzVsSUY5ZlpYTk5iMlIxYkdVZ2IyNGdaWGh3YjNKMGMxeHVYMTkzWldKd1lXTnJYM0psY1hWcGNtVmZYeTV5SUQwZ0tHVjRjRzl5ZEhNcElEMCtJSHRjYmx4MGFXWW9kSGx3Wlc5bUlGTjViV0p2YkNBaFBUMGdKM1Z1WkdWbWFXNWxaQ2NnSmlZZ1UzbHRZbTlzTG5SdlUzUnlhVzVuVkdGbktTQjdYRzVjZEZ4MFQySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLR1Y0Y0c5eWRITXNJRk41YldKdmJDNTBiMU4wY21sdVoxUmhaeXdnZXlCMllXeDFaVG9nSjAxdlpIVnNaU2NnZlNrN1hHNWNkSDFjYmx4MFQySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLR1Y0Y0c5eWRITXNJQ2RmWDJWelRXOWtkV3hsSnl3Z2V5QjJZV3gxWlRvZ2RISjFaU0I5S1R0Y2JuMDdJaXdpTHk4Z1pYaDBjbUZqZEdWa0lHSjVJRzFwYm1rdFkzTnpMV1Y0ZEhKaFkzUXRjR3gxWjJsdVhHNWxlSEJ2Y25RZ2UzMDdJaXdpTHk4ZzBZSFF2dEdCMFlMUXZ0R1AwTDNRdU5HUElOQzMwTERRc2RDNzBMN1F1dEM0MFlEUXZ0Q3kwTERRdmRDOTBZdlJoU0RRdE5DdzBZSmNjbHh1Wlhod2IzSjBJR052Ym5OMElFeFBRMHRmVlU1QlZrRkpURUZDVEVVZ1BTQXhPMXh5WEc1bGVIQnZjblFnWTI5dWMzUWdURTlEUzE5TVQwTkxSVVFnSUNBZ0lDQTlJREk3WEhKY2JseHlYRzVtZFc1amRHbHZiaUJFWVhSbFVtRnVaMlZRYVdOclpYSW9KR052Ym5SaGFXNWxjaXdnYjNCMGFXOXVjeUE5SUh0OUtTQjdYSEpjYmlBZ0lDQjBhR2x6TGw4a1kyOXVkR0ZwYm1WeUlEMGdKR052Ym5SaGFXNWxjanRjY2x4dVhISmNiaUFnSUNCMGFHbHpMbTl3ZEdsdmJuTWdQU0I3WEhKY2JpQWdJQ0FnSUNBZ1ptbHljM1JFWVhsUFpsUm9aVmRsWldzNklHOXdkR2x2Ym5NdVptbHljM1JFWVhsUFpsUm9aVmRsWldzZ2ZId2dNU3dnSUNBZ0lDQWdJQ0FnTHk4ZzBML1F0ZEdBMExMUmk5QzVJTkMwMExYUXZkR01JTkM5MExYUXROQzEwTHZRdUN3Z01DQTlJTkN5MFlFc0lERWdQU0RRdjlDOUxDQXVMaTVjY2x4dUlDQWdJQ0FnSUNCemFXNW5iR1ZOYjJSbE9pQWdJQ0FnSUNBZ2IzQjBhVzl1Y3k1emFXNW5iR1ZOYjJSbElDQWdJQ0FnSUNCOGZDQm1ZV3h6WlN3Z0lDQWdJQ0F2THlEUXN0R0wwTEhRdnRHQUlOQyswTFRRdmRDKzBMa2cwTFRRc05HQzBZc2cwTExRdk5DMTBZSFJndEMrSU5DMDBMalFzTkMvMExEUXQ5QyswTDNRc0Z4eVhHNGdJQ0FnSUNBZ0lHeHZZMkZzWlRvZ0lDQWdJQ0FnSUNBZ0lDQnZjSFJwYjI1ekxteHZZMkZzWlNBZ0lDQWdJQ0FnSUNBZ0lIeDhJQ2R5ZFMxU1ZTY3NYSEpjYmlBZ0lDQWdJQ0FnYldsdVJHRjVjem9nSUNBZ0lDQWdJQ0FnSUc5d2RHbHZibk11YldsdVJHRjVjeUFnSUNBZ0lDQWdJQ0FnZkh3Z01Td2dJQ0FnSUNBZ0lDQWdMeThnMEx6UXVOQzkwTGpRdk5DdzBMdlJqTkM5MEw3UXRTRFF1dEMrMEx2UXVOR0gwTFhSZ2RHQzBMTFF2aURRdE5DOTBMWFF1U0RRc2lEUXROQzQwTERRdjlDdzBMZlF2dEM5MExWY2NseHVJQ0FnSUNBZ0lDQnRiMjUwYUhORGIzVnVkRG9nSUNBZ0lDQWdiM0IwYVc5dWN5NXRiMjUwYUhORGIzVnVkQ0FnSUNBZ0lDQjhmQ0F4TWl4Y2NseHVJQ0FnSUNBZ0lDQndaWEpTYjNjNklDQWdJQ0FnSUNBZ0lDQWdiM0IwYVc5dWN5NXdaWEpTYjNjZ0lDQWdJQ0FnSUNBZ0lDQjhmQ0IxYm1SbFptbHVaV1FzSUNBdkx5RFF1dEMrMEx2UXVOR0gwTFhSZ2RHQzBMTFF2aURRdk5DMTBZSFJqOUdHMExYUXNpRFFzaURSZ05HUDBMVFJnMXh5WEc0Z0lDQWdJQ0FnSUcxcGJrUmhkR1U2SUNBZ0lDQWdJQ0FnSUNCdmNIUnBiMjV6TG0xcGJrUmhkR1VnSUNBZ0lDQWdJQ0FnSUh4OElHNWxkeUJFWVhSbEtDa3NJQzh2SU5DODBMalF2ZEM0MEx6UXNOQzcwWXpRdmRDdzBZOGcwTFRRc05HQzBMQmNjbHh1SUNBZ0lDQWdJQ0J0WVhoRVlYUmxPaUFnSUNBZ0lDQWdJQ0FnYjNCMGFXOXVjeTV0WVhoRVlYUmxJQ0FnSUNBZ0lDQWdJQ0I4ZkNCMWJtUmxabWx1WldRc1hISmNiaUFnSUNBZ0lDQWdiRzlqYTBSaGVYTkdhV3gwWlhJNklDQWdJRzl3ZEdsdmJuTXViRzlqYTBSaGVYTkdhV3gwWlhJZ0lDQWdmSHdnZFc1a1pXWnBibVZrTENBZ0x5OGdZMkZzYkdKaFkyc29aR0YwWlNrZzBZVFJnOUM5MExyUmh0QzQwWThnMExIUXU5QyswTHJRdU5HQTBMN1FzdEN3MEwzUXVOR1BJTkMwMExEUmdpd2dkSEoxWlM5TVQwTkxYSEpjYmlBZ0lDQWdJQ0FnYjI0NklFOWlhbVZqZEM1aGMzTnBaMjRvZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WVc1blpWTmxiR1ZqZERvZ2JuVnNiQ3dnTHk4ZzBZSFF2dEN4MFl2Umd0QzQwTFVnMExMUmk5Q3gwTDdSZ05Dd0lOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXNDRFF0TkN3MFlKY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWkdGNVUyVnNaV04wT2lCdWRXeHNMQ0FnSUM4dklOR0IwTDdRc2RHTDBZTFF1TkMxSU5DeTBZdlFzZEMrMFlEUXNDRFF2dEMwMEwzUXZ0QzVJTkMwMExEUmd0R0xJQ2pSZ3RDKzBMdlJqTkM2MEw0ZzBML1JnTkM0SUhOcGJtZHNaVTF2WkdVNklIUnlkV1VwWEhKY2JpQWdJQ0FnSUNBZ2ZTd2diM0IwYVc5dWN5NXZiaUI4ZkNCN2ZTa3NYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHk4ZzBZRFJqOUMwMEwzUXZ0R0IwWUxSakZ4eVhHNGdJQ0FnYVdZZ0tIUjVjR1Z2WmlCMGFHbHpMbTl3ZEdsdmJuTXVjR1Z5VW05M0lEMDlJQ2QxYm1SbFptbHVaV1FuS1NCN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1dmNIUnBiMjV6TG5CbGNsSnZkeUE5SUhSb2FYTXViM0IwYVc5dWN5NXRiMjUwYUhORGIzVnVkRHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdktpcGNjbHh1SUNBZ0lDQXFJTkNZMEwzUXVOR0cwTGpRc05DNzBMalF0OUN3MFliUXVOR1BYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdWFXNXBkQ0E5SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVh5UndhV05yWlhJZ1BTQjBhR2x6TGw4a1kzSmxZWFJsUld4bGJXVnVkQ2hjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdZRHhrYVhZZ1kyeGhjM005WENKRVlYUmxjbUZ1WjJWd2FXTnJaWEpjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pFWVhSbGNtRnVaMlZ3YVdOclpYSmZYMjF2Ym5Sb2Mxd2lQand2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBOEwyUnBkajVnWEhKY2JpQWdJQ0FnSUNBZ0tUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0x5OGcwWTNRdTlDMTBMelF0ZEM5MFlMUmkxeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVh5UnRiMjUwYUhNZ1BTQjBhR2x6TGw4a2NHbGphMlZ5TG5GMVpYSjVVMlZzWldOMGIzSW9KeTVFWVhSbGNtRnVaMlZ3YVdOclpYSmZYMjF2Ym5Sb2N5Y3BPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURRdU5DOTBMalJodEM0MExEUXU5QzQwTGZRc05HRzBMalJqeURSZ2RDKzBZSFJndEMrMFkvUXZkQzQwTGxjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbkpoYm1kbFVtVnpaWFFvS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnTHk4ZzBZRFF0ZEM5MExUUXRkR0FYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZKR055WldGMFpVMXZiblJvY3loMGFHbHpMbTl3ZEdsdmJuTXViV2x1UkdGMFpTazdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZKR052Ym5SaGFXNWxjaTVoY0hCbGJtUkRhR2xzWkNoMGFHbHpMbDhrY0dsamEyVnlLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdktpcGNjbHh1SUNBZ0lDQXFJTkNkMExEUXQ5Q3kwTERRdmRDNDBMVWcwTHpRdGRHQjBZL1JodEN3WEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnSUh0RVlYUmxmU0JrWVhSbElOQ2UwTEhSaXRDMTBMclJnaURRdE5DdzBZTFJpMXh5WEc0Z0lDQWdJQ29nUUhKbGRIVnliaUI3VTNSeWFXNW5mVnh5WEc0Z0lDQWdJQ292WEhKY2JpQWdJQ0IwYUdsekxtZGxkRTF2Ym5Sb1JtOXliV0YwZEdWa0lEMGdablZ1WTNScGIyNG9aR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElIUnBkR3hsSUQwZ2RHaHBjeTVuWlhSRVlYUmxWR2x0WlVadmNtMWhkQ2hrWVhSbExDQjdiVzl1ZEdnNklDZHNiMjVuSjMwcE8xeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhWFJzWlM1emJHbGpaU2d3TENBeEtTNTBiMVZ3Y0dWeVEyRnpaU2dwSUNzZ2RHbDBiR1V1YzJ4cFkyVW9NU2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5b3FYSEpjYmlBZ0lDQWdLaURRcE5DKzBZRFF2TkN3MFlMUXVOR0EwTDdRc3RDdzBMM1F1TkMxSU5DMDBMRFJndEdMSU5DMDBMdlJqeURSZ3RDMTBMclJnOUdKMExYUXVTRFF1OUMrMExyUXNOQzcwTGhjY2x4dUlDQWdJQ0FxSUVCd1lYSmhiU0FnZTBSaGRHVjlJQ0FnWkdGMFpTQWdJQ0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ0FnSUNBcUlFQndZWEpoYlNBZ2UwOWlhbVZqZEgwZ2IzQjBhVzl1Y3lEUW45Q3cwWURRc05DODBMWFJndEdBMFl0Y2NseHVJQ0FnSUNBcUlFQnlaWFIxY200Z2UxTjBjbWx1WjMxY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVuWlhSRVlYUmxWR2x0WlVadmNtMWhkQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXNJRzl3ZEdsdmJuTXBJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnU1c1MGJDNUVZWFJsVkdsdFpVWnZjbTFoZENoMGFHbHpMbTl3ZEdsdmJuTXViRzlqWVd4bExDQnZjSFJwYjI1ektTNW1iM0p0WVhRb1pHRjBaU2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5b3FYSEpjYmlBZ0lDQWdLaURRbE5DOTBMZ2cwTDNRdGRDMDBMWFF1OUM0WEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUhSb2FYTXVaMlYwVjJWbGEwUmhlWE5HYjNKdFlYUjBaV1FnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQmtZWFJsSUQwZ2JtVjNJRVJoZEdVb0tUdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQnlaWE4xYkhRZ1BTQmJYVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdaR0YwWlM1elpYUkVZWFJsS0dSaGRHVXVaMlYwUkdGMFpTZ3BJQzBnTWlrN1hISmNiaUFnSUNBZ0lDQWdabTl5SUNoc1pYUWdhU0E5SURBN0lHa2dQQ0EzT3lBcksya3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdaR0YwWlM1elpYUkVZWFJsS0dSaGRHVXVaMlYwUkdGMFpTZ3BJQ3NnTVNrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGMzVnNkQzV3ZFhOb0tIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR1JoZVRvZ1pHRjBaUzVuWlhSRVlYa29LU3hjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhScGRHeGxPaUIwYUdsekxtZGxkRVJoZEdWVWFXMWxSbTl5YldGMEtHUmhkR1VzSUh0M1pXVnJaR0Y1T2lBbmMyaHZjblFuZlNrc1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUgwcE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdMeThnMFlIUXZ0R0EwWUxRdU5HQTBMN1FzdEM2MExBZzBZSFF2dEN6MEx2UXNOR0IwTDNRdmlEUXZkQ3cwWUhSZ3RHQTBMN1F0ZEM5MEwzUXZ0QzgwWU1nMEwvUXRkR0EwTExRdnRDODBZTWcwTFRRdmRHT0lOQzkwTFhRdE5DMTBMdlF1Rnh5WEc0Z0lDQWdJQ0FnSUhKbGMzVnNkQzV6YjNKMEtDaGhMQ0JpS1NBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHTnZibk4wSUdacGNuTjBSR0Y1VDJaVWFHVlhaV1ZySUQwZ2RHaHBjeTV2Y0hScGIyNXpMbVpwY25OMFJHRjVUMlpVYUdWWFpXVnJJQ1VnTnp0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnYkdWMElHUmhlVUVnUFNCaExtUmhlVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdiR1YwSUdSaGVVSWdQU0JpTG1SaGVUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoa1lYbEJJRDA5SUdacGNuTjBSR0Y1VDJaVWFHVlhaV1ZyS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z0xURTdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoa1lYbENJRDA5SUdacGNuTjBSR0Y1VDJaVWFHVlhaV1ZyS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z01UdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdhV1lnS0dSaGVVRWdQQ0JtYVhKemRFUmhlVTltVkdobFYyVmxheWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1pHRjVRU0FyUFNCeVpYTjFiSFF1YkdWdVozUm9PMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb1pHRjVRaUE4SUdacGNuTjBSR0Y1VDJaVWFHVlhaV1ZyS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmtZWGxDSUNzOUlISmxjM1ZzZEM1c1pXNW5kR2c3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJrWVhsQklDMGdaR0Y1UWp0Y2NseHVJQ0FnSUNBZ0lDQjlLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlISmxjM1ZzZER0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZLaXBjY2x4dUlDQWdJQ0FxSU5DYTBMN1F1OUM0MFlmUXRkR0IwWUxRc3RDK0lOQzAwTDNRdGRDNUlOQ3lJTkM4MExYUmdkR1AwWWJRdFZ4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUNCN1JHRjBaWDBnWkdGMFpTRFFudEN4MFlyUXRkQzYwWUlnMExUUXNOR0MwWXRjY2x4dUlDQWdJQ0FxSUVCeVpYUjFjbTRnZTA1MWJXSmxjbjBnSUNBZzBKclF2dEM3MExqUmg5QzEwWUhSZ3RDeTBMNGcwTFRRdmRDMTBMbGNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdkR2hwY3k1blpYUkVZWGx6UTI5MWJuUkpiazF2Ym5Sb0lEMGdablZ1WTNScGIyNG9aR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElHUmhlWE1nUFNCdVpYY2dSR0YwWlNoa1lYUmxMbWRsZEZScGJXVW9LU2s3WEhKY2JpQWdJQ0FnSUNBZ1pHRjVjeTV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVJQ0FnSUNBZ0lDQmtZWGx6TG5ObGRFMXZiblJvS0dSaGVYTXVaMlYwVFc5dWRHZ29LU0FySURFcE8xeHlYRzRnSUNBZ0lDQWdJR1JoZVhNdWMyVjBSR0YwWlNnd0tUdGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdaR0Y1Y3k1blpYUkVZWFJsS0NrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUW9OQzEwTDNRdE5DMTBZQWcwTFRRdU5DdzBML1FzTkMzMEw3UXZkQ3dJTkM4MExYUmdkR1AwWWJRdGRDeVhISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UwUmhkR1Y5SUdSaGRHVmZabkp2YlNEUW5kQ3cwWWZRc05DNzBZelF2ZEN3MFk4ZzBMVFFzTkdDMExCY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVmSkdOeVpXRjBaVTF2Ym5Sb2N5QTlJR1oxYm1OMGFXOXVLR1JoZEdWZlpuSnZiU2tnZTF4eVhHNGdJQ0FnSUNBZ0lIZG9hV3hsSUNoMGFHbHpMbDhrYlc5dWRHaHpMbXhoYzNSRmJHVnRaVzUwUTJocGJHUXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZkpHMXZiblJvY3k1eVpXMXZkbVZEYUdsc1pDaDBhR2x6TGw4a2JXOXVkR2h6TG14aGMzUkZiR1Z0Wlc1MFEyaHBiR1FwTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0x5OGcwTC9SZ05DMTBZRFF0ZEM5MExUUXRkR0FJTkM4MExYUmdkR1AwWWJRdGRDeVhISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1kzVnljbVZ1ZEVSaGRHVWdQU0J1WlhjZ1JHRjBaU2hrWVhSbFgyWnliMjB1WjJWMFZHbHRaU2dwS1R0Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENBa2JXOXVkR2h6SUQwZ1cxMDdYSEpjYmlBZ0lDQWdJQ0FnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCMGFHbHpMbTl3ZEdsdmJuTXViVzl1ZEdoelEyOTFiblE3SUNzcmFTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWtiVzl1ZEdoekxuQjFjMmdvZEdocGN5NWZKR055WldGMFpVMXZiblJvS0dOMWNuSmxiblJFWVhSbEtTazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHTjFjbkpsYm5SRVlYUmxMbk5sZEUxdmJuUm9LR04xY25KbGJuUkVZWFJsTG1kbGRFMXZiblJvS0NrZ0t5QXhLVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOR0EwTFhRdmRDMDBMWFJnRnh5WEc0Z0lDQWdJQ0FnSUdadmNpQW9iR1YwSUdrZ1BTQXdPeUJwSUR3Z0pHMXZiblJvY3k1c1pXNW5kR2c3SUdrZ0t6MGdkR2hwY3k1dmNIUnBiMjV6TG5CbGNsSnZkeWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JqYjI1emRDQWtjbTkzSUQwZ1pHOWpkVzFsYm5RdVkzSmxZWFJsUld4bGJXVnVkQ2duWkdsMkp5azdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDUnliM2N1WTJ4aGMzTk9ZVzFsSUQwZ0owUmhkR1Z5WVc1blpYQnBZMnRsY2w5ZmNtOTNKenRjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUNSdGIyNTBhSE11YzJ4cFkyVW9hU3dnYVNBcklIUm9hWE11YjNCMGFXOXVjeTV3WlhKU2IzY3BMbVp2Y2tWaFkyZ29KRzF2Ym5Sb0lEMCtJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNSeWIzY3VZWEJ3Wlc1a1EyaHBiR1FvSkcxdmJuUm9LVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbDhrYlc5dWRHaHpMbUZ3Y0dWdVpFTm9hV3hrS0NSeWIzY3BPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11WDNObGJHVmpkR2x2YmlBbUppQW9kR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTQjhmQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVaR0YwWlY5MGJ5a3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFRaV3hsWTNRb2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZabkp2YlN3Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlOQ2cwTFhRdmRDMDBMWFJnQ0RRdk5DMTBZSFJqOUdHMExCY2NseHVJQ0FnSUNBcUlFQndZWEpoYlNCN1JHRjBaWDBnWkdGMFpTRFFuTkMxMFlIUmo5R0dYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVh5UmpjbVZoZEdWTmIyNTBhQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0JqZFhKeVpXNTBUVzl1ZEdnZ1BTQmtZWFJsTG1kbGRFMXZiblJvS0NrN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2JXOXVkR2hVYVhSc1pTQTlJSFJvYVhNdVoyVjBUVzl1ZEdoR2IzSnRZWFIwWldRb1pHRjBaU2s3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnZDJWbGEwUmhlWE1nUFNCMGFHbHpMbWRsZEZkbFpXdEVZWGx6Um05eWJXRjBkR1ZrS0NrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJQ1J0YjI1MGFDQTlJSFJvYVhNdVh5UmpjbVZoZEdWRmJHVnRaVzUwS0Z4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JnUEdScGRpQmpiR0Z6Y3oxY0lrMXZiblJvWENJZ1pHRjBZUzEwYVcxbFBWd2lKSHRrWVhSbExtZGxkRlJwYldVb0tYMWNJajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUY5ZmFHVmhaR1Z5WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrMXZiblJvWDE5aGNuSnZkeUJOYjI1MGFGOWZZWEp5YjNjdExYQnlaWFlrZXloMGFHbHpMbTl3ZEdsdmJuTXViV2x1UkdGMFpTQW1KaUJrWVhSbElEdzlJSFJvYVhNdWIzQjBhVzl1Y3k1dGFXNUVZWFJsS1NBL0lDY2dhWE10WkdsellXSnNaV1FuSURvZ0p5ZDlYQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4emRtY2dkMmxrZEdnOVhDSTRYQ0lnYUdWcFoyaDBQVndpTVRSY0lpQjJhV1YzUW05NFBWd2lNQ0F3SURnZ01UUmNJaUJtYVd4c1BWd2libTl1WlZ3aUlIaHRiRzV6UFZ3aWFIUjBjRG92TDNkM2R5NTNNeTV2Y21jdk1qQXdNQzl6ZG1kY0lqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4d1lYUm9JR1E5WENKTk55QXhNMHd4SURkTU55QXhYQ0lnYzNSeWIydGxQVndpSXpoRE9FTTRRMXdpSUhOMGNtOXJaUzEzYVdSMGFEMWNJakpjSWlCemRISnZhMlV0YkdsdVpXTmhjRDFjSW5KdmRXNWtYQ0lnYzNSeWIydGxMV3hwYm1WcWIybHVQVndpY205MWJtUmNJajQ4TDNCaGRHZytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2YzNablBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGOWZkR2wwYkdWY0lqNGtlMjF2Ym5Sb1ZHbDBiR1Y5SUNSN1pHRjBaUzVuWlhSR2RXeHNXV1ZoY2lncGZUd3ZaR2wyUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHhrYVhZZ1kyeGhjM005WENKTmIyNTBhRjlmWVhKeWIzY2dUVzl1ZEdoZlgyRnljbTkzTFMxdVpYaDBKSHNvZEdocGN5NXZjSFJwYjI1ekxtMWhlRVJoZEdVZ0ppWWdaR0YwWlNBK1BTQjBhR2x6TG05d2RHbHZibk11YldGNFJHRjBaU2tnUHlBbklHbHpMV1JwYzJGaWJHVmtKeUE2SUNjbmZWd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNabklIZHBaSFJvUFZ3aU9Gd2lJR2hsYVdkb2REMWNJakUwWENJZ2RtbGxkMEp2ZUQxY0lqQWdNQ0E0SURFMFhDSWdabWxzYkQxY0ltNXZibVZjSWlCNGJXeHVjejFjSW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpJd01EQXZjM1puWENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4Y0dGMGFDQmtQVndpVFRFZ01DNDVPVGs1T1RsTU55QTNUREVnTVROY0lpQnpkSEp2YTJVOVhDSWpPRU00UXpoRFhDSWdjM1J5YjJ0bExYZHBaSFJvUFZ3aU1sd2lJSE4wY205clpTMXNhVzVsWTJGd1BWd2ljbTkxYm1SY0lpQnpkSEp2YTJVdGJHbHVaV3B2YVc0OVhDSnliM1Z1WkZ3aVBqd3ZjR0YwYUQ1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BDOXpkbWMrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGOWZkMlZsYTF3aVBpUjdkMlZsYTBSaGVYTXViV0Z3S0dsMFpXMGdQVDRnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQmdQR1JwZGlCamJHRnpjejFjSWsxdmJuUm9YMTkzWldWclpHRjVYQ0krSkh0cGRHVnRMblJwZEd4bGZUd3ZaR2wyUG1CY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHBMbXB2YVc0b0p5Y3BmVHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjejFjSWsxdmJuUm9YMTlrWVhselhDSStQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbUJjY2x4dUlDQWdJQ0FnSUNBcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5RFJnZEdDMFlEUXRkQzcwTHJRdUZ4eVhHNGdJQ0FnSUNBZ0lGdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2UzTmxiR1ZqZEc5eU9pQW5MazF2Ym5Sb1gxOWhjbkp2ZHkwdGNISmxkaWNzSUc1aGJXVTZJQ2R3Y21WMkozMHNYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIdHpaV3hsWTNSdmNqb2dKeTVOYjI1MGFGOWZZWEp5YjNjdExXNWxlSFFuTENCdVlXMWxPaUFuYm1WNGRDZDlMRnh5WEc0Z0lDQWdJQ0FnSUYwdVptOXlSV0ZqYUNocGRHVnRJRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdKR0Z5Y205M0lEMGdKRzF2Ym5Sb0xuRjFaWEo1VTJWc1pXTjBiM0lvYVhSbGJTNXpaV3hsWTNSdmNpazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDUmhjbkp2ZHk1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkamJHbGpheWNzSUdVZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NWZiMjVCY25KdmQwTnNhV05yS0NSaGNuSnZkeXdnYVhSbGJTNXVZVzFsS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZlNrN1hISmNiaUFnSUNBZ0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5HQTBMWFF2ZEMwMExYUmdDRFF0TkM5MExYUXVWeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElDUmtZWGx6SUQwZ0pHMXZiblJvTG5GMVpYSjVVMlZzWldOMGIzSW9KeTVOYjI1MGFGOWZaR0Y1Y3ljcE8xeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElHUmhlWE1nUFNCdVpYY2dSR0YwWlNoa1lYUmxMbWRsZEZScGJXVW9LU2s3WEhKY2JpQWdJQ0FnSUNBZ1pHRjVjeTV6WlhSRVlYUmxLREVwTzF4eVhHNGdJQ0FnSUNBZ0lHUmhlWE11YzJWMFNHOTFjbk1vTUN3Z01Dd2dNQ3dnTUNrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUhkb2FXeGxJQ2hrWVhsekxtZGxkRTF2Ym5Sb0tDa2dQVDBnWTNWeWNtVnVkRTF2Ym5Sb0tTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHTnZibk4wSUNSM1pXVnJJRDBnZEdocGN5NWZKR055WldGMFpWZGxaV3NvS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIZGxaV3RFWVhsekxtWnZja1ZoWTJnb2FYUmxiU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBaaUFvWkdGNWN5NW5aWFJFWVhrb0tTQWhQU0JwZEdWdExtUmhlU0I4ZkNCa1lYbHpMbWRsZEUxdmJuUm9LQ2tnSVQwZ1kzVnljbVZ1ZEUxdmJuUm9LU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdKSGRsWldzdVlYQndaVzVrUTJocGJHUW9kR2hwY3k1ZkpHTnlaV0YwWlVWdGNIUjVSR0Y1S0NrcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FrZDJWbGF5NWhjSEJsYm1SRGFHbHNaQ2gwYUdsekxsOGtZM0psWVhSbFJHRjVLR1JoZVhNcEtUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR1JoZVhNdWMyVjBSR0YwWlNoa1lYbHpMbWRsZEVSaGRHVW9LU0FySURFcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCOUtUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ1JrWVhsekxtRndjR1Z1WkVOb2FXeGtLQ1IzWldWcktUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQWtiVzl1ZEdnN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUW10QzcwTGpRdWlEUXY5QytJTkdCMFlMUmdOQzEwTHZRdXRDMUlOQy8wTFhSZ05DMTBMclF1OUdPMFlmUXRkQzkwTGpSanlEUXZOQzEwWUhSajlHRzBMQmNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdSV3hsYldWdWRIMGdKR0Z5Y205M0lFaFVUVXdnMFkzUXU5QzEwTHpRdGRDOTBZSmNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdVM1J5YVc1bmZTQnVZVzFsSUNBZ0lOQ1kwTHpSanlBb2NISmxkaXdnYm1WNGRDbGNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdkR2hwY3k1ZmIyNUJjbkp2ZDBOc2FXTnJJRDBnWm5WdVkzUnBiMjRvSkdGeWNtOTNMQ0J1WVcxbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tDUmhjbkp2ZHk1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0oybHpMV1JwYzJGaWJHVmtKeWtwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1pHRjBaU0E5SUc1bGR5QkVZWFJsS0hCaGNuTmxTVzUwS0hSb2FYTXVYeVJ0YjI1MGFITXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxrMXZiblJvSnlrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcE8xeHlYRzRnSUNBZ0lDQWdJR1JoZEdVdWMyVjBUVzl1ZEdnb1pHRjBaUzVuWlhSTmIyNTBhQ2dwSUNzZ0tHNWhiV1VnUFQwZ0ozQnlaWFluSUQ4Z0xYUm9hWE11YjNCMGFXOXVjeTV0YjI1MGFITkRiM1Z1ZENBNklIUm9hWE11YjNCMGFXOXVjeTV0YjI1MGFITkRiM1Z1ZENrcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5RFFzdEdMMFlYUXZ0QzBJTkMzMExBZzBML1JnTkMxMExUUXRkQzcwWXNnMEx6UXVOQzkwTGpRdk5DdzBMdlJqTkM5MEw3UXVTRFF0TkN3MFlMUmkxeHlYRzRnSUNBZ0lDQWdJR2xtSUNoa1lYUmxJRHdnZEdocGN5NXZjSFJwYjI1ekxtMXBia1JoZEdVcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1pHRjBaUzV6WlhSVWFXMWxLSFJvYVhNdWIzQjBhVzl1Y3k1dGFXNUVZWFJsTG1kbGRGUnBiV1VvS1NrN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURRc3RHTDBZWFF2dEMwSU5DMzBMQWcwTC9SZ05DMTBMVFF0ZEM3MFlzZzBMelFzTkM2MFlIUXVOQzgwTERRdTlHTTBMM1F2dEM1SU5DMDBMRFJndEdMWEhKY2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1dFlYaEVZWFJsS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdOdmJuTjBJR1Z1WkVSaGRHVWdQU0J1WlhjZ1JHRjBaU2hrWVhSbExtZGxkRlJwYldVb0tTazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHVnVaRVJoZEdVdWMyVjBUVzl1ZEdnb1pXNWtSR0YwWlM1blpYUk5iMjUwYUNncElDc2dkR2hwY3k1dmNIUnBiMjV6TG0xdmJuUm9jME52ZFc1MEtUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR1Z1WkVSaGRHVWdQaUIwYUdsekxtOXdkR2x2Ym5NdWJXRjRSR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdaR0YwWlM1elpYUlVhVzFsS0hSb2FYTXViM0IwYVc5dWN5NXRZWGhFWVhSbExtZGxkRlJwYldVb0tTazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JrWVhSbExuTmxkRTF2Ym5Sb0tHUmhkR1V1WjJWMFRXOXVkR2dvS1NBdElIUm9hWE11YjNCMGFXOXVjeTV0YjI1MGFITkRiM1Z1ZENBcklERXBPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOGtZM0psWVhSbFRXOXVkR2h6S0dSaGRHVXBPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwS0RRdGRDOTBMVFF0ZEdBSU5DOTBMWFF0TkMxMEx2UXVGeHlYRzRnSUNBZ0lDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ0FnSUNBcUlFQnlaWFIxY200Z2UwVnNaVzFsYm5SOVhISmNiaUFnSUNBZ0tpOWNjbHh1SUNBZ0lIUm9hWE11WHlSamNtVmhkR1ZYWldWcklEMGdablZ1WTNScGIyNG9aR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElDUjNaV1ZySUQwZ2RHaHBjeTVmSkdOeVpXRjBaVVZzWlcxbGJuUW9YSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHQThaR2wySUdOc1lYTnpQVndpVjJWbGExd2lQand2WkdsMlBtQmNjbHh1SUNBZ0lDQWdJQ0FwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdKSGRsWldzN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUW9OQzEwTDNRdE5DMTBZQWcwTFRRdmRHUFhISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ0lIdEVZWFJsZlNCa1lYUmxJTkNlMExIUml0QzEwTHJSZ2lEUXROQ3cwWUxSaTF4eVhHNGdJQ0FnSUNvZ1FISmxkSFZ5YmlCN1JXeGxiV1Z1ZEgxY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVmSkdOeVpXRjBaVVJoZVNBOUlHWjFibU4wYVc5dUtHUmhkR1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCc2IyTnJaV1FnUFNCMGFHbHpMbWRsZEVSaGVVeHZZMnRsWkNoa1lYUmxLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ0pHUmhlU0E5SUhSb2FYTXVYeVJqY21WaGRHVkZiR1Z0Wlc1MEtGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCZ1BHUnBkaUJqYkdGemN6MWNJa1JoZVNSN2JHOWphMlZrSUQ4Z0p5QnBjeTFrYVhOaFlteGxaQ2NnT2lBbkozMGtlMnh2WTJ0bFpDQTlQU0JNVDBOTFgweFBRMHRGUkNBL0lDY2dhWE10Ykc5amEyVmtKeUE2SUNjbmZWd2lJR1JoZEdFdGRHbHRaVDFjSWlSN1pHRjBaUzVuWlhSVWFXMWxLQ2w5WENJZ1pHRjBZUzFrWVhrOVhDSWtlMlJoZEdVdVoyVjBSR0Y1S0NsOVhDSStKSHRrWVhSbExtZGxkRVJoZEdVb0tYMDhMMlJwZGo1Z1hISmNiaUFnSUNBZ0lDQWdLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdKR1JoZVM1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0NkamJHbGpheWNzSUhSb2FYTXVYMjl1UkdGNVEyeHBZMnRGZG1WdWRDNWlhVzVrS0hSb2FYTXBLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdhV1lnS0NGMGFHbHpMbTl3ZEdsdmJuTXVjMmx1WjJ4bFRXOWtaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FrWkdGNUxtRmtaRVYyWlc1MFRHbHpkR1Z1WlhJb0oyMXZkWE5sWlc1MFpYSW5MQ0IwYUdsekxsOXZia1JoZVUxdmRYTmxSVzUwWlhKRmRtVnVkQzVpYVc1a0tIUm9hWE1wS1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlBa1pHRjVPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwS0hRdnRDeDBZdlJndEM0MExVZzBMclF1OUM0MExyUXNDRFF2OUMrSU5DMDBMM1JqbHh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRGZG1WdWRIMGdaU0JFVDAwZzBZSFF2dEN4MFl2Umd0QzQwTFZjY2x4dUlDQWdJQ0FxTDF4eVhHNGdJQ0FnZEdocGN5NWZiMjVFWVhsRGJHbGphMFYyWlc1MElEMGdablZ1WTNScGIyNG9aU2tnZTF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDI5dVJHRjVRMnhwWTJzb1pTNTBZWEpuWlhRcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBLSFF2dEN4MFl2Umd0QzQwTFVnMFlYUXZ0Q3kwTFhSZ05Dd1hISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UwVjJaVzUwZlNCbElFUlBUU0RSZ2RDKzBMSFJpOUdDMExqUXRWeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TGw5dmJrUmhlVTF2ZFhObFJXNTBaWEpGZG1WdWRDQTlJR1oxYm1OMGFXOXVLR1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw5dmJrUmhlVTF2ZFhObFJXNTBaWElvWlM1MFlYSm5aWFFwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHFLbHh5WEc0Z0lDQWdJQ29nMEtYUXZ0Q3kwTFhSZ0NEUXZkQ3dJTkdOMEx2UXRkQzgwTFhRdmRHQzBMVWcwTFRRdmRHUFhISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UwVnNaVzFsYm5SOUlDUmtZWGtnU0ZSTlRDRFFyZEM3MExYUXZOQzEwTDNSZ2x4eVhHNGdJQ0FnSUNvdlhISmNiaUFnSUNCMGFHbHpMbDl2YmtSaGVVMXZkWE5sUlc1MFpYSWdQU0JtZFc1amRHbHZiaWdrWkdGNUtTQjdYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tDRjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dElIeDhJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2drWkdGNUxtUmhkR0Z6WlhRdWRHbHRaU0E5UFNCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0TG1kbGRGUnBiV1VvS1NrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0JrWVhSbFgzUnZJRDBnYm1WM0lFUmhkR1VvY0dGeWMyVkpiblFvSkdSaGVTNWtZWFJoYzJWMExuUnBiV1VzSURFd0tTazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wS0hSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzhwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHFLbHh5WEc0Z0lDQWdJQ29nMEpyUXU5QzQwTG9nMEwvUXZpRFF0TkM5MFk1Y2NseHVJQ0FnSUNBcUlFQndZWEpoYlNCN1JXeGxiV1Z1ZEgwZ0pHUmhlU0JJVkUxTUlOQ3QwTHZRdGRDODBMWFF2ZEdDWEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUhSb2FYTXVYMjl1UkdGNVEyeHBZMnNnUFNCbWRXNWpkR2x2Ymlna1pHRjVLU0I3WEhKY2JpQWdJQ0FnSUNBZ0x5OGcwTFRRdGRDOTBZd2cwTGZRc05DeDBMdlF2dEM2MExqUmdOQyswTExRc05DOVhISmNiaUFnSUNBZ0lDQWdhV1lnS0NSa1lYa3VZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RwY3kxa2FYTmhZbXhsWkNjcEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOQ3kwWXZRc2RDKzBZQWcwTDdRdE5DOTBMN1F1U0RRdE5DdzBZTFJpMXh5WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11YzJsdVoyeGxUVzlrWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbkpoYm1kbFVtVnpaWFFvS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSkdSaGVTNWpiR0Z6YzB4cGMzUXVZV1JrS0NkcGN5MXpaV3hsWTNSbFpDY3BPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5allXeHNZbUZqYXlnblpHRjVVMlZzWldOMEp5d2dibVYzSUVSaGRHVW9jR0Z5YzJWSmJuUW9KR1JoZVM1a1lYUmhjMlYwTG5ScGJXVXNJREV3S1NrcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5RFJnZEN4MFlEUXZ0R0JJTkN5MFl2UXNkR0EwTERRdmRDOTBMN1FzOUMrSU5HQTBMRFF2ZEMxMExVZzBMVFF1TkN3MEwvUXNOQzMwTDdRdmRDd1hISmNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBnSmlZZ2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NXlZVzVuWlZKbGMyVjBLQ2s3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBa1pHRjVMbU5zWVhOelRHbHpkQzVoWkdRb0oybHpMWE5sYkdWamRHVmtKeWs3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5DeTBZdlFzZEdBMExEUXZkQ3dJTkM5MExEUmg5Q3cwTHZSak5DOTBMRFJqeUF2SU5DNjBMN1F2ZEMxMFlmUXZkQ3cwWThnMExUUXNOR0MwTEJjY2x4dUlDQWdJQ0FnSUNCcFppQW9JWFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMHBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTQTlJRzVsZHlCRVlYUmxLSEJoY25ObFNXNTBLQ1JrWVhrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcE8xeHlYRzRnSUNBZ0lDQWdJSDBnWld4elpTQnBaaUFvSVhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdklEMGdibVYzSUVSaGRHVW9jR0Z5YzJWSmJuUW9KR1JoZVM1a1lYUmhjMlYwTG5ScGJXVXNJREV3S1NrN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU0FtSmlCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0F2THlEUXROQyswTC9SZzlHQjBZTFF1TkM4MFl2UXVTRFF0TkM0MExEUXY5Q3cwTGZRdnRDOVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1blpYUkpjMUpoYm1kbFUyVnNaV04wWVdKc1pTaDBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dExDQjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjkwYnlrcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdWNtRnVaMlZTWlhObGRDZ3BPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxuSmhibWRsVTJWc1pXTjBLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMHNJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5b3FYSEpjYmlBZ0lDQWdLaURRb2RDeDBZRFF2dEdCSU5DeTBZdlF0TkMxMEx2UXRkQzkwTDNSaTlHRklOQzAwTERSZ2x4eVhHNGdJQ0FnSUNvdlhISmNiaUFnSUNCMGFHbHpMbkpoYm1kbFVtVnpaWFFnUFNCbWRXNWpkR2x2YmlncElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRkpsYzJWMEtDazdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZjMlZzWldOMGFXOXVJRDBnZTMwN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUWt0QzQwTGZSZzlDdzBMdlJqTkM5MFl2UXVTRFJnZEN4MFlEUXZ0R0JJTkN5MFl2UXROQzEwTHZRdGRDOTBMM1JpOUdGSU5DMDBMRFJnbHh5WEc0Z0lDQWdJQ292WEhKY2JpQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRkpsYzJWMElEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnSkdSaGVYTWdQU0IwYUdsekxsOGtiVzl1ZEdoekxuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b0p5NUVZWGxiWkdGMFlTMTBhVzFsWFNjcE8xeHlYRzRnSUNBZ0lDQWdJQ1JrWVhsekxtWnZja1ZoWTJnb0pHUmhlU0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNSa1lYa3VZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRabkp2YlNjc0lDZHBjeTF6Wld4bFkzUmxaQzEwYnljc0lDZHBjeTF6Wld4bFkzUmxaQzFpWlhSM1pXVnVKeWs3WEhKY2JpQWdJQ0FnSUNBZ2ZTazdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRFFrdEM0MExmUmc5Q3cwTHZSak5DOTBMN1F0U0RRc3RHTDBMVFF0ZEM3MExYUXZkQzQwTFVnMExUUXNOR0NYSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMFJoZEdWOUlHUmhkR1ZmWm5KdmJTRFFuZEN3MFlmUXNOQzcwWXpRdmRDdzBZOGcwTFRRc05HQzBMQmNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdSR0YwWlgwZ1pHRjBaVjkwYnlBZ0lOQ2EwTDdRdmRDMTBZZlF2ZEN3MFk4ZzBMVFFzTkdDMExCY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1FnUFNCbWRXNWpkR2x2Ymloa1lYUmxYMlp5YjIwc0lHUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0JwWmlBb1pHRjBaVjltY205dElDWW1JR1JoZEdWZlpuSnZiU0JwYm5OMFlXNWpaVzltSUVSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdaR0YwWlY5bWNtOXRMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLR1JoZEdWZmRHOGdKaVlnWkdGMFpWOTBieUJwYm5OMFlXNWpaVzltSUVSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdaR0YwWlY5MGJ5NXpaWFJJYjNWeWN5Z3dMQ0F3TENBd0xDQXdLVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOQ3kwWXZRc2RDKzBZQWcwTFRRc05HQ0lOQ3lJTkMrMExIUmdOQ3cwWUxRdmRDKzBMd2cwTC9RdnRHQTBZL1F0TkM2MExWY2NseHVJQ0FnSUNBZ0lDQnBaaUFvWkdGMFpWOW1jbTl0SUQ0Z1pHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCYlpHRjBaVjltY205dExDQmtZWFJsWDNSdlhTQTlJRnRrWVhSbFgzUnZMQ0JrWVhSbFgyWnliMjFkTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnZEdsdFpWOW1jbTl0SUQwZ1pHRjBaVjltY205dElHbHVjM1JoYm1ObGIyWWdSR0YwWlNBL0lHUmhkR1ZmWm5KdmJTNW5aWFJVYVcxbEtDa2dPaUF3TzF4eVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUhScGJXVmZkRzhnUFNCa1lYUmxYM1J2SUdsdWMzUmhibU5sYjJZZ1JHRjBaU0EvSUdSaGRHVmZkRzh1WjJWMFZHbHRaU2dwSURvZ01EdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQWtaR0Y1Y3lBOUlIUm9hWE11WHlSdGIyNTBhSE11Y1hWbGNubFRaV3hsWTNSdmNrRnNiQ2duTGtSaGVWdGtZWFJoTFhScGJXVmRKeWs3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5DeTBZdlF0TkMxMEx2UXRkQzkwTGpRdFNEUXROQ3cwWUlnMEx6UXRkQzIwTFRSZ3lEUXZkQ3cwWWZRc05DNzBZelF2ZEMrMExrZzBMZ2cwTHJRdnRDOTBMWFJoOUM5MEw3UXVWeHlYRzRnSUNBZ0lDQWdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnSkdSaGVYTXViR1Z1WjNSb095QXJLMmtwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSkdSaGVYTmJhVjB1WTJ4aGMzTk1hWE4wTG5SdloyZHNaU2duYVhNdGMyVnNaV04wWldRdFltVjBkMlZsYmljc0lDUmtZWGx6VzJsZExtUmhkR0Z6WlhRdWRHbHRaU0ErSUhScGJXVmZabkp2YlNBbUppQWtaR0Y1YzF0cFhTNWtZWFJoYzJWMExuUnBiV1VnUENCMGFXMWxYM1J2S1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDOHZJTkN5MFl2UXROQzEwTHZRdGRDOTBMalF0U0RRdmRDdzBZZlFzTkM3MFl6UXZkQyswTGtnMExnZzBMclF2dEM5MExYUmg5QzkwTDdRdVNEUXY5QyswTGZRdU5HRzBMalF1Rnh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJQ1JrWVhsZlpuSnZiU0E5SUhSb2FYTXVYeVJuWlhSRVlYbENlVVJoZEdVb1pHRjBaVjltY205dEtUdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQWtaR0Y1WDNSdklEMGdkR2hwY3k1ZkpHZGxkRVJoZVVKNVJHRjBaU2hrWVhSbFgzUnZLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdMeThnMExyUXRkR0lJTkMwMEx2Ump5RFFzZEdMMFlIUmd0R0EwTDdRczlDK0lOR0IwTEhSZ05DKzBZSFFzQ0RSZ2RHQzBMRFJnTkMrMExQUXZpRFFzdEdMMExUUXRkQzcwTFhRdmRDNDBZOWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb2RHaHBjeTVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1F1SkdSaGVWOW1jbTl0WDI5c1pDQW1KaUIwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDNGtaR0Y1WDJaeWIyMWZiMnhrSUNFOUlDUmtZWGxmWm5KdmJTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGTmxiR1ZqZEM0a1pHRjVYMlp5YjIxZmIyeGtMbU5zWVhOelRHbHpkQzV5WlcxdmRtVW9KMmx6TFhObGJHVmpkR1ZrSnl3Z0oybHpMWE5sYkdWamRHVmtMV1p5YjIwbktUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5DNjBMWFJpQ0RRdE5DNzBZOGcwTEhSaTlHQjBZTFJnTkMrMExQUXZpRFJnZEN4MFlEUXZ0R0IwTEFnMFlIUmd0Q3cwWURRdnRDejBMNGcwTExSaTlDMDBMWFF1OUMxMEwzUXVOR1BYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wTGlSa1lYbGZkRzlmYjJ4a0lDWW1JSFJvYVhNdVgzSmhibWRsVm1semRXRnNVMlZzWldOMExpUmtZWGxmZEc5ZmIyeGtJQ0U5SUNSa1lYbGZkRzhwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUXVKR1JoZVY5MGIxOXZiR1F1WTJ4aGMzTk1hWE4wTG5KbGJXOTJaU2duYVhNdGMyVnNaV04wWldRbkxDQW5hWE10YzJWc1pXTjBaV1F0ZEc4bktUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJR2xtSUNna1pHRjVYMlp5YjIwcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0pHUmhlVjltY205dExtTnNZWE56VEdsemRDNWhaR1FvSjJsekxYTmxiR1ZqZEdWa0p5d2dKMmx6TFhObGJHVmpkR1ZrTFdaeWIyMG5LVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUdsbUlDZ2taR0Y1WDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDUmtZWGxmZEc4dVkyeGhjM05NYVhOMExtRmtaQ2duYVhNdGMyVnNaV04wWldRbkxDQW5hWE10YzJWc1pXTjBaV1F0ZEc4bktUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5HQjBMN1JoZEdBMExEUXZkQzEwTDNRdU5DMUlOQ3lJTkM2MExYUmlGeHlYRzRnSUNBZ0lDQWdJSFJvYVhNdVgzSmhibWRsVm1semRXRnNVMlZzWldOMExpUmtZWGxmWm5KdmJWOXZiR1FnUFNBa1pHRjVYMlp5YjIwN1hISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFRaV3hsWTNRdUpHUmhlVjkwYjE5dmJHUWdQU0FrWkdGNVgzUnZPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwSkxSaTlDMDBMWFF1OUMxMEwzUXVOQzFJTkMwMExqUXNOQy8wTERRdDlDKzBMM1FzQ0RRdE5DdzBZSmNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQjdSR0YwWlgwZ1pHRjBaVjltY205dElOQ2QwTERSaDlDdzBMdlJqTkM5MExEUmp5RFF0TkN3MFlMUXNGeHlYRzRnSUNBZ0lDb2dRSEJoY21GdElIdEVZWFJsZlNCa1lYUmxYM1J2SUNBZzBKclF2dEM5MExYUmg5QzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdJQ0FnSUNvdlhISmNiaUFnSUNCMGFHbHpMbkpoYm1kbFUyVnNaV04wSUQwZ1puVnVZM1JwYjI0b1pHRjBaVjltY205dExDQmtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnWkdGMFpWOW1jbTl0TG5ObGRFaHZkWEp6S0RBc0lEQXNJREFzSURBcE8xeHlYRzRnSUNBZ0lDQWdJR1JoZEdWZmRHOHVjMlYwU0c5MWNuTW9NQ3dnTUN3Z01Dd2dNQ2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5DMDBMN1F2OUdEMFlIUmd0QzQwTHpSaTlDNUlOQzAwTGpRc05DLzBMRFF0OUMrMEwxY2NseHVJQ0FnSUNBZ0lDQnBaaUFvSVhSb2FYTXVaMlYwU1hOU1lXNW5aVk5sYkdWamRHRmliR1VvWkdGMFpWOW1jbTl0TENCa1lYUmxYM1J2S1NrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCc1pYUWdKR1JoZVY5bWNtOXRMQ0FrWkdGNVgzUnZPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURRc3RHTDBMSFF2dEdBSU5DMDBMRFJnaURRc2lEUXZ0Q3gwWURRc05HQzBMM1F2dEM4SU5DLzBMN1JnTkdQMExUUXV0QzFYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tHUmhkR1ZmWm5KdmJTQStJR1JoZEdWZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdXMlJoZEdWZlpuSnZiU3dnWkdGMFpWOTBiMTBnUFNCYlpHRjBaVjkwYnl3Z1pHRjBaVjltY205dFhUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0pHUmhlVjltY205dElEMGdkR2hwY3k1ZkpHZGxkRVJoZVVKNVJHRjBaU2hrWVhSbFgyWnliMjBwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FrWkdGNVgzUnZJRDBnZEdocGN5NWZKR2RsZEVSaGVVSjVSR0YwWlNoa1lYUmxYM1J2S1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2drWkdGNVgyWnliMjBwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSkdSaGVWOW1jbTl0TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMmx6TFhObGJHVmpkR1ZrSnl3Z0oybHpMWE5sYkdWamRHVmtMV1p5YjIwbktUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJR2xtSUNna1pHRjVYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNSa1lYbGZkRzh1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRkRzhuS1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDOHZJTkN5MFl2UXROQzEwTHZRdGRDOTBMalF0U0RSamRDNzBMWFF2TkMxMEwzUmd0QyswTEpjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQ2hrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzhwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0F2THlEUmdkQyswTEhSaTlHQzBMalF0Vnh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMk5oYkd4aVlXTnJLQ2R5WVc1blpWTmxiR1ZqZENjc0lHUmhkR1ZmWm5KdmJTd2daR0YwWlY5MGJ5azdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRFFuOUdBMEw3UXN0QzEwWURRdXRDd0lOQ3kwTDdRdDlDODBMN1F0dEM5MEw3UmdkR0MwTGdnMExMUmk5QzAwTFhRdTlDMTBMM1F1TkdQSU5DMDBMRFJnbHh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJQ0I3UkdGMFpTQmtZWFJsWDJaeWIyMGcwSjNRc05HSDBMRFF1OUdNMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdJSHRFWVhSbElHUmhkR1ZmZEc4Z0lDRFFtdEMrMEwzUXRkR0gwTDNRc05HUElOQzAwTERSZ3RDd1hISmNiaUFnSUNBZ0tpQkFjbVYwZFhKdUlIdENiMjlzWldGdWZWeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TG1kbGRFbHpVbUZ1WjJWVFpXeGxZM1JoWW14bElEMGdablZ1WTNScGIyNG9aR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ1pHRjBaVjltY205dExuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc0Z0lDQWdJQ0FnSUdSaGRHVmZkRzh1YzJWMFNHOTFjbk1vTUN3Z01Dd2dNQ3dnTUNrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUdsbUlDaGtZWFJsWDJaeWIyMGdQaUJrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRnRrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzlkSUQwZ1cyUmhkR1ZmZEc4c0lHUmhkR1ZmWm5KdmJWMDdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0F2THlEUXZOQzQwTDNRdU5DODBMRFF1OUdNMEwzUmk5QzVJTkMwMExqUXNOQy8wTERRdDlDKzBMMWNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQmthV1ptSUQwZ1RXRjBhQzVoWW5Nb1pHRjBaVjltY205dExtZGxkRlJwYldVb0tTQXRJR1JoZEdWZmRHOHVaMlYwVkdsdFpTZ3BLU0F2SURFd01EQWdMeUE0TmpRd01EdGNjbHh1SUNBZ0lDQWdJQ0JwWmlBb1pHbG1aaUE4SUhSb2FYTXViM0IwYVc5dWN5NXRhVzVFWVhsektTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOQy8wWURRdnRDeTBMWFJnTkM2MExBZzBML1F2dEMvMExEUXROQ3cwTDNRdU5HUElOQ3lJTkMwMExqUXNOQy8wTERRdDlDKzBMMGcwTGZRc05DeDBMdlF2dEM2MExqUmdOQyswTExRc05DOTBMM1JpOUdGSU5DMDBMRFJnbHh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR1JoZVNBOUlHNWxkeUJFWVhSbEtDazdYSEpjYmlBZ0lDQWdJQ0FnWkdGNUxuTmxkRlJwYldVb1pHRjBaVjltY205dExtZGxkRlJwYldVb0tTazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lIZG9hV3hsSUNoa1lYa2dQQ0JrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbWRsZEVSaGVVeHZZMnRsWkNoa1lYa3BLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR1JoZVM1elpYUkVZWFJsS0dSaGVTNW5aWFJFWVhSbEtDa2dLeUF4S1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCMGNuVmxPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwSi9SZ05DKzBMTFF0ZEdBMExyUXNDRFF2ZEN3SU5DMDBMN1JnZEdDMFlQUXY5QzkwTDdSZ2RHQzBZd2cwTFRRdmRHUElOQzAwTHZSanlEUXNkR0EwTDdRdmRDNFhISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ0lIdEVZWFJsZlNCa1lYUmxJTkNVMExEUmd0Q3dYSEpjYmlBZ0lDQWdLaUJBY21WMGRYSnVJSHRDYjI5c1pXRnVmU0FnSUhSeWRXVWcwTFhSZ2RDNzBMZ2cwTFRRdnRHQjBZTFJnOUMvMExYUXZWeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TG1kbGRFUmhlVXh2WTJ0bFpDQTlJR1oxYm1OMGFXOXVLR1JoZEdVcElIdGNjbHh1SUNBZ0lDQWdJQ0F2THlEUXN0R0wwTEhRdnRHQUlOQzAwTERSZ2lEUXN0QzkwTFVnMExUUXZ0R0IwWUxSZzlDLzBMM1F2dEN6MEw0ZzBMVFF1TkN3MEwvUXNOQzMwTDdRdmRDd1hISmNiaUFnSUNBZ0lDQWdhV1lnS0dSaGRHVWdQQ0IwYUdsekxtOXdkR2x2Ym5NdWJXbHVSR0YwWlNCOGZDQmtZWFJsSUQ0Z2RHaHBjeTV2Y0hScGIyNXpMbTFoZUVSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlFeFBRMHRmVlU1QlZrRkpURUZDVEVVN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxteHZZMnRFWVhselJtbHNkR1Z5S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUIwYUdsekxtOXdkR2x2Ym5NdWJHOWphMFJoZVhOR2FXeDBaWElvWkdGMFpTazdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUXJkQzcwTFhRdk5DMTBMM1JnaURRdXRDdzBMdlF0ZEM5MExUUXNOR0EwTDNRdnRDejBMNGcwTFRRdmRHUFhISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ0lIdEVZWFJsZlNCa1lYUmxJTkNVMExEUmd0Q3dYSEpjYmlBZ0lDQWdLaUJBY21WMGRYSnVJSHRGYkdWdFpXNTBmU0FnSUVoVVRVd2cwWTNRdTlDMTBMelF0ZEM5MFlKY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVmSkdkbGRFUmhlVUo1UkdGMFpTQTlJR1oxYm1OMGFXOXVLR1JoZEdVcElIdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQjBhVzFsSUQwZ1pHRjBaU0JwYm5OMFlXNWpaVzltSUVSaGRHVWdQeUJrWVhSbExtZGxkRlJwYldVb0tTQTZJREE3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYeVJ0YjI1MGFITXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxrUmhlVnRrWVhSaExYUnBiV1U5WENJbklDc2dkR2x0WlNBcklDZGNJbDBuS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZLaXBjY2x4dUlDQWdJQ0FxSU5DZzBMWFF2ZEMwMExYUmdDRFF0TkM5MFk4Z0xTRFF0OUN3MExQUXU5R0QwWWpRdXRDNFhISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ0lIdEVZWFJsZlNCa1lYUmxJTkNlMExIUml0QzEwTHJSZ2lEUXROQ3cwWUxSaTF4eVhHNGdJQ0FnSUNvZ1FISmxkSFZ5YmlCN1JXeGxiV1Z1ZEgxY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVmSkdOeVpXRjBaVVZ0Y0hSNVJHRjVJRDBnWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ0pHUmhlU0E5SUhSb2FYTXVYeVJqY21WaGRHVkZiR1Z0Wlc1MEtGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCZ1BHUnBkaUJqYkdGemN6MWNJa1JoZVNCcGN5MWxiWEIwZVZ3aVBqd3ZaR2wyUG1CY2NseHVJQ0FnSUNBZ0lDQXBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z0pHUmhlVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdktpcGNjbHh1SUNBZ0lDQXFJTkNoMEw3UXQ5QzAwTERRdmRDNDBMVWcwWTNRdTlDMTBMelF0ZEM5MFlMUXNDRFF1TkMzSUVoVVRVd2cwWUxRdGRDNjBZSFJndEN3WEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnSUh0VGRISnBibWQ5SUdoMGJXd2dTRlJOVENEUmd0QzEwTHJSZ2RHQ1hISmNiaUFnSUNBZ0tpQkFjbVYwZFhKdUlIdEZiR1Z0Wlc1MGZWeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TGw4a1kzSmxZWFJsUld4bGJXVnVkQ0E5SUdaMWJtTjBhVzl1S0doMGJXd3BJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0JrYVhZZ1BTQmtiMk4xYldWdWRDNWpjbVZoZEdWRmJHVnRaVzUwS0Nka2FYWW5LVHRjY2x4dUlDQWdJQ0FnSUNCa2FYWXVhVzV6WlhKMFFXUnFZV05sYm5SSVZFMU1LQ2RoWm5SbGNtSmxaMmx1Snl3Z2FIUnRiQ2s3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdScGRpNWphR2xzWkhKbGJpNXNaVzVuZEdnZ1BpQXhJRDhnWkdsMkxtTm9hV3hrY21WdUlEb2daR2wyTG1acGNuTjBSV3hsYldWdWRFTm9hV3hrTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHFLbHh5WEc0Z0lDQWdJQ29nVTJGbVpTRFFzdEdMMExmUXZ0Q3lJTkN5MEwzUXRkR0kwTDNRdU5HRklOR0IwTDdRc2RHTDBZTFF1TkM1SU5DNjBMN1F2TkMvMEw3UXZkQzEwTDNSZ3RDd1hISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UxTjBjbWx1WjMwZ1ppRFFtTkM4MFk4ZzBZSFF2dEN4MFl2Umd0QzQwWTljY2x4dUlDQWdJQ0FxTDF4eVhHNGdJQ0FnZEdocGN5NWZZMkZzYkdKaFkyc2dQU0JtZFc1amRHbHZiaWhtS1NCN1hISmNiaUFnSUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUIwYUdsekxtOXdkR2x2Ym5NdWIyNWJabDBnUFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTV2Y0hScGIyNXpMbTl1VzJaZExtRndjR3g1S0hSb2FYTXNJRnRkTG5Oc2FXTmxMbU5oYkd3b1lYSm5kVzFsYm5SekxDQXhLU2s3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2RHaHBjeTVwYm1sMEtDazdYSEpjYm4xY2NseHVYSEpjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRVJoZEdWU1lXNW5aVkJwWTJ0bGNqdGNjbHh1SWwwc0luTnZkWEpqWlZKdmIzUWlPaUlpZlE9PSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgRGF0ZVJhbmdlUGlja2VyIGZyb20gJy4uLy4uL2Rpc3QvZGF0ZXJhbmdlcGlja2VyJztcclxuaW1wb3J0IHtMT0NLX1VOQVZBSUxBQkxFLCBMT0NLX0xPQ0tFRH0gZnJvbSAnLi4vLi4vZGlzdC9kYXRlcmFuZ2VwaWNrZXInO1xyXG5cclxuY29uc3QgJGZvcm0gPSBkb2N1bWVudC5mb3Jtc1swXTtcclxuY29uc3QgJGRhdGVfZnJvbSA9ICRmb3JtLnF1ZXJ5U2VsZWN0b3IoJ1tuYW1lPVwiZGF0ZV9mcm9tXCJdJyk7XHJcbmNvbnN0ICRkYXRlX3RvICAgPSAkZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImRhdGVfdG9cIl0nKTtcclxuXHJcbmZ1bmN0aW9uIGlzTW9iaWxlKCkge1xyXG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoIDw9IDk2MDtcclxufVxyXG5cclxuLy8g0LfQsNCx0LvQvtC60LjRgNC+0LLQsNC90L3Ri9C1INC00LDRgtGLXHJcbmNvbnN0IGJsb2NrZWREYXRlcyA9IHt9O1xyXG5jb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgKytpKSB7XHJcbiAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNikge1xyXG4gICAgICAgIGJsb2NrZWREYXRlc1tkYXRlXSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyAxKTtcclxufVxyXG5cclxubmV3IERhdGVSYW5nZVBpY2tlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGF0ZXJhbmdlcGlja2VyJyksIHtcclxuICAgIG1pbkRhdGU6IG5ldyBEYXRlKCksXHJcbiAgICBtYXhEYXRlOiBuZXcgRGF0ZSgnMjAyMi0wNS0yMCcpLFxyXG4gICAgbW9udGhzQ291bnQ6IGlzTW9iaWxlKCkgPyAxMiA6IDIsXHJcbiAgICBwZXJSb3c6IDMsXHJcbiAgICBzaW5nbGVNb2RlOiBmYWxzZSxcclxuICAgIG9uOiB7XHJcbiAgICAgICAgcmFuZ2VTZWxlY3Q6IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgICAgICAkZGF0ZV9mcm9tLnZhbHVlID0gZGF0ZV9mcm9tLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICAgICAgICAkZGF0ZV90by52YWx1ZSA9IGRhdGVfdG8udG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXlTZWxlY3Q6IGZ1bmN0aW9uKGRhdGVfZnJvbSkge1xyXG4gICAgICAgICAgICAkZGF0ZV9mcm9tLnZhbHVlID0gZGF0ZV9mcm9tLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgbG9ja0RheXNGaWx0ZXI6IGZ1bmN0aW9uKGRheSkge1xyXG4gICAgICAgIGlmIChibG9ja2VkRGF0ZXNbZGF5XSkge1xyXG4gICAgICAgICAgICByZXR1cm4gTE9DS19MT0NLRUQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9