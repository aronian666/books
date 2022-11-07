<script>
    import Lend from "../Models/Lend";

    let message = "";
    export let results = [];
    export let index;
    export let dialog;
    const updateLend = async (e) => {
        const lend = results[index];
        const l = await Lend.save(
            {
                _id: lend._id,
                message,
                status: "Devuelto",
            },
            true
        );
        results[index] = l;
        results = results;
        dialog.close();
    };
</script>

<form on:submit|preventDefault={updateLend}>
    <fieldset>
        <label for="message">Observaciones</label>
        <input type="text" bind:value={message} />
    </fieldset>
    <button style="--color: var(--blue)">Actualizar</button>
</form>
