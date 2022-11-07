<script>
    export let model;
    export let onSubmit;
    export let resourses;
    export let object = new model({});
    export let disabled = [];
    const create = async () => {
        const data = await model.save(object);

        onSubmit(data);
    };
</script>

<form on:submit|preventDefault={create}>
    {#each model.modifiers as { name, property, type, min, max, collection }}
        <fieldset>
            <label for={`${model.name.toLowerCase()}[${property}]`}
                >{name}</label
            >
            {#if type === "select"}
                <select
                    name={`${model.name.toLowerCase()}[${property}]`}
                    id={`${model.name.toLowerCase()}[${property}]`}
                    bind:value={object[property]}
                    class:disabled={disabled.includes(property)}
                >
                    {#each resourses[collection] as option}
                        <option value={option._id}>{option.name}</option>
                    {/each}
                </select>
            {:else if type === "date"}
                <input type="date" bind:value={object[property]} />
            {:else if type === "number"}
                <input
                    type="number"
                    bind:value={object[property]}
                    {min}
                    {max}
                />
            {:else}
                <input type="text" bind:value={object[property]} />
            {/if}
        </fieldset>
    {/each}
    <slot>
        <button style="--color: var(--blue)"
            >{object._id ? "Editar" : "Crear"}</button
        >
    </slot>
</form>

<style>
    select.disabled {
        pointer-events: none;
    }
</style>
