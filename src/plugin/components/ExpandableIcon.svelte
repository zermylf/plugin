<Icon {icon} 
  {disabled}
  color="var(--muted-color)"
  hover="var(--body-color)"
  on:click={expandSection} 
  on:click 
/>

<script>
  import Icon from "components/Icon.svelte";

  export let disabled = false;
  export let expanded = false;
  $: icon = expanded ? "keyboard_arrow_down" : "keyboard_arrow_right";

  const expandSection = (e) => {
    expanded = !expanded;
    e.data = expanded;
  }

</script>