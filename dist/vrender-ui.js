/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./build/build.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./build/build.js":
/*!************************!*\
  !*** ./build/build.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 构建
__webpack_require__(/*! ../src/static/css/style.css */ "./src/static/css/style.css");

__webpack_require__(/*! ../src/static/js/init.js */ "./src/static/js/init.js");

__webpack_require__(/*! ../src/static/js/base.js */ "./src/static/js/base.js");

__webpack_require__(/*! ../src/components/group/render.js */ "./src/components/group/render.js");

/***/ }),

/***/ "./src/components/group/render.js":
/*!****************************************!*\
  !*** ./src/components/group/render.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 2019-04-13
(function (frontend) {
  if (frontend && VRender.Component.ui.group) return;
  var UI = frontend ? VRender.Component.ui : __webpack_require__(/*! ../../static/js/init */ "./src/static/js/init.js");
  var Utils = UI.util;
  var VERTICAL = "vertical";
  var HORIZONTIAL = "horizontial"; ///////////////////////////////////////////////////////

  var UIGroup = UI.group = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIGroup = UIGroup.prototype = new UI._base();

  _UIGroup.setOrientation = function (value) {
    this.$el.removeClass(HORIZONTIAL).removeClass(VERTICAL);
    this.$el.removeAttr("opt-orientation");

    if (value === HORIZONTIAL || value === VERTICAL) {
      this.$el.addClass(value).attr("opt-orientation", value);
    }

    layoutChanged.call(this);
  };

  _UIGroup.setGap = function (value) {
    this.$el.attr("opt-gap", Utils.trimToEmpty(value));
    layoutChanged.call(this);
  };

  _UIGroup.setAlign = function (value) {
    this.$el.attr("opt-align", Utils.trimToEmpty(value));
    layoutChanged.call(this);
  };

  _UIGroup.append = function (values) {
    var _this = this;

    if (!arguments || arguments.length == 0) return this;

    for (var i = 0, l = arguments.length; i < l; i++) {
      var item = arguments[i];

      if (Utils.isArray(item)) {
        item.forEach(function (temp) {
          _this.add(temp);
        });
      } else {
        this.add(item);
      }
    }

    return this;
  };

  _UIGroup.add = function (child, index) {
    if (Utils.isNotBlank(child)) {
      index = isNaN(index) || index === "" ? -1 : parseInt(index);
      var children = this.$el.children();

      if (index >= 0 && index < children.length) {
        children.eq(index).before(child.$el || child);
      } else {
        this.$el.append(child.$el || child);
      }

      layoutChanged.call(this);
    }

    return child;
  };

  _UIGroup.removeAt = function (index) {
    var item = this.$el.children().eq(index).remove();
    layoutChanged.call(this);
    return item;
  }; // ====================================================


  var layoutChanged = function layoutChanged() {
    var _this2 = this;

    Utils.debounce("group_layout-" + this.getViewId(), function () {
      updateLayout.call(_this2, $, _this2.$el);
    });
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender();

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-group");
    var options = this.options || {};
    var orientation = options.orientation;

    if (orientation === HORIZONTIAL || orientation === VERTICAL) {
      target.addClass(orientation);
      target.attr("opt-orientation", orientation);
    }

    target.attr("opt-gap", options.gap);
    target.attr("opt-align", options.align);
    renderSubViews.call(this, $, target);
    return this;
  }; ///////////////////////////////////////////////////////


  var renderSubViews = function renderSubViews($, target) {
    showSubViews.call(this, $, target, getChildren.call(this));
  };

  var getChildren = function getChildren() {
    return this.options.children || this.options.subViews || this.options.views;
  };

  var showSubViews = function showSubViews($, target, children) {
    children = Utils.toArray(children);
    Utils.each(children, function (child) {
      if (Utils.isNotNull(child)) {
        if (Utils.isFunction(child.render)) child.render(target);else target.append(child.$el || child);
      }
    });
    updateLayout.call(this, $, target);
  };

  var updateLayout = function updateLayout($, target) {
    var left = "",
        top = "",
        align = "",
        valign = "",
        display = "";
    var gap = Utils.getFormatSize(target.attr("opt-gap"), this._isRenderAsRem()) || "";
    var orientation = target.attr("opt-orientation");

    if (orientation == HORIZONTIAL) {
      // display = "inline-block";
      left = gap;
    } else if (orientation == VERTICAL) {
      // display = "block";
      top = gap;
    } else {
      top = gap;
    }

    var aligns = target.attr("opt-align") || "";
    aligns = aligns.toLowerCase();
    if (/left/.test(aligns)) align = "left";else if (/center/.test(aligns)) align = "center";else if (/right/.test(aligns)) align = "right";
    if (/top/.test(aligns)) valign = "top";else if (/middle/.test(aligns)) valign = "middle";else if (/bottom/.test(aligns)) valign = "bottom";
    target.css("text-align", align);
    var children = target.children(); // children.css("display", display);

    children.css("vertical-align", valign);
    children.css("margin-left", left).css("margin-top", top);
    children.eq(0).css("margin-left", "").css("margin-top", "");
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIGroup = UIGroup;
    UI.init(".ui-group", UIGroup, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");

/***/ }),

/***/ "./src/static/css/style.css":
/*!**********************************!*\
  !*** ./src/static/css/style.css ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./src/static/js sync recursive ^.*$":
/*!*********************************!*\
  !*** ./src/static/js sync ^.*$ ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./base": "./src/static/js/base.js",
	"./base.js": "./src/static/js/base.js",
	"./init": "./src/static/js/init.js",
	"./init.js": "./src/static/js/init.js",
	"./items": "./src/static/js/items.js",
	"./items.js": "./src/static/js/items.js",
	"./selectable": "./src/static/js/selectable.js",
	"./selectable.js": "./src/static/js/selectable.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/static/js sync recursive ^.*$";

/***/ }),

/***/ "./src/static/js/base.js":
/*!*******************************!*\
  !*** ./src/static/js/base.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 2019-04-14
(function (frontend) {
  if (frontend && VRender.Component.ui._base) return;
  var UI = frontend ? VRender.Component.ui : __webpack_require__(/*! ./init */ "./src/static/js/init.js");
  var Fn = UI.fn;
  var Utils = UI.util; ///////////////////////////////////////////////////////

  var UICommon = function UICommon() {};

  if (frontend) UICommon.prototype = new VRender.EventEmitter();else UICommon.prototype = new Object();
  var _UICommon = UICommon.prototype; // 组件原数据（集）适配

  _UICommon._doAdapter = function (data) {
    return !data ? null : Fn.doAdapter.call(this, data);
  }; // ----------------------------------------------------
  // 判断组件是否在应用模式下渲染，一般指移动端渲染


  _UICommon._isRenderAsApp = function () {
    if (frontend) return VRender.ENV.isApp;

    if (!this.hasOwnProperty("_isApp")) {
      this._isApp = false;
      if (this.context && Utils.isFunction(this.context.isRenderAsApp)) this._isApp = this.context.isRenderAsApp();
    }

    return this._isApp;
  }; // 判断组件是否在 iPhone 中渲染


  _UICommon._isRenderAsIphone = function () {
    if (frontend) return VRender.ENV.isIphone;

    if (!this.hasOwnProperty("_isIphone")) {
      this._isIphone = false;
      if (this.context && Utils.isFunction(this.context.isRenderAsIphone)) this._isIphone = this.context.isRenderAsIphone();
    }

    return this._isIphone;
  }; // 判断组件是否使用 rem 度量单位


  _UICommon._isRenderAsRem = function () {
    if (frontend) return VRender.ENV.useRem;

    if (!this.hasOwnProperty("_isRem")) {
      this._isRem = false;
      if (this.context && Utils.isFunction(this.context.isRenderAsRem)) this._isRem = this.context.isRenderAsRem();
    }

    return this._isRem;
  }; // ----------------------------------------------------
  // 获取该组件的数据（集），已经过适配器转换


  _UICommon.getData = function () {
    this.options.data = this._doAdapter(this.options.data);
    return this.options.data;
  }; // 获取数据编号


  _UICommon._getDataKey = function (data) {
    return Fn.getDataKey.call(this, data);
  }; // 获取数据显示文本


  _UICommon._getDataLabel = function (data) {
    return Fn.getDataLabel.call(this, data);
  }; ///////////////////////////////////////////////////////


  var UIBase = UI._base = function (view, options) {
    // 通过 new UIBase() 调用时，仅用于子类继承，不执行初始化
    if (arguments.length > 0) {
      // 参数 view 不是 Element 或 jQuery 对象时，需要构建组件
      if (!Fn.isElement(view)) {
        options = null;
        view = this._create(view);
      }

      var instance = VRender.Component.get(view);
      if (instance) return instance;
      var target = this.$el = $(view);
      target.data(VRender.Component.bindName, this);
      this.options = options || {};
      this.init(target, this.options);
      return this;
    }
  };

  var _UIBase = UIBase.prototype = new UICommon();

  UIBase.init = function (target, options) {
    var _this = this;

    doInit.call(this, target, options);
    setTimeout(function () {
      tryAutoLoad.call(_this);
    });
  };

  UIBase.getInitParams = function () {
    if (!this.initParams) {
      var params = null;
      if (this.options.hasOwnProperty("params")) params = this.options.params;else {
        try {
          params = JSON.parse(this.$el.attr("api-params") || null);
          this.$el.removeAttr("api-params");
        } catch (e) {}
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
  }; // ====================================================


  _UIBase.init = function (target, options) {
    UIBase.init.call(this, target, options);
  }; // 获取组件的 viewId


  _UIBase.getViewId = function () {
    return this.$el.attr("vid");
  }; // 获取初始化参数


  _UIBase.getInitParams = function () {
    return UIBase.getInitParams.call(this);
  }; // ----------------------------------------------------
  // 设置组件数据（集），一般子类需要负责视图刷新


  _UIBase.setData = function (value) {
    this.options.data = value;
    this.rerender();
  }; // 获取、设置数据转换适配器


  _UIBase.getDataAdapter = function () {
    return Fn.getFunction.call(this, "dataAdapter", "adapter");
  };

  _UIBase.setDataAdapter = function (value) {
    this.options.dataAdapter = value;
    delete this.options.adapter;
    this.$el.children(".ui-fn[name='adapter']").remove();
    this.rerender();
  }; // 获取、设置数据绑定映射方法


  _UIBase.getDataMapper = function () {
    return Fn.getFunction.call(this, "dataMapper", "mapper");
  };

  _UIBase.setDataMapper = function (value) {
    this.options.dataMapper = value;
    delete this.options.mapper;
    this.$el.children(".ui-fn[name='mapper']").remove();
    this.rerender();
  }; // 判断组件是否可用


  _UIBase.isDisabled = function () {
    return this.$el.is(".disabled");
  };

  _UIBase.setDisabled = function (disabled) {
    if (Utils.isNull(disabled) || Utils.isTrue(disabled)) this.$el.addClass("disabled").attr("disabled", "disabled");else this.$el.removeClass("disabled").removeAttr("disabled", "disabled");
  }; // 设置组件是否可见（显示或隐藏）


  _UIBase.setVisible = function (visible) {
    if (Utils.isNull(visible) || Utils.isTrue(visible)) this.$el.removeClass("ui-hidden");else this.$el.addClass("ui-hidden");
  }; // ----------------------------------------------------
  // 销毁组件


  _UIBase.destory = function () {
    this.$el.remove();
  }; // 重新渲染组件


  _UIBase.rerender = function () {// do nothing
  };

  _UIBase.isMounted = function () {
    return $("body").find(this.$el).length > 0;
  };

  _UIBase._snapshoot = function () {
    return Fn.snapshoot.call(this);
  };

  _UIBase._getScrollContainer = function () {
    return this.$el.attr("opt-box");
  }; // ----------------------------------------------------
  // 异步数据加载方法


  _UIBase.load = function (api, params, callback) {
    var _this2 = this;

    if (Utils.isFunction(this._loadBefore)) this._loadBefore(api, params);
    return Fn.load.call(this, api, params, function (err, data) {
      if (!err) {
        if (Utils.isFunction(_this2.setData)) _this2.setData(data);else _this2.options.data = data;
      }

      setTimeout(function () {
        if (Utils.isFunction(_this2._loadAfter)) _this2._loadAfter(err, data);
        if (Utils.isFunction(callback)) callback(err, data);

        _this2.trigger("loaded", err, data);
      });
    });
  }; // 重新加载异步数据


  _UIBase.reload = function (page, callback) {
    if (Utils.isFunction(page)) {
      callback = page;
      page = null;
    }

    var params = this.lastLoadParams || {};

    if (!isNaN(page) && page > 0) {
      params.p_no = page;
    }

    return this.load(this.lastLoadApi, params, callback);
  }; // 判断是否正在加载


  _UIBase.isLoading = function () {
    return this.$el.is(".is-loading");
  }; ///////////////////////////////////////////////////////


  var Renderer = UI._baseRender = function (context, options) {
    this.context = !options ? null : context;
    this.options = (!options ? context : options) || {};
  };

  var _Renderer = Renderer.prototype = new UICommon(); // ====================================================
  // 通用组件渲染方法，子组件继承后可直接使用


  Renderer.render = function ($, target) {
    this.renderData($, target);
    Fn.renderFunction.call(this, target, "adapter", this.getDataAdapter());
    Fn.renderFunction.call(this, target, "mapper", this.getDataMapper());
  }; // ====================================================
  // 基本组件渲染


  _Renderer.render = function ($, target) {
    Renderer.render.call(this, $, target);
    return this;
  }; // 渲染组件设置的数据，仅映射后的数据被渲染


  _Renderer.renderData = function ($, target) {
    Fn.renderData.call(this, target, this.getData());
  }; // ----------------------------------------------------
  // 获取数据转换适配器


  _Renderer.getDataAdapter = function () {
    return this.options.dataAdapter || this.options.adapter;
  }; // 获取数据属性映射方法


  _Renderer.getDataMapper = function () {
    return this.options.dataMapper || this.options.mapper;
  }; // 获取映射后的属性对象


  _Renderer.getMapData = function (data) {
    return Fn.getMapData.call(this, data);
  }; // ====================================================
  // 初始化


  var doInit = function doInit(target, options) {
    target.attr("id", Utils.trimToNull(options.id) || undefined);
    target.attr("name", Utils.trimToNull(options.name) || undefined);
    var cls = options.className || options.cls;
    if (Utils.isNotBlank(cls)) target.addClass(cls);
    if (Utils.isNotBlank(options.style)) target.addClass(options.style);
    if (options.hasOwnProperty("disabled")) this.setDisabled(Utils.isTrue(options.disabled));
    if (options.visible === false || options.visible === "gone") target.css("display", "none");else if (options.visible === "hidden") target.css("visibility", "hidden");
    target.attr("ref", Utils.trimToNull(options.ref) || undefined);

    if (!options.data) {
      var items = target.attr("data-items");

      if (items) {
        try {
          options.data = JSON.parse(unescape(items));
        } catch (e) {}
      }
    }

    this.$el.removeAttr("data-items");
  }; // 组件初始化时，视图自动加载异步数据


  var tryAutoLoad = function tryAutoLoad() {
    var _this3 = this;

    if (UIBase.isAutoLoad.call(this) && Utils.isFunction(this.load)) {
      var apiName = this.options.api || this.$el.attr("api-name");
      var params = $.extend({}, this.getInitParams());
      var pager = Utils.isFunction(this.getPaginator) && this.getPaginator();

      if (pager) {
        if (!params.p_no && Utils.isFunction(pager.getPage)) params.p_no = pager.getPage();
        if (!params.p_size && Utils.isFunction(pager.getSize)) params.p_size = pager.getSize();
      } // let searcher = Utils.isFunction(this.getSearcher) && this.getSearcher();
      // if (searcher && Utils.isFunction(searcher.getParams)) {
      // 	params = $.extend(params, searcher.getParams());
      // }


      this.load(apiName, params, function () {
        setTimeout(function () {
          tryAutoSelect.call(_this3);
        });
      });
    }
  }; // 组件初始化时，异步加载完成后，自动选择列表项


  var tryAutoSelect = function tryAutoSelect() {
    var _this4 = this;

    var setByIndex = function setByIndex(value) {
      if (Utils.isFunction(_this4.setSelectedIndex)) {
        _this4.setSelectedIndex(value);
      }
    };

    var setById = function setById(value) {
      if (Utils.isFunction(_this4.setSelectedKey)) {
        _this4.setSelectedKey(value);
      }
    };

    var options = this.options || {};
    if (options.hasOwnProperty("selectedIndex")) setByIndex(options.selectedIndex);else if (Utils.isNotBlank(this.$el.attr("data-tryindex"))) setByIndex(this.$el.attr("data-tryindex"));else if (options.hasOwnProperty("selectedId")) setById(options.selectedId);else if (Utils.isNotBlank(this.$el.attr("data-tryid"))) setById(this.$el.attr("data-tryid"));
    delete options.selectedIndex;
    delete options.selectedId;
    this.$el.removeAttr("data-tryindex");
    this.$el.removeAttr("data-tryid");
  };
})(typeof window !== "undefined");

