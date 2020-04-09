// 2019-06-10
// form(原formview)

(function (frontend) {
	if (frontend && VRender.Component.ui.form)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	const VERTICAL = "vertical";
	const HORIZONTIAL = "horizontial";

	///////////////////////////////////////////////////////
	const UIForm = UI.form = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIForm = UIForm.prototype = new UI._base(false);

	_UIForm.init = function (target, options) {
		UI._base.init.call(this, target, options);

		let btnbar = this.$el.children(".btnbar");
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
	};

	// ====================================================
	_UIForm.validate = function (name, callback) {
		if (Utils.isFunction(name)) {
			callback = name;
			name = null;
		}

		let formItems = this._getItems();
		if (name)
			formItems = Utils.filter(formItems, (item) => (item.attr("name") == name));

		let errors = [];
		let count = formItems.length;
		Utils.each(formItems, (item, index) => {
			validateItem.call(this, item, null, (result) => {
				if (result) {
					errors.push({index: index, name: item.attr("name"), message: result});
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
		if (this.$el.is(".is-loading"))
			return false;

		if (Utils.isFunction(action)) {
			callback = action;
			action = null;
		}
		if (Utils.isBlank(action))
			action = this.getAction();

		this.$el.addClass("is-loading");
		let submitBtn = this.$el.find(".btnbar .is-submit .ui-btn");
		Utils.each(submitBtn, (button) => {
			VRender.Component.get(button).waiting();
		});

		let resultHandler = (err, ret, submitParams) => {
			this.$el.removeClass("is-loading");
			Utils.each(submitBtn, (button) => {
				VRender.Component.get(button).waiting(0);
			});
			let result = null;
			if (Utils.isFunction(callback)) {
				result = callback(err, ret, submitParams);
			}
			if (action) {
				let event = { type: "action_after" };
				this.trigger(event, err, ret, submitParams);
				if (event.isPreventDefault)
					result = false;
			}
			if (result !== false && err) {
				let errmsg = "";
				if (Utils.isArray(err)) {
					errmsg = Utils.map(err, (tmp) => (tmp.message)).join("；");
				}
				else {
					errmsg = err.msg || err;
				}
				new UIMessage({ type: "error", content: errmsg });
			}
			return false;
		};

		this.validate((errors) => {
			if (!errors && action) {
				doSubmit.call(this, action, resultHandler);
			}
			else {
				resultHandler(errors);
			}
		});
	};

	// ====================================================
	_UIForm.add = function (name, label, index) {
		let container = this.$el.children(".items");

		let item = $("<div class='form-item'></div>").appendTo(container);
		item.attr("name", Utils.trimToNull(name));

		let content = $("<dl class='content'></dl>").appendTo(item);
		let labelTarget = $("<dt></dt>").appendTo(content);
		labelTarget.text(Utils.trimToEmpty(label));
		labelTarget.css("width", Utils.trimToEmpty(this.getLabelWidth()));

		content.append("<dd><div></div></dd>");

		index = Utils.getIndexValue(index);
		if (index >= 0) {
			let items = container.children();
			if (index < items.length - 1)
				items.eq(index).before(item);
		}

		return new FormItem_frontend(this, item);
	};

	_UIForm.get = function (name) {
		if (Utils.isBlank(name))
			return null;
		let item = Utils.find(this._getItems(), (item) => {
			return item.attr("name") == name;
		});
		return !item ? null : (new FormItem_frontend(this, item));
	};

	_UIForm.getAt = function (index) {
		index = Utils.getIndexValue(index);
		if (index >= 0) {
			let item = this._getItems().eq(index);
			return !item ? null : (new FormItem_frontend(this, item));
		}
		return null;
	};

	_UIForm.getView = function (name) {
		let item = this.get(name);
		return item && item.getContentView() || null;
	};

	_UIForm.delete = function (name) {
		if (Utils.isBlank(name))
			return null;
		let item = Utils.find(this._getItems(), (item) => {
			return item.attr("name") == name;
		});
		if (item)
			item.remove();
		return item;
	};

	_UIForm.deleteAt = function (index) {
		index = Utils.getIndexValue(index);
		if (index >= 0) {
			let item = this._getItems().eq(index);
			if (item)
				item.remove();
			return item;
		}
		return null;
	};

	// ====================================================
	_UIForm.getFormData = function (beTrim) {
		let params = {};
		params = Utils.extend(params, this.getParams());
		Utils.each(this._getItems(), (item) => {
			let name = item.attr("name");
			if (Utils.isBlank(name))
				return ;
			let content = item.children(".content").children("dd").children().children();
			if (content.is("input, textarea")) {
				params[name] = content.val() || "";
			}
			else {
				let contentView = VRender.Component.get(content) || VRender.FrontComponent.get(content);
				if (contentView) {
					if (contentView instanceof UI.select) {
						params[name] = contentView.val();
					}
					else if (contentView instanceof UI._select) {
						params[name] = contentView.getSelectedKey();
					}
					else if (Utils.isFunction(contentView.getValue)) {
						params[name] = contentView.getValue();
					}
					else if (Utils.isFunction(contentView.val)) {
						if (!Utils.isFunction(contentView.isChecked) || contentView.isChecked())
							params[name] = contentView.val();
					}
				}
				else {
					params[name] = content.attr("data-val");
				}
			}
			if (beTrim && params[name] && (typeof params[name] == "string"))
				params[name] = Utils.trimToEmpty(params[name]);
		});
		return params;
	};
	_UIForm.setFormData = function (data) {
		data = data || {};
		Utils.each(this._getItems(), (item) => {
			let name = item.attr("name");
			if (Utils.isBlank(name))
				return ;
			if (!data.hasOwnProperty(name))
				return ;
			let value = data[name];
			let content = item.children(".content").children("dd").children().children();
			if (content.is("input, textarea")) {
				content.val(Utils.trimToEmpty(value));
				validateInput.call(this, item, content);
			}
			else {
				let contentView = VRender.Component.get(content);
				if (contentView) {
					if (contentView instanceof UI._select) {
						contentView.setSelectedKey(value);
						validateSelectionView.call(this, item, contentView);
					}
					else if (Utils.isFunction(contentView.val)) {
						contentView.val(Utils.trimToEmpty(value));
						validateItem.call(this, item, content);
					}
				}
				else {
					content.attr("data-val", Utils.trimToEmpty(value));
				}
			}
		});
	};

	_UIForm.getColumns = function () {
		if (this._isRenderAsApp())
			return 1;
		if (this.options.hasOwnProperty("columns"))
			return parseInt(this.options.columns) || 1;
		this.options.columns = parseInt(this.$el.attr("opt-cols")) || 1;
		this.$el.removeAttr("opt-cols");
		return this.options.columns;
	};
	_UIForm.setColumns = function (value) {
		if (this._isRenderAsApp())
			return ;
		let columns = parseInt(value) || 1;
		if (columns < 1)
			columns = 1;
		this.options.columns = columns;
		this.$el.removeAttr("opt-cols");
		Utils.each(this._getItems(), (item) => {
			let colspan = parseInt(item.attr("opt-col")) || 1;
			if (columns > colspan)
				item.css("width", (colspan * 100 / columns).toFixed(6) + "%");
			else
				item.css("width", "");
		});
	};

	_UIForm.getAction = function () {
		return this.$el.attr("opt-action");
	};
	_UIForm.setAction = function (value) {
		this.$el.attr("opt-action", Utils.trimToEmpty(value));
	};

	_UIForm.getParams = function () {
		if (this.options.hasOwnProperty("params"))
			return this.options.params;
		let params = null;
		try {
			params = JSON.parse(this.$el.attr("opt-params"));
		}
		catch (e) {};
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
		if (this.options.hasOwnProperty("labelWidth"))
			return this.options.labelWidth;
		let width = this.$el.attr("opt-lw");
		this.options.labelWidth = Utils.getFormatSize(width, this._isRenderAsRem());
		this.$el.removeAttr("opt-lw");
		return this.options.labelWidth;
	};
	_UIForm.setLabelWidth = function (value) {
		this.options.labelWidth = value;
		this.$el.removeAttr("opt-lw");
	};

	_UIForm.getLabelAlign = function () {
		let align = this.$el.attr("opt-la");
		return /^(center|right)$/.test(align) ? align : "left";
	};
	_UIForm.setLabelAlign = function (value) {
		let align = /^(center|right)$/.test(value) ? align : "left";
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
	};

	// ====================================================
	_UIForm._getItems = function () {
		return this.$el.children(".items").children();
	};

	// ====================================================
	const onButtonClickHandler = function (e) {
		let btn = $(e.currentTarget);
		if (btn.parent().is(".is-submit")) {
			this.submit();
		}
		let btnName = btn.attr("name");
		if (btnName) {
			this.trigger("btn_" + btnName);
			this.trigger("btnclick", btnName, btn);
		}
	};

	const onNativeInputKeyHandler = function (e) {
		let input = $(e.currentTarget);
		if (!input.is("input, textarea"))
			return ;
		// console.log("onNativeInputKeyHandler");
		let item = Utils.parentUntil(input, ".form-item");
		hideErrorMsg.call(this, item);
	};

	const onNativeInputFocusHandler = function (e) {
		let input = $(e.currentTarget);
		if (!input.is("input, textarea"))
			return ;
		// console.log("onNativeInputFocusHandler");
		let item = Utils.parentUntil(input, ".form-item");
		validateInput.call(this, item, input);
	};

	const onTextViewKeyHandler = function (e) {
		let item = Utils.parentUntil(e.currentTarget, ".form-item");
		item.removeClass("is-error");
	};

	const onTextViewFocusHandler = function (e) {
		let input = $(e.currentTarget);
		let item = Utils.parentUntil(input, ".form-item");
		let textView = VRender.Component.get(input.parent().parent());
		validateTextView.call(this, item, textView);
	};

	const onValueChangeHandler = function (e) {
		let target = $(e.currentTarget);
		if (target.is("input, textarea, .ui-input"))
			return ;
		// console.log("onValueChangeHandler");
		let item = Utils.parentUntil(target, ".form-item");
		validateItem.call(this, item);
	};

	const onItemMouseHandler = function (e) {
		let item = Utils.parentUntil(e.currentTarget, ".form-item");
		if (item.is(".is-error")) {
			stopErrorFadeout.call(this, item);
			if (e.type == "mouseenter") {
				item.children(".errmsg").removeClass("animate-out");
			}
			else /*if (e.type == "mouseleave")*/ {
				startErrorFadeout.call(this, item);
			}
		}
	};

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-form");

		let options = this.options || {};

		renderView.call(this, $, target);

		let labelAlign = this.getLabelAlign();
		if (labelAlign && labelAlign != "left")
			target.attr("opt-la", labelAlign);

		target.attr("opt-action", Utils.trimToNull(options.action));
		target.attr("opt-method", Utils.trimToNull(options.method));

		let orientation = this.getOrientation();
		target.addClass(orientation).attr("opt-orientate", orientation);

		if (!frontend) {
			if (options.params) {
				target.attr("opt-params", JSON.stringify(options.params));
			}

			let columns = this.getColumns();
			if (columns > 1)
				target.attr("opt-cols", columns);

			let labelWidth = this.getLabelWidth();
			if (labelWidth)
				target.attr("opt-lw", labelWidth);
		}

		return this;
	};

	_Renderer.renderData = function () {
		// do nothing
	};

	// ====================================================
	_Renderer.add = function (name, label, index) {
		let datas = Utils.toArray(this.options.data);
		let newData = {name: name, label: label};
		index = Utils.getIndexValue(index);
		if (index >= 0 && index < datas.length)
			datas.splice(index, 0, newData);
		else
			datas.push(newData);
		this.options.data = datas;
		return new FormItem_bankend(newData);
	};

	_Renderer.get = function (name) {
		if (Utils.isBlank(name))
			return null;

		let datas = Utils.toArray(this.options.data);
		let data = Utils.findBy(datas, "name", name);
		if (data)
			return new FormItem_bankend(data);

		return null;
	};

	_Renderer.getAt = function (index) {
		index = Utils.getIndexValue(index);
		let datas = Utils.toArray(this.options.data);
		if (index >= 0 && index < datas.length) {
			if (!datas[index])
				datas[index] = {};
			return new FormItem_bankend(datas[index]);
		}
		return null;
	};

	_Renderer.delete = function (name) {
		if (Utils.isBlank(name))
			return null;
		let datas = Utils.toArray(this.options.data);
		let items = Utils.deleteBy(datas, "name", name);
		if (items && items.length > 0)
			return items.length > 1 ? items : items[0];
		return null;
	};

	_Renderer.deleteAt = function (index) {
		index = Utils.getIndexValue(index);
		let datas = Utils.toArray(this.options.data);
		if (index >= 0 && index < datas.length)
			return datas.splice(index, 1)[0];
		return null;
	};

	// ====================================================
	_Renderer.getColumns = function () {
		if (this._isRenderAsApp())
			return 1;
		return parseInt(this.options.columns) || 1;
	};

	_Renderer.getLabelWidth = function () {
		if (!this.hasOwnProperty("labelWidth"))
			this.labelWidth = Utils.getFormatSize(this.options.labelWidth, this._isRenderAsRem());
		return this.labelWidth;
	};

	_Renderer.getLabelAlign = function () {
		if (!this.hasOwnProperty("labelAlign")) {
			let align = this.options.labelAlign;
			this.labelAlign = /^(left|right|center)$/.test(align) ? align : null;
		}
		return this.labelAlign;
	};

	_Renderer.getOrientation = function () {
		let orientation = this.options.orientation;
		if (VERTICAL == orientation || HORIZONTIAL == orientation)
			return orientation;
		return this._isRenderAsApp() ? VERTICAL : HORIZONTIAL;
	};

	// ====================================================
	const renderView = function ($, target) {
		renderItems.call(this, $, target, this.options.data);
		renderButtons.call(this, $, target, this.options.buttons);
	};

	const renderItems = function ($, target, datas) {
		let items = target.children(".items").empty();
		if (!items || items.length == 0)
			items = $("<div class='items'></div>").appendTo(target);
		let columns = this.getColumns();
		Utils.each(Utils.toArray(datas), (data) => {
			let item = $("<div class='form-item'></div>").appendTo(items);
			renderOneItem.call(this, $, target, item, data);

			let colspan = parseInt(data.colspan) || 1;
			item.attr("opt-col", colspan);
			if (columns > 1 && columns > colspan) {
				item.css("width", (colspan * 100 / columns).toFixed(6) + "%");
			}
		});
	};

	const renderOneItem = function ($, target, item, data) {
		if (Utils.isNotBlank(data.name))
			item.attr("name", data.name);

		if (Utils.isTrue(data.required))
			item.attr("opt-required", "1");

		let empty = Utils.trimToNull(data.emptyMsg || data.empty);
		if (empty)
			item.attr("opt-empty", empty);

		if (Utils.isNotNull(data.visible) && !Utils.isTrue(data.visible))
			item.attr("opt-hide", "1");

		let itemContent = $("<dl class='content'></dl>").appendTo(item);

		let label = $("<dt></dt>").appendTo(itemContent);
		label.text(Utils.trimToEmpty(data.label));
		let labelWidth = this.getLabelWidth();
		if (labelWidth)
			label.css("width", labelWidth);

		let container = $("<dd></dd>").appendTo(itemContent);
		container = $("<div></div>").appendTo(container);
		if (data.top || data.top === 0)
			container.css("paddingTop", "0px");

		let contentView = data.content;
		if (contentView) {
			if (Utils.isFunction(contentView.render)) {
				contentView.render(container);
			}
			else if (contentView.hasOwnProperty("$el")) {
				container.append(contentView.$el);
			}
			else {
				container.append(contentView);
			}
		}

		Fn.renderFunction.call(this, item, "validator", data.validator);
	};

	const renderButtons = function ($, target, datas) {
		target.children(".btnbar").remove();
		if (datas && datas.length > 0) {
			let btnbar = $("<div class='btnbar'></div>").appendTo(target);

			let labelWidth = this.getLabelWidth();
			if (labelWidth && !this._isRenderAsApp())
				btnbar.css("paddingLeft", labelWidth);

			Utils.each(datas, (data) => {
				let button = $("<div></div>").appendTo(btnbar);
				if (data.type == "submit")
					button.addClass("is-submit");
				if (!frontend) {
					let UIButton = require("../button/index");
					new UIButton(this.context, data).render(button);
				}
				else {
					new UI.button(Utils.extend({}, data, {target: button}));
				}
			})
		}
	};
	
	///////////////////////////////////////////////////////
	const validateItem = function (item, contentView, callback) {
		// console.log("validateItem")
		if (item.attr("opt-hide") == 1)
			return Utils.isFunction(callback) ? callback(false) : null;

		if (!contentView)
			contentView = item.children(".content").children("dd").children().children();
		if (contentView.is("input, textarea")) {
			validateInput.call(this, item, contentView, callback);
		}
		else {
			contentView = VRender.Component.get(contentView) || VRender.FrontComponent.get(contentView) || contentView;
			if (contentView instanceof UI.input) {
				validateTextView.call(this, item, contentView, callback);
			}
			else if (contentView instanceof UI.dateinput) {
				validateDateInputView.call(this, item, contentView, callback);
			}
			else if (contentView instanceof UI.datetime) {
				validateDateTimeView.call(this, item, contentView, callback);
			}
			else if (contentView instanceof UI.daterange) {
				validateDateRangeView.call(this, item, contentView, callback);
			}
			else if (contentView instanceof UI.select) {
				validateComboboxView.call(this, item, contentView, callback);
			}
			else if (contentView instanceof UI._select) {
				validateSelectionView.call(this, item, contentView, callback);
			}
			else if (Utils.isFunction(contentView.validate)) {
				validateViewValidator.call(this, item, contentView, callback);
			}
			else if (Utils.isFunction(contentView.getValue)) {
				validateInterfaceView.call(this, item, contentView, contentView.getValue(), callback);
			}
			else if (Utils.isFunction(contentView.val)) {
				validateInterfaceView.call(this, item, contentView, contentView.val(), callback);
			}
			else if (Utils.isFunction(callback)) {
				callback(false);
			}
		}
	};

	const validateInput = function (item, input, callback) {
		// console.log("validateInput");
		doItemValidate.call(this, item, input.val(), callback);
	};

	const validateInterfaceView = function (item, view, value, callback) {
		// console.log("validateInterfaceView");
		doItemValidate.call(this, item, value, callback);
	};

	const validateViewValidator = function (item, view, callback) {
		if (!callback)
			callback = () => {};
		let timeId = setTimeout(() => {
			timeId = 0;
			callback("组件 validate() 方法调用时间超长，请检测 validate((err) => {}) 方法使用是否正确！！");
		}, 5000);
		let formItem = {
			name: item.attr("name"),
			label: item.children(".content").children("dt").text()
		};
		let result = view.validate(this, formItem, (err) => {
			if (timeId) {
				clearTimeout(timeId);
				timeId = 0;
				callback(err);
			}
		});
		if (typeof result != "undefined") {
			clearTimeout(timeId);
			timeId = 0;
			if (result === true)
				callback();
			else 
				callback(result || "表单错误！");
		}
	};

	const validateTextView = function (item, view, callback) {
		// console.log("validateTextView")
		view.validate((errmsg) => {
			if (view.hasError()) {
				item.addClass("is-error");
				item.children(".errmsg").remove();
				if (Utils.isFunction(callback))
					callback(errmsg);
			}
			else {
				item.removeClass("is-error");
				doItemValidate.call(this, item, view.val(), callback);
			}
		});
	};

	const validateSelectionView = function (item, view, callback) {
		// console.log("validateSelectionView")
		doItemValidate.call(this, item, view.getSelectedKey(), callback);
	};

	const validateComboboxView = function (item, view, callback) {
		// console.log("validateComboboxView")
		if (view.isEditable()) {
			doItemValidate.call(this, item, view.val(), callback);
		}
		else {
			doItemValidate.call(this, item, view.getSelectedKey(), callback);
		}
	};

	const validateDateInputView = function (item, view, callback) {
		// console.log("validateDateInputView")
		doItemValidate.call(this, item, view.getDate(), callback);
	};

	const validateDateTimeView = function (item, view, callback) {
		// console.log("validateDateTimeView");
		doItemValidate.call(this, item, view.getDate(), callback);
	};

	const validateDateRangeView = function (item, view, callback) {
		// console.log("validateDateRangeView");
		doItemValidate.call(this, item, view.getDateRange(), callback);
	};

	const doItemValidate = function (item, value, callback) {
		// console.log("doItemValidate");
		if (Utils.isBlank(value)) {
			let error = item.attr("opt-required") == 1 ? (item.attr("opt-empty") || "不能为空") : null;
			if (error) {
				setItemErrorMsg.call(this, item, error, callback);
				return ;
			}
		}
		let validate = getItemValidate.call(this, item);
		if (Utils.isFunction(validate)) {
			validate.call(this, value, (err) => {
				let error = !err ? false : (err === true ? "内容不正确" : Utils.trimToNull(err));
				setItemErrorMsg.call(this, item, error, callback);
			});
		}
		else {
			setItemErrorMsg.call(this, item, false, callback);
		}
	};

	const getItemValidate = function (item) {
		let validateFunction = item.data("validator");
		if (!validateFunction) {
			let target = item.children(".ui-fn[name='validator']");
			if (target && target.length > 0) {
				let func = target.text();
				if (Utils.isNotBlank(func)) {
					validateFunction = (new Function("var Utils=VRender.Utils;return (" + unescape(func) + ");"))();
				}
				target.remove();
			}
			if (!validateFunction)
				validateFunction = "1"; // 无效的方法
			item.data("validator", validateFunction);
		}
		return validateFunction;
	};
	
	// ====================================================
	const setItemErrorMsg = function (item, errmsg, callback) {
		if (errmsg) {
			showErrorMsg.call(this, item, errmsg);
		}
		else {
			hideErrorMsg.call(this, item);
		}
		if (Utils.isFunction(callback)) {
			callback(errmsg);
		}
	};

	const showErrorMsg = function (item, errmsg) {
		item.addClass("is-error");

		let target = item.children(".errmsg");
		if (!target || target.length == 0) {
			target = $("<div class='errmsg'></div>").appendTo(item);
		}
		target.html(errmsg);

		target.removeClass("animate-in").removeClass("animate-out");

		setTimeout(() => {
			target.addClass("animate-in");
		});

		if (!this._isRenderAsApp()) {
			startErrorFadeout.call(this, item);
		}
	};

	// 不再是错误的了
	const hideErrorMsg = function (item) {
		stopErrorFadeout.call(this, item);
		if (item.is(".is-error")) {
			let target = item.children(".errmsg");
			target.addClass("animate-out");
			setTimeout(() => {
				item.removeClass("is-error");
				target.removeClass("animate-in").removeClass("animate-out");
			}, 300);
		}
	};

	const startErrorFadeout = function (item) {
		stopErrorFadeout.call(this, item);
		let hideTimerId = setTimeout(() => {
			item.removeAttr("t-err");
			item.children(".errmsg").addClass("animate-out");
		}, 3000);
		item.attr("t-err", hideTimerId);
	};

	const stopErrorFadeout = function (item) {
		let hideTimerId = parseInt(item.attr("t-err"));
		if (hideTimerId) {
			clearTimeout(hideTimerId);
			item.removeAttr("t-err");
		}
	};

	// ====================================================
	const doSubmit = function (action, callback) {
		let params = this.getFormData();
		let method = this.getMethod();
		doSubmitBefore.call(this, params, (error) => {
			if (!error) {
				if (/post|put|delete/.test(method)) {
					VRender.send(action, params, (err, ret) => {
						callback(err, ret, params);
					}, true);
				}
				else {
					VRender.fetch(action, params, (err, ret) => {
						callback(err, ret, params);
					}, true);
				}
			}
			else {
				callback(error, null, params);
			}
		});
	};

	const doSubmitBefore = function (params, callback) {
		let event = {type: "action_before"};
		// event.preventDefault = () => {
		// 	event.isPreventDefault = true;
		// };
		this.trigger(event, params);
		if (event.isPreventDefault) {
			callback("canceled");
		}
		else {
			callback();
		}
	};
	

	///////////////////////////////////////////////////////
	const FormItem_bankend = function (data) {
		this.data = data;
	};
	const _FormItem_bankend = FormItem_bankend.prototype = new Object();

	_FormItem_bankend.name = function (value) {
		if (Utils.isNull(value))
			return this.data.name;
		this.data.name = value;
		return this;
	};

	_FormItem_bankend.label = function (value) {
		if (Utils.isNull(value))
			return this.data.label;
		this.data.label = value;
		return this;
	};

	_FormItem_bankend.content = function (value) {
		if (typeof value == "undefined")
			return this.data.content;
		this.data.content = value;
		return this;
	};

	_FormItem_bankend.required = function (value) {
		this.data.required = Utils.isNull(value) ? true : Utils.isTrue(value);
		return this;
	};

	_FormItem_bankend.isRequired = function () {
		return Utils.isTrue(this.data.required);
	};

	_FormItem_bankend.visible = function (value) {
		this.data.visible = Utils.isNull(value) ? true : Utils.isTrue(value);
		return this;
	};

	_FormItem_bankend.isVisible = function () {
		return Utils.isTrue(this.data.visible);
	};

	_FormItem_bankend.show = function () {
		this.data.visible = true;
		return this;
	};

	_FormItem_bankend.hide = function () {
		this.data.visible = false;
		return this;
	};

	_FormItem_bankend.emptyMsg = function (value) {
		if (Utils.isNull(value))
			return this.data.emptyMsg;
		this.data.emptyMsg = value;
		return this;
	};

	_FormItem_bankend.validator = function (value) {
		if (typeof value == "undefined")
			return this.data.validator;
		this.data.validator = value;
		return this;
	};

	_FormItem_bankend.colspan = function (value) {
		if (Utils.isNull(value))
			return this.data.colspan;
		this.data.colspan = value;
		return this;
	};

	_FormItem_bankend.top = function (value) {
		this.data.top = Utils.isNull(value) ? true : Utils.isTrue(value);
		return this;
	};

	// ====================================================
	const FormItem_frontend = function (form, item) {
		this.form = form;
		this.item = item;
	};
	const _FormItem_frontend = FormItem_frontend.prototype = new Object();

	_FormItem_frontend.name = function (value) {
		if (Utils.isNull(value))
			return this.item.attr("name");
		this.item.attr("name", Utils.trimToEmpty(value));
		return this;
	};

	_FormItem_frontend.label = function (value) {
		let target = this.item.children(".content").children("dt");
		if (Utils.isNull(value))
			return target.text() || "";
		target.text(Utils.trimToEmpty(value));
		return this;
	};

	_FormItem_frontend.container = function () {
		return this.item.children(".content").children("dd").children("div");
	};

	_FormItem_frontend.content = function (value) {
		let container = this.container();
		if (typeof value == "undefined") {
			let content = container.children();
			return content && content.length > 0 ? content : null;
		}
		container.empty();
		if (value) {
			if (Utils.isFunction(value.render))
				value.render(container);
			else 
				container.append(value.$el || value);
		}
		return this;
	};

	_FormItem_frontend.getContentView = function () {
		let content = this.content();
		let comp = VRender.FrontComponent && VRender.FrontComponent.get(content);
		return comp || VRender.Component.get(content) || content;
	};

	_FormItem_frontend.required = function (value) {
		if (Utils.isNull(value) || Utils.isTrue(value))
			this.item.attr("opt-required", "1");
		else
			this.item.removeAttr("opt-required");
		return this;
	};

	_FormItem_frontend.isRequired = function () {
		return this.item.attr("opt-required") == 1;
	};

	_FormItem_frontend.visible = function (value) {
		if (Utils.isNull(value) || Utils.isTrue(value))
			this.item.removeAttr("opt-hide");
		else 
			this.item.attr("opt-hide", "1");
		return this;
	};

	_FormItem_frontend.isVisible = function () {
		return this.item.attr("opt-hide") == 1;
	};

	_FormItem_frontend.show = function () {
		return this.visible(true);
	};

	_FormItem_frontend.hide = function () {
		return this.visible(false);
	};

	_FormItem_frontend.emptyMsg = function (value) {
		if (Utils.isNull(value))
			return this.item.attr("opt-empty");
		this.item.attr("opt-empty", Utils.trimToEmpty(value));
		return this;
	};

	_FormItem_frontend.validator = function (value) {
		if (typeof value == "undefined") {
			let validator = getItemValidate.call(this.form, this.item);
			return Utils.isFunction(validator) ? validator : null;
		}

		this.item.data("validator", (Utils.isFunction(value) ? value: "1"));
		this.item.children(".ui-fn[name=validator]").remove();

		return this;
	};

	_FormItem_frontend.colspan = function (value) {
		if (Utils.isNull(value))
			return Math.max((parseInt(this.item.attr("opt-col")) || 0), 1);

		let colspan = Math.max((parseInt(value) || 0), 1);
		this.item.attr("opt-col", colspan);

		let columns = this.form.getColumns();
		if (columns > 1 && columns > colspan)
			this.item.css("width", (colspan * 100 / columns).toFixed(6) + "%");
		else
			this.item.css("width", "");

		return this;
	};

	_FormItem_frontend.top = function (value) {
		let container = this.container();
		if (Utils.isNull(value) || Utils.isTrue(value))
			container.css("paddingTop", "0px");
		else
			container.css("paddingTop", ""); // 使用默认样式
		return this;
	};


	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIForm = UIForm;
		UI.init(".ui-form", UIForm, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");