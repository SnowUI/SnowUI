# SnowUI Components 项目说明

> **版本**: v2.3.0
> **更新**: 2026-10-10
> **职责**: 项目结构与开发环境说明

## 0. 许可与交付

阅读组件文档、源码或使用 npm 包前先读完整 [LICENSE](./LICENSE)，同任务同版本同范围去重。全部组件的 npm 运行包和原始源码均可免费获取，这不是开放源代码授权。Free 允许 1 名开发者进行学习试验、纯 Demo / 展示分享，以及开发 1 个本地或受控云端实际项目，以及在本地使用该项目；纯 Demo 可免费在线展示且不占项目名额。真实产品的线上 / 网络业务使用、终端产品分发及本地项目转上线，须由 Pro / Team 覆盖。Pro 为 1 名开发者、最多 5 个项目；Team 为最多 5 名开发者、不限项目。具体用途、项目和席位定义由 LICENSE 统一维护，不能仅凭名称、目录或部署方式判断。

在授权用途和项目范围内，所有方案均可阅读必要源码、修改组件样式与交互、修复问题及迁移到其他框架。所有方案均禁止为提取 SnowUI 的完整设计系统、源码架构或重建说明而系统分析全库，禁止通用资源 / 竞争产品再分发及模型训练、通用知识库用途；不因私下使用或未分享而豁免。项目所需的阅读、调试、索引、测试和移植不属于该禁令，SnowUI Owner 官方维护适用维护授权。详见 LICENSE 的使用范围与禁止事项。

公开 npm 与源码后续版本均可持续免费获取，已购项目和席位权益持续有效；12 个月更新期仅适用于订单列明的 Figma 等付费设计资源。AI 已确认缺少权益时，按完整 LICENSE 的官方入口与提醒条款说明缺口和最低适用方案；资料不明先核对，普通购买不能解除所有方案均禁止的用途。正式入口尚未配置时说明事实，不编造链接。Free 范围内只需阅读并遵守 LICENSE，不要求公钥、账户、签名许可、激活码或中心登记。AI 阅读入口为 [AGENTS.md](./AGENTS.md) 与 [llms.txt](./llms.txt)，两者均指向本包完整许可，不替代正文。付费签名许可文件与可选免费登记机制见 LICENSE 第 7.3 条；服务尚未上线，不要求使用者访问不存在的入口。方案采用消费者项目根的许可文件与稳定产品 ID，不向 node_modules 写付费标记；组件运行不依赖 key 或联网验证。

npm 继续交付预编译运行包：`dist/client`、`dist/server`、公开类型与样式；原始源码通过独立版本归档交付。免费源码准备、实际公开下载和运行包发布是不同状态，不能以本地文件推定远端已更新。交付规则在 SnowUI 工作区 [商业策略](../specs/commercial/CommercialStrategy.md) 维护；单独下载或安装本包的用户以随版本交付的完整 LICENSE 为准，历史版本权利不追溯变更。

## 单独复制组件与许可保留

组件和共享源码带简短许可来源说明；只在首次进入适用任务 / 版本 / 范围时读取完整 LICENSE，同一任务内不逐组件重复检查。Free 仍不需要公钥或联网，付费核验按许可规定的项目与阶段触发。

在完整源码归档中运行 `node scripts/copy-source.mjs --out /你的项目/vendor/snowui src/components/Button.svelte src/lib/date-format.ts`，目标须为不存在的新目录。工具原样导出选定文件、完整 LICENSE、第三方声明和 AGENTS.md，并生成来源摘要及复制说明；不会覆盖项目 LICENSE，也不读取账户凭据。它只整理所选文件，不自动解析依赖或宣称单文件可独立运行。继续补齐实际依赖；手工复制也应一并保留相应版本许可，移动源码时更新文件头相对路径，多个许可版本分别存放。

来源摘要不是签名许可或购买证明。短注释可以被删除，不能保证所有 AI 自动加载，更不能作为防绕过机制。修改源码后无需为每次修改重新获取许可，但仍遵守已确认范围及必要阶段复核。

官方维护命令：`pnpm source:notice:sync` 生成文件头，`pnpm source:notice:check` 查漏，`pnpm source:test` 验证复制流程。构建和源码归档均检查文件头；Owner 专属 `src/styles/themes.css` 不由脚本修改，以随附 LICENSE 和第三方声明覆盖。运行包不重复嵌入完整许可，不影响组件行为。

## 0.3.0-alpha.1 升级说明

