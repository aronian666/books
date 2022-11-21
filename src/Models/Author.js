import ActiveRecord from "./ActiveRecord";
import Book from "./Book";

export default class Author extends ActiveRecord {
    constructor({ _id, name = "", createdAt, updatedAt } = {}) {
        super(Author)
        this._id = _id
        this.name = name;
        this.createdAt = createdAt && new Date(Number(createdAt))
        this.updatedAt = updatedAt && new Date(Number(updatedAt))
    }
    get children() {
        return {
            model: Book,
            exact: [{ name: "author._id", value: this._id }],
            title: "Libros"
        }
    }
    static properties = "_id name createdAt updatedAt"
    form = [
        { key: "name", name: "Nombre" }
    ]
    static table = [
        { sort: "name", key: "name", name: "Nombre", path(object) { return `/authors/${object._id}` }, className: "name" },
        { sort: "createdAt", key: "createdAt", name: "Creacion", transform(createdAt) { return createdAt.toLocaleString() } }
    ]
    static name = "Author"
}