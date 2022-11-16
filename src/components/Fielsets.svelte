<script>
    import { getContext, onMount } from "svelte";
    import Input from "./Input.svelte";

    export let object;
    export let recommendations = false;
    export let extend = true;
    export let exact;
    export let edit = false;
    let results = [];
    onMount(() => {
        if (recommendations) {
            object.model.recommendations().then((r) => {
                results = r;
            });
        }
    });
    const onChange = (e, key) => {
        if (results.length && key === "name") {
            const found = results.find((item) => item.name === e.target.value);
            if (found) {
                object = new object.model(found);
            } else if (exact) {
                object = new object.model();
                return e.target.setCustomValidity(
                    "Este campo no es dinamico, selecciona una de las opciones"
                );
            } else object = new object.model({ name: e.target.value });
            e.target.setCustomValidity("");
        }
    };
    const form = extend ? object.form : [object.form[0]];
</script>

{#each form as { name, key, required, extend, type, exact }}
    {#if object[key] && typeof object[key] === "object"}
        <fieldset>
            <legend>{name}</legend>
            <svelte:self
                bind:object={object[key]}
                recommendations={true}
                {exact}
                {extend}
                {edit}
            />
        </fieldset>
    {:else}
        <p>
            <label for={`${object.constructor.name}[${key}]`}>{name}</label>
            {#if type == "number"}
                <input type="number" bind:value={object[key]} />
            {:else}
                <Input
                    bind:value={object[key]}
                    {type}
                    list={`${object.constructor.name}[${key}s]`}
                    name={`${object.constructor.name}[${key}]`}
                    id={`${object.constructor.name}[${key}]`}
                    on:change={(e) => onChange(e, key)}
                    {required}
                />
            {/if}
            {#if results.length && key === "name"}
                <datalist id={`${object.constructor.name}[names]`}>
                    {#each results as option}
                        <option value={option.name} />
                    {/each}
                </datalist>
            {/if}
        </p>
    {/if}
{/each}

<style>
    legend {
        color: var(--blue);
    }
    label {
        font-weight: 600;
        cursor: pointer;
    }
    fieldset {
        border-radius: 1rem;
        border: 1px solid rgba(186, 186, 255, 0.507);
        display: grid;
        gap: 0.5rem;
    }
    p {
        display: grid;
        gap: 0.5rem;
    }
    label.radio {
        font-weight: normal;
    }
</style>