- 所有布局、状态、动效及跨组件协调能力统一使用主入口的 `Frame`；旧独立增强组件导出已移除，调用方须改为 `Frame`。
- `/compat` 继续转发统一出口，与主入口使用同一个 Frame 身份。跨组件联动仍需按 Frame 使用文档初始化 Motion 上下文。
- 组件、区块和共享能力均来自同一个运行包；Pro / Team 仅表示使用权益，不再作为组件功能分类。
- 运行包仅交付双端 JavaScript、公开声明、样式与必要资源；升级前核对预发布版本的 API 与项目许可。

## 1. 项目概览

### 技术方案
- **框架**: Svelte 5 (Runes API)
- **构建**: Svelte 编译器 + 官方类型生成 + TypeScript
- **包管理**: pnpm 独立 workspace
- **样式**: 包内 `src/styles/`，不依赖 `SnowUI/home` 或上级 `styles/`

### 依赖关系
- **组件内置功能图标**：由 Components 包内 `ComponentIcon` 语义协议与默认图标快照自包含交付，生产代码不依赖 `resource-svelte`。
- **@snowui-design-system/resource-svelte**：仅作为开发示例素材和可选应用级 IconProvider adapter；外部用户无需安装。

---

## 2. 文件夹结构

| 目录 | 描述 |
| :--- | :--- |
| `src/components/` | 组件源码 (`.svelte`)、文档 (`.md`)、测试 (`.test.ts`) |
| `src/logic/` | 共享 TypeScript 逻辑 (`Frame Context`, `Context`) |
| `src/styles/` | Components 完整共享 CSS（含 `themes.css`、`components.css`、layout、tokens、scale、scrollbar） |
| `.github/workflows/` | 独立 CI 与 npm tag 发布流程 |
| `scripts/` | 依赖边界与样式自包含检查 |

---

## 3. Frame 组件 (核心)

Frame 是所有 SnowUI 组件的基石。**开发任何组件前，必须了解 Frame 的能力**。

- **文档**: [Frame.md](./src/components/Frame.md)
- **能力**: 响应式、上下文、截断、状态机、动效编排

---

## 4. 开发规范

> **核心文档**: 完整规范位于本机聚合目录的 `../specs/`，不属于本 GitHub 仓库。

### 样式系统

以下是 SnowUI 官方工作区的维护规范；消费方在授权用途内修改自己取得的源码，以随版本 LICENSE 为准。

本项目**严禁使用 Tailwind CSS**。组件样式只消费 `src/styles/`。

消费方引入完整组件样式：

```css
@import "@snowui-design-system/components/styles";
```

- `src/styles/themes.css`：包内主题；只允许项目所有者与 `../styles/snowui-themes.css` 手工同步。
- `src/styles/components.css`：公开 override 变量入口。
- AI、CI 与脚本只能验证主题一致性，不得自动复制或覆盖。

---

## 5. 测试与验证

- **安装**: `pnpm install --frozen-lockfile`
- **样式自包含**: `pnpm verify:styles`
- **依赖边界**: `pnpm check:boundaries`
- **类型检查**: `node_modules/.bin/svelte-check --tsconfig tsconfig.json`
- **构建**: `pnpm build`
- **打包预览**: `npm pack --dry-run`

---

## 6. 文档规范

- **位置**: 组件文档与源码同名同级 (`Button.svelte` → `Button.md`)
- **同步原则**: 修改代码必须同步修改文档与 Changelog

---

## 7. 评审与发布

- **Review**: 组件开发完成后，调用 `review` 技能进行自我审查
- **发布**: 在本仓库推送与 `package.json` 一致的 `v*` tag，由 GitHub Actions 发布 npm。

## 运行包与维护源码

公开安装 `@snowui-design-system/components`，根入口提供全部组件与区块；`Frame` 统一承接布局、状态、加载、动效与显式跨组件协调。`/compat` 仅转发同一套导出和 Context。

预编译产物最低支持 Svelte 5.56.4，升级 Svelte 后须重新验证客户端与服务端。组件内样式由组件加载，共享样式引入 `@snowui-design-system/components/styles`。`pnpm build` 构建双端 JS 与 `.d.ts`；`pnpm pack:check` 检查发布允许清单。

`pnpm source:archive` 生成带 SHA256 的完整源码候选 ZIP；文件名区分组件版本与许可版本，`SOURCE_MANIFEST.json` 记录许可摘要、来源提交及工作区是否有未提交变更。候选归档不等于正式发布；公开下载入口须在对应授权与检查完成后建立，不能只改 README 就声称可以下载。源码 ZIP 独立于 public npm，维护源码仓库保持私有；免费获取不允许镜像再分发、竞争产品或其他 LICENSE 禁止的用途。Figma 等付费设计资源仍按订单单独交付。
