<script>
    import Author from "../Models/Author";
    import Singular from "./Singular.svelte";
    export let object;
</script>

<Singular {object} model={Author} />
