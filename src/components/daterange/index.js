// ========================================================
// 起止日期选择框
// 可选属性：start, end, min, max, prompt, format/dateFormat,
// 	quickDates|shortcuts, quickDef, dropdown
// @author shicy <shicy85@163.com>
// Create on 2019-06-04
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const Renderer = require("./render");


const UIDateRange = UIBase.extend(module, {
	renderView: function () {
		UIDateRange.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	getStartDate: function () {
		return Utils.toDate(this.options.start);
	},
	setStartDate: function (value) {
		this.options.start = value;
	},

	getEndDate: function () {
		return Utils.toDate(this.options.end);
	},
	setEndDate: function (value) {
		this.options.end = value;
	},

	getMinDate: function () {
		return Utils.toDate(this.options.min);
	},
	setMinDate: function (value) {
		this.options.min = value;
	},

	getMaxDate: function () {
		return Utils.toDate(this.options.max);
	},
	setMaxDate: function (value) {
		this.options.max = value;
	},

	getPrompt: function () {
		return this.options.prompt;
	},
	setPrompt: function (value) {
		this.options.prompt = value;
	},

	getDateFormat: function () {
		return this.options.dateFormat || this.options.format;
	},
	setDateFormat: function (value) {
		this.options.dateFormat = value;
		delete this.options.format;
	},

	getQuickDates: function () {
		return this.options.shortcuts || this.options.quickDates;
	},
	setQuickDates: function (value) {
		this.options.shortcuts = value;
		delete this.options.quickDates;
	},

	getQuickDefault: function () {
		return parseInt(this.options.quickDef) || 0;
	},
	setQuickDefault: function (value) {
		this.options.quickDef = value;
	},

	isQuickDropdown: function () {
		return Utils.isTrue(this.options.dropdown);
	},

	setQuickDropdown: function (bool) {
		this.options.dropdown = bool;
	},

	isNative: function () {
		return Utils.isTrue(this.options.native);
	},
	setNative: function (value) {
		this.options.native = value;
	}
});