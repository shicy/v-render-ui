// 2019-04-15

(function (frontend) {
	if (frontend && VRender.Component.ui)
		return ;

	const Utils = frontend ? VRender.Utils : require(__vrender__).Utils;

	///////////////////////////////////////////////////////
	const Fn = {};

	// 组件数据适配转换，支持数组对象
	Fn.doAdapter = function (data, index) {
		if (data && data._vr_adapter_flag)
			return data;
		let adapter = this.options.dataAdapter || this.options.adapter;
		if (Utils.isFunction(this.getDataAdapter))
			adapter = this.getDataAdapter();
		if (Utils.isFunction(adapter)) {
			data = adapter(data, index);
			if (data)
				data._vr_adapter_flag = true;
		}
		return data;
	};

	// 获取数据的编号
	Fn.getDataKey = function (data) {
		if (Utils.isBlank(data))
			return null;
		if (Utils.isPrimitive(data))
			return data;
		let keyField = this.options.keyField;
		if (Utils.isFunction(this.getKeyField))
			keyField = this.getKeyField();
		if (Utils.isNotBlank(keyField))
			return data[keyField];
		if (data.hasOwnProperty("id"))
			return data.id;
		if (data.hasOwnProperty("code"))
			return data.code;
		if (data.hasOwnProperty("value"))
			return data.value;
		return null;
	};

	// 获取数据的显示文本
	Fn.getDataLabel = function (data, index) {
		let labelFunction = this.options.labelFunction;
		if (Utils.isFunction(this.getLabelFunction))
			labelFunction = this.getLabelFunction();
		if (Utils.isFunction(labelFunction))
			return labelFunction.call(this, data, index);
		if (Utils.isBlank(data))
			return "";
		if (Utils.isPrimitive(data))
			return "" + data;
		let labelField = this.options.labelField;
		if (Utils.isFunction(this.getLabelField))
			labelField = this.getLabelField();
		if (Utils.isNotBlank(labelField))
			return Utils.isNull(data[labelField]) ? "" : data[labelField];
		if (data.hasOwnProperty("label"))
			return Utils.isNull(data.label) ? "" : data.label;
		if (data.hasOwnProperty("name"))
			return Utils.isNull(data.name) ? "" : data.name;
		if (data.hasOwnProperty("value"))
			return Utils.isNull(data.value) ? "" : data.value;
		return "" + data;
	};

	// 获取数据的属性映射对象，组件数据经过映射后才返回给客户端，可以有效保证数据的私密性
	// 映射对象将被添加到组件标签的属性中，前端可以通过 this.$el.data() 获取
	Fn.getMapData = function (data) {
		let mapper = this.options.dataMapper || this.options.mapper;
		if (Utils.isFunction(this.getDataMapper))
			mapper = this.getDataMapper();
		if (Utils.isFunction(mapper))
			return mapper(data);
		if (Utils.isNull(data))
			return null;
		if (Utils.isPrimitive(data))
			return data;
		let attrs = {};
		if (data.hasOwnProperty("id"))
			attrs["id"] = data.id;
		if (data.hasOwnProperty("code"))
			attrs["code"] = data.code;
		if (data.hasOwnProperty("name"))
			attrs["name"] = data.name;
		if (data.hasOwnProperty("value"))
			attrs["value"] = data.value;
		if (data.hasOwnProperty("label"))
			attrs["label"] = data.label;
		return attrs;
	};

	Fn.isMultiple = function () {
		if (this.options.hasOwnProperty("multiple"))
			return Utils.isTrue(this.options.multiple);
		return Utils.isTrue(this.options.multi);
	};

	// 在元素标签上渲染数据，以 “data-” 属性方式添加
	Fn.renderData = function (target, data) {
		if (Utils.isFunction(this.getMapData))
			data = this.getMapData(data);
		if (data) {
			if (Utils.isPrimitive(data)) {
				target.attr("data-v", data);
			}
			else {
				for (let n in data) {
					target.attr(("data-" + n), Utils.trimToEmpty(data[n]));
				}
			}
		}
	};

	// 渲染接口定义的方法，仅服务端有效，服务端定义的接口方法可在前端获取到
	Fn.renderFunction = function (target, name, fn) {
		if (!frontend && Utils.isNotBlank(name) && Utils.isFunction(fn)) {
			target.write("<div class='ui-fn' style='display:none' name='" + name + 
				"' fn-state='" + (fn._state || "") + "' fn-data='" + (fn._data || "") + 
				"'>" + escape(fn) + "</div>");
		}
	};

	// 获取接口定义方法，能获取服务端定义的方法
	// 优先获取前端定义或赋值的方法：options.fn > component.fn > serverside.fn
	Fn.getFunction = function (name, type) {
		if (this.options.hasOwnProperty(name))
			return this.options[name];
		if (this.hasOwnProperty(name))
			return this[name];
		let func = null;
		let target = this.$el.children(".ui-fn[name='" + (type || name) + "']");
		if (target && target.length > 0) {
			func = target.text();
			if (Utils.isNotBlank(func)) {
				func = (new Function("var Utils=VRender.Utils;return (" + unescape(func) + ");"))();
				func._state = target.attr("fn-state") || null;
				func._data = target.attr("fn-data") || null;
				if (func._data) {
					try {
						func._data = JSON.parse(func._data);
					}
					catch (e) {}
				}
			}
			target.remove();
		}
		this[name] = func;
		return func;
	};

	// 渲染子视图
	Fn.renderSubView = function (target, view) {
		if (view) {
			if (Utils.isFunction(view.render))
				view.render(target);
			else
				target.append(view.$el || view);
		}
	};

	// 异步数据加载方法
	Fn.load = function (api, params, callback) {
		api = api || this.lastLoadApi || this.$el.attr("api-name");
		if (Utils.isBlank(api))
			return false;
		let self = this;
		let target = this.$el.addClass("is-loading");
		let timerId = this.loadTimerId = Date.now();
		Component.load.call(this, api, params, function (err, data) {
			if (timerId == self.loadTimerId) {
				target.removeClass("is-loading");

				let pager = Utils.isFunction(self.getPaginator) && self.getPaginator();
				if (pager && Utils.isFunction(pager.set)) {
					let pageInfo = self._pageInfo || {}
					pager.set(pageInfo.total, pageInfo.page, pageInfo.size);
				}

				if (Utils.isFunction(callback))
					callback(err, data);
			}
		});
		return true;
	};

	// 解析并返回一个整数数组，忽略无效数据
	// 参数可以是数组（[1,2,3]）或逗号分隔的字符串（"1,2,3"）
	Fn.getIntValues = function (value, min, max) {
		if (!Utils.isArray(value))
			value = Utils.isBlank(value) ? [] : ("" + value).split(",");
		min = Utils.isNull(min) ? Number.NEGATIVE_INFINITY : min;
		max = Utils.isNull(max) ? Number.POSITIVE_INFINITY : max;
		let values = [];
		Utils.each(value, function (val) {
			if (!isNaN(val)) {
				val = parseInt(val);
				if (!isNaN(val) && values.indexOf(val) < 0) {
					if (val >= min && val <= max)
						values.push(val);
				}
			}
		});
		return values;
	};

	// 判断2个索引是否一致，包括多选的情况
	// 参数可以是数组（[1,2,3]）或逗号分隔的字符串（"1,2,3"）
	Fn.equalIndex = function (index1, index2) {
		index1 = Fn.getIntValues(index1, 0);
		index2 = Fn.getIntValues(index2, 0);
		if (index1.length != index2.length)
			return false;
		index1.sort(function (a, b) { return a > b; });
		index2.sort(function (a, b) { return a > b; });
		for (let i = 0, l = index1.length; i < l; i++) {
			if (index1[i] != index2[i])
				return false;
		}
		return true;
	};

	// 快照
	Fn.snapshoot = function () {
		let state = {}, newState = {}, self = this;

		let _snapshoot = {};
		if (!this._rootSnapshoot)
			this._rootSnapshoot = _snapshoot;

		_snapshoot.shoot = function (_state, args) {
			_state = _state || state;
			if (Utils.isFunction(self._snapshoot_shoot)) {
				let params = Array.prototype.slice.call(arguments);
				params[0] = _state;
				self._snapshoot_shoot.apply(self, params);
			}
			else {
				_state.data = self.getData();
			}
		};
		_snapshoot.compare = function (args) {
			let params = Array.prototype.slice.call(arguments);
			if (Utils.isFunction(self._snapshoot_compare)) {
				return self._snapshoot_compare.apply(self, [state].concat(params));
			}
			else {
				this.shoot.apply(this, [newState].concat(params));
				return state.data == newState.data;
			}
		};
		_snapshoot.done = function (args) {
			let hasChanged = false;
			if (self._rootSnapshoot == this) {
				let params = Array.prototype.slice.call(arguments);
				if (!this.compare.apply(this, params)) {
					this.shoot.apply(this, [newState].concat(params));
					if (Utils.isFunction(self._snapshoot_change))
						self._snapshoot_change(newState.data, state.data);
					self.trigger("change", newState.data, state.data);
					self.$el.trigger("change", newState.data, state.data);
					hasChanged = true;
				}
			}
			this.release();
			return hasChanged;
		};
		_snapshoot.release = function () {
			if (self._rootSnapshoot == this)
				self._rootSnapshoot = null;
		};
		_snapshoot.getState = function () {
			return state;
		};

		_snapshoot.shoot(state);
		newState.data = state.data;

		return _snapshoot;
	};

	Fn.getDropdownHeight = function (target, maxHeight) {
		let height = 0;
		if (this._isRenderAsApp()) {
			height = $(window).height() * 0.8;
		}
		else {
			height = parseInt(target.css("maxHeight")) || maxHeight || 300;
		}
		let scrollHeight = target.get(0).scrollHeight;
		if (height > scrollHeight)
			height = scrollHeight;
		return height;
	};

	Fn.mouseDebounce = function (event, handler) {
		let target = $(event.currentTarget);
		let timerId = parseInt(target.attr("timerid"));
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

			UIComp.prototype._create = function (options) {
				options = options || {};
				if (Utils.isFunction(this.isWidthEnabled))
					options.widthDisabled = !this.isWidthEnabled();
				if (Utils.isFunction(this.isHeightEnabled))
					options.heightDisabled = !this.isHeightEnabled();
				return VComponent.create(options, null, Renderer);
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
		VRender.Component.ui.init = Fn.init;
	}
	else {
		exports.util = Utils;
		exports.fn = Fn;
		require("./base");
		require("./items");
		require("./selectable");
	}
})(typeof window !== "undefined");