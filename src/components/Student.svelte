<script>
    import Modal from "./Modal.svelte";
    import Loading from "./Loading.svelte";
    import Form from "./Form.svelte";
    import Student from "../Models/Student";
    import Table from "./Table.svelte";
    import Lend from "../Models/Lend";
    import UpdateLend from "./UpdateLend.svelte";
    export let object;
    object = new Student(object);
    let lend = new Lend({ student: object });
    lend.form[0].edit = true;
    let lends = [];
    let editDialog;
    let loading = false;
    const update = async () => {
        loading = true;
        const newObject = await Student.save(object);
        object = newObject;
        loading = false;
        $editDialog.close();
    };
</script>

<main>
    <section>
        <h1>{object.fullName}</h1>
    </section>
    <section class="grid gap">
        <div>
            <span>Grado</span>
            <p>{object.grade}</p>
        </div>
        <div>
            <span>Nivel</span>
            <p>{object.nivel}</p>
        </div>
    </section>
    <section class="flex gap">
        <a
            href={`/students/${object._id}.json`}
            on:click={(e) => {
                if (!confirm("Estas segura de querer eliminar esto?"))
                    e.preventDefault();
            }}
            class="button"
            style="--color: tomato; color: white">Eliminar</a
        >
        <button on:click={(e) => $editDialog.showModal()}>Editar</button>
    </section>
    <div class="divisor" />
    <section class="grid gap">
        <div class="flex gap space-between align-items-center">
            <h2>Prestamos</h2>
        </div>
        <Table
            model={Lend}
            exact={[{ name: "student._id", value: object._id }]}
            title="Prestamos"
            sort="studnet.name"
            table="studentTable"
            bind:results={lends}
            let:index
            let:result
        >
            <UpdateLend bind:results={lends} {index} {result} />
        </Table>
    </section>
</main>

<Modal id="edit" bind:dialog={editDialog}>
    {#if loading}
        <Loading />
    {:else}
        <Form bind:object on:submit={update} />
    {/if}
</Modal>

<style>
    span {
        font-weight: 600;
    }
    p {
        color: gray;
    }
</style>
