<script>
    import Editorial from "../Models/Editorial";
    import Header from "./Header.svelte";
    import Table from "./Table.svelte";
    let results = [];
</script>

<Header title="Editoriales" model={Editorial} bind:results />
<Table model={Editorial} title="Editoriales" let:result bind:results>
    <td class="name">
        <a href={`/editorials/${result._id}`}>{result.name}</a>
    </td>
    <td>{result.createdAt.toDateString()}</td>
</Table>
