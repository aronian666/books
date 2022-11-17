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
                returnDay: new Date().toString(),
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
    <button
        style={`--color: ${
            result.status === "Prestado"
                ? "var(--yellow)"
                : "green; color:white"
        }`}
        on:click={(e) => {
            $dialog.showModal();
        }}
    >
        {result.status === "Prestado" ? "Devolver" : "Detalles"}
    </button>
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

            {#if result.status === "Prestado"}
                <div>
                    <span>Restante</span>
                    <p>{result.difference} dias</p>
                </div>
                <div class="grid">
                    <label for="message">Observaciones</label>
                    <input type="text" bind:value={message} />
                </div>

                <button style="--color: var(--blue); color:white"
                    >Entregar</button
                >
            {:else}
                <div>
                    <span>Devuelto el</span>
                    <p>{result.returnDay.toDateString()}</p>
                </div>
                <div>
                    <span>Mensaje</span>
                    <p>{result.message}</p>
                </div>
            {/if}
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
    button {
        padding: 0.4rem 0.8rem;
    }
</style>
