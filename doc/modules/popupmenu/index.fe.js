
$ref("menu8").on("open_before", function (e, data, subDatas) {
	if (!data)
		return ;
	var level = (parseInt(data.level) || 0) + 1;
	if (!(subDatas && subDatas.length > 0)) {
		subDatas = [];
		for (var i = 0; i < level; i++) {
			var _data = {};
			_data.name = data.name + i;
			_data.label = data.label + "-" + i;
			_data.level = level;
			if (level < 5)
				_data.children = [];
			subDatas.push(_data);
		}
		e.returnValue = subDatas;
	}
});
