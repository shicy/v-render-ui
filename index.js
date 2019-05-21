// 2019-03-21

const VRender = require(__vrender__);

const UIGroup = require("./src/components/group");
const UIButton = require("./src/components/button");
const UICheckbox = require("./src/components/checkbox");


module.exports = {
	install: function () {
		VRender.UIGroup = UIGroup;
		VRender.UIButton = UIButton;
		VRender.UICheckbox = UICheckbox;
	},

	initPageView: function () {
		let files = [];
		if (this._isRenderAsApp) {
			files.push("vrender-ui.m.css");
			// files.push("vrender-ui.m.0ea9326b.css");
		}
		else {
			files.push("vrender-ui.p.css");
			// files.push("vrender-ui.p.0ea9326b.css");
		}
		files.push("vrender-ui.js");
		// files.push("vrender-ui.0ea9326b.js");
		files.forEach(file => {
			file = "file://" + __dirname + "/dist/" + file;
			this.import(file, {group: "ui", minify: false, index: 0});
		});
	},
};
