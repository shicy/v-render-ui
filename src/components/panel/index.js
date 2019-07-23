// ========================================================
// 面板
// 可选属性：title, tabs, buttons, content/view, module
// @author shicy <shicy85@163.com>
// Create on 2019-07-23
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const Renderer = require("./render");


const Utils = VRender.Utils;

const UIPanel = UIBase.extend(module, {
	renderView: function () {
		UIPanel.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	getTitle: function () {
		return this.options.title;
	},
	setTitle: function (value) {
		this.options.title = value;
	},

	getContentView: function () {
		return this.options.content || this.options.view;
	},
	setContentView: function (value) {
		this.options.content = value;
		delete this.options.view;
	},

	getButtons: function () {
		return Utils.toArray(this.options.buttons);
	},
	setButtons: function (value) {
		this.options.buttons = value;
	},
	addButton: function (value) {
		if (!Utils.isArray(this.options.buttons))
			this.options.buttons = [];
		this.options.buttons.push(value);
	},

	getViewports: function () {
		return Utils.toArray(this.options.viewports);
	},
	setViewports: function (value) {
		this.options.viewports = value;
	},
	addViewport: function (value) {
		if (!Utils.isArray(this.options.viewports))
			this.options.viewports = [];
		this.options.viewports.push(value);
	}
});