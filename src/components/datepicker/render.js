// 2019-06-04
// datepicker

(function (frontend) {
	if (frontend && VRender.Component.ui.datepicker)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	const cn_month = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
	const cn_week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

	///////////////////////////////////////////////////////
	const UIDatePicker = UI.datepicker = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIDatePicker = UIDatePicker.prototype = new UI._base(false);

	_UIDatePicker.init = function (target, options) {
		UI._base.init.call(this, target, options);

		this.$el.on("tap", "header .title button", onSwitchBtnHandler.bind(this));
		this.$el.on("tap", "section td", onDateClickHandler.bind(this));
		this.$el.on("tap", "footer .okbtn", onSubmitBtnHandler.bind(this));
		this.$el.on("tap", "footer .cancelbtn", onCancelBtnHandler.bind(this));

		if (this._isRenderAsApp()) {
			this.$el.on("tap", function (e) { return false; });
			this.$el.on("tap", "header .today", onTodayBtnHandler.bind(this));
			this.$el.on("tap", "header .clear", onClearBtnHandler.bind(this));

			let tables = this.$el.children("section");
			tables.on("touchstart", touchSwipeHandler.bind(this));
			tables.on("touchmove", touchSwipeHandler.bind(this));
			tables.on("touchend", touchSwipeHandler.bind(this));
		}
	};

	// ====================================================
	// 在修改的时候就要判断是否超出范围，所以这里不需要判断了
	_UIDatePicker.getDate = function (format) {
		if (this.isRangeDate()) {
			let start = Utils.toDate(this.$el.attr("data-start"));
			if (start) {
				let end = Utils.toDate(this.$el.attr("data-end")) || new Date(start.getTime());
				end = Utils.toDate(Utils.toDateString(end, "yyyy-MM-dd 23:59:59"));
				if (Utils.isNotBlank(format)) {
					start = Utils.toDateString(start, format);
					end = Utils.toDateString(end, format);
				}
				return [start, end];
			}
		}
		else {
			let date = Utils.toDate(this.$el.attr("data-dt"));
			if (date && Utils.isNotBlank(format))
				return Utils.toDateString(date, format);
			return date;
		}
		return null;
	};

	// setDate(new Date()), setDate("2018-01-01"), setDate("2018-01-01", "2018-01-31")
	_UIDatePicker.setDate = function (value) {
		let snapshoot = this._snapshoot();
		if (this.isRangeDate()) {
			let start = Utils.toDate(arguments[0]), end = null;
			if (start) {
				end = Utils.toDate(arguments[1]) || new Date(start.getTime());
				let tstart = getTime(start), tend = getTime(end);
				if (getTime(start) <= getTime(end)) {
					start = Utils.toDateString(start, "yyyy-MM-dd");
					end = Utils.toDateString(end, "yyyy-MM-dd");
				}
				else {
					start = end = null;
				}
			}
			this.$el.attr("data-start", start || "");
			this.$el.attr("data-end", end || "");
		}
		else {
			let date = Utils.toDate(value);
			this.$el.attr("data-dt", date ? Utils.toDateString(date, "yyyy-MM-dd") : "");
		}
		if (!snapshoot.compare())
			this.rerender(this.getDate());
		snapshoot.done();
	};

	_UIDatePicker.getMinDate = function () {
		return Utils.toDate(this.$el.attr("opt-min"));
	};
	_UIDatePicker.setMinDate = function (value) {
		let min = Utils.toDate(value);
		if (getTime(min) != getTime(this.getMinDate())) {
			this.$el.attr("opt-min", min ? Utils.toDateString(min, "yyyy-MM-dd") : "");
			this.rerender();
		}
	};

	_UIDatePicker.getMaxDate = function () {
		return Utils.toDate(this.$el.attr("opt-max"));
	};
	_UIDatePicker.setMaxDate = function (value) {
		let max = Utils.toDate(value);
		if (getTime(max) != getTime(this.getMaxDate())) {
			this.$el.attr("opt-max", max ? Utils.toDateString(max, "yyyy-MM-dd") : "");
			this.rerender();
		}
	};

	_UIDatePicker.isRangeDate = function () {
		return this.$el.is(".is-range");
	};

	_UIDatePicker.submit = function () {
		onSubmitBtnHandler.call(this);
	};

	_UIDatePicker.cancel = function () {
		onCancelBtnHandler.call(this);
	};

	_UIDatePicker.rerender = function (pickerDate) {
		Utils.debounce("datepicker_render-" + this.getViewId(), () => {
			let selectedDate = this.lastSelectedDate || this.getDate();
			pickerDate = pickerDate || getCurrentPickerDate.call(this);
			renderDate.call(this, $, this.$el, selectedDate, pickerDate);
		});
	};

	// ====================================================
	_UIDatePicker._snapshoot_shoot = function (state, selectedDate) {
		state.selectedDate = selectedDate || this.getDate();
		state.pickerDate = getCurrentPickerDate.call(this);
		state.data = state.selectedDate;
	};

	_UIDatePicker._snapshoot_compare = function (state, selectedDate) {
		let date = selectedDate || this.getDate();
		if (date && state.selectedDate) {
			if (this.isRangeDate()) {
				return getTime(date[0]) == getTime(state.selectedDate[0])
					&& getTime(date[1]) == getTime(state.selectedDate[1]);
			}
			return getTime(date) == getTime(state.selectedDate);
		}
		return !(date || state.selectedDate);
	};

	// ====================================================
	const onSwitchBtnHandler = function (e) {
		let btn = $(e.currentTarget);
		let table = null;
		if (this.isRangeDate() && !this._isRenderAsApp()) {
			let title = btn.parent();
			if (title.is(".s"))
				table = this.$el.find(".table.s");
			else if (title.is(".e"))
				table = this.$el.find(".table.e");
		}
		else {
			table = this.$el.find(".table.t0");
		}

		let year = parseInt(table.attr("data-y"));
		let month = parseInt(table.attr("data-m"));
		let date = new Date(year, month, 1);
		if (btn.is(".y")) {
			date.setFullYear(year + (btn.is(".prev") ? -1 : 1));
		}
		else {
			date.setMonth(month + (btn.is(".prev") ? -1 : 1));
		}
		table.attr("data-y", date.getFullYear()).attr("data-m", date.getMonth());

		this.rerender();
	};

	const onDateClickHandler = function (e) {
		let item = $(e.currentTarget);
		if (item.is(".disabled"))
			return ;

		if (this.isRangeDate()) {
			if (!this.selectedSnapshoot)
				this.selectedSnapshoot = this._snapshoot();

			if (this.lastSelectedDate && this.lastSelectedDate.length == 1) { // 第2次点击
				let end = Utils.toDate(item.attr("data-dt"));
				if (end.getTime() >= this.lastSelectedDate[0].getTime())
					this.lastSelectedDate.push(end);
				else
					this.lastSelectedDate.unshift(end);
			}
			else { // 第1次点击
				this.lastSelectedDate = [];
				this.lastSelectedDate.push(Utils.toDate(item.attr("data-dt")));
			}

			this.rerender();
		}
		else {
			let snapshoot = this._snapshoot();
			this.$el.find("td.selected").removeClass("selected");
			item.addClass("selected");
			this.$el.attr("data-dt", item.attr("data-dt"));
			let date = Utils.toDate(item.attr("data-dt"));
			this.$el.find(".title .item .val").text(Utils.toDateString(date, "yyyy.MM.dd"));
			snapshoot.done();
		}
	};

	// 确认选择
	const onSubmitBtnHandler = function () {
		if (this.isRangeDate()) {
			if (this.lastSelectedDate && this.lastSelectedDate.length > 0) {
				let start = this.lastSelectedDate[0];
				let end = this.lastSelectedDate[1] || start;
				this.$el.attr("data-start", Utils.toDateString(start, "yyyy-MM-dd"));
				this.$el.attr("data-end", Utils.toDateString(end, "yyyy-MM-dd"));
				this.lastSelectedDate = null;
			}
			clearCurrentSnapshoot.call(this, true);
		}
		this.trigger("submit", this.getDate());
	};

	// 取消选择
	const onCancelBtnHandler = function () {
		if (this.isRangeDate()) {
			this.lastSelectedDate = null;
			if (this.selectedSnapshoot) {
				let state = this.selectedSnapshoot.getState();
				clearCurrentSnapshoot.call(this);
				
				let selectedDate = state.selectedDate;
				let start = selectedDate && selectedDate[0];
				let end = selectedDate && selectedDate[1];
				this.$el.attr("data-start", start ? Utils.toDateString(start, "yyyy-MM-dd") : "");
				this.$el.attr("data-end", end ? Utils.toDateString(end, "yyyy-MM-dd") : "");

				this.rerender(state.pickerDate);
			}
			else {
				this.rerender();
			}
		}
		this.trigger("cancel", this.getDate());
	};

	// 日历回到今天
	const onTodayBtnHandler = function () {
		this.rerender([new Date()]);
	};

	// 清除选择
	const onClearBtnHandler = function () {
		let snapshoot = this._snapshoot();
		if (this.isRangeDate()) {
			clearCurrentSnapshoot.call(this);
			this.$el.attr("data-start", "").attr("data-end", "");
		}
		else {
			this.$el.attr("data-dt", "");
		}
		this.rerender();
		snapshoot.done();
		this.trigger("clear");
	};

	// 移到端滑动
	const touchSwipeHandler = function (e) { // console.log(e);
		let touch = e.touches && e.touches[0];
		if (e.type == "touchstart") {
			this.touchData = {startX: touch.pageX, startY: touch.pageY};
			this.touchData.tableContainer = this.$el.find(".table.t0");
			this.touchData.mainTable = this.touchData.tableContainer.children("table.body");
		}
		else if (e.type == "touchmove") {
			if (e.touches.length > 1)
				return ;

			let offset = touch.pageX - this.touchData.startX;
			if (!this.touchData.moving) {
				if (Math.abs(offset) < 10 || Math.abs(touch.pageY - this.touchData.startY) > 15)
					return ;
			}
			this.touchData.moving = true;
			// this.touchData.endX = touch.pageX;
			this.touchData.lastOffset = offset;

			this.touchData.mainTable.css("transform", "translate(" + offset + "px,0px)");

			let table = offset > 0 ? this.touchData.prevTable : this.touchData.nextTable;
			if (!table) {
				let year = parseInt(this.touchData.tableContainer.attr("data-y"));
				let month = parseInt(this.touchData.tableContainer.attr("data-m"));

				table = createTable($, this.$el.children("section")).addClass("t1");
				if (offset > 0) {
					month -= 1;
					this.touchData.prevTable = table;
				}
				else {
					month += 1;
					this.touchData.nextTable = table;
				}

				let pickerDate = new Date(year, month, 1);
				let selectedDate = this.lastSelectedDate || this.getDate();
				renderPickerDate.call(this, $, this.$el, table, pickerDate, selectedDate);
			}

			if (!this.touchData.contentWidth)
				this.touchData.contentWidth = this.$el.children("section").width();
			offset += this.touchData.contentWidth * (offset > 0 ? -1 : 1);
			table.css("transform", "translate(" + offset + "px,0px)");
		}
		else if (e.type == "touchend") {
			if (this.touchData.moving) {
				let offset = 0, delay = 200;
				if (Math.abs(this.touchData.lastOffset) > 20)
					offset += this.touchData.contentWidth * (this.touchData.lastOffset > 0 ? 1 : -1);
				let transition = "transform " + delay + "ms";
				this.touchData.mainTable.css("transition", transition);
				this.touchData.mainTable.css("transform", "translate(" + offset + "px,0px)");
				if (this.touchData.lastOffset > 0) {
					this.touchData.prevTable.css("transition", transition);
					this.touchData.prevTable.css("transform", "translate(0px,0px)");
				}
				else {
					this.touchData.nextTable.css("transition", transition);
					this.touchData.nextTable.css("transform", "translate(0px,0px)");
				}
				let touchData = this.touchData;
				if (Math.abs(touchData.lastOffset) > 20) {
					let button = touchData.lastOffset > 0 ? ".prev.m" : ".next.m";
					this.$el.children("header").find(button).eq(0).tap();
				}
				setTimeout(() => {
					if (touchData.prevTable)
						touchData.prevTable.remove();
					if (touchData.nextTable)
						touchData.nextTable.remove();
					touchData.mainTable.css("transition", "");
					touchData.mainTable.css("transform", "");
				}, delay);
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
		target.addClass("ui-datepicker");

		let options = this.options || {};

		let minDate = Utils.toDate(options.min);
		if (minDate)
			target.attr("opt-min", Utils.toDateString(minDate, "yyyy-MM-dd"));
		let maxDate = Utils.toDate(options.max);
		if (maxDate)
			target.attr("opt-max", Utils.toDateString(maxDate, "yyyy-MM-dd"));

		let date = getValidDate.call(this);
		if (this.isRangeDate()) {
			target.addClass("is-range");
			if (date) {
				target.attr("data-start", Utils.toDateString(date[0], "yyyy-MM-dd"));
				target.attr("data-end", Utils.toDateString(date[1], "yyyy-MM-dd"));
			}
		}
		else if (date) {
			target.attr("data-dt", Utils.toDateString(date, "yyyy-MM-dd"));
		}

		renderHeader.call(this, $, target);
		renderTables.call(this, $, target);
		renderFooter.call(this, $, target);

		renderDate.call(this, $, target, date);

		return this;
	};

	// ====================================================
	_Renderer.getMinDate = function () {
		return Utils.toDate(this.options.min);
	};

	_Renderer.getMaxDate = function () {
		return Utils.toDate(this.options.max);
	};

	_Renderer.isRangeDate = function () {
		return Utils.isTrue(this.options.range);
	};

	// ====================================================
	const renderHeader = function ($, target) {
		let header = $("<header></header>").appendTo(target);

		let title = $("<div class='title'></div>").appendTo(header);
		let addItem = () => {
			let item = $("<dl class='item'></dl>").appendTo(title);
			item.append("<dt class='lbl'>-</dt><dd class='val'>-</dd>");
			item.append("<button class='prev y'>&nbsp;</button>");
			item.append("<button class='prev m'>&nbsp;</button>");
			item.append("<button class='next m'>&nbsp;</button>");
			item.append("<button class='next y'>&nbsp;</button>");
			return item;
		};

		if (this.isRangeDate()) {
			addItem().addClass("s").children(".lbl").html("开始日期<span class='y'></span>");
			addItem().addClass("e").children(".lbl").html("结束日期<span class='y'></span>");
		}
		else {
			addItem();
		}

		if (this._isRenderAsApp()) {
			header.append("<button class='today'><label>今天</label></button>");
			header.append("<button class='clear'><label>清除</label></button>");
		}
	};

	const renderTables = function ($, target) {
		let tables = $("<section></section>").appendTo(target);
		if (this.isRangeDate() && !this._isRenderAsApp()) {
			createTable($, tables).addClass("s");
			createTable($, tables).addClass("e");
		}
		else {
			createTable($, tables).addClass("t0");
		}
	};

	const renderFooter = function ($, target) {
		if (this.isRangeDate()) {
			let footer = $("<footer></footer>").appendTo(target);
			if (this._isRenderAsApp()) {
				addButton.call(this, footer, {label: "使用日期", type: "primary", cls: "okbtn"});
				// addButton.call(this, footer, {label: "取消", type: "cancel", cls: "cancelbtn"});
			}
			else {
				footer.append("<div class='vals'><span class='s'>-</span> - <span class='e'>-</span></div>");
				let buttons = $("<div class='btns'></div>").appendTo(footer);
				addButton.call(this, buttons, {label: "确定", type: "primary", cls: "okbtn"});
				addButton.call(this, buttons, {label: "取消", type: "cancel", cls: "cancelbtn"});
			}
		}
	};

	const renderDate = function ($, target, selectedDate, pickerDate) {
		selectedDate = Utils.toArray(selectedDate);
		pickerDate = Utils.toArray(pickerDate);
		if (!(pickerDate[0] instanceof Date)) {
			pickerDate = [];
			if (this.isRangeDate() && !this._isRenderAsApp()) { // 移动端不显示2个日历
				pickerDate.push(selectedDate[0] || new Date());
				pickerDate.push(selectedDate[1])
			}
			else {
				pickerDate.push(selectedDate[0] || new Date());
			}
		}

		renderHeaderDate.call(this, $, target, pickerDate, selectedDate);
		renderTableDate.call(this, $, target, pickerDate, selectedDate);
		renderFooterDate.call(this, $, target, pickerDate, selectedDate);

		if (!this.isRangeDate() || this._isRenderAsApp()) {
			if (isSameMonth(pickerDate[0], (new Date()))) {
				target.attr("cur-month", "1");
			}
			else {
				target.removeAttr("cur-month");
			}
		}
	};

	const renderHeaderDate = function ($, target, pickerDate, selectedDate) {
		let header = target.children("header");
		if (this.isRangeDate()) {
			let start, end;
			let startValue = "--", endValue = "--";
			let startLabel = " ", endLabel = " ";
			if (this._isRenderAsApp()) { // 显示选中日期范围
				if (selectedDate && selectedDate.length > 0) {
					start = selectedDate[0], end = selectedDate[1];
					let today = new Date(), year = today.getFullYear();
					if (start) {
						if (start.getFullYear() != year)
							startLabel = start.getFullYear();
						startValue = Utils.toDateString(start, "M月d日") + " " + cn_week[start.getDay()];
					}
					if (end) {
						if (end.getFullYear() != year)
							endLabel = end.getFullYear();
						endLabel = end.getFullYear() == year ? " " : end.getFullYear();
						endValue = Utils.toDateString(end, "M月d日") + " " + cn_week[end.getDay()];
					}
				}
				header.find(".item.s .y").text(startLabel);
				header.find(".item.e .y").text(endLabel);
			}
			else {
				start = pickerDate && pickerDate[0] || new Date();
				end = pickerDate && pickerDate[1] || start;
				if (isSameMonth(start, end)) {
					end = new Date(end.getTime());
					end.setMonth(end.getMonth() + 1);
				}
				startValue = start.getFullYear() + "年 " + cn_month[start.getMonth()] + "月";
				endValue = end.getFullYear() + "年 " + cn_month[end.getMonth()] + "月";

				checkRangeHeadBtns($, target, start, end);
			}
			header.find(".item.s .val").text(startValue);
			header.find(".item.e .val").text(endValue);
		}
		else {
			let date = pickerDate && pickerDate[0] || new Date();
			let label = date.getFullYear() + "年 " + cn_month[date.getMonth()] + "月";
			header.find(".item .lbl").text(label); // 显示当前“年月”
			date = selectedDate && selectedDate[0];
			header.find(".item .val").text(date ? Utils.toDateString(date, "yyyy.MM.dd") : "-");
		}
	};

	const renderTableDate = function ($, target, pickerDate, selectedDate) {
		if (this.isRangeDate() && !this._isRenderAsApp()) {
			let start = pickerDate && pickerDate[0] || new Date();
			let end = pickerDate && pickerDate[1] || start;
			if (isSameMonth(start, end)) {
				end = new Date(end.getTime());
				end.setMonth(end.getMonth() + 1);
			}
			renderPickerDate.call(this, $, target, target.find(".table.s"), start, selectedDate);
			renderPickerDate.call(this, $, target, target.find(".table.e"), end, selectedDate);
		}
		else {
			let date = pickerDate && pickerDate[0] || new Date();
			renderPickerDate.call(this, $, target, target.find(".table.t0"), date, selectedDate);
		}
	};

	const renderFooterDate = function ($, target, pickerDate, selectedDate) {
		if (this.isRangeDate() && !this._isRenderAsApp()) {
			let start = " ", end = " ";
			if (selectedDate && selectedDate.length > 0) {
				if (selectedDate[0])
					start = Utils.toDateString(selectedDate[0], "yyyy.MM.dd");
				if (selectedDate[1])
					end = Utils.toDateString(selectedDate[1], "yyyy.MM.dd");
			}
			let valueTarget = target.find("footer .vals");
			valueTarget.children(".s").text(start);
			valueTarget.children(".e").text(end);
		}
	};

	const renderPickerDate = function ($, target, table, pickerDate, selectedDate) {
		let y = pickerDate.getFullYear(), m = pickerDate.getMonth();
		table.attr("data-y", y).attr("data-m", m);

		let dt0 = new Date(), t0 = getTime(dt0); // today
		// let dtstart = (selectedDate instanceof Date) ? selectedDate : (selectedDate && selectedDate[0]);
		// let dtend = (selectedDate instanceof Date) ? selectedDate : (selectedDate && selectedDate[1]);
		let dtstart = selectedDate && selectedDate[0];
		let dtend = selectedDate && selectedDate[1];
		let tstart = getTime(dtstart), tend = getTime(dtend) || tstart; // selected
		let tmin = getTime(this.getMinDate()), tmax = getTime(this.getMaxDate()) || 21001231; // limit

		let dt = new Date(y, m, 1); // 当月第1天
		let weekday = dt.getDay();
		dt.setDate(weekday ? (2 - weekday) : -5); // 日历显示的第1天

		let monthLabel = (dt0.getFullYear() == y ? "" : (y + "年 ")) + cn_month[m] + "月";
		table.find(".month").text(monthLabel);

		let tbody = table.find("table.body tbody").empty();
		while (true) {
			let tr = $("<tr></tr>").appendTo(tbody);
			for (let i = 0; i < 7; i++) {
				let _y = dt.getFullYear(), _m = dt.getMonth(), _d = dt.getDate(), _t = _y * 10000 + _m * 100 + _d;

				let td = $("<td></td>").appendTo(tr);
				td.append("<span>" + _d + "</span>");
				td.attr("data-dt", (_y + "-" + (_m + 1) + "-" + _d));

				if (_t == t0)
					td.addClass("today");
				if (_m != m)
					td.addClass("over");
				if (_m != m || _t < tmin || _t > tmax)
					td.addClass("disabled");
				if (_t >= tstart && _t <= tend) {
					td.addClass("selected");
					if (_t == tstart)
						td.addClass("start")
					if (_t == tend)
						td.addClass("end");
				}

				dt.setDate(_d + 1);
			}
			if (dt.getMonth() > m || dt.getFullYear() > y)
				break;
		}
	};
	
	///////////////////////////////////////////////////////
	const checkRangeHeadBtns = function ($, target, start, end) {
		target = target.children("header");

		let yearbtns = target.find(".item.s .next.y, .item.e .prev.y");
		let monthbtns = target.find(".item.s .next.m, .item.e .prev.m");

		let syear = start.getFullYear(), smonth = start.getMonth();
		let eyear = end.getFullYear(), emonth = end.getMonth();

		if ((syear * 100 + smonth) >= ((eyear - 1) * 100 + emonth))
			yearbtns.addClass("disabled");
		else
			yearbtns.removeClass("disabled");

		if (syear > eyear || (syear == eyear && smonth >= emonth - 1))
			monthbtns.addClass("disabled");
		else
			monthbtns.removeClass("disabled");
	};

	const createTable = function ($, tableContainer) {
		tableContainer = $("<div class='table'></div>").appendTo(tableContainer);

		let table = $("<table class='head'></table>").appendTo(tableContainer);
		table.append("<thead><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr></thead>");

		table = $("<table class='body'></table>").appendTo(tableContainer);
		table.append("<thead><tr><th colspan='7'><div class='month'>-</div></th></tr></thead>");
		table.append("<tbody></tbody>");

		return tableContainer;
	};

	const addButton = function (target, options) {
		if (!frontend) {
			let UIButton = require("../button/index");
			new UIButton(this.context, options).render(target);
		}
		else {
			UI.button.create(Utils.extend({}, options, {target: target}));
		}
	};

	// ====================================================
	const clearCurrentSnapshoot = function (isDone) {
		this.lastSelectedDate = null;
		if (this.selectedSnapshoot) {
			if (isDone)
				this.selectedSnapshoot.done();
			else
				this.selectedSnapshoot.release();
			this.selectedSnapshoot = null;
		}
	};

	const getCurrentPickerDate = function () {
		let pickerDate = [];
		if (this.isRangeDate() && !this._isRenderAsApp()) {
			let tstart = this.$el.find(".table.s");
			pickerDate.push(new Date(parseInt(tstart.attr("data-y")), parseInt(tstart.attr("data-m")), 1));
			let tend = this.$el.find(".table.e");
			pickerDate.push(new Date(parseInt(tend.attr("data-y")), parseInt(tend.attr("data-m")), 1));
		}
		else {
			let table = this.$el.find(".table.t0");
			pickerDate.push(new Date(parseInt(table.attr("data-y")), parseInt(table.attr("data-m")), 1));
		}
		return pickerDate;
	};

	const getValidDate = function (min, max) {
		// let min = this.getMinDate(), max = this.getMaxDate();
		let tmin = getTime(min), tmax = getTime(max);
		if (tmin && tmax && tmin > tmax)
			return null;

		if (this.isRangeDate()) {
			let start = Utils.toDate(this.options.start);
			if (start) {
				start = new Date(start.getTime());
				let end = Utils.toDate(this.options.end) || new Date(start.getTime());
				end = new Date(end ? end.getTime() : start.getTime());
				let tstart = getTime(start), tend = getTime(end);
				if (tstart <= tend) {
					if (tmin && tstart < tmin)
						start = min;
					if (tmax && tend > tmax)
						end = max;
					if (getTime(start) <= getTime(end))
						return [start, end];
				}
			}
		}
		else {
			let date = Utils.toDate(this.options.date);
			if (date) {
				date = new Date(date.getTime());
				let tdate = getTime(date);
				if ((tmin && tdate < tmin) || (tmax && tdate > tmax))
					return null;
				return date;
			}
		}

		return null;
	};

	const isSameMonth = function (dt1, dt2) {
		if (dt1 && dt2) {
			return dt1.getMonth() == dt2.getMonth() && dt1.getFullYear() == dt2.getFullYear();
		}
		return false;
	};

	const getTime = function (date) {
		if (date) {
			return date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
		}
		return 0;
	};


	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIDatePicker = UIDatePicker;
		UI.init(".ui-datepicker", UIDatePicker, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");