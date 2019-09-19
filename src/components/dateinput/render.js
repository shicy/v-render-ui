// 2019-06-03
// dateinput

(function (frontend) {
	if (frontend && VRender.Component.ui.dateinput)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UIDateInput = UI.dateinput = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIDateInput = UIDateInput.prototype = new UI._base(false);

	_UIDateInput.init = function (target, options) {
		UI._base.init.call(this, target, options);

		let inputTarget = this.inputTag = this.$el.children(".ipt");

		inputTarget.on("tap", ".clear", clearHandler.bind(this));
		this.$el.on("change", ".ui-datepicker", onPickerChangeHandler.bind(this));
		if (this._isRenderAsApp() && this.isNative()) {
			renderOriginDates.call(this);
		}
		else {
			inputTarget.on("tap", iptClickHandler.bind(this));
		}
	};

	// ====================================================
	_UIDateInput.val = function (value, options) {
		if (Utils.isNull(value)) {
			return this.getDate(options && options.format || "yyyy-MM-dd");
		}
		this.setDate(value);
		return this;
	};

	_UIDateInput.getDate = function (format) {
		let date = Utils.toDate(this.$el.attr("data-dt"));
		if (date && Utils.isNotBlank(format))
			return Utils.toDateString(date, format);
		return date;
	};
	_UIDateInput.setDate = function (value) {
		let date = value ? Utils.toDate(value) : null;
		if (setDateInner.call(this, date))
			updatePicker.call(this, date, this.getMinDate(), this.getMaxDate());
	};

	_UIDateInput.getMinDate = function () {
		return Utils.toDate(this.$el.attr("opt-min"));
	};
	_UIDateInput.setMinDate = function (value) {
		let min = Utils.toDate(value);
		if (getTime(min) != getTime(this.getMinDate())) {
			this.$el.attr("opt-min", (min ? Utils.toDateString(min, "yyyy-MM-dd") : ""));
			updatePicker.call(this, this.getDate(), min, this.getMaxDate());
		}
	};

	_UIDateInput.getMaxDate = function () {
		return Utils.toDate(this.$el.attr("opt-max"));
	};
	_UIDateInput.setMaxDate = function (value) {
		let max = Utils.toDate(value);
		if (getTime(max) != getTime(this.getMaxDate())) {
			this.$el.attr("opt-max", (max ? Utils.toDateString(max, "yyyy-MM-dd") : ""));
			updatePicker.call(this, this.getDate(), this.getMinDate(), max);
		}
	};

	_UIDateInput.getDateFormat = function () {
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
	_UIDateInput.setDateFormat = function (value) {
		this.options.dateFormat = value;
		this.$el.children(".format").remove();
		setDateInner.call(this, this.getDate());
	};

	_UIDateInput.getPrompt = function () {
		return this.inputTag.children(".prompt").text();
	};
	_UIDateInput.setPrompt = function (value) {
		this.inputTag.children(".prompt").remove();
		if (Utils.isNotNull(value)) {
			value = Utils.trimToEmpty(value);
			$("<span class='prompt'></span>").appendTo(this.inputTag).text(value);
		}
	};

	_UIDateInput.isNative = function () {
		return this.$el.attr("opt-native") == 1;
	};

	// ====================================================
	_UIDateInput._snapshoot_shoot = function (state, date) {
		state.data = date || this.getDate();
	};

	_UIDateInput._snapshoot_compare = function (state, date) {
		date = date || this.getDate();
		if (date && state.data) {
			return date.getDate() == state.data.getDate() 
				&& date.getMonth() == state.data.getMonth() 
				&& date.getFullYear() == state.data.getFullYear();
		}
		return date == state.data;
	};

	// ====================================================
	const iptClickHandler = function (e) {
		showDatePicker.call(this);
	};

	const clearHandler = function (e) {
		if (setDateInner.call(this, null))
			updatePicker.call(this, null, this.getMinDate(), this.getMaxDate());
		this.trigger("clear");
		return false;
	};

	const pickerChangeHandler = function (e, date) {
		hideDatePicker.call(this);
		setDateInner.call(this, date);
	};

	const pickerClearHandler = function (e) {
		hideDatePicker.call(this);
		setDateInner.call(this, null);
	};

	const originDateChangeHandler = function (e) {
		setDateInner.call(this, Utils.toDate($(e.currentTarget).val()));
	};

	// 禁止 UIDatePicker 原生 jquery change 事件传播
	const onPickerChangeHandler = function (e) {
		// e.stopPropagation();
		return false;
	};

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-dateipt");

		let options = this.options || {};

		if (Utils.isTrue(options.native))
			target.attr("opt-native", "1");

		// 容器，用于下拉列表定位
		target.attr("opt-box", options.container);

		let minDate = Utils.toDate(options.min);
		target.attr("opt-min", minDate ? Utils.toDateString(minDate, "yyyy-MM-dd") : null);

		let maxDate = Utils.toDate(options.max);
		target.attr("opt-max", maxDate ? Utils.toDateString(maxDate, "yyyy-MM-dd") : null);

		renderView.call(this, $, target, Utils.toDate(options.date));

		return this;
	};

	// ====================================================
	_Renderer.getDateFormat = function () {
		return this.options.dateFormat || this.options.format;
	};

	// ====================================================
	const renderView = function ($, target, date) {
		let iptTarget = $("<div class='ipt'></div>").appendTo(target);
		let input = $("<input type='text' readonly='readonly'/>").appendTo(iptTarget);
		iptTarget.append("<span class='clear'></span>");

		let prompt = this.options.prompt;
		if (Utils.isNotBlank(prompt)) {
			$("<span class='prompt'></span>").appendTo(iptTarget).text(prompt);
		}

		let dateFormat = this.getDateFormat();
		if (date) {
			target.addClass("has-val").attr("data-dt", Utils.toDateString(date, "yyyy-MM-dd"));
			input.val(getFormatDate(date, dateFormat) || "");
		}

		if (!frontend && dateFormat) {
			if (Utils.isFunction(dateFormat))
				target.write("<div class='ui-hidden format format-fn'>" + escape(dateFormat) + "</div>");
			else
				target.write("<div class='ui-hidden format'>" + dateFormat + "</div>");
		}
	};
	
	const renderOriginDates = function () {
		let dateInput = $("<input class='origin-dateipt' type='date'/>").appendTo(this.inputTag);
		updatePicker.call(this, this.getDate(), this.getMinDate(), this.getMaxDate());
		dateInput.on("change", originDateChangeHandler.bind(this));
	};

	///////////////////////////////////////////////////////
	const updatePicker = function (date, min, max) {
		Utils.debounce("dateinput_picker-" + this.getViewId(), () => {
			if (this._isRenderAsApp() && this.isNative()) {
				let dateInput = this.inputTag.children(".origin-dateipt");
				dateInput.val(date ? Utils.toDateString(date, "yyyy-MM-dd") : "");
				dateInput.attr("min", (min ? Utils.toDateString(min, "yyyy-MM-dd") : ""));
				dateInput.attr("max", (max ? Utils.toDateString(max, "yyyy-MM-dd") : ""));
			}
			else if (this.picker) {
				this.picker.setMinDate(min);
				this.picker.setMaxDate(max);
				this.picker.setDate(date);
			}
		});
	};

	// ====================================================
	const showDatePicker = function () {
		if (!this.picker) {
			let params = {};
			params.target = $("<div class='picker'></div>").appendTo(this.$el);
			params.date = this.getDate();
			params.min = this.getMinDate();
			params.max = this.getMaxDate();
			this.picker = UI.datepicker.create(params);
			this.picker.on("change", pickerChangeHandler.bind(this));
			this.picker.on("clear", pickerClearHandler.bind(this));
		}

		if (this.$el.is(".show-picker"))
			return ;
		let target = this.$el.addClass("show-picker");
		let picker = target.children(".picker");

		if (this._isRenderAsApp()) {
			$("html, body").addClass("ui-scrollless");
			picker.on("tap", hideDatePicker.bind(this));
		}
		else {
			picker.off("click").on("click", function () { return false; });
			setTimeout(() => {
				$("body").on("click." + this.getViewId(), () => {
					hideDatePicker.call(this);
				});
			});

			let offset = Utils.offset(picker, this._getScrollContainer(), 0, picker[0].scrollHeight);
			if (offset.isOverflowY)
				target.addClass("show-before");
		}

		setTimeout(() => {
			target.addClass("animate-in");
		});
	};

	const hideDatePicker = function () {
		let target = this.$el.addClass("animate-out");

		if (this._isRenderAsApp()) {
			$("html,body").removeClass("ui-scrollless");
			target.children(".picker").off("tap");
		}
		else {
			$("body").off("click." + this.getViewId());
		}

		setTimeout(() => {
			target.removeClass("show-picker").removeClass("show-before");
			target.removeClass("animate-in").removeClass("animate-out");
		}, 300);
	};

	// ====================================================
	const setDateInner = function (date) {
		let snapshoot = this._snapshoot();
		let input = this.inputTag.find("input");
		if (date) {
			this.$el.addClass("has-val").attr("data-dt", Utils.toDateString(date, "yyyy-MM-dd"));
			input.val(getFormatDate(date, this.getDateFormat()));
		}
		else {
			this.$el.removeClass("has-val").attr("data-dt", "");
			input.val("");
		}
		return snapshoot.done();
	};

	const getFormatDate = function (date, dateFormat) {
		if (date) {
			if (Utils.isFunction(dateFormat))
				return dateFormat(date);
			if (Utils.isBlank(dateFormat))
				dateFormat = "yyyy-MM-dd";
			return Utils.toDateString(date, dateFormat);
		}
		return "";
	};

	const getTime = function (date) {
		if (date instanceof Date) {
			return date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
		}
		return 0;
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIDateInput = UIDateInput;
		UI.init(".ui-dateipt", UIDateInput, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");