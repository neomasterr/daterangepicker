import EventEmitter from '@neomasterr/event-emitter';
import DateRangePicker, {createElement} from './daterangepicker-wrapper';

function DateRangePickerDropdown($element, options = {}) {
    // наследование
    EventEmitter.call(this, options.on);

    // элементы
    this._$element = $element;

    // определение мобилки
    Object.defineProperty(this, '_isMobile', {
        get: () => window.innerWidth <= 960,
    });

    // автоподтверждение выбранных дат
    Object.defineProperty(this, '_autoApply', {
        get: () => !this._isMobile,
    });

    this._$dropdown = createElement(
        `<div class="Daterangepicker-dropdown">
            <div class="Daterangepicker-dropdown__header">
                <div class="Daterangepicker-dropdown__header-close">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 8L2 8M2 8L8.5 14.5M2 8L8.5 1.5" stroke="black" stroke-width="2"/>
                    </svg>
                </div>
                <div class="Daterangepicker-dropdown__header-title">Даты поездки</div>
            </div>
            <div class="Daterangepicker-dropdown__wrapper"></div>
            <div class="Daterangepicker-dropdown__footer">
                <div class="Daterangepicker-dropdown__confirm">
                    <div class="Daterangepicker-dropdown__confirm-button">
                        Применить
                    </div>
                </div>
            </div>
        </div>`
    );
    this._$dropdownWrapper = this._$dropdown.querySelector('.Daterangepicker-dropdown__wrapper');

    /////////////
    // мобилка //
    /////////////

    // закрытие модалки
    this._$close = this._$dropdown.querySelector('.Daterangepicker-dropdown__header-close');
    if (this._$close) {
        this._$close.addEventListener('click', this.close.bind(this));
    }

    // контейнер для элемента датапикера
    this._$dropdownFooter        = this._$dropdown.querySelector('.Daterangepicker-dropdown__footer');
    this._$dropdownConfirmButton = this._$dropdown.querySelector('.Daterangepicker-dropdown__confirm-button');

    // обновление видимости футера модалки при прокрутке
    this._$dropdownWrapper.addEventListener('scroll', this.updateFooterVisibility.bind(this));

    // кнопка подтверждения
    if (this._$dropdownConfirmButton) {
        this._$dropdownConfirmButton.addEventListener('click', this.apply.bind(this));
    }

    // наследуемся
    this.datepicker = new DateRangePicker(this._$dropdownWrapper, Object.assign({}, options.datepicker, {
        monthsCount: 2,
        singleMode: false,
        breakpoints: {
            960: {
                monthsCount: 12,
            },
        },
    }));

    this.datepicker.on('range-select', (date_from, date_to) => {
        // видимость кнопки "Применить" на мобилке
        this.updateFooterVisibility();

        // на мобилке событие rangeSelect вызывается только по кнопке "Применить"
        if (!this._autoApply && !this._enableRangeSelectCallback) {
            return;
        }

        this.apply();
    });

    this.datepicker.on('range-reset', () => {
        // видимость кнопки "Применить" на мобилке
        this.updateFooterVisibility();
    });

    // обёртка элементов
    this._$element.appendChild(this._$dropdown);
    this._$element.addEventListener('click', this._onClickEvent.bind(this));

    // плавные анимации
    this._$dropdown.classList.add('is-initialized');
}

Object.assign(DateRangePickerDropdown.prototype, EventEmitter.prototype);
Object.defineProperty(DateRangePickerDropdown.prototype, 'constructor', {
    value: DateRangePickerDropdown,
    writable: true,
    enumerable: false,
});

/**
 * Событие клика на контейнер
 * @param {Event} e DOM событие
 */
DateRangePickerDropdown.prototype._onClickEvent = function(e) {
    this.open();
}

/**
 * Событие клика вне элемента
 * @param {Event} e DOM событие
 */
DateRangePickerDropdown.prototype._onDocumentClickEvent = function(e) {
    if (this._$dropdown.contains(e.target)) {
        return;
    }

    this.close();
}

/**
 * Показ элемента
 */
