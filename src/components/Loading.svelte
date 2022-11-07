<div>
    {#each Array(20).fill(0) as algo, i}
        <span style={`--i: ${i}`} />
    {/each}
</div>

<style>
    div {
        position: relative;
        width: 120px;
        aspect-ratio: 1/1;
        animation: hue infinite 1.5s;
    }
    @keyframes hue {
        from {
            filter: hue-rotate(0deg);
        }
        to {
            filter: hue-rotate(360deg);
        }
    }
    span {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: rotate(calc(18deg * var(--i)));
    }
    span:before {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        width: 15px;
        border-radius: 50%;
        aspect-ratio: 1/1;
        background-color: black;
        box-shadow: 0 0 10px yellow, 0 0 20px yellowgreen, 0 0 40px orange;
        animation: rotate infinite 1s;
        animation-delay: calc(0.05s * var(--i));
    }
    @keyframes rotate {
        0% {
            transform: scale(1);
        }
        80%,
        100% {
            transform: scale(0);
        }
    }
</style>
