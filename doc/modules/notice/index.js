// 2019-06-11

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIButton = VRender.UIButton;
const UINotice = VRender.UINotice;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UINotice 通知";
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

		let demo = new UIGroup(this);
		demo.append(new UIButton(this, { ref: "notice_btn1", label: "点击打开通知" }));

		// 后端构建
		demo.append(new UINotice(this, { title: "标题", content: "服务端创建的通知，打开页面会直接显示通知。" }));

		let source = [];
		source.push("// 前端代码");
		source.push("var button = new UIButton({\n  label: '点击打开通知'\n});");
		source.push("button.on('tap', function () {\n  new UINotice({\n    title: '标题'," +
			"\n    content: '这里是内容！！'\n  });\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("属性 <>type</>：提示框类型");
		description.push("可选值：<>success</>、<>warn</>、<>error</>、<>info</>。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UIButton(this, { ref: "notice_btn21", label: "默认" }));
		demo.append(new UIButton(this, { ref: "notice_btn22", label: "成功" }));
		demo.append(new UIButton(this, { ref: "notice_btn23", label: "警告" }));
		demo.append(new UIButton(this, { ref: "notice_btn24", label: "错误" }));
		demo.append(new UIButton(this, { ref: "notice_btn25", label: "消息" }));

		let source = [];
		source.push("new UINotice([context], {\n  title: '标题',\n  content: '通知提示文案'\n});");
		source.push("new UINotice([context], {\n  title: '成功',\n  content: '成功提示文案',\n  type: 'success'\n});");
		source.push("new UINotice([context], {\n  title: '警告',\n  content: '警告提示文案',\n  type: 'warn'\n});");
		source.push("new UINotice([context], {\n  title: '错误',\n  content: '错误提示文案',\n  type: 'error'\n});");
		source.push("new UINotice([context], {\n  title: '消息',\n  content: '消息提示文案',\n  type: 'info'\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("属性 <>duration</>：延迟关闭");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UIButton(this, { ref: "notice_btn31", label: "默认10秒后关闭" }));
		demo.append(new UIButton(this, { ref: "notice_btn32", label: "自定义30秒后关闭" }));
		demo.append(new UIButton(this, { ref: "notice_btn33", label: "不自动关闭" }));

		let source = [];
		source.push("new UINotice([context], {\n  title: '标题',\n  content: '10秒后关闭'\n});");
		source.push("new UINotice([context], {\n  title: '标题',\n  content: '30秒后关闭',\n  duration: 30000\n});");
		source.push("new UINotice([context], {\n  title: '标题',\n  content: '不会自动关闭，请点击关闭按钮',\n  duration: 0\n});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("禁止手动关闭");
		description.push("设置属性 <>closable</> 为 <>false</> 则用户不可关闭");

		let demo = new UIGroup(this);
		demo.append(new UIButton(this, { ref: "notice_btn41", label: "不可关闭通知" }));

		let source = [];
		source.push("new UINotice([context], {\n  title: '标题',\n  content: '不可手动关闭，15秒后自动关闭'," +
			"\n  duration: 15000,\n  closable: false\n});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("富文本");
		description.push("属性 <>focusHtmlContent</> 支持 <>html</> 代码");

		let demo = new UIGroup(this);
		demo.append(new UIButton(this, { ref: "notice_btn51", label: "使用HTML通知" }));

		let source = [];
		source.push("new UINotice([context], {");
		source.push("  title: '标题',");
		source.push("  focusHtmlContent: '<strong>这里也可以是<i>富文本</i>内容</strong>'");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		let description = [];
		description.push("属性 <>icon</>：显示图标");

		let demo = new UIGroup(this);
		demo.append(new UIButton(this, { ref: "notice_btn61", label: "自定义图标" }));

		let source = [];
		source.push("new UINotice([context], {");
		source.push("  title: '自定义图标',");
		source.push("  content: '内容',");
		source.push("  icon: '/icons/b04.png'");
		source.push("});");

		render(demo, source, description);
	}
});