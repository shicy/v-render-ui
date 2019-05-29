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
		this.renderDemo2(render);
		this.renderDemo3(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UICheckbox(this, { label: "Checkbox1", value: 1 }));
		demo.append(new UICheckbox(this, { label: "Checkbox2", value: 2 }));
		demo.append(new UICheckbox(this, { label: "长字符串，在移到端一行显示不下了，多行才能显示的情况", value: 3 }));

		let source = [];
		source.push("new UICheckbox([context], {\n  label: 'Checkbox1',\n  value: 1\n});");
		source.push("new UICheckbox([context], {\n  label: 'Checkbox2',\n  value: 2\n});");
		source.push("new UICheckbox([context], {\n  label: '长字符串，在移到端一行显示不下了，多行才能显示的情况',\n  value: 3\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("属性 <>checked</>：选中状态");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UICheckbox(this, { label: "未选中", value: 1 }));
		demo.append(new UICheckbox(this, { label: "默认选中", value: 2, checked: true }));

		let source = [];
		source.push("new UICheckbox([context], {\n  label: '未选中',\n  value: 1\n});");
		source.push("new UICheckbox([context], {\n  label: '默认选中',\n  value: 2,\n  checked: true\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("属性 <>disabled</>：禁用");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UICheckbox(this, { label: "一个禁用的多选框，未选中", value: 1, disabled: true }));
		demo.append(new UICheckbox(this, { label: "一个禁用的多选框，选中状态", value: 2, checked: true, disabled: true }));

		let source = [];
		source.push("new UICheckbox([context], {\n  label: '一个禁用的多选框，未选中',\n  value: 1,\n  disabled: true\n});");
		source.push("new UICheckbox([context], {\n  label: '一个禁用的多选框，选中状态',\n  value: 1,\n  checked: true,\n  disabled: true\n});");

		render(demo, source, description);
	}
});
