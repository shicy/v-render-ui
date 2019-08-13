// 2019-04-09

const SinglePage = VR.plugins.singlepage;

const body = $("body");
const menus = $ref("mainSideMenu");

///////////////////////////////////////////////////////////
VR.Component.dataAdapter = function (data) {
	if (Utils.isNotNull(data)) {
		if (Utils.isArray(data))
			return {total: data.length, data: data};
		var total = parseInt(data.total) || 0;
		data = data.rows || data.data || data;
		return {total: total, data: data};
	}
	return data;
};

SinglePage.setViewHandler(function (state, callback) {
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

VR.on(VR.event_routerchange, function (e, state) {
	menus.find(".active").removeClass("active");
	if (state && state.name) {
		menus.find(`.menu[name=${state.name}]`).addClass("active");
	}
});

// ========================================================
body.on("tap", ".main-menubtn", function (e) {
	$(e.currentTarget).parent().toggleClass("open");
	return false;
});

menus.on("tap", ".menu", function (e) {
	let menu = $(e.currentTarget);
	var data = {name: menu.attr("name")};
	VR.navigate("/components/" + data.name, data);
	if (VR.ENV.isApp) {
		body.find(".main-menu").removeClass("open");
	}
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
