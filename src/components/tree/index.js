// ========================================================
// 树
// @author shicy <shicy85@163.com>
// Create on 2019-07-25
// ========================================================

const VRender = require(__vrender__);
const UISelectable = require("../../common/UISelectable");
const Renderer = require("./render");


const Utils = VRender.Utils;

const UITree = UISelectable.extend(module, {
	renderView: function () {
		UITree.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	isChkboxVisible: function () {
		return Utils.isTrue(this.options.chkbox);
	},
	setChkboxVisible: function (bool) {
		this.options.chkbox = bool;
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
	}
});
