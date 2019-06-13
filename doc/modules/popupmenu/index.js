// 2019-06-10

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIButton = VRender.UIButton;
const UIPopupMenu = VRender.UIPopupMenu;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIPopupMenu 弹出菜单";
	},

	renderDemos: function (target, render) {
		ModuleView.super(this, target, render);
		this.renderDemo1(render);
		this.renderDemo2(render);
		this.renderDemo3(render);
		this.renderDemo4(render);
		this.renderDemo5(render);
		this.renderDemo6(render);
		this.renderDemo7(render);
		this.renderDemo8(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let menus = [
			{ name: "menu1", label: "菜单1" },
			{ name: "menu2", label: "菜单2" },
			{ name: "menu3", label: "菜单3" },
			{ name: "menu4", label: "菜单4" },
			{ name: "menu5", label: "菜单5", children: [
				{ name: "menu51", label: "菜单5-1" },
				{ name: "menu52", label: "菜单5-2", children: [
					{ name: "menu521", label: "菜单5-2-1", children: [
						{name: "menu5211", label: "菜单5-2-1-1"}
					] },
					{ name: "menu522", label: "菜单5-2-2" },
					{ name: "menu523", label: "菜单5-2-3" },
					{ name: "menu524", label: "菜单5-2-4" },
					{ name: "menu525", label: "菜单5-2-5" },
					{ name: "menu526", label: "菜单5-2-6" },
					{ name: "menu527", label: "菜单5-2-7" },
					{ name: "menu528", label: "菜单5-2-8" },
				] },
				{ name: "menu53", label: "菜单5-3", children: [
					{name: "menu531", label: "菜单5-3-1" },
					{name: "menu532", label: "菜单5-3-2" }
				] },
				{ name: "menu54", label: "菜单5-4" }
			] }
		];

		let demo = new UIGroup(this);
		let button = demo.add(new UIButton(this, { label: "点击按钮弹出菜单" }));
		demo.add(new UIGroup(this))
			.append(new UIPopupMenu(this, { data: menus, actionTarget: button }));

		let source = [];
		source.push("var button = new UIButton([context], {\n  label: '点击按钮弹出菜单'\n});");
		source.push("new UIPopupMenu([context], {");
		source.push("  actionTarget: button,");
		source.push("  data: [");
		source.push("    { name: 'menu1', label: '菜单1' },");
		source.push("    { name: 'menu2', label: '菜单2' },");
		source.push("    { name: 'menu3', label: '菜单3' },");
		source.push("    { name: 'menu4', label: '菜单4' },");
		source.push("    { name: 'menu5', label: '菜单5', children: [");
		source.push("      { name: 'menu51', label: '菜单5-1' },");
		source.push("      { name: 'menu52', label: '菜单5-2', children: [");
		source.push("        { name: 'menu521', label: '菜单5-2-1', children: [");
		source.push("          { name: 'menu5211', label: '菜单5-2-1-1' }");
		source.push("        ] },");
		source.push("        { name: 'menu522', label: '菜单5-2-2' },");
		source.push("        { name: 'menu523', label: '菜单5-2-3' },");
		source.push("        { name: 'menu524', label: '菜单5-2-4' },");
		source.push("        { name: 'menu525', label: '菜单5-2-5' },");
		source.push("        { name: 'menu526', label: '菜单5-2-6' },");
		source.push("        { name: 'menu527', label: '菜单5-2-7' },");
		source.push("        { name: 'menu528', label: '菜单5-2-8' },");
		source.push("      ] },");
		source.push("      { name: 'menu53', label: '菜单5-3', children: [");
		source.push("        { name: 'menu531', label: '菜单5-3-1' },");
		source.push("        { name: 'menu532', label: '菜单5-3-2' }");
		source.push("      ] },");
		source.push("      { name: 'menu54', label: '菜单5-4' }");
		source.push("    ] }");
		source.push("  ]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("属性 <>icon</>：显示图标");

		let menus = [
			{ name: "menu1", label: "菜单1", icon: "/icons/b02.png" },
			{ name: "menu2", label: "菜单2", icon: "/icons/b03.png" },
			{ name: "menu3", label: "菜单3", icon: "/icons/b04.png", children: [
				{ name: "menu31", label: "菜单3-1", icon: "/icons/b05.png" },
				{ name: "menu32", label: "菜单3-2" },
				{ name: "menu33", label: "菜单3-3" }
			] }
		];

		let demo = new UIGroup(this);
		let button = demo.add(new UIButton(this, { label: "点击按钮弹出菜单" }));
		demo.add(new UIGroup(this))
			.append(new UIPopupMenu(this, { data: menus, actionTarget: button }));

		let source = [];
		source.push("var button = new UIButton([context], {\n  label: '点击按钮弹出菜单'\n});");
		source.push("new UIPopupMenu([context], {");
		source.push("  actionTarget: button,");
		source.push("  data: [");
		source.push("    { name: 'menu1', label: '菜单1', icon: '/icons/b02.png' },");
		source.push("    { name: 'menu2', label: '菜单2', icon: '/icons/b03.png' },");
		source.push("    { name: 'menu3', label: '菜单3', icon: '/icons/b04.png',");
		source.push("      children: [");
		source.push("        { name: 'menu31', label: '菜单3-1', icon: '/icons/b05.png' },");
		source.push("        { name: 'menu32', label: '菜单3-2' },");
		source.push("        { name: 'menu33', label: '菜单3-3' }");
		source.push("    ] }");
		source.push("  ]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("分组显示");

		let menus = [[
			{ name: "menu1", label: "菜单1", icon: "/icons/b02.png" },
			{ name: "menu2", label: "菜单2", icon: "/icons/b03.png" },
			{ name: "menu3", label: "菜单3"}
		], [
			{ name: "menu4", label: "菜单4", icon: "/icons/b04.png" },
			{ name: "menu5", label: "菜单5", children: [[
				{ name: "menu51", label: "菜单5-1" }
			], [
				{ name: "menu52", label: "菜单5-2" },
				{ name: "menu53", label: "菜单5-3" },
				{ name: "menu54", label: "菜单5-4" }
			], [
				{ name: "menu55", label: "菜单5-5" },
				{ name: "menu56", label: "菜单5-6" }
			]] }
		], [
			{ name: "menu6", label: "菜单6", icon: "/icons/b05.png" },
			{ name: "menu7", label: "菜单7" },
			{ name: "menu8", label: "菜单8" },
			{ name: "menu9", label: "菜单9" }
		]];
		menus[1].title = "自定义标题";

		let demo = new UIGroup(this);
		let button = demo.add(new UIButton(this, { label: "点击按钮弹出菜单" }));
		demo.add(new UIGroup(this))
			.append(new UIPopupMenu(this, { data: menus, actionTarget: button }));

		let source = [];
		source.push("var menus = [");
		source.push("  [");
		source.push("    { name: 'menu1', label: '菜单1, icon: '/icons/b02.png' },");
		source.push("    { name: 'menu2', label: '菜单2, icon: '/icons/b03.png' },");
		source.push("    { name: 'menu3', label: '菜单3' }");
		source.push("  ],");
		source.push("  [");
		source.push("    { name: 'menu4', label: '菜单4, icon: '/icons/b04.png' },");
		source.push("    { name: 'menu4', label: '菜单4, icon: '/icons/b04.png',");
		source.push("      children: [");
		source.push("        [");
		source.push("          { name: 'menu51', label: '菜单5-1' }");
		source.push("        ],");
		source.push("        [");
		source.push("          { name: 'menu52', label: '菜单5-2' },");
		source.push("          { name: 'menu53', label: '菜单5-3' },");
		source.push("          { name: 'menu54', label: '菜单5-4' }");
		source.push("        ],");
		source.push("        [");
		source.push("          { name: 'menu55', label: '菜单5-5' },");
		source.push("          { name: 'menu56', label: '菜单5-6' }");
		source.push("        ]");
		source.push("      ] }");
		source.push("  ],");
		source.push("  [");
		source.push("    { name: 'menu6', label: '菜单6, icon: '/icons/b05.png' },");
		source.push("    { name: 'menu7', label: '菜单7' },");
		source.push("    { name: 'menu8', label: '菜单8' },");
		source.push("    { name: 'menu9', label: '菜单9' }");
		source.push("  ]");
		source.push("];");
		source.push("menus[1].title = '自定义标题';");
		source.push("var button = new UIButton([context], {\n  label: '点击按钮弹出菜单'\n});");
		source.push("new UIPopupMenu([context], {");
		source.push("  data: menus,");
		source.push("  actionTarget: button,");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("属性 <>toggle</>：状态切换");

		let menus = [[
			{name: "menu1", label: "菜单1", toggle: true}
		], [
			{name: "menu2", label: "菜单2", toggle: "group1"},
			{name: "menu3", label: "菜单3", toggle: "group1"},
			{name: "menu4", label: "菜单4", toggle: "group1"}
		], [
			{name: "menu5", label: "菜单5", children: [[
				{name: "menu51", label: "菜单5-1", toggle: "group2"},
				{name: "menu52", label: "菜单5-2", toggle: "group2"},
				{name: "menu53", label: "菜单5-3", toggle: "group2"}
			], [
				{name: "menu54", label: "菜单5-4", toggle: "group3"},
				{name: "menu55", label: "菜单5-5", toggle: "group3"}
			]]},
			{name: "menu6", label: "菜单6", toggle: true},
			{name: "menu7", label: "菜单7", toggle: true},
			{name: "menu8", label: "菜单8"}
		]];

		let demo = new UIGroup(this);
		var button = demo.add(new UIButton(this, { label: "点击按钮弹出菜单" }));
		demo.add(new UIGroup(this))
			.append(new UIPopupMenu(this, { data: menus, actionTarget: button }));

		let source = [];
		source.push("var button = new UIButton([context], {\n  label: '点击按钮弹出菜单'\n});");
		source.push("new UIPopupMenu([context], {");
		source.push("  actionTarget: button,");
		source.push("  data: [");
		source.push("    [");
		source.push("      { name: 'menu1', label: '菜单1', toggle: true }");
		source.push("    ],");
		source.push("    [");
		source.push("      { name: 'menu2', label: '菜单2', toggle: 'group1' },");
		source.push("      { name: 'menu3', label: '菜单3', toggle: 'group1' },");
		source.push("      { name: 'menu4', label: '菜单4', toggle: 'group1' }");
		source.push("    ],");
		source.push("    [");
		source.push("      { name: 'menu5', label: '菜单5', children: [");
		source.push("        [");
		source.push("          { name: 'menu51', label: '菜单5-1', toggle: 'group2' },");
		source.push("          { name: 'menu52', label: '菜单5-2', toggle: 'group2' },");
		source.push("          { name: 'menu53', label: '菜单5-3', toggle: 'group2' }");
		source.push("        ],");
		source.push("        [");
		source.push("          { name: 'menu54', label: '菜单5-4', toggle: 'group3' },");
		source.push("          { name: 'menu55', label: '菜单5-5', toggle: 'group3' }");
		source.push("        ]");
		source.push("      ] },");
		source.push("      { name: 'menu6', label: '菜单6', toggle: true },");
		source.push("      { name: 'menu7', label: '菜单7', toggle: true },");
		source.push("      { name: 'menu8', label: '菜单8' }");
		source.push("    ]");
		source.push("  ]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("菜单偏移");
		description.push("属性 <>offsetLeft</> 和 <>offsetTop</> 分别设置菜单 向左 和 向上 便宜量，允许负值。");

		let menus = [
			{name: "menu1", label: "菜单1"},
			{name: "menu2", label: "菜单2"},
			{name: "menu3", label: "菜单3"},
			{name: "menu4", label: "菜单4"}
		];

		let demo = new UIGroup.VGroup(this, { gap: 10 });
		demo.add(new UIGroup(this))
			.append(new UIButton(this, { name: "popupmenu_btn51", label: "向左偏移20像素" }))
			.append(new UIGroup(this).append(new UIPopupMenu(this, {
				data: menus, actionTarget: "[name=popupmenu_btn51]", offsetLeft: -10 })));
		demo.add(new UIGroup(this))
			.append(new UIButton(this, { name: "popupmenu_btn52", label: "向下偏移20像素" }))
			.append(new UIGroup(this).append(new UIPopupMenu(this, {
				data: menus, actionTarget: "[name=popupmenu_btn52]", offsetTop: 10 })));

		let source = [];
		source.push("var menus = [");
		source.push("  { name: 'menu1', label: '菜单1' },");
		source.push("  { name: 'menu2', label: '菜单2' },");
		source.push("  { name: 'menu3', label: '菜单3' },");
		source.push("  { name: 'menu4', label: '菜单4' }");
		source.push("];");
		source.push("// offsetLeft");
		source.push("new UIButton([context], {\n  name: 'popupmenu_btn51',\n  label: '向左偏移20像素'\n});");
		source.push("new UIPopupMenu([context], {");
		source.push("  actionTarget: '[name=popupmenu_btn51]',");
		source.push("  data: menus,");
		source.push("  offsetList: -10");
		source.push("});");
		source.push("// offsetTop");
		source.push("new UIButton([context], {\n  name: 'popupmenu_btn52',\n  label: '向下偏移20像素'\n});");
		source.push("new UIPopupMenu([context], {");
		source.push("  actionTarget: '[name=popupmenu_btn52]',");
		source.push("  data: menus,");
		source.push("  offsetTop: 10");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		let description = [];
		description.push("动态菜单");

		let menus = [
			{name: "menu1", label: "菜单1"},
			{name: "menu2", label: "菜单2"},
			{name: "menu3", label: "菜单3", children: []},
			{name: "menu4", label: "菜单4"},
			{name: "menu5", label: "菜单5", children: []},
		];

		let demo = new UIGroup(this);
		let button = demo.add(new UIButton(this, { label: "点击按钮弹出菜单" }));
		demo.add(new UIGroup(this))
			.append(new UIPopupMenu(this, { ref: "menu8", data: menus, actionTarget: button }));

		let source = [];
		source.push("var button = new UIButton([context], {\n  label: '点击按钮弹出菜单'\n});");
		source.push("new UIPopupMenu([context], {");
		source.push("  actionTarget: button,");
		source.push("  data: [");
		source.push("    { name: 'menu1', label: '菜单1' },");
		source.push("    { name: 'menu2', label: '菜单2' },");
		source.push("    { name: 'menu3', label: '菜单3', children: [] },");
		source.push("    { name: 'menu4', label: '菜单4' },");
		source.push("    { name: 'menu5', label: '菜单5', children: [] }");
		source.push("  ]");
		source.push("});");
		source.push("// 前端代码");
		source.push("$ref('menu8').on('open_before', function (e, data, subDatas) {");
		source.push("  if (!data) return ;");
		source.push("  var level = (parseInt(data.level) || 0) + 1;");
		source.push("  if (!subDatas || !subDatas.length) {");
		source.push("    subDatas = [];");
		source.push("    for (var i = 0; i < level; i++) {");
		source.push("      var _data = {};");
		source.push("      _data.name = data.name + i;");
		source.push("      _data.label = data.label + '-' + i;");
		source.push("      _data.level = level;");
		source.push("      if (level < 5) _data.children = [];");
		source.push("      subDatas.push(_data);");
		source.push("    }");
		source.push("    e.returnValue = subDatas;");
		source.push("  }");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo7: function (render) {
		let description = [];
		description.push("异步加载");

		let demo = new UIGroup(this);
		let button = demo.add(new UIButton(this, { label: "点击按钮弹出菜单" }));
		demo.add(new UIGroup(this))
			.append(new UIPopupMenu(this, { actionTarget: button,
				apiName: "data.component.tree", apiParams: { total: 10, p_size: 3 }}));

		let source = [];
		source.push("var button = new UIButton([context], {\n  label: '点击按钮弹出菜单'\n});");
		source.push("new UIPopupMenu([context], {");
		source.push("  actionTarget: button,");
		source.push("  apiName: 'data.component.tree',");
		source.push("  apiParams: {\n    total: 10,\n    p_size: 3\n  }");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo8: function (render) {
		let description = [];
		description.push("属性 <>disabled</>：禁用菜单");

		let menus = [
			{name: "menu1", label: "菜单1"},
			{name: "menu2", label: "菜单2", disabled: true},
			{name: "menu3", label: "菜单3"}
		];

		let demo = new UIGroup(this);
		var button = demo.add(new UIButton(this, { label: "点击按钮弹出菜单" }));
		demo.add(new UIGroup(this))
			.append(new UIPopupMenu(this, { data: menus, actionTarget: button }));

		let source = [];
		source.push("var button = new UIButton([context], {\n  label: '点击按钮弹出菜单'\n});");
		source.push("new UIPopupMenu([context], {");
		source.push("  actionTarget: button,");
		source.push("  data: [");
		source.push("    { name: 'menu1', label: '菜单1' },");
		source.push("    { name: 'menu2', label: '菜单2', disabled: true },");
		source.push("    { name: 'menu3', label: '菜单3' }");
		source.push("  ]");
		source.push("});");

		render(demo, source, description);
	}
});