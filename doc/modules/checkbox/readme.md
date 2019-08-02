## UICheckbox

### Options
| name | description | default value |
| :--- | :--- | :--- |
| checked | 是否默认选中 | false |
| label | 多选框后面紧跟的文本 |
| value | 值 |

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
| isChecked() | 判断当前是否是选中状态 |
| setChecked([bool]) | 设置选中或不选中 |
| val([value]) | 设置（或获取）值，当参数`value`不为`null`或`undefined`时修改多选框值 |

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
| change | 选中状态变更时 |