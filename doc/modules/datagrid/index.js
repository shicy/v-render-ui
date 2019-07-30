// 2019-07-24

const VRender = require(__vrender__);
const BaseModule = require("../BaseModule");


const $ = VRender.$;
const Utils = VRender.Utils;
const UIGroup = VRender.UIGroup;
const UIDatagrid = VRender.UIDatagrid;
const UIPaginator = VRender.UIPaginator;

let exampleData = [];
exampleData.push({id: 1, name: "携程旅行", title: "携程旅行迪士尼酒店机票火车票旅游门票攻略团购官方", type: "旅游",
	icon: "http://pp.myapp.com/ma_icon/0/icon_6240_1517882296/96", apk: "ctrip.android.view",
	url: "http://sj.qq.com/myapp/detail.htm?apkName=ctrip.android.view",
	desc: "豌豆荚小编评语：出游订酒店，订机票，火车票用携程都挺方便的，而且和去哪儿合并之后基本坐稳国内第一大的旅游出行APP了...", 
	version: "7.10.2", date: "2018-2-6", score: 4.6, size: 54.97});
exampleData.push({id: 2, name: "微信", title: "微信", type: "社交", 
	icon: "http://pp.myapp.com/ma_icon/0/icon_10910_1517479239/96", apk: "com.tencent.mm",
	url: "http://sj.qq.com/myapp/detail.htm?apkName=com.tencent.mm",
	desc: "可以发语音、文字消息、表情、图片、视频30M流量可以收发上千条语音，省电省流量...",
	version: "6.6.2", date: "2018-2-1", score: 3.5, size: 58.4});
exampleData.push({id: 3, name: "轩辕传奇", title: "轩辕传奇：新职业-轩辕公测", type: "游戏", subtype: "网络游戏",
	icon: "http://pp.myapp.com/ma_icon/0/icon_52431620_1517795952/96", apk: "com.tencent.tmgp.xymobile",
	url: "http://sj.qq.com/myapp/detail.htm?apkName=com.tencent.tmgp.xymobile",
	desc: "《轩辕传奇手游》是由腾讯自研的一款以山海经神话为世界背景的手游，延续端游经典PVP玩法，与上古勇士结成血盟，百人同屏，" +
		"实时对战争夺城主之位，给你畅快的打击快感！更有炫酷的灵宠系统、弑神玩法等你体验。《轩辕传奇手游》，给你一个突破想象的远古神话战场！",
	version: "1.0.185.7", date: "2018-2-5", score: 4.1, size: 901.11});
exampleData.push({id: 4, name: "穿越火线", title: "穿越火线-枪战王者（荒岛特训上线）", type: "游戏", subtype: "飞行射击",
	icon: "http://pp.myapp.com/ma_icon/0/icon_12165022_1517536428/96", apk: "com.tencent.tmgp.cf",
	url: "http://sj.qq.com/myapp/detail.htm?apkName=com.tencent.tmgp.cf",
	desc: "《穿越火线：枪战王者》是腾讯游戏出品的CF正版第一人称射击手游，作为一款国民级竞技手游，游戏完美传承了PC端的品质和玩法，" +
		"同时还针对手机端的操作特点，将3亿鼠标的枪战梦想延续到手机上，爽快的手感，让玩家随时随地体验极致射击乐趣和竞技对抗的热血，好玩就要一起玩。",
	version: "1.0.27.201", date: "2018-2-2", score: 4.8, size: 796.01});
exampleData.push({id: 5, name: "滴滴出行", title: "滴滴出行", type: "生活",
	icon: "http://pp.myapp.com/ma_icon/0/icon_288717_1517552367/96", apk: "com.sdu.didi.psnger",
	url: "http://sj.qq.com/myapp/detail.htm?apkName=com.sdu.didi.psnger",
	desc: "【近3亿用户的选择】2012年诞生的滴滴现已成为广受用户欢迎的城市出行应用！覆盖全国超过400个城市，乘客叫车成功率94%以上！",
	version: "5.1.32", date: "2018-2-2", score: 4.6, size: 34.37});
