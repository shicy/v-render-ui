// ========================================================
// 文本输入框
// 可选属性：value, prompt, type|dataType, desc|description, tips, 
// 	width, readonly, required, empty, errmsg, decimals, min, max,
// 	maxSize, multi, displayAsPwd
// @author shicy <shicy85@163.com>
// Create on 2019-06-06
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const Renderer = require("./render");


const Utils = VRender.Utils;

const UITextView = UIBase.extend(module, {
	renderView: function () {
		UITextView.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	getValue: function () {
		return this.options.value;
	},
	setValue: function (value) {
		this.options.value = value;
	},

	getPrompt: function () {
		return this.options.prompt;
	},
	setPrompt: function (value) {
		this.options.prompt = value;
	},

	getDataType: function () {
		return this.options.dataType || this.options.type;
	},
	setDataType: function (value) {
		this.options.dataType = value;
		delete this.options.type;
	},

	getDescription: function () {
		return this.options.description || this.options.desc;
	},
	setDescription: function (value) {
		this.options.description = value;
		delete this.options.desc;
	},

	getTips: function () {
		return this.options.tips;
	},
	setTips: function (value) {
		this.options.tips = value;
	},

	isReadonly: function () {
		return Utils.isTrue(this.options.readonly);
	},
	setReadonly: function (bool) {
		this.options.readonly = bool;
	},

	isRequired: function () {
		return Utils.isTrue(this.options.required);
	},
	setRequired: function (value) {
		this.options.required = value;
	},

	getEmptyMsg: function () {
		return this.options.empty;
	},
	setEmptyMsg: function (value) {
		this.options.empty = value;
	},

	getErrorMsg: function () {
		return this.options.errmsg;
	},
	setErrorMsg: function (value) {
		this.options.errmsg = value;
	},

	getDecimals: function () {
		return this.options.decimals;
	},
	setDecimals: function (value) {
		this.options.decimals = value;
	},

	getMinValue: function () {
		return parseFloat(this.options.min);
	},
	setMinValue: function (value) {
		this.options.min = value;
	},

	getMaxValue: function () {
		return parseFloat(this.options.max);
	},
	setMaxValue: function (value) {
		this.options.max = value;
	},

	getMaxSize: function () {
		return parseFloat(this.options.maxSize) || 0;
	},
	setMaxSize: function (value) {
		this.options.maxSize = value;
	},

	isMultiline: function () {
		if (this.options.hasOwnProperty("multiple"))
			return Utils.isTrue(this.options.multiple);
		return Utils.isTrue(this.options.multi);
	},
	setMultiline: function (bool) {
		this.options.multiple = Utils.isNull(bool) ? true : Utils.isTrue(bool);
		delete this.options.multi;
	},

	isDisplayAsPassword: function () {
		return Utils.isTrue(this.options.displayAsPwd);
	},
	setDisplayAsPassword: function (bool) {
		this.options.displayAsPwd = bool;
	},

	isAutoHeight: function () {
		return this.options.autoHeight;
	},
	setAutoHeight: function (value) {
		this.options.autoHeight = Utils.isNull(value) ? true : Utils.isTrue(value);
	},

	getMinHeight: function () {
		return this.options.minHeight;
	},
	setMinHeight: function (value) {
		this.options.minHeight = value;
	},

	getMaxHeight: function () {
		return this.options.maxHeight;
	},
	setMaxHeight: function (value) {
		this.options.maxHeight = value;
	},

	getValidate: function () {
		return this.options.validate;
	},
	setValidate: function (value) {
		this.options.validate = value;
	}
});