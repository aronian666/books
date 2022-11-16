<script>
    import Button from "./Button.svelte";
    import Modal from "./Modal.svelte";
    import Loading from "./Loading.svelte";
    import Form from "./Form.svelte";
    import Book from "../Models/Book";
    export let object;
    object = new Book(object);

    let dialog;
    let loading = false;
    const update = async () => {
        loading = true;
        const newObject = await Book.save(object);
        object = newObject;
        loading = false;
        $dialog.close();
    };
</script>

<main>
    <h1>{object.name}</h1>
    <div>
        <img src={object.image} alt={object.name} />
        <section class="details">
            <span>Autor</span>
            <p>{object.author.name}</p>
            <span>Editorial</span>
            <p>{object.editorial.name}</p>
            <span>Area</span>
            <p>{object.category.name}</p>
            <span>Ubicacion</span>
            <p>{object.position}</p>
            <span>Cantidad</span>
            <p>{object.count}</p>
        </section>
    </div>
    <section class="buttons">
        <a
            href={`/books/${object._id}.json`}
            on:click={(e) => {
                if (!confirm("Estas segura de querer eliminar esto?"))
                    e.preventDefault();
            }}
            class="button"
            style="--color: tomato">Eliminar</a
        >
        <Button on:click={(e) => $dialog.showModal()}>Editar</Button>
    </section>
</main>

<Modal id="edit" bind:dialog>
    {#if loading}
        <Loading />
    {:else}
        <Form bind:object on:submit={update} edit={true} />
    {/if}
</Modal>

<style>
    .details {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
    span {
        font-weight: 600;
    }
    p {
        color: var(--secondary);
    }
    div {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }
    img {
        width: 200px;
        aspect-ratio: 2/3;
    }
    .buttons {
        display: flex;
        gap: 1rem;
    }
</style>
