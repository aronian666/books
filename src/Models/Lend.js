import ActiveRecord from "./ActiveRecord"
import Book from "./Book"
import Student from './Student'

export default class Lend extends ActiveRecord {
    #book_id
    #student_id
    static properties = "_id student {name _id} book {_id name} createdAt returnDate status message"
    constructor({ _id, book = {}, student = {}, returnDate, createdAt, message = "", status }) {
        super(Lend)
        this._id = _id
        this.book = new Book(book)
        this.student = new Student(student)
        this.returnDate = returnDate && new Date(Number(returnDate))
        this.createdAt = createdAt && new Date(Number(createdAt))
        this.message = message
        this.student_id = student._id
        this.book_id = book._id
        this.status = status
    }
    get book_id() { return this.#book_id }
    set book_id(book_id) { this.#book_id = book_id }
    get student_id() { return this.#student_id }
    set student_id(student_id) { this.#student_id = student_id }
    get difference() {
        const difference = this.returnDate.getTime() - Date.now()
        return Math.round(difference / 86400000)
    }
    static modifiers = [
        { name: "Libro", property: "book_id", type: "select", collection: "books" },
        { name: "Estudiante", property: "student_id", type: "select", collection: "students" },
        { name: "Fecha de retorno", property: "returnDate", type: "date" }
    ]
    static sort = {
        createdAt: "createdAt",
        book: "book.name",
        student: "student.name",
        returnDate: "returnDate"
    }
    static table = [
        { name: "Libro", property: "book" },
        { name: "Estudiante", property: "student" },
        { name: "Inicio", property: "createdAt" },
        { name: "Devolucion", property: "returnDate" },
        { name: "Dias faltantes" },
        { name: "Estado", property: "status" },
        { name: "Acciones" }
    ]
    static async getResourses() {
        const [books, students] = await Promise.all([Book.find({ limit: 1000 }, [{ name: "status", value: "Disponible" }]), Student.find({ limit: 1000 })])
        return { books: books.books.results, students: students.students.results }
    }
    get statusClass() {
        if (this.status === "Prestado") return "lend"
        if (this.status === "Devuelto") return "back"
        return ""
    }
}