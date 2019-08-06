// 2019-06-06
// input(原textview)

(function (frontend) {
	if (frontend && VRender.Component.ui.input)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UIInput = UI.input = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIInput = UIInput.prototype = new UI._base(false);

	_UIInput.init = function (target, options) {
		UI._base.init.call(this, target, options);

		this.inputTag = this.$el.children(".ipt");
		this.input = this.inputTag.find("input, textarea");

		this.input.on("focusin", onFocusInHandler.bind(this));
		this.input.on("focusout", onFocusOutHandler.bind(this));
		this.input.on("keydown", onKeyDownHandler.bind(this));
		this.input.on("keyup", onKeyUpHandler.bind(this));
		this.input.on("change", function (e) { return false; });
		this.$el.on("tap", ".clear", clearBtnClickHandler.bind(this));

		if (!this._isRenderAsApp()) {
			this.inputTag.on("mouseenter", onMouseEnterHandler.bind(this));
			this.inputTag.on("mouseleave", onMouseLeaveHandler.bind(this));
		}

		if (this.$el.attr("opt-pwd") == 1)
			this.setDisplayAsPassword(true);
		if (this.isAutoHeight()) {
			tryAutoSize.call(this, this.getValue());
		}
	};

	// ====================================================
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
		let value = this.getValue();
		if (value.length == 0) {
			if (this.isRequired())
				setErrorMsg.call(this, (this.getEmptyMsg() || "输入框不能为空"));
			else 
				clearErrorMsg.call(this);
			if (Utils.isFunction(callback)) {
				callback(this.lastErrorMsg);
			}
		}
		else {
			doValidate.call(this, value, () => {
				if (Utils.isFunction(callback)) {
					callback(this.lastErrorMsg);
				}
			});
		}
	};

	// ====================================================
	_UIInput.getValue = function () {
		return this.input.val() || "";
	};
	_UIInput.setValue = function (value) {
		value = Utils.trimToEmpty(value);
		this.input.val(value);
		clearErrorMsg.call(this);
		valueChanged.call(this, value);
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
		if (/^(number|num|int)$/.test(value))
			value = "_number";
		this.$el.attr("opt-type", value);
		if (/^(email|password|tel|url|number)$/.test(value))
			this.input.attr("type", value);
		else
			this.input.removeAttr("type");
	};

	_UIInput.isReadonly = function () {
		return this.$el.attr("opt-readonly") == 1;
	};
	_UIInput.setReadonly = function (value) {
		if (Utils.isNull(value) || Utils.isTrue(value)) {
			this.$el.attr("opt-readonly", "1");
			this.input.attr("readonly", "readonly");
		}
		else {
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
		}
		else {
			this.$el.removeAttr("opt-required");
		}
	};

	_UIInput.getEmptyMsg = function () {
		return this.$el.attr("opt-empty");
	};
	_UIInput.setEmptyMsg = function (value) {
		if (Utils.isBlank(value))
			this.$el.removeAttr("opt-empty");
		else
			this.$el.attr("opt-empty", value);
	};

	_UIInput.getErrorMsg = function () {
		return this.$el.attr("opt-errmsg");
	};
	_UIInput.setErrorMsg = function (value) {
		if (Utils.isBlank(value))
			this.$el.removeAttr("opt-errmsg");
		else
			this.$el.attr("opt-errmsg", value);
	};

	_UIInput.getMaxSize = function () {
		if (this.hasOwnProperty("maxSize"))
			return this.maxSize;
		this.maxSize = parseInt(this.$el.attr("opt-size")) || 0;
		return this.maxSize;
	};
	_UIInput.setMaxSize = function (value) {
		this.maxSize = parseInt(value) || 0;
		this.$el.attr("opt-size", this.maxSize);
		if (this.maxSize > 0) {
			this.$el.addClass("show-size");
			this.inputTag.find(".size").remove();
			let text = this.getValue() || "";
			$("<span class='size'></span>").appendTo(this.inputTag).text(text.length + "/" + this.maxSize);
		}
		else {
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
		if (errmsg)
			setErrorMsg.call(this, errmsg);
		else
			clearErrorMsg.call(this);
	};

	_UIInput.getDecimals = function () {
		let decimals = parseFloat(this.$el.attr("opt-decimal"));
		return (isNaN(decimals) || decimals < 0) ? -1 : decimals;
	};
	_UIInput.setDecimals = function (value) {
		if (isNaN(value))
			value = 2;
		else
			value = parseInt(value) || 0;
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
		let style = window.getComputedStyle(this.input[0]);
		if (Utils.isNull(value) || Utils.isTrue(value)) {
			this.$el.attr("opt-pwd", "1");
			if (!style.webkitTextSecurity)
				this.input.attr("type", "password");
		}
		else {
			this.$el.removeAttr("opt-pwd");
			if (this.input.attr("type") == "password")
				this.input.attr("type", "text");
		}
	};

	// ====================================================
	const onKeyDownHandler = function (e) {
		clearErrorMsg.call(this);
		if (Utils.isControlKey(e))
			return true;
		let text = this.input.val() || "";
		let type = this.getDataType();
		if (type == "_number" || type == "number" || type == "num") {
			if (!isNumberKeyEnable(e, text))
				return false;
			if (e.key == "." && this.getDecimals() == 0)
				return false;
		}
		else if (type == "tel" || type == "mobile" || type == "phone") {
			if (!/[0-9]|\-/.test(e.key))
				return false;
			if (e.key == "-" && type == "mobile")
				return false;
		}
		else if (type == "text") {
			let maxSize = this.getMaxSize();
			if (maxSize > 0 && text.length >= maxSize)
				return false;
		}
		valueChanged.call(this, text + "."); // 加一个字符，保证隐藏提示信息
	};

	const onKeyUpHandler = function (e) {
		let value = this.input.val() || "", text = value;
		if (e.which === 13) {
			if (text.length === 0) {
				if (this.isRequired())
					setErrorMsg.call(this, (this.getEmptyMsg() || "输入框不能为空"));
			}
			else {
				doValidate.call(this, text);
			}
			this.trigger("enter", text);
			this.$el.trigger("enter", text);
		}
		else {
			let type = this.getDataType();
			if (type == "_number" || type == "number" || type == "num")
				text = value.replace(/[^0-9\.\-]/g, "");
			else if (type == "tel" || type == "mobile" || type == "phone")
				text = value.replace(/[^0-9\-]/g, "");
			if (text != value)
				this.input.val(text);
			valueChanged.call(this, text);
		}
	};

	const onFocusInHandler = function (e) {
		this.$el.addClass("focus");
		let lastValue = this.input.val();
		this.t_focus = setInterval(() => {
			let value = this.input.val();
			if (value != lastValue) {
				lastValue = value;
				valueChanged.call(this, value);
				this.trigger("change", value);
				this.$el.trigger("change", value);
			}
		}, 100);
	};

	const onFocusOutHandler = function (e) {
		this.$el.removeClass("focus");
		let text = this.input.val() || "";
		if (text.length === 0) {
			if (this.isRequired())
				setErrorMsg.call(this, (this.getEmptyMsg() || "输入框不能为空"));
		}
		else {
			doValidate.call(this, text);
		}
		if (this.t_focus) {
			let timer = this.t_focus;
			this.t_focus = null;
			setTimeout(() => {
				clearInterval(timer);
			}, 100);
		}
	};

	const onMouseEnterHandler = function (e) {
		if (this.hasError()) {
			if (this.t_hideerror) {
				clearTimeout(this.t_hideerror);
				this.t_hideerror = null;
			}
			this.$el.find(".errmsg").removeClass("animate-out");
		}
	};

	const onMouseLeaveHandler = function (e) {
		if (this.hasError()) {
			if (!this.t_hideerror) {
				this.t_hideerror = setTimeout(() => {
					this.t_hideerror = null;
					this.$el.find(".errmsg").addClass("animate-out");
				}, 3000);
			}
		}
	};

	const clearBtnClickHandler = function (e) {
		this.val("");
		this.trigger("change", "");
		this.$el.trigger("change", "");
		this.trigger("clear");
		this.$el.trigger("clear");
		setTimeout(() => {
			this.input.focus();
		});
	};
	
	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-input");

		let options = this.options || {};

		let ipt = $("<div class='ipt'></div>").appendTo(target);
		let input = renderInput.call(this, $, target, ipt);

		let width = Utils.getFormatSize(options.width, this._isRenderAsRem());
		if (width)
			target.attr("opt-fixed", "1").css("width", width);

		if (Utils.isTrue(options.readonly)) {
			target.attr("opt-readonly", "1");
			input.attr("readonly", "readonly");
		}

		if (Utils.isTrue(options.required))
			target.attr("opt-required", "1");

		if (this.isDisplayAsPassword())
			target.attr("opt-pwd", "1");

		let maxSize = parseInt(options.maxSize) || 0;
		if (maxSize > 0) {
			target.addClass("show-size").attr("opt-size", maxSize);
			let len = Utils.trimToEmpty(input.val()).length;
			$("<span class='size'></span>").appendTo(ipt).text(len + "/" + maxSize);
		}

		if (Utils.isNotBlank(options.prompt))
			$("<span class='prompt'></span>").appendTo(ipt).text(options.prompt);
		else if (Utils.isNotBlank(options.placeholder))
			$("<span class='prompt'></span>").appendTo(ipt).text(options.placeholder);

		if (Utils.isNotBlank(options.tips))
			$("<span class='tips'></span>").appendTo(ipt).html(options.tips);

		let description = options.description || options.desc;
		if (Utils.isNotBlank(description))
			$("<div class='desc'></div>").appendTo(target).html(description);
		
		renderErrorMsg.call(this, $, target);

		if (Utils.isTrue(options.autoHeight) && this.isMultiline())
			renderAsAutoHeight.call(this, $, target, input);

		return this;
	};

	// ====================================================
	_Renderer.getDecimals = function () {
		if (this.isDisplayAsPassword())
			return 0;
		let options = this.options || {};
		let type = options.dataType || options.type;
		if (type === "int")
			return 0;
		if (options.hasOwnProperty("decimals"))
			return parseInt(options.decimals) || 0;
		return 2;
	};

	_Renderer.isDisplayAsPassword = function () {
		return Utils.isTrue(this.options.displayAsPwd);
	}

	_Renderer.isMultiline = function () {
		let options = this.options || {};
		if (options.hasOwnProperty("multiple"))
			return Utils.isTrue(options.multiple);
		return Utils.isTrue(options.multi);
	};

	// ====================================================
	const renderInput = function ($, target, parent) {
		let options = this.options || {};
		let multiple = this.isMultiline();
		let input = multiple ? "<textarea></textarea>" : "<input type='text'/>";
		input = $(input).appendTo(parent);

		if (multiple)
			target.addClass("multi");
		else
			parent.append("<span class='clear'></span>");

		let iptValue = options.value;
		let type = options.dataType || options.type;
		if (Utils.isNotBlank(type)) {
			if (/^(number|num|int)$/.test(type))
				type = "_number";
			if (/^(email|password|tel|url|number)$/.test(type))
				input.attr("type", type); // 标准类型添加“type”属性
			target.attr("opt-type", type);
			if (type == "_number") {
				let decimals = this.getDecimals(); // 保留小数点，只有数字类型有效
				target.attr("opt-decimal", decimals);
				let minValue = parseFloat(options.min);
				let maxValue = parseFloat(options.max);
				if (!isNaN(minValue))
					target.attr("opt-min", minValue);
				if (!isNaN(maxValue))
					target.attr("opt-max", maxValue);
				if (Utils.isNotBlank(iptValue)) {
					iptValue = parseFloat(iptValue);
					if (isNaN(iptValue)) {
						iptValue = "";
					}
					else {
						if (!isNaN(minValue) && iptValue < minValue)
							iptValue = minValue;
						if (!isNaN(maxValue) && iptValue > maxValue)
							iptValue = maxValue;
						iptValue = iptValue.toFixed(decimals);
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

	const renderErrorMsg = function ($, target) {
		if (Utils.isNotBlank(this.options.empty))
			target.attr("opt-empty", this.options.empty);

		if (Utils.isNotBlank(this.options.errmsg))
			target.attr("opt-errmsg", this.options.errmsg);

		Fn.renderFunction(target, "validate", this.options.validate);
	};

	const renderAsAutoHeight = function ($, target, input) {
		target.attr("opt-autoheight", "1");

		target = target.children(".ipt");
		target.append("<div class='preview'><pre></pre></div>");
		target.find("pre").text(input.val());

		let options = this.options || {};
		let renderAsRem = this._isRenderAsRem();
		let minHeight = Utils.getFormatSize(options.minHeight, renderAsRem);
		let maxHeight = Utils.getFormatSize(options.maxHeight, renderAsRem);

		if (minHeight) {
			input.css("minHeight", minHeight);
		}
		if (maxHeight) {
			input.css("maxHeight", maxHeight);
		}
	};

	///////////////////////////////////////////////////////
	const doValidate = function (value, callback) {
		let validateHandler = this.getValidate();
		let defaultErrorMsg = this.getErrorMsg();
		if (Utils.isFunction(validateHandler)) {
			let validateResult = (_result) => {
				if (_result === true)
					setErrorMsg.call(this, (defaultErrorMsg || "内容不正确！"));
				else if (_result === false)
					clearErrorMsg.call(this);
				else if (_result)
					setErrorMsg.call(this, _result);
				else
					clearErrorMsg.call(this);
				if (Utils.isFunction(callback)) {
					setTimeout(callback, 0);
				}
			};
			let result = validateHandler(this, value, validateResult);
			if (Utils.isNotNull(result))
				validateResult(result);
		}
		else {
			let type = this.getDataType();
			if (type == "_number" || type == "number" || type == "num") {
				if (isNaN(value)) {
					setErrorMsg.call(this, (defaultErrorMsg || "数据格式不正确"));
				}
				else {
					let val = parseFloat(value);
					let min = parseFloat(this.$el.attr("opt-min"));
					if (!isNaN(min) && min > val)
						setErrorMsg.call(this, (defaultErrorMsg || ("数据不正确，请输入大于等于" + min + "的值")));
					let max = parseFloat(this.$el.attr("opt-max"));
					if (!isNaN(max) && max < val)
						setErrorMsg.call(this, (defaultErrorMsg || ("数据不正确，请输入小于等于" + max + "的值")));
					let decimals = this.getDecimals();
					if (decimals > 0)
						this.input.val(val.toFixed(decimals));
				}
			}
			else if (type == "tel") {
				if (!Utils.isMobile(value) || !Utils.isPhone(value))
					setErrorMsg.call(this, (defaultErrorMsg || "手机或电话号码不正确"));
			}
			else if (type == "text") {
				let maxSize = this.getMaxSize();
				if (maxSize > 0 && maxSize < value.length)
					setErrorMsg.call(this, (defaultErrorMsg || ("输入内容太长，允许最大长度为：" + maxSize)));
			}
			else if (type == "email") {
				if (!Utils.isEmail(value))
					setErrorMsg.call(this, (defaultErrorMsg || "电子邮箱格式不正确，请重新输入"));
			}
			else if (type == "mobile") {
				if (!Utils.isMobile(value))
					setErrorMsg.call(this, (defaultErrorMsg || "手机号码不正确，必须是1开头的11位数字"));
			}
			else if (type == "phone") {
				if (!Utils.isPhone(value))
					setErrorMsg.call(this, (defaultErrorMsg || "电话号码不正确"));
			}
			else if (type == "url") {
				if (!Utils.isUrl(value))
					setErrorMsg.call(this, (defaultErrorMsg || "url格式不正确"));
			}
			if (Utils.isFunction(callback)) {
				setTimeout(callback, 0);
			}
		}
	};

	const valueChanged = function (text) {
		if (text && text.length > 0)
			this.$el.addClass("has-val");
		else
			this.$el.removeClass("has-val");
		if (this.$el.is(".show-size")) {
			let maxSize = this.getMaxSize();
			if (maxSize > 0)
				this.inputTag.find(".size").text(text.length + "/" + maxSize);
		}
		tryAutoSize.call(this, text);
	};

	const tryAutoSize = function (text) {
		if (this.isAutoHeight()) {
			let preview = this.inputTag.find(".preview pre");
			if (preview && preview.length > 0) {
				text = (text || "").replace(/\n$/, "\n.");
				preview.text(text);
			}
			let input = this.input.get(0);
			let minHeight = Utils.toPx(this._isRenderAsRem() ? "0.32rem" : "32px");
			let setInner = () => {
				let height = preview[0].scrollHeight;
				height = Math.max(height, minHeight) + 2;
				input.style.height = height + "px";
			};
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(setInner);
			}
			else {
				setTimeout(setInner, 0);
			}
		}
	};

	const setErrorMsg = function (errmsg) {
		this.lastErrorMsg = errmsg;
		let target = this.$el.find(".errmsg");
		if (!target || target.length == 0) {
			target = $("<div class='errmsg'></div>").appendTo(this.$el);
			target.insertAfter(this.inputTag);
			if (!this._isRenderAsApp())
				target.css("top", (this.inputTag.height() + 8));
		}

		target.html(errmsg);
		this.$el.addClass("is-error");
		target.removeClass("animate-in").removeClass("animate-out");

		setTimeout(function () {
			target.addClass("animate-in");
		}, 0);

		// 3秒后隐藏
		if (!this._isRenderAsApp()) {
			if (this.t_hideerror) {
				clearTimeout(this.t_hideerror);
			}
			this.t_hideerror = setTimeout(() => {
				this.t_hideerror = null;
				target.addClass("animate-out");
			}, 3000);
		}
	};

	const clearErrorMsg = function () {
		this.lastErrorMsg = null;
		if (this.hasError()) {
			let target = this.$el.find(".errmsg").addClass("animate-out");
			setTimeout(() => {
				this.$el.removeClass("is-error");
				target.removeClass("animate-in").removeClass("animate-out");
			}, 300);
		}
	};

	const isNumberKeyEnable = function (e, text) {
		if (/[0-9]/.test(e.key))
			return true;
		if (e.key == "-")
			return !/\-/.test(text) && text.length == 0;
		if (e.key == ".")
			return !/\./.test(text) && text.length > 0;
		return false;
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIInput = UIInput;
		UI.init(".ui-input", UIInput, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");