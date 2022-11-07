import ActiveRecord from "./ActiveRecord";

export default class Message extends ActiveRecord {
    constructor({ _id, body = "", createdAt, status }) {
        super()
        this._id = _id
        this.body = body
        this.createdAt = createdAt
        this.status = status
    }
    static properties = "_id body createdAt status"
    static modifiers = [
        { name: "Mensaje", property: "body", type: "text" },
        { name: "Estado", property: "status", type: "select", collection: "statuses" },
    ]
    static getResourses() {
        return { statuses: [{ name: "Prestado", _id: 0 }, { name: "Devuelto", _id: 1 }] }
    }
}