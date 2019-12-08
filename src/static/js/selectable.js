// 2019-04-18

(function (frontend) {
	if (frontend && VRender.Component.ui._select)
		return ;

	const UI = frontend ? VRender.Component.ui : require("./init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UISelect = UI._select = function (view, options) {
		return UI._items.call(this, view, options);
	};
	const _UISelect = UISelect.prototype = new UI._items(false);

	// ====================================================
	UISelect.init = function (view, options) {
		return UI._items.init.call(this, view, options);
	};

	// 获取当前选中项的索引
	UISelect.getSelectedIndex = function (needArray) {
		let indexs = this.$el.attr("data-inds");
		if (Utils.isNull(indexs)) {
			indexs = [];
			let ids = this.$el.attr("data-ids");
			if (Utils.isNull(ids)) {
				Utils.each(this.getData(), (data, i) => {
					// 给定空数组防止循环调用（_isSelected()方法中有调用getSelectedIndex()方法）
					if (this._isSelected(data, i, [], []))
						indexs.push(i);
				});
			}
			else if (ids.length > 0) {
				ids = ids.split(",");
				Utils.each(this.getData(), (data, i) => {
					let _id = this._getDataKey(data);
					let _index = Utils.index(ids, (tmp) => { return tmp == _id; });
					if (_index >= 0)
						indexs.push(i);
				});
			}
		}
		else {
			indexs = Fn.getIntValues(indexs, 0);
		}

		if (this.isMultiple())
			return indexs.length > 0 ? indexs : null;
		if (needArray)
			return indexs.length > 0 ? [indexs[0]] : null;
		return indexs.length > 0 ? indexs[0] : -1;
	};

	// 设置列表选中项的索引（只更新索引，不修改视图）
	UISelect.setSelectedIndex = function (value) {
		let max = Utils.isFunction(this.length) ? (this.length() - 1) : null;
		let indexs = Fn.getIntValues(value, 0, max);
		if (indexs.length > 1 && !this.isMultiple())
			indexs = [indexs[0]];
		this.$el.attr("data-inds", indexs.join(","));
		this.$el.removeAttr("data-ids");
		return indexs;
	};

	// 获取当前选中项对应的数据编号
	UISelect.getSelectedKey = function (needArray) {
		let ids = this.$el.attr("data-ids");
		let indexs = this.$el.attr("data-inds");

		if (Utils.isNotNull(indexs)) {
			ids = [];
			indexs = Fn.getIntValues(indexs, 0);
			if (indexs.length > 0) {
				let datas = this.getData() || [];
				Utils.each(indexs, (index) => {
					let data = index < datas.length ? datas[index] : null;
					if (data)
						ids.push(this._getDataKey(data));
				});
			}
		}
		else if (Utils.isNull(ids)) {
			ids = [];
			Utils.each(this.getData(), (data, i) => {
				// 给定空数组防止循环调用（_isSelected()方法中有调用getSelectedIndex()方法）
				if (this._isSelected(data, i, [], []))
					ids.push(this._getDataKey(data));
			});
		}
		else if (!Utils.isArray(ids)) {
			ids = ids.split(",");
		}

		if (!ids || ids.length == 0)
			return null;

		let _ids = [];
		Utils.each(ids, (tmp) => {
			if (tmp || tmp === 0)
				_ids.push(isNaN(tmp) ? tmp : parseInt(tmp));
		});
		if (_ids.length == 0)
			return null;
		if (this.isMultiple())
			return _ids;
		return needArray ? [_ids[0]] : _ids[0];
	};

	// 根据数据编号设置当前选中项
	UISelect.setSelectedKey = function (value) {
		if (!Utils.isArray(value))
			value = Utils.isBlank(value) ? [] : Utils.trimToEmpty(value).split(",");
		let indexs = [];
		Utils.each(this.getData(), (data, i) => {
			let _id = this._getDataKey(data);
			let _index = Utils.index(value, (tmp) => { return tmp == _id; });
			if (_index >= 0)
				indexs.push(i);
		});
		this.setSelectedIndex(indexs);
	};

	// 获取当前选中项对应的数据
	UISelect.getSelectedData = function (needArray, datas) {
		let indexs = this.getSelectedIndex(true), ids = [];
		if (!indexs)
			ids = this.getSelectedKey(true) || [];

		let selectedDatas = [];
		datas = datas || this.getData();
		Utils.each(datas, (data, i) => {
			if (this._isSelected(data, i, indexs, ids))
				selectedDatas.push(data);
		});

		if (selectedDatas.length == 0)
			return null;
		if (this.isMultiple())
			return selectedDatas;
		return needArray ? [selectedDatas[0]] : selectedDatas[0];
	};

	UISelect.updateSelection = function () {
		let indexs = [];
		Utils.each(this._getItems(), (item, i) => {
			if (this._isItemSelected(item))
				indexs.push(i);
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
	};

	// ====================================================
	_UISelect.init = function (view, options) {
		return UISelect.init.call(this, view, options);
	};

	// 判断列表是否支持多选
	_UISelect.isMultiple = function () {
		return this.$el.attr("multiple") == "multiple";
	};

	_UISelect.setMultiple = function (value) {
		value = (Utils.isNull(value) || Utils.isTrue(value)) ? true : false;
		if (this.isMultiple() != value) {
			if (value)
				this.$el.attr("multiple", "multiple");
			else
				this.$el.removeAttr("multiple");
			this.rerender();
		}
	};

	// 获取当前选中项的索引
	_UISelect.getSelectedIndex = function (needArray) {
		return UISelect.getSelectedIndex.call(this, needArray);
	};

	// 设置列表选中项的索引（只更新索引，不修改视图）
	_UISelect.setSelectedIndex = function (value) {
		let snapshoot = this._snapshoot();
		let indexs = UISelect.setSelectedIndex.call(this, value);
		Utils.each(this._getItems(), (item, i) => {
			this._setItemSelected(item, (indexs.indexOf(i) >= 0));
		});
		snapshoot.done();
		return indexs;
	};

	// 获取当前选中项对应的数据编号
	_UISelect.getSelectedKey = function (needArray) {
		return UISelect.getSelectedKey.call(this, needArray);
	};

	// 根据数据编号设置当前选中项
	_UISelect.setSelectedKey = function (value) {
		return UISelect.setSelectedKey.call(this, value);
	};

	// 获取当前选中项对应的数据
	_UISelect.getSelectedData = function (needArray) {
		return UISelect.getSelectedData.call(this, needArray);
	};

	// 选择所有
	_UISelect.setAllSelected = function () {
		let indexs = Utils.map(this.getData(), (data, i) => (i));
		this.setSelectedIndex(indexs);
	};

	// 判断某个索引是否被选中
	_UISelect.isSelectedIndex = function (index) {
		index = Utils.getIndexValue(index);
		return index < 0 ? false : this._isSelected(this.getDataAt(index), index);
	};

	// 判断编号对应的项是否被选中
	_UISelect.isSelectedKey = function (value) {
		if (Utils.isBlank(value))
			return false;
		let ids = this.getSelectedKey(true);
		return Utils.index(ids, (tmp) => { return tmp == value; }) >= 0;
	};

	// 判断是否选中所有项
	_UISelect.isAllSelected = function () {
		let length = this.length();
		if (length > 0) {
			let indexs = this.getSelectedIndex(true);
			return indexs && indexs.length == length;
		}
		return false;
	};

	_UISelect.addItem = function (data, index) {
		let newItem = UISelect.addItem.call(this, data, index);
		if (newItem)
			UISelect.updateSelection.call(this);
		return newItem;
	};

	_UISelect.updateItem = function (data, index) {
		index = UISelect.updateItem.call(this, data, index);
		if (index >= 0)
			UISelect.updateSelection.call(this);
		return index;
	};

	_UISelect.removeItem = function (data) {
		data = UISelect.removeItem.call(this, data);
		if (data)
			UISelect.updateSelection.call(this);
		return data;
	};

	_UISelect.removeItemAt = function (index) {
		let data = UISelect.removeItem.call(this, null, index);
		if (data)
			UISelect.updateSelection.call(this);
		return data;
	};

	// 判断是否选中
	_UISelect._isSelected = function (data, index, selectedIndex, selectedId) {
		return Renderer.isSelected.call(this, data, index, selectedIndex, selectedId);
	};

	_UISelect._isItemSelected = function (item) {
		return item.is(".selected");
	};

	_UISelect._setItemSelected = function (item, beSelected) {
		if (beSelected)
			item.addClass("selected");
		else
			item.removeClass("selected");
	};

	_UISelect._snapshoot_shoot = function (state, selectedIndex, selectedData) {
		state.selectedIndex = selectedIndex || this.getSelectedIndex();
		state.selectedData = selectedData || this.getSelectedData();
		state.data = state.selectedData;
	};

	_UISelect._snapshoot_compare = function (state, selectedIndex) {
		if (!selectedIndex)
			selectedIndex = this.getSelectedIndex(true);
		return Fn.equalIndex(state.selectedIndex, selectedIndex);
	};

	///////////////////////////////////////////////////////
	const Renderer = UI._selectRender = function (context, options) {
		UI._itemsRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._itemsRender(false);

	// ====================================================
	Renderer.render = function ($, target) {
		UI._itemsRender.render.call(this, $, target);

		if (this.isMultiple())
			target.attr("multiple", "multiple");

		this.renderSelection($, target);
	};

	Renderer.renderSelection = function ($, target, items) {
		let indexs = this.getSelectedIndex(true);
		let ids = this.getSelectedKey(true);

		if (indexs)
			target.attr("data-inds", indexs.join(","));
		if (ids)
			target.attr("data-ids", ids.join(","));

		if (!frontend && this.options.apiName) {
			if (indexs)
				target.attr("data-tryindex", indexs.join(","));
			if (ids)
				target.attr("data-tryid", ids.join(","));
		}

		if (items && items.length > 0) {
			ids = ids || [];
			Utils.each(items, (item, i) => {
				if (this._isSelected(item.data, item.index, indexs, ids)) {
					if (Utils.isFunction(this._setItemSelected))
						this._setItemSelected(item.item, true);
					else
						item.item.addClass("selected");
				}
			});
		}
	};

	// ----------------------------------------------------
	// 获取选中的项索引
	Renderer.getSelectedIndex = function (needArray) {
		let selectedIndex = this.options.selectedIndex;
		if (Utils.isBlank(selectedIndex)) {
			return (needArray || this.isMultiple()) ? null : -1;
		}
		if (!Utils.isArray(selectedIndex))
			selectedIndex = ("" + selectedIndex).split(",");
		let indexs = [];
		Utils.each(selectedIndex, (tmp) => {
			if (!isNaN(tmp)) {
				let index = parseInt(tmp);
				if (!isNaN(index) && index >= 0)
					indexs.push(index);
			}
		});
		if (this.isMultiple())
			return indexs.length > 0 ? indexs : null;
		if (indexs && indexs.length > 0)
			return needArray ? [indexs[0]] : indexs[0];
		return -1;
	};

	// 获取选中的项编号
	Renderer.getSelectedKey = function (needArray) {
		let selectedKey = this.options.selectedKey;
		if (Utils.isBlank(selectedKey)) {
			return null;
		}
		if (!Utils.isArray(selectedKey))
			selectedKey = ("" + selectedKey).split(",");
		let ids = [];
		Utils.each(selectedKey, (tmp) => {
			if (tmp || tmp === 0) {
				ids.push(isNaN(tmp) ? tmp : parseInt(tmp));
			}
		});
		if (ids.length == 0)
			return null;
		if (this.isMultiple())
			return ids;
		return needArray ? [ids[0]] : ids[0];
	};

	// 获取选中的数据集
	Renderer.getSelectedData = function (needArray, datas) {
		datas = datas || this.getData();
		let selectedDatas = [];
		if (datas && datas.length > 0) {
			let indexs = this.getSelectedIndex(true);
			let ids = this.getSelectedKey(true) || [];
			for (let i = 0, l = datas.length; i < l; i++) {
				let _data = datas[i];
				if (this._isSelected(_data, i, indexs, ids))
					selectedDatas.push(_data);
			}
		}
		if (selectedDatas.length == 0)
			return null;
		if (this.isMultiple())
			return selectedDatas;
		return needArray ? [selectedDatas[0]] : selectedDatas[0];
	};

	Renderer.isSelected = function (data, index, selectedIndexs, selectedIds) {
		if (!selectedIndexs && !selectedIds) {
			selectedIndexs = this.getSelectedIndex(true);
			selectedIds = this.getSelectedKey(true) || [];
		}
		if (selectedIndexs) {
			index = Utils.getIndexValue(index);
			if (index < 0)
				return false;
			return selectedIndexs.indexOf(index) >= 0;
		}

		if (selectedIds) {
			let _id = this._getDataKey(data);
			return Utils.index(selectedIds, (tmp) => {
				return tmp == _id;
			}) >= 0;
		}

		return false;
	};

	// 判断是否全部选中
	Renderer.isAllSelected = function (datas) {
		datas = datas || this.getData();
		if (datas && datas.length > 0) {
			let indexs = this.getSelectedIndex(true);
			let ids = this.getSelectedKey(true) || [];
			for (let i = 0, l = datas.length; i < l; i++) {
				if (!this._isSelected(datas[i], i, indexs, ids))
					return false;
			}
			return true;
		}
		return false;
	};

	// ====================================================
	_Renderer.render = function ($, target) {
		Renderer.render.call(this, $, target);
	};

	// 初始化渲染组件选中项信息（索引或编号）
	_Renderer.renderSelection = function ($, target) {
		Renderer.renderSelection.call(this, $, target, this._render_items);
	};

	// ----------------------------------------------------
	// 获取选中的项索引
	_Renderer.getSelectedIndex = function (needArray) {
		return Renderer.getSelectedIndex.call(this, needArray);
	};

	// 获取选中的项编号
	_Renderer.getSelectedKey = function (needArray) {
		return Renderer.getSelectedKey.call(this, needArray);
	};

	_Renderer.getSelectedData = function (needArray) {
		return Renderer.getSelectedData.call(this, needArray);
	};

	// 判断组件是否支持多选
	_Renderer.isMultiple = function () {
		return Fn.isMultiple.call(this);
	};

	// 判断是否全部选中
	_Renderer.isAllSelected = function () {
		return Renderer.isAllSelected.call(this);
	};

	// ----------------------------------------------------
	_Renderer._isSelected = function (data, index, selectedIndexs, selectedIds) {
		return Renderer.isSelected.call(this, data, index, selectedIndexs, selectedIds);
	};

	_Renderer._setItemSelected = function (item, beSelected) {
		if (beSelected)
			item.addClass("selected");
		else
			item.removeClass("selected");
	};
})(typeof window !== "undefined");