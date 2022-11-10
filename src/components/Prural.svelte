<script>
    import { getContext, setContext } from "svelte";
    import { writable } from "svelte/store";
    import Header from "./Header.svelte";
    import Table from "./Table.svelte";
    export let model;
    export let exact = [];
    export let title;
    const record = getContext("record");
    const recordModel = getContext("recordModel");
    const results = getContext("results");
    if (!results) setContext("results", writable([]));
    setContext("model", model);
    setContext("title", title);
    if (record)
        setContext("default", { [recordModel.name.toLowerCase()]: $record });
</script>

<Header />
<Table {exact} let:result let:index>
    <slot {result} {index} />
</Table>
