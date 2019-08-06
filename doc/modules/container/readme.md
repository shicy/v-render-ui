## UIContainer

### Options
| name | description | default value |
| :--- | :--- | :--- |
| align | 样式`text-align` |
| background | 样式`background` |
| backgroundColor | 样式`background-color` |
| backgroundImage | 样式`background-image` |
| backgroundPosition | 样式`background-position` |
| backgroundRepeat | 样式`background-repeat` |
| backgroundSize | 样式`background-size` |
| bg | 样式`background` |
| bgcolor | 样式`background-color` |
| border | 样式`border` |
| borderBottom | 样式`border-bottom` |
| borderColor | 样式`border-color` |
| borderLeft | 样式`border-left` |
| borderRadius | 样式`border-radius` |
| borderRight | 样式`border-right` |
| borderTop | 样式`border-top` |
| borderWidth | 样式`border-width` |
| color | 样式`color` |
| display | 样式`display` |
| fontSize | 样式`font-size` |
| height | 样式`height` |
| image | 样式`background-image` |
| margin | 样式`margin` |
| marginBottom | 样式`margin-bottom` |
| marginLeft | 样式`margin-left` |
| marginRight | 样式`margin-right` |
| marginTop | 样式`margin-top` |
| maxHeight | 样式`maxHeight` |
| maxWidth | 样式`max-width` |
| minHeight | 样式`min-height` |
| minWidth | 样式`min-width` |
| overflow | 样式`overflow` |
| padding | 样式`padding` |
| paddingBottom | 样式`padding-bottom` |
| paddingLeft | 样式`padding-left` |
| paddingRight | 样式`padding-right` |
| paddingTop | 样式`padding-top` |
| position | 样式`position` |
| shadow | 样式`box-shadow` |
| textAlign | 样式`text-align` |
| width | 样式`width` |


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