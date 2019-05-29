const Path = require("path");
const FileSys = require("fs");
const Process = require("process");
const Gulp = require("gulp");
const GulpConcat = require("gulp-concat");
const GulpBabel = require("gulp-babel");
const GulpUglify = require("gulp-uglify");
const GulpRename = require("gulp-rename");
const GulpCleanCss = require("gulp-clean-css");

const isDevelopment = Process.env.NODE_ENV == "development";
const distDir = Path.resolve(__dirname, "./dist");

console.log("build start.. mode=%s", Process.env.NODE_ENV);

const version = (function () {
	let dt = new Date();
	let year = dt.getFullYear() - 2000;
	let month = dt.getMonth() + 1;
	let date = dt.getDate();
	year = (year < 10 ? "0" : "") + year;
	month = (month < 10 ? "0" : "") + month;
	date = (date < 10 ? "0" : "") + date;
	return "" + year + month + date;
})();

///////////////////////////////////////////////////////////
function clean(callback) {
	if (!isDevelopment) {
		FileSys.readdirSync(distDir).forEach(file => {
			let filePath = distDir + Path.sep + file;
			FileSys.unlinkSync(filePath);
		});
	}
	callback();
};

function buildJs() {
	let jsFiles = [];
	jsFiles.push("src/static/js/init.js");
	jsFiles.push("src/static/js/base.js");
	jsFiles.push("src/static/js/items.js");
	jsFiles.push("src/static/js/selectable.js");

	jsFiles.push("src/components/group/render.js");
	jsFiles.push("src/components/button/render.js");
	jsFiles.push("src/components/checkbox/render.js");

	let result = Gulp.src(jsFiles)
		.pipe(GulpBabel({presets: ["@babel/env"]}))
		.pipe(GulpConcat("vrender-ui.js"))
		.pipe(Gulp.dest(distDir));
	if (!isDevelopment) {
		result = result.pipe(GulpUglify({compress: {pure_funcs: ["console.log"]}}))
			.pipe(GulpRename({basename: "vrender-ui." + version + ".min"}))
			.pipe(Gulp.dest(distDir));
	}
	return result;
}

function buildCss_p(callback) {
	let cssFiles = [];
	cssFiles.push("src/static/css/style.p.css");
	cssFiles.push("src/components/**/*.p.css");

	let result = Gulp.src(cssFiles)
		.pipe(GulpConcat("vrender-ui.p.css"))
		.pipe(Gulp.dest(distDir));
	if (!isDevelopment) {
		result = result.pipe(GulpCleanCss())
			.pipe(GulpRename({basename: "vrender-ui." + version + ".min.p"}))
			.pipe(Gulp.dest(distDir));
	}
	return result;
}

function buildCss_m(callback) {
	let cssFiles = [];
	cssFiles.push("src/static/css/style.m.css");
	cssFiles.push("src/components/**/*.m.css");

	let result = Gulp.src(cssFiles)
		.pipe(GulpConcat("vrender-ui.m.css"))
		.pipe(Gulp.dest(distDir));
	if (!isDevelopment) {
		result = result.pipe(GulpCleanCss())
			.pipe(GulpRename({basename: "vrender-ui." + version + ".min.m"}))
			.pipe(Gulp.dest(distDir));
	}
	return result;
}

function final(callback) {
	if (!isDevelopment) {
		let indexFile = Path.resolve(__dirname, "./index.js");
		let indexFileData = FileSys.readFileSync(indexFile, {encoding: "utf-8"});
		indexFileData = indexFileData.replace(
			/const distVersion = "(\d){6}";/,
			"const distVersion = \"" + version + "\";");
		FileSys.writeFileSync(indexFile, indexFileData);
	}
	callback();
}

function build() {
	return Gulp.series(
		clean,
		Gulp.parallel(
			buildJs,
			buildCss_p,
			buildCss_m
		),
		final
	);
}

///////////////////////////////////////////////////////////
exports.default = build();

exports.watch = function () {
	Gulp.watch("src/components/**", {delay: 1000, ignoreInitial: false}, build());
};
