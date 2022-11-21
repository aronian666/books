import ActiveRecord from "./ActiveRecord"
import Book from "./Book"
import Student from './Student'

export default class Lend extends ActiveRecord {
    static properties = "_id student {name last _id} book {_id name} createdAt returnDate status message returnDay"
    constructor({ _id, book = {}, student = {}, returnDate, createdAt, message = "", status, returnDay } = {}) {
        super(Lend)
        this._id = _id
        this.book = new Book(book)
        this.student = new Student(student)
        this.returnDate = returnDate && new Date(Number(returnDate))
        this.createdAt = createdAt && new Date(Number(createdAt))
        this.returnDay = returnDay && new Date(Number(returnDay))
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
    static tables = {
        large: [
            { sort: "book.name", name: "Libro", key: "book", path(o) { return `/books/${o.book._id}` }, transform({ name }) { return name }, className: "name" },
            { sort: "student.name", name: "Estudiante", path(o) { return `/students/${o.student._id}` }, key: "student", transform(student) { return student.fullName } },
            { sort: "createdAt", key: "createdAt", name: "Creado", transform(date) { return date.toLocaleString() } },
            { name: "Dias faltantes", key: "difference", transform(day) { return `${day} dias` } },
            { name: "Fecha de entrega", key: "returnDate", transform(date) { return date.toDateString() } }
        ],
        returned: [
            { sort: "book.name", name: "Libro", key: "book", path(o) { return `/books/${o.book._id}` }, transform({ name }) { return name }, className: "name" },
            { sort: "student.name", name: "Estudiante", path(o) { return `/students/${o.student._id}` }, key: "student", transform(student) { return student.fullName } },
            { sort: "createdAt", key: "createdAt", name: "Creado", transform(date) { return date.toLocaleString() } },
            { name: "Fecha de retorno", key: "returnDay", transform(date) { return date.toLocaleString() } },
        ],
    }
    static exact = [
        {
            name: "Estado", options: [
                { name: "Devuelto", value: "Devuelto", table: "returned" },
                { name: "Prestado", value: "Prestado", table: "large" }
            ], key: "status", value: "Prestado"
        }
    ]
    static name = "Lend"
}