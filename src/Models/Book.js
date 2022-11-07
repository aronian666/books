import ActiveRecord from "./ActiveRecord";
import Author from "./Author";
import Category from "./Category";
export default class Book extends ActiveRecord {
    #category_id
    #author_id
    static properties = "_id name count category {_id name} author {_id name} createdAt status"
    static modifiers = [
        { property: "name", name: "Nombre", type: "text", required: true },
        { property: "author_id", name: "Autor", type: "select", collection: "authors", required: true },
        { property: "category_id", name: "Categoria", type: "select", collection: "categorys", required: true },
        { property: "count", name: "Cantidad", type: "number", min: 0, required: true }
    ]
    static sort = {
        name: "name",
        author: "author.name",
        category: "category.name",
        count: "count",
        createdAt: "createdAt",
        status: "status"
    }
    static table = [
        { name: "Nombre", property: "name" },
        { name: "Autor", property: "author", transform: (author) => author.name },
        { name: "Categoria", property: "category", transform: (category) => category.name },
        { name: "Cantidad", property: "count" },
        { name: "Creacion", property: "createdAt", transform: (createdAt) => createdAt.toLocaleString() },
        {
            name: "Estado", property: "status", getStyle(status) {
                if (status === "Disponible") return "color: green; font-weight: 600"
                return "color: tomato; font-weight: 600"
            }
        }
    ]
    static exact = []
    static async getResourses() {
        const [authors, categorys] = await Promise.all([Author.find(), Category.find()])
        return { authors: authors.authors.results, categorys: categorys.categorys.results }
    }
    static disabled = ["book_id"]
    constructor({ _id, name = "", count = 0, author = {}, category = {}, createdAt, status } = {}) {
        super(Book);
        this._id = _id
        this.name = name;
        this.count = count;
        this.author = new Author(author);
        this.category = new Category(category);
        this.category_id = category._id;
        this.author_id = author._id;
        this.createdAt = createdAt && new Date(Number(createdAt));
        this.status = status
    }
    get category_id() { return this.#category_id }
    set category_id(category_id) { this.#category_id = category_id }
    get author_id() { return this.#author_id }
    set author_id(author_id) { this.#author_id = author_id }
    get statusClass() {
        if (this.status === "Disponible") return "available"
        return "spent"
    }
    static name = "Book"
}