/***/ }),

/***/ "./src/static/js/init.js":
/*!*******************************!*\
  !*** ./src/static/js/init.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 2019-04-15
(function (frontend) {
  if (frontend && VRender.Component.ui) return;
  var Utils = frontend ? VRender.Utils : __webpack_require__("./src/static/js sync recursive ^.*$")("" + __vrender__).Utils; ///////////////////////////////////////////////////////

  var Fn = {}; // 组件数据适配转换，支持数组对象

  Fn.doAdapter = function (data, index) {
    if (data && data._vr_adapter_flag) return data;
    var adapter = this.options.dataAdapter || this.options.adapter;
    if (Utils.isFunction(this.getDataAdapter)) adapter = this.getDataAdapter();

    if (Utils.isFunction(adapter)) {
      data = adapter(data, index);
      if (data) data._vr_adapter_flag = true;
    }

    return data;
  }; // 获取数据的编号


  Fn.getDataKey = function (data) {
    if (Utils.isBlank(data)) return null;
    if (Utils.isPrimitive(data)) return data;
    var keyField = this.options.keyField;
    if (Utils.isFunction(this.getKeyField)) keyField = this.getKeyField();
    if (Utils.isNotBlank(keyField)) return data[keyField];
    if (data.hasOwnProperty("id")) return data.id;
    if (data.hasOwnProperty("code")) return data.code;
    if (data.hasOwnProperty("value")) return data.value;
    return null;
  }; // 获取数据的显示文本


  Fn.getDataLabel = function (data, index) {
    var labelFunction = this.options.labelFunction;
    if (Utils.isFunction(this.getLabelFunction)) labelFunction = this.getLabelFunction();
    if (Utils.isFunction(labelFunction)) return labelFunction.call(this, data, index);
    if (Utils.isBlank(data)) return "";
    if (Utils.isPrimitive(data)) return "" + data;
    var labelField = this.options.labelField;
    if (Utils.isFunction(this.getLabelField)) labelField = this.getLabelField();
    if (Utils.isNotBlank(labelField)) return Utils.isNull(data[labelField]) ? "" : data[labelField];
    if (data.hasOwnProperty("label")) return Utils.isNull(data.label) ? "" : data.label;
    if (data.hasOwnProperty("name")) return Utils.isNull(data.name) ? "" : data.name;
    if (data.hasOwnProperty("value")) return Utils.isNull(data.value) ? "" : data.value;
    return "" + data;
  }; // 获取数据的属性映射对象，组件数据经过映射后才返回给客户端，可以有效保证数据的私密性
  // 映射对象将被添加到组件标签的属性中，前端可以通过 this.$el.data() 获取


  Fn.getMapData = function (data) {
    var mapper = this.options.dataMapper || this.options.mapper;
    if (Utils.isFunction(this.getDataMapper)) mapper = this.getDataMapper();
    if (Utils.isFunction(mapper)) return mapper(data);
    if (Utils.isNull(data)) return null;
    if (Utils.isPrimitive(data)) return data;
    var attrs = {};
    if (data.hasOwnProperty("id")) attrs["id"] = data.id;
    if (data.hasOwnProperty("code")) attrs["code"] = data.code;
    if (data.hasOwnProperty("name")) attrs["name"] = data.name;
    if (data.hasOwnProperty("value")) attrs["value"] = data.value;
    if (data.hasOwnProperty("label")) attrs["label"] = data.label;
    return attrs;
  };

  Fn.isMultiple = function () {
    if (this.options.hasOwnProperty("multiple")) return Utils.isTrue(this.options.multiple);
    return Utils.isTrue(this.options.multi);
  }; // 在元素标签上渲染数据，以 “data-” 属性方式添加


  Fn.renderData = function (target, data) {
    if (Utils.isFunction(this.getMapData)) data = this.getMapData(data);

    if (data) {
      if (Utils.isPrimitive(data)) {
        target.attr("data-v", data);
      } else {
        for (var n in data) {
          target.attr("data-" + n, Utils.trimToEmpty(data[n]));
        }
      }
    }
  }; // 渲染接口定义的方法，仅服务端有效，服务端定义的接口方法可在前端获取到


  Fn.renderFunction = function (target, name, fn) {
    if (!frontend && Utils.isNotBlank(name) && Utils.isFunction(fn)) {
      target.write("<div class='ui-fn' style='display:none' name='" + name + "' fn-state='" + (fn._state || "") + "' fn-data='" + (fn._data || "") + "'>" + escape(fn) + "</div>");
    }
  }; // 获取接口定义方法，能获取服务端定义的方法
  // 优先获取前端定义或赋值的方法：options.fn > component.fn > serverside.fn


  Fn.getFunction = function (name, type) {
    if (this.options.hasOwnProperty(name)) return this.options[name];
    if (this.hasOwnProperty(name)) return this[name];
    if (type && this.options.hasOwnProperty(type)) return this.options[type];
    var func = null;
    var target = this.$el.children(".ui-fn[name='" + (type || name) + "']");

    if (target && target.length > 0) {
      func = target.text();

      if (Utils.isNotBlank(func)) {
        func = new Function("var Utils=VRender.Utils;return (" + unescape(func) + ");")();
        func._state = target.attr("fn-state") || null;
        func._data = target.attr("fn-data") || null;

        if (func._data) {
          try {
            func._data = JSON.parse(func._data);
          } catch (e) {}
        }
      }

      target.remove();
    }

    this[name] = func;
    return func;
  }; // 渲染子视图


  Fn.renderSubView = function (target, view) {
    if (view) {
      if (Utils.isFunction(view.render)) view.render(target);else target.append(view.$el || view);
    }
  }; // 异步数据加载方法


  Fn.load = function (api, params, callback) {
    var _this = this;

    api = api || this.lastLoadApi || this.$el.attr("api-name");
    if (Utils.isBlank(api)) return false;
    var target = this.$el.addClass("is-loading");
    var timerId = this.loadTimerId = Date.now();
    Component.load.call(this, api, params, function (err, data) {
      if (timerId == _this.loadTimerId) {
        target.removeClass("is-loading");

        var pager = Utils.isFunction(_this.getPaginator) && _this.getPaginator();

        if (pager && Utils.isFunction(pager.set)) {
          var pageInfo = _this._pageInfo || {};
          pager.set(pageInfo.total, pageInfo.page, pageInfo.size);
        }

        if (Utils.isFunction(callback)) callback(err, data);
      }
    });
    return true;
  }; // 解析并返回一个整数数组，忽略无效数据
  // 参数可以是数组（[1,2,3]）或逗号分隔的字符串（"1,2,3"）


  Fn.getIntValues = function (value, min, max) {
    if (!Utils.isArray(value)) value = Utils.isBlank(value) ? [] : ("" + value).split(",");
    min = Utils.isNull(min) ? Number.NEGATIVE_INFINITY : min;
    max = Utils.isNull(max) ? Number.POSITIVE_INFINITY : max;
    var values = [];
    Utils.each(value, function (val) {
      if (!isNaN(val)) {
        val = parseInt(val);

        if (!isNaN(val) && values.indexOf(val) < 0) {
          if (val >= min && val <= max) values.push(val);
        }
      }
    });
    return values;
  }; // 判断2个索引是否一致，包括多选的情况
  // 参数可以是数组（[1,2,3]）或逗号分隔的字符串（"1,2,3"）


  Fn.equalIndex = function (index1, index2) {
    index1 = Fn.getIntValues(index1, 0);
    index2 = Fn.getIntValues(index2, 0);
    if (index1.length != index2.length) return false;
    index1.sort(function (a, b) {
      return a - b;
    });
    index2.sort(function (a, b) {
      return a - b;
    });

    for (var i = 0, l = index1.length; i < l; i++) {
      if (index1[i] != index2[i]) return false;
    }

    return true;
  }; // 快照


  Fn.snapshoot = function () {
    var state = {},
        newState = {},
        self = this;
    var _snapshoot = {};
    if (!this._rootSnapshoot) this._rootSnapshoot = _snapshoot;

    _snapshoot.shoot = function (_state, args) {
      _state = _state || state;

      if (Utils.isFunction(self._snapshoot_shoot)) {
        var params = Array.prototype.slice.call(arguments);
        params[0] = _state;

        self._snapshoot_shoot.apply(self, params);
      } else {
        _state.data = self.getData();
      }
    };

    _snapshoot.compare = function (args) {
      var params = Array.prototype.slice.call(arguments);

      if (Utils.isFunction(self._snapshoot_compare)) {
        return self._snapshoot_compare.apply(self, [state].concat(params));
      } else {
        this.shoot.apply(this, [newState].concat(params));
        return state.data == newState.data;
      }
    };

    _snapshoot.done = function (args) {
      var hasChanged = false;

      if (self._rootSnapshoot == this) {
        var params = Array.prototype.slice.call(arguments);

        if (!this.compare.apply(this, params)) {
          this.shoot.apply(this, [newState].concat(params));
          if (Utils.isFunction(self._snapshoot_change)) self._snapshoot_change(newState.data, state.data);
          self.trigger("change", newState.data, state.data);
          self.$el.trigger("change", newState.data, state.data);
          hasChanged = true;
        }
      }

      this.release();
      return hasChanged;
    };

    _snapshoot.release = function () {
      if (self._rootSnapshoot == this) self._rootSnapshoot = null;
    };

    _snapshoot.getState = function () {
      return state;
    };

    _snapshoot.shoot(state);

    newState.data = state.data;
    return _snapshoot;
  };

  Fn.getDropdownHeight = function (target, maxHeight) {
    var height = 0;

    if (this._isRenderAsApp()) {
      height = $(window).height() * 0.8;
    } else {
      height = parseInt(target.css("maxHeight")) || maxHeight || 300;
    }

    var scrollHeight = target.get(0).scrollHeight;
    if (height > scrollHeight) height = scrollHeight;
    return height;
  };

  Fn.mouseDebounce = function (event, handler) {
    var target = $(event.currentTarget);
    var timerId = parseInt(target.attr("timerid"));

    if (timerId) {
      clearTimeout(timerId);
      target.removeAttr("timerid");
    }

    if (event.type == "mouseleave") {
      timerId = setTimeout(function () {
        target.removeAttr("timerid");
        handler();
      }, 500);
      target.attr("timerid", timerId);
    }
  }; // ====================================================


  if (frontend) {
    var VComponent = VRender.Component; // 注册前端组件

    Fn.init = function (selector, UIComp, Renderer) {
      VComponent.register(selector, UIComp);

      UIComp.create = function (options) {
        return VComponent.create(options, UIComp, Renderer);
      };

      UIComp.find = function (view) {
        return VComponent.find(view, selector, UIComp);
      };

      UIComp.findMe = function (view) {
        var comps = VComponent.find(view, selector, UIComp);
        return comps && comps[0] || null;
      };

      UIComp.instance = function (target) {
        return VComponent.instance(target, selector);
      };

      UIComp.prototype._create = function (options) {
        options = options || {};
        if (Utils.isFunction(this.isWidthEnabled)) options.widthDisabled = !this.isWidthEnabled();
        if (Utils.isFunction(this.isHeightEnabled)) options.heightDisabled = !this.isHeightEnabled();
        return VComponent.create(options, null, Renderer);
      };
    }; // 判断是不是页面元素（包括 jQuery 对象）


    Fn.isElement = function (target) {
      return target instanceof Element || target instanceof $;
    };
  } ///////////////////////////////////////////////////////


  if (frontend) {
    VRender.Component.ui = {
      util: Utils,
      fn: Fn
    };
    VRender.Component.ui.init = Fn.init;
  } else {
    exports.util = Utils;
    exports.fn = Fn;

    __webpack_require__(/*! ./base */ "./src/static/js/base.js");

    __webpack_require__(/*! ./items */ "./src/static/js/items.js");

    __webpack_require__(/*! ./selectable */ "./src/static/js/selectable.js");
  }
})(typeof window !== "undefined");

