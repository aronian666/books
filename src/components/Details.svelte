<script>
    import { getContext } from "svelte";
    import Form from "./Form.svelte";
    import Modal from "./Modal.svelte";
    import Loading from "./Loading.svelte";
    const record = getContext("record");
    const model = getContext("recordModel");
    const results = getContext("results");
    let loading = false;
    let object = new model(JSON.parse(JSON.stringify($record)));
    let dialog;
    const update = async () => {
        loading = true;
        const newObject = await model.save(object);
        record.set(newObject);
        loading = false;
        $dialog.close();
    };
</script>

<section class="panel">
    <h1>{$record.name}</h1>
    <div>
        {#each model.table as { name, key, transform, path }}
            <b>{name}</b>
            <span>
                {#if path}
                    <a href={path($record)}>
                        {transform ? transform($record[key]) : $record[key]}
                    </a>
                {:else}
                    {transform ? transform($record[key]) : $record[key]}
                {/if}
            </span>
        {/each}
    </div>
    <p class="flex gap">
        <a
            href={`/${model.name.toLowerCase()}s/${object._id}.json`}
            class="button"
            disabled={$results.length > 0}
            on:click={(e) => {
                if (!confirm("Estas segura de querer eliminar esto?"))
                    e.preventDefault();
            }}
            style="--color: tomato"
        >
            Eliminar
        </a>
        <button style="--color: orange" on:click={(e) => $dialog.showModal()}
            >Editar</button
        >
    </p>
</section>

<Modal id="edit" bind:dialog>
    {#if loading}
        <Loading />
    {:else}
        <Form bind:object on:submit={update} edit={true} />
    {/if}
</Modal>

<style>
    div {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
    }
    section {
        display: grid;
        gap: 1rem;
    }
</style>
