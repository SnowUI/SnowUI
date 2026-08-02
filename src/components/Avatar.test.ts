/**
 * Avatar.test.ts
 * v2.9.1
 *
 * 变更记录 (2026-02-03):
 * - 示例1覆盖全部尺寸
 * - 示例2覆盖全部尺寸与不同默认 Gradient 配色
 * - 示例3覆盖全部尺寸与不同徽标组合
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
<Avatar aria-label="A" size={16} />
<Avatar aria-label="B" size={20} />
<Avatar aria-label="C" size={24} />
<Avatar aria-label="D" size={28} />
<Avatar aria-label="E" size={32} />
<Avatar aria-label="F" size={40} />
<Avatar aria-label="G" size={48} />
<Avatar aria-label="H" size={80} />`,
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
            interaction: "图片与普通组件头像每次 pointer enter 随机一种单色，只对实际非透明图形叠加；Gradient 默认头像自行播放五色循环。第二项基础形变关闭，第三项用 gradientMotion 显式开启；aria-label 不再生成首字母，第四项为显式 empty 灰色用户图标；disabled 不响应。",
            performance: "Gradient Avatar 基础形变默认关闭；仅 gradientMotion=true 的实例运行四层 transform。原 media-hoverable visual + 自有 Overlay hover 组合保持不变。",
            accessibility: "prefers-reduced-motion: reduce 下关闭淡入淡出，保留静态随机颜色反馈。",
        },
        logic: ["DefaultGradient", "GradientMotionOptIn", "ApprovedGradientHover", "MediaHoverableVisual", "EmptyVariant", "AlphaOnlyOverlay", "GradientOwnedHover", "Disabled", "ReducedMotion"],
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
    },] as const;
