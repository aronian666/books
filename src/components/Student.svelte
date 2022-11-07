<script>
    import Student from "../Models/Student";
    import Details from "./Details.svelte";
    import Lend from "../Models/Lend";
    import Modal from "./Modal.svelte";
    import UpdateLend from "./UpdateLend.svelte";
    export let object;
    let results = [];
    let dialog;
    object = new Student(object);
    let lend;
    const properties = [
        { name: "Libro", property: "book" },
        { name: "Fecha de prestamo", property: "createdAt" },
        { name: "Fecha de devolucion", property: "returnDate" },
        { name: "Dias faltantes" },
        { name: "Estado", property: "status" },
        { name: "Mensaje", property: "message" },
    ];
</script>

<Details
    bind:results
    exact={[{ name: "student._id", value: object._id }]}
    model={Student}
    {object}
    table={Lend}
    title="Prestamos"
    {properties}
    let:result
    let:index
>
    <td>
        <a href={`/books/${result.book._id}`}>{result.book.name}</a>
    </td>
    <td>{result.createdAt.toDateString()}</td>
    <td>{result.returnDate.toDateString()}</td>
    <td>{result.difference}</td>
    <td><span class={result.statusClass}>{result.status}</span></td>
    <td>
        {#if result.status !== "Devuelto"}
            <button
                style="--color: deeppink"
                on:click={(e) => {
                    lend = index;
                    dialog.showModal();
                }}>Devolver</button
            >
        {:else}
            {result.message}
        {/if}
    </td>
</Details>

<Modal bind:dialog id="messages">
    <UpdateLend {dialog} index={lend} bind:results />
</Modal>
