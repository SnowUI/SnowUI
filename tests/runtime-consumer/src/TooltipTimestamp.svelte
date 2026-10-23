<script lang="ts">
import {Button, Tooltip, Frame, Text, Badge, Kbd} from '@snowui-design-system/components';
</script>
<section style="display:flex;gap:4px;min-height:220px;padding:20px">
    <Button scaleOnHover={false} data-package-time-trigger="status">Status
        <Tooltip variant="dark"><Frame data-package-time-content="status" column><Frame singleLine><Text lines={1} tooltip={false}>Deploy status</Text><Badge as="trailing" count="Ready"/></Frame><Text>Production is healthy</Text></Frame></Tooltip>
    </Button>
    <Button scaleOnHover={false} data-package-time-trigger="shortcut">Shortcut
        <Tooltip variant="dark"><Frame data-package-time-content="shortcut" singleLine><Text lines={1} tooltip={false}>Open command palette</Text><Kbd as="trailing">⌘ K</Kbd></Frame></Tooltip>
    </Button>
</section>
