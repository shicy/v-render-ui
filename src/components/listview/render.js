// 2019-07-23
// listview

(function (frontend) {
	if (frontend && VRender.Component.ui.listview)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UIListView = UI.listview = function (view, options) {
		return UI._select.call(this, view, options);
	};
	const _UIListView = UIListView.prototype = new UI._select(false);

	_UIListView.init = function (target, options) {
		UI._select.init.call(this, target, options);

		let list = this.list = this.$el.children("ul");

		list.on("tap", "li", itemClickHandler.bind(this));
		list.on("tap", ".ui-listview-item3 .btnbar", function () { return false; });
		list.on("tap", ".ui-listview-item4 .btnbar", function () { return false; });
	};

	// ====================================================
	_UIListView.isChkboxVisible = function () {
		return this.$el.is(".show-chkbox");
	};
	
	// ====================================================
	_UIListView._getItemContainer = function () {
		return this.$el.children("ul");
	};

	_UIListView._renderOneItem = function ($, item, data, index, bSelected) {
		renderOneItem.call(this, $, item, data, index, bSelected);
	};

	// ====================================================
	const itemClickHandler = function (e) {
		let item = $(e.currentTarget);
		if (item.parent().is(this.list)) {
			if (item.is(".disabled"))
				return ;

			let snapshoot = this._snapshoot();

			if (item.is(".selected")) {
				item.removeClass("selected");
			}
			else {
				item.addClass("selected");
				if (!this.isMultiple())
					item.siblings().removeClass("selected");
			}

			let indexs = Utils.map(this.list.children(".selected"), (item) => {
				return item.index();
			});
			UI._select.setSelectedIndex.call(this, indexs);

			snapshoot.done();
		}
	};
	
	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._selectRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._selectRender(false);

	// options: titleField, descField
	Renderer.itemRenderer_simple = function (options) {
		let _options = {style: "ui-listview-item1", title: null, desc: null};
		if (typeof options === "string") {
			_options.title = options;
			_options.desc = arguments && arguments[1];
		}
		else if (options) {
			_options.title = options.titleField;
			_options.desc = options.descField;
		}
		return itemRendererFunction.call(this, _options);
	};

	// options: iconField, titleField, descField, defaultIconUrl
	Renderer.itemRenderer_icon = function (options) {
		let _options = {style: "ui-listview-item2", icon: null, title: null, desc: null};
		if (typeof options == "string") {
			_options.icon = options;
			_options.title = arguments && arguments[1];
			_options.desc = arguments && arguments[2];
		}
		else if (options) {
			_options.icon = options.iconField;
			_options.title = options.titleField;
			_options.desc = options.descField;
			_options.defIcon = options.defaultIconUrl;
		}
		return itemRendererFunction.call(this, _options);
	};

	// options: buttons, titleField, descField
	Renderer.itemRenderer_button = function (options) {
		let _options = {style: "ui-listview-item3", buttons: null, title: null, desc: null};
		if (typeof options == "string") {
			_options.title = options;
			_options.desc = arguments && arguments[1];
		}
		else if (Utils.isArray(options)) {
			_options.buttons = options;
			_options.title = arguments && arguments[1];
			_options.desc = arguments && arguments[2];
		}
		else if (options) {
			_options.buttons = options.buttons;
			_options.title = options.titleField;
			_options.desc = options.descField;
		}
		return itemRendererFunction.call(this, _options);
	};

	// options: iconField, buttons, titleField, descField
	Renderer.itemRenderer_icon_button = function (options) {
		let _options = {style: "ui-listview-item4", buttons: null, icon: null, title: null, desc: null};
		if (typeof options == "string") {
			_options.icon = options;
			_options.buttons = arguments && arguments[1];
			_options.title = arguments && arguments[2];
			_options.desc = arguments && arguments[3];
		}
		else if (Utils.isArray(options)) {
			_options.buttons = options;
			_options.title = arguments && arguments[1];
			_options.desc = arguments && arguments[2];
		}
		else if (options) {
			_options.icon = options.iconField;
			_options.buttons = options.buttons;
			_options.title = options.titleField;
			_options.desc = options.descField;
		}
		return itemRendererFunction.call(this, _options);
	};

	const itemRendererFunction = function (options) {
		let func = function ($, item, data, index) {
			let opt = options || {};

			let getValue = (field, optFields) => {
				if (Utils.isNotNull(field))
					return data && data[field];
				if (data && optFields) {
					for (let i in optFields) {
						let _field = optFields[i];
						if (Utils.isNotBlank(_field) && data.hasOwnProperty(_field))
							return data[_field];
					}
				}
				if (field == "title") {
					if (Utils.isFunction(this._getDataLabel))
						return this._getDataLabel(data, index);
				}
			};

			item = $("<div></div>").addClass(opt.style);

			if (opt.hasOwnProperty("icon")) {
				let iconUrl = getValue(opt.icon, ["icon", "image", "img"]);
				let image = $("<img class='icon'/>").appendTo(item);
				image.attr("src", (Utils.trimToEmpty(iconUrl) || opt.defIcon || null));
			}

			let content = $("<div class='content'></div>").appendTo(item);
			let title = getValue(opt.title, ["title"]);
			$("<div class='title'></div>").appendTo(content).html(title || "&nbsp;");

			let description = getValue(opt.desc, ["desc", "description", "remark"]);
			if (Utils.isNotBlank(description))
				$("<div class='desc'></div>").appendTo(content).html(description);

			if (opt.hasOwnProperty("buttons")) {
				let btnbar = $("<div class='btnbar'></div>").appendTo(item);
				Utils.each(Utils.toArray(opt.buttons), (data) => {
					if (typeof VRender === "undefined") { // 服务端
						let UIButton = require("../button/index");
						new UIButton(this.context, data).render(btnbar);
					}
					else { // 前端
						UI.button.create(Utils.extend({}, data, {target: btnbar}));
					}
				});
			}

			return item;
		};

		func._state = 1;
		func._data = JSON.stringify(options);
		return func;
	};

	// ====================================================
	_Renderer.render = function ($, target) {
		target.addClass("ui-listview");
		if (this.isChkboxVisible())
			target.addClass("show-chkbox");

		target.append("<ul></ul>");
		UI._selectRender.render.call(this, $, target);

		return this;
	};

	_Renderer.isChkboxVisible = function () {
		return Utils.isTrue(this.options.chkbox);
	};

	// ====================================================
	_Renderer._renderOneItem = function ($, item, data, index) {
		renderOneItem.call(this, $, item, data, index);
	};

	_Renderer._getItemContainer = function ($, target) {
		return target.children("ul");
	};

	_Renderer._renderEmptyView = function ($, target) {
		UI._itemsRender.renderEmptyView.call(this, $, target);
	};

	_Renderer._renderLoadView = function ($, target) {
		UI._itemsRender.renderLoadView.call(this, $, target);
	};
	
	// ====================================================
	const renderOneItem = function ($, item, data, index) {
		let container = $("<div class='box'></div>").appendTo(item);
		UI._itemsRender.renderOneItem.call(this, $, item, container, data, index);
		if (this.isChkboxVisible()) {
			item.prepend("<span class='chkbox'></span>");
		}
	};
	
	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIListView = UIListView;
		UI.init(".ui-listview", UIListView, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");