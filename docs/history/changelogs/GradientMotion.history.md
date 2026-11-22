# GradientMotion 更新日志归档

### v3.2.0 (2026-06-13)

#### 预设还原
- 移除旧取色体系，改为完全使用 `meerbahadin/gradflow` 的 8 个内置预设。

### v3.1.0 (2026-06-13)

#### 视觉重写
- 参考 `meerbahadin/gradflow` 的 Wave shader，将渐变主算法重写为三色 smoothstep 混色 + 多层正弦波 / silk / smoke / stripe / conic 流动。

### v3.0.0 (2026-06-13)

#### 视觉重写
- 渐变效果彻底重写为内置 WebGL shader。

### v2.0.0 (2026-06-12)

#### 破坏性变更（仅视觉）
- 渐变效果彻底重写为 orbit + morph + glow 三层有机流体渐变。

### v1.0.0 (2026-06-10)

#### 新功能
- 新增 GradientMotion 组件，支持 6 种渐变预设、随机预设、速度控制、头像与背景场景。
