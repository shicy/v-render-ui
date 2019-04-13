// 2019-04-09

const Prism = require("prismjs");
const VRender = require(__vrender);


const $ = VRender.$;
const Utils = VRender.Utils;
const UIGroup = VRender.UIGroup;

const BaseModule = VRender.Fragment.extend(module, {
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
	if (desc) {
		$(".description").appendTo(target).append(desc);
	}
	if (code) {
		code = Prism.highlight(code, Prism.languages.javascript);
		$(".source").appendTo(target)
			.append($("pre").write(code))
			.append($(".expand").append("<i></i>"));
	}
};
