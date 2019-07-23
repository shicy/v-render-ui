// 2019-07-23

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIPanel = VRender.UIPanel;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIPanel 面板";
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

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIPanel(this, { title: "标题", content: "内容<br/><a href='#'>支持富文本</a>" }));

		let source = [];
		source.push("new UIPanel([context], {");
		source.push("  title: '标题',");
		source.push("  content: '内容<br/><a href=\"#\">支持富文本</a>'");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("按钮");

		var buttons = [];
		buttons.push({name: "btn1", label: "默认按钮"});
		buttons.push({name: "btn2", label: "带图标按钮", icon: "/icons/b04.png"})
		buttons.push({name: "btn3", label: "状态按钮", icon: "/icons/b05.png", toggle: true});
		buttons.push({name: "btn4", label: "下拉按钮", toggle: true,
			items: [{name: "btn41", label: "下拉按钮1"}, {name: "btn42", label: "下拉按钮2"}, 
				{name: "btn43", label: "下拉按钮3"}, {name: "btn44", label: "下拉按钮4"}]});
		buttons.push({name: "btn5", label: false, icon: "/icons/d01.png", tooltip: "图标按钮",
			items: [{name: "btn51", label: "选项1", icon: "/icons/b02.png"},
				{name: "btn52", label: "选项2"},
				{name: "btn53", label: "选项3", icon: "/icons/b04.png"}]});

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIPanel(this, { title: "自定义按钮", buttons: buttons }));

		let source = [];
		source.push("new UIPanel([context], {");
		source.push("  title: '自定义按钮',");
		source.push("  buttons: [{");
		source.push("    name: 'btn1',");
		source.push("    label: '默认按钮'");
		source.push("  }, {");
		source.push("    name: 'btn2',");
		source.push("    label: '带图标按钮',");
		source.push("    icon: '/icons/b04.png'");
		source.push("  }, {");
		source.push("    name: 'btn3',");
		source.push("    label: '状态按钮',");
		source.push("    icon: '/icons/b05.png',");
		source.push("    toggle: true");
		source.push("  }, {");
		source.push("    name: 'btn4',");
		source.push("    label: '下拉按钮',");
		source.push("    toggle: true");
		source.push("    items: [");
		source.push("      { name: 'btn41', label: '下拉按钮1' },");
		source.push("      { name: 'btn42', label: '下拉按钮2' },");
		source.push("      { name: 'btn43', label: '下拉按钮3' },");
		source.push("      { name: 'btn44', label: '下拉按钮4' }");
		source.push("    ]");
		source.push("  }, {");
		source.push("    name: 'btn5',");
		source.push("    label: false,");
		source.push("    icon: '/icons/d01.png',");
		source.push("    tooltip: '图标按钮',");
		source.push("    items: [");
		source.push("      { name: 'btn51', label: '选项1', icon: '/icons/b02.png' },");
		source.push("      { name: 'btn52', label: '选项2' },");
		source.push("      { name: 'btn53', label: '选项3', icon: '/icons/b04.png' },");
		source.push("    ]");
		source.push("  }]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("多视窗");

		var viewports = [];
		viewports.push({name: "view1", label: "视图 1"});
		viewports.push({name: "view2", label: "视图 2", content: "视图2内容"});
		viewports.push({name: "view3", label: "视图 3", content: "视图3内容"});
		viewports.push({name: "view4", label: "视图 4"});

		var buttons = [];
		buttons.push({name: "btn", label: "按钮"});

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIPanel(this, { title: "标题", content: "默认视图", buttons: buttons,
			viewports: viewports, viewIndex: 0 }));

		let source = [];
		source.push("new UIPanel([context], {");
		source.push("  title: '标题',");
		source.push("  content: '默认视图',");
		source.push("  buttons: [");
		source.push("    { name: 'btn', label: '按钮' }");
		source.push("  ],");
		source.push("  viewports: [");
		source.push("    { name: 'view1', label: '视图 1' },");
		source.push("    { name: 'view2', label: '视图 2', content: '视图2内容' },");
		source.push("    { name: 'view3', label: '视图 3', content: '视图3内容' },");
		source.push("    { name: 'view4', label: '视图 4' },");
		source.push("  ],");
		source.push("  viewIndex: 0");
		source.push("});");

		render(demo, source, description);
	}
});