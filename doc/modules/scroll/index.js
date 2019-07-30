// 2019-07-23

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIList = VRender.UIList;
const UIScroll = VRender.UIScroll;

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIScroll 滚动加载";
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
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let demo = new UIGroup(this, { gap: 10 });
		let listView = new UIList(this, { apiName: "data.component.items" });
		demo.append(new UIScroll(this, { height: 400, content: listView }));

		let source = [];
		source.push("var listView = new UIList([context], {\n  apiName: 'data.component.items'\n});");
		source.push("new UIScroll([context], {\n  height: 400,\n  content: listView\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("加载信息");

		let demo = new UIGroup(this, { gap: 10 });
		let listView = new UIList(this, { apiName: "data.component.items", apiParams: { p_size: 5 } });
		demo.append(new UIScroll(this, { height: 320, content: listView, loadingText: "正在努力加载中，请稍候.."} ));

		let source = [];
		source.push("var listView = new UIList([context], {");
		source.push("  apiName: 'data.component.items',");
		source.push("  apiParams: {");
		source.push("    p_size: 5");
		source.push("  }");
		source.push("});");
		source.push("new UIScroll([context], {");
		source.push("  height: 320,");
		source.push("  content: listView,");
		source.push("  loadingText: '正在努力加载中，请稍候..'");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("加载视图");

		let demo = new UIGroup(this, { gap: 10 });
		let listView = new UIList(this, { apiName: "data.component.items" });
		let loadingView = "<div style='height:60px;background-image:url(/loading2.gif);background-size:100% 100%;'></div>";
		demo.append(new UIScroll(this, { height: 320, content: listView, loadingView: loadingView }));


		let source = [];
		source.push("var listView = new UIList([context], {");
		source.push("  apiName: 'data.component.items'");
		source.push("});");
		source.push("new UIScroll([context], {");
		source.push("  height: 320,");
		source.push("  content: '<div style=\"height:60px;background-image:url(/loading2.gif);" +
			"background-size:100% 100%;\"></div>',");
		source.push("  loadingView: loadingView");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("加载位置");

		let demo = new UIGroup(this, { gap: 10 });
		let listView = new UIList(this, { apiName: 'data.component.items' });
		demo.append(new UIScroll(this, { height: 320, content: listView, bottomDistance: 0 }));

		let source = [];
		source.push("var listView = new UIList([context], {");
		source.push("  apiName: 'data.component.items'");
		source.push("});");
		source.push("new UIScroll([context], {");
		source.push("  height: 320,");
		source.push("  content: listView,");
		source.push("  bottomDistance: 0");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("刷新信息");

		let demo = new UIGroup(this, { gap: 10 });
		let listView = new UIList(this, { apiName: 'data.component.items' });
		demo.append(new UIScroll(this, { height: 320, content: listView, 
			refreshPullText: "下拉刷新列表", refreshDropText: "松开即可刷新列表", refreshLoadText: "刷新中，请稍候.." }));

		let source = [];
		source.push("var listView = new UIList([context], {");
		source.push("  apiName: 'data.component.items'");
		source.push("});");
		source.push("new UIScroll([context], {");
		source.push("  height: 320,");
		source.push("  content: listView,");
		source.push("  refreshPullText: '下拉刷新列表',");
		source.push("  refreshDropText: '松开即可刷新列表',");
		source.push("  refreshLoadText: '刷新中，请稍候..'");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		let description = [];
		description.push("刷新视图");

		let demo = new UIGroup(this, { gap: 10 });
		let listView = new UIList(this, { apiName: 'data.component.items' });
		let refreshView = "<div style='height:100%;background-image:url(/loading3.gif);background-position:center;'></div>";
		demo.append(new UIScroll(this, { height: 320, content: listView, refreshView: refreshView }));

		let source = [];
		source.push("var listView = new UIList([context], {");
		source.push("  apiName: 'data.component.items'");
		source.push("});");
		source.push("new UIScroll([context], {");
		source.push("  height: 320,");
		source.push("  content: listView,");
		source.push("  refreshView: '<div style=\"height:100%;background-image:url(/loading3.gif);background-position:center;\"></div>'");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo7: function (render) {
		let description = [];
		description.push("刷新位置");

		let demo = new UIGroup(this, { gap: 10 });
		let listView = new UIList(this, { apiName: "data.component.items" });
		demo.append(new UIScroll(this, { height: 320, content: listView, topDistance: 100 }));

		let source = [];
		source.push("var listView = new UIList([context], {");
		source.push("  apiName: 'data.component.items'");
		source.push("});");
		source.push("new UIScroll([context], {");
		source.push("  height: 320,");
		source.push("  content: listView,");
		source.push("  topDistance: 100");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo8: function (render) {
		let description = [];
		description.push("底部视图");

		let demo = new UIGroup(this, { gap: 10 });
		let listView = new UIList(this, { apiName: "data.component.items" });
		demo.append(new UIScroll(this, { height: 320, content: listView, bottomText: "-- 已经探索到底了！！ --" }));

		let source = [];
		source.push("var listView = new UIList([context], {");
		source.push("  apiName: 'data.component.items'");
		source.push("});");
		source.push("new UIScroll([context], {");
		source.push("  height: 320,");
		source.push("  content: listView,");
		source.push("  bottomText: '-- 已经探索到底了！！ --'");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo9: function (render) {
		let description = [];
		description.push("空视图");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIScroll(this, { height: 320, content: new UIList(this) }));

		let source = [];
		source.push("new UIScroll([context], {");
		source.push("  height: 320,");
		source.push("  content: new UIList(context)");
		source.push("});");

		render(demo, source, description);
	}
});