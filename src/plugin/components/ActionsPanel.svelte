<section class="actions-panel">
  
  <div class="panel-buttons">
    <section>
      <IconButton icon="folder" title="Create new group" on:click={createGroup} />
      <IconButton icon="settings" title="Open Settings" on:click={openSettings} />
    </section>

    <section class="button-group" on:click={toggleView} >
      <IconButton icon="view_list" disabled={listView} title="Change folders to grid view" />
      <IconButton icon="view_module" disabled={!listView} title="Change folders to list view" />
    </section>
    
    <IconButton disabled={isDeleteDisabled} icon="delete" title="Delete selected group" on:click={deleteSelectedGroup} />
    
  </div>

</section>

<style>

  .panel-buttons {
    display: flex;
    flex: 0 1 auto;
    justify-content: space-between;
  }

  .actions-panel {
    padding: 0.5rem 0.5rem;
    border-top: var(--panel-border);
  }

</style>

  <script>
    
    import IconButton from "components/IconButton.svelte";
    import { selected, createGroup, deleteSelectedGroup } from "stores/custom-groups.js";
    import { settings, settingsOpened } from "stores/user-settings.js";
    import CustomGroup from "datatypes/custom-group.js";
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();

    export let listView = true;
    
    let isDeleteDisabled = false;

    selected.subscribe( group => {
      // don't allow deleting permanent or empty groups
      isDeleteDisabled = group === null || group.permanent;
    })

    function openSettings() {
      settingsOpened.set(true);
    }

    function toggleView() {
      listView = !listView;
      settings.toggleSetting("listView");
    }

  </script>