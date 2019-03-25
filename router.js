// 2019-03-22

var VRender = require(__vrender);

var router = VRender.router();

///////////////////////////////////////////////////////////
router(null, function (name, params, callback) {
	return "Hello World!!";
});