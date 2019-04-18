// 2019-04-15

(function (frontend) {
	if (frontend && VRender.Component.ui)
		return ;

	const Utils = frontend ? VRender.Utils : require(__vrender__).Utils;

	///////////////////////////////////////////////////////
	const Funs = {};

	///////////////////////////////////////////////////////
	if (frontend) {
		VRender.Component.ui = {
			util: Utils,
			fn: Funs
		};
	}
	else {
		exports.util = Utils;
		exports.fn = Funs;
		require("./base");
		require("./items");
		require("./selectable");
	}
})(typeof window !== "undefined");