# BlurText

> **许可阅读**：首次阅读组件文档、源码或 npm 使用流程，先读完整 [LICENSE](../../LICENSE)；同任务同版本去重。公开 API 配置与内部实现修改分别按许可处理；旧 OSS / PRO 标签仅表示迁移期技术来源。

> **版本**: v1.0.0
> **职责**: 逐字从模糊与轻微下移中揭示文字。
> **包归属**: `@snowui-design-system/components/compat`

## 组件介绍

通过逐字变清晰、淡入与轻微上移呈现标题和短段落，保持自然换行、字号、行高与文字基线，适合欢迎语、介绍文案和内容揭示。

## 使用选择

<!-- usage-guide:start -->
静态内容使用 Text；模糊揭示使用 BlurText；纵向换字使用 SlotText / FlowText；字符扰动使用 ScrambleText。BlurText 接收纯文本，不承接富文本子树，不解释数字或计时器语义。长篇正文建议使用静态 Text，减少逐字滤镜的绘制成本。

<!-- usage-guide:end -->

## 快速开始

```svelte
<script lang="ts">
  import { BlurText } from '@snowui-design-system/components/compat';
</script>

<BlurText text="让灵感逐渐清晰。" size="--text-32" lineHeight="--leading-32" />
```

未传排版 Props 时继承父级。也可以直接使用 `class="text-32"`，无需包一层 Text。数字 size 的单位是 px；数字 lineHeight 是无单位倍率，固定行高用 Token 或 `"40px"`。

## API

| 关键字 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| text | `string \| number` | `""` | 最终纯文本，保留空格和换行 |
| speed | `number` | `1.5` | 字符启动速率，有限正数；错峰为 30ms / speed，单字固定 600ms；无效值回退 1.5 |
| animated | `boolean` | `true` | 关闭时立即呈现最终文本并清理内部动画 |
| playOnMount | `boolean` | `true` | 首次挂载且出现门禁放行后播放 |
| replayKey | `string \| number` | `0` | 值变化时重播当前全文 |
| respectMotionPreference | `boolean` | `true` | 遵循系统减少动效设置；运行中开启同样立即完成 |
| font | `string` | — | 字体或字体 Token |
| size | `string \| number` | — | 字号或字号 Token |
| weight | `string \| number` | — | 字重 |
| lineHeight | `string \| number` | — | 行高 Token、CSS 长度或无单位倍率 |
| color | `SnowUIColor \| string` | — | 最终文字色，支持 PascalCase 语义色 |
| align | `TextMotionAlign` | — | 文字对齐，默认继承 |
| motionColor | `TextMotionColor` | — | 可选逐字临时色，支持 chromatic()；结束后回到最终色 |

继承适用的 FrameProps，`tag` 默认 span，`as` 仍表示父组件角色。内部动效与根 Frame 的 `while*` 分层；`enableDefaultMotion={false}` 只关闭根默认动效。公开 `speed` 调整字符错峰，与参考站 speedReveal 对齐；单字时长固定 600ms；没有公开 duration、stagger、blur 或位移参数。速率修改从下一次文字更新或重播生效，不重启当前动画。临时颜色等待随揭示速率缩放，回落仍使用共享 280ms。

## 使用边界与详细说明

### 行为与无障碍

- 首次播放及 replayKey 更新揭示全文；text 更新立即提交最新内容并揭示。快速更新时仍在播放的相同位置字符从当前可见模糊、透明度与位移继续，旧回调不会覆盖新内容；不执行数字滚轮或旧文本退出动画。
- SSR 和无 JavaScript 输出完整文本。系统减少动效或 Web Animations API 缺失时保持静态可读内容。动画结束后移除所有内部 Animation。
- 根提供最终文本的稳定 aria-label；内部逐字视觉层 aria-hidden。语义标题使用 tag="h2" 等标签；默认 span 使用 img 角色表达完整文字，不逐字朗读。
- 换行由浏览器的 inline 排版决定，中文、英文单词、空格、显式换行不通过单字固定宽度或额外 margin 模拟。字体连字等最终效果由浏览器塑形决定。

## 参考来源

- 本地参考源码：`../../../../repos/animations-master/`（相对于本文档），其中 Blur Reveal 示例位于 `src/lib/components/spell/blur-reveal/blur-reveal.svelte`。
- 原站示例：[Svelte Animations · Blur Reveal](https://sv-animations.vercel.app/spell/blur-reveal)。
- 参考网站：[Text Motion Observatory · References](https://text-motion-observatory.farewelltowind.chatgpt.site/references)。

本地源码用于核对模糊揭示动效；参考网站作为补充案例入口。参考仓库不参与 SnowUI 构建或运行时依赖。

## AI Zone

- 根为 FramePro，主布局为内禀原子布局；enableAutoLayout / enableResponsive 关闭，enableContext 默认开启。根不实现额外子组件组合或 parts。
- 复用 text-motion 的 grapheme、typography、color、preference；复用 observeAppearanceRelease 的文档出现门禁。纯文本内容归 BlurText，宿主角色、状态、Skeleton 归 FramePro。
- 真实字符使用 inline-block；英文单词成组保持词间换行，非 ASCII 文本保留逐字换行机会。所有节点继承字号、行高与基线；不使用占位副本、绝对定位或伪元素绘制。根排版 selector 使用 :where，用户 class/style 可覆盖。没有新增公共几何 override。
- 私有视觉依据 animations-master 的 Blur Reveal：600ms 单字，错峰 30ms / speed（默认 1.5）；blur 12px、translateY 10px，默认 ease-out。透明度与滤镜各自使用 WAAPI，真实字符的 2D transform 由短生命周期 rAF 按同一动画进度更新；入场容器 300ms，曲线 cubic-bezier(0.25, 0.1, 0.35, 1)。颜色生命周期复用共享层，结束回落 280ms。
- 不导入第三方动效库、不依赖参考仓库；参考项目为 MIT。本实现以 SnowUI 公共能力重新实现，未复制参考运行时。
- 关闭 animated 不启动内部 Animation；减少动效监听只在 animated 且 respectMotionPreference 时接入，卸载清理。出现门禁仅在存在门禁时观察，首次放行后释放。动画结束即停止 rAF；无尺寸 Observer、无逐帧布局测量；每轮只在重定向时批量读取现有绘制状态。独立包体增量未测量。
- DOM：snowui-blur-text 根；data-blur-character 标记私有字符绘制节点。

## 更新日志

### v1.0.0 (2026-10-07)

- 按原站重新实现真实 inline-block 字符、独立滤镜与透明度、主线程 2D 位移；移除此前的 top 与伪元素方案。
- 公开 `speed` 速率倍率，与原站一致采用 0.5 / 1.5 / 2 的字符启动速率。
- 新增模糊逐字揭示、自然排版、重播、连续更新及减少动效退化。
