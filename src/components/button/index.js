// 2019-04-10

var VRender = require(__vrender__);
var ComponentBase = require("../../common/ComponentBase");


var UIButton = ComponentBase.extend(module, {
	renderView: function () {
		UIButton.super(this, "renderView");
		this.$el.text("Button");
	}
});
