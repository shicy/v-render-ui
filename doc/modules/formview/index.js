// 2019-06-10

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIInput = VRender.UIInput;
const UISelect = VRender.UISelect;
const UIDateInput = VRender.UIDateInput;
const UIDateRange = VRender.UIDateRange;
const UICheckbox = VRender.UICheckbox;
const UIRadiobox = VRender.UIRadiobox;
const UICheckGroup = VRender.UICheckGroup;
const UIRadioGroup = VRender.UIRadioGroup;
const UIFormView = VRender.UIFormView;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIFormView 表单";
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
		demo.add(new UIFormView(this, {
			action: "data.component.save",
			params: { id: 1, state: 1 },
			data: [
				{ name: "a", label: "文本", content: "文本内容" },
				{ name: "b", label: "输入框", content: new UIInput(this) },
				{ name: "c", label: "下拉选择框", content: new UISelect(this, { data: ["选项1", "选项2", "选项3"] }) },
				{ name: "d", label: "日期", content: new UIDateInput(this) },
				{ name: "e", label: "日期范围", content: new UIDateRange(this) },
				{ name: "f", label: "单选", content: new UIRadiobox(this, { label: "单选", value: "radbox" }) },
				{ name: "g", label: "多选", content: new UICheckbox(this, { label: "多选", value: "chkbox" }) },
				{ name: "h", label: "单选组", content: new UIRadioGroup(this, { data: ["A", "B", "C", "D"] }) },
				{ name: "i", label: "多选组", content: new UICheckGroup(this, { data: ["A", "B", "C", "D"] }) },
				{ name: "j", label: "多行文本", content: new UIInput(this, { multi: true }) }
			],
			buttons: [
				{ label: "确定", type: "submit" },
				{ label: "取消", type: "cancel" }
			]
		}));

		let source = [];
		source.push("new UIFormView([context], {");
		source.push("  action: 'data.component.save',");
		source.push("  params: {");
		source.push("    id: 1,");
		source.push("    state: 1");
		source.push("  },");
		source.push("  data: [{");
		source.push("    name: 'a',");
		source.push("    label: '文本',");
		source.push("    content: '文本内容'");
		source.push("  }, {");
		source.push("    name: 'b',");
		source.push("    label: '输入框',");
		source.push("    content: new UIInput([context])");
		source.push("  }, {");
		source.push("    name: 'c',");
		source.push("    label: '下拉选择框',");
		source.push("    content: new UISelect([context], {");
		source.push("      data: ['选项1', '选项2', '选项3']");
		source.push("    })");
		source.push("  }, {");
		source.push("    name: 'd',");
		source.push("    label: '日期',");
		source.push("    content: new UIDateInput([context])");
		source.push("  }, {");
		source.push("    name: 'e',");
		source.push("    label: '日期范围',");
		source.push("    content: new UIDateRange([context])");
		source.push("  }, {");
		source.push("    name: 'f',");
		source.push("    label: '单选',");
		source.push("    content: new UIRadiobox([context], {");
		source.push("      label: '单选'");
		source.push("    })");
		source.push("  }, {");
		source.push("    name: 'g',");
		source.push("    label: '多选',");
		source.push("    content: new UICheckbox([context], {");
		source.push("      label: '多选'");
		source.push("    })");
		source.push("  }, {");
		source.push("    name: 'h',");
		source.push("    label: '单选组',");
		source.push("    content: new UIRadioGroup([context], {");
		source.push("      data: 'ABCD'.split('')");
		source.push("    })");
		source.push("  }, {");
		source.push("    name: 'i',");
		source.push("    label: '多选组',");
		source.push("    content: new UICheckGroup([context], {");
		source.push("      data: 'ABCD'.split('')");
		source.push("    })");
		source.push("  }, {");
		source.push("    name: 'j',");
		source.push("    label: '多行文本',");
		source.push("    content: new UIInput([context], {");
		source.push("      multi: true");
		source.push("    })");
		source.push("  }],");
		source.push("  buttons: [{");
		source.push("    label: '确定',");
		source.push("    type: 'submit'");
		source.push("  },{");
		source.push("    label: '取消',");
		source.push("    type: 'cancel'");
		source.push("  }]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		if (this.isApp)
			return ;

		let description = [];
		description.push("多列显示");

		let demo = new UIGroup(this);
		demo.add(new UIFormView(this, {
			columns: 2,
			data: [
				{ name: "a", label: "输入框1", content: new UIInput(this) },
				{ name: "b", label: "输入框2", content: new UIInput(this) },
				{ name: "c", label: "单选", colspan: 2, 
					content: new UIRadioGroup(this, { data: "ABCDEFGHIJKLMNOPQRST".split("") }) },
				{ name: "d", label: "多行文本", colspan: 2, content: new UIInput(this, { multi: true, width: 600 }) }
			],
			buttons: [
				{ label: "确认并保存", type: "submit" }
			]
		}));

		let source = [];
		source.push("new UIFormView(context, {");
		source.push("  columns: 2,");
		source.push("  data: [{");
		source.push("    name: 'a',");
		source.push("    label: '输入框1',");
		source.push("    content: new UIInput(context)");
		source.push("  }, {");
		source.push("    name: 'b',");
		source.push("    label: '输入框2',");
		source.push("    content: new UIInput(context)");
		source.push("  }, {");
		source.push("    name: 'c',");
		source.push("    label: '单选',");
		source.push("    colspan: 2,");
		source.push("    content: new UIRadioGroup(context, {");
		source.push("      data: 'ABCDEFGHIJKLMNOPQRST'.split('')");
		source.push("    })");
		source.push("  }, {");
		source.push("    name: 'd',");
		source.push("    label: '多行文本',");
		source.push("    content: new UIInput(context, {");
		source.push("      multi: true,");
		source.push("      width: 600");
		source.push("    })");
		source.push("  }],");
		source.push("  buttons: [{");
		source.push("    label: '确认并保存',");
		source.push("    type: 'submit'");
		source.push("  }]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("表单验证");

		let demo = new UIGroup(this);
		demo.add(new UIFormView(this, {
			data: [
				{ name: "a", label: "电子邮箱", content: new UIInput(this, { type: "email" }) },
				{ name: "b", label: "手机号码", content: new UIInput(this, { type: "int" }),
					validate: function (value, callback) {
						callback(/^1\d{10}$/.test(value) ? false : "手机号必须是1开始的11位数字");
					}},
				{ name: "c", label: "下拉选择框", content: new UISelect(this, { data: ["选项1", "选项2"] }), required: true },
				{ name: "d", label: "单选", content: new UIRadioGroup(this, { data: "ABCDEF".split("") }), required: true },
				{ name: "e", label: "日期", content: new UIDateInput(this), required: true },
				{ name: "f", label: "日期范围", content: new UIDateRange(this), required: true },
				{ name: "g", label: "原生输入框", content: "<input/>", required: true },
				{ name: "h", label: "原生文本框", content: "<textarea></textarea>", required: true }
			],
			buttons: [{ label: "确定", type: "submit" }]
		}));

		let source = [];
		source.push("new UIFormView([context], {");
		source.push("  data: [{");
		source.push("    name: 'a',");
		source.push("    label: '电子邮箱',");
		source.push("    content: new UIInput([context], {");
		source.push("      type: 'email'");
		source.push("    })");
		source.push("  }, {");
		source.push("    name: 'b',");
		source.push("    label: '手机号码',");
		source.push("    content: new UIInput([context]),");
		source.push("    validate: function (value, callback) {");
		source.push("      callback(/^1\\d{10}$/.test(value) ? false : '手机号必须是1开始的11位数字');");
		source.push("    }");
		source.push("  }, {");
		source.push("    name: 'c',");
		source.push("    label: '下拉选择框',");
		source.push("    content: new UISelect([context], {");
		source.push("      data: ['选项1', '选项2']");
		source.push("    }),");
		source.push("    required: true");
		source.push("  }, {");
		source.push("    name: 'd',");
		source.push("    label: '单选',");
		source.push("    content: new UIRadioGroup([context], {");
		source.push("      data: 'ABCDEF'.split('')");
		source.push("    }),");
		source.push("    required: true");
		source.push("  }, {");
		source.push("    name: 'e',");
		source.push("    label: '日期',");
		source.push("    content: new UIDateInput([context]),");
		source.push("    required: true");
		source.push("  }, {");
		source.push("    name: 'f',");
		source.push("    label: '日期范围',");
		source.push("    content: new UIDateRange([context]),");
		source.push("    required: true");
		source.push("  }, {");
		source.push("    name: 'g',");
		source.push("    label: '原生输入框',");
		source.push("    content: '<input/>',");
		source.push("    required: true");
		source.push("  }, {");
		source.push("    name: 'h',");
		source.push("    label: '原生文本框',");
		source.push("    content: '<textarea></textarea>',");
		source.push("    required: true");
		source.push("  }],");
		source.push("  buttons: [{");
		source.push("    label: '确定',");
		source.push("    type: 'submit'");
		source.push("  }]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("动态添加");

		let demo = new UIGroup(this);
		var form = demo.add(new UIFormView(this));
		form.add("a", "文本").content("文本内容");
		form.add("b", "输入框").content(new UIInput(this)).required();
		form.add("c", "手机号码").content(new UIInput(this))
			.validate(function (value, callback) {
				callback(/^1\d{10}$/.test(value) ? false : "手机号必须是1开始的11位数字");
			});
		form.add("d", "日期").content(new UIDateInput(this)).required();
		form.setButtons([{label: "确定", type: "submit"}, {label: "取消", type: "cancel"}]);

		let source = [];
		source.push("var form = new UIFormView([context]);");
		source.push("form.add('a', '文本')");
		source.push("  .content('文本内容');");
		source.push("form.add('b', '输入框')");
		source.push("  .content(new UIInput([context]))");
		source.push("  .required();");
		source.push("form.add('c', '手机号码')");
		source.push("  .content(new UIInput([context]))");
		source.push("  .validate(function (value, callback) {");
		source.push("    callback(/^1\\d{10}$/.test(value) ? false : '手机号必须是1开始的11位数字');");
		source.push("  });");
		source.push("form.add('d', '日期')");
		source.push("  .content(new UIDateInput([context]))");
		source.push("  .required();");
		source.push("form.setButtons([{");
		source.push("  label: '确定',");
		source.push("  type: 'submit'");
		source.push("}, {");
		source.push("  label: '取消',");
		source.push("  type: 'cancel'");
		source.push("}]);");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("标签对齐");
		description.push("属性 <>labelAlign</> 设置标签文本的对齐方式，可选值：<>left</>、<>center</>、<>right</>。");

		let demo = new UIGroup(this);
		demo.add(new UIFormView(this, {
			labelWidth: 150,
			labelAlign: "right",
			orientation: this.isApp ? UIFormView.HORIZONTIAL : null,
			data: [
				{name: "a", label: "输入框", content: new UIInput(this), required: true},
				{name: "b", label: "下拉选择框", content: new UISelect(this, {data: ["选项1", "选项2"]})}
			],
			buttons: [{label: "确定", type: "submit"}]
		}));

		let source = [];
		source.push("new UIFormView(context, {");
		source.push("  labelWidth: 150,");
		source.push("  labelAlign: 'right',");
		source.push("  data: [{");
		source.push("    name: 'a',");
		source.push("    label: '输入框',");
		source.push("    content: new UIInput(context),");
		source.push("    required: true");
		source.push("  }, {");
		source.push("    name: 'b',");
		source.push("    label: '下拉选择框',");
		source.push("    content: new UISelect(context, {");
		source.push("      data: ['选项1', '选项2']");
		source.push("    })");
		source.push("  }],");
		source.push("  buttons: [{");
		source.push("    label: '确定',");
		source.push("    type: 'submit'");
		source.push("  }]");
		source.push("});");

		render(demo, source, description);
	}
});