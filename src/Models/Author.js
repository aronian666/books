import ActiveRecord from "./ActiveRecord";

export default class Author extends ActiveRecord {
    constructor({ _id, name = "", createdAt }) {
        super()
        this._id = _id
        this.name = name;
        this.createdAt = createdAt && new Date(Number(createdAt))
    }
    static properties = "_id name createdAt"
    static modifiers = [
        { property: "name", name: "Nombre", type: "text" }
    ]
    static sort = {
        name: "name",
        createdAt: "createdAt"
    }
    static table = [
        { property: "name", name: "Nombre" },
        { property: "createdAt", name: "Creacion" }
    ]
    static disabled = ["author_id"]
    static exact = []
}