import ActiveRecord from "./ActiveRecord";
import Author from "./Author";
import Category from "./Category";
import Editorial from "./Editorial";
import Lend from './Lend'

export default class Book extends ActiveRecord {
    constructor({ _id, name = "", count = 0, image, author = {}, category = {}, position = 1, editorial = {}, createdAt, status, isbn } = {}) {
        super(Book);
        this._id = _id
        this.name = name;
        this.count = count;
        this.author = new Author(author);
        this.category = new Category(category);
        this.editorial = new Editorial(editorial)
        this.createdAt = createdAt && new Date(Number(createdAt));
        this.status = status
        this.position = position
        this.isbn = isbn
        this.image = image
    }
    static properties = "_id name count image createdAt status position editorial {_id name} category {_id name} author {_id name}"
    form = [
        { name: "Nombre del libro", key: "name" },
        { name: "Autor", key: "author" },
        { name: "Categoria", key: "category" },
        { name: "Editorial", key: "editorial" },
        { name: "Ubicacion", key: "position", type: "number" },
        { name: "Cantidad", key: "count", type: "number" }
    ]
    static table = [
        { name: "Nombre", key: "name", sort: "name", path(book) { return `/books/${book._id}` }, className: "name" },
        { name: "Autor", key: "author", sort: "author.name", path(book) { return `/authors/${book.author._id}` }, transform: (author) => author.name },
        { name: "Categoria", key: "category", sort: "category.name", path(book) { return `/categorys/${book.category._id}` }, transform: (category) => category.name },
        { name: "Editorial", key: "editorial", sort: "editorial.name", path(book) { return `/editorials/${book.editorial._id}` }, transform: (editorial) => editorial.name },
        { name: "Cantidad", key: "count", sort: "count" },
        { name: "Ubicacion", key: "position", sort: "position" },
        { name: "Creacion", key: "createdAt", sort: "createdAt", transform: (createdAt) => createdAt.toLocaleString() },
        { name: "Estado", key: "status", sort: "status", className(o) { return o.statusClass } }
    ]
    static async export() {
        const { books } = await this.find({ limit: 10000 })
        const results = books.results.map(i => new this(i))
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += this.table.map(i => i.name).join(",") + "\r\n";
        results.forEach((rowArray) => {
            let row = this.table.map(({ transform, key }) => {
                if (transform) return `"${transform(rowArray[key])}"`
                return `"${rowArray[key]}"`
            })
            csvContent += row.join(",") + "\r\n";
        });
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", this.name + "s.csv");
        document.body.appendChild(link); // Required for FF
        link.click(); // This will download the data file named "my_data.csv".
        link.remove()
    }
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
                { name: "Todos", value: "", table: "table" },
                { name: "Disponible", value: "Disponible", table: "table" },
                { name: "Agotado", value: "Agotado", table: "table" }
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
    static async saveByIsbn(book) {
        const data = await this.request(`
            mutation($book: IsbnInput!) {
                createByIsbn(book: $book) {
                    _id
                    name
                    count
                }
            }
        `, { book })
        return new this(Object.values(data)[0])
    }
}