## AI 截图命令与图片索引

先按场景选择组件；只有外观不确定时才读取该组件的图片索引和所需图片，不默认加载全库截图。

### 生成截图（本地工作区）

在 SnowUI 工作区的 `site/` 目录运行，需要已安装项目依赖和 Playwright Chromium：

```sh
# 指定组件的单个示例；示例 id 从该组件 images.json 或 examples.md 获取
pnpm docs:images -- --component Button --example usage
# 指定组件全部示例
pnpm docs:images -- --component Button
# 全库仅刷新缺失或过期图片
pnpm docs:images -- --stale
# 只检查全库图片与索引，不生成
pnpm docs:images:check
```

命令自动构建隔离预览并从真实 Site 示例截图，不需要点击网页按钮。省略全部参数会重拍全库。定向截图不替代提交 main 前的 `pnpm main:prepare`；新组件尚无获准 Site 示例或无可见内容时，可能没有图片。

### 读取索引与图片

| 用途 | 本地路径（相对 site/） | 网站路径（相对 Site 域名） |
| --- | --- | --- |
| 首选：单组件索引 | `static/llms/components/<slug>/images.json` | `/llms/components/<slug>/images.json` |
| 按需：全库索引 | `static/llms/screenshots.json` | `/llms/screenshots.json` |
| 图片 | `static/examples/images/<slug>/<example>.png` | `/examples/images/<slug>/<example>.png` |

例如 Button 的 slug 是 `button`，默认示例 id 是 `usage`。索引中的 `image` 已提供图片的网站路径；本地读取时在该路径前加 `site/static`。只读取 `status: captured` 且与索引顶层 `fingerprint` 一致的记录，再按 `example`、`theme`、`state`、`width` / `height` 选择所需图片。`sha256` 用于文件完整性检查；本地是否匹配最新源码由 `docs:images:check` 验证，仅查看状态不能证明源码新鲜度。

网站访问者可以直接读取已发布索引和图片；生成命令只在具备源码与依赖的本地工作区运行。截图只表示记录的主题和状态，不代表未采集的 hover、open 或 dark 状态，也不能代替 API 与交互验证。
