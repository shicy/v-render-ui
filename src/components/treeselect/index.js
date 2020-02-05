// ========================================================
// 树形下拉选择框
// @author shicy <shicy85@163.com>
// Create on 2019-07-29
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const Renderer = require("./render");


const Utils = VRender.Utils;

const UITreeSelect = UIBase.extend(module, {
	renderView: function () {
		UITreeSelect.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	getPrompt: function () {
		return this.options.prompt;
	},
	setPrompt: function (value) {
		this.options.prompt = value;
	},

	getIcon: function () {
		return this.options.icon;
	},
	setIcon: function (value) {
		this.options.icon = value;
	},

	getOpenIndex: function () {
		return this.options.openIndex;
	},
	setOpenIndex: function (value) {
		this.options.openIndex = value;
		delete this.options.openKey;
	},

	getOpenKey: function () {
		return this.options.openKey;
	},
	setOpenKey: function (value) {
		this.options.openKey = value;
		delete this.options.openIndex;
	},

	isClearable: function () {
		return Utils.isTrue(this.options.clearable);
	},
	setClearable: function (value) {
		this.options.clearable = Utils.isNull(value) || Utils.isTrue(value);
	},

	getApiName: function () {
		return null;
	},

	getApiParams: function () {
		return null;
	}
});