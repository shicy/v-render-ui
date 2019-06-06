// 2019-06-06
// textview

(function (frontend) {
	if (frontend && VRender.Component.ui.textview)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UITextView = UI.textview = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UITextView = UITextView.prototype = new UI._base(false);

	_UITextView.init = function (target, options) {
		UI._base.init.call(this, target, options);
	};

	// ====================================================
	
	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-textview");
		target.text("UITextView");

		let options = this.options || {};

		return this;
	};


	///////////////////////////////////////////////////////


	///////////////////////////////////////////////////////
	if (frontend) {
		window.UITextView = UITextView;
		UI.init(".ui-textview", UITextView, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");