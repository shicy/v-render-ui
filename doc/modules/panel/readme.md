## UIPanel

### Options
| name | description | default value |
| :--- | :--- | :--- |
| buttons | 面板上自定义按钮 |
| content | 面板包含的视图，如果是多视图面板也作为默认视图 |
| focusHtmlTitle | 富文本标题 |
| title | 标题 |
| thumbWidth | 滑块宽度 |
| view | 同`content` |
| viewIndex | 多视图模式下的默认选中视图索引号 |
| viewports | 多视图定义，格式：`[{name, content}]` |

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
| getButtons() | 获取自定义按钮配置信息 |
| getTitle() | 获取标题 |
| getViewActive() | 获取当前视图的名称 |
| isViewActive(name) | 判断当前是否是指定视图 |
| setButtons(value) | 设置面板自定义按钮 |
| setTitle(value) | 设置标题 |
| setViewActive(name) | 按名称设置当前选中视图 |
| setViewports(value, activeName) | 设置面板多视图 |

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
| btnclick | 面板上自定义按钮点击时 | name:按钮名称，active:是否选中状态 |
| change | 面板视图变更时 | name:视图名称，lastName:变更前的视图名称 |
