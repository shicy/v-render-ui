// 2019-04-15

(function (frontend) {
	if (frontend && VRender.Component.ui)
		return ;

	const Utils = frontend ? VRender.Utils : require(__vrender__).Utils;

	///////////////////////////////////////////////////////
	const Fn = {};

	// ====================================================
	if (frontend) {
		const VComponent = VRender.Component;

		// 注册前端组件
		Fn.init = function (selector, UIComp, Renderer) {
			VComponent.register(selector, UIComp);

			UIComp.create = function (options) {
				return VComponent.create(options, UIComp, Renderer);
			};

			UIComp.find = function (view) {
				return VComponent.find(view, selector, UIComp);
			};

			UIComp.findMe = function (view) {
				let comps = VComponent.find(view, selector, UIComp);
				return (comps && comps[0]) || null;
			};

			UIComp.instance = function (target) {
				return VComponent.instance(target, selector);
			};
		};

		// 判断是不是页面元素（包括 jQuery 对象）
		Fn.isElement = function (target) {
			return (target instanceof Element) || (target instanceof $);
		};
	}

	///////////////////////////////////////////////////////
	if (frontend) {
		VRender.Component.ui = { util: Utils, fn: Fn };
	}
	else {
		exports.util = Utils;
		exports.fn = Fn;
		require("./base");
		require("./items");
		require("./selectable");
	}
})(typeof window !== "undefined");