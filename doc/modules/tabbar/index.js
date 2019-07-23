// 2019-07-22

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UITabbar = VRender.UITabbar;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UITabbar 标签页";
	},

	renderDemos: function (target, render) {
		ModuleView.super(this, target, render);
		this.renderDemo1(render);
		this.renderDemo2(render);
		this.renderDemo3(render);
		this.renderDemo4(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		var tabs = [{label: "标签1", name: "tab1"}, {label: "标签2", name: "tab2"}, 
			{label: "标签3", name: "tab3"}, {label: "标签4", name: "tab4"}];

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITabbar(this, { data: tabs, selectedIndex: 0 }));

		let source = [];
		source.push("new UITabbar([context], {");
		source.push("  data: [");
		source.push("    { label: '标签1', name: 'tab1' },");
		source.push("    { label: '标签2', name: 'tab2' },");
		source.push("    { label: '标签3', name: 'tab3' },");
		source.push("    { label: '标签4', name: 'tab4' }");
		source.push("  ],");
		source.push("  selectedIndex: 0");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		if (this.isApp)
			return ;

		let description = [];
		description.push("关闭按钮");

		var tabs = [{label: "标签1", name: "tab1"}, {label: "标签2", name: "tab2", closable: true}, 
			{label: "标签3", name: "tab3", closable: true}, {label: "标签4", name: "tab4", closable: true}];

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITabbar(this, { data: tabs, selectedIndex: 1 }));

		let source = [];
		source.push("new UITabbar([context], {");
		source.push("  data: [");
		source.push("    { label: '标签1', name: 'tab1' },");
		source.push("    { label: '标签2', name: 'tab2', closable: true },");
		source.push("    { label: '标签3', name: 'tab3', closable: true },");
		source.push("    { label: '标签4', name: 'tab4', closable: true }");
		source.push("  ],");
		source.push("  selectedIndex: 1");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("更多标签");

		let tabs = [];
		for (let i = 1; i <= 20; i++) {
			tabs.push({label: "标签" + i, name: "tab" + i});
		}

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITabbar(this, { data: tabs, selectedIndex: 15 }));

		let source = [];
		source.push("let tabs = [];");
		source.push("for (let i = 1; i <= 20; i++) {");
		source.push("  tabs.push({ label: '标签' + i, name: 'tab' + i });");
		source.push("}");
		source.push("new UITabbar([context], {");
		source.push("  data: tabs,");
		source.push("  selectedIndex: 15");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("禁用");

		var tabs = [{label: "标签", name: "tab1"}, {label: "禁用的标签", name: "tab2", disabled: true}, 
			{label: "可用的标签", name: "tab3"}];

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITabbar(this, { data: tabs, selectedIndex: 0 }));

		let source = [];
		source.push("new UITabbar([context], {");
		source.push("  data: [");
		source.push("    { label: '标签', name: 'tab1' },");
		source.push("    { label: '禁用的标签', name: 'tab2', disabled: true },");
		source.push("    { label: '可用的标签', name: 'tab3' }");
		source.push("  ],");
		source.push("  selectedIndex: 0");
		source.push("});");

		render(demo, source, description);
	}
});