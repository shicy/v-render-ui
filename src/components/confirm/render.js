// 2019-06-10
// confirm

(function (frontend) {
	if (frontend && VRender.Component.ui.confirm)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UIConfirm = UI.confirm = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIConfirm = UIConfirm.prototype = new UI._base(false);

	_UIConfirm.init = function (target, options) {
		UI._base.init.call(this, target, options);

		this.open();
	};

	// ====================================================
	_UIConfirm.open = function () {
		doOpen.call(this);

		this.$el.on("tap", ".closebtn", onCloseBtnHandler.bind(this));
		this.$el.on("tap", ".btnbar .ui-btn", onButtonClickHandler.bind(this));
	};

	_UIConfirm.close = function () {
		doClose.call(this);
	};

	_UIConfirm.onSubmit = function (handler) {
		this.submitHandler = handler;
		return this;
	};

	_UIConfirm.onCancel = function (handler) {
		this.cancelHandler = handler;
		return this;
	};


	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-confirm");

		renderView.call(this, $, target);

		return this;
	};

	// ====================================================
	_Renderer.getConfirmLabel = function () {
		return Utils.trimToNull(this.options.confirmLabel) || "确认";
	};

	_Renderer.getCancelLabel = function () {
		return Utils.trimToNull(this.options.cancelLabel) || "取消";
	};

	///////////////////////////////////////////////////////
	const onCloseBtnHandler = function (e) {
		doCancel.call(this);
	};

	const onButtonClickHandler = function (e) {
		if ($(e.currentTarget).attr("name") == "ok") {
			doSubmit.call(this);
		}
		else {
			doCancel.call(this);
		}
	};

	// ====================================================
	const renderView = function ($, target) {
		let container = $("<div class='container'></div>").appendTo(target);

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

		let btnbar = $("<div class='btnbar'></div>").appendTo(container);
		addButton($, btnbar, {name: "ok", label: this.getConfirmLabel(), type: "primary"});
		addButton($, btnbar, {name: "cancel", label: this.getCancelLabel()});

		$("<span class='closebtn'></span>").appendTo(container);
	};

	const addButton = function ($, target, data) {
		target = $("<div></div>").appendTo(target);
		if (!frontend) {
			let UIButton = require("../button/index");
			new UIButton(this.context, data).render(target);
		}
		else {
			UI.button.create(Utils.extend(data, {target: target}));
		}
	};

	// ====================================================
	const doOpen = function () {
		let wrapper = $("body").children(".ui-confirm-wrap");
		if (!wrapper || wrapper.length == 0)
			wrapper = $("<div class='ui-confirm-wrap'></div>").appendTo("body");

		let target = this.$el.appendTo(wrapper);
		
		setTimeout(() => {
			target.addClass("animate-in");
		}, 50);
	};

	const doClose = function () {
		let target = this.$el.addClass("animate-out");
		setTimeout(() => {
			target.removeClass("animate-in").removeClass("animate-out");
			target.remove();
			let wrapper = $("body").children(".ui-confirm-wrap");
			if (wrapper.children().length == 0)
				wrapper.remove();
		}, 500);
		this.trigger("close");
	};

	const doSubmit = function () {
		doClose.call(this);
		if (Utils.isFunction(this.submitHandler))
			this.submitHandler();
		this.trigger("submit");
	};

	const doCancel = function () {
		doClose.call(this);
		if (Utils.isFunction(this.cancelHandler))
			this.cancelHandler();
		this.trigger("cancel");
	};
	

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIConfirm = UIConfirm;
		UI.init(".ui-confirm", UIConfirm, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");