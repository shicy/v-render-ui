// 2019-04-13

var VRender = require(__vrender__);
var UIBase = require("../../common/UIBase");


var UICheckbox = UIBase.extend(module, {
	renderView: function () {
		UICheckbox.super(this);
		this.$el.text("Checkbox");
	}
});
