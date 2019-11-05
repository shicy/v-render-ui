// 2019-03-25

const Path = require("path");
const VRender = require(__vrender);
const SideMenu = require("./SideMenu");


const $ = VRender.$;
const Utils = VRender.Utils;

const MainView = VRender.PageView.extend(module, {
	getPageTitle () {
		return "v-render-ui";
	},

	getPageLogo () {
		return "/logo.png";
	},

	renderBody (body) {
		MainView.super(this, body);

		let mainBody = $("#main-body").appendTo(body);

		let sidemenu = $(".main-menu").appendTo(mainBody);
		new SideMenu(this).render(sidemenu);
		if (this._isRenderAsApp) {
			$(".main-menubtn").appendTo(sidemenu);
		}

		let container = $(".main-container").appendTo(mainBody);
		$("#singlepage-container").appendTo(container);
	}
});

MainView.import("file://" + Utils.getModuleFilePath("prismjs/themes/prism.css", __dirname));

// MainView.use(require(Path.resolve(__basedir, "../v-render-plugin-spa")))
MainView.use(require("v-render-plugin-spa"));