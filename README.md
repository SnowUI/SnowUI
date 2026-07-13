# SnowUI Components 项目说明

> **版本**: v1.1.0
> **更新**: 2026-02-05
> **职责**: 项目结构与开发环境说明

## 1. 项目概览

### 技术方案
- **框架**: Svelte 5 (Runes API)
- **构建**: Vite + TypeScript
- **包管理**: npm workspaces
- **样式**: 原生 CSS + `snowui.css` (Design System)

### 依赖关系
- **@snowui-design-system/resource-svelte**: 
  - **用途**: 提供图标、头像、插画等静态资源组件。
  - **引用方式**: 
    - 生产代码: `import { IconName } from "@snowui-design-system/resource-svelte";`
    - Vite 配置: 开发环境已通过 `alias` 映射到本地 workspace 源码。

---

## 2. 文件夹结构

| 目录 | 描述 |
| :--- | :--- |
| `src/components/` | 组件源码 (`.svelte`)、文档 (`.md`)、测试 (`.test.ts`) |
| `src/logic/` | 共享 TypeScript 逻辑 (`Frame Context`, `Context`) |
| `src/styles/` | Components 完整共享 CSS（含 `themes.css`、`components.css`、layout、tokens、scale、scrollbar） |
| `src/test/` | 组件预览和测试环境 |
| `src/demo/` | AI 调试用 Demo 文件 (不提交生产) |

---

## 3. Frame 组件 (核心)

Frame 是所有 SnowUI 组件的基石。**开发任何组件前，必须了解 Frame 的能力**。

- **文档**: [Frame.md](./src/components/Frame.md)
- **能力**: 响应式、上下文、截断、状态机、动效编排

---

## 4. 开发规范

> **核心文档**: 所有开发活动必须遵循 [AI_GUIDELINES.md](../AI_GUIDELINES.md) 和 [ComponentGuidelines.md](../specs/ComponentGuidelines.md)。

### 样式系统 (snowui.css)

本项目**严禁使用 Tailwind CSS**。必须使用 `snowui.css` 提供的 Token 变量与工具类。

- **Token 映射**: 参考 [FigmaToSnowUI.md](../specs/FigmaToSnowUI.md)
- **样式规范**: 参考 [StyleGuide.md](../specs/StyleGuide.md)

---

## 5. 测试与验证

### 测试项目 (`src/test`)
- **启动**: `npm run dev`
- **组件注册**: 新组件必须在 `src/test/component-registry.ts` 注册，并在 `src/index.ts` 导出

### 调试 Playground
- **用户测试**: `src/Playground.svelte` (不要修改)
- **AI 调试**: `src/demo/Demo.svelte` (不提交生产)
- **测试列表**: 访问 `/?page=test-list`

---

## 6. 文档规范

- **位置**: 组件文档与源码同名同级 (`Button.svelte` → `Button.md`)
- **同步原则**: 修改代码必须同步修改文档与 Changelog

---

## 7. 评审与发布

- **Review**: 组件开发完成后，调用 `review` 技能进行自我审查
- **发布**: 遵循语义化版本 (SemVer)
