## UICheckGroup

### Options
| name | description | default value |
| :--- | :--- | :--- |
| cellStyleFunction | 自定义单元格样式方法 |
| chkbox | 是否显示多选框 |
| columnRenderer | 自定义列渲染器 |
| columns | 列 |
| expandcols | 默认扩展列排版列数 |
| expandRenderer | 自定义扩展列渲染器 |
| filterFunction | 自定义筛选方法 |
| headRenderer | 自定义表头渲染器 |
| paginator | 分页组件 |
| rowStyleFunction | 自定义行样式方法 |
| showHeader | 是否显示表头 |
| sortFunction | 自定义排序方法 |

### Extend Options
| name | description | default value |
| :--- | :--- | :--- |
| data | 数据（集） |
| disabled | 禁用 |
| emptyText | 数据（集）为空时，组件显示都文本内容 | 没有数据 |
| emptyView | 数据（集）为空时，组件显示的视图 | 没有数据 |
| id | 组件编号 |
| itemRenderer | 自定义项渲染器 |
| labelField | 数据（集）中文本对应都属性名称 | label > name > value |
| labelFunction | 自定义获取数据（集）对应文本的方法 |
| loadingText | 加载数据（集）时，组件显示的文本内容 | 正在加载.. |
| loadingView | 加载数据（集）时，组件显示的视图 | 正在加载.. |
| multiple | 是否允许多选 | false |
| name | 组件名称 |
| keyField | 数据（集）中编号对应的属性名称 | id > code > value |
| selectedIndex | 默认选中的索引号（集），优先于`selectedKey`，多个值用逗号分隔 |
| selectedKey | 默认选中的编号（集），`selectedIndex`优先，多个值用逗号分隔 |

### Column Options
| name | description | default value |
| :--- | :--- | :--- |
| name | 名称 |
| expand | 是否作为扩展列 |
| filter | 筛选 |
| filterFunction | 自定义筛选方法 |
| focusHtmlTitle | 富文本标题 |
| icon | 图标 |
| sortable | 排序 |
| sortFunction | 自定义排序方法 |
| title | 标题 |
| width | 列宽 |

### Methods
| method | description |
| :--- | :--- |
| filter(columnName, vlaue, filterFunction) | 根据某一列筛选 |
| getCellStyleFunction() | 获取单元格样式方法 |
| getColumnRenderer() | 获取列渲染器 |
| getColumns() | 获取列信息 |
| getDataRealIndex(data) | 获取数据的实际索引号（筛选、排序之前的索引号） |
| getExpandColspan() | 获取默认扩展列排版列数 |
| getExpandRenderer() | 获取扩展列渲染器 |
| getHeadRenderer() | 获取表头渲染器 |
| getRowStyleFunction() | 获取行样式方法 |
| isChkboxVisible() | 判断是否显示多选框 |
| isHeaderVisible() | 判断是否显示表头 |
| setCellStyleFunction(value) | 设置单元格样式方法 |
| setColumnRenderer(value) | 设置列渲染器 |
| setColumns(value) | 设置列信息 |
| setChkboxVisible(value) | 显示或隐藏多选框 |
| setExpandColsapn(value) | 设置默认扩展列排版列数 |
| setExpandRenderer(value) | 设置扩展列渲染器 |
| setHeadRenderer(value) | 设置表头渲染器 |
| setHeaderVisible(value) | 显示或隐藏表头 |
| setRowStyleFunction(value) | 设置行样式方法 |
| sort(columnName, type, sortFunction) | 按某一列排序 |


### Extend Methods
| method | description |
| :--- | :--- |
| addItem(data, index) | 添加项 |
| addOrUpdateItem(data) | 添加或更新项 |
| destory() | 销毁组件，组件将从页面上删除 |
| getData() | 获取组件数据（集） |
| getDataAdapter() | 获取数据（集）适配器 |
| getDataAt(index) | 按索引号获取数据对象 |
| getDataByName(name) | 根据名称获取数据对象 |
| getDataByKey(key) | 根据编号获取数据对象 |
| getDataIndex(data) | 获取某个数据的索引号 |
| getDataMapper() | 获取数据（集）映射方法 |
| getIndexByName(name) | 根据名称获取数据索引号 |
| getIndexByKey(key) | 根据编号获取数据的索引号 |
| getInitParams() | 获取初始化参数 |
| getItemData(elem) | 获取某个元素所在项的数据对象 |
| getItemRenderer() | 获取项渲染器 |
| getKeyField() | 获取编号对应的属性名称 |
| getLabelField() | 获取文本对应都属性名称（不可用） |
| getLabelFunction() | 获取文本自定义方法（不可用） |
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
| isMultiple() | 判断是否允许多选 |
| isMounted() | 判断组件是否已添加到页面 |
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
| setDisabled(disabled, index) | 禁用或启用组件 |
| setDataAdapter(value) | 设置数据（集）适配器 |
| setDataMapper(value) | 设置数据（集）映射方法 |
| setItemRenderer(value) | 设置项渲染器（不可用） |
| setKeyField(value) | 设置编号对应的属性名称 |
| setLabelField(value) | 设置文本对应都属性名称（不可用） |
| setLabelFunction(value) | 设置文本自定义方法（不可用） |
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
| filter | 筛选 | `columnName`: 列名称<br>`value`: 用于筛选的值 |
| sort | 排序 | `columnName`: 列名称<br>`sortType`: 排序方式 |
