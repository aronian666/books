<script>
    import Author from "../Models/Author";
    import Header from "./Header.svelte";
    import Table from "./Table.svelte";
    let results = [];
</script>

<Header title="Autores" model={Author} bind:results />
<Table model={Author} title="Autores" let:result bind:results>
    <td class="name">
        <a href={`/authors/${result._id}`}>{result.name}</a>
    </td>
    <td>{result.createdAt.toDateString()}</td>
</Table>
