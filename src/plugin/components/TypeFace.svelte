<article 
  class="typeface-container" 
  bind:this={el}
>

  <main 
    class="typeface" 
    class:selected 
    on:click={clickTypeface} 
    draggable={true}
    on:dragstart={dragStart}
    on:dragend={dragEnd}

  >
    <div class="left-align">
      <div class="icon-section">
        <ExpandableIcon {expanded} on:click={toggleFonts} disabled={!hasStyles} />
      </div>
  
      {#if hasStyles}
        <h1 class="name">{typeface.family}</h1>
        <h3 class="styles-count" on:click={toggleFonts}>{styleCountMessage}</h3>
      {:else}
        <h1 class="name">{typeface.family}</h1>
        <h3 class="styles-count">{typeface.variants[0].description}</h3>
      {/if}

    </div>
    <div class="right-align">
      {#if $displayPreview}
        <TypefacePreview font={previewFont} />
      {/if}
      {#if !isLocked}
        <Icon 
          icon={expanded ? "clear_all" : "remove"} 
          color="var(--muted-color)" 
          hover="var(--foreground-color)" 
          on:click={removeTypeface} />
      {/if} 
    </div>

  </main>

  {#if expanded}
    <section class="typeface-variants" in:slide|local={{duration: 500}} out:slide|local={{duration: 200}}>
      <FontList 
        {isLocked} 
        fonts={typeface.variants} 
        selected={selectedVariants} 
        on:click={selectFont} 
        on:dragstart={childDragStart}
         />
    </section>
  {/if}
</article>


<style>
  .typeface-container {
    position: relative;
  }

  .typeface-preview {
    pointer-events: none;
    position: absolute;
    top: -5rem;
    width: 100%;
  }

  .typeface {
    padding: 0.5rem 1rem 0.5rem 0.5rem;
    background-color: var(--panel-item);
    border-bottom: var(--panel-border);
    border-bottom-width: 2px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-items: center;
    flex: 0 1 auto;
  }

  .left-align,
  .right-align {
    display: flex;
    flex: 0 1 auto;
    align-items: center;
  }

   .typeface:hover {
    background-color: var(--panel-item-hover);
    cursor: default;
    user-select: none;
  }

  .typeface.selected {
    background-color: var(--selected-background);
    color: var(--selected-color);
    transition: 0.1s ease-out background-color;
    position: sticky;
    top: 0;
    bottom: 0;
    z-index: 0;
  }

  .icon-section {
    width: 1.5rem;
  }

  .name {
    font-size: 1.2rem;
    margin: 0 0 0 0.5rem;
    font-weight: 400;
  }

  .styles-count {
    display: none;
  }

  @media (min-width: 20rem) {

    .styles-count {
      display: block;
      text-transform: uppercase;
      font-size: 0.8rem;
      font-weight: 400;
      letter-spacing: 0.5px;
      margin: 0 1rem;
      color: var(--muted-color);
      user-select: none;
    }
  }

  .styles-count:hover {
    color: var(--foreground-color);
  }
  

</style>

<script>

  import ExpandableIcon from "components/ExpandableIcon.svelte";
  import Icon from "components/Icon.svelte"
  import FontList from "components/FontList.svelte";
  import TypefacePreview from "components/TypefacePreview.svelte";

  import { selected as selectionStore } from "stores/font-selection.js";
  import { settings } from "stores/user-settings.js";
  import { displayPreview } from "stores/preview-fonts.js";
  import { applyTypeface } from "helpers/font-tool.js";

  import { createEventDispatcher, getContext } from "svelte";
  import { slide } from 'svelte/transition';

  export let typeface = null;
  
  export let expanded = false; // whether the fonts of this typeface are displayed
  export let selected = false; // whether this typeface is selected
  export let selectedVariants = []; // list of the font names `font.name
  export let isLocked = false;

  const dispatch = createEventDispatcher();

  // keep our selected variants in sync
  selectionStore.subscribe(store => {
    const variants = store[typeface.family];
    // if the key-value exists, this typeface is selected
    selected == !!variants; 
    selectedVariants = variants || [];
  });

  // dom node
  let el;

  let styleCount = typeface.variants.length;
  $: styleCountMessage = `${styleCount} ${styleCount === 1 ? "style" : "styles" }`;
  $: hasStyles = styleCount > 1;

  const previewFont = typeface.variants[0];

  function toggleFonts(e) {
    e.stopPropagation();
    expanded = !expanded;
  }

  function clickTypeface(e) {
    selectionStore.toggleTypeface(typeface, !selected, !e.ctrlKey);
    if ($settings.applyTypeface) {
      applyTypeface(typeface);
    }
  }

  function selectFont(e) {
    const variant = e.data.font;
    selectionStore.toggleVariant(typeface, variant);
    if ($settings.applyTypeface) {
      applyTypeface(typeface, variant);
    }
  }

  function removeTypeface(e) {
    dispatch("remove", typeface);
  }

  // handler for dragging the typeface
  function dragStart(e) {
    if (!selected) clickTypeface(e);
  }

  // handler for dragging a font face
  function childDragStart(e) {
    const { font, selected: fontSelected } = e.data;

    // dragging a single font that is not selected will select only the single font
    if (!fontSelected) {
      selectFont(e);
    }
  }

  function fontListHandler(e) {
    setPreviewFont(e.data.font)
  }

  function setPreviewFont(variant) {
    // console.log("setting store to", variant.name)
    previewFont.set(variant);
  }


  function dragEnd() {
    // el.style.opacity = null;
  }
</script>