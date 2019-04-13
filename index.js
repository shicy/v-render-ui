// 2019-03-21

const VRender = require(__vrender__);

const UIButton = require("./src/components/button");
const UICheckbox = require("./src/components/checkbox");


module.exports = {
	install: function () {
		VRender.UIButton = UIButton;
		VRender.UICheckbox = UICheckbox;
	}
};
