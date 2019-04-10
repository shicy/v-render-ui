// 2019-03-22

const Path = require("path");
const FileSys = require("fs");
const VRender = require(__vrender);

const router = VRender.router();

///////////////////////////////////////////////////////////
router("/component/module", function (name, params, callback) {
	console.log(name);
	let paths = name.split("/");
	if (paths[3]) {
		let modulePath = Path.resolve(__dirname, `./modules/${paths[3]}/index.js`);
		if (FileSys.existsSync(modulePath)) {
			callback(false, `./doc/modules/${paths[3]}/index`);
		}
		else {
			callback(`抱歉，${paths[3]} 组件暂未实现！`);
		}
	}
	else {
		return "Components";
	}
});

router(null, function (name, params, callback) {
	callback(false, "./doc/main/MainView");
});