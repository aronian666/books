<script>
    import Button from "../components/Button.svelte";
    import Input from "../components/Input.svelte";
    import Modal from "../components/Modal.svelte";
    import Book from "../Models/Book";
    import Loading from "../components/Loading.svelte";
    import Form from "../components/Form.svelte";
    let filter = {
        search: "",
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
            results = data.results;
            loading = false;
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
        $dialog.close();
    };
</script>

<main>
    <header>
        <h1>Buscar</h1>
        <Button on:click={(e) => $dialog.showModal()}
            >Agregar nuevo libro</Button
        >
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
                <img src={book.image} alt={book.name} />
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
    button {
        width: 2rem;
        aspect-ratio: 1;
        background-color: white;
        color: black;
        border: none;
        border-radius: 50%;
        cursor: pointer;
    }
    img {
        width: 100%;
        aspect-ratio: 2/3;
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
        border: 2px solid var(--gray);
        padding: 0.5rem;
        display: grid;
        border-radius: 1rem;
        gap: 0.5rem;
    }
    a {
        color: white;
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
        color: var(--secondary);
    }
</style>
