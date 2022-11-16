<script>
    export let value;
</script>

<div>
    <input {...$$restProps} bind:value on:change />
</div>

<style>
    div {
        display: flex;
        width: 100%;
    }
    input {
        padding: 0.75rem 1rem;
        flex: 1 1 auto;
        border-radius: 1rem;
        box-shadow: 0 0 2px gray;
        border: none;
    }
</style>
