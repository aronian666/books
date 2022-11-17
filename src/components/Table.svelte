<script>
    import Loading from "./Loading.svelte";
    export let model;
    export let exact = [];

    export let sort;
    export let table;
    export let results = [];
    let count = 0;
    let loading = true;
    let filter = {
        search: "",
        sort: sort || "name",
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
    const assignSearch = debounce((filter, anotherExact) => {
        loading = true;
        const raton = anotherExact
            .map((option) => ({
                name: option.key,
                value: option.value,
            }))
            .filter((v) => v.value);
        model.find(filter, [...exact, ...raton]).then((data) => {
            data = Object.values(data)[0];
            count = data.count;
            results = data.results.map((result) => new model(result));
            loading = false;
        });
    });
    $: assignSearch(filter, model.exact);
</script>

<section class="flex space-between">
    <div class="flex gap wrap">
        <div class="grid">
            <label for="search"> Buscar </label>
            <input
                type="search"
                name="search"
                id="search"
                bind:value={filter.search}
                placeholder="Buscar"
            />
        </div>
        {#each model.exact as algo}
            <div class="grid">
                <label for={algo.name}> {algo.name} </label>
                <select name={algo.name} id={algo.name} bind:value={algo.value}>
                    {#each algo.options as option}
                        <option value={option.value}>{option.name}</option>
                    {/each}
                </select>
            </div>
        {/each}
    </div>
</section>
{#if results.length}
    <table>
        <thead>
            <tr>
                {#each model[table] as { sort, name }}
                    <th
                        class={sort === filter.sort
                            ? filter.asc === 1
                                ? "asc"
                                : "desc"
                            : ""}
                        on:click={(e) => {
                            if (filter.sort === sort) return (filter.asc *= -1);
                            filter.sort = sort;
                            filter.asc = 1;
                        }}>{name}</th
                    >
                {/each}
            </tr>
        </thead>
        <tbody>
            {#if loading}
                <Loading />
            {:else}
                {#each results as result, index}
                    <tr>
                        {#each model[table] as { key, transform, path, className }}
                            <td>
                                {#if path}
                                    <a
                                        href={path(result)}
                                        class={typeof className === "function"
                                            ? className(result)
                                            : className}
                                    >
                                        {transform
                                            ? transform(result[key])
                                            : result[key]}
                                    </a>
                                {:else}
                                    <span
                                        class={typeof className === "function"
                                            ? className(result)
                                            : className}
                                    >
                                        {transform
                                            ? transform(result[key])
                                            : result[key]}
                                    </span>
                                {/if}
                            </td>
                        {/each}
                        <slot {result} {index} />
                    </tr>
                {/each}
            {/if}
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
{:else}
    <p>No hay registros</p>
{/if}

<style>
    .main {
        padding: 2rem;
        border-radius: 2rem;
        display: grid;
        gap: 1rem;
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
    a {
        color: black;
        text-decoration: none;
    }
    a:hover {
        font-weight: 600;
        text-decoration: underline;
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
    label {
        font-weight: 600;
    }
</style>
