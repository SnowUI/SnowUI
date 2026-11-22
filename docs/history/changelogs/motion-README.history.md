# README 更新日志归档

### v1.1.0 (2026-05-12)

#### 新功能
- 新增 `primitives.ts`：将 `fade / scale / slide / stackTranslate` 作为 原子动效构建器纳入 `src/motion/`。
- 明确 `move.ts` 中的 slide 预设由原子动效组合而成。
- 明确跨 Frame 的动效编排由协调模块拥有；motion 目录只承载单 Frame 自身可复用的动效资源。
