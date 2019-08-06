## UIDateInput

### Options
| name | description | default value |
| :--- | :--- | :--- |
| container | 滚动容器内，用于优化下拉框显示位置 |
| hours | 可选的小时 |
| max | 可选的最迟时间 |
| min | 可选的最早时间 |
| minutes | 可选的分钟 |
| readonly | 是否只读 |
| seconds | 可选的秒钟 |
| showSecond | 是否显示秒 | false |
| prompt | 输入框提示信息 |
| time | 默认选中时间 |
| use12Hour | 是否使用12小时制 | false |

### Extend Options
| name | description | default value |
| :--- | :--- | :--- |
| apiName | 接口名称 |
| apiParams | 接口默认参数 |
| cls | 组件样式 |
| data | 数据（集） |
| dataAdapter | 数据转换适配器 |
| dataMapper | 数据绑定映射器 |
| disabled | 禁用 |
| id | 组件编号 |
| mapper | 同`dataMapper` |
| name | 组件名称 |
| style | 组件分格，类似与属性`cls`，但应更具有内在意义 |

### Methods
| method | description |
| :--- | :--- |
| getHours() | 获取可选择的小时 |
| getMaxTime() | 获取可选中的最迟时间 |
| getMinTime() | 获取可选择的最早时间 |
| getMinutes() | 获取可选择的分钟 |
| getSeconds() | 获取可选择的秒钟 |
| getTime() | 获取当前选中时间 |
| getPrompt() | 获取占位符 |
| isReadonly() | 判断是否只读 |
| isSecondVisible() | 判断是否显示秒 |
| isUse12Hour() | 判断是否使用12小时制 |
| setHours(value) | 设置可选择的小时 |
| setMaxTime(value) | 设置可选中的最迟时间 |
| setMinTime(value) | 设置可选择的最早时间 |
| setMinutes(value) | 设置可选择的分钟 |
| setPrompt(value) | 设置占位符 |
| setReadonly(value) | 设置是否只读 |
| setSeconds(value) | 设置可选择的秒钟 |
| setSecondVisible(value) | 设置是否显示秒 |
| setTime(value) | 设置当前选中时间 |
| setUse12Hour(value) | 设置是否使用12小时制 |

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
| setData(value) | 设置组件数据（集） |
| setDisabled(disabled) | 禁用或启用组件 |
| setDataAdapter(value) | 设置数据（集）适配器 |
| setDataMapper(value) | 设置数据（集）映射方法 |
| setVisible(visible) | 显示或隐藏组件 |

### Events
| name | description | params |
| :--- | :--- | :--- |
| change | 日期变更时 |
