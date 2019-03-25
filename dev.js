// 2019-03-21

var Path = require("path");

global.__vrender = Path.resolve(__dirname, "../v-render"); // 为测试方便
global.__basedir = __dirname;

var VRender = require(__vrender);

// 加载路由
require("./router");

// 加载组件框架
VRender.use(require("./index"));

new VRender({
	cwd: __dirname,
	uplifyExpires: 1000,

	server: {
		port: 9200
	}
});