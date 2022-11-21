<script>
    import Input from "../components/Input.svelte";
    import Modal from "../components/Modal.svelte";
    import Book from "../Models/Book";
    import Loading from "../components/Loading.svelte";
    import Form from "../components/Form.svelte";
    import { toXLSX } from "../Models/Utils";
    export let search = "";
    let filter = {
        search: search,
        sort: "name",
        page: 0,
        asc: 1,
        limit: 20,
    };
    let count = 0;
    let results = [];
    let loading;

    function debounce(func, timeout = 100) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, timeout);
        };
    }
    const assignSearch = debounce((filter) => {
        loading = true;
        Book.find(filter).then((data) => {
            data = Object.values(data)[0];
            count = data.count;
            results = data.results.map((i) => new Book(i));
            loading = false;
            setTimeout(() => {
                try {
                    window.history.replaceState(
                        null,
                        null,
                        "?search=" + filter.search
                    );
                } catch {}
            }, 600);
        });
    });
    $: assignSearch(filter);
    let dialog;
    let object = new Book();
    const create = async () => {
        loading = true;
        const book = await Book.save(object);
        loading = false;
        results.push(book);
        results = results;
        object = new Book();
        $dialog.close();
    };
</script>

<main>
    <h1>Libros</h1>
    <header class="flex wrap" style="gap: .5rem">
        <button
            on:click={(e) => toXLSX(Book)}
            style="--color: #10793F; color:white">Descargar</button
        >
        <button on:click={(e) => $dialog.showModal()}>Agregar nuevo</button>
        <a style="--color: var(--yellow)" class="button" href="/books/new"
            >Agregar por ISBN</a
        >
    </header>
    <Input
        type="search"
        name="search"
        placeholder="Busca libros, autores y areas"
        bind:value={filter.search}
    />
    <section class="books">
        {#if loading}
            <Loading />
        {:else}
            {#each results as book}
                <div class="book">
                    <a href={`/books/${book._id}`} title={book.name}>
                        <img
                            src={book.image ||
                                "https://i0.wp.com/css-tricks.com/wp-content/uploads/2017/08/card-skeleton@2x.png?w=300&ssl=1"}
                            alt={book.name}
                        />
                    </a>
                    <a href={`/books/${book._id}`} title={book.name}>
                        {book.name}
                    </a>
                    <a
                        href="/authors/{book.author._id}"
                        style="color: gray; font-weight: 400"
                    >
                        {book.author.name}
                    </a>
                </div>
            {/each}
        {/if}
    </section>
    <section class="paginate">
        {#each Array(((count / 20) ^ 0) + 1).fill(0) as a, i}
            <button
                class:active={i === filter.page}
                on:click={(e) => (filter.page = i)}
            >
                {i + 1}
            </button>
        {/each}
    </section>
</main>
<Modal id="create" bind:dialog>
    {#if loading}
        <Loading />
    {:else}
        <Form bind:object on:submit={create} />
    {/if}
</Modal>

<style>
    .active {
        background-color: var(--yellow);
        color: white;
        font-weight: 600;
    }
    .paginate {
        display: flex;
        gap: 0.5rem;
    }
    img {
        width: 100%;
        aspect-ratio: 2/3;
        border-radius: 0.5rem;
    }
    .books {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(165px, 1fr));
        gap: 1.5rem;
    }
    .book {
        padding: 0.5rem;
        display: grid;
        border-radius: 1rem;
        gap: 0.5rem;
        border: 1px solid #00000010;
        transition: 0.2s;
    }
    a {
        color: black;
        text-decoration: none;
        font-weight: 600;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    a:hover {
        text-decoration: underline;
    }
    .book:hover {
        translate: 0 -0.25rem;
    }
</style>
