// 2019-03-22

const VRender = require(__vrender);

const router = VRender.router();

///////////////////////////////////////////////////////////
router(null, function (name, params, callback) {
	callback(false, "./doc/main/MainView");
});