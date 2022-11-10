<script>
    import Student from "../Models/Student";
    import Singular from "./Singular.svelte";
    export let object;
</script>

<Singular {object} model={Student} />
