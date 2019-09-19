// 2019-07-23

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const UIGroup = VRender.UIGroup;
const UIList = VRender.UIList;
const UIPaginator = VRender.UIPaginator;

let exampleData = [];
exampleData.push({name: "携程旅行", title: "携程旅行迪士尼酒店机票火车票旅游门票攻略团购官方", type: "旅游",
	icon: "http://pp.myapp.com/ma_icon/0/icon_6240_1517882296/96", apk: "ctrip.android.view",
	url: "http://sj.qq.com/myapp/detail.htm?apkName=ctrip.android.view",
	desc: "豌豆荚小编评语：出游订酒店，订机票，火车票用携程都挺方便的，而且和去哪儿合并之后基本坐稳国内第一大的旅游出行APP了...", 
	version: "7.10.2", date: "2018-2-6", score: 4.6, size: 54.97});
exampleData.push({name: "微信", title: "微信", type: "社交", 
	icon: "http://pp.myapp.com/ma_icon/0/icon_10910_1517479239/96", apk: "com.tencent.mm",
	url: "http://sj.qq.com/myapp/detail.htm?apkName=com.tencent.mm",
	desc: "可以发语音、文字消息、表情、图片、视频30M流量可以收发上千条语音，省电省流量...",
	version: "6.6.2", date: "2018-2-1", score: 3.5, size: 58.4});
exampleData.push({name: "轩辕传奇", title: "轩辕传奇：新职业-轩辕公测", type: "游戏", subtype: "网络游戏",
	icon: "http://pp.myapp.com/ma_icon/0/icon_52431620_1517795952/96", apk: "com.tencent.tmgp.xymobile",
	url: "http://sj.qq.com/myapp/detail.htm?apkName=com.tencent.tmgp.xymobile",
	desc: "《轩辕传奇手游》是由腾讯自研的一款以山海经神话为世界背景的手游，延续端游经典PVP玩法，与上古勇士结成血盟，百人同屏，" +
		"实时对战争夺城主之位，给你畅快的打击快感！更有炫酷的灵宠系统、弑神玩法等你体验。《轩辕传奇手游》，给你一个突破想象的远古神话战场！",
	version: "1.0.185.7", date: "2018-2-5", score: 4.1, size: 901.11});
exampleData.push({name: "穿越火线", title: "穿越火线-枪战王者（荒岛特训上线）", type: "游戏", subtype: "飞行射击",
	icon: "http://pp.myapp.com/ma_icon/0/icon_12165022_1517536428/96", apk: "com.tencent.tmgp.cf",
	url: "http://sj.qq.com/myapp/detail.htm?apkName=com.tencent.tmgp.cf",
	desc: "穿越火线：枪战王者》是腾讯游戏出品的CF正版第一人称射击手游，作为一款国民级竞技手游，游戏完美传承了PC端的品质和玩法，" +
		"同时还针对手机端的操作特点，将3亿鼠标的枪战梦想延续到手机上，爽快的手感，让玩家随时随地体验极致射击乐趣和竞技对抗的热血，好玩就要一起玩。",
	version: "1.0.27.201", date: "2018-2-2", score: 4.8, size: 796.01});
exampleData.push({name: "滴滴出行", title: "滴滴出行", type: "生活",
	icon: "http://pp.myapp.com/ma_icon/0/icon_288717_1517552367/96", apk: "com.sdu.didi.psnger",
	url: "http://sj.qq.com/myapp/detail.htm?apkName=com.sdu.didi.psnger",
	desc: "【近3亿用户的选择】2012年诞生的滴滴现已成为广受用户欢迎的城市出行应用！覆盖全国超过400个城市，乘客叫车成功率94%以上！",
	version: "5.1.32", date: "2018-2-2", score: 4.6, size: 34.37});
