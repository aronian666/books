<script>
    import { getContext } from "svelte";
    import Form from "./Form.svelte";
    import Modal from "./Modal.svelte";
    import Loading from "./Loading.svelte";
    const model = getContext("model");
    let results = getContext("results");
    const title = getContext("title");
    const record = getContext("record");
    const recordModel = getContext("recordModel");
    const defaultData = getContext("default") || {};
    let object = new model(defaultData);
    let dialog;
    let loading = false;
    const create = async () => {
        loading = true;
        const data = await model.save(object);
        $results.push(data);
        results.set($results);
        if (recordModel && record)
            record.set(await recordModel.findById($record._id));
        $dialog.close();
        object = new model(defaultData)
        loading = false;
    };
</script>

<section>
    <h1>{title}</h1>
    <button
        style="--color: var(--blue)"
        disabled={$record && $record.disabled}
        on:click={(e) => $dialog.showModal()}
    >
        Agregar
    </button>
    <Modal id="create" bind:dialog>
        {#if loading}
            <Loading />
        {:else}
            <Form bind:object on:submit={create} />
        {/if}
    </Modal>
</section>

<style>
    section {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid var(--gray);
        padding-bottom: 2rem;
    }
</style>
