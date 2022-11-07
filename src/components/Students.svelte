<script>
    import Student from "../Models/Student";
    import Header from "./Header.svelte";
    import Table from "./Table.svelte";
    let results = [];
</script>

<Header title="Estudiantes" model={Student} bind:results />
<Table model={Student} title="Estudiantes" let:result bind:results>
    <td class="name">
        <a href={`/students/${result._id}`}>{result.name}</a>
    </td>
    <td>{result.last}</td>
    <td>
        {result.nivelString}
    </td>
    <td>{result.grade}</td>
    <td>{result.createdAt.toDateString()}</td>
</Table>
