// 2019-06-10

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIRadioGroup = VRender.UIRadioGroup;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIRadioGroup 单选框组";
	},

	renderDemos: function (target, render) {
		ModuleView.super(this, target, render);
		this.renderDemo1(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let demo = new UIGroup.VGroup(this, { gap: 10 });
		demo.append(new UIRadioGroup(this, { data: ["A", "B", "C", "D"], selectedIndex: 1 }));
		demo.append(new UIRadioGroup(this, { data: ["A", "B", "C", "D"], selectedIndex: 0 }));

		let source = [];
		source.push("new UIRadioGroup([context], {\n  data: ['A', 'B', 'C', 'D'],\n  selectedIndex: 1\n});");
		source.push("new UIRadioGroup([context], {\n  data: ['A', 'B', 'C', 'D'],\n  selectedIndex: 0\n});");

		render(demo, source, description);
	}
});