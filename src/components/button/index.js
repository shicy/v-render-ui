// 2019-04-10

var VRender = require(__vrender__);
var UIBase = require("../../common/UIBase");


var UIButton = UIBase.extend(module, {
	renderView: function () {
		UIButton.super(this);
		this.$el.text("Button");
	}
});
