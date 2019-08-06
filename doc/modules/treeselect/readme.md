## UITreeSelect

### Options
| name | description | default value |
| :--- | :--- | :--- |
| childrenField | 子数据集对应的属性名称 | children |
| chkbox | 是否显示选择框 | false |
| icon | 节点的默认图标 |
| leafField | 标记叶子节点的属性名称 | leaf |
| openId | 默认打开节点的编号 |
| openIndex | 默认打开节点的索引号 |
| prompt | 输入框占位字符串 |

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
| addItem(data, index) | 添加项 |
| addOrUpdateItem(data) | 添加或更新项 |
| getDataAt(index) | 按索引号获取数据对象 |
| getDataByKey(key) | 根据编号获取数据对象 |
| getDataByName(name) | 根据名称获取数据对象 |
| getDataIndex(data) | 获取某个数据的索引号 |
| getIndexByName(name) | 根据名称获取数据索引号 |
| getIndexByKey(key) | 根据编号获取数据的索引号 |
| getItemData(elem) | 获取某个元素所在项的数据对象 |
| getItemRenderer() | 获取项渲染器 |
| getKeyField() | 获取编号对应的属性名称 |
| getLabelField() | 获取文本对应都属性名称 |
| getLabelFunction() | 获取文本自定义方法 |
| getPrompt() | 获取输入框占位字符串 |
| getSelectedData(needArray) | 获取选中的数据 |
| getSelectedIndex(needArray) | 获取选中的索引号 |
| getSelectedKey(needArray) | 获取选中的编号 |
| isAllSelected() | 判断是否已经选中所有项 |
| isDisabled(index) | 判断组件是否被禁用 |
| isEmpty() | 判断是否是空数据集 |
| isMultiple() | 判断组件是否多选 |
| isSelectedIndex(index) | 判断某个索引号对应的项是否已选中 |
| isSelectedKey(value) | 判断某个编号对应的项是否已选中 |
| length() | 获取数据集长度 |
| removeItem(data) | 删除项 |
| removeItemAt(index) | 根据索引号删除项 |
| setDisabled(disabled, index) | 禁用或启用组件 |
| setItemRenderer(value) | 设置项渲染器 |
| setKeyField(value) | 设置编号对应的属性名称 |
| setLabelField(value) | 设置文本对应都属性名称 |
| setLabelFunction(value) | 设置文本自定义方法 |
| setMultiple(value) | 设置组件是否多选 |
| setPrompt(value) | 设置输入框占位字符串 |
| setSelectedIndex(value) | 按索引号设置组件选中项 |
| setSelectedKey(value) | 按编号设置组件选中项 |
| updateItem(data, index) | 更新项 |

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
| change | 选择变更时 |
