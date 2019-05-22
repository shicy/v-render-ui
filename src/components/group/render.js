// 2019-04-13

(function (frontend) {
	if (frontend && VRender.Component.ui.group)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Utils = UI.util;

	const VERTICAL = "vertical";
	const HORIZONTIAL = "horizontial";

	///////////////////////////////////////////////////////
	const UIGroup = UI.group = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIGroup = UIGroup.prototype = new UI._base();

	_UIGroup.getOrientation = function () {
		return this.$el.attr("opt-orientation");
	}
	_UIGroup.setOrientation = function (value) {
		this.$el.removeClass(HORIZONTIAL).removeClass(VERTICAL);
		this.$el.removeAttr("opt-orientation");
		if (value === HORIZONTIAL || value === VERTICAL) {
			this.$el.addClass(value).attr("opt-orientation", value);
		}
		layoutChanged.call(this);
	};

	_UIGroup.getGap = function () {
		return this.$el.attr("opt-gap") || 0;
	};
	_UIGroup.setGap = function (value) {
		this.$el.attr("opt-gap", Utils.trimToEmpty(value));
		layoutChanged.call(this);
	};

	_UIGroup.getAlign = function () {
		return this.$el.attr("opt-align");
	};
	_UIGroup.setAlign = function (value) {
		this.$el.attr("opt-align", Utils.trimToEmpty(value));
		layoutChanged.call(this);
	};

	_UIGroup.append = function (values) {
		if (!arguments || arguments.length == 0)
			return this;
		for (let i = 0, l = arguments.length; i < l; i++) {
			let item = arguments[i];
			if (Utils.isArray(item)) {
				item.forEach(temp => {
					this.add(temp);
				});
			}
			else {
				this.add(item);
			}
		}
		return this;
	};

	_UIGroup.add = function (child, index) {
		if (Utils.isNotBlank(child)) {
			let item = child.$el || child;
			if (this.getOrientation()) {
				// 有明确指定方向，用 div 包裹
				item = $("<div class='grp-item'></div>").append(item);
			}

			index = (isNaN(index) || index === "") ? -1 : parseInt(index);
			let children = this.$el.children();
			if (index >= 0 && index < children.length) {
				children.eq(index).before(item);
			}
			else {
				this.$el.append(item);
			}

			layoutChanged.call(this);
		}
		return child;
	};

	_UIGroup.removeAt = function (index) {
		let item = this.$el.children().eq(index).remove();
		layoutChanged.call(this);
		return item.children();
	};

	// ====================================================
	const layoutChanged = function () {
		Utils.debounce("group_layout-" + this.getViewId(), () => {
			updateLayout.call(this, $, this.$el);
		});
	};

	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender();

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-group");

		let orientation = this.getOrientation();
		if (orientation) {
			target.addClass(orientation);
			target.attr("opt-orientation", orientation);
		}

		target.attr("opt-gap", this.getGap());
		target.attr("opt-align", this.getAlign());

		renderSubViews.call(this, $, target);
		return this;
	};

	_Renderer.getOrientation = function () {
		let orientation = this.options.orientation;
		if (orientation == HORIZONTIAL || orientation == VERTICAL)
			return orientation;
		return null;
	};

	_Renderer.getGap = function () {
		return this.options.gap;
	};

	_Renderer.getAlign = function () {
		return this.options.align;
	};

	///////////////////////////////////////////////////////
	const renderSubViews = function ($, target) {
		showSubViews.call(this, $, target, getChildren.call(this));
	};

	const getChildren = function () {
		return this.options.children || this.options.subViews || this.options.views;
	};

	const showSubViews = function ($, target, children) {
		children = Utils.toArray(children);
		let orientation = this.getOrientation();
		Utils.each(children, (child) => {
			if (Utils.isNotNull(child)) {
				let _target = target;
				// 如果明确指定了方向，则用一个 div 包裹
				if (orientation)
					_target = $("<div class='grp-item'></div>").appendTo(target);
				if (Utils.isFunction(child.render))
					child.render(_target);
				else 
					_target.append(child.$el || child);
			}
		});
		updateLayout.call(this, $, target);
	};

	const updateLayout = function ($, target) {
		let left = "", top = "", align = "", valign = "", display = "";
		let gap = Utils.getFormatSize(this.getGap(), this._isRenderAsRem()) || "";

		let orientation = this.getOrientation();
		if (orientation == HORIZONTIAL) {
			display = "inline-block";
			left = gap;
		}
		else if (orientation == VERTICAL) {
			// display = "block";
			top = gap;
		}
		else {
			top = gap;
		}

		let aligns = this.getAlign() || "";
		aligns = aligns.toLowerCase();
		if (/left/.test(aligns))
			align = "left";
		else if (/center/.test(aligns))
			align = "center";
		else if (/right/.test(aligns))
			align = "right";

		if (/top/.test(aligns))
			valign = "top";
		else if (/middle/.test(aligns))
			valign = "middle";
		else if (/bottom/.test(aligns))
			valign = "bottom";

		target.css("text-align", align);
		let children = target.children();
		children.css("display", display);
		children.css("vertical-align", valign);
		children.css("margin-left", left).css("margin-top", top);
		children.eq(0).css("margin-left", "").css("margin-top", "");
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIGroup = UIGroup;
		UI.init(".ui-group", UIGroup, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");