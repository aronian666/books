import ActiveRecord from "./ActiveRecord"
import Book from "./Book";
class Category extends ActiveRecord {
    constructor({ _id, name = "", createdAt } = {}) {
        super(Category)
        this._id = _id
        this.name = name;
        this.createdAt = createdAt && new Date(Number(createdAt))
    }
    get children() {
        return {
            model: Book,
            exact: [{ name: "category._id", value: this._id }],
            title: "Libros"
        }
    }
    static properties = "_id name createdAt"
    form = [{ key: "name", name: "Nombre" }]
    static table = [
        { sort: "name", name: "Nombre", key: "name", path(object) { return `/categorys/${object._id}` }, className: "name" },
        { sort: "createdAt", name: "Creacion", key: "createdAt", transform(createdAt) { return createdAt.toLocaleString() } },
    ]
    static name = "Category"

}
export default Category