/***/ }),

/***/ "./src/static/js/items.js":
/*!********************************!*\
  !*** ./src/static/js/items.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 2019-04-18
(function (frontend) {
  if (frontend && VRender.Component.ui._items) return;
  var UI = frontend ? VRender.Component.ui : __webpack_require__(/*! ./init */ "./src/static/js/init.js"); ///////////////////////////////////////////////////////

  var UIItems = UI._items = function (context, options) {};

  var _UIItems = UIItems.prototype = new Object(); ///////////////////////////////////////////////////////


  var Renderer = UI._itemsRender = function (context, options) {};

  var _Renderer = Renderer.prototype = new Object();
})(typeof window !== "undefined");

/***/ }),

/***/ "./src/static/js/selectable.js":
/*!*************************************!*\
  !*** ./src/static/js/selectable.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 2019-04-18
(function (frontend) {
  if (frontend && VRender.Component.ui._select) return;
  var UI = frontend ? VRender.Component.ui : __webpack_require__(/*! ./init */ "./src/static/js/init.js"); ///////////////////////////////////////////////////////

  var UISelect = UI._select = function (content, options) {};

  var _UISelect = UISelect.prototype = new Object(); ///////////////////////////////////////////////////////


  var Renderer = UI._selectRender = function (context, options) {};

  var _Renderer = Renderer.prototype = new Object();
})(typeof window !== "undefined");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnJlbmRlci11aS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9idWlsZC9idWlsZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9ncm91cC9yZW5kZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRpYy9jc3Mvc3R5bGUuY3NzPzk1N2EiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRpYy9qcy9iYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9zdGF0aWMvanMvaW5pdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RhdGljL2pzL2l0ZW1zLmpzIiwid2VicGFjazovLy8uL3NyYy9zdGF0aWMvanMvc2VsZWN0YWJsZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2J1aWxkL2J1aWxkLmpzXCIpO1xuIiwiLy8g5p6E5bu6XG5yZXF1aXJlKFwiLi4vc3JjL3N0YXRpYy9jc3Mvc3R5bGUuY3NzXCIpO1xuXG5yZXF1aXJlKFwiLi4vc3JjL3N0YXRpYy9qcy9pbml0LmpzXCIpO1xuXG5yZXF1aXJlKFwiLi4vc3JjL3N0YXRpYy9qcy9iYXNlLmpzXCIpO1xuXG5yZXF1aXJlKFwiLi4vc3JjL2NvbXBvbmVudHMvZ3JvdXAvcmVuZGVyLmpzXCIpOyIsIi8vIDIwMTktMDQtMTNcbihmdW5jdGlvbiAoZnJvbnRlbmQpIHtcbiAgaWYgKGZyb250ZW5kICYmIFZSZW5kZXIuQ29tcG9uZW50LnVpLmdyb3VwKSByZXR1cm47XG4gIHZhciBVSSA9IGZyb250ZW5kID8gVlJlbmRlci5Db21wb25lbnQudWkgOiByZXF1aXJlKFwiLi4vLi4vc3RhdGljL2pzL2luaXRcIik7XG4gIHZhciBVdGlscyA9IFVJLnV0aWw7XG4gIHZhciBWRVJUSUNBTCA9IFwidmVydGljYWxcIjtcbiAgdmFyIEhPUklaT05USUFMID0gXCJob3Jpem9udGlhbFwiOyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgdmFyIFVJR3JvdXAgPSBVSS5ncm91cCA9IGZ1bmN0aW9uICh2aWV3LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIFVJLl9iYXNlLmNhbGwodGhpcywgdmlldywgb3B0aW9ucyk7XG4gIH07XG5cbiAgdmFyIF9VSUdyb3VwID0gVUlHcm91cC5wcm90b3R5cGUgPSBuZXcgVUkuX2Jhc2UoKTtcblxuICBfVUlHcm91cC5zZXRPcmllbnRhdGlvbiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKEhPUklaT05USUFMKS5yZW1vdmVDbGFzcyhWRVJUSUNBTCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlQXR0cihcIm9wdC1vcmllbnRhdGlvblwiKTtcblxuICAgIGlmICh2YWx1ZSA9PT0gSE9SSVpPTlRJQUwgfHwgdmFsdWUgPT09IFZFUlRJQ0FMKSB7XG4gICAgICB0aGlzLiRlbC5hZGRDbGFzcyh2YWx1ZSkuYXR0cihcIm9wdC1vcmllbnRhdGlvblwiLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgbGF5b3V0Q2hhbmdlZC5jYWxsKHRoaXMpO1xuICB9O1xuXG4gIF9VSUdyb3VwLnNldEdhcCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMuJGVsLmF0dHIoXCJvcHQtZ2FwXCIsIFV0aWxzLnRyaW1Ub0VtcHR5KHZhbHVlKSk7XG4gICAgbGF5b3V0Q2hhbmdlZC5jYWxsKHRoaXMpO1xuICB9O1xuXG4gIF9VSUdyb3VwLnNldEFsaWduID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdGhpcy4kZWwuYXR0cihcIm9wdC1hbGlnblwiLCBVdGlscy50cmltVG9FbXB0eSh2YWx1ZSkpO1xuICAgIGxheW91dENoYW5nZWQuY2FsbCh0aGlzKTtcbiAgfTtcblxuICBfVUlHcm91cC5hcHBlbmQgPSBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICghYXJndW1lbnRzIHx8IGFyZ3VtZW50cy5sZW5ndGggPT0gMCkgcmV0dXJuIHRoaXM7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICBpZiAoVXRpbHMuaXNBcnJheShpdGVtKSkge1xuICAgICAgICBpdGVtLmZvckVhY2goZnVuY3Rpb24gKHRlbXApIHtcbiAgICAgICAgICBfdGhpcy5hZGQodGVtcCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hZGQoaXRlbSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgX1VJR3JvdXAuYWRkID0gZnVuY3Rpb24gKGNoaWxkLCBpbmRleCkge1xuICAgIGlmIChVdGlscy5pc05vdEJsYW5rKGNoaWxkKSkge1xuICAgICAgaW5kZXggPSBpc05hTihpbmRleCkgfHwgaW5kZXggPT09IFwiXCIgPyAtMSA6IHBhcnNlSW50KGluZGV4KTtcbiAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuJGVsLmNoaWxkcmVuKCk7XG5cbiAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDwgY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIGNoaWxkcmVuLmVxKGluZGV4KS5iZWZvcmUoY2hpbGQuJGVsIHx8IGNoaWxkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGVsLmFwcGVuZChjaGlsZC4kZWwgfHwgY2hpbGQpO1xuICAgICAgfVxuXG4gICAgICBsYXlvdXRDaGFuZ2VkLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoaWxkO1xuICB9O1xuXG4gIF9VSUdyb3VwLnJlbW92ZUF0ID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgdmFyIGl0ZW0gPSB0aGlzLiRlbC5jaGlsZHJlbigpLmVxKGluZGV4KS5yZW1vdmUoKTtcbiAgICBsYXlvdXRDaGFuZ2VkLmNhbGwodGhpcyk7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH07IC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG4gIHZhciBsYXlvdXRDaGFuZ2VkID0gZnVuY3Rpb24gbGF5b3V0Q2hhbmdlZCgpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIFV0aWxzLmRlYm91bmNlKFwiZ3JvdXBfbGF5b3V0LVwiICsgdGhpcy5nZXRWaWV3SWQoKSwgZnVuY3Rpb24gKCkge1xuICAgICAgdXBkYXRlTGF5b3V0LmNhbGwoX3RoaXMyLCAkLCBfdGhpczIuJGVsKTtcbiAgICB9KTtcbiAgfTsgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbiAgdmFyIFJlbmRlcmVyID0gZnVuY3Rpb24gUmVuZGVyZXIoY29udGV4dCwgb3B0aW9ucykge1xuICAgIFVJLl9iYXNlUmVuZGVyLmNhbGwodGhpcywgY29udGV4dCwgb3B0aW9ucyk7XG4gIH07XG5cbiAgdmFyIF9SZW5kZXJlciA9IFJlbmRlcmVyLnByb3RvdHlwZSA9IG5ldyBVSS5fYmFzZVJlbmRlcigpO1xuXG4gIF9SZW5kZXJlci5yZW5kZXIgPSBmdW5jdGlvbiAoJCwgdGFyZ2V0KSB7XG4gICAgVUkuX2Jhc2VSZW5kZXIucmVuZGVyLmNhbGwodGhpcywgJCwgdGFyZ2V0KTtcblxuICAgIHRhcmdldC5hZGRDbGFzcyhcInVpLWdyb3VwXCIpO1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zIHx8IHt9O1xuICAgIHZhciBvcmllbnRhdGlvbiA9IG9wdGlvbnMub3JpZW50YXRpb247XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09IEhPUklaT05USUFMIHx8IG9yaWVudGF0aW9uID09PSBWRVJUSUNBTCkge1xuICAgICAgdGFyZ2V0LmFkZENsYXNzKG9yaWVudGF0aW9uKTtcbiAgICAgIHRhcmdldC5hdHRyKFwib3B0LW9yaWVudGF0aW9uXCIsIG9yaWVudGF0aW9uKTtcbiAgICB9XG5cbiAgICB0YXJnZXQuYXR0cihcIm9wdC1nYXBcIiwgb3B0aW9ucy5nYXApO1xuICAgIHRhcmdldC5hdHRyKFwib3B0LWFsaWduXCIsIG9wdGlvbnMuYWxpZ24pO1xuICAgIHJlbmRlclN1YlZpZXdzLmNhbGwodGhpcywgJCwgdGFyZ2V0KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTsgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbiAgdmFyIHJlbmRlclN1YlZpZXdzID0gZnVuY3Rpb24gcmVuZGVyU3ViVmlld3MoJCwgdGFyZ2V0KSB7XG4gICAgc2hvd1N1YlZpZXdzLmNhbGwodGhpcywgJCwgdGFyZ2V0LCBnZXRDaGlsZHJlbi5jYWxsKHRoaXMpKTtcbiAgfTtcblxuICB2YXIgZ2V0Q2hpbGRyZW4gPSBmdW5jdGlvbiBnZXRDaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmNoaWxkcmVuIHx8IHRoaXMub3B0aW9ucy5zdWJWaWV3cyB8fCB0aGlzLm9wdGlvbnMudmlld3M7XG4gIH07XG5cbiAgdmFyIHNob3dTdWJWaWV3cyA9IGZ1bmN0aW9uIHNob3dTdWJWaWV3cygkLCB0YXJnZXQsIGNoaWxkcmVuKSB7XG4gICAgY2hpbGRyZW4gPSBVdGlscy50b0FycmF5KGNoaWxkcmVuKTtcbiAgICBVdGlscy5lYWNoKGNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgIGlmIChVdGlscy5pc05vdE51bGwoY2hpbGQpKSB7XG4gICAgICAgIGlmIChVdGlscy5pc0Z1bmN0aW9uKGNoaWxkLnJlbmRlcikpIGNoaWxkLnJlbmRlcih0YXJnZXQpO2Vsc2UgdGFyZ2V0LmFwcGVuZChjaGlsZC4kZWwgfHwgY2hpbGQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHVwZGF0ZUxheW91dC5jYWxsKHRoaXMsICQsIHRhcmdldCk7XG4gIH07XG5cbiAgdmFyIHVwZGF0ZUxheW91dCA9IGZ1bmN0aW9uIHVwZGF0ZUxheW91dCgkLCB0YXJnZXQpIHtcbiAgICB2YXIgbGVmdCA9IFwiXCIsXG4gICAgICAgIHRvcCA9IFwiXCIsXG4gICAgICAgIGFsaWduID0gXCJcIixcbiAgICAgICAgdmFsaWduID0gXCJcIixcbiAgICAgICAgZGlzcGxheSA9IFwiXCI7XG4gICAgdmFyIGdhcCA9IFV0aWxzLmdldEZvcm1hdFNpemUodGFyZ2V0LmF0dHIoXCJvcHQtZ2FwXCIpLCB0aGlzLl9pc1JlbmRlckFzUmVtKCkpIHx8IFwiXCI7XG4gICAgdmFyIG9yaWVudGF0aW9uID0gdGFyZ2V0LmF0dHIoXCJvcHQtb3JpZW50YXRpb25cIik7XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT0gSE9SSVpPTlRJQUwpIHtcbiAgICAgIC8vIGRpc3BsYXkgPSBcImlubGluZS1ibG9ja1wiO1xuICAgICAgbGVmdCA9IGdhcDtcbiAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IFZFUlRJQ0FMKSB7XG4gICAgICAvLyBkaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgdG9wID0gZ2FwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b3AgPSBnYXA7XG4gICAgfVxuXG4gICAgdmFyIGFsaWducyA9IHRhcmdldC5hdHRyKFwib3B0LWFsaWduXCIpIHx8IFwiXCI7XG4gICAgYWxpZ25zID0gYWxpZ25zLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKC9sZWZ0Ly50ZXN0KGFsaWducykpIGFsaWduID0gXCJsZWZ0XCI7ZWxzZSBpZiAoL2NlbnRlci8udGVzdChhbGlnbnMpKSBhbGlnbiA9IFwiY2VudGVyXCI7ZWxzZSBpZiAoL3JpZ2h0Ly50ZXN0KGFsaWducykpIGFsaWduID0gXCJyaWdodFwiO1xuICAgIGlmICgvdG9wLy50ZXN0KGFsaWducykpIHZhbGlnbiA9IFwidG9wXCI7ZWxzZSBpZiAoL21pZGRsZS8udGVzdChhbGlnbnMpKSB2YWxpZ24gPSBcIm1pZGRsZVwiO2Vsc2UgaWYgKC9ib3R0b20vLnRlc3QoYWxpZ25zKSkgdmFsaWduID0gXCJib3R0b21cIjtcbiAgICB0YXJnZXQuY3NzKFwidGV4dC1hbGlnblwiLCBhbGlnbik7XG4gICAgdmFyIGNoaWxkcmVuID0gdGFyZ2V0LmNoaWxkcmVuKCk7IC8vIGNoaWxkcmVuLmNzcyhcImRpc3BsYXlcIiwgZGlzcGxheSk7XG5cbiAgICBjaGlsZHJlbi5jc3MoXCJ2ZXJ0aWNhbC1hbGlnblwiLCB2YWxpZ24pO1xuICAgIGNoaWxkcmVuLmNzcyhcIm1hcmdpbi1sZWZ0XCIsIGxlZnQpLmNzcyhcIm1hcmdpbi10b3BcIiwgdG9wKTtcbiAgICBjaGlsZHJlbi5lcSgwKS5jc3MoXCJtYXJnaW4tbGVmdFwiLCBcIlwiKS5jc3MoXCJtYXJnaW4tdG9wXCIsIFwiXCIpO1xuICB9OyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuICBpZiAoZnJvbnRlbmQpIHtcbiAgICB3aW5kb3cuVUlHcm91cCA9IFVJR3JvdXA7XG4gICAgVUkuaW5pdChcIi51aS1ncm91cFwiLCBVSUdyb3VwLCBSZW5kZXJlcik7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJlcjtcbiAgfVxufSkodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIik7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwiLy8gMjAxOS0wNC0xNFxuKGZ1bmN0aW9uIChmcm9udGVuZCkge1xuICBpZiAoZnJvbnRlbmQgJiYgVlJlbmRlci5Db21wb25lbnQudWkuX2Jhc2UpIHJldHVybjtcbiAgdmFyIFVJID0gZnJvbnRlbmQgPyBWUmVuZGVyLkNvbXBvbmVudC51aSA6IHJlcXVpcmUoXCIuL2luaXRcIik7XG4gIHZhciBGbiA9IFVJLmZuO1xuICB2YXIgVXRpbHMgPSBVSS51dGlsOyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgdmFyIFVJQ29tbW9uID0gZnVuY3Rpb24gVUlDb21tb24oKSB7fTtcblxuICBpZiAoZnJvbnRlbmQpIFVJQ29tbW9uLnByb3RvdHlwZSA9IG5ldyBWUmVuZGVyLkV2ZW50RW1pdHRlcigpO2Vsc2UgVUlDb21tb24ucHJvdG90eXBlID0gbmV3IE9iamVjdCgpO1xuICB2YXIgX1VJQ29tbW9uID0gVUlDb21tb24ucHJvdG90eXBlOyAvLyDnu4Tku7bljp/mlbDmja7vvIjpm4bvvInpgILphY1cblxuICBfVUlDb21tb24uX2RvQWRhcHRlciA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgcmV0dXJuICFkYXRhID8gbnVsbCA6IEZuLmRvQWRhcHRlci5jYWxsKHRoaXMsIGRhdGEpO1xuICB9OyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIOWIpOaWree7hOS7tuaYr+WQpuWcqOW6lOeUqOaooeW8j+S4i+a4suafk++8jOS4gOiIrOaMh+enu+WKqOerr+a4suafk1xuXG5cbiAgX1VJQ29tbW9uLl9pc1JlbmRlckFzQXBwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChmcm9udGVuZCkgcmV0dXJuIFZSZW5kZXIuRU5WLmlzQXBwO1xuXG4gICAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KFwiX2lzQXBwXCIpKSB7XG4gICAgICB0aGlzLl9pc0FwcCA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMuY29udGV4dCAmJiBVdGlscy5pc0Z1bmN0aW9uKHRoaXMuY29udGV4dC5pc1JlbmRlckFzQXBwKSkgdGhpcy5faXNBcHAgPSB0aGlzLmNvbnRleHQuaXNSZW5kZXJBc0FwcCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9pc0FwcDtcbiAgfTsgLy8g5Yik5pat57uE5Lu25piv5ZCm5ZyoIGlQaG9uZSDkuK3muLLmn5NcblxuXG4gIF9VSUNvbW1vbi5faXNSZW5kZXJBc0lwaG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZnJvbnRlbmQpIHJldHVybiBWUmVuZGVyLkVOVi5pc0lwaG9uZTtcblxuICAgIGlmICghdGhpcy5oYXNPd25Qcm9wZXJ0eShcIl9pc0lwaG9uZVwiKSkge1xuICAgICAgdGhpcy5faXNJcGhvbmUgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLmNvbnRleHQgJiYgVXRpbHMuaXNGdW5jdGlvbih0aGlzLmNvbnRleHQuaXNSZW5kZXJBc0lwaG9uZSkpIHRoaXMuX2lzSXBob25lID0gdGhpcy5jb250ZXh0LmlzUmVuZGVyQXNJcGhvbmUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5faXNJcGhvbmU7XG4gIH07IC8vIOWIpOaWree7hOS7tuaYr+WQpuS9v+eUqCByZW0g5bqm6YeP5Y2V5L2NXG5cblxuICBfVUlDb21tb24uX2lzUmVuZGVyQXNSZW0gPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGZyb250ZW5kKSByZXR1cm4gVlJlbmRlci5FTlYudXNlUmVtO1xuXG4gICAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KFwiX2lzUmVtXCIpKSB7XG4gICAgICB0aGlzLl9pc1JlbSA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMuY29udGV4dCAmJiBVdGlscy5pc0Z1bmN0aW9uKHRoaXMuY29udGV4dC5pc1JlbmRlckFzUmVtKSkgdGhpcy5faXNSZW0gPSB0aGlzLmNvbnRleHQuaXNSZW5kZXJBc1JlbSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9pc1JlbTtcbiAgfTsgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyDojrflj5bor6Xnu4Tku7bnmoTmlbDmja7vvIjpm4bvvInvvIzlt7Lnu4/ov4fpgILphY3lmajovazmjaJcblxuXG4gIF9VSUNvbW1vbi5nZXREYXRhID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMub3B0aW9ucy5kYXRhID0gdGhpcy5fZG9BZGFwdGVyKHRoaXMub3B0aW9ucy5kYXRhKTtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmRhdGE7XG4gIH07IC8vIOiOt+WPluaVsOaNrue8luWPt1xuXG5cbiAgX1VJQ29tbW9uLl9nZXREYXRhS2V5ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gRm4uZ2V0RGF0YUtleS5jYWxsKHRoaXMsIGRhdGEpO1xuICB9OyAvLyDojrflj5bmlbDmja7mmL7npLrmlofmnKxcblxuXG4gIF9VSUNvbW1vbi5fZ2V0RGF0YUxhYmVsID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gRm4uZ2V0RGF0YUxhYmVsLmNhbGwodGhpcywgZGF0YSk7XG4gIH07IC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG4gIHZhciBVSUJhc2UgPSBVSS5fYmFzZSA9IGZ1bmN0aW9uICh2aWV3LCBvcHRpb25zKSB7XG4gICAgLy8g6YCa6L+HIG5ldyBVSUJhc2UoKSDosIPnlKjml7bvvIzku4XnlKjkuo7lrZDnsbvnu6fmib/vvIzkuI3miafooYzliJ3lp4vljJZcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIOWPguaVsCB2aWV3IOS4jeaYryBFbGVtZW50IOaIliBqUXVlcnkg5a+56LGh5pe277yM6ZyA6KaB5p6E5bu657uE5Lu2XG4gICAgICBpZiAoIUZuLmlzRWxlbWVudCh2aWV3KSkge1xuICAgICAgICBvcHRpb25zID0gbnVsbDtcbiAgICAgICAgdmlldyA9IHRoaXMuX2NyZWF0ZSh2aWV3KTtcbiAgICAgIH1cblxuICAgICAgdmFyIGluc3RhbmNlID0gVlJlbmRlci5Db21wb25lbnQuZ2V0KHZpZXcpO1xuICAgICAgaWYgKGluc3RhbmNlKSByZXR1cm4gaW5zdGFuY2U7XG4gICAgICB2YXIgdGFyZ2V0ID0gdGhpcy4kZWwgPSAkKHZpZXcpO1xuICAgICAgdGFyZ2V0LmRhdGEoVlJlbmRlci5Db21wb25lbnQuYmluZE5hbWUsIHRoaXMpO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIHRoaXMuaW5pdCh0YXJnZXQsIHRoaXMub3B0aW9ucyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9VSUJhc2UgPSBVSUJhc2UucHJvdG90eXBlID0gbmV3IFVJQ29tbW9uKCk7XG5cbiAgVUlCYXNlLmluaXQgPSBmdW5jdGlvbiAodGFyZ2V0LCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGRvSW5pdC5jYWxsKHRoaXMsIHRhcmdldCwgb3B0aW9ucyk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB0cnlBdXRvTG9hZC5jYWxsKF90aGlzKTtcbiAgICB9KTtcbiAgfTtcblxuICBVSUJhc2UuZ2V0SW5pdFBhcmFtcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuaW5pdFBhcmFtcykge1xuICAgICAgdmFyIHBhcmFtcyA9IG51bGw7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmhhc093blByb3BlcnR5KFwicGFyYW1zXCIpKSBwYXJhbXMgPSB0aGlzLm9wdGlvbnMucGFyYW1zO2Vsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHBhcmFtcyA9IEpTT04ucGFyc2UodGhpcy4kZWwuYXR0cihcImFwaS1wYXJhbXNcIikgfHwgbnVsbCk7XG4gICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQXR0cihcImFwaS1wYXJhbXNcIik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICB9XG4gICAgICB0aGlzLmluaXRQYXJhbXMgPSBVdGlscy5leHRlbmQoe30sIHBhcmFtcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFV0aWxzLmV4dGVuZCh7fSwgdGhpcy5pbml0UGFyYW1zKTtcbiAgfTtcblxuICBVSUJhc2UuaXNBdXRvTG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShcImF1dG9Mb2FkXCIpKSB7XG4gICAgICB0aGlzLm9wdGlvbnMuYXV0b0xvYWQgPSB0aGlzLiRlbC5hdHRyKFwiYXBpLWF1dG9sb2FkXCIpO1xuICAgIH1cblxuICAgIHRoaXMuJGVsLnJlbW92ZUF0dHIoXCJhcGktYXV0b2xvYWRcIik7XG4gICAgcmV0dXJuIFV0aWxzLmlzVHJ1ZSh0aGlzLm9wdGlvbnMuYXV0b0xvYWQpO1xuICB9OyAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblxuICBfVUlCYXNlLmluaXQgPSBmdW5jdGlvbiAodGFyZ2V0LCBvcHRpb25zKSB7XG4gICAgVUlCYXNlLmluaXQuY2FsbCh0aGlzLCB0YXJnZXQsIG9wdGlvbnMpO1xuICB9OyAvLyDojrflj5bnu4Tku7bnmoQgdmlld0lkXG5cblxuICBfVUlCYXNlLmdldFZpZXdJZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy4kZWwuYXR0cihcInZpZFwiKTtcbiAgfTsgLy8g6I635Y+W5Yid5aeL5YyW5Y+C5pWwXG5cblxuICBfVUlCYXNlLmdldEluaXRQYXJhbXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFVJQmFzZS5nZXRJbml0UGFyYW1zLmNhbGwodGhpcyk7XG4gIH07IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8g6K6+572u57uE5Lu25pWw5o2u77yI6ZuG77yJ77yM5LiA6Iis5a2Q57G76ZyA6KaB6LSf6LSj6KeG5Zu+5Yi35pawXG5cblxuICBfVUlCYXNlLnNldERhdGEgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLm9wdGlvbnMuZGF0YSA9IHZhbHVlO1xuICAgIHRoaXMucmVyZW5kZXIoKTtcbiAgfTsgLy8g6I635Y+W44CB6K6+572u5pWw5o2u6L2s5o2i6YCC6YWN5ZmoXG5cblxuICBfVUlCYXNlLmdldERhdGFBZGFwdGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBGbi5nZXRGdW5jdGlvbi5jYWxsKHRoaXMsIFwiZGF0YUFkYXB0ZXJcIiwgXCJhZGFwdGVyXCIpO1xuICB9O1xuXG4gIF9VSUJhc2Uuc2V0RGF0YUFkYXB0ZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB0aGlzLm9wdGlvbnMuZGF0YUFkYXB0ZXIgPSB2YWx1ZTtcbiAgICBkZWxldGUgdGhpcy5vcHRpb25zLmFkYXB0ZXI7XG4gICAgdGhpcy4kZWwuY2hpbGRyZW4oXCIudWktZm5bbmFtZT0nYWRhcHRlciddXCIpLnJlbW92ZSgpO1xuICAgIHRoaXMucmVyZW5kZXIoKTtcbiAgfTsgLy8g6I635Y+W44CB6K6+572u5pWw5o2u57uR5a6a5pig5bCE5pa55rOVXG5cblxuICBfVUlCYXNlLmdldERhdGFNYXBwZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEZuLmdldEZ1bmN0aW9uLmNhbGwodGhpcywgXCJkYXRhTWFwcGVyXCIsIFwibWFwcGVyXCIpO1xuICB9O1xuXG4gIF9VSUJhc2Uuc2V0RGF0YU1hcHBlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHRoaXMub3B0aW9ucy5kYXRhTWFwcGVyID0gdmFsdWU7XG4gICAgZGVsZXRlIHRoaXMub3B0aW9ucy5tYXBwZXI7XG4gICAgdGhpcy4kZWwuY2hpbGRyZW4oXCIudWktZm5bbmFtZT0nbWFwcGVyJ11cIikucmVtb3ZlKCk7XG4gICAgdGhpcy5yZXJlbmRlcigpO1xuICB9OyAvLyDliKTmlq3nu4Tku7bmmK/lkKblj6/nlKhcblxuXG4gIF9VSUJhc2UuaXNEaXNhYmxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy4kZWwuaXMoXCIuZGlzYWJsZWRcIik7XG4gIH07XG5cbiAgX1VJQmFzZS5zZXREaXNhYmxlZCA9IGZ1bmN0aW9uIChkaXNhYmxlZCkge1xuICAgIGlmIChVdGlscy5pc051bGwoZGlzYWJsZWQpIHx8IFV0aWxzLmlzVHJ1ZShkaXNhYmxlZCkpIHRoaXMuJGVsLmFkZENsYXNzKFwiZGlzYWJsZWRcIikuYXR0cihcImRpc2FibGVkXCIsIFwiZGlzYWJsZWRcIik7ZWxzZSB0aGlzLiRlbC5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiLCBcImRpc2FibGVkXCIpO1xuICB9OyAvLyDorr7nva7nu4Tku7bmmK/lkKblj6/op4HvvIjmmL7npLrmiJbpmpDol4/vvIlcblxuXG4gIF9VSUJhc2Uuc2V0VmlzaWJsZSA9IGZ1bmN0aW9uICh2aXNpYmxlKSB7XG4gICAgaWYgKFV0aWxzLmlzTnVsbCh2aXNpYmxlKSB8fCBVdGlscy5pc1RydWUodmlzaWJsZSkpIHRoaXMuJGVsLnJlbW92ZUNsYXNzKFwidWktaGlkZGVuXCIpO2Vsc2UgdGhpcy4kZWwuYWRkQ2xhc3MoXCJ1aS1oaWRkZW5cIik7XG4gIH07IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8g6ZSA5q+B57uE5Lu2XG5cblxuICBfVUlCYXNlLmRlc3RvcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kZWwucmVtb3ZlKCk7XG4gIH07IC8vIOmHjeaWsOa4suafk+e7hOS7tlxuXG5cbiAgX1VJQmFzZS5yZXJlbmRlciA9IGZ1bmN0aW9uICgpIHsvLyBkbyBub3RoaW5nXG4gIH07XG5cbiAgX1VJQmFzZS5pc01vdW50ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICQoXCJib2R5XCIpLmZpbmQodGhpcy4kZWwpLmxlbmd0aCA+IDA7XG4gIH07XG5cbiAgX1VJQmFzZS5fc25hcHNob290ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBGbi5zbmFwc2hvb3QuY2FsbCh0aGlzKTtcbiAgfTtcblxuICBfVUlCYXNlLl9nZXRTY3JvbGxDb250YWluZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuJGVsLmF0dHIoXCJvcHQtYm94XCIpO1xuICB9OyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIOW8guatpeaVsOaNruWKoOi9veaWueazlVxuXG5cbiAgX1VJQmFzZS5sb2FkID0gZnVuY3Rpb24gKGFwaSwgcGFyYW1zLCBjYWxsYmFjaykge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgaWYgKFV0aWxzLmlzRnVuY3Rpb24odGhpcy5fbG9hZEJlZm9yZSkpIHRoaXMuX2xvYWRCZWZvcmUoYXBpLCBwYXJhbXMpO1xuICAgIHJldHVybiBGbi5sb2FkLmNhbGwodGhpcywgYXBpLCBwYXJhbXMsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgIGlmICghZXJyKSB7XG4gICAgICAgIGlmIChVdGlscy5pc0Z1bmN0aW9uKF90aGlzMi5zZXREYXRhKSkgX3RoaXMyLnNldERhdGEoZGF0YSk7ZWxzZSBfdGhpczIub3B0aW9ucy5kYXRhID0gZGF0YTtcbiAgICAgIH1cblxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChVdGlscy5pc0Z1bmN0aW9uKF90aGlzMi5fbG9hZEFmdGVyKSkgX3RoaXMyLl9sb2FkQWZ0ZXIoZXJyLCBkYXRhKTtcbiAgICAgICAgaWYgKFV0aWxzLmlzRnVuY3Rpb24oY2FsbGJhY2spKSBjYWxsYmFjayhlcnIsIGRhdGEpO1xuXG4gICAgICAgIF90aGlzMi50cmlnZ2VyKFwibG9hZGVkXCIsIGVyciwgZGF0YSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTsgLy8g6YeN5paw5Yqg6L295byC5q2l5pWw5o2uXG5cblxuICBfVUlCYXNlLnJlbG9hZCA9IGZ1bmN0aW9uIChwYWdlLCBjYWxsYmFjaykge1xuICAgIGlmIChVdGlscy5pc0Z1bmN0aW9uKHBhZ2UpKSB7XG4gICAgICBjYWxsYmFjayA9IHBhZ2U7XG4gICAgICBwYWdlID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgcGFyYW1zID0gdGhpcy5sYXN0TG9hZFBhcmFtcyB8fCB7fTtcblxuICAgIGlmICghaXNOYU4ocGFnZSkgJiYgcGFnZSA+IDApIHtcbiAgICAgIHBhcmFtcy5wX25vID0gcGFnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5sb2FkKHRoaXMubGFzdExvYWRBcGksIHBhcmFtcywgY2FsbGJhY2spO1xuICB9OyAvLyDliKTmlq3mmK/lkKbmraPlnKjliqDovb1cblxuXG4gIF9VSUJhc2UuaXNMb2FkaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLiRlbC5pcyhcIi5pcy1sb2FkaW5nXCIpO1xuICB9OyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuICB2YXIgUmVuZGVyZXIgPSBVSS5fYmFzZVJlbmRlciA9IGZ1bmN0aW9uIChjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgdGhpcy5jb250ZXh0ID0gIW9wdGlvbnMgPyBudWxsIDogY29udGV4dDtcbiAgICB0aGlzLm9wdGlvbnMgPSAoIW9wdGlvbnMgPyBjb250ZXh0IDogb3B0aW9ucykgfHwge307XG4gIH07XG5cbiAgdmFyIF9SZW5kZXJlciA9IFJlbmRlcmVyLnByb3RvdHlwZSA9IG5ldyBVSUNvbW1vbigpOyAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIOmAmueUqOe7hOS7tua4suafk+aWueazle+8jOWtkOe7hOS7tue7p+aJv+WQjuWPr+ebtOaOpeS9v+eUqFxuXG5cbiAgUmVuZGVyZXIucmVuZGVyID0gZnVuY3Rpb24gKCQsIHRhcmdldCkge1xuICAgIHRoaXMucmVuZGVyRGF0YSgkLCB0YXJnZXQpO1xuICAgIEZuLnJlbmRlckZ1bmN0aW9uLmNhbGwodGhpcywgdGFyZ2V0LCBcImFkYXB0ZXJcIiwgdGhpcy5nZXREYXRhQWRhcHRlcigpKTtcbiAgICBGbi5yZW5kZXJGdW5jdGlvbi5jYWxsKHRoaXMsIHRhcmdldCwgXCJtYXBwZXJcIiwgdGhpcy5nZXREYXRhTWFwcGVyKCkpO1xuICB9OyAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIOWfuuacrOe7hOS7tua4suafk1xuXG5cbiAgX1JlbmRlcmVyLnJlbmRlciA9IGZ1bmN0aW9uICgkLCB0YXJnZXQpIHtcbiAgICBSZW5kZXJlci5yZW5kZXIuY2FsbCh0aGlzLCAkLCB0YXJnZXQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9OyAvLyDmuLLmn5Pnu4Tku7borr7nva7nmoTmlbDmja7vvIzku4XmmKDlsITlkI7nmoTmlbDmja7ooqvmuLLmn5NcblxuXG4gIF9SZW5kZXJlci5yZW5kZXJEYXRhID0gZnVuY3Rpb24gKCQsIHRhcmdldCkge1xuICAgIEZuLnJlbmRlckRhdGEuY2FsbCh0aGlzLCB0YXJnZXQsIHRoaXMuZ2V0RGF0YSgpKTtcbiAgfTsgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyDojrflj5bmlbDmja7ovazmjaLpgILphY3lmahcblxuXG4gIF9SZW5kZXJlci5nZXREYXRhQWRhcHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmRhdGFBZGFwdGVyIHx8IHRoaXMub3B0aW9ucy5hZGFwdGVyO1xuICB9OyAvLyDojrflj5bmlbDmja7lsZ7mgKfmmKDlsITmlrnms5VcblxuXG4gIF9SZW5kZXJlci5nZXREYXRhTWFwcGVyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZGF0YU1hcHBlciB8fCB0aGlzLm9wdGlvbnMubWFwcGVyO1xuICB9OyAvLyDojrflj5bmmKDlsITlkI7nmoTlsZ7mgKflr7nosaFcblxuXG4gIF9SZW5kZXJlci5nZXRNYXBEYXRhID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gRm4uZ2V0TWFwRGF0YS5jYWxsKHRoaXMsIGRhdGEpO1xuICB9OyAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIOWIneWni+WMllxuXG5cbiAgdmFyIGRvSW5pdCA9IGZ1bmN0aW9uIGRvSW5pdCh0YXJnZXQsIG9wdGlvbnMpIHtcbiAgICB0YXJnZXQuYXR0cihcImlkXCIsIFV0aWxzLnRyaW1Ub051bGwob3B0aW9ucy5pZCkgfHwgdW5kZWZpbmVkKTtcbiAgICB0YXJnZXQuYXR0cihcIm5hbWVcIiwgVXRpbHMudHJpbVRvTnVsbChvcHRpb25zLm5hbWUpIHx8IHVuZGVmaW5lZCk7XG4gICAgdmFyIGNscyA9IG9wdGlvbnMuY2xhc3NOYW1lIHx8IG9wdGlvbnMuY2xzO1xuICAgIGlmIChVdGlscy5pc05vdEJsYW5rKGNscykpIHRhcmdldC5hZGRDbGFzcyhjbHMpO1xuICAgIGlmIChVdGlscy5pc05vdEJsYW5rKG9wdGlvbnMuc3R5bGUpKSB0YXJnZXQuYWRkQ2xhc3Mob3B0aW9ucy5zdHlsZSk7XG4gICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoXCJkaXNhYmxlZFwiKSkgdGhpcy5zZXREaXNhYmxlZChVdGlscy5pc1RydWUob3B0aW9ucy5kaXNhYmxlZCkpO1xuICAgIGlmIChvcHRpb25zLnZpc2libGUgPT09IGZhbHNlIHx8IG9wdGlvbnMudmlzaWJsZSA9PT0gXCJnb25lXCIpIHRhcmdldC5jc3MoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtlbHNlIGlmIChvcHRpb25zLnZpc2libGUgPT09IFwiaGlkZGVuXCIpIHRhcmdldC5jc3MoXCJ2aXNpYmlsaXR5XCIsIFwiaGlkZGVuXCIpO1xuICAgIHRhcmdldC5hdHRyKFwicmVmXCIsIFV0aWxzLnRyaW1Ub051bGwob3B0aW9ucy5yZWYpIHx8IHVuZGVmaW5lZCk7XG5cbiAgICBpZiAoIW9wdGlvbnMuZGF0YSkge1xuICAgICAgdmFyIGl0ZW1zID0gdGFyZ2V0LmF0dHIoXCJkYXRhLWl0ZW1zXCIpO1xuXG4gICAgICBpZiAoaXRlbXMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBvcHRpb25zLmRhdGEgPSBKU09OLnBhcnNlKHVuZXNjYXBlKGl0ZW1zKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy4kZWwucmVtb3ZlQXR0cihcImRhdGEtaXRlbXNcIik7XG4gIH07IC8vIOe7hOS7tuWIneWni+WMluaXtu+8jOinhuWbvuiHquWKqOWKoOi9veW8guatpeaVsOaNrlxuXG5cbiAgdmFyIHRyeUF1dG9Mb2FkID0gZnVuY3Rpb24gdHJ5QXV0b0xvYWQoKSB7XG4gICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICBpZiAoVUlCYXNlLmlzQXV0b0xvYWQuY2FsbCh0aGlzKSAmJiBVdGlscy5pc0Z1bmN0aW9uKHRoaXMubG9hZCkpIHtcbiAgICAgIHZhciBhcGlOYW1lID0gdGhpcy5vcHRpb25zLmFwaSB8fCB0aGlzLiRlbC5hdHRyKFwiYXBpLW5hbWVcIik7XG4gICAgICB2YXIgcGFyYW1zID0gJC5leHRlbmQoe30sIHRoaXMuZ2V0SW5pdFBhcmFtcygpKTtcbiAgICAgIHZhciBwYWdlciA9IFV0aWxzLmlzRnVuY3Rpb24odGhpcy5nZXRQYWdpbmF0b3IpICYmIHRoaXMuZ2V0UGFnaW5hdG9yKCk7XG5cbiAgICAgIGlmIChwYWdlcikge1xuICAgICAgICBpZiAoIXBhcmFtcy5wX25vICYmIFV0aWxzLmlzRnVuY3Rpb24ocGFnZXIuZ2V0UGFnZSkpIHBhcmFtcy5wX25vID0gcGFnZXIuZ2V0UGFnZSgpO1xuICAgICAgICBpZiAoIXBhcmFtcy5wX3NpemUgJiYgVXRpbHMuaXNGdW5jdGlvbihwYWdlci5nZXRTaXplKSkgcGFyYW1zLnBfc2l6ZSA9IHBhZ2VyLmdldFNpemUoKTtcbiAgICAgIH0gLy8gbGV0IHNlYXJjaGVyID0gVXRpbHMuaXNGdW5jdGlvbih0aGlzLmdldFNlYXJjaGVyKSAmJiB0aGlzLmdldFNlYXJjaGVyKCk7XG4gICAgICAvLyBpZiAoc2VhcmNoZXIgJiYgVXRpbHMuaXNGdW5jdGlvbihzZWFyY2hlci5nZXRQYXJhbXMpKSB7XG4gICAgICAvLyBcdHBhcmFtcyA9ICQuZXh0ZW5kKHBhcmFtcywgc2VhcmNoZXIuZ2V0UGFyYW1zKCkpO1xuICAgICAgLy8gfVxuXG5cbiAgICAgIHRoaXMubG9hZChhcGlOYW1lLCBwYXJhbXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdHJ5QXV0b1NlbGVjdC5jYWxsKF90aGlzMyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9OyAvLyDnu4Tku7bliJ3lp4vljJbml7bvvIzlvILmraXliqDovb3lrozmiJDlkI7vvIzoh6rliqjpgInmi6nliJfooajpoblcblxuXG4gIHZhciB0cnlBdXRvU2VsZWN0ID0gZnVuY3Rpb24gdHJ5QXV0b1NlbGVjdCgpIHtcbiAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgIHZhciBzZXRCeUluZGV4ID0gZnVuY3Rpb24gc2V0QnlJbmRleCh2YWx1ZSkge1xuICAgICAgaWYgKFV0aWxzLmlzRnVuY3Rpb24oX3RoaXM0LnNldFNlbGVjdGVkSW5kZXgpKSB7XG4gICAgICAgIF90aGlzNC5zZXRTZWxlY3RlZEluZGV4KHZhbHVlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHNldEJ5SWQgPSBmdW5jdGlvbiBzZXRCeUlkKHZhbHVlKSB7XG4gICAgICBpZiAoVXRpbHMuaXNGdW5jdGlvbihfdGhpczQuc2V0U2VsZWN0ZWRLZXkpKSB7XG4gICAgICAgIF90aGlzNC5zZXRTZWxlY3RlZEtleSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zIHx8IHt9O1xuICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KFwic2VsZWN0ZWRJbmRleFwiKSkgc2V0QnlJbmRleChvcHRpb25zLnNlbGVjdGVkSW5kZXgpO2Vsc2UgaWYgKFV0aWxzLmlzTm90QmxhbmsodGhpcy4kZWwuYXR0cihcImRhdGEtdHJ5aW5kZXhcIikpKSBzZXRCeUluZGV4KHRoaXMuJGVsLmF0dHIoXCJkYXRhLXRyeWluZGV4XCIpKTtlbHNlIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KFwic2VsZWN0ZWRJZFwiKSkgc2V0QnlJZChvcHRpb25zLnNlbGVjdGVkSWQpO2Vsc2UgaWYgKFV0aWxzLmlzTm90QmxhbmsodGhpcy4kZWwuYXR0cihcImRhdGEtdHJ5aWRcIikpKSBzZXRCeUlkKHRoaXMuJGVsLmF0dHIoXCJkYXRhLXRyeWlkXCIpKTtcbiAgICBkZWxldGUgb3B0aW9ucy5zZWxlY3RlZEluZGV4O1xuICAgIGRlbGV0ZSBvcHRpb25zLnNlbGVjdGVkSWQ7XG4gICAgdGhpcy4kZWwucmVtb3ZlQXR0cihcImRhdGEtdHJ5aW5kZXhcIik7XG4gICAgdGhpcy4kZWwucmVtb3ZlQXR0cihcImRhdGEtdHJ5aWRcIik7XG4gIH07XG59KSh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKTsiLCIvLyAyMDE5LTA0LTE1XG4oZnVuY3Rpb24gKGZyb250ZW5kKSB7XG4gIGlmIChmcm9udGVuZCAmJiBWUmVuZGVyLkNvbXBvbmVudC51aSkgcmV0dXJuO1xuICB2YXIgVXRpbHMgPSBmcm9udGVuZCA/IFZSZW5kZXIuVXRpbHMgOiByZXF1aXJlKFwiXCIgKyBfX3ZyZW5kZXJfXykuVXRpbHM7IC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICB2YXIgRm4gPSB7fTsgLy8g57uE5Lu25pWw5o2u6YCC6YWN6L2s5o2i77yM5pSv5oyB5pWw57uE5a+56LGhXG5cbiAgRm4uZG9BZGFwdGVyID0gZnVuY3Rpb24gKGRhdGEsIGluZGV4KSB7XG4gICAgaWYgKGRhdGEgJiYgZGF0YS5fdnJfYWRhcHRlcl9mbGFnKSByZXR1cm4gZGF0YTtcbiAgICB2YXIgYWRhcHRlciA9IHRoaXMub3B0aW9ucy5kYXRhQWRhcHRlciB8fCB0aGlzLm9wdGlvbnMuYWRhcHRlcjtcbiAgICBpZiAoVXRpbHMuaXNGdW5jdGlvbih0aGlzLmdldERhdGFBZGFwdGVyKSkgYWRhcHRlciA9IHRoaXMuZ2V0RGF0YUFkYXB0ZXIoKTtcblxuICAgIGlmIChVdGlscy5pc0Z1bmN0aW9uKGFkYXB0ZXIpKSB7XG4gICAgICBkYXRhID0gYWRhcHRlcihkYXRhLCBpbmRleCk7XG4gICAgICBpZiAoZGF0YSkgZGF0YS5fdnJfYWRhcHRlcl9mbGFnID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfTsgLy8g6I635Y+W5pWw5o2u55qE57yW5Y+3XG5cblxuICBGbi5nZXREYXRhS2V5ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAoVXRpbHMuaXNCbGFuayhkYXRhKSkgcmV0dXJuIG51bGw7XG4gICAgaWYgKFV0aWxzLmlzUHJpbWl0aXZlKGRhdGEpKSByZXR1cm4gZGF0YTtcbiAgICB2YXIga2V5RmllbGQgPSB0aGlzLm9wdGlvbnMua2V5RmllbGQ7XG4gICAgaWYgKFV0aWxzLmlzRnVuY3Rpb24odGhpcy5nZXRLZXlGaWVsZCkpIGtleUZpZWxkID0gdGhpcy5nZXRLZXlGaWVsZCgpO1xuICAgIGlmIChVdGlscy5pc05vdEJsYW5rKGtleUZpZWxkKSkgcmV0dXJuIGRhdGFba2V5RmllbGRdO1xuICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwiaWRcIikpIHJldHVybiBkYXRhLmlkO1xuICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwiY29kZVwiKSkgcmV0dXJuIGRhdGEuY29kZTtcbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcInZhbHVlXCIpKSByZXR1cm4gZGF0YS52YWx1ZTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfTsgLy8g6I635Y+W5pWw5o2u55qE5pi+56S65paH5pysXG5cblxuICBGbi5nZXREYXRhTGFiZWwgPSBmdW5jdGlvbiAoZGF0YSwgaW5kZXgpIHtcbiAgICB2YXIgbGFiZWxGdW5jdGlvbiA9IHRoaXMub3B0aW9ucy5sYWJlbEZ1bmN0aW9uO1xuICAgIGlmIChVdGlscy5pc0Z1bmN0aW9uKHRoaXMuZ2V0TGFiZWxGdW5jdGlvbikpIGxhYmVsRnVuY3Rpb24gPSB0aGlzLmdldExhYmVsRnVuY3Rpb24oKTtcbiAgICBpZiAoVXRpbHMuaXNGdW5jdGlvbihsYWJlbEZ1bmN0aW9uKSkgcmV0dXJuIGxhYmVsRnVuY3Rpb24uY2FsbCh0aGlzLCBkYXRhLCBpbmRleCk7XG4gICAgaWYgKFV0aWxzLmlzQmxhbmsoZGF0YSkpIHJldHVybiBcIlwiO1xuICAgIGlmIChVdGlscy5pc1ByaW1pdGl2ZShkYXRhKSkgcmV0dXJuIFwiXCIgKyBkYXRhO1xuICAgIHZhciBsYWJlbEZpZWxkID0gdGhpcy5vcHRpb25zLmxhYmVsRmllbGQ7XG4gICAgaWYgKFV0aWxzLmlzRnVuY3Rpb24odGhpcy5nZXRMYWJlbEZpZWxkKSkgbGFiZWxGaWVsZCA9IHRoaXMuZ2V0TGFiZWxGaWVsZCgpO1xuICAgIGlmIChVdGlscy5pc05vdEJsYW5rKGxhYmVsRmllbGQpKSByZXR1cm4gVXRpbHMuaXNOdWxsKGRhdGFbbGFiZWxGaWVsZF0pID8gXCJcIiA6IGRhdGFbbGFiZWxGaWVsZF07XG4gICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoXCJsYWJlbFwiKSkgcmV0dXJuIFV0aWxzLmlzTnVsbChkYXRhLmxhYmVsKSA/IFwiXCIgOiBkYXRhLmxhYmVsO1xuICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KFwibmFtZVwiKSkgcmV0dXJuIFV0aWxzLmlzTnVsbChkYXRhLm5hbWUpID8gXCJcIiA6IGRhdGEubmFtZTtcbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcInZhbHVlXCIpKSByZXR1cm4gVXRpbHMuaXNOdWxsKGRhdGEudmFsdWUpID8gXCJcIiA6IGRhdGEudmFsdWU7XG4gICAgcmV0dXJuIFwiXCIgKyBkYXRhO1xuICB9OyAvLyDojrflj5bmlbDmja7nmoTlsZ7mgKfmmKDlsITlr7nosaHvvIznu4Tku7bmlbDmja7nu4/ov4fmmKDlsITlkI7miY3ov5Tlm57nu5nlrqLmiLfnq6/vvIzlj6/ku6XmnInmlYjkv53or4HmlbDmja7nmoTnp4Hlr4bmgKdcbiAgLy8g5pig5bCE5a+56LGh5bCG6KKr5re75Yqg5Yiw57uE5Lu25qCH562+55qE5bGe5oCn5Lit77yM5YmN56uv5Y+v5Lul6YCa6L+HIHRoaXMuJGVsLmRhdGEoKSDojrflj5ZcblxuXG4gIEZuLmdldE1hcERhdGEgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBtYXBwZXIgPSB0aGlzLm9wdGlvbnMuZGF0YU1hcHBlciB8fCB0aGlzLm9wdGlvbnMubWFwcGVyO1xuICAgIGlmIChVdGlscy5pc0Z1bmN0aW9uKHRoaXMuZ2V0RGF0YU1hcHBlcikpIG1hcHBlciA9IHRoaXMuZ2V0RGF0YU1hcHBlcigpO1xuICAgIGlmIChVdGlscy5pc0Z1bmN0aW9uKG1hcHBlcikpIHJldHVybiBtYXBwZXIoZGF0YSk7XG4gICAgaWYgKFV0aWxzLmlzTnVsbChkYXRhKSkgcmV0dXJuIG51bGw7XG4gICAgaWYgKFV0aWxzLmlzUHJpbWl0aXZlKGRhdGEpKSByZXR1cm4gZGF0YTtcbiAgICB2YXIgYXR0cnMgPSB7fTtcbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcImlkXCIpKSBhdHRyc1tcImlkXCJdID0gZGF0YS5pZDtcbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcImNvZGVcIikpIGF0dHJzW1wiY29kZVwiXSA9IGRhdGEuY29kZTtcbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcIm5hbWVcIikpIGF0dHJzW1wibmFtZVwiXSA9IGRhdGEubmFtZTtcbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcInZhbHVlXCIpKSBhdHRyc1tcInZhbHVlXCJdID0gZGF0YS52YWx1ZTtcbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShcImxhYmVsXCIpKSBhdHRyc1tcImxhYmVsXCJdID0gZGF0YS5sYWJlbDtcbiAgICByZXR1cm4gYXR0cnM7XG4gIH07XG5cbiAgRm4uaXNNdWx0aXBsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmhhc093blByb3BlcnR5KFwibXVsdGlwbGVcIikpIHJldHVybiBVdGlscy5pc1RydWUodGhpcy5vcHRpb25zLm11bHRpcGxlKTtcbiAgICByZXR1cm4gVXRpbHMuaXNUcnVlKHRoaXMub3B0aW9ucy5tdWx0aSk7XG4gIH07IC8vIOWcqOWFg+e0oOagh+etvuS4iua4suafk+aVsOaNru+8jOS7pSDigJxkYXRhLeKAnSDlsZ7mgKfmlrnlvI/mt7vliqBcblxuXG4gIEZuLnJlbmRlckRhdGEgPSBmdW5jdGlvbiAodGFyZ2V0LCBkYXRhKSB7XG4gICAgaWYgKFV0aWxzLmlzRnVuY3Rpb24odGhpcy5nZXRNYXBEYXRhKSkgZGF0YSA9IHRoaXMuZ2V0TWFwRGF0YShkYXRhKTtcblxuICAgIGlmIChkYXRhKSB7XG4gICAgICBpZiAoVXRpbHMuaXNQcmltaXRpdmUoZGF0YSkpIHtcbiAgICAgICAgdGFyZ2V0LmF0dHIoXCJkYXRhLXZcIiwgZGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBuIGluIGRhdGEpIHtcbiAgICAgICAgICB0YXJnZXQuYXR0cihcImRhdGEtXCIgKyBuLCBVdGlscy50cmltVG9FbXB0eShkYXRhW25dKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07IC8vIOa4suafk+aOpeWPo+WumuS5ieeahOaWueazle+8jOS7heacjeWKoeerr+acieaViO+8jOacjeWKoeerr+WumuS5ieeahOaOpeWPo+aWueazleWPr+WcqOWJjeerr+iOt+WPluWIsFxuXG5cbiAgRm4ucmVuZGVyRnVuY3Rpb24gPSBmdW5jdGlvbiAodGFyZ2V0LCBuYW1lLCBmbikge1xuICAgIGlmICghZnJvbnRlbmQgJiYgVXRpbHMuaXNOb3RCbGFuayhuYW1lKSAmJiBVdGlscy5pc0Z1bmN0aW9uKGZuKSkge1xuICAgICAgdGFyZ2V0LndyaXRlKFwiPGRpdiBjbGFzcz0ndWktZm4nIHN0eWxlPSdkaXNwbGF5Om5vbmUnIG5hbWU9J1wiICsgbmFtZSArIFwiJyBmbi1zdGF0ZT0nXCIgKyAoZm4uX3N0YXRlIHx8IFwiXCIpICsgXCInIGZuLWRhdGE9J1wiICsgKGZuLl9kYXRhIHx8IFwiXCIpICsgXCInPlwiICsgZXNjYXBlKGZuKSArIFwiPC9kaXY+XCIpO1xuICAgIH1cbiAgfTsgLy8g6I635Y+W5o6l5Y+j5a6a5LmJ5pa55rOV77yM6IO96I635Y+W5pyN5Yqh56uv5a6a5LmJ55qE5pa55rOVXG4gIC8vIOS8mOWFiOiOt+WPluWJjeerr+WumuS5ieaIlui1i+WAvOeahOaWueazle+8mm9wdGlvbnMuZm4gPiBjb21wb25lbnQuZm4gPiBzZXJ2ZXJzaWRlLmZuXG5cblxuICBGbi5nZXRGdW5jdGlvbiA9IGZ1bmN0aW9uIChuYW1lLCB0eXBlKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgcmV0dXJuIHRoaXMub3B0aW9uc1tuYW1lXTtcbiAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgcmV0dXJuIHRoaXNbbmFtZV07XG4gICAgaWYgKHR5cGUgJiYgdGhpcy5vcHRpb25zLmhhc093blByb3BlcnR5KHR5cGUpKSByZXR1cm4gdGhpcy5vcHRpb25zW3R5cGVdO1xuICAgIHZhciBmdW5jID0gbnVsbDtcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy4kZWwuY2hpbGRyZW4oXCIudWktZm5bbmFtZT0nXCIgKyAodHlwZSB8fCBuYW1lKSArIFwiJ11cIik7XG5cbiAgICBpZiAodGFyZ2V0ICYmIHRhcmdldC5sZW5ndGggPiAwKSB7XG4gICAgICBmdW5jID0gdGFyZ2V0LnRleHQoKTtcblxuICAgICAgaWYgKFV0aWxzLmlzTm90QmxhbmsoZnVuYykpIHtcbiAgICAgICAgZnVuYyA9IG5ldyBGdW5jdGlvbihcInZhciBVdGlscz1WUmVuZGVyLlV0aWxzO3JldHVybiAoXCIgKyB1bmVzY2FwZShmdW5jKSArIFwiKTtcIikoKTtcbiAgICAgICAgZnVuYy5fc3RhdGUgPSB0YXJnZXQuYXR0cihcImZuLXN0YXRlXCIpIHx8IG51bGw7XG4gICAgICAgIGZ1bmMuX2RhdGEgPSB0YXJnZXQuYXR0cihcImZuLWRhdGFcIikgfHwgbnVsbDtcblxuICAgICAgICBpZiAoZnVuYy5fZGF0YSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmdW5jLl9kYXRhID0gSlNPTi5wYXJzZShmdW5jLl9kYXRhKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRhcmdldC5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICB0aGlzW25hbWVdID0gZnVuYztcbiAgICByZXR1cm4gZnVuYztcbiAgfTsgLy8g5riy5p+T5a2Q6KeG5Zu+XG5cblxuICBGbi5yZW5kZXJTdWJWaWV3ID0gZnVuY3Rpb24gKHRhcmdldCwgdmlldykge1xuICAgIGlmICh2aWV3KSB7XG4gICAgICBpZiAoVXRpbHMuaXNGdW5jdGlvbih2aWV3LnJlbmRlcikpIHZpZXcucmVuZGVyKHRhcmdldCk7ZWxzZSB0YXJnZXQuYXBwZW5kKHZpZXcuJGVsIHx8IHZpZXcpO1xuICAgIH1cbiAgfTsgLy8g5byC5q2l5pWw5o2u5Yqg6L295pa55rOVXG5cblxuICBGbi5sb2FkID0gZnVuY3Rpb24gKGFwaSwgcGFyYW1zLCBjYWxsYmFjaykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBhcGkgPSBhcGkgfHwgdGhpcy5sYXN0TG9hZEFwaSB8fCB0aGlzLiRlbC5hdHRyKFwiYXBpLW5hbWVcIik7XG4gICAgaWYgKFV0aWxzLmlzQmxhbmsoYXBpKSkgcmV0dXJuIGZhbHNlO1xuICAgIHZhciB0YXJnZXQgPSB0aGlzLiRlbC5hZGRDbGFzcyhcImlzLWxvYWRpbmdcIik7XG4gICAgdmFyIHRpbWVySWQgPSB0aGlzLmxvYWRUaW1lcklkID0gRGF0ZS5ub3coKTtcbiAgICBDb21wb25lbnQubG9hZC5jYWxsKHRoaXMsIGFwaSwgcGFyYW1zLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICBpZiAodGltZXJJZCA9PSBfdGhpcy5sb2FkVGltZXJJZCkge1xuICAgICAgICB0YXJnZXQucmVtb3ZlQ2xhc3MoXCJpcy1sb2FkaW5nXCIpO1xuXG4gICAgICAgIHZhciBwYWdlciA9IFV0aWxzLmlzRnVuY3Rpb24oX3RoaXMuZ2V0UGFnaW5hdG9yKSAmJiBfdGhpcy5nZXRQYWdpbmF0b3IoKTtcblxuICAgICAgICBpZiAocGFnZXIgJiYgVXRpbHMuaXNGdW5jdGlvbihwYWdlci5zZXQpKSB7XG4gICAgICAgICAgdmFyIHBhZ2VJbmZvID0gX3RoaXMuX3BhZ2VJbmZvIHx8IHt9O1xuICAgICAgICAgIHBhZ2VyLnNldChwYWdlSW5mby50b3RhbCwgcGFnZUluZm8ucGFnZSwgcGFnZUluZm8uc2l6ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoVXRpbHMuaXNGdW5jdGlvbihjYWxsYmFjaykpIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07IC8vIOino+aekOW5tui/lOWbnuS4gOS4quaVtOaVsOaVsOe7hO+8jOW/veeVpeaXoOaViOaVsOaNrlxuICAvLyDlj4LmlbDlj6/ku6XmmK/mlbDnu4TvvIhbMSwyLDNd77yJ5oiW6YCX5Y+35YiG6ZqU55qE5a2X56ym5Liy77yIXCIxLDIsM1wi77yJXG5cblxuICBGbi5nZXRJbnRWYWx1ZXMgPSBmdW5jdGlvbiAodmFsdWUsIG1pbiwgbWF4KSB7XG4gICAgaWYgKCFVdGlscy5pc0FycmF5KHZhbHVlKSkgdmFsdWUgPSBVdGlscy5pc0JsYW5rKHZhbHVlKSA/IFtdIDogKFwiXCIgKyB2YWx1ZSkuc3BsaXQoXCIsXCIpO1xuICAgIG1pbiA9IFV0aWxzLmlzTnVsbChtaW4pID8gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZIDogbWluO1xuICAgIG1heCA9IFV0aWxzLmlzTnVsbChtYXgpID8gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZIDogbWF4O1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICBVdGlscy5lYWNoKHZhbHVlLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICBpZiAoIWlzTmFOKHZhbCkpIHtcbiAgICAgICAgdmFsID0gcGFyc2VJbnQodmFsKTtcblxuICAgICAgICBpZiAoIWlzTmFOKHZhbCkgJiYgdmFsdWVzLmluZGV4T2YodmFsKSA8IDApIHtcbiAgICAgICAgICBpZiAodmFsID49IG1pbiAmJiB2YWwgPD0gbWF4KSB2YWx1ZXMucHVzaCh2YWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfTsgLy8g5Yik5patMuS4que0ouW8leaYr+WQpuS4gOiHtO+8jOWMheaLrOWkmumAieeahOaDheWGtVxuICAvLyDlj4LmlbDlj6/ku6XmmK/mlbDnu4TvvIhbMSwyLDNd77yJ5oiW6YCX5Y+35YiG6ZqU55qE5a2X56ym5Liy77yIXCIxLDIsM1wi77yJXG5cblxuICBGbi5lcXVhbEluZGV4ID0gZnVuY3Rpb24gKGluZGV4MSwgaW5kZXgyKSB7XG4gICAgaW5kZXgxID0gRm4uZ2V0SW50VmFsdWVzKGluZGV4MSwgMCk7XG4gICAgaW5kZXgyID0gRm4uZ2V0SW50VmFsdWVzKGluZGV4MiwgMCk7XG4gICAgaWYgKGluZGV4MS5sZW5ndGggIT0gaW5kZXgyLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgIGluZGV4MS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gYSAtIGI7XG4gICAgfSk7XG4gICAgaW5kZXgyLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBhIC0gYjtcbiAgICB9KTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gaW5kZXgxLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGluZGV4MVtpXSAhPSBpbmRleDJbaV0pIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTsgLy8g5b+r54WnXG5cblxuICBGbi5zbmFwc2hvb3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHN0YXRlID0ge30sXG4gICAgICAgIG5ld1N0YXRlID0ge30sXG4gICAgICAgIHNlbGYgPSB0aGlzO1xuICAgIHZhciBfc25hcHNob290ID0ge307XG4gICAgaWYgKCF0aGlzLl9yb290U25hcHNob290KSB0aGlzLl9yb290U25hcHNob290ID0gX3NuYXBzaG9vdDtcblxuICAgIF9zbmFwc2hvb3Quc2hvb3QgPSBmdW5jdGlvbiAoX3N0YXRlLCBhcmdzKSB7XG4gICAgICBfc3RhdGUgPSBfc3RhdGUgfHwgc3RhdGU7XG5cbiAgICAgIGlmIChVdGlscy5pc0Z1bmN0aW9uKHNlbGYuX3NuYXBzaG9vdF9zaG9vdCkpIHtcbiAgICAgICAgdmFyIHBhcmFtcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIHBhcmFtc1swXSA9IF9zdGF0ZTtcblxuICAgICAgICBzZWxmLl9zbmFwc2hvb3Rfc2hvb3QuYXBwbHkoc2VsZiwgcGFyYW1zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9zdGF0ZS5kYXRhID0gc2VsZi5nZXREYXRhKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9zbmFwc2hvb3QuY29tcGFyZSA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICB2YXIgcGFyYW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgaWYgKFV0aWxzLmlzRnVuY3Rpb24oc2VsZi5fc25hcHNob290X2NvbXBhcmUpKSB7XG4gICAgICAgIHJldHVybiBzZWxmLl9zbmFwc2hvb3RfY29tcGFyZS5hcHBseShzZWxmLCBbc3RhdGVdLmNvbmNhdChwYXJhbXMpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2hvb3QuYXBwbHkodGhpcywgW25ld1N0YXRlXS5jb25jYXQocGFyYW1zKSk7XG4gICAgICAgIHJldHVybiBzdGF0ZS5kYXRhID09IG5ld1N0YXRlLmRhdGE7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9zbmFwc2hvb3QuZG9uZSA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgICB2YXIgaGFzQ2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoc2VsZi5fcm9vdFNuYXBzaG9vdCA9PSB0aGlzKSB7XG4gICAgICAgIHZhciBwYXJhbXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICAgIGlmICghdGhpcy5jb21wYXJlLmFwcGx5KHRoaXMsIHBhcmFtcykpIHtcbiAgICAgICAgICB0aGlzLnNob290LmFwcGx5KHRoaXMsIFtuZXdTdGF0ZV0uY29uY2F0KHBhcmFtcykpO1xuICAgICAgICAgIGlmIChVdGlscy5pc0Z1bmN0aW9uKHNlbGYuX3NuYXBzaG9vdF9jaGFuZ2UpKSBzZWxmLl9zbmFwc2hvb3RfY2hhbmdlKG5ld1N0YXRlLmRhdGEsIHN0YXRlLmRhdGEpO1xuICAgICAgICAgIHNlbGYudHJpZ2dlcihcImNoYW5nZVwiLCBuZXdTdGF0ZS5kYXRhLCBzdGF0ZS5kYXRhKTtcbiAgICAgICAgICBzZWxmLiRlbC50cmlnZ2VyKFwiY2hhbmdlXCIsIG5ld1N0YXRlLmRhdGEsIHN0YXRlLmRhdGEpO1xuICAgICAgICAgIGhhc0NoYW5nZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVsZWFzZSgpO1xuICAgICAgcmV0dXJuIGhhc0NoYW5nZWQ7XG4gICAgfTtcblxuICAgIF9zbmFwc2hvb3QucmVsZWFzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChzZWxmLl9yb290U25hcHNob290ID09IHRoaXMpIHNlbGYuX3Jvb3RTbmFwc2hvb3QgPSBudWxsO1xuICAgIH07XG5cbiAgICBfc25hcHNob290LmdldFN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH07XG5cbiAgICBfc25hcHNob290LnNob290KHN0YXRlKTtcblxuICAgIG5ld1N0YXRlLmRhdGEgPSBzdGF0ZS5kYXRhO1xuICAgIHJldHVybiBfc25hcHNob290O1xuICB9O1xuXG4gIEZuLmdldERyb3Bkb3duSGVpZ2h0ID0gZnVuY3Rpb24gKHRhcmdldCwgbWF4SGVpZ2h0KSB7XG4gICAgdmFyIGhlaWdodCA9IDA7XG5cbiAgICBpZiAodGhpcy5faXNSZW5kZXJBc0FwcCgpKSB7XG4gICAgICBoZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KCkgKiAwLjg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlaWdodCA9IHBhcnNlSW50KHRhcmdldC5jc3MoXCJtYXhIZWlnaHRcIikpIHx8IG1heEhlaWdodCB8fCAzMDA7XG4gICAgfVxuXG4gICAgdmFyIHNjcm9sbEhlaWdodCA9IHRhcmdldC5nZXQoMCkuc2Nyb2xsSGVpZ2h0O1xuICAgIGlmIChoZWlnaHQgPiBzY3JvbGxIZWlnaHQpIGhlaWdodCA9IHNjcm9sbEhlaWdodDtcbiAgICByZXR1cm4gaGVpZ2h0O1xuICB9O1xuXG4gIEZuLm1vdXNlRGVib3VuY2UgPSBmdW5jdGlvbiAoZXZlbnQsIGhhbmRsZXIpIHtcbiAgICB2YXIgdGFyZ2V0ID0gJChldmVudC5jdXJyZW50VGFyZ2V0KTtcbiAgICB2YXIgdGltZXJJZCA9IHBhcnNlSW50KHRhcmdldC5hdHRyKFwidGltZXJpZFwiKSk7XG5cbiAgICBpZiAodGltZXJJZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgICAgdGFyZ2V0LnJlbW92ZUF0dHIoXCJ0aW1lcmlkXCIpO1xuICAgIH1cblxuICAgIGlmIChldmVudC50eXBlID09IFwibW91c2VsZWF2ZVwiKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRhcmdldC5yZW1vdmVBdHRyKFwidGltZXJpZFwiKTtcbiAgICAgICAgaGFuZGxlcigpO1xuICAgICAgfSwgNTAwKTtcbiAgICAgIHRhcmdldC5hdHRyKFwidGltZXJpZFwiLCB0aW1lcklkKTtcbiAgICB9XG4gIH07IC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuXG4gIGlmIChmcm9udGVuZCkge1xuICAgIHZhciBWQ29tcG9uZW50ID0gVlJlbmRlci5Db21wb25lbnQ7IC8vIOazqOWGjOWJjeerr+e7hOS7tlxuXG4gICAgRm4uaW5pdCA9IGZ1bmN0aW9uIChzZWxlY3RvciwgVUlDb21wLCBSZW5kZXJlcikge1xuICAgICAgVkNvbXBvbmVudC5yZWdpc3RlcihzZWxlY3RvciwgVUlDb21wKTtcblxuICAgICAgVUlDb21wLmNyZWF0ZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBWQ29tcG9uZW50LmNyZWF0ZShvcHRpb25zLCBVSUNvbXAsIFJlbmRlcmVyKTtcbiAgICAgIH07XG5cbiAgICAgIFVJQ29tcC5maW5kID0gZnVuY3Rpb24gKHZpZXcpIHtcbiAgICAgICAgcmV0dXJuIFZDb21wb25lbnQuZmluZCh2aWV3LCBzZWxlY3RvciwgVUlDb21wKTtcbiAgICAgIH07XG5cbiAgICAgIFVJQ29tcC5maW5kTWUgPSBmdW5jdGlvbiAodmlldykge1xuICAgICAgICB2YXIgY29tcHMgPSBWQ29tcG9uZW50LmZpbmQodmlldywgc2VsZWN0b3IsIFVJQ29tcCk7XG4gICAgICAgIHJldHVybiBjb21wcyAmJiBjb21wc1swXSB8fCBudWxsO1xuICAgICAgfTtcblxuICAgICAgVUlDb21wLmluc3RhbmNlID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICByZXR1cm4gVkNvbXBvbmVudC5pbnN0YW5jZSh0YXJnZXQsIHNlbGVjdG9yKTtcbiAgICAgIH07XG5cbiAgICAgIFVJQ29tcC5wcm90b3R5cGUuX2NyZWF0ZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICBpZiAoVXRpbHMuaXNGdW5jdGlvbih0aGlzLmlzV2lkdGhFbmFibGVkKSkgb3B0aW9ucy53aWR0aERpc2FibGVkID0gIXRoaXMuaXNXaWR0aEVuYWJsZWQoKTtcbiAgICAgICAgaWYgKFV0aWxzLmlzRnVuY3Rpb24odGhpcy5pc0hlaWdodEVuYWJsZWQpKSBvcHRpb25zLmhlaWdodERpc2FibGVkID0gIXRoaXMuaXNIZWlnaHRFbmFibGVkKCk7XG4gICAgICAgIHJldHVybiBWQ29tcG9uZW50LmNyZWF0ZShvcHRpb25zLCBudWxsLCBSZW5kZXJlcik7XG4gICAgICB9O1xuICAgIH07IC8vIOWIpOaWreaYr+S4jeaYr+mhtemdouWFg+e0oO+8iOWMheaLrCBqUXVlcnkg5a+56LGh77yJXG5cblxuICAgIEZuLmlzRWxlbWVudCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgIHJldHVybiB0YXJnZXQgaW5zdGFuY2VvZiBFbGVtZW50IHx8IHRhcmdldCBpbnN0YW5jZW9mICQ7XG4gICAgfTtcbiAgfSAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuICBpZiAoZnJvbnRlbmQpIHtcbiAgICBWUmVuZGVyLkNvbXBvbmVudC51aSA9IHtcbiAgICAgIHV0aWw6IFV0aWxzLFxuICAgICAgZm46IEZuXG4gICAgfTtcbiAgICBWUmVuZGVyLkNvbXBvbmVudC51aS5pbml0ID0gRm4uaW5pdDtcbiAgfSBlbHNlIHtcbiAgICBleHBvcnRzLnV0aWwgPSBVdGlscztcbiAgICBleHBvcnRzLmZuID0gRm47XG5cbiAgICByZXF1aXJlKFwiLi9iYXNlXCIpO1xuXG4gICAgcmVxdWlyZShcIi4vaXRlbXNcIik7XG5cbiAgICByZXF1aXJlKFwiLi9zZWxlY3RhYmxlXCIpO1xuICB9XG59KSh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKTsiLCIvLyAyMDE5LTA0LTE4XG4oZnVuY3Rpb24gKGZyb250ZW5kKSB7XG4gIGlmIChmcm9udGVuZCAmJiBWUmVuZGVyLkNvbXBvbmVudC51aS5faXRlbXMpIHJldHVybjtcbiAgdmFyIFVJID0gZnJvbnRlbmQgPyBWUmVuZGVyLkNvbXBvbmVudC51aSA6IHJlcXVpcmUoXCIuL2luaXRcIik7IC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICB2YXIgVUlJdGVtcyA9IFVJLl9pdGVtcyA9IGZ1bmN0aW9uIChjb250ZXh0LCBvcHRpb25zKSB7fTtcblxuICB2YXIgX1VJSXRlbXMgPSBVSUl0ZW1zLnByb3RvdHlwZSA9IG5ldyBPYmplY3QoKTsgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbiAgdmFyIFJlbmRlcmVyID0gVUkuX2l0ZW1zUmVuZGVyID0gZnVuY3Rpb24gKGNvbnRleHQsIG9wdGlvbnMpIHt9O1xuXG4gIHZhciBfUmVuZGVyZXIgPSBSZW5kZXJlci5wcm90b3R5cGUgPSBuZXcgT2JqZWN0KCk7XG59KSh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKTsiLCIvLyAyMDE5LTA0LTE4XG4oZnVuY3Rpb24gKGZyb250ZW5kKSB7XG4gIGlmIChmcm9udGVuZCAmJiBWUmVuZGVyLkNvbXBvbmVudC51aS5fc2VsZWN0KSByZXR1cm47XG4gIHZhciBVSSA9IGZyb250ZW5kID8gVlJlbmRlci5Db21wb25lbnQudWkgOiByZXF1aXJlKFwiLi9pbml0XCIpOyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgdmFyIFVJU2VsZWN0ID0gVUkuX3NlbGVjdCA9IGZ1bmN0aW9uIChjb250ZW50LCBvcHRpb25zKSB7fTtcblxuICB2YXIgX1VJU2VsZWN0ID0gVUlTZWxlY3QucHJvdG90eXBlID0gbmV3IE9iamVjdCgpOyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuICB2YXIgUmVuZGVyZXIgPSBVSS5fc2VsZWN0UmVuZGVyID0gZnVuY3Rpb24gKGNvbnRleHQsIG9wdGlvbnMpIHt9O1xuXG4gIHZhciBfUmVuZGVyZXIgPSBSZW5kZXJlci5wcm90b3R5cGUgPSBuZXcgT2JqZWN0KCk7XG59KSh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKTsiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3pLQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDOVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUMzVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0EiLCJzb3VyY2VSb290IjoiIn0=