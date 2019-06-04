// 2019-06-03

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIDateInput = VRender.UIDateInput;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIDateInput 日期输入框";
	},

	renderDemos: function (target, render) {
		ModuleView.super(this, target, render);
		this.renderDemo1(render);
		this.renderDemo2(render);
		this.renderDemo3(render);
		this.renderDemo4(render);
		this.renderDemo5(render);
		this.renderDemo6(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UIDateInput(this, { prompt: "请选择日期" }));

		let source = [];
		source.push("new UIDateInput([context], {\n  prompt: '请选择日期'\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("属性 <>date</>：默认日期");
		description.push("设置组件的初始日期，如：<>new Date()</>、<>'2019-01-02'</>、<>1546358400000</>。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("date: new Date()"))
			.append(new UIDateInput(this, { date: new Date() }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("date: '2019-06-03'"))
			.append(new UIDateInput(this, { date: "2019-06-03" }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("date: 1559491200000"))
			.append(new UIDateInput(this, { date: 1559491200000 }));

		let source = [];
		source.push("new UIDateInput([context], {\n  date: new Date()\n});");
		source.push("new UIDateInput([context], {\n  date: '2019-06-03'\n});");
		source.push("new UIDateInput([context], {\n  date: 1559491200000\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("属性 <>format</>：格式化");
		description.push("相应的格式化表达式：<>yyyy=getFullYear()</>、<>MM=getMonth()+1</>、<>dd=getDate()</>。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("format: 'yyyy年MM月dd日'"))
			.append(new UIDateInput(this, { date: Date.now(), format: "yyyy年MM月dd日" }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("format: 'yyyy/MM/dd'"))
			.append(new UIDateInput(this, { date: Date.now(), format: "yyyy/MM/dd" }));

		let source = [];
		source.push("new UIDateInput([context], {\n  date: Date.now(),\n  format: 'yyyy年MM月dd日'\n});");
		source.push("new UIDateInput([context], {\n  date: Date.now(),\n  format: 'yyyy/MM/dd'\n});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("日期范围");
		description.push("设置用户可选择的日期范围（在最大最小值之间）。");
		description.push("属性 <>min</> 设置可选的最小日期，如：<>new Date()</>、<>'2019-01-02'</>、<>1546358400000</>。");
		description.push("属性 <>max</> 设置可选的最大日期，格式同上。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		let now = Date.now(), min = now - 7 * 24 * 60 * 60 * 1000, max = now + 7 * 24 * 60 * 60 * 1000;
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("2019-01-01之后"))
			.append(new UIDateInput(this, { date: "2019-01-06", min: "2019-01-01"}));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("2019-09-10之前"))
			.append(new UIDateInput(this, { date: "2019-06-04", max: "2019-09-10"}));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("前后各7天之内"))
			.append(new UIDateInput(this, { date: now, min: min, max: max }));

		let source = [];
		source.push("new UIDateInput([context], {\n  date: '2019-01-06',\n  min: '2019-01-01'\n});");
		source.push("new UIDateInput([context], {\n  date: '2019-06-04',\n  max: '2019-09-10'\n});");
		source.push("// -----------------------------------------------------");
		source.push("var now = Date.now(), dayTimes = 24 * 60 * 60 * 1000;");
		source.push("var min = now - 7 * dayTimes, max = now + 7 * dayTimes;");
		source.push("new UIDateInput([context], {\n  date: now,\n  min: min,\n  max: max\n});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("原生");
		description.push("设置属性 <>native</> 为 <>true</>，组件将使用原生 <>&lt;input type='date'/&gt;</>; 标签。");
		description.push("注：仅适用于移到端");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UIDateInput(this, { date: new Date(), native: true }));

		let source = [];
		source.push("new UIDateInput([context], {\n  date: new Date(),\n  native: true\n});");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		let description = [];
		description.push("禁用");
		description.push("设置属性 <>disabled</> 为 <>true</>。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UIDateInput(this, { date: new Date(), disabled: true }));

		let source = [];
		source.push("new UIDateInput([context], {\n  date: new Date(),\n  disabled: true\n});");

		render(demo, source, description);
	}
});