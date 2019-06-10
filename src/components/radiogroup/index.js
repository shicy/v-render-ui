// ========================================================
// 单选组，确保组内只有一个被选中
// @author shicy <shicy85@163.com>
// Create on 2019-06-10
// ========================================================

const VRender = require(__vrender__);
const UISelectable = require("../../common/UISelectable");
const Renderer = require("./render");


const UIRadioGroup = UISelectable.extend(module, {
	renderView: function () {
		UIRadioGroup.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	isMultiple: function () {
		return false;
	}
});