DateRangePickerDropdown.prototype.open = function() {
    if (this._$dropdown.classList.contains('is-opened')) {
        return;
    }
    this._$dropdown.classList.add('is-opened');

    // мобилка
    if (this._isMobile) {
        document.body.classList.add('modal-active');

        // прокрутка до предвыбранных дат
        const $dayFrom = this._$dropdown.querySelector('.is-selected-from');
        if ($dayFrom) {
            $dayFrom.scrollIntoView({
                block: 'center',
                behavior: 'smooth',
            });
        }

        // манипуляции с историей браузера
        window.history.pushState({
            daterangepicker: true,
        }, 'Выбор дат');
        this._onPopStateEventBind = this._onPopStateEvent.bind(this);
        window.addEventListener('popstate', this._onPopStateEventBind);
    }

    // обновление позиции подсказки
    this.datepicker._tooltipUpdate();

    // позволяем событию завершиться
    if (!this._onDocumentClickEventBind) {
        this._onDocumentClickEventBind = this._onDocumentClickEvent.bind(this);
        setTimeout(() => {
            document.addEventListener('click', this._onDocumentClickEventBind);
        }, 0);
    }
}

/**
 * Скрытие элемента
 */
DateRangePickerDropdown.prototype.close = function() {
    if (!this._$dropdown.classList.contains('is-opened')) {
        return;
    }

    // мобилка
    if (this._isMobile) {
        document.body.classList.remove('modal-active');

        // манипуляции с историей браузера
        window.removeEventListener('popstate', this._onPopStateEventBind);
    }

    if (this._onDocumentClickEventBind) {
        document.removeEventListener('click', this._onDocumentClickEventBind);
        delete this._onDocumentClickEventBind;
    }

    // позволяем событию завершиться
    setTimeout(() => {
        this._$dropdown.classList.remove('is-opened');

        if (!this._autoApply) {
            // необходимость ручного подтверждения выбора дат
            delete this._enableRangeSelectCallback;

            // выбираем последние подтверждённые даты
            if (this._lastAppliedDateFrom && this._lastAppliedDateTo) {
                setTimeout(() => {
                    this.datepicker._selection.date_from = this._lastAppliedDateFrom;
                    this.datepicker._selection.date_to = this._lastAppliedDateTo;
                    this.datepicker._rangeVisualSelect(this._lastAppliedDateFrom, this._lastAppliedDateTo);
                }, 200);
            }
        }
    }, 0);
}

/**
 * Подтверждение выбора дат
 */
DateRangePickerDropdown.prototype.apply = function() {
    const date_from = this.datepicker.getDateFrom();
    const date_to   = this.datepicker.getDateTo();

    this._lastAppliedDateFrom = date_from;
    this._lastAppliedDateTo   = date_to;

    if (!date_from || !date_to) {
        return;
    }

    this._$element.dispatchEvent(new Event('change', {
        bubbles: true,
        cancelable: true,
    }));

    this.emit('apply', date_from, date_to);
    this.close();
}

/**
 * Форматирование даты
 * @param  {Date} date Дата
 * @return {String}    Дата в формате - 8 март, чт
 */
DateRangePickerDropdown.prototype.getDateTitleFormatted = function(date) {
    if (!date || !(date instanceof Date)) {
        return '';
    }

    const month = new Intl.DateTimeFormat('ru-RU', {month: 'short'}).format(date).replace('.', '');
    const weekday = new Intl.DateTimeFormat('ru-RU', {weekday: 'short'}).format(date);
    return date.getDate() + ' ' + month + ', <font color="#8C8C8C">' + weekday + '</font>';
}

/**
 * Обновление состояния футера в модалке
 * скрывается при прокрутке вверх и если не выбраны даты
 */
DateRangePickerDropdown.prototype.updateFooterVisibility = function() {
    if (typeof this._dropdownContainerPrevScroll == 'undefined') {
        this._dropdownContainerPrevScroll = this._$dropdownWrapper.scrollTop;
    }

    const bothDatesSelected = !!this.datepicker.getDateFrom() && !!this.datepicker.getDateTo();
    const scrolledDown = this._dropdownContainerPrevScroll >= this._$dropdownWrapper.scrollTop;
    const isActive = [
        bothDatesSelected,
        // scrolledDown,
    ].every(v => v);

    this._$dropdownFooter.classList.toggle('is-active', isActive);
    this._dropdownContainerPrevScroll = this._$dropdownWrapper.scrollTop;
}

/**
 * Событие нажатия кнопки "назад" в браузере
 * @param {Event} e DOM Событие
 */
DateRangePickerDropdown.prototype._onPopStateEvent = function(e) {
    this.close();
}

DateRangePickerDropdown.prototype.setBookingDates = function() {
    this.datepicker.setBookingDates.apply(this.datepicker, arguments);
}

export default DateRangePickerDropdown;
