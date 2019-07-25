// ========================================================
// 数据表格
// 可选属性：columns, chkbox/showCheckbox, multi/multiple, selectedIndex(s), 
// 	selectedId(s), selectedItem(s), empty, showHeader, columnRenderer/renderer,
// 	styleFunction/rowStyleFunction, dataMapper/mapper, dataAdapter/adapter,
// 	pager/paginator, searcher, idField
// @author shicy <shicy85@163.com>
// Create on 2019-07-24
// ========================================================

const VRender = require(__vrender__);
const UISelectable = require("../../common/UISelectable");
const Renderer = require("./render");


const Utils = VRender.Utils;

const UITabbar = UISelectable.extend(module, {
	renderView: function () {
		UITabbar.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	getColumns: function () {
		return this.options.columns;
	},
	setColumns: function (value) {
		this.options.columns = value;
	},

	isChkboxVisible: function () {
		return Utils.isTrue(this.options.chkbox);
	},
	setChkboxVisible: function (bool) {
		this.options.chkbox = bool;
	},

	isHeaderVisible: function () {
		if (this.options.hasOwnProperty("showHeader"))
			return Utils.isTrue(this.options.showHeader);
		return true;
	},
	setHeaderVisible: function (bool) {
		this.options.showHeader = bool;
	},

	getHeadRenderer: function () {
		return this.options.headRenderer;
	},
	setHeadRenderer: function (value) {
		this.options.headRenderer = value;
	},

	getColumnRenderer: function () {
		return this.options.columnRenderer;
	},
	setColumnRenderer: function (value) {
		this.options.columnRenderer = value;
	},

	getRowStyleFunction: function () {
		return this.options.rowStyleFunction;
	},
	setRowStyleFunction: function (value) {
		this.options.rowStyleFunction = value;
	},

	getCellStyleFunction: function () {
		return this.options.cellStyleFunction;
	},
	setCellStyleFunction: function (value) {
		this.options.cellStyleFunction = value;
	},

	getSortFunction: function () {
		return this.options.sortFunction;
	},
	setSortFunction: function (value) {
		this.options.sortFunction = value;
	},

	getFilterFunction: function () {
		return this.options.filterFunction;
	},
	setFilterFunction: function (value) {
		this.options.filterFunction = value;
	},

	getExpandCols: function () {
		return parseInt(this.options.expandcols);
	},
	setExpandCols: function (value) {
		this.options.expandcols = value;
	},

	getExpandRenderer: function () {
		return this.options.expandRenderer;
	},
	setExpandRenderer: function (value) {
		this.options.expandRenderer = value;
	},

	getPaginator: function () {
		return this.options.paginator || this.options.pager;
	},
	setPaginator: function (value) {
		this.options.paginator = value;
		delete this.options.pager;
	}
});