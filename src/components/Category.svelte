<script>
    import Category from "../Models/Category";
    import Singular from "./Singular.svelte";
    export let object;
</script>

<Singular {object} model={Category} />
