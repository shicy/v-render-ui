// 2019-05-23
// button

(function (frontend) {
	if (frontend && VRender.Component.ui.button)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Utils = UI.util;

	// 默认按钮样式
	const ButtonStyles = ["ui-btn-default", "ui-btn-primary", "ui-btn-success", "ui-btn-danger", 
		"ui-btn-warn", "ui-btn-info", "ui-btn-link", "ui-btn-text"];
	// 按钮大小定义
	const ButtonSizes = ["bigger", "big", "normal", "small", "tiny"];

	///////////////////////////////////////////////////////
	const UIButton = UI.button = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIButton = UIButton.prototype = new UI._base();


	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender();

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-btn");

		let options = this.options || {};

		let size = options.size;
		if (size && ButtonSizes.indexOf(size) >= 0)
			target.addClass(size);

		// 如果是内置 style 就用该样式，否则通过 type 获取一个样式
		// 注：style 样式已在 base 或 UIView 中添加
		let style = options.style || "";
		if (ButtonStyles.indexOf(style) < 0) {
			target.addClass(getTypeStyle(options.type)); // 会返回一个默认样式
		}

		if (Utils.isTrue(options.toggle))
			target.attr("opt-toggle", "1");

		if (Utils.isNotBlank(options.link))
			target.attr("data-lnk", Utils.trimToNull(options.link));

		let mainBtn = $("<button class='btn'></button>").appendTo(target);
		let iconUrl = getIconUrl.call(this);
		if (Utils.isNotBlank(iconUrl)) {
			let icon = $("<i class='icon'></i>").appendTo(mainBtn);
			icon.css((frontend ? "backgroundImage" : "background-image"), "url(" + iconUrl + ")");
		}
		if (Utils.isNotBlank(options.label)) {
			$("<span></span>").appendTo(mainBtn).text(Utils.trimToEmpty(options.label) || " ");
		}

		renderWaitingInfos.call(this, $, target);
		renderDropdowns.call(this, $, target);

		return this;
	};

	_Renderer.getItems = function () {
		return Utils.toArray(this.options.items);
	};


	///////////////////////////////////////////////////////
	const renderWaitingInfos = function ($, target) {
		let waitTime = getWaitTime.call(this);
		if (waitTime)
			target.attr("opt-wait", waitTime);
		
		if (Utils.isTrue(this.options.waiting))
			target.addClass("waiting");
	};

	const renderDropdowns = function ($, target) {
		target.removeClass("has-items");
		target.children(".dropdownbtn").remove();
		target.children(".dropdown").remove();
		let datas = this.getItems();
		if (datas && datas.length > 0) {
			target.addClass("has-items");
			target.append("<span class='dropdownbtn'>&nbsp;</span>");
			let dropdown = $("<div class='dropdown'></div>").appendTo(target);
			let items = $("<ul></ul>").appendTo(dropdown);
			Utils.each(datas, (data) => {
				if (Utils.isNotBlank(data)) {
					if (Utils.isPrimitive(data))
						data = {label: data};
					let item = $("<li></li>").appendTo(items);
					if (data.name)
						item.attr("name", data.name);
					$("<span></span>").appendTo(item).text(Utils.trimToEmpty(data.label) || " ");
				}
			});
		}
	};

	// ====================================================
	const getTypeStyle = function (type) {
		if (Utils.isNotBlank(type)) {
			if (["ok", "submit", "save", "primary", "major"].indexOf(type) >= 0)
				return "ui-btn-primary";
			if (["danger", "error"].indexOf(type) >= 0)
				return "ui-btn-danger";
			if (["success", "complete", "finish"].indexOf(type) >= 0)
				return "ui-btn-success";
			if (["warn", "warning"].indexOf(type) >= 0)
				return "ui-btn-warn";
			if (["info", "highlight"].indexOf(type) >= 0)
				return "ui-btn-info";
			if (type === "text")
				return "ui-btn-text";
			if (type === "link")
				return "ui-btn-link";
		}
		return "ui-btn-default";
	};

	const getIconUrl = function () {
		let icon = this.options.icon;
		if (icon === true) {
			let type = this.options.type;
			if (type == "success" || type == "submit")
				icon = "012b.png";
			else if (type == "warn")
				icon = "013b.png";
			else if (type == "error" || type == "danger")
				icon = "014b.png";
			else if (type == "info")
				icon = "015b.png";
			if (icon !== true)
				icon = "/VRender/icons/" + icon;
		}
		return (typeof icon == "string") ? icon : null;
	};

	const getWaitTime = function () {
		let waitTime = 0;
		let options = this.options || {};
		if (options.hasOwnProperty("waitTime"))
			waitTime = options.waitTime;
		else if (options.hasOwnProperty("wait"))
			waitTime = options.wait;
		if (waitTime === true)
			return -1;
		return Math.max(0, parseInt(waitTime)) || 0;
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIButton = UIButton;
		UI.init(".ui-btn", UIButton, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");