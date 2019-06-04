// ========================================================
// 日期输入框
// 可选属性：date, min, max, format/dateFormat
// @author shicy <shicy85@163.com>
// Create on 2019-06-03
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

	isNative: function () {
		return Utils.isTrue(this.options.native);
	},
	setNative: function (value) {
		this.options.native = value;
	}
});