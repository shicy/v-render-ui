// 2019-03-21

const Path = require("path");
const FileSys = require("fs");
const VRender = require(__vrender__);

const UIGroup = require("./src/components/group");
const UIButton = require("./src/components/button");
const UICheckbox = require("./src/components/checkbox");
const UICheckGroup = require("./src/components/checkgroup");
const UIRadiobox = require("./src/components/radiobox");
const UIRadioGroup = require("./src/components/radiogroup");
const UITextView = require("./src/components/textview");
const UICombobox = require("./src/components/combobox");
const UIDatePicker = require("./src/components/datepicker");
const UIDateInput = require("./src/components/dateinput");
const UIDateRange = require("./src/components/daterange");
const UIDateTime = require("./src/components/datetime");
const UITimeInput = require("./src/components/timeinput");
const UIFileUpload = require("./src/components/fileupload");
const UIFormView = require("./src/components/formview");
const UITooltip = require("./src/components/tooltip");
const UINotice = require("./src/components/notice");
const UIDialog = require("./src/components/dialog");
const UIConfirm = require("./src/components/confirm");
const UIPopupMenu = require("./src/components/popupmenu");


// 前端构建版本，由 gulp 构建脚本自动更新
const distVersion = "190613";

module.exports = {
	install: function () {
		VRender.UIButton = UIButton;
		VRender.UICheckbox = UICheckbox;
		VRender.UICheckGroup = UICheckGroup;
		VRender.UICombobox = UICombobox;
		VRender.UIConfirm = UIConfirm;
		VRender.UIDateInput = UIDateInput;
		VRender.UIDatePicker = UIDatePicker;
		VRender.UIDateRange = UIDateRange;
		VRender.UIDateTime = UIDateTime;
		VRender.UIDialog = UIDialog;
		VRender.UIFileUpload = UIFileUpload;
		VRender.UIFormView = UIFormView;
		VRender.UIGroup = UIGroup;
		VRender.UIHGroup = UIGroup.HGroup;
		VRender.UINotice = UINotice;
		VRender.UIPopupMenu = UIPopupMenu;
		VRender.UIRadiobox = UIRadiobox;
		VRender.UIRadioGroup = UIRadioGroup;
		VRender.UITextView = UITextView;
		VRender.UITimeInput = UITimeInput;
		VRender.UITooltip = UITooltip;
		VRender.UIVGroup = UIGroup.VGroup;
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
