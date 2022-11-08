import ActiveRecord from "./ActiveRecord";

export default class Editorial extends ActiveRecord {
    constructor({ _id, name, createdAt }) {
        super()
        this._id = _id
        this.name = name
        this.createdAt = createdAt && new Date(Number(createdAt))
    }
    static properties = "_id name createdAt"
    static modifiers = [
        { property: "name", name: "Editorial", type: "text", required: true },
    ]
    static sort = {
        name: "name",
        createdAt: "createdAt"
    }
    static table = [
        { name: "Nombre", property: "name" },
        { name: "Creacion", property: "createdAt", transform(c) { return c.toLocaleString() } }
    ]
    static exact = []
    static disabled = ["editorial_id"]
    static name = "Editorial"
}