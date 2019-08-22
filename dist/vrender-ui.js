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

      if (!UIComp.create) {
        UIComp.create = function (options) {
          return VComponent.create(options, UIComp, Renderer);
        };
      }

      if (!UIComp.find) {
        UIComp.find = function (view) {
          return VComponent.find(view, selector, UIComp);
        };
      }

      if (!UIComp.findMe) {
        UIComp.findMe = function (view) {
          var comps = VComponent.find(view, selector, UIComp);
          return comps && comps[0] || null;
        };
      }

      if (!UIComp.instance) {
        UIComp.instance = function (target) {
          return VComponent.instance(target, selector);
        };
      }

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
      _this._tryAutoLoad();
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
  }; // 组件初始化时，视图自动加载异步数据


  UIBase.tryAutoLoad = function () {
    var _this2 = this;

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
          UIBase.tryAutoSelect.call(_this2);
        });
      });
    }
  }; // 组件初始化时，异步加载完成后，自动选择列表项


  UIBase.tryAutoSelect = function () {
    var _this3 = this;

    var setByIndex = function setByIndex(value) {
      if (Utils.isFunction(_this3.setSelectedIndex)) {
        _this3.setSelectedIndex(value);
      }
    };

    var setById = function setById(value) {
      if (Utils.isFunction(_this3.setSelectedKey)) {
        _this3.setSelectedKey(value);
      }
    };

    var options = this.options || {};
    if (options.hasOwnProperty("selectedIndex")) setByIndex(options.selectedIndex);else if (Utils.isNotBlank(this.$el.attr("data-tryindex"))) setByIndex(this.$el.attr("data-tryindex"));else if (options.hasOwnProperty("selectedId")) setById(options.selectedId);else if (Utils.isNotBlank(this.$el.attr("data-tryid"))) setById(this.$el.attr("data-tryid"));
    delete options.selectedIndex;
    delete options.selectedId;
    this.$el.removeAttr("data-tryindex");
    this.$el.removeAttr("data-tryid");
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
    var _this4 = this;

    if (Utils.isFunction(this._loadBefore)) this._loadBefore(api, params);
    return Fn.load.call(this, api, params, function (err, data) {
      if (!err) {
        if (Utils.isFunction(_this4.setData)) _this4.setData(data);else _this4.options.data = data;
      }

      setTimeout(function () {
        if (Utils.isFunction(_this4._loadAfter)) _this4._loadAfter(err, data);
        if (Utils.isFunction(callback)) callback(err, data);

        _this4.trigger("loaded", err, data);
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
  };

  _UIBase._tryAutoLoad = function () {
    UIBase.tryAutoLoad.call(this);
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
    return Renderer.doAdapter.call(this, datas);
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
    return UI._items.addItem.call(this, data, index);
  };

  UISelect.updateItem = function (data, index) {
    return UI._items.updateItem.call(this, data, index);
  };

  UISelect.removeItem = function (data, index) {
    return UI._items.removeItem.call(this, data, index);
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

    var indexs = UISelect.setSelectedIndex.call(this, value);
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
      return null;
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
  }; // ====================================================


  var renderSubViews = function renderSubViews($, target) {
    showSubViews.call(this, $, target, getChildren.call(this));
  }; ///////////////////////////////////////////////////////


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
    children.css("vertical-align", valign);
    children.css("margin-left", left).css("margin-top", top);
    children.eq(0).css("margin-left", "").css("margin-top", "");

    if (orientation) {
      children.css("display", display);
    }
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

// 2019-06-14
// container
(function (frontend) {
  if (frontend && VRender.Component.ui.container) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UIContainer = UI.container = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIContainer = UIContainer.prototype = new UI._base(false);

  _UIContainer.init = function (target, options) {
    UI._base.init.call(this, target, options);
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-container");
    var styles = this.options && this.options.styles || {};

    var rem = this._isRenderAsRem();

    setCss(target, "display", styles.display);
    setCss(target, "position", styles.position);
    setCss(target, "padding", styles.padding, rem);
    setCss(target, "padding-left", styles.paddingLeft, rem);
    setCss(target, "padding-right", styles.paddingRight, rem);
    setCss(target, "padding-top", styles.paddingTop, rem);
    setCss(target, "padding-bottom", styles.paddingBottom, rem);
    setCss(target, "margin", styles.margin, rem);
    setCss(target, "margin-left", styles.marginLeft, rem);
    setCss(target, "margin-right", styles.marginRight, rem);
    setCss(target, "margin-top", styles.marginTop, rem);
    setCss(target, "margin-bottom", styles.marginBottom, rem);
    setCss(target, "border", styles.border, rem);
    setCss(target, "border-radius", styles.borderRadius, rem);
    setCss(target, "border-color", styles.borderColor);
    setCss(target, "border-width", styles.borderWidth, rem);
    setCss(target, "border-left", styles.borderLeft, rem);
    setCss(target, "border-right", styles.borderRight, rem);
    setCss(target, "border-top", styles.borderTop, rem);
    setCss(target, "border-bottom", styles.borderBottom, rem);
    setCss(target, "background", styles.bg || styles.background);
    setCss(target, "background-color", styles.bgcolor || styles.backgroundColor);
    setCss(target, "background-image", styles.image || styles.backgroundImage);
    setCss(target, "background-size", styles.backgroundSize);
    setCss(target, "background-position", styles.backgroundPosition);
    setCss(target, "background-repeat", styles.backgroundRepeat);
    setCss(target, "width", styles.width, rem);
    setCss(target, "min-width", styles.minWidth, rem);
    setCss(target, "max-width", styles.maxWidth, rem);
    setCss(target, "height", styles.height, rem);
    setCss(target, "min-height", styles.minHeight, rem);
    setCss(target, "max-height", styles.maxHeight, rem);
    setCss(target, "overflow", styles.overflow);
    setCss(target, "color", styles.color);
    setCss(target, "font-size", styles.fontSize, rem);
    setCss(target, "text-align", styles.align || styles.textAlign);
    setCss(target, "box-shadow", styles.shadow);
    var contentView = this.options.content || this.options.view;

    if (Utils.isNotBlank(contentView)) {
      if (Utils.isFunction(contentView.render)) contentView.render(target);else target.append(contentView.$el || contentView);
    }

    return this;
  }; ///////////////////////////////////////////////////////


  var setCss = function setCss(target, name, value, useREM) {
    if (Utils.isNotBlank(value)) {
      if (!isNaN(value)) {
        value = Utils.getFormatSize(value, useREM);
      }

      target.css(name, value);
    }
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIContainer = UIContainer;
    UI.init(".ui-container", UIContainer, Renderer);
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
  var Fn = UI.fn,
      Utils = UI.util; // 默认按钮样式

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
  }; // 使按钮等待（或取消等待），time为0时取消等待，小于0时无限等待


  _UIButton.waiting = function (time) {
    if (Utils.isNull(time) || time === true) time = parseInt(this.$el.attr("opt-wait")) || -1;else time = Math.max(0, parseInt(time)) || 0;
    doWaiting.call(this, time);
  };

  _UIButton.isWaiting = function () {
    return this.$el.is(".waiting");
  }; // 设置默认等待的毫秒数（非开启等待），小于0时无限等待


  _UIButton.setWaiting = function (value) {
    if (value === true || Utils.isNull(value)) value = -1;else value = Math.max(0, parseInt(value)) || 0;
    this.$el.attr("opt-wait", value);
  }; // ====================================================


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
  }; ///////////////////////////////////////////////////////


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
  };

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
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UICheckbox = UI.checkbox = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UICheckbox = UICheckbox.prototype = new UI._base(false);

  _UICheckbox.init = function (target, options) {
    UI._base.init.call(this, target, options);

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
  }; // ====================================================
  // 复选框状态变更事件


  var chkboxChangeHandler = function chkboxChangeHandler(e) {
    if ($(e.currentTarget).is(":checked")) this.$el.addClass("checked");else this.$el.removeClass("checked");
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

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


  if (frontend) {
    window.UICheckbox = UICheckbox;
    UI.init(".ui-chkbox", UICheckbox, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-06-10
// checkgroup
(function (frontend) {
  if (frontend && VRender.Component.ui.checkgroup) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UICheckGroup = UI.checkgroup = function (view, options) {
    return UI._select.call(this, view, options);
  };

  var _UICheckGroup = UICheckGroup.prototype = new UI._select(false);

  _UICheckGroup.init = function (target, options) {
    UI._select.init.call(this, target, options);

    this.$el.on("change", "input", selectedChangeHandler.bind(this));
  }; // ====================================================


  _UICheckGroup.setSelectedIndex = function (value) {
    var snapshoot = this._snapshoot();

    var indexs = Renderer.fn.getIntValues(value, 0) || [];
    Utils.each(this.$el.children(), function (item, i) {
      var chkbox = VRender.Component.get(item.children());
      chkbox.setChecked(indexs.indexOf(i) >= 0);
    });
    snapshoot.done();
  };

  _UICheckGroup.isMultiple = function () {
    return true;
  };

  _UICheckGroup.isDisabled = function (value) {
    if (typeof value == "number") {
      var chkbox = VRender.Component.get(this._getItemAt(value).children());
      return chkbox ? chkbox.isDisabled() : false;
    }

    if (typeof value == "string") {
      return this.isDisabled(this.getIndexByName(value));
    }

    return this.$el.is(".disabled");
  };

  _UICheckGroup.setDisabled = function (disabled, value) {
    if (typeof value == "string") {
      return this.setDisabled(disabled, this.getIndexByName(value));
    }

    if (typeof value == "number") {
      var chkbox = VRender.Component.get(this._getItemAt(value).children());
      chkbox && chkbox.setDisabled(disabled);
    } else {
      disabled = Utils.isNull(disabled) || Utils.isTrue(disabled) ? true : false;
      if (disabled) this.$el.addClass("disabled").attr("disabled", "disabled");else this.$el.removeClass("disabled").removeAttr("disabled");
    }
  }; // ====================================================


  _UICheckGroup._getItems = function () {
    return this.$el.children();
  };

  _UICheckGroup._getNewItem = function ($, itemContainer, data, index) {
    return getNewItem.call(this, $, itemContainer, data, index);
  };

  _UICheckGroup._renderItems = function ($, itemContainer, datas) {
    renderItems.call(this, $, itemContainer, datas);
  };

  _UICheckGroup._renderOneItem = function ($, item, data, index) {
    renderOneItem.call(this, $, item, data, index);
  }; // ====================================================


  var selectedChangeHandler = function selectedChangeHandler(e) {
    e.stopPropagation();

    var snapshoot = this._snapshoot();

    var indexs = [];
    Utils.each(this.$el.find("input"), function (input, i) {
      if (input.is(":checked")) indexs.push(i);
    });

    UI._select.setSelectedIndex.call(this, indexs);

    snapshoot.done();
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._selectRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._selectRender(false);

  _Renderer.render = function ($, target) {
    UI._selectRender.render.call(this, $, target);

    target.addClass("ui-chkgrp");
    return this;
  };

  _Renderer.renderSelection = function ($, target) {
    var indexs = this.getSelectedIndex(true);
    if (indexs) target.attr("data-inds", indexs.join(","));
    var ids = this.getSelectedKey(true);
    if (ids) target.attr("data-ids", ids.join(","));
  }; // ====================================================


  _Renderer.isMultiple = function () {
    return true;
  }; // ====================================================


  _Renderer._renderItems = function ($, target) {
    var itemContainer = this._getItemContainer($, target);

    if (itemContainer) {
      renderItems.call(this, $, itemContainer);
    }
  };

  _Renderer._renderOneItem = function ($, item, data, index) {
    renderOneItem.call(this, $, item, data, index);
  };

  _Renderer._getNewItem = function ($, target) {
    return getNewItem.call(this, $, target);
  };

  _Renderer._renderEmptyView = function () {// do nothing
  };

  _Renderer._renderLoadView = function () {// do nothing
  }; // ====================================================


  var renderItems = function renderItems($, itemContainer, datas) {
    this._cache_selected_indexs = this.getSelectedIndex(true);
    this._cache_selected_ids = this.getSelectedKey(true) || [];

    UI._itemsRender.renderItems.call(this, $, itemContainer, datas);

    delete this._cache_selected_indexs;
    delete this._cache_selected_ids;
  };

  var renderOneItem = function renderOneItem($, item, data, index) {
    if (typeof data == "string") data = {
      label: data
    };
    var params = Utils.extend({}, data);
    params.value = this._getDataKey(data);
    params.label = this._getDataLabel(data, index);
    params.checked = this._isSelected(data, index, this._cache_selected_indexs, this._cache_selected_ids);

    if (!frontend) {
      var UICheckbox = require("../checkbox/index");

      return new UICheckbox(this.context, params).render(item);
    } else {
      params.target = item;
      return UI.checkbox.create(params);
    }
  }; ///////////////////////////////////////////////////////


  var getNewItem = function getNewItem($, target) {
    return $("<div class='item'></div>").appendTo(target);
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UICheckGroup = UICheckGroup;
    UI.init(".ui-chkgrp", UICheckGroup, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-06-06
// radiobox
(function (frontend) {
  if (frontend && VRender.Component.ui.radiobox) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Utils = UI.util; ///////////////////////////////////////////////////////

  var UIRadiobox = UI.radiobox = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIRadiobox = UIRadiobox.prototype = new UI._base(false);

  _UIRadiobox.init = function (target, options) {
    UI._base.init.call(this, target, options);

    this.input = this.$el.children("input");
    this.input.on("change", radboxChangeHandler.bind(this));
    if (this.input.is(":checked")) this.input.trigger("change");
  }; // ====================================================


  _UIRadiobox.val = function (value) {
    if (Utils.isNotBlank(value)) {
      this.input.val(value);
    }

    return this.input.val();
  };

  _UIRadiobox.isChecked = function () {
    return this.input.is(":checked");
  };

  _UIRadiobox.setChecked = function (bool) {
    var checked = Utils.isNull(bool) ? true : Utils.isTrue(bool);

    if (this.isChecked() != checked) {
      this.input[0].checked = checked;
      this.input.trigger("change");
    }
  };

  _UIRadiobox.getLabel = function () {
    return this.$el.children("span").text();
  };

  _UIRadiobox.setLabel = function (value) {
    this.$el.children("span").remove();
    if (Utils.isNotBlank(value)) $("<span></span>").appendTo(this.$el).text(value);
  }; // ====================================================


  var radboxChangeHandler = function radboxChangeHandler(e) {
    var _isChecked = this.isChecked();

    if (_isChecked) {
      this.input.parent().addClass("checked");
      var name = this.input.attr("name");

      if (Utils.isNotBlank(name)) {
        var radios = $("input[name='" + name + "']").not(this.input);
        radios.parent().removeClass("checked");
      }
    } else {
      this.$el.removeClass("checked");
    }

    this.trigger("change");
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-radbox");
    var options = this.options || {};
    var input = $("<input type='radio'/>").appendTo(target);
    if (Utils.isNotNull(options.value)) input.val(options.value);

    if (Utils.isTrue(options.checked)) {
      target.addClass("checked");
      input.attr("checked", "checked");
    }

    if (Utils.isNotNull(options.label)) $("<span></span>").appendTo(target).text(options.label);
    input.attr("name", Utils.trimToNull(options.name));
    return this;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIRadiobox = UIRadiobox;
    UI.init(".ui-radbox", UIRadiobox, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-06-10
// radiogroup
(function (frontend) {
  if (frontend && VRender.Component.ui.radiogroup) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util;
  var globleGroupID = Date.now(); ///////////////////////////////////////////////////////

  var UIRadioGroup = UI.checkgroup = function (view, options) {
    return UI._select.call(this, view, options);
  };

  var _UIRadioGroup = UIRadioGroup.prototype = new UI._select(false);

  _UIRadioGroup.init = function (target, options) {
    UI._select.init.call(this, target, options);

    this.$el.on("change", "input", selectedChangeHandler.bind(this));
  }; // ====================================================


  _UIRadioGroup.setSelectedIndex = function (value) {
    var snapshoot = this._snapshoot();

    var items = this.$el.children();
    var index = Utils.getIndexValue(value);

    if (index >= 0) {
      VRender.Component.get(items.eq(index).children()).setChecked(true);
    } else {
      var selectedIndex = snapshoot.getState().selectedIndex;
      if (selectedIndex >= 0) VRender.Component.get(items.eq(selectedIndex).children()).setChecked(false);
    }

    snapshoot.done();
  };

  _UIRadioGroup.isMultiple = function () {
    return false;
  };

  _UIRadioGroup.isDisabled = function (value) {
    if (typeof value == "number") {
      var radbox = VRender.Component.get(this._getItemAt(value).children());
      return radbox ? radbox.isDisabled() : false;
    }

    if (typeof value == "string") {
      return this.isDisabled(this.getIndexByName(value));
    }

    return this.$el.is(".disabled");
  };

  _UIRadioGroup.setDisabled = function (disabled, value) {
    if (typeof value == "string") {
      return this.setDisabled(disabled, this.getIndexByName(value));
    }

    if (typeof value == "number") {
      var radbox = VRender.Component.get(this._getItemAt(value).children());
      radbox && radbox.setDisabled(disabled);
    } else {
      disabled = Utils.isNull(disabled) || Utils.isTrue(disabled) ? true : false;
      if (disabled) this.$el.addClass("disabled").attr("disabled", "disabled");else this.$el.removeClass("disabled").removeAttr("disabled");
    }
  }; // ====================================================


  _UIRadioGroup._getRadioName = function () {
    return this.getViewId();
  };

  _UIRadioGroup._getItems = function () {
    return this.$el.children();
  };

  _UIRadioGroup._getNewItem = function ($, itemContainer, data, index) {
    return getNewItem.call(this, $, itemContainer, data, index);
  };

  _UIRadioGroup._renderItems = function ($, itemContainer, datas) {
    renderItems.call(this, $, itemContainer, datas);
  };

  _UIRadioGroup._renderOneItem = function ($, item, data, index) {
    renderOneItem.call(this, $, item, data, index);
  }; // ====================================================


  var selectedChangeHandler = function selectedChangeHandler(e) {
    e.stopPropagation();

    var snapshoot = this._snapshoot();

    var index = Utils.index(this.$el.find("input"), function (input) {
      return input.is(":checked");
    });

    UI._select.setSelectedIndex.call(this, index);

    snapshoot.done();
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._selectRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._selectRender(false);

  _Renderer.render = function ($, target) {
    this.radioGroupId = "rad-" + target.attr("vid");

    UI._selectRender.render.call(this, $, target);

    target.addClass("ui-radgrp");
    return this;
  };

  _Renderer.renderSelection = function ($, target) {
    var indexs = this.getSelectedIndex(true);
    if (indexs) target.attr("data-inds", indexs.join(","));
    var ids = this.getSelectedKey(true);
    if (ids) target.attr("data-ids", ids.join(","));
  };

  _Renderer.isMultiple = function () {
    return false;
  }; // ====================================================


  _Renderer._getRadioName = function () {
    return this.radioGroupId;
  };

  _Renderer._renderItems = function ($, target) {
    var itemContainer = this._getItemContainer($, target);

    if (itemContainer) {
      renderItems.call(this, $, itemContainer);
    }
  };

  _Renderer._renderOneItem = function ($, item, data, index) {
    renderOneItem.call(this, $, item, data, index);
  };

  _Renderer._getNewItem = function ($, target) {
    return getNewItem.call(this, $, target);
  };

  _Renderer._renderEmptyView = function () {// do nothing
  };

  _Renderer._renderLoadView = function () {// do nothing
  }; // ====================================================


  var renderItems = function renderItems($, itemContainer, datas) {
    this._cache_selected_indexs = this.getSelectedIndex(true);
    this._cache_selected_ids = this.getSelectedKey(true) || [];

    UI._itemsRender.renderItems.call(this, $, itemContainer, datas);

    delete this._cache_selected_indexs;
    delete this._cache_selected_ids;
  };

  var renderOneItem = function renderOneItem($, item, data, index) {
    if (Utils.isPrimitive(data)) data = {
      label: data
    };
    var params = Utils.extend({}, data);
    params.name = this._getRadioName();
    params.value = this._getDataKey(data);
    params.label = this._getDataLabel(data, index);
    params.checked = this._isSelected(data, index, this._cache_selected_indexs, this._cache_selected_ids);

    if (!frontend) {
      var UIRadiobox = require("../radiobox/index");

      return new UIRadiobox(this.context, params).render(item);
    } else {
      params.target = item;
      return UI.radiobox.create(params);
    }
  }; ///////////////////////////////////////////////////////


  var getNewItem = function getNewItem($, target) {
    return $("<div class='item'></div>").appendTo(target);
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIRadioGroup = UIRadioGroup;
    UI.init(".ui-radgrp", UIRadioGroup, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-06-06
// input(原textview)
(function (frontend) {
  if (frontend && VRender.Component.ui.input) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UIInput = UI.input = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIInput = UIInput.prototype = new UI._base(false);

  _UIInput.init = function (target, options) {
    UI._base.init.call(this, target, options);

    this.inputTag = this.$el.children(".ipt");
    this.input = this.inputTag.find("input, textarea");
    this.input.on("focusin", onFocusInHandler.bind(this));
    this.input.on("focusout", onFocusOutHandler.bind(this));
    this.input.on("keydown", onKeyDownHandler.bind(this));
    this.input.on("keyup", onKeyUpHandler.bind(this));
    this.input.on("change", function (e) {
      return false;
    });
    this.$el.on("tap", ".clear", clearBtnClickHandler.bind(this));

    if (!this._isRenderAsApp()) {
      this.inputTag.on("mouseenter", onMouseEnterHandler.bind(this));
      this.inputTag.on("mouseleave", onMouseLeaveHandler.bind(this));
    }

    if (this.$el.attr("opt-pwd") == 1) this.setDisplayAsPassword(true);

    if (this.isAutoHeight()) {
      tryAutoSize.call(this, this.getValue());
    }
  }; // ====================================================


  _UIInput.val = function (value) {
    if (Utils.isNull(value)) {
      return this.getValue();
    }

    this.setValue(value);
    return this;
  };

  _UIInput.focus = function () {
    this.input.focus();
    return this;
  };

  _UIInput.select = function () {
    this.input.select();
    return this;
  };

  _UIInput.validate = function (callback) {
    var _this = this;

    var value = this.getValue();

    if (value.length == 0) {
      if (this.isRequired()) setErrorMsg.call(this, this.getEmptyMsg() || "输入框不能为空");else clearErrorMsg.call(this);

      if (Utils.isFunction(callback)) {
        callback(this.lastErrorMsg);
      }
    } else {
      doValidate.call(this, value, function () {
        if (Utils.isFunction(callback)) {
          callback(_this.lastErrorMsg);
        }
      });
    }
  }; // ====================================================


  _UIInput.getValue = function () {
    return this.input.val() || "";
  };

  _UIInput.setValue = function (value) {
    value = Utils.trimToEmpty(value);
    this.input.val(value);
    clearErrorMsg.call(this);
    valueChanged.call(this, value);
    tryAutoSize.call(this, value);
  };

  _UIInput.getPrompt = function () {
    return this.inputTag.find(".prompt").text();
  };

  _UIInput.setPrompt = function (value) {
    this.inputTag.find(".prompt").remove();

    if (Utils.isNotBlank(value)) {
      $("<span class='prompt'></span>").appendTo(this.inputTag).text(value);
    }
  };

  _UIInput.getPlaceholder = function () {
    return this.getPrompt();
  };

  _UIInput.setPlaceholder = function (value) {
    this.setPrompt(value);
  };

  _UIInput.getTips = function () {
    return this.inputTag.find(".tips").text();
  };

  _UIInput.setTips = function (value) {
    this.inputTag.find(".tips").remove();

    if (Utils.isNotBlank(value)) {
      $("<span class='tips'></span>").appendTo(this.inputTag).html(value);
    }
  };

  _UIInput.getDescription = function () {
    return this.$el.children(".desc").text();
  };

  _UIInput.setDescription = function (value) {
    this.$el.children(".desc").remove();

    if (Utils.isNotBlank(value)) {
      $("<div class='desc'></div>").appendTo(this.$el).html(value);
    }
  };

  _UIInput.getDataType = function () {
    return this.$el.attr("opt-type") || "text";
  };

  _UIInput.setDataType = function (value) {
    if (/^(number|num|int)$/.test(value)) value = "_number";
    this.$el.attr("opt-type", value);
    if (/^(email|password|tel|url|number)$/.test(value)) this.input.attr("type", value);else this.input.removeAttr("type");
  };

  _UIInput.isReadonly = function () {
    return this.$el.attr("opt-readonly") == 1;
  };

  _UIInput.setReadonly = function (value) {
    if (Utils.isNull(value) || Utils.isTrue(value)) {
      this.$el.attr("opt-readonly", "1");
      this.input.attr("readonly", "readonly");
    } else {
      this.$el.removeAttr("opt-readonly");
      this.input.removeAttr("readonly");
    }
  };

  _UIInput.isRequired = function () {
    return this.$el.attr("opt-required") == 1;
  };

  _UIInput.setRequired = function (value) {
    if (Utils.isNull(value) || Utils.isTrue(value)) {
      this.$el.attr("opt-required", "1");
    } else {
      this.$el.removeAttr("opt-required");
    }
  };

  _UIInput.getEmptyMsg = function () {
    return this.$el.attr("opt-empty");
  };

  _UIInput.setEmptyMsg = function (value) {
    if (Utils.isBlank(value)) this.$el.removeAttr("opt-empty");else this.$el.attr("opt-empty", value);
  };

  _UIInput.getErrorMsg = function () {
    return this.$el.attr("opt-errmsg");
  };

  _UIInput.setErrorMsg = function (value) {
    if (Utils.isBlank(value)) this.$el.removeAttr("opt-errmsg");else this.$el.attr("opt-errmsg", value);
  };

  _UIInput.getMaxSize = function () {
    if (this.hasOwnProperty("maxSize")) return this.maxSize;
    this.maxSize = parseInt(this.$el.attr("opt-size")) || 0;
    return this.maxSize;
  };

  _UIInput.setMaxSize = function (value) {
    this.maxSize = parseInt(value) || 0;
    this.$el.attr("opt-size", this.maxSize);

    if (this.maxSize > 0) {
      this.$el.addClass("show-size");
      this.inputTag.find(".size").remove();
      var text = this.getValue() || "";
      $("<span class='size'></span>").appendTo(this.inputTag).text(text.length + "/" + this.maxSize);
    } else {
      this.$el.removeClass("show-size");
      this.inputTag.find(".size").remove();
    }
  };

  _UIInput.getValidate = function () {
    return Fn.getFunction.call(this, "_validate", "validate");
  };

  _UIInput.setValidate = function (value) {
    this.options._validate = value;
    this.$el.children(".ui-fn[name='validate']").remove();
  };

  _UIInput.hasError = function () {
    return this.$el.is(".is-error");
  };

  _UIInput.showError = function (errmsg) {
    if (errmsg === true) {
      errmsg = this.lastErrorMsg || this.$el.attr("opt-errmsg") || "内容不正确！";
    }

    if (errmsg) setErrorMsg.call(this, errmsg);else clearErrorMsg.call(this);
  };

  _UIInput.getDecimals = function () {
    var decimals = parseFloat(this.$el.attr("opt-decimal"));
    return isNaN(decimals) || decimals < 0 ? -1 : decimals;
  };

  _UIInput.setDecimals = function (value) {
    if (isNaN(value)) value = 2;else value = parseInt(value) || 0;
    this.$el.attr("opt-decimal", value);
  };

  _UIInput.isMultiline = function () {
    return this.$el.is(".multi");
  };

  _UIInput.isAutoHeight = function () {
    return this.$el.attr("opt-autoheight") == 1;
  };

  _UIInput.isDisplayAsPassword = function () {
    return this.$el.attr("opt-pwd") == 1;
  };

  _UIInput.setDisplayAsPassword = function (value) {
    var style = window.getComputedStyle(this.input[0]);

    if (Utils.isNull(value) || Utils.isTrue(value)) {
      this.$el.attr("opt-pwd", "1");
      if (!style.webkitTextSecurity) this.input.attr("type", "password");
    } else {
      this.$el.removeAttr("opt-pwd");
      if (this.input.attr("type") == "password") this.input.attr("type", "text");
    }
  }; // ====================================================


  var onKeyDownHandler = function onKeyDownHandler(e) {
    clearErrorMsg.call(this);
    var text = this.input.val() || "";

    if (!Utils.isControlKey(e)) {
      var type = this.getDataType();

      if (type == "_number" || type == "number" || type == "num") {
        if (!isNumberKeyEnable(e, text)) return false;
        if (e.key == "." && this.getDecimals() == 0) return false;
      } else if (type == "tel" || type == "mobile" || type == "phone") {
        if (!/[0-9]|\-/.test(e.key)) return false;
        if (e.key == "-" && type == "mobile") return false;
      } else if (type == "text") {
        var maxSize = this.getMaxSize();
        if (maxSize > 0 && text.length >= maxSize) return false;
      }
    }

    valueChanged.call(this, text);
    tryAutoSize.call(this, text + (e.which == 13 ? "\n" : ""));
  };

  var onKeyUpHandler = function onKeyUpHandler(e) {
    var value = this.input.val() || "",
        text = value;

    if (e.which === 13) {
      if (text.length === 0) {
        if (this.isRequired()) setErrorMsg.call(this, this.getEmptyMsg() || "输入框不能为空");
      } else {
        doValidate.call(this, text);
      }

      this.trigger("enter", text);
      this.$el.trigger("enter", text);
    } else {
      var type = this.getDataType();
      if (type == "_number" || type == "number" || type == "num") text = value.replace(/[^0-9\.\-]/g, "");else if (type == "tel" || type == "mobile" || type == "phone") text = value.replace(/[^0-9\-]/g, "");
      if (text != value) this.input.val(text);
      valueChanged.call(this, text);
    }

    tryAutoSize.call(this, text);
  };

  var onFocusInHandler = function onFocusInHandler(e) {
    var _this2 = this;

    this.$el.addClass("focus");
    var lastValue = this.input.val();
    this.t_focus = setInterval(function () {
      var value = _this2.input.val();

      if (value != lastValue) {
        lastValue = value;
        valueChanged.call(_this2, value);

        _this2.trigger("change", value);

        _this2.$el.trigger("change", value);
      }
    }, 100);
  };

  var onFocusOutHandler = function onFocusOutHandler(e) {
    this.$el.removeClass("focus");
    var text = this.input.val() || "";

    if (text.length === 0) {
      if (this.isRequired()) setErrorMsg.call(this, this.getEmptyMsg() || "输入框不能为空");
    } else {
      var type = this.getDataType();

      if (type == "_number" || type == "number" || type == "num") {
        var value = parseFloat(text);

        if (!isNaN(value)) {
          var decimals = this.getDecimals();
          if (decimals >= 0) this.input.val(value.toFixed(decimals));else this.input.val(value.toFixed(10).replace(/\.?0+$/, ""));
          text = this.input.val();
        }
      }

      doValidate.call(this, text);
    }

    if (this.t_focus) {
      var timer = this.t_focus;
      this.t_focus = null;
      setTimeout(function () {
        clearInterval(timer);
      }, 100);
    }
  };

  var onMouseEnterHandler = function onMouseEnterHandler(e) {
    if (this.hasError()) {
      if (this.t_hideerror) {
        clearTimeout(this.t_hideerror);
        this.t_hideerror = null;
      }

      this.$el.find(".errmsg").removeClass("animate-out");
    }
  };

  var onMouseLeaveHandler = function onMouseLeaveHandler(e) {
    var _this3 = this;

    if (this.hasError()) {
      if (!this.t_hideerror) {
        this.t_hideerror = setTimeout(function () {
          _this3.t_hideerror = null;

          _this3.$el.find(".errmsg").addClass("animate-out");
        }, 3000);
      }
    }
  };

  var clearBtnClickHandler = function clearBtnClickHandler(e) {
    var _this4 = this;

    this.val("");
    this.trigger("change", "");
    this.$el.trigger("change", "");
    this.trigger("clear");
    this.$el.trigger("clear");
    setTimeout(function () {
      _this4.input.focus();
    });
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-input");
    var options = this.options || {};
    var ipt = $("<div class='ipt'></div>").appendTo(target);
    var input = renderInput.call(this, $, target, ipt);
    var width = Utils.getFormatSize(options.width, this._isRenderAsRem());
    if (width) target.attr("opt-fixed", "1").css("width", width);

    if (Utils.isTrue(options.readonly)) {
      target.attr("opt-readonly", "1");
      input.attr("readonly", "readonly");
    }

    if (Utils.isTrue(options.required)) target.attr("opt-required", "1");
    if (this.isDisplayAsPassword()) target.attr("opt-pwd", "1");
    var maxSize = parseInt(options.maxSize) || 0;

    if (maxSize > 0) {
      target.addClass("show-size").attr("opt-size", maxSize);
      var len = Utils.trimToEmpty(input.val()).length;
      $("<span class='size'></span>").appendTo(ipt).text(len + "/" + maxSize);
    }

    if (Utils.isNotBlank(options.prompt)) $("<span class='prompt'></span>").appendTo(ipt).text(options.prompt);else if (Utils.isNotBlank(options.placeholder)) $("<span class='prompt'></span>").appendTo(ipt).text(options.placeholder);
    if (Utils.isNotBlank(options.tips)) $("<span class='tips'></span>").appendTo(ipt).html(options.tips);
    var description = options.description || options.desc;
    if (Utils.isNotBlank(description)) $("<div class='desc'></div>").appendTo(target).html(description);
    renderErrorMsg.call(this, $, target);
    if (Utils.isTrue(options.autoHeight) && this.isMultiline()) renderAsAutoHeight.call(this, $, target, input);
    return this;
  }; // ====================================================


  _Renderer.getDecimals = function () {
    if (this.isDisplayAsPassword()) return 0;
    var options = this.options || {};
    var type = options.dataType || options.type;
    if (type === "int") return 0;
    if (options.hasOwnProperty("decimals")) return parseInt(options.decimals) || 0;
    return 2;
  };

  _Renderer.isDisplayAsPassword = function () {
    return Utils.isTrue(this.options.displayAsPwd);
  };

  _Renderer.isMultiline = function () {
    var options = this.options || {};
    if (options.hasOwnProperty("multiple")) return Utils.isTrue(options.multiple);
    return Utils.isTrue(options.multi);
  }; // ====================================================


  var renderInput = function renderInput($, target, parent) {
    var options = this.options || {};
    var multiple = this.isMultiline();
    var input = multiple ? "<textarea></textarea>" : "<input type='text'/>";
    input = $(input).appendTo(parent);
    if (multiple) target.addClass("multi");else parent.append("<span class='clear'></span>");
    var iptValue = options.value;
    var type = options.dataType || options.type;

    if (Utils.isNotBlank(type)) {
      if (/^(number|num|int)$/.test(type)) type = "_number";
      if (/^(email|password|tel|url|number)$/.test(type)) input.attr("type", type); // 标准类型添加“type”属性

      target.attr("opt-type", type);

      if (type == "_number") {
        var decimals = this.getDecimals(); // 保留小数点，只有数字类型有效

        target.attr("opt-decimal", decimals);
        var minValue = parseFloat(options.min);
        var maxValue = parseFloat(options.max);
        if (!isNaN(minValue)) target.attr("opt-min", minValue);
        if (!isNaN(maxValue)) target.attr("opt-max", maxValue);

        if (Utils.isNotBlank(iptValue)) {
          iptValue = parseFloat(iptValue);

          if (isNaN(iptValue)) {
            iptValue = "";
          } else {
            if (!isNaN(minValue) && iptValue < minValue) iptValue = minValue;
            if (!isNaN(maxValue) && iptValue > maxValue) iptValue = maxValue;
            if (decimals >= 0) iptValue = iptValue.toFixed(decimals);else iptValue = iptValue.toFixed(10).replace(/\.?0+$/, "");
          }
        }
      }
    }

    if (Utils.isNotBlank(iptValue)) {
      input.val(iptValue);
      target.addClass("has-val");
    }

    return input;
  };

  var renderErrorMsg = function renderErrorMsg($, target) {
    if (Utils.isNotBlank(this.options.empty)) target.attr("opt-empty", this.options.empty);
    if (Utils.isNotBlank(this.options.errmsg)) target.attr("opt-errmsg", this.options.errmsg);
    Fn.renderFunction(target, "validate", this.options.validate);
  };

  var renderAsAutoHeight = function renderAsAutoHeight($, target, input) {
    target.attr("opt-autoheight", "1");
    target = target.children(".ipt");
    target.append("<div class='preview'><pre></pre></div>");
    target.find("pre").text(input.val());
    var options = this.options || {};

    var renderAsRem = this._isRenderAsRem();

    var minHeight = Utils.getFormatSize(options.minHeight, renderAsRem);
    var maxHeight = Utils.getFormatSize(options.maxHeight, renderAsRem);

    if (minHeight) {
      input.css("minHeight", minHeight);
    }

    if (maxHeight) {
      input.css("maxHeight", maxHeight);
    }
  }; ///////////////////////////////////////////////////////


  var doValidate = function doValidate(value, callback) {
    var _this5 = this;

    var validateHandler = this.getValidate();
    var defaultErrorMsg = this.getErrorMsg();

    if (Utils.isFunction(validateHandler)) {
      var validateResult = function validateResult(_result) {
        if (_result === true) setErrorMsg.call(_this5, defaultErrorMsg || "内容不正确！");else if (_result === false) clearErrorMsg.call(_this5);else if (_result) setErrorMsg.call(_this5, _result);else clearErrorMsg.call(_this5);

        if (Utils.isFunction(callback)) {
          setTimeout(callback, 0);
        }
      };

      var result = validateHandler(this, value, validateResult);
      if (Utils.isNotNull(result)) validateResult(result);
    } else {
      var type = this.getDataType();

      if (type == "_number" || type == "number" || type == "num") {
        if (isNaN(value)) {
          setErrorMsg.call(this, defaultErrorMsg || "数据格式不正确");
        } else {
          var val = parseFloat(value);
          var min = parseFloat(this.$el.attr("opt-min"));
          if (!isNaN(min) && min > val) setErrorMsg.call(this, defaultErrorMsg || "数据不正确，请输入大于等于" + min + "的值");
          var max = parseFloat(this.$el.attr("opt-max"));
          if (!isNaN(max) && max < val) setErrorMsg.call(this, defaultErrorMsg || "数据不正确，请输入小于等于" + max + "的值");
        }
      } else if (type == "tel") {
        if (!Utils.isMobile(value) || !Utils.isPhone(value)) setErrorMsg.call(this, defaultErrorMsg || "手机或电话号码不正确");
      } else if (type == "text") {
        var maxSize = this.getMaxSize();
        if (maxSize > 0 && maxSize < value.length) setErrorMsg.call(this, defaultErrorMsg || "输入内容太长，允许最大长度为：" + maxSize);
      } else if (type == "email") {
        if (!Utils.isEmail(value)) setErrorMsg.call(this, defaultErrorMsg || "电子邮箱格式不正确，请重新输入");
      } else if (type == "mobile") {
        if (!Utils.isMobile(value)) setErrorMsg.call(this, defaultErrorMsg || "手机号码不正确，必须是1开头的11位数字");
      } else if (type == "phone") {
        if (!Utils.isPhone(value)) setErrorMsg.call(this, defaultErrorMsg || "电话号码不正确");
      } else if (type == "url") {
        if (!Utils.isUrl(value)) setErrorMsg.call(this, defaultErrorMsg || "url格式不正确");
      }

      if (Utils.isFunction(callback)) {
        setTimeout(callback, 0);
      }
    }
  };

  var valueChanged = function valueChanged(text) {
    if (text && text.length > 0) this.$el.addClass("has-val");else this.$el.removeClass("has-val");

    if (this.$el.is(".show-size")) {
      var maxSize = this.getMaxSize();
      if (maxSize > 0) this.inputTag.find(".size").text(text.length + "/" + maxSize);
    }
  };

  var tryAutoSize = function tryAutoSize(text) {
    console.log(text);

    if (this.isAutoHeight()) {
      var preview = this.inputTag.find(".preview pre");

      if (preview && preview.length > 0) {
        text = text ? text.replace(/\n$/, "\n.") : "";
        preview.text(text);
      }

      var input = this.input.get(0);
      var minHeight = Utils.toPx(this._isRenderAsRem() ? "0.32rem" : "32px");

      var setInner = function setInner() {
        var height = preview[0].scrollHeight;
        height = Math.max(height, minHeight) + 2;
        input.style.height = height + "px";
      };

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(setInner);
      } else {
        setTimeout(setInner, 0);
      }
    }
  };

  var setErrorMsg = function setErrorMsg(errmsg) {
    var _this6 = this;

    this.lastErrorMsg = errmsg;
    var target = this.$el.find(".errmsg");

    if (!target || target.length == 0) {
      target = $("<div class='errmsg'></div>").appendTo(this.$el);
      target.insertAfter(this.inputTag);
      if (!this._isRenderAsApp()) target.css("top", this.inputTag.height() + 8);
    }

    target.html(errmsg);
    this.$el.addClass("is-error");
    target.removeClass("animate-in").removeClass("animate-out");
    setTimeout(function () {
      target.addClass("animate-in");
    }, 0); // 3秒后隐藏

    if (!this._isRenderAsApp()) {
      if (this.t_hideerror) {
        clearTimeout(this.t_hideerror);
      }

      this.t_hideerror = setTimeout(function () {
        _this6.t_hideerror = null;
        target.addClass("animate-out");
      }, 3000);
    }
  };

  var clearErrorMsg = function clearErrorMsg() {
    var _this7 = this;

    this.lastErrorMsg = null;

    if (this.hasError()) {
      var target = this.$el.find(".errmsg").addClass("animate-out");
      setTimeout(function () {
        _this7.$el.removeClass("is-error");

        target.removeClass("animate-in").removeClass("animate-out");
      }, 300);
    }
  };

  var isNumberKeyEnable = function isNumberKeyEnable(e, text) {
    if (/[0-9]/.test(e.key)) return true;
    if (e.key == "-") return !/\-/.test(text) && text.length == 0;
    if (e.key == ".") return !/\./.test(text) && text.length > 0;
    return false;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIInput = UIInput;
    UI.init(".ui-input", UIInput, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-05-29
// select(原combobox)
(function (frontend) {
  if (frontend && VRender.Component.ui.select) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UISelect = UI.select = function (view, options) {
    return UI._select.call(this, view, options);
  };

  var _UISelect = UISelect.prototype = new UI._select(false);

  _UISelect.init = function (target, options) {
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


  _UISelect.val = function (value) {
    if (Utils.isNull(value)) {
      var selectedIndex = this.getSelectedIndex(true);

      if (selectedIndex && selectedIndex.length > 0) {
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

  _UISelect.getData = function (original) {
    if (original) {
      this.options.data = this._doAdapter(this.options.data);
      return this.options.data;
    }

    return getDataFlat.call(this);
  }; // 修改数据，


  _UISelect.setDataSilent = function (value) {
    this.options.data = value;
    rerenderSilent.call(this);
  };

  _UISelect.setSelectedIndex = function (value) {
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

  _UISelect.getPrompt = function () {
    return this.$el.children(".ipt").find(".prompt").text();
  };

  _UISelect.setPrompt = function (value) {
    var target = this.$el.children(".ipt");
    target.find(".prompt").remove();

    if (Utils.isNotBlank(value)) {
      $("<span class='prompt'></span>").appendTo(target).text(value);
    }
  };

  _UISelect.getPlaceholder = function () {
    return this.getPrompt();
  };

  _UISelect.setPlaceholder = function (value) {
    this.setPrompt(value);
  }; // ====================================================


  _UISelect.addItem = function (data, index) {
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

  _UISelect.updateItem = function (data, index) {
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

  _UISelect.removeItemAt = function (index) {
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


  _UISelect.isNative = function () {
    return this.$el.attr("opt-native") == 1;
  };

  _UISelect.isEditable = function () {
    return this.$el.is(".editable");
  }; // 可输入的情况是否强制匹配项


  _UISelect.isMatchRequired = function () {
    return this.$el.attr("opt-match") == 1;
  };

  _UISelect.rerender = function () {
    var _this2 = this;

    Utils.debounce("select_render-" + this.getViewId(), function () {
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
  }; // ====================================================


  _UISelect._getItemContainer = function () {
    return this.$el.children(".dropdown").children(".box");
  };

  _UISelect._renderItems = function ($, itemContainer, datas) {
    datas = datas || this.getData(true);
    renderItems.call(this, $, this.$el, itemContainer, datas);
  };

  _UISelect._renderOneItem = function ($, item, data, index) {
    if (this._isRenderAsApp() && this.isNative()) {
      item.text(this._getDataLabel(data, index));
    } else {
      UI._items.renderOneItem.call(this, item, null, data, index);
    }
  };

  _UISelect._getNewItem = function ($, itemContainer, data, index) {
    if (this._isRenderAsApp() && this.isNative()) {
      var select = itemContainer.children("select");
      return $("<option class='item'></option>").appendTo(select);
    } else {
      var group = itemContainer.children(".grp").last();
      if (!group || group.length == 0) group = $("<div class='grp'></div>").appendTo(itemContainer);
      return $("<div class='item'></div>").appendTo(group);
    }
  };

  _UISelect._getItems = function (selector) {
    var items = this._getItemContainer().find(".item");

    if (selector) items = items.filter(selector);
    return items;
  };

  _UISelect._isItemSelected = function (item) {
    return item.is(".selected") || item.is(":selected");
  };

  _UISelect._setItemSelected = function (item, beSelected) {
    setItemActive.call(this, item, beSelected);
  };

  _UISelect._loadBefore = function () {
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

  _UISelect._loadAfter = function () {
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


  _UISelect._snapshoot_shoot = function (state) {
    state.selectedIndex = this.getSelectedIndex();
    state.value = this.$el.find(".ipt > input").val() || "";
    state.data = this.getSelectedData();
  };

  _UISelect._snapshoot_compare = function (state) {
    var value = this.$el.find(".ipt > input").val() || "";
    if (state.value != value) return false;
    var selectedIndex = this.getSelectedIndex();
    return Fn.equalIndex(selectedIndex, state.selectedIndex);
  };

  _UISelect._doAdapter = function (datas) {
    return doAdapter.call(this, datas);
  }; // ====================================================


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

      if (isDropdownVisible.call(_this3)) {
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
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._selectRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._selectRender(false);

  _Renderer.render = function ($, target) {
    target.addClass("ui-select");
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

    var options = this.options || {};
    if (Utils.isTrue(options.editable)) target.addClass("editable");else input.attr("readonly", "readonly");
    ipttag.append("<button class='dropdownbtn'></button>");
    if (Utils.isNotBlank(options.prompt)) $("<span class='prompt'></span>").appendTo(ipttag).text(options.prompt);else if (Utils.isNotBlank(options.placeholder)) $("<span class='prompt'></span>").appendTo(ipttag).text(options.placeholder);
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

    Utils.debounce("select_silent-" + this.getViewId(), function () {
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
  }; ///////////////////////////////////////////////////////


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
    window.UISelect = UISelect;
    UI.init(".ui-select", UISelect, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-06-04
// datepicker
(function (frontend) {
  if (frontend && VRender.Component.ui.datepicker) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util;
  var cn_month = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
  var cn_week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]; ///////////////////////////////////////////////////////

  var UIDatePicker = UI.datepicker = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIDatePicker = UIDatePicker.prototype = new UI._base(false);

  _UIDatePicker.init = function (target, options) {
    UI._base.init.call(this, target, options);

    this.$el.on("tap", "header .title button", onSwitchBtnHandler.bind(this));
    this.$el.on("tap", "section td", onDateClickHandler.bind(this));
    this.$el.on("tap", "footer .okbtn", onSubmitBtnHandler.bind(this));
    this.$el.on("tap", "footer .cancelbtn", onCancelBtnHandler.bind(this));

    if (this._isRenderAsApp()) {
      this.$el.on("tap", function (e) {
        return false;
      });
      this.$el.on("tap", "header .today", onTodayBtnHandler.bind(this));
      this.$el.on("tap", "header .clear", onClearBtnHandler.bind(this));
      var tables = this.$el.children("section");
      tables.on("touchstart", touchSwipeHandler.bind(this));
      tables.on("touchmove", touchSwipeHandler.bind(this));
      tables.on("touchend", touchSwipeHandler.bind(this));
    }
  }; // ====================================================
  // 在修改的时候就要判断是否超出范围，所以这里不需要判断了


  _UIDatePicker.getDate = function (format) {
    if (this.isRangeDate()) {
      var start = Utils.toDate(this.$el.attr("data-start"));

      if (start) {
        var end = Utils.toDate(this.$el.attr("data-end")) || new Date(start.getTime());
        end = Utils.toDate(Utils.toDateString(end, "yyyy-MM-dd 23:59:59"));

        if (Utils.isNotBlank(format)) {
          start = Utils.toDateString(start, format);
          end = Utils.toDateString(end, format);
        }

        return [start, end];
      }
    } else {
      var date = Utils.toDate(this.$el.attr("data-dt"));
      if (date && Utils.isNotBlank(format)) return Utils.toDateString(date, format);
      return date;
    }

    return null;
  }; // setDate(new Date()), setDate("2018-01-01"), setDate("2018-01-01", "2018-01-31")


  _UIDatePicker.setDate = function (value) {
    var snapshoot = this._snapshoot();

    if (this.isRangeDate()) {
      var start = Utils.toDate(arguments[0]),
          end = null;

      if (start) {
        end = Utils.toDate(arguments[1]) || new Date(start.getTime());
        var tstart = getTime(start),
            tend = getTime(end);

        if (getTime(start) <= getTime(end)) {
          start = Utils.toDateString(start, "yyyy-MM-dd");
          end = Utils.toDateString(end, "yyyy-MM-dd");
        } else {
          start = end = null;
        }
      }

      this.$el.attr("data-start", start || "");
      this.$el.attr("data-end", end || "");
    } else {
      var date = Utils.toDate(value);
      this.$el.attr("data-dt", date ? Utils.toDateString(date, "yyyy-MM-dd") : "");
    }

    if (!snapshoot.compare()) this.rerender(this.getDate());
    snapshoot.done();
  };

  _UIDatePicker.getMinDate = function () {
    return Utils.toDate(this.$el.attr("opt-min"));
  };

  _UIDatePicker.setMinDate = function (value) {
    var min = Utils.toDate(value);

    if (getTime(min) != getTime(this.getMinDate())) {
      this.$el.attr("opt-min", min ? Utils.toDateString(min, "yyyy-MM-dd") : "");
      this.rerender();
    }
  };

  _UIDatePicker.getMaxDate = function () {
    return Utils.toDate(this.$el.attr("opt-max"));
  };

  _UIDatePicker.setMaxDate = function (value) {
    var max = Utils.toDate(value);

    if (getTime(max) != getTime(this.getMaxDate())) {
      this.$el.attr("opt-max", max ? Utils.toDateString(max, "yyyy-MM-dd") : "");
      this.rerender();
    }
  };

  _UIDatePicker.isRangeDate = function () {
    return this.$el.is(".is-range");
  };

  _UIDatePicker.submit = function () {
    onSubmitBtnHandler.call(this);
  };

  _UIDatePicker.cancel = function () {
    onCancelBtnHandler.call(this);
  };

  _UIDatePicker.rerender = function (pickerDate) {
    var _this = this;

    Utils.debounce("datepicker_render-" + this.getViewId(), function () {
      var selectedDate = _this.lastSelectedDate || _this.getDate();

      pickerDate = pickerDate || getCurrentPickerDate.call(_this);
      renderDate.call(_this, $, _this.$el, selectedDate, pickerDate);
    });
  }; // ====================================================


  _UIDatePicker._snapshoot_shoot = function (state, selectedDate) {
    state.selectedDate = selectedDate || this.getDate();
    state.pickerDate = getCurrentPickerDate.call(this);
    state.data = state.selectedDate;
  };

  _UIDatePicker._snapshoot_compare = function (state, selectedDate) {
    var date = selectedDate || this.getDate();

    if (date && state.selectedDate) {
      if (this.isRangeDate()) {
        return getTime(date[0]) == getTime(state.selectedDate[0]) && getTime(date[1]) == getTime(state.selectedDate[1]);
      }

      return getTime(date) == getTime(state.selectedDate);
    }

    return !(date || state.selectedDate);
  }; // ====================================================


  var onSwitchBtnHandler = function onSwitchBtnHandler(e) {
    var btn = $(e.currentTarget);
    var table = null;

    if (this.isRangeDate() && !this._isRenderAsApp()) {
      var title = btn.parent();
      if (title.is(".s")) table = this.$el.find(".table.s");else if (title.is(".e")) table = this.$el.find(".table.e");
    } else {
      table = this.$el.find(".table.t0");
    }

    var year = parseInt(table.attr("data-y"));
    var month = parseInt(table.attr("data-m"));
    var date = new Date(year, month, 1);

    if (btn.is(".y")) {
      date.setFullYear(year + (btn.is(".prev") ? -1 : 1));
    } else {
      date.setMonth(month + (btn.is(".prev") ? -1 : 1));
    }

    table.attr("data-y", date.getFullYear()).attr("data-m", date.getMonth());
    this.rerender();
  };

  var onDateClickHandler = function onDateClickHandler(e) {
    var item = $(e.currentTarget);
    if (item.is(".disabled")) return;

    if (this.isRangeDate()) {
      if (!this.selectedSnapshoot) this.selectedSnapshoot = this._snapshoot();

      if (this.lastSelectedDate && this.lastSelectedDate.length == 1) {
        // 第2次点击
        var end = Utils.toDate(item.attr("data-dt"));
        if (end.getTime() >= this.lastSelectedDate[0].getTime()) this.lastSelectedDate.push(end);else this.lastSelectedDate.unshift(end);
      } else {
        // 第1次点击
        this.lastSelectedDate = [];
        this.lastSelectedDate.push(Utils.toDate(item.attr("data-dt")));
      }

      this.rerender();
    } else {
      var snapshoot = this._snapshoot();

      this.$el.find("td.selected").removeClass("selected");
      item.addClass("selected");
      this.$el.attr("data-dt", item.attr("data-dt"));
      var date = Utils.toDate(item.attr("data-dt"));
      this.$el.find(".title .item .val").text(Utils.toDateString(date, "yyyy.MM.dd"));
      snapshoot.done();
    }
  }; // 确认选择


  var onSubmitBtnHandler = function onSubmitBtnHandler() {
    if (this.isRangeDate()) {
      if (this.lastSelectedDate && this.lastSelectedDate.length > 0) {
        var start = this.lastSelectedDate[0];
        var end = this.lastSelectedDate[1] || start;
        this.$el.attr("data-start", Utils.toDateString(start, "yyyy-MM-dd"));
        this.$el.attr("data-end", Utils.toDateString(end, "yyyy-MM-dd"));
        this.lastSelectedDate = null;
      }

      clearCurrentSnapshoot.call(this, true);
    }

    this.trigger("submit", this.getDate());
  }; // 取消选择


  var onCancelBtnHandler = function onCancelBtnHandler() {
    if (this.isRangeDate()) {
      this.lastSelectedDate = null;

      if (this.selectedSnapshoot) {
        var state = this.selectedSnapshoot.getState();
        clearCurrentSnapshoot.call(this);
        var selectedDate = state.selectedDate;
        var start = selectedDate && selectedDate[0];
        var end = selectedDate && selectedDate[1];
        this.$el.attr("data-start", start ? Utils.toDateString(start, "yyyy-MM-dd") : "");
        this.$el.attr("data-end", end ? Utils.toDateString(end, "yyyy-MM-dd") : "");
        this.rerender(state.pickerDate);
      } else {
        this.rerender();
      }
    }

    this.trigger("cancel", this.getDate());
  }; // 日历回到今天


  var onTodayBtnHandler = function onTodayBtnHandler() {
    this.rerender([new Date()]);
  }; // 清除选择


  var onClearBtnHandler = function onClearBtnHandler() {
    var snapshoot = this._snapshoot();

    if (this.isRangeDate()) {
      clearCurrentSnapshoot.call(this);
      this.$el.attr("data-start", "").attr("data-end", "");
    } else {
      this.$el.attr("data-dt", "");
    }

    this.rerender();
    snapshoot.done();
    this.trigger("clear");
  }; // 移到端滑动


  var touchSwipeHandler = function touchSwipeHandler(e) {
    // console.log(e);
    var touch = e.touches && e.touches[0];

    if (e.type == "touchstart") {
      this.touchData = {
        startX: touch.pageX,
        startY: touch.pageY
      };
      this.touchData.tableContainer = this.$el.find(".table.t0");
      this.touchData.mainTable = this.touchData.tableContainer.children("table.body");
    } else if (e.type == "touchmove") {
      if (e.touches.length > 1) return;
      var offset = touch.pageX - this.touchData.startX;

      if (!this.touchData.moving) {
        if (Math.abs(offset) < 10 || Math.abs(touch.pageY - this.touchData.startY) > 15) return;
      }

      this.touchData.moving = true; // this.touchData.endX = touch.pageX;

      this.touchData.lastOffset = offset;
      this.touchData.mainTable.css("transform", "translate(" + offset + "px,0px)");
      var table = offset > 0 ? this.touchData.prevTable : this.touchData.nextTable;

      if (!table) {
        var year = parseInt(this.touchData.tableContainer.attr("data-y"));
        var month = parseInt(this.touchData.tableContainer.attr("data-m"));
        table = createTable($, this.$el.children("section")).addClass("t1");

        if (offset > 0) {
          month -= 1;
          this.touchData.prevTable = table;
        } else {
          month += 1;
          this.touchData.nextTable = table;
        }

        var pickerDate = new Date(year, month, 1);
        var selectedDate = this.lastSelectedDate || this.getDate();
        renderPickerDate.call(this, $, this.$el, table, pickerDate, selectedDate);
      }

      if (!this.touchData.contentWidth) this.touchData.contentWidth = this.$el.children("section").width();
      offset += this.touchData.contentWidth * (offset > 0 ? -1 : 1);
      table.css("transform", "translate(" + offset + "px,0px)");
    } else if (e.type == "touchend") {
      if (this.touchData.moving) {
        var _offset = 0,
            delay = 200;
        if (Math.abs(this.touchData.lastOffset) > 20) _offset += this.touchData.contentWidth * (this.touchData.lastOffset > 0 ? 1 : -1);
        var transition = "transform " + delay + "ms";
        this.touchData.mainTable.css("transition", transition);
        this.touchData.mainTable.css("transform", "translate(" + _offset + "px,0px)");

        if (this.touchData.lastOffset > 0) {
          this.touchData.prevTable.css("transition", transition);
          this.touchData.prevTable.css("transform", "translate(0px,0px)");
        } else {
          this.touchData.nextTable.css("transition", transition);
          this.touchData.nextTable.css("transform", "translate(0px,0px)");
        }

        var touchData = this.touchData;

        if (Math.abs(touchData.lastOffset) > 20) {
          var button = touchData.lastOffset > 0 ? ".prev.m" : ".next.m";
          this.$el.children("header").find(button).eq(0).tap();
        }

        setTimeout(function () {
          if (touchData.prevTable) touchData.prevTable.remove();
          if (touchData.nextTable) touchData.nextTable.remove();
          touchData.mainTable.css("transition", "");
          touchData.mainTable.css("transform", "");
        }, delay);
      }
    }
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-datepicker");
    var options = this.options || {};
    var minDate = Utils.toDate(options.min);
    if (minDate) target.attr("opt-min", Utils.toDateString(minDate, "yyyy-MM-dd"));
    var maxDate = Utils.toDate(options.max);
    if (maxDate) target.attr("opt-max", Utils.toDateString(maxDate, "yyyy-MM-dd"));
    var date = getValidDate.call(this);

    if (this.isRangeDate()) {
      target.addClass("is-range");

      if (date) {
        target.attr("data-start", Utils.toDateString(date[0], "yyyy-MM-dd"));
        target.attr("data-end", Utils.toDateString(date[1], "yyyy-MM-dd"));
      }
    } else if (date) {
      target.attr("data-dt", Utils.toDateString(date, "yyyy-MM-dd"));
    }

    renderHeader.call(this, $, target);
    renderTables.call(this, $, target);
    renderFooter.call(this, $, target);
    renderDate.call(this, $, target, date);
    return this;
  }; // ====================================================


  _Renderer.getMinDate = function () {
    return Utils.toDate(this.options.min);
  };

  _Renderer.getMaxDate = function () {
    return Utils.toDate(this.options.max);
  };

  _Renderer.isRangeDate = function () {
    return Utils.isTrue(this.options.range);
  }; // ====================================================


  var renderHeader = function renderHeader($, target) {
    var header = $("<header></header>").appendTo(target);
    var title = $("<div class='title'></div>").appendTo(header);

    var addItem = function addItem() {
      var item = $("<dl class='item'></dl>").appendTo(title);
      item.append("<dt class='lbl'>-</dt><dd class='val'>-</dd>");
      item.append("<button class='prev y'>&nbsp;</button>");
      item.append("<button class='prev m'>&nbsp;</button>");
      item.append("<button class='next m'>&nbsp;</button>");
      item.append("<button class='next y'>&nbsp;</button>");
      return item;
    };

    if (this.isRangeDate()) {
      addItem().addClass("s").children(".lbl").html("开始日期<span class='y'></span>");
      addItem().addClass("e").children(".lbl").html("结束日期<span class='y'></span>");
    } else {
      addItem();
    }

    if (this._isRenderAsApp()) {
      header.append("<button class='today'><label>今天</label></button>");
      header.append("<button class='clear'><label>清除</label></button>");
    }
  };

  var renderTables = function renderTables($, target) {
    var tables = $("<section></section>").appendTo(target);

    if (this.isRangeDate() && !this._isRenderAsApp()) {
      createTable($, tables).addClass("s");
      createTable($, tables).addClass("e");
    } else {
      createTable($, tables).addClass("t0");
    }
  };

  var renderFooter = function renderFooter($, target) {
    if (this.isRangeDate()) {
      var footer = $("<footer></footer>").appendTo(target);

      if (this._isRenderAsApp()) {
        addButton.call(this, footer, {
          label: "使用日期",
          type: "primary",
          cls: "okbtn"
        }); // addButton.call(this, footer, {label: "取消", type: "cancel", cls: "cancelbtn"});
      } else {
        footer.append("<div class='vals'><span class='s'>-</span> - <span class='e'>-</span></div>");
        var buttons = $("<div class='btns'></div>").appendTo(footer);
        addButton.call(this, buttons, {
          label: "确定",
          type: "primary",
          cls: "okbtn"
        });
        addButton.call(this, buttons, {
          label: "取消",
          type: "cancel",
          cls: "cancelbtn"
        });
      }
    }
  };

  var renderDate = function renderDate($, target, selectedDate, pickerDate) {
    selectedDate = Utils.toArray(selectedDate);
    pickerDate = Utils.toArray(pickerDate);

    if (!(pickerDate[0] instanceof Date)) {
      pickerDate = [];

      if (this.isRangeDate() && !this._isRenderAsApp()) {
        // 移动端不显示2个日历
        pickerDate.push(selectedDate[0] || new Date());
        pickerDate.push(selectedDate[1]);
      } else {
        pickerDate.push(selectedDate[0] || new Date());
      }
    }

    renderHeaderDate.call(this, $, target, pickerDate, selectedDate);
    renderTableDate.call(this, $, target, pickerDate, selectedDate);
    renderFooterDate.call(this, $, target, pickerDate, selectedDate);

    if (!this.isRangeDate() || this._isRenderAsApp()) {
      if (isSameMonth(pickerDate[0], new Date())) {
        target.attr("cur-month", "1");
      } else {
        target.removeAttr("cur-month");
      }
    }
  };

  var renderHeaderDate = function renderHeaderDate($, target, pickerDate, selectedDate) {
    var header = target.children("header");

    if (this.isRangeDate()) {
      var start, end;
      var startValue = "--",
          endValue = "--";
      var startLabel = " ",
          endLabel = " ";

      if (this._isRenderAsApp()) {
        // 显示选中日期范围
        if (selectedDate && selectedDate.length > 0) {
          start = selectedDate[0], end = selectedDate[1];
          var today = new Date(),
              year = today.getFullYear();

          if (start) {
            if (start.getFullYear() != year) startLabel = start.getFullYear();
            startValue = Utils.toDateString(start, "M月d日") + " " + cn_week[start.getDay()];
          }

          if (end) {
            if (end.getFullYear() != year) endLabel = end.getFullYear();
            endLabel = end.getFullYear() == year ? " " : end.getFullYear();
            endValue = Utils.toDateString(end, "M月d日") + " " + cn_week[end.getDay()];
          }
        }

        header.find(".item.s .y").text(startLabel);
        header.find(".item.e .y").text(endLabel);
      } else {
        start = pickerDate && pickerDate[0] || new Date();
        end = pickerDate && pickerDate[1] || start;

        if (isSameMonth(start, end)) {
          end = new Date(end.getTime());
          end.setMonth(end.getMonth() + 1);
        }

        startValue = start.getFullYear() + "年 " + cn_month[start.getMonth()] + "月";
        endValue = end.getFullYear() + "年 " + cn_month[end.getMonth()] + "月";
        checkRangeHeadBtns($, target, start, end);
      }

      header.find(".item.s .val").text(startValue);
      header.find(".item.e .val").text(endValue);
    } else {
      var date = pickerDate && pickerDate[0] || new Date();
      var label = date.getFullYear() + "年 " + cn_month[date.getMonth()] + "月";
      header.find(".item .lbl").text(label); // 显示当前“年月”

      date = selectedDate && selectedDate[0];
      header.find(".item .val").text(date ? Utils.toDateString(date, "yyyy.MM.dd") : "-");
    }
  };

  var renderTableDate = function renderTableDate($, target, pickerDate, selectedDate) {
    if (this.isRangeDate() && !this._isRenderAsApp()) {
      var start = pickerDate && pickerDate[0] || new Date();
      var end = pickerDate && pickerDate[1] || start;

      if (isSameMonth(start, end)) {
        end = new Date(end.getTime());
        end.setMonth(end.getMonth() + 1);
      }

      renderPickerDate.call(this, $, target, target.find(".table.s"), start, selectedDate);
      renderPickerDate.call(this, $, target, target.find(".table.e"), end, selectedDate);
    } else {
      var date = pickerDate && pickerDate[0] || new Date();
      renderPickerDate.call(this, $, target, target.find(".table.t0"), date, selectedDate);
    }
  };

  var renderFooterDate = function renderFooterDate($, target, pickerDate, selectedDate) {
    if (this.isRangeDate() && !this._isRenderAsApp()) {
      var start = " ",
          end = " ";

      if (selectedDate && selectedDate.length > 0) {
        if (selectedDate[0]) start = Utils.toDateString(selectedDate[0], "yyyy.MM.dd");
        if (selectedDate[1]) end = Utils.toDateString(selectedDate[1], "yyyy.MM.dd");
      }

      var valueTarget = target.find("footer .vals");
      valueTarget.children(".s").text(start);
      valueTarget.children(".e").text(end);
    }
  };

  var renderPickerDate = function renderPickerDate($, target, table, pickerDate, selectedDate) {
    var y = pickerDate.getFullYear(),
        m = pickerDate.getMonth();
    table.attr("data-y", y).attr("data-m", m);
    var dt0 = new Date(),
        t0 = getTime(dt0); // today
    // let dtstart = (selectedDate instanceof Date) ? selectedDate : (selectedDate && selectedDate[0]);
    // let dtend = (selectedDate instanceof Date) ? selectedDate : (selectedDate && selectedDate[1]);

    var dtstart = selectedDate && selectedDate[0];
    var dtend = selectedDate && selectedDate[1];
    var tstart = getTime(dtstart),
        tend = getTime(dtend) || tstart; // selected

    var tmin = getTime(this.getMinDate()),
        tmax = getTime(this.getMaxDate()) || 21001231; // limit

    var dt = new Date(y, m, 1); // 当月第1天

    var weekday = dt.getDay();
    dt.setDate(weekday ? 2 - weekday : -5); // 日历显示的第1天

    var monthLabel = (dt0.getFullYear() == y ? "" : y + "年 ") + cn_month[m] + "月";
    table.find(".month").text(monthLabel);
    var tbody = table.find("table.body tbody").empty();

    while (true) {
      var tr = $("<tr></tr>").appendTo(tbody);

      for (var i = 0; i < 7; i++) {
        var _y = dt.getFullYear(),
            _m = dt.getMonth(),
            _d = dt.getDate(),
            _t = _y * 10000 + _m * 100 + _d;

        var td = $("<td></td>").appendTo(tr);
        td.append("<span>" + _d + "</span>");
        td.attr("data-dt", _y + "-" + (_m + 1) + "-" + _d);
        if (_t == t0) td.addClass("today");
        if (_m != m) td.addClass("over");
        if (_m != m || _t < tmin || _t > tmax) td.addClass("disabled");

        if (_t >= tstart && _t <= tend) {
          td.addClass("selected");
          if (_t == tstart) td.addClass("start");
          if (_t == tend) td.addClass("end");
        }

        dt.setDate(_d + 1);
      }

      if (dt.getMonth() > m || dt.getFullYear() > y) break;
    }
  }; ///////////////////////////////////////////////////////


  var checkRangeHeadBtns = function checkRangeHeadBtns($, target, start, end) {
    target = target.children("header");
    var yearbtns = target.find(".item.s .next.y, .item.e .prev.y");
    var monthbtns = target.find(".item.s .next.m, .item.e .prev.m");
    var syear = start.getFullYear(),
        smonth = start.getMonth();
    var eyear = end.getFullYear(),
        emonth = end.getMonth();
    if (syear * 100 + smonth >= (eyear - 1) * 100 + emonth) yearbtns.addClass("disabled");else yearbtns.removeClass("disabled");
    if (syear > eyear || syear == eyear && smonth >= emonth - 1) monthbtns.addClass("disabled");else monthbtns.removeClass("disabled");
  };

  var createTable = function createTable($, tableContainer) {
    tableContainer = $("<div class='table'></div>").appendTo(tableContainer);
    var table = $("<table class='head'></table>").appendTo(tableContainer);
    table.append("<thead><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr></thead>");
    table = $("<table class='body'></table>").appendTo(tableContainer);
    table.append("<thead><tr><th colspan='7'><div class='month'>-</div></th></tr></thead>");
    table.append("<tbody></tbody>");
    return tableContainer;
  };

  var addButton = function addButton(target, options) {
    if (!frontend) {
      var UIButton = require("../button/index");

      new UIButton(this.context, options).render(target);
    } else {
      UI.button.create(Utils.extend({}, options, {
        target: target
      }));
    }
  }; // ====================================================


  var clearCurrentSnapshoot = function clearCurrentSnapshoot(isDone) {
    this.lastSelectedDate = null;

    if (this.selectedSnapshoot) {
      if (isDone) this.selectedSnapshoot.done();else this.selectedSnapshoot.release();
      this.selectedSnapshoot = null;
    }
  };

  var getCurrentPickerDate = function getCurrentPickerDate() {
    var pickerDate = [];

    if (this.isRangeDate() && !this._isRenderAsApp()) {
      var tstart = this.$el.find(".table.s");
      pickerDate.push(new Date(parseInt(tstart.attr("data-y")), parseInt(tstart.attr("data-m")), 1));
      var tend = this.$el.find(".table.e");
      pickerDate.push(new Date(parseInt(tend.attr("data-y")), parseInt(tend.attr("data-m")), 1));
    } else {
      var table = this.$el.find(".table.t0");
      pickerDate.push(new Date(parseInt(table.attr("data-y")), parseInt(table.attr("data-m")), 1));
    }

    return pickerDate;
  };

  var getValidDate = function getValidDate(min, max) {
    // let min = this.getMinDate(), max = this.getMaxDate();
    var tmin = getTime(min),
        tmax = getTime(max);
    if (tmin && tmax && tmin > tmax) return null;

    if (this.isRangeDate()) {
      var start = Utils.toDate(this.options.start);

      if (start) {
        start = new Date(start.getTime());
        var end = Utils.toDate(this.options.end) || new Date(start.getTime());
        end = new Date(end ? end.getTime() : start.getTime());
        var tstart = getTime(start),
            tend = getTime(end);

        if (tstart <= tend) {
          if (tmin && tstart < tmin) start = min;
          if (tmax && tend > tmax) end = max;
          if (getTime(start) <= getTime(end)) return [start, end];
        }
      }
    } else {
      var date = Utils.toDate(this.options.date);

      if (date) {
        date = new Date(date.getTime());
        var tdate = getTime(date);
        if (tmin && tdate < tmin || tmax && tdate > tmax) return null;
        return date;
      }
    }

    return null;
  };

  var isSameMonth = function isSameMonth(dt1, dt2) {
    if (dt1 && dt2) {
      return dt1.getMonth() == dt2.getMonth() && dt1.getFullYear() == dt2.getFullYear();
    }

    return false;
  };

  var getTime = function getTime(date) {
    if (date) {
      return date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
    }

    return 0;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIDatePicker = UIDatePicker;
    UI.init(".ui-datepicker", UIDatePicker, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-06-03
// dateinput
(function (frontend) {
  if (frontend && VRender.Component.ui.dateinput) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UIDateInput = UI.dateinput = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIDateInput = UIDateInput.prototype = new UI._base(false);

  _UIDateInput.init = function (target, options) {
    UI._base.init.call(this, target, options);

    var inputTarget = this.inputTag = this.$el.children(".ipt");
    inputTarget.on("tap", ".clear", clearHandler.bind(this));
    this.$el.on("change", ".ui-datepicker", onPickerChangeHandler.bind(this));

    if (this._isRenderAsApp() && this.isNative()) {
      renderOriginDates.call(this);
    } else {
      inputTarget.on("tap", iptClickHandler.bind(this));
    }
  }; // ====================================================


  _UIDateInput.val = function (value, options) {
    if (Utils.isNull(value)) {
      return this.getDate(options && options.format);
    }

    this.setDate(value);
    return this;
  };

  _UIDateInput.getDate = function (format) {
    var date = Utils.toDate(this.$el.attr("data-dt"));
    if (date && Utils.isNotBlank(format)) return Utils.toDateString(date, format);
    return date;
  };

  _UIDateInput.setDate = function (value) {
    var date = value ? Utils.toDate(value) : null;
    if (setDateInner.call(this, date)) updatePicker.call(this, date, this.getMinDate(), this.getMaxDate());
  };

  _UIDateInput.getMinDate = function () {
    return Utils.toDate(this.$el.attr("opt-min"));
  };

  _UIDateInput.setMinDate = function (value) {
    var min = Utils.toDate(value);

    if (getTime(min) != getTime(this.getMinDate())) {
      this.$el.attr("opt-min", min ? Utils.toDateString(min, "yyyy-MM-dd") : "");
      updatePicker.call(this, this.getDate(), min, this.getMaxDate());
    }
  };

  _UIDateInput.getMaxDate = function () {
    return Utils.toDate(this.$el.attr("opt-max"));
  };

  _UIDateInput.setMaxDate = function (value) {
    var max = Utils.toDate(value);

    if (getTime(max) != getTime(this.getMaxDate())) {
      this.$el.attr("opt-max", max ? Utils.toDateString(max, "yyyy-MM-dd") : "");
      updatePicker.call(this, this.getDate(), this.getMinDate(), max);
    }
  };

  _UIDateInput.getDateFormat = function () {
    var options = this.options;
    if (options.hasOwnProperty("dateFormat")) return options.dateFormat;
    if (options.hasOwnProperty("format")) return options.format;
    var format = this.$el.children(".format");

    if (format && format.length > 0) {
      options.dateFormat = format.text() || null;

      if (options.dateFormat && format.is(".format-fn")) {
        options.dateFormat = unescape(options.dateFormat);
        options.dateFormat = "var Utils=VRender.Utils;return (" + options.dateFormat + ");";
        options.dateFormat = new Function(options.dateFormat)();
      }

      format.remove();
    }

    return options.dateFormat;
  };

  _UIDateInput.setDateFormat = function (value) {
    this.options.dateFormat = value;
    this.$el.children(".format").remove();
    setDateInner.call(this, this.getDate());
  };

  _UIDateInput.getPrompt = function () {
    return this.inputTag.children(".prompt").text();
  };

  _UIDateInput.setPrompt = function (value) {
    this.inputTag.children(".prompt").remove();

    if (Utils.isNotNull(value)) {
      value = Utils.trimToEmpty(value);
      $("<span class='prompt'></span>").appendTo(this.inputTag).text(value);
    }
  };

  _UIDateInput.isNative = function () {
    return this.$el.attr("opt-native") == 1;
  }; // ====================================================


  _UIDateInput._snapshoot_shoot = function (state, date) {
    state.data = date || this.getDate();
  };

  _UIDateInput._snapshoot_compare = function (state, date) {
    date = date || this.getDate();

    if (date && state.data) {
      return date.getDate() == state.data.getDate() && date.getMonth() == state.data.getMonth() && date.getFullYear() == state.data.getFullYear();
    }

    return date == state.data;
  }; // ====================================================


  var iptClickHandler = function iptClickHandler(e) {
    showDatePicker.call(this);
  };

  var clearHandler = function clearHandler(e) {
    if (setDateInner.call(this, null)) updatePicker.call(this, null, this.getMinDate(), this.getMaxDate());
    this.trigger("clear");
    return false;
  };

  var dateIptMouseHandler = function dateIptMouseHandler(e) {
    Fn.mouseDebounce(e, hideDatePicker.bind(this));
  };

  var pickerChangeHandler = function pickerChangeHandler(e, date) {
    hideDatePicker.call(this);
    setDateInner.call(this, date);
  };

  var pickerClearHandler = function pickerClearHandler(e) {
    hideDatePicker.call(this);
    setDateInner.call(this, null);
  };

  var originDateChangeHandler = function originDateChangeHandler(e) {
    setDateInner.call(this, Utils.toDate($(e.currentTarget).val()));
  }; // 禁止 UIDatePicker 原生 jquery change 事件传播


  var onPickerChangeHandler = function onPickerChangeHandler(e) {
    // e.stopPropagation();
    return false;
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-dateipt");
    var options = this.options || {};
    if (Utils.isTrue(options["native"])) target.attr("opt-native", "1"); // 容器，用于下拉列表定位

    target.attr("opt-box", options.container);
    var minDate = Utils.toDate(options.min);
    target.attr("opt-min", minDate ? Utils.toDateString(minDate, "yyyy-MM-dd") : null);
    var maxDate = Utils.toDate(options.max);
    target.attr("opt-max", maxDate ? Utils.toDateString(maxDate, "yyyy-MM-dd") : null);
    renderView.call(this, $, target, Utils.toDate(options.date));
    return this;
  }; // ====================================================


  _Renderer.getDateFormat = function () {
    return this.options.dateFormat || this.options.format;
  }; // ====================================================


  var renderView = function renderView($, target, date) {
    var iptTarget = $("<div class='ipt'></div>").appendTo(target);
    var input = $("<input type='text' readonly='readonly'/>").appendTo(iptTarget);
    iptTarget.append("<span class='clear'></span>");
    var prompt = this.options.prompt;

    if (Utils.isNotBlank(prompt)) {
      $("<span class='prompt'></span>").appendTo(iptTarget).text(prompt);
    }

    var dateFormat = this.getDateFormat();

    if (date) {
      target.addClass("has-val").attr("data-dt", Utils.toDateString(date, "yyyy-MM-dd"));
      input.val(getFormatDate(date, dateFormat) || "");
    }

    if (!frontend && dateFormat) {
      if (Utils.isFunction(dateFormat)) target.write("<div class='ui-hidden format format-fn'>" + escape(dateFormat) + "</div>");else target.write("<div class='ui-hidden format'>" + dateFormat + "</div>");
    }
  };

  var renderOriginDates = function renderOriginDates() {
    var dateInput = $("<input class='origin-dateipt' type='date'/>").appendTo(this.inputTag);
    updatePicker.call(this, this.getDate(), this.getMinDate(), this.getMaxDate());
    dateInput.on("change", originDateChangeHandler.bind(this));
  }; ///////////////////////////////////////////////////////


  var updatePicker = function updatePicker(date, min, max) {
    var _this = this;

    Utils.debounce("dateinput_picker-" + this.getViewId(), function () {
      if (_this._isRenderAsApp() && _this.isNative()) {
        var dateInput = _this.inputTag.children(".origin-dateipt");

        dateInput.val(date ? Utils.toDateString(date, "yyyy-MM-dd") : "");
        dateInput.attr("min", min ? Utils.toDateString(min, "yyyy-MM-dd") : "");
        dateInput.attr("max", max ? Utils.toDateString(max, "yyyy-MM-dd") : "");
      } else if (_this.picker) {
        _this.picker.setMinDate(min);

        _this.picker.setMaxDate(max);

        _this.picker.setDate(date);
      }
    });
  }; // ====================================================


  var showDatePicker = function showDatePicker() {
    if (!this.picker) {
      var params = {};
      params.target = $("<div class='picker'></div>").appendTo(this.$el);
      params.date = this.getDate();
      params.min = this.getMinDate();
      params.max = this.getMaxDate();
      this.picker = UI.datepicker.create(params);
      this.picker.on("change", pickerChangeHandler.bind(this));
      this.picker.on("clear", pickerClearHandler.bind(this));
    }

    if (this.$el.is(".show-picker")) return;
    var target = this.$el.addClass("show-picker");

    if (this._isRenderAsApp()) {
      $("html, body").addClass("ui-scrollless");
      target.children(".picker").on("tap", hideDatePicker.bind(this));
    } else {
      target.on("mouseenter", dateIptMouseHandler.bind(this));
      target.on("mouseleave", dateIptMouseHandler.bind(this));
      var picker = target.children(".picker");
      var offset = Utils.offset(picker, this._getScrollContainer(), 0, picker[0].scrollHeight);
      if (offset.isOverflowY) target.addClass("show-before");
    }

    setTimeout(function () {
      target.addClass("animate-in");
    });
  };

  var hideDatePicker = function hideDatePicker() {
    var target = this.$el.addClass("animate-out");

    if (this._isRenderAsApp()) {
      $("html,body").removeClass("ui-scrollless");
      target.children(".picker").off("tap");
    } else {
      target.off("mouseenter").off("mouseleave");
    }

    setTimeout(function () {
      target.removeClass("show-picker").removeClass("show-before");
      target.removeClass("animate-in").removeClass("animate-out");
    }, 300);
  }; // ====================================================


  var setDateInner = function setDateInner(date) {
    var snapshoot = this._snapshoot();

    var input = this.inputTag.find("input");

    if (date) {
      this.$el.addClass("has-val").attr("data-dt", Utils.toDateString(date, "yyyy-MM-dd"));
      input.val(getFormatDate(date, this.getDateFormat()));
    } else {
      this.$el.removeClass("has-val").attr("data-dt", "");
      input.val("");
    }

    return snapshoot.done();
  };

  var getFormatDate = function getFormatDate(date, dateFormat) {
    if (date) {
      if (Utils.isFunction(dateFormat)) return dateFormat(date);
      if (Utils.isBlank(dateFormat)) dateFormat = "yyyy-MM-dd";
      return Utils.toDateString(date, dateFormat);
    }

    return "";
  };

  var getTime = function getTime(date) {
    if (date instanceof Date) {
      return date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
    }

    return 0;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIDateInput = UIDateInput;
    UI.init(".ui-dateipt", UIDateInput, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// 2019-06-04
// daterange
(function (frontend) {
  if (frontend && VRender.Component.ui.daterange) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util;
  var cn_month = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"]; ///////////////////////////////////////////////////////

  var UIDateRange = UI.daterange = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIDateRange = UIDateRange.prototype = new UI._base(false);

  _UIDateRange.init = function (target, options) {
    UI._base.init.call(this, target, options);

    var inputTarget = this.inputTag = this.$el.children(".ipt");
    inputTarget.on("tap", ".clear", onClearBtnHandler.bind(this));
    this.$el.on("change", ".ui-datepicker", onPickerChangeHandler.bind(this));

    if (this._isRenderAsApp() && this.isNative()) {
      renderOriginDates.call(this);
    } else {
      inputTarget.on("tap", iptClickHandler.bind(this));
      inputTarget.on("tap", ".picker", function (e) {
        return false;
      });

      if (!this._isRenderAsApp()) {
        var shortcuts = this.$el.children(".tools");
        shortcuts.on("tap", ".item", shortcutClickHandler.bind(this));
        shortcuts.on("tap", ".label", shortcutLabelHandler.bind(this));
        shortcuts.on("mouseenter", shortcutMouseHandler.bind(this));
        shortcuts.on("mouseleave", shortcutMouseHandler.bind(this));
      }
    }
  }; // ====================================================


  _UIDateRange.val = function (value, options) {
    if (Utils.isNull(value)) {
      return this.getDateRange(options && options.format);
    }

    value = Utils.toArray(value);
    this.setDateRange(value[0], value[1]);
    return this;
  };

  _UIDateRange.getDateRange = function (format) {
    var start = this.getStartDate(),
        end = this.getEndDate();

    if (start && end) {
      if (Utils.isNotBlank(format)) {
        start = Utils.toDateString(start, format);
        end = Utils.toDateString(end, format);
      }

      return [start, end];
    }

    return null;
  };

  _UIDateRange.setDateRange = function (start, end) {
    start = Utils.toDate(start);
    end = (start ? Utils.toDate(end) : null) || start;

    if (setDateInner.call(this, start, end)) {
      updateShortcuts.call(this, start, end);
      updatePicker.call(this, start, end, this.getMinDate(), this.getMaxDate());
    }
  };

  _UIDateRange.getStartDate = function () {
    return Utils.toDate(this.$el.attr("data-start"));
  };

  _UIDateRange.setStartDate = function (value) {
    this.setDateRange(value, this.getEndDate());
  };

  _UIDateRange.getEndDate = function () {
    return Utils.toDate(this.$el.attr("data-end"));
  };

  _UIDateRange.setEndDate = function (value) {
    this.setDateRange(this.getStartDate(), value);
  };

  _UIDateRange.getMinDate = function () {
    return Utils.toDate(this.$el.attr("opt-min"));
  };

  _UIDateRange.setMinDate = function (value) {
    var min = Utils.toDate(value);

    if (getTime(min) != getTime(this.getMinDate())) {
      this.$el.attr("opt-min", min ? Utils.toDateString(min, "yyyy-MM-dd") : "");
      updatePicker.call(this, this.getStartDate(), this.getEndDate(), min, this.getMaxDate());
    }
  };

  _UIDateRange.getMaxDate = function () {
    return Utils.toDate(this.$el.attr("opt-max"));
  };

  _UIDateRange.setMaxDate = function (value) {
    var max = Utils.toDate(value);

    if (getTime(max) != getTime(this.getMaxDate())) {
      this.$el.attr("opt-max", max ? Utils.toDateString(max, "yyyy-MM-dd") : "");
      updatePicker.call(this, this.getStartDate(), this.getEndDate(), this.getMinDate(), max);
    }
  };

  _UIDateRange.getDateFormat = function () {
    var options = this.options;
    if (options.hasOwnProperty("dateFormat")) return options.dateFormat;
    if (options.hasOwnProperty("format")) return options.format;
    var format = this.$el.children(".format");

    if (format && format.length > 0) {
      options.dateFormat = format.text() || null;

      if (options.dateFormat && format.is(".format-fn")) {
        options.dateFormat = unescape(options.dateFormat);
        options.dateFormat = "var Utils=VRender.Utils;return (" + options.dateFormat + ");";
        options.dateFormat = new Function(options.dateFormat)();
      }

      format.remove();
    }

    return options.dateFormat;
  };

  _UIDateRange.setDateFormat = function (value) {
    this.options.dateFormat = value;
    this.$el.children(".format").remove();
    setDateInner.call(this, this.getStartDate(), this.getEndDate());
  };

  _UIDateRange.setShortcuts = function (dates) {
    renderShortcuts.call(this, this.$el, dates);
  };

  _UIDateRange.isNative = function () {
    return this.$el.attr("opt-native") == 1;
  }; // ====================================================


  _UIDateRange._snapshoot_shoot = function (state) {
    state.data = this.getDateRange();
    state.min = this.getMinDate();
    state.max = this.getMaxDate();
  };

  _UIDateRange._snapshoot_compare = function (state) {
    var range = this.getDateRange();

    if (state.data && range) {
      return getTime(state.data[0]) == getTime(range[0]) && getTime(state.data[1]) == getTime(range[1]);
    }

    return !(state.data || range);
  }; // ====================================================
  // 点击输入框显示日历


  var iptClickHandler = function iptClickHandler(e) {
    showDatePicker.call(this);
  };

  var shortcutClickHandler = function shortcutClickHandler(e) {
    if (this.picker) this.picker.cancel();
    var item = $(e.currentTarget);
    item.addClass("selected").siblings().removeClass("selected");
    item.parent().parent().children(".label").text(item.text());
    this.$el.removeClass("show-dropdown");
    setDaysRecently.call(this, item.attr("data-val"));
  };

  var shortcutLabelHandler = function shortcutLabelHandler(e) {
    if (this.picker) this.picker.cancel();
    this.$el.addClass("show-dropdown");
  };

  var shortcutMouseHandler = function shortcutMouseHandler(e) {
    var _this = this;

    if (this.t_shortcut) {
      clearTimeout(this.t_shortcut);
    }

    if (e.type == "mouseleave") {
      if (this.$el.is(".show-dropdown")) {
        this.t_shortcut = setTimeout(function () {
          _this.t_shortcut = 0;

          _this.$el.removeClass("show-dropdown");
        }, 1000);
      }
    }
  };

  var onPickerSubmitHandler = function onPickerSubmitHandler(e, range) {
    hideDatePicker.call(this);
    var start = range && range[0] || null;
    var end = range && range[1] || null;
    if (setDateInner.call(this, start, end)) updateShortcuts.call(this, start, end);
  };

  var onPickerCancelHandler = function onPickerCancelHandler(e) {
    hideDatePicker.call(this);
  }; // 移动端点击 picker 隐藏


  var onPickerHideClickHandler = function onPickerHideClickHandler(e) {
    hideDatePicker.call(this);
    if (this.picker) this.picker.cancel();
  }; // 禁止 UIDatePicker 原生 jquery change 事件传播


  var onPickerChangeHandler = function onPickerChangeHandler(e) {
    // e.stopPropagation();
    return false;
  };

  var onClearBtnHandler = function onClearBtnHandler(e) {
    if (setDateInner.call(this, null, null)) {
      updateShortcuts.call(this, null, null);
      updatePicker.call(this, null, null, this.getMinDate(), this.getMaxDate());
    }

    return false;
  };

  var originDateChangeHandler = function originDateChangeHandler(e) {
    var input = $(e.currentTarget);
    var date = Utils.toDate(input.val());
    var start = input.is(".start") ? date : this.getStartDate();
    var end = input.is(".end") ? date : this.getEndDate();
    setDateInner.call(this, start, end);
    updateShortcuts.call(this, start, end);
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-daterange");
    var options = this.options || {};
    if (Utils.isTrue(options.dropdown)) target.addClass("tools-dropdown");
    if (Utils.isTrue(options["native"])) target.attr("opt-native", "1");
    var minDate = Utils.toDate(options.min);
    if (minDate) target.attr("opt-min", Utils.toDateString(minDate, "yyyy-MM-dd"));
    var maxDate = Utils.toDate(options.max);
    if (maxDate) target.attr("opt-max", Utils.toDateString(maxDate, "yyyy-MM-dd"));
    var start = Utils.toDate(options.start),
        end = null;

    if (start) {
      end = Utils.toDate(options.end) || new Date(start.getTime());
      if (minDate && getTime(minDate) > getTime(start)) start = minDate;
      if (maxDate && getTime(maxDate) < getTime(end)) end = maxDate;
      if (getTime(start) > getTime(end)) start = end = null;
    }

    var defVal = parseInt(options.quickDef) || 0;

    if (start && end) {
      defVal = 0;
    } else if (defVal) {
      end = new Date();
      start = new Date();
      start.setDate(start.getDate() - defVal);
    }

    if (start && end) {
      target.addClass("has-val");
      target.attr("data-start", Utils.toDateString(start, "yyyy-MM-dd"));
      target.attr("data-end", Utils.toDateString(end, "yyyy-MM-dd"));
    }

    renderShortcuts.call(this, $, target, this.getShortcutDates(), defVal);
    renderDateInput.call(this, $, target, start, end);
    return this;
  }; // ====================================================


  _Renderer.getDateFormat = function () {
    return this.options.dateFormat || this.options.format;
  };

  _Renderer.getShortcutDates = function () {
    return this.options.shortcuts || this.options.quickDates;
  }; // ====================================================


  var renderShortcuts = function renderShortcuts($, target, shortcuts, defVal) {
    target.removeClass("has-tools").children(".tools").remove();
    shortcuts = formatQuickDates(shortcuts);

    if (shortcuts && shortcuts.length > 0) {
      target.addClass("has-tools");
      var tools = $("<div class='tools'></div>").prependTo(target);
      tools.append("<span class='label'>选择日期</span>");
      var items = $("<div class='items'></div>").appendTo(tools);
      Utils.each(shortcuts, function (data) {
        var value = parseInt(data.value) || 0;
        var item = $("<div class='item'></div>").appendTo(items);
        item.attr("data-val", value);
        item.text(Utils.isBlank(data.label) ? "最近" + value + "天" : data.label);
        if (value == defVal) item.addClass("selected");
      });
    }
  };

  var renderDateInput = function renderDateInput($, target, start, end) {
    var iptTarget = $("<div class='ipt'></div>").appendTo(target);
    var input = $("<input type='text' readonly='readonly'/>").appendTo(iptTarget);
    iptTarget.append("<span class='clear'></span>");
    var prompt = this.options.prompt;

    if (Utils.isNotBlank(prompt)) {
      $("<span class='prompt'></span>").appendTo(iptTarget).text(prompt);
    }

    var dateFormat = this.getDateFormat();
    input.val(getDateRangeLabel(start, end, dateFormat) || "");

    if (!frontend && dateFormat) {
      if (Utils.isFunction(dateFormat)) target.write("<div class='format format-fn'>" + escape(dateFormat) + "</div>");else target.write("<div class='format'>" + dateFormat + "</div>");
    }
  };

  var renderOriginDates = function renderOriginDates() {
    var startDateInput = $("<input class='origin-dateipt start' type='date'/>").appendTo(this.inputTag);
    var endDateInput = $("<input class='origin-dateipt end' type='date'/>").appendTo(this.inputTag);
    updatePicker.call(this, this.getStartDate(), this.getEndDate(), this.getMinDate(), this.getMaxDate());
    startDateInput.on("change", originDateChangeHandler.bind(this));
    endDateInput.on("change", originDateChangeHandler.bind(this));
  }; ///////////////////////////////////////////////////////


  var updateShortcuts = function updateShortcuts(start, end) {
    var shortcuts = this.$el.children(".tools");

    if (shortcuts && shortcuts.length > 0) {
      var label = shortcuts.children(".label").text("选择日期");
      var items = shortcuts.find(".item").removeClass("selected");

      if (start && end && Utils.getDays(end, new Date()) == 0) {
        var days = Utils.getDays(end, start) + 1;

        for (var i = 0, l = items.length; i < l; i++) {
          var item = items.eq(i);

          if (item.attr("data-val") == days) {
            item.addClass("selected");
            label.text(item.text());
            break;
          }
        }
      }
    }
  };

  var updatePicker = function updatePicker(start, end, min, max) {
    var _this2 = this;

    Utils.debounce("daterange_renderpicker-" + this.getViewId(), function () {
      if (_this2._isRenderAsApp() && _this2.isNative()) {
        var startDateInput = _this2.inputTag.children(".origin-dateipt.start");

        var endDateInput = _this2.inputTag.children(".origin-dateipt.end");

        startDateInput.val(start ? Utils.toDateString(start, "yyyy-MM-dd") : "");
        endDateInput.val(end ? Utils.toDateString(end, "yyyy-MM-dd") : "");
        min = min ? Utils.toDateString(min, "yyyy-MM-dd") : "";
        max = max ? Utils.toDateString(max, "yyyy-MM-dd") : "";
        startDateInput.attr("min", min).attr("max", max);
        endDateInput.attr("min", min).attr("max", max);
      } else if (_this2.picker) {
        _this2.picker.setMinDate(min);

        _this2.picker.setMaxDate(max);

        _this2.picker.setDate(start, end);
      }
    });
  }; // ====================================================


  var showDatePicker = function showDatePicker() {
    var _this3 = this;

    if (!this.picker) {
      var params = {
        range: true
      };
      params.target = $("<div class='picker'></div>").appendTo(this.inputTag);
      params.min = this.getMinDate();
      params.max = this.getMaxDate();
      params.start = this.getStartDate();
      params.end = this.getEndDate();
      this.picker = UI.datepicker.create(params);
      this.picker.on("submit", onPickerSubmitHandler.bind(this));
      this.picker.on("cancel", onPickerCancelHandler.bind(this));
    }

    if (this.$el.is(".show-picker")) return;
    var target = this.$el.addClass("show-picker");

    if (this._isRenderAsApp()) {
      $("html, body").addClass("ui-scrollless");
      this.inputTag.children(".picker").on("tap", onPickerHideClickHandler.bind(this));
    } else {
      var picker = this.inputTag.children(".picker");
      setTimeout(function () {
        picker.off("click").on("click", function () {
          return false;
        });
        $("body").on("click." + _this3.getViewId(), function () {
          _this3.picker.cancel();
        });
      });
      var offset = Utils.offset(picker, this._getScrollContainer(), 0, picker[0].scrollHeight);
      if (offset.isOverflowX) target.addClass("show-right");
      if (offset.isOverflowY) target.addClass("show-before");
    }

    setTimeout(function () {
      target.addClass("animate-in");
    });
  };

  var hideDatePicker = function hideDatePicker() {
    $("body").off("click." + this.getViewId());
    var target = this.$el.addClass("animate-out");

    if (this._isRenderAsApp()) {
      $("html, body").removeClass("ui-scrollless");
      this.$el.children(".picker").off("tap");
    }

    setTimeout(function () {
      target.removeClass("show-picker").removeClass("show-before").removeClass("show-right");
      target.removeClass("animate-in").removeClass("animate-out");
    }, 300);
  }; // ====================================================


  var setDateInner = function setDateInner(start, end) {
    var snapshoot = this._snapshoot();

    var input = this.inputTag.find("input");

    if (start && end) {
      this.$el.addClass("has-val");
      this.$el.attr("data-start", Utils.toDateString(start, "yyyy-MM-dd"));
      this.$el.attr("data-end", Utils.toDateString(end, "yyyy-MM-dd"));
      input.val(getDateRangeLabel(start, end, this.getDateFormat()) || "");
    } else {
      this.$el.removeClass("has-val");
      this.$el.attr("data-start", "").attr("data-end", "");
      input.val("");
    }

    return snapshoot.done();
  }; // 设置N天前日期范围


  var setDaysRecently = function setDaysRecently(days) {
    days = parseInt(days) || 0;

    if (days > 0) {
      var start = new Date(),
          end = new Date();
      start.setDate(start.getDate() - days + 1); // end.setDate(end.getDate() - 1);

      if (setDateInner.call(this, start, end)) {
        updatePicker.call(this, start, end, this.getMinDate(), this.getMaxDate());
      }
    }
  };

  var getFormatDate = function getFormatDate(date, dateFormat) {
    if (Utils.isFunction(dateFormat)) return dateFormat(date);
    if (Utils.isBlank(dateFormat)) dateFormat = "yyyy-MM-dd";
    return Utils.toDateString(date, dateFormat);
  };

  var formatQuickDates = function formatQuickDates(quickDates) {
    var results = [];
    Utils.each(Utils.toArray(quickDates), function (data) {
      if (Utils.isNotBlank(data)) {
        if (_typeof(data) !== "object") data = {
          value: data
        };
        data.value = parseInt(data && data.value) || 0;
        if (data.value > 0) results.push(data);
      }
    });
    return results;
  };

  var getDateRangeLabel = function getDateRangeLabel(start, end, dateFormat) {
    if (start && end) {
      return getFormatDate(start, dateFormat) + " 至 " + getFormatDate(end, dateFormat);
    }

    return "";
  };

  var getTime = function getTime(date) {
    if (date instanceof Date) {
      return date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
    }

    return 0;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIDateRange = UIDateRange;
    UI.init(".ui-daterange", UIDateRange, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-06-04
// datetime
(function (frontend) {
  if (frontend && VRender.Component.ui.datetime) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UIDateTime = UI.datetime = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIDateTime = UIDateTime.prototype = new UI._base(false);

  _UIDateTime.init = function (target, options) {
    UI._base.init.call(this, target, options);

    var inputTarget = this.inputTag = this.$el.children(".ipt");
    inputTarget.on("tap", iptClickHandler.bind(this));
    inputTarget.on("tap", ".clear", clearBtnHandler.bind(this));
    this.$el.on("change", ".picker", function (e) {
      return false;
    });
  }; // ====================================================


  _UIDateTime.val = function (value, options) {
    if (Utils.isNull(value)) {
      return this.getDate(options && options.format);
    }

    this.setDate(value);
    return this;
  };

  _UIDateTime.getDate = function (format) {
    var date = Utils.toDate(parseInt(this.$el.attr("data-dt")));
    if (date && Utils.isNotBlank(format)) return Utils.toDateString(date, format);
    return date;
  };

  _UIDateTime.setDate = function (value) {
    var date = value ? Utils.toDate(value) : null;
    setDateInner.call(this, date);
    if (this.picker) setPickerDate.call(this, this.picker, date);
  };

  _UIDateTime.getMinDate = function () {
    return Utils.toDate(parseInt(this.$el.attr("opt-min")));
  };

  _UIDateTime.setMinDate = function (value) {
    var min = Utils.toDate(value);
    min = min && min.getTime() || "";

    if (min != this.$el.attr("opt-min")) {
      this.$el.attr("opt-min", min);
      rerenderPicker.call(this);
    }
  };

  _UIDateTime.getMaxDate = function () {
    return Utils.toDate(parseInt(this.$el.attr("opt-max")));
  };

  _UIDateTime.setMaxDate = function (value) {
    var max = Utils.toDate(value);
    max = max && max.getTime() || "";

    if (max != this.$el.attr("opt-max")) {
      this.$el.attr("opt-max", max);
      rerenderPicker.call(this);
    }
  };

  _UIDateTime.getDateFormat = function () {
    var options = this.options;
    if (options.hasOwnProperty("dateFormat")) return options.dateFormat;
    if (options.hasOwnProperty("format")) return options.format;
    var format = this.$el.children(".format");

    if (format && format.length > 0) {
      options.dateFormat = format.text() || null;

      if (options.dateFormat && format.is(".format-fn")) {
        options.dateFormat = unescape(options.dateFormat);
        options.dateFormat = "var Utils=VRender.Utils;return (" + options.dateFormat + ");";
        options.dateFormat = new Function(options.dateFormat)();
      }

      format.remove();
    }

    return options.dateFormat;
  };

  _UIDateTime.setDateFormat = function (value) {
    this.options.dateFormat = value;
    this.$el.children(".format").remove();
    setDateInner.call(this, this.getDate());
  };

  _UIDateTime.getPrompt = function () {
    return this.inputTag.children(".prompt").text();
  };

  _UIDateTime.setPrompt = function (value) {
    this.inputTag.children(".prompt").remove();

    if (Utils.isNotNull(value)) {
      value = Utils.trimToEmpty(value);
      $("<span class='prompt'></span>").appendTo(this.inputTag).text(value);
    }
  };

  _UIDateTime.isSecondVisible = function () {
    if (!this.options.hasOwnProperty("showSecond")) {
      this.options.showSecond = !!this.$el.attr("opt-sec");
    }

    return Utils.isTrue(this.options.showSecond);
  };

  _UIDateTime.setSecondVisible = function (value) {
    value = Utils.isNull(value) ? true : Utils.isTrue(value);

    if (value != this.isSecondVisible()) {
      this.options.showSecond = value;
      rerender.call(this);
    }
  };

  _UIDateTime.getHours = function () {
    if (!this.options.hasOwnProperty("hours")) {
      this.options.hours = this.$el.attr("opt-hours");
    }

    var hours = Fn.getIntValues(this.options.hours, 0, 23);
    if (hours && hours.length > 0) return hours;
    return Utils.map(new Array(24), function (tmp, i) {
      return i;
    });
  };

  _UIDateTime.setHours = function (value) {
    this.options.hours = value;
    rerenderPicker.call(this);
  };

  _UIDateTime.getMinutes = function () {
    if (!this.options.hasOwnProperty("minutes")) {
      this.options.minutes = this.$el.attr("opt-minutes");
    }

    var minutes = Fn.getIntValues(this.options.minutes, 0, 59);
    if (minutes && minutes.length > 0) return minutes;
    return Utils.map(new Array(60), function (tmp, i) {
      return i;
    });
  };

  _UIDateTime.setMinutes = function (value) {
    this.options.minutes = value;
    rerenderPicker.call(this);
  };

  _UIDateTime.getSeconds = function () {
    if (!this.options.hasOwnProperty("seconds")) {
      this.options.seconds = this.$el.attr("opt-seconds");
    }

    var seconds = Fn.getIntValues(this.options.seconds, 0, 59);
    if (seconds && seconds.length > 0) return seconds;
    return Utils.map(new Array(60), function (tmp, i) {
      return i;
    });
  };

  _UIDateTime.setSeconds = function (value) {
    this.options.seconds = value;
    rerenderPicker.call(this);
  }; // ====================================================


  _UIDateTime._snapshoot_shoot = function (state, date) {
    state.data = date || this.getDate();
  };

  _UIDateTime._snapshoot_compare = function (state, date) {
    date = date || this.getDate();
    if (date && state.data) return date.getTime() == state.data.getTime();
    return date == state.data;
  };

  _UIDateTime.rerender = function () {
    rerender.call(this);
  }; // ====================================================


  var iptClickHandler = function iptClickHandler(e) {
    showDatePicker.call(this);
  };

  var clearBtnHandler = function clearBtnHandler(e) {
    setDateInner.call(this, null);

    if (this.picker) {
      setPickerDate.call(this, this.picker, null);
      checkPickerEnabled.call(this);
    }

    return false;
  };

  var mouseHoverHandler = function mouseHoverHandler(e) {
    Fn.mouseDebounce(e, hideDatePicker.bind(this));
  };

  var pickerChangeHandler = function pickerChangeHandler(e) {
    var date = getPickerDate.call(this, this.picker);
    setDateInner.call(this, getLimitDate.call(this, date));
    checkPickerEnabled.call(this, this.picker);
    return false;
  };

  var pickerTapHandler = function pickerTapHandler(e) {
    if ($(e.target).is(".picker")) hideDatePicker.call(this);
  };

  var pickerScrollHandler = function pickerScrollHandler(e) {
    this.beScrolled = true;
    var target = $(e.currentTarget);
    var items = target.children();
    var height = items.eq(0).height();
    var scrollTop = target.scrollTop();
    var index = parseInt(scrollTop / height);

    if (index > 0 && scrollTop % height < height / 2) {
      index -= 1;
    }

    var item = items.eq(index);
    if (item.is(".selected")) return;
    items.filter(".selected").removeClass("selected");
    item.addClass("selected");

    if (target.is(".year, .month")) {
      var year = parseInt(this.picker.find(".col.year .selected").text());
      var month = parseInt(this.picker.find(".col.month .selected").text());
      updatePickerDays.call(this, this.picker, year, month);
    }

    checkPickerEnabled.call(this, this.picker);
    var date = getPickerDate.call(this, this.picker);
    setDateInner.call(this, getLimitDate.call(this, date));
  };

  var pickerTouchHandler = function pickerTouchHandler(e) {
    var _this = this;

    if (e.type == "touchstart") {
      if (this.t_touchend) {
        clearTimeout(this.t_touchend);
      }

      this.t_touchend = null;
    } else if (e.type == "touchend") {
      if (this.beScrolled) {
        this.beScrolled = false;
        var date = getPickerDate.call(this, this.picker);
        var time = date && date.getTime() || 0;

        var waitToStop = function waitToStop() {
          _this.t_touchend = setTimeout(function () {
            _this.t_touchend = null;

            var _date = getPickerDate.call(_this, _this.picker);

            var _time = _date && _date.getTime() || 0;

            if (time == _time) {
              scrollToDate.call(_this, _this.picker, _date);
            } else {
              time = _time;
              waitToStop();
            }
          }, 200);
        };

        waitToStop();
      }
    }
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-datetime");
    var options = this.options || {}; // 容器，用于下拉列表定位

    target.attr("opt-box", options.container);
    if (this.isSecondVisible()) target.attr("opt-sec", "1");
    var minDate = Utils.toDate(options.min);
    target.attr("opt-min", minDate ? minDate.getTime() : null);
    var maxDate = Utils.toDate(options.max);
    target.attr("opt-max", maxDate ? maxDate.getTime() : null);
    if (Utils.isArray(options.hours)) target.attr("opt-hours", options.hours.join(",") || null);
    if (Utils.isArray(options.minutes)) target.attr("opt-minutes", options.minutes.join(",") || null);
    if (Utils.isArray(options.seconds)) target.attr("opt-seconds", options.seconds.join(",") || null);
    renderView.call(this, $, target, options.date);
    return this;
  };

  _Renderer.isSecondVisible = function () {
    return Utils.isTrue(this.options.showSecond);
  };

  _Renderer.getDateFormat = function () {
    return this.options.dateFormat || this.options.format;
  }; // ====================================================


  var rerender = function rerender() {
    var _this2 = this;

    Utils.debounce("datetime_render-" + this.getViewId(), function () {
      setDateInner.call(_this2, _this2.getDate());

      if (_this2.picker) {
        renderPicker.call(_this2, _this2.picker.empty());
      }
    });
  };

  var rerenderPicker = function rerenderPicker() {
    var _this3 = this;

    if (this.picker) {
      Utils.debounce("datetime_render-" + this.getViewId(), function () {
        renderPicker.call(_this3, _this3.picker.empty());
      });
    }
  };

  var renderView = function renderView($, target, date) {
    var iptTarget = $("<div class='ipt'></div>").appendTo(target);
    var input = $("<input type='text' readonly='readonly'/>").appendTo(iptTarget);
    iptTarget.append("<span class='clear'></span>");
    var prompt = this.options.prompt;

    if (Utils.isNotBlank(prompt)) {
      $("<span class='prompt'></span>").appendTo(iptTarget).text(prompt);
    }

    var dateFormat = this.getDateFormat();
    date = Utils.toDate(date);

    if (date) {
      var showSecond = this.isSecondVisible();
      date.setMilliseconds(0);
      if (!showSecond) date.setSeconds(0);
      target.addClass("has-val").attr("data-dt", date.getTime());
      input.val(getFormatDate(date, this.getDateFormat(), showSecond));
    }

    if (!frontend && dateFormat) {
      if (Utils.isFunction(dateFormat)) target.write("<div class='ui-hidden format format-fn'>" + escape(dateFormat) + "</div>");else target.write("<div class='ui-hidden format'>" + dateFormat + "</div>");
    }
  };

  var renderPicker = function renderPicker(picker) {
    if (this._isRenderAsApp()) {
      var cols = $("<div class='cols'></div>").appendTo(picker);

      var addCol = function addCol(name, values) {
        var col = $("<div class='col'></div>").appendTo(cols);
        col.addClass(name);
        Utils.each(values, function (temp) {
          $("<div class='item'></div>").appendTo(col).text(temp);
        });
      };

      addCol("year", getYears.call(this));
      addCol("month", getMonths.call(this));
      addCol("day", []); // getDays.call(this)

      addCol("hour", this.getHours());
      addCol("minute", this.getMinutes());
      if (this.isSecondVisible()) addCol("second", this.getSeconds());
    } else {
      UI.datepicker.create({
        target: picker,
        min: this.getMinDate(),
        max: this.getMaxDate()
      });
      var timeBar = $("<div class='timebar'></div>").appendTo(picker);
      var hourCombo = UI.select.create({
        target: timeBar,
        name: "hour",
        data: this.getHours()
      });
      timeBar.append("<span class='tip'>时</span>");
      var minuteCombo = UI.select.create({
        target: timeBar,
        name: "minute",
        data: this.getMinutes()
      });
      timeBar.append("<span class='tip'>分</span>");

      if (this.isSecondVisible()) {
        var secondCombo = UI.select.create({
          target: timeBar,
          name: "second",
          data: this.getSeconds()
        });
        timeBar.append("<span class='tip'>秒</span>");
      }
    }

    var date = this.getDate();
    updatePickerDays.call(this, picker, date ? date.getFullYear() : null, date ? date.getMonth() + 1 : null);
    setPickerDate.call(this, picker, date);
    checkPickerEnabled.call(this, picker);
  }; ///////////////////////////////////////////////////////


  var showDatePicker = function showDatePicker() {
    if (!this.picker) {
      this.picker = $("<div class='picker'></div>").appendTo(this.$el);
      renderPicker.call(this, this.picker);
    }

    if (this.$el.is(".show-picker")) return;
    var target = this.$el.addClass("show-picker");
    var picker = this.picker;

    if (this._isRenderAsApp()) {
      $("html,body").addClass("ui-scrollless");
      picker.on("tap", pickerTapHandler.bind(this));
      picker.on("touchstart", pickerTouchHandler.bind(this));
      picker.on("touchend", pickerTouchHandler.bind(this));
      picker.find(".col").on("scroll", pickerScrollHandler.bind(this));
    } else {
      target.on("mouseenter", mouseHoverHandler.bind(this));
      target.on("mouseleave", mouseHoverHandler.bind(this));
      picker.on("change", pickerChangeHandler.bind(this));
      var offset = Utils.offset(picker, this._getScrollContainer(), 0, picker[0].scrollHeight);
      if (offset.isOverflowY) target.addClass("show-before");
    }

    scrollToDate.call(this, picker, this.getDate());
    setTimeout(function () {
      target.addClass("animate-in");
    });
  };

  var hideDatePicker = function hideDatePicker() {
    var target = this.$el.addClass("animate-out");

    if (this._isRenderAsApp()) {
      $("html,body").removeClass("ui-scrollless");
      this.picker.off("tap").off("touchstart").off("touchend");
      this.picker.find(".col").off("scroll");
    } else {
      target.off("mouseenter").off("mouseleave");
      this.picker.off("change");
    }

    setTimeout(function () {
      target.removeClass("show-picker").removeClass("show-before");
      target.removeClass("animate-in").removeClass("animate-out");
    }, 300);
  };

  var getPickerDate = function getPickerDate(picker) {
    if (this._isRenderAsApp()) {
      var target = picker.children(".cols");
      var year = parseInt(target.children(".year").find(".selected").text()) || 0;
      var month = parseInt(target.children(".month").find(".selected").text()) || 1;
      var day = parseInt(target.children(".day").find(".selected").text()) || 1;
      var hour = parseInt(target.children(".hour").find(".selected").text()) || 0;
      var minute = parseInt(target.children(".minute").find(".selected").text()) || 0;
      var second = parseInt(target.children(".second").find(".selected").text()) || 0;
      return new Date(year, month - 1, day, hour, minute, second);
    } else {
      var datePicker = UI.datepicker.find(picker)[0];
      if (!datePicker) return null;
      var date = datePicker.getDate();

      if (date) {
        var VComponent = VRender.Component;
        var hourCombo = VComponent.get(picker.find("[name=hour]"));
        date.setHours(parseInt(hourCombo.getSelectedKey()) || 0);
        var minuteCombo = VComponent.get(picker.find("[name=minute]"));
        date.setMinutes(parseInt(minuteCombo.getSelectedKey()) || 0);

        if (this.isSecondVisible()) {
          var secondCombo = VComponent.get(picker.find("[name=second]"));
          date.setSeconds(parseInt(secondCombo.getSelectedKey()) || 0);
        }
      }

      return date;
    }
  };

  var setPickerDate = function setPickerDate(picker, date) {
    if (this._isRenderAsApp()) {
      var target = picker.children(".cols");
      target.find(".selected").removeClass("selected");

      var select = function select(name, value) {
        var col = target.children("." + name);
        var item = Utils.find(col.children(), function (temp) {
          return temp.text() == value;
        });
        if (item && item.length > 0) item.addClass("selected");
      };

      if (date) {
        select("year", date.getFullYear());
        select("month", date.getMonth() + 1);
        select("day", date.getDate());
        select("hour", date.getHours());
        select("minute", date.getMinutes());
        select("second", date.getSeconds());
      } else {
        select("year", new Date().getFullYear());
      }
    } else {
      var VComponent = VRender.Component;
      var datePicker = UI.datepicker.find(picker)[0];
      datePicker && datePicker.setDate(date);
      var hourCombo = VComponent.get(picker.find("[name=hour]"));
      hourCombo && hourCombo.setSelectedKey(date ? date.getHours() : "");
      var minuteCombo = VComponent.get(picker.find("[name=minute]"));
      minuteCombo && minuteCombo.setSelectedKey(date ? date.getMinutes() : "");
      var secondCombo = VComponent.get(picker.find("[name=second]"));
      secondCombo && secondCombo.setSelectedKey(date ? date.getSeconds() : "");
    }
  };

  var scrollToDate = function scrollToDate(picker, date) {
    var target = picker.children(".cols");

    var scroll = function scroll(name, value) {
      var col = target.children("." + name);
      var item = Utils.find(col.children(), function (temp) {
        return temp.text() == value;
      });

      if (item && item.length > 0) {
        var scrollTop = (item.index() + 1) * item.height();
        col.scrollTop(scrollTop);
      }
    };

    if (date) {
      scroll("year", date.getFullYear());
      scroll("month", date.getMonth() + 1);
      scroll("day", date.getDate());
      scroll("hour", date.getHours());
      scroll("minute", date.getMinutes());
      scroll("second", date.getSeconds());
    } else {
      target.children().scrollTop(0);
      scroll("year", new Date().getFullYear());
    }
  };

  var updatePickerDays = function updatePickerDays(picker, year, month) {
    if (!year) {
      var date = new Date();
      year = date.getFullYear();
    }

    var days = getDays.call(this, year, month);
    var target = picker.find(".col.day");
    var current = target.find(".selected").text();
    target.empty();
    Utils.each(days, function (temp) {
      var item = $("<div class='item'></div>").appendTo(target).text(temp);
      if (temp == current) item.addClass("selected");
    });
  };

  var checkPickerEnabled = function checkPickerEnabled(picker) {// 暂不实现
  };

  var setDateInner = function setDateInner(date) {
    var snapshoot = this._snapshoot();

    if (date) {
      this.$el.addClass("has-val").attr("data-dt", date.getTime());
      var showSecond = this.isSecondVisible();
      var formatDate = getFormatDate(date, this.getDateFormat(), showSecond);
      this.inputTag.find("input").val(formatDate);
    } else {
      this.$el.removeClass("has-val").attr("data-dt", "");
      this.inputTag.find("input").val("");
    }

    snapshoot.done();
  }; // ====================================================


  var getLimitDate = function getLimitDate(date) {
    if (date) {
      var _date = date.getTime();

      var min = this.getMinDate();

      if (min && min.getTime() > _date) {
        _date = min.getTime();
        date = new Date(_date);
      }

      var max = this.getMaxDate();

      if (max && max.getTime() < _date) {
        _date = max.getTime();
        date = new Date(_date);
      }
    }

    return date || null;
  };

  var getFormatDate = function getFormatDate(date, dateFormat, showSecond) {
    if (date) {
      if (Utils.isFunction(dateFormat)) return dateFormat(date);

      if (Utils.isBlank(dateFormat)) {
        if (showSecond) dateFormat = "yyyy-MM-dd HH:mm:ss";else dateFormat = "yyyy-MM-dd HH:mm";
      }

      return Utils.toDateString(date, dateFormat);
    }

    return "";
  };

  var getYears = function getYears() {
    var date = new Date();
    var year = date.getFullYear() + 100;
    var years = [];

    for (var i = 0; i < 200; i++) {
      years.push(year--);
    }

    return years;
  };

  var getMonths = function getMonths() {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  };

  var getDays = function getDays(year, month) {
    var days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];

    if (month == 2) {
      if (year % 400 == 0 || year % 4 == 0 && year % 100 != 0) days.push(29);
    } else {
      days.push(29);
      days.push(30);
      if ([1, 3, 5, 7, 10, 12].indexOf(month) >= 0) days.push(31);
    }

    return days;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIDateTime = UIDateTime;
    UI.init(".ui-datetime", UIDateTime, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-06-10
// timeinput
(function (frontend) {
  if (frontend && VRender.Component.ui.timeinput) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UITimeInput = UI.timeinput = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UITimeInput = UITimeInput.prototype = new UI._base(false);

  _UITimeInput.init = function (target, options) {
    UI._base.init.call(this, target, options);

    var inputTarget = this.inputTag = this.$el.children(".ipt");
    inputTarget.on("tap", iptClickHandler.bind(this));
    inputTarget.on("tap", ".clear", clearBtnHandler.bind(this));

    if (!this._isRenderAsApp()) {
      this.$el.on("tap", ".picker .item", pickerItemClickHandler.bind(this));
    }
  }; // ====================================================


  _UITimeInput.getTime = function () {
    return this.$el.attr("data-t") || "";
  };

  _UITimeInput.setTime = function (value) {
    var time = getTime(value, this.isSecondVisible());
    setTimeInner.call(this, time);
    if (this.picker) rerenderPicker.call(this, this.picker.empty());
  };

  _UITimeInput.getMinTime = function () {
    return this.$el.attr("opt-min") || "";
  };

  _UITimeInput.setMinTime = function (value) {
    var time = getTime(value, true);
    this.$el.attr("opt-min", time);
    if (this.picker) checkPickerEnabled.call(this, this.picker);
  };

  _UITimeInput.getMaxTime = function () {
    return this.$el.attr("opt-max") || "";
  };

  _UITimeInput.setMaxTime = function (value) {
    var time = getTime(value, true);
    this.$el.attr("opt-max", time);
    if (this.picker) checkPickerEnabled.call(this, this.picker);
  };

  _UITimeInput.isSecondVisible = function () {
    if (!this.options.hasOwnProperty("showSecond")) {
      this.options.showSecond = !!this.$el.attr("opt-sec");
    }

    return Utils.isTrue(this.options.showSecond);
  };

  _UITimeInput.setSecondVisible = function (value) {
    value = Utils.isNull(value) ? true : Utils.isTrue(value);
    if (value == this.isSecondVisible()) return;
    this.options.showSecond = value;
    rerender.call(this);
  };

  _UITimeInput.isUse12Hour = function () {
    if (!this.options.hasOwnProperty("use12Hour")) {
      this.options.use12Hour = !!this.$el.attr("opt-h12");
    }

    return Utils.isTrue(this.options.use12Hour);
  };

  _UITimeInput.setUse12Hour = function (value) {
    value = Utils.isNull(value) ? true : Utils.isTrue(value);
    if (value == this.isUse12Hour()) return;
    this.options.use12Hour = value;
    rerender.call(this);
  };

  _UITimeInput.getHours = function () {
    if (!this.options.hasOwnProperty("hours")) {
      this.options.hours = this.$el.attr("opt-hours");
    }

    var use12Hour = this.isUse12Hour();
    var hours = Fn.getIntValues(this.options.hours, 0, use12Hour ? 11 : 23);
    if (hours && hours.length > 0) return hours;
    return Utils.map(new Array(use12Hour ? 12 : 24), function (tmp, i) {
      return i;
    });
  };

  _UITimeInput.setHours = function (value) {
    this.options.hours = value;
    rerenderPicker.call(this);
  };

  _UITimeInput.getMinutes = function () {
    if (!this.options.hasOwnProperty("minutes")) {
      this.options.minutes = this.$el.attr("opt-minutes");
    }

    var minutes = Fn.getIntValues(this.options.minutes, 0, 59);
    if (minutes && minutes.length > 0) return minutes;
    return Utils.map(new Array(60), function (tmp, i) {
      return i;
    });
  };

  _UITimeInput.setMinutes = function (value) {
    this.options.minutes = value;
    rerenderPicker.call(this);
  };

  _UITimeInput.getSeconds = function () {
    if (!this.options.hasOwnProperty("seconds")) {
      this.options.seconds = this.$el.attr("opt-seconds");
    }

    var seconds = Fn.getIntValues(this.options.seconds, 0, 59);
    if (seconds && seconds.length > 0) return seconds;
    return Utils.map(new Array(60), function (tmp, i) {
      return i;
    });
  };

  _UITimeInput.setSeconds = function (value) {
    this.options.seconds = value;
    rerenderPicker.call(this);
  };

  _UITimeInput.isReadonly = function () {
    return this.$el.attr("opt-readonly") == 1;
  };

  _UITimeInput.setReadonly = function (value) {
    if (Utils.isNull(value) || Utils.isTrue(value)) {
      this.$el.attr("opt-readonly", "1");
    } else {
      this.$el.removeAttr("opt-readonly");
    }
  };

  _UITimeInput.getPrompt = function () {
    return this.inputTag.find(".prompt").text();
  };

  _UITimeInput.setPrompt = function (value) {
    this.inputTag.find(".prompt").remove();

    if (Utils.isNotBlank(value)) {
      $("<span class='prompt'></span>").appendTo(this.inputTag).text(value);
    }
  }; // ====================================================


  _UITimeInput._snapshoot_shoot = function (state) {
    state.data = this.getTime();
  };

  _UITimeInput._snapshoot_compare = function (state) {
    return state.data == this.getTime();
  };

  _UITimeInput.rerender = function () {
    var _this = this;

    Utils.debounce("timeinput_render-" + this.getViewId(), function () {
      setTimeInner.call(_this, _this.getTime());
      if (_this.picker) renderPicker.call(_this, _this.picker.empty());
    });
  }; // ====================================================


  var iptClickHandler = function iptClickHandler(e) {
    if (!this.isReadonly()) showTimePicker.call(this);
  };

  var clearBtnHandler = function clearBtnHandler(e) {
    setTimeInner.call(this, null);
    if (this.picker) setPickerTime.call(this, this.picker, "");
    return false;
  };

  var mouseHoverHandler = function mouseHoverHandler(e) {
    Fn.mouseDebounce(e, hideTimePicker.bind(this));
  };

  var pickerTapHandler = function pickerTapHandler(e) {
    if ($(e.target).is(".picker")) hideTimePicker.call(this);
  };

  var pickerTouchHandler = function pickerTouchHandler(e) {
    var _this2 = this;

    if (e.type == "touchstart") {
      if (this.t_touchend) {
        clearTimeout(this.t_touchend);
      }

      this.t_touchend = null;
    } else if (e.type == "touchend") {
      if (this.beScrolled) {
        this.beScrolled = false;
        var time = getPickerTime.call(this, this.picker);

        var waitToStop = function waitToStop() {
          _this2.t_touchend = setTimeout(function () {
            _this2.t_touchend = null;

            var _time = getPickerTime.call(_this2, _this2.picker);

            if (time == _time) {
              scrollToTime.call(_this2, _this2.picker, _time);
            } else {
              time = _time;
              waitToStop();
            }
          }, 200);
        };

        waitToStop();
      }
    }
  };

  var pickerScrollHandler = function pickerScrollHandler(e) {
    this.beScrolled = true;
    var target = $(e.currentTarget);
    var items = target.children();
    var height = items.eq(0).height();
    var scrollTop = target.scrollTop();
    var index = parseInt(scrollTop / height);

    if (index > 0 && scrollTop % height < height / 2) {
      index -= 1;
    }

    var item = items.eq(index);
    if (item.is(".selected")) return;
    items.filter(".selected").removeClass("selected");
    item.addClass("selected");
    checkPickerEnabled.call(this, this.picker);
    var time = getPickerTime.call(this, this.picker);
    setTimeInner.call(this, getLimitTime.call(this, time));
  };

  var pickerItemClickHandler = function pickerItemClickHandler(e) {
    var item = $(e.currentTarget);
    if (item.is(".selected")) return;
    item.addClass("selected").siblings().removeClass("selected");
    checkPickerEnabled.call(this, this.picker);
    var time = getPickerTime.call(this, this.picker);
    setTimeInner.call(this, getLimitTime.call(this, time));
    return false;
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-timeipt");
    var options = this.options || {}; // 容器，用于下拉列表定位

    target.attr("opt-box", options.container);
    if (this.isSecondVisible()) target.attr("opt-sec", "1");
    if (this.isUse12Hour()) target.attr("opt-h12", "1");

    if (Utils.isTrue(options.readonly)) {
      target.attr("opt-readonly", "1");
    }

    target.attr("opt-min", getTime(options.min, true) || null);
    target.attr("opt-max", getTime(options.max, true) || null);
    if (Utils.isArray(options.hours)) target.attr("opt-hours", options.hours.join(",") || null);
    if (Utils.isArray(options.minutes)) target.attr("opt-minutes", options.minutes.join(",") || null);
    if (Utils.isArray(options.seconds)) target.attr("opt-seconds", options.seconds.join(",") || null);
    renderTimeInput.call(this, $, target, options.time);
    return this;
  }; // ====================================================


  _Renderer.isSecondVisible = function () {
    return Utils.isTrue(this.options.showSecond);
  };

  _Renderer.isUse12Hour = function () {
    return Utils.isTrue(this.options.use12Hour);
  }; // ====================================================


  var renderTimeInput = function renderTimeInput($, target, time) {
    var iptTarget = $("<div class='ipt'></div>").appendTo(target);
    var input = $("<input type='text' readonly='readonly'/>").appendTo(iptTarget);
    iptTarget.append("<span class='clear'></span>");
    var prompt = this.options.prompt;

    if (Utils.isNotBlank(prompt)) {
      $("<span class='prompt'></span>").appendTo(iptTarget).text(prompt);
    }

    time = getTime(time, this.isSecondVisible());

    if (time) {
      input.val(this.isUse12Hour() ? get12HourTime(time) : time);
      target.addClass("has-val").attr("data-t", time);
    }
  };

  var renderPicker = function renderPicker(picker) {
    var target = $("<div class='cols'></div>").appendTo(picker);

    var addCol = function addCol(name, values) {
      var col = $("<div class='col'></div>").appendTo(target);
      col.addClass(name);
      Utils.each(values, function (temp) {
        $("<div class='item'></div>").appendTo(col).text(temp);
      });
    }; // 时


    addCol("hour", this.getHours()); // 分

    addCol("minute", this.getMinutes()); // 秒

    if (this.isSecondVisible()) addCol("second", this.getSeconds());
    if (this.isUse12Hour()) addCol("apm", ["AM", "PM"]);
    setPickerTime.call(this, picker, this.getTime());
    checkPickerEnabled.call(this, picker);
    if (this._isRenderAsApp()) target.children(".col").on("scroll", pickerScrollHandler.bind(this));
  };

  var rerenderPicker = function rerenderPicker() {
    var _this3 = this;

    if (this.picker) {
      Utils.debounce("timeinput_renderpicker-" + this.getViewId(), function () {
        renderPicker.call(_this3, _this3.picker.empty());
      });
    }
  }; ///////////////////////////////////////////////////////


  var setTimeInner = function setTimeInner(time) {
    var snapshoot = this._snapshoot();

    this.$el.attr("data-t", time || "");
    var input = this.inputTag.find("input");

    if (time) {
      time = getTime(time, this.isSecondVisible());
      input.val(this.isUse12Hour() ? get12HourTime(time) : time);
      this.$el.addClass("has-val");
    } else {
      input.val("");
      this.$el.removeClass("has-val");
    }

    snapshoot.done();
  };

  var showTimePicker = function showTimePicker() {
    if (!this.picker) {
      this.picker = $("<div class='picker'></div>").appendTo(this.$el);
      renderPicker.call(this, this.picker);
    }

    if (this.$el.is(".show-picker")) return;
    var target = this.$el.addClass("show-picker");
    var picker = this.picker;

    if (this._isRenderAsApp()) {
      $("html,body").addClass("ui-scrollless");
      picker.on("tap", pickerTapHandler.bind(this));
      picker.on("touchstart", pickerTouchHandler.bind(this));
      picker.on("touchend", pickerTouchHandler.bind(this));
    } else {
      target.on("mouseenter", mouseHoverHandler.bind(this));
      target.on("mouseleave", mouseHoverHandler.bind(this));
      var offset = Utils.offset(picker, this._getScrollContainer(), 0, picker[0].scrollHeight);
      if (offset.isOverflowY) target.addClass("show-before");
    }

    scrollToTime.call(this, picker, this.getTime());
    setTimeout(function () {
      target.addClass("animate-in");
    });
  };

  var hideTimePicker = function hideTimePicker() {
    var target = this.$el.addClass("animate-out");

    if (this._isRenderAsApp()) {
      $("html,body").removeClass("ui-scrollless");
      this.picker.off("tap").off("touchstart").off("touchend");
    } else {
      target.off("mouseenter").off("mouseleave");
    }

    setTimeout(function () {
      target.removeClass("show-picker").removeClass("show-before");
      target.removeClass("animate-in").removeClass("animate-out");
    }, 300);
  };

  var scrollToTime = function scrollToTime(picker, time) {
    var _renderAsApp = this._isRenderAsApp();

    var target = picker.children(".cols");

    if (time) {
      var use12Hour = this.isUse12Hour();

      var scroll = function scroll(name, value) {
        var col = target.children("." + name);
        var item = Utils.find(col.children(), function (temp) {
          return temp.text() == value;
        });

        if (item && item.length > 0) {
          var scrollTop = item.index() * item.height();
          if (_renderAsApp) scrollTop += item.height();
          col.scrollTop(scrollTop);
        }
      };

      time = time.split(":");
      var hour = parseInt(time[0]) || 0;
      scroll("hour", hour > 11 && use12Hour ? hour - 12 : hour);
      scroll("minute", parseInt(time[1]) || 0);
      scroll("second", parseInt(time[2]) || 0);

      if (_renderAsApp && use12Hour) {
        scroll("apm", hour < 12 ? "AM" : "PM");
      }
    } else if (_renderAsApp) {
      target.children().scrollTop(0);
    }
  };

  var getPickerTime = function getPickerTime(picker) {
    var target = picker.children(".cols");
    var time = []; // 时

    var hour = parseInt(target.children(".hour").find(".selected").text()) || 0;

    if (this.isUse12Hour()) {
      if (target.children(".apm").find(".selected").text() == "PM") hour += 12;
    }

    time.push((hour < 10 ? "0" : "") + hour); // 分

    var minute = parseInt(target.children(".minute").find(".selected").text()) || 0;
    time.push((minute < 10 ? "0" : "") + minute); // 秒

    if (this.isSecondVisible()) {
      var second = parseInt(target.children(".second").find(".selected").text()) || 0;
      time.push((second < 10 ? "0" : "") + second);
    }

    return time.join(":");
  };

  var setPickerTime = function setPickerTime(picker, time) {
    var target = picker.children(".cols");
    target.find(".selected").removeClass("selected");

    if (time) {
      var setSelected = function setSelected(name, value) {
        var col = target.children("." + name);
        var item = Utils.find(col.children(), function (temp) {
          return temp.text() == value;
        });
        if (item && item.length > 0) item.addClass("selected");
      };

      time = time.split(":");
      var hour = parseInt(time[0]) || 0;

      if (this.isUse12Hour()) {
        setSelected("apm", hour < 12 ? "AM" : "PM");
        if (hour > 11) hour -= 12;
      }

      setSelected("hour", hour);
      setSelected("minute", parseInt(time[1]) || 0);
      if (this.isSecondVisible()) setSelected("second", parseInt(time[2]) || 0);
    }
  };

  var checkPickerEnabled = function checkPickerEnabled(picker) {
    var target = picker.children(".cols");
    var min = (this.getMinTime() || "00:00:00").split(":");
    var max = (this.getMaxTime() || "23:59:59").split(":");
    var minHour = parseInt(min[0]) || 0;
    var minMinute = parseInt(min[1]) || 0;
    var minSecond = parseInt(min[2]) || 0;
    var maxHour = parseInt(max[0]) || 0;
    var maxMinute = parseInt(max[1]) || 0;
    var maxSecond = parseInt(max[2]) || 0;
    var ispm = target.children(".apm").find(".selected").text() == "PM";
    var hour = -1,
        minute = -1;

    var _min = minHour * 10000,
        _max = maxHour * 10000,
        _time = 0;

    Utils.each(target.children(".hour").children(), function (item) {
      var _hour = (parseInt(item.text()) || 0) + (ispm ? 12 : 0);

      var _t = _time + _hour * 10000;

      if (_t < _min || _t > _max) item.addClass("disabled");else item.removeClass("disabled");
      if (item.is(".selected")) hour = _hour;
    });
    _min += minMinute * 100;
    _max += maxMinute * 100;
    _time += hour < 0 ? 0 : hour * 10000;
    Utils.each(target.children(".minute").children(), function (item) {
      var _minute = parseInt(item.text()) || 0;

      var _t = _time + _minute * 100;

      if (_t < _min || _t > _max) item.addClass("disabled");else item.removeClass("disabled");
      if (item.is(".selected")) minute = _minute;
    });
    _min += minSecond;
    _max += maxSecond;
    _time += minute < 0 ? 0 : minute * 100;
    Utils.each(target.children(".second").children(), function (item) {
      item.removeClass("disabled");

      var _second = parseInt(item.text()) || 0;

      var _t = _time + _second;

      if (_t < _min || _t > _max) item.addClass("disabled");
    });
    Utils.each(target.children(".apm").children(), function (item) {
      item.removeClass("disabled");
      if (item.text() == "AM" && minHour > 11) item.addClass("disabled");else if (item.text() == "PM" && maxHour < 12) item.addClass("disabled");
    });
  }; // ====================================================


  var getLimitTime = function getLimitTime(time) {
    var min = this.getMinTime();
    if (min && time < min) time = min;
    var max = this.getMaxTime();
    if (max && time > max) time = max;
    return time;
  };

  var getTime = function getTime(value, showSecond) {
    if (value) {
      value = value.split(":");
      var hour = Math.max(0, parseInt(value[0])) || 0;
      var minute = Math.max(0, parseInt(value[1])) || 0;
      var second = Math.max(0, parseInt(value[2])) || 0;

      if (second > 59) {
        minute += parseInt(second / 60);
        second = second % 60;
      }

      if (minute > 59) {
        hour += parseInt(minute / 60);
        minute = minute % 60;
      }

      if (hour > 23) {
        hour = hour % 24;
      }

      var time = [];
      time.push((hour < 10 ? "0" : "") + hour);
      time.push((minute < 10 ? "0" : "") + minute);
      if (showSecond) time.push((second < 10 ? "0" : "") + second);
      return time.join(":");
    }

    return "";
  };

  var get12HourTime = function get12HourTime(time) {
    if (time) {
      time = time.split(":");
      var hour = Math.max(0, parseInt(time[0])) || 0;

      if (hour > 11) {
        time[0] = hour - 12;
        if (time[0] < 10) time[0] = "0" + time[0];
      }

      return getAPMName(hour) + " " + time.join(":");
    }

    return "";
  };

  var getAPMName = function getAPMName(hour) {
    if (hour < 6) return "凌晨";
    if (hour < 12) return "上午";
    if (hour < 14) return "中午";
    if (hour < 18) return "下午";
    return "晚上";
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UITimeInput = UITimeInput;
    UI.init(".ui-timeipt", UITimeInput, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// 2019-06-10
// fileupload
(function (frontend) {
  if (frontend && VRender.Component.ui.fileupload) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UIFileUpload = UI.fileupload = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIFileUpload = UIFileUpload.prototype = new UI._base(false);

  _UIFileUpload.init = function (target, options) {
    UI._base.init.call(this, target, options);

    this.$el.on("change", "input", onFileChangeHandler.bind(this));
    var browser = this.getBrowser();
    if (browser) browser.on("click.fileupload", onBrowserClickHandler.bind(this));
  }; // ====================================================


  _UIFileUpload.browser = function () {
    this.$el.children("input").click();
  };

  _UIFileUpload.remove = function (localId) {
    Utils.removeBy(this.files, "localId", localId);
  };

  _UIFileUpload.clear = function () {
    this.files = [];
  };

  _UIFileUpload.upload = function (action, params, callback) {
    var _this = this;

    if (this.isUploading) return false;

    if (Utils.isFunction(action)) {
      callback = action;
      action = params = null;
    } else if (Utils.isFunction(params)) {
      callback = params;
      params = null;
    }

    if (Utils.isBlank(action)) action = this.getAction();

    if (Utils.isBlank(action)) {
      showError("上传失败：缺少 Action 信息！");
      return false;
    }

    if (this.files && this.files.length > 0) {
      this.isUploading = true;
      doUpload.call(this, action, params, function (err, ret) {
        _this.isUploading = false;
        if (Utils.isFunction(callback)) callback(err, ret);
      });
    } else {
      if (Utils.isFunction(callback)) callback("没有文件信息");
      return false;
    }
  };

  _UIFileUpload.cancel = function () {
    this.isUploading = false;
    Utils.each(this.files, function (file) {
      if (file.uploader) {
        file.uploader.abort();
        file.uploader = null;
      }
    });
  };

  _UIFileUpload.isEmpty = function () {
    return !this.files || this.files.length == 0;
  }; // ====================================================


  _UIFileUpload.getAction = function () {
    return this.$el.attr("opt-action");
  };

  _UIFileUpload.setAction = function (value) {
    this.$el.attr("opt-action", Utils.trimToEmpty(value));
  };

  _UIFileUpload.getParams = function () {
    if (this.options.hasOwnProperty("params")) return this.options.params;
    var params = null;

    try {
      params = JSON.parse(this.$el.attr("opt-params"));
    } catch (e) {}

    ;
    this.options.params = params;
    return this.options.params;
  };

  _UIFileUpload.setParams = function (value) {
    this.options.params = value;
    this.$el.removeAttr("opt-params");
  };

  _UIFileUpload.getUploadName = function () {
    return Utils.trimToNull(this.$el.attr("opt-upload")) || "file";
  };

  _UIFileUpload.setUploadName = function (value) {
    this.$el.attr("opt-upload", Utils.trimToEmpty(value));
  };

  _UIFileUpload.getBrowser = function () {
    if (this.hasOwnProperty("browserBtn")) return this.browserBtn;
    if (this.options.hasOwnProperty("browser")) return this.options.browser;
    var browser = this.$el.attr("opt-browser");
    this.$el.removeAttr("opt-browser");
    this.browserBtn = Utils.isBlank(browser) ? null : $(browser);
    return this.browserBtn;
  };

  _UIFileUpload.setBrowser = function (value) {
    var browser = this.getBrowser();

    if (browser) {
      browser.off("click.fileupload");
    }

    this.browserBtn = Utils.isBlank(value) ? null : value.$el || $(value);
    this.options.browser = null;
    this.$el.removeAttr("opt-browser");
    initBrowserHandler.call(this, this.browserBtn);

    if (this.browserBtn) {
      this.browserBtn.on("click.fileupload", onBrowserClickHandler.bind(this));
    }
  };

  _UIFileUpload.getFilter = function () {
    return this.$el.attr("opt-filter");
  };

  _UIFileUpload.setFilter = function (value) {
    this.$el.attr("opt-filter", Utils.trimToEmpty(value));
    var input = this.$el.children("input");
    var accept = getAccept.call(this);
    if (accept) input.attr("accept", accept);else input.removeAttr("accept");
  };

  _UIFileUpload.getLimit = function () {
    return parseInt(this.$el.attr("opt-limit")) || 0;
  };

  _UIFileUpload.setLimit = function (value) {
    if (value && !isNaN(value)) this.$el.attr("opt-limit", value);else this.$el.removeAttr("opt-limit");
  };

  _UIFileUpload.isMultiple = function () {
    return this.$el.children("input").attr("multiple") == "multiple";
  };

  _UIFileUpload.setMultiple = function (value) {
    var input = this.$el.children("input");
    if (Utils.isNull(value) || Utils.isTrue(value)) input.attr("multiple", "multiple");else input.removeAttr("multiple");
  };

  _UIFileUpload.isAutoUpload = function () {
    return this.$el.attr("opt-auto") == 1;
  };

  _UIFileUpload.setAutoUpload = function (value) {
    if (Utils.isNull(value) || Utils.isTrue(value)) this.$el.attr("opt-auto", "1");else this.$el.removeAttr("opt-auto");
  };

  _UIFileUpload.isMixed = function () {
    return this.$el.attr("opt-mixed") == 1;
  };

  _UIFileUpload.setMixed = function (value) {
    if (Utils.isNull(value) || Utils.isTrue(value)) this.$el.attr("opt-mixed", "1");else this.$el.removeAttr("opt-mixed");
  }; // ====================================================


  var onBrowserClickHandler = function onBrowserClickHandler() {
    if (this.isUploading) {
      showError("正在上传，请稍候..");
    } else {
      this.browser();
    }
  };

  var onFileChangeHandler = function onFileChangeHandler(e) {
    var input = $(e.currentTarget);
    var files = validateFiles.call(this, input[0].files);
    if (!files || files.length == 0) return;
    var fileLocalId = Date.now();
    var multiple = input.attr("multiple") == "multiple";

    if (multiple) {
      this.files = Utils.toArray(this.files);

      for (var i = 0; i < files.length; i++) {
        files[i].localId = fileLocalId++;
        this.files.push(files[i]);
      }
    } else {
      files[0].localId = fileLocalId++;
      this.files = [files[0]];
    }

    input.remove();
    var newInput = $("<input type='file'/>").appendTo(this.$el);
    if (multiple) newInput.attr("multiple", "multiple");
    newInput.attr("accept", input.attr("accept"));
    this.trigger("change", this.files);

    if (this.isAutoUpload()) {
      if (Utils.isNotBlank(this.getAction())) this.upload();
    }
  };

  var uploadSuccessHandler = function uploadSuccessHandler(e, file, callback) {
    file[0].uploader = null;
    callback(file.errorMsg, file.resultMsg);
  }; // 好像不会进这里来


  var uploadErrorHandler = function uploadErrorHandler(e, file, callback) {
    file[0].uploader = null;
    callback(e);
  };

  var uploadStateHandler = function uploadStateHandler(e, file) {
    var xhr = file[0].uploader;

    if (xhr.readyState == 4) {
      var data = xhr.responseText;

      if (data) {
        try {
          data = JSON.parse(data);
        } catch (e) {}
      }

      if (xhr.status == 200) {
        file.resultMsg = data || xhr.responseText;
      } else {
        // 出错了，出错会进入 onload
        console.error(xhr.responseText);
        file.errorMsg = data || xhr.responseText || "文件上传失败！";
      }
    }
  };

  var uploadProgressHandler = function uploadProgressHandler(e, file) {
    this.totalSend += e.loaded;
    if (this.totalSend > this.totalSize) this.totalSend = this.totalSize;
    this.trigger("progress", file, this.totalSend, this.totalSize);
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-fileupload").css("display", "none");
    var options = this.options || {};
    target.attr("opt-action", Utils.trimToNull(options.action));
    target.attr("opt-upload", Utils.trimToNull(options.uploadName));
    target.attr("opt-filter", this.getFilter());
    target.attr("opt-limit", this.getLimit() || null);
    target.attr("opt-auto", this.isAutoUpload() ? "1" : null);
    target.attr("opt-mixed", this.isMixed() ? "1" : null);
    target.attr("opt-browser", this.getBrowser());
    renderInputView.call(this, $, target);

    if (!frontend) {
      if (options.params) {
        target.attr("opt-params", JSON.stringify(options.params));
      }
    }

    return this;
  }; // ====================================================


  _Renderer.getBrowser = function () {
    if (!frontend) {
      var browser = this.options.browser;

      if (browser) {
        if (typeof browser == "string") return browser;
        if (Utils.isFunction(browser.getViewId)) return "[vid='" + browser.getViewId() + "']";
      }
    }

    return null;
  };

  _Renderer.getFilter = function () {
    return Utils.trimToNull(this.options.filter);
  };

  _Renderer.getLimit = function () {
    return Math.max(0, parseInt(this.options.limit)) || 0;
  };

  _Renderer.isMultiple = function () {
    return Fn.isMultiple.call(this);
  };

  _Renderer.isAutoUpload = function () {
    if (this.options.hasOwnProperty("autoUpload")) return Utils.isTrue(this.options.autoUpload);
    return true;
  };

  _Renderer.isMixed = function () {
    return Utils.isTrue(this.options.mixed);
  }; // ====================================================


  var renderInputView = function renderInputView($, target) {
    var input = $("<input type='file'/>").appendTo(target);
    if (this.isMultiple()) input.attr("multiple", "multiple");
    input.attr("accept", Utils.trimToNull(getAccept.call(this)));
  }; ///////////////////////////////////////////////////////


  var validateFiles = function validateFiles(files) {
    var filter = Utils.trimToNull(this.getFilter());

    if (filter) {
      if (/image|audio|video|excel|word|powerpoint|text/.test(filter)) filter = null;else filter = filter.split(",");
    }

    var limit = this.getLimit();

    if (filter || limit > 0) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];

        if (filter) {
          var _ret = function () {
            var ext = file.name.split(".");
            ext = ext[ext.length - 1];
            var match = Utils.index(filter, function (tmp) {
              return Utils.endWith(tmp, ext);
            });

            if (match < 0) {
              showError("文件类型错误：" + file.name);
              return {
                v: false
              };
            }
          }();

          if (_typeof(_ret) === "object") return _ret.v;
        }

        if (limit > 0) {
          if (limit < file.size) {
            showError("允许文件大小上限为：" + getFormatSize(limit));
            return false;
          }
        }
      }
    }

    return files;
  };

  var doUpload = function doUpload(action, params, callback) {
    var _this2 = this;

    var apiName = getActionName.call(this, action);
    var apiParams = Utils.extend({}, this.getParams(), params);
    var totalSize = 0;
    Utils.each(this.files, function (file) {
      totalSize += file.size;
      file.state = 0; // 初始化
    });
    this.totalSize = totalSize;
    this.totalSend = 0;
    uploadFiles.call(this, apiName, apiParams, this.files, function (err, ret) {
      if (!err) {
        _this2.files = null;

        _this2.trigger("success", ret);
      } else {
        _this2.trigger("error", err);
      }

      if (Utils.isFunction(callback)) {
        callback(err, ret);
      }
    });
  };

  var doUploadBefore = function doUploadBefore(file, params, callback) {
    var event = {
      type: "upload-before"
    };
    this.trigger(event, file, params);

    if (event.isPreventDefault) {
      callback("canceled");
    } else {
      callback();
    }
  };

  var uploadFiles = function uploadFiles(api, params, files, callback) {
    var _this3 = this;

    if (files.length == 1 || this.isMixed()) {
      Utils.each(files, function (file) {
        file.state = 1; // 正在上传
      });
      uploadFile.call(this, api, params, files, function (err, ret) {
        var localIds = [];
        Utils.each(files, function (file) {
          file.state = !err ? 2 : 3; // 成功、失败

          localIds.push(file.localId);
        });
        ret = ret || {};
        ret.localId = localIds.join(",");
        callback(err, ret);
      });
    } else {
      var errors = [];
      var results = [];

      var loop = function loop() {
        var file = Utils.findBy(files, "state", 0);

        if (!file) {
          if (errors.length == 0) errors = null;
          callback(errors, results);
        } else {
          file.state = 1;
          uploadFile.call(_this3, api, params, [file], function (err, ret) {
            if (!err) {
              file.state = 2;
              ret.localId = file.localId;
              results.push(ret);
            } else {
              file.state = 3;
              errors.push(err);
            }

            loop();
          });
        }
      };

      loop();
    }
  };

  var uploadFile = function uploadFile(api, params, file, callback) {
    var _this4 = this;

    var xhr = createHttpRequest();

    if (!xhr) {
      callback("当前浏览器版本较低，不支持该上传功能。或者使用其他浏览器（如：chrome）。");
    } else {
      params = Utils.extend({}, params);
      doUploadBefore.call(this, file, params, function (error) {
        if (!error) {
          file[0].uploader = xhr;
          xhr.open("POST", api, true);

          xhr.onload = function (e) {
            uploadSuccessHandler.call(_this4, e, file, callback);
          };

          xhr.onerror = function (e) {
            uploadErrorHandler.call(_this4, e, file, callback);
          };

          xhr.onreadystatechange = function (e) {
            uploadStateHandler.call(_this4, e, file);
          };

          xhr.upload.onprogress = function (e) {
            uploadProgressHandler.call(_this4, e, file);
          };

          var form = new FormData();

          var uploadName = _this4.getUploadName();

          Utils.each(file, function (temp) {
            form.append(uploadName, temp);
            form.append("filename", temp.name);
          });

          for (var n in params) {
            form.append(n, params[n]);
          }

          xhr.send(form);
        } else if (error == "canceled") {
          callback("已取消");
        } else {
          callback(error);
        }
      });
    }
  };

  var createHttpRequest = function createHttpRequest() {
    if (window.XMLHttpRequest) return new XMLHttpRequest();
    if (window.ActiveXObject) return new ActiveXObject("Microsoft.XMLHTTP"); // setTimeout(function () {
    // 	showError("当前浏览器版本较低，不支持该上传功能。或者使用其他浏览器（如：chrome）。", 60000);
    // }, 500);

    return false;
  }; // ====================================================


  var getActionName = function getActionName(action) {
    if (/^(\/|http)/.test(action)) return action;
    return "/upload?n=" + action;
  };

  var getAccept = function getAccept() {
    var filter = this.getFilter();

    if (filter) {
      if (filter == "image") return "image/*";
      if (filter == "audio") return "audio/*";
      if (filter == "video") return "video/*";

      if (filter == "excel") {
        // ".xls,.xlsx,.xlt,.xla"
        return "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      }

      if (filter == "word") {
        // ".doc,.docx,.dot"
        return "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      }

      if (filter == "powerpoint") {
        // ".ppt,.pptx,.pps,.pot,.ppa"
        return "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";
      }

      if (filter == "text") return "text/*";
    }

    return filter;
  };

  var getFormatSize = function getFormatSize(value) {
    value = parseInt(value);

    if (value && value > 0) {
      if (value < 1024) return value + "B";
      value /= 1024;
      if (value < 1024) return value.toFixed(2) + "KB";
      value /= 1024;
      if (value < 1024) return value.toFixed(2) + "MB";
      value /= 1024;
      if (value < 1024) return value.toFixed(2) + "GB";
      value /= 1024;
      return value.toFixed(2) + "TB";
    }

    return "";
  };

  var showError = function showError(message, duration) {
    UI.message.create({
      type: "danger",
      content: message,
      duration: duration
    });
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIFileUpload = UIFileUpload;
    UI.init(".ui-fileupload", UIFileUpload, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-06-10
// form(原formview)
(function (frontend) {
  if (frontend && VRender.Component.ui.form) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util;
  var VERTICAL = "vertical";
  var HORIZONTIAL = "horizontial"; ///////////////////////////////////////////////////////

  var UIForm = UI.form = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIForm = UIForm.prototype = new UI._base(false);

  _UIForm.init = function (target, options) {
    UI._base.init.call(this, target, options);

    var btnbar = this.$el.children(".btnbar");
    btnbar.on("tap", ".ui-btn", onButtonClickHandler.bind(this));
    this.$el.on("keydown", ".form-item > .content > dd > div > *", onNativeInputKeyHandler.bind(this));
    this.$el.on("focusout", ".form-item > .content > dd > div > *", onNativeInputFocusHandler.bind(this));
    this.$el.on("change", ".form-item > .content > dd > div > *", onValueChangeHandler.bind(this));
    this.$el.on("keydown", ".ui-input > .ipt > *", onTextViewKeyHandler.bind(this));
    this.$el.on("focusout", ".ui-input > .ipt > *", onTextViewFocusHandler.bind(this));

    if (!this._isRenderAsApp()) {
      this.$el.on("mouseenter", ".form-item > .content > dd > div > *", onItemMouseHandler.bind(this));
      this.$el.on("mouseleave", ".form-item > .content > dd > div > *", onItemMouseHandler.bind(this));
    }
  }; // ====================================================


  _UIForm.validate = function (callback) {
    var _this = this;

    var errors = [];

    var formItems = this._getItems();

    var count = formItems.length;
    Utils.each(formItems, function (item, index) {
      validateItem.call(_this, item, null, function (result) {
        if (result) {
          errors.push({
            index: index,
            name: item.attr("name"),
            message: result
          });
        }

        count -= 1;

        if (count <= 0) {
          if (Utils.isFunction(callback)) {
            callback(errors.length > 0 ? errors : false);
          }
        }
      });
    });
  };

  _UIForm.submit = function (action, callback) {
    var _this2 = this;

    if (this.$el.is(".is-loading")) return false;

    if (Utils.isFunction(action)) {
      callback = action;
      action = null;
    }

    if (Utils.isBlank(action)) action = this.getAction();
    this.$el.addClass("is-loading");
    var submitBtn = this.$el.find(".btnbar .is-submit .ui-btn");
    Utils.each(submitBtn, function (button) {
      VRender.Component.get(button).waiting();
    });

    var resultHandler = function resultHandler(err, ret, submitParams) {
      _this2.$el.removeClass("is-loading");

      Utils.each(submitBtn, function (button) {
        VRender.Component.get(button).waiting(0);
      });

      if (Utils.isFunction(callback)) {
        callback(err, ret, submitParams);
      }

      if (action) {
        _this2.trigger("action_after", err, ret, submitParams);
      }
    };

    this.validate(function (errors) {
      if (!errors && action) {
        doSubmit.call(_this2, action, resultHandler);
      } else {
        resultHandler(errors);
      }
    });
  }; // ====================================================


  _UIForm.add = function (name, label, index) {
    var container = this.$el.children(".items");
    var item = $("<div class='form-item'></div>").appendTo(container);
    item.attr("name", Utils.trimToNull(name));
    var content = $("<dl class='content'></dl>").appendTo(item);
    var labelTarget = $("<dt></dt>").appendTo(content);
    labelTarget.text(Utils.trimToEmpty(label));
    labelTarget.css("width", Utils.trimToEmpty(this.getLabelWidth()));
    content.append("<dd><div></div></dd>");
    index = Utils.getIndexValue(index);

    if (index >= 0) {
      var items = container.children();
      if (index < items.length - 1) items.eq(index).before(item);
    }

    return new FormItem(this, item);
  };

  _UIForm.get = function (name) {
    if (Utils.isBlank(name)) return null;
    var item = Utils.find(this._getItems(), function (item) {
      return item.attr("name") == name;
    });
    return !item ? null : new FormItem(this, item);
  };

  _UIForm.getAt = function (index) {
    index = Utils.getIndexValue(index);

    if (index >= 0) {
      var item = this._getItems().eq(index);

      return !item ? null : new FormItem(this, item);
    }

    return null;
  };

  _UIForm.getView = function (name) {
    if (Utils.isBlank(name)) return null;
    var item = Utils.find(this._getItems(), function (item) {
      return item.attr("name") == name;
    });

    if (item) {
      var contentView = item.children(".content").children("dd").children().children();
      return VRender.Component.get(contentView) || VRender.FrontComponent.get(contentView) || contentView;
    }

    return null;
  };

  _UIForm["delete"] = function (name) {
    if (Utils.isBlank(name)) return null;
    var item = Utils.find(this._getItems(), function (item) {
      return item.attr("name") == name;
    });
    if (item) item.remove();
    return item;
  };

  _UIForm.deleteAt = function (index) {
    index = Utils.getIndexValue(index);

    if (index >= 0) {
      var item = this._getItems().eq(index);

      if (item) item.remove();
      return item;
    }

    return null;
  }; // ====================================================


  _UIForm.getFormData = function () {
    var params = {};
    params = Utils.extend(params, this.getParams());
    Utils.each(this._getItems(), function (item) {
      var name = item.attr("name");
      if (Utils.isBlank(name)) return;
      var contentView = item.children(".content").children("dd").children().children();

      if (contentView.is("input, textarea")) {
        params[name] = contentView.val() || "";
        params[name] = Utils.trimToEmpty(params[name]);
      } else {
        contentView = VRender.Component.get(contentView) || VRender.FrontComponent.get(contentView);

        if (contentView) {
          if (contentView instanceof UI.dateinput) {
            params[name] = contentView.getDate("yyyy-MM-dd");
          } else if (contentView instanceof UI.daterange) {
            params[name] = contentView.getDateRange("yyyy-MM-dd");
          } else if (contentView instanceof UI.select) {
            params[name] = contentView.val();
          } else if (contentView instanceof UI._select) {
            params[name] = contentView.getSelectedKey();
          } else if (Utils.isFunction(contentView.getValue)) {
            params[name] = contentView.getValue();
          } else if (Utils.isFunction(contentView.val)) {
            if (!Utils.isFunction(contentView.isChecked) || contentView.isChecked()) params[name] = contentView.val();
          }
        }
      }
    });
    return params;
  };

  _UIForm.setFormData = function (data) {
    var _this3 = this;

    data = data || {};
    Utils.each(this._getItems(), function (item) {
      var name = item.attr("name");
      if (Utils.isBlank(name)) return;
      if (!data.hasOwnProperty(name)) return;
      var value = data[name];
      var content = item.children(".content").children("dd").children().children();

      if (content.is("input, textarea")) {
        content.val(value || "");
        validateInput.call(_this3, item, content);
      } else {
        var contentView = VRender.Component.get(content);

        if (contentView) {
          if (contentView instanceof UI._select) {
            contentView.setSelectedKey(value);
            validateSelectionView.call(_this3, item, contentView);
          } else if (Utils.isFunction(contentView.val)) {
            contentView.val(value || "");
            validateItem.call(_this3, item, content);
          }
        }
      }
    });
  };

  _UIForm.getColumns = function () {
    if (this._isRenderAsApp()) return 1;
    if (this.options.hasOwnProperty("columns")) return parseInt(this.options.columns) || 1;
    this.options.columns = parseInt(this.$el.attr("opt-cols")) || 1;
    this.$el.removeAttr("opt-cols");
    return this.options.columns;
  };

  _UIForm.setColumns = function (value) {
    if (this._isRenderAsApp()) return;
    var columns = parseInt(value) || 1;
    if (columns < 1) columns = 1;
    this.options.columns = columns;
    this.$el.removeAttr("opt-cols");
    Utils.each(this._getItems(), function (item) {
      var colspan = parseInt(item.attr("opt-col")) || 1;
      if (columns > colspan) item.css("width", (colspan * 100 / columns).toFixed(6) + "%");else item.css("width", "");
    });
  };

  _UIForm.getAction = function () {
    return this.$el.attr("opt-action");
  };

  _UIForm.setAction = function (value) {
    this.$el.attr("opt-action", Utils.trimToEmpty(value));
  };

  _UIForm.getParams = function () {
    if (this.options.hasOwnProperty("params")) return this.options.params;
    var params = null;

    try {
      params = JSON.parse(this.$el.attr("opt-params"));
    } catch (e) {}

    ;
    this.options.params = params;
    return this.options.params;
  };

  _UIForm.setParams = function (value) {
    this.options.params = value;
    this.$el.removeAttr("opt-params");
  };

  _UIForm.getMethod = function () {
    return this.$el.attr("opt-method");
  };

  _UIForm.setMethod = function (value) {
    this.$el.attr("opt-method", Utils.trimToEmpty(value));
  };

  _UIForm.getLabelWidth = function () {
    if (this.options.hasOwnProperty("labelWidth")) return this.options.labelWidth;
    var width = this.$el.attr("opt-lw");
    this.options.labelWidth = Utils.getFormatSize(width, this.isRenderAsRem());
    this.$el.removeAttr("opt-lw");
    return this.options.labelWidth;
  };

  _UIForm.setLabelWidth = function (value) {
    this.options.labelWidth = value;
    this.$el.removeAttr("opt-lw");
  };

  _UIForm.getLabelAlign = function () {
    var align = this.$el.attr("opt-la");
    return /^(center|right)$/.test(align) ? align : "left";
  };

  _UIForm.setLabelAlign = function (value) {
    var align = /^(center|right)$/.test(value) ? align : "left";
    this.options.labelAlign = align;
    this.$el.attr("opt-la", align);
  };

  _UIForm.getOrientation = function () {
    return this.$el.attr("opt-orientate");
  };

  _UIForm.setOrientation = function (value) {
    if (VERTICAL != value && HORIZONTIAL != value) {
      value = this._isRenderAsApp() ? VERTICAL : HORIZONTIAL;
    }

    this.$el.removeClass(VERTICAL);
    this.$el.removeClass(HORIZONTIAL);
    this.$el.addClass(value).attr("opt-orientate", value);
  };

  _UIForm.setButtons = function (value) {
    renderButtons.call(this, $, this.$el, Utils.toArray(value));
  }; // ====================================================


  _UIForm._getItems = function () {
    return this.$el.children(".items").children();
  }; // ====================================================


  var onButtonClickHandler = function onButtonClickHandler(e) {
    var btn = $(e.currentTarget);

    if (btn.parent().is(".is-submit")) {
      this.submit();
    }

    var btnName = btn.attr("name");

    if (btnName) {
      this.trigger("btn_" + btnName);
      this.trigger("btnclick", btnName, btn);
    }
  };

  var onNativeInputKeyHandler = function onNativeInputKeyHandler(e) {
    var input = $(e.currentTarget);
    if (!input.is("input, textarea")) return; // console.log("onNativeInputKeyHandler");

    var item = Utils.parentUntil(input, ".form-item");
    hideErrorMsg.call(this, item);
  };

  var onNativeInputFocusHandler = function onNativeInputFocusHandler(e) {
    var input = $(e.currentTarget);
    if (!input.is("input, textarea")) return; // console.log("onNativeInputFocusHandler");

    var item = Utils.parentUntil(input, ".form-item");
    validateInput.call(this, item, input);
  };

  var onTextViewKeyHandler = function onTextViewKeyHandler(e) {
    var item = Utils.parentUntil(e.currentTarget, ".form-item");
    item.removeClass("is-error");
  };

  var onTextViewFocusHandler = function onTextViewFocusHandler(e) {
    var input = $(e.currentTarget);
    var item = Utils.parentUntil(input, ".form-item");
    var textView = VRender.Component.get(input.parent().parent());
    validateTextView.call(this, item, textView);
  };

  var onValueChangeHandler = function onValueChangeHandler(e) {
    var target = $(e.currentTarget);
    if (target.is("input, textarea, .ui-input")) return; // console.log("onValueChangeHandler");

    var item = Utils.parentUntil(target, ".form-item");
    validateItem.call(this, item);
  };

  var onItemMouseHandler = function onItemMouseHandler(e) {
    var item = Utils.parentUntil(e.currentTarget, ".form-item");

    if (item.is(".is-error")) {
      stopErrorFadeout.call(this, item);

      if (e.type == "mouseenter") {
        item.children(".errmsg").removeClass("animate-out");
      } else
        /*if (e.type == "mouseleave")*/
        {
          startErrorFadeout.call(this, item);
        }
    }
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-form");
    var options = this.options || {};
    renderView.call(this, $, target);
    var labelAlign = this.getLabelAlign();
    if (labelAlign && labelAlign != "left") target.attr("opt-la", labelAlign);
    target.attr("opt-action", Utils.trimToNull(options.action));
    target.attr("opt-method", Utils.trimToNull(options.method));
    var orientation = this.getOrientation();
    target.addClass(orientation).attr("opt-orientate", orientation);

    if (!frontend) {
      if (options.params) {
        target.attr("opt-params", JSON.stringify(options.params));
      }

      var columns = this.getColumns();
      if (columns > 1) target.attr("opt-cols", columns);
      var labelWidth = this.getLabelWidth();
      if (labelWidth) target.attr("opt-lw", labelWidth);
    }

    return this;
  };

  _Renderer.renderData = function () {// do nothing
  }; // ====================================================


  _Renderer.add = function (name, label, index) {
    var datas = Utils.toArray(this.options.data);
    var newData = {
      name: name,
      label: label
    };
    index = Utils.getIndexValue(index);
    if (index >= 0 && index < datas.length) datas.splice(index, 0, newData);else datas.push(newData);
    this.options.data = datas;
    return new FormItem(newData);
  };

  _Renderer.get = function (name) {
    if (Utils.isBlank(name)) return null;
    var datas = Utils.toArray(this.options.data);
    var data = Utils.findBy(datas, "name", name);
    if (data) return new FormItem(data);
    return null;
  };

  _Renderer.getAt = function (index) {
    index = Utils.getIndexValue(index);
    var datas = Utils.toArray(this.options.data);
    if (index >= 0 && index < datas.length) return new FormItem(datas[index]);
    return null;
  };

  _Renderer["delete"] = function (name) {
    if (Utils.isBlank(name)) return null;
    var datas = Utils.toArray(this.options.data);
    var items = Utils.deleteBy(datas, "name", name);
    if (items && items.length > 0) return items.length > 1 ? items : items[0];
    return null;
  };

  _Renderer.deleteAt = function (index) {
    index = Utils.getIndexValue(index);
    var datas = Utils.toArray(this.options.data);
    if (index >= 0 && index < datas.length) return datas.splice(index, 1)[0];
    return null;
  }; // ====================================================


  _Renderer.getColumns = function () {
    if (this._isRenderAsApp()) return 1;
    return parseInt(this.options.columns) || 1;
  };

  _Renderer.getLabelWidth = function () {
    if (!this.hasOwnProperty("labelWidth")) this.labelWidth = Utils.getFormatSize(this.options.labelWidth, this._isRenderAsRem());
    return this.labelWidth;
  };

  _Renderer.getLabelAlign = function () {
    if (!this.hasOwnProperty("labelAlign")) {
      var align = this.options.labelAlign;
      this.labelAlign = /^(left|right|center)$/.test(align) ? align : null;
    }

    return this.labelAlign;
  };

  _Renderer.getOrientation = function () {
    var orientation = this.options.orientation;
    if (VERTICAL == orientation || HORIZONTIAL == orientation) return orientation;
    return this._isRenderAsApp() ? VERTICAL : HORIZONTIAL;
  }; // ====================================================


  var renderView = function renderView($, target) {
    renderItems.call(this, $, target, this.options.data);
    renderButtons.call(this, $, target, this.options.buttons);
  };

  var renderItems = function renderItems($, target, datas) {
    var _this4 = this;

    var items = target.children(".items").empty();
    if (!items || items.length == 0) items = $("<div class='items'></div>").appendTo(target);
    var columns = this.getColumns();
    Utils.each(Utils.toArray(datas), function (data) {
      var item = $("<div class='form-item'></div>").appendTo(items);
      renderOneItem.call(_this4, $, target, item, data);
      var colspan = parseInt(data.colspan) || 1;
      item.attr("opt-col", colspan);

      if (columns > 1 && columns > colspan) {
        item.css("width", (colspan * 100 / columns).toFixed(6) + "%");
      }
    });
  };

  var renderOneItem = function renderOneItem($, target, item, data) {
    if (Utils.isNotBlank(data.name)) item.attr("name", data.name);
    if (Utils.isTrue(data.required)) item.attr("opt-required", "1");
    var empty = Utils.trimToNull(data.empty);
    if (empty) item.attr("opt-empty", empty);
    if (Utils.isNotNull(data.visible) && !Utils.isTrue(data.visible)) item.attr("opt-hide", "1");
    var itemContent = $("<dl class='content'></dl>").appendTo(item);
    var label = $("<dt></dt>").appendTo(itemContent);
    label.text(Utils.trimToEmpty(data.label));
    var labelWidth = this.getLabelWidth();
    if (labelWidth) label.css("width", labelWidth);
    var container = $("<dd></dd>").appendTo(itemContent);
    container = $("<div></div>").appendTo(container);
    var contentView = data.content;

    if (contentView) {
      if (Utils.isFunction(contentView.render)) {
        contentView.render(container);
      } else if (contentView.hasOwnProperty("$el")) {
        container.append(contentView.$el);
      } else {
        container.append(contentView);
      }
    }

    Fn.renderFunction.call(this, item, "validate", data.validate);
  };

  var renderButtons = function renderButtons($, target, datas) {
    var _this5 = this;

    target.children(".btnbar").remove();

    if (datas && datas.length > 0) {
      var btnbar = $("<div class='btnbar'></div>").appendTo(target);
      var labelWidth = this.getLabelWidth();
      if (labelWidth && !this._isRenderAsApp()) btnbar.css("paddingLeft", labelWidth);
      Utils.each(datas, function (data) {
        var button = $("<div></div>").appendTo(btnbar);
        if (data.type == "submit") button.addClass("is-submit");

        if (!frontend) {
          var UIButton = require("../button/index");

          new UIButton(_this5.context, data).render(button);
        } else {
          new UI.button(Utils.extend({}, data, {
            target: button
          }));
        }
      });
    }
  }; ///////////////////////////////////////////////////////


  var validateItem = function validateItem(item, contentView, callback) {
    // console.log("validateItem")
    if (item.attr("opt-hide") == 1) return Utils.isFunction(callback) ? callback(false) : null;
    if (!contentView) contentView = item.children(".content").children("dd").children().children();

    if (contentView.is("input, textarea")) {
      validateInput.call(this, item, contentView, callback);
    } else {
      contentView = VRender.Component.get(contentView) || VRender.FrontComponent.get(contentView) || contentView;

      if (contentView instanceof UI.input) {
        validateTextView.call(this, item, contentView, callback);
      } else if (contentView instanceof UI.dateinput) {
        validateDateInputView.call(this, item, contentView, callback);
      } else if (contentView instanceof UI.daterange) {
        validateDateRangeView.call(this, item, contentView, callback);
      } else if (contentView instanceof UI.select) {
        validateComboboxView.call(this, item, contentView, callback);
      } else if (contentView instanceof UI._select) {
        validateSelectionView.call(this, item, contentView, callback);
      } else if (Utils.isFunction(contentView.getValue)) {
        validateInterfaceView.call(this, item, contentView, contentView.getValue(), callback);
      } else if (Utils.isFunction(contentView.val)) {
        validateInterfaceView.call(this, item, contentView, contentView.val(), callback);
      } else if (Utils.isFunction(callback)) {
        callback(false);
      }
    }
  };

  var validateInput = function validateInput(item, input, callback) {
    // console.log("validateInput");
    doItemValidate.call(this, item, input.val(), callback);
  };

  var validateInterfaceView = function validateInterfaceView(item, view, value, callback) {
    // console.log("validateInterfaceView");
    doItemValidate.call(this, item, value, callback);
  };

  var validateTextView = function validateTextView(item, view, callback) {
    var _this6 = this;

    // console.log("validateTextView")
    view.validate(function () {
      if (view.hasError()) {
        item.addClass("is-error");
        item.children(".errmsg").remove();
      } else {
        item.removeClass("is-error");
        doItemValidate.call(_this6, item, view.val(), callback);
      }
    });
  };

  var validateSelectionView = function validateSelectionView(item, view, callback) {
    // console.log("validateSelectionView")
    doItemValidate.call(this, item, view.getSelectedKey(), callback);
  };

  var validateComboboxView = function validateComboboxView(item, view, callback) {
    // console.log("validateComboboxView")
    if (view.isEditable()) {
      doItemValidate.call(this, item, view.val(), callback);
    } else {
      doItemValidate.call(this, item, view.getSelectedKey(), callback);
    }
  };

  var validateDateInputView = function validateDateInputView(item, view, callback) {
    // console.log("validateDateInputView")
    doItemValidate.call(this, item, view.getDate(), callback);
  };

  var validateDateRangeView = function validateDateRangeView(item, view, callback) {
    // console.log("validateDateRangeView");
    doItemValidate.call(this, item, view.getDateRange(), callback);
  };

  var doItemValidate = function doItemValidate(item, value, callback) {
    var _this7 = this;

    // console.log("doItemValidate");
    if (Utils.isBlank(value)) {
      var error = item.attr("opt-required") == 1 ? item.attr("opt-empty") || "不能为空" : null;
      setItemErrorMsg.call(this, item, error, callback);
    } else {
      var validate = getItemValidate.call(this, item);

      if (Utils.isFunction(validate)) {
        validate(value, function (err) {
          var error = !err ? false : err === true ? "内容不正确" : Utils.trimToNull(err);
          setItemErrorMsg.call(_this7, item, error, callback);
        });
      } else {
        setItemErrorMsg.call(this, item, false, callback);
      }
    }
  };

  var getItemValidate = function getItemValidate(item) {
    var validateFunction = item.data("validate");

    if (!validateFunction) {
      var target = item.children(".ui-fn[name='validate']");

      if (target && target.length > 0) {
        var func = target.text();

        if (Utils.isNotBlank(func)) {
          validateFunction = new Function("var Utils=VRender.Utils;return (" + unescape(func) + ");")();
        }

        target.remove();
      }

      if (!validateFunction) validateFunction = "1"; // 无效的方法

      item.data("validate", validateFunction);
    }

    return validateFunction;
  }; // ====================================================


  var setItemErrorMsg = function setItemErrorMsg(item, errmsg, callback) {
    if (errmsg) {
      showErrorMsg.call(this, item, errmsg);
    } else {
      hideErrorMsg.call(this, item);
    }

    if (Utils.isFunction(callback)) {
      callback(errmsg);
    }
  };

  var showErrorMsg = function showErrorMsg(item, errmsg) {
    item.addClass("is-error");
    var target = item.children(".errmsg");

    if (!target || target.length == 0) {
      target = $("<div class='errmsg'></div>").appendTo(item);
    }

    target.html(errmsg);
    target.removeClass("animate-in").removeClass("animate-out");
    setTimeout(function () {
      target.addClass("animate-in");
    });

    if (!this._isRenderAsApp()) {
      startErrorFadeout.call(this, item);
    }
  }; // 不再是错误的了


  var hideErrorMsg = function hideErrorMsg(item) {
    stopErrorFadeout.call(this, item);

    if (item.is(".is-error")) {
      var target = item.children(".errmsg");
      target.addClass("animate-out");
      setTimeout(function () {
        item.removeClass("is-error");
        target.removeClass("animate-in").removeClass("animate-out");
      }, 300);
    }
  };

  var startErrorFadeout = function startErrorFadeout(item) {
    stopErrorFadeout.call(this, item);
    var hideTimerId = setTimeout(function () {
      item.removeAttr("t-err");
      item.children(".errmsg").addClass("animate-out");
    }, 3000);
    item.attr("t-err", hideTimerId);
  };

  var stopErrorFadeout = function stopErrorFadeout(item) {
    var hideTimerId = parseInt(item.attr("t-err"));

    if (hideTimerId) {
      clearTimeout(hideTimerId);
      item.removeAttr("t-err");
    }
  }; // ====================================================


  var doSubmit = function doSubmit(action, callback) {
    var params = this.getFormData();
    var method = this.getMethod();
    doSubmitBefore.call(this, params, function (error) {
      if (!error) {
        if (/post|put|delete/.test(method)) {
          VRender.send(action, params, function (err, ret) {
            callback(err, ret, params);
          });
        } else {
          VRender.fetch(action, params, function (err, ret) {
            callback(err, ret, params);
          });
        }
      } else {
        callback(error, null, params);
      }
    });
  };

  var doSubmitBefore = function doSubmitBefore(params, callback) {
    var event = {
      type: "action_before"
    };
    this.trigger(event, params);

    if (event.isPreventDefault) {
      callback("canceled");
    } else {
      callback();
    }
  }; ///////////////////////////////////////////////////////


  var FormItem = function FormItem(data) {
    this.data = data;
    this.data.visible = true;
  };

  var _FormItem = FormItem.prototype = new Object();

  _FormItem.getName = function () {
    return this.data.name;
  };

  _FormItem.setName = function (value) {
    this.data.name = value;
    return this;
  };

  _FormItem.getLabel = function () {
    return this.data.label;
  };

  _FormItem.setLabel = function (value) {
    this.data.label = value;
    return this;
  };

  _FormItem.content = function (value) {
    this.data.content = value;
    return this;
  };

  _FormItem.required = function (value) {
    this.data.required = Utils.isNull(value) ? true : Utils.isTrue(value);
    return this;
  };

  _FormItem.visible = function (value) {
    this.data.visible = Utils.isNull(value) ? true : Utils.isTrue(value);
    return this;
  };

  _FormItem.show = function () {
    this.data.visible = true;
    return this;
  };

  _FormItem.hide = function () {
    this.data.visible = false;
    return this;
  };

  _FormItem.emptyMsg = function (value) {
    this.data.empty = value;
    return this;
  };

  _FormItem.validate = function (value) {
    this.data.validate = value;
    return this;
  };

  _FormItem.colspan = function (value) {
    this.datas.colspan = value;
    return this;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIForm = UIForm;
    UI.init(".ui-form", UIForm, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-06-10
// message(原tooltip)
(function (frontend) {
  if (frontend && VRender.Component.ui.message) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UIMessage = UI.message = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIMessage = UIMessage.prototype = new UI._base(false);

  _UIMessage.init = function (target, options) {
    UI._base.init.call(this, target, options);

    this.open();
  }; // ====================================================


  _UIMessage.open = function () {
    doOpen.call(this);

    if (this._isRenderAsApp()) {
      if (this.$el.find(".closebtn").length > 0) this.$el.on("tap", onClickHandler.bind(this));
    } else {
      this.$el.on("tap", ".closebtn", onCloseBtnHandler.bind(this));
      this.$el.on("tap", ".content", onContentClickHandler.bind(this));
      this.$el.on("mouseenter", onMouseHandler.bind(this));
      this.$el.on("mouseleave", onMouseHandler.bind(this));
    }
  };

  _UIMessage.close = function () {
    doClose.call(this);
  }; // ====================================================


  var onClickHandler = function onClickHandler(e) {
    if ($(e.target).is(this.$el)) {
      doClose.call(this);
    }
  };

  var onCloseBtnHandler = function onCloseBtnHandler() {
    doClose.call(this);
  };

  var onContentClickHandler = function onContentClickHandler() {
    this.$el.addClass("active");
  };

  var onMouseHandler = function onMouseHandler(e) {
    if (e.type == "mouseenter") {
      if (this.t_close) {
        clearTimeout(this.t_close);
        this.t_close = null;
      }
    } else {
      this.$el.removeClass("active");
      waitToClose.call(this);
    }
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-message");
    var type = this.getType();
    if (type) target.addClass("show-icon").attr("opt-type", type);
    target.attr("opt-duration", this.getDuration());
    renderView.call(this, $, target);
    return this;
  }; // ====================================================


  _Renderer.getType = function () {
    if (this.options.type == "danger") return "error";
    if (/^(success|warn|error|info)$/i.test(this.options.type)) return this.options.type;
    return null;
  };

  _Renderer.getDuration = function () {
    if (Utils.isBlank(this.options.duration)) return null;
    if (isNaN(this.options.duration)) return null;
    return parseInt(this.options.duration) || 0;
  };

  _Renderer.isClosable = function () {
    if (Utils.isNull(this.options.closable)) return true;
    return Utils.isTrue(this.options.closable);
  }; // ====================================================


  var renderView = function renderView($, target) {
    var container = $("<div class='container'></div>").appendTo(target);
    var icon = $("<i class='img'></i>").appendTo(container);
    var content = $("<div class='content'></div>").appendTo(container);

    if (this.options.hasOwnProperty("focusHtmlContent")) {
      content.html(this.options.focusHtmlContent || "无");
    } else {
      content.text(this.options.content || "无");
    }

    if (this.isClosable()) container.append("<div class='closebtn'></div>");

    if (this.options.icon) {
      target.addClass("show-icon");
      icon.css("backgroundImage", "url(" + this.options.icon + ")");
    }
  }; ///////////////////////////////////////////////////////


  var doOpen = function doOpen() {
    var wrapper = $("body").children(".ui-message-wrap");
    if (!wrapper || wrapper.length == 0) wrapper = $("<div class='ui-message-wrap'></div>").appendTo("body");
    var target = this.$el.appendTo(wrapper);
    setTimeout(function () {
      target.addClass("animate-in");
    }, 50);
    waitToClose.call(this);
  };

  var doClose = function doClose() {
    var target = this.$el.addClass("animate-out");
    setTimeout(function () {
      target.removeClass("animate-in").removeClass("animate-out");
      target.remove();
      var wrapper = $("body").children(".ui-message-wrap");
      if (wrapper.children().length == 0) wrapper.remove();
    }, 500);
    this.trigger("close");
  };

  var waitToClose = function waitToClose() {
    var _this = this;

    if (this.t_close) {
      clearTimeout(this.t_close);
      this.t_close = null;
    }

    var duration = this.$el.attr("opt-duration");
    if (Utils.isBlank(duration)) duration = 3000;else duration = parseInt(duration) || 0;

    if (duration > 0) {
      this.t_close = setTimeout(function () {
        _this.t_close = null;
        doClose.call(_this);
      }, duration);
    }
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIMessage = UIMessage;
    UI.init(".ui-message", UIMessage, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-06-11
// notice
(function (frontend) {
  if (frontend && VRender.Component.ui.notice) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UINotice = UI.notice = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UINotice = UINotice.prototype = new UI._base(false);

  _UINotice.init = function (target, options) {
    UI._base.init.call(this, target, options);

    this.open();
  }; // ====================================================


  _UINotice.open = function () {
    doOpen.call(this);
    this.$el.on("tap", ".closebtn", onCloseBtnHandler.bind(this));

    if (!this._isRenderAsApp()) {
      this.$el.on("mouseenter", onMouseHandler.bind(this));
      this.$el.on("mouseleave", onMouseHandler.bind(this));
    }
  };

  _UINotice.close = function () {
    doClose.call(this);
  }; // ====================================================


  var onCloseBtnHandler = function onCloseBtnHandler() {
    doClose.call(this);
  };

  var onMouseHandler = function onMouseHandler(e) {
    if (e.type == "mouseenter") {
      if (this.t_close) {
        clearTimeout(this.t_close);
        this.t_close = null;
      }
    } else {
      waitToClose.call(this);
    }
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-notice");
    var type = this.getType();
    if (type) target.addClass("show-icon").attr("opt-type", type);
    target.attr("opt-duration", this.getDuration());
    renderView.call(this, $, target);
    return this;
  }; // ====================================================


  _Renderer.getType = function () {
    if (this.options.type == "danger") this.options.type = "error";
    if (/^(success|warn|error|info)$/i.test(this.options.type)) return this.options.type;
    return null;
  };

  _Renderer.getDuration = function () {
    if (Utils.isBlank(this.options.duration)) return null;
    if (isNaN(this.options.duration)) return null;
    return parseInt(this.options.duration) || 0;
  };

  _Renderer.isClosable = function () {
    if (Utils.isNull(this.options.closable)) return true;
    return Utils.isTrue(this.options.closable);
  }; // ====================================================


  var renderView = function renderView($, target) {
    var container = $("<div class='container'></div>").appendTo(target);
    var icon = $("<i class='img'></i>").appendTo(container);
    var title = Utils.trimToNull(this.options.title);
    if (title) $("<div class='title'></div>").appendTo(container).text(title);
    var content = $("<div class='content'></div>").appendTo(container);
    content = $("<div></div>").appendTo(content);

    if (this.options.hasOwnProperty("focusHtmlContent")) {
      content.html(this.options.focusHtmlContent || "无内容");
    } else {
      content.text(this.options.content || "无内容");
    }

    if (this.isClosable()) container.append("<div class='closebtn'></div>");

    if (this.options.icon) {
      target.addClass("show-icon");
      icon.css("backgroundImage", "url(" + this.options.icon + ")");
    }
  }; ///////////////////////////////////////////////////////


  var doOpen = function doOpen() {
    var wrapper = $("body").children(".ui-notice-wrap");
    if (!wrapper || wrapper.length == 0) wrapper = $("<div class='ui-notice-wrap'></div>").appendTo("body");
    var target = this.$el;
    if (this._isRenderAsApp()) wrapper.append(target);else wrapper.prepend(target);
    setTimeout(function () {
      target.addClass("animate-in"); // let maxHeight = target.children()[0].offsetHeight + 10;
      // target.css("maxHeight", maxHeight + "px");
    }, 50);

    if (this._isRenderAsApp()) {
      setTimeout(function () {
        var content = target.find(".content");
        var text = content.children();
        var contentWidth = content.width();

        var _width = text.width() - content.width();

        if (_width > 0) {
          content.addClass("over");
          var time = Math.max(5000, _width * 20);
          text.css("animation", "ui-notice-animate " + time + "ms infinite linear");
        }
      }, 1000);
    }

    waitToClose.call(this);
  };

  var doClose = function doClose() {
    var target = this.$el.addClass("animate-out"); // target.css("maxHeight", "");

    setTimeout(function () {
      target.removeClass("animate-in").removeClass("animate-out");
      target.remove();
      var wrapper = $("body").children(".ui-notice-wrap");
      if (wrapper.children().length == 0) wrapper.remove();
    }, 1500);
    this.trigger("close");
  };

  var waitToClose = function waitToClose() {
    var _this = this;

    if (this.t_close) {
      clearTimeout(this.t_close);
      this.t_close = null;
    }

    var duration = this.$el.attr("opt-duration");
    if (Utils.isBlank(duration)) duration = 10000;else duration = parseInt(duration) || 0;

    if (duration > 0) {
      this.t_close = setTimeout(function () {
        _this.t_close = null;
        doClose.call(_this);
      }, duration);
    }
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UINotice = UINotice;
    UI.init(".ui-notice", UINotice, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-06-13
// dialog
(function (frontend) {
  if (frontend && VRender.Component.ui.dialog) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util;
  var openedDialogs = [];
  var defaultButtons = [{
    name: "cancel",
    label: "取消",
    type: "cancel"
  }, {
    name: "ok",
    label: "确定",
    type: "primary"
  }];
  var defaultButtons2 = [{
    name: "ok",
    label: "确定",
    type: "primary"
  }, {
    name: "cancel",
    label: "取消",
    type: "cancel"
  }]; ///////////////////////////////////////////////////////

  var UIDialog = UI.dialog = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIDialog = UIDialog.prototype = new UI._base(false);

  UIDialog.create = function (options) {
    options = options || {};

    if (!options.target) {
      var target = $("body").children(".ui-dialog-wrap");
      if (!target || target.length == 0) target = $("<div class='ui-dialog-wrap'></div>").appendTo($("body"));
      options.target = target;
    }

    return VRender.Component.create(options, UIDialog, Renderer);
  };

  UIDialog.close = function (view, forceClose, closedHandler) {
    if (!view.is(".ui-dialog")) view = Utils.parentUntil(view, ".ui-dialog");

    if (view && view.length > 0) {
      var dialog = VRender.Component.get(view);
      if (dialog && dialog instanceof UIDialog) dialog.close(forceClose, closedHandler);
    }
  }; // ====================================================


  _UIDialog.init = function (target, options) {
    UI._base.init.call(this, target, options);

    var dialogView = this.dialogView = this.$el.children().children();
    var dialogHeader = dialogView.children("header");
    dialogHeader.on("tap", ".closebtn", closeBtnHandler.bind(this));
    var dialogFooter = dialogView.children("footer");
    dialogFooter.on("tap", ".btnbar > .btn", buttonClickHandler.bind(this));
    var activeBtn = getActiveButton.call(this);
    if (activeBtn && activeBtn.length > 0) activeBtn.on("tap", activeBtnClickHandler.bind(this));

    if (this._isRenderAsApp()) {
      this.$el.on("tap", onTouchHandler.bind(this));
    } else
      /*if (this.$el.is("[opt-size='auto']"))*/
      {
        initResizeEvents.call(this);
      }

    initContentEvents.call(this);
  }; // ====================================================


  _UIDialog.open = function () {
    if (this.isopened) return this;
    this.isopened = true;
    var body = $("body").addClass("ui-scrollless");
    if (body.children(".ui-dialog-mask").length == 0) body.append("<div class='ui-dialog-mask'></div>");
    this.$el.css("display", "").addClass("show-dialog");
    openedDialogs.push(this);

    this._getContentView().trigger("dialog_open");

    var transName = this.$el.attr("opt-trans");

    if (transName) {
      var target = this.$el.addClass(transName + "-open");
      setTimeout(function () {
        target.addClass(transName + "-opened");
      });
      setTimeout(function () {
        target.removeClass(transName + "-open").removeClass(transName + "-opened");
      }, 300);
    }

    this.trigger("opened");
    return this;
  };

  _UIDialog.close = function (forceClose, closedHandler) {
    var _this = this;

    if (!this.isopened) return;

    if (Utils.isFunction(forceClose)) {
      closedHandler = forceClose;
      forceClose = false;
    }

    var event = {
      type: "dialog_close"
    };

    this._getContentView().trigger(event);

    if (!!forceClose || !event.isPreventDefault) {
      this.isopened = false;
      var target = this.$el.removeClass("show-dialog");
      var transName = target.attr("opt-trans");

      if (transName) {
        target.addClass(transName + "-close");
        setTimeout(function () {
          target.addClass(transName + "-closed");
        });
      }

      var delay = !!transName ? 200 : 0;
      setTimeout(function () {
        if (transName) {
          target.removeClass(transName + "-close").removeClass(transName + "-closed");
        }

        var dialogWrap = $("body").children(".ui-dialog-wrap");
        if (_this.$el.parent().is(dialogWrap)) _this.$el.remove();

        for (var i = openedDialogs.length - 1; i >= 0; i--) {
          if (openedDialogs[i] === _this) openedDialogs.splice(i, 1);
        }

        if (openedDialogs.length == 0) {
          var mask = $("body").removeClass("ui-scrollless").children(".ui-dialog-mask").fadeOut(200);
          setTimeout(function () {
            mask.remove();
          }, 200);
        }

        if (Utils.isFunction(closedHandler)) closedHandler();
      }, delay);
      this.trigger("closed");
    }
  }; // ====================================================


  _UIDialog.getTitle = function () {
    return this.dialogView.children("header").find(".title").text();
  };

  _UIDialog.setTitle = function (value) {
    value = Utils.isBlank(value) ? "&nbsp;" : value;
    this.dialogView.children("header").find(".title").html(value);
  };

  _UIDialog.getContent = function () {
    var content = this._getContentView();

    if (content) {
      content = VRender.Component.get(content) || content;
    }

    return content;
  };

  _UIDialog.setContent = function (view) {
    renderContentView.call(this, $, this.$el, view);
    initContentEvents.call(this);
  };

  _UIDialog.setButtons = function (buttons) {
    renderFootButtons.call(this, $, this.$el, buttons);
  };

  _UIDialog.getSize = function () {
    return this.$el.attr("opt-size") || "normal";
  };

  _UIDialog.setSize = function (value) {
    if (/^small|big|auto$/.test(value)) this.$el.attr("opt-size", value);else this.$el.removeAttr("opt-size");
  };

  _UIDialog.isFill = function () {
    return this.$el.attr("opt-fill") == 1;
  };

  _UIDialog.setFill = function (value) {
    if (Utils.isNull(value) || Utils.isTrue(value)) this.$el.attr("opt-fill", "1");else this.$el.removeAttr("opt-fill");
  };

  _UIDialog.isOpen = function () {
    return !!this.isopened;
  }; // ====================================================


  _UIDialog.destory = function () {
    var _this2 = this;

    this.close(true, function () {
      _this2.$el.remove();
    });
  };

  _UIDialog.waiting = function (waitFlag, btnName) {
    var button = null;

    if (Utils.isNotBlank(btnName)) {
      var dialogFooter = this.dialogView.children("footer");
      button = dialogFooter.find(".btnbar > .btn[name='" + btnName + "']");
      if (!(button && button.length > 0)) button = null;
    }

    var waitTime = button && parseInt(button.attr("opt-wait")) || 0;
    if (Utils.isNull(waitFlag) || waitFlag === true) waitTime = waitTime || -1;else if (waitFlag) {
      if (isNaN(waitFlag)) waitTime = Utils.isTrue(waitFlag) ? waitTime || -1 : 0;else waitTime = Math.max(0, parseInt(waitFlag));
    } else {
      waitTime = 0;
    }
    setWaitting.call(this, waitTime, button);
  };

  _UIDialog.setButtonValue = function (name, value) {
    if (Utils.isNotBlank(name) && Utils.isNotNull(value)) {
      var dialogFooter = this.dialogView.children("footer");
      var button = dialogFooter.find(".btnbar > .btn[name='" + name + "']");

      if (button && button.length > 0) {
        button = VRender.Component.get(button.children());
        button && button.setLabel(value);
      }
    }
  }; // ====================================================


  _UIDialog._getContentView = function () {
    return this.dialogView.children("section").children(".container").children();
  };

  _UIDialog._isTouchCloseable = function () {
    return this.options.touchCloseEnabled !== false;
  }; // ====================================================


  var closeBtnHandler = function closeBtnHandler(e) {
    this.close();
  };

  var buttonClickHandler = function buttonClickHandler(e) {
    var _this3 = this;

    var btn = $(e.currentTarget);
    if (btn.is(".disabled, .waiting")) return;
    var btnName = btn.attr("name") || "";
    if (btnName) this._getContentView().trigger("dialog_btn_" + btnName, btnName, this);
    var hasListen = false;

    if (btnName) {
      var btnEventName = "btn_" + btnName;

      if (this.hasListen(btnEventName)) {
        hasListen = true;
        this.trigger(btnEventName, btnName, this);
      }
    }

    if (this.hasListen("btnclk")) {
      hasListen = true;
      this.trigger("btnclk", btnName, this);
    }

    var waitTime = btn.attr("opt-wait");

    if (waitTime || waitTime == 0) {
      // 0也是需要关闭的
      waitTime = parseInt(waitTime) || 0;
      setWaitting.call(this, waitTime, btn);

      if (waitTime > 0) {
        this.closeTimerId = setTimeout(function () {
          _this3.closeTimerId = 0;

          _this3.close();
        }, waitTime);
      }
    } else if (!hasListen) {
      if (/^ok|cancel|submit|close|save|finish$/.test(btnName)) this.close(/^cancel|close$/.test(btnName));
    }
  };

  var activeBtnClickHandler = function activeBtnClickHandler(e) {
    if (this.isMounted()) {
      this.open();
    } else {
      this.activeBtn.off("tap", arguments.callee);
    }
  };

  var windowResizeHandler = function windowResizeHandler() {
    if (this.isMounted()) {
      var container = this.dialogView.children("section").children(".container");
      container.css("maxHeight", $(window).height() - 200);
    } else {
      $(window).off("resize._" + this.getViewId());
    }
  };

  var onTouchHandler = function onTouchHandler(e) {
    if ($(e.target).is(this.$el)) {
      if (this._isTouchCloseable()) this.close();
    }
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-dialog").css("display", "none");
    target.attr("opt-trans", "translate");
    var options = this.options || {};
    if (/^small|big|auto$/.test(options.size)) target.attr("opt-size", options.size);
    if (Utils.isTrue(options.fill)) target.attr("opt-fill", "1");
    target.attr("opt-active", Utils.trimToNull(this.getActiveButton()));
    var container = $("<div class='dialog-container'></div>").appendTo(target);
    var dialogView = $("<div class='dialog-view'></div>").appendTo(container);
    renderDialogHeader.call(this, $, target, dialogView);
    renderDialogContent.call(this, $, target, dialogView);
    renderDialogFooter.call(this, $, target, dialogView);
    return this;
  }; // ====================================================


  _Renderer.getTitle = function () {
    var title = this.options.title;
    if (Utils.isNull(title)) return "标题";
    if (Utils.isBlank(title)) return "&nbsp;";
    return title;
  };

  _Renderer.getActiveButton = function () {
    var button = this.options.openbtn;

    if (!frontend && button) {
      if (typeof button == "string") return button;
      if (Utils.isFunction(button.getViewId)) return "[vid='" + button.getViewId() + "']";
    }

    return null;
  }; // ====================================================


  var renderDialogHeader = function renderDialogHeader($, target, dialogView) {
    var dialogHeader = $("<header></header>").appendTo(dialogView);
    var title = $("<div class='title'></div>").appendTo(dialogHeader);
    title.html(this.getTitle());
    dialogHeader.append("<button class='closebtn'>x</button>");
  };

  var renderDialogContent = function renderDialogContent($, target, dialogView) {
    dialogView.append("<section></section>");
    var contentView = this.options.content || this.options.view;
    renderContentView.call(this, $, target, contentView);
  };

  var renderDialogFooter = function renderDialogFooter($, target, dialogView) {
    dialogView.append("<footer></footer>");
    renderFootButtons.call(this, $, target, this.options.buttons);
  };

  var renderContentView = function renderContentView($, target, contentView) {
    var container = getDialogView(target).children("section").empty();
    container = $("<div class='container'></div>").appendTo(container);

    if (Utils.isNotBlank(contentView)) {
      if (Utils.isFunction(contentView.render)) contentView.render(container);else if (contentView.$el) contentView.$el.appendTo(container);else container.append(contentView);
    }
  };

  var renderFootButtons = function renderFootButtons($, target, buttons) {
    var _this4 = this;

    target.removeClass("has-btns");
    var container = getDialogView(target).children("footer");
    container.children(".btnbar").remove();

    if (!buttons) {
      buttons = this._isRenderAsApp() ? defaultButtons2 : defaultButtons;
      buttons = JSON.parse(JSON.stringify(buttons));
    }

    buttons = Utils.toArray(buttons);

    if (buttons && buttons.length > 0) {
      target.addClass("has-btns");
      var btnbar = $("<div class='btnbar'></div>").appendTo(container);
      btnbar.attr("opt-len", buttons.length);
      Utils.each(buttons, function (button) {
        var btn = $("<div class='btn'></div>").appendTo(btnbar);
        btn.attr("name", button.name);
        if (button.waitclose === true) btn.attr("opt-wait", "-1");else if ((button.waitclose || button.waitclose === 0) && !isNaN(button.waitclose)) btn.attr("opt-wait", Math.max(0, parseInt(button.waitclose)));

        if (!frontend) {
          var UIButton = require("../button/index");

          new UIButton(_this4.context, button).render(btn);
        } else {
          UI.button.create(Utils.extend({}, button, {
            target: btn
          }));
        }
      });
    }
  }; ///////////////////////////////////////////////////////


  var initContentEvents = function initContentEvents() {
    var _this5 = this;

    var contentView = this._getContentView();

    if (contentView && contentView.length > 0) {
      contentView.off("submit_to_dialog");
      contentView.on("submit_to_dialog", function (e, data) {
        _this5.trigger("view_submit", data);

        _this5.close();
      });
    }
  };

  var initResizeEvents = function initResizeEvents() {
    var eventName = "resize._" + this.getViewId();

    var _window = $(window).off(eventName);

    if (this.getSize() == "auto") {
      _window.on(eventName, windowResizeHandler.bind(this));

      windowResizeHandler.call(this);
    }
  }; // ====================================================


  var getDialogView = function getDialogView(target) {
    return target.children(".dialog-container").children(".dialog-view");
  };

  var getActiveButton = function getActiveButton() {
    if (!this.options.hasOwnProperty("openbtn")) {
      this.options.openbtn = this.$el.attr("opt-active");
      this.$el.removeAttr("opt-active");
    }

    var activeBtn = this.options.openbtn;

    if (activeBtn) {
      if (activeBtn.$el) return activeBtn.$el;
      return $(activeBtn);
    }

    return null;
  };

  var setWaitting = function setWaitting(waitTime, btn) {
    var _this6 = this;

    var button = btn ? VRender.Component.get(btn.children()) : null;

    if (waitTime) {
      if (button) {
        btn.addClass("waiting");
        button.waiting();
      } else {
        this.$el.addClass("waiting");
      }

      if (waitTime > 0) {
        setTimeout(function () {
          setWaitting.call(_this6, false, btn);
        }, waitTime);
      }
    } else {
      if (button) {
        btn.removeClass("waiting");
        button.waiting(false);
      } else {
        this.$el.removeClass("waiting");
      }
    }
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIDialog = UIDialog;
    UI.init(".ui-dialog", UIDialog, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-06-10
// confirm
(function (frontend) {
  if (frontend && VRender.Component.ui.confirm) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UIConfirm = UI.confirm = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIConfirm = UIConfirm.prototype = new UI._base(false);

  _UIConfirm.init = function (target, options) {
    UI._base.init.call(this, target, options);

    this.open();
  }; // ====================================================


  _UIConfirm.open = function () {
    doOpen.call(this);
    this.$el.on("tap", ".closebtn", onCloseBtnHandler.bind(this));
    this.$el.on("tap", ".btnbar .ui-btn", onButtonClickHandler.bind(this));
  };

  _UIConfirm.close = function () {
    doClose.call(this);
  };

  _UIConfirm.onSubmit = function (handler) {
    this.submitHandler = handler;
    return this;
  };

  _UIConfirm.onCancel = function (handler) {
    this.cancelHandler = handler;
    return this;
  };

  _UIConfirm._isTouchCloseable = function () {
    return this.options.touchCloseEnabled !== false;
  }; // ====================================================


  var onCloseBtnHandler = function onCloseBtnHandler(e) {
    doCancel.call(this);
  };

  var onButtonClickHandler = function onButtonClickHandler(e) {
    if ($(e.currentTarget).attr("name") == "ok") {
      doSubmit.call(this);
    } else {
      doCancel.call(this);
    }
  };

  var onTouchHandler = function onTouchHandler(e) {
    if ($(e.target).is(this.$el)) {
      if (this._isTouchCloseable()) this.close();
    }
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-confirm");
    renderView.call(this, $, target);
    return this;
  }; // ====================================================


  _Renderer.getConfirmLabel = function () {
    return Utils.trimToNull(this.options.confirmLabel) || "确认";
  };

  _Renderer.getCancelLabel = function () {
    return Utils.trimToNull(this.options.cancelLabel) || "取消";
  }; // ====================================================


  var renderView = function renderView($, target) {
    var container = $("<div class='container'></div>").appendTo(target);
    var title = Utils.trimToNull(this.options.title);
    if (title) $("<div class='title'></div>").appendTo(container).text(title);
    var content = $("<div class='content'></div>").appendTo(container);
    content = $("<div></div>").appendTo(content);

    if (this.options.hasOwnProperty("focusHtmlContent")) {
      content.html(this.options.focusHtmlContent || "无内容");
    } else {
      content.text(this.options.content || "无内容");
    }

    var btnbar = $("<div class='btnbar'></div>").appendTo(container);
    addButton($, btnbar, {
      name: "ok",
      label: this.getConfirmLabel(),
      type: "primary"
    });
    addButton($, btnbar, {
      name: "cancel",
      label: this.getCancelLabel()
    });
    $("<span class='closebtn'></span>").appendTo(container);
  }; ///////////////////////////////////////////////////////


  var doOpen = function doOpen() {
    var wrapper = $("body").children(".ui-confirm-wrap");

    if (!wrapper || wrapper.length == 0) {
      wrapper = $("<div class='ui-confirm-wrap'></div>").appendTo("body");

      if (this._isRenderAsApp()) {
        wrapper.on("tap", function (e) {
          if ($(e.target).is(wrapper)) {
            var confirm = wrapper.children().last();
            confirm = UIConfirm.instance(confirm);
            if (confirm._isTouchCloseable()) confirm.close();
          }
        });
      }
    }

    var target = this.$el.appendTo(wrapper);
    setTimeout(function () {
      target.addClass("animate-in");
    }, 50);
  };

  var doClose = function doClose() {
    var target = this.$el.addClass("animate-out");
    setTimeout(function () {
      target.removeClass("animate-in").removeClass("animate-out");
      target.remove();
      var wrapper = $("body").children(".ui-confirm-wrap");
      if (wrapper.children().length == 0) wrapper.remove();
    }, 300);
    this.trigger("close");
  };

  var doSubmit = function doSubmit() {
    doClose.call(this);
    if (Utils.isFunction(this.submitHandler)) this.submitHandler();
    this.trigger("submit");
  };

  var doCancel = function doCancel() {
    doClose.call(this);
    if (Utils.isFunction(this.cancelHandler)) this.cancelHandler();
    this.trigger("cancel");
  }; // ====================================================


  var addButton = function addButton($, target, data) {
    target = $("<div></div>").appendTo(target);

    if (!frontend) {
      var UIButton = require("../button/index");

      new UIButton(this.context, data).render(target);
    } else {
      UI.button.create(Utils.extend(data, {
        target: target
      }));
    }
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIConfirm = UIConfirm;
    UI.init(".ui-confirm", UIConfirm, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-06-12
// popupmenu
(function (frontend) {
  if (frontend && VRender.Component.ui.popupmenu) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UIPopupMenu = UI.popupmenu = function (view, options) {
    return UI._items.call(this, view, options);
  };

  var _UIPopupMenu = UIPopupMenu.prototype = new UI._items(false);

  _UIPopupMenu.init = function (target, options) {
    UI._items.init.call(this, target, options);

    this.options.autoLoad = false;
    this.setActionTarget(this.getActionTarget());
    this.$el.on("tap", onClickHandler.bind(this));
    this.$el.on("tap", ".menu", onItemClickHandler.bind(this));
    this.$el.on("tap", ".more", onMoreClickHandler.bind(this));

    if (this._isRenderAsApp()) {
      this.$el.on("tap", ".back", onBackClickHandler.bind(this));
    } else {
      this.$el.on("mouseenter", ".menu", onItemMouseEnterHandler.bind(this));
      this.$el.on("mouseleave", ".menu", onItemMouseLeaveHandler.bind(this));
      this.$el.on("mouseenter", ".menu-container > .btn", onScrollMouseEnterHandler.bind(this));
      this.$el.on("mouseleave", ".menu-container > .btn", onScrollMouseLeaveHandler.bind(this));
    }
  }; // ====================================================


  _UIPopupMenu.open = function () {
    var _this = this;

    var target = this.$el.show();
    doOpen.call(this, target);

    if (this._isRenderAsApp()) {
      $("body").addClass("ui-scrollless");
      setTimeout(function () {
        target.addClass("animate-open");
      });
    } else {
      setTimeout(function () {
        $("body").on("click.hide_" + _this.getViewId(), function () {
          _this.close();

          _this.trigger("cancel");
        });
      });
    }
  };

  _UIPopupMenu.close = function () {
    var target = this.$el;

    if (this._isRenderAsApp()) {
      $("body").removeClass("ui-scrollless");
      target.removeClass("animate-open");
      target.children(".menu-container").last().height(0);
      setTimeout(function () {
        target.empty().hide();
      }, 300);
    } else {
      target.empty().hide();
      $("body").off("click.hide_" + this.getViewId());
    }
  };

  _UIPopupMenu.destory = function () {
    var _this2 = this;

    this.close();
    setTimeout(function () {
      _this2.$el.remove();
    }, 300);
  }; // ====================================================


  _UIPopupMenu.getActionTarget = function () {
    if (this.options.hasOwnProperty("actionTarget")) return this.options.actionTarget;
    this.options.actionTarget = Utils.trimToNull(this.$el.attr("opt-target"));
    this.$el.removeAttr("opt-target");
    return this.options.actionTarget;
  };

  _UIPopupMenu.setActionTarget = function (value) {
    if (this.actionTarget == value) return;
    var actionType = Utils.trimToNull(this.getActionType()) || "tap";
    var eventType = actionType + "._" + this.getViewId();

    if (this.actionTarget) {
      if (typeof this.actionTarget == "string") $("body").off(eventType, this.actionTarget);else // if (Utils.isFunction(this.actionTarget.off))
        this.actionTarget.off(eventType);
    }

    this.actionTarget = value;

    if (this.actionTarget) {
      if (typeof this.actionTarget == "string") $("body").on(eventType, this.actionTarget, onActionTargetHandler.bind(this));else {
        this.actionTarget = $(this.actionTarget);
        this.actionTarget.on(eventType, onActionTargetHandler.bind(this));
      }
    }

    this.$el.removeAttr("opt-target");
  };

  _UIPopupMenu.getActionType = function () {
    if (this.options.hasOwnProperty("actionType")) return this.options.actionType;
    this.options.actionType = Utils.trimToNull(this.$el.attr("opt-trigger"));
    this.$el.removeAttr("opt-trigger");
    return this.options.actionType;
  };

  _UIPopupMenu.setActionType = function (value) {
    this.options.actionType = value;
    this.$el.removeAttr("opt-trigger");
  };

  _UIPopupMenu.getIconField = function () {
    if (this.options.hasOwnProperty("iconField")) return this.options.iconField;
    this.options.iconField = Utils.trimToNull(this.$el.attr("opt-ic")) || "icon";
    this.$el.removeAttr("opt-ic");
    return this.options.iconField;
  };

  _UIPopupMenu.setIconField = function (value) {
    this.options.iconField = value;
    this.$el.removeAttr("opt-ic");
  };

  _UIPopupMenu.getIconFunction = function () {
    return Fn.getFunction.call(this, "iconFunction", "icfunc");
  };

  _UIPopupMenu.setIconFunction = function (value) {
    this.options.iconFunction = value;
    this.$el.children(".ui-fn[name='icfunc']").remove();
  };

  _UIPopupMenu.getOffsetLeft = function () {
    if (!this.options.hasOwnProperty("offsetLeft")) {
      this.options.offsetLeft = this.$el.attr("opt-offsetl");
      this.$el.removeAttr("opt-offsetl");
    }

    if (this.options.offsetLeft) return Utils.getFormatSize(this.options.offsetLeft, this._isRenderAsRem());
    return null;
  };

  _UIPopupMenu.setOffsetLeft = function (value) {
    this.options.offsetLeft = value;
    this.$el.removeAttr("opt-offsetl");
  };

  _UIPopupMenu.getOffsetTop = function () {
    if (!this.options.hasOwnProperty("offsetTop")) {
      this.options.offsetTop = this.$el.attr("opt-offsett");
      this.$el.removeAttr("opt-offsett");
    }

    if (this.options.offsetTop) return Utils.getFormatSize(this.options.offsetTop, this._isRenderAsRem());
    return null;
  };

  _UIPopupMenu.setOffsetTop = function (value) {
    this.options.offsetTop = value;
    this.$el.removeAttr("opt-offsett");
  }; // ====================================================
  // 以下供子类继承


  _UIPopupMenu._getChildrenField = function () {
    return "children";
  };

  _UIPopupMenu._getDisabledField = function () {
    return "disabled";
  };

  _UIPopupMenu._getIcon = function (data) {
    var iconFunction = this.getIconFunction();
    if (Utils.isFunction(iconFunction)) return iconFunction(data);
    var iconField = this.getIconField();
    return data && iconField ? data[iconField] : null;
  };

  _UIPopupMenu._isDisabled = function (data) {
    if (data) {
      var disabledField = this._getDisabledField();

      if (disabledField) {
        if (Utils.isTrue(data[disabledField])) return true;
      }

      return false;
    }

    return true;
  };

  _UIPopupMenu._isChecked = function (data) {
    if (data) {
      return !!data.checked;
    }

    return false;
  };

  _UIPopupMenu._checkIfEmpty = function () {// do nothing
  }; // ====================================================


  var onActionTargetHandler = function onActionTargetHandler(e) {
    if (!this.isMounted(this.$el)) {
      this.setActionTarget(null);
    } else {
      this.open();
    }
  };

  var onClickHandler = function onClickHandler(e) {
    if (this._isRenderAsApp()) {
      if ($(e.target).is(".ui-popupmenu")) {
        this.close();
        this.trigger("cancel");
      }
    }

    return false;
  };

  var onItemClickHandler = function onItemClickHandler(e) {
    var _this3 = this;

    var item = $(e.currentTarget);
    if (item.is(".disabled")) return;

    if (item.is(".has-child")) {
      if (this._isRenderAsApp()) doOpen.call(this, item);
    } else {
      var data = getItemData.call(this, item);

      if (data.toggle) {
        if (!data.checked) {
          var _loop = function _loop(datas) {
            if (!(datas && datas.length > 0)) return;
            Utils.each(datas, function (_data) {
              if (Utils.isArray(_data)) {
                _loop(_data);
              } else {
                if (_data.toggle === data.toggle) _data.checked = false;

                _loop(getSubDatas.call(_this3, _data));
              }
            });
          };

          _loop(this.getData());

          data.checked = true;
        } else if (!data.toggleRadio) {
          data.checked = false;
        }
      }

      this.trigger("itemclick", data);
      this.close();
    }
  };

  var onMoreClickHandler = function onMoreClickHandler(e) {
    var item = $(e.currentTarget);
    var container = item.parent().parent().parent();
    var api = getLoadApi.call(this);
    var params = getLoadParams.call(this);
    params.p_no = parseInt(item.attr("page-no")) || 1;
    params.p_no += 1;
    var parentData = container.data("itemData");
    params.pid = this._getDataKey(parentData);
    item.parent().remove();
    var datas = !parentData ? this.getData() : getSubDatas.call(this, parentData);
    datas.pop();
    doLoad.call(this, container, api, params, function (err, _datas) {
      if (_datas && _datas.length > 0) {
        Utils.each(_datas, function (temp) {
          datas.push(temp);
        });
      }
    });
  };

  var onBackClickHandler = function onBackClickHandler(e) {
    var item = $(e.currentTarget);
    var container = item.parent();
    container.height(0);
    var prevContainer = container.prev();
    prevContainer.height(0);
    setTimeout(function () {
      container.remove();
      prevContainer.height(prevContainer.get(0).scrollHeight);
    }, 120);
  };

  var onItemMouseEnterHandler = function onItemMouseEnterHandler(e) {
    var item = $(e.currentTarget);
    if (item.is(".disabled")) return;
    var container = item.parent().parent().parent();
    var lastItem = container.find(".hover");

    if (lastItem && lastItem.length > 0) {
      lastItem.removeClass("hover");
      closeAfter.call(this, container);
      var timerId = parseInt(lastItem.attr("t-hover"));

      if (timerId) {
        clearTimeout(timerId);
        lastItem.removeAttr("t-hover");
      }
    }

    item.addClass("hover");
    if (item.is(".has-child")) doOpen.call(this, item);
  };

  var onItemMouseLeaveHandler = function onItemMouseLeaveHandler(e) {
    var item = $(e.currentTarget);
    var container = item.data("submenu");

    if (!container || container.length == 0) {
      var timerId = setTimeout(function () {
        item.removeClass("hover");
        item.removeAttr("t-hover");
      }, 100);
      item.attr("t-hover", timerId);
    }
  };

  var onScrollMouseEnterHandler = function onScrollMouseEnterHandler(e) {
    var btn = $(e.currentTarget);
    var container = btn.parent();

    var _scroll = function _scroll() {
      var menuContainer = container.children(".menus");
      var maxHeight = container.height() - menuContainer.height();
      var top = parseInt(container.attr("scroll-top")) || 0;
      var step = btn.is(".up") ? 5 : -5;

      var __scroll = function __scroll() {
        var timerId = setTimeout(function () {
          var _top = top + step;

          if (btn.is(".up")) {
            if (_top > 0) _top = 0;
          } else {
            if (_top < maxHeight) _top = maxHeight;
          }

          if (top != _top) {
            top = _top;
            container.attr("scroll-top", top);
            menuContainer.css("transform", "translate(0px, " + top + "px)");
          }

          __scroll();
        }, 50);
        container.attr("t_scroll", timerId);
      };

      __scroll();
    }; // 停留一段时间开始滚动


    container.attr("t_scroll", setTimeout(_scroll, 200));
  };

  var onScrollMouseLeaveHandler = function onScrollMouseLeaveHandler(e) {
    var container = $(e.currentTarget).parent();
    var timerId = parseInt(container.attr("t_scroll"));

    if (timerId) {
      clearTimeout(timerId);
      container.removeAttr("t_scroll");
    }
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._itemsRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._itemsRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-popupmenu");
    var options = this.options || {};

    if (!frontend) {
      var actionTarget = options.actionTarget;

      if (actionTarget) {
        if (typeof actionTarget == "string") target.attr("opt-target", Utils.trimToEmpty(actionTarget));else if (Utils.isFunction(actionTarget.getViewId)) target.attr("opt-target", "[vid='" + actionTarget.getViewId() + "']");
      }

      if (options.actionType) target.attr("opt-trigger", options.actionType);
      var iconFunction = options.iconFunction;
      if (Utils.isFunction(iconFunction)) BaseRender.fn.renderFunction(target, "icfunc", iconFunction);else if (options.iconField) target.attr("opt-ic", options.iconField);
      if (options.childrenField) target.attr("opt-child", options.childrenField);
      if (options.disabledField) target.attr("opt-disable", options.disabledField);
      if (options.offsetLeft) target.attr("opt-offsetl", options.offsetLeft);
      if (options.offsetTop) target.attr("opt-offsett", options.offsetTop);
    }

    return this;
  }; // ====================================================


  _Renderer.doAdapter = function (data, i) {
    var _this4 = this;

    if (Utils.isArray(data)) {
      var _data = Utils.map(data, function (temp) {
        return Fn.doAdapter.call(_this4, temp);
      });

      if (data.title) {
        if (backend) _data.unshift({
          __group__: data.title
        });else _data.title = data.title;
      }

      return _data;
    }

    return Fn.doAdapter.call(this, data, i);
  }; // ====================================================


  _Renderer._renderItems = function ($, target) {// 统一在前端渲染
    // target.empty();
    // let datas = this.getData();
    // if (datas && datas.length > 0) {
    // 	let container = $("<div class='menu-container'></div>").appendTo(target);
    // 	container.append("<div class='btn up'></div>");
    // 	container.append("<ul class='menus'></ul>");
    // 	container.append("<div class='btn down'></div>");
    // 	renderItems.call(this, $, container.children("ul"), datas);
    // }
  };

  _Renderer._renderEmptyView = function () {// do nothing
  };

  _Renderer._renderLoadView = function () {// do nothing
  }; // ====================================================


  var renderMenuItems = function renderMenuItems(menuContainer, datas) {
    var _this5 = this;

    if (!datas || datas.length == 0) return;
    var group = menuContainer.children(".grp").last();
    Utils.each(datas, function (data, i) {
      if (Utils.isArray(data) && data.length > 0) {
        group = $("<div class='grp'></div>").appendTo(menuContainer);
        if (data.title) $("<div class='title'></div>").appendTo(group).text(data.title);
        Utils.each(data, function (temp, j) {
          if (j === 0 && temp.__group__) {
            $("<div class='title'></div>").appendTo(group).text(temp.__group__);
          } else if (temp.__type__ == "more") {
            var more = $("<div class='more'></div>").appendTo(group);
            more.attr("page-no", temp.page);
            more.text(_this5.options.moreText || "加载更多");
          } else {
            var item = $("<div class='menu'></div>").appendTo(group);
            renderOneMenuItem.call(_this5, item, temp);
          }
        });
        group = null;
      } else {
        if (!group || group.length == 0) group = $("<div class='grp'></div>").appendTo(menuContainer);
        var item = $("<div class='menu'></div>").appendTo(group);
        renderOneMenuItem.call(_this5, item, data);
      }
    });

    if (this._isRenderAsApp()) {
      var container = menuContainer.parent();
      container.height(0);
      setTimeout(function () {
        container.height(container.get(0).scrollHeight);
      });
    }
  };

  var renderOneMenuItem = function renderOneMenuItem(item, data) {
    item.data("itemData", data);

    var iconUrl = this._getIcon(data);

    if (Utils.isNotBlank(iconUrl)) {
      var icon = $("<i></i>").appendTo(item);
      icon.css("backgroundImage", "url(" + iconUrl + ")");
    }

    var content = $("<div></div>").appendTo(item);
    var itemRenderer = this.getItemRenderer();

    if (Utils.isFunction(itemRenderer)) {
      var result = itemRenderer($, content, data);
      if (Utils.isNotNull(result)) content.empty().append(result);
    } else {
      var label = this._getDataLabel(data);

      content.text(Utils.trimToEmpty(label));
    }

    if (!!getSubDatas.call(this, data)) item.addClass("has-child");
    if (this._isDisabled(data)) item.addClass("disabled").attr("disabled", "disabled");
    if (this._isChecked(data)) item.addClass("checked");
  }; ///////////////////////////////////////////////////////


  var doOpen = function doOpen(item) {
    var data = getItemData.call(this, item);
    var subDatas = getItemSubDatas.call(this, item);
    var datas = doOpenBefore.call(this, item, data, subDatas);

    if (Utils.isNull(datas)) {
      if (!tryLoadData.call(this, item)) return;
    } else if (!(datas && datas.length > 0)) {
      if (!tryLoadData.call(this, item)) return;
    }

    var container = $("<div class='menu-container'></div>").appendTo(this.$el);
    container.append("<div class='btn up'></div><div class='btn down'></div>");

    if (this._isRenderAsApp() && !isRootItem(item)) {
      $("<div class='back'></div>").appendTo(container).text(this.options.backText || "返回");
    }

    var menuContainer = $("<div class='menus'></div>").appendTo(container);
    renderMenuItems.call(this, menuContainer, datas);
    item.data("submenu", container);
    container.data("itemData", data);
    doOpenAfter.call(this, item, container);
    this.trigger("open", data);
  };

  var doOpenBefore = function doOpenBefore(item, data, subDatas) {
    var event = {
      type: "open_before"
    };
    this.trigger(event, data, subDatas);
    if (event.hasOwnProperty("returnValue")) subDatas = event.returnValue;
    var datas = !!subDatas ? Utils.toArray(subDatas) : null;

    if (data) {
      var childrenField = this._getChildrenField();

      data[childrenField] = datas;
    }

    return datas;
  };

  var doOpenAfter = function doOpenAfter(item, container) {
    if (!this._isRenderAsApp()) {
      var _isRootItem = isRootItem(item);

      if (_isRootItem) {
        container.css("left", this.getOffsetLeft() || "");
        container.css("top", this.getOffsetTop() || "");
      } else {
        var _offset2 = item.offset();

        _offset2.top -= 3;
        _offset2.left += item.outerWidth() + 1;
        container.offset(_offset2);
      }

      var offset = Utils.offset(container);
      var maxHeight = offset.windowHeight;
      if (_isRootItem) maxHeight -= offset.top;
      container.css("maxHeight", maxHeight + "px");

      if (!_isRootItem) {
        var _offset = container.offset();

        if (offset.isOverflowX) {
          _offset.left -= offset.width + item.outerWidth();
        }

        if (offset.isOverflowY) {
          _offset.top -= offset.top + offset.height - offset.windowHeight;
        }

        container.offset({
          left: _offset.left,
          top: _offset.top
        });
      }

      if (container.height() < container.children(".menus").height()) container.addClass("scroll").css("minHeight", "80px");
    }
  };

  var closeAfter = function closeAfter(menuContainer) {
    var menus = this.$el.children(".menu-container");
    var index = menuContainer.index();

    for (var i = menus.length - 1; i >= 0; i--) {
      if (index >= i) return;
      menus.eq(i).remove();
    }
  }; // ====================================================


  var tryLoadData = function tryLoadData(item) {
    var _this6 = this;

    var apiName = getLoadApi.call(this);
    if (Utils.isBlank(apiName)) return false;
    var apiParams = getLoadParams.call(this) || {};
    apiParams.p_no = 1;
    apiParams.pid = getItemId.call(this, item);
    setTimeout(function () {
      var container = item.data("submenu");
      doLoad.call(_this6, container, apiName, apiParams, function (err, datas) {
        var isEmpty = false;

        if (!datas || datas.length == 0) {
          isEmpty = true;
          datas = [{
            label: "没有选项"
          }];
          datas[0][_this6._getDisabledField()] = true;
        }

        if (isRootItem(item)) _this6.options.data = datas;else {
          var data = getItemData.call(_this6, item);
          if (data) data[_this6._getChildrenField()] = datas;
        }

        if (isEmpty) {
          renderMenuItems.call(_this6, container.children(".menus"), datas);
        }
      });
    }, 0);
    return true;
  };

  var doLoad = function doLoad(container, api, params, callback) {
    var _this7 = this;

    var menuContainer = container.children(".menus");
    var loadingGrp = $("<div class='grp'></div>").appendTo(menuContainer);
    var loadingItem = $("<div class='loading'></div>").appendTo(loadingGrp);
    loadingItem.append(this.options.loadingText || "正在加载...");
    VRender.Component.load.call(this, api, params, function (err, data) {
      loadingGrp.remove();
      var datas = !err ? Utils.toArray(data) : null;

      if (datas && datas.length > 0) {
        datas[0].children = [];

        if (_this7.hasMore()) {
          datas.push([{
            __type__: "more",
            page: _this7._pageInfo.page
          }]);
        }

        renderMenuItems.call(_this7, menuContainer, datas);
      }

      callback(err, datas);
    });
  };

  var getLoadApi = function getLoadApi() {
    if (this.lastLoadApi) return this.lastLoadApi;
    if (this.options.hasOwnProperty("api")) return this.options.api;
    return this.$el.attr("api-name");
  };

  var getLoadParams = function getLoadParams() {
    if (this.lastLoadParams) return this.lastLoadParams;
    if (this.options.hasOwnProperty("params")) return this.options.params;

    try {
      return JSON.parse(this.$el.attr("api-params") || null);
    } catch (e) {}

    return null;
  }; // ====================================================


  var isRootItem = function isRootItem(item) {
    return item.is(".ui-popupmenu");
  };

  var getItemId = function getItemId(item) {
    return this._getDataKey(getItemData.call(this, item));
  };

  var getItemData = function getItemData(item) {
    if (isRootItem(item)) return null;
    return item.data("itemData");
  };

  var getItemSubDatas = function getItemSubDatas(item) {
    if (isRootItem(item)) return this.getData();
    var data = getItemData.call(this, item);
    return getSubDatas.call(this, data);
  };

  var getSubDatas = function getSubDatas(data) {
    if (data) {
      var childrenField = this._getChildrenField();

      if (Utils.isArray(data[childrenField])) return data[childrenField];
    }

    return null;
  }; // const hasSubDatas = function (data) {
  // 	let datas = getSubDatas.call(this, data);
  // 	if (!!datas)
  // 		return true;
  // 	if (data) {
  // 		if (data.hasOwnProperty("hasChild")) {
  // 			if (Utils.isTrue(data.hasChild))
  // 				return true;
  // 		}
  // 		if (data.hasOwnProperty("leaf")) {
  // 			if (Utils.isTrue(data.leaf))
  // 				return false;
  // 		}
  // 	}
  // 	return false;
  // };
  ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIPopupMenu = UIPopupMenu;
    UI.init(".ui-popupmenu", UIPopupMenu, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-07-22
// paginator
(function (frontend) {
  if (frontend && VRender.Component.ui.paginator) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util;
  var defaultPageSize = 20;
  var defaultShowNum = 10; ///////////////////////////////////////////////////////

  var UIPaginator = UI.paginator = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIPaginator = UIPaginator.prototype = new UI._base(false);

  _UIPaginator.init = function (target, options) {
    UI._base.init.call(this, target, options);

    this.$el.on("tap", "button.btn", buttonClickHandler.bind(this));
    this.$el.on("tap", ".pagebar .page", pageClickHandler.bind(this));
    this.$el.on("tap", ".pagebar .lbl", dropdownLabelHandler.bind(this));

    if (this._isRenderAsApp()) {
      this.$el.on("tap", ".pagebar .dropdown", dropdownTouchHandler.bind(this));
    } else {
      this.$el.on("tap", ".sizebar .lbl", sizebarLabelHandler.bind(this));
      this.$el.on("tap", ".sizebar li", sizebarClickHandler.bind(this));
      this.$el.on("keydown", ".skipbar input", inputKeyHandler.bind(this));
    }
  }; // ====================================================


  _UIPaginator.set = function (total, page, size) {
    var snapshoot = this._snapshoot();

    setInner.call(this, total, page, size);
    snapshoot.done();
  };

  _UIPaginator.getPage = function () {
    return parseInt(this.$el.attr("data-no")) || 1;
  };

  _UIPaginator.setPage = function (value) {
    var snapshoot = this._snapshoot();

    setInner.call(this, null, value);
    snapshoot.done();
  };

  _UIPaginator.getSize = function () {
    return parseInt(this.$el.attr("data-size")) || 0;
  };

  _UIPaginator.setSize = function (value) {
    setInner.call(this, null, null, value);
  };

  _UIPaginator.getTotal = function () {
    return parseInt(this.$el.attr("data-total")) || 0;
  };

  _UIPaginator.setTotal = function (value) {
    var snapshoot = this._snapshoot();

    setInner.call(this, value);
    snapshoot.done();
  };

  _UIPaginator.getPageNo = function () {
    return this.getPage();
  };

  _UIPaginator.setPageNo = function (value) {
    this.setPage(value);
  };

  _UIPaginator.getPageCount = function () {
    return parseInt(this.$el.attr("data-pages")) || 1;
  };

  _UIPaginator.getMode = function () {
    return this.$el.attr("opt-mode") || false;
  };

  _UIPaginator.setMode = function (value) {
    this.$el.attr("opt-mode", getMode(value) || "");
    reRenderView.call(this);
  };

  _UIPaginator.getSizes = function () {
    var sizes = this.$el.attr("opt-sizes") || "";
    return getSizes(sizes.split(","));
  };

  _UIPaginator.setSizes = function (value) {
    var sizes = Utils.isArray(value) ? value : null;
    if (sizes) sizes = getSizes(sizes);
    if (sizes && sizes.length > 0) this.$el.attr("opt-sizes", sizes.join(","));else this.$el.removeAttr("opt-sizes");
    reRenderView.call(this);
  };

  _UIPaginator.getShowNum = function () {
    return parseInt(this.$el.attr("opt-nums")) || getShowNum(-1);
  };

  _UIPaginator.setShowNum = function (value) {
    value = parseInt(value) || 0;

    if (value > 0) {
      this.$el.attr("opt-nums", value);
      reRenderView.call(this);
    }
  };

  _UIPaginator.getStatus = function () {
    var status = this.$el.attr("opt-status");
    if (status === "_default") return "共{totalCount}条";
    return status || "";
  };

  _UIPaginator.setStatus = function (value) {
    value = getStatus(value);
    if (value) this.$el.attr("opt-status", value);else this.$el.removeAttr("opt-status");
    reRenderView.call(this);
  };

  _UIPaginator.getSkip = function () {
    var skip = this.$el.attr("opt-skip");
    if (skip == 1) return true;
    return skip ? skip.split("♮") : false;
  };

  _UIPaginator.setSkip = function (value) {
    value = getSkip(value);
    if (value) this.$el.attr("opt-skip", value);else this.$el.removeAttr("opt-skip");
    reRenderView.call(this);
  };

  _UIPaginator.getButtons = function () {
    if (this.options.hasOwnProperty("buttons")) return this.options.buttons;
    var buttons = this.$el.attr("opt-btns");
    if (buttons === "") return false;
    return buttons ? JSON.parse(buttons) : null;
  };

  _UIPaginator.setButtons = function (value) {
    this.options.buttons = value;
    this.$el.removeAttr("opt-btn");
    reRenderView.call(this);
  }; // ====================================================


  _UIPaginator.rerender = function () {
    reRenderView.call(this);
  };

  _UIPaginator._snapshoot_shoot = function (state) {
    state.data = {
      page: this.getPageNo(),
      size: this.getSize()
    };
  };

  _UIPaginator._snapshoot_compare = function (state) {
    return state.data.page == this.getPageNo();
  };

  _UIPaginator._isFirst = function () {
    return this.$el.is(".is-first");
  };

  _UIPaginator._isLast = function () {
    return this.$el.is(".is-last");
  }; // ====================================================


  var buttonClickHandler = function buttonClickHandler(e) {
    var btn = $(e.currentTarget);
    if (btn.is(".disabled")) return false;

    if (btn.is(".skip")) {
      var skipInput = this.$el.find(".skipbar input");
      var page = parseInt(skipInput.val()) || 0;
      if (page > 0 && page != this.getPageNo()) this.setPageNo(page);
      skipInput.val("");
    } else {
      var pageNo = this.getPageNo();

      if (btn.is(".prev")) {
        if (!this._isFirst()) this.setPageNo(pageNo - 1);
      } else if (btn.is(".next")) {
        if (!this._isLast()) this.setPageNo(pageNo + 1);
      } else if (btn.is(".first")) {
        if (!this._isFirst()) this.setPageNo(1);
      } else if (btn.is(".last")) {
        if (!this._isLast()) this.setPageNo(this.getPageCount());
      }
    }
  };

  var pageClickHandler = function pageClickHandler(e) {
    var _this = this;

    var item = $(e.currentTarget);
    if (item.is(".selected")) return false;

    if (this.getMode() == "dropdown") {
      hidePageDropdown.call(this);
      setTimeout(function () {
        _this.setPageNo(item.text());
      }, 300);
    } else {
      this.setPageNo(item.text());
    }

    return false;
  };

  var dropdownLabelHandler = function dropdownLabelHandler(e) {
    showPageDropdown.call(this);
  };

  var dropdownMouseHandler = function dropdownMouseHandler(e) {
    Fn.mouseDebounce(e, hidePageDropdown.bind(this));
  };

  var dropdownTouchHandler = function dropdownTouchHandler(e) {
    hidePageDropdown.call(this);
  };

  var sizebarLabelHandler = function sizebarLabelHandler(e) {
    showSizeDropdown.call(this);
  };

  var sizebarClickHandler = function sizebarClickHandler(e) {
    var size = parseInt($(e.currentTarget).text());

    if (size && size != this.getSize()) {
      this.setSize(size);
    }

    hideSizeDropdown.call(this);
  };

  var sizebarMouseHandler = function sizebarMouseHandler(e) {
    Fn.mouseDebounce(e, hideSizeDropdown.bind(this));
  };

  var inputKeyHandler = function inputKeyHandler(e) {
    if (e.type == "keydown") {
      if (e.which == 13) {
        var input = $(e.currentTarget);
        var page = parseInt(input.val()) || 0;
        if (page > 0 && page != this.getPageNo()) this.setPageNo(page);
        input.val("");
        return true;
      }

      return Utils.isControlKey(e) || Utils.isNumberKey(e);
    }
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-paginator");
    var pageInfo = getPageInfos.call(this);
    target.attr("data-no", pageInfo.pageNo);
    target.attr("data-size", pageInfo.pageSize);
    target.attr("data-pages", pageInfo.pageCount);
    target.attr("data-total", pageInfo.totalCount);
    target.attr("opt-mode", pageInfo.mode || "");
    target.attr("opt-nums", pageInfo.showNum);
    if (pageInfo.status) target.attr("opt-status", pageInfo.status);
    if (pageInfo.skip) target.attr("opt-skip", pageInfo.skip);
    if (pageInfo.pageSizes.length > 1) target.attr("opt-sizes", pageInfo.pageSizes.join(","));
    renderView.call(this, $, target, pageInfo);

    if (!frontend) {
      var buttons = this.options.buttons;
      if (buttons === false) target.attr("opt-btns", "");else if (buttons !== true) {
        if (Utils.isNotBlank(buttons)) target.attr("opt-btns", JSON.stringify(buttons));
      }
    }

    return this;
  }; // ====================================================


  _Renderer.getButtons = function () {
    return this.options.buttons;
  };

  _Renderer.getTotal = function () {
    return Math.max(0, parseInt(this.options.total) || 0);
  };

  _Renderer.getSize = function () {
    return parseInt(this.options.size) || 0;
  };

  _Renderer.getSizes = function () {
    return getSizes(this.options.sizes) || [];
  };

  _Renderer.getPageNo = function () {
    return parseInt(this.options.page) || 0;
  };

  _Renderer.getMode = function () {
    return getMode(this.options.mode);
  };

  _Renderer.getShowNum = function () {
    return getShowNum(this.options.showNum);
  };

  _Renderer.getStatus = function () {
    return getStatus(this.options.status);
  };

  _Renderer.getSkip = function () {
    return getSkip(this.options.skip);
  }; // ====================================================


  var renderView = function renderView($, target, pageInfo) {
    var pagebar = $("<div class='pagebar'></div>").appendTo(target);
    renderPageBar.call(this, $, target, pagebar, pageInfo);

    if (!this._isRenderAsApp()) {
      if (pageInfo.pageSizes.length > 1) {
        var sizebar = $("<div class='sizebar'></div>").appendTo(target);
        renderPageSizeBar.call(this, $, target, sizebar, pageInfo);
      }

      if (Utils.isNotBlank(pageInfo.status)) {
        var statusbar = $("<div class='statusbar'></div>").appendTo(target);
        renderPageStatusBar.call(this, $, target, statusbar, pageInfo);
      }

      if (Utils.isNotBlank(pageInfo.skip)) {
        var skipbar = $("<div class='skipbar'></div>").appendTo(target);
        renderPageSkipBar.call(this, $, target, skipbar, pageInfo);
      }
    }
  };

  var renderPageBar = function renderPageBar($, target, container, pageInfo) {
    var firstBtn = getButtonLabel.call(this, "first");
    firstBtn && $("<button class='btn first'></button>").appendTo(container).text(firstBtn);
    var prevBtn = getButtonLabel.call(this, "prev");
    prevBtn && $("<button class='btn prev'></button>").appendTo(container).text(prevBtn);
    renderPagesView.call(this, $, target, container, pageInfo);
    var nextBtn = getButtonLabel.call(this, "next");
    nextBtn && $("<button class='btn next'></button>").appendTo(container).text(nextBtn);
    var lastBtn = getButtonLabel.call(this, "last");
    lastBtn && $("<button class='btn last'></button>").appendTo(container).text(lastBtn);
    target.removeClass("is-first").removeClass("is-last");
    if (pageInfo.isFirstPage) target.addClass("is-first");
    if (pageInfo.isLastPage) target.addClass("is-last");
  };

  var renderPagesView = function renderPagesView($, target, pagebar, pageInfo) {
    var mode = pageInfo.mode;

    if (mode !== false && mode !== "false") {
      var container = $("<div class='pages'></div>").appendTo(pagebar);

      if (mode == "spread") {
        renderPagesAsSpread.call(this, $, target, container, pageInfo);
      } else if (mode == "dropdown") {
        renderPagesAsDropdown.call(this, $, target, container, pageInfo);
      } else {
        renderPagesAsDefault.call(this, $, target, container, pageInfo);
      }
    }
  };

  var renderPagesAsDefault = function renderPagesAsDefault($, target, container, pageInfo) {
    var view = [];
    view.push("<span class='pageno'>" + pageInfo.pageNo + "</span>");
    view.push("<span class='pagecount'>" + pageInfo.pageCount + "</span>");
    container.html(view.join("/"));
  };

  var renderPagesAsSpread = function renderPagesAsSpread($, target, container, pageInfo) {
    var showNum = pageInfo.showNum;
    showNum = showNum > 0 ? showNum : defaultShowNum;
    if (showNum > 3 && this._isRenderAsApp()) showNum = 3;
    var page = pageInfo.pageNo - Math.floor(showNum / 2);
    if (page + showNum - 1 > pageInfo.pageCount) page = pageInfo.pageCount - showNum + 1;
    if (page < 1) page = 1;
    container.removeClass("has-prev").removeClass("has-next");
    if (page > 1) container.addClass("has-prev");

    for (var i = 0; i < showNum && page <= pageInfo.pageCount; i++) {
      var item = $("<span class='page'></span>").appendTo(container);
      item.text(page);
      if (page == pageInfo.pageNo) item.addClass("selected");
      page += 1;
    }

    if (page - 1 < pageInfo.pageCount) container.addClass("has-next");
  };

  var renderPagesAsDropdown = function renderPagesAsDropdown($, target, container, pageInfo) {
    var label = $("<div class='lbl'></div>").appendTo(container);
    label.text(pageInfo.pageNo + "/" + pageInfo.pageCount);

    var isApp = this._isRenderAsApp();

    var dropdown = $("<div class='dropdown'></div>").appendTo(container);
    var items = $("<ul></ul>").appendTo(dropdown);

    for (var i = 1; i <= pageInfo.pageCount; i++) {
      var item = $("<li class='page'></li>").appendTo(items);
      if (isApp) item.append("<span>" + i + "</span>");else item.text(i);
      if (i == pageInfo.pageNo) item.addClass("selected");
    }
  };

  var renderPageSizeBar = function renderPageSizeBar($, target, container, pageInfo) {
    var label = $("<div class='lbl'></div>").appendTo(container);
    label.text(pageInfo.pageSize);
    var dropdown = $("<div class='dropdown'></div>").appendTo(container);
    var items = $("<ul></ul>").appendTo(dropdown);
    Utils.each(pageInfo.pageSizes, function (value) {
      items.append("<li>" + value + "</li>");
    });
  };

  var renderPageStatusBar = function renderPageStatusBar($, target, container, pageInfo) {
    container.html(getFormatStatus.call(this, pageInfo.status, pageInfo));
  };

  var renderPageSkipBar = function renderPageSkipBar($, target, container, pageInfo) {
    var skips = /♮/.test(pageInfo.skip) ? pageInfo.skip.split("♮") : ["", ""];
    if (Utils.isBlank(skips[0]) && pageInfo.status) skips[0] = "到第";
    if (Utils.isNotBlank(skips[0])) $("<span class='txt t1'></span>").appendTo(container).text(skips[0]);
    container.append("<input type='number'/>");
    if (Utils.isBlank(skips[1]) && pageInfo.status) skips[1] = "页";
    if (Utils.isNotBlank(skips[1])) $("<span class='txt t2'></span>").appendTo(container).text(skips[1]);
    var skipBtn = getButtonLabel.call(this, "skip") || "GO";
    $("<button class='btn skip'></button>").appendTo(container).text(skipBtn);
  }; // ====================================================
  // 重新渲染视图


  var reRenderView = function reRenderView() {
    var _this2 = this;

    if (this.t_renderview) {
      clearTimeout(this.t_renderview);
      this.t_renderview = 0;
    }

    if (this.t_renderpage) {
      clearTimeout(this.t_renderpage);
      this.t_renderpage = 0;
    }

    this.t_renderview = setTimeout(function () {
      _this2.t_renderview = 0;
      renderView.call(_this2, $, _this2.$el.empty(), getPageInfos.call(_this2));
    }, 0);
  }; // 如果只是页码变了，只要重新渲染页码相关部分即可


  var reRenderPages = function reRenderPages() {
    var _this3 = this;

    if (this.t_renderview) return;

    if (this.t_renderpage) {
      clearTimeout(this.t_renderpage);
      this.t_renderpage = 0;
    }

    this.t_renderpage = setTimeout(function () {
      _this3.t_renderpage = 0;
      var pageInfos = getPageInfos.call(_this3);

      var pageContainer = _this3.$el.children(".pagebar").empty();

      renderPageBar.call(_this3, $, _this3.$el, pageContainer, pageInfos);

      var statusContainer = _this3.$el.children(".statusbar");

      if (statusContainer && statusContainer.length > 0) renderPageStatusBar.call(_this3, $, _this3.$el, statusContainer, pageInfos);
    }, 0);
  }; ///////////////////////////////////////////////////////


  var showPageDropdown = function showPageDropdown() {
    var target = this.$el.children(".pagebar");
    if (target.is(".show-dropdown")) return;
    target.addClass("show-dropdown");
    var dropdown = target.find(".dropdown");

    if (this._isRenderAsApp()) {
      $("html,body").addClass("ui-scrollless");
      dropdown = dropdown.children("ul");
    } else {
      target.on("mouseenter", dropdownMouseHandler.bind(this));
      target.on("mouseleave", dropdownMouseHandler.bind(this));
      var maxHeight = Fn.getDropdownHeight.call(this, dropdown);
      var offset = Utils.offset(dropdown, this._getScrollContainer(), 0, maxHeight);
      if (offset.isOverflowY) target.addClass("show-before");
    }

    var selectedItem = dropdown.find(".selected");

    if (selectedItem && selectedItem.length > 0) {
      var scrollTop = dropdown.scrollTop();
      scrollTop += selectedItem.offset().top - dropdown.offset().top;
      dropdown.scrollTop(scrollTop);
    }

    setTimeout(function () {
      target.addClass("animate-in");
    }, 0);
  };

  var hidePageDropdown = function hidePageDropdown() {
    var target = this.$el.children(".pagebar");
    var dropdown = target.find(".dropdown");

    if (this._isRenderAsApp()) {
      $("html,body").removeClass("ui-scrollless");
    } else {
      target.off("mouseenter").off("mouseleave");
    }

    target.addClass("animate-out");
    setTimeout(function () {
      target.removeClass("show-dropdown").removeClass("show-before");
      target.removeClass("animate-in").removeClass("animate-out");
    }, 300);
  };

  var showSizeDropdown = function showSizeDropdown() {
    var target = this.$el.children(".sizebar");
    if (target.is(".show-dropdown")) return;
    target.addClass("show-dropdown");
    target.on("mouseenter", sizebarMouseHandler.bind(this));
    target.on("mouseleave", sizebarMouseHandler.bind(this));
    var dropdown = target.children(".dropdown");
    var maxHeight = Fn.getDropdownHeight.call(this, dropdown, 210);
    var offset = Utils.offset(dropdown, this._getScrollContainer(), 0, maxHeight);
    if (offset.isOverflowY) target.addClass("show-before");
    setTimeout(function () {
      target.addClass("animate-in");
    }, 0);
  };

  var hideSizeDropdown = function hideSizeDropdown() {
    var target = this.$el.children(".sizebar");
    target.off("mouseenter").off("mouseleave");
    target.addClass("animate-out");
    setTimeout(function () {
      target.removeClass("show-dropdown").removeClass("show-before");
      target.removeClass("animate-in").removeClass("animate-out");
    }, 300);
  }; // ====================================================


  var setInner = function setInner(total, page, size) {
    total = Math.max(0, Utils.isBlank(total) || isNaN(total) ? this.getTotal() : parseInt(total));
    page = Math.max(1, Utils.isBlank(page) || isNaN(page) ? this.getPageNo() : parseInt(page));
    size = Utils.isBlank(size) || isNaN(size) ? this.getSize() : parseInt(size);
    var pageCount = Math.ceil(total / size) || 1;
    page = Math.min(page, pageCount);
    this.$el.attr("data-total", total);
    this.$el.attr("data-size", size);
    this.$el.attr("data-no", page);
    this.$el.attr("data-pages", pageCount);
    reRenderPages.call(this);
    this.$el.find(".sizebar .lbl").text(size);
  };

  var getPageInfos = function getPageInfos() {
    var data = {};
    data.totalCount = this.getTotal();
    data.pageSize = this.getSize();
    data.pageSizes = this.getSizes() || [];
    if (data.pageSize <= 0 && data.pageSizes && data.pageSizes.length > 0) data.pageSize = data.pageSizes[0];
    if (data.pageSize <= 0) data.pageSize = defaultPageSize;
    if (data.pageSizes.indexOf(data.pageSize) < 0) data.pageSizes.push(data.pageSize);
    data.pageSizes.sort(function (a, b) {
      return a - b;
    });
    data.pageNo = this.getPageNo();
    data.pageCount = Math.ceil(data.totalCount / data.pageSize) || 1;
    data.pageNo = Math.max(1, Math.min(data.pageNo, data.pageCount));
    data.pageStart = Math.min((data.pageNo - 1) * data.pageSize + 1, data.totalCount);
    data.pageEnd = Math.min(data.pageNo * data.pageSize, data.totalCount);
    data.mode = this.getMode();
    data.showNum = this.getShowNum();
    data.status = this.getStatus();
    data.skip = this.getSkip();
    data.isFirstPage = data.pageNo == 1;
    data.isLastPage = data.pageNo == data.pageCount;
    return data;
  };

  var getButtonLabel = function getButtonLabel(name) {
    var buttons = this.getButtons();
    if (buttons === false) return false;
    var label = null;

    if (Utils.isArray(buttons)) {
      if (name == "first") label = buttons[0];else if (name == "prev") label = buttons[1];else if (name == "next") label = buttons[2];else if (name == "last") label = buttons[3];else if (name == "skip") label = buttons[4];
    }

    if (label === false) return false;
    if (label !== true && Utils.isNotBlank(label)) return "" + label;
    if (name == "first") return "|<";
    if (name == "last") return ">|";
    if (name == "prev") return "<";
    if (name == "next") return ">";
    if (name == "skip") return "GO";
    return "" + name;
  };

  var getFormatStatus = function getFormatStatus(status, pageInfo) {
    if (status === true || status == "_default") return "共" + pageInfo.totalCount + "条";

    if (Utils.isNotBlank(status)) {
      status = status.replace(/\{pageNo\}/g, pageInfo.pageNo);
      status = status.replace(/\{pageSize\}/g, pageInfo.pageSize);
      status = status.replace(/\{pageCount\}/g, pageInfo.pageCount);
      status = status.replace(/\{totalCount\}/g, pageInfo.totalCount);
      status = status.replace(/\{pageStart\}/g, pageInfo.pageStart);
      status = status.replace(/\{pageEnd\}/g, pageInfo.pageEnd);
    }

    return Utils.trimToEmpty(status);
  }; // ====================================================


  var getMode = function getMode(value) {
    if (value === false) return false;
    if (value == "spread" || value == "dropdown") return value;
    return "normal";
  };

  var getShowNum = function getShowNum(value) {
    value = parseInt(value) || 0;
    return value > 0 ? value : defaultShowNum;
  };

  var getSizes = function getSizes(value) {
    if (value) {
      var values = [];
      Utils.each(Utils.toArray(value), function (tmp) {
        tmp = parseInt(tmp) || 0;
        if (tmp > 0 && values.indexOf(tmp) < 0) values.push(tmp);
      });
      return values.length > 0 ? values : null;
    }

    return null;
  };

  var getStatus = function getStatus(value) {
    if (value === true) return "_default";
    if (value === false) return null;
    return Utils.trimToNull(value);
  };

  var getSkip = function getSkip(value) {
    if (Utils.isNull(value) || value === true) return "1";

    if (Utils.isArray(value)) {
      return Utils.trimToEmpty(value[0]) + "♮" + Utils.trimToEmpty(value[1]);
    }

    return null;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIPaginator = UIPaginator;
    UI.init(".ui-paginator", UIPaginator, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-07-23
// tabbar
(function (frontend) {
  if (frontend && VRender.Component.ui.tabbar) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UITabbar = UI.tabbar = function (view, options) {
    return UI._select.call(this, view, options);
  };

  var _UITabbar = UITabbar.prototype = new UI._select(false);

  _UITabbar.init = function (target, options) {
    UI._select.init.call(this, target, options);

    this.tabsView = this.$el.find(".tabs");
    this.$el.on("tap", ".tab", itemClickHandler.bind(this));
    this.$el.on("tap", ".close", closeClickHandler.bind(this));

    if (this._isRenderAsApp()) {
      this.$el.on("touchstart", appTouchHandler.bind(this));
      this.$el.on("touchmove", appTouchHandler.bind(this));
      this.$el.on("touchend", appTouchHandler.bind(this));
    } else {
      this.$el.on("mousedown", ".btn", btnMouseHandler.bind(this));
      this.$el.on("mouseup", ".btn", btnMouseHandler.bind(this));
      this.$el.on("mouseleave", ".btn", btnMouseHandler.bind(this));
      initResizeEvents.call(this);
    }

    doLayout.call(this);
  }; // ====================================================


  _UITabbar.close = function (value) {
    var item = null;

    if (typeof value === "number") {
      if (value >= 0) item = this.tabsView.find(".tab").eq(value);
    } else if (Utils.isNotBlank(value)) {
      item = this.tabsView.find(".tab[name='" + value + "']");
    }

    if (item && item.length > 0) {
      var data = this._getItemData(item);

      closeInner.call(this, item);
      return data;
    }

    return null;
  }; // ====================================================


  _UITabbar.setSelectedIndex = function (value) {
    var index = Utils.getIndexValue(value);
    setActive.call(this, index >= 0 ? this._getItems().eq(index) : null);
    doLayout.call(this);
  };

  _UITabbar.removeItemAt = function (index) {
    this.close(Utils.getIndexValue(index));
  };

  _UITabbar.isMultiple = function () {
    return false; // 只能是单选
  };

  _UITabbar.isClosable = function (value) {
    if (typeof value == "number") {
      var item = this._getItemAt(value);

      return item && item.is(".closable");
    } else if (typeof value == "string") {
      return this.isClosable(this.getIndexByName(value));
    }

    return false;
  };

  _UITabbar.setColsable = function (value, closable) {
    if (typeof value == "string") {
      return this.setColsable(closable, this.getIndexByName(value));
    }

    if (typeof value == "number") {
      var item = this._getItemAt(value);

      if (item && item.length > 0) {
        if (Utils.isNull(closable) || Utils.isTrue(closable)) {
          if (!item.is(".closable")) {
            item.addClass("closable").append("<i class='close'></i>");
          }
        } else if (item.is(".closable")) {
          item.removeClass("closable").children(".close").remove();
        }
      }
    }
  }; // ====================================================


  _UITabbar._getItemContainer = function () {
    return this.$el.find(".tabs");
  };

  _UITabbar._getItems = function () {
    return this.$el.find(".tab");
  };

  _UITabbar._getNewItem = function ($, itemContainer, data, index) {
    return getNewItem.call(this, $, itemContainer, data, index);
  };

  _UITabbar._renderOneItem = function ($, item, data, index) {
    return renderOneItem.call(this, $, item, data, index);
  }; // ====================================================


  var itemClickHandler = function itemClickHandler(e) {
    var item = $(e.currentTarget);
    if (item.is(".disabled")) return;
    this.trigger("itemclick", this._getItemData(item));
    setActive.call(this, item);
  };

  var btnMouseHandler = function btnMouseHandler(e) {
    var _this = this;

    var btn = $(e.currentTarget);

    if (this.btnMouseTimerId) {
      clearInterval(this.btnMouseTimerId);
      this.btnMouseTimerId = 0;
    }

    if (e.type == "mousedown") {
      var target = this.tabsView;
      var left = parseInt(target.attr("opt-l")) || 0;
      var step = ($(e.currentTarget).is(".prev") ? 1 : -1) * 20;
      this.btnMouseTimerId = setInterval(function () {
        left += step;
        scrollTo.call(_this, left);
      }, 50);
    }
  };

  var appTouchHandler = function appTouchHandler(e) {
    var touch = e.touches && e.touches[0];

    if (e.type === "touchstart") {
      this.touchData = {
        startX: touch.pageX
      };
      this.touchData.startL = parseInt(this.tabsView.attr("opt-l")) || 0;
    } else if (e.type === "touchmove") {
      if (e.touches.length > 1 || !this.$el.is(".over")) return;
      var offset = touch.pageX - this.touchData.startX;
      if (!this.touchData.moving && Math.abs(offset) < 10) return;
      this.touchData.moving = true; // this.touchData.lastOffset = offset;

      var left = this.touchData.startL + offset;
      scrollTo.call(this, left);
    } else if (e.type === "touchend") {//
    }
  };

  var closeClickHandler = function closeClickHandler(e) {
    var item = $(e.currentTarget).parent();
    closeInner.call(this, item);
    return false;
  };

  var windowResizeHandler = function windowResizeHandler(e) {
    if (this.isMounted()) {
      layoutChanged.call(this);
    } else {
      $(window).off("resize._" + this.getViewId());
    }
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._selectRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._selectRender(false);

  _Renderer.render = function ($, target) {
    target.addClass("ui-tabbar");
    var tabbar = $("<div class='bar'></div>").appendTo(target);
    tabbar.append("<ul class='tabs'></ul>");
    tabbar.append("<div class='thumb'></div>");

    UI._selectRender.render.call(this, $, target);

    renderButtons.call(this, $, target);
    return this;
  }; // ====================================================


  _Renderer.isMultiple = function () {
    return false;
  }; // ====================================================


  _Renderer._renderOneItem = function ($, item, data, index) {
    renderOneItem.call(this, $, item, data, index);
  };

  _Renderer._getItemContainer = function ($, target) {
    return target.find(".tabs");
  };

  _Renderer._getNewItem = function ($, target) {
    return getNewItem.call(this, $, target);
  };

  _Renderer._renderEmptyView = function () {// do nothing
  };

  _Renderer._renderLoadView = function () {// do nothing
  }; // ====================================================


  var renderOneItem = function renderOneItem($, item, data, index) {
    var box = item.children(".box");

    UI._itemsRender.renderOneItem.call(this, $, item, box, data, index);

    data = data || {};
    if (Utils.isNotBlank(data.name)) item.attr("name", data.name);
    if (Utils.isTrue(data.closable)) item.addClass("closable").append("<i class='close'></i>");
  };

  var renderButtons = function renderButtons($, target) {
    target = $("<div class='btns'></div>").appendTo(target);
    target.append("<span class='btn prev'>&lt;</span>");
    target.append("<span class='btn next'>&gt;</span>");
  }; ///////////////////////////////////////////////////////


  var initResizeEvents = function initResizeEvents() {
    var eventName = "resize._" + this.getViewId();

    var _window = $(window).off(eventName);

    _window.on(eventName, windowResizeHandler.bind(this));

    windowResizeHandler.call(this);
  };

  var doLayout = function doLayout() {
    layoutChanged.call(this);

    if (this.$el.is(".over")) {
      // 滚动到可见视图
      var selectedItem = this.tabsView.find(".tab.selected");

      if (selectedItem && selectedItem.length > 0) {
        var container = this.tabsView.parent();
        var itemOffset = selectedItem.offset().left;
        var containerOffset = container.offset().left;
        var left = parseInt(this.tabsView.attr("opt-l")) || 0;

        if (itemOffset < containerOffset) {
          scrollTo.call(this, left + containerOffset - itemOffset);
        } else if (itemOffset - containerOffset > container.width()) {
          scrollTo.call(this, left - (itemOffset - containerOffset - container.width() + selectedItem.outerWidth()));
        }
      }
    }

    updateThumb.call(this);
  };

  var layoutChanged = function layoutChanged() {
    var target = this.tabsView;

    if (target.width() <= this.$el.width()) {
      this.$el.removeClass("over over-l over-r");
      scrollTo.call(this, 0);
    } else {
      this.$el.addClass("over");
      scrollTo.call(this, parseInt(target.attr("opt-l")) || 0);
    }
  };

  var scrollTo = function scrollTo(position) {
    var w1 = this.tabsView.width();
    var w2 = this.tabsView.parent().width();

    if (position >= 0) {
      position = 0;
    } else {
      if (position + w1 < w2) position = w2 - w1;
    }

    this.$el.removeClass("over-l over-r");
    if (position < 0) this.$el.addClass("over-l");
    if (position + w1 > w2) this.$el.addClass("over-r");

    if (position) {
      this.tabsView.css("transform", "translate(" + position + "px,0px)");
      this.tabsView.attr("opt-l", position);
    } else {
      this.tabsView.css("transform", "").removeAttr("opt-l");
    }

    updateThumb.call(this);
  };

  var updateThumb = function updateThumb() {
    var _this2 = this;

    if (this.thumbTimerId) {
      clearTimeout(this.thumbTimerId);
    }

    this.thumbTimerId = setTimeout(function () {
      _this2.thumbTimerId = 0;

      var thumb = _this2.$el.find(".thumb");

      var selectedItem = _this2.tabsView.find(".tab.selected");

      if (selectedItem && selectedItem.length > 0) {
        var left = selectedItem.offset().left;
        left -= _this2.tabsView.parent().offset().left;
        var width = selectedItem.outerWidth();
        var thumbWidth = _this2.options.thumbWidth;

        if (thumbWidth) {
          if (Utils.isFunction(thumbWidth)) thumbWidth = thumbWidth(selectedItem, width);else if (/%$/.test(thumbWidth)) thumbWidth = parseFloat(thumbWidth) * width;

          if (!isNaN(thumbWidth)) {
            left += (width - thumbWidth) / 2;
            width = thumbWidth;
          }
        } else if (_this2._isRenderAsApp()) {
          var innerWidth = selectedItem.width();
          left += (width - innerWidth) / 2;
          width = innerWidth;
        }

        thumb.css("left", left + "px");
        thumb.width(width);
      } else {
        thumb.width(0);
      }
    }, 100);
  };

  var setActive = function setActive(item) {
    var hasItem = item && item.length > 0;
    if (hasItem && item.is(".selected")) return;
    var index = hasItem ? item.index() : [];

    UI._select.setSelectedIndex.call(this, index);

    var oldItem = getSelectedTab.call(this),
        oldItemData = null;

    if (oldItem && oldItem.length > 0) {
      oldItem.removeClass("selected");
      oldItemData = this._getItemData(oldItem);
      this.trigger("hide", oldItemData);
    }

    var itemData = null;

    if (hasItem) {
      item.addClass("selected");
      itemData = this._getItemData(item);
      this.trigger("show", itemData);
    }

    updateThumb.call(this);
    this.trigger("change", itemData, oldItemData);
  };

  var closeInner = function closeInner(item) {
    var isSelected = item.is(".selected");

    var itemData = this._getItemData(item);

    var nextTab = null,
        nextData = null;

    if (isSelected) {
      nextTab = item.next();
      if (!nextTab || nextTab.length == 0) nextTab = item.prev();
      this.trigger("hide", itemData);
    }

    this.removeItem(item);
    this.trigger("close", itemData);

    if (nextTab && nextTab.length > 0) {
      nextTab.addClass("selected");
      nextData = this._getItemData(nextTab);
      this.trigger("show", nextData);

      UI._select.setSelectedIndex.call(this, nextTab.index());
    } else {
      UI._select.setSelectedIndex.call(this, []);
    }

    if (isSelected) this.trigger("change", nextData, itemData);
    layoutChanged.call(this);
  };

  var getNewItem = function getNewItem($, target) {
    var item = $("<li class='tab'></li>").appendTo(target);
    item.append("<div class='box'></div>");
    return item;
  };

  var getSelectedTab = function getSelectedTab() {
    return this.tabsView.find(".tab.selected");
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UITabbar = UITabbar;
    UI.init(".ui-tabbar", UITabbar, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// 2019-07-23
// panel
(function (frontend) {
  if (frontend && VRender.Component.ui.panel) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UIPanel = UI.panel = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIPanel = UIPanel.prototype = new UI._base(false);

  _UIPanel.init = function (target, options) {
    UI._base.init.call(this, target, options);

    this.header = this.$el.children("header");
    this.container = this.$el.children("section").children();
    this.header.on("tap", ".tabbar > .tab", onTabClickHandler.bind(this));

    if (this._isRenderAsApp()) {
      this.header.on("tap", ".btnbar > .popbtn", onPopupButtonClickHandler.bind(this));
    } else {
      this.header.on("tap", ".btnbar > .item > .btn", onButtonClickHandler.bind(this));
      this.header.on("tap", ".btnbar > .item > ul > li", onDropdownButtonClickHandler.bind(this));
    }

    doInit.call(this);
  }; // ====================================================


  _UIPanel.getTitle = function () {
    return this.header.children(".title").text();
  };

  _UIPanel.setTitle = function (value) {
    if (Utils.isNotNull(value)) {
      value = Utils.trimToEmpty(value);
      var title = this.header.children(".title");

      if (title && title.length > 0) {
        if (value) {
          title.empty().append(value);
        } else {
          title.remove();
        }
      } else if (value) {
        title = $("<div class='title'></div>").prependTo(this.header);
        title.append(value);
      }
    }
  };

  _UIPanel.getButtons = function () {
    if (this.options.hasOwnProperty("buttons")) return Utils.toArray(this.options.buttons);
    var buttons = this.$el.attr("data-btns");

    if (buttons) {
      try {
        buttons = JSON.parse(buttons);
      } catch (e) {}
    }

    this.$el.removeAttr("data-btns");
    this.options.buttons = Utils.toArray(buttons);
    return buttons;
  };

  _UIPanel.setButtons = function (value) {
    this.options.buttons = value;
    renderButtons.call(this, $, this.$el, Utils.toArray(value));

    if (this.popupMenu) {
      this.popupMenu.destory();
      this.popupMenu = null;
    }
  };

  _UIPanel.setViewports = function (value, active) {
    var viewports = getFormatViewports.call(this, value);
    renderTabs.call(this, $, this.$el, viewports);
    renderViewports.call(this, $, this.container, viewports);
    this.setViewActive(active);
  };

  _UIPanel.isViewActive = function (name) {
    return this.getViewActive() == name;
  };

  _UIPanel.getViewActive = function () {
    var item = this.header.find(".tabbar .selected");
    return item && item.attr("name");
  };

  _UIPanel.setViewActive = function (name) {
    if (Utils.isNotBlank(name)) showViewport.call(this, name);
  }; // ====================================================


  var onButtonClickHandler = function onButtonClickHandler(e) {
    var btn = $(e.currentTarget);
    var item = btn.parent();

    if (item.attr("has-dropdown") == 1) {
      showBtnDropdown.call(this, item);
    } else if (item.attr("opt-toggle") == 1) {
      item.toggleClass("active");
    }

    var name = item.attr("name");
    if (Utils.isNotBlank(name)) this.trigger("btnclick", name, btn.is(".active"));
  };

  var onPopupButtonClickHandler = function onPopupButtonClickHandler(e) {
    if (this.popupMenu) {
      this.popupMenu.open();
    } else {
      var items = getPopupMenus.call(this, this.getButtons());

      if (items && items.length > 0) {
        this.popupMenu = UI.popupmenu.create({
          target: this.$el,
          data: items
        });
        this.popupMenu.on("itemclick", onPopupMenuButtonHandler.bind(this));
      }

      if (this.popupMenu) {
        this.popupMenu.open();
      }
    }
  };

  var onPopupMenuButtonHandler = function onPopupMenuButtonHandler(e, data) {
    if (data && Utils.isNotBlank(data.name)) this.trigger("btnclick", data.name, !!data.checked);
  };

  var onDropdownButtonClickHandler = function onDropdownButtonClickHandler(e) {
    var dropdownItem = $(e.currentTarget);
    var item = dropdownItem.parent().parent();

    if (item.attr("opt-toggle") == 1 && !dropdownItem.is(".active")) {
      dropdownItem.addClass("active").siblings().removeClass("active");
      var btn = item.children(".btn"); // btn.attr("name", dropdownItem.attr("name"));

      var label = btn.children("span");
      if (label && label.length > 0) label.text(dropdownItem.children("span").text());
      var icon = btn.children("i");

      if (icon && icon.length > 0) {
        if (!icon.attr("data-src")) icon.attr("data-src", icon.css("backgroundImage"));
        var iconUrl = dropdownItem.children("i").css("backgroundImage") || icon.attr("data-src");
        icon.css("backgroundImage", iconUrl);
      }
    }

    hideBtnDropdown.call(this, item);
    var name = dropdownItem.attr("name");
    if (Utils.isNotBlank(name)) this.trigger("btnclick", name, dropdownItem.is(".active"));
  };

  var onButtonMouseHandler = function onButtonMouseHandler(e) {
    var _this = this;

    var item = $(e.currentTarget);
    var timerId = parseInt(item.attr("timerid"));

    if (timerId) {
      clearTimeout(timerId);
      item.removeAttr("timerid");
    }

    if (e.type == "mouseleave") {
      timerId = setTimeout(function () {
        item.removeAttr("timerid");
        hideBtnDropdown.call(_this, item);
      }, 400);
      item.attr("timerid", timerId);
    }
  };

  var onTabClickHandler = function onTabClickHandler(e) {
    var item = $(e.currentTarget);
    if (!item.is(".selected")) showViewport.call(this, item.attr("name"));
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-panel");
    this._viewports = getFormatViewports.call(this, this.options.viewports);
    renderHeader.call(this, $, target);
    renderContent.call(this, $, target);
    return this;
  }; // ====================================================


  _Renderer.getTitle = function () {
    if (this.options.hasOwnProperty("title")) return this.options.title;
    if (this._viewports && this._viewports.length > 0) return false;
    return "标题";
  }; // ====================================================


  var renderHeader = function renderHeader($, target) {
    var options = this.options || {};
    var header = $("<header></header>").appendTo(target); // 标题

    if (options.focusHtmlTitle) {
      $("<div class='title'></div>").appendTo(header).html(options.focusHtmlTitle);
    } else {
      var title = this.getTitle();
      if (title !== false && Utils.isNotBlank(title)) $("<div class='title'></div>").appendTo(header).text(title);
    } // 视图


    renderTabs.call(this, $, target, this._viewports); // 按钮

    var buttons = Utils.toArray(this.options.buttons);
    renderButtons.call(this, $, target, buttons);
  };

  var renderTabs = function renderTabs($, target, viewports) {
    var header = target.children("header");
    header.children(".tabbar").remove();

    if (viewports && viewports.length > 0) {
      var tabbar = $("<div class='tabbar'></div>").prependTo(header);
      header.children(".title").after(tabbar);
      tabbar.append("<div class='thumb'></div>");
      var viewIndex = Utils.getIndexValue(this.options.viewIndex);
      Utils.each(viewports, function (data, i) {
        var tab = $("<div class='tab'></div>").appendTo(tabbar);
        tab.attr("name", data.name);
        if (data.focusHtmlLabel) tab.html(data.focusHtmlLabel);else $("<span></span>").appendTo(tab).text(data.label || data.name);
        if (i == viewIndex) tab.addClass("selected");
      });
    }
  };

  var renderButtons = function renderButtons($, target, buttons) {
    var _this2 = this;

    var header = target.children("header");
    header.children(".btnbar").remove();

    if (buttons && buttons.length > 0) {
      var btnbar = $("<div class='btnbar'></div>").appendTo(header);

      if (this._isRenderAsApp()) {
        btnbar.append("<button class='popbtn'>&nbsp;</button>");
        target.attr("data-btns", JSON.stringify(buttons));
      } else {
        Utils.each(buttons, function (data) {
          renderOneButton.call(_this2, $, btnbar, data);
        });
      }
    }
  };

  var renderOneButton = function renderOneButton($, btnbar, data) {
    if (Utils.isBlank(data)) return;
    if (typeof data == "string") data = {
      name: data
    };
    var item = $("<div class='item'></div>").appendTo(btnbar);
    item.attr("name", Utils.trimToNull(data.name));

    var _isToggle = Utils.isTrue(data.toggle);

    if (_isToggle) item.attr("opt-toggle", "1");
    if (Utils.isNotBlank(data.tooltip)) item.attr("title", data.tooltip);
    var btn = $("<button class='btn'></button>").appendTo(item);

    if (data.icon) {
      var icon = $("<i>&nbsp;</i>").appendTo(btn);
      if (typeof data.icon == "string") icon.css("backgroundImage", "url(" + data.icon + ")");
    }

    if (!data.icon || data.label !== false) {
      var label = $("<span></span>").appendTo(btn);
      label.text(Utils.trimToNull(data.label) || "按钮");
    }

    if (Utils.isArray(data.items) && data.items.length > 0) {
      var dropdown = $("<ul></ul>").appendTo(item.attr("has-dropdown", "1"));
      var hasIcon = false;
      Utils.each(data.items, function (temp, i) {
        var dropdownItem = $("<li></li>").appendTo(dropdown);
        dropdownItem.attr("name", Utils.trimToNull(temp.name));

        if (Utils.isNotBlank(temp.icon)) {
          hasIcon = true;
          $("<i>&nbsp;</i>").appendTo(dropdownItem).css("backgroundImage", "url(" + temp.icon + ")");
        }

        var label = Utils.trimToNull(temp.label);
        $("<span></span>").appendTo(dropdownItem).text(label || "选项");
        if (_isToggle && label && label == data.label) dropdownItem.addClass("active");
      });
      if (hasIcon) dropdown.attr("show-ic", "1");
    }
  };

  var renderContent = function renderContent($, target, viewports) {
    var container = $("<section></section>").appendTo(target);
    container = $("<div class='container'></div>").appendTo(container);
    var content = $("<div></div>").appendTo(container);
    var contentView = this.options.content || this.options.view;

    if (Utils.isNotNull(contentView)) {
      if (Utils.isFunction(contentView.render)) contentView.render(content);else content.append(contentView.$el || contentView);
    }

    viewports = viewports || this._viewports;
    renderViewports.call(this, $, container, viewports);
    if (container.children(".selected").length == 0) content.addClass("selected");
  };

  var renderViewports = function renderViewports($, container, viewports) {
    container.children(":not(:first-child)").remove();

    if (viewports && viewports.length > 0) {
      var viewIndex = Utils.getIndexValue(this.options.viewIndex);
      Utils.each(viewports, function (data, i) {
        contentView = data.content || data.view;

        if (Utils.isNotNull(contentView)) {
          var viewport = $("<div></div>").appendTo(container);
          viewport.attr("name", data.name);
          if (i == viewIndex) viewport.addClass("selected");
          if (Utils.isFunction(contentView.render)) contentView.render(viewport);else viewport.append(contentView.$el || contentView);
        }
      });
    }
  }; ///////////////////////////////////////////////////////


  var doInit = function doInit() {
    this.getButtons(); // 初始化

    var tab = this.header.find(".tabbar .tab.selected");
    if (tab && tab.length > 0) showViewportThumbs.call(this, tab);
  };

  var showViewport = function showViewport(name) {
    var tabs = this.header.find(".tabbar .tab");
    var tabItem = Utils.find(tabs, function (tab) {
      return tab.attr("name") == name;
    });
    if (!tabItem || tabItem.length == 0) return; // 不存在的视图

    if (tabItem.is(".selected")) return;
    var lastTabItem = tabs.filter(".selected").removeClass("selected");
    tabItem.addClass("selected");
    showViewportThumbs.call(this, tabItem);
    var viewports = this.container.children();
    var viewport = Utils.find(viewports, function (item) {
      return item.attr("name") == name;
    });
    if (!viewport || viewport.length == 0) viewport = viewports.eq(0);

    if (!viewport.is(".selected")) {
      var currentViewport = viewports.filter(".selected");
      var swrapLeft = lastTabItem.index() < tabItem.index();
      viewport.addClass("animate-in");
      viewport.addClass(swrapLeft ? "animate-in-right" : "animate-in-left");
      currentViewport.addClass("animate-out");
      setTimeout(function () {
        viewport.removeClass("animate-in-left animate-in-right");
        currentViewport.addClass(swrapLeft ? "animate-out-left" : "animate-out-right");
        setTimeout(function () {
          viewport.addClass("selected").removeClass("animate-in");
          currentViewport.removeClass("selected animate-out animate-out-left animate-out-right");
        }, 400);
      }, 0);
    }

    this.trigger("change", tabItem.attr("name"), lastTabItem.attr("name"));
  };

  var showViewportThumbs = function showViewportThumbs(tab) {
    var thumb = this.header.children(".tabbar").children(".thumb");

    if (thumb && thumb.length > 0) {
      var left = tab.position().left;
      var width = tab.outerWidth();
      var thumbWidth = this.options.thumbWidth;

      if (thumbWidth) {
        if (Utils.isFunction(thumbWidth)) thumbWidth = thumbWidth(tab, width);else if (/%$/.test(thumbWidth)) thumbWidth = parseFloat(thumbWidth) * width / 100;

        if (!isNaN(thumbWidth)) {
          left += (width - thumbWidth) / 2;
          width = thumbWidth;
        }
      }

      thumb.css("left", left + "px");
      thumb.css("width", width + "px");
    }
  };

  var showBtnDropdown = function showBtnDropdown(btnItem) {
    if (btnItem.is(".show-dropdown")) return;
    btnItem.addClass("show-dropdown");
    btnItem.on("mouseenter", onButtonMouseHandler.bind(this));
    btnItem.on("mouseleave", onButtonMouseHandler.bind(this));
    setTimeout(function () {
      btnItem.addClass("animate-in");
    }, 0);
  };

  var hideBtnDropdown = function hideBtnDropdown(btnItem) {
    btnItem.addClass("animate-out");
    btnItem.off("mouseenter").off("mouseleave");
    setTimeout(function () {
      btnItem.removeClass("show-dropdown");
      btnItem.removeClass("animate-in").removeClass("animate-out");
    }, 300);
  };

  var getPopupMenus = function getPopupMenus(buttons) {
    if (buttons && buttons.length > 0) {
      var format = function format(data) {
        var temp = {};
        temp.name = data.name;
        temp.label = data.label || data.name || "按钮";
        if (data.icon) temp.icon = data.icon;
        if (data.toggle) temp.toggle = data.toggle;
        if (data.disabled) temp.disabled = data.disabled;
        return temp;
      };

      return Utils.map(buttons, function (data) {
        var item = format(data);
        item.children = Utils.map(data.items, format);
        if (item.children.length == 0) delete item.children;
        return item;
      });
    }

    return null;
  };

  var getFormatViewports = function getFormatViewports(value) {
    var viewports = [];
    Utils.each(Utils.toArray(value), function (data, i) {
      if (Utils.isNotBlank(data) && _typeof(data) == "object") {
        data.name = data.name || "view_" + i;
        viewports.push(data);
      }
    });
    return viewports;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIPanel = UIPanel;
    UI.init(".ui-panel", UIPanel, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-07-23
// list(原listview)
(function (frontend) {
  if (frontend && VRender.Component.ui.list) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UIList = UI.list = function (view, options) {
    return UI._select.call(this, view, options);
  };

  var _UIList = UIList.prototype = new UI._select(false);

  _UIList.init = function (target, options) {
    UI._select.init.call(this, target, options);

    var list = this.list = this.$el.children("ul");
    list.on("tap", "li", itemClickHandler.bind(this));
  }; // ====================================================


  _UIList.isChkboxVisible = function () {
    return this.$el.is(".show-chkbox");
  }; // ====================================================


  _UIList._getItemContainer = function () {
    return this.$el.children("ul");
  };

  _UIList._renderOneItem = function ($, item, data, index, bSelected) {
    renderOneItem.call(this, $, item, data, index, bSelected);
  }; // ====================================================


  var itemClickHandler = function itemClickHandler(e) {
    var item = $(e.currentTarget);
    if (item.find(".btnbar").find(e.target).length > 0) return;

    if (item.parent().is(this.list)) {
      if (item.is(".disabled")) return;

      var snapshoot = this._snapshoot();

      if (item.is(".selected")) {
        item.removeClass("selected");
      } else {
        item.addClass("selected");
        if (!this.isMultiple()) item.siblings().removeClass("selected");
      }

      var indexs = Utils.map(this.list.children(".selected"), function (item) {
        return item.index();
      });

      UI._select.setSelectedIndex.call(this, indexs);

      snapshoot.done();
    }
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._selectRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._selectRender(false); // options: titleField, descField


  Renderer.itemRenderer_simple = function (options) {
    var _options = {
      style: "ui-list-item1",
      title: null,
      desc: null
    };

    if (typeof options === "string") {
      _options.title = options;
      _options.desc = arguments && arguments[1];
    } else if (options) {
      _options.title = options.titleField;
      _options.desc = options.descField;
    }

    return itemRendererFunction.call(this, _options);
  }; // options: iconField, titleField, descField, defaultIconUrl


  Renderer.itemRenderer_icon = function (options) {
    var _options = {
      style: "ui-list-item2",
      icon: null,
      title: null,
      desc: null
    };

    if (typeof options == "string") {
      _options.icon = options;
      _options.title = arguments && arguments[1];
      _options.desc = arguments && arguments[2];
    } else if (options) {
      _options.icon = options.iconField;
      _options.title = options.titleField;
      _options.desc = options.descField;
      _options.defIcon = options.defaultIconUrl;
    }

    return itemRendererFunction.call(this, _options);
  }; // options: buttons, titleField, descField


  Renderer.itemRenderer_button = function (options) {
    var _options = {
      style: "ui-list-item3",
      buttons: null,
      title: null,
      desc: null
    };

    if (typeof options == "string") {
      _options.title = options;
      _options.desc = arguments && arguments[1];
    } else if (Utils.isArray(options)) {
      _options.buttons = options;
      _options.title = arguments && arguments[1];
      _options.desc = arguments && arguments[2];
    } else if (options) {
      _options.buttons = options.buttons;
      _options.title = options.titleField;
      _options.desc = options.descField;
    }

    return itemRendererFunction.call(this, _options);
  }; // options: iconField, buttons, titleField, descField


  Renderer.itemRenderer_icon_button = function (options) {
    var _options = {
      style: "ui-list-item4",
      buttons: null,
      icon: null,
      title: null,
      desc: null
    };

    if (typeof options == "string") {
      _options.icon = options;
      _options.buttons = arguments && arguments[1];
      _options.title = arguments && arguments[2];
      _options.desc = arguments && arguments[3];
    } else if (Utils.isArray(options)) {
      _options.buttons = options;
      _options.title = arguments && arguments[1];
      _options.desc = arguments && arguments[2];
    } else if (options) {
      _options.icon = options.iconField;
      _options.buttons = options.buttons;
      _options.title = options.titleField;
      _options.desc = options.descField;
    }

    return itemRendererFunction.call(this, _options);
  };

  var itemRendererFunction = function itemRendererFunction(options) {
    var func = function func($, item, data, index) {
      var _this = this;

      var opt = options || {};

      var getValue = function getValue(field, optFields) {
        if (Utils.isNotNull(field)) return data && data[field];

        if (data && optFields) {
          for (var i in optFields) {
            var _field = optFields[i];
            if (Utils.isNotBlank(_field) && data.hasOwnProperty(_field)) return data[_field];
          }
        }

        if (field == "title") {
          if (Utils.isFunction(_this._getDataLabel)) return _this._getDataLabel(data, index);
        }
      };

      item = $("<div></div>").addClass(opt.style);

      if (opt.hasOwnProperty("icon")) {
        var iconUrl = getValue(opt.icon, ["icon", "image", "img"]);
        var image = $("<img class='icon'/>").appendTo(item);
        image.attr("src", Utils.trimToEmpty(iconUrl) || opt.defIcon || null);
      }

      var content = $("<div class='content'></div>").appendTo(item);
      var title = getValue(opt.title, ["title"]);
      $("<div class='title'></div>").appendTo(content).html(title || "&nbsp;");
      var description = getValue(opt.desc, ["desc", "description", "remark"]);
      if (Utils.isNotBlank(description)) $("<div class='desc'></div>").appendTo(content).html(description);

      if (opt.hasOwnProperty("buttons")) {
        var btnbar = $("<div class='btnbar'></div>").appendTo(item);
        Utils.each(Utils.toArray(opt.buttons), function (data) {
          if (typeof VRender === "undefined") {
            // 服务端
            var UIButton = require("../button/index");

            new UIButton(_this.context, data).render(btnbar);
          } else {
            // 前端
            UI.button.create(Utils.extend({}, data, {
              target: btnbar
            }));
          }
        });
      }

      return item;
    };

    func._state = 1;
    func._data = JSON.stringify(options);
    return func;
  }; // ====================================================


  _Renderer.render = function ($, target) {
    target.addClass("ui-list");
    if (this.isChkboxVisible()) target.addClass("show-chkbox");
    target.append("<ul></ul>");

    UI._selectRender.render.call(this, $, target);

    return this;
  };

  _Renderer.isChkboxVisible = function () {
    return Utils.isTrue(this.options.chkbox);
  }; // ====================================================


  _Renderer._renderOneItem = function ($, item, data, index) {
    renderOneItem.call(this, $, item, data, index);
  };

  _Renderer._getItemContainer = function ($, target) {
    return target.children("ul");
  };

  _Renderer._renderEmptyView = function ($, target) {
    UI._itemsRender.renderEmptyView.call(this, $, target);
  };

  _Renderer._renderLoadView = function ($, target) {
    UI._itemsRender.renderLoadView.call(this, $, target);
  }; // ====================================================


  var renderOneItem = function renderOneItem($, item, data, index) {
    var container = $("<div class='box'></div>").appendTo(item);

    UI._itemsRender.renderOneItem.call(this, $, item, container, data, index);

    if (this.isChkboxVisible()) {
      item.prepend("<span class='chkbox'></span>");
    }
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIList = UIList;
    UI.init(".ui-list", UIList, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-07-24
// table(原datagrid)
(function (frontend) {
  if (frontend && VRender.Component.ui.table) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util;
  var dateFormats = {
    date: "yyyy-MM-dd",
    datetime: "yyyy-MM-dd HH:mm:ss",
    time: "HH:mm:ss"
  };
  var defaultIcons = {
    asc: "/vrender-ui/icons/020c.png",
    desc: "/vrender-ui/icons/021c.png"
  }; ///////////////////////////////////////////////////////

  var UITable = UI.table = function (view, options) {
    return UI._select.call(this, view, options);
  };

  var _UITable = UITable.prototype = new UI._select(false);

  _UITable.init = function (target, options) {
    UI._select.init.call(this, target, options);

    this.__columns = this.getColumns(); // 解析一次
    // console.log(this.__columns);

    target = this.$el;
    var ghead = this.gridHead = target.children(".table").children("header").children();
    var gbody = this.gridBody = target.children(".table").children("section").children();
    ghead.on("tap", "th.col-chk", allChkboxClickHandler.bind(this));
    gbody.on("tap", "tr", itemClickHandler.bind(this));
    gbody.on("tap", "td.col-exp .expbtn", onExpandBtnHandler.bind(this));

    if (this._isRenderAsApp()) {
      ghead.on("tap", "th", headTouchHandler.bind(this));
      target.on("tap", ".sort-and-filter", sortAndFilterClickHandler.bind(this));
      target.on("tap", ".sort-and-filter .item", sortAndFilterItemHandler.bind(this));
      target.on("tap", ".sort-and-filter input", sortAndFilterInputClickHandler.bind(this));
      target.on("tap", ".sort-and-filter .clearbtn", sortAndFilterClearHandler.bind(this));
      target.on("tap", ".sort-and-filter .submitbtn", sortAndFilterSubmitHandler.bind(this));
      target.on("keyup", ".sort-and-filter input", sortAndFilterInputKeyHandler.bind(this));
    } else {
      ghead.on("tap", ".toolbar > *", toolbtnClickHandler.bind(this));
      ghead.on("tap", ".toolbar .dropdown li", toolDropdownClickHandler.bind(this));
      ghead.on("mouseenter", ".toolbar > *", toolbtnMouseHandler.bind(this));
      ghead.on("mouseleave", ".toolbar > *", toolbtnMouseHandler.bind(this));
    }

    doInit.call(this);
    this.renderComplete = true;
  }; // ====================================================


  _UITable.getData = function (isOriginal) {
    if (isOriginal) {
      // 这是没有排序、筛选过的数据集
      this.options.data = this._doAdapter(this.options.data);
      return this.options.data;
    }

    var datas = this.getData(true);
    return Utils.map(this._getItems(), function (item) {
      var data = item.data("itemData");

      if (!data) {
        var index = parseInt(item.attr("opt-ind")) || 0;
        data = datas[index];
      }

      return data;
    });
  };

  _UITable.setData = function (value) {
    var snapshoot = this._snapshoot();

    this.options.data = this._doAdapter(value);

    UI._select.setSelectedIndex.call(this, []);

    this._getItems().removeClass("selected").removeClass("expand");

    rerenderItems.call(this);
    snapshoot.done([], []);
  };

  _UITable.getColumns = function () {
    if (this.options.hasOwnProperty("columns")) return this.options.columns;

    var getFunc = function getFunc(value) {
      return new Function("var Utils=VRender.Utils;return (" + unescape(value) + ");")();
    };

    var columns = this.$el.children("[name='columns']");

    if (columns && columns.length > 0) {
      try {
        columns = JSON.parse(columns.remove().attr("data"));
        Utils.each(columns, function (column) {
          if (column.html) column.html = unescape(column.html);

          if (/^function/.test(column.sortable)) {
            column.sortable = getFunc(column.sortable);
          } else if (Utils.isArray(column.sortable)) {
            Utils.each(column.sortable, function (temp) {
              if (/^function/.test(temp.handler)) temp.handler = getFunc(temp.handler);
            });
          }

          if (/^function/.test(column.sortFunction)) column.sortFunction = getFunc(column.sortFunction);
          if (/^function/.test(column.filter)) column.filter = getFunc(column.filter);else if (Utils.isArray(column.filter)) {
            Utils.each(column.filter, function (temp) {
              if (/^function/.test(temp.handler)) temp.handler = getFunc(temp.handler);
            });
          }
          if (/^function/.test(column.filterFunction)) column.filterFunction = getFunc(column.filterFunction);
        });
      } catch (e) {
        columns = [];
      }

      ;
    } else {
      columns = [];
    }

    this.options.columns = columns;
    return this.options.columns;
  };

  _UITable.setColumns = function (value) {
    this.options.columns = getFormatColumns(value);
    var columns = this.__columns = this.options.columns;

    if (this.currentSort && this.currentSort.name) {
      var column = Utils.findBy(columns, "name", this.currentSort.name);

      if (column && Utils.isTrue(column.sortable) && column.sortType == this.currentSort.type) {
        this.currentSort.column = column;
      } else this.currentSort = null;
    }

    if (this.currentFilters) {
      Utils.remove(this.currentFilters, function (filter) {
        if (filter.name) {
          var _column2 = Utils.findBy(columns, "name", filter.name);

          if (_column2) filter.column = _column2;else return true; // 删除不存在的列
        }
      });
    }

    rerender.call(this);
  };

  _UITable.isHeaderVisible = function () {
    return !this.$el.is(".no-head");
  };

  _UITable.setHeaderVisible = function (value) {
    if (Utils.isNull(value) || Utils.isTrue(value)) {
      if (!this.isHeaderVisible()) {
        this.$el.removeClass("no-head");
        rerenderHeader.call(this);
      }
    } else if (this.isHeaderVisible()) {
      this.$el.addClass("no-head");
      rerenderHeader.call(this);
    }
  };

  _UITable.isChkboxVisible = function () {
    return this.$el.attr("opt-chk") == "1";
  };

  _UITable.setChkboxVisible = function (value) {
    if (Utils.isNull(value) || Utils.isTrue(value)) {
      if (!this.isChkboxVisible()) {
        this.$el.attr("opt-chk", "1");
        rerender.call(this);
      }
    } else if (this.isChkboxVisible()) {
      this.$el.removeAttr("opt-chk");
      rerender.call(this);
    }
  }; // itemRenderer 即行渲染，也即tr，不能修改，设置无效


  _UITable.getItemRenderer = function () {
    return Renderer.rowRenderer;
  };

  _UITable.setItemRenderer = function (value) {// 设置无效，默认是 Renderer.rowRenderer;
  };

  _UITable.getHeadRenderer = function () {
    return Fn.getFunction.call(this, "headRenderer", "hrender");
  };

  _UITable.setHeadRenderer = function (value) {
    var _changed = this.getHeadRenderer() != value;

    this.options.headRenderer = value;
    if (_changed) rerenderHeader.call(this);
  };

  _UITable.getColumnRenderer = function () {
    if (this.options.hasOwnProperty("renderer")) return this.options.renderer;
    return Fn.getFunction.call(this, "columnRenderer", "crender");
  };

  _UITable.setColumnRenderer = function (value) {
    var _changed = this.getColumnRenderer() != value;

    this.options.columnRenderer = value;
    delete this.options.renderer;
    if (_changed) rerenderItems.call(this);
  };

  _UITable.getExpandRenderer = function () {
    return Fn.getFunction.call(this, "expandRenderer", "erender");
  };

  _UITable.setExpandRenderer = function (value) {
    var _changed = this.getExpandRenderer() != value;

    this.options.expandRenderer = value;

    if (_changed) {
      var itemContainer = this._getItemContainer();

      itemContainer.children(".row-expand").remove();
      var expandRows = itemContainer.children(".expand").removeClass("expand");
      expandRows.children(".col-exp").children(".expbtn").trigger("tap"); // 重新打开
    }
  };

  _UITable.getExpandColspan = function () {
    return parseInt(this.$el.attr("opt-expcols")) || 0;
  };

  _UITable.setExpandColsapn = function (value) {
    if (!isNaN(value) && (value || value === 0)) {
      value = parseInt(value);

      if (!isNaN(value) && value > 0 && this.getExpandColspan() != value) {
        this.$el.attr("opt-expcols", value);

        var itemContainer = this._getItemContainer();

        itemContainer.children(".row-expand").remove();
        var expandRows = itemContainer.children(".expand").removeClass("expand");
        expandRows.children(".col-exp").children(".expbtn").trigger("tap"); // 重新打开
      }
    }
  };

  _UITable.getRowStyleFunction = function () {
    return Fn.getFunction.call(this, "rowStyleFunction", "rstyle");
  };

  _UITable.setRowStyleFunction = function (value) {
    var _changed = this.getRowStyleFunction() != value;

    this.options.rowStyleFunction = value;
    if (_changed) rerenderItems.call(this);
  };

  _UITable.getCellStyleFunction = function () {
    return Fn.getFunction.call(this, "cellStyleFunction", "cstyle");
  };

  _UITable.setCellStyleFunction = function () {
    var _changed = this.getCellStyleFunction() != value;

    this.options.cellStyleFunction = value;
    if (_changed) rerenderItems.call(this);
  };

  delete _UITable.getLabelField;
  delete _UITable.setLabelField;
  delete _UITable.getLabelFunction;
  delete _UITable.setLabelFunction;
  delete _UITable.setItemRenderer; // ====================================================

  _UITable.sort = function (column, type, sortFunction) {
    if (Utils.isFunction(column)) {
      sortFunction = column;
      column = type = null;
    }

    if (Utils.isFunction(type)) {
      sortFunction = type;
      type = null;
    }

    if (column) column = getColumnInfo.call(this, "" + column);
    doSort.call(this, column, type, sortFunction);
  };

  _UITable.filter = function (column, value, filterFunction) {
    if (Utils.isFunction(column)) {
      filterFunction = column;
      column = value = null;
    }

    if (Utils.isFunction(value)) {
      filterFunction = value;
      value = null;
    }

    if (column) column = getColumnInfo.call(this, "" + column);
    doFilter.call(this, column, value, filterFunction);
  }; // ====================================================


  _UITable.addItem = function (data, index) {
    if (Utils.isNull(data)) return;
    index = Utils.getIndexValue(index);
    var datas = this.getData(true);
    data = Fn.doAdapter.call(this, data, index);

    if (index >= 0 && index < datas.length) {
      datas.splice(index, 0, data);
    } else {
      datas.push(data);
    }

    var snapshoot = this._snapshoot();

    rerenderItems.call(this);
    snapshoot.done();
  };

  _UITable.updateItem = function (data, index) {
    if (Utils.isNull(data)) return;
    var datas = this.getData(true);

    if (!index && index !== 0) {
      data = Fn.doAdapter.call(this, data);
      index = this.getDataRealIndex(data, datas);
    } else {
      index = Utils.getIndexValue(index);
      data = Fn.doAdapter.call(this, data, index);
    }

    if (index >= 0) {
      datas.splice(index, 1, data);

      var snapshoot = this._snapshoot(); // 可能被筛选或排序


      rerenderItems.call(this);
      snapshoot.done();
    }
  };

  _UITable.removeItem = function (data) {
    if (Utils.isNotNull(data)) this.removeItemAt(this.getDataRealIndex(data));
  };

  _UITable.removeItemAt = function (index) {
    index = Utils.getIndexValue(index);

    if (index >= 0) {
      var datas = this.getData(true);

      if (index < datas.length) {
        var removedData = datas.splice(index, 1);

        var snapshoot = this._snapshoot();

        rerenderItems.call(this);
        snapshoot.done();
      }
    }
  };

  _UITable.addOrUpdateItem = function (data) {
    var index = this.getDataRealIndex(data);
    if (index >= 0) this.updateItem(data, index);else this.addItem(data, index);
  };

  _UITable.getDataRealIndex = function (data, datas) {
    var _this = this;

    datas = datas || this.getData(true);

    if (datas && datas.length > 0) {
      var id = this._getDataKey(data);

      return Utils.index(datas, function (temp) {
        return temp == data || _this._getDataKey(temp) == id;
      });
    }

    return -1;
  };

  _UITable.rerender = function () {
    rerender.call(this);
  }; // ====================================================


  _UITable._getItemContainer = function () {
    if (!this.itemContainer) {
      var target = this.$el.children(".table").children("section").children();
      this.itemContainer = target.children("table").children("tbody");
    }

    return this.itemContainer;
  };

  _UITable._getNewItem = function ($, itemContainer, data, index) {
    return $("<tr class='table-row'></tr>").appendTo(itemContainer);
  };

  _UITable._getItemData = function (item) {
    var data = item.data("itemData");

    if (!data) {
      var datas = this.getData(true);

      if (Utils.isArray(datas) && datas.length > 0) {
        var index = parseInt(item.attr("opt-ind"));
        if (!isNaN(index) && index >= 0) return datas[index];
      }
    }

    return data;
  };

  _UITable._getSortFunction = function (column, type) {
    return getSortFunction.call(this, column, type);
  };

  _UITable._getFilterFunction = function (column, value) {
    return getFilterFunction.call(this, column, value);
  };

  _UITable._hasExpand = function () {
    return Utils.index(this.__columns, function (column) {
      return !!column.expand;
    }) >= 0;
  };

  _UITable._snapshoot_change = function () {
    selectedChanged.call(this);
  }; // ====================================================


  var itemClickHandler = function itemClickHandler(e) {
    var item = $(e.currentTarget);

    if (item.parent().is(this._getItemContainer())) {
      if (item.is(".disabled")) return;
      var event = {
        type: "itemclick",
        detail: this._getItemData(item),
        target: e.target
      };
      this.trigger(event);

      if (!event.isPreventDefault) {
        if (item.is(".selected")) {
          item.removeClass("selected");
        } else {
          item.addClass("selected");
          if (!this.isMultiple()) item.siblings().removeClass("selected");
        }

        selectedChanged.call(this);
      }
    }
  };

  var headTouchHandler = function headTouchHandler(e) {
    var col = $(e.currentTarget);
    var colName = col.attr("col-name");
    var column = colName && getColumnInfo.call(this, colName);

    if (column) {
      if (column.filter || Utils.isArray(column.sortable)) showSortAndFilterDialog.call(this, column, col);else if (column.sortable) {
        var sortType = col.attr("opt-sort");
        sortType = sortType == "desc" ? null : sortType == "asc" ? "desc" : "asc";
        doSort.call(this, column, sortType);
      }
    }
  };

  var allChkboxClickHandler = function allChkboxClickHandler(e) {
    var header = this.gridHead.find("tr");
    var selectedIndex = [];

    if (header.is(".selected")) {
      header.removeClass("selected");
    } else {
      header.addClass("selected");

      for (var i = 0, l = this.length(); i < l; i++) {
        selectedIndex.push(i);
      }
    }

    this.setSelectedIndex(selectedIndex);
  };

  var onExpandBtnHandler = function onExpandBtnHandler(e) {
    var item = $(e.currentTarget).parent().parent();

    if (item.parent().is(this._getItemContainer())) {
      if (item.is(".disabled")) return false;

      if (item.is(".expand")) {
        item.removeClass("expand");
        item.next().remove();
      } else {
        item.addClass("expand");
        var index = parseInt(item.attr("opt-ind")) || 0;

        var data = this._getItemData(item, index);

        renderExpandView.call(this, $, item, data, index);
      }

      return false;
    }
  };

  var toolbtnClickHandler = function toolbtnClickHandler(e) {
    var btn = $(e.currentTarget);
    var col = btn.parent().parent();
    var column = getColumnInfo.call(this, col.attr("col-name"));
    var dropdown = btn.children(".dropdown");

    if (dropdown && dropdown.length > 0) {
      btn.addClass("show-dropdown");

      if (dropdown.is(".ipt")) {
        var input = dropdown.find("input").focus();
        input.off("keydown").on("keydown", filterInputKeyHandler.bind(this));
      }
    } else if (btn.is(".sort")) {
      var sortType = col.attr("opt-sort");
      sortType = sortType == "desc" ? null : sortType == "asc" ? "desc" : "asc";
      doSort.call(this, column, sortType);
    } else if (btn.is(".filter")) {// 默认都有 dropdown
    }
  };

  var toolbtnMouseHandler = function toolbtnMouseHandler(e) {
    var btn = $(e.currentTarget);
    var timerId = parseInt(btn.attr("opt-t")) || 0;

    if (timerId) {
      clearTimeout(timerId);
      btn.removeAttr("opt-t");
    }

    if (e.type == "mouseleave") {
      timerId = setTimeout(function () {
        btn.removeClass("show-dropdown");
        btn.removeAttr("opt-t");

        if (btn.is(".filter")) {
          var input = btn.find("input");
          if (input && input.length > 0) VRender.onInputChange(input, null);
        }
      }, 400);
      btn.attr("opt-t", timerId);
    }
  };

  var toolDropdownClickHandler = function toolDropdownClickHandler(e) {
    var item = $(e.currentTarget);
    var toolbtn = item.parent().parent();
    var col = toolbtn.parent().parent();
    var column = getColumnInfo.call(this, col.attr("col-name"));
    var timerId = parseInt(toolbtn.attr("opt-t")) || 0;
    if (timerId) clearTimeout(timerId);
    toolbtn.removeClass("show-dropdown").removeAttr("opt-t");

    if (toolbtn.is(".sort")) {
      doSort.call(this, column, item.is(".selected") ? null : item.attr("data-type"));
    } else if (toolbtn.is(".filter")) {
      doFilter.call(this, column, item.is(".selected") ? null : item.attr("data-val"));
    }

    return false;
  };

  var filterInputKeyHandler = function filterInputKeyHandler(e) {
    if (e.which == 13) {
      var input = $(e.currentTarget);
      var colName = Utils.parentUntil(input, "th").attr("col-name");

      if (colName) {
        var column = getColumnInfo.call(this, colName);
        doFilter.call(this, column, input.val() || null);
      }
    }
  };

  var sortAndFilterClickHandler = function sortAndFilterClickHandler(e) {
    if ($(e.target).is(".sort-and-filter")) {
      hideSortAndFilterDialog.call(this);
      return false;
    }
  };

  var sortAndFilterItemHandler = function sortAndFilterItemHandler(e) {
    var item = $(e.currentTarget);
    var column = this.$el.children(".sort-and-filter").data("column");

    if (item.parent().parent().is(".sort")) {
      var sortType = item.is(".selected") ? null : item.attr("data-type");
      doSort.call(this, column, sortType);
    } else {
      var filterValue = item.is(".selected") ? null : item.attr("data-val");
      doFilter.call(this, column, filterValue);
    }

    hideSortAndFilterDialog.call(this);
  };

  var sortAndFilterInputClickHandler = function sortAndFilterInputClickHandler(e) {
    this.$el.children(".sort-and-filter").addClass("inputing");
  };

  var sortAndFilterClearHandler = function sortAndFilterClearHandler(e) {
    var target = this.$el.children(".sort-and-filter");
    var input = target.find("input").val("");

    if (target.is(".inputing")) {
      setTimeout(function () {
        input.focus();
      }, 0);
    }
  };

  var sortAndFilterSubmitHandler = function sortAndFilterSubmitHandler(e) {
    var target = this.$el.children(".sort-and-filter");
    var column = target.data("column");
    var filterValue = target.find("input").val() || null;
    doFilter.call(this, column, filterValue);
    hideSortAndFilterDialog.call(this);
  };

  var sortAndFilterInputKeyHandler = function sortAndFilterInputKeyHandler(e) {
    if (e.which == 13) {
      this.$el.children(".sort-and-filter").find(".submitbtn").tap();
    }
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._selectRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._selectRender(false); // 行渲染


  Renderer.rowRenderer = function ($, item, data, index) {
    renderRow.call(this, $, item, this.__columns, data, index);
  };

  Renderer.rowRenderer._state = 1; // 内部渲染器标志
  // ====================================================

  _Renderer.render = function ($, target) {
    target.addClass("ui-table");
    var height = Utils.getFormatSize(this.options.height, this._isRenderAsRem());

    if (height) {
      target.attr("opt-fixed", "1").css("height", height);
    }

    if (this.isChkboxVisible()) target.attr("opt-chk", "1");
    var expandColspan = parseInt(this.options.expandcols);
    if (expandColspan) target.attr("opt-expcols", expandColspan);
    var table = $("<div class='table'></div>").appendTo(target);
    table.append("<header><div></div></header>");
    table.append("<section><div><table><thead></thead><tbody></tbody></table></div></section>");
    var columns = this.__columns = this.getColumns();

    UI._selectRender.render.call(this, $, target);

    renderHeader.call(this, $, target, columns);
    renderOthers.call(this, $, target, columns);
    this.renderComplete = true; // 首次渲染完成

    return this;
  }; // ====================================================


  _Renderer.getColumns = function () {
    return getFormatColumns(this.options.columns);
  };

  _Renderer.isChkboxVisible = function () {
    return Utils.isTrue(this.options.chkbox);
  };

  _Renderer.isHeaderVisible = function () {
    if (this.options.hasOwnProperty("showHeader")) return Utils.isTrue(this.options.showHeader);
    return true;
  };

  _Renderer.getHeadRenderer = function () {
    return this.options.headRenderer;
  };

  _Renderer.getColumnRenderer = function () {
    return this.options.columnRenderer || this.options.renderer;
  };

  _Renderer.getExpandRenderer = function () {
    return this.options.expandRenderer;
  };

  _Renderer.getRowStyleFunction = function () {
    return this.options.rowStyleFunction;
  };

  _Renderer.getCellStyleFunction = function () {
    return this.options.cellStyleFunction;
  };

  _Renderer.getItemRenderer = function () {
    return Renderer.rowRenderer;
  }; // ====================================================


  _Renderer._getItemContainer = function ($, target) {
    target = target.children(".table").children("section").children();
    return target.children("table").children("tbody");
  };

  _Renderer._getNewItem = function ($, itemContainer, data, index) {
    return $("<tr class='table-row'></tr>").appendTo(itemContainer);
  };

  _Renderer._renderItems = function ($, target) {
    var _this2 = this;

    var datas = this.getData();
    var hasFilterOrSort = false;
    var _indexs = null;

    var _datas = [].concat(datas); // 下面需要排序、筛选，保证原数据集不变


    if (datas && datas.length > 0) {
      // doFilter
      Utils.each(this.__columns, function (column) {
        if (Utils.isTrue(column.filter) && Utils.isNotBlank(column.filterValue)) {
          var filterFunction = _this2._getFilterFunction(column, column.filterValue);

          _datas = Utils.filter(_datas, function (data, i) {
            return filterFunction(column, data, column.filterValue);
          });
          hasFilterOrSort = true;
        }
      }); // doSort

      var sortColumn = Utils.find(this.__columns, function (column) {
        return Utils.isTrue(column.sortable) && column.sortType;
      });

      if (sortColumn) {
        var sortFunction = this._getSortFunction(sortColumn, sortColumn.sortType);

        _datas.sort(function (a, b) {
          return sortFunction(sortColumn, a, b, sortColumn.sortType);
        });

        hasFilterOrSort = true;
      }
    }

    if (hasFilterOrSort) {
      // 获取对象在原数据集中的索引
      _indexs = Utils.map(_datas, function (data) {
        return Utils.index(datas, function (temp) {
          return temp == data;
        });
      });
    }

    this._renderDatas = _datas;
    renderItems.call(this, $, target, _datas, _indexs);
  };

  _Renderer._renderEmptyView = function ($, target) {
    UI._itemsRender.renderEmptyView.call(this, $, target);
  };

  _Renderer._renderLoadView = function ($, target) {
    UI._itemsRender.renderLoadView.call(this, $, target);
  };

  _Renderer._getSortFunction = function (column, type) {
    return getSortFunction.call(this, column, type);
  };

  _Renderer._getFilterFunction = function (column, value) {
    return getFilterFunction.call(this, column, value);
  };

  _Renderer._hasExpand = function () {
    return Utils.index(this.__columns, function (column) {
      return !!column.expand;
    }) >= 0;
  }; // ====================================================


  var renderHeader = function renderHeader($, target, columns) {
    var _this3 = this;

    if (this.isHeaderVisible()) {
      var isApp = this._isRenderAsApp();

      target = target.removeClass("no-head").children(".table");
      var thead = target.children("section").children().children("table").children("thead").empty();
      row = $("<tr></tr>").appendTo(thead);
      if (this.isAllSelected(this._renderDatas || [])) row.addClass("selected");
      if (this._hasExpand() && !isApp) row.append("<th class='col-exp'></th>");
      if (this.isChkboxVisible()) row.append("<th class='col-chk'><span class='chkbox'></span></th>");
      Utils.each(columns, function (column, i) {
        if (column.expand) return;
        var col = $("<th></th>").appendTo(row);
        col.addClass("col-" + i);
        if (Utils.isNotBlank(column.name)) col.attr("col-name", column.name); //.addClass("col-name-" + column.name);

        if (Utils.isNotBlank(column.dataType)) col.attr("col-type", column.dataType);
        var width = Utils.getFormatSize(column.width, _this3._isRenderAsRem());
        if (width) col.css("width", width);
        renderHeaderView.call(_this3, $, col, column, i);
        renderHeaderToolbar.call(_this3, $, col, column, i);
      });
      if (this._hasExpand() && isApp) row.append("<th class='col-exp'></th>"); // 固定表头

      var header = target.children("header").children().empty();
      if (!frontend) header.write("<table><thead>" + thead.html() + "</thead></table>");else header.html("<table><thead>" + thead.html() + "</thead></table>");
      row.find(".dropdown").remove();
    } else {
      target.addClass("no-head");
    }
  };

  var renderHeaderView = function renderHeaderView($, col, column, index) {
    if (!column.html) {
      var headRenderer = this.getHeadRenderer();

      if (Utils.isFunction(headRenderer)) {
        var headView = headRenderer(column, index);

        if (headView) {
          if (!frontend && Utils.isFunction(headView.render)) headView.render(col);else col.append(headView.$el || headView);
          return;
        }
      }
    }

    if (column.icon) $("<i>&nbsp;</i>").appendTo(col).css("backgroundImage", "url(" + column.icon + ")");
    var title = $("<div class='title'></div>").appendTo(col);
    if (column.html) title.html(column.html);else title.text(column.title || column.name || "列 " + (index + 1));
  };

  var renderHeaderToolbar = function renderHeaderToolbar($, col, column, index) {
    if (column.sortable || column.filter) {
      var toolbar = $("<div class=toolbar></div>").appendTo(col);

      if (column.sortable) {
        if (column.sortType) col.attr("opt-sort", column.sortType);
        renderSortView.call(this, $, toolbar, column);
      }

      if (column.filter) {
        if (column.filterValue) col.attr("opt-filter", column.filterValue);
        renderFilterView.call(this, $, toolbar, column);
      }
    }
  };

  var renderSortView = function renderSortView($, toolbar, column) {
    var sortTarget = $("<div class='sort'><i title='排序'></i></div>").appendTo(toolbar);

    if (!this._isRenderAsApp()) {
      if (Utils.isArray(column.sortable) && column.sortable.length > 0) {
        renderToolDropdown.call(this, $, sortTarget, column.sortable, column.sortType, "无");
      }
    }
  };

  var renderFilterView = function renderFilterView($, toolbar, column) {
    var filterTarget = $("<div class='filter'><i title='筛选'></i></div>").appendTo(toolbar);
    var filterType = column.filter;

    if (filterType == "enum") {
      filterType = getColumnValueSet.call(this, column);
      if (!(filterType && filterType.length > 0)) filterType = [{
        label: "无选项",
        value: ""
      }];else {
        filterType = Utils.map(filterType, function (tmp) {
          return {
            label: tmp,
            value: tmp
          };
        });
      }
    }

    if (!this._isRenderAsApp()) {
      if (Utils.isArray(filterType)) {
        renderToolDropdown.call(this, $, filterTarget, filterType, column.filterValue, "空");
      } else {
        var dropdown = $("<div class='dropdown ipt'></div>").appendTo(filterTarget);
        var input = $("<input/>").appendTo(dropdown);
        if (column.filterValue) input.val(column.filterValue);
      }
    }
  };

  var renderToolDropdown = function renderToolDropdown($, toolBtn, items, value, defLbl) {
    var dropdown = $("<ul class='dropdown'></ul>").appendTo(toolBtn);
    Utils.each(items, function (data) {
      var item = $("<li></li>").appendTo(dropdown);
      var bSelected = false;

      if (data.hasOwnProperty("type")) {
        item.attr("data-type", data.type);
        bSelected = data.type == value;
      }

      if (data.hasOwnProperty("value")) {
        item.attr("data-val", data.value);
        bSelected = data.value == value;
      }

      var icon = $("<i></i>").appendTo(item);
      var iconUrl = data.icon || defaultIcons[data.type];
      if (iconUrl) icon.css("backgroundImage", "url(" + iconUrl + ")");
      $("<span></span>").appendTo(item).text(data.label || defLbl);

      if (bSelected) {
        item.addClass("selected");

        var _icon = toolBtn.children("i");

        if (iconUrl) _icon.css("backgroundImage", "url(" + iconUrl + ")");
        if (data.label) _icon.attr("title", data.label);
      }
    });
  }; // ====================================================
  // indexs 是 datas 在原数据集中相应的索引


  var renderItems = function renderItems($, target, datas, indexs, selectedIndexs) {
    var _this4 = this;

    var itemContainer = this._getItemContainer($, target).empty();

    var selectedIndex = selectedIndexs || this.getSelectedIndex(true);
    var selectedId = this.getSelectedKey(true) || []; // let items = this._render_items = [];

    Utils.each(datas, function (data, i) {
      var index = indexs ? indexs[i] : i; // 在源数据集中的索引

      var item = _this4._getNewItem($, itemContainer, data, index);

      if (item) {
        // items.push({item: item, data: data, index: i});
        _this4._renderOneItem($, item, data, index); // 这里还是要用原始的索引的，否则渲染的数据可能就是错的


        var bSelected = _this4._isSelected(data, i, selectedIndex, selectedId);

        if (bSelected) item.addClass("selected");
      }
    }); // setTimeout(() => {
    // 	this._render_items = null;
    // }, 0);
  };

  var renderRow = function renderRow($, row, columns, data, rowIndex) {
    var _this5 = this;

    row.attr("opt-ind", rowIndex);

    var isApp = this._isRenderAsApp();

    var rowStyleFunction = this.getRowStyleFunction();

    if (Utils.isFunction(rowStyleFunction)) {
      var styles = rowStyleFunction(data, rowIndex);
      if (styles) row.css(styles);
    }

    if (this._hasExpand() && !isApp) row.append("<td class='col-exp'><span class='expbtn'></span></td>");
    if (this.isChkboxVisible()) row.append("<td class='col-chk'><span class='chkbox'></span></td>");
    Utils.each(columns, function (column, i) {
      if (!column.expand) {
        var col = $("<td></td>").appendTo(row);
        renderCell.call(_this5, $, col, column, data, rowIndex, i);
      }
    });
    if (this._hasExpand() && isApp) row.append("<td class='col-exp'><span class='expbtn'></span></td>");
  };

  var renderCell = function renderCell($, col, column, data, rowIndex, colIndex) {
    var cellStyleFunction = this.getCellStyleFunction();

    if (Utils.isFunction(cellStyleFunction)) {
      var styles = cellStyleFunction(column.name, data, rowIndex, colIndex);
      if (styles) col.css(styles);
    }

    col.addClass("col-" + colIndex);
    if (Utils.isNotBlank(column.name)) col.attr("col-name", column.name);
    var value = null;
    var columnRenderer = this.getColumnRenderer();

    if (Utils.isFunction(columnRenderer)) {
      value = columnRenderer(column.name, data, rowIndex, colIndex, column);
    }

    if (Utils.isNull(value)) {
      value = getDefaultValue.call(this, column, data, colIndex);
    }

    if (Utils.isBlank(value)) value = "&nbsp;";

    if (!frontend && Utils.isFunction(value.render)) {
      value.render(col);
    } else {
      col.append(value.$el || value);
    }
  };

  var renderOthers = function renderOthers($, target, columns) {
    if (!frontend) {
      var _columns = Utils.map(columns, function (temp) {
        var column = Utils.extend({}, temp);
        if (column.html) column.html = escape(column.html);
        if (Utils.isFunction(column.sortFunction)) column.sortFunction = escape(column.sortFunction);else if (Utils.isArray(column.sortable)) {
          Utils.each(column.sortable, function (tmp) {
            if (Utils.isFunction(tmp.handler)) tmp.handler = escape(tmp.handler);
          });
        }
        if (Utils.isFunction(column.filterFunction)) column.filterFunction = escape(column.filterFunction);else if (Utils.isArray(column.filter)) {
          Utils.each(column.filter, function (tmp) {
            if (Utils.isFunction(tmp.handler)) tmp.handler = escape(tmp.handler);
          });
        }
        return column;
      });

      target.write("<div class='ui-hidden' name='columns' data='" + JSON.stringify(_columns) + "'></div>");
      Fn.renderFunction(target, "hrender", this.getHeadRenderer());
      Fn.renderFunction(target, "crender", this.getColumnRenderer());
      Fn.renderFunction(target, "erender", this.getExpandRenderer());
      Fn.renderFunction(target, "rstyle", this.getRowStyleFunction());
      Fn.renderFunction(target, "cstyle", this.getCellStyleFunction());
    }
  };

  var renderExpandView = function renderExpandView($, row, data, rowIndex) {
    var _this6 = this;

    var expandRow = $("<tr class='row-expand'></tr>").insertAfter(row);
    var expandCell = $("<td></td>").appendTo(expandRow);
    expandCell.attr("colspan", row.children().length);
    var container = $("<div class='container'></div>").appendTo(expandCell);
    var expandRender = this.getExpandRenderer();

    if (Utils.isFunction(expandRender)) {
      var expandView = expandRender(data, rowIndex);

      if (Utils.isNotNull(expandView)) {
        container.append(expandView.$el || expandView);
      }
    } else {
      var _expandView = $("<div class='table-expand'></div>").appendTo(container);

      _expandView.attr("cols", this.getExpandColspan());

      Utils.each(this.__columns, function (column, i) {
        if (Utils.isTrue(column.expand)) {
          var item = $("<div></div>").appendTo(_expandView);
          item.addClass("col-" + i).attr("col-name", column.name);
          item = $("<dl></dl>").appendTo(item);
          $("<dt></dt>").appendTo(item).text(column.title || column.name || "");
          var content = $("<dd></dd>").appendTo(item);
          renderCell.call(_this6, $, content, column, data, rowIndex, i);
          item.removeClass("col-" + i).removeAttr("col-name");
        }
      });
    }
  }; // ====================================================


  var rerender = function rerender() {
    var _this7 = this;

    if (this.t_rerender) {
      clearTimeout(this.t_rerender);
      this.t_rerender = 0;
    }

    if (this.t_rerenderheader) {
      clearTimeout(this.t_rerenderheader);
      this.t_rerenderheader = 0;
    }

    if (this.t_rerenderitems) {
      clearTimeout(this.t_rerenderitems);
      this.t_rerenderitems = 0;
    }

    this.t_rerender = setTimeout(function () {
      _this7.t_rerender = 0;
      renderHeader.call(_this7, $, _this7.$el, _this7.__columns);
      renderBySortAndFilter.call(_this7, true);
    }, 0);
  };

  var rerenderHeader = function rerenderHeader() {
    var _this8 = this;

    if (this.t_rerender) return;

    if (this.t_rerenderheader) {
      clearTimeout(this.t_rerenderheader);
      this.t_rerenderheader = 0;
    }

    this.t_rerenderheader = setTimeout(function () {
      _this8.t_rerenderheader = 0;
      renderHeader.call(_this8, $, _this8.$el, _this8.__columns);
    }, 0);
  };

  var rerenderItems = function rerenderItems() {
    var _this9 = this;

    if (this.t_rerender) return;

    if (this.t_rerenderitems) {
      clearTimeout(this.t_rerenderitems);
      this.t_rerenderitems = 0;
    }

    this.t_rerenderitems = setTimeout(function () {
      _this9.t_rerenderitems = 0;
      renderBySortAndFilter.call(_this9, true);
      rerenderEnumFilters.call(_this9);
    }, 0);
  };

  var rerenderEnumFilters = function rerenderEnumFilters() {
    var _this10 = this;

    if (this._isRenderAsApp()) return;
    Utils.each(getHeaders.call(this), function (col) {
      var colName = col.attr("col-name");

      if (colName) {
        var column = getColumnInfo.call(_this10, col.attr("col-name"));

        if (column && column.filter == "enum") {
          var filterBtn = col.find(".toolbar .filter");
          var filterItems = getColumnValueSet.call(_this10, column);
          var filterValue = col.attr("opt-filter");

          if (filterItems && filterItems.length > 0) {
            filterItems = Utils.map(filterItems, function (tmp) {
              return {
                label: tmp,
                value: tmp
              };
            });
          } else {
            filterItems = [{
              label: "无选项",
              value: ""
            }];
          }

          filterBtn.children(".dropdown").remove();
          renderToolDropdown.call(_this10, $, filterBtn, filterItems, filterValue, "空");
        }
      }
    });
  }; ///////////////////////////////////////////////////////


  var doInit = function doInit() {
    this.$el.children("[name='irender']").remove(); // selectedChanged.call(this);

    startLayoutChangeMonitor.call(this);
  }; // 排序互斥，即只能有一个排序方法


  var doSort = function doSort(column, sortType, sortFunction) {
    var cols = getHeaders.call(this);
    cols.removeAttr("opt-sort");
    cols.find(".sort > i").css("backgroundImage", "");
    cols.find(".sort .dropdown li").removeClass("selected");
    var isCustom = column && column.sortable == "custom";

    if (column && column.name && Utils.isNotNull(sortType)) {
      var col = cols.filter("[col-name='" + column.name + "']");

      if (col && col.length > 0) {
        col.attr("opt-sort", sortType);
        var icon = defaultIcons[sortType];

        if (Utils.isArray(column.sortable)) {
          if (!this._isRenderAsApp()) col.find(".sort li[data-type='" + sortType + "']").addClass("selected");
          var sortItem = Utils.findBy(column.sortable, "type", sortType) || {};
          icon = sortItem.icon || icon;
          isCustom = Utils.isTrue(sortItem.custom);
        }

        if (icon) col.find(".sort > i").css("backgroundImage", "url(" + icon + ")");
      }
    }

    this.currentSort = {
      column: column,
      type: sortType,
      fn: sortFunction,
      name: column && column.name
    };

    if (Utils.isFunction(sortFunction)) {
      var _sortFunction = sortFunction;

      this.currentSort.fn = function (column, a, b, sortType) {
        return _sortFunction(a, b, sortType, column);
      };
    } else if (Utils.isNotNull(sortType) && !isCustom) {
      this.currentSort.fn = this._getSortFunction(column, sortType);
    }

    if (Utils.isFunction(this.currentSort.fn) || !isCustom) {
      renderBySortAndFilter.call(this);
    }

    this.trigger("sort", column && column.name, sortType);
  }; // 设置某一列筛选，不影响其他列筛选


  var doFilter = function doFilter(column, filterValue, filterFunction) {
    var isCustom = column && column.filter == "custom";
    var isNullValue = Utils.isNull(filterValue) || filterValue === false;

    if (column && column.name) {
      var cols = getHeaders.call(this);
      var col = cols.filter("[col-name='" + column.name + "']");

      if (col && col.length > 0) {
        col.removeAttr("opt-filter");
        col.find(".filter > i").css("backgroundImage", "");
        col.find(".filter li").removeClass("selected");

        if (!isNullValue || Utils.isFunction(filterFunction)) {
          col.attr("opt-filter", isNullValue ? true : filterValue);

          if (!this._isRenderAsApp()) {
            if (col.find(".filter .dropdown").is(".ipt")) {
              col.find(".filter input").val(isNullValue ? "" : filterValue);
            } else if (!isNullValue) {
              col.find(".filter li[data-val='" + filterValue + "']").addClass("selected");
            }
          }

          if (Utils.isArray(column.filter)) {
            var filterItem = Utils.findBy(column.filter, "value", filterValue) || {};
            if (filterItem.icon) col.find(".filter > i").css("backgroundImage", "url(" + filterItem.icon + ")");
            isCustom = Utils.isTrue(filterItem.custom);
          }
        }
      }
    }

    if (Utils.isFunction(filterFunction)) {
      var _filterFunction = filterFunction;

      filterFunction = function filterFunction(_column, _data, _value) {
        return _filterFunction(_data, _value, _column);
      };
    } else if (!isNullValue && !isCustom) {
      filterFunction = this._getFilterFunction(column, filterValue);
    }

    var colName = column && column.name || "";

    if (this.currentFilters) {
      if (!isNullValue || Utils.isFunction(filterFunction)) {
        var filter = Utils.findBy(this.currentFilters, "name", colName);

        if (!filter) {
          filter = {
            name: colName,
            column: column
          };
          this.currentFilters.push(filter);
        }

        filter.value = filterValue;
        filter.fn = filterFunction;
      } else {
        Utils.removeBy(this.currentFilters, "name", colName);
      }
    }

    if (!isCustom) {
      renderBySortAndFilter.call(this, true);
    }

    this.trigger("filter", colName, filterValue);
  };

  var renderBySortAndFilter = function renderBySortAndFilter(hasFilterChanged) {
    var datas = this.getData(true);

    if (hasFilterChanged || !this.lastFilterDatas) {
      var _datas2 = [].concat(datas);

      if (_datas2 && _datas2.length > 0) {
        if (!this.currentFilters) initCurrentFilters.call(this);
        Utils.each(this.currentFilters, function (filter) {
          _datas2 = Utils.filter(_datas2, function (data) {
            return filter.fn(filter.column, data, filter.value);
          });
        });
      }

      this.lastFilterDatas = _datas2;
    }

    var _datas = this.lastFilterDatas;
    if (!this.currentSort) initCurrentSort.call(this);

    if (this.currentSort && Utils.isFunction(this.currentSort.fn)) {
      var _sort = this.currentSort;
      _datas = _datas.slice(0).sort(function (a, b) {
        return _sort.fn(_sort.column, a, b, _sort.type);
      });
    } // 对应原数据集中的索引


    var _indexs = Utils.map(_datas, function (data) {
      return Utils.index(datas, function (temp) {
        return temp == data;
      });
    }); // 当前选中项对应筛选、排序后的新索引


    var _selectedIndexs = []; // 当前展开的原数据集索引

    var expandIndexs = [];
    Utils.each(this._getItems(), function (item) {
      if (item.is(".selected")) {
        var index = parseInt(item.attr("opt-ind")) || 0;
        var data = datas && datas[index];

        if (data) {
          index = Utils.index(_datas, function (temp) {
            return temp == data;
          });
          if (index >= 0) _selectedIndexs.push(index);
        }
      }

      if (item.is(".expand")) expandIndexs.push(item.attr("opt-ind"));
    });
    renderItems.call(this, $, this.$el, _datas, _indexs, _selectedIndexs);
    selectedChanged.call(this);

    if (hasFilterChanged) {
      UI._items.checkIfEmpty.call(this);
    }

    if (expandIndexs.length > 0) {
      Utils.each(this._getItems(), function (item) {
        if (expandIndexs.indexOf(item.attr("opt-ind")) >= 0) item.children(".col-exp").children(".expbtn").trigger("tap");
      });
    }
  };

  var initCurrentSort = function initCurrentSort() {
    var col = Utils.find(getHeaders.call(this), function (col) {
      return !!col.attr("opt-sort");
    });
    this.currentSort = null;

    if (col && col.length > 0) {
      var colName = col.attr("col-name");
      var sortType = col.attr("opt-sort");
      var column = getColumnInfo.call(this, colName);

      var sortFunction = this._getSortFunction(column, sortType);

      this.currentSort = {
        name: colName,
        column: column,
        type: sortType,
        fn: sortFunction
      };
    }
  };

  var initCurrentFilters = function initCurrentFilters() {
    var _this11 = this;

    var filters = this.currentFilters = [];
    Utils.each(getHeaders.call(this), function (col) {
      var colName = col.attr("col-name");
      var filterValue = col.attr("opt-filter");

      if (colName && Utils.isNotNull(filterValue) && filterValue !== false) {
        var column = getColumnInfo.call(_this11, colName);

        var filterFunction = _this11._getFilterFunction(column, filterValue);

        filters.push({
          name: colName,
          column: column,
          value: filterValue,
          fn: filterFunction
        });
      }
    });
  };

  var getHeaders = function getHeaders() {
    return this.gridHead.children("table").children("thead").children("tr").children("th");
  }; // ====================================================
  // 显示 排序 和 筛选 对话框


  var showSortAndFilterDialog = function showSortAndFilterDialog(column, col) {
    $("body").addClass("ui-scrollless");
    var dialogView = $("<div class='sort-and-filter'></div>").appendTo(this.$el);
    var container = $("<div class='container'></div>").appendTo(dialogView);
    dialogView.data("column", column);
    var isSortable = Utils.isTrue(column.sortable);
    var isFilterable = Utils.isTrue(column.filter);
    if (isSortable) showDialogSortView.call(this, container, column, col.attr("opt-sort"));
    if (isFilterable) showDialogFilterView.call(this, container, column, col.attr("opt-filter"));

    if (!isSortable && isFilterable && column.filter != "enum" && !Utils.isArray(column.filter)) {
      dialogView.addClass("inputing");
      dialogView.find(".filter").focus();
    }

    setTimeout(function () {
      dialogView.addClass("show");
    }, 0);
  };

  var showDialogSortView = function showDialogSortView(container, column, sortType) {
    var target = $("<div class='sort'></div>").appendTo(container);
    target.append("<div class='title'>排序</div>");
    var sorts = column.sortable;

    if (!Utils.isArray(sorts)) {
      sorts = [{
        label: "升序",
        type: "asc"
      }, {
        label: "降序",
        type: "desc"
      }];
    }

    var content = $("<div class='content'></div>").appendTo(target);
    Utils.each(sorts, function (data) {
      var item = $("<div class='item'></div>").appendTo(content);
      item.attr("data-type", data.type);
      var icon = $("<i></i>").appendTo(item);
      var iconUrl = data.icon || defaultIcons[data.type];
      if (iconUrl) icon.css("backgroundImage", "url(" + iconUrl + ")");
      $("<span></span>").appendTo(item).text(data.label || "无");
      if (data.type == sortType) item.addClass("selected");
    });
  };

  var showDialogFilterView = function showDialogFilterView(container, column, filterValue) {
    var target = $("<div class='filter'></div>").appendTo(container);
    target.append("<div class='title'>筛选</div>");
    var filters = column.filter;

    if (column.filter == "enum") {
      filters = getColumnValueSet.call(this, column);

      if (filters && filters.length > 0) {
        filters = Utils.map(filters, function (temp) {
          return {
            label: temp,
            value: temp
          };
        });
      } else {
        filters = [{
          label: "无选项",
          value: ""
        }];
      }
    }

    var content = $("<div class='content'></div>").appendTo(target);

    if (Utils.isArray(filters)) {
      Utils.each(filters, function (data) {
        var item = $("<div class='item'></div>").appendTo(content);
        item.attr("data-val", data.value);
        var icon = $("<i></i>").appendTo(item);
        if (data.icon) icon.css("backgroundImage", "url(" + data.icon + ")");
        $("<span></span>").appendTo(item).text(data.label || "空");
        if (data.value == filterValue) item.addClass("selected");
      });
    } else {
      var filterInput = $("<div class='filterinput'></div>").appendTo(content);
      filterInput.append("<input placeholder='请输入文本'/>");
      filterInput.append("<div class='clearbtn'></div>");
      filterInput.append("<div class='submitbtn'>确定</div>");
      if (filterValue) filterInput.children("input").val(filterValue);
    }
  };

  var hideSortAndFilterDialog = function hideSortAndFilterDialog() {
    $("body").removeClass("ui-scrollless");
    var target = this.$el.children(".sort-and-filter");
    target.removeClass("show").removeClass("inputing");
    setTimeout(function () {
      target.remove();
    }, 300);
  }; // ====================================================
  // 实时监视表格，进行布局调整


  var startLayoutChangeMonitor = function startLayoutChangeMonitor() {
    var _this12 = this;

    if (this.t_layout) {
      clearTimeout(this.t_layout);
      this.t_layout = 0;
    }

    this.t_layout = setTimeout(function () {
      _this12.t_layout = 0;

      if (_this12.isMounted()) {
        doHeaderLayout.call(_this12);
        checkBodyFixed.call(_this12);
        startLayoutChangeMonitor.call(_this12);
      }
    }, 50);
  };

  var doHeaderLayout = function doHeaderLayout() {
    if (this.isHeaderVisible()) {
      var headers = getHeaders.call(this);
      var cols = this.gridBody.children("table").children("thead").children("tr").children("th");
      Utils.each(cols, function (col, i) {
        var header = headers.eq(i);

        if (col.is(".is-expand")) {
          header.addClass("is-expand");
        } else {
          var width = col.width();
          if (width != parseInt(header.attr("opt-w"))) header.attr("opt-w", width).width(width);
        }
      });
    }
  };

  var checkBodyFixed = function checkBodyFixed() {// this.$el.removeAttr("fixed");
    // if (!this.$el.is(".is-empty")) {
    // 	let table = this.gridBody.parent().parent(); // .table
    // 	let head = table.children("header"); // head
    // 	let body = table.children("section"); // body
    // 	if (table.width() < head.width() + body.width())
    // 		this.$el.attr("fixed", "1");
    // }
  };

  var selectedChanged = function selectedChanged() {
    var snapshoot = this._snapshoot();

    var indexs = Utils.map(this._getItems(".selected"), function (item) {
      return item.index();
    });

    UI._select.setSelectedIndex.call(this, indexs);

    if (this.isMultiple()) {
      var header = this.gridHead.find("tr");
      if (this.isAllSelected()) header.addClass("selected");else header.removeClass("selected");
    }

    snapshoot.done();
  };

  var getColumnInfo = function getColumnInfo(name) {
    return Utils.findBy(this.__columns, "name", name);
  }; // ====================================================
  // 获取数据集某一列的集合


  var getColumnValueSet = function getColumnValueSet(column, datas) {
    var set = [];
    var columnName = column && column.name;

    if (columnName) {
      datas = datas || this.getData(true);
      Utils.each(datas, function (data) {
        var value = data && data[columnName];
        var hasValue = Utils.index(set, function (tmp) {
          return tmp == value;
        });
        if (hasValue < 0) set.push(value);
      });
    }

    return set.sort();
  };

  var getFormatColumns = function getFormatColumns(columns) {
    columns = Utils.map(Utils.toArray(columns), formatOneColumn);
    var sortColumn = null;
    var isAllExpand = true;
    Utils.each(columns, function (column) {
      if (column.sortType) {
        // 只允许一个列排序
        if (sortColumn) sortColumn.sortType = null;
        sortColumn = column;
      }

      if (!column.expand) isAllExpand = false;
    });
    if (isAllExpand && columns.length > 0) columns[0].expand = false;
    return columns;
  };

  var formatOneColumn = function formatOneColumn(column, index) {
    var _column = {};

    if (Utils.isNull(column)) {
      _column.title = "列 " + (index + 1);
    } else if (Utils.isPrimitive(column)) {
      _column.name = Utils.trimToEmpty(column);
    } else {
      _column.name = Utils.trimToEmpty(column.name);
      _column.title = Utils.trimToNull(column.title);
      _column.html = Utils.trimToNull(column.focusHtmlTitle);
      _column.icon = Utils.trimToNull(column.icon);
      _column.width = Utils.trimToNull(column.width);
      _column.expand = Utils.isTrue(column.expand);
      if (Utils.isTrue(column.sortable)) formatColumnSortable(_column, column);
      if (Utils.isTrue(column.filter)) formatColumnFilterable(_column, column);
    }

    return _column;
  };

  var formatColumnSortable = function formatColumnSortable(column, data) {
    if (Utils.isFunction(data.sortFunction)) column.sortFunction = data.sortFunction;else if (Utils.isFunction(data.sortable)) column.sortFunction = data.sortable;

    if (Utils.isArray(data.sortable) && data.sortable.length > 0) {
      column.sortable = Utils.map(data.sortable, function (tmp) {
        return {
          type: tmp.type,
          label: tmp.label,
          icon: tmp.icon,
          handler: tmp.handler,
          custom: tmp.custom
        };
      });
    } else {
      column.sortable = data.sortable == "custom" ? "custom" : true;
    }

    column.sortType = data.sortType ? Utils.trimToNull(data.sortType) : null;
  };

  var formatColumnFilterable = function formatColumnFilterable(column, data) {
    if (Utils.isFunction(data.filterFunction)) column.filterFunction = data.filterFunction;else if (Utils.isFunction(data.filter)) column.filterFunction = data.filter;

    if (Utils.isArray(data.filter) && data.filter.length > 0) {
      column.filter = Utils.map(data.filter, function (tmp) {
        return {
          label: tmp.label,
          value: tmp.value,
          icon: tmp.icon,
          handler: tmp.handler,
          custom: tmp.custom
        };
      });
    } else {
      column.filter = /^(custom|enum)$/.test(data.filter) ? data.filter : true;
    }

    column.filterValue = data.filterValue ? Utils.trimToNull(data.filterValue) : null;
  }; // ====================================================


  var getSortFunction = function getSortFunction(column, type) {
    if (column) {
      if (Utils.isNotNull(type) && Utils.isArray(column.sortable)) {
        var temp = Utils.findBy(column.sortable, "type", type);

        if (temp && Utils.isFunction(temp.handler)) {
          return function (_column, a, b, sortType) {
            return temp.handler(a, b, sortType);
          };
        }
      }

      if (Utils.isFunction(column.sortFunction)) {
        return function (_column, a, b, sortType) {
          return column.sortFunction(a, b, sortType);
        };
      }
    }

    if (Utils.isFunction(this.options.sortFunction)) {
      var fn = this.options.sortFunction;
      return function (_column, a, b, sortType) {
        return fn(a, b, sortType, _column);
      };
    }

    return defaultSortFucntion;
  };

  var getFilterFunction = function getFilterFunction(column, value) {
    if (column) {
      if (Utils.isNotNull(value) && Utils.isArray(column.filter)) {
        var temp = Utils.findBy(column.filter, "value", value);

        if (temp && Utils.isFunction(temp.handler)) {
          return function (_column, _data, _value) {
            return temp.handler(_data, _value);
          };
        }
      }

      if (Utils.isFunction(column.filterFunction)) {
        return function (_column, _data, _value) {
          return column.filterFunction(_data, _value);
        };
      }
    }

    if (Utils.isFunction(this.options.filterFunction)) {
      var fn = this.options.filterFunction;
      return function (_column, _data, _value) {
        return fn(_data, _value, _column);
      };
    }

    return defaultFilterFunction;
  };

  var defaultSortFucntion = function defaultSortFucntion(column, a, b, sortType) {
    if (column && column.name && /^(asc|desc)$/i.test(sortType)) {
      var value_a = a ? a[column.name] : null;
      var value_b = b ? b[column.name] : null;

      var result = function () {
        if (Utils.isNull(value_a)) return Utils.isNull(value_b) ? 0 : -1;
        if (Utils.isNull(value_b)) return Utils.isNull(value_a) ? 0 : 1;
        var dataType = column.dataType;

        if (/date/i.test(dataType)) {
          value_a = Utils.toDate(value_a);
          value_b = Utils.toDate(value_b);
          if (!value_a) return value_b ? 1 : 0;
          if (!value_b) return value_a ? -1 : 0;
          var format = /^date$/i.test(dataType) ? "yyyyMMddHHmmss" : "yyyyMMdd";
          value_a = Utils.toDateString(value_a, format);
          value_b = Utils.toDateString(value_b, format);
          return value_a < value_b ? -1 : value_a > value_b ? 1 : 0;
        }

        if (/num/i.test(dataType) || !(isNaN(value_a) || isNaN(value_b))) {
          return parseFloat(value_a) - parseFloat(value_b);
        }

        return value_a.localeCompare(value_b);
      }();

      return result * (/^asc$/i.test(sortType) ? 1 : -1);
    }

    return 0;
  };

  var defaultFilterFunction = function defaultFilterFunction(column, data, value) {
    if (!(column || column.name)) return true; // 没有列信息，不做筛选

    if (Utils.isNull(data)) return false;
    var _value = data[column.name];
    if (_value === value) return true;
    var dataType = column.dataType;

    if (/date/i.test(dataType)) {
      value = Utils.toDate(value);
      if (!value) return true; // 不是日期（先不筛选）

      _value = Utils.toDate(_value);

      if (_value) {
        var format = /^date$/i.test(dataType) ? "yyyyMMdd" : "yyyyMMddHHmmss";
        value = Utils.toDateString(value, format);
        _value = Utils.toDateString(_value, format);
        return _value.indexOf(value) === 0;
      }

      return false;
    }

    if (Utils.isNull(_value)) return Utils.isNull(value);
    if (Utils.isNull(value)) return Utils.isNull(_value);

    if (/num/i.test(dataType) || !(isNaN(value) || isNaN(_value))) {
      return parseFloat(value) == parseFloat(_value);
    }

    if (value == _value) return true;
    value = Utils.trimToEmpty(value);
    _value = Utils.trimToEmpty(_value);
    return _value.indexOf(value) >= 0;
  }; // 组件内置默认获取表单元格内容的方法


  var getDefaultValue = function getDefaultValue(column, data, index) {
    if (Utils.isBlank(data)) return null;
    if (Utils.isBlank(column.name)) return "" + data;
    var value = data[column.name];

    if (column.dataType &&
    /*column.format && */
    Utils.isNotBlank(value)) {
      var type = column.dataType;
      if (type === "localtime") value = Utils.toLocalDateString(Utils.toDate(value));else if (/^(date|datetime|time)$/.test(type)) {
        value = Utils.toDate(value);
        if (value) value = Utils.toDateString(value, dateFormats[type]);
      } else if (type === "money") {
        value = parseFloat(value);
        if (isNaN(value)) value = null;else {
          value = value.toFixed(2).split(".");
          value = "<span class='val'>￥<span class='v1'>" + value[0] + "</span>.<span class='v2'>" + value[1] + "</span></span>";
        }
      } else if (type === "number" || type === "num") {
        value = parseFloat(value);
        if (isNaN(value)) value = null;else {
          var decimals = parseFloat(column.decimals);
          if (isNaN(decimals) || decimals < 0) decimals = 0;
          value = value.toFixed(decimals);
        }
      }
    }

    return value;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UITable = UITable;
    UI.init(".ui-table", UITable, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-07-25
// scroll(原scrollbox)
(function (frontend) {
  if (frontend && VRender.Component.ui.scroll) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UIScroll = UI.scroll = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UIScroll = UIScroll.prototype = new UI._base(false);

  _UIScroll.init = function (target, options) {
    UI._base.init.call(this, target, options);

    doInit.call(this);
  };

  _UIScroll.reset = function () {}; // ====================================================


  _UIScroll.getContentView = function () {
    if (!this.contentView) {
      var content = this.$el.children(".container").children();

      if (content && content.length > 0) {
        if (content.length === 1) this.contentView = VRender.Component.get(content);
        if (!this.contentView) this.contentView = content;
      }
    }

    return this.contentView;
  };

  _UIScroll.setContentView = function (value) {
    clearContentEvents.call(this);
    var content = this.options.content = value;
    delete this.options.view;
    this.contentView = null;

    if (content) {
      var container = this.$el.children(".container").empty();
      container.append(content.$el || content);
    }

    initContentEvents.call(this);
  };

  _UIScroll.getScrollContainer = function () {
    if (!this.scroller) {
      if (this.options.hasOwnProperty("scroller")) this.scroller = this.options.scroller;else this.scroller = this.$el.attr("opt-scroll");
      this.$el.removeAttr("opt-scroll");
      this.scroller = !this.scroller ? this.$el : $(this.scroller);
    }

    return this.scroller;
  };

  _UIScroll.setScrollContainer = function (value) {
    clearEvents.call(this);
    this.options.scroller = value;
    this.scroller = null;
    initEvents.call(this);
  };

  _UIScroll.getRefreshFunction = function () {
    return Fn.getFunction.call(this, "refreshFunction", "refresh");
  };

  _UIScroll.setRefreshFunction = function (value) {
    this.options.refreshFunction = value;
  };

  _UIScroll.getMoreFunction = function () {
    return Fn.getFunction.call(this, "moreFunction", "more");
  };

  _UIScroll.setMoreFunction = function (value) {
    this.options.moreFunction = value;
  };

  _UIScroll.getTopDistance = function () {
    if (Utils.isNull(this.topDistance)) {
      if (this.options.hasOwnProperty("topDistance")) {
        this.topDistance = this.options.topDistance;
      } else {
        this.topDistance = this.$el.attr("opt-top");
        this.$el.removeAttr("opt-top");
      }

      if (!this.topDistance
      /* && this.topDistance !== 0*/
      ) this.topDistance = this._isRenderAsRem() ? "0.5rem" : "50px";
      this.topDistance = Utils.toPx(this.topDistance);
    }

    return this.topDistance;
  };

  _UIScroll.setTopDistance = function (value) {
    this.options.topDistance = value;
    this.$el.removeAttr("opt-top");
    this.topDistance = null;
  };

  _UIScroll.getBottomDistance = function () {
    if (Utils.isNull(this.bottomDistance)) {
      if (this.options.hasOwnProperty("bottomDistance")) {
        this.bottomDistance = this.options.bottomDistance;
      } else {
        this.bottomDistance = this.$el.attr("opt-bottom");
        this.$el.removeAttr("opt-bottom");
      }

      if (!this.bottomDistance && this.bottomDistance !== 0) this.bottomDistance = this._isRenderAsRem() ? "0.7rem" : "70px";
      this.bottomDistance = Utils.toPx(this.bottomDistance);
    }

    return this.bottomDistance;
  };

  _UIScroll.setBottomDistance = function (value) {
    this.options.bottomDistance = value;
    this.$el.removeAttr("opt-bottom");
    this.bottomDistance = null;
  }; // ====================================================


  var onScrollHandler = function onScrollHandler(e) {
    var state = getScrollState.call(this, e);

    if (state.isUp) {
      if (state.bottom <= this.getBottomDistance()) doMore.call(this, state);
    }
  };

  var onMouseHandler = function onMouseHandler(e) {
    if (e.type == "mousedown") {
      dragStart.call(this, e);
    } else if (e.type == "mousemove") {
      dragMove.call(this, e);
    } else if (e.type == "mouseup") {
      dragEnd.call(this, e);
    } else if (e.type == "mouseleave") {
      dragEnd.call(this, e);
    }

    return false;
  };

  var onTouchHandler = function onTouchHandler(e) {
    if (e.type == "touchstart") {
      dragStart.call(this, e);
    } else if (e.type == "touchmove") {
      dragMove.call(this, e);
    } else if (e.type == "touchend") {
      dragEnd.call(this, e);
    } else if (e.type == "touchcancel") {
      dragEnd.call(this, e);
    }

    return false;
  };

  var onContentLoadHandler = function onContentLoadHandler() {
    var _this = this;

    this.$el.removeClass("is-loading").removeClass("is-refresh");
    checkIfEmpty.call(this);
    var container = this.$el.children(".container");

    if (container.outerHeight() < this.$el.height()) {
      setTimeout(function () {
        doMore.call(_this);
      }, 10);
    }
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    target.addClass("ui-scroll");
    target.append("<div class='top'></div>");
    target.append("<div class='container'></div>");
    target.append("<div class='bottom'></div>");

    UI._baseRender.render.call(this, $, target);

    renderContentView.call(this, $, target);
    renderTopView.call(this, $, target);
    renderBottomView.call(this, $, target);
    renderEmptyView.call(this, $, target);

    if (!frontend) {
      var options = this.options || {};
      var scrollContainer = getScrollContainer.call(this);
      if (scrollContainer) target.attr("opt-scroll", scrollContainer);
      if (options.topDistance || options.topDistance === 0) target.attr("opt-top", options.topDistance);
      if (options.bottomDistance || options.bottomDistance === 0) target.attr("opt-bottom", options.bottomDistance);
      Fn.renderFunction(target, "refresh", options.refreshFunction);
      Fn.renderFunction(target, "more", options.moreFunction);
    }

    return this;
  }; // ====================================================


  var renderContentView = function renderContentView($, target) {
    target = target.children(".container");
    var contentView = this.options.content || this.options.view;

    if (contentView) {
      renderView(target, contentView);
    }
  };

  var renderTopView = function renderTopView($, target) {
    target = target.children(".top").empty();
    var options = this.options || {};

    if (options.refreshView) {
      renderView(target, this.options.refreshView);
    } else {
      var refreshView = $("<div class='scroll-refreshdef'></div>").appendTo(target);
      var pullText = Utils.isNull(options.refreshPullText) ? "下拉刷新" : Utils.trimToEmpty(options.refreshPullText);

      if (pullText) {
        $("<div class='pull'></div>").appendTo(refreshView).text(pullText);
      }

      var dropText = Utils.isNull(options.refreshDropText) ? "松开刷新" : Utils.trimToEmpty(options.refreshDropText);

      if (dropText) {
        $("<div class='drop'></div>").appendTo(refreshView).text(dropText);
      }

      var loadText = Utils.isNull(options.refreshLoadText) ? "正在刷新.." : Utils.trimToEmpty(options.refreshLoadText);

      if (loadText) {
        $("<div class='load'></div>").appendTo(refreshView).text(loadText);
      }
    }
  };

  var renderBottomView = function renderBottomView($, target) {
    target = target.children(".bottom").empty();
    var container = $("<div class='scroll-load'></div>").appendTo(target);

    if (this.options.loadingView) {
      renderView(container, this.options.loadingView);
    } else {
      var loadView = $("<div class='scroll-loaddef'></div>").appendTo(container);
      var loadText = this.options.loadingText;
      loadText = Utils.isNull(loadText) ? "正在加载.." : Utils.trimToEmpty(loadText);

      if (loadText) {
        $("<p></p>").appendTo(loadView).text(loadText);
      }
    }

    container = $("<div class='scroll-bottom'></div>").appendTo(target);

    if (this.options.bottomView) {
      renderView(container, this.options.bottomView);
    } else {
      var bottomView = $("<div class='scroll-bottomdef'></div>").appendTo(container);
      var bottomText = this.options.bottomText;
      bottomText = Utils.isNull(bottomText) ? "没有更多了" : Utils.trimToEmpty(bottomText);

      if (bottomText) {
        $("<p></p>").appendTo(bottomView).text(bottomText);
      }
    }
  };

  var renderEmptyView = function renderEmptyView($, target) {
    UI._itemsRender.renderEmptyView.call(this, $, target);
  };

  var renderView = function renderView(target, view) {
    if (Utils.isFunction(view.render)) view.render(target);else target.append(view.$el || view);
  }; ///////////////////////////////////////////////////////


  var doInit = function doInit() {
    var _this2 = this;

    initEvents.call(this);
    initContentEvents.call(this);
    setTimeout(function () {
      checkIfEmpty.call(_this2);
      if (isContentLoading.call(_this2)) _this2.$el.addClass("is-loading");
    }, 10);
  };

  var initEvents = function initEvents() {
    var scroller = this.getScrollContainer();
    scroller.on("scroll.scroll", onScrollHandler.bind(this));

    if (this._isRenderAsApp()) {
      scroller.on("touchstart.scroll", onTouchHandler.bind(this));
      scroller.on("touchend.scroll", onTouchHandler.bind(this));
      scroller.on("touchmove.scroll", onTouchHandler.bind(this));
      scroller.on("touchcancel.scroll", onTouchHandler.bind(this));
    } else {
      scroller.on("mousedown.scroll", onMouseHandler.bind(this));
      scroller.on("mouseup.scroll", onMouseHandler.bind(this));
      scroller.on("mousemove.scroll", onMouseHandler.bind(this));
      scroller.on("mouseleave.scroll", onMouseHandler.bind(this));
    }
  };

  var clearEvents = function clearEvents() {
    var scroller = this.getScrollContainer();
    scroller.off("scroll.scroll");

    if (this._isRenderAsApp()) {
      scroller.off("touchstart.scroll");
      scroller.off("touchend.scroll");
      scroller.off("touchmove.scroll");
      scroller.off("touchcancel.scroll");
    } else {
      scroller.off("mousedown.scroll");
      scroller.off("mouseup.scroll");
      scroller.off("mousemove.scroll");
      scroller.off("mouseleave.scroll");
    }
  };

  var initContentEvents = function initContentEvents() {
    var contentView = this.getContentView();

    if (contentView && Utils.isFunction(contentView.on)) {
      var loadedHandler = function loadedHandler() {
        onContentLoadHandler.call(this);
      };

      contentView.scroll_loaded = loadedHandler.bind(this);
      contentView.on("loaded", contentView.scroll_loaded);
    }
  };

  var clearContentEvents = function clearContentEvents() {
    var contentView = this.getContentView();

    if (contentView && Utils.isFunction(contentView.off)) {
      if (contentView.scroll_loaded) contentView.off("loaded", contentView.scroll_loaded);
    }
  }; // ====================================================


  var doRefresh = function doRefresh() {
    var _this3 = this;

    if (this.$el.is(".is-refresh, .is-loading")) return;
    var target = this.$el.addClass("is-refresh");

    var complete = function complete() {
      target.removeClass("is-refresh");
      target.removeClass("no-more");
      hideRefreshView.call(_this3);
      checkIfEmpty.call(_this3);
    };

    var result = false;
    var contentView = this.getContentView();

    if (contentView && Utils.isFunction(contentView.reload)) {
      var result1 = result = contentView.reload(1, function () {
        setTimeout(function () {
          if (result1 !== false) complete();
        }, 0);
      });
    }

    if (result === false) {
      var refreshFunction = this.getRefreshFunction();

      if (Utils.isFunction(refreshFunction)) {
        var result2 = result = refreshFunction(function () {
          setTimeout(function () {
            if (result2 !== false) complete();
          }, 0);
        });
      }
    }

    this.trigger("refresh");

    if (result === false) {
      complete();
    }
  };

  var doMore = function doMore(state) {
    var _this4 = this;

    if (this.$el.is(".is-loading, .is-refresh, .no-more")) return;
    var target = this.$el.addClass("is-loading");

    var complete = function complete(hasMore) {
      if (!hasMore) target.addClass("no-more");
      target.removeClass("is-loading");
      checkIfEmpty.call(_this4);
    };

    var result = false;
    var contentView = this.getContentView();

    if (contentView && Utils.isFunction(contentView.more)) {
      var result1 = result = contentView.more(function () {
        setTimeout(function () {
          if (result1 !== false) complete(Utils.isFunction(contentView.hasMore) ? contentView.hasMore() : true);
        }, 0);
      });
    }

    if (result === false) {
      var moreFunction = this.getMoreFunction();

      if (Utils.isFunction(moreFunction)) {
        var result2 = result = moreFunction(function (data) {
          setTimeout(function () {
            if (result2 !== false) complete(data && data.hasOwnProperty("hasMore") ? Utils.isTrue(data.hasMore) : true);
          }, 0);
        });
      }
    }

    this.trigger("more");

    if (result === false) {
      complete();
    }
  }; // ====================================================


  var dragStart = function dragStart(e) {
    if (e.type == "touchstart") {
      if (e.touches.length > 1) return;
      e = e.touches[0];
    }

    var data = this.dragData = {};
    data.scroller = this.getScrollContainer();
    data.startTop = data.scroller.scrollTop();
    data.startX = e.pageX;
    data.startY = e.pageY;
  };

  var dragMove = function dragMove(e) {
    if (e.type == "touchmove") e = e.touches[0];

    if (this.dragData) {
      var data = this.dragData;
      var offset = e.pageY - data.startY;
      data.offset = offset;

      if (!data.moveing) {
        if (e.type == "mousemove") {
          // pc
          if (offset > -10 && offset < 10) return;
          var offsetX = e.pageX - data.startX;
          if (offsetX < -10 || offsetX > 10) return;
          data.moveing = true;
        } else {
          // mobile
          if (offset > -20 && offset < 20) return;
          data.moveing = true;
        }
      }

      if (data.moveing) {
        var isLoading = this.$el.is(".is-loading, .is-refresh");
        var scrollTop = data.startTop - offset;

        if (scrollTop == 0) {
          data.scroller.scrollTop(0);
          if (!isLoading) this.$el.children(".top").height(0);
        } else if (scrollTop > 0) {
          data.scroller.scrollTop(scrollTop);
        } else {
          data.scroller.scrollTop(0);
          if (!isLoading) showRefreshView.call(this, 0 - scrollTop);
        }
      }
    }
  };

  var dragEnd = function dragEnd(e) {
    if (this.dragData) {
      var data = this.dragData;

      if (data.moveing && data.startTop - data.offset < 0) {
        if (!this.$el.is(".is-refresh")) hideRefreshView.call(this);
      }

      this.dragData = null;
    }
  }; // ====================================================


  var showRefreshView = function showRefreshView(height) {
    this.$el.addClass("show-top");
    var refreshView = this.$el.children(".top");
    var content = refreshView.children();

    if (content && content.length > 0) {
      var distance = this.getTopDistance();

      if (height <= distance) {
        content.attr("state", "pull");
      } else {
        content.attr("state", "drop");
        var increment = (height - distance - 1) / (height - distance + 2);
        height = distance + increment * increment * 40;
      }

      var scale = Math.min(1, height / distance);
      content.css("transform", "scale(" + scale.toFixed(5) + ")");
    }

    refreshView.height(height);
  };

  var hideRefreshView = function hideRefreshView() {
    var _this5 = this;

    if (!this.$el.is(".show-top")) return;
    var refreshView = this.$el.children(".top");
    var content = refreshView.children();
    refreshView.addClass("animate");

    var _hide = function _hide() {
      refreshView.height(0);
      content.removeAttr("state");
      setTimeout(function () {
        _this5.$el.removeClass("show-top");

        refreshView.removeClass("animate");
      }, 200);
    };

    if (content && content.length > 0) {
      content.css("transform", "");

      if (content.attr("state") == "drop") {
        content.attr("state", "load");
        refreshView.height(this.getTopDistance());
        doRefresh.call(this);
      } else {
        _hide();
      }
    } else {
      _hide();
    }
  }; // ====================================================


  var getScrollContainer = function getScrollContainer() {
    var container = this.options.scroller;

    if (container) {
      if (Utils.isFunction(container.getViewId)) return "[vid='" + container.getViewId() + "']";
      if (typeof container == "string") return Utils.trimToNull(container);
    }

    return null;
  };

  var getScrollState = function getScrollState(e) {
    var state = {
      offset: 0,
      isUp: true
    };
    state.time = Date.now();
    var scroller = this.getScrollContainer();
    state.scrollerHeight = scroller.height();
    var container = this.$el.children(".container");
    state.containerHeight = container.height();
    state.top = 0 - scroller.scrollTop();
    state.bottom = state.containerHeight + state.top - state.scrollerHeight;
    state.isTop = state.offsetTop >= 0;
    state.isBottom = state.offsetBottom <= 0;

    if (this.lastState) {
      state.offset = state.top - this.lastState.top;

      if (state.time - this.lastState.time > 30) {
        state.isUp = state.offset < 0;
        this.lastState = state;
      } else {
        state.isUp = this.lastState.isUp;
      }
    } else {
      this.lastState = state;
    }

    return state;
  };

  var checkIfEmpty = function checkIfEmpty() {
    if (isContentEmpty.call(this)) this.$el.addClass("is-empty");else this.$el.removeClass("is-empty");
  };

  var isContentEmpty = function isContentEmpty() {
    var contentView = this.getContentView();

    if (contentView) {
      if (Utils.isFunction(contentView.isEmpty)) {
        return contentView.isEmpty();
      }

      return contentView.length <= 0;
    }

    return true;
  };

  var isContentLoading = function isContentLoading() {
    var contentView = this.getContentView();

    if (contentView) {
      if (Utils.isFunction(contentView.isLoading)) {
        return contentView.isLoading();
      } else if (contentView.$el) {
        return contentView.$el.is(".is-loading");
      } else if (contentView instanceof $) {
        return contentView.is(".is-loading");
      }
    }

    return false;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UIScroll = UIScroll;
    UI.init(".ui-scroll", UIScroll, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-07-25
// tree(原treeview)
(function (frontend) {
  if (frontend && VRender.Component.ui.tree) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UITree = UI.tree = function (view, options) {
    return UI._select.call(this, view, options);
  };

  var _UITree = UITree.prototype = new UI._select(false);

  _UITree.init = function (target, options) {
    UI._select.init.call(this, target, options);

    this.$el.on("tap", ".tree-node", onNodeClickHandler.bind(this));
    this.$el.on("tap", ".tree-node > .chkbox", onChkboxClickHandler.bind(this));
    this.$el.on("tap", "li.more > div", onMoreBtnClickHandler.bind(this));

    if (!this._isRenderAsApp()) {
      this.$el.on("tap", ".tree-node > .ep", onExpandClickHandler.bind(this));
    }

    doInit.call(this);
  }; // ====================================================


  _UITree.getDataAt = function (index, deep) {
    var item = getItemByIndex.call(this, index, deep);
    return !!item ? this._getItemData(item) : null;
  };

  _UITree.getDataIndex = function (data, deep) {
    var item = getItemByData.call(this, data, deep);
    return !!item ? getItemIndex.call(this, item, deep) : -1;
  };

  _UITree.getDataByKey = function (value, deep) {
    var item = getItemById.call(this, value, deep);
    return !!item ? this._getItemData(item) : null;
  };

  _UITree.getIndexByKey = function (value, deep) {
    var item = getItemById.call(this, value, deep);
    return !!item ? getItemIndex.call(this, item, deep) : -1;
  };

  _UITree.getDataByName = function (value, deep) {
    var _this = this;

    if (Utils.isBlank(value)) return null;
    var findData = null;
    doLoop.call(this, function (item) {
      var data = _this._getItemData(item);

      if (data && data.name == value) {
        findData = data;
        return false;
      }

      if (!deep && !item.is(".open")) return true;
    });
    return findData;
  };

  _UITree.getIndexByName = function (value, deep) {
    var _this2 = this;

    if (Utils.isBlank(value)) return -1;
    var findIndex = -1;
    doLoop.call(this, function (item, index) {
      var data = _this2._getItemData(item);

      if (data && data.name == value) {
        findIndex = index;
        return false;
      }

      if (!deep && !item.is(".open")) return true;
    });
    return findIndex;
  };

  _UITree.isChkboxVisible = function () {
    return this.$el.attr("opt-chk") == "1";
  };

  _UITree.setChkboxVisible = function (value) {
    value = Utils.isNull(value) ? true : Utils.isTrue(value);

    if (this.isChkboxVisible() != value) {
      var snapshoot = this._snapshoot();

      var nodes = this.$el.find(".tree-node");

      if (value) {
        this.$el.attr("opt-chk", "1");
        nodes.children(".ep").after("<span class='chkbox'><i></i></span>");
      } else {
        this.$el.removeAttr("opt-chk");
        nodes.parent().removeClass("selected").removeClass("selected_");
        nodes.children(".chkbox").remove();
      }

      snapshoot.done();
    }
  };

  _UITree.getChildrenField = function () {
    return this.$el.attr("opt-child") || null;
  };

  _UITree.getLeafField = function () {
    return this.options.leafField;
  };

  _UITree.getSelectedIndex = function (needArray, deep) {
    var indexs = [];

    var _hasChkbox = this.isChkboxVisible();

    var _isMultiple = this.isMultiple();

    doLoop.call(this, function (item, index) {
      if (_hasChkbox) {
        if (item.is(".selected")) {
          indexs.push(index);

          if (_isMultiple) {
            if (!deep) return true;
          } else {
            return false;
          }
        }
      } else if (item.children(".tree-node").is(".active")) {
        indexs.push(index);
        return false;
      }

      if (!deep && !item.is(".open")) return true;
    });
    if (needArray || _isMultiple) return indexs.length > 0 ? indexs : null;
    return indexs.length > 0 ? indexs[0] : -1;
  };

  _UITree.setSelectedIndex = function (value, deep) {
    var _hasChkbox = this.isChkboxVisible();

    var _isMultiple = this.isMultiple();

    var indexs = Fn.getIntValues(value, 0);
    if (indexs.length > 1 && !(_hasChkbox && _isMultiple)) indexs = [indexs.pop()];

    var snapshoot = this._snapshoot();

    var nodes = this.$el.find(".tree-node");
    if (_hasChkbox) nodes.parent().removeClass("selected").removeClass("selected_");else nodes.removeClass("active");

    if (indexs.length > 0) {
      doLoop.call(this, function (item, index) {
        if (indexs.indexOf(index) >= 0) {
          if (_hasChkbox) {
            if (!item.is(".selected")) {
              item.addClass("selected");
              setParentSelected(item);

              if (_isMultiple) {
                setChildrenSelected(item, true);
              } else {
                return false;
              }
            }
          } else {
            item.children(".tree-node").addClass("active");
            return false;
          }
        }

        if (!deep && !item.is(".open")) return true;
      });
    }

    snapshoot.done();
  };

  _UITree.getSelectedKey = function (needArray, deep) {
    var _this3 = this;

    var ids = [];

    var _hasChkbox = this.isChkboxVisible();

    var _isMultiple = this.isMultiple();

    doLoop.call(this, function (item) {
      if (_hasChkbox) {
        if (item.is(".selected")) {
          ids.push(getItemId.call(_this3, item));

          if (_isMultiple) {
            if (!deep) return true;
          } else {
            return false;
          }
        }
      } else if (item.children(".tree-node").is(".active")) {
        ids.push(getItemId.call(_this3, item));
        return false;
      }

      if (!deep && !item.is(".open")) return true;
    });
    if (needArray || _isMultiple) return ids.length > 0 ? ids : null;
    return ids.length > 0 ? ids[0] : null;
  };

  _UITree.setSelectedKey = function (value, deep) {
    var _this4 = this;

    var _hasChkbox = this.isChkboxVisible();

    var _isMultiple = this.isMultiple();

    var ids = Utils.isArray(value) ? value : Utils.isBlank(value) ? [] : Utils.trimToEmpty(value).split(",");
    if (ids.length > 1 && !(_hasChkbox && _isMultiple)) ids = [ids.pop()];

    var snapshoot = this._snapshoot();

    var nodes = this.$el.find(".tree-node");
    if (_hasChkbox) nodes.parent().removeClass("selected").removeClass("selected_");else nodes.removeClass("active");

    if (ids.length > 0) {
      doLoop.call(this, function (item, index) {
        var _id = getItemId.call(_this4, item);

        var _hasSelected = Utils.index(ids, function (tmp) {
          return tmp == _id;
        }) >= 0;

        if (_hasSelected) {
          if (_hasChkbox) {
            if (!item.is(".selected")) {
              item.addClass("selected");
              setParentSelected(item);

              if (_isMultiple) {
                setChildrenSelected(item, true);
              } else {
                return false;
              }
            }
          } else {
            item.children(".tree-node").addClass("active");
            return false;
          }
        }

        if (!deep && !item.is(".open")) return true;
      });
    }

    snapshoot.done();
  };

  _UITree.getSelectedData = function (needArray, deep) {
    var _this5 = this;

    var datas = [];

    var _hasChkbox = this.isChkboxVisible();

    var _isMultiple = this.isMultiple();

    doLoop.call(this, function (item) {
      if (_hasChkbox) {
        if (item.is(".selected")) {
          datas.push(getItemData.call(_this5, item));

          if (_isMultiple) {
            if (!deep) return true;
          } else {
            return false;
          }
        }
      } else if (item.children(".tree-node").is(".active")) {
        datas.push(getItemData.call(_this5, item));
        return false;
      }

      if (!deep && !item.is(".open")) return true;
    });
    if (needArray || _isMultiple) return datas.length > 0 ? datas : null;
    return datas.length > 0 ? datas[0] : null;
  };

  _UITree.isAllSelected = function () {
    var _allSelected = true;
    doLoop.call(this, function (item) {
      if (!item.is(".selected")) {
        _allSelected = false;
        return false;
      }

      return true;
    });
    return _allSelected;
  }; // ====================================================


  _UITree.open = function (data) {
    var item = getItemByData.call(this, data, true);

    if (item) {
      doOpen.call(this, item);
    }
  };

  _UITree.openAt = function (index, deep) {
    var item = getItemByIndex.call(this, index, deep);

    if (item) {
      doOpen.call(this, item);
    }
  };

  _UITree.openByKey = function (value) {
    var item = getItemById.call(this, value, true);

    if (item) {
      doOpen.call(this, item);
    }
  };

  _UITree.close = function (data) {
    var item = getItemByData.call(this, data, true);

    if (item) {
      doClose.call(this, item);
    }
  };

  _UITree.closeAt = function (index, deep) {
    var item = getItemByIndex.call(this, index, deep);

    if (item) {
      doClose.call(this, item);
    }
  };

  _UITree.closeByKey = function (value) {
    var item = getItemById.call(this, value, true);

    if (item) {
      doClose.call(this, item);
    }
  }; // ====================================================


  _UITree.addItem = function (data, pdata, index) {
    if (Utils.isBlank(data)) return false;

    var container = this._getItemContainer();

    if (Utils.isNotBlank(pdata)) {
      var item = getItemByData.call(this, pdata, true);

      if (item) {
        container = item.children("ul");

        if (!(container && container.length > 0)) {
          container = $("<ul></ul>").appendTo(item);
          container.attr("level", parseInt(item.parent().attr("level")) + 1);
        }
      }
    }

    var children = container.children();
    var nodeIndex = container.is(".root") ? 0 : getItemIndex.call(this, container.parent(), true);
    index = Utils.getIndexValue(index);
    if (index >= 0 && index < children.length - 1) nodeIndex += index;

    var snapshoot = this._snapshoot();

    addItem.call(this, container, data, index, nodeIndex);
    snapshoot.done();
    return true;
  };

  _UITree.updateItem = function (data, pdata, index) {
    var _this6 = this;

    if (Utils.isBlank(data)) return false;

    if (!isNaN(pdata) && (pdata || pdata === 0)) {
      index = pdata;
      pdata = null;
    }

    var snapshoot = this._snapshoot();

    if (pdata) {
      // 此时只修改 pdata 下的节点
      var parentItem = getItemByData.call(this, pdata, true);

      if (!parentItem) {
        snapshoot.release();
        return false;
      }

      var children = parentItem.children("ul").children();

      if (Utils.isBlank(index)) {
        var dataId = this._getDataKey(data);

        var item = Utils.find(children, function (_item) {
          var _data = _this6._getItemData(_item);

          return data == _data || dataId == _this6._getDataKey(_data);
        });
        if (item) updateItem.call(this, item, data);
      } else if (!isNaN(index)) {
        index = parseInt(index);
        if (index >= 0 && index < children.length) updateItem.call(this, children.eq(index), data);
      }
    } else if (Utils.isBlank(index)) {
      var _item2 = getItemByData.call(this, data, true);

      if (_item2) updateItem.call(this, _item2, data);
    } else if (!isNaN(index)) {
      // 此时 index 为展开的节点
      index = parseInt(index);

      var _item3 = getItemByIndex.call(this, index);

      if (_item3) updateItem.call(this, _item3, data);
    }

    snapshoot.done();
    return true;
  };

  _UITree.removeItem = function (data, pdata) {
    var _this7 = this;

    if (Utils.isBlank(data)) return false;

    var snapshoot = this._snapshoot();

    if (pdata) {
      var parentItem = getItemByData.call(this, pdata, true);

      if (!parentItem) {
        snapshoot.release();
        return false;
      }

      var dataId = this._getDataKey(data);

      var children = parentItem.children("ul").children();
      var item = Utils.find(children, function (_item) {
        var _data = _this7._getItemData(_item);

        return data == _data || dataId == _this7._getDataKey(_data);
      });
      if (item) removeItem.call(this, item);
    } else {
      var _item4 = getItemByData.call(this, data, true);

      if (_item4) removeItem.call(this, _item4);
    }

    snapshoot.done();
    return true;
  };

  _UITree.removeItemAt = function (index, pdata) {
    index = Utils.getIndexValue(index);
    if (index < 0) return false;

    var snapshoot = this._snapshoot();

    if (pdata) {
      var parentItem = getItemByData.call(this, pdata, true);

      if (!parentItem) {
        snapshoot.release();
        return false;
      }

      var children = parentItem.children("ul").children();
      if (index < children.length) removeItem.call(this, children.eq(index));
    } else {
      var item = getItemByIndex.call(this, index);
      if (item) removeItem.call(this, item);
    }

    snapshoot.done();
    return true;
  };

  _UITree.addOrUpdateItem = function (data, pdata) {
    if (Utils.isBlank(data)) return;
    if (!this.updateItem(data, pdata)) this.addItem(data, pdata);
  };

  _UITree.setItems = function (datas, pdata) {
    datas = Utils.toArray(datas);

    if (pdata) {
      var parentItem = getItemByData.call(this, pdata, true);
      if (!parentItem) return;

      var snapshoot = this._snapshoot();

      var children = parentItem.children("ul").children();

      for (var i = children.length - 1; i >= 0; i--) {
        removeItem.call(this, children.eq(i));
      }

      if (datas && datas.length > 0) {
        var container = parentItem.children("ul");

        if (!(container && container.length > 0)) {
          container = $("<ul></ul>").appendTo(parentItem);
          container.attr("level", parseInt(parentItem.parent().attr("level")) + 1);
        }

        var nodeIndex = getItemIndex.call(this, parentItem, true);

        for (var _i = 0, l = datas.length; _i < l; _i++) {
          addItem.call(this, container, datas[_i], _i, nodeIndex);
          nodeIndex += 1;
        }
      }

      snapshoot.done();
    } else {
      this.setData(datas);
    }
  }; // ====================================================


  _UITree.load = function (api, params, callback) {
    var _this8 = this;

    api = api || this.lastLoadApi || this.$el.attr("api-name");
    if (Utils.isBlank(api)) return false;

    var container = this._getItemContainer().empty();

    loadInner.call(this, container, api, params, function (err, datas) {
      if (!err) {
        if (Utils.isFunction(callback)) callback(false, datas);
      } else if (Utils.isFunction(callback)) {
        callback(err);
      }

      _this8.trigger("loaded", err, datas);
    });
  }; // _UITree.tryAutoLoad = function () {
  // 	UI._base.tryAutoLoad.call(this);
  // };


  _UITree.length = function () {
    return Number.POSITIVE_INFINITY;
  }; // ====================================================


  _UITree._renderItems = function ($, itemContainer, datas) {
    renderItems.call(this, $, this.$el, itemContainer, datas);
  };

  _UITree._getItemContainer = function () {
    return this.$el.children("ul");
  };

  _UITree._getNewItem = function ($, itemContainer, data, index) {
    return getNewItem.call(this, $, itemContainer, data, index);
  };

  _UITree._isIconVisible = function () {
    if (Utils.isTrue(this.options.icon)) return true;
  };

  _UITree._getIcon = function (data, index, level) {
    return getIcon.call(this, this.options.icon, data, index);
  };

  _UITree._getOpenProps = function () {
    var params = {};
    var indexs = this.$el.attr("opt-openinds");

    if (Utils.isNotBlank(indexs)) {
      indexs = getOpenIndex.call(this, indexs);
      params.indexs = indexs && indexs.length > 0 ? indexs : null;
    }

    if (!params.indexs) {
      var ids = this.$el.attr("opt-openids");

      if (Utils.isNotBlank(ids)) {
        ids = getOpenKey.call(this, ids);
        params.ids = ids && ids.length > 0 ? ids : null;
      }
    } // this.$el.removeAttr("opt-openinds").removeAttr("opt-openids");


    return params;
  };

  _UITree._getItemData = function (item) {
    return getItemData.call(this, item);
  };

  _UITree._doAdapter = function (data) {
    var _this9 = this;

    var datas = Utils.toArray(data);
    if (datas._vr_adapter_flag) return datas;
    var dataIndex = 0;
    var childrenField = this.getChildrenField() || "children";

    var _loopmap = function _loopmap(_datas) {
      return Utils.map(_datas, function (_data, i) {
        _data = Fn.doAdapter.call(_this9, _data, dataIndex++);
        if (Utils.isArray(_data[childrenField])) _data[childrenField] = _loopmap(_data[childrenField]);
        return _data;
      });
    };

    datas = _loopmap(datas);
    datas._vr_adapter_flag = true;
    return datas;
  };

  _UITree._snapshoot_shoot = function (state) {
    state.selectedIndex = this.getSelectedIndex(true);
  };

  _UITree._snapshoot_compare = function (state) {
    var selectedIndex = this.getSelectedIndex(true);
    return Fn.equalIndex(state.selectedIndex, selectedIndex);
  }; // ====================================================


  var onNodeClickHandler = function onNodeClickHandler(e) {
    var node = $(e.currentTarget);

    if (!node.is(".active")) {
      this.$el.find(".tree-node.active").removeClass("active");
      node.addClass("active");
      this.trigger("itemclick", this._getItemData(node.parent()));
    }

    if (this._isRenderAsApp()) {
      var item = node.parent();

      if (item.is(".open")) {
        doClose.call(this, item);
      } else {
        doOpen.call(this, item);
      }
    }
  };

  var onExpandClickHandler = function onExpandClickHandler(e) {
    var item = $(e.currentTarget).parent().parent();

    if (item.is(".open")) {
      doClose.call(this, item);
    } else {
      doOpen.call(this, item);
    }

    return false;
  };

  var onChkboxClickHandler = function onChkboxClickHandler(e) {
    var snapshoot = this._snapshoot();

    var item = $(e.currentTarget).parent().parent();
    setItemSelectedOrNot.call(this, item, !item.is(".selected"));
    snapshoot.done();
    return false;
  };

  var onMoreBtnClickHandler = function onMoreBtnClickHandler(e) {
    var _this10 = this;

    var btn = $(e.currentTarget).parent();
    var params = {
      p_no: parseInt(btn.attr("page-no")) + 1
    };
    var parentItem = btn.parent();

    if (parentItem.is(".root")) {
      params.pid = null;
    } else {
      parentItem = parentItem.parent();
      params.pid = getItemId.call(this, parentItem);
    }

    params = Utils.extend(this.lastLoadParams, params);

    var parentItemData = this._getItemData(parentItem);

    doLoad.call(this, parentItem, this.lastLoadApi, params, function (err, datas) {
      _this10.trigger("loaded", err, datas, parentItemData);
    });
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._selectRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._selectRender(false); // ====================================================


  _Renderer.render = function ($, target) {
    target.addClass("ui-tree");
    target.append("<ul class='root' level='0'></ul>");

    UI._selectRender.render.call(this, $, target);

    renderOthers.call(this, $, target);
    return this;
  }; // ====================================================


  _Renderer.getData = function () {
    var _this11 = this;

    var datas = Utils.toArray(this.options.data);
    if (datas._vr_adapter_flag) return datas;
    var dataIndex = 0;
    var childrenField = this.getChildrenField() || "children";

    var _loopmap = function _loopmap(datas) {
      return Utils.map(datas, function (data, i) {
        data = Fn.doAdapter.call(_this11, data, dataIndex++);

        if (Utils.isArray(data[childrenField])) {
          data[childrenField] = _loopmap(data[childrenField]);
        }

        return data;
      });
    };

    datas = _loopmap(datas);
    datas._vr_adapter_flag = true;
    this.options.data = datas;
    return datas;
  };

  _Renderer.isChkboxVisible = function () {
    return Utils.isTrue(this.options.chkbox);
  };

  _Renderer.getChildrenField = function () {
    return this.options.childrenField;
  };

  _Renderer.getLeafField = function () {
    return this.options.leafField;
  }; // ====================================================


  _Renderer._getItemContainer = function ($, target) {
    return target.children("ul");
  }; // 重构渲染方法，逐层显示展开节点


  _Renderer._renderItems = function ($, target) {
    var itemContainer = this._getItemContainer($, target);

    renderItems.call(this, $, target, itemContainer, this.getData());
  };

  _Renderer._renderEmptyView = function () {// do nothing
  };

  _Renderer._renderLoadView = function () {// do nothing
  };

  _Renderer._getNewItem = function ($, itemContainer, data, index) {
    return getNewItem.call(this, $, itemContainer, data, index);
  };

  _Renderer._isIconVisible = function () {
    return Utils.isTrue(this.options.icon);
  };

  _Renderer._getIcon = function (data, index) {
    return getIcon.call(this, this.options.icon, data, index);
  };

  _Renderer._getOpenProps = function () {
    var indexs = getOpenIndex.call(this, this.options.openIndex);
    indexs = indexs && indexs.length > 0 ? indexs : null;
    var ids = getOpenKey.call(this, this.options.openKey);
    ids = ids && ids.length > 0 ? ids : null;
    return {
      indexs: indexs,
      ids: ids
    };
  }; // ====================================================


  var renderItems = function renderItems($, target, itemContainer, datas) {
    renderTreeNodes.call(this, $, itemContainer, datas, 0, 1);
    renderNodeSelected.call(this, $, target, itemContainer);

    if (!frontend) {
      itemContainer.find("li").removeData("_node_data");
    }
  }; // nodeIndex 为起始索引，返回最后一个渲染节点的索引


  var renderTreeNodes = function renderTreeNodes($, itemContainer, datas, nodeIndex, nodeLevel) {
    var _this12 = this;

    var childrenField = this.getChildrenField() || "children";
    Utils.each(datas, function (data) {
      var item = _this12._getNewItem($, itemContainer, data, nodeIndex);

      renderOneNode.call(_this12, $, item, data, nodeIndex, nodeLevel);
      nodeIndex += 1;
      var children = data && data[childrenField];

      if (Utils.isArray(children) && children.length > 0) {
        var _container = $("<ul></ul>").appendTo(item);

        _container.attr("level", nodeLevel);

        nodeIndex = renderTreeNodes.call(_this12, $, _container, children, nodeIndex, nodeLevel + 1);
      }
    });
    return nodeIndex;
  };

  var renderOneNode = function renderOneNode($, item, data, index, level) {
    if (!frontend) {
      item.data("_node_data", data);
    }

    var leafField = this.getLeafField() || "leaf";
    if (Utils.isTrue(data && data[leafField])) item.addClass("is-leaf");
    var node = item.children(".tree-node");
    var icon = node.children(".ic");

    if (icon && icon.length > 0) {
      var iconUrl = this._getIcon(data, index);

      if (Utils.isNotBlank(iconUrl)) icon.children("i").css("backgroundImage", "url(" + iconUrl + ")");
    }

    var container = node.children(".lbl"); // 不做选取设置，树选择比较复杂，需要统一处理

    UI._itemsRender.renderOneItem.call(this, $, node, container, data, index);
  };

  var renderNodeSelected = function renderNodeSelected($, target, itemContainer) {
    var _hasChkbox = this.isChkboxVisible();

    var _isMultiple = this.isMultiple();

    var selectedIndexs = this.getSelectedIndex(true);

    var setItemSelected = function setItemSelected(item) {
      if (_hasChkbox) item.addClass("selected");else item.children(".tree-node").addClass("active");
    };

    if (selectedIndexs) {
      for (var i = 0, l = selectedIndexs.length; i < l; i++) {
        var item = findItemByIndex.call(this, itemContainer, selectedIndexs[i], true);

        if (item) {
          setItemSelected(item);
          if (!_isMultiple) break;
        }
      }

      target.attr("opt-loadinds", selectedIndexs.join(","));
    } else {
      var selectedIds = this.getSelectedKey(true);

      if (selectedIds) {
        for (var _i2 = 0, _l = selectedIds.length; _i2 < _l; _i2++) {
          var _item5 = findItemById.call(this, itemContainer, selectedIds[_i2]);

          if (_item5) {
            setItemSelected(_item5);
            if (!_isMultiple) break;
          }
        }

        target.attr("opt-loadids", selectedIds.join(","));
      }
    }

    checkChildrenSelect.call(this, itemContainer, false);
  };

  var renderOthers = function renderOthers($, target) {
    if (this.isChkboxVisible()) target.attr("opt-chk", "1");
    var childrenField = this.getChildrenField();
    if (Utils.isNotBlank(childrenField)) target.attr("opt-child", childrenField);
    var openProps = this._getOpenProps() || {};
    var indexs = openProps.indexs && openProps.indexs.join(",");
    target.attr("opt-openinds", indexs || null);
    var ids = openProps.ids && openProps.ids.join(",");
    target.attr("opt-openids", ids || null);

    if (!frontend) {
      var icon = this.options.icon;
      if (Utils.isFunction(icon)) icon = escape(icon);else if (typeof icon != "string") icon = Utils.isTrue(icon) ? 1 : 0;
      if (icon) target.attr("opt-icon", icon);
    }
  }; ///////////////////////////////////////////////////////


  var doInit = function doInit() {
    if (!this.options.hasOwnProperty("icon")) {
      var icon = this.$el.attr("opt-icon");
      if (icon == "1") icon = true;else if (/^function/.test(icon)) icon = new Function("var Utils=VRender.Utils;return (" + unescape(icon) + ");")();else if (Utils.isBlank(icon)) icon = false;
      this.options.icon = icon;
    }

    this.$el.removeAttr("opt-icon"); // 随着节点展开和关闭，索引值一直会变

    this.$el.removeAttr("data-inds").removeAttr("data-ids");
    this.openProps = this._getOpenProps();
    tryAutoOpen.call(this);
  };

  var doLoad = function doLoad(item, api, params, callback) {
    var _this13 = this;

    var container = item;

    if (item.is("li")) {
      container = item.children("ul");

      if (!(container && container.length > 0)) {
        container = $("<ul></ul>").appendTo(item);
        container.attr("level", parseInt(item.parent().attr("level")) + 1);
      }
    }

    if (item.is(".is-loaded,.is-loading")) return false;
    item.addClass("is-loading");
    var loadingItem = $("<li class='loading'></li>").appendTo(container);
    loadingItem.append("<div>" + (this.loadingText || "正在加载...") + "</div>");
    container.children(".more").remove();
    var loadSelectedIds = this.$el.attr("opt-loadids") || "";
    loadSelectedIds = loadSelectedIds ? loadSelectedIds.split(",") : [];
    var loadSelectedIndexs = this.$el.attr("opt-loadinds") || "";
    loadSelectedIndexs = loadSelectedIndexs ? loadSelectedIndexs.split(",") : null;
    var nodeIndex = getItemIndex.call(this, item.is("li") ? item : item.children().last());
    VRender.Component.load.call(this, api, params, function (err, data) {
      loadingItem.remove();
      var datas = !err ? Utils.toArray(data) : null;

      if (datas && datas.length > 0) {
        var snapshoot = _this13._snapshoot();

        Utils.each(datas, function (data) {
          var _item = addItem.call(_this13, container, data, -1, nodeIndex);

          if (!_item.is(".selected")) {
            var index = !loadSelectedIndexs ? -1 : getItemIndex.call(_this13, _item);

            var selected = _this13._isSelected(data, index, loadSelectedIndexs, loadSelectedIds);

            if (selected) {
              setItemSelectedOrNot.call(_this13, _item, true);
            }
          }

          nodeIndex += 1;
        });

        if (_this13.hasMore()) {
          var moreItem = $("<li class='more'></li>").appendTo(container);
          moreItem.append("<div>" + (_this13.moreText || "加载更多..") + "</div>");
          moreItem.attr("page-no", _this13._pageInfo.page);
        } else {
          item.addClass("is-loaded");
        }

        snapshoot.done();
      } else {
        item.addClass("is-loaded");
        if (container.children().length == 0) item.addClass("is-leaf").removeClass("open");
      }

      item.removeClass("is-loading");
      if (Utils.isFunction(callback)) callback(err, datas);
    });
  };

  var doOpen = function doOpen(item) {
    var _this14 = this;

    var parentItems = [];

    var _item = item.parent(); // ul


    while (!_item.is(".root")) {
      _item = _item.parent(); // li

      parentItems.push(_item);
      _item = _item.parent(); // ul
    }

    Utils.each(parentItems, function (_item) {
      if (!_item.is(".open")) {
        _item.addClass("open");

        _this14.trigger("open", _this14._getItemData(_item));
      }
    });

    if (!item.is(".open") && !item.is(".is-leaf")) {
      doNodeShowAnimate.call(this, item);

      var itemData = this._getItemData(item);

      var api = this.lastLoadApi || this.$el.attr("api-name");

      if (api && !item.is(".is-loaded")) {
        if (item.children("ul").children().length == 0) {
          var params = {
            pid: getItemId.call(this, item),
            p_no: 1
          };
          params = Utils.extend(this.lastLoadParams, params);
          doLoad.call(this, item, api, params, function (err, datas) {
            _this14.trigger("loaded", err, datas, itemData);
          });
        }
      }

      this.trigger("open", itemData);
    }
  };

  var doClose = function doClose(item) {
    if (item.is(".open")) {
      doNodeHideAnimate.call(this, item);
      this.trigger("close", this._getItemData(item));
    }
  }; // ====================================================


  var setItemSelectedOrNot = function setItemSelectedOrNot(item, beSelected) {
    var _hasChkbox = this.isChkboxVisible();

    var _isMultiple = this.isMultiple();

    var node = item.children(".tree-node");

    if (beSelected) {
      if (_hasChkbox) {
        if (item.is(".selected")) return;

        if (!_isMultiple) {
          this.$el.find("li.selected").removeClass("selected");
          this.$el.find("li.selected_").removeClass("selected_");
        }

        item.addClass("selected").removeClass("selected_");

        if (_isMultiple) {
          setChildrenSelected(item, true);
          setParentSelected(item);
        } else {
          // 单选状态，设置父节点为半选
          while (true) {
            var container = item.parent();
            if (container.is(".root")) break;
            item = container.parent();
            item.addClass("selected_");
          }
        }
      } else {
        if (node.is(".active")) return;
        this.$el.find(".active").removeClass("active");
        node.addClass("active");
      }
    } else if (_hasChkbox) {
      if (item.is(".selected")) item.removeClass("selected");else if (item.is(".selected_")) item.removeClass(".selected_");else return;

      if (_isMultiple) {
        setChildrenSelected(item, false);
      }

      setParentSelected(item);
    } else {
      node.removeClass("active");
    }
  };

  var setChildrenSelected = function setChildrenSelected(item, beSelected) {
    Utils.each(item.children("ul").children(), function (item) {
      if (item.is(".more,.loading")) return;
      item.removeClass("selected_");
      if (beSelected) item.addClass("selected");else item.removeClass("selected");
      setChildrenSelected(item, beSelected);
    });
  };

  var setParentSelected = function setParentSelected(item) {
    var container = item.parent();

    if (!container.is(".root")) {
      var hasSelected = false;
      var allSelected = true;
      Utils.each(container.children(), function (_item) {
        if (_item.is(".more,.loading")) return;

        if (_item.is(".selected")) {
          hasSelected = true;
        } else if (_item.is(".selected_")) {
          hasSelected = true;
          allSelected = false;
        } else {
          allSelected = false;
        }
      });
      var parentItem = container.parent();
      parentItem.removeClass("selected").removeClass("selected_");
      if (allSelected) parentItem.addClass("selected");else if (hasSelected) parentItem.addClass("selected_");
      setParentSelected(parentItem);
    }
  }; // ====================================================


  var addItem = function addItem(itemContainer, data, index, nodeIndex) {
    index = Utils.getIndexValue(index);

    var item = this._getNewItem($, itemContainer, data, nodeIndex);

    if (index >= 0 && index < itemContainer.children().length - 1) itemContainer.children().eq(index).before(item);
    var nodeLevel = parseInt(itemContainer.attr("level"));
    renderOneNode.call(this, $, item, data, nodeIndex, nodeLevel);

    if (!itemContainer.is(".root")) {
      var parentItem = itemContainer.parent().removeClass("is-leaf");
      if (this.isChkboxVisible() && this.isMultiple() && parentItem.is(".selected")) item.addClass("selected");
    }

    var datas = null;
    if (itemContainer.is(".root")) datas = this.getData();else {
      datas = this._getItemData(itemContainer.parent());

      if (datas) {
        var childrenField = this.getChildrenField() || "children";
        if (!Utils.isArray(datas[childrenField])) datas[childrenField] = [];
        datas = datas[childrenField];
      }
    }

    if (Utils.isArray(datas)) {
      if (index >= 0 && index < datas.length) datas.splice(index, 0, data);else datas.push(data);
    }

    return item;
  };

  var updateItem = function updateItem(item, data) {
    var container = item.parent();
    var nodeIndex = getItemIndex.call(this, item, true);
    item.children(".tree-node .lbl").empty();
    var nodeLevel = parseInt(container.attr("level"));
    renderOneNode.call(this, $, item, data, nodeIndex, nodeLevel);
    var datas = null;
    if (container.is(".root")) datas = this.getData();else datas = this._getItemData(container.parent());
    var index = item.index();

    if (Utils.isArray(datas) && index < datas.length) {
      var childrenField = this.getChildrenField() || "children";
      if (!Utils.isArray(data[childrenField])) data[childrenField] = datas[index][childrenField];
      datas.splice(index, 1, data);
    }
  };

  var removeItem = function removeItem(item) {
    doNodeHideAnimate.call(this, item);
    var container = item.parent();
    var index = item.index();

    if (container.is(".root")) {
      var datas = this.getData();
      if (datas && index < datas.length) datas.splice(index, 1);
    } else {
      var data = this._getItemData(container.parent());

      var childrenField = this.getChildrenField() || "children";
      if (Utils.isArray(data[childrenField]) && index < data[childrenField].length) data[childrenField].splice(index, 1);
    }

    setTimeout(function () {
      item.remove();

      if (!container.is(".root")) {
        item = container.parent();
        var children = container.children();

        if (children.length > 0) {
          setParentSelected(children.eq(0));
        } else {
          container.remove();

          if (item.is(".selected_")) {
            item.removeClass("selected_");
            setParentSelected(item);
          }
        }
      }
    }, 220);
  };

  var getItemByIndex = function getItemByIndex(index, deep) {
    index = Utils.getIndexValue(index);
    if (index < 0) return null;
    var findItem = null;
    doLoop.call(this, function (item, nodeIndex) {
      if (index == nodeIndex) {
        findItem = item;
        return false;
      }

      if (!deep && !item.is(".open")) return true;
    });
    return findItem;
  };

  var getItemById = function getItemById(id, deep) {
    var _this15 = this;

    if (Utils.isBlank(id)) return null;
    var findItem = null;
    doLoop.call(this, function (item) {
      var _id = getItemId.call(_this15, item);

      if (id == _id) {
        findItem = item;
        return false;
      }

      if (!deep && !item.is(".open")) return true;
    });
    return findItem;
  };

  var getItemByData = function getItemByData(data, deep) {
    var _this16 = this;

    var findItem = null;

    var dataId = this._getDataKey(data);

    doLoop.call(this, function (item) {
      var _data = _this16._getItemData(item);

      var isMatch = data == _data;

      if (!isMatch) {
        var _id = _this16._getDataKey(_data);

        isMatch = _id == dataId;
      }

      if (isMatch) {
        findItem = item;
        return false;
      } else if (!deep && !item.is(".open")) {
        return true;
      }
    });
    return findItem;
  };

  var getItemIndex = function getItemIndex(item, deep) {
    var index = -1;

    if (item && item.length > 0) {
      doLoop.call(this, function (_item, _index) {
        if (_item.is(item)) {
          index = _index;
          return false;
        }

        if (!deep && !_item.is(".open")) return true;
      });
    }

    return index;
  };

  var getItemId = function getItemId(item) {
    return this._getDataKey(this._getItemData(item));
  };

  var getItemData = function getItemData(item) {
    var data = item.children(".tree-node").data("itemData");

    if (Utils.isBlank(data)) {
      var index = 0;
      var nodeIndex = getItemIndex.call(this, item, true);
      var childrenField = this.getChildrenField() || "children";

      var _loop = function _loop(datas) {
        for (var i = 0, l = datas.length; i < l; i++) {
          var _data2 = datas[i];
          if (index == nodeIndex) return _data2;
          index += 1;

          if (Utils.isArray(_data2[childrenField])) {
            _data2 = _loop(_data2[childrenField]);
            if (_data2) return _data2;
          }
        }
      };

      data = _loop(this.getData());
    }

    return data;
  }; // 遍历树，
  // callback 返回true时结束本节点（包括子节点）的遍历，并继续遍历其他节点。返回false时结束本次遍历


  var doLoop = function doLoop(callback) {
    var nodeIndex = 0;

    var _loop = function _loop(container) {
      var nodeLevel = parseInt(container.attr("level")) || 0;
      var items = container.children();

      for (var i = 0, l = items.length; i < l; i++) {
        var item = items.eq(i);
        if (item.is(".more,.loading")) continue;
        var result = callback(item, nodeIndex, nodeLevel);
        nodeIndex += 1;
        if (result === false) return true;

        if (result !== true) {
          result = _loop(item.children("ul"));
          if (result) return true;
        }
      }
    };

    _loop(this._getItemContainer());
  }; // ====================================================


  var findItemByIndex = function findItemByIndex(itemContainer, index, beOpen) {
    var nodeIndex = 0;

    var _find = function _find(container) {
      var items = container.children();

      for (var i = 0, l = items.length; i < l; i++) {
        var item = items.eq(i);
        if (nodeIndex == index) return item;
        nodeIndex += 1;

        if (!beOpen || item.is(".open")) {
          item = _find(item.children("ul"));
          if (item) return item;
        }
      }

      return null;
    };

    return _find(itemContainer);
  };

  var findItemById = function findItemById(itemContainer, id, beOpen) {
    var _this17 = this;

    var _find = function _find(container) {
      var items = container.children();

      for (var i = 0, l = items.length; i < l; i++) {
        var item = items.eq(i);
        var data = item.data(frontend ? "itemData" : "_node_data");

        var _id = _this17._getDataKey(data);

        if (_id == id) return item;

        if (!beOpen || item.is(".open")) {
          item = _find(item.children("ul"));
          if (item) return item;
        }
      }

      return null;
    };

    return _find(itemContainer);
  };

  var getNewItem = function getNewItem($, itemContainer, data, index) {
    var item = $("<li></li>").appendTo(itemContainer);
    var title = $("<div class='tree-node'></div>").appendTo(item);
    title.append("<span class='ep'></span>");
    if (this.isChkboxVisible()) title.append("<span class='chkbox'><i></i></span>");
    if (this._isIconVisible()) title.append("<span class='ic'><i></i></span>");
    title.append("<div class='lbl'></div>");
    return item;
  };

  var loadInner = function loadInner(container, api, params, callback) {
    var _this18 = this;

    doLoad.call(this, container, api, params, function (err, datas) {
      if (Utils.isFunction(callback)) {
        callback(err, datas);
      }

      tryAutoOpen.call(_this18);
    });
  };

  var tryAutoOpen = function tryAutoOpen() {
    var item = null;
    var openProps = this.openProps || {};

    if (openProps.indexs && openProps.indexs.length > 0) {
      item = getItemByIndex.call(this, openProps.indexs[0], true);

      if (item) {
        openProps.indexs.shift();
      }
    } else if (openProps.ids) {
      for (var i = 0; i < openProps.ids.length; i++) {
        item = getItemById.call(this, openProps.ids[i], true);

        if (item) {
          openProps.ids.splice(i, 1);
          break;
        }
      }
    }

    if (item) {
      item.addClass("open");
      var node = item.parent();

      while (node && node.length > 0 && !node.is(".root")) {
        node = node.parent().addClass("open").parent();
      }

      if (!item.is(".is-loaded") && item.children("ul").children().length == 0) {
        var api = this.lastLoadApi || this.$el.attr("api-name");

        if (Utils.isBlank(api)) {
          tryAutoOpen.call(this);
        } else {
          var params = this.lastLoadParams || this.getInitParams();
          params = Utils.extend({}, params, {
            pid: getItemId.call(this, item)
          });
          loadInner.call(this, item, api, params);
        }
      } else {
        tryAutoOpen.call(this);
      }
    }
  }; // ====================================================


  var doNodeShowAnimate = function doNodeShowAnimate(nodeItem) {
    nodeItem.addClass("open");
    var target = nodeItem.children("ul");

    if (target && target.length > 0) {
      target.height(0);
      Utils.nextTick(function () {
        target.addClass("animate-in");
        target.height(target[0].scrollHeight);
        setTimeout(function () {
          target.css("height", "");
        }, 300);
      });
    }
  };

  var doNodeHideAnimate = function doNodeHideAnimate(nodeItem) {
    var target = nodeItem.children("ul");

    if (target && target.length > 0) {
      target.addClass("animate-out");
      target.height(target[0].scrollHeight);
      setTimeout(function () {
        target.height(0);
        setTimeout(function () {
          nodeItem.removeClass("open");
          target.removeClass("animate-in").removeClass("animate-out");
          target.css("height", "");
        }, 300);
      }, 0);
    } else {
      nodeItem.removeClass("open");
    }
  }; // ====================================================
  // 检查所有节点的选中状态(存在连带状态)
  // 根据当前选中的节点，上下反推所有节点的选中状态


  var checkChildrenSelect = function checkChildrenSelect(itemContainer, isParentSelected) {
    var items = itemContainer.children();

    if (items && items.length > 0) {
      var hasSelected = false;
      var allSelected = true;

      for (var i = 0, l = items.length; i < l; i++) {
        var item = items.eq(i); // item.removeClass("selected").removeClass("selected_");

        var subContainer = item.children("ul");

        if (isParentSelected || item.is(".selected")) {
          hasSelected = true;
          item.addClass("selected"); // 向下选中所有子节点

          if (this.isMultiple()) checkChildrenSelect.call(this, subContainer, true);
        } else {
          // 看看子节点有没有选中的
          var state = checkChildrenSelect.call(this, subContainer, false);

          if (state == "all") {
            // 全部子节点都选中了，当然父节点也要选中
            item.addClass(this.isMultiple() ? "selected" : "selected_");
            hasSelected = true;
          } else if (state == "part") {
            item.addClass("selected_"); // 部分子节点选中，当前父节点做标记

            hasSelected = true;
            allSelected = false;
          } else {
            allSelected = false;
          }
        }
      }

      return allSelected ? "all" : hasSelected ? "part" : null;
    }

    return null;
  };

  var getOpenIndex = function getOpenIndex(value) {
    if (Utils.isBlank(value)) return [];
    if (!Utils.isArray(value)) value = ("" + value).split(",");
    var indexs = [];
    Utils.each(value, function (tmp) {
      if (isNaN(tmp)) return;
      tmp = parseInt(tmp);

      if (!isNaN(tmp) && tmp >= 0) {
        indexs.push(tmp);
      }
    });
    return indexs;
  };

  var getOpenKey = function getOpenKey(value) {
    if (Utils.isBlank(value)) return [];
    if (!Utils.isArray(value)) value = ("" + value).split(",");
    var ids = [];
    Utils.each(value, function (tmp) {
      if (tmp || tmp === 0) {
        ids.push(isNaN(tmp) ? tmp : parseInt(tmp));
      }
    });
    return ids;
  };

  var getIcon = function getIcon(value, data, index) {
    if (Utils.isFunction(value)) return value(data, index);
    if (value === true || value == 1) value = "icon";

    if (typeof value == "string") {
      if (/\/|\./.test(value)) // 文件路径
        return value;
      return data && data[value] || null;
    }

    return null;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UITree = UITree;
    UI.init(".ui-tree", UITree, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");
"use strict";

// 2019-07-29
// treeselect(原treecombobox)
(function (frontend) {
  if (frontend && VRender.Component.ui.treeselect) return;
  var UI = frontend ? VRender.Component.ui : require("../../static/js/init");
  var Fn = UI.fn,
      Utils = UI.util; ///////////////////////////////////////////////////////

  var UITreeSelect = UI.treeselect = function (view, options) {
    return UI._base.call(this, view, options);
  };

  var _UITreeSelect = UITreeSelect.prototype = new UI._base(false);

  _UITreeSelect.init = function (target, options) {
    UI._base.init.call(this, target, options);

    this.tree = UI.tree.find(this.$el)[0];
    this.$el.on("tap", ".ipt", iptClickHandler.bind(this));
    this.$el.on("change", ".dropdown", function () {
      return false;
    });
    this.tree.on("change", treeChangeHandler.bind(this));
    this.tree.on("itemclick", treeItemClickHandler.bind(this));

    if (this._isRenderAsApp()) {
      this.$el.on("tap", ".dropdown", dropdownTouchHandler.bind(this));
    }

    var selectedIndex = this.getSelectedIndex();
    if (selectedIndex && selectedIndex.length > 0) itemChanged.call(this);
  }; // ====================================================


  _UITreeSelect.getData = function () {
    return this.tree.getData();
  };

  _UITreeSelect.setData = function (value) {
    this.tree.setData(value);
  };

  _UITreeSelect.getPrompt = function () {
    return this.$el.children(".ipt").find(".prompt").text();
  };

  _UITreeSelect.setPrompt = function (value) {
    var target = this.$el.children(".ipt");
    target.find(".prompt").remove();

    if (Utils.isNotBlank(value)) {
      $("<span class='prompt'></span>").appendTo(target).text(value);
    }
  };

  _UITreeSelect.getDataAdapter = function () {
    return this.tree.getDataAdapter();
  };

  _UITreeSelect.setDataAdapter = function (value) {
    this.tree.setDataAdapter(value);
  };

  _UITreeSelect.getDataMapper = function () {
    return this.tree.getDataMapper();
  };

  _UITreeSelect.setDataMapper = function (value) {
    this.tree.setDataMapper(value);
  }; // ====================================================


  _UITreeSelect.load = function (api, params, callback) {
    this.tree.load(api, params, callback);
  };

  _UITreeSelect.reload = function (page, callback) {
    this.tree.reload(page, callback);
  };

  _UITreeSelect.isLoading = function () {
    return this.tree.isLoading();
  };

  _UITreeSelect.getDataAt = function (index) {
    return this.tree.getDataAt(index);
  };

  _UITreeSelect.getDataIndex = function (data) {
    return this.tree.getDataIndex(data);
  };

  _UITreeSelect.getDataByKey = function (key) {
    return this.tree.getDataByKey(key);
  };

  _UITreeSelect.getIndexByKey = function (key) {
    return this.tree.getIndexByKey(key);
  };

  _UITreeSelect.getDataByName = function (name) {
    return this.tree.getDataByName(name);
  };

  _UITreeSelect.getIndexByName = function (name) {
    return this.tree.getIndexByName(name);
  };

  _UITreeSelect.getKeyField = function () {
    return this.tree.getKeyField();
  };

  _UITreeSelect.setKeyField = function (value) {
    this.tree.setKeyField(value);
  };

  _UITreeSelect.getLabelField = function () {
    return this.tree.getLabelField;
  };

  _UITreeSelect.setLabelField = function (value) {
    this.tree.setLabelField(value);
  };

  _UITreeSelect.getLabelFunction = function () {
    return this.tree.getLabelFunction();
  };

  _UITreeSelect.setLabelFunction = function (value) {
    this.tree.setLabelFunction(value);
  };

  _UITreeSelect.getItemRenderer = function () {
    return this.tree.getItemRenderer();
  };

  _UITreeSelect.setItemRenderer = function (value) {
    this.tree.setItemRenderer(value);
  };

  _UITreeSelect.isDisabled = function (index) {
    return this.tree.isDisabled(index);
  };

  _UITreeSelect.setDisabled = function (disabled, index) {
    this.tree.setDisabled(disabled, index);
  };

  _UITreeSelect.addItem = function (data, index) {
    return this.tree.addItem(data, index);
  };

  _UITreeSelect.updateItem = function (data, index) {
    return this.tree.updateItem(data, index);
  };

  _UITreeSelect.removeItem = function (data) {
    return this.tree.removeItem(data);
  };

  _UITreeSelect.removeItemAt = function (index) {
    return this.tree.removeItemAt(index);
  };

  _UITreeSelect.addOrUpdateItem = function (data) {
    this.tree.addOrUpdateItem(data);
  };

  _UITreeSelect.getItemData = function (target) {
    return this.tree.getItemData(target);
  };

  _UITreeSelect.isEmpty = function () {
    return this.tree.isEmpty();
  }; // ====================================================


  _UITreeSelect.isMultiple = function () {
    return this.$el.attr("multiple") == "multiple";
  };

  _UITreeSelect.setMultiple = function (value) {
    value = Utils.isNull(value) || Utils.isTrue(value) ? true : false;

    if (this.isMultiple() != value) {
      if (value) this.$el.attr("multiple", "multiple");else this.$el.removeAttr("multiple");
      this.tree.setMultiple(value);
    }
  };

  _UITreeSelect.getSelectedIndex = function (needArray) {
    return this.tree.getSelectedIndex(needArray, true);
  };

  _UITreeSelect.setSelectedIndex = function (value) {
    this.tree.setSelectedIndex(value, true);
  };

  _UITreeSelect.getSelectedKey = function (needArray) {
    return this.tree.getSelectedKey(needArray, true);
  };

  _UITreeSelect.setSelectedKey = function (value) {
    this.tree.setSelectedKey(value, true);
  };

  _UITreeSelect.getSelectedData = function (needArray) {
    return this.tree.getSelectedData(needArray, true);
  };

  _UITreeSelect.isSelectedIndex = function (index) {
    return this.tree.isSelectedIndex(index);
  };

  _UITreeSelect.isSelectedKey = function (value) {
    return this.tree.isSelectedKey(value);
  };

  _UITreeSelect.isAllSelected = function () {
    return this.tree.isAllSelected();
  };

  _UITreeSelect.length = function () {
    return this.tree.length();
  }; // ====================================================


  var iptClickHandler = function iptClickHandler(e) {
    showDropdown.call(this);
  };

  var dropdownTouchHandler = function dropdownTouchHandler(e) {
    if ($(e.target).is(".dropdown")) hideDropdown.call(this);
  };

  var treeChangeHandler = function treeChangeHandler(e) {
    itemChanged.call(this);
  };

  var treeItemClickHandler = function treeItemClickHandler(e, data) {
    if (!this.isMultiple()) {
      itemChanged.call(this);
      if (data.leaf || !this._isRenderAsApp()) hideDropdown.call(this);
    }
  };

  var comboMouseHandler = function comboMouseHandler(e) {
    Fn.mouseDebounce(e, hideDropdown.bind(this));
  }; ///////////////////////////////////////////////////////


  var Renderer = function Renderer(context, options) {
    UI._baseRender.call(this, context, options);
  };

  var _Renderer = Renderer.prototype = new UI._baseRender(false);

  _Renderer.render = function ($, target) {
    UI._baseRender.render.call(this, $, target);

    target.addClass("ui-treeselect"); // 容器，用于下拉列表定位

    target.attr("opt-box", this.options.container);
    if (this.isMultiple()) target.attr("multiple", "multiple");
    renderTextView.call(this, $, target);
    renderTreeView.call(this, $, target);
    return this;
  };

  _Renderer.renderData = function () {// do nothing
  }; // ====================================================


  _Renderer.getDataAdapter = function () {
    return null;
  };

  _Renderer.getDataMapper = function () {
    return null;
  };

  _Renderer.isMultiple = function () {
    return Fn.isMultiple.call(this);
  }; // ====================================================


  var renderTextView = function renderTextView($, target) {
    var ipttag = $("<div class='ipt'></div>").appendTo(target);
    var input = $("<input type='text'/>").appendTo(ipttag);
    input.attr("readonly", "readonly");
    ipttag.append("<button class='dropdownbtn'></button>");
    ipttag.append("<span class='prompt'>" + Utils.trimToEmpty(this.options.prompt) + "</span>");
  };

  var renderTreeView = function renderTreeView($, target) {
    target = $("<div class='dropdown'></div>").appendTo(target);
    var treeOptions = getTreeOptions.call(this, this.options);

    if (!frontend) {
      var UITree = require("../tree/index");

      new UITree(this, treeOptions).render(target);
    } else {
      treeOptions.target = target;
      UI.tree.create(treeOptions);
    }
  }; ///////////////////////////////////////////////////////


  var isDropdownVisible = function isDropdownVisible() {
    return this.$el.is(".show-dropdown");
  };

  var showDropdown = function showDropdown() {
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
    }

    setTimeout(function () {
      target.addClass("animate-in");
    }, 0);
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

  var itemChanged = function itemChanged() {
    var _this = this;

    // 树型的 index 比较复杂，这里不用 snapshoot 了
    // let snapshoot = this._snapshoot();
    // let indexs = this.getSelectedIndex(true);
    // Component.select.setSelectedIndex.call(this, indexs);
    var datas = this.getSelectedData(true);
    var labels = Utils.map(Utils.toArray(datas), function (data) {
      return _this.tree._getDataLabel(data);
    });
    labels = labels.join(", ");
    this.$el.children(".ipt").find("input").val(labels || "");

    if (labels) {
      this.$el.addClass("has-val");
    } else {
      this.$el.removeClass("has-val");
    }

    this.trigger("change");
    this.$el.trigger("change"); // console.log("====>", indexs, snapshoot.compare())
    // snapshoot.done();
  }; // ====================================================


  var getTreeOptions = function getTreeOptions(options) {
    var _options = {};
    _options.data = options.data;
    _options.keyField = options.keyField;
    _options.labelField = options.labelField;
    _options.labelFunction = options.labelFunction;
    _options.itemRenderer = options.itemRenderer;
    _options.selectedIndex = options.selectedIndex;
    _options.selectedKey = options.selectedKey;
    _options.multiple = this.isMultiple();
    _options.chkbox = !!_options.multiple;
    _options.dataAdapter = options.dataAdapter;
    _options.dataMapper = options.dataMapper;
    _options.loadingView = options.loadingView;
    _options.loadingText = options.loadingText;
    _options.emptyView = options.emptyView;
    _options.emptyText = options.emptyText;
    _options.moreView = options.moreView;
    _options.moreText = options.moreText;
    _options.apiName = options.apiName;
    _options.apiParams = options.apiParams;
    _options.autoLoad = options.autoLoad;
    _options.icon = options.icon;
    _options.openIndex = options.openIndex;
    _options.openKey = options.openKey;
    return _options;
  }; ///////////////////////////////////////////////////////


  if (frontend) {
    window.UITreeSelect = UITreeSelect;
    UI.init(".ui-treeselect", UITreeSelect, Renderer);
  } else {
    module.exports = Renderer;
  }
})(typeof window !== "undefined");