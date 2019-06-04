// 2019-06-04

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIDateRange = VRender.UIDateRange;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIDateRange 起止日期输入框";
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

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDateRange(this, { prompt: "请选择日期" }));

		let source = [];
		source.push("new UIDateRange([context], {\n  prompt: '请选择日期'\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("默认日期");
		description.push("属性 <>start</> 和 <>end</> 设置组件的起始日期和截止日期。");
		description.push("日期格式，如：<>new Date()</>、<>'2019-06-12'</>、<>1546358400000</>。");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDateRange(this, { start: new Date(), end: Date.now() + 3 * 24 * 60 * 60 * 1000 }));

		let source = [];
		source.push("new UIDateRange([context], {\n  start: new Date(),\n  end: Date.now() + 3 * 24 * 60 * 60 * 1000\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("属性 <>format</>：格式化");
		description.push("相应的格式化表达式：<>yyyy=getFullYear()</>、<>MM=getMonth()+1</>、<>dd=getDate()</>。");

		let demo = new UIGroup(this, { gap: 10 });
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("format: 'yyyy年MM月dd日'"))
			.append(new UIDateRange(this, { start: "2019-06-10", end: "2019-06-20", format: "yyyy年MM月dd日" }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("format: 'yyyy.MM.dd'"))
			.append(new UIDateRange(this, { start: "2019-06-10", end: "2019-06-20", format: "yyyy.MM.dd" }));

		let source = [];
		source.push("new UIDateRange([context], {\n  start: '2019-06-10',\n  end: '2019-06-20',\n  format: 'yyyy年MM月dd日'\n});");
		source.push("new UIDateRange([context], {\n  start: '2019-06-10',\n  end: '2019-06-20',\n  format: 'yyyy.MM.dd'\n});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("日期范围");
		description.push("设置用户可选择的日期范围（在最大最小值之间）。");
		description.push("属性 <>min</> 设置可选的最小日期，如：<>new Date()</>、<>'2019-01-02'</>、<>1546358400000</>。");
		description.push("属性 <>max</> 设置可选的最大日期，格式同上。");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDateRange(this, { start: "2019-06-15", end: "2019-07-10", 
			min: "2019-06-01", max: "2019-07-30" }));

		let source = [];
		source.push("new UIDateRange([context], {\n  start: '2019-06-15',\n  end: '2019-07-10'," +
			"\n  min: '2019-06-01',\n  max: '2019-07-30'\n});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("快捷按钮");
		description.push("属性 <>shortcuts</> 给组件添加快捷按钮，可以快速设置日期。");

		let demo = new UIGroup(this, { gap: 10 });
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("shortcuts: [1, 7, 15]"))
			.append(new UIDateRange(this, { start: "2019-06-01", end: "2019-06-30", shortcuts: [1, 7, 15] }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("shortcuts: [{label: '最近一天', value: 1}, ..]"))
			.append(new UIDateRange(this, { start: "2019-06-01", end: "2019-06-30", shortcuts: [
				{ label: "最近一天", value: 1 }, { label: "最近一周", value: 7 }, { label: "最近半个月", value: 15 }] }));

		let source = [];
		source.push("new UIDateRange([context], {\n  start: '2019-06-01',\n  end: '2019-06-30',\n  shortcuts: [1, 7, 15]\n});");
		source.push("new UIDateRange([context], {\n  start: '2019-06-01',\n  end: '2019-06-30'," +
			"\n  shortcuts: [\n    { label: '最近一天', value: 1 },\n    { label: '最近一周', value: 7 }," +
			"\n    { label: '最近半个月', value: 15 }\n  ]\n});");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		let description = [];
		description.push("快捷按钮（下拉）");
		description.push("设置属性 <>dropdown</> 为 <>true</>，快捷按钮将以组合按钮方式显示。");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDateRange(this, { start: "2019-06-01", end: "2019-06-30", 
			shortcuts: [1, 3, 7, 15, 30], dropdown: true }));

		let source = [];
		source.push("new UIDateRange([context], {\n  start: '2019-06-01',\n  end: '2019-06-30'," +
			"\n  shortcuts: [1, 3, 7, 15, 30],\n  dropdown: true\n});");

		render(demo, source, description);
	},

	renderDemo7: function (render) {
		let description = [];
		description.push("原生");
		description.push("设置属性 <>native</> 为 <>true</>，组件将使用原生 <>&lt;input type='date'/&gt;</>; 标签。");
		description.push("注：仅适用于移到端");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDateRange(this, { start: Date.now(), min: "2019-01-01", max: "2019-12-30", native: true }));

		let source = [];
		source.push("new UIDateRange([context], {\n  start: Date.now(),\n  min: '2019-01-01',\n  max: '2019-12-31'," +
			"\n  native: true\n});");

		render(demo, source, description);
	},

	renderDemo8: function (render) {
		let description = [];
		description.push("禁用");
		description.push("设置属性 <>disabled</> 为 <>true</>。");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDateRange(this, { start: "2019-01-01", end: "2019-02-01", disabled: true }));

		let source = [];
		source.push("new UIDateRange([context], {\n  start: '2019-01-01',\n  end: '2019-02-01',\n  disabled: true\n});");

		render(demo, source, description);
	}
});