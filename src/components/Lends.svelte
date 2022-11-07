<script>
    import Lend from "../Models/Lend";
    import Header from "./Header.svelte";
    import Table from "./Table.svelte";
    import Modal from "./Modal.svelte";
    import UpdateLend from "./UpdateLend.svelte";
    let results = [];
    let dialog;
    let lend;
</script>

<Header title="Prestamos" model={Lend} bind:results />
<Table model={Lend} title="Prestamos" let:result bind:results let:index>
    <td class="name"
        ><a href={`/books/${result.book._id}`}>{result.book.name}</a></td
    >
    <td
        ><a href={`/students/${result.student._id}`}>{result.student.name}</a
        ></td
    >
    <td>{result.returnDate.toDateString()}</td>
    <td>{result.createdAt.toDateString()}</td>
    <td>{result.difference}</td>
    <td>
        <span class={result.statusClass}>{result.status}</span>
    </td>
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
</Table>
<Modal bind:dialog id="messages">
    <UpdateLend {dialog} index={lend} bind:results />
</Modal>
