<script>
    import { onMount } from "svelte";
    import Create from "./Create.svelte";
    export let model;
    export let filter = {
        search: "",
        sort: "name",
        page: 0,
        asc: 1,
    };
    export let exact = [];
    export let object;
    export let disabled;
    let results = [];
    let count = 0;
    let resourses;
    let dialog;
    onMount(async () => {
        dialog = document.querySelector("#create");
        resourses = model.getResourses ? await model.getResourses() : {};
    });
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
        /* try {
            const url = new URL(window.location);
            url.searchParams.set("query", search);
            window.history.pushState({}, "", url);
        } catch {} */
        model.find(filter, exact).then(({ data }) => {
            data = Object.values(data)[0];
            count = data.count;
            results = data.results.map((result) => new model(result));
        });
    });
    $: assignSearch(filter);
</script>

<section class="flex gap space-between">
    <div class="flex gap">
        <fieldset>
            <label for="search">Buscar</label>
            <input
                type="search"
                name="search"
                id="search"
                bind:value={filter.search}
            />
        </fieldset>
        <fieldset>
            <label for="sort">Ordenar por</label>
            <select name="sort" id="sort" bind:value={filter.sort}>
                {#each model.properties as { sort, name }}
                    <option value={sort}>{name}</option>
                {/each}
            </select>
        </fieldset>
        <fieldset>
            <label for="asc">Orden</label>
            <select name="asc" id="asc" bind:value={filter.asc}>
                <option value={1}>Ascendente</option>
                <option value={-1}>Descendente</option>
            </select>
        </fieldset>
    </div>
    <div class="flex gap">
        <div>
            <button
                class="holed"
                style="--color: black"
                on:click={(e) => dialog.showModal()}>Crear nuevo</button
            >
        </div>
    </div>
</section>

<table>
    <thead>
        <tr>
            {#each model.properties as { name }}
                <th>{name}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each results as result}
            <tr>
                <slot {result} />
            </tr>
        {/each}
    </tbody>
</table>
<section class="flex space-between">
    <div class="flex gap">
        {#each Array(((count / 10) ^ 0) + 1).fill(0) as a, i}
            <button
                class="page"
                class:active={i === filter.page}
                on:click={(e) => (filter.page = i)}
            >
                {i + 1}
            </button>
        {/each}
    </div>
    <span>
        {results.length} de {count} resultados
    </span>
</section>

<dialog id="create">
    {#if resourses}
        <Create
            {model}
            {resourses}
            {object}
            {disabled}
            onSubmit={(object) => {
                results.push(object);
                results = results;
                dialog.close();
            }}
        >
            <button
                type="button"
                class="holed"
                style="--color: tomato"
                on:click={(e) => dialog.close()}>Cancelar</button
            >
            <button class="holed" style="--color: dodgerblue">Crear</button>
        </Create>
    {/if}
</dialog>

<style>
    .page {
        background-color: white;
    }
    .page.active {
        background-color: black;
        color: white;
    }
</style>
