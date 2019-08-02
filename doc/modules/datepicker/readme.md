## UIDatePicker

### Options
| name | description | default value |
| :--- | :--- | :--- |
| date | 默认选中日期 |
| end | 结束日期，当`range`为`ture`时有效 |
| max | 可选的最后日期 |
| min | 可选的最前日期 |
| range | 是否选择日期范围 |
| start | 开始日期，当`range`为`true`时有效 |

### Extend Options
| name | description | default value |
| :--- | :--- | :--- |
| disabled | 禁用 |
| id | 组件编号 |
| name | 组件名称 |

### Methods
| method | description |
| :--- | :--- |
| cancel() | 取消选择日期，当`range`为`ture`时有效 |
| getDate(format) | 获取当前选中的日期 |
| getMaxDate() | 获取可选的最后日期 |
| getMinDate() | 获取可选的最前日期 |
| isRangeDate() | 是否是日期范围 |
| setDate(start[, end]) | 设置组件当前选中的日期 |
| setMaxDate(value) | 设置可选的最后日期 |
| setMinDate(value) | 设置可选的最前日期 |
| submit() | 确认选择日期，当`range`为`ture`时有效 |


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
| cancel | 取消选择日期 | `date`: 当前选中的日期（或日期范围） |
| change | 日期变更时 |
| clear | 清除日期，即未选择日期 |
| submit | 确认选中日期 | `date`: 当前选中的日期（或日期范围） |
