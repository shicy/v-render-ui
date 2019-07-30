// ========================================================
// 下拉选择框
// 可选属性：data, idField, labelField, labelFunction, prompt, editable, width,
// 	selectedIndex, selectedId
// @author shicy <shicy85@163.com>
// Create on 2019-05-29
// ========================================================

const VRender = require(__vrender__);
const UISelectable = require("../../common/UISelectable");
const Renderer = require("./render");


const UISelect = UISelectable.extend(module, {
	renderView: function () {
		UISelect.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	getPrompt: function () {
		return this.options.prompt;
	},
	setPrompt: function (value) {
		this.options.prompt = value;
	},

	isEditable: function () {
		return Utils.isTrue(this.options.editable);
	},
	setEditable: function (bool) {
		this.options.editable = bool;
	},

	isNative: function () {
		return Utils.isTrue(this.options.native);
	},
	setNative: function (value) {
		this.options.native = value;
	}
});