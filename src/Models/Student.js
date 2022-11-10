import ActiveRecord from './ActiveRecord'
import Lend from './Lend'
export default class Student extends ActiveRecord {
    constructor({ _id, name = "", nivel = "Primaria", last = "", grade = 1, createdAt } = {}) {
        super(Student)
        this._id = _id
        this.name = name
        this.last = last
        this.grade = grade
        this.nivel = nivel
        this.createdAt = createdAt && new Date(Number(createdAt))
    }
    static properties = "_id name last nivel grade createdAt"
    get fullName() {
        return this.name + " " + this.last
    }
    get children() {
        return {
            model: Lend,
            exact: [{ name: "student._id", value: this._id }],
            title: "Prestamos"
        }
    }
    form = [
        { key: "name", name: "Nombres" },
        { key: "last", name: "Apellidos", required: true },
        { key: "nivel", name: "Nivel", required: true, options: ["Primaria", "Secundaria"] },
        { key: "grade", name: "Grado", required: true, type: "number" },
    ]
    static table = [
        { sort: "name", name: "Nombres", key: "name", path(object) { return `/students/${object._id}` }, className: "name" },
        { name: "Apellidos", key: "last", sort: "last" },
        { name: "Nivel", key: "nivel", sort: "nivel" },
        { name: "Grado", key: "grade", sort: "grade" },
        { name: "Creacion", key: "createdAt", sort: "createdAt", transform(c) { return c.toLocaleString() } }
    ]
    static nivels = ["Primaria", "Secundaria"]
    static getResourses() { return { nivels: [{ name: "Primaria", _id: 0 }, { name: "Secundaria", _id: 1 }] } }

    static name = "Student"
}