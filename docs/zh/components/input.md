# Input

提供单行输入，支持文本、搜索、密码、数字、日期时间与颜色，可组合标签、图标和校验反馈。



包：@snowui-design-system/components；类别：component；运行：全部可免费使用；来源指纹：9b86c4b0c0be6c9f

## 使用选择

用于单行文本输入。搜索用 SearchInput，多行输入用 Textarea；需要 label、帮助和错误时组合 Field。

- `bind:value` 同步编辑值，显式 value 优先于 defaultValue；数字类型输入后的值仍需业务自行转换。
- name 用于表单提交，受控表单重置时恢复绑定初值；bind:element 得到外层元素，不能当作原生 input。
- file / range 不提供上传或滑杆能力；附件用 leading / trailing 角色，清除按钮可接管 trailing。

## Import

```ts
import { Input } from '@snowui-design-system/components';
```

## 按需读取

- [快速开始代码](https://snowui.dev/llms/components/input/quick-start.svelte)
- [API](./input/api.md)：公开属性、默认值、事件和 Snippet
- [类型与状态](./input/types.md)：必填项、可绑定属性、继承与数据结构
- [完整使用边界](./input/reference.md)：使用复杂组合前读取相应章节
- [样式覆盖](./input/styles.md)：本组件实际消费的公开变量
- [示例与变体](./input/examples.md)
- [本组件截图索引](https://snowui.dev/llms/components/input/images.json)：只在外观不确定时读取对应图片
- [AI 截图命令与索引说明](../reference/screenshots.md)：生成命令、路径与有效性检查
- [设计使用指南](../guides/design-system.md)：按任务还原设计与查找参数
- [样式选择与改写顺序](../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)：首次采用时阅读，优先 Props、尽量保留原样；同任务复用
