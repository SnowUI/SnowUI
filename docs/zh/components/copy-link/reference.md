# CopyLink

> **版本**: v1.0.2
> **职责**: 展示可打开、可复制的链接地址，文字打开链接，其余区域复制地址。
> **包归属**: `@snowui-design-system/components`
> **文档修订**: 2026-10-23

## 组件介绍

展示可打开、可复制的链接地址，文字打开链接，其余区域复制地址。

## 使用选择


用于分享地址、邀请链接和 AI 文档入口，与 Link 同属链接类。

- 普通文字导航用 Link；需要复制地址用 CopyLink；需要编辑地址用 Input。
- href 同时作为显示、打开与复制的完整地址；长地址只截断显示，不截断复制内容。
- 文字 hover 显示下划线，默认新标签页打开；空白与右侧图标点击复制，成功反馈由 CopyButton 管理。


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
- 文字为复制图标预留 size-4（至少按内置图标的 12 CSS px 下限）与 gap-2（至少 4 CSS px）；默认 16px 根字号下仍为 16px 图标与 8px 间距。长文字以省略号 `…` 截断，完整地址继续用于导航和复制。
- 复制按钮为 bare muted，图标在右侧居中。反馈期间沿用 CopyButton 的重复点击保护。
- 不参与表单提交，不提供编辑、校验或输入框角色；无需额外组件包。
- `--snowui-copy-link-padding-x-override` / `--snowui-copy-link-padding-y-override` / `--snowui-copy-link-radius-override` 分别覆盖默认 padding-4 / padding-3 / radius-4。
