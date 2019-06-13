// ========================================================
// 对话框
// 可选属性：title, content/view, buttons, size, padding
// 其中 size 可选值有：auto-自动大小，small-小对话框，normal-中等对话框（默认），big-大（满屏）对话框
// @author shicy <shicy85@163.com>
// Create on 2019-06-13
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const Renderer = require("./render");


const UIDialog = UIBase.extend(module, {
	renderView: function () {
		UIDialog.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	getTitle: function () {
		return this.options.title;
	},
	setTitle: function (value) {
		this.options.title = value;
	},

	getContent: function () {
		return this.options.content || this.options.view;
	},
	setContent: function (value) {
		this.options.content = value;
		delete this.options.view;
	},

	getButtons: function () {
		return this.options.buttons;
	},
	setButtons: function (value) {
		this.options.buttons = value;
	},

	getSize: function () {
		return this.options.size;
	},
	setSize: function (value) {
		this.options.size = value;
	},

	isFill: function () {
		return this.options.fill;
	},
	setFill: function (value) {
		this.options.fill = value;
	}
});