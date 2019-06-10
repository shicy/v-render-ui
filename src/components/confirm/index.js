// ========================================================
// 确认对话框
// @author shicy <shicy85@163.com>
// Create on 2019-06-10
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const Renderer = require("./render");


const UIConfirm = UIBase.extend(module, {
	renderView: function () {
		UIConfirm.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	getTitle: function () {
		return this.options.title;
	},
	setTitle: function (value) {
		this.options.title = value;
	},

	getContent: function () {
		return this.options.content;
	},
	setContent: function (value) {
		this.options.content = value;
	},

	getFocusHtmlContent: function () {
		return this.options.focusHtmlContent;
	},
	setFocusHtmlContent: function (value) {
		this.options.focusHtmlContent = value;
	},

	getConfirmLabel: function () {
		return this.options.confirmLabel || "确认";
	},
	setConfirmLabel: function (value) {
		this.options.confirmLabel = value;
	},

	getCancelLabel: function () {
		return this.options.cancelLabel || "取消";
	},
	setCancelLabel: function (value) {
		this.options.cancelLabel = value;
	}
});