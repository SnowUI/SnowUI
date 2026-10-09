# CopyLink

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；旧 OSS / PRO 标签仅表示迁移期技术来源。

> **版本**: v1.0.1
> **职责**: 展示可打开、可复制的链接地址，文字打开链接，其余区域复制地址。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-09-27

## 组件介绍

展示可打开、可复制的链接地址，文字打开链接，其余区域复制地址。

## 使用选择

<!-- usage-guide:start -->
用于分享地址、邀请链接和 AI 文档入口，与 Link 同属链接类。

- 普通文字导航用 Link；需要复制地址用 CopyLink；需要编辑地址用 Input。
- href 同时作为显示、打开与复制的完整地址；长地址只截断显示，不截断复制内容。
- 文字 hover 显示下划线，默认新标签页打开；空白与右侧图标点击复制，成功反馈由 CopyButton 管理。
<!-- usage-guide:end -->

## 快速开始

```svelte
<script lang="ts">
  import { CopyLink } from '@snowui-design-system/components';
</script>

<CopyLink href="https://snowui.dev/llms.txt" />
```

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| href | `string` | 必填 | 显示、导航和复制的地址；需要复制绝对地址时传完整 URL。 |
| target | `string` | `"_blank"` | Link 打开目标。 |
| rel | `string` | `"noopener noreferrer"` | Link 关系属性。 |
| disabled | `boolean` | `false` | 同时禁用导航和复制。 |
| parts | `ComponentPartsOf<{ Link: typeof Link; CopyButton: typeof CopyButton }>` | — | 配置内置子组件公开属性，如 Link.color / underline、CopyButton.ariaLabel / writeText / feedbackDuration。地址、禁用态和布局由父级拥有。 |
| onCopy | `(text: string) => void` | — | 复制成功后接收完整地址。 |
| onCopyError | `(error: unknown) => void` | — | 复制失败回调。 |

其余兼容属性继承 Frame，class / style 作用于表面。

## 使用边界与详细说明

- 默认无边框、无表单 hover 动效，使用 surface-2 表面。Link 默认 Black100，hover 颜色不变且显示下划线。
- Link 与 CopyButton 为平级交互元素，文字区域导航，其余表面复制；Tab 分别聚焦，Enter 打开，Enter / Space 复制。
- 文字为复制图标预留 size-4 与 gap-2；文字和尾部图标的最小间距与 Input 一致（默认 8px）。长文字以省略号 `…` 截断，完整地址继续用于导航和复制。
- 复制按钮为 bare muted，图标在右侧居中。反馈期间沿用 CopyButton 的重复点击保护。
- 不参与表单提交，不提供编辑、校验或输入框角色；无需 PRO。
- `--snowui-copy-link-padding-x-override` / `--snowui-copy-link-padding-y-override` / `--snowui-copy-link-radius-override` 分别覆盖默认 padding-4 / padding-3 / radius-4。

## AI Zone

### 模块与所有权

复用 Frame 表面、Link 导航与截断、CopyButton 剪贴板状态和功能图标，不复制其事件或图标。关闭根 Auto Layout，采用内联外壳布局。复制按钮铺满表面，Link 置于其上，点击命中不依赖事件冒泡转发；覆盖整个表面的按钮使用绝对 inset 定位，避免 Pin 自身槽位影响命中层。子项布局 class 属于本组件生成的子项。

图标直接复用 CopyButton 的 copy/check，尺寸和资源比例保持不变。SSR 输出真实 href 和文字；无 JavaScript 时导航仍可用，复制需 JavaScript。剪贴板能力及 reduced-motion 退化沿用 CopyButton；未新增 observer、timer 或 motion preset。Skeleton 注册为完整表面。

### 关键字映射

链接输入框、链接 input、可复制链接 → CopyLink。普通链接 → Link。

## 更新日志

### v1.0.1 (2026-09-27)

- 文字与复制图标的预留间距对齐 Input 的 gap-2，长链接继续单行省略。

### v1.0.0 (2026-09-27)

- 从 Quick Start 已确认的链接框提取 OSS 组件，统一文字导航、其余区域复制和无边框表面。
