// 2019-06-12
// popupmenu

(function (frontend) {
	if (frontend && VRender.Component.ui.popupmenu)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UIPopupMenu = UI.popupmenu = function (view, options) {
		return UI._items.call(this, view, options);
	};
	const _UIPopupMenu = UIPopupMenu.prototype = new UI._items(false);

	_UIPopupMenu.init = function (target, options) {
		UI._items.init.call(this, target, options);

		this.options.autoLoad = false;

		this.setActionTarget(this.getActionTarget());

		this.$el.on("tap", onClickHandler.bind(this));
		this.$el.on("tap", ".menu", onItemClickHandler.bind(this));
		this.$el.on("tap", ".more", onMoreClickHandler.bind(this));
		if (this._isRenderAsApp()) {
			this.$el.on("tap", ".back", onBackClickHandler.bind(this));
		}
		else {
			this.$el.on("mouseenter", ".menu", onItemMouseEnterHandler.bind(this));
			this.$el.on("mouseleave", ".menu", onItemMouseLeaveHandler.bind(this));
			this.$el.on("mouseenter", ".menu-container > .btn", onScrollMouseEnterHandler.bind(this));
			this.$el.on("mouseleave", ".menu-container > .btn", onScrollMouseLeaveHandler.bind(this));
		}
	};

	// ====================================================
	_UIPopupMenu.open = function () {
		let target = this.$el.show();
		doOpen.call(this, target);
		if (this._isRenderAsApp()) {
			$("body").addClass("ui-scrollless");
			setTimeout(() => {
				target.addClass("animate-open");
			});
		}
		else {
			setTimeout(() => {
				$("body").on(("click.hide_" + this.getViewId()), () => {
					this.close();
					this.trigger("cancel");
				});
			});
		}
	};

	_UIPopupMenu.close = function () {
		let target = this.$el;
		if (this._isRenderAsApp()) {
			$("body").removeClass("ui-scrollless");
			target.removeClass("animate-open");
			target.children(".menu-container").last().height(0);
			setTimeout(() => {
				target.empty().hide();
			}, 300);
		}
		else {
			target.empty().hide();
			$("body").off("click.hide_" + this.getViewId());
		}
	};

	_UIPopupMenu.destory = function () {
		this.close();
		setTimeout(() => {
			this.$el.remove();
		}, 300);
	};

	// ====================================================
	_UIPopupMenu.getActionTarget = function () {
		if (this.options.hasOwnProperty("actionTarget"))
			return this.options.actionTarget;
		this.options.actionTarget = Utils.trimToNull(this.$el.attr("opt-target"));
		this.$el.removeAttr("opt-target");
		return this.options.actionTarget;
	};
	_UIPopupMenu.setActionTarget = function (value) {
		if (this.actionTarget == value)
			return ;

		let actionType = Utils.trimToNull(this.getActionType()) || "tap";
		let eventType = actionType + "._" + this.getViewId();

		if (this.actionTarget) {
			if (typeof this.actionTarget == "string")
				$("body").off(eventType, this.actionTarget);
			else // if (Utils.isFunction(this.actionTarget.off))
				this.actionTarget.off(eventType);
		}

		this.actionTarget = value;
		if (this.actionTarget) {
			if (typeof this.actionTarget == "string")
				$("body").on(eventType, this.actionTarget, onActionTargetHandler.bind(this));
			else {
				this.actionTarget = $(this.actionTarget);
				this.actionTarget.on(eventType, onActionTargetHandler.bind(this));
			}
		}

		this.$el.removeAttr("opt-target");
	};

	_UIPopupMenu.getActionType = function () {
		if (this.options.hasOwnProperty("actionType"))
			return this.options.actionType;
		this.options.actionType = Utils.trimToNull(this.$el.attr("opt-trigger"));
		this.$el.removeAttr("opt-trigger");
		return this.options.actionType;
	};
	_UIPopupMenu.setActionType = function (value) {
		this.options.actionType = value;
		this.$el.removeAttr("opt-trigger");
	};

	_UIPopupMenu.getIconField = function () {
		if (this.options.hasOwnProperty("iconField"))
			return this.options.iconField;
		this.options.iconField = Utils.trimToNull(this.$el.attr("opt-ic")) || "icon";
		this.$el.removeAttr("opt-ic");
		return this.options.iconField;
	};
	_UIPopupMenu.setIconField = function (value) {
		this.options.iconField = value;
		this.$el.removeAttr("opt-ic");
	};

	_UIPopupMenu.getIconFunction = function () {
		return Fn.getFunction.call(this, "iconFunction", "icfunc");
	};
	_UIPopupMenu.setIconFunction = function (value) {
		this.options.iconFunction = value;
		this.$el.children(".ui-fn[name='icfunc']").remove();
	};

	_UIPopupMenu.getOffsetLeft = function () {
		if (!this.options.hasOwnProperty("offsetLeft")) {
			this.options.offsetLeft = this.$el.attr("opt-offsetl");
			this.$el.removeAttr("opt-offsetl");
		}
		if (this.options.offsetLeft)
			return Utils.getFormatSize(this.options.offsetLeft, this._isRenderAsRem());
		return null;
	};
	_UIPopupMenu.setOffsetLeft = function (value) {
		this.options.offsetLeft = value;
		this.$el.removeAttr("opt-offsetl");
	};

	_UIPopupMenu.getOffsetTop = function () {
		if (!this.options.hasOwnProperty("offsetTop")) {
			this.options.offsetTop = this.$el.attr("opt-offsett");
			this.$el.removeAttr("opt-offsett");
		}
		if (this.options.offsetTop)
			return Utils.getFormatSize(this.options.offsetTop, this._isRenderAsRem());
		return null;
	};
	_UIPopupMenu.setOffsetTop = function (value) {
		this.options.offsetTop = value;
		this.$el.removeAttr("opt-offsett");
	};

	// ====================================================
	// 以下供子类继承
	_UIPopupMenu._getChildrenField = function () {
		return "children";
	};

	_UIPopupMenu._getDisabledField = function () {
		return "disabled";
	};

	_UIPopupMenu._getIcon = function (data) {
		let iconFunction = this.getIconFunction();
		if (Utils.isFunction(iconFunction))
			return iconFunction(data);

		let iconField = this.getIconField();
		return (data && iconField) ? data[iconField] : null;
	};

	_UIPopupMenu._isDisabled = function (data) {
		if (data) {
			let disabledField = this._getDisabledField();
			if (disabledField) {
				if (Utils.isTrue(data[disabledField]))
					return true;
			}
			return false;
		}
		return true;
	};

	_UIPopupMenu._isChecked = function (data) {
		if (data) {
			return !!data.checked;
		}
		return false;
	};

	_UIPopupMenu._checkIfEmpty = function () {
		// do nothing
	};

	// ====================================================
	const onActionTargetHandler = function (e) {
		if (!this.isMounted(this.$el)) {
			this.setActionTarget(null);
		}
		else {
			this.open();
		}
	};

	const onClickHandler = function (e) {
		if (this._isRenderAsApp()) {
			if ($(e.target).is(".ui-popupmenu")) {
				this.close();
				this.trigger("cancel");
			}
		}
		return false;
	};

	const onItemClickHandler = function (e) {
		let item = $(e.currentTarget);
		if (item.is(".disabled"))
			return ;
		if (item.is(".has-child")) {
			if (this._isRenderAsApp())
				doOpen.call(this, item);
		}
		else {
			let data = getItemData.call(this, item);
			if (data.toggle) {
				if (!data.checked) {
					let _loop = (datas) => {
						if (!(datas && datas.length > 0))
							return ;
						Utils.each(datas, (_data) => {
							if (Utils.isArray(_data)) {
								_loop(_data);
							}
							else {
								if (_data.toggle === data.toggle)
									_data.checked = false;
								_loop(getSubDatas.call(this, _data));
							}
						});
					};
					_loop(this.getData());
					data.checked = true;
				}
				else if (!data.toggleRadio) {
					data.checked = false;
				}
			}
			this.trigger("itemclick", data);
			this.close();
		}
	};

	const onMoreClickHandler = function (e) {
		let item = $(e.currentTarget);
		let container = item.parent().parent().parent();

		let api = getLoadApi.call(this);
		let params = getLoadParams.call(this);

		params.p_no = parseInt(item.attr("page-no")) || 1;
		params.p_no += 1;

		let parentData = container.data("itemData");
		params.pid = this._getDataKey(parentData);

		item.parent().remove();
		let datas = !parentData ? this.getData() : getSubDatas.call(this, parentData);
		datas.pop();

		doLoad.call(this, container, api, params, (err, _datas) => {
			if (_datas && _datas.length > 0) {
				Utils.each(_datas, (temp) => {
					datas.push(temp);
				});
			}
		});
	};

	const onBackClickHandler = function (e) {
		let item = $(e.currentTarget);
		let container = item.parent();
		container.height(0);
		let prevContainer = container.prev();
		prevContainer.height(0);
		setTimeout(() => {
			container.remove();
			prevContainer.height(prevContainer.get(0).scrollHeight);
		}, 120);
	};

	const onItemMouseEnterHandler = function (e) {
		let item = $(e.currentTarget);
		if (item.is(".disabled"))
			return ;

		let container = item.parent().parent().parent();
		let lastItem = container.find(".hover");
		if (lastItem && lastItem.length > 0) {
			lastItem.removeClass("hover");
			closeAfter.call(this, container);

			let timerId = parseInt(lastItem.attr("t-hover"));
			if (timerId) {
				clearTimeout(timerId);
				lastItem.removeAttr("t-hover");
			}
		}

		item.addClass("hover");

		if (item.is(".has-child"))
			doOpen.call(this, item);
	};

	const onItemMouseLeaveHandler = function (e) {
		let item = $(e.currentTarget);
		let container = item.data("submenu");
		if (!container || container.length == 0) {
			let timerId = setTimeout(() => {
				item.removeClass("hover");
				item.removeAttr("t-hover");
			}, 100);
			item.attr("t-hover", timerId);
		}
	};

	const onScrollMouseEnterHandler = function (e) {
		let btn = $(e.currentTarget);
		let container = btn.parent();

		let _scroll = () => {
			let menuContainer = container.children(".menus");
			let maxHeight = container.height() - menuContainer.height();

			let top = parseInt(container.attr("scroll-top")) || 0;
			let step = btn.is(".up") ? 5 : -5;
			
			let __scroll = () => {
				let timerId = setTimeout(() => {
					let _top = top + step;
					if (btn.is(".up")) {
						if (_top > 0)
							_top = 0;
					}
					else {
						if (_top < maxHeight)
							_top = maxHeight;
					}
					if (top != _top) {
						top = _top;
						container.attr("scroll-top", top);
						menuContainer.css("transform", "translate(0px, " + top + "px)");
					}
					__scroll();
				}, 50);
				container.attr("t_scroll", timerId);
			};
			__scroll();
		};

		// 停留一段时间开始滚动
		container.attr("t_scroll", setTimeout(_scroll, 200));
	};

	const onScrollMouseLeaveHandler = function (e) {
		let container = $(e.currentTarget).parent();
		let timerId = parseInt(container.attr("t_scroll"));
		if (timerId) {
			clearTimeout(timerId);
			container.removeAttr("t_scroll");
		}
	};

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._itemsRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._itemsRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-popupmenu");

		let options = this.options || {};

		if (!frontend) {
			let actionTarget = options.actionTarget;
			if (actionTarget) {
				if (typeof actionTarget == "string")
					target.attr("opt-target", Utils.trimToEmpty(actionTarget));
				else if (Utils.isFunction(actionTarget.getViewId))
					target.attr("opt-target", "[vid='" + actionTarget.getViewId() + "']");
			}

			if (options.actionType)
				target.attr("opt-trigger", options.actionType);

			let iconFunction = options.iconFunction;
			if (Utils.isFunction(iconFunction))
				BaseRender.fn.renderFunction(target, "icfunc", iconFunction);
			else if (options.iconField)
				target.attr("opt-ic", options.iconField);

			if (options.childrenField)
				target.attr("opt-child", options.childrenField);

			if (options.disabledField)
				target.attr("opt-disable", options.disabledField);

			if (options.offsetLeft)
				target.attr("opt-offsetl", options.offsetLeft);
			if (options.offsetTop)
				target.attr("opt-offsett", options.offsetTop);
		}

		return this;
	};

	// ====================================================
	_Renderer.doAdapter = function (data, i) {
		if (Utils.isArray(data)) {
			let _data = Utils.map(data, (temp) => {
				return Fn.doAdapter.call(this, temp);
			});
			if (data.title) {
				if (backend)
					_data.unshift({__group__: data.title});
				else
					_data.title = data.title;
			}
			return _data;
		}
		return Fn.doAdapter.call(this, data, i);
	};

	// ====================================================
	_Renderer._renderItems = function ($, target) {
		// 统一在前端渲染
		// target.empty();
		// let datas = this.getData();
		// if (datas && datas.length > 0) {
		// 	let container = $("<div class='menu-container'></div>").appendTo(target);
		// 	container.append("<div class='btn up'></div>");
		// 	container.append("<ul class='menus'></ul>");
		// 	container.append("<div class='btn down'></div>");
		// 	renderItems.call(this, $, container.children("ul"), datas);
		// }
	};

	_Renderer._renderEmptyView = function () {
		// do nothing
	};

	_Renderer._renderLoadView = function () {
		// do nothing
	};

	// ====================================================
	const renderMenuItems = function (menuContainer, datas) {
		if (!datas || datas.length == 0)
			return ;
		let group = menuContainer.children(".grp").last();
		Utils.each(datas, (data, i) => {
			if (Utils.isArray(data) && data.length > 0) {
				group = $("<div class='grp'></div>").appendTo(menuContainer);
				if (data.title)
					$("<div class='title'></div>").appendTo(group).text(data.title);
				Utils.each(data, (temp, j) => {
					if (j === 0 && temp.__group__) {
						$("<div class='title'></div>").appendTo(group).text(temp.__group__);
					}
					else if (temp.__type__ == "more") {
						let more = $("<div class='more'></div>").appendTo(group);
						more.attr("page-no", temp.page);
						more.text(this.options.moreText || "加载更多");
					}
					else {
						let item = $("<div class='menu'></div>").appendTo(group);
						renderOneMenuItem.call(this, item, temp);
					}
				});
				group = null;
			}
			else {
				if (!group || group.length == 0)
					group = $("<div class='grp'></div>").appendTo(menuContainer);
				let item = $("<div class='menu'></div>").appendTo(group);
				renderOneMenuItem.call(this, item, data);
			}
		});
		if (this._isRenderAsApp()) {
			let container = menuContainer.parent();
			container.height(0);
			setTimeout(() => {
				container.height(container.get(0).scrollHeight);
			});
		}
	};
	
	const renderOneMenuItem = function (item, data) {
		item.data("itemData", data);

		let iconUrl = this._getIcon(data);
		if (Utils.isNotBlank(iconUrl)) {
			let icon = $("<i></i>").appendTo(item);
			icon.css("backgroundImage", "url(" + iconUrl + ")");
		}

		let content = $("<div></div>").appendTo(item);
		let itemRenderer = this.getItemRenderer();
		if (Utils.isFunction(itemRenderer)) {
			let result = itemRenderer($, content, data);
			if (Utils.isNotNull(result))
				content.empty().append(result);
		}
		else {
			let label = this._getDataLabel(data);
			content.text(Utils.trimToEmpty(label));
		}

		if (!!getSubDatas.call(this, data))
			item.addClass("has-child");
		if (this._isDisabled(data))
			item.addClass("disabled").attr("disabled", "disabled");
		if (this._isChecked(data))
			item.addClass("checked");
	};

	///////////////////////////////////////////////////////
	const doOpen = function (item) {
		let data = getItemData.call(this, item);
		let subDatas = getItemSubDatas.call(this, item);

		let datas = doOpenBefore.call(this, item, data, subDatas);
		if (Utils.isNull(datas)) {
			if (!tryLoadData.call(this, item))
				return ;
		}
		else if (!(datas && datas.length > 0)) {
			if (!tryLoadData.call(this, item))
				return ;
		}

		let container = $("<div class='menu-container'></div>").appendTo(this.$el);
		container.append("<div class='btn up'></div><div class='btn down'></div>");

		if (this._isRenderAsApp() && !isRootItem(item)) {
			$("<div class='back'></div>").appendTo(container).text(this.options.backText || "返回");
		}

		let menuContainer = $("<div class='menus'></div>").appendTo(container);
		renderMenuItems.call(this, menuContainer, datas);

		item.data("submenu", container);
		container.data("itemData", data);
		doOpenAfter.call(this, item, container);

		this.trigger("open", data);
	};

	const doOpenBefore = function (item, data, subDatas) {
		let event = {type: "open_before"};
		this.trigger(event, data, subDatas);
		if (event.hasOwnProperty("returnValue"))
			subDatas = event.returnValue;

		let datas = !!subDatas ? Utils.toArray(subDatas) : null;
		if (data) {
			let childrenField = this._getChildrenField();
			data[childrenField] = datas;
		}

		return datas;
	};

	const doOpenAfter = function (item, container) {
		if (!this._isRenderAsApp()) {
			let _isRootItem = isRootItem(item);
			if (_isRootItem) {
				container.css("left", this.getOffsetLeft() || "");
				container.css("top", this.getOffsetTop() || "");
			}
			else {
				let offset = item.offset();
				offset.top -= 3;
				offset.left += item.outerWidth() + 1;
				container.offset(offset);
			}

			let offset = Utils.offset(container);

			let maxHeight = offset.windowHeight;
			if (_isRootItem)
				maxHeight -= offset.top;
			container.css("maxHeight", maxHeight + "px");

			if (!_isRootItem) {
				let _offset = container.offset();
				if (offset.isOverflowX) {
					_offset.left -= offset.width + item.outerWidth();
				}
				if (offset.isOverflowY) {
					_offset.top -= offset.top + offset.height - offset.windowHeight;
				}
				container.offset({left: _offset.left, top: _offset.top});
			}

			if (container.height() < container.children(".menus").height())
				container.addClass("scroll").css("minHeight", "80px");
		}
	};

	const closeAfter = function (menuContainer) {
		let menus = this.$el.children(".menu-container");
		let index = menuContainer.index();
		for (let i = menus.length - 1; i >= 0; i--) {
			if (index >= i)
				return ;
			menus.eq(i).remove();
		}
	};
	
	// ====================================================
	const tryLoadData = function (item) {
		let apiName = getLoadApi.call(this);
		if (Utils.isBlank(apiName))
			return false;

		let apiParams = getLoadParams.call(this) || {};
		apiParams.p_no = 1;
		apiParams.pid = getItemId.call(this, item);

		setTimeout(() => {
			let container = item.data("submenu");
			doLoad.call(this, container, apiName, apiParams, (err, datas) => {
				let isEmpty = false
				if (!datas || datas.length == 0) {
					isEmpty = true;
					datas = [{label: "没有选项"}];
					datas[0][this._getDisabledField()] = true;
				}
				if (isRootItem(item))
					this.options.data = datas;
				else {
					let data = getItemData.call(this, item);
					if (data)
						data[this._getChildrenField()] = datas;
				}
				if (isEmpty) {
					renderMenuItems.call(this, container.children(".menus"), datas);
				}
			});
		}, 0);

		return true;
	};

	const doLoad = function (container, api, params, callback) {
		let menuContainer = container.children(".menus");
		let loadingGrp = $("<div class='grp'></div>").appendTo(menuContainer);
		let loadingItem = $("<div class='loading'></div>").appendTo(loadingGrp);
		loadingItem.append(this.options.loadingText || "正在加载...");

		VRender.Component.load.call(this, api, params, (err, data) => {
			loadingGrp.remove();
			let datas = !err ? Utils.toArray(data) : null;
			if (datas && datas.length > 0) {
				datas[0].children = [];

				if (this.hasMore()) {
					datas.push([{__type__: "more", page: this._pageInfo.page}]);
				}
				
				renderMenuItems.call(this, menuContainer, datas);
			}
			callback(err, datas);
		});
	};

	const getLoadApi = function () {
		if (this.lastLoadApi)
			return this.lastLoadApi;
		if (this.options.hasOwnProperty("api"))
			return this.options.api;
		return this.$el.attr("api-name");
	};

	const getLoadParams = function () {
		if (this.lastLoadParams)
			return this.lastLoadParams;
		if (this.options.hasOwnProperty("params"))
			return this.options.params;
		try {
			return JSON.parse(this.$el.attr("api-params") || null);
		}
		catch (e) {}
		return null;
	};

	// ====================================================
	const isRootItem = function (item) {
		return item.is(".ui-popupmenu");
	};

	const getItemId = function (item) {
		return this._getDataKey(getItemData.call(this, item));
	};

	const getItemData = function (item) {
		if (isRootItem(item))
			return null;
		return item.data("itemData");
	};

	const getItemSubDatas = function (item) {
		if (isRootItem(item))
			return this.getData();
		let data = getItemData.call(this, item);
		return getSubDatas.call(this, data);
	};

	const getSubDatas = function (data) {
		if (data) {
			let childrenField = this._getChildrenField();
			if (Utils.isArray(data[childrenField]))
				return data[childrenField];
		}
		return null;
	};

	// const hasSubDatas = function (data) {
	// 	let datas = getSubDatas.call(this, data);
	// 	if (!!datas)
	// 		return true;
	// 	if (data) {
	// 		if (data.hasOwnProperty("hasChild")) {
	// 			if (Utils.isTrue(data.hasChild))
	// 				return true;
	// 		}
	// 		if (data.hasOwnProperty("leaf")) {
	// 			if (Utils.isTrue(data.leaf))
	// 				return false;
	// 		}
	// 	}
	// 	return false;
	// };
	
	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIPopupMenu = UIPopupMenu;
		UI.init(".ui-popupmenu", UIPopupMenu, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");