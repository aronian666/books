<script>
    import { getContext } from "svelte";
    import Loading from "./Loading.svelte";
    const model = getContext("model");
    let results = getContext("results");
    export let exact = [];
    let title = getContext("title");
    let count = 0;
    let loading = true;

    let filter = {
        search: "",
        sort: model.table[0].sort,
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
            results.set(data.results.map((result) => new model(result)));
            loading = false;
        });
    });
    $: assignSearch(filter, model.exact);
</script>

<section class="main">
    <section class="flex space-between">
        <div class="flex gap">
            <div class="fielset">
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
                <div class="fielset">
                    <label for={algo.name}> {algo.name} </label>
                    <select
                        name={algo.name}
                        id={algo.name}
                        bind:value={algo.value}
                    >
                        {#each algo.options as option}
                            <option value={option.value}>{option.name}</option>
                        {/each}
                    </select>
                </div>
            {/each}
        </div>
        <div class="flex gap align-center">
            <span class="count">{count}</span>
            <b>{title}</b>
        </div>
    </section>

    <table>
        <thead>
            <tr>
                {#each model.table as { sort, name }}
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
                {#each $results as result, index}
                    <tr>
                        {#each model.table as { key, transform, path, className }}
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
