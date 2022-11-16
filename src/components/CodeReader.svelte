<script>
    import { onMount } from "svelte";
    export let result;

    onMount(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: {
                    ideal: "environment",
                },
            },
            audio: false,
        });
        const videoEl = document.querySelector("#stream");
        videoEl.srcObject = stream;
        await videoEl.play();

        const barcodeDetector = new BarcodeDetector({ formats: ["ean_13"] });
        const interval = window.setInterval(async () => {
            const barcodes = await barcodeDetector.detect(videoEl);
            if (barcodes.length <= 0) return;
            if (result.length) return;
            result = barcodes.map((barcode) => barcode.rawValue).join("");
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    });
</script>

<video id="stream" />
<p>El codigo es: {result}</p>

<style>
    video {
        width: 300px;
        aspect-ratio: 1;
    }
</style>
