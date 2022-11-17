<script>
    import Lend from "../Models/Lend";
    import Modal from "./Modal.svelte";
    import Loading from "./Loading.svelte";
    let message = "";
    export let results = [];
    export let index;
    export let result;
    export let onUpdate;
    let dialog;
    let loading = false;
    const updateLend = async (e) => {
        loading = true;
        const lend = await Lend.save(
            {
                _id: result._id,
                message,
                status: "Devuelto",
                book: { _id: result.book._id },
            },
            true
        );
        results[index] = lend;
        results = results;
        onUpdate && onUpdate();
        $dialog.close();
        loading = false;
    };
</script>

<td>
    {#if result.status === "Prestado"}
        <button
            style="--color: var(--yellow); padding: .4rem .8rem"
            on:click={(e) => {
                $dialog.showModal();
            }}
        >
            Detalles
        </button>
    {:else}
        {result.message}
    {/if}
</td>

<Modal bind:dialog id={`message${index}`}>
    {#if loading}
        <Loading />
    {:else}
        <form class="grid gap" on:submit|preventDefault={updateLend}>
            <div>
                <span>Estudiante</span>
                <p>{result.student.fullName}</p>
            </div>
            <div>
                <span>Fecha de prestamo</span>
                <p>{result.createdAt.toDateString()}</p>
            </div>
            <div>
                <span>Fecha de retorno</span>
                <p>{result.returnDate.toDateString()}</p>
            </div>
            <div>
                <span>Restante</span>
                <p>{result.difference} dias</p>
            </div>
            <div class="grid">
                <label for="message">Observaciones</label>
                <input type="text" bind:value={message} />
            </div>

            <button style="--color: var(--blue); color:white">Entregar</button>
        </form>
    {/if}
</Modal>

<style>
    span,
    label {
        font-weight: 600;
    }
    p {
        color: gray;
    }
</style>
