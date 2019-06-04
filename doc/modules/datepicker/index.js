// 2019-06-04

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIDatePicker = VRender.UIDatePicker;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIDatePicker 日期选择器";
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

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatePicker(this));

		let source = [];
		source.push("new UIDatePicker([context]);");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("起止日期");
		description.push("设置属性 <>range</> 为 <>true</>，选择一个日期范围，即开始日期和结束日期。");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatePicker(this, { range: true }));

		let source = [];
		source.push("new UIDatePicker([context, {\n  range: true\n}]);");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("默认日期");
		description.push("设置属性 <>date</> 为组件初始默认日期。");
		description.push("当 <>{range: true}</> 时，设置属性 <>start</> 为起始日期，属性 <>end</> 为结束日期。");

		let demo = new UIGroup(this, { gap: 10 });
		demo.add(new UIGroup(this))
			.append(new UIDatePicker(this, { date: new Date() }));
		demo.add(new UIGroup(this))
			.append(new UIDatePicker(this, { range: true, start: "2019-06-10", end: "2019-07-20" }));

		let source = [];
		source.push("new UIDatePicker([context], {\n  date: new Date()\n});");
		source.push("new UIDatePicker([context], {\n  range: true,\n  start: '2019-06-10',\n  end: '2019-07-20'\n});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("日期范围");
		description.push("设置用户可选择的日期范围（在最大最小值之间）。");
		description.push("属性 <>min</> 设置可选的最小日期，如：<>new Date()</>、<>'2019-01-02'</>、<>1546358400000</>。");
		description.push("属性 <>max</> 设置可选的最大日期，格式同上。");

		let demo = new UIGroup(this, { gap: 10 });
		demo.add(new UIGroup(this))
			.append(new UIDatePicker(this, { date: "2019-06-10", min: "2019-06-02", max: "2019-06-26" }));
		demo.add(new UIGroup(this))
			.append(new UIDatePicker(this, { range: true, start: "2019-06-08", end: "2019-07-15",
				min: "2019-06-03", max: "2019-07-28" }));

		let source = [];
		source.push("new UIDatePicker([context], {\n  date: '2019-06-10',\n  min: '2019-06-02',\n  max: '2019-06-26'\n});");
		source.push("new UIDatePicker([context], {\n  range: true,\n  start: '2019-06-08',\n  end: '2019-07-15'," +
			"\n  min: '2019-06-03',\n  max: '2019-07-28'\n});");

		render(demo, source, description);
	}
});