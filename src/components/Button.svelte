<script>
</script>

<button {...$$restProps} on:click>
    <slot />
</button>

<style>
    button {
        display: flex;
        gap: 0.5rem;
        padding: 0.6rem 1rem;
        font-size: 1rem;
        cursor: pointer;
        background-color: var(--color, var(--gray));
        color: white;
        border: none;
        border-radius: 1rem;
        font-weight: 600;
        transition: 0.2s ease;
        justify-content: center;
    }
    button:hover {
        translate: 0 -0.125rem;
    }
</style>
