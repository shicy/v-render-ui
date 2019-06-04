// 2019-06-04
// daterange

(function (frontend) {
	if (frontend && VRender.Component.ui.daterange)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	const cn_month = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];


	///////////////////////////////////////////////////////
	const UIDateRange = UI.daterange = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIDateRange = UIDateRange.prototype = new UI._base(false);

	_UIDateRange.init = function (target, options) {
		UI._base.init.call(this, target, options);

		let inputTarget = this.inputTag = this.$el.children(".ipt");

		inputTarget.on("tap", ".clear", onClearBtnHandler.bind(this));
		this.$el.on("change", ".ui-datepicker", onPickerChangeHandler.bind(this));
		if (this._isRenderAsApp() && this.isNative()) {
			renderOriginDates.call(this);
		}
		else {
			inputTarget.on("tap", iptClickHandler.bind(this));
			inputTarget.on("tap", ".picker", function (e) { return false; });
			if (!this._isRenderAsApp()) {
				let shortcuts = this.$el.children(".tools");
				shortcuts.on("tap", ".item", shortcutClickHandler.bind(this));
				shortcuts.on("tap", ".label", shortcutLabelHandler.bind(this));
				shortcuts.on("mouseenter", shortcutMouseHandler.bind(this));
				shortcuts.on("mouseleave", shortcutMouseHandler.bind(this));
			}
		}
	};

	// ====================================================
	_UIDateRange.val = function (value, options) {
		if (Utils.isNull(value)) {
			return this.getDateRange(options && options.format);
		}
		value = Utils.toArray(value);
		this.setDateRange(value[0], value[1]);
		return this;
	};

	_UIDateRange.getDateRange = function (format) {
		let start = this.getStartDate(), end = this.getEndDate();
		if (start && end) {
			if (Utils.isNotBlank(format)) {
				start = Utils.toDateString(start, format);
				end = Utils.toDateString(end, format);
			}
			return [start, end];
		}
		return null;
	};
	_UIDateRange.setDateRange = function (start, end) {
		start = Utils.toDate(start);
		end = (start ? Utils.toDate(end) : null) || start;
		if (setDateInner.call(this, start, end)) {
			updateShortcuts.call(this, start, end);
			updatePicker.call(this, start, end, this.getMinDate(), this.getMaxDate());
		}
	};

	_UIDateRange.getStartDate = function () {
		return Utils.toDate(this.$el.attr("data-start"));
	};
	_UIDateRange.setStartDate = function (value) {
		this.setDateRange(value, this.getEndDate());
	};

	_UIDateRange.getEndDate = function () {
		return Utils.toDate(this.$el.attr("data-end"));
	};
	_UIDateRange.setEndDate = function (value) {
		this.setDateRange(this.getStartDate(), value);
	};

	_UIDateRange.getMinDate = function () {
		return Utils.toDate(this.$el.attr("opt-min"));
	};
	_UIDateRange.setMinDate = function (value) {
		let min = Utils.toDate(value);
		if (getTime(min) != getTime(this.getMinDate())) {
			this.$el.attr("opt-min", (min ? Utils.toDateString(min, "yyyy-MM-dd") : ""));
			updatePicker.call(this, this.getStartDate(), this.getEndDate(), min, this.getMaxDate());
		}
	};

	_UIDateRange.getMaxDate = function () {
		return Utils.toDate(this.$el.attr("opt-max"));
	};
	_UIDateRange.setMaxDate = function (value) {
		let max = Utils.toDate(value);
		if (getTime(max) != getTime(this.getMaxDate())) {
			this.$el.attr("opt-max", (max ? Utils.toDateString(max, "yyyy-MM-dd") : ""));
			updatePicker.call(this, this.getStartDate(), this.getEndDate(), this.getMinDate(), max);
		}
	};

	_UIDateRange.getDateFormat = function () {
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
	_UIDateRange.setDateFormat = function (value) {
		this.options.dateFormat = value;
		this.$el.children(".format").remove();
		setDateInner.call(this, this.getStartDate(), this.getEndDate());
	};

	_UIDateRange.setShortcuts = function (dates) {
		renderShortcuts.call(this, this.$el, dates);
	};

	_UIDateRange.isNative = function () {
		return this.$el.attr("opt-native") == 1;
	};

	// ====================================================
	_UIDateRange._snapshoot_shoot = function (state) {
		state.data = this.getDateRange();
		state.min = this.getMinDate();
		state.max = this.getMaxDate();
	};

	_UIDateRange._snapshoot_compare = function (state) {
		let range = this.getDateRange();
		if (state.data && range) {
			return getTime(state.data[0]) == getTime(range[0]) 
				&& getTime(state.data[1]) == getTime(range[1]);
		}
		return !(state.data || range);
	};
	

	///////////////////////////////////////////////////////
	// 点击输入框显示日历
	const iptClickHandler = function (e) {
		showDatePicker.call(this);
	};

	const shortcutClickHandler = function (e) {
		let item = $(e.currentTarget);
		item.addClass("selected").siblings().removeClass("selected");
		item.parent().parent().children(".label").text(item.text());
		this.$el.removeClass("show-dropdown");
		setDaysRecently.call(this, item.attr("data-val"));
	};

	const shortcutLabelHandler = function (e) {
		this.$el.addClass("show-dropdown");
	};

	const shortcutMouseHandler = function (e) {
		if (this.t_shortcut) {
			clearTimeout(this.t_shortcut);
		}
		if (e.type == "mouseleave") {
			if (this.$el.is(".show-dropdown")) {
				this.t_shortcut = setTimeout(() => {
					this.t_shortcut = 0;
					this.$el.removeClass("show-dropdown");
				}, 1000);
			}
		}
	};

	const onPickerSubmitHandler = function (e, range) {
		hideDatePicker.call(this);
		let start = range && range[0] || null;
		let end = range && range[1] || null;
		if (setDateInner.call(this, start, end))
			updateShortcuts.call(this, start, end);
	};

	const onPickerCancelHandler = function (e) {
		hideDatePicker.call(this);
	};

	// 移动端点击 picker 隐藏
	const onPickerHideClickHandler = function (e) {
		hideDatePicker.call(this);
		if (this.picker)
			this.picker.cancel();
	};

	// 禁止 UIDatePicker 原生 jquery change 事件传播
	const onPickerChangeHandler = function (e) {
		// e.stopPropagation();
		return false;
	};

	const onClearBtnHandler = function (e) {
		if (setDateInner.call(this, null, null)) {
			updateShortcuts.call(this, null, null);
			updatePicker.call(this, null, null, this.getMinDate(), this.getMaxDate());
		}
		return false;
	};

	const originDateChangeHandler = function (e) {
		let input = $(e.currentTarget);
		let date = Utils.toDate(input.val());
		let start = input.is(".start") ? date : this.getStartDate();
		let end = input.is(".end") ? date : this.getEndDate();
		setDateInner.call(this, start, end);
		updateShortcuts.call(this, start, end);
	};

	// ====================================================
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-daterange");

		let options = this.options || {};

		if (Utils.isTrue(options.dropdown))
			target.addClass("tools-dropdown");

		if (Utils.isTrue(options.native))
			target.attr("opt-native", "1");

		let minDate = Utils.toDate(options.min);
		if (minDate)
			target.attr("opt-min", Utils.toDateString(minDate, "yyyy-MM-dd"));

		let maxDate = Utils.toDate(options.max);
		if (maxDate)
			target.attr("opt-max", Utils.toDateString(maxDate, "yyyy-MM-dd"));

		let start = Utils.toDate(options.start), end = null;
		if (start) {
			end = Utils.toDate(options.end) || new Date(start.getTime());
			if (minDate && getTime(minDate) > getTime(start))
				start = minDate;
			if (maxDate && getTime(maxDate) < getTime(end))
				end = maxDate;
			if (getTime(start) > getTime(end))
				start = end = null;
		}

		let defVal = parseInt(options.quickDef) || 0;
		if (start && end) {
			defVal = 0;
		}
		else if (defVal) {
			end = new Date();
			start = new Date();
			start.setDate(start.getDate() - defVal);
		}

		if (start && end) {
			target.addClass("has-val");
			target.attr("data-start", Utils.toDateString(start, "yyyy-MM-dd"));
			target.attr("data-end", Utils.toDateString(end, "yyyy-MM-dd"));
		}

		renderShortcuts.call(this, $, target, this.getShortcutDates(), defVal);
		renderDateInput.call(this, $, target, start, end);

		return this;
	};

	// ====================================================
	_Renderer.getDateFormat = function () {
		return this.options.dateFormat || this.options.format;
	};

	_Renderer.getShortcutDates = function () {
		return this.options.shortcuts || this.options.quickDates;
	};


	///////////////////////////////////////////////////////
	const renderShortcuts = function ($, target, shortcuts, defVal) {
		target.removeClass("has-tools").children(".tools").remove();
		shortcuts = formatQuickDates(shortcuts);
		if (shortcuts && shortcuts.length > 0) {
			target.addClass("has-tools");

			let tools = $("<div class='tools'></div>").prependTo(target);
			tools.append("<span class='label'>选择日期</span>");
			let items = $("<div class='items'></div>").appendTo(tools);

			Utils.each(shortcuts, (data) => {
				let value = parseInt(data.value) || 0;
				let item = $("<div class='item'></div>").appendTo(items);
				item.attr("data-val", value);
				item.text(Utils.isBlank(data.label) ? ("最近" + value + "天") : data.label);
				if (value == defVal)
					item.addClass("selected");
			});
		}
	};

	const renderDateInput = function ($, target, start, end) {
		let iptTarget = $("<div class='ipt'></div>").appendTo(target);
		let input = $("<input type='text' readonly='readonly'/>").appendTo(iptTarget);
		iptTarget.append("<span class='clear'></span>");

		let prompt = this.options.prompt;
		if (Utils.isNotBlank(prompt)) {
			$("<span class='prompt'></span>").appendTo(iptTarget).text(prompt);
		}

		let dateFormat = this.getDateFormat();
		input.val(getDateRangeLabel(start, end, dateFormat) || "");

		if (!frontend && dateFormat) {
			if (Utils.isFunction(dateFormat))
				target.write("<div class='format format-fn'>" + escape(dateFormat) + "</div>");
			else
				target.write("<div class='format'>" + dateFormat + "</div>");
		}
	};

	const renderOriginDates = function () {
		let startDateInput = $("<input class='origin-dateipt start' type='date'/>").appendTo(this.inputTag);
		let endDateInput = $("<input class='origin-dateipt end' type='date'/>").appendTo(this.inputTag);

		updatePicker.call(this, this.getStartDate(), this.getEndDate(), this.getMinDate(), this.getMaxDate());

		startDateInput.on("change", originDateChangeHandler.bind(this));
		endDateInput.on("change", originDateChangeHandler.bind(this));
	};

	// ====================================================
	const updateShortcuts = function (start, end) {
		let shortcuts = this.$el.children(".tools");
		if (shortcuts && shortcuts.length > 0) {
			let label = shortcuts.children(".label").text("选择日期");
			let items = shortcuts.find(".item").removeClass("selected");
			if (start && end && Utils.getDays(end, new Date()) == 0) {
				let days = Utils.getDays(end, start) + 1;
				for (let i = 0, l = items.length; i < l; i++) {
					let item = items.eq(i);
					if (item.attr("data-val") == days) {
						item.addClass("selected");
						label.text(item.text());
						break;
					}
				}
			}
		}
	};

	const updatePicker = function (start, end, min, max) {
		Utils.debounce("daterange_renderpicker-" + this.getViewId(), () => {
			if (this._isRenderAsApp() && this.isNative()) {
				var startDateInput = this.inputTag.children(".origin-dateipt.start");
				var endDateInput = this.inputTag.children(".origin-dateipt.end");

				startDateInput.val(start ? Utils.toDateString(start, "yyyy-MM-dd") : "");
				endDateInput.val(end ? Utils.toDateString(end, "yyyy-MM-dd") : "");

				min = min ? Utils.toDateString(min, "yyyy-MM-dd") : "";
				max = max ? Utils.toDateString(max, "yyyy-MM-dd") : "";
				startDateInput.attr("min", min).attr("max", max);
				endDateInput.attr("min", min).attr("max", max);
			}
			else if (this.picker) {
				this.picker.setMinDate(min);
				this.picker.setMaxDate(max);
				this.picker.setDate(start, end);
			}
		});
	};

	// ====================================================
	const showDatePicker = function () {
		if (!this.picker) {
			let params = {range: true};
			params.target = $("<div class='picker'></div>").appendTo(this.inputTag);
			params.min = this.getMinDate();
			params.max = this.getMaxDate();
			params.start = this.getStartDate();
			params.end = this.getEndDate();
			this.picker = UI.datepicker.create(params);
			this.picker.on("submit", onPickerSubmitHandler.bind(this));
			this.picker.on("cancel", onPickerCancelHandler.bind(this));
		}

		if (this.$el.is(".show-picker"))
			return ; 
		let target = this.$el.addClass("show-picker");

		if (this._isRenderAsApp()) {
			$("html, body").addClass("ui-scrollless");
			this.inputTag.children(".picker").on("tap", onPickerHideClickHandler.bind(this));
		}
		else {
			let picker = this.inputTag.children(".picker");
			let offset = Utils.offset(picker, this._getScrollContainer(), 0, picker[0].scrollHeight);
			if (offset.isOverflowX)
				target.addClass("show-right");
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
			$("html, body").removeClass("ui-scrollless");
			this.$el.children(".picker").off("tap");
		}

		setTimeout(() => {
			target.removeClass("show-picker").removeClass("show-before").removeClass("show-right");
			target.removeClass("animate-in").removeClass("animate-out");
		}, 300);
	};

	// ====================================================
	const setDateInner = function (start, end) {
		let snapshoot = this._snapshoot();
		let input = this.inputTag.find("input");
		if (start && end) {
			this.$el.addClass("has-val");
			this.$el.attr("data-start", Utils.toDateString(start, "yyyy-MM-dd"));
			this.$el.attr("data-end", Utils.toDateString(end, "yyyy-MM-dd"));
			input.val(getDateRangeLabel(start, end, this.getDateFormat()) || "");
		}
		else {
			this.$el.removeClass("has-val");
			this.$el.attr("data-start", "").attr("data-end", "");
			input.val("");
		}
		return snapshoot.done();
	};

	// 设置N天前日期范围
	const setDaysRecently = function (days) {
		days = parseInt(days) || 0;
		if (days > 0) {
			let start = new Date(), end = new Date();
			start.setDate(start.getDate() - days + 1);
			// end.setDate(end.getDate() - 1);
			if (setDateInner.call(this, start, end)) {
				updatePicker.call(this, start, end, this.getMinDate(), this.getMaxDate());
			}
		}
	};

	const getFormatDate = function (date, dateFormat) {
		if (Utils.isFunction(dateFormat))
			return dateFormat(date);
		if (Utils.isBlank(dateFormat))
			dateFormat = "yyyy-MM-dd";
		return Utils.toDateString(date, dateFormat);
	};

	const formatQuickDates = function (quickDates) {
		let results = [];
		Utils.each(Utils.toArray(quickDates), (data) => {
			if (Utils.isNotBlank(data)) {
				if (typeof data !== "object")
					data = {value: data};
				data.value = parseInt(data && data.value) || 0;
				if (data.value > 0)
					results.push(data);
			}
		});
		return results;
	};

	const getDateRangeLabel = function (start, end, dateFormat) {
		if (start && end) {
			return getFormatDate(start, dateFormat) + " 至 " + getFormatDate(end, dateFormat);
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
		window.UIDateRange = UIDateRange;
		UI.init(".ui-daterange", UIDateRange, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");