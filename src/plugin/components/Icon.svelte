<i class="material-icons"
  {style}
  class:disabled
  class:large={size === "large"}
  class:blink
  on:click
  on:mouseenter={() => hovering = true}
  on:mouseleave={() => hovering = false}
>{icon}</i>

<style>
  .disabled {
    color: var(--panel-layer-0) !important;
    pointer-events: none;
  }

  .material-icons {
    font-display: block;
  }

  .large {
    font-size: 36px;
  }

  .blink {
    animation: 0.5s linear blink infinite alternate-reverse;
  }

  @keyframes blink {
    from {
      opacity: 1;
    }

    to {
      opacity: 0.5;
    }
  }
</style>

<script>
  let hovering = false;
  export let color = "inherit";
  export let hover = null;
  export let icon = "report";
  export let disabled = false;
  export let size = null;
  export let blink = false;
  $: c = hover !== null && hovering ? hover : color;
  $: style = `color: ${c};`;
  
</script>