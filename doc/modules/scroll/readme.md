## UIScroll

### Options
| name | description | default value |
| :--- | :--- | :--- |
| bottomDistance | 加载更多时的底部距离，滚动时底部小于该距离时加载下一页 | 70px|0.7rem |
| bottomText | 加载完成没有更多时的提示信息 | 没有更多了 |
| bottomView | 加载完成没有更多时的显示视图 |
| content | 内容，即子视图 |
| emptyView | 
| loadingText | 正在加载时的提示信息 | 正在加载.. |
| loadingView | 正在加载时的视图，替换`loadingText` |
| getMoreFunction | 自定义加载更多方法 |
| moreFunction | 加载更多方法 |
| refreshDropText | 下拉时，超过刷新点的提示信息 | 松开刷新 |
| refreshFunction | 自定义刷新方法 |
| refreshLoadText | 下拉刷新时，等待提示信息 | 正在刷新.. |
| refreshPullText | 下拉时，未到刷新点时的提示信息 | 下拉刷新 |
| refreshView | 下拉刷新时，等待视图，替换`refreshLoadText` |
| scroller | 滚动视图容器，默认是组件自己 |
| topDistance | 下拉刷新时的顶部距离，下拉超过该距离后松开即刷新 | 50px|0.5rem |
| view | 同`content` |

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
| getBottomDistance() | 获取更多的底部距离 |
| getContentView() | 获取内容（即子视图） |
| getRefreshFunction() | 获取刷新方法 |
| getMoreFunction() | 获取加载更多方法 |
| getScrollContainer() | 获取滚动容器视图 |
| getTopDistance() | 获取刷新的顶部距离 |
| setBottomDistance(value) | 设置更多的底部距离 |
| setContentView(value) | 设置内容（即子视图） |
| setRefreshFunction(value) | 设置刷新方法 |
| setMoreFunction(value) | 设置加载更多方法 |
| setScrollContainer() | 设置滚动容器视图 |
| setTopDistance(value) | 设置刷新的顶部距离 |

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
| more | 开始加载更多时 |
| refresh | 开始刷新时 |