exampleData.push({name: "饿了么", title: "饿了么", type: "生活",
	icon: "http://pp.myapp.com/ma_icon/0/icon_1029694_1518002951/96", apk: "me.ele",
	url: "http://sj.qq.com/myapp/detail.htm?apkName=me.ele",
	desc: "饿了么，专业的本地生活服务平台！",
	version: "7.32", date: "2018-2-7", score: 4.6, size: 28.22});

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIList 列表视图";
	},

	getDescription: function () {
		return "注：以下 Demo 中的默认数据集请查看页面底部";
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
		this.renderDemo12(render);
		this.renderDemo13(render);
		this.renderExampleData(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIList(this, {data: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]}));

		let source = [];
		source.push("new UIList([context], {\n  data: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']\n});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("数据集");
		description.push("属性 <>data</> 给定一个数组类型的对象集，默认显示对象中的 <>label</> 或 <>name</> 值。")

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIList(this, { data: exampleData }));

		let source = [];
		source.push("new UIList([context], {\n  data: dataSource\n});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("选择框");
		description.push("设置属性 <>chkbox</> 为 <>true</> 列表将显示选择框");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIList(this, { data: exampleData, chkbox: true, selectedIndex: 2 }));

		let source = [];
		source.push("new UIList([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  selectedIndex: 2");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("多选");
		description.push("属性 <>chkbox</> 为 <>true</> 时，同时设置属性 <>multi</> 为 <>true</> ");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIList(this, { data: exampleData, chkbox: true, multi: true, selectedIndex: [2, 3] }));

		let source = [];
		source.push("new UIList([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  multi: true,");
		source.push("  selectedIndex: [2,3]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("自定义显示字段");
		description.push("属性 <>labelField</> 可以指定数据集中的一个属性名称，该属性值作为默认显示内容");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIList(this, { data: exampleData, labelField: "title" }));

		let source = [];
		source.push("new UIList([context], {\n  data: dataSource,\n  labelField: 'title'\n});");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		let description = [];
		description.push("自定义显示内容");
		description.push("属性 <>labelFunction</> 指定一个方法，返回列表项的显示内容。");

		let labelFunction = function (data) {
			return "<a href='" + data.url + "'>【" + data.type + "】" + data.name + " V" + data.version+ "</a>";
		};

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIList(this, { data: exampleData, labelFunction: labelFunction }));

		let source = [];
		source.push("new UIList([context], {");
		source.push("  data: dataSource,");
		source.push("  labelFunction: function (data) {");
		source.push("    return '<a href=\"' + data.url + '\">【' + data.type + '】' + data.name + ' V' + data.version + '</a>';");
		source.push("  }");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo7: function (render) {
		let description = [];
		description.push("项渲染器");
		description.push("使用项渲染器可以将列表显示成任意你想要的样子。");
		description.push("属性 <>itemRender</> 指定一个方法，返回列表显示的内容。");

		let _isApp = this.isApp;
		let myItemRenderer = function ($, item, data) {
			var item = $("<div style='padding:10px 0px 10px 55px;'></div>");
			var icon = $("<img style='position:absolute; width:48px; height:48px; left:0px; top:10px'>").appendTo(item);
			var title = $("<div style='white-space:nowrap; overflow:hidden; text-overflow:ellipsis;'></div>").appendTo(item);
			var infos = $("<div style='color:#aaa; font-size:12px;'></div>").appendTo(item);
			var desc = $("<div style='color:#787878; font-size:14px; margin-top:10px'></div>").appendTo(item);

			icon.attr("src", data. icon);
			title.html("<a href='" + data.url + "' style='color:#333; font-size:16px;'>" + data.title + "</a>");
			infos.text(data.size.toFixed(2) + "M，版本号：V" + data.version + "，更新时间：" + data.date);
			desc.text(data.desc);

			let isApp = (typeof _isApp != "undefined") ? _isApp : VRender.ENV.isApp;
			if (isApp) {
				item.css({padding: "0.1rem 0px 0.1rem 0.55rem"});
				icon.css({width: "0.48rem", height: "0.48rem", top: "0.1rem"});
				title.children().css({"font-size": "0.16rem"});
				infos.css({"font-size": "0.09rem"});
				desc.css({"font-size": "0.14rem", "margin-top": "0.05rem"});
			}

			return item;
		};

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIList(this, { data: exampleData, itemRenderer: myItemRenderer, chkbox: true }));

		let source = [];
		source.push("new UIList([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  itemRenderer: function ($, item, data) {");
		source.push("    var item = $('<div style=\"padding:10px 0px 10px 55px;\"></div>');");
		source.push("    var icon = $('<img style=\"position:absolute; width:48px; height:48px; left:0px; top:10px\">').appendTo(item);");
		source.push("    var title = $('<div style=\"white-space:nowrap; overflow:hidden; text-overflow:ellipsis;\"></div>').appendTo(item);");
		source.push("    var infos = $('<div style=\"color:#aaa; font-size:12px;\"></div>').appendTo(item);");
		source.push("    var desc = $('<div style=\"color:#787878; font-size:14px; margin-top:10px\"></div>').appendTo(item);");
		source.push("");
		source.push("    icon.attr('src', data.icon);");
		source.push("    title.html('<a href=\"' + data.url + '\" style=\"color:#333;font-size:16px;\">' + data.title + '</a>');");
		source.push("    infos.text(data.size.toFixed(2) + 'M，版本号：V' + data.version + '，更新时间：' + data.date);");
		source.push("    desc.text(data.desc);");
		source.push("");
		source.push("    return item;");
		source.push("  }");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo8: function (render) {
		let description = [];
		description.push("内置项渲染器（简单）");

		let myItemRenderer = UIList.item_renderer_simple("title");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIList(this, { data: exampleData, itemRenderer: myItemRenderer, chkbox: true }));

		let source = [];
		source.push("new UIList([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  itemRenderer: UIList.item_renderer_simple('title')");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo9: function (render) {
		let description = [];
		description.push("内置项渲染器（图标）");

		let myItemRenderer = UIList.item_renderer_icon({title: "name"});

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIList(this, { data: exampleData, itemRenderer: myItemRenderer, chkbox: true }));

		let source = [];
		source.push("new UIList([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  itemRenderer: UIList.item_renderer_icon({title: 'name'})");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo10: function (render) {
		let description = [];
		description.push("内置项渲染器（按钮）");

		let buttons = [
			{name: "download", label: "立即下载", size: "small", type: "primary"},
			{name: "install", label: "安装到手机", size: "small"}
		];
		let myItemRenderer = UIList.item_renderer_button(buttons);

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIList(this, { data: exampleData, itemRenderer: myItemRenderer, chkbox: true }));

		let source = [];
		source.push("new UIList([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  itemRenderer: UIList.item_renderer_button([");
		source.push("    { name: 'download', label: '立即下载', type: 'primary' },");
		source.push("    { name: 'install', label: '安装到手机' }");
		source.push("  ])");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo11: function (render) {
		let description = [];
		description.push("内置项渲染器（图标+按钮）");

		let buttons = [
			{name: "download", label: "立即下载", size: "small", type: "primary"},
			{name: "install", label: "安装到手机", size: "small"}
		];
		let myItemRenderer = UIList.item_renderer_icon_button("icon", buttons, "name");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIList(this, { data: exampleData, itemRenderer: myItemRenderer, chkbox: true }));

		let source = [];
		source.push("new UIList([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  itemRenderer: UIList.item_renderer_icon_button('icon', [");
		source.push("    { name: 'download', label: '立即下载', type: 'primary' },");
		source.push("    { name: 'install', label: '安装到手机' }");
		source.push("  ], 'name')");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo12: function (render) {
		let description = [];
		description.push("异步数据（分页加载）");

		let demo = new UIGroup(this, { gap: 10 });
		let list = demo.add(new UIList(this, { apiName: "data.component.items" }));
		let pager = demo.add(new UIPaginator(this, { size: 10 }));
		list.setPaginator(pager);

		let source = [];
		source.push("var pager = new UIPaginator([context], { size: 10 });");
		source.push("new UIList([context], {");
		source.push("  apiName: 'data.component.items',");
		source.push("  paginator: pager");
		source.push("});");
		source.push("// 别忘了 pager.render([target]);");

		render(demo, source, description);
	},

	renderDemo13: function (render) {
		let description = [];
		description.push("空列表");

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIList(this, { empty: "你还没有相关信息" }));

		let source = [];
		source.push("new UIList([context], {");
		source.push("  empty: '你还没有相关信息'");
		source.push("});");

		render(demo, source, description);
	},

	renderExampleData: function (render) {
		let description = [];
		description.push("测试数据集");

		let source = [];
		source = JSON.stringify(exampleData, null, "  ");

		render(null, source, description);
	}
});