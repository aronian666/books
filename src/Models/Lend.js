import ActiveRecord from "./ActiveRecord"
import Book from "./Book"
import Student from './Student'

export default class Lend extends ActiveRecord {
    static properties = "_id student {name last _id} book {_id name} createdAt returnDate status message"
    constructor({ _id, book = {}, student = {}, returnDate, createdAt, message = "", status } = {}) {
        super(Lend)
        this._id = _id
        this.book = new Book(book)
        this.student = new Student(student)
        this.returnDate = returnDate && new Date(Number(returnDate))
        this.createdAt = createdAt && new Date(Number(createdAt))
        this.message = message
        this.status = status
    }
    get difference() {
        const difference = this.returnDate.getTime() - Date.now()
        return Math.round(difference / 86400000)
    }
    form = [
        { name: "Libro", key: "book", required: true, extend: false, exact: true },
        { name: "Estudiante", key: "student", required: true },
        { name: "Fecha de retorno", key: "returnDate", required: true, type: "date" }
    ]
    static table = [
        { sort: "book.name", name: "Libro", key: "book", path(o) { return `/books/${o.book._id}` }, transform({ name }) { return name }, className: "name" },
        { sort: "student.name", name: "Estudiante", path(o) { return `/students/${o.student._id}` }, key: "student", transform(student) { return student.fullName } },
        { name: "Dias faltantes", key: "difference", transform(day) { return `${day} dias` } },
    ]
    static studentTable = [
        { sort: "book.name", name: "Libro", path(o) { return `/books/${o.book._id}` }, key: "book", transform(book) { return book.name } },
        { name: "Restante", key: "difference", transform(day) { return `${day} dias` } },
    ]
    static shortTable = [
        { sort: "student.name", name: "Estudiante", path(o) { return `/students/${o.student._id}` }, key: "student", transform(student) { return student.fullName } },
        { name: "Restante", key: "difference", transform(day) { return `${day} dias` } },
    ]
    get statusClass() {
        if (this.status === "Prestado") return "bold lend"
        if (this.status === "Devuelto") return "bold back"
        return ""
    }
    static exact = [
        {
            name: "Estado", options: [
                { name: "Todos", value: "" },
                { name: "Devuelto", value: "Devuelto" },
                { name: "Prestado", value: "Prestado" }
            ], key: "status", value: "Prestado"
        }
    ]
    static name = "Lend"
}