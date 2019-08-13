
$ref("dialog_btn3").on("tap", function (e) {
	var contentView = UIGroup.create();
	var closeBtn = contentView.add(UIButton.create({name: "close", label: "点击5秒后关闭对话框", type: "danger"}));

	var buttons = [];
	buttons.push({name: "cancel", label: "取消", type: "cancel"});
	buttons.push({name: "reset", label: "重置", type: "info"});
	buttons.push({name: "ok", label: "保存", type: "primary", waitclose: true});
	// buttons.push({name: "close", label: "5秒后关闭对话框", type: "danger", waitclose: 5000});

	var dialog = UIDialog.create({buttons: buttons, content: contentView}).open();

	dialog.on("btnclk", function (e, name) {
		contentView.append('<div>统一事件“btnclk”，按钮名称：' + name + '</div>');
	});

	dialog.on("btn_ok", function (e) {
		contentView.append('<div>点击了“保存”按钮..</div>');
		setTimeout(function () {
			dialog.waiting(false, 'ok');
		}, 2000);
	});

	dialog.on("btn_cancel", function (e) {
		contentView.append('<div>点击了“取消”按钮..（因为有事件绑定所以不自动关闭了）</div>');
	});

	closeBtn.on("tap", function (e) {
		contentView.append('<div>5秒后关闭对话框</div>');
		var seconds = 5;
		var timerId = setInterval(function () {
			if (--seconds <= 0) {
				clearInterval(timerId);
				dialog.close();
			}
			else {
				closeBtn.setLabel(seconds + "秒后关闭对话框");
			}
		}, 1000);
	});
});
