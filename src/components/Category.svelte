<script>
    import Category from "../Models/Category";
    import Book from "../Models/Book";
    import Table from "./Table.svelte";
    import Modal from "./Modal.svelte";
    import Loading from "./Loading.svelte";
    import Form from "./Form.svelte";
    export let object;
    object = new Category(object);
    let editDialog;
    let loading = false;
    const update = async () => {
        loading = true;
        object = await Category.save(object);
        loading = false;
        $editDialog.close();
    };
</script>

<main>
    <h1>{object.name}</h1>
    <section class="grid gap">
        <div>
            <span>Creado en</span>
            <p>{object.createdAt.toDateString()}</p>
        </div>
        <div>
            <span>Ultima actualizacion</span>
            <p>{object.updatedAt.toDateString()}</p>
        </div>
    </section>
    <section class="flex gap">
        <a
            href={`/categorys/${object._id}.json`}
            on:click={(e) => {
                if (!confirm("Estas segura de querer eliminar esto?"))
                    e.preventDefault();
            }}
            class="button"
            style="--color: tomato; color: white">Eliminar</a
        >
        <button on:click={(e) => $editDialog.showModal()}>Editar</button>
    </section>
    <Table
        model={Book}
        table={Book.table}
        exact={[{ name: "category._id", value: object._id }]}
        sort="createdAt"
    />
</main>
<Modal id="edit" bind:dialog={editDialog}>
    {#if loading}
        <Loading />
    {:else}
        <Form bind:object on:submit={update} />
    {/if}
</Modal>

<style>
    span {
        font-weight: 600;
    }
    p {
        color: gray;
    }
</style>
