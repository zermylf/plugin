<ol>
  {#each fonts as font}
    <li>
      <FontFace 
        {isLocked} 
        {font} 
        selected={selected.includes(font.name)} 
        on:click 
        on:dragstart
        showPreview={$settings.previewFont}
      />
    </li>
  {/each}
</ol>

<style>
  ol {
    list-style: none;
    background-color: var(--panel-layer-0);
  }

</style>

<script>

  import FontFace from "components/FontFace.svelte";
  import { settings } from "stores/user-settings.js";
  import { setContext } from "svelte";

  export let fonts = null;
  export let selected = [];
  export let isLocked = false;

</script>