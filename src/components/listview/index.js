// ========================================================
// 列表
// @author shicy <shicy85@163.com>
// Create on 2019-07-23
// ========================================================

const VRender = require(__vrender__);
const UISelectable = require("../../common/UISelectable");
const Renderer = require("./render");


const Utils = VRender.Utils;

const UIListView = UISelectable.extend(module, {
	renderView: function () {
		UIListView.super(this);
		new Renderer(this, this.options).render(VRender.$, this.$el);
	},

	isChkboxVisible: function () {
		return Utils.isTrue(this.options.chkbox);
	},

	setChkboxVisible: function (value) {
		this.options.chkbox = Utils.isNull(value) ? true : Utils.isTrue(value);
	},

	getPaginator: function () {
		return this.options.paginator || this.options.pager;
	},

	setPaginator: function (value) {
		this.options.paginator = value;
		delete this.options.pager;
	}
});

UIListView.item_renderer_simple = Renderer.itemRenderer_simple;

UIListView.item_renderer_icon = Renderer.itemRenderer_icon;

UIListView.item_renderer_button = Renderer.itemRenderer_button;

UIListView.item_renderer_icon_button = Renderer.itemRenderer_icon_button;
