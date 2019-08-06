## UIForm

### Options
| name | description | default value |
| :--- | :--- | :--- |
| action | 表单提交接口 |
| buttons | 表单按钮 |
| columns | 表单列数 | 1 |
| labelAlign | 水平方向显示时，标签对齐方式，可选：`left`、`center`、`right` | left |
| labelWidth | 水平方向显示时，标签宽度 | 110px |
| method | 表单提交方式，可选：`get`、`post` | get |
| orientation | 表单项排列方向，可选：`vertical`、`horizontial` | horizontial |
| params | 表单提交时的额外参数 |

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
| add(name, label, index) | 添加表单项，返回`FormItem` |
| delete(name) | 根据名称删除表单项 |
| deleteAt(index) | 根据索引删除表单项 |
| get(name) | 根据名称获取表单项，返回`FormItem` |
| getAction() | 获取表单提交接口 |
| getAt(index) | 根据索引获取表单项，返回`FormItem` |
| getColumns() | 获取表单显示的列数 |
| getFormData() | 获取表单数据，包括组件配置参数`params` |
| getMethod() | 获取表单提交方式 |
| getLabelAlign() | 获取标签对齐方式 |
| getLabelWidth() | 获取标签宽度 |
| getOrientation() | 获取表单项排列方式 |
| getParams() | 获取表单提交时的额外参数 |
| setAction(value) | 设置表单提交接口 |
| setButtons(value) | 设置表单按钮 |
| setColumns(value) | 设置表单显示的列数 |
| setFormData(data) | 设置表单数据，根据`name`属性自动匹配设置每个表单项 |
| setMethod(value) | 设置表单提交方式，`get`或`post` |
| setLabelAlign(value) | 设置标签对齐方式，`left`、`center`或`right` |
| setLabelWidth(value) | 设置标签宽度 |
| setOrientation(value) | 设置表单项排列方式，`vertical`或`horizontial` |
| setParams(value) | 设置表单提交时的额外参数 |
| submit([action, ]callback) | 提交表单，参数`action`为空时取相应组件配置参数 |
| validate(callback) | 表单验证 |

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

### FormItem Methods
| method | description |
| :--- | :--- |
| colspan(value) | 该项占据列数 |
| content(value) | 设置表单项内容（视图） |
| emptyMsg(value) | 为空异常时的提示信息 |
| getName() | 获取名称 |
| getLabel() | 获取标签 |
| hide() | 隐藏 |
| required(value) | 设置表单是否必填 |
| setName(value) | 设置名称 |
| setLabel(value) | 设置标签 |
| show() | 显示 |
| validate(value) | 自定义验证方法 |
| visible(value) | 是否可见（仍占位） |

### Events
| name | description | params |
| :--- | :--- | :--- |
| action_after | 表单提交之后 | err:错误信息，ret:接口返回值，params:提交参数 |
| action_before | 表单提交前 | params:提交参数 |
| btn_[name] | 相应按钮点击时 |
| btnclick | 表单按钮点击时 | btnName:按钮名称，btn:被点击的按钮 |
