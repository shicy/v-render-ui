// 2019-06-10
// radiogroup

(function (frontend) {
	if (frontend && VRender.Component.ui.radiogroup)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	let globleGroupID = Date.now();

	///////////////////////////////////////////////////////
	const UIRadioGroup = UI.checkgroup = function (view, options) {
		return UI._select.call(this, view, options);
	};
	const _UIRadioGroup = UIRadioGroup.prototype = new UI._select(false);

	_UIRadioGroup.init = function (target, options) {
		UI._select.init.call(this, target, options);
		this.$el.on("change", "input", selectedChangeHandler.bind(this));
	};

	// ====================================================
	_UIRadioGroup.setSelectedIndex = function (value) {
		let snapshoot = this._snapshoot();
		let items = this.$el.children();
		let index = Utils.getIndexValue(value);
		if (index >= 0) {
			VRender.Component.get(items.eq(index).children()).setChecked(true);
		}
		else {
			let selectedIndex = snapshoot.getState().selectedIndex;
			if (selectedIndex >= 0)
				VRender.Component.get(items.eq(selectedIndex).children()).setChecked(false);
		}
		snapshoot.done();
	};

	_UIRadioGroup.isMultiple = function () {
		return false;
	};

	_UIRadioGroup.isDisabled = function (value) {
		if (typeof value == "number") {
			let radbox = VRender.Component.get(this._getItemAt(value).children());
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
			let radbox = VRender.Component.get(this._getItemAt(value).children());
			radbox && radbox.setDisabled(disabled);
		}
		else {
			disabled = (Utils.isNull(disabled) || Utils.isTrue(disabled)) ? true : false;
			if (disabled)
				this.$el.addClass("disabled").attr("disabled", "disabled");
			else
				this.$el.removeClass("disabled").removeAttr("disabled");
		}
	};

	_UIRadioGroup.isReadonly = function (value) {
		if (typeof value == "number") {
			let radbox = VRender.Component.get(this._getItemAt(value).children());
			return radbox ? radbox.isReadonly() : false;
		}
		if (typeof value == "string") {
			return this.isReadonly(this.getIndexByName(value));
		}
		return this.$el.is(".readonly");
	};
	_UIRadioGroup.setReadonly = function (readonly, value) {
		if (typeof value == "string") {
			return this.setReadonly(readonly, this.getIndexByName(value));
		}
		if (typeof value == "number") {
			let radbox = VRender.Component.get(this._getItemAt(value).children());
			radbox && radbox.setReadonly(readonly);
		}
		else {
			readonly = Utils.isNull(readonly) || Utils.isTrue(readonly);
			Utils.each(this._getItems(), (item) => {
				let radbox = VRender.Component.get(item.children());
				radbox && radbox.setReadonly(readonly);
			});
			if (readonly)
				this.$el.addClass("readonly");
			else
				this.$el.removeClass("readonly");
		}
	};

	// ====================================================
	_UIRadioGroup._getRadioName = function () {
		return "rad-" + this.getViewId();
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
	};

	// ====================================================
	const selectedChangeHandler = function (e) {
		e.stopPropagation();
		let snapshoot = this._snapshoot();
		let index = Utils.index(this.$el.find("input"), (input) => {
			return input.is(":checked");
		});
		UI._select.setSelectedIndex.call(this, index);
		snapshoot.done();
	};

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._selectRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._selectRender(false);

	_Renderer.render = function ($, target) {
		this.radioGroupId = "rad-" + target.attr("vid");
		UI._selectRender.render.call(this, $, target);
		target.addClass("ui-radgrp");
		return this;
	};

	_Renderer.renderSelection = function ($, target) {
		let indexs = this.getSelectedIndex(true);
		if (indexs)
			target.attr("data-inds", indexs.join(","));

		let ids = this.getSelectedKey(true);
		if (ids)
			target.attr("data-ids", ids.join(","));
	};

	_Renderer.isMultiple = function () {
		return false;
	};

	// ====================================================
	_Renderer._getRadioName = function () {
		return this.radioGroupId;
	};

	_Renderer._renderItems = function ($, target) {
		let itemContainer = this._getItemContainer($, target);
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

	_Renderer._renderEmptyView = function () {
		// do nothing
	};

	_Renderer._renderLoadView = function () {
		// do nothing
	};

	// ====================================================
	const renderItems = function ($, itemContainer, datas) {
		this._cache_selected_indexs = this.getSelectedIndex(true);
		this._cache_selected_ids = this.getSelectedKey(true) || [];
		UI._itemsRender.renderItems.call(this, $, itemContainer, datas);
		delete this._cache_selected_indexs;
		delete this._cache_selected_ids;
	};

	const renderOneItem = function ($, item, data, index) {
		if (Utils.isPrimitive(data))
			data = {label: data};
		let params = Utils.extend({}, data);
		params.name = this._getRadioName();
		params.value = this._getDataKey(data);
		params.label = this._getDataLabel(data, index);
		params.checked = this._isSelected(data, index, this._cache_selected_indexs, this._cache_selected_ids);
		if (!frontend) {
			let UIRadiobox = require("../radiobox/index");
			return new UIRadiobox(this.context, params).render(item);
		}
		else {
			params.target = item;
			return UI.radiobox.create(params);
		}
	};

	///////////////////////////////////////////////////////
	const getNewItem = function ($, target) {
		return $("<div class='item'></div>").appendTo(target);
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIRadioGroup = UIRadioGroup;
		UI.init(".ui-radgrp", UIRadioGroup, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");