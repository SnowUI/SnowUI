<script lang="ts">
import {CodeBlock, Icon} from '@snowui-design-system/components';
const code='const profileName = "Complete source line retained for horizontal scrolling and exact copy";';
</script>
<section data-package-code-width style="width:320px">
    <CodeBlock class="package-inline-code" variant="singleLine" {code} enableResponsive responsive={{direction:'column',minGap:0,childrenWidth:'fill'}}><Icon as="leading"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h10v10H3z"/></svg></Icon></CodeBlock>
    <CodeBlock class="package-short-code" variant="singleLine" code="x" />
    <CodeBlock class="package-code-default" {code} language="typescript-with-a-long-label" format={false} showLineNumbers />
    <output data-testid="package-code-source">{code}</output>
</section>
