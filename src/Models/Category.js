import ActiveRecord from "./ActiveRecord"
class Category extends ActiveRecord {
    constructor({ _id, name = "", createdAt }) {
        super()
        this._id = _id
        this.name = name;
        this.createdAt = createdAt && new Date(Number(createdAt))
    }
    static properties = "_id name createdAt"
    static modifiers = [{ property: "name", name: "Nombre", type: "text", required: true }]
    static sort = {
        name: "name",
        createdAt: "createdAt"
    }
    static table = [
        { name: "Nombre", property: "name" },
        { name: "Creacion", property: "createdAt", transform(createdAt) { return createdAt.toLocaleString() } },
    ]
    static exact = []
    static disabled = ["category_id"]
    static name = "Category"
}
export default Category
