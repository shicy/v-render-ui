// 2019-04-09

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const UIGroup = VRender.UIGroup;
const UIHGroup = VRender.UIHGroup;
const UIButton = VRender.UIButton;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIButton 按钮";
	},

	renderDemos: function (target, render) {
		ModuleView.super(this, target, render);
		this.renderDemo1(render);
		this.renderDemo2(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("属性 <>type</> 可选值：");
		description.push("<>primary</>、<>success</>、<>error</>、<>warn</>、<>info</>、<>text</>、<>link</>。");

		let demo = new UIHGroup(this, {gap: 10});
		demo.append(new UIButton(this, { label: "Default" }));
		demo.append(new UIButton(this, { label: "Primary", type: "primary" }));
		demo.append(new UIButton(this, { label: "Success", type: "success" }));
		demo.append(new UIButton(this, { label: "Error", type: "error" }));
		demo.append(new UIButton(this, { label: "Warn", type: "warn" }));
		demo.append(new UIButton(this, { label: "Info", type: "info" }));
		demo.append(new UIButton(this, { label: "Text", type: "text" }));
		demo.append(new UIButton(this, { label: "Link", type: "link" }));

		let source = [];
		source.push("new UIButton([context], { label: 'Default' });");
		source.push("new UIButton([context], { label: 'Primary', type: 'primary' });");
		source.push("new UIButton([context], { label: 'Success', type: 'success' });");
		source.push("new UIButton([context], { label: 'Error', type: 'error' });");
		source.push("new UIButton([context], { label: 'Warn', type: 'warn' });");
		source.push("new UIButton([context], { label: 'Info', type: 'info' });");
		source.push("new UIButton([context], { label: 'Text', type: 'text' });");
		source.push("new UIButton([context], { label: 'Link', type: 'link' });");

		render(demo, source, description);
	},

	renderDemo2: function (render) {

	}
});
