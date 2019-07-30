
$ref("message_btn1").on("tap", function (e) {
	new UIMessage({content: '这是一条消息提示。默认3秒后关闭'});
});


$ref("message_btn21").on("tap", function (e) {
	new UIMessage({content: '默认提示框'});
});

$ref("message_btn22").on("tap", function (e) {
	new UIMessage({content: '成功信息', type: 'success'});
});

$ref("message_btn23").on("tap", function (e) {
	new UIMessage({content: '失败、错误信息', type: 'danger'});
});

$ref("message_btn24").on("tap", function (e) {
	new UIMessage({content: '警告信息', type: 'warn'});
});

$ref("message_btn25").on("tap", function (e) {
	new UIMessage({content: '消息信息', type: 'info'});
});


$ref("message_btn31").on("tap", function (e) {
	new UIMessage({content: '默认提示信息等待3秒钟'});
});

$ref("message_btn32").on("tap", function (e) {
	new UIMessage({content: '自定义等待30秒后关闭', duration: 30000});
});

$ref("message_btn33").on("tap", function (e) {
	new UIMessage({content: '改消息不会自动关闭，请点击关闭按钮', duration: 0});
});


$ref("message_btn41").on("tap", function (e) {
	new UIMessage({content: '改消息不可手动关闭，10秒钟后自动关闭', duration: 10000, closable: false});
});


$ref("message_btn51").on("tap", function (e) {
	new UIMessage({focusHtmlContent: '<strong>这里也可以是<i>富文本</i>内容</strong>'});
});


$ref("message_btn61").on("tap", function (e) {
	new UIMessage({content: '自定义图标', icon: '/icons/b04.png'});
});
