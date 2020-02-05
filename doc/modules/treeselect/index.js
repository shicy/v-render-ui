// 2019-07-29

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UITreeSelect = VRender.UITreeSelect;

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
		return "UITreeSelect 树形下拉选择框";
	},

	getDescription: function () {
		return "注：以下 Demo 中的默认数据集请查看页面底部";
	},

	renderDemos: function (target, render) {
		ModuleView.super(this, target, render);
		this.renderDemo1(render);
		this.renderDemo2(render);
		this.renderDemo3(render);
		this.renderExampleData(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITreeSelect(this, { data: exampleData, prompt: "请选择", clearable: true }));

		let source = [];
		source.push("new UITreeSelect([context], {\n  data: dataSource,\n  prompt: '请选择'\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("多选");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITreeSelect(this, { data: exampleData, multi: true, selectedKey: "120104,130102" }));

		let source = [];
		source.push("new UITreeSelect([context], {\n  data: dataSource,\n  multi: true,\n  selectedKey: '120104,130102'\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("动态加载");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITreeSelect(this, { apiName: "data.component.tree", openIndex: "1,0,2",
			apiParams: {total: 10, p_size: 3}, selectedKey: "122" }));

		let source = [];
		source.push("new UITreeSelect([context], {");
		source.push("  apiName: 'data.component.tree',");
		source.push("  apiParams: {");
		source.push("    p_size: 3");
		source.push("  }");
		source.push("  openIndex: '1,0,2',");
		source.push("  selectedKey: '122'");
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