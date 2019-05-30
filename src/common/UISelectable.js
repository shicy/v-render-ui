// 2019-04-14

var VRender = require(__vrender__);
var UIItems = require("./UIItems");


var Utils = VRender.Utils;

var UISelectable = UIItems.extend(module, {
	getSelectedIndex: function () {
		return this.options.selectedIndex;
	},
	setSelectedIndex: function (value) {
		this.options.selectedIndex = value;
		delete this.options.selectedKey;
	},

	getSelectedKey: function () {
		return this.options.selectedKey;
	},
	setSelectedKey: function (value) {
		this.options.selectedKey = value;
		delete this.options.selectedIndex;
	},

	isMultiple: function () {
		if (this.options.hasOwnProperty("multiple"))
			return Utils.isTrue(this.options.multiple);
		return Utils.isTrue(this.options.multi);
	},
	setMultiple: function (bool) {
		this.options.multi = Utils.isNull(bool) ? true : bool;
		delete this.options.multiple;
	}
});
