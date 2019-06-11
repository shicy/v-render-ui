// 2019-06-11
// notice

(function (frontend) {
	if (frontend && VRender.Component.ui.notice)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UINotice = UI.notice = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UINotice = UINotice.prototype = new UI._base(false);

	_UINotice.init = function (target, options) {
		UI._base.init.call(this, target, options);
		this.open();
	};

	// ====================================================
	_UINotice.open = function () {
		doOpen.call(this);

		this.$el.on("tap", ".closebtn", onCloseBtnHandler.bind(this));

		if (!this._isRenderAsApp()) {
			this.$el.on("mouseenter", onMouseHandler.bind(this));
			this.$el.on("mouseleave", onMouseHandler.bind(this));
		}
	};

	_UINotice.close = function () {
		doClose.call(this);
	};


	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-notice");

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
			this.options.type = "error";
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
	const onCloseBtnHandler = function () {
		doClose.call(this);
	};

	const onMouseHandler = function (e) {
		if (e.type == "mouseenter") {
			if (this.t_close) {
				clearTimeout(this.t_close);
				this.t_close = null;
			}
		}
		else {
			waitToClose.call(this);
		}
	};
	
	// ====================================================
	const renderView = function ($, target) {
		let container = $("<div class='container'></div>").appendTo(target);

		let icon = $("<i class='img'></i>").appendTo(container);

		let title = Utils.trimToNull(this.options.title);
		if (title)
			$("<div class='title'></div>").appendTo(container).text(title);

		let content = $("<div class='content'></div>").appendTo(container);
		content = $("<div></div>").appendTo(content);
		if (this.options.hasOwnProperty("focusHtmlContent")) {
			content.html(this.options.focusHtmlContent || "无内容");
		}
		else {
			content.text(this.options.content || "无内容");
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
		let wrapper = $("body").children(".ui-notice-wrap");
		if (!wrapper || wrapper.length == 0)
			wrapper = $("<div class='ui-notice-wrap'></div>").appendTo("body");

		let target = this.$el;
		if (this._isRenderAsApp())
			wrapper.append(target);
		else
			wrapper.prepend(target);
		
		setTimeout(() => {
			target.addClass("animate-in");
			// let maxHeight = target.children()[0].offsetHeight + 10;
			// target.css("maxHeight", maxHeight + "px");
		}, 50);

		if (this._isRenderAsApp()) {
			setTimeout(() => {
				let content = target.find(".content");
				let text = content.children();
				let contentWidth = content.width();
				let _width = text.width() - content.width();
				if (_width > 0) {
					content.addClass("over");
					let time = Math.max(5000, _width * 20);
					text.css("animation", "ui-notice-animate " + time + "ms infinite linear");
				}
			}, 1000);
		}

		waitToClose.call(this);
	};

	const doClose = function () {
		let target = this.$el.addClass("animate-out");
		// target.css("maxHeight", "");
		setTimeout(() => {
			target.removeClass("animate-in").removeClass("animate-out");
			target.remove();
			let wrapper = $("body").children(".ui-notice-wrap");
			if (wrapper.children().length == 0)
				wrapper.remove();
		}, 1500);

		this.trigger("close");
	};

	const waitToClose = function () {
		if (this.t_close) {
			clearTimeout(this.t_close);
			this.t_close = null;
		}

		let duration = this.$el.attr("opt-duration");
		if (Utils.isBlank(duration))
			duration = 10000;
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
		window.UINotice = UINotice;
		UI.init(".ui-notice", UINotice, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");