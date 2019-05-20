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
//# sourceMappingURL=vrender-ui.js.map