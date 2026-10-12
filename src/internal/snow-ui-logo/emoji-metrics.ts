/* SnowUI source notice | LICENSE 2.0.0: ../../../LICENSE
复制或移植时随附该版本完整 LICENSE 与第三方声明；同任务、同版本、同已确认用途不逐组件重复检查。 */
// 品牌专用：以系统 emoji 的实际着色像素边界匹配 32×32 图标，保持原始比例。
export const LOGO_EMOJI_FONT = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
export type EmojiMetrics = { size: number; x: number; y: number };
const cache = new Map<string, EmojiMetrics>();
export function measureLogoEmoji(value: string): EmojiMetrics {
  const existing = cache.get(value);
  if (existing) return existing;
  const fallback = { size: 32, x: 0, y: 28 };
  if (typeof document === 'undefined') return fallback;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 384;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return fallback;
  context.font = `128px ${LOGO_EMOJI_FONT}`;
  context.fillText(value, 128, 192);
  const pixels = context.getImageData(0, 0, 384, 384).data;
  let left = 384, right = -1, top = 384, bottom = -1;
  // 忽略字形纹理边角的低透明度噪点和薄阴影，以可见主体校准。
  for (let y = 0; y < 384; y++) {
    for (let x = 0; x < 384; x++) {
      if (pixels[(y * 384 + x) * 4 + 3] <= 64) continue;
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
  }
  if (right < left) return fallback;
  const scale = 32 / Math.max(right - left + 1, bottom - top + 1);
  const result = { size: 128 * scale, x: 16 - ((left + right + 1) / 2 - 128) * scale, y: 16 - ((top + bottom + 1) / 2 - 192) * scale };
  cache.set(value, result);
  return result;
}
