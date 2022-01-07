/*! For license information please see page.js.LICENSE.txt */
(()=>{var t={197:t=>{var e;self,e=function(){return(()=>{"use strict";var t={d:(e,o)=>{for(var i in o)t.o(o,i)&&!t.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:o[i]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};return t.r({}),(()=>{t.r(e),t.d(e,{LOCK_UNAVAILABLE:()=>o,LOCK_LOCKED:()=>i,default:()=>s});const o=1,i=2;function n(t,e={}){if(t.instance)return t.instance;t.instance=this,this._$container=t;const o=(t,e)=>void 0===t?e:t;this.options={firstDayOfTheWeek:o(e.firstDayOfTheWeek,1)%7,singleMode:o(e.singleMode,!1),locale:o(e.locale,"ru-RU"),minDays:o(e.minDays,1),monthsCount:o(e.monthsCount,12),perRow:o(e.perRow,void 0),currentDate:o(e.currentDate,new Date),selectedDate:o(e.selectedDate,new Date),minDate:o(e.minDate,void 0),maxDate:o(e.maxDate,void 0),breakpoints:o(e.breakpoints,{}),internalInputs:o(e.internalInputs,!0),readOnly:o(e.readOnly,!1),on:Object.assign({rangeSelect:null,daySelect:null},e.on||{}),filter:Object.assign({lockDays:null,tooltipText:null},e.filter||{})},this.init()}n.prototype.init=function(){void 0===this.options.perRow&&(this.options.perRow=this.options.monthsCount),this.options.currentDate&&this.options.currentDate instanceof Date||(this.options.currentDate=new Date),this.options.selectedDate&&this.options.selectedDate instanceof Date||(this.options.selectedDate=new Date(this.options.currentDate.getTime())),["minDate","currentDate","selectedDate","maxDate"].forEach((t=>{this.options[t]&&this.options[t]instanceof Date&&this.options[t].setHours(0,0,0,0)})),this.options.breakpoints[this._breakpoint=0]=Object.assign({},this.options),this._$picker=this._$createElement(`<div class="Daterangepicker">\n            ${this.options.internalInputs?`<div class="Daterangepicker__inputs">\n                    ${this.options.singleMode?'<input type="hidden" name="date">':'<input type="hidden" name="date_from">\n                           <input type="hidden" name="date_to">'}\n                </div>`:""}\n            <div class="Daterangepicker__months"></div>\n            <div class="Daterangepicker__tooltip">\n                <div class="Daterangepicker__tooltip-content"></div>\n            </div>\n        </div>`),this._$months=this._$picker.querySelector(".Daterangepicker__months"),this._$tooltip=this._$picker.querySelector(".Daterangepicker__tooltip"),this._$tooltipContent=this._$picker.querySelector(".Daterangepicker__tooltip-content"),this._$inputs=this._$picker.querySelectorAll('input[name^="date"]'),this._selection={},this._visualSelection={},this.selectDate(this.options.selectedDate),this._$container.appendChild(this._$picker),Object.keys(this.options.breakpoints).length&&(window.addEventListener("resize",this._onWindowResizeEvent.bind(this)),this._onWindowResizeEvent())},n.prototype.getMonthFormatted=function(t){const e=this.getDateTimeFormat(t,{month:"long"});return e.slice(0,1).toUpperCase()+e.slice(1)},n.prototype.getDateTimeFormat=function(t,e){return Intl.DateTimeFormat(this.options.locale,e).format(t)},n.prototype.getWeekDaysFormatted=function(){const t=new Date,e=[];t.setDate(t.getDate()-t.getDay()),t.setDate(t.getDate()+this.options.firstDayOfTheWeek);for(let o=0;o<7;++o)e.push({day:t.getDay(),title:this.getDateTimeFormat(t,{weekday:"short"})}),t.setDate(t.getDate()+1);return e},n.prototype.getDaysCountInMonth=function(t){const e=new Date(t.getTime());return e.setDate(1),e.setHours(0,0,0,0),e.setMonth(e.getMonth()+1),e.setDate(0),e.getDate()},n.prototype.rangeReset=function(){this._rangeVisualReset(),this._selection={},this._callback("rangeReset")},n.prototype.rangeSelect=function(t,e){if(!(t instanceof Date&&e instanceof Date))return;if(t.setHours(0,0,0,0),e.setHours(0,0,0,0),!this.getIsRangeSelectable(t,e))return;const o=this._$getDayByDate(t),i=this._$getDayByDate(e);o&&o.classList.add("is-selected","is-selected-from"),i&&i.classList.add("is-selected","is-selected-to"),this._rangeVisualSelect(t,e),this._selection.date_from=t,this._selection.date_to=e,t>e&&([t,e]=[e,t]),this._$inputs[0]&&(this._$inputs[0].value=this.formatDate(t)),this._$inputs[1]&&(this._$inputs[1].value=this.formatDate(e)),this._callback("rangeSelect",t,e)},n.prototype.formatDate=function(t,e="Y-m-d"){if(t instanceof Date)return e.replace("Y",t.getFullYear()).replace("m",("0"+(t.getMonth()+1)).slice(-2)).replace("d",("0"+t.getDate()).slice(-2))},n.prototype.getIsRangeSelectable=function(t,e){if(t.setHours(0,0,0,0),e.setHours(0,0,0,0),t>e&&([t,e]=[e,t]),Math.abs(t.getTime()-e.getTime())/1e3/86400<this.options.minDays)return!1;const o=new Date(t.getTime());for(;o<e;){if(this._filterLockDays(o))return!1;o.setDate(o.getDate()+1)}return!0},n.prototype.getDateFrom=function(){if(this._selection.date_from)return this._selection.date_to&&this._selection.date_from>this._selection.date_to?this._selection.date_to:this._selection.date_from},n.prototype.getDate=n.prototype.getDateFrom,n.prototype.getDateTo=function(){if(this._selection.date_to)return this._selection.date_from&&this._selection.date_from>this._selection.date_to?this._selection.date_from:this._selection.date_to},n.prototype.plural=function(t,e){return(t%10==1&&t%100!=11?e[0]:t%10>=2&&t%10<=4&&(t%100<10||t%100>=20)?e[1]:e[2]).replace("%d",t)},n.prototype._$createMonths=function(t){for(;this._$months.lastElementChild;)this._$months.removeChild(this._$months.lastElementChild);this._tooltipHide();const e=new Date(t.getTime());e.setDate(1),e.setHours(0,0,0,0);const o=[];for(let t=0;t<this.options.monthsCount;++t)o.push(this._$createMonth(e)),e.setMonth(e.getMonth()+1);for(let t=0;t<o.length;t+=this.options.perRow){const e=document.createElement("div");e.className="Daterangepicker__row",o.slice(t,t+this.options.perRow).forEach((t=>{e.appendChild(t)})),this._$months.appendChild(e)}(this._selection.date_from||this._selection.date_to)&&this._rangeVisualSelect(this._selection.date_from,this._selection.date_to)},n.prototype._$createMonth=function(t){const e=t.getMonth(),o=this.getMonthFormatted(t),i=this.getWeekDaysFormatted(),n=this._$createElement(`<div class="Month" data-time="${t.getTime()}">\n            <div class="Month__header">\n                <div class="Month__arrow Month__arrow--prev${this.options.minDate&&t<=this.options.minDate?" is-disabled":""}">\n                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">\n                        <path d="M7 13L1 7L7 1" stroke="#8C8C8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>\n                    </svg>\n                </div>\n                <div class="Month__title">${o} ${t.getFullYear()}</div>\n                <div class="Month__arrow Month__arrow--next${this.options.maxDate&&t>=this.options.maxDate?" is-disabled":""}">\n                    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">\n                        <path d="M1 0.999999L7 7L1 13" stroke="#8C8C8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>\n                    </svg>\n                </div>\n            </div>\n            <div class="Month__week">${i.map((t=>`<div class="Month__weekday">${t.title}</div>`)).join("")}</div>\n            <div class="Month__days"></div>\n        </div>`);[{selector:".Month__arrow--prev",name:"prev"},{selector:".Month__arrow--next",name:"next"}].forEach((t=>{const e=n.querySelector(t.selector);e.addEventListener("click",(o=>{o.stopPropagation(),this._onArrowClick(e,t.name)}))}));const s=n.querySelector(".Month__days"),a=new Date(t.getTime());for(a.setDate(1),a.setHours(0,0,0,0);a.getMonth()==e;){const t=this._$createWeek();i.forEach((o=>{a.getDay()==o.day&&a.getMonth()==e?(t.appendChild(this._$createDay(a)),a.setDate(a.getDate()+1)):t.appendChild(this._$createEmptyDay())})),s.appendChild(t)}return n},n.prototype._onArrowClick=function(t,e){if(t.classList.contains("is-disabled"))return!1;const o=new Date(parseInt(this._$months.querySelector(".Month").dataset.time,10));if(o.setDate(1),o.setHours(0,0,0,0),o.setMonth(o.getMonth()+("prev"==e?-this.options.monthsCount:this.options.monthsCount)),o<this.options.minDate&&o.setTime(this.options.minDate.getTime()),this.options.maxDate){const t=new Date(o.getTime());t.setMonth(t.getMonth()+this.options.monthsCount),t>this.options.maxDate&&(o.setTime(this.options.maxDate.getTime()),o.setMonth(o.getMonth()-this.options.monthsCount+1))}this.selectDate(o)},n.prototype.selectDate=function(t){this.options.selectedDate=t,this._$createMonths(t),this._callback("selectDate",t)},n.prototype._$createWeek=function(t){return this._$createElement('<div class="Week"></div>')},n.prototype._$createDay=function(t){const e=this._$createElement(`<div class="Day" data-time="${t.getTime()}" data-day="${t.getDay()}">${t.getDate()}</div>`);return this.options.readOnly||(e.addEventListener("click",this._onDayClickEvent.bind(this)),this.options.singleMode||e.addEventListener("mouseenter",this._onDayMouseEnterEvent.bind(this))),this._updateDay(e),e},n.prototype.update=function(){this._$months.querySelectorAll(".Month").forEach((t=>{this._updateMonth(t)}))},n.prototype._updateMonth=function(t){t.querySelectorAll(".Day[data-time]").forEach((t=>{this._updateDay(t)}))},n.prototype._updateDay=function(t){const e=new Date(parseInt(t.dataset.time,10)),o=this._filterLockDays(e),n=this.options.currentDate.getTime()==e.getTime();t.classList.toggle("is-disabled",o),t.classList.toggle("is-locked",o==i),t.classList.toggle("is-today",n)},n.prototype._onDayClickEvent=function(t){this._onDayClick(t.target)},n.prototype._onDayMouseEnterEvent=function(t){this._onDayMouseEnter(t.target)},n.prototype._onDayMouseEnter=function(t){if(!this._selection.date_from||this._selection.date_to)return;if(t.dataset.time==this._selection.date_from.getTime())return;const e=new Date(parseInt(t.dataset.time,10));this._rangeVisualSelect(this._selection.date_from,e)},n.prototype._onDayClick=function(t){if(t.classList.contains("is-disabled"))return!1;if(this.options.singleMode)return this.rangeReset(),this._selection.date_from=new Date(parseInt(t.dataset.time,10)),t.classList.add("is-selected"),void this._callback("daySelect",this._selection.date_from);if(this._selection.date_from&&this._selection.date_to&&this.rangeReset(),t.classList.add("is-selected"),this._selection.date_from?this._selection.date_to||(this._selection.date_to=new Date(parseInt(t.dataset.time,10))):this._selection.date_from=new Date(parseInt(t.dataset.time,10)),this._selection.date_from&&this._selection.date_to){if(!this.getIsRangeSelectable(this._selection.date_from,this._selection.date_to))return void this.rangeReset();this.rangeSelect(this._selection.date_from,this._selection.date_to)}},n.prototype._rangeVisualReset=function(){this._$months.querySelectorAll(".Day[data-time]").forEach((t=>{t.classList.remove("is-selected","is-selected-from","is-selected-to","is-selected-between")})),this._tooltipHide()},n.prototype._rangeVisualSelect=function(t,e){t&&t instanceof Date&&t.setHours(0,0,0,0),e&&e instanceof Date&&e.setHours(0,0,0,0);let o=t instanceof Date?t.getTime():0,i=e instanceof Date?e.getTime():0;o>i&&([o,i]=[i,o]);const n=this._$months.querySelectorAll(".Day[data-time]");for(let t=0;t<n.length;++t)n[t].classList.toggle("is-selected-between",n[t].dataset.time>o&&n[t].dataset.time<i);const s=this._$getDayByDate(t),a=this._$getDayByDate(e);if(this._visualSelection.$day_from_old&&this._visualSelection.$day_from_old!=s&&this._visualSelection.$day_from_old.classList.remove("is-selected","is-selected-from"),this._visualSelection.$day_to_old&&this._visualSelection.$day_to_old!=a&&this._visualSelection.$day_to_old.classList.remove("is-selected","is-selected-to"),s&&s.classList.add("is-selected","is-selected-from"),a&&a.classList.add("is-selected","is-selected-to"),this._visualSelection.$day_from_old=s,this._visualSelection.$day_to_old=a,this._selection.$day_from=s,this._selection.$day_to=a,a){const t=Math.floor(Math.abs(o-i)/864e5)+1;this._tooltipShow(t)}},n.prototype._tooltipShow=function(t){this._$tooltipContent.textContent=this._filterTooltipText(t),this._$tooltip.classList.toggle("is-show",this._$tooltip.textContent.length),this._tooltipUpdate()},n.prototype._tooltipUpdate=function(){if(!this._selection.$day_to)return;let t=0,e=0,o=this._selection.$day_to;do{e+=o.offsetTop,t+=o.offsetLeft}while((o=o.offsetParent)&&o!=this._$picker);this._$tooltip.style.top=Math.round(e-this._$tooltip.offsetHeight)+"px",this._$tooltip.style.left=Math.round(t+this._selection.$day_to.offsetWidth/2-this._$tooltip.offsetWidth/2)+"px"},n.prototype._tooltipHide=function(){this._$tooltip.classList.remove("is-show")},n.prototype._filterTooltipText=function(t){return"function"==typeof this.options.filter.tooltipText?this.options.filter.tooltipText.call(this,t)||"":this.plural(t,["%d день","%d дня","%d дней"]).replace("%d",t)},n.prototype._filterLockDays=function(t){return t<this.options.minDate||t>this.options.maxDate?o:"function"==typeof this.options.filter.lockDays&&this.options.filter.lockDays.call(this,t)},n.prototype._onWindowResizeEvent=function(t){this._selection.$day_to&&this._tooltipUpdate();let e=0;const o=Object.keys(this.options.breakpoints).sort(((t,e)=>t-e));for(let t in o)if(window.innerWidth<=o[t]){e=o[t];break}this._setBreakpoint(e)},n.prototype._setBreakpoint=function(t){this._breakpoint!=t&&(this._breakpoint=t,this.options.breakpoints[t]&&(Object.assign(this.options,this.options.breakpoints[t]),this._$createMonths(this.options.selectedDate)))},n.prototype._$getDayByDate=function(t){const e=t instanceof Date?t.getTime():0;return this._$months.querySelector('.Day[data-time="'+e+'"]')},n.prototype._$createEmptyDay=function(){return this._$createElement('<div class="Day is-empty"></div>')},n.prototype._$createElement=function(t){const e=document.createElement("div");return e.insertAdjacentHTML("afterbegin",t),e.children.length>1?e.children:e.firstElementChild},n.prototype._callback=function(t){if("function"==typeof this.options.on[t])return this.options.on[t].apply(this,[].slice.call(arguments,1))};const s=n})(),e})()},t.exports=e()}},e={};function o(i){var n=e[i];if(void 0!==n)return n.exports;var s=e[i]={exports:{}};return t[i](s,s.exports,o),s.exports}o.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return o.d(e,{a:e}),e},o.d=(t,e)=>{for(var i in e)o.o(e,i)&&!o.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{"use strict";var t=o(197),e=o.n(t);function i(t,o={}){if(t.instance)return t.instance;this._bookingDates={},e().call(this,t,o),this._$picker.classList.add("Daterangepicker-wrapper")}i.prototype=Object.create(e().prototype,{constructor:{value:i,enumerable:!1,writable:!0}}),i.prototype._filterTooltipText=function(t){if("function"==typeof this.options.filter.tooltipText)return this.options.filter.tooltipText.call(this,t)||"";const e=t-1;return this.plural(e,["%d ночь","%d ночи","%d ночей"]).replace("%d",e)},i.prototype.setBookingDates=function(t){Array.isArray(t)&&(t=t.reduce(((t,e)=>("string"==typeof e&&(e=new Date(e)),e instanceof Date&&(e.setHours(0,0,0,0),t[e]=e),t)),{})),this._bookingDates=t,this.update()},i.prototype._filterLockDays=function(o){return this._bookingDates[o]?t.LOCK_LOCKED:e().prototype._filterLockDays.call(this,o)},i.prototype._rangeVisualSelect=function(t,o){e().prototype._rangeVisualSelect.call(this,t,o),this._$months.querySelectorAll(".Month").forEach((t=>{t.querySelectorAll(".Week").forEach((t=>{const e=t.querySelectorAll(".Day.is-selected, .Day.is-selected-between");let o=t.querySelector(".Days__selected");o&&this._unwrapDaysSelected(o),e.length&&(o=this._$createElement('<div class="Days__selected"></div>'),t.insertBefore(o,e[0]),e.forEach((t=>{o.appendChild(t)})))}))}))},i.prototype._rangeVisualReset=function(){e().prototype._rangeVisualReset.call(this),this._$months.querySelectorAll(".Days__selected").forEach(this._unwrapDaysSelected)},i.prototype._unwrapDaysSelected=function(t){for(;t.firstElementChild;)t.parentElement.insertBefore(t.firstElementChild,t);t.parentElement.removeChild(t)};const n=i;function s(t,e={}){if(t.instance)return t.instance;Object.defineProperty(this,"_isMobile",{get:()=>window.innerWidth<=960}),Object.defineProperty(this,"_autoApply",{get:()=>!this._isMobile}),this._$dropdown=this._$createElement('<div class="Daterangepicker-dropdown">\n            <div class="Daterangepicker-dropdown__header">\n                <div class="Daterangepicker-dropdown__header-close">\n                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n                        <path d="M24 8L2 8M2 8L8.5 14.5M2 8L8.5 1.5" stroke="black" stroke-width="2"/>\n                    </svg>\n                </div>\n                <div class="Daterangepicker-dropdown__header-title">Даты поездки</div>\n            </div>\n            <div class="Daterangepicker-dropdown__wrapper"></div>\n            <div class="Daterangepicker-dropdown__footer">\n                <div class="Daterangepicker-dropdown__confirm">\n                    <div class="Daterangepicker-dropdown__confirm-button">\n                        Применить\n                    </div>\n                </div>\n            </div>\n        </div>'),this._$dropdownWrapper=this._$dropdown.querySelector(".Daterangepicker-dropdown__wrapper"),this._$element=t,this._$close=this._$dropdown.querySelector(".Daterangepicker-dropdown__header-close"),this._$close&&this._$close.addEventListener("click",this.close.bind(this)),this._$dropdownFooter=this._$dropdown.querySelector(".Daterangepicker-dropdown__footer"),this._$dropdownConfirmButton=this._$dropdown.querySelector(".Daterangepicker-dropdown__confirm-button"),this._$dropdownWrapper.addEventListener("scroll",this.updateFooterVisibility.bind(this)),this._$dropdownConfirmButton&&this._$dropdownConfirmButton.addEventListener("click",this.apply.bind(this)),n.call(this,this._$dropdownWrapper,Object.assign({},e,{monthsCount:2,singleMode:!1,breakpoints:{960:{monthsCount:12}}})),this._$element.appendChild(this._$dropdown),this._$element.addEventListener("click",this._onClickEvent.bind(this))}s.prototype=Object.create(n.prototype,{constructor:{value:s,enumerable:!1,writable:!0}}),s.prototype.init=function(){n.prototype.init.call(this),this._$dropdown.classList.add("is-initialized")},s.prototype._onClickEvent=function(t){this.open()},s.prototype._onDocumentClickEvent=function(t){this._$dropdown.contains(t.target)||this.close()},s.prototype.open=function(){if(!this._$dropdown.classList.contains("is-opened")){if(this._$dropdown.classList.add("is-opened"),this._isMobile){document.body.classList.add("modal-active");const t=this._$dropdown.querySelector(".is-selected-from");t&&t.scrollIntoView({block:"center",behavior:"smooth"}),window.history.pushState({daterangepicker:!0},"Выбор дат"),this._onPopStateEventBind=this._onPopStateEvent.bind(this),window.addEventListener("popstate",this._onPopStateEventBind)}this._tooltipUpdate(),this._onDocumentClickEventBind||(this._onDocumentClickEventBind=this._onDocumentClickEvent.bind(this),setTimeout((()=>{document.addEventListener("click",this._onDocumentClickEventBind)}),0))}},s.prototype.close=function(){this._$dropdown.classList.contains("is-opened")&&(this._isMobile&&(document.body.classList.remove("modal-active"),window.removeEventListener("popstate",this._onPopStateEventBind)),this._onDocumentClickEventBind&&(document.removeEventListener("click",this._onDocumentClickEventBind),delete this._onDocumentClickEventBind),setTimeout((()=>{this._$dropdown.classList.remove("is-opened"),this._autoApply||(delete this._enableRangeSelectCallback,this._lastAppliedDateFrom&&this._lastAppliedDateTo&&setTimeout((()=>{this._selection.date_from=this._lastAppliedDateFrom,this._selection.date_to=this._lastAppliedDateTo,this._rangeVisualSelect(this._lastAppliedDateFrom,this._lastAppliedDateTo)}),200))}),0))},s.prototype.rangeReset=function(){n.prototype.rangeReset.call(this),console.log("rangeReset"),this.updateFooterVisibility()},s.prototype.rangeSelect=function(t,e){n.prototype.rangeSelect.call(this,t,e),this.updateFooterVisibility(),this._autoApply&&this.apply()},s.prototype._callback=function(t){(this._autoApply||"rangeSelect"!=t||this._enableRangeSelectCallback)&&n.prototype._callback.apply(this,arguments)},s.prototype.apply=function(){const t=this.getDateFrom(),e=this.getDateTo();this._lastAppliedDateFrom=t,this._lastAppliedDateTo=e,t&&e&&(this._autoApply||(this._enableRangeSelectCallback=!0,n.prototype.rangeSelect.call(this,t,e)),this._$element.dispatchEvent(new Event("change",{bubbles:!0,cancelable:!0})),this.close())},s.prototype.getDateTitleFormatted=function(t){if(!(t&&t instanceof Date))return"";const e=new Intl.DateTimeFormat("ru-RU",{month:"short"}).format(t).replace(".",""),o=new Intl.DateTimeFormat("ru-RU",{weekday:"short"}).format(t);return t.getDate()+" "+e+', <font color="#8C8C8C">'+o+"</font>"},s.prototype.updateFooterVisibility=function(){void 0===this._dropdownContainerPrevScroll&&(this._dropdownContainerPrevScroll=this._$dropdownWrapper.scrollTop);const t=!!this.getDateFrom()&&!!this.getDateTo(),e=(this._dropdownContainerPrevScroll,this._$dropdownWrapper.scrollTop,[t].every((t=>t)));this._$dropdownFooter.classList.toggle("is-active",e),this._dropdownContainerPrevScroll=this._$dropdownWrapper.scrollTop},s.prototype._onPopStateEvent=function(t){this.close()};const a=s,r=document.forms[0],l=document.forms[1],c=function(){const t={},e=new Date;e.setHours(0,0,0,0);for(let o=0;o<60;++o)Math.random()>.6&&(t[e]=!0),e.setDate(e.getDate()+1);return t}();!function(){const o=new Date;o.setDate(1),o.setMonth(o.getMonth()-12);const i=new Date;i.setDate(1),i.setMonth(i.getMonth()+12),i.setDate(0),new(e())(document.querySelector("#daterangepicker"),{minDate:o,maxDate:i,monthsCount:2,perRow:3,singleMode:!1,internalInputs:!1,breakpoints:{960:{monthsCount:12},720:{monthsCount:3},480:{monthsCount:1}},on:{rangeSelect:function(t,e){r.elements.date_from.value=t.toLocaleDateString(),r.elements.date_to.value=e.toLocaleDateString()},daySelect:function(t){r.elements.date_from.value=t.toLocaleDateString()}},filter:{lockDays:function(e){return!!c[e]&&t.LOCK_LOCKED}}})}(),new a(document.querySelector("#daterangepicker-dropdown"),{minDate:new Date,maxDate:new Date("2022-05-20"),monthsCount:2,perRow:3,singleMode:!1,internalInputs:!1,breakpoints:{960:{monthsCount:12}},on:{rangeSelect:function(t,e){l.elements.date_from.value=this.formatDate(t,"Y-m-d"),l.elements.date_to.value=this.formatDate(e,"Y-m-d")},daySelect:function(t){l.elements.date_from.value=t.toLocaleDateString()}},filter:{lockDays:function(e){return!!c[e]&&t.LOCK_LOCKED},tooltipText:function(t){const e=t-1;return this.plural(e,["%d ночь","%d ночи","%d ночей"]).replace("%d",e)}}}).setBookingDates(function(){const t=[],e=new Date;e.setHours(0,0,0,0);for(let o=0;o<100;++o){if(~[4,5].indexOf(e.getDay())){const o=new Date;o.setTime(e.getTime()),t.push(o)}e.setDate(e.getDate()+1)}return t}())})()})();