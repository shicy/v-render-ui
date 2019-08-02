## UIConfirm

### Options
| name | description | default value |
| :--- | :--- | :--- |
| cancelLabel | 取消按钮显示文本 | 取消 |
| confirmLabel | 确认按钮显示文本 | 确认 |
| content | 内容 |
| focusHtmlContent | 富文本内容，支持HTML源码 |
| title | 标题 |

### Extend Options
| name | description | default value |
| :--- | :--- | :--- |
| data | 数据（集） |
| disabled | 禁用 |
| id | 组件编号 |
| name | 组件名称 |

### Methods
| method | description |
| :--- | :--- |
| close() | 关闭确认对话框 |
| open() | 打开确认对话框，默认新建就立即打开了 |
| onSubmit(handler) | 添加点击“确认”按钮的回调方法 |
| onCancel(handler) | 添加点击“取消”按钮的回调方法 |

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
| cancel | 点击“取消”按钮时 |
| close | 关闭时 |
| submit | 点击“确认”按钮时 |