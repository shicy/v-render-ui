// ========================================================
// 日期和时间输入框
// @author shicy <shicy85@163.com>
// Create on 2019-06-04
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const Renderer = require("./render");


const Utils = VRender.Utils;

const UIDateTime = UIBase.extend(module, {
	renderView: function () {
		UIDateTime.super(this);
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

	getMaxData: function () {
		return Utils.toDate(this.options.max);
	},
	setMaxData: function (value) {
		this.options.max = value;
	},

	getDateFormat: function () {
		return this.options.dateFormat || this.options.format;
	},
	setDateFormat: function (value) {
		this.options.dateFormat = value;
		delete this.options.format;
	},

	getPrompt: function () {
		return this.options.prompt;
	},
	setPrompt: function (value) {
		this.options.prompt = value;
	},

	isSecondVisible: function () {
		return Utils.isTrue(this.options.showSecond);
	},
	setSecondVisible: function (value) {
		this.options.showSecond = value;
	},

	getHours: function () {
		return this.options.hours;
	},
	setHours: function (value) {
		this.options.hours = value;
	},

	getMinutes: function () {
		return this.options.minutes;
	},
	setMinutes: function (value) {
		this.options.minutes = value;
	},

	getSeconds: function () {
		return this.options.seconds;
	},
	setSeconds: function (value) {
		this.options.seconds = value;
	}
});