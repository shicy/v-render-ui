// 2019-04-10

var VRender = require(__vrender__);
var Component = require("../../common/Component");


var UIButton = Component.extend(module, {
	renderView: function () {
		UIButton.super(this);
		this.$el.text("Button");
	}
});