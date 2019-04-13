// 2019-04-13

var view = $(".module-view");

view.on("tap", ".expand", (e) => {
	$(e.currentTarget).parent().toggleClass("open");
});
