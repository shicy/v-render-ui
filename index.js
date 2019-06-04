// 2019-03-21

const Path = require("path");
const FileSys = require("fs");
const VRender = require(__vrender__);

const UIGroup = require("./src/components/group");
const UIButton = require("./src/components/button");
const UICheckbox = require("./src/components/checkbox");
const UICombobox = require("./src/components/combobox");
const UIDatePicker = require("./src/components/datepicker");
const UIDateInput = require("./src/components/dateinput");


// 前端构建版本，由 gulp 构建脚本自动更新
const distVersion = "190603";

module.exports = {
	install: function () {
		VRender.UIGroup = UIGroup;
		VRender.UIHGroup = UIGroup.HGroup;
		VRender.UIVGroup = UIGroup.VGroup;
		VRender.UIButton = UIButton;
		VRender.UICheckbox = UICheckbox;
		VRender.UICombobox = UICombobox;
		VRender.UIDateInput = UIDateInput;
		VRender.UIDatePicker = UIDatePicker;
	},

	initPageView: function () {
		let version = "";
		if (this.getContext().mode != "development") {
			version = "." + distVersion + ".min";
		}

		let files = [];
		if (this._isRenderAsApp) {
			files.push("vrender-ui." + version + ".m.css");
		}
		else {
			files.push("vrender-ui" + version + ".p.css");
		}
		files.push("vrender-ui" + version + ".js");
		
		files.forEach(file => {
			file = "file://" + __dirname + "/dist/" + file;
			this.import(file, {group: "ui", minify: false, index: 0});
		});
	},

	routeFile: function (filepath, params, callback) {
		if (/\/vrender-ui\//.test(filepath)) {
			if (/icons/.test(filepath)) {
				filepath = filepath.split("/").pop();
				filepath = Path.resolve(__dirname, "./public/icons/", filepath);
				callback(false, filepath);
			}
		}
		else {
			return false;
		}
	}
};
