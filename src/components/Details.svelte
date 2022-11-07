<script>
    import Modal from "./Modal.svelte";
    import Create from "./Create.svelte";
    import Header from "./Header.svelte";
    import Table from "./Table.svelte";
    export let model;
    export let object;
    export let table;
    export let title;
    export let exact;
    export let results = [];
    export let properties;
    object = new model(object);
    let dialog;
</script>

<section class="grid" style="gap: 1.5rem">
    <h1>{object.name}</h1>
    <div class="details">
        {#each model.table as { name, property, transform, getStyle }}
            <span class="key">{name}</span>
            <span style={getStyle ? getStyle(object[property]) : ""}
                >{transform
                    ? transform(object[property])
                    : object[property]}</span
            >
        {/each}
    </div>
    <div class="flex gap">
        <a
            href={`/${model.name.toLowerCase()}s/${object._id}.json`}
            class="button"
            on:click={(e) => {
                if (!confirm("Estas segura de querer eliminar esto?"))
                    e.preventDefault();
            }}
            style="--color: tomato">Eliminar</a
        >
        <button style="--color: orange" on:click={(e) => dialog.showModal()}
            >Editar</button
        >
    </div>
</section>
<Header
    model={table}
    {title}
    bind:results
    object={new table({ [model.name.toLowerCase()]: object })}
    disabled={model.disabled}
    disableButton={object.count <= 0}
    onSubmit={(o) => {
        model.findById(object._id).then((o) => (object = o));
    }}
/>
<Table
    table={properties}
    {exact}
    model={table}
    {title}
    bind:results
    let:result
    let:index
>
    <slot {result} {index} />
</Table>

<Modal bind:dialog id="edit">
    {#await model.getResourses()}
        nothing
    {:then resourses}
        <Create
            {resourses}
            {model}
            {object}
            onSubmit={(o) => {
                object = o;
                dialog.close();
            }}
        />
    {/await}
</Modal>

<style>
    .details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.25rem;
    }
    section {
        background-color: white;
        padding: 2rem;
        border-radius: 2rem;
    }
    .key {
        font-weight: 600;
    }
</style>
