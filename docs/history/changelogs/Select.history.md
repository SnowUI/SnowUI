# Select 更新日志归档

### v3.2.4 (2026-10-17)

- 默认 `options` 模式在选项标签动态更新后立即使用当前数据，避免语言切换时触发器保留旧标签；显式 children 的注册协议不变。

### v3.2.3 (2026-10-14)

- 显式 children 和触发按钮自定义内容不再继承 Select 默认子项的 parts；options 模式保持原有配置入口。

- 2026-09-21：统一使用文档、源码属性表与 Site / LLM 阅读入口；仅文档修订，不改变组件行为。

### v3.2.2 (2026-08-29)

- `buttonTrigger` 的无视觉 wrapper 不再接入独立字段边框，避免通用 Field 样式覆盖真实 Button 宿主的 variant。

### v3.2.1 (2026-07-05)

- `buttonTrigger` 未提供 `triggerContent` 时依次回退到选中项、placeholder、ariaLabel，避免生成不可见的空 Button。
- Button trigger 补齐 trigger id，恢复 Listbox 的 `aria-labelledby` 关联。

### v3.2.0 (2026-07-02)

- 内置下拉指示图标使用 `ComponentIcon name="arrow-line-up-down"`；默认由 Components 自包含，应用级 `IconProvider` 可统一切换图标库。
- 保持直系 trailing 槽位协议；自定义 trailing 继续替换默认指示图标。

- **Select-Docs.2026-05-25** 源码顶部历史更新日志已归档；后续新增变更统一写入本文档 更新日志，源码顶部只保留职责、当前关键架构与文档路径。

### v3.0.0 (2026-04-18)

#### 架构升级
- **SEL-Break.1** Listbox 拆分为独立组件（Listbox.svelte + MenuItem.svelte）
- **SEL-Break.2** API 从 `<option>` children 切换到 `<Listbox>` + `<MenuItem>` 组合模式
- **SEL-Break.3** 表单提交改用 hidden `<input type="hidden">`，移除隐藏 `<select>` + MutationObserver
- **SEL-Break.4** 通过 `ListboxOwnerContext`（setContext）驱动子组件通信
- **SEL-Break.5** 移除 `multiple`、`nativeSize`、`autocomplete` 属性
- **SEL-Feat.2** 新增 `readonly` 属性

### v2.0.0 (2026-04-13)

#### 架构升级
- **SEL-Feat.1** 从原生 `<select>` 升级到完全自定义架构（Trigger button + fixed Listbox）

### v1.0.0 (2026-03-15)

#### 新功能
- **SEL-Feat.0** 新增基于 `Frame` 的原生下拉选择组件
