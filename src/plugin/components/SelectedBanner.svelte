<script>
  
  import SettingButton from "components/SettingButton.svelte";
  import { fly, fade } from "svelte/transition";
  import { selected } from "stores/font-selection.js";
  import { settings } from "stores/user-settings.js";
  import { isPhotoshop } from "stores/app-settings.js";
  
  const isWebApp = !$isPhotoshop;
  let count = 0;

  selected.subscribe( value => {
    count = value ? Object.keys(value).length : 0;
  });

</script>

{#if count > 0 }
  <section class="popover" class:webapp-popover={isWebApp} transition:fly={{ y: 100, duration: 100 }}>
    <div class="count">{count} selected</div>
    <div class="apply-typeface">
      <SettingButton 
        toggles={true}
        enabled={$settings.applyTypeface}
        on:click={() => settings.toggleSetting("applyTypeface")}>
        Auto-Apply to Text Layer
        </SettingButton>
    </div>
  </section>
{/if}

<style>
  .popover {
    font-size: 1rem;
    position: fixed;
    bottom: 0;
    right: 0rem;
    left: 0rem;
    padding: 0.75rem 1.5rem;
    border-radius: 2px;
    background-color: var(--notifications-panel);
    display: flex;
    flex: 0 1 auto;
    justify-content: space-between;
    align-items: center;
  }

  .webapp-popover {
    left: auto;
    width: calc((var(--plugins-size) - 3rem) - 4px);
    right: 1rem;
  }

  .count {
    font-weight: 600;
  }



</style>