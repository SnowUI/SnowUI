# src/styles/README 更新日志归档

### v1.5.0 (2026-02-07)

- **ST.8** 新增 `tokens.css`：提供文字、边框、圆角、padding、gap、Avatar、Icon、最小宽高等梯度 token（基准值 × 系数）。
- **ST.9** `index.css` 新增 `tokens.css` 引入，作为 `scale.css` 之前的 token 层。

### v1.4.0 (2026-02-07)

- **ST.6** `scale.css` 新增 width / mixed / aspect 三种计算依据（默认仍为 height）。
- **ST.7** `scale.css` 新增运行时宽度与高宽比回退链变量。

### v1.3.0 (2026-02-07)

- **ST.5** `scale.css` 增加运行时高度回退链（`--snowui-scale-height-runtime`），与 Frame Scale Observer 对齐。

### v1.2.0 (2026-02-07)

- **ST.3** `scale.css` 变量命名统一升级为 `--snowui-scale-*`，避免与组件变量命名冲突。
- **ST.4** `scale.md` 增补完整需求对齐章节（高度基准、可用空间、单行/多行/截断、Icon/Avatar 比例、覆盖优先级）。

### v1.1.0 (2026-02-07)

- **ST.1** 新增 `scale.css` 统一高度比例计算能力。
- **ST.2** 新增 `scale.md` 文档，定义比例变量与外部覆盖优先级。

### v1.0.0 (Initial)

- 初始版本。
