# Tab API

来源指纹：9830ea5089274bd5。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| value | `string` | — | 当前激活项的唯一值，支持 bind:value；点击或键盘激活时更新。缺失或不匹配时视觉回退到首个可用项，不自动写回绑定值。 |
| variant | `TabVariant` | "pill" | Tab 视觉变体 |
| size | `TabSize` | "sm" | 同时控制 Tab 容器的 padding / radius / gap，并作为组合默认值传给直系 `Button as="item"`；Item 尺寸样式优先级为 `style > class > Button size > Tab size` |
| row | `boolean` | false | 显式横向排列；row 与 column 均为 false 时仍横向显示，同时启用时 row 优先。 |
| column | `boolean` | false | 纵向排列；与 Frame 写法统一 |
| fill | `boolean` | false | Figma fill 宽度;容器有显式宽度时,横向子项等宽填满 |
| onChange | `(value: string) => void` | — | 用户激活不同选项后调用，参数为新 value；重复激活当前项不触发，回调不可取消选择。 |
| selectionFollowsFocus | `boolean` | false | 方向键是否直接激活;Tab 默认 `false`(仅切焦点 + Enter 激活),Segmented 默认 `true` |
| role | `string` | "tablist" | ARIA 容器 role |
| itemRole | `string` | — | 写入子项的 ARIA role；未传时保留 Button 自身语义。选项卡示例显式传 tab；传 radio 时同步 aria-checked，其余情况同步 aria-selected。 |
| children | `Snippet` | — | 无参数的显式子项内容，使用 Button 或 CopyButton 的 as="item" 并设置唯一 value；替代 items，子项 Props 直接配置。 |
| items | `TabItem[]` | [] | 内置子项数据，每项必填唯一 value 和可读 label，可选 icon 组件及 disabled；icon 生成 Icon + Text，禁用项跳过键盘选择。children 存在时忽略 items。 |
| parts | `ComponentPartsOf<{ Button: typeof Button; Icon: typeof Icon; Text: typeof Text; }>` | — | 批量配置默认生成的 Button、Icon 与 Text，例如 parts.Button.scaleOnHover；显式 children 不消费这些默认子项配置。 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
