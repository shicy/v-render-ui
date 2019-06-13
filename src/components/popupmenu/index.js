// ========================================================
// 弹出菜单
// @author shicy <shicy85@163.com>
// Create on 2019-06-12
// ========================================================

const VRender = require(__vrender__);
const UIItems = require("../../common/UIItems");
const Renderer = require("./render");


const UIPopupMenu = UIItems.extend(module, {
	renderView: function () {
		UIPopupMenu.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	getActionTarget: function () {
		return this.options.actionTarget;
	},
	setActionTarget: function (value) {
		this.options.actionTarget = value;
	},

	getActionType: function () {
		return this.options.actionType;
	},
	setActionType: function (value) {
		this.options.actionType = value;
	},

	getPosition: function () {
		return this.options.position;
	},
	setPosition: function (value) {
		this.options.position = value;
	},

	getOffsetLeft: function () {
		return this.options.offsetLeft;
	},
	setOffsetLeft: function (value) {
		this.options.offsetLeft = value;
	},

	getOffsetTop: function () {
		return this.options.offsetTop;
	},
	setOffsetTop: function (value) {
		this.options.offsetTop = value;
	}
});