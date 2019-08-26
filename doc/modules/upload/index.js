// 2019-06-10

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIButton = VRender.UIButton;
const UIUpload = VRender.UIUpload;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIUpload 文件上传";
	},

	renderDemos: function (target, render) {
		ModuleView.super(this, target, render);
		this.renderDemo1(render);
		this.renderDemo2(render);
		this.renderDemo3(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");
		description.push("注：该组件不可见");

		let demo = new UIGroup(this, { gap: 10 });
		let button = demo.add(new UIButton(this, { label: "点击上传文件" }));
		demo.append(new UIUpload(this, { browser: button, action: "demo.upload" }));

		let source = [];
		source.push("var button = new UIButton([context], {\n  label: '点击上传文件'\n});");
		source.push("new UIUpload([context], {\n  action: 'demo.upload',\n  browser: button\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("属性 <>filter</>：文件类型");
		description.push("可选值：<>image</>、<>excel</>、<>word</>、<>powerpoint</>、<>text</>、" +
			"<>audio</>、<>video</>，或者文件后缀（如：<>.xls</>）。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.add(new UIGroup(this))
			.append(new UIButton(this, { name: "fileupload_btn21", label: "选择图片" }))
			.append(new UIUpload(this, { action: "demo.upload",
				browser: "[name=fileupload_btn21]", filter: "image" }));
		demo.add(new UIGroup(this))
			.append(new UIButton(this, { name: "fileupload_btn22", label: "选择Excel" }))
			.append(new UIUpload(this, { action: "demo.upload",
				browser: "[name=fileupload_btn22]", filter: "excel" }));

		let source = [];
		source.push("// 图片");
		source.push("new UIButton([context], {\n  name: 'fileupload_btn21',\n  label: '选择图片'\n});");
		source.push("new UIUpload([context], {\n  action: 'demo.upload'," +
			"\n  browser: '[name=fileupload_btn21]',\n  filter: 'image'\n});");
		source.push("// Excel");
		source.push("new UIButton([context], {\n  name: 'fileupload_btn22',\n  label: '选择图片'\n});");
		source.push("new UIUpload([context], {\n  action: 'demo.upload'," +
			"\n  browser: '[name=fileupload_btn22]',\n  filter: 'excel'\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("属性 <>multi</>：多选");

		let demo = new UIGroup(this, { gap: 10 });
		let button = demo.add(new UIButton(this, { label: "批量选择文件" }));
		demo.append(new UIUpload(this, { action: "demo.upload", multi: true, browser: button }));

		let source = [];
		source.push("var button = new UIButton([context], {\n  label: '批量选择文件'\n});");
		source.push("new UIUpload([context], {\n  action: 'demo.upload',\n  multi: true,\n  browser: button\n});");

		render(demo, source, description);
	}
});