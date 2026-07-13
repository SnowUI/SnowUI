# AvatarGroup.svelte 文档

## 组合模式

AvatarGroup 使用**显式组合模式**：调用方显式书写 `<Avatar as="item">`，AvatarGroup 只负责排列、叠放、溢出计数和统一 size Context，不拥有 Avatar 的业务数据，因此不提供 `parts.Avatar`。每个 Avatar 的差异 Props 直接写在对应实例上。

> **版本**: v1.8.6
> **变更记录 (2026-04-28)**: 标注主布局模型为复合管理布局，明确 row / stack 是头像集合布局。
> **职责**: 头像组容器，负责定义内部头像的堆叠布局与溢出计数展示。

用于将多个头像或任意子元素以叠放形式组合展示，并在超出显示数量时自动以数字提示。

## 布局模型

主布局模型：复合管理布局。

- AvatarGroup 的区域结构为 group root / visible avatar items / overflow count / stack positioning。
- 子项 Avatar、Icon、Badge 仍各自保持内禀原子或内联外壳布局；AvatarGroup 只管理集合排列、遮罩切割和溢出计数。
- `row` 和 `stack` 是集合布局模式，不是 Button 式内联外壳，也不是 Frame 的三槽位宿主。
- 尺寸上下文通过 Frame context 下发给子项，排列和重叠规则属于 AvatarGroup 私有逻辑。

## 功能概览 (User)

- 多头像布局（支持线性叠放与圆形堆叠）
- 超出数量时自动显示 `+N` 溢出计数（最高显示 `+99`）
- 与任意子元素组合（不仅限于 Avatar）
- 边框切割叠放与溢出头像配色遵循 Avatar 规则

---

## API 参考 (User)

### 1. 核心属性

| 属性 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `size` | `number` | `undefined` | **主尺寸控制**。在 `stack` 模式下为容器尺寸，在 `row` 模式下为头像尺寸。 |
| `layout` | `"row" \| "stack"` | `"row"` | 叠放布局。 |
| `max` | `number` | `3` | 最大显示项数（包括溢出计数）。 |
| `enableContext` | `boolean` | `true` | 是否为子组件（Avatar/Icon/Badge）提供尺寸上下文。 |

### 2. 视觉规则

1. **布局规则**：
   - `row`: 线性排列，数量不限；使用边框切割方式进行叠放。
   - `stack`: 圆形堆叠，2/3 个头像固定位置排列，4 个及以上固定显示 3 个头像 + `+N`。当发生溢出时，`+N` 占用一个头像位置（如 `max=2` 或 `max=3` 时显示 1/2 个头像 + `+N`）。
2. **位置与层级（stack 模式）**：
   - **中心点角度**（以圆心为原点，顺时针为负角）：  
     - `max=2`：`-45°`、`135°`  
     - `max=3`：`-90°`、`150°`、`30°`
     - `max>=4`：`-45°`、`-135°`、`135°`、`45°`
   - **层级顺序**：从下到上依次为 **红、绿、蓝、紫**。  
   - **+N 位置**：始终占用 **红色位置**（最低层）。
3. **True Cutout 边框切割**：头像叠放使用基于 CSS Mask 的真实边框切割技术，确保在任何背景颜色下均呈现精准的缝隙。
   - **切割比例**：边框厚度基准为 **`0.04em`**（相对于头像尺寸）。
   - **Row 布局**：切除左侧项与右侧项重叠的部分。
   - **Stack 布局**：低层头像根据与其重叠的所有高层头像的相对坐标，动态生成复合遮罩进行精准切割。
4. **统一尺寸驱动 (Unified Sizing)**：
   - **核心逻辑**：通过单一属性 `size` 控制视觉。
   - **Stack 模式**：`size` 代表容器。头像按 `max` 对应比例自动分发（1:1.8, 1:2.0, 1:2.2）。内部传导允许亚像素精度（如 36.36px）。
   - **Row 模式**：`size` 代表头像。容器高度自动跟随。
5. **对齐优化**：容器强制执行 `vertical-align: top` 和 `line-height: 0`，确保在任何字号环境下头像均能像素级对齐。
6. **叠放间距**：叠放重叠比例固为头像尺寸的 **25%** (`0.25`)。
7. **溢出头像颜色**：`+N` 头像的文字为固定黑色，底色为 **`#EDEDED`**。配合 `stack` 模式时，计数器自动应用绝对定位以消除布局抖动。
8. **资源匹配**：向子组件透传 `size` 时，系统自动向上取整（`Math.round`），确保 `AvatarByewind` 等资源组件能加载到最匹配的图片分辨率。

