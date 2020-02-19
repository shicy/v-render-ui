// 2019-06-10
// upload（原fileupload）

(function (frontend) {
	if (frontend && VRender.Component.ui.upload)
		return ;

	const UI = frontend ? VRender.Component.ui : require("../../static/js/init");
	const Fn = UI.fn, Utils = UI.util;

	///////////////////////////////////////////////////////
	const UIUpload = UI.upload = function (view, options) {
		return UI._base.call(this, view, options);
	};
	const _UIUpload = UIUpload.prototype = new UI._base(false);

	_UIUpload.init = function (target, options) {
		UI._base.init.call(this, target, options);

		this.$el.on("change", "input", onFileChangeHandler.bind(this));

		let browser = this.getBrowser();
		if (browser)
			browser.on("click.upload", onBrowserClickHandler.bind(this));
	};

	// ====================================================
	_UIUpload.browser = function () {
		this.$el.children("input").click();
	};

	_UIUpload.remove = function (localId) {
		Utils.removeBy(this.files, "localId", localId);
	};

	_UIUpload.clear = function () {
		this.files = [];
	};

	_UIUpload.upload = function (action, params, callback) {
		if (this.isUploading)
			return false;

		if (Utils.isFunction(action)) {
			callback = action;
			action = params = null;
		}
		else if (Utils.isFunction(params)) {
			callback = params;
			params = null;
		}
		if (Utils.isBlank(action))
			action = this.getAction();

		if (Utils.isBlank(action)) {
			showError("上传失败：缺少 Action 信息！");
			return false;
		}

		if (this.files && this.files.length > 0) {
			this.isUploading = true;
			doUpload.call(this, action, params, (err, ret) => {
				this.isUploading = false;
				if (Utils.isFunction(callback))
					callback(err, ret);
			});
		}
		else {
			if (Utils.isFunction(callback))
				callback("没有文件信息");
			return false;
		}
	};

	_UIUpload.cancel = function () {
		this.isUploading = false;
		Utils.each(this.files, (file) => {
			if (file.uploader) {
				file.uploader.abort();
				file.uploader = null;
			}
		});
	};

	_UIUpload.isEmpty = function () {
		return !this.files || this.files.length == 0;
	};

	// ====================================================
	_UIUpload.getAction = function () {
		return this.$el.attr("opt-action");
	};
	_UIUpload.setAction = function (value) {
		this.$el.attr("opt-action", Utils.trimToEmpty(value));
	};

	_UIUpload.getParams = function () {
		if (this.options.hasOwnProperty("params"))
			return this.options.params;
		let params = null;
		try {
			params = JSON.parse(this.$el.attr("opt-params"));
		}
		catch (e) {};
		this.options.params = params;
		return this.options.params;
	};
	_UIUpload.setParams = function (value) {
		this.options.params = value;
		this.$el.removeAttr("opt-params");
	};

	_UIUpload.getUploadName = function () {
		return Utils.trimToNull(this.$el.attr("opt-upload")) || "file";
	};
	_UIUpload.setUploadName = function (value) {
		this.$el.attr("opt-upload", Utils.trimToEmpty(value));
	};

	_UIUpload.getBrowser = function () {
		if (this.hasOwnProperty("browserBtn"))
			return this.browserBtn;
		if (this.options.hasOwnProperty("browser"))
			return this.options.browser;
		let browser = this.$el.attr("opt-browser");
		this.$el.removeAttr("opt-browser");
		this.browserBtn = Utils.isBlank(browser) ? null : $(browser);
		return this.browserBtn;
	};
	_UIUpload.setBrowser = function (value) {
		let browser = this.getBrowser();
		if (browser) {
			browser.off("click.upload");
		}

		this.browserBtn = Utils.isBlank(value) ? null : (value.$el || $(value));
		this.options.browser = null;
		this.$el.removeAttr("opt-browser");

		initBrowserHandler.call(this, this.browserBtn);
		if (this.browserBtn) {
			this.browserBtn.on("click.upload", onBrowserClickHandler.bind(this));
		}
	};

	_UIUpload.getFilter = function () {
		return this.$el.attr("opt-filter");
	};
	_UIUpload.setFilter = function (value) {
		this.$el.attr("opt-filter", Utils.trimToEmpty(value));

		let input = this.$el.children("input");
		let accept = getAccept.call(this);
		if (accept)
			input.attr("accept", accept);
		else
			input.removeAttr("accept");
	};

	_UIUpload.getLimit = function () {
		return parseInt(this.$el.attr("opt-limit")) || 0;
	};
	_UIUpload.setLimit = function (value) {
		if (value && !isNaN(value))
			this.$el.attr("opt-limit", value);
		else
			this.$el.removeAttr("opt-limit");
	};

	_UIUpload.isMultiple = function () {
		return this.$el.children("input").attr("multiple") == "multiple";
	};
	_UIUpload.setMultiple = function (value) {
		let input = this.$el.children("input");
		if (Utils.isNull(value) || Utils.isTrue(value))
			input.attr("multiple", "multiple");
		else
			input.removeAttr("multiple");
	};

	_UIUpload.isAutoUpload = function () {
		return this.$el.attr("opt-auto") == 1;
	};
	_UIUpload.setAutoUpload = function (value) {
		if (Utils.isNull(value) || Utils.isTrue(value))
			this.$el.attr("opt-auto", "1");
		else
			this.$el.removeAttr("opt-auto");
	};

	_UIUpload.isMixed = function () {
		return this.$el.attr("opt-mixed") == 1;
	};
	_UIUpload.setMixed = function (value) {
		if (Utils.isNull(value) || Utils.isTrue(value))
			this.$el.attr("opt-mixed", "1");
		else
			this.$el.removeAttr("opt-mixed");
	};

	// ====================================================
	const onBrowserClickHandler = function () {
		if (this.isUploading) {
			showError("正在上传，请稍候..");
		}
		else {
			this.browser();
		}
	};

	const onFileChangeHandler = function (e) {
		let input = $(e.currentTarget);
		
		let files = validateFiles.call(this, input[0].files);
		if (!files || files.length == 0)
			return ;
		
		let fileLocalId = Date.now();
		let multiple = input.attr("multiple") == "multiple";
		if (multiple) {
			this.files = Utils.toArray(this.files);
			for (let i = 0; i < files.length; i++) {
				files[i].localId = fileLocalId++;
				this.files.push(files[i]);
			}
		}
		else {
			files[0].localId = fileLocalId++;
			this.files = [files[0]];
		}

		input.remove();
		let newInput = $("<input type='file'/>").appendTo(this.$el);
		if (multiple)
			newInput.attr("multiple", "multiple");
		newInput.attr("accept", input.attr("accept"));

		this.trigger("change", this.files);

		if (this.isAutoUpload()) {
			if (Utils.isNotBlank(this.getAction()))
				this.upload();
		}
	};

	const uploadSuccessHandler = function (e, file, callback) {
		file[0].uploader = null;
		callback(file.errorMsg, file.resultMsg);
	};

	// 好像不会进这里来
	const uploadErrorHandler = function (e, file, callback) {
		file[0].uploader = null;
		callback(e);
	};

	const uploadStateHandler = function (e, file) {
		let xhr = file[0].uploader;
		if (xhr.readyState == 4) {
			let data = xhr.responseText;
			if (data) {
				try {
					data = JSON.parse(data);
				}
				catch (e) {}
			}
			if (xhr.status == 200) {
				file.resultMsg = data || xhr.responseText;
			}
			else { // 出错了，出错会进入 onload
				console.error(xhr.responseText);
				file.errorMsg = data || xhr.responseText || "文件上传失败！";
			}
		}
	};

	const uploadProgressHandler = function (e, file) {
		this.totalSend += e.loaded;
		if (this.totalSend > this.totalSize)
			this.totalSend = this.totalSize;
		this.trigger("progress", file, this.totalSend, this.totalSize);
	};
	
	///////////////////////////////////////////////////////
	const Renderer = function (context, options) {
		UI._baseRender.call(this, context, options);
	};
	const _Renderer = Renderer.prototype = new UI._baseRender(false);

	_Renderer.render = function ($, target) {
		UI._baseRender.render.call(this, $, target);
		target.addClass("ui-upload").css("display", "none");

		let options = this.options || {};

		target.attr("opt-action", Utils.trimToNull(options.action));
		target.attr("opt-upload", Utils.trimToNull(options.uploadName));
		target.attr("opt-filter", this.getFilter());
		target.attr("opt-limit", this.getLimit() || null);
		target.attr("opt-auto", this.isAutoUpload() ? "1" : null);
		target.attr("opt-mixed", this.isMixed() ? "1" : null);

		target.attr("opt-browser", this.getBrowser());

		renderInputView.call(this, $, target);

		if (!frontend) {
			if (options.params) {
				target.attr("opt-params", JSON.stringify(options.params));
			}
		}

		return this;
	};

	// ====================================================
	_Renderer.getBrowser = function () {
		if (!frontend) {
			let browser = this.options.browser;
			if (browser) {
				if (typeof browser == "string")
					return browser;
				if (Utils.isFunction(browser.getViewId))
					return "[vid='" + browser.getViewId() + "']";
			}
		}
		return null;
	};

	_Renderer.getFilter = function () {
		return Utils.trimToNull(this.options.filter);
	};

	_Renderer.getLimit = function () {
		return Math.max(0, parseInt(this.options.limit)) || 0;
	};

	_Renderer.isMultiple = function () {
		return Fn.isMultiple.call(this);
	};

	_Renderer.isAutoUpload = function () {
		if (this.options.hasOwnProperty("autoUpload"))
			return Utils.isTrue(this.options.autoUpload);
		return true;
	};

	_Renderer.isMixed = function () {
		return Utils.isTrue(this.options.mixed);
	};

	// ====================================================
	const renderInputView = function ($, target) {
		let input = $("<input type='file'/>").appendTo(target);

		if (this.isMultiple())
			input.attr("multiple", "multiple");

		input.attr("accept", Utils.trimToNull(getAccept.call(this)));
	};

	///////////////////////////////////////////////////////
	const validateFiles = function (files) {
		let filter = Utils.trimToNull(this.getFilter());
		if (filter) {
			if (/image|audio|video|excel|word|powerpoint|text/.test(filter))
				filter = null;
			else
				filter = filter.split(",");
		}
		let limit = this.getLimit();
		if (filter || limit > 0) {
			for (let i = 0; i < files.length; i++) {
				let file = files[i];
				if (filter) {
					let ext = file.name.split(".");
					ext = ext[ext.length - 1];
					let match = Utils.index(filter, function (tmp) {
						return Utils.endWith(tmp, ext);
					});
					if (match < 0) {
						showError("文件类型错误：" + file.name);
						return false;
					}
				}
				if (limit > 0) {
					if (limit < file.size) {
						showError("允许文件大小上限为：" + getFormatSize(limit));
						return false;
					}
				}
			}
		}
		return files;
	};

	const doUpload = function (action, params, callback) {
		let totalSize = 0;
		Utils.each(this.files, (file) => {
			totalSize += file.size;
			file.state = 0; // 初始化
		});
		this.totalSize = totalSize;
		this.totalSend = 0;

		let apiName = getActionName.call(this, action);
		uploadFiles.call(this, apiName, params, this.files, (err, ret) => {
			if (!err) {
				this.files = null;
				this.trigger("success", ret);
			}
			else {
				this.trigger("error", err);
			}
			if (Utils.isFunction(callback)) {
				callback(err, ret);
			}
		});
	};

	const doUploadBefore = function (file, params, callback) {
		let event = {type: "upload-before"};
		this.trigger(event, file, params);
		if (event.isPreventDefault) {
			callback("canceled");
		}
		else {
			callback();
		}
	};

	const uploadFiles = function (api, params, files, callback) {
		let getUploadParams = (index, file) => {
			let _params = params;
			if (params && Utils.isFunction(params.handler)) {
				_params = params.handler(index, file);
			}
			return Utils.extend({}, this.getParams(), _params);
		};
		if (files.length == 1 || this.isMixed()) {
			Utils.each(files, function (file) {
				file.state = 1; // 正在上传
			});
			let _params = getUploadParams(0, files); 
			uploadFile.call(this, api, _params, files, (err, ret) => {
				let localIds = [];
				Utils.each(files, (file) => {
					file.state = !err ? 2 : 3; // 成功、失败
					localIds.push(file.localId);
				});
				ret = ret || {};
				ret.localId = localIds.join(",");
				callback(err, ret);
			});
		}
		else {
			let errors = [];
			let results = [];
			let loop = (index) => {
				if (index < files.length) {
					let file = files[index];
					if (file.state == 0) {
						file.state == 1;
						let _params = getUploadParams(index, file);
						uploadFile.call(this, api, _params, [file], (err, ret) => {
							if (!err) {
								file.state = 2;
								ret.localId = file.localId;
								results.push(ret);
							}
							else {
								file.state = 3;
								errors.push(err);
							}
							loop(index + 1);
						});
					}
					else {
						loop(index + 1);
					}
				}
				else {
					if (errors.length == 0)
						errors = null;
					callback(errors, results);
				}
			};
			loop(0);
		}
	};

	const uploadFile = function (api, params, file, callback) {
		let xhr = createHttpRequest();
		if (!xhr) {
			callback("当前浏览器版本较低，不支持该上传功能。或者使用其他浏览器（如：chrome）。");
		}
		else {
			params = Utils.extend({}, params);
			doUploadBefore.call(this, file, params, (error) => {
				if (!error) {
					file[0].uploader = xhr;
					xhr.open("POST", api, true);

					xhr.onload = (e) => { uploadSuccessHandler.call(this, e, file, callback); };
					xhr.onerror = (e) => { uploadErrorHandler.call(this, e, file, callback); };
					xhr.onreadystatechange = (e) => { uploadStateHandler.call(this, e, file); };
					xhr.upload.onprogress = (e) => { uploadProgressHandler.call(this, e, file); };

					let form = new FormData();
					let uploadName = this.getUploadName();
					Utils.each(file, (temp) => {
						form.append(uploadName, temp);
						form.append("filename", temp.name);
					});
					for (let n in params) {
						form.append(n, params[n]);
					}

					xhr.send(form);
				}
				else if (error == "canceled") {
					callback("已取消");
				}
				else {
					callback(error);
				}
			});
		}
	};

	const createHttpRequest = function () {
		if (window.XMLHttpRequest)
			return new XMLHttpRequest();

		if (window.ActiveXObject)
			return new ActiveXObject("Microsoft.XMLHTTP");

		// setTimeout(function () {
		// 	showError("当前浏览器版本较低，不支持该上传功能。或者使用其他浏览器（如：chrome）。", 60000);
		// }, 500);

		return false;
	};

	// ====================================================
	const getActionName = function (action) {
		if (/^(\/|http)/.test(action))
			return action;
		return "/upload?n=" + action;
	};

	const getAccept = function () {
		let filter = this.getFilter();
		if (filter) {
			if (filter == "image")
				return "image/*";
			if (filter == "audio")
				return "audio/*";
			if (filter == "video")
				return "video/*";
			if (filter == "excel") {
				// ".xls,.xlsx,.xlt,.xla"
				return "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
			}
			if (filter == "word") {
				// ".doc,.docx,.dot"
				return "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
			}
			if (filter == "powerpoint") {
				// ".ppt,.pptx,.pps,.pot,.ppa"
				return "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";
			}
			if (filter == "text")
				return "text/*";
		}
		return filter;
	};

	const getFormatSize = function (value) {
		value = parseInt(value);
		if (value && value > 0) {
			if (value < 1024)
				return value + "B";
			value /= 1024;
			if (value < 1024)
				return value.toFixed(2) + "KB";
			value /= 1024;
			if (value < 1024)
				return value.toFixed(2) + "MB";
			value /= 1024;
			if (value < 1024)
				return value.toFixed(2) + "GB";
			value /= 1024;
			return value.toFixed(2) + "TB";
		}
		return "";
	};

	const showError = function (message, duration) {
		UI.message.create({type: "danger", content: message, duration: duration});
	};

	///////////////////////////////////////////////////////
	if (frontend) {
		window.UIUpload = UIUpload;
		UI.init(".ui-upload", UIUpload, Renderer);
	}
	else {
		module.exports = Renderer;
	}
})(typeof window !== "undefined");