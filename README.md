# SnowUI Pro

SnowUI PRO 的私有源码仓库。PRO 组件以 `@snowui/components-pro` private package 发布到 GitHub Packages；完整源码仍保存在 `SnowUI/SnowUI-Pro` 私有仓库。

仓库包含 PRO 组件、Blocks、logic、lib 与 motion。使用者还需要安装公开包 `@snowui-design-system/components` 与 `@snowui-design-system/resource-svelte`，并加载 SnowUI Styles CSS。

## 本地检查

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm pack:check
```

## 发布

推送与 `package.json` 版本一致的 `v*` tag 后，由 GitHub Actions 使用仓库自己的 `GITHUB_TOKEN` 发布 private package。不得把 Personal Access Token 写入仓库。

安装方需要配置 GitHub Packages scope：

```ini
@snowui:registry=https://npm.pkg.github.com
```

本地安装使用具备 `read:packages` 权限的 GitHub Personal Access Token（classic），凭据只存放在用户级配置。GitHub Actions 中优先给消费仓库授予 package access，并使用该仓库的 `GITHUB_TOKEN`。

完整发布规则、凭据边界和版本顺序以 SnowUI 工作区的 `specs/ReleaseSpec.md` 为准。

本仓库及其源码为私有付费内容，未经授权不得分发。
