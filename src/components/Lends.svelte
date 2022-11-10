<script>
    import Lend from "../Models/Lend";
    import Prural from "./Prural.svelte";
    import UpdateLend from "../components/UpdateLend.svelte";
</script>

<Prural model={Lend} title="Prestamos" let:result let:index>
    <UpdateLend {result} {index} />
</Prural>
