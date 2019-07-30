// 2019-07-29
// treeselect(原treecombobox)

(function (frontend) {
	if (frontend && VRender.Component.ui.treeselect)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UITreeSelect = UI.treeselect = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UITreeSelect = UITreeSelect.prototype = new UI._base(false);

	_UITreeSelect.init = function (target, options) {
		UI._base.init.call(this, target, options);

		this.tree = UI.tree.find(this.$el)[0];

		this.$el.on("tap", ".ipt", iptClickHandler.bind(this));
		this.$el.on("change", ".dropdown", function () { return false; });

		this.tree.on("change", treeChangeHandler.bind(this));
		this.tree.on("itemclick", treeItemClickHandler.bind(this));

		if (this._isRenderAsApp()) {
			this.$el.on("tap", ".dropdown", dropdownTouchHandler.bind(this));
		}

		var selectedIndex = this.getSelectedIndex();
		if (selectedIndex && selectedIndex.length > 0)
			itemChanged.call(this);
	};

	// ====================================================
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
		let target = this.$el.children(".ipt");
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
	};

	// ====================================================
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
	};

	// ====================================================
	_UITreeSelect.isMultiple = function () {
		return this.$el.attr("multiple") == "multiple";
	};

	_UITreeSelect.setMultiple = function (value) {
		value = (Utils.isNull(value) || Utils.isTrue(value)) ? true : false;
		if (this.isMultiple() != value) {
			if (value)
				this.$el.attr("multiple", "multiple");
			else
				this.$el.removeAttr("multiple");
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
	};
	
	// ====================================================
	const iptClickHandler = function (e) {
		showDropdown.call(this);
	};

	const dropdownTouchHandler = function (e) {
		if ($(e.target).is(".dropdown"))
			hideDropdown.call(this);
	};

	const treeChangeHandler = function (e) {
		itemChanged.call(this);
	};

	const treeItemClickHandler = function (e, data) {
		if (!this.isMultiple()) {
			itemChanged.call(this);
			if (data.leaf || !this._isRenderAsApp())
				hideDropdown.call(this);
		}
	};

	const comboMouseHandler = function (e) {
		Fn.mouseDebounce(e, hideDropdown.bind(this));
	};

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-treeselect");

		// 容器，用于下拉列表定位
		target.attr("opt-box", this.options.container);

		if (this.isMultiple())
			target.attr("multiple", "multiple");

		renderTextView.call(this, $, target);
		renderTreeView.call(this, $, target);
		
		return this;
	};

	_Renderer.renderData = function () {
		// do nothing
	};

	// ====================================================
	_Renderer.getDataAdapter = function () {
		return null;
	};

	_Renderer.getDataMapper = function () {
		return null;
	};

	_Renderer.isMultiple = function () {
		return Fn.isMultiple.call(this);
	};

	// ====================================================
	const renderTextView = function ($, target) {
		let ipttag = $("<div class='ipt'></div>").appendTo(target);

		let input = $("<input type='text'/>").appendTo(ipttag);
		input.attr("readonly", "readonly");

		ipttag.append("<button class='dropdownbtn'></button>");
		ipttag.append("<span class='prompt'>" + Utils.trimToEmpty(this.options.prompt) + "</span>");
	};

	const renderTreeView = function ($, target) {
		target = $("<div class='dropdown'></div>").appendTo(target);

		let treeOptions = getTreeOptions.call(this, this.options);
		if (!frontend) {
			let UITree = require("../tree/index");
			new UITree(this, treeOptions).render(target);
		}
		else {
			treeOptions.target = target;
			UI.tree.create(treeOptions);
		}
	};
	
	///////////////////////////////////////////////////////
	const isDropdownVisible = function () {
		return this.$el.is(".show-dropdown");
	};

	const showDropdown = function () {
		if (isDropdownVisible.call(this))
			return ;

		let target = this.$el.addClass("show-dropdown");

		if (this._isRenderAsApp()) { // 不会是 native
			$("html,body").addClass("ui-scrollless");
		}
		else {
			target.on("mouseenter", comboMouseHandler.bind(this));
			target.on("mouseleave", comboMouseHandler.bind(this));

			let dropdown = target.children(".dropdown");
			let maxHeight = Fn.getDropdownHeight.call(this, dropdown);
			let offset = Utils.offset(dropdown, this._getScrollContainer(), 0, maxHeight);
			if (offset.isOverflowY)
				target.addClass("show-before");
		}

		setTimeout(() => {
			target.addClass("animate-in");
		}, 0);
	};

	const hideDropdown = function () {
		$("html,body").removeClass("ui-scrollless");

		let target = this.$el.addClass("animate-out");
		target.off("mouseenter").off("mouseleave");

		setTimeout(() => {
			target.removeClass("show-dropdown").removeClass("show-before");
			target.removeClass("animate-in").removeClass("animate-out");
		}, 300);
	};

	const itemChanged = function () {
		// 树型的 index 比较复杂，这里不用 snapshoot 了
		// let snapshoot = this._snapshoot();

		// let indexs = this.getSelectedIndex(true);
		// Component.select.setSelectedIndex.call(this, indexs);

		let datas = this.getSelectedData(true);
		let labels = Utils.map(Utils.toArray(datas), (data) => {
			return this.tree._getDataLabel(data);
		});

		labels = labels.join(", ");
		this.$el.children(".ipt").find("input").val(labels || "");

		if (labels) {
			this.$el.addClass("has-val");
		}
		else {
			this.$el.removeClass("has-val");
		}

		this.trigger("change");
		this.$el.trigger("change");

		// console.log("====>", indexs, snapshoot.compare())

		// snapshoot.done();
	};

	// ====================================================
	const getTreeOptions = function (options) {
		let _options = {};
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
		_options.openId = options.openId;
		return _options;
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UITreeSelect = UITreeSelect;
		UI.init(".ui-treeselect", UITreeSelect, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");