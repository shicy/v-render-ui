// 2019-04-13

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const UIGroup = VRender.UIGroup;
const UICheckbox = VRender.UICheckbox;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UICheckbox 对选框";
	},

	renderDemos: function (target, render) {
		ModuleView.super(this, target, render);
		this.renderDemo1(render);
	},

	renderDemo1: function (render) {
		let demo = new UIGroup(this);
		demo.append(new UICheckbox(this));
		render(demo);
	}
});
