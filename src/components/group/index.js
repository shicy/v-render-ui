// ========================================================
// 组视图容器
// 可用属性：
// 	orientation: 布局方向，"vertical", "horizontial"
// 	align: 对齐方式，"start", "center", "end"
// 	gap: 元素间隔距离
// @author shicy <shicy85@163.com>
// Create on 2019-04-13
// ========================================================

const VRender = require(__vrender__);
const UIBase = require("../../common/UIBase");
const render = require("./script");


const Utils = VRender.Utils;
const UIView = VRender.UIView;

const UIGroup = UIBase.extend(module, {
	doInit: function (options) {
		UIGroup.super(this, (done) => {
			let options = this.options || {};

			let children = options.children || options.subViews || options.views;
			options.children = Utils.toArray(children);
			delete options.subViews;
			delete options.views;

			if (Utils.isFunction(done))
				done();
		});
	},

	renderView: function () {
		UIGroup.super(this);
		render(this, VRender.$, this.$el, this.options);
	},

	getOrientation: function () {
		return this.options.orientation;
	},
	setOrientation: function (orientation) {
		this.options.orientation = orientation;
	},

	getGap: function (value) {
		return this.options.gap;
	},
	setGap: function (value) {
		this.options.gap = value;
	},

	getAlign: function () {
		return this.options.align;
	},
	setAlign: function (value) {
		this.options.align = value;
	},

	// 第一个参数为 true 将被忽略
	// 第一个参数为 false 将不会解析添加的内容（直接添加）
	append: function () {
		let args = arguments;
		if (!args || args.length == 0)
			return this;
		let options = null;
		let argIndex = 0;
		if (args[0] === true || args[0] === false) {
			argIndex = 1;
			options = args[0];
		}
		for (let i = argIndex, l = args.length; i < l; i++) {
			let arg = args[i];
			if (Utils.isArray(arg)) {
				for (let m = 0, n = arg.length; m < n; m++) {
					this.add(arg[m], options);
				}
			}
			else {
				this.add(arg, options);
			}
		}
		return this;
	},

	// 添加子内容
	// child：可以是一个组件(UIView)、DomHandler、对象(tag,id,cls..)，字符串
	// 其中对象和字符串默认被解析成DomHelper
	// 为提高性能，可是设置 options.parse=false 或 options=false 来取消字符串的解析操作
	// options.index可以指定添加子内容到什么位置
	add: function (child, options) {
		if (Utils.isNotEmpty(child)) {
			let index = options && options.index;
			if (child instanceof UIView) {
				addItem.call(this, child, index);
			}
			else if (typeof child === "string") {
				if (!(options === false || (options && options.parse === false)))
					child = VRender.$({src: child});
				addItem.call(this, child, index);
			}
			else if (child.hasOwnProperty("VRENDERCLSID") && child["VRENDERCLSID"] == "DomHandler") {
				addItem.call(this, child, index);
			}
			else {
				child = VRender.$(child);
				addItem.call(this, child, index);
			}
		}
		return child;
	},

	remove: function (child) {
		for (let i = this.options.children.length; i >= 0; i--) {
			if (this.options.children[i] == child)
				return this.options.children.splice(i, 1)[0];
		}
		return null;
	},

	// 删除子内容
	removeAt: function (index) {
		index = (isNaN(index) || index === "") ? -1 : parseInt(index);
		if (index >= 0) {
			let children = this.options.children;
			if (index < children.length)
				return children.splice(index, 1)[0];
		}
		return null;
	}
});

UIGroup.VERTICAL = "vertical";
UIGroup.HORIZONTIAL = "horizontial";

const addItem = function (item, index) {
	index = (isNaN(index) || index === "") ? -1 : parseInt(index);
	let children = this.options.children;
	if (index >= 0 && index < children.length) {
		children.splice(index, 0, item);
	}
	else {
		children.push(item);
	}
};
