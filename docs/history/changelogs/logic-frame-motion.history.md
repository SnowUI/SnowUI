# frame-motion 更新日志归档

### v2.1.0 (2026-01-20)
- **性能优化**: 合并 12 个独立 `$effect` 为单一差量更新 effect
- **新增**: `orchestrateTrigger` 属性支持 `appear`/`hover`/`click`/`scroll`/`none`
- **新增**: `orchestrateTarget` 属性支持 CSS 选择器指定编排目标
- **新增**: `scroll.offset` 配置支持自定义滚动触发偏移量

### v2.0.0
- 新增物理弹簧 (Spring Physics) 支持
- 新增滚动联动 (Scroll-Linked) 支持
- 新增共享元素转场 (Shared Element) 支持
