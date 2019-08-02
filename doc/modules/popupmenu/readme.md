## UIPopupMenu

### Options
| name | description | default value |
| :--- | :--- | :--- |

### Extend Options
| name | description | default value |
| :--- | :--- | :--- |
| data | 数据（集） |
| disabled | 禁用 |
| emptyText | 数据（集）为空时，组件显示都文本内容 |
| emptyView | 数据（集）为空时，组件显示的视图 |
| id | 组件编号 |
| itemRenderer | 自定义项渲染器 |
| labelField | 数据（集）中文本对应都属性名称 | label > name > value |
| labelFunction | 自定义获取数据（集）对应文本的方法 |
| loadingText | 加载数据（集）时，组件显示的文本内容 |
| loadingView | 加载数据（集）时，组件显示的视图 |
| name | 组件名称 |
| keyField | 数据（集）中编号对应的属性名称 | id > code > value |


### Methods
| method | description |
| :--- | :--- |

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
| getLabelField() | 获取文本对应都属性名称 |
| getLabelFunction() | 获取文本自定义方法 |
| getPaginator() | 获取分页组件 |
| getViewId() | 获取组件唯一编号 |
| hasMore() | 判断是否还有数据未加载 |
| isDisabled(index) | 判断组件是否被禁用 |
| isEmpty() | 判断是否是空数据（集） |
| isLoading() | 当前组件是否正在加载远程数据（集） |
| isMounted() | 判断组件是否已添加到页面 |
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
| setItemRenderer(value) | 设置项渲染器 |
| setKeyField(value) | 设置编号对应的属性名称 |
| setLabelField(value) | 设置文本对应都属性名称 |
| setLabelFunction(value) | 设置文本自定义方法 |
| setPaginator(value) | 设置分页组件 |
| setVisible(visible) | 显示或隐藏组件 |
| updateItem(data, index) | 更新项 |

### Events
| name | description | params |
| :--- | :--- | :--- |
| change | 选中状态变更时 |