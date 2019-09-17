// 2019-06-10
// checkgroup

(function (frontend) {
	if (frontend && VRender.Component.ui.checkgroup)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UICheckGroup = UI.checkgroup = function (view, options) {
		return UI._select.call(this, view, options);
	};
	const _UICheckGroup = UICheckGroup.prototype = new UI._select(false);

	_UICheckGroup.init = function (target, options) {
		UI._select.init.call(this, target, options);
		this.$el.on("change", "input", selectedChangeHandler.bind(this));
	};

	// ====================================================
	_UICheckGroup.setSelectedIndex = function (value) {
		let snapshoot = this._snapshoot();
		let indexs = UI.fn.getIntValues(value, 0) || [];
		Utils.each(this.$el.children(), (item, i) => {
			let chkbox = VRender.Component.get(item.children());
			chkbox.setChecked(indexs.indexOf(i) >= 0);
		});
		snapshoot.done();
	};

	_UICheckGroup.isMultiple = function () {
		return true;
	};

	_UICheckGroup.isDisabled = function (value) {
		if (typeof value == "number") {
			let chkbox = VRender.Component.get(this._getItemAt(value).children());
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
			let chkbox = VRender.Component.get(this._getItemAt(value).children());
			chkbox && chkbox.setDisabled(disabled);
		}
		else {
			disabled = (Utils.isNull(disabled) || Utils.isTrue(disabled)) ? true : false;
			if (disabled)
				this.$el.addClass("disabled").attr("disabled", "disabled");
			else
				this.$el.removeClass("disabled").removeAttr("disabled");
		}
	};

	// ====================================================
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
	};

	// ====================================================
	const selectedChangeHandler = function (e) {
		e.stopPropagation();
		let snapshoot = this._snapshoot();
		let indexs = [];
		Utils.each(this.$el.find("input"), (input, i) => {
			if (input.is(":checked"))
				indexs.push(i);
		});
		UI._select.setSelectedIndex.call(this, indexs);
		snapshoot.done();
	};
	

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._selectRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._selectRender(false);

	_Renderer.render = function ($, target) {
		UI._selectRender.render.call(this, $, target);
		target.addClass("ui-chkgrp");
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

	// ====================================================
	_Renderer.isMultiple = function () {
		return true;
	};

	// ====================================================
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
		if (typeof data == "string")
			data = {label: data};
		let params = Utils.extend({}, data);
		params.value = this._getDataKey(data);
		params.label = this._getDataLabel(data, index);
		params.checked = this._isSelected(data, index, this._cache_selected_indexs, this._cache_selected_ids);
		if (!frontend) {
			let UICheckbox = require("../checkbox/index");
			return new UICheckbox(this.context, params).render(item);
		}
		else {
			params.target = item;
			return UI.checkbox.create(params);
		}
	};

	///////////////////////////////////////////////////////
	const getNewItem = function ($, target) {
		return $("<div class='item'></div>").appendTo(target);
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UICheckGroup = UICheckGroup;
		UI.init(".ui-chkgrp", UICheckGroup, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");