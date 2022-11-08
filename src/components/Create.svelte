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
    {#each model.modifiers as { name, property, type, min, max, collection, required }}
        <fieldset>
            <label for={`${model.name.toLowerCase()}[${property}]`}>
                {name}
            </label>
            {#if type === "select"}
                <input
                    type="text"
                    list={collection}
                    {required}
                    readonly={disabled.includes(property)}
                    value={(() => {
                        const item = resourses[collection].find(
                            (item) => item._id === object[property]
                        );
                        if (item) return item.name;
                        return "";
                    })()}
                    on:change={(e) => {
                        if (!collection) return;
                        const item = resourses[collection].find(
                            (item) => item.name === e.target.value
                        );
                        if (item) object[property] = item._id;
                        else object[property] = undefined;
                        if (!object[property]) {
                            return e.target.setCustomValidity(
                                "Lo que pusiste no existe, ve a crearlo por favor :0"
                            );
                        }
                        e.target.setCustomValidity("");
                    }}
                />
                <datalist id={collection}>
                    {#each resourses[collection] as option}
                        <option value={option.name} />
                    {/each}
                </datalist>
            {:else if type === "date"}
                <input type="date" bind:value={object[property]} {required} />
            {:else if type === "number"}
                <input
                    type="number"
                    bind:value={object[property]}
                    {min}
                    {max}
                    {required}
                />
            {:else}
                <input type="text" {required} bind:value={object[property]} />
            {/if}
        </fieldset>
    {/each}
    <slot>
        <button style="--color: var(--blue)"
            >{object._id ? "Editar" : "Crear"}</button
        >
    </slot>
</form>
