// ========================================================
// 文件上传
// @author shicy <shicy85@163.com>
// Create on 2019-06-10
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const Renderer = require("./render");


const Utils = VRender.Utils;

const UIFileUpload = UIBase.extend(module, {
	renderView: function () {
		UIFileUpload.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	getAction: function () {
		return this.options.action;
	},
	setAction: function (value) {
		this.options.action = value;
	},

	getParams: function () {
		return this.options.params;
	},
	setParams: function (value) {
		this.options.params = value;
	},

	getUploadName: function () {
		return this.options.uploadName;
	},
	setUploadName: function (value) {
		this.options.uploadName = value;
	},

	getLimit: function () {
		return this.options.limit;
	},
	setLimit: function (value) {
		this.options.limit = value;
	},

	getBrowser: function () {
		return this.options.browser;
	},
	setBrowser: function (value) {
		this.options.browser = value;
	},

	isMultiple: function () {
		if (this.options.hasOwnProperty("multiple"))
			return Utils.isTrue(this.options.multiple);
		return Utils.isTrue(this.options.multi);
	},
	setMultiple: function (value) {
		this.options.multi = Utils.isNull(value) ? true : Utils.isTrue(value);
		delete this.options.multiple;
	},

	getFilter: function () {
		return this.options.filter;
	},
	setFilter: function (value) {
		this.options.filter = value;
	},

	isAutoUpload: function () {
		if (this.options.hasOwnProperty("autoUpload"))
			return Utils.isTrue(this.options.autoUpload);
		return true;
	},
	setAutoUpload: function (value) {
		this.options.autoUpload = Utils.isNull(value) ? true : Utils.isTrue(value);
	},

	// 多文件是否合并在一个接口上传
	isMixed: function () {
		return Utils.isTrue(this.options.mixed);
	},
	setMixed: function (value) {
		this.options.mixed = value;
	}
});