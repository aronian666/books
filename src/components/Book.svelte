<script>
    import Book from "../Models/Book";
    import Details from "./Details.svelte";
    import Lend from "../Models/Lend";
    import Modal from "./Modal.svelte";
    import UpdateLend from "./UpdateLend.svelte";
    export let object;
    let results = [];
    let dialog;
    object = new Book(object);
    let lend;
    const properties = [
        { name: "Estudiante", property: "student" },
        { name: "Fecha de prestamo", property: "createdAt" },
        { name: "Fecha de devolucion", property: "returnDate" },
        { name: "Dias faltantes" },
        { name: "Estado", property: "status" },
        { name: "Mensaje", property: "message" },
    ];
</script>

<Details
    bind:results
    exact={[{ name: "book._id", value: object._id }]}
    model={Book}
    bind:object
    table={Lend}
    title="Prestamos"
    {properties}
    let:result
    let:index
>
    <td class="name">
        <a href={`/students/${result.student._id}`}>{result.student.name}</a>
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
    <UpdateLend
        onSubmit={(o) => Book.findById(object._id).then((o) => (object = o))}
        {dialog}
        index={lend}
        bind:results
    />
</Modal>
