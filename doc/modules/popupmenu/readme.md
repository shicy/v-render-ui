## UIPopupMenu

### Options
| name | description | default value |
| :--- | :--- | :--- |
| backText | 移动端，返回上一级节点的按钮名称 | 返回 |
| actionTarget | 绑定一个按钮，点击打开菜单 |
| actionType | 绑定按钮触发的事件名称 | click |
| childrenField | 数据中对应子菜单的属性名称 |
| iconField | 数据集中图标对应的属性名称 |
| iconFunction | 显示图标对应的方法 |
| loadingText | 动态加载时显示的文本信息 | 正在加载.. |
| moreText | 加载更多按钮显示的文本信息 | 加载更多 |
| offsetLeft | 相对于`actionTarget`向左偏移量 |
| offsetTop | 相对于`actionTarget`向下偏移量 |

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
| style | 组件分格，类似与属性`cls`，但应更具有内在意义 |
| renderer | 同`itemRenderer` |

### Methods
| method | description |
| :--- | :--- |
| close() | 关闭菜单 |
| getActionTarget() | 获取被绑定的按钮 |
| getActionType() | 获取按钮事件类型 |
| getIconField() | 获取图标对应的属性名称 |
| getIconFunction() | 获取图标对应的方法 |
| getOffsetLeft() | 获取向左偏移量 |
| getOffsetTop() | 获取向下偏移量 |
| open() | 打开菜单 |
| setActionTarget(value) | 设置绑定按钮 |
| setActionType(value) | 设置按钮事件类型 |
| setIconField(value) | 设置图标对应的属性名称 |
| setIconFunction(value) | 设置图标对应的属性方法 |
| setOffsetLeft(value) | 设置向左偏移量 |
| setOffsetTop(value) | 设置向下偏移量 |

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
| getViewId() | 获取组件唯一编号 |
| hasMore() | 判断是否还有数据未加载 |
| isDisabled(index) | 判断组件是否被禁用 |
| isEmpty() | 判断是否是空数据（集） |
| isLoading() | 当前组件是否正在加载远程数据（集） |
| isMounted() | 判断组件是否已添加到页面 |
| isMultiple() | 判断是否允许多选 |
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
| setVisible(visible) | 显示或隐藏组件 |
| updateItem(data, index) | 更新项 |

### Events
| name | description | params |
| :--- | :--- | :--- |
| change | 选中状态变更时 |
