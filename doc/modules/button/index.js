// 2019-04-09

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const UIGroup = VRender.UIGroup;
const UIButton = VRender.UIButton;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIButton 按钮";
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
		description.push("属性 <>type</>：类型");
		description.push("可选值：<>primary</>、<>success</>、<>error</>、<>warn</>、<>info</>、<>text</>、<>link</>。");
		description.push("另外还可以使用一些非正式类型，如：<>ok</>、<>submit</>、<>save</>、<>danger</>。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UIButton(this, { label: "Default" }));
		demo.append(new UIButton(this, { label: "Primary", type: "primary" }));
		demo.append(new UIButton(this, { label: "Success", type: "success" }));
		demo.append(new UIButton(this, { label: "Error", type: "error" }));
		demo.append(new UIButton(this, { label: "Warn", type: "warn" }));
		demo.append(new UIButton(this, { label: "Info", type: "info" }));
		demo.append(new UIButton(this, { label: "Text", type: "text" }));
		demo.append(new UIButton(this, { label: "Link", type: "link" }));

		let source = [];
		source.push("new UIButton([context], {\n  label: 'Default'\n});");
		source.push("new UIButton([context], {\n  label: 'Primary',\n  type: 'primary'\n});");
		source.push("new UIButton([context], {\n  label: 'Success',\n  type: 'success'\n});");
		source.push("new UIButton([context], {\n  label: 'Error',\n  type: 'error'\n});");
		source.push("new UIButton([context], {\n  label: 'Warn',\n  type: 'warn'\n});");
		source.push("new UIButton([context], {\n  label: 'Info',\n  type: 'info'\n});");
		source.push("new UIButton([context], {\n  label: 'Text',\n  type: 'text'\n});");
		source.push("new UIButton([context], {\n  label: 'Link',\n  type: 'link'\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("属性 <>size</>：大小");
		description.push("可选值：<>tiny</>、<>small</>、<>big</>、<>bigger</>。");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UIButton(this, { label: "tiny button", type: "primary", size: "tiny" }));
		demo.append(new UIButton(this, { label: "small button", type: "primary", size: "small" }));
		demo.append(new UIButton(this, { label: "nomarl button", type: "primary" }));
		demo.append(new UIButton(this, { label: "big button", type: "primary", size: "big" }));
		demo.append(new UIButton(this, { label: "bigger button", type: "primary", size: "bigger" }));

		let source = [];
		source.push("new UIButton([context], {\n  label: 'tiny button',\n  type: 'primary',\n  size: 'tiny'\n});");
		source.push("new UIButton([context], {\n  label: 'tiny button',\n  type: 'primary',\n  size: 'small'\n});");
		source.push("new UIButton([context], {\n  label: 'tiny button',\n  type: 'primary'\n});");
		source.push("new UIButton([context], {\n  label: 'tiny button',\n  type: 'primary',\n  size: 'big'\n});");
		source.push("new UIButton([context], {\n  label: 'tiny button',\n  type: 'primary',\n  size: 'bigger'\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = []; //"通过设置属性<code>{disabled: true}</code>将按钮设置为不可用状态。";
		description.push("属性 <>disabled</>：禁用");
		description.push("设置属性 <>{disabled: true}</> 将按钮设置为不可用状态");

		let demo = new UIGroup(this, { gap: 10, orientation: this.suggestOrientation });
		demo.append(new UIButton(this, { label: "Default", disabled: true }));
		demo.append(new UIButton(this, { label: "Primary", type: "primary", disabled: true }));
		demo.append(new UIButton(this, { label: "Success", type: "success", disabled: true }));
		demo.append(new UIButton(this, { label: "Error", type: "error", disabled: true }));
		demo.append(new UIButton(this, { label: "Warn", type: "warn", disabled: true }));
		demo.append(new UIButton(this, { label: "Info", type: "info", disabled: true }));
		demo.append(new UIButton(this, { label: "Text", type: "text", disabled: true }));
		demo.append(new UIButton(this, { label: "Link", type: "link", disabled: true }));

		let source = [];
		source.push("new UIButton([context], {\n  label: 'Default',\n  disabled: true\n});");
		source.push("new UIButton([context], {\n  label: 'Primary',\n  type: 'primary',\n  disabled: true\n});");
		source.push("new UIButton([context], {\n  label: 'Success',\n  type: 'success',\n  disabled: true\n});");
		source.push("new UIButton([context], {\n  label: 'Error',\n  type: 'error',\n  disabled: true\n});");
		source.push("new UIButton([context], {\n  label: 'Warn',\n  type: 'warn',\n  disabled: true\n});");
		source.push("new UIButton([context], {\n  label: 'Info',\n  type: 'info',\n  disabled: true\n});");
		source.push("new UIButton([context], {\n  label: 'Text',\n  type: 'text',\n  disabled: true\n});");
		source.push("new UIButton([context], {\n  label: 'Link',\n  type: 'link',\n  disabled: true\n});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("属性 <>icon</>：图标");
		description.push("设置属性 <>{icon: true}</> 根据按钮类型显示图标。");
		description.push("给定图标地址，如：<>{icon: '/images/icon/xxx.png'}</>，显示自定义图标。");

		var demo = new UIGroup(this, { gap: 10 });
		demo.add(new UIGroup(this, { gap: 10, orientation: this.suggestOrientation }))
			.append(new UIButton(this, { label: "Default", icon: true }))
			.append(new UIButton(this, { label: "Primary", type: "primary", icon: true }))
			.append(new UIButton(this, { label: "Success", type: "success", icon: true }))
			.append(new UIButton(this, { label: "Error", type: "error", icon: true }))
			.append(new UIButton(this, { label: "Warn", type: "warn", icon: true }))
			.append(new UIButton(this, { label: "Info", type: "info", icon: true }));
		demo.add(new UIGroup(this, { gap: 10, orientation: this.suggestOrientation }))
			.append(new UIButton(this, { label: "Windows", type: "primary", icon: "/icons/os_windows.png" }))
			.append(new UIButton(this, { label: "Mac", type: "primary", icon: "/icons/os_mac.png" }))
			.append(new UIButton(this, { label: "Linux", type: "primary", icon: "/icons/os_linux.png" }));

		var source = [];
		source.push("new UIButton(context, {\n  label: 'Default',\n  icon: true\n});");
		source.push("new UIButton(context, {\n  label: 'Primary',\n  type: 'primary',\n  icon: true\n});");
		source.push("new UIButton(context, {\n  label: 'Success',\n  type: 'success',\n  icon: true\n});");
		source.push("new UIButton(context, {\n  label: 'Error',\n  type: 'error',\n  icon: true\n});");
		source.push("new UIButton(context, {\n  label: 'Warn',\n  type: 'warn',\n  icon: true\n});");
		source.push("new UIButton(context, {\n  label: 'Info',\n  type: 'info',\n  icon: true\n});");
		source.push("// -----------------------------------------------------");
		source.push("new UIButton(context, {\n  label: 'Windows',\n  type: 'primary',\n  icon: '/icons/os_windows.png'\n});");
		source.push("new UIButton(context, {\n  label: 'Mac',\n  type: 'primary',\n  icon: '/icons/os_mac.png'\n});");
		source.push("new UIButton(context, {\n  label: 'Linux',\n  type: 'primary',\n  icon: '/icons/os_linux.png'\n});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("等待状态");
		description.push("设置属性 <>{waiting: true}</> 初始化按钮为等待状态。");
		description.push("设置属性 <>{wait: true}</>，当点击按钮时，按钮变为等待状态。");
		description.push("设置属性 <>wait</> 为 <>number</>，当点击按钮时，按钮变为等待状态，并在 <>[wait]</> 毫秒后恢复状态。");

		let demo = new UIGroup(this, { gap: 10 });
		demo.add(new UIGroup(this, { gap: 10, orientation: this.suggestOrientation }))
			.append(new UIButton(this, { label: "Default", waiting: true }))
			.append(new UIButton(this, { label: "Primary", type: "primary", waiting: true }))
			.append(new UIButton(this, { label: "Success", type: "success", icon: true, waiting: true }))
			.append(new UIButton(this, { label: "Danger", type: "danger", icon: true, waiting: true }))
			.append(new UIButton(this, { label: "Warn", type: "warn", icon: true, waiting: true }))
			.append(new UIButton(this, { label: "Info", type: "info", icon: true, waiting: true }))
			.append(new UIButton(this, { label: "Text", type: "text", icon: true, waiting: true }))
			.append(new UIButton(this, { label: "Link", type: "link", icon: true, waiting: true }));
		demo.add(new UIGroup(this, { gap: 10, orientation: this.suggestOrientation }))
			.append(new UIButton(this, { label: "点击进入等待状态", type: "primary", wait: true }))
			.append(new UIButton(this, { label: "点击等待5秒后恢复", type: "primary", wait: 5000 }));

		let source = [];
		source.push("new UIButton([context], {\n  label: 'Default',\n  waiting: true\n});");
		source.push("new UIButton([context], {\n  label: 'Primary',\n  type: 'primary',\n  waiting: true\n});");
		source.push("new UIButton([context], {\n  label: 'Success',\n  type: 'source',\n  icon: true,\n  waiting: true\n});");
		source.push("new UIButton([context], {\n  label: 'Danger',\n  type: 'danger',\n  icon: true,\n  waiting: true\n});");
		source.push("new UIButton([context], {\n  label: 'Warn',\n  type: 'warn',\n  icon: true,\n  waiting: true\n});");
		source.push("new UIButton([context], {\n  label: 'Info',\n  type: 'info',\n  icon: true,\n  waiting: true\n});");
		source.push("new UIButton([context], {\n  label: 'Text',\n  type: 'text',\n  icon: true,\n  waiting: true\n});");
		source.push("new UIButton([context], {\n  label: 'Link',\n  type: 'link',\n  icon: true,\n  waiting: true\n});");
		source.push("new UIButton([context], {\n  label: '点击进入等待状态',\n  type: 'primary',\n  wait: true\n});");
		source.push("new UIButton([context], {\n  label: '点击等待5秒后恢复',\n  type: 'primary',\n  wait: 5000\n});");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		let description = [];
		description.push("属性 <>toggle</>：选中/未选中");

		let demo = new UIGroup(this);
		demo.add(new UIGroup(this, { gap: 10, orientation: this.suggestOrientation }))
			.append(new UIButton(this, { label: "Default", toggle: true }))
			.append(new UIButton(this, { label: "Primary", type: "primary", toggle: true }))
			.append(new UIButton(this, { label: "Success", type: "success", toggle: true }))
			.append(new UIButton(this, { label: "Danger", type: "danger", toggle: true }))
			.append(new UIButton(this, { label: "Warn", type: "warn", toggle: true }))
			.append(new UIButton(this, { label: "Info", type: "info", toggle: true }))
			.append(new UIButton(this, { label: "Text", type: "text", toggle: true }))
			.append(new UIButton(this, { label: "Link", type: "link", toggle: true }));

		let source = [];
		source.push("new UIButton([context], {\n  label: 'Default',\n  toggle: true\n});");
		source.push("new UIButton([context], {\n  label: 'Primary',\n  type: 'primary',\n  toggle: true\n});");
		source.push("new UIButton([context], {\n  label: 'Success',\n  type: 'success',\n  toggle: true\n});");
		source.push("new UIButton([context], {\n  label: 'Danger',\n  type: 'danger',\n  toggle: true\n});");
		source.push("new UIButton([context], {\n  label: 'Warn',\n  type: 'warn',\n  toggle: true\n});");
		source.push("new UIButton([context], {\n  label: 'Info',\n  type: 'info',\n  toggle: true\n});");
		source.push("new UIButton([context], {\n  label: 'Text',\n  type: 'text',\n  toggle: true\n});");
		source.push("new UIButton([context], {\n  label: 'Link',\n  type: 'link',\n  toggle: true\n});");

		render(demo, source, description);
	},

	renderDemo7: function (render) {
		let description = [];
		description.push("组合按钮");
		description.push("同时设置 <>toggle</> 为 <>true</> 时，点击按钮切换按钮显示文本。");

		let items = [{name: "btn1", label: "按钮1"}, {name: "btn2", label: "按钮2"}, {name: "btn3", label: "按钮3"}];

		let demo = new UIGroup(this, { gap: 10 });
		demo.add(new UIGroup(this, { gap: 10, orientation: this.suggestOrientation }))
			.append(new UIButton(this, { label: "Default", items: items }))
			.append(new UIButton(this, { label: "Primary", items: items, type: "primary" }))
			.append(new UIButton(this, { label: "Success", items: items, type: "success" }))
			.append(new UIButton(this, { label: "Danger", items: items, type: "danger" }))
			.append(new UIButton(this, { label: "Warn", items: items, type: "warn" }))
			.append(new UIButton(this, { label: "Info", items: items, type: "info" }))
			.append(new UIButton(this, { label: "Text", items: items, type: "text" }))
			.append(new UIButton(this, { label: "Link", items: items, type: "link" }));
		demo.add(new UIGroup(this, { gap: 10, orientation: this.suggestOrientation }))
			.append(new UIButton(this, { label: "Toggle Button", items: items, toggle: true }));

		let source = [];
		source.push("var items = [");
		source.push("  {\n    name: 'btn1',\n    label: '按钮1'\n  },");
		source.push("  {\n    name: 'btn3',\n    label: '按钮3'\n},");
		source.push("  {\n    name: 'btn3',\n    label: '按钮3'\n}");
		source.push("];");
		source.push("// -----------------------------------------------------");
		source.push("new UIButton([context], {\n  label: 'Default',\n  items: items\n});");
		source.push("new UIButton([context], {\n  label: 'Primary',\n  items: items,\n  type: 'primary'\n});");
		source.push("new UIButton([context], {\n  label: 'Success',\n  items: items,\n  type: 'success'\n});");
		source.push("new UIButton([context], {\n  label: 'Danger',\n  items: items,\n  type: 'danger'\n});");
		source.push("new UIButton([context], {\n  label: 'Warn',\n  items: items,\n  type: 'warn'\n});");
		source.push("new UIButton([context], {\n  label: 'Info',\n  items: items,\n  type: 'info'\n});");
		source.push("new UIButton([context], {\n  label: 'Text',\n  items: items,\n  type: 'text'\n});");
		source.push("new UIButton([context], {\n  label: 'Link',\n  items: items,\n  type: 'link'\n});");
		source.push("// -----------------------------------------------------");
		source.push("new UIButton([context], {\n  label: 'Toggle Button',\n  items: items,\n  toggle: true\n});");

		render(demo, source, description);
	}
});
