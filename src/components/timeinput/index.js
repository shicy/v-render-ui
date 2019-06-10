// ========================================================
// 时间输入框
// 可选属性：date, min, max, format/dateFormat
// @author shicy <shicy85@163.com>
// Create on 2019-06-10
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const Renderer = require("./render");


const Utils = VRender.Utils;

const UITimeInput = UIBase.extend(module, {
	renderView: function () {
		UITimeInput.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	getTime: function () {
		return this.options.time;
	},
	setTime: function (value) {
		this.options.time = value;
	},

	getPrompt: function () {
		return this.options.prompt;
	},
	setPrompt: function (value) {
		this.options.prompt = value;
	},

	getMinTime: function () {
		return this.options.min;
	},
	setMinTime: function (value) {
		this.options.min = value;
	},

	getMaxTime: function () {
		return this.options.max;
	},
	setMaxTime: function (value) {
		this.options.max = value;
	},

	isSecondVisible: function () {
		return Utils.isTrue(this.options.showSecond);
	},
	setSecondVisible: function (value) {
		this.options.showSecond = value;
	},

	isUse12Hour: function () {
		return Utils.isTrue(this.options.use12Hour);
	},
	setUse12Hour: function (value) {
		this.options.use12Hour = value;
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
	},

	isReadonly: function () {
		return Utils.isTrue(this.options.readonly);
	},
	setReadonly: function (bool) {
		this.options.readonly = bool;
	}
});