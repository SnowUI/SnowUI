# SnowUI 组件选型指南

来源指纹：4b879e8f5cca77aa。

## 从任务开始找组件

页面设计与设计稿还原先读 [设计指南](./design-system.md)。组件按技术职责分类。

将页面拆成导航、操作、输入、内容切换、数据展示和浮层等区域，描述每个区域要完成的动作，再使用 [AI · 关键词检索](https://snowui.dev/llms/find?q=%E6%96%87%E4%BB%B6%E8%A1%A8%E6%A0%BC) 查询。可用“文件表格”“全局搜索”“互斥参数”“常驻通知”等实际场景词；不要仅凭截图形状或名字相似选组件。检索返回候选与页面组合，分数不是视觉匹配置信度；未命中时换用功能词，并按需查看 [组件目录](../components/index.md)，不能直接断言没有组件。

## 按候选读取必要契约

候选的精简文档位于 `/llms/components/<slug>.md`，例如 [Button](../components/button.md)。先确认用途、限制和 import，再沿其中链接按需读取：

- `api.md`：实际公开的 Props、事件、Snippet 与默认值。
- `types.md`：数据结构、可绑定字段和继承限制；不要把被排除的基类属性传给组件。
- `reference.md`：复杂组合、角色、状态与无障碍边界。
- `examples.md` 与 `.svelte` 示例：实际可运行的写法；外观仍不明确时才读该组件 `images.json` 中的相关截图。
- `styles.md`：本次确实需要视觉定制时读取，方法见 [样式修改指南](./styling.md)。

选择样式时优先用候选组件实际公开的 Props 匹配需求，尽可能保留其现有视觉；不能仅因能写 CSS 就重造组件样式。首次采用按 [样式选择顺序](./styling.md#%E6%A0%B7%E5%BC%8F%E9%80%89%E6%8B%A9%E4%B8%8E%E6%94%B9%E5%86%99%E9%A1%BA%E5%BA%8F) 核对一次，已有同任务记录复用。

多个区域共用同一组件或能力时复用已读内容，不逐实例重复加载文档，也不默认读取整库源码、完整维护规范或全库截图。文档中的公开导出与当前安装版本必须一致；在线文档展示的新增 API 不能推定旧版包已经支持。

## 按行为区分相近组件

| 实际需求 | 优先选择 | 区分依据 |
| --- | --- | --- |
| 打开全局搜索 / 直接输入查询 / 展示搜索面板 | [SearchBox](../components/search-box.md) / [SearchInput](../components/search-input.md) / [SearchPopup](../components/search-popup.md) | 入口、输入与面板是不同职责；业务检索和路由仍由应用负责。 |
| 切换内容面板 / 选择互斥过滤参数 | [Tab](../components/tab.md) / [Segmented](../components/segmented.md) | 按内容切换与参数单选区分，不能只看同样的分段外观。 |
| 展示语义表格 / 协调搜索、勾选、排序与分页 | [Table](../components/table.md) / [DataTable](../components/data-table.md) | 数据管理需求先查 DataTable 的组合契约，再组合 Table 家族、TableToolbar 与 Pagination。 |
| 单行输入 / 多行输入 / 带标签与反馈的字段 | [Input](../components/input.md) / [Textarea](../components/textarea.md) / [Field](../components/field.md) | Field 负责字段组合，placeholder 不替代可访问标签。 |
| 常驻记录栏 / 临时反馈 / 可开关详情层 | 普通 `aside` 与列表 / [Toast](../components/toast.md) / [SidePanel](../components/side-panel.md) | 常驻通知不是 Toast；仅需页面列布局时不引入弹层行为。 |

例如，工具栏里直接输入文件名使用 SearchInput，而不是 SearchBox：

```svelte
<script lang="ts">
  import '@snowui-design-system/components/styles';
  import { SearchInput } from '@snowui-design-system/components';

  let query = $state('');
</script>

<SearchInput bind:value={query} placeholder="搜索文件" aria-label="搜索文件" />
```

`bind:value` 同步输入值；如何筛选、请求与显示文件由页面决定。若它属于 DataTable 工具栏，继续读 TableToolbar / DataTable 的公开接入方式，不在外围重写已有数据协调逻辑。

## 确定组件后再实现页面

依次检查“直接复用组件 → 公开 variant / size → Props、Snippet、事件与组合入口 → 页面布局”。路由、业务数据、请求、权限与业务副作用属于应用；组件已有视觉、键盘、ARIA 和状态能力沿用公开契约。普通 `main`、`section`、`aside` 等页面结构可以保留，不必为了每个装饰与业务文字新建组件。

SnowUI 当前运行组件包面向 Svelte 5。使用 Figma Make、Lovable 等工具前确认其项目框架；需要移植时按目标组件和必要依赖处理并验证行为，不能把 Svelte 示例直接当作其他框架代码。

完成时确认：选型依据来自功能与契约；使用当前版本真实 API；复杂组合已读取边界；在实际页面检查必要交互、长文本、窄屏与无障碍状态。Figma 样式名到 Token 的转换另读 [Figma 指南](./figma.md)，不要从截图猜参数。