### 3. 使用示例

```svelte
<AvatarGroup size={24}>
    <Avatar as="item" src={AvatarByewind} />
    <Avatar as="item" src={AvatarByewind} />
    <Avatar as="item" />
</AvatarGroup>
```

```svelte
<AvatarGroup max={2} size={32}>
    <Avatar as="item" src={AvatarByewind} />
    <Avatar as="item" src={AvatarByewind} />
    <Avatar as="item" />
    <Avatar as="item" />
</AvatarGroup>

```svelte
<AvatarGroup layout="stack" size={80} max={3}>
    <Avatar as="item" src={AvatarByewind} />
    <Avatar as="item" src={AvatarByewind} />
    <Avatar as="item" />
    <Avatar as="item" />
</AvatarGroup>
```
```


> [!IMPORTANT]
> **溢出背景样式**: 头像组溢出计数 (`+N`) 的背景颜色已按用户要求制定为灰色 **`#EDEDED`**。此样式具有最高优先级，且作为系统默认回退方案。

在此处添加您的自定义说明、业务逻辑约束或特定示例。

---
---

> **以下内容供 AI 阅读，用于维护代码与文档的关联**

## 开发者指南 (AI)

### 模块索引 (Module Index)

- **AvatarGroup 组件**: [./AvatarGroup.svelte](./AvatarGroup.svelte)

### 关键字映射 (Keyword Handling)

| 关键字 | 处理模块/文件 | 逻辑说明 |
| :--- | :--- | :--- |
| max | `AvatarGroup.svelte` | 基于 DOM 子元素数量计算溢出数并渲染 `+N`。支持最高 `+99` 封顶。 |
| layout | `AvatarGroup.svelte` | 控制线性 (`row`) 或圆形堆叠 (`stack`) 布局。触发更新时会重置子元素 mask/position。 |
| size | `AvatarGroup.svelte` | **主尺寸控制**。衍生出 `finalAvatarSize` 并通过 `resolvedSizeContext` 透传给子组件。 |

### 辅助标识符 (Secondary API)

| 标识符 | 映射/默认值 | 描述 |
|:---|:---|:---|
| `resolvedSizeContext` | `finalAvatarSize` | 向子组件透传的真实计算尺寸（含亚像素）。 |
| `--size-group-item-size` | `sizeRem` | 下发给子组件的基础尺寸变量。 |
| `--size-group-count-bg` | `#EDEDED` | 强制性的溢出背景色。 |

### 内部规则与对齐

- **根类名**: `.snowui-avatar-group`
- **对齐加固**: 显式设置 `vertical-align: top` 消除基线偏移。
- **计数器布局**: `stack` 模式下由实例级 CSS 规则承接 `position: absolute`，`row` 模式下回退到流式布局。
- **Masking 逻辑**: `row` 模式切左留右；`stack` 模式根据预设几何坐标生成实例级 CSS 遮罩规则，避免子组件 hover 重写自身 `style` 时清除父级布局样式。

### 关联关系

