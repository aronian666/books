import ActiveRecord from "./ActiveRecord";
import Book from "./Book";
export default class Editorial extends ActiveRecord {
    constructor({ _id, name = "", createdAt } = {}) {
        super(Editorial)
        this._id = _id
        this.name = name
        this.createdAt = createdAt && new Date(Number(createdAt))
    }
    static properties = "_id name createdAt"
    form = [
        { key: "name", name: "Nombre de la editorial" },
    ]
    get children() {
        return {
            model: Book,
            exact: [{ name: "editorial._id", value: this._id }],
            title: "Libros"
        }
    }
    static table = [
        { name: "Nombre", key: "name", sort: "name", path(editorial) { return `/editorials/${editorial._id}` }, className: "name" },
        { name: "Creacion", key: "createdAt", sort: "createdAt", transform(c) { return c.toLocaleString() } }
    ]
    static disabled = ["editorial_id"]
    static name = "Editorial"
}