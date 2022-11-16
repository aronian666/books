<script>
    import Button from "./Button.svelte";
    import Fielsets from "./Fielsets.svelte";
    export let object;
    export let edit;
</script>

<form {...$$restProps} on:submit|preventDefault>
    <Fielsets {object} {edit} />
    <Button style="--color: var(--blue)">
        {object._id ? "Editar" : "Crear"}
    </Button>
</form>

<style>
    form {
        display: grid;
        gap: 0.5rem;
    }
</style>
