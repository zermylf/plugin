<script>

  // components
  import Icon from "components/Icon.svelte";
  import SettingButton from "components/SettingButton.svelte";
  import { fly, fade, slide } from "svelte/transition";
  import  { onMount } from "svelte";

  import { loading, isPhotoshop } from "stores/app-settings.js";
  import { settings, settingsOpened, displayLog, defaultSettings } from "stores/user-settings.js";
  import { clearData as clearTypefaceCache } from "stores/typefaces.js";
  import { customGroups, clearCustomGroups } from "stores/custom-groups.js";
  import { clearLogs } from "helpers/logger.js";
  import fileSystemRepository from "repositories/file-system.js";
  import csInterface from "helpers/cs-interface.js";
  export let appTitle = "this plugin";
  let dangerZoneActive = false;

  const apiVersion = csInterface.getCurrentApiVersion();
  const cepVersion = `${apiVersion.major}.${apiVersion.minor}.${apiVersion.micro || 0}`
  const env = csInterface.hostEnvironment;
  const appName = env.appName === "PHXS" ? "Photoshop" : "Other";

  onMount(() => {
    csInterface.setWindowTitle(`${appTitle} Settings`);

    return () => {
      csInterface.setWindowTitle(`${appTitle}`);
    }
  });


  // not used, currently
  function createDumpFile() {
    const path = csInterface.dumpInstallationInfo();
    alert(`Dump file created at\n${path}`);
  }

  function openBackupFile() {
    csInterface.openURLInDefaultBrowser(`file:///${fileSystemRepository.backupFilePath}`);
  }

  const smallFontSize = () => settings.setFontSize(9);
  const mediumFontSize = () => settings.setFontSize(defaultSettings.fontSize);
  const largeFontSize = () => settings.setFontSize(12);

</script>

