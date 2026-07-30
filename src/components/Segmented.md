# Segmented (分段控制器)

## 默认内置模式 / 显式组合模式

- **Tab 宿主组件特化**：Segmented 实际渲染真实 Tab，全部兼容 Tab Props 在根级平铺；不提供 `parts.Tab`。
- 默认内置模式（推荐）：`items` 交给 Tab 生成 Button；`parts.Button` 沿默认生成链路显式转发。
- 显式组合模式：显式书写 `<Button as="item">`，逐项 Props 直接配置。

> **版本**: v1.2.0
> **状态**: 已实现(PRO)
> **职责**: RadioGroup 的视觉变体,在多个互斥选项之间切换"过滤器/参数"。视觉系统
> 与 [Tab](./Tab.md) 完全共享,在 ARIA 语义、键盘行为、Form 接入上区分。
> **设计稿**: Figma node `11838-19967`

---

## 1. 与 Tab 的关系

| 维度 | Tab | Segmented |
| :--- | :--- | :--- |
| 语义 | "视图/内容区"切换 | "过滤器/参数"单选 |
| ARIA role | `tablist` / 子项 `tab`(隐式 button) | `radiogroup` / 子项 `radio` |
| 方向键 | 仅切焦点(`selectionFollowsFocus=false`),Enter 激活 | 直接切换并激活(`selectionFollowsFocus=true`) |
| 接入 Form | 否 | 是(`name` 属性 + 内部 hidden input) |
| 视觉(variant/size/token) | **完全相同** | **完全相同** |

Segmented 是 Tab 的宿主组件特化：真实 Tab 是主要视觉表面、交互节点和根 DOM；Segmented 只固定 radiogroup 语义、方向键直切行为，并增加 `name` 隐藏表单字段。

### 宿主 Props 与所有权

- 类型来源：`ComponentProps<typeof Tab>`。
- 受控字段：`value`、`children`、`role`、`itemRole`、`selectionFollowsFocus`、`class`、`parts`。
- Tab 继续拥有 variant、size、布局、indicator、键盘基础逻辑、Frame Props 与原始 DOM。
- Segmented 拥有 radiogroup/radio ARIA、直切语义、name hidden input 及顶层 class 合并。
- hidden input 是 Tab 根之后的无视觉辅助节点；不复制 Tab 表面。

---

## 2. API

### 2.1 Props

| 关键字 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `value` | `string` | - | 当前激活值,支持 `bind:` |
| `variant` | `'pill' \| 'solid' \| 'underline' \| 'icon-toggle' \| 'bare'` | `'pill'` | 同 Tab |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | 同 Tab；控制容器 padding / radius / gap，并作为 Button Item 默认 size；Item 遵循 `style > class > Button size > Tab size` |
| `row` | `boolean` | `true` | 同 Tab，横向排列 |
| `column` | `boolean` | `false` | 同 Tab，纵向排列 |
| `fill` | `boolean` | `false` | 同 Tab;容器有显式宽度时,横向子项等宽填满 |
| `onChange` | `(value: string) => void` | - | 切换回调 |
| `name` | `string` | - | 表单字段名;存在时渲染 hidden input 接入 Form |
| `enableDefaultMotion` | `boolean` | `true` | 是否启用 Frame 默认动效；indicator 与 item 尺寸变化使用 Frame motion bridge |
| `items` | `TabItem[]` | `[]` | 默认内置模式数据源，交给真实 Tab 生成 Button |
| `parts.Button` | `Button Props` | `undefined` | 批量配置默认内置 Button；宿主 Tab 本身不使用 parts |
| 其余兼容 Props | `ComponentProps<typeof Tab>` | 同 Tab | 平铺到真实 Tab 宿主 |

### 2.2 子项约定

同 [Tab.md §2.2](./Tab.md):子项必须是 `<Button as="item" value="...">`。

---

## 3. Form 接入

```svelte
<Form onSubmit={data => console.log(data)}>
  <Segmented name="device" value="web">
    <Button as="item" value="web">Web</Button>
    <Button as="item" value="mobile">Mobile</Button>
  </Segmented>
</Form>
<!-- 提交后:{ device: "web" } -->
```

实现:当传入 `name` 时,Segmented 在 Tab 的 children 末尾追加 `<input type="hidden" name={name} value={value}>`,通过原生表单提交机制把当前 value 暴露给 Form。

---

## 4. 样式 Token

完全继承 Tab。详见 [Tab.md §3](./Tab.md)。

