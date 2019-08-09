# v-render-ui
这是一个从原 <code>v-render</code> 框架中分离出的组件库，<code>v-render</code> 框架新版本将不再内置组件。

### 使用 v-render-ui
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

const Index = VRender.PageView.extend(module, {
  renderBody: function (body) {
    Index.super(this, body);
    new VRender.UIInput(this, {
      prompt: "请输入"
    }).render(body);
  }
});
```

### 组件列表
| 名称 | 描述 |
| --- | --- |
| [UIButton](https://github.com/shicy/v-render-ui/tree/master/doc/modules/button) | 按钮 |
| [UICheckbox](https://github.com/shicy/v-render-ui/tree/master/doc/modules/checkbox) | 多选框 |
| [UICheckGroup](https://github.com/shicy/v-render-ui/tree/master/doc/modules/chkgrp) | 多选组 |
| [UIConfirm](https://github.com/shicy/v-render-ui/tree/master/doc/modules/confirm) | 确认对话框 |
| [UIContainer](https://github.com/shicy/v-render-ui/tree/master/doc/modules/container) | 边框容器 |
| [UIDatagrid](https://github.com/shicy/v-render-ui/tree/master/doc/modules/datagrid) | 数据网络 |
| [UIDateInput](https://github.com/shicy/v-render-ui/tree/master/doc/modules/dateinput) | 日期输入框 |
| [UIDatePicker](https://github.com/shicy/v-render-ui/tree/master/doc/modules/datepicker) | 日期选择器 |
| [UIDateRange](https://github.com/shicy/v-render-ui/tree/master/doc/modules/daterange) | 起止日期输入框 |
| [UIDateTime](https://github.com/shicy/v-render-ui/tree/master/doc/modules/datetime) | 日期时间输入框 |
| [UIDialog](https://github.com/shicy/v-render-ui/tree/master/doc/modules/dialog) | 对话框 |
| [UIFileUpload](https://github.com/shicy/v-render-ui/tree/master/doc/modules/fileupload) | 文件上传 |
| [UIForm](https://github.com/shicy/v-render-ui/tree/master/doc/modules/form) | 表单视图 |
| [UIGroup](https://github.com/shicy/v-render-ui/tree/master/doc/modules/group) | 组视图 |
| [UIInput](https://github.com/shicy/v-render-ui/tree/master/doc/modules/input) | 文本输入框 |
| [UIList](https://github.com/shicy/v-render-ui/tree/master/doc/modules/list) | 列表视图 |
| [UIMessage](https://github.com/shicy/v-render-ui/tree/master/doc/modules/message) | 提示框 |
| [UINotice](https://github.com/shicy/v-render-ui/tree/master/doc/modules/notice) | 通知 |
| [UIPaginator](https://github.com/shicy/v-render-ui/tree/master/doc/modules/paginator) | 分页 |
| [UIPanel](https://github.com/shicy/v-render-ui/tree/master/doc/modules/panel) | 面板 |
| [UIPopupMenu](https://github.com/shicy/v-render-ui/tree/master/doc/modules/popupmenu) | 弹出菜单 |
| [UIRadiobox](https://github.com/shicy/v-render-ui/tree/master/doc/modules/radiobox) | 单选框 |
| [UIRadioGroup](https://github.com/shicy/v-render-ui/tree/master/doc/modules/radgrp) | 单选组 |
| [UIScroll](https://github.com/shicy/v-render-ui/tree/master/doc/modules/scroll) | 滚动加载 |
| [UISelect](https://github.com/shicy/v-render-ui/tree/master/doc/modules/select) | 下拉选择框 |
| [UITabbar](https://github.com/shicy/v-render-ui/tree/master/doc/modules/tabbar) | 标签栏 |
| [UITimeInput](https://github.com/shicy/v-render-ui/tree/master/doc/modules/timeinput) | 时间输入框 |
| [UITree](https://github.com/shicy/v-render-ui/tree/master/doc/modules/true) | 树形视图 |
| [UITreeSelect](https://github.com/shicy/v-render-ui/tree/master/doc/modules/treeselect) | 树形下拉选择框 |

