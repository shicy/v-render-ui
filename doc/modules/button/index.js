// 2019-04-09

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const UIGroup = VRender.UIGroup;
const UIButton = VRender.UIButton;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIButton 按钮";
	},

	renderDemos: function (target, render) {
		ModuleView.super(this, target, render);
		this.renderDemo1(render);
	},

	renderDemo1: function (render) {
		let demo = new UIGroup(this);
		demo.append(new UIButton(this));
		render(demo);
	}
});
