// 2019-06-06
// radiobox

(function (frontend) {
	if (frontend && VRender.Component.ui.radiobox)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Utils = UI.util;

	///////////////////////////////////////////////////////
	const UIRadiobox = UI.radiobox = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIRadiobox = UIRadiobox.prototype = new UI._base(false);

	UIRadiobox.create = function (options) {
		options = options || {};
		options.tagName = "label";
		return VRender.Component.create(options, UIRadiobox, Renderer);
	};

	_UIRadiobox.init = function (target, options) {
		UI._base.init.call(this, target, options);
		this.$el.removeAttr("name");

		this.input = this.$el.children("input");
		this.input.on("change", radboxChangeHandler.bind(this));

		if (this.input.is(":checked"))
			this.input.trigger("change");
	};

	// ====================================================
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
		let checked = Utils.isNull(bool) ? true : Utils.isTrue(bool);
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
		if (Utils.isNotBlank(value))
			$("<span></span>").appendTo(this.$el).text(value);
	};

	// ====================================================
	const radboxChangeHandler = function (e) {
		let _isChecked = this.isChecked();
		if (_isChecked) {
			this.input.parent().addClass("checked");
			let name = this.input.attr("name");
			if (Utils.isNotBlank(name)) {
				let radios = $("input[name='" + name + "']").not(this.input);
				radios.parent().removeClass("checked");
			}
		}
		else {
			this.$el.removeClass("checked");
		}
		this.trigger("change");
	};

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-radbox");

		let options = this.options || {};

		let input = $("<input type='radio'/>").appendTo(target);

		if (Utils.isNotNull(options.value))
			input.val(options.value);

		if (Utils.isTrue(options.checked)) {
			target.addClass("checked");
			input.attr("checked", "checked");
		}

		if (Utils.isNotNull(options.label))
			$("<span></span>").appendTo(target).text(options.label);

		input.attr("name", Utils.trimToNull(options.name));

		return this;
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIRadiobox = UIRadiobox;
		UI.init(".ui-radbox", UIRadiobox, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");