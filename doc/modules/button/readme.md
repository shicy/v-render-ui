## UIButton

### Options
| name | description | default value |
| :--- | :--- | :--- |
| icon | 图标，可以是`url`或`true`，当`icon`为`true`时自动按照`type`属性显示相应图标 |
| label | 显示文本 |
| link | 按钮点击时的链接地址 |
| items | 组合按钮，点击按钮时下拉显示对个子按钮。格式为：`[{name, label}]` |
| size | 大小，可选：`tiny`、 `small`、 `normal`、 `big`、 `bigger` | normal |
| toggle | 当`toggle`为`true`时，按钮可切换选中和未选中状态 | false |
| type | 类型，和样式相关，可选：`primary`、 `error`、 `success`、 `warn`、 `info`、 `text`、 `link`等 |
| waiting | 按钮是否为等待状态 | false |
| waitTime | 按钮默认等待时间，单位毫秒。为`true`或`<0`时无限等待（需要手动取消） |

### Extend Options
| name | description | default value |
| :--- | :--- | :--- |
| disabled | 禁用 |
| id | 组件编号 |
| name | 组件名称 |

### Methods
| method | description |
| :--- | :--- |
| getLabel() | 获取按钮显示文本内容 |
| isWaiting() | 判断按钮是否处于等待状态 |
| setLabel(value) | 设置按钮显示文本内容<br>-`value`: `string` |
| setWaiting(time) | 设置按钮默认等待的毫秒数（非开启等待），当`waiting()`参数为`true`、`undefined`时默认获取该参数值 |
| waiting(time) | 使按钮等待或取消等待，`time==0`时取消等待，`time<0`时无限等待，`time>0`时将等待`time`毫秒后自动取消等待，`time`为`true`或`undefined`时获取`setWaiting()`方法设置的值，默认为`-1`<br>-`time`: `number` \| `boolean` \| `undefined` |

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
| tap | 按钮点击时 | `name`: 按钮名称 |