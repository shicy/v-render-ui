// 2019-07-25
// scroll(原scrollbox)

(function (frontend) {
	if (frontend && VRender.Component.ui.scroll)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UIScroll = UI.scroll = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIScroll = UIScroll.prototype = new UI._base(false);

	_UIScroll.init = function (target, options) {
		UI._base.init.call(this, target, options);
		doInit.call(this);
	};

	_UIScroll.reset = function () {
	};

	// ====================================================
	_UIScroll.getContentView = function () {
		if (!this.contentView) {
			let content = this.$el.children(".container").children();
			if (content && content.length > 0) {
				if (content.length === 1)
					this.contentView = VRender.Component.get(content);
				if (!this.contentView)
					this.contentView = content;
			}
		}
		return this.contentView;
	};
	_UIScroll.setContentView = function (value) {
		clearContentEvents.call(this);
		let content = this.options.content = value;
		delete this.options.view;
		this.contentView = null;
		if (content) {
			let container = this.$el.children(".container").empty();
			container.append(content.$el || content);
		}
		initContentEvents.call(this);
	};

	_UIScroll.getScrollContainer = function () {
		if (!this.scroller) {
			if (this.options.hasOwnProperty("scroller"))
				this.scroller = this.options.scroller;
			else
				this.scroller = this.$el.attr("opt-scroll");
			this.$el.removeAttr("opt-scroll");
			this.scroller = !this.scroller ? this.$el : $(this.scroller);
		}
		return this.scroller;
	};
	_UIScroll.setScrollContainer = function (value) {
		clearEvents.call(this);
		this.options.scroller = value;
		this.scroller = null;
		initEvents.call(this);
	};

	_UIScroll.getRefreshFunction = function () {
		return Fn.getFunction.call(this, "refreshFunction", "refresh");
	};
	_UIScroll.setRefreshFunction = function (value) {
		this.options.refreshFunction = value;
	};

	_UIScroll.getMoreFunction = function () {
		return Fn.getFunction.call(this, "moreFunction", "more");
	};
	_UIScroll.setMoreFunction = function (value) {
		this.options.moreFunction = value;
	};

	_UIScroll.getTopDistance = function () {
		if (Utils.isNull(this.topDistance)) {
			if (this.options.hasOwnProperty("topDistance")) {
				this.topDistance = this.options.topDistance;
			}
			else {
				this.topDistance = this.$el.attr("opt-top");
				this.$el.removeAttr("opt-top");
			}
			if (!this.topDistance/* && this.topDistance !== 0*/)
				this.topDistance = this._isRenderAsRem() ? "0.5rem" : "50px";
			this.topDistance = Utils.toPx(this.topDistance);
		}
		return this.topDistance;
	};
	_UIScroll.setTopDistance = function (value) {
		this.options.topDistance = value;
		this.$el.removeAttr("opt-top");
		this.topDistance = null;
	};

	_UIScroll.getBottomDistance = function () {
		if (Utils.isNull(this.bottomDistance)) {
			if (this.options.hasOwnProperty("bottomDistance")) {
				this.bottomDistance = this.options.bottomDistance;
			}
			else {
				this.bottomDistance = this.$el.attr("opt-bottom");
				this.$el.removeAttr("opt-bottom");
			}
			if (!this.bottomDistance && this.bottomDistance !== 0)
				this.bottomDistance = this._isRenderAsRem() ? "0.7rem" : "70px";
			this.bottomDistance = Utils.toPx(this.bottomDistance);
		}
		return this.bottomDistance;
	};
	_UIScroll.setBottomDistance = function (value) {
		this.options.bottomDistance = value;
		this.$el.removeAttr("opt-bottom");
		this.bottomDistance = null;
	};

	// ====================================================
	const onScrollHandler = function (e) {
		let state = getScrollState.call(this, e);
		if (state.isUp) {
			if (state.bottom <= this.getBottomDistance())
				doMore.call(this, state);
		}
	};

	const onMouseHandler = function (e) {
		if (e.type == "mousedown") {
			dragStart.call(this, e);
		}
		else if (e.type == "mousemove") {
			dragMove.call(this, e);
		}
		else if (e.type == "mouseup") {
			dragEnd.call(this, e);
		}
		else if (e.type == "mouseleave") {
			dragEnd.call(this, e);
		}
		// return false;
	};

	const onTouchHandler = function (e) {
		if (e.type == "touchstart") {
			dragStart.call(this, e);
		}
		else if (e.type == "touchmove") {
			dragMove.call(this, e);
		}
		else if (e.type == "touchend") {
			dragEnd.call(this, e);
		}
		else if (e.type == "touchcancel") {
			dragEnd.call(this, e);
		}
		// return false;
	};

	const onContentLoadHandler = function () {
		this.$el.removeClass("is-loading").removeClass("is-refresh");
		checkIfEmpty.call(this);

		let container = this.$el.children(".container");
		if (container.outerHeight() < this.$el.height()) {
			setTimeout(() => {
				doMore.call(this);
			}, 10);
		}
	};

	const onContentItemChangeHandler = function () {
		if (this.itemChangeTimer) {
			clearTimeout(this.itemChangeTimer);
		}
		this.itemChangeTimer = setTimeout(() => {
			this.itemChangeTimer = 0;
			checkIfEmpty.call(this);
		}, 0);
	};
	
	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		target.addClass("ui-scroll");

		target.append("<div class='top'></div>");
		target.append("<div class='container'></div>");
		target.append("<div class='bottom'></div>");

		UI._baseRender.render.call(this, $, target);
		renderContentView.call(this, $, target);
		renderTopView.call(this, $, target);
		renderBottomView.call(this, $, target);
		renderEmptyView.call(this, $, target);

		if (!frontend) {
			let options = this.options || {};

			let scrollContainer = getScrollContainer.call(this);
			if (scrollContainer)
				target.attr("opt-scroll", scrollContainer);

			if (options.topDistance || options.topDistance === 0)
				target.attr("opt-top", options.topDistance);
			if (options.bottomDistance || options.bottomDistance === 0)
				target.attr("opt-bottom", options.bottomDistance);

			Fn.renderFunction(target, "refresh", options.refreshFunction);
			Fn.renderFunction(target, "more", options.moreFunction);
		}
		return this;
	};
	
	// ====================================================
	const renderContentView = function ($, target) {
		target = target.children(".container");
		let contentView = this.options.content || this.options.view;
		if (contentView) {
			renderView(target, contentView);
		}
	};

	const renderTopView = function ($, target) {
		target = target.children(".top").empty();
		let options = this.options || {};

		if (options.refreshView) {
			renderView(target, this.options.refreshView);
		}
		else {
			let refreshView = $("<div class='scroll-refreshdef'></div>").appendTo(target);

			let pullText = Utils.isNull(options.refreshPullText) ? "下拉刷新" : Utils.trimToEmpty(options.refreshPullText);
			if (pullText) {
				$("<div class='pull'></div>").appendTo(refreshView).text(pullText);
			}

			let dropText = Utils.isNull(options.refreshDropText) ? "松开刷新" : Utils.trimToEmpty(options.refreshDropText);
			if (dropText) {
				$("<div class='drop'></div>").appendTo(refreshView).text(dropText);
			}

			let loadText = Utils.isNull(options.refreshLoadText) ? "正在刷新.." : Utils.trimToEmpty(options.refreshLoadText);
			if (loadText) {
				$("<div class='load'></div>").appendTo(refreshView).text(loadText);
			}
		}
	};

	const renderBottomView = function ($, target) {
		target = target.children(".bottom").empty();

		let container = $("<div class='scroll-load'></div>").appendTo(target);
		if (this.options.loadingView) {
			renderView(container, this.options.loadingView);
		}
		else {
			let loadView = $("<div class='scroll-loaddef'></div>").appendTo(container);
			let loadText = this.options.loadingText;
			loadText = Utils.isNull(loadText) ? "正在加载.." : Utils.trimToEmpty(loadText);
			if (loadText) {
				$("<p></p>").appendTo(loadView).text(loadText);
			}
		}

		container = $("<div class='scroll-bottom'></div>").appendTo(target);
		if (this.options.bottomView) {
			renderView(container, this.options.bottomView);
		}
		else {
			let bottomView = $("<div class='scroll-bottomdef'></div>").appendTo(container);
			let bottomText = this.options.bottomText;
			bottomText = Utils.isNull(bottomText) ? "没有更多了" : Utils.trimToEmpty(bottomText);
			if (bottomText) {
				$("<p></p>").appendTo(bottomView).text(bottomText);
			}
		}
	};

	const renderEmptyView = function ($, target) {
		UI._itemsRender.renderEmptyView.call(this, $, target);
	};

	const renderView = function (target, view) {
		if (Utils.isFunction(view.render))
			view.render(target);
		else
			target.append(view.$el || view);
	};

	///////////////////////////////////////////////////////
	const doInit = function () {
		initEvents.call(this);
		initContentEvents.call(this);
		setTimeout(() => {
			checkIfEmpty.call(this);
			if (isContentLoading.call(this))
				this.$el.addClass("is-loading");
		}, 10);
	};

	const initEvents = function () {
		let scroller = this.getScrollContainer();

		scroller.on("scroll.scroll", onScrollHandler.bind(this));

		if (this._isRenderAsApp()) {
			scroller.on("touchstart.scroll", onTouchHandler.bind(this));
			scroller.on("touchend.scroll", onTouchHandler.bind(this));
			scroller.on("touchmove.scroll", onTouchHandler.bind(this));
			scroller.on("touchcancel.scroll", onTouchHandler.bind(this));
		}
		else {
			scroller.on("mousedown.scroll", onMouseHandler.bind(this));
			scroller.on("mouseup.scroll", onMouseHandler.bind(this));
			scroller.on("mousemove.scroll", onMouseHandler.bind(this));
			scroller.on("mouseleave.scroll", onMouseHandler.bind(this));
		}
	};

	const clearEvents = function () {
		let scroller = this.getScrollContainer();

		scroller.off("scroll.scroll");

		if (this._isRenderAsApp()) {
			scroller.off("touchstart.scroll");
			scroller.off("touchend.scroll");
			scroller.off("touchmove.scroll");
			scroller.off("touchcancel.scroll");
		}
		else {
			scroller.off("mousedown.scroll");
			scroller.off("mouseup.scroll");
			scroller.off("mousemove.scroll");
			scroller.off("mouseleave.scroll");
		}
	};

	const initContentEvents = function () {
		let contentView = this.getContentView();
		if (contentView && Utils.isFunction(contentView.on)) {
			let loadedHandler = function () {
				onContentLoadHandler.call(this);
			};
			contentView.scroll_loaded = loadedHandler.bind(this);
			contentView.on("loaded", contentView.scroll_loaded);

			let itemChangeHandler = function () {
				onContentItemChangeHandler.call(this);
			};
			contentView.scroll_itemchange = itemChangeHandler.bind(this);
			contentView.on("itemchange", contentView.scroll_itemchange);
		}
	};

	const clearContentEvents = function () {
		let contentView = this.getContentView();
		if (contentView && Utils.isFunction(contentView.off)) {
			if (contentView.scroll_loaded)
				contentView.off("loaded", contentView.scroll_loaded);

			if (contentView.scroll_itemchange)
				contentView.off("itemchange", contentView.scroll_itemchange);
		}
	};
	
	// ====================================================
	const doRefresh = function () {
		if (this.$el.is(".is-refresh, .is-loading"))
			return ;
		let target = this.$el.addClass("is-refresh");

		let complete = () => {
			target.removeClass("is-refresh");
			target.removeClass("no-more");
			hideRefreshView.call(this);
			checkIfEmpty.call(this);
		}

		let result = false;
		let contentView = this.getContentView();
		if (contentView && Utils.isFunction(contentView.reload)) {
			let result1 = result = contentView.reload(1, () => {
				setTimeout(() => {
					if (result1 !== false)
						complete();
				}, 0);
			});
		}

		if (result === false) {
			let refreshFunction = this.getRefreshFunction();
			if (Utils.isFunction(refreshFunction)) {
				let result2 = result = refreshFunction(() => {
					setTimeout(() => {
						if (result2 !== false)
							complete();
					}, 0);
				});
			}
		}

		this.trigger("refresh");

		if (result === false) {
			complete();
		}
	};

	const doMore = function (state) {
		if (this.$el.is(".is-loading, .is-refresh, .no-more"))
			return ;
		let target = this.$el.addClass("is-loading");
		
		let complete = (hasMore) => {
			if (!hasMore)
				target.addClass("no-more");
			target.removeClass("is-loading");
			checkIfEmpty.call(this);
		};

		let result = false;
		let contentView = this.getContentView();
		if (contentView && Utils.isFunction(contentView.more)) {
			let result1 = result = contentView.more(() => {
				setTimeout(() => {
					if (result1 !== false)
						complete(Utils.isFunction(contentView.hasMore) ? contentView.hasMore() : true);
				}, 0);
			});
		}

		if (result === false) {
			let moreFunction = this.getMoreFunction();
			if (Utils.isFunction(moreFunction)) {
				let result2 = result = moreFunction((data) => {
					setTimeout(() => {
						if (result2 !== false)
							complete((data && data.hasOwnProperty("hasMore")) ? Utils.isTrue(data.hasMore) : true);
					}, 0);
				});
			}
		}

		this.trigger("more");

		if (result === false) {
			complete();
		}
	};
	
	// ====================================================
	const dragStart = function (e) {
		if (e.type == "touchstart") {
			if (e.touches.length > 1)
				return ;
			e = e.touches[0];
		}
		let data = this.dragData = {};
		data.scroller = this.getScrollContainer();
		data.startTop = data.scroller.scrollTop();
		data.startX = e.pageX;
		data.startY = e.pageY;
	};

	const dragMove = function (e) {
		if (e.type == "touchmove")
			e = e.touches[0];
		if (this.dragData) {
			let data = this.dragData;

			let offset = e.pageY - data.startY;
			data.offset = offset;

			if (!data.moveing) {
				if (e.type == "mousemove") { // pc
					if (offset > -10 && offset < 10)
						return ;
					let offsetX = e.pageX - data.startX;
					if (offsetX < -10 || offsetX > 10)
						return ;
					data.moveing = true;
				}
				else { // mobile
					if (offset > -20 && offset < 20)
						return ;
					data.moveing = true;
				}
			}

			if (data.moveing) {
				let isLoading = this.$el.is(".is-loading, .is-refresh");
				let scrollTop = data.startTop - offset;
				if (scrollTop == 0) {
					data.scroller.scrollTop(0);
					if (!isLoading)
						this.$el.children(".top").height(0);
				}
				else if (scrollTop > 0) {
					data.scroller.scrollTop(scrollTop);
				}
				else {
					data.scroller.scrollTop(0);
					if (!isLoading)
						showRefreshView.call(this, 0 - scrollTop);
				}
			}
		}
	};

	const dragEnd = function (e) {
		if (this.dragData) {
			let data = this.dragData;
			if (data.moveing && (data.startTop - data.offset < 0)) {
				if (!this.$el.is(".is-refresh"))
					hideRefreshView.call(this);
			}
			this.dragData = null;
		}
	};

	// ====================================================
	const showRefreshView = function (height) {
		this.$el.addClass("show-top");

		let refreshView = this.$el.children(".top");

		let content = refreshView.children();
		if (content && content.length > 0) {
			let distance = this.getTopDistance();
			if (height <= distance) {
				content.attr("state", "pull");
			}
			else {
				content.attr("state", "drop");
				let increment = (height - distance - 1) / (height - distance + 2);
				height = distance + (increment * increment * 40);
			}
			let scale = Math.min(1, (height / distance));
			content.css("transform", "scale(" + scale.toFixed(5) + ")");
		}

		refreshView.height(height);
	};

	const hideRefreshView = function () {
		if (!this.$el.is(".show-top"))
			return ;

		let refreshView = this.$el.children(".top");
		let content = refreshView.children();

		refreshView.addClass("animate");

		let _hide = () => {
			refreshView.height(0);
			content.removeAttr("state");
			setTimeout(() => {
				this.$el.removeClass("show-top");
				refreshView.removeClass("animate");
			}, 200);
		};

		if (content && content.length > 0) {
			content.css("transform", "");
			if (content.attr("state") == "drop") {
				content.attr("state", "load");
				refreshView.height(this.getTopDistance());
				doRefresh.call(this);
			}
			else {
				_hide();
			}
		}
		else {
			_hide();
		}
	};

	// ====================================================
	const getScrollContainer = function () {
		let container = this.options.scroller;
		if (container) {
			if (Utils.isFunction(container.getViewId))
				return "[vid='" + container.getViewId() + "']";
			if (typeof container == "string")
				return Utils.trimToNull(container);
		}
		return null;
	};

	const getScrollState = function (e) {
		let state = {offset: 0, isUp: true};
		state.time = Date.now();

		let scroller = this.getScrollContainer();
		state.scrollerHeight = scroller.height();

		let container = this.$el.children(".container");
		state.containerHeight = container.height();

		state.top = 0 - scroller.scrollTop();
		state.bottom = state.containerHeight + state.top - state.scrollerHeight;

		state.isTop = state.offsetTop >= 0;
		state.isBottom = state.offsetBottom <= 0;

		if (this.lastState) {
			state.offset = state.top - this.lastState.top;
			if (state.time - this.lastState.time > 30) {
				state.isUp = state.offset < 0;
				this.lastState = state;
			}
			else {
				state.isUp = this.lastState.isUp;
			}
		}
		else {
			this.lastState = state;
		}

		return state;
	};

	const checkIfEmpty = function () {
		if (isContentEmpty.call(this))
			this.$el.addClass("is-empty");
		else
			this.$el.removeClass("is-empty");
	};

	const isContentEmpty = function () {
		let contentView = this.getContentView();
		if (contentView) {
			if (Utils.isFunction(contentView.isEmpty)) {
				return contentView.isEmpty();
			}
			return contentView.length <= 0;
		}
		return true;
	};

	const isContentLoading = function () {
		let contentView = this.getContentView();
		if (contentView) {
			if (Utils.isFunction(contentView.isLoading)) {
				return contentView.isLoading();
			}
			else if (contentView.$el) {
				return contentView.$el.is(".is-loading");
			}
			else if (contentView instanceof $) {
				return contentView.is(".is-loading");
			}
		}
		return false;
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIScroll = UIScroll;
		UI.init(".ui-scroll", UIScroll, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");