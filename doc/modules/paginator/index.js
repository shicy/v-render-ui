// 2019-07-22

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIPaginator = VRender.UIPaginator;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIPaginator 分页";
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
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIPaginator(this, { total: 16395, size: 20, page: 3 }));

		let source = [];
		source.push("new UIPaginator([context], {\n  total: 16395,\n  size: 20,\n  page: 3\n})");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("分页大小");
		description.push("属性 <>size</> 设置分页大小，默认为 20");
		description.push("属性 <>sizes</> 设置可选择的分页大小");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIPaginator(this, { total: 12345, sizes: [10, 20, 50] }));
		demo.append(new UIPaginator(this, { total: 12345, size: 50, sizes: [10, 20, 50] }));

		let source = [];
		source.push("new UIPaginator([context], {\n  total: 12345,\n  sizes: [10, 20, 50]\n})");
		source.push("new UIPaginator([context], {\n  total: 12345,\n  size: 50,\n  sizes: [10, 20, 50]\n})");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("隐藏跳转输入框");
		description.push("设置属性 <>skip</> 为 <>false</>");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIPaginator(this, { total: 16395, skip: false }));

		let source = [];
		source.push("new UIPaginator([context], {\n  total: 16395,\n  skip: false\n})");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("显示或隐藏页码");
		description.push("属性 <>mode</> 可选值 <>spread</>、<>dropdown</>或<>false</>。");

		let demo = new UIGroup(this, { gap: 10 });
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("页码展开"))
			.append(new UIPaginator(this, {total: 12345, mode: "spread"}));
		demo.add(new UIGroup(this))
			.append($("label.demo-lbl").text("页码下拉显示"))
			.append(new UIPaginator(this, {total: 12345, mode: "dropdown"}));

		let source = [];
		source.push("new UIPaginator([context], {\n  total: 12345,\n  mode: 'spread'\n})");
		source.push("new UIPaginator([context], {\n  total: 12345,\n  mode: 'dropdown'\n})");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("自定义文本");
		description.push("属性 <>buttons</> 设置各按钮的显示文本");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIPaginator(this, { total: 12345, buttons: ["首页", "上一页", "下一页", "末页", "跳转"] }));
		demo.append(new UIPaginator(this, { total: 12345, mode: "spread", buttons: [false, "上一页", "下一页", false, "跳转"] }));

		let source = [];
		source.push("new UIPaginator([context], {\n  total: 12345,\n  buttons: ['首页', '上一页', '下一页', '末页', '跳转']\n})");
		source.push("new UIPaginator([context], {\n  total: 12345, mode: 'spread'," +
			"\n  buttons: ['首页', '上一页', '下一页', '末页', '跳转']\n})");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		if (this.isApp)
			return ;

		let description = [];
		description.push("状态信息");
		description.push("属性 <>status</> 设置分页显示的状态信息");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIPaginator(this, { total: 12345, status: true }));
		demo.append(new UIPaginator(this, { total: 12345, 
			status: "共{pageCount}页{totalCount}条，当前第{pageNo}页({pageStart}~{pageEnd}条)，每页{pageSize}条" }));

		let source = [];
		source.push("new UIPaginator([context], {\n  total: 16395,\n  status: true\n})");
		source.push("new UIPaginator([context], {\n  total: 16395," +
			"\n  status: '共{pageCount}页{totalCount}条，当前第{pageNo}页({pageStart}~{pageEnd}条)，每页{pageSize}条'\n})");

		render(demo, source, description);
	},

	renderDemo7: function (render) {
		let description = [];
		description.push("超链接样式");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIPaginator(this, { total: 12345, style: "link" }));
		demo.append(new UIPaginator(this, { total: 12345, style: "link", buttons: ["首页", "上一页", "下一页", "末页", "跳转"] }));
		demo.append(new UIPaginator(this, { total: 12345, style: "link", mode: "spread" }));
		demo.append(new UIPaginator(this, { total: 12345, style: "link", mode: "dropdown" }));

		let source = [];
		source.push("new UIPaginator([context], {\n  total: 12345,\n  style: 'link'\n})");
		source.push("new UIPaginator([context], {\n  total: 12345,\n  style: 'link'," +
			"\n  buttons: ['首页', '上一页', '下一页', '末页', '跳转']\n})");
		source.push("new UIPaginator([context], {\n  total: 12345,\n  style: 'link',\n  mode: 'spread'\n})");
		source.push("new UIPaginator([context], {\n  total: 12345,\n  style: 'link',\n  mode: 'dropdown'\n})");

		render(demo, source, description);
	},

	renderDemo8: function (render) {
		let description = [];
		description.push("禁用");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIPaginator(this, { total: 1234, page: 6, disabled: true }));

		let source = [];
		source.push("new UIPaginator([context], {\n  total: 1234,\n  page: 6,\n  disabled: true\n})");

		render(demo, source, description);
	}
});