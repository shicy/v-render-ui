// 2019-03-21

const Path = require("path");
const FileSys = require("fs");
const VRender = require(__vrender__);

const UIGroup = require("./src/components/group");
const UIButton = require("./src/components/button");
const UICheckbox = require("./src/components/checkbox");
const UIRadiobox = require("./src/components/radiobox");
const UITextView = require("./src/components/textview");
const UICombobox = require("./src/components/combobox");
const UIDatePicker = require("./src/components/datepicker");
const UIDateInput = require("./src/components/dateinput");
const UIDateRange = require("./src/components/daterange");
const UIDateTime = require("./src/components/datetime");
const UITimeInput = require("./src/components/timeinput");
const UIFileUpload = require("./src/components/fileupload");
const UITooltip = require("./src/components/tooltip");
const UIConfirm = require("./src/components/confirm");


// 前端构建版本，由 gulp 构建脚本自动更新
const distVersion = "190610";

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
		VRender.UIDateRange = UIDateRange;
		VRender.UIDateTime = UIDateTime;
		VRender.UIRadiobox = UIRadiobox;
		VRender.UITextView = UITextView;
		VRender.UITimeInput = UITimeInput;
		VRender.UIFileUpload = UIFileUpload;
		VRender.UITooltip = UITooltip;
		VRender.UIConfirm = UIConfirm;
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
