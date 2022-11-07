import ActiveRecord from './ActiveRecord'
export default class Student extends ActiveRecord {
    constructor({ _id, name = "", nivel = 0, last = "", grade, createdAt }) {
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
        { property: "name", name: "Nombres", type: "text" },
        { property: "last", name: "Apellidos", type: "text" },
        { property: "nivel", name: "Nivel", type: "select", collection: "nivels" },
        { property: "grade", name: "Grado", type: "number" },
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
        { name: "Nivel", property: "nivel" },
        { name: "Grado", property: "grade" },
        { name: "Creacion", property: "createdAt", transform(c) { return c.toLocaleString() } }
    ]

    static nivels = ["Primaria", "Secundaria"]
    static getResourses() { return { nivels: [{ name: "Primaria", _id: 0 }, { name: "Secundaria", _id: 1 }] } }
    static disabled = ["student_id"]
}