// 2019-03-25

const VRender = require(__vrender);
const SideMenu = require("./SideMenu");


const $ = VRender.$;

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

		let container = $(".main-container").appendTo(mainBody);
		$("#singlepage-container").appendTo(container);
	}
});

MainView.use(VRender.plugins.SinglePage);