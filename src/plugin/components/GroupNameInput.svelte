<script>
  
  import { onMount, createEventDispatcher } from 'svelte';
  import { renameGroup, expire } from "stores/custom-groups.js";

  const dispatch = createEventDispatcher();

  export let group = null;
  export const maxlength = 45;
  export let value = "";
  export let initialValue = value;
  
  let input; // dom ref
  
  onMount(() => {
    input.addEventListener("blur", end);
    input.focus();
    document.execCommand('selectAll', false, null);

    return () => input.removeEventListener("blur", end);
  });


  function keydownHandler(e) {

      switch (e.key.toLowerCase()) {
        case "enter":
          e.preventDefault();
        case "escape":
          end();
          return;
        case "backspace":
        case "delete":
        case "arrowleft":
        case "arrowright":
          return;
      }
    }

  function isValid() {
    if (value === null) return false;
    if (value.length === 0 || value.length > maxlength) return false;
    if (!group.isNew && value === initialValue) return false;
    return true;
  }

  function end() {
    if (isValid()) {
      input.removeEventListener("blur", end);
      renameGroup(group, value);
      dispatch("change", value);
    }
    else {
      if (group.isNew) {
        expire(group);
      }
      exit();
    }

    
  }

  function exit() {
    value = initialValue;
    dispatch("cancel", initialValue);
  }

</script>

<style>

  input {
    width: 100%;
    font-size: 1rem;
    line-height: 1.5rem;
    display: inline-block;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--panel-border-color);
    outline: 1px solid var(--accent-color);
    padding: 0rem 0rem;
    margin: 0.5rem 1rem;
    color: var(--foreground-color);
    font-family: "Tahoma", sans-serif;
    
  }


  input::placeholder {
    font-weight: 400;
    color: var(--muted-color);
    text-align: right;
    padding-right: 2rem;
  }

  
  input:focus {
    box-shadow: none;
    outline: none;
    /* background-color: var(--error-color); */
    color: var(--foreground-color);
  }

  input::selection {
    background-color:var(--accent-color);
    color: var(--foreground-color);
  }
</style>

<input bind:value={value} placeholder={initialValue} type="text" bind:this={input} on:keydown={keydownHandler} {maxlength} />