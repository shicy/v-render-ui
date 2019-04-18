// 2019-04-14

(function (frontend) {
	if (frontend && VRender.Component.ui._base)
		return ;

	const UI = frontend ? VRender.Component.ui : require("./init");

	///////////////////////////////////////////////////////
	const UIBase = UI._base = function (context, options) {
		// this.context = context
	};
	const _UIBase = UIBase.prototype = new Object();

	///////////////////////////////////////////////////////
	const Renderer = UI._baseRender = function (context, options) {
		this.context = context;
		this.options = options || {};
	};
	const _Renderer = Renderer.prototype = new Object();

	// ====================================================
	Renderer.render = function ($, target) {
		// this.renderData($, target);
		// Fn.renderFunction.call(this, target, "adapter", this.getDataAdapter());
		// Fn.renderFunction.call(this, target, "mapper", this.getDataMapper());
	};
})(typeof window !== "undefined");