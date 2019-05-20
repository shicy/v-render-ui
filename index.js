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
		files.push("vrender-ui.css");
		files.push("vrender-ui.js");
		// files.push("vrender-ui.2f4e57b0.css");
		// files.push("vrender-ui.2f4e57b0.js");
		files.forEach(file => {
			file = "file://" + __dirname + "/dist/" + file;
			this.import(file, {group: "ui", index: 0});
		});
	},
};
