## UIDateTime

### Options
| name | description | default value |
| :--- | :--- | :--- |
| date | 默认选中日期 |
| dateFormat | 日期格式化 | yyyy-MM-dd |
| format | 同`dateFormat` |
| hours | 可选的小时 |
| max | 可选的最后日期 |
| min | 可选的最前日期 |
| minutes | 可选的分钟 |
| prompt | 输入框提示信息 |
| seconds | 可选的秒钟 |
| showSecond | 是否显示秒 | false |

### Extend Options
| name | description | default value |
| :--- | :--- | :--- |
| disabled | 禁用 |
| id | 组件编号 |
| name | 组件名称 |

### Methods
| method | description |
| :--- | :--- |
| getDate(format) | 获取当前选中日期 |
| getDateFormat() | 获取日期格式化表达式或方法 |
| getHours() | 获取可选择的小时 |
| getMaxDate() | 获取可选的最后日期 |
| getMinDate() | 获取可选的最前日期 |
| getMinutes() | 获取可选择的分钟 |
| getPrompt() | 获取输入框提示信息 |
| getSeconds() | 获取可选择的秒钟 |
| isSecondVisible() | 判断是否显示秒 |
| setDate(value) | 设置当前选中日期 |
| setDateFormat(value) | 设置日期格式化表达式或方法 |
| setHours(value) | 设置可选择的小时 |
| setMaxDate(value) | 设置可选的最后日期 |
| setMinDate(value) | 设置可选的最前日期 |
| setMinutes(value) | 设置可选择的分钟 |
| setPrompt(value) | 设置输入框提示信息 |
| setSeconds(value) | 设置可选择的秒钟 |
| setSecondVisible(value) | 显示或隐藏秒 |
| val([value, options]) | 设置或获取当前选中的日期<br>当参数`value`为`null`或`undefined`时，返回当前选中的日期，此时参数`options`可以指定返回的日期格式，如：`{format:'yyyy.MM.dd'}`<br>当参数`value`为日期时设置组件选中的日期 |

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
| change | 日期变更时 |
