## UISelect

### Options
| name | description | default value |
| :--- | :--- | :--- |
| container | 滚动容器内，用于优化下拉框显示位置 |
| editable | 是否可编辑（即输入） | false |
| native | 是否使用原生控件渲染 | false |
| needMatch | 属性`editable`为`true`时，是否强制匹配选项 | false |
| placeholder | 占位符 |
| prompt | 同`placeholder` |

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
| disableField | 项禁用属性名称 |
| empty | 同`emptyText` |
| emptyText | 数据（集）为空时，组件显示都文本内容 | 没有数据 |
| emptyView | 数据（集）为空时，组件显示的视图 | 没有数据 |
| id | 组件编号 |
| itemRenderer | 自定义项渲染器 |
| keyField | 数据（集）中编号对应的属性名称 | id > code > value |
| labelField | 数据（集）中文本对应都属性名称 | label > name > value |
| labelFunction | 自定义获取数据（集）对应文本的方法 |
| loadingText | 加载数据（集）时，组件显示的文本内容 | 正在加载.. |
| loadingView | 加载数据（集）时，组件显示的视图 | 正在加载.. |
| mapper | 同`dataMapper` |
| moreText | 加载更多时的提示信息 | 加载更多.. |
| moreView | 加载更多时的提示视图 |
| multi | 同`multiple` |
| multiple | 是否允许多选 |
| name | 组件名称 |
| pager | 分页组件 |
| paginator | 同`pager` |
| selectedIndex | 默认选中的索引号（集），优先于`selectedKey`，多个值用逗号分隔 |
| selectedKey | 默认选中的编号（集），`selectedIndex`优先，多个值用逗号分隔 |
| style | 组件分格，类似与属性`cls`，但应更具有内在意义 |
| renderer | 同`itemRenderer` |

### Methods
| method | description |
| :--- | :--- |
| getPlaceholder() | 获取占位符 |
| getPrompt() | 同`getPlaceholder()` |
| isEditable() | 判断是否可编辑 |
| isMatchRequired() | 是否强制匹配 |
| setDataSilent(value) | 设置组件值，但不触发`change`事件 |
| setPlaceholder(value) | 设置占位符 |
| setPrompt(value) | 同`setPlaceholder()` |
| val(value) | 获取或设置组件值 |

### Extend Methods
| method | description |
| :--- | :--- |
| addItem(data, index) | 添加项 |
| addOrUpdateItem(data) | 添加或更新项 |
| destory() | 销毁组件，组件将从页面上删除 |
| getData() | 获取组件数据（集） |
| getDataAdapter() | 获取数据（集）适配器 |
| getDataAt(index) | 按索引号获取数据对象 |
| getDataByKey(key) | 根据编号获取数据对象 |
| getDataByName(name) | 根据名称获取数据对象 |
| getDataIndex(data) | 获取某个数据的索引号 |
| getDataMapper() | 获取数据（集）映射方法 |
| getIndexByKey(key) | 根据编号获取数据的索引号 |
| getIndexByName(name) | 根据名称获取数据索引号 |
| getInitParams() | 获取初始化参数 |
| getItemData(elem) | 获取某个元素所在项的数据对象 |
| getItemRenderer() | 获取项渲染器 |
| getKeyField() | 获取编号对应的属性名称 |
| getLabelField() | 获取文本对应都属性名称 |
| getLabelFunction() | 获取文本自定义方法 |
| getPaginator() | 获取分页组件 |
| getSelectedData([needArray]) | 获取选中的数据（集） |
| getSelectedIndex([needArray]) | 获取选中项的索引号（集） |
| getSelectedKey([needArray]) | 获取选中项的编号（集） |
| getViewId() | 获取组件唯一编号 |
| hasMore() | 判断是否还有数据未加载 |
| isAllSelected() | 判断是否选中了所有项 |
| isDisabled(index) | 判断组件是否被禁用 |
| isEmpty() | 判断是否是空数据（集） |
| isLoading() | 当前组件是否正在加载远程数据（集） |
| isMounted() | 判断组件是否已添加到页面 |
| isMultiple() | 判断是否允许多选 |
| isSelectedIndex(index) | 判断某个索引号对应的项是否选中 |
| isSelectedKey(key) | 判断某个编号对应的项是否选中 |
| length() | 获取数据（集）长度 |
| load(api, params, callback) | 加载远程数据（集） |
| loadPage(page, callback) | 加载某一页数据（集） |
| more() | 加载下一页数据（集） |
| reload() | 重新加载数据（集） |
| removeItem(data) | 删除项 |
| removeItemAt(index) | 根据索引号删除项 |
| rerender() | 重新渲染组件 |
| setData(value) | 设置组件数据（集） |
| setDisabled(disabled, index) | 禁用或启用组件 |
| setDataAdapter(value) | 设置数据（集）适配器 |
| setDataMapper(value) | 设置数据（集）映射方法 |
| setItemRenderer(value) | 设置项渲染器 |
| setKeyField(value) | 设置编号对应的属性名称 |
| setLabelField(value) | 设置文本对应都属性名称 |
| setLabelFunction(value) | 设置文本自定义方法 |
| setMultiple(value) | 设置是否允许多选 |
| setPaginator(value) | 设置分页组件 |
| setSelectedIndex(value) | 按索引号（集）设置选中项，多个值用逗号分隔 |
| setSelectedKey(value) | 按编号（集）设置选中项，多个值用逗号分隔 |
| setVisible(visible) | 显示或隐藏组件 |
| updateItem(data, index) | 更新项 |

### Events
| name | description | params |
| :--- | :--- | :--- |
| change | 选中状态变更时 |
