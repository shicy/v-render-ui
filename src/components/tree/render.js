// 2019-07-25
// tree(原treeview)

(function (frontend) {
	if (frontend && VRender.Component.ui.tree)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UITree = UI.tree = function (view, options) {
		return UI._select.call(this, view, options);
	};
	const _UITree = UITree.prototype = new UI._select(false);

	_UITree.init = function (target, options) {
		UI._select.init.call(this, target, options);

		this.$el.on("tap", ".tree-node", onNodeClickHandler.bind(this));
		this.$el.on("tap", ".tree-node > .chkbox", onChkboxClickHandler.bind(this));
		this.$el.on("tap", "li.more > div", onMoreBtnClickHandler.bind(this));

		if (!this._isRenderAsApp()) {
			this.$el.on("tap", ".tree-node > .ep", onExpandClickHandler.bind(this));
		}

		doInit.call(this);
	};

	// ====================================================
	_UITree.getDataAt = function (index, deep) {
		let item = getItemByIndex.call(this, index, deep);
		return !!item ? this._getItemData(item) : null;
	};

	_UITree.getDataIndex = function (data, deep) {
		let item = getItemByData.call(this, data, deep);
		return !!item ? getItemIndex.call(this, item, deep) : -1;
	};

	_UITree.getDataByKey = function (value, deep) {
		let item = getItemById.call(this, value, deep);
		return !!item ? this._getItemData(item) : null;
	};

	_UITree.getIndexByKey = function (value, deep) {
		let item = getItemById.call(this, value, deep);
		return !!item ? getItemIndex.call(this, item, deep) : -1;
	};

	_UITree.getDataByName = function (value, deep) {
		if (Utils.isBlank(value))
			return null;
		let findData = null;
		doLoop.call(this, (item) => {
			let data = this._getItemData(item);
			if (data && data.name == value) {
				findData = data;
				return false;
			}
			if (!deep && !item.is(".open"))
				return true;
		});
		return findData;
	};

	_UITree.getIndexByName = function (value, deep) {
		if (Utils.isBlank(value))
			return -1;
		let findIndex = -1;
		doLoop.call(this, (item, index) => {
			let data = this._getItemData(item);
			if (data && data.name == value) {
				findIndex = index;
				return false;
			}
			if (!deep && !item.is(".open"))
				return true;
		});
		return findIndex;
	};

	_UITree.isChkboxVisible = function () {
		return this.$el.attr("opt-chk") == "1";
	};
	_UITree.setChkboxVisible = function (value) {
		value = Utils.isNull(value) ? true : Utils.isTrue(value);
		if (this.isChkboxVisible() != value) {
			let snapshoot = this._snapshoot();
			let nodes = this.$el.find(".tree-node");
			if (value) {
				this.$el.attr("opt-chk", "1");
				nodes.children(".ep").after("<span class='chkbox'><i></i></span>");
			}
			else {
				this.$el.removeAttr("opt-chk");
				nodes.parent().removeClass("selected").removeClass("selected_");
				nodes.children(".chkbox").remove();
			}
			snapshoot.done();
		}
	};

	_UITree.getChildrenField = function () {
		return this.$el.attr("opt-child") || null;
	};

	_UITree.getLeafField = function () {
		return this.options.leafField;
	};

	_UITree.getSelectedIndex = function (needArray, deep) {
		let indexs = [];
		let _hasChkbox = this.isChkboxVisible();
		let _isMultiple = this.isMultiple();
		doLoop.call(this, (item, index) => {
			if (_hasChkbox) {
				if (item.is(".selected")) {
					indexs.push(index);
					if (_isMultiple) {
						if (!deep)
							return true;
					}
					else {
						return false;
					}
				}
			}
			else if (item.children(".tree-node").is(".active")) {
				indexs.push(index);
				return false;
			}
			if (!deep && !item.is(".open"))
				return true;
		});
		if (needArray || _isMultiple)
			return indexs.length > 0 ? indexs : null;
		return indexs.length > 0 ? indexs[0] : -1;
	};
	_UITree.setSelectedIndex = function (value, deep) {
		let _hasChkbox = this.isChkboxVisible();
		let _isMultiple = this.isMultiple();

		let indexs = Fn.getIntValues(value, 0);
		if (indexs.length > 1 && !(_hasChkbox && _isMultiple))
			indexs = [indexs.pop()];

		let snapshoot = this._snapshoot();

		let nodes = this.$el.find(".tree-node");
		if (_hasChkbox)
			nodes.parent().removeClass("selected").removeClass("selected_");
		else
			nodes.removeClass("active");

		if (indexs.length > 0) {
			doLoop.call(this, (item, index) => {
				if (indexs.indexOf(index) >= 0) {
					if (_hasChkbox) {
						if (!item.is(".selected")) {
							item.addClass("selected");
							setParentSelected(item);
							if (_isMultiple) {
								setChildrenSelected(item, true);
							}
							else {
								return false;
							}
						}
					}
					else {
						item.children(".tree-node").addClass("active");
						return false;
					}
				}
				if (!deep && !item.is(".open"))
					return true;
			});
		}

		snapshoot.done();
	};

	_UITree.getSelectedKey = function (needArray, deep) {
		let ids = [];
		let _hasChkbox = this.isChkboxVisible();
		let _isMultiple = this.isMultiple();
		doLoop.call(this, (item) => {
			if (_hasChkbox) {
				if (item.is(".selected")) {
					ids.push(getItemId.call(this, item));
					if (_isMultiple) {
						if (!deep)
							return true;
					}
					else {
						return false;
					}
				}
			}
			else if (item.children(".tree-node").is(".active")) {
				ids.push(getItemId.call(this, item));
				return false;
			}
			if (!deep && !item.is(".open"))
				return true;
		});
		if (needArray || _isMultiple)
			return ids.length > 0 ? ids : null;
		return ids.length > 0 ? ids[0] : null;
	};
	_UITree.setSelectedKey = function (value, deep) {
		let _hasChkbox = this.isChkboxVisible();
		let _isMultiple = this.isMultiple();

		let ids = Utils.isArray(value) ? value : (Utils.isBlank(value) ? [] : Utils.trimToEmpty(value).split(","));
		if (ids.length > 1 && !(_hasChkbox && _isMultiple))
			ids = [ids.pop()];

		let snapshoot = this._snapshoot();

		let nodes = this.$el.find(".tree-node");
		if (_hasChkbox)
			nodes.parent().removeClass("selected").removeClass("selected_");
		else
			nodes.removeClass("active");

		if (ids.length > 0) {
			doLoop.call(this, (item, index) => {
				let _id = getItemId.call(this, item);
				let _hasSelected = Utils.index(ids, (tmp) => {
					return tmp == _id;
				}) >= 0;
				if (_hasSelected) {
					if (_hasChkbox) {
						if (!item.is(".selected")) {
							item.addClass("selected");
							setParentSelected(item);
							if (_isMultiple) {
								setChildrenSelected(item, true);
							}
							else {
								return false;
							}
						}
					}
					else {
						item.children(".tree-node").addClass("active");
						return false;
					}
				}
				if (!deep && !item.is(".open"))
					return true;
			});
		}

		snapshoot.done();
	};

	_UITree.getSelectedData = function (needArray, deep) {
		let datas = [];
		let _hasChkbox = this.isChkboxVisible();
		let _isMultiple = this.isMultiple();
		doLoop.call(this, (item) => {
			if (_hasChkbox) {
				if (item.is(".selected")) {
					datas.push(getItemData.call(this, item));
					if (_isMultiple) {
						if (!deep)
							return true;
					}
					else {
						return false;
					}
				}
			}
			else if (item.children(".tree-node").is(".active")) {
				datas.push(getItemData.call(this, item));
				return false;
			}
			if (!deep && !item.is(".open"))
				return true;
		});
		if (needArray || _isMultiple)
			return datas.length > 0 ? datas : null;
		return datas.length > 0 ? datas[0] : null;
	};

	_UITree.isAllSelected = function () {
		let _allSelected = true;
		doLoop.call(this, (item) => {
			if (!item.is(".selected")) {
				_allSelected = false;
				return false;
			}
			return true;
		});
		return _allSelected;
	};

	// ====================================================
	_UITree.open = function (data) {
		let item = getItemByData.call(this, data, true);
		if (item) {
			doOpen.call(this, item);
		}
	};

	_UITree.openAt = function (index, deep) {
		let item = getItemByIndex.call(this, index, deep);
		if (item) {
			doOpen.call(this, item);
		}
	};

	_UITree.openByKey = function (value) {
		let item = getItemById.call(this, value, true);
		if (item) {
			doOpen.call(this, item);
		}
	};

	_UITree.close = function (data) {
		let item = getItemByData.call(this, data, true);
		if (item) {
			doClose.call(this, item);
		}
	};

	_UITree.closeAt = function (index, deep) {
		let item = getItemByIndex.call(this, index, deep);
		if (item) {
			doClose.call(this, item);
		}
	};

	_UITree.closeByKey = function (value) {
		let item = getItemById.call(this, value, true);
		if (item) {
			doClose.call(this, item);
		}
	};

	// ====================================================
	_UITree.addItem = function (data, pdata, index) {
		if (Utils.isBlank(data))
			return false;

		let container = this._getItemContainer();
		if (Utils.isNotBlank(pdata)) {
			let item = getItemByData.call(this, pdata, true);
			if (item) {
				container = item.children("ul");
				if (!(container && container.length > 0)) {
					container = $("<ul></ul>").appendTo(item);
					container.attr("level", parseInt(item.parent().attr("level")) + 1);
				}
			}
		}

		let children = container.children();
		let nodeIndex = container.is(".root") ? 0 : getItemIndex.call(this, container.parent(), true);
		index = Utils.getIndexValue(index);
		if (index >= 0 && index < children.length - 1)
			nodeIndex += index;
		
		let snapshoot = this._snapshoot();
		addItem.call(this, container, data, index, nodeIndex);
		snapshoot.done();

		this.trigger("itemchange", data);
		return true;
	};

	_UITree.updateItem = function (data, pdata, index) {
		if (Utils.isBlank(data))
			return false;
		if (!isNaN(pdata) && (pdata || pdata === 0)) {
			index = pdata;
			pdata = null;
		}
		let snapshoot = this._snapshoot();
		if (pdata) { // 此时只修改 pdata 下的节点
			let parentItem = getItemByData.call(this, pdata, true);
			if (!parentItem) {
				snapshoot.release();
				return false;
			}
			let children = parentItem.children("ul").children();
			if (Utils.isBlank(index)) {
				let dataId = this._getDataKey(data);
				let item = Utils.find(children, (_item) => {
					let _data = this._getItemData(_item);
					return data == _data || dataId == this._getDataKey(_data);
				});
				if (item)
					updateItem.call(this, item, data);
			}
			else if (!isNaN(index)) {
				index = parseInt(index);
				if (index >= 0 && index < children.length)
					updateItem.call(this, children.eq(index), data);
			}
		}
		else if (Utils.isBlank(index)) {
			let item = getItemByData.call(this, data, true);
			if (item)
				updateItem.call(this, item, data);
		}
		else if (!isNaN(index)) { // 此时 index 为展开的节点
			index = parseInt(index);
			let item = getItemByIndex.call(this, index);
			if (item)
				updateItem.call(this, item, data);
		}
		snapshoot.done();
		this.trigger("itemchange", data);
		return true;
	};

	_UITree.removeItem = function (data, pdata) {
		if (Utils.isBlank(data))
			return false;
		let snapshoot = this._snapshoot();
		if (pdata) {
			let parentItem = getItemByData.call(this, pdata, true);
			if (!parentItem) {
				snapshoot.release();
				return false;
			}
			let dataId = this._getDataKey(data);
			let children = parentItem.children("ul").children();
			let item = Utils.find(children, (_item) => {
				let _data = this._getItemData(_item);
				return data == _data || dataId == this._getDataKey(_data);
			});
			if (item)
				removeItem.call(this, item);
		}
		else {
			let item = getItemByData.call(this, data, true);
			if (item)
				removeItem.call(this, item);
		}
		snapshoot.done();
		this.trigger("itemchange", data);
		return true;
	};

	_UITree.removeItemAt = function (index, pdata) {
		index = Utils.getIndexValue(index);
		if (index < 0)
			return false;
		let snapshoot = this._snapshoot();
		if (pdata) {
			let parentItem = getItemByData.call(this, pdata, true);
			if (!parentItem) {
				snapshoot.release();
				return false;
			}
			let children = parentItem.children("ul").children();
			if (index < children.length)
				removeItem.call(this, children.eq(index));
		}
		else {
			let item = getItemByIndex.call(this, index);
			if (item)
				removeItem.call(this, item);
		}
		snapshoot.done();
		// this.trigger("itemchange");
		return true;
	};

	_UITree.addOrUpdateItem = function (data, pdata) {
		if (Utils.isBlank(data))
			return ;
		if (!this.updateItem(data, pdata))
			this.addItem(data, pdata);
	};

	_UITree.setItems = function (datas, pdata) {
		datas = Utils.toArray(datas);
		if (pdata) {
			let parentItem = getItemByData.call(this, pdata, true);
			if (!parentItem)
				return ;
			let snapshoot = this._snapshoot();
			let children = parentItem.children("ul").children();
			for (let i = children.length - 1; i >= 0; i--) {
				removeItem.call(this, children.eq(i));
			}
			if (datas && datas.length > 0) {
				let container = parentItem.children("ul");
				if (!(container && container.length > 0)) {
					container = $("<ul></ul>").appendTo(parentItem);
					container.attr("level", parseInt(parentItem.parent().attr("level")) + 1);
				}
				let nodeIndex = getItemIndex.call(this, parentItem, true);
				for (let i = 0, l = datas.length; i < l; i++) {
					addItem.call(this, container, datas[i], i, nodeIndex);
					nodeIndex += 1;
				}
			}
			snapshoot.done();
		}
		else {
			this.setData(datas);
		}
	};

	// ====================================================
	_UITree.load = function (api, params, callback) {
		api = api || this.lastLoadApi || this.$el.attr("api-name");
		if (Utils.isBlank(api))
			return false;

		let container = this._getItemContainer().empty();
		loadInner.call(this, container, api, params, (err, datas) => {
			if (!err) {
				if (Utils.isFunction(callback))
					callback(false, datas);
			}
			else if (Utils.isFunction(callback)) {
				callback(err);
			}
			this.trigger("loaded", err, datas);
		});
	};

	// _UITree.tryAutoLoad = function () {
	// 	UI._base.tryAutoLoad.call(this);
	// };

	_UITree.length = function () {
		return Number.POSITIVE_INFINITY;
	};

	// ====================================================
	_UITree._renderItems = function ($, itemContainer, datas) {
		renderItems.call(this, $, this.$el, itemContainer, datas);
	};

	_UITree._getItemContainer = function () {
		return this.$el.children("ul");
	};

	_UITree._getNewItem = function ($, itemContainer, data, index) {
		return getNewItem.call(this, $, itemContainer, data, index);
	};

	_UITree._isIconVisible = function () {
		if (Utils.isTrue(this.options.icon))
			return true;
	};

	_UITree._getIcon = function (data, index, level) {
		return getIcon.call(this, this.options.icon, data, index);
	};

	_UITree._getOpenProps = function () {
		let params = {};
		let indexs = this.$el.attr("opt-openinds");
		if (Utils.isNotBlank(indexs)) {
			indexs = getOpenIndex.call(this, indexs);
			params.indexs = (indexs && indexs.length > 0) ? indexs : null;
		}
		if (!params.indexs) {
			let ids = this.$el.attr("opt-openids");
			if (Utils.isNotBlank(ids)) {
				ids = getOpenKey.call(this, ids);
				params.ids = (ids && ids.length > 0) ? ids : null;
			}
		}
		// this.$el.removeAttr("opt-openinds").removeAttr("opt-openids");
		return params;
	};

	_UITree._getItemData = function (item) {
		return getItemData.call(this, item);
	};

	_UITree._doAdapter = function (data) {
		let datas = Utils.toArray(data);
		if (datas._vr_adapter_flag)
			return datas;

		let dataIndex = 0;
		let childrenField = this.getChildrenField() || "children";
		let _loopmap = (_datas) => {
			return Utils.map(_datas, (_data, i) => {
				_data = Fn.doAdapter.call(this, _data, dataIndex++);
				if (Utils.isArray(_data[childrenField]))
					_data[childrenField] = _loopmap(_data[childrenField]);
				return _data;
			});
		};
		datas = _loopmap(datas);
		datas._vr_adapter_flag = true;

		return datas;
	};

	_UITree._snapshoot_shoot = function (state) {
		state.selectedIndex = this.getSelectedIndex(true, true);
	};

	_UITree._snapshoot_compare = function (state) {
		let selectedIndex = this.getSelectedIndex(true, true);
		return Fn.equalIndex(state.selectedIndex, selectedIndex);
	};

	// ====================================================
	const onNodeClickHandler = function (e) {
		let node = $(e.currentTarget);
		if (!node.is(".active")) {
			this.$el.find(".tree-node.active").removeClass("active");
			node.addClass("active");
			this.trigger("itemclick", this._getItemData(node.parent()));
		}
		if (this._isRenderAsApp()) {
			let item = node.parent();
			if (item.is(".open")) {
				doClose.call(this, item);
			}
			else {
				doOpen.call(this, item);
			}
		}
	};

	const onExpandClickHandler = function (e) {
		let item = $(e.currentTarget).parent().parent();
		if (item.is(".open")) {
			doClose.call(this, item);
		}
		else {
			doOpen.call(this, item);
		}
		return false;
	};

	const onChkboxClickHandler = function (e) {
		let snapshoot = this._snapshoot();
		let item = $(e.currentTarget).parent().parent();
		setItemSelectedOrNot.call(this, item, !item.is(".selected"));
		snapshoot.done();
		return false;
	};

	const onMoreBtnClickHandler = function (e) {
		let btn = $(e.currentTarget).parent();
		let params = {p_no: (parseInt(btn.attr("page-no")) + 1)};
		let parentItem = btn.parent();
		if (parentItem.is(".root")) {
			params.pid = null;
		}
		else {
			parentItem = parentItem.parent();
			params.pid = getItemId.call(this, parentItem);
		}
		params = Utils.extend(this.lastLoadParams, params);
		let parentItemData = this._getItemData(parentItem);
		doLoad.call(this, parentItem, this.lastLoadApi, params, (err, datas) => {
			this.trigger("loaded", err, datas, parentItemData);
		});
	};
	
	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._selectRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._selectRender(false);

	// ====================================================
	_Renderer.render = function ($, target) {
		target.addClass("ui-tree");
		target.append("<ul class='root' level='0'></ul>");
		UI._selectRender.render.call(this, $, target);
		renderOthers.call(this, $, target);
		return this;
	};

	// ====================================================
	_Renderer.getData = function () {
		let datas = Utils.toArray(this.options.data);
		if (datas._vr_adapter_flag)
			return datas;

		let dataIndex = 0;
		let childrenField = this.getChildrenField() || "children";
		let _loopmap = (datas) => {
			return Utils.map(datas, (data, i) => {
				data = Fn.doAdapter.call(this, data, dataIndex++);
				if (Utils.isArray(data[childrenField])) {
					data[childrenField] = _loopmap(data[childrenField]);
				}
				return data;
			});
		};
		datas = _loopmap(datas);
		
		datas._vr_adapter_flag = true;
		this.options.data = datas;

		return datas;
	};

	_Renderer.isChkboxVisible = function () {
		return Utils.isTrue(this.options.chkbox);
	};

	_Renderer.getChildrenField = function () {
		return this.options.childrenField;
	};

	_Renderer.getLeafField = function () {
		return this.options.leafField;
	};
	
	// ====================================================
	_Renderer._getItemContainer = function ($, target) {
		return target.children("ul");
	};

	// 重构渲染方法，逐层显示展开节点
	_Renderer._renderItems = function ($, target) {
		let itemContainer = this._getItemContainer($, target);
		renderItems.call(this, $, target, itemContainer, this.getData());
	};

	_Renderer._renderEmptyView = function () {
		// do nothing
	};

	_Renderer._renderLoadView = function () {
		// do nothing
	};

	_Renderer._getNewItem = function ($, itemContainer, data, index) {
		return getNewItem.call(this, $, itemContainer, data, index);
	};

	_Renderer._isIconVisible = function () {
		return Utils.isTrue(this.options.icon);
	};

	_Renderer._getIcon = function (data, index) {
		return getIcon.call(this, this.options.icon, data, index);
	};

	_Renderer._getOpenProps = function () {
		let indexs = getOpenIndex.call(this, this.options.openIndex);
		indexs = (indexs && indexs.length > 0) ? indexs : null;

		let ids = getOpenKey.call(this, this.options.openKey);
		ids = (ids && ids.length > 0) ? ids : null;

		return {indexs: indexs, ids: ids};
	};
	
	// ====================================================
	const renderItems = function ($, target, itemContainer, datas) {
		renderTreeNodes.call(this, $, itemContainer, datas, 0, 1);
		renderNodeSelected.call(this, $, target, itemContainer);
		if (!frontend) {
			itemContainer.find("li").removeData("_node_data");
		}
	};

	// nodeIndex 为起始索引，返回最后一个渲染节点的索引
	const renderTreeNodes = function ($, itemContainer, datas, nodeIndex, nodeLevel) {
		let childrenField = this.getChildrenField() || "children";
		Utils.each(datas, (data) => {
			let item = this._getNewItem($, itemContainer, data, nodeIndex);
			renderOneNode.call(this, $, item, data, nodeIndex, nodeLevel);
			nodeIndex += 1;

			let children = data && data[childrenField];
			if (Utils.isArray(children) && children.length > 0) {
				let _container = $("<ul></ul>").appendTo(item);
				_container.attr("level", nodeLevel);
				nodeIndex = renderTreeNodes.call(this, $, _container, children, nodeIndex, nodeLevel + 1);
			}
		});
		return nodeIndex;
	};

	const renderOneNode = function ($, item, data, index, level) {
		if (!frontend) {
			item.data("_node_data", data);
		}

		let leafField = this.getLeafField() || "leaf";
		if (Utils.isTrue(data && data[leafField]))
			item.addClass("is-leaf");

		let node = item.children(".tree-node");

		let icon = node.children(".ic");
		if (icon && icon.length > 0) {
			let iconUrl = this._getIcon(data, index);
			if (Utils.isNotBlank(iconUrl))
				icon.children("i").css("backgroundImage", "url(" + iconUrl + ")");
		}

		let container = node.children(".lbl");
		// 不做选取设置，树选择比较复杂，需要统一处理
		UI._itemsRender.renderOneItem.call(this, $, node, container, data, index);
	};

	const renderNodeSelected = function ($, target, itemContainer) {
		let _hasChkbox = this.isChkboxVisible();
		let _isMultiple = this.isMultiple();
		let selectedIndexs = this.getSelectedIndex(true);
		let setItemSelected = function (item) {
			if (_hasChkbox)
				item.addClass("selected");
			else
				item.children(".tree-node").addClass("active");
		};
		if (selectedIndexs) {
			for (let i = 0, l = selectedIndexs.length; i < l; i++) {
				let item = findItemByIndex.call(this, itemContainer, selectedIndexs[i], true);
				if (item) {
					setItemSelected(item);
					if (!_isMultiple)
						break;
				}
			}
			target.attr("opt-loadinds", selectedIndexs.join(","));
		}
		else {
			let selectedIds = this.getSelectedKey(true);
			if (selectedIds) {
				for (let i = 0, l = selectedIds.length; i < l; i++) {
					let item = findItemById.call(this, itemContainer, selectedIds[i]);
					if (item) {
						setItemSelected(item);
						if (!_isMultiple)
							break;
					}
				}
				target.attr("opt-loadids", selectedIds.join(","));
			}
		}
		checkChildrenSelect.call(this, itemContainer, false);
	};

	const renderOthers = function ($, target) {
		if (this.isChkboxVisible())
			target.attr("opt-chk", "1");

		let childrenField = this.getChildrenField();
		if (Utils.isNotBlank(childrenField))
			target.attr("opt-child", childrenField);

		let openProps = this._getOpenProps() || {};
		let indexs = openProps.indexs && openProps.indexs.join(",");
		target.attr("opt-openinds", indexs || null);
		let ids = openProps.ids && openProps.ids.join(",");
		target.attr("opt-openids", ids || null);

		if (!frontend) {
			let icon = this.options.icon;
			if (Utils.isFunction(icon))
				icon = escape(icon);
			else if (typeof icon != "string")
				icon = Utils.isTrue(icon) ? 1 : 0;
			if (icon)
				target.attr("opt-icon", icon);
		}
	};

	///////////////////////////////////////////////////////
	const doInit = function () {
		if (!this.options.hasOwnProperty("icon")) {
			let icon = this.$el.attr("opt-icon");
			if (icon == "1")
				icon = true;
			else if (/^function/.test(icon))
				icon = (new Function("var Utils=VRender.Utils;return (" + unescape(icon) + ");"))();
			else if (Utils.isBlank(icon))
				icon = false;
			this.options.icon = icon;
		}
		this.$el.removeAttr("opt-icon");

		// 随着节点展开和关闭，索引值一直会变
		this.$el.removeAttr("data-inds").removeAttr("data-ids");

		this.openProps = this._getOpenProps();
		tryAutoOpen.call(this);
	};

	const doLoad = function (item, api, params, callback) {
		let container = item;
		if (item.is("li")) {
			container = item.children("ul");
			if (!(container && container.length > 0)) {
				container = $("<ul></ul>").appendTo(item);
				container.attr("level", parseInt(item.parent().attr("level")) + 1);
			}
		}
		if (item.is(".is-loaded,.is-loading"))
			return false;

		item.addClass("is-loading");
		let loadingItem = $("<li class='loading'></li>").appendTo(container);
		loadingItem.append("<div>" + (this.loadingText || "正在加载...") + "</div>");

		container.children(".more").remove();

		let loadSelectedIds = this.$el.attr("opt-loadids") || "";
		loadSelectedIds = loadSelectedIds ? loadSelectedIds.split(",") : [];
		let loadSelectedIndexs = this.$el.attr("opt-loadinds") || "";
		loadSelectedIndexs = loadSelectedIndexs ? loadSelectedIndexs.split(",") : null;

		let nodeIndex = getItemIndex.call(this, (item.is("li") ? item : item.children().last()));
		VRender.Component.load.call(this, api, params, (err, data) => {
			loadingItem.remove();
			let datas = !err ? Utils.toArray(data) : null;
			if (datas && datas.length > 0) {
				let snapshoot = this._snapshoot();
				Utils.each(datas, (data) => {
					let _item = addItem.call(this, container, data, -1, nodeIndex);
					if (!_item.is(".selected")) {
						let index = !loadSelectedIndexs ? -1 : getItemIndex.call(this, _item);
						let selected = this._isSelected(data, index, loadSelectedIndexs, loadSelectedIds);
						if (selected) {
							setItemSelectedOrNot.call(this, _item, true);
						}
					}
					nodeIndex += 1;
				});
				if (this.hasMore()) {
					let moreItem = $("<li class='more'></li>").appendTo(container);
					moreItem.append("<div>" + (this.moreText || "加载更多..") + "</div>");
					moreItem.attr("page-no", this._pageInfo.page);
				}
				else {
					item.addClass("is-loaded");
				}
				snapshoot.done();
			}
			else {
				item.addClass("is-loaded");
				if (container.children().length == 0)
					item.addClass("is-leaf").removeClass("open");
			}
			item.removeClass("is-loading");
			if (Utils.isFunction(callback))
				callback(err, datas);
		});
	};

	const doOpen = function (item) {
		let parentItems = [];
		let _item = item.parent(); // ul
		while (!_item.is(".root")) {
			_item = _item.parent(); // li
			parentItems.push(_item);
			_item = _item.parent(); // ul
		}
		Utils.each(parentItems, (_item) => {
			if (!_item.is(".open")) {
				_item.addClass("open");
				this.trigger("open", this._getItemData(_item));
			}
		});

		if (!item.is(".open") && !item.is(".is-leaf")) {
			doNodeShowAnimate.call(this, item);

			let itemData = this._getItemData(item);
			let api = this.lastLoadApi || this.$el.attr("api-name");
			if (api && !item.is(".is-loaded")) {
				if (item.children("ul").children().length == 0) {
					let params = {pid: getItemId.call(this, item), p_no: 1};
					params = Utils.extend(this.lastLoadParams, params);
					doLoad.call(this, item, api, params, (err, datas) => {
						this.trigger("loaded", err, datas, itemData);
					});
				}
			}

			this.trigger("open", itemData);
		}
	};

	const doClose = function (item) {
		if (item.is(".open")) {
			doNodeHideAnimate.call(this, item);
			this.trigger("close", this._getItemData(item));
		}
	};

	// ====================================================
	const setItemSelectedOrNot = function (item, beSelected) {
		let _hasChkbox = this.isChkboxVisible();
		let _isMultiple = this.isMultiple();
		let node = item.children(".tree-node");
		if (beSelected) {
			if (_hasChkbox) {
				if (item.is(".selected"))
					return ;
				if (!_isMultiple) {
					this.$el.find("li.selected").removeClass("selected");
					this.$el.find("li.selected_").removeClass("selected_");
				}
				item.addClass("selected").removeClass("selected_");
				if (_isMultiple) {
					setChildrenSelected(item, true);
					setParentSelected(item);
				}
				else { // 单选状态，设置父节点为半选
					while (true) {
						let container = item.parent();
						if (container.is(".root"))
							break;
						item = container.parent();
						item.addClass("selected_");
					}
				}
			}
			else {
				if (node.is(".active"))
					return ;
				this.$el.find(".active").removeClass("active");
				node.addClass("active");
			}
		}
		else if (_hasChkbox) {
			if (item.is(".selected"))
				item.removeClass("selected");
			else if (item.is(".selected_"))
				item.removeClass(".selected_");
			else
				return ;
			if (_isMultiple) {
				setChildrenSelected(item, false);
			}
			setParentSelected(item);
		}
		else {
			node.removeClass("active");
		}
	};

	const setChildrenSelected = function (item, beSelected) {
		Utils.each(item.children("ul").children(), (item) => {
			if (item.is(".more,.loading"))
				return ;
			item.removeClass("selected_");
			if (beSelected)
				item.addClass("selected");
			else 
				item.removeClass("selected");
			setChildrenSelected(item, beSelected);
		});
	};

	const setParentSelected = function (item) {
		let container = item.parent();
		if (!container.is(".root")) {
			let hasSelected = false;
			let allSelected = true;
			Utils.each(container.children(), (_item) => {
				if (_item.is(".more,.loading"))
					return ;
				if (_item.is(".selected")) {
					hasSelected = true;
				}
				else if (_item.is(".selected_")) {
					hasSelected = true;
					allSelected = false;
				}
				else {
					allSelected = false;
				}
			});
			let parentItem = container.parent();
			parentItem.removeClass("selected").removeClass("selected_");
			if (allSelected)
				parentItem.addClass("selected");
			else if (hasSelected)
				parentItem.addClass("selected_");
			setParentSelected(parentItem);
		}
	};

	// ====================================================
	const addItem = function (itemContainer, data, index, nodeIndex) {
		index = Utils.getIndexValue(index);

		let item = this._getNewItem($, itemContainer, data, nodeIndex);
		if (index >= 0 && index < itemContainer.children().length - 1)
			itemContainer.children().eq(index).before(item);
		let nodeLevel = parseInt(itemContainer.attr("level"));
		renderOneNode.call(this, $, item, data, nodeIndex, nodeLevel);

		if (!itemContainer.is(".root")) {
			let parentItem = itemContainer.parent().removeClass("is-leaf");
			if (this.isChkboxVisible() && this.isMultiple() && parentItem.is(".selected"))
				item.addClass("selected");
		}

		let datas = null;
		if (itemContainer.is(".root"))
			datas = this.getData();
		else {
			datas = this._getItemData(itemContainer.parent());
			if (datas) {
				let childrenField = this.getChildrenField() || "children";
				if (!Utils.isArray(datas[childrenField]))
					datas[childrenField] = [];
				datas = datas[childrenField];
			}
		}

		if (Utils.isArray(datas)) {
			if (index >= 0 && index < datas.length)
				datas.splice(index, 0, data);
			else
				datas.push(data);
		}

		return item;
	};

	const updateItem = function (item, data) {
		let container = item.parent();
		let nodeIndex = getItemIndex.call(this, item, true);

		item.children(".tree-node .lbl").empty();
		let nodeLevel = parseInt(container.attr("level"));
		renderOneNode.call(this, $, item, data, nodeIndex, nodeLevel);

		let datas = null;
		if (container.is(".root"))
			datas = this.getData();
		else
			datas = this._getItemData(container.parent());

		let index = item.index();
		if (Utils.isArray(datas) && index < datas.length) {
			let childrenField = this.getChildrenField() || "children";
			if (!Utils.isArray(data[childrenField]))
				data[childrenField] = datas[index][childrenField];
			datas.splice(index, 1, data);
		}
	};

	const removeItem = function (item) {
		doNodeHideAnimate.call(this, item);

		let container = item.parent();
		let index = item.index();
		if (container.is(".root")) {
			let datas = this.getData();
			if (datas && index < datas.length)
				datas.splice(index, 1);
		}
		else {
			let data = this._getItemData(container.parent());
			let childrenField = this.getChildrenField() || "children";
			if (Utils.isArray(data[childrenField]) && index < data[childrenField].length)
				data[childrenField].splice(index, 1);
		}

		setTimeout(() => {
			item.remove();
			if (!container.is(".root")) {
				item = container.parent();
				let children = container.children();
				if (children.length > 0) {
					setParentSelected(children.eq(0));
				}
				else {
					container.remove();
					if (item.is(".selected_")) {
						item.removeClass("selected_");
						setParentSelected(item);
					}
				}
			}
		}, 220);
	};

	const getItemByIndex = function (index, deep) {
		index = Utils.getIndexValue(index);
		if (index < 0)
			return null;
		let findItem = null;
		doLoop.call(this, (item, nodeIndex) => {
			if (index == nodeIndex) {
				findItem = item;
				return false;
			}
			if (!deep && !item.is(".open"))
				return true;
		});
		return findItem;
	};

	const getItemById = function (id, deep) {
		if (Utils.isBlank(id))
			return null;
		let findItem = null;
		doLoop.call(this, (item) => {
			let _id = getItemId.call(this, item);
			if (id == _id) {
				findItem = item;
				return false;
			}
			if (!deep && !item.is(".open"))
				return true;
		});
		return findItem;
	};

	const getItemByData = function (data, deep) {
		let findItem = null;
		let dataId = this._getDataKey(data);
		doLoop.call(this, (item) => {
			let _data = this._getItemData(item);
			let isMatch = data == _data;
			if (!isMatch) {
				let _id = this._getDataKey(_data);
				isMatch = _id == dataId;
			}
			if (isMatch) {
				findItem = item;
				return false;
			}
			else if (!deep && !item.is(".open")) {
				return true;
			}
		});
		return findItem;
	};

	const getItemIndex = function (item, deep) {
		let index = -1;
		if (item && item.length > 0) {
			doLoop.call(this, (_item, _index) => {
				if (_item.is(item)) {
					index = _index;
					return false;
				}
				if (!deep && !_item.is(".open"))
					return true;
			});
		}
		return index;
	};

	const getItemId = function (item) {
		return this._getDataKey(this._getItemData(item));
	};

	const getItemData = function (item) {
		let data = item.children(".tree-node").data("itemData");
		if (Utils.isBlank(data)) {
			let index = 0;
			let nodeIndex = getItemIndex.call(this, item, true);
			let childrenField = this.getChildrenField() || "children";
			let _loop = (datas) => {
				for (let i = 0, l = datas.length; i < l; i++) {
					let data = datas[i];
					if (index == nodeIndex)
						return data;
					index += 1;
					if (Utils.isArray(data[childrenField])) {
						data = _loop(data[childrenField]);
						if (data)
							return data;
					}
				}
			};
			data = _loop(this.getData());
		}
		return data;
	};

	// 遍历树，
	// callback 返回true时结束本节点（包括子节点）的遍历，并继续遍历其他节点。返回false时结束本次遍历
	const doLoop = function (callback) {
		let nodeIndex = 0;
		let _loop = function (container) {
			let nodeLevel = parseInt(container.attr("level")) || 0;
			let items = container.children();
			for (let i = 0, l = items.length; i < l; i++) {
				let item = items.eq(i);
				if (item.is(".more,.loading"))
					continue;
				let result = callback(item, nodeIndex, nodeLevel);
				nodeIndex += 1;
				if (result === false)
					return true;
				if (result !== true) {
					result = _loop(item.children("ul"));
					if (result)
						return true;
				}
			}
		};
		_loop(this._getItemContainer());
	};

	// ====================================================
	const findItemByIndex = function (itemContainer, index, beOpen) {
		let nodeIndex = 0;
		let _find = (container) => {
			let items = container.children();
			for (let i = 0, l = items.length; i < l; i++) {
				let item = items.eq(i);
				if (nodeIndex == index)
					return item;
				nodeIndex += 1;
				if (!beOpen || item.is(".open")) {
					item = _find(item.children("ul"));
					if (item)
						return item;
				}
			}
			return null;
		};
		return _find(itemContainer);
	};

	const findItemById = function (itemContainer, id, beOpen) {
		let _find = (container) => {
			let items = container.children();
			for (let i = 0, l = items.length; i < l; i++) {
				let item = items.eq(i);
				let data = item.data(frontend ? "itemData" : "_node_data");
				let _id = this._getDataKey(data);
				if (_id == id)
					return item;
				if (!beOpen || item.is(".open")) {
					item = _find(item.children("ul"));
					if (item)
						return item;
				}
			}
			return null;
		};
		return _find(itemContainer);
	};

	const getNewItem = function ($, itemContainer, data, index) {
		let item = $("<li></li>").appendTo(itemContainer);
		let title = $("<div class='tree-node'></div>").appendTo(item);
		title.append("<span class='ep'></span>");
		if (this.isChkboxVisible())
			title.append("<span class='chkbox'><i></i></span>");
		if (this._isIconVisible())
			title.append("<span class='ic'><i></i></span>");
		title.append("<div class='lbl'></div>");
		return item;
	};

	const loadInner = function (container, api, params, callback) {
		doLoad.call(this, container, api, params, (err, datas) => {
			if (Utils.isFunction(callback)) {
				callback(err, datas);
			}
			tryAutoOpen.call(this);
		});
	};

	const tryAutoOpen = function () {
		let item = null;
		let openProps = this.openProps || {};
		if (openProps.indexs && openProps.indexs.length > 0) {
			item = getItemByIndex.call(this, openProps.indexs[0], true);
			if (item) {
				openProps.indexs.shift();
			}
		}
		else if (openProps.ids) {
			for (let i = 0; i < openProps.ids.length; i++) {
				item = getItemById.call(this, openProps.ids[i], true);
				if (item) {
					openProps.ids.splice(i, 1);
					break;
				}
			}
		}
		if (item) {
			item.addClass("open");
			let node = item.parent();
			while (node && node.length > 0 && !node.is(".root")) {
				node = node.parent().addClass("open").parent();
			}
			if (!item.is(".is-loaded") && item.children("ul").children().length == 0) {
				let api = this.lastLoadApi || this.$el.attr("api-name");
				if (Utils.isBlank(api)) {
					tryAutoOpen.call(this);
				}
				else {
					let params = this.lastLoadParams || this.getInitParams();
					params = Utils.extend({}, params, {pid: getItemId.call(this, item)});
					loadInner.call(this, item, api, params);
				}
			}
			else {
				tryAutoOpen.call(this);
			}
		}
	};

	// ====================================================
	const doNodeShowAnimate = function (nodeItem) {
		nodeItem.addClass("open");
		let target = nodeItem.children("ul");
		if (target && target.length > 0) {
			target.height(0);
			Utils.nextTick(() => {
				target.addClass("animate-in");
				target.height(target[0].scrollHeight);
				setTimeout(() => {
					target.css("height", "");
				}, 300);
			});
		}
	};

	const doNodeHideAnimate = function (nodeItem) {
		let target = nodeItem.children("ul");
		if (target && target.length > 0) {
			target.addClass("animate-out");
			target.height(target[0].scrollHeight);
			setTimeout(() => {
				target.height(0);
				setTimeout(() => {
					nodeItem.removeClass("open");
					target.removeClass("animate-in").removeClass("animate-out");
					target.css("height", "");
				}, 300);
			}, 0);
		}
		else {
			nodeItem.removeClass("open");
		}
	};

	// ====================================================
	// 检查所有节点的选中状态(存在连带状态)
	// 根据当前选中的节点，上下反推所有节点的选中状态
	const checkChildrenSelect = function (itemContainer, isParentSelected) {
		let items = itemContainer.children();
		if (items && items.length > 0) {
			let hasSelected = false;
			let allSelected = true;
			for (let i = 0, l = items.length; i < l; i++) {
				let item = items.eq(i);
				// item.removeClass("selected").removeClass("selected_");
				let subContainer = item.children("ul");
				if (isParentSelected || item.is(".selected")) {
					hasSelected = true;
					item.addClass("selected");
					// 向下选中所有子节点
					if (this.isMultiple())
						checkChildrenSelect.call(this, subContainer, true);
				}
				else {
					// 看看子节点有没有选中的
					let state = checkChildrenSelect.call(this, subContainer, false);
					if (state == "all") {
						// 全部子节点都选中了，当然父节点也要选中
						item.addClass(this.isMultiple() ? "selected" : "selected_");
						hasSelected = true;
					}
					else if (state == "part") {
						item.addClass("selected_"); // 部分子节点选中，当前父节点做标记
						hasSelected = true;
						allSelected = false;
					}
					else {
						allSelected = false;
					}
				}
			}
			return allSelected ? "all" : (hasSelected ? "part" : null);
		}
		return null;
	};

	const getOpenIndex = function (value) {
		if (Utils.isBlank(value))
			return [];
		if (!Utils.isArray(value))
			value = ("" + value).split(",");
		let indexs = [];
		Utils.each(value, (tmp) => {
			if (isNaN(tmp))
				return ;
			tmp = parseInt(tmp);
			if (!isNaN(tmp) && tmp >= 0) {
				indexs.push(tmp);
			}
		});
		return indexs;
	};

	const getOpenKey = function (value) {
		if (Utils.isBlank(value))
			return [];
		if (!Utils.isArray(value))
			value = ("" + value).split(",");
		let ids = [];
		Utils.each(value, (tmp) => {
			if (tmp || tmp === 0) {
				ids.push(isNaN(tmp) ? tmp : parseInt(tmp));
			}
		});
		return ids;
	};

	const getIcon = function (value, data, index) {
		if (Utils.isFunction(value))
			return value(data, index);
		if (value === true || value == 1)
			value = "icon";
		if (typeof value == "string") {
			if (/\/|\./.test(value)) // 文件路径
				return value;
			return data && data[value] || null;
		}
		return null;
	};
	
	///////////////////////////////////////////////////////
	if (frontend) {
		window.UITree = UITree;
		UI.init(".ui-tree", UITree, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");