<div class="backdrop">
  <main class="settings" in:fly={{ y: 400, duration: 300, }}>
    <header class="header row">
      <h1>Settings</h1>
      <button on:click="{() => settingsOpened.set(false)}">
        <Icon icon="close" />
      </button>
    </header>

    

      <section class="setting">
        <SettingButton toggles={true} settings={true} on:click={() => settings.toggleSetting("applyTypeface")} enabled={$settings.applyTypeface}>
          Auto-Apply selection to Text Layer
        </SettingButton>
        <p class="description">Changes the current text layer when selecting fonts. </p>
        <p class="note">Will have no effect if the current layer is not a Text Layer, or if photoshop is in "Text Edit Mode".</p>
      </section>
  
      <section class="setting">
        <SettingButton settings={true} toggles={false} on:click={clearTypefaceCache}>
          Refresh Font List
        </SettingButton>
        <p class="description">Empties the typeface cache, forcing {appTitle} to reload all typefaces. </p>
        <p class="note">Useful when you've loaded new fonts on your computer and don't see the new fonts within {appTitle}.</p>
      </section>
  
      <section class="setting">
        <SettingButton settings={true} toggles={false} on:click="{() => settings.reset()}">
          Reset User Settings
        </SettingButton>
        <p class="description">Resets all settings on this page to the defaults.</p>
        <p class="note">This won't delete anything important.</p>
      </section>
      {#if $isPhotoshop}
        <section class="setting">
          <h2>Font Size</h2>
          <p class="note">
            Displaying at {$settings.fontSize}px.
          </p>
          <p class="note">
            <button disabled={$settings.fontSize === 9} on:click={smallFontSize}>small</button>
            <button disabled={$settings.fontSize === 10} on:click={mediumFontSize}>medium</button>
            <button disabled={$settings.fontSize === 12} on:click={largeFontSize}>large</button>
          </p>
        </section>
    
        
        <section class="setting">
          <h2>Last Backup</h2>
          <p class="description">Backups are used in case of an application update.</p>
          <p class="note">
            {fileSystemRepository.lastBackup()}
            <button on:click={openBackupFile}>View</button>
          </p>
          <p style="word-break: break-all;">Saved to:<br /> <code>{fileSystemRepository.backupFilePath}</code></p>
          
        </section>
        
        <section class="setting">
          <h2>Device Information</h2>
          <p class="note">{appName} Version: {env.appVersion}</p>
          <p class="note">CEP Version: {cepVersion}</p>
          <p class="note">OS: {csInterface.getOSInformation()}</p>
          <p class="note">Extension ID: {csInterface.getExtensionID()}</p>
          <p class="note">UI Display Scale: {csInterface.getScaleFactor()}</p>
          <p class="note">Log: <button on:click="{() => displayLog.set(!$displayLog)}">{$displayLog ? "Hide" : "Display"} Log</button> <button on:click="{() => clearLogs()}">Clear Log</button></p>
          
        </section>
    
        <h2 class="toggle-region" on:click="{() => dangerZoneActive = !dangerZoneActive}"> <Icon icon={dangerZoneActive ? "keyboard_arrow_down" : "keyboard_arrow_right"} /> Danger Zone</h2>
        {#if dangerZoneActive}
          <section class="danger-zone" in:slide|local={{ duration: 400, delay: 100 }}>
            <div class="row">
              <Icon color="var(--error-color)" icon="warning" size="large" />
              <div>
                <p class="warning">Changes made in this section are irreversible.</p>
                <p class="warning"><b>Proceed with caution.</b></p>
              </div>
            </div>
    
            <div>
              
              <section class="setting">
                <button disabled={$customGroups.length === 0} on:click={clearCustomGroups}>Delete All Custom Groups</button>
                <p class="description">Deletes all custom groups that you have created.</p>
                {#if $customGroups.length === 0}
                  <p class="note">You have no custom groups.</p>
                {:else}
                  <p class="warning">Clicking this will delete {$customGroups.length} custom groups, <u>including backups</u>.</p>
                {/if}
                
              </section>
    
            </div>
          </section>

        {/if}
      {:else}
        <section class="setting">
          <p class="description">...and more settings when running within photoshop.</p>
        </section>
      {/if}
      
  </main>
</div>

<style>

  .backdrop {
    height: 100vh;
    position: fixed;
    background-color: var(--panel-layer-1);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .groups-list {
    padding: 0rem 1rem;
    margin: 0 0;
  }


  .groups-list li:last-child:after {
    content: "";
  }
  
  .settings {
    padding: 0rem 1rem 20vh 1rem;
  }

  .setting {
    margin: 1rem auto;
    padding: 1rem 1rem;
  }


  .row {
    display: flex;
    flex: 0 1 auto;
    justify-content: space-between;
    align-items: center;
  }

  .header {
    border-bottom: 2px solid var(--panel-border-color);
    background-color: var(--panel-layer-1);
    padding: 0 1rem;
    position: sticky;
    left: 0;
    right: 0;
    top: 0;
  }


  h1 {
    font-size: 1.5rem;
    font-weight: 400;
  }

  .description {
    font-size: 1.25rem;
  }

  .note {
    font-size: 1.25rem;
    color: var(--muted-color);
  }

  .danger-zone {
    background-color: var(--panel-layer-0);
    padding: 1rem 1rem;
    margin: 0 -1rem;
  }

  .toggle-region {
    cursor: default;
    color: var(--error-color);
    padding: 1rem 1rem;
    margin: 0 -1rem;
    margin-top: 4rem;
  }

  .toggle-region:hover {
    background-color: rgba(255,255,255,0.1);
  }

  .warning {
    color: var(--error-color);
  }

  .danger-zone .row {
    justify-content: space-around;
  }

  .danger-zone button {
    background-color: var(--panel-layer-1);
    padding: 0.5rem 1rem;
  }

  .danger-zone button:hover,
  .danger-zone button:active,
  .danger-zone button:focus {
    color: var(--foreground-color);
    background-color: var(--error-color);
  }

  button[disabled] {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
  }
  

</style>