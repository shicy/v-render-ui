// 2019-04-09

const Prism = require("prismjs");
const VRender = require(__vrender);


const $ = VRender.$;
const Utils = VRender.Utils;
const UIGroup = VRender.UIGroup;

const BaseModule = VRender.Fragment.extend(module, {
	doInit: function (done) {
		BaseModule.super(this, () => {
			this.isApp = this.isRenderAsApp();
			this.suggestOrientation = this.isApp ? UIGroup.VERTICAL : UIGroup.HORIZONTIAL;
			done && done();
		});
	},

	getTitle: function () {
	},

	renderView: function () {
		BaseModule.super(this);

		let target = this.$el.addClass("module-view");

		let title = this.getTitle();
		if (Utils.isNotBlank(title))
			$(".module-title").appendTo(target).text(title);

		let demo = $(".module-group").appendTo(target);
		this.renderDemos(demo, (view, code, desc, title) => {
			addDemo(demo, view, code, desc, title);
		});
	},

	renderDemos: function (target, render) {
		$(".title").appendTo(target).text("代码事例（Demo）");
	}
});

const addDemo = function (target, view, code, desc, title) {
	target = $(".module-demo").appendTo(target);
	if (view) {
		new UIGroup(this, {cls: "preview"}).append(view).render(target);
	}
	desc = Utils.isArray(desc) ? desc.join("<br/>") : desc;
	if (desc) {
		desc = desc.replace(/\<\>([^\<]*)\<\/\>/g, (a, b) => { return `<code>${b}</code>`; });
		$(".description").appendTo(target).append(desc);
	}
	code = Utils.isArray(code) ? code.join("\n") : code;
	if (code) {
		code = Prism.highlight(code, Prism.languages.javascript);
		var source = $(".source").appendTo(target)
			.append($("pre").write(code));
		if (view || desc) {
			source.append($(".expand").append("<i></i>"));
		}
		else {
			source.addClass("open");
		}
	}
};
