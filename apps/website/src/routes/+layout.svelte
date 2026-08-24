<script lang="ts">
import '../app.css'

let { children } = $props()
</script>

<svelte:head> <link rel="icon" href="/aven-logo.svg" type="image/svg+xml"> </svelte:head>

{@render children()}
