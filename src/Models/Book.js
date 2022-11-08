import ActiveRecord from "./ActiveRecord";
import Author from "./Author";
import Category from "./Category";
import Editorial from "./Editorial";
export default class Book extends ActiveRecord {
    static properties = "_id name count editorial {_id name} category {_id name} author {_id name} createdAt status"
    static modifiers = [
        { property: "name", name: "Nombre", type: "text", required: true },
        { property: "author_id", name: "Autor", type: "select", collection: "authors", required: true },
        { property: "category_id", name: "Categoria", type: "select", collection: "categorys", required: true },
        { property: "count", name: "Cantidad", type: "number", min: 0, required: true },
        { property: "editorial_id", name: "Editorial", type: "select", collection: "editorials", required: true }
    ]
    static sort = {
        name: "name",
        author: "author.name",
        category: "category.name",
        editorial: "editorial.name",
        count: "count",
        status: "status"
    }
    static table = [
        { name: "Nombre", property: "name" },
        { name: "Autor", property: "author", transform: (author) => author.name },
        { name: "Categoria", property: "category", transform: (category) => category.name },
        { name: "Editorial", property: "editorial", transform: (editorial) => editorial.name },
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
        const [authors, categorys, editorials] = await Promise.all([Author.find({ limit: 1000 }), Category.find({ limit: 1000 }), Editorial.find({ limit: 1000 })])
        return { authors: authors.authors.results, categorys: categorys.categorys.results, editorials: editorials.editorials.results }
    }
    static disabled = ["book_id"]
    constructor({ _id, name = "", count = 0, editorial = {}, author = {}, category = {}, createdAt, status } = {}) {
        super(Book);
        this._id = _id
        this.name = name;
        this.count = count;
        this.author = new Author(author);
        this.category = new Category(category);
        this.editorial = new Editorial(editorial)
        this.category_id = category._id;
        this.author_id = author._id;
        this.editorial_id = editorial._id
        this.createdAt = createdAt && new Date(Number(createdAt));
        this.status = status
    }
    get statusClass() {
        if (this.status === "Disponible") return "available"
        return "spent"
    }
    static name = "Book"
}