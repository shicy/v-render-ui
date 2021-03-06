// 2019-05-29
// checkbox

(function (frontend) {
	if (frontend && VRender.Component.ui.checkbox)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UICheckbox = UI.checkbox = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UICheckbox = UICheckbox.prototype = new UI._base(false);

	UICheckbox.create = function (options) {
		options = options || {};
		options.tagName = "label";
		return VRender.Component.create(options, UICheckbox, Renderer);
	};

	_UICheckbox.init = function (target, options) {
		UI._base.init.call(this, target, options);

		this.input = this.$el.children("input");

		this.input.on("change", chkboxChangeHandler.bind(this));
	};

	// ====================================================
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
		let checked = Utils.isNull(bool) ? true : Utils.isTrue(bool);
		this.input[0].checked = checked;
		this.input.trigger("change");
	};
	_UICheckbox.setCheckedSilent = function (bool) {
		let checked = Utils.isNull(bool) ? true : Utils.isTrue(bool);
		this.input[0].checked = checked;
		if (checked) {
			this.$el.addClass("checked");
		}
		else {
			this.$el.removeClass("checked");
		}
	};

	_UICheckbox.getLabel = function () {
		return this.$el.children("span").text();
	};
	_UICheckbox.setLabel = function (value) {
		this.$el.children("span").remove();
		if (Utils.isNotBlank(value))
			$("<span></span>").appendTo(this.$el).text(value);
	};

	_UICheckbox.isReadonly = function () {
		return this.$el.attr("opt-readonly") == 1;
	};
	_UICheckbox.setReadonly = function (value) {
		if (Utils.isNull(value) || Utils.isTrue(value)) {
			this.$el.attr("opt-readonly", "1");
			this.input.attr("disabled", "disabled");
		}
		else {
			this.$el.removeAttr("opt-readonly");
			this.input.removeAttr("disabled");
		}
	};

	// ====================================================
	// 复选框状态变更事件
	const chkboxChangeHandler = function (e) {
		let checked = $(e.currentTarget).is(":checked");
		if (checked)
			this.$el.addClass("checked");
		else
			this.$el.removeClass("checked");
		this.trigger("change", checked);
	};

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-chkbox");

		let options = this.options || {};

		let input = $("<input type='checkbox'/>").appendTo(target);

		if (Utils.isNotNull(options.value))
			input.val(options.value);

		if (Utils.isTrue(options.checked)) {
			target.addClass("checked");
			input.attr("checked", "checked");
		}

		if (Utils.isTrue(options.readonly)) {
			target.attr("opt-readonly", "1");
			input.attr("disabled", "disabled");
		}

		if (Utils.isNotNull(options.label))
			$("<span></span>").appendTo(target).text(options.label);

		input.attr("name", Utils.trimToNull(options.name));

		return this;
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UICheckbox = UICheckbox;
		UI.init(".ui-chkbox", UICheckbox, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");