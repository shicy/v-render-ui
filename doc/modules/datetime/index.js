// 2019-06-04

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIDateTime = VRender.UIDateTime;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIDateTime 日期时间输入框";
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
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDateTime(this, { prompt: "请选择日期和时间" }));

		let source = [];
		source.push("new UIDateTime([context], {\n  prompt: '请选择日期和时间'\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("属性 <>date</>：默认日期和时间");

		let demo = new UIGroup(this, { gap: 10 });
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("date: new Date()"))
			.append(new UIDateTime(this, { date: new Date() }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("date: '2019-06-06 13:45:23'"))
			.append(new UIDateTime(this, { date: "2019-06-06 13:45:23" }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("date: Date.now() + 2 * 24 * 60 * 60 * 1000"))
			.append(new UIDateTime(this, { date: Date.now() + 2 * 24 * 60 * 60 * 1000 }));

		let source = [];
		source.push("new UIDateTime([context], {\n  date: new Date()\n});");
		source.push("new UIDateTime([context], {\n  date: '2019-06-06 13:45:23'\n});");
		source.push("new UIDateTime([context], {\n  date: Date.now() + 2 * 24 * 60 * 60 * 1000\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("属性 <>format</>：格式化");
		description.push("相应的格式化表达式：<>yyyy=getFullYear()</>、<>MM=getMonth()+1</>、<>dd=getDate()</>、" +
			"<>HH=getHours()</>、<>mm=getMinutes()</>、<>ss=getSeconds()</>。");

		let demo = new UIGroup.VGroup(this, { gap: 10 });
		demo.append(new UIDateTime(this, { date: Date.now() }));
		demo.append(new UIDateTime(this, { date: Date.now(), format: "yyyy年MM月dd日HH时mm分ss秒" }));
		demo.append(new UIDateTime(this, { date: Date.now(), format: "yyyy/MM/dd HH:mm:ss" }));

		let source = [];
		source.push("new UIDateTime([context], {\n  date: Date.now()\n});");
		source.push("new UIDateTime([context], {\n  date: Date.now(),\n  format: 'yyyy年MM月dd日HH时mm分ss秒'\n});");
		source.push("new UIDateTime([context], {\n  date: Date.now(),\n  format: 'yyyy/MM/dd HH:mm:ss'\n});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("日期范围");
		description.push("设置用户可选择的日期范围（在最大最小值之间）。");
		description.push("属性 <>min</> 设置可选的最小日期，如：<>new Date()</>、<>'2019-01-02 01:00:00'</>、<>1546358400000</>。");
		description.push("属性 <>max</> 设置可选的最大日期，格式同上。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UIDateTime(this, { date: "2019-06-06 14:12:44", showSecond: true,
			min: "2019-06-02 12:15:30", max: "2019-06-27 22:45:00" }));

		let source = [];
		source.push("new UIDateTime([context], {\n  date: '2019-06-06 14:12:44',\n  min: '2019-06-02 12:15:30'," +
			"\n  max: '2019-06-27 22:45:00',\n  showSecond: true\n});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("属性 <>showSecond</>：显示秒");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDateTime(this, { date: Date.now(), showSecond: true }));

		let source = [];
		source.push("new UIDateTime([context], {\n  date: Date.now(),\n  showSecond: true\n});");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		let description = [];
		description.push("可选时间");
		description.push("属性 <>hours</>、<>minutes</>、<>seconds</> 分别设置组件可选的 时分秒。");

		let demo = new UIGroup.VGroup(this, { gap: 10 });
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("hours: [8, 10, 12, 14]"))
			.append(new UIDateTime(this, { date: Date.now(), hours: [8, 10, 12, 14] }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("minutes: [0, 15, 30, 45]"))
			.append(new UIDateTime(this, { date: Date.now(), minutes: [0, 15, 30, 45], showSecond: true }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("seconds: [0, 30]"))
			.append(new UIDateTime(this, { date: Date.now(), seconds: [0, 30], showSecond: true }));

		let source = [];
		source.push("new UIDateTime([context], {\n  date: Date.now(),\n  hours: [8, 10, 12, 14]\n});");
		source.push("new UIDateTime([context], {\n  date: Date.now(),\n  minutes: [0, 15, 30, 45],\n  showSecond: true\n});");
		source.push("new UIDateTime([context], {\n  date: Date.now(),\n  seconds: [0, 30],\n  showSecond: true\n});");

		render(demo, source, description);
	},

	renderDemo7: function (render) {
		let description = [];
		description.push("属性 <>disabled</>：禁用");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDateTime(this, { date: Date.now(), disabled: true }));

		let source = [];
		source.push("new UIDateTime([context], {\n  date: Date.now(),\n  disabled: true\n});");

		render(demo, source, description);
	}
});