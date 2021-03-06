## UIGroup

### Options
| name | description | default value |
| :--- | :--- | :--- |
| align | 子视图对齐方式，可选：`left`、`center`、`right`、`top`、`middle`、`bottom` |
| children | 同`subViews` |
| gap | 子视图之间的空隙 |
| orientation | 布局方向，可选：`vertical`、`horizontial` |
| subViews | 子视图 |
| views | 同`children` |

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
| add(child, index) | 添加子视图并返回该子视图 |
| append(values) | 添加子视图（支持多参数） |
| getAlign() | 获取对齐方式 |
| getGap() | 获取子视图间隙 |
| getOrientation() | 获取布局方向 |
| removeAt(index) | 根据索引删除某个子视图 |
| setAlign(value) | 设置对齐方式 |
| setGap(value) | 设置子视图间隙 |
| setOrientation(value) | 设置布局方向 |

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
