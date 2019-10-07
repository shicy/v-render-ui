// 2019-07-24
// table(原datagrid)

(function (frontend) {
	if (frontend && VRender.Component.ui.table)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	const dateFormats = {date: "yyyy-MM-dd", datetime: "yyyy-MM-dd HH:mm:ss", time: "HH:mm:ss"};
	const defaultIcons = {asc: "/vrender-ui/icons/020c.png", desc: "/vrender-ui/icons/021c.png"};

	///////////////////////////////////////////////////////
	const UITable = UI.table = function (view, options) {
		return UI._select.call(this, view, options);
	};
	const _UITable = UITable.prototype = new UI._select(false);

	_UITable.init = function (target, options) {
		UI._select.init.call(this, target, options);

		this.__columns = this.getColumns(); // 解析一次
		// console.log(this.__columns);
		
		target = this.$el;
		let ghead = this.gridHead = target.children(".table").children("header").children();
		let gbody = this.gridBody = target.children(".table").children("section").children();

		let isApp = this._isRenderAsApp();
		let clickName = isApp ? "tap" : "click";

		ghead.on(clickName, "th.col-chk", allChkboxClickHandler.bind(this));

		gbody.on(clickName, "tr", itemClickHandler.bind(this));
		gbody.on(clickName, "td.col-exp .expbtn", onExpandBtnHandler.bind(this));

		if (isApp) {
			ghead.on(clickName, "th", headTouchHandler.bind(this));

			target.on(clickName, ".sort-and-filter", sortAndFilterClickHandler.bind(this));
			target.on(clickName, ".sort-and-filter .item", sortAndFilterItemHandler.bind(this));
			target.on(clickName, ".sort-and-filter input", sortAndFilterInputClickHandler.bind(this));
			target.on(clickName, ".sort-and-filter .clearbtn", sortAndFilterClearHandler.bind(this));
			target.on(clickName, ".sort-and-filter .submitbtn", sortAndFilterSubmitHandler.bind(this));
			target.on("keyup", ".sort-and-filter input", sortAndFilterInputKeyHandler.bind(this));
		}
		else {
			ghead.on(clickName, ".toolbar > *", toolbtnClickHandler.bind(this));
			ghead.on(clickName, ".toolbar .dropdown li", toolDropdownClickHandler.bind(this));
			ghead.on("mouseenter", ".toolbar > *", toolbtnMouseHandler.bind(this));
			ghead.on("mouseleave", ".toolbar > *", toolbtnMouseHandler.bind(this));
		}

		doInit.call(this);

		this.renderComplete = true;
	};

	// ====================================================
	_UITable.getData = function (isOriginal) {
		if (isOriginal) { // 这是没有排序、筛选过的数据集
			this.options.data = this._doAdapter(this.options.data);
			return this.options.data;
		}

		let datas = this.getData(true);
		return Utils.map(this._getItems(), (item) => {
			let data = item.data("itemData");
			if (!data) {
				let index = parseInt(item.attr("opt-ind")) || 0;
				data = datas[index];
			}
			return data;
		});
	};
	_UITable.setData = function (value) {
		let snapshoot = this._snapshoot();

		this.options.data = this._doAdapter(value);
		UI._select.setSelectedIndex.call(this, []);

		this._getItems().removeClass("selected").removeClass("expand");
		rerenderItems.call(this);

		snapshoot.done([], []);
	};

	_UITable.getColumns = function () {
		if (this.options.hasOwnProperty("columns"))
			return this.options.columns;

		let getFunc = (value) => {
			return (new Function("var Utils=VRender.Utils;return (" + unescape(value) + ");"))();
		};

		let columns = this.$el.children("[name='columns']");
		if (columns && columns.length > 0) {
			try {
				columns = JSON.parse(columns.remove().attr("data"));
				Utils.each(columns, (column) => {
					if (column.html)
						column.html = unescape(column.html);

					if (/^function/.test(column.sortable)) {
						column.sortable = getFunc(column.sortable);
					}
					else if (Utils.isArray(column.sortable)) {
						Utils.each(column.sortable, (temp) => {
							if (/^function/.test(temp.handler))
								temp.handler = getFunc(temp.handler);
						});
					}
					if (/^function/.test(column.sortFunction))
						column.sortFunction = getFunc(column.sortFunction);
					
					if (/^function/.test(column.filter))
						column.filter = getFunc(column.filter);
					else if (Utils.isArray(column.filter)) {
						Utils.each(column.filter, (temp) => {
							if (/^function/.test(temp.handler))
								temp.handler = getFunc(temp.handler);
						});
					}
					if (/^function/.test(column.filterFunction))
						column.filterFunction = getFunc(column.filterFunction);
				});
			}
			catch (e) {
				columns = [];
			};
		}
		else {
			columns = [];
		}

		this.options.columns = columns;
		return this.options.columns;
	};
	_UITable.setColumns = function (value) {
		this.options.columns = getFormatColumns(value);
		let columns = this.__columns = this.options.columns;

		if (this.currentSort && this.currentSort.name) {
			let column = Utils.findBy(columns, "name", this.currentSort.name);
			if (column && Utils.isTrue(column.sortable) && column.sortType == this.currentSort.type) {
				this.currentSort.column = column;
			}
			else
				this.currentSort = null;
		}

		if (this.currentFilters) {
			Utils.remove(this.currentFilters, (filter) => {
				if (filter.name) {
					let column = Utils.findBy(columns, "name", filter.name);
					if (column)
						filter.column = column;
					else
						return true; // 删除不存在的列
				}
			});
		}

		rerender.call(this);
	};

	_UITable.isHeaderVisible = function () {
		return !this.$el.is(".no-head");
	};
	_UITable.setHeaderVisible = function (value) {
		if (Utils.isNull(value) || Utils.isTrue(value)) {
			if (!this.isHeaderVisible()) {
				this.$el.removeClass("no-head");
				rerenderHeader.call(this);
			}
		}
		else if (this.isHeaderVisible()) {
			this.$el.addClass("no-head");
			rerenderHeader.call(this);
		}
	};

	_UITable.isChkboxVisible = function () {
		return this.$el.attr("opt-chk") == "1";
	};
	_UITable.setChkboxVisible = function (value) {
		if (Utils.isNull(value) || Utils.isTrue(value)) {
			if (!this.isChkboxVisible()) {
				this.$el.attr("opt-chk", "1");
				rerender.call(this);
			}
		}
		else if (this.isChkboxVisible()) {
			this.$el.removeAttr("opt-chk");
			rerender.call(this);
		}
	};

	// itemRenderer 即行渲染，也即tr，不能修改，设置无效
	_UITable.getItemRenderer = function () {
		return Renderer.rowRenderer;
	};
	_UITable.setItemRenderer = function (value) {
		// 设置无效，默认是 Renderer.rowRenderer;
	};

	_UITable.getHeadRenderer = function () {
		return Fn.getFunction.call(this, "headRenderer", "hrender");
	};
	_UITable.setHeadRenderer = function (value) {
		let _changed = this.getHeadRenderer() != value;
		this.options.headRenderer = value;
		if (_changed)
			rerenderHeader.call(this);
	};

	_UITable.getColumnRenderer = function () {
		if (this.options.hasOwnProperty("renderer"))
			return this.options.renderer;
		return Fn.getFunction.call(this, "columnRenderer", "crender");
	};
	_UITable.setColumnRenderer = function (value) {
		let _changed = this.getColumnRenderer() != value;
		this.options.columnRenderer = value;
		delete this.options.renderer;
		if (_changed)
			rerenderItems.call(this);
	};

	_UITable.getExpandRenderer = function () {
		return Fn.getFunction.call(this, "expandRenderer", "erender");
	};
	_UITable.setExpandRenderer = function (value) {
		let _changed = this.getExpandRenderer() != value;
		this.options.expandRenderer = value;
		if (_changed) {
			let itemContainer = this._getItemContainer();
			itemContainer.children(".row-expand").remove();
			let expandRows = itemContainer.children(".expand").removeClass("expand");
			expandRows.children(".col-exp").children(".expbtn").trigger("tap"); // 重新打开
		}
	};

	_UITable.getExpandColspan = function () {
		return parseInt(this.$el.attr("opt-expcols")) || 0;
	};
	_UITable.setExpandColsapn = function (value) {
		if (!isNaN(value) && (value || value === 0)) {
			value = parseInt(value);
			if (!isNaN(value) && value > 0 && this.getExpandColspan() != value) {
				this.$el.attr("opt-expcols", value);
				let itemContainer = this._getItemContainer();
				itemContainer.children(".row-expand").remove();
				let expandRows = itemContainer.children(".expand").removeClass("expand");
				expandRows.children(".col-exp").children(".expbtn").trigger("tap"); // 重新打开
			}
		}
	};

	_UITable.getRowStyleFunction = function () {
		return Fn.getFunction.call(this, "rowStyleFunction", "rstyle");
	};
	_UITable.setRowStyleFunction = function (value) {
		let _changed = this.getRowStyleFunction() != value;
		this.options.rowStyleFunction = value;
		if (_changed)
			rerenderItems.call(this);
	};

	_UITable.getCellStyleFunction = function () {
		return Fn.getFunction.call(this, "cellStyleFunction", "cstyle");
	};
	_UITable.setCellStyleFunction = function () {
		let _changed = this.getCellStyleFunction() != value;
		this.options.cellStyleFunction = value;
		if (_changed)
			rerenderItems.call(this);
	};

	delete _UITable.getLabelField;
	delete _UITable.setLabelField;
	delete _UITable.getLabelFunction;
	delete _UITable.setLabelFunction;
	delete _UITable.setItemRenderer;
	
	// ====================================================
	_UITable.sort = function (column, type, sortFunction) {
		if (Utils.isFunction(column)) {
			sortFunction = column;
			column = type = null;
		}
		if (Utils.isFunction(type)) {
			sortFunction = type;
			type = null;
		}
		if (column)
			column = getColumnInfo.call(this, ("" + column));
		doSort.call(this, column, type, sortFunction);
	};

	_UITable.filter = function (column, value, filterFunction) {
		if (Utils.isFunction(column)) {
			filterFunction = column;
			column = value = null;
		}
		if (Utils.isFunction(value)) {
			filterFunction = value;
			value = null;
		}
		if (column)
			column = getColumnInfo.call(this, ("" + column));
		doFilter.call(this, column, value, filterFunction);
	};
	

	// ====================================================
	_UITable.addItem = function (data, index) {
		if (Utils.isNull(data))
			return ;
		index = Utils.getIndexValue(index);

		let datas = this.getData(true);
		data = Fn.doAdapter.call(this, data, index);

		if (index >= 0 && index < datas.length) {
			datas.splice(index, 0, data);
		}
		else {
			datas.push(data);
		}

		let snapshoot = this._snapshoot();
		rerenderItems.call(this);
		snapshoot.done();
	};

	_UITable.updateItem = function (data, index) {
		if (Utils.isNull(data))
			return ;

		let datas = this.getData(true);

		if (!index && index !== 0) {
			data = Fn.doAdapter.call(this, data);
			index = this.getDataRealIndex(data, datas);
		}
		else {
			index = Utils.getIndexValue(index);
			data = Fn.doAdapter.call(this, data, index);
		}

		if (index >= 0) {
			datas.splice(index, 1, data);
			let snapshoot = this._snapshoot(); // 可能被筛选或排序
			rerenderItems.call(this);
			snapshoot.done();
		}
	};

	_UITable.removeItem = function (data) {
		if (Utils.isNotNull(data))
			this.removeItemAt(this.getDataRealIndex(data));
	};

	_UITable.removeItemAt = function (index) {
		index = Utils.getIndexValue(index);
		if (index >= 0) {
			let datas = this.getData(true);
			if (index < datas.length) {
				let removedData = datas.splice(index, 1);

				let snapshoot = this._snapshoot();
				rerenderItems.call(this);
				snapshoot.done();
			}
		}
	};

	_UITable.addOrUpdateItem = function (data) {
		let index = this.getDataRealIndex(data);
		if (index >= 0)
			this.updateItem(data, index);
		else
			this.addItem(data, index);
	};

	_UITable.getDataRealIndex = function (data, datas) {
		datas = datas || this.getData(true);
		if (datas && datas.length > 0) {
			let id = this._getDataKey(data);
			return Utils.index(datas, (temp) => {
				return temp == data || this._getDataKey(temp) == id;
			});
		}
		return -1;
	};

	_UITable.rerender = function () {
		rerender.call(this);
	};

	// ====================================================
	_UITable._getItemContainer = function () {
		if (!this.itemContainer) {
			let target = this.$el.children(".table").children("section").children();
			this.itemContainer = target.children("table").children("tbody");
		}
		return this.itemContainer;
	};

	_UITable._getNewItem = function ($, itemContainer, data, index) {
		return $("<tr class='table-row'></tr>").appendTo(itemContainer);
	};

	_UITable._getItemData = function (item) {
		let data = item.data("itemData");
		if (!data) {
			let datas = this.getData(true);
			if (Utils.isArray(datas) && datas.length > 0) {
				let index = parseInt(item.attr("opt-ind"));
				if (!isNaN(index) && index >= 0)
					return datas[index];
			}
		}
		return data;
	};

	_UITable._getSortFunction = function (column, type) {
		return getSortFunction.call(this, column, type);
	};

	_UITable._getFilterFunction = function (column, value) {
		return getFilterFunction.call(this, column, value);
	};

	_UITable._hasExpand = function () {
		return Utils.index(this.__columns, (column) => {
			return !!column.expand;
		}) >= 0;
	};

	_UITable._snapshoot_change = function () {
		selectedChanged.call(this);
	};

	// ====================================================
	const itemClickHandler = function (e) {
		let item = $(e.currentTarget);
		if (item.parent().is(this._getItemContainer())) {
			if (item.is(".disabled") || this.isDisabled())
				return ;

			let event = {type: "itemclick", detail: this._getItemData(item), target: e.target};
			this.trigger(event);

			if (!event.isPreventDefault) {
				if (item.is(".selected")) {
					item.removeClass("selected");
				}
				else {
					item.addClass("selected");
					if (!this.isMultiple())
						item.siblings().removeClass("selected");
				}

				selectedChanged.call(this);
			}
		}
	};

	const headTouchHandler = function (e) {
		let col = $(e.currentTarget);
		let colName = col.attr("col-name");
		let column = colName && getColumnInfo.call(this, colName);
		if (column) {
			if (column.filter || Utils.isArray(column.sortable))
				showSortAndFilterDialog.call(this, column, col);
			else if (column.sortable) {
				let sortType = col.attr("opt-sort");
				sortType = sortType == "desc" ? null : (sortType == "asc" ? "desc" : "asc");
				doSort.call(this, column, sortType);
			}
		}
	};

	const allChkboxClickHandler = function (e) {
		if (this.isDisabled())
			return ;
		let header = this.gridHead.find("tr");
		let selectedIndex = [];
		if (header.is(".selected")) {
			header.removeClass("selected");
		}
		else {
			header.addClass("selected");
			for (let i = 0, l = this.length(); i < l; i++) {
				selectedIndex.push(i);
			}
		}
		this.setSelectedIndex(selectedIndex);
	};

	const onExpandBtnHandler = function (e) {
		let item = $(e.currentTarget).parent().parent();
		if (item.parent().is(this._getItemContainer())) {
			if (item.is(".disabled"))
				return false;

			if (item.is(".expand")) {
				item.removeClass("expand");
				item.next().remove();
			}
			else {
				item.addClass("expand");
				let index = parseInt(item.attr("opt-ind")) || 0;
				let data = this._getItemData(item, index);
				renderExpandView.call(this, $, item, data, index);
			}

			return false;
		}
	};

	const toolbtnClickHandler = function (e) {
		let btn = $(e.currentTarget);
		let col = btn.parent().parent();
		let column = getColumnInfo.call(this, col.attr("col-name"));

		let dropdown = btn.children(".dropdown");
		if (dropdown && dropdown.length > 0) {
			btn.addClass("show-dropdown");
			if (dropdown.is(".ipt")) {
				let input = dropdown.find("input").focus();
				input.off("keydown").on("keydown", filterInputKeyHandler.bind(this));
			}
		}
		else if (btn.is(".sort")) {
			let sortType = col.attr("opt-sort");
			sortType = sortType == "desc" ? null : (sortType == "asc" ? "desc" : "asc");
			doSort.call(this, column, sortType);
		}
		else if (btn.is(".filter")) {
			// 默认都有 dropdown
		}
	};

	const toolbtnMouseHandler = function (e) {
		let btn = $(e.currentTarget);
		let timerId = parseInt(btn.attr("opt-t")) || 0;
		if (timerId) {
			clearTimeout(timerId);
			btn.removeAttr("opt-t");
		}
		if (e.type == "mouseleave") {
			timerId = setTimeout(() => {
				btn.removeClass("show-dropdown");
				btn.removeAttr("opt-t");
				if (btn.is(".filter")) {
					let input = btn.find("input");
					if (input && input.length > 0)
						VRender.onInputChange(input, null);
				}
			}, 400);
			btn.attr("opt-t", timerId);
		}
	};

	const toolDropdownClickHandler = function (e) {
		let item = $(e.currentTarget);
		let toolbtn = item.parent().parent();
		let col = toolbtn.parent().parent();
		let column = getColumnInfo.call(this, col.attr("col-name"));

		let timerId = parseInt(toolbtn.attr("opt-t")) || 0;
		if (timerId)
			clearTimeout(timerId);
		toolbtn.removeClass("show-dropdown").removeAttr("opt-t");

		if (toolbtn.is(".sort")) {
			doSort.call(this, column, (item.is(".selected") ? null : item.attr("data-type")));
		}
		else if (toolbtn.is(".filter")) {
			doFilter.call(this, column, (item.is(".selected") ? null : item.attr("data-val")));
		}

		return false;
	};

	const filterInputKeyHandler = function (e) {
		if (e.which == 13) {
			let input = $(e.currentTarget);
			let colName = Utils.parentUntil(input, "th").attr("col-name");
			if (colName) {
				let column = getColumnInfo.call(this, colName);
				doFilter.call(this, column, input.val() || null);
			}
		}
	};

	const sortAndFilterClickHandler = function (e) {
		if ($(e.target).is(".sort-and-filter")) {
			hideSortAndFilterDialog.call(this);
			return false;
		}
	};

	const sortAndFilterItemHandler = function (e) {
		let item = $(e.currentTarget);
		let column = this.$el.children(".sort-and-filter").data("column");
		if (item.parent().parent().is(".sort")) {
			let sortType = item.is(".selected") ? null : item.attr("data-type");
			doSort.call(this, column, sortType);
		}
		else {
			let filterValue = item.is(".selected") ? null : item.attr("data-val");
			doFilter.call(this, column, filterValue);
		}
		hideSortAndFilterDialog.call(this);
	};

	const sortAndFilterInputClickHandler = function (e) {
		this.$el.children(".sort-and-filter").addClass("inputing");
	};

	const sortAndFilterClearHandler = function (e) {
		let target = this.$el.children(".sort-and-filter");
		let input = target.find("input").val("");
		if (target.is(".inputing")) {
			setTimeout(() => {
				input.focus();
			}, 0);
		}
	};

	const sortAndFilterSubmitHandler = function (e) {
		let target = this.$el.children(".sort-and-filter");
		let column = target.data("column");
		let filterValue = target.find("input").val() || null;
		doFilter.call(this, column, filterValue);
		hideSortAndFilterDialog.call(this);
	};
	
	const sortAndFilterInputKeyHandler = function (e) {
		if (e.which == 13) {
			this.$el.children(".sort-and-filter").find(".submitbtn").tap();
		}
	};
	
	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._selectRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._selectRender(false);

	// 行渲染
	Renderer.rowRenderer = function ($, item, data, index) {
		renderRow.call(this, $, item, this.__columns, data, index);
	};
	Renderer.rowRenderer._state = 1; // 内部渲染器标志

	// ====================================================
	_Renderer.render = function ($, target) {
		target.addClass("ui-table");

		let height = Utils.getFormatSize(this.options.height, this._isRenderAsRem());
		if (height) {
			target.attr("opt-fixed", "1").css("height", height);
		}

		if (this.isChkboxVisible())
			target.attr("opt-chk", "1");

		let expandColspan = parseInt(this.options.expandcols);
		if (expandColspan)
			target.attr("opt-expcols", expandColspan);

		let table = $("<div class='table'></div>").appendTo(target);
		table.append("<header><div></div></header>");
		table.append("<section><div><table><thead></thead><tbody></tbody></table></div></section>");

		let columns = this.__columns = this.getColumns();

		UI._selectRender.render.call(this, $, target);
		renderHeader.call(this, $, target, columns);
		renderOthers.call(this, $, target, columns);

		this.renderComplete = true; // 首次渲染完成
		return this;
	};

	// ====================================================
	_Renderer.getColumns = function () {
		return getFormatColumns(this.options.columns);
	};

	_Renderer.isChkboxVisible = function () {
		return Utils.isTrue(this.options.chkbox);
	};

	_Renderer.isHeaderVisible = function () {
		if (this.options.hasOwnProperty("showHeader"))
			return Utils.isTrue(this.options.showHeader);
		return true;
	};

	_Renderer.getHeadRenderer = function () {
		return this.options.headRenderer;
	};

	_Renderer.getColumnRenderer = function () {
		return this.options.columnRenderer || this.options.renderer;
	};

	_Renderer.getExpandRenderer = function () {
		return this.options.expandRenderer;
	};

	_Renderer.getRowStyleFunction = function () {
		return this.options.rowStyleFunction;
	};

	_Renderer.getCellStyleFunction = function () {
		return this.options.cellStyleFunction;
	};

	_Renderer.getItemRenderer = function () {
		return Renderer.rowRenderer;
	};

	// ====================================================
	_Renderer._getItemContainer = function ($, target) {
		target = target.children(".table").children("section").children();
		return target.children("table").children("tbody");
	};

	_Renderer._getNewItem = function ($, itemContainer, data, index) {
		return $("<tr class='table-row'></tr>").appendTo(itemContainer);
	};

	_Renderer._renderItems = function ($, target) {
		let datas = this.getData();
		let hasFilterOrSort = false;
		let _indexs = null;
		let _datas = [].concat(datas); // 下面需要排序、筛选，保证原数据集不变

		if (datas && datas.length > 0) {
			// doFilter
			Utils.each(this.__columns, (column) => {
				if (Utils.isTrue(column.filter) && Utils.isNotBlank(column.filterValue)) {
					let filterFunction = this._getFilterFunction(column, column.filterValue);
					_datas = Utils.filter(_datas, (data, i) => {
						return filterFunction(column, data, column.filterValue);
					});
					hasFilterOrSort = true;
				}
			});
			// doSort
			let sortColumn = Utils.find(this.__columns, (column) => {
				return Utils.isTrue(column.sortable) && column.sortType;
			});
			if (sortColumn) {
				let sortFunction = this._getSortFunction(sortColumn, sortColumn.sortType);
				_datas.sort((a, b) => {
					return sortFunction(sortColumn, a, b, sortColumn.sortType);
				});
				hasFilterOrSort = true;
			}
		}

		if (hasFilterOrSort) {
			// 获取对象在原数据集中的索引
			_indexs = Utils.map(_datas, (data) => {
				return Utils.index(datas, (temp) => (temp == data));
			});
		}

		this._renderDatas = _datas;
		renderItems.call(this, $, target, _datas, _indexs);
	};

	_Renderer._renderEmptyView = function ($, target) {
		UI._itemsRender.renderEmptyView.call(this, $, target);
	};

	_Renderer._renderLoadView = function ($, target) {
		UI._itemsRender.renderLoadView.call(this, $, target);
	}

	_Renderer._getSortFunction = function (column, type) {
		return getSortFunction.call(this, column, type);
	};

	_Renderer._getFilterFunction = function (column, value) {
		return getFilterFunction.call(this, column, value);
	};

	_Renderer._hasExpand = function () {
		return Utils.index(this.__columns, (column) => {
			return !!column.expand;
		}) >= 0;
	};
	
	// ====================================================
	const renderHeader = function ($, target, columns) {
		if (this.isHeaderVisible()) {
			let isApp = this._isRenderAsApp();

			target = target.removeClass("no-head").children(".table");
			let thead = target.children("section").children().children("table").children("thead").empty();
			let row = $("<tr></tr>").appendTo(thead);
			if (this.isAllSelected(this._renderDatas || []))
				row.addClass("selected");

			if (this._hasExpand() && !isApp) 
				row.append("<th class='col-exp'></th>");
			if (this.isChkboxVisible())
				row.append("<th class='col-chk'><span class='chkbox'></span></th>");

			Utils.each(columns, (column, i) => {
				if (column.expand)
					return ;

				let col = $("<th></th>").appendTo(row);

				col.addClass("col-" + i);
				if (Utils.isNotBlank(column.name))
					col.attr("col-name", column.name);//.addClass("col-name-" + column.name);
				if (Utils.isNotBlank(column.dataType))
					col.attr("col-type", column.dataType);

				let width = Utils.getFormatSize(column.width, this._isRenderAsRem());
				if (width)
					col.css("width", width);

				renderHeaderView.call(this, $, col, column, i);
				renderHeaderToolbar.call(this, $, col, column, i);
			});

			if (this._hasExpand() && isApp)
				row.append("<th class='col-exp'></th>");

			// 固定表头
			let header = target.children("header").children().empty();
			if (!frontend)
				header.write("<table><thead>" + thead.html() + "</thead></table>");
			else
				header.html("<table><thead>" + thead.html() + "</thead></table>");

			row.find(".dropdown").remove();
		}
		else {
			target.addClass("no-head");
		}
	};

	const renderHeaderView = function ($, col, column, index) {
		if (!column.html) {
			let headRenderer = this.getHeadRenderer();
			if (Utils.isFunction(headRenderer)) {
				let headView = headRenderer(column, index);
				if (headView) {
					if (!frontend && Utils.isFunction(headView.render))
						headView.render(col);
					else
						col.append(headView.$el || headView);
					return ;
				}
			}
		}

		if (column.icon)
			$("<i>&nbsp;</i>").appendTo(col).css("backgroundImage", "url(" + column.icon + ")");

		let title = $("<div class='title'></div>").appendTo(col);
		if (column.html)
			title.html(column.html);
		else
			title.text(column.title || column.name || ("列 " + (index + 1)));
	};

	const renderHeaderToolbar = function ($, col, column, index) {
		if (column.sortable || column.filter) {
			let toolbar = $("<div class=toolbar></div>").appendTo(col);

			if (column.sortable) {
				if (column.sortType)
					col.attr("opt-sort", column.sortType);
				renderSortView.call(this, $, toolbar, column);
			}

			if (column.filter) {
				if (column.filterValue)
					col.attr("opt-filter", column.filterValue);
				renderFilterView.call(this, $, toolbar, column);
			}
		}
	};

	const renderSortView = function ($, toolbar, column) {
		let sortTarget = $("<div class='sort'><i title='排序'></i></div>").appendTo(toolbar);
		if (!this._isRenderAsApp()) {
			if (Utils.isArray(column.sortable) && column.sortable.length > 0) {
				renderToolDropdown.call(this, $, sortTarget, column.sortable, column.sortType, "无");
			}
		}
	};

	const renderFilterView = function ($, toolbar, column) {
		let filterTarget = $("<div class='filter'><i title='筛选'></i></div>").appendTo(toolbar);

		let filterType = column.filter;
		if (filterType == "enum") {
			filterType = getColumnValueSet.call(this, column);
			if (!(filterType && filterType.length > 0))
				filterType = [{label: "无选项", value: ""}];
			else {
				filterType = Utils.map(filterType, (tmp) => {
					return {label: tmp, value: tmp};
				});
			}
		}

		if (!this._isRenderAsApp()) {
			if (Utils.isArray(filterType)) {
				renderToolDropdown.call(this, $, filterTarget, filterType, column.filterValue, "空");
			}
			else {
				let dropdown = $("<div class='dropdown ipt'></div>").appendTo(filterTarget);
				let input = $("<input/>").appendTo(dropdown);
				if (column.filterValue)
					input.val(column.filterValue);
			}
		}
	};

	const renderToolDropdown = function ($, toolBtn, items, value, defLbl) {
		let dropdown = $("<ul class='dropdown'></ul>").appendTo(toolBtn);
		Utils.each(items, (data) => {
			let item = $("<li></li>").appendTo(dropdown);

			let bSelected = false;
			if (data.hasOwnProperty("type")) {
				item.attr("data-type", data.type);
				bSelected = data.type == value;
			}
			if (data.hasOwnProperty("value")) {
				item.attr("data-val", data.value);
				bSelected = data.value == value;
			}

			let icon = $("<i></i>").appendTo(item);
			let iconUrl = data.icon || defaultIcons[data.type];
			if (iconUrl)
				icon.css("backgroundImage", "url(" + iconUrl + ")");

			$("<span></span>").appendTo(item).text(data.label || defLbl);

			if (bSelected) {
				item.addClass("selected");
				let _icon = toolBtn.children("i");
				if (iconUrl)
					_icon.css("backgroundImage", "url(" + iconUrl + ")");
				if (data.label)
					_icon.attr("title", data.label);
			}
		});
	};

	// ====================================================
	// indexs 是 datas 在原数据集中相应的索引
	const renderItems = function ($, target, datas, indexs, selectedIndexs) {
		let itemContainer = this._getItemContainer($, target).empty();

		let selectedIndex = selectedIndexs || this.getSelectedIndex(true);
		let selectedId = this.getSelectedKey(true) || [];
		
		// let items = this._render_items = [];
		Utils.each(datas, (data, i) => {
			let index = indexs ? indexs[i] : i; // 在源数据集中的索引
			let item = this._getNewItem($, itemContainer, data, index);
			if (item) {
				// items.push({item: item, data: data, index: i});
				this._renderOneItem($, item, data, index);
				// 这里还是要用原始的索引的，否则渲染的数据可能就是错的
				let bSelected = this._isSelected(data, i, selectedIndex, selectedId);
				if (bSelected)
					item.addClass("selected");
			}
		});
		// setTimeout(() => {
		// 	this._render_items = null;
		// }, 0);
	};

	const renderRow = function ($, row, columns, data, rowIndex) {
		row.attr("opt-ind", rowIndex);

		let isApp = this._isRenderAsApp();

		let rowStyleFunction = this.getRowStyleFunction();
		if (Utils.isFunction(rowStyleFunction)) {
			let styles = rowStyleFunction(data, rowIndex);
			if (styles)
				row.css(styles);
		}

		if (this._hasExpand() && !isApp)
			row.append("<td class='col-exp'><span class='expbtn'></span></td>");

		if (this.isChkboxVisible())
			row.append("<td class='col-chk'><span class='chkbox'></span></td>");

		Utils.each(columns, (column, i) => {
			if (!column.expand) {
				let col = $("<td></td>").appendTo(row);
				renderCell.call(this, $, col, column, data, rowIndex, i);
			}
		});

		if (this._hasExpand() && isApp)
			row.append("<td class='col-exp'><span class='expbtn'></span></td>");
	};

	const renderCell = function ($, col, column, data, rowIndex, colIndex) {
		let cellStyleFunction = this.getCellStyleFunction();
		if (Utils.isFunction(cellStyleFunction)) {
			let styles = cellStyleFunction(column.name, data, rowIndex, colIndex);
			if (styles)
				col.css(styles);
		}

		col.addClass("col-" + colIndex);
		if (Utils.isNotBlank(column.name))
			col.attr("col-name", column.name);

		let value = null;
		let columnRenderer = this.getColumnRenderer();
		if (Utils.isFunction(columnRenderer)) {
			value = columnRenderer(column.name, data, rowIndex, colIndex, column);
		}
		if (Utils.isNull(value)) {
			value = getDefaultValue.call(this, column, data, colIndex);
		}
		if (Utils.isBlank(value))
			value = "&nbsp;";

		if (!frontend && Utils.isFunction(value.render)) {
			value.render(col);
		}
		else {
			col.append(value.$el || value);
		}
	};

	const renderOthers = function ($, target, columns) {
		if (!frontend) {
			let _columns = Utils.map(columns, (temp) => {
				let column = Utils.extend({}, temp);

				if (column.html)
					column.html = escape(column.html);

				if (Utils.isFunction(column.sortFunction))
					column.sortFunction = escape(column.sortFunction);
				else if (Utils.isArray(column.sortable)) {
					Utils.each(column.sortable, (tmp) => {
						if (Utils.isFunction(tmp.handler))
							tmp.handler = escape(tmp.handler);
					});
				}

				if (Utils.isFunction(column.filterFunction))
					column.filterFunction = escape(column.filterFunction);
				else if (Utils.isArray(column.filter)) {
					Utils.each(column.filter, (tmp) => {
						if (Utils.isFunction(tmp.handler))
							tmp.handler = escape(tmp.handler);
					});
				}

				return column;
			});
			target.write("<div class='ui-hidden' name='columns' data='" + JSON.stringify(_columns) + "'></div>");

			Fn.renderFunction(target, "hrender", this.getHeadRenderer());
			Fn.renderFunction(target, "crender", this.getColumnRenderer());
			Fn.renderFunction(target, "erender", this.getExpandRenderer());
			Fn.renderFunction(target, "rstyle", this.getRowStyleFunction());
			Fn.renderFunction(target, "cstyle", this.getCellStyleFunction());
		}
	};

	const renderExpandView = function ($, row, data, rowIndex) {
		let expandRow = $("<tr class='row-expand'></tr>").insertAfter(row);
		let expandCell = $("<td></td>").appendTo(expandRow);
		expandCell.attr("colspan", row.children().length);
		let container = $("<div class='container'></div>").appendTo(expandCell);

		let expandRender = this.getExpandRenderer();
		if (Utils.isFunction(expandRender)) {
			let expandView = expandRender(data, rowIndex);
			if (Utils.isNotNull(expandView)) {
				container.append(expandView.$el || expandView);
			}
		}
		else {
			let expandView = $("<div class='table-expand'></div>").appendTo(container);
			expandView.attr("cols", this.getExpandColspan());
			Utils.each(this.__columns, (column, i) => {
				if (Utils.isTrue(column.expand)) {
					let item = $("<div></div>").appendTo(expandView);
					item.addClass("col-" + i).attr("col-name", column.name);
					item = $("<dl></dl>").appendTo(item);
					$("<dt></dt>").appendTo(item).text(column.title || column.name || "");
					let content = $("<dd></dd>").appendTo(item);
					renderCell.call(this, $, content, column, data, rowIndex, i);
					item.removeClass("col-" + i).removeAttr("col-name");
				}
			});
		}
	};

	// ====================================================
	const rerender = function () {
		if (this.t_rerender) {
			clearTimeout(this.t_rerender);
			this.t_rerender = 0;
		}
		if (this.t_rerenderheader) {
			clearTimeout(this.t_rerenderheader);
			this.t_rerenderheader = 0;
		}
		if (this.t_rerenderitems) {
			clearTimeout(this.t_rerenderitems);
			this.t_rerenderitems = 0;
		}
		this.t_rerender = setTimeout(() => {
			this.t_rerender = 0;
			renderHeader.call(this, $, this.$el, this.__columns);
			renderBySortAndFilter.call(this, true);
		}, 0);
	};

	const rerenderHeader = function () {
		if (this.t_rerender)
			return ;
		if (this.t_rerenderheader) {
			clearTimeout(this.t_rerenderheader);
			this.t_rerenderheader = 0;
		}
		this.t_rerenderheader = setTimeout(() => {
			this.t_rerenderheader = 0;
			renderHeader.call(this, $, this.$el, this.__columns);
		}, 0);
	};

	const rerenderItems = function () {
		if (this.t_rerender)
			return ;
		if (this.t_rerenderitems) {
			clearTimeout(this.t_rerenderitems);
			this.t_rerenderitems = 0;
		}
		this.t_rerenderitems = setTimeout(() => {
			this.t_rerenderitems = 0;
			renderBySortAndFilter.call(this, true);
			rerenderEnumFilters.call(this);
		}, 0);
	};

	const rerenderEnumFilters = function () {
		if (this._isRenderAsApp())
			return ;
		Utils.each(getHeaders.call(this), (col) => {
			let colName = col.attr("col-name");
			if (colName) {
				let column = getColumnInfo.call(this, col.attr("col-name"));
				if (column && column.filter == "enum") {
					let filterBtn = col.find(".toolbar .filter");
					let filterItems = getColumnValueSet.call(this, column);
					let filterValue = col.attr("opt-filter");
					if (filterItems && filterItems.length > 0) {
						filterItems = Utils.map(filterItems, (tmp) => {
							return {label: tmp, value: tmp};
						});
					}
					else {
						filterItems = [{label: "无选项", value: ""}];
					}
					filterBtn.children(".dropdown").remove();
					renderToolDropdown.call(this, $, filterBtn, filterItems, filterValue, "空");
				}
			}
		});
	};

	///////////////////////////////////////////////////////
	const doInit = function () {
		this.$el.children("[name='irender']").remove();
		// selectedChanged.call(this);
		startLayoutChangeMonitor.call(this);
	};

	// 排序互斥，即只能有一个排序方法
	const doSort = function (column, sortType, sortFunction) {
		let cols = getHeaders.call(this);
		cols.removeAttr("opt-sort");
		cols.find(".sort > i").css("backgroundImage", "");
		cols.find(".sort .dropdown li").removeClass("selected");

		let isCustom = column && column.sortable == "custom";

		if (column && column.name && Utils.isNotNull(sortType)) {
			let col = cols.filter("[col-name='" + column.name + "']");
			if (col && col.length > 0) {
				col.attr("opt-sort", sortType);
				let icon = defaultIcons[sortType];
				if (Utils.isArray(column.sortable)) {
					if (!this._isRenderAsApp())
						col.find(".sort li[data-type='" + sortType + "']").addClass("selected");
					let sortItem = Utils.findBy(column.sortable, "type", sortType) || {};
					icon = sortItem.icon || icon;
					isCustom = Utils.isTrue(sortItem.custom);
				}
				if (icon)
					col.find(".sort > i").css("backgroundImage", "url(" + icon + ")");
			}
		}

		this.currentSort = {column: column, type: sortType, fn: sortFunction, name: (column && column.name)};
		if (Utils.isFunction(sortFunction)) {
			let _sortFunction = sortFunction;
			this.currentSort.fn = function (column, a, b, sortType) {
				return _sortFunction(a, b, sortType, column);
			};
		}
		else if (Utils.isNotNull(sortType) && !isCustom) {
			this.currentSort.fn = this._getSortFunction(column, sortType);
		}

		if (Utils.isFunction(this.currentSort.fn) || !isCustom) {
			renderBySortAndFilter.call(this);
		}

		this.trigger("sort", (column && column.name), sortType);
	};

	// 设置某一列筛选，不影响其他列筛选
	const doFilter = function (column, filterValue, filterFunction) {
		let isCustom = column && column.filter == "custom";
		let isNullValue = Utils.isNull(filterValue) || filterValue === false;
		if (column && column.name) {
			let cols = getHeaders.call(this);
			let col = cols.filter("[col-name='" + column.name + "']");
			if (col && col.length > 0) {
				col.removeAttr("opt-filter");
				col.find(".filter > i").css("backgroundImage", "");
				col.find(".filter li").removeClass("selected");
				if (!isNullValue || Utils.isFunction(filterFunction)) {
					col.attr("opt-filter", (isNullValue ? true : filterValue));
					if (!this._isRenderAsApp()) {
						if (col.find(".filter .dropdown").is(".ipt")) {
							col.find(".filter input").val(isNullValue ? "" : filterValue);
						}
						else if (!isNullValue) {
							col.find(".filter li[data-val='" + filterValue + "']").addClass("selected");
						}
					}
					if (Utils.isArray(column.filter)) {
						let filterItem = Utils.findBy(column.filter, "value", filterValue) || {};
						if (filterItem.icon)
							col.find(".filter > i").css("backgroundImage", "url(" + filterItem.icon + ")");
						isCustom = Utils.isTrue(filterItem.custom);
					}
				}
			}
		}

		if (Utils.isFunction(filterFunction)) {
			let _filterFunction = filterFunction;
			filterFunction = function (_column, _data, _value) {
				return _filterFunction(_data, _value, _column);
			};
		}
		else if (!isNullValue && !isCustom) {
			filterFunction = this._getFilterFunction(column, filterValue);
		}

		let colName = column && column.name || ""
		if (this.currentFilters) {
			if (!isNullValue || Utils.isFunction(filterFunction)) {
				let filter = Utils.findBy(this.currentFilters, "name", colName);
				if (!filter) {
					filter = {name: colName, column: column};
					this.currentFilters.push(filter);
				}
				filter.value = filterValue;
				filter.fn = filterFunction;
			}
			else {
				Utils.removeBy(this.currentFilters, "name", colName);
			}
		}

		if (!isCustom) {
			renderBySortAndFilter.call(this, true);
		}

		this.trigger("filter", colName, filterValue);
	};

	const renderBySortAndFilter = function (hasFilterChanged) {
		let datas = this.getData(true);
		if (hasFilterChanged || !this.lastFilterDatas) {
			let _datas = [].concat(datas);
			if (_datas && _datas.length > 0) {
				if (!this.currentFilters)
					initCurrentFilters.call(this);
				Utils.each(this.currentFilters, (filter) => {
					_datas = Utils.filter(_datas, (data) => {
						return filter.fn(filter.column, data, filter.value);
					});
				});
			}
			this.lastFilterDatas = _datas;
		}

		let _datas = this.lastFilterDatas;
		if (!this.currentSort)
			initCurrentSort.call(this);
		if (this.currentSort && Utils.isFunction(this.currentSort.fn)) {
			let _sort = this.currentSort;
			_datas = _datas.slice(0).sort((a, b) => {
				return _sort.fn(_sort.column, a, b, _sort.type);
			});
		}

		// 对应原数据集中的索引
		let _indexs = Utils.map(_datas, (data) => {
			return Utils.index(datas, (temp) => (temp == data));
		});
		// 当前选中项对应筛选、排序后的新索引
		let _selectedIndexs = [];
		// 当前展开的原数据集索引
		let expandIndexs = [];
		Utils.each(this._getItems(), (item) => {
			if (item.is(".selected")) {
				let index = parseInt(item.attr("opt-ind")) || 0;
				let data = datas && datas[index];
				if (data) {
					index = Utils.index(_datas, (temp) => (temp == data));
					if (index >= 0)
						_selectedIndexs.push(index);
				}
			}
			if (item.is(".expand"))
				expandIndexs.push(item.attr("opt-ind"));
		});

		renderItems.call(this, $, this.$el, _datas, _indexs, _selectedIndexs);

		selectedChanged.call(this);
		if (hasFilterChanged) {
			UI._items.checkIfEmpty.call(this);
		}

		if (expandIndexs.length > 0) {
			Utils.each(this._getItems(), (item) => {
				if (expandIndexs.indexOf(item.attr("opt-ind")) >= 0)
					item.children(".col-exp").children(".expbtn").trigger("tap");
			});
		}
	};

	const initCurrentSort = function () {
		let col = Utils.find(getHeaders.call(this), (col) => {
			return !!col.attr("opt-sort");
		});
		this.currentSort = null;
		if (col && col.length > 0) {
			let colName = col.attr("col-name");
			let sortType = col.attr("opt-sort");
			let column = getColumnInfo.call(this, colName);
			let sortFunction = this._getSortFunction(column, sortType);
			this.currentSort = {name: colName, column: column, type: sortType, fn: sortFunction};
		}
	};

	const initCurrentFilters = function () {
		let filters = this.currentFilters = [];
		Utils.each(getHeaders.call(this), (col) => {
			let colName = col.attr("col-name");
			let filterValue = col.attr("opt-filter");
			if (colName && Utils.isNotNull(filterValue) && filterValue !== false) {
				let column = getColumnInfo.call(this, colName);
				let filterFunction = this._getFilterFunction(column, filterValue);
				filters.push({name: colName, column: column, value: filterValue, fn: filterFunction});
			}
		});
	};

	const getHeaders = function () {
		return this.gridHead.children("table").children("thead").children("tr").children("th");
	};

	// ====================================================
	// 显示 排序 和 筛选 对话框
	const showSortAndFilterDialog = function (column, col) {
		$("body").addClass("ui-scrollless");

		let dialogView = $("<div class='sort-and-filter'></div>").appendTo(this.$el);
		let container = $("<div class='container'></div>").appendTo(dialogView);

		dialogView.data("column", column);

		let isSortable = Utils.isTrue(column.sortable);
		let isFilterable = Utils.isTrue(column.filter);

		if (isSortable)
			showDialogSortView.call(this, container, column, col.attr("opt-sort"));

		if (isFilterable)
			showDialogFilterView.call(this, container, column, col.attr("opt-filter"));

		if (!isSortable && isFilterable && column.filter != "enum" && !Utils.isArray(column.filter)) {
			dialogView.addClass("inputing");
			dialogView.find(".filter").focus();
		}

		setTimeout(() => {
			dialogView.addClass("show");
		}, 0);
	};

	const showDialogSortView = function (container, column, sortType) {
		let target = $("<div class='sort'></div>").appendTo(container);
		target.append("<div class='title'>排序</div>");

		let sorts = column.sortable;
		if (!Utils.isArray(sorts)) {
			sorts = [{label: "升序", type: "asc"}, {label: "降序", type: "desc"}];
		}

		let content = $("<div class='content'></div>").appendTo(target);
		Utils.each(sorts, (data) => {
			let item = $("<div class='item'></div>").appendTo(content);
			item.attr("data-type", data.type);
			let icon = $("<i></i>").appendTo(item);
			let iconUrl = data.icon || defaultIcons[data.type];
			if (iconUrl)
				icon.css("backgroundImage", "url(" + iconUrl + ")");
			$("<span></span>").appendTo(item).text(data.label || "无");
			if (data.type == sortType)
				item.addClass("selected");
		});
	};

	const showDialogFilterView = function (container, column, filterValue) {
		let target = $("<div class='filter'></div>").appendTo(container);
		target.append("<div class='title'>筛选</div>");

		let filters = column.filter;
		if (column.filter == "enum") {
			filters = getColumnValueSet.call(this, column);
			if (filters && filters.length > 0) {
				filters = Utils.map(filters, (temp) => {
					return {label: temp, value: temp};
				});
			}
			else {
				filters = [{label: "无选项", value: ""}];
			}
		}

		let content = $("<div class='content'></div>").appendTo(target);
		if (Utils.isArray(filters)) {
			Utils.each(filters, (data) => {
				let item = $("<div class='item'></div>").appendTo(content);
				item.attr("data-val", data.value);
				let icon = $("<i></i>").appendTo(item);
				if (data.icon)
					icon.css("backgroundImage", "url(" + data.icon + ")");
				$("<span></span>").appendTo(item).text(data.label || "空");
				if (data.value == filterValue)
					item.addClass("selected");
			});
		}
		else {
			let filterInput = $("<div class='filterinput'></div>").appendTo(content);
			filterInput.append("<input placeholder='请输入文本'/>");
			filterInput.append("<div class='clearbtn'></div>");
			filterInput.append("<div class='submitbtn'>确定</div>");
			if (filterValue)
				filterInput.children("input").val(filterValue);
		}
	};

	const hideSortAndFilterDialog = function () {
		$("body").removeClass("ui-scrollless");
		let target = this.$el.children(".sort-and-filter");
		target.removeClass("show").removeClass("inputing");
		setTimeout(() => {
			target.remove();
		}, 300);
	};

	// ====================================================
	// 实时监视表格，进行布局调整
	const startLayoutChangeMonitor = function () {
		if (this.t_layout) {
			clearTimeout(this.t_layout);
			this.t_layout = 0;
		}
		this.t_layout = setTimeout(() => {
			this.t_layout = 0;
			if (this.isMounted()) {
				doHeaderLayout.call(this);
				checkBodyFixed.call(this);
				startLayoutChangeMonitor.call(this);
			}
		}, 50);
	};

	const doHeaderLayout = function () {
		if (this.isHeaderVisible()) {
			let headers = getHeaders.call(this);
			let cols = this.gridBody.children("table").children("thead").children("tr").children("th");
			Utils.each(cols, (col, i) => {
				let header = headers.eq(i);
				if (col.is(".is-expand")) {
					header.addClass("is-expand");
				}
				else {
					let width = col.width();
					if (width != parseInt(header.attr("opt-w")))
						header.attr("opt-w", width).width(width);
				}
			});
		}
	};

	const checkBodyFixed = function () {
		// this.$el.removeAttr("fixed");
		// if (!this.$el.is(".is-empty")) {
		// 	let table = this.gridBody.parent().parent(); // .table
		// 	let head = table.children("header"); // head
		// 	let body = table.children("section"); // body
		// 	if (table.width() < head.width() + body.width())
		// 		this.$el.attr("fixed", "1");
		// }
	};

	const selectedChanged = function () {
		let snapshoot = this._snapshoot();

		let indexs = Utils.map(this._getItems(".selected"), (item) => {
			return item.index();
		});
		UI._select.setSelectedIndex.call(this, indexs);

		if (this.isMultiple()) {
			let header = this.gridHead.find("tr");
			if (this.isAllSelected())
				header.addClass("selected");
			else
				header.removeClass("selected");
		}

		snapshoot.done();
	};

	const getColumnInfo = function (name) {
		return Utils.findBy(this.__columns, "name", name);
	};

	// ====================================================
	// 获取数据集某一列的集合
	const getColumnValueSet = function (column, datas) {
		let set = [];
		let columnName = column && column.name;
		if (columnName) {
			datas = datas || this.getData(true);
			Utils.each(datas, (data) => {
				let value = data && data[columnName];
				let hasValue = Utils.index(set, (tmp) => (tmp == value));
				if (hasValue < 0)
					set.push(value);
			});
		}
		return set.sort();
	};
	
	const getFormatColumns = function (columns) {
		columns = Utils.map(Utils.toArray(columns), formatOneColumn);
		let sortColumn = null;
		let isAllExpand = true;
		Utils.each(columns, (column) => {
			if (column.sortType) { // 只允许一个列排序
				if (sortColumn)
					sortColumn.sortType = null;
				sortColumn = column;
			}
			if (!column.expand)
				isAllExpand = false;
		});
		if (isAllExpand && columns.length > 0)
			columns[0].expand = false;
		return columns;
	};

	const formatOneColumn = function (column, index) {
		let _column = {};
		if (Utils.isNull(column)) {
			_column.title = "列 " + (index + 1);
		}
		else if (Utils.isPrimitive(column)) {
			_column.name = Utils.trimToEmpty(column);
		}
		else {
			_column.name = Utils.trimToEmpty(column.name);
			_column.title = Utils.trimToNull(column.title);
			_column.html = Utils.trimToNull(column.focusHtmlTitle);
			_column.dataType = Utils.trimToNull(column.dataType || column.type);
			_column.icon = Utils.trimToNull(column.icon);
			_column.width = Utils.trimToNull(column.width);
			_column.expand = Utils.isTrue(column.expand);

			if (Utils.isTrue(column.sortable))
				formatColumnSortable(_column, column);
			if (Utils.isTrue(column.filter))
				formatColumnFilterable(_column, column);
		}
		return _column;
	};

	const formatColumnSortable = function (column, data) {
		if (Utils.isFunction(data.sortFunction))
			column.sortFunction = data.sortFunction;
		else if (Utils.isFunction(data.sortable))
			column.sortFunction = data.sortable;
		if (Utils.isArray(data.sortable) && data.sortable.length > 0) {
			column.sortable = Utils.map(data.sortable, (tmp) => {
				return {type: tmp.type, label: tmp.label, icon: tmp.icon, handler: tmp.handler, custom: tmp.custom};
			});
		}
		else {
			column.sortable = data.sortable == "custom" ? "custom" : true;
		}
		column.sortType = data.sortType ? Utils.trimToNull(data.sortType) : null;
	};

	const formatColumnFilterable = function (column, data) {
		if (Utils.isFunction(data.filterFunction))
			column.filterFunction = data.filterFunction;
		else if (Utils.isFunction(data.filter))
			column.filterFunction = data.filter;
		if (Utils.isArray(data.filter) && data.filter.length > 0) {
			column.filter = Utils.map(data.filter, (tmp) => {
				return {label: tmp.label, value: tmp.value, icon: tmp.icon, handler: tmp.handler, custom: tmp.custom};
			});
		}
		else {
			column.filter = /^(custom|enum)$/.test(data.filter) ? data.filter : true;
		}
		column.filterValue = data.filterValue ? Utils.trimToNull(data.filterValue) : null;
	};

	// ====================================================
	const getSortFunction = function (column, type) {
		if (column) {
			if (Utils.isNotNull(type) && Utils.isArray(column.sortable)) {
				let temp = Utils.findBy(column.sortable, "type", type);
				if (temp && Utils.isFunction(temp.handler)) {
					return function (_column, a, b, sortType) {
						return temp.handler(a, b, sortType);
					};
				}
			}
			if (Utils.isFunction(column.sortFunction)) {
				return function (_column, a, b, sortType) {
					return column.sortFunction(a, b, sortType);
				};
			}
		}
		if (Utils.isFunction(this.options.sortFunction)) {
			let fn = this.options.sortFunction;
			return function (_column, a, b, sortType) {
				return fn(a, b, sortType, _column);
			};
		}
		return defaultSortFucntion;
	};

	const getFilterFunction = function (column, value) {
		if (column) {
			if (Utils.isNotNull(value) && Utils.isArray(column.filter)) {
				let temp = Utils.findBy(column.filter, "value", value);
				if (temp && Utils.isFunction(temp.handler)) {
					return function (_column, _data, _value) {
						return temp.handler(_data, _value);
					};
				}
			}
			if (Utils.isFunction(column.filterFunction)) {
				return function (_column, _data, _value) {
					return column.filterFunction(_data, _value);
				};
			}
		}
		if (Utils.isFunction(this.options.filterFunction)) {
			let fn = this.options.filterFunction;
			return function (_column, _data, _value) {
				return fn(_data, _value, _column);
			};
		}
		return defaultFilterFunction;
	};

	const defaultSortFucntion = function (column, a, b, sortType) {
		if (column && column.name && /^(asc|desc)$/i.test(sortType)) {
			let value_a = a ? a[column.name] : null;
			let value_b = b ? b[column.name] : null;

			let result = (() => {
				if (Utils.isNull(value_a))
					return Utils.isNull(value_b) ? 0 : -1;
				if (Utils.isNull(value_b))
					return Utils.isNull(value_a) ? 0 : 1;
				let dataType = column.dataType;
				if (/date/i.test(dataType)) {
					value_a = Utils.toDate(value_a);
					value_b = Utils.toDate(value_b);
					if (!value_a)
						return value_b ? 1 : 0;
					if (!value_b)
						return value_a ? -1 : 0;
					let format = /^date$/i.test(dataType) ? "yyyyMMddHHmmss" : "yyyyMMdd";
					value_a = Utils.toDateString(value_a, format);
					value_b = Utils.toDateString(value_b, format);
					return value_a < value_b ? -1 : (value_a > value_b ? 1 : 0);
				}
				if (/num/i.test(dataType) || !(isNaN(value_a) || isNaN(value_b))) {
					return parseFloat(value_a) - parseFloat(value_b);
				}
				return value_a.localeCompare(value_b);
			})();

			return result * (/^asc$/i.test(sortType) ? 1 : -1);
		}
		return 0;
	};

	const defaultFilterFunction = function (column, data, value) {
		if (!(column || column.name))
			return true; // 没有列信息，不做筛选
		if (Utils.isNull(data))
			return false;
		let _value = data[column.name];
		if (_value === value)
			return true;
		let dataType = column.dataType;
		if (/date/i.test(dataType)) {
			value = Utils.toDate(value);
			if (!value)
				return true; // 不是日期（先不筛选）
			_value = Utils.toDate(_value);
			if (_value) {
				let format = /^date$/i.test(dataType) ? "yyyyMMdd" : "yyyyMMddHHmmss";
				value = Utils.toDateString(value, format);
				_value = Utils.toDateString(_value, format);
				return _value.indexOf(value) === 0;
			}
			return false;
		}
		if (Utils.isNull(_value))
			return Utils.isNull(value);
		if (Utils.isNull(value))
			return Utils.isNull(_value);
		if (/num/i.test(dataType) || !(isNaN(value) || isNaN(_value))) {
			return parseFloat(value) == parseFloat(_value);
		}
		if (value == _value)
			return true;
		value = Utils.trimToEmpty(value);
		_value = Utils.trimToEmpty(_value);
		return _value.indexOf(value) >= 0;
	};

	// 组件内置默认获取表单元格内容的方法
	const getDefaultValue = function (column, data, index) {
		if (Utils.isBlank(data))
			return null;
		if (Utils.isBlank(column.name))
			return "" + data;
		let value = data[column.name];
		if (column.dataType && /*column.format && */Utils.isNotBlank(value)) {
			let type = column.dataType;
			if (type === "localtime")
				value = Utils.toLocalDateString(Utils.toDate(value));
			else if (/^(date|datetime|time)$/.test(type)) {
				value = Utils.toDate(value);
				if (value)
					value = Utils.toDateString(value, dateFormats[type]);
			}
			else if (type === "money") {
				value = parseFloat(value);
				if (isNaN(value))
					value = null;
				else {
					value = value.toFixed(2).split(".");
					value = "<span class='val'>￥<span class='v1'>" + value[0] + 
						"</span>.<span class='v2'>" + value[1] + "</span></span>";
				}
			}
			else if (type === "number" || type === "num") {
				value = parseFloat(value);
				if (isNaN(value))
					value = null;
				else {
					let decimals = parseFloat(column.decimals);
					if (isNaN(decimals) || decimals < 0)
						decimals = 0;
					value = value.toFixed(decimals);
				}
			}
		}
		return value;
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UITable = UITable;
		UI.init(".ui-table", UITable, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");