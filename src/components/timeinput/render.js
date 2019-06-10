// 2019-06-10
// timeinput

(function (frontend) {
	if (frontend && VRender.Component.ui.timeinput)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UITimeInput = UI.timeinput = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UITimeInput = UITimeInput.prototype = new UI._base(false);

	_UITimeInput.init = function (target, options) {
		UI._base.init.call(this, target, options);

		let inputTarget = this.inputTag = this.$el.children(".ipt");
		inputTarget.on("tap", iptClickHandler.bind(this));
		inputTarget.on("tap", ".clear", clearBtnHandler.bind(this));

		if (!this._isRenderAsApp()) {
			this.$el.on("tap", ".picker .item", pickerItemClickHandler.bind(this));
		}
	};

	// ====================================================
	_UITimeInput.getTime = function () {
		return this.$el.attr("data-t") || "";
	};
	_UITimeInput.setTime = function (value) {
		let time = getTime(value, this.isSecondVisible());
		setTimeInner.call(this, time);
		if (this.picker)
			rerenderPicker.call(this, this.picker.empty());
	};

	_UITimeInput.getMinTime = function () {
		return this.$el.attr("opt-min") || "";
	};
	_UITimeInput.setMinTime = function (value) {
		let time = getTime(value, true);
		this.$el.attr("opt-min", time);
		if (this.picker)
			checkPickerEnabled.call(this, this.picker);
	};

	_UITimeInput.getMaxTime = function () {
		return this.$el.attr("opt-max") || "";
	};
	_UITimeInput.setMaxTime = function (value) {
		let time = getTime(value, true);
		this.$el.attr("opt-max", time);
		if (this.picker)
			checkPickerEnabled.call(this, this.picker);
	};

	_UITimeInput.isSecondVisible = function () {
		if (!this.options.hasOwnProperty("showSecond")) {
			this.options.showSecond = !!this.$el.attr("opt-sec");
		}
		return Utils.isTrue(this.options.showSecond);
	};
	_UITimeInput.setSecondVisible = function (value) {
		value = Utils.isNull(value) ? true : Utils.isTrue(value);
		if (value == this.isSecondVisible())
			return ;
		this.options.showSecond = value;
		rerender.call(this);
	};

	_UITimeInput.isUse12Hour = function () {
		if (!this.options.hasOwnProperty("use12Hour")) {
			this.options.use12Hour = !!this.$el.attr("opt-h12");
		}
		return Utils.isTrue(this.options.use12Hour);
	};
	_UITimeInput.setUse12Hour = function (value) {
		value = Utils.isNull(value) ? true : Utils.isTrue(value);
		if (value == this.isUse12Hour())
			return ;
		this.options.use12Hour = value;
		rerender.call(this);
	};

	_UITimeInput.getHours = function () {
		if (!this.options.hasOwnProperty("hours")) {
			this.options.hours = this.$el.attr("opt-hours");
		}
		let use12Hour = this.isUse12Hour();
		let hours = Fn.getIntValues(this.options.hours, 0, (use12Hour ? 11 : 23));
		if (hours && hours.length > 0)
			return hours;
		return Utils.map(new Array(use12Hour ? 12 : 24), function (tmp, i) { return i; });
	};
	_UITimeInput.setHours = function (value) {
		this.options.hours = value;
		rerenderPicker.call(this);
	};

	_UITimeInput.getMinutes = function () {
		if (!this.options.hasOwnProperty("minutes")) {
			this.options.minutes = this.$el.attr("opt-minutes");
		}
		let minutes = Fn.getIntValues(this.options.minutes, 0, 59);
		if (minutes && minutes.length > 0)
			return minutes;
		return Utils.map(new Array(60), function (tmp, i) { return i; });
	};
	_UITimeInput.setMinutes = function (value) {
		this.options.minutes = value;
		rerenderPicker.call(this);
	};

	_UITimeInput.getSeconds = function () {
		if (!this.options.hasOwnProperty("seconds")) {
			this.options.seconds = this.$el.attr("opt-seconds");
		}
		let seconds = Fn.getIntValues(this.options.seconds, 0, 59);
		if (seconds && seconds.length > 0)
			return seconds;
		return Utils.map(new Array(60), function (tmp, i) { return i; });
	};
	_UITimeInput.setSeconds = function (value) {
		this.options.seconds = value;
		rerenderPicker.call(this);
	};

	_UITimeInput.isReadonly = function () {
		return this.$el.attr("opt-readonly") == 1;
	};
	_UITimeInput.setReadonly = function (value) {
		if (Utils.isNull(value) || Utils.isTrue(value)) {
			this.$el.attr("opt-readonly", "1");
		}
		else {
			this.$el.removeAttr("opt-readonly");
		}
	};

	_UITimeInput.getPrompt = function () {
		return this.inputTag.find(".prompt").text();
	};
	_UITimeInput.setPrompt = function (value) {
		this.inputTag.find(".prompt").remove();
		if (Utils.isNotBlank(value)) {
			$("<span class='prompt'></span>").appendTo(this.inputTag).text(value);
		}
	};

	// ====================================================
	_UITimeInput._snapshoot_shoot = function (state) {
		state.data = this.getTime();
	};

	_UITimeInput._snapshoot_compare = function (state) {
		return state.data == this.getTime();
	};

	_UITimeInput.rerender = function () {
		Utils.debounce("timeinput_render-" + this.getViewId(), () => {
			setTimeInner.call(this, this.getTime());
			if (this.picker)
				renderPicker.call(this, this.picker.empty());
		});
	};
	

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-timeipt");

		let options = this.options || {};

		// 容器，用于下拉列表定位
		target.attr("opt-box", options.container);

		if (this.isSecondVisible())
			target.attr("opt-sec", "1");

		if (this.isUse12Hour())
			target.attr("opt-h12", "1");

		if (Utils.isTrue(options.readonly)) {
			target.attr("opt-readonly", "1");
		}

		target.attr("opt-min", getTime(options.min, true) || null);
		target.attr("opt-max", getTime(options.max, true) || null);

		if (Utils.isArray(options.hours))
			target.attr("opt-hours", options.hours.join(",") || null);
		if (Utils.isArray(options.minutes))
			target.attr("opt-minutes", options.minutes.join(",") || null);
		if (Utils.isArray(options.seconds))
			target.attr("opt-seconds", options.seconds.join(",") || null);

		renderTimeInput.call(this, $, target, options.time);

		return this;
	};

	// ====================================================
	_Renderer.isSecondVisible = function () {
		return Utils.isTrue(this.options.showSecond);
	};

	_Renderer.isUse12Hour = function () {
		return Utils.isTrue(this.options.use12Hour);
	};


	///////////////////////////////////////////////////////
	const iptClickHandler = function (e) {
		if (!this.isReadonly())
			showTimePicker.call(this);
	};

	const clearBtnHandler = function (e) {
		setTimeInner.call(this, null);
		if (this.picker)
			setPickerTime.call(this, this.picker, "");
		return false;
	};

	const mouseHoverHandler = function (e) {
		Fn.mouseDebounce(e, hideTimePicker.bind(this));
	};

	const pickerTapHandler = function (e) {
		if ($(e.target).is(".picker"))
			hideTimePicker.call(this);
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
				let time = getPickerTime.call(this, this.picker);
				let waitToStop = () => {
					this.t_touchend = setTimeout(() => {
						this.t_touchend = null;
						let _time = getPickerTime.call(this, this.picker);
						if (time == _time) {
							scrollToTime.call(this, this.picker, _time);
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

		checkPickerEnabled.call(this, this.picker);

		let time = getPickerTime.call(this, this.picker);
		setTimeInner.call(this, getLimitTime.call(this, time));
	};

	const pickerItemClickHandler = function (e) {
		let item = $(e.currentTarget);
		if (item.is(".selected"))
			return ;
		item.addClass("selected").siblings().removeClass("selected");

		checkPickerEnabled.call(this, this.picker);

		let time = getPickerTime.call(this, this.picker);
		setTimeInner.call(this, getLimitTime.call(this, time));

		return false;
	};

	// ====================================================
	const renderTimeInput = function ($, target, time) {
		let iptTarget = $("<div class='ipt'></div>").appendTo(target);
		let input = $("<input type='text' readonly='readonly'/>").appendTo(iptTarget);
		iptTarget.append("<span class='clear'></span>");

		let prompt = this.options.prompt;
		if (Utils.isNotBlank(prompt)) {
			$("<span class='prompt'></span>").appendTo(iptTarget).text(prompt);
		}

		time = getTime(time, this.isSecondVisible());
		if (time) {
			input.val(this.isUse12Hour() ? get12HourTime(time) : time);
			target.addClass("has-val").attr("data-t", time);
		}
	};

	const renderPicker = function (picker) {
		let target = $("<div class='cols'></div>").appendTo(picker);

		let addCol = (name, values) => {
			let col = $("<div class='col'></div>").appendTo(target);
			col.addClass(name);
			Utils.each(values, (temp) => {
				$("<div class='item'></div>").appendTo(col).text(temp);
			});
		};

		// 时
		addCol("hour", this.getHours());
		// 分
		addCol("minute", this.getMinutes());
		// 秒
		if (this.isSecondVisible())
			addCol("second", this.getSeconds());
		if (this.isUse12Hour())
			addCol("apm", ["AM", "PM"]);

		setPickerTime.call(this, picker, this.getTime());
		checkPickerEnabled.call(this, picker);

		if (this._isRenderAsApp())
			target.children(".col").on("scroll", pickerScrollHandler.bind(this));
	};

	const rerenderPicker = function () {
		if (this.picker) {
			Utils.debounce("timeinput_renderpicker-" + this.getViewId(), () => {
				renderPicker.call(this, this.picker.empty());
			});
		}
	};

	// ====================================================
	const setTimeInner = function (time) {
		let snapshoot = this._snapshoot();
		this.$el.attr("data-t", time || "");
		let input = this.inputTag.find("input");
		if (time) {
			time = getTime(time, this.isSecondVisible());
			input.val(this.isUse12Hour() ? get12HourTime(time) : time);
			this.$el.addClass("has-val");
		}
		else {
			input.val("");
			this.$el.removeClass("has-val");
		}
		snapshoot.done();
	};

	const showTimePicker = function () {
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
		}
		else {
			target.on("mouseenter", mouseHoverHandler.bind(this));
			target.on("mouseleave", mouseHoverHandler.bind(this));

			let offset = Utils.offset(picker, this._getScrollContainer(), 0, picker[0].scrollHeight);
			if (offset.isOverflowY)
				target.addClass("show-before");
		}

		scrollToTime.call(this, picker, this.getTime());

		setTimeout(() => {
			target.addClass("animate-in");
		});
	};

	const hideTimePicker = function () {
		let target = this.$el.addClass("animate-out");

		if (this._isRenderAsApp()) {
			$("html,body").removeClass("ui-scrollless");
			this.picker.off("tap").off("touchstart").off("touchend");
		}
		else {
			target.off("mouseenter").off("mouseleave");
		}

		setTimeout(() => {
			target.removeClass("show-picker").removeClass("show-before");
			target.removeClass("animate-in").removeClass("animate-out");
		}, 300);
	};

	const scrollToTime = function (picker, time) {
		let _renderAsApp = this._isRenderAsApp();
		let target = picker.children(".cols");
		if (time) {
			let use12Hour = this.isUse12Hour();
			let scroll = (name, value) => {
				let col = target.children("." + name);
				let item = Utils.find(col.children(), function (temp) {
					return temp.text() == value;
				});
				if (item && item.length > 0) {
					let scrollTop = item.index() * item.height();
					if (_renderAsApp)
						scrollTop += item.height();
					col.scrollTop(scrollTop);
				}
			};
			time = time.split(":");
			let hour = parseInt(time[0]) || 0;
			scroll("hour", ((hour > 11 && use12Hour) ? (hour - 12) : hour));
			scroll("minute", parseInt(time[1]) || 0);
			scroll("second", parseInt(time[2]) || 0);
			if (_renderAsApp && use12Hour) {
				scroll("apm", (hour < 12 ? "AM" : "PM"));
			}
		}
		else if (_renderAsApp) {
			target.children().scrollTop(0);
		}
	};

	const getPickerTime = function (picker) {
		let target = picker.children(".cols");
		let time = [];
		// 时
		let hour = parseInt(target.children(".hour").find(".selected").text()) || 0;
		if (this.isUse12Hour()) {
			if (target.children(".apm").find(".selected").text() == "PM")
				hour += 12;
		}
		time.push((hour < 10 ? "0" : "") + hour);
		// 分
		let minute = parseInt(target.children(".minute").find(".selected").text()) || 0;
		time.push((minute < 10 ? "0" : "") + minute);
		// 秒
		if (this.isSecondVisible()) {
			let second = parseInt(target.children(".second").find(".selected").text()) || 0;
			time.push((second < 10 ? "0" : "") + second);
		}
		return time.join(":");
	};

	const setPickerTime = function (picker, time) {
		let target = picker.children(".cols");
		target.find(".selected").removeClass("selected");
		if (time) {
			let setSelected = (name, value) => {
				let col = target.children("." + name);
				let item = Utils.find(col.children(), (temp) => {
					return temp.text() == value;
				});
				if (item && item.length > 0)
					item.addClass("selected");
			};
			
			time = time.split(":");
			let hour = parseInt(time[0]) || 0;

			if (this.isUse12Hour()) {
				setSelected("apm", (hour < 12 ? "AM" : "PM"));
				if (hour > 11)
					hour -= 12;
			}

			setSelected("hour", hour);
			setSelected("minute", parseInt(time[1]) || 0);
			if (this.isSecondVisible())
				setSelected("second", parseInt(time[2]) || 0);
		}
	};

	const checkPickerEnabled = function (picker) {
		let target = picker.children(".cols");

		let min = (this.getMinTime() || "00:00:00").split(":");
		let max = (this.getMaxTime() || "23:59:59").split(":");
		let minHour = parseInt(min[0]) || 0;
		let minMinute = parseInt(min[1]) || 0;
		let minSecond = parseInt(min[2]) || 0;
		let maxHour = parseInt(max[0]) || 0;
		let maxMinute = parseInt(max[1]) || 0;
		let maxSecond = parseInt(max[2]) || 0;

		let ispm = target.children(".apm").find(".selected").text() == "PM";
		let hour = -1, minute = -1;

		let _min = minHour * 10000, _max = maxHour * 10000, _time = 0;
		Utils.each(target.children(".hour").children(), (item) => {
			let _hour = (parseInt(item.text()) || 0) + (ispm ? 12 : 0);
			let _t = _time + _hour * 10000;
			if (_t < _min || _t > _max)
				item.addClass("disabled");
			else
				item.removeClass("disabled");
			if (item.is(".selected"))
				hour = _hour;
		});

		_min += minMinute * 100; _max += maxMinute * 100; _time += (hour < 0 ? 0 : (hour * 10000));
		Utils.each(target.children(".minute").children(), (item) => {
			let _minute = parseInt(item.text()) || 0;
			let _t = _time + _minute * 100;
			if (_t < _min || _t > _max)
				item.addClass("disabled");
			else
				item.removeClass("disabled");
			if (item.is(".selected"))
				minute = _minute;
		});

		_min += minSecond; _max += maxSecond; _time += (minute < 0 ? 0 : (minute * 100));
		Utils.each(target.children(".second").children(), (item) => {
			item.removeClass("disabled");
			let _second = parseInt(item.text()) || 0;
			let _t = _time + _second;
			if (_t < _min || _t > _max)
				item.addClass("disabled");
		});

		Utils.each(target.children(".apm").children(), (item) => {
			item.removeClass("disabled");
			if (item.text() == "AM" && minHour > 11)
				item.addClass("disabled");
			else if (item.text() == "PM" && maxHour < 12)
				item.addClass("disabled");
		});
	};

	// ====================================================
	const getLimitTime = function (time) {
		let min = this.getMinTime();
		if (min && time < min)
			time = min;
		let max = this.getMaxTime();
		if (max && time > max)
			time = max;
		return time;
	};

	const getTime = function (value, showSecond) {
		if (value) {
			value = value.split(":");
			let hour = Math.max(0, parseInt(value[0])) || 0;
			let minute = Math.max(0, parseInt(value[1])) || 0;
			let second = Math.max(0, parseInt(value[2])) || 0;

			if (second > 59) {
				minute += parseInt(second / 60);
				second = second % 60;
			}
			if (minute > 59) {
				hour += parseInt(minute / 60);
				minute = minute % 60;
			}
			if (hour > 23) {
				hour = hour % 24;
			}

			let time = [];
			time.push((hour < 10 ? "0" : "") + hour);
			time.push((minute < 10 ? "0" : "") + minute);
			if (showSecond)
				time.push((second < 10 ? "0" : "") + second);
			return time.join(":");
		}
		return "";
	};

	const get12HourTime = function (time) {
		if (time) {
			time = time.split(":");
			let hour = Math.max(0, parseInt(time[0])) || 0;
			if (hour > 11) {
				time[0] = hour - 12;
				if (time[0] < 10)
					time[0] = "0" + time[0];
			}
			return getAPMName(hour) + " " + time.join(":");
		}
		return "";
	};

	const getAPMName = function (hour) {
		if (hour < 6)
			return "凌晨";
		if (hour < 12)
			return "上午";
		if (hour < 14)
			return "中午";
		if (hour < 18)
			return "下午";
		return "晚上";
	};
	

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UITimeInput = UITimeInput;
		UI.init(".ui-timeipt", UITimeInput, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");