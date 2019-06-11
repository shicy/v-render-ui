// ========================================================
// 通知
// @author shicy <shicy85@163.com>
// Create on 2016-06-11
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const Renderer = require("./render");


const Utils = VRender.Utils;

const UINotice = UIBase.extend(module, {
	renderView: function () {
		UINotice.super(this);
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

	getType: function () {
		return this.options.type;
	},
	setType: function (value) {
		this.options.type = value;
	},

	isClosable: function () {
		if (Utils.isNull(this.options.closable))
			return true;
		return Utils.isTrue(this.options.closable);
	},
	setClosable: function (value) {
		this.options.closable = value;
	}
});