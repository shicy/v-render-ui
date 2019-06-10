// 2019-06-10

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIButton = VRender.UIButton;
const UITooltip = VRender.UITooltip;

const ModuleView = BaseModule.extend(module, {
	className: "comp-tooltip",

	getTitle: function () {
		return "UITooltip 提示框";
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

		let demo = new UIGroup(this, {});
		demo.append(new UIButton(this, { ref: "tooltip_btn1", label: "点击打开提示框" }));

		// 后端构建
		demo.append(new UITooltip(this, { content: "这是一条消息提示，由服务端创建。" }));

		let source = [];
		source.push("// 前端代码");
		source.push("var button = new UIButton({\n  label: '点击打开提示框'\n});");
		source.push("button.on('tap', function () {\n  new UITooltip({\n    content: '这是一条消息提示。默认3秒后关闭'\n  });\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("属性 <>type</>：提示框类型");
		description.push("可选值：<>success</>、<>warn</>、<>error</>、<>info</>。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UIButton(this, { ref: "tooltip_btn21", label: "默认" }));
		demo.append(new UIButton(this, { ref: "tooltip_btn22", label: "成功" }));
		demo.append(new UIButton(this, { ref: "tooltip_btn23", label: "错误" }));
		demo.append(new UIButton(this, { ref: "tooltip_btn24", label: "警告" }));
		demo.append(new UIButton(this, { ref: "tooltip_btn25", label: "消息" }));

		let source = [];
		source.push("new UITooltip([context], {\n  content: '默认提示框'\n});");
		source.push("new UITooltip([context], {\n  content: '成功信息',\n  type: 'success'\n});");
		source.push("new UITooltip([context], {\n  content: '失败、错误信息',\n  type: 'error'\n});");
		source.push("new UITooltip([context], {\n  content: '警告信息',\n  type: 'warn'\n});");
		source.push("new UITooltip([context], {\n  content: '消息信息',\n  type: 'info'\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("属性 <>duration</>：延迟关闭");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UIButton(this, { ref: "tooltip_btn31", label: "默认3秒关闭" }));
		demo.append(new UIButton(this, { ref: "tooltip_btn32", label: "自定义30秒后关闭" }));
		demo.append(new UIButton(this, { ref: "tooltip_btn33", label: "不自动关闭" }));

		let source = [];
		source.push("new UITooltip([context], {\n  content: '默认提示信息等待3秒钟'\n});");
		source.push("new UITooltip([context], {\n  content: '自定义等待30秒后关闭',\n  duration: 30000\n});");
		source.push("new UITooltip([context], {\n  content: '改消息不会自动关闭，请点击关闭按钮',\n  duration: 0\n});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("禁止手动关闭");
		description.push("设置属性 <>closable</> 为 <>false</> 则用户不可关闭");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIButton(this, { ref: "tooltip_btn41", label: "不可关闭" }));

		let source = [];
		source.push("new UITooltip([context], {\n  content: '改消息不可手动关闭，10秒钟后自动关闭'," +
			"\n  duration: 10000,\n  closable: false\n});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("富文本");
		description.push("属性 <>focusHtmlContent</> 支持 <>html</> 代码");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIButton(this, {ref: "tooltip_btn51", label: "使用 HTML 消息"}));

		let source = [];
		source.push("new UITooltip([context], {\n  focusHtmlContent: '<strong>这里也可以是<i>富文本</i>内容</strong>'\n});");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		let description = [];
		description.push("属性 <>icon</>：显示图标");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIButton(this, {ref: "tooltip_btn61", label: "自定义图标"}));

		let source = [];
		source.push("new UITooltip([context], {\n  content: '自定义图标',\n  icon: '/icons/b04.png'\n});");

		render(demo, source, description);
	}
});