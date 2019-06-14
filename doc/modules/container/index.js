// 2019-06-14

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIContainer = VRender.UIContainer;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIContainer 边框容器";
	},

	renderDemos: function (target, render) {
		ModuleView.super(this, target, render);
		this.renderDemo1(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let demo = new UIGroup(this);
		demo.append(new UIContainer(this, { content: "可以包含的内容为一个组件，或任意的网页代码..",
			styles: { border: "1px solid red", borderWidth: 1, minHeight: 80, background: "#fbeed9", 
				color: "#8a2a17", padding: 10 } }));

		let source = [];
		source.push("new UIContainer([context], {");
		source.push("  content: '可以包含的内容为一个组件，或任意的网页代码..',");
		source.push("  styles: {");
		source.push("    minHeight: 80,");
		source.push("    padding: 10,");
		source.push("    color: '#8a2a17',");
		source.push("    border: '1px solid red',");
		source.push("    borderWidth: 1,");
		source.push("    background: '#fbeed9'");
		source.push("  }");
		source.push("});");

		render(demo, source, description);
	}
});