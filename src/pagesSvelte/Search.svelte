<script>
    import Input from "../components/Input.svelte";
    import Modal from "../components/Modal.svelte";
    import Book from "../Models/Book";
    import Loading from "../components/Loading.svelte";
    import Form from "../components/Form.svelte";
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
    <header>
        <h1>Buscar</h1>
        <div class="flex" style="gap: .5rem">
            <button
                on:click={(e) => Book.export()}
                style="--color: #10793F; color:white">Descargar</button
            >
            <button on:click={(e) => $dialog.showModal()}>Agregar</button>
        </div>
    </header>
    <Input
        type="search"
        name="search"
        placeholder="Busca libros, autores y areas"
        bind:value={filter.search}
    />
    <section class="books">
        {#each results as book}
            <div class="book">
                <img
                    src={book.image ||
                        "https://i0.wp.com/css-tricks.com/wp-content/uploads/2017/08/card-skeleton@2x.png?w=300&ssl=1"}
                    alt={book.name}
                />
                <a href={`/books/${book._id}`} title={book.name}>
                    {book.name}
                </a>
                <span>{book.author.name}</span>
            </div>
        {/each}
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
    h1 {
        color: var(--yellow);
    }
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
    header {
        display: flex;
        justify-content: space-between;
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
        border: 1px solid #00000020;
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
    span {
        color: gray;
    }
</style>
