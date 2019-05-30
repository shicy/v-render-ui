// 2019-05-29
// combobox

(function (frontend) {
	if (frontend && VRender.Component.ui.combobox)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Utils = UI.util;

	///////////////////////////////////////////////////////
	const UICombobox = UI.combobox = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UICombobox = UICombobox.prototype = new UI._base();

	_UICombobox.init = function (target, options) {
		UI._base.init.call(this, target, options);
	};

	// ====================================================
	

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender();

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-combobox");

		let options = this.options || {};
		target.text("UICombobox");

		return this;
	};


	///////////////////////////////////////////////////////


	///////////////////////////////////////////////////////
	if (frontend) {
		window.UICombobox = UICombobox;
		UI.init(".ui-combobox", UICombobox, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");