- **父组件**: [Frame.svelte](./Frame.svelte)
- **核心子组件**: [Avatar.svelte](./Avatar.svelte)
- **资源支持**: [@snowui-design-system/resource-svelte](https://github.com/snowui-design-system/resource-svelte)

---

## 更新日志 (Changelog)

- **AvatarGroup-Docs.2026-05-25** 源码顶部历史变更记录已归档；后续新增变更统一写入本文档 Changelog，源码顶部只保留职责、当前关键架构与文档路径。

### v1.8.6 (2026-04-25)

#### 修复
- **AG-Fix.10** 修复 `layout="stack"` 时 hover 样式错乱：stack 定位与 mask 不再写入子 Avatar 的 inline style，改由 AvatarGroup 维护的实例级 CSS 规则承接，避免子 Avatar hover 时由 Frame 重写 `style` 属性并清掉父级几何样式。

### v1.8.5 (2026-02-13)

#### 修复
- **AG-Fix.8** 修复 `+N` 计数头像尺寸与普通头像不一致：在 `.snowui-avatar-group` 统一设置 `font-size: var(--text-16)`，让尺寸链路与 Avatar 子项一致（统一消费 `--size-*` 梯度 token）。
- **AG-Fix.9** `+N` 尺寸 fallback 从 `em` 改为 `rem`，避免无 size 场景受父级字号影响。

### v1.8.1 (2026-02-13)

#### 修复
- **AG-Fix.6** 修正了 `sizeMap` 中错误的 Token 倍率计算逻辑，解决了头像组尺寸偏差问题。

#### 破坏性变更
- **AG-Breaking.1** 彻底移除了已弃用的 `groupSize` 和 `avatarSize` 属性。现由 `size` 统一驱动。

#### 修复
- **AG-Fix.4** **对齐加固**：通过将 `stack` 模式下的计数器改为 `absolute` 定位并修正容器基线，解决了 48px 以下尺寸出现的偏移。
- **AG-Fix.5** **资源匹配优化**：向资源子组件透传 `size` 时应用 `Math.round()` 取整，确保 sub-pixel 尺寸下（如 36.36px）仍能加载匹配的图片规格。

#### 新功能
- **AG-Feat.3** 增强了尺寸传导的灵活性，系统现在支持透传任意精度的计算尺寸，由子组件 (`Avatar`) 自动适配其 `rem` 样式。

### v1.7.0 (2026-02-06)

#### 新功能
- **AG-Feat.2** 实现了基于 CSS Mask 的“True Cutout”边框切割效果。
- **AG-Style.5** **尺寸逻辑重构**：统一使用 `size` 属性驱动布局。简化了 `stack` 模式下的心智模型（`size` 即容器大小），并维持头像比例自动适配。
- **AG-Style.6** 修正了 `stack` 模式下 `max=3` 的固定角度。

### v1.6.0 (2026-02-05)

#### 新功能
- **AG-Feat.1** 新增 `layout`、`groupSize`、`avatarSize` 以支持线性与圆形堆叠布局。

#### 架构重构
- **AG-Refactor.1** stack 模式固定 3 个头像 + `+N`，并支持 `avatarSize` 撑大 `groupSize`。
- **AG-Refactor.2** `stack` 模式下未传 `avatarSize` 时按 `groupSize * 0.6` 推导默认头像大小。
- **AG-Refactor.4** `stack` 模式默认头像尺寸改为基于 `max` 的分段比例。
- **AG-Refactor.5** `stack` 模式位置角度与层级顺序按 45° 斜线规则固定。

### v1.5.7 (2026-02-05)

#### 样式优化
- **AG-Style.4** 溢出计数 `overflowText` 增加 `+99` 封顶逻辑。
- **AG-Style.3** 统一溢出计数背景颜色为用户指定的灰色 (#EDEDED)，并更新 CSS 回退方案。

### v1.5.6 (2026-02-05)

#### 架构重构
- **Size Context**: 尺寸上下文逻辑移至 `Frame` 层。`AvatarGroup` 的 `size` 属性现在通过 `Frame` 自动向所有子组件（Avatar, Icon, Badge）传播。

### v1.5.4 (2026-02-03)

#### 样式优化
- **AG-Style.1** 叠放边框厚度基准调整为 `var(--border-2)`（size=32）

### v1.5.3 (2026-02-03)

#### 修复
- **AG-Fix.3** 补齐 Frame 能力开关显式传参

### v1.5.2 (2026-02-03)

#### 修复
- **AG-Fix.2** 内部变量命名对齐 snowui 规范，移除非必须字重样式

### v1.5.1 (2026-02-03)

#### 修复
- **AG-Fix.1** 统一溢出头像与普通头像的叠放间距计算

### v1.5.0 (2026-02-03)

#### 新功能
- **AG2.1** 新增 `size` 属性控制组内头像默认尺寸，子头像尺寸优先

### v1.4.3 (2026-02-03)

#### 修复
- **AG1.5** 同步选择器写法以避免样式解析错误，并清理示例资源引用

### v1.4.2 (2026-02-03)

#### 修复
- **AG1.4** 同步文档与实际实现的子元素标记规则

### v1.4.1 (2026-02-03)

#### 样式优化
- **AG1.3** 补充边框切割、间距与溢出头像颜色规则

### v1.4.0 (2026-02-03)

#### 新功能
- **AG1.1** 新增 `max` 属性，支持溢出计数展示 `+N`
- **AG1.2** 叠放规则应用于所有直接子元素，并采用边框切割策略

### v1.3.1 (2026-02-03)
- 适配 Avatar 新 API，移除 alt / fallback 示例
