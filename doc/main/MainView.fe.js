// 2019-04-09

const SinglePage = VR.plugins.singlepage;

const body = $("body");
const menus = $ref("mainSideMenu");

///////////////////////////////////////////////////////////
SinglePage.setViewHandler((state, callback) => {
	var url = "/component/module/"
	url += state && state.name || "index";
	VR.loadModule(url, (err, ret) => {
		if (err) {
			let errmsg = err.msg || err;
			ret = `<div class='module-error'>${errmsg}</div>`;
		}
		callback(false, ret);
	});
});

VR.on(VR.event_routerchange, (e, state) => {
	menus.find(".active").removeClass("active");
	if (state && state.name) {
		menus.find(`.menu[name=${state.name}]`).addClass("active");
	}
});

// ========================================================
menus.on("tap", ".menu", (e) => {
	let menu = $(e.currentTarget);
	var data = {name: menu.attr("name")};
	VR.navigate("/components/" + data.name, data);
});

// ========================================================
(function () {
	if (menus.find(".active").length == 0) {
		SinglePage.ready(() => {
			let paths = location.pathname.split("/");
			if (paths[2])
				menus.find(`.menu[name=${paths[2]}]`).tap();
			else
				menus.find(".menu").eq(0).tap();
		});
	}
})();
