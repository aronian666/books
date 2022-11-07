export default class ActiveRecord {
    static async save(object, replace = false) {
        const name = this.name.toLowerCase()
        const data = await this.request(`mutation($${name}: ${this.name}Input!) {
            create${this.name}(${name}: $${name}) {
                ${this.properties}
            }
        }`, { [name]: replace ? object : this.modifyProperties(object) })
        return new this(data[`create${this.name}`])
    }
    static modifyProperties(object) {
        return this.modifiers.reduce((a, b) => {
            let property = b.property
            if (/_id/.test(property)) property = property.replace(/_id/, "")
            a[property] = object[b.property]
            return a
        }, { _id: object._id })
    }
    static find(filter = {}, exact = []) {
        const body = `query($filter: Filter, $exact: [Exact]){
            ${this.name.toLowerCase()}s(filter: $filter, exact: $exact) {
                count
                results {
                    ${this.properties}
                }
            }
        }`
        return this.request(body, { filter, exact })
    }
    static async findById(_id) {
        const data = await this.request(`query($id: ID!) {
            ${this.name.toLowerCase()}(_id: $id) {
                ${this.properties}
            }
        }`, { id: _id })
        return new this(data[this.name.toLowerCase()])
    }
    static del(id) {
        return this.request(`mutation($id: ID!){
            delete${this.name}(_id: $id)
        }`, { id })
    }
    static async request(query, variables = {}) {
        console.log(query)
        const response = await fetch(`https://booksapi-eight.vercel.app/`, {
            method: "post",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({ query, variables })
        })
        const data = await response.json()
        return data.data
    }
    static getResourses() {
        return {}
    }
}