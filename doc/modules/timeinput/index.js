// 2019-06-10

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UITimeInput = VRender.UITimeInput;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UITimeInput 时间输入框";
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
		demo.append(new UITimeInput(this, { prompt: "请选择时间.." }));

		let source = [];
		source.push("new UITimeInput([context], {\n  prompt: '请选择时间..'\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("属性 <>time</>：默认时间");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UITimeInput(this, { time: "10:25" }));
		demo.append(new UITimeInput(this, { time: "9:6" }));
		demo.append(new UITimeInput(this, { time: "0:268" }));

		let source = [];
		source.push("new UITimeInput([context], {\n  time: '10:25'\n});");
		source.push("new UITimeInput([context], {\n  time: '9:6'\n});");
		source.push("new UITimeInput([context], {\n  time: '0:268'\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("属性 <>showSecond</>：显示秒");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UITimeInput(this, { time: "13:26:39", showSecond: true }));

		let source = [];
		source.push("new UITimeInput([context], {\n  time: '13:26:39',\n  showSecond: true\n});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("属性 <>use12Hour</>：12小时制");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UITimeInput(this, { time: "15:45", use12Hour: true }));
		demo.append(new UITimeInput(this, { time: "23:29:55", use12Hour: true, showSecond: true }));

		let source = [];
		source.push("new UITimeInput([context], {\n  time: '15:45',\n  use12Hour: true\n});");
		source.push("new UITimeInput([context], {\n  time: '23:29:55',\n  use12Hour: true,\n  showSecond: true\n});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("时间范围");
		description.push("属性 <>min</> 设定组件可选择的最小时间");
		description.push("属性 <>max</> 设定组件可选择的最大时间");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UITimeInput(this, { time: "6:45", min: "8:30", max: "18:00" }));
		demo.append(new UITimeInput(this, { min: "8:45:20", max: "18:20:40", showSecond: true }));
		demo.append(new UITimeInput(this, { min: "13:00", max: "14:00", use12Hour: true }));

		let source = [];
		source.push("new UITimeInput([context], {\n  time: '6:45',\n  min: '8:30',\n  max: '18:00'\n});");
		source.push("new UITimeInput([context], {\n  min: '8:45:20',\n  max: '18:20:40',\n  showSecond: true\n});");
		source.push("new UITimeInput([context], {\n  min: '13:00',\n  max: '14:00',\n  use12Hour: true\n});");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		let description = [];
		description.push("可选时间");
		description.push("属性 <>hours</>、<>minutes</>、<>seconds</> 分别设置组件可选的 时分秒。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UITimeInput(this, { hours: [8, 10, 12, 14] }));
		demo.append(new UITimeInput(this, { time: "6:33", minutes: [0, 15, 30, 45], showSecond: true }));
		demo.append(new UITimeInput(this, { seconds: [0, 30], showSecond: true }));

		let source = [];
		source.push("new UITimeInput([context], {\n  hours: [8, 10, 12, 14]\n});");
		source.push("new UITimeInput([context], {\n  time: '6:33',\n  minutes: [0, 15, 30, 45],\n  showSecond: true\n});");
		source.push("new UITimeInput([context], {\n  seconds: [0, 30],\n  showSecond: true\n});");

		render(demo, source, description);
	},

	renderDemo7: function (render) {
		let description = [];
		description.push("属性 <>disabled</>：禁用");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITimeInput(this, { time: "12:00", disabled: true }));

		let source = [];
		source.push("new UITimeInput([context], {\n  time: '12:00',\n  disabled: true\n});");

		render(demo, source, description);
	}
});