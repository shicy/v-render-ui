// 2019-06-10
// tooltip

(function (frontend) {
	if (frontend && VRender.Component.ui.tooltip)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UITooltip = UI.tooltip = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UITooltip = UITooltip.prototype = new UI._base(false);

	_UITooltip.init = function (target, options) {
		UI._base.init.call(this, target, options);

		this.open();
	};

	// ====================================================
	_UITooltip.open = function () {
		doOpen.call(this);

		if (this._isRenderAsApp()) {
			if (this.$el.find(".closebtn").length > 0)
				this.$el.on("tap", onClickHandler.bind(this));
		}
		else {
			this.$el.on("tap", ".closebtn", onCloseBtnHandler.bind(this));
			this.$el.on("tap", ".content", onContentClickHandler.bind(this));
			this.$el.on("mouseenter", onMouseHandler.bind(this));
			this.$el.on("mouseleave", onMouseHandler.bind(this));
		}
	};

	_UITooltip.close = function () {
		doClose.call(this);
	};


	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-tooltip");

		let type = this.getType();
		if (type)
			target.addClass("show-icon").attr("opt-type", type);

		target.attr("opt-duration", this.getDuration());

		renderView.call(this, $, target);

		return this;
	};

	// ====================================================
	_Renderer.getType = function () {
		if (this.options.type == "danger")
			return "error";
		if (/^(success|warn|error|info)$/i.test(this.options.type))
			return this.options.type;
		return null;
	};

	_Renderer.getDuration = function () {
		if (Utils.isBlank(this.options.duration))
			return null;
		if (isNaN(this.options.duration))
			return null;
		return parseInt(this.options.duration) || 0;
	};

	_Renderer.isClosable = function () {
		if (Utils.isNull(this.options.closable))
			return true;
		return Utils.isTrue(this.options.closable);
	}


	///////////////////////////////////////////////////////
	const onClickHandler = function (e) {
		if ($(e.target).is(this.$el)) {
			doClose.call(this);
		}
	};

	const onCloseBtnHandler = function () {
		doClose.call(this);
	};

	const onContentClickHandler = function () {
		this.$el.addClass("active");
	};

	const onMouseHandler = function (e) {
		if (e.type == "mouseenter") {
			if (this.t_close) {
				clearTimeout(this.t_close);
				this.t_close = null;
			}
		}
		else {
			this.$el.removeClass("active");
			waitToClose.call(this);
		}
	};

	// ====================================================
	const renderView = function ($, target) {
		let container = $("<div class='container'></div>").appendTo(target);

		let icon = $("<i class='img'></i>").appendTo(container);

		let content = $("<div class='content'></div>").appendTo(container);
		if (this.options.hasOwnProperty("focusHtmlContent")) {
			content.html(this.options.focusHtmlContent || "无");
		}
		else {
			content.text(this.options.content || "无");
		}
		
		if (this.isClosable())
			container.append("<div class='closebtn'></div>");

		if (this.options.icon) {
			target.addClass("show-icon");
			icon.css("backgroundImage", "url(" + this.options.icon + ")");
		}
	};

	// ====================================================
	const doOpen = function () {
		let wrapper = $("body").children(".ui-tooltip-wrap");
		if (!wrapper || wrapper.length == 0)
			wrapper = $("<div class='ui-tooltip-wrap'></div>").appendTo("body");

		let target = this.$el.appendTo(wrapper);
		
		setTimeout(() => {
			target.addClass("animate-in");
		}, 50);

		waitToClose.call(this);
	};

	const doClose = function () {
		let target = this.$el.addClass("animate-out");
		setTimeout(() => {
			target.removeClass("animate-in").removeClass("animate-out");
			target.remove();
			let wrapper = $("body").children(".ui-tooltip-wrap");
			if (wrapper.children().length == 0)
				wrapper.remove();
		}, 500);
		this.trigger("close");
	};

	const waitToClose = function () {
		if (this.t_close) {
			clearTimeout(this.t_close);
			this.t_close = null;
		}

		let duration = this.$el.attr("opt-duration");
		if (Utils.isBlank(duration))
			duration = 3000;
		else
			duration = parseInt(duration) || 0;

		if (duration > 0) {
			this.t_close = setTimeout(() => {
				this.t_close = null;
				doClose.call(this);
			}, duration);
		}
	};
	

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UITooltip = UITooltip;
		UI.init(".ui-tooltip", UITooltip, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");