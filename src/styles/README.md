# 通用样式目录

> **版本**: v1.6.2
> **路径**: `src/styles/`

本目录是 Components 包唯一的样式来源。组件构建、GitHub 仓库和 npm 包不得读取仓库外的 `styles/`。

---

## 文件列表

| 文件 | 用途 |
| :--- | :--- |
| [layout.css](layout.css) | 布局与共享行为工具类（morph-container、direction、hoverable、field-bordered） |
| [themes.css](themes.css) | 主题变量唯一可编辑权威源（`DG-01`）；修改后运行 `sync-themes.mjs` 同步至 `styles/snowui-themes.css` |
| [components.css](components.css) | 组件公开 override 变量入口 |
| [tokens.css](tokens.css) | 核心 Token（`--text-*` / `--leading-*` + 几何基准变量） |
| [scale.css](scale.css) | 按需启用的尺寸比例计算（height / width / mixed / aspect） |
| [scale.md](scale.md) | `scale.css` 规则与覆盖优先级文档 |
| [auto-layout.css](auto-layout.css) | `snowui-auto-layout` 低优先级 layer 中的三槽位、Wrap、Gap、镜像与 Pin 原语 |

`layout.css` 集中登记 `snowui-host-baseline → snowui-frame-direction → snowui-auto-layout → snowui-frame-motion-fallback → snowui-shared-behavior`。方向基座低于 Auto Layout，因此三槽 Host 可从 flex 切换为 Grid；组件未分层的低权重基类、公开 class/style 与 Frame inline 输入仍稳定高于全部共享 layer。组件自有 gap、wrap 或 alignment 不得依赖模块加载顺序。

---

## layout.css 关键类名

| 类名 | 用途 |
| :--- | :--- |
| `.snowui-morph-container` | CSS Grid Stacking 抗抖动容器 |
| `.snowui-direction-row` | 水平布局 |
| `.snowui-direction-row-reverse` | 水平反向布局 |
| `.snowui-direction-column` | 垂直布局 |
| `.snowui-direction-column-reverse` | 垂直反向布局 |
| `.snowui-direction-grid` | 网格布局 |
| `.snowui-direction-grid-reverse` | 网格反向布局 |

---

## 使用规范

1. **低优先级**：共享布局选择器使用 `:where()` 包裹。
2. **变量优先**：使用 `tokens.css` 基准变量 + `calc()` 计算。
3. **单位**：排版与几何基准优先使用 `rem`。

---

## 引入方式

包消费方在应用入口显式引入一次：

```css
@import "@snowui-design-system/components/styles";
```

`components/src/styles/themes.css` 是主题变量的唯一可编辑源（`DG-01`），修改后通过工作区 `sync-themes.mjs` 单向同步至 `styles/snowui-themes.css`，禁止反向手改副本。

---

## 更新日志

### v1.6.2 (2026-11-22)

- 对齐 `DG-01` 主题单源规则：`components/src/styles/themes.css` 为唯一可编辑源，通过 `sync-themes.mjs` 单向同步。

### v1.6.0 (2026-07-13)

- 新增包内 `themes.css` 与 `components.css`，移除 Components 对外部 `styles/` 的运行时、构建和发布依赖。

### v1.5.1 (2026-02-17)

- 同步排版 Token 体系：文字使用 `--text-*`，行高使用配对 `--leading-*`。

完整历史见 [更新日志归档](../../docs/history/changelogs/styles-README.history.md)。
