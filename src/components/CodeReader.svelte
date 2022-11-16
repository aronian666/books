<script>
    import Quagga from "quagga";
    import { onMount } from "svelte";
    export let result;
    onMount(() => {
        const width = window.innerWidth - 32;
        Quagga.init(
            {
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector("#camera"), // Or '#yourElement' (optional)
                    constraints: {
                        width,
                        height: width,
                    },
                },
                decoder: {
                    readers: ["ean_reader", "ean_8_reader"],
                },
            },
            function (err) {
                if (err) return;
                Quagga.start();
            }
        );
        Quagga.onDetected(function (data) {
            result = data.codeResult.code;
        });
    });
</script>

<div id="camera" />
