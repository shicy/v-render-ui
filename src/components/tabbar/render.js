// 2019-07-23
// tabbar

(function (frontend) {
	if (frontend && VRender.Component.ui.tabbar)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UITabbar = UI.tabbar = function (view, options) {
		return UI._select.call(this, view, options);
	};
	const _UITabbar = UITabbar.prototype = new UI._select(false);

	_UITabbar.init = function (target, options) {
		UI._select.init.call(this, target, options);

		this.tabsView = this.$el.find(".tabs");

		this.$el.on("tap", ".tab", itemClickHandler.bind(this));
		this.$el.on("tap", ".close", closeClickHandler.bind(this));

		if (this._isRenderAsApp()) {
			this.$el.on("touchstart", appTouchHandler.bind(this));
			this.$el.on("touchmove", appTouchHandler.bind(this));
			this.$el.on("touchend", appTouchHandler.bind(this));
		}
		else {
			this.$el.on("mousedown", ".btn", btnMouseHandler.bind(this));
			this.$el.on("mouseup", ".btn", btnMouseHandler.bind(this));
			this.$el.on("mouseleave", ".btn", btnMouseHandler.bind(this));

			initResizeEvents.call(this);
		}

		doLayout.call(this);
	};

	// ====================================================
	_UITabbar.close = function (value) {
		let item = null;
		if (typeof value === "number") {
			if (value >= 0)
				item = this.tabsView.find(".tab").eq(value);
		}
		else if (Utils.isNotBlank(value)) {
			item = this.tabsView.find(".tab[name='" + value + "']");
		}
		if (item && item.length > 0) {
			let data = this._getItemData(item);
			closeInner.call(this, item);
			return data;
		}
		return null;
	};

	// ====================================================
	_UITabbar.setSelectedIndex = function (value) {
		let index = Utils.getIndexValue(value);
		setActive.call(this, (index >= 0 ? this._getItems().eq(index) : null));
		doLayout.call(this);
	};

	_UITabbar.removeItemAt = function (index) {
		this.close(Utils.getIndexValue(index));
	};

	_UITabbar.isMultiple = function () {
		return false; // 只能是单选
	};

	_UITabbar.isClosable = function (value) {
		if (typeof value == "number") {
			let item = this._getItemAt(value);
			return item && item.is(".closable");
		}
		else if (typeof value == "string") {
			return this.isClosable(this.getIndexByName(value));
		}
		return false;
	};
	_UITabbar.setColsable = function (value, closable) {
		if (typeof value == "string") {
			return this.setColsable(closable, this.getIndexByName(value));
		}
		if (typeof value == "number") {
			let item = this._getItemAt(value);
			if (item && item.length > 0) {
				if (Utils.isNull(closable) || Utils.isTrue(closable)) {
					if (!item.is(".closable")) {
						item.addClass("closable").append("<i class='close'></i>");
					}
				}
				else if (item.is(".closable")) {
					item.removeClass("closable").children(".close").remove();
				}
			}
		}
	};

	// ====================================================
	_UITabbar._getItemContainer = function () {
		return this.$el.find(".tabs");
	};

	_UITabbar._getItems = function () {
		return this.$el.find(".tab");
	};

	_UITabbar._getNewItem = function ($, itemContainer, data, index) {
		return getNewItem.call(this, $, itemContainer, data, index);
	};

	_UITabbar._renderOneItem = function ($, item, data, index) {
		return renderOneItem.call(this, $, item, data, index);
	};

	// ====================================================
	const itemClickHandler = function (e) {
		let item = $(e.currentTarget);
		if (item.is(".disabled"))
			return ;
		this.trigger("itemclick", this._getItemData(item));
		setActive.call(this, item);
	};

	const btnMouseHandler = function (e) {
		let btn = $(e.currentTarget);

		if (this.btnMouseTimerId) {
			clearInterval(this.btnMouseTimerId);
			this.btnMouseTimerId = 0;
		}

		if (e.type == "mousedown") {
			let target = this.tabsView;
			let left = parseInt(target.attr("opt-l")) || 0;
			let step = ($(e.currentTarget).is(".prev") ? 1 : -1) * 20;
			this.btnMouseTimerId = setInterval(() => {
				left += step;
				scrollTo.call(this, left);
			}, 50);
		}
	};

	const appTouchHandler = function (e) {
		let touch = e.touches && e.touches[0];
		if (e.type === "touchstart") {
			this.touchData = {startX: touch.pageX};
			this.touchData.startL = parseInt(this.tabsView.attr("opt-l")) || 0;
		}
		else if (e.type === "touchmove") {
			if (e.touches.length > 1 || !this.$el.is(".over"))
				return ;

			let offset = touch.pageX - this.touchData.startX;
			if (!this.touchData.moving && Math.abs(offset) < 10)
				return ;
			this.touchData.moving = true;
			// this.touchData.lastOffset = offset;

			let left = this.touchData.startL + offset;
			scrollTo.call(this, left);
		}
		else if (e.type === "touchend") {
			//
		}
	};

	const closeClickHandler = function (e) {
		let item = $(e.currentTarget).parent();
		closeInner.call(this, item);
		return false;
	};

	const windowResizeHandler = function (e) {
		if (this.isMounted()) {
			layoutChanged.call(this);
		}
		else {
			$(window).off("resize._" + this.getViewId());
		}
	};
	
	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._selectRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._selectRender(false);

	_Renderer.render = function ($, target) {
		target.addClass("ui-tabbar");

		let tabbar = $("<div class='bar'></div>").appendTo(target);
		tabbar.append("<ul class='tabs'></ul>");
		tabbar.append("<div class='thumb'></div>");

		UI._selectRender.render.call(this, $, target);
		renderButtons.call(this, $, target);

		return this;
	};

	// ====================================================
	_Renderer.isMultiple = function () {
		return false;
	};
	
	// ====================================================
	_Renderer._renderOneItem = function ($, item, data, index) {
		renderOneItem.call(this, $, item, data, index);
	};

	_Renderer._getItemContainer = function ($, target) {
		return target.find(".tabs");
	};

	_Renderer._getNewItem = function ($, target) {
		return getNewItem.call(this, $, target);
	};

	_Renderer._renderEmptyView = function () {
		// do nothing
	};

	_Renderer._renderLoadView = function () {
		// do nothing
	};

	// ====================================================
	const renderOneItem = function ($, item, data, index) {
		let box = item.children(".box");
		UI._itemsRender.renderOneItem.call(this, $, item, box, data, index);
		data = data || {};
		if (Utils.isNotBlank(data.name))
			item.attr("name", data.name);
		if (Utils.isTrue(data.closable))
			item.addClass("closable").append("<i class='close'></i>");
	};

	const renderButtons = function ($, target) {
		target = $("<div class='btns'></div>").appendTo(target);
		target.append("<span class='btn prev'>&lt;</span>");
		target.append("<span class='btn next'>&gt;</span>");
	};

	///////////////////////////////////////////////////////
	const initResizeEvents = function () {
		let eventName = "resize._" + this.getViewId();
		let _window = $(window).off(eventName);
		_window.on(eventName, windowResizeHandler.bind(this));
		windowResizeHandler.call(this);
	};

	const doLayout = function () {
		layoutChanged.call(this);

		if (this.$el.is(".over")) {
			// 滚动到可见视图
			let selectedItem = this.tabsView.find(".tab.selected");
			if (selectedItem && selectedItem.length > 0) {
				let container = this.tabsView.parent();
				let itemOffset = selectedItem.offset().left;
				let containerOffset = container.offset().left;
				let left = parseInt(this.tabsView.attr("opt-l")) || 0;
				if (itemOffset < containerOffset) {
					scrollTo.call(this, left + containerOffset - itemOffset);
				}
				else if (itemOffset - containerOffset > container.width()) {
					scrollTo.call(this, left - 
						(itemOffset - containerOffset - container.width() + selectedItem.outerWidth()));
				}
			}
		}

		updateThumb.call(this);
	};

	const layoutChanged = function () {
		let target = this.tabsView;
		if (target.width() <= this.$el.width()) {
			this.$el.removeClass("over over-l over-r");
			scrollTo.call(this, 0);
		}
		else {
			this.$el.addClass("over");
			scrollTo.call(this, parseInt(target.attr("opt-l")) || 0);
		}
	};

	const scrollTo = function (position) {
		let w1 = this.tabsView.width();
		let w2 = this.tabsView.parent().width();

		if (position >= 0) {
			position = 0;
		}
		else {
			if (position + w1 < w2)
				position = w2 - w1;
		}

		this.$el.removeClass("over-l over-r");
		if (position < 0)
			this.$el.addClass("over-l");
		if (position + w1 > w2)
			this.$el.addClass("over-r");

		if (position) {
			this.tabsView.css("transform", "translate(" + position + "px,0px)");
			this.tabsView.attr("opt-l", position);
		}
		else {
			this.tabsView.css("transform", "").removeAttr("opt-l");
		}

		updateThumb.call(this);
	};

	const updateThumb = function () {
		if (this.thumbTimerId) {
			clearTimeout(this.thumbTimerId);
		}
		this.thumbTimerId = setTimeout(() => {
			this.thumbTimerId = 0;
			let thumb = this.$el.find(".thumb");
			let selectedItem = this.tabsView.find(".tab.selected");
			if (selectedItem && selectedItem.length > 0) {
				let left = selectedItem.offset().left;
				left -= this.tabsView.parent().offset().left;
				let width = selectedItem.outerWidth();
				let thumbWidth = this.options.thumbWidth;
				if (thumbWidth) {
					if (Utils.isFunction(thumbWidth))
						thumbWidth = thumbWidth(selectedItem, width);
					else if (/%$/.test(thumbWidth))
						thumbWidth = parseFloat(thumbWidth) * width;
					if (!isNaN(thumbWidth)) {
						left += (width - thumbWidth) / 2;
						width = thumbWidth;
					}
				}
				else if (this._isRenderAsApp()) {
					let innerWidth = selectedItem.width();
					left += (width - innerWidth) / 2;
					width = innerWidth;
				}
				thumb.css("left", left + "px");
				thumb.width(width);
			}
			else {
				thumb.width(0);
			}
		}, 100);
	};

	const setActive = function (item) {
		let hasItem = item && item.length > 0;
		if (hasItem && item.is(".selected"))
			return ;

		let index = hasItem ? item.index() : [];
		UI._select.setSelectedIndex.call(this, index);

		let oldItem = getSelectedTab.call(this), oldItemData = null;
		if (oldItem && oldItem.length > 0) {
			oldItem.removeClass("selected");
			oldItemData = this._getItemData(oldItem);
			this.trigger("hide", oldItemData);
		}

		let itemData = null;
		if (hasItem) {
			item.addClass("selected");
			itemData = this._getItemData(item);
			this.trigger("show", itemData);
		}

		updateThumb.call(this);

		this.trigger("change", itemData, oldItemData);
	};

	const closeInner = function (item) {
		let isSelected = item.is(".selected");
		let itemData = this._getItemData(item);
		let nextTab = null, nextData = null;

		if (isSelected) {
			nextTab = item.next();
			if (!nextTab || nextTab.length == 0)
				nextTab = item.prev();
			this.trigger("hide", itemData);
		}

		this.removeItem(item);
		this.trigger("close", itemData);

		if (nextTab && nextTab.length > 0) {
			nextTab.addClass("selected");
			nextData = this._getItemData(nextTab);
			this.trigger("show", nextData);
			UI._select.setSelectedIndex.call(this, nextTab.index());
		}
		else {
			UI._select.setSelectedIndex.call(this, []);
		}

		if (isSelected)
			this.trigger("change", nextData, itemData);

		layoutChanged.call(this);
	};

	const getNewItem = function ($, target) {
		let item = $("<li class='tab'></li>").appendTo(target);
		item.append("<div class='box'></div>");
		return item;
	};

	const getSelectedTab = function () {
		return this.tabsView.find(".tab.selected");
	};
	

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UITabbar = UITabbar;
		UI.init(".ui-tabbar", UITabbar, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");