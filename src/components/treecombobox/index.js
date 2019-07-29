// ========================================================
// 树形下拉选择框
// @author shicy <shicy85@163.com>
// Create on 2019-07-29
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const Renderer = require("./render");


const Utils = VRender.Utils;

const UITreeCombobox = UIBase.extend(module, {
	renderView: function () {
		UITreeCombobox.super(this);
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
		delete this.options.openId;
	},

	getOpenId: function () {
		return this.options.openId;
	},
	setOpenId: function (value) {
		this.options.openId = value;
		delete this.options.openIndex;
	},

	getApiName: function () {
		return null;
	},

	getApiParams: function () {
		return null;
	}
});