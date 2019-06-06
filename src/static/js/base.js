// 2019-04-14

(function (frontend) {
	if (frontend && VRender.Component.ui._base)
		return ;

	const UI = frontend ? VRender.Component.ui : require("./init");
	const Fn = UI.fn, Utils = UI.util;

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
	_UICommon._getDataLabel = function (data) {
		return Fn.getDataLabel.call(this, data);
	};

	///////////////////////////////////////////////////////
	const UIBase = UI._base = function (view, options) {
		// 通过 new UIBase() 调用时，仅用于子类继承，不执行初始化
		if (arguments.length > 0 && view !== false) {
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
		}
	};
	const _UIBase = UIBase.prototype = new UICommon();

	// ====================================================
	UIBase.init = function (target, options) {
		doInit.call(this, target, options);

		setTimeout(() => {
			tryAutoLoad.call(this);
		});
	};

	UIBase.getInitParams = function () {
		if (!this.initParams) {
			let params = null;
			if (this.options.hasOwnProperty("params"))
				params = this.options.params;
			else {
				try {
					params = JSON.parse(this.$el.attr("api-params") || null);
					this.$el.removeAttr("api-params");
				}
				catch (e) {}
			}
			this.initParams = Utils.extend({}, params);
		}
		return Utils.extend({}, this.initParams);
	};

	UIBase.isAutoLoad = function () {
		if (!this.options.hasOwnProperty("autoLoad")) {
			this.options.autoLoad = this.$el.attr("api-autoload");
		}
		this.$el.removeAttr("api-autoload");
		return Utils.isTrue(this.options.autoLoad);
	};

	// ====================================================
	_UIBase.init = function (target, options) {
		UIBase.init.call(this, target, options);
	};

	// 获取组件的 viewId
	_UIBase.getViewId = function () {
		return this.$el.attr("vid");
	};

	// 获取初始化参数
	_UIBase.getInitParams = function () {
		return UIBase.getInitParams.call(this);
	};

	// ----------------------------------------------------
	// 设置组件数据（集），一般子类需要负责视图刷新
	_UIBase.setData = function (value) {
		this.options.data = value;
		this.rerender();
	};

	// 获取、设置数据转换适配器
	_UIBase.getDataAdapter = function () {
		return Fn.getFunction.call(this, "dataAdapter", "adapter");
	};
	_UIBase.setDataAdapter = function (value) {
		this.options.dataAdapter = value;
		delete this.options.adapter;
		this.$el.children(".ui-fn[name='adapter']").remove();
		this.rerender();
	};

	// 获取、设置数据绑定映射方法
	_UIBase.getDataMapper = function () {
		return Fn.getFunction.call(this, "dataMapper", "mapper");
	};
	_UIBase.setDataMapper = function (value) {
		this.options.dataMapper = value;
		delete this.options.mapper;
		this.$el.children(".ui-fn[name='mapper']").remove();
		this.rerender();
	};

	// 判断组件是否可用
	_UIBase.isDisabled = function () {
		return this.$el.is(".disabled");
	};
	_UIBase.setDisabled = function (disabled) {
		if (Utils.isNull(disabled) || Utils.isTrue(disabled))
			this.$el.addClass("disabled").attr("disabled", "disabled");
		else
			this.$el.removeClass("disabled").removeAttr("disabled", "disabled");
	};

	// 设置组件是否可见（显示或隐藏）
	_UIBase.setVisible = function (visible) {
		if (Utils.isNull(visible) || Utils.isTrue(visible))
			this.$el.removeClass("ui-hidden");
		else
			this.$el.addClass("ui-hidden");
	};

	// ----------------------------------------------------
	// 销毁组件
	_UIBase.destory = function () {
		this.$el.remove();
	};

	// 重新渲染组件
	_UIBase.rerender = function () {
		// do nothing
	};

	_UIBase.isMounted = function () {
		return $("body").find(this.$el).length > 0;
	};

	_UIBase._snapshoot = function () {
		return Fn.snapshoot.call(this);
	};

	_UIBase._getScrollContainer = function () {
		return this.$el.attr("opt-box");
	};

	// ----------------------------------------------------
	// 异步数据加载方法
	_UIBase.load = function (api, params, callback) {
		if (Utils.isFunction(this._loadBefore))
			this._loadBefore(api, params);
		return Fn.load.call(this, api, params, (err, data) => {
			if (!err) {
				if (Utils.isFunction(this.setData))
					this.setData(data);
				else
					this.options.data = data;
			}
			setTimeout(() => {
				if (Utils.isFunction(this._loadAfter))
					this._loadAfter(err, data);
				if (Utils.isFunction(callback))
					callback(err, data);
				this.trigger("loaded", err, data);
			});
		});
	};

	// 重新加载异步数据
	_UIBase.reload = function (page, callback) {
		if (Utils.isFunction(page)) {
			callback = page;
			page = null;
		}
		let params = this.lastLoadParams || {};
		if (!isNaN(page) && page > 0) {
			params.p_no = page;
		}
		return this.load(this.lastLoadApi, params, callback);
	};

	// 判断是否正在加载
	_UIBase.isLoading = function () {
		return this.$el.is(".is-loading");
	};

	///////////////////////////////////////////////////////
	const Renderer = UI._baseRender = function (context, options) {
		if (arguments.length > 0 && context !== false) {
			this.context = !options ? null : context;
			this.options = (!options ? context : options) || {};
		}
	};
	const _Renderer = Renderer.prototype = new UICommon();

	// ====================================================
	// 通用组件渲染方法，子组件继承后可直接使用
	Renderer.render = function ($, target) {
		target.addClass("vrender-ui");
		this.renderData($, target);
		Fn.renderFunction.call(this, target, "adapter", this.getDataAdapter());
		Fn.renderFunction.call(this, target, "mapper", this.getDataMapper());
	};

	// ====================================================
	// 基本组件渲染
	_Renderer.render = function ($, target) {
		Renderer.render.call(this, $, target);
		return this;
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
	// 初始化
	const doInit = function (target, options) {
		target.attr("id", Utils.trimToNull(options.id) || undefined);
		target.attr("name", Utils.trimToNull(options.name) || undefined);

		let cls = options.className || options.cls;
		if (Utils.isNotBlank(cls))
			target.addClass(cls);

		if (Utils.isNotBlank(options.style))
			target.addClass(options.style);

		if (options.hasOwnProperty("disabled"))
			this.setDisabled(Utils.isTrue(options.disabled));

		if (options.visible === false || options.visible === "gone")
			target.css("display", "none");
		else if (options.visible === "hidden")
			target.css("visibility", "hidden");

		target.attr("ref", Utils.trimToNull(options.ref) || undefined);

		if (!options.data) {
			let items = target.attr("data-items");
			if (items) {
				try {
					options.data = JSON.parse(unescape(items));
				}
				catch (e) {}
			}
		}
		this.$el.removeAttr("data-items");
	};

	// 组件初始化时，视图自动加载异步数据
	const tryAutoLoad = function () {
		if (UIBase.isAutoLoad.call(this) && Utils.isFunction(this.load)) {
			let apiName = this.options.api || this.$el.attr("api-name");

			let params = $.extend({}, this.getInitParams());

			let pager = Utils.isFunction(this.getPaginator) && this.getPaginator();
			if (pager) {
				if (!params.p_no && Utils.isFunction(pager.getPage))
					params.p_no = pager.getPage();
				if (!params.p_size && Utils.isFunction(pager.getSize))
					params.p_size = pager.getSize();
			}

			// let searcher = Utils.isFunction(this.getSearcher) && this.getSearcher();
			// if (searcher && Utils.isFunction(searcher.getParams)) {
			// 	params = $.extend(params, searcher.getParams());
			// }

			this.load(apiName, params, () => {
				setTimeout(() => {
					tryAutoSelect.call(this);
				});
			});
		}
	};

	// 组件初始化时，异步加载完成后，自动选择列表项
	const tryAutoSelect = function () {
		let setByIndex = (value) => {
			if (Utils.isFunction(this.setSelectedIndex)) {
				this.setSelectedIndex(value);
			}
		};
		let setById = (value) => {
			if (Utils.isFunction(this.setSelectedKey)) {
				this.setSelectedKey(value);
			}
		};

		let options = this.options || {};
		if (options.hasOwnProperty("selectedIndex"))
			setByIndex(options.selectedIndex);
		else if (Utils.isNotBlank(this.$el.attr("data-tryindex")))
			setByIndex(this.$el.attr("data-tryindex"));
		else if (options.hasOwnProperty("selectedId"))
			setById(options.selectedId);
		else if (Utils.isNotBlank(this.$el.attr("data-tryid")))
			setById(this.$el.attr("data-tryid"));

		delete options.selectedIndex;
		delete options.selectedId;
		this.$el.removeAttr("data-tryindex");
		this.$el.removeAttr("data-tryid");
	};
})(typeof window !== "undefined");