`--snowui-tab-*-override` 变量同样适用于 Segmented(Segmented 内部包裹 Tab,共享同一组 CSS 变量与类名)。

---

## 5. 动效

完全继承 Tab。详见 [Tab.md §4](./Tab.md)。

---

## 6. 键盘行为

- `←` / `→`(row)或 `↑` / `↓`(column):**直接切换并激活**(Tab 的 `selectionFollowsFocus=true` 模式)。
- `Home` / `End`:跳到首/末项并激活。
- 焦点行为与 Tab 一致(roving tabindex)。

---

## 7. 使用示例

```svelte
<Segmented bind:value variant="pill" size="md">
  <Button as="item" value="web"><Icon><FourLeafClover /></Icon>Web</Button>
  <Button as="item" value="mobile"><Icon><Star /></Icon>Mobile</Button>
</Segmented>

<!-- Figma fill 宽度 -->
<Segmented fill style="width: 320px" value="web">
  <Button as="item" value="web">Web</Button>
  <Button as="item" value="mobile">Mobile</Button>
</Segmented>

<!-- bare -->
<Segmented variant="bare" value="all">
  <Button as="item" value="all">All</Button>
  <Button as="item" value="random"><Icon><Star /></Icon></Button>
</Segmented>

<!-- 接入 Form -->
<Form>
  <Segmented name="device" value="web" variant="solid">
    <Button as="item" value="web">Web</Button>
    <Button as="item" value="mobile">Mobile</Button>
  </Segmented>
</Form>
```

---

## 8. 更新日志 (Changelog)

### v1.2.0 (2026-07-05)

#### 架构调整
- 正式改为 Tab 宿主组件特化模式，兼容 Tab Props 从宿主类型推导并平铺。
- 移除 `parts.Tab`；默认内置 Button 继续使用 `parts.Button`，显式 Button 直接配置 Props。
- 修复 items 模式被空 children snippet 截断、导致 Tab 不生成内置 Button 的问题。
- Form hidden input 移到 Tab 根之后，保持 Tab 作为主要宿主。

### v1.1.1 (2026-06-23)

#### 与 Tab 同步
- Item 尺寸样式优先级同步为 `style > class > Button size > Tab size`。

### v1.1.0 (2026-06-23)

#### 与 Tab 同步
- 继承 `variant="bare"`、12/16/20px gap、无 indicator 视觉及文字 / Icon 内容支持。
- 继承 Tab size → Button Item size context；Segmented 不复制 Button 尺寸定义。

### v1.0.5 (2026-06-21)

#### 动效与组合契约
- 继承 Tab icon-toggle indicator 移动修复；尺寸变化统一消费 Frame 默认 size motion bridge。
- 显式透传 `enableDefaultMotion`，默认开启。
- 所有 Test 示例的 Button 子项补齐 `as="item"`。

### v1.0.4 (2026-06-18)

#### 动效还原
- 当时随 Tab 使用专用 Tabs sliding 时序；v1.0.5 起已迁移到 Frame transform / size motion bridge。

### v1.0.3 (2026-05-31)

#### 样式调整
- 继承 Tab v1.0.3：active Text / Icon 在 pill / icon-toggle 使用 `--static-black-100`，在 underline 使用 `--primary`，在 solid 保持 Button 默认颜色链；inactive 统一使用 `--black-100 × opacity: 0.4`。
- 背景滑块复用 Tab 的 transitions.dev Tabs sliding 时序：位置与宽高均使用 250ms、`cubic-bezier(0.22, 1, 0.36, 1)`，首次定位与 resize 不播放动效。
- 四种 variant 测试展示示例均补充 Icon，便于观察与 Tab 一致的颜色继承。

### v1.0.2 (2026-05-31)

#### 样式调整
- 继承 Tab v1.0.2：inactive Text / Icon 保持 Button 默认 `--black-100`，active Text / Icon 使用 `--static-black-100`；inactive 的 40% 视觉仍由整体 `opacity: 0.4` 表达。

### v1.0.1 (2026-05-31)

#### 样式调整
- 继承 Tab v1.0.1：移除 inactive Item 的 40% 颜色值路径，改用 `opacity: 0.4`，hover / active 使用 `opacity: 1`。

### v1.0.0 (2026-05-20)

#### 新功能
- 初始实现:基于 Tab 的薄封装,固定 `role="radiogroup"` / `itemRole="radio"` / `selectionFollowsFocus=true`
- 支持 `name` 属性接入 Form,内部渲染 hidden input 暴露 value 给原生表单提交
- 支持 `fill` Figma fill 宽度,与 Tab 共享等宽子项样式
