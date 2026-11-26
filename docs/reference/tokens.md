# SnowUI token directory

Tokens are extracted from current CSS declarations. The same name may have different values under different conditions; do not collapse them. Use a component's semantic public Props first.

| Token | Declared value | Condition |
| --- | --- | --- |
| `--text-scale` | `1` | :root |
| `--leading-scale` | `1` | :root |
| `--border-scale` | `1` | :root |
| `--radius-scale` | `1` | :root |
| `--padding-scale` | `1` | :root |
| `--gap-scale` | `1` | :root |
| `--size-scale` | `1` | :root |
| `--text-12` | `max(12px, calc(0.75rem * var(--text-scale)))` | :root |
| `--text-14` | `max(12px, calc(0.875rem * var(--text-scale)))` | :root |
| `--text-16` | `max(12px, calc(1rem * var(--text-scale)))` | :root |
| `--text-18` | `max(12px, calc(1.125rem * var(--text-scale)))` | :root |
| `--text-24` | `max(12px, calc(1.5rem * var(--text-scale)))` | :root |
| `--text-32` | `max(12px, calc(2rem * var(--text-scale)))` | :root |
| `--text-48` | `max(12px, calc(3rem * var(--text-scale)))` | :root |
| `--text-64` | `max(12px, calc(4rem * var(--text-scale)))` | :root |
| `--leading-12` | `calc(1rem * var(--leading-scale))` | :root |
| `--leading-14` | `calc(1.25rem * var(--leading-scale))` | :root |
| `--leading-16` | `calc(1.5rem * var(--leading-scale))` | :root |
| `--leading-18` | `calc(1.75rem * var(--leading-scale))` | :root |
| `--leading-24` | `calc(2rem * var(--leading-scale))` | :root |
| `--leading-32` | `calc(2.5rem * var(--leading-scale))` | :root |
| `--leading-48` | `calc(3.5rem * var(--leading-scale))` | :root |
| `--leading-64` | `calc(4.5rem * var(--leading-scale))` | :root |
| `--border-0` | `0` | :root |
| `--border-1` | `calc(0.03125rem * var(--border-scale))` | :root |
| `--border-2` | `calc(0.0625rem * var(--border-scale))` | :root |
| `--border-4` | `calc(0.125rem * var(--border-scale))` | :root |
| `--border-8` | `calc(0.25rem * var(--border-scale))` | :root |
| `--radius-0` | `0` | :root |
| `--radius-1` | `calc(0.25rem * var(--radius-scale))` | :root |
| `--radius-2` | `calc(0.5rem * var(--radius-scale))` | :root |
| `--radius-3` | `calc(0.75rem * var(--radius-scale))` | :root |
| `--radius-4` | `calc(1rem * var(--radius-scale))` | :root |
| `--radius-5` | `calc(1.25rem * var(--radius-scale))` | :root |
| `--radius-6` | `calc(1.5rem * var(--radius-scale))` | :root |
| `--radius-7` | `calc(1.75rem * var(--radius-scale))` | :root |
| `--radius-8` | `calc(2rem * var(--radius-scale))` | :root |
| `--radius-10` | `calc(2.5rem * var(--radius-scale))` | :root |
| `--radius-12` | `calc(3rem * var(--radius-scale))` | :root |
| `--radius-20` | `calc(5rem * var(--radius-scale))` | :root |
| `--radius-full` | `9999px` | :root |
| `--corner-shape-rounded-rectangle` | `superellipse(1.1)` | :root |
| `--size-3` | `calc(0.75rem * var(--size-scale))` | :root |
| `--size-4` | `calc(1rem * var(--size-scale))` | :root |
| `--size-5` | `calc(1.25rem * var(--size-scale))` | :root |
| `--size-6` | `calc(1.5rem * var(--size-scale))` | :root |
| `--size-7` | `calc(1.75rem * var(--size-scale))` | :root |
| `--size-8` | `calc(2rem * var(--size-scale))` | :root |
| `--size-10` | `calc(2.5rem * var(--size-scale))` | :root |
| `--size-12` | `calc(3rem * var(--size-scale))` | :root |
| `--size-14` | `calc(3.5rem * var(--size-scale))` | :root |
| `--size-16` | `calc(4rem * var(--size-scale))` | :root |
| `--size-18` | `calc(4.5rem * var(--size-scale))` | :root |
| `--size-20` | `calc(5rem * var(--size-scale))` | :root |
| `--size-full` | `100%` | :root |
| `--padding-0` | `0` | :root |
| `--padding-1` | `calc(0.25rem * var(--padding-scale))` | :root |
| `--padding-2` | `calc(0.5rem * var(--padding-scale))` | :root |
| `--padding-3` | `calc(0.75rem * var(--padding-scale))` | :root |
| `--padding-4` | `calc(1rem * var(--padding-scale))` | :root |
| `--padding-5` | `calc(1.25rem * var(--padding-scale))` | :root |
| `--padding-6` | `calc(1.5rem * var(--padding-scale))` | :root |
| `--padding-7` | `calc(1.75rem * var(--padding-scale))` | :root |
| `--padding-10` | `calc(2.5rem * var(--padding-scale))` | :root |
| `--padding-12` | `calc(3rem * var(--padding-scale))` | :root |
| `--gap-0` | `0` | :root |
| `--gap-1` | `calc(0.25rem * var(--gap-scale))` | :root |
| `--gap-2` | `calc(0.5rem * var(--gap-scale))` | :root |
| `--gap-3` | `calc(0.75rem * var(--gap-scale))` | :root |
| `--gap-4` | `calc(1rem * var(--gap-scale))` | :root |
| `--gap-5` | `calc(1.25rem * var(--gap-scale))` | :root |
| `--gap-6` | `calc(1.5rem * var(--gap-scale))` | :root |
| `--gap-7` | `calc(1.75rem * var(--gap-scale))` | :root |
| `--gap-10` | `calc(2.5rem * var(--gap-scale))` | :root |
| `--gap-12` | `calc(3rem * var(--gap-scale))` | :root |
| `--font-mono` | `'Menlo', 'Monaco', 'Courier New', monospace` | :root |
| `--font-inter` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | :root |
| `--font-noto` | `'Noto Sans', sans-serif` | :root |
| `--font-nunito` | `'Nunito Sans', sans-serif` | :root |
| `--font-figtree` | `'Figtree', sans-serif` | :root |
| `--font-family` | `var(--font-inter)` | :root |
| `--static-black-100` | `#000000FF` | :root |
| `--static-black-80` | `#000000CC` | :root |
| `--static-black-40` | `#00000066` | :root |
| `--static-black-20` | `#00000033` | :root |
| `--static-black-10` | `#0000001A` | :root |
| `--static-black-4` | `#0000000A` | :root |
| `--static-white-100` | `#FFFFFFFF` | :root |
| `--static-white-80` | `#FFFFFFCC` | :root |
| `--static-white-40` | `#FFFFFF66` | :root |
| `--static-white-20` | `#FFFFFF33` | :root |
| `--static-white-10` | `#FFFFFF1A` | :root |
| `--static-white-4` | `#FFFFFF0A` | :root |
| `--black-100` | `#000000FF` | :root |
| `--black-80` | `#000000CC` | :root |
| `--black-40` | `#00000066` | :root |
| `--black-20` | `#00000033` | :root |
| `--black-10` | `#0000001A` | :root |
| `--black-4` | `#0000000A` | :root |
| `--white-100` | `#FFFFFFFF` | :root |
| `--white-80` | `#FFFFFFCC` | :root |
| `--white-40` | `#FFFFFF66` | :root |
| `--white-20` | `#FFFFFF33` | :root |
| `--white-10` | `#FFFFFF1A` | :root |
| `--white-4` | `#FFFFFF0A` | :root |
| `--background-1` | `#FFFFFFFF` | :root |
| `--background-2` | `#F9F9FAFF` | :root |
| `--background-3` | `#FFFFFFE5` | :root |
| `--surface-1` | `#FFFFFFCC` | :root |
| `--surface-2` | `#00000008` | :root |
| `--surface-3` | `#00000005` | :root |
| `--secondary-purple` | `#B899EBFF` | :root |
| `--secondary-indigo` | `#ADADFBFF` | :root |
| `--secondary-blue` | `var(--brand)` | :root |
| `--secondary-cyan` | `#A0BCE8FF` | :root |
| `--secondary-mint` | `#6BE6D3FF` | :root |
| `--secondary-green` | `#71DD8CFF` | :root |
| `--secondary-yellow` | `#FFCC00FF` | :root |
| `--secondary-orange` | `#FFB55BFF` | :root |
| `--secondary-red` | `#FF4747FF` | :root |
| `--foreground` | `var(--black-100)` | :root |
| `--background` | `var(--background-1)` | :root |
| `--primary` | `var(--black-100)` | :root |
| `--brand` | `#33D1FFFF` | :root |
| `--color-1` | `#E6F1FDFF` | :root |
| `--color-2` | `#EDEEFCFF` | :root |
| `--black-100` | `#FFFFFFFF` | [theme='dark'] |
| `--black-80` | `#FFFFFFCC` | [theme='dark'] |
| `--black-40` | `#FFFFFF66` | [theme='dark'] |
| `--black-20` | `#FFFFFF33` | [theme='dark'] |
| `--black-10` | `#FFFFFF26` | [theme='dark'] |
| `--black-4` | `#FFFFFF1A` | [theme='dark'] |
| `--white-100` | `#000000FF` | [theme='dark'] |
| `--white-80` | `#000000CC` | [theme='dark'] |
| `--white-40` | `#00000066` | [theme='dark'] |
| `--white-20` | `#00000033` | [theme='dark'] |
| `--white-10` | `#0000001A` | [theme='dark'] |
| `--white-4` | `#0000000A` | [theme='dark'] |
| `--background-1` | `#333333FF` | [theme='dark'] |
| `--background-2` | `#FFFFFF0A` | [theme='dark'] |
| `--background-3` | `#404040E5` | [theme='dark'] |
| `--surface-1` | `#FFFFFF0A` | [theme='dark'] |
| `--surface-2` | `#0000001A` | [theme='dark'] |
| `--surface-3` | `#FFFFFF0A` | [theme='dark'] |
| `--primary` | `var(--black-40)` | [theme='dark'] |
| `--background-1` | `#F5F5F6FF` | [mode='ios'] |
| `--background-2` | `#FFFFFFFF` | [mode='ios'] |
| `--surface-1` | `#FFFFFFFF` | [mode='ios'] |
| `--secondary-purple` | `#AF52DEFF` | [mode='ios'] |
| `--secondary-indigo` | `#5856D6FF` | [mode='ios'] |
| `--secondary-cyan` | `#32ADE6FF` | [mode='ios'] |
| `--secondary-mint` | `#00C7BEFF` | [mode='ios'] |
| `--secondary-green` | `#34C759FF` | [mode='ios'] |
| `--secondary-orange` | `#FF9500FF` | [mode='ios'] |
| `--secondary-red` | `#FF3B30FF` | [mode='ios'] |
| `--primary` | `var(--brand)` | [mode='ios'] |
| `--brand` | `#007AFFFF` | [mode='ios'] |
| `--color-1` | `#E7EBF5FF` | [mode='ios'] |
| `--color-2` | `#E7E7EEFF` | [mode='ios'] |
| `--background-1` | `#333333FF` | [mode='ios'][theme='dark'] |
| `--background-2` | `#FFFFFF0A` | [mode='ios'][theme='dark'] |
| `--surface-1` | `#FFFFFF0A` | [mode='ios'][theme='dark'] |
| `--secondary-purple` | `#BF5AF2FF` | [mode='ios'][theme='dark'] |
| `--secondary-indigo` | `#5E5CE6FF` | [mode='ios'][theme='dark'] |
| `--secondary-cyan` | `#64D2FFFF` | [mode='ios'][theme='dark'] |
| `--secondary-mint` | `#63E6E2FF` | [mode='ios'][theme='dark'] |
| `--secondary-green` | `#30D158FF` | [mode='ios'][theme='dark'] |
| `--secondary-yellow` | `#FFD60AFF` | [mode='ios'][theme='dark'] |
| `--secondary-orange` | `#FF9F0AFF` | [mode='ios'][theme='dark'] |
| `--secondary-red` | `#FF453AFF` | [mode='ios'][theme='dark'] |
| `--brand` | `#0A84FFFF` | [mode='ios'][theme='dark'] |
