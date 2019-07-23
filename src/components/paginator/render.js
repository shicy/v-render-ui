// 2019-07-22
// paginator

(function (frontend) {
	if (frontend && VRender.Component.ui.paginator)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	const defaultPageSize = 20;
	const defaultShowNum = 10;

	///////////////////////////////////////////////////////
	const UIPaginator = UI.paginator = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIPaginator = UIPaginator.prototype = new UI._base(false);

	_UIPaginator.init = function (target, options) {
		UI._base.init.call(this, target, options);

		this.$el.on("tap", "button.btn", buttonClickHandler.bind(this));

		this.$el.on("tap", ".pagebar .page", pageClickHandler.bind(this));
		this.$el.on("tap", ".pagebar .lbl", dropdownLabelHandler.bind(this));

		if (this._isRenderAsApp()) {
			this.$el.on("tap", ".pagebar .dropdown", dropdownTouchHandler.bind(this));
		}
		else {
			this.$el.on("tap", ".sizebar .lbl", sizebarLabelHandler.bind(this));
			this.$el.on("tap", ".sizebar li", sizebarClickHandler.bind(this));

			this.$el.on("keydown", ".skipbar input", inputKeyHandler.bind(this));
		}
	};

	// ====================================================
	_UIPaginator.set = function (total, page, size) {
		let snapshoot = this._snapshoot();
		setInner.call(this, total, page, size);
		snapshoot.done();
	};

	_UIPaginator.getPage = function () {
		return parseInt(this.$el.attr("data-no")) || 1;
	};
	_UIPaginator.setPage = function (value) {
		let snapshoot = this._snapshoot();
		setInner.call(this, null, value);
		snapshoot.done();
	};

	_UIPaginator.getSize = function () {
		return parseInt(this.$el.attr("data-size")) || 0;
	};
	_UIPaginator.setSize = function (value) {
		setInner.call(this, null, null, value);
	};

	_UIPaginator.getTotal = function () {
		return parseInt(this.$el.attr("data-total")) || 0;
	};
	_UIPaginator.setTotal = function (value) {
		let snapshoot = this._snapshoot();
		setInner.call(this, value);
		snapshoot.done();
	};

	_UIPaginator.getPageNo = function () {
		return this.getPage();
	};
	_UIPaginator.setPageNo = function (value) {
		this.setPage(value);
	};

	_UIPaginator.getPageCount = function () {
		return parseInt(this.$el.attr("data-pages")) || 1;
	};

	_UIPaginator.getMode = function () {
		return this.$el.attr("opt-mode") || false;
	};
	_UIPaginator.setMode = function (value) {
		this.$el.attr("opt-mode", (getMode(value) || ""));
		reRenderView.call(this);
	};

	_UIPaginator.getSizes = function () {
		let sizes = this.$el.attr("opt-sizes") || "";
		return getSizes(sizes.split(","));
	};
	_UIPaginator.setSizes = function (value) {
		let sizes = Utils.isArray(value) ? value : null;
		if (sizes)
			sizes = getSizes(sizes);
		if (sizes && sizes.length > 0)
			this.$el.attr("opt-sizes", sizes.join(","));
		else
			this.$el.removeAttr("opt-sizes");
		reRenderView.call(this);
	};

	_UIPaginator.getShowNum = function () {
		return parseInt(this.$el.attr("opt-nums")) || getShowNum(-1);
	};
	_UIPaginator.setShowNum = function (value) {
		value = parseInt(value) || 0;
		if (value > 0) {
			this.$el.attr("opt-nums", value);
			reRenderView.call(this);
		}
	};

	_UIPaginator.getStatus = function () {
		let status = this.$el.attr("opt-status");
		if (status === "_default")
			return "共{totalCount}条";
		return status || "";
	};
	_UIPaginator.setStatus = function (value) {
		value = getStatus(value);
		if (value)
			this.$el.attr("opt-status", value);
		else
			this.$el.removeAttr("opt-status");
		reRenderView.call(this);
	};

	_UIPaginator.getSkip = function () {
		let skip = this.$el.attr("opt-skip");
		if (skip == 1)
			return true;
		return skip ? skip.split("♮") : false;
	};
	_UIPaginator.setSkip = function (value) {
		value = getSkip(value);
		if (value)
			this.$el.attr("opt-skip", value);
		else
			this.$el.removeAttr("opt-skip");
		reRenderView.call(this);
	};

	_UIPaginator.getButtons = function () {
		if (this.options.hasOwnProperty("buttons"))
			return this.options.buttons;
		let buttons = this.$el.attr("opt-btns");
		if (buttons === "")
			return false;
		return buttons ? JSON.parse(buttons) : null;
	};
	_UIPaginator.setButtons = function (value) {
		this.options.buttons = value;
		this.$el.removeAttr("opt-btn");
		reRenderView.call(this);
	};

	// ====================================================
	_UIPaginator.rerender = function () {
		reRenderView.call(this);
	};

	_UIPaginator._snapshoot_shoot = function (state) {
		state.data = {page: this.getPageNo(), size: this.getSize()};
	};

	_UIPaginator._snapshoot_compare = function (state) {
		return state.data.page == this.getPageNo();
	};

	_UIPaginator._isFirst = function () {
		return this.$el.is(".is-first");
	};

	_UIPaginator._isLast = function () {
		return this.$el.is(".is-last");
	};
	
	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-paginator");

		let pageInfo = getPageInfos.call(this);

		target.attr("data-no", pageInfo.pageNo);
		target.attr("data-size", pageInfo.pageSize);
		target.attr("data-pages", pageInfo.pageCount);
		target.attr("data-total", pageInfo.totalCount);

		target.attr("opt-mode", pageInfo.mode || "");
		target.attr("opt-nums", pageInfo.showNum);
		if (pageInfo.status)
			target.attr("opt-status", pageInfo.status);
		if (pageInfo.skip)
			target.attr("opt-skip", pageInfo.skip);
		if (pageInfo.pageSizes.length > 1)
			target.attr("opt-sizes", pageInfo.pageSizes.join(","));

		renderView.call(this, $, target, pageInfo);

		if (!frontend) {
			let buttons = this.options.buttons;
			if (buttons === false)
				target.attr("opt-btns", "");
			else if (buttons !== true) {
				if (Utils.isNotBlank(buttons))
					target.attr("opt-btns", JSON.stringify(buttons));
			}
		}

		return this;
	};

	// ====================================================
	_Renderer.getButtons = function () {
		return this.options.buttons;
	};

	_Renderer.getTotal = function () {
		return Math.max(0, parseInt(this.options.total) || 0);
	};

	_Renderer.getSize = function () {
		return parseInt(this.options.size) || 0;
	};

	_Renderer.getSizes = function () {
		return getSizes(this.options.sizes) || [];
	};

	_Renderer.getPageNo = function () {
		return parseInt(this.options.page) || 0;
	};

	_Renderer.getMode = function () {
		return getMode(this.options.mode);
	};

	_Renderer.getShowNum = function () {
		return getShowNum(this.options.showNum);
	};

	_Renderer.getStatus = function () {
		return getStatus(this.options.status);
	};

	_Renderer.getSkip = function () {
		return getSkip(this.options.skip);
	};


	///////////////////////////////////////////////////////
	const buttonClickHandler = function (e) {
		let btn = $(e.currentTarget);
		if (btn.is(".disabled"))
			return false;
		if (btn.is(".skip")) {
			let skipInput = this.$el.find(".skipbar input");
			let page = parseInt(skipInput.val()) || 0;
			if (page > 0 && page != this.getPageNo())
				this.setPageNo(page);
			skipInput.val("");
		}
		else {
			let pageNo = this.getPageNo();
			if (btn.is(".prev")) {
				if (!this._isFirst())
					this.setPageNo(pageNo - 1);
			}
			else if (btn.is(".next")) {
				if (!this._isLast())
					this.setPageNo(pageNo + 1);
			}
			else if (btn.is(".first")) {
				if (!this._isFirst())
					this.setPageNo(1);
			}
			else if (btn.is(".last")) {
				if (!this._isLast())
					this.setPageNo(this.getPageCount());
			}
		}
	};

	const pageClickHandler = function (e) {
		let item = $(e.currentTarget);
		if (item.is(".selected"))
			return false;

		if (this.getMode() == "dropdown") {
			hidePageDropdown.call(this);
			setTimeout(() => {
				this.setPageNo(item.text());
			}, 300);
		}
		else {
			this.setPageNo(item.text());
		}

		return false;
	};

	const dropdownLabelHandler = function (e) {
		showPageDropdown.call(this);
	};

	const dropdownMouseHandler = function (e) {
		Fn.mouseDebounce(e, hidePageDropdown.bind(this));
	};

	const dropdownTouchHandler = function (e) {
		hidePageDropdown.call(this);
	};

	const sizebarLabelHandler = function (e) {
		showSizeDropdown.call(this);
	};

	const sizebarClickHandler = function (e) {
		let size = parseInt($(e.currentTarget).text());
		if (size && size != this.getSize()) {
			this.setSize(size);
		}
		hideSizeDropdown.call(this);
	};

	const sizebarMouseHandler = function (e) {
		Fn.mouseDebounce(e, hideSizeDropdown.bind(this));
	};

	const inputKeyHandler = function (e) {
		if (e.type == "keydown") {
			if (e.which == 13) {
				let input = $(e.currentTarget);
				let page = parseInt(input.val()) || 0;
				if (page > 0 && page != this.getPageNo())
					this.setPageNo(page);
				input.val("");
				return true;
			}
			return Utils.isControlKey(e) || Utils.isNumberKey(e);
		}
	};

	// ====================================================
	const renderView = function ($, target, pageInfo) {
		let pagebar = $("<div class='pagebar'></div>").appendTo(target);
		renderPageBar.call(this, $, target, pagebar, pageInfo);

		if (!this._isRenderAsApp()) {
			if (pageInfo.pageSizes.length > 1) {
				let sizebar = $("<div class='sizebar'></div>").appendTo(target);
				renderPageSizeBar.call(this, $, target, sizebar, pageInfo);
			}

			if (Utils.isNotBlank(pageInfo.status)) {
				let statusbar = $("<div class='statusbar'></div>").appendTo(target);
				renderPageStatusBar.call(this, $, target, statusbar, pageInfo);
			}

			if (Utils.isNotBlank(pageInfo.skip)) {
				let skipbar = $("<div class='skipbar'></div>").appendTo(target);
				renderPageSkipBar.call(this, $, target, skipbar, pageInfo);
			}
		}
	};

	const renderPageBar = function ($, target, container, pageInfo) {
		let firstBtn = getButtonLabel.call(this, "first");
		firstBtn && $("<button class='btn first'></button>").appendTo(container).text(firstBtn);

		let prevBtn = getButtonLabel.call(this, "prev");
		prevBtn && $("<button class='btn prev'></button>").appendTo(container).text(prevBtn);

		renderPagesView.call(this, $, target, container, pageInfo);

		let nextBtn = getButtonLabel.call(this, "next");
		nextBtn && $("<button class='btn next'></button>").appendTo(container).text(nextBtn);

		let lastBtn = getButtonLabel.call(this, "last");
		lastBtn && $("<button class='btn last'></button>").appendTo(container).text(lastBtn);

		target.removeClass("is-first").removeClass("is-last");
		if (pageInfo.isFirstPage)
			target.addClass("is-first");
		if (pageInfo.isLastPage)
			target.addClass("is-last");
	};

	const renderPagesView = function ($, target, pagebar, pageInfo) {
		let mode = pageInfo.mode;
		if (mode !== false && mode !== "false") {
			let container = $("<div class='pages'></div>").appendTo(pagebar);
			if (mode == "spread") {
				renderPagesAsSpread.call(this, $, target, container, pageInfo);
			}
			else if (mode == "dropdown") {
				renderPagesAsDropdown.call(this, $, target, container, pageInfo);
			}
			else {
				renderPagesAsDefault.call(this, $, target, container, pageInfo);
			}
		}
	};

	const renderPagesAsDefault = function ($, target, container, pageInfo) {
		let view = [];
		view.push("<span class='pageno'>" + pageInfo.pageNo + "</span>");
		view.push("<span class='pagecount'>" + pageInfo.pageCount + "</span>");
		container.html(view.join("/"));
	};

	const renderPagesAsSpread = function ($, target, container, pageInfo) {
		let showNum = pageInfo.showNum;
		showNum = showNum > 0 ? showNum : defaultShowNum;
		if (showNum > 3 && this._isRenderAsApp())
			showNum = 3;

		let page = pageInfo.pageNo - Math.floor(showNum / 2);
		if (page + showNum - 1 > pageInfo.pageCount)
			page = pageInfo.pageCount - showNum + 1;
		if (page < 1)
			page = 1;

		container.removeClass("has-prev").removeClass("has-next");
		if (page > 1)
			container.addClass("has-prev");
		for (let i = 0; i < showNum && page <= pageInfo.pageCount; i++) {
			let item = $("<span class='page'></span>").appendTo(container);
			item.text(page);
			if (page == pageInfo.pageNo)
				item.addClass("selected");
			page += 1;
		}
		if (page - 1 < pageInfo.pageCount)
			container.addClass("has-next");
	};

	const renderPagesAsDropdown = function ($, target, container, pageInfo) {
		let label = $("<div class='lbl'></div>").appendTo(container);
		label.text(pageInfo.pageNo + "/" + pageInfo.pageCount);

		let isApp = this._isRenderAsApp();

		let dropdown = $("<div class='dropdown'></div>").appendTo(container);
		let items = $("<ul></ul>").appendTo(dropdown);
		for (let i = 1; i <= pageInfo.pageCount; i++) {
			let item = $("<li class='page'></li>").appendTo(items);
			if (isApp)
				item.append("<span>" + i + "</span>");
			else 
				item.text(i);
			if (i == pageInfo.pageNo)
				item.addClass("selected");
		}
	};

	const renderPageSizeBar = function ($, target, container, pageInfo) {
		let label = $("<div class='lbl'></div>").appendTo(container);
		label.text(pageInfo.pageSize);

		let dropdown = $("<div class='dropdown'></div>").appendTo(container);
		let items = $("<ul></ul>").appendTo(dropdown);
		Utils.each(pageInfo.pageSizes, (value) => {
			items.append("<li>" + value + "</li>");
		});
	};

	const renderPageStatusBar = function ($, target, container, pageInfo) {
		container.html(getFormatStatus.call(this, pageInfo.status, pageInfo));
	};

	const renderPageSkipBar = function ($, target, container, pageInfo) {
		let skips = /♮/.test(pageInfo.skip) ? pageInfo.skip.split("♮") : ["", ""];

		if (Utils.isBlank(skips[0]) && pageInfo.status)
			skips[0] = "到第";
		if (Utils.isNotBlank(skips[0]))
			$("<span class='txt t1'></span>").appendTo(container).text(skips[0]);

		container.append("<input type='number'/>");

		if (Utils.isBlank(skips[1]) && pageInfo.status)
			skips[1] = "页";
		if (Utils.isNotBlank(skips[1]))
			$("<span class='txt t2'></span>").appendTo(container).text(skips[1]);

		let skipBtn = getButtonLabel.call(this, "skip") || "GO";
		$("<button class='btn skip'></button>").appendTo(container).text(skipBtn);
	};

	// 重新渲染视图
	const reRenderView = function () {
		if (this.t_renderview) {
			clearTimeout(this.t_renderview);
			this.t_renderview = 0;
		}
		if (this.t_renderpage) {
			clearTimeout(this.t_renderpage);
			this.t_renderpage = 0;
		}
		this.t_renderview = setTimeout(() => {
			this.t_renderview = 0;
			renderView.call(this, $, this.$el.empty(), getPageInfos.call(this));
		}, 0);
	};

	// 如果只是页码变了，只要重新渲染页码相关部分即可
	const reRenderPages = function () {
		if (this.t_renderview)
			return ;
		if (this.t_renderpage) {
			clearTimeout(this.t_renderpage);
			this.t_renderpage = 0;
		}
		this.t_renderpage = setTimeout(() => {
			this.t_renderpage = 0;
			let pageInfos = getPageInfos.call(this);
			let pageContainer = this.$el.children(".pagebar").empty();
			renderPageBar.call(this, $, this.$el, pageContainer, pageInfos);
			let statusContainer = this.$el.children(".statusbar");
			if (statusContainer && statusContainer.length > 0)
				renderPageStatusBar.call(this, $, this.$el, statusContainer, pageInfos);
		}, 0);
	};

	// ====================================================
	const showPageDropdown = function () {
		let target = this.$el.children(".pagebar");
		if (target.is(".show-dropdown"))
			return ;

		target.addClass("show-dropdown");
		let dropdown = target.find(".dropdown");

		if (this._isRenderAsApp()) {
			$("html,body").addClass("ui-scrollless");
			dropdown = dropdown.children("ul");
		}
		else {
			target.on("mouseenter", dropdownMouseHandler.bind(this));
			target.on("mouseleave", dropdownMouseHandler.bind(this));

			let maxHeight = Fn.getDropdownHeight.call(this, dropdown);
			let offset = Utils.offset(dropdown, this._getScrollContainer(), 0, maxHeight);
			if (offset.isOverflowY)
				target.addClass("show-before");
		}

		let selectedItem = dropdown.find(".selected");
		if (selectedItem && selectedItem.length > 0) {
			let scrollTop = dropdown.scrollTop();
			scrollTop += selectedItem.offset().top - dropdown.offset().top;
			dropdown.scrollTop(scrollTop);
		}

		setTimeout(() => {
			target.addClass("animate-in");
		}, 0);
	};

	const hidePageDropdown = function () {
		let target = this.$el.children(".pagebar");
		let dropdown = target.find(".dropdown");

		if (this._isRenderAsApp()) {
			$("html,body").removeClass("ui-scrollless");
		}
		else {
			target.off("mouseenter").off("mouseleave");
		}

		target.addClass("animate-out");
		setTimeout(() => {
			target.removeClass("show-dropdown").removeClass("show-before");
			target.removeClass("animate-in").removeClass("animate-out");
		}, 300);
	};

	const showSizeDropdown = function () {
		let target = this.$el.children(".sizebar");
		if (target.is(".show-dropdown"))
			return ;

		target.addClass("show-dropdown");
		target.on("mouseenter", sizebarMouseHandler.bind(this));
		target.on("mouseleave", sizebarMouseHandler.bind(this));

		let dropdown = target.children(".dropdown");
		let maxHeight = Fn.getDropdownHeight.call(this, dropdown, 210);
		let offset = Utils.offset(dropdown, this._getScrollContainer(), 0, maxHeight);
		if (offset.isOverflowY)
			target.addClass("show-before");

		setTimeout(() => {
			target.addClass("animate-in");
		}, 0);
	};

	const hideSizeDropdown = function () {
		let target = this.$el.children(".sizebar");
		target.off("mouseenter").off("mouseleave");
		target.addClass("animate-out");
		setTimeout(() => {
			target.removeClass("show-dropdown").removeClass("show-before");
			target.removeClass("animate-in").removeClass("animate-out");
		}, 300);
	};

	// ====================================================
	const setInner = function (total, page, size) {
		total = Math.max(0, (Utils.isBlank(total) || isNaN(total)) ? this.getTotal() : parseInt(total));
		page = Math.max(1, (Utils.isBlank(page) || isNaN(page)) ? this.getPageNo() : parseInt(page));
		size = (Utils.isBlank(size) || isNaN(size)) ? this.getSize() : parseInt(size);

		let pageCount = Math.ceil(total / size) || 1;
		page = Math.min(page, pageCount);

		this.$el.attr("data-total", total);
		this.$el.attr("data-size", size);
		this.$el.attr("data-no", page);
		this.$el.attr("data-pages", pageCount);

		reRenderPages.call(this);

		this.$el.find(".sizebar .lbl").text(size);
	};

	const getPageInfos = function () {
		let data = {};

		data.totalCount = this.getTotal();
		data.pageSize = this.getSize();
		data.pageSizes = this.getSizes() || [];

		if (data.pageSize <= 0 && data.pageSizes && data.pageSizes.length > 0)
			data.pageSize = data.pageSizes[0];
		if (data.pageSize <= 0)
			data.pageSize = defaultPageSize;
		if (data.pageSizes.indexOf(data.pageSize) < 0)
			data.pageSizes.push(data.pageSize);
		data.pageSizes.sort(function (a, b) { return a - b; });

		data.pageNo = this.getPageNo();
		data.pageCount = Math.ceil(data.totalCount / data.pageSize) || 1;
		data.pageNo = Math.max(1, Math.min(data.pageNo, data.pageCount));

		data.pageStart = Math.min(((data.pageNo - 1) * data.pageSize + 1), data.totalCount);
		data.pageEnd = Math.min((data.pageNo * data.pageSize), data.totalCount);

		data.mode = this.getMode();
		data.showNum = this.getShowNum();
		data.status = this.getStatus();
		data.skip = this.getSkip();

		data.isFirstPage = data.pageNo == 1;
		data.isLastPage = data.pageNo == data.pageCount;

		return data;
	};

	const getButtonLabel = function (name) {
		let buttons = this.getButtons();
		if (buttons === false)
			return false;

		let label = null;
		if (Utils.isArray(buttons)) {
			if (name == "first")
				label = buttons[0];
			else if (name == "prev")
				label = buttons[1];
			else if (name == "next")
				label = buttons[2];
			else if (name == "last")
				label = buttons[3];
			else if (name == "skip")
				label = buttons[4];
		}

		if (label === false)
			return false;

		if (label !== true && Utils.isNotBlank(label))
			return "" + label;

		if (name == "first")
			return "|<";
		if (name == "last")
			return ">|";
		if (name == "prev")
			return "<";
		if (name == "next")
			return ">";
		if (name == "skip")
			return "GO";
		return "" + name;
	};

	const getFormatStatus = function (status, pageInfo) {
		if (status === true || status == "_default")
			return "共" + pageInfo.totalCount + "条";
		if (Utils.isNotBlank(status)) {
			status = status.replace(/\{pageNo\}/g, pageInfo.pageNo);
			status = status.replace(/\{pageSize\}/g, pageInfo.pageSize);
			status = status.replace(/\{pageCount\}/g, pageInfo.pageCount);
			status = status.replace(/\{totalCount\}/g, pageInfo.totalCount);
			status = status.replace(/\{pageStart\}/g, pageInfo.pageStart);
			status = status.replace(/\{pageEnd\}/g, pageInfo.pageEnd);
		}
		return Utils.trimToEmpty(status);
	};

	// ====================================================
	const getMode = function (value) {
		if (value === false)
			return false;
		if (value == "spread" || value == "dropdown")
			return value;
		return "normal";
	};

	const getShowNum = function (value) {
		value = parseInt(value) || 0;
		return value > 0 ? value : defaultShowNum;
	};

	const getSizes = function (value) {
		if (value) {
			let values = [];
			Utils.each(Utils.toArray(value), (tmp) => {
				tmp = parseInt(tmp) || 0;
				if (tmp > 0 && values.indexOf(tmp) < 0)
					values.push(tmp);
			});
			return values.length > 0 ? values : null;
		}
		return null;
	};

	const getStatus = function (value) {
		if (value === true)
			return "_default";
		if (value === false)
			return null;
		return Utils.trimToNull(value);
	};

	const getSkip = function (value) {
		if (Utils.isNull(value) || value === true)
			return "1";
		if (Utils.isArray(value)) {
			return Utils.trimToEmpty(value[0]) + "♮" + Utils.trimToEmpty(value[1]);
		}
		return null;
	};
	

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIPaginator = UIPaginator;
		UI.init(".ui-paginator", UIPaginator, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");