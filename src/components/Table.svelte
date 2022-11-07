<script>
    import Loading from "./Loading.svelte";

    export let model;
    export let results = [];
    export let title;
    export let exact = [];
    export let table;
    let count = 0;
    let loading = true;

    let filter = {
        search: "",
        sort: Object.values(model.sort)[0],
        page: 0,
        asc: 1,
    };
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
        model.find(filter, exact).then((data) => {
            data = Object.values(data)[0];
            count = data.count;
            results = data.results.map((result) => new model(result));
            loading = false;
        });
    });
    $: assignSearch(filter);
</script>

<section class="main">
    <section class="flex space-between">
        <fieldset>
            <input
                type="search"
                name="search"
                id="search"
                bind:value={filter.search}
                placeholder="Buscar"
            />
        </fieldset>
        <div class="flex gap align-center">
            <span class="count">{count}</span>
            <b>{title}</b>
        </div>
    </section>
    {#if loading}
        <div class="grid place-content">
            <Loading />
        </div>
    {:else}
        <table>
            <thead>
                <tr>
                    {#each table || model.table as { name, property }}
                        <th
                            class={model.sort[property] === filter.sort
                                ? filter.asc === 1
                                    ? "asc"
                                    : "desc"
                                : ""}
                            on:click={(e) => {
                                if (filter.sort === model.sort[property])
                                    return (filter.asc *= -1);
                                if (!model.sort[property]) return;
                                filter.sort = model.sort[property];
                                filter.asc = 1;
                            }}>{name}</th
                        >
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each results as result, index}
                    <tr>
                        <slot {result} {index} />
                    </tr>
                {/each}
            </tbody>
        </table>
        <section class="flex gap">
            {#each Array(((count / 10) ^ 0) + 1).fill(0) as a, i}
                <button
                    class="page"
                    class:active={i === filter.page}
                    on:click={(e) => (filter.page = i)}
                >
                    {i + 1}
                </button>
            {/each}
        </section>
    {/if}
</section>

<style>
    .main {
        padding: 2rem;
        background-color: white;
        border-radius: 2rem;
        display: grid;
        gap: 1rem;
    }
    .main > *:first-child {
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--gray);
    }
    .page {
        background-color: white;
        color: black;
        border: 1px solid black;
    }
    .page.active {
        background-color: black;
        color: white;
    }
    .count {
        color: rgba(47, 47, 47, 0.776);
    }
    th {
        cursor: pointer;
    }
    th {
        padding: 0.5rem;
    }
    th.asc::after {
        content: "\25b4";
    }

    th.desc::after {
        content: "\25be";
    }

    th.asc::after,
    th.desc::after {
        margin-left: 0.5rem;
    }
</style>
