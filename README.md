# v-render-ui
这是一个从原 <code>v-render</code> 框架中分离出的组件库，<code>v-render</code> 框架新版本将不再内置组件。

## 使用 v-render-ui
##### 安装
```javascript
npm i v-render-ui --save
```
##### 引入
```javascript
const Path = require("path");
const VRender = require("v-render");

VRender.use(require("v-render-ui"));

// 配置路由信息...

new VRender({
	cwd: Path.resolve(__dirname, "./")
});
```
##### 使用（如：index页面【Index.js】）
```javascript
const VRender = require("v-render");
const UIInput = VRender.UIInput;
const Index = VRender.PageView.extend(module, {
	renderBody: function (body) {
		Index.super(this, body);
		new UIInput(this, {
			prompt: "请输入"
		}).render(body);
	}
});
```

## 组件列表
| 名称 | 描述 |
| --- | --- |
| UIButton | 按钮 |
| UICheckbox | 多选框 |
| UICheckGroup | 多选组 |
| UIConfirm | 确认对话框 |
| UIContainer | 边框容器 |
| UIDatagrid | 数据网络 |
| UIDateInput | 日期输入框 |
| UIDatePicker | 日期选择器 |
| UIDateRange | 起止日期输入框 |
| UIDateTime | 日期时间输入框 |
| UIDialog | 对话框 |
| UIFileUpload | 文件上传 |
| UIForm | 表单视图 |
| UIGroup | 组视图 |
| UIInput | 文本输入框 |
| UIList | 列表视图 |
| UIMessage | 提示框 |
| UINotice | 通知 |
| UIPaginator | 分页 |
| UIPanel | 面板 |
| UIPopupMenu | 弹出菜单 |
| UIRadiobox | 单选框 |
| UIRadioGroup | 单选组 |
| UIScroll | 滚动加载 |
| UISelect | 下拉选择框 |
| UITabbar | 标签栏 |
| UITimeInput | 时间输入框 |
| UITree | 树形视图 |
| UITreeSelect | 树形下拉选择框 |

