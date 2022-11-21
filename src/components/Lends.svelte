<script>
    import Table from "./Table.svelte";
    import Lend from "../Models/Lend";
    let lends = [];
</script>

<main>
    <h1>Ultimos prestamos</h1>
    <div class="divisor" />
    <Table
        model={Lend}
        title="Prestamos"
        sort="createdAt"
        table={Lend.tables.large}
        bind:results={lends}
        let:index
        let:result
    />
</main>

<style>
</style>
