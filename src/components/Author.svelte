<script>
    import Author from "../Models/Author";
    import Details from "./Details.svelte";
    import Book from "../Models/Book";
    export let object;
</script>

<Details
    model={Author}
    {object}
    table={Book}
    exact={[{ name: "author._id", value: object._id }]}
    let:result
    title="Libros"
>
    <td>
        <a href={`/books/${result._id}`}>{result.name}</a>
    </td>
    <td><a href={`/authors/${result.author._id}`}>{result.author.name}</a></td>
    <td>
        <a href={`/categories/${result.category._id}`}>
            {result.category.name}
        </a>
    </td>
    <td>
        <a href={`/editorials/${result.editorial._id}`}
            >{result.editorial.name}
        </a>
    </td>
    <td>{result.count}</td>
    <td>{result.createdAt.toDateString()}</td>
    <td>{result.status}</td>
</Details>
