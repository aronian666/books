<script>
    import Book from "../Models/Book";
    import Singular from "./Singular.svelte";
    import UpdateLend from "./UpdateLend.svelte";
    export let object;
</script>

<Singular {object} model={Book} let:index let:result>
    <UpdateLend {index} {result} />
</Singular>
