<script>
    import Modal from "./Modal.svelte";
    import Loading from "./Loading.svelte";
    import Form from "./Form.svelte";
    import Book from "../Models/Book";
    import Table from "./Table.svelte";
    import Lend from "../Models/Lend";
    import UpdateLend from "./UpdateLend.svelte";
    export let object;
    object = new Book(object);
    let lend = new Lend({ book: object });
    lend.form[0].edit = true;
    let lends = [];
    let editDialog;
    let createDialog;
    let loading = false;
    let table = Lend.tables.large;
    const update = async () => {
        loading = true;
        const newObject = await Book.save(object);
        object = newObject;
        loading = false;
        $editDialog.close();
    };
    const createLend = async () => {
        await Lend.save(lend);
        Lend.exact[0].value = "Prestado";
        table = Lend.tables.large;
        $createDialog.close();
        lend = new Lend({ book: object });
        lend.form[0].edit = true;
        object.count--;
    };
</script>

<main>
    <section>
        <h1>{object.name}</h1>
    </section>
    <section class="grid gap auto-fit">
        <img
            src={object.image ||
                "https://i0.wp.com/css-tricks.com/wp-content/uploads/2017/08/card-skeleton@2x.png?w=300&ssl=1"}
            alt={object.name}
        />
        <div class="grid gap">
            <div>
                <span>Autor</span>
                <p>{object.author.name}</p>
            </div>
            <div>
                <span>Editorial</span>
                <p>{object.editorial.name}</p>
            </div>
            <div>
                <span>Area</span>
                <p>{object.category.name}</p>
            </div>
            <div>
                <span>Ubicacion</span>
                <p>{object.position}</p>
            </div>
            <div>
                <span>Cantidad</span>
                <p>{object.count}</p>
            </div>
        </div>
    </section>
    <section class="flex gap">
        <a
            href={`/books/${object._id}.json`}
            on:click={(e) => {
                if (!confirm("Estas segura de querer eliminar esto?"))
                    e.preventDefault();
            }}
            class="button"
            style="--color: tomato; color: white">Eliminar</a
        >
        <button on:click={(e) => $editDialog.showModal()}>Editar</button>
    </section>
    <div class="divisor" />
    <section class="grid gap">
        <div class="flex gap space-between align-items-center">
            <h2>Prestamos</h2>
            <button
                disabled={object.count === 0}
                on:click={(e) => $createDialog.showModal()}>Agregar</button
            >
        </div>
        <Table
            model={Lend}
            exact={[{ name: "book._id", value: object._id }]}
            title="Prestamos"
            sort="createdAt"
            {table}
            bind:results={lends}
            let:index
            let:result
        >
            <UpdateLend
                bind:results={lends}
                {index}
                {result}
                onUpdate={() => {
                    object.count++;
                    Lend.exact[0].value = "Devuelto";
                    table = Lend.tables.returned;
                }}
            />
        </Table>
    </section>
</main>

<Modal id="edit" bind:dialog={editDialog}>
    {#if loading}
        <Loading />
    {:else}
        <Form bind:object on:submit={update} />
    {/if}
</Modal>
<Modal id="create" bind:dialog={createDialog}>
    {#if loading}
        <Loading />
    {:else}
        <Form bind:object={lend} on:submit={createLend} />
    {/if}
</Modal>

<style>
    span {
        font-weight: 600;
    }
    p {
        color: gray;
    }
    img {
        width: 200px;
        aspect-ratio: 2/3;
        background-color: gray;
    }
</style>
