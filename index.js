// 2019-03-21

const FileSys = require("fs");
const VRender = require(__vrender__);

const UIGroup = require("./src/components/group");
const UIButton = require("./src/components/button");
const UICheckbox = require("./src/components/checkbox");


let distHashValue = "";

if (FileSys.existsSync(__dirname + "/dist")) {
	var files = FileSys.readdirSync(__dirname + "/dist");
	if (files && files.length > 0) {
		let hash = files[0].match(/\.(([0-9]|[a-f]){8})\.(js|css)$/);
		if (hash && hash[1])
			distHashValue = "." + hash[1];
	}
}

module.exports = {
	install: function () {
		VRender.UIGroup = UIGroup;
		VRender.UIButton = UIButton;
		VRender.UICheckbox = UICheckbox;
	},

	initPageView: function () {
		let files = [];
		if (this._isRenderAsApp) {
			files.push("vrender-ui.m" + distHashValue + ".css");
		}
		else {
			files.push("vrender-ui.p" + distHashValue + ".css");
		}
		files.push("vrender-ui" + distHashValue + ".js");
		files.forEach(file => {
			file = "file://" + __dirname + "/dist/" + file;
			this.import(file, {group: "ui", minify: false, index: 0});
		});
	}
};
