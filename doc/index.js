// 2019-03-25

const Path = require("path");

global.__basedir = Path.resolve(__dirname, "../");
global.__vrender = "v-render";
// global.__vrender = Path.resolve(__dirname, "../../v-render"); // 为测试方便

const VRender = require(__vrender);

// 加载路由
require("./router");

// 加载组件框架
VRender.use(require("../index"));

new VRender({
	mode: "development",
	cwd: __basedir,
	babel: true,
	server: {
		port: 9200,
		root: "./doc/public"
	},
	router: {
		adapter: "./doc/RouterAdapter"
	}
});