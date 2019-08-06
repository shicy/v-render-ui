## UIInput

### Options
| name | description | default value |
| :--- | :--- | :--- |
| autoHeight | 多行输入框，是否根据内容自适应高度 | false |
| dataType | 数据类型，可选：`number`、`num`、`int`、`password`、`email`、`tel`、`url` |
| decimals | 数字形输入框，小数点位数 | 2 |
| desc | 同`description` |
| description | 描述信息 |
| displayAsPwd | 非密码输入框时，是否隐藏输入框内容（即显示为密码输入框同时可设置数据类型） | false |
| empty | 验证为空时的提示信息 |
| errmsg | 验证错误时的提示信息 |
| max | 数字形输入框，允许输入的最大值 |
| maxHeight | 多行输入框的最大高度 |
| maxSize | 文本输入框，允许输入的最大字符数 |
| min | 数字形输入框，允许输入的最小值 |
| minHeight | 多行输入框的最小高度 |
| multi | 同`multiple` |
| multiple | 是否是多行文本输入框 |
| placeholder | 输入框占位字符串 |
| prompt | 同`placeholder` |
| readonly | 是否只读 | false |
| required | 是否必填 | false |
| tips | 提示信息 |
| type | 同`dataType` |
| validate | 自定义验证方法 |
| value | 输入框默认值 |

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
| focus() | 使输入框获取焦点 |
| getDataType() | 获取数据类型 |
| getDecimals() | 获取数字输入框保留的小数位数 |
| getDescription() | 获取输入框描述信息 |
| getEmptyMsg() | 获取验证为空时的提示信息 |
| getErrorMsg() | 获取验证出错时的提示信息 |
| getMaxSize() | 获取文本输入框最大字符数 |
| getPlaceholder() | 获取输入框占位符 |
| getPrompt() | 同`getPlaceholder()` |
| getTips() | 获取输入框提示信息 |
| getValidate() | 获取验证方法 |
| getValue() | 获取输入框内容 |
| hasError() | 当前输入框内容是否出错 |
| isAutoHeight() | 判断多行文本输入框是否自适应高度 |
| isDisplayAsPassword() | 判断是否隐藏输入框内容 |
| isMultiline() | 判断是否是多行显示的输入框 |
| isReadonly() | 判断是否只读 |
| isRequired() | 判断是否必填 |
| select() | 使输入框获取焦点并选中内容 |
| setDataType(value) | 设置数据类型 |
| setDecimals(value) | 设置数字输入框要保留的小数位数 |
| setDescription(value) | 设置输入框描述信息 |
| setDisplayAsPassword(value) | 设置是否隐藏输入框内容 |
| setEmptyMsg(value) | 设置验证为空时的提示信息 |
| setErrorMsg(value) | 设置验证出错时的提示信息 |
| setMaxSize(value) | 设置文本输入框最大字符数 |
| setPlaceholder(value) | 设置输入框占位符 |
| setPrompt(value) | 同`setPlaceholder()` |
| setReadonly(value) | 设置是否只读 |
| setRequired(value) | 设置是否必填 |
| setTips(value) | 设置输入框提示信息 |
| setValidate(value) | 设置验证方法 |
| setValue(value) | 设置输入框内容 |
| showError(value) | 自定义显示出错信息 |
| val(value) | 设置或获取输入框内容 |
| validate(callback) | 验证输入框内容 |

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
| change | 内容变更时 | text:内容 |
| clear | 清空内容时 |
| enter | 按下回车按键时 | text:内容 |
