<script>
    import { setContext } from "svelte";
    import { writable, get } from "svelte/store";
    import Details from "./Details.svelte";
    import Prural from "./Prural.svelte";
    export let model;
    export let object;
    object = writable(new model(object));
    setContext("results", writable([]));
    setContext("recordModel", model);
    setContext("record", object);
</script>

<Details />
<Prural {...get(object).children} let:result let:index>
    <slot {result} {index} />
</Prural>
