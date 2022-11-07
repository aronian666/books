<script>
    import { onMount } from "svelte";
    import Message from "../Models/Message";
    export let exact = [];
    let filter = {
        search: "",
        sort: "createdAt",
        page: 0,
        asc: 1,
    };
    let messsages = [];
    onMount(async () => {
        const { results } = await Message.find(filter, exact);
        messsages = results.map((r) => new Message(r));
    });
</script>

<table>
    <thead>
        <tr>
            <th>Mensaje</th>
            <th>Estado</th>
        </tr>
    </thead>
    <tbody>
        {#each messsages as message}
            <tr>
                <td>{message.body}</td>
                <td>{message.status}</td>
            </tr>
        {/each}
    </tbody>
</table>
