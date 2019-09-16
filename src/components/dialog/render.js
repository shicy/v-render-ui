// 2019-06-13
// dialog

(function (frontend) {
	if (frontend && VRender.Component.ui.dialog)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	const openedDialogs = [];
	const defaultButtons = [{name: "cancel", label: "取消", type: "cancel"}, {name: "ok", label: "确定", type: "primary"}];
	const defaultButtons2 = [{name: "ok", label: "确定", type: "primary"}, {name: "cancel", label: "取消", type: "cancel"}];

	///////////////////////////////////////////////////////
	const UIDialog = UI.dialog = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIDialog = UIDialog.prototype = new UI._base(false);

	UIDialog.create = function (options) {
		options = options || {};
		if (!options.target) {
			let target = $("body").children(".ui-dialog-wrap");
			if (!target || target.length == 0)
				target = $("<div class='ui-dialog-wrap'></div>").appendTo($("body"));
			options.target = target;
		}
		return VRender.Component.create(options, UIDialog, Renderer);
	};

	UIDialog.close = function (view, forceClose, closedHandler) {
		if (!view.is(".ui-dialog"))
			view = Utils.parentUntil(view, ".ui-dialog");
		if (view && view.length > 0) {
			let dialog = VRender.Component.get(view);
			if (dialog && (dialog instanceof UIDialog))
				dialog.close(forceClose, closedHandler);
		}
	};

	// ====================================================
	_UIDialog.init = function (target, options) {
		UI._base.init.call(this, target, options);

		this.dialogParent = this.$el.parent();

		let dialogView = this.dialogView = this.$el.children().children();

		let dialogHeader = dialogView.children("header");
		dialogHeader.on("tap", ".closebtn", closeBtnHandler.bind(this));

		let dialogFooter = dialogView.children("footer");
		dialogFooter.on("tap", ".btnbar > .btn", buttonClickHandler.bind(this));

		let activeBtn = getActiveButton.call(this);
		if (activeBtn && activeBtn.length > 0)
			activeBtn.on("tap", activeBtnClickHandler.bind(this));

		if (this._isRenderAsApp()) {
			this.$el.on("tap", onTouchHandler.bind(this));
		}
		else /*if (this.$el.is("[opt-size='auto']"))*/ {
			initResizeEvents.call(this);
		}

		initContentEvents.call(this);
	};

	// ====================================================
	_UIDialog.open = function () {
		if (this.isopened)
			return this;
		this.isopened = true;

		let body = $("body").addClass("ui-scrollless");
		if (body.children(".ui-dialog-mask").length == 0)
			body.append("<div class='ui-dialog-mask'></div>");

		if (this.$el.attr("opt-stay") != 1) {
			if (body.children(".ui-dialog-wrap").length == 0)
				body.append("<div class='ui-dialog-wrap'></div>");
			let dialogWrap = body.children(".ui-dialog-wrap");
			if (!this.dialogParent.is(dialogWrap)) {
				this.$el.appendTo(dialogWrap);
			}
		}

		this.$el.css("display", "").addClass("show-dialog");
		openedDialogs.push(this);

		this._getContentView().trigger("dialog_open");

		let transName = this.$el.attr("opt-trans");
		if (transName) {
			let target = this.$el.addClass(transName + "-open");
			setTimeout(() => {
				target.addClass(transName + "-opened");
			});
			setTimeout(() => {
				target.removeClass(transName + "-open").removeClass(transName + "-opened");
			}, 300);
		}

		this.trigger("opened");
		return this;
	};

	_UIDialog.close = function (forceClose, closedHandler) {
		if (!this.isopened)
			return ;

		if (Utils.isFunction(forceClose)) {
			closedHandler = forceClose;
			forceClose = false;
		}

		let event = {type: "dialog_close"};
		this._getContentView().trigger(event);

		if (!!forceClose || !event.isPreventDefault) {
			this.isopened = false;
			let target = this.$el.removeClass("show-dialog");

			let transName = target.attr("opt-trans");
			if (transName) {
				target.addClass(transName + "-close");
				setTimeout(() => {
					target.addClass(transName + "-closed");
				});
			}

			let delay = !!transName ? 200 : 0;
			setTimeout(() => {
				if (transName) {
					target.removeClass(transName + "-close").removeClass(transName + "-closed");
				}

				let body = $("body");
				let dialogWrap = body.children(".ui-dialog-wrap");
				if (this.dialogParent.is(dialogWrap))
					this.$el.remove();
				else if (this.$el.attr("opt-stay") != 1)
					this.$el.appendTo(this.dialogParent);

				for (let i = openedDialogs.length - 1; i >= 0; i--) {
					if (openedDialogs[i] === this)
						openedDialogs.splice(i, 1);
				}
				if (openedDialogs.length == 0) {
					let mask = body.removeClass("ui-scrollless").children(".ui-dialog-mask").fadeOut(200);
					setTimeout(() => {
						mask.remove();
					}, 200);
				}

				if (Utils.isFunction(closedHandler))
					closedHandler();

			}, delay);
			
			this.trigger("closed");
		}
	};

	// ====================================================
	_UIDialog.getTitle = function () {
		return this.dialogView.children("header").find(".title").text();
	};
	_UIDialog.setTitle = function (value) {
		value = Utils.isBlank(value) ? "&nbsp;" : value;
		this.dialogView.children("header").find(".title").html(value);
	};

	_UIDialog.getContent = function () {
		let content = this._getContentView();
		if (content) {
			content = VRender.Component.get(content) || content;
		}
		return content;
	};
	_UIDialog.setContent = function (view) {
		renderContentView.call(this, $, this.$el, view);
		initContentEvents.call(this);
	};

	_UIDialog.setButtons = function (buttons) {
		renderFootButtons.call(this, $, this.$el, buttons);
	};

	_UIDialog.isScrollable = function () {
		return this.$el.is("scrollable");
	};
	_UIDialog.setScrollable = function (value) {
		if (Utils.isNull(value) || Utils.isTrue(value))
			this.$el.addClass("scrollable");
		else
			this.$el.removeClass("scrollable");
	};

	_UIDialog.getSize = function () {
		return this.$el.attr("opt-size") || "normal";
	};
	_UIDialog.setSize = function (value) {
		if (/^small|big|auto$/.test(value))
			this.$el.attr("opt-size", value);
		else 
			this.$el.removeAttr("opt-size");
	};
	
	_UIDialog.isFill = function () {
		return this.$el.attr("opt-fill") == 1;
	};
	_UIDialog.setFill = function (value) {
		if (Utils.isNull(value) || Utils.isTrue(value))
			this.$el.attr("opt-fill", "1");
		else
			this.$el.removeAttr("opt-fill");
	};

	_UIDialog.isOpen = function () {
		return !!this.isopened;
	};

	// ====================================================
	_UIDialog.destory = function () {
		this.close(true, () => {
			this.$el.remove();
		});
	};

	_UIDialog.waiting = function (waitFlag, btnName) {
		let button = null;
		if (Utils.isNotBlank(btnName)) {
			let dialogFooter = this.dialogView.children("footer");
			button = dialogFooter.find(".btnbar > .btn[name='" + btnName + "']");
			if (!(button && button.length > 0))
				button = null;
		}

		let waitTime = button && parseInt(button.attr("opt-wait")) || 0;

		if (Utils.isNull(waitFlag) || waitFlag === true)
			waitTime = waitTime || -1;
		else if (waitFlag) {
			if (isNaN(waitFlag))
				waitTime = Utils.isTrue(waitFlag) ? (waitTime || -1) : 0;
			else 
				waitTime = Math.max(0, parseInt(waitFlag));
		}
		else {
			waitTime = 0;
		}

		setWaitting.call(this, waitTime, button);
	};

	_UIDialog.setButtonValue = function (name, value) {
		if (Utils.isNotBlank(name) && Utils.isNotNull(value)) {
			let dialogFooter = this.dialogView.children("footer");
			let button = dialogFooter.find(".btnbar > .btn[name='" + name + "']");
			if (button && button.length > 0) {
				button = VRender.Component.get(button.children());
				button && button.setLabel(value);
			}
		}
	};

	// ====================================================
	_UIDialog._getContentView = function () {
		return this.dialogView.children("section").children(".container").children();
	};

	_UIDialog._isTouchCloseable = function () {
		return this.options.touchCloseEnabled !== false;
	};

	// ====================================================
	const closeBtnHandler = function (e) {
		this.close();
	};

	const buttonClickHandler = function (e) {
		let btn = $(e.currentTarget);
		if (btn.is(".disabled, .waiting"))
			return ;

		let btnName = btn.attr("name") || "";

		if (btnName)
			this._getContentView().trigger("dialog_btn_" + btnName, btnName, this);

		let hasListen = false;
		if (btnName) {
			let btnEventName = "btn_" + btnName;
			if (this.hasListen(btnEventName)) {
				hasListen = true;
				this.trigger(btnEventName, btnName, this);
			}
		}
		if (this.hasListen("btnclk")) {
			hasListen = true;
			this.trigger("btnclk", btnName, this);
		}

		let waitTime = btn.attr("opt-wait");
		if (waitTime || waitTime == 0) { // 0也是需要关闭的
			waitTime = parseInt(waitTime) || 0;
			setWaitting.call(this, waitTime, btn);
			if (waitTime > 0) {
				this.closeTimerId = setTimeout(() => {
					this.closeTimerId = 0;
					this.close();
				}, waitTime);
			}
		}
		else if (!hasListen) {
			if (/^ok|cancel|submit|close|save|finish$/.test(btnName))
				this.close(/^cancel|close$/.test(btnName));
		}
	};

	const activeBtnClickHandler = function (e) {
		if (this.isMounted()) {
			this.open();
		}
		else {
			this.activeBtn.off("tap", arguments.callee);
		}
	};

	const windowResizeHandler = function () {
		if (this.isMounted()) {
			let container = this.dialogView.children("section").children(".container");
			container.css("maxHeight", $(window).height() - 200);
		}
		else {
			$(window).off("resize._" + this.getViewId());
		}
	};

	const onTouchHandler = function (e) {
		if ($(e.target).is(this.$el)) {
			if (this._isTouchCloseable())
				this.close();
		}
	};

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-dialog").css("display", "none");
		target.attr("opt-trans", "translate");

		let options = this.options || {};

		if (/^small|big|auto$/.test(options.size))
			target.attr("opt-size", options.size);

		if (Utils.isTrue(options.fill))
			target.attr("opt-fill", "1");

		if (Utils.isTrue(options.scrollable))
			target.addClass("scrollable");

		if (Utils.isTrue(options.stay))
			target.attr("opt-stay", "1");

		target.attr("opt-active", Utils.trimToNull(this.getActiveButton()));

		let container = $("<div class='dialog-container'></div>").appendTo(target);
		let dialogView = $("<div class='dialog-view'></div>").appendTo(container);

		let rem = this._isRenderAsRem();
		let width = Utils.getFormatSize(options.width, rem);
		if (width)
			container.css("width", width);
		let height = Utils.getFormatSize(options.height, rem);
		if (height)
			container.css("height", height);

		renderDialogHeader.call(this, $, target, dialogView);
		renderDialogContent.call(this, $, target, dialogView);
		renderDialogFooter.call(this, $, target, dialogView);

		return this;
	};

	// ====================================================
	_Renderer.getTitle = function () {
		let title = this.options.title;
		if (Utils.isNull(title))
			return "标题";
		if (Utils.isBlank(title))
			return "&nbsp;";
		return title;
	};

	_Renderer.getActiveButton = function () {
		let button = this.options.openbtn;
		if (!frontend && button) {
			if (typeof button == "string")
				return button;
			if (Utils.isFunction(button.getViewId))
				return "[vid='" + button.getViewId() + "']";
		}
		return null;
	};
	
	// ====================================================
	const renderDialogHeader = function ($, target, dialogView) {
		let dialogHeader = $("<header></header>").appendTo(dialogView);

		let title = $("<div class='title'></div>").appendTo(dialogHeader);
		title.html(this.getTitle());

		dialogHeader.append("<button class='closebtn'>x</button>");
	};

	const renderDialogContent = function ($, target, dialogView) {
		dialogView.append("<section></section>");
		let contentView = this.options.content || this.options.view;
		renderContentView.call(this, $, target, contentView);
	};

	const renderDialogFooter = function ($, target, dialogView) { 
		dialogView.append("<footer></footer>");
		renderFootButtons.call(this, $, target, this.options.buttons);
	};

	const renderContentView = function ($, target, contentView) {
		let container = getDialogView(target).children("section").empty();
		container = $("<div class='container'></div>").appendTo(container);
		if (Utils.isNotBlank(contentView)) {
			if (Utils.isFunction(contentView.render))
				contentView.render(container);
			else if (contentView.$el)
				contentView.$el.appendTo(container);
			else
				container.append(contentView);
		}
	};

	const renderFootButtons = function ($, target, buttons) {
		target.removeClass("has-btns");
		let container = getDialogView(target).children("footer");
		container.children(".btnbar").remove();

		if (!buttons) {
			buttons = this._isRenderAsApp() ? defaultButtons2 : defaultButtons;
			buttons = JSON.parse(JSON.stringify(buttons));
		}

		buttons = Utils.toArray(buttons);
		if (buttons && buttons.length > 0) {
			target.addClass("has-btns");
			let btnbar = $("<div class='btnbar'></div>").appendTo(container);
			btnbar.attr("opt-len", buttons.length);
			Utils.each(buttons, (button) => {
				let btn = $("<div class='btn'></div>").appendTo(btnbar);
				btn.attr("name", button.name);

				if (button.waitclose === true)
					btn.attr("opt-wait", "-1");
				else if ((button.waitclose || button.waitclose === 0) && !isNaN(button.waitclose))
					btn.attr("opt-wait", Math.max(0, parseInt(button.waitclose)));

				if (!frontend) {
					let UIButton = require("../button/index");
					new UIButton(this.context, button).render(btn);
				}
				else {
					UI.button.create(Utils.extend({}, button, {target: btn}));
				}
			});
		}
	};

	///////////////////////////////////////////////////////
	const initContentEvents = function () {
		let contentView = this._getContentView();
		if (contentView && contentView.length > 0) {
			contentView.off("submit_to_dialog");
			contentView.on("submit_to_dialog", (e, data) => {
				this.trigger("view_submit", data);
				this.close();
			});
		}
	};

	const initResizeEvents = function () {
		let eventName = "resize._" + this.getViewId();
		let _window = $(window).off(eventName);
		if (this.getSize() == "auto") {
			_window.on(eventName, windowResizeHandler.bind(this));
			windowResizeHandler.call(this);
		}
	};

	// ====================================================
	const getDialogView = function (target) {
		return target.children(".dialog-container").children(".dialog-view");
	};

	const getActiveButton = function () {
		if (!this.options.hasOwnProperty("openbtn")) {
			this.options.openbtn = this.$el.attr("opt-active");
			this.$el.removeAttr("opt-active");
		}
		let activeBtn = this.options.openbtn;
		if (activeBtn) {
			if (activeBtn.$el)
				return activeBtn.$el;
			return $(activeBtn);
		}
		return null;
	};

	const setWaitting = function (waitTime, btn) {
		let button = btn ? VRender.Component.get(btn.children()) : null;
		if (waitTime) {
			if (button) {
				btn.addClass("waiting")
				button.waiting();
			}
			else {
				this.$el.addClass("waiting");
			}
			if (waitTime > 0) {
				setTimeout(() => {
					setWaitting.call(this, false, btn);
				}, waitTime);
			}
		}
		else {
			if (button) {
				btn.removeClass("waiting");
				button.waiting(false);
			}
			else {
				this.$el.removeClass("waiting");
			}
		}
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIDialog = UIDialog;
		UI.init(".ui-dialog", UIDialog, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");