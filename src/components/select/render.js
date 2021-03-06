// 2019-05-29
// select(原combobox)

(function (frontend) {
	if (frontend && VRender.Component.ui.select)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UISelect = UI.select = function (view, options) {
		return UI._select.call(this, view, options);
	};
	const _UISelect = UISelect.prototype = new UI._select(false);

	_UISelect.init = function (target, options) {
		UI._base.init.call(this, target, options);

		target = this.$el;
		if (this._isRenderAsApp() && this.isNative()) {
			target.find("select").on("change", selectInputChangeHandler.bind(this));
		}
		else {
			if (this._isRenderAsApp()) {
				target.on("tap", ".dropdown", dropdownTouchHandler.bind(this));
			}
			target.on("tap", ".ipt", iptClickHandler.bind(this));
			target.on("tap", ".ipt .clearbtn", clearBtnClickHandler.bind(this));
			target.on("tap", ".item", itemClickHandler.bind(this));
			target.on("tap", ".ui-more", moreClickHandler.bind(this));
		}

		if (target.is(".editable")) {
			target.on("keydown", "input", inputKeyDownHandler.bind(this));
			target.on("keyup", "input", inputKeyUpHandler.bind(this));
			target.on("focusin", "input", inputFocusInHandler.bind(this));
			target.on("focusout", "input", inputFocusOutHandler.bind(this));
		}
	};

	// ====================================================
	_UISelect.val = function (value) {
		if (Utils.isNull(value)) {
			let selectedIndex = this.getSelectedIndex(true);
			if (selectedIndex && selectedIndex.length > 0) {
				return this.getSelectedKey();
			}
			if (this.isEditable())
				return this.$el.find(".ipt > input").val();
			return null;
		}
		let snapshoot = this._snapshoot();
		let match = matchText.call(this, value);
		if (match)
			this.setSelectedIndex(match[0]);
		else {
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
			let topItem = this.getTopItem();
			if (topItem) {
				if (!this.options.data)
					this.options.data = [];
				if (this.options.data[0] != topItem)
					this.options.data.unshift(topItem);
			}
			return this.options.data;
		}
		return getDataFlat.call(this);
	};

	// 修改数据，
	_UISelect.setDataSilent = function (value) {
		this.options.data = value;
		rerenderSilent.call(this);
	};

	_UISelect.setSelectedIndex = function (value) {
		let snapshoot = this._snapshoot();
		let indexs = UI._select.setSelectedIndex.call(this, value);
		Utils.each(this._getItems(), (item, i) => {
			setItemActive(item, (indexs.indexOf(i) >= 0));
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
		let target = this.$el.children(".ipt");
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
	};

	_UISelect.isClearable = function () {
		return this.$el.attr("opt-clearable") == 1;
	};
	_UISelect.setClearable = function (value) {
		if (Utils.isNull(value) || Utils.isTrue(value))
			this.$el.attr("opt-clearable", "1");
		else
			this.$el.removeAttr("opt-clearable");
	};

	_UISelect.isReadonly = function () {
		return this.$el.attr("opt-readonly") == 1;
	};
	_UISelect.setReadonly = function (value) {
		if (Utils.isNull(value) || Utils.isTrue(value)) {
			this.$el.attr("opt-readonly", "1");
			this.$el.find("input").attr("readonly", "readonly");
		}
		else {
			this.$el.removeAttr("opt-readonly");
			if (this.isEditable())
				this.$el.find("input").removeAttr("readonly");
		}
	};

	_UISelect.getTopItem = function () {
		if (!this.options.hasOwnProperty("topItem")) {
			let topItem = this.$el.attr("opt-top");
			if (topItem) {
				try {
					topItem = JSON.parse(topItem);
				}
				catch (e) {
					topItem = null;
				}
				this.$el.removeAttr("opt-top");
			}
			this.options.topItem = topItem;
		}
		return this.options.topItem;
	};
	_UISelect.setTopItem = function (value) {
		this.options.topItem = value;
		this.$el.removeAttr("opt-top");
	};

	// ====================================================
	_UISelect.addItem = function (data, index) {
		index = Utils.getIndexValue(index);
		data = Fn.doAdapter.call(this, data, index) || {};

		let datas = this.getData(true);
		let beInsert = false;
		if (index >= 0) {
			loopData.call(this, datas, (_data, _index, _array, _subIndex) => {
				if (index == _index) {
					_array.splice(_subIndex, 0, data);
					beInsert = true;
					return false;
				}
			});
		}
		if (!beInsert) {
			if (datas.length > 0)
				datas[datas.length - 1].push(data);
			else
				datas.push([data]);
		}

		let newItem = this._getNewItem($, this._getItemContainer());
		this._renderOneItem($, newItem, data, index);
		
		if (beInsert && index >= 0) {
			this._getItems().eq(index).before(newItem);
			UI._select.updateSelection.call(this);
		}

		this.trigger("itemchange", data);
		return newItem;
	};

	_UISelect.updateItem = function (data, index) {
		data = Fn.doAdapter.call(this, data, index);
		if (!index && index !== 0)
			index = this.getDataIndex(data);
		else
			index = Utils.getIndexValue(index);
		if (index >= 0) {
			let datas = this.getData(true);
			let oldItem = null;
			loopData.call(this, datas, (_data, _index, _array, _subIndex) => {
				if (index == _index) {
					_array.splice(_subIndex, 1, data);

					let newItem = this._getNewItem($, this._getItemContainer());
					this._renderOneItem($, newItem, data, index);

					let items = this._getItems();
					oldItem = items.eq(index).before(newItem).remove();
					if (oldItem.is(".selected"))
						setItemActive(newItem, true);

					return false;
				}
			});
			UI._select.updateSelection.call(this);
			if (oldItem && oldItem.is(".selected"))
				selectChanged.call(this);
			this.trigger("itemchange", data);
		}
		return index;
	};

	_UISelect.removeItemAt = function (index) {
		index = Utils.getIndexValue(index);
		if (index >= 0) {
			let item = this._getItems().eq(index);
			if (item && item.length > 0) {
				let group = item.parent();
				item.remove();
				if (group.children().length == 0)
					group.remove();
			}

			let datas = this.getData(true);
			let removeData = null;
			loopData.call(this, datas, (_data, _index, _array, _subIndex) => {
				if (index == _index) {
					removeData = _array.splice(_subIndex, 1);
					if (_array.length == 0) {
						Utils.remove(datas, (tmp) => {
							return tmp == _array;
						});
					}
					return false;
				}
			});

			UI._select.updateSelection.call(this);
			if (item.is(".selected"))
				selectChanged.call(this);

			return removeData;
		}
		return null;
	};

	// ====================================================
	_UISelect.isNative = function () {
		return this.$el.attr("opt-native") == 1;
	};

	_UISelect.isEditable = function () {
		return this.$el.is(".editable");
	};

	// 可输入的情况是否强制匹配项
	_UISelect.isMatchRequired = function () {
		return this.$el.attr("opt-match") == 1;
	};

	_UISelect.rerender = function () {
		Utils.debounce("select_render-" + this.getViewId(), () => {
			let input = this.$el.find(".ipt > input");
			let inputValue = input.val() || "";

			let selectedIndex = this.getSelectedIndex();

			let itemContainer = this._getItemContainer();
			if (itemContainer && itemContainer.length > 0) {
				this._renderItems($, itemContainer.empty(), this.getData());
			}

			this.setSelectedIndex(selectedIndex);

			if (this.isEditable() && this.getSelectedIndex() < 0) {
				input.val(inputValue || "");
				setValueFlag.call(this, Utils.isNotBlank(inputValue));
			}
		});
	};

	// ====================================================
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
		}
		else {
			UI._items.renderOneItem.call(this, item, null, data, index);
		}
	};

	_UISelect._getNewItem = function ($, itemContainer, data, index) {
		if (this._isRenderAsApp() && this.isNative()) {
			let select = itemContainer.children("select");
			return $("<option class='item'></option>").appendTo(select);
		}
		else {
			let group = itemContainer.children(".grp").last();
			if (!group || group.length == 0)
				group = $("<div class='grp'></div>").appendTo(itemContainer);
			return $("<div class='item'></div>").appendTo(group);
		}
	};

	_UISelect._getItems = function (selector) {
		let items = this._getItemContainer().find(".item");
		if (selector)
			items = items.filter(selector);
		return items;
	};

	_UISelect._isItemSelected = function (item) {
		return item.is(".selected") || item.is(":selected");
	};

	_UISelect._setItemSelected = function (item, beSelected) {
		setItemActive.call(this, item, beSelected);
	};

	_UISelect._loadBefore = function (api, params) {
		UI._base.loadBefore.call(this, api, params);
		if (this._isRenderAsApp() && this.isNative())
			return ;
		let itemContainer = this._getItemContainer();
		itemContainer.find(".ui-load, .ui-more").remove();
		if (this._isRenderAsApp() && this.isNative()) {
			let loadText = this._getLoadText();
			loadText = Utils.isNull(loadText) ? "正在加载.." : Utils.trimToEmpty(loadText);
			if (loadText) {
				let select = itemContainer.children("select");
				$("<option class='ui-load'></option>").appendTo(select).text(loadText);
			}
		}
		else {
			UI._itemsRender.renderLoadView.call(this, $, itemContainer);
		}
	};

	_UISelect._loadAfter = function (err, data) {
		UI._base.loadAfter.call(this, err, data);
		if (this._isRenderAsApp() && this.isNative())
			return ;
		let itemContainer = this._getItemContainer();
		itemContainer.find(".ui-load").remove();
		if (this.hasMore()) {
			this.$el.addClass("has-more");
			if (this._isRenderAsApp() && this.isNative()) {
				let moreText = this._getMoreText();
				moreText = Utils.isNull(moreText) ? "加载更多" : Utils.trimToEmpty(moreText);
				if (moreText) {
					let select = itemContainer.children(".select");
					$("<option class='ui-more'></option>").appendTo(select).text(moreText);
				}
			}
			else {
				UI._itemsRender.renderMoreView.call(this, $, itemContainer);
			}
		}
		else {
			this.$el.removeClass("has-more");
		}
	};

	// ====================================================
	_UISelect._snapshoot_shoot = function (state) {
		state.selectedIndex = this.getSelectedIndex();
		state.value = this.$el.find(".ipt > input").val() || "";
		state.data = this.getSelectedData();
	};

	_UISelect._snapshoot_compare = function (state) {
		let value = this.$el.find(".ipt > input").val() || "";
		if (state.value != value)
			return false;
		let selectedIndex = this.getSelectedIndex();
		return Fn.equalIndex(selectedIndex, state.selectedIndex);
	};

	_UISelect._doAdapter = function (datas) {
		return doAdapter.call(this, datas);
	};

	_UISelect._showDropdown = function () {
		showDropdown.call(this);
	};
	_UISelect._hideDropdown = function () {
		hideDropdown.call(this);
	};

	// ====================================================
	const iptClickHandler = function (e) {
		let target = $(e.target);

		if (this._isRenderAsApp()) {
			// 移动端，可输入的情况下，点击下拉按钮显示下拉列表，否则退出
			if (this.isEditable() && !target.is(".dropdownbtn"))
				return ;
		}
		else {
			if (this.isEditable() && target.is(".dropdownbtn")) {
				this.$el.find(".ipt > input").focus();
			}
		}

		if (!this.isReadonly())
			showDropdown.call(this);
	};

	const itemClickHandler = function (e) {
		let item = $(e.currentTarget);

		if (item.is(".selected") && !this.isMultiple())
			return false;

		let snapshoot = this._snapshoot();
		if (item.is(".selected")) {
			setItemActive(item, false);
		}
		else {
			if (!this.isMultiple())
				setItemActive(this._getItems(".selected"), false);
			setItemActive(item, true);
		}
		UI._select.updateSelection.call(this);
		selectChanged.call(this);
		snapshoot.done();

		if (!this.isMultiple())
			hideDropdown.call(this);

		return false;
	};

	const moreClickHandler = function (e) {
		this.more();
	};

	// 按下“上”、“下”箭头切换选项
	const inputKeyDownHandler = function (e) {
		if (this._isRenderAsApp())
			return ;

		showDropdown.call(this);
		// this.$el.off("mouseenter").off("mouseleave"); // 这样不会自动隐藏

		if (e.which == 38 || e.which == 40) { // 上、下箭头
			if (this.isMultiple())
				return ; // 多选的时候不做切换
			let index = this.getSelectedIndex();
			if (e.which == 38) {
				if (index > 0)
					index -= 1;
			}
			else if (e.which == 40) {
				if (index < this.length() - 1)
					index += 1;
			}
			this.setSelectedIndex(index);
		}
	};

	const inputKeyUpHandler = function (e) {
		let input = $(e.currentTarget);
		if (e.which == 13) {
			hideDropdown.call(this);
			let snapshoot = this._snapshoot();
			let indexs = UI._select.updateSelection.call(this);
			if (indexs && indexs.length > 0) {
				selectChanged.call(this);
			}
			else if (this.isMatchRequired()) {
				input.val("");
			}
			input.select();
			snapshoot.done();
		}
		else if (!Utils.isControlKey(e) || e.which == 8) { // Backspace
			let text = input.val();
			setValueFlag.call(this, (text && text.length > 0));
			let match = matchText.call(this, text, true);
			let items = setItemActive(this._getItems(), false);
			this.$el.find("select").val("");
			if (match && match[0] >= 0)
				setItemActive(items.eq(match[0]), true);
		}
	};

	const inputFocusInHandler = function (e) {
		if (this.t_focus) {
			clearTimeout(this.t_focus);
			this.t_focus = 0;
		}
	};

	const inputFocusOutHandler = function (e) {
		let input = $(e.currentTarget);
		this.t_focus = setTimeout(() => {
			this.t_focus = 0;
			let text = input.val();
			let match = matchText.call(this, text, false);
			if (match && match[0] >= 0) {
				this.setSelectedIndex(match[0]);
			}
			else if (this.isMatchRequired()) {
				match = matchText.call(this, text, true);
				this.setSelectedIndex(match ? match[0] : -1);
			}
			else {
				let snapshoot = this._snapshoot();
				this.setSelectedIndex(-1);
				input.val(text);
				setValueFlag.call(this, (text && text.length > 0));
				snapshoot.done();
			}
			if (isDropdownVisible.call(this)) {
				hideDropdown.call(this);
			}
		}, 200);
	};

	const dropdownTouchHandler = function (e) {
		if ($(e.target).is(".dropdown"))
			hideDropdown.call(this);
	};

	const clearBtnClickHandler = function (e) {
		this.setSelectedIndex(-1);
		return false;
	};

	const selectInputChangeHandler = function (e) {
		let snapshoot = this._snapshoot();
		this._getItems().removeClass("selected");
		UI._select.updateSelection.call(this);
		selectChanged.call(this);
		snapshoot.done();
	};
	

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._selectRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._selectRender(false);

	_Renderer.render = function ($, target) {
		target.addClass("ui-select");

		let options = this.options || {};

		if (this.isNative())
			target.attr("opt-native", "1");

		if (Utils.isTrue(options.needMatch))
			target.attr("opt-match", "1");
		if (Utils.isTrue(options.clearable))
			target.attr("opt-clearable", "1");
		if (Utils.isTrue(options.readonly))
			target.attr("opt-readonly", "1");
		if (options.topItem && !frontend)
			target.attr("opt-top", JSON.stringify(options.topItem));

		// 容器，用于下拉列表定位
		target.attr("opt-box", options.container);

		renderTextView.call(this, $, target);
		target.append("<div class='dropdown'><div class='box'></div></div>");

		UI._selectRender.render.call(this, $, target);

		return this;
	};

	// ====================================================
	_Renderer.getSelectedData = function (needArray) {
		return UI._selectRender.getSelectedData.call(this, needArray, getDataFlat.call(this));
	};

	_Renderer.isNative = function () {
		return Utils.isTrue(this.options.native);
	};

	_Renderer.getTopItem = function () {
		return this.options.topItem;
	};

	// ====================================================
	_Renderer._getItemContainer = function ($, target) {
		return target.children(".dropdown").children(".box");
	};

	_Renderer._renderItems = function ($, target) {
		let itemContainer = this._getItemContainer($, target);
		renderItems.call(this, $, target, itemContainer, this.getData());
	};

	_Renderer._renderEmptyView = function ($, target) {
		// prevent default
	};

	_Renderer._renderLoadView = function ($, target) {
		// prevent default
	};

	_Renderer._setItemSelected = function (item, beSelected) {
		if (beSelected)
			item.addClass("selected").attr("selected", "selected");
		else
			item.removeClass("selected").removeAttr("selected");
	};

	_Renderer._doAdapter = function (datas) {
		return doAdapter.call(this, datas);
	};

	// ====================================================
	const renderTextView = function ($, target) {
		let ipttag = $("<div class='ipt'></div>").appendTo(target);
		let input = $("<input type='text'/>").appendTo(ipttag);

		let datas = this.getSelectedData(true);
		if (datas && datas.length > 0) {
			target.addClass("has-val");
			let labels = Utils.map(datas, (temp) => {
				return this._getDataLabel(temp);
			});
			input.val(labels.join(",") || "");
		}

		let options = this.options || {};
		if (Utils.isTrue(options.editable) && !Utils.isTrue(options.readonly))
			target.addClass("editable");
		else
			input.attr("readonly", "readonly");

		ipttag.append("<div class='dropdownbtn'></div>");
		ipttag.append("<div class='clearbtn'></div>");
		if (Utils.isNotBlank(options.prompt))
			$("<span class='prompt'></span>").appendTo(ipttag).text(options.prompt);
		else if (Utils.isNotBlank(options.placeholder))
			$("<span class='prompt'></span>").appendTo(ipttag).text(options.placeholder);
	};

	const renderItems = function ($, target, itemContainer, datas) {
		this._render_items = [];

		if (this._isRenderAsApp() && this.isNative()) {
			renderItemsAsSelect.call(this, $, itemContainer, datas);
		}
		else {
			renderItemsAsDropdown.call(this, $, itemContainer, datas);
		}

		setTimeout(() => {
			this._render_items = null; // 释放空间
		});
	};

	const renderItemsAsDropdown = function ($, itemContainer, datas) {
		if (!datas || datas.length == 0)
			return ;
		let items = this._render_items || [];
		let addItem = (target, data) => {
			let item = $("<div class='item'></div>").appendTo(target);
			items.push({item: item, data: data, index: items.length});
			renderOneItem.call(this, $, item, data);
		};
		let group = itemContainer.children(".grp").last();
		Utils.each(datas, (data, i) => {
			if (Utils.isArray(data)) {
				if (data.length > 0) {
					group = $("<div class='grp'></div>").appendTo(itemContainer);
					// data.title = "标题";
					if (data.title)
						$("<div class='title'></div>").appendTo(group).text(data.title);
					Utils.each(data, (temp, j) => {
						addItem(group, temp);
					});
				}
				group = null;
			}
			else {
				if (!group || group.length == 0)
					group = $("<div class='grp'></div>").appendTo(itemContainer);
				addItem(group, data);
			}
		});
	};

	const renderItemsAsSelect = function ($, itemContainer, datas) {
		let select = itemContainer.children("select");
		if (!select || select.length == 0) {
			select = $("<select size='1'></select>").appendTo(itemContainer);
			if (this.isMultiple())
				select.attr("multiple", "multiple");
			else
				select.append("<option disabled='disabled' selected='selected'>请选择..</option>");
		}
		if (datas && datas.length > 0) {
			let items = this._render_items || [];
			let addItem = (target, data) => {
				let item = $("<option class='item'></option>").appendTo(target);
				items.push({item: item, data: data, index: items.length});
				item.text(this._getDataLabel(data));
			};
			Utils.each(datas, (data) => {
				if (Utils.isArray(data)) {
					Utils.each(data, (temp) => {
						addItem(select, temp);
					});
				}
				else {
					addItem(select, data);
				}
			});
		}
	};

	const renderOneItem = function ($, item, data, index) {
		UI._itemsRender.renderOneItem.call(this, $, item, item, data, index);
	};

	const rerenderSilent = function () {
		Utils.debounce("select_silent-" + this.getViewId(), () => {
			let selectedIndex = this.getSelectedIndex();

			let itemContainer = this._getItemContainer();
			if (itemContainer && itemContainer.length > 0) {
				this._renderItems($, itemContainer.empty(), this.getData());
			}

			if (selectedIndex >= 0) {
				let item = this._getItems().eq(selectedIndex);
				if (item && item.length > 0)
					setItemActive.call(this, item, true);
			}
		});
	};

	///////////////////////////////////////////////////////
	const selectChanged = function () {
		let datas = this.getSelectedData(true);
		let labels = Utils.map(datas, (data) => {
			return this._getDataLabel(data);
		});
		this.$el.find(".ipt > input").val(labels.join(",") || "");
		setValueFlag.call(this, (datas && datas.length > 0));
	};

	const matchText = function (text, like, start) {
		if (Utils.isBlank(text))
			return null;
		let result = null;
		loopData.call(this, this.getData(true), (data, index, array, subIndex) => {
			let label = this._getDataLabel(data) || "";
			if (text == label) {
				result = [index, data];
				return false;
			}
			if (like && text.length < label.length) {
				let _index = label.indexOf(text);
				if (_index == 0 || (_index > 0 && !start)) {
					result = [index, data];
					return false;
				}
			}
		});
		return result;
	};

	const setItemActive = function (item, isActive) {
		if (isActive)
			item.addClass("selected").attr("selected", "selected");
		else
			item.removeClass("selected").removeAttr("selected");
		return item;
	};

	const setValueFlag = function (hasValue) {
		if (hasValue)
			this.$el.addClass("has-val");
		else
			this.$el.removeClass("has-val");
	};

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
			let dropdown = target.children(".dropdown");
			dropdown.off("click").on("click", function () { return false; });
			setTimeout(() => {
				$("body").on("click." + this.getViewId(), () => {
					hideDropdown.call(this);
				});
			});

			let maxHeight = Fn.getDropdownHeight.call(this, dropdown);
			let offset = Utils.offset(dropdown, this._getScrollContainer(), 0, maxHeight);
			if (offset.isOverflowY)
				target.addClass("show-before");
		}

		// 这里要取消 focusout 事件，不然选项显示不了
		// 移动端点击按钮时，tap 在 foucsout 之前执行，这样选项被 foucsout 隐藏了
		setTimeout(() => {
			if (this.t_focus) {
				clearTimeout(this.t_focus);
				this.t_focus = 0;
			}
		}, 100);

		setTimeout(() => {
			target.addClass("animate-in");
		});
	};

	const hideDropdown = function () {
		$("html,body").removeClass("ui-scrollless");

		let target = this.$el.addClass("animate-out");
		// target.off("mouseenter").off("mouseleave");
		$("body").off("click." + this.getViewId());

		setTimeout(() => {
			target.removeClass("show-dropdown").removeClass("show-before");
			target.removeClass("animate-in").removeClass("animate-out");
		}, 300);
	};

	const loopData = function (datas, callback) {
		let index = 0;
		for (let i = 0; i < datas.length; i++) {
			let data = datas[i];
			if (Utils.isArray(data) && data.length > 0) {
				for (let j = 0; j < data.length; j++) {
					if (callback(data[j], index, data, j) === false)
						return ;
					index += 1;
				}
			}
			else {
				if (callback(data, index, datas, i) === false)
					return ;
				index += 1;
			}
		}
	};

	// ====================================================
	const doAdapter = function (datas) {
		datas = Utils.toArray(datas);
		if (datas._vr_adapter_flag)
			return datas;
		let index = 0;
		let _datas = [];
		let _group = null;
		Utils.each(datas, (data, i) => {
			if (Utils.isArray(data)) {
				if (data.length > 0) {
					let _data = Utils.map(data, (temp) => {
						return Fn.doAdapter.call(this, temp, index++);
					});
					if (data.title)
						_data.title = data.title;
					_datas.push(_data);
				}
				_group = null;
			}
			else {
				if (!_group) {
					_group = [];
					_datas.push(_group);
				}
				data = Fn.doAdapter.call(this, data, index++);
				_group.push(data);
			}
		});
		_datas._vr_adapter_flag = true;
		return _datas;
	};

	const getDataFlat = function () {
		let datas = [];
		Utils.each(this.getData(true), (data) => {
			if (Utils.isArray(data)) {
				Utils.each(data, (temp) => {
					datas.push(temp);
				});
			}
			else {
				datas.push(data);
			}
		});
		return datas;
	};


	///////////////////////////////////////////////////////
	if (frontend) {
		window.UISelect = UISelect;
		UI.init(".ui-select", UISelect, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");