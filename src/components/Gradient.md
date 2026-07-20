# Gradient 静态渐变图

> **版本**: v1.1.0
> **职责**: 渲染 Workshop 设计稿最终图层 `c` 顶部裁出的 2× 正方形 PNG，为后续头像动效提供稳定的静态视觉基线。
> **包归属**: OSS

Gradient 使用从 Figma 最终图层 `c` 的 2× 原图左上角裁出的 `710 × 710` PNG，在默认 `355 × 355` 画布上以 2× 精度显示。裁切保留顶部淡紫、洋红、右侧黄绿色柔光，以及在正方形底边处截断的深蓝曲面；没有缩放、调色、滤镜或近似 CSS 渐变重建。组件不包含动画；动态阶段由后续任务在静态基线确认后继续实现。

## 布局模型

主布局模型：内禀原子布局。

- 根节点是由 `size` 或 `width` / `height`、`radius` 与内部渐变算法决定的视觉面。
- 组件不接受 children，不接入 Leading / Content / Trailing 槽位。
- 默认画布按截图指定的 `355 × 355` 正方形输出，默认圆角为 `var(--radius-5)`。
- 作为 `Avatar fallback` 使用时，Avatar 会传入 `as="avatar-image"`、尺寸与裁切半径；这些只改变外部角色和几何，不改变 Gradient 的内部布局。

## 关键字

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `size` | `number \| string` | - | 同时设置宽高；优先级高于 `width` / `height` |
| `width` | `number \| string` | `355` | 宽度；数字值按 px 处理 |
| `height` | `number \| string` | `355` | 高度；数字值按 px 处理 |
| `radius` | `number \| string` | `var(--radius-5)` | 圆角与裁切半径 |
| `decorative` | `boolean` | `true` | 装饰图默认隐藏于无障碍树；设为 `false` 时应同时提供 `aria-label` |
| `as` | `string` | - | Frame 角色声明；Avatar 场景使用 `as="avatar-image"` |
| `seed` | `string \| number` | - | Avatar fallback 协议保留参数；静态版本接收但不改变视觉 |

## 使用示例

```svelte
<Gradient />
```

```svelte
<Gradient size={355} radius={20} />
```

```svelte
<Avatar fallback={Gradient} data-name="Gradient avatar" size={80} />
```

## 视觉实现

- 权威视觉资源：[`../assets/gradient-c-square.png`](../assets/gradient-c-square.png)。
- 正方形资源从 [`../assets/gradient-c.png`](../assets/gradient-c.png) 的左上角直接裁出：原图 `710 × 1111`，裁切框 `(x: 0, y: 0, width: 710, height: 710)`，对应设计尺寸 `355 × 355`。
- 组件仅负责尺寸、裁切、圆角和无障碍语义，不对原图增加滤镜、颜色混合或渐变覆盖。
- 数字尺寸 Prop 按组件通用约定转为 px。

---

---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 参考组件

| 组件 | 采用内容 | 未采用内容 |
| :--- | :--- | :--- |
| [Image](./Image.md) | 内禀媒体原子、尺寸与圆角覆盖链 | 媒体加载、预览与组合挂件 |
| [Avatar](./Avatar.md) | `fallback`、`as="avatar-image"` 组合角色与尺寸裁切协议 | badge 与文字回退 |
| [GradientMotion](../../../pro/src/components/GradientMotion.md) | `size` / `width` / `height` / `radius` 的公开尺寸语义 | PRO WebGL shader、循环动画与 palette API |

### 模块索引

| 模块 | 文件 | 职责 |
| :--- | :--- | :--- |
| Gradient | [Gradient.svelte](./Gradient.svelte) | 静态渐变图渲染 |
| Test 示例 | [Gradient.test.ts](./Gradient.test.ts) | 设计稿比例与头像裁切示例 |

### 组合模式

Gradient 是无 children、无内置公开子组件的原子视觉组件，组合模式登记为“不适用”，不提供 `parts`。

---

## 更新日志 (Changelog)

### v1.1.0 (2026-07-21)

#### 调整

- 按头像动效基线截图，将最终图层 `c` 从左上角精确裁为 `710 × 710` 的 2× 正方形资源。
- Gradient 默认画布由 `355 × 555.5` 调整为 `355 × 355`。
- 保留纵向原始导出文件作为裁切来源，正方形资源不缩放、不调色、不增加滤镜。

### v1.0.1 (2026-07-20)

#### 修正

- 移除与最终稿差异明显的 CSS 近似渐变。
- 改为直接使用从 Figma 最终图层 `c` 导出的 2× PNG，确保静态视觉与设计源一致。

### v1.0.0 (2026-07-20)

#### 新增

- 按 Workshop Figma 节点 `13969:3965` 的最终静态图 `c` 建立 OSS Gradient 组件。
- 支持设计稿纵向比例、任意宽高、方形头像裁切、圆角与装饰图语义。
- 明确本版本只负责静态基线，不包含动画。
