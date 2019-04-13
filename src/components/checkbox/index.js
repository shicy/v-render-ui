// 2019-04-13

var VRender = require(__vrender__);
var ComponentBase = require("../../common/ComponentBase");


var UICheckbox = ComponentBase.extend(module, {
	renderView: function () {
		UICheckbox.super(this, "renderView");
		this.$el.text("Checkbox");
	}
});
