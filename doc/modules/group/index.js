// 2019-04-13

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const UIGroup = VRender.UIGroup;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIGroup 组视图";
	},

	renderDemos: function (target, render) {
		ModuleView.super(this, target, render);
		this.renderDemo1(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("属性 <>orientation</> 是子组件陈列方向，可选值：<>vertical</>、<>horizontial</>，默认按子组件的默认陈列。");
		description.push("属性 <>align</> 是子组件位置，可选值：<>start</>、<>center</>、<>end</>。");
		description.push("属性 <>gap</> 设置子组件之间的间距。");

		let demo = null;

		let source = [];
		source.push("new UIGroup([context]);");
		source.push("new UIGroup([context], { orientation: 'vertical|horizontial' });");
		source.push("new UIGroup([context], { align: 'start|center|end' });");
		source.push("new UIGroup([context], { gap: 10 });");

		render(demo, source, description);
	}
});
