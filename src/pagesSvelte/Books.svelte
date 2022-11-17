<script>
    import CodeReader from "../components/CodeReader.svelte";
    import Input from "../components/Input.svelte";
    import Loading from "../components/Loading.svelte";
    import Modal from "../components/Modal.svelte";
    import Book from "../Models/Book";
    import Category from "../Models/Category";
    import Editorial from "../Models/Editorial";

    let camera = false;
    let code = "";
    let dialog;
    let loading = false;
    let editorials = [];
    let categories = [];
    let book = {
        count: 1,
        editorial: { name: "Sin Editorial" },
        category: { name: "Sin Area" },
        author: { name: "Anonimo" },
        position: 1,
    };
    const saveBook = async (isbn) => {
        Editorial.find({ limit: 100 }).then((data) => {
            editorials = data.editorials.results;
        });
        Category.find({ limit: 100 }).then((data) => {
            categories = data.categorys.results;
        });
        loading = true;
        camera = false;
        $dialog.showModal();
        let responses = [
            fetch(
                `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&fields=items(volumeInfo/title,volumeInfo/imageLinks,volumeInfo/authors,volumeInfo/publisher)`
            ),
            fetch(`https://openlibrary.org/isbn/${isbn}.json`),
        ];
        responses = await Promise.all(responses);
        let google = await responses[0].json();
        google = google.items && google.items[0];
        let open;
        if (responses[1].ok) open = await responses[1].json();

        if (google) {
            book.name = google.volumeInfo.title;
            if (google.volumeInfo.authors)
                book.author.name = google.volumeInfo.authors[0];
            book.isbn = code;
            book.image = google.volumeInfo.imageLinks?.thumbnail;
            if (google.volumeInfo.publisher)
                book.editorial.name = google.volumeInfo.publisher;
        } else if (open) {
            book.name = open.title;
            if (open.authors?.length) {
                fetch(
                    "https://openlibrary.org" + open.authors[0].key + ".json"
                ).then(async (response) => {
                    const data = await response.json();
                    book.author.name = data.name;
                });
            }
            book.isbn = code;
            if (open.publishers?.length)
                book.editorial.name = open.publishers[0];
        }
        loading = false;
        code = "";
    };
    $: code.length === 13 && saveBook(code);
</script>

<main>
    <h1>Agregar libros</h1>
    <input type="text" placeholder="Codigo ISBN 13" bind:value={code} />
    {#if camera}
        <section>
            <CodeReader bind:result={code} />
        </section>
    {:else}
        <button on:click={(e) => (camera = true)}>Abrir camara</button>
    {/if}
    <Modal
        bind:dialog
        onClose={() => {
            book.name = null;
            book.author.name = "Anonimo";
            book.count = 1;
            book.editorial.name = "Sin Editorial";
            book.image = null;
            $dialog.close();
        }}
    >
        {#if loading}
            <Loading />
        {:else if book.name}
            <section class="details">
                <h2>Informacion del libro</h2>
                <picture>
                    <img src={book.image} alt={book.name} />
                </picture>
                <div>
                    <span>Nombre</span>
                    <p>{book.name}</p>
                    <span>Autor</span>
                    <p>{book.author.name}</p>
                    <span>Editorial</span>
                    <input
                        type="text"
                        name="book[editorial]"
                        id="book[editorial]"
                        list="editorials"
                        bind:value={book.editorial.name}
                    />
                    <span>Area</span>
                    <input
                        type="text"
                        name="book[category]"
                        id="book[category]"
                        list="categories"
                        bind:value={book.category.name}
                    />
                    <span>Cantidad</span>
                    <input type="number" bind:value={book.count} />
                    <span>Ubicacion</span>
                    <input type="number" bind:value={book.position} />
                    <datalist id="editorials">
                        {#each editorials as { name, _id }}
                            <option value={name} />
                        {/each}
                    </datalist>
                    <datalist id="categories">
                        {#each categories as { name }}
                            <option value={name} />
                        {/each}
                    </datalist>
                </div>
                <button
                    on:click={(e) => {
                        loading = true;
                        Book.saveByIsbn(book).then(() => {
                            $dialog.close();
                            book.name = null;
                            book.author = { name: "Anonimo" };
                            book.count = 1;
                            book.image = null;
                            book.editorial.name = "Sin Editorial";
                        });
                    }}>Confimar</button
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
    div {
        display: grid;
        gap: 0.5rem;
    }
    picture {
        display: flex;
        justify-content: center;
    }
    img {
        width: 100px;
        aspect-ratio: 2/3;
    }
</style>
