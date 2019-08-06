## UIPaginator

### Options
| name | description | default value |
| :--- | :--- | :--- |
| buttons | 自定义分页按钮，格式为：`[首页, 上一页, 下一页, 末页, 跳转]`，值可以是：`ture`、`false`或文本 |
| mode | 显示模式，可选：`false`、`spread`、`dropdown` |
| page | 当前页 |
| showNum | 当属性`mode`为`spread`时，设置显示页码的数量 | 10 |
| size | 每页大小 |
| sizes | 可选分页大小设置，如：`[10, 20, 50]` |
| skip | 跳转信息，可以是：`true`、`false`或者跳转输入框的前后文本，如：`['到第', '页']` | true |
| status | 状态栏，可以使用通配符：`{pageNo}`、`{pageSize}`、`{pageCount}`、`{totalCount}`、`{pageStart}`、`{pageEnd}` | "共{totalCount}条" |
| total | 总记录数 |

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
| getButtons() | 获取分页按钮配置信息 |
| getMode() | 获取组件模式 |
| getPage() | 获取当前页码 |
| getPageNo() | 同`getPage()` |
| getPageCount() | 获取总页数 |
| getSize() | 获取分页大小 |
| getSizes() | 获取可切换分页大小配置信息 |
| getShowNum() | 获取`spread`模式下，最多显示页码数量 |
| getSkip() | 获取跳转功能配置信息 |
| getStatus() | 获取状态栏模板字符串 |
| getTotal() | 获取总记录数 |
| set(total, page, size) | 设置分页信息 |
| setButtons(value) | 设置分页按钮 |
| setMode(value) | 设置组件模式 |
| segPage(value) | 设置当前页码 |
| segPageNo(value) | 同`setPage()` |
| setSize(value) | 设置分页大小 |
| setSizes(value) | 设置可切换分页大小配置信息 |
| setShowNum(value) | 设置`spread`模式下，最多显示页码数量 |
| setSkip(value) | 设置跳转功能 |
| setStatus(value) | 设置状态栏模板字符串 |
| setTotal(value) | 设置总记录数 |

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
| change | 分页变更时 |
