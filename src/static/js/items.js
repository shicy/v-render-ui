// 2019-04-18

(function (frontend) {
	if (frontend && VRender.Component.ui._items)
		return ;

	const UI = frontend ? VRender.Component.ui : require("./init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UIItems = UI._items = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIItems = UIItems.prototype = new UI._base(false);

	// ====================================================
	UIItems.init = function (view, options) {
		UI._base.init.call(this, view, options);
		this._initPager();
		this._checkIfEmpty();
	};

	UIItems.doAdapter = function (datas) {
		return Renderer.doAdapter.call(this, datas);
	};

	UIItems.renderItems = function (itemContainer, datas) {
		Renderer.renderItems.call(this, $, itemContainer, datas);
		this._checkIfEmpty();
	};

	// 渲染单个列表项
	UIItems.renderOneItem = function (item, container, data, index) {
		return Renderer.renderOneItem.call(this, $, item, container, data, index);
	};

	// ----------------------------------------------------
	// 添加列表项
	UIItems.addItem = function (data, index, datas) {
		index = Utils.getIndexValue(index);
		data = Fn.doAdapter.call(this, data, index);

		datas = datas || this.getData();

		let newItem = null;
		let itemContainer = this._getItemContainer();
		if (itemContainer && itemContainer.length > 0) {
			newItem = this._getNewItem($, itemContainer, data, index);
			if (newItem) {
				if (index >= 0 && index < datas.length) {
					let items = this._getItems();
					if (items && items.length > 0)
						items.eq(index).before(newItem);
				}
				this._renderOneItem($, newItem, data, index);
			}
			this._checkIfEmpty();
		}

		if (index >= 0 && index < datas.length)
			datas.splice(index, 0, data);
		else 
			datas.push(data);

		return newItem;
	};

	// 更新列表项，index无效时将被忽略
	UIItems.updateItem = function (data, index, datas) {
		data = Fn.doAdapter.call(this, data, index);
		if (!index && index !== 0)
			index = this.getDataIndex(data);
		else
			index = Utils.getIndexValue(index);
		if (index >= 0) {
			datas = datas || this.getData();
			if (index < datas.length) {
				let itemContainer = this._getItemContainer();
				if (itemContainer && itemContainer.length > 0) {
					let items = this._getItems();
					let newItem = this._getNewItem($, itemContainer, data, index);
					if (newItem) {
						items.eq(index).before(newItem).remove();
						this._renderOneItem($, newItem, data, index);
					}
					else {
						items.eq(index).remove();
					}
				}
				this._checkIfEmpty();
				datas.splice(index, 1, data);
			}
			else {
				index = -1;
			}
		}
		return index;
	};

	// 删除列表项
	UIItems.removeItem = function (item, index, datas) {
		if (item && item.length > 0)
			index = item.index();
		else {
			index = Utils.getIndexValue(index);
			if (index < 0)
				return null;
			let items = this._getItems();
			if (items && items.length > index)
				item = items.eq(index);
		}

		if (item && item.length > 0) {
			item.remove();
			this._checkIfEmpty();
		}

		datas = datas || this.getData();
		if (datas && index < datas.length) {
			return datas.splice(index, 1);
		}

		return null;
	};

	// ----------------------------------------------------
	UIItems.initPager = function () {
		if (this.options.hasOwnProperty("pager"))
			this.setPaginator(this.options.pager);
		else {
			let pager = this.$el.attr("opt-pager");
			if (pager) {
				pager = $(pager);
				if (pager && pager.length > 0) {
					pager = VRender.Component.get(pager) || VRender.FrontComponent.get(pager) || pager;
					this.setPaginator(pager);
				}
			}
			this.$el.removeAttr("opt-pager");
		}
	};

	UIItems.setPager = function (pager) {
		if (this.pager) {
			if (Utils.isFunction(this.pager.off))
				this.pager.off("change");
		}
		this.pager = pager;
		if (pager && Utils.isFunction(pager.on)) {
			pager.on("change", (e, data) => {
				let params = $.extend({}, this.lastLoadParams);
				params.p_no = data && data.page;
				params.p_size = data && data.size;
				if (!params.p_no && Utils.isFunction(pager.getPage))
					params.p_no = pager.getPage();
				if (!params.p_size && Utils.isFunction(pager.getSize))
					params.p_size = pager.getSize();
				// if (Utils.isFunction(this.setData))
				// 	this.setData(null);
				let pageInfo = this._pageInfo || {};
				if (params.p_no != pageInfo.page || params.p_size != pageInfo.size)
					this.load(this.lastLoadApi, params);
			});
		}
	};

	// ----------------------------------------------------
	// 判断是否为空
	UIItems.checkIfEmpty = function () {
		let items = this._getItems();
		if (items && items.length > 0)
			this.$el.removeClass("is-empty");
		else
			this.$el.addClass("is-empty");
	};

	// 判断组件或组件列表项是否可用
	// 参数为字符串时判断名称对应列表项，为数字时判断索引对应的列表项，否则返回组件是否可用
	UIItems.isDisabled = function (value) {
		if (typeof value === "number") {
			let item = this._getItemAt(value);
			return !item || item.is(".disabled");
		}
		if (typeof value === "string") {
			return this.isDisabled(this.getIndexByName(value));
		}
		return this.$el.is(".disabled");
	};

	// 设置组件或列表项是否可用
	UIItems.setDisabled = function (disabled, value) {
		if (typeof value === "string") {
			return this.setDisabled(disabled, this.getIndexByName(value));
		}
		let target = this.$el;
		if (typeof value === "number") {
			target = this._getItemAt(value);
		}
		if (target) {
			disabled = (Utils.isNull(disabled) || Utils.isTrue(disabled)) ? true : false;

			if (disabled)
				target.addClass("disabled").attr("disabled", "disabled");
			else
				target.removeClass("disabled").removeAttr("disabled");

			if (Utils.isFunction(this.getDisableField)) {
				let disableField = this.getDisableField();
				if (disableField) {
					let data = this._getItemData(target);
					if (data)
						data[disableField] = disabled;
				}
			}
		}
	};

	// ====================================================
	_UIItems.init = function (view, options) {
		return UIItems.init.call(this, view, options);
	};

	_UIItems.setData = function (value) {
		this.options.data = this._doAdapter(value);
		this.rerender();
	};

	// 获取某索引对应的数据
	_UIItems.getDataAt = function (index) {
		index = Utils.getIndexValue(index);
		if (index < 0)
			return null;
		let datas = this.getData() || [];
		return index < datas.length ? datas[index] : null;
	};

	// 获取数据在列表中的索引
	_UIItems.getDataIndex = function (data) {
		let datas = this.getData();
		if (datas && datas.length > 0) {
			let _key = this._getDataKey(data);
			return Utils.index(datas, (temp) => {
				return temp == data || this._getDataKey(temp) == _key;
			});
		}
		return -1;
	};

	_UIItems.getDataByKey = function (key) {
		return this.getDataAt(this.getIndexByKey(key));
	};

	_UIItems.getIndexByKey = function (key) {
		let datas = this.getData();
		if (datas && datas.length > 0) {
			return Utils.index(datas, (temp) => {
				return this._getDataKey(temp) == key;
			});
		}
		return -1;
	};

	_UIItems.getDataByName = function (name) {
		return this.getDataAt(this.getIndexByName(name));
	};

	// 根据 name 属性获取索引
	_UIItems.getIndexByName = function (name) {
		let datas = this.getData();
		if (datas && datas.length > 0) {
			return Utils.indexBy(datas, "name", name);
		}
		return -1;
	};

	// ----------------------------------------------------
	// 获取组件数据代表唯一编号的字段名称
	_UIItems.getKeyField = function () {
		return this.options.keyField || this.$el.attr("opt-key");
	};

	// 设置组件数据代表唯一编号的字段名称
	_UIItems.setKeyField = function (value) {
		value = Utils.trimToEmpty(value);
		if (this.getKeyField() != value) {
			this.options.keyField = value;
			this.$el.attr("opt-key", this.options.keyField);
			this.rerender();
		}
	};

	// 获取用来显示组件数据的字段名称
	_UIItems.getLabelField = function () {
		return this.options.labelField || this.$el.attr("opt-lbl");
	};

	// 设置用来显示组件数据的字段名称
	_UIItems.setLabelField = function (value) {
		value = Utils.trimToEmpty(value);
		if (this.getLabelField() != value) {
			this.options.labelField = value;
			this.$el.attr("opt-lbl", this.options.labelField);
			this.rerender();
		}
	};

	// 获取用来显示组件数据的方法，如：function (data) { return data.name; }
	_UIItems.getLabelFunction = function () {
		return Fn.getFunction.call(this, "labelFunction", "lblfunc");
	};

	// 设置用来显示组件数据的方法，如：function (data) { return data.name; };
	_UIItems.setLabelFunction = function (value) {
		if (this.getLabelFunction() != value) {
			this.options.labelFunction = value;
			this.$el.children(".ui-fn[name='lblfunc']").remove();
			this.rerender();
		}
	};

	// 获取项渲染器
	_UIItems.getItemRenderer = function () {
		if (this.options.hasOwnProperty("renderer"))
			return this.options.renderer;
		return Fn.getFunction.call(this, "itemRenderer", "irender");
	};

	// 设置项渲染器
	_UIItems.setItemRenderer = function (value) {
		if (this.getItemRenderer() != value) {
			this.options.itemRenderer = value;
			delete this.options.renderer;
			this.$el.children(".ui-fn[name='irender']").remove();
			this.rerender();
		}
	};

	_UIItems.getPaginator = function () {
		return this.pager;
	};

	_UIItems.setPaginator = function (value) {
		UIItems.setPager.call(this, value);
	};

	_UIItems.length = function () {
		return Utils.toArray(this.getData()).length;
	};

	_UIItems.isDisabled = function (index) {
		return UIItems.isDisabled.call(this, index);
	};

	_UIItems.setDisabled = function (disabled, index) {
		UIItems.setDisabled.call(this, disabled, index);
	};

	// ----------------------------------------------------
	// 添加列表项
	// index添加项到指定索引位置
	_UIItems.addItem = function (data, index) {
		return UIItems.addItem.call(this, data, index);
	};

	// 更新列表项，index无效时将被忽略
	_UIItems.updateItem = function (data, index) {
		return UIItems.updateItem.call(this, data, index);
	};

	// 删除列表项
	_UIItems.removeItem = function (data) {
		return this.removeItemAt(this.getDataIndex(data));
	};

	// 删除列表项
	_UIItems.removeItemAt = function (index) {
		return UIItems.removeItem.call(this, null, index);
	};

	// 添加或更新列表项
	_UIItems.addOrUpdateItem = function (data) {
		let index = this.getDataIndex(data);
		if (index >= 0)
			this.updateItem(data, index);
		else
			this.addItem(data, index);
	};

	// ----------------------------------------------------
	// 获取列表项数据，target可以是列表里任意标签
	_UIItems.getItemData = function (target) {
		let item = $(target);
		if (item && item.length > 0) {
			let itemContainer = this._getItemContainer();
			if (itemContainer && itemContainer.length > 0) {
				target = item.parent();
				while (true) {
					if (!target || target.length == 0) {
						item = null;
						break;
					}
					if (target.is(itemContainer)) {
						break;
					}
					item = target;
					target = item.parent();
				}
				if (item && item.length > 0)
					return this._getItemData(item);
			}
		}
		return null;
	};

	// 加载更多（下一页）
	_UIItems.more = function (callback) {
		if (this.lastLoadApi && this.hasMore() && !this.isLoading()) {
			let params = Utils.extend({}, this.lastLoadParams);
			params.p_no = parseInt(this._pageInfo && this._pageInfo.page) || 0;
			params.p_no += 1;

			if (Utils.isFunction(this._moreBefore))
				this._moreBefore(this.lastLoadApi, params);
			else if (Utils.isFunction(this._loadBefore))
				this._loadBefore(this.lastLoadApi, params);

			Fn.load.call(this, this.lastLoadApi, params, (err, data) => {
				if (!err && Utils.isArray(data)) {
					if (Utils.isFunction(this.addItem)) {
						Utils.each(data, (temp) => {
							this.addItem(temp);
						});
					}
					else {
						let datas = this.options.data || [];
						this.options.data = datas.concat(data);
					}
				}
				setTimeout(() => {
					if (Utils.isFunction(this._moreAfter))
						this._moreAfter(err, data);
					else if (Utils.isFunction(this._loadAfter))
						this._loadAfter(err, data);
					if (Utils.isFunction(callback))
						callback(err, data);
					this.trigger("loaded", err, data);
				});
			});

			return true;
		}
		return false;
	};

	// 加载某一页
	_UIItems.loadPage = function (page, callback) {
		if (this.lastLoadApi && !this.isLoading()) {
			let params = Utils.extend({}, this.lastLoadParams);
			params.p_no = parseInt(page) || 1;
			this.load(null, params, callback);
		}
	};

	_UIItems.hasMore = function () {
		if (this._pageInfo) {
			let page = parseInt(this._pageInfo.page) || 1;
			let size = parseInt(this._pageInfo.size) || 20;
			let total = parseInt(this._pageInfo.total) || 0;
			return page * size < total;
		}
		return false;
	};

	_UIItems.isEmpty = function () {
		if (this.$el.is(".is-empty"))
			return true;
		let datas = this.getData();
		return !datas || datas.length == 0;
	};

	_UIItems.rerender = function () {
		Utils.debounce("ui_render-" + this.getViewId(), () => {
			let itemContainer = this._getItemContainer();
			if (itemContainer && itemContainer.length > 0) {
				this._renderItems($, itemContainer.empty(), this.getData());
			}
		});
	};

	// ----------------------------------------------------
	_UIItems._doAdapter = function (datas) {
		return UIItems.doAdapter.call(this, datas);
	};

	// 获取选项容器
	_UIItems._getItemContainer = function () {
		return this.$el;
	};

	// 新建一个列表项
	_UIItems._getNewItem = function ($, itemContainer, data, index) {
		return $("<li></li>").appendTo(itemContainer);
	};

	// 渲染列表项
	_UIItems._renderItems = function ($, itemContainer, datas) {
		UIItems.renderItems.call(this, itemContainer, datas);
	};

	// 渲染单个列表项
	_UIItems._renderOneItem = function ($, item, data, index) {
		return UIItems.renderOneItem.call(this, item, null, data, index);
	};

	_UIItems._isDisabled = function (data, index) {
		if (data) {
			let options = this.options;
			if (!options.hasOwnProperty("disableField"))
				options.disableField = this.$el.attr("opt-disabled");
			let disableField = options.disableField;
			if (disableField && data.hasOwnProperty(disableField)) {
				return Utils.isTrue(data[disableField]);
			}
		}
		return false;
	};

	// 获取所有列表项，确保返回jQuery对象
	_UIItems._getItems = function (selector) {
		let itemContainer = this._getItemContainer();
		if (itemContainer && itemContainer.length > 0)
			return itemContainer.children(selector);
	};

	// 获取某索引的列表项
	_UIItems._getItemAt = function (index) {
		index = Utils.getIndexValue(index);
		if (index >= 0) {
			return Utils.find(this._getItems(), (item, i) => {
				let _index = parseInt(item.attr("opt-ind"));
				if (isNaN(_index))
					_index = i;
				return index == _index;
			});
		}
		return null;
	};

	// 获取选项绑定的数据
	_UIItems._getItemData = function (item, index) {
		let data = item.data("itemData");
		if (!data) {
			let datas = this.getData();
			if (Utils.isArray(datas)) {
				if (isNaN(index) || !(index || index === 0)) {
					index = parseInt(item.attr("opt-ind"));
					if (isNaN(index))
						index = item.index();
				}
				data = datas[index];
			}
		}
		return Utils.isEmpty(data) ? null : data;
	};

	// ----------------------------------------------------
	_UIItems._initPager = function () {
		UIItems.initPager.call(this);
	};

	_UIItems._checkIfEmpty = function () {
		UIItems.checkIfEmpty.call(this);
	};

	_UIItems._getLoadText = function () {
		return this.options.loadingText;
		// return Utils.isNull(loadText) ? "正在加载.." : Utils.trimToEmpty(loadText);
	};

	_UIItems._getLoadView = function () {
		return this.options.loadingView;
	};

	_UIItems._getMoreText = function () {
		return this.options.moreText;
		// return Utils.isNull(moreText) ? "加载更多" : Utils.trimToEmpty(moreText);
	};

	_UIItems._getMoreView = function () {
		return this.options.moreView;
	};

	_UIItems._getEmptyText = function () {
		return this.options.emptyText || this.options.empty;
		// return Utils.isNull(emptyText) ? "没有数据" : Utils.trimToEmpty(emptyText);
	};

	_UIItems._getEmptyView = function () {
		return this.options.emptyView;
	};

	///////////////////////////////////////////////////////
	const Renderer = UI._itemsRender = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	// ====================================================
	Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);

		target.attr("opt-key", Utils.trimToNull(this.getKeyField()));
		target.attr("opt-lbl", Utils.trimToNull(this.getLabelField()));
		target.attr("opt-disable", Utils.trimToNull(this.options.disableField));

		Fn.renderFunction(target, "lblfunc", this.getLabelFunction());
		Fn.renderFunction(target, "irender", this.getItemRenderer());

		this._renderItems($, target);
		this._renderEmptyView($, target);
		this._renderLoadView($, target);
		this._renderPager($, target);
	};

	Renderer.renderData = function ($, target, datas) {
		datas = Utils.toArray(datas) || [];
		if (datas.length > 0) {
			let dataMapper = this.getDataMapper();
			if (Utils.isFunction(dataMapper)) {
				datas = Utils.map(datas, dataMapper);
			}
		}
		target.attr("data-items", escape(JSON.stringify(datas)));
	};

	Renderer.renderItems = function ($, itemContainer, datas) {
		datas = datas || this.getData();
		if (datas && datas.length > 0) {
			let items = this._render_items = [];
			Utils.each(datas, (data, i) => {
				let item = this._getNewItem($, itemContainer, data, i);
				if (item) {
					items.push({item: item, data: data, index: i});
					this._renderOneItem($, item, data, i);
				}
			});
			setTimeout(() => {
				this._render_items = null; // 释放变量
			});
		}
	};

	// 渲染单个列表项
	Renderer.renderOneItem = function ($, item, container, data, index) {
		if (!frontend) {
			this.renderItemData($, item, data);
		}
		else {
			item.data("itemData", data);
		}

		if (this._isDisabled(data, index)) {
			item.addClass("disabled").attr("disabled", "disabled");
		}
		
		container = container || item;
		let itemRenderer = this.getItemRenderer();
		if (Utils.isFunction(itemRenderer)) {
			let result = null;
			if (itemRenderer._state)
				result = itemRenderer.call(this, $, item, data, index);
			else
				result = itemRenderer.call(this, $, item, data, index);
			if (Utils.isNotNull(result))
				container.empty().append(result);
		}
		else {
			let label = this._getDataLabel(data, index);
			container.html(Utils.isNull(label) ? "" : label);
		}
	};

	// 渲染分页设置
	Renderer.renderPager = function ($, target, pager) {
		if (!frontend) {
			if (!pager && Utils.isFunction(this.getPaginator))
				pager = this.getPaginator();
			if (pager) {
				if (typeof pager == "string") {
					target.attr("opt-pager", Utils.trimToNull(pager));
				}
				else if (Utils.isFunction(pager.getViewId)) {
					target.attr("opt-pager", "[vid='" + pager.getViewId() + "']");
				}
			}
		}
	};

	// 渲染空视图
	Renderer.renderEmptyView = function ($, target, className) {
		let container = $("<div></div>").appendTo(target);
		container.addClass((className || "ui") + "-empty");
		let emptyView = Utils.isFunction(this._getEmptyView) ? this._getEmptyView() : this.options.emptyView;
		if (emptyView) {
			Fn.renderSubView.call(this, container, emptyView);
		}
		else {
			emptyView = $("<div></div>").appendTo(container);
			emptyView.addClass((className || "ui") + "-emptydef");
			let emptyText = this.options.emptyText || this.options.empty;
			if (Utils.isFunction(this._getEmptyText))
				emptyText = this._getEmptyText();
			emptyText = Utils.isNull(emptyText) ? "没有数据" : Utils.trimToEmpty(emptyText);
			if (emptyText) {
				$("<p></p>").appendTo(emptyView).text(emptyText);
			}
		}
		return container;
	};

	// 渲染加载视图
	Renderer.renderLoadView = function ($, target, className) {
		let container = $("<div></div>").appendTo(target);
		container.addClass((className || "ui") + "-load");
		let loadingView = Utils.isFunction(this._getLoadView) ? this._getLoadView() : this.options.loadingView;
		if (loadingView) {
			Fn.renderSubView.call(this, container, loadingView);
		}
		else {
			let loadView = $("<div></div>").appendTo(container);
			loadView.addClass((className || "ui") + "-loaddef");
			let loadText = Utils.isFunction(this._getLoadText) ? this._getLoadText() : this.options.loadingText;
			loadText = Utils.isNull(loadText) ? "正在加载.." : Utils.trimToEmpty(loadText);
			if (loadText) {
				$("<p></p>").appendTo(loadView).html(loadText);
			}
		}
		return container;
	};

	// 渲染更多视图
	Renderer.renderMoreView = function ($, target, className) {
		let container = $("<div></div>").appendTo(target);
		container.addClass((className || "ui") + "-more");
		if (this._pageInfo) {
			container.attr("page-no", this._pageInfo.page);
		}
		let moreView = Utils.isFunction(this._getMoreView) ? this._getMoreView() : this.options.moreView;
		if (moreView) {
			Fn.renderSubView.call(this, container, moreView);
		}
		else {
			let moreView = $("<div></div>").appendTo(container);
			moreView.addClass((className || "ui") + "-moredef");
			let moreText = Utils.isFunction(this._getMoreText) ? this._getMoreText() : this.options.moreText;
			moreText = Utils.isNull(moreText) ? "加载更多" : Utils.trimToEmpty(moreText);
			if (moreText) {
				$("<p></p>").appendTo(moreView).html(moreText);
			}
		}
		return container;
	};

	Renderer.doAdapter = function (datas) {
		datas = Utils.toArray(datas);
		if (datas._vr_adapter_flag)
			return datas;

		datas = Utils.map(datas, (temp, i) => {
			return Fn.doAdapter.call(this, temp, i);
		});
		datas._vr_adapter_flag = true;
		// this.options.data = datas;

		return datas;
	};

	// ====================================================
	_Renderer.render = function ($, target) {
		Renderer.render.call(this, $, target);
	};

	_Renderer.renderData = function ($, target) {
		if (!frontend) {
			Renderer.renderData.call(this, $, target, this.getData());
		}
	};

	// 渲染列表项数据
	_Renderer.renderItemData = function ($, item, data) {
		Fn.renderData.call(this, $, item, data);
	};

	// 渲染列表项
	_Renderer._renderItems = function ($, target) {
		let itemContainer = this._getItemContainer($, target);
		if (itemContainer) {
			Renderer.renderItems.call(this, $, itemContainer);
		}
	};

	// 新建一个列表项并返回
	// 参数 data 和 index 只用来判断创建标签类型，不建议生成列表项内容
	_Renderer._getNewItem = function ($, itemContainer, data, index) {
		return $("<li></li>").appendTo(itemContainer);
	};

	// 渲染单个列表项
	_Renderer._renderOneItem = function ($, item, data, index) {
		Renderer.renderOneItem.call(this, $, item, null, data, index);
	};

	// 渲染分页设置
	_Renderer._renderPager = function ($, target) {
		Renderer.renderPager.call(this, $, target);
	};

	// 渲染空视图
	_Renderer._renderEmptyView = function ($, target) {
		Renderer.renderEmptyView.call(this, $, target);
	};

	// 渲染加载视图
	_Renderer._renderLoadView = function ($, target) {
		Renderer.renderLoadView.call(this, $, target);
	};

	// 渲染更多视图
	_Renderer._renderMoreView = function ($, target) {
		Renderer.renderMoreView.call(this, $, target);
	};

	// ----------------------------------------------------
	_Renderer.getPaginator = function () {
		return this.options.paginator || this.options.pager;
	};

	// 获取用来代表数据编号的字段名称
	_Renderer.getKeyField = function () {
		return this.options.keyField;
	};

	// 获取用来显示数据文本的字段名称
	_Renderer.getLabelField = function () {
		return this.options.labelField;
	};

	// 获取用来显示数据文本的方法，较复杂的内容可以使用该方法
	_Renderer.getLabelFunction = function () {
		return this.options.labelFunction;
	};

	// 获取项渲染器
	_Renderer.getItemRenderer = function () {
		return this.options.itemRenderer;
	};

	// 获取列表项容器，默认是 target
	_Renderer._getItemContainer = function ($, target) {
		return target;
	};

	// 判断是否禁用项
	_Renderer._isDisabled = function (data, index) {
		if (data) {
			let disableField = this.options.disableField || "disabled";
			if (disableField && data.hasOwnProperty(disableField)) {
				return Utils.isTrue(data[disableField]);
			}
		}
		return false;
	};

	_Renderer._getDataLabel = function (data, index) {
		return Fn.getDataLabel.call(this, data, index);
	};

	_Renderer._doAdapter = function (datas) {
		return Renderer.doAdapter.call(this, datas);
	};
})(typeof window !== "undefined");