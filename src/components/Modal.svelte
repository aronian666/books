<script>
    import { onMount } from "svelte";
    export let id = "create";
    export let dialog;
    onMount(() => {
        dialog = document.querySelector(`#${id}`);
    });
</script>

<dialog {id}>
    <slot />
    <img src="/x.svg" alt="X" on:click={(e) => dialog.close()} />
</dialog>

<style>
    dialog {
        border: none;
        border-radius: 1rem;
        padding: 1.5rem;
        position: relative;
    }
    dialog::backdrop {
        background-color: #00000040;
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
