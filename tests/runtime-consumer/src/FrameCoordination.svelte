<script lang="ts">
import { Frame, initMotion } from '@snowui-design-system/components';
const motion = initMotion();
let calls = $state(0);
const play = motion.Play.bind(motion);
motion.Play = (id, options) => { if (id === 'coordinated-target') calls += 1; return play(id, options); };
</script>
<Frame styles={{ '#coordinated-target': { opacity: 0.4 } }}>
  <Frame id="coordinated-target" enableDefaultMotion={false}>Shared target</Frame>
  <Frame tag="button" Click={{ target: 'coordinated-target', action: 'play' }}>Coordinate target</Frame>
  <span data-testid="coordination-count">{calls}</span>
</Frame>
