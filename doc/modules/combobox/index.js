// 2019-05-29

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIVGroup = VRender.UIVGroup;
const UICombobox = VRender.UICombobox;

const exampleData = [["选项1", "选项2"], "选项3", ["选项4", "选项5"], "选项6", "选项7"];
const exampleData2 = [{ id: 1, value: "val1", label: "选项1" }, { id: 2, value: "val2", label: "选项2" },
	{ id: 3, value: "val3", label: "选项3" }, { id: 4, value: "val4", label: "选项4" }];
const strExampleData = "[['选项1', '选项2'], '选项3', ['选项4', '选项5'], '选项6', '选项7'];";
const strExampleData2 = "[\n  { id: 1, value: 'val1', label: '选项1' }," +
	"\n  { id: 2, value: 'val2', label: '选项2' },\n  { id: 3, value: 'val3', label: '选项3' }," +
	"\n  { id: 4, value: 'val4', label: '选项4' }\n];";

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UICombobox 下拉选择框";
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
		description.push("属性 <>data</> 是一个数组，作为下拉列表的数据源。（支持数据源分组）");

		let demo = new UIGroup(this);
		demo.append(new UICombobox(this, { data: exampleData, prompt: "请选择.." }));

		let source = [];
		source.push("var items = " + strExampleData);
		source.push("new UICombobox([context], {\n  data: items,\n  prompt: '请选择..'\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("显示文本");
		description.push("如果数据类型为 <>string</> 则直接作为选项文本显示。");
		description.push("否则作为选项文本的优先顺序为：<>label</> &gt; <>name</> &gt; <>value</>。");
		description.push("属性 <>labelField</> 指定选项文本对应的字段名称。");
		description.push("属性 <>labelFunction</> 用于动态生成选项的文本内容，优先级大于 <>labelField</>。");

		let labelFunction = function (data) {
			return "== " + data.label + "(" + data.value + ") ==";
		};

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.add(new UIVGroup(this))
			.append($("label.demo-lbl").text("默认"))
			.append(new UICombobox(this, { data: exampleData2, selectedIndex: 0 }));
		demo.add(new UIVGroup(this))
			.append($("label.demo-lbl").text("使用 labelField"))
			.append(new UICombobox(this, { data: exampleData2, labelField: "value", selectedIndex: 0 }));
		demo.add(new UIVGroup(this))
			.append($("label.demo-lbl").text("使用 labelFunction"))
			.append(new UICombobox(this, { data: exampleData2, labelFunction: labelFunction, selectedIndex: 0 }));

		let source = [];
		source.push("var items = " + strExampleData2);
		source.push("new UICombobox([context], {\n  data: items,\n  selectedIndex: 0\n});");
		source.push("new UICombobox([context], {\n  data: items,\n  labelField: 'value',\n  selectedIndex: 0\n});");
		source.push("new UICombobox([context], {\n  data: items,\n  labelFunction: function (data) {" +
			"\n    return '==  ' + data.label + '(' + data.value + ')  ==';\n  },\n  selectedIndex: 0\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("默认选择");
		description.push("属性 <>selectedIndex</>：按索引号设置默认选项。");
		description.push("属性 <>selectedId</>：按编号设置默认选项。");
		description.push("注：默认选项编号为 <>id</>，想要将其他字段作为编号，请设置属性 <>idField</> 为相应字段名称。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.add(new UIVGroup(this))
			.append($("label.demo-lbl").text("使用 selectedIndex"))
			.append(new UICombobox(this, { data: exampleData2, selectedIndex: 2 }));
		demo.add(new UIVGroup(this))
			.append($("label.demo-lbl").text("使用 selectedIndex(分组)"))
			.append(new UICombobox(this, { data: exampleData, selectedIndex: 2 }));
		demo.add(new UIVGroup(this))
			.append($("label.demo-lbl").text("使用 selectedId"))
			.append(new UICombobox(this, { data: exampleData2, selectedId: 2 }));
		demo.add(new UIVGroup(this))
			.append($("label.demo-lbl").text("使用 idField"))
			.append(new UICombobox(this, { data: exampleData2, selectedId: "val2", idField: "value" }));

		let source = [];
		source.push("var items = " + strExampleData);
		source.push("var items2 = " + strExampleData2);
		source.push("// -----------------------------------------------------");
		source.push("new UICombobox([context], {\n  data:items2,\n  selectedIndex: 2\n});");
		source.push("new UICombobox([context], {\n  data:items,\n  selectedIndex: 2\n});");
		source.push("new UICombobox([context], {\n  data:items2,\n  selectedId: 2\n});");
		source.push("new UICombobox([context], {\n  data:items2,\n  selectedId: 'val2',\n  idField: 'value'\n});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("多选");
		description.push("设置属性 <>multi</> 为 <>ture</>。");
		description.push("多选情况的多个默认选项使用逗号(,)分隔，如：<>{selectedIndex: '1,3'}</>。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UICombobox(this, { data: exampleData, multi: true, selectedIndex: "1,3" }));

		let source = [];
		source.push("var items = " + strExampleData);
		source.push("new UICombobox([context], {\n  data: items,\n  multi: true,\n  selectedIndex: '1,3'\n});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("允许输入");
		description.push("设置属性 <>editable</> 为 <>true</> 允许手动输入，并快速匹配下拉选项。");
		description.push("默认允许用户随意输入并保留用户输入内容，设置属性 <>needMatch</> 为 <>true</> 强制匹配选项，" +
			"即当输入内容与选项不匹配时自动清空内容。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UICombobox(this, { data: exampleData, prompt: "请输入..", editable: true }));
		demo.append(new UICombobox(this, { data: exampleData, prompt: "请输入选择..", editabled: true, needMatch: true}));

		let source = [];
		source.push("var items = " + strExampleData);
		source.push("new UICombobox([context], {\n  data: items,\n  prompt: '请输入..',\n  editabled: true\n});");
		source.push("new UICombobox([context], {\n  data: items,\n  prompt: '请输入..',\n  " +
			"editabled: true,\n  needMatch: true\n});");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		let description = [];
		description.push("禁用");
		description.push("设置属性 <>disabled</> 为 <>true</>。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UICombobox(this, { data: exampleData, selectedIndex: 5, disabled: true }));

		let source = [];
		source.push("var items = " + strExampleData);
		source.push("new UICombobox([context], {\n  data: items,\n  selectedIndex: 5,\n  disabled: true\n});");

		render(demo, source, description);
	},

	renderDemo7: function (render) {
		let description = [];
		description.push("原生");
		description.push("设置属性 <>native</> 为 <>true</>，组件将使用原生 <>select</> 标签显示下拉列表。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UICombobox(this, { data: exampleData, selectedIndex: 1, native: true }));

		let source = [];
		source.push("var items = " + strExampleData);
		source.push("new UICombobox([context], {\n  data: exampleData,\n  selectedIndex: 1,\n  native: true\n});");

		render(demo, source, description);
	},

	renderDemo8: function (render) {
		let description = [];
		description.push("异步");
		description.push("异步获取远程数据集作为选项列表。在浏览器端组件渲染完成之后发起异步请求，等待接口返回之后渲染选项列表。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UICombobox(this, { apiName: "data.component.items", prompt: "请选择..", 
			selectedIndex: 3, labelField: "c1" }));

		let source = [];
		source.push("new UICombobox([context], {\n  apiName: 'data.component.items',\n  prompt: '请选择..'," +
			"\n  selectedIndex: 3,\n  labelField: 'c1'\n);");

		render(demo, source, description);
	}
});