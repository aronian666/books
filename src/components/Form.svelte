<script>
    import Fielsets from "./Fielsets.svelte";
    export let object;
    export let edit;
</script>

<form {...$$restProps} on:submit|preventDefault>
    <Fielsets {object} {edit} />
    <button style="--color: var(--blue)">
        {object._id ? "Editar" : "Crear"}
    </button>
</form>
