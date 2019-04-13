// 2019-04-13

var VRender = require(__vrender__);
var Component = require("../../common/Component");


var UIGroup = Component.extend(module, {
	renderView: function () {
		UIGroup.super(this);
		this.$el.text("Group");
	}
});
