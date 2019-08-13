// 2019-07-23
// panel

(function (frontend) {
	if (frontend && VRender.Component.ui.panel)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UIPanel = UI.panel = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIPanel = UIPanel.prototype = new UI._base(false);

	_UIPanel.init = function (target, options) {
		UI._base.init.call(this, target, options);

		this.header = this.$el.children("header");
		this.container = this.$el.children("section").children();

		this.header.on("tap", ".tabbar > .tab", onTabClickHandler.bind(this));

		if (this._isRenderAsApp()) {
			this.header.on("tap", ".btnbar > .popbtn", onPopupButtonClickHandler.bind(this));
		}
		else {
			this.header.on("tap", ".btnbar > .item > .btn", onButtonClickHandler.bind(this));
			this.header.on("tap", ".btnbar > .item > ul > li", onDropdownButtonClickHandler.bind(this));
		}

		doInit.call(this);
	};

	// ====================================================
	_UIPanel.getTitle = function () {
		return this.header.children(".title").text();
	};
	_UIPanel.setTitle = function (value) {
		if (Utils.isNotNull(value)) {
			value = Utils.trimToEmpty(value);
			let title = this.header.children(".title");
			if (title && title.length > 0) {
				if (value) {
					title.empty().append(value);
				}
				else {
					title.remove();
				}
			}
			else if (value) {
				title = $("<div class='title'></div>").prependTo(this.header);
				title.append(value);
			}
		}
	};

	_UIPanel.getButtons = function () {
		if (this.options.hasOwnProperty("buttons"))
			return Utils.toArray(this.options.buttons);
		let buttons = this.$el.attr("data-btns");
		if (buttons) {
			try {
				buttons = JSON.parse(buttons);
			}
			catch (e) {}
		}
		this.$el.removeAttr("data-btns");
		this.options.buttons = Utils.toArray(buttons);
		return buttons;
	};
	_UIPanel.setButtons = function (value) {
		this.options.buttons = value;
		renderButtons.call(this, $, this.$el, Utils.toArray(value));
		if (this.popupMenu) {
			this.popupMenu.destory();
			this.popupMenu = null;
		}
	};

	_UIPanel.setViewports = function (value, active) {
		let viewports = getFormatViewports.call(this, value);
		renderTabs.call(this, $, this.$el, viewports);
		renderViewports.call(this, $, this.container, viewports);
		this.setViewActive(active);
	};

	_UIPanel.isViewActive = function (name) {
		return this.getViewActive() == name;
	};

	_UIPanel.getViewActive = function () {
		let item = this.header.find(".tabbar .selected");
		return item && item.attr("name");
	};

	_UIPanel.setViewActive = function (name) {
		if (Utils.isNotBlank(name))
			showViewport.call(this, name);
	};
	
	// ====================================================
	const onButtonClickHandler = function (e) {
		let btn = $(e.currentTarget);
		let item = btn.parent();
		if (item.attr("has-dropdown") == 1) {
			showBtnDropdown.call(this, item);
		}
		else if (item.attr("opt-toggle") == 1) {
			item.toggleClass("active");
		}
		let name = item.attr("name");
		if (Utils.isNotBlank(name))
			this.trigger("btnclick", name, btn.is(".active"));
	};

	const onPopupButtonClickHandler = function (e) {
		if (this.popupMenu) {
			this.popupMenu.open();
		}
		else {
			let items = getPopupMenus.call(this, this.getButtons());
			if (items && items.length > 0) {
				this.popupMenu = UI.popupmenu.create({target: this.$el, data: items});
				this.popupMenu.on("itemclick", onPopupMenuButtonHandler.bind(this));
			}
			if (this.popupMenu) {
				this.popupMenu.open();
			}
		}
	};

	const onPopupMenuButtonHandler = function (e, data) {
		if (data && Utils.isNotBlank(data.name))
			this.trigger("btnclick", data.name, !!data.checked);
	};

	const onDropdownButtonClickHandler = function (e) {
		let dropdownItem = $(e.currentTarget);
		let item = dropdownItem.parent().parent();
		if (item.attr("opt-toggle") == 1 && !dropdownItem.is(".active")) {
			dropdownItem.addClass("active").siblings().removeClass("active");
			let btn = item.children(".btn");
			// btn.attr("name", dropdownItem.attr("name"));
			let label = btn.children("span");
			if (label && label.length > 0)
				label.text(dropdownItem.children("span").text());
			let icon = btn.children("i");
			if (icon && icon.length > 0) {
				if (!icon.attr("data-src"))
					icon.attr("data-src", icon.css("backgroundImage"));
				let iconUrl = dropdownItem.children("i").css("backgroundImage") || icon.attr("data-src");
				icon.css("backgroundImage", iconUrl);
			}
		}
		hideBtnDropdown.call(this, item);
		let name = dropdownItem.attr("name");
		if (Utils.isNotBlank(name))
			this.trigger("btnclick", name, dropdownItem.is(".active"));
	};

	const onButtonMouseHandler = function (e) {
		let item = $(e.currentTarget);
		let timerId = parseInt(item.attr("timerid"));
		if (timerId) {
			clearTimeout(timerId);
			item.removeAttr("timerid");
		}
		if (e.type == "mouseleave") {
			timerId = setTimeout(() => {
				item.removeAttr("timerid");
				hideBtnDropdown.call(this, item);
			}, 400);
			item.attr("timerid", timerId);
		}
	};
	
	const onTabClickHandler = function (e) {
		let item = $(e.currentTarget);
		if (!item.is(".selected"))
			showViewport.call(this, item.attr("name"));
	};
	
	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-panel");

		this._viewports = getFormatViewports.call(this, this.options.viewports);

		renderHeader.call(this, $, target);
		renderContent.call(this, $, target);

		return this;
	};

	// ====================================================
	_Renderer.getTitle = function () {
		if (this.options.hasOwnProperty("title"))
			return this.options.title;
		if (this._viewports && this._viewports.length > 0)
			return false;
		return "标题";
	};

	// ====================================================
	const renderHeader = function ($, target) {
		let options = this.options || {};

		let header = $("<header></header>").appendTo(target);

		// 标题
		if (options.focusHtmlTitle) {
			$("<div class='title'></div>").appendTo(header).html(options.focusHtmlTitle);
		}
		else {
			let title = this.getTitle();
			if (title !== false && Utils.isNotBlank(title))
				$("<div class='title'></div>").appendTo(header).text(title);
		}

		// 视图
		renderTabs.call(this, $, target, this._viewports);

		// 按钮
		let buttons = Utils.toArray(this.options.buttons);
		renderButtons.call(this, $, target, buttons);
	};
	
	const renderTabs = function ($, target, viewports) {
		let header = target.children("header");
		header.children(".tabbar").remove();
		if (viewports && viewports.length > 0) {
			let tabbar = $("<div class='tabbar'></div>").prependTo(header);
			header.children(".title").after(tabbar);
			tabbar.append("<div class='thumb'></div>");
			
			let viewIndex = Utils.getIndexValue(this.options.viewIndex);
			Utils.each(viewports, (data, i) => {
				let tab = $("<div class='tab'></div>").appendTo(tabbar);
				tab.attr("name", data.name);

				if (data.focusHtmlLabel)
					tab.html(data.focusHtmlLabel);
				else
					$("<span></span>").appendTo(tab).text(data.label || data.name);

				if (i == viewIndex)
					tab.addClass("selected");
			});
		}
	};

	const renderButtons = function ($, target, buttons) {
		let header = target.children("header");
		header.children(".btnbar").remove();
		if (buttons && buttons.length > 0) {
			let btnbar = $("<div class='btnbar'></div>").appendTo(header);
			if (this._isRenderAsApp()) {
				btnbar.append("<button class='popbtn'>&nbsp;</button>");
				target.attr("data-btns", JSON.stringify(buttons));
			}
			else {
				Utils.each(buttons, (data) => {
					renderOneButton.call(this, $, btnbar, data);
				});
			}
		}
	};

	const renderOneButton = function ($, btnbar, data) {
		if (Utils.isBlank(data))
			return ;
		if (typeof data == "string")
			data = {name: data};

		let item = $("<div class='item'></div>").appendTo(btnbar);
		item.attr("name", Utils.trimToNull(data.name));

		let _isToggle = Utils.isTrue(data.toggle);

		if (_isToggle)
			item.attr("opt-toggle", "1");
		if (Utils.isNotBlank(data.tooltip))
			item.attr("title", data.tooltip);

		let btn = $("<button class='btn'></button>").appendTo(item);
		if (data.icon) {
			let icon = $("<i>&nbsp;</i>").appendTo(btn);
			if (typeof data.icon == "string")
				icon.css("backgroundImage", "url(" + data.icon + ")");
		}
		if (!data.icon || data.label !== false) {
			let label = $("<span></span>").appendTo(btn);
			label.text(Utils.trimToNull(data.label) || "按钮");
		}

		if (Utils.isArray(data.items) && data.items.length > 0) {
			let dropdown = $("<ul></ul>").appendTo(item.attr("has-dropdown", "1"));
			let hasIcon = false;
			Utils.each(data.items, (temp, i) => {
				let dropdownItem = $("<li></li>").appendTo(dropdown);
				dropdownItem.attr("name", Utils.trimToNull(temp.name));
				if (Utils.isNotBlank(temp.icon)) {
					hasIcon = true;
					$("<i>&nbsp;</i>").appendTo(dropdownItem).css("backgroundImage", "url(" + temp.icon + ")");
				}
				let label = Utils.trimToNull(temp.label);
				$("<span></span>").appendTo(dropdownItem).text(label || "选项");
				if (_isToggle && label && label == data.label)
					dropdownItem.addClass("active");
			});
			if (hasIcon)
				dropdown.attr("show-ic", "1");
		}
	};

	const renderContent = function ($, target, viewports) {
		let container = $("<section></section>").appendTo(target);
		container = $("<div class='container'></div>").appendTo(container);

		let content = $("<div></div>").appendTo(container);
		let contentView = this.options.content || this.options.view;
		if (Utils.isNotNull(contentView)) {
			if (Utils.isFunction(contentView.render))
				contentView.render(content);
			else
				content.append(contentView.$el || contentView);
		}

		viewports = viewports || this._viewports;
		renderViewports.call(this, $, container, viewports);
		
		if (container.children(".selected").length == 0)
			content.addClass("selected");
	};

	const renderViewports = function ($, container, viewports) {
		container.children(":not(:first-child)").remove();
		if (viewports && viewports.length > 0) {
			let viewIndex = Utils.getIndexValue(this.options.viewIndex);
			Utils.each(viewports, (data, i) => {
				contentView = data.content || data.view;
				if (Utils.isNotNull(contentView)) {
					let viewport = $("<div></div>").appendTo(container);
					viewport.attr("name", data.name);
					if (i == viewIndex)
						viewport.addClass("selected");
					if (Utils.isFunction(contentView.render))
						contentView.render(viewport);
					else
						viewport.append(contentView.$el || contentView);
				}
			});
		}
	};

	///////////////////////////////////////////////////////
	const doInit = function () {
		this.getButtons(); // 初始化

		let tab = this.header.find(".tabbar .tab.selected");
		if (tab && tab.length > 0)
			showViewportThumbs.call(this, tab);
	};

	const showViewport = function (name) {
		let tabs = this.header.find(".tabbar .tab");
		let tabItem = Utils.find(tabs, (tab) => {
			return tab.attr("name") == name;
		});
		if (!tabItem || tabItem.length == 0)
			return ; // 不存在的视图
		if (tabItem.is(".selected"))
			return ;

		let lastTabItem = tabs.filter(".selected").removeClass("selected");
		tabItem.addClass("selected");
		showViewportThumbs.call(this, tabItem);

		let viewports = this.container.children();
		let viewport = Utils.find(viewports, (item) => {
			return item.attr("name") == name;
		});

		if (!viewport || viewport.length == 0)
			viewport = viewports.eq(0);

		if (!viewport.is(".selected")) {
			let currentViewport = viewports.filter(".selected");
			let swrapLeft = lastTabItem.index() < tabItem.index();
			viewport.addClass("animate-in");
			viewport.addClass(swrapLeft ? "animate-in-right" : "animate-in-left");
			currentViewport.addClass("animate-out");
			setTimeout(() => {
				viewport.removeClass("animate-in-left animate-in-right");
				currentViewport.addClass(swrapLeft ? "animate-out-left" : "animate-out-right");
				setTimeout(() => {
					viewport.addClass("selected").removeClass("animate-in");
					currentViewport.removeClass("selected animate-out animate-out-left animate-out-right");
				}, 400);
			}, 0);
		}

		this.trigger("change", tabItem.attr("name"), lastTabItem.attr("name"));
	};

	const showViewportThumbs = function (tab) {
		let thumb = this.header.children(".tabbar").children(".thumb");
		if (thumb && thumb.length > 0) {
			let left = tab.position().left;
			let width = tab.outerWidth();

			let thumbWidth = this.options.thumbWidth;
			if (thumbWidth) {
				if (Utils.isFunction(thumbWidth))
					thumbWidth = thumbWidth(tab, width);
				else if (/%$/.test(thumbWidth))
					thumbWidth = parseFloat(thumbWidth) * width / 100;
				if (!isNaN(thumbWidth)) {
					left += (width - thumbWidth) / 2;
					width = thumbWidth;
				}
			}

			thumb.css("left", left + "px");
			thumb.css("width", width + "px");
		}
	};

	const showBtnDropdown = function (btnItem) {
		if (btnItem.is(".show-dropdown"))
			return ;
		btnItem.addClass("show-dropdown");
		btnItem.on("mouseenter", onButtonMouseHandler.bind(this));
		btnItem.on("mouseleave", onButtonMouseHandler.bind(this));
		setTimeout(() => {
			btnItem.addClass("animate-in");
		}, 0);
	};

	const hideBtnDropdown = function (btnItem) {
		btnItem.addClass("animate-out");
		btnItem.off("mouseenter").off("mouseleave");
		setTimeout(() => {
			btnItem.removeClass("show-dropdown");
			btnItem.removeClass("animate-in").removeClass("animate-out");
		}, 300);
	};

	const getPopupMenus = function (buttons) {
		if (buttons && buttons.length > 0) {
			let format = (data) => {
				let temp = {};
				temp.name = data.name;
				temp.label = data.label || data.name || "按钮";
				if (data.icon)
					temp.icon = data.icon;
				if (data.toggle)
					temp.toggle = data.toggle;
				if (data.disabled)
					temp.disabled = data.disabled;
				return temp;
			};
			return Utils.map(buttons, (data) => {
				let item = format(data);
				item.children = Utils.map(data.items, format);
				if (item.children.length == 0)
					delete item.children;
				return item;
			});
		}
		return null;
	};

	const getFormatViewports = function (value) {
		let viewports = [];
		Utils.each(Utils.toArray(value), (data, i) => {
			if (Utils.isNotBlank(data) && (typeof data == "object")) {
				data.name = data.name || ("view_" + i);
				viewports.push(data);
			}
		});
		return viewports;
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIPanel = UIPanel;
		UI.init(".ui-panel", UIPanel, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");