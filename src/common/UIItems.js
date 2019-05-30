// 2019-04-14

const VRender = require(__vrender__);
const UIBase = require("./UIBase");


const Utils = VRender.Utils;

const UIItems = UIBase.extend(module, {
	getViewData: function () {
		// 数据为数据集，一般为数组，用作子选项显示
	},
	// setViewData: function (data) {
	// 	this.options.data = data;
	// },

	getKeyField: function () {
		return this.options.keyField;
	},
	setKeyField: function (value) {
		this.options.keyField = value;
	},

	getLabelField: function () {
		return this.options.labelField;
	},
	setLabelField: function (value) {
		this.options.labelField = value;
	},

	getLabelFunction: function () {
		return this.options.labelFunction;
	},
	setLabelFunction: function (value) {
		this.options.labelFunction = value;
	},

	getItemRenderer: function () {
		return this.options.itemRenderer || this.options.renderer;
	},
	setItemRenderer: function (value) {
		this.options.itemRenderer = value;
		delete this.options.renderer;
	},

	addItem: function (item, index) {
		if (!Utils.isArray(this.options.data))
			this.options.data = Utils.toArray(this.options.data);
		index = (isNaN(index) || index === "") ? -1 : parseInt(index);
		if (index < 0 || index >= this.options.data.length)
			this.options.data.push(item);
		else 
			this.options.data.splice(index, 0, item);
	},

	updateItem: function (item, index) {
		index = (isNaN(index) || index === "") ? -1 : parseInt(index);
		if (index >= 0) {
			let datas = Utils.toArray(this.options.data);
			if (index < datas.length)
				datas[index] = item;
		}
	},

	removeItemAt: function (index) {
		index = parseInt(index);
		if (!isNaN(index) && index >= 0) {
			let datas = Utils.toArray(this.options.data);
			if (index < datas.length) {
				let item = datas.splice(index, 1);
				return item && item[0];
			}
		}
		return null;
	},

	getLoadingView: function () {
		return this.options.loadingView;
	},
	
	setLoadingView: function (value) {
		this.options.loadingView = value;
	},

	getLoadingText: function () {
		return this.options.loadingText;
	},

	setLoadingText: function (value) {
		this.options.loadingText = value;
	},

	getEmptyView: function () {
		return this.options.emptyView;
	},

	setEmptyView: function (value) {
		this.options.emptyView = value;
	},

	getEmptyText: function () {
		return this.options.emptyText;
	},

	setEmptyText: function (value) {
		this.options.emptyText = value;
	}
});
