# GradientMotion 更新日志

### v4.0.1 (2026-08-15)

- 2026-09-21：统一使用文档、源码属性表与 Site / AI 阅读入口；仅文档修订，不改变组件行为。

- 2026-09-16（圆角边缘修复）：- 根层按最终 `radius` 使用单一 `clip-path` 与 alpha mask 裁切完整 WebGL 合成结果，canvas 不再重复应用圆角；同时移除 shader 横切轴两端额外的透明渐隐，避免浅色底层在轮廓内侧形成白色细边。扫光带自身的透明合成、palette 与运动算法保持不变。

- 将内置 shader palette、CSS fallback palette 与专用 `colors` 四色艺术输入正式登记为专业艺术色例外，并明确例外不扩展到组件其他样式和动效契约。

### v4.0.0 (2026-07-07)

#### glimm.dev 还原
- 移除旧 gradflow / Neat Blob 视觉算法，改为按 `glimm@0.1.4` 的 shader sweep 渐变效果实现。
- 内置 glimm 6 个 cosine palette：`prism`、`berry`、`lagoon`、`citrus`、`azure`、`ember`。
- 还原 gaussian band、edge wave、ripple、fresnel、specular、entry fade 与 premultiplied alpha 合成。
- 默认时长改为 glimm 的 `800ms` sweep；旧预设名保留为兼容别名。

### v3.3.0 (2026-06-13)

#### Neat Blob
- 新增 `variant="neatBlob"`，效果名称由 SnowUI 侧命名，参数来源为 `repos/neat-main/editor/src/components/presets.ts` 的 `BLOB_PRESET`。

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
