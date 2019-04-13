// 2019-04-13

var VRender = require(__vrender__);
var Component = require("../../common/Component");


var UICheckbox = Component.extend(module, {
	renderView: function () {
		UICheckbox.super(this, "renderView");
		this.$el.text("Checkbox");
	}
});
