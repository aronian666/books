import ActiveRecord from './ActiveRecord'
export default class Student extends ActiveRecord {
    constructor({ _id, name = "", nivel, last = "", grade, createdAt }) {
        super(Student)
        this._id = _id
        this.name = name
        this.last = last
        this.grade = grade
        this.nivel = nivel
        this.createdAt = createdAt && new Date(Number(createdAt))
    }
    get nivelString() {
        return Student.nivels[this.nivel]
    }
    static properties = "_id name last nivel grade createdAt"
    static modifiers = [
        { property: "name", name: "Nombres", type: "text", required: true },
        { property: "last", name: "Apellidos", type: "text", required: true },
        { property: "nivel", name: "Nivel", type: "select", collection: "nivels", required: true },
        { property: "grade", name: "Grado", type: "number", required: true },
    ]
    static sort = {
        name: "name",
        last: "last",
        nivel: "nivel",
        grade: "grade",
    }
    static table = [
        { name: "Nombres", property: "name" },
        { name: "Apellidos", property: "last" },
        { name: "Nivel", property: "nivelString" },
        { name: "Grado", property: "grade" },
        { name: "Creacion", property: "createdAt", transform(c) { return c.toLocaleString() } }
    ]

    static nivels = ["Primaria", "Secundaria"]
    static getResourses() { return { nivels: [{ name: "Primaria", _id: 0 }, { name: "Secundaria", _id: 1 }] } }
    static disabled = ["student_id"]
    static name = "Student"
}