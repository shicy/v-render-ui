// 2019-06-13

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIButton = VRender.UIButton;
const UIInput = VRender.UIInput;
const UIDialog = VRender.UIDialog;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIDialog 对话框";
	},

	renderDemos: function (target, render) {
		ModuleView.super(this, target, render);
		this.renderDemo1(render);
		this.renderDemo2(render);
		this.renderDemo3(render);
		this.renderDemo4(render);
		this.renderDemo5(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let demo = new UIGroup(this);
		let button = demo.add(new UIButton(this, { name: "dialog_btn1", label: "点击打开对话框" }));
		demo.append(new UIDialog(this, { title: "标题", content: "内容", openbtn: button }));

		let source = [];
		source.push("var button = new UIButton([context], {\n  name: 'dialog_btn1',\n  label: '点击打开对话框'\n});");
		source.push("new UIDialog([context], {");
		source.push("  title: '标题',");
		source.push("  content: '内容',");
		source.push("  openbtn: button");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("属性 <>size</>：大小");
		description.push("可选值：<>small</>、<>normal</>、<>big</>、<>auto</>。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.add(new UIGroup(this))
			.append(new UIButton(this, { name: "dialog_btn21", label: "小对话框" }))
			.append(new UIDialog(this, { size: "small", openbtn: "[name=dialog_btn21]" }));
		demo.add(new UIGroup(this))
			.append(new UIButton(this, { name: "dialog_btn22", label: "默认对话框" }))
			.append(new UIDialog(this, { size: "normal", openbtn: "[name=dialog_btn22]" }));
		demo.add(new UIGroup(this))
			.append(new UIButton(this, { name: "dialog_btn23", label: "大对话框" }))
			.append(new UIDialog(this, { size: "big", openbtn: "[name=dialog_btn23]" }));
		demo.add(new UIGroup(this))
			.append(new UIButton(this, { name: "dialog_btn24", label: "自适应大小" }))
			.append(new UIDialog(this, { size: "auto", openbtn: "[name=dialog_btn24]",
				content: "<div style='width:530px;height:360px;background:#d1ebf3;'>内容宽530高360</div>" }));

		let source = [];
		source.push("new UIButton(context, {\n  name: 'dialog_btn21',\n  label: '小对话框'\n});");
		source.push("new UIDialog(context, {\n  size: 'small',\n  openbtn: '[name=dialog_btn21]'\n});");
		source.push("");
		source.push("new UIButton(context, {\n  name: 'dialog_btn22',\n  label: '默认对话框'\n});");
		source.push("new UIDialog(context, {\n  size: 'normal',\n  openbtn: '[name=dialog_btn22]'\n});");
		source.push("");
		source.push("new UIButton(context, {\n  name: 'dialog_btn23',\n  label: '大对话框'\n});");
		source.push("new UIDialog(context, {\n  size: 'big',\n  openbtn: '[name=dialog_btn23]'\n});");
		source.push("");
		source.push("new UIButton(context, {\n  name: 'dialog_btn24',\n  label: '自适应大小'\n});");
		source.push("new UIDialog(context, {\n  size: 'auto',\n  openbtn: '[name=dialog_btn24]'," +
			"\n  content: '<div style=\"width:530px;height:360px;background:#d1ebf3;\">内容宽530高360</div>'\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("属性 <>buttons</>：自定义按钮");

		let demo = new UIGroup(this);
		demo.add(new UIButton(this, { ref: "dialog_btn3", label: "点击打开对话框" }));

		let source = [];
		source.push("// 前端代码");
		source.push("var buttons = [];");
		source.push("  { name: 'cancel', label: '取消', type: 'cancel' },");
		source.push("  { name: 'reset', label: '重置', type: 'info' },");
		source.push("  { name: 'ok', label: '保存', type: 'primary', waitclose: true }");
		source.push("];");
		source.push("");
		source.push("var contentView = new UIGroup([context]);");
		source.push("var closeBtn = contentView.add(new UIButton([context], {");
		source.push("  name: 'close',");
		source.push("  label: '点击5秒后关闭对话框',");
		source.push("  type: 'danger'");
		source.push("}));");
		source.push("");
		source.push("var dialog = new UIDialog([context], {\n  buttons: buttons,\n  content: contentView\n});");
		source.push("");
		source.push("dialog.on('btn_ok', function () {");
		source.push("  contentView.append('<div>点击了“保存”按钮..</div>');");
		source.push("  setTimeout(function () {");
		source.push("    dialog.waitting(false, 'ok');");
		source.push("  }, 2000);");
		source.push("});");
		source.push("");
		source.push("dialog.on('btn_cancel', function () {");
		source.push("  contentView.append('<div>点击了“取消”按钮..（因为有事件绑定所以不自动关闭了）</div>');");
		source.push("});");
		source.push("");
		source.push("dialog.on('btn_reset', function () {");
		source.push("  contentView.append('<div>点击了“重置”按钮..</div>');");
		source.push("});");
		source.push("");
		source.push("closeBtn.on('tap', function () {");
		source.push("  contentView.append('<div>5秒后关闭对话框</div>');");
		source.push("  var seconds = 5;");
		source.push("  var timerId = setInterval(function () {");
		source.push("    if (--seconds <= 0) {");
		source.push("      clearInterval(timerId);");
		source.push("      dialog.close()");
		source.push("    }");
		source.push("    closeBtn.val(seconds + '秒后关闭对话框');");
		source.push("  }, 1000};");
		source.push("});");
		source.push("");
		source.push("dialog.on('btnclk', function (e, name) {});");
		source.push("  contentView.append('<div>统一事件“btnclk”，按钮名称：' + name + '</div>');");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("内边距");
		description.push("设置属性 <>fill</> 为 <>true</> 对话框无内边距");

		let demo = new UIGroup(this);
		demo.add(new UIGroup(this))
			.append(new UIButton(this, { name: 'dialog_btn4', label: '无内边距对话框' }))
			.append(new UIDialog(this, { fill: true, openbtn: "[name=dialog_btn4]",
				content: "<div style='background:bisque'>内容填充，无边距</div>" }));

		let source = [];
		source.push("new UIButton([context], {\n  name: 'dialog_btn4',\n  label: '无内边距对话框'\n});");
		source.push("new UIDialog([context], {");
		source.push("  fill: true,");
		source.push("  openbtn: '[name=dialog_btn4]',");
		source.push("  content: '<div style=\"background:bisque\">内容填充，无边距</div>'");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("属性 <>content</>：内容");

		let demo = new UIGroup(this);
		demo.append(new UIButton(this, { name: "dialog_btn5", label: "点击打开对话框" }));

		var contentView = new UIGroup(this, { gap: 10 });
		contentView.append("<div>添加一个组件作为对话框内容</div>");
		contentView.add(new UIGroup(this)).append(new UIInput(this, { prompt: "输入框" }));
		contentView.add(new UIGroup(this)).append(new UIButton(this, { label: "按钮" }));
		demo.append(new UIDialog(this, { content: contentView, openbtn: "[name=dialog_btn5]" }));

		let source = [];
		source.push("new UIButton([context], {\n  name: 'dialog_btn5',\n  label: '点击打开对话框'\n});");
		source.push("");
		source.push("var contentView = new UIGroup([context]);");
		source.push("contentView.append('<div>添加一个组件作为对话框内容</div>')");
		source.push("contentView.add(new UIGroup([context]))");
		source.push("  .append(new UIInput([context], { prompt: '输入框' }));");
		source.push("contentView.add(new UIGroup([context]))");
		source.push("  .append(new UIButton([context], { label: '按钮' }));");
		source.push("new UIDialog([context], {");
		source.push("  content: contentView,");
		source.push("  openbtn: '[name=dialog_btn5]'");
		source.push("});");

		render(demo, source, description);
	}
});