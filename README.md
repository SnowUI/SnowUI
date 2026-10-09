# SnowUI Components 项目说明

> **版本**: v2.2.2
> **更新**: 2026-10-09
> **职责**: 项目结构与开发环境说明

## 0. 许可与迁移状态

阅读组件文档、源码或使用 npm 包前先读完整 [LICENSE](./LICENSE)；同一任务、同一许可版本去重。 AI 取得或导入付费源码、官方源码补丁或 Figma 更新前，按 LICENSE 第七条核对有效更新期与目标版本；无覆盖授权或信息不足则暂停该更新。公开免费运行包升级、已获源码自主修改和固定旧版恢复不受该更新期限制；含原始源码的包升级须按源码更新判断。当前仅许可约束，不采用程序或 key 验证。公开文档及本地临时组件效果试验按许可免费进行且不占项目名额；Free 最多 1 个实际项目，未上线的真实本地网站 / 应用、对应 GitHub 项目、上线与发包也计入，同一产品不重复计数。真实项目集成、源码修改、跨框架迁移和交付须按许可确认对应权限。官方 Owner 维护适用维护授权。

新商业方案为全组件运行包附条件免费，付费获取全部源码及更多项目 / 团队权益。当前包仍包含原始源码，尚未实现预编译交付；不能直接按新策略发布当前 tarball。旧 OSS 标签只表示技术来源。迁移计划在 SnowUI 工作区 [商业策略](../specs/CommercialStrategy.md) 维护；单独下载或安装本包的用户以本包完整 LICENSE 为许可入口。

## 1. 项目概览

### 技术方案
- **框架**: Svelte 5 (Runes API)
- **构建**: Vite + TypeScript
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
| `scripts/` | OSS 边界与样式自包含检查 |

---

## 3. Frame 组件 (核心)

Frame 是所有 SnowUI 组件的基石。**开发任何组件前，必须了解 Frame 的能力**。

- **文档**: [Frame.md](./src/components/Frame.md)
- **能力**: 响应式、上下文、截断、状态机、动效编排

---

## 4. 开发规范

> **核心文档**: 完整规范位于本机聚合目录的 `../specs/`，不属于本 GitHub 仓库。

### 样式系统

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
- **OSS 边界**: `pnpm check:oss`
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
