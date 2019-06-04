// ========================================================
// 日历
// 可选属性：date, min, max, start, end, range
// @author shicy <shicy85@163.com>
// Create on 2019-06-04
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const Renderer = require("./render");


const Utils = VRender.Utils;

const UIDateInput = UIBase.extend(module, {
	renderView: function () {
		UIDateInput.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	getDate: function () {
		return Utils.toDate(this.options.date);
	},
	setDate: function (value) {
		this.options.date = value;
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

	isRangeDate: function () {
		return Utils.isTrue(this.options.range);
	},
	setRangeFlag: function (value) {
		this.options.range = Utils.isNull(value) ? true : Utils.isTrue(value);
	}
});