<script>
    import { onMount, setContext } from "svelte";
    import { writable } from "svelte/store";
    export let id = "create";
    export let dialog = writable();
    export let onClose;
    setContext("dialog", dialog);
    onMount(() => {
        dialog.set(document.querySelector(`#${id}`));
    });
</script>

<dialog {id}>
    <slot />
    <img
        src="/x.svg"
        alt="X"
        on:click={(e) => (onClose ? onClose() : $dialog.close())}
    />
</dialog>

<style>
    dialog {
        border: none;
        border-radius: 1rem;
        padding: 1rem;
        position: relative;
        margin: auto;
    }
    dialog::backdrop {
        background-color: #0000006a;
    }
    img {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: 1rem;
        height: 1rem;
        cursor: pointer;
        transition: 0.3s;
    }
    img:hover {
        scale: 1.2;
    }
</style>
