<script>
    import Button from "../components/Button.svelte";
    import CodeReader from "../components/CodeReader.svelte";
    import Input from "../components/Input.svelte";
    import Loading from "../components/Loading.svelte";
    import Modal from "../components/Modal.svelte";
    import Book from "../Models/Book";

    let camera = false;
    let code = "";
    let dialog;
    let loading = false;
    let book;
    const saveBook = async (isbn) => {
        loading = true;
        camera = false;
        $dialog.showModal();
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
        );
        const data = await response.json();
        const object = data.items && data.items[0];
        if (object) {
            book = {
                name: object.volumeInfo.title,
                author: {
                    name: object.volumeInfo.authors
                        ? object.volumeInfo.authors[0]
                        : "Anonimo",
                },
                isbn: code,
                count: 1,
                image: object.volumeInfo.imageLinks?.thumbnail,
                category: { name: "Sin Area" },
                editorial: {
                    name: object.volumeInfo.publisher || "Sin Editorial",
                },
            };
        }

        loading = false;
        code = "";
    };
    $: code.length === 13 && saveBook(code);
</script>

<main>
    <h1>Agregar libros</h1>
    <Input placeholder="Codigo ISBN 13" bind:value={code} />
    {#if camera}
        <section>
            <CodeReader bind:result={code} />
        </section>
    {:else}
        <Button on:click={(e) => (camera = true)}>Abrir camara</Button>
    {/if}
    <Modal bind:dialog>
        {#if loading}
            <Loading />
        {:else if book}
            <section class="details">
                <h2>Informacion del libro</h2>
                <div>
                    <span>Nombre</span>
                    <p>{book.name}</p>
                    <span>Autor</span>
                    <p>{book.author.name}</p>
                </div>
                <Button
                    on:click={(e) => {
                        loading = true;
                        Book.saveByIsbn(book).then(() => {
                            $dialog.close();
                            book = null;
                        });
                    }}>Confimar</Button
                >
            </section>
        {:else}
            <p>No se ha encontrado el libro :(</p>
        {/if}
    </Modal>
</main>

<style>
    h1 {
        color: var(--yellow);
    }
    span {
        font-weight: 600;
    }
    .details {
        display: grid;
        gap: 0.5rem;
    }
</style>
