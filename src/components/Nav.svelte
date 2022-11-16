<script>
    import Button from "./Button.svelte";

    const routes = [
        { name: "Buscar", src: "search" },
        { name: "Agregar libro", src: "books" },
    ];
    let hidden = true;
</script>

<nav>
    <ul class:hidden>
        {#each routes as { name, src, icon }}
            <a href={`/${src}`}>
                <img src={`/${src}.svg`} alt={name} />
                {name}
            </a>
        {/each}
        <div class="lines">
            <Button on:click={(e) => (hidden = !hidden)}>
                <img src="/lines.svg" alt="Lines" />
            </Button>
        </div>
    </ul>
</nav>

<style>
    ul {
        list-style-type: none;
        padding: 1rem;
        position: absolute;
        height: 100vh;
        transition: 0.3s;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        background-color: black;
    }
    a {
        padding: 1rem;
        display: flex;
        gap: 2rem;
        align-items: center;
        text-decoration: none;
        color: #f3ac3c;
        border-radius: 1rem;
        font-weight: 600;
    }
    a:hover {
        background-color: var(--gray);
    }
    .lines {
        position: absolute;
        top: 0;
        left: 100%;
        padding: 1rem;
    }
    .hidden {
        translate: -100%;
    }
    img {
        width: 1rem;
        aspect-ratio: 1;
    }
</style>
