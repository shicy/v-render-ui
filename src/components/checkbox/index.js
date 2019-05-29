// ========================================================
// 复选框
// 可选属性：label, value, checked
// @author shicy <shicy85@163.com>
// Create on 2019-05-29
// ========================================================

var VRender = require(__vrender__);
var UIBase = require("../../common/UIBase");
var Renderer = require("./render");


var UICheckbox = UIBase.extend(module, {
	renderView: function () {
		UICheckbox.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	getTagName: function () {
		return "label";
	},

	getName: function () {
		// 这里不用name，将会在input上设置
	},
	setName: function (value) {
		this.options.name = value;
	},

	getLabel: function () {
		return this.options.label;
	},
	setLabel: function (value) {
		this.options.label = value;
	},

	getValue: function () {
		return this.options.value;
	},
	setValue: function (value) {
		this.options.value = value;
	},

	isChecked: function () {
		return Utils.isTrue(this.options.checked);
	},
	setChecked: function (bool) {
		this.options.checked = bool;
	}
});
