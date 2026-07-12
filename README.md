# SnowUI Pro

SnowUI PRO 的私有源码仓库。PRO 不发布 npm，仅通过 `SnowUI/SnowUI-Pro` 私有 GitHub 仓库交付。

仓库包含 PRO 组件、Blocks、logic、lib 与 motion。使用者还需要安装公开包 `@snowui-design-system/components` 与 `@snowui-design-system/resource-svelte`，并加载 SnowUI Styles CSS。

## 本地检查

```bash
pnpm install --frozen-lockfile
pnpm check
```

## 发布

发布规则、凭据边界和版本顺序以 SnowUI 工作区的 `specs/ReleaseSpec.md` 为准。

本仓库及其源码为私有付费内容，未经授权不得分发。
