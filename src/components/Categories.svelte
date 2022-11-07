<script>
    import Category from "../Models/Category";
    import Header from "./Header.svelte";
    import Table from "./Table.svelte";
    let results = [];
</script>

<Header title="Categorias" model={Category} bind:results />
<Table model={Category} title="Categorias" let:result bind:results>
    <td class="name">
        <a href={`/categories/${result._id}`}>{result.name}</a>
    </td>
    <td>{result.createdAt.toDateString()}</td>
</Table>
