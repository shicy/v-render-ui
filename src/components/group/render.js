// 2019-04-13

(function (frontend) {
	if (frontend && VRender.Component.ui.group)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");

	const VERTICAL = "vertical";
	const HORIZONTIAL = "horizontial";

	///////////////////////////////////////////////////////
	const UIGroup = UI.group = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIGroup = UIGroup.prototype = new UI._base();

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender();

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-group");

		
		// BaseRender._base.render.call(this, $, target);
		// target.addClass("ui-group");

		// var options = this.options || {};

		// var orientation = options.orientation;
		// if (orientation === Renderer.HORIZONTIAL || orientation === Renderer.VERTICAL) {
		// 	target.addClass(orientation);
		// 	target.attr("opt-orientation", orientation);
		// }

		// target.attr("opt-gap", options.gap);
		// target.attr("opt-align", options.align);

		// this.renderSubViews($, target);
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIGroup = UIGroup;
		UI.init(".ui-group", UIGroup, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");