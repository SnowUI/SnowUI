/**
 * Avatar.test.ts
 * v2.12.4
 *
 * 变更记录 (2026-02-03):
 * - 示例1覆盖全部尺寸
 * - 示例2覆盖全部尺寸、六种具名默认 Gradient 配色与稳定用户 ID seed
 * - 示例3覆盖全部尺寸与不同徽标组合
 * - 示例3验证 Badge / Icon 子内容进入 DOM；示例5验证 empty 与其他头像同排中线对齐
 */
export const examples = [
    {
        name: "1: 全部尺寸",
        code: `1
<Avatar src={AvatarByewind} size={80} />
<Avatar src={AvatarByewind} size={48} />
<Avatar src={AvatarByewind} size={40} />
<Avatar src={AvatarByewind} size={32} />
<Avatar src={AvatarByewind} size={28} />
<Avatar src={AvatarByewind} size={24} />
<Avatar src={AvatarByewind} size={20} />
<Avatar src={AvatarByewind} size={16} />
<Avatar src={AvatarByewind} size={12} />`,
    },
    {
        name: "2: 默认 Gradient 与尺寸",
        code: `2
<Avatar fallbackColor="blue" aria-label="Blue default avatar" size={16} />
<Avatar fallbackColor="cyan" aria-label="Cyan default avatar" size={20} />
<Avatar fallbackColor="green" aria-label="Green default avatar" size={24} />
<Avatar fallbackColor="red" aria-label="Red default avatar" size={28} />
<Avatar fallbackColor="orange" aria-label="Orange default avatar" size={32} />
<Avatar fallbackColor="purple" aria-label="Purple default avatar" size={40} />
<Avatar fallbackSeed="user-42" aria-label="Stable user 42" size={48} />
<Avatar fallbackSeed="user-108" aria-label="Stable user 108" size={80} />`,
        expected: {
            render: "六种 fallbackColor 分别渲染对应具名 Gradient；fallbackSeed 由稳定用户 ID 确定性映射，相同 ID 跨刷新保持同色。",
        },
        logic: ["NamedFallbackColor", "StableFallbackSeed", "FixedAnonymousDefault"],
    },
    {
        name: "3: 徽标组合与尺寸",
        code: `3
<Avatar size={16}>
    <Badge as="badge" dot />
</Avatar>
<Avatar size={20}>
    <Badge as="badge" count={3} />
</Avatar>
<Avatar size={24}>
    <Icon as="badge" background>
        <Check />
    </Icon>
</Avatar>
<Avatar size={28}>
    <Badge as="badge" dot />
</Avatar>
<Avatar size={32}>
    <Badge as="badge" count={8} />
</Avatar>
<Avatar size={40}>
    <Icon as="badge" background>
        <Check />
    </Icon>
</Avatar>
<Avatar size={48}>
    <Badge as="badge" dot />
</Avatar>
<Avatar size={80}>
    <Badge as="badge" count={99} />
</Avatar>`,
        expected: {
            layout: "8 个 Avatar 的 Badge / Icon 均渲染在头像裁切容器之外；不同尺寸按统一中线排列。",
        },
        logic: ["BadgeChildren", "BadgeCutout", "InlineMiddleAlignment"],
    },
    {
        name: "4: 角色与位置",
        code: `4
<Avatar src={AvatarByewind} size={48} badgePosition="bottom">
    <Badge as="badge" dot />
</Avatar>`,
    },
    {
        name: "5: 默认头像与 Hover",
        code: `5
<Avatar src={AvatarByewind} data-name="image" size={80} />
<Avatar fallback={Gradient} data-name="blue" size={80} />
<Avatar aria-label="A" size={80} gradientMotion />
<Avatar variant="empty" size={80} />
<Avatar src={SnowLogo} data-name="logo" size={80} />
<Avatar fallback={Gradient} data-name="purple" size={80} disabled />`,
        expected: {
            interaction: "图片与普通组件头像每次 pointer enter 随机一种单色，只对实际非透明图形叠加；Gradient 默认头像自行播放五色循环，并按需淡入四层七段非对称水波形变，每次进入随机更换且不重复上一组相位 / 方向。第二项常态基础形变关闭，第三项用 gradientMotion 显式常驻开启；aria-label 不再生成首字母，第四项为显式 empty 灰色用户图标；disabled 不响应。",
            performance: "Gradient Avatar 常态只渲染 lazy / async / low-priority 的共享静态图，不创建 Gradient 组件；gradientMotion=true 时常驻完整 Gradient，默认头像只在 hover 期间挂载 Gradient 与四个无 filter DOM 的预栅格 SVG 图层，退出淡出后恢复缓存静态图。",
            accessibility: "prefers-reduced-motion: reduce 下关闭淡入淡出，保留静态随机颜色反馈。",
        },
        logic: ["DefaultGradient", "GradientMotionOptIn", "ApprovedGradientHover", "MediaHoverableVisual", "EmptyVariant", "InlineMiddleAlignment", "AlphaOnlyOverlay", "GradientOwnedHover", "Disabled", "ReducedMotion"],
    },

    {
        name: "Custom 20-09-30",
        code: `<section class=" flex flex-row items-center p-40 gap-16 justify-center">
    <div class="flex gap-8 flex-col items-center">
        <Avatar src={AvatarByewind} size={80} />
        <Avatar src={AvatarByewind} size={48} />
        <Avatar src={AvatarByewind} size={40} />
        <Avatar src={AvatarByewind} size={32} />
        <Avatar src={AvatarByewind} size={28} />
        <Avatar src={AvatarByewind} size={24} />
        <Avatar src={AvatarByewind} size={20} />
        <Avatar src={AvatarByewind} size={16} />
        <Avatar src={AvatarByewind} size={12} />
    </div>

    <div class="flex gap-8 flex-col items-center">
        <Avatar src={AvatarByewind} size={80}
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={48}
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={40}
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={32}
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={28}
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={24}
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={20}
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={16}
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={12}
            ><Badge as="badge" /></Avatar
        >
    </div>
    <div class="flex gap-8 flex-col items-center">
        <Avatar src={AvatarByewind} size={80} badgePosition="bottom"
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={48} badgePosition="bottom"
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={40} badgePosition="bottom"
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={32} badgePosition="bottom"
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={28} badgePosition="bottom"
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={24} badgePosition="bottom"
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={20} badgePosition="bottom"
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={16} badgePosition="bottom"
            ><Badge as="badge" /></Avatar
        >
        <Avatar src={AvatarByewind} size={12} badgePosition="bottom"
            ><Badge as="badge" /></Avatar
        >
    </div>
    <div class="flex gap-8 flex-col items-center">
        <Avatar aria-label="H" size={80} />
        <Avatar aria-label="G" size={48} />
        <Avatar aria-label="F" size={40} />
        <Avatar aria-label="E" size={32} />
        <Avatar aria-label="D" size={28} />
        <Avatar aria-label="C" size={24} />
        <Avatar aria-label="B" size={20} />
        <Avatar aria-label="A" size={16} />
        <Avatar aria-label="A" size={12} />
    </div>
    <div class="flex gap-8 flex-col items-center">
        <Avatar src={SnowLogo} size={80}><Badge as="badge" /></Avatar>
        <Avatar src={SnowLogo} size={48}><Badge as="badge" /></Avatar>
        <Avatar src={SnowLogo} size={40}><Badge as="badge" /></Avatar>
        <Avatar src={SnowLogo} size={32}><Badge as="badge" /></Avatar>
        <Avatar src={SnowLogo} size={28}><Badge as="badge" /></Avatar>
        <Avatar src={SnowLogo} size={24}><Badge as="badge" /></Avatar>
        <Avatar src={SnowLogo} size={20}><Badge as="badge" /></Avatar>
        <Avatar src={SnowLogo} size={16}><Badge as="badge" /></Avatar>
        <Avatar src={SnowLogo} size={12}><Badge as="badge" /></Avatar>
    </div>
    <div class="flex gap-8 flex-col items-center">
        <Avatar size={80}><Badge as="badge" count={8} /></Avatar>
        <Avatar size={48}><Badge as="badge" count={8} /></Avatar>
        <Avatar size={40}><Badge as="badge" count={8} /></Avatar>
        <Avatar size={32}><Badge as="badge" count={8} /></Avatar>
        <Avatar size={28}><Badge as="badge" count={8} /></Avatar>
        <Avatar size={24}><Badge as="badge" count={8} /></Avatar>
        <Avatar size={20}><Badge as="badge" count={8} /></Avatar>
        <Avatar size={16}><Badge as="badge" count={8} /></Avatar>
        <Avatar size={12}><Badge as="badge" count={8} /></Avatar>
    </div>
    <div class="flex gap-8 flex-col items-center">
        <Avatar size={80}
            ><Icon as="badge">
                <FourLeafClover />
            </Icon></Avatar
        >
        <Avatar size={48}
            ><Icon as="badge">
                <FourLeafClover />
            </Icon></Avatar
        >
        <Avatar size={40}
            ><Icon as="badge">
                <FourLeafClover />
            </Icon></Avatar
        >
        <Avatar size={32}
            ><Icon as="badge">
                <FourLeafClover />
            </Icon></Avatar
        >
        <Avatar size={28}
            ><Icon as="badge">
                <FourLeafClover />
            </Icon></Avatar
        >
        <Avatar size={24}
            ><Icon as="badge">
                <FourLeafClover />
            </Icon></Avatar
        >
        <Avatar size={20}
            ><Icon as="badge">
                <FourLeafClover />
            </Icon></Avatar
        >
        <Avatar size={16}
            ><Icon as="badge">
                <FourLeafClover />
            </Icon></Avatar
        >
        <Avatar size={12}
            ><Icon as="badge">
                <FourLeafClover />
            </Icon></Avatar
        >
    </div>
</section>`,
        logic: ["UserCreated"],
    },
    {
        name: "自动媒体骨架",
        code: `8
<Avatar size={40} src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='gray'/%3E%3C/svg%3E" />
<Avatar size={40} src="data:image/png;base64,invalid" />`,
        expected: { render: "字符串图片在加载时自动显示圆形骨架，成功后显示图片，失败时恢复回退头像。无需在使用页面编写 Skeleton。" },
        logic: ["AutomaticMediaSkeleton", "MediaErrorFallback"],
    },
    {
        name: "背景模糊",
        code: `9
<Avatar size={40} variant="empty" backgroundBlur />
<Avatar size={40} variant="empty" backgroundBlur={false} />`,
        expected: { render: "开启实例使用与Button相同的20px背景模糊；关闭实例保持原样，默认关闭。" },
    },] as const;
