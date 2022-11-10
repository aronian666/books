<script>
    import { getContext } from "svelte";
    import Lend from "../Models/Lend";
    import Modal from "./Modal.svelte";
    import Loading from "./Loading.svelte";
    let message = "";
    let results = getContext("results");
    const record = getContext("record");
    const recordModel = getContext("recordModel");
    export let index;
    export let result;
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
        if (recordModel && record)
            record.set(await recordModel.findById($record._id));
        $results[index] = lend;
        results.set($results);
        $dialog.close();
        loading = false;
    };
</script>

<td>
    {#if result.status === "Prestado"}
        <button
            style="--color: deeppink"
            on:click={(e) => {
                $dialog.showModal();
            }}
        >
            Devolver
        </button>
    {:else}
        {result.message}
    {/if}
</td>

<Modal bind:dialog id={`message${index}`}>
    {#if loading}
        <Loading />
    {:else}
        <form on:submit|preventDefault={updateLend}>
            <label for="message">Observaciones</label>
            <input type="text" bind:value={message} />
            <button style="--color: var(--blue)">Actualizar</button>
        </form>
    {/if}
</Modal>
