## UIDialog

### Options
| name | description | default value |
| :--- | :--- | :--- |
| buttons | 按钮 | 确定、取消 |
| content | 内容 |
| fill | 是否填满对话框，即取消默认对话框内边距 | false |
| size | 尺寸，可选：`small`、`normal`、`big`、`auto` | normal |
| title | 标题 | 标题 |
| view | 同`content` |

### Extend Options
| name | description | default value |
| :--- | :--- | :--- |
| disabled | 禁用 |
| id | 组件编号 |
| name | 组件名称 |

### Methods
| method | description |
| :--- | :--- |
| close(forceClose, closedHandler) | 关闭对话框 |
| getContent() | 获取对话框内容 |
| getSize() | 获取对话框尺寸 |
| getTitle() | 获取对话框标题 |
| isFill() | 判断是否填满对话框 |
| isOpen() | 判断对话框是否已打开 |
| open() | 打开对话框 |
| setButtons(buttons) | 设置对话框底部按钮 |
| setButtonValue(name, value) | 设置（修改）按钮的文本信息 |
| setContent(value) | 设置对话框内容 |
| setFill(value) | 设置是否需要填满对话框 |
| setSize(value) | 设置对话框尺寸 |
| setTitle(value) | 设置对话框标题 |
| waiting(waitFlag, btnName) | 设置或取消等待状态 |


### Extend Methods
| method | description |
| :--- | :--- |
| destory() | 销毁组件，组件将从页面上删除 |
| getData() | 获取组件数据（集） |
| getDataAdapter() | 获取数据（集）适配器 |
| getDataMapper() | 获取数据（集）映射方法 |
| getInitParams() | 获取初始化参数 |
| getViewId() | 获取组件唯一编号 |
| isDisabled() | 判断组件是否被禁用 |
| isLoading() | 当前组件是否正在加载远程数据（集） |
| isMounted() | 判断组件是否已添加到页面 |
| load(api, params, callback) | 加载远程数据（集） |
| reload() | 重新加载数据（集） |
| rerender() | 重新渲染组件 |
| setDisabled(disabled) | 禁用或启用组件 |
| setDataAdapter(value) | 设置数据（集）适配器 |
| setDataMapper(value) | 设置数据（集）映射方法 |
| setVisible(visible) | 显示或隐藏组件 |

### Events
| name | description | params |
| :--- | :--- | :--- |
| closed | 对话框关闭之后 |
| btnclk | 对话框按钮点击时 |
| btn_[btnName] | 某个对话框按钮点击时 |
| opened | 打开对话框时 |
| view_submit | 对话框内容派发`submit_to_dialog`时 |

### Events For Content
| name | description | params |
| :--- | :--- | :--- |
| dialog_btn_[btnName] | 某个按钮点击时 |
| dialog_close | 关闭对话框时 |
| dialog_open | 打开对话框时 |
