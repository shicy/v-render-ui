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
		source.push("new UIButton([context], { label: 'Default' });");
		source.push("new UIButton([context], { label: 'Primary', type: 'primary' });");
		source.push("new UIButton([context], { label: 'Success', type: 'success' });");
		source.push("new UIButton([context], { label: 'Error', type: 'error' });");
		source.push("new UIButton([context], { label: 'Warn', type: 'warn' });");
		source.push("new UIButton([context], { label: 'Info', type: 'info' });");
		source.push("new UIButton([context], { label: 'Text', type: 'text' });");
		source.push("new UIButton([context], { label: 'Link', type: 'link' });");

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
		source.push("new UIButton([context], { label: 'tiny button', type: 'primary', size: 'tiny' });");
		source.push("new UIButton([context], { label: 'tiny button', type: 'primary', size: 'small' });");
		source.push("new UIButton([context], { label: 'tiny button', type: 'primary' });");
		source.push("new UIButton([context], { label: 'tiny button', type: 'primary', size: 'big' });");
		source.push("new UIButton([context], { label: 'tiny button', type: 'primary', size: 'bigger' });");

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
		demo.append(new UIButton(this, { label: "Warn", type: "warn", disabled: true }));
		demo.append(new UIButton(this, { label: "Error", type: "error", disabled: true }));
		demo.append(new UIButton(this, { label: "Info", type: "info", disabled: true }));
		demo.append(new UIButton(this, { label: "Text", type: "text", disabled: true }));
		demo.append(new UIButton(this, { label: "Link", type: "link", disabled: true }));

		let source = [];
		source.push("new UIButton([context], { label: 'Default', disabled: true });");
		source.push("new UIButton([context], { label: 'Primary', type: 'primary', disabled: true });");
		source.push("new UIButton([context], { label: 'Success', type: 'success', disabled: true });");
		source.push("new UIButton([context], { label: 'Warn', type: 'warn', disabled: true });");
		source.push("new UIButton([context], { label: 'Error', type: 'error', disabled: true });");
		source.push("new UIButton([context], { label: 'Info', type: 'info', disabled: true });");
		source.push("new UIButton([context], { label: 'Text', type: 'text', disabled: true });");
		source.push("new UIButton([context], { label: 'Link', type: 'link', disabled: true });");

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
			.append(new UIButton(this, { label: "Warn", type: "warn", icon: true }))
			.append(new UIButton(this, { label: "Error", type: "error", icon: true }))
			.append(new UIButton(this, { label: "Info", type: "info", icon: true }));
		demo.add(new UIGroup(this, { gap: 10, orientation: this.suggestOrientation }))
			.append(new UIButton(this, { label: "Windows", type: "primary", icon: "/icons/os_windows.png" }))
			.append(new UIButton(this, { label: "Mac", type: "primary", icon: "/icons/os_mac.png" }))
			.append(new UIButton(this, { label: "Linux", type: "primary", icon: "/icons/os_linux.png" }));

		var source = [];
		source.push("new UIButton(context, { label: 'Default', icon: true });");
		source.push("new UIButton(context, { label: 'Primary', type: 'primary', icon: true });");
		source.push("new UIButton(context, { label: 'Success', type: 'success', icon: true });");
		source.push("new UIButton(context, { label: 'Warn', type: 'warn', icon: true });");
		source.push("new UIButton(context, { label: 'Error', type: 'error', icon: true });");
		source.push("new UIButton(context, { label: 'Info', type: 'info', icon: true });");
		source.push("// -----------------------------------------------------");
		source.push("new UIButton(context, { label: 'Windows', type: 'primary', icon: '/icons/os_windows.png' });");
		source.push("new UIButton(context, { label: 'Mac', type: 'primary', icon: '/icons/os_mac.png' });");
		source.push("new UIButton(context, { label: 'Linux', type: 'primary', icon: '/icons/os_linux.png' });");

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
			.append(new UIButton(this, { label: "Warn", type: "warn", icon: true, waiting: true }))
			.append(new UIButton(this, { label: "Danger", type: "danger", icon: true, waiting: true }))
			.append(new UIButton(this, { label: "Info", type: "info", icon: true, waiting: true }))
			.append(new UIButton(this, { label: "Text", type: "text", icon: true, waiting: true }))
			.append(new UIButton(this, { label: "Link", type: "link", icon: true, waiting: true }));
		demo.add(new UIGroup(this, { gap: 10, orientation: this.suggestOrientation }))
			.append(new UIButton(this, { label: "点击进入等待状态", type: "primary", wait: true }))
			.append(new UIButton(this, { label: "点击等待5秒后恢复", type: "primary", wait: 5000 }));

		let source = [];
		source.push("new UIButton([context], { label: 'Default', waiting: true });");
		source.push("new UIButton([context], { label: 'Primary', type: 'primary', waiting: true });");
		source.push("new UIButton([context], { label: 'Success', type: 'source', icon: true, waiting: true });");
		source.push("new UIButton([context], { label: 'Warn', type: 'warn', icon: true, waiting: true });");
		source.push("new UIButton([context], { label: 'Danger', type: 'danger', icon: true, waiting: true });");
		source.push("new UIButton([context], { label: 'Info', type: 'info', icon: true, waiting: true });");
		source.push("new UIButton([context], { label: 'Text', type: 'text', icon: true, waiting: true });");
		source.push("new UIButton([context], { label: 'Link', type: 'link', icon: true, waiting: true });");
		source.push("new UIButton([context], { label: '点击进入等待状态', type: 'primary', wait: true });");
		source.push("new UIButton([context], { label: '点击等待5秒后恢复', type: 'primary', wait: 5000 });");

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
			.append(new UIButton(this, { label: "Warn", type: "warn", toggle: true }))
			.append(new UIButton(this, { label: "Danger", type: "danger", toggle: true }))
			.append(new UIButton(this, { label: "Info", type: "info", toggle: true }))
			.append(new UIButton(this, { label: "Text", type: "text", toggle: true }))
			.append(new UIButton(this, { label: "Link", type: "link", toggle: true }));

		let source = [];
		source.push("new UIButton([context], { label: 'Default', toggle: true });");
		source.push("new UIButton([context], { label: 'Primary', type: 'primary', toggle: true });");
		source.push("new UIButton([context], { label: 'Success', type: 'success', toggle: true });");
		source.push("new UIButton([context], { label: 'Warn', type: 'warn', toggle: true });");
		source.push("new UIButton([context], { label: 'Danger', type: 'danger', toggle: true });");
		source.push("new UIButton([context], { label: 'Info', type: 'info', toggle: true });");
		source.push("new UIButton([context], { label: 'Text', type: 'text', toggle: true });");
		source.push("new UIButton([context], { label: 'Link', type: 'link', toggle: true });");

		render(demo, source, description);
	},

	renderDemo7: function (render) {
		let description = [];
		description.push("组合按钮");

		let items = [{name: "btn1", label: "按钮1"}, {name: "btn2", label: "按钮2"}, {name: "btn3", label: "按钮3"}];

		let demo = new UIGroup(this, { gap: 10 });
		demo.add(new UIGroup(this, { gap: 10, orientation: this.suggestOrientation }))
			.append(new UIButton(this, { label: "Default", items: items }))
			.append(new UIButton(this, { label: "Primary", items: items, type: "primary" }))
			.append(new UIButton(this, { label: "Success", items: items, type: "success" }))
			.append(new UIButton(this, { label: "Warn", items: items, type: "warn" }))
			.append(new UIButton(this, { label: "Danger", items: items, type: "danger" }))
			.append(new UIButton(this, { label: "Info", items: items, type: "info" }))
			.append(new UIButton(this, { label: "Text", items: items, type: "text" }))
			.append(new UIButton(this, { label: "Link", items: items, type: "link" }));
		demo.add(new UIGroup(this, { gap: 10, orientation: this.suggestOrientation }))
			.append(new UIButton(this, { label: "Toggle Button", items: items, toggle: true }));

		let source = [];
		source.push("var items = [");
		source.push("  {name: 'btn1', label: '按钮1'},");
		source.push("  {name: 'btn3', label: '按钮3'},");
		source.push("  {name: 'btn3', label: '按钮3'}");
		source.push("];");
		source.push("new UIButton([context], { label: 'Default', items: items });");
		source.push("new UIButton([context], { label: 'Primary', items: items, type: 'primary' });");
		source.push("new UIButton([context], { label: 'Success', items: items, type: 'success' });");
		source.push("new UIButton([context], { label: 'Warn', items: items, type: 'warn' });");
		source.push("new UIButton([context], { label: 'Danger', items: items, type: 'danger' });");
		source.push("new UIButton([context], { label: 'Info', items: items, type: 'info' });");
		source.push("new UIButton([context], { label: 'Text', items: items, type: 'text' });");
		source.push("new UIButton([context], { label: 'Link', items: items, type: 'link' });");
		source.push("// -----------------------------------------------------");
		source.push("new UIButton([context], { label: 'Toggle Button', items: items, toggle: true });");

		render(demo, source, description);
	}
});
