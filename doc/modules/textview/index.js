// 2019-06-06

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UITextView = VRender.UITextView;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UITextView 文本输入框";
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
		this.renderDemo9(render);
		this.renderDemo10(render);
		this.renderDemo11(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITextView(this, { prompt: "请输入.." }));

		let source = [];
		source.push("new UITextView([context], {\n  prompt: '请输入..'\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("属性 <>multi</>：多行文本输入框");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UITextView(this, { prompt: "请输入..", multi: true }));

		let source = [];
		source.push("new UITextView([context], {\n  prompt: '请输入..',\n  multi: true\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("属性 <>type</>：类型");
		description.push("可选值：<>number</>、<>email</>、<>tel</>、<>mobile</>、<>phone</>、<>url</>、<>password</>。");

		let demo = new UIGroup(this, { gap: 10 });
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("type: 'number'"))
			.append(new UITextView(this, { type: "number", prompt: "请输入数字",
				desc: "数字类型输入框，只能输入数字，默认保留2位小数" }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("type: 'email'"))
			.append(new UITextView(this, { type: "email", prompt: "请输入电子邮箱",
				desc: "电子邮箱类型输入框，验证输入框内容为电子邮箱格式" }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("type: 'password'"))
			.append(new UITextView(this, { type: "password", prompt: "请输入密码",
				desc: "密码输入框，内容不可见" }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("type: 'tel'"))
			.append(new UITextView(this, { type: "tel", prompt: "请输入电话号码或手机号",
				desc: "电话号码输入框，验证输入框内容为电话号码或手机号" }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("type: 'url'"))
			.append(new UITextView(this, { type: "url", prompt: "请输入网址", value: "http://",
				desc: "网址输入框，验证输入框内容为输入框，如：http://www.xxx.com/a/b" }));

		let source = [];
		source.push("new UITextView([context], {\n  type: 'number',\n  prompt: '请输入数字'\n});");
		source.push("new UITextView([context], {\n  type: 'email',\n  prompt: '请输入电子邮箱'\n});");
		source.push("new UITextView([context], {\n  type: 'password',\n  prompt: '请输入密码'\n});");
		source.push("new UITextView([context], {\n  type: 'tel',\n  prompt: '请输入电话号码或手机号'\n});");
		source.push("new UITextView([context], {\n  type: 'url',\n  prompt: '请输入网址',\n  value: 'http://'\n});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("属性 <>readonly</>：只读");
		description.push("禁止用户编辑");

		let demo = new UIGroup.VGroup(this, { gap: 10 });
		demo.append(new UITextView(this, { value: "该文本框只读，不能输入", readonly: true }));
		demo.append(new UITextView(this, { value: "该文本框只读，不能输入", readonly: true, multi: true }));

		let source = [];
		source.push("new UITextView([context], {\n  value: '该文本框只读，不能输入',\n  readonly: true\n});");
		source.push("new UITextView([context], {\n  value: '该文本框只读，不能输入',\n  readonly: true,\n  multi: true\n});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("属性 <>required</>：必填");
		description.push("在输入框失去焦点时，如果内容为空，将显示错误提示信息。");
		description.push("属性 <>empty</> 可以自定义错误提示信息。");

		let demo = new UIGroup.VGroup(this, { gap: 10 });
		demo.append(new UITextView(this, { prompt: "文本框不能为空", required: true }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("自定义提示信息"))
			.append(new UITextView(this, { prompt: "文本框不能为空", required: true, empty: "自定义提示信息" }));
		demo.append(new UITextView(this, { prompt: "文本框不能为空", required: true, multi: true }));

		let source = [];
		source.push("new UITextView([context], {\n  prompt: '文本框不能为空',\n  required: true\n});");
		source.push("new UITextView([context], {\n  prompt: '文本框不能为空',\n  required: true,\n  empty: '自定义提示信息'\n});");
		source.push("new UITextView([context], {\n  prompt: '文本框不能为空',\n  required: true,\n  multi: true\n});");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		let description = [];
		description.push("提示信息");
		description.push("属性 <>prompt</> 同 <>placeholder</>");
		description.push("属性 <>tips</> 在输入框右边显示提示信息");
		description.push("属性 <>desc</> 在输入框下边显示提示信息，类似于描述信息");

		let demo = new UIGroup.VGroup(this, { gap: 10 });
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("使用 prompt 属性"))
			.append(new UITextView(this, { prompt: "文本框提示信息" }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("使用 tips 属性"))
			.append(new UITextView(this, { tips: "提示" }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("使用 desc 属性"))
			.append(new UITextView(this, { desc: "文本框备注信息，说明性文本内容。" }));

		let source = [];
		source.push("new UITextView([context], {\n  prompt: '文本框提示信息'\n});");
		source.push("new UITextView([context], {\n  tips: '提示'\n});");
		source.push("new UITextView([context], {\n  desc: '文本框备注信息，说明性文本内容。'\n});");

		render(demo, source, description);
	},

	renderDemo7: function (render) {
		let description = [];
		description.push("数字类型");
		description.push("属性 <>type</> 为 <>'number'</> 时，该文本框仅支持数字。");
		description.push("属性 <>decimals</> 是小数位数，默认为 <>2</>，即默认保留2位小数。")
		description.push("属性 <>min</> 和 <>max</> 分别是数字的最小值和最大值。");
		description.push("设置属性 <>type</> 为 <>'int'</> 相当于 <>{type: 'number', decimals: 0}</>。")

		let demo = new UIGroup.VGroup(this, { gap: 10 });
		demo.append(new UITextView(this, { type: "number", prompt: "请输入数字，默认2为小数" }));
		demo.append(new UITextView(this, { type: "number", prompt: "请输入数字，默认3为小数", decimals: 3 }));
		demo.append(new UITextView(this, { type: "number", prompt: "请输入10-20之间的数字", decimals: 0, min: 10, max: 20 }));

		let source = [];
		source.push("new UITextView([context], {\n  type: 'number',\n  prompt: '请输入数字，默认2为小数'\n});");
		source.push("new UITextView([context], {\n  type: 'number',\n  prompt: '请输入数字，默认3为小数',\n  decimals: 3\n});");
		source.push("new UITextView([context], {\n  type: 'number',\n  prompt: '请输入10-20之间的数字',\n  decimals: 0," +
			"\n  min: 10,\n  max: 20\n});");

		render(demo, source, description);
	},

	renderDemo8: function (render) {
		let description = [];
		description.push("校验及错误信息");
		description.push("当输入框失去焦点时，组件将根据类型及其他信息校验输入框内容。");
		description.push("属性 <>errmsg</> 为自定义错误提示信息。");
		description.push("针对一些复杂验证，可以使用属性 <>validate</>，该属性为一个方法，异步返回错误信息。" +
			"如：<>(textview, value, callback) => { callback('error msg' | false); }</>");

		let demo = new UIGroup.VGroup(this, { gap: 10 });
		demo.append(new UITextView(this, { type: "email", prompt: "请输入电子邮箱", errmsg: "亲，邮箱地址不是这样滴！" }));
		demo.append(new UITextView(this, { prompt: "请输入名称，必须是字母、数字或_，最少6个字符", multi: true,
			validate: (target, value, callback) => {
				callback(/^[0-9a-zA-Z\_]{6,}$/.test(value) ? false : "格式不正确，请输入数字、字母、_，不少于6个字符");
			}}));

		let source = [];
		source.push("new UITextView([context], {\n  type: 'email',\n  prompt: '请输入电子邮箱',\n  errmsg: '亲，邮箱地址不是这样滴！'\n});");
		source.push("new UITextView([context], {\n  prompt: '请输入名称，必须是字母、数字或_，最少6个字符',\n  multi: true," +
			"\n  validate: (textview, value, callback) => {" +
			"\n    callback(/^[0-9a-zA-Z\\_]{6,}$/.test(value) ? false : '格式不正确，请输入数字、字母、_，不少于6个字符');\n  }\n});");

		render(demo, source, description);
	},

	renderDemo9: function (render) {
		let description = [];
		description.push("隐藏内容");
		description.push("即内容不可见，通常使用 <>*</> 替代");
		description.push("设置属性 <>type</> 为 <>'password'</> 可使内容不可见");
		description.push("另外，也可设置属性 <>displayAsPwd</> 为 <>true</> 使内容不可见");

		let demo = new UIGroup.VGroup(this, { gap: 10 });
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("type: 'password'"))
			.append(new UITextView(this, { prompt: "请输入密码", type: "password" }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("displayAsPwd: true"))
			.append(new UITextView(this, { prompt: "请输入密码", displayAsPwd: true }));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("displayAsPwd: true, type: 'number'"))
			.append(new UITextView(this, { prompt: "请输入数字密码", type: "number", displayAsPwd: true}));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("displayAsPwd: true, type: 'email'"))
			.append(new UITextView(this, { prompt: "输入邮箱作为密码", type: "email", displayAsPwd: true}));

		let source = [];
		source.push("new UITextView([context], {\n  prompt: '请输入密码',\n  type: 'password'\n});");
		source.push("new UITextView([context], {\n  prompt: '请输入密码',\n  displayAsPwd: true\n});");
		source.push("new UITextView([context], {\n  prompt: '请输入数字密码',\n  type: 'number',\n  displayAsPwd: true\n});");
		source.push("new UITextView([context], {\n  prompt: '输入邮箱作为密码',\n  type: 'email',\n  displayAsPwd: true\n});");

		render(demo, source, description);
	},

	renderDemo10: function (render) {
		let description = [];
		description.push("属性 <>maxSize</>：最大字符数");

		let demo = new UIGroup.VGroup(this, { gap: 10 });
		demo.append(new UITextView(this, { prompt: "请输入10个字之内的文本", maxSize: 10 }));
		demo.append(new UITextView(this, { prompt: "请输入备注信息", multi: true, maxSize: 120 }));

		let source = [];
		source.push("new UITextView([context], {\n  prompt: '请输入10个字之内的文本',\n  maxSize: 10\n});");
		source.push("new UITextView([context], {\n  prompt: '请输入备注信息',\n  multi: true,\n  maxSize: 120\n});");

		render(demo, source, description);
	},

	renderDemo11: function (render) {
		let description = [];
		description.push("属性 <>autoHeight</>：自适应高度");

		var autoText = "你可能会有这样的经历，跟人交谈时，有时你从各个角度给他分析一个问题，提出中肯的建议，但是他怎么都听不进去，表现得异常固执。" +
			"\n\n比如，一个女孩深陷感情骗局，外人一看就知道男孩在骗她，但女孩子却固执地认为男孩是真正爱她。" +
			"\n\n任凭外人怎么说，她都不会改变主意，甚至认为别人在不怀好意地破坏他们。" +
			"\n\n再比如，你苦口婆心地跟他人说年轻的时候多学点东西，多增长见识，对自己的事业、人生都有帮助，他却认为什么文化、知识都没有用，遇到事情还得靠钱、靠关系、靠运气。" +
			"\n\n于是，你所有的建议压根就不会起作用，他总会固执地寻找理由，固执地放弃努力。" +
			"\n\n每当这个时候，等你们争论一番毫无结果时，你也许会有一种挫败感，甚至捶胸顿足地喊道：从来就没有见过如此固执的人，这么简单的道理，他怎么就是不懂呢?";

		let demo = new UIGroup.VGroup(this, { gap: 10 });
		demo.append(new UITextView(this, { prompt: "请输入", multi: true, width: "100%" }));
		demo.append(new UITextView(this, { prompt: "请输入内容", multi: true, autoHeight: true, 
			width: "100%", maxHeight: 300, value: autoText }));

		let source = [];
		source.push("new UITextView([context], {\n  prompt: '请输入',\n  multi: true,\n  width: '100%'\n});");
		source.push("new UITextView([context], {\n  prompt: '请输入内容',\n  multi: true,\n  autoHeight: true," +
			"\n  width: '100%',\n  maxHeight: 300,\n  value: '你可能...'\n});");

		render(demo, source, description);
	}
});