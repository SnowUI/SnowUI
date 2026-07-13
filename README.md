# SnowUI Components 项目说明

> **版本**: v2.0.0
> **更新**: 2026-07-13
> **职责**: 项目结构与开发环境说明

## 1. 项目概览

### 技术方案
- **框架**: Svelte 5 (Runes API)
- **构建**: Vite + TypeScript
- **包管理**: pnpm 独立 workspace
- **样式**: 包内 `src/styles/`，不依赖 `SnowUI/home` 或上级 `styles/`

### 依赖关系
- **@snowui-design-system/resource-svelte**: 
  - **用途**: 提供图标、头像、插画等静态资源组件。
  - **引用方式**: 
    - 生产代码: `import { IconName } from "@snowui-design-system/resource-svelte";`
    - Vite 配置: 使用已发布 npm 包。

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
