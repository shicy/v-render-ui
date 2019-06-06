// 2019-06-06

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const UIGroup = VRender.UIGroup;
const UIRadiobox = VRender.UIRadiobox;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIRadiobox 单选框";
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
		demo.append(new UIRadiobox(this, { label: "Radiobox1", name: "radbox", value: 1 }));
		demo.append(new UIRadiobox(this, { label: "Radiobox2", name: "radbox", value: 2 }));

		let source = [];
		source.push("new UIRadiobox([context], {\n  label: 'Radiobox1',\n  name: 'radbox',\n  value: 1\n});");
		source.push("new UIRadiobox([context], {\n  label: 'Radiobox2',\n  name: 'radbox',\n  value: 2\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("属性 <>checked</>：选中状态");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UIRadiobox(this, { label: "未选中", name: "radbox2", value: 1 }));
		demo.append(new UIRadiobox(this, { label: "默认选中", name: "radbox2", value: 2, checked: true }));

		let source = [];
		source.push("new UIRadiobox([context], {\n  label: '未选中',\n  name: 'radbox2',\n  value: 1\n});");
		source.push("new UIRadiobox([context], {\n  label: '默认选中',\n  name: 'radbox2',\n  value: 2,\n  checked: true\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("属性 <>disabled</>：禁用");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UIRadiobox(this, { label: "Radiobox1", name: "radbox3", value: 1 }));
		demo.append(new UIRadiobox(this, { label: "Radiobox2", name: "radbox3", value: 2, checked: true, disabled: true }));
		demo.append(new UIRadiobox(this, { label: "Radiobox3", name: "radbox3", value: 3, disabled: true }));
		demo.append(new UIRadiobox(this, { label: "Radiobox4", name: "radbox3", value: 4 }));

		let source = [];
		source.push("new UIRadiobox([context], {\n  label: 'Radiobox1',\n  name: 'radbox3',\n  value: 1\n});");
		source.push("new UIRadiobox([context], {\n  label: 'Radiobox2',\n  name: 'radbox3',\n  value: 2," +
			"\n  checked: true,\n  disabled: true\n});");
		source.push("new UIRadiobox([context], {\n  label: 'Radiobox3',\n  name: 'radbox3',\n  value: 3," +
			"\n  disabled: true\n});");
		source.push("new UIRadiobox([context], {\n  label: 'Radiobox4',\n  name: 'radbox3',\n  value: 4\n});");

		render(demo, source, description);
	}
});