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
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function DateRangePicker($container, options = {}) {
    this._$container = $container;

    this.options = {
        firstDayOfTheWeek: options.firstDayOfTheWeek || 1,       // первый день недели, 0 = вс, 1 = пн, ...
        monthsCount:       options.monthsCount       || 12,      // количество отображаемых месяцев
        singleMode:        options.singleMode        || false,   // выбор одной даты вместо диапазона
        locale:            options.locale            || 'ru-RU',
        on: Object.assign({
            rangeSelect: null, // событие выбора диапазона дат
            daySelect: null,   // событие выбора одной даты (только при singleMode: true)
        }, options.on || {}),
    }

    this.init = function() {
        this._$picker = this._$createElement(
            `<div class="Daterangepicker">
                <div class="Daterangepicker__months"></div>
            </div>`
        );

        // элементы
        this._$months = this._$picker.querySelector('.Daterangepicker__months');

        const currentDate = new Date();
        for (let i = 0; i < this.options.monthsCount; ++i) {
            this._$months.appendChild(this._$createMonth(currentDate));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // события

        // рендер
        this._$container.appendChild(this._$picker);

        // инициализация состояний
        this.rangeReset();
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

    this._$createMonth = function(date) {
        const currentMonth = date.getMonth();
        const monthTitle = this.getMonthFormatted(date);
        const weekDays = this.getWeekDaysFormatted();

        const $month = this._$createElement(
            `<div class="Month">
                <div class="Month__title">${monthTitle}</div>
                <div class="Month__week">${weekDays.map(item => {
                    return `<div class="Month__weekday">${item.title}</div>`
                }).join('')}</div>
                <div class="Month__days"></div>
            </div>`
        );

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
        const $day = this._$createElement(
            `<div class="Day" data-time="${date.getTime()}" data-day="${date.getDay()}">${date.getDate()}</div>`
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
        if (!this._selection.$from || this._selection.$to) {
            return;
        }

        if ($day == this._selection.$from) {
            return;
        }

        const date_from = new Date(parseInt(this._selection.$from.dataset.time, 10));
        const date_to   = new Date(parseInt($day.dataset.time, 10));

        this._rangeVisualSelect(date_from, date_to);
    }

    /**
     * Клик по дню
     * @param {Element} $day HTML Элемент
     */
    this._onDayClick = function($day) {
        // выбор одной даты
        if (this.options.singleMode) {
            this.rangeReset();
            $day.classList.add('is-selected');
            this._callback('daySelect', new Date(parseInt($day.dataset.time, 10)));
            return;
        }

        if (this._selection.$from && this._selection.$to) {
            this.rangeReset();
        }

        $day.classList.add('is-selected');

        if (!this._selection.$from) {
            this._selection.$from = $day;
        } else if (!this._selection.$to) {
            this._selection.$to = $day;
        }

        if (this._selection.$from && this._selection.$to) {
            const date_from = new Date(parseInt(this._selection.$from.dataset.time, 10));
            const date_to   = new Date(parseInt(this._selection.$to.dataset.time, 10));
            this.rangeSelect(date_from, date_to);
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
        date_from.setHours(0, 0, 0, 0);
        date_to.setHours(0, 0, 0, 0);

        // выбор дат в обратном порядке
        if (date_from > date_to) {
            const swap = date_from;
            date_from = date_to;
            date_to = swap;
        }

        const time_from = date_from.getTime();
        const time_to = date_to.getTime();
        const $days = this._$months.querySelectorAll('.Day[data-time]');

        let selectedRemoved = false;
        for (let i = 0; i < $days.length; ++i) {
            const $day = $days[i];

            if ($day.dataset.time > time_from && $day.dataset.time < time_to) {
                $day.classList.add('is-selected-between');
            } else if ($day.classList.contains('is-selected-between')) {
                $day.classList.remove('is-selected-between');
                selectedRemoved = true;
            } else if (selectedRemoved) {
                break;
            }
        }

        // выделение стартовой и конечной позиции
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

        // выбор дат в обратном порядке
        if (date_from > date_to) {
            const swap = date_from;
            date_from = date_to;
            date_to = swap;
            this._selection.$from = this._$getDayByDate(date_from);
            this._selection.$to = this._$getDayByDate(date_to);
        }

        if (this._selection.$from) {
            this._selection.$from.classList.add('is-selected', 'is-selected-from');
        }

        if (this._selection.$to) {
            this._selection.$to.classList.add('is-selected', 'is-selected-to');
        }

        // выделение элементов
        this._rangeVisualSelect(date_from, date_to);

        // событие
        this._callback('rangeSelect', date_from, date_to);
    }

    /**
     * Элемент календарного дня
     * @param  {Date} date Дата
     * @return {Element}   HTML элемент
     */
    this._$getDayByDate = function(date) {
        return this._$months.querySelector('.Day[data-time="' + date.getTime() + '"]');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9zY3NzL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOztVQ1ZBO1VBQ0E7Ozs7O1dDREE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7OztBQ0FBLGlEQUFpRDtBQUNqRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxrQkFBa0I7QUFDM0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsOEJBQThCO0FBQ3JEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFF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QUFDQSxnQkFBZ0IsS0FBSztBQUNyQixnQkFBZ0IsUUFBUTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLEtBQUs7QUFDckIsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLE9BQU87QUFDdkIsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLGVBQWUsRUFBQyIsImZpbGUiOiJkYXRlcmFuZ2VwaWNrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkRhdGVyYW5nZXBpY2tlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJmdW5jdGlvbiBEYXRlUmFuZ2VQaWNrZXIoJGNvbnRhaW5lciwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICB0aGlzLl8kY29udGFpbmVyID0gJGNvbnRhaW5lcjtcclxuXHJcbiAgICB0aGlzLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgZmlyc3REYXlPZlRoZVdlZWs6IG9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgfHwgMSwgICAgICAgLy8g0L/QtdGA0LLRi9C5INC00LXQvdGMINC90LXQtNC10LvQuCwgMCA9INCy0YEsIDEgPSDQv9C9LCAuLi5cclxuICAgICAgICBtb250aHNDb3VudDogICAgICAgb3B0aW9ucy5tb250aHNDb3VudCAgICAgICB8fCAxMiwgICAgICAvLyDQutC+0LvQuNGH0LXRgdGC0LLQviDQvtGC0L7QsdGA0LDQttCw0LXQvNGL0YUg0LzQtdGB0Y/RhtC10LJcclxuICAgICAgICBzaW5nbGVNb2RlOiAgICAgICAgb3B0aW9ucy5zaW5nbGVNb2RlICAgICAgICB8fCBmYWxzZSwgICAvLyDQstGL0LHQvtGAINC+0LTQvdC+0Lkg0LTQsNGC0Ysg0LLQvNC10YHRgtC+INC00LjQsNC/0LDQt9C+0L3QsFxyXG4gICAgICAgIGxvY2FsZTogICAgICAgICAgICBvcHRpb25zLmxvY2FsZSAgICAgICAgICAgIHx8ICdydS1SVScsXHJcbiAgICAgICAgb246IE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICByYW5nZVNlbGVjdDogbnVsbCwgLy8g0YHQvtCx0YvRgtC40LUg0LLRi9Cx0L7RgNCwINC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICAgICAgICAgICAgZGF5U2VsZWN0OiBudWxsLCAgIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQvtC00L3QvtC5INC00LDRgtGLICjRgtC+0LvRjNC60L4g0L/RgNC4IHNpbmdsZU1vZGU6IHRydWUpXHJcbiAgICAgICAgfSwgb3B0aW9ucy5vbiB8fCB7fSksXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fJHBpY2tlciA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyDRjdC70LXQvNC10L3RgtGLXHJcbiAgICAgICAgdGhpcy5fJG1vbnRocyA9IHRoaXMuXyRwaWNrZXIucXVlcnlTZWxlY3RvcignLkRhdGVyYW5nZXBpY2tlcl9fbW9udGhzJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMub3B0aW9ucy5tb250aHNDb3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRtb250aHMuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZU1vbnRoKGN1cnJlbnREYXRlKSk7XHJcbiAgICAgICAgICAgIGN1cnJlbnREYXRlLnNldE1vbnRoKGN1cnJlbnREYXRlLmdldE1vbnRoKCkgKyAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGB0L7QsdGL0YLQuNGPXHJcblxyXG4gICAgICAgIC8vINGA0LXQvdC00LXRgFxyXG4gICAgICAgIHRoaXMuXyRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fJHBpY2tlcik7XHJcblxyXG4gICAgICAgIC8vINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0L7RgdGC0L7Rj9C90LjQuVxyXG4gICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J3QsNC30LLQsNC90LjQtSDQvNC10YHRj9GG0LBcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0TW9udGhGb3JtYXR0ZWQgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgdGl0bGUgPSB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHttb250aDogJ2xvbmcnfSk7XHJcbiAgICAgICAgcmV0dXJuIHRpdGxlLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCkgKyB0aXRsZS5zbGljZSgxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCk0L7RgNC80LDRgtC40YDQvtCy0LDQvdC40LUg0LTQsNGC0Ysg0LTQu9GPINGC0LXQutGD0YnQtdC5INC70L7QutCw0LvQuFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gICBkYXRlICAgINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBvcHRpb25zINCf0LDRgNCw0LzQtdGC0YDRi1xyXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldERhdGVUaW1lRm9ybWF0ID0gZnVuY3Rpb24oZGF0ZSwgb3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBJbnRsLkRhdGVUaW1lRm9ybWF0KHRoaXMub3B0aW9ucy5sb2NhbGUsIG9wdGlvbnMpLmZvcm1hdChkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0L3QuCDQvdC10LTQtdC70LhcclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXRXZWVrRGF5c0Zvcm1hdHRlZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG5cclxuICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgLSAyKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7ICsraSkge1xyXG4gICAgICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goe1xyXG4gICAgICAgICAgICAgICAgZGF5OiBkYXRlLmdldERheSgpLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6IHRoaXMuZ2V0RGF0ZVRpbWVGb3JtYXQoZGF0ZSwge3dlZWtkYXk6ICdzaG9ydCd9KSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDRgdC+0YDRgtC40YDQvtCy0LrQsCDRgdC+0LPQu9Cw0YHQvdC+INC90LDRgdGC0YDQvtC10L3QvdC+0LzRgyDQv9C10YDQstC+0LzRgyDQtNC90Y4g0L3QtdC00LXQu9C4XHJcbiAgICAgICAgcmVzdWx0LnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgZmlyc3REYXlPZlRoZVdlZWsgPSB0aGlzLm9wdGlvbnMuZmlyc3REYXlPZlRoZVdlZWsgJSA3O1xyXG4gICAgICAgICAgICBsZXQgZGF5QSA9IGEuZGF5O1xyXG4gICAgICAgICAgICBsZXQgZGF5QiA9IGIuZGF5O1xyXG5cclxuICAgICAgICAgICAgaWYgKGRheUEgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRheUIgPT0gZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF5QSA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgICAgICBkYXlBICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkYXlCIDwgZmlyc3REYXlPZlRoZVdlZWspIHtcclxuICAgICAgICAgICAgICAgIGRheUIgKz0gcmVzdWx0Lmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRheUEgLSBkYXlCO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10Lkg0LIg0LzQtdGB0Y/RhtC1XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7TnVtYmVyfSAgICDQmtC+0LvQuNGH0LXRgdGC0LLQviDQtNC90LXQuVxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldERheXNDb3VudEluTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIGRheXMuc2V0TW9udGgoZGF5cy5nZXRNb250aCgpICsgMSk7XHJcbiAgICAgICAgZGF5cy5zZXREYXRlKDApO1xyXG4gICAgICAgIHJldHVybiBkYXlzLmdldERhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl8kY3JlYXRlTW9udGggPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgY3VycmVudE1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xyXG4gICAgICAgIGNvbnN0IG1vbnRoVGl0bGUgPSB0aGlzLmdldE1vbnRoRm9ybWF0dGVkKGRhdGUpO1xyXG4gICAgICAgIGNvbnN0IHdlZWtEYXlzID0gdGhpcy5nZXRXZWVrRGF5c0Zvcm1hdHRlZCgpO1xyXG5cclxuICAgICAgICBjb25zdCAkbW9udGggPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJNb250aFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX190aXRsZVwiPiR7bW9udGhUaXRsZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla1wiPiR7d2Vla0RheXMubWFwKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgPGRpdiBjbGFzcz1cIk1vbnRoX193ZWVrZGF5XCI+JHtpdGVtLnRpdGxlfTwvZGl2PmBcclxuICAgICAgICAgICAgICAgIH0pLmpvaW4oJycpfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIk1vbnRoX19kYXlzXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCAkZGF5cyA9ICRtb250aC5xdWVyeVNlbGVjdG9yKCcuTW9udGhfX2RheXMnKTtcclxuICAgICAgICBjb25zdCBkYXlzID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGRheXMuc2V0RGF0ZSgxKTtcclxuICAgICAgICBkYXlzLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICB3aGlsZSAoZGF5cy5nZXRNb250aCgpID09IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgICAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVXZWVrKCk7XHJcblxyXG4gICAgICAgICAgICB3ZWVrRGF5cy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRheXMuZ2V0RGF5KCkgIT0gaXRlbS5kYXkgfHwgZGF5cy5nZXRNb250aCgpICE9IGN1cnJlbnRNb250aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVFbXB0eURheSgpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJHdlZWsuYXBwZW5kQ2hpbGQodGhpcy5fJGNyZWF0ZURheShkYXlzKSk7XHJcbiAgICAgICAgICAgICAgICBkYXlzLnNldERhdGUoZGF5cy5nZXREYXRlKCkgKyAxKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkZGF5cy5hcHBlbmRDaGlsZCgkd2Vlayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gJG1vbnRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC90LXQtNC10LvQuFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVXZWVrID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0ICR3ZWVrID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiV2Vla1wiPjwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gJHdlZWs7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10L3QtNC10YAg0LTQvdGPXHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7RWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZURheSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCAkZGF5ID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiRGF5XCIgZGF0YS10aW1lPVwiJHtkYXRlLmdldFRpbWUoKX1cIiBkYXRhLWRheT1cIiR7ZGF0ZS5nZXREYXkoKX1cIj4ke2RhdGUuZ2V0RGF0ZSgpfTwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25EYXlDbGlja0V2ZW50LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgICAgICRkYXkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50LmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRkYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtSDQutC70LjQutCwINC/0L4g0LTQvdGOXHJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheUNsaWNrRXZlbnQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgdGhpcy5fb25EYXlDbGljayhlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LHRi9GC0LjQtSDRhdC+0LLQtdGA0LBcclxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGUgRE9NINGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlckV2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHRoaXMuX29uRGF5TW91c2VFbnRlcihlLnRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpdC+0LLQtdGAINC90LAg0Y3Qu9C10LzQtdC90YLQtSDQtNC90Y9cclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5TW91c2VFbnRlciA9IGZ1bmN0aW9uKCRkYXkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3NlbGVjdGlvbi4kZnJvbSB8fCB0aGlzLl9zZWxlY3Rpb24uJHRvKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkZGF5ID09IHRoaXMuX3NlbGVjdGlvbi4kZnJvbSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCh0aGlzLl9zZWxlY3Rpb24uJGZyb20uZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgICAgIGNvbnN0IGRhdGVfdG8gICA9IG5ldyBEYXRlKHBhcnNlSW50KCRkYXkuZGF0YXNldC50aW1lLCAxMCkpO1xyXG5cclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdChkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQu9C40Log0L/QviDQtNC90Y5cclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gJGRheSBIVE1MINCt0LvQtdC80LXQvdGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX29uRGF5Q2xpY2sgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICAgICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaW5nbGVNb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmFuZ2VSZXNldCgpO1xyXG4gICAgICAgICAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbGxiYWNrKCdkYXlTZWxlY3QnLCBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uJGZyb20gJiYgdGhpcy5fc2VsZWN0aW9uLiR0bykge1xyXG4gICAgICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uJGZyb20pIHtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uLiRmcm9tID0gJGRheTtcclxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9zZWxlY3Rpb24uJHRvKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbi4kdG8gPSAkZGF5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbi4kZnJvbSAmJiB0aGlzLl9zZWxlY3Rpb24uJHRvKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGVfZnJvbSA9IG5ldyBEYXRlKHBhcnNlSW50KHRoaXMuX3NlbGVjdGlvbi4kZnJvbS5kYXRhc2V0LnRpbWUsIDEwKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGVfdG8gICA9IG5ldyBEYXRlKHBhcnNlSW50KHRoaXMuX3NlbGVjdGlvbi4kdG8uZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgICAgICAgICB0aGlzLnJhbmdlU2VsZWN0KGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5yYW5nZVJlc2V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxSZXNldCgpO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbiA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQuNC30YPQsNC70YzQvdGL0Lkg0YHQsdGA0L7RgSDQstGL0LTQtdC70LXQvdC90YvRhSDQtNCw0YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5fcmFuZ2VWaXN1YWxSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuICAgICAgICAkZGF5cy5mb3JFYWNoKCRkYXkgPT4ge1xyXG4gICAgICAgICAgICAkZGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nLCAnaXMtc2VsZWN0ZWQtdG8nLCAnaXMtc2VsZWN0ZWQtYmV0d2VlbicpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQuNC30YPQsNC70YzQvdC+0LUg0LLRi9C00LXQu9C10L3QuNC1INC00LDRglxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX2Zyb20g0J3QsNGH0LDQu9GM0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGVfdG8gICDQmtC+0L3QtdGH0L3QsNGPINC00LDRgtCwXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICAgICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LVcclxuICAgICAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgICAgICBjb25zdCBzd2FwID0gZGF0ZV9mcm9tO1xyXG4gICAgICAgICAgICBkYXRlX2Zyb20gPSBkYXRlX3RvO1xyXG4gICAgICAgICAgICBkYXRlX3RvID0gc3dhcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRpbWVfZnJvbSA9IGRhdGVfZnJvbS5nZXRUaW1lKCk7XHJcbiAgICAgICAgY29uc3QgdGltZV90byA9IGRhdGVfdG8uZ2V0VGltZSgpO1xyXG4gICAgICAgIGNvbnN0ICRkYXlzID0gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yQWxsKCcuRGF5W2RhdGEtdGltZV0nKTtcclxuXHJcbiAgICAgICAgbGV0IHNlbGVjdGVkUmVtb3ZlZCA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGRheXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgJGRheSA9ICRkYXlzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKCRkYXkuZGF0YXNldC50aW1lID4gdGltZV9mcm9tICYmICRkYXkuZGF0YXNldC50aW1lIDwgdGltZV90bykge1xyXG4gICAgICAgICAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZC1iZXR3ZWVuJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJGRheS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLXNlbGVjdGVkLWJldHdlZW4nKSkge1xyXG4gICAgICAgICAgICAgICAgJGRheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZC1iZXR3ZWVuJyk7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZFJlbW92ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkUmVtb3ZlZCkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDRgdGC0LDRgNGC0L7QstC+0Lkg0Lgg0LrQvtC90LXRh9C90L7QuSDQv9C+0LfQuNGG0LjQuFxyXG4gICAgICAgIGNvbnN0ICRkYXlfZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgICAgICBjb25zdCAkZGF5X3RvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuXHJcbiAgICAgICAgLy8g0LrQtdGIINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INGB0LHRgNC+0YHQsCDRgdGC0LDRgNC+0LPQviDQstGL0LTQtdC70LXQvdC40Y9cclxuICAgICAgICBpZiAodGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkICE9ICRkYXlfZnJvbSkge1xyXG4gICAgICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICAgICAgaWYgKHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkICYmIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkICE9ICRkYXlfdG8pIHtcclxuICAgICAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkZGF5X2Zyb20pIHtcclxuICAgICAgICAgICAgJGRheV9mcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkZGF5X3RvKSB7XHJcbiAgICAgICAgICAgICRkYXlfdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINGB0L7RhdGA0LDQvdC10L3QuNC1INCyINC60LXRiFxyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgPSAkZGF5X2Zyb207XHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV90b19vbGQgPSAkZGF5X3RvO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLRi9C00LXQu9C10L3QuNC1INC00LjQsNC/0LDQt9C+0L3QsCDQtNCw0YJcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICB0aGlzLnJhbmdlU2VsZWN0ID0gZnVuY3Rpb24oZGF0ZV9mcm9tLCBkYXRlX3RvKSB7XHJcbiAgICAgICAgZGF0ZV9mcm9tLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIGRhdGVfdG8uc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgICAgIC8vINCy0YvQsdC+0YAg0LTQsNGCINCyINC+0LHRgNCw0YLQvdC+0Lwg0L/QvtGA0Y/QtNC60LVcclxuICAgICAgICBpZiAoZGF0ZV9mcm9tID4gZGF0ZV90bykge1xyXG4gICAgICAgICAgICBjb25zdCBzd2FwID0gZGF0ZV9mcm9tO1xyXG4gICAgICAgICAgICBkYXRlX2Zyb20gPSBkYXRlX3RvO1xyXG4gICAgICAgICAgICBkYXRlX3RvID0gc3dhcDtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uLiRmcm9tID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX2Zyb20pO1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24uJHRvID0gdGhpcy5fJGdldERheUJ5RGF0ZShkYXRlX3RvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uJGZyb20pIHtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uLiRmcm9tLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLWZyb20nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uJHRvKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbi4kdG8uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnLCAnaXMtc2VsZWN0ZWQtdG8nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vINCy0YvQtNC10LvQtdC90LjQtSDRjdC70LXQvNC10L3RgtC+0LJcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdChkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG5cclxuICAgICAgICAvLyDRgdC+0LHRi9GC0LjQtVxyXG4gICAgICAgIHRoaXMuX2NhbGxiYWNrKCdyYW5nZVNlbGVjdCcsIGRhdGVfZnJvbSwgZGF0ZV90byk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQrdC70LXQvNC10L3RgiDQutCw0LvQtdC90LTQsNGA0L3QvtCz0L4g0LTQvdGPXHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCU0LDRgtCwXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fSAgIEhUTUwg0Y3Qu9C10LzQtdC90YJcclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGdldERheUJ5RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fJG1vbnRocy5xdWVyeVNlbGVjdG9yKCcuRGF5W2RhdGEtdGltZT1cIicgKyBkYXRlLmdldFRpbWUoKSArICdcIl0nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQvdC00LXRgCDQtNC90Y8gLSDQt9Cw0LPQu9GD0YjQutC4XHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7RWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZUVtcHR5RGF5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3QgJGRheSA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRheSBpcy1lbXB0eVwiPjwvZGl2PmBcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gJGRheTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7Qt9C00LDQvdC40LUg0Y3Qu9C10LzQtdC90YLQsCDQuNC3IEhUTUwg0YLQtdC60YHRgtCwXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGh0bWwgSFRNTCDRgtC10LrRgdGCXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKGh0bWwpIHtcclxuICAgICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXYuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgaHRtbCk7XHJcbiAgICAgICAgcmV0dXJuIGRpdi5jaGlsZHJlbi5sZW5ndGggPiAxID8gZGl2LmNoaWxkcmVuIDogZGl2LmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2FmZSDQstGL0LfQvtCyINCy0L3QtdGI0L3QuNGFINGB0L7QsdGL0YLQuNC5INC60L7QvNC/0L7QvdC10L3RgtCwXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZiDQmNC80Y8g0YHQvtCx0YvRgtC40Y9cclxuICAgICAqL1xyXG4gICAgdGhpcy5fY2FsbGJhY2sgPSBmdW5jdGlvbihmKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMub25bZl0gPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLm9uW2ZdLmFwcGx5KHRoaXMsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERhdGVSYW5nZVBpY2tlcjtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==

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
const $date_from = $form.querySelector('[name="date_from"]')
const $date_to   = $form.querySelector('[name="date_to"]')

new (_dist_daterangepicker__WEBPACK_IMPORTED_MODULE_0___default())(document.querySelector('#daterangepicker'), {
    on: {
        rangeSelect: function(date_from, date_to) {
            $date_from.value = date_from.toLocaleDateString();
            $date_to.value = date_to.toLocaleDateString();
        },
        daySelect: function(date_from) {
            console.log("date_from", date_from);

        },
    }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvLi9kaXN0L2RhdGVyYW5nZXBpY2tlci5qcyIsIndlYnBhY2s6Ly9kYXRlcmFuZ2VwaWNrZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGF0ZXJhbmdlcGlja2VyLy4vc3JjL2RlbW8vcGFnZS5zY3NzIiwid2VicGFjazovL2RhdGVyYW5nZXBpY2tlci8uL3NyYy9kZW1vL3BhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQSxJQUFJLElBQXlEO0FBQzdEO0FBQ0EsTUFBTSxFQUtnQztBQUN0QyxDQUFDO0FBQ0Qsd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQSxjQUFjLDhCQUFtQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxnQkFBZ0IsOEJBQW1CLHdCQUF3Qiw4QkFBbUI7QUFDOUUsbURBQW1ELHlDQUF5QztBQUM1RjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyw4QkFBbUI7QUFDOUI7QUFDQSxpRUFBaUUsa0JBQWtCO0FBQ25GO0FBQ0EsMERBQTBELGNBQWM7QUFDeEU7QUFDQSxXQUFXO0FBQ1g7QUFD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LHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7OztBQ05BOzs7Ozs7Ozs7Ozs7O0FDQXlEOztBQUV6RDtBQUNBO0FBQ0E7O0FBRUEsSUFBSSw4REFBZTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBLFNBQVM7QUFDVDtBQUNBLENBQUMiLCJmaWxlIjoiLi9kZW1vL3BhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkRhdGVyYW5nZXBpY2tlclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJEYXRlcmFuZ2VwaWNrZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiRGF0ZXJhbmdlcGlja2VyXCJdID0gZmFjdG9yeSgpO1xufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gLyoqKioqKi8gKCgpID0+IHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHRcInVzZSBzdHJpY3RcIjtcbi8qKioqKiovIFx0Ly8gVGhlIHJlcXVpcmUgc2NvcGVcbi8qKioqKiovIFx0dmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcbi8qKioqKiovIFx0XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMgKi9cbi8qKioqKiovIFx0KCgpID0+IHtcbi8qKioqKiovIFx0XHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcbi8qKioqKiovIFx0XHRcdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcbi8qKioqKiovIFx0XHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0pKCk7XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHQvKiB3ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kICovXG4vKioqKioqLyBcdCgoKSA9PiB7XG4vKioqKioqLyBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKVxuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCAqL1xuLyoqKioqKi8gXHQoKCkgPT4ge1xuLyoqKioqKi8gXHRcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbi8qKioqKiovIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuLyoqKioqKi8gXHRcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4vKioqKioqLyBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKioqKiovIFx0XHR9O1xuLyoqKioqKi8gXHR9KSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuLy8gVGhpcyBlbnRyeSBuZWVkIHRvIGJlIHdyYXBwZWQgaW4gYW4gSUlGRSBiZWNhdXNlIGl0IG5lZWQgdG8gYmUgaXNvbGF0ZWQgYWdhaW5zdCBvdGhlciBlbnRyeSBtb2R1bGVzLlxuKCgpID0+IHtcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiEqXFxcbiAgISoqKiAuL3NyYy9zY3NzL2luZGV4LnNjc3MgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5cbn0pKCk7XG5cbi8vIFRoaXMgZW50cnkgbmVlZCB0byBiZSB3cmFwcGVkIGluIGFuIElJRkUgYmVjYXVzZSBpdCBuZWVkIHRvIGJlIGlzb2xhdGVkIGFnYWluc3Qgb3RoZXIgZW50cnkgbW9kdWxlcy5cbigoKSA9PiB7XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vc3JjL2pzL2luZGV4LmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqL1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yKF9fd2VicGFja19leHBvcnRzX18pO1xuLyogaGFybW9ueSBleHBvcnQgKi8gX193ZWJwYWNrX3JlcXVpcmVfXy5kKF9fd2VicGFja19leHBvcnRzX18sIHtcbi8qIGhhcm1vbnkgZXhwb3J0ICovICAgXCJkZWZhdWx0XCI6ICgpID0+IChfX1dFQlBBQ0tfREVGQVVMVF9FWFBPUlRfXylcbi8qIGhhcm1vbnkgZXhwb3J0ICovIH0pO1xuZnVuY3Rpb24gRGF0ZVJhbmdlUGlja2VyKCRjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgdGhpcy5fJGNvbnRhaW5lciA9ICRjb250YWluZXI7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zID0ge1xyXG4gICAgICAgIGZpcnN0RGF5T2ZUaGVXZWVrOiBvcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrIHx8IDEsICAgICAgIC8vINC/0LXRgNCy0YvQuSDQtNC10L3RjCDQvdC10LTQtdC70LgsIDAgPSDQstGBLCAxID0g0L/QvSwgLi4uXHJcbiAgICAgICAgbW9udGhzQ291bnQ6ICAgICAgIG9wdGlvbnMubW9udGhzQ291bnQgICAgICAgfHwgMTIsICAgICAgLy8g0LrQvtC70LjRh9C10YHRgtCy0L4g0L7RgtC+0LHRgNCw0LbQsNC10LzRi9GFINC80LXRgdGP0YbQtdCyXHJcbiAgICAgICAgc2luZ2xlTW9kZTogICAgICAgIG9wdGlvbnMuc2luZ2xlTW9kZSAgICAgICAgfHwgZmFsc2UsICAgLy8g0LLRi9Cx0L7RgCDQvtC00L3QvtC5INC00LDRgtGLINCy0LzQtdGB0YLQviDQtNC40LDQv9Cw0LfQvtC90LBcclxuICAgICAgICBsb2NhbGU6ICAgICAgICAgICAgb3B0aW9ucy5sb2NhbGUgICAgICAgICAgICB8fCAncnUtUlUnLFxyXG4gICAgICAgIG9uOiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgcmFuZ2VTZWxlY3Q6IG51bGwsIC8vINGB0L7QsdGL0YLQuNC1INCy0YvQsdC+0YDQsCDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAgICAgICAgICAgIGRheVNlbGVjdDogbnVsbCwgICAvLyDRgdC+0LHRi9GC0LjQtSDQstGL0LHQvtGA0LAg0L7QtNC90L7QuSDQtNCw0YLRiyAo0YLQvtC70YzQutC+INC/0YDQuCBzaW5nbGVNb2RlOiB0cnVlKVxyXG4gICAgICAgIH0sIG9wdGlvbnMub24gfHwge30pLFxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuXyRwaWNrZXIgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJEYXRlcmFuZ2VwaWNrZXJfX21vbnRoc1wiPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8g0Y3Qu9C10LzQtdC90YLRi1xyXG4gICAgICAgIHRoaXMuXyRtb250aHMgPSB0aGlzLl8kcGlja2VyLnF1ZXJ5U2VsZWN0b3IoJy5EYXRlcmFuZ2VwaWNrZXJfX21vbnRocycpO1xyXG5cclxuICAgICAgICBjb25zdCBjdXJyZW50RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMubW9udGhzQ291bnQ7ICsraSkge1xyXG4gICAgICAgICAgICB0aGlzLl8kbW9udGhzLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVNb250aChjdXJyZW50RGF0ZSkpO1xyXG4gICAgICAgICAgICBjdXJyZW50RGF0ZS5zZXRNb250aChjdXJyZW50RGF0ZS5nZXRNb250aCgpICsgMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDRgdC+0LHRi9GC0LjRj1xyXG5cclxuICAgICAgICAvLyDRgNC10L3QtNC10YBcclxuICAgICAgICB0aGlzLl8kY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuXyRwaWNrZXIpO1xyXG5cclxuICAgICAgICAvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdC+0YHRgtC+0Y/QvdC40LlcclxuICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCd0LDQt9Cy0LDQvdC40LUg0LzQtdGB0Y/RhtCwXHJcbiAgICAgKiBAcGFyYW0gIHtEYXRlfSBkYXRlINCe0LHRitC10LrRgiDQtNCw0YLRi1xyXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICovXHJcbiAgICB0aGlzLmdldE1vbnRoRm9ybWF0dGVkID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHRpdGxlID0gdGhpcy5nZXREYXRlVGltZUZvcm1hdChkYXRlLCB7bW9udGg6ICdsb25nJ30pO1xyXG4gICAgICAgIHJldHVybiB0aXRsZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpICsgdGl0bGUuc2xpY2UoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQpNC+0YDQvNCw0YLQuNGA0L7QstCw0L3QuNC1INC00LDRgtGLINC00LvRjyDRgtC10LrRg9GJ0LXQuSDQu9C+0LrQsNC70LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9ICAgZGF0ZSAgICDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEBwYXJhbSAge09iamVjdH0gb3B0aW9ucyDQn9Cw0YDQsNC80LXRgtGA0YtcclxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXREYXRlVGltZUZvcm1hdCA9IGZ1bmN0aW9uKGRhdGUsIG9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gSW50bC5EYXRlVGltZUZvcm1hdCh0aGlzLm9wdGlvbnMubG9jYWxlLCBvcHRpb25zKS5mb3JtYXQoZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC90Lgg0L3QtdC00LXQu9C4XHJcbiAgICAgKi9cclxuICAgIHRoaXMuZ2V0V2Vla0RheXNGb3JtYXR0ZWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpIC0gMik7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyArK2kpIHtcclxuICAgICAgICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGRheTogZGF0ZS5nZXREYXkoKSxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiB0aGlzLmdldERhdGVUaW1lRm9ybWF0KGRhdGUsIHt3ZWVrZGF5OiAnc2hvcnQnfSksXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g0YHQvtGA0YLQuNGA0L7QstC60LAg0YHQvtCz0LvQsNGB0L3QviDQvdCw0YHRgtGA0L7QtdC90L3QvtC80YMg0L/QtdGA0LLQvtC80YMg0LTQvdGOINC90LXQtNC10LvQuFxyXG4gICAgICAgIHJlc3VsdC5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0RGF5T2ZUaGVXZWVrID0gdGhpcy5vcHRpb25zLmZpcnN0RGF5T2ZUaGVXZWVrICUgNztcclxuICAgICAgICAgICAgbGV0IGRheUEgPSBhLmRheTtcclxuICAgICAgICAgICAgbGV0IGRheUIgPSBiLmRheTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXlBID09IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkYXlCID09IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGRheUEgPCBmaXJzdERheU9mVGhlV2Vlaykge1xyXG4gICAgICAgICAgICAgICAgZGF5QSArPSByZXN1bHQubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF5QiA8IGZpcnN0RGF5T2ZUaGVXZWVrKSB7XHJcbiAgICAgICAgICAgICAgICBkYXlCICs9IHJlc3VsdC5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkYXlBIC0gZGF5QjtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0L7Qu9C40YfQtdGB0YLQstC+INC00L3QtdC5INCyINC80LXRgdGP0YbQtVxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEByZXR1cm4ge051bWJlcn0gICAg0JrQvtC70LjRh9C10YHRgtCy0L4g0LTQvdC10LlcclxuICAgICAqL1xyXG4gICAgdGhpcy5nZXREYXlzQ291bnRJbk1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGRheXMgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgICAgICBkYXlzLnNldE1vbnRoKGRheXMuZ2V0TW9udGgoKSArIDEpO1xyXG4gICAgICAgIGRheXMuc2V0RGF0ZSgwKTtcclxuICAgICAgICByZXR1cm4gZGF5cy5nZXREYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fJGNyZWF0ZU1vbnRoID0gZnVuY3Rpb24oZGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgICAgICBjb25zdCBtb250aFRpdGxlID0gdGhpcy5nZXRNb250aEZvcm1hdHRlZChkYXRlKTtcclxuICAgICAgICBjb25zdCB3ZWVrRGF5cyA9IHRoaXMuZ2V0V2Vla0RheXNGb3JtYXR0ZWQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgJG1vbnRoID0gdGhpcy5fJGNyZWF0ZUVsZW1lbnQoXHJcbiAgICAgICAgICAgIGA8ZGl2IGNsYXNzPVwiTW9udGhcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fdGl0bGVcIj4ke21vbnRoVGl0bGV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiTW9udGhfX3dlZWtcIj4ke3dlZWtEYXlzLm1hcChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCJNb250aF9fd2Vla2RheVwiPiR7aXRlbS50aXRsZX08L2Rpdj5gXHJcbiAgICAgICAgICAgICAgICB9KS5qb2luKCcnKX08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJNb250aF9fZGF5c1wiPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgJGRheXMgPSAkbW9udGgucXVlcnlTZWxlY3RvcignLk1vbnRoX19kYXlzJyk7XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpKTtcclxuICAgICAgICBkYXlzLnNldERhdGUoMSk7XHJcbiAgICAgICAgZGF5cy5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGRheXMuZ2V0TW9udGgoKSA9PSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgY29uc3QgJHdlZWsgPSB0aGlzLl8kY3JlYXRlV2VlaygpO1xyXG5cclxuICAgICAgICAgICAgd2Vla0RheXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXlzLmdldERheSgpICE9IGl0ZW0uZGF5IHx8IGRheXMuZ2V0TW9udGgoKSAhPSBjdXJyZW50TW9udGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkd2Vlay5hcHBlbmRDaGlsZCh0aGlzLl8kY3JlYXRlRW1wdHlEYXkoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICR3ZWVrLmFwcGVuZENoaWxkKHRoaXMuXyRjcmVhdGVEYXkoZGF5cykpO1xyXG4gICAgICAgICAgICAgICAgZGF5cy5zZXREYXRlKGRheXMuZ2V0RGF0ZSgpICsgMSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJGRheXMuYXBwZW5kQ2hpbGQoJHdlZWspO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRtb250aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LXQvdC00LXRgCDQvdC10LTQtdC70LhcclxuICAgICAqIEBwYXJhbSAge0RhdGV9IGRhdGUg0J7QsdGK0LXQutGCINC00LDRgtGLXHJcbiAgICAgKiBAcmV0dXJuIHtFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICB0aGlzLl8kY3JlYXRlV2VlayA9IGZ1bmN0aW9uKGRhdGUpIHtcclxuICAgICAgICBjb25zdCAkd2VlayA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgICAgICBgPGRpdiBjbGFzcz1cIldlZWtcIj48L2Rpdj5gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICR3ZWVrO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQtdC90LTQtdGAINC00L3Rj1xyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVEYXkgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgY29uc3QgJGRheSA9IHRoaXMuXyRjcmVhdGVFbGVtZW50KFxyXG4gICAgICAgICAgICBgPGRpdiBjbGFzcz1cIkRheVwiIGRhdGEtdGltZT1cIiR7ZGF0ZS5nZXRUaW1lKCl9XCIgZGF0YS1kYXk9XCIke2RhdGUuZ2V0RGF5KCl9XCI+JHtkYXRlLmdldERhdGUoKX08L2Rpdj5gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgJGRheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uRGF5Q2xpY2tFdmVudC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZSkge1xyXG4gICAgICAgICAgICAkZGF5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCB0aGlzLl9vbkRheU1vdXNlRW50ZXJFdmVudC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAkZGF5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtCx0YvRgtC40LUg0LrQu9C40LrQsCDQv9C+INC00L3RjlxyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZSBET00g0YHQvtCx0YvRgtC40LVcclxuICAgICAqL1xyXG4gICAgdGhpcy5fb25EYXlDbGlja0V2ZW50ID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIHRoaXMuX29uRGF5Q2xpY2soZS50YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtCx0YvRgtC40LUg0YXQvtCy0LXRgNCwXHJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIERPTSDRgdC+0LHRi9GC0LjQtVxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheU1vdXNlRW50ZXJFdmVudCA9IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICB0aGlzLl9vbkRheU1vdXNlRW50ZXIoZS50YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KXQvtCy0LXRgCDQvdCwINGN0LvQtdC80LXQvdGC0LUg0LTQvdGPXHJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheU1vdXNlRW50ZXIgPSBmdW5jdGlvbigkZGF5KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zZWxlY3Rpb24uJGZyb20gfHwgdGhpcy5fc2VsZWN0aW9uLiR0bykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGRheSA9PSB0aGlzLl9zZWxlY3Rpb24uJGZyb20pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZGF0ZV9mcm9tID0gbmV3IERhdGUocGFyc2VJbnQodGhpcy5fc2VsZWN0aW9uLiRmcm9tLmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgICAgICBjb25zdCBkYXRlX3RvICAgPSBuZXcgRGF0ZShwYXJzZUludCgkZGF5LmRhdGFzZXQudGltZSwgMTApKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QoZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCa0LvQuNC6INC/0L4g0LTQvdGOXHJcbiAgICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRkYXkgSFRNTCDQrdC70LXQvNC10L3RglxyXG4gICAgICovXHJcbiAgICB0aGlzLl9vbkRheUNsaWNrID0gZnVuY3Rpb24oJGRheSkge1xyXG4gICAgICAgIC8vINCy0YvQsdC+0YAg0L7QtNC90L7QuSDQtNCw0YLRi1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2luZ2xlTW9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLnJhbmdlUmVzZXQoKTtcclxuICAgICAgICAgICAgJGRheS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLl9jYWxsYmFjaygnZGF5U2VsZWN0JywgbmV3IERhdGUocGFyc2VJbnQoJGRheS5kYXRhc2V0LnRpbWUsIDEwKSkpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0aW9uLiRmcm9tICYmIHRoaXMuX3NlbGVjdGlvbi4kdG8pIHtcclxuICAgICAgICAgICAgdGhpcy5yYW5nZVJlc2V0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkZGF5LmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fc2VsZWN0aW9uLiRmcm9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbi4kZnJvbSA9ICRkYXk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fc2VsZWN0aW9uLiR0bykge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24uJHRvID0gJGRheTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb24uJGZyb20gJiYgdGhpcy5fc2VsZWN0aW9uLiR0bykge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlX2Zyb20gPSBuZXcgRGF0ZShwYXJzZUludCh0aGlzLl9zZWxlY3Rpb24uJGZyb20uZGF0YXNldC50aW1lLCAxMCkpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlX3RvICAgPSBuZXcgRGF0ZShwYXJzZUludCh0aGlzLl9zZWxlY3Rpb24uJHRvLmRhdGFzZXQudGltZSwgMTApKTtcclxuICAgICAgICAgICAgdGhpcy5yYW5nZVNlbGVjdChkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMucmFuZ2VSZXNldCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsUmVzZXQoKTtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb24gPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0LjQt9GD0LDQu9GM0L3Ri9C5INGB0LHRgNC+0YEg0LLRi9C00LXQu9C10L3QvdGL0YUg0LTQsNGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX3JhbmdlVmlzdWFsUmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcbiAgICAgICAgJGRheXMuZm9yRWFjaCgkZGF5ID0+IHtcclxuICAgICAgICAgICAgJGRheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJywgJ2lzLXNlbGVjdGVkLXRvJywgJ2lzLXNlbGVjdGVkLWJldHdlZW4nKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0LjQt9GD0LDQu9GM0L3QvtC1INCy0YvQtNC10LvQtdC90LjQtSDQtNCw0YJcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV9mcm9tINCd0LDRh9Cw0LvRjNC90LDRjyDQtNCw0YLQsFxyXG4gICAgICogQHBhcmFtIHtEYXRlfSBkYXRlX3RvICAg0JrQvtC90LXRh9C90LDRjyDQtNCw0YLQsFxyXG4gICAgICovXHJcbiAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1XHJcbiAgICAgICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgY29uc3Qgc3dhcCA9IGRhdGVfZnJvbTtcclxuICAgICAgICAgICAgZGF0ZV9mcm9tID0gZGF0ZV90bztcclxuICAgICAgICAgICAgZGF0ZV90byA9IHN3YXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0aW1lX2Zyb20gPSBkYXRlX2Zyb20uZ2V0VGltZSgpO1xyXG4gICAgICAgIGNvbnN0IHRpbWVfdG8gPSBkYXRlX3RvLmdldFRpbWUoKTtcclxuICAgICAgICBjb25zdCAkZGF5cyA9IHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvckFsbCgnLkRheVtkYXRhLXRpbWVdJyk7XHJcblxyXG4gICAgICAgIGxldCBzZWxlY3RlZFJlbW92ZWQgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8ICRkYXlzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRkYXkgPSAkZGF5c1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkZGF5LmRhdGFzZXQudGltZSA+IHRpbWVfZnJvbSAmJiAkZGF5LmRhdGFzZXQudGltZSA8IHRpbWVfdG8pIHtcclxuICAgICAgICAgICAgICAgICRkYXkuY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQtYmV0d2VlbicpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCRkYXkuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1zZWxlY3RlZC1iZXR3ZWVuJykpIHtcclxuICAgICAgICAgICAgICAgICRkYXkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2VsZWN0ZWQtYmV0d2VlbicpO1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRSZW1vdmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RlZFJlbW92ZWQpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0YHRgtCw0YDRgtC+0LLQvtC5INC4INC60L7QvdC10YfQvdC+0Lkg0L/QvtC30LjRhtC40LhcclxuICAgICAgICBjb25zdCAkZGF5X2Zyb20gPSB0aGlzLl8kZ2V0RGF5QnlEYXRlKGRhdGVfZnJvbSk7XHJcbiAgICAgICAgY29uc3QgJGRheV90byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcblxyXG4gICAgICAgIC8vINC60LXRiCDQtNC70Y8g0LHRi9GB0YLRgNC+0LPQviDRgdCx0YDQvtGB0LAg0YHRgtCw0YDQvtCz0L4g0LLRi9C00LXQu9C10L3QuNGPXHJcbiAgICAgICAgaWYgKHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfZnJvbV9vbGQgJiYgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZCAhPSAkZGF5X2Zyb20pIHtcclxuICAgICAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QuJGRheV9mcm9tX29sZC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQutC10Ygg0LTQu9GPINCx0YvRgdGC0YDQvtCz0L4g0YHQsdGA0L7RgdCwINGB0YLQsNGA0L7Qs9C+INCy0YvQtNC10LvQtdC90LjRj1xyXG4gICAgICAgIGlmICh0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAmJiB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X3RvX29sZCAhPSAkZGF5X3RvKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGRheV9mcm9tKSB7XHJcbiAgICAgICAgICAgICRkYXlfZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoJGRheV90bykge1xyXG4gICAgICAgICAgICAkZGF5X3RvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDRgdC+0YXRgNCw0L3QtdC90LjQtSDQsiDQutC10YhcclxuICAgICAgICB0aGlzLl9yYW5nZVZpc3VhbFNlbGVjdC4kZGF5X2Zyb21fb2xkID0gJGRheV9mcm9tO1xyXG4gICAgICAgIHRoaXMuX3JhbmdlVmlzdWFsU2VsZWN0LiRkYXlfdG9fb2xkID0gJGRheV90bztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0YvQtNC10LvQtdC90LjQtSDQtNC40LDQv9Cw0LfQvtC90LAg0LTQsNGCXHJcbiAgICAgKiBAcGFyYW0ge0RhdGV9IGRhdGVfZnJvbSDQndCw0YfQsNC70YzQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqIEBwYXJhbSB7RGF0ZX0gZGF0ZV90byAgINCa0L7QvdC10YfQvdCw0Y8g0LTQsNGC0LBcclxuICAgICAqL1xyXG4gICAgdGhpcy5yYW5nZVNlbGVjdCA9IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgIGRhdGVfZnJvbS5zZXRIb3VycygwLCAwLCAwLCAwKTtcclxuICAgICAgICBkYXRlX3RvLnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG5cclxuICAgICAgICAvLyDQstGL0LHQvtGAINC00LDRgiDQsiDQvtCx0YDQsNGC0L3QvtC8INC/0L7RgNGP0LTQutC1XHJcbiAgICAgICAgaWYgKGRhdGVfZnJvbSA+IGRhdGVfdG8pIHtcclxuICAgICAgICAgICAgY29uc3Qgc3dhcCA9IGRhdGVfZnJvbTtcclxuICAgICAgICAgICAgZGF0ZV9mcm9tID0gZGF0ZV90bztcclxuICAgICAgICAgICAgZGF0ZV90byA9IHN3YXA7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbi4kZnJvbSA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV9mcm9tKTtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0aW9uLiR0byA9IHRoaXMuXyRnZXREYXlCeURhdGUoZGF0ZV90byk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0aW9uLiRmcm9tKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGlvbi4kZnJvbS5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcsICdpcy1zZWxlY3RlZC1mcm9tJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VsZWN0aW9uLiR0bykge1xyXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3Rpb24uJHRvLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJywgJ2lzLXNlbGVjdGVkLXRvJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDQstGL0LTQtdC70LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQvtCyXHJcbiAgICAgICAgdGhpcy5fcmFuZ2VWaXN1YWxTZWxlY3QoZGF0ZV9mcm9tLCBkYXRlX3RvKTtcclxuXHJcbiAgICAgICAgLy8g0YHQvtCx0YvRgtC40LVcclxuICAgICAgICB0aGlzLl9jYWxsYmFjaygncmFuZ2VTZWxlY3QnLCBkYXRlX2Zyb20sIGRhdGVfdG8pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0K3Qu9C10LzQtdC90YIg0LrQsNC70LXQvdC00LDRgNC90L7Qs9C+INC00L3Rj1xyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQlNCw0YLQsFxyXG4gICAgICogQHJldHVybiB7RWxlbWVudH0gICBIVE1MINGN0LvQtdC80LXQvdGCXHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRnZXREYXlCeURhdGUgPSBmdW5jdGlvbihkYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuXyRtb250aHMucXVlcnlTZWxlY3RvcignLkRheVtkYXRhLXRpbWU9XCInICsgZGF0ZS5nZXRUaW1lKCkgKyAnXCJdJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10L3QtNC10YAg0LTQvdGPIC0g0LfQsNCz0LvRg9GI0LrQuFxyXG4gICAgICogQHBhcmFtICB7RGF0ZX0gZGF0ZSDQntCx0YrQtdC60YIg0LTQsNGC0YtcclxuICAgICAqIEByZXR1cm4ge0VsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIHRoaXMuXyRjcmVhdGVFbXB0eURheSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0ICRkYXkgPSB0aGlzLl8kY3JlYXRlRWxlbWVudChcclxuICAgICAgICAgICAgYDxkaXYgY2xhc3M9XCJEYXkgaXMtZW1wdHlcIj48L2Rpdj5gXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuICRkYXk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LfQtNCw0L3QuNC1INGN0LvQtdC80LXQvdGC0LAg0LjQtyBIVE1MINGC0LXQutGB0YLQsFxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBodG1sIEhUTUwg0YLQtdC60YHRglxyXG4gICAgICogQHJldHVybiB7RWxlbWVudH1cclxuICAgICAqL1xyXG4gICAgdGhpcy5fJGNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihodG1sKSB7XHJcbiAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGh0bWwpO1xyXG4gICAgICAgIHJldHVybiBkaXYuY2hpbGRyZW4ubGVuZ3RoID4gMSA/IGRpdi5jaGlsZHJlbiA6IGRpdi5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNhZmUg0LLRi9C30L7QsiDQstC90LXRiNC90LjRhSDRgdC+0LHRi9GC0LjQuSDQutC+0LzQv9C+0L3QtdC90YLQsFxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGYg0JjQvNGPINGB0L7QsdGL0YLQuNGPXHJcbiAgICAgKi9cclxuICAgIHRoaXMuX2NhbGxiYWNrID0gZnVuY3Rpb24oZikge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLm9uW2ZdID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5vbltmXS5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG4vKiBoYXJtb255IGRlZmF1bHQgZXhwb3J0ICovIGNvbnN0IF9fV0VCUEFDS19ERUZBVUxUX0VYUE9SVF9fID0gKERhdGVSYW5nZVBpY2tlcik7XHJcblxufSkoKTtcblxuLyoqKioqKi8gXHRyZXR1cm4gX193ZWJwYWNrX2V4cG9ydHNfXztcbi8qKioqKiovIH0pKClcbjtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW5kbFluQmhZMnM2THk5a1lYUmxjbUZ1WjJWd2FXTnJaWEl2ZDJWaWNHRmpheTkxYm1sMlpYSnpZV3hOYjJSMWJHVkVaV1pwYm1sMGFXOXVJaXdpZDJWaWNHRmphem92TDJSaGRHVnlZVzVuWlhCcFkydGxjaTkzWldKd1lXTnJMMkp2YjNSemRISmhjQ0lzSW5kbFluQmhZMnM2THk5a1lYUmxjbUZ1WjJWd2FXTnJaWEl2ZDJWaWNHRmpheTl5ZFc1MGFXMWxMMlJsWm1sdVpTQndjbTl3WlhKMGVTQm5aWFIwWlhKeklpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOTNaV0p3WVdOckwzSjFiblJwYldVdmFHRnpUM2R1VUhKdmNHVnlkSGtnYzJodmNuUm9ZVzVrSWl3aWQyVmljR0ZqYXpvdkwyUmhkR1Z5WVc1blpYQnBZMnRsY2k5M1pXSndZV05yTDNKMWJuUnBiV1V2YldGclpTQnVZVzFsYzNCaFkyVWdiMkpxWldOMElpd2lkMlZpY0dGamF6b3ZMMlJoZEdWeVlXNW5aWEJwWTJ0bGNpOHVMM055WXk5elkzTnpMMmx1WkdWNExuTmpjM01pTENKM1pXSndZV05yT2k4dlpHRjBaWEpoYm1kbGNHbGphMlZ5THk0dmMzSmpMMnB6TDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxFTkJRVU03UVVGRFJDeFBPenRWUTFaQk8xVkJRMEU3T3pzN08xZERSRUU3VjBGRFFUdFhRVU5CTzFkQlEwRTdWMEZEUVN4M1EwRkJkME1zZVVOQlFYbERPMWRCUTJwR08xZEJRMEU3VjBGRFFTeEZPenM3T3p0WFExQkJMSGRHT3pzN096dFhRMEZCTzFkQlEwRTdWMEZEUVR0WFFVTkJMSE5FUVVGelJDeHJRa0ZCYTBJN1YwRkRlRVU3VjBGRFFTd3JRMEZCSzBNc1kwRkJZenRYUVVNM1JDeEZPenM3T3pzN096czdPenM3UVVOT1FUczdPenM3T3pzN096czdPenRCUTBGQkxHbEVRVUZwUkR0QlFVTnFSRHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzVTBGQlV5eHJRa0ZCYTBJN1FVRkRNMEk3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdPMEZCUlVFN1FVRkRRU3gxUWtGQmRVSXNPRUpCUVRoQ08wRkJRM0pFTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHM3UVVGRlFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNaMEpCUVdkQ0xFdEJRVXM3UVVGRGNrSXNaMEpCUVdkQ08wRkJRMmhDTzBGQlEwRTdRVUZEUVN4dlJFRkJiMFFzWTBGQll6dEJRVU5zUlR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeG5Ra0ZCWjBJc1MwRkJTenRCUVVOeVFpeG5Ra0ZCWjBJc1QwRkJUenRCUVVOMlFpeG5Ra0ZCWjBJN1FVRkRhRUk3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFc2RVSkJRWFZDTEU5QlFVODdRVUZET1VJN1FVRkRRVHRCUVVOQk8wRkJRMEVzY1VSQlFYRkVMR2xDUVVGcFFqdEJRVU4wUlN4aFFVRmhPMEZCUTJJN08wRkJSVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFTeFRRVUZUT3p0QlFVVlVPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdkQ1FVRm5RaXhMUVVGTE8wRkJRM0pDTEdkQ1FVRm5RaXhQUVVGUE8wRkJRM1pDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTERSRFFVRTBReXhYUVVGWE8wRkJRM1pFTERKRFFVRXlRenRCUVVNelF5d3dSRUZCTUVRc1YwRkJWenRCUVVOeVJTeHBRa0ZCYVVJc1YwRkJWenRCUVVNMVFqdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3hoUVVGaE96dEJRVVZpTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRXNaMEpCUVdkQ0xFdEJRVXM3UVVGRGNrSXNaMEpCUVdkQ08wRkJRMmhDTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1owSkJRV2RDTEV0QlFVczdRVUZEY2tJc1owSkJRV2RDTzBGQlEyaENPMEZCUTBFN1FVRkRRVHRCUVVOQkxESkRRVUV5UXl4bFFVRmxMR05CUVdNc1kwRkJZeXhKUVVGSkxHVkJRV1U3UVVGRGVrYzdPMEZCUlVFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CTEdWQlFXVXNUVUZCVFR0QlFVTnlRanRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1pVRkJaU3hOUVVGTk8wRkJRM0pDTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeGxRVUZsTEZGQlFWRTdRVUZEZGtJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUczdRVUZGUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFTeGxRVUZsTEZGQlFWRTdRVUZEZGtJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUczdRVUZGUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzVTBGQlV6dEJRVU5VTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNVMEZCVXp0QlFVTlVPenRCUVVWQk8wRkJRMEU3UVVGRFFTeGxRVUZsTEV0QlFVczdRVUZEY0VJc1pVRkJaU3hMUVVGTE8wRkJRM0JDTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVN4MVFrRkJkVUlzYTBKQlFXdENPMEZCUTNwRE96dEJRVVZCTzBGQlEwRTdRVUZEUVN4aFFVRmhPMEZCUTJJN1FVRkRRVHRCUVVOQkxHRkJRV0U3UVVGRFlqdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk96dEJRVVZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJMR1ZCUVdVc1MwRkJTenRCUVVOd1FpeGxRVUZsTEV0QlFVczdRVUZEY0VJN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN08wRkJSVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJPMEZCUTBFN1FVRkRRU3huUWtGQlowSXNTMEZCU3p0QlFVTnlRaXhuUWtGQlowSXNVVUZCVVR0QlFVTjRRanRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVUZGUVR0QlFVTkJPMEZCUTBFc1owSkJRV2RDTEV0QlFVczdRVUZEY2tJc1owSkJRV2RDTzBGQlEyaENPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWjBKQlFXZENMRTlCUVU4N1FVRkRka0lzWjBKQlFXZENPMEZCUTJoQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk8wRkJRMEVzWlVGQlpTeFBRVUZQTzBGQlEzUkNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRTdRVUZEUVRzN1FVRkZRVHRCUVVOQk96dEJRVVZCTEdsRlFVRmxMR1ZCUVdVc1JVRkJReUlzSW1acGJHVWlPaUprWVhSbGNtRnVaMlZ3YVdOclpYSXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJb1puVnVZM1JwYjI0Z2QyVmljR0ZqYTFWdWFYWmxjbk5oYkUxdlpIVnNaVVJsWm1sdWFYUnBiMjRvY205dmRDd2dabUZqZEc5eWVTa2dlMXh1WEhScFppaDBlWEJsYjJZZ1pYaHdiM0owY3lBOVBUMGdKMjlpYW1WamRDY2dKaVlnZEhsd1pXOW1JRzF2WkhWc1pTQTlQVDBnSjI5aWFtVmpkQ2NwWEc1Y2RGeDBiVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQm1ZV04wYjNKNUtDazdYRzVjZEdWc2MyVWdhV1lvZEhsd1pXOW1JR1JsWm1sdVpTQTlQVDBnSjJaMWJtTjBhVzl1SnlBbUppQmtaV1pwYm1VdVlXMWtLVnh1WEhSY2RHUmxabWx1WlNoY0lrUmhkR1Z5WVc1blpYQnBZMnRsY2x3aUxDQmJYU3dnWm1GamRHOXllU2s3WEc1Y2RHVnNjMlVnYVdZb2RIbHdaVzltSUdWNGNHOXlkSE1nUFQwOUlDZHZZbXBsWTNRbktWeHVYSFJjZEdWNGNHOXlkSE5iWENKRVlYUmxjbUZ1WjJWd2FXTnJaWEpjSWwwZ1BTQm1ZV04wYjNKNUtDazdYRzVjZEdWc2MyVmNibHgwWEhSeWIyOTBXMXdpUkdGMFpYSmhibWRsY0dsamEyVnlYQ0pkSUQwZ1ptRmpkRzl5ZVNncE8xeHVmU2tvYzJWc1ppd2dablZ1WTNScGIyNG9LU0I3WEc1eVpYUjFjbTRnSWl3aUx5OGdWR2hsSUhKbGNYVnBjbVVnYzJOdmNHVmNiblpoY2lCZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZklEMGdlMzA3WEc1Y2JpSXNJaTh2SUdSbFptbHVaU0JuWlhSMFpYSWdablZ1WTNScGIyNXpJR1p2Y2lCb1lYSnRiMjU1SUdWNGNHOXlkSE5jYmw5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dVpDQTlJQ2hsZUhCdmNuUnpMQ0JrWldacGJtbDBhVzl1S1NBOVBpQjdYRzVjZEdadmNpaDJZWElnYTJWNUlHbHVJR1JsWm1sdWFYUnBiMjRwSUh0Y2JseDBYSFJwWmloZlgzZGxZbkJoWTJ0ZmNtVnhkV2x5WlY5ZkxtOG9aR1ZtYVc1cGRHbHZiaXdnYTJWNUtTQW1KaUFoWDE5M1pXSndZV05yWDNKbGNYVnBjbVZmWHk1dktHVjRjRzl5ZEhNc0lHdGxlU2twSUh0Y2JseDBYSFJjZEU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaGxlSEJ2Y25SekxDQnJaWGtzSUhzZ1pXNTFiV1Z5WVdKc1pUb2dkSEoxWlN3Z1oyVjBPaUJrWldacGJtbDBhVzl1VzJ0bGVWMGdmU2s3WEc1Y2RGeDBmVnh1WEhSOVhHNTlPeUlzSWw5ZmQyVmljR0ZqYTE5eVpYRjFhWEpsWDE4dWJ5QTlJQ2h2WW1vc0lIQnliM0FwSUQwK0lDaFBZbXBsWTNRdWNISnZkRzkwZVhCbExtaGhjMDkzYmxCeWIzQmxjblI1TG1OaGJHd29iMkpxTENCd2NtOXdLU2tpTENJdkx5QmtaV1pwYm1VZ1gxOWxjMDF2WkhWc1pTQnZiaUJsZUhCdmNuUnpYRzVmWDNkbFluQmhZMnRmY21WeGRXbHlaVjlmTG5JZ1BTQW9aWGh3YjNKMGN5a2dQVDRnZTF4dVhIUnBaaWgwZVhCbGIyWWdVM2x0WW05c0lDRTlQU0FuZFc1a1pXWnBibVZrSnlBbUppQlRlVzFpYjJ3dWRHOVRkSEpwYm1kVVlXY3BJSHRjYmx4MFhIUlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtvWlhod2IzSjBjeXdnVTNsdFltOXNMblJ2VTNSeWFXNW5WR0ZuTENCN0lIWmhiSFZsT2lBblRXOWtkV3hsSnlCOUtUdGNibHgwZlZ4dVhIUlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtvWlhod2IzSjBjeXdnSjE5ZlpYTk5iMlIxYkdVbkxDQjdJSFpoYkhWbE9pQjBjblZsSUgwcE8xeHVmVHNpTENJdkx5QmxlSFJ5WVdOMFpXUWdZbmtnYldsdWFTMWpjM010WlhoMGNtRmpkQzF3YkhWbmFXNWNibVY0Y0c5eWRDQjdmVHNpTENKbWRXNWpkR2x2YmlCRVlYUmxVbUZ1WjJWUWFXTnJaWElvSkdOdmJuUmhhVzVsY2l3Z2IzQjBhVzl1Y3lBOUlIdDlLU0I3WEhKY2JpQWdJQ0IwYUdsekxsOGtZMjl1ZEdGcGJtVnlJRDBnSkdOdmJuUmhhVzVsY2p0Y2NseHVYSEpjYmlBZ0lDQjBhR2x6TG05d2RHbHZibk1nUFNCN1hISmNiaUFnSUNBZ0lDQWdabWx5YzNSRVlYbFBabFJvWlZkbFpXczZJRzl3ZEdsdmJuTXVabWx5YzNSRVlYbFBabFJvWlZkbFpXc2dmSHdnTVN3Z0lDQWdJQ0FnTHk4ZzBML1F0ZEdBMExMUmk5QzVJTkMwMExYUXZkR01JTkM5MExYUXROQzEwTHZRdUN3Z01DQTlJTkN5MFlFc0lERWdQU0RRdjlDOUxDQXVMaTVjY2x4dUlDQWdJQ0FnSUNCdGIyNTBhSE5EYjNWdWREb2dJQ0FnSUNBZ2IzQjBhVzl1Y3k1dGIyNTBhSE5EYjNWdWRDQWdJQ0FnSUNCOGZDQXhNaXdnSUNBZ0lDQXZMeURRdXRDKzBMdlF1TkdIMExYUmdkR0MwTExRdmlEUXZ0R0MwTDdRc2RHQTBMRFF0dEN3MExYUXZOR0wwWVVnMEx6UXRkR0IwWS9SaHRDMTBMSmNjbHh1SUNBZ0lDQWdJQ0J6YVc1bmJHVk5iMlJsT2lBZ0lDQWdJQ0FnYjNCMGFXOXVjeTV6YVc1bmJHVk5iMlJsSUNBZ0lDQWdJQ0I4ZkNCbVlXeHpaU3dnSUNBdkx5RFFzdEdMMExIUXZ0R0FJTkMrMExUUXZkQyswTGtnMExUUXNOR0MwWXNnMExMUXZOQzEwWUhSZ3RDK0lOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXNGeHlYRzRnSUNBZ0lDQWdJR3h2WTJGc1pUb2dJQ0FnSUNBZ0lDQWdJQ0J2Y0hScGIyNXpMbXh2WTJGc1pTQWdJQ0FnSUNBZ0lDQWdJSHg4SUNkeWRTMVNWU2NzWEhKY2JpQWdJQ0FnSUNBZ2IyNDZJRTlpYW1WamRDNWhjM05wWjI0b2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVlXNW5aVk5sYkdWamREb2diblZzYkN3Z0x5OGcwWUhRdnRDeDBZdlJndEM0MExVZzBMTFJpOUN4MEw3UmdOQ3dJTkMwMExqUXNOQy8wTERRdDlDKzBMM1FzQ0RRdE5DdzBZSmNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1pHRjVVMlZzWldOME9pQnVkV3hzTENBZ0lDOHZJTkdCMEw3UXNkR0wwWUxRdU5DMUlOQ3kwWXZRc2RDKzBZRFFzQ0RRdnRDMDBMM1F2dEM1SU5DMDBMRFJndEdMSUNqUmd0QyswTHZSak5DNjBMNGcwTC9SZ05DNElITnBibWRzWlUxdlpHVTZJSFJ5ZFdVcFhISmNiaUFnSUNBZ0lDQWdmU3dnYjNCMGFXOXVjeTV2YmlCOGZDQjdmU2tzWEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2RHaHBjeTVwYm1sMElEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmSkhCcFkydGxjaUE5SUhSb2FYTXVYeVJqY21WaGRHVkZiR1Z0Wlc1MEtGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCZ1BHUnBkaUJqYkdGemN6MWNJa1JoZEdWeVlXNW5aWEJwWTJ0bGNsd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrUmhkR1Z5WVc1blpYQnBZMnRsY2w5ZmJXOXVkR2h6WENJK1BDOWthWFkrWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRHd2WkdsMlBtQmNjbHh1SUNBZ0lDQWdJQ0FwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0F2THlEUmpkQzcwTFhRdk5DMTBMM1JndEdMWEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmSkcxdmJuUm9jeUE5SUhSb2FYTXVYeVJ3YVdOclpYSXVjWFZsY25sVFpXeGxZM1J2Y2lnbkxrUmhkR1Z5WVc1blpYQnBZMnRsY2w5ZmJXOXVkR2h6SnlrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR04xY25KbGJuUkVZWFJsSUQwZ2JtVjNJRVJoZEdVb0tUdGNjbHh1SUNBZ0lDQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUhSb2FYTXViM0IwYVc5dWN5NXRiMjUwYUhORGIzVnVkRHNnS3l0cEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11WHlSdGIyNTBhSE11WVhCd1pXNWtRMmhwYkdRb2RHaHBjeTVmSkdOeVpXRjBaVTF2Ym5Sb0tHTjFjbkpsYm5SRVlYUmxLU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR04xY25KbGJuUkVZWFJsTG5ObGRFMXZiblJvS0dOMWNuSmxiblJFWVhSbExtZGxkRTF2Ym5Sb0tDa2dLeUF4S1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDOHZJTkdCMEw3UXNkR0wwWUxRdU5HUFhISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOR0EwTFhRdmRDMDBMWFJnRnh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYeVJqYjI1MFlXbHVaWEl1WVhCd1pXNWtRMmhwYkdRb2RHaHBjeTVmSkhCcFkydGxjaWs3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQzh2SU5DNDBMM1F1TkdHMExqUXNOQzcwTGpRdDlDdzBZYlF1TkdQSU5HQjBMN1JnZEdDMEw3Umo5QzkwTGpRdVZ4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11Y21GdVoyVlNaWE5sZENncE8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBKM1FzTkMzMExMUXNOQzkwTGpRdFNEUXZOQzEwWUhSajlHRzBMQmNjbHh1SUNBZ0lDQXFJRUJ3WVhKaGJTQWdlMFJoZEdWOUlHUmhkR1VnMEo3UXNkR0swTFhRdXRHQ0lOQzAwTERSZ3RHTFhISmNiaUFnSUNBZ0tpQkFjbVYwZFhKdUlIdFRkSEpwYm1kOVhISmNiaUFnSUNBZ0tpOWNjbHh1SUNBZ0lIUm9hWE11WjJWMFRXOXVkR2hHYjNKdFlYUjBaV1FnUFNCbWRXNWpkR2x2Ymloa1lYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnZEdsMGJHVWdQU0IwYUdsekxtZGxkRVJoZEdWVWFXMWxSbTl5YldGMEtHUmhkR1VzSUh0dGIyNTBhRG9nSjJ4dmJtY25mU2s3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhScGRHeGxMbk5zYVdObEtEQXNJREVwTG5SdlZYQndaWEpEWVhObEtDa2dLeUIwYVhSc1pTNXpiR2xqWlNneEtUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlOQ2swTDdSZ05DODBMRFJndEM0MFlEUXZ0Q3kwTERRdmRDNDBMVWcwTFRRc05HQzBZc2cwTFRRdTlHUElOR0MwTFhRdXRHRDBZblF0ZEM1SU5DNzBMN1F1dEN3MEx2UXVGeHlYRzRnSUNBZ0lDb2dRSEJoY21GdElDQjdSR0YwWlgwZ0lDQmtZWFJsSUNBZ0lOQ2UwTEhSaXRDMTBMclJnaURRdE5DdzBZTFJpMXh5WEc0Z0lDQWdJQ29nUUhCaGNtRnRJQ0I3VDJKcVpXTjBmU0J2Y0hScGIyNXpJTkNmMExEUmdOQ3cwTHpRdGRHQzBZRFJpMXh5WEc0Z0lDQWdJQ29nUUhKbGRIVnliaUI3VTNSeWFXNW5mVnh5WEc0Z0lDQWdJQ292WEhKY2JpQWdJQ0IwYUdsekxtZGxkRVJoZEdWVWFXMWxSbTl5YldGMElEMGdablZ1WTNScGIyNG9aR0YwWlN3Z2IzQjBhVzl1Y3lrZ2UxeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQkpiblJzTGtSaGRHVlVhVzFsUm05eWJXRjBLSFJvYVhNdWIzQjBhVzl1Y3k1c2IyTmhiR1VzSUc5d2RHbHZibk1wTG1admNtMWhkQ2hrWVhSbEtUdGNjbHh1SUNBZ0lIMWNjbHh1WEhKY2JpQWdJQ0F2S2lwY2NseHVJQ0FnSUNBcUlOQ1UwTDNRdUNEUXZkQzEwTFRRdGRDNzBMaGNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdkR2hwY3k1blpYUlhaV1ZyUkdGNWMwWnZjbTFoZEhSbFpDQTlJR1oxYm1OMGFXOXVLQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUdSaGRHVWdQU0J1WlhjZ1JHRjBaU2dwTzF4eVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUhKbGMzVnNkQ0E5SUZ0ZE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCa1lYUmxMbk5sZEVSaGRHVW9aR0YwWlM1blpYUkVZWFJsS0NrZ0xTQXlLVHRjY2x4dUlDQWdJQ0FnSUNCbWIzSWdLR3hsZENCcElEMGdNRHNnYVNBOElEYzdJQ3NyYVNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCa1lYUmxMbk5sZEVSaGRHVW9aR0YwWlM1blpYUkVZWFJsS0NrZ0t5QXhLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbVZ6ZFd4MExuQjFjMmdvZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1pHRjVPaUJrWVhSbExtZGxkRVJoZVNncExGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2wwYkdVNklIUm9hWE11WjJWMFJHRjBaVlJwYldWR2IzSnRZWFFvWkdGMFpTd2dlM2RsWld0a1lYazZJQ2R6YUc5eWRDZDlLU3hjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdmU2s3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBdkx5RFJnZEMrMFlEUmd0QzQwWURRdnRDeTBMclFzQ0RSZ2RDKzBMUFF1OUN3MFlIUXZkQytJTkM5MExEUmdkR0MwWURRdnRDMTBMM1F2ZEMrMEx6Umd5RFF2OUMxMFlEUXN0QyswTHpSZ3lEUXROQzkwWTRnMEwzUXRkQzAwTFhRdTlDNFhISmNiaUFnSUNBZ0lDQWdjbVZ6ZFd4MExuTnZjblFvS0dFc0lHSXBJRDArSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdabWx5YzNSRVlYbFBabFJvWlZkbFpXc2dQU0IwYUdsekxtOXdkR2x2Ym5NdVptbHljM1JFWVhsUFpsUm9aVmRsWldzZ0pTQTNPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnNaWFFnWkdGNVFTQTlJR0V1WkdGNU8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCc1pYUWdaR0Y1UWlBOUlHSXVaR0Y1TzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR1JoZVVFZ1BUMGdabWx5YzNSRVlYbFBabFJvWlZkbFpXc3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUF0TVR0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR1JoZVVJZ1BUMGdabWx5YzNSRVlYbFBabFJvWlZkbFpXc3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUF4TzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9aR0Y1UVNBOElHWnBjbk4wUkdGNVQyWlVhR1ZYWldWcktTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JrWVhsQklDczlJSEpsYzNWc2RDNXNaVzVuZEdnN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2hrWVhsQ0lEd2dabWx5YzNSRVlYbFBabFJvWlZkbFpXc3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdSaGVVSWdLejBnY21WemRXeDBMbXhsYm1kMGFEdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHUmhlVUVnTFNCa1lYbENPMXh5WEc0Z0lDQWdJQ0FnSUgwcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnY21WemRXeDBPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwSnJRdnRDNzBMalJoOUMxMFlIUmd0Q3kwTDRnMExUUXZkQzEwTGtnMExJZzBMelF0ZEdCMFkvUmh0QzFYSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdJSHRFWVhSbGZTQmtZWFJsSU5DZTBMSFJpdEMxMExyUmdpRFF0TkN3MFlMUmkxeHlYRzRnSUNBZ0lDb2dRSEpsZEhWeWJpQjdUblZ0WW1WeWZTQWdJQ0RRbXRDKzBMdlF1TkdIMExYUmdkR0MwTExRdmlEUXROQzkwTFhRdVZ4eVhHNGdJQ0FnSUNvdlhISmNiaUFnSUNCMGFHbHpMbWRsZEVSaGVYTkRiM1Z1ZEVsdVRXOXVkR2dnUFNCbWRXNWpkR2x2Ymloa1lYUmxLU0I3WEhKY2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWkdGNWN5QTlJRzVsZHlCRVlYUmxLR1JoZEdVdVoyVjBWR2x0WlNncEtUdGNjbHh1SUNBZ0lDQWdJQ0JrWVhsekxuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc0Z0lDQWdJQ0FnSUdSaGVYTXVjMlYwVFc5dWRHZ29aR0Y1Y3k1blpYUk5iMjUwYUNncElDc2dNU2s3WEhKY2JpQWdJQ0FnSUNBZ1pHRjVjeTV6WlhSRVlYUmxLREFwTzF4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCa1lYbHpMbWRsZEVSaGRHVW9LVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNCMGFHbHpMbDhrWTNKbFlYUmxUVzl1ZEdnZ1BTQm1kVzVqZEdsdmJpaGtZWFJsS1NCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ1kzVnljbVZ1ZEUxdmJuUm9JRDBnWkdGMFpTNW5aWFJOYjI1MGFDZ3BPMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJRzF2Ym5Sb1ZHbDBiR1VnUFNCMGFHbHpMbWRsZEUxdmJuUm9SbTl5YldGMGRHVmtLR1JoZEdVcE8xeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElIZGxaV3RFWVhseklEMGdkR2hwY3k1blpYUlhaV1ZyUkdGNWMwWnZjbTFoZEhSbFpDZ3BPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENBa2JXOXVkR2dnUFNCMGFHbHpMbDhrWTNKbFlYUmxSV3hsYldWdWRDaGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGd2lQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEdScGRpQmpiR0Z6Y3oxY0lrMXZiblJvWDE5MGFYUnNaVndpUGlSN2JXOXVkR2hVYVhSc1pYMDhMMlJwZGo1Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lEeGthWFlnWTJ4aGMzTTlYQ0pOYjI1MGFGOWZkMlZsYTF3aVBpUjdkMlZsYTBSaGVYTXViV0Z3S0dsMFpXMGdQVDRnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQmdQR1JwZGlCamJHRnpjejFjSWsxdmJuUm9YMTkzWldWclpHRjVYQ0krSkh0cGRHVnRMblJwZEd4bGZUd3ZaR2wyUG1CY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHBMbXB2YVc0b0p5Y3BmVHd2WkdsMlBseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdQR1JwZGlCamJHRnpjejFjSWsxdmJuUm9YMTlrWVhselhDSStQQzlrYVhZK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUR3dlpHbDJQbUJjY2x4dUlDQWdJQ0FnSUNBcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0FrWkdGNWN5QTlJQ1J0YjI1MGFDNXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVRXOXVkR2hmWDJSaGVYTW5LVHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0JrWVhseklEMGdibVYzSUVSaGRHVW9aR0YwWlM1blpYUlVhVzFsS0NrcE8xeHlYRzRnSUNBZ0lDQWdJR1JoZVhNdWMyVjBSR0YwWlNneEtUdGNjbHh1SUNBZ0lDQWdJQ0JrWVhsekxuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQjNhR2xzWlNBb1pHRjVjeTVuWlhSTmIyNTBhQ2dwSUQwOUlHTjFjbkpsYm5STmIyNTBhQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JqYjI1emRDQWtkMlZsYXlBOUlIUm9hWE11WHlSamNtVmhkR1ZYWldWcktDazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IzWldWclJHRjVjeTVtYjNKRllXTm9LR2wwWlcwZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHUmhlWE11WjJWMFJHRjVLQ2tnSVQwZ2FYUmxiUzVrWVhrZ2ZId2daR0Y1Y3k1blpYUk5iMjUwYUNncElDRTlJR04xY25KbGJuUk5iMjUwYUNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNSM1pXVnJMbUZ3Y0dWdVpFTm9hV3hrS0hSb2FYTXVYeVJqY21WaGRHVkZiWEIwZVVSaGVTZ3BLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200N1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0pIZGxaV3N1WVhCd1pXNWtRMmhwYkdRb2RHaHBjeTVmSkdOeVpXRjBaVVJoZVNoa1lYbHpLU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCa1lYbHpMbk5sZEVSaGRHVW9aR0Y1Y3k1blpYUkVZWFJsS0NrZ0t5QXhLVHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdmU2s3WEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSUNBa1pHRjVjeTVoY0hCbGJtUkRhR2xzWkNna2QyVmxheWs3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnSkcxdmJuUm9PMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwS0RRdGRDOTBMVFF0ZEdBSU5DOTBMWFF0TkMxMEx2UXVGeHlYRzRnSUNBZ0lDb2dRSEJoY21GdElDQjdSR0YwWlgwZ1pHRjBaU0RRbnRDeDBZclF0ZEM2MFlJZzBMVFFzTkdDMFl0Y2NseHVJQ0FnSUNBcUlFQnlaWFIxY200Z2UwVnNaVzFsYm5SOVhISmNiaUFnSUNBZ0tpOWNjbHh1SUNBZ0lIUm9hWE11WHlSamNtVmhkR1ZYWldWcklEMGdablZ1WTNScGIyNG9aR0YwWlNrZ2UxeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElDUjNaV1ZySUQwZ2RHaHBjeTVmSkdOeVpXRjBaVVZzWlcxbGJuUW9YSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHQThaR2wySUdOc1lYTnpQVndpVjJWbGExd2lQand2WkdsMlBtQmNjbHh1SUNBZ0lDQWdJQ0FwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdKSGRsWldzN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUW9OQzEwTDNRdE5DMTBZQWcwTFRRdmRHUFhISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ0lIdEVZWFJsZlNCa1lYUmxJTkNlMExIUml0QzEwTHJSZ2lEUXROQ3cwWUxSaTF4eVhHNGdJQ0FnSUNvZ1FISmxkSFZ5YmlCN1JXeGxiV1Z1ZEgxY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVmSkdOeVpXRjBaVVJoZVNBOUlHWjFibU4wYVc5dUtHUmhkR1VwSUh0Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENBa1pHRjVJRDBnZEdocGN5NWZKR055WldGMFpVVnNaVzFsYm5Rb1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUdBOFpHbDJJR05zWVhOelBWd2lSR0Y1WENJZ1pHRjBZUzEwYVcxbFBWd2lKSHRrWVhSbExtZGxkRlJwYldVb0tYMWNJaUJrWVhSaExXUmhlVDFjSWlSN1pHRjBaUzVuWlhSRVlYa29LWDFjSWo0a2UyUmhkR1V1WjJWMFJHRjBaU2dwZlR3dlpHbDJQbUJjY2x4dUlDQWdJQ0FnSUNBcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNBa1pHRjVMbUZrWkVWMlpXNTBUR2x6ZEdWdVpYSW9KMk5zYVdOckp5d2dkR2hwY3k1ZmIyNUVZWGxEYkdsamEwVjJaVzUwTG1KcGJtUW9kR2hwY3lrcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCcFppQW9JWFJvYVhNdWIzQjBhVzl1Y3k1emFXNW5iR1ZOYjJSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lDUmtZWGt1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduYlc5MWMyVmxiblJsY2ljc0lIUm9hWE11WDI5dVJHRjVUVzkxYzJWRmJuUmxja1YyWlc1MExtSnBibVFvZEdocGN5a3BPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJQ1JrWVhrN1hISmNiaUFnSUNCOVhISmNibHh5WEc0Z0lDQWdMeW9xWEhKY2JpQWdJQ0FnS2lEUW9kQyswTEhSaTlHQzBMalF0U0RRdXRDNzBMalF1dEN3SU5DLzBMNGcwTFRRdmRHT1hISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UwVjJaVzUwZlNCbElFUlBUU0RSZ2RDKzBMSFJpOUdDMExqUXRWeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TGw5dmJrUmhlVU5zYVdOclJYWmxiblFnUFNCbWRXNWpkR2x2YmlobEtTQjdYSEpjYmlBZ0lDQWdJQ0FnZEdocGN5NWZiMjVFWVhsRGJHbGpheWhsTG5SaGNtZGxkQ2s3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0x5b3FYSEpjYmlBZ0lDQWdLaURRb2RDKzBMSFJpOUdDMExqUXRTRFJoZEMrMExMUXRkR0EwTEJjY2x4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3UlhabGJuUjlJR1VnUkU5TklOR0IwTDdRc2RHTDBZTFF1TkMxWEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUhSb2FYTXVYMjl1UkdGNVRXOTFjMlZGYm5SbGNrVjJaVzUwSUQwZ1puVnVZM1JwYjI0b1pTa2dlMXh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMjl1UkdGNVRXOTFjMlZGYm5SbGNpaGxMblJoY21kbGRDazdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRFFwZEMrMExMUXRkR0FJTkM5MExBZzBZM1F1OUMxMEx6UXRkQzkwWUxRdFNEUXROQzkwWTljY2x4dUlDQWdJQ0FxSUVCd1lYSmhiU0I3Uld4bGJXVnVkSDBnSkdSaGVTQklWRTFNSU5DdDBMdlF0ZEM4MExYUXZkR0NYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVgyOXVSR0Y1VFc5MWMyVkZiblJsY2lBOUlHWjFibU4wYVc5dUtDUmtZWGtwSUh0Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvSVhSb2FYTXVYM05sYkdWamRHbHZiaTRrWm5KdmJTQjhmQ0IwYUdsekxsOXpaV3hsWTNScGIyNHVKSFJ2S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnlianRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUdsbUlDZ2taR0Y1SUQwOUlIUm9hWE11WDNObGJHVmpkR2x2Ymk0a1puSnZiU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNDdYSEpjYmlBZ0lDQWdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDQWdJQ0JqYjI1emRDQmtZWFJsWDJaeWIyMGdQU0J1WlhjZ1JHRjBaU2h3WVhKelpVbHVkQ2gwYUdsekxsOXpaV3hsWTNScGIyNHVKR1p5YjIwdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcE8xeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElHUmhkR1ZmZEc4Z0lDQTlJRzVsZHlCRVlYUmxLSEJoY25ObFNXNTBLQ1JrWVhrdVpHRjBZWE5sZEM1MGFXMWxMQ0F4TUNrcE8xeHlYRzVjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQ2hrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzhwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHFLbHh5WEc0Z0lDQWdJQ29nMEpyUXU5QzQwTG9nMEwvUXZpRFF0TkM5MFk1Y2NseHVJQ0FnSUNBcUlFQndZWEpoYlNCN1JXeGxiV1Z1ZEgwZ0pHUmhlU0JJVkUxTUlOQ3QwTHZRdGRDODBMWFF2ZEdDWEhKY2JpQWdJQ0FnS2k5Y2NseHVJQ0FnSUhSb2FYTXVYMjl1UkdGNVEyeHBZMnNnUFNCbWRXNWpkR2x2Ymlna1pHRjVLU0I3WEhKY2JpQWdJQ0FnSUNBZ0x5OGcwTExSaTlDeDBMN1JnQ0RRdnRDMDBMM1F2dEM1SU5DMDBMRFJndEdMWEhKY2JpQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWIzQjBhVzl1Y3k1emFXNW5iR1ZOYjJSbEtTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11Y21GdVoyVlNaWE5sZENncE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNBa1pHRjVMbU5zWVhOelRHbHpkQzVoWkdRb0oybHpMWE5sYkdWamRHVmtKeWs3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVgyTmhiR3hpWVdOcktDZGtZWGxUWld4bFkzUW5MQ0J1WlhjZ1JHRjBaU2h3WVhKelpVbHVkQ2drWkdGNUxtUmhkR0Z6WlhRdWRHbHRaU3dnTVRBcEtTazdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxsOXpaV3hsWTNScGIyNHVKR1p5YjIwZ0ppWWdkR2hwY3k1ZmMyVnNaV04wYVc5dUxpUjBieWtnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxuSmhibWRsVW1WelpYUW9LVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUNSa1lYa3VZMnhoYzNOTWFYTjBMbUZrWkNnbmFYTXRjMlZzWldOMFpXUW5LVHRjY2x4dVhISmNiaUFnSUNBZ0lDQWdhV1lnS0NGMGFHbHpMbDl6Wld4bFkzUnBiMjR1SkdaeWIyMHBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZmMyVnNaV04wYVc5dUxpUm1jbTl0SUQwZ0pHUmhlVHRjY2x4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnYVdZZ0tDRjBhR2x6TGw5elpXeGxZM1JwYjI0dUpIUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNGtkRzhnUFNBa1pHRjVPMXh5WEc0Z0lDQWdJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnYVdZZ0tIUm9hWE11WDNObGJHVmpkR2x2Ymk0a1puSnZiU0FtSmlCMGFHbHpMbDl6Wld4bFkzUnBiMjR1SkhSdktTQjdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHTnZibk4wSUdSaGRHVmZabkp2YlNBOUlHNWxkeUJFWVhSbEtIQmhjbk5sU1c1MEtIUm9hWE11WDNObGJHVmpkR2x2Ymk0a1puSnZiUzVrWVhSaGMyVjBMblJwYldVc0lERXdLU2s3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR052Ym5OMElHUmhkR1ZmZEc4Z0lDQTlJRzVsZHlCRVlYUmxLSEJoY25ObFNXNTBLSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNGtkRzh1WkdGMFlYTmxkQzUwYVcxbExDQXhNQ2twTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxuSmhibWRsVTJWc1pXTjBLR1JoZEdWZlpuSnZiU3dnWkdGMFpWOTBieWs3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBLSFFzZEdBMEw3UmdTRFFzdEdMMExUUXRkQzcwTFhRdmRDOTBZdlJoU0RRdE5DdzBZSmNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdkR2hwY3k1eVlXNW5aVkpsYzJWMElEMGdablZ1WTNScGIyNG9LU0I3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4U1pYTmxkQ2dwTzF4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNObGJHVmpkR2x2YmlBOUlIdDlPMXh5WEc0Z0lDQWdmVnh5WEc1Y2NseHVJQ0FnSUM4cUtseHlYRzRnSUNBZ0lDb2cwSkxRdU5DMzBZUFFzTkM3MFl6UXZkR0wwTGtnMFlIUXNkR0EwTDdSZ1NEUXN0R0wwTFRRdGRDNzBMWFF2ZEM5MFl2UmhTRFF0TkN3MFlKY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4U1pYTmxkQ0E5SUdaMWJtTjBhVzl1S0NrZ2UxeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElDUmtZWGx6SUQwZ2RHaHBjeTVmSkcxdmJuUm9jeTV4ZFdWeWVWTmxiR1ZqZEc5eVFXeHNLQ2N1UkdGNVcyUmhkR0V0ZEdsdFpWMG5LVHRjY2x4dUlDQWdJQ0FnSUNBa1pHRjVjeTVtYjNKRllXTm9LQ1JrWVhrZ1BUNGdlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWtaR0Y1TG1Oc1lYTnpUR2x6ZEM1eVpXMXZkbVVvSjJsekxYTmxiR1ZqZEdWa0p5d2dKMmx6TFhObGJHVmpkR1ZrTFdaeWIyMG5MQ0FuYVhNdGMyVnNaV04wWldRdGRHOG5MQ0FuYVhNdGMyVnNaV04wWldRdFltVjBkMlZsYmljcE8xeHlYRzRnSUNBZ0lDQWdJSDBwTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHFLbHh5WEc0Z0lDQWdJQ29nMEpMUXVOQzMwWVBRc05DNzBZelF2ZEMrMExVZzBMTFJpOUMwMExYUXU5QzEwTDNRdU5DMUlOQzAwTERSZ2x4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0RVlYUmxmU0JrWVhSbFgyWnliMjBnMEozUXNOR0gwTERRdTlHTTBMM1FzTkdQSU5DMDBMRFJndEN3WEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnZTBSaGRHVjlJR1JoZEdWZmRHOGdJQ0RRbXRDKzBMM1F0ZEdIMEwzUXNOR1BJTkMwMExEUmd0Q3dYSEpjYmlBZ0lDQWdLaTljY2x4dUlDQWdJSFJvYVhNdVgzSmhibWRsVm1semRXRnNVMlZzWldOMElEMGdablZ1WTNScGIyNG9aR0YwWlY5bWNtOXRMQ0JrWVhSbFgzUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ1pHRjBaVjltY205dExuTmxkRWh2ZFhKektEQXNJREFzSURBc0lEQXBPMXh5WEc0Z0lDQWdJQ0FnSUdSaGRHVmZkRzh1YzJWMFNHOTFjbk1vTUN3Z01Dd2dNQ3dnTUNrN1hISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOQ3kwWXZRc2RDKzBZQWcwTFRRc05HQ0lOQ3lJTkMrMExIUmdOQ3cwWUxRdmRDKzBMd2cwTC9RdnRHQTBZL1F0TkM2MExWY2NseHVJQ0FnSUNBZ0lDQnBaaUFvWkdGMFpWOW1jbTl0SUQ0Z1pHRjBaVjkwYnlrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCamIyNXpkQ0J6ZDJGd0lEMGdaR0YwWlY5bWNtOXRPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmtZWFJsWDJaeWIyMGdQU0JrWVhSbFgzUnZPMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmtZWFJsWDNSdklEMGdjM2RoY0R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lHTnZibk4wSUhScGJXVmZabkp2YlNBOUlHUmhkR1ZmWm5KdmJTNW5aWFJVYVcxbEtDazdYSEpjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdkR2x0WlY5MGJ5QTlJR1JoZEdWZmRHOHVaMlYwVkdsdFpTZ3BPMXh5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJQ1JrWVhseklEMGdkR2hwY3k1ZkpHMXZiblJvY3k1eGRXVnllVk5sYkdWamRHOXlRV3hzS0NjdVJHRjVXMlJoZEdFdGRHbHRaVjBuS1R0Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnYkdWMElITmxiR1ZqZEdWa1VtVnRiM1psWkNBOUlHWmhiSE5sTzF4eVhHNGdJQ0FnSUNBZ0lHWnZjaUFvYkdWMElHa2dQU0F3T3lCcElEd2dKR1JoZVhNdWJHVnVaM1JvT3lBcksya3BJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdZMjl1YzNRZ0pHUmhlU0E5SUNSa1lYbHpXMmxkTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLQ1JrWVhrdVpHRjBZWE5sZEM1MGFXMWxJRDRnZEdsdFpWOW1jbTl0SUNZbUlDUmtZWGt1WkdGMFlYTmxkQzUwYVcxbElEd2dkR2x0WlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSkdSaGVTNWpiR0Z6YzB4cGMzUXVZV1JrS0NkcGN5MXpaV3hsWTNSbFpDMWlaWFIzWldWdUp5azdYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIMGdaV3h6WlNCcFppQW9KR1JoZVM1amJHRnpjMHhwYzNRdVkyOXVkR0ZwYm5Nb0oybHpMWE5sYkdWamRHVmtMV0psZEhkbFpXNG5LU2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0pHUmhlUzVqYkdGemMweHBjM1F1Y21WdGIzWmxLQ2RwY3kxelpXeGxZM1JsWkMxaVpYUjNaV1Z1SnlrN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnpaV3hsWTNSbFpGSmxiVzkyWldRZ1BTQjBjblZsTzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0hObGJHVmpkR1ZrVW1WdGIzWmxaQ2tnZTF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1luSmxZV3M3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSDFjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUM4dklOQ3kwWXZRdE5DMTBMdlF0ZEM5MExqUXRTRFJnZEdDMExEUmdOR0MwTDdRc3RDKzBMa2cwTGdnMExyUXZ0QzkwTFhSaDlDOTBMN1F1U0RRdjlDKzBMZlF1TkdHMExqUXVGeHlYRzRnSUNBZ0lDQWdJR052Ym5OMElDUmtZWGxmWm5KdmJTQTlJSFJvYVhNdVh5Um5aWFJFWVhsQ2VVUmhkR1VvWkdGMFpWOW1jbTl0S1R0Y2NseHVJQ0FnSUNBZ0lDQmpiMjV6ZENBa1pHRjVYM1J2SUQwZ2RHaHBjeTVmSkdkbGRFUmhlVUo1UkdGMFpTaGtZWFJsWDNSdktUdGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0x5OGcwTHJRdGRHSUlOQzAwTHZSanlEUXNkR0wwWUhSZ3RHQTBMN1FzOUMrSU5HQjBMSFJnTkMrMFlIUXNDRFJnZEdDMExEUmdOQyswTFBRdmlEUXN0R0wwTFRRdGRDNzBMWFF2ZEM0MFk5Y2NseHVJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NWZjbUZ1WjJWV2FYTjFZV3hUWld4bFkzUXVKR1JoZVY5bWNtOXRYMjlzWkNBbUppQjBhR2x6TGw5eVlXNW5aVlpwYzNWaGJGTmxiR1ZqZEM0a1pHRjVYMlp5YjIxZmIyeGtJQ0U5SUNSa1lYbGZabkp2YlNrZ2UxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQzRrWkdGNVgyWnliMjFmYjJ4a0xtTnNZWE56VEdsemRDNXlaVzF2ZG1Vb0oybHpMWE5sYkdWamRHVmtKeXdnSjJsekxYTmxiR1ZqZEdWa0xXWnliMjBuS1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDOHZJTkM2MExYUmlDRFF0TkM3MFk4ZzBMSFJpOUdCMFlMUmdOQyswTFBRdmlEUmdkQ3gwWURRdnRHQjBMQWcwWUhSZ3RDdzBZRFF2dEN6MEw0ZzBMTFJpOUMwMExYUXU5QzEwTDNRdU5HUFhISmNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXVYM0poYm1kbFZtbHpkV0ZzVTJWc1pXTjBMaVJrWVhsZmRHOWZiMnhrSUNZbUlIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wTGlSa1lYbGZkRzlmYjJ4a0lDRTlJQ1JrWVhsZmRHOHBJSHRjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZmNtRnVaMlZXYVhOMVlXeFRaV3hsWTNRdUpHUmhlVjkwYjE5dmJHUXVZMnhoYzNOTWFYTjBMbkpsYlc5MlpTZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRkRzhuS1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lHbG1JQ2drWkdGNVgyWnliMjBwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnSkdSaGVWOW1jbTl0TG1Oc1lYTnpUR2x6ZEM1aFpHUW9KMmx6TFhObGJHVmpkR1ZrSnl3Z0oybHpMWE5sYkdWamRHVmtMV1p5YjIwbktUdGNjbHh1SUNBZ0lDQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ0lDQWdJR2xtSUNna1pHRjVYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUNSa1lYbGZkRzh1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRkRzhuS1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDOHZJTkdCMEw3UmhkR0EwTERRdmRDMTBMM1F1TkMxSU5DeUlOQzYwTFhSaUZ4eVhHNGdJQ0FnSUNBZ0lIUm9hWE11WDNKaGJtZGxWbWx6ZFdGc1UyVnNaV04wTGlSa1lYbGZabkp2YlY5dmJHUWdQU0FrWkdGNVgyWnliMjA3WEhKY2JpQWdJQ0FnSUNBZ2RHaHBjeTVmY21GdVoyVldhWE4xWVd4VFpXeGxZM1F1SkdSaGVWOTBiMTl2YkdRZ1BTQWtaR0Y1WDNSdk8xeHlYRzRnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQzhxS2x4eVhHNGdJQ0FnSUNvZzBKTFJpOUMwMExYUXU5QzEwTDNRdU5DMUlOQzAwTGpRc05DLzBMRFF0OUMrMEwzUXNDRFF0TkN3MFlKY2NseHVJQ0FnSUNBcUlFQndZWEpoYlNCN1JHRjBaWDBnWkdGMFpWOW1jbTl0SU5DZDBMRFJoOUN3MEx2UmpOQzkwTERSanlEUXROQ3cwWUxRc0Z4eVhHNGdJQ0FnSUNvZ1FIQmhjbUZ0SUh0RVlYUmxmU0JrWVhSbFgzUnZJQ0FnMEpyUXZ0QzkwTFhSaDlDOTBMRFJqeURRdE5DdzBZTFFzRnh5WEc0Z0lDQWdJQ292WEhKY2JpQWdJQ0IwYUdsekxuSmhibWRsVTJWc1pXTjBJRDBnWm5WdVkzUnBiMjRvWkdGMFpWOW1jbTl0TENCa1lYUmxYM1J2S1NCN1hISmNiaUFnSUNBZ0lDQWdaR0YwWlY5bWNtOXRMbk5sZEVodmRYSnpLREFzSURBc0lEQXNJREFwTzF4eVhHNGdJQ0FnSUNBZ0lHUmhkR1ZmZEc4dWMyVjBTRzkxY25Nb01Dd2dNQ3dnTUN3Z01DazdYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDOHZJTkN5MFl2UXNkQyswWUFnMExUUXNOR0NJTkN5SU5DKzBMSFJnTkN3MFlMUXZkQyswTHdnMEwvUXZ0R0EwWS9RdE5DNjBMVmNjbHh1SUNBZ0lDQWdJQ0JwWmlBb1pHRjBaVjltY205dElENGdaR0YwWlY5MGJ5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQmpiMjV6ZENCemQyRndJRDBnWkdGMFpWOW1jbTl0TzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JrWVhSbFgyWnliMjBnUFNCa1lYUmxYM1J2TzF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0JrWVhSbFgzUnZJRDBnYzNkaGNEdGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHBjeTVmYzJWc1pXTjBhVzl1TGlSbWNtOXRJRDBnZEdocGN5NWZKR2RsZEVSaGVVSjVSR0YwWlNoa1lYUmxYMlp5YjIwcE8xeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbDl6Wld4bFkzUnBiMjR1SkhSdklEMGdkR2hwY3k1ZkpHZGxkRVJoZVVKNVJHRjBaU2hrWVhSbFgzUnZLVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TGw5elpXeGxZM1JwYjI0dUpHWnliMjBwSUh0Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEdocGN5NWZjMlZzWldOMGFXOXVMaVJtY205dExtTnNZWE56VEdsemRDNWhaR1FvSjJsekxYTmxiR1ZqZEdWa0p5d2dKMmx6TFhObGJHVmpkR1ZrTFdaeWIyMG5LVHRjY2x4dUlDQWdJQ0FnSUNCOVhISmNibHh5WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TGw5elpXeGxZM1JwYjI0dUpIUnZLU0I3WEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFJvYVhNdVgzTmxiR1ZqZEdsdmJpNGtkRzh1WTJ4aGMzTk1hWE4wTG1Ga1pDZ25hWE10YzJWc1pXTjBaV1FuTENBbmFYTXRjMlZzWldOMFpXUXRkRzhuS1R0Y2NseHVJQ0FnSUNBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDOHZJTkN5MFl2UXROQzEwTHZRdGRDOTBMalF0U0RSamRDNzBMWFF2TkMxMEwzUmd0QyswTEpjY2x4dUlDQWdJQ0FnSUNCMGFHbHpMbDl5WVc1blpWWnBjM1ZoYkZObGJHVmpkQ2hrWVhSbFgyWnliMjBzSUdSaGRHVmZkRzhwTzF4eVhHNWNjbHh1SUNBZ0lDQWdJQ0F2THlEUmdkQyswTEhSaTlHQzBMalF0Vnh5WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMk5oYkd4aVlXTnJLQ2R5WVc1blpWTmxiR1ZqZENjc0lHUmhkR1ZmWm5KdmJTd2daR0YwWlY5MGJ5azdYSEpjYmlBZ0lDQjlYSEpjYmx4eVhHNGdJQ0FnTHlvcVhISmNiaUFnSUNBZ0tpRFFyZEM3MExYUXZOQzEwTDNSZ2lEUXV0Q3cwTHZRdGRDOTBMVFFzTkdBMEwzUXZ0Q3owTDRnMExUUXZkR1BYSEpjYmlBZ0lDQWdLaUJBY0dGeVlXMGdJSHRFWVhSbGZTQmtZWFJsSU5DVTBMRFJndEN3WEhKY2JpQWdJQ0FnS2lCQWNtVjBkWEp1SUh0RmJHVnRaVzUwZlNBZ0lFaFVUVXdnMFkzUXU5QzEwTHpRdGRDOTBZSmNjbHh1SUNBZ0lDQXFMMXh5WEc0Z0lDQWdkR2hwY3k1ZkpHZGxkRVJoZVVKNVJHRjBaU0E5SUdaMWJtTjBhVzl1S0dSaGRHVXBJSHRjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NWZKRzF2Ym5Sb2N5NXhkV1Z5ZVZObGJHVmpkRzl5S0NjdVJHRjVXMlJoZEdFdGRHbHRaVDFjSWljZ0t5QmtZWFJsTG1kbGRGUnBiV1VvS1NBcklDZGNJbDBuS1R0Y2NseHVJQ0FnSUgxY2NseHVYSEpjYmlBZ0lDQXZLaXBjY2x4dUlDQWdJQ0FxSU5DZzBMWFF2ZEMwMExYUmdDRFF0TkM5MFk4Z0xTRFF0OUN3MExQUXU5R0QwWWpRdXRDNFhISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ0lIdEVZWFJsZlNCa1lYUmxJTkNlMExIUml0QzEwTHJSZ2lEUXROQ3cwWUxSaTF4eVhHNGdJQ0FnSUNvZ1FISmxkSFZ5YmlCN1JXeGxiV1Z1ZEgxY2NseHVJQ0FnSUNBcUwxeHlYRzRnSUNBZ2RHaHBjeTVmSkdOeVpXRjBaVVZ0Y0hSNVJHRjVJRDBnWm5WdVkzUnBiMjRvS1NCN1hISmNiaUFnSUNBZ0lDQWdZMjl1YzNRZ0pHUmhlU0E5SUhSb2FYTXVYeVJqY21WaGRHVkZiR1Z0Wlc1MEtGeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCZ1BHUnBkaUJqYkdGemN6MWNJa1JoZVNCcGN5MWxiWEIwZVZ3aVBqd3ZaR2wyUG1CY2NseHVJQ0FnSUNBZ0lDQXBPMXh5WEc1Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY200Z0pHUmhlVHRjY2x4dUlDQWdJSDFjY2x4dVhISmNiaUFnSUNBdktpcGNjbHh1SUNBZ0lDQXFJTkNoMEw3UXQ5QzAwTERRdmRDNDBMVWcwWTNRdTlDMTBMelF0ZEM5MFlMUXNDRFF1TkMzSUVoVVRVd2cwWUxRdGRDNjBZSFJndEN3WEhKY2JpQWdJQ0FnS2lCQWNHRnlZVzBnSUh0VGRISnBibWQ5SUdoMGJXd2dTRlJOVENEUmd0QzEwTHJSZ2RHQ1hISmNiaUFnSUNBZ0tpQkFjbVYwZFhKdUlIdEZiR1Z0Wlc1MGZWeHlYRzRnSUNBZ0lDb3ZYSEpjYmlBZ0lDQjBhR2x6TGw4a1kzSmxZWFJsUld4bGJXVnVkQ0E5SUdaMWJtTjBhVzl1S0doMGJXd3BJSHRjY2x4dUlDQWdJQ0FnSUNCamIyNXpkQ0JrYVhZZ1BTQmtiMk4xYldWdWRDNWpjbVZoZEdWRmJHVnRaVzUwS0Nka2FYWW5LVHRjY2x4dUlDQWdJQ0FnSUNCa2FYWXVhVzV6WlhKMFFXUnFZV05sYm5SSVZFMU1LQ2RoWm5SbGNtSmxaMmx1Snl3Z2FIUnRiQ2s3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUdScGRpNWphR2xzWkhKbGJpNXNaVzVuZEdnZ1BpQXhJRDhnWkdsMkxtTm9hV3hrY21WdUlEb2daR2wyTG1acGNuTjBSV3hsYldWdWRFTm9hV3hrTzF4eVhHNGdJQ0FnZlZ4eVhHNWNjbHh1SUNBZ0lDOHFLbHh5WEc0Z0lDQWdJQ29nVTJGbVpTRFFzdEdMMExmUXZ0Q3lJTkN5MEwzUXRkR0kwTDNRdU5HRklOR0IwTDdRc2RHTDBZTFF1TkM1SU5DNjBMN1F2TkMvMEw3UXZkQzEwTDNSZ3RDd1hISmNiaUFnSUNBZ0tpQkFjR0Z5WVcwZ2UxTjBjbWx1WjMwZ1ppRFFtTkM4MFk4ZzBZSFF2dEN4MFl2Umd0QzQwWTljY2x4dUlDQWdJQ0FxTDF4eVhHNGdJQ0FnZEdocGN5NWZZMkZzYkdKaFkyc2dQU0JtZFc1amRHbHZiaWhtS1NCN1hISmNiaUFnSUNBZ0lDQWdhV1lnS0hSNWNHVnZaaUIwYUdsekxtOXdkR2x2Ym5NdWIyNWJabDBnUFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2RHaHBjeTV2Y0hScGIyNXpMbTl1VzJaZExtRndjR3g1S0hSb2FYTXNJRnRkTG5Oc2FXTmxMbU5oYkd3b1lYSm5kVzFsYm5SekxDQXhLU2s3WEhKY2JpQWdJQ0FnSUNBZ2ZWeHlYRzVjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTQ3WEhKY2JpQWdJQ0I5WEhKY2JseHlYRzRnSUNBZ2RHaHBjeTVwYm1sMEtDazdYSEpjYm4xY2NseHVYSEpjYm1WNGNHOXlkQ0JrWldaaGRXeDBJRVJoZEdWU1lXNW5aVkJwWTJ0bGNqdGNjbHh1SWwwc0luTnZkWEpqWlZKdmIzUWlPaUlpZlE9PSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQgRGF0ZVJhbmdlUGlja2VyIGZyb20gJy4uLy4uL2Rpc3QvZGF0ZXJhbmdlcGlja2VyJztcclxuXHJcbmNvbnN0ICRmb3JtID0gZG9jdW1lbnQuZm9ybXNbMF07XHJcbmNvbnN0ICRkYXRlX2Zyb20gPSAkZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImRhdGVfZnJvbVwiXScpXHJcbmNvbnN0ICRkYXRlX3RvICAgPSAkZm9ybS5xdWVyeVNlbGVjdG9yKCdbbmFtZT1cImRhdGVfdG9cIl0nKVxyXG5cclxubmV3IERhdGVSYW5nZVBpY2tlcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGF0ZXJhbmdlcGlja2VyJyksIHtcclxuICAgIG9uOiB7XHJcbiAgICAgICAgcmFuZ2VTZWxlY3Q6IGZ1bmN0aW9uKGRhdGVfZnJvbSwgZGF0ZV90bykge1xyXG4gICAgICAgICAgICAkZGF0ZV9mcm9tLnZhbHVlID0gZGF0ZV9mcm9tLnRvTG9jYWxlRGF0ZVN0cmluZygpO1xyXG4gICAgICAgICAgICAkZGF0ZV90by52YWx1ZSA9IGRhdGVfdG8udG9Mb2NhbGVEYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXlTZWxlY3Q6IGZ1bmN0aW9uKGRhdGVfZnJvbSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGVfZnJvbVwiLCBkYXRlX2Zyb20pO1xyXG5cclxuICAgICAgICB9LFxyXG4gICAgfVxyXG59KTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==