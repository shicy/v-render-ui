## UIButton

### Properties
| name | description | default value |
| :--- | :--- | :--- |
| disabled | 禁用 |
| icon | 图标，可以是`url`或`true`，当`icon`为`true`时自动按照`type`属性显示相应图标 |
| label | 显示文本 |
| link | 按钮点击时的链接地址 |
| items | 组合按钮，点击按钮时下拉显示对个子按钮。格式为：`[{name, label}]` |
| name | 按钮名称 |
| size | 大小，可选：`tiny`、 `small`、 `normal`、 `big`、 `bigger` | normal |
| toggle | 当`toggle`为`true`时，按钮可切换选中和未选中状态 | false |
| type | 类型，和样式相关，可选：`primary`、 `error`、 `success`、 `warn`、 `info`、 `text`、 `link`等 |
| waiting | 按钮是否为等待状态 | false |
| waitTime | 按钮默认等待时间，单位毫秒。为`true`或`<0`时无限等待（需要手动取消） |

### Methods
| method | description |
| :--- | :--- |
| getLabel():string | 获取按钮显示文本内容 |
| isWaiting():boolean | 判断按钮是否处于等待状态 |
| setLabel(value):void | 设置按钮显示文本内容<br>-`value`: `string` |
| setWaiting(time) | 设置按钮默认等待的毫秒数（非开启等待），当`waiting()`参数为`true`、`undefined`时默认获取该参数值 |
| waiting(time):void | 使按钮等待或取消等待，`time==0`时取消等待，`time<0`时无限等待，`time>0`时将等待`time`毫秒后自动取消等待，`time`为`true`或`undefined`时获取`setWaiting()`方法设置的值，默认为`-1`<br>-`time`: `number` \| `boolean` \| `undefined` |

### Events
| name | description | params |
| :--- | :--- | :--- |
| tap | 按钮点击时 | `name`: 按钮名称 |