exampleData.push({id: 6, name: "饿了么", title: "饿了么", type: "生活",
	icon: "http://pp.myapp.com/ma_icon/0/icon_1029694_1518002951/96", apk: "me.ele",
	url: "http://sj.qq.com/myapp/detail.htm?apkName=me.ele",
	desc: "饿了么，专业的本地生活服务平台！",
	version: "7.32", date: "2018-2-7", score: 4.6, size: 28.22});

const ModuleView = BaseModule.extend(module, {
	getTitle: function () {
		return "UIDatagrid 数据网格";
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
		this.renderDemo14(render);
		this.renderDemo15(render);
		this.renderDemo16(render);
		this.renderExampleData(render);
	},

	renderDemo1: function (render) {
		let description = [];
		description.push("基本使用");

		let columns = [];
		columns.push({ name: "name", title: "名称" });
		if (!this.isApp)
			columns.push({ name: "type", title: "类型" });
		columns.push({ name: "version", title: "版本" });
		columns.push({ name: "date", title: "发布日期" });
		columns.push({ name: "score", title: "评分" });

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns, data: exampleData }));

		let source = [];
		source.push("new UIDatagrid([context], {");
		source.push("  data: dataSource,");
		source.push("  columns: [");
		source.push("    { name: 'name', title: '名称' },");
		if (!this.isApp)
			source.push("    { name: 'type', title: '类型' },");
		source.push("    { name: 'version', title: '版本' },");
		source.push("    { name: 'date', title: '发布日期' },");
		source.push("    { name: 'score', title: '评分' }");
		source.push("  ]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo2: function (render) {
		let description = [];
		description.push("选择框");
		description.push("设置属性 <>chkbox</> 为 <>true</> 显示列表选择框");

		let columns = [];
		columns.push({ name: "name", title: "名称", width: (this.isApp ? null : 120) });
		if (!this.isApp)
			columns.push({ name: "desc", title: "应用信息" });

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns, data: exampleData, chkbox: true, selectedIndex: 2 }));

		let source = [];
		source.push("new UIDatagrid([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  selectedIndex: 2,");
		source.push("  columns: [{");
		source.push("    name: 'name',");
		source.push("    title: '名称'" + (this.isApp ? "" : ",\n    width: 120"));
		if (!this.isApp) {
			source.push("  }, {");
			source.push("    name: 'desc',");
			source.push("    title: '应用信息'");
		}
		source.push("  }]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo3: function (render) {
		let description = [];
		description.push("多选");
		description.push("属性 <>chkbox</> 为 <>true</> 时，设置属性 <>multi</> 为 <>true</>。");

		let columns = [];
		columns.push({ name: "name", title: "名称", width: (this.isApp ? null : 120) });
		if (!this.isApp)
			columns.push({ name: "desc", title: "应用信息" });

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns, data: exampleData, 
			chkbox: true, multi: true, selectedIndex: [2, 3] }));

		let source = [];
		source.push("new UIDatagrid([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  multi: true,");
		source.push("  selectedIndex: [2, 3],");
		source.push("  columns: [{");
		source.push("    name: 'name',");
		source.push("    title: '名称'" + (this.isApp ? "" : ",\n    width: 120"));
		if (!this.isApp) {
			source.push("  }, {");
			source.push("    name: 'desc',");
			source.push("    title: '应用信息'");
		}
		source.push("  }]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo4: function (render) {
		let description = [];
		description.push("属性 <>sortable</>：排序");

		let nameSortTypes = [];
		nameSortTypes.push({ type: "asc", label: "升序" });
		nameSortTypes.push({ type: "desc", label: "降序" });
		nameSortTypes.push({ type: "hot", label: "热门", icon: "/icons/c01.png", custom: true });

		let versionSortFunction = function (a, b, sortType) {
			a = a.version.split(".");
			b = b.version.split(".");
			let sortFlag = sortType == "asc" ? 1 : -1;
			for (let i = 0; i < a.length; i++) {
				if (i < b.length) {
					let t = parseInt(a[i]) - parseInt(b[i]);
					if (t)
						return t * sortFlag;
				}
				else {
					return sortFlag;
				}
			}
			return (a.length < b.length) ? sortFlag : 0;
		};

		let columns = [];
		columns.push({ name: "name", title: "名称", sortable: nameSortTypes, sortType: "asc" });
		if (this.isApp) {
			columns.push({ name: "type", title: "类型", sortable: true, width: "1rem" });
			columns.push({ name: "version", title: "版本", sortable: versionSortFunction });
		}
		else {
			columns.push({ name: "type", title: "类型", sortable: true });
			columns.push({ name: "version", title: "版本", sortable: versionSortFunction });
			columns.push({ name: "date", title: "发布日期", sortable: true, dataType: "date" });
			columns.push({ name: "score", title: "评分", sortable: true });
		}

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns, data: exampleData, chkbox: true, selectedIndex: 0 }));

		let source = [];
		source.push("new UIDatagrid([context], {");
		source.push("  ref: 'datagrid4',");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  selectedIndex: 0,");
		source.push("  columns: [{");
		source.push("    name: 'name',");
		source.push("    title: '名称',");
		source.push("    sortable: [");
		source.push("      { type: 'asc', label: '升序' },");
		source.push("      { type: 'desc', label: '降序' },");
		source.push("      { type: 'hot', label: '热门', icon: '/icons/c01.png', custom: true }");
		source.push("    ],");
		source.push("    sortType: 'asc'");
		source.push("  }, {");
		source.push("    name: 'type',");
		source.push("    title: '类型',");
		source.push("    sortable: true" + (this.isApp ? ",\n    width: '1rem'" : ""));
		source.push("  }, {");
		source.push("    name: 'version',");
		source.push("    title: '版本',");
		source.push("    sortable: function (a, b, sortType) {");
		source.push("      a = a.version.split('.');");
		source.push("      b = b.version.split('.');");
		source.push("      var sortFlag = sortType == 'asc' ? 1 : -1;");
		source.push("      for (var i = 0; i < a.length; i++) {");
		source.push("          if (i < b.length) {");
		source.push("              var t = parseInt(a[i]) - parseInt(b[i]);");
		source.push("              if (t)");
		source.push("                  return t * sortFlag;");
		source.push("          }");
		source.push("          else {");
		source.push("              return sortFlag;");
		source.push("          }");
		source.push("      }");
		source.push("      return (a.length < b.length) ? sortFlag : 0;");
		source.push("    }");
		if (!this.isApp) {
			source.push("  }, {");
			source.push("    name: 'date',");
			source.push("    title: '发布日期',");
			source.push("    sortable: true,");
			source.push("    dataType: 'date'");
			source.push("  }, {");
			source.push("    name: 'score',");
			source.push("    title: '评分',");
			source.push("    sortable: true");
		}
		source.push("  }]");
		source.push("});");
		source.push("");
		source.push("// 前端排序事件");
		source.push("$ref('datagrid4').on('sort', function (e, columnName, sortType) {});");

		render(demo, source, description);
	},

	renderDemo5: function (render) {
		let description = [];
		description.push("属性 <>filter</>：筛选");

		let scoreFilter = [];
		scoreFilter.push({ label: "好评", value: 1, handler: function (d) { return d.score >= 4.5; } });
		scoreFilter.push({ label: "中评", value: 2, handler: function (d) { return d.score >= 4 && d.score < 4.5; } });
		scoreFilter.push({ label: "差评", value: 3, handler: function (d) { return d.score < 4; } });

		let sizeFilter = [];
		sizeFilter.push({ label: "小于30M", value: 30 });
		sizeFilter.push({ label: "小于50M", value: 50 });
		sizeFilter.push({ label: "小于100M", value: 100 });

		let sizeFilterFunction = function (d, v) { return d.size < v; };

		let columns = [];
		columns.push({ name: "name", title: "名称", sortable: true, filter: true });
		columns.push({ name: "type", title: "类型", filter: "enum" });
		columns.push({ name: "score", title: "评分", filter: scoreFilter, sortable: true, filterValue: 2 });
		columns.push({ name: "size", title: "大小", filter: sizeFilter, filterFunction: sizeFilterFunction });
		if (!this.isApp)
			columns.push({ name: "date", title: "发布日期" });

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns, data: exampleData, chkbox: true }));

		let source = [];
		source.push("new UIDatagrid([context], {");
		source.push("  ref: 'datagrid5',");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  columns: [{");
		source.push("    name: 'name',");
		source.push("    title: '名称',");
		source.push("    filter: true");
		source.push("  }, {");
		source.push("    name: 'type',");
		source.push("    title: '类型',");
		source.push("    filter: 'enum'");
		source.push("  }, {");
		source.push("    name: 'score',");
		source.push("    title: '评分',");
		source.push("    filter: [");
		source.push("      { label: '好评', value: 1, handler: (t) => (t.score >= 4.5)},");
		source.push("      { label: '中评', value: 2, handler: (t) => (t.score >= 4 && t.score < 4.5)},");
		source.push("      { label: '差评', value: 3, handler: (t) => (t.score < 4)}");
		source.push("    ]");
		source.push("  }, {");
		source.push("    name: 'size',");
		source.push("    title: '大小',");
		source.push("    filter: [");
		source.push("      { label: '小于30M', value: 30 },");
		source.push("      { label: '小于50M', value: 50 },");
		source.push("      { label: '小于100M', value: 100 }");
		source.push("    ],");
		source.push("    filterFunction: (t, val) => (t.size < val)");
		if (!this.isApp) {
			source.push("  }, {");
			source.push("    name: 'date',");
			source.push("    title: '发布日期'");
		}
		source.push("  }]");
		source.push("});");
		source.push("");
		source.push("// 前端筛选事件");
		source.push("$('datagrid5').on('filter', function (e, column, value) {});");

		render(demo, source, description);
	},

	renderDemo6: function (render) {
		let description = [];
		description.push("表头图标");

		let columns = [];
		if (this.isApp) {
			columns.push({ name: "name", title: "名称", icon: "/icons/d01.png" });
		}
		else {
			columns.push({ name: "name", title: "名称", icon: "/icons/d01.png", width: 120 });
			columns.push({ name: "desc", title: "应用信息", icon: "/icons/a07.png" });
		}

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns, data: exampleData }));

		let source = [];
		source.push("new UIDatagrid([context], {");
		source.push("  data: dataSource,");
		source.push("  columns: [{");
		source.push("    name: 'name',");
		source.push("    title: '名称',");
		source.push("    icon: '/icons/d01.png'" + (this.isApp ? "" : ",\n    width: 120"));
		if (!this.isApp) {
			source.push("  }, {");
			source.push("    name: 'desc',");
			source.push("    title: '应用信息',");
			source.push("    icon: '/icons/d02.png'");
		}
		source.push("  }]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo7: function (render) {
		let description = [];
		description.push("自定义表头");

		let columns = [];
		columns.push({name: "name", title: "标题", width: (this.isApp ? null : 120), 
			focusHtmlTitle: "<div style='color:#fff;background-color:#333;'>标题</div>"});
		if (!this.isApp) {
			columns.push({name: "desc", title: "应用信息", 
				focusHtmlTitle: "<div style='color:red;'>应用信息</div>"});
		}

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns, data: exampleData }));

		let source = [];
		source.push("new UIDatagrid([context], {");
		source.push("  data: dataSource,");
		source.push("  columns: [{");
		source.push("    name: 'name',");
		source.push("    title: '标题',");
		if (!this.isApp)
			source.push("    width: 120,");
		source.push("    focusHtmlTitle: '<div style=\"color:#fff;background-color:#333;\">标题</div>'");
		if (!this.isApp) {
			source.push("  }, {");
			source.push("    name: 'desc',");
			source.push("    title: '应用信息',");
			source.push("    focusHtmlTitle: '<div style=\"color:red;\">应用信息</div>'");
		}
		source.push("  }]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo8: function (render) {
		let description = [];
		description.push("自定义表头（headRenderer）");

		let columns = [];
		columns.push({ name: "name", title: "标题", width: (this.isApp ? null : 120), sortable: true, filter: true });
		if (!this.isApp)
			columns.push({ name: "desc", title: "应用信息" });

		let _isApp = this.isApp;
		let myHeadRenderer = function (column, index) {
			let $ = (typeof window == "undefined") ? VRender.$ : window.$;
			let isApp = (typeof _isApp != "undefined") ? _isApp : VRender.ENV.isApp;
			let view = $("<div></div>").text(column.title);
			view.css({lineHeight: "35px", color: "#fff", backgroundColor: "#08bcf3", paddingLeft: "10px"});
			if (isApp)
				view.css("lineHeight", "0.4rem");
			if (index > 0)
				view.css({borderLeft: "1px solid #fff"});
			return view;
		};

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns, data: exampleData, headRenderer: myHeadRenderer }));

		let source = [];
		source.push("new UIDatagrid([context], {");
		source.push("  data: dataSource,");
		source.push("  columns: [{");
		source.push("    name: 'name',");
		source.push("    title: '标题',");
		if (!this.isApp)
			source.push("    width: 120,");
		source.push("    sortable: true,");
		source.push("    filter: true");
		if (!this.isApp) {
			source.push("  }, {");
			source.push("    name: 'desc',");
			source.push("    title: '应用信息',");
		}
		source.push("  }],");
		source.push("  headRenderer: function (column, index) {");
		source.push("    var $ = $ || VRender.$;");
		source.push("    var view = $('<div></div>').text(column.title);");
		source.push("    view.css({lineHeight: '35px', color: '#fff', backgroundColor: '#08bcf3', paddingLeft: '10px'});");
		source.push("    if (index >0) view.css({borderLeft: '1px solid #fff'});");
		source.push("    var isApp = ''; // 需考虑前后端适配");
		source.push("    if (isApp) view.css('lineHeight', '0.4rem');");
		source.push("    return view;");
		source.push("  }");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo9: function (render) {
		let description = [];
		description.push("隐藏标题栏");
		description.push("设置属性 <>showHeader</> 为 <>false</>");

		let columns = [];
		columns.push({ name: "name", title: "名称" });
		columns.push({ name: "type", title: "类型" });
		columns.push({ name: "version", title: "版本" });
		if (!this.isApp)
			columns.push({ name: "date", title: "发布日期" });
		columns.push({ name: "score", title: "评分" });

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns, data: exampleData, showHeader: false }));

		let source = [];
		source.push("new UIDatagrid([context], {");
		source.push("  data: dataSource,");
		source.push("  showHeader: false,");
		source.push("  columns: [");
		source.push("    { name: 'name', title: '名称' },");
		source.push("    { name: 'type', title: '类型' },");
		source.push("    { name: 'version', title: '版本' },");
		if (!this.isApp)
			source.push("    { name: 'date', title: '发布日期' },");
		source.push("    { name: 'score', title: '评分' }");
		source.push("  ]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo10: function (render) {
		let description = [];
		description.push("渲染器");

		let columns = [];
		columns.push({ name: "name", title: "标题" });
		if (!this.isApp) {
			columns.push({ name: "type", title: "类型" });
			columns.push({ name: "version", title: "版本" });
			columns.push({ name: "score", title: "评分" });
			columns.push({ name: "date", title: "发布日期" });
		}

		let _isApp = this.isApp;
		let myColumnRenderer = function (column, data) {
			let $ = (typeof window == "undefined") ? VRender.$ : window.$;
			let isApp = (typeof _isApp != "undefined") ? _isApp : VRender.ENV.isApp;
			if (column == "name") {
				let nameView = $("<div></div>");
				let icon = $("<img style='display:inline-block;width:20px;height:20px;vertical-align:top;'/>");
				if (isApp)
					icon.css("width", "0.2rem").css("height", "0.2rem");
				let title = $("<span style='margin-left:5px;'></span>");
				icon.appendTo(nameView).attr("src", data.icon);
				title.appendTo(nameView).text(data.title);
				return nameView;
			}
			else if (column == "version")
				return "V" + data.version;
			else if (column == "date")
				return Utils.toDateString(Utils.toDate(data.date), "yyyy年MM月dd日");
			else if (column == "score")
				return data.score.toFixed(2) + "分";
		};

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns, data: exampleData, columnRenderer: myColumnRenderer }));

		let source = [];
		source.push("new UIDatagrid([context], {");
		source.push("  data: dataSource,");
		source.push("  columns: [{");
		source.push("    name: 'name',");
		source.push("    title: '标题'");
		if (!this.isApp) {
			source.push("  }, {");
			source.push("    name: 'type',");
			source.push("    title: '类型'");
			source.push("  }, {");
			source.push("    name: 'version',");
			source.push("    title: '版本'");
			source.push("  }, {");
			source.push("    name: 'score',");
			source.push("    title: '评分'");
			source.push("  }, {");
			source.push("    name: 'date',");
			source.push("    title: '发布日期'");
		}
		source.push("  }],");
		source.push("  columnRenderer: function (column, data) {");
		source.push("    var $ = $ || VRender.$;");
		source.push("    var isApp = ''; // 需考虑前后端适配");
		source.push("    if (column == 'name') {");
		source.push("      var nameView = $('<div></div>');");
		source.push("      var icon = $('<img style='display:inline-block;width:20px;height:20px;vertical-align:top;'/>');");
		source.push("      if (isApp) icon.css('width', '0.2rem').css('height', '0.2rem');");
		source.push("      var title = $('<span style='margin-left:5px;'></span>');");
		source.push("      icon.appendTo(nameView).attr('src', data.icon);");
		source.push("      title.appendTo(nameView).text(data.title);");
		source.push("      return nameView;");
		source.push("    }");
		source.push("    else if (column == 'version')");
		source.push("      return 'V' + data.version;");
		source.push("    else if (column == 'date')");
		source.push("      return Utils.toDateString(Utils.toDate(data.date), 'yyyy年MM月dd日');");
		source.push("    else if (column == 'score')");
		source.push("      return data.score.toFixed(2) + '分';");
		source.push("    // else 返回默认渲染方法");
		source.push("  }");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo11: function (render) {
		let description = [];
		description.push("扩展列");

		let columns = [];
		columns.push({ name: "name", title: "名称" });
		columns.push({ name: "type", title: "类型" });
		if (!this.isApp)
			columns.push({ name: "version", title: "版本" });
		columns.push({ name: "score", title: "评分", sortable: true });
		columns.push({ name: "desc", title: "应用信息", expand: true });
		columns.push({ name: "date", title: "发布日期", expand: true });

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns, data: exampleData, chkbox: true, expandcols: 1 }));

		let source = [];
		source.push("new UIDatagrid([context], {");
		source.push("  data: dataSource,");
		source.push("  chkbox: true,");
		source.push("  expandcols: 1,");
		source.push("  columns: [{");
		source.push("    name: 'name',");
		source.push("    title: '名称'");
		source.push("  }, {");
		source.push("    name: 'type',");
		source.push("    title: '类型'");
		if (!this.isApp) {
			source.push("  }, {");
			source.push("    name: 'version',");
			source.push("    title: '版本'");
		}
		source.push("  }, {");
		source.push("    name: 'score',");
		source.push("    title: '评分',");
		source.push("    sortable: true");
		source.push("  }, {");
		source.push("    name: 'desc',");
		source.push("    title: '应用信息',");
		source.push("    expand: true");
		source.push("  }, {");
		source.push("    name: 'date',");
		source.push("    title: '发布日期',");
		source.push("    expand: true");
		source.push("  }]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo12: function (render) {
		let description = [];
		description.push("列扩展（使用expandRenderer）");

		let columns = [];
		columns.push({ name: "name", title: "名称" });
		columns.push({ name: "type", title: "类型" });
		if (!this.isApp)
			columns.push({ name: "version", title: "版本" });
		columns.push({ name: "score", title: "评分" });
		if (!this.isApp)
			columns.push({ name: "date", title: "发布日期" });
		columns.push({ name: "desc", title: "应用信息", expand: true });

		let myExpandRenderer = function (data) {
			let view = $("<div style='padding-left: 30px; margin: 10px;'></div>");
			let icon = $("<img style='position:absolute;width:20px;height:20px;left:0px;top:0px;'/>");
			let title = $("<div style='font-size: 16px;'></div>");
			let desc = $("<div style='margin-top:5px;color:#999;font-size:14px;'></div>");

			if (VRender.ENV.isApp) {
				view.css("paddingLeft", "0.3rem");
				icon.css("width", "0.2rem").css("height", "0.2rem");
				title.css("fontSize", "0.16rem");
				desc.css("fontSize", "0.14rem");
			}

			icon.appendTo(view).attr("src", data.icon);
			title.appendTo(view).text(data.title);
			desc.appendTo(view).text(data.desc);

			return view;
		};

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns, data: exampleData, expandRenderer: myExpandRenderer }));

		let source = [];
		source.push("new UIDatagrid([context], {");
		source.push("  data: dataSource,");
		source.push("  columns: [{");
		source.push("    name: 'name',");
		source.push("    title: '名称'");
		source.push("  }, {");
		source.push("    name: 'type',");
		source.push("    title: '类型'");
		if (!this.isApp) {
			source.push("  }, {");
			source.push("    name: 'version',");
			source.push("    title: '版本'");
		}
		source.push("  }, {");
		source.push("    name: 'score',");
		source.push("    title: '评分'");
		if (!this.isApp) {
			source.push("  }, {");
			source.push("    name: 'date',");
			source.push("    title: '发布日期'");
		}
		source.push("  }, {");
		source.push("    name: 'desc',");
		source.push("    title: '应用信息',");
		source.push("    expand: true");
		source.push("  }],");
		source.push("  expandRenderer: function (data) {");
		source.push("    var view = $('<div style=\"padding-left:30px;\"></div>');");
		source.push("    var icon = $('<img style=\"position:absolute;width:20px;height:20px;left:0px;top:0px;\"/>');");
		source.push("    var title = $('<div style=\"font-size:16px;\"></div>');");
		source.push("    var desc = $('<div style=\"margin-top:5px;color:#999;font-size:14px;\"></div>');");
		source.push("");
		source.push("    if (VRender.ENV.isApp) { // 扩展对象只会在前端渲染，这里不需要考虑前后端适配");
		source.push("        view.css('paddingLeft', '0.3rem');");
		source.push("        icon.css('width', '0.2rem').css('height', '0.2rem');");
		source.push("        title.css('fontSize', '0.16rem');");
		source.push("        desc.css('fontSize', '0.14rem');");
		source.push("    }");
		source.push("");
		source.push("    icon.appendTo(view).attr('src', data.icon);");
		source.push("    title.appendTo(view).text(data.title);");
		source.push("    desc.appendTo(view).text(data.desc);");
		source.push("");
		source.push("    return view;");
		source.push("  }");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo13: function (render) {
		let description = [];
		description.push("样式");

		let columns = [];
		columns.push({ name: "name", title: "名称" });
		columns.push({ name: "type", title: "类型" });
		columns.push({ name: "version", title: "版本" });
		columns.push({ name: "score", title: "评分" });
		if (!this.isApp)
			columns.push({ name: "date", title: "发布日期" });

		let myRowStyleFunction = function (data, index) {
			if (index == 1)
				return {color: "#fff", backgroundColor: "#03A9F4"};
		};

		let myCellStyleFunction = function (columnName, data, index) {
			if (columnName == "score" && data.score > 4.5)
				return {color: "#f00"};
			if (columnName == "name" && index == 3)
				return {color: "#fff", backgroundColor: "#ffb100"};
		};

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns, data: exampleData, 
			rowStyleFunction: myRowStyleFunction, cellStyleFunction: myCellStyleFunction }));

		let source = [];
		source.push("new UIDatagrid([context], {");
		source.push("  data: dataSource,");
		source.push("  columns: [{");
		source.push("    name: 'name',");
		source.push("    title: '名称'");
		source.push("  }, {");
		source.push("    name: 'type',");
		source.push("    title: '类型'");
		source.push("  }, {");
		source.push("    name: 'version',");
		source.push("    title: '版本'");
		source.push("  }, {");
		source.push("    name: 'score',");
		source.push("    title: '评分'");
		if (!this.isApp) {
			source.push("  }, {");
			source.push("    name: 'date',");
			source.push("    title: '发布日期'");
		}
		source.push("  }],");
		source.push("  rowStyleFunction: function (data, index) {");
		source.push("    if (index == 1) return {color: '#fff', backgroundColor: '#03A9F4'};");
		source.push("  },");
		source.push("  cellStyleFunction: function (columnName, data, index) {");
		source.push("    if (columnName == 'score' && data.score > 4.5)");
		source.push("      return {color: '#f00'};");
		source.push("    if (columnName == 'name' && index == 3)");
		source.push("      return {color: '#fff', backgroundColor: '#ffb100'};");
		source.push("  }");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo14: function (render) {
		let description = [];
		description.push("高度和宽度");

		let columns = [];
		columns.push({ name: 'name', title: '名称' });
		columns.push({ name: 'date', title: '发布日期', width: 100 });

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns, data: exampleData, height: 200 }));

		let source = [];
		source.push("new UIDatagrid([context], {");
		source.push("  data: dataSource,");
		source.push("  height: 200,");
		source.push("  columns: [{");
		source.push("    name: 'name',");
		source.push("    title: '名称'");
		source.push("  }, {");
		source.push("    name: 'date',");
		source.push("    title: '发布日期',");
		source.push("    width: 100");
		source.push("  }]");
		source.push("});");

		render(demo, source, description);
	},

	renderDemo15: function (render) {
		let description = [];
		description.push("异步数据（分页加载）");

		var columns = [];
		columns.push({ name: 'c1', title: 'Column 1' });
		columns.push({ name: 'c2', title: 'Column 2' });
		columns.push({ name: 'c3', title: 'Column 3' });
		columns.push({ name: 'c4', title: 'Column 4' });
		if (!this.isApp)
			columns.push({ name: 'c5', title: 'Column 5' });

		let demo = new UIGroup(this, { gap: 10 });
		var grid = demo.add(new UIDatagrid(this, { columns: columns, apiName: "data.component.items2" }));
		var pager = demo.add(new UIPaginator(this, { size: 10 }));
		grid.setPaginator(pager);

		let source = [];
		source.push("var pager = new UIPaginator([context], { size: 10 });");
		source.push("new UIDatagrid([context], {");
		source.push("  data: dataSource,");
		source.push("  paginator: pager,");
		source.push("  columns: [{");
		source.push("    name: 'c1',");
		source.push("    title: 'Column 1'");
		source.push("  }, {");
		source.push("    name: 'c2',");
		source.push("    title: 'Column 2'");
		source.push("  }, {");
		source.push("    name: 'c3',");
		source.push("    title: 'Column 3'");
		source.push("  }, {");
		source.push("    name: 'c4',");
		source.push("    title: 'Column 5'");
		if (!this.isApp) {
			source.push("  }, {");
			source.push("    name: 'c5',");
			source.push("    title: 'Column 5'");
		}
		source.push("  }]");
		source.push("});");
		source.push("// 别忘了 pager.render([target]);");

		render(demo, source, description);
	},

	renderDemo16: function (render) {
		let description = [];
		description.push("空表格");

		let columns = [];
		columns.push({ name: "name", title: "名称" });
		columns.push({ name: "type", title: "类型" });
		columns.push({ name: "version", title: "版本" });
		columns.push({ name: "score", title: "评分" });
		columns.push({ name: "date", title: "发布日期" });

		let demo = new UIGroup(this, { gap: 10 });
		demo.append(new UIDatagrid(this, { columns: columns }));
		demo.append(new UIDatagrid(this, { columns: columns, showHeader: false }));
		demo.append(new UIDatagrid(this, { columns: columns, emptyText: "你还没有相关信息" }));

		let source = [];
		source.push("var columns = [{");
		source.push("    name: 'name',");
		source.push("    title: '名称'");
		source.push("  }, {");
		source.push("    name: 'type',");
		source.push("    title: '类型'");
		source.push("  }, {");
		source.push("    name: 'version',");
		source.push("    title: '版本'");
		source.push("  }, {");
		source.push("    name: 'score',");
		source.push("    title: '评分'");
		source.push("  }, {");
		source.push("    name: 'date',");
		source.push("    title: '发布日期'");
		source.push("}];");
		source.push("");
		source.push("new UIDatagrid([context], {\n  columns: columns\n});");
		source.push("new UIDatagrid([context], {\n  columns: columns,\n  showHeader: false\n});");
		source.push("new UIDatagrid([context], {\n  columns: columns,\n  emptyText: '你还没有相关信息'\n});");

		render(demo, source, description);
	},

	renderExampleData: function (render) {
		let description = [];
		description.push("以上数据结构如下");

		let source = [];
		source = JSON.stringify(exampleData, null, "  ");

		render(null, source, description);
	}
});