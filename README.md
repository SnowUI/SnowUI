# SnowUI Pro

SnowUI PRO 的私有源码仓库，对应 npm 私有包 `@snowui-design-system/components-pro`。

仓库包含 PRO 组件、Blocks、logic、lib 与 motion。使用者还需要安装公开包 `@snowui-design-system/components` 与 `@snowui-design-system/resource-svelte`，并加载 SnowUI Styles CSS。

## 本地检查

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm pack --dry-run
```

## 发布

发布规则、凭据边界和版本顺序以 SnowUI 工作区的 `specs/ReleaseSpec.md` 为准。

本仓库及其源码为私有付费内容，未经授权不得分发。
