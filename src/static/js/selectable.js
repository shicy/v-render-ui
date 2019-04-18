// 2019-04-18

(function (frontend) {
	if (frontend && VRender.Component.ui._select)
		return ;

	const UI = frontend ? VRender.Component.ui : require("./init");

	///////////////////////////////////////////////////////
	const UISelect = UI._select = function (content, options) {
	};
	const _UISelect = UISelect.prototype = new Object();

	///////////////////////////////////////////////////////
	const Renderer = UI._selectRender = function (context, options) {
	};
	const _Renderer = Renderer.prototype = new Object();
})(typeof window !== "undefined");