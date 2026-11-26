# StyleButton 更新日志

### v1.0.4 (2026-09-02)

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

- 根据现有源码补齐逐属性说明、默认回退和使用边界；未改变组件运行时行为。

### v1.0.3 (2026-08-11)

- 无额外 children 时主动向 Button 声明 `iconOnly=true`；不再依赖 Logo DOM 自动识别。

### v1.0.2 (2026-08-11)

- Apple 状态改用 Apple 品牌 Logo 矢量，不再使用资源 Icon。
- 修复 SnowUI Logo 未被 Button 判定为 icon-only 导致两种状态左右 padding 不一致；两个状态现在统一使用 Button 原生 icon-only padding。

### v1.0.1 (2026-08-11)

- SnowUI / Apple 两个状态恢复为品牌 Logo；Logo 继续跟随 Button 图标尺寸上下文。

### v1.0.0 (2026-08-11)

- 首次实现 SnowUI / Apple 风格切换、SnowIcon / Apple Logo 内置图标及 Button 全变体兼容。
