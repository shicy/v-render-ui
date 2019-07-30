// 2019-06-04
// datetime

(function (frontend) {
	if (frontend && VRender.Component.ui.datetime)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UIDateTime = UI.datetime = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIDateTime = UIDateTime.prototype = new UI._base(false);

	_UIDateTime.init = function (target, options) {
		UI._base.init.call(this, target, options);

		let inputTarget = this.inputTag = this.$el.children(".ipt");
		inputTarget.on("tap", iptClickHandler.bind(this));
		inputTarget.on("tap", ".clear", clearBtnHandler.bind(this));

		this.$el.on("change", ".picker", function (e) { return false; });
	};

	// ====================================================
	_UIDateTime.val = function (value, options) {
		if (Utils.isNull(value)) {
			return this.getDate(options && options.format);
		}
		this.setDate(value);
		return this;
	};

	_UIDateTime.getDate = function (format) {
		let date = Utils.toDate(parseInt(this.$el.attr("data-dt")));
		if (date && Utils.isNotBlank(format))
			return Utils.toDateString(date, format);
		return date;
	};
	_UIDateTime.setDate = function (value) {
		let date = value ? Utils.toDate(value) : null;
		setDateInner.call(this, date);
		if (this.picker)
			setPickerDate.call(this, this.picker, date);
	};

	_UIDateTime.getMinDate = function () {
		return Utils.toDate(parseInt(this.$el.attr("opt-min")));
	};
	_UIDateTime.setMinDate = function (value) {
		let min = Utils.toDate(value);
		min = min && min.getTime() || "";
		if (min != this.$el.attr("opt-min")) {
			this.$el.attr("opt-min", min);
			rerenderPicker.call(this);
		}
	};

	_UIDateTime.getMaxDate = function () {
		return Utils.toDate(parseInt(this.$el.attr("opt-max")));
	};
	_UIDateTime.setMaxDate = function (value) {
		let max = Utils.toDate(value);
		max = max && max.getTime() || "";
		if (max != this.$el.attr("opt-max")) {
			this.$el.attr("opt-max", max);
			rerenderPicker.call(this);
		}
	};

	_UIDateTime.getDateFormat = function () {
		let options = this.options;
		if (options.hasOwnProperty("dateFormat"))
			return options.dateFormat;
		if (options.hasOwnProperty("format"))
			return options.format;
		let format = this.$el.children(".format");
		if (format && format.length > 0) {
			options.dateFormat = format.text() || null;
			if (options.dateFormat && format.is(".format-fn")) {
				options.dateFormat = unescape(options.dateFormat);
				options.dateFormat = "var Utils=VRender.Utils;return (" + options.dateFormat + ");";
				options.dateFormat = (new Function(options.dateFormat))();
			}
			format.remove();
		}
		return options.dateFormat;
	};
	_UIDateTime.setDateFormat = function (value) {
		this.options.dateFormat = value;
		this.$el.children(".format").remove();
		setDateInner.call(this, this.getDate());
	};

	_UIDateTime.getPrompt = function () {
		return this.inputTag.children(".prompt").text();
	};
	_UIDateTime.setPrompt = function (value) {
		this.inputTag.children(".prompt").remove();
		if (Utils.isNotNull(value)) {
			value = Utils.trimToEmpty(value);
			$("<span class='prompt'></span>").appendTo(this.inputTag).text(value);
		}
	};

	_UIDateTime.isSecondVisible = function () {
		if (!this.options.hasOwnProperty("showSecond")) {
			this.options.showSecond = !!this.$el.attr("opt-sec");
		}
		return Utils.isTrue(this.options.showSecond);
	};
	_UIDateTime.setSecondVisible = function (value) {
		value = Utils.isNull(value) ? true : Utils.isTrue(value);
		if (value != this.isSecondVisible()) {
			this.options.showSecond = value;
			rerender.call(this);
		}
	};

	_UIDateTime.getHours = function () {
		if (!this.options.hasOwnProperty("hours")) {
			this.options.hours = this.$el.attr("opt-hours");
		}
		let hours = Fn.getIntValues(this.options.hours, 0, 23);
		if (hours && hours.length > 0)
			return hours;
		return Utils.map(new Array(24), function (tmp, i) { return i; });
	};
	_UIDateTime.setHours = function (value) {
		this.options.hours = value;
		rerenderPicker.call(this);
	};

	_UIDateTime.getMinutes = function () {
		if (!this.options.hasOwnProperty("minutes")) {
			this.options.minutes = this.$el.attr("opt-minutes");
		}
		let minutes = Fn.getIntValues(this.options.minutes, 0, 59);
		if (minutes && minutes.length > 0)
			return minutes;
		return Utils.map(new Array(60), function (tmp, i) { return i; });
	};
	_UIDateTime.setMinutes = function (value) {
		this.options.minutes = value;
		rerenderPicker.call(this);
	};

	_UIDateTime.getSeconds = function () {
		if (!this.options.hasOwnProperty("seconds")) {
			this.options.seconds = this.$el.attr("opt-seconds");
		}
		let seconds = Fn.getIntValues(this.options.seconds, 0, 59);
		if (seconds && seconds.length > 0)
			return seconds;
		return Utils.map(new Array(60), function (tmp, i) { return i; });
	};
	_UIDateTime.setSeconds = function (value) {
		this.options.seconds = value;
		rerenderPicker.call(this);
	};

	// ====================================================
	_UIDateTime._snapshoot_shoot = function (state, date) {
		state.data = date || this.getDate();
	};

	_UIDateTime._snapshoot_compare = function (state, date) {
		date = date || this.getDate();
		if (date && state.data)
			return date.getTime() == state.data.getTime();
		return date == state.data;
	};

	_UIDateTime.rerender = function () {
		rerender.call(this);
	};
	
	// ====================================================
	const iptClickHandler = function (e) {
		showDatePicker.call(this);
	};

	const clearBtnHandler = function (e) {
		setDateInner.call(this, null);
		if (this.picker) {
			setPickerDate.call(this, this.picker, null);
			checkPickerEnabled.call(this);
		}
		return false;
	};

	const mouseHoverHandler = function (e) {
		Fn.mouseDebounce(e, hideDatePicker.bind(this));
	};

	const pickerChangeHandler = function (e) {
		let date = getPickerDate.call(this, this.picker);
		setDateInner.call(this, getLimitDate.call(this, date));
		checkPickerEnabled.call(this, this.picker);
		return false;
	};

	const pickerTapHandler = function (e) {
		if ($(e.target).is(".picker"))
			hideDatePicker.call(this);
	};

	const pickerScrollHandler = function (e) {
		this.beScrolled = true;
		let target = $(e.currentTarget);
		let items = target.children();
		let height = items.eq(0).height();
		let scrollTop = target.scrollTop();
		let index = parseInt(scrollTop / height);
		if (index > 0 && (scrollTop % height) < (height / 2)) {
			index -= 1;
		}

		let item = items.eq(index);
		if (item.is(".selected"))
			return ;
		items.filter(".selected").removeClass("selected");
		item.addClass("selected");

		if (target.is(".year, .month")) {
			let year = parseInt(this.picker.find(".col.year .selected").text());
			let month = parseInt(this.picker.find(".col.month .selected").text());
			updatePickerDays.call(this, this.picker, year, month);
		}
		checkPickerEnabled.call(this, this.picker);

		let date = getPickerDate.call(this, this.picker);
		setDateInner.call(this, getLimitDate.call(this, date));
	};

	const pickerTouchHandler = function (e) {
		if (e.type == "touchstart") {
			if (this.t_touchend) {
				clearTimeout(this.t_touchend);
			}
			this.t_touchend = null;
		}
		else if (e.type == "touchend") {
			if (this.beScrolled) {
				this.beScrolled = false;
				let date = getPickerDate.call(this, this.picker);
				let time = date && date.getTime() || 0;
				let waitToStop = () => {
					this.t_touchend = setTimeout(() => {
						this.t_touchend = null;
						let _date = getPickerDate.call(this, this.picker);
						let _time = _date && _date.getTime() || 0;
						if (time == _time) {
							scrollToDate.call(this, this.picker, _date);
						}
						else {
							time = _time;
							waitToStop();
						}
					}, 200);
				};
				waitToStop();
			}
		}
	};

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-datetime");

		let options = this.options || {};

		// 容器，用于下拉列表定位
		target.attr("opt-box", options.container);

		if (this.isSecondVisible())
			target.attr("opt-sec", "1");

		let minDate = Utils.toDate(options.min);
		target.attr("opt-min", minDate ? minDate.getTime() : null);

		let maxDate = Utils.toDate(options.max);
		target.attr("opt-max", maxDate ? maxDate.getTime() : null);

		if (Utils.isArray(options.hours))
			target.attr("opt-hours", options.hours.join(",") || null);
		if (Utils.isArray(options.minutes))
			target.attr("opt-minutes", options.minutes.join(",") || null);
		if (Utils.isArray(options.seconds))
			target.attr("opt-seconds", options.seconds.join(",") || null);

		renderView.call(this, $, target, options.date);

		return this;
	};

	_Renderer.isSecondVisible = function () {
		return Utils.isTrue(this.options.showSecond);
	};

	_Renderer.getDateFormat = function () {
		return this.options.dateFormat || this.options.format;
	};

	// ====================================================
	const rerender = function () {
		Utils.debounce("datetime_render-" + this.getViewId(), () => {
			setDateInner.call(this, this.getDate());
			if (this.picker) {
				renderPicker.call(this, this.picker.empty());
			}
		});
	};

	const rerenderPicker = function () {
		if (this.picker) {
			Utils.debounce("datetime_render-" + this.getViewId(), () => {
				renderPicker.call(this, this.picker.empty());
			});
		}
	};

	const renderView = function ($, target, date) {
		let iptTarget = $("<div class='ipt'></div>").appendTo(target);
		let input = $("<input type='text' readonly='readonly'/>").appendTo(iptTarget);
		iptTarget.append("<span class='clear'></span>");

		let prompt = this.options.prompt;
		if (Utils.isNotBlank(prompt)) {
			$("<span class='prompt'></span>").appendTo(iptTarget).text(prompt);
		}

		let dateFormat = this.getDateFormat();

		date = Utils.toDate(date);
		if (date) {
			let showSecond = this.isSecondVisible();

			date.setMilliseconds(0);
			if (!showSecond)
				date.setSeconds(0);

			target.addClass("has-val").attr("data-dt", date.getTime());
			input.val(getFormatDate(date, this.getDateFormat(), showSecond));
		}

		if (!frontend && dateFormat) {
			if (Utils.isFunction(dateFormat))
				target.write("<div class='ui-hidden format format-fn'>" + escape(dateFormat) + "</div>");
			else
				target.write("<div class='ui-hidden format'>" + dateFormat + "</div>");
		}
	};

	const renderPicker = function (picker) {
		if (this._isRenderAsApp()) {
			let cols = $("<div class='cols'></div>").appendTo(picker);
			let addCol = (name, values) => {
				let col = $("<div class='col'></div>").appendTo(cols);
				col.addClass(name);
				Utils.each(values, (temp) => {
					$("<div class='item'></div>").appendTo(col).text(temp);
				});
			};
			addCol("year", getYears.call(this));
			addCol("month", getMonths.call(this));
			addCol("day", []); // getDays.call(this)
			addCol("hour", this.getHours());
			addCol("minute", this.getMinutes());
			if (this.isSecondVisible())
				addCol("second", this.getSeconds());
		}
		else {
			UI.datepicker.create({target: picker, min: this.getMinDate(), max: this.getMaxDate()});

			let timeBar = $("<div class='timebar'></div>").appendTo(picker);
			let hourCombo = UI.select.create({target: timeBar, name: "hour", data: this.getHours()});
			timeBar.append("<span class='tip'>时</span>");
			let minuteCombo = UI.select.create({target: timeBar, name: "minute", data: this.getMinutes()});
			timeBar.append("<span class='tip'>分</span>");
			if (this.isSecondVisible()) {
				let secondCombo = UI.select.create({target: timeBar, name: "second", data: this.getSeconds()});
				timeBar.append("<span class='tip'>秒</span>");
			}
		}

		let date = this.getDate();
		updatePickerDays.call(this, picker, (date ? date.getFullYear() : null), 
			(date ? (date.getMonth() + 1) : null));
		setPickerDate.call(this, picker, date);
		checkPickerEnabled.call(this, picker);
	};

	///////////////////////////////////////////////////////
	const showDatePicker = function () {
		if (!this.picker) {
			this.picker = $("<div class='picker'></div>").appendTo(this.$el);
			renderPicker.call(this, this.picker);
		}

		if (this.$el.is(".show-picker"))
			return ;
		let target = this.$el.addClass("show-picker");

		let picker = this.picker;
		if (this._isRenderAsApp()) {
			$("html,body").addClass("ui-scrollless");
			picker.on("tap", pickerTapHandler.bind(this));
			picker.on("touchstart", pickerTouchHandler.bind(this));
			picker.on("touchend", pickerTouchHandler.bind(this));
			picker.find(".col").on("scroll", pickerScrollHandler.bind(this));
		}
		else {
			target.on("mouseenter", mouseHoverHandler.bind(this));
			target.on("mouseleave", mouseHoverHandler.bind(this));
			picker.on("change", pickerChangeHandler.bind(this));

			let offset = Utils.offset(picker, this._getScrollContainer(), 0, picker[0].scrollHeight);
			if (offset.isOverflowY)
				target.addClass("show-before");
		}

		scrollToDate.call(this, picker, this.getDate());

		setTimeout(() => {
			target.addClass("animate-in");
		});
	};

	const hideDatePicker = function () {
		let target = this.$el.addClass("animate-out");

		if (this._isRenderAsApp()) {
			$("html,body").removeClass("ui-scrollless");
			this.picker.off("tap").off("touchstart").off("touchend");
			this.picker.find(".col").off("scroll");
		}
		else {
			target.off("mouseenter").off("mouseleave");
			this.picker.off("change");
		}

		setTimeout(() => {
			target.removeClass("show-picker").removeClass("show-before");
			target.removeClass("animate-in").removeClass("animate-out");
		}, 300);
	};

	const getPickerDate = function (picker) {
		if (this._isRenderAsApp()) {
			let target = picker.children(".cols");
			let year = parseInt(target.children(".year").find(".selected").text()) || 0;
			let month = parseInt(target.children(".month").find(".selected").text()) || 1;
			let day = parseInt(target.children(".day").find(".selected").text()) || 1;
			let hour = parseInt(target.children(".hour").find(".selected").text()) || 0;
			let minute = parseInt(target.children(".minute").find(".selected").text()) || 0;
			let second = parseInt(target.children(".second").find(".selected").text()) || 0;
			return new Date(year, month - 1, day, hour, minute, second);
		}
		else {
			let datePicker = UI.datepicker.find(picker)[0];
			if (!datePicker)
				return null;
			let date = datePicker.getDate();
			if (date) {
				let VComponent = VRender.Component;
				let hourCombo = VComponent.get(picker.find("[name=hour]"));
				date.setHours(parseInt(hourCombo.getSelectedKey()) || 0);
				let minuteCombo = VComponent.get(picker.find("[name=minute]"));
				date.setMinutes(parseInt(minuteCombo.getSelectedKey()) || 0);
				if (this.isSecondVisible()) {
					let secondCombo = VComponent.get(picker.find("[name=second]"));
					date.setSeconds(parseInt(secondCombo.getSelectedKey()) || 0);
				}
			}
			return date;
		}
	};

	const setPickerDate = function (picker, date) {
		if (this._isRenderAsApp()) {
			let target = picker.children(".cols");
			target.find(".selected").removeClass("selected");
			let select = (name, value) => {
				let col = target.children("." + name);
				let item = Utils.find(col.children(), (temp) => {
					return temp.text() == value;
				});
				if (item && item.length > 0)
					item.addClass("selected");
			};
			if (date) {
				select("year", date.getFullYear());
				select("month", date.getMonth() + 1);
				select("day", date.getDate());
				select("hour", date.getHours());
				select("minute", date.getMinutes());
				select("second", date.getSeconds());
			}
			else {
				select("year", (new Date()).getFullYear());
			}
		}
		else {
			let VComponent = VRender.Component;
			let datePicker = UI.datepicker.find(picker)[0];
			datePicker && datePicker.setDate(date);
			let hourCombo = VComponent.get(picker.find("[name=hour]"));
			hourCombo && hourCombo.setSelectedKey(date ? date.getHours() : "");
			let minuteCombo = VComponent.get(picker.find("[name=minute]"));
			minuteCombo && minuteCombo.setSelectedKey(date ? date.getMinutes() : "");
			let secondCombo = VComponent.get(picker.find("[name=second]"));
			secondCombo && secondCombo.setSelectedKey(date ? date.getSeconds() : "");
		}
	};

	const scrollToDate = function (picker, date) {
		let target = picker.children(".cols");
		let scroll = (name, value) => {
			let col = target.children("." + name);
			let item = Utils.find(col.children(), (temp) => {
				return temp.text() == value;
			});
			if (item && item.length > 0) {
				let scrollTop = (item.index() + 1) * item.height();
				col.scrollTop(scrollTop);
			}
		};
		if (date) {
			scroll("year", date.getFullYear());
			scroll("month", date.getMonth() + 1);
			scroll("day", date.getDate());
			scroll("hour", date.getHours());
			scroll("minute", date.getMinutes());
			scroll("second", date.getSeconds());
		}
		else {
			target.children().scrollTop(0);
			scroll("year", (new Date()).getFullYear());
		}
	};

	const updatePickerDays = function (picker, year, month) {
		if (!year) {
			let date = new Date();
			year = date.getFullYear();
		}
		let days = getDays.call(this, year, month);
		let target = picker.find(".col.day");
		let current = target.find(".selected").text();
		target.empty();
		Utils.each(days, (temp) => {
			let item = $("<div class='item'></div>").appendTo(target).text(temp);
			if (temp == current)
				item.addClass("selected");
		});
	};

	const checkPickerEnabled = function (picker) {
		// 暂不实现
	};

	const setDateInner = function (date) {
		let snapshoot = this._snapshoot();
		if (date) {
			this.$el.addClass("has-val").attr("data-dt", date.getTime());
			let showSecond = this.isSecondVisible();
			let formatDate = getFormatDate(date, this.getDateFormat(), showSecond);
			this.inputTag.find("input").val(formatDate);
		}
		else {
			this.$el.removeClass("has-val").attr("data-dt", "");
			this.inputTag.find("input").val("");
		}
		snapshoot.done();
	};

	// ====================================================
	const getLimitDate = function (date) {
		if (date) {
			let _date = date.getTime();
			let min = this.getMinDate();
			if (min && min.getTime() > _date) {
				_date = min.getTime();
				date = new Date(_date);
			}
			let max = this.getMaxDate();
			if (max && max.getTime() < _date) {
				_date = max.getTime();
				date = new Date(_date);
			}
		}
		return date || null;
	};

	const getFormatDate = function (date, dateFormat, showSecond) {
		if (date) {
			if (Utils.isFunction(dateFormat))
				return dateFormat(date);
			if (Utils.isBlank(dateFormat)) {
				if (showSecond)
					dateFormat = "yyyy-MM-dd HH:mm:ss";
				else
					dateFormat = "yyyy-MM-dd HH:mm";
			}
			return Utils.toDateString(date, dateFormat);
		}
		return "";
	};

	const getYears = function () {
		let date = new Date();
		let year = date.getFullYear() + 100;
		let years = [];
		for (let i = 0; i < 200; i++) {
			years.push(year--);
		}
		return years;
	};

	const getMonths = function () {
		return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	};

	const getDays = function (year, month) {
		let days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
			21, 22, 23, 24, 25, 26, 27, 28];
		if (month == 2) {
			if ((year % 400 == 0) || ((year % 4 == 0) && (year % 100 != 0)))
				days.push(29);
		}
		else {
			days.push(29);
			days.push(30);
			if ([1, 3, 5, 7, 10, 12].indexOf(month) >= 0)
				days.push(31);
		}
		return days;
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIDateTime = UIDateTime;
		UI.init(".ui-datetime", UIDateTime, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");