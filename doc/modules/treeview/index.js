// 2019-07-25

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UITreeView = VRender.UITreeView;

const exampleData = [{
	code: "110000", value: "北京市", icon: "/icons/c02.png",
	children: [{
		code: "110100", value: "市辖区", 
		children: [{
			code: "110101", value: "东城区", leaf: true
		}, {
			code: "110102", value: "西城区", leaf: true
		}, {
			code: "110105", value: "朝阳区", leaf: true
		}, {
			code: "110106", value: "丰台区", leaf: true
		}, {
			code: "110107", value: "石景山区", leaf: true
		}, {
			code: "110108", value: "海淀区", leaf: true
		}, {
			code: "110109", value: "门头沟区", leaf: true
		}, {
			code: "110111", value: "房山区", leaf: true
		}, {
			code: "110112", value: "通州区", leaf: true
		}, {
			code: "110113", value: "顺义区", leaf: true
		}, {
			code: "110114", value: "昌平区", leaf: true
		}, {
			code: "110115", value: "大兴区", leaf: true
		}, {
			code: "110116", value: "怀柔区", leaf: true
		}, {
			code: "110117", value: "平谷区", leaf: true
		}, {
			code: "110118", value: "密云区", leaf: true
		}, {
			code: "110119", value: "延庆区", leaf: true
		}]
	}]
}, {
	code: "120000", value: "天津市", icon: "/icons/c03.png",
	children: [{
		code: "120100", value: "市辖区",
		children: [{
			code: "120101", value: "和平区", leaf: true
		}, {
			code: "120102", value: "河东区", leaf: true
		}, {
			code: "120103", value: "河西区", leaf: true
		}, {
			code: "120104", value: "南开区", leaf: true
		}, {
			code: "120105", value: "河北区", leaf: true
		}, {
			code: "120106", value: "红桥区", leaf: true
		}, {
			code: "120110", value: "东丽区", leaf: true
		}, {
			code: "120111", value: "西青区", leaf: true
		}]
	}]
}, {
	code: "130000", value: "河北省", icon: "/icons/c04.png",
	children: [{
		code: "130100", value: "石家庄市", icon: "/icons/c10.png",
		children: [{
			code: "130101", value: "市辖区", leaf: true
		}, {
			code: "130102", value: "长安区", leaf: true
		}, {
			code: "130102", value: "桥西区", leaf: true
		}]
	}, {
		code: "130200", value: "唐山市",
		children: [{
			code: "130201", value: "市辖区", leaf: true
		}, {
			code: "130202", value: "路南区", leaf: true
		}, {
			code: "130203", value: "路北区", leaf: true
		}]
	}, {
		code: "130400", value: "秦皇岛市", leaf: true
	}, {
		code: "130500", value: "邯郸市", leaf: true
	}, {
		code: "130500", value: "邢台市", leaf: true
	}, {
		code: "130600", value: "保定市", leaf: true
	}]
}, {
	code: "140000", value: "山西省", icon: "/icons/c05.png", leaf: true
}, {
	code: "150000", value: "内蒙古自治区", icon: "/icons/c06.png", leaf: true
}, {
	code: "210000", value: "辽宁省", icon: "/icons/c07.png", leaf: true
}, {
	code: "220000", value: "吉林省", icon: "/icons/c08.png", leaf: true
}, {
	code: "230000", value: "黑龙江省", icon: "/icons/c09.png", leaf: true
}];

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UITreeView 树形视图";
	},

	getDescription: function () {
		return "注：以下 Demo 中的默认数据集请查看页面底部";
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
		this.renderDemo9(render);
		this.renderDemo10(render);
		this.renderExampleData(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITreeView(this, { data: exampleData, selectedIndex: 0 }));

		let source = [];
		source.push("new UITreeView([context], {\n  data: dataSource,\n  selectedIndex: 0\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("选择框");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITreeView(this, { data: exampleData, chkbox: true, selectedKey: "110100" }));

		let source = [];
		source.push("new UITreeView([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  selectedKey: '110100'");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("多选");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITreeView(this, { data: exampleData, chkbox: true, multi: true, selectedIndex: "1,2" }));

		let source = [];
		source.push("new UITreeView([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  multi: true,");
		source.push("  selectedIndex: '1,2'");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("自定义节点");

		let myLabelFunction = function (data) {
			return [data.code, data.value].join("_");
		};

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITreeView(this, { data: exampleData, labelFunction: myLabelFunction }));

		let source = [];
		source.push("new UITreeView([context], {");
		source.push("  data: dataSource,");
		source.push("  labelFunction: function (data) {");
		source.push("    return data.code + '_' + data.value;");
		source.push("  }");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("节点渲染器");

		let myItemRenderer = function ($, item, data) {
			let view = $("<div></div>");
			$("<label></label>").appendTo(view).text(data.value);
			let code = $("<span></span>").appendTo(view);
			code.text(data.code);
			code.css({color: "#fff", backgroundColor: "#000", marginLeft: "5px"});
			return view;
		};

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITreeView(this, { data: exampleData, chkbox: true, itemRenderer: myItemRenderer }));

		let source = [];
		source.push("new UITreeView([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  itemRenderer: function (data) {");
		source.push("    var $ = $ || VRender.$;");
		source.push("    var view = $('<div></div');");
		source.push("    $('<label></label>').appendTo(view).text(data.value);");
		source.push("    var code = $('<span></span>').appendTo(view);");
		source.push("    code.text(data.code);");
		source.push("    code.css({color: '#fff', backgroundColor: '#000', marginLeft: '5px'});");
		source.push("    return view;");
		source.push("  }");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		let description = [];
		description.push("图标");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITreeView(this, { data: exampleData, chkbox: true, icon: "icon" }));

		let source = [];
		source.push("new UITreeView([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  icon: 'icon'");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo7: function (render) {
		let description = [];
		description.push("图标（使用自定义方法）");

		let myIconFunction = function (data) {
			if (/0000$/.test(data.code))
				return "/icons/d02.png";
			if (/00$/.test(data.code))
				return "/icons/d03.png";
			return "/icons/d04.png";
		};

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITreeView(this, { data: exampleData, chkbox: true, icon: myIconFunction }));

		let source = [];
		source.push("new UITreeView([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  icon: function (data) {}");
		source.push("    if (/0000$/.test(data.code))");
		source.push("      return '/icons/d02.png';");
		source.push("    if (/00$/.test(data.code))");
		source.push("      return '/icons/d03.png';");
		source.push("    return '/icons/d04.png';");
		source.push("  }");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo8: function (render) {
		let description = [];
		description.push("默认展开和选择（按索引）");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITreeView(this, { data: exampleData, chkbox: true, openIndex: "0,1", 
			selectedIndex: "3,8", multi: true }));

		let source = [];
		source.push("new UITreeView([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  openIndex: '0,1',");
		source.push("  selectedIndex: '3,8',");
		source.push("  multi: true");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo9: function (render) {
		let description = [];
		description.push("默认展开和选择（按编号）");

		let myLabelFunction = function (data) {
			return data.value + " " + data.code;
		};

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITreeView(this, { data: exampleData, keyField: "code", chkbox: true, openId: "120100,130000", 
			selectedKey: "110107,120100,220000", multi: true, labelFunction: myLabelFunction }));

		let source = [];
		source.push("new UITreeView([context], {");
		source.push("  data: dataSource,");
		source.push("  keyField: 'code',");
		source.push("  chkbox: true,");
		source.push("  openId: '120100,130000',");
		source.push("  selectedKey: '110107,120100,220000',");
		source.push("  multi: true,");
		source.push("  labelFunction: function (data) {");
		source.push("    return data.value + ' ' + data.code;");
		source.push("  }");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo10: function (render) {
		let description = [];
		description.push("动态加载");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITreeView(this, { apiName: "data.component.tree", chkbox: true, openIndex: "1,0,2",
			apiParams: { total: 10, p_size: 3 }, selectedKey: "122" }));

		let source = [];
		source.push("new UITreeView([context], {");
		source.push("  apiName: 'data.component.tree',");
		source.push("  chkbox: true,");
		source.push("  openIndex: '1,0,2',");
		source.push("  selectedKey: '122',");
		source.push("  apiParams: {");
		source.push("    total: 10,");
		source.push("    p_size: 3");
		source.push("  }");
		source.push("});");

		render(demo, source, description);
	},

	renderExampleData: function (render) {
		let description = [];
		description.push("以上数据结构如下");

		let source = [];
		source = JSON.stringify(exampleData, null, "  ");

		render(null, source, description);
	}
});