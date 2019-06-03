"use strict";

// 2019-04-15
(function (frontend) {
  if (frontend && VRender.Component.ui) return;
  var Utils = frontend ? VRender.Utils : require("" + __vrender__).Utils; ///////////////////////////////////////////////////////

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
    }; // 异步数据加载方法


    Fn.load = function (api, params, callback) {
      var _this = this;

      api = api || this.lastLoadApi || this.$el.attr("api-name");
      if (Utils.isBlank(api)) return false;
      var target = this.$el.addClass("is-loading");
      var timerId = this.loadTimerId = Date.now();
      VComponent.load.call(this, api, params, function (err, data) {
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

    require("./base");

    require("./items");

    require("./selectable");
  }
})(typeof window !== "undefined");
"use strict";

// 2019-04-14
(function (frontend) {
  if (frontend && VRender.Component.ui._base) return;
  var UI = frontend ? VRender.Component.ui : require("./init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

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
    if (arguments.length > 0 && view !== false) {
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
    }
  };

  var _UIBase = UIBase.prototype = new UICommon(); // ====================================================


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
      console.log("###########", err, data);

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
    if (arguments.length > 0 && context !== false) {
      this.context = !options ? null : context;
      this.options = (!options ? context : options) || {};
    }
  };

  var _Renderer = Renderer.prototype = new UICommon(); // ====================================================
  // 通用组件渲染方法，子组件继承后可直接使用


  Renderer.render = function ($, target) {
    target.addClass("vrender-ui");
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
"use strict";

// 2019-04-18
(function (frontend) {
  if (frontend && VRender.Component.ui._items) return;
  var UI = frontend ? VRender.Component.ui : require("./init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UIItems = UI._items = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIItems = UIItems.prototype = new UI._base(false); // ====================================================


  UIItems.init = function (view, options) {
    UI._base.init.call(this, view, options);

    this._initPager();

    this._checkIfEmpty();
  };

  UIItems.doAdapter = function (datas) {
    Renderer.doAdapter.call(this, datas);
  };

  UIItems.renderItems = function (itemContainer, datas) {
    Renderer.renderItems.call(this, $, itemContainer, datas);

    this._checkIfEmpty();
  }; // 渲染单个列表项


  UIItems.renderOneItem = function (item, container, data, index) {
    return Renderer.renderOneItem.call(this, $, item, container, data, index);
  }; // ----------------------------------------------------
  // 添加列表项


  UIItems.addItem = function (data, index, datas) {
    index = Utils.getIndexValue(index);
    data = Fn.doAdapter.call(this, data, index);
    datas = datas || this.getData();
    var newItem = null;

    var itemContainer = this._getItemContainer();

    if (itemContainer && itemContainer.length > 0) {
      newItem = this._getNewItem($, itemContainer, data, index);

      if (newItem) {
        if (index >= 0 && index < datas.length) {
          var items = this._getItems();

          if (items && items.length > 0) items.eq(index).before(newItem);
        }

        this._renderOneItem($, newItem, data, index);
      }

      this._checkIfEmpty();
    }

    if (index >= 0 && index < datas.length) datas.splice(index, 0, data);else datas.push(data);
    return newItem;
  }; // 更新列表项，index无效时将被忽略


  UIItems.updateItem = function (data, index, datas) {
    data = Fn.doAdapter.call(this, data, index);
    if (!index && index !== 0) index = this.getDataIndex(data);else index = Utils.getIndexValue(index);

    if (index >= 0) {
      datas = datas || this.getData();

      if (index < datas.length) {
        var itemContainer = this._getItemContainer();

        if (itemContainer && itemContainer.length > 0) {
          var items = this._getItems();

          var newItem = this._getNewItem($, itemContainer, data, index);

          if (newItem) {
            items.eq(index).before(newItem).remove();

            this._renderOneItem($, newItem, data, index);
          } else {
            items.eq(index).remove();
          }
        }

        this._checkIfEmpty();

        datas.splice(index, 1, data);
      } else {
        index = -1;
      }
    }

    return index;
  }; // 删除列表项


  UIItems.removeItem = function (item, index, datas) {
    if (item && item.length > 0) index = item.index();else {
      index = Utils.getIndexValue(index);
      if (index < 0) return null;

      var items = this._getItems();

      if (items && items.length > index) item = items.eq(index);
    }

    if (item && item.length > 0) {
      item.remove();

      this._checkIfEmpty();
    }

    datas = datas || this.getData();

    if (datas && index < datas.length) {
      return datas.splice(index, 1);
    }

    return null;
  }; // ----------------------------------------------------


  UIItems.initPager = function () {
    if (this.options.hasOwnProperty("pager")) this.setPaginator(this.options.pager);else {
      var pager = this.$el.attr("opt-pager");

      if (pager) {
        pager = $(pager);

        if (pager && pager.length > 0) {
          pager = VRender.Component.get(pager) || VRender.FrontComponent.get(pager) || pager;
          this.setPaginator(pager);
        }
      }

      this.$el.removeAttr("opt-pager");
    }
  };

  UIItems.setPager = function (pager) {
    var _this = this;

    if (this.pager) {
      if (Utils.isFunction(this.pager.off)) this.pager.off("change");
    }

    this.pager = pager;

    if (pager && Utils.isFunction(pager.on)) {
      pager.on("change", function (e, data) {
        var params = $.extend({}, _this.lastLoadParams);
        params.p_no = data && data.page;
        params.p_size = data && data.size;
        if (!params.p_no && Utils.isFunction(pager.getPage)) params.p_no = pager.getPage();
        if (!params.p_size && Utils.isFunction(pager.getSize)) params.p_size = pager.getSize(); // if (Utils.isFunction(this.setData))
        // 	this.setData(null);

        var pageInfo = _this._pageInfo || {};
        if (params.p_no != pageInfo.page || params.p_size != pageInfo.size) _this.load(_this.lastLoadApi, params);
      });
    }
  }; // ----------------------------------------------------
  // 判断是否为空


  UIItems.checkIfEmpty = function () {
    var items = this._getItems();

    if (items && items.length > 0) this.$el.removeClass("is-empty");else this.$el.addClass("is-empty");
  }; // 判断组件或组件列表项是否可用
  // 参数为字符串时判断名称对应列表项，为数字时判断索引对应的列表项，否则返回组件是否可用


  UIItems.isDisabled = function (value) {
    if (typeof value === "number") {
      var item = this._getItemAt(value);

      return !item || item.is(".disabled");
    }

    if (typeof value === "string") {
      return this.isDisabled(this.getIndexByName(value));
    }

    return this.$el.is(".disabled");
  }; // 设置组件或列表项是否可用


  UIItems.setDisabled = function (disabled, value) {
    if (typeof value === "string") {
      return this.setDisabled(disabled, this.getIndexByName(value));
    }

    var target = this.$el;

    if (typeof value === "number") {
      target = this._getItemAt(value);
    }

    if (target) {
      disabled = Utils.isNull(disabled) || Utils.isTrue(disabled) ? true : false;
      if (disabled) target.addClass("disabled").attr("disabled", "disabled");else target.removeClass("disabled").removeAttr("disabled");

      if (Utils.isFunction(this.getDisableField)) {
        var disableField = this.getDisableField();

        if (disableField) {
          var data = this._getItemData(target);

          if (data) data[disableField] = disabled;
        }
      }
    }
  }; // ====================================================


  _UIItems.init = function (view, options) {
    return UIItems.init.call(this, view, options);
  };

  _UIItems.setData = function (value) {
    this.options.data = this._doAdapter(value);
    this.rerender();
  }; // 获取某索引对应的数据


  _UIItems.getDataAt = function (index) {
    index = Utils.getIndexValue(index);
    if (index < 0) return null;
    var datas = this.getData() || [];
    return index < datas.length ? datas[index] : null;
  }; // 获取数据在列表中的索引


  _UIItems.getDataIndex = function (data) {
    var _this2 = this;

    var datas = this.getData();

    if (datas && datas.length > 0) {
      var _key = this._getDataKey(data);

      return Utils.index(datas, function (temp) {
        return temp == data || _this2._getDataKey(temp) == _key;
      });
    }

    return -1;
  };

  _UIItems.getDataByKey = function (key) {
    return this.getDataAt(this.getIndexByKey(key));
  };

  _UIItems.getIndexByKey = function (key) {
    var _this3 = this;

    var datas = this.getData();

    if (datas && datas.length > 0) {
      return Utils.index(datas, function (temp) {
        return _this3._getDataKey(temp) == key;
      });
    }

    return -1;
  };

  _UIItems.getDataByName = function (name) {
    return this.getDataAt(this.getIndexByName(name));
  }; // 根据 name 属性获取索引


  _UIItems.getIndexByName = function (name) {
    var datas = this.getData();

    if (datas && datas.length > 0) {
      return Utils.indexBy(datas, "name", name);
    }

    return -1;
  }; // ----------------------------------------------------
  // 获取组件数据代表唯一编号的字段名称


  _UIItems.getKeyField = function () {
    return this.options.keyField || this.$el.attr("opt-key");
  }; // 设置组件数据代表唯一编号的字段名称


  _UIItems.setKeyField = function (value) {
    value = Utils.trimToEmpty(value);

    if (this.getKeyField() != value) {
      this.options.keyField = value;
      this.$el.attr("opt-key", this.options.keyField);
      this.rerender();
    }
  }; // 获取用来显示组件数据的字段名称


  _UIItems.getLabelField = function () {
    return this.options.labelField || this.$el.attr("opt-lbl");
  }; // 设置用来显示组件数据的字段名称


  _UIItems.setLabelField = function (value) {
    value = Utils.trimToEmpty(value);

    if (this.getLabelField() != value) {
      this.options.labelField = value;
      this.$el.attr("opt-lbl", this.options.labelField);
      this.rerender();
    }
  }; // 获取用来显示组件数据的方法，如：function (data) { return data.name; }


  _UIItems.getLabelFunction = function () {
    return Fn.getFunction.call(this, "labelFunction", "lblfunc");
  }; // 设置用来显示组件数据的方法，如：function (data) { return data.name; };


  _UIItems.setLabelFunction = function (value) {
    if (this.getLabelFunction() != value) {
      this.options.labelFunction = value;
      this.$el.children(".ui-fn[name='lblfunc']").remove();
      this.rerender();
    }
  }; // 获取项渲染器


  _UIItems.getItemRenderer = function () {
    if (this.options.hasOwnProperty("renderer")) return this.options.renderer;
    return Fn.getFunction.call(this, "itemRenderer", "irender");
  }; // 设置项渲染器


  _UIItems.setItemRenderer = function (value) {
    if (this.getItemRenderer() != value) {
      this.options.itemRenderer = value;
      delete this.options.renderer;
      this.$el.children(".ui-fn[name='irender']").remove();
      this.rerender();
    }
  };

  _UIItems.getPaginator = function () {
    return this.pager;
  };

  _UIItems.setPaginator = function (value) {
    UIItems.setPager.call(this, value);
  };

  _UIItems.length = function () {
    return Utils.toArray(this.getData()).length;
  };

  _UIItems.isDisabled = function (index) {
    return UIItems.isDisabled.call(this, index);
  };

  _UIItems.setDisabled = function (disabled, index) {
    UIItems.setDisabled.call(this, disabled, index);
  }; // ----------------------------------------------------
  // 添加列表项
  // index添加项到指定索引位置


  _UIItems.addItem = function (data, index) {
    return UIItems.addItem.call(this, data, index);
  }; // 更新列表项，index无效时将被忽略


  _UIItems.updateItem = function (data, index) {
    return UIItems.updateItem.call(this, data, index);
  }; // 删除列表项


  _UIItems.removeItem = function (data) {
    return this.removeItemAt(this.getDataIndex(data));
  }; // 删除列表项


  _UIItems.removeItemAt = function (index) {
    return UIItems.removeItem.call(this, null, index);
  }; // 添加或更新列表项


  _UIItems.addOrUpdateItem = function (data) {
    var index = this.getDataIndex(data);
    if (index >= 0) this.updateItem(data, index);else this.addItem(data, index);
  }; // ----------------------------------------------------
  // 获取列表项数据，target可以是列表里任意标签


  _UIItems.getItemData = function (target) {
    var item = $(target);

    if (item && item.length > 0) {
      var itemContainer = this._getItemContainer();

      if (itemContainer && itemContainer.length > 0) {
        target = item.parent();

        while (true) {
          if (!target || target.length == 0) {
            item = null;
            break;
          }

          if (target.is(itemContainer)) {
            break;
          }

          item = target;
          target = item.parent();
        }

        if (item && item.length > 0) return this._getItemData(item);
      }
    }

    return null;
  }; // 加载更多（下一页）


  _UIItems.more = function (callback) {
    var _this4 = this;

    if (this.lastLoadApi && this.hasMore() && !this.isLoading()) {
      var params = Utils.extend({}, this.lastLoadParams);
      params.p_no = parseInt(this._pageInfo && this._pageInfo.page) || 0;
      params.p_no += 1;
      if (Utils.isFunction(this._moreBefore)) this._moreBefore(this.lastLoadApi, params);else if (Utils.isFunction(this._loadBefore)) this._loadBefore(this.lastLoadApi, params);
      Fn.load.call(this, this.lastLoadApi, params, function (err, data) {
        if (!err && Utils.isArray(data)) {
          if (Utils.isFunction(_this4.addItem)) {
            Utils.each(data, function (temp) {
              _this4.addItem(temp);
            });
          } else {
            var datas = _this4.options.data || [];
            _this4.options.data = datas.concat(data);
          }
        }

        setTimeout(function () {
          if (Utils.isFunction(_this4._moreAfter)) _this4._moreAfter(err, data);else if (Utils.isFunction(_this4._loadAfter)) _this4._loadAfter(err, data);
          if (Utils.isFunction(callback)) callback(err, data);

          _this4.trigger("loaded", err, data);
        });
      });
      return true;
    }

    return false;
  }; // 加载某一页


  _UIItems.loadPage = function (page, callback) {
    if (this.lastLoadApi && !this.isLoading()) {
      var params = Utils.extend({}, this.lastLoadParams);
      params.p_no = parseInt(page) || 1;
      this.load(null, params, callback);
    }
  };

  _UIItems.hasMore = function () {
    if (this._pageInfo) {
      var page = parseInt(this._pageInfo.page) || 1;
      var size = parseInt(this._pageInfo.size) || 20;
      var total = parseInt(this._pageInfo.total) || 0;
      return page * size < total;
    }

    return false;
  };

  _UIItems.isEmpty = function () {
    if (this.$el.is(".is-empty")) return true;
    var datas = this.getData();
    return !datas || datas.length == 0;
  };

  _UIItems.rerender = function () {
    var _this5 = this;

    Utils.debounce("ui_render-" + this.getViewId(), function () {
      var itemContainer = _this5._getItemContainer();

      if (itemContainer && itemContainer.length > 0) {
        _this5._renderItems($, itemContainer.empty(), _this5.getData());
      }
    });
  }; // ----------------------------------------------------


  _UIItems._doAdapter = function (datas) {
    return UIItems.doAdapter.call(this, datas);
  }; // 获取选项容器


  _UIItems._getItemContainer = function () {
    return this.$el;
  }; // 新建一个列表项


  _UIItems._getNewItem = function ($, itemContainer, data, index) {
    return $("<li></li>").appendTo(itemContainer);
  }; // 渲染列表项


  _UIItems._renderItems = function ($, itemContainer, datas) {
    UIItems.renderItems.call(this, itemContainer, datas);
  }; // 渲染单个列表项


  _UIItems._renderOneItem = function ($, item, data, index) {
    return UIItems.renderOneItem.call(this, item, null, data, index);
  };

  _UIItems._isDisabled = function (data, index) {
    if (data) {
      var options = this.options;
      if (!options.hasOwnProperty("disableField")) options.disableField = this.$el.attr("opt-disabled");
      var disableField = options.disableField;

      if (disableField && data.hasOwnProperty(disableField)) {
        return Utils.isTrue(data[disableField]);
      }
    }

    return false;
  }; // 获取所有列表项，确保返回jQuery对象


  _UIItems._getItems = function (selector) {
    var itemContainer = this._getItemContainer();

    if (itemContainer && itemContainer.length > 0) return itemContainer.children(selector);
  }; // 获取某索引的列表项


  _UIItems._getItemAt = function (index) {
    index = Utils.getIndexValue(index);

    if (index >= 0) {
      return Utils.find(this._getItems(), function (item, i) {
        var _index = parseInt(item.attr("opt-ind"));

        if (isNaN(_index)) _index = i;
        return index == _index;
      });
    }

    return null;
  }; // 获取选项绑定的数据


  _UIItems._getItemData = function (item, index) {
    var data = item.data("itemData");

    if (!data) {
      var datas = this.getData();

      if (Utils.isArray(datas)) {
        if (isNaN(index) || !(index || index === 0)) {
          index = parseInt(item.attr("opt-ind"));
          if (isNaN(index)) index = item.index();
        }

        data = datas[index];
      }
    }

    return Utils.isEmpty(data) ? null : data;
  }; // ----------------------------------------------------


  _UIItems._initPager = function () {
    UIItems.initPager.call(this);
  };

  _UIItems._checkIfEmpty = function () {
    UIItems.checkIfEmpty.call(this);
  };

  _UIItems._getLoadText = function () {
    return this.options.loadingText; // return Utils.isNull(loadText) ? "正在加载.." : Utils.trimToEmpty(loadText);
  };

  _UIItems._getLoadView = function () {
    return this.options.loadingView;
  };

  _UIItems._getMoreText = function () {
    return this.options.moreText; // return Utils.isNull(moreText) ? "加载更多" : Utils.trimToEmpty(moreText);
  };

  _UIItems._getMoreView = function () {
    return this.options.moreView;
  };

  _UIItems._getEmptyText = function () {
    return this.options.emptyText || this.options.empty; // return Utils.isNull(emptyText) ? "没有数据" : Utils.trimToEmpty(emptyText);
  };

  _UIItems._getEmptyView = function () {
    return this.options.emptyView;
  }; ///////////////////////////////////////////////////////


  var Renderer = UI._itemsRender = function (context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false); // ====================================================


  Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.attr("opt-key", Utils.trimToNull(this.getKeyField()));
    target.attr("opt-lbl", Utils.trimToNull(this.getLabelField()));
    target.attr("opt-disable", Utils.trimToNull(this.options.disableField));
    Fn.renderFunction(target, "lblfunc", this.getLabelFunction());
    Fn.renderFunction(target, "irender", this.getItemRenderer());

    this._renderItems($, target);

    this._renderEmptyView($, target);

    this._renderLoadView($, target);

    this._renderPager($, target);
  };

  Renderer.renderData = function ($, target, datas) {
    datas = Utils.toArray(datas) || [];

    if (datas.length > 0) {
      var dataMapper = this.getDataMapper();

      if (Utils.isFunction(dataMapper)) {
        datas = Utils.map(datas, dataMapper);
      }
    }

    target.attr("data-items", escape(JSON.stringify(datas)));
  };

  Renderer.renderItems = function ($, itemContainer, datas) {
    var _this6 = this;

    datas = datas || this.getData();

    if (datas && datas.length > 0) {
      var items = this._render_items = [];
      Utils.each(datas, function (data, i) {
        var item = _this6._getNewItem($, itemContainer, data, i);

        if (item) {
          items.push({
            item: item,
            data: data,
            index: i
          });

          _this6._renderOneItem($, item, data, i);
        }
      });
      setTimeout(function () {
        _this6._render_items = null; // 释放变量
      });
    }
  }; // 渲染单个列表项


  Renderer.renderOneItem = function ($, item, container, data, index) {
    if (!frontend) {
      this.renderItemData($, item, data);
    } else {
      item.data("itemData", data);
    }

    if (this._isDisabled(data, index)) {
      item.addClass("disabled").attr("disabled", "disabled");
    }

    container = container || item;
    var itemRenderer = this.getItemRenderer();

    if (Utils.isFunction(itemRenderer)) {
      var result = null;
      if (itemRenderer._state) result = itemRenderer.call(this, $, item, data, index);else result = itemRenderer.call(this, $, item, data, index);
      if (Utils.isNotNull(result)) container.empty().append(result);
    } else {
      var label = this._getDataLabel(data, index);

      container.html(Utils.isNull(label) ? "" : label);
    }
  }; // 渲染分页设置


  Renderer.renderPager = function ($, target, pager) {
    if (!frontend) {
      if (!pager && Utils.isFunction(this.getPaginator)) pager = this.getPaginator();

      if (pager) {
        if (typeof pager == "string") {
          target.attr("opt-pager", Utils.trimToNull(pager));
        } else if (Utils.isFunction(pager.getViewId)) {
          target.attr("opt-pager", "[vid='" + pager.getViewId() + "']");
        }
      }
    }
  }; // 渲染空视图


  Renderer.renderEmptyView = function ($, target, className) {
    var container = $("<div></div>").appendTo(target);
    container.addClass((className || "ui") + "-empty");
    var emptyView = Utils.isFunction(this._getEmptyView) ? this._getEmptyView() : this.options.emptyView;

    if (emptyView) {
      Fn.renderSubView.call(this, container, emptyView);
    } else {
      emptyView = $("<div></div>").appendTo(container);
      emptyView.addClass((className || "ui") + "-emptydef");
      var emptyText = this.options.emptyText || this.options.empty;
      if (Utils.isFunction(this._getEmptyText)) emptyText = this._getEmptyText();
      emptyText = Utils.isNull(emptyText) ? "没有数据" : Utils.trimToEmpty(emptyText);

      if (emptyText) {
        $("<p></p>").appendTo(emptyView).text(emptyText);
      }
    }

    return container;
  }; // 渲染加载视图


  Renderer.renderLoadView = function ($, target, className) {
    var container = $("<div></div>").appendTo(target);
    container.addClass((className || "ui") + "-load");
    var loadingView = Utils.isFunction(this._getLoadView) ? this._getLoadView() : this.options.loadingView;

    if (loadingView) {
      Fn.renderSubView.call(this, container, loadingView);
    } else {
      var loadView = $("<div></div>").appendTo(container);
      loadView.addClass((className || "ui") + "-loaddef");
      var loadText = Utils.isFunction(this._getLoadText) ? this._getLoadText() : this.options.loadingText;
      loadText = Utils.isNull(loadText) ? "正在加载.." : Utils.trimToEmpty(loadText);

      if (loadText) {
        $("<p></p>").appendTo(loadView).html(loadText);
      }
    }

    return container;
  }; // 渲染更多视图


  Renderer.renderMoreView = function ($, target, className) {
    var container = $("<div></div>").appendTo(target);
    container.addClass((className || "ui") + "-more");

    if (this._pageInfo) {
      container.attr("page-no", this._pageInfo.page);
    }

    var moreView = Utils.isFunction(this._getMoreView) ? this._getMoreView() : this.options.moreView;

    if (moreView) {
      Fn.renderSubView.call(this, container, moreView);
    } else {
      var _moreView = $("<div></div>").appendTo(container);

      _moreView.addClass((className || "ui") + "-moredef");

      var moreText = Utils.isFunction(this._getMoreText) ? this._getMoreText() : this.options.moreText;
      moreText = Utils.isNull(moreText) ? "加载更多" : Utils.trimToEmpty(moreText);

      if (moreText) {
        $("<p></p>").appendTo(_moreView).html(moreText);
      }
    }

    return container;
  };

  Renderer.doAdapter = function (datas) {
    var _this7 = this;

    datas = Utils.toArray(datas);
    if (datas._vr_adapter_flag) return datas;
    datas = Utils.map(datas, function (temp, i) {
      return Fn.doAdapter.call(_this7, temp, i);
    });
    datas._vr_adapter_flag = true; // this.options.data = datas;

    return datas;
  }; // ====================================================


  _Renderer.render = function ($, target) {
    Renderer.render.call(this, $, target);
  };

  _Renderer.renderData = function ($, target) {
    if (!frontend) {
      Renderer.renderData.call(this, $, target, this.getData());
    }
  }; // 渲染列表项数据


  _Renderer.renderItemData = function ($, item, data) {
    Fn.renderData.call(this, $, item, data);
  }; // 渲染列表项


  _Renderer._renderItems = function ($, target) {
    var itemContainer = this._getItemContainer($, target);

    if (itemContainer) {
      Renderer.renderItems.call(this, $, itemContainer);
    }
  }; // 新建一个列表项并返回
  // 参数 data 和 index 只用来判断创建标签类型，不建议生成列表项内容


  _Renderer._getNewItem = function ($, itemContainer, data, index) {
    return $("<li></li>").appendTo(itemContainer);
  }; // 渲染单个列表项


  _Renderer._renderOneItem = function ($, item, data, index) {
    Renderer.renderOneItem.call(this, $, item, null, data, index);
  }; // 渲染分页设置


  _Renderer._renderPager = function ($, target) {
    Renderer.renderPager.call(this, $, target);
  }; // 渲染空视图


  _Renderer._renderEmptyView = function ($, target) {
    Renderer.renderEmptyView.call(this, $, target);
  }; // 渲染加载视图


  _Renderer._renderLoadView = function ($, target) {
    Renderer.renderLoadView.call(this, $, target);
  }; // 渲染更多视图


  _Renderer._renderMoreView = function ($, target) {
    Renderer.renderMoreView.call(this, $, target);
  }; // ----------------------------------------------------


  _Renderer.getPaginator = function () {
    return this.options.paginator || this.options.pager;
  }; // 获取用来代表数据编号的字段名称


  _Renderer.getKeyField = function () {
    return this.options.keyField;
  }; // 获取用来显示数据文本的字段名称


  _Renderer.getLabelField = function () {
    return this.options.labelField;
  }; // 获取用来显示数据文本的方法，较复杂的内容可以使用该方法


  _Renderer.getLabelFunction = function () {
    return this.options.labelFunction;
  }; // 获取项渲染器


  _Renderer.getItemRenderer = function () {
    return this.options.itemRenderer;
  }; // 获取列表项容器，默认是 target


  _Renderer._getItemContainer = function ($, target) {
    return target;
  }; // 判断是否禁用项


  _Renderer._isDisabled = function (data, index) {
    if (data) {
      var disableField = this.options.disableField || "disabled";

      if (disableField && data.hasOwnProperty(disableField)) {
        return Utils.isTrue(data[disableField]);
      }
    }

    return false;
  };

  _Renderer._getDataLabel = function (data, index) {
    return Fn.getDataLabel.call(this, data, index);
  };

  _Renderer._doAdapter = function (datas) {
    return Renderer.doAdapter.call(this, datas);
  };
})(typeof window !== "undefined");
"use strict";

// 2019-04-18
(function (frontend) {
  if (frontend && VRender.Component.ui._select) return;
  var UI = frontend ? VRender.Component.ui : require("./init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UISelect = UI._select = function (view, options) {
    return UI._items.call(this, view, options);
  };

  var _UISelect = UISelect.prototype = new UI._items(false); // ====================================================


  UISelect.init = function (view, options) {
    return UI._items.init.call(this, view, options);
  }; // 获取当前选中项的索引


  UISelect.getSelectedIndex = function (needArray) {
    var _this = this;

    var indexs = this.$el.attr("data-inds");

    if (Utils.isNull(indexs)) {
      indexs = [];
      var ids = this.$el.attr("data-ids");

      if (Utils.isNull(ids)) {
        Utils.each(this.getData(), function (data, i) {
          // 给定空数组防止循环调用（_isSelected()方法中有调用getSelectedIndex()方法）
          if (_this._isSelected(data, i, [], [])) indexs.push(i);
        });
      } else if (ids.length > 0) {
        ids = ids.split(",");
        Utils.each(this.getData(), function (data, i) {
          var _id = _this._getDataKey(data);

          var _index = Utils.index(ids, function (tmp) {
            return tmp == _id;
          });

          if (_index >= 0) indexs.push(i);
        });
      }
    } else {
      indexs = Fn.getIntValues(indexs, 0);
    }

    if (this.isMultiple()) return indexs.length > 0 ? indexs : null;
    if (needArray) return indexs.length > 0 ? [indexs[0]] : null;
    return indexs.length > 0 ? indexs[0] : -1;
  }; // 设置列表选中项的索引（只更新索引，不修改视图）


  UISelect.setSelectedIndex = function (value) {
    var max = Utils.isFunction(this.length) ? this.length() - 1 : null;
    var indexs = Fn.getIntValues(value, 0, max);
    if (indexs.length > 1 && !this.isMultiple()) indexs = [indexs[0]];
    this.$el.attr("data-inds", indexs.join(","));
    this.$el.removeAttr("data-ids");
    return indexs;
  }; // 获取当前选中项对应的数据编号


  UISelect.getSelectedKey = function (needArray) {
    var _this2 = this;

    var ids = this.$el.attr("data-ids");
    var indexs = this.$el.attr("data-inds");

    if (Utils.isNotNull(indexs)) {
      ids = [];
      indexs = Fn.getIntValues(indexs, 0);

      if (indexs.length > 0) {
        var datas = this.getData() || [];
        Utils.each(indexs, function (index) {
          var data = index < datas.length ? datas[index] : null;
          if (data) ids.push(_this2._getDataKey(data));
        });
      }
    } else if (Utils.isNull(ids)) {
      ids = [];
      Utils.each(this.getData(), function (data, i) {
        // 给定空数组防止循环调用（_isSelected()方法中有调用getSelectedIndex()方法）
        if (_this2._isSelected(data, i, [], [])) ids.push(_this2._getDataKey(data));
      });
    } else if (!Utils.isArray(ids)) {
      ids = ids.split(",");
    }

    if (!ids || ids.length == 0) return null;
    var _ids = [];
    Utils.each(ids, function (tmp) {
      if (tmp || tmp === 0) _ids.push(isNaN(tmp) ? tmp : parseInt(tmp));
    });
    if (_ids.length == 0) return null;
    if (this.isMultiple()) return _ids;
    return needArray ? [_ids[0]] : _ids[0];
  }; // 根据数据编号设置当前选中项


  UISelect.setSelectedKey = function (value) {
    var _this3 = this;

    if (!Utils.isArray(value)) value = Utils.isBlank(value) ? [] : Utils.trimToEmpty(value).split(",");
    var indexs = [];
    Utils.each(this.getData(), function (data, i) {
      var _id = _this3._getDataKey(data);

      var _index = Utils.index(value, function (tmp) {
        return tmp == _id;
      });

      if (_index >= 0) indexs.push(i);
    });
    this.setSelectedIndex(indexs);
  }; // 获取当前选中项对应的数据


  UISelect.getSelectedData = function (needArray, datas) {
    var _this4 = this;

    var indexs = this.getSelectedIndex(true),
        ids = [];
    if (!indexs) ids = this.getSelectedKey(true) || [];
    var selectedDatas = [];
    datas = datas || this.getData();
    Utils.each(datas, function (data, i) {
      if (_this4._isSelected(data, i, indexs, ids)) selectedDatas.push(data);
    });
    if (selectedDatas.length == 0) return null;
    if (this.isMultiple()) return selectedDatas;
    return needArray ? [selectedDatas[0]] : selectedDatas[0];
  };

  UISelect.updateSelection = function () {
    var _this5 = this;

    var indexs = [];
    Utils.each(this._getItems(), function (item, i) {
      if (_this5._isItemSelected(item)) indexs.push(i);
    });
    UISelect.setSelectedIndex.call(this, indexs);
    return indexs;
  };

  UISelect.addItem = function (data, index) {
    return UI._itemsRender.addItem.call(this, data, index);
  };

  UISelect.updateItem = function (data, index) {
    return UI._itemsRender.updateItem.call(this, data, index);
  };

  UISelect.removeItem = function (data, index) {
    return UI._itemsRender.removeItem.call(this, data, index);
  }; // ====================================================


  _UISelect.init = function (view, options) {
    return UISelect.init.call(this, view, options);
  }; // 判断列表是否支持多选


  _UISelect.isMultiple = function () {
    return this.$el.attr("multiple") == "multiple";
  };

  _UISelect.setMultiple = function (value) {
    value = Utils.isNull(value) || Utils.isTrue(value) ? true : false;

    if (this.isMultiple() != value) {
      if (value) this.$el.attr("multiple", "multiple");else this.$el.removeAttr("multiple");
      this.rerender();
    }
  }; // 获取当前选中项的索引


  _UISelect.getSelectedIndex = function (needArray) {
    return UISelect.getSelectedIndex.call(this, needArray);
  }; // 设置列表选中项的索引（只更新索引，不修改视图）


  _UISelect.setSelectedIndex = function (value) {
    var _this6 = this;

    var snapshoot = this._snapshoot();

    var indexs = ComponentSelect.setSelectedIndex.call(this, value);
    Utils.each(this._getItems(), function (item, i) {
      _this6._setItemSelected(item, indexs.indexOf(i) >= 0);
    });
    snapshoot.done();
    return indexs;
  }; // 获取当前选中项对应的数据编号


  _UISelect.getSelectedKey = function (needArray) {
    return UISelect.getSelectedKey.call(this, needArray);
  }; // 根据数据编号设置当前选中项


  _UISelect.setSelectedKey = function (value) {
    return UISelect.setSelectedKey.call(this, value);
  }; // 获取当前选中项对应的数据


  _UISelect.getSelectedData = function (needArray) {
    return UISelect.getSelectedData.call(this, needArray);
  }; // 判断某个索引是否被选中


  _UISelect.isSelectedIndex = function (index) {
    index = Utils.getIndexValue(index);
    return index < 0 ? false : this._isSelected(this.getDataAt(index), index);
  }; // 判断编号对应的项是否被选中


  _UISelect.isSelectedKey = function (value) {
    if (Utils.isBlank(value)) return false;
    var ids = this.getSelectedKey(true);
    return Utils.index(ids, function (tmp) {
      return tmp == value;
    }) >= 0;
  }; // 判断是否选中所有项


  _UISelect.isAllSelected = function () {
    var length = this.length();

    if (length > 0) {
      var indexs = this.getSelectedIndex(true);
      return indexs && indexs.length == length;
    }

    return false;
  };

  _UISelect.addItem = function (data, index) {
    var newItem = UISelect.addItem.call(this, data, index);
    if (newItem) UISelect.updateSelection.call(this);
    return newItem;
  };

  _UISelect.updateItem = function (data, index) {
    index = UISelect.updateItem.call(this, data, index);
    if (index >= 0) UISelect.updateSelection.call(this);
    return index;
  };

  _UISelect.removeItem = function (data) {
    data = UISelect.removeItem.call(this, data);
    if (data) UISelect.updateSelection.call(this);
    return data;
  };

  _UISelect.removeItemAt = function (index) {
    var data = UISelect.removeItem.call(this, null, index);
    if (data) UISelect.updateSelection.call(this);
    return data;
  }; // 判断是否选中


  _UISelect._isSelected = function (data, index, selectedIndex, selectedId) {
    return Renderer.isSelected.call(this, data, index, selectedIndex, selectedId);
  };

  _UISelect._isItemSelected = function (item) {
    return item.is(".selected");
  };

  _UISelect._setItemSelected = function (item, beSelected) {
    if (beSelected) item.addClass("selected");else item.removeClass("selected");
  };

  _UISelect._snapshoot_shoot = function (state, selectedIndex, selectedData) {
    state.selectedIndex = selectedIndex || this.getSelectedIndex();
    state.selectedData = selectedData || this.getSelectedData();
    state.data = state.selectedData;
  };

  _UISelect._snapshoot_compare = function (state, selectedIndex) {
    if (!selectedIndex) selectedIndex = this.getSelectedIndex(true);
    return Fn.equalIndex(state.selectedIndex, selectedIndex);
  }; ///////////////////////////////////////////////////////


  var Renderer = UI._selectRender = function (context, options) {
    UI._itemsRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._itemsRender(false); // ====================================================


  Renderer.render = function ($, target) {
    UI._itemsRender.render.call(this, $, target);

    if (this.isMultiple()) target.attr("multiple", "multiple");
    this.renderSelection($, target);
  };

  Renderer.renderSelection = function ($, target, items) {
    var _this7 = this;

    var indexs = this.getSelectedIndex(true);
    var ids = this.getSelectedKey(true);
    if (indexs) target.attr("data-inds", indexs.join(","));
    if (ids) target.attr("data-ids", ids.join(","));

    if (!frontend && this.options.apiName) {
      if (indexs) target.attr("data-tryindex", indexs.join(","));
      if (ids) target.attr("data-tryid", ids.join(","));
    }

    if (items && items.length > 0) {
      ids = ids || [];
      Utils.each(items, function (item, i) {
        if (_this7._isSelected(item.data, item.index, indexs, ids)) {
          if (Utils.isFunction(_this7._setItemSelected)) _this7._setItemSelected(item.item, true);else item.item.addClass("selected");
        }
      });
    }
  }; // ----------------------------------------------------
  // 获取选中的项索引


  Renderer.getSelectedIndex = function (needArray) {
    var selectedIndex = this.options.selectedIndex;

    if (Utils.isBlank(selectedIndex)) {
      return needArray || this.isMultiple() ? null : -1;
    }

    if (!Utils.isArray(selectedIndex)) selectedIndex = ("" + selectedIndex).split(",");
    var indexs = [];
    Utils.each(selectedIndex, function (tmp) {
      if (!isNaN(tmp)) {
        var index = parseInt(tmp);
        if (!isNaN(index) && index >= 0) indexs.push(index);
      }
    });
    if (this.isMultiple()) return indexs.length > 0 ? indexs : null;
    if (indexs && indexs.length > 0) return needArray ? [indexs[0]] : indexs[0];
    return -1;
  }; // 获取选中的项编号


  Renderer.getSelectedKey = function (needArray) {
    var selectedKey = this.options.selectedKey;

    if (Utils.isBlank(selectedKey)) {
      return needArray || this.isMultiple() ? [] : null;
    }

    if (!Utils.isArray(selectedKey)) selectedKey = ("" + selectedKey).split(",");
    var ids = [];
    Utils.each(selectedKey, function (tmp) {
      if (tmp || tmp === 0) {
        ids.push(isNaN(tmp) ? tmp : parseInt(tmp));
      }
    });
    if (ids.length == 0) return null;
    if (this.isMultiple()) return ids;
    return needArray ? [ids[0]] : ids[0];
  }; // 获取选中的数据集


  Renderer.getSelectedData = function (needArray, datas) {
    datas = datas || this.getData();
    var selectedDatas = [];

    if (datas && datas.length > 0) {
      var indexs = this.getSelectedIndex(true);
      var ids = this.getSelectedKey(true) || [];

      for (var i = 0, l = datas.length; i < l; i++) {
        var _data = datas[i];
        if (this._isSelected(_data, i, indexs, ids)) selectedDatas.push(_data);
      }
    }

    if (selectedDatas.length == 0) return null;
    if (this.isMultiple()) return selectedDatas;
    return needArray ? [selectedDatas[0]] : selectedDatas[0];
  };

  Renderer.isSelected = function (data, index, selectedIndexs, selectedIds) {
    if (!selectedIndexs && !selectedIds) {
      selectedIndexs = this.getSelectedIndex(true);
      selectedIds = this.getSelectedKey(true) || [];
    }

    if (selectedIndexs) {
      index = Utils.getIndexValue(index);
      if (index < 0) return false;
      return selectedIndexs.indexOf(index) >= 0;
    }

    if (selectedIds) {
      var _id = this._getDataKey(data);

      return Utils.index(selectedIds, function (tmp) {
        return tmp == _id;
      }) >= 0;
    }

    return false;
  }; // 判断是否全部选中


  Renderer.isAllSelected = function (datas) {
    datas = datas || this.getData();

    if (datas && datas.length > 0) {
      var indexs = this.getSelectedIndex(true);
      var ids = this.getSelectedKey(true) || [];

      for (var i = 0, l = datas.length; i < l; i++) {
        if (!this._isSelected(datas[i], i, indexs, ids)) return false;
      }

      return true;
    }

    return false;
  }; // ====================================================


  _Renderer.render = function ($, target) {
    Renderer.render.call(this, $, target);
  }; // 初始化渲染组件选中项信息（索引或编号）


  _Renderer.renderSelection = function ($, target) {
    Renderer.renderSelection.call(this, $, target, this._render_items);
  }; // ----------------------------------------------------
  // 获取选中的项索引


  _Renderer.getSelectedIndex = function (needArray) {
    return Renderer.getSelectedIndex.call(this, needArray);
  }; // 获取选中的项编号


  _Renderer.getSelectedKey = function (needArray) {
    return Renderer.getSelectedKey.call(this, needArray);
  };

  _Renderer.getSelectedData = function (needArray) {
    return Renderer.getSelectedData.call(this, needArray);
  }; // 判断组件是否支持多选


  _Renderer.isMultiple = function () {
    return Fn.isMultiple.call(this);
  }; // 判断是否全部选中


  _Renderer.isAllSelected = function () {
    return Renderer.isAllSelected.call(this);
  }; // ----------------------------------------------------


  _Renderer._isSelected = function (data, index, selectedIndexs, selectedIds) {
    return Renderer.isSelected.call(this, data, index, selectedIndexs, selectedIds);
  };

  _Renderer._setItemSelected = function (item, beSelected) {
    if (beSelected) item.addClass("selected");else item.removeClass("selected");
  };
})(typeof window !== "undefined");
"use strict";

// 2019-04-13
// group
(function (frontend) {
  if (frontend && VRender.Component.ui.group) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Utils = UI.util;
  var VERTICAL = "vertical";
  var HORIZONTIAL = "horizontial"; ///////////////////////////////////////////////////////

  var UIGroup = UI.group = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIGroup = UIGroup.prototype = new UI._base(false);

  _UIGroup.getOrientation = function () {
    return this.$el.attr("opt-orientation");
  };

  _UIGroup.setOrientation = function (value) {
    this.$el.removeClass(HORIZONTIAL).removeClass(VERTICAL);
    this.$el.removeAttr("opt-orientation");

    if (value === HORIZONTIAL || value === VERTICAL) {
      this.$el.addClass(value).attr("opt-orientation", value);
    }

    layoutChanged.call(this);
  };

  _UIGroup.getGap = function () {
    return this.$el.attr("opt-gap") || 0;
  };

  _UIGroup.setGap = function (value) {
    this.$el.attr("opt-gap", Utils.trimToEmpty(value));
    layoutChanged.call(this);
  };

  _UIGroup.getAlign = function () {
    return this.$el.attr("opt-align");
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
      var item = child.$el || child;

      if (this.getOrientation()) {
        // 有明确指定方向，用 div 包裹
        item = $("<div class='grp-item'></div>").append(item);
      }

      index = isNaN(index) || index === "" ? -1 : parseInt(index);
      var children = this.$el.children();

      if (index >= 0 && index < children.length) {
        children.eq(index).before(item);
      } else {
        this.$el.append(item);
      }

      layoutChanged.call(this);
    }

    return child;
  };

  _UIGroup.removeAt = function (index) {
    var item = this.$el.children().eq(index).remove();
    layoutChanged.call(this);
    return item.children();
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

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-group");
    var orientation = this.getOrientation();

    if (orientation) {
      target.addClass(orientation);
      target.attr("opt-orientation", orientation);
    }

    target.attr("opt-gap", this.getGap());
    target.attr("opt-align", this.getAlign());
    renderSubViews.call(this, $, target);
    return this;
  };

  _Renderer.getOrientation = function () {
    var orientation = this.options.orientation;
    if (orientation == HORIZONTIAL || orientation == VERTICAL) return orientation;
    return null;
  };

  _Renderer.getGap = function () {
    return this.options.gap;
  };

  _Renderer.getAlign = function () {
    return this.options.align;
  }; ///////////////////////////////////////////////////////


  var renderSubViews = function renderSubViews($, target) {
    showSubViews.call(this, $, target, getChildren.call(this));
  };

  var getChildren = function getChildren() {
    return this.options.children || this.options.subViews || this.options.views;
  };

  var showSubViews = function showSubViews($, target, children) {
    children = Utils.toArray(children);
    var orientation = this.getOrientation();
    Utils.each(children, function (child) {
      if (Utils.isNotNull(child)) {
        var _target = target; // 如果明确指定了方向，则用一个 div 包裹

        if (orientation) _target = $("<div class='grp-item'></div>").appendTo(target);
        if (Utils.isFunction(child.render)) child.render(_target);else _target.append(child.$el || child);
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
    var gap = Utils.getFormatSize(this.getGap(), this._isRenderAsRem()) || "";
    var orientation = this.getOrientation();

    if (orientation == HORIZONTIAL) {
      display = "inline-block";
      left = gap;
    } else if (orientation == VERTICAL) {
      // display = "block";
      top = gap;
    } else {
      top = gap;
    }

    var aligns = this.getAlign() || "";
    aligns = aligns.toLowerCase();
    if (/left/.test(aligns)) align = "left";else if (/center/.test(aligns)) align = "center";else if (/right/.test(aligns)) align = "right";
    if (/top/.test(aligns)) valign = "top";else if (/middle/.test(aligns)) valign = "middle";else if (/bottom/.test(aligns)) valign = "bottom";
    target.css("text-align", align);
    var children = target.children();
    children.css("display", display);
    children.css("vertical-align", valign);
    children.css("margin-left", left).css("margin-top", top);
    children.eq(0).css("margin-left", "").css("margin-top", "");
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIGroup = UIGroup;

    window.UIHGroup = function (options) {
      return new UIGroup(Utils.extend(options, {
        orientation: HORIZONTIAL
      }));
    };

    window.UIVGroup = function (options) {
      return new UIGroup(Utils.extend(options, {
        orientation: VERTICAL
      }));
    };

    UI.init(".ui-group", UIGroup, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-05-23
// button
(function (frontend) {
  if (frontend && VRender.Component.ui.button) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Utils = UI.util; // 默认按钮样式

  var ButtonStyles = ["ui-btn-default", "ui-btn-primary", "ui-btn-success", "ui-btn-danger", "ui-btn-warn", "ui-btn-info", "ui-btn-link", "ui-btn-text"]; // 按钮大小定义

  var ButtonSizes = ["bigger", "big", "normal", "small", "tiny"]; ///////////////////////////////////////////////////////

  var UIButton = UI.button = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIButton = UIButton.prototype = new UI._base(false);

  _UIButton.init = function (target, options) {
    UI._base.init.call(this, target, options);

    if (this._isRenderAsApp()) {
      target.on("tap", ".dropdown", onDropdownTouchHandler.bind(this));
    }

    target.on("tap", ".btn", onBtnClickHandler.bind(this));
    target.on("tap", ".dropdownbtn", onDropdownBtnHandler.bind(this));
    target.on("tap", ".dropdown li", onDropdownItemHandler.bind(this));
  }; // ====================================================


  _UIButton.getLabel = function () {
    return this.options.label;
  };

  _UIButton.setLabel = function (value) {
    this.options.label = value;
    var button = this.$el.children(".btn");
    button.children("span").remove();

    if (Utils.isNotBlank(value)) {
      $("<span></span>").appendTo(button).text(Utils.trimToEmpty(value) || " ");
    }
  };

  _UIButton.waiting = function (time) {
    if (Utils.isNull(time) || time === true) time = parseInt(this.$el.attr("opt-wait")) || -1;else time = Math.max(0, parseInt(time)) || 0;
    doWaiting.call(this, time);
  };

  _UIButton.isWaiting = function () {
    return this.$el.is(".waiting");
  };

  _UIButton.setWaiting = function (value) {
    if (value === true || Utils.isNull(value)) value = -1;else value = Math.max(0, parseInt(value)) || 0;
    this.$el.attr("opt-wait", value);
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-btn");
    var options = this.options || {};
    var size = options.size;
    if (size && ButtonSizes.indexOf(size) >= 0) target.addClass(size); // 如果是内置 style 就用该样式，否则通过 type 获取一个样式
    // 注：style 样式已在 base 或 UIView 中添加

    var style = options.style || "";

    if (ButtonStyles.indexOf(style) < 0) {
      target.addClass(getTypeStyle(options.type)); // 会返回一个默认样式
    }

    if (Utils.isTrue(options.toggle)) target.attr("opt-toggle", "1");
    if (Utils.isNotBlank(options.link)) target.attr("data-lnk", Utils.trimToNull(options.link));
    var mainBtn = $("<button class='btn'></button>").appendTo(target);
    var iconUrl = getIconUrl.call(this);

    if (Utils.isNotBlank(iconUrl)) {
      var icon = $("<i class='icon'></i>").appendTo(mainBtn);
      icon.css(frontend ? "backgroundImage" : "background-image", "url(" + iconUrl + ")");
    }

    if (Utils.isNotBlank(options.label)) {
      $("<span></span>").appendTo(mainBtn).text(Utils.trimToEmpty(options.label) || " ");
    }

    renderWaitingInfos.call(this, $, target);
    renderDropdowns.call(this, $, target);
    return this;
  };

  _Renderer.getItems = function () {
    return Utils.toArray(this.options.items);
  }; ///////////////////////////////////////////////////////


  var onBtnClickHandler = function onBtnClickHandler(e) {
    if (this.$el.is(".disabled, .waiting")) return;
    var target = this.$el;
    var link = target.attr("data-lnk");

    if (link) {
      window.open(link, "_self");
    } else {
      var isToggle = target.attr("opt-toggle") == 1;

      if (target.is(".has-items")) {
        if (!isToggle) {
          showDropdown.call(this);
          return;
        }
      } else if (isToggle) {
        if (target.attr("active") == 1) target.removeAttr("active");else target.attr("active", "1");
      }

      this.trigger("tap", target.attr("name"));
      var waitTime = parseInt(target.attr("opt-wait"));

      if (waitTime) {
        doWaiting.call(this, waitTime);
      }
    }
  };

  var onDropdownBtnHandler = function onDropdownBtnHandler(e) {
    if (this.$el.is(".disabled, .waiting")) return false;
    showDropdown.call(this);
    return false;
  };

  var onDropdownTouchHandler = function onDropdownTouchHandler(e) {
    if ($(e.target).is(".dropdown")) hideDropdown.call(this);
  };

  var onDropdownItemHandler = function onDropdownItemHandler(e) {
    var item = $(e.currentTarget);
    var name = item.attr("name") || "";

    if (this.$el.attr("opt-toggle") == 1) {
      this.$el.attr("name", name);
      this.$el.children(".btn").find("span").text(item.text());
    }

    this.trigger("tap", item.attr("name"));
    hideDropdown.call(this);
    return false;
  };

  var onMouseHandler = function onMouseHandler(e) {
    UI.fn.mouseDebounce(e, hideDropdown.bind(this));
  }; // ====================================================


  var renderWaitingInfos = function renderWaitingInfos($, target) {
    var waitTime = getWaitTime.call(this);
    if (waitTime) target.attr("opt-wait", waitTime);
    if (Utils.isTrue(this.options.waiting)) target.addClass("waiting");
  };

  var renderDropdowns = function renderDropdowns($, target) {
    target.removeClass("has-items");
    target.children(".dropdownbtn").remove();
    target.children(".dropdown").remove();
    var datas = this.getItems();

    if (datas && datas.length > 0) {
      target.addClass("has-items");
      target.append("<span class='dropdownbtn'>&nbsp;</span>");
      var dropdown = $("<div class='dropdown'></div>").appendTo(target);
      var items = $("<ul></ul>").appendTo(dropdown);
      Utils.each(datas, function (data) {
        if (Utils.isNotBlank(data)) {
          if (Utils.isPrimitive(data)) data = {
            label: data
          };
          var item = $("<li></li>").appendTo(items);
          if (data.name) item.attr("name", data.name);
          $("<span></span>").appendTo(item).text(Utils.trimToEmpty(data.label) || " ");
        }
      });
    }
  };

  var doWaiting = function doWaiting(time) {
    var _this = this;

    if (this.t_wait) {
      clearTimeout(this.t_wait);
      this.t_wait = 0;
    }

    if (time) {
      var target = this.$el.addClass("waiting");

      if (time > 0) {
        this.t_wait = setTimeout(function () {
          _this.t_wait = 0;
          target.removeClass("waiting");
        }, time);
      }
    } else {
      this.$el.removeClass("waiting");
    }
  }; // ====================================================


  var showDropdown = function showDropdown() {
    if (this.$el.is(".show-dropdown")) return;
    var target = this.$el.addClass("show-dropdown");

    if (this._isRenderAsApp()) {
      $("html,body").addClass("ui-scrollless");
    } else {
      target.on("mouseenter", onMouseHandler.bind(this));
      target.on("mouseleave", onMouseHandler.bind(this));
      var dropdown = target.children(".dropdown");
      var maxHeight = UI.fn.getDropdownHeight.call(this, dropdown);
      var offset = Utils.offset(dropdown, this._getScrollContainer(), 0, maxHeight);
      if (offset.isOverflowY) target.addClass("show-before");
    }

    setTimeout(function () {
      target.addClass("animate-in");
    });
  };

  var hideDropdown = function hideDropdown() {
    if (!this.$el.is(".show-dropdown")) return;
    var target = this.$el.addClass("animate-out");

    if (this._isRenderAsApp()) {
      $("html,body").removeClass("ui-scrollless");
    } else {
      target.off("mouseenter").off("mouseleave");
    }

    setTimeout(function () {
      target.removeClass("show-dropdown").removeClass("show-before");
      target.removeClass("animate-in").removeClass("animate-out");
    }, 300);
  }; // ====================================================


  var getTypeStyle = function getTypeStyle(type) {
    if (Utils.isNotBlank(type)) {
      if (["ok", "submit", "save", "primary", "major"].indexOf(type) >= 0) return "ui-btn-primary";
      if (["danger", "error"].indexOf(type) >= 0) return "ui-btn-danger";
      if (["success", "complete", "finish"].indexOf(type) >= 0) return "ui-btn-success";
      if (["warn", "warning"].indexOf(type) >= 0) return "ui-btn-warn";
      if (["info", "highlight"].indexOf(type) >= 0) return "ui-btn-info";
      if (type === "text") return "ui-btn-text";
      if (type === "link") return "ui-btn-link";
    }

    return "ui-btn-default";
  };

  var getIconUrl = function getIconUrl() {
    var icon = this.options.icon;

    if (icon === true) {
      var type = this.options.type;
      if (type == "success" || type == "submit") icon = "012b.png";else if (type == "warn") icon = "013b.png";else if (type == "error" || type == "danger") icon = "014b.png";else if (type == "info") icon = "015b.png";
      if (icon !== true) icon = "/vrender-ui/icons/" + icon;
    }

    return typeof icon == "string" ? icon : null;
  };

  var getWaitTime = function getWaitTime() {
    var waitTime = 0;
    var options = this.options || {};
    if (options.hasOwnProperty("waitTime")) waitTime = options.waitTime;else if (options.hasOwnProperty("wait")) waitTime = options.wait;
    if (waitTime === true) return -1;
    return Math.max(0, parseInt(waitTime)) || 0;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIButton = UIButton;
    UI.init(".ui-btn", UIButton, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-05-29
// checkbox
(function (frontend) {
  if (frontend && VRender.Component.ui.checkbox) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Utils = UI.util; ///////////////////////////////////////////////////////

  var UICheckbox = UI.checkbox = function (view, options) {
    return UI._select.call(this, view, options);
  };

  var _UICheckbox = UICheckbox.prototype = new UI._select(false);

  _UICheckbox.init = function (target, options) {
    UI._select.init.call(this, target, options);

    this.input = this.$el.children("input");
    this.input.on("change", chkboxChangeHandler.bind(this));
  }; // ====================================================


  _UICheckbox.val = function (value) {
    if (Utils.isNotNull(value)) {
      this.input.val(value);
    }

    return this.input.val();
  };

  _UICheckbox.isChecked = function () {
    return this.input.is(":checked");
  };

  _UICheckbox.setChecked = function (bool) {
    var checked = Utils.isNull(bool) ? true : Utils.isTrue(bool);
    this.input[0].checked = checked;
    this.input.trigger("change");
  };

  _UICheckbox.getLabel = function () {
    return this.$el.children("span").text();
  };

  _UICheckbox.setLabel = function (value) {
    this.$el.children("span").remove();
    if (Utils.isNotBlank(value)) $("<span></span>").appendTo(this.$el).text(value);
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._selectRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._selectRender(false);

  _Renderer.render = function ($, target) {
    UI._selectRender.render.call(this, $, target);

    target.addClass("ui-chkbox");
    var options = this.options || {};
    var input = $("<input type='checkbox'/>").appendTo(target);
    if (Utils.isNotNull(options.value)) input.val(options.value);

    if (Utils.isTrue(options.checked)) {
      target.addClass("checked");
      input.attr("checked", "checked");
    }

    if (Utils.isNotNull(options.label)) $("<span></span>").appendTo(target).text(options.label);
    input.attr("name", Utils.trimToNull(options.name));
    return this;
  }; ///////////////////////////////////////////////////////
  // 复选框状态变更事件


  var chkboxChangeHandler = function chkboxChangeHandler(e) {
    if ($(e.currentTarget).is(":checked")) this.$el.addClass("checked");else this.$el.removeClass("checked");
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UICheckbox = UICheckbox;
    UI.init(".ui-chkbox", UICheckbox, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-05-29
// combobox
(function (frontend) {
  if (frontend && VRender.Component.ui.combobox) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UICombobox = UI.combobox = function (view, options) {
    return UI._select.call(this, view, options);
  };

  var _UICombobox = UICombobox.prototype = new UI._select(false);

  _UICombobox.init = function (target, options) {
    UI._base.init.call(this, target, options);

    target = this.$el;

    if (this._isRenderAsApp() && this.isNative()) {
      target.find("select").on("change", selectInputChangeHandler.bind(this));
    } else {
      if (this._isRenderAsApp()) {
        target.on("tap", ".dropdown", dropdownTouchHandler.bind(this));
      }

      target.on("tap", ".ipt", iptClickHandler.bind(this));
      target.on("tap", ".item", itemClickHandler.bind(this));
      target.on("tap", ".ui-more", moreClickHandler.bind(this));
    }

    if (target.is(".editable")) {
      target.on("keydown", "input", inputKeyDownHandler.bind(this));
      target.on("keyup", "input", inputKeyUpHandler.bind(this));
      target.on("focusin", "input", inputFocusInHandler.bind(this));
      target.on("focusout", "input", inputFocusOutHandler.bind(this));
    }
  }; // ====================================================


  _UICombobox.val = function (value) {
    if (Utils.isNull(value)) {
      var selectedIndex = this.getSelectedIndex(true);

      if (selectedIndex && selectedIndex > 0) {
        return this.getSelectedKey();
      }

      if (this.isEditable()) return this.$el.find(".ipt > input").val();
      return null;
    }

    var snapshoot = this._snapshoot();

    var match = matchText.call(this, value);
    if (match) this.setSelectedIndex(match[0]);else {
      this.setSelectedIndex(-1);

      if (!this.isMatchRequired()) {
        this.$el.find(".ipt > input").val(value);
        setValueFlag.call(this, Utils.isNotBlank(value));
      }
    }
    snapshoot.done();
    return this;
  };

  _UICombobox.getData = function (original) {
    if (original) {
      this.options.data = this._doAdapter(this.options.data);
      return this.options.data;
    }

    return getDataFlat.call(this);
  }; // 修改数据，


  _UICombobox.setDataSilent = function (value) {
    this.options.data = value;
    rerenderSilent.call(this);
  };

  _UICombobox.setSelectedIndex = function (value) {
    var snapshoot = this._snapshoot();

    var indexs = UI._select.setSelectedIndex.call(this, value);

    Utils.each(this._getItems(), function (item, i) {
      setItemActive(item, indexs.indexOf(i) >= 0);
    });

    if (!indexs || indexs.length == 0) {
      this.$el.find("select").val("");
    }

    selectChanged.call(this);
    snapshoot.done();
  };

  _UICombobox.getPrompt = function () {
    return this.$el.children(".ipt").find(".prompt").text();
  };

  _UICombobox.setPrompt = function (value) {
    var target = this.$el.children(".ipt");
    target.find(".prompt").remove();

    if (Utils.isNotBlank(value)) {
      $("<span class='prompt'></span>").appendTo(target).text(value);
    }
  }; // ====================================================


  _UICombobox.addItem = function (data, index) {
    index = Utils.getIndexValue(index);
    data = Fn.doAdapter.call(this, data, index) || {};
    var datas = this.getData(true);
    var beInsert = false;

    if (index >= 0) {
      loopData.call(this, datas, function (_data, _index, _array, _subIndex) {
        if (index == _index) {
          _array.splice(_subIndex, 0, data);

          beInsert = true;
          return false;
        }
      });
    }

    if (!beInsert) {
      if (datas.length > 0) datas[datas.length - 1].push(data);else datas.push([data]);
    }

    var newItem = this._getNewItem($, this._getItemContainer());

    this._renderOneItem($, newItem, data, index);

    if (beInsert && index >= 0) {
      this._getItems().eq(index).before(newItem);

      UI._select.updateSelection.call(this);
    }

    return newItem;
  };

  _UICombobox.updateItem = function (data, index) {
    var _this = this;

    data = Fn.doAdapter.call(this, data, index);
    if (!index && index !== 0) index = this.getDataIndex(data);else index = Utils.getIndexValue(index);

    if (index >= 0) {
      var datas = this.getData(true);
      var oldItem = null;
      loopData.call(this, datas, function (_data, _index, _array, _subIndex) {
        if (index == _index) {
          _array.splice(_subIndex, 1, data);

          var newItem = _this._getNewItem($, _this._getItemContainer());

          _this._renderOneItem($, newItem, data, index);

          var items = _this._getItems();

          oldItem = items.eq(index).before(newItem).remove();
          if (oldItem.is(".selected")) setItemActive(newItem, true);
          return false;
        }
      });

      UI._select.updateSelection.call(this);

      if (oldItem && oldItem.is(".selected")) selectChanged.call(this);
    }

    return index;
  };

  _UICombobox.removeItemAt = function (index) {
    index = Utils.getIndexValue(index);

    if (index >= 0) {
      var item = this._getItems().eq(index);

      if (item && item.length > 0) {
        var group = item.parent();
        item.remove();
        if (group.children().length == 0) group.remove();
      }

      var datas = this.getData(true);
      var removeData = null;
      loopData.call(this, datas, function (_data, _index, _array, _subIndex) {
        if (index == _index) {
          removeData = _array.splice(_subIndex, 1);

          if (_array.length == 0) {
            Utils.remove(datas, function (tmp) {
              return tmp == _array;
            });
          }

          return false;
        }
      });

      UI._select.updateSelection.call(this);

      if (item.is(".selected")) selectChanged.call(this);
      return removeData;
    }

    return null;
  }; // ====================================================


  _UICombobox.isNative = function () {
    return this.$el.attr("opt-native") == 1;
  };

  _UICombobox.isEditable = function () {
    return this.$el.is(".editable");
  }; // 可输入的情况是否强制匹配项


  _UICombobox.isMatchRequired = function () {
    return this.$el.attr("opt-match") == 1;
  }; // ====================================================


  _UICombobox.rerender = function () {
    var _this2 = this;

    Utils.debounce("combobox_render-" + this.getViewId(), function () {
      var input = _this2.$el.find(".ipt > input");

      var inputValue = input.val() || "";

      var selectedIndex = _this2.getSelectedIndex();

      var itemContainer = _this2._getItemContainer();

      if (itemContainer && itemContainer.length > 0) {
        _this2._renderItems($, itemContainer.empty(), _this2.getData());
      }

      _this2.setSelectedIndex(selectedIndex);

      if (_this2.isEditable() && _this2.getSelectedIndex() < 0) {
        input.val(inputValue || "");
        setValueFlag.call(_this2, Utils.isNotBlank(inputValue));
      }
    });
  };

  _UICombobox._getItemContainer = function () {
    return this.$el.children(".dropdown").children(".box");
  };

  _UICombobox._renderItems = function ($, itemContainer, datas) {
    datas = datas || this.getData(true);
    renderItems.call(this, $, this.$el, itemContainer, datas);
  };

  _UICombobox._renderOneItem = function ($, item, data, index) {
    if (this._isRenderAsApp() && this.isNative()) {
      item.text(this._getDataLabel(data, index));
    } else {
      UI._items.renderOneItem.call(this, item, null, data, index);
    }
  };

  _UICombobox._getNewItem = function ($, itemContainer, data, index) {
    if (this._isRenderAsApp() && this.isNative()) {
      var select = itemContainer.children("select");
      return $("<option class='item'></option>").appendTo(select);
    } else {
      var group = itemContainer.children(".grp").last();
      if (!group || group.length == 0) group = $("<div class='grp'></div>").appendTo(itemContainer);
      return $("<div class='item'></div>").appendTo(group);
    }
  };

  _UICombobox._getItems = function (selector) {
    var items = this._getItemContainer().find(".item");

    if (selector) items = items.filter(selector);
    return items;
  };

  _UICombobox._isItemSelected = function (item) {
    return item.is(".selected") || item.is(":selected");
  };

  _UICombobox._setItemSelected = function (item, beSelected) {
    setItemActive.call(this, item, beSelected);
  };

  _UICombobox._loadBefore = function () {
    if (this._isRenderAsApp() && this.isNative()) return;

    var itemContainer = this._getItemContainer();

    itemContainer.find(".ui-load, .ui-more").remove();

    if (this._isRenderAsApp() && this.isNative()) {
      var loadText = this._getLoadText();

      loadText = Utils.isNull(loadText) ? "正在加载.." : Utils.trimToEmpty(loadText);

      if (loadText) {
        var select = itemContainer.children("select");
        $("<option class='ui-load'></option>").appendTo(select).text(loadText);
      }
    } else {
      UI._itemsRender.renderLoadView.call(this, $, itemContainer);
    }
  };

  _UICombobox._loadAfter = function () {
    if (this._isRenderAsApp() && this.isNative()) return;

    var itemContainer = this._getItemContainer();

    itemContainer.find(".ui-load").remove();

    if (this.hasMore()) {
      this.$el.addClass("has-more");

      if (this._isRenderAsApp() && this.isNative()) {
        var moreText = this._getMoreText();

        moreText = Utils.isNull(moreText) ? "加载更多" : Utils.trimToEmpty(moreText);

        if (moreText) {
          var select = itemContainer.children(".select");
          $("<option class='ui-more'></option>").appendTo(select).text(moreText);
        }
      } else {
        UI._itemsRender.renderMoreView.call(this, $, itemContainer);
      }
    } else {
      this.$el.removeClass("has-more");
    }
  }; // ====================================================


  _UICombobox._snapshoot_shoot = function (state) {
    state.selectedIndex = this.getSelectedIndex();
    state.value = this.$el.find(".ipt > input").val() || "";
    state.data = this.getSelectedData();
  };

  _UICombobox._snapshoot_compare = function (state) {
    var value = this.$el.find(".ipt > input").val() || "";
    if (state.value != value) return false;
    var selectedIndex = this.getSelectedIndex();
    return Fn.equalIndex(selectedIndex, state.selectedIndex);
  };

  _UICombobox._doAdapter = function (datas) {
    return doAdapter.call(this, datas);
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._selectRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._selectRender(false);

  _Renderer.render = function ($, target) {
    target.addClass("ui-combobox");
    var options = this.options || {};
    if (this.isNative()) target.attr("opt-native", "1");
    if (Utils.isTrue(options.needMatch)) target.attr("opt-match", "1"); // 容器，用于下拉列表定位

    target.attr("opt-box", options.container);
    renderTextView.call(this, $, target);
    target.append("<div class='dropdown'><div class='box'></div></div>");

    UI._selectRender.render.call(this, $, target);

    return this;
  }; // ====================================================


  _Renderer.getSelectedData = function (needArray) {
    return UI._selectRender.getSelectedData.call(this, needArray, getDataFlat.call(this));
  };

  _Renderer.isNative = function () {
    return Utils.isTrue(this.options["native"]);
  }; // ====================================================


  _Renderer._getItemContainer = function ($, target) {
    return target.children(".dropdown").children(".box");
  };

  _Renderer._renderItems = function ($, target) {
    var itemContainer = this._getItemContainer($, target);

    renderItems.call(this, $, target, itemContainer, this.getData());
  };

  _Renderer._renderEmptyView = function ($, target) {// prevent default
  };

  _Renderer._renderLoadView = function ($, target) {// prevent default
  };

  _Renderer._setItemSelected = function (item, beSelected) {
    if (beSelected) item.addClass("selected").attr("selected", "selected");else item.removeClass("selected").removeAttr("selected");
  };

  _Renderer._doAdapter = function (datas) {
    return doAdapter.call(this, datas);
  }; ///////////////////////////////////////////////////////


  var iptClickHandler = function iptClickHandler(e) {
    var target = $(e.target);

    if (this._isRenderAsApp()) {
      // 移动端，可输入的情况下，点击下拉按钮显示下拉列表，否则退出
      if (this.isEditable() && !target.is(".dropdownbtn")) return;
    } else {
      if (this.isEditable() && target.is(".dropdownbtn")) {
        this.$el.find(".ipt > input").focus();
      }
    }

    showDropdown.call(this);
  };

  var itemClickHandler = function itemClickHandler(e) {
    var item = $(e.currentTarget);
    if (item.is(".selected") && !this.isMultiple()) return false;

    var snapshoot = this._snapshoot();

    if (item.is(".selected")) {
      setItemActive(item, false);
    } else {
      if (!this.isMultiple()) setItemActive(this._getItems(".selected"), false);
      setItemActive(item, true);
    }

    UI._select.updateSelection.call(this);

    selectChanged.call(this);
    snapshoot.done();
    if (!this.isMultiple()) hideDropdown.call(this);
    return false;
  };

  var moreClickHandler = function moreClickHandler(e) {
    this.more();
  }; // 按下“上”、“下”箭头切换选项


  var inputKeyDownHandler = function inputKeyDownHandler(e) {
    if (this._isRenderAsApp()) return;
    showDropdown.call(this);
    this.$el.off("mouseenter").off("mouseleave"); // 这样不会自动隐藏

    if (e.which == 38 || e.which == 40) {
      // 上、下箭头
      if (this.isMultiple()) return; // 多选的时候不做切换

      var index = this.getSelectedIndex();

      if (e.which == 38) {
        if (index > 0) index -= 1;
      } else if (e.which == 40) {
        if (index < this.length() - 1) index += 1;
      }

      this.setSelectedIndex(index);
    }
  };

  var inputKeyUpHandler = function inputKeyUpHandler(e) {
    var input = $(e.currentTarget);

    if (e.which == 13) {
      hideDropdown.call(this);

      var snapshoot = this._snapshoot();

      var indexs = UI._select.updateSelection.call(this);

      if (indexs && indexs.length > 0) {
        selectChanged.call(this);
      } else if (this.isMatchRequired()) {
        input.val("");
      }

      input.select();
      snapshoot.done();
    } else if (!Utils.isControlKey(e) || e.which == 8) {
      // Backspace
      var text = input.val();
      setValueFlag.call(this, text && text.length > 0);
      var match = matchText.call(this, text, true);
      var items = setItemActive(this._getItems(), false);
      this.$el.find("select").val("");
      if (match && match[0] >= 0) setItemActive(items.eq(match[0]), true);
    }
  };

  var inputFocusInHandler = function inputFocusInHandler(e) {
    if (this.t_focus) {
      clearTimeout(this.t_focus);
      this.t_focus = 0;
    }
  };

  var inputFocusOutHandler = function inputFocusOutHandler(e) {
    var _this3 = this;

    var input = $(e.currentTarget);
    this.t_focus = setTimeout(function () {
      _this3.t_focus = 0;

      if (isDropdownVisible.call(_this3)) {
        var text = input.val();
        var match = matchText.call(_this3, text, false);

        if (match && match[0] >= 0) {
          _this3.setSelectedIndex(match[0]);
        } else if (_this3.isMatchRequired()) {
          match = matchText.call(_this3, text, true);

          _this3.setSelectedIndex(match ? match[0] : -1);
        } else {
          var snapshoot = _this3._snapshoot();

          _this3.setSelectedIndex(-1);

          input.val(text);
          setValueFlag.call(_this3, text && text.length > 0);
          snapshoot.done();
        }

        hideDropdown.call(_this3);
      }
    }, 200);
  };

  var comboMouseHandler = function comboMouseHandler(e) {
    Fn.mouseDebounce(e, hideDropdown.bind(this));
  };

  var dropdownTouchHandler = function dropdownTouchHandler(e) {
    if ($(e.target).is(".dropdown")) hideDropdown.call(this);
  };

  var selectInputChangeHandler = function selectInputChangeHandler(e) {
    var snapshoot = this._snapshoot();

    this._getItems().removeClass("selected");

    UI._select.updateSelection.call(this);

    selectChanged.call(this);
    snapshoot.done();
  }; // ====================================================


  var renderTextView = function renderTextView($, target) {
    var _this4 = this;

    var ipttag = $("<div class='ipt'></div>").appendTo(target);
    var input = $("<input type='text'/>").appendTo(ipttag);
    var datas = this.getSelectedData(true);

    if (datas && datas.length > 0) {
      target.addClass("has-val");
      var labels = Utils.map(datas, function (temp) {
        return _this4._getDataLabel(temp);
      });
      input.val(labels.join(",") || "");
    }

    if (Utils.isTrue(this.options.editable)) target.addClass("editable");else input.attr("readonly", "readonly");
    ipttag.append("<button class='dropdownbtn'></button>");
    ipttag.append("<span class='prompt'>" + Utils.trimToEmpty(this.options.prompt) + "</span>");
  };

  var renderItems = function renderItems($, target, itemContainer, datas) {
    var _this5 = this;

    this._render_items = [];

    if (this._isRenderAsApp() && this.isNative()) {
      renderItemsAsSelect.call(this, $, itemContainer, datas);
    } else {
      renderItemsAsDropdown.call(this, $, itemContainer, datas);
    }

    setTimeout(function () {
      _this5._render_items = null; // 释放空间
    });
  };

  var renderItemsAsDropdown = function renderItemsAsDropdown($, itemContainer, datas) {
    var _this6 = this;

    if (!datas || datas.length == 0) return;
    var items = this._render_items || [];

    var addItem = function addItem(target, data) {
      var item = $("<div class='item'></div>").appendTo(target);
      items.push({
        item: item,
        data: data,
        index: items.length
      });
      renderOneItem.call(_this6, $, item, data);
    };

    var group = itemContainer.children(".grp").last();
    Utils.each(datas, function (data, i) {
      if (Utils.isArray(data)) {
        if (data.length > 0) {
          group = $("<div class='grp'></div>").appendTo(itemContainer); // data.title = "标题";

          if (data.title) $("<div class='title'></div>").appendTo(group).text(data.title);
          Utils.each(data, function (temp, j) {
            addItem(group, temp);
          });
        }

        group = null;
      } else {
        if (!group || group.length == 0) group = $("<div class='grp'></div>").appendTo(itemContainer);
        addItem(group, data);
      }
    });
  };

  var renderItemsAsSelect = function renderItemsAsSelect($, itemContainer, datas) {
    var _this7 = this;

    var select = itemContainer.children("select");

    if (!select || select.length == 0) {
      select = $("<select size='1'></select>").appendTo(itemContainer);
      if (this.isMultiple()) select.attr("multiple", "multiple");else select.append("<option disabled='disabled' selected='selected'>请选择..</option>");
    }

    if (datas && datas.length > 0) {
      var items = this._render_items || [];

      var addItem = function addItem(target, data) {
        var item = $("<option class='item'></option>").appendTo(target);
        items.push({
          item: item,
          data: data,
          index: items.length
        });
        item.text(_this7._getDataLabel(data));
      };

      Utils.each(datas, function (data) {
        if (Utils.isArray(data)) {
          Utils.each(data, function (temp) {
            addItem(select, temp);
          });
        } else {
          addItem(select, data);
        }
      });
    }
  };

  var renderOneItem = function renderOneItem($, item, data, index) {
    UI._itemsRender.renderOneItem.call(this, $, item, item, data, index);
  };

  var rerenderSilent = function rerenderSilent() {
    var _this8 = this;

    Utils.debounce("combobox_silent-" + this.getViewId(), function () {
      var selectedIndex = _this8.getSelectedIndex();

      var itemContainer = _this8._getItemContainer();

      if (itemContainer && itemContainer.length > 0) {
        _this8._renderItems($, itemContainer.empty(), _this8.getData());
      }

      if (selectedIndex >= 0) {
        var item = _this8._getItems().eq(selectedIndex);

        if (item && item.length > 0) setItemActive.call(_this8, item, true);
      }
    });
  }; // ====================================================


  var selectChanged = function selectChanged() {
    var _this9 = this;

    var datas = this.getSelectedData(true);
    var labels = Utils.map(datas, function (data) {
      return _this9._getDataLabel(data);
    });
    this.$el.find(".ipt > input").val(labels.join(",") || "");
    setValueFlag.call(this, datas && datas.length > 0);
  };

  var matchText = function matchText(text, like, start) {
    var _this10 = this;

    if (Utils.isBlank(text)) return null;
    var result = null;
    loopData.call(this, this.getData(true), function (data, index, array, subIndex) {
      var label = _this10._getDataLabel(data) || "";

      if (text == label) {
        result = [index, data];
        return false;
      }

      if (like && text.length < label.length) {
        var _index = label.indexOf(text);

        if (_index == 0 || _index > 0 && !start) {
          result = [index, data];
          return false;
        }
      }
    });
    return result;
  };

  var setItemActive = function setItemActive(item, isActive) {
    if (isActive) item.addClass("selected").attr("selected", "selected");else item.removeClass("selected").removeAttr("selected");
    return item;
  };

  var setValueFlag = function setValueFlag(hasValue) {
    if (hasValue) this.$el.addClass("has-val");else this.$el.removeClass("has-val");
  };

  var isDropdownVisible = function isDropdownVisible() {
    return this.$el.is(".show-dropdown");
  };

  var showDropdown = function showDropdown() {
    var _this11 = this;

    if (isDropdownVisible.call(this)) return;
    var target = this.$el.addClass("show-dropdown");

    if (this._isRenderAsApp()) {
      // 不会是 native
      $("html,body").addClass("ui-scrollless");
    } else {
      target.on("mouseenter", comboMouseHandler.bind(this));
      target.on("mouseleave", comboMouseHandler.bind(this));
      var dropdown = target.children(".dropdown");
      var maxHeight = Fn.getDropdownHeight.call(this, dropdown);
      var offset = Utils.offset(dropdown, this._getScrollContainer(), 0, maxHeight);
      if (offset.isOverflowY) target.addClass("show-before");
    } // 这里要取消 focusout 事件，不然选项显示不了
    // 移动端点击按钮时，tap 在 foucsout 之前执行，这样选项被 foucsout 隐藏了


    setTimeout(function () {
      if (_this11.t_focus) {
        clearTimeout(_this11.t_focus);
        _this11.t_focus = 0;
      }
    }, 100);
    setTimeout(function () {
      target.addClass("animate-in");
    });
  };

  var hideDropdown = function hideDropdown() {
    $("html,body").removeClass("ui-scrollless");
    var target = this.$el.addClass("animate-out");
    target.off("mouseenter").off("mouseleave");
    setTimeout(function () {
      target.removeClass("show-dropdown").removeClass("show-before");
      target.removeClass("animate-in").removeClass("animate-out");
    }, 300);
  };

  var loopData = function loopData(datas, callback) {
    var index = 0;

    for (var i = 0; i < datas.length; i++) {
      var data = datas[i];

      if (Utils.isArray(data) && data.length > 0) {
        for (var j = 0; j < data.length; j++) {
          if (callback(data[j], index, data, j) === false) return;
          index += 1;
        }
      } else {
        if (callback(data, index, datas, i) === false) return;
        index += 1;
      }
    }
  }; // ====================================================


  var doAdapter = function doAdapter(datas) {
    var _this12 = this;

    datas = Utils.toArray(datas);
    if (datas._vr_adapter_flag) return datas;
    var index = 0;
    var _datas = [];
    var _group = null;
    Utils.each(datas, function (data, i) {
      if (Utils.isArray(data)) {
        if (data.length > 0) {
          var _data = Utils.map(data, function (temp) {
            return Fn.doAdapter.call(_this12, temp, index++);
          });

          if (data.title) _data.title = data.title;

          _datas.push(_data);
        }

        _group = null;
      } else {
        if (!_group) {
          _group = [];

          _datas.push(_group);
        }

        data = Fn.doAdapter.call(_this12, data, index++);

        _group.push(data);
      }
    });
    _datas._vr_adapter_flag = true;
    return _datas;
  };

  var getDataFlat = function getDataFlat() {
    var datas = [];
    Utils.each(this.getData(true), function (data) {
      if (Utils.isArray(data)) {
        Utils.each(data, function (temp) {
          datas.push(temp);
        });
      } else {
        datas.push(data);
      }
    });
    return datas;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UICombobox = UICombobox;
    UI.init(".ui-combobox", UICombobox, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");