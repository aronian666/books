<script>
    export let filter = {
        search: "",
        sort: "name",
        page: 0,
        asc: 1,
    };
    export let model;
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
        <slot />
    </div>
</section>
