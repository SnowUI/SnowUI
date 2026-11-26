# MenuItem API

来源指纹：3eae70c6f32c60c8。仅列本组件具名属性；未重新声明的基础能力按继承来源查询。

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| parts | `ComponentPartsOf<{ Button: typeof Button }>` | — | 配置默认内置删除按钮的公开 Props（如 size、class、style）；删除事件、可访问名称和角色仍由组件控制，不影响外置子项。 |
| value | `string` | — | 选项值（通过 as="item" 接入 Listbox 时必填且同一列表内唯一；独立使用时作为选择意图事件的业务标识） |
| singleLine | `boolean` | true | 普通菜单标签内部复用Frame单行预设，保持附件Hug与最小4 CSS px间距；复杂多行children可显式false并由其内容owner排版。长标签用Text lines=1提供截断和全文。 |
| selected | `boolean` | false | 是否选中（独立使用时有效；使用 as="item" 接入 Listbox 后由宿主覆盖） |
| active | `boolean` | false | 是否高亮（独立使用时有效；使用 as="item" 接入 Listbox 后由宿主覆盖） |
| disabled | `boolean` | false | 是否禁用（opacity 0.2，阻止点击） |
| showCheck | `boolean` | — | 是否渲染 trailing 勾选槽位；未设置时仅独立 `selected` 项默认开启，Listbox 默认关闭，Select 默认开启 |
| closeOnSelect | `boolean` | — | 点击后是否请求父级浮层关闭；未设置时由父级浮层决定默认策略 |
| children | `Snippet` | — | 无参数的操作项内容；直系 `as="leading"` / `as="trailing"` 子项会参与根级三槽位布局 |

[类型与状态](./types.md) · [完整组合说明](./reference.md) · [共享 Frame API](../frame/api.md) · [样式覆盖](./styles.md) · [样式选择顺序](../../guides/styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F)
