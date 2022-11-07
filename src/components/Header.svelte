<script>
    import Create from "./Create.svelte";
    import Modal from "./Modal.svelte";

    export let title;
    export let model;
    export let results;
    export let object;
    export let disabled;
    export let disableButton = false;
    export let onSubmit;
    let dialog;
</script>

<header>
    <h1>{title}</h1>
    <button
        disabled={disableButton}
        style="--color: var(--blue)"
        on:click={(e) => dialog.showModal()}>Agregar</button
    >
</header>
<Modal id="create" bind:dialog>
    {#await model.getResourses()}
        nothing
    {:then resourses}
        <Create
            {model}
            {resourses}
            {object}
            {disabled}
            onSubmit={(object) => {
                results.push(object);
                results = results;
                dialog.close();
                onSubmit && onSubmit(object);
            }}
        />
    {/await}
</Modal>

<style>
    header {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid var(--gray);
        padding-bottom: 2rem;
    }
</style>
