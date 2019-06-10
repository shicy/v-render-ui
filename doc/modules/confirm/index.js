// 2019-06-10

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIButton = VRender.UIButton;
const UIConfirm = VRender.UIConfirm;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIConfirm 确认对话框";
	},

	renderDemos: function (target, render) {
		ModuleView.super(this, target, render);
		this.renderDemo1(render);
		this.renderDemo2(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let demo = new UIGroup(this, {});
		demo.append(new UIButton(this, { ref: "confirm_btn1", label: "点击打开确认框" }));

		// 后端构建
		demo.append(new UIConfirm(this, { title: "提示！！", content: "这是一个服务端创建的确认对话框" }));

		let source = [];
		source.push("new UIConfirm([context], {\n  title: '提示！！',\n  content: '您是否确认操作？'\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("自定义按钮");

		let demo = new UIGroup(this, {});
		demo.append(new UIButton(this, { ref: "confirm_btn2", label: "点击打开确认框" }));

		let source = [];
		source.push("new UIConfirm([context], {\n  content: '自定义“确认”和“取消”按钮'," +
			"\n  confirmLabel: '自定义确认',\n  cancelLabel: '自定义取消'\n});");

		render(demo, source, description);
	}
});