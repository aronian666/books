<script>
    import Book from "../Models/Book";
    import Header from "./Header.svelte";
    import Table from "./Table.svelte";
    let results = [];
</script>

<Header title="Libros" model={Book} bind:results />
<Table model={Book} title="Libros" let:result bind:results>
    <td class="name">
        <a href={`/books/${result._id}`}>{result.name}</a>
    </td>
    <td><a href={`/authors/${result.author._id}`}>{result.author.name}</a></td>
    <td
        ><a href={`/categories/${result.category._id}`}
            >{result.category.name}</a
        ></td
    >
    <td>
        <a href={`/editorials/${result.editorial._id}`}
            >{result.editorial.name}
        </a>
    </td>
    <td>
        {result.count}
    </td>
    <td>{result.createdAt.toDateString()}</td>
    <td><span class={result.statusClass}>{result.status}</span></td>
</Table>
