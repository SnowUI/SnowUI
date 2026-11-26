# BlurText changelog

Reviewed against Chinese source SHA-256 `dc9929a9eb0f6e23a7ce490d7046eee1f4cbd4458302a8cbf43f15c1c53b9172`. For version differences, check the installed package as well.

<a id="v100-2026-10-07"></a>

### v1.0.0 (2026-10-07)

- Reimplemented the original site behavior with real inline-block characters, independent blur filters and opacity, and main-thread 2D translation; removed the earlier top-position and pseudo-element approach.
- Exposed `speed` as a rate multiplier, using character start rates of 0.5, 1.5, and 2 to match the original site.
- Added blurred character-by-character reveal, natural text layout, replay, continuous updates, and a reduced-motion fallback.

[Component guide](../blur-text.md) · [Full reference](./reference.md)
