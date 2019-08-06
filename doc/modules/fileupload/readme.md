## UIFileUpload

### Options
| name | description | default value |
| :--- | :--- | :--- |
| action | 文件上传接口 |
| autoUpload | 选择文件之后，是否自动上传 | true |
| browser | 用于触发浏览本地文件的按钮 |
| filter | 文件过滤 |
| limit | 文件大小限制 |
| mixed | 多选时，是否合并在一个接口里一次性上传，还是没个文件分开上传 | false |
| multiple | 是否多选 | false |
| params | 上传时附带的其他参数 |
| uploadName | 上传文件对应的参数名称 | file |

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
| browser() | 开始浏览本地文件，弹出系统自带的文件选中对话框 |
| cancel() | 文件上传进行过程中，取消上传（即停止上传） |
| clear() | 清除所有已经选择的文件 |
| getAction() | 获取文件上传接口 |
| getBrowser() | 获取触发浏览本地文件的按钮 |
| getFilter() | 获取文件过滤信息 |
| getLimit() | 获取文件大小限制 |
| getParams() | 获取上传时的其他参数信息 |
| getUploadName() | 获取文件对应的参数名称 |
| isAutoUpload() | 判断是否自动上传 |
| isEmpty() | 判断组件是否为空，即是否已选择文件 |
| isMixed() | 判断是否将多个文件合并到一个接口上传 |
| isMultiple() | 判断是否允许多选 |
| remove(localId) | 移除（即取消选择）某个已选择的文件 |
| setAction(value) | 设置文件上传接口 |
| setAutoUpload(value) | 设置组件是否自动上传 |
| setBrowser(value) | 设置用于触发浏览本地文件的按钮 |
| setFilter(value) | 设置文件过滤 |
| setLimit(value) | 设置文件大小限制 |
| setMixed(value) | 设置是否将多个文件合并到一个接口上传 |
| setMultiple(value) | 设置组件是否允许文件多选 |
| setParams(value) | 设置上传时的其他参数信息 |
| setUploadName(value) | 设置文件对应的参数名称 |
| upload(action, params, callback) | 开始上传文件，参数`action`、`params`为空时自动取相应的组件配置参数 |

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
| change | 选择文件时 |
| error | 上传失败 | err:失败信息 |
| progress | 上传进行时 | file:文件信息，send:已发送字节，total:总字节 |
| success | 上传成功 | ret:接口返回结果 |
| upload-before | 文件上传之前 |
