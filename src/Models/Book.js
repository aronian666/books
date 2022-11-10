import ActiveRecord from "./ActiveRecord";
import Author from "./Author";
import Category from "./Category";
import Editorial from "./Editorial";
import Lend from './Lend'
export default class Book extends ActiveRecord {
    constructor({ _id, name = "", count = 0, author = {}, category = {}, editorial = {}, createdAt, status } = {}) {
        super(Book);
        this._id = _id
        this.name = name;
        this.count = count;
        this.author = new Author(author);
        this.category = new Category(category);
        this.editorial = new Editorial(editorial)
        this.createdAt = createdAt && new Date(Number(createdAt));
        this.status = status
    }

    static properties = "_id name count editorial {_id name} category {_id name} author {_id name} createdAt status"
    form = [
        { name: "Nombre del libro", key: "name" },
        { name: "Autor", key: "author" },
        { name: "Categoria", key: "category" },
        { name: "Editorial", key: "editorial" },
        { name: "Cantidad", key: "count", type: "number" }
    ]
    static table = [
        { name: "Nombre", key: "name", sort: "name", path(book) { return `/books/${book._id}` }, className: "name" },
        { name: "Autor", key: "author", sort: "author.name", path(book) { return `/authors/${book.author._id}` }, transform: (author) => author.name },
        { name: "Categoria", key: "category", sort: "category.name", path(book) { return `/categorys/${book.category._id}` }, transform: (category) => category.name },
        { name: "Editorial", key: "editorial", sort: "editorial.name", path(book) { return `/editorials/${book.editorial._id}` }, transform: (editorial) => editorial.name },
        { name: "Cantidad", key: "count", sort: "count" },
        { name: "Creacion", key: "createdAt", sort: "createdAt", transform: (createdAt) => createdAt.toLocaleString() },
        { name: "Estado", key: "status", sort: "status", className(o) { return o.statusClass } }
    ]
    get statusClass() {
        if (this.status === "Disponible") return "bold available"
        return "bold spent"
    }
    get children() {
        return {
            model: Lend,
            exact: [{ name: "book._id", value: this._id }],
            title: "Prestamos"
        }
    }
    static exact = [
        {
            name: "Estado", options: [
                { name: "Todos", value: "" },
                { name: "Disponible", value: "Disponible" },
                { name: "Agotado", value: "Agotado" }
            ], key: "status", value: ""
        }
    ]
    static name = "Book"
    static async recommendations() {
        const algo = await this.find({ limit: 1000 }, [{ name: "status", value: "Disponible" }])
        return Object.values(algo)[0].results
    }
    get disabled() {
        return this.count <= 0
    }
}