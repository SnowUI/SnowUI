# 通用样式目录 (Styles Directory)

> **版本**: v1.6.0
> **路径**: `./.`

本目录是 Components 包唯一的样式来源。组件构建、GitHub 仓库和 npm 包不得读取仓库外的 `styles/`。

---

## 文件列表

| 文件 | 用途 |
| :--- | :--- |
| [layout.css](./layout.css) | 布局工具类 (morph-container, direction) |
| [themes.css](./themes.css) | Components 包内主题变量；只允许项目所有者与 `styles/snowui-themes.css` 手工同步 |
| [components.css](./components.css) | 组件公开 override 变量入口 |
| [tokens.css](./tokens.css) | 核心 Token（`--text-*` / `--leading-*` + 几何基准变量） |
| [scale.css](./scale.css) | 统一尺寸比例计算（height/width/mixed/aspect） |
| [scale.md](./scale.md) | `scale.css` 规则与覆盖优先级文档 |

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

1. **低优先级**: 所有选择器使用 `:where()` 包裹
2. **变量优先**: 使用 `tokens.css` 基准变量 + `calc()` 计算
3. **单位**: 优先使用 `rem`

---

## 引入方式

Demo 内引入（唯一允许入口）：
```svelte
<style>
@import "../styles/index.css";
</style>
```

包消费方可显式引入：

```css
@import "@snowui-design-system/components/styles";
```

`themes.css` 与 `styles/snowui-themes.css` 必须逐字一致。AI 与脚本只能校验，禁止自动复制或覆盖。

---

## 更新日志 (Changelog)

### v1.6.0 (2026-07-13)

- 新增包内 `themes.css` 与 `components.css`，彻底移除 Components 对外部 `styles/` 的运行时、构建和发布依赖。

### v1.5.1 (2026-02-17)

#### 文档
- 同步排版 Token 体系：文字使用 `--text-*`，行高使用配对 `--leading-*`。

### v1.5.0 (2026-02-07)

#### 新功能
- **ST.8** 新增 `tokens.css`：提供文字、边框、圆角、padding、gap、Avatar、Icon、最小宽高等梯度 token（基准值 × 系数）。

#### 架构重构
- **ST.9** `index.css` 新增 `tokens.css` 引入，作为 `scale.css` 之前的 token 层。

### v1.4.0 (2026-02-07)

#### 新功能
- **ST.6** `scale.css` 新增 width / mixed / aspect 三种计算依据（默认仍为 height）。
- **ST.7** `scale.css` 新增运行时宽度与高宽比回退链变量。

### v1.3.0 (2026-02-07)

#### 架构重构
- **ST.5** `scale.css` 增加运行时高度回退链（`--snowui-scale-height-runtime`），与 Frame Scale Observer 对齐。

### v1.2.0 (2026-02-07)

#### 架构重构
- **ST.3** `scale.css` 变量命名统一升级为 `--snowui-scale-*`，避免与组件变量命名冲突

#### 新功能
- **ST.4** `scale.md` 增补完整需求对齐章节（高度基准、可用空间、单行/多行/截断、Icon/Avatar 比例、覆盖优先级）

### v1.1.0 (2026-02-07)

#### 新功能
- **ST.1** 新增 `scale.css` 统一高度比例计算能力
- **ST.2** 新增 `scale.md` 文档，定义比例变量与外部覆盖优先级

### v1.0.0 (Initial)
- 初始版本
