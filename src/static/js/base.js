// 2019-04-14

(function (frontend) {
	if (frontend && VRender.Component.ui._base)
		return ;

	const UI = frontend ? VRender.Component.ui : require("./init");
	const Fn = UI.fn;
	const Utils = UI.util;

	///////////////////////////////////////////////////////
	const UICommon = function () {};
	if (frontend)
		UICommon.prototype = new VRender.EventEmitter();
	else
		UICommon.prototype = new Object();
	const _UICommon = UICommon.prototype;

	// 组件原数据（集）适配
	_UICommon._doAdapter = function (data) {
		return !data ? null : Fn.doAdapter.call(this, data);
	};

	// ----------------------------------------------------
	// 判断组件是否在应用模式下渲染，一般指移动端渲染
	_UICommon._isRenderAsApp = function () {
		if (frontend)
			return VRender.ENV.isApp;
		if (!this.hasOwnProperty("_isApp")) {
			this._isApp = false;
			if (this.context && Utils.isFunction(this.context.isRenderAsApp))
				this._isApp = this.context.isRenderAsApp();
		}
		return this._isApp;
	};

	// 判断组件是否在 iPhone 中渲染
	_UICommon._isRenderAsIphone = function () {
		if (frontend)
			return VRender.ENV.isIphone;
		if (!this.hasOwnProperty("_isIphone")) {
			this._isIphone = false;
			if (this.context && Utils.isFunction(this.context.isRenderAsIphone))
				this._isIphone = this.context.isRenderAsIphone();
		}
		return this._isIphone;
	};

	// 判断组件是否使用 rem 度量单位
	_UICommon._isRenderAsRem = function () {
		if (frontend)
			return VRender.ENV.useRem;
		if (!this.hasOwnProperty("_isRem")) {
			this._isRem = false;
			if (this.context && Utils.isFunction(this.context.isRenderAsRem))
				this._isRem = this.context.isRenderAsRem();
		}
		return this._isRem;
	};

	// ----------------------------------------------------
	// 获取该组件的数据（集），已经过适配器转换
	_UICommon.getData = function () {
		this.options.data = this._doAdapter(this.options.data);
		return this.options.data;
	};

	// 获取数据编号
	_UICommon._getDataKey = function (data) {
		return Fn.getDataKey.call(this, data);
	};

	// 获取数据显示文本
	_BaseRenderer._getDataLabel = function (data) {
		return Fn.getDataLabel.call(this, data);
	};

	///////////////////////////////////////////////////////
	const UIBase = UI._base = function (view, options) {
		// 通过 new UIBase() 调用时，仅用于子类继承，不执行初始化
		if (arguments.length > 0) {
			// 参数 view 不是 Element 或 jQuery 对象时，需要构建组件
			if (!Fn.isElement(view)) {
				options = null;
				view = this._create(view);
			}

			let instance = VRender.Component.get(view);
			if (instance)
				return instance;

			let target = this.$el = $(view);
			target.data(VRender.Component.bindName, this);

			this.options = options || {};
			this.init(target, this.options);
			return this;
		}
	};
	const _UIBase = UIBase.prototype = new UICommon();

	UIBase.init = function (target, options) {
		// .
	};

	// ====================================================
	_UIBase.init = function (target, options) {
		UIBase.init.call(this, target, options);
	};

	///////////////////////////////////////////////////////
	const Renderer = UI._baseRender = function (context, options) {
		this.context = !options ? null : context;
		this.options = (!options ? context : options) || {};
	};
	const _Renderer = Renderer.prototype = new UICommon();

	// ====================================================
	// 通用组件渲染方法，子组件继承后可直接使用
	Renderer.render = function ($, target) {
		this.renderData($, target);
		Fn.renderFunction.call(this, target, "adapter", this.getDataAdapter());
		Fn.renderFunction.call(this, target, "mapper", this.getDataMapper());
	};

	// ====================================================
	// 基本组件渲染
	_Renderer.render = function ($, target) {
		Renderer.render.call(this, $, target);
	};

	// 渲染组件设置的数据，仅映射后的数据被渲染
	_Renderer.renderData = function ($, target) {
		Fn.renderData.call(this, target, this.getData());
	};

	// ----------------------------------------------------
	// 获取数据转换适配器
	_Renderer.getDataAdapter = function () {
		return this.options.dataAdapter || this.options.adapter;
	};

	// 获取数据属性映射方法
	_Renderer.getDataMapper = function () {
		return this.options.dataMapper || this.options.mapper;
	};

	// 获取映射后的属性对象
	_Renderer.getMapData = function (data) {
		return Fn.getMapData.call(this, data);
	};

	// ====================================================
	const doInit = function (target, options) {
	};
})(typeof window !== "undefined");