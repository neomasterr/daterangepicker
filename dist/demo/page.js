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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9zY3NzL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOztVQ1ZBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDTztBQUNBOztBQUVQLGlEQUFpRDtBQUNqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsa0JBQWtCO0FBQzNCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNB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QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsS0FBSztBQUNyQixnQkFBZ0IsUUFBUTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsS0FBSztBQUNyQixnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnQkFBZ0IsT0FBTztBQUN2QixnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWUsZUFBZSxFQUFDIiwiZmlsZSI6ImRhdGVyYW5nZXBpY2tlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiRGF0ZXJhbmdlcGlja2VyXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vINGB0L7RgdGC0L7Rj9C90LjRjyDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbmV4cG9ydCBjb25zdCBMT0NLX1VOQVZBSUxBQkxFID0gMTtcclxuZXhwb3J0IGNvbnN0IExPQ0tfTE9DS0VEICAgICAgPSAyO1xyXG5cclxuZnVuY3Rpb24gRGF0ZVJhbmdlUGlja2VyKCRjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgdGhpcy5fJGNvbnRhaW5lciA9ICRjb250YWluZXI7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgIGZpcnN0RGF5T2ZUaGVXZWVrOiBvcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrIHx8IDEsICAgICAgICAgIC8vINC/0LXRgNCy0YvQuSDQtNC10L3RjCDQvdC10LTQtdC70LgsIDAgPSDQstGBLCAxID0g0L/QvSwgLi4uXHJcbiAgICAgICAgc2luZ2xlTW9kZTogICAgICAgIG9wdGlvbnMuc2luZ2xlTW9kZSAgICAgICAgfHwgZmFsc2UsICAgICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLINCy0LzQtdGB0YLQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBsb2NhbGU6ICAgICAgICAgICAgb3B0aW9ucy5sb2NhbGUgICAgICAgICAgICB8fCAncnUtUlUnLFxyXG4gICAgICAgIG1pbkRheXM6ICAgICAgICAgICBvcHRpb25zLm1pbkRheXMgICAgICAgICAgIHx8IDEsICAgICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LTQuNCw0L/QsNC30L7QvdC1XHJcbiAgICAgICAgbW9udGhzQ291bnQ6ICAgICAgIG9wdGlvbnMubW9udGhzQ291bnQgICAgICAgfHwgMTIsXHJcbiAgICAgICAgcGVyUm93OiAgICAgICAgICAgIG9wdGlvbnMucGVyUm93ICAgICAgICAgICAgfHwgdW5kZWZpbmVkLCAgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0LzQtdGB0Y/RhtC10LIg0LIg0YDRj9C00YNcclxuICAgICAgICBtaW5EYXRlOiAgICAgICAgICAgb3B0aW9ucy5taW5EYXRlICAgICAgICAgICB8fCBuZXcgRGF0ZSgpLCAvLyDQvNC40L3QuNC80LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgICAgbWF4RGF0ZTogICAgICAgICAgIG9wdGlvbnMubWF4RGF0ZSAgICAgICAgICAgfHwgdW5kZWZpbmVkLFxyXG4gICAgICAgIGxvY2tEYXlzRmlsdGVyOiAgICBvcHRpb25zLmxvY2tEYXlzRmlsdGVyICAgIHx8IHVuZGVmaW5lZCwgIC8vIGNhbGxiYWNrKGRhdGUpINGE0YPQvdC60YbQuNGPINCx0LvQvtC60LjRgNC+0LLQsNC90LjRjyDQtNCw0YIsIHRydWUvTE9DS1xyXG4gICAgICAgIG9uOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgcmFuZ2VTZWxlY3Q6IG51bGwsIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAgICAgICAgICAgIGRheVNlbGVjdDogbnVsbCwgICAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0L7QtNC90L7QuSDQtNCw0YLRiyAo0YLQvtC70YzQutC+INC/0YDQuCBzaW5nbGVNb2RlOiB0cnVlKVxyXG4gICAgICAgIH0sIG9wdGlvbnMub24gfHwge30pLFxyXG4gICAgfVxyXG5cclxuICAgIC8vINGA0Y/QtNC90L7RgdGC0YxcclxuICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLnBlclJvdyA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5wZXJSb3cgPSB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRj1xyXG4gICAgICovXHJcbiAgICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLl8kcGlja2VyID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiRGF0ZXJhbmdlcGlja2VyX19tb250aHNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vINGN0LvQtdC80LXQvdGC0YtcclxuICAgICAgICB0aGlzLl8kbW9udGhzID0gdGhpcy5fJHBpY2tlci5xdWVyeVNlbGVjdG9yKCcuRGF0ZXJhbmdlcGlja2VyX19tb250aHMnKTtcclxuXHJcbiAgICAgICAgLy8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQvtGB0YLQvtGP0L3QuNC5XHJcbiAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcblxyXG4gICAgICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgICAgIHRoaXMuXyRjcmVhdGVNb250aHModGhpcy5vcHRpb25zLm1pbkRhdGUpO1xyXG4gICAgICAgIHRoaXMuXyRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fJHBpY2tlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQndCw0LfQstCw0L3QuNC1INC80LXRgdGP0YbQsFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXRNb250aEZvcm1hdHRlZCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCB0aXRsZSA9IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge21vbnRoOiAnbG9uZyd9KTtcclxuICAgICAgICByZXR1cm4gdGl0bGUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKSArIHRpdGxlLnNsaWNlKDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTQvtGA0LzQsNGC0LjRgNC+0LLQsNC90LjQtSDQtNCw0YLRiyDQtNC70Y8g0YLQtdC60YPRidC10Lkg0LvQvtC60LDQu9C4XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSAgIGRhdGUgICAg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9wdGlvbnMg0J/QsNGA0LDQvNC10YLRgNGLXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQgPSBmdW5jdGlvbihkYXRlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIEludGwuRGF0ZVRpbWVGb3JtYXQodGhpcy5vcHRpb25zLmxvY2FsZSwgb3B0aW9ucykuZm9ybWF0KGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQvdC4INC90LXQtNC10LvQuFxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldFdlZWtEYXlzRm9ybWF0dGVkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gW107XHJcblxyXG4gICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIDIpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgKytpKSB7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBkYXk6IGRhdGUuZ2V0RGF5KCksXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7d2Vla2RheTogJ3Nob3J0J30pLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINGB0L7Qs9C70LDRgdC90L4g0L3QsNGB0YLRgNC+0LXQvdC90L7QvNGDINC/0LXRgNCy0L7QvNGDINC00L3RjiDQvdC10LTQtdC70LhcclxuICAgICAgICByZXN1bHQuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmaXJzdERheU9mVGhlV2VlayA9IHRoaXMub3B0aW9ucy5maXJzdERheU9mVGhlV2VlayAlIDc7XHJcbiAgICAgICAgICAgIGxldCBkYXlBID0gYS5kYXk7XHJcbiAgICAgICAgICAgIGxldCBkYXlCID0gYi5kYXk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF5QSA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF5QiA9PSBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkYXlBIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIGRheUEgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRheUIgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICAgICAgZGF5QiArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGF5QSAtIGRheUI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuSDQsiDQvNC10YHRj9GG0LVcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9ICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0RGF5c0NvdW50SW5Nb250aCA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGRheXMuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgZGF5cy5zZXRNb250aChkYXlzLmdldE1vbnRoKCkgKyAxKTtcclxuICAgICAgICBkYXlzLnNldERhdGUoMCk7XHJcbiAgICAgICAgcmV0dXJuIGRheXMuZ2V0RGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC00LjQsNC/0LDQt9C+0L3QsCDQvNC10YHRj9GG0LXQslxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVNb250aHMgPSBmdW5jdGlvbihkYXRlX2Zyb20pIHtcclxuICAgICAgICB3aGlsZSAodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRtb250aHMucmVtb3ZlQ2hpbGQodGhpcy5fJG1vbnRocy5sYXN0RWxlbWVudENoaWxkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC/0YDQtdGA0LXQvdC00LXRgCDQvNC10YHRj9GG0LXQslxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoZGF0ZV9mcm9tLmdldFRpbWUoKSk7XHJcbiAgICAgICAgY29uc3QgJG1vbnRocyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50OyArK2kpIHtcclxuICAgICAgICAgICAgJG1vbnRocy5wdXNoKHRoaXMuXyRjcmVhdGVNb250aChjdXJyZW50RGF0ZSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50RGF0ZS5zZXRNb250aChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDRgNC10L3QtNC10YBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRtb250aHMubGVuZ3RoOyBpICs9IHRoaXMub3B0aW9ucy5wZXJSb3cpIHtcclxuICAgICAgICAgICAgY29uc3QgJHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAkcm93LmNsYXNzTmFtZSA9ICdEYXRlcmFuZ2VwaWNrZXJfX3Jvdyc7XHJcblxyXG4gICAgICAgICAgICAkbW9udGhzLnNsaWNlKGksIGkgKyB0aGlzLm9wdGlvbnMucGVyUm93KS5mb3JFYWNoKCRtb250aCA9PiB7XHJcbiAgICAgICAgICAgICAgICAkcm93LmFwcGVuZENoaWxkKCRtb250aCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fJG1vbnRocy5hcHBlbmRDaGlsZCgkcm93KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb24gJiYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10L3QtNC10YAg0LzQtdGB0Y/RhtCwXHJcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGUg0JzQtdGB0Y/RhlxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudE1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xyXG4gICAgICAgIGNvbnN0IG1vbnRoVGl0bGUgPSB0aGlzLmdldE1vbnRoRm9ybWF0dGVkKGRhdGUpO1xyXG4gICAgICAgIGNvbnN0IHdlZWtEYXlzID0gdGhpcy5nZXRXZWVrRGF5c0Zvcm1hdHRlZCgpO1xyXG5cclxuICAgICAgICBjb25zdCAkbW9udGggPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJNb250aFwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2hlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fYXJyb3cgTW9udGhfX2Fycm93LS1wcmV2JHsodGhpcy5vcHRpb25zLm1pbkRhdGUgJiYgZGF0ZSA8PSB0aGlzLm9wdGlvbnMubWluRGF0ZSkgPyAnIGlzLWRpc2FibGVkJyA6ICcnfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCA4IDE0XCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTcgMTNMMSA3TDcgMVwiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX3RpdGxlXCI+JHttb250aFRpdGxlfSAke2RhdGUuZ2V0RnVsbFllYXIoKX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tbmV4dCR7KHRoaXMub3B0aW9ucy5tYXhEYXRlICYmIGRhdGUgPj0gdGhpcy5vcHRpb25zLm1heERhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk0xIDAuOTk5OTk5TDcgN0wxIDEzXCIgc3Ryb2tlPVwiIzhDOEM4Q1wiIHN0cm9rZS13aWR0aD1cIjJcIiBzdHJva2UtbGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlLWxpbmVqb2luPVwicm91bmRcIj48L3BhdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtcIj4ke3dlZWtEYXlzLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla2RheVwiPiR7aXRlbS50aXRsZX08L2Rpdj5gXHJcbiAgICAgICAgICAgICAgICB9KS5qb2luKCcnKX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fZGF5c1wiPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8g0YHRgtGA0LXQu9C60LhcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIHtzZWxlY3RvcjogJy5Nb250aF9fYXJyb3ctLXByZXYnLCBuYW1lOiAncHJldid9LFxyXG4gICAgICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1uZXh0JywgbmFtZTogJ25leHQnfSxcclxuICAgICAgICBdLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRhcnJvdyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKGl0ZW0uc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICAkYXJyb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uQXJyb3dDbGljaygkYXJyb3csIGl0ZW0ubmFtZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDRgNC10L3QtNC10YAg0LTQvdC10LlcclxuICAgICAgICBjb25zdCAkZGF5cyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKCcuTW9udGhfX2RheXMnKTtcclxuICAgICAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGRheXMuc2V0RGF0ZSgxKTtcclxuICAgICAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICB3aGlsZSAoZGF5cy5nZXRNb250aCgpID09IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgICAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVXZWVrKCk7XHJcblxyXG4gICAgICAgICAgICB3ZWVrRGF5cy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRheXMuZ2V0RGF5KCkgIT0gaXRlbS5kYXkgfHwgZGF5cy5nZXRNb250aCgpICE9IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVFbXB0eURheSgpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZURheShkYXlzKSk7XHJcbiAgICAgICAgICAgICAgICBkYXlzLnNldERhdGUoZGF5cy5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkZGF5cy5hcHBlbmRDaGlsZCgkd2Vlayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gJG1vbnRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQu9C40Log0L/QviDRgdGC0YDQtdC70LrQtSDQv9C10YDQtdC60LvRjtGH0LXQvdC40Y8g0LzQtdGB0Y/RhtCwXHJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRhcnJvdyBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAgICDQmNC80Y8gKHByZXYsIG5leHQpXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uQXJyb3dDbGljayA9IGZ1bmN0aW9uKCRhcnJvdywgbmFtZSkge1xyXG4gICAgICAgIGlmICgkYXJyb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1kaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShwYXJzZUludCh0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5Nb250aCcpLmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgICAgICBkYXRlLnNldE1vbnRoKGRhdGUuZ2V0TW9udGgoKSArIChuYW1lID09ICdwcmV2JyA/IC10aGlzLm9wdGlvbnMubW9udGhzQ291bnQgOiB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpKTtcclxuXHJcbiAgICAgICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LjQvdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgICAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlKSB7XHJcbiAgICAgICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWluRGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9GF0L7QtCDQt9CwINC/0YDQtdC00LXQu9GLINC80LDQutGB0LjQvNCw0LvRjNC90L7QuSDQtNCw0YLRi1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBlbmREYXRlID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgICBlbmREYXRlLnNldE1vbnRoKGVuZERhdGUuZ2V0TW9udGgoKSArIHRoaXMub3B0aW9ucy5tb250aHNDb3VudCk7XHJcbiAgICAgICAgICAgIGlmIChlbmREYXRlID4gdGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICAgICAgICAgIGRhdGUuc2V0VGltZSh0aGlzLm9wdGlvbnMubWF4RGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgICAgICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgLSB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fJGNyZWF0ZU1vbnRocyhkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQvdC00LXRgCDQvdC10LTQtdC70LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlV2VlayA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgICAgICBgPGRpdiBjbGFzcz1cIldlZWtcIj48L2Rpdj5gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICR3ZWVrO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC00L3Rj1xyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVEYXkgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgbG9ja2VkID0gdGhpcy5nZXREYXlMb2NrZWQoZGF0ZSk7XHJcblxyXG4gICAgICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXkke2xvY2tlZCA/ICcgaXMtZGlzYWJsZWQnIDogJyd9JHtsb2NrZWQgPT0gTE9DS19MT0NLRUQgPyAnIGlzLWxvY2tlZCcgOiAnJ31cIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiIGRhdGEtZGF5PVwiJHtkYXRlLmdldERheSgpfVwiPiR7ZGF0ZS5nZXREYXRlKCl9PC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkRheUNsaWNrRXZlbnQuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICAgICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5fb25EYXlNb3VzZUVudGVyRXZlbnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gJGRheTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC60LvQuNC60LAg0L/QviDQtNC90Y5cclxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5Q2xpY2tFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB0aGlzLl9vbkRheUNsaWNrKGUudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INGF0L7QstC10YDQsFxyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICAgICAqL1xyXG4gICAgdGhpcy5fb25EYXlNb3VzZUVudGVyRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdGhpcy5fb25EYXlNb3VzZUVudGVyKGUudGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCl0L7QstC10YAg0L3QsCDRjdC70LXQvNC10L3RgtC1INC00L3Rj1xyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5fb25EYXlNb3VzZUVudGVyID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGRheS5kYXRhc2V0LnRpbWUgPT0gdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbS5nZXRUaW1lKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG5cclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0LvQuNC6INC/0L4g0LTQvdGOXHJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheUNsaWNrID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgICAgIC8vINC00LXQvdGMINC30LDQsdC70L7QutC40YDQvtCy0LDQvVxyXG4gICAgICAgIGlmICgkZGF5LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0YtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpbmdsZU1vZGUpIHtcclxuICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2soJ2RheVNlbGVjdCcsIG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YHQsdGA0L7RgSDQstGL0LHRgNCw0L3QvdC+0LPQviDRgNCw0L3QtdC1INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG5cclxuICAgICAgICAvLyDQstGL0LHRgNCw0L3QsCDQvdCw0YfQsNC70YzQvdCw0Y8gLyDQutC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAgICAgICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gJiYgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAgICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5yYW5nZVNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxSZXNldCgpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQuNC30YPQsNC70YzQvdGL0Lkg0YHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgICAgICAkZGF5cy5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgICAgICAkZGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nLCAnaXMtc2VsZWN0ZWQtdG8nLCAnaXMtc2VsZWN0ZWQtYmV0d2VlbicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQuNC30YPQsNC70YzQvdC+0LUg0LLRi9C00LXQu9C10L3QuNC1INC00LDRglxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICAgICAgaWYgKGRhdGVfZnJvbSAmJiBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkYXRlX3RvICYmIGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlKSB7XHJcbiAgICAgICAgICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1XHJcbiAgICAgICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRpbWVfZnJvbSA9IGRhdGVfZnJvbSBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX2Zyb20uZ2V0VGltZSgpIDogMDtcclxuICAgICAgICBjb25zdCB0aW1lX3RvID0gZGF0ZV90byBpbnN0YW5jZW9mIERhdGUgPyBkYXRlX3RvLmdldFRpbWUoKSA6IDA7XHJcbiAgICAgICAgY29uc3QgJGRheXMgPSB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3JBbGwoJy5EYXlbZGF0YS10aW1lXScpO1xyXG5cclxuICAgICAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0LTQsNGCINC80LXQttC00YMg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0LlcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRkYXlzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICRkYXlzW2ldLmNsYXNzTGlzdC50b2dnbGUoJ2lzLXNlbGVjdGVkLWJldHdlZW4nLCAkZGF5c1tpXS5kYXRhc2V0LnRpbWUgPiB0aW1lX2Zyb20gJiYgJGRheXNbaV0uZGF0YXNldC50aW1lIDwgdGltZV90byk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0L3QsNGH0LDQu9GM0L3QvtC5INC4INC60L7QvdC10YfQvdC+0Lkg0L/QvtC30LjRhtC40LhcclxuICAgICAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICAgICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICAgICAgaWYgKHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCAhPSAkZGF5X2Zyb20pIHtcclxuICAgICAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAhPSAkZGF5X3RvKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDRgdC+0YXRgNCw0L3QtdC90LjQtSDQsiDQutC10YhcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkID0gJGRheV9mcm9tO1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkID0gJGRheV90bztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0YvQtNC10LvQtdC90LjQtSDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqL1xyXG4gICAgdGhpcy5yYW5nZVNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICAvLyDQtNC+0L/Rg9GB0YLQuNC80YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICAgICAgaWYgKCF0aGlzLmdldElzUmFuZ2VTZWxlY3RhYmxlKGRhdGVfZnJvbSwgZGF0ZV90bykpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0ICRkYXlfZnJvbSwgJGRheV90bztcclxuXHJcbiAgICAgICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LIg0L7QsdGA0LDRgtC90L7QvCDQv9C+0YDRj9C00LrQtVxyXG4gICAgICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICAgICAgICAgICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgICAgICAgICAgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QoZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuXHJcbiAgICAgICAgLy8g0YHQvtCx0YvRgtC40LVcclxuICAgICAgICB0aGlzLl9jYWxsYmFjaygncmFuZ2VTZWxlY3QnLCBkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC+0LLQtdGA0LrQsCDQstC+0LfQvNC+0LbQvdC+0YHRgtC4INCy0YvQtNC10LvQtdC90LjRjyDQtNCw0YJcclxuICAgICAqIEBwYXJhbSAge0RhdGUgZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICogQHBhcmFtICB7RGF0ZSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZSA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LzQuNC90LjQvNCw0LvRjNC90YvQuSDQtNC40LDQv9Cw0LfQvtC9XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IE1hdGguYWJzKGRhdGVfZnJvbS5nZXRUaW1lKCkgLSBkYXRlX3RvLmdldFRpbWUoKSkgLyAxMDAwIC8gODY0MDA7XHJcbiAgICAgICAgaWYgKGRpZmYgPCB0aGlzLm9wdGlvbnMubWluRGF5cykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQv9GA0L7QstC10YDQutCwINC/0L7Qv9Cw0LTQsNC90LjRjyDQsiDQtNC40LDQv9Cw0LfQvtC9INC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDQtNCw0YJcclxuICAgICAgICBjb25zdCBkYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGRheS5zZXRUaW1lKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG5cclxuICAgICAgICB3aGlsZSAoZGF5IDwgZGF0ZV90bykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXREYXlMb2NrZWQoZGF5KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkYXkuc2V0RGF0ZShkYXkuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0L3QsCDQtNC+0YHRgtGD0L/QvdC+0YHRgtGMINC00L3RjyDQtNC70Y8g0LHRgNC+0L3QuFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gICB0cnVlINC10YHQu9C4INC00L7RgdGC0YPQv9C10L1cclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXREYXlMb2NrZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LLQvdC1INC00L7RgdGC0YPQv9C90L7Qs9C+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgIGlmIChkYXRlIDwgdGhpcy5vcHRpb25zLm1pbkRhdGUgfHwgZGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBMT0NLX1VOQVZBSUxBQkxFO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sb2NrRGF5c0ZpbHRlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmxvY2tEYXlzRmlsdGVyKGRhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0K3Qu9C10LzQtdC90YIg0LrQsNC70LXQvdC00LDRgNC90L7Qs9C+INC00L3Rj1xyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gICAgICogQHJldHVybiB7RWxlbWVudH0gICBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRnZXREYXlCeURhdGUgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgdGltZSA9IGRhdGUgaW5zdGFuY2VvZiBEYXRlID8gZGF0ZS5nZXRUaW1lKCkgOiAwO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl8kbW9udGhzLnF1ZXJ5U2VsZWN0b3IoJy5EYXlbZGF0YS10aW1lPVwiJyArIHRpbWUgKyAnXCJdJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10L3QtNC10YAg0LTQvdGPIC0g0LfQsNCz0LvRg9GI0LrQuFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVFbXB0eURheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXkgaXMtZW1wdHlcIj48L2Rpdj5gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICRkYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LfQtNCw0L3QuNC1INGN0LvQtdC80LXQvdGC0LAg0LjQtyBIVE1MINGC0LXQutGB0YLQsFxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBodG1sIEhUTUwg0YLQtdC60YHRglxyXG4gICAgICogQHJldHVybiB7RWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XHJcbiAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGh0bWwpO1xyXG4gICAgICAgIHJldHVybiBkaXYuY2hpbGRyZW4ubGVuZ3RoID4gMSA/IGRpdi5jaGlsZHJlbiA6IGRpdi5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNhZmUg0LLRi9C30L7QsiDQstC90LXRiNC90LjRhSDRgdC+0LHRi9GC0LjQuSDQutC+0LzQv9C+0L3QtdC90YLQsFxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGYg0JjQvNGPINGB0L7QsdGL0YLQuNGPXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX2NhbGxiYWNrID0gZnVuY3Rpb24oZikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uW2ZdID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vbltmXS5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEYXRlUmFuZ2VQaWNrZXI7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9kaXN0L2RhdGVyYW5nZXBpY2tlci5qcyIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2RlbW8vcGFnZS5zY3NzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9kZW1vL3BhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJLElBQXlEO0FBQzdEO0FBQ0EsTUFBTSxFQUtnQztBQUN0QyxDQUFDO0FBQ0Qsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQSxjQUFjLDhCQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxnQkFBZ0IsOEJBQW1CLHdCQUF3Qiw4QkFBbUI7QUFDOUUsbURBQW1ELHlDQUF5QztBQUM1RjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxpRUFBaUUsa0JBQWtCO0FBQ25GO0FBQ0EsMERBQTBELGNBQWM7QUFDeEU7QUFDQSxXQUFXO0FBQ1g7QUFD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QSxnQ0FBZ0MsWUFBWTtXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7O0FDTkE7Ozs7Ozs7Ozs7Ozs7QUNBeUQ7QUFDZ0I7O0FBRXpFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLDhEQUFlO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsbUJBQW1CLDhEQUFXO0FBQzlCOztBQUVBO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6Ii4vZGVtby9wYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJEYXRlcmFuZ2VwaWNrZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkRhdGVyYW5nZXBpY2tlclwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuIC8qKioqKiovICgoKSA9PiB7IC8vIHdlYnBhY2tCb290c3RyYXBcbi8qKioqKiovIFx0XCJ1c2Ugc3RyaWN0XCI7XG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIHNjb3BlXG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG4vKioqKioqLyBcdFxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG4vKioqKioqLyBcdFx0XHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG4vKioqKioqLyBcdFx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuLyoqKioqKi8gXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG4vKioqKioqLyBcdFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSlcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcbi8qKioqKiovIFx0XHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuLyoqKioqKi8gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSkoKTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbi8vIFRoaXMgZW50cnkgbmVlZCB0byBiZSB3cmFwcGVkIGluIGFuIElJRkUgYmVjYXVzZSBpdCBuZWVkIHRvIGJlIGlzb2xhdGVkIGFnYWluc3Qgb3RoZXIgZW50cnkgbW9kdWxlcy5cbigoKSA9PiB7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9zcmMvc2Nzcy9pbmRleC5zY3NzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuXG59KSgpO1xuXG4vLyBUaGlzIGVudHJ5IG5lZWQgdG8gYmUgd3JhcHBlZCBpbiBhbiBJSUZFIGJlY2F1c2UgaXQgbmVlZCB0byBiZSBpc29sYXRlZCBhZ2FpbnN0IG90aGVyIGVudHJ5IG1vZHVsZXMuXG4oKCkgPT4ge1xuLyohKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9qcy9pbmRleC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKi9cbl9fd2VicGFja19yZXF1aXJlX18ucihfX3dlYnBhY2tfZXhwb3J0c19fKTtcbi8qIGhhcm1vbnkgZXhwb3J0ICovIF9fd2VicGFja19yZXF1aXJlX18uZChfX3dlYnBhY2tfZXhwb3J0c19fLCB7XG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiTE9DS19VTkFWQUlMQUJMRVwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBMT0NLX1VOQVZBSUxBQkxFKSxcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJMT0NLX0xPQ0tFRFwiOiAoKSA9PiAoLyogYmluZGluZyAqLyBMT0NLX0xPQ0tFRCksXG4vKiBoYXJtb255IGV4cG9ydCAqLyAgIFwiZGVmYXVsdFwiOiAoKSA9PiAoX19XRUJQQUNLX0RFRkFVTFRfRVhQT1JUX18pXG4vKiBoYXJtb255IGV4cG9ydCAqLyB9KTtcbi8vINGB0L7RgdGC0L7Rj9C90LjRjyDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbmNvbnN0IExPQ0tfVU5BVkFJTEFCTEUgPSAxO1xyXG5jb25zdCBMT0NLX0xPQ0tFRCAgICAgID0gMjtcclxuXHJcbmZ1bmN0aW9uIERhdGVSYW5nZVBpY2tlcigkY29udGFpbmVyLCBvcHRpb25zID0ge30pIHtcclxuICAgIHRoaXMuXyRjb250YWluZXIgPSAkY29udGFpbmVyO1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IHtcclxuICAgICAgICBmaXJzdERheU9mVGhlV2Vlazogb3B0aW9ucy5maXJzdERheU9mVGhlV2VlayB8fCAxLCAgICAgICAgICAvLyDQv9C10YDQstGL0Lkg0LTQtdC90Ywg0L3QtdC00LXQu9C4LCAwID0g0LLRgSwgMSA9INC/0L0sIC4uLlxyXG4gICAgICAgIHNpbmdsZU1vZGU6ICAgICAgICBvcHRpb25zLnNpbmdsZU1vZGUgICAgICAgIHx8IGZhbHNlLCAgICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRiyDQstC80LXRgdGC0L4g0LTQuNCw0L/QsNC30L7QvdCwXHJcbiAgICAgICAgbG9jYWxlOiAgICAgICAgICAgIG9wdGlvbnMubG9jYWxlICAgICAgICAgICAgfHwgJ3J1LVJVJyxcclxuICAgICAgICBtaW5EYXlzOiAgICAgICAgICAgb3B0aW9ucy5taW5EYXlzICAgICAgICAgICB8fCAxLCAgICAgICAgICAvLyDQvNC40L3QuNC80LDQu9GM0L3QvtC1INC60L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC00LjQsNC/0LDQt9C+0L3QtVxyXG4gICAgICAgIG1vbnRoc0NvdW50OiAgICAgICBvcHRpb25zLm1vbnRoc0NvdW50ICAgICAgIHx8IDEyLFxyXG4gICAgICAgIHBlclJvdzogICAgICAgICAgICBvcHRpb25zLnBlclJvdyAgICAgICAgICAgIHx8IHVuZGVmaW5lZCwgIC8vINC60L7Qu9C40YfQtdGB0YLQstC+INC80LXRgdGP0YbQtdCyINCyINGA0Y/QtNGDXHJcbiAgICAgICAgbWluRGF0ZTogICAgICAgICAgIG9wdGlvbnMubWluRGF0ZSAgICAgICAgICAgfHwgbmV3IERhdGUoKSwgLy8g0LzQuNC90LjQvNCw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICAgIG1heERhdGU6ICAgICAgICAgICBvcHRpb25zLm1heERhdGUgICAgICAgICAgIHx8IHVuZGVmaW5lZCxcclxuICAgICAgICBsb2NrRGF5c0ZpbHRlcjogICAgb3B0aW9ucy5sb2NrRGF5c0ZpbHRlciAgICB8fCB1bmRlZmluZWQsICAvLyBjYWxsYmFjayhkYXRlKSDRhNGD0L3QutGG0LjRjyDQsdC70L7QutC40YDQvtCy0LDQvdC40Y8g0LTQsNGCLCB0cnVlL0xPQ0tcclxuICAgICAgICBvbjogT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIHJhbmdlU2VsZWN0OiBudWxsLCAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICAgICAgICBkYXlTZWxlY3Q6IG51bGwsICAgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC+0LTQvdC+0Lkg0LTQsNGC0YsgKNGC0L7Qu9GM0LrQviDQv9GA0Lggc2luZ2xlTW9kZTogdHJ1ZSlcclxuICAgICAgICB9LCBvcHRpb25zLm9uIHx8IHt9KSxcclxuICAgIH1cclxuXHJcbiAgICAvLyDRgNGP0LTQvdC+0YHRgtGMXHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5wZXJSb3cgPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMucGVyUm93ID0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuICAgICAqL1xyXG4gICAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fJHBpY2tlciA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyDRjdC70LXQvNC10L3RgtGLXHJcbiAgICAgICAgdGhpcy5fJG1vbnRocyA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzJyk7XHJcblxyXG4gICAgICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG5cclxuICAgICAgICAvLyDRgNC10L3QtNC10YBcclxuICAgICAgICB0aGlzLl8kY3JlYXRlTW9udGhzKHRoaXMub3B0aW9ucy5taW5EYXRlKTtcclxuICAgICAgICB0aGlzLl8kY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuXyRwaWNrZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J3QsNC30LLQsNC90LjQtSDQvNC10YHRj9GG0LBcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0TW9udGhGb3JtYXR0ZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHttb250aDogJ2xvbmcnfSk7XHJcbiAgICAgICAgcmV0dXJuIHRpdGxlLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aXRsZS5zbGljZSgxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0Ysg0LTQu9GPINGC0LXQutGD0YnQtdC5INC70L7QutCw0LvQuFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAgINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zINCf0LDRgNCw0LzQtdGC0YDRi1xyXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldERhdGVUaW1lRm9ybWF0ID0gZnVuY3Rpb24oZGF0ZSwgb3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMub3B0aW9ucy5sb2NhbGUsIG9wdGlvbnMpLmZvcm1hdChkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0L3QuCDQvdC10LTQtdC70LhcclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXRXZWVrRGF5c0Zvcm1hdHRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAyKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7ICsraSkge1xyXG4gICAgICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgZGF5OiBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge3dlZWtkYXk6ICdzaG9ydCd9KSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDRgdC+0YDRgtC40YDQvtCy0LrQsCDRgdC+0LPQu9Cw0YHQvdC+INC90LDRgdGC0YDQvtC10L3QvdC+0LzRgyDQv9C10YDQstC+0LzRgyDQtNC90Y4g0L3QtdC00LXQu9C4XHJcbiAgICAgICAgcmVzdWx0LnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZmlyc3REYXlPZlRoZVdlZWsgPSB0aGlzLm9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgJSA3O1xyXG4gICAgICAgICAgICBsZXQgZGF5QSA9IGEuZGF5O1xyXG4gICAgICAgICAgICBsZXQgZGF5QiA9IGIuZGF5O1xyXG5cclxuICAgICAgICAgICAgaWYgKGRheUEgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRheUIgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF5QSA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgICAgICBkYXlBICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkYXlCIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIGRheUIgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRheUEgLSBkYXlCO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LzQtdGB0Y/RhtC1XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7TnVtYmVyfSAgICDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldERheXNDb3VudEluTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIGRheXMuc2V0TW9udGgoZGF5cy5nZXRNb250aCgpICsgMSk7XHJcbiAgICAgICAgZGF5cy5zZXREYXRlKDApO1xyXG4gICAgICAgIHJldHVybiBkYXlzLmdldERhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQvdC00LXRgCDQtNC40LDQv9Cw0LfQvtC90LAg0LzQtdGB0Y/RhtC10LJcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGhzID0gZnVuY3Rpb24oZGF0ZV9mcm9tKSB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCkge1xyXG4gICAgICAgICAgICB0aGlzLl8kbW9udGhzLnJlbW92ZUNoaWxkKHRoaXMuXyRtb250aHMubGFzdEVsZW1lbnRDaGlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQv9GA0LXRgNC10L3QtNC10YAg0LzQtdGB0Y/RhtC10LJcclxuICAgICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKGRhdGVfZnJvbS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGNvbnN0ICRtb250aHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgICRtb250aHMucHVzaCh0aGlzLl8kY3JlYXRlTW9udGgoY3VycmVudERhdGUpKTtcclxuICAgICAgICAgICAgY3VycmVudERhdGUuc2V0TW9udGgoY3VycmVudERhdGUuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YDQtdC90LTQtdGAXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkbW9udGhzLmxlbmd0aDsgaSArPSB0aGlzLm9wdGlvbnMucGVyUm93KSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgJHJvdy5jbGFzc05hbWUgPSAnRGF0ZXJhbmdlcGlja2VyX19yb3cnO1xyXG5cclxuICAgICAgICAgICAgJG1vbnRocy5zbGljZShpLCBpICsgdGhpcy5vcHRpb25zLnBlclJvdykuZm9yRWFjaCgkbW9udGggPT4ge1xyXG4gICAgICAgICAgICAgICAgJHJvdy5hcHBlbmRDaGlsZCgkbW9udGgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuXyRtb250aHMuYXBwZW5kQ2hpbGQoJHJvdyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0aW9uICYmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tIHx8IHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tLCB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90byk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC80LXRgdGP0YbQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlINCc0LXRgdGP0YZcclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgICAgICBjb25zdCBtb250aFRpdGxlID0gdGhpcy5nZXRNb250aEZvcm1hdHRlZChkYXRlKTtcclxuICAgICAgICBjb25zdCB3ZWVrRGF5cyA9IHRoaXMuZ2V0V2Vla0RheXNGb3JtYXR0ZWQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgJG1vbnRoID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiTW9udGhcIiBkYXRhLXRpbWU9XCIke2RhdGUuZ2V0VGltZSgpfVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2Fycm93IE1vbnRoX19hcnJvdy0tcHJldiR7KHRoaXMub3B0aW9ucy5taW5EYXRlICYmIGRhdGUgPD0gdGhpcy5vcHRpb25zLm1pbkRhdGUpID8gJyBpcy1kaXNhYmxlZCcgOiAnJ31cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjhcIiBoZWlnaHQ9XCIxNFwiIHZpZXdCb3g9XCIwIDAgOCAxNFwiIGZpbGw9XCJub25lXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk03IDEzTDEgN0w3IDFcIiBzdHJva2U9XCIjOEM4QzhDXCIgc3Ryb2tlLXdpZHRoPVwiMlwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjwvcGF0aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX190aXRsZVwiPiR7bW9udGhUaXRsZX0gJHtkYXRlLmdldEZ1bGxZZWFyKCl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19hcnJvdyBNb250aF9fYXJyb3ctLW5leHQkeyh0aGlzLm9wdGlvbnMubWF4RGF0ZSAmJiBkYXRlID49IHRoaXMub3B0aW9ucy5tYXhEYXRlKSA/ICcgaXMtZGlzYWJsZWQnIDogJyd9XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCI4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDggMTRcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMSAwLjk5OTk5OUw3IDdMMSAxM1wiIHN0cm9rZT1cIiM4QzhDOENcIiBzdHJva2Utd2lkdGg9XCIyXCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZS1saW5lam9pbj1cInJvdW5kXCI+PC9wYXRoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrXCI+JHt3ZWVrRGF5cy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtkYXlcIj4ke2l0ZW0udGl0bGV9PC9kaXY+YFxyXG4gICAgICAgICAgICAgICAgfSkuam9pbignJyl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX2RheXNcIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vINGB0YLRgNC10LvQutC4XHJcbiAgICAgICAgW1xyXG4gICAgICAgICAgICB7c2VsZWN0b3I6ICcuTW9udGhfX2Fycm93LS1wcmV2JywgbmFtZTogJ3ByZXYnfSxcclxuICAgICAgICAgICAge3NlbGVjdG9yOiAnLk1vbnRoX19hcnJvdy0tbmV4dCcsIG5hbWU6ICduZXh0J30sXHJcbiAgICAgICAgXS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkYXJyb3cgPSAkbW9udGgucXVlcnlTZWxlY3RvcihpdGVtLnNlbGVjdG9yKTtcclxuICAgICAgICAgICAgJGFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkFycm93Q2xpY2soJGFycm93LCBpdGVtLm5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8g0YDQtdC90LTQtdGAINC00L3QtdC5XHJcbiAgICAgICAgY29uc3QgJGRheXMgPSAkbW9udGgucXVlcnlTZWxlY3RvcignLk1vbnRoX19kYXlzJyk7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBkYXlzLnNldERhdGUoMSk7XHJcbiAgICAgICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGRheXMuZ2V0TW9udGgoKSA9PSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlV2VlaygpO1xyXG5cclxuICAgICAgICAgICAgd2Vla0RheXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXlzLmdldERheSgpICE9IGl0ZW0uZGF5IHx8IGRheXMuZ2V0TW9udGgoKSAhPSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRW1wdHlEYXkoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVEYXkoZGF5cykpO1xyXG4gICAgICAgICAgICAgICAgZGF5cy5zZXREYXRlKGRheXMuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJGRheXMuYXBwZW5kQ2hpbGQoJHdlZWspO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRtb250aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0LvQuNC6INC/0L4g0YHRgtGA0LXQu9C60LUg0L/QtdGA0LXQutC70Y7Rh9C10L3QuNGPINC80LXRgdGP0YbQsFxyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSAkYXJyb3cgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgICAg0JjQvNGPIChwcmV2LCBuZXh0KVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkFycm93Q2xpY2sgPSBmdW5jdGlvbigkYXJyb3csIG5hbWUpIHtcclxuICAgICAgICBpZiAoJGFycm93LmNsYXNzTGlzdC5jb250YWlucygnaXMtZGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUocGFyc2VJbnQodGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuTW9udGgnKS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICAgICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyAobmFtZSA9PSAncHJldicgPyAtdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50IDogdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50KSk7XHJcblxyXG4gICAgICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNC40L3QuNC80LDQu9GM0L3QvtC5INC00LDRgtGLXHJcbiAgICAgICAgaWYgKGRhdGUgPCB0aGlzLm9wdGlvbnMubWluRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1pbkRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCy0YvRhdC+0LQg0LfQsCDQv9GA0LXQtNC10LvRiyDQvNCw0LrRgdC40LzQsNC70YzQvdC+0Lkg0LTQsNGC0YtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1heERhdGUpIHtcclxuICAgICAgICAgICAgY29uc3QgZW5kRGF0ZSA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgZW5kRGF0ZS5zZXRNb250aChlbmREYXRlLmdldE1vbnRoKCkgKyB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQpO1xyXG4gICAgICAgICAgICBpZiAoZW5kRGF0ZSA+IHRoaXMub3B0aW9ucy5tYXhEYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlLnNldFRpbWUodGhpcy5vcHRpb25zLm1heERhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgICAgIGRhdGUuc2V0TW9udGgoZGF0ZS5nZXRNb250aCgpIC0gdGhpcy5vcHRpb25zLm1vbnRoc0NvdW50ICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuXyRjcmVhdGVNb250aHMoZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10L3QtNC10YAg0L3QtdC00LXQu9C4XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7RWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZVdlZWsgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJXZWVrXCI+PC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiAkd2VlaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQvdC00LXRgCDQtNC90Y9cclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlRGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGxvY2tlZCA9IHRoaXMuZ2V0RGF5TG9ja2VkKGRhdGUpO1xyXG5cclxuICAgICAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5JHtsb2NrZWQgPyAnIGlzLWRpc2FibGVkJyA6ICcnfSR7bG9ja2VkID09IExPQ0tfTE9DS0VEID8gJyBpcy1sb2NrZWQnIDogJyd9XCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIiBkYXRhLWRheT1cIiR7ZGF0ZS5nZXREYXkoKX1cIj4ke2RhdGUuZ2V0RGF0ZSgpfTwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25EYXlDbGlja0V2ZW50LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRkYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtSDQutC70LjQutCwINC/0L4g0LTQvdGOXHJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheUNsaWNrRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdGhpcy5fb25EYXlDbGljayhlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtSDRhdC+0LLQtdGA0LBcclxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHRoaXMuX29uRGF5TW91c2VFbnRlcihlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpdC+0LLQtdGAINC90LAg0Y3Qu9C10LzQtdC90YLQtSDQtNC90Y9cclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlciA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20gfHwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXkuZGF0YXNldC50aW1lID09IHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20uZ2V0VGltZSgpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC70LjQuiDQv9C+INC00L3RjlxyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSAkZGF5IEhUTUwg0K3Qu9C10LzQtdC90YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5fb25EYXlDbGljayA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgICAgICAvLyDQtNC10L3RjCDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L1cclxuICAgICAgICBpZiAoJGRheS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWRpc2FibGVkJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgICAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrKCdkYXlTZWxlY3QnLCBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGB0LHRgNC+0YEg0LLRi9Cx0YDQsNC90L3QvtCz0L4g0YDQsNC90LXQtSDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uZGF0ZV90bykge1xyXG4gICAgICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgLy8g0LLRi9Cx0YDQsNC90LAg0L3QsNGH0LDQu9GM0L3QsNGPIC8g0LrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tID0gbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pIHtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8gPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uZGF0ZV9mcm9tICYmIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIC8vINC00L7Qv9GD0YHRgtC40LzRi9C5INC00LjQsNC/0LDQt9C+0L1cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmdldElzUmFuZ2VTZWxlY3RhYmxlKHRoaXMuX3NlbGVjdGlvbi5kYXRlX2Zyb20sIHRoaXMuX3NlbGVjdGlvbi5kYXRlX3RvKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VTZWxlY3QodGhpcy5fc2VsZWN0aW9uLmRhdGVfZnJvbSwgdGhpcy5fc2VsZWN0aW9uLmRhdGVfdG8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMucmFuZ2VSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsUmVzZXQoKTtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0LjQt9GD0LDQu9GM0L3Ri9C5INGB0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICAgICAgJGRheXMuZm9yRWFjaCgkZGF5ID0+IHtcclxuICAgICAgICAgICAgJGRheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJywgJ2lzLXNlbGVjdGVkLXRvJywgJ2lzLXNlbGVjdGVkLWJldHdlZW4nKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0LjQt9GD0LDQu9GM0L3QvtC1INCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YJcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgIGlmIChkYXRlX2Zyb20gJiYgZGF0ZV9mcm9tIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZGF0ZV90byAmJiBkYXRlX3RvIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9Cx0L7RgCDQtNCw0YIg0LIg0L7QsdGA0LDRgtC90L7QvCDQv9C+0YDRj9C00LrQtVxyXG4gICAgICAgIGlmIChkYXRlX2Zyb20gPiBkYXRlX3RvKSB7XHJcbiAgICAgICAgICAgIFtkYXRlX2Zyb20sIGRhdGVfdG9dID0gW2RhdGVfdG8sIGRhdGVfZnJvbV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0aW1lX2Zyb20gPSBkYXRlX2Zyb20gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV9mcm9tLmdldFRpbWUoKSA6IDA7XHJcbiAgICAgICAgY29uc3QgdGltZV90byA9IGRhdGVfdG8gaW5zdGFuY2VvZiBEYXRlID8gZGF0ZV90by5nZXRUaW1lKCkgOiAwO1xyXG4gICAgICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuXHJcbiAgICAgICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC00LDRgiDQvNC10LbQtNGDINC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAkZGF5cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAkZGF5c1tpXS5jbGFzc0xpc3QudG9nZ2xlKCdpcy1zZWxlY3RlZC1iZXR3ZWVuJywgJGRheXNbaV0uZGF0YXNldC50aW1lID4gdGltZV9mcm9tICYmICRkYXlzW2ldLmRhdGFzZXQudGltZSA8IHRpbWVfdG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INC90LDRh9Cw0LvRjNC90L7QuSDQuCDQutC+0L3QtdGH0L3QvtC5INC/0L7Qt9C40YbQuNC4XHJcbiAgICAgICAgY29uc3QgJGRheV9mcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgICAgIGNvbnN0ICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG5cclxuICAgICAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgIT0gJGRheV9mcm9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgICAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgIT0gJGRheV90bykge1xyXG4gICAgICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YHQvtGF0YDQsNC90LXQvdC40LUg0LIg0LrQtdGIXHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCA9ICRkYXlfZnJvbTtcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCA9ICRkYXlfdG87XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktGL0LTQtdC70LXQvdC40LUg0LTQuNCw0L/QsNC30L7QvdCwINC00LDRglxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKi9cclxuICAgIHRoaXMucmFuZ2VTZWxlY3QgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgLy8g0LTQvtC/0YPRgdGC0LjQvNGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgIGlmICghdGhpcy5nZXRJc1JhbmdlU2VsZWN0YWJsZShkYXRlX2Zyb20sIGRhdGVfdG8pKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCAkZGF5X2Zyb20sICRkYXlfdG87XHJcblxyXG4gICAgICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LVcclxuICAgICAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgICAgICBbZGF0ZV9mcm9tLCBkYXRlX3RvXSA9IFtkYXRlX3RvLCBkYXRlX2Zyb21dO1xyXG4gICAgICAgICAgICAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICAgICAgICAgICRkYXlfdG8gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfdG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfZnJvbSkge1xyXG4gICAgICAgICAgICAkZGF5X2Zyb20uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtZnJvbScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCRkYXlfdG8pIHtcclxuICAgICAgICAgICAgJGRheV90by5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC10bycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0LLRi9C00LXQu9C10L3QuNC1INGN0LvQtdC80LXQvdGC0L7QslxyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0KGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcblxyXG4gICAgICAgIC8vINGB0L7QsdGL0YLQuNC1XHJcbiAgICAgICAgdGhpcy5fY2FsbGJhY2soJ3JhbmdlU2VsZWN0JywgZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0LLQvtC30LzQvtC20L3QvtGB0YLQuCDQstGL0LTQtdC70LXQvdC40Y8g0LTQsNGCXHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlIGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqIEBwYXJhbSAge0RhdGUgZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0SXNSYW5nZVNlbGVjdGFibGUgPSBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICBkYXRlX2Zyb20uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgZGF0ZV90by5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgW2RhdGVfZnJvbSwgZGF0ZV90b10gPSBbZGF0ZV90bywgZGF0ZV9mcm9tXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC80LjQvdC40LzQsNC70YzQvdGL0Lkg0LTQuNCw0L/QsNC30L7QvVxyXG4gICAgICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhkYXRlX2Zyb20uZ2V0VGltZSgpIC0gZGF0ZV90by5nZXRUaW1lKCkpIC8gMTAwMCAvIDg2NDAwO1xyXG4gICAgICAgIGlmIChkaWZmIDwgdGhpcy5vcHRpb25zLm1pbkRheXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0L/RgNC+0LLQtdGA0LrQsCDQv9C+0L/QsNC00LDQvdC40Y8g0LIg0LTQuNCw0L/QsNC30L7QvSDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0LTQsNGCXHJcbiAgICAgICAgY29uc3QgZGF5ID0gbmV3IERhdGUoKTtcclxuICAgICAgICBkYXkuc2V0VGltZShkYXRlX2Zyb20uZ2V0VGltZSgpKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGRheSA8IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0RGF5TG9ja2VkKGRheSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGF5LnNldERhdGUoZGF5LmdldERhdGUoKSArIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINC90LAg0LTQvtGB0YLRg9C/0L3QvtGB0YLRjCDQtNC90Y8g0LTQu9GPINCx0YDQvtC90LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59ICAgdHJ1ZSDQtdGB0LvQuCDQtNC+0YHRgtGD0L/QtdC9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0RGF5TG9ja2VkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCy0L3QtSDQtNC+0YHRgtGD0L/QvdC+0LPQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBpZiAoZGF0ZSA8IHRoaXMub3B0aW9ucy5taW5EYXRlIHx8IGRhdGUgPiB0aGlzLm9wdGlvbnMubWF4RGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gTE9DS19VTkFWQUlMQUJMRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubG9ja0RheXNGaWx0ZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5sb2NrRGF5c0ZpbHRlcihkYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCt0LvQtdC80LXQvdGCINC60LDQu9C10L3QtNCw0YDQvdC+0LPQviDQtNC90Y9cclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0JTQsNGC0LBcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9ICAgSFRNTCDRjdC70LXQvNC10L3RglxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kZ2V0RGF5QnlEYXRlID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHRpbWUgPSBkYXRlIGluc3RhbmNlb2YgRGF0ZSA/IGRhdGUuZ2V0VGltZSgpIDogMDtcclxuICAgICAgICByZXR1cm4gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuRGF5W2RhdGEtdGltZT1cIicgKyB0aW1lICsgJ1wiXScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC00L3RjyAtINC30LDQs9C70YPRiNC60LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlRW1wdHlEYXkgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5IGlzLWVtcHR5XCI+PC9kaXY+YFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHJldHVybiAkZGF5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC30LTQsNC90LjQtSDRjdC70LXQvNC10L3RgtCwINC40LcgSFRNTCDRgtC10LrRgdGC0LBcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaHRtbCBIVE1MINGC0LXQutGB0YJcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24oaHRtbCkge1xyXG4gICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdi5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcclxuICAgICAgICByZXR1cm4gZGl2LmNoaWxkcmVuLmxlbmd0aCA+IDEgPyBkaXYuY2hpbGRyZW4gOiBkaXYuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTYWZlINCy0YvQt9C+0LIg0LLQvdC10YjQvdC40YUg0YHQvtCx0YvRgtC40Lkg0LrQvtC80L/QvtC90LXQvdGC0LBcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmINCY0LzRjyDRgdC+0LHRi9GC0LjRj1xyXG4gICAgICovXHJcbiAgICB0aGlzLl9jYWxsYmFjayA9IGZ1bmN0aW9uKGYpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5vbltmXSA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMub25bZl0uYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXQoKTtcclxufVxyXG5cclxuLyogaGFybW9ueSBkZWZhdWx0IGV4cG9ydCAqLyBjb25zdCBfX1dFQlBBQ0tfREVGQVVMVF9FWFBPUlRfXyA9IChEYXRlUmFuZ2VQaWNrZXIpO1xyXG5cbn0pKCk7XG5cbi8qKioqKiovIFx0cmV0dXJuIF9fd2VicGFja19leHBvcnRzX187XG4vKioqKioqLyB9KSgpXG47XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdmQyVmljR0ZqYXk5MWJtbDJaWEp6WVd4TmIyUjFiR1ZFWldacGJtbDBhVzl1SWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k5M1pXSndZV05yTDJKdmIzUnpkSEpoY0NJc0luZGxZbkJoWTJzNkx5OWtZWFJsY21GdVoyVndhV05yWlhJdmQyVmljR0ZqYXk5eWRXNTBhVzFsTDJSbFptbHVaU0J3Y205d1pYSjBlU0JuWlhSMFpYSnpJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTkzWldKd1lXTnJMM0oxYm5ScGJXVXZhR0Z6VDNkdVVISnZjR1Z5ZEhrZ2MyaHZjblJvWVc1a0lpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOTNaV0p3WVdOckwzSjFiblJwYldVdmJXRnJaU0J1WVcxbGMzQmhZMlVnYjJKcVpXTjBJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTh1TDNOeVl5OXpZM056TDJsdVpHVjRMbk5qYzNNaUxDSjNaV0p3WVdOck9pOHZaR0YwWlhKaGJtZGxjR2xqYTJWeUx5NHZjM0pqTDJwekwybHVaR1Y0TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRU5CUVVNN1FVRkRSQ3hQT3p0VlExWkJPMVZCUTBFN096czdPMWREUkVFN1YwRkRRVHRYUVVOQk8xZEJRMEU3VjBGRFFTeDNRMEZCZDBNc2VVTkJRWGxETzFkQlEycEdPMWRCUTBFN1YwRkRRU3hGT3pzN096dFhRMUJCTEhkR096czdPenRYUTBGQk8xZEJRMEU3VjBGRFFUdFhRVU5CTEhORVFVRnpSQ3hyUWtGQmEwSTdWMEZEZUVVN1YwRkRRU3dyUTBGQkswTXNZMEZCWXp0WFFVTTNSQ3hGT3pzN096czdPenM3T3pzN1FVTk9RVHM3T3pzN096czdPenM3T3pzN08wRkRRVUU3UVVGRFR6dEJRVU5CT3p0QlFVVlFMR2xFUVVGcFJEdEJRVU5xUkRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEZOQlFWTXNhMEpCUVd0Q08wRkJRek5DT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdkQ1FVRm5RaXhMUVVGTE8wRkJRM0pDTEdkQ1FVRm5RanRCUVVOb1FqdEJRVU5CTzBGQlEwRXNiMFJCUVc5RUxHTkJRV003UVVGRGJFVTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWjBKQlFXZENMRXRCUVVzN1FVRkRja0lzWjBKQlFXZENMRTlCUVU4N1FVRkRka0lzWjBKQlFXZENPMEZCUTJoQ08wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJMSFZDUVVGMVFpeFBRVUZQTzBGQlF6bENPMEZCUTBFN1FVRkRRVHRCUVVOQkxIRkVRVUZ4UkN4cFFrRkJhVUk3UVVGRGRFVXNZVUZCWVR0QlFVTmlPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEVzVTBGQlV6czdRVUZGVkR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeG5Ra0ZCWjBJc1MwRkJTenRCUVVOeVFpeG5Ra0ZCWjBJc1QwRkJUenRCUVVOMlFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4bFFVRmxMRXRCUVVzN1FVRkRjRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFTeDFRa0ZCZFVJc09FSkJRVGhDTzBGQlEzSkVPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTEhWQ1FVRjFRaXh2UWtGQmIwSTdRVUZETTBNN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNZVUZCWVRzN1FVRkZZanRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeGxRVUZsTEV0QlFVczdRVUZEY0VJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJMRFpEUVVFMlF5eGxRVUZsTzBGQlF6VkVPMEZCUTBFc2FVVkJRV2xGTERaRlFVRTJSVHRCUVVNNVNUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMR2RFUVVGblJDeFhRVUZYTEVkQlFVY3NiVUpCUVcxQ08wRkJRMnBHTEdsRlFVRnBSU3cyUlVGQk5rVTdRVUZET1VrN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTERKRFFVRXlRenRCUVVNelF5d3dSRUZCTUVRc1YwRkJWenRCUVVOeVJTeHBRa0ZCYVVJc1YwRkJWenRCUVVNMVFqdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQkxHRkJRV0VzT0VOQlFUaERPMEZCUXpORUxHRkJRV0VzT0VOQlFUaERPMEZCUXpORU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNZVUZCWVR0QlFVTmlMRk5CUVZNN08wRkJSVlE3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdGQlFXRTdPMEZCUldJN1FVRkRRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hsUVVGbExGRkJRVkU3UVVGRGRrSXNaVUZCWlN4UFFVRlBPMEZCUTNSQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1owSkJRV2RDTEV0QlFVczdRVUZEY2tJc1owSkJRV2RDTzBGQlEyaENPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWjBKQlFXZENMRXRCUVVzN1FVRkRja0lzWjBKQlFXZENPMEZCUTJoQ08wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJMRGhDUVVFNFFpdzJRa0ZCTmtJc1JVRkJSU3d3UTBGQk1FTXNaVUZCWlN4bFFVRmxMR05CUVdNc1kwRkJZeXhKUVVGSkxHVkJRV1U3UVVGRGNFdzdPMEZCUlVFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdWQlFXVXNUVUZCVFR0QlFVTnlRanRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1pVRkJaU3hOUVVGTk8wRkJRM0pDTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeGxRVUZsTEZGQlFWRTdRVUZEZGtJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWlVGQlpTeFJRVUZSTzBGQlEzWkNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hUUVVGVE8wRkJRMVE3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1UwRkJVenRCUVVOVU96dEJRVVZCTzBGQlEwRTdRVUZEUVN4bFFVRmxMRXRCUVVzN1FVRkRjRUlzWlVGQlpTeExRVUZMTzBGQlEzQkNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTEhWQ1FVRjFRaXhyUWtGQmEwSTdRVUZEZWtNN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWlVGQlpTeExRVUZMTzBGQlEzQkNMR1ZCUVdVc1MwRkJTenRCUVVOd1FqdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWjBKQlFXZENPMEZCUTJoQ0xHZENRVUZuUWp0QlFVTm9RaXhuUWtGQlowSTdRVUZEYUVJN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWjBKQlFXZENMRXRCUVVzN1FVRkRja0lzWjBKQlFXZENMRkZCUVZFN1FVRkRlRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeG5Ra0ZCWjBJc1MwRkJTenRCUVVOeVFpeG5Ra0ZCWjBJc1VVRkJVVHRCUVVONFFqdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeG5Ra0ZCWjBJc1MwRkJTenRCUVVOeVFpeG5Ra0ZCWjBJN1FVRkRhRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4blFrRkJaMElzVDBGQlR6dEJRVU4yUWl4blFrRkJaMEk3UVVGRGFFSTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVN4bFFVRmxMRTlCUVU4N1FVRkRkRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFc2FVVkJRV1VzWlVGQlpTeEZRVUZESWl3aVptbHNaU0k2SW1SaGRHVnlZVzVuWlhCcFkydGxjaTVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpaG1kVzVqZEdsdmJpQjNaV0p3WVdOclZXNXBkbVZ5YzJGc1RXOWtkV3hsUkdWbWFXNXBkR2x2YmloeWIyOTBMQ0JtWVdOMGIzSjVLU0I3WEc1Y2RHbG1LSFI1Y0dWdlppQmxlSEJ2Y25SeklEMDlQU0FuYjJKcVpXTjBKeUFtSmlCMGVYQmxiMllnYlc5a2RXeGxJRDA5UFNBbmIySnFaV04wSnlsY2JseDBYSFJ0YjJSMWJHVXVaWGh3YjNKMGN5QTlJR1poWTNSdmNua29LVHRjYmx4MFpXeHpaU0JwWmloMGVYQmxiMllnWkdWbWFXNWxJRDA5UFNBblpuVnVZM1JwYjI0bklDWW1JR1JsWm1sdVpTNWhiV1FwWEc1Y2RGeDBaR1ZtYVc1bEtGd2lSR0YwWlhKaGJtZGxjR2xqYTJWeVhDSXNJRnRkTENCbVlXTjBiM0o1S1R0Y2JseDBaV3h6WlNCcFppaDBlWEJsYjJZZ1pYaHdiM0owY3lBOVBUMGdKMjlpYW1WamRDY3BYRzVjZEZ4MFpYaHdiM0owYzF0Y0lrUmhkR1Z5WVc1blpYQnBZMnRsY2x3aVhTQTlJR1poWTNSdmNua29LVHRjYmx4MFpXeHpaVnh1WEhSY2RISnZiM1JiWENKRVlYUmxjbUZ1WjJWd2FXTnJaWEpjSWwwZ1BTQm1ZV04wYjNKNUtDazdYRzU5S1NoelpXeG1MQ0JtZFc1amRHbHZiaWdwSUh0Y2JuSmxkSFZ5YmlBaUxDSXZMeUJVYUdVZ2NtVnhkV2x5WlNCelkyOXdaVnh1ZG1GeUlGOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOGdQU0I3ZlR0Y2JseHVJaXdpTHk4Z1pHVm1hVzVsSUdkbGRIUmxjaUJtZFc1amRHbHZibk1nWm05eUlHaGhjbTF2Ym5rZ1pYaHdiM0owYzF4dVgxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NWtJRDBnS0dWNGNHOXlkSE1zSUdSbFptbHVhWFJwYjI0cElEMCtJSHRjYmx4MFptOXlLSFpoY2lCclpYa2dhVzRnWkdWbWFXNXBkR2x2YmlrZ2UxeHVYSFJjZEdsbUtGOWZkMlZpY0dGamExOXlaWEYxYVhKbFgxOHVieWhrWldacGJtbDBhVzl1TENCclpYa3BJQ1ltSUNGZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxtOG9aWGh3YjNKMGN5d2dhMlY1S1NrZ2UxeHVYSFJjZEZ4MFQySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLR1Y0Y0c5eWRITXNJR3RsZVN3Z2V5QmxiblZ0WlhKaFlteGxPaUIwY25WbExDQm5aWFE2SUdSbFptbHVhWFJwYjI1YmEyVjVYU0I5S1R0Y2JseDBYSFI5WEc1Y2RIMWNibjA3SWl3aVgxOTNaV0p3WVdOclgzSmxjWFZwY21WZlh5NXZJRDBnS0c5aWFpd2djSEp2Y0NrZ1BUNGdLRTlpYW1WamRDNXdjbTkwYjNSNWNHVXVhR0Z6VDNkdVVISnZjR1Z5ZEhrdVkyRnNiQ2h2WW1vc0lIQnliM0FwS1NJc0lpOHZJR1JsWm1sdVpTQmZYMlZ6VFc5a2RXeGxJRzl1SUdWNGNHOXlkSE5jYmw5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dWNpQTlJQ2hsZUhCdmNuUnpLU0E5UGlCN1hHNWNkR2xtS0hSNWNHVnZaaUJUZVcxaWIyd2dJVDA5SUNkMWJtUmxabWx1WldRbklDWW1JRk41YldKdmJDNTBiMU4wY21sdVoxUmhaeWtnZTF4dVhIUmNkRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNobGVIQnZjblJ6TENCVGVXMWliMnd1ZEc5VGRISnBibWRVWVdjc0lIc2dkbUZzZFdVNklDZE5iMlIxYkdVbklIMHBPMXh1WEhSOVhHNWNkRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNobGVIQnZjblJ6TENBblgxOWxjMDF2WkhWc1pTY3NJSHNnZG1Gc2RXVTZJSFJ5ZFdVZ2ZTazdYRzU5T3lJc0lpOHZJR1Y0ZEhKaFkzUmxaQ0JpZVNCdGFXNXBMV056Y3kxbGVIUnlZV04wTFhCc2RXZHBibHh1Wlhod2IzSjBJSHQ5T3lJc0lpOHZJTkdCMEw3UmdkR0MwTDdSajlDOTBMalJqeURRdDlDdzBMSFF1OUMrMExyUXVOR0EwTDdRc3RDdzBMM1F2ZEdMMFlVZzBMVFFzTkdDWEhKY2JtVjRjRzl5ZENCamIyNXpkQ0JNVDBOTFgxVk9RVlpCU1V4QlFreEZJRDBnTVR0Y2NseHVaWGh3YjNKMElHTnZibk4wSUV4UFEwdGZURTlEUzBWRUlDQWdJQ0FnUFNBeU8xeHlYRzVjY2x4dVpuVnVZM1JwYjI0Z1JHRjBaVkpoYm1kbFVHbGphMlZ5S0NSamIyNTBZV2x1WlhJc0lHOXdkR2x2Ym5NZ1BTQjdmU2tnZTF4eVhHNGdJQ0FnZEdocGN5NWZKR052Ym5SaGFXNWxjaUE5SUNSamIyNTBZV2x1WlhJN1hISmNibHh5WEc0Z0lDQWdkR2hwY3k1dmNIUnBiMjV6SUQwZ2UxeHlYRzRnSUNBZ0lDQWdJR1pwY25OMFJHRjVUMlpVYUdWWFpXVnJPaUJ2Y0hScGIyNXpMbVpwY25OMFJHRjVUMlpVYUdWWFpXVnJJSHg4SURFc0lDQWdJQ0FnSUNBZ0lDOHZJTkMvMExYUmdOQ3kwWXZRdVNEUXROQzEwTDNSakNEUXZkQzEwTFRRdGRDNzBMZ3NJREFnUFNEUXN0R0JMQ0F4SUQwZzBML1F2U3dnTGk0dVhISmNiaUFnSUNBZ0lDQWdjMmx1WjJ4bFRXOWtaVG9nSUNBZ0lDQWdJRzl3ZEdsdmJuTXVjMmx1WjJ4bFRXOWtaU0FnSUNBZ0lDQWdmSHdnWm1Gc2MyVXNJQ0FnSUNBZ0x5OGcwTExSaTlDeDBMN1JnQ0RRdnRDMDBMM1F2dEM1SU5DMDBMRFJndEdMSU5DeTBMelF0ZEdCMFlMUXZpRFF0TkM0MExEUXY5Q3cwTGZRdnRDOTBMQmNjbHh1SUNBZ0lDQWdJQ0JzYjJOaGJHVTZJQ0FnSUNBZ0lDQWdJQ0FnYjNCMGFXOXVjeTVzYjJOaGJHVWdJQ0FnSUNBZ0lDQWdJQ0I4ZkNBbmNuVXRVbFVuTEZ4eVhHNGdJQ0FnSUNBZ0lHMXBia1JoZVhNNklDQWdJQ0FnSUNBZ0lDQnZjSFJwYjI1ekxtMXBia1JoZVhNZ0lDQWdJQ0FnSUNBZ0lIeDhJREVzSUNBZ0lDQWdJQ0FnSUM4dklOQzgwTGpRdmRDNDBMelFzTkM3MFl6UXZkQyswTFVnMExyUXZ0QzcwTGpSaDlDMTBZSFJndEN5MEw0ZzBMVFF2ZEMxMExrZzBMSWcwTFRRdU5DdzBML1FzTkMzMEw3UXZkQzFYSEpjYmlBZ0lDQWdJQ0FnYlc5dWRHaHpRMjkxYm5RNklDQWdJQ0FnSUc5d2RHbHZibk11Ylc5dWRHaHpRMjkxYm5RZ0lDQWdJQ0FnZkh3Z01USXNYSEpjYmlBZ0lDQWdJQ0FnY0dWeVVtOTNPaUFnSUNBZ0lDQWdJQ0FnSUc5d2RHbHZibk11Y0dWeVVtOTNJQ0FnSUNBZ0lDQWdJQ0FnZkh3Z2RXNWtaV1pwYm1Wa0xDQWdMeThnMExyUXZ0QzcwTGpSaDlDMTBZSFJndEN5MEw0ZzBMelF0ZEdCMFkvUmh0QzEwTElnMExJZzBZRFJqOUMwMFlOY2NseHVJQ0FnSUNBZ0lDQnRhVzVFWVhSbE9pQWdJQ0FnSUNBZ0lDQWdiM0IwYVc5dWN5NXRhVzVFWVhSbElDQWdJQ0FnSUNBZ0lDQjhmQ0J1WlhjZ1JHRjBaU2dwTENBdkx5RFF2TkM0MEwzUXVOQzgwTERRdTlHTTBMM1FzTkdQSU5DMDBMRFJndEN3WEhKY2JpQWdJQ0FnSUNBZ2JXRjRSR0YwWlRvZ0lDQWdJQ0FnSUNBZ0lHOXdkR2x2Ym5NdWJXRjRSR0YwWlNBZ0lDQWdJQ0FnSUNBZ2ZId2dkVzVrWldacGJtVmtMRnh5WEc0Z0lDQWdJQ0FnSUd4dlkydEVZWGx6Um1sc2RHVnlPaUFnSUNCdmNIUnBiMjV6TG14dlkydEVZWGx6Um1sc2RHVnlJQ0FnSUh4OElIVnVaR1ZtYVc1bFpDd2dJQzh2SUdOaGJHeGlZV05yS0dSaGRHVXBJTkdFMFlQUXZkQzYwWWJRdU5HUElOQ3gwTHZRdnRDNjBMalJnTkMrMExMUXNOQzkwTGpSanlEUXROQ3cwWUlzSUhSeWRXVXZURTlEUzF4eVhHNGdJQ0FnSUNBZ0lHOXVPaUJQWW1wbFkzUXVZWE56YVdkdUtIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2NtRnVaMlZUWld4bFkzUTZJRzUxYkd3c0lDOHZJTkdCMEw3UXNkR0wwWUxRdU5DMUlOQ3kwWXZRc2RDKzBZRFFzQ0RRdE5DNDBMRFF2OUN3MExmUXZ0QzkwTEFnMExUUXNOR0NYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHUmhlVk5sYkdWamREb2diblZzYkN3Z0lDQXZMeURSZ2RDKzBMSFJpOUdDMExqUXRTRFFzdEdMMExIUXZ0R0EwTEFnMEw3UXROQzkwTDdRdVNEUXROQ3cwWUxSaXlBbzBZTFF2dEM3MFl6UXV0QytJTkMvMFlEUXVDQnphVzVuYkdWTmIyUmxPaUIwY25WbEtWeHlYRzRnSUNBZ0lDQWdJSDBzSUc5d2RHbHZibk11YjI0Z2ZId2dlMzBwTEZ4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHZJTkdBMFkvUXROQzkwTDdSZ2RHQzBZeGNjbHh1SUNBZ0lHbG1JQ2gwZVhCbGIyWWdkR2hwY3k1dmNIUnBiMjV6TG5CbGNsSnZkeUE5UFNBbmRXNWtaV1pwYm1Wa0p5a2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXViM0IwYVc5dWN5NXdaWEpTYjNjZ1BTQjBhR2x6TG05d2RHbHZibk11Ylc5dWRHaHpRMjkxYm5RN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUW1OQzkwTGpSaHRDNDBMRFF1OUM0MExmUXNOR0cwTGpSajF4eVhHNGdJQ0FnSUNvdlhISmNiaUFnSUNCMGFHbHpMbWx1YVhRZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDhrY0dsamEyVnlJRDBnZEdocGN5NWZKR055WldGMFpVVnNaVzFsYm5Rb1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdBOFpHbDJJR05zWVhOelBWd2lSR0YwWlhKaGJtZGxjR2xqYTJWeVhDSStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aVJHRjBaWEpoYm1kbGNHbGphMlZ5WDE5dGIyNTBhSE5jSWo0OEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdQQzlrYVhZK1lGeHlYRzRnSUNBZ0lDQWdJQ2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5HTjBMdlF0ZEM4MExYUXZkR0MwWXRjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDhrYlc5dWRHaHpJRDBnZEdocGN5NWZKSEJwWTJ0bGNpNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVJHRjBaWEpoYm1kbGNHbGphMlZ5WDE5dGIyNTBhSE1uS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnTHk4ZzBMalF2ZEM0MFliUXVOQ3cwTHZRdU5DMzBMRFJodEM0MFk4ZzBZSFF2dEdCMFlMUXZ0R1AwTDNRdU5DNVhISmNiaUFnSUNBZ0lDQWdkR2hwY3k1eVlXNW5aVkpsYzJWMEtDazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDOHZJTkdBMExYUXZkQzAwTFhSZ0Z4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WHlSamNtVmhkR1ZOYjI1MGFITW9kR2hwY3k1dmNIUnBiMjV6TG0xcGJrUmhkR1VwTzF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WHlSamIyNTBZV2x1WlhJdVlYQndaVzVrUTJocGJHUW9kR2hwY3k1ZkpIQnBZMnRsY2lrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUW5kQ3cwTGZRc3RDdzBMM1F1TkMxSU5DODBMWFJnZEdQMFliUXNGeHlYRzRnSUNBZ0lDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ0FnSUNBcUlFQnlaWFIxY200Z2UxTjBjbWx1WjMxY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVuWlhSTmIyNTBhRVp2Y20xaGRIUmxaQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0IwYVhSc1pTQTlJSFJvYVhNdVoyVjBSR0YwWlZScGJXVkdiM0p0WVhRb1pHRjBaU3dnZTIxdmJuUm9PaUFuYkc5dVp5ZDlLVHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdsMGJHVXVjMnhwWTJVb01Dd2dNU2t1ZEc5VmNIQmxja05oYzJVb0tTQXJJSFJwZEd4bExuTnNhV05sS0RFcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBLVFF2dEdBMEx6UXNOR0MwTGpSZ05DKzBMTFFzTkM5MExqUXRTRFF0TkN3MFlMUml5RFF0TkM3MFk4ZzBZTFF0ZEM2MFlQUmlkQzEwTGtnMEx2UXZ0QzYwTERRdTlDNFhISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ0lIdEVZWFJsZlNBZ0lHUmhkR1VnSUNBZzBKN1FzZEdLMExYUXV0R0NJTkMwMExEUmd0R0xYSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdJSHRQWW1wbFkzUjlJRzl3ZEdsdmJuTWcwSi9Rc05HQTBMRFF2TkMxMFlMUmdOR0xYSEpjYmlBZ0lDQWdLaUJBY21WMGRYSnVJSHRUZEhKcGJtZDlYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVoyVjBSR0YwWlZScGJXVkdiM0p0WVhRZ1BTQm1kVzVqZEdsdmJpaGtZWFJsTENCdmNIUnBiMjV6S1NCN1hISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlFbHVkR3d1UkdGMFpWUnBiV1ZHYjNKdFlYUW9kR2hwY3k1dmNIUnBiMjV6TG14dlkyRnNaU3dnYjNCMGFXOXVjeWt1Wm05eWJXRjBLR1JoZEdVcE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBKVFF2ZEM0SU5DOTBMWFF0TkMxMEx2UXVGeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TG1kbGRGZGxaV3RFWVhselJtOXliV0YwZEdWa0lEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWkdGMFpTQTlJRzVsZHlCRVlYUmxLQ2s3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnY21WemRXeDBJRDBnVzEwN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUdSaGRHVXVjMlYwUkdGMFpTaGtZWFJsTG1kbGRFUmhkR1VvS1NBdElESXBPMXh5WEc0Z0lDQWdJQ0FnSUdadmNpQW9iR1YwSUdrZ1BTQXdPeUJwSUR3Z056c2dLeXRwS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGRHVXVjMlYwUkdGMFpTaGtZWFJsTG1kbGRFUmhkR1VvS1NBcklERXBPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWE4xYkhRdWNIVnphQ2g3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCa1lYazZJR1JoZEdVdVoyVjBSR0Y1S0Nrc1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhWFJzWlRvZ2RHaHBjeTVuWlhSRVlYUmxWR2x0WlVadmNtMWhkQ2hrWVhSbExDQjdkMlZsYTJSaGVUb2dKM05vYjNKMEozMHBMRnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlLVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOR0IwTDdSZ05HQzBMalJnTkMrMExMUXV0Q3dJTkdCMEw3UXM5QzcwTERSZ2RDOTBMNGcwTDNRc05HQjBZTFJnTkMrMExYUXZkQzkwTDdRdk5HRElOQy8wTFhSZ05DeTBMN1F2TkdESU5DMDBMM1JqaURRdmRDMTBMVFF0ZEM3MExoY2NseHVJQ0FnSUNBZ0lDQnlaWE4xYkhRdWMyOXlkQ2dvWVN3Z1lpa2dQVDRnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JqYjI1emRDQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5QTlJSFJvYVhNdWIzQjBhVzl1Y3k1bWFYSnpkRVJoZVU5bVZHaGxWMlZsYXlBbElEYzdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHeGxkQ0JrWVhsQklEMGdZUzVrWVhrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUd4bGRDQmtZWGxDSUQwZ1lpNWtZWGs3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9aR0Y1UVNBOVBTQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJQzB4TzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9aR0Y1UWlBOVBTQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJREU3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaGtZWGxCSUR3Z1ptbHljM1JFWVhsUFpsUm9aVmRsWldzcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR1JoZVVFZ0t6MGdjbVZ6ZFd4MExteGxibWQwYUR0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR1JoZVVJZ1BDQm1hWEp6ZEVSaGVVOW1WR2hsVjJWbGF5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWkdGNVFpQXJQU0J5WlhOMWJIUXViR1Z1WjNSb08xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1pHRjVRU0F0SUdSaGVVSTdYSEpjYmlBZ0lDQWdJQ0FnZlNrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUJ5WlhOMWJIUTdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRFFtdEMrMEx2UXVOR0gwTFhSZ2RHQzBMTFF2aURRdE5DOTBMWFF1U0RRc2lEUXZOQzEwWUhSajlHRzBMVmNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQWdlMFJoZEdWOUlHUmhkR1VnMEo3UXNkR0swTFhRdXRHQ0lOQzAwTERSZ3RHTFhISmNiaUFnSUNBZ0tpQkFjbVYwZFhKdUlIdE9kVzFpWlhKOUlDQWdJTkNhMEw3UXU5QzQwWWZRdGRHQjBZTFFzdEMrSU5DMDBMM1F0ZEM1WEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUhSb2FYTXVaMlYwUkdGNWMwTnZkVzUwU1c1TmIyNTBhQ0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0JrWVhseklEMGdibVYzSUVSaGRHVW9aR0YwWlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ0lDQWdJR1JoZVhNdWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmlBZ0lDQWdJQ0FnWkdGNWN5NXpaWFJOYjI1MGFDaGtZWGx6TG1kbGRFMXZiblJvS0NrZ0t5QXhLVHRjY2x4dUlDQWdJQ0FnSUNCa1lYbHpMbk5sZEVSaGRHVW9NQ2s3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdSaGVYTXVaMlYwUkdGMFpTZ3BPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwS0RRdGRDOTBMVFF0ZEdBSU5DMDBMalFzTkMvMExEUXQ5QyswTDNRc0NEUXZOQzEwWUhSajlHRzBMWFFzbHh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRFWVhSbGZTQmtZWFJsWDJaeWIyMGcwSjNRc05HSDBMRFF1OUdNMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVh5UmpjbVZoZEdWTmIyNTBhSE1nUFNCbWRXNWpkR2x2Ymloa1lYUmxYMlp5YjIwcElIdGNjbHh1SUNBZ0lDQWdJQ0IzYUdsc1pTQW9kR2hwY3k1ZkpHMXZiblJvY3k1c1lYTjBSV3hsYldWdWRFTm9hV3hrS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVYeVJ0YjI1MGFITXVjbVZ0YjNabFEyaHBiR1FvZEdocGN5NWZKRzF2Ym5Sb2N5NXNZWE4wUld4bGJXVnVkRU5vYVd4a0tUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5DLzBZRFF0ZEdBMExYUXZkQzAwTFhSZ0NEUXZOQzEwWUhSajlHRzBMWFFzbHh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR04xY25KbGJuUkVZWFJsSUQwZ2JtVjNJRVJoZEdVb1pHRjBaVjltY205dExtZGxkRlJwYldVb0tTazdYSEpjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdKRzF2Ym5Sb2N5QTlJRnRkTzF4eVhHNGdJQ0FnSUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2dkR2hwY3k1dmNIUnBiMjV6TG0xdmJuUm9jME52ZFc1ME95QXJLMmtwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSkcxdmJuUm9jeTV3ZFhOb0tIUm9hWE11WHlSamNtVmhkR1ZOYjI1MGFDaGpkWEp5Wlc1MFJHRjBaU2twTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JqZFhKeVpXNTBSR0YwWlM1elpYUk5iMjUwYUNoamRYSnlaVzUwUkdGMFpTNW5aWFJOYjI1MGFDZ3BJQ3NnTVNrN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURSZ05DMTBMM1F0TkMxMFlCY2NseHVJQ0FnSUNBZ0lDQm1iM0lnS0d4bGRDQnBJRDBnTURzZ2FTQThJQ1J0YjI1MGFITXViR1Z1WjNSb095QnBJQ3M5SUhSb2FYTXViM0IwYVc5dWN5NXdaWEpTYjNjcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1kyOXVjM1FnSkhKdmR5QTlJR1J2WTNWdFpXNTBMbU55WldGMFpVVnNaVzFsYm5Rb0oyUnBkaWNwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FrY205M0xtTnNZWE56VG1GdFpTQTlJQ2RFWVhSbGNtRnVaMlZ3YVdOclpYSmZYM0p2ZHljN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWtiVzl1ZEdoekxuTnNhV05sS0drc0lHa2dLeUIwYUdsekxtOXdkR2x2Ym5NdWNHVnlVbTkzS1M1bWIzSkZZV05vS0NSdGIyNTBhQ0E5UGlCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWtjbTkzTG1Gd2NHVnVaRU5vYVd4a0tDUnRiMjUwYUNrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUgwcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZkpHMXZiblJvY3k1aGNIQmxibVJEYUdsc1pDZ2tjbTkzS1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxsOXpaV3hsWTNScGIyNGdKaVlnS0hSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBnZkh3Z2RHaHBjeTVmYzJWc1pXTjBhVzl1TG1SaGRHVmZkRzhwS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDJaeWIyMHNJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5b3FYSEpjYmlBZ0lDQWdLaURRb05DMTBMM1F0TkMxMFlBZzBMelF0ZEdCMFkvUmh0Q3dYSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMFJoZEdWOUlHUmhkR1VnMEp6UXRkR0IwWS9SaGx4eVhHNGdJQ0FnSUNvdlhISmNiaUFnSUNCMGFHbHpMbDhrWTNKbFlYUmxUVzl1ZEdnZ1BTQm1kVzVqZEdsdmJpaGtZWFJsS1NCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1kzVnljbVZ1ZEUxdmJuUm9JRDBnWkdGMFpTNW5aWFJOYjI1MGFDZ3BPMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJRzF2Ym5Sb1ZHbDBiR1VnUFNCMGFHbHpMbWRsZEUxdmJuUm9SbTl5YldGMGRHVmtLR1JoZEdVcE8xeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElIZGxaV3RFWVhseklEMGdkR2hwY3k1blpYUlhaV1ZyUkdGNWMwWnZjbTFoZEhSbFpDZ3BPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENBa2JXOXVkR2dnUFNCMGFHbHpMbDhrWTNKbFlYUmxSV3hsYldWdWRDaGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGd2lJR1JoZEdFdGRHbHRaVDFjSWlSN1pHRjBaUzVuWlhSVWFXMWxLQ2w5WENJK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThaR2wySUdOc1lYTnpQVndpVFc5dWRHaGZYMmhsWVdSbGNsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGOWZZWEp5YjNjZ1RXOXVkR2hmWDJGeWNtOTNMUzF3Y21WMkpIc29kR2hwY3k1dmNIUnBiMjV6TG0xcGJrUmhkR1VnSmlZZ1pHRjBaU0E4UFNCMGFHbHpMbTl3ZEdsdmJuTXViV2x1UkdGMFpTa2dQeUFuSUdsekxXUnBjMkZpYkdWa0p5QTZJQ2NuZlZ3aVBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjM1puSUhkcFpIUm9QVndpT0Z3aUlHaGxhV2RvZEQxY0lqRTBYQ0lnZG1sbGQwSnZlRDFjSWpBZ01DQTRJREUwWENJZ1ptbHNiRDFjSW01dmJtVmNJaUI0Yld4dWN6MWNJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5YQ0krWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThjR0YwYUNCa1BWd2lUVGNnTVROTU1TQTNURGNnTVZ3aUlITjBjbTlyWlQxY0lpTTRRemhET0VOY0lpQnpkSEp2YTJVdGQybGtkR2c5WENJeVhDSWdjM1J5YjJ0bExXeHBibVZqWVhBOVhDSnliM1Z1WkZ3aUlITjBjbTlyWlMxc2FXNWxhbTlwYmoxY0luSnZkVzVrWENJK1BDOXdZWFJvUGx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOEwzTjJaejVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aVRXOXVkR2hmWDNScGRHeGxYQ0krSkh0dGIyNTBhRlJwZEd4bGZTQWtlMlJoZEdVdVoyVjBSblZzYkZsbFlYSW9LWDA4TDJScGRqNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBOFpHbDJJR05zWVhOelBWd2lUVzl1ZEdoZlgyRnljbTkzSUUxdmJuUm9YMTloY25KdmR5MHRibVY0ZENSN0tIUm9hWE11YjNCMGFXOXVjeTV0WVhoRVlYUmxJQ1ltSUdSaGRHVWdQajBnZEdocGN5NXZjSFJwYjI1ekxtMWhlRVJoZEdVcElEOGdKeUJwY3kxa2FYTmhZbXhsWkNjZ09pQW5KMzFjSWo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BITjJaeUIzYVdSMGFEMWNJamhjSWlCb1pXbG5hSFE5WENJeE5Gd2lJSFpwWlhkQ2IzZzlYQ0l3SURBZ09DQXhORndpSUdacGJHdzlYQ0p1YjI1bFhDSWdlRzFzYm5NOVhDSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMloxd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1BIQmhkR2dnWkQxY0lrMHhJREF1T1RrNU9UazVURGNnTjB3eElERXpYQ0lnYzNSeWIydGxQVndpSXpoRE9FTTRRMXdpSUhOMGNtOXJaUzEzYVdSMGFEMWNJakpjSWlCemRISnZhMlV0YkdsdVpXTmhjRDFjSW5KdmRXNWtYQ0lnYzNSeWIydGxMV3hwYm1WcWIybHVQVndpY205MWJtUmNJajQ4TDNCaGRHZytYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRHd2YzNablBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEM5a2FYWStYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56UFZ3aVRXOXVkR2hmWDNkbFpXdGNJajRrZTNkbFpXdEVZWGx6TG0xaGNDaHBkR1Z0SUQwK0lIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTRnWUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUY5ZmQyVmxhMlJoZVZ3aVBpUjdhWFJsYlM1MGFYUnNaWDA4TDJScGRqNWdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5S1M1cWIybHVLQ2NuS1gwOEwyUnBkajVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNNOVhDSk5iMjUwYUY5ZlpHRjVjMXdpUGp3dlpHbDJQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMlJwZGo1Z1hISmNiaUFnSUNBZ0lDQWdLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdMeThnMFlIUmd0R0EwTFhRdTlDNjBMaGNjbHh1SUNBZ0lDQWdJQ0JiWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSHR6Wld4bFkzUnZjam9nSnk1TmIyNTBhRjlmWVhKeWIzY3RMWEJ5WlhZbkxDQnVZVzFsT2lBbmNISmxkaWQ5TEZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I3YzJWc1pXTjBiM0k2SUNjdVRXOXVkR2hmWDJGeWNtOTNMUzF1WlhoMEp5d2dibUZ0WlRvZ0oyNWxlSFFuZlN4Y2NseHVJQ0FnSUNBZ0lDQmRMbVp2Y2tWaFkyZ29hWFJsYlNBOVBpQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHTnZibk4wSUNSaGNuSnZkeUE5SUNSdGIyNTBhQzV4ZFdWeWVWTmxiR1ZqZEc5eUtHbDBaVzB1YzJWc1pXTjBiM0lwTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FrWVhKeWIzY3VZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25ZMnhwWTJzbkxDQmxJRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11WDI5dVFYSnliM2REYkdsamF5Z2tZWEp5YjNjc0lHbDBaVzB1Ym1GdFpTazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIMHBPMXh5WEc0Z0lDQWdJQ0FnSUgwcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5RFJnTkMxMEwzUXROQzEwWUFnMExUUXZkQzEwTGxjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0FrWkdGNWN5QTlJQ1J0YjI1MGFDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVRXOXVkR2hmWDJSaGVYTW5LVHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0JrWVhseklEMGdibVYzSUVSaGRHVW9aR0YwWlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ0lDQWdJR1JoZVhNdWMyVjBSR0YwWlNneEtUdGNjbHh1SUNBZ0lDQWdJQ0JrWVhsekxuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQjNhR2xzWlNBb1pHRjVjeTVuWlhSTmIyNTBhQ2dwSUQwOUlHTjFjbkpsYm5STmIyNTBhQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JqYjI1emRDQWtkMlZsYXlBOUlIUm9hWE11WHlSamNtVmhkR1ZYWldWcktDazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IzWldWclJHRjVjeTVtYjNKRllXTm9LR2wwWlcwZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHUmhlWE11WjJWMFJHRjVLQ2tnSVQwZ2FYUmxiUzVrWVhrZ2ZId2daR0Y1Y3k1blpYUk5iMjUwYUNncElDRTlJR04xY25KbGJuUk5iMjUwYUNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNSM1pXVnJMbUZ3Y0dWdVpFTm9hV3hrS0hSb2FYTXVYeVJqY21WaGRHVkZiWEIwZVVSaGVTZ3BLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200N1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0pIZGxaV3N1WVhCd1pXNWtRMmhwYkdRb2RHaHBjeTVmSkdOeVpXRjBaVVJoZVNoa1lYbHpLU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCa1lYbHpMbk5sZEVSaGRHVW9aR0Y1Y3k1blpYUkVZWFJsS0NrZ0t5QXhLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBa1pHRjVjeTVoY0hCbGJtUkRhR2xzWkNna2QyVmxheWs3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnSkcxdmJuUm9PMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwSnJRdTlDNDBMb2cwTC9RdmlEUmdkR0MwWURRdGRDNzBMclF0U0RRdjlDMTBZRFF0ZEM2MEx2Ump0R0gwTFhRdmRDNDBZOGcwTHpRdGRHQjBZL1JodEN3WEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTBWc1pXMWxiblI5SUNSaGNuSnZkeUJJVkUxTUlOR04wTHZRdGRDODBMWFF2ZEdDWEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTFOMGNtbHVaMzBnYm1GdFpTQWdJQ0RRbU5DODBZOGdLSEJ5WlhZc0lHNWxlSFFwWEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUhSb2FYTXVYMjl1UVhKeWIzZERiR2xqYXlBOUlHWjFibU4wYVc5dUtDUmhjbkp2ZHl3Z2JtRnRaU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2drWVhKeWIzY3VZMnhoYzNOTWFYTjBMbU52Ym5SaGFXNXpLQ2RwY3kxa2FYTmhZbXhsWkNjcEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCbVlXeHpaVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR1JoZEdVZ1BTQnVaWGNnUkdGMFpTaHdZWEp6WlVsdWRDaDBhR2x6TGw4a2JXOXVkR2h6TG5GMVpYSjVVMlZzWldOMGIzSW9KeTVOYjI1MGFDY3BMbVJoZEdGelpYUXVkR2x0WlN3Z01UQXBLVHRjY2x4dUlDQWdJQ0FnSUNCa1lYUmxMbk5sZEUxdmJuUm9LR1JoZEdVdVoyVjBUVzl1ZEdnb0tTQXJJQ2h1WVcxbElEMDlJQ2R3Y21WMkp5QS9JQzEwYUdsekxtOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUWdPaUIwYUdsekxtOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUXBLVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdMeThnMExMUmk5R0YwTDdRdENEUXQ5Q3dJTkMvMFlEUXRkQzAwTFhRdTlHTElOQzgwTGpRdmRDNDBMelFzTkM3MFl6UXZkQyswTGtnMExUUXNOR0MwWXRjY2x4dUlDQWdJQ0FnSUNCcFppQW9aR0YwWlNBOElIUm9hWE11YjNCMGFXOXVjeTV0YVc1RVlYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR1JoZEdVdWMyVjBWR2x0WlNoMGFHbHpMbTl3ZEdsdmJuTXViV2x1UkdGMFpTNW5aWFJVYVcxbEtDa3BPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnTHk4ZzBMTFJpOUdGMEw3UXRDRFF0OUN3SU5DLzBZRFF0ZEMwMExYUXU5R0xJTkM4MExEUXV0R0IwTGpRdk5DdzBMdlJqTkM5MEw3UXVTRFF0TkN3MFlMUmkxeHlYRzRnSUNBZ0lDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXViV0Y0UkdGMFpTa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCbGJtUkVZWFJsSUQwZ2JtVjNJRVJoZEdVb1pHRjBaUzVuWlhSVWFXMWxLQ2twTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JsYm1SRVlYUmxMbk5sZEUxdmJuUm9LR1Z1WkVSaGRHVXVaMlYwVFc5dWRHZ29LU0FySUhSb2FYTXViM0IwYVc5dWN5NXRiMjUwYUhORGIzVnVkQ2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNobGJtUkVZWFJsSUQ0Z2RHaHBjeTV2Y0hScGIyNXpMbTFoZUVSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdSaGRHVXVjMlYwVkdsdFpTaDBhR2x6TG05d2RHbHZibk11YldGNFJHRjBaUzVuWlhSVWFXMWxLQ2twTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1pHRjBaUzV6WlhSTmIyNTBhQ2hrWVhSbExtZGxkRTF2Ym5Sb0tDa2dMU0IwYUdsekxtOXdkR2x2Ym5NdWJXOXVkR2h6UTI5MWJuUWdLeUF4S1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmSkdOeVpXRjBaVTF2Ym5Sb2N5aGtZWFJsS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZLaXBjY2x4dUlDQWdJQ0FxSU5DZzBMWFF2ZEMwMExYUmdDRFF2ZEMxMExUUXRkQzcwTGhjY2x4dUlDQWdJQ0FxSUVCd1lYSmhiU0FnZTBSaGRHVjlJR1JoZEdVZzBKN1FzZEdLMExYUXV0R0NJTkMwMExEUmd0R0xYSEpjYmlBZ0lDQWdLaUJBY21WMGRYSnVJSHRGYkdWdFpXNTBmVnh5WEc0Z0lDQWdJQ292WEhKY2JpQWdJQ0IwYUdsekxsOGtZM0psWVhSbFYyVmxheUE5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0FrZDJWbGF5QTlJSFJvYVhNdVh5UmpjbVZoZEdWRmJHVnRaVzUwS0Z4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JnUEdScGRpQmpiR0Z6Y3oxY0lsZGxaV3RjSWo0OEwyUnBkajVnWEhKY2JpQWdJQ0FnSUNBZ0tUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUNSM1pXVnJPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwS0RRdGRDOTBMVFF0ZEdBSU5DMDBMM1JqMXh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJQ0I3UkdGMFpYMGdaR0YwWlNEUW50Q3gwWXJRdGRDNjBZSWcwTFRRc05HQzBZdGNjbHh1SUNBZ0lDQXFJRUJ5WlhSMWNtNGdlMFZzWlcxbGJuUjlYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVh5UmpjbVZoZEdWRVlYa2dQU0JtZFc1amRHbHZiaWhrWVhSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdiRzlqYTJWa0lEMGdkR2hwY3k1blpYUkVZWGxNYjJOclpXUW9aR0YwWlNrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJQ1JrWVhrZ1BTQjBhR2x6TGw4a1kzSmxZWFJsUld4bGJXVnVkQ2hjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdZRHhrYVhZZ1kyeGhjM005WENKRVlYa2tlMnh2WTJ0bFpDQS9JQ2NnYVhNdFpHbHpZV0pzWldRbklEb2dKeWQ5Skh0c2IyTnJaV1FnUFQwZ1RFOURTMTlNVDBOTFJVUWdQeUFuSUdsekxXeHZZMnRsWkNjZ09pQW5KMzFjSWlCa1lYUmhMWFJwYldVOVhDSWtlMlJoZEdVdVoyVjBWR2x0WlNncGZWd2lJR1JoZEdFdFpHRjVQVndpSkh0a1lYUmxMbWRsZEVSaGVTZ3BmVndpUGlSN1pHRjBaUzVuWlhSRVlYUmxLQ2w5UEM5a2FYWStZRnh5WEc0Z0lDQWdJQ0FnSUNrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUNSa1lYa3VZV1JrUlhabGJuUk1hWE4wWlc1bGNpZ25ZMnhwWTJzbkxDQjBhR2x6TGw5dmJrUmhlVU5zYVdOclJYWmxiblF1WW1sdVpDaDBhR2x6S1NrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUdsbUlDZ2hkR2hwY3k1dmNIUnBiMjV6TG5OcGJtZHNaVTF2WkdVcElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0pHUmhlUzVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLQ2R0YjNWelpXVnVkR1Z5Snl3Z2RHaHBjeTVmYjI1RVlYbE5iM1Z6WlVWdWRHVnlSWFpsYm5RdVltbHVaQ2gwYUdsektTazdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdKR1JoZVR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZLaXBjY2x4dUlDQWdJQ0FxSU5DaDBMN1FzZEdMMFlMUXVOQzFJTkM2MEx2UXVOQzYwTEFnMEwvUXZpRFF0TkM5MFk1Y2NseHVJQ0FnSUNBcUlFQndZWEpoYlNCN1JYWmxiblI5SUdVZ1JFOU5JTkdCMEw3UXNkR0wwWUxRdU5DMVhISmNiaUFnSUNBZ0tpOWNjbHh1SUNBZ0lIUm9hWE11WDI5dVJHRjVRMnhwWTJ0RmRtVnVkQ0E5SUdaMWJtTjBhVzl1S0dVcElIdGNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOXZia1JoZVVOc2FXTnJLR1V1ZEdGeVoyVjBLVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdktpcGNjbHh1SUNBZ0lDQXFJTkNoMEw3UXNkR0wwWUxRdU5DMUlOR0YwTDdRc3RDMTBZRFFzRnh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRGZG1WdWRIMGdaU0JFVDAwZzBZSFF2dEN4MFl2Umd0QzQwTFZjY2x4dUlDQWdJQ0FxTDF4eVhHNGdJQ0FnZEdocGN5NWZiMjVFWVhsTmIzVnpaVVZ1ZEdWeVJYWmxiblFnUFNCbWRXNWpkR2x2YmlobEtTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZiMjVFWVhsTmIzVnpaVVZ1ZEdWeUtHVXVkR0Z5WjJWMEtUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlOQ2wwTDdRc3RDMTBZQWcwTDNRc0NEUmpkQzcwTFhRdk5DMTBMM1JndEMxSU5DMDBMM1JqMXh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRGYkdWdFpXNTBmU0FrWkdGNUlFaFVUVXdnMEszUXU5QzEwTHpRdGRDOTBZSmNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdkR2hwY3k1ZmIyNUVZWGxOYjNWelpVVnVkR1Z5SUQwZ1puVnVZM1JwYjI0b0pHUmhlU2tnZTF4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2doZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU0I4ZkNCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNDdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb0pHUmhlUzVrWVhSaGMyVjBMblJwYldVZ1BUMGdkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmWm5KdmJTNW5aWFJVYVcxbEtDa3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1pHRjBaVjkwYnlBOUlHNWxkeUJFWVhSbEtIQmhjbk5sU1c1MEtDUmtZWGt1WkdGMFlYTmxkQzUwYVcxbExDQXhNQ2twTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0IwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDaDBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dExDQmtZWFJsWDNSdktUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlOQ2EwTHZRdU5DNklOQy8wTDRnMExUUXZkR09YSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdlMFZzWlcxbGJuUjlJQ1JrWVhrZ1NGUk5UQ0RRcmRDNzBMWFF2TkMxMEwzUmdseHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TGw5dmJrUmhlVU5zYVdOcklEMGdablZ1WTNScGIyNG9KR1JoZVNrZ2UxeHlYRzRnSUNBZ0lDQWdJQzh2SU5DMDBMWFF2ZEdNSU5DMzBMRFFzZEM3MEw3UXV0QzQwWURRdnRDeTBMRFF2Vnh5WEc0Z0lDQWdJQ0FnSUdsbUlDZ2taR0Y1TG1Oc1lYTnpUR2x6ZEM1amIyNTBZV2x1Y3lnbmFYTXRaR2x6WVdKc1pXUW5LU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURRc3RHTDBMSFF2dEdBSU5DKzBMVFF2ZEMrMExrZzBMVFFzTkdDMFl0Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NXZjSFJwYjI1ekxuTnBibWRzWlUxdlpHVXBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1eVlXNW5aVkpsYzJWMEtDazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDUmtZWGt1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25hWE10YzJWc1pXTjBaV1FuS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NWZZMkZzYkdKaFkyc29KMlJoZVZObGJHVmpkQ2NzSUc1bGR5QkVZWFJsS0hCaGNuTmxTVzUwS0NSa1lYa3VaR0YwWVhObGRDNTBhVzFsTENBeE1Da3BLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdMeThnMFlIUXNkR0EwTDdSZ1NEUXN0R0wwTEhSZ05DdzBMM1F2ZEMrMExQUXZpRFJnTkN3MEwzUXRkQzFJTkMwMExqUXNOQy8wTERRdDlDKzBMM1FzRnh5WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjltY205dElDWW1JSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNWtZWFJsWDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11Y21GdVoyVlNaWE5sZENncE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdKR1JoZVM1amJHRnpjMHhwYzNRdVlXUmtLQ2RwY3kxelpXeGxZM1JsWkNjcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5RFFzdEdMMExIUmdOQ3cwTDNRc0NEUXZkQ3cwWWZRc05DNzBZelF2ZEN3MFk4Z0x5RFF1dEMrMEwzUXRkR0gwTDNRc05HUElOQzAwTERSZ3RDd1hISmNiaUFnSUNBZ0lDQWdhV1lnS0NGMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVYM05sYkdWamRHbHZiaTVrWVhSbFgyWnliMjBnUFNCdVpYY2dSR0YwWlNod1lYSnpaVWx1ZENna1pHRjVMbVJoZEdGelpYUXVkR2x0WlN3Z01UQXBLVHRjY2x4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnYVdZZ0tDRjBhR2x6TGw5elpXeGxZM1JwYjI0dVpHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieUE5SUc1bGR5QkVZWFJsS0hCaGNuTmxTVzUwS0NSa1lYa3VaR0YwWVhObGRDNTBhVzFsTENBeE1Da3BPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11WDNObGJHVmpkR2x2Ymk1a1lYUmxYMlp5YjIwZ0ppWWdkR2hwY3k1ZmMyVnNaV04wYVc5dUxtUmhkR1ZmZEc4cElIdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGcwTFRRdnRDLzBZUFJnZEdDMExqUXZOR0wwTGtnMExUUXVOQ3cwTC9Rc05DMzBMN1F2Vnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvSVhSb2FYTXVaMlYwU1hOU1lXNW5aVk5sYkdWamRHRmliR1VvZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZlpuSnZiU3dnZEdocGN5NWZjMlZzWldOMGFXOXVMbVJoZEdWZmRHOHBLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbkpoYm1kbFVtVnpaWFFvS1R0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTV5WVc1blpWTmxiR1ZqZENoMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOW1jbTl0TENCMGFHbHpMbDl6Wld4bFkzUnBiMjR1WkdGMFpWOTBieWs3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBLSFFzZEdBMEw3UmdTRFFzdEdMMExUUXRkQzcwTFhRdmRDOTBZdlJoU0RRdE5DdzBZSmNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdkR2hwY3k1eVlXNW5aVkpsYzJWMElEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4U1pYTmxkQ2dwTzF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNObGJHVmpkR2x2YmlBOUlIdDlPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwSkxRdU5DMzBZUFFzTkM3MFl6UXZkR0wwTGtnMFlIUXNkR0EwTDdSZ1NEUXN0R0wwTFRRdGRDNzBMWFF2ZEM5MFl2UmhTRFF0TkN3MFlKY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4U1pYTmxkQ0E5SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElDUmtZWGx6SUQwZ2RHaHBjeTVmSkcxdmJuUm9jeTV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2N1UkdGNVcyUmhkR0V0ZEdsdFpWMG5LVHRjY2x4dUlDQWdJQ0FnSUNBa1pHRjVjeTVtYjNKRllXTm9LQ1JrWVhrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWtaR0Y1TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJsekxYTmxiR1ZqZEdWa0p5d2dKMmx6TFhObGJHVmpkR1ZrTFdaeWIyMG5MQ0FuYVhNdGMyVnNaV04wWldRdGRHOG5MQ0FuYVhNdGMyVnNaV04wWldRdFltVjBkMlZsYmljcE8xeHlYRzRnSUNBZ0lDQWdJSDBwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHFLbHh5WEc0Z0lDQWdJQ29nMEpMUXVOQzMwWVBRc05DNzBZelF2ZEMrMExVZzBMTFJpOUMwMExYUXU5QzEwTDNRdU5DMUlOQzAwTERSZ2x4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0RVlYUmxmU0JrWVhSbFgyWnliMjBnMEozUXNOR0gwTERRdTlHTTBMM1FzTkdQSU5DMDBMRFJndEN3WEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTBSaGRHVjlJR1JoZEdWZmRHOGdJQ0RRbXRDKzBMM1F0ZEdIMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVgzSmhibWRsVm1semRXRnNVMlZzWldOMElEMGdablZ1WTNScGIyNG9aR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLR1JoZEdWZlpuSnZiU0FtSmlCa1lYUmxYMlp5YjIwZ2FXNXpkR0Z1WTJWdlppQkVZWFJsS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGRHVmZabkp2YlM1elpYUkliM1Z5Y3lnd0xDQXdMQ0F3TENBd0tUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJR2xtSUNoa1lYUmxYM1J2SUNZbUlHUmhkR1ZmZEc4Z2FXNXpkR0Z1WTJWdlppQkVZWFJsS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdSaGRHVmZkRzh1YzJWMFNHOTFjbk1vTUN3Z01Dd2dNQ3dnTUNrN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURRc3RHTDBMSFF2dEdBSU5DMDBMRFJnaURRc2lEUXZ0Q3gwWURRc05HQzBMM1F2dEM4SU5DLzBMN1JnTkdQMExUUXV0QzFYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tHUmhkR1ZmWm5KdmJTQStJR1JoZEdWZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdXMlJoZEdWZlpuSnZiU3dnWkdGMFpWOTBiMTBnUFNCYlpHRjBaVjkwYnl3Z1pHRjBaVjltY205dFhUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJR052Ym5OMElIUnBiV1ZmWm5KdmJTQTlJR1JoZEdWZlpuSnZiU0JwYm5OMFlXNWpaVzltSUVSaGRHVWdQeUJrWVhSbFgyWnliMjB1WjJWMFZHbHRaU2dwSURvZ01EdGNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQjBhVzFsWDNSdklEMGdaR0YwWlY5MGJ5QnBibk4wWVc1alpXOW1JRVJoZEdVZ1B5QmtZWFJsWDNSdkxtZGxkRlJwYldVb0tTQTZJREE3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnSkdSaGVYTWdQU0IwYUdsekxsOGtiVzl1ZEdoekxuRjFaWEo1VTJWc1pXTjBiM0pCYkd3b0p5NUVZWGxiWkdGMFlTMTBhVzFsWFNjcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5RFFzdEdMMExUUXRkQzcwTFhRdmRDNDBMVWcwTFRRc05HQ0lOQzgwTFhRdHRDMDBZTWcwTDNRc05HSDBMRFF1OUdNMEwzUXZ0QzVJTkM0SU5DNjBMN1F2ZEMxMFlmUXZkQyswTGxjY2x4dUlDQWdJQ0FnSUNCbWIzSWdLR3hsZENCcElEMGdNRHNnYVNBOElDUmtZWGx6TG14bGJtZDBhRHNnS3l0cEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDUmtZWGx6VzJsZExtTnNZWE56VEdsemRDNTBiMmRuYkdVb0oybHpMWE5sYkdWamRHVmtMV0psZEhkbFpXNG5MQ0FrWkdGNWMxdHBYUzVrWVhSaGMyVjBMblJwYldVZ1BpQjBhVzFsWDJaeWIyMGdKaVlnSkdSaGVYTmJhVjB1WkdGMFlYTmxkQzUwYVcxbElEd2dkR2x0WlY5MGJ5azdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0F2THlEUXN0R0wwTFRRdGRDNzBMWFF2ZEM0MExVZzBMM1FzTkdIMExEUXU5R00wTDNRdnRDNUlOQzRJTkM2MEw3UXZkQzEwWWZRdmRDKzBMa2cwTC9RdnRDMzBMalJodEM0MExoY2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENBa1pHRjVYMlp5YjIwZ1BTQjBhR2x6TGw4a1oyVjBSR0Y1UW5sRVlYUmxLR1JoZEdWZlpuSnZiU2s3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnSkdSaGVWOTBieUE5SUhSb2FYTXVYeVJuWlhSRVlYbENlVVJoZEdVb1pHRjBaVjkwYnlrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOQzYwTFhSaUNEUXROQzcwWThnMExIUmk5R0IwWUxSZ05DKzBMUFF2aURSZ2RDeDBZRFF2dEdCMExBZzBZSFJndEN3MFlEUXZ0Q3owTDRnMExMUmk5QzAwTFhRdTlDMTBMM1F1TkdQWEhKY2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdVgzSmhibWRsVm1semRXRnNVMlZzWldOMExpUmtZWGxmWm5KdmJWOXZiR1FnSmlZZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1F1SkdSaGVWOW1jbTl0WDI5c1pDQWhQU0FrWkdGNVgyWnliMjBwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUXVKR1JoZVY5bWNtOXRYMjlzWkM1amJHRnpjMHhwYzNRdWNtVnRiM1psS0NkcGN5MXpaV3hsWTNSbFpDY3NJQ2RwY3kxelpXeGxZM1JsWkMxbWNtOXRKeWs3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5RFF1dEMxMFlnZzBMVFF1OUdQSU5DeDBZdlJnZEdDMFlEUXZ0Q3owTDRnMFlIUXNkR0EwTDdSZ2RDd0lOR0IwWUxRc05HQTBMN1FzOUMrSU5DeTBZdlF0TkMxMEx2UXRkQzkwTGpSajF4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxsOXlZVzVuWlZacGMzVmhiRk5sYkdWamRDNGtaR0Y1WDNSdlgyOXNaQ0FtSmlCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQzRrWkdGNVgzUnZYMjlzWkNBaFBTQWtaR0Y1WDNSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wTGlSa1lYbGZkRzlmYjJ4a0xtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb0oybHpMWE5sYkdWamRHVmtKeXdnSjJsekxYTmxiR1ZqZEdWa0xYUnZKeWs3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCcFppQW9KR1JoZVY5bWNtOXRLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ1JrWVhsZlpuSnZiUzVqYkdGemMweHBjM1F1WVdSa0tDZHBjeTF6Wld4bFkzUmxaQ2NzSUNkcGN5MXpaV3hsWTNSbFpDMW1jbTl0SnlrN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvSkdSaGVWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FrWkdGNVgzUnZMbU5zWVhOelRHbHpkQzVoWkdRb0oybHpMWE5sYkdWamRHVmtKeXdnSjJsekxYTmxiR1ZqZEdWa0xYUnZKeWs3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5RFJnZEMrMFlYUmdOQ3cwTDNRdGRDOTBMalF0U0RRc2lEUXV0QzEwWWhjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQzRrWkdGNVgyWnliMjFmYjJ4a0lEMGdKR1JoZVY5bWNtOXRPMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBMaVJrWVhsZmRHOWZiMnhrSUQwZ0pHUmhlVjkwYnp0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZLaXBjY2x4dUlDQWdJQ0FxSU5DUzBZdlF0TkMxMEx2UXRkQzkwTGpRdFNEUXROQzQwTERRdjlDdzBMZlF2dEM5MExBZzBMVFFzTkdDWEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTBSaGRHVjlJR1JoZEdWZlpuSnZiU0RRbmRDdzBZZlFzTkM3MFl6UXZkQ3cwWThnMExUUXNOR0MwTEJjY2x4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3UkdGMFpYMGdaR0YwWlY5MGJ5QWdJTkNhMEw3UXZkQzEwWWZRdmRDdzBZOGcwTFRRc05HQzBMQmNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdkR2hwY3k1eVlXNW5aVk5sYkdWamRDQTlJR1oxYm1OMGFXOXVLR1JoZEdWZlpuSnZiU3dnWkdGMFpWOTBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lHUmhkR1ZmWm5KdmJTNXpaWFJJYjNWeWN5Z3dMQ0F3TENBd0xDQXdLVHRjY2x4dUlDQWdJQ0FnSUNCa1lYUmxYM1J2TG5ObGRFaHZkWEp6S0RBc0lEQXNJREFzSURBcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5RFF0TkMrMEwvUmc5R0IwWUxRdU5DODBZdlF1U0RRdE5DNDBMRFF2OUN3MExmUXZ0QzlYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tDRjBhR2x6TG1kbGRFbHpVbUZ1WjJWVFpXeGxZM1JoWW14bEtHUmhkR1ZmWm5KdmJTd2daR0YwWlY5MGJ5a3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdiR1YwSUNSa1lYbGZabkp2YlN3Z0pHUmhlVjkwYnp0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnTHk4ZzBMTFJpOUN4MEw3UmdDRFF0TkN3MFlJZzBMSWcwTDdRc2RHQTBMRFJndEM5MEw3UXZDRFF2OUMrMFlEUmo5QzAwTHJRdFZ4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2hrWVhSbFgyWnliMjBnUGlCa1lYUmxYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUZ0a1lYUmxYMlp5YjIwc0lHUmhkR1ZmZEc5ZElEMGdXMlJoZEdWZmRHOHNJR1JoZEdWZlpuSnZiVjA3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ1JrWVhsZlpuSnZiU0E5SUhSb2FYTXVYeVJuWlhSRVlYbENlVVJoZEdVb1pHRjBaVjltY205dEtUdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ0pHUmhlVjkwYnlBOUlIUm9hWE11WHlSblpYUkVZWGxDZVVSaGRHVW9aR0YwWlY5MGJ5azdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JwWmlBb0pHUmhlVjltY205dEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDUmtZWGxmWm5KdmJTNWpiR0Z6YzB4cGMzUXVZV1JrS0NkcGN5MXpaV3hsWTNSbFpDY3NJQ2RwY3kxelpXeGxZM1JsWkMxbWNtOXRKeWs3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCcFppQW9KR1JoZVY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWtaR0Y1WDNSdkxtTnNZWE56VEdsemRDNWhaR1FvSjJsekxYTmxiR1ZqZEdWa0p5d2dKMmx6TFhObGJHVmpkR1ZrTFhSdkp5azdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0F2THlEUXN0R0wwTFRRdGRDNzBMWFF2ZEM0MExVZzBZM1F1OUMxMEx6UXRkQzkwWUxRdnRDeVhISmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFRaV3hsWTNRb1pHRjBaVjltY205dExDQmtZWFJsWDNSdktUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0x5OGcwWUhRdnRDeDBZdlJndEM0MExWY2NseHVJQ0FnSUNBZ0lDQjBhR2x6TGw5allXeHNZbUZqYXlnbmNtRnVaMlZUWld4bFkzUW5MQ0JrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzhwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHFLbHh5WEc0Z0lDQWdJQ29nMEovUmdOQyswTExRdGRHQTBMclFzQ0RRc3RDKzBMZlF2TkMrMExiUXZkQyswWUhSZ3RDNElOQ3kwWXZRdE5DMTBMdlF0ZEM5MExqUmp5RFF0TkN3MFlKY2NseHVJQ0FnSUNBcUlFQndZWEpoYlNBZ2UwUmhkR1VnWkdGMFpWOW1jbTl0SU5DZDBMRFJoOUN3MEx2UmpOQzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUNCN1JHRjBaU0JrWVhSbFgzUnZJQ0FnMEpyUXZ0QzkwTFhSaDlDOTBMRFJqeURRdE5DdzBZTFFzRnh5WEc0Z0lDQWdJQ29nUUhKbGRIVnliaUI3UW05dmJHVmhibjFjY2x4dUlDQWdJQ0FxTDF4eVhHNGdJQ0FnZEdocGN5NW5aWFJKYzFKaGJtZGxVMlZzWldOMFlXSnNaU0E5SUdaMWJtTjBhVzl1S0dSaGRHVmZabkp2YlN3Z1pHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJR1JoZEdWZlpuSnZiUzV6WlhSSWIzVnljeWd3TENBd0xDQXdMQ0F3S1R0Y2NseHVJQ0FnSUNBZ0lDQmtZWFJsWDNSdkxuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvWkdGMFpWOW1jbTl0SUQ0Z1pHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCYlpHRjBaVjltY205dExDQmtZWFJsWDNSdlhTQTlJRnRrWVhSbFgzUnZMQ0JrWVhSbFgyWnliMjFkTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0x5OGcwTHpRdU5DOTBMalF2TkN3MEx2UmpOQzkwWXZRdVNEUXROQzQwTERRdjlDdzBMZlF2dEM5WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWkdsbVppQTlJRTFoZEdndVlXSnpLR1JoZEdWZlpuSnZiUzVuWlhSVWFXMWxLQ2tnTFNCa1lYUmxYM1J2TG1kbGRGUnBiV1VvS1NrZ0x5QXhNREF3SUM4Z09EWTBNREE3WEhKY2JpQWdJQ0FnSUNBZ2FXWWdLR1JwWm1ZZ1BDQjBhR2x6TG05d2RHbHZibk11YldsdVJHRjVjeWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hISmNiaUFnSUNBZ0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUNBZ0lDQXZMeURRdjlHQTBMN1FzdEMxMFlEUXV0Q3dJTkMvMEw3UXY5Q3cwTFRRc05DOTBMalJqeURRc2lEUXROQzQwTERRdjlDdzBMZlF2dEM5SU5DMzBMRFFzZEM3MEw3UXV0QzQwWURRdnRDeTBMRFF2ZEM5MFl2UmhTRFF0TkN3MFlKY2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENCa1lYa2dQU0J1WlhjZ1JHRjBaU2dwTzF4eVhHNGdJQ0FnSUNBZ0lHUmhlUzV6WlhSVWFXMWxLR1JoZEdWZlpuSnZiUzVuWlhSVWFXMWxLQ2twTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0IzYUdsc1pTQW9aR0Y1SUR3Z1pHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9kR2hwY3k1blpYUkVZWGxNYjJOclpXUW9aR0Y1S1NrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCa1lYa3VjMlYwUkdGMFpTaGtZWGt1WjJWMFJHRjBaU2dwSUNzZ01TazdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdkSEoxWlR0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZLaXBjY2x4dUlDQWdJQ0FxSU5DZjBZRFF2dEN5MExYUmdOQzYwTEFnMEwzUXNDRFF0TkMrMFlIUmd0R0QwTC9RdmRDKzBZSFJndEdNSU5DMDBMM1JqeURRdE5DNzBZOGcwTEhSZ05DKzBMM1F1Rnh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJQ0I3UkdGMFpYMGdaR0YwWlNEUWxOQ3cwWUxRc0Z4eVhHNGdJQ0FnSUNvZ1FISmxkSFZ5YmlCN1FtOXZiR1ZoYm4wZ0lDQjBjblZsSU5DMTBZSFF1OUM0SU5DMDBMN1JnZEdDMFlQUXY5QzEwTDFjY2x4dUlDQWdJQ0FxTDF4eVhHNGdJQ0FnZEdocGN5NW5aWFJFWVhsTWIyTnJaV1FnUFNCbWRXNWpkR2x2Ymloa1lYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ0x5OGcwTExSaTlDeDBMN1JnQ0RRdE5DdzBZSWcwTExRdmRDMUlOQzAwTDdSZ2RHQzBZUFF2OUM5MEw3UXM5QytJTkMwMExqUXNOQy8wTERRdDlDKzBMM1FzRnh5WEc0Z0lDQWdJQ0FnSUdsbUlDaGtZWFJsSUR3Z2RHaHBjeTV2Y0hScGIyNXpMbTFwYmtSaGRHVWdmSHdnWkdGMFpTQStJSFJvYVhNdWIzQjBhVzl1Y3k1dFlYaEVZWFJsS1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJNVDBOTFgxVk9RVlpCU1V4QlFreEZPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11YjNCMGFXOXVjeTVzYjJOclJHRjVjMFpwYkhSbGNpa2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTV2Y0hScGIyNXpMbXh2WTJ0RVlYbHpSbWxzZEdWeUtHUmhkR1VwTzF4eVhHNGdJQ0FnSUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwSzNRdTlDMTBMelF0ZEM5MFlJZzBMclFzTkM3MExYUXZkQzAwTERSZ05DOTBMN1FzOUMrSU5DMDBMM1JqMXh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJQ0I3UkdGMFpYMGdaR0YwWlNEUWxOQ3cwWUxRc0Z4eVhHNGdJQ0FnSUNvZ1FISmxkSFZ5YmlCN1JXeGxiV1Z1ZEgwZ0lDQklWRTFNSU5HTjBMdlF0ZEM4MExYUXZkR0NYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVh5Um5aWFJFWVhsQ2VVUmhkR1VnUFNCbWRXNWpkR2x2Ymloa1lYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnZEdsdFpTQTlJR1JoZEdVZ2FXNXpkR0Z1WTJWdlppQkVZWFJsSUQ4Z1pHRjBaUzVuWlhSVWFXMWxLQ2tnT2lBd08xeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TGw4a2JXOXVkR2h6TG5GMVpYSjVVMlZzWldOMGIzSW9KeTVFWVhsYlpHRjBZUzEwYVcxbFBWd2lKeUFySUhScGJXVWdLeUFuWENKZEp5azdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRFFvTkMxMEwzUXROQzEwWUFnMExUUXZkR1BJQzBnMExmUXNOQ3owTHZSZzlHSTBMclF1Rnh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJQ0I3UkdGMFpYMGdaR0YwWlNEUW50Q3gwWXJRdGRDNjBZSWcwTFRRc05HQzBZdGNjbHh1SUNBZ0lDQXFJRUJ5WlhSMWNtNGdlMFZzWlcxbGJuUjlYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVh5UmpjbVZoZEdWRmJYQjBlVVJoZVNBOUlHWjFibU4wYVc5dUtDa2dlMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJQ1JrWVhrZ1BTQjBhR2x6TGw4a1kzSmxZWFJsUld4bGJXVnVkQ2hjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdZRHhrYVhZZ1kyeGhjM005WENKRVlYa2dhWE10Wlcxd2RIbGNJajQ4TDJScGRqNWdYSEpjYmlBZ0lDQWdJQ0FnS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJQ1JrWVhrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUW9kQyswTGZRdE5DdzBMM1F1TkMxSU5HTjBMdlF0ZEM4MExYUXZkR0MwTEFnMExqUXR5QklWRTFNSU5HQzBMWFF1dEdCMFlMUXNGeHlYRzRnSUNBZ0lDb2dRSEJoY21GdElDQjdVM1J5YVc1bmZTQm9kRzFzSUVoVVRVd2cwWUxRdGRDNjBZSFJnbHh5WEc0Z0lDQWdJQ29nUUhKbGRIVnliaUI3Uld4bGJXVnVkSDFjY2x4dUlDQWdJQ0FxTDF4eVhHNGdJQ0FnZEdocGN5NWZKR055WldGMFpVVnNaVzFsYm5RZ1BTQm1kVzVqZEdsdmJpaG9kRzFzS1NCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1pHbDJJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDZ25aR2wySnlrN1hISmNiaUFnSUNBZ0lDQWdaR2wyTG1sdWMyVnlkRUZrYW1GalpXNTBTRlJOVENnbllXWjBaWEppWldkcGJpY3NJR2gwYld3cE8xeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQmthWFl1WTJocGJHUnlaVzR1YkdWdVozUm9JRDRnTVNBL0lHUnBkaTVqYUdsc1pISmxiaUE2SUdScGRpNW1hWEp6ZEVWc1pXMWxiblJEYUdsc1pEdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlGTmhabVVnMExMUmk5QzMwTDdRc2lEUXN0QzkwTFhSaU5DOTBMalJoU0RSZ2RDKzBMSFJpOUdDMExqUXVTRFF1dEMrMEx6UXY5QyswTDNRdGRDOTBZTFFzRnh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJSHRUZEhKcGJtZDlJR1lnMEpqUXZOR1BJTkdCMEw3UXNkR0wwWUxRdU5HUFhISmNiaUFnSUNBZ0tpOWNjbHh1SUNBZ0lIUm9hWE11WDJOaGJHeGlZV05ySUQwZ1puVnVZM1JwYjI0b1ppa2dlMXh5WEc0Z0lDQWdJQ0FnSUdsbUlDaDBlWEJsYjJZZ2RHaHBjeTV2Y0hScGIyNXpMbTl1VzJaZElEMDlJQ2RtZFc1amRHbHZiaWNwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWIzQjBhVzl1Y3k1dmJsdG1YUzVoY0hCc2VTaDBhR2x6TENCYlhTNXpiR2xqWlM1allXeHNLR0Z5WjNWdFpXNTBjeXdnTVNrcE8xeHlYRzRnSUNBZ0lDQWdJSDFjY2x4dVhISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdU8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJSFJvYVhNdWFXNXBkQ2dwTzF4eVhHNTlYSEpjYmx4eVhHNWxlSEJ2Y25RZ1pHVm1ZWFZzZENCRVlYUmxVbUZ1WjJWUWFXTnJaWEk3WEhKY2JpSmRMQ0p6YjNWeVkyVlNiMjkwSWpvaUluMD0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IERhdGVSYW5nZVBpY2tlciBmcm9tICcuLi8uLi9kaXN0L2RhdGVyYW5nZXBpY2tlcic7XHJcbmltcG9ydCB7TE9DS19VTkFWQUlMQUJMRSwgTE9DS19MT0NLRUR9IGZyb20gJy4uLy4uL2Rpc3QvZGF0ZXJhbmdlcGlja2VyJztcclxuXHJcbmNvbnN0ICRmb3JtID0gZG9jdW1lbnQuZm9ybXNbMF07XHJcbmNvbnN0ICRkYXRlX2Zyb20gPSAkZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImRhdGVfZnJvbVwiXScpO1xyXG5jb25zdCAkZGF0ZV90byAgID0gJGZvcm0ucXVlcnlTZWxlY3RvcignW25hbWU9XCJkYXRlX3RvXCJdJyk7XHJcblxyXG5mdW5jdGlvbiBpc01vYmlsZSgpIHtcclxuICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aCA8PSA5NjA7XHJcbn1cclxuXHJcbi8vINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvQtSDQtNCw0YLRi1xyXG5jb25zdCBibG9ja2VkRGF0ZXMgPSB7fTtcclxuY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbmRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbmZvciAobGV0IGkgPSAwOyBpIDwgNjA7ICsraSkge1xyXG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjYpIHtcclxuICAgICAgICBibG9ja2VkRGF0ZXNbZGF0ZV0gPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7XHJcbn1cclxuXHJcbm5ldyBEYXRlUmFuZ2VQaWNrZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2RhdGVyYW5nZXBpY2tlcicpLCB7XHJcbiAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpLFxyXG4gICAgbWF4RGF0ZTogbmV3IERhdGUoJzIwMjItMDUtMjAnKSxcclxuICAgIG1vbnRoc0NvdW50OiBpc01vYmlsZSgpID8gMTIgOiAyLFxyXG4gICAgcGVyUm93OiAzLFxyXG4gICAgc2luZ2xlTW9kZTogZmFsc2UsXHJcbiAgICBvbjoge1xyXG4gICAgICAgIHJhbmdlU2VsZWN0OiBmdW5jdGlvbihkYXRlX2Zyb20sIGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgJGRhdGVfZnJvbS52YWx1ZSA9IGRhdGVfZnJvbS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICAgICAgJGRhdGVfdG8udmFsdWUgPSBkYXRlX3RvLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGF5U2VsZWN0OiBmdW5jdGlvbihkYXRlX2Zyb20pIHtcclxuICAgICAgICAgICAgJGRhdGVfZnJvbS52YWx1ZSA9IGRhdGVfZnJvbS50b0xvY2FsZURhdGVTdHJpbmcoKTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIGxvY2tEYXlzRmlsdGVyOiBmdW5jdGlvbihkYXkpIHtcclxuICAgICAgICBpZiAoYmxvY2tlZERhdGVzW2RheV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIExPQ0tfTE9DS0VEO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==