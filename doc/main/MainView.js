// 2019-03-25

var VRender = require(__vrender);


var MainView = VRender.PageView.extend(module, {
	doInit: function (done) {
		MainView.super(this, () => {
			setTimeout(() => {
				this.val = "00000000000"
				done();
			}, 1000);
		});
	},

	renderBody: function (body) {
		MainView.super(this, body);
		body.text("Welcome!" + this.val);
	}
});
