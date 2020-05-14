// ========================================================
// 单选框
// @author shicy <shicy85@163.com>
// Create on 2019-06-06
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const Renderer = require("./render");


const Utils = VRender.Utils;

const UIRadiobox = UIBase.extend(module, {
	renderView: function () {
		UIRadiobox.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	getTagName: function () {
		return "label";
	},

	getName: function () {
		// 这里不用name，将会在input上设置
	},
	setName: function (value) {
		this.options.name = value;
	},

	getLabel: function () {
		return this.options.label;
	},
	setLabel: function (value) {
		this.options.label = value;
	},

	getValue: function () {
		return this.options.value;
	},
	setValue: function (value) {
		this.options.value = value;
	},

	isChecked: function () {
		return Utils.isTrue(this.options.checked);
	},
	setChecked: function (bool) {
		this.options.checked = bool;
	},

	isReadonly: function () {
		return Utils.isTrue(this.options.readonly);
	},
	setReadonly: function (bool) {
		this.options.readonly = bool;
	}
});