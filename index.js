// 2019-03-21

const VRender = require(__vrender__);

const UIGroup = require("./src/components/group");
const UIButton = require("./src/components/button");
const UICheckbox = require("./src/components/checkbox");


module.exports = {
	install: function () {
		VRender.UIGroup = UIGroup;
		VRender.UIButton = UIButton;
		VRender.UICheckbox = UICheckbox;
	}
};
