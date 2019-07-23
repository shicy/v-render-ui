// ========================================================
// 选项卡
// @author shicy <shicy85@163.com>
// Create on 2019-07-23
// ========================================================

const VRender = require(__vrender__);
const UISelectable = require("../../common/UISelectable");
const Renderer = require("./render");


const UITabbar = UISelectable.extend(module, {
	renderView: function () {
		UITabbar.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	isMultiple: function () {
		return false;
	}
});