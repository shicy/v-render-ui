// ========================================================
// 提示框
// @author shicy <shicy85@163.com>
// Create on 2019-06-10
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const Renderer = require("./render");


const Utils = VRender.Utils;

const UIMessage = UIBase.extend(module, {
	renderView: function () {
		UIMessage.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
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

	getType: function () {
		return this.options.type;
	},
	setType: function (value) {
		this.options.type = value;
	},

	getIcon: function () {
		return this.options.icon;
	},
	setIcon: function (value) {
		this.options.icon = value;
	},

	getDuration: function () {
		return this.options.duration;
	},
	setDuration: function (value) {
		this.options.duration = value;
	},

	getClosable: function () {
		if (Utils.isNull(this.options.closable))
			return true;
		return Utils.isTrue(this.options.closable);
	},
	setClosable: function (value) {
		this.options.closable = value;
	}
});