# src/logic/frame-scale-observer 更新日志归档

### v1.2.0 (2026-02-07)

- **SOBS.4** 新增 `sizeVar`，输出统一运行时尺寸变量。
- **SOBS.5** 新增 `basis` / `mixHeightWeight` / `aspectBaseRatio` / `sizeRatio`，使运行时尺寸计算与 scale 配置对齐。

### v1.1.0 (2026-02-07)

- **SOBS.2** 新增运行时宽度与高宽比变量写入能力。
- **SOBS.3** 导出函数名统一为 `frameScaleObserver`，与文件名语义一致。

### v1.0.0 (2026-02-07)

- **SOBS.1** 新增尺寸监听 action，向 CSS 变量写入运行时尺寸。
