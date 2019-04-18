// 2019-04-18

(function (frontend) {
	if (frontend && VRender.Component.ui._items)
		return ;

	const UI = frontend ? VRender.Component.ui : require("./init");

	///////////////////////////////////////////////////////
	const UIItems = UI._items = function (context, options) {
	};
	const _UIItems = UIItems.prototype = new Object();

	///////////////////////////////////////////////////////
	const Renderer = UI._itemsRender = function (context, options) {
	};
	const _Renderer = Renderer.prototype = new Object();
})(typeof window !== "undefined");